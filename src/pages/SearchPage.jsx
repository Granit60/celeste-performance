import React, { useEffect, useState } from 'react';
import { GBnSearchPlayer } from '../services/api.goldberries';
import "./SearchPage.css";

export default function SearchPage() {
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState('');

    const handleInput = (e) => {
        setQuery(e.target.value);
    }

    useEffect(() => {
        if (!query) return;

        const timeout = setTimeout(async () => {
            setStatus("Fetching query...");
            const r = await GBnSearchPlayer(query);
            setResults(r);
            setStatus(r.players.length === 0 ? "No results." : "");
        }, 300);

        return () => clearTimeout(timeout); 
        }, [query]
    );

    return (
    <section className="search">
      <div className="landing">
            <input className="searchbar" placeholder="Search..." maxLength="32" onInput={handleInput}></input>
            <h2>Results</h2>
            <div className="results">
                {(results.players && results.players.length > 0) ? results.players.map((p) => (
                    <div className="player" key={p.id}>
                        <a href={`/player/${p.id}`}>{p.name}</a>
                    </div>
                )) : (query && query.length > 2 ? <p>{status}</p> : "")
                }
            </div>
      </div>
    </section>
    );
}