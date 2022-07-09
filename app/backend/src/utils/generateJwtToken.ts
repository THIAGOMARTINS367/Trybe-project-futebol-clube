import * as jwt from 'jsonwebtoken';
import IUser from '../interfaces/IUser';
import { superSecret } from '../constants';

const generateJwtToken = (paylod: IUser): string => {
  const validity: string = process.env.TOKEN_VALIDITY || '7d';
  const jwtConfig: object = {
    expiresIn: validity,
    algorithm: 'HS256',
  };
  return jwt.sign({ data: paylod }, superSecret, jwtConfig);
};

export default generateJwtToken;
