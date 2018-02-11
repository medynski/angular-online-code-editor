import { SharedModule } from './../../shared.module';
import { MonacoEditorComponent } from './components/monaco-editor/monacoEditor.component';
import { EditorComponent } from './editor.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { EDITOR_ROUTING } from './editor.routes';
import { SocketService } from './services/socket.service';

@NgModule({
  declarations: [EditorComponent, MonacoEditorComponent],
  imports: [EDITOR_ROUTING, BrowserModule, RouterModule, SharedModule],
  providers: [SocketService]
})
export class EditorModule {}
