import express from 'express';
import { checkPassword ,loggout} from '../controllers/Loggin/loggincontroller.js';

const router = express.Router();


router.post('/', checkPassword); 
router.post('/out',loggout)

export default router;
