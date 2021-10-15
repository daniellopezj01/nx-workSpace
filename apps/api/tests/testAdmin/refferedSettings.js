/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

const chai = require('chai')
const faker = require('faker')
const chaiHttp = require('chai-http')
const server = require('../../server')
const referredSettings = require('../../app/models/settingReferred')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''
const url = process.env.URL_TEST_ADMIN
const createdID = []



describe('*********** REFERREDS_SETTINGS_ADMIN ***********', () => {
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

  describe('/GET referreds_settings', () => {
    test('it should GET all the referreds', (done) => {
      request(server)
        .get(`${url}/referredSettings`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(200)
          const { docs, totalDocs, hasPrevPage, hasNextPage } = body
          expect(body).toBeInstanceOf(Object)
          expect(Array.isArray(docs)).toBe(true)
          expect(hasNextPage).toBeInstanceOf(Boolean)
          expect(hasPrevPage).toBeInstanceOf(Boolean)
          expect(body.limit).toBeInstanceOf(Number)
          expect(body.page).toBeInstanceOf(Number)
          expect(totalDocs).be.a('number').toBe(2)
          expect(docs).toHaveLength(2)
          expect(body.totalPages).toBeInstanceOf(Number)
          done()
        })
    })
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        request(server)
          .get(`${url}/referreds`)
          .end((err, res) => {
            expect(res).have.status(401)
            done()
          })
      }
    )
  })

  describe('/POST referreds_settings', () => {
    it(
      'it should NOT POST a referreds_settings without referreds_settings',
      (done) => {
        const settingsPostOne = {}
        request(server)
          .post(`${url}/referredSettings`)
          .set('Authorization', `Bearer ${token}`)
          .send(settingsPostOne)
          .end((err, res) => {
            expect(res).have.status(422)
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('errors')
            const { errors } = body
            expect(Array.isArray(errors)).toBe(true)
            done()
          })
      }
    )
    test('it should POST a referreds_settings ', (done) => {
      const settingsPostTwo = {
        name: faker.random.words(),
        label: faker.random.words(),
        amountTo: faker.random.number(),
        amountFrom: faker.random.number()
      }
      request(server)
        .post(`${url}/referredSettings`)
        .set('Authorization', `Bearer ${token}`)
        .send(settingsPostTwo)
        .end((err, res) => {
          expect(res).have.status(201)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['_id', 'name', 'label', 'amountTo']))
          expect(body).have.property('name').toEqual(settingsPostTwo.name)
          expect(body).have.property('label').toEqual(settingsPostTwo.label)
          expect(typeof body).toBe('string')
          createdID.push(res.body._id)
          done()
        })
    })
  })

  describe('/GET/:id referreds_settings', () => {
    test('it should GET a referreds_settings by the given id', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .get(`${url}/referredSettings/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['name', 'amountTo', '_id']))
          expect(body).have.property('_id').toEqual(id)
          done()
        })
    })
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .get(`${url}/referredSettings/${id}`)
          .end((err, res) => {
            expect(res).have.status(401)
            done()
          })
      }
    )
  })

  describe('/PATCH/:id referreds_settings', () => {
    test('it should UPDATE a category given the id', (done) => {
      const id = createdID.slice(-1).pop()
      const newName = faker.random.words()
      const newAmount = faker.random.number()
      request(server)
        .patch(`${url}/referredSettings/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: newName,
          label: newName,
          amountTo: newAmount,
          amountFrom: newAmount
        })
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).have.property('_id').toEqual(id)
          expect(body).have.property('name').toEqual(newName)
          expect(body).have.property('label').toEqual(newName)
          expect(body).have.property('amountTo').toEqual(newAmount)
          expect(body).have.property('amountFrom').toEqual(newAmount)
          expect(typeof body._id).toBe('string')
          createdID.push(res.body._id)
          done()
        })
    })
    test('it should not UPDATE a type referred empty', (done) => {
      request(server)
        .patch(`${url}/referredSettings`)
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(404)
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          done()
        })
    })
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .patch(`${url}/referredSettings/${id}`)
          .send({
            name: faker.random.words()
          })
          .end((err, res) => {
            expect(res).have.status(401)
            done()
          })
      }
    )
  })

  describe('/DELETE/:id category', () => {
    test('it should DELETE a category given the id', (done) => {
      const typeRefferedDeleted = {
        name: faker.random.words(),
        label: faker.random.words(),
        amountTo: faker.random.number(),
        amountFrom: faker.random.number()
      }
      request(server)
        .post(`${url}/referredSettings`)
        .set('Authorization', `Bearer ${token}`)
        .send(typeRefferedDeleted)
        .end((err, res) => {
          expect(res).have.status(201)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.arrayContaining(['_id', 'label', 'name', 'amountTo', 'amountFrom']))
          chai
            .request(server)
            .delete(`${url}/referredSettings/${res.body._id}`)
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
      referredSettings.findByIdAndRemove(id, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
