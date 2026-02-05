import { render } from '@testing-library/preact';
import { Shared } from 'shared/shared';

describe('Test description', () => {
  test('Your test title', async () => {
    const content = render(
      <div data-oj-binding-provider='preact'>
        <Shared />
      </div>
    );
    expect(true).not.toBeUndefined;
  });
});
