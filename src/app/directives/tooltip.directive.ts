import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { DirectionConst } from '../constants/direction.const';
import { TooltipComponent } from '../components/tooltip/tooltip.component';

import {
  Directive,
  Input,
  ViewContainerRef,
  ComponentRef,
  ComponentFactoryResolver,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Directive({
  selector: '[tooltip]'
})
export class TooltipDirective implements AfterViewInit, OnChanges {
  @Input() tooltip: string;
  @Input() tooltipDirections = new Array<DirectionConst>('right');
  @Input() tooltipOffset = 10;
  @Input() tooltipTrigger: 'click' | 'hover' = 'hover';
  @Input() tooltipDisplay = true;

  private _componentRef: ComponentRef<TooltipComponent>;
  private _tooltipRef: TooltipComponent;
  private _subscriptions = new Array<Subscription>();

  constructor(
    private _elementRef: ElementRef,
    private _viewContainerRef: ViewContainerRef,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this._injectTooltipComponent();
    this._subscriptions.push(
      Observable.timer(500).subscribe(() =>
        this._changeDetectorRef.markForCheck()
      )
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    const tooltipDisplay = changes.tooltipDisplay;
    if (tooltipDisplay && this._tooltipRef) {
      this._tooltipRef.display = tooltipDisplay.currentValue;
    }
  }

  private _injectTooltipComponent(): void {
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
      TooltipComponent
    );
    this._componentRef = this._viewContainerRef.createComponent(
      componentFactory
    );
    this._tooltipRef = <TooltipComponent>this._componentRef.instance;
    this._tooltipRef.content = this.tooltip;
    this._tooltipRef.allowedDirections = this.tooltipDirections;
    this._tooltipRef.offset = this.tooltipOffset;
    this._tooltipRef.trigger = this.tooltipTrigger;
    this._tooltipRef.hostRef = this._elementRef;
    this._tooltipRef.changeDetectorRef.detectChanges();
  }
}
