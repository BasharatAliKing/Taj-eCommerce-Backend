const express=require("express");
const router=express.Router();
const OrderController=require("../controller/order-Controller");

router.route('/order-food').post(OrderController.createOrder);
router.route('/getallorders').get(OrderController.getAllOrders)
module.exports=router;