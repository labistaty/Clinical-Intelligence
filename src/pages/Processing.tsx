import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BrainCircuit, CheckCircle2, RefreshCw, Database, Info, ShieldCheck } from 'lucide-react';
import { formatDiagnosis } from '../lib/clinical-engine';

export default function Processing() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedSymptoms = location.state?.selectedSymptoms || [];

  useEffect(() => {
    const performDiagnosis = async () => {
      // Use client-side clinical engine instead of API
      const data = formatDiagnosis(selectedSymptoms);
      
      // Wait at least 3 seconds for the animation feel
      setTimeout(() => {
        navigate('/result', { state: { diagnosisData: data } });
      }, 3000);
    };

    performDiagnosis();
  }, [navigate, selectedSymptoms]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 pb-32">
      {/* Hero Processing Section */}
      <section className="relative mb-12 flex flex-col items-center text-center">
        <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
          {/* Outer Pulse Rings */}
          <motion.div 
            animate={{ scale: [1.1, 1.25, 1.1], opacity: [0.2, 0.1, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-4 border-primary/10" 
          />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.2, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute inset-0 rounded-full border-4 border-primary/20" 
          />
          {/* Main Processing Orb */}
          <div className="relative w-32 h-32 rounded-full primary-gradient shadow-[0_0_40px_rgba(0,71,141,0.2)] flex items-center justify-center">
            <BrainCircuit className="w-12 h-12 text-white" />
          </div>
        </div>
        <h2 className="font-headline text-4xl font-extrabold tracking-tight text-primary mb-4">Processing Diagnostic Inference</h2>
        <p className="text-on-surface-variant max-w-md mx-auto">
          Applying clinical knowledge base protocols to current patient data using forward-chaining logic.
        </p>
      </section>

      {/* Logic Steps */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 bg-surface-container-lowest rounded-3xl p-8 clinical-shadow overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-headline text-xl font-bold text-primary">Live Inference Engine</h3>
            <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold uppercase tracking-wider">Active Stream</span>
          </div>
          
          <div className="space-y-6">
            <div className="flex gap-4 items-start p-4 rounded-2xl bg-surface-container-low">
              <CheckCircle2 className="w-5 h-5 text-primary fill-primary/10" />
              <div>
                <p className="font-sans text-[10px] text-on-surface-variant font-bold mb-1 uppercase tracking-widest">KNOWLEDGE BASE VERIFIED</p>
                <p className="text-on-surface font-medium">Evaluating Knowledge Base: Respiratory Protocols v4.2</p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 rounded-2xl border-2 border-primary/20 bg-primary-fixed/30">
              <RefreshCw className="w-5 h-5 text-primary animate-spin" />
              <div className="flex-1">
                <p className="font-sans text-[10px] text-primary font-bold mb-1 uppercase tracking-widest">CURRENT RULE EXECUTION</p>
                <p className="text-on-surface font-semibold italic">Checking against rule: IF Fever AND Cough AND Dyspnea THEN Trigger Alert (Lower Respiratory Infection)</p>
                <div className="mt-4 h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "65%" }}
                    transition={{ duration: 2 }}
                    className="h-full primary-gradient" 
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 rounded-2xl bg-surface-container opacity-60">
              <div className="w-5 h-5 rounded-full border-2 border-outline-variant flex items-center justify-center">
                <div className="w-1 h-1 bg-outline-variant rounded-full" />
              </div>
              <div>
                <p className="font-sans text-[10px] text-on-surface-variant font-bold mb-1 uppercase tracking-widest">QUEUED INFERENCE</p>
                <p className="text-on-surface">Validating Rule: IF Oxygen_Saturation &lt; 92% AND Age &gt; 65...</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 space-y-6">
          <div className="bg-surface-container-high rounded-3xl p-6 shadow-sm">
            <h4 className="font-headline font-bold text-on-surface-variant mb-4 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Data Integrity
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium">Inference Depth</span>
                <span className="text-primary font-bold">14 Layers</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium">Confidence Score</span>
                <span className="text-primary font-bold">88.4%</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border-l-4 border-tertiary">
            <p className="text-xs font-bold text-tertiary uppercase mb-2">Notice</p>
            <p className="text-sm text-on-surface-variant leading-relaxed">System is optimizing search paths for rare symptomatic clusters detected in current input.</p>
          </div>

          <div className="relative overflow-hidden rounded-3xl h-40 group">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0SWZRfOv3NEWeh8RkTay4MwJPI3RXAiFpUrJaXTlaGmLMENTTk9HWP9jQN7hNuLgx1KBh6KMZHy2TOikEJcvmF5fTpYVtkbv608jXKNGEWtPD24E2jglqblf3b5WKb-3NqafWzLi9KYXMuI2NBfFm3iUsdZab9bpzQgPDo1ZyhO6KLXvo6OPF6IfV5gVxBzUNmG7aGWzwPUjo5GNCDbVXVNVgsfP78s4GBVUtAYJtjWLoDU90GOSIOFCMxIqsXfND9XCbXwgjSSVt" 
              alt="Neural connections" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-4">
              <p className="text-white text-[10px] font-bold uppercase tracking-widest">Real-time Clinical Sanctuary Intelligence</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-on-surface-variant opacity-50">
        <p className="text-xs flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          HIPAA Compliant End-to-End Encryption Active
        </p>
      </div>
    </div>
  );
}
