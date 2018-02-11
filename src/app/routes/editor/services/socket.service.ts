import { Subscription } from 'rxjs/Subscription';
import { environment } from './../../../../environments/environment';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromEvent';

const ROOM = 'room';
const ROOM_ID = 'code';
const TYPING_INDICATOR = 'typing_indicator';
const ONLINE_USERS = 'online_users';
const GET_ONLINE_USERS = 'get_online_users';
const SAVE_CONTENT = 'save_content';
const GET_CONTENT = 'get_content';

export class SocketService {
  socketEvents$ = new Observable<string>();
  onlineUsers$ = new Subject<number>();
  private _socket: any;
  private _subscription: Subscription;

  constructor() {
    this._socket = io.connect(environment.apiUrl, {
      transports: environment.socketIoTransport,
      reconnection: true
    });

    // join room
    this._emit(ROOM, ROOM_ID);

    // get online users
    this._emit(GET_ONLINE_USERS, ROOM_ID, (onlineUsers: number) =>
      this.onlineUsers$.next(onlineUsers)
    );

    // handle socket messages
    this.socketEvents$ = Observable.fromEvent(this._socket, TYPING_INDICATOR);
    this._subscription = Observable.fromEvent(
      this._socket,
      ONLINE_USERS
    ).subscribe((onlineUsers: number) => this.onlineUsers$.next(onlineUsers));
  }

  sendTypingIndicator(value: string): void {
    this._emit(TYPING_INDICATOR, value);
  }

  saveContent(value: string, callback: Function): void {
    this._emit(SAVE_CONTENT, value, callback);
  }

  getContent(): Promise<string> {
    return new Promise((resolve: Function, reject: Function) => {
      this._emit(GET_CONTENT, ROOM_ID, (response: string) => {
        resolve(response);
      });
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
    message: string,
    callback: Function = () => null
  ): void {
    this._socket.emit(action, message, callback);
  }
}
