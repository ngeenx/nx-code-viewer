import { render } from '@testing-library/react';

import NxReactCodeViewer from './nx-react-code-viewer';

describe('NxReactCodeViewer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NxReactCodeViewer />);
    expect(baseElement).toBeTruthy();
  });
});
