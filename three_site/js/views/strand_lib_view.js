/**
 * Created by jin-yc10 on 15/9/14.
 */

DN3.StrandView = Backbone.View.extend({
    el: "#gui-test-panel",
    motif_lib: {},
    initialize: function() {
        this.el = $(this.el);
        this.motif_lib = new DN3.MotifLib();
        console.log("StrandView initialize", this.el);
    },
    render: function() {

    }
});