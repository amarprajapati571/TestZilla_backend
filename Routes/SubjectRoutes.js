import express from 'express';
import SubjectController from '../Controllers/SubjectController.js';



const router = express.Router();

router.post('/GetSubjectDetails', SubjectController.GetSubjectDetails);
router.post('/AddSubject', SubjectController.AddSubject);
router.post('/UpdateSubject', SubjectController.UpdateSubject);
router.post('/DeletedSubject', SubjectController.DeletedSubject);
export default router;