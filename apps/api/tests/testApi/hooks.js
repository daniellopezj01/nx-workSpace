/* eslint-disable handle-callback-err */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

const faker = require('faker')


const hook = require('../../app/models/hooks')
const server = require('../../server')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''
const createdID = []
const target_url = faker.internet.url()
const action_trigger = faker.random.word()
const url = process.env.URL_TEST_USER


describe('*********** HOOKS ***********', () => {
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

  describe('/POST hook', () => {
    test('it should NOT POST a hook without hook', (done) => {
      const hookPostOne = {}
      request(server)
        .post(`${url}/hook/subscriber`)
        .set('Authorization', `Bearer ${token}`)
        .set('app_id', '1')
        .set('app_secret', '2')
        .send(hookPostOne)
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
    test('it unauthorized POST a hook ', (done) => {
      const hookPostTwo = {
        target_url
      }
      request(server)
        .post(`${url}/hook/subscriber`)
        .set('Authorization', `Bearer ${token}`)
        .set('app_id', 'error')
        .set('app_secret', 'error')
        .send(hookPostTwo)
        .end((err, res) => {
          expect(res).have.status(401)
          done()
        })
    })
    test('it should POST a hook ', (done) => {
      const hookPostTwo = {
        target_url,
        action_trigger
      }
      request(server)
        .post(`${url}/hook/subscriber`)
        .set('Authorization', `Bearer ${token}`)
        .set('app_id', '1')
        .set('app_secret', '2')
        .send(hookPostTwo)
        .end((err, res) => {
          expect(res).have.status(201)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['url', 'trigger']))
          createdID.push(res.body._id)
          done()
        })
    })
  })
  describe('/DELETE/:id hook', () => {
    test('it should DELETE a hook given the id', (done) => {
      const hookdelete = {
        target_url,
        action_trigger
      }
      request(server)
        .post(`${url}/hook/subscriber`)
        .set('Authorization', `Bearer ${token}`)
        .set('app_id', '1')
        .set('app_secret', '2')
        .send(hookdelete)
        .end((err, res) => {
          expect(res).have.status(201)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.arrayContaining(['url', 'trigger']))
          request(server)
            .delete(`${url}/hook/unsubscriber`)
            .set('app_id', '1')
            .set('app_secret', '2')
            .set('Authorization', `Bearer ${token}`)
            .send(hookdelete)
            .end((error, result) => {
              const { body } = result
              expect(result).have.status(201)
              expect(body).toBeInstanceOf(Object)
              expect(body).have.property('DELETED').toBe('SUCCESS')
              done()
            })
        })
    })
  })

  afterAll(() => {
    createdID.forEach((id) => {
      hook.findByIdAndRemove(id, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
