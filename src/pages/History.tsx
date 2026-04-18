import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  User, 
  ChevronRight, 
  MoreVertical,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  FileText,
  ShieldCheck,
  MessageSquare,
  Phone,
  Hash,
  Thermometer,
  Heart,
  Activity as VitalsIcon,
  Wind
} from 'lucide-react';
import { cn } from '../lib/utils';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';

export default function History() {
  const { user } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'records'),
      where('doctorId', '==', user.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const formattedData = data.map((r: any) => {
        const createdAtDate = r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt);
        return {
          ...r,
          date: createdAtDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: createdAtDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
      });

      setRecords(formattedData);
      setFilteredRecords(formattedData);
      setLoading(false);
    }, (err) => {
      console.error("Failed to fetch records:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    let result = records;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.patient.toLowerCase().includes(query) || 
        r.diagnosis.toLowerCase().includes(query) ||
        r.id.toLowerCase().includes(query)
      );
    }

    if (statusFilter) {
      result = result.filter(r => r.status === statusFilter);
    }

    setFilteredRecords(result);
  }, [searchQuery, statusFilter, records]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-primary font-headline font-bold text-sm tracking-widest uppercase">Clinical Records</span>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface mt-2 tracking-tight">Patient History</h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-surface-container-high text-primary font-semibold rounded-xl transition-all hover:bg-surface-variant">
            <Download className="w-4 h-4" />
            Export All
          </button>
          <button className="flex items-center gap-2 px-6 py-3 primary-gradient text-on-primary font-semibold rounded-xl clinical-shadow active:scale-95 transition-transform">
            New Consultation
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-surface-container-low p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient name, diagnosis, or ID..." 
            className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || null)}
            className="px-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-on-surface-variant font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Statuses</option>
            <option value="Resolved">Resolved</option>
            <option value="Monitoring">Monitoring</option>
            <option value="Critical">Critical</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-on-surface-variant font-medium">
            <Calendar className="w-4 h-4" /> Date Range
          </button>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-surface-container-lowest rounded-3xl clinical-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/10">
                <th className="px-8 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Patient</th>
                <th className="px-8 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Diagnosis</th>
                <th className="px-8 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Confidence</th>
                <th className="px-8 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredRecords.map((record) => (
                <tr 
                  key={record.id} 
                  onClick={() => setSelectedRecord(record)}
                  className={cn(
                    "group transition-colors cursor-pointer",
                    selectedRecord?.id === record.id ? "bg-primary/10" : "hover:bg-primary/5"
                  )}
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold">
                        {record.patient.charAt(0)}
                      </div>
                      <div>
                        <p className="font-headline font-bold text-on-surface">{record.patient}</p>
                        <p className="text-xs text-on-surface-variant">{record.date} • {record.time}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-sans font-medium text-on-surface">{record.diagnosis}</p>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">ICD-10: J00.1</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                      record.status === 'Resolved' && "bg-emerald-100 text-emerald-700",
                      record.status === 'Monitoring' && "bg-amber-100 text-amber-700",
                      record.status === 'Critical' && "bg-rose-100 text-rose-700"
                    )}>
                      {record.status === 'Resolved' && <CheckCircle2 className="w-3 h-3" />}
                      {record.status === 'Monitoring' && <Clock className="w-3 h-3" />}
                      {record.status === 'Critical' && <AlertCircle className="w-3 h-3" />}
                      {record.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 w-24 bg-surface-variant rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: record.confidence }} />
                      </div>
                      <span className="text-sm font-bold text-primary">{record.confidence}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-surface-container-high rounded-lg transition-all">
                        <MoreVertical className="w-5 h-5 text-on-surface-variant" />
                      </button>
                      <ChevronRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-8 py-6 bg-surface-container-low flex items-center justify-between">
          <p className="text-sm text-on-surface-variant">Showing {records.length} records</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-sm font-medium disabled:opacity-50" disabled>Previous</button>
            <button className="px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-sm font-medium">Next</button>
          </div>
        </div>
      </div>

      {/* Record Summary Modal/Overlay */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRecord(null)}
            className="absolute inset-0 bg-on-surface/20 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-2xl bg-surface-container-lowest rounded-[2.5rem] clinical-shadow overflow-hidden border border-outline-variant/10"
          >
            <div className="p-8 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-headline font-bold text-on-surface">Record Summary</h3>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">ID: {selectedRecord.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedRecord(null)}
                className="p-2 hover:bg-surface-container-high rounded-full transition-all"
              >
                <X className="w-6 h-6 text-on-surface-variant" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    <h4 className="font-headline font-bold text-on-surface">Patient Details</h4>
                  </div>
                  <div className="space-y-3 p-6 bg-surface-container-low rounded-3xl">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Name</span>
                      <span className="text-sm font-bold text-on-surface">{selectedRecord.patient}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Age</span>
                      <span className="text-sm font-bold text-on-surface">{selectedRecord.age || 'N/A'} yrs</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Contact</span>
                      <span className="text-sm font-bold text-on-surface">{selectedRecord.contact || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h4 className="font-headline font-bold text-on-surface">Consultation</h4>
                  </div>
                  <div className="space-y-3 p-6 bg-surface-container-low rounded-3xl">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Date</span>
                      <span className="text-sm font-bold text-on-surface">{selectedRecord.date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Time</span>
                      <span className="text-sm font-bold text-on-surface">{selectedRecord.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Status</span>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full",
                        selectedRecord.status === 'Resolved' && "bg-emerald-100 text-emerald-700",
                        selectedRecord.status === 'Monitoring' && "bg-amber-100 text-amber-700",
                        selectedRecord.status === 'Critical' && "bg-rose-100 text-rose-700"
                      )}>
                        {selectedRecord.status || 'Monitoring'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Priority</span>
                      <span className="text-sm font-bold text-on-surface capitalize">{selectedRecord.priority || 'Standard'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-primary-fixed/30 rounded-3xl border border-primary/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <h4 className="font-headline font-bold text-on-surface">Diagnosis</h4>
                  </div>
                  <span className="text-sm font-bold text-primary">{selectedRecord.confidence} Confidence</span>
                </div>
                <div>
                  <p className="text-2xl font-headline font-extrabold text-primary">{selectedRecord.diagnosis}</p>
                  <p className="text-xs text-on-surface-variant font-bold mt-1 uppercase tracking-wider">ICD-10: {selectedRecord.icd10 || 'J00.1'}</p>
                </div>
              </div>

              {selectedRecord.vitals && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <VitalsIcon className="w-5 h-5 text-primary" />
                    <h4 className="font-headline font-bold text-on-surface">Recorded Vitals</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">BP</p>
                      <p className="text-sm font-bold text-on-surface">{selectedRecord.vitals.bp || '--/--'}</p>
                    </div>
                    <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Heart className="w-3 h-3 text-rose-500" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">HR</p>
                      </div>
                      <p className="text-sm font-bold text-on-surface">{selectedRecord.vitals.hr || '--'} <span className="text-[10px]">BPM</span></p>
                    </div>
                    <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Wind className="w-3 h-3 text-primary" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">SpO2</p>
                      </div>
                      <p className="text-sm font-bold text-on-surface">{selectedRecord.vitals.spo2 || '--'}<span className="text-[10px]">%</span></p>
                    </div>
                    <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Thermometer className="w-3 h-3 text-amber-500" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Temp</p>
                      </div>
                      <p className="text-sm font-bold text-on-surface">{selectedRecord.vitals.temp || '--'}<span className="text-[10px]">°C</span></p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <h4 className="font-headline font-bold text-on-surface">Clinical Notes</h4>
                </div>
                <div className="p-6 bg-surface-container-low rounded-3xl min-h-[120px]">
                  <p className="text-on-surface-variant leading-relaxed italic">
                    {selectedRecord.notes || "No clinical notes provided for this consultation."}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handlePrint}
                  className="flex-1 py-4 bg-surface-container-high text-primary font-bold rounded-2xl hover:bg-surface-variant transition-all"
                >
                  Print Report
                </button>
                <button className="flex-1 py-4 primary-gradient text-on-primary font-bold rounded-2xl clinical-shadow active:scale-95 transition-all">
                  Open Full Record
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
