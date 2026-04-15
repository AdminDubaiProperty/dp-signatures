export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  about: string;
  photo: string;
  slug: string;
  rank: number;
}

export interface SignatureData {
  name: string;
  designation: string;
  phone: string;
  email: string;
  photoUrl: string;
  website: string;
  address: string;
  facebook: string;
  linkedin: string;
  instagram: string;
}

export interface SavedSignature {
  id: string;
  name: string;
  date: string;
  data: SignatureData;
}
