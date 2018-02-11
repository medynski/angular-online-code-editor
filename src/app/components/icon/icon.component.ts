import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-component',
  templateUrl: './icon.html',
  styleUrls: ['./icon.css']
})
export class IconComponent {
  @Input() name: string;
  @Input() size: 18 | 24 | 36 | 48 = 24;
}
