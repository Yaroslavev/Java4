import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {APP_ENV} from "../env";
import {ProductModel} from "../models/Product.ts";

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${APP_ENV.REMOTE_BASE_URL}/api/` }),
    endpoints: (builder) => ({
        getAllProducts: builder.query<ProductModel[], void>({
            query: () => 'products',
            providesTags: [{ type: 'Product', id: 'LIST' }],
        }),
        getProductById: builder.query<ProductModel, number>({
            query: (id) => `products/${id}`,
            providesTags: (result, error, id) => [{ type: 'Product', id: `PRODUCT_${id}` }],
        }),
        createProduct: builder.mutation<ProductModel, Partial<ProductModel>>({
            query: (product) => ({
                url: 'products',
                method: 'POST',
                body: product,
            }),
            invalidatesTags: ['Product'],
        }),
        updateProduct: builder.mutation<ProductModel, { id: number; body: FormData }>({
            query: ({ id, body }) => ({
                url: `products/${id}`,
                method: 'PUT',
                body,
                formData: true,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Product', id: 'LIST' }, { type: 'Product', id: `PRODUCT_${id}` }],
        }),
        deleteProduct: builder.mutation<void, number>({
            query: (id) => ({
                url: `products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),
    }),
});

export const { useGetAllProductsQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} = productsApi;
