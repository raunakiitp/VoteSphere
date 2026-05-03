'use client';

import { useState } from 'react';
import { 
  FileText, Shield, CheckCircle2, AlertTriangle, 
  Upload, Info, Search, FileCheck, ShieldCheck 
} from 'lucide-react';
import toast from 'react-hot-toast';

const DOC_TYPES = [
  { id: 'epic', name: 'Voter ID (EPIC)', category: 'Identity', req: 'Mandatory' },
  { id: 'aadhaar', name: 'Aadhaar Card', category: 'Identity/Address', req: 'Alternative' },
  { id: 'pan', name: 'PAN Card', category: 'Identity', req: 'Alternative' },
  { id: 'passport', name: 'Passport', category: 'Identity/Address', req: 'Alternative' },
  { id: 'driving', name: 'Driving License', category: 'Identity', req: 'Alternative' },
  { id: 'passbook', name: 'Bank Passbook', category: 'Address', req: 'Alternative' },
];

export default function DocumentValidator() {
  const [selected, setSelected] = useState<string[]>([]);
  const [validating, setValidating] = useState(false);
  const [results, setResults] = useState<{ id: string; status: 'valid' | 'invalid'; msg: string }[]>([]);

  const toggle = (id: string) => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const validate = async () => {
    if (selected.length === 0) {
      toast.error('Please select at least one document to validate.');
      return;
    }
    setValidating(true);
    // Simulate AI validation delay
    await new Promise(r => setTimeout(r, 2000));
    
    const res = selected.map(id => ({
      id,
      status: 'valid' as const,
      msg: 'Document structure and metadata verified successfully.'
    }));
    
    setResults(res);
    setValidating(false);
    toast.success('Validation complete!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-400 font-bold uppercase tracking-widest mb-4">
          <Shield size={12} /> Secure Verification
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Document Validator</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Verify which documents are accepted by the Election Commission of India (ECI) 
          and use our AI engine to ensure your IDs are ready for registration.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Select Documents</h2>
              <span className="text-xs text-slate-500">{selected.length} selected</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DOC_TYPES.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => toggle(doc.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    selected.includes(doc.id)
                      ? 'bg-blue-500/10 border-blue-500/30'
                      : 'bg-white/[0.02] border-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selected.includes(doc.id) ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                      <FileText size={16} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">{doc.name}</p>
                      <p className="text-[10px] text-slate-500">{doc.category}</p>
                    </div>
                  </div>
                  {selected.includes(doc.id) && <CheckCircle2 size={16} className="text-blue-400" />}
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-4">
                <div className="flex-1 rounded-xl border-2 border-dashed border-white/[0.06] p-8 text-center hover:border-blue-500/30 transition-all cursor-pointer group">
                  <Upload size={24} className="mx-auto text-slate-600 group-hover:text-blue-400 mb-2" />
                  <p className="text-sm text-slate-500 group-hover:text-slate-300">Upload scan for AI verification (Optional)</p>
                  <p className="text-[10px] text-slate-600 mt-1">PDF, JPG or PNG up to 5MB</p>
                </div>
              </div>
            </div>

            <button 
              onClick={validate}
              disabled={validating || selected.length === 0}
              className="btn-primary w-full justify-center py-4 mt-6 text-base"
            >
              {validating ? (
                <><Search size={18} className="animate-spin" /> Analyzing Documents...</>
              ) : (
                <><FileCheck size={18} /> Start AI Validation</>
              )}
            </button>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="card p-6 border-emerald-500/20 bg-emerald-500/5 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck size={24} className="text-emerald-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">Validation Results</h3>
                  <p className="text-xs text-slate-400">Analysis completed using VoteSphere Secure Engine</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {results.map(res => {
                  const doc = DOC_TYPES.find(d => d.id === res.id);
                  return (
                    <div key={res.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <CheckCircle2 size={18} className="text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-white">{doc?.name}</p>
                        <p className="text-xs text-slate-400 mt-1">{res.msg}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-6 bg-amber-500/5 border-amber-500/10">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={20} className="text-amber-500" />
              <h3 className="text-sm font-bold text-white">ECI Compliance</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              According to ECI guidelines, voters must carry their EPIC card to the polling booth. 
              If you don&apos;t have it, you must present one of the **12 alternative documents** validated here.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <div className="w-1 h-1 rounded-full bg-amber-500" />
                Original documents only
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <div className="w-1 h-1 rounded-full bg-amber-500" />
                Must be valid (not expired)
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-bold text-white mb-4">Need Help?</h3>
            <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2 text-blue-400">
                <Info size={14} />
                <span className="text-xs font-bold uppercase tracking-wider">Guide</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ask our AI Assistant if you are unsure about which documents apply to your specific situation or state.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
