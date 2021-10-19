// /* eslint-disable no-undef */
// /* eslint-disable import/no-extraneous-dependencies */

// process.env.NODE_ENV = 'test'
// const _ = require('lodash')
// const faker = require('faker')
// 
// 
// const modelComments = require('../../app/models/tour')
// const server = require('../../server')
// // eslint-disable-next-line no-unused-vars
// const should = chai.should()
// const loginDetails = {
//   email: 'admin@admin.com',
//   password: '12345678'
// }
// let token = ''
// let accessToken = ''

// const createdID = []
// const content = faker.random.words()
// const idTour = '5fa181b202945b26c456176a'
// const idReservation = '5fa18bde4087883d305e6800'
// const slugTour = 'tour-one'
// const idUser = '5aa1c2c35ef7a4e97b5e995a'
// const emptyUser = '5fa29a9584b39b13786fbfc2'
// let globalCommets = []
// const url = process.env.URL_TEST_USER


// describe('*********** COMMENTS_USER ***********', () => {
//   describe('/POST login', () => {
//     test('it should GET token user', (done) => {
//       chai
//         .request(server)
//         .post(`${url}/login`)
//         .send(loginDetails)
//         .end((err, res) => {
//           res.should.have.status(200)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('accessToken', 'user')
//           const currentAccessToken = res.body.accessToken
//           accessToken = currentAccessToken
//           done()
//         })
//     })
//     test('it should GET a fresh token', (done) => {
//       chai
//         .request(server)
//         .post(`${url}/exchange`)
//         .send({
//           accessToken
//         })
//         .end((err, res) => {
//           const { body } = res
//           res.should.have.status(200)
//           body.should.be.an('object')
//           body.should.include.keys('token', 'user')
//           const currentToken = body.token
//           token = currentToken
//           done()
//         })
//     })
//   })

//   describe('/POST comments', () => {
//     test('it should NOT POST a commentary without comments', (done) => {
//       const commentaryOne = {}
//       chai
//         .request(server)
//         .post(`${url}/comments`)
//         .set('Authorization', `Bearer ${token}`)
//         .send(commentaryOne)
//         .end((err, res) => {
//           res.should.have.status(404)
//           res.body.should.be.a('object')
//           res.body.should.have.property('errors')
//           res.body.should.have.property('errors').eql({ msg: 'URL_NOT_FOUND' })
//           done()
//         })
//     })
//     test('it should POST a comments ', (done) => {
//       const commentaryPost = {
//         content,
//         status: 'public',
//         idReservation,
//         vote: 5
//       }
//       chai
//         .request(server)
//         .post(`${url}/comments/${idTour}`)
//         .set('Authorization', `Bearer ${token}`)
//         .send(commentaryPost)
//         .end((err, res) => {
//           res.should.have.status(201)
//           const { body } = res
//           body.should.be.a('object')
//           body.should.include.keys('_id', 'comments')
//           body.comments.should.be.a('array')
//           body.comments.should.have.lengthOf(2)
//           const { comments } = res.body
//           comments[1].should.have.property('content').eql(content)
//           globalCommets = comments
//           done()
//         })
//     })
//     test('it should NOT POST a comments are emply fields', (done) => {
//       const commentaryTwo = {
//         content,
//         status: 'public',
//         idReservation
//       }
//       chai
//         .request(server)
//         .post(`${url}/comments/${idTour}`)
//         .set('Authorization', `Bearer ${token}`)
//         .send(commentaryTwo)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.be.a('object')
//           res.body.should.have.property('errors')
//           done()
//         })
//     })
//   })

