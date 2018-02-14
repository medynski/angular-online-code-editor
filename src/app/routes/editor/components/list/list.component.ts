import { Component, Input } from '@angular/core';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'list-component',
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class ListComponent {
  @Input() isCreateActive = false;
  @Input() isSearchActive = false;

  constructor(public socketService: SocketService) {}
}
