
function Control ( params ) {

    this._$parentDOM = params.$parentDOM;

    this._handler = params.handler;

}

_.assign( Control.prototype, {

    reRender: function ( data ) {

        var ll = data.ll,
            l  = data.l ,
            g  = data.g ,
            gg = data.gg;

        var compiled = _.template( '\
            <div class="control">\
                <div class="control-inner">\
                    <div class="control-button control-button-loadhistory"><label for="control-file-loadhistory">↑↑<input name="control-file-loadhistory" type="file" id="control-file-loadhistory" /></label></div>\
                    <div class="control-button control-button-loadboard"><label for="control-file-loadboard">↑<input name="control-file-loadboard" type="file" id="control-file-loadboard" /></label></div>\
                    <div class="control-button control-button-first <%- first %>">《</div>\
                    <div class="control-button control-button-previous <%- previous %>">〈</div>\
                    <div class="control-button control-button-perspective"></div>\
                    <div class="control-button control-button-next <%- next %>">〉</div>\
                    <div class="control-button control-button-last <%- last %>">》</div>\
                    <div class="control-button control-button-downloadboard">↓</div>\
                    <div class="control-button control-button-downloadhistory">↓↓</div>\
                </div>\
            </div>\
        ' );

        var p = {
            first   : ll ? 'enabled' : 'disabled',
            previous: l  ? 'enabled' : 'disabled',
            next    : g  ? 'enabled' : 'disabled',
            last    : gg ? 'enabled' : 'disabled'
        }

        var $rendered = $( compiled( p ) ).appendTo( this._$parentDOM.empty() );

        this._setEvent( $rendered );

    },

    _setEvent: function ( $rendered ) {

        // this.clickLoadHistory = function () {
        //     $( '#control-file-loadhistory', $rendered ).click();
        // }
        // this.clickLoadBoard = function () {
        //     $( '#control-file-loadboard', $rendered ).click();
        // }

        var _this = this;

        $( '#control-file-loadhistory', $rendered ).on( 'change', function ( evt ) {
            // console.log(evt);
            var file = evt.target.files[0];
            // if ( !file ) return;
            var reader = new FileReader( );
            reader.onload = function ( e ) {
                _this._handler.onChange( {
                    type: 'history',
                    e: e
                } );
            }
            reader.readAsText( file );
        } );

        $( '#control-file-loadboard', $rendered ).on( 'change', function ( evt ) {
            var file = evt.target.files[0];
            // if ( !file ) return;
            var reader = new FileReader( );
            reader.onload = function ( e ) {
                _this._handler.onChange( {
                    type: 'board',
                    e: e
                } );
            }
            reader.readAsText( file );
        } );

        // $( '.control-button-loadhistory', $rendered ).on( 'click', function ( e ) {
        //     _this._handler.onClick( {
        //         e: e,
        //         loadhistory: true
        //     } );
        // } );
        //
        // $( '.control-button-loadboard', $rendered ).on( 'click', function ( e ) {
        //     _this._handler.onClick( {
        //         e: e,
        //         loadboard: true
        //     } );
        // } );

        $( '.control-button-first', $rendered ).on( 'click', function ( e ) {
            _this._handler.onClick( {
                e: e,
                first: true
            } );
        } );

        $( '.control-button-previous', $rendered ).on( 'click', function ( e ) {
            _this._handler.onClick( {
                e: e,
                previous: true
            } );
        } );

        $( '.control-button-perspective', $rendered ).on( 'click', function ( e ) {
            _this._handler.onClick( {
                e: e,
                perspective: true
            } );
        } );

        $( '.control-button-next', $rendered ).on( 'click', function ( e ) {
            _this._handler.onClick( {
                e: e,
                next: true
            } );
        } );

        $( '.control-button-last', $rendered ).on( 'click', function ( e ) {
            _this._handler.onClick( {
                e: e,
                last: true
            } );
        } );

        $( '.control-button-downloadboard', $rendered ).on( 'click', function ( e ) {
            _this._handler.onClick( {
                e: e,
                downloadboard: true
            } );
        } );

        $( '.control-button-downloadhistory', $rendered ).on( 'click', function ( e ) {
            _this._handler.onClick( {
                e: e,
                downloadhistory: true
            } );
        } );


    },

} );
