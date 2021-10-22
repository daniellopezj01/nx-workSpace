/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'

const request = require('supertest')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
const url = process.env.URL_TEST_USER

module.exports = (server) => {
  describe('*********** PROFILE_USERS ***********', () => {
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
      }, 1500)
    })
    describe('/GET profile', () => {
      test(
        'it should NOT be able to consume the route since no token was sent',
        (done) => {
          request(server)
            .get(`${url}/profile`)
            .expect(401)
            .end((err, res) => {
              done()
            })
        }
      )
      test('it should GET profile', (done) => {
        request(server)
          .get(`${url}/profile`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              name: expect.any(String),
              email: expect.any(String)
            }))
            expect(body).toHaveProperty('role', 'admin')
            done()
          })
      })
      test('it should GET reffered', (done) => {
        request(server)
          .get(`${url}/profile/referred`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            done()
          })
      })
    })

    describe('/PATCH profile', () => {
      test('it should UPDATE profile', (done) => {
        const user = {
          name: 'Test123456',
          surname: 'Test123456',
          avatar: 'https://hello.com',
          video: 'https://hello.io',
          birthDate: '02-10-2010',
          country: 'Colombia'
        }
        request(server)
          .patch(`${url}/profile`)
          .set('Authorization', `Bearer ${token}`)
          .send(user)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('name', 'Test123456')
            expect(body).toHaveProperty('surname', 'Test123456')
            expect(body).toHaveProperty('video', 'https://hello.io')
            expect(body).toHaveProperty('country', 'Colombia')
            done()
          })
      })
      test('it should NOT UPDATE profile with email that already exists', (done) => {
        const user = {
          email: 'user@user.com'
        }
        request(server)
          .patch(`${url}/profile`)
          .set('Authorization', `Bearer ${token}`)
          .send(user)
          .expect(422)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('errors')
            done()
          })
      })
      test('it should NOT UPDATE profile with not valid URL´s', (done) => {
        const user = {
          name: 'Test123456',
          urlTwitter: 'hello',
          urlGitHub: 'hello',
          city: 'Bucaramanga',
          country: 'Colombia'
        }
        request(server)
          .patch(`${url}/profile`)
          .set('Authorization', `Bearer ${token}`)
          .send(user)
          .expect(422)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            const { errors } = body
            expect(errors).toHaveProperty('msg')
            expect(errors.msg[0]).toHaveProperty('msg', 'NOT_A_VALID_URL')
            done()
          })
      })
    })

    describe('/POST profile/changePassword', () => {
      test('it should NOT change password', (done) => {
        const data = {
          old: '123456',
          newpass: '123456'
        }
        request(server)
          .post(`${url}/profile/changePassword`)
          .set('Authorization', `Bearer ${token}`)
          .send(data)
          .expect(422)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toBeInstanceOf(Object)
            const { msg } = body.errors
            expect(msg).toHaveProperty('msg', 'WRONG_PASSWORD')
            done()
          })
      })
      test('it should NOT change a too short password', (done) => {
        const data = {
          old: '1234',
          newpass: '1234'
        }
        request(server)
          .post(`${url}/profile/changePassword`)
          .set('Authorization', `Bearer ${token}`)
          .send(data)
          .expect(422)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            const { errors } = body
            expect(errors).toHaveProperty('msg')
            expect(errors.msg[0]).toHaveProperty('msg', 'PASSWORD_TOO_SHORT_MIN_5')
            done()
          })
      })
      test('it should change password', (done) => {
        const data = {
          old: loginDetails.password,
          newass: '12345678'
        }
        request(server)
          .post(`${url}/profile/changePassword`)
          .set('Authorization', `Bearer ${token}`)
          .send(data)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('msg', 'PASSWORD_CHANGED')
            done()
          })
      })
    })
  })
}