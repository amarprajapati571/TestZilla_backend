import DailyTestModel from "../Models/DailyTest.model.js";
import QuestionModel from "../Models/Questions.model.js";



class DailyTestController{
    static AddQuestion = async(SubjectID,
        ExamID,
        TestID,
        Question,
        Options,
        Description,
        CorrectAnswer,
        CreatedDate,
        CreatedBy,) =>{
        try {
            let QuestionParams = new QuestionModel({
                SubjectID:SubjectID,
                ExamID:ExamID,
                TestID:TestID,
                Question:Question,
                Options:Options,
                Description:Description,
                CorrectAnswer:CorrectAnswer,
                CreatedDate:CreatedDate,
                CreatedBy:CreatedBy,
            })
            let SaveQuestion = await QuestionParams.save();
            return true;
        } catch (err) {
           console.log(err) 
           return false;
        }
        
    }
    static GetDailyTestDetails = async(req,res)=>{
        try{
            const DailyTestDetails = await DailyTestModel.aggregate([
                {
                    $lookup:{
                        from: "Subject",
                        localField: "$SubjectID",
                        foreignField: "$_id",
                        as: "Subject"

                    }
                },
                {
                    $unwind:{
                        path:"$Subject",
                        preserveNullAndEmptyArrays:false
                    }
                },
                {
                    $lookup:{
                        from: "Exam",
                        localField: "$ExamID",
                        foreignField: "$_id",
                        as: "Exam"

                    }
                },
                {
                    $unwind:{
                        path:"$Exam",
                        preserveNullAndEmptyArrays:false
                    }
                },
            ]);
            const Result={
              status:true,
              data:DailyTestDetails,
              msg:"Get daily test page detail"
            }
            res.send(Result);
        }catch(err){
            console.log(err)
        }
    }
    static AddDailyTest = async(req,res)=>{
        try {
            let DailyTestParams = new DailyTestModel({
                SubjectID:req.body.SubjectID,
                ExamID:req.body.ExamID,
                TestName:req.body.TestName,
                TotalQuestion:req.body.TotalQuestion,
                LaunchDate:req.body.LaunchDate,
                LaunchTime:req.body.LaunchTime,
                IsDeleted:false,
                CreatedDate:req.body.CreatedDate,
                CreatedBy:req.body.ID,
            })
           let DailyTestID = DailyTestParams._id;
            const SaveDailyTest = await DailyTestParams.save();

            const Result={
              status:true,
              data:SaveDailyTest,
              msg:"Daily Test Added successfully"
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
export default DailyTestController;