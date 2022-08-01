import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import {BrowserRouter as Router} from 'react-router-dom';

import Signup from '../index';

const renderer = createRenderer();

describe('<Signup />', () => {
  it('should render and match the snapshot', () => {
    renderer.render(<Router><Signup /></Router>);
    const renderedOutput = renderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});