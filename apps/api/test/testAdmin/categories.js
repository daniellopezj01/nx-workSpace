/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const category = require('../../app/models/category')
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
const name = faker.random.words()
const icon = faker.random.words()
const description = faker.random.words()
const newCategory = faker.random.words()
const url = process.env.URL_TEST_ADMIN
chai.use(chaiHttp)

describe('*********** CATEGORIES_ADMIN ***********', () => {
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

  describe('/POST categories', () => {
    it('it should NOT POST a category without category', (done) => {
      const categoryPostOne = {}
      chai
        .request(server)
        .post(`${url}/categories`)
        .set('Authorization', `Bearer ${token}`)
        .send(categoryPostOne)
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
    it('it should POST a category ', (done) => {
      const categoryPostTwo = {
        name,
        icon,
        description
      }
      chai
        .request(server)
        .post(`${url}/categories`)
        .set('Authorization', `Bearer ${token}`)
        .send(categoryPostTwo)
        .end((err, res) => {
          res.should.have.status(201)
          const { body } = res
          body.should.be.a('object')
          body.should.include.keys('_id', 'name', 'description')
          body.should.have.property('name').eql(name)
          body.should.have.property('description').eql(description)
          body.should.have.property('_id').be.a('string')
          createdID.push(res.body._id)
          done()
        })
    })
  })

  describe('/GET/:id categories', () => {
    it('it should GET a categories by the given id', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .get(`${url}/categories/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.include.keys('name', 'description', '_id')
          body.should.have.property('_id').eql(id)
          done()
        })
    })
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .get(`${url}/categories/${id}`)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })

  describe('/PATCH/:id categories', () => {
    it('it should UPDATE a category given the id', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .patch(`${url}/categories/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: newCategory,
          icon: faker.random.words(),
          description: faker.random.words()
        })
        .end((error, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.have.property('_id').eql(id)
          body.should.have.property('name').eql(newCategory)
          body._id.should.be.a('string')
          createdID.push(res.body._id)
          done()
        })
    })
    it('it should not UPDATE a departure empty', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .patch(`${url}/categories/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .end((error, res) => {
          const { body } = res
          res.should.have.status(422)
          body.should.be.a('object')
          body.should.have.property('errors')
          done()
        })
    })
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .patch(`${url}/categories/${id}`)
        .send({
          name: newCategory,
          icon: faker.random.words(),
          description: faker.random.words()
        })
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })

  describe('/DELETE/:id category', () => {
    it('it should DELETE a category given the id', (done) => {
      const categorydelete = {
        name: faker.random.words(),
        icon: faker.random.words(),
        description: faker.random.words()
      }
      chai
        .request(server)
        .post(`${url}/categories`)
        .set('Authorization', `Bearer ${token}`)
        .send(categorydelete)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.include.keys('_id', 'name', 'icon', 'description')
          chai
            .request(server)
            .delete(`${url}/categories/${res.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((error, result) => {
              const { body } = result
              result.should.have.status(200)
              body.should.be.a('object')
              body.should.have.property('msg').eql('DELETED')
              done()
            })
        })
    })
  })

  after(() => {
    createdID.forEach((id) => {
      category.findByIdAndRemove(id, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
