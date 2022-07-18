import * as sinon from 'sinon';
import * as chai from 'chai';
import { before } from 'mocha';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import TeamsModel from '../database/models/TeamsModel';
import allTeams from './mocks/allTeams';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testa a rota "GET /teams"', () => {
  before(async () => {
    sinon
      .stub(TeamsModel, 'findAll')
      .resolves(allTeams as unknown as TeamsModel[]);
  });

  after(()=>{
    (TeamsModel.findAll as sinon.SinonStub).restore();
  });

  it(`Uma requisição na rota "GET /teams" retorna lista de todos
  times no banco de dados`, async () => {
    const chaiHttpResponse: Response = await chai.request(app)
      .get('/teams');
    expect(chaiHttpResponse.body).to.be.eql(allTeams);
    expect(chaiHttpResponse.status).to.be.equal(200);
  });
});

describe('Testa a rota "GET /teams/:id"', () => {
  const team = {
    id: 1,
    teamName: 'Avaí/Kindermann',
  };
  before(async () => {
    sinon
      .stub(TeamsModel, 'findByPk')
      .resolves(team as unknown as TeamsModel);
  });

  after(()=>{
    (TeamsModel.findByPk as sinon.SinonStub).restore();
  });

  it(`Uma requisição na rota "GET /teams/1" retorna dados
  do time que possui o id passado no parâmetro da rota`, async () => {
    const chaiHttpResponse: Response = await chai.request(app)
      .get('/teams/1');
    expect(chaiHttpResponse.body).to.be.eql(team);
    expect(chaiHttpResponse.status).to.be.equal(200);
  });
});
