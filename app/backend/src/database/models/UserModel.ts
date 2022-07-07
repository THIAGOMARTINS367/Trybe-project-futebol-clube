import { Model, DataTypes } from 'sequelize';
import db from '.';
// import OtherModel from './OtherModel';

class UserModel extends Model {
  // public <campo>!: <tipo>;
  public username: string;
  public role: string;
  public email: string;
  public password: string;
}

UserModel.init({
  username: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
}, {
  // ... Outras configs
  underscored: true,
  sequelize: db,
  modelName: 'UserModel',
  timestamps: false,
});

export default UserModel;
