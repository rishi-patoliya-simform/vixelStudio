/**
 * @format
 */

import React from 'react';
import RootLayout from '../../src/app/_layout';
import { RenderWrapper } from '../Wrapper';

describe('RootLayout', () => {
  it('should match Snapshot', () => {
    const { toJSON } = RenderWrapper(<RootLayout />);

    // Assert: Check the expected behavior
    expect(toJSON()).toMatchSnapshot();
  }, 3000);
});
