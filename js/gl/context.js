import { createShader, createProgram, resize } from "./utils.js";
import vertexShaderSource from "./shaders/vertex.default.js";
import fragmentShaderSource from "./shaders/fragment.default.js";

const Context = {
  make() {
    /** @type { WebGL2RenderingContext } */
    const gl = viewer.canvas.getContext("webgl2");
    if (!gl) {
      throw new Error(
        "Need WebGL 2 context to run properly. Please consider using a compatible browser."
      );
    }

    gl.enable(gl.DEPTH_TEST);

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    const program = createProgram(gl, vertexShader, fragmentShader);

    const positionAttributeLocation = gl.getAttribLocation(
      program,
      "a_position"
    );

    const colorAttributeLocation = gl.getAttribLocation(program, "a_color");

    const resolutionUniformLocation = gl.getUniformLocation(
      program,
      "u_resolution"
    );

    const vao = gl.createVertexArray();

    let vertexBuffer = null;

    function updateVertexData({ dataView, count }) {
      this.count = count;

      vertexBuffer = gl.createBuffer();

      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

      gl.bufferData(gl.ARRAY_BUFFER, dataView, gl.STATIC_DRAW);

      gl.bindVertexArray(vao);

      gl.enableVertexAttribArray(positionAttributeLocation);

      const size = 3; // 2 components per iteration
      const type = gl.FLOAT; // the data is 32bit floats
      const normalize = false; // don't normalize the data
      const stride =
        size * Float32Array.BYTES_PER_ELEMENT + // 0 = move forward size * sizeof(type) each iteration to get the next position
        4 * Uint8ClampedArray.BYTES_PER_ELEMENT; // the color information
      const offset = 0; // start at the beginning of the buffer

      gl.vertexAttribPointer(
        positionAttributeLocation,
        size,
        type,
        normalize,
        stride,
        offset
      ); // WARNING : it binds the current ARRAY_BUFFER to the attribute.

      gl.enableVertexAttribArray(colorAttributeLocation);
      gl.vertexAttribPointer(
        colorAttributeLocation,
        4,
        gl.UNSIGNED_BYTE,
        true,
        stride,
        3 * Float32Array.BYTES_PER_ELEMENT
      );
    }

    return {
      count: 0,
      updateVertexData,
      drawScene() {
        resize(gl);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.clear(gl.DEPTH_BUFFER_BIT);

        if (this.count === 0) return;

        gl.useProgram(program);

        gl.uniform2f(
          resolutionUniformLocation,
          gl.canvas.width / devicePixelRatio,
          gl.canvas.height / devicePixelRatio
        );

        gl.bindVertexArray(vao);

        const primitiveType = gl.TRIANGLES;
        const offset = 0;
        gl.drawArrays(primitiveType, offset, this.count);
      },
    };
  },
};

export default Context;
