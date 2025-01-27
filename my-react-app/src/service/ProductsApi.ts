import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {APP_ENV} from "../env";
import {ProductModel} from "../models/Product.ts";

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${APP_ENV.REMOTE_BASE_URL}/api/` }),
    endpoints: (builder) => ({
        getAllProducts: builder.query<ProductModel[], void>({
            query: () => 'products',
            providesTags: ['Product'],
        }),
        getProductById: builder.query<ProductModel, void>({
            query: (id) => `products/${id}`,
            providesTags: (result, error, id) => [{ type: 'Category' , id }],
        }),
        createProduct: builder.mutation<ProductModel, Partial<ProductModel>>({
            query: (product) => ({
                url: 'products',
                method: 'POST',
                body: product,
            }),
            invalidatesTags: ['Category'],
        }),
        updateProduct: builder.mutation<ProductModel, { id: number; product: Partial<ProductModel> }>({
            query: ({ id, product }) => ({
                url: `products/${id}`,
                method: 'PUT',
                body: product,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }],
        }),
        deleteProduct: builder.mutation<void, number>({
            query: (id) => ({
                url: `products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Category', id }],
        }),
    }),
});

export const { useGetAllProductsQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} = productsApi;
