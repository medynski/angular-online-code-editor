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

  toggleCreate(): void {
    if (this.isCreateActive) {
      this.hideCreate();
    } else {
      this.showCreate();
    }
  }

  toggleSearch(): void {
    if (this.isSearchActive) {
      this.hideSearch();
    } else {
      this.showSearch();
    }
  }

  showCreate(): void {
    this.hideSearch();
    this.isCreateActive = true;
    this.createStateEmitter.next(this.isCreateActive);
  }

  hideCreate(): void {
    this.isCreateActive = false;
    this.createStateEmitter.next(this.isCreateActive);
  }

  showSearch(): void {
    this.hideCreate();
    this.isSearchActive = true;
    this.searchStateEmitter.next(this.isSearchActive);
  }

  hideSearch(): void {
    this.isSearchActive = false;
    this.searchStateEmitter.next(this.isSearchActive);
  }
}
