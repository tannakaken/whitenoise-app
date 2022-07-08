import React, { Suspense, useEffect, useState } from "react";
import { WhiteNoiseCamera } from "./components/WhiteNoiseCamera";
import * as tf from "@tensorflow/tfjs";
import { WhiteNoise } from "./components/WhiteNoise";
tf.setBackend("webgl");

function App() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    });
  });
  return (
    <Suspense
      fallback={
        <WhiteNoise width={width} height={height} message="Loading..." />
      }
    >
      <WhiteNoiseCamera width={width} height={height} />
    </Suspense>
  );
}

export default App;
