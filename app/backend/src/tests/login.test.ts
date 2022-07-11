import * as sinon from 'sinon';
import * as chai from 'chai';
import { before } from 'mocha';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import UsersModel from '../database/models/UsersModel';

import { Response } from 'superagent';
import { validTokenForTests } from '../constants';

chai.use(chaiHttp);

const { expect } = chai;

const INCORRECT_EMAIL_OR_PASSWORD = 'Incorrect email or password';

describe('Testa a rota "POST /login"', () => {

  before(async () => {
    sinon
      .stub(UsersModel, 'findAll')
      .resolves([{
        id: 2,
        username: 'User',
        role: 'user',
        email: 'user@user.com',
        password: '$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO',
      }] as UsersModel[]);
  });

  after(()=>{
    (UsersModel.findAll as sinon.SinonStub).restore();
  });

  const loginData = { email: 'user@user.com', password: 'secret_user' };

  it(`Uma requisição na rota "POST /login" passando email e password corretos
    retorna um "token" afirmando que o login foi efetuado`, async () => {
    const chaiHttpResponse: Response = await chai.request(app)
      .post('/login').send(loginData);
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.have.a.property('token');
  });

  it(`Uma requisição na rota "POST /login" passando email correto e password que não existe
    retorna um objeto que contém o atributo "message" com uma mensagem de erro`, async () => {
    const requestBody = { ...loginData };
    requestBody.password = '1234567';
    const chaiHttpResponse: Response = await chai.request(app)
      .post('/login').send(requestBody);
    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.be.eql({ message: INCORRECT_EMAIL_OR_PASSWORD }); // ".eql()" serve para comparar objetos;
  });

  it(`Uma requisição na rota "POST /login" passando email inválido e password correto
    retorna um objeto que contém o atributo "message" com uma mensagem de erro`, async () => {
    const requestBody = { ...loginData };
    requestBody.email = 'useruser.com';
    const chaiHttpResponse: Response = await chai.request(app)
      .post('/login').send(requestBody);
    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.eql({ message: '\"email\" must be a valid email' });
  });

  it(`Uma requisição na rota "POST /login" passando email correto e password inválido
    retorna um objeto que contém o atributo "message" com uma mensagem de erro`, async () => {
    const requestBody = { ...loginData };
    requestBody.password = '123456';
    const chaiHttpResponse: Response = await chai.request(app)
      .post('/login').send(requestBody);
    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.eql({ message: '\"password\" length must be at least 7 characters long' });
  });

  it(`Uma requisição na rota "POST /login" passando email vazio e password correto
    retorna um objeto que contém o atributo "message" com uma mensagem de erro`, async () => {
    const requestBody = { ...loginData };
    requestBody.email = '';
    const chaiHttpResponse: Response = await chai.request(app)
      .post('/login').send(requestBody);
    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.eql({ message: 'All fields must be filled' });
  });

  it(`Uma requisição na rota "POST /login" passando somente o atributo password, correto,
    retorna um objeto que contém o atributo "message" com uma mensagem de erro`, async () => {
    const { password } = loginData;
    const requestBody = { password };
    const chaiHttpResponse: Response = await chai.request(app)
      .post('/login').send(requestBody);
    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.eql({ message: 'All fields must be filled' });
  });

  it(`Uma requisição na rota "POST /login" passando email correto e password vazio
    retorna um objeto que contém o atributo "message" com uma mensagem de erro`, async () => {
    const requestBody = { ...loginData };
    requestBody.password = '';
    const chaiHttpResponse: Response = await chai.request(app)
      .post('/login').send(requestBody);
    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.eql({ message: 'All fields must be filled' });
  });

  it(`Uma requisição na rota "POST /login" passando somente o atributo email, correto,
    retorna um objeto que contém o atributo "message" com uma mensagem de erro`, async () => {
    const requestBody = { email: loginData.email };
    const chaiHttpResponse: Response = await chai.request(app)
      .post('/login').send(requestBody);
    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.be.eql({ message: 'All fields must be filled' });
  });
});

describe('Testa a rota "/login"', () => {
  before(async () => {
    sinon
      .stub(UsersModel, 'findAll')
      .resolves([]);
  });

  after(()=>{
    (UsersModel.findAll as sinon.SinonStub).restore();
  });

  const loginData = { email: 'user@user.com', password: 'secret_user' };

  it(`Uma requisição na rota "POST /login" passando email que não existe e password correto
    retorna um objeto que contém o atributo "message" com uma mensagem de erro`, async () => {
    const requestBody = { ...loginData };
    requestBody.email = 'notEmail@email.com';
    const chaiHttpResponse: Response = await chai.request(app)
      .post('/login').send(requestBody);
    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.be.eql({ message: INCORRECT_EMAIL_OR_PASSWORD });
  });
});

describe('Testa a rota "GET /login/validate"', () => {
  before(async () => {
    sinon
      .stub(UsersModel, 'findByPk')
      .resolves({
        id: 2,
        username: 'User',
        role: 'user',
        email: 'user@user.com',
        password: '$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO',
      } as UsersModel);
  });

  after(()=>{
    (UsersModel.findByPk as sinon.SinonStub).restore();
  });

  it(`Uma requisição na rota "GET /login/validate" passando o token correto no
  header "Authorization" retorna a função (role) daquele determinado usuário`, async () => {
    const chaiHttpResponse: Response = await chai.request(app)
      .get('/login/validate').set('Authorization', validTokenForTests);
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.eql({ role: 'user' });
  });

  it(`Uma requisição na rota "GET /login/validate" passando nunhum token no
  header "Authorization" retorna uma mensagem de erro`, async () => {
    const chaiHttpResponse: Response = await chai.request(app)
      .get('/login/validate');
    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.be.eql({ message: 'Token not found' });
  });

  it(`Uma requisição na rota "GET /login/validate" passando um token inválido no
  header "Authorization" retorna uma mensagem de erro`, async () => {
    const chaiHttpResponse: Response = await chai.request(app)
      .get('/login/validate').set('Authorization', `${validTokenForTests}E`);;
    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.be.eql({ message: 'Invalid token' });
  });
});
