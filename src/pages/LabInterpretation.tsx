import { motion } from 'motion/react';
import { 
  Microscope, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2,
  Info,
  ArrowUpRight,
  Search,
  Minus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

const results = [
  { 
    name: 'White Blood Cell Count', 
    value: '11.2', 
    unit: 'x10³/µL', 
    range: '4.5 - 11.0', 
    status: 'High', 
    trend: 'up',
    history: [
      { val: 6.2 }, { val: 7.1 }, { val: 6.8 }, { val: 9.4 }, { val: 11.2 }
    ]
  },
  { 
    name: 'C-Reactive Protein', 
    value: '8.4', 
    unit: 'mg/L', 
    range: '< 3.0', 
    status: 'High', 
    trend: 'up',
    history: [
      { val: 1.2 }, { val: 1.5 }, { val: 2.1 }, { val: 4.8 }, { val: 8.4 }
    ]
  },
  { 
    name: 'Hemoglobin', 
    value: '14.2', 
    unit: 'g/dL', 
    range: '13.5 - 17.5', 
    status: 'Normal', 
    trend: 'stable',
    history: [
      { val: 14.1 }, { val: 14.3 }, { val: 14.2 }, { val: 14.2 }, { val: 14.2 }
    ]
  },
  { 
    name: 'Platelets', 
    value: '245', 
    unit: 'x10³/µL', 
    range: '150 - 450', 
    status: 'Normal', 
    trend: 'down',
    history: [
      { val: 280 }, { val: 275 }, { val: 260 }, { val: 255 }, { val: 245 }
    ]
  },
  { 
    name: 'Glucose (Fasting)', 
    value: '92', 
    unit: 'mg/dL', 
    range: '70 - 99', 
    status: 'Normal', 
    trend: 'none',
    history: null // No historical data
  },
];

function Sparkline({ data, trend }: { data: any[] | null, trend: string }) {
  if (!data) {
    return (
      <div className="flex items-center gap-1 text-[10px] text-on-surface-variant/40 font-bold uppercase tracking-tighter">
        <Minus className="w-3 h-3" /> No History
      </div>
    );
  }

  const color = trend === 'up' ? '#ba1a1a' : trend === 'down' ? '#10b981' : '#00478d';

  return (
    <div className="w-20 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
          <Line 
            type="monotone" 
            dataKey="val" 
            stroke={color} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function LabInterpretation() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-primary font-headline font-bold text-sm tracking-widest uppercase">Diagnostic Analysis</span>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface mt-2 tracking-tight">Lab Interpretation</h1>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
          <input 
            type="text" 
            placeholder="Search lab results..." 
            className="w-full pl-12 pr-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Results Table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-container-lowest rounded-[2.5rem] clinical-shadow overflow-hidden border border-outline-variant/10">
            <div className="p-8 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-headline font-bold text-on-surface">Complete Blood Count (CBC)</h3>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Report ID: #LAB-99281</p>
                </div>
              </div>
              <span className="text-xs font-bold text-on-surface-variant">Collected: Oct 11, 2025</span>
            </div>
            
            <div className="p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-lowest border-b border-outline-variant/10">
                    <th className="px-8 py-5 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Marker</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Result</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Reference Range</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Historical Trend</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {results.map((res) => (
                    <tr key={res.name} className="hover:bg-primary/5 transition-colors">
                      <td className="px-8 py-6">
                        <p className="font-bold text-on-surface">{res.name}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <span className="font-headline font-bold text-lg text-on-surface">{res.value}</span>
                          <span className="text-xs text-on-surface-variant">{res.unit}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm text-on-surface-variant font-medium">{res.range}</span>
                      </td>
                      <td className="px-8 py-6">
                        <Sparkline data={res.history} trend={res.trend} />
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {res.trend === 'up' && <TrendingUp className="w-4 h-4 text-rose-500" />}
                          {res.trend === 'down' && <TrendingDown className="w-4 h-4 text-emerald-500" />}
                          {res.trend === 'stable' && <Minus className="w-4 h-4 text-primary" />}
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            res.status === 'High' ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                          )}>
                            {res.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-primary-fixed/30 p-8 rounded-[2.5rem] border border-primary/10 flex items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm">
              <Microscope className="w-7 h-7 text-primary" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-headline font-bold text-on-surface">Clinical Interpretation</h4>
              <p className="text-on-surface-variant leading-relaxed">
                The elevated WBC and CRP levels correlate with the reported symptoms of fever and cough, suggesting an active inflammatory response. The stable hemoglobin levels indicate no systemic anemia. Recommend monitoring for 48 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-surface-container-high p-8 rounded-[2.5rem] clinical-shadow">
            <h3 className="font-headline text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-tertiary" />
              Critical Alerts
            </h3>
            <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100 space-y-3">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                CRP Elevation Detected
              </div>
              <p className="text-xs text-rose-600 leading-relaxed">
                C-Reactive Protein is significantly above the reference range. This indicates systemic inflammation requiring clinical attention.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] clinical-shadow">
            <h4 className="font-headline font-bold text-on-surface mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Lab Glossary
            </h4>
            <div className="space-y-4">
              {[
                { term: 'WBC', def: 'White Blood Cells - immune system response markers.' },
                { term: 'CRP', def: 'C-Reactive Protein - general inflammation indicator.' },
                { term: 'HGB', def: 'Hemoglobin - oxygen-carrying protein in blood.' },
              ].map(item => (
                <div key={item.term}>
                  <p className="text-sm font-bold text-primary mb-1">{item.term}</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{item.def}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-surface-container-low text-primary rounded-xl font-bold text-sm flex items-center justify-center gap-2 group">
              Full Glossary <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
