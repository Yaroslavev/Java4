import {BaseQueryMeta, BaseQueryResult, createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {APP_ENV} from "../env";

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${APP_ENV.REMOTE_BASE_URL}/api/`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: 'auth/login',
                method: 'POST',
                body: credentials,
                responseHandler: (response) => response.text(),
            }),
        }),
        register: builder.mutation({
            query: (credentials) => ({
                url: 'auth/register',
                method: 'POST',
                body: credentials,
                responseHandler: (response) => response.text(),
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;