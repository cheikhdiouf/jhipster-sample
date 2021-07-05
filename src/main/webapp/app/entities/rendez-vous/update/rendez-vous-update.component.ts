import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IRendezVous, RendezVous } from '../rendez-vous.model';
import { RendezVousService } from '../service/rendez-vous.service';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { IMedecine } from 'app/entities/medecine/medecine.model';
import { MedecineService } from 'app/entities/medecine/service/medecine.service';
import { IConsultation } from 'app/entities/consultation/consultation.model';
import { ConsultationService } from 'app/entities/consultation/service/consultation.service';

@Component({
  selector: 'jhi-rendez-vous-update',
  templateUrl: './rendez-vous-update.component.html',
})
export class RendezVousUpdateComponent implements OnInit {
  isSaving = false;

  patientsCollection: IPatient[] = [];
  medecinesCollection: IMedecine[] = [];
  consultationsCollection: IConsultation[] = [];

  editForm = this.fb.group({
    id: [],
    dateRendezVous: [],
    heureRendezVous: [],
    patient: [],
    medecine: [],
    consultation: [],
  });

  constructor(
    protected rendezVousService: RendezVousService,
    protected patientService: PatientService,
    protected medecineService: MedecineService,
    protected consultationService: ConsultationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rendezVous }) => {
      if (rendezVous.id === undefined) {
        const today = dayjs().startOf('day');
        rendezVous.heureRendezVous = today;
      }

      this.updateForm(rendezVous);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const rendezVous = this.createFromForm();
    if (rendezVous.id !== undefined) {
      this.subscribeToSaveResponse(this.rendezVousService.update(rendezVous));
    } else {
      this.subscribeToSaveResponse(this.rendezVousService.create(rendezVous));
    }
  }

  trackPatientById(index: number, item: IPatient): number {
    return item.id!;
  }

  trackMedecineById(index: number, item: IMedecine): number {
    return item.id!;
  }

  trackConsultationById(index: number, item: IConsultation): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRendezVous>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(rendezVous: IRendezVous): void {
    this.editForm.patchValue({
      id: rendezVous.id,
      dateRendezVous: rendezVous.dateRendezVous,
      heureRendezVous: rendezVous.heureRendezVous ? rendezVous.heureRendezVous.format(DATE_TIME_FORMAT) : null,
      patient: rendezVous.patient,
      medecine: rendezVous.medecine,
      consultation: rendezVous.consultation,
    });

    this.patientsCollection = this.patientService.addPatientToCollectionIfMissing(this.patientsCollection, rendezVous.patient);
    this.medecinesCollection = this.medecineService.addMedecineToCollectionIfMissing(this.medecinesCollection, rendezVous.medecine);
    this.consultationsCollection = this.consultationService.addConsultationToCollectionIfMissing(
      this.consultationsCollection,
      rendezVous.consultation
    );
  }

  protected loadRelationshipsOptions(): void {
    this.patientService
      .query({ filter: 'rendezvous-is-null' })
      .pipe(map((res: HttpResponse<IPatient[]>) => res.body ?? []))
      .pipe(
        map((patients: IPatient[]) => this.patientService.addPatientToCollectionIfMissing(patients, this.editForm.get('patient')!.value))
      )
      .subscribe((patients: IPatient[]) => (this.patientsCollection = patients));

    this.medecineService
      .query({ filter: 'rendezvous-is-null' })
      .pipe(map((res: HttpResponse<IMedecine[]>) => res.body ?? []))
      .pipe(
        map((medecines: IMedecine[]) =>
          this.medecineService.addMedecineToCollectionIfMissing(medecines, this.editForm.get('medecine')!.value)
        )
      )
      .subscribe((medecines: IMedecine[]) => (this.medecinesCollection = medecines));

    this.consultationService
      .query({ filter: 'rendezvous-is-null' })
      .pipe(map((res: HttpResponse<IConsultation[]>) => res.body ?? []))
      .pipe(
        map((consultations: IConsultation[]) =>
          this.consultationService.addConsultationToCollectionIfMissing(consultations, this.editForm.get('consultation')!.value)
        )
      )
      .subscribe((consultations: IConsultation[]) => (this.consultationsCollection = consultations));
  }

  protected createFromForm(): IRendezVous {
    return {
      ...new RendezVous(),
      id: this.editForm.get(['id'])!.value,
      dateRendezVous: this.editForm.get(['dateRendezVous'])!.value,
      heureRendezVous: this.editForm.get(['heureRendezVous'])!.value
        ? dayjs(this.editForm.get(['heureRendezVous'])!.value, DATE_TIME_FORMAT)
        : undefined,
      patient: this.editForm.get(['patient'])!.value,
      medecine: this.editForm.get(['medecine'])!.value,
      consultation: this.editForm.get(['consultation'])!.value,
    };
  }
}
