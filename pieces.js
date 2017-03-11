var WIDTH = 16;
var HEIGHT = 16;

var WHITE = {
  P :  0, CP:  1, K :  2, PR:  3, EL:  4, MC:  5,
  N :  6, CM:  7, BL:  8, LN:  9, BF: 10, AN: 11,
  B : 12, R : 13, Q : 14, BW: 15, CN: 16, ST: 17,
  SH: 18, GR: 19, RH: 20, CD: 21, MS: 22, UN: 23, KG: -1, MK: -2
};
var INVERTWHITE = _.invert(WHITE);


var BLACK = {
  P : 24, CP: 25, K : 26, PR: 27, EL: 28, MC: 29,
  N : 30, CM: 31, BL: 32, LN: 33, BF: 34, AN: 35,
  B : 36, R : 37, Q : 38, BW: 39, CN: 40, ST: 41,
  SH: 42, GR: 43, RH: 44, CD: 45, MS: 46, UN: 47, KG: 48, MK: 49
};
var INVERTBLACK = _.invert(BLACK);

var DEFAULT = [
  [35, 25, 28, 24, null, null, null, null, null, null, null, null,  0,  4,  1, 11],
  [31, 25, 29, 24, null, null, null, null, null, null, null, null,  0,  5,  1,  7],
  [39, 25, 37, 24, null, null, null, null, null, null, null, null,  0, 13,  1, 15],
  [32, 25, 30, 24, null, null, null, null, null, null, null, null,  0,  6,  1,  8],
  [40, 25, 36, 24, null, null, null, null, null, null, null, null,  0, 12,  1, 16],
  [45, 25, 42, 24, null, null, null, null, null, null, null, null,  0, 18,  1, 21],
  [46, 25, 27, 24, null, null, null, null, null, null, null, null,  0,  3,  1, 22],
  [47, 43, 26, 24, null, null, null, null, null, null, null, null,  0,  2, 19, 23],
  [41, 33, 38, 24, null, null, null, null, null, null, null, null,  0, 14,  9, 17],
  [44, 25, 27, 24, null, null, null, null, null, null, null, null,  0,  3,  1, 20],
  [34, 25, 42, 24, null, null, null, null, null, null, null, null,  0, 18,  1, 10],
  [40, 25, 36, 24, null, null, null, null, null, null, null, null,  0, 12,  1, 16],
  [32, 25, 30, 24, null, null, null, null, null, null, null, null,  0,  6,  1,  8],
  [39, 25, 37, 24, null, null, null, null, null, null, null, null,  0, 13,  1, 15],
  [31, 25, 29, 24, null, null, null, null, null, null, null, null,  0,  5,  1,  7],
  [35, 25, 28, 24, null, null, null, null, null, null, null, null,  0,  4,  1, 11],
];
// var DEFAULT = [
//   [35, 25, 28, 24, null, null, null, null, null, null, null, null,  0,  4,  1, 11],
//   [31, 25, 29, 24, null, null, null, null, null, null, null, null,  0,  5,  1,  7],
//   [39, 25, 37, 24, null, null, null, null, null,   49, null, null,  0, 13,  1, 15],
//   [32, 25, 30, 24, null, null, null, null, null, null, null, null,  0,  6,  1,  8],
//   [40, 25, 36, 24, null, null,   48, null, null, null, null, null,  0, 12,  1, 16],
//   [45, 25, 42, 24, null, null, null, null, null, null, null, null,  0, 18,  1, 21],
//   [46, 25, 27, 24, null, null, null, null, null, null, null, null,  0,  3,  1, 22],
//   [47, 43, 26, 24, null, null, null, null, null, null, null, null,  0,  2, 19, 23],
//   [41, 33, 38, 24, null, null, null, null, null, null, null, null,  0, 14,  9, 17],
//   [44, 25, 27, 24, null, null, null, null, null, null, null, null,  0,  3,  1, 20],
//   [34, 25, 42, 24, null, null, null, null, null, null, null, null,  0, 18,  1, 10],
//   [40, 25, 36, 24, null, null, null, null, null,   -1, null, null,  0, 12,  1, 16],
//   [32, 25, 30, 24, null, null, null, null, null, null, null, null,  0,  6,  1,  8],
//   [39, 25, 37, 24, null, null,   -2, null, null, null, null, null,  0, 13,  1, 15],
//   [31, 25, 29, 24, null, null, null, null, null, null, null, null,  0,  5,  1,  7],
//   [35, 25, 28, 24, null, null, null, null, null, null, null, null,  0,  4,  1, 11],
// ];

