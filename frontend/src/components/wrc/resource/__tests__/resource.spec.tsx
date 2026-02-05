import { render } from '@testing-library/preact';
import { Resource } from 'resource/resource';

describe('Test description', () => {
  test('Your test title', async () => {
    const content = render(
      <div data-oj-binding-provider='preact'>
        <Resource />
      </div>
    );
    expect(true).not.toBeUndefined;
  });
});
