/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'

const fs = require('fs')
const _ = require('lodash')

const request = require('supertest')
const storage = require('../../app/models/storage')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}

let token = ''
const createdID = []
const url = process.env.URL_TEST_USER

const file = `${__dirname}/../../data/6.storages/prueba_0.jpg`
const video = `${__dirname}/../../data/6.storages/custom.mp4`

module.exports = (server) => {
  describe('*********** STORAGE_USER ***********', () => {
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
    describe('/GET storage', () => {
      test(
        'it should NOT be able to consume the route since no token was sent',
        (done) => {
          request(server)
            .get(`${url}/storage/test`)
            .expect(401)
            .end((err, res) => {
              done()
            })
        }
      )
    })

    describe('/POST Storage', () => {
      test('it is not post in Storage ', (done) => {
        request(server)
          .post(`${url}/storage`)
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .expect(400)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('errors', { msg: 'No files were uploaded.' })
            done()
          })
      })
      test('Error in params ', (done) => {
        request(server)
          .post(`${url}/storage`)
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .attach('file', fs.readFileSync(file), 'pruebas.jpg')
          .expect(422)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            const { errors } = body
            expect(errors).toHaveProperty('msg', 'Param file[] required')
            done()
          })
      })
      test('Empty Array Files ', (done) => {
        request(server)
          .post(`${url}/storage`)
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .attach('file[]', '')
          .expect(400)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('errors', { msg: 'No files were uploaded.' })
            done()
          })
      })
      test('it post in Storage video', (done) => {
        request(server)
          .post(`${url}/storage`)
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .attach('file[]', fs.readFileSync(video), 'pruebas-video.mp4')
          .end((err, res) => {
            const { body } = res
            const firstFile = _.head(body)
            expect(firstFile).toBeInstanceOf(Object)
            expect(firstFile).toEqual(expect.objectContaining({
              _id: expect.any(String),
              source: expect.any(Object),
              type: expect.any(String),
              fileName: expect.any(String),
            }))
            createdID.push(res.body[0]._id)
            done()
          })
      }, 10000)
      test('it post in Storage image', (done) => {
        request(server)
          .post(`${url}/storage`)
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .attach('file[]', fs.readFileSync(file), 'pruebas.jpg')
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            const firstFile = _.head(body)
            expect(firstFile).toBeInstanceOf(Object)
            expect(firstFile).toEqual(expect.objectContaining({
              _id: expect.any(String),
              source: expect.any(Object),
              type: expect.any(String),
              fileName: expect.any(String),
            }))
            createdID.push(res.body[0]._id)
            done()
          })
      }, 10000)
    })

    describe('/GET/:id Storage', () => {
      test('it should GET a Storage by the given id', (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .get(`${url}/storage/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('_id', id)
            done()
          })
      })
    })

    afterAll(() => {
      createdID.forEach((id) => {
        storage.findByIdAndRemove(id, (err) => {
          if (err) {
            // console.log(err)
          }
        })
      })
    })
  })
}