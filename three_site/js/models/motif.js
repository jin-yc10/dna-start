/**
 * Created by jin-yc10 on 15/9/17.
 */

/**
 * The collection of Motif Templates
 * @type {*|void}
 */
DN3.MotifLib = Backbone.Collection.extend({
    Motifs: {},
    initialize: function() {

    }
});

/**
 *  The template of a Motif
 *  @ Construct
 */
DN3.Motif = Backbone.Model.extend({
    strands: [],
    transformation: {},
    initialize: function() {
    }
});

DN3.Pland3Arm = new DN3.Motif();