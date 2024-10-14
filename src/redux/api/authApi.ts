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
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/user/logout/",
        method: "POST",
      }),
    }),
    getAddedUsers: builder.query({
      query: () => ({
        url: "/user/get-added-users/",
        method: "GET",
      }),
    }),
  }),
});
export const {
  useRegisterMutation,
  useLoginMutation,
  useAddedSearchUserMutation,
  useLogoutMutation,
  useGetAddedUsersQuery,
} = authApi;
