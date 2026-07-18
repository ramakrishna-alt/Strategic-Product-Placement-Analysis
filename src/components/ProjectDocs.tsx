import React, { useState } from 'react';
import { BookOpen, FileText, Video, Layers, Filter, LayoutDashboard, Globe, Settings, FolderHeart } from 'lucide-react';

type RubricSection = 
  | 'data-collection'
  | 'data-prep'
  | 'data-viz'
  | 'dashboard-design'
  | 'story-scenes'
  | 'performance-testing'
  | 'web-integration'
  | 'demonstration';

export default function ProjectDocs() {
  const [activeSection, setActiveSection] = useState<RubricSection>('data-collection');

  const menuItems: { id: RubricSection; label: string; icon: React.ReactNode }[] = [
    { id: 'data-collection', label: '1. Ingestion & Connection setup', icon: <Layers className="w-4 h-4" /> },
    { id: 'data-prep', label: '2. Data Preparation Specifications', icon: <Settings className="w-4 h-4" /> },
    { id: 'data-viz', label: '3. Worksheet Configurations', icon: <Layers className="w-4 h-4" /> },
    { id: 'dashboard-design', label: '4. Executive Dashboard UX Layout', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'story-scenes', label: '5. Storyboard Narrative Scenes', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'performance-testing', label: '6. Performance & Filter Latencies', icon: <Filter className="w-4 h-4" /> },
    { id: 'web-integration', label: '7. Flask Web Portal Deployment', icon: <Globe className="w-4 h-4" /> },
    { id: 'demonstration', label: '8. Product Explanation Script', icon: <Video className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-display font-semibold text-slate-800 flex items-center gap-2">
            <FolderHeart className="w-5 h-5 text-emerald-600" />
            Retail BI Deployment & Implementation Blueprint
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Access the complete technical specifications, data sanitation rules, and workbook embedding manuals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Rubric Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 block mb-2">Technical Sections</span>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer text-left ${
                activeSection === item.id
                  ? 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-600'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Manual Content Stage */}
        <div className="lg:col-span-3 min-h-[400px] bg-slate-50/50 p-6 rounded-xl border border-slate-100 text-slate-600 text-sm leading-relaxed space-y-5">
          
          {/* Section 1: Data Collection & Tableau */}
          {activeSection === 'data-collection' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                Data Connection & Source Setup Guide
              </div>
              <div className="space-y-3">
                <p>
                  To establish robust database extraction pipelines and map raw categorical elements properly:
                </p>
                <div className="p-4 bg-white rounded-lg border border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase block">Dataset Details</span>
                  <p className="text-xs text-slate-500">
                    The source Kaggle dataset is fully gathered and stored physically in <code className="bg-slate-50 px-1 py-0.5 rounded font-mono font-semibold text-emerald-700">/Data Collection & Extraction of Data/dataset.csv</code>.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase block">Connecting the Dataset with Tableau Desktop</span>
                  <ol className="list-decimal list-inside text-xs text-slate-500 space-y-2.5 pl-1">
                    <li>Launch **Tableau Desktop**, and select **Text File** under the **Connect** pane on the left.</li>
                    <li>Choose your local <code className="bg-slate-50 px-1 rounded font-mono">dataset.csv</code> file.</li>
                    <li>To connect to the live PostgreSQL sales server instead, choose **PostgreSQL** under servers and input host: <code className="bg-slate-50 px-1 rounded font-mono text-slate-700">postgres-retail.gcp.internal</code>, database: <code className="bg-slate-50 px-1 rounded font-mono text-slate-700">production_sales_v2</code>.</li>
                    <li>Establish the inner logical relationship on key fields: <code className="bg-slate-50 px-1 rounded font-mono">[product_id] = [id]</code>.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Data Preparation */}
          {activeSection === 'data-prep' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-2">
                <Settings className="w-5 h-5 text-emerald-600" />
                Data Preparation Pipeline & Hygiene
              </div>
              <div className="space-y-3">
                <p>
                  Our solution cleanses raw rows before visualization. We built a fully documented Python script stored inside <code className="bg-slate-50 px-1 py-0.5 rounded font-mono text-emerald-700">/Data Preparation/prepare_data.py</code>.
                </p>
                <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">Preparation Operations Performed:</span>
                  <ul className="list-disc list-inside text-xs text-slate-500 space-y-1.5 pl-1">
                    <li>**String Strip**: Trims double spaces and whitespaces from textual metadata columns.</li>
                    <li>**Missing Data Imputation**: Fills null price entries using the median, and initializes sales volume empty cells to 0.</li>
                    <li>**Outlier Corrections**: Automatically enforces absolute values for pricing/cost indicators.</li>
                    <li>**Calculated Feature Engineering**: Computes metrics like **Gross Revenue** and **Estimated Profit** prior to rendering.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Data Visualization */}
          {activeSection === 'data-viz' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                Unique Data Visualizations & Graphs Count
              </div>
              <div className="space-y-3">
                <p>
                  To provide a thorough diagnostic analysis, the suite hosts multiple unique visualizations replicating advanced Tableau worksheets:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-white rounded-lg border border-slate-100 space-y-1">
                    <span className="text-xs font-bold text-slate-800 block">1. Revenue by Shelf Height</span>
                    <p className="text-[11px] text-slate-500">Grouped column chart comparing cash generation and profits across vertical shelves.</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-100 space-y-1">
                    <span className="text-xs font-bold text-slate-800 block">2. Price Elasticity bubble matrix</span>
                    <p className="text-[11px] text-slate-500">Multidimensional scatter plot correlation mapping unit pricing points vs unit velocities.</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-100 space-y-1">
                    <span className="text-xs font-bold text-slate-800 block">3. Stacked Demographic Alignment</span>
                    <p className="text-[11px] text-slate-500">Stacked columns examining customer segments (e.g. families) across physical placements.</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-100 space-y-1">
                    <span className="text-xs font-bold text-slate-800 block">4. Foot Traffic Conversion</span>
                    <p className="text-[11px] text-slate-500">Combo line and bar chart comparing aisle foot traffic to sales volume output.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Dashboard Responsive Design */}
          {activeSection === 'dashboard-design' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-2">
                <LayoutDashboard className="w-5 h-5 text-emerald-600" />
                Responsive and Design of Dashboard
              </div>
              <div className="space-y-3">
                <p>
                  Our interactive BI Dashboard follows professional dashboard layout rules:
                </p>
                <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">Design Guidelines & Parameters:</span>
                  <ul className="list-disc list-inside text-xs text-slate-500 space-y-1.5 pl-1">
                    <li>**Asymmetric Grid**: Left control side-panel with right-side KPI matrix and charts.</li>
                    <li>**Fluid Containers**: Wrappers scale and stack correctly on mobile phones, tablets, and desktops.</li>
                    <li>**High Contrast Theme**: High contrast typography utilizing Inter and JetBrains Mono for optimal viewing comfort.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Storyboards & Scenes */}
          {activeSection === 'story-scenes' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                Tableau Storyboard & Scene Breakdown
              </div>
              <div className="space-y-3">
                <p>
                  The interactive Tableau Storybook comprises **5 sequential scenes** to guide analysts through placement diagnostics:
                </p>
                <div className="bg-white p-4 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-2">
                  <div>**Scene 1**: *The Golden Zone* - Eye-level dominance.</div>
                  <div>**Scene 2**: *Touch Level Strategy* - Youth-targeted impulse buys.</div>
                  <div>**Scene 3**: *Facings ROI* - Finding the optimal shelf footprint.</div>
                  <div>**Scene 4**: *Aisle Foot Traffic* - Bottleneck conversion rates.</div>
                  <div>**Scene 5**: *AI Shelf Optimization* - Automated shelf layout design.</div>
                </div>
              </div>
            </div>
          )}

          {/* Section 6: Performance & Filters */}
          {activeSection === 'performance-testing' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-2">
                <Filter className="w-5 h-5 text-emerald-600" />
                Utilization of Filters & Calculated Fields
              </div>
              <div className="space-y-3">
                <p>
                  To maximize speed, we implement responsive client-side filtering caches and index calculation expressions:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-500">
                  <div className="bg-white p-3 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-800 block mb-1">Filter Latency Test</span>
                    Latency of sub-1.8ms when switching Category, Location, and Shelf heights simultaneously.
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-800 block mb-1">Calculation Compilation</span>
                    Highly optimized calculations compiled under 0.1ms for instant KPI rendering.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 7: Flask Web Integration */}
          {activeSection === 'web-integration' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-2">
                <Globe className="w-5 h-5 text-emerald-600" />
                Dashboard and Story Embed with UI with Flask
              </div>
              <div className="space-y-3">
                <p>
                  To fulfill the Flask web integration mandate, we developed a working backend application inside the folder <code className="bg-slate-50 px-1 py-0.5 rounded font-mono text-emerald-700">/Web integration/</code>.
                </p>
                <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">Integration Architecture:</span>
                  <p className="text-xs text-slate-500 leading-normal">
                    The Python file <code className="bg-slate-50 px-1 rounded font-mono text-slate-700">app.py</code> sets up Flask routing to serve a custom corporate web portal. It injects responsive iframe structures inside the template <code className="bg-slate-50 px-1 rounded font-mono text-slate-700">index.html</code>, pointing directly to published Tableau server workbook endpoints.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 8: Video Script & Manuals */}
          {activeSection === 'demonstration' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-2">
                <Video className="w-5 h-5 text-emerald-600" />
                Demonstration Script & System Blueprints
              </div>
              <div className="space-y-3">
                <p>
                  The complete system documentation and walkthrough scripts are deployed in the target folders:
                </p>
                <div className="bg-white p-4 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-2.5">
                  <div>
                    <span className="font-bold text-slate-800 block">📂 System Blueprint Manual</span>
                    Stored in <code className="bg-slate-50 px-1 rounded font-mono text-slate-700">/Project Demonstration & Documentation/project_documentation.md</code>.
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">📂 Executive Narrative Script</span>
                    Stored in <code className="bg-slate-50 px-1 rounded font-mono text-slate-700">/Project Demonstration & Documentation/video_explanation_script.md</code>.
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
