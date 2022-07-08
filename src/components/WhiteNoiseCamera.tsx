import React, { useCallback, useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { useBodyPix } from "./useBodyPix";
import { useVideo } from "./useVideo";

type Props = {
  width: number;
  height: number;
};

export const WhiteNoiseCamera = ({ width, height }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const net = useBodyPix();
  const video = useVideo(width, height);
  const [maskBackground, setMaskBackground] = useState(true);
  const whiteNoiseSegmentation = useCallback(async () => {
    requestAnimationFrame(whiteNoiseSegmentation);
    if (canvasRef.current === null) {
      return;
    }
    const canvas = canvasRef.current;
    const segment = await net.segmentPerson(video);
    const bigMess = tf.randomUniform<tf.Rank.R1>([height * width]);
    const randomData = await bigMess.array();
    const tmpFGCanvas = document.createElement("canvas") as HTMLCanvasElement;
    tmpFGCanvas.width = width;
    tmpFGCanvas.height = height;
    const tmpFGCtx = tmpFGCanvas.getContext("2d");
    if (tmpFGCtx === null) {
      console.error("NO 2D CANVAS");
      return;
    }
    tmpFGCtx.drawImage(video, 0, 0, width, height);

    const foregroundData = tmpFGCtx.getImageData(0, 0, width, height);
    const ctx = canvas.getContext("2d");
    if (ctx === null) {
      console.error("NO 2D CANVAS");
      return;
    }
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = imageData.data;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let base = (y * width + x) * 4;
        let segbase = y * width + x;
        if ((segment.data[segbase] === 1) !== maskBackground) {
          // is fg
          pixels[base + 0] = foregroundData.data[base + 0];
          pixels[base + 1] = foregroundData.data[base + 1];
          pixels[base + 2] = foregroundData.data[base + 2];
          pixels[base + 3] = foregroundData.data[base + 3];
        } else {
          // is bg
          const index = y * width + x;
          const randomDatum = Math.floor(randomData[index] * 255);
          pixels[base + 0] = randomDatum;
          pixels[base + 1] = randomDatum;
          pixels[base + 2] = randomDatum;
          pixels[base + 3] = 255;
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
    bigMess.dispose();
  }, [net, video, maskBackground, width, height]);

  useEffect(() => {
    whiteNoiseSegmentation();
  }, [whiteNoiseSegmentation]);
  return (
    <div onClick={() => setMaskBackground(!maskBackground)}>
      <img
        alt=""
        src="whitenoise.jpg"
        style={{ position: "absolute", left: 0, top: 0, zIndex: 10 }}
        width={width}
        height={height}
      />
      <canvas
        style={{ position: "absolute", left: 0, top: 0, zIndex: 100 }}
        ref={canvasRef}
        width={width}
        height={height}
      >
        NO CANVAS
      </canvas>
    </div>
  );
};
