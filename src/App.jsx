import './App.css';
import { useState, useEffect } from 'react';
import data from './assets/data.json'

export default function App() {

  const [cart, setCart] = useState([])

  const [deviceType, setDeviceType] = useState('mobile');

  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setDeviceType('desktop');
      } else {
        setDeviceType('mobile');
      }
    };
  
    window.addEventListener('resize', handleResize);
  
    // Call the resize handler immediately to set the initial state
    handleResize();
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // If the modal is shown, disable scrolling on the body
    if (showConfirmationModal) {
      document.body.style.overflowY = 'hidden';
    } else {
      // Re-enable scrolling when the modal is not shown
      document.body.style.overflowY = 'auto';
    }

    // Cleanup function to ensure the body style is reset when the component unmounts
    return () => {
      document.body.style.overflowY = 'auto';
    };
  }, [showConfirmationModal]);
  

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

const handleIncrementQuantity = (item) => {
  const updatedCart = cart.map((cartItem) => {
    if (cartItem.index === item.index) {
      return {...cartItem, quantity: cartItem.quantity + 1}
    }
    return cartItem
  })
  setCart(updatedCart)
}

const handleDecrementQuantity = (item) => {
  const updatedCart = cart.map((cartItem) => {
    if (cartItem.index === item.index) {
      //  Check if the quantity is already 1, if it is, remove the item from the cart
      if (cartItem.quantity === 1) {
        return {...cartItem, quantity: 0}
      }
      return {...cartItem, quantity: cartItem.quantity - 1}
    }
    return cartItem
  })
  setCart(updatedCart.filter((item) => item.quantity > 0))
}

const handleRemoveFromCart = (item) => {
  const updatedCart = cart.filter((cartItem) => cartItem.index !== item.index)
  setCart(updatedCart)
}


const handleCloseModal = () => {
  setCart([])
  setShowConfirmationModal(false)
}


  return (
    <div className='app'>
      { showConfirmationModal &&
      <div className="confirmation-modal">
      <div className="modal-content">
        <img src="/images/icon-order-confirmed.svg" alt="Checkmark Icon"  className='order-confirmed-icon'/>
        <h3>Order Confirmed</h3>
        <p>We hope you enjoy your food</p>
        {cart.map((item, index) => {
          return (
            <div key={index} className="cart-item">
              <div className='wrapper'>
                <div className="img-container">
                  <img src={item.image["thumbnail"]} alt={item.name} />
                </div>
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p><span className='quantity'>{item.quantity}x</span> @ <span className="price-for-one">${item.price.toFixed(2)}</span> <span className="total-cost">${(item.quantity * item.price).toFixed(2)}</span></p>
                </div>
              </div>
            </div>
          )
        })}
        <button onClick={handleCloseModal}>Start New Order</button>
      </div>

    </div>}
      <div className="desserts-section">
        <h2>Desserts</h2>
        <div className="desserts-container">
          {data.map((item, index) => {
            return (
              <div key={index} className={cart.find((cartItem) => cartItem.index === index) ? "dessert-card active" : "dessert-card"}>
                <img src={item.image[deviceType]} alt={item.name} />
                <p className="dessert-category">{item.category}</p>
                <h3 className='dessert-name'>{item.name}</h3>
                <p className='dessert-price'>${item.price.toFixed(2)}</p>
                {cart.find((cartItem) => cartItem.index === index) ?
                  <div className="btn-wrapper in-cart-btn">
                    {cart.map((cartItem) => {
                      if (cartItem.index === index) {
                        return (
                          <div key={cartItem.index}>
                            <div className="icon-wrapper" onClick={() => handleDecrementQuantity(cartItem)}>
                              <img src="/images/icon-decrement-quantity.svg" alt="decrement Quantity" />
                            </div>
                            <p>{cartItem.quantity}</p>
                            <div className="icon-wrapper" onClick={() => handleIncrementQuantity(cartItem)}>
                              <img src="/images/icon-increment-quantity.svg" alt="Increment Quantity" />
                            </div>
                          </div>
                        )
                      }
                    })}
                  </div>
                  :
                  <div className="btn-wrapper" onClick={() => handleAddTocart(item, index)}>
                    <img src="/images/icon-add-to-cart.svg" alt="Add to Cart Icon" />
                    <p className='add-to-cart-btn'>Add to Cart</p>
                  </div>
                }

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
                <img src="/images/icon-remove-item.svg" alt="Remove Icon" className='remove-icon' onClick={() => handleRemoveFromCart(item)}/>
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
              <button className='confirm' onClick={() => setShowConfirmationModal(true)}>Confirm Order</button>
            </div>
          }
        </div>
      </div>
  )
}