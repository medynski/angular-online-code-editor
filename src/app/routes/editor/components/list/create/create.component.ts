import { Component } from '@angular/core';
import { SocketService } from '../../../services/socket.service';

@Component({
  selector: 'create-component',
  templateUrl: './create.html',
  styleUrls: ['./create.css']
})
export class CreateComponent {
  name = '';

  constructor(public socketService: SocketService) {}

  create(): void {
    if (this.name.trim() !== '') {
      this.socketService.createRoom(this.name);
      this.name = '';
    }
  }
}
