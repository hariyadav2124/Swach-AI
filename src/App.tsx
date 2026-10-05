import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { binService } from './services/binService';
import { reportService } from './services/reportService';
import { 
  AppTab, 
  CommunityBin, 
  CitizenRequest, 
  CivicNotification, 
  LanguageCode 
} from './types';
import { 
  RouteStop, 
  WorkerProfile, 
  WorkerNotification, 
  CollectionHistoryRecord, 
  WorkerTab 
} from './types/worker';
import { 
  SanitationTask, 
  SanitationWorkerProfile, 
  SanitationNotification, 
  SanitationHistoryRecord, 
  SanitationTab,
  SanitationActionType 
} from './types/sanitation';
import { 
  INITIAL_BINS, 
  INITIAL_REQUESTS, 
  INITIAL_NOTIFICATIONS, 
  SECTORS 
} from './data/mockData';
import { 
  INITIAL_WORKER_PROFILE, 
  INITIAL_ROUTE_STOPS, 
  INITIAL_WORKER_NOTIFICATIONS, 
  INITIAL_COLLECTION_HISTORY 
} from './data/mockWorkerData';
import { 
  INITIAL_SANITATION_PROFILE, 
  INITIAL_SANITATION_TASKS, 
  INITIAL_SANITATION_NOTIFICATIONS, 
  INITIAL_SANITATION_HISTORY 
} from './data/mockSanitationData';

// Citizen Components
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { AiWasteScanner } from './components/AiWasteScanner';
import { NearbyBinsMap } from './components/NearbyBinsMap';
import { BinDetailsModal } from './components/BinDetailsModal';
import { ReportIssueModal } from './components/ReportIssueModal';
import { SanitizationModal } from './components/SanitizationModal';
import { RequestNewBinModal } from './components/RequestNewBinModal';
import { MyRequestsView } from './components/MyRequestsView';
import { NotificationsView } from './components/NotificationsView';
import { ProfileView } from './components/ProfileView';
import { LocationPickerModal } from './components/LocationPickerModal';

// Waste Collection Worker Components
import { WorkerNavbar } from './components/worker/WorkerNavbar';
import { WorkerBottomNav } from './components/worker/WorkerBottomNav';
import { WorkerDashboard } from './components/worker/WorkerDashboard';
import { WorkerRouteView } from './components/worker/WorkerRouteView';
import { WorkerPriorityView } from './components/worker/WorkerPriorityView';
import { WorkerMapView } from './components/worker/WorkerMapView';
import { WorkerHistoryView } from './components/worker/WorkerHistoryView';
import { WorkerNotificationsView } from './components/worker/WorkerNotificationsView';
import { WorkerProfileView } from './components/worker/WorkerProfileView';
import { WorkerCollectionTaskModal } from './components/worker/WorkerCollectionTaskModal';
import { WorkerProblemModal } from './components/worker/WorkerProblemModal';
import { WorkerBinDetailsModal } from './components/worker/WorkerBinDetailsModal';

// Sanitation Worker Components
import { SanitationNavbar } from './components/sanitation/SanitationNavbar';
import { SanitationBottomNav } from './components/sanitation/SanitationBottomNav';
import { SanitationDashboard } from './components/sanitation/SanitationDashboard';
import { SanitationRouteView } from './components/sanitation/SanitationRouteView';
import { SanitationPriorityView } from './components/sanitation/SanitationPriorityView';
import { SanitationMapView } from './components/sanitation/SanitationMapView';
import { SanitationComplaintsView } from './components/sanitation/SanitationComplaintsView';
import { SanitationHistoryView } from './components/sanitation/SanitationHistoryView';
import { SanitationNotificationsView } from './components/sanitation/SanitationNotificationsView';
import { SanitationProfileView } from './components/sanitation/SanitationProfileView';
import { SanitationTaskModal } from './components/sanitation/SanitationTaskModal';
import { SanitationProblemModal } from './components/sanitation/SanitationProblemModal';
import { SanitationTaskDetailsModal } from './components/sanitation/SanitationTaskDetailsModal';

// Municipality Admin Components & Types
import { 
  AdminTab, 
  AdminBin, 
  AdminComplaint, 
  AdminNewBinRequest, 
  AdminWorker, 
  AdminRoute, 
  AdminKPIs, 
  AdminNotification 
} from './types/admin';
import { 
  INITIAL_ADMIN_KPIS, 
  INITIAL_ADMIN_BINS, 
  INITIAL_ADMIN_COMPLAINTS, 
  INITIAL_ADMIN_NEW_BINS, 
  INITIAL_ADMIN_WORKERS, 
  INITIAL_ADMIN_ROUTES, 
  INITIAL_ADMIN_NOTIFICATIONS 
} from './data/mockAdminData';
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminTopBar } from './components/admin/AdminTopBar';
import { AdminOverview } from './components/admin/AdminOverview';
import { AdminLiveMap } from './components/admin/AdminLiveMap';
import { AdminBinDetailPanel } from './components/admin/AdminBinDetailPanel';
import { AdminBinsView } from './components/admin/AdminBinsView';
import { AdminCollectionView } from './components/admin/AdminCollectionView';
import { AdminSanitationView } from './components/admin/AdminSanitationView';
import { AdminComplaintsView } from './components/admin/AdminComplaintsView';
import { AdminNewBinRequestsView } from './components/admin/AdminNewBinRequestsView';
import { AdminWorkersView } from './components/admin/AdminWorkersView';
import { AdminRoutesView } from './components/admin/AdminRoutesView';
import { AdminPredictionsView } from './components/admin/AdminPredictionsView';
import { AdminAnalyticsView } from './components/admin/AdminAnalyticsView';
import { AdminReportsView } from './components/admin/AdminReportsView';
import { AdminSettingsView } from './components/admin/AdminSettingsView';
import { AdminAssignModal } from './components/admin/AdminAssignModal';
import { AdminSearchModal } from './components/admin/AdminSearchModal';
import { AdminNotificationsModal } from './components/admin/AdminNotificationsModal';

