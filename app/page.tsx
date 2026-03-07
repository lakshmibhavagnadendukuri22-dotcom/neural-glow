"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CameraAR = dynamic(() => import("../components/CameraAR"), { ssr: false });

type Palette = {
  id: number;
  name: string;
  lip: string;
  blush: string;
};

export default function Home() {

  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [selected, setSelected] = useState<Palette | null>(null);

  useEffect(() => {

    fetch("/palettes/palettes.json")
      .then(res => res.json())
      .then((data: Palette[]) => {
        setPalettes(data);
        setSelected(data[0]);
      });

  }, []);

  return (

<main
style={{
minHeight:"100vh",
padding:"40px",
fontFamily:"system-ui, sans-serif",
background:"linear-gradient(135deg,#0f0f14,#1a1a25,#111)",
color:"#fff"
}}
>

{/* TITLE */}

<h1
style={{
fontSize:"42px",
fontWeight:700,
letterSpacing:"-1px"
}}
>
Neural Glow ✨
</h1>

<p style={{opacity:0.7}}>
AI-Powered Virtual Beauty Try-On
</p>


{/* CAMERA SECTION */}

<h2 style={{marginTop:"30px"}}>Live Try-On</h2>

<div
style={{
marginTop:"20px",
padding:"20px",
borderRadius:"20px",
background:"rgba(255,255,255,0.05)",
backdropFilter:"blur(10px)",
border:"1px solid rgba(255,255,255,0.1)",
display:"inline-block"
}}
>

{selected && <CameraAR palette={selected}/>}

</div>


{/* PALETTES */}

<h2 style={{marginTop:"40px"}}>Palettes</h2>

<div
style={{
display:"flex",
gap:"18px",
marginTop:"20px",
flexWrap:"wrap"
}}
>

{palettes.map(p=>(
<div
key={p.id}
onClick={()=>setSelected(p)}
style={{
cursor:"pointer",
padding:"10px",
borderRadius:"14px",
border:selected?.id===p.id
? "2px solid #fff"
: "1px solid rgba(255,255,255,0.2)",
background:"rgba(255,255,255,0.05)"
}}
>

<div style={{display:"flex",gap:"6px"}}>

<div
style={{
width:"22px",
height:"22px",
borderRadius:"50%",
background:p.lip
}}
/>

<div
style={{
width:"22px",
height:"22px",
borderRadius:"50%",
background:p.blush
}}
/>

</div>

<div
style={{
fontSize:"12px",
marginTop:"6px",
textAlign:"center"
}}
>
{p.name}
</div>

</div>
))}

</div>


{/* CUSTOM PALETTE */}

<h2 style={{marginTop:"40px"}}>Customize Palette</h2>

<div
style={{
marginTop:"20px",
padding:"20px",
borderRadius:"16px",
background:"rgba(255,255,255,0.04)",
border:"1px solid rgba(255,255,255,0.1)",
display:"flex",
gap:"30px"
}}
>

<label style={{display:"flex",flexDirection:"column",gap:"8px"}}>

Lip

<input
type="color"
value={selected?.lip || "#d94f70"}
onChange={(e)=>
setSelected(prev =>
prev ? {...prev,lip:e.target.value} : prev
)
}
/>

</label>

<label style={{display:"flex",flexDirection:"column",gap:"8px"}}>

Blush

<input
type="color"
value={selected?.blush || "#ff8fa3"}
onChange={(e)=>
setSelected(prev =>
prev ? {...prev,blush:e.target.value} : prev
)
}
/>

</label>

</div>

</main>

  );
}