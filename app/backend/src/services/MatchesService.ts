import IMatchesService from '../interfaces/IMatchesService';
import IMatchesRepository from '../interfaces/IMatchesRepository';
import IMatch from '../interfaces/IMatch';

class MatchesService implements IMatchesService {
  constructor(private repository: IMatchesRepository) {}

  async getAllMatches(): Promise<IMatch[]> {
    const matches: IMatch[] = await this.repository.getAllMatches();
    return matches;
  }
}

export default MatchesService;
