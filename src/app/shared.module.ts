import { LoaderComponent } from './components/loader/loader.component';
import { TooltipDirective } from './directives/tooltip.directive';
import { IconComponent } from './components/icon/icon.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TooltipComponent } from './components/tooltip/tooltip.component';

@NgModule({
  declarations: [
    IconComponent,
    TooltipDirective,
    TooltipComponent,
    LoaderComponent
  ],
  imports: [BrowserModule],
  exports: [IconComponent, TooltipDirective, LoaderComponent],
  entryComponents: [TooltipComponent]
})
export class SharedModule {}
