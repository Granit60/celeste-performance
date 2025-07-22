import React, { useEffect, useState } from 'react';
import { GBnSearchPlayer } from '../services/api.goldberries';
import "./SearchPage.css";

export default function SearchPage() {
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState('');

    const handleInput = (e) => {
        setQuery(e.target.value);
        search(e.target.value);
    }

    async function search(q)  {
        if (q) {
            setStatus("Fetching query...");
            const r = await GBnSearchPlayer(q);
            setResults(r);
            setStatus((r.players.length == 0) ? "No results." : "" );
        }
    }

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