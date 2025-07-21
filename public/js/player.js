import { GBnPlayer, GBnDifficulty, GBnPlayerSubmissions } from "./api.goldberries.js";

document.addEventListener('DOMContentLoaded', () => {
    main();
})

async function main() {
    const { clears, player } = await Top10();
    const container = document.getElementById("showcase");

    const playername = document.getElementById("playername")
    playername.innerHTML = player.name;

    clears.forEach((c, i) => {
        const clearDiv = document.createElement("tr");
        clearDiv.classList.add("clear");

        clearDiv.innerHTML = `
            <td>#${i +1}</td>
            <td>${c.challenge.map.name}</td>
            <td>${c.challenge.difficulty.sort}</td>
            <td>${(c.challenge.difficulty.sort**1.2 * 100).toFixed(0)}</td>
            <td>${(c.challenge.difficulty.sort**1.2 * 100 * (0.8**i)).toFixed(0)}</td>
            <td>${dateFns.format(new Date(c.date_achieved), 'M/d/Y')}</td>
        `
        container.appendChild(clearDiv);
    })
}

async function Top10() {
    const status = document.getElementById('status');
    const playerId = document.getElementById('player-id').dataset.playerId;
    
    status.innerHTML = "Fetching player data..."    
    const player = await GBnPlayer(playerId);
    if (!player) {
        status.innerHTML = "Error fetching player data. Does this user exist?"
    }
    status.innerHTML = "Fetching player submissions..."
    const playerClears = await GBnPlayerSubmissions(playerId);
    status.innerHTML = "Fetching tiers..."
    const difficulties = await GBnDifficulty();

    status.innerHTML = "Sorting top 10..."
    const sortedClears = playerClears
        .sort((a, b) => b.challenge.difficulty.sort - a.challenge.difficulty.sort)
        .slice(0, 10);

    status.innerHTML = "Done!"
    status.style.display = "none";

    console.log(sortedClears);
    return { clears: sortedClears, player};
}