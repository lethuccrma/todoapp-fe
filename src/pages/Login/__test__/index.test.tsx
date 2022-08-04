import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import {BrowserRouter as Router} from 'react-router-dom';

import Login from '../index';

const renderer = createRenderer();

describe('<Login />', () => {
  it('should render and match the snapshot', () => {
    renderer.render(<Router><Login /></Router>);
    const renderedOutput = renderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});