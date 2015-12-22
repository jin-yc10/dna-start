/**
 * Created by jin-yc10 on 15/12/12.
 */

SIDEBAR.Info.Bio = function (editor) {
    var signals = editor.signals;
    var container = new UI.CollapsiblePanel();
    container.addStatic( new UI.Text( 'BIO' ) );
    container.setDisplay( 'none' );
    signals.objectSelected.add( function ( object ) {
        if ( object !== null ) {
            // check if the object need the BIO panel
            container.setDisplay( 'block' );
            updateUI( object );
        } else {
            container.setDisplay( 'none' );
        }
    });
    signals.objectChanged.add( function ( object ) {
        if ( object !== editor.selected ) return;
        updateUI( object );
    } );

    // user data
    var objectEnd3Row = new UI.Panel();
    var objectEnd3 = new UI.Input().setWidth( '150px' ).setFontSize( '12px').onChange( function () {
        editor.nameObject( editor.selected, objectName.getValue() );
    } );
    objectEnd3.dom.classList.add('end3');
    objectEnd3Row.add( new UI.Text( 'End3' ).setWidth( '90px' ) );
    objectEnd3Row.add( objectEnd3 );
    container.add( objectEnd3Row );
    var objectEnd5Row = new UI.Panel();
    var objectEnd5 = new UI.Input().setWidth( '150px' ).setFontSize( '12px' ).onChange( function () {
        editor.nameObject( editor.selected, objectName.getValue() );
    } );
    objectEnd5.dom.classList.add('end5');
    objectEnd5Row.add( new UI.Text( 'End5' ).setWidth( '90px' ) );
    objectEnd5Row.add( objectEnd5 );
    container.add( objectEnd5Row );

    var objectMatchRow = new UI.Panel();
    var objectMatchRenew = new UI.Button( '+' ).setMarginLeft( '7px' );
    var objectMatch = new UI.Input().setWidth( '115px' ).setFontSize( '12px' ).setDisabled( true );
    objectMatch.dom.classList.add('match');
    var MatchRenewAction = function() {
        console.log(["MatchRenewAction",objectMatchRenew]);
        var selected = editor.selected;
        // add a new match strand
        if( selected.userData['match'] !== undefined ) {
            delete selected.userData['match'];
            objectMatchRenew.dom.innerHTML = "+";
        } else {
            selected.userData['match'] = "new";
            objectMatchRenew.dom.innerHTML = "-";
        }
        update();
    };
    objectMatchRenew.onClick( MatchRenewAction );
    objectMatchRow.add( new UI.Text( 'Match' ).setWidth( '90px' ) );
    objectMatchRow.add( objectMatch );
    objectMatchRow.add( objectMatchRenew );
    container.add( objectMatchRow );
    function update() {
        var object = editor.selected;
        if ( object !== null ) {
            if ( object.userData['end3'] !== undefined ) {
                objectEnd3.setValue( object.userData['end3'].uuid );
            } else {
                objectEnd3.setValue( 'free' );
            }
            if ( object.userData['end5'] !== undefined ) {
                objectEnd5.setValue( object.userData['end5'].uuid );
            } else {
                objectEnd5.setValue( 'free' );
            }
            if ( object.userData['match'] !== undefined ) {
                objectMatch.setValue( object.userData['match'] );
            } else {
                objectMatch.setValue( 'free' );
            }
            signals.objectChanged.dispatch( object );
        }
    }
    function updateUI( object ) {
        if ( object.userData['end3'] !== undefined ) {
            objectEnd3.setValue( object.userData['end3'].uuid );
        } else {
            objectEnd3.setValue( 'free' );
        }
        if ( object.userData['end5'] !== undefined ) {
            objectEnd5.setValue( object.userData['end5'].uuid );
        } else {
            objectEnd5.setValue( 'free' );
        }
        if ( object.userData['match'] !== undefined ) {
            objectMatch.setValue( object.userData['match'] );
        } else {
            objectMatch.setValue( 'free' );
        }
    }
    return container;
};