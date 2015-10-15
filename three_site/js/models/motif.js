/**
 * Created by jin-yc10 on 15/9/17.
 */

/**
 *  The template of a Motif
 *  @ Construct
 */
DN3.Motif = Backbone.Model.extend({
    geometry: null,
    initialize: function() {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3( -10,  10, 0 ),
            new THREE.Vector3( -10, -10, 0 ),
            new THREE.Vector3(  20, -20, 0 ),
            new THREE.Vector3(  20, -10, 0 )
        );
        geometry.computeBoundingSphere();
        var material = new THREE.LineBasicMaterial({
            color: 0x0000ff
        });
        this.strandLine = new THREE.Line(geometry, material, THREE.LinePieces);
    }
});

/**
 * The collection of Motif Templates
 * @type {*|void}
 */
DN3.MotifLib = Backbone.Collection.extend({
    model : DN3.Motif
});