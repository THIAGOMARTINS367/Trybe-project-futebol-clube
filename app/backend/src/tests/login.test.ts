import * as sinon from 'sinon';
import * as chai from 'chai';
import { before } from 'mocha';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import UsersModel from '../database/models/UsersModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testa a rota "/login"', () => {

  before(async () => {
    sinon
      .stub(UsersModel, 'findAll')
      .resolves([{
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
  const INVALID_EMAIL_OR_PASSWORD = 'Invalid email or password !';

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
    expect(chaiHttpResponse.body).to.be.eql({ message: INVALID_EMAIL_OR_PASSWORD }); // ".eql()" serve para comparar objetos;
  });

  it(`Uma requisição na rota "POST /login" passando email inválido e password correto
    retorna um objeto que contém o atributo "message" com uma mensagem de erro`, async () => {
    const requestBody = { ...loginData };
    requestBody.email = 'useruser.com';
    const chaiHttpResponse: Response = await chai.request(app)
      .post('/login').send(requestBody);
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.eql({ message: '' });
  });

  it(`Uma requisição na rota "POST /login" passando email correto e password inválido
    retorna um objeto que contém o atributo "message" com uma mensagem de erro`, async () => {
    const requestBody = { ...loginData };
    requestBody.password = '123456';
    const chaiHttpResponse: Response = await chai.request(app)
      .post('/login').send(requestBody);
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.eql({ message: '' });
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
  const INVALID_EMAIL_OR_PASSWORD = 'Invalid email or password !';

  it(`Uma requisição na rota "POST /login" passando email que não existe e password correto
    retorna um objeto que contém o atributo "message" com uma mensagem de erro`, async () => {
    const requestBody = { ...loginData };
    requestBody.email = 'notEmail@email.com';
    const chaiHttpResponse: Response = await chai.request(app)
      .post('/login').send(requestBody);
    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.be.eql({ message: INVALID_EMAIL_OR_PASSWORD });
  });
});
