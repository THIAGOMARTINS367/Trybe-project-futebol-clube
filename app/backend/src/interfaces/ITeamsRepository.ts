import ITeam from './ITeam';

interface ITeamsRepository {
  getAllTeams(): Promise<ITeam[]>,
  getTeamById(id: number): Promise<ITeam | null>,
}

export default ITeamsRepository;
