import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { Role } from '../entity/Role';
import { hashPassword, comparePassword } from '../utils/hash';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const userRepo = () => AppDataSource.getRepository(User);
const roleRepo = () => AppDataSource.getRepository(Role);

export async function listUsers(req: Request, res: Response) {
  const users = await userRepo().find({ relations: ['role'], order: { fullName: 'ASC' } });
  return res.json(users.map(user => ({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role?.name || 'Sin rol',
    active: user.active
  })));
}

export async function toggleUserStatus(req: Request, res: Response) {
  const { id } = req.params;
  const currentUser = (req as any).user;
  const user = await userRepo().findOne({ where: { id }, relations: ['role'] });
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  if (user.id === currentUser?.sub) return res.status(400).json({ message: 'No puedes bloquear tu propio usuario' });

  user.active = !user.active;
  await userRepo().save(user);

  return res.json({
    id: user.id,
    active: user.active,
    fullName: user.fullName,
    role: user.role?.name || 'Sin rol'
  });
}

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;
  const currentUser = (req as any).user;
  const user = await userRepo().findOneBy({ id });
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  if (user.id === currentUser?.sub) return res.status(400).json({ message: 'No puedes eliminar tu propio usuario' });

  await userRepo().delete(id);
  return res.json({ message: 'Usuario eliminado' });
}

export async function register(req: Request, res: Response) {
  const { email, password, fullName, roleName } = req.body;
  if (!email || !password || !fullName) return res.status(400).json({ message: 'Campos requeridos' });
  const existing = await userRepo().findOneBy({ email });
  if (existing) return res.status(400).json({ message: 'Usuario ya existe' });
  let role = await roleRepo().findOneBy({ name: roleName || 'Lubricador' });
  if (!role) {
    role = roleRepo().create({ name: roleName || 'Lubricador' });
    await roleRepo().save(role);
  }
  const hashed = await hashPassword(password);
  const user = userRepo().create({ email, password: hashed, fullName, role });
  await userRepo().save(user);
  return res.status(201).json({ id: user.id, email: user.email, fullName: user.fullName, role: role.name });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Credenciales requeridas' });
  const user = await userRepo().findOne({ where: { email }, relations: ['role'] });
  if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });
  if (!user.active) return res.status(401).json({ message: 'Usuario bloqueado' });
  const ok = await comparePassword(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });
  const secret = process.env.JWT_SECRET || 'change_this_strong_secret';
  const expiresIn = (process.env.JWT_EXPIRES_IN || '8h') as jwt.SignOptions['expiresIn'];
  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role.name },
    secret,
    { expiresIn } as jwt.SignOptions
  );
  return res.json({ token, user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role.name } });
}

export async function changePassword(req: Request, res: Response) {
  const userId = (req as any).user?.sub;
  const { currentPassword, newPassword } = req.body;
  if (!userId) return res.status(401).json({ message: 'No autorizado' });
  const user = await userRepo().findOneBy({ id: userId });
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  const ok = await comparePassword(currentPassword, user.password);
  if (!ok) return res.status(400).json({ message: 'Contraseña actual incorrecta' });
  user.password = await hashPassword(newPassword);
  await userRepo().save(user);
  return res.json({ message: 'Contraseña actualizada' });
}

export async function requestPasswordReset(req: Request, res: Response) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email requerido' });
  const user = await userRepo().findOneBy({ email });
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  const token = uuidv4();
  // Guardar token en campo temporal de password (no ideal) o en otra tabla; aquí devolvemos token para que el cliente lo use con frontend/SMTP configurado
  const secret = process.env.JWT_SECRET || 'change_this_strong_secret';
  const resetToken = jwt.sign({ sub: user.id, t: token }, secret, { expiresIn: '1h' } as jwt.SignOptions);
  return res.json({ resetToken });
}

export async function resetPassword(req: Request, res: Response) {
  const { resetToken, newPassword } = req.body;
  if (!resetToken || !newPassword) return res.status(400).json({ message: 'Datos requeridos' });
  try {
    const secret = process.env.JWT_SECRET || 'change_this_strong_secret';
    const payload: any = jwt.verify(resetToken, secret);
    const user = await userRepo().findOneBy({ id: payload.sub });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    user.password = await hashPassword(newPassword);
    await userRepo().save(user);
    return res.json({ message: 'Contraseña restablecida' });
  } catch (err) {
    return res.status(400).json({ message: 'Token inválido o expirado' });
  }
}
