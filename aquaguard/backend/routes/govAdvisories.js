import { Router } from 'express';
import { getGovernmentAdvisorySignal } from '../services/govAdvisoriesService.js';

const router = Router();

router.get('/signal', async function (req, res, next) {
  try {
    const location = req.query.location;

    if (!location) {
      return res.status(400).json({ message: 'location is required' });
    }

    const signal = await getGovernmentAdvisorySignal(location);
    return res.json(signal);
  } catch (error) {
    return next(error);
  }
});

export default router;
