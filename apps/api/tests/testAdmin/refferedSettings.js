/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

const chai = require('chai')
const faker = require('faker')
const chaiHttp = require('chai-http')
const server = require('../../server')
const referredSettings = require('../../app/models/settingReferred')
// eslint-disable-next-line no-unused-vars
const should = chai.should()
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''
const url = process.env.URL_TEST_ADMIN
const createdID = []

// chai.use(chaiHttp)

describe('*********** REFERREDS_SETTINGS_ADMIN ***********', () => {
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

  describe('/GET referreds_settings', () => {
    it('it should GET all the referreds', (done) => {
      chai
        .request(server)
        .get(`${url}/referredSettings`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          const { docs, totalDocs, hasPrevPage, hasNextPage } = body
          body.should.be.an('object')
          docs.should.be.a('array')
          hasNextPage.should.be.a('boolean')
          hasPrevPage.should.be.a('boolean')
          body.limit.should.be.a('number')
          body.page.should.be.a('number')
          totalDocs.should.be.a('number').eql(2)
          docs.should.have.length(2)
          body.totalPages.should.be.a('number')
          done()
        })
    })
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      chai
        .request(server)
        .get(`${url}/referreds`)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })

  describe('/POST referreds_settings', () => {
    it('it should NOT POST a referreds_settings without referreds_settings', (done) => {
      const settingsPostOne = {}
      chai
        .request(server)
        .post(`${url}/referredSettings`)
        .set('Authorization', `Bearer ${token}`)
        .send(settingsPostOne)
        .end((err, res) => {
          res.should.have.status(422)
          const { body } = res
          body.should.be.a('object')
          body.should.have.property('errors')
          const { errors } = body
          errors.should.have.property('msg').be.a('array')
          done()
        })
    })
    it('it should POST a referreds_settings ', (done) => {
      const settingsPostTwo = {
        name: faker.random.words(),
        label: faker.random.words(),
        amountTo: faker.random.number(),
        amountFrom: faker.random.number()
      }
      chai
        .request(server)
        .post(`${url}/referredSettings`)
        .set('Authorization', `Bearer ${token}`)
        .send(settingsPostTwo)
        .end((err, res) => {
          res.should.have.status(201)
          const { body } = res
          body.should.be.a('object')
          body.should.include.keys('_id', 'name', 'label', 'amountTo')
          body.should.have.property('name').eql(settingsPostTwo.name)
          body.should.have.property('label').eql(settingsPostTwo.label)
          body.should.have.property('_id').be.a('string')
          createdID.push(res.body._id)
          done()
        })
    })
  })

  describe('/GET/:id referreds_settings', () => {
    it('it should GET a referreds_settings by the given id', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .get(`${url}/referredSettings/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.include.keys('name', 'amountTo', '_id')
          body.should.have.property('_id').eql(id)
          done()
        })
    })
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .get(`${url}/referredSettings/${id}`)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })

  describe('/PATCH/:id referreds_settings', () => {
    it('it should UPDATE a category given the id', (done) => {
      const id = createdID.slice(-1).pop()
      const newName = faker.random.words()
      const newAmount = faker.random.number()
      chai
        .request(server)
        .patch(`${url}/referredSettings/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: newName,
          label: newName,
          amountTo: newAmount,
          amountFrom: newAmount
        })
        .end((error, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.have.property('_id').eql(id)
          body.should.have.property('name').eql(newName)
          body.should.have.property('label').eql(newName)
          body.should.have.property('amountTo').eql(newAmount)
          body.should.have.property('amountFrom').eql(newAmount)
          body._id.should.be.a('string')
          createdID.push(res.body._id)
          done()
        })
    })
    it('it should not UPDATE a type referred empty', (done) => {
      chai
        .request(server)
        .patch(`${url}/referredSettings`)
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .end((error, res) => {
          const { body } = res
          res.should.have.status(404)
          body.should.be.a('object')
          body.should.have.property('errors')
          done()
        })
    })
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .patch(`${url}/referredSettings/${id}`)
        .send({
          name: faker.random.words()
        })
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })

  describe('/DELETE/:id category', () => {
    it('it should DELETE a category given the id', (done) => {
      const typeRefferedDeleted = {
        name: faker.random.words(),
        label: faker.random.words(),
        amountTo: faker.random.number(),
        amountFrom: faker.random.number()
      }
      chai
        .request(server)
        .post(`${url}/referredSettings`)
        .set('Authorization', `Bearer ${token}`)
        .send(typeRefferedDeleted)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.include.keys(
            '_id',
            'label',
            'name',
            'amountTo',
            'amountFrom'
          )
          chai
            .request(server)
            .delete(`${url}/referredSettings/${res.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((error, result) => {
              const { body } = result
              result.should.have.status(200)
              body.should.be.a('object')
              body.should.have.property('msg').eql('DELETED')
              done()
            })
        })
    })
  })

  after(() => {
    createdID.forEach((id) => {
      referredSettings.findByIdAndRemove(id, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
