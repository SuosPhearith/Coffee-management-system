
import React, {useEffect } from 'react';
import { Button, InputNumber } from 'antd';
import '../cart/Cart.css';

function Cart({ cart, setCart, setTotalPrice, setDiscount, setDiscountAmount }) {

    const handlePrice = () => {
        let totalPriceByQty = 0;
        cart.forEach((item) => {
            totalPriceByQty += item.Price * item.Quantity;
        });
        setTotalPrice(totalPriceByQty);
    };

    const handleRemove = (id) => {
        const arr = cart.filter((item) => item.ProductID !== id);
        setCart(arr);
        setDiscount(true);
        setDiscountAmount(0);
    };

    const handleChange = (item, value) => {
        const updatedCart = cart.map((cartItem) => {
            if (cartItem.ProductID === item.ProductID) {
                return { ...cartItem, Quantity: value };
            }
            return cartItem;
        });
        setCart(updatedCart);
        setDiscount(true);
        setDiscountAmount(0);
    };

    useEffect(() => {
        handlePrice();
    }, [cart]);

    return (
        <div className="order2">
            {cart?.map((item, index) => (
                <div className="info" key={index}>
                    <div className="no">{index + 1}</div>
                    <div className="name">{item.Name}</div>
                    <div className="price">{item.Price}</div>
                    <div className="qty">
                        <InputNumber
                            className="qty_input"
                            size="large"
                            min={1}
                            placeholder="1"
                            value={item.Quantity}
                            onChange={(value) => handleChange(item, value)}
                        />
                    </div>
                    <div className="action">
                        <Button type="primary" danger onClick={() => handleRemove(item.ProductID)}>
                            Remove
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Cart;

