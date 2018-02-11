import { TooltipComponent } from './tooltip.component';
import { TestBed, async } from '@angular/core/testing';

describe('TooltipComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [TooltipComponent]
      }).compileComponents();
    })
  );

  it(
    'should create the TooltipComponent',
    async(() => {
      const fixture = TestBed.createComponent(TooltipComponent);
      const cmp = fixture.debugElement.componentInstance;
      expect(cmp).toBeTruthy();
    })
  );
});
