export default {
  category: {
    name: 'Apartamento',
  },
  categoryUnique: {
    name: 'Casa',
  },
  categoryInvalidBody1: {
    name: [],
  },
  categoryInvalidBody2: {
    name: 12345,
  },
  categoryInvalidBody3: {
    name: 'não deve ser possível criar uma categoria com mais de 45 caracteres',
  },
  categoryInvalidBody4: {
    name: 'categoria com exatos 45 caracteres! 123456789',
  },
  categoryInvalidBody5: {
    extra_key: '12345',
  },
};
