"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
const Role_1 = require("../entity/Role");
const hash_1 = require("../utils/hash");
async function run() {
    await data_source_1.AppDataSource.initialize();
    const roleRepo = data_source_1.AppDataSource.getRepository(Role_1.Role);
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    let role = await roleRepo.findOneBy({ name: 'Administrador' });
    if (!role) {
        role = roleRepo.create({ name: 'Administrador' });
        await roleRepo.save(role);
    }
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@permoda.local';
    const password = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';
    const existing = await userRepo.findOneBy({ email });
    if (existing) {
        console.log('Admin user already exists:', email);
        process.exit(0);
    }
    const user = userRepo.create({ email, password: await (0, hash_1.hashPassword)(password), fullName: 'Admin Permoda', role });
    await userRepo.save(user);
    console.log('Created admin user:', email);
    process.exit(0);
}
run().catch(err => { console.error(err); process.exit(1); });
