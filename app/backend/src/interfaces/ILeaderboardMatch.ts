import IMatch from './IMatch';

interface ILeaderboardMatch extends Omit<IMatch, 'teamHome' | 'teamAway'> {
  homeTeamId: number,
  teamHomeName: string,
}

export default ILeaderboardMatch;
