import axios from 'axios';
import * as cheerio from 'cheerio';

/* TMDB API: https://developers.themoviedb.org */
export const API_KEY = "53003f8485665501746ef9cdb21e5b20";
export const BASE_URL = "https://api.themoviedb.org/3";

export const tmdbAPI = {
    trending: () => fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`).then(res => res.json()),
    airingToday: ({ pageParam }) => fetch(`${BASE_URL}/tv/airing_today?api_key=${API_KEY}&language=en-US&page=${pageParam}`).then(res => res.json()),
    topRated: () => fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}`).then(res => res.json()),
    search: ({ queryKey }) => {
        const [_, query] = queryKey;
        return fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&language=en-US&page=1&query=${query}`).then(res => res.json())
    },
    detail: ({ queryKey }) => {
        const [_, id] = queryKey;
        return fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&append_to_response=videos,images`).then(res => res.json());
    },
    season: async ({ queryKey }) => {
        const [_, id, season_number] = queryKey;
        return fetch(`${BASE_URL}/tv/${id}/season/${season_number}?api_key=${API_KEY}`).then(res => res.json());
    }
};
