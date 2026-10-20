import React from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenNewCase: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenNewCase
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-white border-b border-neutral-200/80 shadow-xs no-print">
      {/* Zone 1: Single text element wordmark */}
      <div 
        onClick={() => onTabChange('dashboard')} 
        className="text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2.5"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-sky-700 inline-block" />
        <span>SIPPA Nagekeo</span>
      </div>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
            currentTab === 'dashboard' ? 'text-neutral-900 font-semibold border-b-2 border-sky-700' : ''
          }`}
        >
          Beranda
        </button>
        <button
          onClick={() => onTabChange('register')}
          className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
            currentTab === 'register' ? 'text-neutral-900 font-semibold border-b-2 border-sky-700' : ''
          }`}
        >
          Register Kasus
        </button>
        <button
          onClick={() => onTabChange('reports')}
          className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
            currentTab === 'reports' ? 'text-neutral-900 font-semibold border-b-2 border-sky-700' : ''
          }`}
        >
          Rekapitulasi
        </button>
        <button
          onClick={() => onTabChange('documents')}
          className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
            currentTab === 'documents' ? 'text-neutral-900 font-semibold border-b-2 border-sky-700' : ''
          }`}
        >
          Dokumen Resmi
        </button>
        <button
          onClick={() => onTabChange('staff')}
          className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
            currentTab === 'staff' ? 'text-neutral-900 font-semibold border-b-2 border-sky-700' : ''
          }`}
        >
          Data Pegawai
        </button>
        <button
          onClick={() => onTabChange('spreadsheet')}
          className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer flex items-center gap-1.5 ${
            currentTab === 'spreadsheet' ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600' : ''
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          <span>Google Sheets</span>
        </button>
        <button
          onClick={() => onTabChange('directory')}
          className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
            currentTab === 'directory' ? 'text-neutral-900 font-semibold border-b-2 border-sky-700' : ''
          }`}
        >
          Jejaring Layanan
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenNewCase}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 active:bg-sky-900 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Kasus Baru</span>
        </button>
      </div>
    </header>
  );
};
