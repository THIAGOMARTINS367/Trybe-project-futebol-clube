import { Model, DataTypes } from 'sequelize';
import db from '.';
// import OtherModel from './OtherModel';

class TeamsModel extends Model {
  // public <campo>!: <tipo>;
  public id: number;
  public team_name: string;
}

TeamsModel.init({
  id: {
    primaryKey: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  team_name: {
    allowNull: false,
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
