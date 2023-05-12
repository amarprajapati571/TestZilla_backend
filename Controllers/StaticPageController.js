import StaticPageModel from "../Models/StaticPage.model.js";

class StaticPageController {
    static StaticPageGet = async(req,res)=>{
        try {
            const {Type} = req.body;
            const StaticPageDetails = await StaticPageModel.findOne({Type:Type});
            const Result={
              status:true,
              data:StaticPageDetails,
              msg:"Get Static Page detail"
            }
            res.send(Result);
        } catch (err) {
          console.log(err)
        }
      }
    
      static StaticPageUpdate = async(req,res)=>{
        try {
            const {Type,Body,lastUpdatedDate} = req.body;
           const Object = await StaticPageModel.findOneAndUpdate({Type:Type},{Body:Body,lastUpdatedDate:lastUpdatedDate});
            res.send({
              status:true,
              data:Object,
              msg:"Static page updated successfully"
            })
        } catch (err) {
            console.log(err);
        }
      }
}
export default StaticPageController;
