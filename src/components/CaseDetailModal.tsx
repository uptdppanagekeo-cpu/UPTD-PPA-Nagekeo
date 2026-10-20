import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Plus, 
  Clock, 
  Building2, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  FileText
} from 'lucide-react';
import { CaseRecord, CaseStatus, ProgressNote, ServiceReferral, StaffMember } from '../types/case';
import { PARTNER_AGENCIES, INITIAL_STAFF_MEMBERS } from '../data/initialData';

interface CaseDetailModalProps {
  caseData: CaseRecord;
  staffList?: StaffMember[];
  onClose: () => void;
  onUpdateCase: (updated: CaseRecord) => void;
  onAddProgressLog: (caseId: string, log: Omit<ProgressNote, 'id'>) => void;
  onAddReferral: (caseId: string, referral: Omit<ServiceReferral, 'id'>) => void;
  onOpenDocumentPrint: (c: CaseRecord, docType: string) => void;
  privacyMode: boolean;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  caseData,
  staffList,
  onClose,
  onUpdateCase,
  onAddProgressLog,
  onAddReferral,
  onOpenDocumentPrint,
  privacyMode
}) => {
  const activeStaff = staffList && staffList.length > 0 
    ? staffList.filter(s => s.isActive)
    : INITIAL_STAFF_MEMBERS;
  const [activeTab, setActiveTab] = useState<'kronologi' | 'progress' | 'referrals' | 'status'>('kronologi');

  // New Progress Note Form State
  const [newOfficer, setNewOfficer] = useState(caseData.caseManager);
  const [newServiceType, setNewServiceType] = useState<ProgressNote['serviceType']>('Psikologis');
  const [newLogDesc, setNewLogDesc] = useState('');

  // New Referral Form State
  const [targetAgency, setTargetAgency] = useState('RSUD Aeramo Kabupaten Nagekeo');
  const [referralService, setReferralService] = useState('Pemeriksaan Visum et Repertum Lanjutan');
  const [referralContact, setReferralContact] = useState('');
  const [referralNotes, setReferralNotes] = useState('');

  // Status edit
  const [selectedStatus, setSelectedStatus] = useState<CaseStatus>(caseData.status);

  const victimName = privacyMode ? caseData.victim.initials : caseData.victim.fullName;
  const perpName = privacyMode ? caseData.perpetrator.initials : caseData.perpetrator.fullName;
  const victimNIK = privacyMode 
    ? `${caseData.victim.nik.slice(0, 4)}********${caseData.victim.nik.slice(-2)}` 
    : caseData.victim.nik;

  const handleSaveStatus = () => {
    const updated: CaseRecord = {
      ...caseData,
      status: selectedStatus,
      updatedAt: new Date().toISOString()
    };
    onUpdateCase(updated);
  };

  const handleCreateProgressLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogDesc.trim()) return;

    onAddProgressLog(caseData.id, {
      date: new Date().toISOString().slice(0, 10),
      officerName: newOfficer,
      serviceType: newServiceType,
      description: newLogDesc.trim()
    });

    setNewLogDesc('');
  };

  const handleCreateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAgency.trim()) return;

    onAddReferral(caseData.id, {
      date: new Date().toISOString().slice(0, 10),
      targetAgency,
      serviceType: referralService,
      status: 'Diajukan',
      contactPerson: referralContact,
      notes: referralNotes
    });

    setReferralNotes('');
    setReferralContact('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono-numbers text-xs text-sky-400 font-semibold tracking-wider">
                {caseData.registrationNumber}
              </span>
              <span className="text-neutral-500" aria-hidden="true">·</span>
              <span className="text-xs text-neutral-300">
                Kec. {caseData.victim.district}
              </span>
            </div>
            <h2 className="text-base font-bold text-white mt-0.5">
              Lembar Manajemen Kasus: {victimName} ({caseData.victim.category})
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
              caseData.status === 'Selesai / Ditutup'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-sky-950 text-sky-300 border border-sky-800'
            }`}>
              {caseData.status}
            </span>
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Official Actions Strip */}
        <div className="px-6 py-2.5 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-neutral-600">
            <FileText className="w-4 h-4 text-sky-700" />
            <span>Dokumen Administrasi UPTD PPA Nagekeo:</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onOpenDocumentPrint(caseData, 'tanda-terima')}
              className="px-2.5 py-1 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 rounded font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-neutral-600" />
              <span>Tanda Terima Laporan</span>
            </button>
            <button
              onClick={() => onOpenDocumentPrint(caseData, 'berita-acara')}
              className="px-2.5 py-1 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 rounded font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-neutral-600" />
              <span>Berita Acara Pengaduan</span>
            </button>
            <button
              onClick={() => onOpenDocumentPrint(caseData, 'rujukan-visum')}
              className="px-2.5 py-1 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 rounded font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-neutral-600" />
              <span>Surat Visum RSUD</span>
            </button>
            <button
              onClick={() => onOpenDocumentPrint(caseData, 'rujukan-polres')}
              className="px-2.5 py-1 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 rounded font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-neutral-600" />
              <span>Surat Rujukan Polres</span>
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center border-b border-neutral-200 px-6 bg-white gap-6 text-xs font-medium">
          <button
            onClick={() => setActiveTab('kronologi')}
            className={`py-3 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'kronologi'
                ? 'border-sky-700 text-sky-800 font-bold'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Rincian &amp; Pihak Terlibat
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`py-3 transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'progress'
                ? 'border-sky-700 text-sky-800 font-bold'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>Catatan Perkembangan</span>
            <span className="font-mono-numbers text-[10px] bg-neutral-100 px-1.5 py-0.2 rounded text-neutral-700">
              {caseData.progressLogs.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`py-3 transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'referrals'
                ? 'border-sky-700 text-sky-800 font-bold'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>Rujukan Instansi</span>
            <span className="font-mono-numbers text-[10px] bg-neutral-100 px-1.5 py-0.2 rounded text-neutral-700">
              {caseData.referrals.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'status'
                ? 'border-sky-700 text-sky-800 font-bold'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Status Penanganan Kasus
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {/* TAB 1: RINCIAN & PIHAK TERLIBAT */}
          {activeTab === 'kronologi' && (
            <div className="space-y-6 text-xs">
              {/* Grid: Korban, Terlapor, Pelapor */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Korban */}
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 space-y-2">
                  <div className="font-bold text-neutral-900 flex items-center justify-between">
                    <span>Data Korban</span>
                    <span className="text-[10px] text-sky-800 font-semibold">{caseData.victim.category}</span>
                  </div>
                  <div className="space-y-1 text-neutral-700">
                    <div><strong className="text-neutral-900">Nama:</strong> {victimName}</div>
                    <div className="font-mono-numbers"><strong className="text-neutral-900">NIK:</strong> {victimNIK}</div>
                    <div><strong className="text-neutral-900">Usia:</strong> {caseData.victim.age} Tahun ({caseData.victim.gender})</div>
                    <div><strong className="text-neutral-900">Pendidikan:</strong> {caseData.victim.education}</div>
                    <div><strong className="text-neutral-900">Pekerjaan:</strong> {caseData.victim.occupation}</div>
                    <div><strong className="text-neutral-900">Status Kawin:</strong> {caseData.victim.maritalStatus}</div>
                    <div><strong className="text-neutral-900">Alamat:</strong> {caseData.victim.addressStreet}, {caseData.victim.village}, Kec. {caseData.victim.district}</div>
                    {caseData.victim.hasDisability && (
                      <div className="text-amber-800 font-medium">
                        <strong>Disabilitas:</strong> {caseData.victim.disabilityType || 'Ya'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Terlapor / Pelaku */}
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 space-y-2">
                  <div className="font-bold text-neutral-900 flex items-center justify-between">
                    <span>Data Terlapor / Pelaku</span>
                    <span className="text-[10px] text-neutral-600 font-semibold">{caseData.perpetrator.relationship}</span>
                  </div>
                  <div className="space-y-1 text-neutral-700">
                    <div><strong className="text-neutral-900">Nama:</strong> {perpName}</div>
                    <div><strong className="text-neutral-900">Hubungan:</strong> {caseData.perpetrator.relationship}</div>
                    <div><strong className="text-neutral-900">Usia:</strong> {caseData.perpetrator.age ? `${caseData.perpetrator.age} Tahun` : 'Tidak Diketahui'}</div>
                    <div><strong className="text-neutral-900">Pekerjaan:</strong> {caseData.perpetrator.occupation || '-'}</div>
                    <div><strong className="text-neutral-900">Domisili:</strong> {caseData.perpetrator.address || 'Kabupaten Nagekeo'}</div>
                    <div><strong className="text-neutral-900">Status Hukum:</strong> {caseData.perpetrator.statusLegal || 'Dalam Penyelidikan'}</div>
                  </div>
                </div>

                {/* Pelapor & Petugas */}
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 space-y-2">
                  <div className="font-bold text-neutral-900 flex items-center justify-between">
                    <span>Pelapor &amp; Pendamping</span>
                  </div>
                  <div className="space-y-1 text-neutral-700">
                    <div><strong className="text-neutral-900">Nama Pelapor:</strong> {privacyMode ? 'Keluarga/Pelapor Terlindungi' : caseData.reporter.name}</div>
                    <div><strong className="text-neutral-900">Hubungan:</strong> {caseData.reporter.relationshipWithVictim}</div>
                    <div><strong className="text-neutral-900">Saluran Masuk:</strong> {caseData.reporter.channel}</div>
                    <div className="font-mono-numbers"><strong className="text-neutral-900">Kontak:</strong> {privacyMode ? '0812-****-****' : caseData.reporter.phone}</div>
                    <div className="pt-2 border-t border-neutral-200">
                      <strong className="text-neutral-900">Case Manager UPTD:</strong>
                      <div className="font-medium text-sky-800">{caseData.caseManager}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kronologi Kejadian */}
              <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <h3 className="font-bold text-neutral-900">Kronologis &amp; Uraian Kejadian</h3>
                  <div className="text-neutral-500 font-mono-numbers">
                    Tanggal Kejadian: {caseData.incidentDate}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-neutral-700 pt-1">
                  <div><strong className="text-neutral-900">Bentuk Kekerasan Utama:</strong> {caseData.incident.primaryType}</div>
                  <div><strong className="text-neutral-900">Tempat Kejadian:</strong> {caseData.incident.locationType} ({caseData.incident.locationDetail})</div>
                  {caseData.incident.secondaryTypes.length > 0 && (
                    <div className="md:col-span-2">
                      <strong className="text-neutral-900">Kekerasan Penyerta:</strong> {caseData.incident.secondaryTypes.join(', ')}
                    </div>
                  )}
                </div>
                <div className="mt-3 p-3 bg-neutral-50 rounded border border-neutral-100 text-neutral-800 leading-relaxed whitespace-pre-line">
                  {caseData.incident.chronology}
                </div>
              </div>

              {/* Kebutuhan Layanan Korban */}
              <div className="p-4 bg-white rounded-lg border border-neutral-200 space-y-2">
                <h3 className="font-bold text-neutral-900">Rencana Kebutuhan Layanan Korban</h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {caseData.requiredServices.map((srv, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-sky-50 text-sky-900 border border-sky-200 rounded text-xs font-medium">
                      {srv}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CATATAN PERKEMBANGAN (PROGRESS NOTES) */}
          {activeTab === 'progress' && (
            <div className="space-y-6 text-xs">
              {/* Form Input Catatan Baru */}
              <form onSubmit={handleCreateProgressLog} className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-3">
                <div className="font-bold text-neutral-900 flex items-center justify-between">
                  <span>Input Catatan Pendampingan / Progres Baru</span>
                  <span className="text-neutral-500 font-mono-numbers">Hari Ini: {new Date().toISOString().slice(0, 10)}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                      Petugas Pelaksana
                    </label>
                    <select
                      value={newOfficer}
                      onChange={(e) => setNewOfficer(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded text-xs"
                    >
                      {activeStaff.map(cm => (
                        <option key={cm.id} value={`${cm.name} (${cm.role})`}>{cm.name} - {cm.role}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                      Jenis Layanan / Tindakan
                    </label>
                    <select
                      value={newServiceType}
                      onChange={(e) => setNewServiceType(e.target.value as ProgressNote['serviceType'])}
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded text-xs"
                    >
                      <option value="Psikologis">Konseling Psikologis / Trauma Healing</option>
                      <option value="Hukum/BAP">Pendampingan Hukum &amp; BAP di Kepolisian</option>
                      <option value="Medis/Visum">Pemeriksaan Medis &amp; Visum RSUD Aeramo</option>
                      <option value="Shelter">Penampungan di Rumah Aman (Shelter)</option>
                      <option value="Mediasi">Mediasi Keluarga &amp; Tokoh Adat</option>
                      <option value="Asesmen">Asesmen Ulang Kondisi Korban</option>
                      <option value="Terminasi">Terminasi &amp; Pengembalian ke Keluarga</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                    Deskripsi Perkembangan &amp; Hasil Tindakan
                  </label>
                  <textarea
                    rows={3}
                    value={newLogDesc}
                    onChange={(e) => setNewLogDesc(e.target.value)}
                    placeholder="Uraikan hasil tindakan pendampingan, kondisi korban, kesepakatan yang dicapai, atau rencana tindak lanjut..."
                    className="w-full p-2.5 bg-white border border-neutral-200 rounded text-xs"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Simpan Catatan Perkembangan</span>
                  </button>
                </div>
              </form>

              {/* Riwayat Timeline */}
              <div className="space-y-3">
                <div className="font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                  Riwayat Kronologis Penanganan Kasus ({caseData.progressLogs.length} Entri)
                </div>

                <div className="relative pl-6 border-l-2 border-neutral-200 space-y-4">
                  {caseData.progressLogs.map((log) => (
                    <div key={log.id} className="relative space-y-1">
                      {/* Marker dot */}
                      <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-sky-700 border-2 border-white ring-1 ring-sky-700" />
                      <div className="flex items-center gap-2">
                        <span className="font-mono-numbers font-semibold text-neutral-900">
                          {log.date}
                        </span>
                        <span className="text-neutral-400" aria-hidden="true">·</span>
                        <span className="font-medium text-sky-800">
                          {log.serviceType}
                        </span>
                        <span className="text-neutral-400" aria-hidden="true">·</span>
                        <span className="text-neutral-500">
                          Oleh: {log.officerName}
                        </span>
                      </div>
                      <p className="text-neutral-700 bg-neutral-50 p-3 rounded border border-neutral-200/80 leading-relaxed">
                        {log.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RUJUKAN INSTANSI */}
          {activeTab === 'referrals' && (
            <div className="space-y-6 text-xs">
              {/* Form Input Rujukan Baru */}
              <form onSubmit={handleCreateReferral} className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-3">
                <div className="font-bold text-neutral-900">
                  Ajukan Lembar Rujukan ke Instansi / Fasilitas Mitra
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                      Instansi Tujuan Rujukan
                    </label>
                    <select
                      value={targetAgency}
                      onChange={(e) => setTargetAgency(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded text-xs"
                    >
                      {PARTNER_AGENCIES.map(pa => (
                        <option key={pa.name} value={pa.name}>{pa.name} ({pa.category})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                      Jenis Layanan yang Dirujuk
                    </label>
                    <input
                      type="text"
                      value={referralService}
                      onChange={(e) => setReferralService(e.target.value)}
                      placeholder="e.g. Visum et Repertum / BAP Polisi / Shelter"
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                      Kontak / Penanggung Jawab di Instansi
                    </label>
                    <input
                      type="text"
                      value={referralContact}
                      onChange={(e) => setReferralContact(e.target.value)}
                      placeholder="Nama Dokter / Penyidik / Koordinator"
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                      Catatan Rujukan Tambahan
                    </label>
                    <input
                      type="text"
                      value={referralNotes}
                      onChange={(e) => setReferralNotes(e.target.value)}
                      placeholder="Nomor surat rujukan / pengantar"
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded text-xs"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Simpan Data Rujukan</span>
                  </button>
                </div>
              </form>

              {/* Daftar Rujukan */}
              <div className="space-y-3">
                <div className="font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                  Daftar Rujukan Kasus Ini ({caseData.referrals.length})
                </div>

                {caseData.referrals.length === 0 ? (
                  <p className="text-neutral-500 py-4 text-center">
                    Belum ada data rujukan resmi yang diajukan ke instansi mitra.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {caseData.referrals.map((ref) => (
                      <div key={ref.id} className="p-3 bg-white rounded border border-neutral-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <strong className="text-neutral-900">{ref.targetAgency}</strong>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            ref.status === 'Selesai Dampingi'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {ref.status}
                          </span>
                        </div>
                        <div className="text-neutral-700"><strong>Layanan:</strong> {ref.serviceType}</div>
                        {ref.contactPerson && (
                          <div className="text-neutral-600"><strong>PIC:</strong> {ref.contactPerson}</div>
                        )}
                        {ref.notes && (
                          <div className="text-[11px] text-neutral-500 italic">{ref.notes}</div>
                        )}
                        <div className="text-[10px] text-neutral-400 font-mono-numbers pt-1 border-t border-neutral-100">
                          Diajukan: {ref.date}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: UPDATE STATUS */}
          {activeTab === 'status' && (
            <div className="space-y-5 text-xs max-w-xl mx-auto py-2">
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 space-y-3">
                <h3 className="font-bold text-neutral-900 text-sm">
                  Ubah Status Tahapan Kasus
                </h3>
                <p className="text-neutral-600">
                  Sesuaikan status tahapan penanganan kasus sesuai standar operasional prosedur (SOP) UPTD PPA Kabupaten Nagekeo:
                </p>

                <div className="space-y-2 pt-2">
                  {[
                    'Pengaduan Masuk',
                    'Asesmen & Penjangkauan',
                    'Pendampingan Berjalan',
                    'Reintegrasi / Pemulihan',
                    'Selesai / Ditutup'
                  ].map((st) => (
                    <label 
                      key={st}
                      className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-colors ${
                        selectedStatus === st
                          ? 'border-sky-700 bg-sky-50 text-sky-900 font-semibold'
                          : 'border-neutral-200 hover:bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="caseStatus"
                          value={st}
                          checked={selectedStatus === st}
                          onChange={() => setSelectedStatus(st as CaseStatus)}
                          className="text-sky-700 focus:ring-sky-700"
                        />
                        <span>{st}</span>
                      </div>
                      {selectedStatus === st && (
                        <CheckCircle2 className="w-4 h-4 text-sky-700" />
                      )}
                    </label>
                  ))}
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    onClick={handleSaveStatus}
                    className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white font-semibold rounded transition-colors cursor-pointer"
                  >
                    Perbarui Status Kasus Ini
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs">
          <div className="text-neutral-500 font-mono-numbers">
            Dibuat: {caseData.createdAt.slice(0, 10)} · Pembaruan Terakhir: {caseData.updatedAt.slice(0, 10)}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-900 text-white rounded font-medium cursor-pointer"
          >
            Tutup Lembar Kasus
          </button>
        </div>

      </div>
    </div>
  );
};
