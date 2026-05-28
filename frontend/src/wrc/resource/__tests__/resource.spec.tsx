import { render } from '@testing-library/preact';
import { Resource } from '../resource';

describe('Test description', () => {
  test('Your test title', async () => {
    const content = render(
      <div data-oj-binding-provider='preact'>
        <Resource rdj="/api/test" />
      </div>
    );
    expect(true).not.toBeUndefined;
  });
});
