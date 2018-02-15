import { Observable } from 'rxjs/Observable';
import { SocketService } from './../../services/socket.service';
import { MonacoEditorComponent } from './monaco-editor/monacoEditor.component';
import { Subscription } from 'rxjs/Subscription';
import {
  Component,
  ViewChild,
  Input,
  OnChanges,
  OnInit,
  SimpleChange
} from '@angular/core';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/finally';

const FREEZE_TIMEOUT = 2000;

@Component({
  selector: 'document-component',
  templateUrl: './document.html',
  styleUrls: ['./document.css']
})
export class DocumentComponent implements OnInit, OnChanges {
  @Input() roomId: string;
  @ViewChild('monacoRef') monacoRef: MonacoEditorComponent;
  value = null;
  readOnly = false;
  saving = false;
  private _timer: Subscription = null;

  constructor(public socketService: SocketService) {
    this.socketService.socketEvents$.subscribe((event: string) => {
      this._freezeEditor();
      this._setValue(event);
    });
  }

  ngOnInit(): void {
    this._tryFetchValue();
  }

  ngOnChanges(changes: any): void {
    this._tryFetchValue();
  }

  handleChanges(nextValue: string) {
    if (this.value !== nextValue) {
      this.value = nextValue;
      this.socketService.sendTypingIndicator(this.value);
    }
  }

  save(): void {
    this.saving = true;
    this.socketService.saveContent(this.value, room => (this.saving = false));
  }

  private _freezeEditor(): void {
    const changeReadOnlyState = () => this.monacoRef.setReadOnly(this.readOnly);

    const setTimer = () => {
      this._timer = Observable.timer(FREEZE_TIMEOUT)
        .take(1)
        .finally(() => (this._timer = null))
        .subscribe(() => {
          this.readOnly = false;
          changeReadOnlyState();
        });
    };

    if (this._timer === null) {
      this.readOnly = true;
      changeReadOnlyState();
    } else {
      this._timer.unsubscribe();
    }

    setTimer();
  }

  private _setValue(value: string): void {
    this.value = value;
    this.monacoRef.setValue(this.value);
  }

  private _tryFetchValue(): void {
    if (this.roomId) {
      this.socketService
        .getContent(this.roomId)
        .then((content: string) => this._setValue(content))
        .catch(() => (this.value = ''));
    }
  }
}
