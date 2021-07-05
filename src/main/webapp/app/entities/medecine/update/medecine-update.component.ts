import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IMedecine, Medecine } from '../medecine.model';
import { MedecineService } from '../service/medecine.service';

@Component({
  selector: 'jhi-medecine-update',
  templateUrl: './medecine-update.component.html',
})
export class MedecineUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nom: [],
    prenom: [],
    email: [],
    telephone: [],
    specialite: [],
  });

  constructor(protected medecineService: MedecineService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ medecine }) => {
      this.updateForm(medecine);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const medecine = this.createFromForm();
    if (medecine.id !== undefined) {
      this.subscribeToSaveResponse(this.medecineService.update(medecine));
    } else {
      this.subscribeToSaveResponse(this.medecineService.create(medecine));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMedecine>>): void {
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

  protected updateForm(medecine: IMedecine): void {
    this.editForm.patchValue({
      id: medecine.id,
      nom: medecine.nom,
      prenom: medecine.prenom,
      email: medecine.email,
      telephone: medecine.telephone,
      specialite: medecine.specialite,
    });
  }

  protected createFromForm(): IMedecine {
    return {
      ...new Medecine(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      prenom: this.editForm.get(['prenom'])!.value,
      email: this.editForm.get(['email'])!.value,
      telephone: this.editForm.get(['telephone'])!.value,
      specialite: this.editForm.get(['specialite'])!.value,
    };
  }
}
