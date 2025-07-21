import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GBnDifficulty, GBnStatsPlayerTierClearCounts, GBnPlayer, GBnPlayerSubmissions } from '../services/api.goldberries';
import { format, differenceInDays } from 'date-fns';
import "./PlayerPage.css";

export default function PlayerPage() {
  const { id } = useParams();
  const [status, setStatus] = useState('Loading player data...');
  const [player, setPlayer] = useState(null);
  const [clears, setClears] = useState([]);

  useEffect(() => {
    async function fetchPlayer() {
      setStatus('Fetching player data...');
      const p = await GBnPlayer(id);
      if (!p) {
        setStatus('Error fetching player data. Does this user exist?');
        return;
      }
      setPlayer(p);

      setStatus('Fetching player submissions...');
      const playerClears = await GBnPlayerSubmissions(id);

      setStatus('Sorting top 10...');
      const topClears = playerClears
        .sort((a, b) => b.challenge.difficulty.sort - a.challenge.difficulty.sort)
        .slice(0, 10)
        .map((c, i) => {
          const sort = c.challenge.difficulty.sort;
          const ppRaw = Math.round(sort ** 1.2 * 100);
          const ppWeighted = Math.round(ppRaw * (0.8 ** i));
          const formattedDate = format(new Date(c.date_achieved), 'M/d/yyyy');
          const ago = differenceInDays(new Date(), new Date(c.date_achieved));

          return {
            ...c,
            ppRaw,
            ppWeighted,
            formattedDate,
            rank: i + 1,
            ago
          };
      });

      const totalpp = (topClears.reduce((acc, curr) => acc + curr.ppWeighted, 0))

      setClears(topClears)
      setStatus('Calculating global rank...');

      const allPlayers = await GBnStatsPlayerTierClearCounts();
      const difficulties = await GBnDifficulty();

      const idToSortMap = {};
      difficulties.forEach(diff => idToSortMap[diff.id] = diff.sort);

      const rankedPlayers = allPlayers.map(({ player, clears }) => {
        const sortClears = [];
        for (const [idStr, count] of Object.entries(clears)) {
          const id = parseInt(idStr);
          const sort = idToSortMap[id];
          if (!sort || count <= 0) continue;
          for (let i = 0; i < count; i++) sortClears.push(sort);
        }

        const top10 = sortClears.sort((a, b) => b - a).slice(0, 10);
        const top10pp = top10.map((t, i) => ( t**1.2 * 100 * (0.8 ** i)))
        const total = top10pp.reduce((acc, curr) => acc + curr, 0);

        return { id: player.id, pp_total: total };
      });

      // Sort and find rank
      rankedPlayers.sort((a, b) => b.pp_total - a.pp_total);
      const rank = rankedPlayers.findIndex(entry => entry.id === p.id) + 1;

      setPlayer({...p, totalpp, rank });
      setStatus('');

    }
    fetchPlayer();
  }, [id]);

  return (
    <section className="player">
      <div className="landing">
        <p className="status">{status}</p>

        {player && status == '' &&
        <>
          <h2>Player</h2>
          <div className="playercard">
            <h1>{player.name} • {player.totalpp}pp •  #{player.rank}</h1>
          </div>

          <h2>Clears showcase</h2>
          <table className="showcase">
            <thead>
              <tr>
                <th></th>
                <th>Map</th>
                <th>Tier</th>
                <th>PP (Raw)</th>
                <th>PP (Weighted)</th>
                <th>Date achieved</th>
              </tr>
            </thead>
            <tbody>
              {clears.map(c => (
                <tr key={c.rank} className="clear">
                  <td>#{c.rank}</td>
                  <td>{c.challenge.map.name}</td>
                  <td>{c.challenge.difficulty.sort}</td>
                  <td>{c.ppRaw}</td>
                  <td>{c.ppWeighted}</td>
                  <td>{c.formattedDate} ({c.ago} days ago)</td>
                </tr>
              ))}
            </tbody>
          </table>
          </>
          }
      </div>
    </section>
  );
}
