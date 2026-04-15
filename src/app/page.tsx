'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { TeamMember, SignatureData, SavedSignature } from '@/types';
import { generateSignatureHtml, DEFAULT_SIGNATURE_DATA, EXCLUDED_SLUGS } from '@/lib/signature-template';
import { getSavedSignatures, saveSignature, updateSignature, deleteSignature } from '@/lib/storage';
import teamDataJson from '@/team-data.json';

const allTeam: TeamMember[] = (teamDataJson as TeamMember[])
  .filter((m) => !EXCLUDED_SLUGS.has(m.slug))
  .sort((a, b) => a.rank - b.rank);

const PLACEHOLDER_PHOTO =
  'https://cdn.prod.website-files.com/663dca2d822c7860e89c4c5a/69cd2042f60117ec2c2abcd6_Dubai-Property%20Gold%20BG%20logo%20Brandmark.png';

// ─── Step indicator ──────────────────────────────────
function Steps({ current }: { current: number }) {
  const steps = ['Select', 'Edit', 'Preview & Copy'];
  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i <= current
                ? 'bg-[#B99A61] text-[#1C1A17]'
                : 'bg-[#2D2821] text-gray-500'
            }`}
          >
            {i + 1}
          </div>
          <span
            className={`text-xs font-medium hidden sm:inline ${
              i <= current ? 'text-[#B99A61]' : 'text-gray-500'
            }`}
          >
            {label}
          </span>
          {i < steps.length - 1 && (
            <div className={`w-8 h-px ${i < current ? 'bg-[#B99A61]' : 'bg-[#2D2821]'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Form field ──────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs text-gray-400 mb-1 block">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#1C1A17] border border-[#2D2821] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#B99A61] transition-colors"
      />
    </label>
  );
}

