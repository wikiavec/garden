const { throws, deepEqual } = require('assert');

const mod = require('./controller.js');

describe('OLSKControllerGlobalMiddleware', function test_OLSKControllerGlobalMiddleware() {

	const _OLSKControllerGlobalMiddleware = function (params) {
		return Object.assign(Object.assign({}, mod), {
			DataResponse: (function () {}),
		}, params).OLSKControllerGlobalMiddleware(Object.assign({
			hostname: Math.random().toString(),
			path: Math.random().toString(),
		}, params), Object.assign({
			locals: {
				OLSK_SPEC_UI: (function () {
					return false;
				}),
			},
			send: (function () {
				return [].concat(...arguments);
			}),
		}, params), params.next || function () {});
	};

	it('calls DataResponse if match', async function () {
		const hostname = uRandomElement(Object.keys(mod.DataDomainMap()));
		const path = Math.random().toString();

		deepEqual(await _OLSKControllerGlobalMiddleware({
			hostname,
			path,
			DataResponse: (function () {
				return Array.from(arguments);
			}),
		}), [mod.DataDomainMap()[hostname], path]);
	});

	it('calls next', async function () {
		const next = Math.random().toString();

		deepEqual(await _OLSKControllerGlobalMiddleware({
			hostname: Math.random().toString(),
			next: (function () {
				return next;
			}),
		}), next);
	});

	it('returns res.send', async function () {
		const DataResponse = Math.random().toString();

		deepEqual(await _OLSKControllerGlobalMiddleware({
			hostname: uRandomElement(Object.keys(mod.DataDomainMap())),
			send: (function () {
				return Array.from(arguments);
			}),
			DataResponse: (function () {
				return Promise.resolve(DataResponse);
			}),
		}), [DataResponse]);
	});

});

describe('DataDomainMap', function test_DataDomainMap() {

	it('returns array', function () {
		deepEqual(mod.DataDomainMap(), JSON.parse(process.env.GRD_REMIT_MAP));
	});

});

describe('DataResponse', function test_DataResponse() {

	const _DataResponse = function (params) {
		return Object.assign(Object.assign({}, mod), {
			_DataContent: (function () {}),
		}, params).DataResponse(params.root || Math.random().toString(), params.path || Math.random().toString(), params.callback || function () {});
	};

	it('calls _DataContent', function () {
		const root = Math.random().toString();
		const path = Math.random().toString();

		deepEqual(_DataResponse({
			root,
			path,
			_DataContent: (function () {
				return Array.from(arguments);
			}),
		}), [root + path]);
	});

	it('replaces /', function () {
		const root = Math.random().toString();

		deepEqual(_DataResponse({
			root,
			path: '/',
			_DataContent: (function () {
				return Array.from(arguments);
			}),
			callback: (function () {
				return Array.from(arguments);
			}),
		}), [root + '/index.html']);
	});

});