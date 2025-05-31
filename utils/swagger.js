import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerOptions = {
  definition: {
  openapi: '3.0.0',
  info: {
    title: 'TokoDigital API',
    version: '1.0.0',
    description: 'Dokumentasi otomatis untuk API TokoDigital',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }],
},

  apis: ['./api/**/*.js'], // Pastikan path ini benar
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
