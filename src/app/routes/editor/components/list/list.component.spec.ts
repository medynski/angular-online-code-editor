import { ListComponent } from './list.component';
import { TestBed, async } from '@angular/core/testing';

describe('ListComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [ListComponent]
      }).compileComponents();
    })
  );

  it(
    'should create the ListComponent',
    async(() => {
      const fixture = TestBed.createComponent(ListComponent);
      const cmp = fixture.debugElement.componentInstance;
      expect(cmp).toBeTruthy();
    })
  );
});
