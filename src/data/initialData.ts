import { CaseRecord, DistrictNagekeo, ViolenceType } from '../types/case';

export const DISTRICTS_NAGEKEO: {
  name: DistrictNagekeo;
  capitalOrCenter: string;
  villages: string[];
}[] = [
  {
    name: 'Aesesa',
    capitalOrCenter: 'Mbay (Pusat Pemerintahan Kab. Nagekeo)',
    villages: ['Kel. Danga', 'Kel. Mbay I', 'Kel. Towak', 'Kel. Lape', 'Desa Aeramo', 'Desa Marapokot', 'Desa Nangadhero', 'Desa Tendakinde', 'Desa Waekutu', 'Desa Tadakisa']
  },
  {
    name: 'Aesesa Selatan',
    capitalOrCenter: 'Jerebuu / Raja',
    villages: ['Desa Raja', 'Desa Raja Timur', 'Desa Raja Selatan', 'Desa Rendutoto', 'Desa Reraja', 'Desa Witu Romba', 'Desa Langedha']
  },
  {
    name: 'Wolowae',
    capitalOrCenter: 'Tendatoto',
    villages: ['Desa Tendatoto', 'Desa Anakoli', 'Desa Totomala', 'Desa Tendambepa', 'Desa Natatoto']
  },
  {
    name: 'Boawae',
    capitalOrCenter: 'Boawae',
    villages: ['Kel. Natanage', 'Desa Ratenggo', 'Desa Rigi', 'Desa Wolowea', 'Desa Gero', 'Desa Alorambas', 'Desa Mulakoli', 'Desa Wea Au', 'Desa Rega', 'Desa Olakile']
  },
  {
    name: 'Mauponggo',
    capitalOrCenter: 'Mauponggo',
    villages: ['Desa Mauponggo', 'Desa Keli', 'Desa Sawu', 'Desa Selalejo', 'Desa Bella', 'Desa Lokalaba', 'Desa Woloede', 'Desa Ua', 'Desa Wolotelu', 'Desa Jawapawa']
  },
  {
    name: 'Nangaroro',
    capitalOrCenter: 'Nangaroro',
    villages: ['Kel. Nangaroro', 'Desa Tonggo', 'Desa Woewutu', 'Desa Woedoa', 'Desa Degulolong', 'Desa Utetoto', 'Desa Bidoa', 'Desa Odaute']
  },
  {
    name: 'Keo Tengah',
    capitalOrCenter: 'Maunori',
    villages: ['Desa Maunori', 'Desa Udiworowatu', 'Desa Wajo', 'Desa Pautola', 'Desa Kotowuji Barat', 'Desa Kotowuji Timur', 'Desa Mbaenuamuri', 'Desa Keliwali']
  }
];

export const VIOLENCE_TYPES: ViolenceType[] = [
  'Kekerasan Fisik',
  'Kekerasan Psikis',
  'Kekerasan Seksual',
  'Penelantaran Rumah Tangga',
  'TPPO / Perdagangan Orang',
  'Kekerasan Berbasis Gender Online (KBGO)',
  'Eksploitasi Ekonomi',
  'Lainnya (Hak Asuh / Pernikahan Anak)'
];

export const CASE_MANAGERS = [
  { name: 'Maria P. S.Sos (Pekerja Sosial)', role: 'Case Manager & Asesor Utama', phone: '0813-3921-4411' },
  { name: 'Petrus N. S.H. (Advokat PPA)', role: 'Pendamping Hukum & Paralegal', phone: '0812-4688-2900' },
  { name: 'Yohana D. S.Psi (Konselor)', role: 'Konselor & Pemulihan Psikologis', phone: '0821-4509-1123' },
  { name: 'Fransiskus X. (Petugas Penjangkauan)', role: 'Tim Reaksi Cepat / Penjangkauan Lapangan', phone: '0852-3810-7798' }
];

