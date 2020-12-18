/* globals describe, it */
import assert from 'assert';

/* eslint-disable global-require */
describe('components', () => {
	it('should not crash when imported', () => {
		assert.doesNotThrow(() => require('../dist/main'));
		assert.doesNotThrow(() => require('../dist/ag-grid'));
		assert.doesNotThrow(() => require('../dist/legacy-text-input'));
		assert.doesNotThrow(() => require('../dist/text-input-v2'));
		assert.doesNotThrow(() => require('../dist/group-selector'));
		assert.doesNotThrow(() => require('../dist/share-dialog'));
	});
});
