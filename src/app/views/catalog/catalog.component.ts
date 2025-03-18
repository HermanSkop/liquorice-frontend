import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ProductService} from '../../services/product.service';
import {ProductPreviewDto} from '../../dtos/product-preview.dto';
import {PagedResponse} from '../../dtos/api-response';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  imports: [NgForOf, FormsModule, NgIf],
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = '';
  categories:string[] = [];
  sortOption: string = 'name';
  isSingleColumn: boolean = false;

  products: ProductPreviewDto[] = [];

  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;

  constructor(private productService: ProductService) {
  }

  toggleLayout() {
    this.isSingleColumn = !this.isSingleColumn;
  }

  ngOnInit() {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loadPage(this.currentPage);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loadPage(this.currentPage);
      }
    });
  }

  loadPage(page: number) {
    this.productService.getProductPreviewDtos(
      page,
      this.pageSize,
      this.searchTerm,
      this.selectedCategory,
      this.sortOption
    ).subscribe({
      next: (response: PagedResponse<ProductPreviewDto>) => {
        console.log(response);
        this.products = response.content || [];
        this.totalItems = response.totalElements || 0;
        this.totalPages = response.totalPages || 1;
        this.currentPage = response.pageNumber || 0;
      },
      error: error => {
        console.error('There was an error!', error);
      }
    });
  }

  onFilterChange() {
    this.currentPage = 0;
    this.loadPage(0);
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.loadPage(this.currentPage - 1);
    }
  }

  goToPage(page: number) {
    this.loadPage(page);
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.loadPage(this.currentPage + 1);
    }
  }

  getLastItemIndex(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalItems);
  }

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

  isLastPageVisible(): boolean {
    return this.getVisiblePages().includes(this.totalPages);
  }
}
