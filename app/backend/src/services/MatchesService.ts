import IMatchesService from '../interfaces/IMatchesService';
import IMatchesRepository from '../interfaces/IMatchesRepository';
import IMatch from '../interfaces/IMatch';
import INewMatch from '../interfaces/INewMatch';

class MatchesService implements IMatchesService {
  constructor(private repository: IMatchesRepository) {}

  async getAllMatches(inProgress: string | undefined): Promise<IMatch[]> {
    let queryParameters: {
      inProgress: boolean,
    }[] = [{ inProgress: true }, { inProgress: false }];
    switch (inProgress) {
      case 'true':
        queryParameters = [{ inProgress: true }];
        break;
      case 'false':
        queryParameters = [{ inProgress: false }];
        break;
      default:
        break;
    }
    const matches: IMatch[] = await this.repository.getAllMatches(queryParameters);
    return matches;
  }

  async addMatch(body: INewMatch): Promise<INewMatch> {
    const newMatche: INewMatch = await this.repository.addMatch(body);
    return newMatche;
  }
}

export default MatchesService;
