const API_KEY = '3qNT15vWdSHLdlbIkS0OU4STt4jdt0ga';

export const LIMIT_PER_PAGE = 10;

export const API_URL = `https://api.giphy.com/v1/gifs/search?q={Q}&limit=${LIMIT_PER_PAGE}&offset={OFFSET}&api_key=${API_KEY}`;

export const Response = {
    OK: 200
}

export const HISTORY_SIZE = 10;
