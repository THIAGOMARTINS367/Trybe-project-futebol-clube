import { Model, STRING } from 'sequelize';
import db from '.';
// import OtherModel from './OtherModel';

class UserModel extends Model {
  // public <campo>!: <tipo>;
}

UserModel.init({
  username: STRING,
  role: STRING,
  email: STRING,
  password: STRING,
}, {
  // ... Outras configs
  underscored: true,
  sequelize: db,
  modelName: 'UserModel',
  timestamps: false,
});

export default UserModel;
