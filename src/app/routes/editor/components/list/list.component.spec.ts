import { IconComponent } from './../../../../components/icon/icon.component';
import { CreateComponent } from './create/create.component';
import { SearchComponent } from './search/search.component';
import { ListComponent } from './list.component';
import { TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketService } from '../../services/socket.service';
import { socketServiceMock } from '../../services/socket.service.mock';

describe('ListComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [
          ListComponent,
          SearchComponent,
          CreateComponent,
          IconComponent
        ],
        imports: [RouterTestingModule, FormsModule],
        providers: [{ provide: SocketService, useValue: socketServiceMock }]
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
