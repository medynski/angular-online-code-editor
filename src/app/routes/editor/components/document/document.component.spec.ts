import { LoaderComponent } from './../../../../components/loader/loader.component';
import { MonacoEditorComponent } from './monaco-editor/monacoEditor.component';
import { IconComponent } from './../../../../components/icon/icon.component';
import { DocumentComponent } from './document.component';
import { TestBed, async } from '@angular/core/testing';
import { TooltipDirective } from '../../../../directives/tooltip.directive';
import { SocketService } from '../../services/socket.service';
import { socketServiceMock } from '../../services/socket.service.mock';

describe('DocumentComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [
          DocumentComponent,
          TooltipDirective,
          IconComponent,
          MonacoEditorComponent,
          LoaderComponent
        ],
        providers: [{ provide: SocketService, useValue: socketServiceMock }]
      }).compileComponents();
    })
  );

  it(
    'should create the DocumentComponent',
    async(() => {
      const fixture = TestBed.createComponent(DocumentComponent);
      const cmp = fixture.debugElement.componentInstance;
      expect(cmp).toBeTruthy();
    })
  );
});
