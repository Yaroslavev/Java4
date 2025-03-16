import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {APP_ENV} from "../env";
import {CategoryModel} from "../models/CategoryModel.ts";

export const categoriesApi = createApi({
    reducerPath: 'categoriesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${APP_ENV.REMOTE_BASE_URL}/api/`,
        prepareHeaders: (headers, { getState }) =>  {
            const token = getState().auth.token;
            console.log(token);
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        getAllCategories: builder.query<CategoryModel[], void>({
            query: () => 'categories',
            providesTags: [{ type: 'Category', id: 'LIST' }],
        }),
        getCategoryById: builder.query<CategoryModel, void>({
            query: (id) => `categories/${id}`,
            providesTags: (result, error, id) => [{ type: 'Category' , id: `CATEGORY_${id}` }],
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
            invalidatesTags: (result, error, { id }) => [{ type: 'Category', id: 'LIST' }, { type: 'Category', id: `CATEGORY_${id}` }],
        }),
        deleteCategory: builder.mutation<void, number>({
            query: (id) => ({
                url: `categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Category', id: 'LIST' }],
        }),
    }),
});

export const { useGetAllCategoriesQuery,
                useGetCategoryByIdQuery,
                useCreateCategoryMutation,
                useUpdateCategoryMutation,
                useDeleteCategoryMutation
                } = categoriesApi;