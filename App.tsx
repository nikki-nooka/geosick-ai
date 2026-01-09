
import React, { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { WelcomePage } from './components/WelcomePage';
import { GlobePage } from './components/GlobePage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { ChatBot } from './components/ChatBot';
import { ImageAnalysisPage } from './components/ImageAnalysisPage';
import { CheckupPage } from './components/CheckupPage';
import { PrescriptionAnalysisPage } from './components/PrescriptionAnalysisPage';
import { IntroAnimation } from './components/IntroAnimation';
import { MentalHealthPage } from './components/MentalHealthPage';
import { SymptomCheckerPage } from './components/SymptomCheckerPage';
import { AuthPage } from './components/AuthPage';
import { ActivityHistoryPage } from './components/ActivityHistoryPage';
import type { User, ActivityLogItem, Page } from './types';
import { HealthForecast } from './components/HealthForecast';
import { AdminDashboardPage } from './components/AdminDashboardPage';
import { ProfilePage } from './components/ProfilePage';
import { Sidebar } from './components/Sidebar';
import { AlertsPage } from './components/AlertsPage';
import { WaterLogPage } from './components/WaterLogPage';
import { Bars3Icon, GlobeIcon } from './components/icons';
import { FeedbackModal } from './components/FeedbackModal';
import { I18nProvider } from './components/I18n';
import { supabase } from './services/supabaseClient';

const ACTIVITY_HISTORY_KEY = 'geosick_activity_history';
const GLOBAL_ACTIVITY_HISTORY_KEY = 'geosick_global_activity_history';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showIntro, setShowIntro] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [activityHistory, setActivityHistory] = useState<ActivityLogItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  useEffect(() => {
    // Check Supabase session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setCurrentPage('home');
      }
    });

    // Load personal activity history from local cache for speed (optional)
    try {
      const storedHistory = localStorage.getItem(ACTIVITY_HISTORY_KEY);
      if (storedHistory) {
          setActivityHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
        console.error("Could not load activity history:", error);
    }

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) {
        setUser({
          id: data.id,
          phone: data.phone,
          name: data.full_name,
          email: data.email,
          date_of_birth: data.dob,
          gender: data.gender,
          place: data.place,
          created_at: data.created_at,
          last_login_at: data.last_login_at,
          isAdmin: data.is_admin,
        });
        if (currentPage === 'home') setCurrentPage('welcome');
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const addGlobalActivityToHistory = (item: ActivityLogItem) => {
      try {
          const globalHistory: ActivityLogItem[] = JSON.parse(localStorage.getItem(GLOBAL_ACTIVITY_HISTORY_KEY) || '[]');
          const newGlobalHistory = [item, ...globalHistory];
          localStorage.setItem(GLOBAL_ACTIVITY_HISTORY_KEY, JSON.stringify(newGlobalHistory));
      } catch (error) {
           console.error("Could not save global activity:", error);
      }
  };

  const addActivityToHistory = (item: Omit<ActivityLogItem, 'id' | 'timestamp' | 'userPhone'>) => {
      if (!user) return;
      const newActivity: ActivityLogItem = {
          ...item,
          id: new Date().toISOString() + Math.random(),
          timestamp: Date.now(),
          userPhone: user.phone,
      };

      setActivityHistory(prevHistory => {
          const newHistory = [newActivity, ...prevHistory];
          try {
            localStorage.setItem(ACTIVITY_HISTORY_KEY, JSON.stringify(newHistory));
          } catch (error) {
              console.error("Could not save activity history:", error);
          }
          return newHistory;
      });

      addGlobalActivityToHistory(newActivity);
  };
  
  const handleUpdateUser = async (updatedDetails: Partial<User>) => {
    if (!user?.id) return false;
    
    try {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: updatedDetails.name,
            email: updatedDetails.email,
            place: updatedDetails.place,
            gender: updatedDetails.gender,
          })
          .eq('id', user.id);

        if (error) throw error;
        
        await fetchUserProfile(user.id);
        return true;
    } catch (error) {
        console.error("Failed to update user:", error);
        return false;
    }
  };

  const handleAuthSuccess = (authedUser: User) => {
    setUser(authedUser);
    setShowAuth(false);
    setCurrentPage('welcome');
  };
  
  const handleLogout = async () => {
      await supabase.auth.signOut();
      setUser(null);
      setCurrentPage('home');
      setIsFeedbackModalOpen(false);
  };

  const handleNavigation = (page: Page) => {
      setCurrentPage(page);
  };
  
  const renderPublicPages = () => {
    switch (currentPage) {
        case 'about':
            return <AboutPage onBack={() => setCurrentPage('home')} />;
        case 'contact':
            return <ContactPage onBack={() => setCurrentPage('home')} />;
        case 'explore':
             return <GlobePage onBack={() => setCurrentPage('home')} />;
        case 'home':
        default:
            return <HomePage
                onLoginClick={() => setShowAuth(true)}
                onAboutClick={() => setCurrentPage('about')}
                onContactClick={() => setCurrentPage('contact')}
                onExploreClick={() => setCurrentPage('explore')}
            />;
    }
  }

  const renderAuthenticatedApp = () => {
    if (!user) return null;

    const renderPage = () => {
        const isAdmin = !!user.isAdmin;
        switch (currentPage) {
            case 'welcome':
            case 'home':
                return <WelcomePage
                    user={user}
                    onAnalyze={() => setCurrentPage('image-analysis')}
                    onAnalyzePrescription={() => setCurrentPage('prescription-analysis')}
                    onAnalyzeMentalHealth={() => setCurrentPage('mental-health')}
                    onCheckSymptoms={() => setCurrentPage('symptom-checker')}
                    onWaterLog={() => setCurrentPage('water-log')}
                />;
            case 'live-alerts':
                return <AlertsPage />;
            case 'image-analysis':
                return <ImageAnalysisPage
                    onBack={() => setCurrentPage('welcome')}
                    onScheduleCheckup={() => setCurrentPage('checkup')}
                    onAnalysisComplete={addActivityToHistory}
                />;
            case 'prescription-analysis':
                return <PrescriptionAnalysisPage onBack={() => setCurrentPage('welcome')} onAnalysisComplete={addActivityToHistory} />;
            case 'checkup':
                return <CheckupPage onBack={() => setCurrentPage('image-analysis')} />;
            case 'mental-health':
                return <MentalHealthPage onBack={() => setCurrentPage('welcome')} onAnalysisComplete={addActivityToHistory} />;
            case 'symptom-checker':
                return <SymptomCheckerPage onBack={() => setCurrentPage('welcome')} onAnalysisComplete={addActivityToHistory} />;
            case 'health-briefing': 
                 return <HealthForecast onBack={() => setCurrentPage('welcome')} />;
            case 'activity-history':
                 return <ActivityHistoryPage history={activityHistory} onBack={() => setCurrentPage('welcome')} />;
            case 'profile':
                return <ProfilePage user={user} onBack={() => setCurrentPage('welcome')} onUpdateUser={handleUpdateUser} />;
            case 'water-log':
                return <WaterLogPage onBack={() => setCurrentPage('welcome')} />;
            case 'admin-dashboard':
                return isAdmin ? <AdminDashboardPage onBack={() => setCurrentPage('welcome')} /> : <p>Access Denied.</p>;
            case 'about':
                 return <AboutPage onBack={() => setCurrentPage('welcome')} />;
            case 'contact':
                return <ContactPage onBack={() => setCurrentPage('welcome')} />;
            case 'explore':
                return <GlobePage onBack={() => setCurrentPage('welcome')} />;
            default:
                return <WelcomePage
                    user={user}
                    onAnalyze={() => setCurrentPage('image-analysis')}
                    onAnalyzePrescription={() => setCurrentPage('prescription-analysis')}
                    onAnalyzeMentalHealth={() => setCurrentPage('mental-health')}
                    onCheckSymptoms={() => setCurrentPage('symptom-checker')}
                    onWaterLog={() => setCurrentPage('water-log')}
                />;
        }
    };
    
    return (
        <div className="flex h-screen bg-slate-100">
            <Sidebar 
                user={user} 
                currentPage={currentPage} 
                onNavigate={(page: Page) => {
                    handleNavigation(page);
                    setIsSidebarOpen(false);
                }} 
                onLogout={handleLogout}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
            />
             <div className="flex-1 flex flex-col">
                <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm relative z-20">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 p-1" aria-label="Open menu">
                        <Bars3Icon className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-2">
                        <GlobeIcon className="w-7 h-7 text-blue-500" />
                        <h1 className="text-lg font-bold tracking-tight text-slate-800">GeoSick</h1>
                    </div>
                    <div className="w-7"></div>
                </header>
                <main className="flex-1 overflow-y-auto">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
  };

  if (showIntro) {
    return <IntroAnimation onComplete={() => setShowIntro(false)} />;
  }

  return (
    <>
      {user ? renderAuthenticatedApp() : renderPublicPages()}
      {user && <ChatBot onNavigate={handleNavigation} />}
      {user && isFeedbackModalOpen && (
        <FeedbackModal 
            user={user}
            onClose={() => setIsFeedbackModalOpen(false)} 
        />
      )}
      {showAuth && (
        <AuthPage
          onClose={() => setShowAuth(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
}

export default function App() {
    return (
        <I18nProvider>
            <AppContent />
        </I18nProvider>
    );
}
