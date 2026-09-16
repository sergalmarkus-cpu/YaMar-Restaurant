import type { CapacitorConfig } from "@capacitor/cli";

const productionUrl = "https:" + "//yamarfood.com";

const config: CapacitorConfig = {
  appId: "com.yamar.app",
  appName: "YaMar",
  webDir: "public",
  server: {
    url: productionUrl,
    cleartext: false,
  },
};

export default config;