import * as sinon from 'sinon';
import * as chai from 'chai';
import { before } from 'mocha';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import MatchesModel from '../database/models/MatchesModel';
import { validTokenForTests } from '../constants';
import allMatches from './mocks/allMatches';
import finishedMatches from './mocks/finishedMatches';
import matchesInProgress from './mocks/matchesInProgress';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testa a rota "GET /matches"', () => {
  before(async () => {
    sinon
      .stub(MatchesModel, 'findAll')
      .resolves(allMatches as any);
  });

  after(()=>{
    (MatchesModel.findAll as sinon.SinonStub).restore();
  });

  it(`Uma requisição na rota "GET /matches" retorna uma
  lista de todas as partidas sem nenhum filtro ativo`, async () => {
    const chaiHttpResponse: Response = await chai.request(app)
      .get('/matches');
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.eql(allMatches);
  });  
});

describe('Testa a rota "GET /matches"', () => {
  before(async () => {
    sinon
      .stub(MatchesModel, 'findAll')
      .resolves(matchesInProgress as any);
  });

  after(()=>{
    (MatchesModel.findAll as sinon.SinonStub).restore();
  });

  it(`Uma requisição na rota "GET /matches" filtrando as partidas para "em andamento"
  via query string (/matches?inProgress=true) retorna uma lista
  de partidas correspondentes à aquele filtro`, async () => {
    const chaiHttpResponse: Response = await chai.request(app)
      .get('/matches?inProgress=true');
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.eql(matchesInProgress);
  });
});

describe('Testa a rota "GET /matches"', () => {
  before(async () => {
    sinon
      .stub(MatchesModel, 'findAll')
      .resolves(finishedMatches as unknown as MatchesModel[]);
  });

  after(()=>{
    (MatchesModel.findAll as sinon.SinonStub).restore();
  });

  it(`Uma requisição na rota "GET /matches" filtrando as partidas para "finalizadas"
  via query string (/matches?inProgress=false) retorna uma lista
  de partidas correspondentes à aquele filtro`, async () => {
    const chaiHttpResponse: Response = await chai.request(app)
      .get('/matches?inProgress=false');
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.eql(finishedMatches);
  });
});

describe('Testa a rota "POST /matches"', () => {
  const matchCreated = {
    id: 49,
    homeTeam: 16,
    awayTeam: 8,
    homeTeamGoals: 2,
    awayTeamGoals: 2,
    inProgress: true,
  }
  const requestBody = {
    homeTeam: 16,
    awayTeam: 8,
    homeTeamGoals: 2,
    awayTeamGoals: 2,
  }
  before(async () => {
    sinon
      .stub(MatchesModel, 'create')
      .resolves(matchCreated as unknown as MatchesModel);
  });

  after(()=>{
    (MatchesModel.create as sinon.SinonStub).restore();
  });

  it(`Uma requisição na rota "POST /matches" passando as informações corretas
  de uma partida no body da requisição e um token válido retorna os dados
  da partida recém-criada`, async () => {
    const chaiHttpResponse: Response = await chai.request(app)
      .post('/matches').set('Authorization', validTokenForTests).send(requestBody);
    expect(chaiHttpResponse.body).to.be.eql(matchCreated);
    expect(chaiHttpResponse.status).to.be.equal(201);
  });
  it(`Uma requisição na rota "POST /matches" passando as informações corretas
  de uma partida no body da requisição e um token inválido retorna uma mensagem de erro`, async () => {
    const chaiHttpResponse: Response = await chai.request(app)
      .post('/matches').set('Authorization', `${validTokenForTests}E`).send(requestBody);
    expect(chaiHttpResponse.body).to.be.eql({ message: 'Token must be a valid token' });
    expect(chaiHttpResponse.status).to.be.equal(401);
  });
  it(`Uma requisição na rota "POST /matches" passando as informações corretas
  de uma partida no body da requisição mas, sem um token no header "Authorization"
  retorna uma mensagem de erro`, async () => {
    const chaiHttpResponse: Response = await chai.request(app)
      .post('/matches').set('Authorization', '').send(requestBody);
    expect(chaiHttpResponse.body).to.be.eql({ message: 'Token not found' });
    expect(chaiHttpResponse.status).to.be.equal(401);
  });
});

describe('Testa a rota "PATCH /matches/:id/finish"', () => {
  before(async () => {
    sinon
      .stub(MatchesModel, 'update')
      .resolves([1, MatchesModel] as unknown as [number, MatchesModel[]]);
  });

  after(()=>{
    (MatchesModel.update as sinon.SinonStub).restore();
  });

  it(`Uma requisição na rota "PATCH /matches/48/finish" passando o id
  de uma partida no parâmetro da rota retorna a mensagem "Finished"
  e status correto`, async () => {
    const chaiHttpResponse: Response = await chai.request(app)
      .patch('/matches/48/finish');
    expect(chaiHttpResponse.body).to.be.eql({ message: 'Finished' });
    expect(chaiHttpResponse.status).to.be.equal(200);
  });
});

describe('Testa a rota "PATCH /matches/:id"', () => {
  before(async () => {
    sinon
      .stub(MatchesModel, 'update')
      .resolves([1, MatchesModel] as unknown as [number, MatchesModel[]]);
  });

  after(()=>{
    (MatchesModel.update as sinon.SinonStub).restore();
  });

  const requestBody = {
    homeTeamGoals: 3,
    awayTeamGoals: 1,
  }

  const response = {
    id: 48,
    homeTeamGoals: 3,
    awayTeamGoals: 1,
  }

  it(`Uma requisição na rota "PATCH /matches/48" passando o id
  de uma partida no parâmetro da rota e os dados corretos no corpo da requisição
  retorna o id e os dados editados da partida`, async () => {
    const chaiHttpResponse: Response = await chai.request(app)
      .patch('/matches/48').send(requestBody);
    expect(chaiHttpResponse.body).to.be.eql(response);
    expect(chaiHttpResponse.status).to.be.equal(200);
  });
});
