import React, { Component } from "react";
import '../css/CartSample.css'

export default class CartSample extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // 商品列表
      goods: [
        {
          id: 1,
          name: '商品1'
        }, {
          id: 2,
          name: '商品2'
        }
      ],
      // 添加商品的名称
      goodName: '',
      // 购物车
      carts: []
    }

    this.handleAddNumInCart = this.handleAddNumInCart.bind(this)
  }

  // 监听添加商品的名称变化
  handleGoodName = (e) => {
    console.log('监听添加商品的名称变化', e.target.value)
    this.setState({
      goodName: e.target.value
    })
  }
  
  // 添加商品
  addGood() {
    this.setState(preState => ({
      goods: [
        ...preState.goods,
        {
          id: preState.goods.length + 1,
          name: preState.goodName
        }
      ]
    }))
  }

  // 加入购物车
  handleAddToCart = (good) => {
    console.log("加入购物车")
    const crtCarts = [ ...this.state.carts ];
    const goodInCart = crtCarts.find(item => item.id === good.id)
    if (goodInCart) {
      goodInCart.count = goodInCart.count + 1
    } else {
      crtCarts.push({
        ...good,
        count: 1
      })
    }
    this.setState({
      carts: crtCarts
    })
  }

  handleAddToCart2 = (e) => {
    console.log('1234567', e)
  }

  // 购物车某个商品-增加商品数量
  handleAddNumInCart(good) {
    console.log('购物车某个商品-增加商品数量', this)
    const crtCarts = [ ...this.state.carts ];
    const goodInCart = crtCarts.find(item => item.id === good.id)
    goodInCart.count = goodInCart.count + 1
    this.setState({
      carts: crtCarts
    })
  }

  // 购物车某个商品-减少商品数量
  handleMinusNumInCart = (good) => {
    console.log('购物车某个商品-减少商品数量', this)
    const crtCarts = [ ...this.state.carts ];
    const goodInCart = crtCarts.find(item => item.id === good.id)
    if (goodInCart.count === 1) {
      alert('至少一个商品')
    } else {
      goodInCart.count = goodInCart.count - 1
      this.setState({
        carts: crtCarts
      })
    }
  }

  render() {
    const { carts } = this.state

    return (
      <div>
        <div className="title">
          { this.props.title && <h3>{ this.props.title }</h3> }
        </div>
        <div className="add_good">
          <h4>添加商品</h4>
          <input
            type="text"
            placeholder="请输入商品名称"
            value={ this.state.goodName }
            onChange={this.handleGoodName} />
          <button onClick={() => this.addGood()}>添加商品</button>
        </div>
        <div className="goods_list">
          <h4>商品列表</h4>
          {
            this.state.goods.map(good => (
              <div key={good.id}>
                <span>{ good.name }</span>
                <button onClick={() => this.handleAddToCart(good)}>加购</button>
                <button onClick={this.handleAddToCart2}>加购2</button>
              </div>
            ))
          }
        </div>
        <div className="cart_list">
          <h4>购物车清单</h4>
          <Cart
            carts={carts}
            handleAddNumInCart={this.handleAddNumInCart}
            handleMinusNumInCart={this.handleMinusNumInCart} />
        </div>
      </div>
    )
  }
}

function Cart(props) {
  return (
    <div>
      <ul>
        {
          props.carts.map(good => (
            <li className="cart_li" key={good.id}>
              <button onClick={() => props.handleMinusNumInCart(good)}>-</button>
              <span>{ good.name }</span>
              <span>{ good.count }个</span>
              <button onClick={() => props.handleAddNumInCart(good)}>+</button>
            </li>
          ))
        }
      </ul>
    </div>
  )
}