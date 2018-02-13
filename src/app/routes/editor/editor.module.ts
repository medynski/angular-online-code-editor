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

@NgModule({
  declarations: [
    EditorComponent,
    FooterComponent,
    LeftSidebarComponent,
    ListComponent,
    DocumentComponent,
    MonacoEditorComponent
  ],
  imports: [EDITOR_ROUTING, BrowserModule, RouterModule, SharedModule],
  providers: [SocketService]
})
export class EditorModule {}
