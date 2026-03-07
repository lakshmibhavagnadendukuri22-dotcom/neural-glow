"use client"

import { useEffect, useRef } from "react"
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"

type Palette = {
  lip: string
  blush: string
  highlight: string
}

type Props = {
  palette: Palette
}

export default function CameraAR({ palette }: Props) {

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(()=>{

    let faceLandmarker: FaceLandmarker

    async function init(){

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      )

      faceLandmarker = await FaceLandmarker.createFromOptions(
        vision,
        {
          baseOptions:{
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
          },
          runningMode:"VIDEO",
          numFaces:1
        }
      )

      const stream = await navigator.mediaDevices.getUserMedia({
  video:true
})

if(videoRef.current){
  videoRef.current.srcObject = stream
  await videoRef.current.play()
}

      detect()

    }

  async function detect(){

  const video = videoRef.current
  const canvas = canvasRef.current

  if(!video || !canvas){
    requestAnimationFrame(detect)
    return
  }

  // wait until camera video is ready
  if(video.readyState < 2){
    requestAnimationFrame(detect)
    return
  }

  if(!faceLandmarker){
    requestAnimationFrame(detect)
    return
  }

  const ctx = canvas.getContext("2d")

  if(!ctx){
    requestAnimationFrame(detect)
    return
  }

  try{

    const results = faceLandmarker.detectForVideo(video, performance.now())

    ctx.clearRect(0,0,canvas.width,canvas.height)

    if(results.faceLandmarks && results.faceLandmarks.length > 0){

      const landmarks = results.faceLandmarks[0]

      const w = canvas.width
const h = canvas.height

drawLips(ctx, landmarks, palette.lip)
drawBlush(ctx, landmarks, palette.blush, w, h)
drawHighlight(ctx, landmarks, palette.highlight, w, h)

    }

  }catch(err){
    console.log("Face detection waiting...")
  }

  requestAnimationFrame(detect)

}
    init()

  },[palette])

  return(

    <div style={{position:"relative"}}>

      <video
  ref={videoRef}
  autoPlay
  playsInline
  muted
  width={640}
  height={480}
/>

      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{
          position:"absolute",
          top:0,
          left:0
        }}
      />

    </div>

  )

}

function drawLips(ctx:any, landmarks:any, color:string){

  if(!landmarks) return

  const upperLip = [
    61,146,91,181,84,17,314,405,321,375,291
  ]

  const lowerLip = [
    61,185,40,39,37,0,267,269,270,409,291
  ]

  ctx.fillStyle = color
  ctx.globalAlpha = 0.55
  ctx.beginPath()

  upperLip.forEach((p:number,i:number)=>{

    if(!landmarks[p]) return

    const x = landmarks[p].x * 640
    const y = landmarks[p].y * 480

    if(i===0) ctx.moveTo(x,y)
    else ctx.lineTo(x,y)

  })

  lowerLip.reverse().forEach((p:number)=>{

    if(!landmarks[p]) return

    const x = landmarks[p].x * 640
    const y = landmarks[p].y * 480

    ctx.lineTo(x,y)

  })

  ctx.closePath()
  ctx.fill()

}

function drawBlush(ctx:any, landmarks:any, color:string, w:number, h:number){

  ctx.globalAlpha = 0.18

  const left = landmarks[50]
  const right = landmarks[280]

  if(!left || !right) return

  const lx = left.x * w
  const ly = left.y * h

  const rx = right.x * w
  const ry = right.y * h

  const gL = ctx.createRadialGradient(lx,ly,2,lx,ly,35)
  gL.addColorStop(0,color)
  gL.addColorStop(1,"transparent")

  ctx.fillStyle = gL
  ctx.beginPath()
  ctx.arc(lx,ly,35,0,Math.PI*2)
  ctx.fill()

  const gR = ctx.createRadialGradient(rx,ry,2,rx,ry,35)
  gR.addColorStop(0,color)
  gR.addColorStop(1,"transparent")

  ctx.fillStyle = gR
  ctx.beginPath()
  ctx.arc(rx,ry,35,0,Math.PI*2)
  ctx.fill()

}

function drawHighlight(ctx:any, landmarks:any, color:string, w:number, h:number){

  ctx.globalAlpha = 0.12

  const nose = landmarks[6]
  const cheekL = landmarks[116]
  const cheekR = landmarks[345]

  if(nose){

    const x = nose.x * w
    const y = nose.y * h

    const grad = ctx.createRadialGradient(x,y,2,x,y,18)
    grad.addColorStop(0,color)
    grad.addColorStop(1,"transparent")

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.ellipse(x,y,6,18,0,0,Math.PI*2)
    ctx.fill()

  }

  if(cheekL){

    const x = cheekL.x * w
    const y = cheekL.y * h

    const grad = ctx.createRadialGradient(x,y,2,x,y,22)
    grad.addColorStop(0,color)
    grad.addColorStop(1,"transparent")

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.ellipse(x,y,22,8,-0.4,0,Math.PI*2)
    ctx.fill()

  }

  if(cheekR){

    const x = cheekR.x * w
    const y = cheekR.y * h

    const grad = ctx.createRadialGradient(x,y,2,x,y,22)
    grad.addColorStop(0,color)
    grad.addColorStop(1,"transparent")

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.ellipse(x,y,22,8,0.4,0,Math.PI*2)
    ctx.fill()

  }

}