import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  FileCheck, 
  PhoneCall, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Download,
  Building2
} from 'lucide-react';
import { INSTITUTION_INFO } from '../data/initialData';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  totalCases: number;
  activeCases: number;
  privacyMode: boolean;
  onTogglePrivacy: () => void;
  onExportBackup: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  totalCases,
  activeCases,
  privacyMode,
  onTogglePrivacy,
  onExportBackup
}) => {
  const crestPath = '/src/assets/images/crest_uptd_ppa_1792471725152.jpg';

  const navItems = [
    {
      id: 'dashboard',
      label: 'Ringkasan Kasus',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'register',
      label: 'Register Kasus',
      icon: FileText,
      badge: `${totalCases}`
    },
    {
      id: 'reports',
      label: 'Laporan Rekapitulasi',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'documents',
      label: 'Cetak Dokumen Resmi',
      icon: FileCheck,
      badge: null
    },
    {
      id: 'directory',
      label: 'Jejaring & Mitra Layanan',
      icon: Building2,
      badge: null
    }
  ];

  return (
    <aside className="w-64 shrink-0 bg-neutral-900 text-neutral-200 border-r border-neutral-800 flex flex-col justify-between min-h-[calc(100vh-57px)] no-print">
      <div>
        {/* Institutional Branding Box */}
        <div className="p-4 border-b border-neutral-800 flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-neutral-800 border border-neutral-700">
            <img 
              src={crestPath} 
              alt="Lambang UPTD PPA Kabupaten Nagekeo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                // styled fallback container
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs font-semibold text-white tracking-tight leading-tight uppercase">
              UPTD PPA Nagekeo
            </h2>
            <p className="text-[11px] text-neutral-400 truncate">
              Dinsos P3A Kab. Nagekeo
            </p>
            <p className="text-[10px] text-neutral-500 font-mono">
              Provinsi NTT
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="py-4 px-2 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
            Menu Operasional
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white font-semibold'
                    : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[11px] font-mono-numbers px-1.5 py-0.5 rounded text-xs ${
                    isActive ? 'bg-sky-800/80 text-white' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Privacy & Confidentiality Toggle Box */}
        <div className="px-3 py-2 mx-2 bg-neutral-800/60 rounded-lg border border-neutral-700/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-neutral-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Privasi Korban
            </span>
            <button
              onClick={onTogglePrivacy}
              className={`px-2 py-0.5 text-[10px] font-semibold rounded flex items-center gap-1 transition-colors cursor-pointer ${
                privacyMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
              }`}
              title="Sembunyikan NIK & nama lengkap korban demi kerahasiaan"
            >
              {privacyMode ? (
                <>
                  <EyeOff className="w-3 h-3" />
                  <span>Sensor Aktif</span>
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3" />
                  <span>Terbuka</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[10px] text-neutral-400 leading-tight">
            {privacyMode 
              ? 'Identitas NIK & nama korban disamarkan ke inisial.'
              : 'Mode penuh untuk verifikasi berkas hukum.'}
          </p>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="p-3 border-t border-neutral-800 space-y-3">
        {/* Quick Backup Data */}
        <button
          onClick={onExportBackup}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 text-[11px] text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-neutral-400" />
          <span>Cadangkan Data (JSON)</span>
        </button>

        {/* Emergency Hotline Info */}
        <div className="text-[11px] text-neutral-400 space-y-1">
          <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
            <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
            <span>Hotline UPTD Nagekeo:</span>
          </div>
          <p className="font-mono-numbers text-[10px] text-neutral-300">
            {INSTITUTION_INFO.hotline}
          </p>
          <p className="text-[10px] text-neutral-500 truncate">
            {INSTITUTION_INFO.email}
          </p>
        </div>
      </div>
    </aside>
  );
};
