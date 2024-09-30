import { baseApi } from "./baseApi";
const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fileHandle: builder.mutation({
      query: (data) => ({
        url: "/user/media/",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const { useFileHandleMutation } = mediaApi;
