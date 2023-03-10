module.exports = {
  roots: ['<rootDir>'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx'],
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/setupTest.js'],
  testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules|.next)[/\\\\]'],
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$',
    '/node_modules/(?!intl-messageformat|@formatjs/icu-messageformat-parser).+\\.js$'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest'
  },
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js'
  }
};
