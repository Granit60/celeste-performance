import React, { useEffect, useState } from 'react';
import { GBnDifficulty, GBnStatsPlayerTierClearCounts } from '../services/api.goldberries';
import "./HomePage.css";

export default function HomePage() {
  const [players, setPlayers] = useState([]);
  const [stats, setStats] = useState({});
  const [status, setStatus] = useState('Loading leaderboard...');

  const pp_x = parseFloat( import.meta.env.VITE_PP_X);
  const pp_w = parseFloat(import.meta.env.VITE_PP_W);
  const pp_n = parseInt(import.meta.env.VITE_PP_N);

  useEffect(() => {
    async function fetchData() {
      setStatus('Fetching player stats...');
      const allPlayers = await GBnStatsPlayerTierClearCounts();
      setStatus('Fetching tiers...');
      const difficulties = await GBnDifficulty();

      const idToSortMap = {};
      difficulties.forEach(diff => idToSortMap[diff.id] = diff.sort);

      const result = allPlayers.map(({ player, clears }) => {
        const sortClears = [];
        for (const [idStr, count] of Object.entries(clears)) {
          const id = parseInt(idStr);
          const sort = idToSortMap[id];
          if (!sort || count <= 0) continue;
          for (let i = 0; i < count; i++) sortClears.push(sort);
        }

        const top10 = sortClears.sort((a, b) => b - a).slice(0, pp_n);
        const top10pp = top10.map((t, i) => ( t**pp_x * 100 * (pp_w ** i)))
        const total = top10pp.reduce((acc, curr) => acc + curr, 0);
        const nclears = sortClears.length;

        return { player, clears: top10, pp: top10pp, pp_total: total, nclears };
      });

      const sorted = result.sort((a, b) => b.pp_total - a.pp_total).slice(0, 10);
      setStats({
        total: allPlayers.length,
        top10: result[9]?.pp_total.toFixed(2),
        top100: result[99]?.pp_total.toFixed(2),
        top1000: result[999]?.pp_total.toFixed(2),
      });
      setPlayers(sorted);
      setStatus('');
    }

    fetchData();
  }, []);

  return (
    <section className="home">
      <div className="landing">
        <p className="status">{status}</p>
        {players && status == '' &&
        <>
        <h2>Leaderboard</h2>
        <table className="leaderboard">
          <thead>
            <tr>
              <th></th>
              <th>Player</th>
              <th>PP</th>
              <th>Top Clears</th>
              <th>Number of Clears</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, i) => (
              <tr key={p.player.id}>
                <td>#{i + 1}</td>
                <td><a href={`/player/${p.player.id}`}>{p.player.name}</a></td>
                <td>{p.pp_total.toFixed(0)}</td>
                <td>{p.clears.join(', ')}</td>
                <td>{p.nclears}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2></h2>
        <div className="stats">
          <p className="showing">Showing top 10 out of {stats.total} players</p>
          <p>Top 10 is {stats.top10}pp</p>
          <p>Top 100 is {stats.top100}pp</p>
          <p>Top 1000 is {stats.top1000}pp</p>
          <p>Current PP System : {`x = ${pp_x} • w = ${pp_w} • n = ${pp_n} `}</p>
        </div>
        </>
        }
      </div>
    </section>
  );
}