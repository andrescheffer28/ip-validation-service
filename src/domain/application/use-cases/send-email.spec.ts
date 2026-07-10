import { InMemoryEmailsRepository } from 'test/repositories/in-memory-emails-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { SendEmailUseCase } from './send-email'
import { makeUser } from 'test/factories/make-user'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryEmailsRepository: InMemoryEmailsRepository
let sut: SendEmailUseCase

describe('Send Email', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryEmailsRepository = new InMemoryEmailsRepository(inMemoryUsersRepository)

    sut = new SendEmailUseCase(
      inMemoryEmailsRepository,
      inMemoryUsersRepository
    )
  })

  it('should be able to send an email to an existing user', async () => {
    const sender = makeUser()
    const receiver = makeUser()

    inMemoryUsersRepository.items.push(sender)
    inMemoryUsersRepository.items.push(receiver)

    const result = await sut.execute({
      title: 'Alienista',
      content: 'Email content',
      senderId: sender.id.toString(),
      receiverEmail: receiver.email,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      email: inMemoryEmailsRepository.items[0],
    })
  })

  it('should not be able to send an email to a not existing user', async () => {
    const sender = makeUser()

    inMemoryUsersRepository.items.push(sender)

    const result = await sut.execute({
      title: 'Alienista',
      content: 'Email content',
      senderId: sender.id.toString(),
      receiverEmail: 'fernandopessoa@exemple.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
