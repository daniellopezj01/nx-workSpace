/* eslint-disable max-statements */
/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'

const _ = require('lodash')
const faker = require('faker')


const conversation = require('../../app/models/conversation')
const server = require('../../server')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
const createdID = []
/** message */

const existHash = '0Je0su8WqkndG_Qe2foaz'
const toUser1 = '5aa1c2c35ef7a4e97b5e995b'
const toUser2 = '5fa29a9584b39b13786fbfc2'

const url = process.env.URL_TEST_USER



describe('*********** CONVERSATIONS_USER ***********', () => {
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

  describe('/GET conversations', () => {
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        request(server)
          .get(`${url}/conversations`)
          .end((err, res) => {
            expect(res).have.status(401)
            done()
          })
      }
    )
    test('it should GET all the conversations', (done) => {
      request(server)
        .get(`${url}/conversations`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).have.status(200)
          const { body } = res
          // res.body.should.have.lengthOf(1)
          expect(Array.isArray(body.docs)).toBe(true)
          expect(body.limit).toBeInstanceOf(Number)
          expect(body.page).toBeInstanceOf(Number)
          expect(body.pagingCounter).toBeInstanceOf(Number)
          expect(body.totalDocs).toBeInstanceOf(Number)
          expect(body.totalPages).toBeInstanceOf(Number)
          const { docs } = body
          const firstChat = _.head(docs)
          expect(firstChat).toEqual(expect.arrayContaining([
            '_id',
            'members',
            'type',
            'hash',
            'createdAt',
            'updatedAt',
            'messages',
            'toFrom',
            'firstMessage'
          ]))
          expect(typeof firstChat._id).toBe('string')
          expect(Array.isArray(firstChat.members)).toBe(true)
          expect(typeof firstChat.type).toBe('string')
          expect(typeof firstChat.hash).toBe('string')
          expect(Array.isArray(firstChat.messages)).toBe(true)
          expect(firstChat.toFrom).toBeInstanceOf(Object)
          expect(firstChat.firstMessage).toBeInstanceOf(Object)
          done()
        })
    })
    test('it should not  GET conversations by hash', (done) => {
      request(server)
        .get(`${url}/conversations/noexiste`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).have.status(422)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).have.property('errors').toEqual({ msg: 'NOT_FOUND' })
          done()
        })
    })
  })

  describe('/POST To new Conversation', () => {
    it('error in params', (done) => {
      const messagePost = {
        message: faker.random.words()
      }
      request(server)
        .post(`${url}/messages/false`)
        .set('Authorization', `Bearer ${token}`)
        .send(messagePost)
        .end((err, res) => {
          expect(res).have.status(422)
          expect(res.body).toBeInstanceOf(Object)
          // res.body.should.include.property('errors').eql({ msg: 'BODY_INCOMPLETE' })
          createdID.push(res.body.idConversation)
          done()
        })
    })
    test('it should POST to with hash', (done) => {
      const messagePost = {
        message: faker.random.words(),
        to: toUser1
      }
      request(server)
        .post(`${url}/messages/${existHash}`)
        .set('Authorization', `Bearer ${token}`)
        .send(messagePost)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(201)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['_id', 'hash']))
          expect(body).include.property('hash').toEqual(existHash)
          expect(typeof body._id).toBe('string')
          expect(Array.isArray(body.members)).toBe(true)
          expect(typeof body.type).toBe('string')
          expect(typeof body.hash).toBe('string')
          expect(typeof body.createdAt).toBe('string')
          expect(typeof body.updatedAt).toBe('string')
          expect(Array.isArray(body.messages)).toBe(true)
          const lastMessage = _.last(body.messages)
          expect(lastMessage).have.property('message').toEqual(messagePost.message)
          createdID.push(res.body._id)
          done()
        })
    })
    it('new Conversation', (done) => {
      const messagePost = {
        message: faker.random.words(),
        to: toUser2
      }
      request(server)
        .post(`${url}/messages`)
        .set('Authorization', `Bearer ${token}`)
        .send(messagePost)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(201)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['_id', 'hash']))
          expect(typeof body._id).toBe('string')
          expect(Array.isArray(body.members)).toBe(true)
          expect(typeof body.type).toBe('string')
          expect(typeof body.hash).toBe('string')
          expect(typeof body.createdAt).toBe('string')
          expect(typeof body.updatedAt).toBe('string')
          expect(Array.isArray(body.messages)).toBe(true)
          createdID.push(res.body._id)
          done()
        })
    })
  })

  describe('/GET/:id conversations', () => {
    test('it should GET conversations by hash', (done) => {
      request(server)
        .get(`${url}/conversations/${existHash}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).have.property('hash').toEqual(existHash)
          expect(typeof body._id).toBe('string')
          expect(Array.isArray(body.members)).toBe(true)
          expect(typeof body.type).toBe('string')
          expect(typeof body.hash).toBe('string')
          expect(typeof body.createdAt).toBe('string')
          expect(typeof body.updatedAt).toBe('string')
          expect(Array.isArray(body.messages)).toBe(true)
          done()
        })
    })
  })

  afterAll(() => {
    createdID.forEach((id) => {
      conversation.findByIdAndRemove(id, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
