import { TestBed, async } from '@angular/core/testing';
import { IconComponent } from '../../../../../components/icon/icon.component';
import { SearchComponent } from './search.component';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../../services/socket.service';
import { socketServiceMock } from '../../../services/socket.service.mock';

describe('SearchComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [SearchComponent, IconComponent],
        imports: [FormsModule],
        providers: [{ provide: SocketService, useValue: socketServiceMock }]
      }).compileComponents();
    })
  );

  it(
    'should create the SearchComponent',
    async(() => {
      const fixture = TestBed.createComponent(SearchComponent);
      const cmp = fixture.debugElement.componentInstance;
      expect(cmp).toBeTruthy();
    })
  );
});
