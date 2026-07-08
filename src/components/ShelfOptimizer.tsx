import React, { useState } from 'react';
import { ProductPlacement } from '../types';
import { Sparkles, HelpCircle, ArrowUp, ArrowDown, ChevronRight, MessageSquare, ListRestart, AlertCircle } from 'lucide-react';

interface ShelfOptimizerProps {
  products: ProductPlacement[];
  onAddProduct: (prod: ProductPlacement) => Promise<void>;
  onAnalyzeShelf: (query: string) => Promise<string>;
}

export default function ShelfOptimizer({
  products,
  onAddProduct,
  onAnalyzeShelf
}: ShelfOptimizerProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [customQuery, setCustomQuery] = useState('');
  
  // Shelf editing state
  const [selectedProduct, setSelectedProduct] = useState<ProductPlacement | null>(null);
  const [editHeight, setEditHeight] = useState<ProductPlacement['shelfHeight']>('Eye Level');
  const [editFacings, setEditFacings] = useState(2);

  // Group products by shelf
  const shelves: Record<ProductPlacement['shelfHeight'], ProductPlacement[]> = {
    'Top Shelf': products.filter(p => p.shelfHeight === 'Top Shelf'),
    'Eye Level': products.filter(p => p.shelfHeight === 'Eye Level'),
    'Touch Level': products.filter(p => p.shelfHeight === 'Touch Level'),
    'Bottom Shelf': products.filter(p => p.shelfHeight === 'Bottom Shelf')
  };

  const heightsList: ProductPlacement['shelfHeight'][] = ['Top Shelf', 'Eye Level', 'Touch Level', 'Bottom Shelf'];

  const handleProductSelect = (p: ProductPlacement) => {
    setSelectedProduct(p);
    setEditHeight(p.shelfHeight);
    setEditFacings(p.facingCount);
  };

  const handleSaveProductEdit = async () => {
    if (!selectedProduct) return;
    const updated: ProductPlacement = {
      ...selectedProduct,
      shelfHeight: editHeight,
      facingCount: editFacings
    };
    await onAddProduct(updated);
    setSelectedProduct(null);
  };

  const handleAiAnalysis = async (queryText?: string) => {
    setAnalyzing(true);
    setAiReport(null);
    try {
      const report = await onAnalyzeShelf(queryText || customQuery);
      setAiReport(report);
    } catch (err) {
      console.error(err);
      setAiReport('Failed to compile report. Please verify your connection status.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 4-Tier Shelf Interactive Wireframe */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-display font-semibold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Planogram Sandbox Visualizer
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Visualizing the physical 4-Tier Gondola Shelf. Click a product block to adjust shelving level or horizontal facings.
              </p>
            </div>
          </div>

          {/* Gondola Shelf Display */}
          <div className="bg-slate-800 p-6 rounded-2xl shadow-inner border-t-8 border-slate-700 relative space-y-10">
            {heightsList.map((h) => {
              const shelfProducts = shelves[h];
              return (
                <div key={h} className="relative space-y-1.5">
                  {/* Shelf Metadata */}
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                    <span>{h}</span>
                    <span className="font-mono text-slate-500">
                      {h === 'Top Shelf' ? 'Height: ~5.5 ft' :
                       h === 'Eye Level' ? 'Height: ~4.5 ft (Golden Zone)' :
                       h === 'Touch Level' ? 'Height: ~2.5 ft (Kids Zone)' :
                       'Height: ~1.0 ft (Value Shelf)'}
                    </span>
                  </div>

                  {/* Physical Shelf base plank */}
                  <div className="min-h-16 w-full bg-slate-700/50 rounded-lg p-2 flex items-end gap-2 overflow-x-auto border-b-4 border-slate-600 shadow-lg">
                    {shelfProducts.length === 0 ? (
                      <div className="w-full text-center text-xs text-slate-500 italic py-2">
                        Empty shelf layer
                      </div>
                    ) : (
                      shelfProducts.map((p) => {
                        // Color based on category
                        const catColor = p.category === 'Cereal' ? 'bg-amber-100 text-amber-900 border-amber-200' :
                                         p.category === 'Snacks' ? 'bg-orange-100 text-orange-900 border-orange-200' :
                                         p.category === 'Dairy' ? 'bg-blue-100 text-blue-900 border-blue-200' :
                                         p.category === 'Baby Care' ? 'bg-purple-100 text-purple-900 border-purple-200' :
                                         'bg-emerald-100 text-emerald-900 border-emerald-200';

                        // Dynamic width based on facing counts
                        const widthPx = 70 + (p.facingCount * 22);

                        return (
                          <button
                            key={p.id}
                            onClick={() => handleProductSelect(p)}
                            style={{ minWidth: `${widthPx}px` }}
                            className={`h-12 border rounded-md p-1 text-left flex flex-col justify-between transition-all hover:scale-[1.03] cursor-pointer hover:shadow-md ${catColor} ${
                              selectedProduct?.id === p.id ? 'ring-2 ring-emerald-500 ring-offset-2 scale-[1.03]' : ''
                            }`}
                          >
                            <div className="text-[10px] font-bold truncate tracking-tight">{p.productName}</div>
                            <div className="flex justify-between items-center text-[9px] font-mono opacity-80 mt-0.5 font-bold">
                              <span>{p.facingCount} Facings</span>
                              <span>${p.unitPrice.toFixed(2)}</span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Product Editing Widget */}
        {selectedProduct && (
          <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-5 space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-semibold text-emerald-900 text-sm">
                Rearranging Product: <span className="font-bold underline">{selectedProduct.productName}</span>
              </h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-800 mb-1">Move to Shelf Height</label>
                <select
                  value={editHeight}
                  onChange={e => setEditHeight(e.target.value as any)}
                  className="w-full text-xs px-3 py-1.5 bg-white border border-emerald-200 rounded-lg text-slate-800 focus:outline-hidden"
                >
                  <option value="Top Shelf">Top Shelf</option>
                  <option value="Eye Level">Eye Level</option>
                  <option value="Touch Level">Touch Level</option>
                  <option value="Bottom Shelf">Bottom Shelf</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-800 mb-1">Set Facings Footprint ({editFacings})</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditFacings(f => Math.max(1, f - 1))}
                    className="p-1 px-2.5 bg-white hover:bg-slate-100 border border-emerald-200 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono text-sm font-bold text-slate-800 w-8 text-center">{editFacings}</span>
                  <button
                    type="button"
                    onClick={() => setEditFacings(f => Math.min(5, f + 1))}
                    className="p-1 px-2.5 bg-white hover:bg-slate-100 border border-emerald-200 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={handleSaveProductEdit}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Commit Placement Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AI Strategist Recommendations Column */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-emerald-600" />
            <h3 className="font-display font-semibold text-slate-800">
              AI Merchandising Consultant
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Get instant strategic review scorecards, pricing audits, and physical layout recommendations based on your active planogram configuration.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Custom Consulting Query (Optional)</label>
              <input
                type="text"
                value={customQuery}
                onChange={e => setCustomQuery(e.target.value)}
                placeholder="e.g. How do I improve household margins?"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden text-slate-800"
              />
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleAiAnalysis()}
                disabled={analyzing}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${analyzing ? 'animate-pulse' : ''}`} />
                {analyzing ? 'Consulting Gemini...' : 'Analyze Active Shelf Configuration'}
              </button>
              
              <button
                onClick={() => handleAiAnalysis('Conduct a strategic pricing audit and recommend items to increase facings.')}
                disabled={analyzing}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-xs font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Run Pricing Audit & Facings Advice
              </button>
            </div>
          </div>
        </div>

        {/* AI response box */}
        {aiReport && (
          <div className="bg-slate-900 text-slate-100 rounded-xl p-5 shadow-lg border border-slate-800 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                Gemini Merchandising Report
              </div>
              <button
                onClick={() => setAiReport(null)}
                className="text-slate-500 hover:text-slate-300 text-xs"
              >
                Dismiss
              </button>
            </div>
            
            <div className="text-xs space-y-2 max-h-96 overflow-y-auto pr-1 leading-relaxed font-sans text-slate-200">
              {aiReport.split('\n\n').map((paragraph, idx) => {
                // Renders headers nicely
                if (paragraph.startsWith('###') || paragraph.startsWith('##') || paragraph.startsWith('1.') || paragraph.startsWith('2.') || paragraph.startsWith('3.')) {
                  return <h4 key={idx} className="font-semibold text-slate-100 border-l-2 border-emerald-500 pl-2 mt-3">{paragraph.replace(/[#*]/g, '')}</h4>;
                }
                return <p key={idx}>{paragraph.replace(/[*_]/g, '')}</p>;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
