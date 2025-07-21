import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GBnDifficulty, GBnPlayer, GBnPlayerSubmissions } from '../services/api.goldberries';
import { format } from 'date-fns';
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

      setStatus('Fetching tiers...');
      await GBnDifficulty();

      setStatus('Sorting top 10...');
      const sorted = playerClears
        .sort((a, b) => b.challenge.difficulty.sort - a.challenge.difficulty.sort)
        .slice(0, 10);
      setClears(sorted);

      setStatus('');
    }
    fetchPlayer();
  }, [id]);

  return (
    <section className="player">
      <div className="landing">
        <p className="status">{status}</p>
        {player && <div className="playercard"><p>{player.name}</p></div>}
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
            {clears.map((c, i) => (
              <tr key={i} className="clear">
                <td>#{i + 1}</td>
                <td>{c.challenge.map.name}</td>
                <td>{c.challenge.difficulty.sort}</td>
                <td>{(c.challenge.difficulty.sort**1.2 * 100).toFixed(0)}</td>
                <td>{(c.challenge.difficulty.sort**1.2 * 100 * (0.8**i)).toFixed(0)}</td>
                <td>{format(new Date(c.date_achieved), 'M/d/yyyy')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
