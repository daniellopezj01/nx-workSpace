/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const _ = require('lodash')
const comment = require('../../app/models/comments')
const server = require('../../server')
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

  describe('/POST comments', () => {
    test('it should NOT POST a comment without comment', (done) => {
      const commentPostOne = {}
      request(server)
        .post(`${url}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send(commentPostOne)
        .end((err, res) => {
          expect(res).have.status(422)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          const { errors } = body
          expect(Array.isArray(errors)).toBe(true)
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
        .end((err, res) => {
          expect(res).have.status(201)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['_id', 'vote', 'content']))
          expect(body).have.property('status').toBe('publish')
          expect(body).have.property('content').toEqual(content)
          expect(typeof body).toBe('string')
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
        .end((err, res) => {
          const { body } = res
          const { docs } = body
          const commentFirst = _.head(docs)
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(docs).toHaveLength(1)
          id = commentFirst._id
          expect(commentFirst).toEqual(expect.arrayContaining(['_id', 'content', 'vote']))
          done()
        })
    })
    test('it should not GET comments unauthorized', (done) => {
      request(server)
        .get(`${url}/comments`)
        .end((err, res) => {
          expect(res).have.status(401)
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
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['status', 'tags', '_id']))
          expect(body).have.property('_id').toEqual(id)
          done()
        })
    })
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .get(`${url}/comments/${id}`)
          .end((err, res) => {
            expect(res).have.status(401)
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
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).have.property('_id').toEqual(id)
          expect(body).have.property('content').toEqual(content)
          expect(typeof body._id).toBe('string')
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
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(422)
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
          .end((err, res) => {
            expect(res).have.status(401)
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
        .end((err, res) => {
          expect(res).have.status(201)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.arrayContaining(['_id', 'vote', 'status', 'tags']))
          chai
            .request(server)
            .delete(`${url}/comments/${res.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((error, result) => {
              const { body } = result
              expect(result).have.status(200)
              expect(body).toBeInstanceOf(Object)
              expect(body).have.property('msg').toBe('DELETED')
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
