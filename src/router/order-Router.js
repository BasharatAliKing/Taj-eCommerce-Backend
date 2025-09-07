const express=require("express");
const router=express.Router();
const OrderController=require("../controller/order-Controller");

router.route('/order-food').post(OrderController.createOrder);
router.route('/getallorders').get(OrderController.getAllOrders);
router.route('/getOrderById/:id').get(OrderController.getOrderById);
router.route('/deleteOrderById/:id').delete(OrderController.deleteOrder);
module.exports=router;