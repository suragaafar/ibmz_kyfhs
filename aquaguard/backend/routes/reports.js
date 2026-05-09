import { Router } from 'express';
import { getReportsByLocation, createReport } from '../services/reportsService.js';

const router = Router();

router.get('/', function (req, res) {
  const location = req.query.location;

  const reports = getReportsByLocation(location);
  return res.json(reports);
});

router.post('/', function (req, res) {
  const { location, issueType, description } = req.body;

  if (!location || !issueType || !description) {
    return res.status(400).json({ message: 'location, issueType, and description are required' });
  }

  const report = createReport(location, issueType, description);

  return res.status(201).json(report);
});

export default router;
