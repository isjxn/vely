import express from 'express';
import getIndexController from '../controllers/index/getIndexController';

const router = express.Router();

router.get('/', getIndexController);

export const indexRoute = router;