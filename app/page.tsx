"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const CameraAR = dynamic(() => import("../components/CameraAR"), {
  ssr: false
})

export default function Home() {

  const [palettes, setPalettes] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {

    useEffect(() => {

  fetch("/palettes/palettes.json")
    .then(res => res.json())
    .then(data => {
      setPalettes(data)
      if(data.length > 0) setSelected(data[0])
    })

}, [])

  }, [])

  return (

    <main
      style={{
        background:"#000",
        color:"#fff",
        minHeight:"100vh",
        padding:"30px",
        fontFamily:"sans-serif"
      }}
    >

      <h1 style={{fontSize:"36px"}}>Neural Glow</h1>

      <p>AI Bio-Responsive Virtual Beauty</p>

      <h2 style={{marginTop:"30px"}}>Live Try-On</h2>

      {selected && <CameraAR palette={selected}/>}

      <h2 style={{marginTop:"40px"}}>Palettes</h2>

      <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>

        {palettes.map((p:any)=>(
          <button
            key={p.id}
            onClick={()=>setSelected(p)}
            style={{
              padding:"10px",
              borderRadius:"8px",
              border:"1px solid #555",
              background:"#111",
              color:"#fff",
              cursor:"pointer"
            }}
          >
            {p.name}
          </button>
        ))}

      </div>

    </main>

  )

}