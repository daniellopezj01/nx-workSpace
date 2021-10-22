/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'



const request = require('supertest')

const url = process.env.URL_TEST_USER


module.exports = (server) => {
  describe('*********** SETTINGS_USERS ***********', () => {
    describe('/GET settings/check', () => {
      test('it should GET ', (done) => {
        request(server)
          .get(`${url}/settings/check`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              currencies: expect.any(Array),
              payAmount: expect.any(Array),
              name: expect.any(String),
            }))
            expect(Array.isArray(body.payAmount)).toBe(true)
            expect(typeof body.name).toBe('string')
            done()
          })
      })
    })
  })
}