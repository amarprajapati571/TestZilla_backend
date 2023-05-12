import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import Transporter from '../configs/MailConfig.js';
import AdminModel from '../Models/Admin.model.js';

class AdminController {
    static AdminRegistration = async (req, res) => {
      const { Name, Email, Password, ConfirmPassword,CreatedDate } = req.body
      const Admin = await AdminModel.findOne({ Email: Email })
      if (Admin) {
        res.send({ 
          status: false, 
           message: "Email already exists"
           })
      } else {
        if (Name && Email && Password && ConfirmPassword) {
          if (Password === ConfirmPassword) {
            try {
              const salt = await bcrypt.genSalt(10)
              const hashPassword = await bcrypt.hash(Password, salt)
              const doc = new AdminModel({
                Name: Name,
                Email: Email,
                Password: hashPassword,
                CreatedDate:CreatedDate
                
              })
              await doc.save()
              const saved_user = await AdminModel.findOne({ Email: Email })
              // Generate JWT Token
              const token = jwt.sign({ UserID: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
              res.status(201).send({ "status": true, "message": "Registration Success", "token": token })
            } catch (error) {
              console.log(error)
              res.send({
                status: false, 
                  message: "Unable to Register"
                 })
            }
          } else {
            res.send({ 
              status: false, 
              message: "Password and Confirm Password doesn't match"
             })
          }
        } else {
          res.send({ 
            status: false,  
            message: "All fields are required"
           })
        }
      }
    }
  
    static AdminLogin = async (req, res) => {
      try {
        const { Email, Password } = req.body
        if (Email && Password) {
          const Admin = await AdminModel.findOne({ Email: Email })
          if (Admin != null) {
            const isMatch = await bcrypt.compare(Password, Admin.Password)
            if ((Admin.Email === Email) && isMatch) {
              // Generate JWT Token
              const Token = jwt.sign({ UserID: Admin._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
              res.send({ 
                status: true, 
                message: "Login Success", 
                data:{
                  Token: Token,
                  Email:Admin.Email,
                  ID:Admin._id,
                  Name:Admin.Name
                }
              })
            } else {
              res.send({
                 status: false, 
                 message: "Email or Password is not Valid" 
                })
            }
          } else {
            res.send({
              status: false, 
                message: "You are not a Registered User" })
          }
        } else {
          res.send({ 
            status: false, 
             message: "All Fields are Required" 
            })
        }
      } catch (error) {
        console.log(error)
        res.send({ 
          status: false, 
           message: "Unable to Login" })
      }
    }
  
    static ChangeAdminPassword = async (req, res) => {
  
      const { password, password_confirmation } = req.body
      if (password && password_confirmation) {
        if (password !== password_confirmation) {
          res.send({ 
            status: false, 
            message: "New Password and Confirm New Password doesn't match" })
        } else {
          const salt = await bcrypt.genSalt(10)
          const newHashPassword = await bcrypt.hash(password, salt)
          await AdminModel.findByIdAndUpdate(req.user._id, { $set: { Password: newHashPassword } })
          res.send({ 
            status: true, 
            message: "Password changed succesfully" })
        }
      } else {
        res.send({ 
          status: false, 
           message: "All Fields are Required"
         })
      }
    }
  
    static LoggedAdmin = async (req, res) => {
      
      res.send({ user: req.user })
    }
  
    static SendAdminPasswordResetEmail = async (req, res) => {
      const { email } = req.body
      if (email) {
        const Admin = await AdminModel.findOne({ email: email })
        if (Admin) {
          const secret = Admin._id + process.env.JWT_SECRET_KEY
          const token = jwt.sign({ UserID: Admin._id }, secret, { expiresIn: '15m' })
          const link = `http://localhost:5572/user/reset/${Admin._id}/${token}`
          console.log(link)
          // Send Email
          let info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: "Appening - Password Reset Link",
            html: `<input name="cloudhq_backup_comment_node" type="hidden" value="%5Bif%20gte%20mso%209%5D%3E%0A%3Cxml%3E%0A%20%20%3Co%3AOfficeDocumentSettings%3E%0A%20%20%20%20%3Co%3AAllowPNG%3E%3C%2Fo%3AAllowPNG%3E%0A%20%20%20%20%3Co%3APixelsPerInch%3E96%3C%2Fo%3APixelsPerInch%3E%0A%20%20%3C%2Fo%3AOfficeDocumentSettings%3E%0A%3C%2Fxml%3E%0A%3C!%5Bendif%5D"> 
            <input name="cloudhq_backup_comment_node" type="hidden" value="%5Bif%20!mso%5D%3E%3C!"> 
            <input name="cloudhq_backup_comment_node" type="hidden" value="%3C!%5Bendif%5D"> 
            <input name="cloudhq_backup_style_node" type="hidden" value="%0A%20%20%20%20%20%20table%2C%20td%20%7B%20color%3A%20%23000000%3B%20%7D%20%40media%20only%20screen%20and%20(min-width%3A%20620px)%20%7B%0A%20%20.u-row%20%7B%0A%20%20%20%20width%3A%20600px%20!important%3B%0A%20%20%7D%0A%20%20.u-row%20.u-col%20%7B%0A%20%20%20%20vertical-align%3A%20top%3B%0A%20%20%7D%0A%0A%20%20.u-row%20.u-col-100%20%7B%0A%20%20%20%20width%3A%20600px%20!important%3B%0A%20%20%7D%0A%0A%7D%0A%0A%40media%20(max-width%3A%20620px)%20%7B%0A%20%20.u-row-container%20%7B%0A%20%20%20%20max-width%3A%20100%25%20!important%3B%0A%20%20%20%20padding-left%3A%200px%20!important%3B%0A%20%20%20%20padding-right%3A%200px%20!important%3B%0A%20%20%7D%0A%20%20.u-row%20.u-col%20%7B%0A%20%20%20%20min-width%3A%20320px%20!important%3B%0A%20%20%20%20max-width%3A%20100%25%20!important%3B%0A%20%20%20%20display%3A%20block%20!important%3B%0A%20%20%7D%0A%20%20.u-row%20%7B%0A%20%20%20%20width%3A%20calc(100%25%20-%2040px)%20!important%3B%0A%20%20%7D%0A%20%20.u-col%20%7B%0A%20%20%20%20width%3A%20100%25%20!important%3B%0A%20%20%7D%0A%20%20.u-col%20%3E%20div%20%7B%0A%20%20%20%20margin%3A%200%20auto%3B%0A%20%20%7D%0A%7D%0Abody%20%7B%0A%20%20margin%3A%200%3B%0A%20%20padding%3A%200%3B%0A%7D%0A%0Atable%2C%0Atr%2C%0Atd%20%7B%0A%20%20vertical-align%3A%20top%3B%0A%20%20border-collapse%3A%20collapse%3B%0A%7D%0A%0Ap%20%7B%0A%20%20margin%3A%200%3B%0A%7D%0A%0A.ie-container%20table%2C%0A.mso-container%20table%20%7B%0A%20%20table-layout%3A%20fixed%3B%0A%7D%0A%0A*%20%7B%0A%20%20line-height%3A%20inherit%3B%0A%7D%0A%0Aa%5Bx-apple-data-detectors%3D'true'%5D%20%7B%0A%20%20color%3A%20inherit%20!important%3B%0A%20%20text-decoration%3A%20none%20!important%3B%0A%7D%0A%0A"> 
            <input name="cloudhq_backup_comment_node" type="hidden" value="%5Bif%20!mso%5D%3E%3C!"> 
            <input name="cloudhq_backup_comment_node" type="hidden" value="%3C!%5Bendif%5D"> 
            <input name="cloudhq_backup_comment_node" type="hidden" value="%5Bif%20IE%5D%3E%3Cdiv%20class%3D%22ie-container%22%3E%3C!%5Bendif%5D"> 
            <input name="cloudhq_backup_comment_node" type="hidden" value="%5Bif%20mso%5D%3E%3Cdiv%20class%3D%22mso-container%22%3E%3C!%5Bendif%5D">
            <table style="border-collapse: collapse; table-layout: fixed; border-spacing: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; vertical-align: top; min-width: 320px; margin: 0 auto; background-color: #f9f9f9; width: 100%;" cellspacing="0" cellpadding="0">
              <tbody>
                <tr style="vertical-align: top;">
                  <td style="word-break: break-word; border-collapse: collapse !important; vertical-align: top;">
                    <input name="cloudhq_backup_comment_node" type="hidden" value="%5Bif%20(mso)%7C(IE)%5D%3E%3Ctable%20width%3D%22100%25%22%20cellpadding%3D%220%22%20cellspacing%3D%220%22%20border%3D%220%22%3E%3Ctr%3E%3Ctd%20align%3D%22center%22%20style%3D%22background-color%3A%20%23f9f9f9%3B%22%3E%3C!%5Bendif%5D">
                    <div class="u-row-container" style="padding: 0px; background-color: #f5f5f5;">
                      <div class="u-row" style="margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
                        <div style="border-collapse: collapse; display: table; width: 100%; background-color: transparent;">
                          <input name="cloudhq_backup_comment_node" type="hidden" value="%5Bif%20(mso)%7C(IE)%5D%3E%3Ctable%20width%3D%22100%25%22%20cellpadding%3D%220%22%20cellspacing%3D%220%22%20border%3D%220%22%3E%3Ctr%3E%3Ctd%20style%3D%22padding%3A%200px%3Bbackground-color%3A%20%23f5f5f5%3B%22%20align%3D%22center%22%3E%3Ctable%20cellpadding%3D%220%22%20cellspacing%3D%220%22%20border%3D%220%22%20style%3D%22width%3A600px%3B%22%3E%3Ctr%20style%3D%22background-color%3A%20%23ffffff%3B%22%3E%3C!%5Bendif%5D"> 
                          <input name="cloudhq_backup_comment_node" type="hidden" value="%5Bif%20(mso)%7C(IE)%5D%3E%3Ctd%20align%3D%22center%22%20width%3D%22600%22%20style%3D%22width%3A%20600px%3Bpadding%3A%200px%3Bborder-top%3A%200px%20solid%20transparent%3Bborder-left%3A%200px%20solid%20transparent%3Bborder-right%3A%200px%20solid%20transparent%3Bborder-bottom%3A%200px%20solid%20transparent%3B%22%20valign%3D%22top%22%3E%3C!%5Bendif%5D">
                          <div class="u-col u-col-100" style="max-width: 320px; min-width: 600px; display: table-cell; vertical-align: top;">
                            <div style="width: 100% !important;">
                              <input name="cloudhq_backup_comment_node" type="hidden" value="%5Bif%20(!mso)%26(!IE)%5D%3E%3C!">
                              <div style="padding: 0px; border: 0px solid transparent;">
                                <input name="cloudhq_backup_comment_node" type="hidden" value="%3C!%5Bendif%5D">
                                <table style="font-family: 'Cabin',sans-serif;" role="presentation" border="0" width="100%" cellspacing="0" cellpadding="0">
                                  <tbody>
                                    <tr>
                                      <td style="overflow-wrap: break-word; word-break: break-word; padding: 0px; font-family: 'Cabin',sans-serif;" align="left">
                                        <table border="0" width="100%" cellspacing="0" cellpadding="0">
                                          <tbody>
                                            <tr>
                                              <td style="padding-right: 0px; padding-left: 0px;" align="center">
                                                <img style="outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; clear: both; display: inline-block !important; border: none; height: auto; float: none; width: 100%; max-width: 600px;" title="Image" src="https://share1.cloudhq-mkt3.net/7468419abdc109.jpeg" alt="Image" width="600" align="center" border="0">
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <input name="cloudhq_backup_comment_node" type="hidden" value="%5Bif%20(!mso)%26(!IE)%5D%3E%3C!">
                              </div>
                              <input name="cloudhq_backup_comment_node" type="hidden" value="%3C!%5Bendif%5D">
                            </div>
                          </div>
                          <input name="cloudhq_backup_comment_node" type="hidden" value="%5Bif%20(mso)%7C(IE)%5D%3E%3C%2Ftd%3E%3C!%5Bendif%5D"> 
                          <input name="cloudhq_backup_comment_node" type="hidden" value="%5Bif%20(mso)%7C(IE)%5D%3E%3C%2Ftr%3E%3C%2Ftable%3E%3C%2Ftd%3E%3C%2Ftr%3E%3C%2Ftable%3E%3C!%5Bendif%5D">
                        </div>
                      </div>
                    </div>
                    <div class="u-row-container" style="padding: 0px; background-color: #f5f5f5;">
                      <div class="u-row" style="margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
                        <div style="border-collapse: collapse; display: table; width: 100%; background-color: transparent;">
                          <input name="cloudhq_backup_comment_node" type="hidden" value="%5Bif%20(mso)%7C(IE)%5D%3E%3Ctable%20width%3D%22100%25%22%20cellpadding%3D%220%22%20cellspacing%3D%220%22%20border%3D%220%22%3E%3Ctr%3E%3Ctd%20style%3D%22padding%3A%200px%3Bbackground-color%3A%20%23f5f5f5%3B%22%20align%3D%22center%22%3E%3Ctable%20cellpadding%3D%220%22%20cellspacing%3D%220%22%20border%3D%220%22%20style%3D%22width%3A600px%3B%22%3E%3Ctr%20style%3D%22background-color%3A%20%23ffffff%3B%22%3E%3C!%5Bendif%5D"> 
                          <input name="cloudhq_backup_comment_node" type="hidden" value="%5Bif%20(mso)%7C(IE)%5D%3E%3Ctd%20align%3D%22center%22%20width%3D%22600%22%20style%3D%22width%3A%20600px%3Bpadding%3A%200px%3Bborder-top%3A%200px%20solid%20transparent%3Bborder-left%3A%200px%20solid%20transparent%3Bborder-right%3A%200px%20solid%20transparent%3Bborder-bottom%3A%200px%20solid%20transparent%3Bborder-radius%3A%200px%3B-webkit-border-radius%3A%200px%3B%20-moz-border-radius%3A%200px%3B%22%20valign%3D%22top%22%3E%3C!%5Bendif%5D">
                          <div class="u-col u-col-100" style="max-width: 320px; min-width: 600px; display: table-cell; vertical-align: top;">
                            <div style="width: 100% !important; border-radius: 0px; -webkit-border-radius: 0px; -moz-border-radius: 0px;">
                              <input name="cloudhq_backup_comment_node" type="hidden" value="%5Bif%20(!mso)%26(!IE)%5D%3E%3C!">
                              <div style="padding: 0px; border-radius: 0px; -webkit-border-radius: 0px; -moz-border-radius: 0px; border: 0px solid transparent;">
                                <input name="cloudhq_backup_comment_node" type="hidden" value="%3C!%5Bendif%5D">
                                <table style="font-family: 'Cabin',sans-serif;" role="presentation" border="0" width="100%" cellspacing="0" cellpadding="0">
                                  <tbody>
                                    <tr>
                                      <td style="overflow-wrap: break-word; word-break: break-word; padding: 10px; font-family: 'Cabin',sans-serif;" align="left">
                                        <div style="line-height: 170%; text-align: left; word-wrap: break-word;">
                                          <p style="font-size: 14px; line-height: 170%; text-align: center; margin: 0px;">&nbsp;</p>
                                          <p style="font-size: 14px; line-height: 170%; text-align: center; margin: 0px;">&nbsp;</p>
                                          <p style="font-size: 14px; line-height: 170%; text-align: center; margin: 0px;">
                                            <span style="font-family: 'Playfair Display', serif; font-size: 18px; line-height: 30.6px;">Hope you're not forced into taking any</span>
                                          </p>
                                          <p style="font-size: 14px; line-height: 170%; text-align: center; margin: 0px;">
                                            <span style="font-family: 'Playfair Display', serif; font-size: 18px; line-height: 30.6px;">awkward Christmas photos.</span>
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <table style="font-family: 'Cabin',sans-serif;" role="presentation" border="0" width="100%" cellspacing="0" cellpadding="0">
                                  <tbody>
                                    <tr>
                                      <td style="overflow-wrap: break-word; word-break: break-word; padding: 10px; font-family: 'Cabin',sans-serif;" align="left">
                                        <table border="0" width="100%" cellspacing="0" cellpadding="0">
                                          <tbody>
                                            <tr>
                                              <td style="padding-right: 0px; padding-left: 0px;" align="center">
                                                <img style="outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; clear: both; display: inline-block !important; border: none; height: auto; float: none; width: 16%; max-width: 92.8px;" title="" src="https://share1.cloudhq-mkt3.net/a4a9ac765aef28.png" alt="" width="92.8" align="center" border="0">
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <table style="font-family: 'Cabin',sans-serif;" role="presentation" border="0" width="100%" cellspacing="0" cellpadding="0">
                                  <tbody>
                                    <tr>
                                      <td style="overflow-wrap: break-word; word-break: break-word; padding: 10px; font-family: 'Cabin',sans-serif;" align="left">
                                        <div style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                          <p style="font-size: 14px; line-height: 140%; text-align: center; margin: 0px;">Sending big Christmas hugs,</p>
                                          <p style="font-size: 14px; line-height: 140%; text-align: center; margin: 0px;">Mary</p>
                                          <p style="font-size: 14px; line-height: 140%; text-align: center; margin: 0px;">&nbsp;</p>
                                          <p style="font-size: 14px; line-height: 140%; text-align: center; margin: 0px;">&nbsp;</p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <input name="cloudhq_backup_comment_node" type="hidden" value="%5Bif%20(!mso)%26(!IE)%5D%3E%3C!">
                              </div>
                              <input name="cloudhq_backup_comment_node" type="hidden" value="%3C!%5Bendif%5D">
                            </div>
                          </div>
                          <input name="cloudhq_backup_comment_node" type="hidden" value="%5Bif%20(mso)%7C(IE)%5D%3E%3C%2Ftd%3E%3C!%5Bendif%5D"> 
                          <input name="cloudhq_backup_comment_node" type="hidden" value="%5Bif%20(mso)%7C(IE)%5D%3E%3C%2Ftr%3E%3C%2Ftable%3E%3C%2Ftd%3E%3C%2Ftr%3E%3C%2Ftable%3E%3C!%5Bendif%5D">
                        </div>
                      </div>
                    </div>
                    <input name="cloudhq_backup_comment_node" type="hidden" value="%5Bif%20(mso)%7C(IE)%5D%3E%3C%2Ftd%3E%3C%2Ftr%3E%3C%2Ftable%3E%3C!%5Bendif%5D">
                  </td>
                </tr>
              </tbody>
            </table>
            <input name="cloudhq_backup_comment_node" type="hidden" value="%5Bif%20mso%5D%3E%3C%2Fdiv%3E%3C!%5Bendif%5D"> 
            <input name="cloudhq_backup_comment_node" type="hidden" value="%5Bif%20IE%5D%3E%3C%2Fdiv%3E%3C!%5Bendif%5D">
            `
          })
          console.log(info)
          res.send({ 
            status: true, 
            message: "Password Reset Email Sent... Please Check Your Email"
           })
        } else {
          res.send({ 
            status: false, 
            message: "Email doesn't exists"
           })
        }
      } else {
        res.send({
           status: false, 
           message: "Email Field is Required"
           })
      }
    }
  
    static AdminPasswordReset = async (req, res) => {
      const { password, password_confirmation } = req.body
      const { id, token } = req.params
      const user = await UserModel.findById(id)
      const new_secret = user._id + process.env.JWT_SECRET_KEY
      try {
        jwt.verify(token, new_secret)
        if (password && password_confirmation) {
          if (password !== password_confirmation) {
            res.send({ 
              status: false, 
              message: "New Password and Confirm New Password doesn't match"
             });
          } else {
            const salt = await bcrypt.genSalt(10)
            const newHashPassword = await bcrypt.hash(password, salt)
            await UserModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } })
            res.send({ 
              status: true,
               message: "Password Reset Successfully" })
          }
        } else {
          res.send({ 
            status: false, 
            message: "All Fields are Required" 
          })
        }
      } catch (error) {
        console.log(error)
        res.send({ 
          status: false, 
          message: "Invalid Token" })
      }
    }
  
    static AdminListing=async(req,res)=>{
      try{
        
        
          let user=await UserModel.find({ user_type: { $ne: 'admin' } }).sort({createdDate:1}).limit(10).lean();
          res.send({
            status:true,
            data:user,
            msg:"Get recent user"
          });
       
      }catch(err){
        console.log(err);
      }
    }
  
    static GetAllAdmin=async(req,res)=>{
      try{
        var Page = req.body.Page;
        var RowsPerPage = req.body.RowsPerPage;
        var Start = (Page - 1) * RowsPerPage;
        var End = (Page - 1) * RowsPerPage + RowsPerPage;
        var Search = req.body.Search;
        var Sort = { [req.body.Field]: req.body.SortBy };
          const Query=[
            { name: new RegExp(Search, "i") },
            { email: new RegExp(Search, "i") },
            
          ]
          let user=await AdminModel.aggregate([
            {
              $match:{
                IsDeleted:false
              }
            },
            {
              $match:{
                $or:Query
              }
            }
          ]).sort(Sort);
  
          var ResultData = user.slice(Start, End);
          var PageCount = parseInt((user.length + (RowsPerPage - 1)) / RowsPerPage);
          const Result = {
            StatusMessage:'SUCCESS',
            Search: Search,
            PageCount: PageCount,
            PageData: ResultData,
            TotalCount: user.length,
          };
          res.send(Result)
      }catch(err){
        console.log(err);
      }
    }
  
    // static UserDashboardCounts =async(req,res)=>{
    //   try{
    //     let RecentUser=await UserModel.aggregate([
    //       {
    //         $addFields:{
    //           createdDate:{
    //             $dateToString:{
    //               date:"$createdDate",
    //               format:"%Y-%m-%d"
    //             }
    //           },
    //             currentDate:{
    //               $dateToString:{
    //                 date:new Date(),
    //                 format:"%Y-%m-%d"
    //               }
    //           }
    //         }
    //       },
    //       {
    //         $match:{
    //           user_type: { $ne: 'admin' },
    //           createdDate:{
    //           $gte:"$currentDate"
      
    // }
    //         }
    //       }
    //     ]);
    //     let ActiveUser = await UserModel.find({user_type:{$ne:'admin'},isActive:true,isDeleted:false}).count();
    //     let TotalUser = await UserModel.find({user_type:{$ne:'admin'}}).count();
    //     const Result ={
    //       status:true,
    //       data:{
    //         RecentUser:RecentUser.length,
    //         ActiveUser,
    //         TotalUser
    //       },
    //       msg:"Get all counts"
    //     }
    //     res.send(Result)
    //   }catch(err){
    //     console.log(err)
    //   }
    // }
  
    static UpdateUserStatus = async(req,res)=>{
      try{
        const {ID , Status,LastUpdatedDate} = req.body;
        console.log(ID)
  var id = mongoose.Types.ObjectId(ID);
  
        const Updated = await UserModel.findOneAndUpdate({_id:id},{isActive:Status,LastUpdatedDate:LastUpdatedDate});
        const Result = {
          status:true,
          data:Updated,
          msg:"User status is updatd !"
        }
        res.send(Result);
      }catch(err){
        console.log(err)
      }
    }
    
    static DeleteUser = async(req,res)=>{
      try{
        const {ID ,LastUpdatedDate} = req.body;
        var id = mongoose.Types.ObjectId(ID);
        const Updated = await UserModel.findOneAndUpdate({_id:id},{isDeleted:true,LastUpdatedDate:LastUpdatedDate});
        const Result = {
          status:true,
          data:Updated,
          msg:"User status is updatd !"
        }
        res.send(Result);
      }catch(err){
        console.log(err)
      }
    }
  
    static GetAdminByID = async(req,res)=>{
      try{
          const {ID} = req.body;
          const id = mongoose.Types.ObjectId(ID);
          const AdminDetail = await AdminModel.findOne({_id:id});
          res.send({
            status:true,
            data:AdminDetail,
            msg:"Admin details !"
          })
      }catch(err){
        console.log(err)
          // res.send({
          //   status:false,
          //   message:err.data.message
          // })
      }
    }
  
    static UpdateUser = async(req,res)=>{
      try{
          const {ID,Name,Email,LastUpdatedDate} = req.body;
          var id = mongoose.Types.ObjectId(ID);
          const Updated = await AdminModel.findOneAndUpdate({_id:id},{Name:Name,Email:Email,LastUpdatedDate:LastUpdatedDate});
          const Result = {
            status:true,
            data:Updated,
            msg:"Admin is updatd !"
          }
          res.send(Result);
      }catch(err){
        console.log(err)
      }
    }
  
  
  
}
  
export default AdminController;


