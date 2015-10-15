/**
 * Created by jin-yc10 on 15/9/13.
 */

DN3.Hierarchy = Backbone.View.extend({
    el: $('#ztree'),
    data: [
        {   id:1,name:"所有老师",open:false,//这里false为默认关闭,true打开
            children:[
                {id:2,name:"测试老师",phone:"123456789101"},
                {id:3,name:"大老师",phone:"15623545621"}]
        },
        {   id:4,name:"一班",open:true,
            children:[
                {id:5,name:"小花",phone:"25364215211"},
                {id:6,name:"小绿",phone:"365241253"}]
        },
        {   id:7,name:"二班",open:true,
            children:[
                {id:8,name:"小家",phone:"25364215211"},
                {id:9,name:"小沙",phone:"365241253"}]
        }
    ],
    setting : {
        edit: {
            enable: true,
            drag: {
                isCopy : true,
                isMove : true
            }
        }
    },
    $tree: null,
    $title: null,
    initialize: function() {
        this.el = $(this.el);
        this.$title = $('#ztree-title');
        console.log(this.$title);
        this.$title.on( 'click', _.bind(this.toggleVisibility, this) );
    },
    clickedNode: function(event) {
    },
    movedNode: function(event) {
    },
    render: function() {
    },
    toggleVisibility: function() {
        console.log("DN3.Hierarchy toggleVisibility");
        $title = $('#ztree-title');
        console.log(this);
        if ( $title.hasClass('closed') ) {
            $title.removeClass('closed');
            this.el.show();
        } else {
            $title.addClass('closed');
            this.el.hide();
        }
    }
});