import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import UserModel from '../database/models/UserModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testa a rota "/login"', () => {

  before(async () => {
    sinon
      .stub(UserModel, 'findAll')
      .resolves([{
        username: '',
        role: '',
        email: '',
        password: '',
      }] as UserModel[]);
    // sinon.stub(UserService, 'generateJwtToken')
    //   .callsFake(() => '');
  });

  after(()=>{
    (UserModel.findAll as sinon.SinonStub).restore();
  });

  const loginData = { email: 'user@user.com', password: 'secret_user' };

  it(`Uma requisição na rota "POST /login" passando email e password corretos
    retorna um "token" afirmando que o login foi efetuado`, async () => {
    const chaiHttpResponse: Response = await chai.request(app)
      .post('/login').send(loginData);
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.eql({ token: '' }); // ".eql()" serve para comparar objetos;
  });

  it(`Uma requisição na rota "POST /login" passando email correto e password que não existe
    retorna um objeto que contém o atributo "message" com uma mensagem de erro`, async () => {
    const requestBody = { ...loginData };
    requestBody.password = '1234567';
    const chaiHttpResponse: Response = await chai.request(app)
      .post('/login').send(loginData);
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.eql({ message: '' });
  });

  it(`Uma requisição na rota "POST /login" passando email que não existe e password correto
    retorna um objeto que contém o atributo "message" com uma mensagem de erro`, async () => {
    const requestBody = { ...loginData };
    requestBody.email = 'notEmail@email.com';
    const chaiHttpResponse: Response = await chai.request(app)
      .post('/login').send(loginData);
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.eql({ message: '' });
  });

  it(`Uma requisição na rota "POST /login" passando email inválido e password correto
    retorna um objeto que contém o atributo "message" com uma mensagem de erro`, async () => {
    const requestBody = { ...loginData };
    requestBody.email = 'useruser.com';
    const chaiHttpResponse: Response = await chai.request(app)
      .post('/login').send(loginData);
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.eql({ message: '' });
  });

  it(`Uma requisição na rota "POST /login" passando email correto e password inválido
    retorna um objeto que contém o atributo "message" com uma mensagem de erro`, async () => {
    const requestBody = { ...loginData };
    requestBody.password = '123456';
    const chaiHttpResponse: Response = await chai.request(app)
      .post('/login').send(loginData);
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.eql({ message: '' });
  });
});
