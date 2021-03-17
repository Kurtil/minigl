import { createShader, createProgram } from "../../utils.js";
import vertexShaderSource from "../../shaders/vertex.default.js";
import fragmentShaderSource from "../../shaders/fragment.default.js";

const SimpleDrawer = {
  /**
   * @param { WebGL2RenderingContext } gl
   */
  make(gl) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    const program = createProgram(gl, vertexShader, fragmentShader);

    gl.detachShader(program, vertexShader);
    gl.deleteShader(vertexShader);
    gl.detachShader(program, fragmentShader);
    gl.deleteShader(fragmentShader);

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

    function bindAttributes(buffer) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

      gl.bindVertexArray(vao);

      const size = 3; // 2 components per iteration
      const type = gl.FLOAT; // the data is 32bit floats
      const normalize = false; // don't normalize the data
      const stride =
        size * Float32Array.BYTES_PER_ELEMENT + // 0 = move forward size * sizeof(type) each iteration to get the next position
        4 * Uint8ClampedArray.BYTES_PER_ELEMENT; // the color information
      const offset = 0; // start at the beginning of the buffer

      gl.enableVertexAttribArray(positionAttributeLocation);
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

    const simpleDrawer = {
      /**
       * @param { WebGLBuffer } buffer
       */
      draw(buffer, count) {
        bindAttributes(buffer);

        gl.useProgram(program);

        gl.uniform2f(
          resolutionUniformLocation,
          gl.canvas.width / devicePixelRatio,
          gl.canvas.height / devicePixelRatio
        );

        const primitiveType = gl.TRIANGLES;
        const offset = 0;
        gl.drawArrays(primitiveType, offset, count);
      },
    };

    return simpleDrawer;
  },
};

export default SimpleDrawer;
