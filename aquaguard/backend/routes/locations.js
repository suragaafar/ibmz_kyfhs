import { Router } from 'express';
import { cityCoordinates } from '../data/cityCoordinates.js';

const router = Router();

router.get('/cities', function (_req, res) {
  const cities = Object.keys(cityCoordinates).sort();
  const countries = Array.from(new Set(Object.values(cityCoordinates).map((city) => city.country))).sort();

  return res.json({
    cities,
    countries
  });
});

export default router;
