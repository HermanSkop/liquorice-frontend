import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ProductPreviewDto} from '../dtos/product-preview.dto';
import {Injectable} from '@angular/core';
import {apiUrl, pageSize} from '../app.config';
import {PagedResponse} from '../dtos/api-response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {
  }

  getProductPreviewDtos(
    page: number = 0,
    size: number = pageSize,
    searchTerm?: string,
    category?: string,
    sortBy?: string
  ): Observable<PagedResponse<ProductPreviewDto>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (searchTerm) {
      params = params.set('search', searchTerm);
    }

    if (category) {
      params = params.set('categories', category);
    }

    if (sortBy) {
      params = params.set('sort', sortBy);
    }

    return this.http.get<PagedResponse<ProductPreviewDto>>(
      `${apiUrl}/products`, {params}
    );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${apiUrl}/products/categories`);
  }
}
