import { InMemoryCookiesRepository } from "test/repositories/in-memory-cookies-repository";
import { IPValidatorUseCase } from "./ip-validator";
import { FakeGeolocationGateway } from "test/geolocation/fake-geolocation-gateway";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { createFakeIp } from "test/factories/make-ip";
import { Cookie } from "@/domain/enterprise/entities/cookie";

let inMemoryCookiesRepository: InMemoryCookiesRepository
let fakeGeolocationGateway: FakeGeolocationGateway
let sut: IPValidatorUseCase

describe('Validate userIP', () => {
  beforeEach(() => {
    inMemoryCookiesRepository = new InMemoryCookiesRepository()
    fakeGeolocationGateway = new FakeGeolocationGateway()
    sut = new IPValidatorUseCase(
      inMemoryCookiesRepository,
      fakeGeolocationGateway
    )
  })

  it('should be able to validate IP and return geolocation data from stored cookie', async() => {
    const userID = new UniqueEntityID('user-1')
    const fakeStoredIP = createFakeIp('v4')

    const fakeGeolocation = await fakeGeolocationGateway.locate(fakeStoredIP)

    expect(fakeGeolocation).toBeTruthy()

    if(fakeGeolocation){
      const existingCookie = Cookie.create(
        {
          userID,
          userIP: fakeStoredIP,
          city: fakeGeolocation.city,
          country: fakeGeolocation.country,
        }
      )

      await inMemoryCookiesRepository.create(existingCookie)
    }

    const result = await sut.execute({
      currentUserIP: fakeStoredIP,
      userID: userID.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        isValid: true,
      })
    )
  })

  it('should return isValid false if current IP does not match stored cookie IP', async() => {
    const userID = new UniqueEntityID('user-1')
    const fakeStoredIP = createFakeIp('v4')

    const fakeGeolocation = await fakeGeolocationGateway.locate(fakeStoredIP)

    expect(fakeGeolocation).toBeTruthy()

    if(fakeGeolocation){
      const existingCookie = Cookie.create(
        {
          userID,
          userIP: fakeStoredIP,
          city: fakeGeolocation.city,
          country: fakeGeolocation.country,
        }
      )
      await inMemoryCookiesRepository.create(existingCookie)
    }

    const result = await sut.execute({
      userID: 'user-1',
      currentUserIP: '200.123.45.67'
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        isValid: false,
      })
    )
  })
})