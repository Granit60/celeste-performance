import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GBnDifficulty, GBnPlayerAll, GBnStatsPlayerTierClearCounts, GBnPlayer, GBnPlayerSubmissions } from '../services/api.goldberries';
import { mergePlayerInfoStats, sortPlayers } from "../services/celesteperformance";
import { format, differenceInDays } from 'date-fns';
import "./PlayerPage.css";

export default function PlayerPage() {
  const { id } = useParams();
  const [status, setStatus] = useState('');
  const [player, setPlayer] = useState(null);
  const [clears, setClears] = useState([]);

  const pp_x = parseFloat( import.meta.env.VITE_PP_X);
  const pp_w = parseFloat(import.meta.env.VITE_PP_W);
  const pp_n = parseInt(import.meta.env.VITE_PP_N);

  useEffect(() => {
    async function fetchPlayer() {
      setStatus('Fetching player info...');
      const p = await GBnPlayer(id);
      if (!p) {
        setStatus('Error fetching player data. Does this user exist?');
        return;
      }
      setPlayer(p);

      setStatus('Fetching player submissions...');
      const playerClears = await GBnPlayerSubmissions(id);
      const nclears = playerClears.length;

      setStatus(`Sorting top ${pp_n}...`);
      const topClears = playerClears
        .sort((a, b) => b.challenge.difficulty.sort - a.challenge.difficulty.sort)
        .slice(0, pp_n)
        .map((c, i) => {
          const sort = c.challenge.difficulty.sort;
          const ppRaw = Math.round(sort ** pp_x * 100);
          const ppWeighted = Math.round(ppRaw * (pp_w ** i));
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

      setStatus('Fetching players info...');
      const allPlayerInfo = await GBnPlayerAll();
      setStatus('Fetching players stats...');
      const players = await GBnStatsPlayerTierClearCounts();
      setStatus('Fetching tiers info...');
      const difficulties = await GBnDifficulty();

      setStatus('Calculating global rank...');
      const rankedPlayers = sortPlayers(players, difficulties, pp_x, pp_w, pp_n);
      const rank = rankedPlayers.findIndex(entry => entry.id === p.id) + 1;

      var countryRank = 0;
      if (p.account.country) {
        setStatus('Calculating country rank...');
        const enrichedPlayers = mergePlayerInfoStats(rankedPlayers, allPlayerInfo);
        const countryPlayers = enrichedPlayers.filter((play) => play.player.account.country == p.account.country)
        countryRank = countryPlayers.findIndex(entry => entry.id === p.id) + 1;
      }

      setPlayer({...p, totalpp, rank, countryRank, nclears });
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
          <div className="playercard">
            <h1>
              {player.name} • {player.totalpp}pp •  #{player.rank}
              {player.countryRank > 0 && <> • #{player.countryRank} <span title={player.account.country} className={`fi fi-${player.account.country}`}></span></>}
            </h1>
            <div className="info">
              <p>Number of Clears : {player.nclears}</p>
              <p>Input method : {player.account.input_method}</p>
              <p className="about_me">{player.account.about_me}</p>
            </div>
          </div>

          <h2>Top Clears Showcase</h2>
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
                  <td><a target="_blank" href={`https://goldberries.net/map/${c.challenge.map.id}`}>{c.challenge.map.name}</a></td>
                  <td>{c.challenge.difficulty.sort}</td>
                  <td>{c.ppRaw}</td>
                  <td>{`${c.ppWeighted} (${(c.ppWeighted/player.totalpp*100).toFixed(1)}%)`}</td>
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
