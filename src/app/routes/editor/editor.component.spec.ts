import { DocumentComponent } from './components/document/document.component';
import { ListComponent } from './components/list/list.component';
import { FooterComponent } from './components/footer/footer.component';
import { LeftSidebarComponent } from './components/left-sidebar/leftSidebar.component';
import { LoaderComponent } from './../../components/loader/loader.component';
import { TooltipDirective } from './../../directives/tooltip.directive';
import { IconComponent } from './../../components/icon/icon.component';
import { SocketService } from './services/socket.service';
import { EditorComponent } from './editor.component';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MonacoEditorComponent } from './components/document/monaco-editor/monacoEditor.component';
import { socketServiceMock } from './services/socket.service.mock';

describe('EditorComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [
          EditorComponent,
          MonacoEditorComponent,
          IconComponent,
          TooltipDirective,
          LoaderComponent,
          LeftSidebarComponent,
          FooterComponent,
          ListComponent,
          DocumentComponent
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
