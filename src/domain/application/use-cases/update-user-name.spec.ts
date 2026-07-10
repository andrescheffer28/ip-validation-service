import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UpdateUserNameUseCase } from './update-user-name'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: UpdateUserNameUseCase

describe('Update User Name', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new UpdateUserNameUseCase(inMemoryUsersRepository)
  })

  it('should be able to update the user name', async () => {
    await inMemoryUsersRepository.create(
      makeUser(
        {
          name: 'Fernando Pessoa',
        },
        new UniqueEntityID('123456')
      )
    )

    const result = await sut.execute({
      userId: '123456',
      name: 'Carlos Drummond',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items[0].name).toEqual('Carlos Drummond')
  })

  it('should not be able to update another user name', async () => {
    await inMemoryUsersRepository.create(
      makeUser(
        {
          name: 'Fernando Pessoa',
        },
        new UniqueEntityID('123456')
      )
    )

    const result = await sut.execute({
      userId: 'wrong',
      name: 'Carlos Drummond',
    })

    expect(result.isLeft()).toBe(true)
    expect(inMemoryUsersRepository.items[0].name).toEqual('Fernando Pessoa')
  })
})
