import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  RefreshCw, 
  ExternalLink, 
  PlusCircle, 
  Link2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  LogOut, 
  Table, 
  ArrowUpRight,
  Database,
  Users,
  Building2,
  Calendar,
  Layers,
  ArrowDownToLine,
  HelpCircle
} from 'lucide-react';
import { User } from 'firebase/auth';
import { googleSignIn, logoutGoogle, initAuth, getAccessToken } from '../services/googleAuthService';
import { googleSheetsService, ConnectedSpreadsheet } from '../services/googleSheetsService';
import { CaseRecord, OfficialsConfig, StaffMember } from '../types/case';
import { INSTITUTION_INFO } from '../data/initialData';

interface GoogleSheetsViewProps {
  cases: CaseRecord[];
  officials: OfficialsConfig;
  staffList: StaffMember[];
  onImportCases: (imported: CaseRecord[]) => void;
  onShowToast: (msg: string) => void;
}

export const GoogleSheetsView: React.FC<GoogleSheetsViewProps> = ({
  cases,
  officials,
  staffList,
  onImportCases,
  onShowToast
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [connectedSheet, setConnectedSheet] = useState<ConnectedSpreadsheet | null>(null);

  // Input states
  const [existingUrlOrId, setExistingUrlOrId] = useState<string>('');
  const [customSheetTitle, setCustomSheetTitle] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processStatusMessage, setProcessStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Confirmation modal state for mutating operations
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'sync' | 'pull' | 'disconnect';
    title: string;
    description: string;
    actionLabel: string;
    isDestructive?: boolean;
  }>({
    isOpen: false,
    type: 'sync',
    title: '',
    description: '',
    actionLabel: ''
  });

  // Check auth state on mount
  useEffect(() => {
    const unsub = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
        setIsAuthLoading(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setIsAuthLoading(false);
      }
    );

    // Load persisted connected sheet metadata
    const saved = googleSheetsService.getConnectedSpreadsheet();
    setConnectedSheet(saved);

    return () => unsub();
  }, []);

  // Handle Google Sign In
  const handleSignIn = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        onShowToast(`Berhasil login dengan akun ${res.user.email}`);
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Gagal login dengan Google';
      setErrorMessage(msg);
      onShowToast(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Google Sign Out
  const handleSignOut = async () => {
    await logoutGoogle();
    setUser(null);
    setToken(null);
    onShowToast('Akun Google berhasil keluar.');
  };

  // Helper to ensure valid access token
  const ensureToken = async (): Promise<string> => {
    let activeToken = token || await getAccessToken();
    if (!activeToken) {
      const res = await googleSignIn();
      if (!res?.accessToken) {
        throw new Error('Diperlukan izin login Google untuk melanjutkan.');
      }
      setUser(res.user);
      setToken(res.accessToken);
      activeToken = res.accessToken;
    }
    return activeToken;
  };

  // 1. Create a brand new Google Spreadsheet
  const handleCreateNewSpreadsheet = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setProcessStatusMessage('Membuat spreadsheet baru di Google Drive Anda...');
    try {
      const activeToken = await ensureToken();
      const defaultTitle = `SIPPA Nagekeo - Rekapitulasi Kasus PPA (DINAS PMDP3A)`;
      const newSheet = await googleSheetsService.createSiPPAWorkbook(
        activeToken,
        cases,
        officials,
        staffList,
        customSheetTitle.trim() || defaultTitle
      );
      setConnectedSheet(newSheet);
      setCustomSheetTitle('');
      onShowToast('Spreadsheet baru berhasil dibuat dan data telah disinkronkan!');
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Gagal membuat spreadsheet';
      setErrorMessage(msg);
      onShowToast(msg);
    } finally {
      setIsProcessing(false);
      setProcessStatusMessage('');
    }
  };

  // 2. Connect an existing Google Spreadsheet
  const handleConnectExistingSpreadsheet = async () => {
    const id = googleSheetsService.extractSpreadsheetId(existingUrlOrId);
    if (!id) {
      setErrorMessage('Format link atau ID Google Spreadsheet tidak valid. Pastikan format URL seperti https://docs.google.com/spreadsheets/d/.../edit');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setProcessStatusMessage('Memverifikasi akses ke spreadsheet...');
    try {
      const activeToken = await ensureToken();
      const meta = await googleSheetsService.getSpreadsheetMetadata(activeToken, id);
      const connected: ConnectedSpreadsheet = {
        id: id,
        title: meta.title,
        url: googleSheetsService.getSpreadsheetUrl(id),
        lastSyncedAt: null,
        sheetNames: meta.sheets
      };
      googleSheetsService.saveConnectedSpreadsheet(connected);
      setConnectedSheet(connected);
      setExistingUrlOrId('');
      onShowToast(`Berhasil terhubung ke spreadsheet "${meta.title}"`);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Gagal mengakses spreadsheet yang ditautkan.';
      setErrorMessage(msg);
      onShowToast(msg);
    } finally {
      setIsProcessing(false);
      setProcessStatusMessage('');
    }
  };

  // 3. Confirm and Execute Sync Data (Push to Sheets)
  const triggerSyncConfirm = () => {
    if (!connectedSheet) return;
    setConfirmModal({
      isOpen: true,
      type: 'sync',
      title: 'Konfirmasi Sinkronisasi ke Google Spreadsheet',
      description: `Sistem akan mengirimkan dan memperbarui ${cases.length} data kasus, rekapitulasi 7 kecamatan, dan susunan pegawai PMDP3A ke lembar kerja "${connectedSheet.title}". Apakah Anda ingin melanjutkan?`,
      actionLabel: 'Ya, Sinkronkan Sekarang',
      isDestructive: false
    });
  };

  // 4. Confirm and Execute Pull Data (Import from Sheets)
  const triggerPullConfirm = () => {
    if (!connectedSheet) return;
    setConfirmModal({
      isOpen: true,
      type: 'pull',
      title: 'Tarik Data dari Google Spreadsheet',
      description: `Sistem akan membaca baris dari spreadsheet "${connectedSheet.title}" dan memperbarui daftar kasus pada dasbor ini. Pastikan struktur kolom sesuai dengan format register SIPPA.`,
      actionLabel: 'Tarik & Perbarui Dasbor',
      isDestructive: false
    });
  };

  // Disconnect confirmation
  const triggerDisconnectConfirm = () => {
    if (!connectedSheet) return;
    setConfirmModal({
      isOpen: true,
      type: 'disconnect',
      title: 'Putuskan Tautan Spreadsheet?',
      description: `Spreadsheet "${connectedSheet.title}" akan dilepas dari dasbor ini. File di Google Drive Anda tetap aman dan tidak dihapus.`,
      actionLabel: 'Lepas Tautan',
      isDestructive: true
    });
  };

  // Execute confirmed action
  const handleExecuteConfirmedAction = async () => {
    const actionType = confirmModal.type;
    setConfirmModal(prev => ({ ...prev, isOpen: false }));

    if (actionType === 'disconnect') {
      googleSheetsService.saveConnectedSpreadsheet(null);
      setConnectedSheet(null);
      onShowToast('Tautan Google Spreadsheet berhasil dilepas.');
      return;
    }

    if (!connectedSheet) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const activeToken = await ensureToken();

      if (actionType === 'sync') {
        setProcessStatusMessage('Mengirim data kasus & rekapitulasi ke Google Sheets...');
        const result = await googleSheetsService.syncAllDataToSpreadsheet(
          activeToken,
          connectedSheet.id,
          cases,
          officials,
          staffList
        );
        // Refresh local state
        const updated = googleSheetsService.getConnectedSpreadsheet();
        setConnectedSheet(updated);
        onShowToast(`Sinkronisasi berhasil! ${result.updatedCells} sel data telah diperbarui.`);
      } else if (actionType === 'pull') {
        setProcessStatusMessage('Membaca data kasus dari Google Sheets...');
        const imported = await googleSheetsService.importCasesFromSpreadsheet(activeToken, connectedSheet.id);
        if (imported.length === 0) {
          onShowToast('Tidak ditemukan baris data kasus baru pada spreadsheet.');
        } else {
          onImportCases(imported);
          onShowToast(`Berhasil menarik ${imported.length} data kasus dari spreadsheet.`);
        }
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses data spreadsheet.';
      setErrorMessage(msg);
      onShowToast(msg);
    } finally {
      setIsProcessing(false);
      setProcessStatusMessage('');
    }
  };

  const formatLastSync = (isoString?: string | null) => {
    if (!isoString) return 'Belum pernah disinkronkan';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Integrasi Cloud & Rekapitulasi</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight mt-1">
            Koneksi Google Spreadsheet
          </h1>
          <p className="text-xs text-neutral-500 mt-1 max-w-2xl leading-relaxed">
            Sinkronisasikan seluruh rekaman register kasus kekerasan, data statistik 7 kecamatan di Kabupaten Nagekeo, dan daftar pejabat/pegawai DINAS PMDP3A secara dua arah ke Google Sheets.
          </p>
        </div>

        {/* Status Badge */}
        <div className="shrink-0 flex items-center gap-2">
          {connectedSheet ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Spreadsheet Aktif Terhubung</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-600">
              <span className="w-2 h-2 rounded-full bg-neutral-400" />
              <span>Belum Terhubung</span>
            </div>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Terjadi Kendala Koneksi:</p>
            <p className="mt-0.5 text-rose-700">{errorMessage}</p>
          </div>
          <button 
            onClick={() => setErrorMessage(null)} 
            className="text-rose-500 hover:text-rose-700 text-xs font-bold px-2 py-0.5 rounded cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Processing State Bar */}
      {isProcessing && (
        <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl flex items-center gap-3 text-sky-800 text-xs animate-pulse">
          <RefreshCw className="w-4 h-4 text-sky-600 animate-spin shrink-0" />
          <span className="font-medium">{processStatusMessage || 'Sedang memproses ke Google Sheets...'}</span>
        </div>
      )}

      {/* 2-Column Grid: Auth Card & Connection Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Google Account Box */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-700" />
                Akun Google
              </span>
              {user && (
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Terotorisasi
                </span>
              )}
            </div>

            <div className="mt-4">
              {isAuthLoading ? (
                <div className="py-6 flex items-center justify-center text-xs text-neutral-400">
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Memeriksa sesi Google...
                </div>
              ) : user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || 'Google User'} 
                        className="w-10 h-10 rounded-full border border-neutral-200 object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-sky-700 text-white font-bold flex items-center justify-center text-sm">
                        {(user.displayName || user.email || 'G').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-neutral-900 truncate">
                        {user.displayName || 'Akun UPTD PPA'}
                      </p>
                      <p className="text-[11px] text-neutral-500 font-mono truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-100 text-[11px] text-neutral-600 space-y-1">
                    <p className="font-semibold text-neutral-800">Izin Terpasang:</p>
                    <p className="flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 className="w-3 h-3" />
                      Google Sheets (Baca, Tulis & Perbarui)
                    </p>
                    <p className="flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 className="w-3 h-3" />
                      Google Drive (Penyimpanan Berkas Kasus)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Masuk dengan akun Google dinas Anda (misal: <strong>uptdppanagekeo@gmail.com</strong>) untuk menghubungkan spreadsheet ke dasbor ini.
                  </p>
                  
                  {/* Official Google Sign-in Button */}
                  <button
                    onClick={handleSignIn}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-white hover:bg-neutral-50 active:bg-neutral-100 border border-neutral-300 rounded-lg shadow-xs text-xs font-semibold text-neutral-700 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Masuk dengan Google</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {user && (
            <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400">Sesi Terhubung</span>
              <button
                onClick={handleSignOut}
                className="text-xs text-neutral-600 hover:text-rose-600 font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>

        {/* Column 2 & 3: Active Spreadsheet Controls OR Connect New */}
        <div className="lg:col-span-2">
          {connectedSheet ? (
            /* Active Connected Spreadsheet Details Card */
            <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                      {connectedSheet.title}
                    </h3>
                    <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                      ID: {connectedSheet.id}
                    </p>
                  </div>
                </div>

                <a
                  href={connectedSheet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka di Google Sheets</span>
                </a>
              </div>

              {/* Sync Metrics Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                  <span className="text-[10px] uppercase font-semibold text-neutral-500">
                    Data Kasus Terdata
                  </span>
                  <p className="text-lg font-bold text-neutral-900 font-mono-numbers mt-0.5">
                    {cases.length} <span className="text-xs font-normal text-neutral-500">kasus</span>
                  </p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                  <span className="text-[10px] uppercase font-semibold text-neutral-500">
                    Terakhir Disinkronkan
                  </span>
                  <p className="text-xs font-medium text-neutral-800 mt-1 truncate" title={formatLastSync(connectedSheet.lastSyncedAt)}>
                    {formatLastSync(connectedSheet.lastSyncedAt)}
                  </p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                  <span className="text-[10px] uppercase font-semibold text-neutral-500">
                    Lembar Kerja (Sheets)
                  </span>
                  <p className="text-xs font-medium text-neutral-800 mt-1">
                    3 Tab Terstruktur
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={triggerSyncConfirm}
                  disabled={isProcessing}
                  className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                  <span>Sinkronkan Sekarang (Kirim Data Dasbor)</span>
                </button>

                <button
                  onClick={triggerPullConfirm}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  title="Baca data dari Google Spreadsheet jika ada perubahan yang diisi langsung di Spreadsheet"
                >
                  <ArrowDownToLine className="w-4 h-4 text-neutral-500" />
                  <span>Tarik Data dari Spreadsheet</span>
                </button>

                <button
                  onClick={triggerDisconnectConfirm}
                  disabled={isProcessing}
                  className="px-3 py-2.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Lepas Tautan
                </button>
              </div>
            </div>
          ) : (
            /* Setup Options when no spreadsheet is connected */
            <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  Pilih Cara Menghubungkan Google Spreadsheet
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Anda dapat membuat file spreadsheet baru secara otomatis dengan tabel yang sudah terformat, atau menautkan spreadsheet dinas yang sudah ada.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option 1: Create New */}
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/60 hover:bg-neutral-50 transition-colors flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <PlusCircle className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-bold text-neutral-900">
                      1. Buat Spreadsheet Baru Otomatis (Rekomendasi)
                    </h4>
                    <p className="text-[11px] text-neutral-500 leading-relaxed">
                      Sistem akan membuat file baru di Google Drive Anda lengkap dengan 3 lembar kerja: <strong>Register_Kasus</strong>, <strong>Rekap_Kecamatan</strong>, dan <strong>Data_Pegawai_Pejabat</strong>.
                    </p>
                    <input
                      type="text"
                      placeholder="Judul Spreadsheet (opsional)"
                      value={customSheetTitle}
                      onChange={(e) => setCustomSheetTitle(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <button
                    onClick={handleCreateNewSpreadsheet}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Buat Spreadsheet & Sinkronkan</span>
                  </button>
                </div>

                {/* Option 2: Connect Existing */}
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/60 hover:bg-neutral-50 transition-colors flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
                      <Link2 className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-bold text-neutral-900">
                      2. Hubungkan Spreadsheet yang Sudah Ada
                    </h4>
                    <p className="text-[11px] text-neutral-500 leading-relaxed">
                      Punya spreadsheet Google yang sudah dipakai? Masukkan tautan (URL) atau Spreadsheet ID untuk dihubungkan ke dasbor.
                    </p>
                    <input
                      type="text"
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                      value={existingUrlOrId}
                      onChange={(e) => setExistingUrlOrId(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600"
                    />
                  </div>

                  <button
                    onClick={handleConnectExistingSpreadsheet}
                    disabled={isProcessing || !existingUrlOrId.trim()}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>Tautkan Spreadsheet</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Structure Information Card */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-700">
          <Layers className="w-4 h-4 text-emerald-700" />
          <span>Struktur Data Lembar Kerja Google Spreadsheet (SIPPA PMDP3A)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Tab 1 Structure */}
          <div className="p-4 rounded-lg border border-neutral-200/80 bg-neutral-50/50 space-y-2">
            <div className="flex items-center gap-2 font-bold text-neutral-900">
              <Table className="w-4 h-4 text-emerald-600" />
              <span>1. Lembar Register_Kasus</span>
            </div>
            <p className="text-neutral-500 text-[11px] leading-relaxed">
              Memuat seluruh data pengaduan masuk dengan 28 kolom lengkap: nomor registrasi resmi, tanggal lapor, tanggal kejadian, identitas korban (nama lengkap, inisial, NIK, usia, gender, disabilitas, pendidikan), alamat (kecamatan & desa/kelurahan di Nagekeo), bentuk kekerasan, hubungan pelaku, identitas terlapor, petugas pendamping utama, jumlah rujukan, dan catatan kronologi.
            </p>
          </div>

          {/* Tab 2 Structure */}
          <div className="p-4 rounded-lg border border-neutral-200/80 bg-neutral-50/50 space-y-2">
            <div className="flex items-center gap-2 font-bold text-neutral-900">
              <Database className="w-4 h-4 text-sky-600" />
              <span>2. Lembar Rekap_Kecamatan</span>
            </div>
            <p className="text-neutral-500 text-[11px] leading-relaxed">
              Matriks statistik resmi 7 kecamatan se-Kabupaten Nagekeo (Aesesa, Aesesa Selatan, Wolowae, Boawae, Mauponggo, Nangaroro, Keo Tengah). Menghitung otomatis total kasus, klasifikasi korban (anak, perempuan dewasa, disabilitas), serta 8 ragam kekerasan sesuai standar KemenPPPA.
            </p>
          </div>

          {/* Tab 3 Structure */}
          <div className="p-4 rounded-lg border border-neutral-200/80 bg-neutral-50/50 space-y-2">
            <div className="flex items-center gap-2 font-bold text-neutral-900">
              <Users className="w-4 h-4 text-amber-600" />
              <span>3. Lembar Data_Pegawai_Pejabat</span>
            </div>
            <p className="text-neutral-500 text-[11px] leading-relaxed">
              Memuat data pejabat penandatangan berkas resmi (Kepala DINAS PMDP3A, Kepala Bidang PPPA, Kepala UPTD PPA) beserta NIP dan pangkat/golongan, serta daftar pegawai/peksos pendamping kasus aktif beserta kontak resmi dan peran pendampingan.
            </p>
          </div>
        </div>

        {/* Security Note */}
        <div className="pt-3 border-t border-neutral-100 flex items-start gap-2.5 text-neutral-500 text-[11px] leading-relaxed">
          <HelpCircle className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
          <p>
            <strong>Catatan Keamanan & Privasi:</strong> Seluruh otorisasi dilakukan secara aman melalui Google OAuth resmi. Dasbor tidak pernah menyimpan kata sandi Anda. Anda dapat membuka atau membagikan Google Spreadsheet ini kepada pimpinan dinas untuk kebutuhan pemantauan data secara langsung (real-time).
          </p>
        </div>
      </div>

      {/* Confirmation Modal for Mutating Workspace Operations */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-neutral-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                confirmModal.isDestructive ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {confirmModal.isDestructive ? (
                  <AlertCircle className="w-5 h-5" />
                ) : (
                  <RefreshCw className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  {confirmModal.title}
                </h3>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  {confirmModal.description}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleExecuteConfirmedAction}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors shadow-xs cursor-pointer ${
                  confirmModal.isDestructive
                    ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
                    : 'bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900'
                }`}
              >
                {confirmModal.actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
