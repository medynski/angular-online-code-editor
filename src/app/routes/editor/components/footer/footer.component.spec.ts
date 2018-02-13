import { IconComponent } from './../../../../components/icon/icon.component';
import { FooterComponent } from './footer.component';
import { TestBed, async } from '@angular/core/testing';

describe('FooterComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [FooterComponent, IconComponent]
      }).compileComponents();
    })
  );

  it(
    'should create the FooterComponent',
    async(() => {
      const fixture = TestBed.createComponent(FooterComponent);
      const cmp = fixture.debugElement.componentInstance;
      expect(cmp).toBeTruthy();
    })
  );
});
