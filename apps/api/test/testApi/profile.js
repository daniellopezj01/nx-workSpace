/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server')
// eslint-disable-next-line no-unused-vars
const should = chai.should()
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
const url = process.env.URL_TEST_USER

chai.use(chaiHttp)

describe('*********** PROFILE_USERS ***********', () => {
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
  describe('/GET profile', () => {
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      chai
        .request(server)
        .get(`${url}/profile`)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
    it('it should GET profile', (done) => {
      chai
        .request(server)
        .get(`${url}/profile`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.an('object')
          body.should.include.keys('name', 'email')
          body.should.have.property('role').eql('admin')
          done()
        })
    })
    it('it should GET reffered', (done) => {
      chai
        .request(server)
        .get(`${url}/profile/referred`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
    })
  })

  describe('/PATCH profile', () => {
    it('it should UPDATE profile', (done) => {
      const user = {
        name: 'Test123456',
        surname: 'Test123456',
        avatar: 'https://hello.com',
        video: 'https://hello.io',
        birthDate: '02-10-2010',
        country: 'Colombia'
      }
      chai
        .request(server)
        .patch(`${url}/profile`)
        .set('Authorization', `Bearer ${token}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(200)
          const { body } = res
          body.should.be.a('object')
          body.should.have.property('name').eql('Test123456')
          body.should.have.property('surname').eql('Test123456')
          body.should.have.property('video').eql('https://hello.io')
          body.should.have.property('country').eql('Colombia')
          done()
        })
    })
    it('it should NOT UPDATE profile with email that already exists', (done) => {
      const user = {
        email: 'user@user.com'
      }
      chai
        .request(server)
        .patch(`${url}/profile`)
        .set('Authorization', `Bearer ${token}`)
        .send(user)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(422)
          body.should.be.a('object')
          body.should.have.property('errors')
          done()
        })
    })
    it('it should NOT UPDATE profile with not valid URL´s', (done) => {
      const user = {
        name: 'Test123456',
        urlTwitter: 'hello',
        urlGitHub: 'hello',
        city: 'Bucaramanga',
        country: 'Colombia'
      }
      chai
        .request(server)
        .patch(`${url}/profile`)
        .set('Authorization', `Bearer ${token}`)
        .send(user)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(422)
          body.should.be.a('object')
          body.should.have.property('errors').that.has.property('msg')
          body.errors.msg[0].should.have
            .property('msg')
            .eql('NOT_A_VALID_URL')
          done()
        })
    })
  })

  describe('/POST profile/changePassword', () => {
    it('it should NOT change password', (done) => {
      const data = {
        old: '123456',
        newpass: '123456'
      }
      chai
        .request(server)
        .post(`${url}/profile/changePassword`)
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .end((err, res) => {
          res.should.have.status(422)
          const { body } = res
          body.should.be.a('object')
          body.should.have.property('errors').be.a('object')
          const { msg } = body.errors
          msg.should.have.property('msg').eql('WRONG_PASSWORD')
          done()
        })
    })
    it('it should NOT change a too short password', (done) => {
      const data = {
        old: '1234',
        newpass: '1234'
      }
      chai
        .request(server)
        .post(`${url}/profile/changePassword`)
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('errors').that.has.property('msg')
          res.body.errors.msg[0].should.have
            .property('msg')
            .eql('PASSWORD_TOO_SHORT_MIN_5')
          done()
        })
    })
    it('it should change password', (done) => {
      const data = {
        old: loginDetails.password,
        newass: '12345678'
      }
      chai
        .request(server)
        .post(`${url}/profile/changePassword`)
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('msg').eql('PASSWORD_CHANGED')
          done()
        })
    })
  })
})
