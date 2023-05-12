import express from 'express';
import ExamsController from '../Controllers/ExamsController.js';


const router = express.Router();

router.post('/GetExamsDetails', ExamsController.GetExamsDetails);
router.post('/AddExams', ExamsController.AddExams);
router.post('/UpdateExams', ExamsController.UpdateExams);
router.post('/DeletedExams', ExamsController.DeletedExams);
export default router;