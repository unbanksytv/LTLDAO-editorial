const removeImports = require("next-remove-imports")();

module.exports = removeImports({
  reactStrictMode: true,
  images: {
    domains: ["9to5mac.com"],
    env: {
      NEXT_PUBLIC_MORALIS_APPID: "XPYkrSb9Nz1q8AZTNFRpo7CawNETxIz3SuIXrOLT",
      NEXT_PUBLIC_MORALIS_SERVER_URL:
        "https://ievdyapfuvyl.usemoralis.com:2053/server",
    },
  },
});
