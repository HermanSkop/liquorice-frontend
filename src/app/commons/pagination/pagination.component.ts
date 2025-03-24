import { Component, EventEmitter, Input, Output } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {pageSize} from '../../app.config';

@Component({
  selector: 'app-pagination',
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './pagination.component.html'
})
export class PaginationComponent {
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;
  @Input() pageSize: number = pageSize;
  @Input() totalItems: number = 0;

  @Output() pageChange = new EventEmitter<number>();

  getVisiblePages(): number[] {
    const delta = 2;
    const pages: number[] = [];
    const leftBound = Math.max(2, this.currentPage - delta + 1);
    const rightBound = Math.min(this.totalPages - 1, this.currentPage + delta + 1);

    for (let i = leftBound; i <= rightBound; i++) {
      pages.push(i);
    }
    return pages;
  }

  getLastItemIndex(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalItems);
  }
}
