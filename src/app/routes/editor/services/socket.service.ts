import { Subscription } from 'rxjs/Subscription';
import { environment } from './../../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Utils } from '../../../common/utils';
import * as io from 'socket.io-client';
import 'rxjs/add/observable/fromEvent';
import { Room } from '../interfaces/room.interface';

const ACTION_TYPING_INDICATOR = 'typing_indicator';
const ACTION_ONLINE_USERS = 'online_users';
const ACTION_GET_ONLINE_USERS = 'get_online_users';
const ACTION_SAVE_CONTENT = 'save_content';
const ACTION_GET_CONTENT = 'get_content';
const ACTION_JOIN_ROOM = 'join_room';
const ACTION_CREATE_ROOM = 'create_room';
const ACTION_GET_ROOM_LIST = 'get_room_list';
const ACTION_LEAVE_ROOM = 'leave_room';
const PUSH_ROOM_CREATED = 'push_room_created';

export class SocketService {
  socketEvents$ = new Observable<string>();
  onlineUsers$ = new Subject<number>();
  rooms$ = new BehaviorSubject<Array<Room>>(new Array());
  private _socket: any;
  private _subscriptions = new Array<Subscription>();
  private _roomId = null;

  constructor() {
    this._openConnection();
  }

  selectRoom(roomId: string): void {
    this._emit(ACTION_LEAVE_ROOM, { roomId: this._roomId }, () =>
      this.joinRoom(roomId)
    );
  }

  joinRoom(roomId: string): void {
    this._roomId = roomId;
    this._emit(ACTION_JOIN_ROOM, { roomId });
    this.fetchOnlineUsers();
  }

  sendTypingIndicator(message: string): void {
    this._emit(ACTION_TYPING_INDICATOR, { roomId: this._roomId, message });
  }

  saveContent(content: string, callback: Function): void {
    this._emit(
      ACTION_SAVE_CONTENT,
      { roomId: this._roomId, content },
      callback
    );
  }

  getContent(roomId: string): Promise<string> {
    return new Promise((resolve: Function, reject: Function) => {
      this._emit(ACTION_GET_CONTENT, { roomId }, (response: Room) => {
        if (response && response.content) {
          resolve(response.content);
        } else {
          reject();
        }
      });
    });
  }

  closeConnection(): void {
    this._subscriptions.forEach((subscription: Subscription) =>
      subscription.unsubscribe()
    );

    if (this._socket.connected) {
      this._socket.disconnect();
    }
  }

  fetchOnlineUsers(): void {
    this._emit(
      ACTION_GET_ONLINE_USERS,
      { roomId: this._roomId },
      (onlineUsers: number) => this.onlineUsers$.next(onlineUsers)
    );
  }

  createRoom(name: string): void {
    this._emit(ACTION_CREATE_ROOM, { name }, this.fetchRoomList.bind(this));
  }

  fetchRoomList(): void {
    this._emit(ACTION_GET_ROOM_LIST, {}, this._parseRooms.bind(this));
  }

  private _openConnection(): void {
    this._socket = io.connect(environment.apiUrl, {
      transports: environment.socketIoTransport,
      reconnection: true
    });

    this.fetchOnlineUsers();
    this.fetchRoomList();

    // handle socket messages
    this.socketEvents$ = Observable.fromEvent(
      this._socket,
      ACTION_TYPING_INDICATOR
    );
    this._subscriptions.push(
      Observable.fromEvent(this._socket, ACTION_ONLINE_USERS).subscribe(
        (onlineUsers: number) => this.onlineUsers$.next(onlineUsers)
      ),
      Observable.fromEvent(this._socket, PUSH_ROOM_CREATED).subscribe(
        this._parseRooms.bind(this)
      )
    );
  }

  private _emit(
    action: string,
    payload: { [key: string]: string },
    callback: Function = () => null
  ): void {
    this._socket.emit(action, payload, callback);
  }

  private _parseRooms(rooms: any): void {
    this.rooms$.next(
      Object.keys(rooms).map((key: string) => JSON.parse(rooms[key]))
    );
  }
}
