import supertest from 'supertest';
import { DataSource, DeepPartial } from 'typeorm';
import app from '../../../app';
import { AppDataSource } from '../../../data-source';
import { User } from '../../../entities';
import { errorsMock, readUserRouteMock, tokenMock } from '../../mocks';

describe('GET /users', () => {
  let connection: DataSource;

  const baseUrl: string = '/users';
  let readUsers: DeepPartial<Array<User>>;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then(async (res) => {
        connection = res;
        readUsers = (await readUserRouteMock.readUsers()).map(
          ({ password, ...payload }) => payload
        );
      })
      .catch((error) => console.error(error));
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('Success: Must be able list all users', async () => {
    const response = await supertest(app)
      .get(baseUrl)
      .set('Authorization', `Bearer ${tokenMock.genToken(true, 1)}`)
      .send();

    const expectResults = {
      status: 200,
      expectBody: readUsers,
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toEqual(expectResults.expectBody);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.not.objectContaining({ password: expect.any(String) }),
      ])
    );

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          deletedAt: null,
        }),
      ])
    );
  });

  it('Error: Must not be able list all users: Missing token', async () => {
    const response = await supertest(app).get(baseUrl).send();

    expect(response.status).toBe(errorsMock.missingBearer.status);
    expect(response.body).toStrictEqual(errorsMock.missingBearer.error);
  });

  it('Error: Must not be able list all users: User not admin', async () => {
    const response = await supertest(app)
      .get(baseUrl)
      .set('Authorization', `Bearer ${tokenMock.genToken(false, 1)}`)
      .send();

    expect(response.status).toBe(errorsMock.forbidden.status);
    expect(response.body).toStrictEqual(errorsMock.forbidden.error);
  });

  it('Error: Must not be able list all users: Invalid signature', async () => {
    const response = await supertest(app)
      .get(baseUrl)
      .set('Authorization', `Bearer ${tokenMock.invalidSignature}`)
      .send();

    expect(response.status).toBe(errorsMock.invalidSignature.status);
    expect(response.body).toStrictEqual(errorsMock.invalidSignature.error);
  });

  it('Error: Must not be able list all users: JWT malformed', async () => {
    const response = await supertest(app)
      .get(baseUrl)
      .set('Authorization', `Bearer ${tokenMock.jwtMalformed}`)
      .send();

    expect(response.status).toBe(errorsMock.jwtMalformed.status);
    expect(response.body).toStrictEqual(errorsMock.jwtMalformed.error);
  });
});
