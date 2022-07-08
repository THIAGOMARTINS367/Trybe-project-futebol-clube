import * as express from 'express';
import UsersController from './controllers/UsersController';
import UsersRepository from './repository/UsersRepository';
import UsersService from './services/UsersService';
import errorMiddleware from './middlewares/error';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();

    this.config();

    // Não remover essa rota
    this.app.get('/', (req, res) => res.json({ ok: true }));
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      // res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(accessControl);

    this.app.post(
      '/login',
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const repository = new UsersRepository();
        const service = new UsersService(repository);
        const controller = new UsersController(service);
        return controller.login(req, res, next);
      },
    );
  
    this.app.use(errorMiddleware);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
