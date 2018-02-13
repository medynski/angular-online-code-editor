import { Observable } from 'rxjs/Observable';
import { SocketService } from './../../services/socket.service';
import { MonacoEditorComponent } from './monaco-editor/monacoEditor.component';
import { Subscription } from 'rxjs/Subscription';
import { Component, ViewChild } from '@angular/core';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/finally';

const FREEZE_TIMEOUT = 2000;

@Component({
  selector: 'document-component',
  templateUrl: './document.html',
  styleUrls: ['./document.css']
})
export class DocumentComponent {
  @ViewChild('monacoRef') monacoRef: MonacoEditorComponent;
  value = null;
  readOnly = false;
  saving = false;
  private _timer: Subscription = null;

  constructor(public socketService: SocketService) {
    this.socketService
      .getContent()
      .then((content: string) => (this.value = content));

    this.socketService.socketEvents$.subscribe((event: string) => {
      this._freezeEditor();
      this.value = event;
      this.monacoRef.setValue(this.value);
    });
  }

  handleChanges(nextValue: string) {
    if (this.value !== nextValue) {
      this.value = nextValue;
      this.socketService.sendTypingIndicator(this.value);
    }
  }

  save(): void {
    this.saving = true;
    this.socketService.saveContent(this.value, () => (this.saving = false));
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
}
