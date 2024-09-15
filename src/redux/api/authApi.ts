import { baseApi } from "./baseApi";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/user-sign-in-signup/register/",
        method: "POST",
        body: userInfo,
      }),
    }),
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/user-sign-in-signup/login/",
        method: "POST",
        body: userInfo,
      }),
    }),
  }),
});
export const { useRegisterMutation, useLoginMutation } = authApi;
