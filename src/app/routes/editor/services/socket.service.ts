import { Subscription } from 'rxjs/Subscription';
import { environment } from './../../../../environments/environment';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromEvent';
import { Utils } from '../../../common/utils';

const TYPING_INDICATOR = 'typing_indicator';
const ONLINE_USERS = 'online_users';
const GET_ONLINE_USERS = 'get_online_users';
const SAVE_CONTENT = 'save_content';
const GET_CONTENT = 'get_content';
const JOIN_ROOM = 'join_room';
const CREATE_ROOM = 'create_room';

export class SocketService {
  socketEvents$ = new Observable<string>();
  onlineUsers$ = new Subject<number>();
  private _socket: any;
  private _subscription: Subscription;
  private _roomId = 'code';

  constructor() {
    this._socket = io.connect(environment.apiUrl, {
      transports: environment.socketIoTransport,
      reconnection: true
    });

    // join room
    this._emit(JOIN_ROOM, this._roomId);

    // get online users
    this._emit(GET_ONLINE_USERS, this._roomId, (onlineUsers: number) =>
      this.onlineUsers$.next(onlineUsers)
    );

    this._emit(
      CREATE_ROOM,
      { roomId: Utils.generateRandomString(), roomName: this._roomId },
      console.info
    );

    // handle socket messages
    this.socketEvents$ = Observable.fromEvent(this._socket, TYPING_INDICATOR);
    this._subscription = Observable.fromEvent(
      this._socket,
      ONLINE_USERS
    ).subscribe((onlineUsers: number) => this.onlineUsers$.next(onlineUsers));
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

  destroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }

    if (this._socket.connected) {
      this._socket.disconnect();
    }
  }

  private _emit(
    action: string,
    payload: any,
    callback: Function = () => null
  ): void {
    this._socket.emit(action, payload, callback);
  }
}
