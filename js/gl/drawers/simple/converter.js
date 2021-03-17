// Convert objects into a DataView

const Converter = Object.freeze({
  /**
   * @param { Object[] } objects
   *
   * @returns { { dataView: DataView, count: number } }
   */
  convert(objects = []) {
    const vertexData = objects.flatMap(getObjectVertexData);

    const DATA_PER_ELEMENT = 7;
    const count = vertexData.length / DATA_PER_ELEMENT; // position 3 + color 3 + opacity

    const buffer = new ArrayBuffer(
      count *
        (3 * Float32Array.BYTES_PER_ELEMENT +
          4 * Uint8ClampedArray.BYTES_PER_ELEMENT)
    );
    const dataView = new DataView(buffer);

    vertexData.forEach((data, i) => {
      const vertexIndex = Math.floor(i / DATA_PER_ELEMENT);
      const vertexOffset =
        vertexIndex *
        (3 * Float32Array.BYTES_PER_ELEMENT +
          4 * Uint8ClampedArray.BYTES_PER_ELEMENT);

      const dataIndex = i - vertexIndex * DATA_PER_ELEMENT;
      if ([0, 1, 2].includes(dataIndex)) {
        const dataOffset = dataIndex * Float32Array.BYTES_PER_ELEMENT;
        dataView.setFloat32(vertexOffset + dataOffset, data, true);
      } else {
        const dataOffset =
          3 * Float32Array.BYTES_PER_ELEMENT +
          (dataIndex - 3) * Uint8ClampedArray.BYTES_PER_ELEMENT;
        dataView.setUint8(vertexOffset + dataOffset, data);
      }
    });

    return {
      dataView,
      count,
    };
  },
});

function getObjectVertexData(object) {
  const vertexData = [];
  object.points.forEach(point => {
    const {
      x,
      y,
      z,
      color: { r, g, b },
      opacity,
    } = point;
    vertexData.push(x, y, z, r, g, b, opacity);
  });

  return vertexData;
}

export default Converter;
