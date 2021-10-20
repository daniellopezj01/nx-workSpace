/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'

const fs = require('fs')
const _ = require('lodash')


const server = require('../../server')
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


describe('*********** STORAGE_USER ***********', () => {
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

  describe('/GET storage', () => {
    test(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        request(server)
          .get(`${url}/storage/test`)
          .end((err, res) => {
            expect(res).have.status(401)
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
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(res).have.status(400)
          expect(body).have
            .property('errors').toEqual({ msg: 'No files were uploaded.' })
          done()
        })
    })
    test('Error in params ', (done) => {
      request(server)
        .post(`${url}/storage`)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .attach('file', fs.readFileSync(file), 'pruebas.jpg')
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(res).have.status(422)
          const { errors } = body
          expect(errors).have.property('msg').toBe('Param file[] required')
          done()
        })
    })
    test('Empty Array Files ', (done) => {
      request(server)
        .post(`${url}/storage`)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .attach('file[]', '')
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(res).have.status(400)
          expect(body).have
            .property('errors').toEqual({ msg: 'No files were uploaded.' })
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
          expect(Array.isArray(body)).toBe(true)
          const firstFile = _.head(body)
          expect(firstFile).toBeInstanceOf(Object)
          expect(firstFile).toEqual(expect.arrayContaining(['source', 'type', 'fileName', '_id']))
          createdID.push(res.body[0]._id)
          done()
        })
    })
    test('it post in Storage image', (done) => {
      request(server)
        .post(`${url}/storage`)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .attach('file[]', fs.readFileSync(file), 'pruebas.jpg')
        .end((err, res) => {
          const { body } = res
          expect(Array.isArray(res.body)).toBe(true)
          const firstFile = _.head(body)
          expect(firstFile).toBeInstanceOf(Object)
          expect(firstFile).toEqual(expect.arrayContaining(['source', 'type', 'fileName', '_id']))
          createdID.push(res.body[0]._id)
          done()
        })
    })
  })

  describe('/GET/:id Storage', () => {
    test('it should GET a Storage by the given id', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .get(`${url}/storage/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).have.status(200)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).have.property('_id').toEqual(id)
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
