import * as dayjs from 'dayjs';

export interface IPatient {
  id?: number;
  nom?: string | null;
  prenom?: string | null;
  email?: string | null;
  telephone?: string | null;
  adresse?: string | null;
  dateNaissance?: dayjs.Dayjs | null;
}

export class Patient implements IPatient {
  constructor(
    public id?: number,
    public nom?: string | null,
    public prenom?: string | null,
    public email?: string | null,
    public telephone?: string | null,
    public adresse?: string | null,
    public dateNaissance?: dayjs.Dayjs | null
  ) {}
}

export function getPatientIdentifier(patient: IPatient): number | undefined {
  return patient.id;
}
