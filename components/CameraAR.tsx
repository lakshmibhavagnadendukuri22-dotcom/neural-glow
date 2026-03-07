"use client";

import { useEffect, useRef } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

type Palette = {
  id: number;
  name: string;
  lip: string;
  blush: string;
  highlight: string;
};

export default function CameraAR({ palette }: { palette: Palette }) {

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {

    let faceLandmarker: FaceLandmarker | null = null;

    async function init() {

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );

      faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-assets/face_landmarker.task",
        },
        runningMode: "VIDEO",
        numFaces: 1,
      });

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      detect();
    }

    function drawLips(ctx: any, landmarks: any, color: string, w: number, h: number) {

      const upperLip = [61,185,40,39,37,0,267,269,270,409,291];
      const lowerLip = [146,91,181,84,17,314,405,321,375];
      const inner = [78,95,88,178,87,14,317,402,318,324,308];

      ctx.globalAlpha = 0.8;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      upperLip.forEach((p: number, i: number) => {
        const x = landmarks[p].x * w;
        const y = landmarks[p].y * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      lowerLip.forEach((p: number, i: number) => {
        const x = landmarks[p].x * w;
        const y = landmarks[p].y * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();

      ctx.globalCompositeOperation = "destination-out";

      ctx.beginPath();
      inner.forEach((p: number, i: number) => {
        const x = landmarks[p].x * w;
        const y = landmarks[p].y * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();

      ctx.globalCompositeOperation = "source-over";
    }

    function drawBlush(
  ctx: CanvasRenderingContext2D,
  landmarks: any,
  color: string,
  w: number,
  h: number
) {

  ctx.globalAlpha = 0.38;

  const cheekL = landmarks[234];
  const cheekL2 = landmarks[50];

  const cheekR = landmarks[454];
  const cheekR2 = landmarks[280];

  const lx = ((cheekL.x + cheekL2.x) / 2) * w;
  const ly = ((cheekL.y + cheekL2.y) / 2) * h;

  const rx = ((cheekR.x + cheekR2.x) / 2) * w;
  const ry = ((cheekR.y + cheekR2.y) / 2) * h;

  const faceWidth = Math.abs(landmarks[234].x - landmarks[454].x) * w;

  const width = faceWidth * 0.22;
  const height = faceWidth * 0.14;

  const gradL = ctx.createRadialGradient(lx, ly, 10, lx, ly, width);
  gradL.addColorStop(0, color);
  gradL.addColorStop(0.4, color);
  gradL.addColorStop(1, "transparent");

  ctx.fillStyle = gradL;
  ctx.beginPath();
  ctx.ellipse(lx, ly, width, height, -0.4, 0, Math.PI * 2);
  ctx.fill();

  const gradR = ctx.createRadialGradient(rx, ry, 10, rx, ry, width);
  gradR.addColorStop(0, color);
  gradR.addColorStop(0.4, color);
  gradR.addColorStop(1, "transparent");

  ctx.fillStyle = gradR;
  ctx.beginPath();
  ctx.ellipse(rx, ry, width, height, 0.4, 0, Math.PI * 2);
  ctx.fill();
}
    function drawHighlight(
  ctx: CanvasRenderingContext2D,
  landmarks: any,
  color: string,
  w: number,
  h: number
) {

  ctx.globalAlpha = 0.25;

  const nose = landmarks[6];

  const x = nose.x * w;
  const y = nose.y * h;

  const grad = ctx.createRadialGradient(x, y, 2, x, y, 30);

  grad.addColorStop(0, color);
  grad.addColorStop(0.5, color);
  grad.addColorStop(1, "transparent");

  ctx.fillStyle = grad;

  ctx.beginPath();
  ctx.ellipse(x, y, 12, 30, 0, 0, Math.PI * 2);
  ctx.fill();
}

    function detect() {

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || !faceLandmarker) {
        requestAnimationFrame(detect);
        return;
      }

      const ctx = canvas.getContext("2d");

      if (!ctx || video.readyState < 2) {
        requestAnimationFrame(detect);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const results = faceLandmarker.detectForVideo(video, performance.now());

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.faceLandmarks.length > 0) {

        const landmarks = results.faceLandmarks[0];

        const w = canvas.width;
        const h = canvas.height;

        drawLips(ctx, landmarks, palette.lip, w, h);
        drawBlush(ctx, landmarks, palette.blush, w, h);
        drawHighlight(ctx, landmarks, palette.highlight, w, h);
      }

      requestAnimationFrame(detect);
    }

    init();

  }, [palette]);

  return (
    <div style={{ position: "relative", width: "640px" }}>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "640px", borderRadius: "12px" }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "640px",
        }}
      />

    </div>
  );
}