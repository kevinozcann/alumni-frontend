import React from 'react';

const rrd = jest.genMockFromModule('react-router-dom');

rrd.BrowserRouter = ({ children }) => <div>{children}</div>;

module.exports = rrd;
