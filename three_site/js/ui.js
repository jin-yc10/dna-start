/**
 * Created by jin-yc10 on 15/9/13.
 */

DN3.Ui = Backbone.View.extend({
    el: '#gui-left-container',
    gui:{},
    hierarchy: {},
    strandView: null,
    folders: {
        camera:{},
        hierarchy:{}
    },
    initialize: function() {
        this.el = $(this.el);
    },
    render: function() {
        this.gui = new dat.GUI({ autoPlace: false, hide: false });
        this.el.append( this.gui.domElement );

        this.folders.camera = this.gui.addFolder('Camera');

        this.folders.hierarchy = new DN3.Hierarchy();
        this.folders.hierarchy.render();

        this.strandView = new DN3.StrandView();
        this.strandView.render();
    }
});