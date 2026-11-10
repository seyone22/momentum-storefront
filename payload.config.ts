import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { fileURLToPath } from 'url';
import { Users } from './src/collections/Users';
import { Products } from './src/collections/Products';
import { Orders } from './src/collections/Orders';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Products, Orders],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '0d1a49f8742b7bc145fa8e209865c6928e4693bfb58830720516b251210850fe',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || process.env.POSTGRES_URL || 'postgresql://postgres:postgres@localhost:5432/momentum_db',
    },
    push: true,
  }),
});
