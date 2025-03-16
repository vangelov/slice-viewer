export const vertexShader = `#version 300 es
        
layout(location=0) in vec3 position;

uniform mat4 model;
uniform mat4 view;
uniform mat4 proj;

out vec4 vView; 
out vec4 vWorld;
out vec3 vPosition; 

void main() { 
  vPosition = position;
  vWorld = model * vec4(position, 1.0);
  vView = view * vWorld;
  gl_Position = proj * vView;
}
`;

export const fragmentShader = `#version 300 es
precision highp float;
precision highp usampler2D;

uniform usampler2D tex;
  
in vec3 vPosition;   
out vec4 fragColor; 

float mul = 0.0004673360601457771;
float low = 187.1385;
 
void main() {   
    float raw = float(texture(tex, vPosition.xy).r);
    float adjusted = clamp(mul * (raw - low), 0.0, 1.0);
    fragColor = vec4(vec3(adjusted), 1.0);
}`;
