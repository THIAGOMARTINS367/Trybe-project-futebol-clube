import { Model, DataTypes } from 'sequelize';
import db from '.';
// import OtherModel from './OtherModel';

class UsersModel extends Model {
  // public <campo>!: <tipo>;
  public id: number;
  public username: string;
  public role: string;
  public email: string;
  public password: string;
}

UsersModel.init({
  id: {
    primaryKey: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  username: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  role: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
  },
}, {
  // ... Outras configs
  underscored: true,
  sequelize: db,
  modelName: 'users',
  timestamps: false,
});

export default UsersModel;
