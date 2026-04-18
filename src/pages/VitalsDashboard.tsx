import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Heart, 
  Thermometer, 
  Wind, 
  ArrowLeft, 
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Legend
} from 'recharts';
import { cn } from '../lib/utils';

import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';

export default function VitalsDashboard() {
  const { user } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showQuickEntry, setShowQuickEntry] = useState(false);
  
  const [formData, setFormData] = useState({
    patient: '',
    vitals: {
      bp: '',
      hr: '',
      spo2: '',
      temp: ''
    }
  });

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'records'),
      where('doctorId', '==', user.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Filter records that have vitals and are within the last 24 hours
      const vitalsData = allData
        .filter((r: any) => {
          const createdAtDate = r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt);
          const hasVitals = r.vitals && (r.vitals.hr || r.vitals.temp);
          const isRecent = createdAtDate >= twentyFourHoursAgo;
          return hasVitals && isRecent;
        })
        .map((r: any) => {
          const createdAtDate = r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt);
          return {
            ...r,
            date: createdAtDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            timestamp: createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            hr: parseInt(r.vitals.hr) || null,
            temp: parseFloat(r.vitals.temp) || null,
            spo2: parseInt(r.vitals.spo2) || null,
            fullTime: createdAtDate.getTime()
          };
        })
        .sort((a: any, b: any) => a.fullTime - b.fullTime);
      
      setRecords(vitalsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleQuickSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patient || !user) return;

    setIsSaving(true);
    try {
      await addDoc(collection(db, 'records'), {
        ...formData,
        doctorId: user.id,
        diagnosis: 'Vitals Check',
        status: 'Monitoring',
        confidence: '100%',
        priority: 'Standard',
        createdAt: serverTimestamp()
      });

      setFormData({
        patient: '',
        vitals: { bp: '', hr: '', spo2: '', temp: '' }
      });
      setShowQuickEntry(false);
    } catch (error) {
      console.error("Failed to save vitals:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const latestVitals = records[records.length - 1]?.vitals || { hr: '--', temp: '--', spo2: '--', bp: '--/--' };

  const checkVitals = (vitals: any) => {
    const status = {
      hr: 'normal',
      temp: 'normal',
      spo2: 'normal',
      bp: 'normal'
    };

    if (vitals.hr) {
      const hr = parseInt(vitals.hr);
      if (hr > 100 || hr < 60) status.hr = 'abnormal';
    }
    if (vitals.temp) {
      const temp = parseFloat(vitals.temp);
      if (temp > 37.5 || temp < 36.0) status.temp = 'abnormal';
    }
    if (vitals.spo2) {
      const spo2 = parseInt(vitals.spo2);
      if (spo2 < 95) status.spo2 = 'abnormal';
    }
    if (vitals.bp && vitals.bp.includes('/')) {
      const [sys, dia] = vitals.bp.split('/').map((v: string) => parseInt(v.trim()));
      if (sys >= 140 || dia >= 90) status.bp = 'abnormal';
    }

    return status;
  };

  const latestStatus = checkVitals(latestVitals);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/treatment" className="p-2 hover:bg-surface-container-high rounded-full transition-all">
          <ArrowLeft className="w-6 h-6 text-on-surface-variant" />
        </Link>
        <div>
          <span className="text-primary font-headline font-bold text-sm tracking-widest uppercase">Patient Monitoring</span>
          <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">Vitals Dashboard</h1>
        </div>
        <button 
          onClick={() => setShowQuickEntry(!showQuickEntry)}
          className="ml-auto flex items-center gap-2 px-6 py-3 primary-gradient text-on-primary font-bold rounded-xl clinical-shadow active:scale-95 transition-all"
        >
          <Activity className="w-4 h-4" />
          Quick Vitals Entry
        </button>
      </div>

      <AnimatePresence>
        {showQuickEntry && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-12"
          >
            <form onSubmit={handleQuickSave} className="bg-surface-container-high p-8 rounded-[2.5rem] clinical-shadow border border-primary/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Manual Vitals Entry
                </h3>
                <button 
                  type="button"
                  onClick={() => setShowQuickEntry(false)}
                  className="text-xs font-bold text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors"
                >
                  Cancel
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Patient Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.patient}
                    onChange={(e) => setFormData({...formData, patient: e.target.value})}
                    placeholder="Enter patient name"
                    className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Blood Pressure</label>
                  <input 
                    type="text" 
                    value={formData.vitals.bp}
                    onChange={(e) => setFormData({...formData, vitals: {...formData.vitals, bp: e.target.value}})}
                    placeholder="120/80"
                    className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Heart Rate (BPM)</label>
                  <input 
                    type="number" 
                    value={formData.vitals.hr}
                    onChange={(e) => setFormData({...formData, vitals: {...formData.vitals, hr: e.target.value}})}
                    placeholder="72"
                    className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">SpO2 (%)</label>
                  <input 
                    type="number" 
                    value={formData.vitals.spo2}
                    onChange={(e) => setFormData({...formData, vitals: {...formData.vitals, spo2: e.target.value}})}
                    placeholder="98"
                    className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Temp (°C)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={formData.vitals.temp}
                    onChange={(e) => setFormData({...formData, vitals: {...formData.vitals, temp: e.target.value}})}
                    placeholder="36.6"
                    className="w-full px-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  />
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button 
                  disabled={isSaving}
                  className="px-8 py-3 primary-gradient text-on-primary font-bold rounded-xl clinical-shadow active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Record Vitals'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className={cn(
          "p-6 rounded-[2rem] clinical-shadow border transition-all duration-300",
          latestStatus.hr === 'abnormal' 
            ? "bg-rose-50 border-rose-200" 
            : "bg-surface-container-lowest border-outline-variant/10"
        )}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <Heart className="w-5 h-5 text-rose-600" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Heart Rate</span>
            </div>
            {latestStatus.hr === 'abnormal' && <AlertCircle className="w-5 h-5 text-rose-500 animate-pulse" />}
          </div>
          <div className="flex items-baseline gap-2">
            <span className={cn(
              "text-4xl font-headline font-extrabold",
              latestStatus.hr === 'abnormal' ? "text-rose-700" : "text-on-surface"
            )}>{latestVitals.hr}</span>
            <span className="text-sm font-bold text-on-surface-variant">BPM</span>
          </div>
        </div>

        <div className={cn(
          "p-6 rounded-[2rem] clinical-shadow border transition-all duration-300",
          latestStatus.temp === 'abnormal' 
            ? "bg-amber-50 border-amber-200" 
            : "bg-surface-container-lowest border-outline-variant/10"
        )}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Thermometer className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Temperature</span>
            </div>
            {latestStatus.temp === 'abnormal' && <AlertCircle className="w-5 h-5 text-amber-500 animate-pulse" />}
          </div>
          <div className="flex items-baseline gap-2">
            <span className={cn(
              "text-4xl font-headline font-extrabold",
              latestStatus.temp === 'abnormal' ? "text-amber-700" : "text-on-surface"
            )}>{latestVitals.temp}</span>
            <span className="text-sm font-bold text-on-surface-variant">°C</span>
          </div>
        </div>

        <div className={cn(
          "p-6 rounded-[2rem] clinical-shadow border transition-all duration-300",
          latestStatus.spo2 === 'abnormal' 
            ? "bg-rose-50 border-rose-200" 
            : "bg-surface-container-lowest border-outline-variant/10"
        )}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center">
                <Wind className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">SpO2</span>
            </div>
            {latestStatus.spo2 === 'abnormal' && <AlertCircle className="w-5 h-5 text-rose-500 animate-pulse" />}
          </div>
          <div className="flex items-baseline gap-2">
            <span className={cn(
              "text-4xl font-headline font-extrabold",
              latestStatus.spo2 === 'abnormal' ? "text-rose-700" : "text-on-surface"
            )}>{latestVitals.spo2}</span>
            <span className="text-sm font-bold text-on-surface-variant">%</span>
          </div>
        </div>

        <div className={cn(
          "p-6 rounded-[2rem] clinical-shadow border transition-all duration-300",
          latestStatus.bp === 'abnormal' 
            ? "bg-rose-50 border-rose-200" 
            : "bg-surface-container-lowest border-outline-variant/10"
        )}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                <Activity className="w-5 h-5 text-on-surface-variant" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Blood Pressure</span>
            </div>
            {latestStatus.bp === 'abnormal' && <AlertCircle className="w-5 h-5 text-rose-500 animate-pulse" />}
          </div>
          <div className="flex items-baseline gap-2">
            <span className={cn(
              "text-3xl font-headline font-extrabold",
              latestStatus.bp === 'abnormal' ? "text-rose-700" : "text-on-surface"
            )}>{latestVitals.bp}</span>
            <span className="text-sm font-bold text-on-surface-variant">mmHg</span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] clinical-shadow border border-outline-variant/10 mb-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Live Integrated Telemetry (24h)
          </h3>
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Live Stream</span>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={records}>
              <defs>
                <linearGradient id="colorHrLive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ba1a1a" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#ba1a1a" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTempLive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
              <XAxis 
                dataKey="timestamp" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#666'}} 
              />
              <YAxis 
                yAxisId="left"
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#666'}} 
                label={{ value: 'HR (BPM)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#ba1a1a', fontWeight: 'bold' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#666'}} 
                label={{ value: 'Temp (°C)', angle: 90, position: 'insideRight', fontSize: 10, fill: '#d97706', fontWeight: 'bold' }}
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="hr" 
                name="Heart Rate"
                stroke="#ba1a1a" 
                fillOpacity={1} 
                fill="url(#colorHrLive)" 
                strokeWidth={3} 
                isAnimationActive={false}
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="temp" 
                name="Temperature"
                stroke="#d97706" 
                fillOpacity={1} 
                fill="url(#colorTempLive)" 
                strokeWidth={3} 
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] clinical-shadow border border-outline-variant/10">
          <h3 className="text-xl font-headline font-bold text-on-surface mb-8 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Heart Rate Trend
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={records}>
                <defs>
                  <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ba1a1a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ba1a1a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis dataKey="timestamp" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#666'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#666'}} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="hr" stroke="#ba1a1a" fillOpacity={1} fill="url(#colorHr)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] clinical-shadow border border-outline-variant/10">
          <h3 className="text-xl font-headline font-bold text-on-surface mb-8 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-amber-500" />
            Temperature Trend
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={records}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis dataKey="timestamp" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#666'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#666'}} domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="temp" stroke="#d97706" strokeWidth={3} dot={{ r: 4, fill: '#d97706' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {records.length > 0 && (
        <div className="mt-12 bg-surface-container-lowest rounded-[2.5rem] clinical-shadow border border-outline-variant/10 overflow-hidden">
          <div className="p-8 border-b border-outline-variant/10 bg-surface-container-low flex items-center justify-between">
            <h3 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Historical Vitals Log
            </h3>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              {records.length} Entries Recorded
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Timestamp</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Patient</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Heart Rate</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Temp</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">SpO2</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Blood Pressure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {[...records].reverse().map((record, idx) => {
                  const status = checkVitals(record.vitals);
                  return (
                    <tr key={record.id || idx} className="hover:bg-primary/5 transition-colors">
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold text-on-surface">{record.date || 'N/A'}</p>
                        <p className="text-[10px] text-on-surface-variant font-medium">{record.timestamp}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-medium text-on-surface">{record.patient || 'Unknown'}</p>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <Heart className={cn("w-3 h-3", status.hr === 'abnormal' ? "text-rose-600" : "text-rose-500")} />
                          <span className={cn(
                            "text-sm font-bold",
                            status.hr === 'abnormal' ? "text-rose-700" : "text-on-surface"
                          )}>{record.vitals?.hr || '--'}</span>
                          <span className="text-[10px] text-on-surface-variant">BPM</span>
                          {status.hr === 'abnormal' && <AlertCircle className="w-3 h-3 text-rose-500" />}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <Thermometer className={cn("w-3 h-3", status.temp === 'abnormal' ? "text-amber-600" : "text-amber-500")} />
                          <span className={cn(
                            "text-sm font-bold",
                            status.temp === 'abnormal' ? "text-amber-700" : "text-on-surface"
                          )}>{record.vitals?.temp || '--'}</span>
                          <span className="text-[10px] text-on-surface-variant">°C</span>
                          {status.temp === 'abnormal' && <AlertCircle className="w-3 h-3 text-amber-500" />}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <Wind className={cn("w-3 h-3", status.spo2 === 'abnormal' ? "text-rose-600" : "text-primary")} />
                          <span className={cn(
                            "text-sm font-bold",
                            status.spo2 === 'abnormal' ? "text-rose-700" : "text-on-surface"
                          )}>{record.vitals?.spo2 || '--'}</span>
                          <span className="text-[10px] text-on-surface-variant">%</span>
                          {status.spo2 === 'abnormal' && <AlertCircle className="w-3 h-3 text-rose-500" />}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <Activity className={cn("w-3 h-3", status.bp === 'abnormal' ? "text-rose-600" : "text-on-surface-variant")} />
                          <span className={cn(
                            "text-sm font-bold",
                            status.bp === 'abnormal' ? "text-rose-700" : "text-on-surface"
                          )}>{record.vitals?.bp || '--/--'}</span>
                          <span className="text-[10px] text-on-surface-variant">mmHg</span>
                          {status.bp === 'abnormal' && <AlertCircle className="w-3 h-3 text-rose-500" />}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {records.length === 0 && !loading && (
        <div className="mt-12 p-12 bg-surface-container-low rounded-[2.5rem] text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-on-surface-variant mx-auto opacity-20" />
          <h3 className="text-xl font-headline font-bold text-on-surface">No Vitals Data Available</h3>
          <p className="text-on-surface-variant max-w-md mx-auto">
            Start a new consultation and record patient vitals to see trends and analytics here.
          </p>
          <Link to="/symptoms" className="inline-block px-8 py-3 primary-gradient text-on-primary font-bold rounded-xl clinical-shadow active:scale-95 transition-all">
            New Consultation
          </Link>
        </div>
      )}
    </div>
  );
}
