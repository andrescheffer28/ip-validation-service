import { faker } from '@faker-js/faker';

export const createFakeIp = (type: 'v4' | 'v6' | 'mapped' = 'v4'): string => {
  if (type === 'v6') {
    return faker.internet.ipv6(); // Ex: 2001:db8:85a3::8a2e:370:7334
  }
  
  if (type === 'mapped') {
    return `::ffff:${faker.internet.ipv4()}`; // Ex: ::ffff:192.168.1.50
  }

  return faker.internet.ipv4(); // Ex: 192.168.1.1
};