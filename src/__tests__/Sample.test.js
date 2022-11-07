const filterByTerm = (inputArr, searchTerm) => {
  return inputArr.filter(function (arrayElement) {
    return arrayElement.url.match(searchTerm);
  });
};

describe('Filter function', () => {
  test('it should filter by a search term (link)', () => {
    const input = [
      { id: 1, url: 'https://www.url1.dev' },
      { id: 2, url: 'https://www.url2.dev' },
      { id: 3, url: 'https://www.link3.dev' }
    ];

    const output = [{ id: 3, url: 'https://www.link3.dev' }];

    expect(filterByTerm(input, 'link')).toEqual(output);
  });
});

describe('Sample Component sample tests', () => {
  test('async test', (done) => {
    setTimeout(done, 3000);
  });

  test('async test with promise', () => {
    return new Promise((resolve) => setTimeout(resolve, 200));
  });
});

describe('Sample Component', () => {
  // beforeEach(() => {
  //   console.log('Running this before each!');
  // });
  // afterEach(() => {
  //   console.log('Running this after each!');
  // });

  test('async test', (done) => {
    setTimeout(done, 300);
  });

  // Skip this test
  // test.skip('should not do', () => {});

  // Does not test others but only this in this suite
  // test.only('should not regress', () => {});
});
