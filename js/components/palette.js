
function Palette ( params ) {

    this._$parentDOM = params.$parentDOM;

    this._color = params.color;
    this._pieces = params.pieces;

    this._handler = params.handler;

}

_.assign( Palette.prototype, {

    reRender: function ( data ) {

        var selected_piece = data.selected_piece;

        var compiled = _.template( '\
            <div class="palette <%- color %>">\
                <div class="palette-inner">\
                    <% _.forEach( pieces, function ( piece ) { %>\
                        <div class="palette-piece <%- piece %> <%- selected( piece ) %>" data-piece="<%- piece %>"></div>\
                    <% } ); %>\
                </div>\
            </div>\
        ' );

        var p = {
            color: this._color,
            pieces: this._pieces,
            selected: function ( piece ) {
                return selected_piece === piece ? 'selected' : '';
            }
        }

        var $rendered = $( compiled( p ) ).appendTo( this._$parentDOM.empty() );

        this._setEvent( $rendered );

    },

    _setEvent: function ( $rendered ) {

        var _this = this;

        $( '.palette-piece', $rendered ).on( 'click', function ( e ) {
            // var index = $( '.palette-piece', $rendered ).index( this );
            // var piece = _this._pieces[ index ];
            var piece = $( this ).data( 'piece' );
            _this._handler.onClick( {
                e: e,
                piece: piece
            } );
        } );

    },

} );