// ここから下まで MOVE
var MOVE = {};

MOVE.P = {
  type: 'pawn'
};

MOVE.CP = {
  type: 'corporal'
};

MOVE.K = {
  type: 'jump',
  value: [
    {col: +1, row: +1},
    {col: +1, row: -1},
    {col: -1, row: +1},
    {col: -1, row: -1},
    {col: +1, row:  0},
    {col:  0, row: +1},
    {col: -1, row:  0},
    {col:  0, row: -1}
  ]
};

MOVE.PR = MOVE.K;

MOVE.EL = {
  type: 'jump',
  value: [
    {col: +1, row: +1},
    {col: +1, row: -1},
    {col: -1, row: +1},
    {col: -1, row: -1},
    {col: +2, row: +2},
    {col: +2, row: -2},
    {col: -2, row: +2},
    {col: -2, row: -2}
  ]
};

MOVE.MC = {
  type: 'jump',
  value: [
    {col: +1, row:  0},
    {col:  0, row: +1},
    {col: -1, row:  0},
    {col:  0, row: -1},
    {col: +2, row:  0},
    {col:  0, row: +2},
    {col: -2, row:  0},
    {col:  0, row: -2}
  ]
};

MOVE.N = {
  type: 'jump',
  value: [
    {col: +1, row: +2},
    {col: +1, row: -2},
    {col: -1, row: +2},
    {col: -1, row: -2},
    {col: +2, row: +1},
    {col: +2, row: -1},
    {col: -2, row: +1},
    {col: -2, row: -1}
  ]
};

MOVE.CM = {
  type: 'jump',
  value: [
    {col: +1, row: +3},
    {col: +1, row: -3},
    {col: -1, row: +3},
    {col: -1, row: -3},
    {col: +3, row: +1},
    {col: +3, row: -1},
    {col: -3, row: +1},
    {col: -3, row: -1}
  ]
};

MOVE.BL = {
  type: 'jump',
  value: [
    {col: +2, row: +3},
    {col: +2, row: -3},
    {col: -2, row: +3},
    {col: -2, row: -3},
    {col: +3, row: +2},
    {col: +3, row: -2},
    {col: -3, row: +2},
    {col: -3, row: -2}
  ]
};

MOVE.LN = {
  type: 'parallel',
  value: [
    MOVE.N,
    MOVE.EL,
    MOVE.MC
  ]
};

MOVE.BF = {
  type: 'parallel',
  value: [
    MOVE.N,
    MOVE.CM,
    MOVE.BL
  ]
};

MOVE.AN = {
  type: 'jump',
  value: [
    {col: +2, row: +2},
    {col: +2, row: -2},
    {col: -2, row: +2},
    {col: -2, row: -2},
    {col: +3, row: +3},
    {col: +3, row: -3},
    {col: -3, row: +3},
    {col: -3, row: -3},
    {col: +2, row:  0},
    {col:  0, row: +2},
    {col: -2, row:  0},
    {col:  0, row: -2},
    {col: +3, row:  0},
    {col:  0, row: +3},
    {col: -3, row:  0},
    {col:  0, row: -3}
  ]
}

MOVE.B = {
  type: 'run',
  value: [
    {col: +1, row: +1},
    {col: +1, row: -1},
    {col: -1, row: +1},
    {col: -1, row: -1}
  ]
};

