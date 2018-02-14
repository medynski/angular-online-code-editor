import { Component } from '@angular/core';
import { SocketService } from '../../../services/socket.service';

@Component({
  selector: 'search-component',
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class SearchComponent {
  query = '';

  constructor(public socketService: SocketService) {}

  search(): void {
    if (this.query.trim() !== '') {
      // this.socketService.createRoom(this.search);
      this.query = '';
    }
  }
}
