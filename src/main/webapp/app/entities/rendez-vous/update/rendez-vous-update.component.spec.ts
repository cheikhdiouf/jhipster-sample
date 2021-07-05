jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RendezVousService } from '../service/rendez-vous.service';
import { IRendezVous, RendezVous } from '../rendez-vous.model';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { IMedecine } from 'app/entities/medecine/medecine.model';
import { MedecineService } from 'app/entities/medecine/service/medecine.service';
import { IConsultation } from 'app/entities/consultation/consultation.model';
import { ConsultationService } from 'app/entities/consultation/service/consultation.service';

import { RendezVousUpdateComponent } from './rendez-vous-update.component';

describe('Component Tests', () => {
  describe('RendezVous Management Update Component', () => {
    let comp: RendezVousUpdateComponent;
    let fixture: ComponentFixture<RendezVousUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let rendezVousService: RendezVousService;
    let patientService: PatientService;
    let medecineService: MedecineService;
    let consultationService: ConsultationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RendezVousUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(RendezVousUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RendezVousUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      rendezVousService = TestBed.inject(RendezVousService);
      patientService = TestBed.inject(PatientService);
      medecineService = TestBed.inject(MedecineService);
      consultationService = TestBed.inject(ConsultationService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call patient query and add missing value', () => {
        const rendezVous: IRendezVous = { id: 456 };
        const patient: IPatient = { id: 28756 };
        rendezVous.patient = patient;

        const patientCollection: IPatient[] = [{ id: 50982 }];
        jest.spyOn(patientService, 'query').mockReturnValue(of(new HttpResponse({ body: patientCollection })));
        const expectedCollection: IPatient[] = [patient, ...patientCollection];
        jest.spyOn(patientService, 'addPatientToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ rendezVous });
        comp.ngOnInit();

        expect(patientService.query).toHaveBeenCalled();
        expect(patientService.addPatientToCollectionIfMissing).toHaveBeenCalledWith(patientCollection, patient);
        expect(comp.patientsCollection).toEqual(expectedCollection);
      });

      it('Should call medecine query and add missing value', () => {
        const rendezVous: IRendezVous = { id: 456 };
        const medecine: IMedecine = { id: 71741 };
        rendezVous.medecine = medecine;

        const medecineCollection: IMedecine[] = [{ id: 53067 }];
        jest.spyOn(medecineService, 'query').mockReturnValue(of(new HttpResponse({ body: medecineCollection })));
        const expectedCollection: IMedecine[] = [medecine, ...medecineCollection];
        jest.spyOn(medecineService, 'addMedecineToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ rendezVous });
        comp.ngOnInit();

        expect(medecineService.query).toHaveBeenCalled();
        expect(medecineService.addMedecineToCollectionIfMissing).toHaveBeenCalledWith(medecineCollection, medecine);
        expect(comp.medecinesCollection).toEqual(expectedCollection);
      });

      it('Should call consultation query and add missing value', () => {
        const rendezVous: IRendezVous = { id: 456 };
        const consultation: IConsultation = { id: 26831 };
        rendezVous.consultation = consultation;

        const consultationCollection: IConsultation[] = [{ id: 64082 }];
        jest.spyOn(consultationService, 'query').mockReturnValue(of(new HttpResponse({ body: consultationCollection })));
        const expectedCollection: IConsultation[] = [consultation, ...consultationCollection];
        jest.spyOn(consultationService, 'addConsultationToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ rendezVous });
        comp.ngOnInit();

        expect(consultationService.query).toHaveBeenCalled();
        expect(consultationService.addConsultationToCollectionIfMissing).toHaveBeenCalledWith(consultationCollection, consultation);
        expect(comp.consultationsCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const rendezVous: IRendezVous = { id: 456 };
        const patient: IPatient = { id: 15939 };
        rendezVous.patient = patient;
        const medecine: IMedecine = { id: 41820 };
        rendezVous.medecine = medecine;
        const consultation: IConsultation = { id: 35270 };
        rendezVous.consultation = consultation;

        activatedRoute.data = of({ rendezVous });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(rendezVous));
        expect(comp.patientsCollection).toContain(patient);
        expect(comp.medecinesCollection).toContain(medecine);
        expect(comp.consultationsCollection).toContain(consultation);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<RendezVous>>();
        const rendezVous = { id: 123 };
        jest.spyOn(rendezVousService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ rendezVous });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: rendezVous }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(rendezVousService.update).toHaveBeenCalledWith(rendezVous);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<RendezVous>>();
        const rendezVous = new RendezVous();
        jest.spyOn(rendezVousService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ rendezVous });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: rendezVous }));
        saveSubject.complete();

        // THEN
        expect(rendezVousService.create).toHaveBeenCalledWith(rendezVous);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<RendezVous>>();
        const rendezVous = { id: 123 };
        jest.spyOn(rendezVousService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ rendezVous });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(rendezVousService.update).toHaveBeenCalledWith(rendezVous);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackPatientById', () => {
        it('Should return tracked Patient primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPatientById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackMedecineById', () => {
        it('Should return tracked Medecine primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackMedecineById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackConsultationById', () => {
        it('Should return tracked Consultation primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackConsultationById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
