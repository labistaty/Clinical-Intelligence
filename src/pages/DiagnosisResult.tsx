import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { ShieldCheck, ClipboardList, Calendar, GitBranch, AlertTriangle, ArrowRight, BookOpen, Save, CheckCircle2, Loader2, Activity, Sparkles, BrainCircuit, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';

export default function DiagnosisResult() {
  const { user } = useAuth();
  const location = useLocation();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showForm, setShowForm] = useState(false);
  const [patientDetails, setPatientDetails] = useState({
    name: '',
    age: '',
    contact: '',
    notes: '',
    vitals: {
      bp: '',
      hr: '',
      spo2: '',
      temp: ''
    }
  });

  const [aiOpinion, setAiOpinion] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const diagnosisData = location.state?.diagnosisData || {
    diagnosis: "Common Cold",
    confidence: 85,
    icd10: "J00",
    reasoning: "Based on current epidemiological data and clinical symptoms, this matches the profile of an upper respiratory viral infection.",
    symptoms: []
  };

  const fetchAiSecondOpinion = async () => {
    setIsAiLoading(true);
    try {
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');
      const ai = new GoogleGenAI({ apiKey: apiKey as string });
      const prompt = `You are a Senior Medical Consultant providing a second opinion. 
      The rule-based expert system has diagnosed the patient with: ${diagnosisData.diagnosis}.
      The patient reported these symptoms: ${diagnosisData.symptoms?.join(', ') || 'Not specified'}.
      The expert system's reasoning was: ${diagnosisData.reasoning}.
      
      Please provide a brief (2-3 sentences) second opinion. 
      1. Confirm if this diagnosis seems reasonable.
      2. Suggest 1-2 differential diagnoses to consider.
      3. Mention one "red flag" symptom the patient should watch out for.
      
      Keep the tone professional, clinical, and concise.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setAiOpinion(response.text || "Unable to generate second opinion at this time.");
    } catch (error) {
      console.error("AI Error:", error);
      setAiOpinion("An error occurred while consulting the AI specialist.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let currentName = patientDetails.name;
    if (!currentName) {
      const promptedName = window.prompt("Please enter the patient's name to save this record:");
      if (promptedName) {
        currentName = promptedName;
        setPatientDetails(prev => ({ ...prev, name: promptedName }));
      } else {
        return; // User canceled the prompt
      }
    }

    if (!currentName || !patientDetails.age || !patientDetails.contact) {
      alert("Please ensure Name, Age, and Contact info are provided.");
      return;
    }

    setSaveStatus('saving');
    try {
      if (!user) throw new Error("User not authenticated");
      
      await addDoc(collection(db, 'records'), {
        patient: patientDetails.name,
        age: patientDetails.age,
        contact: patientDetails.contact,
        notes: patientDetails.notes,
        vitals: patientDetails.vitals,
        diagnosis: diagnosisData.diagnosis,
        confidence: `${diagnosisData.confidence}%`,
        status: 'Monitoring',
        icd10: diagnosisData.icd10,
        reasoning: diagnosisData.reasoning,
        doctorId: user.id,
        createdAt: serverTimestamp()
      });
      
      setSaveStatus('saved');
      setShowForm(false);
    } catch (error) {
      console.error("Error saving record:", error);
      setSaveStatus('idle');
      alert("Failed to save record.");
    }
  };

  const strokeDashoffset = 364.4 - (364.4 * diagnosisData.confidence) / 100;

  const getTriageStatus = () => {
    const spo2 = parseInt(patientDetails.vitals.spo2);
    const age = parseInt(patientDetails.age);
    const hr = parseInt(patientDetails.hr);
    
    if (spo2 > 0 && spo2 < 92) return { level: 'Critical', color: 'text-rose-600', bg: 'bg-rose-50', icon: AlertTriangle, desc: 'Immediate clinical escalation required due to low oxygen saturation.' };
    if (diagnosisData.diagnosis === 'Influenza Type A' && age > 65) return { level: 'High Priority', color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock, desc: 'Elderly patient with influenza requires close monitoring for secondary complications.' };
    if (hr > 110) return { level: 'Urgent', color: 'text-rose-500', bg: 'bg-rose-50', icon: Activity, desc: 'Tachycardia detected. Evaluate for dehydration or systemic stress.' };
    
    return null;
  };

  const triage = getTriageStatus();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-32">
      {/* Triage Alert Banner */}
      {triage && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("mb-8 p-6 rounded-[2rem] border flex items-start gap-4", triage.bg, triage.level === 'Critical' ? "border-rose-200" : "border-amber-200")}
        >
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", triage.level === 'Critical' ? "bg-rose-100" : "bg-amber-100")}>
            <triage.icon className={cn("w-6 h-6", triage.color)} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("text-xs font-bold uppercase tracking-widest", triage.color)}>{triage.level} Triage Alert</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant" />
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Protocol 104-B</span>
            </div>
            <p className="text-on-surface font-medium">{triage.desc}</p>
          </div>
        </motion.div>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-sm font-semibold tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4" />
              Analysis Complete
            </span>
            <h2 className="text-5xl lg:text-7xl font-headline font-extrabold text-on-surface tracking-tight leading-tight">
              Likely Diagnosis:<br />
              <span className="text-primary">{diagnosisData.diagnosis}</span>
            </h2>
          </div>

          {/* Confidence Score Card */}
          <div className="bg-surface-container-lowest clinical-shadow p-8 rounded-[3rem] flex flex-col md:flex-row md:items-center gap-8">
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle className="text-surface-variant" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8" />
                <motion.circle 
                  initial={{ strokeDashoffset: 364.4 }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="text-primary" 
                  cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364.4" strokeWidth="8" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-headline font-bold text-primary">{diagnosisData.confidence}%</span>
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Confidence</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-headline font-bold text-on-surface">Statistical Match</h3>
              <p className="text-on-surface-variant leading-relaxed">
                {diagnosisData.reasoning}
              </p>
              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container-high text-on-surface-variant text-xs font-semibold">
                  <ClipboardList className="w-3.5 h-3.5" />
                  ICD-10 {diagnosisData.icd10}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container-high text-on-surface-variant text-xs font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  Low Seasonality
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 h-full">
          <div className="relative rounded-[3rem] overflow-hidden h-full min-h-[400px] clinical-shadow">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA143c3hAR0gSY-XZdNB7wA_wiRANcEkRJ22Ltgh3TT10OLCgJSFOcn-jCvMN9vq1PPso4dgTgL_Z1_-6EWEACoDwyjH86T_VsgcZ036AqrbFLw-Wp0WCnCviADChKeinaPletAlG3qpGLHfeclwPl5gTWJB4923gU3LGFIb7gkDNs1NMKS0huCFD8a8G_kIoRk6KfHTpYWYdIiUl3_uWhdH1bjY0qm2-PqjNQwfbFPhUpwUhS3Wvn36AfIgiEMuqkbjHWFAV9_NkPs" 
              alt="Lab setting" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white font-headline text-lg font-bold">Intelligent Clinical Screening</p>
              <p className="text-white/80 text-sm">Powered by the Clinical Sanctuary Framework</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reasoning Section */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-3xl font-headline font-bold text-on-surface">Diagnostic Reasoning</h3>
            <p className="text-on-surface-variant max-w-xl">Our expert engine identifies patterns by correlating your reported symptoms against validated clinical rules.</p>
          </div>
          <div className="flex gap-3">
            {saveStatus !== 'saved' && (
              <button 
                onClick={() => setShowForm(!showForm)}
                className={cn(
                  "px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 clinical-shadow",
                  showForm ? "bg-surface-container-highest text-on-surface" : "primary-gradient text-on-primary active:scale-95"
                )}
              >
                <Save className="w-4 h-4" /> 
                {showForm ? "Cancel" : "Save to Record"}
              </button>
            )}
            {saveStatus === 'saved' && (
              <div className="px-6 py-3 rounded-full bg-emerald-100 text-emerald-700 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Saved to Record
              </div>
            )}
            <button className="px-6 py-3 rounded-full bg-surface-container-high text-primary font-semibold transition-all hover:bg-surface-variant">
              Export Report
            </button>
          </div>
        </div>

        {/* Patient Details Form */}
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-lowest clinical-shadow p-8 rounded-[3rem] border border-primary/10"
          >
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Patient Name</label>
                <input 
                  required
                  type="text" 
                  value={patientDetails.name}
                  onChange={(e) => setPatientDetails({...patientDetails, name: e.target.value})}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Age</label>
                <input 
                  required
                  type="number" 
                  value={patientDetails.age}
                  onChange={(e) => setPatientDetails({...patientDetails, age: e.target.value})}
                  placeholder="Years"
                  className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Contact Info</label>
                <input 
                  required
                  type="text" 
                  value={patientDetails.contact}
                  onChange={(e) => setPatientDetails({...patientDetails, contact: e.target.value})}
                  placeholder="Phone or Email"
                  className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="md:col-span-3 space-y-4">
                <div className="flex items-center gap-2 border-b border-outline-variant/10 pb-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-bold text-on-surface uppercase tracking-widest">Vital Signs</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Blood Pressure</label>
                    <input 
                      type="text" 
                      value={patientDetails.vitals.bp}
                      onChange={(e) => setPatientDetails({...patientDetails, vitals: {...patientDetails.vitals, bp: e.target.value}})}
                      placeholder="120/80"
                      className="w-full px-4 py-2 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Heart Rate (BPM)</label>
                    <input 
                      type="number" 
                      value={patientDetails.vitals.hr}
                      onChange={(e) => setPatientDetails({...patientDetails, vitals: {...patientDetails.vitals, hr: e.target.value}})}
                      placeholder="72"
                      className="w-full px-4 py-2 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">SpO2 (%)</label>
                    <input 
                      type="number" 
                      value={patientDetails.vitals.spo2}
                      onChange={(e) => setPatientDetails({...patientDetails, vitals: {...patientDetails.vitals, spo2: e.target.value}})}
                      placeholder="98"
                      className="w-full px-4 py-2 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Temp (°C)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={patientDetails.vitals.temp}
                      onChange={(e) => setPatientDetails({...patientDetails, vitals: {...patientDetails.vitals, temp: e.target.value}})}
                      placeholder="36.6"
                      className="w-full px-4 py-2 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Clinical Notes</label>
                <textarea 
                  value={patientDetails.notes}
                  onChange={(e) => setPatientDetails({...patientDetails, notes: e.target.value})}
                  placeholder="Enter additional observations, patient history, or specific concerns..."
                  rows={4}
                  className="w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button 
                  type="submit"
                  disabled={saveStatus === 'saving'}
                  className="px-8 py-3 primary-gradient text-on-primary font-bold rounded-xl clinical-shadow active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {saveStatus === 'saving' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Finalizing...</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" /> Confirm & Save</>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-surface-container-lowest clinical-shadow p-8 rounded-[3rem]">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-2xl primary-gradient flex items-center justify-center shrink-0">
                <GitBranch className="w-6 h-6 text-on-primary" />
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-headline font-bold text-on-surface">Rule Cluster: Primary Infection Symptoms</h4>
                <div className="flex flex-wrap gap-2">
                  {['Fever', 'Cough', 'Sore Throat'].map(t => (
                    <span key={t} className="px-4 py-2 rounded-lg bg-primary-fixed text-on-primary-fixed font-semibold text-sm">Triggered: {t}</span>
                  ))}
                </div>
                <p className="text-on-surface-variant leading-relaxed">
                  The combination of these three indicators strongly suggests a viral response in the upper respiratory tract. The absence of severe respiratory distress excludes more critical pathways.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-tertiary-fixed/30 p-8 rounded-[3rem] flex flex-col justify-between">
            <div className="space-y-4">
              <AlertTriangle className="w-8 h-8 text-tertiary" />
              <h4 className="text-xl font-headline font-bold text-on-tertiary-fixed-variant">Notice: Duration</h4>
              <p className="text-on-tertiary-fixed-variant text-sm leading-relaxed">
                Symptoms appearing within last 48 hours is consistent with the incubation period of common rhinoviruses.
              </p>
            </div>
            <div className="pt-6">
              <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
                <div className="h-full bg-tertiary w-3/4" />
              </div>
            </div>
          </div>

          <div className="bg-surface-container-high p-8 rounded-[3rem] flex flex-col justify-center items-center gap-6">
            {!aiOpinion && !isAiLoading ? (
              <button 
                onClick={fetchAiSecondOpinion}
                className="w-full py-4 px-8 bg-white text-primary rounded-full font-bold text-lg clinical-shadow active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                AI Second Opinion
              </button>
            ) : isAiLoading ? (
              <div className="w-full py-4 px-8 bg-white/50 text-primary rounded-full font-bold text-lg flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Consulting AI...
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full p-6 bg-white rounded-[2rem] clinical-shadow border border-primary/20"
              >
                <div className="flex items-center gap-2 mb-3">
                  <BrainCircuit className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">AI Consultant Opinion</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed italic">
                  "{aiOpinion}"
                </p>
              </motion.div>
            )}
            <button className="w-full py-4 px-8 primary-gradient rounded-full text-on-primary font-bold text-lg clinical-shadow active:scale-95 transition-all">
              See Prevention Tips
            </button>
            <Link to="/symptoms" className="w-full py-4 px-8 bg-surface-container-lowest text-primary text-center font-bold text-lg rounded-full clinical-shadow active:scale-95 transition-all">
              Start Over
            </Link>
          </div>

          <Link to="/library" className="md:col-span-2 bg-surface-container-low p-8 rounded-[3rem] flex items-center justify-between group">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shrink-0">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-headline font-bold text-on-surface">Medical Encyclopedia</h4>
                <p className="text-on-surface-variant">Read more about Upper Respiratory Infections and recovery protocols.</p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-primary group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
