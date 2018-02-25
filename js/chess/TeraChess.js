// array files,
// array ranks,
// set pieces,
// array of arrays board: files * ranks -> pieces

// state = {
//     board,
//     teban,
//     enpassants: array of { file: file, rank, rank } || false
// }

// position = {
//     file,
//     rank
// }

// move = {
//     from: { file, rank },
//     to: { file, rank },
//     capture: { file, rank } || false,
//     promotion: piece || false,
//     continue: array of moves || false,
//     enpassant: { file, rank } || false,
//     ep: true || false
// }

// pos = { file, rank }

// move = {
//     from: pos,
//     to: pos,
//     capture: [ pos, ... ],
//     captureenpassant: true | false,
//     promotion: piece | '',
//     jesuisenpassant: true | false,
//     continue: [ move, ... ],
//     kihu: kihu
// }

// [ move, ... ] TeraChess.Move ( board, pos ) = ( board, pos )
// |> TeraChess._RawMove()
// |> TeraChess._Filter( board )
// |> TeraChess._AddKihu()
//
// [ move, ... ] TeraChess._RawMove( board, pos )
//
// [ move, ... ] TeraChess._Filter( [ move, ... ], board )
//
// [ move, ... ] TeraChess._AddKihu( [ move, ... ] )
//
// board TeraChess._Exec ( board, move )



