/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'



const server = require('../../server')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
const url = process.env.URL_TEST_USER



describe('*********** PROFILE_USERS ***********', () => {
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
  describe('/GET profile', () => {
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        request(server)
          .get(`${url}/profile`)
          .end((err, res) => {
            expect(res).have.status(401)
            done()
          })
      }
    )
    test('it should GET profile', (done) => {
      request(server)
        .get(`${url}/profile`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['name', 'email']))
          expect(body).have.property('role').toBe('admin')
          done()
        })
    })
    test('it should GET reffered', (done) => {
      request(server)
        .get(`${url}/profile/referred`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).have.status(200)
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
        .end((err, res) => {
          expect(res).have.status(200)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).have.property('name').toBe('Test123456')
          expect(body).have.property('surname').toBe('Test123456')
          expect(body).have.property('video').toBe('https://hello.io')
          expect(body).have.property('country').toBe('Colombia')
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
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(422)
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
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(422)
          expect(body).toBeInstanceOf(Object)
          expect(body).have.property('errors').toHaveProperty('msg')
          expect(body.errors.msg[0]).have.property('msg').toBe('NOT_A_VALID_URL')
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
        .end((err, res) => {
          expect(res).have.status(422)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toBeInstanceOf(Object)
          const { msg } = body.errors
          expect(msg).have.property('msg').toBe('WRONG_PASSWORD')
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
        .end((err, res) => {
          expect(res).have.status(422)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).have.property('errors').toHaveProperty('msg')
          expect(res.body.errors.msg[0]).have
            .property('msg').toBe('PASSWORD_TOO_SHORT_MIN_5')
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
        .end((err, res) => {
          expect(res).have.status(200)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).have.property('msg').toBe('PASSWORD_CHANGED')
          done()
        })
    })
  })
})
