import { CaseRecord, DistrictNagekeo, ViolenceType, VictimCategory, CaseStatus, PerpetratorRelationship, OfficialsConfig, StaffMember } from '../types/case';
import { DISTRICTS_NAGEKEO } from '../data/initialData';

export interface ConnectedSpreadsheet {
  id: string;
  title: string;
  url: string;
  lastSyncedAt: string | null;
  sheetNames?: string[];
}

const STORAGE_KEY_CONNECTED_SHEET = 'sippa_nagekeo_connected_sheet_v1';

export const googleSheetsService = {
  // Local configuration for remembered sheet
  getConnectedSpreadsheet(): ConnectedSpreadsheet | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CONNECTED_SHEET);
      if (!data) return null;
      return JSON.parse(data) as ConnectedSpreadsheet;
    } catch {
      return null;
    }
  },

  saveConnectedSpreadsheet(sheet: ConnectedSpreadsheet | null): void {
    if (!sheet) {
      localStorage.removeItem(STORAGE_KEY_CONNECTED_SHEET);
    } else {
      localStorage.setItem(STORAGE_KEY_CONNECTED_SHEET, JSON.stringify(sheet));
    }
  },

  extractSpreadsheetId(input: string): string | null {
    const trimmed = input.trim();
    if (!trimmed) return null;
    // If it's a full Google Sheets URL
    const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      return match[1];
    }
    // If it's directly the ID (alphanumeric, dash, underscore, len > 15)
    if (/^[a-zA-Z0-9-_]{20,}$/.test(trimmed)) {
      return trimmed;
    }
    return null;
  },

  getSpreadsheetUrl(id: string): string {
    return `https://docs.google.com/spreadsheets/d/${id}/edit`;
  },

  // Fetch spreadsheet metadata
  async getSpreadsheetMetadata(token: string, spreadsheetId: string): Promise<{ title: string; sheets: string[] }> {
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=properties.title,sheets.properties.title`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gagal mengakses spreadsheet (${res.status})`);
    }

    const data = await res.json();
    const title = data.properties?.title || 'Spreadsheet Tanpa Judul';
    const sheets = (data.sheets || []).map((s: { properties?: { title?: string } }) => s.properties?.title || 'Sheet');
    return { title, sheets };
  },

  // Create a brand new Google Spreadsheet workbook for SIPPA Nagekeo
  async createSiPPAWorkbook(
    token: string,
    cases: CaseRecord[],
    officials: OfficialsConfig,
    staffList: StaffMember[],
    customTitle?: string
  ): Promise<ConnectedSpreadsheet> {
    const title = customTitle || `SIPPA Nagekeo - Data Kasus PPA (DINAS PMDP3A ${new Date().getFullYear()})`;

    // Step 1: Create Spreadsheet with 3 Sheets
    const createPayload = {
      properties: {
        title: title,
        locale: 'id_ID',
        timeZone: 'Asia/Makassar'
      },
      sheets: [
        {
          properties: {
            title: 'Register_Kasus',
            gridProperties: {
              frozenRowCount: 1
            }
          }
        },
        {
          properties: {
            title: 'Rekap_Kecamatan',
            gridProperties: {
              frozenRowCount: 1
            }
          }
        },
        {
          properties: {
            title: 'Data_Pegawai_Pejabat',
            gridProperties: {
              frozenRowCount: 1
            }
          }
        }
      ]
    };

    const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(createPayload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gagal membuat spreadsheet baru (${res.status})`);
    }

    const created = await res.json();
    const spreadsheetId = created.spreadsheetId;
    const url = created.spreadsheetUrl || this.getSpreadsheetUrl(spreadsheetId);

    // Step 2: Populate Data to Sheets
    await this.syncAllDataToSpreadsheet(token, spreadsheetId, cases, officials, staffList);

    const connected: ConnectedSpreadsheet = {
      id: spreadsheetId,
      title: title,
      url: url,
      lastSyncedAt: new Date().toISOString(),
      sheetNames: ['Register_Kasus', 'Rekap_Kecamatan', 'Data_Pegawai_Pejabat']
    };

    this.saveConnectedSpreadsheet(connected);
    return connected;
  },

  // Sync / Push all data to Google Spreadsheet
  async syncAllDataToSpreadsheet(
    token: string,
    spreadsheetId: string,
    cases: CaseRecord[],
    officials: OfficialsConfig,
    staffList: StaffMember[]
  ): Promise<{ updatedCells: number }> {
    // 1. Prepare Register_Kasus rows
    const registerHeaders = [
      'No',
      'No. Registrasi',
      'Tanggal Lapor',
      'Tanggal Kejadian',
      'Status Kasus',
      'Bentuk Kekerasan',
      'Kategori Korban',
      'Inisial Korban',
      'Nama Lengkap Korban',
      'NIK Korban',
      'Usia',
      'Jenis Kelamin',
      'Disabilitas',
      'Pendidikan',
      'Pekerjaan',
      'Kecamatan Korban',
      'Desa / Kelurahan',
      'Alamat Jalan',
      'Hubungan Pelaku',
      'Nama Terlapor/Pelaku',
      'Usia Pelaku',
      'Petugas Pendamping Utama',
      'Saluran Pengaduan',
      'Nama Pelapor',
      'No. HP Pelapor',
      'Jumlah Catatan Progres',
      'Jumlah Rujukan Layanan',
      'Ringkasan Kronologi'
    ];

    const registerRows = cases.map((c, idx) => [
      idx + 1,
      c.registrationNumber,
      c.reportedDate,
      c.incidentDate,
      c.status,
      c.incident.primaryType,
      c.victim.category,
      c.victim.initials,
      c.victim.fullName,
      `'${c.victim.nik}`, // prevent excel/sheets from truncating leading zeros
      c.victim.age,
      c.victim.gender,
      c.victim.hasDisability ? `Ya (${c.victim.disabilityType || 'Penyandang Disabilitas'})` : 'Tidak',
      c.victim.education,
      c.victim.occupation,
      c.victim.district,
      c.victim.village,
      c.victim.addressStreet,
      c.perpetrator.relationship,
      c.perpetrator.fullName || c.perpetrator.initials || 'Terlapor',
      c.perpetrator.age || '-',
      typeof c.caseManager === 'string' ? c.caseManager : 'Tim UPTD PPA',
      c.reporter.channel,
      c.reporter.name,
      c.reporter.phone,
      c.progressLogs?.length || 0,
      c.referrals?.length || 0,
      c.incident.chronology?.substring(0, 500) || '-'
    ]);

    // 2. Prepare Rekap_Kecamatan rows
    const rekapHeaders = [
      'No',
      'Kecamatan (Kab. Nagekeo)',
      'Total Kasus',
      'Korban Anak',
      'Perempuan Dewasa',
      'Disabilitas',
      'Kekerasan Seksual',
      'Kekerasan Fisik',
      'Kekerasan Psikis',
      'Penelantaran RT',
      'TPPO',
      'KBGO',
      'Eksploitasi',
      'Lainnya'
    ];

    const rekapRows = DISTRICTS_NAGEKEO.map((dist, idx) => {
      const distCases = cases.filter(c => c.victim.district === dist.name);
      const anak = distCases.filter(c => c.victim.category === 'Anak Perempuan' || c.victim.category === 'Anak Laki-Laki').length;
      const dewasa = distCases.filter(c => c.victim.category === 'Perempuan Dewasa').length;
      const disabilitas = distCases.filter(c => c.victim.hasDisability || c.victim.category === 'Disabilitas').length;

      const seksual = distCases.filter(c => c.incident.primaryType === 'Kekerasan Seksual').length;
      const fisik = distCases.filter(c => c.incident.primaryType === 'Kekerasan Fisik').length;
      const psikis = distCases.filter(c => c.incident.primaryType === 'Kekerasan Psikis').length;
      const kdrtt = distCases.filter(c => c.incident.primaryType === 'Penelantaran Rumah Tangga').length;
      const tppo = distCases.filter(c => c.incident.primaryType === 'TPPO / Perdagangan Orang').length;
      const kbgo = distCases.filter(c => c.incident.primaryType === 'Kekerasan Berbasis Gender Online (KBGO)').length;
      const eksploitasi = distCases.filter(c => c.incident.primaryType === 'Eksploitasi Ekonomi').length;
      const lainnya = distCases.filter(c => c.incident.primaryType === 'Lainnya (Hak Asuh / Pernikahan Anak)').length;

      return [
        idx + 1,
        dist.name,
        distCases.length,
        anak,
        dewasa,
        disabilitas,
        seksual,
        fisik,
        psikis,
        kdrtt,
        tppo,
        kbgo,
        eksploitasi,
        lainnya
      ];
    });

    // Total row
    const totalRow = [
      '',
      'TOTAL KABUPATEN NAGEKEO',
      cases.length,
      cases.filter(c => c.victim.category === 'Anak Perempuan' || c.victim.category === 'Anak Laki-Laki').length,
      cases.filter(c => c.victim.category === 'Perempuan Dewasa').length,
      cases.filter(c => c.victim.hasDisability || c.victim.category === 'Disabilitas').length,
      cases.filter(c => c.incident.primaryType === 'Kekerasan Seksual').length,
      cases.filter(c => c.incident.primaryType === 'Kekerasan Fisik').length,
      cases.filter(c => c.incident.primaryType === 'Kekerasan Psikis').length,
      cases.filter(c => c.incident.primaryType === 'Penelantaran Rumah Tangga').length,
      cases.filter(c => c.incident.primaryType === 'TPPO / Perdagangan Orang').length,
      cases.filter(c => c.incident.primaryType === 'Kekerasan Berbasis Gender Online (KBGO)').length,
      cases.filter(c => c.incident.primaryType === 'Eksploitasi Ekonomi').length,
      cases.filter(c => c.incident.primaryType === 'Lainnya (Hak Asuh / Pernikahan Anak)').length
    ];

    // 3. Prepare Data_Pegawai_Pejabat rows
    const pegawaiHeaders = [
      'Kategori',
      'Jabatan / Posisi',
      'Nama Pejabat / Pegawai',
      'NIP',
      'Pangkat / Golongan',
      'No. Telepon / HP',
      'Email Dinas',
      'Status Keaktifan'
    ];

    const pegawaiRows = [
      [
        'Pejabat Struktural',
        officials.headOfDepartment.title,
        officials.headOfDepartment.name,
        `'${officials.headOfDepartment.nip}`,
        officials.headOfDepartment.rank,
        '-',
        '-',
        'Aktif'
      ],
      [
        'Pejabat Struktural',
        officials.headOfDivision.title,
        officials.headOfDivision.name,
        `'${officials.headOfDivision.nip}`,
        officials.headOfDivision.rank,
        '-',
        '-',
        'Aktif'
      ],
      [
        'Pejabat Struktural',
        officials.headOfUnit.title,
        officials.headOfUnit.name,
        `'${officials.headOfUnit.nip}`,
        officials.headOfUnit.rank,
        '-',
        '-',
        'Aktif'
      ],
      ...staffList.map(s => [
        'Petugas Pendamping UPTD PPA',
        s.role,
        s.name,
        `'${s.nip}`,
        '-',
        s.phone,
        s.email,
        s.isActive ? 'Aktif' : 'Tidak Aktif'
      ])
    ];

    // Check which sheets exist in the spreadsheet
    const metadata = await this.getSpreadsheetMetadata(token, spreadsheetId);
    const existingSheets = metadata.sheets;

    // Build batchUpdate data array
    const dataValues: Array<{ range: string; values: (string | number)[][] }> = [];

    // Target Register sheet name
    const registerSheetName = existingSheets.find(s => s.toLowerCase().includes('register') || s.toLowerCase().includes('kasus')) || existingSheets[0] || 'Sheet1';
    dataValues.push({
      range: `'${registerSheetName}'!A1:AB${registerRows.length + 1}`,
      values: [registerHeaders, ...registerRows]
    });

    // Target Rekap sheet name
    const rekapSheetName = existingSheets.find(s => s.toLowerCase().includes('rekap') || s.toLowerCase().includes('kecamatan'));
    if (rekapSheetName) {
      dataValues.push({
        range: `'${rekapSheetName}'!A1:N${rekapRows.length + 2}`,
        values: [rekapHeaders, ...rekapRows, totalRow]
      });
    }

    // Target Pegawai sheet name
    const pegawaiSheetName = existingSheets.find(s => s.toLowerCase().includes('pegawai') || s.toLowerCase().includes('pejabat') || s.toLowerCase().includes('staff'));
    if (pegawaiSheetName) {
      dataValues.push({
        range: `'${pegawaiSheetName}'!A1:H${pegawaiRows.length + 1}`,
        values: [pegawaiHeaders, ...pegawaiRows]
      });
    }

    // Batch update values
    const updateRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: dataValues
      })
    });

    if (!updateRes.ok) {
      const err = await updateRes.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gagal menyinkronkan data ke spreadsheet (${updateRes.status})`);
    }

    const updateResult = await updateRes.json();

    // Update last synced date in local storage
    const current = this.getConnectedSpreadsheet();
    if (current && current.id === spreadsheetId) {
      current.lastSyncedAt = new Date().toISOString();
      current.title = metadata.title;
      this.saveConnectedSpreadsheet(current);
    }

    return {
      updatedCells: updateResult.totalUpdatedCells || 0
    };
  },

  // Pull / Import cases from the spreadsheet into the dashboard
  async importCasesFromSpreadsheet(token: string, spreadsheetId: string): Promise<CaseRecord[]> {
    const metadata = await this.getSpreadsheetMetadata(token, spreadsheetId);
    const registerSheetName = metadata.sheets.find(s => s.toLowerCase().includes('register') || s.toLowerCase().includes('kasus')) || metadata.sheets[0] || 'Sheet1';

    const range = `'${registerSheetName}'!A1:AB1000`;
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gagal membaca sheet (${res.status})`);
    }

    const json = await res.json();
    const rows: string[][] = json.values || [];

    if (rows.length < 2) {
      return [];
    }

    // Header index mapping
    const headers = rows[0].map(h => (h || '').toString().trim().toLowerCase());
    const regNoIdx = headers.findIndex(h => h.includes('registrasi') || h.includes('reg'));
    const repDateIdx = headers.findIndex(h => h.includes('lapor'));
    const incDateIdx = headers.findIndex(h => h.includes('kejadian'));
    const statusIdx = headers.findIndex(h => h.includes('status'));
    const vTypeIdx = headers.findIndex(h => h.includes('bentuk') || h.includes('jenis kekerasan'));
    const catIdx = headers.findIndex(h => h.includes('kategori'));
    const initialsIdx = headers.findIndex(h => h.includes('inisial'));
    const fullNameIdx = headers.findIndex(h => h.includes('nama lengkap'));
    const nikIdx = headers.findIndex(h => h.includes('nik'));
    const ageIdx = headers.findIndex(h => h.includes('usia') || h.includes('umur'));
    const genderIdx = headers.findIndex(h => h.includes('kelamin'));
    const distIdx = headers.findIndex(h => h.includes('kecamatan'));
    const villageIdx = headers.findIndex(h => h.includes('desa') || h.includes('kelurahan'));
    const relIdx = headers.findIndex(h => h.includes('hubungan'));
    const perpNameIdx = headers.findIndex(h => h.includes('pelaku') || h.includes('terlapor'));
    const managerIdx = headers.findIndex(h => h.includes('pendamping'));
    const chronoIdx = headers.findIndex(h => h.includes('kronologi'));

    const importedCases: CaseRecord[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;

      const regNum = (regNoIdx !== -1 && row[regNoIdx]) ? row[regNoIdx].trim() : `REG/PPA-NGK/${new Date().getFullYear()}/${String(i).padStart(3, '0')}`;
      if (!regNum) continue;

      const repDate = (repDateIdx !== -1 && row[repDateIdx]) ? row[repDateIdx].trim() : new Date().toISOString().split('T')[0];
      const incDate = (incDateIdx !== -1 && row[incDateIdx]) ? row[incDateIdx].trim() : repDate;
      const status = (statusIdx !== -1 && row[statusIdx]) ? (row[statusIdx].trim() as CaseStatus) : 'Pengaduan Masuk';
      const vType = (vTypeIdx !== -1 && row[vTypeIdx]) ? (row[vTypeIdx].trim() as ViolenceType) : 'Kekerasan Psikis';
      const cat = (catIdx !== -1 && row[catIdx]) ? (row[catIdx].trim() as VictimCategory) : 'Perempuan Dewasa';
      const initials = (initialsIdx !== -1 && row[initialsIdx]) ? row[initialsIdx].trim() : 'NN';
      const fullName = (fullNameIdx !== -1 && row[fullNameIdx]) ? row[fullNameIdx].trim() : initials;
      const rawNik = (nikIdx !== -1 && row[nikIdx]) ? row[nikIdx].trim().replace(/^'/, '') : '5316010000000000';
      const age = (ageIdx !== -1 && row[ageIdx]) ? parseInt(row[ageIdx], 10) || 25 : 25;
      const gender = (genderIdx !== -1 && row[genderIdx]?.toLowerCase().includes('laki')) ? 'Laki-laki' : 'Perempuan';
      const district = (distIdx !== -1 && row[distIdx]) ? (row[distIdx].trim() as DistrictNagekeo) : 'Aesesa';
      const village = (villageIdx !== -1 && row[villageIdx]) ? row[villageIdx].trim() : 'Kel. Danga';
      const rel = (relIdx !== -1 && row[relIdx]) ? (row[relIdx].trim() as PerpetratorRelationship) : 'Lainnya';
      const perpName = (perpNameIdx !== -1 && row[perpNameIdx]) ? row[perpNameIdx].trim() : 'Terlapor';
      const caseManager = (managerIdx !== -1 && row[managerIdx]) ? row[managerIdx].trim() : 'Tim UPTD PPA';
      const chronology = (chronoIdx !== -1 && row[chronoIdx]) ? row[chronoIdx].trim() : 'Data diimpor dari Google Spreadsheet.';

      importedCases.push({
        id: `case-imported-${Date.now()}-${i}`,
        registrationNumber: regNum,
        reportedDate: repDate,
        incidentDate: incDate,
        status: status,
        reporter: {
          name: 'Pelapor Terdaftar',
          relationshipWithVictim: 'Keluarga',
          phone: '-',
          channel: 'Datang Langsung ke Kantor',
          address: `${village}, Kec. ${district}`
        },
        victim: {
          fullName: fullName,
          initials: initials,
          nik: rawNik,
          age: age,
          gender: gender,
          category: cat,
          hasDisability: cat === 'Disabilitas',
          education: 'SMA / Sederajat',
          occupation: 'Wiraswasta / Pelajar',
          maritalStatus: 'Kawin',
          addressStreet: `${village}, Kec. ${district}`,
          village: village,
          district: district
        },
        perpetrator: {
          fullName: perpName,
          initials: perpName.charAt(0) || 'T',
          relationship: rel,
          gender: 'Laki-laki',
          address: `${village}, Kec. ${district}`
        },
        incident: {
          primaryType: vType,
          secondaryTypes: [],
          locationType: 'Rumah Tangga',
          locationDetail: `${village}, Kec. ${district}`,
          chronology: chronology
        },
        caseManager: caseManager,
        requiredServices: ['Bantuan Hukum', 'Konseling Psikososial'],
        progressLogs: [
          {
            id: `prog-${Date.now()}-${i}`,
            date: repDate,
            officerName: caseManager,
            serviceType: 'Penerimaan',
            description: 'Kasus tercatat dan disinkronkan dari Google Spreadsheet.'
          }
        ],
        referrals: [],
        createdAt: repDate,
        updatedAt: repDate
      });
    }

    return importedCases;
  }
};
