import React, { useState } from 'react';
import { CalculatedField, ProductPlacement } from '../types';
import { evaluateCalculatedField } from '../data';
import { Layers, Plus, Trash2, HelpCircle, Code, Play } from 'lucide-react';

interface CalculatedFieldsProps {
  products: ProductPlacement[];
  calculatedFields: CalculatedField[];
  onAddCalculatedField: (field: CalculatedField) => Promise<void>;
  onDeleteCalculatedField: (id: string) => Promise<void>;
}

export const VARIABLE_TOKENS = [
  { label: 'Revenue', token: '[Revenue]', desc: 'Weekly dollar sales revenue' },
  { label: 'Sales Units', token: '[Sales Units]', desc: 'Weekly volume units sold' },
  { label: 'Facing Count', token: '[Facing Count]', desc: 'Package facings footprint' },
  { label: 'Unit Cost', token: '[Unit Cost]', desc: 'Wholesale acquisition cost' },
  { label: 'Unit Price', token: '[Unit Price]', desc: 'Retail shelf selling price' },
  { label: 'Competitor Price', token: '[Competitor Price]', desc: 'Competitor shelf selling price' },
  { label: 'Foot Traffic', token: '[Weekly Foot Traffic]', desc: 'Weekly aisle footsteps' },
];

export const MATH_TOKENS = ['+', '-', '*', '/', '(', ')', '100'];

export default function CalculatedFields({
  products,
  calculatedFields,
  onAddCalculatedField,
  onDeleteCalculatedField
}: CalculatedFieldsProps) {
  const [fieldName, setFieldName] = useState('');
  const [expression, setExpression] = useState('');
  const [description, setDescription] = useState('');
  const [testProductIdx, setTestProductIdx] = useState(0);
  const [compiling, setCompiling] = useState(false);
  const [compileError, setCompileError] = useState<string | null>(null);

  const insertToken = (token: string) => {
    setExpression(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + token);
  };

  const handleTestEvaluation = () => {
    if (!expression) return '0.00';
    const mockField: CalculatedField = {
      id: 'test',
      name: fieldName || 'Test Field',
      formula: fieldName || 'Test',
      expression,
      description
    };
    const prod = products[testProductIdx] || products[0];
    if (!prod) return '0.00';
    const val = evaluateCalculatedField(mockField, prod);
    return isNaN(val) ? 'Error' : val.toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldName || !expression) return;

    setCompiling(true);
    setCompileError(null);

    // Perform a validation step on the formula
    try {
      const mockField: CalculatedField = {
        id: 'test',
        name: fieldName,
        formula: fieldName,
        expression,
        description
      };
      // Evaluate against the first product to ensure it parses successfully
      const result = evaluateCalculatedField(mockField, products[0] || products[0]);
      if (isNaN(result) || !isFinite(result)) {
        throw new Error('Formula evaluates to NaN or Infinity.');
      }
    } catch (err: any) {
      setCompileError(`Formula validation failed: ${err.message || 'Check division by zero or brackets.'}`);
      setCompiling(false);
      return;
    }

    const field: CalculatedField = {
      name: fieldName,
      formula: fieldName,
      expression,
      description: description || `Custom measure: ${fieldName}`
    } as any;

    await onAddCalculatedField(field);
    setFieldName('');
    setExpression('');
    setDescription('');
    setCompiling(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calculated Field Creator Form */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-6 lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-xl font-display font-semibold text-slate-800 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            Tableau Formula Compiler
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Build custom calculated measures using Excel/Tableau-compliant algebraic syntax.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Calculated Field Name
              </label>
              <input
                type="text"
                required
                value={fieldName}
                onChange={e => setFieldName(e.target.value)}
                placeholder="e.g., Profitability Index"
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-500 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Formula Description
              </label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g., Measure of margin against layout footprint"
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-500 text-slate-800"
              />
            </div>
          </div>

          {/* Token Buttons Rail */}
          <div className="space-y-3.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Formula Sandbox Helper</span>
              <p className="text-xs text-slate-500">Click field variables or math operators to compile them into the active formula expression.</p>
            </div>
            
            <div className="space-y-2">
              <div className="text-[10px] font-semibold text-slate-500 uppercase">Available Variables:</div>
              <div className="flex flex-wrap gap-1.5">
                {VARIABLE_TOKENS.map(v => (
                  <button
                    key={v.token}
                    type="button"
                    onClick={() => insertToken(v.token)}
                    className="px-2.5 py-1 text-xs bg-white hover:bg-slate-100/80 text-emerald-800 border border-slate-200 rounded-md transition-colors cursor-pointer"
                    title={v.desc}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-semibold text-slate-500 uppercase">Operators:</div>
              <div className="flex flex-wrap gap-1">
                {MATH_TOKENS.map(op => (
                  <button
                    key={op}
                    type="button"
                    onClick={() => insertToken(op)}
                    className="px-3 py-1 text-xs font-mono font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-md cursor-pointer transition-colors"
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Expression Input Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Code className="w-3.5 h-3.5 text-emerald-600" />
              Formula Expression
            </label>
            <textarea
              required
              rows={3}
              value={expression}
              onChange={e => setExpression(e.target.value)}
              placeholder="e.g., ([Revenue] - ([Sales Units] * [Unit Cost])) / [Revenue]"
              className="w-full px-3.5 py-2.5 text-sm font-mono bg-slate-900 text-emerald-400 border border-slate-900 rounded-xl focus:outline-hidden focus:border-emerald-500 leading-relaxed"
            />
          </div>

          {compileError && (
            <div className="p-3 bg-red-50 text-red-800 text-xs border border-red-100 rounded-lg">
              {compileError}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setFieldName('');
                setExpression('');
                setDescription('');
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Clear Workspace
            </button>
            <button
              type="submit"
              disabled={compiling}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Compile & Save Measure
            </button>
          </div>
        </form>
      </div>

      {/* Compiler Evaluation Preview & Existing List */}
      <div className="space-y-6 lg:col-span-1">
        {/* Real-time Sandbox Tester */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Play className="w-4.5 h-4.5 text-emerald-600" />
            <h3 className="font-display font-semibold text-slate-800">
              Formula Live Sandbox
            </h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase">Test Product Scenario</label>
              <select
                value={testProductIdx}
                onChange={e => setTestProductIdx(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-hidden"
              >
                {products.map((p, idx) => (
                  <option key={p.id} value={idx}>{p.productName} (${p.unitPrice})</option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 font-mono text-center">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Evaluated Score Output</span>
              <span className="text-xl font-bold text-slate-800 tracking-tight mt-1 block">
                {handleTestEvaluation()}
              </span>
            </div>
          </div>
        </div>

        {/* Existing Custom Fields */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-5 space-y-4">
          <h3 className="font-display font-semibold text-slate-800 flex items-center justify-between">
            <span>Compiled Measures</span>
            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-mono font-semibold">
              {calculatedFields.length}
            </span>
          </h3>

          <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
            {calculatedFields.map(f => (
              <div key={f.id} className="p-3 rounded-lg border border-slate-100/80 bg-slate-50/50 relative group">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{f.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{f.description}</p>
                  </div>
                  {/* Prevent deleting default pre-defined measures to keep core visuals functioning */}
                  {!f.id.startsWith('calc-') && (
                    <button
                      onClick={() => onDeleteCalculatedField(f.id)}
                      className="p-1 text-slate-300 hover:text-red-600 transition-colors cursor-pointer"
                      title="Remove Calculated Measure"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="mt-2 p-1.5 bg-white border border-slate-100 rounded-sm text-[10px] font-mono text-slate-600 truncate">
                  {f.expression}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
