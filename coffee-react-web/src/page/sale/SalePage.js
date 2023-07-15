import React, { useEffect, useState } from 'react'
import request from '../../util/api'
import "../sale/SalePage.css"
import { Button, Input, Space, InputNumber, message, Image, Spin } from 'antd';
import { PoweroffOutlined, PrinterOutlined } from '@ant-design/icons'
import Cart from '../../conponent/cart/Cart';
import imageLink from '../../util/imageLink';
const { Search } = Input;

function SalePage() {
  const [list, setList] = useState([])
  const [isActive, setIsActive] = useState(true);
  const [activeTime, setActiveTime] = useState(0);
  const [cart, setCart] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [discount, setDiscount] = useState(true)
  const [payment, setPayment] = useState(0)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let timeout;

    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsActive(false), 5000);
    };

    const handleMouseMove = () => {
      setIsActive(true);
      resetTimeout();
    };

    const handleKeyDown = () => {
      setIsActive(true);
      resetTimeout();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);

    // Check if active state exists in local storage
    const activeState = localStorage.getItem('activeState');
    const storedActiveTime = localStorage.getItem('activeTime');
    if (activeState) {
      setIsActive(JSON.parse(activeState));
    }
    if (storedActiveTime) {
      setActiveTime(parseInt(storedActiveTime));
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeout);
    };
  }, []);
  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setActiveTime(prevTime => prevTime + 1);
        localStorage.setItem('activeTime', activeTime + 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive, activeTime]);
  useEffect(() => {
    getList();
  }, []);
  function formatDuration(durationInSeconds) {
    const secondsInMinute = 60;
    const secondsInHour = 60 * secondsInMinute;
    const secondsInDay = 24 * secondsInHour;
    const secondsInMonth = 30 * secondsInDay;
    const secondsInYear = 365 * secondsInDay;

    const years = Math.floor(durationInSeconds / secondsInYear);
    const months = Math.floor((durationInSeconds % secondsInYear) / secondsInMonth);
    const days = Math.floor((durationInSeconds % secondsInMonth) / secondsInDay);
    const hours = Math.floor((durationInSeconds % secondsInDay) / secondsInHour);
    const minutes = Math.floor((durationInSeconds % secondsInHour) / secondsInMinute);
    const seconds = Math.floor(durationInSeconds % secondsInMinute);

    return `${years}:${months}:${days}:${hours}:${minutes}:${seconds}`;
  }


  const getList = (text_search = "") => {
    setLoading(true)
    request("get", "product/getList?text_search=" + text_search).then(res => {
      if (res.error === true) {
        message.error("Cannot get data!!")
        setTimeout(() => {
          setLoading(false)
        }, 5000);
        return;
      }
      setList(res.data.data)
      setLoading(false);
    }).catch(err => {
      console.log(err)
      message.error("Crash server!!")
    })
  }

  const handleSearch = (e) => {
    getList(e)
  }
  const listItems = list.map((item) => (
    <div className='card' key={item.id}>
      <div className='image'>
        <Image className='img' src={imageLink + item.Image} alt='Image' />
      </div>
      <div className='information'>
        <div>Name: {item.Name}</div>
        <div>Price: {item.Price}$</div>
        <Button onClick={() => handleClick(item)} type='primary'>
          Add to cart
        </Button>
      </div>
    </div>
  ));

  const handleClick = (item) => {
    let isPresent = false;
    cart.forEach((product) => {
      if (item.ProductID === product.ProductID) {
        isPresent = true;
      }
    })
    if (isPresent) {
      message.warning("This Product's already select!")
      return;
    }
    setCart([...cart, item])
    setDiscount(true)
    setDiscountAmount(0)
  }

  const handleDiscount = (item) => {
    let total = totalPrice;
    let result = total - ((totalPrice * item) / 100);
    setPayment(result)
  }

  const doPayment = () => {
    if (discount) {
      return totalPrice;
    } else {
      return payment;
    }
  }

  const handleCancel = () => {
    setCart([]);
    setDiscount(true)
    setDiscountAmount(0)
  }

  const profile = JSON.parse(localStorage.getItem("profile"))

  const now = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  const handleInvoice = () => {
    setLoading(true)
    let userID = profile.UserID;
    let orderDate = now();
    let paymentAmount = doPayment();
    let discount = discountAmount;
    let paymentMethod = "Cash";
    let transactionDetails = "Pay all"
    let data1 = {
      "userID": userID,
      "orderDate": orderDate,
      "paymentAmount": paymentAmount,
      "discount": discount,
      "paymentMethod": paymentMethod,
      "transactionDetails": transactionDetails,
      "products" : cart
    }

    request("Post" , "order/create" , data1).then(res=>{
      if(res.data.error === true ){
        message.error(res.data.message);
        setLoading(false)
        return;
      }
      message.success(res.data.message)
      setLoading(false);
      handleCancel();
    }).catch(err=>{
      console.log(err);
      message.error("Crash server!!");
      setLoading(false);
    })

  }

  return (
    <div>
      <Spin spinning={loading}>
        <div className='container'>
          <div className='container1'>
            <Space style={{ marginTop: -15 }}>
              <h2>Products</h2>
              <Search
                placeholder="Search"
                allowClear
                onSearch={handleSearch}
                className='search'
              />
            </Space>
            <div className='container2'>
              {listItems}
            </div>
          </div>
          <div className='sale'>
            <div className='timing'>
              <h3>Timing:{formatDuration(activeTime)}</h3>
            </div>
            <div className='order'>
              <div className='info' style={{backgroundColor:"#C8C8C8"}}>
                <div className='no'>
                  No
                </div>
                <div className='name'>
                  Name
                </div>
                <div className='price'>
                  Price
                </div>
                <div className='qty'>
                  Qty
                </div>
                <div className='action'>
                  Action
                </div>
              </div>
              <Cart cart={cart} setCart={setCart} setTotalPrice={setTotalPrice} setDiscount={setDiscount} setDiscountAmount={setDiscountAmount} />
            </div>
            <div className='field'>
              <div className='total'>
                <h3>Total</h3>
                <Input
                  size="large"
                  addonAfter="$"
                  min={0}
                  max={100000}
                  value={totalPrice}
                />
              </div>
              <div className='discount'>
                <h3>Discount</h3>
                <InputNumber
                  size="large"
                  addonAfter="%"
                  min={0}
                  max={100}
                  value={discountAmount}
                  onChange={(item) => {
                    setDiscount(false)
                    handleDiscount(item)
                    setDiscountAmount(item)
                  }}
                />
              </div>
              <div className='payment'>
                <h3>Payment</h3>
                <Input
                  size="large"
                  addonAfter="$"
                  min={0}
                  max={100000}
                  value={doPayment()}
                />
              </div>
            </div>
            <div className='button'>
              <div className='cancel'>
                <button className='btn btn1' onClick={handleCancel}>
                  <PoweroffOutlined />
                  <p>Cancel</p>
                </button>
              </div>
              <div className='invoice'>
                <button className='btn btn2' onClick={handleInvoice}>
                  <PrinterOutlined />
                  Print Invoice
                </button>
              </div>
              <div className='receipt'>
                <button className='btn btn3' onClick={handleInvoice}>
                  <PrinterOutlined />
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </div>


  )
}

export default SalePage
