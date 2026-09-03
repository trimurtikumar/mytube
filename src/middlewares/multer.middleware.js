import multer from "multer"     //used to upload files,media
//isko hum as a middleware use krnge aur iska naam hai storage.

const storage = multer.diskStorage({        //yaha pe hum diskstorage use kr rahe hai memory storage nhi
  destination: function (req, file, cb) {       //yaha pe file ka option bhi mil jata hai , jo bina multer ke nhi hota. cb call back hai
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)     //yaha pe hum original name liye hai but its good to keep a unique suffix . kyuki agar same name ke 2 log aa gye to dikkat hogi,but yaha pe 1 user jayada time ke liye nhi rahega because usko req milte hi yaha se unlink ho jayega
  }
})

export const upload = multer({
    storage,
})