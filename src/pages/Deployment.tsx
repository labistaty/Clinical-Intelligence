import { motion } from 'motion/react';
import { 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Globe, 
  Zap, 
  ArrowUpRight,
  BarChart3,
  Server,
  Network
} from 'lucide-react';

export default function Deployment() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-primary font-headline font-bold text-sm tracking-widest uppercase">Diagnostic Infrastructure</span>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface mt-2 tracking-tight">System Deployment</h1>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Global Engine Status: Optimal
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Status Grid */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] clinical-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-primary" />
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Compute Load</span>
              </div>
              <h3 className="text-4xl font-headline font-extrabold text-on-surface mb-2">24.8%</h3>
              <p className="text-sm text-on-surface-variant mb-6">Inference engine processing capacity currently utilized.</p>
              <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full primary-gradient w-1/4" />
              </div>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] clinical-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed flex items-center justify-center">
                  <Zap className="w-6 h-6 text-tertiary" />
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Latency</span>
              </div>
              <h3 className="text-4xl font-headline font-extrabold text-on-surface mb-2">12ms</h3>
              <p className="text-sm text-on-surface-variant mb-6">Average response time for clinical rule evaluation.</p>
              <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-tertiary w-[12%]" />
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-8 rounded-[2.5rem] clinical-shadow">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline text-xl font-bold text-on-surface">Regional Node Distribution</h3>
              <button className="text-primary font-bold text-sm flex items-center gap-1">
                View Network Map <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-6">
              {[
                { region: 'North America (East)', status: 'Active', load: '42%', icon: Globe },
                { region: 'Europe (West)', status: 'Active', load: '18%', icon: Globe },
                { region: 'Asia Pacific (Tokyo)', status: 'Standby', load: '0%', icon: Globe },
              ].map(node => (
                <div key={node.region} className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
                  <div className="flex items-center gap-4">
                    <node.icon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-bold text-on-surface">{node.region}</p>
                      <p className="text-xs text-on-surface-variant">Status: {node.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{node.load}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold">Current Load</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-primary-gradient p-8 rounded-[2.5rem] text-on-primary clinical-shadow">
            <ShieldCheck className="w-10 h-10 mb-6" />
            <h3 className="text-2xl font-headline font-bold mb-4">Security Protocol</h3>
            <p className="text-on-primary-container text-sm leading-relaxed mb-6">
              All diagnostic data is processed through our Clinical Sanctuary isolation layer. Zero-trust architecture ensures patient PII never leaves the secure perimeter.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                AES-256 Encryption
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                SOC2 Type II Compliant
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] clinical-shadow">
            <h4 className="font-headline font-bold text-on-surface mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              System Health
            </h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Server className="w-4 h-4 text-on-surface-variant" />
                  <span className="text-sm font-medium">Database Cluster</span>
                </div>
                <span className="text-xs font-bold text-emerald-500">HEALTHY</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Network className="w-4 h-4 text-on-surface-variant" />
                  <span className="text-sm font-medium">API Gateway</span>
                </div>
                <span className="text-xs font-bold text-emerald-500">HEALTHY</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-4 h-4 text-on-surface-variant" />
                  <span className="text-sm font-medium">Analytics Engine</span>
                </div>
                <span className="text-xs font-bold text-emerald-500">HEALTHY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
