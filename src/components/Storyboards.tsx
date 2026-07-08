import React, { useState, useMemo } from 'react';
import { ProductPlacement, StoryScene } from '../types';
import { STORY_SCENES } from '../data';
import { ChevronRight, ChevronLeft, Lightbulb, BookOpen, Layers, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line } from 'recharts';

interface StoryboardsProps {
  products: ProductPlacement[];
}

export default function Storyboards({ products }: StoryboardsProps) {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const activeScene = STORY_SCENES[activeSceneIndex];

  // Calculated shelf heights aggregates
  const shelfStats = useMemo(() => {
    const data: Record<string, { height: string; sales: number; revenue: number; margin: number; count: number }> = {
      'Top Shelf': { height: 'Top Shelf', sales: 0, revenue: 0, margin: 0, count: 0 },
      'Eye Level': { height: 'Eye Level', sales: 0, revenue: 0, margin: 0, count: 0 },
      'Touch Level': { height: 'Touch Level', sales: 0, revenue: 0, margin: 0, count: 0 },
      'Bottom Shelf': { height: 'Bottom Shelf', sales: 0, revenue: 0, margin: 0, count: 0 },
    };

    products.forEach(p => {
      const stats = data[p.shelfHeight];
      if (stats) {
        stats.sales += p.salesUnits;
        stats.revenue += p.revenue;
        const profit = p.revenue - (p.salesUnits * p.unitCost);
        const margin = p.revenue > 0 ? (profit / p.revenue) * 100 : 0;
        stats.margin += margin;
        stats.count += 1;
      }
    });

    return Object.values(data).map(d => ({
      ...d,
      avgMargin: d.count > 0 ? d.margin / d.count : 0
    }));
  }, [products]);

  // Demographic stacks
  const demoStats = useMemo(() => {
    const heights = ['Top Shelf', 'Eye Level', 'Touch Level', 'Bottom Shelf'];
    const dataMap: Record<string, Record<string, number>> = {};
    heights.forEach(h => {
      dataMap[h] = {
        'Families with Kids': 0,
        'Health-conscious Adults': 0,
        'Young Professionals': 0,
        'Seniors': 0,
        'General': 0
      };
    });

    products.forEach(p => {
      if (dataMap[p.shelfHeight] && dataMap[p.shelfHeight][p.demographicTarget] !== undefined) {
        dataMap[p.shelfHeight][p.demographicTarget] += p.salesUnits;
      }
    });

    return heights.map(h => ({
      shelfHeight: h,
      ...dataMap[h]
    }));
  }, [products]);

  // Facings effectiveness stats
  const facingsStats = useMemo(() => {
    // Group products by facing counts
    const map: Record<number, { facings: number; sales: number; revenue: number; count: number }> = {};
    products.forEach(p => {
      const fc = p.facingCount;
      if (!map[fc]) {
        map[fc] = { facings: fc, sales: 0, revenue: 0, count: 0 };
      }
      map[fc].sales += p.salesUnits;
      map[fc].revenue += p.revenue;
      map[fc].count += 1;
    });

    return Object.values(map).map(item => ({
      facings: `${item.facings} Facings`,
      salesPerFacing: item.sales / (item.facings * (item.count || 1)),
      revenuePerFacing: item.revenue / (item.facings * (item.count || 1))
    })).sort((a, b) => a.facings.localeCompare(b.facings));
  }, [products]);

  // Aisle Traffic vs conversion
  const trafficStats = useMemo(() => {
    const locations = Array.from(new Set(products.map(p => p.storeLocation)));
    return locations.map(loc => {
      const items = products.filter(p => p.storeLocation === loc);
      const totalTraffic = items[0]?.weeklyFootTraffic || 3000;
      const totalSales = items.reduce((sum, current) => sum + current.salesUnits, 0);
      const totalRevenue = items.reduce((sum, current) => sum + current.revenue, 0);
      const conversion = (totalSales / totalTraffic) * 100;
      return {
        location: loc,
        traffic: totalTraffic,
        revenue: totalRevenue,
        conversion: Number(conversion.toFixed(1))
      };
    }).sort((a, b) => b.traffic - a.traffic);
  }, [products]);

  const handleNext = () => {
    setActiveSceneIndex(prev => (prev + 1) % STORY_SCENES.length);
  };

  const handlePrev = () => {
    setActiveSceneIndex(prev => (prev - 1 + STORY_SCENES.length) % STORY_SCENES.length);
  };

  return (
    <div className="space-y-6">
      {/* Tableau Story Points Header Navigation */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-display font-semibold text-slate-800">
              Tableau Storybook Workspace
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer transition-colors"
              title="Previous Scene"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-500 font-mono">
              Scene {activeSceneIndex + 1} of {STORY_SCENES.length}
            </span>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer transition-colors"
              title="Next Scene"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Story point navigation blocks */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {STORY_SCENES.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => setActiveSceneIndex(idx)}
              className={`p-3 rounded-lg text-left text-xs transition-all border ${
                activeSceneIndex === idx
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md font-medium translate-y-[-2px]'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100/80 border-slate-200/80'
              }`}
            >
              <div className={`font-semibold truncate ${activeSceneIndex === idx ? 'text-white' : 'text-slate-700'}`}>
                {idx + 1}. {scene.title.split(':')[0]}
              </div>
              <div className={`text-[10px] truncate mt-1 ${activeSceneIndex === idx ? 'text-emerald-100' : 'text-slate-400'}`}>
                {scene.subtitle}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Story Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Narrative Sidecard */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-100 shadow-xs p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800">
                <Lightbulb className="w-3.5 h-3.5" />
                Tableau Story Scene {activeSceneIndex + 1}
              </span>
              <h3 className="text-xl font-display font-bold text-slate-800 mt-3 tracking-tight">
                {activeScene.title}
              </h3>
              <p className="text-xs font-medium text-slate-400 font-mono mt-0.5 uppercase tracking-wider">
                {activeScene.subtitle}
              </p>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {activeScene.description}
            </p>

            <div className="border-t border-dashed border-slate-100 pt-4 space-y-3.5">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Analytical Notes</h4>
              {activeScene.narrativePoints.map((pt, index) => (
                <div key={index} className="flex gap-2.5 items-start text-xs text-slate-600">
                  <div className="mt-0.5 p-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <p className="leading-normal">{pt}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 italic">Story points synced with DB</span>
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-800 cursor-pointer"
            >
              Next Story Point
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Stage */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-xs p-6 flex flex-col justify-center">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-700 font-display flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              Interactive Story Worksheet
            </h4>
            <span className="text-[10px] font-mono text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded-sm">
              Visual: {activeScene.visualType}
            </span>
          </div>

          <div className="h-96 w-full flex items-center justify-center">
            {/* Visualizer Router */}
            {activeScene.visualType === 'shelf-height' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shelfStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="height" stroke="#94a3b8" fontSize={11} />
                  <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} />
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} unit="%" />
                  <Tooltip contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar yAxisId="left" dataKey="revenue" name="Weekly Revenue ($)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="left" dataKey="sales" name="Weekly Sales (Units)" fill="#047857" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="avgMargin" name="Avg Margin (%)" stroke="#d97706" strokeWidth={2.5} dot={{ r: 4 }} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeScene.visualType === 'demographic-impulse' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demoStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="shelfHeight" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Families with Kids" name="Kids Families" stackId="a" fill="#10b981" />
                  <Bar dataKey="Health-conscious Adults" name="Health-Conscious" stackId="a" fill="#047857" />
                  <Bar dataKey="Young Professionals" name="Young Professionals" stackId="a" fill="#059669" />
                  <Bar dataKey="Seniors" name="Seniors" stackId="a" fill="#34d399" />
                  <Bar dataKey="General" name="General" stackId="a" fill="#a7f3d0" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeScene.visualType === 'facings-roi' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={facingsStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="facings" stroke="#94a3b8" fontSize={11} />
                  <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} name="Units" />
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} name="Revenue" unit="$" />
                  <Tooltip contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar yAxisId="left" dataKey="salesPerFacing" name="Sales per Facing (Units)" fill="#34d399" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="revenuePerFacing" name="Revenue per Facing ($)" fill="#047857" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeScene.visualType === 'traffic-correlation' && (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trafficStats} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="location" stroke="#94a3b8" fontSize={11} />
                  <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} name="Revenue" />
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} name="Conversion" unit="%" />
                  <Tooltip contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar yAxisId="left" dataKey="revenue" name="Total Revenue ($)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="conversion" name="Conversion Rate (%)" stroke="#d97706" strokeWidth={2.5} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            )}

            {activeScene.visualType === 'ai-planogram' && (
              <div className="w-full h-full flex flex-col justify-center items-center p-6 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-center max-w-md space-y-4">
                  <div className="p-3 bg-emerald-100 text-emerald-800 rounded-full inline-block animate-bounce">
                    <Lightbulb className="w-8 h-8" />
                  </div>
                  <h5 className="font-display font-semibold text-slate-800">
                    AI-Optimized Retail Planogram Draft
                  </h5>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Visual planograms are best reviewed in the dedicated shelf editor tab. This story scene recommends rearranging the physical shelf facings using our real-time visual sandbox to maximize vertical conversion rates.
                  </p>
                  <div className="border border-emerald-100 bg-emerald-50/50 p-3.5 rounded-lg text-emerald-800 text-xs font-mono text-left space-y-1">
                    <div>[Eye Level] &rarr; Baby Formula, Truffle Chips</div>
                    <div>[Touch Level] &rarr; Sugar Loops Cereal, Cheese Puffs</div>
                    <div>[Top Shelf] &rarr; Premium ancient grains & seeds</div>
                    <div>[Bottom Shelf] &rarr; Gallon staples, bulk diapers</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
