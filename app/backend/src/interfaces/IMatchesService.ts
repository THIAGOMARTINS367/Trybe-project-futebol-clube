import IMatch from './IMatch';
import INewMatch from './INewMatch';
import IResponseError from './IResponseError';

interface IMatchesService {
  getAllMatches(inProgress: string | undefined): Promise<IMatch[]>,
  addMatch(body: INewMatch): Promise<INewMatch | IResponseError>,
  editMatchProgress(id: number): Promise<{ message: 'Finished' } | IResponseError>,
}

export default IMatchesService;
