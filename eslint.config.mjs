import {
  defineConfig,
  globalIgnores,
} from "eslint/config";

import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextCoreWebVitals,

  /*
   * React Compiler adoption diagnostics.
   *
   * YaMar contains existing, tested components that use patterns such as
   * data loading and form-state initialization from useEffect.
   *
   * React documents these compiler diagnostics as incrementally adoptable:
   * affected components can simply miss compiler optimizations while the
   * application continues to function normally.
   *
   * Keep the diagnostics visible as warnings so they can be modernized
   * progressively without blocking production deployment.
   */
  {
    rules: {
      "react-hooks/set-state-in-effect":
        "warn",

      "react-hooks/immutability":
        "warn",
    },
  },

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);