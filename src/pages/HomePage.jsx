import React, { useEffect, useState } from 'react';
import { GBnDifficulty, GBnStatsPlayerTierClearCounts } from '../services/api.goldberries';
import { sortPlayers } from '../services/celesteperformance';
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

      setStatus('Calculating players performance...');
      const result = sortPlayers(allPlayers, difficulties, pp_x, pp_w, pp_n);
      const sorted = result.slice(0,10);
      
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