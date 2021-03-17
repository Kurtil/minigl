const SimpleObject = Object.freeze({
  make(objectData = {}) {
    return {
      points: objectData.points.map((point = {}) => {
        const { x = 0, y = 0, z = 0, color = [0, 0, 0], opacity = 1 } = point;
        return {
          x,
          y,
          z,
          color,
          opacity,
        };
      }),
    };
  },
});

export default SimpleObject;
