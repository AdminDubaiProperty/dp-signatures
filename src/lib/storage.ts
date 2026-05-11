import { SavedSignature, SignatureData, TeamMember } from '@/types';
import { DUBAI_PROPERTY_LOGO_URL } from '@/lib/constants';

const STORAGE_KEY = 'dp-signatures';
const TEAM_OVERRIDES_KEY = 'dp_signatures_team_overrides_v1';

function normalizeSignatureData(data: SignatureData): SignatureData {
  return {
    ...data,
    photoUrl: data.photoUrl?.trim() || DUBAI_PROPERTY_LOGO_URL,
  };
}

export function getSavedSignatures(): SavedSignature[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((sig) => ({
      ...sig,
      data: normalizeSignatureData(sig.data),
    }));
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
    data: normalizeSignatureData(data),
  };
  signatures.unshift(newSig);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(signatures));
  return newSig;
}

export function updateSignature(id: string, name: string, data: SignatureData): void {
  const signatures = getSavedSignatures();
  const idx = signatures.findIndex((s) => s.id === id);
  if (idx !== -1) {
    signatures[idx] = { ...signatures[idx], name, data: normalizeSignatureData(data), date: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(signatures));
  }
}

export function deleteSignature(id: string): void {
  const signatures = getSavedSignatures().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(signatures));
}

export type TeamOverrides = Record<string, Partial<Pick<TeamMember, 'name' | 'designation' | 'email' | 'phone' | 'photo'>>>;

export function getTeamOverrides(): TeamOverrides {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(TEAM_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveTeamOverride(memberId: string, data: SignatureData): TeamOverrides {
  const overrides = getTeamOverrides();
  overrides[memberId] = {
    name: data.name,
    designation: data.designation,
    email: data.email,
    phone: data.phone,
    photo: data.photoUrl?.trim() || DUBAI_PROPERTY_LOGO_URL,
  };
  localStorage.setItem(TEAM_OVERRIDES_KEY, JSON.stringify(overrides));
  return overrides;
}

export function applyTeamOverrides(team: TeamMember[], overrides: TeamOverrides): TeamMember[] {
  return team.map((member) => {
    const override = overrides[member.id];
    return {
      ...member,
      ...(override || {}),
      photo: override?.photo || member.photo || DUBAI_PROPERTY_LOGO_URL,
    };
  });
}
