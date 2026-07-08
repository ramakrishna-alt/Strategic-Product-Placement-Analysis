import React, { useState } from 'react';
import { ProductPlacement, DatabaseConnection } from '../types';
import { Database, RefreshCw, Layers, CheckCircle, AlertCircle, FileSpreadsheet, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

interface DatabaseConnectorProps {
  products: ProductPlacement[];
  connections: DatabaseConnection[];
  onSyncConnection: (id: string) => Promise<void>;
  onRunDataPrep: () => Promise<void>;
  onAddProduct: (prod: ProductPlacement) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onResetData: () => Promise<void>;
}

export default function DatabaseConnector({
  products,
  connections,
  onSyncConnection,
  onRunDataPrep,
  onAddProduct,
  onDeleteProduct,
  onResetData
}: DatabaseConnectorProps) {
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [prepping, setPrepping] = useState(false);
  const [prepSuccess, setPrepSuccess] = useState(false);

  // Form State for manual placement addition
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<Partial<ProductPlacement>>({
    productName: '',
    category: 'Cereal',
    shelfHeight: 'Eye Level',
    facingCount: 2,
    salesUnits: 150,
    unitCost: 1.5,
    unitPrice: 4.99,
    competitorPrice: 5.19,
    storeLocation: 'Middle Aisle',
    demographicTarget: 'General',
    weeklyFootTraffic: 4000
  });

  const handleSync = async (id: string) => {
    setSyncingId(id);
    await onSyncConnection(id);
    setSyncingId(null);
  };

  const handlePrep = async () => {
    setPrepping(true);
    await onRunDataPrep();
    setPrepping(false);
    setPrepSuccess(true);
    setTimeout(() => setPrepSuccess(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.productName) return;
    
    const revenue = (formState.salesUnits || 0) * (formState.unitPrice || 0);
    const prod: ProductPlacement = {
      id: editingId || undefined,
      productName: formState.productName,
      category: formState.category || 'Cereal',
      shelfHeight: (formState.shelfHeight as any) || 'Eye Level',
      facingCount: Number(formState.facingCount) || 2,
      salesUnits: Number(formState.salesUnits) || 0,
      revenue: Number(revenue.toFixed(2)),
      unitCost: Number(formState.unitCost) || 0,
      unitPrice: Number(formState.unitPrice) || 0,
      competitorPrice: Number(formState.competitorPrice) || Number(formState.unitPrice) || 0,
      storeLocation: (formState.storeLocation as any) || 'Middle Aisle',
      demographicTarget: (formState.demographicTarget as any) || 'General',
      weeklyFootTraffic: Number(formState.weeklyFootTraffic) || 3000
    } as any;

    await onAddProduct(prod);
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormState({
      productName: '',
      category: 'Cereal',
      shelfHeight: 'Eye Level',
      facingCount: 2,
      salesUnits: 150,
      unitCost: 1.5,
      unitPrice: 4.99,
      competitorPrice: 5.19,
      storeLocation: 'Middle Aisle',
      demographicTarget: 'General',
      weeklyFootTraffic: 4000
    });
  };

  const handleEdit = (prod: ProductPlacement) => {
    setEditingId(prod.id);
    setFormState(prod);
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      {/* DB Connectors Row */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-display font-semibold text-slate-800 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" />
              Tableau Data Source Integrator
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Extract and connect transactional sales and planogram databases directly into your BI workspace.
            </p>
          </div>
          <button
            onClick={onResetData}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer self-start md:self-auto"
          >
            Reset Database to Defaults
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {connections.map((conn) => (
            <div 
              key={conn.id} 
              className={`p-4 rounded-xl border transition-all ${
                conn.status === 'connected' 
                  ? 'bg-emerald-50/40 border-emerald-100' 
                  : 'bg-slate-50/50 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    conn.status === 'connected' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800 text-sm">{conn.name}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{conn.type}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  conn.status === 'connected' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-slate-200 text-slate-800'
                }`}>
                  {conn.status === 'connected' ? (
                    <>
                      <CheckCircle className="w-3 h-3" />
                      Connected
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3" />
                      Disconnected
                    </>
                  )}
                </span>
              </div>

              {conn.host && (
                <div className="mt-3 pt-3 border-t border-dashed border-slate-200/60 text-xs font-mono text-slate-500 space-y-1">
                  <div><span className="text-slate-400">Host:</span> {conn.host}</div>
                  <div><span className="text-slate-400">Schema:</span> {conn.database}</div>
                  <div><span className="text-slate-400">Last Sync:</span> {conn.lastSync}</div>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleSync(conn.id)}
                  disabled={syncingId === conn.id}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingId === conn.id ? 'animate-spin text-emerald-600' : ''}`} />
                  {conn.status === 'connected' ? 'Sync Data' : 'Extract Connection'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Preparation Panel */}
      <div className="bg-linear-to-r from-emerald-900 to-slate-900 text-white rounded-xl shadow-xs p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-xl font-display font-semibold flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Automated Data Preparation & Hygiene Pipeline
            </h2>
            <p className="text-sm text-emerald-100/80">
              Before visualization, raw retail datasets require transformation. Trigger the hygiene routine to strip text whitespaces, validate currency precision, handle negative outliers, and flag duplicates.
            </p>
          </div>
          <button
            onClick={handlePrep}
            disabled={prepping}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 cursor-pointer self-start md:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${prepping ? 'animate-spin' : ''}`} />
            {prepping ? 'Running Prep...' : 'Run Data Prep Pipeline'}
          </button>
        </div>

        {prepSuccess && (
          <div className="mt-4 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-emerald-200 text-xs flex items-center gap-2 animate-pulse">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Data Preparation Complete: Cleaned 20 records. Outliers handled, spacing trimmed, and formulas re-calibrated.
          </div>
        )}
      </div>

      {/* Data Collection Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-display font-semibold text-slate-800 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              Active Product Placement Dataset
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Add new shelving coordinates or modify values. Updates propagate instantly to the Tableau workspace.
            </p>
          </div>
          {!isAdding && (
            <button
              onClick={() => {
                resetForm();
                setIsAdding(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Add Product Record
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <form onSubmit={handleSubmit} className="mb-8 p-5 bg-slate-50/70 rounded-xl border border-slate-200/80 animate-fadeIn">
            <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-600" />
              {editingId ? 'Edit Product Coordinates' : 'Ingest New Shelf Coordinate'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={formState.productName || ''}
                  onChange={e => setFormState(prev => ({ ...prev, productName: e.target.value }))}
                  placeholder="e.g., Ultra Berry Cereal Pack"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
                <select
                  value={formState.category}
                  onChange={e => setFormState(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-500 text-slate-800"
                >
                  <option value="Clothing">Clothing</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Food">Food</option>
                  <option value="Cereal">Cereal</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Baby Care">Baby Care</option>
                  <option value="Household">Household</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Shelf Height Placement</label>
                <select
                  value={formState.shelfHeight}
                  onChange={e => setFormState(prev => ({ ...prev, shelfHeight: e.target.value as any }))}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-500 text-slate-800"
                >
                  <option value="Top Shelf">Top Shelf (Premium/Specialty)</option>
                  <option value="Eye Level">Eye Level (High Velocity)</option>
                  <option value="Touch Level">Touch Level (Impulse/Kids)</option>
                  <option value="Bottom Shelf">Bottom Shelf (Bulk/Value)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Store Location</label>
                <select
                  value={formState.storeLocation}
                  onChange={e => setFormState(prev => ({ ...prev, storeLocation: e.target.value as any }))}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-500 text-slate-800"
                >
                  <option value="Front Aisle">Front Aisle</option>
                  <option value="Middle Aisle">Middle Aisle</option>
                  <option value="Back Wall">Back Wall</option>
                  <option value="Endcap">Endcap</option>
                  <option value="Checkout Queue">Checkout Queue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Facing Count (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={formState.facingCount || 1}
                  onChange={e => setFormState(prev => ({ ...prev, facingCount: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Weekly Units Sold</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formState.salesUnits ?? ''}
                  onChange={e => setFormState(prev => ({ ...prev, salesUnits: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Unit Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formState.unitCost ?? ''}
                  onChange={e => setFormState(prev => ({ ...prev, unitCost: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Unit Selling Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formState.unitPrice ?? ''}
                  onChange={e => setFormState(prev => ({ ...prev, unitPrice: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Competitor Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formState.competitorPrice ?? ''}
                  onChange={e => setFormState(prev => ({ ...prev, competitorPrice: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Target Demographic</label>
                <select
                  value={formState.demographicTarget}
                  onChange={e => setFormState(prev => ({ ...prev, demographicTarget: e.target.value as any }))}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-500 text-slate-800"
                >
                  <option value="Families">Families</option>
                  <option value="Seniors">Seniors</option>
                  <option value="Young adults">Young adults</option>
                  <option value="College students">College students</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  resetForm();
                }}
                className="px-4 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                {editingId ? 'Save Edits' : 'Commit New Record'}
              </button>
            </div>
          </form>
        )}

        {/* Dataset Table view */}
        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Shelf Height</th>
                <th className="px-4 py-3 text-center">Facings</th>
                <th className="px-4 py-3 text-right">Units Sold</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right text-slate-500 font-medium">Comp Price</th>
                <th className="px-4 py-3 text-right">Cost</th>
                <th className="px-4 py-3 text-right">Revenue</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => {
                const profitVal = p.revenue - (p.salesUnits * p.unitCost);
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-3.5">
                      <div>
                        <div className="font-medium text-slate-800">{p.productName}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{p.id}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                        p.shelfHeight === 'Eye Level' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        p.shelfHeight === 'Touch Level' ? 'bg-blue-50 text-blue-700' :
                        p.shelfHeight === 'Top Shelf' ? 'bg-amber-50 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {p.shelfHeight}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono font-medium">{p.facingCount}</td>
                    <td className="px-4 py-3.5 text-right font-mono font-medium">{p.salesUnits}</td>
                    <td className="px-4 py-3.5 text-right font-mono">${p.unitPrice.toFixed(2)}</td>
                    <td className="px-4 py-3.5 text-right font-mono text-slate-500">${(p.competitorPrice !== undefined ? p.competitorPrice : p.unitPrice).toFixed(2)}</td>
                    <td className="px-4 py-3.5 text-right font-mono text-slate-400">${p.unitCost.toFixed(2)}</td>
                    <td className="px-4 py-3.5 text-right font-mono font-semibold text-slate-800">${p.revenue.toFixed(2)}</td>
                    <td className="px-4 py-3.5 text-xs font-medium text-slate-500">{p.storeLocation}</td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-sm transition-colors cursor-pointer"
                          title="Edit Placement"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors cursor-pointer"
                          title="Delete Placement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
