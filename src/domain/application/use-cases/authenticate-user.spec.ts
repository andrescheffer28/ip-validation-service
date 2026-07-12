import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { AuthenticateUserUseCase } from './authenticate-user'
import { makeUser } from 'test/factories/make-user'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { createFakeIp } from 'test/factories/make-ip'
import { FakeGeolocationGateway } from 'test/geolocation/fake-geolocation-gateway'
import { InMemoryCookiesRepository } from 'test/repositories/in-memory-coockies-repository'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeGeolocationGateway: FakeGeolocationGateway
let inMemoryCookiesRepository:  InMemoryCookiesRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let sut: AuthenticateUserUseCase

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeGeolocationGateway = new FakeGeolocationGateway()
    inMemoryCookiesRepository = new  InMemoryCookiesRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
      fakeGeolocationGateway,
      inMemoryCookiesRepository,
      fakeHasher,
      encrypter
    )
  })

  it('should be able to authenticate an user', async () => {
    const user = makeUser({
      email: 'fernandopessoa@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryUsersRepository.items.push(user)

    const userIP = createFakeIp("mapped")

    const result = await sut.execute({
      email: 'fernandopessoa@example.com',
      password: '123456',
      userIP
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })

    expect(inMemoryCookiesRepository.items).toHaveLength(1)
    expect(inMemoryCookiesRepository.items[0].userID).toBe(user.id)
  })

  it('should not be able to authenticate with a wrong password', async () => {
    const user = makeUser({
      email: 'fernandopessoa@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      email: 'fernandopessoa@example.com',
      password: '123457',
      userIP: createFakeIp("v4")
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
    expect(inMemoryCookiesRepository.items).length(0)
  })

  it('should not be able to authenticate with a non-existing email', async () => {
    const result = await sut.execute({
      email: 'non-existing@example.com',
      password: '123456',
      userIP: createFakeIp('v6'), // Testando também com um formato IPv6 puro[cite: 4]
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
    expect(inMemoryCookiesRepository.items).toHaveLength(0)
  })
})
