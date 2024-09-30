import { baseApi } from "./baseApi";

const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllLoginUser: builder.query({
      query: (searchTerm) => ({
        url: `/user/logged-in-users/?search=${searchTerm || ""}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useLazyGetAllLoginUserQuery } = chatApi;
