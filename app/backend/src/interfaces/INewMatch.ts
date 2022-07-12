import IMatch from './IMatch';

interface INewMatch extends Omit<IMatch, 'id' | 'teamHome' | 'teamAway'> {
  id?: number,
}

export default INewMatch;
