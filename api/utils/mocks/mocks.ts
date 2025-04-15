import { faker } from '@faker-js/faker';

export class MockData {
  
  generateMockUser(gender: 'male' | 'female' = 'female') {
    const name = faker.person.firstName(gender);
    const lastName = faker.person.lastName();
    const username = `${name.toLowerCase()}${lastName.toLowerCase()}`;
    const password = faker.internet.password();
    const hobbie = this.generateSport();
    const roles = ['admin'];

    return {
      name,
      lastName,
      username,
      password,
      hobbie,
      gender,
      roles
    }
  }

  generateSport() {
    const sports = ['Basketball', 'Tennis', 'Swimming', 'Boxing', 'Volleyball', 'Hockey', 'Hiking', 'Race car'];
    const random = Math.floor(Math.random() * sports.length);
    return sports[random];
  }
}