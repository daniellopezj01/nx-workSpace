/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'
const _ = require('lodash')


const server = require('../../server')
const Blog = require('../../app/models/blog')
const loginDetails = {
  email: 'user@user.com',
  password: '12345'
}
let id = ''
let slugBlog = ''
const createdID = []


const url = process.env.URL_TEST_USER

describe('*********** BLOGS_USER ***********', () => {
  describe('/POST login', () => {
    test('it should GET token user', (done) => {
      request(server)
        .post(`${url}/login`)
        .send(loginDetails)
        .end((err, res) => {
          expect(res).have.status(200)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.arrayContaining(['accessToken', 'user']))
          done()
        })
    })
  })

  describe('/GET blogs', () => {
    test('it should GET all the blogs', (done) => {
      request(server)
        .get(`${url}/blogs`)
        .end((err, res) => {
          const { body } = res
          const { docs } = body
          const blog = _.head(docs)
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(docs).toHaveLength(1)
          expect(Array.isArray(docs)).toBe(true)
          id = blog._id
          slugBlog = blog.slug
          expect(blog).toEqual(expect.arrayContaining(['_id', 'title', 'description']))
          expect(body).toBeInstanceOf(Object)
          done()
        })
    })
    describe('/GET/:id blogs', () => {
      test('it should not GET a blogs by error id', (done) => {
        request(server)
          .get(`${url}/blogs/id_error`)
          .end((error, res) => {
            expect(res).have.status(404)
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('errors')
            expect(body).have.property('errors').toEqual({ msg: 'NOT_FOUND' })
            done()
          })
      })
      test('it should GET a blogs by the given id', (done) => {
        request(server)
          .get(`${url}/blogs/${id}`)
          .end((error, res) => {
            const { body } = res
            expect(res).have.status(200)
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.arrayContaining(['_id', 'title', 'description']))
            expect(body).have.property('_id').toEqual(`${id}`)
            done()
          })
      })
      test('it should GET a blogs by the given slug', (done) => {
        request(server)
          .get(`${url}/blogs/${slugBlog}`)
          .end((error, res) => {
            const { body } = res
            expect(res).have.status(200)
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.arrayContaining(['_id', 'title', 'description']))
            expect(body).have.property('slug').toEqual(`${slugBlog}`)
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