export const INSTITUTION_INFO = {
  regency: 'Kabupaten Nagekeo',
  province: 'Nusa Tenggara Timur (NTT)',
  department: 'Dinas Sosial, Pemberdayaan Perempuan dan Perlindungan Anak',
  unit: 'Unit Pelaksana Teknis Daerah Perlindungan Perempuan dan Anak (UPTD PPA)',
  headOfUnit: 'Theresia M. Dapa, S.Sos., M.Si.',
  nipHead: '19780512 200501 2 008',
  headOfDepartment: 'Drs. Silvester Meo, M.M.',
  nipDepartmentHead: '19690315 199403 1 007',
  address: 'Kompleks Perkantoran Civic Center, Mbay, Kec. Aesesa, Kab. Nagekeo, NTT 86472',
  hotline: '0811-3829-129 / (0386) 21129',
  email: 'uptdppanagekeo@gmail.com',
  emergencyCall: '129 (SAPA KemenPPPA)'
};

export const PARTNER_AGENCIES = [
  {
    name: 'Unit PPA Satreskrim Polres Nagekeo',
    category: 'Aparat Penegak Hukum (APH)',
    location: 'Jl. Trans Flores, Kel. Danga, Aesesa, Nagekeo',
    phone: '0812-3899-7800',
    contactPerson: 'Kanit PPA Aipda Stefanus M.',
    services: ['Penyelidikan & Penyidikan Kasus PPA', 'Pembuatan Laporan Polisi (LP)', 'Pemeriksaan BAP Ramah Anak/Perempuan', 'Penahanan Tersangka']
  },
  {
    name: 'RSUD Aeramo Kabupaten Nagekeo',
    category: 'Fasilitas Kesehatan Rujukan',
    location: 'Desa Aeramo, Kec. Aesesa, Nagekeo',
    phone: '(0386) 22001',
    contactPerson: 'dr. Medis & Poli Visum / Ponek',
    services: ['Visum et Repertum Fisik & Psikis', 'Perawatan Medis Darurat IGD', 'Pemeriksaan Toksikologi / Kehamilan', 'Konsultasi Dokter Spesialis']
  },
  {
    name: 'Puskesmas Danga',
    category: 'Fasilitas Kesehatan Tingkat Pertama (FKTP)',
    location: 'Kelurahan Danga, Aesesa',
    phone: '0852-3901-4432',
    contactPerson: 'Bidan Koordinator PPA',
    services: ['Pertolongan Pertama Medis', 'Rujukan Visum Lanjutan', 'Pendampingan Kesehatan Ibu & Anak']
  },
  {
    name: 'Puskesmas Boawae',
    category: 'Fasilitas Kesehatan Tingkat Pertama (FKTP)',
    location: 'Jl. Lintas Ende-Bajawa, Boawae',
    phone: '0813-5321-7789',
    contactPerson: 'dr. Penanggung Jawab',
    services: ['Pemeriksaan Fisik Awal', 'Konseling Dasar Kesehatan Reproduksi', 'Koordinasi Rujukan UPTD']
  },
  {
    name: 'Lembaga Bantuan Hukum (LBH) Mitra Nagekeo',
    category: 'Bantuan Hukum & Advokasi',
    location: 'Mbay, Nagekeo',
    phone: '0812-4688-2900',
    contactPerson: 'Advokat Pendamping Pro-Bono',
    services: ['Pendampingan Sidang di Pengadilan Negeri Bajawa', 'Gugatan Hak Asuh & Restitusi Korban', 'Pemberian Saksi Ahli']
  },
  {
    name: 'Rumah Aman (Shelter) Kasih Bunda Nagekeo',
    category: 'Perlindungan Sementara',
    location: 'Lokasi Dirahasiakan demi Keamanan Korban',
    phone: '0811-3829-129 (Hotline UPTD)',
    contactPerson: 'Pengelola Shelter UPTD',
    services: ['Tempat Tinggal Darurat Terlindungi', 'Logistik dan Makanan Sehat', 'Pendampingan Rohani & Trauma Healing']
  }
];

