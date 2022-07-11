import * as express from 'express';
import loginRoutes from './loginRoutes';

const routes = express.Router();

routes.use('/login', loginRoutes);

export default routes;
