export type VictimCategory = 
  | 'Perempuan Dewasa' 
  | 'Anak Perempuan' 
  | 'Anak Laki-Laki' 
  | 'Disabilitas';

export type ViolenceType = 
  | 'Kekerasan Fisik'
  | 'Kekerasan Psikis'
  | 'Kekerasan Seksual'
  | 'Penelantaran Rumah Tangga'
  | 'TPPO / Perdagangan Orang'
  | 'Kekerasan Berbasis Gender Online (KBGO)'
  | 'Eksploitasi Ekonomi'
  | 'Lainnya (Hak Asuh / Pernikahan Anak)';

export type CaseStatus = 
  | 'Pengaduan Masuk'
  | 'Asesmen & Penjangkauan'
  | 'Pendampingan Berjalan'
  | 'Reintegrasi / Pemulihan'
  | 'Selesai / Ditutup';

export type DistrictNagekeo = 
  | 'Aesesa'
  | 'Aesesa Selatan'
  | 'Wolowae'
  | 'Boawae'
  | 'Mauponggo'
  | 'Nangaroro'
  | 'Keo Tengah';

export type PerpetratorRelationship =
  | 'Suami / Mantan Suami'
  | 'Istri'
  | 'Orang Tua / Ayah Kandung'
  | 'Ayah Tiri / Ibu Tiri'
  | 'Keluarga / Kerabat / Paman'
  | 'Tetangga'
  | 'Teman Sebaya / Pacar'
  | 'Guru / Tenaga Pendidik'
  | 'Majikan / Rekan Kerja'
  | 'Tidak Dikenal'
  | 'Lainnya';

export interface ProgressNote {
  id: string;
  date: string;
  officerName: string;
  serviceType: 'Penerimaan' | 'Asesmen' | 'Medis/Visum' | 'Hukum/BAP' | 'Psikologis' | 'Shelter' | 'Mediasi' | 'Terminasi';
  description: string;
  notes?: string;
}

export interface ServiceReferral {
  id: string;
  date: string;
  targetAgency: string; // e.g., 'RSUD Aeramo Nagekeo', 'Unit PPA Satreskrim Polres Nagekeo', 'Puskesmas Danga'
  serviceType: string;
  status: 'Diajukan' | 'Dalam Proses' | 'Selesai Dampingi';
  contactPerson?: string;
  notes?: string;
}

export interface CaseRecord {
  id: string;
  registrationNumber: string; // e.g., 'REG/PPA-NGK/2026/03/014'
  reportedDate: string; // YYYY-MM-DD
  incidentDate: string; // YYYY-MM-DD
  status: CaseStatus;

  // Pelapor
  reporter: {
    name: string;
    relationshipWithVictim: string;
    phone: string;
    channel: 'Datang Langsung ke Kantor' | 'Hotline / WhatsApp' | 'Rujukan Polsek / Polres' | 'Laporan Desa/Kelurahan' | 'Rujukan Puskesmas/RSUD';
    address: string;
  };

  // Korban
  victim: {
    fullName: string;
    initials: string;
    nik: string;
    age: number;
    gender: 'Perempuan' | 'Laki-laki';
    category: VictimCategory;
    hasDisability: boolean;
    disabilityType?: string;
    education: 'Tidak Sekolah' | 'SD / Sederajat' | 'SMP / Sederajat' | 'SMA / Sederajat' | 'Diploma / Sarjana';
    occupation: string;
    maritalStatus: 'Belum Kawin' | 'Kawin' | 'Cerai Hidup' | 'Cerai Mati';
    phone?: string;
    addressStreet: string;
    village: string; // Desa / Kelurahan
    district: DistrictNagekeo;
  };

  // Terlapor / Pelaku
  perpetrator: {
    fullName: string;
    initials: string;
    age?: number;
    gender: 'Laki-laki' | 'Perempuan';
    relationship: PerpetratorRelationship;
    occupation?: string;
    district?: DistrictNagekeo;
    address?: string;
    statusLegal?: 'Dalam Penyelidikan' | 'Tersangka' | 'Ditahan di Rutan' | 'Diversi / Restorative Justice' | 'Vonis Pengadilan' | 'Belum Dilaporkan ke Polisi';
  };

  // Rincian Kasus
  incident: {
    primaryType: ViolenceType;
    secondaryTypes: ViolenceType[];
    locationType: 'Rumah Tangga' | 'Lingkungan Sekolah' | 'Tempat Kerja' | 'Fasilitas Umum / Terbuka' | 'Daring / Online';
    locationDetail: string;
    chronology: string;
  };

  // Penanganan & Rujukan
  caseManager: string; // Petugas pendamping
  requiredServices: string[]; // ['Bantuan Hukum', 'Visum et Repertum', 'Konseling Psikososial', 'Rumah Aman']
  progressLogs: ProgressNote[];
  referrals: ServiceReferral[];

  createdAt: string;
  updatedAt: string;
}

export interface CaseFilterState {
  searchQuery: string;
  district: string;
  status: string;
  primaryType: string;
  victimCategory: string;
  year: string;
  month: string;
}
