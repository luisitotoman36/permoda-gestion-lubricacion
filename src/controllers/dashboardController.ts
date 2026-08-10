import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Asset } from '../entity/Asset';
import { Point } from '../entity/Point';
import { WorkOrder } from '../entity/WorkOrder';
import { Lubricant } from '../entity/Lubricant';
import { History } from '../entity/History';

export async function metrics(req: Request, res: Response) {
  const assetRepo = AppDataSource.getRepository(Asset);
  const pointRepo = AppDataSource.getRepository(Point);
  const woRepo = AppDataSource.getRepository(WorkOrder);
  const lubRepo = AppDataSource.getRepository(Lubricant);
  const histRepo = AppDataSource.getRepository(History);

  const totalAssets = await assetRepo.count();
  const criticalAssets = await assetRepo.count({ where: { Criticidad: 'Alta' } });
  const openOTs = await woRepo.count({ where: { Estado: 'Abierta' } });
  const now = new Date();
  const overdueOTs = await woRepo.createQueryBuilder('w')
    .where("w.FechaProgramada < :now AND w.Estado = 'Abierta'", { now })
    .getCount();

  const pendingLub = await pointRepo.createQueryBuilder('p')
    .where("(p.FechaProximaLubricacion <= :now OR p.FechaProximaLubricacion IS NULL)", { now })
    .getCount();
  const executedLub = await histRepo.count();

  // Consumo por lubricante
  const consumoByLub = await histRepo.createQueryBuilder('h')
    .select('h.Lubricante', 'lub')
    .addSelect('SUM(h.CantidadAplicada)', 'consumo')
    .groupBy('h.Lubricante')
    .getRawMany();

  // Consumo por area (usar Asset->Area)
  const consumoByArea = await histRepo.createQueryBuilder('h')
    .leftJoin('h.Activo', 'a')
    .select('a.Area', 'area')
    .addSelect('SUM(h.CantidadAplicada)', 'consumo')
    .groupBy('a.Area')
    .getRawMany();

  // Pulsos totales
  const totalPulses = await histRepo.createQueryBuilder('h').select('SUM(h.PulsosAplicados)', 'pulsos').getRawOne();

  return res.json({
    totalAssets,
    criticalAssets,
    pendingLub,
    executedLub,
    openOTs,
    overdueOTs,
    consumoByLub,
    consumoByArea,
    totalPulses: Number(totalPulses?.pulsos || 0)
  });
}
