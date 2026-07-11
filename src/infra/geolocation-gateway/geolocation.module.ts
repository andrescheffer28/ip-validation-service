import { Module } from '@nestjs/common';
import { GeolocationGateway } from '@/domain/application/providers/geolocation-gateway';
import { IPLocationGeolocation } from './ip-locate/ip-location-geolocation';
import { EnvModule } from '../env/env.module';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: GeolocationGateway,
      useClass: IPLocationGeolocation,
    },
  ],
  exports: [GeolocationGateway],
})
export class GeolocationModule {}