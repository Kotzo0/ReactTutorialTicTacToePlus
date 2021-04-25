function Square(props) {
  return (
  <button className ="square" style={{background : props.bgcolor}} onClick={props.onClick}>
      {props.value}
    </button>
  );
}


class Board extends React.Component {
  
  renderSquare(i, color) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        bgcolor={color}
      />
    );
  }

  render() {
    
    var i;
    
    let divs = [];
    const gs = this.props.gridSize;
    for (i = 0; i < gs*gs; i += gs) {
      let rows = [];
      for (var p = 0; p < 3; p++) {
        var bg = '#fff';
        if (this.props.winners) {
        if (p+i === this.props.winners[0] || p+i === this.props.winners[1] || p+i === this.props.winners[2]) {
            bg = '#008000';
        }}
        rows.push(<span key={p+i} > {this.renderSquare(i+p,bg)} </span>)
      }
      
      divs.push(<div key={i} className="board-row">
          {rows}
        </div>)
    }
    
    return (
      <div>
        {divs}
      </div>
      
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        cor : null,
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  
 handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X': 'O';
    const cor = i;
    this.setState({
      history : history.concat([{
          squares: squares,
          cor: cor,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    const moves = history.map((step, move) => {
      const cor = history[move].cor;
      let row;
      let col;
      switch(cor%3) {
        case 0: 
          col = 1;
          break;
        case 1:
          col = 2;
          break;
        default:
          col = 3;
      }
      if (cor < 3)
        row = 1;
      else if (cor < 6)
        row = 2;
      else
        row = 3;
      const desc = move ?
            'Go to move #' + move + ' (' + col + ',' + row + ')':
            'Go to game start';
      if (move === this.state.stepNumber)
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
        </li>
      );
      else
        return (
          <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
        );
    });
    
    let status;
    if (winner) {
      status = 'Winner: ' + winner[0];
    } else if (this.state.stepNumber === 9) {
      status = 'Draw!'
    }
      else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            gridSize={3}
            winners={winner ? winner[1] : null}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
