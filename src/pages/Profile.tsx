import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Shield, 
  Award, 
  Calendar, 
  MapPin, 
  Edit3,
  Camera,
  LogOut,
  X,
  Save,
  Loader2
} from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn, getInitials } from '../lib/utils';
import { useAuth } from '../lib/AuthContext';

export default function Profile() {
  const { user, logout, token, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    role: user?.role || '',
    specialization: (user as any)?.specialization || "Internal Medicine & Infectious Diseases",
    phone: (user as any)?.phone || "+233 (0) 55 942 0312",
    location: (user as any)?.location || "Korle-Bu Teaching Hospital, Accra",
    license: (user as any)?.license || "MD-8842-9910",
    bio: (user as any)?.bio || "Dr. Thorne has over 15 years of experience in internal medicine, specializing in the management of complex infectious diseases. He has been a lead contributor to the Clinical Intelligence Framework, focusing on the development of the forward-chaining inference engine for respiratory diagnostics.",
    avatar: user?.avatar || ""
  });

  if (!user) return null;

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      role: user?.role || '',
      specialization: (user as any)?.specialization || "Internal Medicine & Infectious Diseases",
      phone: (user as any)?.phone || "+233 (0) 55 942 0312",
      location: (user as any)?.location || "Korle-Bu Teaching Hospital, Accra",
      license: (user as any)?.license || "MD-8842-9910",
      bio: (user as any)?.bio || "Dr. Thorne has over 15 years of experience in internal medicine, specializing in the management of complex infectious diseases. He has been a lead contributor to the Clinical Intelligence Framework, focusing on the development of the forward-chaining inference engine for respiratory diagnostics.",
      avatar: user?.avatar || ""
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    try {
      if (!user) throw new Error("Not authenticated");
      
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, formData);
      
      updateUser({ ...user, ...formData });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = () => {
    const newAvatar = prompt("Enter new image URL (leave empty to use initials):", formData.avatar);
    if (newAvatar !== null) {
      setFormData(prev => ({ ...prev, avatar: newAvatar }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 pb-32">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Profile Card */}
        <aside className="w-full md:w-80 shrink-0 space-y-6">
          <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 clinical-shadow border border-outline-variant/10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-primary/5" />
            <div className="relative">
              <div className="relative inline-block">
                {formData.avatar ? (
                  <img 
                    src={formData.avatar} 
                    alt={formData.name} 
                    className="w-32 h-32 rounded-full object-cover border-4 border-white clinical-shadow"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white clinical-shadow bg-primary flex items-center justify-center text-on-primary text-3xl font-headline font-bold">
                    {getInitials(formData.name)}
                  </div>
                )}
                <button 
                  onClick={handleAvatarChange}
                  className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              {isEditing ? (
                <div className="mt-6 space-y-3">
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 text-center font-headline font-bold text-xl bg-surface-container-low rounded-xl border border-primary/20 outline-none"
                    placeholder="Full Name"
                  />
                  <input 
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full p-2 text-center text-primary font-bold text-xs uppercase tracking-widest bg-surface-container-low rounded-xl border border-primary/20 outline-none"
                    placeholder="Role"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-headline font-bold text-on-surface mt-6">{formData.name}</h2>
                  <p className="text-primary font-bold text-sm uppercase tracking-widest mt-1">{formData.role}</p>
                </>
              )}
              
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wide">Verified Practitioner</span>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-outline-variant/10 space-y-4 text-left">
              <div className="flex items-center gap-3 text-on-surface-variant">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium truncate">{user.email}</span>
              </div>
              
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <input 
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full p-2 text-xs font-medium bg-surface-container-low rounded-lg border border-primary/10 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <input 
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full p-2 text-xs font-medium bg-surface-container-low rounded-lg border border-primary/10 outline-none"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium">{formData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium">{formData.location}</span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 space-y-3">
              {isEditing ? (
                <div className="flex gap-2">
                  <button 
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                  </button>
                  <button 
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="p-3 bg-surface-container-high text-on-surface-variant rounded-xl hover:bg-surface-variant transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full py-3 bg-surface-container-high text-primary rounded-xl font-bold text-sm hover:bg-surface-variant transition-all flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
              )}
            </div>
            
            {error && <p className="mt-4 text-[10px] text-rose-500 font-bold">{error}</p>}
          </div>

          <div className="bg-primary-fixed/30 p-8 rounded-[2.5rem] border border-primary/10">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h3 className="font-headline font-bold text-on-surface">Security Status</h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
              Your account is protected with two-factor authentication and clinical-grade encryption.
            </p>
            <button className="text-primary font-bold text-xs hover:underline">Manage Security Settings</button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="bg-surface-container-lowest rounded-[2.5rem] p-10 clinical-shadow border border-outline-variant/10">
            <h3 className="text-2xl font-headline font-bold text-on-surface mb-8">Professional Credentials</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Primary Specialization</label>
                {isEditing ? (
                  <input 
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                    className="w-full p-4 bg-surface-container-low rounded-2xl border border-primary/10 font-bold text-on-surface outline-none focus:border-primary/30"
                  />
                ) : (
                  <div className="p-4 bg-surface-container-low rounded-2xl flex items-center gap-4">
                    <Stethoscope className="w-6 h-6 text-primary" />
                    <span className="font-bold text-on-surface">{formData.specialization}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Medical License</label>
                {isEditing ? (
                  <input 
                    type="text"
                    value={formData.license}
                    onChange={(e) => setFormData(prev => ({ ...prev, license: e.target.value }))}
                    className="w-full p-4 bg-surface-container-low rounded-2xl border border-primary/10 font-bold text-on-surface outline-none focus:border-primary/30"
                  />
                ) : (
                  <div className="p-4 bg-surface-container-low rounded-2xl flex items-center gap-4">
                    <Award className="w-6 h-6 text-primary" />
                    <span className="font-bold text-on-surface">{formData.license}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Member Since</label>
                <div className="p-4 bg-surface-container-low rounded-2xl flex items-center gap-4">
                  <Calendar className="w-6 h-6 text-primary" />
                  <span className="font-bold text-on-surface">{user.joined}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">System Access Level</label>
                <div className="p-4 bg-surface-container-low rounded-2xl flex items-center gap-4">
                  <Shield className="w-6 h-6 text-primary" />
                  <span className="font-bold text-on-surface">Administrator</span>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h4 className="font-headline font-bold text-on-surface mb-4">Clinical Biography</h4>
              {isEditing ? (
                <textarea 
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full p-6 bg-surface-container-low rounded-2xl border border-primary/10 text-on-surface-variant leading-relaxed outline-none focus:border-primary/30 resize-none"
                  placeholder="Tell us about your professional background..."
                />
              ) : (
                <p className="text-on-surface-variant leading-relaxed">
                  {formData.bio}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-surface-container-high p-8 rounded-[2.5rem]">
              <h4 className="font-headline font-bold text-on-surface mb-4">Recent Activity</h4>
              <div className="space-y-4">
                {[
                  { action: 'Updated Protocol', target: 'Viral Recovery', time: '2h ago' },
                  { action: 'Reviewed Record', target: 'Sarah Jenkins', time: '5h ago' },
                  { action: 'Exported Report', target: 'Monthly Analytics', time: '1d ago' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0">
                    <div>
                      <p className="text-sm font-bold text-on-surface">{item.action}</p>
                      <p className="text-[10px] text-on-surface-variant">{item.target}</p>
                    </div>
                    <span className="text-[10px] text-on-surface-variant font-medium">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-low p-8 rounded-[2.5rem] flex flex-col justify-between">
              <div>
                <h4 className="font-headline font-bold text-on-surface mb-2">Account Actions</h4>
                <p className="text-xs text-on-surface-variant mb-6">Manage your session and account preferences.</p>
              </div>
              <div className="space-y-3">
                <button className="w-full py-3 bg-white text-on-surface rounded-xl font-bold text-sm shadow-sm hover:bg-primary/5 transition-all">
                  Change Password
                </button>
                <button 
                  onClick={logout}
                  className="w-full py-3 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-100 transition-all"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stethoscope(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  );
}
