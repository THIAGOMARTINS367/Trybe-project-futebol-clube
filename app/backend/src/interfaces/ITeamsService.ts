import ITeam from './ITeam';

interface ITeamsService {
  getAllTeams(): Promise<ITeam[]>,
}

export default ITeamsService;
