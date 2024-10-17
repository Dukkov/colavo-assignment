import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: './tsconfig.json'
      }
    ]
  },
  roots: ['<rootDir>/build'], // 컴파일된 JS 파일이 위치한 build 폴더
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/build/$1'
  }
};

export default config;
