/* eslint-disable no-undef */
/* eslint-disable handle-callback-err */
process.env.NODE_ENV = 'test'



const User = require('../../app/models/user')
const request = require('supertest')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''
let publicId = ''
const url = process.env.URL_TEST_USER
const createdID = []


module.exports = (server) => {
  describe('*********** MANAGER_USERS ***********', () => {

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
            publicId = res.body.user._id
            done()
          })
      }, 1500)
    })

    describe('/GET users', () => {
      test('it should GET public profile', (done) => {
        request(server)
          .get(`${url}/users/public/${publicId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body).toBeInstanceOf(Object)
            expect(res.body).toHaveProperty('id', publicId)
            done()
          })
      })
    })
    afterAll(() => {
      createdID.forEach((id) => {
        User.findByIdAndRemove(id, (err) => {
          if (err) {
            // console.log(err)
          }
        })
      })
    })
  })
}