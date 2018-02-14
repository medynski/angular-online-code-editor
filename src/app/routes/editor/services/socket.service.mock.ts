import { EventEmitter } from '@angular/core';

export const socketServiceMock = {
  socketEvents$: new EventEmitter<string>(),
  onlineUsers$: new EventEmitter<number>(),
  sendTypingIndicator: value => null,
  saveContent: value => null,
  selectRoom: value => null,
  getContent: () =>
    new Promise((resolve: Function, reject: Function) => resolve())
};
