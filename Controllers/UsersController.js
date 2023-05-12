import UserModel from '../Models/User.model.js';

class UserController{
    static GetUsers = async(req,res)=>{
        try{
            const UserDetails = await UserModel.find({});
            const Result={
              status:true,
              data:UserDetails,
              msg:"Get User Page detail"
            }
            res.send(Result);
        }catch(err){
            console.log(err)
        }
    }
    static TotalUserCount = async(req,res)=>{
        try {
            const UserCount = await UserModel.find({}).countDocuments();
            const Result={
              status:true,
              data:UserCount,
              msg:"Get User count detail"
            }
            res.send(Result);
        } catch (err) {
            console.log(err)
        }
    }
}
export default UserController;