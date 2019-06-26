import * as assert from 'assert';
import { getPackageJsonDeps, getPackageLockDeps } from '../src/bundle';
import { PackageJson, PackageLock } from '../src/npm';

describe('bundle', () => {
  describe(getPackageLockDeps.name, () => {
    it('should return an empty list from an empty package-lock', () => {
      assert.deepStrictEqual(
        getPackageLockDeps(({} as unknown) as PackageLock),
        []
      );
    });
    it('should return the prod dependency names', () => {
      const lock = ({
        dependencies: {
          'dep-a': {},
          'dev-dep-a': { dev: true },
          'dep-b': {},
          'dev-dep-b': { dev: true },
        },
      } as unknown) as PackageLock;
      const expected = ['dep-a', 'dep-b'].sort();
      assert.deepStrictEqual(getPackageLockDeps(lock).sort(), expected);
    });
    it('should return all dependency names when passed includeDev=true', () => {
      const lock = ({
        dependencies: {
          'dep-a': {},
          'dev-dep-a': { dev: true },
          'dep-b': {},
          'dev-dep-b': { dev: true },
        },
      } as unknown) as PackageLock;
      const expected = ['dep-a', 'dev-dep-a', 'dep-b', 'dev-dep-b'].sort();
      assert.deepStrictEqual(
        getPackageLockDeps(lock, { includeDev: true }).sort(),
        expected
      );
    });
  });

  describe(getPackageJsonDeps.name, () => {
    it('should return an empty list from an empty package.json', () => {
      assert.deepStrictEqual(
        getPackageJsonDeps(({} as unknown) as PackageJson),
        []
      );
    });
    it('should return the prod dependency names', () => {
      const pkg = ({
        dependencies: {
          'dep-a': '^1.0.0',
          'dep-b': '^1.0.0',
        },
        devDependencies: {
          'dev-dep-a': '^1.0.0',
          'dev-dep-b': '^1.0.0',
        },
      } as unknown) as PackageJson;
      const expected = ['dep-a', 'dep-b'].sort();
      assert.deepStrictEqual(getPackageJsonDeps(pkg).sort(), expected);
    });
    it('should return all dependency names in package.json order when passed includeDev=true', () => {
      const pkg = ({
        dependencies: {
          'dep-a': {},
          'dev-dep-a': { dev: true },
          'dep-b': {},
          'dev-dep-b': { dev: true },
        },
      } as unknown) as PackageJson;
      const expected = ['dev-dep-a', 'dev-dep-b', 'dep-a', 'dep-b'].sort();
      assert.deepStrictEqual(
        getPackageJsonDeps(pkg, { includeDev: true }).sort(),
        expected
      );
    });
  });
});
