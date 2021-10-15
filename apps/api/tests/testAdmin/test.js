/* eslint-disable handle-callback-err */


process.env.NODE_ENV = 'test'

const server = require('../../superTest')
const request = require('supertest')
const faker = require('faker')
// const express = require('express')

// const app = express()
const url = process.env.URL_TEST_ADMIN

// app.use('/admin', require('../../app/routesAdmin'))

const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}

const createdID = []
const email = faker.internet.email()

// describe('/GET /', () => {
//   test('it should GET home user url', (done) => {
//     request(server)
//       .get(`${url}/`)
//       .expect(200)
//       .end((err, res) => {
//         console.log(res.body)
//         done()
//       })
//   })
// })

// expect(body).toHaveProperty('accessToken')

describe('/POST register', () => {
  test('it should POST register', (done) => {
    const user = {
      name: faker.random.words(),
      surname: faker.random.words(),
      email,
      password: faker.random.words()
    }
    request(server)
      .post(`${url}/register/`)
      .send(user)
      .expect(200)
      .end((err, res) => {
        const { body } = res
        console.log(body)
        expect(body).toBeInstanceOf(Object)
        expect(body).toEqual(expect.objectContaining({
          accessToken: expect.any(String),
          user: expect.any(Object),
        }))
        // expect(body.user).toMatchObject({ 'email': email.toLowerCase() })
        expect(body.user).toHaveProperty('email', email.toLowerCase())
        createdID.push(res.body.user._id)
        done()
      })
  })
  test('it should NOT POST a register empty values', (done) => {
    const user = {
      surname: faker.random.words()
    }
    request(server)
      .post(`${url}/register/`)
      .send(user)
      .expect(422)
      .end((err, res) => {
        const { body } = res
        expect(body).toBeInstanceOf(Object)
        expect(body).toHaveProperty('errors')
        const { errors } = body
        expect(Array.isArray(errors)).toBe(true)
        done()
      })
  })
  test('it should NOT POST a register if email already exists', (done) => {
    const user = {
      name: faker.random.words(),
      surname: faker.random.words(),
      email,
      password: faker.random.words()
    }
    request(server)
      .post(`${url}/register/`)
      .send(user)
      .expect(422)
      .end((err, res) => {
        const { body } = res
        expect(body).toBeInstanceOf(Object)
        expect(body).toHaveProperty('errors')
        const { msg } = body.errors
        const message = `E11000 duplicate key error collection: oauth_service.users index: email_1 dup key: { email: "${email.toLowerCase()}" }`
        // expect(msg).have.property('msg').toEqual(message)
        expect(msg).toMatchObject({ msg: message })
        done()
      })
  })
})


// test('error login', (done) => {
//   request(server)
//     .post(`${url}/login/`)
//     .type('form')
//     .send({ email: 'admin@admin.com', password: 'error password' })
//     // .set('Accept', /application\/json/)
//     .expect(422)
//     .end((err, res) => {
//       if (err) {
//         console.log('this is error', err.message)
//       }
//       expect(res.body.errors).toMatchObject({ msg: { msg: 'WRONG_PASSWORD' } })
//       expect(res.body).toBeInstanceOf(Object)
//       done()
//     })
// })

// describe('*********** AUTH_ADMIN ***********', () => {
//   describe('/GET /', () => {
//     test('it should GET home user url', (done) => {
//       expect(1).toBe(1)
//     })
//   })

//   // afterAll(() => {
//   //   createdID.forEach((id) => {
//   //     User.findByIdAndRemove(id, (err) => {
//   //       if (err) {
//   //         // console.log(err)
//   //       }
//   //     })
//   //   })
//   // })
// })
