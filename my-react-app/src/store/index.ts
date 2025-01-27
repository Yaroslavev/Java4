import { configureStore } from '@reduxjs/toolkit';
import {categoriesApi} from "../service/CategoriesApi.ts";
import {productsApi} from "../service/ProductsApi.ts";

export const store = configureStore({
    reducer: {
        [categoriesApi.reducerPath]: categoriesApi.reducer,
        [productsApi.reducerPath]: productsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(categoriesApi.middleware)
            .concat(productsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;