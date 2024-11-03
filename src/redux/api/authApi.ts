// import { baseApi } from "./baseApi";
// const authApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     register: builder.mutation({
//       query: (userInfo) => ({
//         url: "/user/register/",
//         method: "POST",
//         body: userInfo,
//       }),
//     }),
//     login: builder.mutation({
//       query: (credentials) => ({
//         url: "/user/login/",
//         method: "POST",
//         body: credentials,
//       }),
//     }),
//     addedSearchUser: builder.mutation({
//       query: (data) => ({
//         url: "/user/add-user/",
//         method: "POST",
//         body: data,
//       }),
//     }),
//     logout: builder.mutation<void, void>({
//       query: () => ({
//         url: "/user/logout/",
//         method: "POST",
//       }),
//     }),
//     getAddedUsers: builder.query({
//       query: () => ({
//         url: "/user/get-added-users/",
//         method: "GET",
//       }),
//     }),
//   }),
// });
// export const {
//   useRegisterMutation,
//   useLoginMutation,
//   useAddedSearchUserMutation,
//   useLogoutMutation,
//   useGetAddedUsersQuery,
// } = authApi;
import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/user/register/",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["User"], // Invalidates the 'User' tag after registration
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/user/login/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"], // Invalidates the 'User' tag after login
    }),
    addedSearchUser: builder.mutation({
      query: (data) => ({
        url: "/user/add-user/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AddedUsers"], // Invalidates the 'AddedUsers' tag after adding a user
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/user/logout/",
        method: "POST",
      }),
      invalidatesTags: ["User"], // Invalidates the 'User' tag after logout
    }),
    getAddedUsers: builder.query({
      query: () => ({
        url: "/user/get-added-users/",
        method: "GET",
      }),
      providesTags: ["AddedUsers"], // Provides 'AddedUsers' tag for this query
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
