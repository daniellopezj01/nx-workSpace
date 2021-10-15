/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server')
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

describe('*********** BLOGS_ADMIN ***********', () => {
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
  describe('/POST blogs', () => {
    test('it should NOT POST a blogs without blogs', (done) => {
      const blogPostOne = {}
      request(server)
        .post(`${url}/blogs`)
        .set('Authorization', `Bearer ${token}`)
        .send(blogPostOne)
        .end((err, res) => {
          expect(res).have.status(422)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          const { errors } = body
          expect(errors).toHaveProperty('msg').be.a('array').toHaveLength(4)
          done()
        })
    })
    test('it should POST a blogs ', (done) => {
      const blogsPostTwo = {
        title,
        description
      }
      request(server)
        .post(`${url}/blogs`)
        .set('Authorization', `Bearer ${token}`)
        .send(blogsPostTwo)
        .end((err, res) => {
          expect(res).have.status(201)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).have.property('title').toEqual(title)
          expect(body).have.property('description').toEqual(description)
          expect(body).toEqual(
            expect.arrayContaining(['_id', 'title', 'description', 'userCreator', 'slug'])
          )
          createdID.push(res.body._id)
          done()
        })
    })
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        const blogsPostTwo = {
          title,
          description
        }
        request(server)
          .post(`${url}/blogs`)
          .send(blogsPostTwo)
          .end((err, res) => {
            expect(res).have.status(401)
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
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(
            expect.arrayContaining(['_id', 'title', 'description', 'userCreator', 'slug'])
          )
          expect(body).have.property('_id').toEqual(firstBlog)
          expect(body).have.property('title').toEqual(newtitle)
          expect(body).have.property('description').toEqual(newDescription)
          createdID.push(res.body._id)
          done()
        })
    })
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        const secondId = createdID.slice(-1).pop()
        request(server)
          .patch(`${url}/blogs/${secondId}`)
          .send({
            title: newtitle,
            description: newDescription
          })
          .end((err, res) => {
            expect(res).have.status(401)
            done()
          })
      }
    )
  })

  describe('/DELETE/:id blogs', () => {
    test('it should DELETE a blogs given the id', (done) => {
      const blogsdelete = {
        title: faker.random.words(),
        description: faker.random.words()
      }
      request(server)
        .post(`${url}/blogs`)
        .set('Authorization', `Bearer ${token}`)
        .send(blogsdelete)
        .end((err, res) => {
          expect(res).have.status(201)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.arrayContaining(['_id', 'description', 'title', 'slug']))
          chai
            .request(server)
            .delete(`${url}/blogs/${res.body._id}`)
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
    createdID.forEach((idBlog) => {
      Blog.findByIdAndRemove(idBlog, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
