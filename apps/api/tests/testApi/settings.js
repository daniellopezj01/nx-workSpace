/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server')

const url = process.env.URL_TEST_USER

describe('*********** SETTINGS_USERS ***********', () => {
  describe('/GET settings/check', () => {
    test('it should GET ', (done) => {
      request(server)
        .get(`${url}/settings/check`)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['currencies', 'payAmount', 'name']))
          expect(Array.isArray(body.currencies)).toBe(true)
          expect(Array.isArray(body.payAmount)).toBe(true)
          expect(typeof body.name).toBe('string')
          done()
        })
    })
  })
})
