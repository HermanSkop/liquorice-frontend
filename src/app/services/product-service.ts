import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ProductPreviewDto} from '../dtos/product-preview.dto';
import {Injectable} from '@angular/core';
import {apiUrl} from '../app.config';
import {PagedResponse} from '../dtos/api-response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {
  }

  getProductPreviewDtos(page: number = 0, size: number = 10): Observable<PagedResponse<ProductPreviewDto>> {
    return this.http.get<PagedResponse<ProductPreviewDto>>(
      `${apiUrl}/products?page=${page}&size=${size}`
    );
  }
}
