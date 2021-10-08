/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'

const fs = require('fs')
const _ = require('lodash')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server')
const storage = require('../../app/models/storage')
// eslint-disable-next-line no-unused-vars
const should = chai.should()
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}

let token = ''
const createdID = []
const url = process.env.URL_TEST_USER

const file = `${__dirname}/../../data/6.storages/prueba_0.jpg`
const video = `${__dirname}/../../data/6.storages/custom.mp4`
chai.use(chaiHttp)

describe('*********** STORAGE_USER ***********', () => {
  describe('/POST login', () => {
    it('it should GET token user', (done) => {
      chai
        .request(server)
        .post(`${url}/login`)
        .send(loginDetails)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.should.include.keys('accessToken', 'user')
          const currentAccessToken = res.body.accessToken
          accessToken = currentAccessToken
          done()
        })
    })
    it('it should GET a fresh token', (done) => {
      chai
        .request(server)
        .post(`${url}/exchange`)
        .send({
          accessToken
        })
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.an('object')
          body.should.include.keys('token', 'user')
          const currentToken = body.token
          token = currentToken
          done()
        })
    })
  })

  describe('/GET storage', () => {
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      chai
        .request(server)
        .get(`${url}/storage/test`)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })

  describe('/POST Storage', () => {
    it('it is not post in Storage ', (done) => {
      chai
        .request(server)
        .post(`${url}/storage`)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .end((err, res) => {
          const { body } = res
          body.should.be.an('object')
          res.should.have.status(400)
          body.should.have.property('errors')
            .eql({ msg: 'No files were uploaded.' })
          done()
        })
    })
    it('Error in params ', (done) => {
      chai
        .request(server)
        .post(`${url}/storage`)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .attach('file', fs.readFileSync(file), 'pruebas.jpg')
        .end((err, res) => {
          const { body } = res
          body.should.be.an('object')
          res.should.have.status(422)
          const { errors } = body
          errors.should.have.property('msg').eql('Param file[] required')
          done()
        })
    })
    it('Empty Array Files ', (done) => {
      chai
        .request(server)
        .post(`${url}/storage`)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .attach('file[]', '')
        .end((err, res) => {
          const { body } = res
          body.should.be.an('object')
          res.should.have.status(400)
          body.should.have.property('errors').eql({ msg: 'No files were uploaded.' })
          done()
        })
    })
    it('it post in Storage video', (done) => {
      chai
        .request(server)
        .post(`${url}/storage`)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .attach('file[]', fs.readFileSync(video), 'pruebas-video.mp4')
        .end((err, res) => {
          const { body } = res
          body.should.be.an('array')
          const firstFile = _.head(body)
          firstFile.should.be.an('object')
          firstFile.should.include.keys('source', 'type', 'fileName', '_id')
          createdID.push(res.body[0]._id)
          done()
        })
    })
    it('it post in Storage image', (done) => {
      chai
        .request(server)
        .post(`${url}/storage`)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .attach('file[]', fs.readFileSync(file), 'pruebas.jpg')
        .end((err, res) => {
          const { body } = res
          res.body.should.be.an('array')
          const firstFile = _.head(body)
          firstFile.should.be.an('object')
          firstFile.should.include.keys('source', 'type', 'fileName', '_id')
          createdID.push(res.body[0]._id)
          done()
        })
    })
  })

  describe('/GET/:id Storage', () => {
    it('it should GET a Storage by the given id', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .get(`${url}/storage/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('_id').eql(id)
          done()
        })
    })
  })

  after(() => {
    createdID.forEach((id) => {
      storage.findByIdAndRemove(id, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
