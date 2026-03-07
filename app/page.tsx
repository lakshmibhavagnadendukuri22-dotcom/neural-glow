"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const CameraAR = dynamic(() => import("../components/CameraAR"), { ssr: false })

type Palette = {
  id: number
  name: string
  lip: string
  blush: string
  highlight: string
}

export default function Home() {

  const [palettes, setPalettes] = useState<Palette[]>([])
  const [selected, setSelected] = useState<Palette | null>(null)

  useEffect(() => {

    async function loadPalettes() {

      try {

        const res = await fetch("/palettes/palettes.json")
        const data: Palette[] = await res.json()

        setPalettes(data)

        if (data.length > 0) {
          setSelected(data[0])
        }

      } catch (err) {
        console.error("Palette loading error:", err)
      }

    }

    loadPalettes()

  }, [])

  return (

    <main
      style={{
        background: "#000",
        color: "#fff",
        minHeight: "100vh",
        padding: "30px",
        fontFamily: "sans-serif"
      }}
    >

      <h1 style={{ fontSize: "36px" }}>Neural Glow</h1>
      <p>AI Bio-Responsive Virtual Beauty</p>

      <h2 style={{ marginTop: "30px" }}>Live Try-On</h2>

      {selected && <CameraAR palette={selected} />}

      <h2 style={{ marginTop: "40px" }}>Palettes</h2>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>

        {palettes.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p)}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid #555",
              background: selected?.id === p.id ? "#444" : "#111",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            {p.name}
          </button>
        ))}

      </div>

    </main>

  )

}