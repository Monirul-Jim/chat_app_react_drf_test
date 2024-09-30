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
      query: (credentials) => ({
        url: "/user/login/",
        method: "POST",
        body: credentials,
      }),
    }),
    addedSearchUser: builder.mutation({
      query: (data) => ({
        url: "/user/add-user/",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const {
  useRegisterMutation,
  useLoginMutation,
  useAddedSearchUserMutation,
} = authApi;
