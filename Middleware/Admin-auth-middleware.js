import jwt from 'jsonwebtoken'
import AdminModel from '../Models/Admin.model.js';


var checkAdminAuth = async (req, res, next) => {
  let token
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      // Get Token from header
      token = authorization.split(' ')[1]
      // Verify Token
      const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)
      // Get User from Token
      req.user = await AdminModel.findById(userID).select('-password')
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

export default checkAdminAuth