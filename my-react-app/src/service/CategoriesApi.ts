import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {APP_ENV} from "../env";
import {CategoryModel} from "../models/CategoryModel.ts";

export const categoriesApi = createApi({
    reducerPath: 'categoriesApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${APP_ENV.REMOTE_BASE_URL}/api/` }),
    endpoints: (builder) => ({
        getAllCategories: builder.query<CategoryModel[], void>({
            query: () => 'categories',
            providesTags: ['Category'],
        }),
        getCategoryById: builder.query<CategoryModel, void>({
            query: (id) => `categories/${id}`,
            providesTags: (result, error, id) => [{ type: 'Category' , id }],
        }),
        createCategory: builder.mutation<CategoryModel, Partial<CategoryModel>>({
            query: (category) => ({
                url: 'categories',
                method: 'POST',
                body: category,
            }),
            invalidatesTags: ['Category'],
        }),
        updateCategory: builder.mutation<CategoryModel, { id: number; category: Partial<CategoryModel> }>({
            query: ({ id, category }) => ({
                url: `categories/${id}`,
                method: 'PUT',
                body: category,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }],
        }),
        deleteCategory: builder.mutation<void, number>({
            query: (id) => ({
                url: `categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Category', id }],
        }),
    }),
});

export const { useGetAllCategoriesQuery,
                useGetCategoryByIdQuery,
                useCreateCategoryMutation,
                useUpdateCategoryMutation,
                useDeleteCategoryMutation
                } = categoriesApi;