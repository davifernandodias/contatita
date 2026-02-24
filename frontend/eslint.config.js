import { defineConfig, globalIgnores } from "eslint/config";
import jsx  from "@eslint/js";
import ts from "typescript-eslint";

export default defineConfig(
    [globalIgnores(["node_modules"]),
        jsx.configs.recommended,
        ts.configs.recommended
    ]
);