import { motion } from 'motion/react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, ClipboardList, Scale, Zap, ShieldCheck, HeartPulse } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/AuthContext';

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="grid lg:grid-cols-12 gap-12 items-center mb-24">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold mb-6 tracking-wider uppercase">
            Advanced Clinical Intelligence
          </span>
          <h1 className="font-headline font-extrabold text-5xl md:text-6xl text-on-surface leading-[1.1] mb-6 tracking-tight">
            Precision care starts with <span className="text-primary">expert clarity.</span>
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
            Navigate your symptoms with our Clinical Sanctuary. We combine curated medical knowledge with expert diagnostic rules to guide your journey to health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/symptoms"
              className="bg-primary-gradient text-on-primary px-8 py-4 rounded-xl font-semibold text-lg clinical-shadow active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              Start Diagnosis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="bg-surface-container-high text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-surface-container-highest transition-colors flex items-center justify-center">
              Learn Process
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary-fixed/30 rounded-full blur-3xl -z-10" />
          <div className="rounded-3xl overflow-hidden clinical-shadow">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9YF3rDGQ4vJRf5KxUVvHIPWbRmejG8gZUH0BWVXezPNTxHewioHTbQuQ2Sq6slVM0Zw4MahaT8SzVV1vsJQJV6nG6e3Ks7n_jEPxH1_DE95CmoIXHTXTnR1b1OBAkupPkRxI1lDjYhBLruhCLl95dZBhFY-eTe9RBUt0xIdv88ij7UkERGCZWuHxd9jHu9D-zjtcGdLqNghBAsfLeiMW_91GuuAhWCmb5wk5TpduM27oGtxfy-xSAZWqpYKHr7ljoUoEf3zFFoYPI" 
              alt="Medical Professional" 
              className="w-full h-[500px] object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Glassmorphism Floating Badge */}
          <div className="absolute -bottom-6 -left-6 bg-surface/80 backdrop-blur-xl p-6 rounded-2xl clinical-shadow max-w-[200px]">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-5 h-5 text-primary fill-primary/20" />
              <span className="text-sm font-bold text-on-surface">Verified Rules</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-tight">
              Powered by clinical expertise and peer-reviewed diagnostics.
            </p>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="mb-24">
        <div className="flex flex-col mb-12">
          <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">How it works</h2>
          <div className="h-1 w-20 primary-gradient rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              title: 'Symptom Input', 
              desc: 'Describe your symptoms in your own words. Our intelligent interface captures nuances that standard forms miss.',
              icon: ClipboardList,
              color: 'bg-primary-fixed'
            },
            { 
              title: 'Expert Engine', 
              desc: 'Your data is processed through a complex matrix of medical rules derived from leading clinical guidelines.',
              icon: Scale,
              color: 'bg-tertiary-fixed'
            },
            { 
              title: 'Clear Insights', 
              desc: 'Receive a detailed probability analysis and actionable next steps tailored to your specific diagnostic profile.',
              icon: Zap,
              color: 'bg-secondary-container'
            }
          ].map((item, i) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-surface-container-lowest p-8 rounded-xl clinical-shadow flex flex-col items-start gap-6"
            >
              <div className={cn("w-14 h-14 rounded-full flex items-center justify-center", item.color)}>
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-surface-container-low rounded-[2rem] p-12 mb-24 grid md:grid-cols-4 gap-8">
        {[
          { label: 'Medical Rules', value: '500+' },
          { label: 'Accuracy Rating', value: '98%' },
          { label: 'Diagnoses Daily', value: '10k+' },
          { label: 'Expert Access', value: '24/7' }
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="font-headline font-extrabold text-4xl text-primary mb-1">{stat.value}</div>
            <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="relative rounded-3xl overflow-hidden primary-gradient p-12 text-on-primary">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100" fill="transparent" stroke="white" />
            <path d="M0 50 C 30 100 70 0 100 50" fill="transparent" stroke="white" />
          </svg>
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="font-headline text-3xl font-bold mb-4">Ready for your consultation?</h2>
          <p className="text-on-primary-container text-lg mb-8">
            Take the first step towards clarity. Our diagnostic rules are ready to evaluate your situation with the precision of an expert clinical team.
          </p>
          <Link 
            to="/symptoms"
            className="inline-block bg-surface-container-lowest text-primary px-10 py-4 rounded-xl font-bold text-lg clinical-shadow active:scale-95 transition-transform"
          >
            Start My Assessment
          </Link>
        </div>
      </section>
    </div>
  );
}
