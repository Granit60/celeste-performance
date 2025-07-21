import { GBnDifficulty, GBnStatsPlayerTierClearCounts } from "./api.goldberries.js";

document.addEventListener('DOMContentLoaded', () => {
    main();
})

async function main() {
    const players = await PPCalc();
    const container = document.getElementById("leaderboard");
    players.forEach((p, i) => {
        const playerDiv = document.createElement('tr');
        playerDiv.classList.add('player');

        playerDiv.innerHTML = `
            <td>#${i +1}</td>
            <td>${p.player.name}</td>
            <td>${p.pp_total.toFixed(0)}</td>
            <td>${p.clears}</td>
        `;
        container.appendChild(playerDiv);
    })
}
async function PPCalc()  {
    const status = document.getElementById('status');
    const showing = document.getElementById('showing');
    const div10 = document.getElementById('top10');
    const div100 = document.getElementById('top100');
    const div1000 = document.getElementById('top1000');


    status.innerHTML = "Fetching player stats..."
    const players = await GBnStatsPlayerTierClearCounts();
    status.innerHTML = "Fetching tiers..."
    const difficulties = await GBnDifficulty();

    status.innerHTML = "Sorting players' top 10..."
    // Step 1: Map difficulty id => sort
    const idToSortMap = {};
    difficulties.forEach(diff => {
    idToSortMap[diff.id] = diff.sort;
    });

    const result = players.map(({ player, clears }) => {
        const sortClears = [];

        // Step 2: Convert clears {id: count} to an array of sort values
        for (const [idStr, count] of Object.entries(clears)) {
            const id = parseInt(idStr);
            const sort = idToSortMap[id];
            if (!sort || count <= 0) continue;

            // Push 'count' number of 'sort' values
            for (let i = 0; i < count; i++) {
            sortClears.push(sort);
            }
        }

        // Step 3: Sort descending and slice to top 10
        const top10 = sortClears.sort((a, b) => b - a).slice(0, 10);
        const top10pp = top10.map((t, i) => ( t**1.2 * 100 * (0.8 ** i)))
        const total = top10pp.reduce( (acc, curr) => acc + curr, 0);

        return {
            player,
            clears: top10,     // flat array 
            pp : top10pp,
            pp_total : total
        };
    });
    const sortedPlayers = result
        .sort((a, b) => b.pp_total - a.pp_total)
        .slice(0, 10);

    status.innerHTML = "Done!"
    status.style.display = "none";
    showing.innerHTML = `Showing top 10 out of ${players.length} players`;
    div10.innerHTML = `Top 10 is ${result[9].pp_total.toFixed(2)}pp`;
    div100.innerHTML = `Top 100 is ${result[99].pp_total.toFixed(2)}pp`;
    div1000.innerHTML = `Top 1000 is ${result[999].pp_total.toFixed(2)}pp`;


    return sortedPlayers;
}


