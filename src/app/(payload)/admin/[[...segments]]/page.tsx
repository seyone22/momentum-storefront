import { RootPage, generatePageMetadata } from '@payloadcms/next/views';
import { importMap } from '../importMap.js';
import configPromise from '@payload-config';

type Args = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export const generateMetadata = async ({ params, searchParams }: Args) => {
  return generatePageMetadata({ config: configPromise, params, searchParams });
};

const Page = async ({ params, searchParams }: Args) => {
  return RootPage({ config: configPromise, params, searchParams, importMap });
};

export default Page;
