import IMatch from './IMatch';
import INewMatch from './INewMatch';

interface IMatchesRepository {
  getAllMatches(queryParameters: { inProgress: boolean }[]): Promise<IMatch[]>,
  addMatch(newUserData: INewMatch): Promise<INewMatch>,
  editMatchProgress(id: number): Promise<number>,
}

export default IMatchesRepository;
