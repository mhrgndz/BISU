var express = require('express');
var config = require('./config.json');
var app = express();
var fs = require("fs");
app.use('/',express.static(__dirname + "/www/"));
let http = app.listen(config.port);
let _sql = require("./www/js/sql");

msql = new _sql(config.server,config.database,config.uid,config.pwd,config.trustedConnection);

//PRODUCT
app.get('/ProductList', function (req, res) 
{
    msql.QueryPromise({query: 'SELECT * FROM [Product]', value: []},function(data)
    {
        let obj = JSON.parse(data);
        res.end(JSON.stringify(obj));
    });
})
app.get('/InsertOrder', function (req, res) 
{
    let data = 
    [{
        product : JSON.parse(Object.keys(req.query)).ProductName,
        quantity : JSON.parse(Object.keys(req.query)).TxtQuantity
    }]
    data = JSON.stringify(data);
    let totalAmount = JSON.parse(Object.keys(req.query)).TxtQuantity * JSON.parse(Object.keys(req.query)).ProductPrice;

    msql.QueryPromise({query: "INSERT INTO [Orders] ([subscriptionId],[deliveryDate],[paymentMethod],[products],[totalAmount],[status]) VALUES (1,'2021-05-02 00:13:00.000','BKM',@DATA,@totalAmount,'NEW')",param:['DATA:string|200','totalAmount:float'], value: [data,totalAmount]},function(data)
    {
        let obj = JSON.parse(data);
        res.end(JSON.stringify(obj));
    });
})
//CUSTOMER
app.get('/getCustomerInfo', function (req, res) 
{
    let id = Object.keys(req.query)[0];
    
    msql.QueryPromise({query: " SELECT * FROM [Subscription] WHERE phoneNumber = @phoneNumber ", param : ['phoneNumber:string|25'], value: [id]},function(data)
    {
        let obj = JSON.parse(data);
        res.end(JSON.stringify(obj));
    });
})
//ORDERS
app.get('/getOrders', function (req, res) 
{
    let id = Object.keys(req.query)[0];
    
    msql.QueryPromise({query: " SELECT * FROM [Orders] WHERE subscriptionId = (SELECT subscriptionId FROM Subscription WHERE phoneNumber = @phoneNumber)", param : ['phoneNumber:string|25'], value: [id]},function(data)
    {
        let obj = JSON.parse(data);
        res.end(JSON.stringify(obj));
    });
})