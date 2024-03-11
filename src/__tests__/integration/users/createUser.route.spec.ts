import supertest from 'supertest';
import { Any, DataSource } from 'typeorm';
import app from '../../../app';
import { AppDataSource } from '../../../data-source';
import { User } from '../../../entities';
import { createUserRouteMock } from '../../mocks';

describe('POST /users', () => {
  let connection: DataSource;

  const baseUrl: string = '/users';
  const userRepo = AppDataSource.getRepository(User);

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((error) => console.error(error));
  });

  beforeEach(async () => {
    const users: Array<User> = await userRepo.find();
    await userRepo.remove(users);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('Success: Must be able to create a user - Full body', async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .send(createUserRouteMock.userComplete);

    const { password, ...bodyEqual } = createUserRouteMock.userComplete;
    const expectResults = {
      status: 201,
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toEqual(expect.objectContaining(bodyEqual));
    expect(response.body).not.toEqual(
      expect.objectContaining({ password: expect.any(String) })
    );

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        deletedAt: null,
      })
    );
  });

  it('Success: Must be able to create a user - Without "admin"', async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .send(createUserRouteMock.userWithoutAdmin);

    const { password, ...bodyEqual } = createUserRouteMock.userWithoutAdmin;
    const expectResults = {
      status: 201,
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toEqual(expect.objectContaining(bodyEqual));
    expect(response.body).not.toEqual(
      expect.objectContaining({ password: expect.any(String) })
    );

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        deletedAt: null,
        admin: false,
      })
    );
  });

  it('Error: Must not be able to create a user - Email already exists', async () => {
    await userRepo.save(createUserRouteMock.userUnique);

    const response = await supertest(app)
      .post(baseUrl)
      .send(createUserRouteMock.userUnique);

    const expectResults = {
      status: 409,
      bodyMessage: { message: 'Email already exists' },
    };

    expect(response.status).toBe(expectResults.status);

    expect(response.body).toStrictEqual(expectResults.bodyMessage);
  });

  it('Error: Must not be able to create a user - Invalid body', async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .send(createUserRouteMock.userInvalidBody);

    const expectResults = {
      status: 400,
      bodyMessage: {
        flattenMessage: {
          message: {
            name: ['Expected string, received number'],
            email: ['Expected string, received array'],
            password: ['Required'],
          },
        },
        errorsMessage: {
          message: [
            {
              code: 'invalid_type',
              expected: 'string',
              received: 'number',
              path: ['name'],
              message: 'Expected string, received number',
            },
            {
              code: 'invalid_type',
              expected: 'string',
              received: 'array',
              path: ['email'],
              message: 'Expected string, received array',
            },
            {
              code: 'invalid_type',
              expected: 'string',
              received: 'undefined',
              path: ['password'],
              message: 'Required',
            },
          ],
        },
      },
    };

    if (Array.isArray(response.body.message)) {
      expect(response.body).toStrictEqual(
        expectResults.bodyMessage.errorsMessage
      );
    } else {
      expect(response.body).toStrictEqual(
        expectResults.bodyMessage.flattenMessage
      );
    }

    expect(response.status).toBe(expectResults.status);
  });

  it('Error: Must not be able to create a user - Invalid body 2', async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .send(createUserRouteMock.userInvalidBody2);

    const expectResults = {
      status: 400,
      bodyMessage: {
        flattenMessage: {
          message: {
            name: ['String must contain at most 45 character(s)'],
            email: ['Invalid email'],
            password: ['Expected string, received number'],
          },
        },
        errorsMessage: {
          message: [
            {
              code: 'too_big',
              maximum: 45,
              type: 'string',
              inclusive: true,
              exact: false,
              message: 'String must contain at most 45 character(s)',
              path: ['name'],
            },
            {
              validation: 'email',
              code: 'invalid_string',
              message: 'Invalid email',
              path: ['email'],
            },
            {
              code: 'invalid_type',
              expected: 'string',
              received: 'number',
              path: ['password'],
              message: 'Expected string, received number',
            },
          ],
        },
      },
    };

    if (Array.isArray(response.body.message)) {
      expect(response.body).toStrictEqual(
        expectResults.bodyMessage.errorsMessage
      );
    } else {
      expect(response.body).toStrictEqual(
        expectResults.bodyMessage.flattenMessage
      );
    }

    expect(response.status).toBe(expectResults.status);
  });
});
