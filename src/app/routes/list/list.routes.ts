import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list.component';

export const routes: Routes = [
  {
    path: 'list',
    component: ListComponent
  }
];

export const LIST_ROUTING: ModuleWithProviders = RouterModule.forChild(routes);
