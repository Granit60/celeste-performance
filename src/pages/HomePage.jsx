import React, { useEffect, useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { GBnDifficulty, GBnStatsPlayerTierClearCounts, GBnPlayerAll } from '../services/api.goldberries';
import { sortPlayers, mergePlayerInfoStats } from '../services/celesteperformance';
import "./HomePage.css";

export default function HomePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  if (id == "__") {return (<Navigate to ={import.meta.env.BASE_URL} replace/>)}
  
  const [players, setPlayers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [stats, setStats] = useState({});
  const [status, setStatus] = useState('Loading leaderboard...');

  const pp_x = parseFloat( import.meta.env.VITE_PP_X);
  const pp_w = parseFloat(import.meta.env.VITE_PP_W);
  const pp_n = parseInt(import.meta.env.VITE_PP_N);
  const pp_b = parseInt(import.meta.env.VITE_PP_B);


  useEffect(() => {
    async function fetchData() {
      setStatus('Fetching players info...');
      const allPlayerInfo = await GBnPlayerAll();
      setStatus('Fetching players stats...');
      const allPlayers = await GBnStatsPlayerTierClearCounts();
      setStatus('Fetching tiers info...');
      const difficulties = await GBnDifficulty();

      const idToSortMap = {};
      difficulties.forEach(diff => idToSortMap[diff.id] = diff.sort);

      setStatus('Calculating players performance...');
      const result = sortPlayers(allPlayers, difficulties, pp_x, pp_w, pp_n, pp_b);
      const merged = mergePlayerInfoStats(result, allPlayerInfo);
      const sorted = (!id) ? merged : merged.filter((p) => ( p.player.account.country == id)) ;

      const regionNames = new Intl.DisplayNames(['en'], { type: "region"});
      const countriesTemp = [...new Set(merged.map((p) => p.player.account.country))]; // array => set => array for uniqueness c
      const countriesLabels = countriesTemp.map((c) => { return ({ code: c, label:  c!="__" ? regionNames.of(c.toUpperCase()) : "World" }) })
      const countriesSorted = (countriesLabels.sort((a, b) => a.label.localeCompare(b.label)));
      countriesSorted.unshift(countriesSorted.pop()); //put last "World" in first

      setStats({
        total: sorted.length,
        top10: sorted[9]?.pp_total.toFixed(2),
        top100: sorted[99]?.pp_total.toFixed(2),
        top1000: sorted[999]?.pp_total.toFixed(2),
      });
      setPlayers(sorted.slice(0,10));
      setCountries(countriesSorted);
      setStatus(sorted.length > 0 ? '' : 'No players found.');
    }
    fetchData();
  }, [id]);

  return (
    <section className="home">
      <div className="landing">
        <p className="status">{status}</p>
        {players && status == '' &&
        <>
        <p>Country : 
          <select value={id} onChange={(e) => { navigate(e.target.value == "__" ? "/" : import.meta.env.BASE_URL + "leaderboard/" + e.target.value) }}>
              {countries.map((c) => (
              <option value={c.code} key={c.code}>{ c.label }</option>
            ))}
          </select>
        </p>
        <h2>Leaderboard</h2>
        <table className="leaderboard">
          <thead>
            <tr>
              <th className="small"></th>
              <th className="small"></th>
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
                <td>{p.player.account.country != "__" && <span title={p.player.account.country} className={`fi fi-${p.player.account.country}`}></span>}</td>
                <td><a href={`/player/${p.player.id}`}> {p.player.name}</a> </td>
                <td>{p.pp_total.toFixed(0)}</td>
                <td>{p.clears.join(', ')}</td>
                <td>{p.nclears}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2></h2>
        <div className="stats">
          <p className="showing">Showing top {stats.total < pp_n ? stats.total : pp_n } out of {stats.total} players</p>
          {stats.total >= 10 && <p>Top 10 is {stats.top10}pp</p>}
          {stats.total >= 100 && <p>Top 100 is {stats.top100}pp</p>}
          {stats.total >= 1000 &&  <p>Top 1000 is {stats.top1000}pp</p>}
          <p>Current PP System : {`x = ${pp_x} • w = ${pp_w} • n = ${pp_n} `} | <a href="/about#how">How does this work?</a></p>
        </div>
        </>
        }
      </div>
    </section>
  );
}