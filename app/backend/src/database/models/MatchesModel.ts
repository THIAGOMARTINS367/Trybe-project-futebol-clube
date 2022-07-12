import { Model, DataTypes } from 'sequelize';
import db from '.';
import TeamsModel from './TeamsModel';
// import OtherModel from './OtherModel';

class MatchesModel extends Model {
  // public <campo>!: <tipo>;
  public id: number;
  public home_team: number;
  public home_team_goals: number;
  public away_team: number;
  public away_team_goals: number;
  public in_progress: boolean;
}

MatchesModel.init({
  id: {
    primaryKey: true,
    allowNull: false,
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
    type: DataTypes.INTEGER,
  },
}, {
  // ... Outras configs
  underscored: true,
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
});

TeamsModel.belongsTo(MatchesModel, { foreignKey: 'home_team', as: 'matches'});
TeamsModel.belongsTo(MatchesModel, { foreignKey: 'away_team', as: 'matches'});


MatchesModel.hasMany(TeamsModel, { foreignKey: 'home_team', as: 'teams'});
MatchesModel.hasMany(TeamsModel, { foreignKey: 'away_team', as: 'teams'});

export default MatchesModel;
