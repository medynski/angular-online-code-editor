import { PageNotFoundComponent } from './pageNotFound.component';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('PageNotFoundComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [PageNotFoundComponent],
        imports: [RouterTestingModule]
      }).compileComponents();
    })
  );

  it(
    'should create the page',
    async(() => {
      const fixture = TestBed.createComponent(PageNotFoundComponent);
      const cmp = fixture.debugElement.componentInstance;
      expect(cmp).toBeTruthy();
    })
  );

  it(
    'should render "Page not found." in a h1 tag',
    async(() => {
      const fixture = TestBed.createComponent(PageNotFoundComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h1').textContent).toContain(
        'Page not found.'
      );
    })
  );
});
