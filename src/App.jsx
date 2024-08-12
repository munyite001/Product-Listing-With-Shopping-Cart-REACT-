import './App.css';
import { useState } from 'react';
import data from './assets/data.json'

export default function App() {

  const [cart, setCart] = useState([])

  const [deviceType, setDeviceType] = useState('mobile');

  const handleResize = () => {
    if (window.innerWidth > 768) {
      setDeviceType('desktop')
    } else {
      setDeviceType('mobile')
    }
  }

  window.addEventListener('resize', handleResize)

const handleAddTocart = (item, index) => {
  //  Add a quantity property to the item object
  const newItem = {...item, quantity: 1, index: index}
  // Check if the item is already in the cart using its index
  const itemInCart = cart.find((item) => item.index === index)

  // If the item is already in the cart, increase its quantity by 1
  if (itemInCart) {
    const updatedCart = cart.map((item) => {
      if (item.index === index) {
        return {...item, quantity: item.quantity + 1}
      }
      return item
    })
    setCart(updatedCart)
  } else {
    setCart([...cart, newItem])
  }


}

  return (
    <div className='app'>
      <div className="desserts-section">
        <h2>Desserts</h2>
        <div className="desserts-container">
          {data.map((item, index) => {
            return (
              <div key={index} className="dessert-card">
                <img src={item.image[deviceType]} alt={item.name} />
                <p className="dessert-category">{item.category}</p>
                <h3 className='dessert-name'>{item.name}</h3>
                <p className='dessert-price'>${item.price.toFixed(2)}</p>
                <div className="btn-wrapper" onClick={() => handleAddTocart(item, index)}>
                  <img src="/images/icon-add-to-cart.svg" alt="Add to Cart Icon" />
                  <p className='add-to-cart-btn'>Add to Cart</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="cart">
        <h3>Your Cart ({cart.length}) </h3>
        {cart.length > 0 ? cart.map((item, index) => {
          return (
            <div key={index} className="cart-item">
              <div className='wrapper'>
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p><span className='quantity'>{item.quantity}x</span> @ <span className="price-for-one">${item.price.toFixed(2)}</span> <span className="total-cost">${(item.quantity * item.price).toFixed(2)}</span></p>
                </div>
                <img src="/images/icon-remove-item.svg" alt="Remove Icon" className='remove-icon'/>
              </div>
            </div>
          )
        }) : 
          <div className='cart-empty'>
            <img src="/images/illustration-empty-cart.svg" alt="Empty Cart Illustration" />
            <p>Your added items will appear here</p>
          </div>} 
          {cart.length > 0 && 
            <div className="cart-total">
              <div className="total">
                <p>Order Total:</p>
                <p>${cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}</p>
              </div>
              <div className="carbon-neutral">
                <img src="/images/icon-carbon-neutral.svg" alt="Leaf Icon" />
                <p>This is a <strong>carbon-neutral</strong> Delivery</p>
              </div>
              <button className='confirm'>Confirm Order</button>
            </div>
          }
        </div>
      </div>
  )
}