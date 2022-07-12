import IMatch from './IMatch';

interface IMatchesRepository {
  getAllMatches(queryParameters: { inProgress: boolean }[]): Promise<IMatch[]>,
}

export default IMatchesRepository;
