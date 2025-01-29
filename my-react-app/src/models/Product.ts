import {CategoryModel} from "./CategoryModel.ts";

export interface ProductModel {
    id: number;
    name: string;
    cost: number;
    category: CategoryModel;
    image: string;
}

export interface ProductCreate {
    name: string;
    cost: number;
    categoryId: number;
    image: File | null;
}