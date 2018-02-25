
var Util = {
    isCtrl: function ( e ) {
        return e.ctrlKey && !e.metaKey || !e.ctrlKey && e.metaKey;
    },
    isShift: function ( e ) {
        return e.shiftKey;
    }
}
