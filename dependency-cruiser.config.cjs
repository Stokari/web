const path = require("path");

const noCircular = require(
  path.join(__dirname, "node_modules/dependency-cruiser/configs/rules/no-circular.cjs"),
);

const noOrphans = {
  name: "no-orphans",
  severity: "warn",
  from: {
    orphan: true,
    pathNot: [
      "(^|/)\\.[^/]+\\.(js|cjs|mjs|ts|json)$",
      "\\.d\\.(c|m)?ts$",
      "(^|/)tsconfig\\.json$",
      "(^|/)(?:babel|webpack)\\.config\\.(?:js|cjs|mjs|ts|json)$",
      "src/contract/api.ts",
    ],
  },
  to: {},
};

module.exports = {
  forbidden: [noCircular, noOrphans],
  options: {
    prefix: "src",
    exclude: ["node_modules", "dist", "build", ".git", "coverage"],
    doNotFollow: {
      path: "node_modules",
      dependencyTypes: ["npm", "npm-dev", "npm-optional", "npm-peer", "npm-bundled", "npm-no-pkg"],
    },
  },
};
