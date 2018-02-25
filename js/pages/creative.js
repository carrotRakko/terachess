
function Creative ( params ) {

    this._$parentDOM = params.$parentDOM;
    this._chess = params.chess;
    this._children = {};

    this._board = this._chess.getDefaultBoard();
    if ( params.startWith === 'plain' ) this._board = this._chess.getPlainBoard();
    this._enpassants = [];

    this._selected_cells = [];
    this._able_cells = [];
    this._selected_piece = '';

    this._perspective = true;

    this._history = [];
    this._history.push( {
        board: _.cloneDeep( this._board ),
        enpassant: [],
        selected_cells: [],
        selected_piece: ''
    } );
    this._at = 0;

}

_.assign( Creative.prototype, {

    reRender: function ( data ) {

        var compiled = _.template( '\
            <div class="creative">\
                <div class="creative-board"></div>\
                <div class="creative-palette creative-palette-left"></div>\
                <div class="creative-palette creative-palette-right"></div>\
                <div class="creative-control"></div>\
            </div>\
        ' );

        var $rendered = $( compiled() ).appendTo( this._$parentDOM.empty() );

        this._children.board = new Board( {
            $parentDOM: $( '.creative-board', $rendered ),
            perspective: this._perspective,
            handler: {
                onClick: _.bind( this.onBoardClick, this )
            }
        } );

        this._children.palette_black = new Palette( {
            $parentDOM: this._perspective ? $( '.creative-palette-left', $rendered ) : $( '.creative-palette-right', $rendered ),
            color: 'black',
            pieces: this._chess.getBlackPieces().slice( 0, 24 ),
            handler: {
                onClick: _.bind( this.onPaletteClick, this )
            }
        } );

        this._children.palette_white = new Palette( {
            $parentDOM: this._perspective ? $( '.creative-palette-right', $rendered ) : $( '.creative-palette-left', $rendered ),
            color: 'white',
            pieces: this._chess.getWhitePieces().slice( 0, 24 ),
            handler: {
                onClick: _.bind( this.onPaletteClick, this )
            }
        } );

        this._children.control = new Control( {
            $parentDOM: $( '.creative-control', $rendered ),
            handler: {
                onClick: _.bind( this.onControlClick, this ),
                onChange: _.bind( this.onControlChange, this )
            }
        } );

        this._onChange();

        this._setEvent( $rendered );

    },

    _setEvent: function ( $rendered ) {

        var _this = this;

        $rendered.on( 'click', function () {
            // _this._cancelSelect();
            // _this._onChange();
        } );

        $( document ).on( 'keyup', function ( e ) {

            if ( e ) {

                switch ( e.keyCode ) {

                    case 46:
                    case 8:
                        if ( !_.isEmpty( _this._selected_cells ) ) {
                            _( _this._selected_cells ).map( function ( selected_cell ) {
                                _this._board[selected_cell.file][selected_cell.rank] = '';
                            } ).value();
                            _this._spliceHistory();
                            _this._cancelSelect();
                            _this._onChange();
                        }
                        if( !_.isEmpty( _this._selected_piece ) ) {
                            _this._spliceHistory();
                            _this._cancelSelect();
                            _this._onChange();
                        }
                        cancel();
                        break;
                    case 27:
                        if ( !_.isEmpty( _this._selected_cells ) ) {

                            _this._spliceHistory();
                            _this._cancelSelect();
                            _this._onChange();
                        }
                        if( !_.isEmpty( _this._selected_piece ) ) {
                            _this._spliceHistory();
                            _this._cancelSelect();
                            _this._onChange();
                        }
                        cancel();
                        break;
                    default:
                        break;

                }

                function cancel () {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }

        } );

    },

    _changeAt: function () {
        this._board = _.cloneDeep( this._history[this._at].board );
        this._enpassants = _.cloneDeep( this._history[this._at].enpassants );
        this._selected_cells = _.cloneDeep( this._history[this._at].selected_cells );
        this._selected_piece = _.cloneDeep( this._history[this._at].selected_piece );
    },

    _spliceHistory: function () {
        this._history.splice( ++this._at );
        this._history.push( {
            board: _.cloneDeep( this._board ),
            enpassants: _.cloneDeep( this._enpassants ),
            selected_cells: _.cloneDeep( this._selected_cells ),
            selected_piece: this._selected_piece
        } );
    },

    _onChange: function () {

        var _this = this;

        // this._history.splice( ++this._at ).push( {
        //     board: _.cloneDeep( this._board ),
        //     enpassants: _.cloneDeep( this._enpassants ),
        //     selected_cells: _.cloneDeep( this._selected_cells ),
        //     selected_piece: this._selected_piece
        // } );

        this._able_cells = _.flatMap( this._selected_cells, function ( selected_cell ) {
            return _this._chess.getMoves( {
                board: _this._board,
                teban: undefined,
                enpassants: _this._enpassants
            }, selected_cell );
        } );

        this._children.board.reRender( {
            board: this._board,
            enpassants: this._enpassants,
            selected_cells: this._selected_cells,
            able_cells: this._able_cells
        } );

        this._children.palette_black.reRender( {
            selected_piece: this._selected_piece
        } );

        this._children.palette_white.reRender( {
            selected_piece: this._selected_piece
        } );

        this._children.control.reRender( {
            ll: this._at === 0 ? false : true,
            l : this._at === 0 ? false : true,
            g : this._at === this._history.length - 1 ? false : true,
            gg: this._at === this._history.length - 1 ? false : true
        } );

    },

    _cancelSelect: function () {
        this._selected_cells = [];
        this._able_cells = [];
        this._selected_piece = '';
    },

    onBoardClick: function ( eventData ) {

        var file = eventData.file;
        var rank = eventData.rank;
        var ctrl = eventData.ctrl;
        var shift = eventData.shift;

        if ( shift ) {

            switch ( this._board[file][rank] ) {
                case 'Ln':
                    this._board[file][rank] = 'Ln2';
                    break;
                case 'Ln2':
                    this._board[file][rank] = 'Ln';
                    break;
                case 'vLn':
                    this._board[file][rank] = 'vLn2';
                    break;
                case 'vLn2':
                    this._board[file][rank] = 'vLn';
                    break;
                case 'P':
                case 'Cp':
                case 'Pr':
                case 'vP':
                case 'vCp':
                case 'vPr':
                    if ( _.findIndex( this._enpassants, function ( enpassant ) { return _.isEqual( enpassant, { file: file, rank: rank } ) } ) === - 1 ) {
                        this._enpassants.push( {
                            file: file,
                            rank: rank
                        } );
                    } else {
                        _.remove( this._enpassants, function ( enpassant ) { return _.isEqual( enpassant, { file: file, rank: rank } ) } );
                    }

            }

        } else if ( ctrl ) {

            if ( this._selected_piece === '' ) {
                if ( _.findIndex( this._selected_cells, function ( selected_cell ) { return _.isEqual( selected_cell, { file: file, rank: rank } ) } ) === - 1 ) {
                    if ( this._board[file][rank] !== '' ) {
                        this._selected_cells.push( {
                            file: file,
                            rank: rank
                        } );
                    } else {
                        this._cancelSelect();
                    }
                } else {
                    if ( this._board[file][rank] !== '' ) {
                        _.remove( this._selected_cells, function ( selected_cell ) {
                            return _.isEqual( selected_cell, { file: file, rank: rank } );
                        } );
                    } else {
                        this._cancelSelect();
                    }
                }
            } else {
                this._cancelSelect();
            }

        } else {

            // セル未選択
            if ( _.isEmpty( this._selected_cells ) ) {

                // セル未選択 && 駒未選択
                if ( _.isEmpty( this._selected_cells ) && this._selected_piece === '' && this._board[file][rank] !== '' ) {
                    this._selected_cells.push( {
                        file: file,
                        rank: rank
                    } );
                // セル未選択 && 駒選択
                } else {
                    this._board[file][rank] = this._selected_piece;
                    this._cancelSelect();
                }

            } else {

                // セルが一つ選択
                if ( this._selected_cells.length === 1 ) {
                    var moving = this._board[this._selected_cells[0].file][this._selected_cells[0].rank];
                    this._board[this._selected_cells[0].file][this._selected_cells[0].rank] = '';
                    this._board[file][rank] = moving;
                    this._cancelSelect();
                // セルが複数選択
                } else {
                    this._cancelSelect();
                }

            }

        }

        this._spliceHistory();

        this._onChange();
        eventData.e.preventDefault();
        eventData.e.stopPropagation();
    },

    onPaletteClick: function ( eventData ) {

        if ( !_.isEmpty( this._selected_cells ) || !_.isEmpty( this._selected_piece ) ) {
            this._cancelSelect();
        } else {
            this._selected_piece = eventData.piece;
        }

        this._spliceHistory();

        this._onChange();
        eventData.e.preventDefault();
        eventData.e.stopPropagation();
    },

    // onPaletteBlackClick: function ( eventData ) {
    //
    //     if ( !_.isEmpty( this._selected_cells ) || !_.isEmpty( this._selected_piece ) ) {
    //         this._cancelSelect();
    //     } else {
    //         this._selected_piece = eventData.piece;
    //     }
    //
    //     this._onChange();
    // },
    //
    // onPaletteWhiteClick: function ( eventData ) {
    //
    //     if ( !_.isEmpty( this._selected_cells ) || !_.isEmpty( this._selected_piece ) ) {
    //         this._cancelSelect();
    //     } else {
    //         this._selected_piece = eventData.piece;
    //     }
    //
    //     this._onChange();
    // },

    onControlClick: function ( eventData ) {

        // if ( eventData.loadhistory ) {
        //     this._children.control.clickLoadHistory();
        // }
        //
        // if ( eventData.loadboard ) {
        //     this._children.control.clickLoadboard();
        // }

        if ( eventData.perspective ) {
            this._perspective = !this._perspective;
            this.reRender();
        } else if ( eventData.first ) {
            this._at = 0;
            this._changeAt();
            this.reRender();
        } else if ( eventData.previous ) {
            this._at = ( this._at > 0 ) ? --this._at : 0;
            this._changeAt();
            this.reRender();
        } else if ( eventData.next ) {
            this._at = ( this._at < this._history.length - 1 ) ? ++this._at : this._history.length - 1;
            this._changeAt();
            this.reRender();
        } else if ( eventData.last ) {
            this._at = this._history.length - 1;
            this._changeAt();
            this.reRender();
        } else if ( eventData.downloadboard ) {
            var new_file_name = this.createDefaultFileName();
            new_file_name = prompt('状態を保存します。ファイル名を変更することもできます。', new_file_name);
            if ( new_file_name && new_file_name.match(/^[0-9a-zA-Z][0-9a-zA-Z-_.]*$/) ) {
                var state_json = JSON.stringify( {
                    board: this._board,
                    enpassants: this._enpassants,
                    selected_cells: this._selected_cells,
                    selected_piece: this._selected_piece
                } );
                var blob = new Blob( [state_json], { "type": "application/json" } );
                var a = document.createElement('a');
                a.href = window.URL.createObjectURL( blob );
                a.download = new_file_name + '.state';
                a.click();
            } else if ( new_file_name === null ) {

            } else if ( new_file_name === '' ) {
                alert( 'ファイル名を入力してください。' );
            } else {
                alert( 'ファイル名の形式が正しくありません。' );
            }
        } else if ( eventData.downloadhistory ) {
            var new_file_name = this.createDefaultFileName();
            new_file_name = prompt('履歴を保存します。ファイル名を変更することもできます。', new_file_name);
            if ( new_file_name && new_file_name.match(/^[0-9a-zA-Z][0-9a-zA-Z-_.]*$/) ) {
                var history_json = JSON.stringify( this._history );
                var blob = new Blob( [history_json], { "type": "application/json" } );
                var a = document.createElement('a');
                a.href = window.URL.createObjectURL( blob );
                a.download = new_file_name + '.history';
                a.click();
            } else if ( new_file_name === null ) {

            } else if ( new_file_name === '' ) {
                alert( 'ファイル名を入力してください。' );
            } else {
                alert( 'ファイル名の形式が正しくありません。' );
            }
        }

        // if ( !eventData.loadhistory && !eventData.loadboard ) {
        //     eventData.e.preventDefault();
        //     eventData.e.stopPropagation();
        // }

    },

    onControlChange: function ( eventData ) {
        switch ( eventData.type ) {
            case 'history':
                this._history = JSON.parse( eventData.e.target.result );
                this._at = this._history.length - 1;
                this._changeAt();
                this._onChange();
                break;
            case 'board':
                var state = JSON.parse( eventData.e.target.result );
                this._board = state.board;
                this._enpassants = state.enpassants;

                this._selected_cells = state.selected_cells;
                this._able_cells = [];
                this._selected_piece = state.selected_piece;

                this._history = [];
                this._history.push( {
                    board: _.cloneDeep( this._board ),
                    enpassant: [],
                    selected_cells: [],
                    selected_piece: ''
                } );
                this._at = 0;
                this._onChange();
                break;
        }
    },

    createDefaultFileName: function ( ) {
        var now = new Date( );
        return [
            now.getFullYear(),
            now.getMonth() + 1 < 10 ? '0' + ( now.getMonth() + 1 ) : now.getMonth() + 1 ,
            now.getDate() < 10 ? '0' + now.getDate() : now.getDate(),
            now.getHours() < 10 ? '0' + now.getHours() : now.getHours(),
            now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes(),
            now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()
        ].join('') + '-' + Date.now();
    }

} );
