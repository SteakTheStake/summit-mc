"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

export const Stars = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d")!;

      let vw = window.innerHeight;
      let vh = window.innerHeight;

      const Star = (size: number, speed: number) => {
        return {
          x:
            Math.random() > 0.5
              ? Math.random() * vw * 2 * speed
              : Math.random() * vw * 2 * speed * -1,
          y:
            Math.random() > 0.5
              ? Math.random() * vh * 2 * speed
              : Math.random() * vh * 2 * speed * -1,
          draw() {
            this.x += 0.05 * speed;
            this.y -= 0.3 * speed;
            ctx.fillStyle = "white";
            ctx.fillRect(this.x, this.y, size, size);
          },
        };
      };

      const stars = Array.apply(null, Array(1200))
        .map(function (_, i) {
          return i;
        })
        .map((i) => Star(1, 1));

      const closerStars = Array.apply(null, Array(1200))
        .map(function (_, i) {
          return i;
        })
        .map((i) => Star(2, 1.5));

      const closestStars = Array.apply(null, Array(300))
        .map(function (_, i) {
          return i;
        })
        .map((i) => Star(4, 2.25));

      const animate = () => {
        const gradient = ctx.createRadialGradient(
          vw / 2,
          vh,
          0,
          vw / 2,
          vh,
          Math.max(vw, vh),
        );

        gradient.addColorStop(0, theme === "dark" ? "#002525" : "#668eab");
        gradient.addColorStop(1, theme === "dark" ? "#0a1010" : "#005a9d");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, vw, vh);
        stars.forEach((star) => {
          star.draw();
        });
        closerStars.forEach((star) => {
          star.draw();
        });
        closestStars.forEach((star) => {
          star.draw();
        });
        requestAnimationFrame(animate);
      };

      const resizeCanvas = () => {
        vw = window.innerWidth;
        vh = window.innerHeight;
        canvas.width = vw;
        canvas.height = vh;
      };

      resizeCanvas();
      animate();
    }
  }, [theme]);

  return <canvas ref={canvasRef} width="400px" height="400px"></canvas>;
};

/* https://codepen.io/cryin_bockritz/pen/wJaGLQ */