//   describe('/GET comments', () => {
//     it('Not found Url', (done) => {
//       chai
//         .request(server)
//         .get(`${url}/comments`)
//         .end((err, res) => {
//           res.should.have.status(404)
//           res.body.should.be.an('object')
//           res.body.should.have.property('errors').eql({ msg: 'URL_NOT_FOUND' })
//           done()
//         })
//     })
//     test('it should GET the comments for  Slug Tour, Is Empty ', (done) => {
//       chai
//         .request(server)
//         .get(`${url}/comments/empty`)
//         .end((err, res) => {
//           res.should.have.status(200)
//           res.body.should.be.an('array')
//           res.body.should.have.length(0)
//           done()
//         })
//     })
//     test('it should GET the comments for User, Is Empty ', (done) => {
//       chai
//         .request(server)
//         .get(`${url}/comments/forUser/${emptyUser}`)
//         .set('Authorization', `Bearer ${token}`)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.be.an('object')
//           res.body.should.have.property('errors').eql({ msg: 'TOUR_NOT_FOUND' })
//           done()
//         })
//     })
//     test('it should GET the comments for  slug Tour', (done) => {
//       chai
//         .request(server)
//         .get(`${url}/comments/${slugTour}`)
//         .end((err, res) => {
//           const { body } = res
//           res.should.have.status(200)
//           body.should.be.an('array')
//           body.should.have.length(2)
//           const firstComment = _.head(body)
//           firstComment.creator[0].should.have.property('_id').eql(idUser)
//           done()
//         })
//     })
//     test('it should GET the comments for User', (done) => {
//       chai
//         .request(server)
//         .get(`${url}/comments/forUser/${idUser}`)
//         .set('Authorization', `Bearer ${token}`)
//         .end((err, res) => {
//           const { body } = res
//           res.should.have.status(200)
//           body.should.be.an('array')
//           body.should.have.length(1)
//           const firstComment = _.head(body)
//           firstComment.creatorComment.should.have.property('_id').eql(idUser)
//           done()
//         })
//     })
//   })

//   describe('/PATCH/:id comments', () => {
//     test('it should UPDATE a commentary given the id', (done) => {
//       const lastComment = _.last(globalCommets)
//       const id = lastComment._id
//       const newContent = faker.random.words()
//       chai
//         .request(server)
//         .patch(`${url}/comments/${idTour}/${id}`)
//         .set('Authorization', `Bearer ${token}`)
//         .send({
//           content: newContent,
//           statis: 'public'
//         })
//         .end((error, res) => {
//           const { body } = res
//           res.should.have.status(200)
//           body.should.be.a('object')
//           body.status.should.be.a('string')
//           const last = _.last(body.comments)
//           last.should.have.property('_id').eql(id)
//           last.should.have.property('content').eql(newContent)
//           done()
//         })
//     })
//     test('it should NOT be able to consume the route since no token was sent', (done) => {
//       const id = globalCommets[globalCommets.length - 1]._id
//       chai
//         .request(server)
//         .patch(`${url}/comments/${idTour}/${id}`)
//         .send({
//           content: faker.random.words(),
//           statis: 'public'
//         })
//         .end((err, res) => {
//           res.should.have.status(401)
//           done()
//         })
//     })
//   })

//   describe('/DELETE/:id comments', () => {
//     test('it should NOT be able to consume the route since no token was sent', (done) => {
//       const comment = globalCommets[globalCommets.length - 1]
//       const newId = comment._id
//       chai
//         .request(server)
//         .delete(`${url}/comments/${idTour}/${newId}`)
//         .end((err, res) => {
//           res.should.have.status(401)
//           done()
//         })
//     })
//     test('it should DELETE a commentary given the id', (done) => {
//       const comment = globalCommets[globalCommets.length - 1]
//       const newId = comment._id
//       chai
//         .request(server)
//         .delete(`${url}/comments/${idTour}/${newId}`)
//         .set('Authorization', `Bearer ${token}`)
//         .end((error, result) => {
//           result.should.have.status(200)
//           result.body.should.be.a('object')
//           result.body.comments.should.be.a('Array')
//           done()
//         })
//     })
//   })

//   after(() => {
//     createdID.forEach((id) => {
//       modelComments.findByIdAndRemove(id, () => { })
//     })
//   })
// })
