import * as express from 'express';
import leaderboardRoutes from './leaderboardRoutes';
import loginRoutes from './loginRoutes';
import matchesRouter from './matchesRoutes';
import teamsRouter from './teamsRoutes';

const routes = express.Router();

routes.use('/login', loginRoutes);
routes.use('/teams', teamsRouter);
routes.use('/matches', matchesRouter);
routes.use('/leaderboard', leaderboardRoutes);

export default routes;
