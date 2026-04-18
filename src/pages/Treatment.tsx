import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Syringe, 
  Pill, 
  Droplets, 
  Activity, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Info,
  MessageSquare
} from 'lucide-react';
import { cn } from '../lib/utils';

const protocols = [
  { 
    id: '1', 
    title: 'Standard Viral Recovery', 
    type: 'Supportive Care', 
    status: 'Active', 
    priority: 'Standard',
    steps: [
      { 
        title: 'Hydration Strategy', 
        desc: 'Maintain a minimum of 2.5L fluids daily. Focus on electrolyte-rich solutions and warm herbal infusions to soothe mucosal membranes.' 
      },
      { 
        title: 'Rest & Recovery', 
        desc: '8-10 hours of uninterrupted sleep. Keep the head elevated at a 30-degree angle to reduce post-nasal drip and improve breathing.' 
      },
      { 
        title: 'Antipyretic Management', 
        desc: 'Administer Acetaminophen 500mg every 6 hours as needed for temperature exceeding 38.5°C. Do not exceed 4g in 24 hours.' 
      },
      { 
        title: 'Vitals Monitoring', 
        desc: 'Record temperature and oxygen saturation every 6 hours. Log any new symptoms or sudden changes in breathing patterns.' 
      }
    ]
  },
  { 
    id: '2', 
    title: 'Acute Bronchitis Protocol', 
    type: 'Respiratory', 
    status: 'Pending Review', 
    priority: 'High',
    steps: [
      { 
        title: 'Warm Mist Therapy', 
        desc: 'Use a humidifier or steam inhalation for 15 minutes, three times daily, to loosen bronchial secretions.' 
      },
      { 
        title: 'Bronchodilator Usage', 
        desc: 'Albuterol inhaler as prescribed (typically 2 puffs every 4-6 hours PRN). Monitor for tachycardia or tremors.' 
      },
      { 
        title: 'Cough Suppression', 
        desc: 'Dextromethorphan at night only if cough prevents sleep. Avoid suppressants during the day to allow productive clearing.' 
      },
      { 
        title: 'Expectorant Regimen', 
        desc: 'Guaifenesin 600mg twice daily with a full glass of water to thin mucus and facilitate expectoration.' 
      }
    ]
  }
];

