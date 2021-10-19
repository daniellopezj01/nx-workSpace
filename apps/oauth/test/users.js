/* eslint handle-callback-err: "off"*/

process.env.NODE_ENV = 'test'

const User = require('../app/models/user')
const faker = require('faker')


const server = require('../server')
// eslint-disable-next-line no-unused-vars
const should = chai.should()
const loginDetails = {
  admin: {
    id: '5aa1c2c35ef7a4e97b5e995a',
    email: 'admin@admin.com',
    password: '12345'
  },
  user: {
    id: '5aa1c2c35ef7a4e97b5e995b',
    email: 'user@user.com',
    password: '12345'
  }
}
const tokens = {
  admin: '',
  user: ''
}

const email = faker.internet.email()
const createdID = []



describe('*********** USERS ***********', () => {
  describe('/POST login', () => {
    test('it should GET token as admin', (done) => {
      request(server)
        .post('/login')
        .send(loginDetails.admin)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.should.have.property('token')
          tokens.admin = res.body.token
          done()
        })
    })
    test('it should GET token as user', (done) => {
      request(server)
        .post('/login')
        .send(loginDetails.user)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.should.have.property('token')
          tokens.user = res.body.token
          done()
        })
    })
  })
  describe('/GET users', () => {
    test('it should NOT be able to consume the route since no token was sent', (done) => {
      request(server)
        .get('/users')
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
    test('it should GET all the users', (done) => {
      request(server)
        .get('/users')
        .set('Authorization', `Bearer ${tokens.admin}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.docs.should.be.a('array')
          done()
        })
    })
    test('it should GET the users with filters', (done) => {
      request(server)
        .get('/users?filter=admin&fields=name,email,city,country,phone')
        .set('Authorization', `Bearer ${tokens.admin}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.docs.should.be.a('array')
          res.body.docs.should.have.lengthOf(1)
          res.body.docs[0].should.have.property('email').eql('admin@admin.com')
          done()
        })
    })
  })
  describe('/POST user', () => {
    test('it should NOT POST a user without name', (done) => {
      const user = {}
      request(server)
        .post('/users')
        .set('Authorization', `Bearer ${tokens.admin}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('errors')
          done()
        })
    })
    test('it should POST a user ', (done) => {
      const user = {
        name: faker.random.words(),
        email,
        password: faker.random.words(),
        role: 'admin',
        urlTwitter: faker.internet.url(),
        urlGitHub: faker.internet.url(),
        phone: faker.phone.phoneNumber(),
        city: faker.random.words(),
        country: faker.random.words()
      }
      request(server)
        .post('/users')
        .set('Authorization', `Bearer ${tokens.admin}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.include.keys('_id', 'name', 'email', 'verification')
          createdID.push(res.body._id)
          done()
        })
    })
    test('it should NOT POST a user with email that already exists', (done) => {
      const user = {
        name: faker.random.words(),
        email,
        password: faker.random.words(),
        role: 'admin'
      }
      request(server)
        .post('/users')
        .set('Authorization', `Bearer ${tokens.admin}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('errors')
          done()
        })
    })
    test('it should NOT POST a user with not known role', (done) => {
      const user = {
        name: faker.random.words(),
        email,
        password: faker.random.words(),
        role: faker.random.words()
      }
      request(server)
        .post('/users')
        .set('Authorization', `Bearer ${tokens.admin}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('errors')
          done()
        })
    })
  })
  describe('/GET/:id user', () => {
    test('it should GET a user by the given id', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .get(`/users/${id}`)
        .set('Authorization', `Bearer ${tokens.admin}`)
        .end((error, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('name')
          res.body.should.have.property('_id').eql(id)
          done()
        })
    })
  })
  describe('/PATCH/:id user', () => {
    test('it should UPDATE a user given the id', (done) => {
      const id = createdID.slice(-1).pop()
      const user = {
        name: 'JS123456',
        email: 'emailthatalreadyexists@email.com',
        role: 'admin',
        urlTwitter: faker.internet.url(),
        urlGitHub: faker.internet.url(),
        phone: faker.phone.phoneNumber(),
        city: faker.random.words(),
        country: faker.random.words()
      }
      request(server)
        .patch(`/users/${id}`)
        .set('Authorization', `Bearer ${tokens.admin}`)
        .send(user)
        .end((error, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('_id').eql(id)
          res.body.should.have.property('name').eql('JS123456')
          res.body.should.have
            .property('email')
            .eql('emailthatalreadyexists@email.com')
          createdID.push(res.body._id)
          done()
        })
    })
    test('it should NOT UPDATE a user with email that already exists', (done) => {
      const id = createdID.slice(-1).pop()
      const user = {
        name: faker.random.words(),
        email: 'admin@admin.com',
        role: 'admin'
      }
      request(server)
        .patch(`/users/${id}`)
        .set('Authorization', `Bearer ${tokens.admin}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('errors')
          done()
        })
    })
    test('it should NOT UPDATE another user if not an admin', (done) => {
      const id = createdID.slice(-1).pop()
      const user = {
        name: faker.random.words(),
        email: 'toto@toto.com',
        role: 'user'
      }
      request(server)
        .patch(`/users/${id}`)
        .set('Authorization', `Bearer ${tokens.user}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(401)
          res.body.should.be.a('object')
          res.body.should.have.property('errors')
          done()
        })
    })
  })
  describe('/DELETE/:id user', () => {
    test('it should DELETE a user given the id', (done) => {
      const user = {
        name: faker.random.words(),
        email: faker.internet.email(),
        password: faker.random.words(),
        role: 'admin',
        urlTwitter: faker.internet.url(),
        urlGitHub: faker.internet.url(),
        phone: faker.phone.phoneNumber(),
        city: faker.random.words(),
        country: faker.random.words()
      }
      request(server)
        .post('/users')
        .set('Authorization', `Bearer ${tokens.admin}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.include.keys('_id', 'name', 'email', 'verification')
          request(server)
            .delete(`/users/${res.body._id}`)
            .set('Authorization', `Bearer ${tokens.admin}`)
            .end((error, result) => {
              result.should.have.status(200)
              result.body.should.be.a('object')
              result.body.should.have.property('msg').eql('DELETED')
              done()
            })
        })
    })
  })

  after(() => {
    createdID.forEach((id) => {
      User.findByIdAndRemove(id, (err) => {
        if (err) {
          console.log(err)
        }
      })
    })
  })
})
