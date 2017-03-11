$(function(){
  var DEBUG_MODE = true;

  // 初期化
  var board = _.cloneDeep(DEFAULT);
  var select = null;
  var ables = [];
  var rendered = render(board);
  addPiece();

  // main 開始
  $('.terachess').on('click', function(event){
    $('.terachess').off('click', arguments.callee);
    var index = $('.terachess_cell').index(event.target);
    var col = Math.floor(index / 16);
    var row = index % 16;
    if(select === null){ // 未選択
      if(isExist(col, row)){ // 駒が存在
        select = {col: col, row: row};
        addSelect();
        makeAbles();
        addAble();
      }
    } else if(select !== null){ // 選択
      if(col === select.col && row === select.row){ // 自身
        removeSelect();
        select = null;
        removeAble();
        ables = [];
      } else if(isAble(col, row)){ // 可能手
        removePiece();
        move({
          from: {
            col: select.col,
            row: select.row
          },
          to: {
            col: col,
            row: row
          }
        });
        addPiece();
        removeSelect();
        select = null;
        removeAble();
        ables = [];
      }
    }
    $('.terachess').on('click', arguments.callee);
  });
  // main 終了

  function render(board){
    var ret = [];
    var terachess = $('<div>')
      .addClass('terachess')
      .appendTo('body');
    for(var col = 0; col < HEIGHT; col++){
      ret[col] = [];
      for(var row = 0; row < WIDTH; row++){
        ret[col][row] = $('<div>')
          .addClass('terachess_cell')
          .addClass((col % 2 == 0) ^ (row % 2 == 0) ? 'black' : 'white')
          .appendTo(terachess);
      }
    }
    return ret;
  }

  function addSelect(){
    rendered[select.col][select.row].addClass('select');
  }
  function removeSelect(){
    rendered[select.col][select.row].removeClass('select');
  }
  function addAble(){
    _.forEach(ables, function(able){
      rendered[able.col][able.row].addClass('able');
    });
  }
  function removeAble(){
    _.forEach(ables, function(able){
      rendered[able.col][able.row].removeClass('able');
    });
  }
  function addPiece(){
    for(var col = 0; col < HEIGHT; col++){
      for(var row = 0; row < WIDTH; row++){
        if(isWhite(col, row)){
          rendered[col][row].addClass(INVERTWHITE[board[col][row]]);
        } else if(isBlack(col, row)){
          rendered[col][row].addClass('v' + INVERTBLACK[board[col][row]]);
        }
      }
    }
  }
  function removePiece(){
    for(var col = 0; col < HEIGHT; col++){
      for(var row = 0; row < WIDTH; row++){
        if(isWhite(col, row)){
          rendered[col][row].removeClass(INVERTWHITE[board[col][row]]);
        } else if(isBlack(col, row)){
          rendered[col][row].removeClass('v' + INVERTBLACK[board[col][row]]);
        }
      }
    }
  }

  function move(data){
    board[data.to.col][data.to.row] = board[data.from.col][data.from.row];
    board[data.from.col][data.from.row] = null;
  }
  function makeAbles(){
    var piece;
    var color;
    if(isWhite(select.col, select.row)){
      piece = INVERTWHITE[board[select.col][select.row]];
      color = 'white';
    } else if(isBlack(select.col, select.row)){
      piece = INVERTBLACK[board[select.col][select.row]];
      color = 'black';
    }
    var move = MOVE[piece];
    ables = compile(move, color, {col: select.col, row: select.row});
  }

  function isOnBoard(col, row){
    return col >= 0 && col < WIDTH && row >= 0 && row < HEIGHT;
  }
  function isWhite(col, row){
    return _.includes(WHITE, board[col][row]);
  }
  function isBlack(col, row){
    return _.includes(BLACK, board[col][row]);
  }
  function isExist(col, row){
    return isWhite(col, row) || isBlack(col, row);
  }
  function isEmpty(col, row){
    return !isWhite(col, row) && !isBlack(col, row);
  }
  function isAble(col, row){
    if(DEBUG_MODE) return true;
    return _.includes(ables, board[col][row]);
  }

  function compile(move, color, start){
    switch(move.type){
      case 'pawn':
        var ret = [];
        var col = start.col;
        var row = start.row;
        switch(color){
          case 'white':
            if(isOnBoard(col, row - 1) && isEmpty(col, row - 1)){
              ret.push({col: col, row: row - 1});
            }
            if(isEmpty(col, row - 1) && isOnBoard(col, row - 2) && isEmpty(col, row - 2)){
              ret.push({col: col, row: row - 2});
            }
            if(isOnBoard(col + 1, row - 1) && isEnemy(col + 1, row - 1)){
              ret.push({col: col + 1, row: row - 1});
            }
            if(isOnBoard(col - 1, row - 1) && isEnemy(col - 1, row - 1)){
              ret.push({col: col - 1, row: row - 1});
            }
          break;
          case 'black':
            if(isOnBoard(col, row + 1) && isEmpty(col, row + 1)){
              ret.push({col: col, row: row + 1});
            }
            if(isEmpty(col, row + 1) && isOnBoard(col, row + 2) && isEmpty(col, row + 2)){
              ret.push({col: col, row: row + 2});
            }
            if(isOnBoard(col + 1, row + 1) && isEnemy(col + 1, row + 1)){
              ret.push({col: col + 1, row: row + 1});
            }
            if(isOnBoard(col - 1, row + 1) && isEnemy(col - 1, row + 1)){
              ret.push({col: col - 1, row: row + 1});
            }
          break;
        }
        return ret;
      break;
      case 'corporal':
        var ret = [];
        var col = start.col;
        var row = start.row;
        switch(color){
          case 'white':
            if(isOnBoard(col, row - 1) && isEmpty(col, row - 1)){
              ret.push({col: col, row: row - 1});
            }
            if(isEmpty(col, row - 1) && isOnBoard(col, row - 2) && isEmpty(col, row - 2)){
              ret.push({col: col, row: row - 2});
            }
            if(isOnBoard(col + 1, row - 1) && (isEnemy(col + 1, row - 1) || isEmpty(col + 1, row - 1))){
              ret.push({col: col + 1, row: row - 1});
            }
            if(isOnBoard(col - 1, row - 1) && (isEnemy(col - 1, row - 1) || isEmpty(col - 1, row - 1))){
              ret.push({col: col - 1, row: row - 1});
            }
          break;
          case 'black':
            if(isOnBoard(col, row + 1) && isEmpty(col, row + 1)){
              ret.push({col: col, row: row + 1});
            }
            if(isEmpty(col, row + 1) && isOnBoard(col, row + 2) && isEmpty(col, row + 2)){
              ret.push({col: col, row: row + 2});
            }
            if(isOnBoard(col + 1, row + 1) && (isEnemy(col + 1, row + 1) || isEmpty(col + 1, row + 1))){
              ret.push({col: col + 1, row: row + 1});
            }
            if(isOnBoard(col - 1, row + 1) && (isEnemy(col - 1, row + 1) || isEmpty(col - 1, row + 1))){
              ret.push({col: col - 1, row: row + 1});
            }
          break;
        }
        return ret;
      break;
      case 'jump':
        return compile({
          type: 'parallel',
          value: [
            {
              type: 'jump_with_capture',
              value: move.value
            },
            {
              type: 'jump_without_capture',
              value: move.value
            }
          ]
        }, color, start);
      break;
      case 'jump_with_capture':
        switch(move.value.length){
          case 0:
            return [];
          break;
          default:
            var head = _.head(move.value);
            var target = {col: start.col + head.col, row: start.row + head.row};
            return _.concat(
              isOnBoard(target.col, target.row) && isEnemy(target.col, target.row) ? [target] : [],
              compile({
                type: 'jump_with_capture',
                value: _.tail(move.value)
              }, color, start)
            );
          break;
        }
      break;
      case 'jump_without_capture':
        switch(move.value.length){
          case 0:
            return [];
          break;
          default:
            var head = _.head(move.value);
            var target = {col: start.col + head.col, row: start.row + head.row};
            return _.concat(
              isOnBoard(target.col, target.row) && isEmpty(target.col, target.row) ? [target] : [],
              compile({
                type: 'jump_without_capture',
                value: _.tail(move.value)
              }, color, start)
            );
          break;
        }
      break;
      case 'run':
        switch(move.value.length){
          case 0:
            return [];
          break;
          default:
            var head = _.head(move.value);
            var target = {col: start.col + head.col, row: start.row + head.row};
            var run;
            if(isOnBoard(target.col, target.row) && isAlly(target.col, target.row)){
              run = [];
            } else if(isOnBoard(target.col, target.row) && isEnemy(target.col, target.row)){
              run = [target];
            } else if(isOnBoard(target.col, target.row) && isEmpty(target.col, target.row)){
              run = _.concat(
                [target],
                compile({
                  type: 'run',
                  value: [head]
                }, color, target)
              );
            } else{
              run = [];
            }
            return _.concat(
              run,
              compile({
                type: 'run',
                value: _.tail(move.value)
              }, color, start)
            );
          break;
        }
      break;
      case 'capture_first':
        switch(move.value.length){
          case 0:
            return [];
          break;
          default:
            var head = _.head(move.value);
            var target = {col: start.col + head.col, row: start.row + head.row};
            var capture_first;
            if(isOnBoard(target.col, target.row) && isAlly(target.col, target.row)){
              capture_first = [];
            } else if(isOnBoard(target.col, target.row) && isEnemy(target.col, target.row)){
              capture_first = [target];
            } else if(isOnBoard(target.col, target.row) && isEmpty(target.col, target.row)){
              capture_first = compile({
                type: 'capture_first',
                value: [head]
              }, color, target)
            } else{
              capture_first = [];
            }
            return _.concat(
              capture_first,
              compile({
                type: 'capture_first',
                value: _.tail(move.value)
              }, color, start)
            );
          break;
        }
      break;
      case 'bow':
        switch(move.value.length){
          case 0:
            return [];
          break;
          default:
            var head = _.head(move.value);
            var target = {col: start.col + head.col, row: start.row + head.row};
            var bow;
            if(isOnBoard(target.col, target.row) && (isAlly(target.col, target.row) || isEnemy(target.col, target.row))){
              bow = compile({
                type: 'capture_first',
                value: [head]
              }, color, target);
            } else if(isOnBoard(target.col, target.row) && isEmpty(target.col, target.row)){
              bow = _.concat(
                [target],
                compile({
                  type: 'bow',
                  value: [head]
                }, color, target)
              );
            } else{
              bow = [];
            }
            return _.concat(
              bow,
              compile({
                type: 'bow',
                value: _.tail(move.value)
              }, color, start)
            );
          break;
        }
      break;
      case 'parallel':
        switch(move.value.length){
          case 0:
            return [];
          break;
          default:
            return _.concat(
              compile(_.head(move.value), color, start),
              compile({
                type: 'parallel',
                value: _.tail(move.value)
              }, color, start)
            );
          break;
        }
      break;
      case 'series':
        switch(move.value.length){
          case 0:
            return [];
          break;
          default:
            var head = _.head(move.value);
            var firsts = compile(head, color, start);
            return _.concat(
              firsts,
              _.flatten(
                _.map(firsts, function(first){
                  return compile({
                    type: 'series',
                    value: _.tail(move.value)
                  }, color, first);
                })
              )
            );
          break;
        }
      break;
    }

    function isAlly(col, row){
      switch(color){
        case 'white':
          return isWhite(col, row);
        break;
        case 'black':
          return isBlack(col, row);
        break;
      }
    }
    function isEnemy(col, row){
      switch(color){
        case 'white':
          return isBlack(col, row);
        break;
        case 'black':
          return isWhite(col, row);
        break;
      }
    }
  }
});
