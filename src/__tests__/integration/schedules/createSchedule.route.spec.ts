import supertest from 'supertest';
import { DataSource, DeepPartial } from 'typeorm';
import app from '../../../app';
import { AppDataSource } from '../../../data-source';
import { RealEstate, Schedule, User } from '../../../entities';
import {
  createScheduleRouteMock,
  createUserRouteMock,
  errorsMock,
  readRealEstateRouteMock,
  tokenMock,
} from '../../mocks';

describe('POST /schedules', () => {
  let connection: DataSource;
  const baseUrl: string = '/schedules';

  let realEstate1: DeepPartial<RealEstate>;
  let realEstate2: DeepPartial<RealEstate>;

  let userAdmin: User;
  let userNotAdmin: User;

  let userAdminToken: string;
  let userNotAdminToken: string;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then(async (res) => {
        connection = res;
        [realEstate1, realEstate2] =
          await readRealEstateRouteMock.manyRealStations(2);

        userAdmin = await connection
          .getRepository(User)
          .save(createUserRouteMock.userComplete);

        userNotAdmin = await connection
          .getRepository(User)
          .save(createUserRouteMock.userWithoutAdmin);

        userAdminToken = tokenMock.genToken(true, userAdmin.id);
        userNotAdminToken = tokenMock.genToken(false, userNotAdmin.id);
      })
      .catch((error) => console.error(error));
  });

  beforeEach(async () => {
    await connection
      .getRepository(Schedule)
      .remove(await connection.getRepository(Schedule).find());
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('Success: Must be able create a schedule - Admin token', async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${userAdminToken}`)
      .send({
        ...createScheduleRouteMock.schedulesComplete,
        realEstateId: realEstate1.id,
      });

    const expectResults = {
      status: 201,
      expectBody: { message: 'Schedule created' },
    };

    expect(response.body).toEqual(expectResults.expectBody);
    expect(response.status).toBe(expectResults.status);
  });

  it('Success: Must be able create a schedule - User token', async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${userNotAdminToken}`)
      .send({
        ...createScheduleRouteMock.schedulesComplete,
        realEstateId: realEstate2.id,
      });

    const expectResults = {
      status: 201,
      expectBody: { message: 'Schedule created' },
    };

    expect(response.body).toEqual(expectResults.expectBody);
    expect(response.status).toBe(expectResults.status);
  });

  it('Error: Must not be able to create a schedule - Admin token - Invalid RealEstate ID', async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${userAdminToken}`)
      .send(createScheduleRouteMock.schedulesRealEstateInvalidID);

    expect(response.body).toEqual(errorsMock.notFound.realEstate.error);
    expect(response.status).toBe(errorsMock.notFound.realEstate.status);
  });

  it('Error: Must not be able to create a schedule - Admin token - Real Estate schedule already exists', async () => {
    const payload = createScheduleRouteMock.schedulesUnique;

    await AppDataSource.getRepository(Schedule).save({
      ...payload,
      user: userNotAdmin,
      realEstate: realEstate1,
    });

    const response = await supertest(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${userAdminToken}`)
      .send({ ...payload, realEstateId: realEstate1.id });

    const expectResults = {
      status: 409,
      expectBody: {
        message:
          'Schedule to this real estate at this date and time already exists',
      },
    };

    expect(response.body).toEqual(expectResults.expectBody);
    expect(response.status).toBe(expectResults.status);
  });

  it('Error: Must not be able to create a schedule - Admin token - User schedule already exists', async () => {
    const payload =
      createScheduleRouteMock.schedulesSameDateDifferentRealEstate;

    await AppDataSource.getRepository(Schedule).save({
      ...payload,
      user: userAdmin,
      realEstate: realEstate2,
    });

    const response = await supertest(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${userAdminToken}`)
      .send({ ...payload, realEstateId: realEstate1.id });

    const expectResults = {
      status: 409,
      expectBody: {
        message:
          'User schedule to this real estate at this date and time already exists',
      },
    };

    expect(response.body).toEqual(expectResults.expectBody);
    expect(response.status).toBe(expectResults.status);
  });

  it('Error: Must not be able to create a schedule - Admin token - Schedule before 8AM', async () => {
    const payload = createScheduleRouteMock.schedulesBefore8AM;

    const response = await supertest(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${userAdminToken}`)
      .send({ ...payload, realEstateId: realEstate1.id });

    const expectResults = {
      status: 400,
      expectBody: { message: 'Invalid hour, available times are 8AM to 18PM' },
    };

    expect(response.body).toEqual(expectResults.expectBody);
    expect(response.status).toBe(expectResults.status);
  });

  it('Error: Must not be able to create a schedule - Admin token - Schedule before 18PM', async () => {
    const payload = createScheduleRouteMock.schedulesAfter18PM;

    const response = await supertest(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${userAdminToken}`)
      .send({ ...payload, realEstateId: realEstate1.id });

    const expectResults = {
      status: 400,
      expectBody: { message: 'Invalid hour, available times are 8AM to 18PM' },
    };

    expect(response.body).toEqual(expectResults.expectBody);
    expect(response.status).toBe(expectResults.status);
  });

  it('Error: Must not be able to create a schedule - Admin token - Schedule Saturday', async () => {
    const payload = createScheduleRouteMock.schedulesInvalidDate;

    const response = await supertest(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${userAdminToken}`)
      .send({ ...payload, realEstateId: realEstate1.id });

    const expectResults = {
      status: 400,
      expectBody: { message: 'Invalid date, work days are monday to friday' },
    };

    expect(response.body).toEqual(expectResults.expectBody);
    expect(response.status).toBe(expectResults.status);
  });

  it('Error: Must not be able to create a schedule - Admin token - Invalid body', async () => {
    const payload = createScheduleRouteMock.schedulesInvalidBody;

    const response = await supertest(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${userAdminToken}`)
      .send(payload);

    const expectResults = {
      status: 400,
      expectBody: {
        flattenMessage: {
          message: {
            date: ['Expected string, received number'],
            hour: ['Expected string, received array'],
            realEstateId: ['Expected number, received string'],
          },
        },
        errorsMessage: {
          message: [
            {
              code: 'invalid_type',
              expected: 'string',
              received: 'number',
              path: ['date'],
              message: 'Expected string, received number',
            },
            {
              code: 'invalid_type',
              expected: 'string',
              received: 'array',
              path: ['hour'],
              message: 'Expected string, received array',
            },
            {
              code: 'invalid_type',
              expected: 'number',
              received: 'string',
              path: ['realEstateId'],
              message: 'Expected number, received string',
            },
          ],
        },
      },
    };

    if (Array.isArray(response.body.message)) {
      expect(response.body).toStrictEqual(
        expectResults.expectBody.errorsMessage
      );
    } else {
      expect(response.body).toStrictEqual(
        expectResults.expectBody.flattenMessage
      );
    }

    expect(response.status).toBe(expectResults.status);
  });

  it('Error: Must not be able to create a schedule - Admin token - Invalid body 2', async () => {
    const payload = createScheduleRouteMock.schedulesInvalidBody2;

    const response = await supertest(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${userAdminToken}`)
      .send(payload);

    const expectResults = {
      status: 400,
      expectBody: {
        flattenMessage: {
          message: {
            date: ['Required'],
            hour: ['Required'],
            realEstateId: ['Required'],
          },
        },
        errorsMessage: {
          message: [
            {
              code: 'invalid_type',
              expected: 'string',
              received: 'undefined',
              path: ['date'],
              message: 'Required',
            },
            {
              code: 'invalid_type',
              expected: 'string',
              received: 'undefined',
              path: ['hour'],
              message: 'Required',
            },
            {
              code: 'invalid_type',
              expected: 'number',
              received: 'undefined',
              path: ['realEstateId'],
              message: 'Required',
            },
          ],
        },
      },
    };

    if (Array.isArray(response.body.message)) {
      expect(response.body).toStrictEqual(
        expectResults.expectBody.errorsMessage
      );
    } else {
      expect(response.body).toStrictEqual(
        expectResults.expectBody.flattenMessage
      );
    }

    expect(response.status).toBe(expectResults.status);
  });

  it('Error: Must not be able to create a schedule - Missing bearer', async () => {
    const response = await supertest(app).post(baseUrl).send({});

    expect(response.body).toEqual(errorsMock.missingBearer.error);
    expect(response.status).toBe(errorsMock.missingBearer.status);
  });

  it('Error: Must not be able to create a schedule - Invalid signature', async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${tokenMock.invalidSignature}`)
      .send({});

    expect(response.body).toEqual(errorsMock.invalidSignature.error);
    expect(response.status).toBe(errorsMock.invalidSignature.status);
  });

  it('Error: Must not be able to create a schedule - JWT malformed', async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${tokenMock.jwtMalformed}`)
      .send({});

    expect(response.body).toEqual(errorsMock.jwtMalformed.error);
    expect(response.status).toBe(errorsMock.jwtMalformed.status);
  });
});
