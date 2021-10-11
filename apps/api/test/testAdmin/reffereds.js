/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
process.env.NODE_ENV = 'test'

const _ = require('lodash')
const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const reffered = require('../../app/models/referredUsers')
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

const userFrom = '5aa1c2c35ef7a4e97b5e995a'
const userTo = '5fa29a9584b39b13786fbfc2'
const planReferred = '6061e77ada99821b1425b282'
const url = process.env.URL_TEST_ADMIN
chai.use(chaiHttp)

describe('*********** REFERREDS_ADMIN ***********', () => {
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

  describe('/GET referreds', () => {
    it('it should GET all the referreds', (done) => {
      chai
        .request(server)
        .get(`${url}/referreds`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          const { docs } = body
          res.should.have.status(200)
          body.should.be.an('object')
          docs.should.be.an('array').length(2)
          const firstorder = _.head(docs)
          firstorder.should.include.keys('_id', 'amountTo', 'amountFrom')
          const from = firstorder.userFrom
          from.should.have.property('_id').eql(userFrom)
          done()
        })
    })
  })

  describe('/POST referreds', () => {
    it('it should NOT POST a reffered without', (done) => {
      const refferedPostOne = {}
      chai
        .request(server)
        .post(`${url}/referreds`)
        .set('Authorization', `Bearer ${token}`)
        .send(refferedPostOne)
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
    it('it should POST a reffered ', (done) => {
      const refferedPostTwo = {
        userFrom,
        userTo,
        planReferred,
        amountTo: faker.random.number(),
        amountFrom: faker.random.number(),
        status: 'available'
      }
      chai
        .request(server)
        .post(`${url}/referreds`)
        .set('Authorization', `Bearer ${token}`)
        .send(refferedPostTwo)
        .end((err, res) => {
          res.should.have.status(201)
          const { body } = res
          body.should.be.a('object')
          body.should.include.keys('_id', 'planReferred', 'userTo')
          body.should.have.property('status').eql('available')
          body.should.have.property('amountFrom').eql(refferedPostTwo.amountFrom)
          body.should.have.property('_id').be.a('string')
          createdID.push(res.body._id)
          done()
        })
    })
  })

  describe('/GET/:id referreds', () => {
    it('it should GET a referreds by the given id', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .get(`${url}/referreds/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.include.keys('_id', 'amountTo', 'amountFrom')
          body.should.have.property('_id').eql(id)
          done()
        })
    })
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .get(`${url}/referreds/${id}`)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })

  describe('/PATCH/:id referreds', () => {
    it('it should UPDATE a reffered given the id', (done) => {
      const id = createdID.slice(-1).pop()
      const newAmount = faker.random.number()
      chai
        .request(server)
        .patch(`${url}/referreds/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          amountTo: newAmount
        })
        .end((error, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.have.property('_id').eql(id)
          body.should.have.property('amountTo').eql(newAmount)
          createdID.push(res.body._id)
          done()
        })
    })
    it('it should not UPDATE a object empty', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .patch(`${url}/referreds/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .end((error, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          done()
        })
    })
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .patch(`${url}/referreds/${id}`)
        .send({})
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })

  describe('/DELETE/:id reffered', () => {
    it('it should DELETE a reffered given the id', (done) => {
      const reffereddelete = {
        userFrom,
        userTo,
        planReferred,
        amountTo: faker.random.number(),
        amountFrom: faker.random.number(),
        status: 'available'
      }
      chai
        .request(server)
        .post(`${url}/referreds`)
        .set('Authorization', `Bearer ${token}`)
        .send(reffereddelete)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.include.keys(
            '_id',
            'amountTo',
            'amountFrom',
            'status'
          )
          chai
            .request(server)
            .delete(`${url}/referreds/${res.body._id}`)
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
      reffered.findByIdAndRemove(id, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
