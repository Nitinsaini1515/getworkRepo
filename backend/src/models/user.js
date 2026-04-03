import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const userSchema = new mongoose.Schema({
  firstName:{
    type:String,
  required:true,
  trim :true  
  },

  lastName:{
    type:String,
  required:true,
  trim :true  
  },

email:{
      type:String,
      lowercase:true,
  required:true,
  trim :true  

},

password:{
  type:String,
  required:[true,"Password is required"],
trim:true,
unique:true
},

role:{
type:String,
enum:["worker","jobgiver","admin"],
required:true
},

skills:{
  type:String,
  trim:true,
  required: function () {
    return this.role==="worker"
  }
},
qualification:{
  type:String,
  required: function () {
    return this.role==="worker"
  }
},
experience:{
  type:Number,
    required: function () {
    return this.role==="worker"
  } 
},
avatar:{
  type:String,
  required:true
},
addhar:
{
  type:String,
  required:true
},
shopImg:{
    type:String,
  required: function () {
    return this.role === "jobgiver";}
},
shopName:{
  type:String,
  required: function () {
    return this.role==="jobgiver"
  }
},
gstNumber:{
  type:String,
    required: function () {
    return this.role==="jobgiver"
  }
},
businessType:{
  type:String, 
  required: function () {
    return this.role==="jobgiver"
  }
},
address:{
  type:String,
  required:true,
}
},{timestamps:true}
)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password,this.password)
};

userSchema.methods.generateAccessToken = function(){
  return jwt.sign({
    _id : this._id,
    firstName:this.firstName,
    lastName:this.lastName,
    email:this.email,
    role:this.role,
  },
  process.env.ACCESS_TOKEN_SECRET,
  {
    expiresIn :"1d",
  }
)
}


userSchema.methods.generateRefreshToken = function(){
  return jwt.sign({
    _id :this._id
  },
  process.env.REFRESH_TOKEN_SECRET,
  {
    expiresIn:"10d"
  })
}
  export const User = mongoose.model("User",userSchema);