MOVE.R = {
  type: 'run',
  value: [
    {col: +1, row:  0},
    {col:  0, row: +1},
    {col: -1, row:  0},
    {col:  0, row: -1}
  ]
};

MOVE.Q = {
  type: 'parallel',
  value: [
    MOVE.B,
    MOVE.R
  ]
};

MOVE.BW= {
  type: 'bow',
  value: [
    {col: +1, row: +1},
    {col: +1, row: -1},
    {col: -1, row: +1},
    {col: -1, row: -1}
  ]
};

MOVE.CN = {
  type: 'bow',
  value: [
    {col: +1, row:  0},
    {col:  0, row: +1},
    {col: -1, row:  0},
    {col:  0, row: -1}
  ]
};

MOVE.ST = {
  type: 'parallel',
  value: [
    MOVE.BW,
    MOVE.CN
  ]
};

MOVE.SH = {
  type: 'parallel',
  value: [
    {
      type: 'series',
      value: [
        {
          type: 'jump',
          value: [
            {col: +1, row: +1}
          ]
        },
        {
          type: 'run',
          value: [
            {col: 0, row: +1}
          ]
        }
      ]
    },
    {
      type: 'series',
      value: [
        {
          type: 'jump',
          value: [
            {col: +1, row: -1}
          ]
        },
        {
          type: 'run',
          value: [
            {col: 0, row: -1}
          ]
        }
      ]
    },
    {
      type: 'series',
      value: [
        {
          type: 'jump',
          value: [
            {col: -1, row: +1}
          ]
        },
        {
          type: 'run',
          value: [
            {col: 0, row: +1}
          ]
        }
      ]
    },
    {
      type: 'series',
      value: [
        {
          type: 'jump',
          value: [
            {col: -1, row: -1}
          ]
        },
        {
          type: 'run',
          value: [
            {col: 0, row: -1}
          ]
        }
      ]
    },
  ]
};

MOVE.GR = {
  type: 'parallel',
  value: [
    {
      type: 'series',
      value: [
        {
          type: 'jump',
          value: [
            {col: +1, row: +1}
          ]
        },
        {
          type: 'run',
          value: [
            {col: +1, row:  0},
            {col:  0, row: +1}
          ]
        }
      ]
    },
    {
      type: 'series',
      value: [
        {
          type: 'jump',
          value: [
            {col: +1, row: -1}
          ]
        },
        {
          type: 'run',
          value: [
            {col: +1, row:  0},
            {col:  0, row: -1}
          ]
        }
      ]
    },
    {
      type: 'series',
      value: [
        {
          type: 'jump',
          value: [
            {col: -1, row: +1}
          ]
        },
        {
          type: 'run',
          value: [
            {col: -1, row:  0},
            {col:  0, row: +1}
          ]
        }
      ]
    },
    {
      type: 'series',
      value: [
        {
          type: 'jump',
          value: [
            {col: -1, row: -1}
          ]
        },
        {
          type: 'run',
          value: [
            {col: -1, row:  0},
            {col:  0, row: -1}
          ]
        }
      ]
    },
  ]
};

