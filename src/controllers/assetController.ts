import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Asset } from '../entity/Asset';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

const repo = () => AppDataSource.getRepository(Asset);

export async function createAsset(req: Request, res: Response) {
  const data = req.body;
  const asset = repo().create(data);
  await repo().save(asset);
  return res.status(201).json(asset);
}

export async function listAssets(req: Request, res: Response) {
  const q = req.query.q as string | undefined;
  const qb = repo().createQueryBuilder('a');
  if (q) {
    qb.where('a.AF ILIKE :q OR a.NombreEquipo ILIKE :q', { q: `%${q}%` });
  }
  const items = await qb.getMany();
  return res.json(items);
}

export async function getAsset(req: Request, res: Response) {
  const id = req.params.id;
  const item = await repo().findOneBy({ id });
  if (!item) return res.status(404).json({ message: 'No encontrado' });
  return res.json(item);
}

export async function updateAsset(req: Request, res: Response) {
  const id = req.params.id;
  const item = await repo().findOneBy({ id });
  if (!item) return res.status(404).json({ message: 'No encontrado' });
  repo().merge(item, req.body);
  await repo().save(item);
  return res.json(item);
}

export async function deleteAsset(req: Request, res: Response) {
  const id = req.params.id;
  await repo().delete(id);
  return res.json({ message: 'Eliminado' });
}

export async function exportAssetsExcel(req: Request, res: Response) {
  const items = await repo().find();
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Activos');
  sheet.columns = [
    { header: 'AF', key: 'AF', width: 20 },
    { header: 'NombreEquipo', key: 'NombreEquipo', width: 30 },
    { header: 'TipoEquipo', key: 'TipoEquipo', width: 20 },
    { header: 'Area', key: 'Area', width: 20 },
    { header: 'Estado', key: 'Estado', width: 15 },
    { header: 'Criticidad', key: 'Criticidad', width: 15 }
  ];
  items.forEach(i => sheet.addRow(i));
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=activos.xlsx');
  await workbook.xlsx.write(res);
  res.end();
}

export async function exportAssetsPDF(req: Request, res: Response) {
  const items = await repo().find();
  const doc = new PDFDocument({ margin: 30 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=activos.pdf');
  doc.pipe(res);
  doc.fontSize(18).text('Listado de Activos', { align: 'center' });
  doc.moveDown();
  items.forEach(a => {
    doc.fontSize(12).text(`AF: ${a.AF} - ${a.NombreEquipo} (${a.TipoEquipo})`);
    doc.text(`Area: ${a.Area} - Estado: ${a.Estado} - Criticidad: ${a.Criticidad}`);
    if (a.Observaciones) doc.text(`Observaciones: ${a.Observaciones}`);
    doc.moveDown();
  });
  doc.end();
}
