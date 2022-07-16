import IMatchesService from '../interfaces/IMatchesService';
import IMatchesRepository from '../interfaces/IMatchesRepository';
import IMatch from '../interfaces/IMatch';
import INewMatch from '../interfaces/INewMatch';
import IResponseError from '../interfaces/IResponseError';
import IMatchGoals from '../interfaces/IMatchGoals';
import ILeaderBoard from '../interfaces/ILeaderBoard';
import sortLeaderboard from '../utils/sortLeaderboard';
import { homeAwayTeam } from '../controllers/MatchesController';

type teamHomeAway = 'teamHome' | 'teamAway';
type PVDraws = { totalPoints: number, totalVictories: number, totalDraws: number };
type tGgFgoalsOwn = { totalGames: number, goalsFavor: number, goalsOwn: number };
type tPoTmatchesParameter = {
  teamParameterName: teamHomeAway,
  otherTeam: homeAwayTeam,
  matchesParameter: IMatch[],
};

class MatchesService implements IMatchesService {
  constructor(
    private repository: IMatchesRepository,
    private teamTypeParameter: homeAwayTeam = 'homeTeam',
  ) { }

  async getAllMatches(inProgress: string | undefined): Promise<IMatch[]> {
    let queryParameters: {
      inProgress: boolean,
    }[] = [{ inProgress: true }, { inProgress: false }];
    switch (inProgress) {
      case 'true':
        queryParameters = [{ inProgress: true }];
        break;
      case 'false':
        queryParameters = [{ inProgress: false }];
        break;
      default:
        break;
    }
    const matches: IMatch[] = await this.repository.getAllMatches(queryParameters);
    return matches;
  }

  async addMatch(body: INewMatch): Promise<INewMatch | IResponseError> {
    const { homeTeam, awayTeam } = body;
    if (homeTeam === awayTeam) {
      return {
        error: {
          code: 401,
          message: 'It is not possible to create a match with two equal teams',
        },
      };
    }
    const homeTeamExists = await this.repository.getTeamById(homeTeam);
    const awayTeamExists = await this.repository.getTeamById(awayTeam);
    if (!homeTeamExists || !awayTeamExists) {
      return { error: { code: 404, message: 'There is no team with such id!' } };
    }
    const newMatche: INewMatch = await this.repository.addMatch(body);
    return newMatche;
  }

  async editMatchProgress(id: number): Promise<{ message: 'Finished' } | IResponseError> {
    await this.repository.editMatchProgress(id);
    return { message: 'Finished' };
  }

  async updateMatch(id: number, body: IMatchGoals): Promise<IMatchGoals> {
    await this.repository.updateMatch(id, body);
    return { id, ...body };
  }

  getTotalPVDraws(otherTeams: homeAwayTeam, match: IMatch, matches: IMatch[]): PVDraws {
    const result: PVDraws = { totalPoints: 0, totalVictories: 0, totalDraws: 0 };
    matches.forEach((matchObj) => {
      const isMatchParameter: boolean = match[this.teamTypeParameter] === matchObj[
        this.teamTypeParameter
      ];
      const teamsParameterGoals: number = matchObj[`${this.teamTypeParameter}Goals`];
      if (isMatchParameter && teamsParameterGoals > matchObj[`${otherTeams}Goals`]) {
        result.totalPoints += 3;
        result.totalVictories += 1;
      }
      if (isMatchParameter && teamsParameterGoals === matchObj[`${otherTeams}Goals`]) {
        result.totalPoints += 1;
        result.totalDraws += 1;
      }
    });
    return result;
  }

  getTotalLosses(otherTeam: homeAwayTeam, match: IMatch, matches: IMatch[]): number {
    return matches.reduce((acc, curr: IMatch) => {
      let result = 0;
      const isMatchParameter: boolean = match[this.teamTypeParameter] === curr[
        this.teamTypeParameter
      ];
      if (isMatchParameter && curr[`${this.teamTypeParameter}Goals`] < curr[`${otherTeam}Goals`]) {
        result = 1;
      }
      return acc + result;
    }, 0);
  }

  getTotalGamesGoalsFavorAndOwns(
    otherTeam: homeAwayTeam,
    match: IMatch,
    matches: IMatch[],
  ): tGgFgoalsOwn {
    const result: tGgFgoalsOwn = { totalGames: 0, goalsFavor: 0, goalsOwn: 0 };
    matches.forEach((matchObj) => {
      const isMatchParameter: boolean = match[this.teamTypeParameter] === matchObj[
        this.teamTypeParameter
      ];
      if (isMatchParameter) {
        result.totalGames += 1;
        result.goalsFavor += matchObj[`${this.teamTypeParameter}Goals`];
        result.goalsOwn += matchObj[`${otherTeam}Goals`];
      }
    });
    return result;
  }

  calcLeaderboard(otherTeam: homeAwayTeam, match: IMatch, matches: IMatch[]):
  Omit<ILeaderBoard, 'name'> {
    const { totalPoints, totalVictories, totalDraws }: PVDraws = this
      .getTotalPVDraws(otherTeam, match, matches);
    const { totalGames, goalsFavor, goalsOwn }: tGgFgoalsOwn = this
      .getTotalGamesGoalsFavorAndOwns(otherTeam, match, matches);
    const totalLosses: number = this.getTotalLosses(otherTeam, match, matches);
    return {
      totalPoints,
      totalGames,
      totalVictories,
      totalDraws,
      totalLosses,
      goalsFavor,
      goalsOwn,
      goalsBalance: goalsFavor - goalsOwn,
      efficiency: Math.round(((totalPoints / (totalGames * 3)) * 100) * 100) / 100,
    };
  }

  determineTeamType(teamType: homeAwayTeam, matches: IMatch[]): tPoTmatchesParameter {
    this.teamTypeParameter = teamType;
    const teamParameterName: teamHomeAway = this.teamTypeParameter === 'homeTeam'
      ? 'teamHome' : 'teamAway';
    const otherTeam: homeAwayTeam = this.teamTypeParameter === 'homeTeam'
      ? 'awayTeam' : 'homeTeam';
    const matchesParameter: IMatch[] = matches.reduce((acc: IMatch[], curr: IMatch):
    IMatch[] => {
      const result: IMatch[] = acc;
      if (!acc.find((match) => match[this.teamTypeParameter] === curr[this.teamTypeParameter])) {
        result.push(curr);
      }
      return result;
    }, []);
    return { teamParameterName, otherTeam, matchesParameter };
  }

  async getLeaderboard(teamType: homeAwayTeam): Promise<ILeaderBoard[]> {
    const queryParameters: { inProgress: boolean }[] = [{ inProgress: false }];
    const matches: IMatch[] = await this.repository.getAllMatches(queryParameters);
    const { teamParameterName, otherTeam, matchesParameter }:
    tPoTmatchesParameter = this.determineTeamType(teamType, matches);
    const leaderboard: ILeaderBoard[] = matchesParameter.map((match) => {
      const calcLeaderboard:
      Omit<ILeaderBoard, 'name'> = this.calcLeaderboard(otherTeam, match, matches);
      return {
        name: match[teamParameterName].teamName,
        ...calcLeaderboard,
      };
    });
    return sortLeaderboard(leaderboard);
  }
}

export default MatchesService;