export const INITIAL_CASES: CaseRecord[] = [
  {
    id: 'case-001',
    registrationNumber: 'REG/PPA-NGK/2026/03/001',
    reportedDate: '2026-03-04',
    incidentDate: '2026-03-02',
    status: 'Pendampingan Berjalan',
    reporter: {
      name: 'Elisabeth Wea',
      relationshipWithVictim: 'Bibi Kandung',
      phone: '0813-3928-1122',
      channel: 'Datang Langsung ke Kantor',
      address: 'RT 04 / RW 02, Desa Aeramo, Kec. Aesesa'
    },
    victim: {
      fullName: 'Theresia Adelina Nuwa',
      initials: 'TAN',
      nik: '5316015509120002',
      age: 14,
      gender: 'Perempuan',
      category: 'Anak Perempuan',
      hasDisability: false,
      education: 'SMP / Sederajat',
      occupation: 'Pelajar',
      maritalStatus: 'Belum Kawin',
      phone: '0812-3490-8811',
      addressStreet: 'Dusun III Aeramo Pantai',
      village: 'Desa Aeramo',
      district: 'Aesesa'
    },
    perpetrator: {
      fullName: 'Yohanes B. (Inisial YB)',
      initials: 'YB',
      age: 38,
      gender: 'Laki-laki',
      relationship: 'Tetangga',
      occupation: 'Petani / Wiraswasta',
      district: 'Aesesa',
      address: 'Desa Aeramo, Kec. Aesesa',
      statusLegal: 'Ditahan di Rutan'
    },
    incident: {
      primaryType: 'Kekerasan Seksual',
      secondaryTypes: ['Kekerasan Psikis'],
      locationType: 'Fasilitas Umum / Terbuka',
      locationDetail: 'Gudang belakang kebun desa Aeramo',
      chronology: 'Korban saat pulang dari kegiatan ekstrakurikuler sekolah dicegat terlapor dengan ancaman kekerasan, kemudian dibawa ke gudang kosong dan dipaksa melayani perbuatan asusila. Korban mengalami trauma mendalam dan baru berani menceritakan ke bibinya setelah terlapor mengancam berulang kali.'
    },
    caseManager: 'Maria P. S.Sos (Pekerja Sosial)',
    requiredServices: ['Visum et Repertum', 'Pendampingan Hukum APH', 'Konseling Psikologis Ramah Anak', 'Rumah Aman'],
    progressLogs: [
      {
        id: 'log-101',
        date: '2026-03-04',
        officerName: 'Maria P. S.Sos',
        serviceType: 'Penerimaan',
        description: 'Penerimaan pengaduan langsung dari pelapor dan korban di ruang konseling UPTD PPA Nagekeo. Dilakukan asesmen awal kondisi fisik dan psikologis.'
      },
      {
        id: 'log-102',
        date: '2026-03-04',
        officerName: 'Petrus N. S.H.',
        serviceType: 'Medis/Visum',
        description: 'Pengantaran korban ke RSUD Aeramo Nagekeo untuk pelaksanaan Visum et Repertum fisik dan luka memar. Hasil visum diserahkan ke penyidik.'
      },
      {
        id: 'log-103',
        date: '2026-03-06',
        officerName: 'Petrus N. S.H.',
        serviceType: 'Hukum/BAP',
        description: 'Pendampingan pembuatan Laporan Polisi (LP) di Unit PPA Satreskrim Polres Nagekeo dan pendampingan BAP korban ramah anak.'
      },
      {
        id: 'log-104',
        date: '2026-03-12',
        officerName: 'Yohana D. S.Psi',
        serviceType: 'Psikologis',
        description: 'Sesi konseling trauma healing kedua. Korban menunjukkan penurunan kecemasan, namun masih takut bertemu orang asing.'
      }
    ],
    referrals: [
      {
        id: 'ref-01',
        date: '2026-03-04',
        targetAgency: 'RSUD Aeramo Kabupaten Nagekeo',
        serviceType: 'Pemeriksaan Visum et Repertum',
        status: 'Selesai Dampingi',
        contactPerson: 'dr. Melki / Poli Kebidanan',
        notes: 'Hasil visum resmi terbit no: 445/VER/RSUD-AER/III/2026'
      },
      {
        id: 'ref-02',
        date: '2026-03-06',
        targetAgency: 'Unit PPA Satreskrim Polres Nagekeo',
        serviceType: 'Laporan Pidana & Pemeriksaan Pro-Justitia',
        status: 'Dalam Proses',
        contactPerson: 'Aipda Stefanus M.',
        notes: 'Terlapor telah diamankan dan berkas SPDP dikirim ke Kejari'
      }
    ],
    createdAt: '2026-03-04T09:30:00Z',
    updatedAt: '2026-03-12T14:15:00Z'
  },
  {
    id: 'case-002',
    registrationNumber: 'REG/PPA-NGK/2026/02/012',
    reportedDate: '2026-02-18',
    incidentDate: '2026-02-17',
    status: 'Pendampingan Berjalan',
    reporter: {
      name: 'Katarina Dhiu (Korban Langsung)',
      relationshipWithVictim: 'Diri Sendiri',
      phone: '0821-4412-9900',
      channel: 'Datang Langsung ke Kantor',
      address: 'RT 02, Desa Ratenggo, Kec. Boawae'
    },
    victim: {
      fullName: 'Katarina Dhiu',
      initials: 'KD',
      nik: '5316044810880001',
      age: 37,
      gender: 'Perempuan',
      category: 'Perempuan Dewasa',
      hasDisability: false,
      education: 'SMA / Sederajat',
      occupation: 'Ibu Rumah Tangga / Pengrajin Tenun',
      maritalStatus: 'Kawin',
      phone: '0821-4412-9900',
      addressStreet: 'Jalan Wolowea, Kampung Boawae Lama',
      village: 'Desa Ratenggo',
      district: 'Boawae'
    },
    perpetrator: {
      fullName: 'Donatus M. (Inisial DM)',
      initials: 'DM',
      age: 42,
      gender: 'Laki-laki',
      relationship: 'Suami / Mantan Suami',
      occupation: 'Buruh Bangunan',
      district: 'Boawae',
      address: 'Desa Ratenggo, Kec. Boawae',
      statusLegal: 'Dalam Penyelidikan'
    },
    incident: {
      primaryType: 'Kekerasan Fisik',
      secondaryTypes: ['Kekerasan Psikis', 'Penelantaran Rumah Tangga'],
      locationType: 'Rumah Tangga',
      locationDetail: 'Rumah kediaman bersama di Boawae',
      chronology: 'Terlapor dalam pengaruh minuman keras tradisional (moke) kerap melakukan pemukulan dan pengrusakan perabot rumah saat korban menanyakan nafkah keluarga dan biaya sekolah anak. Korban menderita lebam pada pelipis kiri dan lengan kanan.'
    },
    caseManager: 'Petrus N. S.H. (Advokat PPA)',
    requiredServices: ['Pengobatan & Visum', 'Konseling Keluarga / Mediasi Terbatas', 'Pendampingan Hukum KDRT (UU PKDRT No. 23/2004)'],
    progressLogs: [
      {
        id: 'log-201',
        date: '2026-02-18',
        officerName: 'Petrus N. S.H.',
        serviceType: 'Penerimaan',
        description: 'Korban datang didampingi kepala dusun. Diberikan pertolongan pertama dan dokumentasi luka memar.'
      },
      {
        id: 'log-202',
        date: '2026-02-19',
        officerName: 'Maria P. S.Sos',
        serviceType: 'Medis/Visum',
        description: 'Pemeriksaan luka lebam di Puskesmas Boawae dan rujukan visum ke RSUD Aeramo.'
      },
      {
        id: 'log-203',
        date: '2026-03-01',
        officerName: 'Petrus N. S.H.',
        serviceType: 'Mediasi',
        description: 'Pertemuan mediasi formal bersama tokoh adat dan aparat desa Boawae atas permintaan korban, pembuatan surat perjanjian tidak mengulangi KDRT bermaterai dengan pengawasan ketat tim UPTD.'
      }
    ],
    referrals: [
      {
        id: 'ref-21',
        date: '2026-02-19',
        targetAgency: 'Puskesmas Boawae',
        serviceType: 'Perawatan Luka Memar',
        status: 'Selesai Dampingi',
        contactPerson: 'dr. Puskesmas Boawae'
      }
    ],
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-03-01T15:30:00Z'
  },
  {
    id: 'case-003',
    registrationNumber: 'REG/PPA-NGK/2026/01/008',
    reportedDate: '2026-01-22',
    incidentDate: '2026-01-15',
    status: 'Selesai / Ditutup',
    reporter: {
      name: 'Yustina Meo',
      relationshipWithVictim: 'Ibu Kandung',
      phone: '0852-3918-0021',
      channel: 'Laporan Desa/Kelurahan',
      address: 'Desa Sawu, Kec. Mauponggo'
    },
    victim: {
      fullName: 'Bernadeta Seke Nuwa',
      initials: 'BSN',
      nik: '5316056204090003',
      age: 16,
      gender: 'Perempuan',
      category: 'Anak Perempuan',
      hasDisability: false,
      education: 'SMA / Sederajat',
      occupation: 'Pelajar',
      maritalStatus: 'Belum Kawin',
      phone: '0852-3918-0021',
      addressStreet: 'Dusun Sawu Barat, Lereng Ebulobo',
      village: 'Desa Sawu',
      district: 'Mauponggo'
    },
    perpetrator: {
      fullName: 'Remigius W. (Inisial RW)',
      initials: 'RW',
      age: 21,
      gender: 'Laki-laki',
      relationship: 'Teman Sebaya / Pacar',
      occupation: 'Wiraswasta / Ojek',
      district: 'Mauponggo',
      address: 'Desa Keli, Kec. Mauponggo',
      statusLegal: 'Diversi / Restorative Justice'
    },
    incident: {
      primaryType: 'Kekerasan Berbasis Gender Online (KBGO)',
      secondaryTypes: ['Kekerasan Psikis'],
      locationType: 'Daring / Online',
      locationDetail: 'Media sosial WhatsApp & Facebook Messenger',
      chronology: 'Pelaku menyebarkan tangkapan layar percakapan pribadi dan mengancam menyebarkan foto tidak pantas korban ke teman-teman sekolah apabila korban memutuskan hubungan. Korban sempat mogok sekolah karena malu dan tertekan.'
    },
    caseManager: 'Yohana D. S.Psi (Konselor)',
    requiredServices: ['Konseling Psikososial', 'Advokasi Pendidikan', 'Mediasi Pemulihan & Penghapusan Jejak Digital'],
    progressLogs: [
      {
        id: 'log-301',
        date: '2026-01-22',
        officerName: 'Yohana D. S.Psi',
        serviceType: 'Penerimaan',
        description: 'Laporan diterima melalui koordinasi perangkat desa Sawu. Korban dalam kondisi syok dan menangis.'
      },
      {
        id: 'log-302',
        date: '2026-01-25',
        officerName: 'Petrus N. S.H.',
        serviceType: 'Hukum/BAP',
        description: 'Pemanggilan terlapor didampingi orang tua dan Bhabinkamtibmas Mauponggo. Pelaku mengakui perbuatannya dan menghapus seluruh file di depan saksi.'
      },
      {
        id: 'log-303',
        date: '2026-02-10',
        officerName: 'Yohana D. S.Psi',
        serviceType: 'Terminasi',
        description: 'Korban telah kembali bersekolah dengan aktif. Guru BK memberikan laporan pemantauan positif. Kasus resmi ditutup dengan kesepakatan damai diversi.'
      }
    ],
    referrals: [],
    createdAt: '2026-01-22T11:20:00Z',
    updatedAt: '2026-02-10T16:00:00Z'
  },
  {
    id: 'case-004',
    registrationNumber: 'REG/PPA-NGK/2026/03/004',
    reportedDate: '2026-03-10',
    incidentDate: '2026-03-08',
    status: 'Asesmen & Penjangkauan',
    reporter: {
      name: 'Aipda Stefanus (PPA Polres)',
      relationshipWithVictim: 'Aparat Penegak Hukum',
      phone: '0812-3899-7800',
      channel: 'Rujukan Polsek / Polres',
      address: 'Polres Nagekeo, Mbay'
    },
    victim: {
      fullName: 'Agustinus Daga',
      initials: 'AD',
      nik: '5316071408150001',
      age: 10,
      gender: 'Laki-laki',
      category: 'Anak Laki-Laki',
      hasDisability: true,
      disabilityType: 'Tuna Wicara / Rungu',
      education: 'SD / Sederajat',
      occupation: 'Pelajar SLB / SD Inpres',
      maritalStatus: 'Belum Kawin',
      addressStreet: 'Kampung Maunori Bawah',
      village: 'Desa Maunori',
      district: 'Keo Tengah'
    },
    perpetrator: {
      fullName: 'Petrus S. (Inisial PS)',
      initials: 'PS',
      age: 45,
      gender: 'Laki-laki',
      relationship: 'Keluarga / Kerabat / Paman',
      occupation: 'Petani',
      district: 'Keo Tengah',
      address: 'Desa Maunori, Keo Tengah',
      statusLegal: 'Tersangka'
    },
    incident: {
      primaryType: 'Kekerasan Fisik',
      secondaryTypes: ['Penelantaran Rumah Tangga'],
      locationType: 'Rumah Tangga',
      locationDetail: 'Rumah paman di Maunori Keo Tengah',
      chronology: 'Korban anak disabilitas dititipkan oleh orang tuanya yang merantau ke Malaysia. Terlapor kerap melakukan kekerasan fisik dengan sapu dan rotan bila anak tidak mengerti perintah kerja kebun, hingga korban melarikan diri ke rumah tetangga.'
    },
    caseManager: 'Maria P. S.Sos (Pekerja Sosial)',
    requiredServices: ['Penjangkauan Lapangan', 'Pemeriksaan Kesehatan', 'Pendampingan Juru Bahasa Isyarat', 'Penempatan Rumah Aman / Pengasuhan Alternatif'],
    progressLogs: [
      {
        id: 'log-401',
        date: '2026-03-10',
        officerName: 'Maria P. S.Sos',
        serviceType: 'Penerimaan',
        description: 'Limpahan rujukan dari Unit Reskrim Polsek Mauponggo/Keo Tengah. Tim langsung menjadwalkan penjangkauan ke Maunori.'
      },
      {
        id: 'log-402',
        date: '2026-03-11',
        officerName: 'Fransiskus X.',
        serviceType: 'Asesmen',
        description: 'Asesmen lapangan ke Maunori bersama Pekerja Sosial. Anak dijemput dan diamankan sementara ke Rumah Aman UPTD PPA di Mbay.'
      }
    ],
    referrals: [
      {
        id: 'ref-41',
        date: '2026-03-11',
        targetAgency: 'Rumah Aman (Shelter) Kasih Bunda Nagekeo',
        serviceType: 'Perlindungan & Penampungan Darurat',
        status: 'Dalam Proses',
        contactPerson: 'Koordinator Shelter'
      }
    ],
    createdAt: '2026-03-10T13:45:00Z',
    updatedAt: '2026-03-11T17:00:00Z'
  },
  {
    id: 'case-005',
    registrationNumber: 'REG/PPA-NGK/2026/02/009',
    reportedDate: '2026-02-05',
    incidentDate: '2026-01-20',
    status: 'Pendampingan Berjalan',
    reporter: {
      name: 'Maria Fatima Rero',
      relationshipWithVictim: 'Diri Sendiri',
      phone: '0813-5590-2234',
      channel: 'Hotline / WhatsApp',
      address: 'Kel. Nangaroro, Kec. Nangaroro'
    },
    victim: {
      fullName: 'Maria Fatima Rero',
      initials: 'MFR',
      nik: '5316065502950004',
      age: 31,
      gender: 'Perempuan',
      category: 'Perempuan Dewasa',
      hasDisability: false,
      education: 'SMA / Sederajat',
      occupation: 'Honorer / Pedagang',
      maritalStatus: 'Kawin',
      phone: '0813-5590-2234',
      addressStreet: 'Jalan Pasar Nangaroro RT 06',
      village: 'Kel. Nangaroro',
      district: 'Nangaroro'
    },
    perpetrator: {
      fullName: 'Fransiskus D. (Inisial FD)',
      initials: 'FD',
      age: 35,
      gender: 'Laki-laki',
      relationship: 'Suami / Mantan Suami',
      occupation: 'Sopir Truk Ekspedisi',
      district: 'Nangaroro',
      address: 'Nangaroro',
      statusLegal: 'Belum Dilaporkan ke Polisi'
    },
    incident: {
      primaryType: 'Penelantaran Rumah Tangga',
      secondaryTypes: ['Kekerasan Psikis', 'Eksploitasi Ekonomi'],
      locationType: 'Rumah Tangga',
      locationDetail: 'Rumah kontrakan di Nangaroro',
      chronology: 'Terlapor meninggalkan istri dan 2 orang balita selama lebih dari 10 bulan tanpa nafkah lahir, serta berutang kepada pihak ketiga dengan mencatut nama korban. Korban mengalami kesulitan memenuhi kebutuhan dasar susu dan makan anak.'
    },
    caseManager: 'Petrus N. S.H. (Advokat PPA)',
    requiredServices: ['Bantuan Hukum / Mediasi Nafkah', 'Bantuan Sosial Darurat Dinsos', 'Konseling Penguatan Ekonomi'],
    progressLogs: [
      {
        id: 'log-501',
        date: '2026-02-05',
        officerName: 'Maria P. S.Sos',
        serviceType: 'Penerimaan',
        description: 'Laporan via Hotline SAPA UPTD Nagekeo. Korban berkonsultasi mengenai hak nafkah anak dan gugatan perlindungan hukum.'
      },
      {
        id: 'log-502',
        date: '2026-02-20',
        officerName: 'Petrus N. S.H.',
        serviceType: 'Mediasi',
        description: 'Fasilitasi mediasi bersama keluarga besar dari kedua belah pihak di kantor UPTD PPA Nagekeo.'
      }
    ],
    referrals: [],
    createdAt: '2026-02-05T08:15:00Z',
    updatedAt: '2026-02-20T11:00:00Z'
  },
  {
    id: 'case-006',
    registrationNumber: 'REG/PPA-NGK/2026/03/007',
    reportedDate: '2026-03-15',
    incidentDate: '2026-03-14',
    status: 'Pengaduan Masuk',
    reporter: {
      name: 'Kepala Desa Totomala',
      relationshipWithVictim: 'Perangkat Desa',
      phone: '0812-4400-3311',
      channel: 'Laporan Desa/Kelurahan',
      address: 'Kantor Desa Totomala, Wolowae'
    },
    victim: {
      fullName: 'Yuliana Bupu (Inisial YB)',
      initials: 'YB',
      nik: '5316035008080002',
      age: 17,
      gender: 'Perempuan',
      category: 'Anak Perempuan',
      hasDisability: false,
      education: 'SMP / Sederajat',
      occupation: 'Tidak Bekerja / Putus Sekolah',
      maritalStatus: 'Belum Kawin',
      phone: '0812-4400-3311',
      addressStreet: 'Kampung Totomala RT 01',
      village: 'Desa Totomala',
      district: 'Wolowae'
    },
    perpetrator: {
      fullName: 'Perekrut Tenaga Kerja Ilegal (Inisial MT)',
      initials: 'MT',
      age: 44,
      gender: 'Laki-laki',
      relationship: 'Tidak Dikenal',
      occupation: 'Calo Tenaga Kerja / Perekrut Ilegal',
      statusLegal: 'Dalam Penyelidikan'
    },
    incident: {
      primaryType: 'TPPO / Perdagangan Orang',
      secondaryTypes: ['Eksploitasi Ekonomi'],
      locationType: 'Fasilitas Umum / Terbuka',
      locationDetail: 'Pelabuhan Rakyat Marapokot Aesesa',
      chronology: 'Korban diiming-imingi bekerja sebagai pelayan restoran di Bali/Malaysia dengan gaji tinggi tanpa izin orang tua dan pemalsuan dokumen KTP umur dewasa. Upaya pemberangkatan digagalkan oleh masyarakat dan Babinsa di sekitar pelabuhan.'
    },
    caseManager: 'Fransiskus X. (Petugas Penjangkauan)',
    requiredServices: ['Penjangkauan Darurat', 'Pemulangan ke Keluarga', 'Advokasi Pencegahan TPPO Desa', 'Pendampingan Hukum'],
    progressLogs: [
      {
        id: 'log-601',
        date: '2026-03-15',
        officerName: 'Fransiskus X.',
        serviceType: 'Penerimaan',
        description: 'Laporan masuk dari Kades Totomala. Korban sudah diamankan di kantor desa dan tim UPTD bertolak ke Wolowae.'
      }
    ],
    referrals: [],
    createdAt: '2026-03-15T15:20:00Z',
    updatedAt: '2026-03-15T15:20:00Z'
  }
];
