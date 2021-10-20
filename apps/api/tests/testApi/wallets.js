/* eslint-disable no-undef */
/* eslint handle-callback-err: "off"*/

process.env.NODE_ENV = 'test'



const collectionPayOrder = require('../../app/models/payOrder')
const server = require('../../server')
// eslint-disable-next-line no-unused-vars
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
const price = 100
const TokenCard = 'tok_visa'
const pk = 'pk_test_Wj915HLpr6PpdvzQMuzq8idv'
const url = process.env.URL_TEST_USER



describe('*********** WALLETS_USERS ***********', () => {
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

  describe('/GET wallets', () => {
    test(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        request(server)
          .get(`${url}/wallets`)
          .end((err, res) => {
            expect(res).have.status(401)
            done()
          })
      }
    )
    test('it should GET to wallets', (done) => {
      request(server)
        .get(`${url}/wallets`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(200)
          const { docs, total } = body
          expect(body).toBeInstanceOf(Object)
          expect(body.hasNextPage).toBeInstanceOf(Boolean)
          expect(body.hasPrevPage).toBeInstanceOf(Boolean)
          expect(body.limit).toBeInstanceOf(Number)
          expect(body.page).toBeInstanceOf(Number)
          expect(body.pagingCounter).toBeInstanceOf(Number)
          expect(body.totalDocs).toBeInstanceOf(Number)
          expect(body).toEqual(expect.arrayContaining(['total', 'docs']))
          expect(docs).be.a('array').toHaveLength(0)
          expect(total).be.a('number').toBe(0)
          done()
        })
    })
  })

  describe('/POST postPayOrder', () => {
    test('it should NOT POST  without params', (done) => {
      const orderPost = {
        token: TokenCard
      }
      request(server)
        .post(`${url}/stripe`)
        .set('Authorization', `Bearer ${token}`)
        .send(orderPost)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(422)
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          const { errors } = body
          expect(errors).toBeInstanceOf(Object)
          expect(errors.msg).be.a('array').toHaveLength(2)
          // errors[0].should.have.property('msg').eql('Invalid integer: NaN')
          done()
        })
    })
    test('it should POST a Stripe with amount ', (done) => {
      const orderPost = {
        token: TokenCard,
        amount: price,
        pk
      }
      request(server)
        .post(`${url}/stripe`)
        .set('Authorization', `Bearer ${token}`)
        .send(orderPost)
        .end((err, res) => {
          expect(res).have.status(201)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.arrayContaining(['id', 'client_secret']))
          const customData = res.body
          request(server)
            .patch(`${url}/payorders/${res.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(customData)
            .end((error, result) => {
              const { body } = result
              expect(result).have.status(200)
              expect(body).toBeInstanceOf(Object)
              expect(body).toEqual(expect.arrayContaining(['_id', 'idOperation']))
              expect(body).have.property('status').toBe('succeeded')
              expect(body).have.property('idOperation').toEqual(res.body.id)
              expect(body).toBeInstanceOf(Number)
              expect(body).have.property('amount').toEqual(price)
              done()
            })
        })
    })
  })

  afterAll(() => {
    collectionPayOrder.deleteMany({}, (err) => {
      if (err) {
        // console.log(err)
      }
    })
  })
})
