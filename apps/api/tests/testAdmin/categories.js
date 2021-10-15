/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const category = require('../../app/models/category')
const server = require('../../server')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''
const createdID = []
const name = faker.random.words()
const icon = faker.random.words()
const description = faker.random.words()
const newCategory = faker.random.words()
const url = process.env.URL_TEST_ADMIN


describe('*********** CATEGORIES_ADMIN ***********', () => {
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

  describe('/POST categories', () => {
    test('it should NOT POST a category without category', (done) => {
      const categoryPostOne = {}
      request(server)
        .post(`${url}/categories`)
        .set('Authorization', `Bearer ${token}`)
        .send(categoryPostOne)
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
    test('it should POST a category ', (done) => {
      const categoryPostTwo = {
        name,
        icon,
        description
      }
      request(server)
        .post(`${url}/categories`)
        .set('Authorization', `Bearer ${token}`)
        .send(categoryPostTwo)
        .end((err, res) => {
          expect(res).have.status(201)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['_id', 'name', 'description']))
          expect(body).have.property('name').toEqual(name)
          expect(body).have.property('description').toEqual(description)
          expect(typeof body).toBe('string')
          createdID.push(res.body._id)
          done()
        })
    })
  })

  describe('/GET/:id categories', () => {
    test('it should GET a categories by the given id', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .get(`${url}/categories/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['name', 'description', '_id']))
          expect(body).have.property('_id').toEqual(id)
          done()
        })
    })
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .get(`${url}/categories/${id}`)
          .end((err, res) => {
            expect(res).have.status(401)
            done()
          })
      }
    )
  })

  describe('/PATCH/:id categories', () => {
    test('it should UPDATE a category given the id', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .patch(`${url}/categories/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: newCategory,
          icon: faker.random.words(),
          description: faker.random.words()
        })
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).have.property('_id').toEqual(id)
          expect(body).have.property('name').toEqual(newCategory)
          expect(typeof body._id).toBe('string')
          createdID.push(res.body._id)
          done()
        })
    })
    test('it should not UPDATE a departure empty', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .patch(`${url}/categories/${id}`)
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
          .patch(`${url}/categories/${id}`)
          .send({
            name: newCategory,
            icon: faker.random.words(),
            description: faker.random.words()
          })
          .end((err, res) => {
            expect(res).have.status(401)
            done()
          })
      }
    )
  })

  describe('/DELETE/:id category', () => {
    test('it should DELETE a category given the id', (done) => {
      const categorydelete = {
        name: faker.random.words(),
        icon: faker.random.words(),
        description: faker.random.words()
      }
      request(server)
        .post(`${url}/categories`)
        .set('Authorization', `Bearer ${token}`)
        .send(categorydelete)
        .end((err, res) => {
          expect(res).have.status(201)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.arrayContaining(['_id', 'name', 'icon', 'description']))
          chai
            .request(server)
            .delete(`${url}/categories/${res.body._id}`)
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
      category.findByIdAndRemove(id, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
