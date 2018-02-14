import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'left-sidebar',
  templateUrl: './leftSidebar.html',
  styleUrls: ['./leftSidebar.css']
})
export class LeftSidebarComponent {
  @Output() createStateEmitter = new EventEmitter<boolean>();
  @Output() searchStateEmitter = new EventEmitter<boolean>();
  isCreateActive = false;
  isSearchActive = false;

  toggleCreateState(): void {
    this.isCreateActive = !this.isCreateActive;
    this.createStateEmitter.next(this.isCreateActive);
  }

  toggleSearchState(): void {
    this.isSearchActive = !this.isSearchActive;
    this.searchStateEmitter.next(this.isSearchActive);
  }
}
