import TeamsModel from '../database/models/TeamsModel';
import MatchesModel from '../database/models/MatchesModel';
import IMatchesRepository from '../interfaces/IMatchesRepository';
import IMatch from '../interfaces/IMatch';

class MatchesRepository implements IMatchesRepository {
  constructor(private model = MatchesModel) {}

  async getAllMatches(): Promise<IMatch[]> {
    const matches: IMatch[] = await this.model.findAll({
      include: [{
        model: TeamsModel,
        as: 'teamHome',
        attributes: { exclude: ['id'] },
      },
      {
        model: TeamsModel,
        as: 'teamAway',
        attributes: { exclude: ['id'] },
      }],
    });
    return matches;
  }
}

export default MatchesRepository;
