import React, { useState } from 'react';
import { BookOpen, FileText, Video, Sparkles, Layers, ListTodo, HelpCircle } from 'lucide-react';

export default function ProjectDocs() {
  const [activeSubTab, setActiveSubTab] = useState<'tableau-manual' | 'video-script' | 'calculated-index'>('tableau-manual');

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-display font-semibold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            Project Documentation & Deliverables Hub
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Access the complete Tableau implementation guide and interactive video transcript script to complete your final deliverables.
          </p>
        </div>

        {/* Sub-tabs toggler */}
        <div className="flex gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveSubTab('tableau-manual')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'tableau-manual'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 inline mr-1" />
            Tableau Step-by-Step
          </button>
          <button
            onClick={() => setActiveSubTab('video-script')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'video-script'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Video className="w-3.5 h-3.5 inline mr-1" />
            Explanation Video Script
          </button>
          <button
            onClick={() => setActiveSubTab('calculated-index')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'calculated-index'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5 inline mr-1" />
            Formula Index
          </button>
        </div>
      </div>

      {/* Sub-tab content router */}
      {activeSubTab === 'tableau-manual' && (
        <div className="space-y-6 text-sm text-slate-600 leading-relaxed max-w-4xl">
          <div className="space-y-2">
            <h3 className="text-lg font-display font-semibold text-slate-800 flex items-center gap-2">
              <span className="p-1 bg-emerald-50 text-emerald-700 rounded-md text-xs">Phase 1</span>
              Data Extraction & Connection Setup
            </h3>
            <p>
              To replicate our database connection model in the real **Tableau Desktop** software:
            </p>
            <ol className="list-decimal list-inside pl-2 space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <li>Open **Tableau Desktop** and locate the **Connect** pane on the left side.</li>
              <li>Under **To a Server**, choose **PostgreSQL** (to connect to the sales records) or **Google BigQuery** (for the demographics warehouse).</li>
              <li>Enter your connection parameters:
                <ul className="list-disc list-inside pl-5 mt-1.5 text-xs text-slate-500 font-mono space-y-1">
                  <li>Server/Host: <span className="text-slate-700">postgres-retail.gcp.internal</span></li>
                  <li>Database: <span className="text-slate-700">production_sales_v2</span></li>
                  <li>Port: <span className="text-slate-700">5432</span></li>
                  <li>Username / Password: Enter your GCP database credentials.</li>
                </ul>
              </li>
              <li>Click **Sign In** to extract database schemas and tables. Drag the <span className="font-mono bg-white border px-1 py-0.5 rounded text-xs text-slate-700">sales_transactions</span> and <span className="font-mono bg-white border px-1 py-0.5 rounded text-xs text-slate-700">product_dimensions</span> tables onto the Canvas.</li>
              <li>Set the connection relationship to **Inner Join** on <span className="font-mono font-bold text-slate-800 text-xs">[product_id] = [id]</span>.</li>
            </ol>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-5">
            <h3 className="text-lg font-display font-semibold text-slate-800 flex items-center gap-2">
              <span className="p-1 bg-emerald-50 text-emerald-700 rounded-md text-xs">Phase 2</span>
              Dynamic Calculated Fields Compilation
            </h3>
            <p>
              Calculated fields allow Tableau to evaluate dynamic retail KPIs. To declare them, right-click anywhere in the **Data Pane** on the left, select **Create Calculated Field**, and declare these formulas exactly:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-xs font-bold text-slate-800">1. Profit Margin Ratio (%)</span>
                <pre className="text-xs font-mono bg-slate-950 text-emerald-400 p-2 rounded-md mt-1.5 overflow-x-auto">
                  ([Revenue] - ([Sales Units] * [Unit Cost])) / [Revenue]
                </pre>
                <span className="text-[10px] text-slate-400 mt-1 block">Change formatting profile to "Percentage" with 1 decimal place.</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-xs font-bold text-slate-800">2. Sales Density per Facing</span>
                <pre className="text-xs font-mono bg-slate-950 text-emerald-400 p-2 rounded-md mt-1.5 overflow-x-auto">
                  [Sales Units] / [Facing Count]
                </pre>
                <span className="text-[10px] text-slate-400 mt-1 block">Allows planners to measure layout efficiencies.</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-5">
            <h3 className="text-lg font-display font-semibold text-slate-800 flex items-center gap-2">
              <span className="p-1 bg-emerald-50 text-emerald-700 rounded-md text-xs">Phase 3</span>
              Story Points & Narrative Building
            </h3>
            <p>
              A Tableau Story integrates separate worksheets into a cohesive diagnostic walk-through:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <li>Click the **New Story** icon at the bottom of the workspace.</li>
              <li>From the left **Sheets Pane**, drag your **Shelf Height Revenue Comparison** worksheet into the center.</li>
              <li>In the grey **Story Point Navigator** tab at the top, write: <span className="italic font-semibold text-slate-700">"The Golden Zone: Eye-Level Dominance"</span>.</li>
              <li>Add a second story point and drag the **Stacked Demographic Segment Height Preference** worksheet. Add your notes indicating how Kids Sweet Brands align perfectly with Touch-Level shelves.</li>
              <li>Duplicate these steps for your remaining scenes (Facings ROI, Foot Traffic Correlations, and the AI Optimized planogram).</li>
            </ul>
          </div>
        </div>
      )}

      {activeSubTab === 'video-script' && (
        <div className="space-y-6 text-sm text-slate-600 leading-relaxed max-w-4xl">
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-100/50 flex items-start gap-3">
            <Video className="w-5 h-5 text-emerald-600 mt-0.5" />
            <div>
              <h4 className="font-bold">Explanation Video Director Guide</h4>
              <p className="text-xs text-emerald-700/90 mt-0.5">
                The retail company requests an explanation video demonstrating the end-to-end product placement analysis solution. Follow this structured transcript script during your recording.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Scene 1 */}
            <div className="border-l-4 border-emerald-500 pl-4 space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Segment 1: Introduction (0:00 - 0:45)</span>
              <p className="text-xs font-medium text-slate-500"><span className="font-bold text-slate-800">Visual Screen:</span> Active Dashboard tab, highlighting the KPI panels showing $31,000+ total sales revenue.</p>
              <p className="italic text-slate-700">
                "Hello everyone, and welcome to our Strategic Product Placement Analysis solution. In this video, we are demonstrating how product shelving heights, horizontal facings, and store locations impact overall sales conversion rates and grocery margins. Our retail client wants to optimize these spatial coordinates. By connecting Postgres and BigQuery tables, we can query raw transactional entries, perform extensive data hygiene prep, and visualize them using a Tableau-inspired BI dashboard environment..."
              </p>
            </div>

            {/* Scene 2 */}
            <div className="border-l-4 border-emerald-500 pl-4 space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Segment 2: Connection & Data Prep Demonstration (0:45 - 1:30)</span>
              <p className="text-xs font-medium text-slate-500"><span className="font-bold text-slate-800">Visual Screen:</span> Click to the "Database Connections & Raw Table" tab. Trigger "Run Data Prep Pipeline" to show sanitization.</p>
              <p className="italic text-slate-700">
                "As you can see on the screen, our Tableau workspace connects live to the Main Retail PostgreSQL DB and the Demographic Warehouse. Before making calculations, we pass our raw data through an automated Hygiene Pipeline. This routine trims trailing whitespaces, sanitizes names, checks for cost and price decimal consistency, and manages extreme outlier figures. Let's trigger the pipeline right now..."
              </p>
            </div>

            {/* Scene 3 */}
            <div className="border-l-4 border-emerald-500 pl-4 space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Segment 3: Tableau Dashboard & Interactive Story (1:30 - 3:00)</span>
              <p className="text-xs font-medium text-slate-500"><span className="font-bold text-slate-800">Visual Screen:</span> Navigate through Story Scenes 1, 2, and 3, clicking the interactive story blocks.</p>
              <p className="italic text-slate-700">
                "Moving on to our Tableau Storybook, Scene 1 illustrates vertical height performance. We clearly notice how Eye-Level placement secures high pricing margins, acting as a massive revenue anchor. However, in Scene 2, we segment sales by age demographics. Notice how kids sweets and chocolates placed at Touch-Level outperform other layers by 150%, demonstrating that impulse buying is heavily linked to children's eye height..."
              </p>
            </div>

            {/* Scene 4 */}
            <div className="border-l-4 border-emerald-500 pl-4 space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Segment 4: Gemini Planogram Recommendations (3:00 - End)</span>
              <p className="text-xs font-medium text-slate-500"><span className="font-bold text-slate-800">Visual Screen:</span> Open the Shelf Optimizer tab, show the physical shelves, and run the Gemini AI analysis report.</p>
              <p className="italic text-slate-700">
                "To conclude our analysis, we have integrated a sandbox shelf planogram that interfaces directly with Gemini 3.5. Planners can reposition items, adjust facings, and receive a structured merchandising audit report. This report acts as an automated pricing and space consultant, suggesting high-impact ROI adjustments to boost supermarket category profit margins. Thank you for watching!"
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'calculated-index' && (
        <div className="space-y-4 max-w-4xl">
          <div className="text-sm text-slate-600 mb-2">
            These pre-configured formula structures represent real-world supermarket BI calculations:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <div className="font-bold text-slate-800 text-sm">Profit Margin (%)</div>
              <p className="text-xs text-slate-500">Evaluates the raw profitability percentage of a product placement.</p>
              <code className="block p-2 bg-slate-900 text-emerald-400 text-xs font-mono rounded-md">
                ([Revenue] - ([Sales Units] * [Unit Cost])) / [Revenue]
              </code>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <div className="font-bold text-slate-800 text-sm">Sales per Facing</div>
              <p className="text-xs text-slate-500">Measures volume elasticity and floor/shelf space efficiency.</p>
              <code className="block p-2 bg-slate-900 text-emerald-400 text-xs font-mono rounded-md">
                [Sales Units] / [Facing Count]
              </code>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <div className="font-bold text-slate-800 text-sm">Revenue Density ($/f)</div>
              <p className="text-xs text-slate-500">Weekly monetary generation rate per horizontal shelf facing footprint.</p>
              <code className="block p-2 bg-slate-900 text-emerald-400 text-xs font-mono rounded-md">
                [Revenue] / [Facing Count]
              </code>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <div className="font-bold text-slate-800 text-sm">Traffic Conversion Rate (%)</div>
              <p className="text-xs text-slate-500">Measures the efficiency of turning physical aisle traffic footsteps into real sales transactions.</p>
              <code className="block p-2 bg-slate-900 text-emerald-400 text-xs font-mono rounded-md">
                ([Sales Units] / [Weekly Foot Traffic]) * 100
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
