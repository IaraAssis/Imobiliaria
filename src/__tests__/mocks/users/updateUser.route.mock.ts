export default {
  userAdminTemplate: {
    name: 'Fabio',
    email: 'fabio@kenzie.com.br',
    password: '1234',
    admin: true,
  },
  userNotAdminTemplate: {
    name: 'Cauan',
    email: 'cauan@kenzie.com.br',
    password: '1234',
    admin: false,
  },
  userComplete: {
    name: 'Cauan',
    email: 'cauan.f@kenzie.com.br',
    password: '1234',
  },
  userPartial: {
    password: '1234',
  },
  userAdmin: {
    password: '1234',
    admin: true,
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
