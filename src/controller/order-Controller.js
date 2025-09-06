const Order=require('../models/order-model');

//**************************************************** */
//        CREATE ORDER HERE
//**************************************************** */
const createOrder = async (req, res) => {
  try {
   // console.log("Incoming order:", req.body);  // 👀 Check what frontend sends
    const { user, items, totalAmount } = req.body;
    if (!user || !items || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newOrder = await Order.create({ user, items, totalAmount });
    res.status(201).json({ message: "Order Created Successfully", order: newOrder });
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ message: err.message });
  }
};
//**************************************************** */
//        Cget ORDER table HERE
//**************************************************** */
const getAllOrders=async(req,res)=>{
  try{
      const getOrders=await Order.find();
      res.status(200).json({message:getOrders});
  }catch(err){
    res.status(500).json({message:err});
  }
}
module.exports={createOrder,getAllOrders};
