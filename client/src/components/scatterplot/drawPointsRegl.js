import { glPointFlags, glPointSize } from "../../util/glHelpers";

export default function drawPointsRegl(regl) {
  return regl({
    vert: `
    precision mediump float;

    attribute vec2 position;
    attribute vec3 color;
    attribute float flag;

    uniform mat3 projection;
    uniform float nPoints;
    uniform float minViewportDimension;

    varying lowp vec4 fragColor;

    const float zBottom = 0.99;
    const float zMiddle = 0.;
    const float zTop = -1.;

    // import getFlags()
    ${glPointFlags}

    // get pointSize()
    ${glPointSize}

    void main() {
      bool isBackground, isSelected, isHighlight, isHalfSelected, isInvisible;
      getFlags(flag, isBackground, isSelected, isHighlight, isHalfSelected, isInvisible);

      gl_PointSize = pointSize(nPoints, minViewportDimension, isSelected, isHighlight, isHalfSelected, isInvisible);

      float z = (isBackground || isHalfSelected) ? zBottom : (isHighlight ? zTop : zMiddle);
      vec3 xy = projection * vec3(position, 1.);
      gl_Position = vec4(xy.xy, z, 1.);

      float a = (isBackground || isHalfSelected) ? 0.9 : 1.0;
      float alpha = isInvisible ? 0.0 : a;
      fragColor = vec4(color, alpha);
    }`,

    frag: `
    precision mediump float;
    varying lowp vec4 fragColor;
    void main() {
      if (length(gl_PointCoord.xy - 0.5) > 0.5) {
        discard;
      }
      gl_FragColor = fragColor;
    }`,

    attributes: {
      position: regl.prop("position"),
      color: regl.prop("color"),
      flag: regl.prop("flag"),
    },

    uniforms: {
      projection: regl.prop("projection"),
      nPoints: regl.prop("nPoints"),
      minViewportDimension: regl.prop("minViewportDimension"),
    },

    count: regl.prop("count"),

    primitive: "points",

    blend: {
      enable: true,
      func: {
        srcRGB: "src alpha",
        srcAlpha: 1,
        dstRGB: 0,
        dstAlpha: "zero",
      },
    },
  });
}
