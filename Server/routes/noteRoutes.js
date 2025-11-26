import express from 'express';
import { getNotizen , createNotizen, deleteNotizen, editNotizen} from '../controllers/Notizen/notecontroller.js';


const router = express.Router();


router.get('/',getNotizen);

router.post('/add', createNotizen); 

router.delete('/delete/:id', deleteNotizen);

router.put('/edit', editNotizen);


export default router;