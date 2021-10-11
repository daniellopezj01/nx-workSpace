/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
process.env.NODE_ENV = 'test'

const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const hook = require('../../app/models/hooks')
const server = require('../../server')
// eslint-disable-next-line no-unused-vars
const should = chai.should()
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
chai.use(chaiHttp)

describe('*********** HOOKS ***********', () => {
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

  describe('/POST hook', () => {
    it('it should NOT POST a hook without hook', (done) => {
      const hookPostOne = {}
      chai
        .request(server)
        .post(`${url}/hook/subscriber`)
        .set('Authorization', `Bearer ${token}`)
        .set('app_id', '1')
        .set('app_secret', '2')
        .send(hookPostOne)
        .end((err, res) => {
          res.should.have.status(422)
          const { body } = res
          body.should.be.a('object')
          body.should.have.property('errors')
          const { errors } = body
          errors.should.have.property('msg').be.a('array')
          done()
        })
    })
    it('it unauthorized POST a hook ', (done) => {
      const hookPostTwo = {
        target_url
      }
      chai
        .request(server)
        .post(`${url}/hook/subscriber`)
        .set('Authorization', `Bearer ${token}`)
        .set('app_id', 'error')
        .set('app_secret', 'error')
        .send(hookPostTwo)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
    it('it should POST a hook ', (done) => {
      const hookPostTwo = {
        target_url,
        action_trigger
      }
      chai
        .request(server)
        .post(`${url}/hook/subscriber`)
        .set('Authorization', `Bearer ${token}`)
        .set('app_id', '1')
        .set('app_secret', '2')
        .send(hookPostTwo)
        .end((err, res) => {
          res.should.have.status(201)
          const { body } = res
          body.should.be.a('object')
          body.should.include.keys('url', 'trigger')
          createdID.push(res.body._id)
          done()
        })
    })
  })
  describe('/DELETE/:id hook', () => {
    it('it should DELETE a hook given the id', (done) => {
      const hookdelete = {
        target_url,
        action_trigger
      }
      chai
        .request(server)
        .post(`${url}/hook/subscriber`)
        .set('Authorization', `Bearer ${token}`)
        .set('app_id', '1')
        .set('app_secret', '2')
        .send(hookdelete)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.include.keys('url', 'trigger')
          chai
            .request(server)
            .delete(`${url}/hook/unsubscriber`)
            .set('app_id', '1')
            .set('app_secret', '2')
            .set('Authorization', `Bearer ${token}`)
            .send(hookdelete)
            .end((error, result) => {
              const { body } = result
              result.should.have.status(201)
              body.should.be.a('object')
              body.should.have.property('DELETED').eql('SUCCESS')
              done()
            })
        })
    })
  })

  after(() => {
    createdID.forEach((id) => {
      hook.findByIdAndRemove(id, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
