/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

const faker = require('faker')
const server = require('../../superTest')
const request = require('supertest')
const category = require('../../app/models/category')
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

  describe('/POST categories', () => {
    test('it should NOT POST a category without category', (done) => {
      const categoryPostOne = {}
      request(server)
        .post(`${url}/categories`)
        .set('Authorization', `Bearer ${token}`)
        .send(categoryPostOne)
        .expect(422)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          const { errors } = body
          expect(errors).toBeInstanceOf(Object)
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
        .expect(201)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String)
          }))
          // expect(body).toEqual(expect.arrayContaining(['_id', 'name', 'description']))
          // expect(body).have.property('name').toEqual(name)
          // expect(body).have.property('description').toEqual(description)
          // expect(typeof body).toBe('string')
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
        .expect(200)
        .end((error, res) => {
          const { body } = res

          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String)
          }))
          // expect(body).toEqual(expect.arrayContaining(['name', 'description', '_id']))
          expect(body).toHaveProperty('_id', id)
          done()
        })
    })
    test('it should NOT be able to consume the route since no token was sent', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .get(`${url}/categories/${id}`)
        .expect(401)
        .end((err, res) => {
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
        .expect(200)
        .end((error, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String)
          }))
          expect(body).toHaveProperty('_id', id)
          expect(body).toHaveProperty('name', newCategory)
          createdID.push(body._id)
          done()
        })
    })
    test('it should not UPDATE a departure empty', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .patch(`${url}/categories/${id}`)
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
    test(
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
          .expect(401)
          .end((err, res) => {
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
        .expect(201)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String),
            icon: expect.any(String)
          }))
          request(server)
            .delete(`${url}/categories/${res.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((error, result) => {
              const { body: newBody } = result
              expect(newBody).toBeInstanceOf(Object)
              expect(newBody).toMatchObject({ msg: 'DELETED' })
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
