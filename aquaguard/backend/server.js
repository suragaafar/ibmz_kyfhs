import cors from 'cors';
import express from 'express';
import alertsRouter from './routes/alerts.js';
import advisoriesRouter from './routes/advisories.js';
import floodsRouter from './routes/floods.js';
import govAdvisoriesRouter from './routes/govAdvisories.js';
import newsRouter from './routes/news.js';
import reportsRouter from './routes/reports.js';
import weatherRouter from './routes/weather.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', function (_req, res) {
  res.json({ status: 'ok' });
});

app.use('/api/weather', weatherRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/advisories', advisoriesRouter);
app.use('/api/gov-advisories', govAdvisoriesRouter);
app.use('/api/floods', floodsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/news', newsRouter);

app.use(function (error, _req, res, _next) {
  console.error(error);
  res.status(500).json({
    message: error?.message || 'Internal server error'
  });
});

app.listen(port, function () {
  console.log(`AquaGuard backend listening on port ${port}`);
});
