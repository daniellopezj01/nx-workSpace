/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'
const _ = require('lodash')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server')
const Blog = require('../../app/models/blog')
// eslint-disable-next-line no-unused-vars
const should = chai.should()
const loginDetails = {
  email: 'user@user.com',
  password: '12345'
}
let id = ''
let slugBlog = ''
const createdID = []

// chai.use(chaiHttp)
const url = process.env.URL_TEST_USER

describe('*********** BLOGS_USER ***********', () => {
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
          done()
        })
    })
  })

  describe('/GET blogs', () => {
    it('it should GET all the blogs', (done) => {
      chai
        .request(server)
        .get(`${url}/blogs`)
        .end((err, res) => {
          const { body } = res
          const { docs } = body
          const blog = _.head(docs)
          res.should.have.status(200)
          body.should.be.an('object')
          docs.should.have.lengthOf(1)
          docs.should.be.a('array')
          id = blog._id
          slugBlog = blog.slug
          blog.should.include.keys('_id', 'title', 'description')
          body.should.be.an('object')
          done()
        })
    })
    describe('/GET/:id blogs', () => {
      it('it should not GET a blogs by error id', (done) => {
        chai
          .request(server)
          .get(`${url}/blogs/id_error`)
          .end((error, res) => {
            res.should.have.status(404)
            const { body } = res
            body.should.be.a('object')
            body.should.have.property('errors')
            body.should.have.property('errors').eql({ msg: 'NOT_FOUND' })
            done()
          })
      })
      it('it should GET a blogs by the given id', (done) => {
        chai
          .request(server)
          .get(`${url}/blogs/${id}`)
          .end((error, res) => {
            const { body } = res
            res.should.have.status(200)
            body.should.be.a('object')
            body.should.include.keys('_id', 'title', 'description')
            body.should.have.property('_id').eql(`${id}`)
            done()
          })
      })
      it('it should GET a blogs by the given slug', (done) => {
        chai
          .request(server)
          .get(`${url}/blogs/${slugBlog}`)
          .end((error, res) => {
            const { body } = res
            res.should.have.status(200)
            body.should.be.a('object')
            body.should.include.keys('_id', 'title', 'description')
            body.should.have.property('slug').eql(`${slugBlog}`)
            done()
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
})
