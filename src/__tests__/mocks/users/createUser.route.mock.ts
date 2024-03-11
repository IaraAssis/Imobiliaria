export default {
  userComplete: {
    name: 'Fabio',
    email: 'fabio@kenzie.com.br',
    password: '1234',
    admin: true,
  },
  userWithoutAdmin: {
    name: 'Cauan',
    email: 'cauan@kenzie.com.br',
    password: '1234',
  },
  userUnique: {
    name: 'Maykel',
    email: 'maykel@kenzie.com.br',
    password: '1234',
  },
  userInvalidBody: {
    name: 1234,
    email: [],
  },
  userInvalidBody2: {
    name: 'um nome com mais de quarenta e cinco caracteres!',
    email: 'mail',
    password: 123456,
  },
};
