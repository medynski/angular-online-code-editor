import { EditorComponent } from './editor.component';
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component: EditorComponent
  }
];

export const EDITOR_ROUTING: ModuleWithProviders = RouterModule.forChild(
  routes
);
