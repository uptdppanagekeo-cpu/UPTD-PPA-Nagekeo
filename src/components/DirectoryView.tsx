import React from 'react';
import { 
  Building2, 
  Phone, 
  MapPin, 
  Shield, 
  Stethoscope, 
  Scale, 
  Home, 
  Users, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PARTNER_AGENCIES, INSTITUTION_INFO } from '../data/initialData';

export const DirectoryView: React.FC = () => {
  const getIconForCategory = (cat: string) => {
    if (cat.includes('Penegak')) return Scale;
    if (cat.includes('Kesehatan')) return Stethoscope;
    if (cat.includes('Hukum')) return Shield;
    if (cat.includes('Perlindungan') || cat.includes('Shelter')) return Home;
    return Building2;
  };

  const puskesmasList = [
    { name: 'Puskesmas Danga', district: 'Kecamatan Aesesa', address: 'Kel. Danga, Mbay', phone: '0852-3901-4432' },
    { name: 'Puskesmas Boawae', district: 'Kecamatan Boawae', address: 'Jl. Lintas Ende-Bajawa', phone: '0813-5321-7789' },
    { name: 'Puskesmas Mauponggo', district: 'Kecamatan Mauponggo', address: 'Desa Mauponggo', phone: '0821-4490-1120' },
    { name: 'Puskesmas Raja', district: 'Kecamatan Aesesa Selatan', address: 'Desa Raja', phone: '0812-4601-9923' },
    { name: 'Puskesmas Nangaroro', district: 'Kecamatan Nangaroro', address: 'Kel. Nangaroro', phone: '0853-3712-4401' },
    { name: 'Puskesmas Maunori', district: 'Kecamatan Keo Tengah', address: 'Desa Maunori', phone: '0813-3988-1092' },
    { name: 'Puskesmas Wolowae', district: 'Kecamatan Wolowae', address: 'Desa Tendatoto', phone: '0812-3811-0943' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-neutral-200">
        <h1 className="text-base font-bold text-neutral-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-sky-700" />
          <span>Jejaring Lembaga Layanan Terpadu Kabupaten Nagekeo</span>
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Daftar kontak instansi rujukan, aparat penegak hukum, fasilitas kesehatan, dan lembaga bantuan hukum mitra UPTD PPA
        </p>
      </div>

      {/* Emergency Hotlines Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-sky-900 text-white rounded-lg border border-sky-800 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-sky-300 font-semibold">
            Hotline UPTD PPA Nagekeo
          </div>
          <div className="text-xl font-bold font-mono-numbers">
            {INSTITUTION_INFO.hotline}
          </div>
          <p className="text-[11px] text-sky-200">
            Layanan pengaduan 24 Jam, pendampingan &amp; penjangkauan darurat
          </p>
        </div>

        <div className="p-4 bg-rose-900 text-white rounded-lg border border-rose-800 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-rose-300 font-semibold">
            Hotline SAPA 129 KemenPPPA
          </div>
          <div className="text-xl font-bold font-mono-numbers">
            129 / WhatsApp 08111-129-129
          </div>
          <p className="text-[11px] text-rose-200">
            Kementerian PPPA Republik Indonesia, bebas pulsa
          </p>
        </div>

        <div className="p-4 bg-neutral-900 text-white rounded-lg border border-neutral-800 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
            Unit PPA Polres Nagekeo
          </div>
          <div className="text-xl font-bold font-mono-numbers">
            0812-3899-7800
          </div>
          <p className="text-[11px] text-neutral-300">
            Penyidik Satreskrim Unit Perlindungan Perempuan dan Anak
          </p>
        </div>
      </div>

      {/* Primary Partner Agencies Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
          Lembaga Rujukan Utama (Pusat Penanganan Terpadu)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PARTNER_AGENCIES.map((agency) => {
            const Icon = getIconForCategory(agency.category);
            return (
              <div 
                key={agency.name}
                className="bg-white p-5 rounded-lg border border-neutral-200 space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-sky-50 text-sky-800 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900">
                        {agency.name}
                      </h3>
                      <p className="text-xs font-medium text-sky-800">
                        {agency.category}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-neutral-600 pt-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{agency.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="font-mono-numbers font-medium text-neutral-800">{agency.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>PIC: {agency.contactPerson}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100">
                  <div className="text-[11px] font-semibold text-neutral-700 mb-1">
                    Cakupan Layanan Terpadu:
                  </div>
                  <ul className="space-y-1 text-xs text-neutral-600">
                    {agency.services.map((srv, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{srv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FKTP Puskesmas Se-Kabupaten Nagekeo */}
      <div className="bg-white p-5 rounded-lg border border-neutral-200 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
          Fasilitas Kesehatan Tingkat Pertama (7 Puskesmas Kecamatan di Nagekeo)
        </h2>
        <p className="text-xs text-neutral-500">
          Pusat layanan awal pertolongan medis pertama dan rujukan visum korban kekerasan di tingkat kecamatan
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {puskesmasList.map((pusk) => (
            <div key={pusk.name} className="p-3 bg-neutral-50 rounded border border-neutral-200 space-y-1 text-xs">
              <div className="font-bold text-neutral-900">{pusk.name}</div>
              <div className="text-sky-800 font-medium">{pusk.district}</div>
              <div className="text-neutral-500">{pusk.address}</div>
              <div className="font-mono-numbers text-neutral-700 pt-1 border-t border-neutral-200">
                Telp: {pusk.phone}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SOP 6 Standar Layanan UPTD PPA Box */}
      <div className="p-5 bg-neutral-50 rounded-lg border border-neutral-200 space-y-3 text-xs">
        <h3 className="font-bold text-neutral-900 text-sm">
          Standar Operasional Prosedur (SOP) 6 Layanan UPTD PPA Kabupaten Nagekeo
        </h3>
        <p className="text-neutral-600 leading-relaxed">
          Berdasarkan Peraturan Presiden No. 65 Tahun 2020 dan PermenPPPA No. 4 Tahun 2018, UPTD PPA menyelenggarakan 6 fungsi layanan wajib tanpa dipungut biaya:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          <div className="p-3 bg-white rounded border border-neutral-200 space-y-1">
            <strong className="text-neutral-900">1. Pengaduan Masyarakat</strong>
            <p className="text-neutral-600">Penerimaan laporan baik langsung, via hotline, maupun rujukan jejaring.</p>
          </div>
          <div className="p-3 bg-white rounded border border-neutral-200 space-y-1">
            <strong className="text-neutral-900">2. Penjangkauan Korban</strong>
            <p className="text-neutral-600">Tim Reaksi Cepat menuju lokasi desa/kelurahan untuk mengamankan korban.</p>
          </div>
          <div className="p-3 bg-white rounded border border-neutral-200 space-y-1">
            <strong className="text-neutral-900">3. Pengelolaan Kasus</strong>
            <p className="text-neutral-600">Case Manager menyusun rencana intervensi hukum, medis, dan psikososial.</p>
          </div>
          <div className="p-3 bg-white rounded border border-neutral-200 space-y-1">
            <strong className="text-neutral-900">4. Penampungan Sementara</strong>
            <p className="text-neutral-600">Pemberian Rumah Aman (Shelter) bagi korban yang terancam jiwanya.</p>
          </div>
          <div className="p-3 bg-white rounded border border-neutral-200 space-y-1">
            <strong className="text-neutral-900">5. Mediasi Non-Kriminal</strong>
            <p className="text-neutral-600">Mediasi keluarga sesuai ketentuan hukum (tidak untuk kekerasan seksual anak).</p>
          </div>
          <div className="p-3 bg-white rounded border border-neutral-200 space-y-1">
            <strong className="text-neutral-900">6. Pendampingan Korban</strong>
            <p className="text-neutral-600">Pendampingan hukum APH, visum RSUD Aeramo, dan pemulihan trauma healing.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
