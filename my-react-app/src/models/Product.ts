export interface ProductModel {
    id: number;
    name: string;
    cost: number;
    categoryId: number;
    image: string;
}

export interface ProductCreate {
    name: string;
    cost: number;
    categoryId: number;
    image: File | null;
}