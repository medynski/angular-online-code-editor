import { Subscription } from 'rxjs/Subscription';
import { environment } from './../../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Utils } from '../../../common/utils';
import * as io from 'socket.io-client';
import 'rxjs/add/observable/fromEvent';

const TYPING_INDICATOR = 'typing_indicator';
const ONLINE_USERS = 'online_users';
const GET_ONLINE_USERS = 'get_online_users';
const SAVE_CONTENT = 'save_content';
const GET_CONTENT = 'get_content';
const JOIN_ROOM = 'join_room';
const CREATE_ROOM = 'create_room';
const GET_ROOM_LIST = 'get_room_list';
const LEAVE_ROOM = 'leave_room';

interface Rooms {
  readonly id: string;
  readonly name: string;
}

export class SocketService {
  socketEvents$ = new Observable<string>();
  onlineUsers$ = new Subject<number>();
  rooms$ = new BehaviorSubject<Array<Rooms>>(new Array());
  private _socket: any;
  private _subscription: Subscription;
  private _roomId = 'code';

  constructor() {
    this._openConnection();
  }

  selectRoom(roomId: string): void {
    this._emit(LEAVE_ROOM, this._roomId, () => this.joinRoom(roomId));
  }

  joinRoom(roomId: string): void {
    this._emit(JOIN_ROOM, roomId);
    this._roomId = roomId;
  }

  sendTypingIndicator(message: string): void {
    this._emit(TYPING_INDICATOR, { roomId: this._roomId, message });
  }

  saveContent(content: string, callback: Function): void {
    this._emit(SAVE_CONTENT, { roomId: this._roomId, content }, callback);
  }

  getContent(): Promise<string> {
    return new Promise((resolve: Function, reject: Function) => {
      this._emit(GET_CONTENT, this._roomId, (response: string) =>
        resolve(response)
      );
    });
  }

  closeConnection(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }

    if (this._socket.connected) {
      this._socket.disconnect();
    }
  }

  fetchOnlineUsers(): void {
    this._emit(GET_ONLINE_USERS, this._roomId, (onlineUsers: number) =>
      this.onlineUsers$.next(onlineUsers)
    );
  }

  createRoom(name: string): void {
    this._emit(CREATE_ROOM, name, () => this.fetchRoomList());
  }

  fetchRoomList(): void {
    this._emit(GET_ROOM_LIST, {}, rooms => this.rooms$.next(rooms));
  }

  private _openConnection(): void {
    this._socket = io.connect(environment.apiUrl, {
      transports: environment.socketIoTransport,
      reconnection: true
    });

    this.joinRoom(this._roomId);
    this.fetchOnlineUsers();
    this.fetchRoomList();

    // handle socket messages
    this.socketEvents$ = Observable.fromEvent(this._socket, TYPING_INDICATOR);
    this._subscription = Observable.fromEvent(
      this._socket,
      ONLINE_USERS
    ).subscribe((onlineUsers: number) => this.onlineUsers$.next(onlineUsers));
  }

  private _emit(
    action: string,
    payload: any,
    callback: Function = () => null
  ): void {
    this._socket.emit(action, payload, callback);
  }
}
