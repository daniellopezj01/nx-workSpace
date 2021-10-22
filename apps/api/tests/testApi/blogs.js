/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'
const _ = require('lodash')
const request = require('supertest')
const Blog = require('../../app/models/blog')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let id = ''
let slugBlog = ''
const createdID = []

const url = process.env.URL_TEST_USER

module.exports = (server) => {
  describe('*********** BLOGS_USER ***********', () => {
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
      }, 1000)
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
      }, 1500)
    })

    describe('/GET blogs', () => {
      test('it should GET all the blogs', (done) => {
        request(server)
          .get(`${url}/blogs`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            const { docs } = body
            const blog = _.head(docs)
            expect(body).toBeInstanceOf(Object)
            expect(docs).toBeInstanceOf(Array)
            expect(docs).toHaveLength(1)

            // expect(blog).toEqual(expect.arrayContaining(['_id', 'title', 'description']))
            expect(blog).toEqual(expect.objectContaining({
              _id: expect.any(String),
              title: expect.any(String),
              description: expect.any(String),
            }))
            id = blog._id
            slugBlog = blog.slug
            done()
          })
      })
      describe('/GET/:id blogs', () => {
        test('it should not GET a blogs by error id', (done) => {
          request(server)
            .get(`${url}/blogs/id_error`)
            .expect(404)
            .end((error, res) => {
              const { body } = res
              expect(body).toBeInstanceOf(Object)
              expect(body).toHaveProperty('errors')
              expect(body).toHaveProperty('errors', { msg: 'NOT_FOUND' })
              done()
            })
        })
        test('it should GET a blogs by the given id', (done) => {
          request(server)
            .get(`${url}/blogs/${id}`)
            .expect(200)
            .end((error, res) => {
              const { body } = res
              expect(body).toBeInstanceOf(Object)
              expect(body).toEqual(expect.objectContaining({
                _id: expect.any(String),
                title: expect.any(String),
                description: expect.any(String),
              }))
              expect(body).toHaveProperty('_id', `${id}`)
              done()
            })
        })
        test('it should GET a blogs by the given slug', (done) => {
          request(server)
            .get(`${url}/blogs/${slugBlog}`)
            .expect(200)
            .end((error, res) => {
              const { body } = res
              expect(body).toBeInstanceOf(Object)
              expect(body).toEqual(expect.objectContaining({
                _id: expect.any(String),
                title: expect.any(String),
                description: expect.any(String),
              }))
              expect(body).toHaveProperty('slug', `${slugBlog}`)
              done()
            })
        })
      })

      afterAll(() => {
        createdID.forEach((idBlog) => {
          Blog.findByIdAndRemove(idBlog, (err) => {
            if (err) {
              // console.log(err)
            }
          })
        })
      })
    })
  })
}