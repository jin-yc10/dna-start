/**
 * Created by jin-yc10 on 15/10/22.
 */

var Data = function(editor) {
    var signals = editor.signals;
    return {
        get: function(url) {
            $.getJSON(url,
                function(data) {

                }
            );
        }
    }
};