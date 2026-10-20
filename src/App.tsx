import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { CaseRegisterView } from './components/CaseRegisterView';
import { ReportsView } from './components/ReportsView';
import { OfficialDocumentsView } from './components/OfficialDocumentsView';
import { DirectoryView } from './components/DirectoryView';
import { StaffManagementView } from './components/StaffManagementView';
import { CaseDetailModal } from './components/CaseDetailModal';
import { NewCaseModal } from './components/NewCaseModal';
import { storageService } from './services/storageService';
import { CaseRecord, ProgressNote, ServiceReferral, StaffMember, OfficialsConfig } from './types/case';
import { DEFAULT_OFFICIALS } from './data/initialData';
import { Check } from 'lucide-react';

export default function App() {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [officials, setOfficials] = useState<OfficialsConfig>(DEFAULT_OFFICIALS);
  
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedCaseForDetail, setSelectedCaseForDetail] = useState<CaseRecord | null>(null);
  const [isNewCaseOpen, setIsNewCaseOpen] = useState<boolean>(false);
  const [privacyMode, setPrivacyMode] = useState<boolean>(false);
  const [documentParams, setDocumentParams] = useState<{ caseId?: string; docType?: string } | null>(null);
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadedCases = storageService.getCases();
    setCases(loadedCases);
    const loadedStaff = storageService.getStaffMembers();
    setStaffList(loadedStaff);
    const loadedOfficials = storageService.getOfficials();
    setOfficials(loadedOfficials);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleCaseCreated = (newCase: CaseRecord) => {
    const updated = [newCase, ...cases.filter(c => c.id !== newCase.id)];
    setCases(updated);
    setIsNewCaseOpen(false);
    showToast(`Pengaduan baru ${newCase.registrationNumber} berhasil didaftarkan.`);
  };

  const handleUpdateCase = (updatedCase: CaseRecord) => {
    const updatedList = storageService.updateCase(updatedCase);
    setCases(updatedList);
    setSelectedCaseForDetail(updatedCase);
    showToast(`Data kasus ${updatedCase.registrationNumber} berhasil diperbarui.`);
  };

  const handleDeleteCase = (id: string) => {
    const updatedList = storageService.deleteCase(id);
    setCases(updatedList);
    if (selectedCaseForDetail?.id === id) {
      setSelectedCaseForDetail(null);
    }
    showToast('Data kasus berhasil dihapus dari register.');
  };

  const handleAddProgressLog = (caseId: string, log: Omit<ProgressNote, 'id'>) => {
    const updatedList = storageService.addProgressLog(caseId, log);
    setCases(updatedList);
    const updatedCase = updatedList.find(c => c.id === caseId);
    if (updatedCase) {
      setSelectedCaseForDetail(updatedCase);
    }
    showToast('Catatan perkembangan kasus berhasil ditambahkan.');
  };

  const handleAddReferral = (caseId: string, referral: Omit<ServiceReferral, 'id'>) => {
    const updatedList = storageService.addReferral(caseId, referral);
    setCases(updatedList);
    const updatedCase = updatedList.find(c => c.id === caseId);
    if (updatedCase) {
      setSelectedCaseForDetail(updatedCase);
    }
    showToast(`Rujukan ke ${referral.targetAgency} berhasil dicatat.`);
  };

  const handleOpenDocumentPrint = (caseRecord: CaseRecord, docType: string) => {
    setDocumentParams({ caseId: caseRecord.id, docType });
    setCurrentTab('documents');
    if (selectedCaseForDetail) {
      setSelectedCaseForDetail(null);
    }
  };

  const handleExportBackup = () => {
    storageService.exportBackupJSON(cases);
    showToast('Berkas cadangan data kasus (JSON) berhasil diunduh.');
  };

  // Staff and Officials Handlers
  const handleUpdateOfficials = (newOfficials: OfficialsConfig) => {
    storageService.saveOfficials(newOfficials);
    setOfficials(newOfficials);
  };

  const handleAddStaff = (newMember: Omit<StaffMember, 'id'>) => {
    const updated = storageService.addStaffMember(newMember);
    setStaffList(updated);
  };

  const handleUpdateStaff = (updatedMember: StaffMember) => {
    const updated = storageService.updateStaffMember(updatedMember);
    setStaffList(updated);
  };

  const handleDeleteStaff = (id: string) => {
    const updated = storageService.deleteStaffMember(id);
    setStaffList(updated);
  };

  const activeCasesCount = cases.filter(c => c.status !== 'Selesai / Ditutup').length;

  return (
    <div className="min-h-screen bg-neutral-100/70 flex flex-col font-sans">
      {/* Top Bar adhering to Top Bar Contract */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setDocumentParams(null);
        }}
        onOpenNewCase={() => setIsNewCaseOpen(true)}
      />

      <div className="flex-1 flex flex-row">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={(tab) => {
            setCurrentTab(tab);
            setDocumentParams(null);
          }}
          totalCases={cases.length}
          activeCases={activeCasesCount}
          privacyMode={privacyMode}
          onTogglePrivacy={() => {
            setPrivacyMode(prev => !prev);
            showToast(!privacyMode ? 'Mode privasi aktif: Data NIK & nama disamarkan.' : 'Mode privasi dinonaktifkan.');
          }}
          onExportBackup={handleExportBackup}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {currentTab === 'dashboard' && (
            <DashboardView
              cases={cases}
              staffList={staffList}
              onSelectCase={(c) => setSelectedCaseForDetail(c)}
              onOpenNewCase={() => setIsNewCaseOpen(true)}
              onNavigateToRegister={() => setCurrentTab('register')}
            />
          )}

          {currentTab === 'register' && (
            <CaseRegisterView
              cases={cases}
              onSelectCase={(c) => setSelectedCaseForDetail(c)}
              onOpenNewCase={() => setIsNewCaseOpen(true)}
              onOpenDocumentPrint={handleOpenDocumentPrint}
              onDeleteCase={handleDeleteCase}
              privacyMode={privacyMode}
              onTogglePrivacy={() => setPrivacyMode(prev => !prev)}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView 
              cases={cases} 
              officials={officials}
            />
          )}

          {currentTab === 'documents' && (
            <OfficialDocumentsView
              cases={cases}
              officials={officials}
              initialCaseId={documentParams?.caseId}
              initialDocType={documentParams?.docType || 'berita-acara'}
            />
          )}

          {currentTab === 'staff' && (
            <StaffManagementView
              staffList={staffList}
              officials={officials}
              onUpdateOfficials={handleUpdateOfficials}
              onAddStaff={handleAddStaff}
              onUpdateStaff={handleUpdateStaff}
              onDeleteStaff={handleDeleteStaff}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'directory' && (
            <DirectoryView />
          )}
        </main>
      </div>

      {/* Case Detail Modal */}
      {selectedCaseForDetail && (
        <CaseDetailModal
          caseData={selectedCaseForDetail}
          staffList={staffList}
          onClose={() => setSelectedCaseForDetail(null)}
          onUpdateCase={handleUpdateCase}
          onAddProgressLog={handleAddProgressLog}
          onAddReferral={handleAddReferral}
          onOpenDocumentPrint={handleOpenDocumentPrint}
          privacyMode={privacyMode}
        />
      )}

      {/* New Case Registration Modal */}
      {isNewCaseOpen && (
        <NewCaseModal
          existingCases={cases}
          staffList={staffList}
          onClose={() => setIsNewCaseOpen(false)}
          onCaseCreated={handleCaseCreated}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-neutral-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 border border-neutral-700 animate-in fade-in slide-in-from-bottom-2 duration-200 no-print">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
