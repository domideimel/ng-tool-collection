import { createGlobPatternsForDependencies } from "@nx/angular/tailwind";
import { join } from "path";

/** @type {import("tailwindcss").Config} */
export default {
  content: [join(__dirname, "src/**/!(*.stories|*.spec).{ts,html}"), ...createGlobPatternsForDependencies(__dirname)],
  corePlugins: {
    container: false,
  },
  plugins: [
    ({ addComponents, theme }) => {
      addComponents({
        ".container": {
          "@apply px-4 mx-auto w-full": {},
          maxWidth: theme("screens.2xl"),
        },
      });
    },
  ],
};
