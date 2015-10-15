/**
 * Created by jin-yc10 on 15/9/14.
 */

DN3.StrandView = Backbone.View.extend({
    el: "#gui-test-panel",
    motif_lib: {},
    lib_els: null,
    initialize: function() {
        this.el = $(this.el);
        this.motif_lib = new DN3.MotifLib([null]);
        this.lib_els = $('#model-lib-container');
        var lib_el = $("<p class=\"lib\">Add Three Arm</p>");
        lib_el.binded_element = {description:'this is a motif in lib'};
        lib_el.on('click', this.onAdd3arm);
        this.lib_els.append(lib_el);
        console.log("StrandView initialize", this.el, $("#three-arm"));
        $("#three-arm").bind('click', this.onAdd3arm);
    },
    render: function() {

    },
    onAdd3arm: function() {
        console.log(this.binded_element);
        var new3Arm = new DN3.Motif();
        console.log(THREE.JSONLoader(new3Arm.strandLine));
        DN3.Events.trigger(DN3.Events.ADD_THREE_ARM, new3Arm.strandLine);
    }
});