/**
 * Created by jin-yc10 on 15/9/13.
 */

var DN3 = DN3 || {};
DN3.version = "0.1";
(function(){
    $(document).ready(function(){
        var viewport = new DN3.Viewport(),
            ui = new DN3.Ui();
        ui.render();
        // App Resize
        window.addEventListener('resize', function(event) {
            viewport.setSize( window.innerWidth, window.innerHeight );
        }, false);

        // Start animating viewport
        viewport.animate();
        viewport.setSize( window.innerWidth, window.innerHeight );
    });
})();