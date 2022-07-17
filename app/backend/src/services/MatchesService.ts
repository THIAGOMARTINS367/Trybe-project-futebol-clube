import IMatchesService from '../interfaces/IMatchesService';
import IMatchesRepository from '../interfaces/IMatchesRepository';
import IMatch from '../interfaces/IMatch';
import INewMatch from '../interfaces/INewMatch';
import IResponseError from '../interfaces/IResponseError';
import IMatchGoals from '../interfaces/IMatchGoals';
import ILeaderBoard from '../interfaces/ILeaderBoard';
import sortLeaderboard from '../utils/sortLeaderboard';
import { homeAwayTeam, teamHomeAway } from '../types/types';
import IPVDraws from '../interfaces/IPVDraws';
import ItGgFgoalsOwn from '../interfaces/ItGgFgoalsOwn';
import ItPoTmatchesParameter from '../interfaces/ItPoTmatchesParameter';

class MatchesService implements IMatchesService {
  constructor(
    private repository: IMatchesRepository,
    private teamTypeParameter: homeAwayTeam = 'homeTeam',
    private elementIndex: number = 0,
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

  getTotalPVDraws(otherTeams: homeAwayTeam, match: IMatch, matches: IMatch[]): IPVDraws {
    const result: IPVDraws = { totalPoints: 0, totalVictories: 0, totalDraws: 0 };
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
  ): ItGgFgoalsOwn {
    const result: ItGgFgoalsOwn = { totalGames: 0, goalsFavor: 0, goalsOwn: 0 };
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
    const { totalPoints, totalVictories, totalDraws }: IPVDraws = this
      .getTotalPVDraws(otherTeam, match, matches);
    const { totalGames, goalsFavor, goalsOwn }: ItGgFgoalsOwn = this
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

  determineTeamType(teamType: homeAwayTeam, matches: IMatch[]): ItPoTmatchesParameter {
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
    ItPoTmatchesParameter = this.determineTeamType(teamType, matches);
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

  calculateOverallScore(scoreboards: ILeaderBoard[], currScoreboard: ILeaderBoard): ILeaderBoard {
    const totalPoints: number = scoreboards[this.elementIndex].totalPoints
      + currScoreboard.totalPoints;
    const totalGames: number = scoreboards[this.elementIndex].totalGames
      + currScoreboard.totalGames;
    return {
      ...scoreboards[this.elementIndex],
      totalPoints,
      totalGames: scoreboards[this.elementIndex].totalGames + currScoreboard.totalGames,
      totalVictories: scoreboards[this.elementIndex].totalVictories + currScoreboard.totalVictories,
      totalDraws: scoreboards[this.elementIndex].totalDraws + currScoreboard.totalDraws,
      totalLosses: scoreboards[this.elementIndex].totalLosses + currScoreboard.totalLosses,
      goalsFavor: scoreboards[this.elementIndex].goalsFavor + currScoreboard.goalsFavor,
      goalsOwn: scoreboards[this.elementIndex].goalsOwn + currScoreboard.goalsOwn,
      goalsBalance: scoreboards[this.elementIndex].goalsBalance + currScoreboard.goalsBalance,
      efficiency: Math.round(((totalPoints / (totalGames * 3)) * 100) * 100) / 100,
    };
  }

  async getGeneralLeaderboard(): Promise<ILeaderBoard[]> {
    const homeTeamsLeaderboard: ILeaderBoard[] = await this.getLeaderboard('homeTeam');
    const awayTeamsLeaderboard: ILeaderBoard[] = await this.getLeaderboard('awayTeam');
    let generalLeaderboardTeams:
    ILeaderBoard[] = [...homeTeamsLeaderboard, ...awayTeamsLeaderboard];
    generalLeaderboardTeams = generalLeaderboardTeams
      .reduce((acc: ILeaderBoard[], curr: ILeaderBoard): ILeaderBoard[] => {
        const result: ILeaderBoard[] = [...acc];
        if (!result.find((elementObj): boolean => elementObj.name === curr.name)) {
          result.push(curr);
        } else {
          this.elementIndex = result.findIndex((scoreboardObj) => scoreboardObj.name === curr.name);
          result[this.elementIndex] = this.calculateOverallScore(result, curr);
        }
        return result;
      }, []);
    return sortLeaderboard(generalLeaderboardTeams);
  }
}

export default MatchesService;
