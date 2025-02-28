import swaggerJSDoc from 'swagger-jsdoc';
import { collaboratorSchema, documentSchema, userSchema } from '../src/utilities';

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Datacentrix Collab App API',
      version: '1.0.0',
      description: 'Documentation for realtime collaboration app API',
    },
    components: {
      schemas: {
        Collaborators: collaboratorSchema,
        Document: documentSchema,
        User: userSchema,
      },
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
    servers: [
      {
        url: 'http://localhost:8080/api',
      },
      {
        url: 'http://45.220.164.73:8080/api',
      },
    ],
  },

  apis:  ['./src/routes/**/*.ts'],
}

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;