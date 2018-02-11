import { PAGE_NOT_FOUND_ROUTING } from './pageNotFound.routes';
import { PageNotFoundComponent } from './pageNotFound.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [PAGE_NOT_FOUND_ROUTING, BrowserModule, RouterModule]
})
export class PageNotFoundModule {}
