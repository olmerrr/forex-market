import React, { useRef, useEffect, useState } from "react";
import { Bar } from "../types/Bar";

interface ChartProps {
  bars: Bar[];
}

const Chart: React.FC<ChartProps> = ({ bars }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [barWidth, setBarWidth] = useState(10);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d")!;
      resizeCanvas(canvas);
      drawChart(ctx);
    }
  }, [bars, scrollOffset, barWidth]);

  const resizeCanvas = (canvas: HTMLCanvasElement) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const drawChart = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const visibleBars = Math.floor(ctx.canvas.width / barWidth);
    const startIndex = Math.max(0, scrollOffset);
    const endIndex = Math.min(startIndex + visibleBars, bars.length);

    for (let i = startIndex; i < endIndex; i++) {
      const bar = bars[i];
      const x = (i - startIndex) * barWidth;
      drawBar(ctx, x, bar);
    }

    drawTitle(ctx);
    drawAxisLabels(ctx);
  };

  const drawBar = (ctx: CanvasRenderingContext2D, x: number, bar: Bar) => {
    const openY = priceToY(bar.open);
    const closeY = priceToY(bar.close);
    const highY = priceToY(bar.high);
    const lowY = priceToY(bar.low);

    ctx.beginPath();
    ctx.moveTo(x + barWidth / 2, highY);
    ctx.lineTo(x + barWidth / 2, lowY);
    ctx.stroke();

    ctx.fillStyle = bar.close > bar.open ? "green" : "red";
    ctx.fillRect(x, openY, barWidth, closeY - openY);
  };

  const priceToY = (price: number): number => {
    const maxPrice = Math.max(...bars.map((b) => b.high));
    const minPrice = Math.min(...bars.map((b) => b.low));
    const { height } = canvasRef.current!;

    return height - ((price - minPrice) / (maxPrice - minPrice)) * height;
  };

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    setScrollOffset((prev) => prev + (event.deltaY > 0 ? 1 : -1));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        canvas.removeEventListener("wheel", handleWheel);
      };
    }
  }, [canvasRef]);

  const drawTitle = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Forex Market Chart - EURUSD", 10, 40);
  };

  const drawAxisLabels = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";

    const maxPrice = Math.max(...bars.map((b) => b.high));
    const minPrice = Math.min(...bars.map((b) => b.low));
    const step = (maxPrice - minPrice) / 5;

    for (let i = 0; i <= 5; i++) {
      const price = minPrice + i * step;
      const y = priceToY(price);
      ctx.fillText(price.toFixed(2), 10, y);
    }
  };

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
};

export default Chart;
