import SubjectModel from "../Models/Subjects.model.js";

class SubjectController{
    static GetSubjectDetails = async(req,res)=>{
        try{
            const SubjectDetails = await SubjectModel.find({});
            const Result={
              status:true,
              data:SubjectDetails,
              msg:"Get subject page detail"
            }
            res.send(Result);
        }catch(err){
            console.log(err)
        }
    }
    static AddSubject = async(req,res)=>{
        try {
            let SubjectParams = new SubjectModel({
                SubjectName:req.body.SubjectName,
                ExamID:req.body.ExamID,
                IsDeleted:false,
                CreatedDate:req.body.CreatedDate,
                CreatedBy:req.body.ID,
            })
           
            const SaveSubject = await SubjectParams.save();
            const Result={
              status:true,
              data:SaveSubject,
              msg:"Sbuject Added successfully"
            }
            res.send(Result);
        } catch (err) {
            console.log(err)
        }
    }
    static UpdateSubject = async(req,res)=>{
        try {
            let SubjectID = req.body.SubjectID;
            let SubjectParams = {
                SubjectName:req.body.SubjectName,
                ExamID:req.body.ExamID,
                IsDeleted:false,
                LastUpdatedDate:req.body.LastUpdatedDate,
                LastUpdatedBy:req.body.ID,
            }
           
            const UpdateSubject = await SubjectModel.findByIdAndUpdate({_id:SubjectID},{$set:SubjectParams});
            const Result={
              status:true,
              data:UpdateSubject,
              msg:"Subject updated successfully"
            }
            res.send(Result);
        } catch (err) {
            console.log(err)
        }
    }
    static DeletedSubject = async(req,res)=>{
        try {
            let SubjectID = req.body.SubjectID;
            let SubjectParams = {
                IsDeleted:true,
                LastUpdatedDate:req.body.LastUpdatedDate,
                LastUpdatedBy:req.body.ID,
            }
           
            const UpdateSubject = await SubjectModel.findByIdAndUpdate({_id:SubjectID},{$set:SubjectParams});
            const Result={
              status:true,
              data:UpdateSubject,
              msg:"Subject deleted successfully"
            }
            res.send(Result);
        } catch (err) {
            console.log(err)
        }
    }
}
export default SubjectController;