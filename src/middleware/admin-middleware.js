const adminMiddleware=async(req,res,next)=>{
    try{
  
       //  console.log(req.user);
        const adminrole= req.user.isAdmin;
         if(req.user.role!=='admin'){
          return res.status(403).json({message:"Access Denied , User is not an Admin"});
         }
         next();
      }catch(err){
          next(err);
      }
  }
  module.exports=adminMiddleware;