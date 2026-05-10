import { Router } from 'express';
import { getFloodSignal } from '../services/floodService.js';

const router = Router();

router.get('/signal', async function (req, res, next) {
  try {
    const location = req.query.location;

    if (!location) {
      return res.status(400).json({ message: 'location is required' });
    }

    const signal = await getFloodSignal(location);
    return res.json(signal);
  } catch (error) {
    return next(error);
  }
});

export default router;
