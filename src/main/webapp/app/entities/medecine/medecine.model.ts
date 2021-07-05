export interface IMedecine {
  id?: number;
  nom?: string | null;
  prenom?: string | null;
  email?: string | null;
  telephone?: string | null;
  specialite?: string | null;
}

export class Medecine implements IMedecine {
  constructor(
    public id?: number,
    public nom?: string | null,
    public prenom?: string | null,
    public email?: string | null,
    public telephone?: string | null,
    public specialite?: string | null
  ) {}
}

export function getMedecineIdentifier(medecine: IMedecine): number | undefined {
  return medecine.id;
}
