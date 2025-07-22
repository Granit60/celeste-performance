import React, { useEffect, useState } from 'react';
import "./NotFoundPage.css";
import lisasleep from "../img/lisasleep.webp";

export default function NotFoundPage() {
  
  return (
    <section className="notfound">
      <div className="landing">
        <h1>404 : Not Found</h1>
        <img src={lisasleep}></img>
      </div>
    </section>
  );
}