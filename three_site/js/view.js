/**
 * Created by jin-yc10 on 15/9/13.
 */

DN3.Viewport = function(parameters) {
    var _container = document.createElement("div");
    var that = this;
    var _width = window.innerWidth,
        _height = window.innerHeight,
        _radius = 500,
        clock = new THREE.Clock()
    ;
    _container.style.position = 'absolute';
    _container.style.overflow = 'hidden';
    _container.style.display = 'block';

    parameters = parameters || {};

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( _width, _height );
    this.renderer.setClearColor( 0xeeeeee, 1.0 );

    this.camera = new THREE.PerspectiveCamera( 60, _width / _height, 1, 10000 );
    this.camera.position.x = 500;
    this.camera.position.y = 250;
    this.camera.position.z = 500;

    this.scene = new THREE.Scene();
    this.scene.add(this.camera);

    this.controls = new DN3.TrackballControls(this.camera, this.renderer.domElement);
    //new DN3.ViewportControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.2;
    this.controls.noZoom = false;
    this.controls.noPan = false;
    this.controls.staticMoving = false;
    this.controls.dynamicDampingFactor = 0.3;
    this.controls.minDistance = 0;
    this.controls.maxDistance = _radius * 100;
    this.controls.keys = [ 65, 83, 68 ]; // [ rotateKey, zoomKey, panKey ]

    this.grid = parameters.grid !== undefined ? parameters.grid : true;
    if( this.grid ) {
        this.grid = new DN3.Grid();
        this.scene.add(this.grid);
    }

    document.body.appendChild(_container);
    _container.appendChild( this.renderer.domElement );

    this.render = function() {
        var delta = clock.getDelta();
        that.controls.update();
        that.renderer.render( that.scene, that.camera );
    };

    this.animate = function() {
        requestAnimationFrame( that.animate );
        that.render();
    };

    this.setSize = function ( width, height ) {
        _width = width;
        _height = height;

        that.camera.aspect = width / height;
        that.camera.updateProjectionMatrix();

        that.controls.screen.width = width;
        that.controls.screen.height = height;

        that.renderer.setSize( width, height );
        that.render();
    };

    DN3.Events.on(DN3.Events.ADD_THREE_ARM, function(e,d){
        console.log('view -> on DN3.Events.ADD_THREE_ARM', d);
        d.userData.t = new Date().getTime();
        that.scene.add(d);
    });
};