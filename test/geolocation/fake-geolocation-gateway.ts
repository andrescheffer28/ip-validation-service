import { GeolocationData, GeolocationGateway } from "@/domain/application/providers/geolocation-gateway"

export class FakeGeolocationGateway implements GeolocationGateway {
  async locate(ip: string): Promise<GeolocationData | null> {
    // Evita tentar geolocalizar IPs locais nos testes
    if (ip === '127.0.0.1' || ip.includes('::1')) {
      return null
    }

    if (ip.startsWith('200.') || ip.startsWith('2001:')) {
      return {
        country: 'United States',
        city: 'Miami',
        latitude: 25.7617,
        longitude: -80.1918,
      }
    }

    return {
      country: 'Brazil',
      city: 'Vila Velha',
      latitude: -20.3297,
      longitude: -40.2925,
    }
  }
}