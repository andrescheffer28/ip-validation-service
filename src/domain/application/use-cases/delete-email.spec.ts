import { DeleteEmailUseCase } from './delete-email'
import { makeEmail } from 'test/factories/make-email'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryEmailsRepository } from 'test/repositories/in-memory-emails-repository'

let inMemoryUserRepository: InMemoryUsersRepository
let inMemoryEmailsRepository: InMemoryEmailsRepository
let sut: DeleteEmailUseCase

describe('Delete Email', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository()
    inMemoryEmailsRepository = new InMemoryEmailsRepository(inMemoryUserRepository)
    sut = new DeleteEmailUseCase(inMemoryEmailsRepository)
  })

  it('should be able to delete an email', async () => {
    await inMemoryEmailsRepository.create(
      makeEmail(
        {
          senderId: new UniqueEntityID('123456'),
        },
        new UniqueEntityID('email-01')
      )
    )

    await sut.execute({
      senderId: '123456',
      emailId: 'email-01',
    })

    expect(inMemoryEmailsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an email already seen by the receiver', async () => {
    await inMemoryEmailsRepository.create(
      makeEmail(
        {
          senderId: new UniqueEntityID('123456'),
        },
        new UniqueEntityID('email-01')
      )
    )

    inMemoryEmailsRepository.items[0].isSeen = true

    const result = await sut.execute({
      senderId: '123456',
      emailId: 'email-01',
    })

    expect(inMemoryEmailsRepository.items).toHaveLength(1)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to delete from another sender email ', async () => {
    await inMemoryEmailsRepository.create(
      makeEmail(
        {
          senderId: new UniqueEntityID('123456'),
        },
        new UniqueEntityID('email-01')
      )
    )

    const result = await sut.execute({
      senderId: 'wrong',
      emailId: 'email-01',
    })

    expect(inMemoryEmailsRepository.items).toHaveLength(1)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
