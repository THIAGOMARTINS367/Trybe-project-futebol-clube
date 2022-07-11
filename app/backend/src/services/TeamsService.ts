import IResponseError from '../interfaces/IResponseError';
import ITeam from '../interfaces/ITeam';
import ITeamsRepository from '../interfaces/ITeamsRepository';
import ITeamsService from '../interfaces/ITeamsService';

class TeamsService implements ITeamsService {
  constructor(private repository: ITeamsRepository) {}

  async getAllTeams(): Promise<ITeam[]> {
    const teams = await this.repository.getAllTeams();
    return teams;
  }

  async getTeamById(id: number): Promise<ITeam | IResponseError> {
    const team = await this.repository.getTeamById(id);
    if (!team) {
      return { error: { code: 404, message: `Team id ${id} does not exist` } };
    }
    return team;
  }
}

export default TeamsService;
