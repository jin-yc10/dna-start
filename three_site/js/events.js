/**
 * Created by jin-yc10 on 15/9/14.
 */

DN3.Events = {
    DUMB:"Event.Dumb",
    ADD_THREE_ARM:"Event.Add.ThreeArm"
};

DN3.Events = (function() {
    var cache = {};
    return {
        on: function (e, fn) {
            if (!cache[e])
                cache[e] = [];
            cache[e].push(fn);
        },
        off: function (e, fn) {
            if (!cache[e])  return;
            var fns = cache[e];
            if (!fn)  fns.length = 0;
            var index = fns.indexOf(fn);
            if (index !== 0) fns.splice(index, 1);
        },
        trigger: function (e, data) {
            if (!cache[e]) return;
            var fns = cache[e];
            for (var i = 0; i < fns.length; ++i) {
                fns[i](e, data);
            }
        }
    }
})();