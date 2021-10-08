/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
process.env.NODE_ENV = 'test'
const _ = require('lodash')
const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const orders = require('../../app/models/payOrder')
const server = require('../../server')
// eslint-disable-next-line no-unused-vars
const should = chai.should()
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''
const createdID = []
const idReservation = '5fa18bde4087883d305e6800'
const idUser = '5aa1c2c35ef7a4e97b5e995a'
const url = process.env.URL_TEST_ADMIN
chai.use(chaiHttp)

describe('*********** PAY_ORDERS_ADMIN ***********', () => {
  describe('/POST login', () => {
    it('it should GET token user', (done) => {
      chai
        .request(server)
        .post(`${url}/login`)
        .send(loginDetails)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.should.include.keys('accessToken', 'user')
          const currentAccessToken = res.body.accessToken
          accessToken = currentAccessToken
          done()
        })
    })
    it('it should GET a fresh token', (done) => {
      chai
        .request(server)
        .post(`${url}/exchange`)
        .send({
          accessToken
        })
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.an('object')
          body.should.include.keys('token', 'user')
          const currentToken = body.token
          token = currentToken
          done()
        })
    })
  })

  describe('/POST payOrders', () => {
    it('it should NOT POST a orders without orders', (done) => {
      const orderPostOne = {}
      chai
        .request(server)
        .post(`${url}/payOrders`)
        .set('Authorization', `Bearer ${token}`)
        .send(orderPostOne)
        .end((err, res) => {
          res.should.have.status(422)
          const { body } = res
          body.should.be.a('object')
          body.should.have.property('errors')
          const { errors } = body
          errors.should.have.property('msg').be.a('array')
          done()
        })
    })
    it('it should POST a orders  pay Wallet', (done) => {
      const orderPostTwo = {
        idOperation: faker.random.words(),
        amount: faker.random.number(),
        idUser,
        platform: 'stripe'
      }
      chai
        .request(server)
        .post(`${url}/payOrders`)
        .set('Authorization', `Bearer ${token}`)
        .send(orderPostTwo)
        .end((err, res) => {
          res.should.have.status(201)
          const { body } = res
          body.should.be.a('object')
          body.should.include.keys('_id', 'idUser', 'platform', 'idOperation', 'idUser', 'platform')
          body.should.have.property('platform').eql('stripe')
          body.should.have.property('idUser').eql(idUser)
          body.should.have.property('amount').eql(orderPostTwo.amount)
          createdID.push(res.body._id)
          done()
        })
    })
    it('it should POST a orders pay reservation', (done) => {
      const orderPostTwo = {
        idReservation,
        idOperation: faker.random.words(),
        amount: faker.random.number(),
        idUser,
        platform: 'stripe'
      }
      chai
        .request(server)
        .post(`${url}/payOrders`)
        .set('Authorization', `Bearer ${token}`)
        .send(orderPostTwo)
        .end((err, res) => {
          res.should.have.status(201)
          const { body } = res
          body.should.be.a('object')
          body.should.include.keys('_id', 'idUser', 'platform', 'idOperation', 'idUser', 'platform')
          body.should.have.property('platform').eql('stripe')
          body.should.have.property('idReservation').eql(idReservation)
          body.should.have.property('amount').eql(orderPostTwo.amount)
          createdID.push(res.body._id)
          done()
        })
    })
  })

  describe('/GET payOrders', () => {
    it('it should GET all the payOrders', (done) => {
      chai
        .request(server)
        .get(`${url}/payOrders`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          const { docs } = body
          res.should.have.status(200)
          body.should.be.an('object')
          docs.should.have.lengthOf(2)
          const firstorder = _.head(docs)
          firstorder.should.include.keys('_id', 'amount', 'idOperation')
          done()
        })
    })
  })

  describe('/GET/:id payOrders', () => {
    it('it should GET a payOrders by the given id', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .get(`${url}/payOrders/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.include.keys('status', '_id', 'idReservation')
          body.should.have.property('_id').eql(id)
          done()
        })
    })
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .get(`${url}/payOrders/${id}`)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })

  describe('/PATCH/:id payOrders', () => {
    it('it should UPDATE a orders given the id', (done) => {
      const id = createdID.slice(-1).pop()
      const object = { amount: faker.random.number() }
      chai
        .request(server)
        .patch(`${url}/payOrders/fromPanel/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(object)
        .end((error, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.have.property('_id').eql(id)
          body.should.have.property('amount').eql(object.amount)
          done()
        })
    })
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .patch(`${url}/payOrders/fromPanel/${id}`)
        .send({
          amount: faker.random.number()
        })
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })

  describe('/DELETE/:id orders', () => {
    it('it should DELETE a orders given the id', (done) => {
      const objectDelete = {
        idReservation,
        idOperation: faker.random.words(),
        amount: faker.random.number(),
        idUser,
        platform: 'stripe'
      }
      chai
        .request(server)
        .post(`${url}/payOrders`)
        .set('Authorization', `Bearer ${token}`)
        .send(objectDelete)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.include.keys(
            '_id',
            'idOperation',
            'idUser',
            'platform'
          )
          chai
            .request(server)
            .delete(`${url}/payOrders/${res.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((error, result) => {
              const { body } = result
              result.should.have.status(200)
              body.should.be.a('object')
              body.should.have.property('msg').eql('DELETED')
              done()
            })
        })
    })
  })

  after(() => {
    createdID.forEach((id) => {
      orders.findByIdAndRemove(id, (err) => {
        if (err) {
          console.log(err.message)
        }
      })
    })
  })
})
