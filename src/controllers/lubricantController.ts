import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Lubricant } from '../entity/Lubricant';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

const repo = () => AppDataSource.getRepository(Lubricant);

export async function createLubricant(req: Request, res: Response) {
  const data = req.body;
  const item = repo().create(data);
  await repo().save(item);
  return res.status(201).json(item);
}

export async function listLubricants(req: Request, res: Response) {
  const q = req.query.q as string | undefined;
  const qb = repo().createQueryBuilder('l');
  if (q) qb.where('l.Codigo ILIKE :q OR l.Nombre ILIKE :q', { q: `%${q}%` });
  const items = await qb.getMany();
  return res.json(items);
}

export async function getLubricant(req: Request, res: Response) {
  const id = req.params.id;
  const item = await repo().findOneBy({ id });
  if (!item) return res.status(404).json({ message: 'No encontrado' });
  return res.json(item);
}

export async function updateLubricant(req: Request, res: Response) {
  const id = req.params.id;
  const item = await repo().findOneBy({ id });
  if (!item) return res.status(404).json({ message: 'No encontrado' });
  repo().merge(item, req.body);
  await repo().save(item);
  return res.json(item);
}

export async function deleteLubricant(req: Request, res: Response) {
  const id = req.params.id;
  await repo().delete(id);
  return res.json({ message: 'Eliminado' });
}

export async function exportLubricantsExcel(req: Request, res: Response) {
  const items = await repo().find();
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Lubricantes');
  sheet.columns = [
    { header: 'Codigo', key: 'Codigo', width: 20 },
    { header: 'Nombre', key: 'Nombre', width: 30 },
    { header: 'Marca', key: 'Marca', width: 20 },
    { header: 'Tipo', key: 'Tipo', width: 15 },
  ];
  items.forEach(i => sheet.addRow(i));
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=lubricantes.xlsx');
  await workbook.xlsx.write(res);
  res.end();
}

export async function exportLubricantsPDF(req: Request, res: Response) {
  const items = await repo().find();
  const doc = new PDFDocument({ margin: 30 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=lubricantes.pdf');
  doc.pipe(res);
  doc.fontSize(18).text('Listado de Lubricantes', { align: 'center' });
  doc.moveDown();
  items.forEach(l => {
    doc.fontSize(12).text(`${l.Codigo} - ${l.Nombre}`);
    doc.text(`Marca: ${l.Marca || '-'} | Tipo: ${l.Tipo || '-'} | NLGI: ${l.NLGI || '-'}`);
    doc.moveDown();
  });
  doc.end();
}
