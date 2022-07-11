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

const AllMatches = [
  {
    id: 1,
    homeTeam: 16,
    homeTeamGoals: 1,
    awayTeam: 8,
    awayTeamGoals: 1,
    inProgress: false,
    teamHome: {
      teamName: 'São Paulo',
    },
    teamAway: {
      teamName: 'Grêmio',
    },
  },
  {
    id: 41,
    homeTeam: 16,
    homeTeamGoals: 2,
    awayTeam: 9,
    awayTeamGoals: 0,
    inProgress: true,
    teamHome: {
      teamName: 'São Paulo',
    },
    teamAway: {
      teamName: 'Internacional',
    },
  },
];

const matchesInProgress = [
  {
    id: 41,
    homeTeam: 16,
    homeTeamGoals: 2,
    awayTeam: 9,
    awayTeamGoals: 0,
    inProgress: true,
    teamHome: {
      teamName: 'São Paulo',
    },
    teamAway: {
      teamName: 'Internacional',
    },
  },
  {
    id: 42,
    homeTeam: 6,
    homeTeamGoals: 1,
    awayTeam: 1,
    awayTeamGoals: 0,
    inProgress: true,
    teamHome: {
      teamName: 'Ferroviária',
    },
    teamAway: {
      teamName: 'Avaí/Kindermann',
    },
  },
];

const finishedMatches = [
  {
    id: 1,
    homeTeam: 16,
    homeTeamGoals: 1,
    awayTeam: 8,
    awayTeamGoals: 1,
    inProgress: false,
    teamHome: {
      teamName: 'São Paulo',
    },
    teamAway: {
      teamName: 'Grêmio',
    },
  },
  {
    id: 2,
    homeTeam: 9,
    homeTeamGoals: 1,
    awayTeam: 14,
    awayTeamGoals: 1,
    inProgress: false,
    teamHome: {
      teamName: 'Internacional',
    },
    teamAway: {
      teamName: 'Santos',
    },
  },
];

describe('Testa a rota "GET /matches"', () => {
  before(async () => {
    sinon
      .stub(UsersModel, 'findAll')
      .resolves(AllMatches as any);
  });

  after(()=>{
    (UsersModel.findAll as sinon.SinonStub).restore();
  });

  it(`Uma requisição na rota "GET /matches" retorna uma
  lista de todas as partidas sem nenhum filtro ativo`, async () => {
    const chaiHttpResponse: Response = await chai.request(app)
      .get('/matches');
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.eql(AllMatches);
  });  
});

describe('Testa a rota "GET /matches"', () => {
  before(async () => {
    sinon
      .stub(UsersModel, 'findAll')
      .resolves(matchesInProgress as any);
  });

  after(()=>{
    (UsersModel.findAll as sinon.SinonStub).restore();
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
      .stub(UsersModel, 'findAll')
      .resolves(finishedMatches as any);
  });

  after(()=>{
    (UsersModel.findAll as sinon.SinonStub).restore();
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
