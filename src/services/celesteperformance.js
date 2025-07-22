export function sortPlayers(players, difficulties, pp_x, pp_w, pp_n) {
  const idToSortMap = {};
  difficulties.forEach(diff => {
    idToSortMap[diff.id] = diff.sort;
  });

  const rankedPlayers = players.map(({ player, clears }) => {
    const sortClears = [];
    let totalClears = 0;

    for (const [idStr, count] of Object.entries(clears)) {
      const id = parseInt(idStr);
      const sort = idToSortMap[id];
      if (!sort || count <= 0) continue;
      totalClears += count;
      for (let i = 0; i < count; i++) {
        sortClears.push(sort);
      }
    }

    const top = sortClears.sort((a, b) => b - a).slice(0, pp_n);
    const ppValues = top.map((t, i) => t ** pp_x * 100 * (pp_w ** i));
    const total = ppValues.reduce((acc, curr) => acc + curr, 0);

    return {
        id: player.id,
        player,
        clears: top,
        nclears: totalClears, 
        pp_total: total,
    };
  });

  rankedPlayers.sort((a, b) => b.pp_total - a.pp_total);
  return rankedPlayers;
}