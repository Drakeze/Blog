import fs from 'fs/promises';
import path from 'path';

async function ensureFile(filePath: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch (error) {
    const errorWithCode = error as NodeJS.ErrnoException;
    if (errorWithCode.code === 'ENOENT') {
      await fs.writeFile(filePath, '[]', 'utf8');
    } else {
      throw error;
    }
  }
}

export async function appendJsonRecord<T extends object>(fileName: string, record: T) {
  const filePath = path.join(process.cwd(), 'data', fileName);
  await ensureFile(filePath);
  const raw = await fs.readFile(filePath, 'utf8');
  const parsed = raw ? JSON.parse(raw) : [];
  parsed.push(record);
  await fs.writeFile(filePath, JSON.stringify(parsed, null, 2), 'utf8');
  return record;
}
