import IResponseError from './IResponseError';
import ITeam from './ITeam';

interface ITeamsService {
  getAllTeams(): Promise<ITeam[]>,
  getTeamById(id: number): Promise<ITeam | IResponseError>,
}

export default ITeamsService;
