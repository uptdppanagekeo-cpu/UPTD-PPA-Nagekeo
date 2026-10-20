import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Calendar, 
  MapPin, 
  FileSpreadsheet, 
  ShieldCheck,
  Building
} from 'lucide-react';
import { CaseRecord } from '../types/case';
import { DISTRICTS_NAGEKEO, VIOLENCE_TYPES, INSTITUTION_INFO } from '../data/initialData';
import { storageService } from '../services/storageService';
import crestPath from '../assets/images/crest_uptd_ppa_1792471725152.jpg';

interface ReportsViewProps {
  cases: CaseRecord[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ cases }) => {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedPeriod, setSelectedPeriod] = useState<'Tahunan' | 'Triwulan 1' | 'Triwulan 2' | 'Bulanan'>('Tahunan');
  const [selectedMonth, setSelectedMonth] = useState('Semua');

  // Filter cases by year and period
  const filteredCases = cases.filter(c => {
    if (!c.reportedDate.startsWith(selectedYear)) return false;
    
    if (selectedPeriod === 'Triwulan 1') {
      const monthNum = parseInt(c.reportedDate.slice(5, 7), 10);
      return monthNum >= 1 && monthNum <= 3;
    }
    if (selectedPeriod === 'Triwulan 2') {
      const monthNum = parseInt(c.reportedDate.slice(5, 7), 10);
      return monthNum >= 4 && monthNum <= 6;
    }
    if (selectedPeriod === 'Bulanan' && selectedMonth !== 'Semua') {
      return c.reportedDate.slice(5, 7) === selectedMonth;
    }
    return true;
  });

  // Matrix calculations: District x Violence Type
  interface MatrixRow {
    district: string;
    total: number;
    anak: number;
    dewasa: number;
    disabilitas: number;
    byType: Record<string, number>;
  }

  const matrixData: MatrixRow[] = DISTRICTS_NAGEKEO.map(dist => {
    const distCases = filteredCases.filter(c => c.victim.district === dist.name);
    const byType: Record<string, number> = {};
    VIOLENCE_TYPES.forEach(vt => {
      byType[vt] = distCases.filter(c => c.incident.primaryType === vt).length;
    });
    return {
      district: dist.name,
      total: distCases.length,
      anak: distCases.filter(c => c.victim.category.startsWith('Anak')).length,
      dewasa: distCases.filter(c => c.victim.category === 'Perempuan Dewasa').length,
      disabilitas: distCases.filter(c => c.victim.hasDisability).length,
      byType
    };
  });

  // Calculate totals per column
  const totalCasesInPeriod = filteredCases.length;
  const totalAnak = filteredCases.filter(c => c.victim.category.startsWith('Anak')).length;
  const totalDewasa = filteredCases.filter(c => c.victim.category === 'Perempuan Dewasa').length;
  const totalDisabilitas = filteredCases.filter(c => c.victim.hasDisability).length;

  // Layanan diberikan totals
  const totalVisum = filteredCases.filter(c => 
    c.referrals.some(r => r.serviceType.toLowerCase().includes('visum')) ||
    c.requiredServices.some(s => s.toLowerCase().includes('visum'))
  ).length;

  const totalPolres = filteredCases.filter(c => 
    c.referrals.some(r => r.targetAgency.toLowerCase().includes('polres')) ||
    c.requiredServices.some(s => s.toLowerCase().includes('hukum') || s.toLowerCase().includes('aph'))
  ).length;

  const totalShelter = filteredCases.filter(c => 
    c.referrals.some(r => r.serviceType.toLowerCase().includes('shelter') || r.serviceType.toLowerCase().includes('aman')) ||
    c.requiredServices.some(s => s.toLowerCase().includes('aman') || s.toLowerCase().includes('shelter'))
  ).length;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    storageService.exportToCSV(filteredCases, true);
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions Toolbar */}
      <div className="no-print bg-white p-4 rounded-lg border border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-sky-700" />
            <span>Pusat Pelaporan &amp; Rekapitulasi Data Kasus</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Format laporan resmi Bidang Pemberdayaan Perempuan &amp; Perlindungan Anak Kabupaten Nagekeo
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Year selector */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-700">
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            <span>Tahun:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-2 py-1 bg-neutral-50 border border-neutral-300 rounded font-semibold text-xs"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>

          {/* Period selector */}
          <div className="flex items-center gap-1 text-xs">
            {(['Tahunan', 'Triwulan 1', 'Triwulan 2', 'Bulanan'] as const).map(p => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                  selectedPeriod === p
                    ? 'bg-sky-700 text-white font-medium'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {selectedPeriod === 'Bulanan' && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-2 py-1 bg-neutral-50 border border-neutral-300 rounded text-xs"
            >
              <option value="Semua">Semua Bulan</option>
              <option value="01">Januari</option>
              <option value="02">Februari</option>
              <option value="03">Maret</option>
              <option value="04">April</option>
            </select>
          )}

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 rounded text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-neutral-600" />
            <span>Unduh CSV</span>
          </button>

          {/* Print Report */}
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-neutral-900 hover:bg-black text-white rounded text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div className="bg-white p-6 md:p-8 rounded-lg border border-neutral-200 shadow-xs print-container">
        
        {/* Official Letterhead Header (KOP SURAT) */}
        <div className="flex items-center gap-4 border-b-4 border-double border-neutral-900 pb-4 mb-6">
          <div className="w-18 h-18 shrink-0">
            <img 
              src={crestPath} 
              alt="Logo UPTD PPA Kabupaten Nagekeo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('/assets/images/')) {
                  target.src = '/assets/images/crest_uptd_ppa_1792471725152.jpg';
                }
              }}
            />
          </div>
          <div className="flex-1 text-center space-y-0.5">
            <div className="text-xs uppercase tracking-wider font-semibold text-neutral-600">
              Pemerintah Kabupaten Nagekeo
            </div>
            <h2 className="text-sm md:text-base font-bold uppercase tracking-wide text-neutral-900">
              Dinas Pemberdayaan Masyarakat dan Desa, Pemberdayaan Perempuan dan Perlindungan Anak (DINAS PMDP3A)
            </h2>
            <h3 className="text-xs md:text-sm font-semibold uppercase text-sky-900">
              Unit Pelaksana Teknis Daerah Perlindungan Perempuan dan Anak (UPTD PPA)
            </h3>
            <p className="text-[11px] text-neutral-500 font-mono">
              {INSTITUTION_INFO.address} · Telp/Hotline: {INSTITUTION_INFO.hotline} · Email: {INSTITUTION_INFO.email}
            </p>
          </div>
        </div>

        {/* Title of Document */}
        <div className="text-center mb-6 space-y-1">
          <h4 className="text-sm md:text-base font-bold uppercase text-neutral-900 underline">
            Laporan Rekapitulasi Data Kasus Kekerasan terhadap Perempuan dan Anak
          </h4>
          <p className="text-xs text-neutral-600">
            Periode: <strong>{selectedPeriod} {selectedPeriod === 'Bulanan' && selectedMonth !== 'Semua' ? `Bulan ${selectedMonth}` : ''} Tahun {selectedYear}</strong> · Wilayah: Kabupaten Nagekeo
          </p>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="p-3 bg-neutral-50 rounded border border-neutral-200 text-center">
            <div className="text-neutral-500 text-[11px]">Total Kasus Teregister</div>
            <div className="text-xl font-bold font-mono-numbers text-neutral-900 mt-1">{totalCasesInPeriod}</div>
            <div className="text-[10px] text-neutral-400">Kasus Masuk Periode Ini</div>
          </div>
          <div className="p-3 bg-neutral-50 rounded border border-neutral-200 text-center">
            <div className="text-neutral-500 text-[11px]">Korban Anak (&lt;18 Thn)</div>
            <div className="text-xl font-bold font-mono-numbers text-amber-700 mt-1">{totalAnak}</div>
            <div className="text-[10px] text-neutral-400">{totalCasesInPeriod > 0 ? Math.round((totalAnak / totalCasesInPeriod) * 100) : 0}% dari Total</div>
          </div>
          <div className="p-3 bg-neutral-50 rounded border border-neutral-200 text-center">
            <div className="text-neutral-500 text-[11px]">Korban Perempuan Dewasa</div>
            <div className="text-xl font-bold font-mono-numbers text-rose-700 mt-1">{totalDewasa}</div>
            <div className="text-[10px] text-neutral-400">{totalCasesInPeriod > 0 ? Math.round((totalDewasa / totalCasesInPeriod) * 100) : 0}% dari Total</div>
          </div>
          <div className="p-3 bg-neutral-50 rounded border border-neutral-200 text-center">
            <div className="text-neutral-500 text-[11px]">Korban Disabilitas</div>
            <div className="text-xl font-bold font-mono-numbers text-sky-800 mt-1">{totalDisabilitas}</div>
            <div className="text-[10px] text-neutral-400">Perlindungan Afirmatif</div>
          </div>
        </div>

        {/* SECTION A: Matriks Sebaran per Kecamatan & Bentuk Kekerasan */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold uppercase text-neutral-900">
              Tabel 1: Matriks Kasus Berdasarkan Wilayah Kecamatan &amp; Bentuk Kekerasan
            </h5>
            <span className="text-[11px] text-neutral-500 font-mono-numbers">Satuan: Kasus</span>
          </div>

          <div className="overflow-x-auto border border-neutral-300 rounded">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-neutral-300 text-neutral-800 font-bold">
                  <th className="py-2.5 px-3 border-r border-neutral-300 w-8 text-center font-mono-numbers">No</th>
                  <th className="py-2.5 px-3 border-r border-neutral-300">Kecamatan</th>
                  <th className="py-2.5 px-2 border-r border-neutral-300 text-center font-mono-numbers">Seksual</th>
                  <th className="py-2.5 px-2 border-r border-neutral-300 text-center font-mono-numbers">Fisik</th>
                  <th className="py-2.5 px-2 border-r border-neutral-300 text-center font-mono-numbers">Psikis</th>
                  <th className="py-2.5 px-2 border-r border-neutral-300 text-center font-mono-numbers">Penelantaran</th>
                  <th className="py-2.5 px-2 border-r border-neutral-300 text-center font-mono-numbers">TPPO</th>
                  <th className="py-2.5 px-2 border-r border-neutral-300 text-center font-mono-numbers">KBGO</th>
                  <th className="py-2.5 px-2 border-r border-neutral-300 text-center font-mono-numbers">Lainnya</th>
                  <th className="py-2.5 px-3 text-center font-bold bg-neutral-200/70 font-mono-numbers">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {matrixData.map((row, idx) => (
                  <tr key={row.district} className="hover:bg-neutral-50">
                    <td className="py-2 px-3 border-r border-neutral-200 text-center font-mono-numbers">{idx + 1}</td>
                    <td className="py-2 px-3 border-r border-neutral-200 font-medium text-neutral-900">
                      Kecamatan {row.district}
                    </td>
                    <td className="py-2 px-2 border-r border-neutral-200 text-center font-mono-numbers">{row.byType['Kekerasan Seksual'] || 0}</td>
                    <td className="py-2 px-2 border-r border-neutral-200 text-center font-mono-numbers">{row.byType['Kekerasan Fisik'] || 0}</td>
                    <td className="py-2 px-2 border-r border-neutral-200 text-center font-mono-numbers">{row.byType['Kekerasan Psikis'] || 0}</td>
                    <td className="py-2 px-2 border-r border-neutral-200 text-center font-mono-numbers">{row.byType['Penelantaran Rumah Tangga'] || 0}</td>
                    <td className="py-2 px-2 border-r border-neutral-200 text-center font-mono-numbers">{row.byType['TPPO / Perdagangan Orang'] || 0}</td>
                    <td className="py-2 px-2 border-r border-neutral-200 text-center font-mono-numbers">{row.byType['Kekerasan Berbasis Gender Online (KBGO)'] || 0}</td>
                    <td className="py-2 px-2 border-r border-neutral-200 text-center font-mono-numbers">{row.byType['Lainnya (Hak Asuh / Pernikahan Anak)'] || 0}</td>
                    <td className="py-2 px-3 text-center font-bold bg-neutral-100 font-mono-numbers text-neutral-900">
                      {row.total}
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-neutral-200/80 font-bold border-t-2 border-neutral-400">
                  <td colSpan={2} className="py-2.5 px-3 text-center border-r border-neutral-300">
                    JUMLAH TOTAL
                  </td>
                  <td className="py-2.5 px-2 text-center border-r border-neutral-300 font-mono-numbers">
                    {matrixData.reduce((acc, r) => acc + (r.byType['Kekerasan Seksual'] || 0), 0)}
                  </td>
                  <td className="py-2.5 px-2 text-center border-r border-neutral-300 font-mono-numbers">
                    {matrixData.reduce((acc, r) => acc + (r.byType['Kekerasan Fisik'] || 0), 0)}
                  </td>
                  <td className="py-2.5 px-2 text-center border-r border-neutral-300 font-mono-numbers">
                    {matrixData.reduce((acc, r) => acc + (r.byType['Kekerasan Psikis'] || 0), 0)}
                  </td>
                  <td className="py-2.5 px-2 text-center border-r border-neutral-300 font-mono-numbers">
                    {matrixData.reduce((acc, r) => acc + (r.byType['Penelantaran Rumah Tangga'] || 0), 0)}
                  </td>
                  <td className="py-2.5 px-2 text-center border-r border-neutral-300 font-mono-numbers">
                    {matrixData.reduce((acc, r) => acc + (r.byType['TPPO / Perdagangan Orang'] || 0), 0)}
                  </td>
                  <td className="py-2.5 px-2 text-center border-r border-neutral-300 font-mono-numbers">
                    {matrixData.reduce((acc, r) => acc + (r.byType['Kekerasan Berbasis Gender Online (KBGO)'] || 0), 0)}
                  </td>
                  <td className="py-2.5 px-2 text-center border-r border-neutral-300 font-mono-numbers">
                    {matrixData.reduce((acc, r) => acc + (r.byType['Lainnya (Hak Asuh / Pernikahan Anak)'] || 0), 0)}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono-numbers text-neutral-900">
                    {totalCasesInPeriod}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION B: Ringkasan Layanan Rujukan Terkoordinasi */}
        <div className="space-y-3 mb-8">
          <h5 className="text-xs font-bold uppercase text-neutral-900">
            Tabel 2: Rekapitulasi Rujukan Layanan &amp; Penegakan Hukum
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 border border-neutral-200 rounded space-y-1">
              <div className="font-semibold text-neutral-800">Layanan Visum &amp; Medis</div>
              <div className="text-xl font-bold font-mono-numbers text-sky-800">{totalVisum} Kasus</div>
              <p className="text-[11px] text-neutral-500">Dirujuk ke RSUD Aeramo &amp; Puskesmas Nagekeo</p>
            </div>
            <div className="p-3 border border-neutral-200 rounded space-y-1">
              <div className="font-semibold text-neutral-800">Layanan Penegakan Hukum (APH)</div>
              <div className="text-xl font-bold font-mono-numbers text-sky-800">{totalPolres} Kasus</div>
              <p className="text-[11px] text-neutral-500">Didampingi ke Unit PPA Satreskrim Polres Nagekeo</p>
            </div>
            <div className="p-3 border border-neutral-200 rounded space-y-1">
              <div className="font-semibold text-neutral-800">Perlindungan Rumah Aman (Shelter)</div>
              <div className="text-xl font-bold font-mono-numbers text-sky-800">{totalShelter} Kasus</div>
              <p className="text-[11px] text-neutral-500">Ditempatkan di Shelter Sementara / Kasih Bunda</p>
            </div>
          </div>
        </div>

        {/* Signature & Authentication Section (Khas Dokumen Pemkab) */}
        <div className="mt-8 pt-6 border-t border-neutral-200 grid grid-cols-2 gap-8 text-xs text-center">
          <div className="space-y-16">
            <div>
              <p className="text-neutral-600">Mengetahui,</p>
              <p className="font-bold text-neutral-900 uppercase">
                Kepala Dinas PMDP3A Kabupaten Nagekeo
              </p>
            </div>
            <div>
              <p className="font-bold text-neutral-900 underline uppercase">
                {INSTITUTION_INFO.headOfDepartment}
              </p>
              <p className="text-neutral-500 font-mono-numbers">
                NIP. {INSTITUTION_INFO.nipDepartmentHead}
              </p>
            </div>
          </div>

          <div className="space-y-16">
            <div>
              <p className="text-neutral-600">Mbay, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="font-bold text-neutral-900 uppercase">
                Kepala UPTD Perlindungan Perempuan dan Anak Kabupaten Nagekeo
              </p>
            </div>
            <div>
              <p className="font-bold text-neutral-900 underline uppercase">
                {INSTITUTION_INFO.headOfUnit}
              </p>
              <p className="text-neutral-500 font-mono-numbers">
                NIP. {INSTITUTION_INFO.nipHead}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