// ─── Mini signature card for saved list ──────────────
function MiniSignatureCard({
  sig,
  isActive,
  onSelect,
  onDelete,
}: {
  sig: SavedSignature;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`group rounded-lg border transition-all cursor-pointer ${
        isActive
          ? 'border-[#B99A61] bg-[#B99A61]/5'
          : 'border-[#2D2821] hover:border-[#B99A61]/40 bg-[#1C1A17]'
      }`}
    >
      <button onClick={onSelect} className="w-full p-3 text-left">
        <div className="flex items-center gap-3">
          <img
            src={sig.data.photoUrl || PLACEHOLDER_PHOTO}
            alt={sig.name}
            className="w-10 h-10 rounded-full object-cover border border-[#B99A61]/30 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-white truncate">{sig.name}</div>
            <div className="text-xs text-gray-500 truncate">{sig.data.designation}</div>
            <div className="text-[10px] text-gray-600 mt-0.5">
              {new Date(sig.date).toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="opacity-0 group-hover:opacity-100 p-1 text-gray-600 hover:text-red-400 transition-all"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </button>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────
export default function Home() {
  const [formData, setFormData] = useState<SignatureData>(DEFAULT_SIGNATURE_DATA);
  const [savedList, setSavedList] = useState<SavedSignature[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    setSavedList(getSavedSignatures());
  }, []);

  const filteredTeam = useMemo(
    () =>
      search
        ? allTeam.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
        : allTeam,
    [search],
  );

  const currentStep = formData.name ? 2 : 0;
  const signatureHtml = useMemo(() => generateSignatureHtml(formData), [formData]);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const selectMember = useCallback((m: TeamMember) => {
    setFormData({
      ...DEFAULT_SIGNATURE_DATA,
      name: m.name,
      designation: m.designation,
      phone: m.phone || '',
      email: m.email,
      photoUrl: m.photo || PLACEHOLDER_PHOTO,
    });
    setEditingId(null);
  }, []);

  const loadSaved = useCallback((sig: SavedSignature) => {
    setFormData(sig.data);
    setEditingId(sig.id);
  }, []);

  const handleSave = useCallback(() => {
    if (!formData.name) return;
    if (editingId) {
      updateSignature(editingId, formData.name, formData);
    } else {
      const s = saveSignature(formData.name, formData);
      setEditingId(s.id);
    }
    setSavedList(getSavedSignatures());
    flash('Signature saved');
  }, [formData, editingId]);

  const handleDelete = useCallback(
    (id: string) => {
      deleteSignature(id);
      setSavedList(getSavedSignatures());
      if (editingId === id) {
        setEditingId(null);
        setFormData(DEFAULT_SIGNATURE_DATA);
      }
    },
    [editingId],
  );

  const copyHtml = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(signatureHtml);
      flash('HTML copied');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = signatureHtml;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      flash('HTML copied');
    }
  }, [signatureHtml]);

  const copyRich = useCallback(async () => {
    try {
      const blob = new Blob([signatureHtml], { type: 'text/html' });
      await navigator.clipboard.write([new ClipboardItem({ 'text/html': blob })]);
      flash('Copied — paste directly into Gmail');
    } catch {
      await navigator.clipboard.writeText(signatureHtml);
      flash('Copied as text (rich copy unavailable)');
    }
  }, [signatureHtml]);

  const updateField = (k: keyof SignatureData, v: string) =>
    setFormData((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ─────────────────────────────── */}
      <header className="border-b border-[#2D2821] bg-[#1C1A17] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://cdn.prod.website-files.com/663dca2d822c7860e89c4c5a/69cd2042f60117ec2c2abcd6_Dubai-Property%20Gold%20BG%20logo%20Brandmark.png"
              alt="Logo"
              className="w-9 h-9"
            />
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Signature Generator</h1>
              <p className="text-[11px] text-[#B99A61] tracking-wide">DUBAI-PROPERTY.NL</p>
            </div>
          </div>

          {/* Saved signatures toggle */}
          <button
            onClick={() => setShowSaved(!showSaved)}
            className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-colors ${
              showSaved
                ? 'border-[#B99A61] text-[#B99A61] bg-[#B99A61]/10'
                : 'border-[#2D2821] text-gray-400 hover:text-white hover:border-[#B99A61]/40'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Saved{savedList.length > 0 && ` (${savedList.length})`}
          </button>
        </div>
      </header>

      {/* ── Toast ──────────────────────────────── */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500/15 border border-green-500/30 text-green-400 text-sm font-medium px-5 py-2.5 rounded-full backdrop-blur animate-[fadeIn_0.2s]">
          ✓ {toast}
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {/* ── Saved drawer ─────────────────────── */}
        {showSaved && (
          <div className="mb-8 bg-[#242019] rounded-xl border border-[#2D2821] p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Saved Signatures</h3>
            {savedList.length === 0 ? (
              <p className="text-sm text-gray-500">No saved signatures yet. Generate one below.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {savedList.map((sig) => (
                  <MiniSignatureCard
                    key={sig.id}
                    sig={sig}
                    isActive={editingId === sig.id}
                    onSelect={() => loadSaved(sig)}
                    onDelete={() => handleDelete(sig.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <Steps current={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ── Left: Team ─────────────────────── */}
          <div className="lg:col-span-3">
            <div className="bg-[#242019] rounded-xl border border-[#2D2821] overflow-hidden">
              <div className="p-3 border-b border-[#2D2821]">
                <div className="relative">
                  <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search team..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#1C1A17] border border-[#2D2821] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#B99A61]"
                  />
                </div>
              </div>
              <div className="max-h-[65vh] overflow-y-auto divide-y divide-[#2D2821]/50">
                {filteredTeam.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => selectMember(m)}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                      formData.email === m.email
                        ? 'bg-[#B99A61]/10 border-l-2 border-[#B99A61]'
                        : 'hover:bg-[#2D2821]/60'
                    }`}
                  >
                    <img
                      src={m.photo || PLACEHOLDER_PHOTO}
                      alt={m.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#B99A61]/20 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">{m.name}</div>
                      <div className="text-[11px] text-gray-500 truncate">{m.designation}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Middle: Form ───────────────────── */}
          <div className="lg:col-span-4">
            <div className="bg-[#242019] rounded-xl border border-[#2D2821] p-5">
              {!formData.name ? (
                <div className="py-16 text-center">
                  <div className="text-gray-500 text-sm">← Select a team member to start</div>
                </div>
              ) : (
                <>
                  {/* Photo preview */}
                  <div className="flex items-center gap-4 mb-5 pb-5 border-b border-[#2D2821]">
                    <img
                      src={formData.photoUrl || PLACEHOLDER_PHOTO}
                      alt="Photo"
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#B99A61]"
                    />
                    <div>
                      <div className="text-base font-semibold text-white">{formData.name}</div>
                      <div className="text-sm text-[#B99A61]">{formData.designation}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Name" value={formData.name} onChange={(v) => updateField('name', v)} />
                      <Field label="Role" value={formData.designation} onChange={(v) => updateField('designation', v)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Phone" value={formData.phone} onChange={(v) => updateField('phone', v)} placeholder="+31 6 ..." />
                      <Field label="Email" value={formData.email} onChange={(v) => updateField('email', v)} type="email" />
                    </div>
                    <Field label="Photo URL" value={formData.photoUrl} onChange={(v) => updateField('photoUrl', v)} />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Website" value={formData.website} onChange={(v) => updateField('website', v)} />
                      <Field label="Address" value={formData.address} onChange={(v) => updateField('address', v)} />
                    </div>

                    <details className="pt-1">
                      <summary className="text-xs text-gray-500 cursor-pointer hover:text-[#B99A61] transition-colors select-none">
                        Social media links
                      </summary>
                      <div className="space-y-3 mt-3">
                        <Field label="Facebook" value={formData.facebook} onChange={(v) => updateField('facebook', v)} />
                        <Field label="LinkedIn" value={formData.linkedin} onChange={(v) => updateField('linkedin', v)} />
                        <Field label="Instagram" value={formData.instagram} onChange={(v) => updateField('instagram', v)} />
                      </div>
                    </details>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      onClick={copyRich}
                      className="w-full py-3.5 rounded-xl bg-[#B99A61] text-[#1C1A17] font-bold hover:bg-[#a88a55] active:scale-[0.98] transition-all text-base flex items-center justify-center gap-2 shadow-lg shadow-[#B99A61]/20"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      📋 Copy Signature — Paste in Gmail
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleSave}
                        className="py-2 rounded-lg border border-[#2D2821] text-gray-300 hover:border-[#B99A61] hover:text-[#B99A61] transition-colors text-xs font-medium"
                      >
                        💾 {editingId ? 'Update' : 'Save'} Signature
                      </button>
                      <button
                        onClick={copyHtml}
                        className="py-2 rounded-lg border border-[#2D2821] text-gray-300 hover:border-[#B99A61] hover:text-[#B99A61] transition-colors text-xs font-medium"
                      >
                        {'<>'} Copy Raw HTML
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Right: Preview ─────────────────── */}
          <div className="lg:col-span-5">
            <div className="bg-[#242019] rounded-xl border border-[#2D2821] p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white">Live Preview</h2>
                {formData.name && (
                  <span className="text-[10px] text-gray-500 bg-[#1C1A17] px-2 py-0.5 rounded">
                    Updates in real-time
                  </span>
                )}
              </div>

              {formData.name ? (
                <>
                  <div className="bg-white rounded-lg p-5 overflow-x-auto">
                    <div dangerouslySetInnerHTML={{ __html: signatureHtml }} />
                  </div>

                  <details className="mt-4">
                    <summary className="text-xs text-gray-500 cursor-pointer hover:text-[#B99A61] transition-colors select-none">
                      Raw HTML
                    </summary>
                    <pre className="mt-2 bg-[#1C1A17] rounded-lg p-3 text-[11px] text-gray-500 overflow-x-auto max-h-40 overflow-y-auto leading-relaxed">
                      {signatureHtml}
                    </pre>
                  </details>
                </>
              ) : (
                <div className="bg-[#1C1A17] rounded-lg py-20 flex flex-col items-center gap-3">
                  <svg className="w-10 h-10 text-[#2D2821]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs text-gray-600">Your signature preview will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="border-t border-[#2D2821] py-4 mt-auto">
        <p className="text-center text-[11px] text-gray-600">
          Dubai-Property.nl · Email Signature Generator
        </p>
      </footer>
    </div>
  );
}
