import React, { useState } from 'react';
import { 
  Printer, 
  FileText, 
  Building2, 
  Shield, 
  Check, 
  Calendar,
  User,
  ChevronDown
} from 'lucide-react';
import { CaseRecord } from '../types/case';
import { INSTITUTION_INFO } from '../data/initialData';
import crestPath from '../assets/images/crest_uptd_ppa_1792471725152.jpg';

interface OfficialDocumentsViewProps {
  cases: CaseRecord[];
  initialCaseId?: string;
  initialDocType?: string;
}

export const OfficialDocumentsView: React.FC<OfficialDocumentsViewProps> = ({
  cases,
  initialCaseId,
  initialDocType = 'berita-acara'
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    initialCaseId || (cases.length > 0 ? cases[0].id : '')
  );
  const [docType, setDocType] = useState<string>(initialDocType);
  const [maskPrivacy, setMaskPrivacy] = useState(false);

  const selectedCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  const handlePrint = () => {
    window.print();
  };

  if (!selectedCase) {
    return (
      <div className="bg-white p-8 rounded-lg border border-neutral-200 text-center text-neutral-500">
        Belum ada data kasus yang dapat dicetak. Silakan tambahkan data kasus terlebih dahulu.
      </div>
    );
  }

  const victimName = maskPrivacy ? selectedCase.victim.initials : selectedCase.victim.fullName;
  const perpName = maskPrivacy ? selectedCase.perpetrator.initials : selectedCase.perpetrator.fullName;
  const victimNIK = maskPrivacy 
    ? `${selectedCase.victim.nik.slice(0, 4)}********${selectedCase.victim.nik.slice(-2)}` 
    : selectedCase.victim.nik;

  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Control Strip for Selecting Template and Case */}
      <div className="no-print bg-white p-4 rounded-lg border border-neutral-200 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-3">
          <div>
            <h1 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-700" />
              <span>Generator Dokumen Resmi Ber-Kop Surat Dinas</span>
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Pilih kasus dan jenis dokumen administrasi hukum / medis / berita acara UPTD PPA Kabupaten Nagekeo
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                checked={maskPrivacy}
                onChange={(e) => setMaskPrivacy(e.target.checked)}
                className="rounded text-sky-700 focus:ring-sky-700"
              />
              <span>Sensor NIK/Nama Korban di Berkas</span>
            </label>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
              Pilih Berkas Kasus:
            </label>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded text-xs font-medium"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.registrationNumber} - {c.victim.fullName} ({c.incident.primaryType} - Kec. {c.victim.district})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
              Pilih Format Dokumen Resmi:
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded text-xs font-medium"
            >
              <option value="berita-acara">1. Berita Acara Penerimaan Pengaduan Kasus (BAPP)</option>
              <option value="tanda-terima">2. Surat Tanda Bukti Penerimaan Pengaduan (STTP)</option>
              <option value="rujukan-visum">3. Surat Permohonan Visum et Repertum ke RSUD Aeramo</option>
              <option value="rujukan-polres">4. Surat Permohonan Pendampingan Hukum ke Polres Nagekeo</option>
              <option value="rujukan-shelter">5. Surat Pengantar Penempatan Rumah Aman (Shelter)</option>
            </select>
          </div>
        </div>
      </div>

      {/* DOCUMENT PREVIEW CONTAINER (PRINTABLE AREA) */}
      <div className="bg-white p-8 md:p-12 rounded-lg border border-neutral-300 shadow-sm print-container max-w-4xl mx-auto space-y-6 text-neutral-900 leading-normal">
        
        {/* KOP SURAT RESMI PEMERINTAH KABUPATEN NAGEKEO */}
        <div className="flex items-center gap-4 border-b-4 border-double border-neutral-900 pb-3">
          <div className="w-20 h-20 shrink-0">
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
            <h2 className="text-sm md:text-base font-bold uppercase tracking-wider text-neutral-900">
              Pemerintah Kabupaten Nagekeo
            </h2>
            <h1 className="text-sm md:text-base font-extrabold uppercase tracking-tight text-neutral-900">
              Dinas Pemberdayaan Masyarakat dan Desa, Pemberdayaan Perempuan dan Perlindungan Anak (DINAS PMDP3A)
            </h1>
            <h3 className="text-xs md:text-sm font-bold uppercase tracking-wide text-sky-900">
              Unit Pelaksana Teknis Daerah Perlindungan Perempuan dan Anak (UPTD PPA)
            </h3>
            <p className="text-[11px] text-neutral-600 font-sans">
              {INSTITUTION_INFO.address}
            </p>
            <p className="text-[10px] text-neutral-500 font-mono">
              Hotline Layanan: {INSTITUTION_INFO.hotline} · Pos-el: {INSTITUTION_INFO.email}
            </p>
          </div>
        </div>

        {/* TEMPLATE 1: BERITA ACARA PENERIMAAN PENGADUAN (BAPP) */}
        {docType === 'berita-acara' && (
          <div className="space-y-5 text-xs text-neutral-800">
            <div className="text-center space-y-1">
              <h4 className="text-sm font-bold uppercase underline">
                Berita Acara Penerimaan Pengaduan Kasus
              </h4>
              <p className="font-mono-numbers text-xs font-semibold">
                Nomor: BA.PPA/{selectedCase.registrationNumber.replace('REG/', '')}
              </p>
            </div>

            <p className="text-justify leading-relaxed">
              Pada hari ini, tanggal <strong>{selectedCase.reportedDate}</strong>, bertempat di Kantor UPTD Perlindungan Perempuan dan Anak Kabupaten Nagekeo, telah datang seorang pelapor untuk menyampaikan laporan dugaan tindak kekerasan terhadap perempuan / anak, dengan rincian keterangan sebagai berikut:
            </p>

            {/* I. Identitas Pelapor */}
            <div className="space-y-1">
              <div className="font-bold uppercase text-neutral-900">I. Identitas Pelapor</div>
              <div className="grid grid-cols-12 gap-y-1 pl-4">
                <div className="col-span-4 font-medium">1. Nama Lengkap</div>
                <div className="col-span-8">: {maskPrivacy ? 'Pelapor Terlindungi' : selectedCase.reporter.name}</div>
                
                <div className="col-span-4 font-medium">2. Hubungan dg Korban</div>
                <div className="col-span-8">: {selectedCase.reporter.relationshipWithVictim}</div>
                
                <div className="col-span-4 font-medium">3. Nomor Telepon / HP</div>
                <div className="col-span-8 font-mono-numbers">: {maskPrivacy ? '0812-****-****' : selectedCase.reporter.phone}</div>
                
                <div className="col-span-4 font-medium">4. Alamat Tempat Tinggal</div>
                <div className="col-span-8">: {selectedCase.reporter.address}</div>
                
                <div className="col-span-4 font-medium">5. Saluran Pengaduan</div>
                <div className="col-span-8">: {selectedCase.reporter.channel}</div>
              </div>
            </div>

            {/* II. Identitas Korban */}
            <div className="space-y-1">
              <div className="font-bold uppercase text-neutral-900">II. Identitas Korban</div>
              <div className="grid grid-cols-12 gap-y-1 pl-4">
                <div className="col-span-4 font-medium">1. Nama / Inisial</div>
                <div className="col-span-8 font-bold">: {victimName}</div>
                
                <div className="col-span-4 font-medium">2. Nomor Induk Kependudukan (NIK)</div>
                <div className="col-span-8 font-mono-numbers">: {victimNIK}</div>
                
                <div className="col-span-4 font-medium">3. Usia / Jenis Kelamin</div>
                <div className="col-span-8">: {selectedCase.victim.age} Tahun / {selectedCase.victim.gender} ({selectedCase.victim.category})</div>
                
                <div className="col-span-4 font-medium">4. Pendidikan / Pekerjaan</div>
                <div className="col-span-8">: {selectedCase.victim.education} / {selectedCase.victim.occupation}</div>
                
                <div className="col-span-4 font-medium">5. Status Perkawinan</div>
                <div className="col-span-8">: {selectedCase.victim.maritalStatus}</div>
                
                <div className="col-span-4 font-medium">6. Alamat Domisili</div>
                <div className="col-span-8">: {selectedCase.victim.addressStreet}, {selectedCase.victim.village}, Kecamatan {selectedCase.victim.district}, Kab. Nagekeo</div>

                {selectedCase.victim.hasDisability && (
                  <>
                    <div className="col-span-4 font-medium">7. Ragam Disabilitas</div>
                    <div className="col-span-8 text-amber-900 font-semibold">: {selectedCase.victim.disabilityType || 'Penyandang Disabilitas'}</div>
                  </>
                )}
              </div>
            </div>

            {/* III. Identitas Terlapor */}
            <div className="space-y-1">
              <div className="font-bold uppercase text-neutral-900">III. Identitas Terlapor / Pelaku</div>
              <div className="grid grid-cols-12 gap-y-1 pl-4">
                <div className="col-span-4 font-medium">1. Nama / Inisial</div>
                <div className="col-span-8 font-bold">: {perpName}</div>
                
                <div className="col-span-4 font-medium">2. Hubungan dengan Korban</div>
                <div className="col-span-8">: {selectedCase.perpetrator.relationship}</div>
                
                <div className="col-span-4 font-medium">3. Perkiraan Usia / Pekerjaan</div>
                <div className="col-span-8">: {selectedCase.perpetrator.age ? `${selectedCase.perpetrator.age} Tahun` : '-'} / {selectedCase.perpetrator.occupation || '-'}</div>
                
                <div className="col-span-4 font-medium">4. Status Hukum Saat Ini</div>
                <div className="col-span-8">: {selectedCase.perpetrator.statusLegal || 'Dalam Penyelidikan'}</div>
              </div>
            </div>

            {/* IV. Uraian Peristiwa */}
            <div className="space-y-1">
              <div className="font-bold uppercase text-neutral-900">IV. Bentuk Tindak Kekerasan &amp; Kronologis Peristiwa</div>
              <div className="pl-4 space-y-1 text-justify">
                <p>
                  <strong>Bentuk Kekerasan:</strong> {selectedCase.incident.primaryType} {selectedCase.incident.secondaryTypes.length > 0 ? `(disertai ${selectedCase.incident.secondaryTypes.join(', ')})` : ''}
                </p>
                <p>
                  <strong>Waktu &amp; Tempat Kejadian:</strong> {selectedCase.incidentDate} di {selectedCase.incident.locationType} ({selectedCase.incident.locationDetail}).
                </p>
                <p className="p-3 bg-neutral-50 rounded border border-neutral-200 whitespace-pre-line leading-relaxed">
                  "{selectedCase.incident.chronology}"
                </p>
              </div>
            </div>

            {/* V. Rencana Penanganan */}
            <div className="space-y-1">
              <div className="font-bold uppercase text-neutral-900">V. Rencana Layanan Segera UPTD PPA</div>
              <div className="pl-4">
                <ul className="list-disc list-inside space-y-0.5">
                  {selectedCase.requiredServices.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-justify leading-relaxed pt-2">
              Demikian Berita Acara Penerimaan Pengaduan ini dibuat dengan sebenarnya sesuai dengan keterangan yang diberikan oleh Pelapor/Korban tanpa adanya paksaan dari pihak manapun, untuk dipergunakan sebagaimana mestinya dalam proses perlindungan dan penegakan hukum.
            </p>

            {/* Signature Block */}
            <div className="pt-8 grid grid-cols-2 text-center text-xs">
              <div className="space-y-16">
                <div>
                  <p>Pelapor / Korban,</p>
                </div>
                <div>
                  <p className="font-bold underline uppercase">
                    ( {maskPrivacy ? 'Pelapor Terlindungi' : selectedCase.reporter.name} )
                  </p>
                </div>
              </div>

              <div className="space-y-16">
                <div>
                  <p>Mbay, {selectedCase.reportedDate}</p>
                  <p>Petugas Penerima Pengaduan,</p>
                </div>
                <div>
                  <p className="font-bold underline uppercase">
                    {selectedCase.caseManager.split(' ')[0]} {selectedCase.caseManager.split(' ')[1]}
                  </p>
                  <p className="text-[10px] text-neutral-500">Case Manager UPTD PPA Nagekeo</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATE 2: SURAT PERMOHONAN VISUM ET REPERTUM KE RSUD AERAMO */}
        {docType === 'rujukan-visum' && (
          <div className="space-y-5 text-xs text-neutral-800">
            {/* Header Surat Keluar */}
            <div className="flex justify-between items-start pt-2">
              <div className="space-y-1">
                <div><strong>Nomor:</strong> 463/UPTD-PPA/VR/{selectedCase.registrationNumber.slice(-3)}/2026</div>
                <div><strong>Sifat:</strong> RAHASIA / SEGERA</div>
                <div><strong>Lampiran:</strong> 1 (satu) Berkas</div>
                <div><strong>Perihal:</strong> Permohonan Pemeriksaan Visum et Repertum</div>
              </div>
              <div className="text-right">
                <p>Mbay, {todayFormatted}</p>
                <div className="mt-3 text-left">
                  <p>Kepada Yth.</p>
                  <p className="font-bold">Direktur RSUD Aeramo Kabupaten Nagekeo</p>
                  <p>c.q. Dokter Pemeriksa / IGD &amp; Poli PONEK</p>
                  <p>di -</p>
                  <p className="pl-4 font-semibold">Aeramo, Kec. Aesesa</p>
                </div>
              </div>
            </div>

            <p className="text-justify leading-relaxed pt-3">
              Dengan hormat,
              <br />
              Sehubungan dengan laporan dugaan tindak kekerasan terhadap <strong>{selectedCase.victim.category}</strong> yang diterima oleh Unit Pelaksana Teknis Daerah Perlindungan Perempuan dan Anak (UPTD PPA) Kabupaten Nagekeo dengan Nomor Register: <strong>{selectedCase.registrationNumber}</strong>, bersama ini kami menghadapkan korban:
            </p>

            <div className="pl-6 space-y-1 bg-neutral-50 p-3 rounded border border-neutral-200">
              <div className="grid grid-cols-12 gap-y-1">
                <div className="col-span-4 font-medium">Nama Korban</div>
                <div className="col-span-8 font-bold">: {victimName}</div>

                <div className="col-span-4 font-medium">NIK</div>
                <div className="col-span-8 font-mono-numbers">: {victimNIK}</div>

                <div className="col-span-4 font-medium">Tempat, Tgl Lahir / Usia</div>
                <div className="col-span-8">: Nagekeo / {selectedCase.victim.age} Tahun ({selectedCase.victim.gender})</div>

                <div className="col-span-4 font-medium">Alamat Tempat Tinggal</div>
                <div className="col-span-8">: {selectedCase.victim.addressStreet}, {selectedCase.victim.village}, Kec. {selectedCase.victim.district}</div>

                <div className="col-span-4 font-medium">Dugaan Bentuk Kekerasan</div>
                <div className="col-span-8 font-bold text-red-800">: {selectedCase.incident.primaryType}</div>
              </div>
            </div>

            <p className="text-justify leading-relaxed">
              Untuk dimohonkan bantuan pemeriksaan medis luka fisik/kebidanan dan penerbitan <strong>Visum et Repertum (VER)</strong> sebagai alat bukti sah pro-justitia sesuai dengan ketentuan perundang-undangan yang berlaku (KUHAP Pasal 133 dan UU No. 12 Tahun 2022 tentang Tindak Pidana Kekerasan Seksual).
            </p>

            <p className="text-justify leading-relaxed">
              Korban didampingi langsung oleh Petugas Pendamping UPTD PPA Kabupaten Nagekeo atas nama: <strong>{selectedCase.caseManager}</strong>.
            </p>

            <p className="text-justify leading-relaxed">
              Demikian permohonan ini kami sampaikan, atas kerjasama dan bantuan kemanusiaan pihak RSUD Aeramo kami ucapkan limpah terima kasih.
            </p>

            {/* Signature Block */}
            <div className="pt-6 flex justify-end">
              <div className="w-72 text-center space-y-16">
                <div>
                  <p>Kepala UPTD Perlindungan Perempuan dan Anak</p>
                  <p>Kabupaten Nagekeo,</p>
                </div>
                <div>
                  <p className="font-bold underline uppercase">{INSTITUTION_INFO.headOfUnit}</p>
                  <p className="font-mono-numbers text-[10px] text-neutral-500">NIP. {INSTITUTION_INFO.nipHead}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATE 3: SURAT RUJUKAN HUKUM KE POLRES NAGEKEO */}
        {docType === 'rujukan-polres' && (
          <div className="space-y-5 text-xs text-neutral-800">
            <div className="flex justify-between items-start pt-2">
              <div className="space-y-1">
                <div><strong>Nomor:</strong> 463/UPTD-PPA/POL/{selectedCase.registrationNumber.slice(-3)}/2026</div>
                <div><strong>Sifat:</strong> RAHASIA</div>
                <div><strong>Lampiran:</strong> 1 (satu) Berkas Berita Acara</div>
                <div><strong>Perihal:</strong> Permohonan Bantuan Penegakan Hukum Kasus PPA</div>
              </div>
              <div className="text-right">
                <p>Mbay, {todayFormatted}</p>
                <div className="mt-3 text-left">
                  <p>Kepada Yth.</p>
                  <p className="font-bold">Kepala Kepolisian Resor Nagekeo</p>
                  <p>u.p. Kasat Reskrim / Kanit PPA Polres Nagekeo</p>
                  <p>di -</p>
                  <p className="pl-4 font-semibold">Mbay</p>
                </div>
              </div>
            </div>

            <p className="text-justify leading-relaxed pt-3">
              Dengan hormat,
              <br />
              Berdasarkan mandat Peraturan Menteri PPPA No. 4 Tahun 2018 tentang Pedoman Pembentukan UPTD PPA dan Nota Kesepahaman Penanganan Terpadu Kekerasan terhadap Perempuan dan Anak di Kabupaten Nagekeo, bersama ini kami meneruskan laporan pengaduan dugaan tindak pidana kekerasan:
            </p>

            <div className="pl-6 space-y-1 bg-neutral-50 p-3 rounded border border-neutral-200">
              <div className="grid grid-cols-12 gap-y-1">
                <div className="col-span-4 font-medium">Bentuk Kekerasan</div>
                <div className="col-span-8 font-bold text-red-900">: {selectedCase.incident.primaryType}</div>

                <div className="col-span-4 font-medium">Korban</div>
                <div className="col-span-8 font-bold">: {victimName} ({selectedCase.victim.age} Thn / {selectedCase.victim.category})</div>

                <div className="col-span-4 font-medium">Terlapor / Terduga Pelaku</div>
                <div className="col-span-8 font-bold">: {perpName} (Hubungan: {selectedCase.perpetrator.relationship})</div>

                <div className="col-span-4 font-medium">TKP</div>
                <div className="col-span-8">: {selectedCase.incident.locationDetail}, Kec. {selectedCase.victim.district}</div>
              </div>
            </div>

            <p className="text-justify leading-relaxed">
              Memohon bantuan pihak Kepolisian Resor Nagekeo untuk dapat menindaklanjuti secara hukum, pembuatan Laporan Polisi (LP), serta pemeriksaan saksi korban dengan prinsip perlindungan hak saksi dan korban yang ramah anak dan berperspektif korban.
            </p>

            <div className="pt-6 flex justify-end">
              <div className="w-72 text-center space-y-16">
                <div>
                  <p>Kepala UPTD Perlindungan Perempuan dan Anak</p>
                  <p>Kabupaten Nagekeo,</p>
                </div>
                <div>
                  <p className="font-bold underline uppercase">{INSTITUTION_INFO.headOfUnit}</p>
                  <p className="font-mono-numbers text-[10px] text-neutral-500">NIP. {INSTITUTION_INFO.nipHead}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATE 4: SURAT TANDA BUKTI PENERIMAAN PENGADUAN (STTP) */}
        {docType === 'tanda-terima' && (
          <div className="space-y-5 text-xs text-neutral-800">
            <div className="text-center space-y-1">
              <h4 className="text-sm font-bold uppercase underline">
                Surat Tanda Bukti Penerimaan Pengaduan Kasus
              </h4>
              <p className="font-mono-numbers text-xs font-semibold">
                Nomor: STTP/UPTD-PPA/{selectedCase.registrationNumber.replace('REG/', '')}
              </p>
            </div>

            <p className="text-justify leading-relaxed">
              Telah diterima di Kantor UPTD Perlindungan Perempuan dan Anak (UPTD PPA) Dinas PMDP3A Kabupaten Nagekeo, pengaduan dugaan kekerasan dengan data:
            </p>

            <div className="p-4 bg-neutral-50 rounded border border-neutral-200 space-y-2">
              <div><strong>Nomor Registrasi:</strong> <span className="font-mono-numbers font-bold text-sky-800">{selectedCase.registrationNumber}</span></div>
              <div><strong>Tanggal Lapor:</strong> {selectedCase.reportedDate}</div>
              <div><strong>Nama Pelapor:</strong> {maskPrivacy ? 'Pelapor Terlindungi' : selectedCase.reporter.name} ({selectedCase.reporter.relationshipWithVictim})</div>
              <div><strong>Nama Korban:</strong> {victimName} ({selectedCase.victim.category})</div>
              <div><strong>Dugaan Bentuk Kekerasan:</strong> {selectedCase.incident.primaryType}</div>
              <div><strong>Petugas Pendamping (Case Manager):</strong> {selectedCase.caseManager}</div>
            </div>

            <p className="text-justify leading-relaxed">
              Tanda bukti ini sah diberikan kepada pelapor/korban sebagai arsip resmi layanan rujukan gratis tanpa dipungut biaya apapun (0 Rupiah).
            </p>

            <div className="pt-8 flex justify-between text-center">
              <div className="w-60 space-y-16">
                <p>Penerima Tanda Bukti (Pelapor),</p>
                <p className="font-bold underline">( {maskPrivacy ? 'Pelapor' : selectedCase.reporter.name} )</p>
              </div>

              <div className="w-60 space-y-16">
                <div>
                  <p>Mbay, {todayFormatted}</p>
                  <p>Petugas UPTD PPA Nagekeo,</p>
                </div>
                <div>
                  <p className="font-bold underline">{selectedCase.caseManager.split(' ')[0]} {selectedCase.caseManager.split(' ')[1]}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATE 5: SURAT PENGANTAR RUMAH AMAN (SHELTER) */}
        {docType === 'rujukan-shelter' && (
          <div className="space-y-5 text-xs text-neutral-800">
            <div className="text-center space-y-1">
              <h4 className="text-sm font-bold uppercase underline">
                Surat Pengantar Penempatan Rumah Aman (Shelter Sementara)
              </h4>
              <p className="font-mono-numbers text-xs font-semibold">
                Nomor: 463/SHELTER-PPA/{selectedCase.registrationNumber.slice(-3)}/2026
              </p>
            </div>

            <p className="text-justify leading-relaxed">
              Demi keselamatan fisik dan pemulihan psikologis korban tindak kekerasan, Kepala UPTD PPA Kabupaten Nagekeo merekomendasikan penempatan sementara korban pada Rumah Aman (Safe House) yang dikelola secara terlindungi:
            </p>

            <div className="p-4 bg-neutral-50 rounded border border-neutral-200 space-y-2">
              <div><strong>Nama Korban:</strong> {victimName}</div>
              <div><strong>Kategori:</strong> {selectedCase.victim.category} ({selectedCase.victim.age} Tahun)</div>
              <div><strong>Alasan Penempatan:</strong> Ancaman keselamatan dari terlapor dan pemulihan trauma pascakejadian kekerasan seksual/KDRT.</div>
              <div><strong>Durasi Rekomendasi:</strong> 14 (Empat Belas) Hari Pertama, dapat diperpanjang berdasarkan hasil asesmen tim konselor.</div>
            </div>

            <p className="text-justify leading-relaxed">
              Lokasi dan identitas penghuni Rumah Aman bersifat <strong>SANGAT RAHASIA</strong> dan dilindungi oleh Undang-Undang Perlindungan Saksi dan Korban serta UU No. 12 Tahun 2022.
            </p>

            <div className="pt-6 flex justify-end">
              <div className="w-72 text-center space-y-16">
                <div>
                  <p>Kepala UPTD Perlindungan Perempuan dan Anak</p>
                  <p>Kabupaten Nagekeo,</p>
                </div>
                <div>
                  <p className="font-bold underline uppercase">{INSTITUTION_INFO.headOfUnit}</p>
                  <p className="font-mono-numbers text-[10px] text-neutral-500">NIP. {INSTITUTION_INFO.nipHead}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
