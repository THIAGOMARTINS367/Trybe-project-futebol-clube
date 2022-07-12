import { Model, DataTypes } from 'sequelize';
import ITeam from '../../interfaces/ITeam';
import db from '.';
import TeamsModel from './TeamsModel';
// import OtherModel from './OtherModel';

class MatchesModel extends Model {
  // public <campo>!: <tipo>;
  public id: number;
  public homeTeam: number;
  public homeTeamGoals: number;
  public awayTeam: number;
  public awayTeamGoals: number;
  public inProgress: boolean;
  public teamHome: ITeam;
  public teamAway: ITeam;
}

MatchesModel.init({
  id: {
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  homeTeam: {
    allowNull: false,
    field: 'home_team',
    type: DataTypes.INTEGER,
  },
  homeTeamGoals: {
    allowNull: false,
    field: 'home_team_goals',
    type: DataTypes.INTEGER,
  },
  awayTeam: {
    allowNull: false,
    field: 'away_team',
    type: DataTypes.INTEGER,
  },
  awayTeamGoals: {
    allowNull: false,
    field: 'away_team_goals',
    type: DataTypes.INTEGER,
  },
  inProgress: {
    allowNull: false,
    field: 'in_progress',
    type: DataTypes.BOOLEAN,
  },
}, {
  // ... Outras configs
  underscored: true,
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
});

MatchesModel.belongsTo(TeamsModel, { foreignKey: 'homeTeam', as: 'teamHome' });
MatchesModel.belongsTo(TeamsModel, { foreignKey: 'awayTeam', as: 'teamAway' });

TeamsModel.hasMany(MatchesModel, { foreignKey: 'homeTeam', as: 'matchHome' });
TeamsModel.hasMany(MatchesModel, { foreignKey: 'awayTeam', as: 'matchAway' });

export default MatchesModel;
