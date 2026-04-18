import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn, getInitials } from './lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Library, 
  Bell, 
  Settings as SettingsIcon,
  LogOut,
  HelpCircle,
  History as HistoryIcon,
  BrainCircuit,
  Microscope,
  Syringe,
  ChevronRight,
  Menu,
  Loader2
} from 'lucide-react';
import Home from './pages/Home';
import SymptomSelection from './pages/SymptomSelection';
import Processing from './pages/Processing';
import DiagnosisResult from './pages/DiagnosisResult';
import History from './pages/History';
import Settings from './pages/Settings';
import LibraryPage from './pages/Library';
import Deployment from './pages/Deployment';
import Treatment from './pages/Treatment';
import LabInterpretation from './pages/LabInterpretation';
import VitalsDashboard from './pages/VitalsDashboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider, useAuth } from './lib/AuthContext';

function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  
  const navItems = [
    { name: 'Inference Engine', icon: BrainCircuit, path: '/processing' },
    { name: 'Symptom Analyzer', icon: Stethoscope, path: '/symptoms' },
    { name: 'Lab Interpretation', icon: Microscope, path: '/lab' },
    { name: 'Treatment Protocol', icon: Syringe, path: '/treatment' },
    { name: 'History', icon: HistoryIcon, path: '/history' },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 pt-20 border-r border-outline-variant/20 bg-surface-container-low hidden md:flex flex-col z-40">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <div>
          <p className="font-headline font-bold text-sm tracking-tight">System Active</p>
          <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-widest">Engine v2.4.1</p>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-6 py-3 transition-all hover:translate-x-1 duration-150 font-sans text-sm font-medium",
                isActive 
                  ? "bg-surface-container-lowest text-primary shadow-sm rounded-r-full mr-4" 
                  : "text-on-surface-variant hover:bg-primary/5"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-on-surface-variant")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4">
        <Link 
          to="/symptoms"
          className="w-full py-3 primary-gradient text-on-primary rounded-xl font-headline font-bold text-sm shadow-md flex items-center justify-center transition-all active:scale-95"
        >
          New Consultation
        </Link>
      </div>

      <div className="mt-auto border-t border-outline-variant/20 py-4">
        <Link to="/support" className="flex items-center gap-3 text-on-surface-variant px-6 py-2 hover:bg-primary/5 transition-all text-sm font-medium">
          <HelpCircle className="w-4 h-4" /> Support
        </Link>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 text-on-surface-variant px-6 py-2 hover:bg-primary/5 transition-all text-sm font-medium"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
}

function Topbar() {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const { user } = useAuth();
  
  const notifications = [
    { id: 1, title: 'New Diagnosis Result', desc: 'Patient Sarah Jenkins analysis complete.', time: '2m ago', unread: true },
    { id: 2, title: 'System Update', desc: 'Inference Engine updated to v2.4.1.', time: '1h ago', unread: false },
    { id: 3, title: 'Critical Alert', desc: 'SpO2 threshold reached for Patient ID #882.', time: '3h ago', unread: true },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel shadow-sm h-16">
      <div className="flex justify-between items-center px-4 sm:px-8 h-16 w-full max-w-[1920px] mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tighter text-primary font-headline">
            Clinical Intelligence
          </Link>
          <div className="hidden md:flex items-center gap-6 font-headline tracking-tight font-semibold text-sm">
            <Link to="/" className="text-on-surface-variant hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/history" className="text-on-surface-variant hover:text-primary transition-colors">Patient Records</Link>
            <Link to="/deployment" className="text-on-surface-variant hover:text-primary transition-colors">Diagnostic Tools</Link>
            <Link to="/library" className="text-on-surface-variant hover:text-primary transition-colors">Medical Library</Link>
          </div>
        </div>
        
        <div className="flex items-center gap-4 relative">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                "p-2 rounded-lg transition-all active:scale-95 relative",
                showNotifications ? "bg-primary/10 text-primary" : "hover:bg-surface-container-high text-on-surface-variant"
              )}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowNotifications(false)}
                    className="fixed inset-0 z-[-1]"
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-[-4rem] sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-[320px] bg-surface-container-lowest rounded-2xl clinical-shadow border border-outline-variant/10 overflow-hidden z-[60]"
                  >
                    <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low">
                      <h4 className="font-headline font-bold text-sm text-on-surface">Notifications</h4>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">3 New</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className={cn("p-4 border-b border-outline-variant/5 hover:bg-primary/5 transition-colors cursor-pointer", n.unread && "bg-primary/5")}>
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-xs font-bold text-on-surface">{n.title}</p>
                            <span className="text-[10px] text-on-surface-variant">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-on-surface-variant leading-relaxed">{n.desc}</p>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-3 text-xs font-bold text-primary hover:bg-primary/5 transition-all">
                      View All Notifications
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <Link to="/settings" className="p-2 hover:bg-surface-container-high rounded-lg transition-all active:scale-95">
            <SettingsIcon className="w-5 h-5 text-on-surface-variant" />
          </Link>
          
          <Link to="/profile" className="relative group">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover border border-outline-variant/20 group-hover:border-primary transition-all"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-[10px] font-bold border border-outline-variant/20 group-hover:border-primary transition-all">
                {getInitials(user?.name || '')}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/10 transition-all" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, loading } = useAuth();
  const isLanding = location.pathname === '/';
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (isAuthPage) {
    return <main className="min-h-screen">{children}</main>;
  }

  // Redirect to login if not authenticated and not on landing page
  if (!user && !isLanding) {
    return <Login />;
  }
  
  return (
    <div className="min-h-screen bg-background text-on-surface font-sans antialiased">
      <Topbar />
      {!isLanding && <Sidebar />}
      <main className={cn("pt-16 transition-all duration-300", !isLanding && "md:pl-64")}>
        {children}
      </main>
      
      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full glass-panel border-t border-outline-variant/20 flex justify-around items-center h-16 z-50">
        <Link to="/" className="flex flex-col items-center gap-1 text-on-surface-variant">
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link to="/history" className="flex flex-col items-center gap-1 text-on-surface-variant">
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-medium">Patients</span>
        </Link>
        <Link to="/settings" className="flex flex-col items-center gap-1 text-primary">
          <SettingsIcon className="w-5 h-5" />
          <span className="text-[10px] font-medium">Settings</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center gap-1 text-on-surface-variant">
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/symptoms" element={<SymptomSelection />} />
            <Route path="/processing" element={<Processing />} />
            <Route path="/result" element={<DiagnosisResult />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/deployment" element={<Deployment />} />
            <Route path="/treatment" element={<Treatment />} />
            <Route path="/lab" element={<LabInterpretation />} />
            <Route path="/vitals" element={<VitalsDashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
