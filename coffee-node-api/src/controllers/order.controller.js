const isNull = require("../service/isNullOrEmpty")
const mysql = require("../config/db")
const db = mysql()
const getList = (req, res) => {
  let getListSql = "SELECT orders.OrderID, orders.UserID, orders.OrderDate, payments.PaymentID, payments.PaymentAmount"
    + " , payments.PaymentMethod, payments.TransactionDetails, payments.TotalAmount, payments.Discount, payments.Total, payments.Debt"
    + " FROM orders JOIN payments ON orders.OrderID = payments.OrderID";
  db.query(getListSql, (error, rows) => {
    if (error) {
      return res.json({
        error: true,
        message: error
      })
    }
    res.json({
      message: "List Orders",
      data: rows
    })
  })
}


const getListDebt = (req, res) => {
  let getListDebtSql = "SELECT orders.OrderID, orders.UserID, orders.OrderDate, payments.PaymentID, payments.PaymentAmount"
    + " , payments.PaymentMethod, payments.TransactionDetails, payments.TotalAmount, payments.Discount, payments.Total, payments.Debt"
    + " FROM orders JOIN payments ON orders.OrderID = payments.OrderID WHERE payments.Debt > '0'";
  db.query(getListDebtSql, (error, rows) => {
    if (error) {
      return res.json({
        error: true,
        message: error
      })
    }
    res.json({
      message: "List Debt orders",
      data: rows
    })
  })
}

const getListPayAll = (req, res) => {
  let getListPayAllSql = "SELECT orders.OrderID, orders.UserID, orders.OrderDate, payments.PaymentID, payments.PaymentAmount"
    + " , payments.PaymentMethod, payments.TransactionDetails, payments.TotalAmount, payments.Discount, payments.Total, payments.Debt"
    + " FROM orders JOIN payments ON orders.OrderID = payments.OrderID WHERE payments.Debt = '0'";
  db.query(getListPayAllSql, (error, rows) => {
    if (error) {
      return res.json({
        error: true,
        message: error
      })
    }
    res.json({
      message: "List payed all orders",
      data: rows
    })
  })
}

const getListEachOrderProductPrice = (req, res) => {
  let orderID = req.body.orderID;

  let sql = "SELECT ProductID FROM orderitems WHERE OrderID = ?"
  if (isNull(orderID)) {
    return res.json({
      message: "Please input orderID"
    })
  }
  db.query(sql, orderID, (error, rows) => {
    if (error) {
      return res.json({
        error: true,
        message: error
      })
    }
    if (rows.length == 0) {
      return res.json({
        message: "ProductID not found!!"
      })
    }
    let data = rows;
    if (data.length === 0) {
      return res.json({
        message: "This OrderID is no order!"
      })
    }
    let i = 0;
    let sqlGetOne = "SELECT products.Name, orderitems.Quantity, orderitems.TotalPrice FROM orderitems JOIN products"
      + " ON orderitems.ProductID = products.ProductID WHERE orderitems.OrderID = ? AND products.ProductID = ?";
    let result = [];
    for (i; i < data.length; i++) {
      const productID = data[i].ProductID;
      db.query(sqlGetOne, [orderID, productID], (error, rows) => {
        if (error) {
          return res.json({
            error: true,
            message: error
          })
        }
        result.push(rows[0])

        if (result.length === data.length) {
          res.json({
            message: `GetList ${orderID} successfully!`,
            data: result,
          });
        }
      })
    }


  })
}

const getListInvoice = (req, res) => {
  let sql = "SELECT orders.OrderID, orders.UserID, orders.OrderDate, payments.PaymentID, payments.PaymentAmount"
    + " , payments.PaymentMethod, payments.TransactionDetails, payments.TotalAmount, payments.Discount, payments.Total, payments.Debt"
    + " , orderitems.ProductID, orderitems.Quantity, orderitems.TotalPrice"
    + " FROM orders JOIN payments ON orders.OrderID = payments.OrderID JOIN orderitems ON orders.OrderID = orderitems.OrderID WHERE orders.OrderId = ?";
  let orderID = req.body.orderID;
  if (isNull(orderID)) {
    return res.json({
      message: "Please input orderID"
    })
  }
  db.query(sql, orderID, (error, rows) => {
    if (error) {
      return res.json({
        error: true,
        message: error
      })
    }
    if (rows.length == 0) {
      return res.json({
        message: "ProductID not found!!"
      })
    }
    let data = rows;
    if (data.length === 0) {
      return res.json({
        message: "This OrderID is no order!"
      })
    }
    let i = 0;
    let sqlGetOne = "SELECT products.Name, orderitems.Quantity, orderitems.TotalPrice FROM orderitems JOIN products"
      + " ON orderitems.ProductID = products.ProductID WHERE orderitems.OrderID = ? AND products.ProductID = ?";
    let result = [];
    for (i; i < data.length; i++) {
      const productID = data[i].ProductID;
      db.query(sqlGetOne, [orderID, productID], (error, rows) => {
        if (error) {
          return res.json({
            error: true,
            message: error
          })
        }
        result.push(rows[0])

        if (result.length === data.length) {
          res.json({
            message: `GetList ${orderID} successfully!`,
            data: result,
          });
        }
      })
    }


  })
}



