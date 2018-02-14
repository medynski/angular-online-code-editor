import { MonacoEditorComponent } from './monacoEditor.component';
import { TestBed, async } from '@angular/core/testing';

describe('MonacoEditorComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [MonacoEditorComponent]
      }).compileComponents();
    })
  );

  it(
    'should create the MonacoEditorComponent',
    async(() => {
      const fixture = TestBed.createComponent(MonacoEditorComponent);
      const cmp = fixture.debugElement.componentInstance;
      expect(cmp).toBeTruthy();
    })
  );
});
