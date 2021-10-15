/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

const _ = require('lodash')
const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const reffered = require('../../app/models/referredUsers')
const server = require('../../server')
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


describe('*********** REFERREDS_ADMIN ***********', () => {
  describe('/POST login', () => {
    test('it should GET token user', (done) => {
      request(server)
        .post(`${url}/login`)
        .send(loginDetails)
        .end((err, res) => {
          expect(res).have.status(200)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.arrayContaining(['accessToken', 'user']))
          const currentAccessToken = res.body.accessToken
          accessToken = currentAccessToken
          done()
        })
    })
    test('it should GET a fresh token', (done) => {
      request(server)
        .post(`${url}/exchange`)
        .send({
          accessToken
        })
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['token', 'user']))
          const currentToken = body.token
          token = currentToken
          done()
        })
    })
  })

  describe('/GET referreds', () => {
    test('it should GET all the referreds', (done) => {
      request(server)
        .get(`${url}/referreds`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          const { docs } = body
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(docs).be.an('array').toHaveLength(2)
          const firstorder = _.head(docs)
          expect(firstorder).toEqual(expect.arrayContaining(['_id', 'amountTo', 'amountFrom']))
          const from = firstorder.userFrom
          expect(from).have.property('_id').toEqual(userFrom)
          done()
        })
    })
  })

  describe('/POST referreds', () => {
    test('it should NOT POST a reffered without', (done) => {
      const refferedPostOne = {}
      request(server)
        .post(`${url}/referreds`)
        .set('Authorization', `Bearer ${token}`)
        .send(refferedPostOne)
        .end((err, res) => {
          expect(res).have.status(422)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          const { errors } = body
          expect(Array.isArray(errors)).toBe(true)
          done()
        })
    })
    test('it should POST a reffered ', (done) => {
      const refferedPostTwo = {
        userFrom,
        userTo,
        planReferred,
        amountTo: faker.random.number(),
        amountFrom: faker.random.number(),
        status: 'available'
      }
      request(server)
        .post(`${url}/referreds`)
        .set('Authorization', `Bearer ${token}`)
        .send(refferedPostTwo)
        .end((err, res) => {
          expect(res).have.status(201)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['_id', 'planReferred', 'userTo']))
          expect(body).have.property('status').toBe('available')
          expect(body).have
            .property('amountFrom').toEqual(refferedPostTwo.amountFrom)
          expect(typeof body).toBe('string')
          createdID.push(res.body._id)
          done()
        })
    })
  })

  describe('/GET/:id referreds', () => {
    test('it should GET a referreds by the given id', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .get(`${url}/referreds/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['_id', 'amountTo', 'amountFrom']))
          expect(body).have.property('_id').toEqual(id)
          done()
        })
    })
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .get(`${url}/referreds/${id}`)
          .end((err, res) => {
            expect(res).have.status(401)
            done()
          })
      }
    )
  })

  describe('/PATCH/:id referreds', () => {
    test('it should UPDATE a reffered given the id', (done) => {
      const id = createdID.slice(-1).pop()
      const newAmount = faker.random.number()
      request(server)
        .patch(`${url}/referreds/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          amountTo: newAmount
        })
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).have.property('_id').toEqual(id)
          expect(body).have.property('amountTo').toEqual(newAmount)
          createdID.push(res.body._id)
          done()
        })
    })
    test('it should not UPDATE a object empty', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .patch(`${url}/referreds/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          done()
        })
    })
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .patch(`${url}/referreds/${id}`)
          .send({})
          .end((err, res) => {
            expect(res).have.status(401)
            done()
          })
      }
    )
  })

  describe('/DELETE/:id reffered', () => {
    test('it should DELETE a reffered given the id', (done) => {
      const reffereddelete = {
        userFrom,
        userTo,
        planReferred,
        amountTo: faker.random.number(),
        amountFrom: faker.random.number(),
        status: 'available'
      }
      request(server)
        .post(`${url}/referreds`)
        .set('Authorization', `Bearer ${token}`)
        .send(reffereddelete)
        .end((err, res) => {
          expect(res).have.status(201)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.arrayContaining(['_id', 'amountTo', 'amountFrom', 'status']))
          chai
            .request(server)
            .delete(`${url}/referreds/${res.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((error, result) => {
              const { body } = result
              expect(result).have.status(200)
              expect(body).toBeInstanceOf(Object)
              expect(body).have.property('msg').toBe('DELETED')
              done()
            })
        })
    })
  })

  afterAll(() => {
    createdID.forEach((id) => {
      reffered.findByIdAndRemove(id, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
