import { IconComponent } from './icon.component';
import { TestBed, async } from '@angular/core/testing';

describe('IconComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [IconComponent]
      }).compileComponents();
    })
  );

  it(
    'should create the icon',
    async(() => {
      const fixture = TestBed.createComponent(IconComponent);
      const cmp = fixture.debugElement.componentInstance;
      expect(cmp).toBeTruthy();
    })
  );

  it(
    'should render "lock" in a <i> tag',
    async(() => {
      const fixture = TestBed.createComponent(IconComponent);
      const cmp = fixture.debugElement.componentInstance;
      cmp.name = 'lock';
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('i').textContent).toContain('lock');
    })
  );
});
