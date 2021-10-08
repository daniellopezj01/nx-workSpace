/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
process.env.NODE_ENV = 'test'

const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const _ = require('lodash')
const comment = require('../../app/models/comments')
const server = require('../../server')
// eslint-disable-next-line no-unused-vars
const should = chai.should()
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''
const content = faker.random.words()
const createdID = []
const url = process.env.URL_TEST_ADMIN
const idUser = '5aa1c2c35ef7a4e97b5e995a'
chai.use(chaiHttp)

describe('*********** COMMENTS_ADMIN ***********', () => {
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

  describe('/POST comments', () => {
    it('it should NOT POST a comment without comment', (done) => {
      const commentPostOne = {}
      chai
        .request(server)
        .post(`${url}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send(commentPostOne)
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
    it('it should POST a comment ', (done) => {
      const commentPostTwo = {
        vote: 3,
        content,
        idUser,
        status: 'publish',
        tags: ['tren']
      }
      chai
        .request(server)
        .post(`${url}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send(commentPostTwo)
        .end((err, res) => {
          res.should.have.status(201)
          const { body } = res
          body.should.be.a('object')
          body.should.include.keys('_id', 'vote', 'content')
          body.should.have.property('status').eql('publish')
          body.should.have.property('content').eql(content)
          body.should.have.property('_id').be.a('string')
          createdID.push(res.body._id)
          done()
        })
    })
  })

  describe('/GET comments', () => {
    it('it should GET all the comments', (done) => {
      chai
        .request(server)
        .get(`${url}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          const { docs } = body
          const commentFirst = _.head(docs)
          res.should.have.status(200)
          body.should.be.an('object')
          docs.should.have.lengthOf(1)
          id = commentFirst._id
          commentFirst.should.include.keys('_id', 'content', 'vote')
          done()
        })
    })
    it('it should not GET comments unauthorized', (done) => {
      chai
        .request(server)
        .get(`${url}/comments`)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })

  describe('/GET/:id comments', () => {
    it('it should GET a comments by the given id', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .get(`${url}/comments/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.include.keys('status', 'tags', '_id')
          body.should.have.property('_id').eql(id)
          done()
        })
    })
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .get(`${url}/comments/${id}`)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })

  describe('/PATCH/:id comments', () => {
    it('it should UPDATE a comment given the id', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .patch(`${url}/comments/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          vote: 3,
          content,
          idUser,
          status: 'publish',
          tags: ['naturaleza']
        })
        .end((error, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.have.property('_id').eql(id)
          body.should.have.property('content').eql(content)
          body._id.should.be.a('string')
          createdID.push(res.body._id)
          done()
        })
    })
    it('it should not UPDATE a comment empty', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .patch(`${url}/comments/${id}`)
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
        .patch(`${url}/comments/${id}`)
        .send({
          vote: 3,
          content,
          idUser,
          status: 'publish',
          tags: ['naturaleza']
        })
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })

  describe('/DELETE/:id comment', () => {
    it('it should DELETE a comment given the id', (done) => {
      const commentdelete = {
        vote: 3,
        content,
        idUser,
        status: 'publish',
        tags: ['naturaleza']
      }
      chai
        .request(server)
        .post(`${url}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send(commentdelete)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.include.keys(
            '_id',
            'vote',
            'status',
            'tags'
          )
          chai
            .request(server)
            .delete(`${url}/comments/${res.body._id}`)
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
      comment.findByIdAndRemove(id, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