function ProtocolAccordion({ protocolId, steps }: { protocolId: string, steps: { title: string, desc: string }[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [stepNotes, setStepNotes] = useState<Record<string, string>>({});

  const handleNoteChange = (index: number, value: string) => {
    setStepNotes(prev => ({
      ...prev,
      [`${protocolId}-${index}`]: value
    }));
  };

  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const isExpanded = expandedIndex === i;
        const noteKey = `${protocolId}-${i}`;
        return (
          <div 
            key={i} 
            className={cn(
              "border border-outline-variant/10 rounded-2xl overflow-hidden transition-all duration-300",
              isExpanded ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-white"
            )}
          >
            <button 
              onClick={() => setExpandedIndex(isExpanded ? null : i)}
              className="w-full px-5 py-4 flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors",
                  isExpanded ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant group-hover:bg-primary/10"
                )}>
                  {i + 1}
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "text-sm font-bold transition-colors",
                    isExpanded ? "text-primary" : "text-on-surface-variant group-hover:text-primary"
                  )}>
                    {step.title}
                  </span>
                  {stepNotes[noteKey] && !isExpanded && (
                    <span className="text-[10px] text-primary font-medium flex items-center gap-1 mt-0.5">
                      <MessageSquare className="w-2.5 h-2.5" /> Note added
                    </span>
                  )}
                </div>
              </div>
              <ChevronDown className={cn(
                "w-4 h-4 text-on-surface-variant transition-transform duration-300",
                isExpanded && "rotate-180 text-primary"
              )} />
            </button>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-5 pb-5 pt-0">
                    <div className="pl-9 border-l-2 border-primary/20 ml-3 space-y-4">
                      <p className="text-sm text-on-surface-variant leading-relaxed">
                        {step.desc}
                      </p>
                      
                      <div className="pt-2">
                        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
                          <MessageSquare className="w-3 h-3" />
                          Custom Instructions / Notes
                        </label>
                        <textarea 
                          value={stepNotes[noteKey] || ''}
                          onChange={(e) => handleNoteChange(i, e.target.value)}
                          placeholder="Add specific clinical notes for this step..."
                          className="w-full p-3 bg-white/50 border border-outline-variant/20 rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[80px] resize-none font-sans"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default function Treatment() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-primary font-headline font-bold text-sm tracking-widest uppercase">Clinical Sanctuary</span>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface mt-2 tracking-tight">Treatment Protocols</h1>
        </div>
        <div className="flex gap-3">
          <Link to="/vitals" className="flex items-center gap-2 px-6 py-3 bg-surface-container-high text-primary font-semibold rounded-xl transition-all hover:bg-surface-variant">
            <Activity className="w-4 h-4" />
            Vitals Log
          </Link>
          <button className="flex items-center gap-2 px-6 py-3 primary-gradient text-on-primary font-semibold rounded-xl clinical-shadow active:scale-95 transition-transform">
            Add Custom Protocol
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Protocols */}
        <div className="lg:col-span-8 space-y-6">
          {protocols.map((protocol) => (
            <motion.div 
              key={protocol.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-container-lowest rounded-[2.5rem] p-8 clinical-shadow border border-outline-variant/10"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center shrink-0">
                    <Syringe className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{protocol.type}</span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant" />
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest",
                        protocol.priority === 'High' ? "text-rose-500" : "text-on-surface-variant"
                      )}>
                        {protocol.priority} Priority
                      </span>
                    </div>
                    <h3 className="text-2xl font-headline font-bold text-on-surface">{protocol.title}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide",
                    protocol.status === 'Active' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  )}>
                    {protocol.status}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Pill className="w-4 h-4" />
                    Action Steps
                  </h4>
                  <ProtocolAccordion protocolId={protocol.id} steps={protocol.steps} />
                </div>
                <div className="bg-surface-container-low rounded-3xl p-6 space-y-4">
                  <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Timeline
                  </h4>
                  <div className="relative pl-6 border-l-2 border-primary/20 space-y-6">
                    <div className="relative">
                      <div className="absolute -left-[25px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white" />
                      <p className="text-xs font-bold text-primary uppercase mb-1">Day 1-3</p>
                      <p className="text-sm text-on-surface">Acute phase management and symptom suppression.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[25px] top-0 w-4 h-4 rounded-full bg-surface-variant border-4 border-white" />
                      <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Day 4-7</p>
                      <p className="text-sm text-on-surface-variant">Recovery phase and gradual return to activity.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar Tools */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-surface-container-high p-8 rounded-[2.5rem] clinical-shadow">
            <h3 className="font-headline text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-primary" />
              Medication Tracker
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Acetaminophen', dose: '500mg', time: '2h ago', status: 'Taken' },
                { name: 'Vitamin C', dose: '1000mg', time: 'Next: 4:00 PM', status: 'Upcoming' },
              ].map((med) => (
                <div key={med.name} className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-2xl">
                  <div>
                    <p className="font-bold text-on-surface">{med.name}</p>
                    <p className="text-xs text-on-surface-variant">{med.dose} • {med.time}</p>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase px-2 py-1 rounded-md",
                    med.status === 'Taken' ? "bg-emerald-100 text-emerald-700" : "bg-primary-fixed text-primary"
                  )}>
                    {med.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 bg-white text-primary rounded-xl font-bold text-sm shadow-sm hover:bg-primary/5 transition-all">
              Log Medication
            </button>
          </div>

          <div className="bg-tertiary-fixed/30 p-8 rounded-[2.5rem] border border-tertiary/10">
            <AlertCircle className="w-8 h-8 text-tertiary mb-4" />
            <h4 className="text-lg font-headline font-bold text-on-tertiary-fixed-variant mb-2">Warning Indicators</h4>
            <p className="text-sm text-on-tertiary-fixed-variant leading-relaxed mb-6">
              If symptoms persist beyond 10 days or if temperature exceeds 39.5°C, immediate clinical escalation is required.
            </p>
            <button className="flex items-center gap-2 text-tertiary font-bold text-sm group">
              View Emergency Protocols
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
