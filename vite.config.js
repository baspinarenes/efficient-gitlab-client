import { resolve } from "path";

/** @type {import('vite').UserConfig} */
export default {
  build: {
    lib: {
      entry: [
        resolve(__dirname, "src/rest/rest.ts"),
        resolve(__dirname, "src/graphql/graphql.ts"),
      ],
      name: "Efficient Gitlab Client",
      fileName: (format, entryName) => {
        if (format === "es") {
          return `${entryName}.js`;
        }

        return `${entryName}.${format}`;
      },
    },
  },
};
