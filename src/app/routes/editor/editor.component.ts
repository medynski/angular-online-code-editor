import { SocketService } from './services/socket.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilKeyChanged';
import { Room } from './interfaces/room.interface';

@Component({
  selector: 'app-root',
  templateUrl: './editor.html',
  styleUrls: ['./editor.css']
})
export class EditorComponent {
  isCreateActive = false;
  isSearchActive = false;
  private roomId: string;

  constructor(
    public socketService: SocketService,
    activatedRoute: ActivatedRoute
  ) {
    if (activatedRoute.snapshot.params.id) {
      this._selectRoom(activatedRoute.snapshot.params.id);
    }

    activatedRoute.params
      .distinctUntilKeyChanged('id')
      .map(params => params['id'])
      .subscribe(this._selectRoom.bind(this));
  }

  get selectedRoom(): Room {
    return this.socketService.rooms$.value.find(
      (room: Room) => room.id === this.roomId
    );
  }

  changeCreateState(state: boolean): void {
    this.isCreateActive = state;
  }

  changeSearchState(state: boolean): void {
    this.isSearchActive = state;
  }

  private _selectRoom(id: string): void {
    this.roomId = id;
    this.socketService.selectRoom(this.roomId);
  }
}