MOVE.RH = {
  type: 'parallel',
  value: [
    {
      type: 'series',
      value: [
        {
          type: 'jump',
          value: [
            {col: +1, row: +2}
          ]
        },
        {
          type: 'run',
          value: [
            {col: +1, row: +1}
          ]
        }
      ]
    },
    {
      type: 'series',
      value: [
        {
          type: 'jump',
          value: [
            {col: +1, row: -2}
          ]
        },
        {
          type: 'run',
          value: [
            {col: +1, row: -1}
          ]
        }
      ]
    },
    {
      type: 'series',
      value: [
        {
          type: 'jump',
          value: [
            {col: -1, row: +2}
          ]
        },
        {
          type: 'run',
          value: [
            {col: -1, row: +1}
          ]
        }
      ]
    },
    {
      type: 'series',
      value: [
        {
          type: 'jump',
          value: [
            {col: -1, row: -2}
          ]
        },
        {
          type: 'run',
          value: [
            {col: -1, row: -1}
          ]
        }
      ]
    },
    {
      type: 'series',
      value: [
        {
          type: 'jump',
          value: [
            {col: +2, row: +1}
          ]
        },
        {
          type: 'run',
          value: [
            {col: +1, row: +1}
          ]
        }
      ]
    },
    {
      type: 'series',
      value: [
        {
          type: 'jump',
          value: [
            {col: +2, row: -1}
          ]
        },
        {
          type: 'run',
          value: [
            {col: +1, row: -1}
          ]
        }
      ]
    },
    {
      type: 'series',
      value: [
        {
          type: 'jump',
          value: [
            {col: -2, row: +1}
          ]
        },
        {
          type: 'run',
          value: [
            {col: -1, row: +1}
          ]
        }
      ]
    },
    {
      type: 'series',
      value: [
        {
          type: 'jump',
          value: [
            {col: -2, row: -1}
          ]
        },
        {
          type: 'run',
          value: [
            {col: -1, row: -1}
          ]
        }
      ]
    },
  ]
};

MOVE.CD = {
  type: 'parallel',
  value: [
    MOVE.N,
    MOVE.B
  ]
};

MOVE.MS = {
  type: 'parallel',
  value: [
    MOVE.N,
    MOVE.R
  ]
};

MOVE.UN = {
  type: 'parallel',
  value: [
    MOVE.N,
    MOVE.Q
  ]
};

MOVE.KG = {
  type: 'parallel',
  value: [
    {
      type: 'series',
      value: [
        {
          type: 'run',
          value: [
            {col: +1, row: 0}
          ]
        },
        {
          type: 'run',
          value: [
            {col: 0, row: +1},
            {col: 0, row: -1}
          ]
        }
      ]
    },
    {
      type: 'series',
      value: [
        {
          type: 'run',
          value: [
            {col: -1, row: 0}
          ]
        },
        {
          type: 'run',
          value: [
            {col: 0, row: +1},
            {col: 0, row: -1}
          ]
        }
      ]
    },
    {
      type: 'series',
      value: [
        {
          type: 'run',
          value: [
            {col: 0, row: +1}
          ]
        },
        {
          type: 'run',
          value: [
            {col: +1, row: 0},
            {col: -1, row: 0}
          ]
        }
      ]
    },
    {
      type: 'series',
      value: [
        {
          type: 'run',
          value: [
            {col: 0, row: -1}
          ]
        },
        {
          type: 'run',
          value: [
            {col: +1, row: 0},
            {col: -1, row: 0}
          ]
        }
      ]
    },
  ]
},

MOVE.MK = {
  type: 'parallel',
  value: [
    {
      type: 'series',
      value: [
        {
          type: 'run',
          value: [
            {col: +1, row: +1}
          ]
        },
        {
          type: 'run',
          value: [
            {col: -1, row: +1},
            {col: +1, row: -1}
          ]
        }
      ]
    },
    {
      type: 'series',
      value: [
        {
          type: 'run',
          value: [
            {col: +1, row: -1}
          ]
        },
        {
          type: 'run',
          value: [
            {col: -1, row: -1},
            {col: +1, row: +1}
          ]
        }
      ]
    },
    {
      type: 'series',
      value: [
        {
          type: 'run',
          value: [
            {col: -1, row: +1}
          ]
        },
        {
          type: 'run',
          value: [
            {col: +1, row: +1},
            {col: -1, row: -1}
          ]
        }
      ]
    },
    {
      type: 'series',
      value: [
        {
          type: 'run',
          value: [
            {col: -1, row: -1}
          ]
        },
        {
          type: 'run',
          value: [
            {col: +1, row: -1},
            {col: -1, row: +1}
          ]
        }
      ]
    },
  ]
}
