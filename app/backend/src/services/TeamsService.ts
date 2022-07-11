import ITeam from '../interfaces/ITeam';
import ITeamsRepository from '../interfaces/ITeamsRepository';
import ITeamsService from '../interfaces/ITeamsService';

class TeamsService implements ITeamsService {
  constructor(private repository: ITeamsRepository) {}

  async getAllTeams(): Promise<ITeam[]> {
    const teams = await this.repository.getAllTeams();
    return teams;
  }
}

export default TeamsService;
