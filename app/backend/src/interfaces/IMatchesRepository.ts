import IMatch from './IMatch';
import INewMatch from './INewMatch';
import ITeam from './ITeam';

interface IMatchesRepository {
  getAllMatches(queryParameters: { inProgress: boolean }[]): Promise<IMatch[]>,
  addMatch(newUserData: INewMatch): Promise<INewMatch>,
  editMatchProgress(id: number): Promise<number>,
  getTeamById(id: number): Promise<ITeam | null>,
}

export default IMatchesRepository;
