import { SocketService } from './services/socket.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './editor.html',
  styleUrls: ['./editor.css']
})
export class EditorComponent {
  constructor(public socketService: SocketService) {}
}
