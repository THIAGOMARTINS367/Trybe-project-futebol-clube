import IMatch from './IMatch';

interface IMatchesRepository {
  getAllMatches(): Promise<IMatch[]>,
}

export default IMatchesRepository;
