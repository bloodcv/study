import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// 单独的button
function Square(props) {
  return (
    <button
      className="square"
      onClick={ props.onClick }>
      { props.value }
    </button>
  );
}

// 9个方块  Board-Class
/* class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={ this.props.squares[i] }
        onClick={ () => this.props.onClick(i) }
        />
    );
  }

  render() {
    let status = `Next player: ${this.props.xIsNext ? 'X' : 'O'}`;
    const winner = this.props.winner;
    if (winner) {
      status = `Winner: ${winner}`
    }
    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

function renderSquare(i, props) {
  return (
    <Square
      value={ props.squares[i] }
      onClick={ () => props.onClick(i) }
      />
  );
} */

// 9个方块  Board-Function
function Board(props) {
  let status = `Next player: ${props.xIsNext ? 'X' : 'O'}`;
  const winner = props.winner;
  if (winner) {
    status = `Winner: ${winner}`
  }
  let squareRenderArr = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
  ];
  return (
    <div>
      <div className="status">{status}</div>
      {
        squareRenderArr.map((item, idx) => {
          return (
            <div className="board-row" key={idx}>
              {
                item.map((child, cIdx) => {
                  return (
                    <Square
                      key={child}
                      value={ props.squares[child] }
                      onClick={ () => props.onClick(child) }
                      />
                  )
                })
              }
            </div>
          )
        })
      }
    </div>
  );
}

// 含有默认值的棋盘
class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: new Array(9).fill('')
      }],
      xIsNext: true,
      stepNumber: 0
    }
  }

  handleClick(i) {
    const stepNumber = this.state.stepNumber;
    const history = this.state.history.slice(0, stepNumber + 1);
    const crt = history[history.length - 1].squares;
    const winner = calculateWinner(crt);
    let squares = crt.slice();
    if (!winner && !squares[i]) {
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      })
    } else if (winner) {
      alert('游戏已结束 胜者是：' + winner)
    }
  }

  jumpTo(i) {
    this.setState({
      stepNumber: i,
      xIsNext: i % 2 === 0
    })
  }

  render() {
    const history = this.state.history;
    const stepNumber = this.state.stepNumber;
    const crt = history[stepNumber].squares;
    const winner = calculateWinner(crt);
    let status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    if (winner) {
      status = `Winner: ${winner}`
    }

    let moves = history.map((item, idx) => {
      const desc = idx ?
        'Go to move #' + idx :
        'Go to game start';
      return (
        <li key={idx}>
          <button onClick={() => this.jumpTo(idx)}>{ desc }</button>
        </li>
      )
    })

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={ crt }
            xIsNext={ this.state.xIsNext }
            winner={ winner }
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

/**
 * 计算游戏的胜者
 * 0 1 2
 * 3 4 5
 * 6 7 8
 */
const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], 
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
