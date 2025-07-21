const api = "https://goldberries.net/api";

export const GBnPlayerAll = () => {
    return axios.get(api + "/player/all")
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching player data:', error);
        });
};

export const GBnStatsPlayerTierClearCounts = () => {
    return axios.get(api + "/stats/player-tier-clear-counts")
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching player data:', error);
        });
};

export const GBnDifficulty = () => {
    return axios.get(api + "/difficulty?id=all")
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching difficulty data:', error);
        });
}