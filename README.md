# THREE.ShaderTexture
ShaderTexture, a helper to use procedurally generated texture

[![npm](https://img.shields.io/npm/v/three.shader-texture.svg)](https://www.npmjs.com/package/three.shader-texture)

#### Demos ####
- **[Procedural textures on a torus knot](https://spite.github.io/THREE.ShaderTexture/examples/index.html)**: every map of the material is drawn by a shader, drag on a texture to change it
- **[The same with a glow pass](https://spite.github.io/THREE.ShaderTexture/examples/index-post.html)**: adds a glow texture and postprocessing

#### 2026 update ####
**Disclaimer:** this library is from 2016. three.js still has no texture driven by a GLSL shader for `WebGLRenderer`, so the library is still useful there. With `WebGPURenderer` and TSL there's one since r167 (2024), `rtt()`, which takes a node instead of a shader and updates itself
```js
import { rtt, uv, vec4 } from 'three/tsl';

const material = new THREE.MeshStandardNodeMaterial();
material.colorNode = rtt( vec4( uv(), 0, 1 ), 512, 512 );
```
For `WebGLRenderer` the closest thing is `FullScreenQuad`, in the addons since r105 (2019). It draws a material over a render target, but the render target and when to draw are up to you
```js
import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';

const target = new THREE.WebGLRenderTarget( 512, 512 );
const quad = new FullScreenQuad( material );

renderer.setRenderTarget( target );
quad.render( renderer );
renderer.setRenderTarget( null );
```
The library has been rewritten for current three.js. What changed from the 2016 version:

- it's an ES module, and it needs three.js r152 or later
- ```render()``` puts back the render target that was active, the old code stopped working when three.js removed the render target argument of ```renderer.render()```
- the texture has mipmaps again, three.js stopped generating them for render targets by default
- a fifth argument takes render target options, and there are ```setSize()``` and ```dispose()```
- the examples load three.js from a CDN, turn color management off to keep the look they had in 2016, and show every texture next to the knot. The textures tile now, and the band of broken normals along the knot is gone

#### How to use ####
Use npm to install it, alongside three.js
```
npm i three three.shader-texture
```
and import it in your code
```js
import * as THREE from 'three';
import { ShaderTexture } from 'three.shader-texture';
```
It's a plain ES module, so it also works without a bundler as long as an import map resolves `three` (see [examples/index.html](examples/index.html)).

Create a material with the shader that draws the texture, and a `ShaderTexture` with it:
```js
const shader = new THREE.ShaderMaterial( {
  vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1. ); }',
  fragmentShader: 'varying vec2 vUv; void main() { gl_FragColor = vec4( vUv, 0., 1. ); }'
} );

const shaderTexture = new ShaderTexture( renderer, shader, 1024, 1024 );
```
Draw it, and use the texture like any other:
```js
shaderTexture.render();

const material = new THREE.MeshStandardMaterial( { map: shaderTexture.texture } );
```
Call ```render()``` again whenever the uniforms of the shader change. A texture can be the input of another shader, see the normal map in the examples.

The fifth argument is passed to `THREE.WebGLRenderTarget`, for instance to get a float texture:
```js
const heightMap = new ShaderTexture( renderer, shader, 1024, 1024, { type: THREE.HalfFloatType } );
```
To change the size or release the texture:
```js
shaderTexture.setSize( 512, 512 );
shaderTexture.dispose();
```

#### License ####

MIT licensed

Copyright (C) 2016 Jaume Sanchez Elias, https://www.clicktorelease.com
