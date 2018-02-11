import { Component, Input } from '@angular/core';

@Component({
  selector: 'loader-component',
  styleUrls: ['./loader.css'],
  templateUrl: './loader.html'
})
export class LoaderComponent {
  @Input() dark = true;
  @Input() white = false;
  @Input() small = true;
  @Input() fullWidth = false;
}
