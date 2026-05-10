import { Router } from 'express';
import { getAdvisorySignal } from '../services/advisoriesService.js';

const router = Router();

router.get('/signal', async function (req, res, next) {
  try {
    const location = req.query.location;

    if (!location) {
      return res.status(400).json({ message: 'location is required' });
    }

    const signal = await getAdvisorySignal(location);
    return res.json(signal);
  } catch (error) {
    return next(error);
  }
});

export default router;
