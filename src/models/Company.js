/**
 * Company Model
 * Represents companies that can receive payments
 */

class Company {
  constructor(id, name, category, description) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.description = description;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      description: this.description
    };
  }
}

// Sample companies for the system
const companies = [
  new Company(1, 'Netflix', 'Entretenimiento', 'Servicio de streaming de películas y series'),
  new Company(2, 'Amazon', 'E-commerce', 'Plataforma de compras en línea'),
  new Company(3, 'Spotify', 'Entretenimiento', 'Servicio de música en streaming'),
  new Company(4, 'Microsoft', 'Tecnología', 'Software y servicios en la nube'),
  new Company(5, 'Apple', 'Tecnología', 'Dispositivos y servicios digitales'),
  new Company(6, 'Google Cloud', 'Tecnología', 'Servicios de computación en la nube'),
  new Company(7, 'Uber', 'Transporte', 'Servicio de transporte privado'),
  new Company(8, 'Airbnb', 'Hospitalidad', 'Alquiler de alojamiento')
];

module.exports = {
  Company,
  companies
};
