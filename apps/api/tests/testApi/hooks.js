/* eslint-disable handle-callback-err */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

const faker = require('faker')


const hook = require('../../app/models/hooks')
const request = require('supertest')
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

module.exports = (server) => {
  describe('*********** HOOKS ***********', () => {
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
      }, 1000)
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
      }, 1500)
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
          .expect(401)
          .end((err, res) => {
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
          .expect(201)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              url: expect.any(String),
              trigger: expect.any(String),
            }))
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
          .expect(201)
          .end((err, res) => {
            const { body } = res

            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              url: expect.any(String),
              trigger: expect.any(String),
            }))
            request(server)
              .delete(`${url}/hook/unsubscriber`)
              .set('app_id', '1')
              .set('app_secret', '2')
              .set('Authorization', `Bearer ${token}`)
              .send(hookdelete)
              .expect(201)
              .end((error, result) => {
                const { body: newBody } = result
                expect(newBody).toBeInstanceOf(Object)
                expect(newBody).toHaveProperty('DELETED', 'SUCCESS')
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
}