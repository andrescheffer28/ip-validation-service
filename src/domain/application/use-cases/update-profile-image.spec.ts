import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { UpdateProfileImageUseCase } from './update-profile-image'
import { makeUser } from 'test/factories/make-user'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: UpdateProfileImageUseCase

describe('Update Profile Image', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new UpdateProfileImageUseCase(inMemoryUsersRepository)
  })

  it('should be able to update the profile image', async () => {
    await inMemoryUsersRepository.create(
      makeUser(
        {
          profileImage: 'sem foto',
        },
        new UniqueEntityID('123456')
      )
    )

    const result = await sut.execute({
      userId: '123456',
      profileImage: 'google.com',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items[0].profileImage).toEqual('google.com')
  })

  it('should not be able to update another user profile image', async () => {
    await inMemoryUsersRepository.create(
      makeUser(
        {
          profileImage: 'sem foto',
        },
        new UniqueEntityID('123456')
      )
    )

    const result = await sut.execute({
      userId: 'wrong',
      profileImage: 'google.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(inMemoryUsersRepository.items[0].profileImage).toEqual('sem foto')
  })
})
