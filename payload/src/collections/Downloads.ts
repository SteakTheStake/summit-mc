import payload from "payload";
import type { CollectionConfig } from "payload/types";

const Downloads: CollectionConfig = {
  slug: "downloads",
  admin: {
    useAsTitle: "release",
  },
  fields: [
    {
      name: "release",
      type: "text",
      required: true,
    },
    {
      name: "resolution",
      type: "number",
      required: true,
    },
    {
      name: "pack",
      type: "relationship",
      relationTo: "packs",
      required: true,
    },
    {
      name: "tiers",
      type: "relationship",
      relationTo: "tiers",
      hasMany: true,
      required: true,
    },
    {
      name: "file",
      type: "relationship",
      relationTo: "files",
      required: true,
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        try {
          const { id, release, resolution, pack, file } = doc;
          const packDetails = await payload
            .find({
              collection: "packs",
              where: {
                id: {
                  equals: pack,
                },
              },
            })
            .then((pack) => pack.docs[0]);
          const filesDetails = await payload
            .find({
              collection: "files",
              where: {
                id: {
                  equals: file,
                },
              },
            })
            .then((file) => file.docs[0]);

          const fileLocation = "src/" + filesDetails.url;
          const name = `${packDetails.title} ${release} [${resolution}]`;

          const formData = new FormData();
          formData.append("pack_file", new File([name], fileLocation));
          formData.append("id", id);
          formData.append("name", name);
          formData.append("pack", packDetails.title as string);
          formData.append("key", process.env.KEY);

          const res = await fetch(
            process.env.PYTHON_SERVER + "/api/upload-file/",
            {
              method: "POST",
              body: formData,
            },
          );
          if (!res.ok) {
            console.error(await res.text());
          }
          const data = await res.json();
          console.log(data);
        } catch (err) {
          console.error(err);
        }
      },
    ],
  },
};

export default Downloads;
