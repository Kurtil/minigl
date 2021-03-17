import Converter from "./gl/drawers/simple/converter.js";
import SimpleDrawer from "./gl/drawers/simple/drawer.js";
import SimpleObject from "./gl/drawers/simple/object.js";
import { resize } from "./gl/utils.js";

const canvas = document.getElementById("canvas");

const gl = canvas.getContext("webgl2");
if (!gl) {
  throw new Error(
    "Need WebGL 2 context to run properly. Please consider using a compatible browser."
  );
}

gl.enable(gl.DEPTH_TEST);

const simpleDrawer = SimpleDrawer.make(gl);

function draw(buffer, count) {
  resize(gl);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clear(gl.DEPTH_BUFFER_BIT);

  simpleDrawer.draw(buffer, count);
}

const object1 = SimpleObject.make({
  points: [
    {
      x: 10,
      y: 10,
      z: 1,
      color: {
        r: 255,
        g: 255,
        b: 255,
      },
      opacity: 128,
    },
    {
      x: 200,
      y: 10,
      z: 5,
      color: {
        r: 255,
        g: 255,
        b: 255,
      },
      opacity: 128,
    },
    {
      x: 200,
      y: 200,
      z: 10,
      color: {
        r: 255,
        g: 255,
        b: 255,
      },
      opacity: 128,
    },
  ],
});

const object2 = SimpleObject.make({
  points: [
    {
      x: 100,
      y: 200,
      z: 1,
      color: {
        r: 128,
        g: 128,
        b: 128,
      },
      opacity: 128,
    },
    {
      x: 100,
      y: 10,
      z: 5,
      color: {
        r: 128,
        g: 128,
        b: 128,
      },
      opacity: 128,
    },
    {
      x: 300,
      y: 200,
      z: 10,
      color: {
        r: 128,
        g: 128,
        b: 128,
      },
      opacity: 128,
    },
  ],
});

const { dataView, count } = Converter.convert([object1, object2]);

const vertexBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

gl.bufferData(gl.ARRAY_BUFFER, dataView, gl.STATIC_DRAW);

draw(vertexBuffer, count);
