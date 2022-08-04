import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { BrowserRouter as Router } from 'react-router-dom';

import TodoCard from '../index';
import { CardStatus } from '../../../types/ICard';

const renderer = createRenderer();

describe('<TodoCard />', () => {
  it('should render and match the snapshot', () => {
    renderer.render(
      <Router>
        <TodoCard
          title="Todo"
          content="Content"
          categories=""
          status={CardStatus.OPEN}
          dueDate={new Date('8/2/1999')}
          onCompleteClick={() => {
            console.log('complete');
          }}
          onDeleteClick={() => {
            console.log('delete');
          }}
          onEditClick={() => {
            console.log('edit');
          }}
        />
      </Router>,
    );
    const renderedOutput = renderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});