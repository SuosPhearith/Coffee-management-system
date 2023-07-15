
const isNull = require('../service/isNullOrEmpty')
const mysql = require('../config/db');
const db = mysql();
const getList = (req, res) => {
    let sql = "SELECT * FROM products";
    const searchText = req.query.text_search;
    const page = req.query.page;
    const pagination = 5;
    const offSet = (page - 1) * pagination;
    if (searchText != "") {
        sql += " where Name LIKE '%" + searchText + "%'";
    }

    if (page > 0 && page != null && searchText == "") {
        sql += " LIMIT " + offSet + "," + pagination;
    }
    db.query(sql, (error, rows) => {
        if (error) {
            res.json({
                error: true,
                message: error
            })
            return
        }
        let sql2 = "SELECT count(ProductID) as total from products"
        db.query(sql2, (error2, rows2) => {
            if (error2) {
                return res.json({
                    error: true,
                    message: error2
                })
            }
            res.json({
                total_record: rows2[0].total,
                pagination: pagination,
                data: rows
            })
        })
    })
}

const insert = (req, res) => {
    const body = req.body;
    const Name = body.Name;
    const Description = body.Description;
    const Price = body.Price;
    let file = null;
    if (!isNull(req.file)) {
        file = req.file.filename
    }
    if (isNull(Name) || isNull(Description) || isNull(Price)) {
        res.json({
            message: "Please input all fields!!"
        })
        return
    } else {

        let sqlInsert = "INSERT INTO `products`( `Name`, `Price`, `Image`, `Description`) VALUES (?,?,?,?)"
        db.query(sqlInsert, [Name, Price, file, Description], (error, rows) => {
            if (error) {
                res.json({
                    error: true,
                    message: error
                })
            } else {
                res.json({
                    message: "insert Success!",
                    data: rows
                })
            }
        })
    }
}

const update = (req, res) => {
    const body = req.body;
    const Name = body.Name;
    const Description = body.Description;
    const Price = body.Price;
    const ProductID = body.ProductID;
    let file = body.file;
    if (!isNull(req.file)) {
        file = req.file.filename
    }
    if (isNull(Name) || isNull(Description) || isNull(Price) || isNull(ProductID) || isNull(file)){
        res.json({
            message: "Please input all fields!!"
        })
        return
    } else {
        let updateSql = "UPDATE `products` SET `Name`=?,`Price`=?,`Image`=?,`Description`=? WHERE `ProductID`=?";
        db.query(updateSql, [Name, Price, file, Description, ProductID], (error, rows) => {
            if (error) {
                res.json({
                    error: true,
                    message: error
                })
            } else if (rows.affectedRows === 0) {
                res.json({
                    error: true,
                    message: "Product ID not found!"
                })
            } else {
                res.json({
                    message: "Product updated!",
                    rows: rows
                })
            }
        })
    }
}

const remove = (req, res) => {
    const ID = req.params.ID;

    if (isNull(ID)) {
        res.json({
            error: true,
            message: "Please input ID!!"
        })
    } else {
        let deleteSql = "DELETE FROM products WHERE ProductID = ?";
        db.query(deleteSql, ID, (error, rows) => {
            if (error) {
                res.json({
                    error: true,
                    message: error
                })
                return
            }

            if (rows.affectedRows === 0) {
                res.json({
                    message: "ProductID not found!"
                })
            } else {
                res.json({
                    message: "Delete successfully!",
                    data: rows
                })
            }
        })
    }
}


module.exports = {
    getList,
    insert,
    update,
    remove
}