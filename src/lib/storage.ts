import { SavedSignature, SignatureData } from '@/types';

const STORAGE_KEY = 'dp-signatures';

export function getSavedSignatures(): SavedSignature[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSignature(name: string, data: SignatureData): SavedSignature {
  const signatures = getSavedSignatures();
  const newSig: SavedSignature = {
    id: crypto.randomUUID(),
    name,
    date: new Date().toISOString(),
    data,
  };
  signatures.unshift(newSig);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(signatures));
  return newSig;
}

export function updateSignature(id: string, name: string, data: SignatureData): void {
  const signatures = getSavedSignatures();
  const idx = signatures.findIndex((s) => s.id === id);
  if (idx !== -1) {
    signatures[idx] = { ...signatures[idx], name, data, date: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(signatures));
  }
}

export function deleteSignature(id: string): void {
  const signatures = getSavedSignatures().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(signatures));
}
