import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Point } from '../entity/Point';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

const repo = () => AppDataSource.getRepository(Point);

export async function createPoint(req: Request, res: Response) {
  const data = req.body;
  const item = repo().create(data);
  await repo().save(item);
  return res.status(201).json(item);
}

export async function listPoints(req: Request, res: Response) {
  const q = req.query.q as string | undefined;
  const qb = repo().createQueryBuilder('p');
  if (q) qb.where('p.CodigoPunto ILIKE :q OR p.Descripcion ILIKE :q', { q: `%${q}%` });
  const items = await qb.getMany();
  return res.json(items);
}

export async function getPoint(req: Request, res: Response) {
  const id = req.params.id;
  const item = await repo().findOneBy({ id });
  if (!item) return res.status(404).json({ message: 'No encontrado' });
  return res.json(item);
}

export async function updatePoint(req: Request, res: Response) {
  const id = req.params.id;
  const item = await repo().findOneBy({ id });
  if (!item) return res.status(404).json({ message: 'No encontrado' });
  repo().merge(item, req.body);
  await repo().save(item);
  return res.json(item);
}

export async function deletePoint(req: Request, res: Response) {
  const id = req.params.id;
  await repo().delete(id);
  return res.json({ message: 'Eliminado' });
}

export async function exportPointsExcel(req: Request, res: Response) {
  const items = await repo().find();
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Puntos');
  sheet.columns = [
    { header: 'CodigoPunto', key: 'CodigoPunto', width: 20 },
    { header: 'Descripcion', key: 'Descripcion', width: 40 },
    { header: 'Componente', key: 'Componente', width: 20 },
    { header: 'Lubricante', key: 'Lubricante', width: 20 },
    { header: 'CantidadGramos', key: 'CantidadGramos', width: 15 },
  ];
  items.forEach(i => sheet.addRow(i));
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=puntos.xlsx');
  await workbook.xlsx.write(res);
  res.end();
}

export async function exportPointsPDF(req: Request, res: Response) {
  const items = await repo().find();
  const doc = new PDFDocument({ margin: 30 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=puntos.pdf');
  doc.pipe(res);
  doc.fontSize(18).text('Listado de Puntos de Lubricación', { align: 'center' });
  doc.moveDown();
  items.forEach(p => {
    doc.fontSize(12).text(`${p.CodigoPunto} - ${p.Descripcion || ''}`);
    doc.text(`Componente: ${p.Componente || '-'} | Lubricante: ${p.Lubricante || '-'} | Cantidad(Gr): ${p.CantidadGramos}`);
    doc.moveDown();
  });
  doc.end();
}
