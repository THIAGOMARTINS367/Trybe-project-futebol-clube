import IMatchesService from '../interfaces/IMatchesService';
import IMatchesRepository from '../interfaces/IMatchesRepository';
import IMatch from '../interfaces/IMatch';
import INewMatch from '../interfaces/INewMatch';
import IResponseError from '../interfaces/IResponseError';

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

  async addMatch(body: INewMatch): Promise<INewMatch | IResponseError> {
    const { homeTeam, awayTeam } = body;
    if (homeTeam === awayTeam) {
      return { error: {
        code: 401,
        message: 'It is not possible to create a match with two equal teams',
      } };
    }
    const homeTeamExists = await this.repository.getTeamById(homeTeam);
    const awayTeamExists = await this.repository.getTeamById(awayTeam);
    if (!homeTeamExists || !awayTeamExists) {
      return { error: { code: 404, message: 'There is no team with such id!' } };
    }
    const newMatche: INewMatch = await this.repository.addMatch(body);
    return newMatche;
  }

  async editMatchProgress(id: number): Promise<{ message: 'Finished' } | IResponseError> {
    const alteredLines = await this.repository.editMatchProgress(id);
    if (alteredLines === 0) {
      return { error: { code: 500, message: `Unable to finish match ${id}` } };
    }
    return { message: 'Finished' };
  }
}

export default MatchesService;
