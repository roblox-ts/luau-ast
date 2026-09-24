import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["<rootDir>/tests/**/*.test.ts"],
	modulePathIgnorePatterns: ["<rootDir>/out/"],
	moduleNameMapper: {
		"^(LuauAST|LuauRenderer)/(.*)$": "<rootDir>/src/$1/$2",
		"^(LuauAST|LuauRenderer)$": "<rootDir>/src/$1",
	},
	transform: {
		"^.+\\.tsx?$": ["ts-jest", { tsconfig: "tests/tsconfig.json" }],
	},
};

export default config;
