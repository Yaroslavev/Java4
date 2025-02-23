import {CategoryModel} from "./CategoryModel.ts";
import {ProductImageModel} from "./ProductImage.ts";

export interface ProductModel {
    id: number;
    name: string;
    cost: number;
    category: CategoryModel;
    images: ProductImageModel[];
}

export interface ProductCreate {
    name: string;
    cost: number;
    categoryId: number;
    images: File[];
}