import axios from "axios";
import { safeLocalStorage } from "./browserwrapper.js";

const api =  (typeof process !== "undefined") ? process.env.GOLDBERRIES_API : import.meta.env.VITE_GOLDBERRIES_API;
const maxAgeMs = 1000 * 60 * 60 * 24 // 1d

const fetchAndCache = async ( key, url, fname) => {
    const cached = safeLocalStorage.getItem(key);
    if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        console.log(data)
        if (Date.now() - timestamp < maxAgeMs) {
            return data; 
        }
    }

    try {
        const response = await axios.get(url);
        const data = response.data;
        safeLocalStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
        return data;
    } catch (error) {
        console.error(`Error fetching ${fname}:`, error);
        return null;
    }
}

export const GBnPlayer = async ( id ) => { 
    return await fetchAndCache(`player-${id}`, `${api}/player?id=${id}&customization=true`, "GBnPlayer"); 
};
export const GBnPlayerSubmissions = async ( id ) => {
    return await fetchAndCache(`sub-${id}`, `${api}/player/submissions?arbitrary=true&archived=true&player_id=${id}`, "GBnPlayerSubmissions")
};
export const GBnPlayerAll = async () => {
    return await fetchAndCache("player-all", `${api}/player/all?customization=true`, "GBnPlayerAll")
};
export const GBnStatsPlayerTierClearCounts = async () => {
    return await fetchAndCache("player-stats", `${api}/stats/player-tier-clear-counts`, "GBnStatsPlayerTierClearCounts")
};
export const GBnDifficulty = async () => {
    return await fetchAndCache("diff", `${api}/difficulty?id=all`, "GBnDifficulty")
}
export const GBnChallenge = async (id) => {
    return await fetchAndCache(`chall-${id}`,`${api}/challenge?id=${id}&submissions=false&depth=3`,"GBnChallenge")
}
export const GBnSearchPlayer = async (q) => {
    return await fetchAndCache(`search-${q}`, `${api}/search?q=${q}&in=players`, "GBnSearchPlayer")
}