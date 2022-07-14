import IMatchesService from '../interfaces/IMatchesService';
import IMatchesRepository from '../interfaces/IMatchesRepository';
import IMatch from '../interfaces/IMatch';
import INewMatch from '../interfaces/INewMatch';
import IResponseError from '../interfaces/IResponseError';
import IMatchGoals from '../interfaces/IMatchGoals';
import ILeaderboardMatch from '../interfaces/ILeaderboardMatch';
import ILeaderBoard from '../interfaces/ILeaderBoard';

class MatchesService implements IMatchesService {
  constructor(
    private repository: IMatchesRepository,
    private teamId: number = 0,
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

  getTotalPoints(completedMatches: ILeaderboardMatch[]): number {
    const totalPoints: number = completedMatches.reduce((acc, curr) => {
      let points = 0;
      points += curr.homeTeam === this.teamId
      && curr.homeTeamGoals === curr.awayTeamGoals ? 1 : 0;

      points += curr.homeTeam === this.teamId
      && curr.homeTeamGoals > curr.awayTeamGoals ? 3 : 0;

      points += curr.awayTeam === this.teamId
      && curr.awayTeamGoals === curr.homeTeamGoals ? 1 : 0;

      points += curr.awayTeam === this.teamId
      && curr.awayTeamGoals > curr.homeTeamGoals ? 3 : 0;

      return acc + points;
    }, 0);
    return totalPoints;
  }

  getTotalVictories(completedMatches: ILeaderboardMatch[]): number {
    const totalVictories: number = completedMatches.reduce((acc, curr) => {
      let victories = 0;
      switch (true) {
        case curr.homeTeam === this.teamId && curr.homeTeamGoals > curr.awayTeamGoals:
          victories += 1;
          break;
        case curr.awayTeam === this.teamId && curr.awayTeamGoals > curr.homeTeamGoals:
          victories += 1;
          break;
        default:
          break;
      }
      return acc + victories;
    }, 0);
    return totalVictories;
  }

  getTotalDraws(completedMatches: ILeaderboardMatch[]): number {
    const totalDraws: number = completedMatches.reduce((acc, curr) => {
      let draws = 0;
      switch (true) {
        case curr.homeTeam === this.teamId && curr.homeTeamGoals === curr.awayTeamGoals:
          draws += 1;
          break;
        case curr.awayTeam === this.teamId && curr.awayTeamGoals === curr.homeTeamGoals:
          draws += 1;
          break;
        default:
          break;
      }
      return acc + draws;
    }, 0);
    return totalDraws;
  }

  getTotalLosses(completedMatches: ILeaderboardMatch[]): number {
    const totalLosses: number = completedMatches.reduce((acc, curr) => {
      let losses = 0;
      switch (true) {
        case curr.homeTeam === this.teamId && curr.homeTeamGoals < curr.awayTeamGoals:
          losses += 1;
          break;
        case curr.awayTeam === this.teamId && curr.awayTeamGoals < curr.homeTeamGoals:
          losses += 1;
          break;
        default:
          break;
      }
      return acc + losses;
    }, 0);
    return totalLosses;
  }

  getGoalsFavor(completedMatches: ILeaderboardMatch[]): number {
    const goalsFavor: number = completedMatches.reduce((acc, curr) => {
      let goals = 0;
      switch (true) {
        case curr.homeTeam === this.teamId:
          goals += curr.homeTeamGoals;
          break;
        case curr.awayTeam === this.teamId:
          goals += curr.awayTeamGoals;
          break;
        default:
          break;
      }
      return acc + goals;
    }, 0);
    return goalsFavor;
  }

  getGoalsOwn(completedMatches: ILeaderboardMatch[]): number {
    const goalsOwn: number = completedMatches.reduce((acc, curr) => {
      let goals = 0;
      switch (true) {
        case curr.homeTeam === this.teamId:
          goals += curr.awayTeamGoals;
          break;
        case curr.awayTeam === this.teamId:
          goals += curr.homeTeamGoals;
          break;
        default:
          break;
      }
      return acc + goals;
    }, 0);
    return goalsOwn;
  }

  getMatchLeaderdboardResult(
    resultObject: Omit<ILeaderBoard, 'goalsOwn' | 'goalsBalance' | 'efficiency'>,
    completedMatches: ILeaderboardMatch[],
  ): ILeaderBoard {
    const goalsOwn: number = this.getGoalsOwn(completedMatches);
    const { totalPoints, totalGames, goalsFavor } = resultObject;
    return {
      ...resultObject,
      goalsOwn,
      goalsBalance: goalsFavor - goalsOwn,
      efficiency: Math.round(((totalPoints / (totalGames * 3)) * 100) * 100) / 100,
    };
  }

  generateMatchLeaderboard(
    completedMatches: ILeaderboardMatch[],
    completedMatchObj: ILeaderboardMatch,
  ) {
    const { teamHomeName, homeTeamId } = completedMatchObj;
    this.teamId = homeTeamId;
    return this.getMatchLeaderdboardResult({
      name: teamHomeName,
      totalPoints: this.getTotalPoints(completedMatches),
      totalGames: completedMatches.length,
      totalVictories: this.getTotalVictories(completedMatches),
      totalDraws: this.getTotalDraws(completedMatches),
      totalLosses: this.getTotalLosses(completedMatches),
      goalsFavor: this.getGoalsFavor(completedMatches),
    }, completedMatches);
  }

  async getAllMatchesCompleted(matches: IMatch[]): Promise<ILeaderboardMatch[][]> {
    const allMatchesCompleted: ILeaderboardMatch[][] = await Promise.all(
      matches.map(async ({ homeTeam, teamHome: { teamName } }: IMatch) => {
        const completedMatches: Omit<IMatch[], 'teamHome' | 'teamAway'> = await this.repository
          .getCompletedMatchesOfATeam(homeTeam);
        return completedMatches
          .map((obj: IMatch) => ({ homeTeamId: homeTeam, teamHomeName: teamName, ...obj }));
      }),
    );
    return allMatchesCompleted;
  }

  formatLeaderboard(leaderboard: ILeaderBoard[]) {
    this.teamId = 0;
    const teamsName: string[] = leaderboard.map((elementObj) => elementObj.name);
    const teamsNameFormatted: string[] = [];
    teamsName.forEach((element: string) => {
      if (!teamsNameFormatted.includes(element)) teamsNameFormatted.push(element);
    });
    const leaderboardFormatted = leaderboard
      .filter((element: ILeaderBoard, index: number) => element.name === teamsNameFormatted[index]);
    leaderboardFormatted.sort((prev, curr) => prev.goalsOwn - curr.goalsOwn)
      .sort((prev, curr) => curr.goalsFavor - prev.goalsFavor)
      .sort((prev, curr) => curr.goalsBalance - prev.goalsBalance)
      .sort((prev, curr) => curr.totalVictories - prev.totalVictories);
    return leaderboardFormatted;
  }

  async getLeaderboard(): Promise<ILeaderBoard[]> {
    const queryParameters: { inProgress: boolean }[] = [{ inProgress: false }];
    const matches: IMatch[] = await this.repository.getAllMatches(queryParameters);
    const leaderboard: ILeaderBoard[] = [];
    const allMatchesCompleted: ILeaderboardMatch[][] = await this.getAllMatchesCompleted(matches);
    allMatchesCompleted.forEach((completedMatches: ILeaderboardMatch[]) => {
      completedMatches.forEach((completedMatchObj: ILeaderboardMatch, index: number) => {
        const result:
        ILeaderBoard = this.generateMatchLeaderboard(completedMatches, completedMatchObj);
        if (completedMatches.length - 1 === index) leaderboard.push(result);
      });
    });
    return this.formatLeaderboard(leaderboard);
  }
}

export default MatchesService;
