import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IConsultation, Consultation } from '../consultation.model';
import { ConsultationService } from '../service/consultation.service';

@Component({
  selector: 'jhi-consultation-update',
  templateUrl: './consultation-update.component.html',
})
export class ConsultationUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    dateComsultation: [],
    prixConsultation: [],
    rapportConsultation: [],
  });

  constructor(protected consultationService: ConsultationService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ consultation }) => {
      this.updateForm(consultation);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const consultation = this.createFromForm();
    if (consultation.id !== undefined) {
      this.subscribeToSaveResponse(this.consultationService.update(consultation));
    } else {
      this.subscribeToSaveResponse(this.consultationService.create(consultation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConsultation>>): void {
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

  protected updateForm(consultation: IConsultation): void {
    this.editForm.patchValue({
      id: consultation.id,
      dateComsultation: consultation.dateComsultation,
      prixConsultation: consultation.prixConsultation,
      rapportConsultation: consultation.rapportConsultation,
    });
  }

  protected createFromForm(): IConsultation {
    return {
      ...new Consultation(),
      id: this.editForm.get(['id'])!.value,
      dateComsultation: this.editForm.get(['dateComsultation'])!.value,
      prixConsultation: this.editForm.get(['prixConsultation'])!.value,
      rapportConsultation: this.editForm.get(['rapportConsultation'])!.value,
    };
  }
}
