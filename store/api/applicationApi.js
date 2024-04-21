"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "@/lib/configs";
import { getToken } from "@/utils/authHelpers";

const token = getToken();

export const applicationApi = createApi({
  reducerPath: "applicationApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getToken(); // Get the token
      if (token) {
        headers.set("Authorization", `Bearer ${token}`); // Set Authorization header
      }
      return headers;
    },
  }),
  tagTypes: ["Applications"],
  endpoints: (builder) => ({
    updateApplication: builder.mutation({
      query({ token, payload }) {
        return {
          url: `/users/updatepassword/${token}`,
          method: "PUT",
          // credentials: "include",
          body: payload,
        };
      },
      invalidatesTags: [{ type: "Applications", id: "LIST" }],
    }),
    addNewApplication: builder.mutation({
      query(payload) {
        return {
          url: "/application",
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: [{ type: "Applications", id: "LIST" }],
    }),
    getSingleApplication: builder.query({
      query(token) {
        return {
          url: `users/${token}`,
        };
      },
      providesTags: (result, error, id) => [{ type: "Applications", id }],
    }),
    getAllApplications: builder.query({
      query() {
        return {
          url: "/application",
        };
      },
      invalidatesTags: [{ type: "Applications", id: "LIST" }],
    }),
    searchApplications: builder.query({
      query(params) {
        return {
          url: "/application/search",
          params: {
            // Define your parameters here
            application_name: params?.application_name,
            applicant_name: params?.applicant_name,
            start_date: params?.start_date,
            end_date: params?.end_date,
            reference_id: params?.reference_id,
            // Add more parameters as needed
          },
        };
      },
      // invalidatesTags: [{ type: "Applications", id: "LIST" }],
    }),
    // getCategories
    getCategories: builder.query({
      query() {
        return {
          url: "/categories",
        };
      },
      invalidatesTags: [{ type: "Applications", id: "LIST" }],
    }),
    getAllDrafts: builder.query({
      query() {
        return {
          url: "/application/draft",
        };
      },
      invalidatesTags: [{ type: "Applications", id: "LIST" }],
    }),
    getForms: builder.query({
      query(param) {
        return {
          url: `/forms?categories=${param}`,
        };
      },
      invalidatesTags: [{ type: "Applications", id: "LIST" }],
    }),
    getSingleFormFields: builder.query({
      query(formId) {
        return {
          url: `/forms/${formId}/fields`,
        };
      },
      invalidatesTags: [{ type: "Applications", id: "LIST" }],
    }),
    getStats: builder.query({
      query() {
        return {
          url: `/application/stats`,
        };
      },
      invalidatesTags: [{ type: "Applications", id: "LIST" }],
    }),
    createFlutterTransaction: builder.mutation({
      query(payload) {
        return {
          url: "/transactions",
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: [{ type: "Applications", id: "LIST" }],
    }),
    downloadCertificate: builder.query({
      query(application_id) {
        return {
          url: `/application/${application_id}/certificate/download`,
          responseType: "blob",
        };
      },
      invalidatesTags: [{ type: "Applications", id: "LIST" }],
    }),
    mailCertificate: builder.query({
      query(application_id) {
        return {
          url: `/application/${application_id}/certificate/send-to-mail`,
        };
      },
      invalidatesTags: [{ type: "Applications", id: "LIST" }],
    }),
  }),
});

export const {
  useAddNewApplicationMutation,
  useUpdateApplicationMutation,
  useGetSingleApplicationQuery,
  useGetAllApplicationsQuery,
  useLazySearchApplicationsQuery,
  useGetCategoriesQuery,
  useGetAllDraftsQuery,
  useGetFormsQuery,
  useGetSingleFormFieldsQuery,
  useGetStatsQuery,
  useCreateFlutterTransactionMutation,
  useLazyDownloadCertificateQuery,
  useLazyMailCertificateQuery,
} = applicationApi;
