/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

const _ = require('lodash')
const faker = require('faker')


const reffered = require('../../app/models/referredUsers')
const server = require('../../superTest')
const request = require('supertest')
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
        .post(`${url}/login/`)
        .send(loginDetails)
        .expect(200)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            accessToken: expect.any(String),
            user: expect.any(Object),
          }))
          const currentAccessToken = body.accessToken
          accessToken = currentAccessToken
          done()
        })
    })
    test('it should GET a fresh token', (done) => {
      request(server)
        .post(`${url}/exchange/`)
        .send({
          accessToken
        })
        .expect(200)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            token: expect.any(String),
            user: expect.any(Object),
          }))
          const currentToken = body.token
          token = currentToken
          done()
        })
    }, 10000)
  })
  describe('/GET referreds', () => {
    test('it should GET all the referreds', (done) => {
      request(server)
        .get(`${url}/referreds`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          const { body } = res
          const { docs } = body
          expect(body).toBeInstanceOf(Object)
          expect(docs).toBeInstanceOf(Object)
          expect(docs).toHaveLength(2)
          const firstorder = _.head(docs)
          expect(firstorder).toEqual(expect.objectContaining({
            _id: expect.any(String),
            amountTo: expect.any(Number),
            amountFrom: expect.any(Number),
          }))
          const from = firstorder.userFrom
          expect(from).toHaveProperty('_id', userFrom)
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
        .expect(422)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          const { errors } = body
          expect(errors.msg).toBeInstanceOf(Array)
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
        .expect(201)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            planReferred: expect.any(String),
            userTo: expect.any(String),
          }))
          expect(body).toHaveProperty('status', 'available')
          expect(body).toHaveProperty('amountFrom', refferedPostTwo.amountFrom)
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
        .expect(200)
        .end((error, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            amountTo: expect.any(Number),
            amountFrom: expect.any(Number),
          }))
          expect(body).toHaveProperty('_id', id)
          done()
        })
    })
    test(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .get(`${url}/referreds/${id}`)
          .expect(401)
          .end((err, res) => {
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
        .expect(200)
        .end((error, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('_id', id)
          expect(body).toHaveProperty('amountTo', newAmount)
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
        .expect(200)
        .end((error, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          done()
        })
    })
    test(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .patch(`${url}/referreds/${id}`)
          .send({})
          .expect(401)
          .end((err, res) => {
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
        .expect(201)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            amountTo: expect.any(Number),
            amountFrom: expect.any(Number),
            status: expect.any(String),
          }))
          request(server)
            .delete(`${url}/referreds/${res.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((error, result) => {
              const { body: newBody } = result
              expect(newBody).toBeInstanceOf(Object)
              expect(newBody).toHaveProperty('msg', 'DELETED')
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
