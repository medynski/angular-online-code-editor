import { PageNotFoundModule } from './routes/page-not-found/pageNotFound.module';
import { EditorModule } from './routes/editor/editor.module';
import { EditorComponent } from './routes/editor/editor.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    EditorModule,
    PageNotFoundModule,
    RouterModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
