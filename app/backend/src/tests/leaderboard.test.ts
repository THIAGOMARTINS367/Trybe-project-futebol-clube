import * as sinon from 'sinon';
import * as chai from 'chai';
import { before } from 'mocha';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import MatchesModel from '../database/models/MatchesModel';
import finishedMatches from './mocks/finishedMatches';
import homeTeamLeaderboard from './mocks/homeTeamLeaderboard';
import awayTeamLeaderboard from './mocks/awayTeamLeaderboard';
import generalLeaderboard from './mocks/generalLeaderboard';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testa as rotas "GET /leaderboard, /leaderboard/home e /leaderboard/away"', () => {
  before(async () => {
    sinon
      .stub(MatchesModel, 'findAll')
      .resolves(finishedMatches as unknown as MatchesModel[]);
  });

  after(()=>{
    (MatchesModel.findAll as sinon.SinonStub).restore();
  });

  it(`Uma requisição na rota GET /leaderboard/home retorna lista ordenada,
  baseado nas regras de ordenação pré-estabelecidas, das classificações dos
  times da casa (homeTeam)`, async () => {
    const chaiHttpResponse: Response = await chai.request(app)
      .get('/leaderboard/home');
    expect(chaiHttpResponse.body).to.be.eql(homeTeamLeaderboard);
    expect(chaiHttpResponse.status).to.be.equal(200);
  });

  it(`Uma requisição na rota GET /leaderboard/away retorna lista ordenada,
  baseado nas regras de ordenação pré-estabelecidas, das classificações dos
  times visitantes (awayTeam)`, async () => {
    const chaiHttpResponse: Response = await chai.request(app)
      .get('/leaderboard/away');
    expect(chaiHttpResponse.body).to.be.eql(awayTeamLeaderboard);
    expect(chaiHttpResponse.status).to.be.equal(200);
  });

  it(`Uma requisição na rota GET /leaderboard retorna lista ordenada,
  baseado nas regras de ordenação pré-estabelecidas, das classificações
  gerais dos times`, async () => {
    const chaiHttpResponse: Response = await chai.request(app)
      .get('/leaderboard');
    expect(chaiHttpResponse.body).to.be.eql(generalLeaderboard);
    expect(chaiHttpResponse.status).to.be.equal(200);
  });
});
