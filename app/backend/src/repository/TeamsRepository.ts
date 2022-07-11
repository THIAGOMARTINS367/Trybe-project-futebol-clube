import ITeamsRepository from "../interfaces/ITeamsRepository";
import TeamsModel from "../database/models/TeamsModel";
import ITeam from "../interfaces/ITeam";

class TeamsRepository implements ITeamsRepository {
  constructor(private model = TeamsModel) {}

  async getAllTeams(): Promise<ITeam[]> {
    const teams: ITeam[] = await this.model.findAll();
    return teams;
  }
}

export default TeamsRepository;
