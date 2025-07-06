import fs from 'fs';
import readline from 'readline';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const fileStream = fs.createReadStream('data/incidents.csv');
  const rl = readline.createInterface({ input: fileStream });
  let isHeader = true;
  for await (const line of rl) {
    if (isHeader) { isHeader = false; continue; }
    const [date, country, lat, lon, ...rest] = line.split(',');
    await prisma.incident.create({
      data: {
        date: new Date(date),
        country,
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        // …autres colonnes si besoin
      }
    });
  }
  console.log('Import terminé');
}
main().catch(console.error).finally(() => prisma.$disconnect());