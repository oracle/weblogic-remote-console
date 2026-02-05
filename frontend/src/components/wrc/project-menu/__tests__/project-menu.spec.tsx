import { render } from '@testing-library/preact';
import { ProjectMenu } from 'project-menu/project-menu';

describe('Test description', () => {
  test('Your test title', async () => {
    const content = render(
      <div data-oj-binding-provider='preact'>
        <ProjectMenu />
      </div>
    );
    expect(true).not.toBeUndefined;
  });
});
