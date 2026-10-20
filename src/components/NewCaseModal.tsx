import React, { useState } from 'react';
import { X, Save, AlertCircle, ShieldPlus } from 'lucide-react';
import { CaseRecord, DistrictNagekeo, ViolenceType, VictimCategory, PerpetratorRelationship } from '../types/case';
import { DISTRICTS_NAGEKEO, VIOLENCE_TYPES, CASE_MANAGERS } from '../data/initialData';
import { storageService } from '../services/storageService';

interface NewCaseModalProps {
  existingCases: CaseRecord[];
  onClose: () => void;
  onCaseCreated: (createdCase: CaseRecord) => void;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  existingCases,
  onClose,
  onCaseCreated
}) => {
  const autoRegNumber = storageService.generateRegistrationNumber(existingCases);
  const todayStr = new Date().toISOString().slice(0, 10);

  // Form States
  const [reportedDate, setReportedDate] = useState(todayStr);
  const [incidentDate, setIncidentDate] = useState(todayStr);

  // Pelapor
  const [reporterName, setReporterName] = useState('');
  const [reporterRelationship, setReporterRelationship] = useState('Orang Tua / Ibu Kandung');
  const [reporterPhone, setReporterPhone] = useState('');
  const [reporterChannel, setReporterChannel] = useState<CaseRecord['reporter']['channel']>('Datang Langsung ke Kantor');
  const [reporterAddress, setReporterAddress] = useState('');

  // Korban
  const [victimFullName, setVictimFullName] = useState('');
  const [victimInitials, setVictimInitials] = useState('');
  const [victimNik, setVictimNik] = useState('');
  const [victimAge, setVictimAge] = useState<number>(16);
  const [victimGender, setVictimGender] = useState<'Perempuan' | 'Laki-laki'>('Perempuan');
  const [victimCategory, setVictimCategory] = useState<VictimCategory>('Anak Perempuan');
  const [hasDisability, setHasDisability] = useState(false);
  const [disabilityType, setDisabilityType] = useState('');
  const [victimEducation, setVictimEducation] = useState<CaseRecord['victim']['education']>('SMP / Sederajat');
  const [victimOccupation, setVictimOccupation] = useState('Pelajar');
  const [victimMaritalStatus, setVictimMaritalStatus] = useState<CaseRecord['victim']['maritalStatus']>('Belum Kawin');
  const [victimDistrict, setVictimDistrict] = useState<DistrictNagekeo>('Aesesa');
  const [victimVillage, setVictimVillage] = useState('Kel. Danga');
  const [victimStreet, setVictimStreet] = useState('');

  // Pelaku
  const [perpName, setPerpName] = useState('');
  const [perpInitials, setPerpInitials] = useState('');
  const [perpAge, setPerpAge] = useState<string>('30');
  const [perpGender, setPerpGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [perpRelationship, setPerpRelationship] = useState<PerpetratorRelationship>('Suami / Mantan Suami');
  const [perpOccupation, setPerpOccupation] = useState('Petani / Wiraswasta');
  const [perpStatusLegal, setPerpStatusLegal] = useState<CaseRecord['perpetrator']['statusLegal']>('Belum Dilaporkan ke Polisi');

  // Kasus
  const [primaryType, setPrimaryType] = useState<ViolenceType>('Kekerasan Fisik');
  const [secondaryTypes, setSecondaryTypes] = useState<ViolenceType[]>([]);
  const [locationType, setLocationType] = useState<CaseRecord['incident']['locationType']>('Rumah Tangga');
  const [locationDetail, setLocationDetail] = useState('');
  const [chronology, setChronology] = useState('');

  // Penanganan
  const [caseManager, setCaseManager] = useState(CASE_MANAGERS[0].name);
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Konseling Psikososial',
    'Visum et Repertum'
  ]);

  // Handle name input and auto-generate initials
  const handleVictimNameChange = (val: string) => {
    setVictimFullName(val);
    const inits = val
      .split(' ')
      .filter(w => w.length > 0)
      .map(w => w[0].toUpperCase())
      .join('');
    setVictimInitials(inits || 'KORBAN');
  };

  const handlePerpNameChange = (val: string) => {
    setPerpName(val);
    const inits = val
      .split(' ')
      .filter(w => w.length > 0)
      .map(w => w[0].toUpperCase())
      .join('');
    setPerpInitials(inits || 'PELAKU');
  };

  // Adjust category based on age & gender
  const handleAgeChange = (ageNum: number) => {
    setVictimAge(ageNum);
    if (ageNum < 18) {
      setVictimCategory(victimGender === 'Perempuan' ? 'Anak Perempuan' : 'Anak Laki-Laki');
    } else {
      setVictimCategory(hasDisability ? 'Disabilitas' : 'Perempuan Dewasa');
    }
  };

  const handleDistrictChange = (d: DistrictNagekeo) => {
    setVictimDistrict(d);
    const found = DISTRICTS_NAGEKEO.find(dist => dist.name === d);
    if (found && found.villages.length > 0) {
      setVictimVillage(found.villages[0]);
    }
  };

  const toggleSecondaryType = (type: ViolenceType) => {
    if (secondaryTypes.includes(type)) {
      setSecondaryTypes(secondaryTypes.filter(t => t !== type));
    } else {
      setSecondaryTypes([...secondaryTypes, type]);
    }
  };

  const toggleService = (srv: string) => {
    if (selectedServices.includes(srv)) {
      setSelectedServices(selectedServices.filter(s => s !== srv));
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRecord: CaseRecord = {
      id: `case-${Date.now()}`,
      registrationNumber: autoRegNumber,
      reportedDate,
      incidentDate,
      status: 'Pengaduan Masuk',
      reporter: {
        name: reporterName.trim() || 'Korban Sendiri',
        relationshipWithVictim: reporterRelationship,
        phone: reporterPhone || '-',
        channel: reporterChannel,
        address: reporterAddress || `Kecamatan ${victimDistrict}`
      },
      victim: {
        fullName: victimFullName.trim(),
        initials: victimInitials.trim() || 'KORBAN',
        nik: victimNik.trim() || '5316000000000000',
        age: Number(victimAge),
        gender: victimGender,
        category: victimCategory,
        hasDisability,
        disabilityType: hasDisability ? disabilityType : undefined,
        education: victimEducation,
        occupation: victimOccupation,
        maritalStatus: victimMaritalStatus,
        phone: reporterPhone,
        addressStreet: victimStreet || 'Desa ' + victimVillage,
        village: victimVillage,
        district: victimDistrict
      },
      perpetrator: {
        fullName: perpName.trim() || 'Terlapor Dalam Lidik',
        initials: perpInitials.trim() || 'TL',
        age: perpAge ? Number(perpAge) : undefined,
        gender: perpGender,
        relationship: perpRelationship,
        occupation: perpOccupation,
        district: victimDistrict,
        statusLegal: perpStatusLegal
      },
      incident: {
        primaryType,
        secondaryTypes,
        locationType,
        locationDetail: locationDetail || `Wilayah ${victimVillage}, Kec. ${victimDistrict}`,
        chronology: chronology.trim()
      },
      caseManager,
      requiredServices: selectedServices.length > 0 ? selectedServices : ['Penerimaan & Asesmen Awal'],
      progressLogs: [
        {
          id: `log-${Date.now()}`,
          date: reportedDate,
          officerName: caseManager,
          serviceType: 'Penerimaan',
          description: `Penerimaan berkas pengaduan kasus ${primaryType} melalui saluran ${reporterChannel}. Dilakukan verifikasi awal dan penetapan rencana pendampingan.`
        }
      ],
      referrals: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedList = storageService.createCase(newRecord);
    onCaseCreated(newRecord);
  };

  const availableVillages = DISTRICTS_NAGEKEO.find(d => d.name === victimDistrict)?.villages || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-4 bg-sky-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldPlus className="w-6 h-6 text-sky-200" />
            <div>
              <h2 className="text-base font-bold">
                Formulir Penerimaan &amp; Registrasi Pengaduan Kasus
              </h2>
              <p className="text-xs text-sky-200">
                Unit Pelaksana Teknis Daerah Perlindungan Perempuan dan Anak (UPTD PPA) Kab. Nagekeo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-sky-200 hover:text-white rounded-lg hover:bg-sky-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-xs">
          {/* Section 0: Nomor Registrasi Otomatis & Tanggal */}
          <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Nomor Registrasi Resmi (Auto)
              </label>
              <input
                type="text"
                value={autoRegNumber}
                readOnly
                className="w-full px-3 py-2 bg-neutral-200/70 border border-neutral-300 rounded font-mono-numbers font-semibold text-neutral-800 text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Tanggal Penerimaan Laporan *
              </label>
              <input
                type="date"
                value={reportedDate}
                onChange={(e) => setReportedDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs font-mono-numbers"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Tanggal Perkiraan Kejadian *
              </label>
              <input
                type="date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs font-mono-numbers"
                required
              />
            </div>
          </div>

          {/* Section 1: Identitas Korban */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider pb-1 border-b border-neutral-200">
              1. Identitas Korban (Kerahasiaan Dijamin Sesuai UU TPKS &amp; UU Perlindungan Anak)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Nama Lengkap Korban *
                </label>
                <input
                  type="text"
                  value={victimFullName}
                  onChange={(e) => handleVictimNameChange(e.target.value)}
                  placeholder="Contoh: Maria Adelina Wea"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Inisial Korban (Publikasi Privasi)
                </label>
                <input
                  type="text"
                  value={victimInitials}
                  onChange={(e) => setVictimInitials(e.target.value)}
                  placeholder="MAW"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs font-bold font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  NIK (16 Digit) *
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={victimNik}
                  onChange={(e) => setVictimNik(e.target.value.replace(/\D/g, ''))}
                  placeholder="531601xxxxxxxxxx"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs font-mono-numbers"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Usia Korban (Tahun) *
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={victimAge}
                  onChange={(e) => handleAgeChange(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs font-mono-numbers"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Jenis Kelamin *
                </label>
                <select
                  value={victimGender}
                  onChange={(e) => {
                    const g = e.target.value as 'Perempuan' | 'Laki-laki';
                    setVictimGender(g);
                    if (victimAge < 18) {
                      setVictimCategory(g === 'Perempuan' ? 'Anak Perempuan' : 'Anak Laki-Laki');
                    }
                  }}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs"
                >
                  <option value="Perempuan">Perempuan</option>
                  <option value="Laki-laki">Laki-laki</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Kategori Korban
                </label>
                <select
                  value={victimCategory}
                  onChange={(e) => setVictimCategory(e.target.value as VictimCategory)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs"
                >
                  <option value="Perempuan Dewasa">Perempuan Dewasa (≥ 18 Thn)</option>
                  <option value="Anak Perempuan">Anak Perempuan (&lt; 18 Thn)</option>
                  <option value="Anak Laki-Laki">Anak Laki-Laki (&lt; 18 Thn)</option>
                  <option value="Disabilitas">Penyandang Disabilitas</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Pendidikan Terakhir
                </label>
                <select
                  value={victimEducation}
                  onChange={(e) => setVictimEducation(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs"
                >
                  <option value="SD / Sederajat">SD / Sederajat</option>
                  <option value="SMP / Sederajat">SMP / Sederajat</option>
                  <option value="SMA / Sederajat">SMA / Sederajat</option>
                  <option value="Diploma / Sarjana">Diploma / Sarjana</option>
                  <option value="Tidak Sekolah">Tidak / Belum Sekolah</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Pekerjaan Korban
                </label>
                <input
                  type="text"
                  value={victimOccupation}
                  onChange={(e) => setVictimOccupation(e.target.value)}
                  placeholder="Pelajar / Petani / IRT / Swasta"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Status Perkawinan
                </label>
                <select
                  value={victimMaritalStatus}
                  onChange={(e) => setVictimMaritalStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs"
                >
                  <option value="Belum Kawin">Belum Kawin</option>
                  <option value="Kawin">Kawin / Menikah</option>
                  <option value="Cerai Hidup">Cerai Hidup</option>
                  <option value="Cerai Mati">Cerai Mati</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Kecamatan (Kab. Nagekeo) *
                </label>
                <select
                  value={victimDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value as DistrictNagekeo)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs font-semibold"
                >
                  {DISTRICTS_NAGEKEO.map(d => (
                    <option key={d.name} value={d.name}>Kecamatan {d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Desa / Kelurahan *
                </label>
                <select
                  value={victimVillage}
                  onChange={(e) => setVictimVillage(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs"
                >
                  {availableVillages.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Alamat Jalan / RT / RW / Dusun
                </label>
                <input
                  type="text"
                  value={victimStreet}
                  onChange={(e) => setVictimStreet(e.target.value)}
                  placeholder="Contoh: RT 03 Dusun II Pantai Aeramo"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs"
                />
              </div>

              <div className="flex items-center gap-3 md:col-span-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-800">
                  <input
                    type="checkbox"
                    checked={hasDisability}
                    onChange={(e) => setHasDisability(e.target.checked)}
                    className="rounded text-sky-700 focus:ring-sky-700"
                  />
                  <span>Korban merupakan Penyandang Disabilitas</span>
                </label>
                {hasDisability && (
                  <input
                    type="text"
                    value={disabilityType}
                    onChange={(e) => setDisabilityType(e.target.value)}
                    placeholder="Sebutkan ragam (Tuna Rungu/Wicara/Daksa/Grahita)..."
                    className="flex-1 px-3 py-1.5 bg-white border border-amber-300 rounded text-xs"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Identitas Pelapor */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider pb-1 border-b border-neutral-200">
              2. Identitas Pelapor &amp; Kanal Pengaduan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Nama Pelapor *
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Nama pelapor (atau tulis 'Korban Langsung')"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Hubungan dengan Korban *
                </label>
                <select
                  value={reporterRelationship}
                  onChange={(e) => setReporterRelationship(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs"
                >
                  <option value="Diri Sendiri (Korban)">Diri Sendiri (Korban Langsung)</option>
                  <option value="Orang Tua / Ibu Kandung">Orang Tua / Ibu Kandung</option>
                  <option value="Orang Tua / Ayah Kandung">Orang Tua / Ayah Kandung</option>
                  <option value="Keluarga / Kerabat">Keluarga / Kerabat / Paman</option>
                  <option value="Perangkat Desa / Kelurahan">Perangkat Desa / Kelurahan</option>
                  <option value="Aparat Penegak Hukum (Polisi/Babinsa)">Aparat Penegak Hukum (Polsek/Polres)</option>
                  <option value="Tenaga Medis / Bidan Desa">Tenaga Medis / Bidan Desa</option>
                  <option value="Guru / Pihak Sekolah">Guru / Pihak Sekolah</option>
                  <option value="Masyarakat / Tetangga">Masyarakat / Tetangga</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Kanal / Saluran Pengaduan
                </label>
                <select
                  value={reporterChannel}
                  onChange={(e) => setReporterChannel(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs"
                >
                  <option value="Datang Langsung ke Kantor">Datang Langsung ke Kantor UPTD</option>
                  <option value="Hotline / WhatsApp">Hotline / WhatsApp SAPA</option>
                  <option value="Rujukan Polsek / Polres">Rujukan Polsek / Satreskrim Polres</option>
                  <option value="Laporan Desa/Kelurahan">Laporan Kepala Desa / Lurah</option>
                  <option value="Rujukan Puskesmas/RSUD">Rujukan Puskesmas / RSUD Aeramo</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Nomor HP / WhatsApp Pelapor
                </label>
                <input
                  type="text"
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs font-mono-numbers"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Alamat Pelapor
                </label>
                <input
                  type="text"
                  value={reporterAddress}
                  onChange={(e) => setReporterAddress(e.target.value)}
                  placeholder="Desa / RT / Kecamatan tempat tinggal pelapor"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Data Terlapor / Pelaku */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider pb-1 border-b border-neutral-200">
              3. Data Terlapor / Pelaku Kekerasan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Nama Terlapor / Pelaku *
                </label>
                <input
                  type="text"
                  value={perpName}
                  onChange={(e) => handlePerpNameChange(e.target.value)}
                  placeholder="Nama Terlapor (atau 'Dalam Penyelidikan')"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Inisial Pelaku
                </label>
                <input
                  type="text"
                  value={perpInitials}
                  onChange={(e) => setPerpInitials(e.target.value)}
                  placeholder="TL"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs font-bold font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Hubungan Terlapor dengan Korban *
                </label>
                <select
                  value={perpRelationship}
                  onChange={(e) => setPerpRelationship(e.target.value as PerpetratorRelationship)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs"
                >
                  <option value="Suami / Mantan Suami">Suami / Mantan Suami</option>
                  <option value="Istri">Istri</option>
                  <option value="Orang Tua / Ayah Kandung">Orang Tua / Ayah Kandung</option>
                  <option value="Ayah Tiri / Ibu Tiri">Ayah Tiri / Ibu Tiri</option>
                  <option value="Keluarga / Kerabat / Paman">Keluarga / Kerabat / Paman</option>
                  <option value="Tetangga">Tetangga / Warga Sekitar</option>
                  <option value="Teman Sebaya / Pacar">Teman Sebaya / Pacar</option>
                  <option value="Guru / Tenaga Pendidik">Guru / Tenaga Pendidik</option>
                  <option value="Majikan / Rekan Kerja">Majikan / Rekan Kerja</option>
                  <option value="Tidak Dikenal">Tidak Dikenal / Orang Asing</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Perkiraan Usia Pelaku
                </label>
                <input
                  type="number"
                  value={perpAge}
                  onChange={(e) => setPerpAge(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs font-mono-numbers"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Pekerjaan Pelaku
                </label>
                <input
                  type="text"
                  value={perpOccupation}
                  onChange={(e) => setPerpOccupation(e.target.value)}
                  placeholder="Petani / Wiraswasta / Sopir"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Status Penanganan Hukum
                </label>
                <select
                  value={perpStatusLegal}
                  onChange={(e) => setPerpStatusLegal(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs"
                >
                  <option value="Belum Dilaporkan ke Polisi">Belum Dilaporkan ke Polisi</option>
                  <option value="Dalam Penyelidikan">Dalam Penyelidikan Polsek/Polres</option>
                  <option value="Tersangka">Ditetapkan Tersangka</option>
                  <option value="Ditahan di Rutan">Ditahan di Rutan Polres</option>
                  <option value="Diversi / Restorative Justice">Diversi / Restorative Justice</option>
                  <option value="Vonis Pengadilan">Vonis Pengadilan Negeri</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Bentuk Kekerasan & Kronologis Kasus */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider pb-1 border-b border-neutral-200">
              4. Bentuk Kekerasan &amp; Uraian Kronologis Kejadian
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Bentuk Kekerasan Utama *
                </label>
                <select
                  value={primaryType}
                  onChange={(e) => setPrimaryType(e.target.value as ViolenceType)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs font-semibold"
                >
                  {VIOLENCE_TYPES.map(vt => (
                    <option key={vt} value={vt}>{vt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Kategori Tempat Kejadian
                </label>
                <select
                  value={locationType}
                  onChange={(e) => setLocationType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs"
                >
                  <option value="Rumah Tangga">Rumah Tangga (KDRT)</option>
                  <option value="Lingkungan Sekolah">Lingkungan Sekolah / Pendidikan</option>
                  <option value="Tempat Kerja">Tempat Kerja / Kebun</option>
                  <option value="Fasilitas Umum / Terbuka">Fasilitas Umum / Terbuka / Jalan</option>
                  <option value="Daring / Online">Media Sosial / Daring / Online</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Rincian Lokasi Kejadian di Wilayah Nagekeo
                </label>
                <input
                  type="text"
                  value={locationDetail}
                  onChange={(e) => setLocationDetail(e.target.value)}
                  placeholder="Misal: Rumah korban di Dusun 1 Desa Aeramo, gudang kosong, dsb."
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs"
                />
              </div>

              {/* Checkboxes Kekerasan Penyerta */}
              <div className="md:col-span-2 space-y-1">
                <label className="block text-[11px] font-medium text-neutral-700">
                  Kekerasan Penyerta (Dapat dipilih lebih dari satu)
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {VIOLENCE_TYPES.filter(t => t !== primaryType).map((secType) => (
                    <label 
                      key={secType}
                      className={`px-2.5 py-1 rounded border text-xs cursor-pointer transition-colors ${
                        secondaryTypes.includes(secType)
                          ? 'bg-sky-50 border-sky-600 text-sky-900 font-medium'
                          : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={secondaryTypes.includes(secType)}
                        onChange={() => toggleSecondaryType(secType)}
                        className="sr-only"
                      />
                      <span>{secType}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Uraian Kronologis */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Kronologis Lengkap Kejadian *
                </label>
                <textarea
                  rows={4}
                  value={chronology}
                  onChange={(e) => setChronology(e.target.value)}
                  placeholder="Ceritakan kronologis kejadian: kapan terjadi, modus operandi, tindakan pelaku, ancaman atau paksaan, dampak fisik/psikologis yang tampak pada korban, saksi-saksi..."
                  className="w-full p-3 bg-white border border-neutral-300 rounded text-xs leading-relaxed"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 5: Rencana Layanan & Penugasan Petugas */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider pb-1 border-b border-neutral-200">
              5. Penugasan Case Manager &amp; Kebutuhan Layanan Korban
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Petugas Pendamping Utama (Case Manager) *
                </label>
                <select
                  value={caseManager}
                  onChange={(e) => setCaseManager(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs font-semibold"
                >
                  {CASE_MANAGERS.map(cm => (
                    <option key={cm.name} value={cm.name}>{cm.name} - {cm.role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Kebutuhan Layanan Segera (Pilih Layanan)
                </label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'Visum et Repertum (RSUD Aeramo)',
                    'Pendampingan Hukum APH (Polres Nagekeo)',
                    'Konseling Psikologis & Trauma Healing',
                    'Penempatan Rumah Aman (Shelter)',
                    'Bantuan Medis Pengobatan Luka',
                    'Mediasi Keluarga & Tokoh Adat',
                    'Bantuan Sosial / Perlindungan PMDP3A'
                  ].map((srv) => (
                    <button
                      type="button"
                      key={srv}
                      onClick={() => toggleService(srv)}
                      className={`px-2 py-1 rounded text-[11px] cursor-pointer transition-colors ${
                        selectedServices.includes(srv)
                          ? 'bg-sky-700 text-white font-medium'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {selectedServices.includes(srv) ? '✓ ' : '+ '}
                      {srv}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Legal Notice */}
          <div className="p-3 bg-sky-50 border border-sky-200 rounded text-sky-900 flex items-start gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
            <p>
              Data yang dicatat merupakan data resmi UPTD PPA Kabupaten Nagekeo berdasarkan Peraturan Menteri PPPA No. 4 Tahun 2018 tentang Pedoman Pembentukan UPTD PPA dan UU Tindak Pidana Kekerasan Seksual (UU TPKS No. 12 Tahun 2022). Identitas korban dilindungi hukum.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 rounded text-neutral-700 hover:bg-neutral-50 font-medium cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded font-bold flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Simpan &amp; Daftarkan Pengaduan Kasus</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
