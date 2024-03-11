import supertest from 'supertest';
import { DataSource } from 'typeorm';
import app from '../../../app';
import { AppDataSource } from '../../../data-source';
import { Address, Category, RealEstate } from '../../../entities';
import { createRealEstateRouteMock, errorsMock, tokenMock } from '../../mocks';

describe('POST /realEstate', () => {
  let connection: DataSource;
  const baseUrl: string = '/realEstate';

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((error) => console.error(error));
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('Success: Must be able to create real estates - Admin token - Full body', async () => {
    const { categoryToCreate, ...payload } =
      createRealEstateRouteMock.realEstateComplete;

    const category = await AppDataSource.getRepository(Category).save(
      categoryToCreate
    );

    const response = await supertest(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${tokenMock.genToken(true, 1)}`)
      .send({ ...payload, categoryId: category.id });

    const expectResults = {
      status: 201,
      expectBody: { ...payload, category },
    };

    expect(response.body).toEqual(
      expect.objectContaining(expectResults.expectBody)
    );
    expect(response.status).toBe(expectResults.status);
  });

  it('Error: Must not be able to create real estates - Admin token - Unique address', async () => {
    const { categoryToCreate, ...payload } =
      createRealEstateRouteMock.realEstateUnique;

    const { address: addressInfo, ...realEstateInfo } = payload;

    const category = await AppDataSource.getRepository(Category).save(
      categoryToCreate
    );

    await AppDataSource.getRepository(Address).save(addressInfo);
    await AppDataSource.getRepository(RealEstate).save(realEstateInfo);

    const response = await supertest(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${tokenMock.genToken(true, 1)}`)
      .send({ ...payload, categoryId: category.id });

    const expectResults = {
      status: 409,
      expectBody: { message: 'Address already exists' },
    };

    expect(response.body).toEqual(expectResults.expectBody);
    expect(response.status).toBe(expectResults.status);
  });

  it('Error: Must not be able to create real estates - Admin token - Invalid body', async () => {
    const { categoryToCreate, ...realEstateInfo } =
      createRealEstateRouteMock.realEstateInvalidBody;

    const category = await AppDataSource.getRepository(Category).save(
      categoryToCreate
    );

    const response = await supertest(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${tokenMock.genToken(true, 1)}`)
      .send({ ...realEstateInfo, categoryId: category.id });

    const expectResults = {
      status: 400,
      expectBody: {
        flattenMessage: {
          message: {
            address: [
              'Expected string, received array',
              'String must contain at most 8 character(s)',
              'Required',
              'Expected string, received object',
              'String must contain at most 2 character(s)',
            ],
            size: ['Number must be greater than 0'],
          },
        },
        errorsMessage: {
          message: [
            {
              code: 'too_small',
              minimum: 0,
              type: 'number',
              inclusive: false,
              exact: false,
              message: 'Number must be greater than 0',
              path: ['size'],
            },
            {
              code: 'invalid_type',
              expected: 'string',
              received: 'array',
              path: ['address', 'street'],
              message: 'Expected string, received array',
            },
            {
              code: 'too_big',
              maximum: 8,
              type: 'string',
              inclusive: true,
              exact: false,
              message: 'String must contain at most 8 character(s)',
              path: ['address', 'zipCode'],
            },
            {
              code: 'invalid_type',
              expected: 'number',
              message: 'Required',
              path: ['address', 'number'],
              received: 'undefined',
            },
            {
              code: 'invalid_type',
              expected: 'string',
              received: 'object',
              path: ['address', 'city'],
              message: 'Expected string, received object',
            },
            {
              code: 'too_big',
              maximum: 2,
              type: 'string',
              inclusive: true,
              exact: false,
              message: 'String must contain at most 2 character(s)',
              path: ['address', 'state'],
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

  it('Error: Must not be able to create real estates - Admin token - Invalid body 2', async () => {
    const { categoryToCreate, ...realEstateInfo } =
      createRealEstateRouteMock.realEstateInvalidBody2;

    const category = await AppDataSource.getRepository(Category).save(
      categoryToCreate
    );

    const response = await supertest(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${tokenMock.genToken(true, 1)}`)
      .send({ ...realEstateInfo, categoryId: category.id });

    const expectResults = {
      status: 400,
      expectBody: {
        flattenMessage: {
          message: {
            address: ['Required'],
            size: ['Required'],
          },
        },
        errorsMessage: {
          message: [
            {
              code: 'invalid_type',
              expected: 'number',
              received: 'undefined',
              path: ['size'],
              message: 'Required',
            },
            {
              code: 'invalid_type',
              expected: 'object',
              received: 'undefined',
              path: ['address'],
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

  it('Error: Must be not able to create real estates - User token', async () => {
    const { categoryToCreate, address, ...realEstateInfo } =
      createRealEstateRouteMock.realEstateAddressWithoutNumber;

    const { number, ...addressInfo } = address;

    const category = await AppDataSource.getRepository(Category).save(
      categoryToCreate
    );

    const response = await supertest(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${tokenMock.genToken(false, 1)}`)
      .send({
        ...realEstateInfo,
        address: addressInfo,
        categoryId: category.id,
      });

    expect(response.body).toEqual(errorsMock.forbidden.error);
    expect(response.status).toBe(errorsMock.forbidden.status);
  });

  it('Error: Must be not able to create real estates - Missing bearer', async () => {
    const { categoryToCreate, address, ...realEstateInfo } =
      createRealEstateRouteMock.realEstateAddressWithoutNumber;

    const { number, ...addressInfo } = address;

    const category = await AppDataSource.getRepository(Category).save(
      categoryToCreate
    );

    const response = await supertest(app)
      .post(baseUrl)
      .send({
        ...realEstateInfo,
        address: addressInfo,
        categoryId: category.id,
      });

    expect(response.body).toEqual(errorsMock.missingBearer.error);
    expect(response.status).toBe(errorsMock.missingBearer.status);
  });

  it('Error: Must be not able to create real estates - Invalid signature', async () => {
    const { categoryToCreate, address, ...realEstateInfo } =
      createRealEstateRouteMock.realEstateAddressWithoutNumber;

    const { number, ...addressInfo } = address;

    const category = await AppDataSource.getRepository(Category).save(
      categoryToCreate
    );

    const response = await supertest(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${tokenMock.invalidSignature}`)
      .send({
        ...realEstateInfo,
        address: addressInfo,
        categoryId: category.id,
      });

    expect(response.body).toEqual(errorsMock.invalidSignature.error);
    expect(response.status).toBe(errorsMock.invalidSignature.status);
  });

  it('Error: Must be not able to create real estates - JWT malformed', async () => {
    const { categoryToCreate, address, ...realEstateInfo } =
      createRealEstateRouteMock.realEstateAddressWithoutNumber;

    const { number, ...addressInfo } = address;

    const category = await AppDataSource.getRepository(Category).save(
      categoryToCreate
    );

    const response = await supertest(app)
      .post(baseUrl)
      .set('Authorization', `Bearer ${tokenMock.jwtMalformed}`)
      .send({
        ...realEstateInfo,
        address: addressInfo,
        categoryId: category.id,
      });

    expect(response.body).toEqual(errorsMock.jwtMalformed.error);
    expect(response.status).toBe(errorsMock.jwtMalformed.status);
  });
});
