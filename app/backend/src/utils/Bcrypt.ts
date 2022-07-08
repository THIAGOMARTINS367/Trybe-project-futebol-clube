import * as bcrypt from 'bcryptjs';

class Bcrypt {
  private saltRounds = 10;

  async encodePassword(password: string) {
    const saltRounds = await bcrypt.genSalt(this.saltRounds);
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  }

  decodeBcryptHash = async (password:string, hash: string) => {
    const isPassword = await bcrypt.compare(password, hash);
    return isPassword;
  };
}

export default Bcrypt;
