/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

const faker = require('faker')
const _ = require('lodash')
const comment = require('../../app/models/comments')
const server = require('../../superTest')
const request = require('supertest')

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


describe('*********** COMMENTS_ADMIN ***********', () => {
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
    }, 10000)
  })

  describe('/POST comments', () => {
    test('it should NOT POST a comment without comment', (done) => {
      const commentPostOne = {}
      request(server)
        .post(`${url}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send(commentPostOne)
        .expect(422)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          const { errors } = body
          expect(errors.msg).toBeInstanceOf(Array)
          done()
        })
    })
    test('it should POST a comment ', (done) => {
      const commentPostTwo = {
        vote: 3,
        content,
        idUser,
        status: 'publish',
        tags: ['tren']
      }
      request(server)
        .post(`${url}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send(commentPostTwo)
        .expect(201)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            vote: expect.any(Number),
            content: expect.any(String),
          }))
          expect(body).toHaveProperty('status', 'publish')
          expect(body).toHaveProperty('content', content)
          createdID.push(res.body._id)
          done()
        })
    })
  })

  describe('/GET comments', () => {
    test('it should GET all the comments', (done) => {
      request(server)
        .get(`${url}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          const { body } = res
          const { docs } = body
          const commentFirst = _.head(docs)
          expect(body).toBeInstanceOf(Object)
          expect(docs).toHaveLength(1)
          expect(commentFirst).toEqual(expect.objectContaining({
            _id: expect.any(String),
            vote: expect.any(Number),
            content: expect.any(String),
          }))
          id = commentFirst._id
          done()
        })
    })
    test('it should not GET comments unauthorized', (done) => {
      request(server)
        .get(`${url}/comments`)
        .expect(401)
        .end((err, res) => {
          done()
        })
    })
  })

  describe('/GET/:id comments', () => {
    test('it should GET a comments by the given id', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .get(`${url}/comments/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((error, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            tags: expect.any(Array),
            status: expect.any(String),
          }))
          expect(body).toHaveProperty('_id', id)
          done()
        })
    })
    test('it should NOT be able to consume the route since no token was sent', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .get(`${url}/comments/${id}`)
        .expect(401)
        .end((err, res) => {
          done()
        })
    }
    )
  })

  describe('/PATCH/:id comments', () => {
    test('it should UPDATE a comment given the id', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .patch(`${url}/comments/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          vote: 3,
          content,
          idUser,
          status: 'publish',
          tags: ['naturaleza']
        })
        .expect(200)
        .end((error, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('_id', id)
          expect(body).toHaveProperty('content', content)
          createdID.push(res.body._id)
          done()
        })
    })
    test('it should not UPDATE a comment empty', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .patch(`${url}/comments/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(422)
        .end((error, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          done()
        })
    })
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .patch(`${url}/comments/${id}`)
          .send({
            vote: 3,
            content,
            idUser,
            status: 'publish',
            tags: ['naturaleza']
          })
          .expect(401)
          .end((err, res) => {
            done()
          })
      }
    )
  })

  describe('/DELETE/:id comment', () => {
    test('it should DELETE a comment given the id', (done) => {
      const commentdelete = {
        vote: 3,
        content,
        idUser,
        status: 'publish',
        tags: ['naturaleza']
      }
      request(server)
        .post(`${url}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send(commentdelete)
        .expect(201)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            vote: expect.any(Number),
            tags: expect.any(Array),
            status: expect.any(String),
          }))
          request(server)
            .delete(`${url}/comments/${res.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((error, result) => {
              const { body: newBody } = result
              expect(newBody).toBeInstanceOf(Object)
              expect(newBody).toHaveProperty('msg', 'DELETED')
              done()
            })
        })
    })
  })

  afterAll(() => {
    createdID.forEach((id) => {
      comment.findByIdAndRemove(id, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
