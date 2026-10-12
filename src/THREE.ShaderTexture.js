import {
	LinearFilter,
	LinearMipmapLinearFilter,
	Mesh,
	OrthographicCamera,
	PlaneGeometry,
	RepeatWrapping,
	Scene,
	WebGLRenderTarget
} from 'three';

class ShaderTexture {

	constructor( renderer, shader, width, height, options = {} ) {

		this.renderer = renderer;
		this.shader = shader;

		this.fbo = new WebGLRenderTarget( width, height, {
			wrapS: RepeatWrapping,
			wrapT: RepeatWrapping,
			minFilter: LinearMipmapLinearFilter,
			magFilter: LinearFilter,
			generateMipmaps: true,
			depthBuffer: false,
			...options
		} );

		this.orthoScene = new Scene();
		this.orthoCamera = new OrthographicCamera( - 1, 1, 1, - 1, - 1, 1 );
		this.orthoQuad = new Mesh( new PlaneGeometry( 2, 2 ), this.shader );
		this.orthoScene.add( this.orthoQuad );

		this.texture = this.fbo.texture;

	}

	render() {

		const renderer = this.renderer;
		const renderTarget = renderer.getRenderTarget();
		const cubeFace = renderer.getActiveCubeFace();
		const mipmapLevel = renderer.getActiveMipmapLevel();

		renderer.setRenderTarget( this.fbo );
		renderer.render( this.orthoScene, this.orthoCamera );
		renderer.setRenderTarget( renderTarget, cubeFace, mipmapLevel );

	}

	setSize( width, height ) {

		this.fbo.setSize( width, height );

	}

	dispose() {

		this.fbo.dispose();
		this.orthoQuad.geometry.dispose();

	}

}

export { ShaderTexture };
