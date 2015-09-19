/**
 * Created by jin-yc10 on 15/9/13.
 */

DN3.GridHelper = function ( size, step ) {

    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );

    this.color  = new THREE.Color( 0xcccccc );
    this.colorx = new THREE.Color( 0xff0000 );
    this.colorz = new THREE.Color( 0x0000ff );

    for ( var i = - size; i <= size; i += step ) {
        geometry.vertices.push(
            new THREE.Vector3( - size, 0, i ), new THREE.Vector3( size, 0, i ),
            new THREE.Vector3( i, 0, - size ), new THREE.Vector3( i, 0, size )
        );
        if( i === 0 ) {
            geometry.colors.push(this.colorx, this.colorx, this.colorz, this.colorz);
        } else {
            geometry.colors.push(this.color, this.color, this.color, this.color);
        }
    }

    THREE.Line.call( this, geometry, material, THREE.LinePieces );
};

DN3.GridHelper.prototype = Object.create( THREE.Line.prototype );
DN3.GridHelper.prototype.constructor = THREE.GridHelper;

DN3.Grid = function() {

    THREE.Object3D.call(this);

    var _grid = new DN3.GridHelper(500, 50);
    this.add( _grid );

    this.name = "DN3.Grid";

    var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push( new THREE.Vector3( ) );
    lineGeometry.vertices.push( new THREE.Vector3( 0, 1000, 0 ) );

    var yAxis = new THREE.Line( lineGeometry, new THREE.LineBasicMaterial( { color : 0x00ff00 } ) );
    yAxis.position.y = -500;
    this.add( yAxis );
};

DN3.Grid.prototype = new THREE.Object3D();
DN3.Grid.prototype.constructor = DN3.Grid;