import { baseApi } from "./baseApi";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/user/register/",
        method: "POST",
        body: userInfo,
      }),
    }),
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/user/login/",
        method: "POST",
        body: userInfo,
      }),
    }),
  }),
});
export const { useRegisterMutation, useLoginMutation } = authApi;
