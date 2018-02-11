import { PageNotFoundComponent } from './pageNotFound.component';
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

export const PAGE_NOT_FOUND_ROUTING: ModuleWithProviders = RouterModule.forChild(
  routes
);
