/**
 * Created by jin-yc10 on 15/10/17.
 */
var SIDEBAR = {} || SIDEBAR;
SIDEBAR.Container = function ( editor ) {
    var container = new UI.Panel();
    container.setId( 'sidebar' );
    container.add( new SIDEBAR.Scene( editor ) );
    container.add( new SIDEBAR.Info( editor ) );
    container.add( new SIDEBAR.Info.Bio( editor ) );
    return container;
};
/**
 * @author mrdoob / http://mrdoob.com/
 */

SIDEBAR.Scene = function ( editor ) {
    var signals = editor.signals;
    var container = new UI.CollapsiblePanel();
    container.setCollapsed( editor.config.getKey( 'ui/sidebar/scene/collapsed' ) );
    container.onCollapsedChange( function ( boolean ) {
        editor.config.setKey( 'ui/sidebar/scene/collapsed', boolean );
    } );
    container.addStatic( new UI.Text( 'SCENE' ) );

    // Tree Ops
    var ZTree = new UI.Panel();
    ZTree.dom.id = 'ZTreeContainer';
    container.add( ZTree );
    var zNodes =[];
    function dropPrev(treeId, nodes, targetNode)    {   return true;    }
    function dropInner(treeId, nodes, targetNode)   {
        if( targetNode ) {
            return targetNode.type !== "Strand" && targetNode.type !== "Connection";
        } else {
            return false;
        }
    }
    function dropNext(treeId, nodes, targetNode)    {   return true;    }
    function beforeDrag(treeId, treeNodes)          {   return treeNodes.level !== 0;   }
    function beforeDragOpen(treeId, treeNode)       {   return true;    }
    function beforeDrop(treeId, treeNodes, targetNode, moveType, isCopy) {
        return targetNode.type !== "Strand";
    }
    function onDrag(event, treeId, treeNodes)       {}

    // Drag-Drop Element in ZTree
    function onDrop(event, treeId, treeNodes, targetNode, moveType, isCopy) {
        console.log({event:'event.onDrop','message':event.target});
        var selected = editor.selected;
        var target = zNodes[treeNodes[0].id];
        if(targetNode) {
            for(var i in treeNodes) {
                var uuid = treeNodes[i].id;
                zNodes[targetNode.id].add(zNodes[uuid]);
            }
        } else if( event.target.classList.contains('end3') ) {
            // concat end3 -> end5
            // do check
            if( !target.userData['end5'] && !selected.userData['end3'] ) {
                event.target.value = treeNodes[0].id;
                Bio.link(target, selected);
            }
        } else if( event.target.classList.contains('end5') ) {
            // concat end5 -> end3
            // do check
            if( !target.userData['end3'] && !selected.userData['end5'] ) {
                event.target.value = treeNodes[0].id;
                Bio.link(selected, target);
            }
        } else if( event.target.classList.contains('match') ) {
            // add match between target and selected
            // if both two strand has not been matched
            if( !target.userData['match'] && !selected.userData['match'] ) {
                event.target.value = treeNodes[0].id;
                Bio.match(target, selected);
            }
        }
    }
    function onExpand(event, treeId, treeNode) {    }
    var setting = {
        edit: {
            enable: true,
            showRemoveBtn: false,
            showRenameBtn: false,
            drag: {
                autoExpandTrigger: true,
                prev: dropPrev,
                inner: dropInner,
                next: dropNext
            }
        },
        view: {
            showLine: true,
            showIcon: true,
            selectedMulti: false,
            dblClickExpand: true
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: function(event, treeId, treeNode, clickFlag) {
                console.log("ZTree onClick");
                editor.select(zNodes[treeNode.id]);
            },
            beforeClick: function(treeId, treeNode, clickFlag) {
            },
            beforeDrag: beforeDrag,
            beforeDrop: beforeDrop,
            beforeDragOpen: beforeDragOpen,
            onDrag: onDrag,
            onDrop: onDrop,
            onExpand: onExpand
        }
    };
    var treeContainer = $(ZTree.dom);
    var treeObj = $("<ul id=\"ZTree\" class=\"ztree\"></ul>");
    treeContainer.append(treeObj);
    $.fn.zTree.init(treeObj, setting, zNodes);
    var zTree = $.fn.zTree.getZTreeObj("ZTree");
    //editor.scene; => root zTreeNode
    zTree.addNodes(null, {
        id:editor.scene.uuid,
        pId:0,
        isParent:true,
        name:editor.scene.name});
    signals.objectAdded.add(function(object){
        var parentNode = zTree.getNodeByParam("id", object.parent.uuid);
        if( object.userData.type == 'Strand') {
            // only put strand in zTree
            zTree.addNodes(parentNode, {
                id:object.uuid,
                pId:parentNode.id,
                isParent:false,
                name:object.type + " - " + object.userData.type,
                type:object.userData.type
            });
            zNodes[object.uuid] = object;
        }
    });
    signals.objectChanged.add(function(object){
    });
    signals.objectSelected.add(function(object){
        if(object === null) {
            var selectNode = zTree.getSelectedNodes()[0];
            zTree.cancelSelectedNode(selectNode);
        } else {
            var selectNode = zTree.getNodeByParam("id",object.uuid);
            zTree.selectNode(selectNode);
        }
    });
    signals.objectRemoved.add(function(object){
    });
    return container;
};
SIDEBAR.Info = function(editor) {
    var signals = editor.signals;
    var container = new UI.CollapsiblePanel();
    container.setCollapsed( editor.config.getKey( 'ui/sidebar/object3d/collapsed' ) );
    container.onCollapsedChange( function ( boolean ) {
        editor.config.setKey( 'ui/sidebar/object3d/collapsed', boolean );
    } );
    container.setDisplay( 'none' );
    var objectType = new UI.Text().setTextTransform( 'uppercase' );
    container.addStatic( objectType );
    // Actions
    var objectActions = new UI.Select().setPosition('absolute').setRight( '8px' ).setFontSize( '11px' );
    objectActions.setOptions( {
        'Actions': 'Actions',
        'Reset Position': 'Reset Position',
        'Reset Rotation': 'Reset Rotation',
        'Reset Scale': 'Reset Scale'
    } );
    objectActions.onClick( function ( event ) {
        event.stopPropagation(); // Avoid panel collapsing
    } );
    objectActions.onChange( function ( event ) {
        var object = editor.selected;
        switch ( this.getValue() ) {
            case 'Reset Position':
                object.position.set( 0, 0, 0 );
                break;
            case 'Reset Rotation':
                object.rotation.set( 0, 0, 0 );
                break;
            case 'Reset Scale':
                object.scale.set( 1, 1, 1 );
                break;
        }
        this.setValue( 'Actions' );
        signals.objectChanged.dispatch( object );
    } );
    container.addStatic( objectActions );
    container.add( new UI.Break() );
    // uuid
    var objectUUIDRow = new UI.Panel();
    var objectUUID = new UI.Input().setWidth( '115px' ).setFontSize( '12px' ).setDisabled( true );
    var objectUUIDRenew = new UI.Button( '⟳' ).setMarginLeft( '7px' ).onClick( function () {
        objectUUID.setValue( THREE.Math.generateUUID() );
        editor.selected.uuid = objectUUID.getValue();
    } );
    objectUUIDRow.add( new UI.Text( 'UUID' ).setWidth( '90px' ) );
    objectUUIDRow.add( objectUUID );
    objectUUIDRow.add( objectUUIDRenew );
    container.add( objectUUIDRow );
    // name
    var objectNameRow = new UI.Panel();
    var objectName = new UI.Input().setWidth( '150px' ).setFontSize( '12px' ).onChange( function () {
        editor.nameObject( editor.selected, objectName.getValue() );
    } );
    objectNameRow.add( new UI.Text( 'Name' ).setWidth( '90px' ) );
    objectNameRow.add( objectName );
    container.add( objectNameRow );

    // position
    var objectPositionRow = new UI.Panel();
    var objectPositionX = new UI.Number().setWidth( '50px' ).onChange( update );
    var objectPositionY = new UI.Number().setWidth( '50px' ).onChange( update );
    var objectPositionZ = new UI.Number().setWidth( '50px' ).onChange( update );
    objectPositionRow.add( new UI.Text( 'Position' ).setWidth( '90px' ) );
    objectPositionRow.add( objectPositionX, objectPositionY, objectPositionZ );
    container.add( objectPositionRow );
    // rotation
    var objectRotationRow = new UI.Panel();
    var objectRotationX = new UI.Number().setWidth( '50px' ).onChange( update );
    var objectRotationY = new UI.Number().setWidth( '50px' ).onChange( update );
    var objectRotationZ = new UI.Number().setWidth( '50px' ).onChange( update );
    objectRotationRow.add( new UI.Text( 'Rotation' ).setWidth( '90px' ) );
    objectRotationRow.add( objectRotationX, objectRotationY, objectRotationZ );
    container.add( objectRotationRow );
    // scale
    var objectScaleRow = new UI.Panel();
    var objectScaleLock = new UI.Checkbox( true ).setPosition( 'absolute' ).setLeft( '75px' );
    var objectScaleX = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).onChange( updateScaleX );
    var objectScaleY = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).onChange( updateScaleY );
    var objectScaleZ = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).onChange( updateScaleZ );
    objectScaleRow.add( new UI.Text( 'Scale' ).setWidth( '90px' ) );
    objectScaleRow.add( objectScaleLock );
    objectScaleRow.add( objectScaleX, objectScaleY, objectScaleZ );
    container.add( objectScaleRow );
    // fov
    var objectFovRow = new UI.Panel();
    var objectFov = new UI.Number().onChange( update );
    objectFovRow.add( new UI.Text( 'Fov' ).setWidth( '90px' ) );
    objectFovRow.add( objectFov );
    container.add( objectFovRow );
    // near
    var objectNearRow = new UI.Panel();
    var objectNear = new UI.Number().onChange( update );
    objectNearRow.add( new UI.Text( 'Near' ).setWidth( '90px' ) );
    objectNearRow.add( objectNear );
    container.add( objectNearRow );
    // far
    var objectFarRow = new UI.Panel();
    var objectFar = new UI.Number().onChange( update );
    objectFarRow.add( new UI.Text( 'Far' ).setWidth( '90px' ) );
    objectFarRow.add( objectFar );
    container.add( objectFarRow );
    // intensity
    var objectIntensityRow = new UI.Panel();
    var objectIntensity = new UI.Number().setRange( 0, Infinity ).onChange( update );
    objectIntensityRow.add( new UI.Text( 'Intensity' ).setWidth( '90px' ) );
    objectIntensityRow.add( objectIntensity );
    container.add( objectIntensityRow );
    // color
    var objectColorRow = new UI.Panel();
    var objectColor = new UI.Color().onChange( update );
    objectColorRow.add( new UI.Text( 'Color' ).setWidth( '90px' ) );
    objectColorRow.add( objectColor );
    container.add( objectColorRow );
    // ground color
    var objectGroundColorRow = new UI.Panel();
    var objectGroundColor = new UI.Color().onChange( update );
    objectGroundColorRow.add( new UI.Text( 'Ground color' ).setWidth( '90px' ) );
    objectGroundColorRow.add( objectGroundColor );
    container.add( objectGroundColorRow );
    // distance
    var objectDistanceRow = new UI.Panel();
    var objectDistance = new UI.Number().setRange( 0, Infinity ).onChange( update );
    objectDistanceRow.add( new UI.Text( 'Distance' ).setWidth( '90px' ) );
    objectDistanceRow.add( objectDistance );
    container.add( objectDistanceRow );
    // angle
    var objectAngleRow = new UI.Panel();
    var objectAngle = new UI.Number().setPrecision( 3 ).setRange( 0, Math.PI / 2 ).onChange( update );
    objectAngleRow.add( new UI.Text( 'Angle' ).setWidth( '90px' ) );
    objectAngleRow.add( objectAngle );
    container.add( objectAngleRow );
    // exponent
    var objectExponentRow = new UI.Panel();
    var objectExponent = new UI.Number().setRange( 0, Infinity ).onChange( update );
    objectExponentRow.add( new UI.Text( 'Exponent' ).setWidth( '90px' ) );
    objectExponentRow.add( objectExponent );
    container.add( objectExponentRow );
    // decay
    var objectDecayRow = new UI.Panel();
    var objectDecay = new UI.Number().setRange( 0, Infinity ).onChange( update );
    objectDecayRow.add( new UI.Text( 'Decay' ).setWidth( '90px' ) );
    objectDecayRow.add( objectDecay );
    container.add( objectDecayRow );
    // visible
    var objectVisibleRow = new UI.Panel();
    var objectVisible = new UI.Checkbox().onChange( update );
    objectVisibleRow.add( new UI.Text( 'Visible' ).setWidth( '90px' ) );
    objectVisibleRow.add( objectVisible );
    container.add( objectVisibleRow );

    //
    function updateScaleX() {
        var object = editor.selected;
        if ( objectScaleLock.getValue() === true ) {
            var scale = objectScaleX.getValue() / object.scale.x;
            objectScaleY.setValue( objectScaleY.getValue() * scale );
            objectScaleZ.setValue( objectScaleZ.getValue() * scale );
        }
        update();
    }
    function updateScaleY() {
        var object = editor.selected;
        if ( objectScaleLock.getValue() === true ) {
            var scale = objectScaleY.getValue() / object.scale.y;
            objectScaleX.setValue( objectScaleX.getValue() * scale );
            objectScaleZ.setValue( objectScaleZ.getValue() * scale );
        }
        update();
    }
    function updateScaleZ() {
        var object = editor.selected;
        if ( objectScaleLock.getValue() === true ) {
            var scale = objectScaleZ.getValue() / object.scale.z;
            objectScaleX.setValue( objectScaleX.getValue() * scale );
            objectScaleY.setValue( objectScaleY.getValue() * scale );
        }
        update();
    }
    function update() {
        var object = editor.selected;
        if ( object !== null ) {
            object.position.x = objectPositionX.getValue();
            object.position.y = objectPositionY.getValue();
            object.position.z = objectPositionZ.getValue();
            object.rotation.x = objectRotationX.getValue();
            object.rotation.y = objectRotationY.getValue();
            object.rotation.z = objectRotationZ.getValue();
            object.scale.x = objectScaleX.getValue();
            object.scale.y = objectScaleY.getValue();
            object.scale.z = objectScaleZ.getValue();
            if ( object.fov !== undefined ) {
                object.fov = objectFov.getValue();
                object.updateProjectionMatrix();
            }
            if ( object.near !== undefined ) {
                object.near = objectNear.getValue();
            }
            if ( object.far !== undefined ) {
                object.far = objectFar.getValue();
            }
            if ( object.intensity !== undefined ) {
                object.intensity = objectIntensity.getValue();
            }
            if ( object.color !== undefined ) {
                object.color.setHex( objectColor.getHexValue() );
            }
            if ( object.groundColor !== undefined ) {
                object.groundColor.setHex( objectGroundColor.getHexValue() );
            }
            if ( object.distance !== undefined ) {
                object.distance = objectDistance.getValue();
            }
            if ( object.angle !== undefined ) {
                object.angle = objectAngle.getValue();
            }
            if ( object.exponent !== undefined ) {
                object.exponent = objectExponent.getValue();
            }
            if ( object.decay !== undefined ) {
                object.decay = objectDecay.getValue();
            }

            object.visible = objectVisible.getValue();
            signals.objectChanged.dispatch( object );
        }
    }
    function updateRows( object ) {
        var properties = {
            // 'parent': objectParentRow,
            'fov': objectFovRow,
            'near': objectNearRow,
            'far': objectFarRow,
            'intensity': objectIntensityRow,
            'color': objectColorRow,
            'groundColor': objectGroundColorRow,
            'distance' : objectDistanceRow,
            'angle' : objectAngleRow,
            'exponent' : objectExponentRow,
            'decay' : objectDecayRow
        };
        for ( var property in properties ) {
            properties[ property ].setDisplay( object[ property ] !== undefined ? '' : 'none' );
        }
    }
    function updateTransformRows( object ) {
        if ( object instanceof THREE.Light ||
            ( object instanceof THREE.Object3D && object.userData.targetInverse ) ) {
            objectRotationRow.setDisplay( 'none' );
            objectScaleRow.setDisplay( 'none' );
        } else {
            objectRotationRow.setDisplay( '' );
            objectScaleRow.setDisplay( '' );
        }
    }
    // events
    signals.objectSelected.add( function ( object ) {
        if ( object !== null ) {
            container.setDisplay( 'block' );
            updateRows( object );
            updateUI( object );
        } else {
            container.setDisplay( 'none' );
        }
    } );
    signals.objectChanged.add( function ( object ) {
        if ( object !== editor.selected ) return;
        updateUI( object );
    } );
    function updateUI( object ) {
        objectType.setValue( object.type );
        objectUUID.setValue( object.uuid );
        objectName.setValue( object.name );

        objectPositionX.setValue( object.position.x );
        objectPositionY.setValue( object.position.y );
        objectPositionZ.setValue( object.position.z );
        objectRotationX.setValue( object.rotation.x );
        objectRotationY.setValue( object.rotation.y );
        objectRotationZ.setValue( object.rotation.z );
        objectScaleX.setValue( object.scale.x );
        objectScaleY.setValue( object.scale.y );
        objectScaleZ.setValue( object.scale.z );
        if ( object.fov !== undefined ) {
            objectFov.setValue( object.fov );
        }
        if ( object.near !== undefined ) {
            objectNear.setValue( object.near );
        }
        if ( object.far !== undefined ) {
            objectFar.setValue( object.far );
        }
        if ( object.intensity !== undefined ) {
            objectIntensity.setValue( object.intensity );
        }
        if ( object.color !== undefined ) {
            objectColor.setHexValue( object.color.getHexString() );
        }
        if ( object.groundColor !== undefined ) {
            objectGroundColor.setHexValue( object.groundColor.getHexString() );
        }
        if ( object.distance !== undefined ) {
            objectDistance.setValue( object.distance );
        }
        if ( object.angle !== undefined ) {
            objectAngle.setValue( object.angle );
        }
        if ( object.exponent !== undefined ) {
            objectExponent.setValue( object.exponent );
        }
        if ( object.decay !== undefined ) {
            objectDecay.setValue( object.decay );
        }
        objectVisible.setValue( object.visible );
        updateTransformRows( object );
    }
    return container;
};
