import { Model, DataTypes } from 'sequelize';
import db from '.';
// import OtherModel from './OtherModel';

class TeamsModel extends Model {
  // public <campo>!: <tipo>;
  public id: number;
  public teamName: string;
}

TeamsModel.init({
  id: {
    primaryKey: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  teamName: {
    allowNull: false,
    field: 'team_name',
    type: DataTypes.STRING,
  },
}, {
  // ... Outras configs
  underscored: true,
  sequelize: db,
  modelName: 'teams',
  timestamps: false,
});

export default TeamsModel;
