// ye file banai gyi hai taki hum apne errors ko standardize kr sake and a batter work flow mile
class ApiError extends Error {      //Error ye class hai aur hum use extend kr rahe hai taki apna function bhi jod sake
    constructor(        // is constructor me kya ho raha  hai ki user messsage me kuch dega to wo aayega nhi to default "something went wrong " print hoga similarly jo bhi wo dega yaha aa sakega nhi to default value pass hoo jayegi
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){          //yaha pe constructor ka override krte hai
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if(stack){      //jo bhi backend likh raha hai usko ek tracee mil jaye ki kaha kaha errors hai
            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }    
}

export {ApiError}