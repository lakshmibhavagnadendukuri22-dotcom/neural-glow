"use client";

import { useEffect, useRef } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

type Palette={
  id:number
  name:string
  lip:string
  blush:string
}

export default function CameraAR({palette}:{palette:Palette}){

const videoRef=useRef<HTMLVideoElement>(null)
const canvasRef=useRef<HTMLCanvasElement>(null)

useEffect(()=>{

let faceLandmarker:FaceLandmarker|null=null

async function init(){

const vision=await FilesetResolver.forVisionTasks(
"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
)

faceLandmarker=await FaceLandmarker.createFromOptions(vision,{
baseOptions:{
modelAssetPath:
"https://storage.googleapis.com/mediapipe-assets/face_landmarker.task"
},
runningMode:"VIDEO",
numFaces:1
})

const stream=await navigator.mediaDevices.getUserMedia({video:true})

if(videoRef.current){
videoRef.current.srcObject=stream
await videoRef.current.play()
}

detect()

}

function drawLips(
  ctx: CanvasRenderingContext2D,
  l: any,
  color: string,
  w: number,
  h: number
){

const upper = [
61,185,40,39,37,0,267,269,270,409,291
]

const lower = [
146,91,181,84,17,314,405,321,375
]

const inner = [
78,95,88,178,87,14,317,402,318,324,308
]

ctx.globalAlpha = 0.85
ctx.fillStyle = color
ctx.shadowColor = color
ctx.shadowBlur = 6

// Upper lip
ctx.beginPath()

upper.forEach((i:number,index:number)=>{
const x = l[i].x * w
const y = l[i].y * h

if(index===0) ctx.moveTo(x,y)
else ctx.lineTo(x,y)
})

ctx.closePath()
ctx.fill()

// Lower lip
ctx.beginPath()

lower.forEach((i:number,index:number)=>{
const x = l[i].x * w
const y = l[i].y * h

if(index===0) ctx.moveTo(x,y)
else ctx.lineTo(x,y)
})

ctx.closePath()
ctx.fill()

// Remove teeth area
ctx.globalCompositeOperation = "destination-out"

ctx.beginPath()

inner.forEach((i:number,index:number)=>{
const x = l[i].x * w
const y = l[i].y * h

if(index===0) ctx.moveTo(x,y)
else ctx.lineTo(x,y)
})

ctx.closePath()
ctx.fill()

ctx.globalCompositeOperation = "source-over"

}

function drawBlush(
  ctx: CanvasRenderingContext2D,
  l: any,
  color: string,
  w: number,
  h: number
){

ctx.globalAlpha = 0.28

const leftCheek = l[234]
const rightCheek = l[454]

const lx = leftCheek.x * w
const ly = leftCheek.y * h

const rx = rightCheek.x * w
const ry = rightCheek.y * h

const faceWidth = Math.abs(l[234].x - l[454].x) * w

const radius = faceWidth * 0.28

// LEFT CHEEK LAYER 1
const grad1 = ctx.createRadialGradient(
lx, ly, radius * 0.1,
lx, ly, radius
)

grad1.addColorStop(0, color)
grad1.addColorStop(0.4, color)
grad1.addColorStop(1, "transparent")

ctx.fillStyle = grad1
ctx.beginPath()
ctx.arc(lx, ly, radius, 0, Math.PI * 2)
ctx.fill()

// LEFT CHEEK LAYER 2 (diffusion layer)

const grad2 = ctx.createRadialGradient(
lx + radius*0.15, ly - radius*0.1, radius * 0.1,
lx, ly, radius*1.2
)

grad2.addColorStop(0, color)
grad2.addColorStop(0.25, color)
grad2.addColorStop(1, "transparent")

ctx.fillStyle = grad2
ctx.beginPath()
ctx.arc(lx, ly, radius*1.2, 0, Math.PI * 2)
ctx.fill()

// RIGHT CHEEK LAYER 1
const grad3 = ctx.createRadialGradient(
rx, ry, radius * 0.1,
rx, ry, radius
)

grad3.addColorStop(0, color)
grad3.addColorStop(0.4, color)
grad3.addColorStop(1, "transparent")

ctx.fillStyle = grad3
ctx.beginPath()
ctx.arc(rx, ry, radius, 0, Math.PI * 2)
ctx.fill()

// RIGHT CHEEK LAYER 2

const grad4 = ctx.createRadialGradient(
rx - radius*0.15, ry - radius*0.1, radius * 0.1,
rx, ry, radius*1.2
)

grad4.addColorStop(0, color)
grad4.addColorStop(0.25, color)
grad4.addColorStop(1, "transparent")

ctx.fillStyle = grad4
ctx.beginPath()
ctx.arc(rx, ry, radius*1.2, 0, Math.PI * 2)
ctx.fill()

}


function detect(){

const video=videoRef.current
const canvas=canvasRef.current

if(!video||!canvas||!faceLandmarker){
requestAnimationFrame(detect)
return
}

const ctx=canvas.getContext("2d")

if(!ctx||video.readyState<2){
requestAnimationFrame(detect)
return
}

canvas.width=video.videoWidth
canvas.height=video.videoHeight

const results=faceLandmarker.detectForVideo(video,performance.now())

ctx.clearRect(0,0,canvas.width,canvas.height)

if(results.faceLandmarks.length>0){

const l=results.faceLandmarks[0]

drawLips(ctx,l,palette.lip,canvas.width,canvas.height)
drawBlush(ctx,l,palette.blush,canvas.width,canvas.height)


}

requestAnimationFrame(detect)

}

init()

},[palette])

return(

<div style={{position:"relative",width:"640px"}}>

<video
ref={videoRef}
autoPlay
playsInline
muted
style={{width:"640px",borderRadius:"12px"}}
/>

<canvas
ref={canvasRef}
style={{
position:"absolute",
top:0,
left:0,
width:"640px"
}}
/>

</div>

)

}