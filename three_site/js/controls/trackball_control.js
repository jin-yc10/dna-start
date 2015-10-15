/**
 * Created by jin-yc10 on 15/9/13.
 */

/**
 * @author Eberhard Graether / http://egraether.com/
 * @author Mark Lundin 	/ http://mark-lundin.com
 * @author Simone Manini / http://daron1337.github.io
 * @author Luca Antiga 	/ http://lantiga.github.io
 */

DN3.TrackballControls = function ( object, domElement ) {

    var that = this;
    var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };

    this.object = object;
    this.domElement = ( domElement !== undefined ) ? domElement : document;

    // API
    this.mouse = {};
    this.enabled = true;
    this.screen = { left: 0, top: 0, width: 0, height: 0 };

    this.rotateSpeed = 1.0;
    this.zoomSpeed = 1.2;
    this.panSpeed = 0.3;

    this.noRotate = false;
    this.noZoom = false;
    this.noPan = false;

    this.staticMoving = false;
    this.dynamicDampingFactor = 0.2;
    this.minDistance = 0;
    this.maxDistance = Infinity;
    this.keys = [ 65 /*A*/, 83 /*S*/, 68 /*D*/ ];
    this.target = new THREE.Vector3();

    this.raycaster = new THREE.Raycaster();

    var EPS = 0.000001;

    var lastPosition = new THREE.Vector3();

    var _state = STATE.NONE,
        _prevState = STATE.NONE,
        _eye = new THREE.Vector3(),
        _movePrev = new THREE.Vector2(),
        _moveCurr = new THREE.Vector2(),
        _lastAxis = new THREE.Vector3(),
        _lastAngle = 0,
        _zoomStart = new THREE.Vector2(),
        _zoomEnd = new THREE.Vector2(),
        _touchZoomDistanceStart = 0,
        _touchZoomDistanceEnd = 0,
        _panStart = new THREE.Vector2(),
        _panEnd = new THREE.Vector2();

    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.up0 = this.object.up.clone();

    // events
    var changeEvent = { type: 'change' };
    var startEvent = { type: 'start' };
    var endEvent = { type: 'end' };
    // methods
    this.handleResize = function () {
        if ( this.domElement === document ) {
            this.screen.left = 0;
            this.screen.top = 0;
            this.screen.width = window.innerWidth;
            this.screen.height = window.innerHeight;
        } else {
            var box = this.domElement.getBoundingClientRect();
            // adjustments come from similar code in the jquery offset() function
            var d = this.domElement.ownerDocument.documentElement;
            this.screen.left = box.left + window.pageXOffset - d.clientLeft;
            this.screen.top = box.top + window.pageYOffset - d.clientTop;
            this.screen.width = box.width;
            this.screen.height = box.height;
        }
    };

    this.handleEvent = function ( event ) {
        if ( typeof this[ event.type ] == 'function' ) {
            this[ event.type ]( event );
        }
    };

    var getMouseOnScreen = ( function () {
        var vector = new THREE.Vector2();
        return function ( pageX, pageY ) {
            vector.set(
                    ( pageX - that.screen.left ) / that.screen.width,
                    ( pageY - that.screen.top ) / that.screen.height
            );
            return vector;
        };
    }());

    var getMouseOnCircle = ( function () {
        var vector = new THREE.Vector2();
        return function ( pageX, pageY ) {
            vector.set(
                ( ( pageX - that.screen.width * 0.5 - that.screen.left ) / ( that.screen.width * 0.5 ) ),
                ( ( that.screen.height + 2 * ( that.screen.top - pageY ) ) / that.screen.width ) // screen.width intentional
            );
            return vector;
        };
    }());

    this.rotateCamera = (function() {
        var axis = new THREE.Vector3(),
            quaternion = new THREE.Quaternion(),
            eyeDirection = new THREE.Vector3(),
            objectUpDirection = new THREE.Vector3(),
            objectSidewaysDirection = new THREE.Vector3(),
            moveDirection = new THREE.Vector3(),
            angle;
        return function () {
            moveDirection.set( _moveCurr.x - _movePrev.x, _moveCurr.y - _movePrev.y, 0 );
            angle = moveDirection.length();
            if ( angle ) {
                _eye.copy( that.object.position ).sub( that.target );
                eyeDirection.copy( _eye ).normalize();
                objectUpDirection.copy( that.object.up ).normalize();
                objectSidewaysDirection.crossVectors( objectUpDirection, eyeDirection ).normalize();
                objectUpDirection.setLength( _moveCurr.y - _movePrev.y );
                objectSidewaysDirection.setLength( _moveCurr.x - _movePrev.x );
                moveDirection.copy( objectUpDirection.add( objectSidewaysDirection ) );
                axis.crossVectors( moveDirection, _eye ).normalize();
                angle *= that.rotateSpeed;
                quaternion.setFromAxisAngle( axis, angle );
                _eye.applyQuaternion( quaternion );
                that.object.up.applyQuaternion( quaternion );
                _lastAxis.copy( axis );
                _lastAngle = angle;
            } else if ( !that.staticMoving && _lastAngle ) {
                _lastAngle *= Math.sqrt( 1.0 - that.dynamicDampingFactor );
                _eye.copy( that.object.position ).sub( that.target );
                quaternion.setFromAxisAngle( _lastAxis, _lastAngle );
                _eye.applyQuaternion( quaternion );
                that.object.up.applyQuaternion( quaternion );
            }
            _movePrev.copy( _moveCurr );
        };
    }());

    this.zoomCamera = function () {
        var factor;
        if ( _state === STATE.TOUCH_ZOOM_PAN ) {
            factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
            _touchZoomDistanceStart = _touchZoomDistanceEnd;
            _eye.multiplyScalar( factor );
        } else {
            factor = 1.0 + ( _zoomEnd.y - _zoomStart.y ) * that.zoomSpeed;
            if ( factor !== 1.0 && factor > 0.0 ) {
                _eye.multiplyScalar( factor );
                if ( that.staticMoving ) {
                    _zoomStart.copy( _zoomEnd );
                } else {
                    _zoomStart.y += ( _zoomEnd.y - _zoomStart.y ) * this.dynamicDampingFactor;
                }
            }
        }
    };

    this.panCamera = (function() {
        var mouseChange = new THREE.Vector2(),
            objectUp = new THREE.Vector3(),
            pan = new THREE.Vector3();
        return function () {
            mouseChange.copy( _panEnd ).sub( _panStart );
            if ( mouseChange.lengthSq() ) {
                mouseChange.multiplyScalar( _eye.length() * that.panSpeed );
                pan.copy( _eye ).cross( that.object.up ).setLength( mouseChange.x );
                pan.add( objectUp.copy( that.object.up ).setLength( mouseChange.y ) );
                that.object.position.add( pan );
                that.target.add( pan );

                if ( that.staticMoving ) {
                    _panStart.copy( _panEnd );
                } else {
                    _panStart.add( mouseChange.subVectors( _panEnd, _panStart ).multiplyScalar( that.dynamicDampingFactor ) );
                }
            }
        };
    }());

    this.checkDistances = function () {
        if ( !that.noZoom || !that.noPan ) {
            if ( _eye.lengthSq() > that.maxDistance * that.maxDistance ) {
                that.object.position.addVectors( that.target, _eye.setLength( that.maxDistance ) );
            }
            if ( _eye.lengthSq() < that.minDistance * that.minDistance ) {
                that.object.position.addVectors( that.target, _eye.setLength( that.minDistance ) );
            }
        }
    };

    this.update = function () {
        _eye.subVectors( that.object.position, that.target );
        if ( !that.noRotate ) {
            that.rotateCamera();
        }
        if ( !that.noZoom ) {
            that.zoomCamera();
        }
        if ( !that.noPan ) {
            that.panCamera();
        }
        that.object.position.addVectors( that.target, _eye );
        that.checkDistances();
        that.object.lookAt( that.target );
        if ( lastPosition.distanceToSquared( that.object.position ) > EPS ) {
            that.dispatchEvent( changeEvent );
            lastPosition.copy( that.object.position );
        }
    };

    this.reset = function () {
        _state = STATE.NONE;
        _prevState = STATE.NONE;
        that.target.copy( that.target0 );
        that.object.position.copy( that.position0 );
        that.object.up.copy( that.up0 );
        _eye.subVectors( that.object.position, that.target );
        that.object.lookAt( that.target );
        that.dispatchEvent( changeEvent );
        lastPosition.copy( that.object.position );
    };

    // listeners

    function keydown( event ) {
        if ( that.enabled === false ) return;
        window.removeEventListener( 'keydown', keydown );
        _prevState = _state;
        if ( _state !== STATE.NONE ) {
            return;
        } else if ( event.keyCode === that.keys[ STATE.ROTATE ] && !that.noRotate ) {
            _state = STATE.ROTATE;
        } else if ( event.keyCode === that.keys[ STATE.ZOOM ] && !that.noZoom ) {
            _state = STATE.ZOOM;
        } else if ( event.keyCode === that.keys[ STATE.PAN ] && !that.noPan ) {
            _state = STATE.PAN;
        }
    }

    function keyup( event ) {
        if ( that.enabled === false ) return;
        _state = _prevState;
        window.addEventListener( 'keydown', keydown, false );
    }

    function mousedown( event ) {
        that.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        that.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        that.raycaster.setFromCamera( that.mouse, that.object );
        var intersects = that.raycaster.intersectObjects( that.object.parent.children, true);
        if ( intersects.length > 0 ) {
            for(var i in intersects) {
                var intersected_object = intersects[i].object;
                console.log(intersected_object.userData.t);
            }
            return;
        }
        if ( that.enabled === false ) return;
        event.preventDefault();
        event.stopPropagation();
        if ( _state === STATE.NONE ) {
            _state = event.button;
        }
        if ( _state === STATE.ROTATE && !that.noRotate ) {
            _moveCurr.copy( getMouseOnCircle( event.pageX, event.pageY ) );
            _movePrev.copy(_moveCurr);
        } else if ( _state === STATE.ZOOM && !that.noZoom ) {
            _zoomStart.copy( getMouseOnScreen( event.pageX, event.pageY ) );
            _zoomEnd.copy(_zoomStart);
        } else if ( _state === STATE.PAN && !that.noPan ) {
            _panStart.copy( getMouseOnScreen( event.pageX, event.pageY ) );
            _panEnd.copy(_panStart);
        }
        document.addEventListener( 'mousemove', mousemove, false );
        document.addEventListener( 'mouseup', mouseup, false );
        that.dispatchEvent( startEvent );
    }

    function mousemove( event ) {
        if ( that.enabled === false ) return;
        event.preventDefault();
        event.stopPropagation();
        if ( _state === STATE.ROTATE && !that.noRotate ) {
            _movePrev.copy(_moveCurr);
            _moveCurr.copy( getMouseOnCircle( event.pageX, event.pageY ) );
        } else if ( _state === STATE.ZOOM && !that.noZoom ) {
            _zoomEnd.copy( getMouseOnScreen( event.pageX, event.pageY ) );
        } else if ( _state === STATE.PAN && !that.noPan ) {
            _panEnd.copy( getMouseOnScreen( event.pageX, event.pageY ) );
        }
    }

    function mouseup( event ) {
        if ( that.enabled === false ) return;
        event.preventDefault();
        event.stopPropagation();
        _state = STATE.NONE;
        document.removeEventListener( 'mousemove', mousemove );
        document.removeEventListener( 'mouseup', mouseup );
        that.dispatchEvent( endEvent );
    }

    function mousewheel( event ) {
        if ( that.enabled === false ) return;
        event.preventDefault();
        event.stopPropagation();
        var delta = 0;
        if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9
            delta = event.wheelDelta / 40;
        } else if ( event.detail ) { // Firefox
            delta = - event.detail / 3;
        }
        _zoomStart.y += delta * 0.01;
        that.dispatchEvent( startEvent );
        that.dispatchEvent( endEvent );
    }

    function touchstart( event ) {
        if ( that.enabled === false ) return;
        switch ( event.touches.length ) {
            case 1:
                _state = STATE.TOUCH_ROTATE;
                _moveCurr.copy( getMouseOnCircle( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
                _movePrev.copy(_moveCurr);
                break;
            case 2:
                _state = STATE.TOUCH_ZOOM_PAN;
                var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
                var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
                _touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt( dx * dx + dy * dy );
                var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
                var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
                _panStart.copy( getMouseOnScreen( x, y ) );
                _panEnd.copy( _panStart );
                break;
            default:
                _state = STATE.NONE;
        }
        that.dispatchEvent( startEvent );
    }

    function touchmove( event ) {
        if ( that.enabled === false ) return;
        event.preventDefault();
        event.stopPropagation();
        switch ( event.touches.length ) {
            case 1:
                _movePrev.copy(_moveCurr);
                _moveCurr.copy( getMouseOnCircle(  event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
                break;
            case 2:
                var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
                var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
                _touchZoomDistanceEnd = Math.sqrt( dx * dx + dy * dy );
                var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
                var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
                _panEnd.copy( getMouseOnScreen( x, y ) );
                break;
            default:
                _state = STATE.NONE;
        }
    }

    function touchend( event ) {
        if ( that.enabled === false ) return;
        switch ( event.touches.length ) {
            case 1:
                _movePrev.copy(_moveCurr);
                _moveCurr.copy( getMouseOnCircle(  event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
                break;
            case 2:
                _touchZoomDistanceStart = _touchZoomDistanceEnd = 0;
                var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
                var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
                _panEnd.copy( getMouseOnScreen( x, y ) );
                _panStart.copy( _panEnd );
                break;
        }
        _state = STATE.NONE;
        that.dispatchEvent( endEvent );
    }

    this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
    this.domElement.addEventListener( 'mousedown', mousedown, false );
    this.domElement.addEventListener( 'mousewheel', mousewheel, false );
    this.domElement.addEventListener( 'DOMMouseScroll', mousewheel, false ); // firefox
    this.domElement.addEventListener( 'touchstart', touchstart, false );
    this.domElement.addEventListener( 'touchend', touchend, false );
    this.domElement.addEventListener( 'touchmove', touchmove, false );
    window.addEventListener( 'keydown', keydown, false );
    window.addEventListener( 'keyup', keyup, false );
    this.handleResize();
    this.update();
};

DN3.TrackballControls.prototype = Object.create( THREE.EventDispatcher.prototype );
DN3.TrackballControls.prototype.constructor = DN3.TrackballControls;