export interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

export interface ProductDetails extends Product {
  description: string;
}

export type ProductUpdate = Pick<ProductDetails, 'title' | 'description' | 'price'>;

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export type SortOrder = 'asc' | 'desc';
