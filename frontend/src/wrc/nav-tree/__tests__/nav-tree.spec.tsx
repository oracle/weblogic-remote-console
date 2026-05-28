import { render } from '@testing-library/preact';
import { getRootUrlMatch, NavTree, shouldApplyStatusRoot } from '../nav-tree';

describe('NavTree', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        clone: () => ({
          json: () => Promise.resolve({}),
        }),
        text: () => Promise.resolve('{"contents":[]}'),
      })
    );
  });

  test('Your test title', async () => {
    const content = render(
      <div data-oj-binding-provider='preact'>
        <NavTree navtreeUrl="/api/project/navtree" url="" unique="test" />
      </div>
    );
    expect(content.container).toBeDefined();
  });

  test('preserves explicit targets within a root when parsing URLs', () => {
    expect(
      getRootUrlMatch('/api/-current-/group/domainRuntime/Environment/DomainRuntime')
    ).toEqual({
      matched: true,
      root: 'domainRuntime',
      hasExplicitTargetWithinRoot: true,
    });

    expect(
      getRootUrlMatch('/api/adminprovider/domainRuntime/data/DomainRuntime?slice=ChangeManager')
    ).toEqual({
      matched: true,
      root: 'domainRuntime',
      hasExplicitTargetWithinRoot: true,
    });

    expect(
      getRootUrlMatch('/api/-current-/group/domainRuntime')
    ).toEqual({
      matched: true,
      root: 'domainRuntime',
      hasExplicitTargetWithinRoot: false,
    });
  });

  test('does not allow stale provider status to override an active root', () => {
    expect(shouldApplyStatusRoot('edit', undefined, undefined)).toBe(true);
    expect(shouldApplyStatusRoot('edit', 'securityData', undefined)).toBe(false);
    expect(
      shouldApplyStatusRoot('securityData', 'securityData', undefined)
    ).toBe(true);
    expect(
      shouldApplyStatusRoot(
        'edit',
        'edit',
        '/api/-current-/group/domainRuntime/ServerRuntimes'
      )
    ).toBe(false);
    expect(
      shouldApplyStatusRoot(
        'domainRuntime',
        'edit',
        '/api/-current-/group/domainRuntime/ServerRuntimes'
      )
    ).toBe(true);
  });
});
