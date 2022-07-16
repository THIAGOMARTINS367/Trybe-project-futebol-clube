import ILeaderBoard from '../interfaces/ILeaderBoard';

const sortLeaderboard = (leaderboard: ILeaderBoard[]): ILeaderBoard[] => {
  const leaderboardFormatted: ILeaderBoard[] = leaderboard;
  leaderboardFormatted
    .sort((prev: ILeaderBoard, next: ILeaderBoard):
    number => next.totalPoints - prev.totalPoints
      || next.totalVictories - prev.totalVictories
      || next.goalsBalance - prev.goalsBalance
      || next.goalsFavor - prev.goalsFavor
      || next.goalsOwn - prev.goalsOwn);
  return leaderboardFormatted;
};

export default sortLeaderboard;
