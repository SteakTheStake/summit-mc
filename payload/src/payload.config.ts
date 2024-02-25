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
import Media from "./collections/Media";
import PackFiles from "./collections/PackFiles";

import PrivacyPolicy from "./blocks/globals/PrivacyPolicy";

import { endpoints } from "./endpoints";

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    webpack: (config) => {
      config.resolve.fallback = {
        crypto: false,
        os: false,
        fs: false,
      };

      return config;
    },
  },
  editor: slateEditor({}),
  collections: [Users, Posts, Downloads, Tiers, Packs, Codes, Media, PackFiles],
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
