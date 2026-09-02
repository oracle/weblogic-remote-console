import { render } from '@testing-library/preact';
import {
  getRootUrlMatch,
  handleNavtreeRequest,
  NavTree,
  shouldApplyStatusRoot,
} from '../nav-tree';
import * as Logger from 'ojs/ojlogger';

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

  afterEach(() => {
    jest.restoreAllMocks();
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

  test('applies successful nav tree response text unchanged', async () => {
    const body = '{"contents":[]}';
    const applyResponse = jest.fn();

    await handleNavtreeRequest(
      Promise.resolve({
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue(body),
      } as any),
      '/api/Operator/securityData/navtree',
      applyResponse,
    );

    expect(applyResponse).toHaveBeenCalledWith(body);
  });

  test('ignores and verbosely logs a forbidden nav tree response', async () => {
    const body = JSON.stringify({
      messages: [{ severity: 'error', message: 'Forbidden' }],
      statusData: { providers: {} },
    });
    const applyResponse = jest.fn();
    const logger = jest.spyOn(Logger, 'log').mockImplementation(() => undefined);

    await handleNavtreeRequest(
      Promise.resolve({
        ok: false,
        status: 403,
        text: jest.fn().mockResolvedValue(body),
      } as any),
      '/api/Operator/securityData/navtree',
      applyResponse,
    );

    expect(applyResponse).not.toHaveBeenCalled();
    expect(logger).toHaveBeenCalledTimes(1);
    const logMessageFactory = logger.mock.calls[0][0] as () => string;
    expect(logMessageFactory()).toContain('HTTP 403');
    expect(logMessageFactory()).toContain(body);
  });

  test('consumes and verbosely logs a rejected nav tree request', async () => {
    const applyResponse = jest.fn();
    const logger = jest.spyOn(Logger, 'log').mockImplementation(() => undefined);

    await expect(
      handleNavtreeRequest(
        Promise.reject(new Error('network unavailable')),
        '/api/Operator/securityData/navtree',
        applyResponse,
      ),
    ).resolves.toBeUndefined();

    expect(applyResponse).not.toHaveBeenCalled();
    expect(logger).toHaveBeenCalledTimes(1);
    const logMessageFactory = logger.mock.calls[0][0] as () => string;
    expect(logMessageFactory()).toContain('network unavailable');
  });
});
