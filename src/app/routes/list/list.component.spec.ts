import { ListComponent } from './list.component';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [ListComponent],
        imports: [RouterTestingModule]
      }).compileComponents();
    })
  );

  it(
    'should create the list page',
    async(() => {
      const fixture = TestBed.createComponent(ListComponent);
      const cmp = fixture.debugElement.componentInstance;
      expect(cmp).toBeTruthy();
    })
  );
});
