import supertest from "supertest";
import { DataSource } from "typeorm";
import app from "../../../app";
import { AppDataSource } from "../../../data-source";
import { User } from "../../../entities";
import { createSessionRouteMock } from "../../mocks";

describe("POST /login", () => {
  let connection: DataSource;

  const baseUrl: string = "/login";
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

  it("Success: Must be able to login", async () => {
    const user: User = userRepo.create(createSessionRouteMock.userActive);
    await userRepo.save(user);

    const response = await supertest(app)
      .post(baseUrl)
      .send(createSessionRouteMock.userActive);

    const expectResults = {
      status: 200,
      bodyEqual: { token: expect.any(String) },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Error: Must not be able to login - Invalid credential 1 - Wrong password", async () => {
    const user: User = userRepo.create(createSessionRouteMock.userActive);
    await userRepo.save(user);

    const response = await supertest(app)
      .post(baseUrl)
      .send(createSessionRouteMock.userInvalidCredential1);

    const expectResults = {
      status: 401,
      bodyEqual: { message: "Invalid credentials" },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Error: Must not be able to login - Invalid credential 2 - Wrong email", async () => {
    const user: User = userRepo.create(createSessionRouteMock.userActive);
    await userRepo.save(user);

    const response = await supertest(app)
      .post(baseUrl)
      .send(createSessionRouteMock.userInvalidCredential2);

    const expectResults = {
      status: 401,
      bodyEqual: { message: "Invalid credentials" },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Error: Must not be able to login - Invalid credential 3 - User inactive", async () => {
    const user: User = userRepo.create(createSessionRouteMock.userToInactive);
    await userRepo.save(user);
    await userRepo.softRemove(user);

    const response = await supertest(app)
      .post(baseUrl)
      .send(createSessionRouteMock.userToInactive);

    const expectResults = {
      status: 401,
      bodyEqual: { message: "Invalid credentials" },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });
});
