import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Eye, 
  EyeOff, 
  FileText, 
  ChevronRight,
  Shield,
  Trash2,
  X
} from 'lucide-react';
import { CaseRecord, DistrictNagekeo, ViolenceType, VictimCategory, CaseStatus } from '../types/case';
import { DISTRICTS_NAGEKEO, VIOLENCE_TYPES } from '../data/initialData';
import { storageService } from '../services/storageService';

interface CaseRegisterViewProps {
  cases: CaseRecord[];
  onSelectCase: (c: CaseRecord) => void;
  onOpenNewCase: () => void;
  onOpenDocumentPrint: (c: CaseRecord, docType: string) => void;
  onDeleteCase: (id: string) => void;
  privacyMode: boolean;
  onTogglePrivacy: () => void;
}

export const CaseRegisterView: React.FC<CaseRegisterViewProps> = ({
  cases,
  onSelectCase,
  onOpenNewCase,
  onOpenDocumentPrint,
  onDeleteCase,
  privacyMode,
  onTogglePrivacy
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedViolenceType, setSelectedViolenceType] = useState<string>('all');

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesReg = c.registrationNumber.toLowerCase().includes(q);
        const matchesName = c.victim.fullName.toLowerCase().includes(q) || c.victim.initials.toLowerCase().includes(q);
        const matchesReporter = c.reporter.name.toLowerCase().includes(q);
        const matchesPerp = c.perpetrator.fullName.toLowerCase().includes(q);
        const matchesVillage = c.victim.village.toLowerCase().includes(q);
        const matchesChronology = c.incident.chronology.toLowerCase().includes(q);
        if (!matchesReg && !matchesName && !matchesReporter && !matchesPerp && !matchesVillage && !matchesChronology) {
          return false;
        }
      }

      // District
      if (selectedDistrict !== 'all' && c.victim.district !== selectedDistrict) {
        return false;
      }

      // Status
      if (selectedStatus !== 'all' && c.status !== selectedStatus) {
        return false;
      }

      // Category
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'Disabilitas') {
          if (!c.victim.hasDisability) return false;
        } else if (c.victim.category !== selectedCategory) {
          return false;
        }
      }

      // Violence Type
      if (selectedViolenceType !== 'all' && c.incident.primaryType !== selectedViolenceType) {
        return false;
      }

      return true;
    });
  }, [cases, searchQuery, selectedDistrict, selectedStatus, selectedCategory, selectedViolenceType]);

  const handleExportCSV = () => {
    storageService.exportToCSV(filteredCases, privacyMode);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDistrict('all');
    setSelectedStatus('all');
    setSelectedCategory('all');
    setSelectedViolenceType('all');
  };

  const hasActiveFilters = searchQuery !== '' || selectedDistrict !== 'all' || selectedStatus !== 'all' || selectedCategory !== 'all' || selectedViolenceType !== 'all';

  return (
    <div className="space-y-4">
      {/* Page Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-neutral-900">
              Buku Register Kasus PPA
            </h1>
            <span className="text-xs text-neutral-400 font-mono-numbers">
              ({filteredCases.length} dari {cases.length} data)
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Daftar resmi registrasi penanganan kasus kekerasan perempuan dan anak Kabupaten Nagekeo
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Privacy Mode Button */}
          <button
            onClick={onTogglePrivacy}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
              privacyMode 
                ? 'bg-amber-50 text-amber-800 border-amber-300' 
                : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            {privacyMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{privacyMode ? 'Sensor Aktif' : 'Privasi Terbuka'}</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-neutral-600" />
            <span>Ekspor CSV</span>
          </button>

          {/* New Case Button */}
          <button
            onClick={onOpenNewCase}
            className="px-3 py-1.5 text-xs font-semibold bg-sky-700 hover:bg-sky-800 text-white rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Kasus</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-neutral-200 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari No. Reg, nama/inisial, desa, kronologi..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-sky-700 focus:bg-white transition-colors"
            />
          </div>

          {/* District Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-sky-700 focus:bg-white"
            >
              <option value="all">Semua Kecamatan</option>
              {DISTRICTS_NAGEKEO.map(d => (
                <option key={d.name} value={d.name}>Kec. {d.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-sky-700 focus:bg-white"
            >
              <option value="all">Semua Status</option>
              <option value="Pengaduan Masuk">Pengaduan Masuk</option>
              <option value="Asesmen & Penjangkauan">Asesmen &amp; Penjangkauan</option>
              <option value="Pendampingan Berjalan">Pendampingan Berjalan</option>
              <option value="Reintegrasi / Pemulihan">Reintegrasi / Pemulihan</option>
              <option value="Selesai / Ditutup">Selesai / Ditutup</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-sky-700 focus:bg-white"
            >
              <option value="all">Semua Kategori</option>
              <option value="Perempuan Dewasa">Perempuan Dewasa</option>
              <option value="Anak Perempuan">Anak Perempuan</option>
              <option value="Anak Laki-Laki">Anak Laki-Laki</option>
              <option value="Disabilitas">Penyandang Disabilitas</option>
            </select>
          </div>

          {/* Violence Type Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedViolenceType}
              onChange={(e) => setSelectedViolenceType(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-sky-700 focus:bg-white"
            >
              <option value="all">Semua Jenis Kasus</option>
              {VIOLENCE_TYPES.map(vt => (
                <option key={vt} value={vt}>{vt}</option>
              ))}
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs text-neutral-500">
            <span>Filter diterapkan pada daftar kasus</span>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-sky-700 hover:text-sky-900 font-medium cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          </div>
        )}
      </div>

      {/* Main High-Density Data Grid */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
                <th className="py-3 px-3 w-10 text-center font-mono-numbers">#</th>
                <th className="py-3 px-3">No. Registrasi &amp; Tanggal</th>
                <th className="py-3 px-3">Korban</th>
                <th className="py-3 px-3">Wilayah (Kec/Desa)</th>
                <th className="py-3 px-3">Bentuk Kekerasan</th>
                <th className="py-3 px-3">Pelaku / Hubungan</th>
                <th className="py-3 px-3">Status Layanan</th>
                <th className="py-3 px-3">Case Manager</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-500">
                    <div className="max-w-sm mx-auto space-y-2">
                      <p className="font-semibold text-neutral-800">Tidak ada data kasus yang cocok</p>
                      <p className="text-xs text-neutral-500">
                        Sesuaikan kata kunci pencarian atau ubah filter kecamatan dan kategori kasus.
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={handleResetFilters}
                          className="mt-2 px-3 py-1 text-xs bg-sky-700 text-white rounded hover:bg-sky-800 cursor-pointer"
                        >
                          Reset Semua Filter
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCases.map((c, index) => {
                  const victimDisplayName = privacyMode ? c.victim.initials : c.victim.fullName;
                  const victimDisplayNIK = privacyMode 
                    ? `${c.victim.nik.slice(0, 4)}********${c.victim.nik.slice(-2)}`
                    : c.victim.nik;

                  return (
                    <tr 
                      key={c.id} 
                      className="hover:bg-neutral-50/80 transition-colors group cursor-pointer"
                      onClick={() => onSelectCase(c)}
                    >
                      {/* Index */}
                      <td className="py-3 px-3 text-center text-neutral-400 font-mono-numbers text-[11px]">
                        {index + 1}
                      </td>

                      {/* Reg Number & Date */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-mono-numbers font-semibold text-neutral-900">
                          {c.registrationNumber}
                        </div>
                        <div className="text-[11px] text-neutral-500 font-mono-numbers">
                          Lapor: {c.reportedDate}
                        </div>
                      </td>

                      {/* Victim Info */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                          <span>{victimDisplayName}</span>
                          {c.victim.hasDisability && (
                            <span className="text-[10px] text-amber-700 font-medium">
                              (Disabilitas)
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          {c.victim.category} · {c.victim.age} Thn · {c.victim.gender === 'Perempuan' ? 'P' : 'L'}
                        </div>
                        <div className="text-[10px] font-mono-numbers text-neutral-400">
                          NIK: {victimDisplayNIK}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-3">
                        <div className="font-medium text-neutral-800">
                          Kec. {c.victim.district}
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate max-w-[130px]">
                          {c.victim.village}
                        </div>
                      </td>

                      {/* Violence Type */}
                      <td className="py-3 px-3">
                        <div className="font-medium text-neutral-900">
                          {c.incident.primaryType}
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate max-w-[170px]" title={c.incident.chronology}>
                          {c.incident.chronology}
                        </div>
                      </td>

                      {/* Perpetrator */}
                      <td className="py-3 px-3">
                        <div className="font-medium text-neutral-800">
                          {privacyMode ? c.perpetrator.initials : c.perpetrator.fullName}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          {c.perpetrator.relationship}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`font-medium ${
                          c.status === 'Selesai / Ditutup'
                            ? 'text-emerald-700'
                            : c.status === 'Pendampingan Berjalan'
                            ? 'text-sky-700'
                            : 'text-amber-700'
                        }`}>
                          {c.status}
                        </span>
                        <div className="text-[10px] text-neutral-400 font-mono-numbers">
                          {c.progressLogs.length} aksi tercatat
                        </div>
                      </td>

                      {/* Case Manager */}
                      <td className="py-3 px-3 text-neutral-700 whitespace-nowrap">
                        <div className="text-xs">{c.caseManager.split(' ')[0]} {c.caseManager.split(' ')[1]}</div>
                        <div className="text-[10px] text-neutral-400">UPTD Nagekeo</div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectCase(c)}
                            className="p-1 text-sky-700 hover:text-sky-900 hover:bg-sky-50 rounded cursor-pointer"
                            title="Buka Lembar Penanganan Kasus"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onOpenDocumentPrint(c, 'berita-acara')}
                            className="p-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded cursor-pointer"
                            title="Cetak Berita Acara Penerimaan Pengaduan"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Apakah Anda yakin ingin menghapus data kasus ${c.registrationNumber}?`)) {
                                onDeleteCase(c.id);
                              }
                            }}
                            className="p-1 text-neutral-400 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                            title="Hapus Arsip Kasus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
