import 'reflect-metadata';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { Role } from '../entity/Role';
import { hashPassword, comparePassword } from '../utils/hash';

async function run() {
  await AppDataSource.initialize();
  const roleRepo = AppDataSource.getRepository(Role);
  const userRepo = AppDataSource.getRepository(User);

  let role = await roleRepo.findOneBy({ name: 'Administrador' });
  if (!role) {
    role = roleRepo.create({ name: 'Administrador' });
    await roleRepo.save(role);
  }

  const email = process.env.SEED_ADMIN_EMAIL || 'admin@permoda.local';
  const password = process.env.SEED_ADMIN_PASSWORD || '123456';
  const existing = await userRepo.findOneBy({ email });
  if (existing) {
    const match = await comparePassword(password, existing.password);
    if (!match) {
      existing.password = await hashPassword(password);
      await userRepo.save(existing);
      console.log('Updated admin password:', email);
    } else {
      console.log('Admin user already exists:', email);
    }
    process.exit(0);
  }

  const user = userRepo.create({ email, password: await hashPassword(password), fullName: 'Admin Permoda', role });
  await userRepo.save(user);
  console.log('Created admin user:', email);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
