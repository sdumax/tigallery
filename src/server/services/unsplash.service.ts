import axios from "axios";

const UNSPLASH_API = "https://api.unsplash.com";
const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

if (!ACCESS_KEY) {
  throw new Error("Missing UNSPLASH_ACCESS_KEY in .env");
}

const unsplash = axios.create({
  baseURL: UNSPLASH_API,
  headers: {
    Authorization: `Client-ID ${ACCESS_KEY}`,
  },
});

const UNSPLASH_ENDPOINTS = {
  search: "/search/photos",
  imageDetails: (id: string) => `/photos/${id}`,
  images: "/photos",
  likes: (id: string) => `/photos/${id}/likes`,
};

export const searchImages = async (query: string, page = 1, perPage = 10) => {
  const response = await unsplash.get("/search/photos", {
    params: { query, page, per_page: perPage },
  });
  return response.data;
};

export const getImageById = async (id: string) => {
  const response = await unsplash.get(`/photos/${id}`);
  return response.data;
};

export const getImages = async (page = 1, perPage = 10) => {
  const response = await unsplash.get(UNSPLASH_ENDPOINTS.images, {
    params: { page, per_page: perPage },
  });
  return response.data;
};


