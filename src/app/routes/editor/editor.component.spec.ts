import { LoaderComponent } from './../../components/loader/loader.component';
import { TooltipDirective } from './../../directives/tooltip.directive';
import { IconComponent } from './../../components/icon/icon.component';
import { SocketService } from './services/socket.service';
import { EditorComponent } from './editor.component';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MonacoEditorComponent } from './components/monaco-editor/monacoEditor.component';
import { EventEmitter } from '@angular/core';

const socketServiceMock = {
  socketEvents$: new EventEmitter<string>(),
  onlineUsers$: new EventEmitter<number>(),
  sendTypingIndicator: value => null,
  saveContent: value => null,
  getContent: () =>
    new Promise((resolve: Function, reject: Function) => resolve())
};

describe('EditorComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [
          EditorComponent,
          MonacoEditorComponent,
          IconComponent,
          TooltipDirective,
          LoaderComponent
        ],
        imports: [RouterTestingModule],
        providers: [{ provide: SocketService, useValue: socketServiceMock }]
      }).compileComponents();
    })
  );

  it(
    'should create the editor page',
    async(() => {
      const fixture = TestBed.createComponent(EditorComponent);
      const cmp = fixture.debugElement.componentInstance;
      expect(cmp).toBeTruthy();
    })
  );
});
