import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000",
    credentials: "include",
  }),
  endpoints: () => ({}),
});
