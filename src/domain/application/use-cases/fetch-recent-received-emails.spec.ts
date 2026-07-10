import { InMemoryEmailsRepository } from 'test/repositories/in-memory-emails-repository'
import { FetchRecentReceivedEmailsUseCase } from './fetch-recent-received-emails'
import { makeEmail } from 'test/factories/make-email'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'

let inMemoryUserRepository: InMemoryUsersRepository
let inMemoryEmailsRepository: InMemoryEmailsRepository
let sut: FetchRecentReceivedEmailsUseCase

describe('Fetch Recent Received Emails', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    inMemoryEmailsRepository = new InMemoryEmailsRepository(inMemoryUserRepository);
    sut = new FetchRecentReceivedEmailsUseCase(inMemoryEmailsRepository)
  })

  it('should be able to fetch recent received emails', async () => {
    const sender = makeUser({
      name: 'Clarice Lispector',
    })
    const receiver = makeUser({}, new UniqueEntityID('receiver-01'))

    await inMemoryUserRepository.create(sender)
    await inMemoryUserRepository.create(receiver)

    await inMemoryEmailsRepository.create(
      makeEmail({
        senderId: sender.id,
        receiverId: receiver.id,
        createdAt: new Date(2024, 9, 3),
      })
    )

    await inMemoryEmailsRepository.create(
      makeEmail({
        senderId: sender.id,
        receiverId: receiver.id,
        createdAt: new Date(2024, 9, 4),
      })
    )

    await inMemoryEmailsRepository.create(
      makeEmail({
        senderId: sender.id,
        receiverId: receiver.id,
        createdAt: new Date(2024, 9, 5),
      })
    )

    const result = await sut.execute({
      receiverId: receiver.id.toString(),
    })

    expect(result.value?.emails).toEqual([
      expect.objectContaining(
        {
          senderName: sender.name,
          createdAt: new Date(2024, 9, 5)
        }
      ),
      expect.objectContaining(
        {
          senderName: sender.name,
          createdAt: new Date(2024, 9, 4)
        }
      ),
      expect.objectContaining(
        {
          senderName: sender.name,
          createdAt: new Date(2024, 9, 3)
        }
      ),
    ])
  })
})
