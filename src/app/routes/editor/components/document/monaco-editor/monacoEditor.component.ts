import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  EventEmitter,
  Output,
  Input
} from '@angular/core';

@Component({
  selector: 'monaco-editor',
  templateUrl: './monacoEditor.html',
  styleUrls: ['./monacoEditor.css']
})
export class MonacoEditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('wrapperRef') wrapperRef: ElementRef;
  @Input() value: string;
  @Output() changesEmitter = new EventEmitter<string>();
  private _editor: any;
  private _subscription: Subscription;

  ngAfterViewInit(): void {
    if (!window.require) {
      const loader = document.createElement('script');
      loader.type = 'text/javascript';
      loader.src = '/monaco-editor/min/vs/loader.js';
      loader.addEventListener('load', this._loadMonaco.bind(this));
      document.body.appendChild(loader);
    } else {
      this._loadMonaco();
    }
  }

  ngOnDestroy(): void {
    if (this._editor) {
      this._editor.dispose();
      this._subscription.unsubscribe();
    }
  }

  setValue(value: string): void {
    this.value = value;
    if (this._editor) {
      this._editor.getModel().setValue(value);
    }
  }

  setReadOnly(readOnly: boolean): void {
    this._editor.updateOptions({ readOnly });
  }

  private _loadMonaco(): void {
    window.require.config({ paths: { vs: 'monaco-editor/min/vs' } });
    window.require(['vs/editor/editor.main'], this._initMonaco.bind(this));
  }

  private _initMonaco(): void {
    this._editor = window.monaco.editor.create(this.wrapperRef.nativeElement, {
      value: this.value,
      language: 'javascript'
    });

    window.monaco.editor.setTheme('vs-dark');

    this._editor
      .getModel()
      .onDidChangeContent(this._propagateChanges.bind(this));

    this._subscription = Observable.fromEvent(window, 'resize').subscribe(() =>
      this._editor.layout()
    );
  }

  private _propagateChanges(): void {
    this.changesEmitter.next(this._editor.getModel().getValue());
  }
}
