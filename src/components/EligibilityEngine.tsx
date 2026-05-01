'use client';

import { useState } from 'react';
import { useVoteSphereStore } from '@/lib/store';
import { CheckCircle, XCircle, AlertCircle, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Form {
  age: string; region: string;
  citizenship: string; mentalCapacity: string;
  criminalStatus: string; hasId: string;
}

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand',
  'West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry',
];

export default function EligibilityEngine() {
  const { setEligibilityResult, eligibilityResult, completeStage } = useVoteSphereStore();
  const [form, setForm] = useState<Form>({
    age: '', region: '', citizenship: 'yes',
    mentalCapacity: 'yes', criminalStatus: 'no', hasId: 'yes',
  });
  const [checking, setChecking] = useState(false);
  const [done, setDone] = useState(false);

  const upd = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const check = async () => {
    if (!form.age || !form.region) { toast.error('Please fill age and state.'); return; }
    setChecking(true);
    await new Promise(r => setTimeout(r, 1200));

    const age = parseInt(form.age);
    const reasons: string[] = [];
    let pct = 100; let eligible = true;

    if (age < 18)  { eligible = false; pct = 0; reasons.push('Age below 18 — minimum voting age is 18 years.'); }
    else           { reasons.push('Age requirement satisfied (18+).'); }

    if (form.citizenship !== 'yes') { eligible = false; pct -= 50; reasons.push('Indian citizenship required to vote.'); }
    else reasons.push('Indian citizenship: confirmed.');

    if (form.mentalCapacity !== 'yes') { eligible = false; pct -= 20; reasons.push('Must be of sound mind per Section 16 of the Representation of People Act.'); }
    else reasons.push('Mental capacity: sound.');

    if (form.criminalStatus === 'yes') { pct -= 10; reasons.push('Conviction for corrupt practices may lead to disqualification — consult your Returning Officer.'); }
    else reasons.push('No disqualifying criminal record.');

    if (form.hasId !== 'yes') { pct -= 5; reasons.push('Voter ID (EPIC) not available — carry 2 alternative ECI-approved documents.'); }
    else reasons.push('Voter ID (EPIC) available.');

    pct = Math.max(0, Math.min(100, pct));
    setEligibilityResult({ eligible, probability: pct, reasons });
    if (eligible) { completeStage('eligibility'); toast.success('You are eligible to vote!'); }
    setChecking(false);
    setDone(true);
  };

  return (
    <div className="card p-6">
      <div className="mb-5">
        <p className="section-tag">Smart Eligibility Engine</p>
        <p className="text-base font-semibold text-white">Check Your Voting Eligibility</p>
        <p className="text-sm text-slate-500 mt-1">Answer a few questions to get an instant eligibility assessment.</p>
      </div>

      {!done ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Age</label>
              <input type="number" min="1" max="120" placeholder="Your age"
                value={form.age} onChange={upd('age')} className="input" />
            </div>
            <div>
              <label className="label">State / UT of Residence</label>
              <select value={form.region} onChange={upd('region')} className="select">
                <option value="">Select state...</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Are you an Indian Citizen?', key: 'citizenship', opts: [['yes','Yes'],['no','No']] },
              { label: 'Do you have sound mental capacity?', key: 'mentalCapacity', opts: [['yes','Yes'],['no','No']] },
              { label: 'Any convictions for corrupt electoral practices?', key: 'criminalStatus', opts: [['no','No'],['yes','Yes']] },
              { label: 'Do you have a Voter ID (EPIC)?', key: 'hasId', opts: [['yes','Yes, I have EPIC'],['no','No / Applied']] },
            ].map(({ label, key, opts }) => (
              <div key={key}>
                <label className="label">{label}</label>
                <select value={form[key as keyof Form]} onChange={upd(key as keyof Form)} className="select">
                  {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
          </div>

          <button onClick={check} disabled={checking}
            className="btn-primary w-full justify-center py-3 mt-2">
            {checking
              ? <><Loader2 size={16} className="anim-spin" /> Analyzing eligibility...</>
              : <>Check Eligibility <ChevronRight size={16} /></>}
          </button>
        </div>
      ) : eligibilityResult && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Result header */}
          <div className={`rounded-xl p-5 border ${
            eligibilityResult.eligible
              ? 'bg-emerald-500/5 border-emerald-500/20'
              : 'bg-red-500/5 border-red-500/20'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              {eligibilityResult.eligible
                ? <CheckCircle size={28} className="text-emerald-400 flex-shrink-0" />
                : <XCircle size={28} className="text-red-400 flex-shrink-0" />}
              <div>
                <p className={`font-bold text-lg ${eligibilityResult.eligible ? 'text-emerald-400' : 'text-red-400'}`}>
                  {eligibilityResult.eligible ? 'You are eligible to vote' : 'Not currently eligible'}
                </p>
                <p className="text-sm text-slate-400">Eligibility score: {eligibilityResult.probability}%</p>
              </div>
            </div>

            {/* Score bar */}
            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden mb-4">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${eligibilityResult.eligible ? 'bg-emerald-500' : 'bg-red-500'}`}
                style={{ width: `${eligibilityResult.probability}%` }}
              />
            </div>

            {/* Reasons */}
            <div className="space-y-2">
              {eligibilityResult.reasons.map((r, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <div className="flex-shrink-0 mt-0.5">
                    {r.startsWith('Age below') || r.startsWith('Indian citizenship required') || r.startsWith('Must be of sound')
                      ? <XCircle size={14} className="text-red-400" />
                      : r.includes('may lead') || r.includes('not available')
                      ? <AlertCircle size={14} className="text-amber-400" />
                      : <CheckCircle size={14} className="text-emerald-400" />}
                  </div>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next steps */}
          {eligibilityResult.eligible && (
            <div className="rounded-xl p-4 bg-blue-500/5 border border-blue-500/20">
              <p className="text-sm font-semibold text-blue-400 mb-2">Recommended next steps</p>
              <ul className="space-y-1.5 text-sm text-slate-400">
                <li className="flex items-center gap-2"><ChevronRight size={12} className="text-blue-500 flex-shrink-0" />Verify your registration at voterportal.eci.gov.in</li>
                <li className="flex items-center gap-2"><ChevronRight size={12} className="text-blue-500 flex-shrink-0" />Download your Voter Information Slip (VIS)</li>
                <li className="flex items-center gap-2"><ChevronRight size={12} className="text-blue-500 flex-shrink-0" />Note your polling station booth number</li>
                <li className="flex items-center gap-2"><ChevronRight size={12} className="text-blue-500 flex-shrink-0" />Mark Election Day on your calendar</li>
              </ul>
            </div>
          )}

          <button onClick={() => { setDone(false); setEligibilityResult(null); }}
            className="btn-secondary w-full justify-center">
            Check again
          </button>
        </div>
      )}
    </div>
  );
}
