import * as express from 'express';
import loginRoutes from './loginRoutes';
import teamsRouter from './teamsRoutes';

const routes = express.Router();

routes.use('/login', loginRoutes);
routes.use('/teams', teamsRouter);

export default routes;
