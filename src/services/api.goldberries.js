import axios from "axios";
const api = import.meta.env.VITE_GOLDBERRIES_API;

export const GBnPlayer = ( id ) => {
    return axios.get(`${api}/player?id=${id}`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching GBnPlayer:', error);
        });
};


export const GBnPlayerSubmissions = ( id ) => {
    return axios.get(`${api}/player/submissions?arbitrary=true&archived=true&player_id=${id}`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching GBnPlayerSubmissions:', error);
        });
};

export const GBnPlayerAll = () => {
    return axios.get(`${api}/player/all`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching GBnPlayerAll::', error);
        });
};

export const GBnStatsPlayerTierClearCounts = () => {
    return axios.get(`${api}/stats/player-tier-clear-counts`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching GBnStatsPlayerTierClearCounts:', error);
        });
};

export const GBnDifficulty = () => {
    return axios.get(`${api}/difficulty?id=all`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching GBnDifficulty:', error);
        });
}

export const GBnChallenge = (id) => {
     return axios.get(`${api}/challenge?id=${id}&submissions=false&depth=3`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching GBnChallenge:', error);
        });
}

export const GBnSearchPlayer = (q) => {
    return axios.get(`${api}/search?q=${q}&in=players`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching GBnSearchPlayer:', error);
        });
}