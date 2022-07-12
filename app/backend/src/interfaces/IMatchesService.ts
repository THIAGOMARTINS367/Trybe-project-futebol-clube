import IMatch from './IMatch';

interface IMatchesService {
  getAllMatches(): Promise<IMatch[]>,
}

export default IMatchesService;
