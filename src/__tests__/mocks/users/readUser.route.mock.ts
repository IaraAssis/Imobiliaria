import { DeepPartial, Repository } from 'typeorm';
import { AppDataSource } from '../../../data-source';
import { User } from '../../../entities';

type iUserRepo = Repository<User>;
type iUserDeepPartial = DeepPartial<User>;

const readUsers = async (): Promise<Array<User>> => {
  const userRepo: iUserRepo = AppDataSource.getRepository(User);
  const usersTotal: number = 5;

  return await userRepo.save(
    Array.from(Array(usersTotal))
      .map((val, index): iUserDeepPartial => {
        const name: string = `user${index}`;
        const email: string = `${name}@mail.com`;

        return {
          id: expect.any(Number),
          name,
          email,
          password: '1234',
          admin: expect.any(Boolean),
        };
      })
      .map(({ id, ...el }) => el)
  );
};

export default { readUsers };
