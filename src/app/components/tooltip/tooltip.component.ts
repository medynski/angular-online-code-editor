import { Utils } from './../../common/utils';
import { PointInterface } from './../../interfaces/point.interface';
import { DirectionConst } from './../../constants/direction.const';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/distinctUntilChanged';

import {
  Component,
  Input,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'tooltip-component',
  templateUrl: './tooltip.html',
  styleUrls: ['./tooltip.css']
})
export class TooltipComponent implements OnInit, AfterViewInit {
  @Input() content = '';
  @Input()
  allowedDirections = new Array<DirectionConst>(
    'top',
    'right',
    'bottom',
    'left'
  );
  @Input() trigger: 'click' | 'hover' = 'hover';
  @Input() hostRef: ElementRef;
  @Input() offset = 10;
  @Input() display = true;
  @ViewChild('tooltipRef') tooltipRef: ElementRef;
  isVisible = false;
  direction: DirectionConst;

  private _subscriptions = new Array<Subscription>();
  private _position$ = new ReplaySubject<PointInterface>();

  constructor(public changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.direction = this.allowedDirections[0];
  }

  ngAfterViewInit() {
    if (this.trigger === 'click') {
      this._initClickHandlers();
    } else if (this.trigger === 'hover') {
      this._initHoverHandlers();
    }

    const clickedOutside$ = Observable.fromEvent(document, 'click').filter(
      ($event: MouseEvent) => this._filterTarget($event)
    );

    const tappedOutside$ = Observable.fromEvent(
      window.document,
      'touchstart'
    ).filter(($event: TouchEvent) => this._filterTarget($event));

    const windowResize$ = Observable.fromEvent(window, 'resize');
    const mouseWheel$ = Observable.fromEvent(document, 'mousewheel');

    this._subscriptions.push(
      Observable.merge(
        mouseWheel$,
        windowResize$,
        clickedOutside$,
        tappedOutside$
      )
        .filter(() => this.isVisible)
        .subscribe(() => this._hide()),

      this._position$
        .distinctUntilChanged()
        .subscribe((point: PointInterface) => this._updatePosition(point))
    );
  }

  private _initHoverHandlers(): void {
    this._subscriptions.push(
      Observable.merge(
        Observable.fromEvent(this.tooltipRef.nativeElement, 'mouseenter'),
        Observable.fromEvent(this.hostRef.nativeElement, 'mouseenter')
      ).subscribe(() => this._show()),

      Observable.merge(
        Observable.fromEvent(this.tooltipRef.nativeElement, 'mouseleave'),
        Observable.fromEvent(this.hostRef.nativeElement, 'mouseleave')
      ).subscribe(() => this._hide())
    );
  }

  private _initClickHandlers(): void {
    this._subscriptions.push(
      Observable.fromEvent(this.hostRef.nativeElement, 'click').subscribe(
        ($event: MouseEvent) => this._handleClick($event)
      )
    );
  }

  private _filterTarget($event: MouseEvent | TouchEvent): boolean {
    return (
      this.tooltipRef.nativeElement !== $event.target &&
      !Utils.isDescendantNode(this.tooltipRef.nativeElement, $event.target)
    );
  }

  private _handleClick($event: MouseEvent): void {
    $event.stopPropagation();

    if (this.isVisible) {
      this._hide();
    } else {
      this._show();
    }
  }

  private _show(): void {
    if (!this.display) {
      return;
    }

    this.tooltipRef.nativeElement.style.display = 'block';
    this._setDirectionAndPosition();
    this.tooltipRef.nativeElement.style.opacity = 1;
    this.isVisible = true;
  }

  private _hide(): void {
    this.tooltipRef.nativeElement.style.display = 'none';
    this.tooltipRef.nativeElement.style.opacity = 0;
    this.isVisible = false;
    this._changeDirection(this.allowedDirections[0]);
  }

  private _calculatePosition(): void {
    const tooltipBoundingRect = this.tooltipRef.nativeElement.getBoundingClientRect(),
      hostBoundingRect = this.hostRef.nativeElement.getBoundingClientRect(),
      hostCenterPoint = {
        x: Math.round(hostBoundingRect.left + hostBoundingRect.width / 2),
        y: Math.round(hostBoundingRect.top + hostBoundingRect.height / 2)
      };

    let x, y: number;

    if (this.direction === 'left' || this.direction === 'right') {
      // set top vertical
      y = hostCenterPoint.y - tooltipBoundingRect.height / 2;

      // set horizontal position
      if (this.direction === 'left') {
        x = hostBoundingRect.left - tooltipBoundingRect.width - this.offset;
      } else if (this.direction === 'right') {
        x = hostBoundingRect.right + this.offset;
      }
    } else if (this.direction === 'top' || this.direction === 'bottom') {
      // set horizontal position
      x = hostCenterPoint.x - tooltipBoundingRect.width / 2;

      // set vertical position
      if (this.direction === 'top') {
        y = hostBoundingRect.top - tooltipBoundingRect.height - this.offset;
      } else if (this.direction === 'bottom') {
        y = hostBoundingRect.bottom + this.offset;
      }
    }

    this._position$.next({ x, y });
    this._checkPosition();
  }

  private _checkPosition(): void {
    const bodyBoundingRect = window.document.body.getBoundingClientRect(),
      tooltipBoundingRect = this.tooltipRef.nativeElement.getBoundingClientRect();

    // check body viewport intersection
    if (
      tooltipBoundingRect.top < bodyBoundingRect.top ||
      tooltipBoundingRect.right > bodyBoundingRect.right ||
      tooltipBoundingRect.bottom > bodyBoundingRect.bottom ||
      tooltipBoundingRect.left < bodyBoundingRect.left
    ) {
      const nextDirection = this._findNextDirection();
      if (nextDirection) {
        this._changeDirection(nextDirection);
        this._setDirectionAndPosition();
      }
    }
  }

  private _changeDirection(direction: DirectionConst): void {
    this.direction = direction;
    this.changeDetectorRef.markForCheck();
  }

  private _findNextDirection(): DirectionConst {
    const currentIndex = this.allowedDirections.findIndex(
        (direction: string) => direction === this.direction
      ),
      nextIndex = currentIndex + 1,
      nextDirection = this.allowedDirections[nextIndex]
        ? this.allowedDirections[nextIndex]
        : null;

    return nextDirection;
  }

  private _setDirectionAndPosition(
    n: number = this.content.length <= 5 ? 1 : 10
  ): void {
    // @FIX: calculating n times because we have to wait for browser brake-word calculation
    this._subscriptions.push(
      Observable.timer(0, 1)
        .take(n)
        .subscribe(() => this._calculatePosition())
    );
  }

  private _updatePosition(point: PointInterface): void {
    this.tooltipRef.nativeElement.style.left = `${point.x}px`;
    this.tooltipRef.nativeElement.style.top = `${point.y}px`;
  }
}
