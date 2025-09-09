import React from 'react';
import "./AboutPage.css";

export default function AboutPage() {
    const pp_x = parseFloat( import.meta.env.VITE_PP_X);
    const pp_w = parseFloat(import.meta.env.VITE_PP_W);
    const pp_n = parseInt(import.meta.env.VITE_PP_N);
    const pp_b = parseInt(import.meta.env.VITE_PP_B);

    return (
        <section className="about">
            <div className="landing">
                <p>This page's goal is to explain what the project is, and how it all works.</p>

                <h2>What's CelestePerformance?</h2>
                <p>CelestePerformance is a website made to consume goldenberries.net's API made by viddie and compute player's achievements 
                    into a score to rank them.</p>
                <p>The goal is *not* to be objective in any way, but rather add a new perspective to player skill. It was neither made 
                    to discourage players from the game, but to inspire them to become better players. Chase your own dreams! </p>

                <h2 id="how">How does it work?</h2>
                <p>CelestePerformance computes your achievements using goldenberries's tier system, in a way inspired by osu!.
                     Each of your achievements is assigned a pp value based on its tier, and your top achievements are compiled into 
                     your personal pp value through a decreasing weighted average. 
                     This means your #1 achievement is worth more than your #2, etc. </p>
                <p>The exact values used for computing are subject to changes, but here are the formula, the variables and what they mean : </p>
                <p class="highlight">{`total_pp = SUM(i=0, n-1, i++) { t ^ x * ${pp_b} * (w ^ i) }`}</p>
                <ul>
                    <li>
                        t is the tier of the clear;
                    </li>
                    <li>
                        x is the exponent the tier is raised to. This is meant to create gaps between each tier progressively bigger,
                        in contrast to having t1 =&gt; t2 being the same gap as t15 =&gt; t16;
                    <br></br>
                    <span className="offset">Current value : <span className="highlight">x = {pp_x}</span></span>
                    </li>
                    <li>
                        w is the weight each subsequent achievement of your top achievements is decreased by, for calculating your 
                        personal pp score . For example, w = 0.5 would mean your #2 is worth half of your #1, your #3  half of #2, etc.
                        It's below 1, so (w ^ i) gets smaller as the exponent gets bigger;
                        <br></br>
                        <span className="offset">Current value : <span className="highlight">w = {pp_w}</span></span>
                    </li>
                    <li>
                        i is the index of the clear in your top 10;
                    </li>
                    <li>
                        n is the number of achievements taken into account (and how many appear on your profile).
                        <br></br>
                        <span className="offset">Current value : <span className="highlight">n = {pp_n}</span></span>
                    </li>
                </ul>

                <h2>Who made CelestePerformance?</h2>
                <p>
                    <a target="_blank" href="/player/2277">me</a> (using <a target="_blank" href="/player/683">viddie</a>
                    's goldenberries API 
                    & with help from <a target="_blank" href="/player/38">Cr33pyCat</a>)
                </p>

                <h2>What is this made with?</h2>
                <p>React (i'm bad at it. don't look at the code.)</p>
            </div>
        </section>
    )
}