import { ListComponent } from './list.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LIST_ROUTING } from './list.routes';

@NgModule({
  declarations: [ListComponent],
  imports: [LIST_ROUTING, BrowserModule, RouterModule]
})
export class ListModule {}
