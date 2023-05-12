import ExamsModel from '../Models/Exams.model.js';

class ExamsController{
    static GetExamsDetails = async(req,res)=>{
        try{
            const ExamDetails = await ExamsModel.aggregate([
                {
                    $lookup:{
                        from: "MockTest",
                        localField: "$_id",
                        foreignField: "$ExamID",
                        as: "MockTest"

                    }
                },
                {
                    $lookup:{
                        from: "DailyTest",
                        localField: "$_id",
                        foreignField: "$ExamID",
                        as: "DailyTest"

                    }
                },
                {
                    $addFields:{
                        MockTestCount:{$size:"$MockTest"},
                        DailyTestCount:{$size:"$DailyTest"},
                    }
                }
            ]);
            const Result={
              status:true,
              data:ExamDetails,
              msg:"Get exam Page detail"
            }
            res.send(Result);
        }catch(err){
            console.log(err)
        }
    }
    static AddExams = async(req,res)=>{
        try {
            let ExamParams = new ExamsModel({
                ExamName:req.body.ExamName,
                MinusMarking:req.body.MinusMarking,
                QuestionMarking:req.body.QuestionMarking,
                IsDeleted:false,
                IsLive:false,
                CreatedDate:req.body.CreatedDate,
                LaunchDate:req.body.LaunchDate,
                CreatedBy:req.body.ID,
                LastUpdatedBy:"",
            })
           
            const SaveExam = await ExamParams.save();
            const Result={
              status:true,
              data:SaveExam,
              msg:"Exam Added successfully"
            }
            res.send(Result);
        } catch (err) {
            console.log(err)
        }
    }
    static UpdateExams = async(req,res)=>{
        try {
            let ExamID = req.body.ExamID;
            let ExamParams = {
                ExamName:req.body.ExamName,
                MinusMarking:req.body.MinusMarking,
                QuestionMarking:req.body.QuestionMarking,
                LaunchDate:req.body.LaunchDate,
                LastUpdatedBy:req.body.ID,
            }
           
            const UpdateExams = await ExamsModel.findByIdAndUpdate({_id:ExamID},{$set:ExamParams});
            const Result={
              status:true,
              data:UpdateExams,
              msg:"Exam updated successfully"
            }
            res.send(Result);
        } catch (err) {
            console.log(err)
        }
    }
    static DeletedExams = async(req,res)=>{
        try {
            let ExamID = req.body.ExamID;
            let ExamParams = {
                IsDeleted:true,
                LaunchDate:req.body.LaunchDate,
                LastUpdatedBy:req.body.ID,
            }
           
            const UpdateExams = await ExamsModel.findByIdAndUpdate({_id:ExamID},{$set:ExamParams});
            const Result={
              status:true,
              data:UpdateExams,
              msg:"Exam deleted successfully"
            }
            res.send(Result);
        } catch (err) {
            console.log(err)
        }
    }
}
export default ExamsController;