const create = (req, res) => {
  const { orderDate, userID, products, paymentAmount, paymentMethod, transactionDetails, discount } = req.body;

  if ( req.body.products.length <= 0) {
    return res.json({
      error: true,
      message: "Please select any item!!"
    });
  }

  if (isNull(orderDate) || isNull(userID) || isNull(products) || isNull(paymentAmount) || isNull(paymentMethod) || isNull(discount)) {
    return res.json({
      error: true,
      message: "Please input all fields!"
    });
  }

  if (paymentAmount < 0 || discount < 0) {
    return res.json({
      error: true,
      message: "Problem insert!"
    })
  }
  let insertOrderSql = "INSERT INTO orders (UserID, OrderDate) VALUES (?, ?)";
  const orderData = [userID, orderDate];

  db.query(insertOrderSql, orderData, (error, orderResult) => {
    if (error) {
      return res.json({
        error: true,
        message: error
      });
    }

    const orderID = orderResult.insertId;

    if (!Array.isArray(products) || products.length === 0) {
      return res.json({ error: "No products provided" });
    }

    let completedProducts = 0;
    let totalPrice = 0;

    products.forEach(({ ProductID, Quantity }) => {
      let selectPriceSql = "SELECT Price FROM products WHERE ProductID = ?";
      db.query(selectPriceSql, ProductID, (error, priceResult) => {
        if (error) {
          return res.json({
            error: true,
            message: error
          });
        }

        const price = priceResult[0].Price;
        const totalPriceForProduct = price * Quantity;
        totalPrice += totalPriceForProduct;

        let insertOrderItemsSql = "INSERT INTO orderitems (OrderID, ProductID, Quantity, TotalPrice) VALUES (?, ?, ?, ?)";
        const orderItemsData = [orderID, ProductID, Quantity, totalPriceForProduct];

        db.query(insertOrderItemsSql, orderItemsData, (error) => {
          if (error) {
            return res.json({
              error: true,
              message: error
            });
          }

          completedProducts++;

          if (completedProducts === products.length) {
            let insertPaymentSql = "INSERT INTO payments (OrderID, PaymentAmount, PaymentMethod, TransactionDetails, TotalAmount, Discount, Total, Debt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            const discountAmount = (totalPrice * discount) / 100;
            const total = totalPrice - discountAmount
            const debt = total - paymentAmount;
            if (debt < 0 || paymentAmount > total) {
              return res.json({
                message: "Problem paymented!!"
              })
            }
            const paymentData = [orderID, paymentAmount, paymentMethod, transactionDetails, totalPrice, discount, total, debt];

            db.query(insertPaymentSql, paymentData, (error) => {
              if (error) {
                return res.json({
                  error: true,
                  message: error
                });
              }

              return res.json({
                message: "Order created successfully!",
                orderID: orderID
              });
            });
          }
        });
      });
    });
  });
};

const update = (req, res) => {
  const { orderDate, paymentMethod, transactionDetails, orderID } = req.body
  let ordersSql = "UPDATE orders SET OrderDate = ? WHERE OrderID = ?"
  let paymentsSql = "UPDATE payments SET PaymentMethod = ? , TransactionDetails = ? WHERE OrderID = ?"
  const ordersData = [orderDate, orderID];
  const paymentsData = [paymentMethod, transactionDetails, orderID]
  if (isNull(orderDate) || isNull(paymentMethod) || isNull(transactionDetails)) {
    return res.json({
      message: "Please input all fields!"
    })
  }
  else {
    db.query(ordersSql, ordersData, (error, rows) => {
      if (error) {
        return res.json({
          error: true,
          message: error
        })
      }
      if (rows.affectedRows === 0) {
        return res.json({
          message: "OrderID not found!!!"
        })
      }
      db.query(paymentsSql, paymentsData, (error, rows) => {
        if (error) {
          return res.json({
            error: true,
            message: error
          })
        }
        if (rows.affectedRows === 0) {
          return res.json({
            message: "OrderID not found!!"
          })
        }
        res.json({
          message: "Updated successfully!",
          data: rows
        })
      })
    })
  }
}
const remove = (req, res) => {
  const ID = req.params.ID;
  let removeSql = "DELETE FROM orders WHERE OrderID = ?"
  db.query(removeSql, ID, (error, rows) => {
    if (error) {
      return res.json({
        error: true,
        message: error
      })
    }
    if (rows.affectedRows === 0) {
      return res.json({
        message: "ID not found!!"
      })
    }
    res.json({
      message: "Delete successfully!!",
      data: rows
    })
  })
}



module.exports = {
  getList,
  update,
  remove,
  create,
  getListDebt,
  getListPayAll,
  getListEachOrderProductPrice,
  getListInvoice
}