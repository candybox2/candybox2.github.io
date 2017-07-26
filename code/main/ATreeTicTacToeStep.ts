enum ATreeTicTacToeStep{
    PLAYING,
    NOBODY_WINS,
    YOU_LOSE
}

// N.B. : the case when the player wins isn't in this enumeration because this case is a new aTreeStep and is therefore handled by the global saving system