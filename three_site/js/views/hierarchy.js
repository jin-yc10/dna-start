/**
 * Created by jin-yc10 on 15/9/13.
 */

DN3.Hierarchy = Backbone.View.extend({
    el: $('<li class="list-hierarchy"></li>'),
    data: [
        {id: 456,label:"1"},
        {id: 457,label:"1"}
    ],
    $tree: null,
    $title: null,
    initialize: function() {
        console.log("DN3.Hierarchy initialize");
//        _.bindAll(this);
        this.el = $(this.el);
        this.$tree = $('#tree');
        this.$tree.tree({
            autoOpen: false,
            dragAndDrop: true,
            selectable: true,
            onCreateLi: function( node, $li ) {
            }
        });
        this.$tree.tree('loadData', this.data);
        this.$tree.on( 'tree.move', this.movedNode );
        this.$tree.on( 'tree.click', this.clickedNode );
        this.$title = $('.hierarchy-container .title');
        this.$title.on( 'click', this.toggleVisibility );
    },
    clickedNode: function(event) {
        console.log(this); // this = node[the clicked node]
        var target = event.capturedTarget,
            _class = target[0].className;
        node = event.node;
        console.log(node);
        if ( _class === 'jqtree-title' ) {
            // The clicked node is 'event.node'
            $('#tree').tree('selectNode', node, true);
        }
    },
    movedNode: function(event) {

    },
    render: function() {
        console.log(this);
        this.$tree.tree('loadData', this.data);
        return this;
    },
    toggleVisibility: function() {
        console.log("DN3.Hierarchy toggleVisibility");
        $('#tree').toggle();
        $title = $('.hierarchy-container .title');
        if ( $title.hasClass('closed') ) {
            $title.removeClass('closed');
        } else {
            $title.addClass('closed');
        }
    }
});