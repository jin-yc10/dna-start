/**
 * Created by jin-yc10 on 15/10/17.
 */
var MenuBar = function ( editor ) {
    var container = new UI.Panel();
    container.setId( 'menubar' );

    container.add( new MenuBar.File( editor ) );
    return container;
};

MenuBar.File = function( editor ) {
    var container = new UI.Panel();
    container.setClass( 'menu' );

    var title = new UI.Panel();
    title.setClass( 'title' );
    title.setTextContent( 'File' );
    container.add( title );

    var options = new UI.Panel();
    options.setClass( 'options' );
    container.add( options );

    // New

    var option = new UI.Panel();
    option.setClass( 'option' );
    option.setTextContent( 'New' );
    option.onClick( function () {
        console.log("Click menu New");
    } );
    options.add( option );

    return container;
};