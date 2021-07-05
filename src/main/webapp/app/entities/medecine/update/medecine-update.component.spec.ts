jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MedecineService } from '../service/medecine.service';
import { IMedecine, Medecine } from '../medecine.model';

import { MedecineUpdateComponent } from './medecine-update.component';

describe('Component Tests', () => {
  describe('Medecine Management Update Component', () => {
    let comp: MedecineUpdateComponent;
    let fixture: ComponentFixture<MedecineUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let medecineService: MedecineService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MedecineUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(MedecineUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MedecineUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      medecineService = TestBed.inject(MedecineService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const medecine: IMedecine = { id: 456 };

        activatedRoute.data = of({ medecine });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(medecine));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Medecine>>();
        const medecine = { id: 123 };
        jest.spyOn(medecineService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ medecine });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: medecine }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(medecineService.update).toHaveBeenCalledWith(medecine);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Medecine>>();
        const medecine = new Medecine();
        jest.spyOn(medecineService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ medecine });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: medecine }));
        saveSubject.complete();

        // THEN
        expect(medecineService.create).toHaveBeenCalledWith(medecine);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Medecine>>();
        const medecine = { id: 123 };
        jest.spyOn(medecineService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ medecine });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(medecineService.update).toHaveBeenCalledWith(medecine);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
