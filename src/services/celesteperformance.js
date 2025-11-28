import { differenceInMonths, differenceInYears } from "date-fns"; 

export function sortPlayers(players, difficulties, pp_x, pp_w, pp_n, pp_b) {
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
    const ppValues = top.map((t, i) =>  0.55 * (pp_w ** i) * (pp_b * t  ** pp_x + pp_x ** t ));
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

export function mergePlayerInfoStats(rankedPlayers, allPlayerInfo) {
  const playerInfoMap = {};
  allPlayerInfo.forEach(player => {
    playerInfoMap[player.id] = player;
  });

  const enrichedPlayers = rankedPlayers.map(player => {
  const fullInfo = playerInfoMap[player.id];
  const country = fullInfo?.account?.country || '__'; // '__' fallback

  return {
    ...player,
    player: {
      ...player.player,
      account: {
        ...player.player.account,
        country,
        }
      }
    };
  });
  return enrichedPlayers;

}

export function generatePlayerChart(clears, pp_x, pp_w, pp_n, pp_b) {
  const chronoClears = clears.sort((a, b) => {
    return Date.parse(a.date_achieved) - Date.parse(b.date_achieved);
  });

  const clearData = []
  const graphData = []
  chronoClears.forEach((c) => {
  if (clearData.length < pp_n || c.challenge.difficulty.sort > clearData.at(-1)) {
    
    clearData.push(c.challenge.difficulty.sort) // append tier top 10
    clearData.sort((a,b) => { return b - a }) //reverse order for best to worst
    
    if (clearData.length > pp_n) { clearData.pop() } //trim to keep top 10 only
    if (graphData.length > 0 && c.date_achieved.substring(0,10) == graphData.at(-1).x) { graphData.pop() } //if new peak on the same day, remove prev
    
    graphData.push({
      x: c.date_achieved.substring(0,10), 
      y: clearData.reduce((acc, curr, index) => acc + (pp_x ** curr  + pp_b * (pp_w ** index)), 0) //pp math
      })
    }
  })
  graphData.push({x: Date.now(), y: graphData.at(-1).y })

  const dates = graphData.map(d => new Date(d.x));
  const min = new Date(Math.min(...dates));
  const max = new Date(Math.max(...dates));

  const months = differenceInMonths(max, min);
  const stepSize = Math.max(Math.round(months / 12), 1);

  const data = {
    datasets: [
      {
        label: "PP",
        data: graphData,
        borderColor: "#A98DD6",
        backgroundColor: "white",
        tension: 0.05,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend : {
        display: false
      }
    },
    scales: {
      x: {
        type: "time",
        ticks: { stepSize: stepSize },
        time: {
          unit: "month",
          tooltipFormat: "dd MMM yyyy",
          displayFormats: { month: "MMM yyyy "}
        },
        title: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "PP",
        },
      },
    },
  };
  return { options, data};
}