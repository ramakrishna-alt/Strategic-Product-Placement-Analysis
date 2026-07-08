import React, { useState, useEffect } from 'react';
import { ProductPlacement, DatabaseConnection, CalculatedField } from './types';
import DatabaseConnector from './components/DatabaseConnector';
import BIWorksheet from './components/BIWorksheet';
import Storyboards from './components/Storyboards';
import CalculatedFields from './components/CalculatedFields';
import ShelfOptimizer from './components/ShelfOptimizer';
import ProjectDocs from './components/ProjectDocs';
import { Database, LayoutDashboard, BookOpen, Layers, Sparkles, HelpCircle, RefreshCw, BarChart2 } from 'lucide-react';

type TabType = 'data-source' | 'dashboard' | 'story' | 'calc-fields' | 'planogram' | 'docs';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [products, setProducts] = useState<ProductPlacement[]>([]);
  const [connections, setConnections] = useState<DatabaseConnection[]>([]);
  const [calculatedFields, setCalculatedFields] = useState<CalculatedField[]>([]);
  
  // Active dynamic calculated field id to overlay on the dashboard
  const [selectedCalculatedFieldId, setSelectedCalculatedFieldId] = useState<string | null>('calc-1');
  const [loading, setLoading] = useState(true);

  // Sync / fetch data from Express backend endpoints
  const fetchAllData = async () => {
    try {
      const [resProd, resConn, resCalc] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/connections'),
        fetch('/api/calculated-fields')
      ]);

      if (resProd.ok && resConn.ok && resCalc.ok) {
        const prodData = await resProd.json();
        const connData = await resConn.json();
        const calcData = await resCalc.json();
        setProducts(prodData);
        setConnections(connData);
        setCalculatedFields(calcData);
      }
    } catch (err) {
      console.error('Failed to sync BI server data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Endpoint triggers
  const handleSyncConnection = async (id: string) => {
    try {
      const res = await fetch(`/api/connections/sync/${id}`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setConnections(prev => prev.map(c => c.id === id ? data.connection : c));
        setProducts(data.products);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunDataPrep = async () => {
    try {
      const res = await fetch('/api/products/prepare', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = async (prod: ProductPlacement) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prod)
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetData = async () => {
    try {
      const res = await fetch('/api/products/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCalculatedField = async (field: CalculatedField) => {
    try {
      const res = await fetch('/api/calculated-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(field)
      });
      if (res.ok) {
        const data = await res.json();
        setCalculatedFields(data.calculatedFields);
        // Automatically make the newly created calculated field active on dashboards
        const newField = data.calculatedFields[data.calculatedFields.length - 1];
        if (newField) {
          setSelectedCalculatedFieldId(newField.id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCalculatedField = async (id: string) => {
    try {
      const res = await fetch(`/api/calculated-fields/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setCalculatedFields(data.calculatedFields);
        if (selectedCalculatedFieldId === id) {
          setSelectedCalculatedFieldId('calc-1');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalyzeShelfLayout = async (query: string): Promise<string> => {
    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, products })
      });
      if (res.ok) {
        const data = await res.json();
        return data.analysis;
      }
      return 'Failed to generate recommendations. Verify service availability.';
    } catch (err) {
      console.error(err);
      return 'Network error when calling server consultant.';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center gap-4">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
        <span className="text-sm font-semibold text-slate-500 font-display">Initializing BI Tableau Workspace...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans selection:bg-emerald-500 selection:text-white flex flex-col">
      {/* Shared Dashboard Workspace Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-linear-to-br from-emerald-600 to-slate-800 text-white shadow-xs">
                <BarChart2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold tracking-tight text-slate-900">
                  Strategic Product Placement Analysis Suite
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Active Tableau BI Workbook Workspace &bull; Managed Full-Stack Platform
                </p>
              </div>
            </div>

            {/* Quick Status Pill */}
            <div className="flex items-center gap-2 self-start md:self-auto bg-slate-100 rounded-lg px-3 py-1.5 border border-slate-200/60">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
              <span className="text-xs font-semibold text-slate-600">Tableau Node Server Linked</span>
            </div>
          </div>
        </div>

        {/* Tab worksheets (Tableau Sheets style footer tabs) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100">
          <div className="flex overflow-x-auto gap-1 py-1.5 scrollbar-thin">
            <button
              onClick={() => setActiveTab('data-source')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg shrink-0 cursor-pointer transition-colors ${
                activeTab === 'data-source'
                  ? 'bg-slate-100 text-slate-900 font-bold border-b-2 border-emerald-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              Sheet 1: Ingest & Prep
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg shrink-0 cursor-pointer transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-slate-100 text-slate-900 font-bold border-b-2 border-emerald-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
              Sheet 2: Interactive Dashboard
            </button>
            <button
              onClick={() => setActiveTab('story')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg shrink-0 cursor-pointer transition-colors ${
                activeTab === 'story'
                  ? 'bg-slate-100 text-slate-900 font-bold border-b-2 border-emerald-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              Sheet 3: Tableau Storyboard
            </button>
            <button
              onClick={() => setActiveTab('calc-fields')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg shrink-0 cursor-pointer transition-colors ${
                activeTab === 'calc-fields'
                  ? 'bg-slate-100 text-slate-900 font-bold border-b-2 border-emerald-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              Sheet 4: Formula Compiler
            </button>
            <button
              onClick={() => setActiveTab('planogram')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg shrink-0 cursor-pointer transition-colors ${
                activeTab === 'planogram'
                  ? 'bg-slate-100 text-slate-900 font-bold border-b-2 border-emerald-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-500" />
              Sheet 5: Planogram Sandbox
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg shrink-0 cursor-pointer transition-colors ${
                activeTab === 'docs'
                  ? 'bg-slate-100 text-slate-900 font-bold border-b-2 border-emerald-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              Sheet 6: Handbooks & Deliverables
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Pane */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === 'data-source' && (
          <DatabaseConnector
            products={products}
            connections={connections}
            onSyncConnection={handleSyncConnection}
            onRunDataPrep={handleRunDataPrep}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onResetData={handleResetData}
          />
        )}

        {activeTab === 'dashboard' && (
          <BIWorksheet
            products={products}
            calculatedFields={calculatedFields}
            selectedCalculatedFieldId={selectedCalculatedFieldId}
            onSelectCalculatedField={setSelectedCalculatedFieldId}
          />
        )}

        {activeTab === 'story' && (
          <Storyboards products={products} />
        )}

        {activeTab === 'calc-fields' && (
          <CalculatedFields
            products={products}
            calculatedFields={calculatedFields}
            onAddCalculatedField={handleAddCalculatedField}
            onDeleteCalculatedField={handleDeleteCalculatedField}
          />
        )}

        {activeTab === 'planogram' && (
          <ShelfOptimizer
            products={products}
            onAddProduct={handleAddProduct}
            onAnalyzeShelf={handleAnalyzeShelfLayout}
          />
        )}

        {activeTab === 'docs' && (
          <ProjectDocs />
        )}
      </main>

      {/* Corporate footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          Strategic Product Placement Analysis &bull; Integrated Business Intelligence Platform &bull; Built with React & Express
        </div>
      </footer>
    </div>
  );
}
