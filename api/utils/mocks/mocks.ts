import { Faker } from '@faker-js/faker';

export class MockDataGenerator extends Faker {
  
  generateMockUser(gender: 'male' | 'female') {
    const name = this.person.firstName(gender);
    const lastName = this.person.lastName();
    const username = `${name.toLowerCase()}${lastName.toLowerCase()}`;
    const password = this.internet.password();
    const hobbie = this.generateSport();
    const roles = ['user'];

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