/* eslint-disable no-undef */
/* eslint handle-callback-err: "off"*/

process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
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

chai.use(chaiHttp)

describe('*********** WALLETS_USERS ***********', () => {
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
          const currentAccessToken = res.body.accessToken
          accessToken = currentAccessToken
          done()
        })
    })
    it('it should GET a fresh token', (done) => {
      chai
        .request(server)
        .post(`${url}/exchange`)
        .send({
          accessToken
        })
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.an('object')
          body.should.include.keys('token', 'user')
          const currentToken = body.token
          token = currentToken
          done()
        })
    })
  })

  describe('/GET wallets', () => {
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      chai
        .request(server)
        .get(`${url}/wallets`)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
    it('it should GET to wallets', (done) => {
      chai
        .request(server)
        .get(`${url}/wallets`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          const { docs, total } = body
          body.should.be.a('object')
          body.hasNextPage.should.be.a('boolean')
          body.hasPrevPage.should.be.a('boolean')
          body.limit.should.be.a('number')
          body.page.should.be.a('number')
          body.pagingCounter.should.be.a('number')
          body.totalDocs.should.be.a('number')
          body.should.include.keys('total', 'docs')
          docs.should.be.a('array').length(0)
          total.should.be.a('number').eql(0)
          done()
        })
    })
  })

  describe('/POST postPayOrder', () => {
    it('it should NOT POST  without params', (done) => {
      const orderPost = {
        token: TokenCard
      }
      chai
        .request(server)
        .post(`${url}/stripe`)
        .set('Authorization', `Bearer ${token}`)
        .send(orderPost)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(422)
          body.should.be.a('object')
          body.should.have.property('errors')
          const { errors } = body
          errors.should.be.a('object')
          errors.msg.should.be.a('array').length(2)
          // errors[0].should.have.property('msg').eql('Invalid integer: NaN')
          done()
        })
    })
    it('it should POST a Stripe with amount ', (done) => {
      const orderPost = {
        token: TokenCard,
        amount: price,
        pk
      }
      chai
        .request(server)
        .post(`${url}/stripe`)
        .set('Authorization', `Bearer ${token}`)
        .send(orderPost)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.include.keys('id', 'client_secret')
          const customData = res.body
          chai
            .request(server)
            .patch(`${url}/payorders/${res.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(customData)
            .end((error, result) => {
              const { body } = result
              result.should.have.status(200)
              body.should.be.a('object')
              body.should.include.keys('_id', 'idOperation')
              body.should.have.property('status').eql('succeeded')
              body.should.have.property('idOperation').eql(res.body.id)
              body.should.have.property('amount').to.be.a('Number')
              body.should.have.property('amount').eql(price)
              done()
            })
        })
    })
  })

  after(() => {
    collectionPayOrder.deleteMany({}, (err) => {
      if (err) {
        // console.log(err)
      }
    })
  })
})
