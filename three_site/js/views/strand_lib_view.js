/**
 * Created by jin-yc10 on 15/9/14.
 */

DN3.StrandView = Backbone.View.extend({
    el: "#gui-test-panel",
    motif_lib: {},
    initialize: function() {
        this.el = $(this.el);
        this.motif_lib = new DN3.MotifLib([null]);
        console.log("StrandView initialize", this.el, $("#three-arm"));
        $("#three-arm").bind('click', this.onAdd3arm);
    },
    render: function() {

    },
    onAdd3arm: function() {
        console.log("onAdd3arm");
        var new3Arm = new DN3.Motif();
        DN3.Events.trigger(DN3.Events.ADD_THREE_ARM, new3Arm.strandLine);
    }
});