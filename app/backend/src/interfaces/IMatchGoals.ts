import IMatch from './IMatch';

interface IMatchGoals extends
  Omit<IMatch, 'id' | 'homeTeam' | 'awayTeam' | 'inProgress' | 'teamHome' | 'teamAway'> {
  id?: number,
}

export default IMatchGoals;
