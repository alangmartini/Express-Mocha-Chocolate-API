const chaiHttp = require('chai-http');
const sinon = require('sinon');
const chai = require('chai');
const fs = require('fs/promises');
const app = require('../app');
const INITIAL_CHOCOLATES_MOCK = require('./mocks/chocolateMock');

chai.use(chaiHttp);
const { expect } = chai;

let chocolatesMOCK = INITIAL_CHOCOLATES_MOCK;

let stubRead;
let stubWrite;
beforeEach(() => {
  stubRead = sinon.stub(fs, 'readFile').resolves(JSON.stringify(chocolatesMOCK));
  stubWrite = sinon.stub(fs, 'writeFile').callsFake((_path, stringifiedArray) => {
    chocolatesMOCK = JSON.parse(stringifiedArray);
  });
});

afterEach(() => {
  chocolatesMOCK = INITIAL_CHOCOLATES_MOCK;
  sinon.restore();
});

describe('Testa se lista todos os chocolates', () => {
  it('Se é listado todos os chocolate em GET /chocolates', async () => {
    const response = await chai
      .request(app)
      .get('/chocolates');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(chocolatesMOCK.chocolates);
    expect(stubRead.callCount).to.equal(1);
    expect(stubRead.args).to.deep.equal([
      ['/app/chocolates/data/chocolates.txt', 'utf8'],
    ]);
  });
});

describe('Testa atualização', () => {
  it('Se realiza a atualização em PUT /chocolates/:id', async () => {
    const newChocolate = {
      id: '1',
      name: 'Most sweet and definately sour Chocolate',
      price: 9999,
    };

    const oldChocolates = INITIAL_CHOCOLATES_MOCK.chocolates.slice(1);
    const updatedChocolates = [newChocolate, ...oldChocolates];

    const response = await chai
      .request(app)
      .put('/chocolates/1')
      .send(newChocolate);

    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal({
      message: 'Sucessfully updated chocolate',
      status: 200,
      chocolate: newChocolate,
    });
    expect(chocolatesMOCK.chocolates).to.deep.equal(updatedChocolates);
    expect(stubRead.callCount).to.equal(1);
    expect(stubWrite.callCount).to.equal(1);
  });
});

describe('Testa se a adição à database está funcionando corretamente', () => {
  it('Se é realizado a adição em POST /chocolates/new', async () => {
    const response = await chai
      .request(app)
      .post('/chocolates/new')
      .send({ name: 'Cool Chocolate', price: 21 });

    const UPDATED_CHOCOLATE = { id: "3", name: 'Cool Chocolate', price: 21 };
      
    expect(response).to.have.status(201);
    expect(response.body).to.deep.equal({
      message: "Chocolate sucessfuly added!",
      status: 201
    });

    const chocolatesArr = chocolatesMOCK.chocolates;
    expect(chocolatesArr[chocolatesArr.length - 1]).to.deep.equal(UPDATED_CHOCOLATE);
  });
});

describe('Se ao deletar o item, é apropridamente deletado', () => {
  it('Se foi deletado', async () => {
    const response = await chai
      .request(app)
      .delete('/chocolates/1');
    console.log(chocolatesMOCK);
    expect(response).to.have.status(201);
    expect(response.body).to.be.an('object');
    expect(response.body.message).to.equal('Removed chocolate sucessfully');

    const deletedItem = INITIAL_CHOCOLATES_MOCK.chocolates[0];
    const isDeleted = chocolatesMOCK.chocolates.find((choco) => choco.id === deletedItem.id);
    expect(!isDeleted).to.equal(true);
    expect(chocolatesMOCK.chocolates.length).to.equal(1);
  });
});