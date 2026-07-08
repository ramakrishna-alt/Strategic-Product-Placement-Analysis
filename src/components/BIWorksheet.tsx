import React, { useState, useMemo } from 'react';
import { ProductPlacement, CalculatedField } from '../types';
import { evaluateCalculatedField } from '../data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis, LineChart, Line, ComposedChart } from 'recharts';
import { Filter, Layers, BarChart3, TrendingUp, DollarSign, Activity, Percent, ArrowUpRight } from 'lucide-react';

interface BIWorksheetProps {
  products: ProductPlacement[];
  calculatedFields: CalculatedField[];
  selectedCalculatedFieldId: string | null;
  onSelectCalculatedField: (id: string) => void;
}

export default function BIWorksheet({
  products,
  calculatedFields,
  selectedCalculatedFieldId,
  onSelectCalculatedField
}: BIWorksheetProps) {
  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedHeights, setSelectedHeights] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  // Category list, Shelf Height list, Store Location list
  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))), [products]);
  const shelfHeights = ['Top Shelf', 'Eye Level', 'Touch Level', 'Bottom Shelf'];
  const locations = useMemo(() => Array.from(new Set(products.map(p => p.storeLocation))), [products]);

  // Active Calculated Field
  const activeCalcField = useMemo(() => {
    return calculatedFields.find(f => f.id === selectedCalculatedFieldId) || null;
  }, [calculatedFields, selectedCalculatedFieldId]);

  // Filter Toggle Helpers
  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const toggleHeight = (h: string) => {
    setSelectedHeights(prev => prev.includes(h) ? prev.filter(item => item !== h) : [...prev, h]);
  };

  const toggleLocation = (loc: string) => {
    setSelectedLocations(prev => prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedHeights([]);
    setSelectedLocations([]);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
      if (selectedHeights.length > 0 && !selectedHeights.includes(p.shelfHeight)) return false;
      if (selectedLocations.length > 0 && !selectedLocations.includes(p.storeLocation)) return false;
      return true;
    });
  }, [products, selectedCategories, selectedHeights, selectedLocations]);

  // Real-time BI KPI aggregates
  const kpis = useMemo(() => {
    let revenue = 0;
    let costOfGoods = 0;
    let units = 0;
    let totalFootTraffic = 0;

    filteredProducts.forEach(p => {
      revenue += p.revenue;
      costOfGoods += (p.salesUnits * p.unitCost);
      units += p.salesUnits;
      totalFootTraffic += p.weeklyFootTraffic;
    });

    const profit = revenue - costOfGoods;
    const avgMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const conversion = totalFootTraffic > 0 ? (units / totalFootTraffic) * 100 : 0;

    return {
      revenue,
      profit,
      units,
      avgMargin,
      conversion
    };
  }, [filteredProducts]);

  // Visual 1: Aggregated Revenue & Profit by Shelf Height
  const shelfHeightChartData = useMemo(() => {
    const map: Record<string, { height: string; revenue: number; profit: number; count: number }> = {
      'Top Shelf': { height: 'Top Shelf', revenue: 0, profit: 0, count: 0 },
      'Eye Level': { height: 'Eye Level', revenue: 0, profit: 0, count: 0 },
      'Touch Level': { height: 'Touch Level', revenue: 0, profit: 0, count: 0 },
      'Bottom Shelf': { height: 'Bottom Shelf', revenue: 0, profit: 0, count: 0 }
    };

    filteredProducts.forEach(p => {
      if (map[p.shelfHeight]) {
        map[p.shelfHeight].revenue += p.revenue;
        map[p.shelfHeight].profit += (p.revenue - (p.salesUnits * p.unitCost));
        map[p.shelfHeight].count += 1;
      }
    });

    return Object.values(map);
  }, [filteredProducts]);

  // Visual 2: scatter plot mapping Unit Price (X) vs Sales Units (Y) sized by revenue, colored by category
  const scatterChartData = useMemo(() => {
    return filteredProducts.map(p => ({
      name: p.productName,
      price: p.unitPrice,
      unitsSold: p.salesUnits,
      revenue: p.revenue,
      category: p.category
    }));
  }, [filteredProducts]);

  // Visual 3: Demographic Targeted Sales Units (Stacked Bar)
  const demographicChartData = useMemo(() => {
    const demos = ['Families', 'Seniors', 'Young adults', 'College students', 'General'];
    const map: Record<string, Record<string, number>> = {};
    
    // Initialize heights
    shelfHeights.forEach(h => {
      map[h] = {};
      demos.forEach(d => {
        map[h][d] = 0;
      });
    });

    filteredProducts.forEach(p => {
      if (map[p.shelfHeight] && map[p.shelfHeight][p.demographicTarget] !== undefined) {
        map[p.shelfHeight][p.demographicTarget] += p.salesUnits;
      }
    });

    return shelfHeights.map(h => ({
      shelfHeight: h,
      ...map[h]
    }));
  }, [filteredProducts]);

  // Visual 4: Foot Traffic vs Sales units (Linear Correlation)
  const trafficCorrelationData = useMemo(() => {
    const map: Record<string, { location: string; traffic: number; sales: number; revenue: number }> = {};
    
    filteredProducts.forEach(p => {
      if (!map[p.storeLocation]) {
        map[p.storeLocation] = { location: p.storeLocation, traffic: p.weeklyFootTraffic, sales: 0, revenue: 0 };
      }
      map[p.storeLocation].sales += p.salesUnits;
      map[p.storeLocation].revenue += p.revenue;
    });

    return Object.values(map).sort((a, b) => b.traffic - a.traffic);
  }, [filteredProducts]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Filters Sidebar */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-5 space-y-6 xl:col-span-1">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-display font-semibold text-slate-800 flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-600" />
            Interactive Filters
          </h3>
          {(selectedCategories.length > 0 || selectedHeights.length > 0 || selectedLocations.length > 0) && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-emerald-600 hover:text-emerald-800 font-medium transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Category</h4>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {categories.map(cat => {
              const active = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1 text-xs rounded-full font-medium transition-all cursor-pointer ${
                    active 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Shelf Height Filters */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Vertical Shelf Position</h4>
          <div className="space-y-1.5 pt-1">
            {shelfHeights.map(h => {
              const active = selectedHeights.includes(h);
              return (
                <label key={h} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleHeight(h)}
                    className="w-4 h-4 rounded-sm border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className={`transition-colors ${active ? 'text-slate-900 font-medium' : 'text-slate-500 group-hover:text-slate-800'}`}>
                    {h}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Store Location Filters */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Store Location</h4>
          <div className="space-y-1.5 pt-1">
            {locations.map(loc => {
              const active = selectedLocations.includes(loc);
              return (
                <label key={loc} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleLocation(loc)}
                    className="w-4 h-4 rounded-sm border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className={`transition-colors ${active ? 'text-slate-900 font-medium' : 'text-slate-500 group-hover:text-slate-800'}`}>
                    {loc}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Calculated Field Selection */}
        <div className="border-t border-slate-100 pt-5 space-y-3">
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              Calculated Measures
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Toggle dynamic calculated variables on active visuals.</p>
          </div>
          <div className="space-y-1.5">
            {calculatedFields.map(f => (
              <button
                key={f.id}
                onClick={() => onSelectCalculatedField(f.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                  selectedCalculatedFieldId === f.id
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className="font-semibold">{f.name}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{f.expression}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Dashboard Panel */}
      <div className="xl:col-span-3 space-y-6">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-3">
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-lg font-bold text-slate-800 font-mono mt-0.5">
                ${kpis.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-3">
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Gross Profit</p>
              <h3 className="text-lg font-bold text-slate-800 font-mono mt-0.5">
                ${kpis.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-3">
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Margin</p>
              <h3 className="text-lg font-bold text-slate-800 font-mono mt-0.5">
                {kpis.avgMargin.toFixed(1)}%
              </h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-3">
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Weekly Volume</p>
              <h3 className="text-lg font-bold text-slate-800 font-mono mt-0.5">
                {kpis.units.toLocaleString()} units
              </h3>
            </div>
          </div>
        </div>

        {/* Dynamic Calculated Measure Alert */}
        {activeCalcField && (
          <div className="bg-emerald-50 border border-emerald-100/80 rounded-xl p-4 flex items-center justify-between text-emerald-800 text-xs">
            <div>
              <span className="font-semibold uppercase tracking-wider text-[10px] text-emerald-600">Active Calculated Measure:</span>
              <span className="ml-2 font-bold text-slate-800">{activeCalcField.name}</span>
              <span className="ml-2 italic text-slate-500">({activeCalcField.description})</span>
            </div>
            <div className="font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-sm font-semibold">{activeCalcField.expression}</div>
          </div>
        )}

        {/* Visualizations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Revenue vs Profit by Shelf Height */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-slate-800 font-display flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                Shelf Height Revenue & Gross Profit
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Measure: Sum of $</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shelfHeightChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="height" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip 
                    formatter={(value: any) => [`$${value.toFixed(2)}`]}
                    contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" name="Gross Profit" fill="#047857" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Product Price vs Sales Units Scatter */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-slate-800 font-display flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Price Elasticity & Sales Velocity
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Y: Units, X: Price</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" dataKey="price" name="Unit Price" unit="$" stroke="#94a3b8" fontSize={11} />
                  <YAxis type="number" dataKey="unitsSold" name="Units Sold" unit="u" stroke="#94a3b8" fontSize={11} />
                  <ZAxis type="number" dataKey="revenue" range={[60, 400]} name="Weekly Revenue" unit="$" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    formatter={(value: any, name: any) => {
                      if (name === 'Unit Price') return [`$${value}`, name];
                      if (name === 'Weekly Revenue') return [`$${value.toFixed(2)}`, name];
                      return [value, name];
                    }}
                  />
                  <Scatter name="Placements" data={scatterChartData} fill="#10b981" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Demographic Sales Unit Share (Stacked Bar) */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-slate-800 font-display flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                Height Demographics Targeting Index
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Unit sales segmented</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demographicChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="shelfHeight" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="Families" name="Families" stackId="a" fill="#10b981" />
                  <Bar dataKey="Seniors" name="Seniors" stackId="a" fill="#047857" />
                  <Bar dataKey="Young adults" name="Young adults" stackId="a" fill="#059669" />
                  <Bar dataKey="College students" name="College students" stackId="a" fill="#34d399" />
                  <Bar dataKey="General" name="General" stackId="a" fill="#a7f3d0" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Foot Traffic Correlation (Composed Line & Bar) */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-slate-800 font-display flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                Aisle Traffic & Revenue Yield Correlation
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Dynamic location analysis</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trafficCorrelationData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="location" stroke="#94a3b8" fontSize={10} />
                  <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} />
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar yAxisId="left" dataKey="revenue" name="Total Revenue ($)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="traffic" name="Foot Traffic (Weekly)" stroke="#047857" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Selected Calculated Field Table Output */}
        {activeCalcField && (
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-slate-800 font-display flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                Live Custom Field Evaluation Table: {activeCalcField.name}
              </h4>
              <span className="text-xs text-slate-500 font-mono italic">Evaluated on active products</span>
            </div>
            <div className="overflow-x-auto border border-slate-100 rounded-lg">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 font-semibold text-slate-500">
                  <tr>
                    <th className="px-4 py-2">Product Name</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Shelf Height</th>
                    <th className="px-4 py-2 text-right">Revenue</th>
                    <th className="px-4 py-2 text-right">Weekly Units</th>
                    <th className="px-4 py-2 text-right text-emerald-700 font-bold bg-emerald-50/50">Computed value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.slice(0, 8).map(p => {
                    const value = evaluateCalculatedField(activeCalcField, p);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2.5 font-medium">{p.productName}</td>
                        <td className="px-4 py-2.5">{p.category}</td>
                        <td className="px-4 py-2.5 text-slate-500">{p.shelfHeight}</td>
                        <td className="px-4 py-2.5 text-right font-mono">${p.revenue.toFixed(2)}</td>
                        <td className="px-4 py-2.5 text-right font-mono">{p.salesUnits}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-emerald-800 font-bold bg-emerald-50/20">
                          {activeCalcField.id === 'calc-1' || activeCalcField.id === 'calc-4' ? `${value.toFixed(1)}%` : 
                           activeCalcField.id === 'calc-2' ? `${value.toFixed(1)} units/f` : 
                           `$${value.toFixed(2)}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
