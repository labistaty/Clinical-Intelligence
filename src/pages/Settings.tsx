import { Link } from 'react-router-dom';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Database, 
  Zap, 
  ChevronRight,
  Sun,
  Lock
} from 'lucide-react';

const sections = [
  { 
    title: 'Account', 
    items: [
      { label: 'Profile Information', desc: 'Update your professional details', icon: User, path: '/profile' },
      { label: 'Security', desc: 'Manage password and 2FA', icon: Lock },
      { label: 'Notifications', desc: 'Configure diagnostic alerts', icon: Bell },
    ]
  },
  { 
    title: 'System', 
    items: [
      { label: 'Inference Engine', desc: 'Adjust logic depth', icon: Zap },
      { label: 'Data Sources', desc: 'Manage connected databases', icon: Database },
      { label: 'Regional Settings', desc: 'Language and standards', icon: Globe },
    ]
  }
];

export default function Settings() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-12">
        <span className="text-primary font-headline font-bold text-sm tracking-widest uppercase">Configuration</span>
        <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface mt-2 tracking-tight">System Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-4 space-y-4">
          <div className="p-6 bg-primary-fixed/30 rounded-3xl border border-primary/20">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">System Status</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-bold text-on-surface">Operational</span>
            </div>
            <p className="text-[10px] text-on-surface-variant">Version 2.4.1 (Stable)</p>
          </div>
        </aside>

        <div className="lg:col-span-8 space-y-12">
          {sections.map((section) => (
            <section key={section.title} className="space-y-4">
              <h2 className="px-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest">{section.title}</h2>
              <div className="bg-surface-container-lowest rounded-3xl clinical-shadow overflow-hidden divide-y divide-outline-variant/10">
                {section.items.map((item) => {
                  const ButtonWrapper = item.path ? Link : 'button';
                  return (
                    <ButtonWrapper 
                      key={item.label} 
                      to={item.path as any}
                      className="w-full flex items-center justify-between p-6 hover:bg-primary/5 transition-all group text-left"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center group-hover:bg-white transition-colors">
                          <item.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-headline font-bold text-on-surface">{item.label}</h3>
                          <p className="text-sm text-on-surface-variant">{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-outline-variant group-hover:text-primary transition-all" />
                    </ButtonWrapper>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