// Authentication & RBAC Layer
import { AuthSession } from './types/auth';
import { 
  MOCK_ACCOUNTS, 
  loadStoredSession, 
  saveSession, 
  createSessionFromAccount 
} from './data/mockAccounts';
import { LoginView } from './components/auth/LoginView';

export default function App() {
  // ================= AUTHENTICATION & RBAC STATE =================
  // Defaults to the demo administrator or restores the saved session.
  
  const { session, signOut: handleSignOut } = useAuth();
  
  useEffect(() => {
    if (session) {
      binService.getBins().then(setBins).catch(console.error);
      reportService.getRequests().then(setRequests).catch(console.error);
      
      const unsubscribeBins = binService.subscribeToBins(() => {
        binService.getBins().then(setBins);
      });
      const unsubscribeReqs = reportService.subscribeToRequests(() => {
        reportService.getRequests().then(setRequests);
      });
      
      return () => {
        unsubscribeBins.unsubscribe();
        unsubscribeReqs.unsubscribe();
      };
    }
  }, [session]);

  // ================= CITIZEN STATE =================
  const [currentCitizenTab, setCurrentCitizenTab] = useState<AppTab>('home');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [activeSector, setActiveSector] = useState(SECTORS[0]);

  const [bins, setBins] = useState<CommunityBin[]>(INITIAL_BINS);
  const [requests, setRequests] = useState<CitizenRequest[]>(INITIAL_REQUESTS);
  const [notifications, setNotifications] = useState<CivicNotification[]>(INITIAL_NOTIFICATIONS);

  const [selectedBin, setSelectedBin] = useState<CommunityBin | null>(null);
  const [activeDirectionsBin, setActiveDirectionsBin] = useState<CommunityBin | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportModalBin, setReportModalBin] = useState<CommunityBin | null>(null);
  const [isCleaningModalOpen, setIsCleaningModalOpen] = useState<boolean>(false);
  const [cleaningModalBin, setCleaningModalBin] = useState<CommunityBin | null>(null);
  const [isNewBinModalOpen, setIsNewBinModalOpen] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);

  // ================= WORKER STATE =================
  const [currentWorkerTab, setCurrentWorkerTab] = useState<WorkerTab>('route');
  const [workerProfile, setWorkerProfile] = useState<WorkerProfile>(INITIAL_WORKER_PROFILE);
  const [routeStops, setRouteStops] = useState<RouteStop[]>(INITIAL_ROUTE_STOPS);
  const [workerNotifications, setWorkerNotifications] = useState<WorkerNotification[]>(INITIAL_WORKER_NOTIFICATIONS);
  const [historyRecords, setHistoryRecords] = useState<CollectionHistoryRecord[]>(INITIAL_COLLECTION_HISTORY);

  const [selectedWorkerStop, setSelectedWorkerStop] = useState<RouteStop | null>(null);
  const [activeCollectionStop, setActiveCollectionStop] = useState<RouteStop | null>(null);
  const [activeProblemStop, setActiveProblemStop] = useState<RouteStop | null>(null);
  const [activeWorkerDetailsStop, setActiveWorkerDetailsStop] = useState<RouteStop | null>(null);

  // ================= SANITATION STATE =================
  const [currentSanitationTab, setCurrentSanitationTab] = useState<SanitationTab>('route');
  const [sanitationProfile, setSanitationProfile] = useState<SanitationWorkerProfile>(INITIAL_SANITATION_PROFILE);
  const [sanitationTasks, setSanitationTasks] = useState<SanitationTask[]>(INITIAL_SANITATION_TASKS);
  const [sanitationNotifications, setSanitationNotifications] = useState<SanitationNotification[]>(INITIAL_SANITATION_NOTIFICATIONS);
  const [sanitationHistory, setSanitationHistory] = useState<SanitationHistoryRecord[]>(INITIAL_SANITATION_HISTORY);

  const [selectedSanitationTask, setSelectedSanitationTask] = useState<SanitationTask | null>(null);
  const [activeSanitationTaskModal, setActiveSanitationTaskModal] = useState<SanitationTask | null>(null);
  const [activeSanitationProblemTask, setActiveSanitationProblemTask] = useState<SanitationTask | null>(null);
  const [activeSanitationDetailsTask, setActiveSanitationDetailsTask] = useState<SanitationTask | null>(null);

  // ================= ADMIN COMMAND CENTER STATE =================
  const [currentAdminTab, setCurrentAdminTab] = useState<AdminTab>('overview');
  const [adminBins, setAdminBins] = useState<AdminBin[]>(INITIAL_ADMIN_BINS);
  const [adminComplaints, setAdminComplaints] = useState<AdminComplaint[]>(INITIAL_ADMIN_COMPLAINTS);
  const [adminNewBins, setAdminNewBins] = useState<AdminNewBinRequest[]>(INITIAL_ADMIN_NEW_BINS);
  const [adminWorkers, setAdminWorkers] = useState<AdminWorker[]>(INITIAL_ADMIN_WORKERS);
  const [adminRoutes, setAdminRoutes] = useState<AdminRoute[]>(INITIAL_ADMIN_ROUTES);
  const [adminKpis, setAdminKpis] = useState<AdminKPIs>(INITIAL_ADMIN_KPIS);
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>(INITIAL_ADMIN_NOTIFICATIONS);

  const [selectedAdminBin, setSelectedAdminBin] = useState<AdminBin | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);
  const [assignModalBin, setAssignModalBin] = useState<AdminBin | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [adminToast, setAdminToast] = useState<string | null>(null);

  const showAdminToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 3500);
  };

  // Unread notification counts
  const citizenUnreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const workerUnreadCount = useMemo(() => workerNotifications.filter((n) => !n.read).length, [workerNotifications]);
  const sanitationUnreadCount = useMemo(() => sanitationNotifications.filter((n) => !n.read).length, [sanitationNotifications]);

  // Citizen Sector Switcher
  const handleSelectSector = (sector: typeof SECTORS[0]) => {
    setActiveSector(sector);
    setBins((prev) =>
      prev.map((bin) => {
        const dLat = (bin.coordinates[0] - sector.lat) * 111000;
        const dLng = (bin.coordinates[1] - sector.lng) * 96000;
        const dist = Math.round(Math.sqrt(dLat * dLat + dLng * dLng));
        return {
          ...bin,
          distanceMeters: Math.max(120, dist),
        };
      })
    );
  };

  // Citizen Handlers
  const handleOpenReportModal = (bin?: CommunityBin | null) => {
    setReportModalBin(bin || null);
    setIsReportModalOpen(true);
  };

  const handleAddNewReport = (newReq: CitizenRequest) => {
    setRequests((prev) => [newReq, ...prev]);
    const newNotif: CivicNotification = {
      id: `NOTIF-${Date.now()}`,
      type: 'request_update',
      title: 'Complaint Logged Successfully',
      message: `Your report ${newReq.id} has been submitted.`,
      timestamp: 'Just now',
      read: false,
      relatedRequestId: newReq.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    if (newReq.binId) {
      setBins((prev) =>
        prev.map((b) =>
          b.id === newReq.binId ? { ...b, activeReportsCount: b.activeReportsCount + 1 } : b
        )
      );
    }
  };

  const handleAddNewCleaningRequest = (newReq: CitizenRequest) => {
    setRequests((prev) => [newReq, ...prev]);
    const newNotif: CivicNotification = {
      id: `NOTIF-${Date.now()}`,
      type: 'cleaning_assigned',
      title: 'Sanitization Request Queued',
      message: `Request ${newReq.id} has been submitted.`,
      timestamp: 'Just now',
      read: false,
      relatedRequestId: newReq.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleAddNewBinSuggestion = (newReq: CitizenRequest) => {
    setRequests((prev) => [newReq, ...prev]);
    const newNotif: CivicNotification = {
      id: `NOTIF-${Date.now()}`,
      type: 'review',
      title: 'New Bin Request Under Review',
      message: `Suggestion ${newReq.id} has been submitted.`,
      timestamp: 'Just now',
      read: false,
      relatedRequestId: newReq.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleUpdateRequest = (updated: CitizenRequest) => {
    setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  // ================= WORKER ACTIONS =================

  // Complete Collection Task
  const handleCompleteCollection = (
    stopId: string,
    collectedKg: number,
    notes?: string,
    photoUrl?: string
  ) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let completedStopObj: RouteStop | null = null;

    setRouteStops((prev) =>
      prev.map((stop) => {
        if (stop.id === stopId) {
          completedStopObj = {
            ...stop,
            status: 'completed',
            collectedKg,
            collectedTime: timeNow,
            notes,
            photoProof: photoUrl,
            estimatedFill: 8, // reset fill level after emptying
          };
          return completedStopObj;
        }
        return stop;
      })
    );

    // Add to collection history
    const target = routeStops.find((s) => s.id === stopId);
    if (target) {
      const newHistoryItem: CollectionHistoryRecord = {
        id: `HIST-${Date.now()}`,
        binId: target.binId,
        name: target.name,
        location: target.locationDescription,
        collectionTime: timeNow,
        dateGroup: 'Today',
        quantityKg: collectedKg,
        status: 'Completed',
        photoUrl: photoUrl || '',
        vehicle: workerProfile.vehicle,
        operatorNotes: notes,
      };
      setHistoryRecords((prev) => [newHistoryItem, ...prev]);
    }

    // Add notification
    const newNotif: WorkerNotification = {
      id: `WNOTIF-${Date.now()}`,
      type: 'task_assigned',
      title: `Collection Logged: ${target?.binId || 'Community Bin'}`,
      message: `${collectedKg} kg offloaded into Compactor ${workerProfile.vehicle} at ${timeNow}.`,
      timestamp: 'Just now',
      read: false,
    };
    setWorkerNotifications((prev) => [newNotif, ...prev]);

    // Close task modal and advance to next pending stop automatically
    setActiveCollectionStop(null);

    // Find next pending stop
    const remainingPending = routeStops.filter((s) => s.id !== stopId && s.status === 'pending');
    if (remainingPending.length > 0) {
      setSelectedWorkerStop(remainingPending[0]);
    }
  };

  // Submit Problem / Attention Required
  const handleSubmitProblem = (
    stopId: string,
    category: string,
    description: string,
    photo?: string
  ) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const target = routeStops.find((s) => s.id === stopId);

    setRouteStops((prev) =>
      prev.map((stop) => {
        if (stop.id === stopId) {
          return {
            ...stop,
            status: 'attention_required',
            issueReported: {
              category,
              description,
              photo,
              timestamp: timeNow,
            },
          };
        }
        return stop;
      })
    );

    // Log to history as Attention Required
    if (target) {
      const newHistoryItem: CollectionHistoryRecord = {
        id: `HIST-ATTN-${Date.now()}`,
        binId: target.binId,
        name: target.name,
        location: target.locationDescription,
        collectionTime: timeNow,
        dateGroup: 'Today',
        quantityKg: 0,
        status: 'Attention Required',
        photoUrl: photo || '',
        vehicle: workerProfile.vehicle,
        operatorNotes: `[EXCEPTION REPORTED]: ${category} - ${description}`,
      };
      setHistoryRecords((prev) => [newHistoryItem, ...prev]);
    }

    // Add notification
    const newNotif: WorkerNotification = {
      id: `WNOTIF-${Date.now()}`,
      type: 'route_update',
      title: `Exception Flagged: ${target?.binId}`,
      message: `Marked as Attention Required (${category}). Supervisor notified.`,
      timestamp: 'Just now',
      read: false,
    };
    setWorkerNotifications((prev) => [newNotif, ...prev]);

    setActiveProblemStop(null);
  };

  // ================= SANITATION ACTIONS =================

  // Complete Sanitation Task
  const handleCompleteSanitationTask = (
    taskId: string,
    performedActions: SanitationActionType[],
    notes?: string,
    beforePhoto?: string,
    afterPhoto?: string
  ) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setSanitationTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            status: 'completed',
            completedAt: timeNow,
            performedActions,
            notes,
            beforePhoto: beforePhoto || task.beforePhoto,
            afterPhoto: afterPhoto || task.afterPhoto,
            urgency: 'normal',
          };
        }
        return task;
      })
    );

    const target = sanitationTasks.find((t) => t.id === taskId);
    if (target) {
      const newHistoryItem: SanitationHistoryRecord = {
        id: `SHIST-${Date.now()}`,
        binId: target.binId,
        name: target.name,
        location: target.locationDescription,
        taskType: `${performedActions.join(', ')} · Hygiene Sanitization`,
        completionTime: timeNow,
        dateGroup: 'Today',
        status: 'Completed',
        beforePhoto: beforePhoto || target.beforePhoto || '',
        afterPhoto: afterPhoto || target.afterPhoto || '',
        actionsPerformed: performedActions,
        operatorNotes: notes,
        workerName: sanitationProfile.name,
        team: sanitationProfile.team,
      };
      setSanitationHistory((prev) => [newHistoryItem, ...prev]);

      const newNotif: SanitationNotification = {
        id: `SNOTIF-${Date.now()}`,
        type: 'task_assigned',
        title: `Hygiene Cleared: ${target.binId}`,
        message: `${performedActions.join(', ')} verified at ${timeNow}. Ready for citizen public use.`,
        timestamp: 'Just now',
        read: false,
        binId: target.binId,
      };
      setSanitationNotifications((prev) => [newNotif, ...prev]);
    }

    setActiveSanitationTaskModal(null);

    // Auto advance to next pending high priority sanitation task
    const remainingPending = sanitationTasks.filter((t) => t.id !== taskId && (t.status === 'pending' || t.status === 'in_progress'));
    if (remainingPending.length > 0) {
      setSelectedSanitationTask(remainingPending[0]);
    }
  };

  // Submit Field Escalation / Impediment
  const handleEscalateSanitationTask = (
    taskId: string,
    reason: string,
    description: string,
    photo?: string
  ) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const target = sanitationTasks.find((t) => t.id === taskId);

    setSanitationTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'escalated',
            escalationReason: `${reason}: ${description}`,
          };
        }
        return t;
      })
    );

    if (target) {
      const newHistoryItem: SanitationHistoryRecord = {
        id: `SHIST-ESC-${Date.now()}`,
        binId: target.binId,
        name: target.name,
        location: target.locationDescription,
        taskType: `[ESCALATED] ${reason}`,
        completionTime: timeNow,
        dateGroup: 'Today',
        status: 'Escalated',
        beforePhoto: photo || target.beforePhoto || '',
        afterPhoto: target.afterPhoto || '',
        actionsPerformed: [reason],
        operatorNotes: description,
        workerName: sanitationProfile.name,
        team: sanitationProfile.team,
      };
      setSanitationHistory((prev) => [newHistoryItem, ...prev]);

      const newNotif: SanitationNotification = {
        id: `SNOTIF-${Date.now()}`,
        type: 'critical',
        title: `Field Exception Escalated: ${target.binId}`,
        message: `${reason} reported. Municipal engineering wing notified for heavy intervention.`,
        timestamp: 'Just now',
        read: false,
        binId: target.binId,
      };
      setSanitationNotifications((prev) => [newNotif, ...prev]);
    }

    setActiveSanitationProblemTask(null);
  };

  // ================= ADMIN ACTIONS =================

  const handleAdminAssignTask = (
    binId: string,
    team: string,
    workerName: string,
    priority: string,
    notes?: string
  ) => {
    setAdminBins((prev) =>
      prev.map((b) => (b.id === binId ? { ...b, assignedTeam: team, assignedWorker: workerName } : b))
    );
    setIsAssignModalOpen(false);
    setAssignModalBin(null);
    showAdminToast(`Dispatch confirmed: ${binId} assigned to ${team} (${workerName}).`);
  };

  const handleAdminEscalateComplaint = (complaintId: string) => {
    setAdminComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, status: 'Escalated' } : c))
    );
    const newNotif: AdminNotification = {
      id: `ANOTIF-${Date.now()}`,
      severity: 'critical',
      title: `Complaint Escalated: ${complaintId}`,
      description: `Formal SLA escalation triggered. Sent to Ward 14 Superintending Engineer.`,
      timestamp: 'Just now',
      read: false,
      relatedEntityId: complaintId,
      type: 'sla_breach',
    };
    setAdminNotifications((prev) => [newNotif, ...prev]);
    showAdminToast(`Complaint ${complaintId} escalated to Ward 14 Superintending Engineer.`);
  };

  const handleAdminResolveComplaint = (complaintId: string) => {
    setAdminComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, status: 'Resolved' } : c))
    );
    setAdminKpis((prev) => ({
      ...prev,
      pendingRequests: Math.max(0, prev.pendingRequests - 1),
    }));
    showAdminToast(`Complaint ${complaintId} marked resolved. Citizen notification sent.`);
  };

  const handleAdminApproveNewBin = (reqId: string) => {
    setAdminNewBins((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'Approved' } : r))
    );
    showAdminToast(`Proposal ${reqId} approved for installation in next municipal works tender.`);
  };

  const handleAdminRejectNewBin = (reqId: string) => {
    setAdminNewBins((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'Rejected' } : r))
    );
    showAdminToast(`Proposal ${reqId} rejected: Existing bin within 150m walking radius.`);
  };

  const handleAdminInspectNewBin = (reqId: string) => {
    setAdminNewBins((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'Under Inspection' } : r))
    );
    showAdminToast(`Field engineering survey team dispatched for ${reqId}.`);
  };

  if (!session || !session.authenticated) {
    return <LoginView onLoginSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col text-neutral-900 selection:bg-teal-100 selection:text-teal-900 font-sans">
      <>
          {/* ============================================================ */}
          {/* 0. MUNICIPALITY ADMIN COMMAND CENTER (FOURTH & FINAL ROLE) */}
          {/* ============================================================ */}
          {session.role === 'MUNICIPAL_ADMIN' && (
            <div className="flex-1 flex min-h-screen bg-[#f8f9fa]">
              {/* Admin Sidebar */}
              <AdminSidebar
                currentTab={currentAdminTab}
                setCurrentTab={setCurrentAdminTab}
                pendingComplaintsCount={adminComplaints.filter((c) => c.status !== 'Resolved').length}
                criticalBinsCount={adminBins.filter((b) => b.status === 'critical').length}
                pendingNewBinsCount={adminNewBins.filter((r) => r.status === 'Pending Review').length}
                isOpenOnMobile={mobileSidebarOpen}
                onCloseMobile={() => setMobileSidebarOpen(false)}
              />

              {/* Admin Main Body */}
              <div className="flex-1 flex flex-col min-w-0">
                <AdminTopBar
                  kpis={adminKpis}
                  unreadNotificationsCount={adminNotifications.filter((n) => !n.read).length}
                  onOpenSearch={() => setIsSearchModalOpen(true)}
                  onOpenNotifications={() => setIsNotificationsModalOpen(true)}
                  onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                  session={session}
                  onSignOut={handleSignOut}
                />

            <main className="flex-1 pb-12">
              {currentAdminTab === 'overview' && (
                <AdminOverview
                  bins={adminBins}
                  workers={adminWorkers}
                  complaints={adminComplaints}
                  newBinRequests={adminNewBins}
                  kpis={adminKpis}
                  setCurrentTab={setCurrentAdminTab}
                  onOpenAssignModal={(bin) => {
                    setAssignModalBin(bin);
                    setIsAssignModalOpen(true);
                  }}
                  onSelectBinForDetail={(bin) => setSelectedAdminBin(bin)}
                  selectedBin={selectedAdminBin}
                />
              )}

              {currentAdminTab === 'live_map' && (
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
                  <div className="border-b border-neutral-200/80 pb-3">
                    <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
                      Live Operations Map · Ward 14
                    </h1>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Showing {adminBins.length} bin, {adminWorkers.length} worker, and {adminNewBins.length} request records.
                    </p>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 min-w-0">
                      <AdminLiveMap
                        bins={adminBins}
                        workers={adminWorkers}
                        newBinRequests={adminNewBins}
                        selectedBin={selectedAdminBin}
                        onSelectBin={(bin) => setSelectedAdminBin(bin)}
                        onSelectNewBinRequest={() => setCurrentAdminTab('new_bins')}
                        heightClass="h-[680px]"
                      />
                    </div>
                    {selectedAdminBin && (
                      <div className="w-full lg:w-96 shrink-0">
                        <AdminBinDetailPanel
                          bin={selectedAdminBin}
                          onClose={() => setSelectedAdminBin(null)}
                          onAssignTask={(bin) => {
                            setAssignModalBin(bin);
                            setIsAssignModalOpen(true);
                          }}
                          onViewRoute={() => setCurrentAdminTab('routes')}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentAdminTab === 'bins' && (
                <AdminBinsView
                  bins={adminBins}
                  onSelectBin={(bin) => setSelectedAdminBin(bin)}
                  onAssignTask={(bin) => {
                    setAssignModalBin(bin);
                    setIsAssignModalOpen(true);
                  }}
                />
              )}

              {currentAdminTab === 'collection' && (
                <AdminCollectionView
                  routes={adminRoutes}
                  workers={adminWorkers}
                  onViewRoute={() => setCurrentAdminTab('routes')}
                />
              )}

              {currentAdminTab === 'sanitation' && (
                <AdminSanitationView
                  bins={adminBins}
                  workers={adminWorkers}
                  onAssignTask={(bin) => {
                    setAssignModalBin(bin);
                    setIsAssignModalOpen(true);
                  }}
                  onSelectBin={(bin) => setSelectedAdminBin(bin)}
                />
              )}

              {currentAdminTab === 'complaints' && (
                <AdminComplaintsView
                  complaints={adminComplaints}
                  onEscalateComplaint={handleAdminEscalateComplaint}
                  onAssignComplaint={(cmp) => {
                    const match = adminBins.find((b) => b.id === cmp.binId) || adminBins[0];
                    setAssignModalBin(match);
                    setIsAssignModalOpen(true);
                  }}
                  onResolveComplaint={handleAdminResolveComplaint}
                />
              )}

              {currentAdminTab === 'new_bins' && (
                <AdminNewBinRequestsView
                  requests={adminNewBins}
                  onApproveRequest={handleAdminApproveNewBin}
                  onRejectRequest={handleAdminRejectNewBin}
                  onInspectRequest={handleAdminInspectNewBin}
                />
              )}

              {currentAdminTab === 'workers' && (
                <AdminWorkersView workers={adminWorkers} />
              )}

              {currentAdminTab === 'routes' && (
                <AdminRoutesView routes={adminRoutes} />
              )}

              {currentAdminTab === 'predictions' && (
                <AdminPredictionsView
                  bins={adminBins}
                  onAssignBin={(bin) => {
                    setAssignModalBin(bin);
                    setIsAssignModalOpen(true);
                  }}
                />
              )}

              {currentAdminTab === 'analytics' && <AdminAnalyticsView />}

              {currentAdminTab === 'reports' && <AdminReportsView />}

              {currentAdminTab === 'settings' && <AdminSettingsView />}
            </main>
          </div>

          {/* Admin Modals */}
          {isAssignModalOpen && assignModalBin && (
            <AdminAssignModal
              bin={assignModalBin}
              workers={adminWorkers}
              onClose={() => {
                setIsAssignModalOpen(false);
                setAssignModalBin(null);
              }}
              onConfirmAssignment={handleAdminAssignTask}
            />
          )}

          {isSearchModalOpen && (
            <AdminSearchModal
              bins={adminBins}
              complaints={adminComplaints}
              newBinRequests={adminNewBins}
              workers={adminWorkers}
              onClose={() => setIsSearchModalOpen(false)}
              onSelectBin={(bin) => {
                setSelectedAdminBin(bin);
                setCurrentAdminTab('overview');
              }}
              onNavigateTab={(tab) => setCurrentAdminTab(tab)}
            />
          )}

          {isNotificationsModalOpen && (
            <AdminNotificationsModal
              notifications={adminNotifications}
              onClose={() => setIsNotificationsModalOpen(false)}
              onMarkAllAsRead={() =>
                setAdminNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
              }
              onSelectNotification={(notif) => {
                setAdminNotifications((prev) =>
                  prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
                );
                setIsNotificationsModalOpen(false);
                if (notif.type === 'complaint' || notif.type === 'sla_breach') {
                  setCurrentAdminTab('complaints');
                } else if (notif.type === 'route_delay') {
                  setCurrentAdminTab('routes');
                } else if (notif.type === 'request') {
                  setCurrentAdminTab('new_bins');
                } else {
                  setCurrentAdminTab('predictions');
                }
              }}
            />
          )}

          {/* Admin Floating Toast */}
          {adminToast && (
            <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-neutral-700 flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-150">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              <span>{adminToast}</span>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. SANITATION WORKER VIEW (THIRD ROLE) */}
      {/* ============================================================ */}
      {session.role === 'SANITATION_WORKER' && (
        <div className="flex-1 flex flex-col pb-16 lg:pb-0">
          <SanitationNavbar
            currentTab={currentSanitationTab}
            setCurrentTab={setCurrentSanitationTab}
            workerProfile={sanitationProfile}
            setWorkerProfile={setSanitationProfile}
            unreadCount={sanitationUnreadCount}
            session={session}
            onSignOut={handleSignOut}
          />

          <main className="flex-1 w-full">
            {currentSanitationTab === 'dashboard' && (
              <SanitationDashboard
                tasks={sanitationTasks}
                workerProfile={sanitationProfile}
                setCurrentTab={setCurrentSanitationTab}
                onSelectTask={setSelectedSanitationTask}
                onStartTask={(task) => setActiveSanitationTaskModal(task)}
                onOpenDetails={(task) => setActiveSanitationDetailsTask(task)}
              />
            )}

            {currentSanitationTab === 'route' && (
              <SanitationRouteView
                tasks={sanitationTasks}
                selectedTask={selectedSanitationTask}
                onSelectTask={setSelectedSanitationTask}
                onStartTask={(task) => setActiveSanitationTaskModal(task)}
                onOpenDetails={(task) => setActiveSanitationDetailsTask(task)}
                onReportProblem={(task) => setActiveSanitationProblemTask(task)}
                workerProfile={sanitationProfile}
              />
            )}

            {currentSanitationTab === 'priority' && (
              <SanitationPriorityView
                tasks={sanitationTasks}
                onStartTask={(task) => setActiveSanitationTaskModal(task)}
                onOpenDetails={(task) => setActiveSanitationDetailsTask(task)}
              />
            )}

            {currentSanitationTab === 'map' && (
              <SanitationMapView
                tasks={sanitationTasks}
                selectedTask={selectedSanitationTask}
                onSelectTask={setSelectedSanitationTask}
                onStartTask={(task) => setActiveSanitationTaskModal(task)}
                onOpenDetails={(task) => setActiveSanitationDetailsTask(task)}
              />
            )}

            {currentSanitationTab === 'complaints' && (
              <SanitationComplaintsView
                tasks={sanitationTasks}
                onStartTaskByBinId={(binId) => {
                  const match = sanitationTasks.find((t) => t.binId === binId);
                  if (match) {
                    setActiveSanitationTaskModal(match);
                  }
                }}
              />
            )}

            {currentSanitationTab === 'history' && (
              <SanitationHistoryView historyRecords={sanitationHistory} />
            )}

            {currentSanitationTab === 'notifications' && (
              <SanitationNotificationsView
                notifications={sanitationNotifications}
                onMarkAsRead={(id) =>
                  setSanitationNotifications((prev) =>
                    prev.map((n) => (n.id === id ? { ...n, read: true } : n))
                  )
                }
                onMarkAllAsRead={() =>
                  setSanitationNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
                }
                setCurrentTab={setCurrentSanitationTab}
                onSelectBinById={(binId) => {
                  const t = sanitationTasks.find((st) => st.binId === binId);
                  if (t) setSelectedSanitationTask(t);
                }}
              />
            )}

            {currentSanitationTab === 'profile' && (
              <SanitationProfileView
                workerProfile={sanitationProfile}
                setWorkerProfile={setSanitationProfile}
              />
            )}
          </main>

          {/* Sanitation Mobile Bottom Navigation */}
          <SanitationBottomNav
            currentTab={currentSanitationTab}
            setCurrentTab={setCurrentSanitationTab}
            pendingCount={sanitationTasks.filter((t) => t.status === 'pending').length}
          />

          {/* Sanitation Modals */}
          {activeSanitationTaskModal && (
            <SanitationTaskModal
              task={activeSanitationTaskModal}
              onClose={() => setActiveSanitationTaskModal(null)}
              onCompleteTask={handleCompleteSanitationTask}
            />
          )}

          {activeSanitationProblemTask && (
            <SanitationProblemModal
              task={activeSanitationProblemTask}
              onClose={() => setActiveSanitationProblemTask(null)}
              onSubmitEscalation={handleEscalateSanitationTask}
            />
          )}

          {activeSanitationDetailsTask && (
            <SanitationTaskDetailsModal
              task={activeSanitationDetailsTask}
              onClose={() => setActiveSanitationDetailsTask(null)}
              onStartTask={(task) => {
                setActiveSanitationDetailsTask(null);
                setActiveSanitationTaskModal(task);
              }}
              onReportProblem={(task) => {
                setActiveSanitationDetailsTask(null);
                setActiveSanitationProblemTask(task);
              }}
            />
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. WASTE COLLECTION WORKER VIEW */}
      {/* ============================================================ */}
      {session.role === 'COLLECTION_WORKER' && (
        <div className="flex-1 flex flex-col pb-16 lg:pb-0">
          <WorkerNavbar
            currentTab={currentWorkerTab}
            setCurrentTab={setCurrentWorkerTab}
            workerProfile={workerProfile}
            setWorkerProfile={setWorkerProfile}
            unreadCount={workerUnreadCount}
            session={session}
            onSignOut={handleSignOut}
          />

          <main className="flex-1 w-full">
            {currentWorkerTab === 'dashboard' && (
              <WorkerDashboard
                stops={routeStops}
                workerProfile={workerProfile}
                setCurrentTab={setCurrentWorkerTab}
                onSelectStop={setSelectedWorkerStop}
                onStartCollection={(stop) => setActiveCollectionStop(stop)}
                onNavigateToStop={(stop) => {
                  setSelectedWorkerStop(stop);
                  setCurrentWorkerTab('route');
                }}
                onOpenDetails={(stop) => setActiveWorkerDetailsStop(stop)}
              />
            )}

            {currentWorkerTab === 'route' && (
              <WorkerRouteView
                stops={routeStops}
                selectedStop={selectedWorkerStop}
                onSelectStop={setSelectedWorkerStop}
                onStartCollection={(stop) => setActiveCollectionStop(stop)}
                onOpenDetails={(stop) => setActiveWorkerDetailsStop(stop)}
                onReportProblem={(stop) => setActiveProblemStop(stop)}
                workerProfile={workerProfile}
              />
            )}

            {currentWorkerTab === 'priority' && (
              <WorkerPriorityView
                stops={routeStops}
                onStartCollection={(stop) => setActiveCollectionStop(stop)}
                onOpenDetails={(stop) => setActiveWorkerDetailsStop(stop)}
              />
            )}

            {currentWorkerTab === 'map' && (
              <WorkerMapView
                stops={routeStops}
                selectedStop={selectedWorkerStop}
                onSelectStop={setSelectedWorkerStop}
                onStartCollection={(stop) => setActiveCollectionStop(stop)}
                onOpenDetails={(stop) => setActiveWorkerDetailsStop(stop)}
              />
            )}

            {currentWorkerTab === 'tasks' && (
              <WorkerPriorityView
                stops={routeStops}
                onStartCollection={(stop) => setActiveCollectionStop(stop)}
                onOpenDetails={(stop) => setActiveWorkerDetailsStop(stop)}
              />
            )}

            {currentWorkerTab === 'history' && (
              <WorkerHistoryView historyRecords={historyRecords} />
            )}

            {currentWorkerTab === 'notifications' && (
              <WorkerNotificationsView
                notifications={workerNotifications}
                onMarkAsRead={(id) =>
                  setWorkerNotifications((prev) =>
                    prev.map((n) => (n.id === id ? { ...n, read: true } : n))
                  )
                }
                onMarkAllAsRead={() =>
                  setWorkerNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
                }
                setCurrentTab={setCurrentWorkerTab}
                onSelectBinById={(binId) => {
                  const s = routeStops.find((st) => st.binId === binId);
                  if (s) setSelectedWorkerStop(s);
                }}
              />
            )}

            {currentWorkerTab === 'profile' && (
              <WorkerProfileView
                workerProfile={workerProfile}
                setWorkerProfile={setWorkerProfile}
              />
            )}
          </main>

          {/* Worker Mobile Bottom Navigation */}
          <WorkerBottomNav
            currentTab={currentWorkerTab}
            setCurrentTab={setCurrentWorkerTab}
            pendingCount={routeStops.filter((s) => s.status === 'pending').length}
          />

          {/* Worker Modals */}
          {activeCollectionStop && (
            <WorkerCollectionTaskModal
              stop={activeCollectionStop}
              onClose={() => setActiveCollectionStop(null)}
              onCompleteCollection={handleCompleteCollection}
            />
          )}

          {activeProblemStop && (
            <WorkerProblemModal
              stop={activeProblemStop}
              onClose={() => setActiveProblemStop(null)}
              onSubmitProblem={handleSubmitProblem}
            />
          )}

          {activeWorkerDetailsStop && (
            <WorkerBinDetailsModal
              stop={activeWorkerDetailsStop}
              onClose={() => setActiveWorkerDetailsStop(null)}
              onStartCollection={(stop) => {
                setActiveWorkerDetailsStop(null);
                setActiveCollectionStop(stop);
              }}
              onReportProblem={(stop) => {
                setActiveWorkerDetailsStop(null);
                setActiveProblemStop(stop);
              }}
            />
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. CITIZEN VIEW */}
      {/* ============================================================ */}
      {session.role === 'CITIZEN' && (
        <div className="flex-1 flex flex-col pb-16 lg:pb-0">
          <Navbar
            currentTab={currentCitizenTab}
            setCurrentTab={setCurrentCitizenTab}
            activeSector={activeSector}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            language={language}
            setLanguage={setLanguage}
            unreadCount={citizenUnreadCount}
            session={session}
            onSignOut={handleSignOut}
          />

          <main className="flex-1 w-full">
            {currentCitizenTab === 'home' && (
              <HomeDashboard
                bins={bins}
                requests={requests}
                userName={session.name}
                activeSector={activeSector}
                onOpenLocationModal={() => setIsLocationModalOpen(true)}
                onSelectBin={(bin) => {
                  setSelectedBin(bin);
                  setIsDetailsModalOpen(true);
                }}
                onNavigateToDirections={(bin) => {
                  setSelectedBin(bin);
                  setActiveDirectionsBin(bin);
                  setCurrentCitizenTab('map');
                }}
                onQuickReportIssue={handleOpenReportModal}
                onQuickRequestCleaning={(bin) => {
                  setCleaningModalBin(bin || null);
                  setIsCleaningModalOpen(true);
                }}
                onQuickRequestNewBin={() => setIsNewBinModalOpen(true)}
                setCurrentTab={setCurrentCitizenTab}
                language={language}
              />
            )}

            {currentCitizenTab === 'map' && (
              <NearbyBinsMap
                bins={bins}
                selectedBin={selectedBin}
                onSelectBin={setSelectedBin}
                onOpenDetailsModal={(bin) => {
                  setSelectedBin(bin);
                  setIsDetailsModalOpen(true);
                }}
                onOpenReportModal={handleOpenReportModal}
                activeDirectionsBin={activeDirectionsBin}
                setActiveDirectionsBin={setActiveDirectionsBin}
                activeSector={activeSector}
                language={language}
              />
            )}

            {currentCitizenTab === 'scanner' && (
              <AiWasteScanner
                onFindBinForCategory={(cat) => {
                  const isDry = cat.toLowerCase().includes('dry');
                  const match = bins.find((b) => isDry ? b.binTypes.includes('dry') : b.binTypes.includes('wet'));
                  if (match) {
                    setSelectedBin(match);
                    setActiveDirectionsBin(match);
                  }
                }}
                setCurrentTab={setCurrentCitizenTab}
                language={language}
              />
            )}

            {currentCitizenTab === 'report' && (
              <div className="py-6">
                <ReportIssueModal
                  initialBin={null}
                  bins={bins}
                  onClose={() => setCurrentCitizenTab('home')}
                  onSubmitReport={handleAddNewReport}
                  language={language}
                />
              </div>
            )}

            {currentCitizenTab === 'sanitization' && (
              <div className="py-6">
                <SanitizationModal
                  initialBin={null}
                  bins={bins}
                  onClose={() => setCurrentCitizenTab('home')}
                  onSubmitCleaningRequest={handleAddNewCleaningRequest}
                  language={language}
                />
              </div>
            )}

            {currentCitizenTab === 'new_bin' && (
              <div className="py-6">
                <RequestNewBinModal
                  onClose={() => setCurrentCitizenTab('home')}
                  onSubmitNewBinRequest={handleAddNewBinSuggestion}
                  activeSector={activeSector}
                  language={language}
                />
              </div>
            )}

            {currentCitizenTab === 'requests' && (
              <MyRequestsView
                requests={requests}
                onUpdateRequest={handleUpdateRequest}
                setCurrentTab={setCurrentCitizenTab}
                language={language}
              />
            )}

            {currentCitizenTab === 'notifications' && (
              <NotificationsView
                notifications={notifications}
                onMarkAsRead={(id) =>
                  setNotifications((prev) =>
                    prev.map((n) => (n.id === id ? { ...n, read: true } : n))
                  )
                }
                onMarkAllAsRead={() =>
                  setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
                }
                onSelectBinById={(binId) => {
                  const bin = bins.find((b) => b.id === binId);
                  if (bin) setSelectedBin(bin);
                }}
                onSelectRequestById={() => {}}
                setCurrentTab={setCurrentCitizenTab}
                language={language}
              />
            )}

            {currentCitizenTab === 'profile' && (
              <ProfileView
                language={language}
                setLanguage={setLanguage}
                session={session}
                activeSector={activeSector}
                onOpenLocationModal={() => setIsLocationModalOpen(true)}
              />
            )}
          </main>

          <BottomNav
            currentTab={currentCitizenTab}
            setCurrentTab={setCurrentCitizenTab}
            language={language}
          />

          {/* Citizen Modals */}
          {isDetailsModalOpen && selectedBin && (
            <BinDetailsModal
              bin={selectedBin}
              onClose={() => setIsDetailsModalOpen(false)}
              onReportIssue={(bin) => {
                setIsDetailsModalOpen(false);
                handleOpenReportModal(bin);
              }}
              onRequestCleaning={(bin) => {
                setIsDetailsModalOpen(false);
                setCleaningModalBin(bin);
                setIsCleaningModalOpen(true);
              }}
              onGetDirections={(bin) => {
                setIsDetailsModalOpen(false);
                setSelectedBin(bin);
                setActiveDirectionsBin(bin);
                setCurrentCitizenTab('map');
              }}
              language={language}
            />
          )}

          {isReportModalOpen && (
            <ReportIssueModal
              initialBin={reportModalBin}
              bins={bins}
              onClose={() => {
                setIsReportModalOpen(false);
                setReportModalBin(null);
              }}
              onSubmitReport={handleAddNewReport}
              language={language}
            />
          )}

          {isCleaningModalOpen && (
            <SanitizationModal
              initialBin={cleaningModalBin}
              bins={bins}
              onClose={() => {
                setIsCleaningModalOpen(false);
                setCleaningModalBin(null);
              }}
              onSubmitCleaningRequest={handleAddNewCleaningRequest}
              language={language}
            />
          )}

          {isNewBinModalOpen && (
            <RequestNewBinModal
              onClose={() => setIsNewBinModalOpen(false)}
              onSubmitNewBinRequest={handleAddNewBinSuggestion}
              activeSector={activeSector}
              language={language}
            />
          )}

          {isLocationModalOpen && (
            <LocationPickerModal
              activeSector={activeSector}
              onSelectSector={handleSelectSector}
              onClose={() => setIsLocationModalOpen(false)}
              language={language}
            />
          )}
        </div>
      )}
      </>
    </div>
  );
}
