import { useEffect } from "react";
import { Helmet } from "react-helmet";

export function RandomisedIcon() {
    const icons = import.meta.glob("/src/img/*.webp", { eager: true });
    const iconList = Object.values(icons).map(mod => mod.default);
    const randomIcon = iconList[Math.floor(Math.random() * iconList.length)];

    return (
        <Helmet>
            <link rel="icon" type="image/webp" href={ randomIcon }></link>
        </Helmet>
    )
}