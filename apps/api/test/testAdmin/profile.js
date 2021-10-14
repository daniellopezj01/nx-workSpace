/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server')
// eslint-disable-next-line no-unused-vars
const should = chai.should()
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345'
}

chai.use(chaiHttp)

describe('*********** PROFILE ***********', () => {
  // describe('/POST login', () => {
  //   it('it should GET token', (done) => {
  //     chai
  //       .request(server)
  //       .post('/api/1.0/login')
  //       .send(loginDetails)
  //       .end((err, res) => {
  //         res.should.have.status(200)
  //         res.body.should.be.an('object')
  //         res.body.should.have.property('token')
  //         const currentToken = res.body.token
  //         token = currentToken
  //         done()
  //       })
  //   })
  // })
  // describe('/GET profile', () => {
  //   it('it should NOT be able to consume the route since no token was sent', (done) => {
  //     chai
  //       .request(server)
  //       .get('/api/1.0/profile')
  //       .end((err, res) => {
  //         res.should.have.status(401)
  //         done()
  //       })
  //   })
  //   it('it should GET profile', (done) => {
  //     chai
  //       .request(server)
  //       .get('/api/1.0/profile')
  //       .set('Authorization', `Bearer ${token}`)
  //       .end((err, res) => {
  //         res.should.have.status(200)
  //         res.body.should.be.an('object')
  //         res.body.should.include.keys('name', 'email')
  //         done()
  //       })
  //   })
  //   //Admin
  //   // it('Rute Admin it should NOT be able to consume the route since no token was sent', (done) => {
  //   //   chai
  //   //     .request(server)
  //   //     .get('/admin/profile')
  //   //     .end((err, res) => {
  //   //       res.should.have.status(401)
  //   //       done()
  //   //     })
  //   // })
  //   // it('Rute Admin it should GET profile', (done) => {
  //   //   chai
  //   //     .request(server)
  //   //     .get('/admin/profile')
  //   //     .set('Authorization', `Bearer ${token}`)
  //   //     .end((err, res) => {
  //   //       res.should.have.status(200)
  //   //       res.body.should.be.an('object')
  //   //       res.body.should.include.keys('name', 'email')
  //   //       done()
  //   //     })
  //   // })
  // })
  // describe('/PATCH profile', () => {
  //   it('it should UPDATE profile', (done) => {
  //     const user = {
  //       name: 'Test123456',
  //       surname: 'Test123456',
  //       urlTwitter: 'https://hello.com',
  //       urlGitHub: 'https://hello.io',
  //       avatar: 'https://hello.com',
  //       video: 'https://hello.io',
  //       birthDate: '02-10-2010',
  //       city: 'Bucaramanga',
  //       country: 'Colombia'
  //     }
  //     chai
  //       .request(server)
  //       .patch('/api/1.0/profile')
  //       .set('Authorization', `Bearer ${token}`)
  //       .send(user)
  //       .end((err, res) => {
  //         res.should.have.status(200)
  //         res.body.should.be.a('object')
  //         res.body.should.have.property('name').eql('Test123456')
  //         res.body.should.have.property('urlTwitter').eql('https://hello.com')
  //         res.body.should.have.property('urlGitHub').eql('https://hello.io')
  //         res.body.should.have.property('city').eql('Bucaramanga')
  //         res.body.should.have.property('country').eql('Colombia')
  //         done()
  //       })
  //   })
  //   it('it should NOT UPDATE profile with email that already exists', (done) => {
  //     const user = {
  //       email: 'user@user.com'
  //     }
  //     chai
  //       .request(server)
  //       .patch('/api/1.0/profile')
  //       .set('Authorization', `Bearer ${token}`)
  //       .send(user)
  //       .end((err, res) => {
  //         res.should.have.status(422)
  //         res.body.should.be.a('object')
  //         res.body.should.have.property('errors')
  //         done()
  //       })
  //   })
  //   it('it should NOT UPDATE profile with not valid URL´s', (done) => {
  //     const user = {
  //       name: 'Test123456',
  //       urlTwitter: 'hello',
  //       urlGitHub: 'hello',
  //       city: 'Bucaramanga',
  //       country: 'Colombia'
  //     }
  //     chai
  //       .request(server)
  //       .patch('/api/1.0/profile')
  //       .set('Authorization', `Bearer ${token}`)
  //       .send(user)
  //       .end((err, res) => {
  //         res.should.have.status(422)
  //         res.body.should.be.a('object')
  //         res.body.should.have.property('errors').that.has.property('msg')
  //         res.body.errors.msg[0].should.have
  //           .property('msg')
  //           .eql('NOT_A_VALID_URL')
  //         done()
  //       })
  //   })
  //   //Admin
  //   // it('Rute Admin it should UPDATE profile', (done) => {
  //   //   const user = {
  //   //     name: 'Test123456',
  //   //     surname: 'Test123456',
  //   //     urlTwitter: 'https://hello.com',
  //   //     urlGitHub: 'https://hello.io',
  //   //     avatar: 'https://hello.com',
  //   //     video: 'https://hello.io',
  //   //     birthDate: '02-10-2010',
  //   //     city: 'Bucaramanga',
  //   //     country: 'Colombia'
  //   //   }
  //   //   chai
  //   //     .request(server)
  //   //     .patch('/admin/profile')
  //   //     .set('Authorization', `Bearer ${token}`)
  //   //     .send(user)
  //   //     .end((err, res) => {
  //   //       res.should.have.status(200)
  //   //       res.body.should.be.a('object')
  //   //       res.body.should.have.property('name').eql('Test123456')
  //   //       res.body.should.have.property('urlTwitter').eql('https://hello.com')
  //   //       res.body.should.have.property('urlGitHub').eql('https://hello.io')
  //   //       res.body.should.have.property('city').eql('Bucaramanga')
  //   //       res.body.should.have.property('country').eql('Colombia')
  //   //       done()
  //   //     })
  //   // })
  //   // it('Rute Admin it should NOT UPDATE profile with email that already exists', (done) => {
  //   //   const user = {
  //   //     email: 'user@user.com'
  //   //   }
  //   //   chai
  //   //     .request(server)
  //   //     .patch('/admin/profile')
  //   //     .set('Authorization', `Bearer ${token}`)
  //   //     .send(user)
  //   //     .end((err, res) => {
  //   //       res.should.have.status(422)
  //   //       res.body.should.be.a('object')
  //   //       res.body.should.have.property('errors')
  //   //       done()
  //   //     })
  //   // })
  //   // it('Rute Admin it should NOT UPDATE profile with not valid URL´s', (done) => {
  //   //   const user = {
  //   //     name: 'Test123456',
  //   //     urlTwitter: 'hello',
  //   //     urlGitHub: 'hello',
  //   //     city: 'Bucaramanga',
  //   //     country: 'Colombia'
  //   //   }
  //   //   chai
  //   //     .request(server)
  //   //     .patch('/admin/profile')
  //   //     .set('Authorization', `Bearer ${token}`)
  //   //     .send(user)
  //   //     .end((err, res) => {
  //   //       res.should.have.status(422)
  //   //       res.body.should.be.a('object')
  //   //       res.body.should.have.property('errors').that.has.property('msg')
  //   //       res.body.errors.msg[0].should.have
  //   //         .property('msg')
  //   //         .eql('NOT_A_VALID_URL')
  //   //       done()
  //   //     })
  //   // })
  // })
  // describe('/POST profile/changePassword', () => {
  //   it('it should NOT change password', (done) => {
  //     const data = {
  //       old: '123456',
  //       newpass: '123456'
  //     }
  //     chai
  //       .request(server)
  //       .post('/api/1.0/profile/changePassword')
  //       .set('Authorization', `Bearer ${token}`)
  //       .send(data)
  //       .end((err, res) => {
  //         res.should.have.status(409)
  //         res.body.should.be.a('object')
  //         res.body.should.have
  //           .property('errors')
  //           .that.has.property('msg')
  //           .eql('WRONG_PASSWORD')
  //         done()
  //       })
  //   })
  //   it('it should NOT change a too short password', (done) => {
  //     const data = {
  //       old: '1234',
  //       newpass: '1234'
  //     }
  //     chai
  //       .request(server)
  //       .post('/api/1.0/profile/changePassword')
  //       .set('Authorization', `Bearer ${token}`)
  //       .send(data)
  //       .end((err, res) => {
  //         res.should.have.status(422)
  //         res.body.should.be.a('object')
  //         res.body.should.have.property('errors').that.has.property('msg')
  //         res.body.errors.msg[0].should.have
  //           .property('msg')
  //           .eql('PASSWORD_TOO_SHORT_MIN_5')
  //         done()
  //       })
  //   })
  //   it('it should change password', (done) => {
  //     const data = {
  //       old: '12345',
  //       newass: '12345'
  //     }
  //     chai
  //       .request(server)
  //       .post('/api/1.0/profile/changePassword')
  //       .set('Authorization', `Bearer ${token}`)
  //       .send(data)
  //       .end((err, res) => {
  //         res.should.have.status(200)
  //         res.body.should.be.a('object')
  //         res.body.should.have.property('msg').eql('PASSWORD_CHANGED')
  //         done()
  //       })
  //   })
  //   //ADMIN
  //   // it('Rute Admin it should NOT change password', (done) => {
  //   //   const data = {
  //   //     old: '123456',
  //   //     newpass: '123456'
  //   //   }
  //   //   chai
  //   //     .request(server)
  //   //     .post('/admin/profile/changePassword')
  //   //     .set('Authorization', `Bearer ${token}`)
  //   //     .send(data)
  //   //     .end((err, res) => {
  //   //       res.should.have.status(409)
  //   //       res.body.should.be.a('object')
  //   //       res.body.should.have
  //   //         .property('errors')
  //   //         .that.has.property('msg')
  //   //         .eql('WRONG_PASSWORD')
  //   //       done()
  //   //     })
  //   // })
  //   // it('Rute Admin it should NOT change a too short password', (done) => {
  //   //   const data = {
  //   //     old: '1234',
  //   //     newpass: '1234'
  //   //   }
  //   //   chai
  //   //     .request(server)
  //   //     .post('/admin/profile/changePassword')
  //   //     .set('Authorization', `Bearer ${token}`)
  //   //     .send(data)
  //   //     .end((err, res) => {
  //   //       res.should.have.status(422)
  //   //       res.body.should.be.a('object')
  //   //       res.body.should.have.property('errors').that.has.property('msg')
  //   //       res.body.errors.msg[0].should.have
  //   //         .property('msg')
  //   //         .eql('PASSWORD_TOO_SHORT_MIN_5')
  //   //       done()
  //   //     })
  //   // })
  //   // it('Rute Admin it should change password', (done) => {
  //   //   const data = {
  //   //     old: '12345',
  //   //     newass: '12345'
  //   //   }
  //   //   chai
  //   //     .request(server)
  //   //     .post('/admin/profile/changePassword')
  //   //     .set('Authorization', `Bearer ${token}`)
  //   //     .send(data)
  //   //     .end((err, res) => {
  //   //       res.should.have.status(200)
  //   //       res.body.should.be.a('object')
  //   //       res.body.should.have.property('msg').eql('PASSWORD_CHANGED')
  //   //       done()
  //   //     })
  //   // })
  // })
})
