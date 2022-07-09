import * as express from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';
import IUser from '../interfaces/IUser';
import { superSecret } from '../constants';
import IJwtToken from '../interfaces/IJwtToken';

class TokenAuthenticator {
  constructor(
    private req: express.Request,
    private next: express.NextFunction,
  ) {}

  validateJwtToken(): void {
    const { headers } = this.req;
    const { authorization } = headers;
    const token: string | undefined = authorization;
    if (!token) {
      return this.next({ error: { code: 401, message: 'Token not found' } });
    }
    try {
      const decoded: string | JwtPayload = verify(token, superSecret);
      const { data } = decoded as IJwtToken;
      const userData = { ...data } as IUser;
      this.req.headers = { ...this.req.headers, userData: JSON.stringify(userData) };
      this.next();
    } catch (error) {
      this.next({ error: { code: 401, message: 'Invalid token' } });
    }
  }
}

export default TokenAuthenticator;
