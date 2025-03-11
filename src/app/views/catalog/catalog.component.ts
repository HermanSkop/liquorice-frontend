import {Component, OnInit} from '@angular/core';
import {NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ProductService} from '../../services/product-service';
import {ProductPreviewDto} from '../../dtos/product-preview.dto';
import {PagedResponse} from '../../dtos/api-response';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  imports: [
    NgForOf,
    FormsModule
  ],
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = '';
  sortOption: string = 'name';
  isSingleColumn: boolean = false;

  products: ProductPreviewDto[] = [];

  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;

  constructor(private productService: ProductService) {
  }

  categories = ['Electronics', 'Accessories', 'Fashion'];

  filteredProducts() {
    return this.products
      .filter(product => {
        const matchesSearch = !this.searchTerm ||
          product.name.toLowerCase().includes(this.searchTerm.toLowerCase());

        const matchesCategory = !this.selectedCategory ||
          (product.categories &&
            product.categories.some(cat => cat.name === this.selectedCategory));

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => this.sortOption === 'price' ? a.price - b.price : a.name.localeCompare(b.name));
  }

  toggleLayout() {
    this.isSingleColumn = !this.isSingleColumn;
  }

  ngOnInit() {
    this.loadPage(this.currentPage);
  }

  loadPage(page: number) {
    this.productService.getProductPreviewDtos(page, this.pageSize).subscribe({
      next: (response: PagedResponse<ProductPreviewDto>) => {
        console.log("API Response:", response);
        this.products = response.content || [];
        this.totalItems = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
      },
      error: error => {
        console.error('There was an error!', error);
      }
    });
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.loadPage(this.currentPage - 1);
    }
  }

  getTotalPagesArray(): number[] {
    return Array.from({length: this.totalPages}, (_, i) => i + 1);
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
}
