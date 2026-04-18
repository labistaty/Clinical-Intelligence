import { Search, BookOpen, Bookmark, Clock, ChevronRight, ArrowUpRight } from 'lucide-react';

const categories = [
  { name: 'Respiratory', count: 124, icon: '🫁', color: 'bg-blue-100 text-blue-700' },
  { name: 'Cardiology', count: 86, icon: '🫀', color: 'bg-rose-100 text-rose-700' },
  { name: 'Neurology', count: 52, icon: '🧠', color: 'bg-purple-100 text-purple-700' },
  { name: 'Pediatrics', count: 94, icon: '👶', color: 'bg-amber-100 text-amber-700' },
];

const articles = [
  { 
    title: 'Differential Diagnosis of Acute Dyspnea', 
    author: 'Dr. Sarah Miller', 
    date: 'Oct 2025', 
    tag: 'Clinical Guide',
    excerpt: 'A comprehensive review of diagnostic pathways for patients presenting with sudden onset shortness of breath.'
  },
  { 
    title: 'Emerging Viral Strains in Upper Respiratory Tract', 
    author: 'Clinical Research Dept', 
    date: 'Sep 2025', 
    tag: 'Research',
    excerpt: 'Analyzing the genomic shifts in seasonal rhinoviruses and their impact on standard treatment protocols.'
  },
  { 
    title: 'Pediatric Fever Management Protocols', 
    author: 'Pediatric Board', 
    date: 'Aug 2025', 
    tag: 'Protocol',
    excerpt: 'Evidence-based guidelines for managing febrile seizures and high-grade fevers in infants and young children.'
  },
  { 
    title: 'Interpretation of Elevated C-Reactive Protein', 
    author: 'Lab Sciences Unit', 
    date: 'Jul 2025', 
    tag: 'Lab Guide',
    excerpt: 'Understanding the clinical significance of CRP levels in systemic inflammation and infection tracking.'
  },
];

export default function Library() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-primary font-headline font-bold text-sm tracking-widest uppercase">Knowledge Base</span>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface mt-2 tracking-tight">Medical Library</h1>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
          <input 
            type="text" 
            placeholder="Search medical journals..." 
            className="w-full pl-12 pr-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Categories */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="font-headline font-bold text-on-surface px-2">Categories</h3>
          <div className="space-y-2">
            {categories.map(cat => (
              <button key={cat.name} className="w-full flex items-center justify-between p-4 rounded-2xl bg-surface-container-lowest clinical-shadow hover:bg-primary/5 transition-all group">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="font-medium text-on-surface">{cat.name}</span>
                </div>
                <span className="text-xs font-bold text-primary bg-primary-fixed px-2 py-1 rounded-lg">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Articles */}
        <div className="lg:col-span-9 space-y-8">
          <div className="relative rounded-[2.5rem] overflow-hidden primary-gradient p-12 text-on-primary clinical-shadow">
            <div className="relative z-10 max-w-xl">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">Featured Protocol</span>
              <h2 className="text-3xl font-headline font-bold mb-4">Advanced Triage Logic for Seasonal Influenza</h2>
              <p className="text-on-primary-container mb-8">Updated guidelines for the 2025-2026 season incorporating new diagnostic rules for variant detection.</p>
              <button className="bg-white text-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 active:scale-95 transition-all">
                Read Full Protocol <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 0 L100 0 L100 100 Z" fill="white" />
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-headline font-bold text-on-surface px-2">Recent Publications</h3>
            <div className="grid gap-4">
              {articles.map(art => (
                <div key={art.title} className="bg-surface-container-lowest p-6 rounded-3xl clinical-shadow flex items-center justify-between group cursor-pointer hover:border-primary/20 border border-transparent transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center shrink-0">
                      <BookOpen className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{art.tag}</span>
                        <span className="w-1 h-1 rounded-full bg-outline-variant" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{art.date}</span>
                      </div>
                      <h4 className="font-headline font-bold text-lg text-on-surface group-hover:text-primary transition-colors">{art.title}</h4>
                      <p className="text-sm text-on-surface-variant line-clamp-1">{art.excerpt}</p>
                      <p className="text-xs text-on-surface-variant mt-1">By {art.author}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant">
                      <Bookmark className="w-5 h-5" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-outline-variant group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
