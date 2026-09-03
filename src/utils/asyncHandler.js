//isme ek method hai jo hum log baar baar use krnege isliye index.js ma naa likh ke yaha likh rahe hai
//taki waha pe chije km hoo
const asyncHandler = (requestHandler)=>{         // asyncHnadler ek higher order function hai mtlb wo functions jo dusre functions ko as a parameter use kr skte hai ya fir return bhi kr skte hai, request handler kuch nhi bs function ka naam hai jaise fn
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))       //promise me 2 chije hoti hai resolve and catch
    }
}    //agar controller koi function bhejta hai async me to wo yaha aa jayega , basically request handler wo function bn jayega, ab agar res milta hai to resolve me jayega nhi to catch me jayega

export {asyncHandler}









//const asyncHandler = () => {}   normally
//const asyncHandler = (func) => { () = {} }  function ke ander firse ek function pass kr diya
//const asyncHandler = (func) => async () => {} same uper wali chioj ko hum aaise likh skte hai
//its a wraper function


/*const asyncHandler = (fn)=> async (req,res,next) => {
    try{
        await fn(req,res,next)
    }catch(error){
        res.status(err.code || 500).json({      //agar user error code pass krta hai to err.code , nhi krta hai to 500, ho skta hai josn format ho isliye json
            success: false,
            message: err.message
        })     
    }
}*/