import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  Cloud, 
  CloudUpload, 
  CloudDownload, 
  LogIn, 
  LogOut, 
  RefreshCw, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Trash2, 
  Plus, 
  Database, 
  Search, 
  Loader2, 
  ArrowRight,
  FileCheck,
  Layers
} from 'lucide-react';
import { 
  initAuth, 
  googleSignIn, 
  logoutDrive, 
  listDriveFiles, 
  getDriveFileContent, 
  createDriveFile, 
  deleteDriveFile, 
  DriveFile 
} from '../lib/driveService';
import { ProductPlacement } from '../types';

interface GoogleDriveIntegratorProps {
  products: ProductPlacement[];
  onImportProducts: (imported: ProductPlacement[], mode: 'append' | 'replace') => void;
  onRefreshDataset: () => void;
}

export default function GoogleDriveIntegrator({
  products,
  onImportProducts,
  onRefreshDataset
}: GoogleDriveIntegratorProps) {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // File explorer states
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [driveError, setDriveError] = useState<string | null>(null);

  // Export states
  const [exportName, setExportName] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return `Strategic_Placement_Dataset_${today}`;
  });
  const [exportFormat, setExportFormat] = useState<'csv' | 'sheet'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  // Import preview states
  const [previewProducts, setPreviewProducts] = useState<ProductPlacement[]>([]);
  const [previewFileName, setPreviewFileName] = useState('');
  const [isReadingFile, setIsReadingFile] = useState<string | null>(null);
  const [importOption, setImportOption] = useState<'append' | 'replace'>('append');

  // Trigger auth initialization once on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
        setNeedsAuth(false);
        // Automatically fetch files once token is resolved
        fetchFiles(currentToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setDriveError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setNeedsAuth(false);
        fetchFiles(result.accessToken);
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      setDriveError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutDrive();
      setUser(null);
      setToken(null);
      setNeedsAuth(true);
      setFiles([]);
      setPreviewProducts([]);
    } catch (err: any) {
      console.error('Logout failed:', err);
    }
  };

  const fetchFiles = async (currentToken?: string) => {
    const activeToken = currentToken || token;
    if (!activeToken) return;

    setLoadingFiles(true);
    setDriveError(null);
    try {
      const driveFiles = await listDriveFiles(activeToken);
      setFiles(driveFiles);
    } catch (err: any) {
      console.error('Failed to list files:', err);
      setDriveError(err?.message || 'Failed to list Google Drive files. The session may have expired.');
      // If token is invalid, prompt re-auth
      if (err?.message?.includes('auth') || err?.message?.includes('token') || err?.message?.includes('credential')) {
        setNeedsAuth(true);
      }
    } finally {
      setLoadingFiles(false);
    }
  };

  // Safe manual CSV Parsing supporting both app-native and original Kaggle schemas
  const parseCSVData = (csvText: string): ProductPlacement[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headersLine = lines[0];
    const isKaggleFormat = headersLine.includes('Product Position') || headersLine.includes('Sales Volume');
    const isAppFormat = headersLine.includes('productName') || headersLine.includes('shelfHeight');

    const result: ProductPlacement[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Handle comma splitting with double-quote text protection
      const parts: string[] = [];
      let insideQuote = false;
      let currentPart = '';
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          insideQuote = !insideQuote;
        } else if (char === ',' && !insideQuote) {
          parts.push(currentPart.trim());
          currentPart = '';
        } else {
          currentPart += char;
        }
      }
      parts.push(currentPart.trim());

      // Clean outer quotes from each part
      const cleanParts = parts.map(p => p.replace(/^["']|["']$/g, '').trim());

      if (isAppFormat && cleanParts.length >= 12) {
        // App Custom Export CSV
        result.push({
          id: cleanParts[0] || `drive-${Date.now()}-${i}`,
          productName: cleanParts[1] || 'Unnamed Product',
          category: cleanParts[2] || 'Food',
          shelfHeight: (cleanParts[3] as any) || 'Eye Level',
          facingCount: parseInt(cleanParts[4]) || 2,
          salesUnits: parseInt(cleanParts[5]) || 0,
          revenue: parseFloat(cleanParts[6]) || 0,
          unitCost: parseFloat(cleanParts[7]) || 0,
          unitPrice: parseFloat(cleanParts[8]) || 0,
          competitorPrice: parseFloat(cleanParts[9]) || parseFloat(cleanParts[8]) || 0,
          storeLocation: (cleanParts[10] as any) || 'Middle Aisle',
          demographicTarget: (cleanParts[11] as any) || 'General',
          weeklyFootTraffic: parseInt(cleanParts[12]) || 3000
        });
      } else if (isKaggleFormat && cleanParts.length >= 10) {
        // Original Kaggle CSV Format
        const id = cleanParts[0];
        const position = cleanParts[1];
        const price = parseFloat(cleanParts[2]) || 0;
        const compPrice = parseFloat(cleanParts[3]) || price;
        const traffic = cleanParts[5];
        const demo = cleanParts[6] as any;
        const category = cleanParts[7];
        const volume = parseInt(cleanParts[9]) || 0;

        let storeLocation: 'Front Aisle' | 'Middle Aisle' | 'Back Wall' | 'Endcap' | 'Checkout Queue' = 'Middle Aisle';
        if (position === 'End-cap' || position === 'Endcap') {
          storeLocation = 'Endcap';
        } else if (position === 'Front of Store' || position === 'Front') {
          storeLocation = 'Front Aisle';
        }

        let shelfHeight: 'Top Shelf' | 'Eye Level' | 'Touch Level' | 'Bottom Shelf' = 'Eye Level';
        if (traffic === 'Low') {
          shelfHeight = parseInt(id) % 2 === 0 ? 'Bottom Shelf' : 'Top Shelf';
        } else if (traffic === 'Medium') {
          shelfHeight = 'Touch Level';
        }

        let weeklyFootTraffic = 4500;
        if (traffic === 'High') {
          weeklyFootTraffic = 8500;
        } else if (traffic === 'Low') {
          weeklyFootTraffic = 1800;
        }

        let costFactor = 0.5;
        if (category === 'Clothing') costFactor = 0.4;
        else if (category === 'Electronics') costFactor = 0.7;
        const unitCost = parseFloat((price * costFactor).toFixed(2));
        const revenue = parseFloat((volume * price).toFixed(2));

        // Reconstruct friendly names
        const namesMap: Record<string, string[]> = {
          'Clothing': ['Classic Denim Hoodie', 'Performance Joggers', 'Premium Tee', 'Merino Wool Sweater'],
          'Electronics': ['Noise-Canceling Headphones', 'Wireless Charger Pad', 'Bluetooth Smart Speaker', 'High-Speed USB-C Cable'],
          'Food': ['Organic Ancient Grain Granola', 'Gourmet Sea Salt Truffle Chips', 'Artisanal Cold Brew Bottle', 'Premium Clover Honey']
        };
        const list = namesMap[category] || namesMap['Food'];
        const seed = parseInt(id) || 0;
        const productName = list[seed % list.length];

        result.push({
          id,
          productName,
          category,
          shelfHeight,
          facingCount: position === 'End-cap' ? 2 : (position === 'Front of Store' ? 4 : 3),
          salesUnits: volume,
          revenue,
          unitCost,
          unitPrice: price,
          competitorPrice: compPrice,
          storeLocation,
          demographicTarget: demo || 'General',
          weeklyFootTraffic
        });
      } else {
        // Generic CSV Parsing (Best Effort)
        result.push({
          id: cleanParts[0] || `generic-${Date.now()}-${i}`,
          productName: cleanParts[1] || `Product ${cleanParts[0]}`,
          category: cleanParts[2] || 'Food',
          shelfHeight: 'Eye Level',
          facingCount: 3,
          salesUnits: parseInt(cleanParts[3]) || 150,
          revenue: (parseInt(cleanParts[3]) || 150) * (parseFloat(cleanParts[4]) || 4.99),
          unitCost: (parseFloat(cleanParts[4]) || 4.99) * 0.5,
          unitPrice: parseFloat(cleanParts[4]) || 4.99,
          competitorPrice: parseFloat(cleanParts[5]) || parseFloat(cleanParts[4]) || 4.99,
          storeLocation: 'Middle Aisle',
          demographicTarget: 'General',
          weeklyFootTraffic: 4000
        });
      }
    }

    return result;
  };

  const handleReadFile = async (file: DriveFile) => {
    if (!token) return;
    setIsReadingFile(file.id);
    setDriveError(null);
    try {
      const content = await getDriveFileContent(token, file.id, file.mimeType);
      const parsed = parseCSVData(content);
      if (parsed.length === 0) {
        throw new Error('No valid retail product data rows could be parsed from this file.');
      }
      setPreviewProducts(parsed);
      setPreviewFileName(file.name);
    } catch (err: any) {
      console.error('Failed to read file:', err);
      setDriveError(err?.message || 'Could not parse data from Google Drive file.');
    } finally {
      setIsReadingFile(null);
    }
  };

  const handleConfirmImport = () => {
    if (previewProducts.length === 0) return;
    
    // Call props callback to update layout context
    onImportProducts(previewProducts, importOption);
    
    // Clear state
    setPreviewProducts([]);
    setPreviewFileName('');
  };

  const handleExport = async () => {
    if (!token || products.length === 0) return;
    setIsExporting(true);
    setDriveError(null);
    setExportSuccessMessage(null);

    try {
      // Build CSV Data
      const headers = [
        'id',
        'productName',
        'category',
        'shelfHeight',
        'facingCount',
        'salesUnits',
        'revenue',
        'unitCost',
        'unitPrice',
        'competitorPrice',
        'storeLocation',
        'demographicTarget',
        'weeklyFootTraffic'
      ].join(',');

      const rows = products.map(p => {
        return [
          p.id,
          `"${p.productName.replace(/"/g, '""')}"`,
          p.category,
          p.shelfHeight,
          p.facingCount,
          p.salesUnits,
          p.revenue,
          p.unitCost,
          p.unitPrice,
          p.competitorPrice,
          p.storeLocation,
          p.demographicTarget,
          p.weeklyFootTraffic
        ].join(',');
      });

      const csvContent = [headers, ...rows].join('\n');

      let mimeType = 'text/csv';
      let fileName = `${exportName}.csv`;
      let convertToWorkspace = false;

      if (exportFormat === 'sheet') {
        mimeType = 'text/csv';
        fileName = exportName; // Google conversion automatically creates standard Sheet name
        convertToWorkspace = true;
      }

      await createDriveFile(token, fileName, csvContent, mimeType, convertToWorkspace);
      
      setExportSuccessMessage(
        `Successfully saved "${fileName}" to Google Drive${
          convertToWorkspace ? ' as a native Google Sheet' : ''
        }!`
      );
      
      // Refresh drive files list
      fetchFiles(token);
    } catch (err: any) {
      console.error('Export failed:', err);
      setDriveError(err?.message || 'Failed to export current dataset to Google Drive.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteFile = async (file: DriveFile) => {
    if (!token) return;
    
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${file.name}" from your Google Drive? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    setLoadingFiles(true);
    setDriveError(null);
    try {
      await deleteDriveFile(token, file.id);
      setFiles(prev => prev.filter(f => f.id !== file.id));
      if (previewFileName === file.name) {
        setPreviewProducts([]);
        setPreviewFileName('');
      }
    } catch (err: any) {
      console.error('Delete failed:', err);
      setDriveError(err?.message || 'Failed to delete the file from Google Drive.');
    } finally {
      setLoadingFiles(false);
    }
  };

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-6 overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500 text-white rounded-xl">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-slate-800">
              Google Drive Cloud Workspace Integrator
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sync workbook files, import product coordinates, or export reports to Google Drive with ease.
            </p>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div>
          {needsAuth ? (
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              Sign in with Google Account
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'Google User'} 
                  className="w-6 h-6 rounded-full border border-slate-200"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {user?.displayName || 'Linked Account'}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {user?.email || 'Authenticated'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Global Errors Panel */}
      {driveError && (
        <div className="p-3 mb-6 bg-rose-50 border border-rose-100 rounded-lg text-rose-700 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
          <div>
            <span className="font-semibold">Integration Warning:</span> {driveError}
          </div>
        </div>
      )}

      {needsAuth ? (
        <div className="py-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-slate-50 border border-dashed border-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Cloud className="w-8 h-8 text-slate-300" />
          </div>
          <h4 className="text-sm font-semibold text-slate-800 font-display">Connect to Google Drive</h4>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Authorized connections allow your Tableau workspace to import product inventories from spreadsheets and save generated dashboards and files directly to your cloud drive.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Export Sidebar Panel */}
          <div className="lg:col-span-4 space-y-5 bg-slate-50/60 border border-slate-100 rounded-xl p-5">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <CloudUpload className="w-3.5 h-3.5 text-emerald-600" />
                Export Tableau Workbook
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Compress current active placements dataset and export a physical copy directly to your cloud.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  File Name
                </label>
                <input
                  type="text"
                  value={exportName}
                  onChange={e => setExportName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                  Destination Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setExportFormat('csv')}
                    className={`px-3 py-2 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer text-center ${
                      exportFormat === 'csv'
                        ? 'bg-emerald-50 border-emerald-500/30 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    CSV Dataset (.csv)
                  </button>
                  <button
                    type="button"
                    onClick={() => setExportFormat('sheet')}
                    className={`px-3 py-2 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer text-center ${
                      exportFormat === 'sheet'
                        ? 'bg-emerald-50 border-emerald-500/30 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Google Sheets File
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting || products.length === 0}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {isExporting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CloudUpload className="w-3.5 h-3.5" />
                )}
                Save Workbook to Drive
              </button>

              {exportSuccessMessage && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-[11px] text-emerald-700 flex items-start gap-1.5 animate-fadeIn">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{exportSuccessMessage}</span>
                </div>
              )}
            </div>
          </div>

          {/* Drive File Browser Panel */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* File List Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Cloud Storage Browser</span>
                <span className="text-[10px] font-bold bg-slate-200 px-1.5 py-0.5 rounded-full text-slate-500">
                  {filteredFiles.length} item{filteredFiles.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="flex items-center gap-2 self-stretch sm:self-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search drive files..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1 bg-white border border-slate-200 rounded-md text-[11px] text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <button
                  onClick={() => fetchFiles()}
                  disabled={loadingFiles}
                  className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  title="Refresh File Browser"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingFiles ? 'animate-spin text-emerald-600' : ''}`} />
                </button>
              </div>
            </div>

            {/* List Table */}
            <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white max-h-72 overflow-y-auto scrollbar-thin">
              {loadingFiles ? (
                <div className="py-16 text-center space-y-3">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto" />
                  <span className="text-xs text-slate-400 font-medium block">Polling Google Drive repository...</span>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-xs">
                  No compatible CSV or Google Workspace files found in your Drive.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-4">Item Name</th>
                      <th className="py-2.5 px-4">MimeType</th>
                      <th className="py-2.5 px-4">Last Modified</th>
                      <th className="py-2.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs text-slate-600">
                    {filteredFiles.map(file => {
                      const isSheet = file.mimeType === 'application/vnd.google-apps.spreadsheet';
                      const isDoc = file.mimeType === 'application/vnd.google-apps.document';
                      return (
                        <tr key={file.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2.5 px-4 font-medium text-slate-800">
                            <div className="flex items-center gap-2">
                              {isSheet ? (
                                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              ) : isDoc ? (
                                <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              ) : (
                                <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              )}
                              <span className="truncate max-w-[200px]" title={file.name}>
                                {file.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 px-4 text-[10px] font-mono text-slate-400">
                            {isSheet ? 'Google Sheets' : isDoc ? 'Google Docs' : 'Raw CSV / Txt'}
                          </td>
                          <td className="py-2.5 px-4 text-[10px] text-slate-400">
                            {new Date(file.modifiedTime).toLocaleDateString()}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleReadFile(file)}
                                disabled={isReadingFile !== null}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-md transition-colors cursor-pointer disabled:opacity-50"
                              >
                                {isReadingFile === file.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <CloudDownload className="w-3 h-3" />
                                )}
                                Ingest
                              </button>
                              <button
                                onClick={() => handleDeleteFile(file)}
                                className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                                title="Remove File"
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
              )}
            </div>

            {/* Parsing / Import Confirmation Overlay */}
            {previewProducts.length > 0 && (
              <div className="p-5 bg-emerald-50/45 border border-emerald-100/80 rounded-xl space-y-4 animate-fadeIn">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 font-display">
                        Parsed File Data Preview: <span className="text-emerald-700 font-mono text-xs">{previewFileName}</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Successfully decoded <span className="font-semibold text-slate-700">{previewProducts.length}</span> product placements. Configure import type.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setPreviewProducts([]);
                      setPreviewFileName('');
                    }}
                    className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Micro preview table */}
                <div className="border border-emerald-100 bg-white rounded-lg overflow-hidden max-h-36 overflow-y-auto scrollbar-thin">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-emerald-50 border-b border-emerald-100 text-emerald-800 font-bold">
                      <tr>
                        <th className="py-1.5 px-3">Product Name</th>
                        <th className="py-1.5 px-3">Category</th>
                        <th className="py-1.5 px-3">Store Location</th>
                        <th className="py-1.5 px-3">Shelf Placement</th>
                        <th className="py-1.5 px-3 text-right">Price</th>
                        <th className="py-1.5 px-3 text-right">Units</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {previewProducts.slice(0, 5).map((p, idx) => (
                        <tr key={idx}>
                          <td className="py-1 px-3 font-medium text-slate-800">{p.productName}</td>
                          <td className="py-1 px-3">{p.category}</td>
                          <td className="py-1 px-3">{p.storeLocation}</td>
                          <td className="py-1 px-3">{p.shelfHeight}</td>
                          <td className="py-1 px-3 text-right">${p.unitPrice.toFixed(2)}</td>
                          <td className="py-1 px-3 text-right">{p.salesUnits}</td>
                        </tr>
                      ))}
                      {previewProducts.length > 5 && (
                        <tr className="bg-slate-50/50">
                          <td colSpan={6} className="py-1 px-3 text-center text-slate-400 font-medium">
                            ... and {previewProducts.length - 5} more records
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-emerald-100/60 pt-3">
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-semibold text-slate-600">Import Method:</label>
                    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
                      <button
                        type="button"
                        onClick={() => setImportOption('append')}
                        className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                          importOption === 'append'
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Append to existing
                      </button>
                      <button
                        type="button"
                        onClick={() => setImportOption('replace')}
                        className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                          importOption === 'replace'
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Replace entire dataset
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmImport}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer transition-colors"
                  >
                    Confirm & Ingest data
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Inline fallback XIcon to prevent dependency errors
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
