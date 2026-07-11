export interface GeolocationData {
  country: string
  city: string
  latitude: number
  longitude: number
}

export abstract class GeolocationGateway {
  abstract locate(ip: string): Promise<GeolocationData | null>
}