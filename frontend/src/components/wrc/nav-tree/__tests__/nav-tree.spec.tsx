import { render } from '@testing-library/preact';
import { NavTree } from 'nav-tree/nav-tree';

describe('Test description', () => {
  test('Your test title', async () => {
    const content = render(
      <div data-oj-binding-provider='preact'>
        <NavTree />
      </div>
    );
    expect(true).not.toBeUndefined;
  });
});
