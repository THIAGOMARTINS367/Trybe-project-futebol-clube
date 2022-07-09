import IUser from './IUser';

interface IJwtToken {
  data: IUser,
  iat: number,
  exp: number
}

export default IJwtToken;
