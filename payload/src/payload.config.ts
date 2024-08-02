import path from "path";

import { payloadCloud } from "@payloadcms/plugin-cloud";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { slateEditor } from "@payloadcms/richtext-slate";
import { buildConfig } from "payload/config";

import Users from "./collections/Users";
import Posts from "./collections/Posts";
import Downloads from "./collections/Downloads";
import Tiers from "./collections/Tiers";
import Packs from "./collections/Packs";
import Codes from "./collections/Codes";
import Logs from "./collections/Logs";
import Media from "./collections/Media";
import PackFiles from "./collections/PackFiles";

import PrivacyPolicy from "./blocks/globals/PrivacyPolicy";

import { endpoints } from "./endpoints";

const mockModulePath = path.resolve(__dirname, "./emptyModuleMock");

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    webpack: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          zlib: false,
        },
        alias: {
          ...config.resolve.alias,
          [path.resolve(__dirname, "../node_modules/adm-zip")]: mockModulePath,
          [path.resolve(__dirname, "../node_modules/adm-zip/util")]:
            mockModulePath,
          [path.resolve(__dirname, "../node_modules/adm-zip/methods")]:
            mockModulePath,
        },
      },
    }),
  },
  editor: slateEditor({}),
  collections: [
    Users,
    Posts,
    Downloads,
    Tiers,
    Packs,
    Codes,
    Logs,
    Media,
    PackFiles,
  ],
  globals: [PrivacyPolicy],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  plugins: [payloadCloud()],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
  endpoints,
  upload: {
    limits: {
      fileSize: 5000000000000,
    },
  },
  express: {
    json: {
      limit: 5000000000000,
    },
  },
});
