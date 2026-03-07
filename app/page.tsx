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
background:
"linear-gradient(135deg,#ffd6e0,#ffe5ec,#f8edff,#e7f0ff)",
color:"#2b2b2b"
}}
>

{/* APP TITLE */}

<div style={{marginBottom:"30px"}}>

<h1
style={{
fontSize:"46px",
fontWeight:800,
letterSpacing:"-1px",
background:"linear-gradient(90deg,#ff4d8d,#9b5cff)",
WebkitBackgroundClip:"text",
color:"transparent"
}}
>
Neural Glow
</h1>

<p style={{opacity:0.6}}>
✨ AI Makeup Try-On
</p>

</div>


{/* CAMERA SECTION */}

<div
style={{
marginTop:"20px",
padding:"22px",
borderRadius:"22px",
background:"rgba(255,255,255,0.65)",
backdropFilter:"blur(14px)",
border:"1px solid rgba(255,255,255,0.6)",
boxShadow:"0 10px 30px rgba(0,0,0,0.1)",
display:"inline-block"
}}
>

{selected && <CameraAR palette={selected}/>}

</div>


{/* PALETTE SELECTOR */}

<div style={{marginTop:"35px"}}>

<h3 style={{marginBottom:"10px"}}>🎨 Palettes</h3>

<div
style={{
display:"flex",
gap:"18px",
flexWrap:"wrap"
}}
>

{palettes.map(p=>(
<div
key={p.id}
onClick={()=>setSelected(p)}
style={{
cursor:"pointer",
padding:"12px",
borderRadius:"16px",
background:"rgba(255,255,255,0.7)",
border:selected?.id===p.id
? "2px solid #ff4d8d"
: "1px solid rgba(0,0,0,0.1)",
boxShadow:"0 6px 14px rgba(0,0,0,0.08)"
}}
>

<div style={{display:"flex",gap:"8px"}}>

<div
style={{
width:"24px",
height:"24px",
borderRadius:"50%",
background:p.lip
}}
/>

<div
style={{
width:"24px",
height:"24px",
borderRadius:"50%",
background:p.blush
}}
/>

</div>

<div
style={{
fontSize:"12px",
marginTop:"6px",
textAlign:"center",
fontWeight:500
}}
>
{p.name}
</div>

</div>
))}

</div>

</div>


{/* CUSTOM COLORS */}

<div style={{marginTop:"35px"}}>

<h3 style={{marginBottom:"10px"}}>🧴 Custom</h3>

<div
style={{
display:"flex",
gap:"35px",
padding:"20px",
borderRadius:"18px",
background:"rgba(255,255,255,0.65)",
border:"1px solid rgba(0,0,0,0.08)",
boxShadow:"0 6px 16px rgba(0,0,0,0.08)"
}}
>

<label style={{display:"flex",flexDirection:"column",gap:"8px"}}>

💄 Lip

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

🌸 Blush

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

</div>

</main>

  );
}