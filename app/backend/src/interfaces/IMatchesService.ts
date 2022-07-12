import IMatch from './IMatch';
import INewMatch from './INewMatch';

interface IMatchesService {
  getAllMatches(inProgress: string | undefined): Promise<IMatch[]>,
  addMatch(body: INewMatch): Promise<INewMatch>,
}

export default IMatchesService;
