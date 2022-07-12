import ITeam from './ITeam';

interface IMatch {
  id: number,
  homeTeam: number,
  homeTeamGoals: number,
  awayTeam: number,
  awayTeamGoals: number,
  inProgress: boolean,
  teamHome: Omit<ITeam, 'id'>,
  teamAway: Omit<ITeam, 'id'>,
}

export default IMatch;
