import jwt from 'jsonwebtoken'
import UserModel from '../Models/User.model.js';



var checkUserAuth = async (req, res, next) => {
  let token
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      // Get Token from header
      token = authorization.split(' ')[1]
      // Verify Token
      const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)
      // Get User from Token
      req.user = await UserModel.findById(userID).select('-password')
      console.log(req.user)

      next()
    } catch (error) {
      
      res.send({ 
        status: false, 
         message: "Unauthorized User" 
        })
    }
  }
  if (!token) {
    res.send({ 
      status: false, 
      message: "Unauthorized User, No Token" 
    })
  }
}

export default checkUserAuth;