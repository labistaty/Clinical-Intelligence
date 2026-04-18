import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  Thermometer, 
  Wind, 
  HeartPulse, 
  Waves, 
  Accessibility, 
  Bed, 
  ArrowRight,
  BrainCircuit,
  AlertTriangle,
  Activity,
  Check,
  Search,
  Sparkles,
  Loader2,
  X,
  Plus,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { getSymptomSuggestions, searchSymptomsAI } from '../lib/gemini';
import { useDebounce } from '../hooks/useDebounce';
import { SYMPTOMS } from '../lib/clinical-engine';

const iconMap: Record<string, any> = {
  Thermometer,
  Wind,
  HeartPulse,
  Waves,
  Accessibility,
  Bed
};

function SymptomModal({ symptom, existingDetails, onConfirm, onRemove, onClose }: any) {
  const [step, setStep] = useState(existingDetails ? 'inputs' : 'info');
  const [details, setDetails] = useState(existingDetails || { severity: 5, duration: 1 });
  const Icon = iconMap[symptom.icon] || ClipboardList;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-surface-container-lowest rounded-[2.5rem] clinical-shadow overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-outline-variant/10 flex items-start justify-between bg-surface-container-low">
          <div className="flex gap-4 items-center">
            <div className={cn("p-4 rounded-2xl bg-white clinical-shadow", symptom.color)}>
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-[8px] font-bold text-primary uppercase tracking-widest">
                  {step === 'info' ? 'Clinical Overview' : 'Biometric Input'}
                </span>
                <h2 className="text-2xl font-headline font-extrabold text-on-surface">{symptom.label}</h2>
              </div>
              <p className="text-on-surface-variant text-sm font-medium">{symptom.desc}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-variant rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-on-surface-variant" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {step === 'info' ? (
              <motion.div 
                key="info"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                {/* Clinical Details */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-primary" />
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Pre-Diagnostic Context</h4>
                  </div>
                  <p className="text-on-surface-variant leading-relaxed text-sm">
                    {symptom.longDesc}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h5 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Probable Etiologies
                      </h5>
                      <ul className="space-y-2">
                        {symptom.causes?.map((c: string) => (
                          <li key={c} className="text-xs text-on-surface flex items-start gap-2">
                            <Check className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h5 className="text-[10px] font-bold uppercase tracking-widest text-tertiary flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                        Clinical Risk Factors
                      </h5>
                      <ul className="space-y-2">
                        {symptom.complications?.map((c: string) => (
                          <li key={c} className="text-xs text-on-surface flex items-start gap-2">
                            <AlertTriangle className="w-3 h-3 text-tertiary mt-0.5 shrink-0" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
                
                <div className="p-4 bg-primary-fixed/20 border border-primary/10 rounded-2xl flex gap-3 items-center">
                  <Info className="w-5 h-5 text-primary shrink-0" />
                  <p className="text-[10px] text-on-surface-variant leading-tight">
                    Review clinical details above. Proceed to the next step to input specific severity and duration for this patient encounter.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="inputs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Input Section */}
                <section className="bg-primary-fixed/30 rounded-3xl p-8 space-y-8">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Diagnostic Parameters</h4>
                  </div>
                  
                  <div className="space-y-8">
                    {/* Severity */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-primary">Symptom Severity</label>
                          <p className="text-[10px] text-on-surface-variant italic">Scale of patient perceived distress</p>
                        </div>
                        <span className="text-lg font-headline font-extrabold text-primary">{details.severity}/10</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={details.severity}
                        onChange={(e) => setDetails((prev: any) => ({ ...prev, severity: parseInt(e.target.value) }))}
                        className="w-full h-3 bg-white rounded-full appearance-none cursor-pointer accent-primary clinical-shadow"
                      />
                      <div className="flex justify-between text-[10px] font-bold text-on-surface-variant px-1 uppercase tracking-tighter">
                        <span>Negligible</span>
                        <span>Moderate</span>
                        <span>Incapacitating</span>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-primary">Clinical Duration</label>
                          <p className="text-[10px] text-on-surface-variant italic">Time since initial manifestation</p>
                        </div>
                        <span className="text-lg font-headline font-extrabold text-primary">{details.duration} {details.duration === 1 ? 'Day' : 'Days'}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setDetails((prev: any) => ({ ...prev, duration: Math.max(1, prev.duration - 1) }))}
                          className="w-14 h-14 rounded-2xl bg-white clinical-shadow flex items-center justify-center text-primary hover:bg-primary/5 active:scale-95 transition-all"
                        >
                          <Plus className="w-6 h-6 rotate-45" />
                        </button>
                        <div className="flex-1 bg-white h-14 rounded-2xl clinical-shadow flex items-center justify-center">
                          <span className="font-headline font-extrabold text-2xl text-primary">{details.duration}</span>
                          <span className="ml-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Days</span>
                        </div>
                        <button 
                          onClick={() => setDetails((prev: any) => ({ ...prev, duration: prev.duration + 1 }))}
                          className="w-14 h-14 rounded-2xl bg-white clinical-shadow flex items-center justify-center text-primary hover:bg-primary/5 active:scale-95 transition-all"
                        >
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
                
                <button 
                  onClick={() => setStep('info')}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1 mx-auto"
                >
                  <ArrowRight className="w-3 h-3 rotate-180" />
                  Review Clinical Context
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-outline-variant/10 bg-surface-container-low flex gap-4">
          {existingDetails && step === 'inputs' && (
            <button 
              onClick={onRemove}
              className="px-6 py-4 rounded-2xl font-bold text-tertiary hover:bg-tertiary/5 transition-all flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Remove
            </button>
          )}
          
          {step === 'info' ? (
            <button 
              onClick={() => setStep('inputs')}
              className="flex-1 py-4 primary-gradient text-on-primary font-headline font-extrabold text-lg rounded-2xl clinical-shadow active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              Continue to Parameters
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={() => onConfirm(details)}
              className="flex-1 py-4 primary-gradient text-on-primary font-headline font-extrabold text-lg rounded-2xl clinical-shadow active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <Check className="w-6 h-6 stroke-[3]" />
              {existingDetails ? 'Update Log' : 'Add to Diagnostic Log'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function SymptomSelection() {
  const [symptoms] = useState<any[]>(SYMPTOMS);
  const [selectedDetails, setSelectedDetails] = useState<Record<string, { severity: number; duration: number }>>({});
  const [filterRegion, setFilterRegion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [focusedSymptomId, setFocusedSymptomId] = useState<string | null>(null);
  const navigate = useNavigate();

  const selectedIds = Object.keys(selectedDetails);
  const debouncedSelectedIds = useDebounce(selectedIds, 1000);
  const debouncedSearchQuery = useDebounce(searchQuery, 800);

  const regions: Record<string, string[]> = {
    head: ['fever', 'sneezing', 'throat'],
    chest: ['cough'],
    body: ['body_ache', 'fatigue']
  };

  const filteredSymptoms = symptoms.filter(s => {
    const matchesRegion = filterRegion ? regions[filterRegion].includes(s.id) : true;
    const matchesSearch = s.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  useEffect(() => {
    const fetchSuggestions = async () => {
      // If there's a search query, prioritize search suggestions
      if (debouncedSearchQuery.length > 2) {
        setIsSuggesting(true);
        try {
          const suggestions = await searchSymptomsAI(debouncedSearchQuery, symptoms);
          setAiSuggestions(suggestions.filter(id => !selectedDetails[id]));
        } catch (err) {
          console.error("AI Search failed:", err);
        } finally {
          setIsSuggesting(false);
        }
        return;
      }

      // Otherwise, suggest based on selected symptoms
      if (debouncedSelectedIds.length === 0) {
        setAiSuggestions([]);
        return;
      }

      setIsSuggesting(true);
      try {
        const selectedLabels = debouncedSelectedIds.map(id => 
          symptoms.find(s => s.id === id)?.label || id
        );
        const suggestions = await getSymptomSuggestions(selectedLabels, symptoms);
        setAiSuggestions(suggestions.filter(id => !selectedDetails[id]));
      } catch (err) {
        console.error("AI Suggestion failed:", err);
      } finally {
        setIsSuggesting(false);
      }
    };

    if (symptoms.length > 0) {
      fetchSuggestions();
    }
  }, [debouncedSelectedIds, debouncedSearchQuery, symptoms]);

  useEffect(() => {
    // Static loading - no fetch needed
  }, []);

  const toggleSymptom = (id: string) => {
    setFocusedSymptomId(id);
  };

  const confirmSymptom = (id: string, details: { severity: number; duration: number }) => {
    setSelectedDetails(prev => ({
      ...prev,
      [id]: details
    }));
    setFocusedSymptomId(null);
  };

  const removeSymptom = (id: string) => {
    setSelectedDetails(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setFocusedSymptomId(null);
  };

  const updateDetail = (id: string, field: 'severity' | 'duration', value: number) => {
    setSelectedDetails(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 pb-32">
      {/* Progress Indicator */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-primary font-headline font-bold text-sm tracking-widest uppercase">Step 1 of 3</span>
            <h1 className="text-3xl md:text-5xl font-headline font-extrabold text-on-surface mt-2 tracking-tight">Symptom Selection</h1>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-on-surface-variant font-sans text-sm">Clinical Accuracy: 98.4%</p>
          </div>
        </div>
        <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
          <div className="h-full w-1/3 primary-gradient" />
        </div>
      </section>

      {/* Main Interaction Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="p-8 bg-surface-container-low rounded-3xl clinical-shadow">
            <ClipboardList className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Identify Your Symptoms</h3>
            <p className="text-on-surface-variant leading-relaxed text-sm">
              Select all symptoms you've experienced in the last 24-48 hours. Our Clinical Intelligence Framework will analyze these inputs against verified diagnostic databases.
            </p>
          </div>

          {/* Interactive Body Map */}
          <div className="p-8 bg-surface-container-lowest rounded-3xl clinical-shadow border border-outline-variant/10">
            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6 flex items-center gap-2">
              <Accessibility className="w-4 h-4 text-primary" />
              Interactive Body Map
            </h4>
            <div className="flex justify-center relative">
              <svg viewBox="0 0 200 400" className="w-32 h-64 drop-shadow-sm">
                {/* Head */}
                <path 
                  d="M100,20 c15,0 25,10 25,25 s-10,25 -25,25 s-25,-10 -25,-25 s10,-25 25,-25" 
                  className={cn("cursor-pointer transition-colors", filterRegion === 'head' ? "fill-primary" : "fill-surface-variant hover:fill-primary/30")}
                  onClick={() => setFilterRegion(filterRegion === 'head' ? null : 'head')}
                />
                {/* Torso/Chest */}
                <path 
                  d="M75,75 h50 l10,100 h-70 z" 
                  className={cn("cursor-pointer transition-colors", filterRegion === 'chest' ? "fill-primary" : "fill-surface-variant hover:fill-primary/30")}
                  onClick={() => setFilterRegion(filterRegion === 'chest' ? null : 'chest')}
                />
                {/* Body/Limbs */}
                <path 
                  d="M75,175 h50 l15,150 h-15 l-10,-100 l-10,100 h-15 l15,-150" 
                  className={cn("cursor-pointer transition-colors", filterRegion === 'body' ? "fill-primary" : "fill-surface-variant hover:fill-primary/30")}
                  onClick={() => setFilterRegion(filterRegion === 'body' ? null : 'body')}
                />
                {/* Arms */}
                <path d="M75,85 l-40,100 h15 l25,-100" className="fill-surface-variant/50" />
                <path d="M125,85 l40,100 h-15 l-25,-100" className="fill-surface-variant/50" />
              </svg>
              
              {/* Region Labels */}
              <div className="absolute right-0 top-0 space-y-2">
                {['head', 'chest', 'body'].map(r => (
                  <button 
                    key={r}
                    onClick={() => setFilterRegion(filterRegion === r ? null : r)}
                    className={cn(
                      "block w-full px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter transition-all",
                      filterRegion === r ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant hover:bg-primary/10"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-center text-on-surface-variant mt-4 italic">Click a region to filter symptoms</p>
          </div>
          <div className="relative h-64 w-full rounded-3xl overflow-hidden clinical-shadow">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuANsikHQtAZbOzbtDrSyh3ShHLHJKnO8RfhqoT5b8OfSasuKxss5Y0WKTXRb1UD7yJoabwZxdWsM5jIfsERrU96KAnis2scXeS4nc_pjoYSTE1wOon-RvuFXPb3uePebt3xRTrdtZE8dbvkgY97FNh7FARGfguYHfDv6X71dipsq02SzZdVBTSrDQTtSix1QTCe-HLkBIGvIzbTq5YZtHJ56i7gDME-wg1r-I58MVXGwwp0k45tiJT3B6MNkDoqccQdMzV-Rf9xe9O2" 
              alt="Clinical setting" 
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
          </div>
        </aside>

        {/* Right Side: Selection Tiles */}
        <section className="lg:col-span-8 space-y-8">
          {/* Search and AI Suggestions */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input 
                type="text"
                placeholder="Search symptoms (e.g., 'headache', 'nausea')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 clinical-shadow focus:border-primary/30 outline-none transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-surface-variant rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-on-surface-variant" />
                </button>
              )}
            </div>

            <AnimatePresence>
              {(aiSuggestions.length > 0 || isSuggesting) && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 bg-primary-fixed-dim/10 rounded-3xl border border-primary/10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <h4 className="text-xs font-bold uppercase tracking-widest text-primary">AI Suggested Symptoms</h4>
                    </div>
                    {isSuggesting && <Loader2 className="w-3 h-3 text-primary animate-spin" />}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestions.map(id => {
                      const symptom = symptoms.find(s => s.id === id);
                      if (!symptom) return null;
                      return (
                        <button
                          key={id}
                          onClick={() => toggleSymptom(id)}
                          className="px-4 py-2 bg-white rounded-full text-xs font-bold text-on-surface clinical-shadow border border-primary/5 hover:border-primary/30 transition-all flex items-center gap-2"
                        >
                          <Plus className="w-3 h-3 text-primary" />
                          {symptom.label}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredSymptoms.map((symptom) => {
              const details = selectedDetails[symptom.id];
              const isSelected = !!details;
              const Icon = iconMap[symptom.icon] || ClipboardList;
              return (
                <div
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={cn(
                    "relative flex flex-col p-6 rounded-[2rem] transition-all duration-500 border border-transparent cursor-pointer group overflow-hidden",
                    isSelected 
                      ? "bg-primary-fixed border-primary/20 shadow-2xl scale-[1.02]" 
                      : "bg-surface-container-lowest clinical-shadow hover:border-primary/10 hover:shadow-xl active:scale-95"
                  )}
                >
                  {/* Decorative Background Accent */}
                  <div className={cn(
                    "absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-700",
                    symptom.color.replace('text-', 'bg-')
                  )} />

                  <div className="flex items-center justify-between mb-6 relative">
                    <div className={cn(
                      "p-3 rounded-2xl bg-white shadow-sm transition-transform duration-300 group-hover:scale-110",
                      symptom.color
                    )}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                      isSelected ? "bg-primary border-primary scale-110" : "border-outline-variant group-hover:border-primary/30"
                    )}>
                      {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <h4 className="font-headline font-extrabold text-lg text-on-surface leading-tight tracking-tight">{symptom.label}</h4>
                    <p className="text-on-surface-variant text-xs mt-1.5 font-medium line-clamp-2">{symptom.desc}</p>
                    
                    {/* Clinical Insight Preview - Recipe 1: Technical Utility */}
                    <div className="mt-4 pt-4 border-t border-outline-variant/10 space-y-2.5">
                      <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-primary">Clinical Intelligence</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {symptom.causes?.slice(0, 2).map(c => (
                          <span key={c} className="font-mono px-2 py-0.5 bg-surface-container rounded text-[8px] font-medium text-on-surface-variant uppercase border border-outline-variant/5">
                            {c.split(' ')[0]}
                          </span>
                        ))}
                        {symptom.complications && symptom.complications.length > 0 && (
                          <span className="font-mono px-2 py-0.5 bg-tertiary-fixed-dim/10 rounded text-[8px] font-bold text-tertiary uppercase border border-tertiary/5">
                            +{symptom.complications.length} Risk
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-white/60 rounded-2xl border border-primary/10 shadow-sm space-y-2"
                      >
                        <div className="flex justify-between items-center px-1">
                          <span className="text-[9px] font-bold text-primary uppercase">Severity</span>
                          <span className="text-xs font-black text-primary">{details.severity}/10</span>
                        </div>
                        <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-500" 
                            style={{ width: `${details.severity * 10}%` }} 
                          />
                        </div>
                        <div className="flex justify-between items-center px-1 pt-1">
                          <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-tighter">Duration:</span>
                          <span className="text-[10px] font-black text-on-surface">{details.duration}d</span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Enhanced Hover Action */}
                  <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Symptom Details Modal */}
      <AnimatePresence>
        {focusedSymptomId && (
          <SymptomModal 
            symptom={symptoms.find(s => s.id === focusedSymptomId)}
            existingDetails={selectedDetails[focusedSymptomId]}
            onConfirm={(details) => confirmSymptom(focusedSymptomId, details)}
            onRemove={() => removeSymptom(focusedSymptomId)}
            onClose={() => setFocusedSymptomId(null)}
          />
        )}
      </AnimatePresence>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 md:left-64 right-0 glass-panel border-t border-outline-variant/20 py-6 px-6 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <button 
            onClick={() => setSelectedDetails({})}
            className="px-8 py-4 text-primary font-bold hover:bg-surface-container-high rounded-full transition-all hidden sm:block"
          >
            Clear All
          </button>
          <button 
            onClick={() => navigate('/processing', { state: { selectedSymptoms: selectedDetails } })}
            disabled={selectedIds.length === 0}
            className="flex-1 sm:flex-none sm:min-w-[320px] py-4 primary-gradient text-on-primary font-headline font-extrabold text-lg rounded-full clinical-shadow active:scale-95 transition-transform flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
          >
            Analyze Symptoms
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
