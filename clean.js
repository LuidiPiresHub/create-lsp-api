import * as fs from 'fs';
import * as fsx from 'fs-extra';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templateDir = path.join(__dirname, 'template');

async function cleanTemplate() {
  await fsx.remove(path.join(templateDir, 'node_modules'));
  await fsx.remove(path.join(templateDir, 'package-lock.json'));

  const prismaDir = path.join(templateDir, 'prisma');
  const files = fs.readdirSync(prismaDir);
  await Promise.all(files.map(async (file) => {
    if (file !== 'schema.prisma') {
      await fsx.remove(path.join(prismaDir, file));
    }
  }));
}

cleanTemplate();