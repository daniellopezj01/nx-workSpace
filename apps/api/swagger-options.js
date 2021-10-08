/* eslint-disable max-len */
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const faker = require('faker')

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Mochileros.com.mx (Documentation)',
      description:
        'Para la implementacion de la api con el FRONT o APP ' +
        'necesitaras realizar las siguiente conexiones',
      contact: {
        name: 'Developer'
      },
      servers: ['http://localhost:8000']
    },
    schemes: ['http'],
    securityDefinitions: {
      APIKeyHeader: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization'
      }
    },
    security: [{ APIKeyHeader: [] }],
    definitions: {
      authRegister: {
        type: 'object',
        required: ['name', 'phone', 'email', 'password'],
        properties: {
          name: { type: 'string' },
          surname: { type: 'string' },
          phone: {
            type: 'object',
            properties: {
              number: {
                type: 'string',
                description: 'internationalNumber'
              },
              code: {
                type: 'string',
                description: 'countryCode'
              }
            }
          },
          email: { type: 'string' },
          password: { type: 'string' }
        },
        example: {
          name: faker.name.firstName(2),
          surname: faker.name.lastName(1),
          email: 'userDoc@user.com',
          password:
            '$2a$05$2KOSBnbb0r.0TmMrvefbluTOB735rF/KRZb4pmda4PdvU9iDvUB26',
          phone: {
            number: '+34 916 34 39 39',
            code: 'ES'
          }
        }
      },
      authVerify: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string' } }
      },
      authForgot: {
        type: 'object',
        required: ['email'],
        properties: { email: { type: 'string' } }
      },
      authReset: {
        type: 'object',
        required: ['id', 'password'],
        properties: {
          id: { type: 'string' },
          password: { type: 'string' }
        }
      },
      authChangePass: {
        type: 'object',
        required: ['old', 'newpass'],
        properties: {
          old: { type: 'string' },
          newpass: { type: 'string' }
        }
      },
      authLogin: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string' },
          password: { type: 'string' }
        },
        example: {
          email: 'user@user.com',
          password: '12345'
        }
      },
      commentary: {
        type: 'object',
        required: ['content', 'status', 'idReservation', 'vote'],
        properties: {
          content: { type: 'string' },
          status: { type: 'string' },
          idReservation: { type: 'string' },
          vote: { type: 'number' },
          attachment: { type: 'array' }
        },
        example: {
          content: faker.lorem.text(),
          status: 'public',
          idReservation: '5e4446f4ad05592a1c628977',
          vote: 5
        }
      },
      conversation: {
        type: 'object',
        required: ['message', 'to'],
        properties: {
          message: { type: 'string' },
          to: { type: 'string' }
        },
        example: {
          message: faker.lorem.text(),
          to: '5fa29a9584b39b13786fbfc2'
        }
      },
      profile: {
        type: 'object',
        properties: {
          surname: {
            type: 'string'
          },
          avatar: {
            type: 'string'
          },
          birthDate: {
            type: 'string'
          },
          gender: {
            type: 'enum',
            description: 'tipo enum [M, F, O]'
          },
          document: {
            type: 'string'
          },
          description: {
            type: 'string'
          },
          country: {
            type: 'string'
          },
          name: {
            type: 'string'
          },
          phone: {
            type: 'object',
            properties: {
              number: {
                type: 'string',
                description: 'internationalNumber'
              },
              code: {
                type: 'string',
                description: 'countryCode'
              }
            }
          },
          city: {
            type: 'string'
          },
          address: {
            type: 'string'
          }
        }
      },
      reservations: {
        type: 'object',
        required: [
          'travelerFirstName',
          'travelerLastName',
          'travelerEmail',
          'travelerPhone',
          'travelerDocument',
          'travelerAddress',
          'travelerBirthDay',
          'travelerGender',
          'idDeparture',
          'country',
          'city'
        ],
        properties: {
          travelerFirstName: {
            type: 'string'
          },
          travelerLastName: {
            type: 'string'
          },
          travelerEmail: {
            type: 'string'
          },
          travelerPhone: {
            type: 'object',
            properties: {
              number: {
                type: 'string',
                description: 'internationalNumber'
              },
              code: {
                type: 'string',
                description: 'countryCode'
              }
            }
          },
          travelerDocument: {
            type: 'string'
          },
          travelerAddress: {
            type: 'string'
          },
          travelerBirthDay: {
            type: 'date'
          },
          travelerGender: {
            type: 'enum',
            description: 'tipo enum [M, F, O]'
          },
          idDeparture: {
            type: 'string'
          },
          country: {
            type: 'string'
          },
          city: {
            type: 'string'
          }
        }
      },
      reservationsUpdate: {
        type: 'object',
        properties: {
          travelerFirstName: {
            type: 'string'
          },
          travelerLastName: {
            type: 'string'
          },
          travelerEmail: {
            type: 'string'
          },
          travelerPhone: {
            type: 'object',
            properties: {
              number: {
                type: 'string',
                description: 'internationalNumber'
              },
              code: {
                type: 'string',
                description: 'countryCode'
              }
            }
          },
          travelerDocument: {
            type: 'string'
          },
          travelerAddress: {
            type: 'string'
          },
          travelerBirthDay: {
            type: 'date'
          },
          travelerGender: {
            type: 'enum',
            description: 'tipo enum [M, F, O]'
          },
          idDeparture: {
            type: 'string'
          },
          country: {
            type: 'string'
          },
          city: {
            type: 'string'
          },
          observations: {
            type: 'string'
          },
          status: {
            type: 'enum',
            description:
              'tipo enum ["completed", "progress", "cancelled", "pending"]'
          },
          idTour: {
            type: 'string'
          },
          idUser: {
            type: 'string'
          },
          buyerFirstName: {
            type: 'string'
          },
          buyerLastName: {
            type: 'string'
          },
          buyerDocument: {
            type: 'string'
          },
          buyerEmail: {
            type: 'string'
          },
          buyerPhone: {
            type: 'object',
            properties: {
              number: {
                type: 'string',
                description: 'internationalNumber'
              },
              code: {
                type: 'string',
                description: 'countryCode'
              }
            }
          },
          buyerBirthDay: {
            type: 'date'
          },
          imagePassPort: {
            type: 'object'
          },
          emergencyName: {
            type: 'string'
          },
          emergencyLastName: {
            type: 'string'
          },
          emergencyPhone: {
            type: 'object',
            properties: {
              number: {
                type: 'string',
                description: 'internationalNumber'
              },
              code: {
                type: 'string',
                description: 'countryCode'
              }
            }
          },
          invoice: {
            type: 'string'
          },
          customData: {
            type: 'object'
          }
        }
      },
      stripe: {
        type: 'object',
        required: ['token'],
        properties: {
          token: {
            type: 'string'
          },
          reference: {
            type: 'string'
          },
          amount: {
            type: 'string'
          }
        },
        example: {
          token: 'tok_visa',
          amount: 20
        }
      }
    }
  },
  // routers
  apis: ['./app/routesApi/*.js']
}
const swaggerDocs = swaggerJsDoc(swaggerOptions)

module.exports = (app = {}) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
}
