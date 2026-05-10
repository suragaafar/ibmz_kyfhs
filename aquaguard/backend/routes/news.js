import { Router } from 'express';
import { searchWaterIncidentNews } from '../services/newsService.js';

const router = Router();

router.get('/search', async function (req, res, next) {
  try {
    const { city, province } = req.query;

    if (!city || !province) {
      return res.status(400).json({ message: 'city and province query parameters are required' });
    }

    const articles = await searchWaterIncidentNews(city, province);
    return res.json({ city, province, articles, count: articles.length });
  } catch (error) {
    return next(error);
  }
});

export default router;
