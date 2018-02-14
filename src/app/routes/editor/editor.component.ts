import { SocketService } from './services/socket.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilKeyChanged';

@Component({
  selector: 'app-root',
  templateUrl: './editor.html',
  styleUrls: ['./editor.css']
})
export class EditorComponent {
  isCreateActive = false;
  isSearchActive = false;

  constructor(
    public socketService: SocketService,
    activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params
      .distinctUntilKeyChanged('id')
      .map(params => params['id'])
      .subscribe((id: string) => socketService.selectRoom(id));
  }

  changeCreateState(state: boolean): void {
    this.isCreateActive = state;
  }

  changeSearchState(state: boolean): void {
    this.isSearchActive = state;
  }
}
