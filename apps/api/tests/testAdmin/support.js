/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'

const _ = require('lodash')
const faker = require('faker')
// const support = require('../../app/models/supportTicket')
const server = require('../../server')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''
const createdID = []
/** message */
let id

const hash = 'YPp_bWfeEWQV'

const url = process.env.URL_TEST_ADMIN



describe('*********** SUPPORT_ADMIN ***********', () => {
  describe('/POST login', () => {
    test('it should GET token user', (done) => {
      request(server)
        .post(`${url}/login`)
        .send(loginDetails)
        .expect(200)
        .end((err, res) => {
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
  describe('/GET support', () => {
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        request(server)
          .post(`${url}/support`)
          .end((err, res) => {
            expect(res).have.status(401)
            done()
          })
      }
    )
    test('it should GET all the support', (done) => {
      request(server)
        .get(`${url}/support`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).have.status(200)
          const { body } = res
          expect(Array.isArray(body.docs)).toBe(true)
          expect(body.totalDocs).be.a('number').toBe(1)
          const { docs } = body
          const firstChat = _.head(docs)
          expect(firstChat).toEqual(expect.arrayContaining(['_id', 'status', 'hash', 'firstMessage']))
          id = firstChat._id
          expect(typeof firstChat._id).toBe('string')
          expect(firstChat.hash).be.a('string').toEqual(hash)
          done()
        })
    })
    test('it should GET item by id', (done) => {
      request(server)
        .get(`${url}/support/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).have.status(200)
          const { body } = res
          expect(body).toEqual(expect.arrayContaining(['_id', 'status', 'hash', 'messages']))
          expect(body._id).be.a('string').toEqual(id)
          expect(body.hash).be.a('string').toEqual(hash)
          done()
        })
    })
  })
  describe('/POST To new support', () => {
    it('error in params', (done) => {
      const messagePost = {
        message: faker.random.words()
      }
      request(server)
        .post(`${url}/support`)
        .set('Authorization', `Bearer ${token}`)
        .send(messagePost)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(422)
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          // res.body.should.include.property('errors').eql({ msg: 'BODY_INCOMPLETE' })

          done()
        })
    })
    test('it should POST to without hash', (done) => {
      const messagePost = {
        message: faker.random.words(),
        id
      }
      request(server)
        .post(`${url}/support`)
        .set('Authorization', `Bearer ${token}`)
        .send(messagePost)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['_id', 'hash']))
          expect(typeof body._id).toBe('string')
          expect(typeof body.hash).toBe('string')
          expect(body.messages).be.a('array').toHaveLength(2)
          const lastMessage = _.last(body.messages)
          expect(lastMessage).have.property('message').toEqual(messagePost.message)
          createdID.push(res.body._id)
          done()
        })
    })
    // test('it should POST to with hash', (done) => {
    //   const messagePost = {
    //     message: faker.random.words(),
    //     idReservation,
    //     hash
    //   }
    //   chai
    //     .request(server)
    //     .post(`${url}/support`)
    //     .set('Authorization', `Bearer ${token}`)
    //     .send(messagePost)
    //     .end((err, res) => {
    //       const { body } = res
    //       res.should.have.status(200)
    //       body.should.be.a('object')
    //       body.should.include.keys('_id', 'hash')
    //       body.should.include.property('hash').eql(hash)
    //       body._id.should.be.a('string')
    //       body.hash.should.be.a('string')
    //       body.messages.should.be.a('array').length(2)
    //       body.idReservation.should.be.a('string').eql(idReservation)
    //       const lastMessage = _.last(body.messages)
    //       lastMessage.should.have.property('message').eql(messagePost.message)
    //       createdID.push(res.body._id)
    //       done()
    //     })
    // })
    // it('new support support', (done) => {
    //   const messagePost = {
    //     message: faker.random.words(),
    //     idReservation
    //   }
    //   chai
    //     .request(server)
    //     .post(`${url}/support`)
    //     .set('Authorization', `Bearer ${token}`)
    //     .send(messagePost)
    //     .end((err, res) => {
    //       const { body } = res
    //       res.should.have.status(200)
    //       body.should.be.a('object')
    //       body.should.include.keys('_id', 'hash')
    //       body._id.should.be.a('string')
    //       body.hash.should.be.a('string')
    //       body.messages.should.be.a('array').length(1)
    //       const lastMessage = _.last(body.messages)
    //       lastMessage.should.have.property('message').eql(messagePost.message)
    //       body.idReservation.should.be.a('string').eql(idReservation)
    //       createdID.push(res.body._id)
    //       done()
    //     })
    // })
  })
  // after(() => {
  //   createdID.forEach((idSupport) => {
  //     support.findByIdAndRemove(idSupport, (err) => {
  //       if (err) {
  //         // console.log(err)
  //       }
  //     })
  //   })
  // })
})
