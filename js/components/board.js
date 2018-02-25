
function Board ( params ) {

    this._$parentDOM = params.$parentDOM;

    this._perspective = params.perspective;

    this._handler = params.handler;

}

_.assign( Board.prototype, {

    reRender: function ( data ) {

        // 15 = 16 - 1 はマジックナンバー

        var files = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p'];
        var ranks = _.times( 16, (i) => i + 1 );

        var perspective = this._perspective;

        var board = data.board;
        var enpassants = data.enpassants;
        var selected_cells = data.selected_cells;
        var able_cells = data.able_cells;

        var compiled = _.template( '\
            <div class="board">\
                <div class="board-top">\
                    <% for ( var col = 0; col <= 15; col++ ) { %>\
                        <div class="board-file"><%- files[perspective ? col : 15 - col]%></div>\
                    <% } %>\
                </div>\
                <div class="board-bottom">\
                    <% for ( var col = 0; col <= 15; col++ ) { %>\
                        <div class="board-file"><%- files[perspective ? col : 15 - col]%></div>\
                    <% } %>\
                </div>\
                <div class="board-left">\
                    <% for ( var row = 0; row <= 15; row++ ) { %>\
                        <div class="board-rank"><%- ranks[perspective ? 15 - row : row]%></div>\
                    <% } %>\
                </div>\
                <div class="board-right">\
                    <% for ( var row = 0; row <= 15; row++ ) { %>\
                        <div class="board-rank"><%- ranks[perspective ? 15 - row : row]%></div>\
                    <% } %>\
                </div>\
                <div class="board-inner">\
                    <% for ( var row = 15; row >= 0; row-- ) { \
                        for ( var col = 0; col <= 15; col++ ) { \
                            if (enpassant(row, col)) console.log("enpassant: \\n\\tfile: " + files[perspective ? col : 15 - col] + "\\n\\trank: " + ranks[perspective ? 15 - row : row]); %>\
                            <div class="board-cell <%- color( row, col ) %> <%- piece( row, col ) %> <%- enpassant( row, col ) %> <%- selected( row, col ) %> <%- able( row, col ) %>"></div>\
                        <% } \
                    } %>\
                </div>\
            </div>\
        ' );

        var p = {
            perspective: perspective,
            files: files,
            ranks: ranks,
            color: function ( row, col ) {
                return row % 2 ^ col % 2 ? "white" : "black"
            },
            piece: function ( row, col ) {
                return board[perspective ? col : 15 - col][perspective ? row : 15 - row];
            },
            enpassant: function ( row, col ) {
                return _.findIndex( enpassants, function ( enpassant ) {
                    return enpassant.file === ( perspective ? col : 15 - col ) && enpassant.rank === ( perspective ? row : 15 - row );
                } ) != - 1 ? 'enpassant' : '';
            },
            selected: function ( row, col ) {
                return _.findIndex( selected_cells, function ( selected_cell ) {
                    return selected_cell.file === ( perspective ? col : 15 - col ) && selected_cell.rank === ( perspective ? row : 15 - row );
                } ) != - 1 ? 'selected' : '';
            },
            able: function ( row, col ) {
                return _.findIndex( able_cells, function ( able_cell ) {
                    return able_cell.to.file === ( perspective ? col : 15 - col ) && able_cell.to.rank === ( perspective ? row : 15 - row );
                } ) != - 1 ? 'able' : '';
            }
        };

        var $rendered = $( compiled( p ) ).appendTo( this._$parentDOM.empty() );

        this._setEvent( $rendered );

    },

    _setEvent: function ( $rendered ) {

        var _this = this;

        $( '.board-cell', $rendered ).on( 'click', function ( e ) {

            var index = $( '.board-cell', $rendered ).index( this );
            var file = _this._perspective ? index % 16 : ( 15 - index % 16 );
            var rank = _this._perspective ? ( 15 - Math.floor( index / 16 ) ) : Math.floor( index / 16 );

            if ( Util.isShift( e ) ) {
                _this._handler.onClick( {
                    e: e,
                    file: file,
                    rank: rank,
                    ctrl: false,
                    shift: true
                } );
            } else if ( Util.isCtrl( e ) ) {
                _this._handler.onClick( {
                    e: e,
                    file: file,
                    rank: rank,
                    ctrl: true
                } );
            } else {
                _this._handler.onClick( {
                    e: e,
                    file: file,
                    rank: rank,
                    ctrl: false
                } );
            }

        } );

    },

} );
