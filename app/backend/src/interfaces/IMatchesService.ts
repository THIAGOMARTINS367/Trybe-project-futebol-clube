import IMatch from './IMatch';

interface IMatchesService {
  getAllMatches(inProgress: string | undefined): Promise<IMatch[]>,
}

export default IMatchesService;
