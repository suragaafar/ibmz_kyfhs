import { Router } from 'express';
import { searchWaterIncidentNews, searchWaterIncidentNewsForLocation } from '../services/newsService.js';

const router = Router();

router.get('/search', async function (req, res, next) {
  try {
    const location = req.query.location;
    const { city, province } = req.query;

    if (location) {
      const articles = await searchWaterIncidentNewsForLocation(String(location));
      return res.json({ location: String(location).trim(), articles, count: articles.length });
    }

    if (!city) {
      return res.status(400).json({ message: 'Provide location=City, Region or both city and province query parameters' });
    }

    const articles = await searchWaterIncidentNews(String(city), province ? String(province) : '');
    return res.json({ city, province: province || '', articles, count: articles.length });
  } catch (error) {
    return next(error);
  }
});

export default router;
