/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server')
const Blog = require('../../app/models/blog')
// eslint-disable-next-line no-unused-vars
const should = chai.should()
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}

let token = {}
const createdID = []
const title = faker.random.words()
const description = faker.random.words()

const newtitle = faker.random.words()
const newDescription = faker.random.words()

chai.use(chaiHttp)
const url = process.env.URL_TEST_ADMIN

describe('*********** BLOGS_ADMIN ***********', () => {
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
  describe('/POST blogs', () => {
    it('it should NOT POST a blogs without blogs', (done) => {
      const blogPostOne = {}
      chai
        .request(server)
        .post(`${url}/blogs`)
        .set('Authorization', `Bearer ${token}`)
        .send(blogPostOne)
        .end((err, res) => {
          res.should.have.status(422)
          const { body } = res
          body.should.be.a('object')
          body.should.have.property('errors')
          const { errors } = body
          errors.should.have.property('msg').be.a('array').length(4)
          done()
        })
    })
    it('it should POST a blogs ', (done) => {
      const blogsPostTwo = {
        title,
        description
      }
      chai
        .request(server)
        .post(`${url}/blogs`)
        .set('Authorization', `Bearer ${token}`)
        .send(blogsPostTwo)
        .end((err, res) => {
          res.should.have.status(201)
          const { body } = res
          body.should.be.a('object')
          body.should.have.property('title').eql(title)
          body.should.have.property('description').eql(description)
          body.should.include.keys(
            '_id',
            'title',
            'description',
            'userCreator',
            'slug'
          )
          createdID.push(res.body._id)
          done()
        })
    })
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      const blogsPostTwo = {
        title,
        description
      }
      chai
        .request(server)
        .post(`${url}/blogs`)
        .send(blogsPostTwo)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })

  describe('/PATCH/:id blogs', () => {
    it('it should UPDATE a blogs given the id', (done) => {
      const firstBlog = createdID.slice(-1).pop()
      chai
        .request(server)
        .patch(`${url}/blogs/${firstBlog}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: newtitle,
          description: newDescription
        })
        .end((error, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.include.keys(
            '_id',
            'title',
            'description',
            'userCreator',
            'slug'
          )
          body.should.have.property('_id').eql(firstBlog)
          body.should.have.property('title').eql(newtitle)
          body.should.have.property('description').eql(newDescription)
          createdID.push(res.body._id)
          done()
        })
    })
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      const secondId = createdID.slice(-1).pop()
      chai
        .request(server)
        .patch(`${url}/blogs/${secondId}`)
        .send({
          title: newtitle,
          description: newDescription
        })
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })

  describe('/DELETE/:id blogs', () => {
    it('it should DELETE a blogs given the id', (done) => {
      const blogsdelete = {
        title: faker.random.words(),
        description: faker.random.words()
      }
      chai
        .request(server)
        .post(`${url}/blogs`)
        .set('Authorization', `Bearer ${token}`)
        .send(blogsdelete)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.include.keys('_id', 'description', 'title', 'slug')
          chai
            .request(server)
            .delete(`${url}/blogs/${res.body._id}`)
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
    createdID.forEach((idBlog) => {
      Blog.findByIdAndRemove(idBlog, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
