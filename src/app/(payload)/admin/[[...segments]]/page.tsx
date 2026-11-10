import { RootPage, generatePageMetadata } from '@payloadcms/next/views';
import { importMap } from '../../importMap';
import configPromise from '@payload-config';
import { ensurePayloadTables } from '@/lib/db-init';

type Args = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export const generateMetadata = async ({ params, searchParams }: Args) => {
  await ensurePayloadTables();
  return generatePageMetadata({ config: configPromise, params, searchParams });
};

const Page = async ({ params, searchParams }: Args) => {
  await ensurePayloadTables();
  return RootPage({ config: configPromise, params, searchParams, importMap });
};

export default Page;
