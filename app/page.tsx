"use client"

import { useState, useEffect } from "react"

export default function Home() {

  const [palettes, setPalettes] = useState<any[]>([])

  useEffect(() => {

    fetch("http://localhost:5000/palettes")
      .then(res => res.json())
      .then(data => setPalettes(data))

  }, [])

  return (

    <main style={{padding:"40px"}}>

      <h1>Neural Glow</h1>

      <h2>Available Palettes</h2>

      {palettes.map(p => (

        <div key={p.id} style={{
          border:"1px solid #ccc",
          padding:"10px",
          marginBottom:"10px"
        }}>

          <h3>{p.name}</h3>
          <p>Lip: {p.lip}</p>
          <p>Blush: {p.blush}</p>
          <p>Highlight: {p.highlight}</p>

        </div>

      ))}

    </main>

  )
}