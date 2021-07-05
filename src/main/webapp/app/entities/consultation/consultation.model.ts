import * as dayjs from 'dayjs';

export interface IConsultation {
  id?: number;
  dateComsultation?: dayjs.Dayjs | null;
  prixConsultation?: number | null;
  rapportConsultation?: string | null;
}

export class Consultation implements IConsultation {
  constructor(
    public id?: number,
    public dateComsultation?: dayjs.Dayjs | null,
    public prixConsultation?: number | null,
    public rapportConsultation?: string | null
  ) {}
}

export function getConsultationIdentifier(consultation: IConsultation): number | undefined {
  return consultation.id;
}
