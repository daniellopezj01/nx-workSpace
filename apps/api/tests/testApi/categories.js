/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'
const _ = require('lodash')


const modalCategory = require('../../app/models/category')
const server = require('../../server')
const loginDetails = {
  email: 'user@user.com',
  password: '12345'
}
const createdID = []

const url = process.env.URL_TEST_USER


describe('*********** CATEGORIES_USER ***********', () => {
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

  describe('/GET categories', () => {
    test('it should GET all the categories', (done) => {
      request(server)
        .get(`${url}/categories`)
        .end((err, res) => {
          const { body } = res
          const { docs } = body
          const category = _.head(docs)
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(docs).toHaveLength(1)
          id = category._id
          expect(category).toEqual(expect.arrayContaining(['_id', 'name', 'description']))
          done()
        })
    })
    test('it should NOT GET the categories with filters', (done) => {
      request(server)
        .get(`${url}/categories?filter=notExist&fields=name`)
        .end((err, res) => {
          expect(res).have.status(200)
          expect(res.body).toBeInstanceOf(Object)
          const { body } = res
          const { docs, totalDocs } = body
          expect(totalDocs).toBeInstanceOf(Number)
          expect(body).have.property('totalDocs').toBe(0)
          expect(docs).toHaveLength(0)
          done()
        })
    })
    test('it should GET the categories with filters', (done) => {
      request(server)
        .get(`${url}/categories?filter=technology&fields=name`)
        .end((err, res) => {
          expect(res).have.status(200)
          expect(res.body).toBeInstanceOf(Object)
          const { body } = res
          const { docs } = body
          const category = _.head(docs)
          expect(body).toBeInstanceOf(Object)
          expect(docs).toHaveLength(1)
          expect(category).toEqual(expect.arrayContaining(['_id', 'name', 'description']))
          expect(category).have.property('name').toBe('technology')
          done()
        })
    })
  })
  afterAll(() => {
    createdID.forEach((idCategory) => {
      modalCategory.findByIdAndRemove(idCategory, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
