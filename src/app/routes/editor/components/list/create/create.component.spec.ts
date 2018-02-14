import { FormsModule } from '@angular/forms';
import { CreateComponent } from './create.component';
import { TestBed, async } from '@angular/core/testing';
import { IconComponent } from '../../../../../components/icon/icon.component';
import { SocketService } from '../../../services/socket.service';
import { socketServiceMock } from '../../../services/socket.service.mock';

describe('CreateComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [CreateComponent, IconComponent],
        imports: [FormsModule],
        providers: [{ provide: SocketService, useValue: socketServiceMock }]
      }).compileComponents();
    })
  );

  it(
    'should create the CreateComponent',
    async(() => {
      const fixture = TestBed.createComponent(CreateComponent);
      const cmp = fixture.debugElement.componentInstance;
      expect(cmp).toBeTruthy();
    })
  );
});
