attribute vec2 aPos;

uniform vec2 uResolution;

void main() {
	vec2 zeroToOne = aPos / uResolution;
	vec2 zeroToTwo = zeroToOne * vec2(2.0, -2.0);
	vec2 clipSpace = zeroToTwo + vec2(-1.0, 1.0);
	gl_Position = vec4(clipSpace, 0.0, 1.0);
}
