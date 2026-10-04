/* theme.ts */
// import { background, extendTheme } from "@chakra-ui/react";

// const theme = extendTheme({
//   styles: {
//     global: {
//         body: {
//             backgroundColor: "gray.100",
//             color: "gray.800"
//         }
//     }
//   }
// });

// export default theme;
import {
  createSystem,
  defaultConfig,
  defineConfig,
} from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    body: {
      backgroundColor: "gray.100",
      color: "gray.800",
      margin: 0,
      padding: 0,
    },
  },
});

export const system = createSystem(defaultConfig, config);

// system.cva({
//   base: {
//     backgroundColor: "gray.100",
//     color: "gray.800",
//   },
// });
