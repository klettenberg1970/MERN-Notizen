import express from 'express';
import { checkPassword } from '../controllers/loggincontroller.js';

const router = express.Router();


router.post('/', checkPassword); 

export default router;
