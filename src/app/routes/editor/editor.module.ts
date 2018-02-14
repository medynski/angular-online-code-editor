import { SearchComponent } from './components/list/search/search.component';
import { CreateComponent } from './components/list/create/create.component';
import { ListComponent } from './components/list/list.component';
import { LeftSidebarComponent } from './components/left-sidebar/leftSidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SharedModule } from './../../shared.module';
import { MonacoEditorComponent } from './components/document/monaco-editor/monacoEditor.component';
import { EditorComponent } from './editor.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { EDITOR_ROUTING } from './editor.routes';
import { SocketService } from './services/socket.service';
import { DocumentComponent } from './components/document/document.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EditorComponent,
    FooterComponent,
    LeftSidebarComponent,
    ListComponent,
    DocumentComponent,
    MonacoEditorComponent,
    CreateComponent,
    SearchComponent
  ],
  imports: [
    EDITOR_ROUTING,
    BrowserModule,
    RouterModule,
    SharedModule,
    FormsModule
  ],
  providers: [SocketService]
})
export class EditorModule {}
