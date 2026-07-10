import { InMemoryEmailsRepository } from 'test/repositories/in-memory-emails-repository'
import { FetchRecentSendedEmailsUseCase } from './fetch-recent-sended-emails'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeEmail } from 'test/factories/make-email'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryEmailsRepository: InMemoryEmailsRepository
let sut: FetchRecentSendedEmailsUseCase

describe('Fetch Recent Sended Emails', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryEmailsRepository = new InMemoryEmailsRepository(inMemoryUsersRepository);
    sut = new FetchRecentSendedEmailsUseCase(inMemoryEmailsRepository);
  })

  it('should be able to fetch recent sended emails', async () => {
    const sender = makeUser({}, new UniqueEntityID('sender-01'))
    const receiver = makeUser({
      name: 'Carlos Drummond',
    })

    await inMemoryUsersRepository.create(sender)
    await inMemoryUsersRepository.create(receiver)

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
      senderId: sender.id.toString(),
    })

    expect(result.value?.emails).toEqual([
      expect.objectContaining(
        {
          createdAt: new Date(2024, 9, 5),
          receiverName: receiver.name,
        }
      ),
      expect.objectContaining({ createdAt: new Date(2024, 9, 4) }),
      expect.objectContaining({ createdAt: new Date(2024, 9, 3) }),
    ])
  })
})
