import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GBnDifficulty, GBnPlayerAll, GBnStatsPlayerTierClearCounts, GBnPlayer, GBnPlayerSubmissions } from '../services/api.goldberries';
import { mergePlayerInfoStats, sortPlayers, generatePlayerChart } from "../services/celesteperformance";

import { format, differenceInDays } from 'date-fns';
import "./PlayerPage.css";

import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import 'chartjs-adapter-date-fns';


Chart.register(...registerables);

export default function PlayerPage() {
  const { id } = useParams();
  const [status, setStatus] = useState('');
  const [player, setPlayer] = useState(null);
  const [clears, setClears] = useState([]);
  const [groupedClears, setGroupedClears] = useState([]);

  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);

  const pp_x = parseFloat( import.meta.env.VITE_PP_X);
  const pp_w = parseFloat(import.meta.env.VITE_PP_W);
  const pp_n = parseInt(import.meta.env.VITE_PP_N);
  const pp_b = parseInt(import.meta.env.VITE_PP_B);

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
        .filter((c) => !c.is_obsolete)
        .sort((a, b) => b.challenge.difficulty.sort - a.challenge.difficulty.sort)
        .slice(0, pp_n)
        .map((c, i) => {
          const sort = c.challenge.difficulty.sort;
          const ppRaw = 0.55 * (pp_x ** sort + pp_b * sort ** pp_x);
          const ppWeighted = ppRaw * (pp_w ** i);
          const formattedDate = format(new Date(c.date_achieved), 'M/d/yyyy');
          const ago = differenceInDays(new Date(), new Date(c.date_achieved));
          const fullName =
            c.challenge.map ?
             ((c.challenge.map.is_archived ? "[Old] " : "")
              + ((c.challenge.map.name == c.challenge.map.campaign.name) || !c.challenge.map.campaign.name
              ? c.challenge.map.name
              : `${c.challenge.map.campaign.name} | ${c.challenge.map.name}`)
              + (c.challenge.requires_fc ? " [FC]" : "")
            ) : `${c.challenge.campaign.name} | ${c.challenge.label}`
          const link = c.challenge.map ? `https://goldberries.net/map/${c.challenge.map.id}` : `https://goldberries.net/challenge/${c.challenge.id}`

          return {
            ...c,
            ppRaw,
            ppWeighted,
            formattedDate,
            rank: i + 1,
            ago,
            fullName,
            link
          };
      });

      const totalpp = (topClears.reduce((acc, curr) => acc + curr.ppWeighted, 0))
      const groupedClears = topClears.reduce((acc, c) => {let num = c.challenge.difficulty.sort; acc[num] = (acc[num] || 0) + 1; return acc;}, {});

      setClears(topClears)
      setGroupedClears(groupedClears);

      setStatus('Fetching players info...');
      const allPlayerInfo = await GBnPlayerAll();
      setStatus('Fetching players stats...');
      const players = await GBnStatsPlayerTierClearCounts();
      setStatus('Fetching tiers info...');
      const difficulties = await GBnDifficulty();

      setStatus('Calculating global rank...');
      const rankedPlayers = sortPlayers(players, difficulties, pp_x, pp_w, pp_n, pp_b);
      const rank = rankedPlayers.findIndex(entry => entry.id === p.id) + 1;

      var countryRank = 0;
      if (p.account.country) {
        setStatus('Calculating country rank...');
        const enrichedPlayers = mergePlayerInfoStats(rankedPlayers, allPlayerInfo);
        const countryPlayers = enrichedPlayers.filter((play) => play.player.account.country == p.account.country)
        countryRank = countryPlayers.findIndex(entry => entry.id === p.id) + 1;
      }

      if (topClears.length > 1) {
        setStatus("Creating chart...")
        const { options, data } = await generatePlayerChart(playerClears, pp_x, pp_w, pp_n, pp_b);
        setChartData(data);
        setChartOptions(options)
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
              <a target="_blank" href={`https://goldberries.net/player/${player.id}`}>{player.name}</a> • {player.totalpp.toFixed(0)}pp •  #{player.rank}
              {player.countryRank > 0 && <> • #{player.countryRank} <span title={player.account.country} className={`fi fi-${player.account.country}`}></span></>}
            </h1>
            <div className="info">
              <p>Number of Clears : {player.nclears}</p>
              <p>Input method : {player.account.input_method}</p>
              <p className="about_me">{player.account.about_me}</p>
            </div>
          </div>

          <h2>Top Clears Showcase</h2>
          <div className="tier-container">
            {Object.entries(groupedClears).reverse().map(([k, v]) => (
                <div key={k} className={`tier tier-t${k}`} style={{width: v*(pp_n/Math.min(player.nclears, pp_n))*4 + '%'}} title={`T${k}: ${v}`}></div>
              ))}
          </div>
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
                <tr key={c.rank}>
                  <td>#{c.rank}</td>
                  <td><a target="_blank" href={c.link}>{c.fullName}</a></td>
                  <td className={`tier-t${c.challenge.difficulty.sort}`}>{c.challenge.difficulty.sort}</td>
                  <td>{c.ppRaw.toFixed(0)}</td>
                  <td>{`${c.ppWeighted.toFixed(0)} (${(c.ppWeighted/player.totalpp*100).toFixed(1)}%)`}</td>
                  <td>{c.formattedDate} ({c.ago} days ago)</td>
                </tr>
              ))}
            </tbody>
          </table>

          {clears.length > 1 && chartData && chartOptions && (
            <>
            <h2>Performance chart</h2>
            <Line data={chartData} options={chartOptions} className="chart"/>
            </>
          )}
          </>
          }
      </div>
    </section>
  );
}