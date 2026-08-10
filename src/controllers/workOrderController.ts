import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { WorkOrder } from '../entity/WorkOrder';
import { History } from '../entity/History';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

const repo = () => AppDataSource.getRepository(WorkOrder);
const historyRepo = () => AppDataSource.getRepository(History);

export async function createWorkOrder(req: Request, res: Response) {
  const data = req.body;
  const item = repo().create(data);
  await repo().save(item);
  return res.status(201).json(item);
}

export async function listWorkOrders(req: Request, res: Response) {
  const q = req.query.q as string | undefined;
  const qb = repo().createQueryBuilder('w');
  if (q) qb.where('w.NumeroOT ILIKE :q', { q: `%${q}%` });
  const items = await qb.getMany();
  return res.json(items);
}

export async function getWorkOrder(req: Request, res: Response) {
  const id = req.params.id;
  const item = await repo().findOneBy({ id });
  if (!item) return res.status(404).json({ message: 'No encontrado' });
  return res.json(item);
}

export async function updateWorkOrder(req: Request, res: Response) {
  const id = req.params.id;
  const item = await repo().findOneBy({ id });
  if (!item) return res.status(404).json({ message: 'No encontrado' });
  repo().merge(item, req.body);
  await repo().save(item);
  // si se marca ejecutada con FechaEjecucion y cantidad, registrar en History
  if (item.FechaEjecucion && (item.CantidadAplicada || item.PulsosAplicados)) {
    const h = historyRepo().create({
      Fecha: item.FechaEjecucion,
      Usuario: (req as any).user?.email || 'sistema',
      Activo: item.AF,
      Punto: item.PuntoLubricacion,
      Lubricante: item.CantidadAplicada ? String(item.CantidadAplicada) : undefined,
      CantidadAplicada: item.CantidadAplicada,
      PulsosAplicados: item.PulsosAplicados,
      Observaciones: item.Observaciones,
      EvidenciaFotografica: item.Fotografias,
    });
    await historyRepo().save(h);
  }
  return res.json(item);
}

export async function deleteWorkOrder(req: Request, res: Response) {
  const id = req.params.id;
  await repo().delete(id);
  return res.json({ message: 'Eliminado' });
}

export async function exportWorkOrdersExcel(req: Request, res: Response) {
  const items = await repo().find();
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Ordenes');
  sheet.columns = [
    { header: 'NumeroOT', key: 'NumeroOT', width: 20 },
    { header: 'AF', key: 'AF', width: 20 },
    { header: 'Tecnico', key: 'Tecnico', width: 20 },
    { header: 'FechaProgramada', key: 'FechaProgramada', width: 20 },
    { header: 'Estado', key: 'Estado', width: 15 }
  ];
  items.forEach(i => sheet.addRow(i));
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=ordenes.xlsx');
  await workbook.xlsx.write(res);
  res.end();
}

export async function exportWorkOrdersPDF(req: Request, res: Response) {
  const items = await repo().find();
  const doc = new PDFDocument({ margin: 30 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=ordenes.pdf');
  doc.pipe(res);
  doc.fontSize(18).text('Listado de Ordenes de Trabajo', { align: 'center' });
  doc.moveDown();
  items.forEach(o => {
    doc.fontSize(12).text(`${o.NumeroOT} - AF: ${o.AF?.AF || (o.AF as any) || ''}`);
    doc.text(`Tecnico: ${o.Tecnico?.fullName || o.Tecnico || '-'} | Estado: ${o.Estado}`);
    doc.moveDown();
  });
  doc.end();
}
