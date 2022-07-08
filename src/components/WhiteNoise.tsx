import React, { useCallback, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";

type Props = {
  width: number;
  height: number;
  message?: string;
  opacity?: number;
};

export const WhiteNoise = ({ width, height, message = "", opacity = 1 }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const whiteNoise = useCallback(async () => {
    requestAnimationFrame(whiteNoise);
    if (canvasRef.current === null) {
      return;
    }
    const canvas = canvasRef.current;
    const bigMess = tf.randomUniform<tf.Rank.R2>([height, width]);
    await tf.browser.toPixels(bigMess, canvas);
    bigMess.dispose();
  }, [height, width]);

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }
    whiteNoise();
  }, [whiteNoise]);
  return (
    <div>
      <canvas ref={canvasRef} width={width} height={height}>
        NO CANVAS
      </canvas>
      <p
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "x-large",
          opacity,
        }}
      >
        {message}
      </p>
    </div>
  );
};
