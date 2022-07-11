import ITeam from './ITeam';

interface ITeamsRepository {
  getAllTeams(): Promise<ITeam[]>,
}

export default ITeamsRepository;
