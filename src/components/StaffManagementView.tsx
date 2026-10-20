import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Plus, 
  Save, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  FileSignature, 
  Phone, 
  Mail, 
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { StaffMember, OfficialsConfig } from '../types/case';
import { DEFAULT_OFFICIALS, INITIAL_STAFF_MEMBERS } from '../data/initialData';

interface StaffManagementViewProps {
  staffList: StaffMember[];
  officials: OfficialsConfig;
  onUpdateOfficials: (officials: OfficialsConfig) => void;
  onAddStaff: (staff: Omit<StaffMember, 'id'>) => void;
  onUpdateStaff: (staff: StaffMember) => void;
  onDeleteStaff: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export const StaffManagementView: React.FC<StaffManagementViewProps> = ({
  staffList,
  officials,
  onUpdateOfficials,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
  onShowToast
}) => {
  // Officials form state
  const [officialsForm, setOfficialsForm] = useState<OfficialsConfig>(officials);

  // Staff form state
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

  const [staffName, setStaffName] = useState('');
  const [staffNip, setStaffNip] = useState('');
  const [staffRole, setStaffRole] = useState('Pekerja Sosial & Case Manager');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffIsActive, setStaffIsActive] = useState(true);

  // Save Officials
  const handleSaveOfficials = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateOfficials(officialsForm);
    onShowToast('Data Pejabat Struktural Dinas PMDP3A & UPTD PPA berhasil diperbarui!');
  };

  const handleResetOfficials = () => {
    if (confirm('Kembalikan data pejabat ke pengaturan awal sistem?')) {
      setOfficialsForm(DEFAULT_OFFICIALS);
      onUpdateOfficials(DEFAULT_OFFICIALS);
      onShowToast('Data pejabat dikembalikan ke nilai default.');
    }
  };

  // Staff Handlers
  const handleStartEditStaff = (staff: StaffMember) => {
    setEditingStaffId(staff.id);
    setStaffName(staff.name);
    setStaffNip(staff.nip || '');
    setStaffRole(staff.role);
    setStaffPhone(staff.phone);
    setStaffEmail(staff.email || '');
    setStaffIsActive(staff.isActive);
    setIsAddingStaff(true);
  };

  const handleCancelStaffForm = () => {
    setIsAddingStaff(false);
    setEditingStaffId(null);
    setStaffName('');
    setStaffNip('');
    setStaffRole('Pekerja Sosial & Case Manager');
    setStaffPhone('');
    setStaffEmail('');
    setStaffIsActive(true);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim()) return;

    if (editingStaffId) {
      onUpdateStaff({
        id: editingStaffId,
        name: staffName.trim(),
        nip: staffNip.trim() || undefined,
        role: staffRole.trim(),
        phone: staffPhone.trim() || '-',
        email: staffEmail.trim() || undefined,
        isActive: staffIsActive
      });
      onShowToast(`Data petugas ${staffName} berhasil diperbarui.`);
    } else {
      onAddStaff({
        name: staffName.trim(),
        nip: staffNip.trim() || undefined,
        role: staffRole.trim(),
        phone: staffPhone.trim() || '-',
        email: staffEmail.trim() || undefined,
        isActive: staffIsActive
      });
      onShowToast(`Petugas baru ${staffName} berhasil ditambahkan.`);
    }

    handleCancelStaffForm();
  };

  const handleDeleteStaffClick = (staff: StaffMember) => {
    if (confirm(`Apakah Anda yakin ingin menghapus petugas ${staff.name}?`)) {
      onDeleteStaff(staff.id);
      onShowToast(`Petugas ${staff.name} telah dihapus.`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-lg border border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-700" />
            <span>Pengaturan Data Pegawai &amp; Pejabat Penandatangan</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Kelola nama pejabat penandatangan dokumen dinas serta daftar petugas pendamping utama (Case Manager) pada Dinas PMDP3A Kabupaten Nagekeo
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              handleCancelStaffForm();
              setIsAddingStaff(true);
            }}
            className="px-3.5 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Petugas Pendamping</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: PEJABAT STRUKTURAL PENANDATANGAN DOKUMEN */}
      <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-sky-700" />
              <span>1. Pejabat Penandatangan Dokumen Resmi (KOP &amp; Pengesahan Laporan)</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Nama dan NIP pejabat di bawah ini otomatis dicetak pada lembar Laporan Triwulan/Tahunan, Berita Acara, dan Surat Rujukan Resmi
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetOfficials}
            className="text-xs text-neutral-500 hover:text-neutral-800 flex items-center gap-1 cursor-pointer"
            title="Kembalikan nama ke pengaturan default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
        </div>

        <form onSubmit={handleSaveOfficials} className="space-y-6 text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* A. Kepala Dinas PMDP3A */}
            <div className="p-4 bg-neutral-50/80 rounded-lg border border-neutral-200 space-y-3">
              <div className="font-bold text-neutral-900 border-b border-neutral-200 pb-2 flex items-center justify-between">
                <span>Kepala Dinas PMDP3A</span>
                <span className="text-[10px] text-sky-800 font-semibold uppercase">Pimpinan Tinggi</span>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Jabatan Lengkap
                </label>
                <input
                  type="text"
                  value={officialsForm.headOfDepartment.title}
                  onChange={(e) => setOfficialsForm({
                    ...officialsForm,
                    headOfDepartment: { ...officialsForm.headOfDepartment, title: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Nama Lengkap &amp; Gelar *
                </label>
                <input
                  type="text"
                  value={officialsForm.headOfDepartment.name}
                  onChange={(e) => setOfficialsForm({
                    ...officialsForm,
                    headOfDepartment: { ...officialsForm.headOfDepartment, name: e.target.value }
                  })}
                  placeholder="Contoh: Drs. Silvester Meo, M.M."
                  className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs font-bold text-neutral-900"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  NIP (18 Digit) *
                </label>
                <input
                  type="text"
                  value={officialsForm.headOfDepartment.nip}
                  onChange={(e) => setOfficialsForm({
                    ...officialsForm,
                    headOfDepartment: { ...officialsForm.headOfDepartment, nip: e.target.value }
                  })}
                  placeholder="19690315 199403 1 007"
                  className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs font-mono-numbers"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Pangkat / Golongan Ruang
                </label>
                <input
                  type="text"
                  value={officialsForm.headOfDepartment.rank || ''}
                  onChange={(e) => setOfficialsForm({
                    ...officialsForm,
                    headOfDepartment: { ...officialsForm.headOfDepartment, rank: e.target.value }
                  })}
                  placeholder="Pembina Utama Muda (IV/c)"
                  className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs"
                />
              </div>
            </div>

            {/* B. Kepala Bidang PPPA */}
            <div className="p-4 bg-neutral-50/80 rounded-lg border border-neutral-200 space-y-3">
              <div className="font-bold text-neutral-900 border-b border-neutral-200 pb-2 flex items-center justify-between">
                <span>Kepala Bidang PPPA</span>
                <span className="text-[10px] text-sky-800 font-semibold uppercase">Administrator</span>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Jabatan Lengkap
                </label>
                <input
                  type="text"
                  value={officialsForm.headOfDivision.title}
                  onChange={(e) => setOfficialsForm({
                    ...officialsForm,
                    headOfDivision: { ...officialsForm.headOfDivision, title: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Nama Lengkap &amp; Gelar *
                </label>
                <input
                  type="text"
                  value={officialsForm.headOfDivision.name}
                  onChange={(e) => setOfficialsForm({
                    ...officialsForm,
                    headOfDivision: { ...officialsForm.headOfDivision, name: e.target.value }
                  })}
                  placeholder="Nama Kepala Bidang PPPA"
                  className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs font-bold text-neutral-900"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  NIP (18 Digit) *
                </label>
                <input
                  type="text"
                  value={officialsForm.headOfDivision.nip}
                  onChange={(e) => setOfficialsForm({
                    ...officialsForm,
                    headOfDivision: { ...officialsForm.headOfDivision, nip: e.target.value }
                  })}
                  placeholder="19750824 200212 2 004"
                  className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs font-mono-numbers"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Pangkat / Golongan Ruang
                </label>
                <input
                  type="text"
                  value={officialsForm.headOfDivision.rank || ''}
                  onChange={(e) => setOfficialsForm({
                    ...officialsForm,
                    headOfDivision: { ...officialsForm.headOfDivision, rank: e.target.value }
                  })}
                  placeholder="Pembina (IV/a)"
                  className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs"
                />
              </div>
            </div>

            {/* C. Kepala UPTD PPA */}
            <div className="p-4 bg-neutral-50/80 rounded-lg border border-neutral-200 space-y-3">
              <div className="font-bold text-neutral-900 border-b border-neutral-200 pb-2 flex items-center justify-between">
                <span>Kepala UPTD PPA</span>
                <span className="text-[10px] text-sky-800 font-semibold uppercase">Kepala Unit Teknis</span>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Jabatan Lengkap
                </label>
                <input
                  type="text"
                  value={officialsForm.headOfUnit.title}
                  onChange={(e) => setOfficialsForm({
                    ...officialsForm,
                    headOfUnit: { ...officialsForm.headOfUnit, title: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Nama Lengkap &amp; Gelar *
                </label>
                <input
                  type="text"
                  value={officialsForm.headOfUnit.name}
                  onChange={(e) => setOfficialsForm({
                    ...officialsForm,
                    headOfUnit: { ...officialsForm.headOfUnit, name: e.target.value }
                  })}
                  placeholder="Contoh: Theresia M. Dapa, S.Sos., M.Si."
                  className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs font-bold text-neutral-900"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  NIP (18 Digit) *
                </label>
                <input
                  type="text"
                  value={officialsForm.headOfUnit.nip}
                  onChange={(e) => setOfficialsForm({
                    ...officialsForm,
                    headOfUnit: { ...officialsForm.headOfUnit, nip: e.target.value }
                  })}
                  placeholder="19780512 200501 2 008"
                  className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs font-mono-numbers"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Pangkat / Golongan Ruang
                </label>
                <input
                  type="text"
                  value={officialsForm.headOfUnit.rank || ''}
                  onChange={(e) => setOfficialsForm({
                    ...officialsForm,
                    headOfUnit: { ...officialsForm.headOfUnit, rank: e.target.value }
                  })}
                  placeholder="Penata Tk. I (III/d)"
                  className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs"
                />
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-2 border-t border-neutral-100">
            <button
              type="submit"
              className="px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-bold flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Pejabat Struktural</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: DAFTAR PETUGAS PENDAMPING UTAMA (CASE MANAGERS) */}
      <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-sky-700" />
              <span>2. Daftar Petugas Pendamping Utama (Case Manager / Peksos / Advokat / Konselor)</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Pegawai yang aktif di tabel ini akan otomatis tampil dalam pilihan <strong>"Petugas Pendamping Utama (Case Manager)"</strong> di formulir pendaftaran kasus dan log pendampingan
            </p>
          </div>

          {!isAddingStaff && (
            <button
              onClick={() => {
                handleCancelStaffForm();
                setIsAddingStaff(true);
              }}
              className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs self-start md:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Petugas</span>
            </button>
          )}
        </div>

        {/* Form Tambah/Edit Petugas */}
        {isAddingStaff && (
          <form onSubmit={handleSaveStaff} className="p-4 bg-sky-50/60 rounded-lg border border-sky-200 space-y-4 text-xs animate-in fade-in duration-150">
            <div className="font-bold text-sky-900 flex items-center justify-between border-b border-sky-200 pb-2">
              <span>{editingStaffId ? 'Edit Data Petugas Pendamping' : 'Input Petugas Pendamping Baru'}</span>
              <span className="text-[11px] font-normal text-sky-700">UPTD PPA Dinas PMDP3A Kab. Nagekeo</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Nama Lengkap Pegawai &amp; Gelar *
                </label>
                <input
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="Contoh: Maria P. S.Sos"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  NIP / NIK / No. Registrasi
                </label>
                <input
                  type="text"
                  value={staffNip}
                  onChange={(e) => setStaffNip(e.target.value)}
                  placeholder="19880414 201101 2 003"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs font-mono-numbers"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Peran / Jabatan Penugasan *
                </label>
                <input
                  type="text"
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value)}
                  placeholder="Case Manager & Asesor / Advokat / Konselor"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Nomor HP / WhatsApp Aktif *
                </label>
                <input
                  type="text"
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                  placeholder="0813-3921-xxxx"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs font-mono-numbers"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                  Email Kantor / Pos-el (Opsional)
                </label>
                <input
                  type="email"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="peksos@nagekeokab.go.id"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded text-xs"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-800">
                  <input
                    type="checkbox"
                    checked={staffIsActive}
                    onChange={(e) => setStaffIsActive(e.target.checked)}
                    className="rounded text-sky-700 focus:ring-sky-700"
                  />
                  <span>Status Aktif (Tampil di Formulir Kasus)</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-sky-200">
              <button
                type="button"
                onClick={handleCancelStaffForm}
                className="px-3.5 py-1.5 border border-neutral-300 bg-white hover:bg-neutral-50 rounded text-neutral-700 font-medium cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{editingStaffId ? 'Simpan Perubahan' : 'Tambahkan Petugas'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tabel Pegawai */}
        <div className="border border-neutral-200 rounded-lg overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
                <th className="py-3 px-3 w-10 text-center font-mono-numbers">#</th>
                <th className="py-3 px-4">Nama Pegawai &amp; NIP</th>
                <th className="py-3 px-4">Peran / Jabatan Penugasan</th>
                <th className="py-3 px-4">Kontak Telepon / Email</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {staffList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500">
                    Belum ada data petugas pendamping. Silakan klik tombol "Tambah Petugas Pendamping" di atas.
                  </td>
                </tr>
              ) : (
                staffList.map((staff, idx) => (
                  <tr key={staff.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-3 text-center text-neutral-400 font-mono-numbers text-[11px]">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-neutral-900">{staff.name}</div>
                      <div className="text-[11px] text-neutral-500 font-mono-numbers">
                        {staff.nip ? `NIP. ${staff.nip}` : 'Non-PNS / Tenaga Ahli'}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-neutral-800">
                      <div className="font-medium">{staff.role}</div>
                      <div className="text-[10px] text-neutral-400">UPTD PPA Dinas PMDP3A</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono-numbers text-neutral-800 flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-neutral-400 shrink-0" />
                        <span>{staff.phone}</span>
                      </div>
                      {staff.email && (
                        <div className="text-[11px] text-neutral-500 flex items-center gap-1.5 truncate max-w-[200px]">
                          <Mail className="w-3 h-3 text-neutral-400 shrink-0" />
                          <span>{staff.email}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded ${
                        staff.isActive 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                      }`}>
                        {staff.isActive ? 'Aktif' : 'Non-Aktif'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStartEditStaff(staff)}
                          className="p-1.5 text-sky-700 hover:text-sky-900 hover:bg-sky-50 rounded cursor-pointer"
                          title="Edit Pegawai"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteStaffClick(staff)}
                          className="p-1.5 text-neutral-400 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                          title="Hapus Pegawai"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-neutral-50 rounded border border-neutral-200 text-xs text-neutral-600 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
          <p>
            Nama pegawai yang berstatus <strong>Aktif</strong> otomatis menjadi pilihan saat menginput kasus baru di menu <em>"Catat Kasus Baru"</em> dan saat mengisi <em>"Catatan Perkembangan Kasus"</em>.
          </p>
        </div>
      </div>
    </div>
  );
};
