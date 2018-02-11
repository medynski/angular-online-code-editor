import { LoaderComponent } from './loader.component';
import { TestBed, async } from '@angular/core/testing';

describe('LoaderComponent ', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [LoaderComponent]
      }).compileComponents();
    })
  );

  it(
    'should create the LoaderComponent',
    async(() => {
      const fixture = TestBed.createComponent(LoaderComponent);
      const cmp = fixture.debugElement.componentInstance;
      expect(cmp).toBeTruthy();
    })
  );
});
