import React from 'react';
import { 
  ShieldAlert, 
  Users, 
  HeartHandshake, 
  CheckCircle2, 
  MapPin, 
  AlertTriangle,
  ArrowRight,
  Plus,
  FileSpreadsheet,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { CaseRecord, StaffMember } from '../types/case';
import { DISTRICTS_NAGEKEO, INITIAL_STAFF_MEMBERS } from '../data/initialData';
import { googleSheetsService } from '../services/googleSheetsService';

import bannerImage from '../assets/images/banner_layanan_konseling_1792471725565.jpg';
import peksosAvatar from '../assets/images/avatar_petugas_peksos_1792471725438.jpg';
import hukumAvatar from '../assets/images/avatar_petugas_hukum_1792471726224.jpg';

interface DashboardViewProps {
  cases: CaseRecord[];
  staffList?: StaffMember[];
  onSelectCase: (caseItem: CaseRecord) => void;
  onOpenNewCase: () => void;
  onNavigateToRegister: () => void;
  onNavigateToSpreadsheet: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  cases,
  staffList,
  onSelectCase,
  onOpenNewCase,
  onNavigateToRegister
}) => {
  const activeStaff = staffList && staffList.length > 0 
    ? staffList.filter(s => s.isActive)
    : INITIAL_STAFF_MEMBERS;
  const staff1 = activeStaff[0] || INITIAL_STAFF_MEMBERS[0];
  const staff2 = activeStaff[1] || INITIAL_STAFF_MEMBERS[1];

  // Calculations
  const totalCases = cases.length;
  const childVictims = cases.filter(c => c.victim.category === 'Anak Perempuan' || c.victim.category === 'Anak Laki-Laki').length;
  const womenVictims = cases.filter(c => c.victim.category === 'Perempuan Dewasa').length;
  const disabilityVictims = cases.filter(c => c.victim.hasDisability).length;
  
  const activeCases = cases.filter(c => c.status !== 'Selesai / Ditutup').length;
  const closedCases = cases.filter(c => c.status === 'Selesai / Ditutup').length;

  // Breakdown by District
  const districtCounts = DISTRICTS_NAGEKEO.map(dist => {
    const count = cases.filter(c => c.victim.district === dist.name).length;
    const percentage = totalCases > 0 ? Math.round((count / totalCases) * 100) : 0;
    return {
      name: dist.name,
      center: dist.capitalOrCenter,
      count,
      percentage
    };
  }).sort((a, b) => b.count - a.count);

  // Breakdown by Violence Type
  const typeMap: Record<string, number> = {};
  cases.forEach(c => {
    typeMap[c.incident.primaryType] = (typeMap[c.incident.primaryType] || 0) + 1;
  });
  const violenceDistribution = Object.entries(typeMap).sort((a, b) => b[1] - a[1]);

  // Recent priority cases needing attention
  const recentCases = [...cases].sort((a, b) => new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime()).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Editorial Header & Safe Haven Banner */}
      <div className="relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 text-white p-6 md:p-8">
        <div className="absolute inset-0 opacity-25">
          <img 
            src={bannerImage} 
            alt="Ruang Layanan Ramah Perempuan dan Anak UPTD PPA Nagekeo" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="text-xs uppercase tracking-wider font-semibold text-sky-400">
            Sistem Informasi Pencatatan & Pelaporan Kasus (SIPPA)
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white text-balance">
            Pusat Data Perlindungan Perempuan dan Anak Kabupaten Nagekeo
          </h1>
          <p className="text-sm text-neutral-300 leading-relaxed max-w-2xl">
            Pencatatan terpadu penanganan kekerasan berbasis gender dan perlindungan khusus anak di seluruh 7 kecamatan Kabupaten Nagekeo, Nusa Tenggara Timur. Terhubung dengan layanan rujukan kepolisian, medis, psikososial, dan rumah aman.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenNewCase}
              className="px-4 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Input Pengaduan Baru</span>
            </button>
            <button
              onClick={onNavigateToRegister}
              className="px-4 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Buka Register Kasus Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (Tabular Numerals, Clean Single-Level Elevation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cases */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4">
          <div className="flex items-center justify-between text-neutral-600">
            <span className="text-xs font-medium">Total Kasus Tercatat</span>
            <ShieldAlert className="w-4 h-4 text-sky-700" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900 font-mono-numbers">
              {totalCases}
            </span>
            <span className="text-xs text-neutral-500">kasus terverifikasi</span>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center gap-2 text-xs text-neutral-500">
            <span>Tahun Berjalan 2026</span>
            <span aria-hidden="true">·</span>
            <span>Kabupaten Nagekeo</span>
          </div>
        </div>

        {/* Child Victims */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4">
          <div className="flex items-center justify-between text-neutral-600">
            <span className="text-xs font-medium">Korban Usia Anak</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900 font-mono-numbers">
              {childVictims}
            </span>
            <span className="text-xs text-neutral-500">
              ({totalCases > 0 ? Math.round((childVictims / totalCases) * 100) : 0}% total)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center gap-2 text-xs text-neutral-500">
            <span>Usia &lt; 18 tahun</span>
            <span aria-hidden="true">·</span>
            <span>Perlindungan Khusus</span>
          </div>
        </div>

        {/* Women Victims */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4">
          <div className="flex items-center justify-between text-neutral-600">
            <span className="text-xs font-medium">Korban Perempuan Dewasa</span>
            <HeartHandshake className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900 font-mono-numbers">
              {womenVictims}
            </span>
            <span className="text-xs text-neutral-500">
              ({totalCases > 0 ? Math.round((womenVictims / totalCases) * 100) : 0}% total)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center gap-2 text-xs text-neutral-500">
            <span>Kasus KDRT &amp; Lainnya</span>
            <span aria-hidden="true">·</span>
            <span>Pemulihan PMDP3A</span>
          </div>
        </div>

        {/* Active vs Resolved */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4">
          <div className="flex items-center justify-between text-neutral-600">
            <span className="text-xs font-medium">Progres Pendampingan</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900 font-mono-numbers">
              {activeCases}
            </span>
            <span className="text-xs text-neutral-500">kasus aktif berjalan</span>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center gap-2 text-xs text-neutral-500">
            <span className="font-mono-numbers">{closedCases}</span>
            <span>kasus selesai ditutup</span>
            <span aria-hidden="true">·</span>
            <span>{disabilityVictims} disabilitas</span>
          </div>
        </div>
      </div>

      {/* Google Spreadsheet Sync Banner / Integration Widget */}
      {(() => {
        const connected = googleSheetsService.getConnectedSpreadsheet();
        return (
          <div className="bg-gradient-to-r from-emerald-900 to-neutral-900 text-white rounded-xl p-4 md:p-5 border border-emerald-800/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Google Spreadsheet (DINAS PMDP3A)
                  </span>
                  {connected ? (
                    <span className="text-[10px] font-semibold bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Terhubung
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium bg-neutral-800 text-neutral-400 border border-neutral-700 px-2 py-0.5 rounded-full">
                      Belum Terhubung
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-300 mt-0.5">
                  {connected 
                    ? `Sinkron ke: ${connected.title} (3 Tab: Register Kasus, Rekap Kecamatan, & Pegawai)` 
                    : 'Hubungkan dasboard dengan Google Spreadsheet untuk cadangan live, cetak rekap otomatis, dan pelaporan KemenPPPA.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {connected && (
                <a
                  href={connected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-medium text-emerald-200 hover:text-white bg-white/10 hover:bg-white/15 rounded-lg border border-white/15 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Sheet</span>
                </a>
              )}
              <button
                onClick={onNavigateToSpreadsheet}
                className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{connected ? 'Kelola & Sinkronkan' : 'Hubungkan Spreadsheet'}</span>
              </button>
            </div>
          </div>
        );
      })()}

      {/* Two Column Layout: District Geographic Distribution & Violence Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: District Distribution across 7 Sub-districts */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-neutral-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">
                Peta Sebaran Kasus per Kecamatan
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Monitoring 7 wilayah kecamatan di Kabupaten Nagekeo
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-600">
              <MapPin className="w-3.5 h-3.5 text-sky-700" />
              <span>Kabupaten Nagekeo</span>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {districtCounts.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-800">
                      Kecamatan {item.name}
                    </span>
                    <span className="text-neutral-400">·</span>
                    <span className="text-neutral-500 truncate max-w-[180px]">
                      {item.center}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono-numbers">
                    <span className="font-semibold text-neutral-900">
                      {item.count} kasus
                    </span>
                    <span className="text-neutral-400 text-[11px] w-9 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                {/* Progress Visual Bar */}
                <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sky-700 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(item.percentage, item.count > 0 ? 8 : 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-neutral-50 rounded border border-neutral-100 text-xs text-neutral-600 space-y-1">
            <span className="font-semibold text-neutral-800">Prioritas Jangkauan:</span>
            <p className="text-[11px] leading-relaxed text-neutral-500">
              Kecamatan Aesesa (pusat perkotaan Mbay) dan Boawae mencatat frekuensi laporan tertinggi, disusul wilayah pesisir dan perbukitan seperti Mauponggo dan Keo Tengah.
            </p>
          </div>
        </div>

        {/* Right: Violence Categories & Profile */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-neutral-200 p-5 space-y-4">
          <div className="border-b border-neutral-100 pb-3">
            <h2 className="text-sm font-semibold text-neutral-900">
              Klasifikasi Bentuk Kekerasan
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Standar pelaporan SIMFONI PPA KemenPPPA RI
            </p>
          </div>

          <div className="space-y-3">
            {violenceDistribution.map(([type, count]) => {
              const pct = totalCases > 0 ? Math.round((count / totalCases) * 100) : 0;
              return (
                <div key={type} className="flex items-center justify-between text-xs py-1 border-b border-neutral-100 last:border-0">
                  <span className="text-neutral-700 font-medium truncate max-w-[200px]">
                    {type}
                  </span>
                  <div className="flex items-center gap-3 font-mono-numbers">
                    <span className="text-neutral-900 font-semibold">{count}</span>
                    <span className="text-neutral-400 text-[11px]">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Institutional Officers on Duty */}
          <div className="pt-3 border-t border-neutral-100 space-y-3">
            <div className="text-xs font-semibold text-neutral-800">
              Petugas Pendamping Utama Kasus
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2 rounded bg-neutral-50 border border-neutral-100">
                <img 
                  src={peksosAvatar} 
                  alt={staff1.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover shrink-0" 
                />
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-neutral-900 truncate">
                    {staff1.name}
                  </div>
                  <div className="text-[10px] text-neutral-500 truncate">
                    {staff1.role}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded bg-neutral-50 border border-neutral-100">
                <img 
                  src={hukumAvatar} 
                  alt={staff2.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover shrink-0" 
                />
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-neutral-900 truncate">
                    {staff2.name}
                  </div>
                  <div className="text-[10px] text-neutral-500 truncate">
                    {staff2.role}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Cases Requiring Follow-up */}
      <div className="bg-white rounded-lg border border-neutral-200 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">
              Daftar Pengaduan Kasus Terbaru
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Klik baris kasus untuk melihat lembar penanganan, riwayat log, atau cetak berita acara
            </p>
          </div>
          <button
            onClick={onNavigateToRegister}
            className="text-xs font-medium text-sky-700 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Semua Data</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-neutral-100">
          {recentCases.map((c) => (
            <div 
              key={c.id} 
              onClick={() => onSelectCase(c)}
              className="py-3 px-2 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-neutral-50 rounded transition-colors cursor-pointer"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono-numbers text-xs font-semibold text-neutral-900">
                    {c.registrationNumber}
                  </span>
                  <span className="text-neutral-400" aria-hidden="true">·</span>
                  <span className="text-xs text-neutral-700 font-medium">
                    {c.victim.category} ({c.victim.age} Thn)
                  </span>
                  <span className="text-neutral-400" aria-hidden="true">·</span>
                  <span className="text-xs text-neutral-500">
                    Kec. {c.victim.district}
                  </span>
                </div>
                <div className="text-xs text-neutral-600 line-clamp-1">
                  <strong className="text-neutral-800">{c.incident.primaryType}:</strong> {c.incident.chronology}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-neutral-500">
                  <span>Pelapor: {c.reporter.relationshipWithVictim}</span>
                  <span aria-hidden="true">·</span>
                  <span>Petugas: {c.caseManager.split(' ')[0]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{c.progressLogs.length} catatan penanganan</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-xs font-medium ${
                  c.status === 'Selesai / Ditutup' 
                    ? 'text-emerald-700' 
                    : c.status === 'Pendampingan Berjalan' 
                    ? 'text-sky-700' 
                    : 'text-amber-700'
                }`}>
                  {c.status}
                </span>
                <span className="text-xs text-sky-700 font-semibold hover:underline">
                  Buka Berkas
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
