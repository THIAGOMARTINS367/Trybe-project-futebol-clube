import IMatch from './IMatch';
import INewMatch from './INewMatch';

interface IMatchesRepository {
  getAllMatches(queryParameters: { inProgress: boolean }[]): Promise<IMatch[]>,
  addMatch(newUserData: INewMatch): Promise<INewMatch>,
}

export default IMatchesRepository;
