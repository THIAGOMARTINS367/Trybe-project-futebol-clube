import { Op } from 'sequelize';
import TeamsModel from '../database/models/TeamsModel';
import MatchesModel from '../database/models/MatchesModel';
import IMatchesRepository from '../interfaces/IMatchesRepository';
import IMatch from '../interfaces/IMatch';
import INewMatch from '../interfaces/INewMatch';
import ITeam from '../interfaces/ITeam';
import IMatchGoals from '../interfaces/IMatchGoals';

class MatchesRepository implements IMatchesRepository {
  constructor(
    private model = MatchesModel,
    private teamsModel = TeamsModel,
  ) {}

  async getAllMatches(queryParameters: { inProgress: boolean }[]): Promise<IMatch[]> {
    const matches: IMatch[] = await this.model.findAll({
      where: { [Op.or]: queryParameters },
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

  async addMatch(newUserData: INewMatch): Promise<INewMatch> {
    const newMatche: MatchesModel = await this.model.create({
      ...newUserData,
      inProgress: true,
    });
    return newMatche.toJSON() as INewMatch;
  }

  async editMatchProgress(id: number): Promise<number> {
    const alteredLines: [number, IMatch[]] = await this.model.update(
      { inProgress: false },
      { where: { id } },
    );
    return alteredLines[0];
  }

  async getTeamById(id: number): Promise<ITeam | null> {
    const match: TeamsModel | null = await this.teamsModel.findByPk(id);
    return match ? match.toJSON() as ITeam : match as null;
  }

  async updateMatch(id: number, { homeTeamGoals, awayTeamGoals }: IMatchGoals): Promise<number> {
    const alteredLines = await this.model.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id, inProgress: true } },
    ) as number[];
    return alteredLines[0];
  }
}

export default MatchesRepository;
