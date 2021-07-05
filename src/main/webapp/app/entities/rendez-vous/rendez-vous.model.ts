import * as dayjs from 'dayjs';
import { IPatient } from 'app/entities/patient/patient.model';
import { IMedecine } from 'app/entities/medecine/medecine.model';
import { IConsultation } from 'app/entities/consultation/consultation.model';

export interface IRendezVous {
  id?: number;
  dateRendezVous?: dayjs.Dayjs | null;
  heureRendezVous?: dayjs.Dayjs | null;
  patient?: IPatient | null;
  medecine?: IMedecine | null;
  consultation?: IConsultation | null;
}

export class RendezVous implements IRendezVous {
  constructor(
    public id?: number,
    public dateRendezVous?: dayjs.Dayjs | null,
    public heureRendezVous?: dayjs.Dayjs | null,
    public patient?: IPatient | null,
    public medecine?: IMedecine | null,
    public consultation?: IConsultation | null
  ) {}
}

export function getRendezVousIdentifier(rendezVous: IRendezVous): number | undefined {
  return rendezVous.id;
}
