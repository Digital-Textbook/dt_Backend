import { DataSource } from 'typeorm';
import { Users } from './modules/user/entities/users.entity';
import { StudentProfile } from './modules/user/entities/studentProfile.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Users, StudentProfile], // List all your entities here
  migrations: ['src/db/migrations/*.ts'], // Path to your migration files
  synchronize: false, // Set to false for production environments
  logging: true,
});

export default AppDataSource;
