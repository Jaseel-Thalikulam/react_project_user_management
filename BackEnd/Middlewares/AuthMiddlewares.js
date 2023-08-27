
const UserModel = require('../Model/UserModel')
const User = require('../Model/UserModel')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const secretKeyAdmin = process.env.SECRET_KEY_ADMIN;

module.exports.checkUser = (req, res, next) => {
  const tokenAdmin = req.cookies.jwtadmin
  const token = req.cookies.jwt
  
  if (token) {

    jwt.verify(token, secretKey, async (err, decodedToken) => {
      if (err) {

        res.json({ status: false })

        console.log("Token verification Failed")

      } else {

        const user = await User.findById(decodedToken.id)

        if (user) {


          if (user.user) {

            res.json({ status: true, user: user })
            next()
          } else { 


            console.log(user.user)

          }

        } else {
          res.json({ status: false })

        }
      }
    })
  } else if (tokenAdmin) {
    
    res.json({ status: true,isAdmin:true})


  } else {

    console.log("Token Not available")
    res.json({ status: false })
  }
}


module.exports.isAdmin = (req,res,next) => {

  const tokenAdmin = req.cookies.jwtadmin
  
  if (tokenAdmin) {
    jwt.verify(tokenAdmin, secretKeyAdmin, async (err, decodedToken) => {
      if (err) {
        
        res.json({ status: false })
        
      } else {
  
        const user = UserModel.find({ _id: decodedToken.id })

        
        if (!user.user) {
         
          next();


        } else {
          
          res.json({ status: false })

        }

      }
    })
  } else {
    console.log("Token unavilable From IsAdmin")
    res.json({ status: false })

  }

}


