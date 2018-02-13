import { IconComponent } from './../../../../components/icon/icon.component';
import { LeftSidebarComponent } from './leftSidebar.component';
import { TestBed, async } from '@angular/core/testing';

describe('LeftSidebarComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [LeftSidebarComponent, IconComponent]
      }).compileComponents();
    })
  );

  it(
    'should create the LeftSidebarComponent',
    async(() => {
      const fixture = TestBed.createComponent(LeftSidebarComponent);
      const cmp = fixture.debugElement.componentInstance;
      expect(cmp).toBeTruthy();
    })
  );
});
