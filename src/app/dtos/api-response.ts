export interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  sort: any;
  empty: boolean;
}


export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}
