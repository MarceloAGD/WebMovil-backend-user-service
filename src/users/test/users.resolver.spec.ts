import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

describe('UsersResolver', () => {
  let resolver: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersController, UsersService],
    }).compile();

    resolver = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
