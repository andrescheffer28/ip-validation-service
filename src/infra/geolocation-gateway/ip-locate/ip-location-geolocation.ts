import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { GeolocationData, GeolocationGateway } from "@/domain/application/providers/geolocation-gateway";
import { EnvService } from "@/infra/env/env.service";

@Injectable()
export class IPLocationGeolocation implements GeolocationGateway {
  private readonly cliente: AxiosInstance;

  constructor(private envService: EnvService) {
    this.cliente = axios.create({
      baseURL: 'https://www.iplocate.io/api/lookup',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-API-KEY': this.envService.get('IPLOCATE_API_KEY')
      }
    });
  }

  async locate(ip: string): Promise<GeolocationData | null> {
    if (
      ip === '127.0.0.1' || 
      ip === '::1' || 
      ip.startsWith('192.168.') || 
      ip.startsWith('10.')
    ) {
      return null;
    }

    try {
      const response = await this.cliente.get(`/${ip}`);
      const data = response.data;

      // 2. Validação: O IPLocate retorna o campo 'country' como null se não encontrar nada
      if (!data || !data.country) {
        return null;
      }

      // 3. Mapeia a resposta exata do IPLocate para a sua interface de Domínio
      return {
        country: data.country,
        city: data.city,
        longitude: data.longitude,
        latitude: data.latitude,
      };

    } catch (error) {
      console.error(`[Geolocation] Erro ao buscar IP ${ip} no IPLocate:`, error);
      return null; 
    }
  }
}