import { Router } from 'express';
import { getWeatherSignal } from '../services/weatherService.js';

const router = Router();

router.get('/signal', async function (req, res, next) {
  try {
    const location = req.query.location;

    if (!location) {
      return res.status(400).json({ message: 'location is required' });
    }

    const signal = await getWeatherSignal(location);

    if (!signal) {
      return res.status(404).json({ message: 'No weather coordinates available for this location' });
    }

    return res.json(signal);
  } catch (error) {
    return next(error);
  }
});

export default router;
