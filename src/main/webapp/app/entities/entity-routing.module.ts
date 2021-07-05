import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'medecine',
        data: { pageTitle: 'projetPrApp.medecine.home.title' },
        loadChildren: () => import('./medecine/medecine.module').then(m => m.MedecineModule),
      },
      {
        path: 'rendez-vous',
        data: { pageTitle: 'projetPrApp.rendezVous.home.title' },
        loadChildren: () => import('./rendez-vous/rendez-vous.module').then(m => m.RendezVousModule),
      },
      {
        path: 'patient',
        data: { pageTitle: 'projetPrApp.patient.home.title' },
        loadChildren: () => import('./patient/patient.module').then(m => m.PatientModule),
      },
      {
        path: 'consultation',
        data: { pageTitle: 'projetPrApp.consultation.home.title' },
        loadChildren: () => import('./consultation/consultation.module').then(m => m.ConsultationModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
