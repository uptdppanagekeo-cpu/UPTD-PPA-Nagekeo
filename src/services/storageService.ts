import { CaseRecord, ProgressNote, ServiceReferral } from '../types/case';
import { INITIAL_CASES } from '../data/initialData';

const STORAGE_KEY = 'sippa_nagekeo_cases_v1';

export const storageService = {
  getCases(): CaseRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CASES));
        return INITIAL_CASES;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Gagal membaca data kasus dari storage', e);
      return INITIAL_CASES;
    }
  },

  saveCases(cases: CaseRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    } catch (e) {
      console.error('Gagal menyimpan data kasus ke storage', e);
    }
  },

  createCase(newCase: CaseRecord): CaseRecord[] {
    const cases = this.getCases();
    const updated = [newCase, ...cases];
    this.saveCases(updated);
    return updated;
  },

  updateCase(updatedCase: CaseRecord): CaseRecord[] {
    const cases = this.getCases();
    const updated = cases.map((c) => (c.id === updatedCase.id ? updatedCase : c));
    this.saveCases(updated);
    return updated;
  },

  deleteCase(id: string): CaseRecord[] {
    const cases = this.getCases();
    const updated = cases.filter((c) => c.id !== id);
    this.saveCases(updated);
    return updated;
  },

  addProgressLog(caseId: string, log: Omit<ProgressNote, 'id'>): CaseRecord[] {
    const cases = this.getCases();
    const updated = cases.map((c) => {
      if (c.id === caseId) {
        const newLog: ProgressNote = {
          ...log,
          id: `log-${Date.now()}`
        };
        return {
          ...c,
          progressLogs: [newLog, ...c.progressLogs],
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    });
    this.saveCases(updated);
    return updated;
  },

  addReferral(caseId: string, referral: Omit<ServiceReferral, 'id'>): CaseRecord[] {
    const cases = this.getCases();
    const updated = cases.map((c) => {
      if (c.id === caseId) {
        const newRef: ServiceReferral = {
          ...referral,
          id: `ref-${Date.now()}`
        };
        return {
          ...c,
          referrals: [newRef, ...c.referrals],
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    });
    this.saveCases(updated);
    return updated;
  },

  resetToDefault(): CaseRecord[] {
    this.saveCases(INITIAL_CASES);
    return INITIAL_CASES;
  },

  generateRegistrationNumber(existingCases: CaseRecord[]): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const countThisMonth = existingCases.filter((c) => {
      return c.registrationNumber.includes(`/${year}/${month}/`);
    }).length + 1;
    const serial = String(countThisMonth).padStart(3, '0');
    return `REG/PPA-NGK/${year}/${month}/${serial}`;
  },

  exportToCSV(cases: CaseRecord[], maskPrivacy = false): void {
    const headers = [
      'No. Registrasi',
      'Tanggal Lapor',
      'Status Penanganan',
      'Nama/Inisial Korban',
      'NIK Korban',
      'Usia Korban',
      'Jenis Kelamin',
      'Kategori Korban',
      'Disabilitas',
      'Kecamatan Korban',
      'Desa/Kelurahan Korban',
      'Bentuk Kekerasan Utama',
      'Hubungan Pelaku',
      'Nama/Inisial Pelaku',
      'Nama Pelapor',
      'Kanal Pengaduan',
      'Case Manager'
    ];

    const rows = cases.map((c) => [
      `"${c.registrationNumber}"`,
      `"${c.reportedDate}"`,
      `"${c.status}"`,
      `"${maskPrivacy ? c.victim.initials : c.victim.fullName}"`,
      `"${maskPrivacy ? '****************' : c.victim.nik}"`,
      c.victim.age,
      `"${c.victim.gender}"`,
      `"${c.victim.category}"`,
      `"${c.victim.hasDisability ? `Ya (${c.victim.disabilityType || 'Disabilitas'})` : 'Tidak'}"`,
      `"${c.victim.district}"`,
      `"${c.victim.village}"`,
      `"${c.incident.primaryType}"`,
      `"${c.perpetrator.relationship}"`,
      `"${maskPrivacy ? c.perpetrator.initials : c.perpetrator.fullName}"`,
      `"${maskPrivacy ? 'Pelapor Terlindungi' : c.reporter.name}"`,
      `"${c.reporter.channel}"`,
      `"${c.caseManager}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `Laporan_Kasus_PPA_Kab_Nagekeo_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportBackupJSON(cases: CaseRecord[]): void {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cases, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Backup_SIPPA_Nagekeo_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
};
