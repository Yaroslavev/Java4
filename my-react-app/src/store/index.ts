import { configureStore } from '@reduxjs/toolkit';
import {categoriesApi} from "../service/CategoriesApi.ts";
import {productsApi} from "../service/ProductsApi.ts";
import {authApi} from "../service/AuthApi.ts";
import authReducer from "../slices/AuthSlice.ts";

export const store = configureStore({
    reducer: {
        [categoriesApi.reducerPath]: categoriesApi.reducer,
        [productsApi.reducerPath]: productsApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(categoriesApi.middleware)
            .concat(productsApi.middleware)
            .concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;