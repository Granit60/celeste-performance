import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from 'fs'
import { GBnPlayerAll } from "./api.goldberries.js";

async function generate() {
    const players = await GBnPlayerAll();
    const smStream = new SitemapStream({ hostname: "https://celesteperformance.xyz"});

    smStream.write({ url: "/", changefreq: "daily", priority: 1.0})
    smStream.write({ url: "/about", changefreq: "monthly"})

    players.forEach(p => {
        smStream.write({ url: `/player/${p.id}`, changefreq: 'weekly'})
    })
    smStream.end();

    const sitemap = await streamToPromise(smStream);
    createWriteStream("./public/sitemap.xml").write(sitemap.toString());
}
generate();
