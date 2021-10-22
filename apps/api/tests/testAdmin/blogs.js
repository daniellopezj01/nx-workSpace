/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

const faker = require('faker')
// const server = require('../../superTest')
const request = require('supertest')
const Blog = require('../../app/models/blog')
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

const url = process.env.URL_TEST_ADMIN
module.exports = (server) => {
  describe('*********** BLOGS_ADMIN ***********', () => {
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
      }, 1000)
    })
    describe('/POST blogs', () => {
      test('it should NOT POST a blogs without blogs', (done) => {
        const blogPostOne = {}
        request(server)
          .post(`${url}/blogs/`)
          .set('Authorization', `Bearer ${token}`)
          .send(blogPostOne)
          .expect(422)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('errors')
            const { errors } = body
            expect(errors.msg).toBeInstanceOf(Array)
            expect(errors.msg).toHaveLength(4)
            done()
          })
      }, 1000)
      test('it should POST a blogs ', (done) => {
        const blogsPostTwo = {
          title,
          description
        }
        request(server)
          .post(`${url}/blogs/`)
          .set('Authorization', `Bearer ${token}`)
          .send(blogsPostTwo)
          .expect(201)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              _id: expect.any(String),
              title: expect.any(String),
              description: expect.any(String),
              userCreator: expect.any(Object),
              slug: expect.any(String),
            }))
            expect(body).toHaveProperty('title', title)
            expect(body).toHaveProperty('description', description)
            createdID.push(body._id)
            done()
          })
      }, 1000)
      test(
        'it should NOT be able to consume the route since no token was sent',
        (done) => {
          const blogsPostTwo = {
            title,
            description
          }
          request(server)
            .post(`${url}/blogs`)
            .send(blogsPostTwo)
            .expect(401)
            .end((err, res) => {
              done()
            })
        }
      )
    })

    describe('/PATCH/:id blogs', () => {
      test('it should UPDATE a blogs given the id', (done) => {
        const firstBlog = createdID.slice(-1).pop()
        request(server)
          .patch(`${url}/blogs/${firstBlog}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: newtitle,
            description: newDescription
          })
          .expect(200)
          .end((error, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              _id: expect.any(String),
              title: expect.any(String),
              description: expect.any(String),
              userCreator: expect.any(Object),
              slug: expect.any(String),
            }))
            expect(body).toHaveProperty('_id', firstBlog)
            expect(body).toHaveProperty('title', newtitle)
            expect(body).toHaveProperty('description', newDescription)
            // expect(body).have.property('description').toEqual(newDescription)
            createdID.push(res.body._id)
            done()
          })
      }, 1000)
      test(
        'it should NOT be able to consume the route since no token was sent',
        (done) => {
          const secondId = createdID.slice(-1).pop()
          request(server)
            .patch(`${url}/blogs/${secondId}`)
            .send({
              title: newtitle,
              description: newDescription
            })
            .expect(401)
            .end((err, res) => {
              done()
            })
        }, 1000)
    })

    describe('/DELETE/:id blogs', () => {
      test('it should DELETE a blogs given the id', (done) => {
        const blogsdelete = {
          title: faker.random.words(),
          description: faker.random.words()
        }
        request(server)
          .post(`${url}/blogs/`)
          .set('Authorization', `Bearer ${token}`)
          .send(blogsdelete)
          .expect(201)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              _id: expect.any(String),
              title: expect.any(String),
              description: expect.any(String),
              userCreator: expect.any(Object),
              slug: expect.any(String),
            }))
            request(server)
              .delete(`${url}/blogs/${res.body._id}`)
              .set('Authorization', `Bearer ${token}`)
              .expect(200)
              .end((error, result) => {
                const { body: newBody } = result
                expect(newBody).toBeInstanceOf(Object)
                expect(newBody).toMatchObject({ msg: 'DELETED' })
                done()
              })
          })
      }, 1000)
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
}