;(function(){

    var TeraChess = {};

    TeraChess.getPlainBoard = function () {
        return [
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
        ];
    };

    TeraChess.getDefaultBoard = function () {
        return [
            //  1     2     3    4   5   6   7   8   9  10  11  12    13     14     15     16
            // a
            ['An', 'Cp', 'El', 'P', '', '', '', '', '', '', '', '', 'vP', 'vEl', 'vCp', 'vAn', ],
            // b
            ['Cm', 'Cp', 'Mc', 'P', '', '', '', '', '', '', '', '', 'vP', 'vMc', 'vCp', 'vCm', ],
            // c
            ['Bw', 'Cp', 'R',  'P', '', '', '', '', '', '', '', '', 'vP', 'vR',  'vCp', 'vBw', ],
            // d
            ['Bl', 'Cp', 'N',  'P', '', '', '', '', '', '', '', '', 'vP', 'vN',  'vCp', 'vBl', ],
            // e
            ['Cn', 'Cp', 'B',  'P', '', '', '', '', '', '', '', '', 'vP', 'vB',  'vCp', 'vCn', ],
            // f
            ['Bf', 'Cp', 'Sh', 'P', '', '', '', '', '', '', '', '', 'vP', 'vSh', 'vCp', 'vBf', ],
            // g
            ['Rh', 'Cp', 'Pr', 'P', '', '', '', '', '', '', '', '', 'vP', 'vPr', 'vCp', 'vRh', ],
            // h
            ['St', 'Ln', 'Q',  'P', '', '', '', '', '', '', '', '', 'vP', 'vQ',  'vLn', 'vSt', ],
            // i
            ['Un', 'Gr', 'K',  'P', '', '', '', '', '', '', '', '', 'vP', 'vK',  'vGr', 'vUn', ],
            // j
            ['Ms', 'Cp', 'Pr', 'P', '', '', '', '', '', '', '', '', 'vP', 'vPr', 'vCp', 'vMs', ],
            // k
            ['Cd', 'Cp', 'Sh', 'P', '', '', '', '', '', '', '', '', 'vP', 'vSh', 'vCp', 'vCd', ],
            // l
            ['Cn', 'Cp', 'B',  'P', '', '', '', '', '', '', '', '', 'vP', 'vB',  'vCp', 'vCn', ],
            // m
            ['Bl', 'Cp', 'N',  'P', '', '', '', '', '', '', '', '', 'vP', 'vN',  'vCp', 'vBl', ],
            // n
            ['Bw', 'Cp', 'R',  'P', '', '', '', '', '', '', '', '', 'vP', 'vR',  'vCp', 'vBw', ],
            // o
            ['Cm', 'Cp', 'Mc', 'P', '', '', '', '', '', '', '', '', 'vP', 'vMc', 'vCp', 'vCm', ],
            // p
            ['An', 'Cp', 'El', 'P', '', '', '', '', '', '', '', '', 'vP', 'vEl', 'vCp', 'vAn', ]
        ];
    };

    TeraChess.getBlackPieces = function () {
        return BLACK_PIECES;
    }

    TeraChess.getWhitePieces = function () {
        return WHITE_PIECES;
    }

    const WHITE_PIECES = [
        'P', 'Cp', 'Pr', 'K',
        'N', 'Cm', 'Bl', 'Bf',
        'El', 'Mc', 'An', 'Ln',
        'Bw', 'Cn', 'St',
        'Sh', 'Gr', 'Rh',
        'B', 'R', 'Q',
        'Cd', 'Ms', 'Un', 'Ln2'
    ];

    const BLACK_PIECES = [
        'vP', 'vCp', 'vPr', 'vK',
        'vN', 'vCm', 'vBl', 'vBf',
        'vEl', 'vMc', 'vAn', 'vLn',
        'vBw', 'vCn', 'vSt',
        'vSh', 'vGr', 'vRh',
        'vB', 'vR', 'vQ',
        'vCd', 'vMs', 'vUn', 'vLn2'
    ];

    const PIECES = [
        'P', 'Cp', 'Pr', 'K',
        'N', 'Cm', 'Bl', 'Bf',
        'El', 'Mc', 'An', 'Ln',
        'Bw', 'Cn', 'St',
        'Sh', 'Gr', 'Rh',
        'B', 'R', 'Q',
        'Cd', 'Ms', 'Un',
        'vP', 'vCp', 'vPr', 'vK',
        'vN', 'vCm', 'vBl', 'vBf',
        'vEl', 'vMc', 'vAn', 'vLn',
        'vBw', 'vCn', 'vSt',
        'vSh', 'vGr', 'vRh',
        'vB', 'vR', 'vQ',
        'vCd', 'vMs', 'vUn'
    ];

    function inBoard ( position ) {
        return position.file >= 0 && position.file < 16 && position.rank >= 0 && position.rank < 16;
    }

    function isEmpty ( board, position ) {
        return _.indexOf( PIECES, board[position.file][position.rank] ) === - 1;
    }

    function isWhite ( board, position ) {
        return !( _.indexOf( WHITE_PIECES, board[position.file][position.rank] ) === - 1 );
    }

    function isBlack ( board, position ) {
        return !( _.indexOf( BLACK_PIECES, board[position.file][position.rank] ) === - 1 );
    }

    function isEnemy ( board, position_1, position_2 ) {
        return isWhite( board, position_1 ) && isBlack( board, position_2 ) || isBlack( board, position_1 ) && isWhite( board, position_2 );
    }

    function inBoardEmpty ( board, position ) {
        return inBoard( position ) && isEmpty( board, position );
    }

    function inBoardEnemy ( board, position_1, position_2 ) {
        return inBoard( position_1 ) && inBoard( position_2 ) && isEnemy( board, position_1, position_2 );
    }

    // array of moves getMoves ( state, [ position ] )
    // state と position の形式は正しいと仮定
    TeraChess.getMoves = function ( state, position ) {

        if ( !position ) {
            return;
        }

        var file = position.file;
        var rank = position.rank;

        var moving = state.board[file][rank];

        var moves = Move[moving]( state, position );
        return _.uniqWith( moves, _.isEqual );

    }

    function forward ( state, position ) {
        if ( isEmpty( state.board, position ) ) return 0;
        if ( isWhite( state.board, position ) ) return + 1;
        if ( isBlack( state.board, position ) ) return - 1;
    }

    function or ( state, position, types ) {
        return _.flatMap( types, function ( type ) {
            return Move[type]( state, position );
        } );
    }

    function N_like ( state, position, targets ) {

        return _.flatMap( targets, function ( target ) {

            var file = position.file + target.file;
            var rank = position.rank + target.rank;

            if ( !inBoard( { file: file, rank: rank } ) ) {
                return [];
            }
            if ( isEmpty( state.board, { file: file, rank: rank } ) ) {
                return [
                    {
                        from: position,
                        to: {
                            file: file,
                            rank: rank
                        },
                        capture: false,
                        promotion: false,
                        continue: false,
                        enpassant: false,
                        ep: false
                    }
                ];
            }
            if ( isEnemy( state.board, position, { file: file, rank: rank } ) ) {
                return [
                    {
                        from: position,
                        to: {
                            file: file,
                            rank: rank
                        },
                        capture: {
                            file: file,
                            rank: rank
                        },
                        promotion: false,
                        continue: false,
                        enpassant: false,
                        ep: false
                    }
                ];
            }
            return [];

        } );

    }

    function B_like ( state, position, increments ) {

        return _.flatMap( increments, function ( increment ) {

            var moves = [];
            var file = position.file;
            var rank = position.rank;
            while ( true ) {
                file += increment.file;
                rank += increment.rank;
                if ( !inBoard( { file: file, rank, rank } ) ) {
                    return moves;
                }
                if ( isEmpty( state.board, { file: file, rank: rank } ) ) {
                    moves.push( {
                        from: {
                            file: position.file,
                            rank: position.rank
                        },
                        to: {
                            file: file,
                            rank: rank
                        },
                        capture: false,
                        promotion: false,
                        continue: false,
                        enpassant: false,
                        ep: false
                    } );
                    continue;
                }
                if ( isEnemy( state.board, { file: file, rank: rank }, position ) ) {
                    moves.push( {
                        from: {
                            file: position.file,
                            rank: position.rank
                        },
                        to: {
                            file: file,
                            rank: rank
                        },
                        capture: {
                            file: file,
                            rank: rank
                        },
                        promotion: false,
                        continue: false,
                        enpassant: false,
                        ep: false
                    } );
                }

                return moves;

            }

        } );

    }

    function Bw_like ( state, position, increments ) {

        return _.flatMap( increments, function ( increment ) {

            var moves = [];
            var file = position.file;
            var rank = position.rank;

            while ( true ) {

                file += increment.file;
                rank += increment.rank;

                if ( !inBoard( { file: file, rank: rank } ) ) {
                    return moves;
                }

                if ( isEmpty( state.board, { file: file, rank: rank } ) ) {
                    moves.push( {
                        from: {
                            file: position.file,
                            rank: position.rank
                        },
                        to: {
                            file: file,
                            rank: rank
                        },
                        capture: false,
                        promotion: false,
                        continue: false,
                        enpassant: false,
                        ep: false
                    } );
                    continue;
                }

                break;

            }

            while ( true ) {

                file += increment.file;
                rank += increment.rank;

                if ( !inBoard( { file: file, rank: rank } ) ) {
                    return moves;
                }

                if ( isEmpty( state.board, { file: file, rank: rank } ) ) {
                    continue;
                }

                if ( isEnemy( state.board, position, { file: file, rank: rank } ) ) {
                    moves.push( {
                        from: {
                            file: position.file,
                            rank: position.rank
                        },
                        to: {
                            file: file,
                            rank: rank
                        },
                        capture: {
                            file: file,
                            rank: rank
                        },
                        promotion: false,
                        continue: false,
                        enpassant: false,
                        ep: false
                    } );
                }

                return moves;
            }

        } );

    }

    function Sh_like ( state, position, increments ) {

        return _.flatMap( increments, function ( increment ) {

            var moves = [];

            var file = position.file + increment.first.file;
            var rank = position.rank + increment.first.rank;

            if ( !inBoard( { file: file, rank: rank } ) ) {
                return moves;
            }


            if ( isEmpty( state.board, { file: file, rank: rank } ) ) {

                moves.push( {
                    from: {
                        file: position.file,
                        rank: position.rank
                    },
                    to: {
                        file: file,
                        rank: rank
                    },
                    capture: false,
                    promotion: false,
                    continue: false,
                    enpassant: false,
                    ep: false
                } );

                return _.concat( moves, _.flatMap( increment.nexts, function ( next ) {

                    var moves = [];

                    var _file = file;
                    var _rank = rank;

                    while ( true ) {

                        _file += next.file;
                        _rank += next.rank;

                        if ( !inBoard( { file: _file, rank: _rank } ) ) {
                            return moves;
                        }

                        if ( isEmpty( state.board, { file: _file, rank: _rank } ) ) {

                            moves.push( {
                                from: {
                                    file: position.file,
                                    rank: position.rank
                                },
                                to: {
                                    file: _file,
                                    rank: _rank
                                },
                                capture: false,
                                promotion: false,
                                continue: false,
                                enpassant: false,
                                ep: false
                            } );

                            continue;

                        }

                        if ( isEnemy( state.board, position, { file: _file, rank: _rank } ) ) {
                            moves.push( {
                                from: {
                                    file: position.file,
                                    rank: position.rank
                                },
                                to: {
                                    file: _file,
                                    rank: _rank
                                },
                                capture: {
                                    file: _file,
                                    rank: _rank
                                },
                                promotion: false,
                                continue: false,
                                enpassant: false,
                                ep: false
                            } );
                        }

                        return moves;

                    }

                } ) );

            }

            if ( isEnemy( state.board, position, { file: file, rank: rank } ) ) {

                moves.push( {
                    from: {
                        file: position.file,
                        rank: position.rank
                    },
                    to: {
                        file: file,
                        rank: rank
                    },
                    capture: {
                        file: file,
                        rank: rank
                    },
                    promotion: false,
                    continue: false,
                    enpassant: false,
                    ep: false
                } );

            }

            return moves;

        } );

    }

    function P ( state, position ) {

        var moves = [];

        var file = position.file;
        var rank = position.rank;

        var f = forward( state, position );

        // アンパッサン

        if ( _.findIndex( state.enpassants, function ( enpassant ) { return _.isEqual( enpassant, { file: file + 1, rank: rank } ); } ) != - 1 && inBoardEnemy( state.board, position, { file: file + 1, rank: rank } ) ) {

            moves.push( {
                from: {
                    file: file,
                    rank: rank
                },
                to: {
                    file: file + 1,
                    rank: rank + f
                },
                capture: {
                    file: file + 1,
                    rank: rank
                },
                promotion: false,
                continue: false,
                enpassant: false,
                ep: true
            });

        }

        if ( _.findIndex( state.enpassants, function ( enpassant ) { return _.isEqual( enpassant, { file: file - 1, rank: rank } ) } ) != - 1 && inBoardEnemy( state.board, position, { file: file - 1, rank: rank } ) ) {

            moves.push( {
                from: {
                    file: file,
                    rank: rank
                },
                to: {
                    file: file - 1,
                    rank: rank + f
                },
                capture: {
                    file: file - 1,
                    rank: rank
                },
                promotion: false,
                continue: false,
                enpassant: false,
                ep: true
            });

        }

        // 前2マス

        if ( inBoardEmpty( state.board, { file: file, rank: rank + f } ) ) {

            moves.push( {
                from: {
                    file: file,
                    rank: rank
                },
                to: {
                    file: file,
                    rank: rank + f
                },
                capture: false,
                promotion: false,
                continue: false,
                enpassant: false,
                ep: false
            } );

            if ( inBoardEmpty( state.board, { file: file, rank: rank + f + f } ) ) {

                moves.push( {
                    from: {
                        file: file,
                        rank: rank
                    },
                    to: {
                        file: file,
                        rank: rank + f + f
                    },
                    capture: false,
                    promotion: false,
                    continue: false,
                    enpassant: {
                        file: file,
                        rank: rank + f + f
                    },
                    ep: false
                } );

            }

        }

        // 斜め前

        if ( inBoardEnemy( state.board, position, { file: file + 1, rank: rank + f } ) ) {

            moves.push( {
                from: {
                    file: file,
                    rank: rank
                },
                to: {
                    file: file + 1,
                    rank: rank + f
                },
                capture: {
                    file: file + 1,
                    rank: rank + f
                },
                promotion: false,
                continue: false,
                enpassant: false,
                ep: false
            } );

        }

        if ( inBoardEnemy( state.board, position, { file: file - 1, rank: rank + f } ) ) {

            moves.push( {
                from: {
                    file: file,
                    rank: rank
                },
                to: {
                    file: file - 1,
                    rank: rank + f
                },
                capture: {
                    file: file - 1,
                    rank: rank + f
                },
                promotion: false,
                continue: false,
                enpassant: false,
                ep: false
            } );

        }

        return moves;

    }

    function Cp_plus ( state, position ) {

        var moves = [];

        var file = position.file;
        var rank = position.rank;

        var f = forward( state, position );

        // 斜め前

        if ( inBoardEmpty( state.board, { file: file + 1, rank: rank + f } ) ) {

            moves.push( {
                from: {
                    file: file,
                    rank: rank
                },
                to: {
                    file: file + 1,
                    rank: rank + f
                },
                capture: false,
                promotion: false,
                continue: false,
                enpassant: false,
                ep: false
            } );

        }

        if ( inBoardEmpty( state.board, { file: file - 1, rank: rank + f } ) ) {

            moves.push( {
                from: {
                    file: file,
                    rank: rank
                },
                to: {
                    file: file - 1,
                    rank: rank + f
                },
                capture: false,
                promotion: false,
                continue: false,
                enpassant: false,
                ep: false
            } );

        }

        return moves;

    }

    function Cp ( state, position ) {
        return or( state, position, ['P', 'Cp_plus'] );
    }

    function Pr_plus ( state, position ) {
        var moves = [];

        var file = position.file;
        var rank = position.rank;

        var f = forward( state, position );

        var targets = [
            { file: + 1, rank:   0 },
            { file: - 1, rank:   0 },
            { file: + 1, rank: - f },
            { file:   0, rank: - f },
            { file: - 1, rank: - f }
        ];

        return N_like( state, position, targets );

    }

    function Pr ( state, position ) {
        return or( state, position, ['Pr_plus', 'Cp'] );
    }

    function Ln2 ( state, position ) {
        var seconds = [
            { file: + 1, rank: + 1 },
            { file: + 1, rank:   0 },
            { file: + 1, rank: - 1 },
            { file:   0, rank: + 1 },
            { file:   0, rank: - 1 },
            { file: - 1, rank: + 1 },
            { file: - 1, rank:   0 },
            { file: - 1, rank: - 1 },
            { file:   0, rank:   0 }
        ];
        var moves = _.flatMap( seconds, function ( second ) {

            var file = position.file + second.file;
            var rank = position.rank + second.rank;

            if ( !inBoard( { file: file, rank: rank } ) ) {
                return [];
            }

            if ( isEmpty( state.board, { file: file, rank: rank } ) ) {

                return [
                    {
                        from: {
                            file: position.file,
                            rank: position.rank
                        },
                        to: {
                            file: file,
                            rank: rank
                        },
                        capture: false,
                        promotion: false,
                        continue: false,
                        enpassant: false,
                        ep: false
                    }
                ];

            }

            if ( isEnemy( state.board, position, { file: file, rank: rank } ) ) {

                return [
                    {
                        from: {
                            file: position.file,
                            rank: position.rank
                        },
                        to: {
                            file: file,
                            rank: rank
                        },
                        capture: {
                            file: file,
                            rank: rank
                        },
                        promotion: false,
                        continue: false,
                        enpassant: false,
                        ep: false
                    }
                ];

            }

            return [];

        } );

        return moves;
    }

    function Ln ( state, position ) {

        var firsts = [
            { file: + 1, rank: + 1 },
            { file: + 1, rank:   0 },
            { file: + 1, rank: - 1 },
            { file:   0, rank: + 1 },
            { file:   0, rank: - 1 },
            { file: - 1, rank: + 1 },
            { file: - 1, rank:   0 },
            { file: - 1, rank: - 1 }
        ];

        var moves = _.flatMap( firsts, function ( first ) {

            var file = position.file + first.file;
            var rank = position.rank + first.rank;

            if ( !inBoard( { file: file, rank: rank } ) ) {
                return [];
            }

            if ( isEmpty( state.board, { file: file, rank: rank } ) ) {

                return [
                    {
                        from: {
                            file: position.file,
                            rank: position.rank
                        },
                        to: {
                            file: file,
                            rank: rank
                        },
                        capture: false,
                        promotion: false,
                        continue: 'Ln2',
                        enpassant: false,
                        ep: false
                    }
                ];

                return [];

            }

            if ( isEnemy( state.board, position, { file: file, rank: rank } ) ) {

                return [
                    {
                        from: {
                            file: position.file,
                            rank: position.rank
                        },
                        to: {
                            file: file,
                            rank: rank
                        },
                        capture: {
                            file: file,
                            rank: rank
                        },
                        promotion: false,
                        continue: 'Ln2',
                        enpassant: false,
                        ep: false
                    }
                ];

                return [];

            }

            return [];

        } );

        var targets = [
            { file: + 2, rank: + 2 },
            { file: + 2, rank: + 1 },
            { file: + 2, rank:   0 },
            { file: + 2, rank: - 1 },
            { file: + 2, rank: - 2 },
            { file: + 1, rank: + 2 },
            { file: + 1, rank: - 2 },
            { file:   0, rank: + 2 },
            { file:   0, rank: - 2 },
            { file: - 1, rank: + 2 },
            { file: - 1, rank: - 2 },
            { file: - 2, rank: + 2 },
            { file: - 2, rank: + 1 },
            { file: - 2, rank:   0 },
            { file: - 2, rank: - 1 },
            { file: - 2, rank: - 2 }
        ];

        return _.concat( moves, N_like( state, position, targets ) );

    }

    function K ( state, position ) {

        var targets = [
            { file: + 1, rank: + 1 },
            { file: + 1, rank:   0 },
            { file: + 1, rank: - 1 },
            { file:   0, rank: + 1 },
            { file:   0, rank: - 1 },
            { file: - 1, rank: + 1 },
            { file: - 1, rank:   0 },
            { file: - 1, rank: - 1 }
        ];

        return N_like( state, position, targets );

    }

    function El ( state, position ) {

        var targets = [
            { file: + 2, rank: + 2 },
            { file: + 2, rank: - 2 },
            { file: + 1, rank: + 1 },
            { file: + 1, rank: - 1 },
            { file: - 1, rank: + 1 },
            { file: - 1, rank: - 1 },
            { file: - 2, rank: + 2 },
            { file: - 2, rank: - 2 }
        ];

        return N_like( state, position, targets );

    }

    function Mc ( state, position ) {

        var targets = [
            { file: + 2, rank:   0 },
            { file: + 1, rank:   0 },
            { file:   0, rank: + 2 },
            { file:   0, rank: + 1 },
            { file:   0, rank: - 1 },
            { file:   0, rank: - 2 },
            { file: - 1, rank:   0 },
            { file: - 2, rank:   0 }
        ];

        return N_like( state, position, targets );

    }

    function An ( state, position ) {

        var targets = [
            { file: + 3, rank: + 3 },
            { file: + 3, rank:   0 },
            { file: + 3, rank: - 3 },
            { file: + 2, rank: + 2 },
            { file: + 2, rank:   0 },
            { file: + 2, rank: - 2 },
            { file:   0, rank: + 3 },
            { file:   0, rank: + 2 },
            { file:   0, rank: - 2 },
            { file:   0, rank: - 3 },
            { file: - 2, rank: + 2 },
            { file: - 2, rank:   0 },
            { file: - 2, rank: - 2 },
            { file: - 3, rank: + 3 },
            { file: - 3, rank:   0 },
            { file: - 3, rank: - 3 },
        ];

        return N_like( state, position, targets );

    }

    function N ( state, position ) {

        var targets = [
            { file: + 2, rank: + 1 },
            { file: + 2, rank: - 1 },
            { file: + 1, rank: + 2 },
            { file: + 1, rank: - 2 },
            { file: - 1, rank: + 2 },
            { file: - 1, rank: - 2 },
            { file: - 2, rank: + 1 },
            { file: - 2, rank: - 1 }
        ];

        return N_like( state, position, targets );

    }

    function Cm ( state, position ) {

        var targets = [
            { file: + 3, rank: + 1 },
            { file: + 3, rank: - 1 },
            { file: + 1, rank: + 3 },
            { file: + 1, rank: - 3 },
            { file: - 1, rank: + 3 },
            { file: - 1, rank: - 3 },
            { file: - 3, rank: + 1 },
            { file: - 3, rank: - 1 }
        ];

        return N_like( state, position, targets );

    }

    function Bl ( state, position ) {

        var targets = [
            { file: + 3, rank: + 2 },
            { file: + 3, rank: - 2 },
            { file: + 2, rank: + 3 },
            { file: + 2, rank: - 3 },
            { file: - 2, rank: + 3 },
            { file: - 2, rank: - 3 },
            { file: - 3, rank: + 2 },
            { file: - 3, rank: - 2 }
        ];

        return N_like( state, position, targets );

    }

    function Bf ( state, position ) {
        var n = N( state, position );
        var cm = Cm( state, position );
        var bl = Bl( state, position );
        return _.concat( n, cm, bl );
    }

    function B ( state, position ) {

        var increments = [
            { file: + 1, rank: + 1 },
            { file: + 1, rank: - 1 },
            { file: - 1, rank: + 1 },
            { file: - 1, rank: - 1 },
        ];

        return B_like( state, position, increments );

    }

    function R ( state, position ) {

        var increments = [
            { file: + 1, rank:   0 },
            { file:   0, rank: + 1 },
            { file:   0, rank: - 1 },
            { file: - 1, rank:   0 },
        ];

        return B_like( state, position, increments );

    }

    function Q ( state, position ) {
        var b = B( state, position );
        var r = R( state, position );
        return _.concat( b, r );
    }

    function Cd ( state, position ) {
        return or( state, position, ['B', 'N'] );
    }

    function Ms ( state, position ) {
        return or( state, position, ['R', 'N'] );
    }

    function Un ( state, position ) {
        return or( state, position, ['Q', 'N'] );
    }

    function Bw ( state, position ) {

        var increments = [
            { file: + 1, rank: + 1 },
            { file: + 1, rank: - 1 },
            { file: - 1, rank: + 1 },
            { file: - 1, rank: - 1 },
        ];

        return Bw_like( state, position, increments );

    }

    function Cn ( state, position ) {

        var increments = [
            { file: + 1, rank:   0 },
            { file:   0, rank: + 1 },
            { file:   0, rank: - 1 },
            { file: - 1, rank:   0 },
        ];

        return Bw_like( state, position, increments );

    }

    function St ( state, position ) {
        return or( state, position, ['Bw', 'Cn'] );
    }

    function Sh ( state, position ) {

        var increments = [
            {
                first: { file: + 1, rank: + 1 },
                nexts: [
                    { file: 0, rank: + 1 }
                ]
            },
            {
                first: { file: + 1, rank: - 1 },
                nexts: [
                    { file: 0, rank: - 1 }
                ]
            },
            {
                first: { file: - 1, rank: + 1 },
                nexts: [
                    { file: 0, rank: + 1 }
                ]
            },
            {
                first: { file: - 1, rank: - 1 },
                nexts: [
                    { file: 0, rank: - 1 }
                ]
            }
        ];

        return Sh_like( state, position, increments );

    }

    function Gr ( state, position ) {

        var increments = [
            {
                first: { file: + 1, rank: + 1 },
                nexts: [
                    { file:   0, rank: + 1 },
                    { file: + 1, rank:   0 }
                ]
            },
            {
                first: { file: + 1, rank: - 1 },
                nexts: [
                    { file:   0, rank: - 1 },
                    { file: + 1, rank:   0 }                ]
            },
            {
                first: { file: - 1, rank: + 1 },
                nexts: [
                    { file:   0, rank: + 1 },
                    { file: - 1, rank:   0 }                ]
            },
            {
                first: { file: - 1, rank: - 1 },
                nexts: [
                    { file:   0, rank: - 1 },
                    { file: - 1, rank:   0 }                ]
            }
        ];

        return Sh_like( state, position, increments );

    }

    function Rh ( state, position ) {

        var increments = [
            {
                first: { file: + 2, rank: + 1 },
                nexts: [
                    { file: + 1, rank: + 1 }
                ]
            },
            {
                first: { file: + 2, rank: - 1 },
                nexts: [
                    { file: + 1, rank: - 1 }
                ]
            },
            {
                first: { file: + 1, rank: + 2 },
                nexts: [
                    { file: + 1, rank: + 1 }
                ]
            },
            {
                first: { file: + 1, rank: - 2 },
                nexts: [
                    { file: + 1, rank: - 1 }
                ]
            },
            {
                first: { file: - 1, rank: + 2 },
                nexts: [
                    { file: - 1, rank: + 1 }
                ]
            },
            {
                first: { file: - 1, rank: - 2 },
                nexts: [
                    { file: - 1, rank: - 1 }
                ]
            },
            {
                first: { file: - 2, rank: + 1 },
                nexts: [
                    { file: - 1, rank: + 1 }
                ]
            },
            {
                first: { file: - 2, rank: - 1 },
                nexts: [
                    { file: - 1, rank: - 1 }
                ]
            },
        ];

        return Sh_like( state, position, increments );

    }

    var Move = {
        // P, Cp, Pr, K
        'P':    P,        'vP':     P,
        'Cp':   Cp,        'vCp':   Cp,
        'Pr':   Pr,        'vPr':   Pr,
        'K':    K,        'vK':     K,
        // El, Mc, An, Ln
        'El':   El,        'vEl':   El,
        'Mc':   Mc,        'vMc':   Mc,
        'An':   An,        'vAn':   An,
        'Ln':   Ln,        'vLn':   Ln,
        'Ln2':  Ln2,       'vLn2':  Ln2,
        // N, Cm, Bl, Bf
        'N':    N,        'vN':     N,
        'Cm':   Cm,        'vCm':   Cm,
        'Bl':   Bl,        'vBl':   Bl,
        'Bf':   Bf,        'vBf':   Bf,
        // B, R, Q
        'B':    B,        'vB':     B,
        'R':    R,        'vR':     R,
        'Q':    Q,        'vQ':     Q,
        // Cd, Ms, Un
        'Cd':   Cd,        'vCd':   Cd,
        'Ms':   Ms,        'vMs':   Ms,
        'Un':   Un,        'vUn':   Un,
        // Bw, Cn, St
        'Bw':   Bw,        'vBw':   Bw,
        'Cn':   Cn,        'vCn':   Cn,
        'St':   St,        'vSt':   St,
        // Sh, Gr, Rh
        'Sh':   Sh,        'vSh':   Sh,
        'Gr':   Gr,        'vGr':   Gr,
        'Rh':   Rh,        'vRh':   Rh
    }

    Move.Cp_plus = Cp_plus;
    Move.Pr_plus = Pr_plus;

    window.TeraChess = TeraChess;

})();
