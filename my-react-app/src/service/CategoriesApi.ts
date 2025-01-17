import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {APP_ENV} from "../env";
import {CategoryModel} from "../models/CategoryModel.ts";

export const categoriesApi = createApi({
    reducerPath: 'categoriesApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${APP_ENV.REMOTE_BASE_URL}/api/` }),
    endpoints: (builder) => ({
        getAllCategories: builder.query<CategoryModel[], void>({
            query: () => 'categories',
        }),
    }),
});

export const { useGetAllCategoriesQuery } = categoriesApi;