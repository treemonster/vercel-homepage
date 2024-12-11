module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "99372db2d4db4018dd49";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_selfInvalidated: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 			invalidate: function() {
/******/ 				this._selfInvalidated = true;
/******/ 				switch (hotStatus) {
/******/ 					case "idle":
/******/ 						hotUpdate = {};
/******/ 						hotUpdate[moduleId] = modules[moduleId];
/******/ 						hotSetStatus("ready");
/******/ 						break;
/******/ 					case "ready":
/******/ 						hotApplyInvalidatedModule(moduleId);
/******/ 						break;
/******/ 					case "prepare":
/******/ 					case "check":
/******/ 					case "dispose":
/******/ 					case "apply":
/******/ 						(hotQueuedInvalidatedModules =
/******/ 							hotQueuedInvalidatedModules || []).push(moduleId);
/******/ 						break;
/******/ 					default:
/******/ 						// ignore requests in error states
/******/ 						break;
/******/ 				}
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash, hotQueuedInvalidatedModules;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus(hotApplyInvalidatedModules() ? "ready" : "idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 		return hotApplyInternal(options);
/******/ 	}
/******/
/******/ 	function hotApplyInternal(options) {
/******/ 		hotApplyInvalidatedModules();
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (
/******/ 					!module ||
/******/ 					(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 				)
/******/ 					continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire &&
/******/ 				// when called invalidate self-accepting is not possible
/******/ 				!installedModules[moduleId].hot._selfInvalidated
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					parents: installedModules[moduleId].parents.slice(),
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		if (hotUpdateNewHash !== undefined) {
/******/ 			hotCurrentHash = hotUpdateNewHash;
/******/ 			hotUpdateNewHash = undefined;
/******/ 		}
/******/ 		hotUpdate = undefined;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = item.parents;
/******/ 			hotCurrentChildModule = moduleId;
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			return hotApplyInternal(options).then(function(list) {
/******/ 				outdatedModules.forEach(function(moduleId) {
/******/ 					if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 				});
/******/ 				return list;
/******/ 			});
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModules() {
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			if (!hotUpdate) hotUpdate = {};
/******/ 			hotQueuedInvalidatedModules.forEach(hotApplyInvalidatedModule);
/******/ 			hotQueuedInvalidatedModules = undefined;
/******/ 			return true;
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModule(moduleId) {
/******/ 		if (!Object.prototype.hasOwnProperty.call(hotUpdate, moduleId))
/******/ 			hotUpdate[moduleId] = modules[moduleId];
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/ansi-html/index.js":
/*!*****************************************!*\
  !*** ./node_modules/ansi-html/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML;

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/;
var _defColors = {
  reset: ['fff', '000'],
  // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
};
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
};
var _openTags = {
  '1': 'font-weight:bold',
  // bold
  '2': 'opacity:0.5',
  // dim
  '3': '<i>',
  // italic
  '4': '<u>',
  // underscore
  '8': 'display:none',
  // hidden
  '9': '<del>' // delete
};
var _closeTags = {
  '23': '</i>',
  // reset italic
  '24': '</u>',
  // reset underscore
  '29': '</del>' // reset delete
};
[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>';
});

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML(text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text;
  }

  // Cache opened sequence.
  var ansiCodes = [];
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq];
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) {
        // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop();
        return '</span>';
      }
      // Open tag.
      ansiCodes.push(seq);
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">';
    }
    var ct = _closeTags[seq];
    if (ct) {
      // Pop sequence
      ansiCodes.pop();
      return ct;
    }
    return '';
  });

  // Make sure tags are closed.
  var l = ansiCodes.length;
  l > 0 && (ret += Array(l + 1).join('</span>'));
  return ret;
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.');
  }
  var _finalColors = {};
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null;
    if (!hex) {
      _finalColors[key] = _defColors[key];
      continue;
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex];
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string';
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000');
      }
      var defHexColor = _defColors[key];
      if (!hex[0]) {
        hex[0] = defHexColor[0];
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]];
        hex.push(defHexColor[1]);
      }
      hex = hex.slice(0, 2);
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000');
    }
    _finalColors[key] = hex;
  }
  _setTags(_finalColors);
};

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors);
};

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {};
if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () {
      return _openTags;
    }
  });
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () {
      return _closeTags;
    }
  });
} else {
  ansiHTML.tags.open = _openTags;
  ansiHTML.tags.close = _closeTags;
}
function _setTags(colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1];
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0];
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey;
  for (var code in _styles) {
    var color = _styles[code];
    var oriColor = colors[color] || '000';
    _openTags[code] = 'color:#' + oriColor;
    code = parseInt(code);
    _openTags[(code + 10).toString()] = 'background:#' + oriColor;
  }
}
ansiHTML.reset();

/***/ }),

/***/ "./node_modules/bootstrap-icons/font/bootstrap-icons.min.css":
/*!*******************************************************************!*\
  !*** ./node_modules/bootstrap-icons/font/bootstrap-icons.min.css ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./node_modules/html-entities/lib/html4-entities.js":
/*!**********************************************************!*\
  !*** ./node_modules/html-entities/lib/html4-entities.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var surrogate_pairs_1 = __webpack_require__(/*! ./surrogate-pairs */ "./node_modules/html-entities/lib/surrogate-pairs.js");
var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'AElig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];
var alphaIndex = {};
var numIndex = {};
(function () {
  var i = 0;
  var length = HTML_ALPHA.length;
  while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
  }
})();
var Html4Entities = /** @class */function () {
  function Html4Entities() {}
  Html4Entities.prototype.decode = function (str) {
    if (!str || !str.length) {
      return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function (s, entity) {
      var chr;
      if (entity.charAt(0) === "#") {
        var code = entity.charAt(1).toLowerCase() === 'x' ? parseInt(entity.substr(2), 16) : parseInt(entity.substr(1));
        if (!isNaN(code) || code >= -32768) {
          if (code <= 65535) {
            chr = String.fromCharCode(code);
          } else {
            chr = surrogate_pairs_1.fromCodePoint(code);
          }
        }
      } else {
        chr = alphaIndex[entity];
      }
      return chr || s;
    });
  };
  Html4Entities.decode = function (str) {
    return new Html4Entities().decode(str);
  };
  Html4Entities.prototype.encode = function (str) {
    if (!str || !str.length) {
      return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
      var alpha = numIndex[str.charCodeAt(i)];
      result += alpha ? "&" + alpha + ";" : str.charAt(i);
      i++;
    }
    return result;
  };
  Html4Entities.encode = function (str) {
    return new Html4Entities().encode(str);
  };
  Html4Entities.prototype.encodeNonUTF = function (str) {
    if (!str || !str.length) {
      return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
      var cc = str.charCodeAt(i);
      var alpha = numIndex[cc];
      if (alpha) {
        result += "&" + alpha + ";";
      } else if (cc < 32 || cc > 126) {
        if (cc >= surrogate_pairs_1.highSurrogateFrom && cc <= surrogate_pairs_1.highSurrogateTo) {
          result += '&#' + surrogate_pairs_1.getCodePoint(str, i) + ';';
          i++;
        } else {
          result += '&#' + cc + ';';
        }
      } else {
        result += str.charAt(i);
      }
      i++;
    }
    return result;
  };
  Html4Entities.encodeNonUTF = function (str) {
    return new Html4Entities().encodeNonUTF(str);
  };
  Html4Entities.prototype.encodeNonASCII = function (str) {
    if (!str || !str.length) {
      return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
      var c = str.charCodeAt(i);
      if (c <= 255) {
        result += str[i++];
        continue;
      }
      if (c >= surrogate_pairs_1.highSurrogateFrom && c <= surrogate_pairs_1.highSurrogateTo) {
        result += '&#' + surrogate_pairs_1.getCodePoint(str, i) + ';';
        i++;
      } else {
        result += '&#' + c + ';';
      }
      i++;
    }
    return result;
  };
  Html4Entities.encodeNonASCII = function (str) {
    return new Html4Entities().encodeNonASCII(str);
  };
  return Html4Entities;
}();
exports.Html4Entities = Html4Entities;

/***/ }),

/***/ "./node_modules/html-entities/lib/html5-entities.js":
/*!**********************************************************!*\
  !*** ./node_modules/html-entities/lib/html5-entities.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var surrogate_pairs_1 = __webpack_require__(/*! ./surrogate-pairs */ "./node_modules/html-entities/lib/surrogate-pairs.js");
var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];
var DECODE_ONLY_ENTITIES = [['NewLine', [10]]];
var alphaIndex = {};
var charIndex = {};
createIndexes(alphaIndex, charIndex);
var Html5Entities = /** @class */function () {
  function Html5Entities() {}
  Html5Entities.prototype.decode = function (str) {
    if (!str || !str.length) {
      return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function (s, entity) {
      var chr;
      if (entity.charAt(0) === "#") {
        var code = entity.charAt(1) === 'x' ? parseInt(entity.substr(2).toLowerCase(), 16) : parseInt(entity.substr(1));
        if (!isNaN(code) || code >= -32768) {
          if (code <= 65535) {
            chr = String.fromCharCode(code);
          } else {
            chr = surrogate_pairs_1.fromCodePoint(code);
          }
        }
      } else {
        chr = alphaIndex[entity];
      }
      return chr || s;
    });
  };
  Html5Entities.decode = function (str) {
    return new Html5Entities().decode(str);
  };
  Html5Entities.prototype.encode = function (str) {
    if (!str || !str.length) {
      return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
      var charInfo = charIndex[str.charCodeAt(i)];
      if (charInfo) {
        var alpha = charInfo[str.charCodeAt(i + 1)];
        if (alpha) {
          i++;
        } else {
          alpha = charInfo[''];
        }
        if (alpha) {
          result += "&" + alpha + ";";
          i++;
          continue;
        }
      }
      result += str.charAt(i);
      i++;
    }
    return result;
  };
  Html5Entities.encode = function (str) {
    return new Html5Entities().encode(str);
  };
  Html5Entities.prototype.encodeNonUTF = function (str) {
    if (!str || !str.length) {
      return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
      var c = str.charCodeAt(i);
      var charInfo = charIndex[c];
      if (charInfo) {
        var alpha = charInfo[str.charCodeAt(i + 1)];
        if (alpha) {
          i++;
        } else {
          alpha = charInfo[''];
        }
        if (alpha) {
          result += "&" + alpha + ";";
          i++;
          continue;
        }
      }
      if (c < 32 || c > 126) {
        if (c >= surrogate_pairs_1.highSurrogateFrom && c <= surrogate_pairs_1.highSurrogateTo) {
          result += '&#' + surrogate_pairs_1.getCodePoint(str, i) + ';';
          i++;
        } else {
          result += '&#' + c + ';';
        }
      } else {
        result += str.charAt(i);
      }
      i++;
    }
    return result;
  };
  Html5Entities.encodeNonUTF = function (str) {
    return new Html5Entities().encodeNonUTF(str);
  };
  Html5Entities.prototype.encodeNonASCII = function (str) {
    if (!str || !str.length) {
      return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
      var c = str.charCodeAt(i);
      if (c <= 255) {
        result += str[i++];
        continue;
      }
      if (c >= surrogate_pairs_1.highSurrogateFrom && c <= surrogate_pairs_1.highSurrogateTo) {
        result += '&#' + surrogate_pairs_1.getCodePoint(str, i) + ';';
        i += 2;
      } else {
        result += '&#' + c + ';';
        i++;
      }
    }
    return result;
  };
  Html5Entities.encodeNonASCII = function (str) {
    return new Html5Entities().encodeNonASCII(str);
  };
  return Html5Entities;
}();
exports.Html5Entities = Html5Entities;
function createIndexes(alphaIndex, charIndex) {
  var i = ENTITIES.length;
  while (i--) {
    var _a = ENTITIES[i],
      alpha = _a[0],
      _b = _a[1],
      chr = _b[0],
      chr2 = _b[1];
    var addChar = chr < 32 || chr > 126 || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
    var charInfo = void 0;
    if (addChar) {
      charInfo = charIndex[chr] = charIndex[chr] || {};
    }
    if (chr2) {
      alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
      addChar && (charInfo[chr2] = alpha);
    } else {
      alphaIndex[alpha] = String.fromCharCode(chr);
      addChar && (charInfo[''] = alpha);
    }
  }
  i = DECODE_ONLY_ENTITIES.length;
  while (i--) {
    var _c = DECODE_ONLY_ENTITIES[i],
      alpha = _c[0],
      _d = _c[1],
      chr = _d[0],
      chr2 = _d[1];
    alphaIndex[alpha] = String.fromCharCode(chr) + (chr2 ? String.fromCharCode(chr2) : '');
  }
}

/***/ }),

/***/ "./node_modules/html-entities/lib/index.js":
/*!*************************************************!*\
  !*** ./node_modules/html-entities/lib/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var xml_entities_1 = __webpack_require__(/*! ./xml-entities */ "./node_modules/html-entities/lib/xml-entities.js");
exports.XmlEntities = xml_entities_1.XmlEntities;
var html4_entities_1 = __webpack_require__(/*! ./html4-entities */ "./node_modules/html-entities/lib/html4-entities.js");
exports.Html4Entities = html4_entities_1.Html4Entities;
var html5_entities_1 = __webpack_require__(/*! ./html5-entities */ "./node_modules/html-entities/lib/html5-entities.js");
exports.Html5Entities = html5_entities_1.Html5Entities;
exports.AllHtmlEntities = html5_entities_1.Html5Entities;

/***/ }),

/***/ "./node_modules/html-entities/lib/surrogate-pairs.js":
/*!***********************************************************!*\
  !*** ./node_modules/html-entities/lib/surrogate-pairs.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromCodePoint = String.fromCodePoint || function (astralCodePoint) {
  return String.fromCharCode(Math.floor((astralCodePoint - 0x10000) / 0x400) + 0xD800, (astralCodePoint - 0x10000) % 0x400 + 0xDC00);
};
exports.getCodePoint = String.prototype.codePointAt ? function (input, position) {
  return input.codePointAt(position);
} : function (input, position) {
  return (input.charCodeAt(position) - 0xD800) * 0x400 + input.charCodeAt(position + 1) - 0xDC00 + 0x10000;
};
exports.highSurrogateFrom = 0xD800;
exports.highSurrogateTo = 0xDBFF;

/***/ }),

/***/ "./node_modules/html-entities/lib/xml-entities.js":
/*!********************************************************!*\
  !*** ./node_modules/html-entities/lib/xml-entities.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var surrogate_pairs_1 = __webpack_require__(/*! ./surrogate-pairs */ "./node_modules/html-entities/lib/surrogate-pairs.js");
var ALPHA_INDEX = {
  '&lt': '<',
  '&gt': '>',
  '&quot': '"',
  '&apos': '\'',
  '&amp': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': '\'',
  '&amp;': '&'
};
var CHAR_INDEX = {
  60: 'lt',
  62: 'gt',
  34: 'quot',
  39: 'apos',
  38: 'amp'
};
var CHAR_S_INDEX = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&apos;',
  '&': '&amp;'
};
var XmlEntities = /** @class */function () {
  function XmlEntities() {}
  XmlEntities.prototype.encode = function (str) {
    if (!str || !str.length) {
      return '';
    }
    return str.replace(/[<>"'&]/g, function (s) {
      return CHAR_S_INDEX[s];
    });
  };
  XmlEntities.encode = function (str) {
    return new XmlEntities().encode(str);
  };
  XmlEntities.prototype.decode = function (str) {
    if (!str || !str.length) {
      return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function (s) {
      if (s.charAt(1) === '#') {
        var code = s.charAt(2).toLowerCase() === 'x' ? parseInt(s.substr(3), 16) : parseInt(s.substr(2));
        if (!isNaN(code) || code >= -32768) {
          if (code <= 65535) {
            return String.fromCharCode(code);
          } else {
            return surrogate_pairs_1.fromCodePoint(code);
          }
        }
        return '';
      }
      return ALPHA_INDEX[s] || s;
    });
  };
  XmlEntities.decode = function (str) {
    return new XmlEntities().decode(str);
  };
  XmlEntities.prototype.encodeNonUTF = function (str) {
    if (!str || !str.length) {
      return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
      var c = str.charCodeAt(i);
      var alpha = CHAR_INDEX[c];
      if (alpha) {
        result += "&" + alpha + ";";
        i++;
        continue;
      }
      if (c < 32 || c > 126) {
        if (c >= surrogate_pairs_1.highSurrogateFrom && c <= surrogate_pairs_1.highSurrogateTo) {
          result += '&#' + surrogate_pairs_1.getCodePoint(str, i) + ';';
          i++;
        } else {
          result += '&#' + c + ';';
        }
      } else {
        result += str.charAt(i);
      }
      i++;
    }
    return result;
  };
  XmlEntities.encodeNonUTF = function (str) {
    return new XmlEntities().encodeNonUTF(str);
  };
  XmlEntities.prototype.encodeNonASCII = function (str) {
    if (!str || !str.length) {
      return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
      var c = str.charCodeAt(i);
      if (c <= 255) {
        result += str[i++];
        continue;
      }
      if (c >= surrogate_pairs_1.highSurrogateFrom && c <= surrogate_pairs_1.highSurrogateTo) {
        result += '&#' + surrogate_pairs_1.getCodePoint(str, i) + ';';
        i++;
      } else {
        result += '&#' + c + ';';
      }
      i++;
    }
    return result;
  };
  XmlEntities.encodeNonASCII = function (str) {
    return new XmlEntities().encodeNonASCII(str);
  };
  return XmlEntities;
}();
exports.XmlEntities = XmlEntities;

/***/ }),

/***/ "./node_modules/intersection-observer/intersection-observer.js":
/*!*********************************************************************!*\
  !*** ./node_modules/intersection-observer/intersection-observer.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE.
 *
 *  https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 */
(function () {
  'use strict';

  // Exit early if we're not running in a browser.
  if (typeof window !== 'object') {
    return;
  }

  // Exit early if all IntersectionObserver and IntersectionObserverEntry
  // features are natively supported.
  if ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
    // Minimal polyfill for Edge 15's lack of `isIntersecting`
    // See: https://github.com/w3c/IntersectionObserver/issues/211
    if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
      Object.defineProperty(window.IntersectionObserverEntry.prototype, 'isIntersecting', {
        get: function () {
          return this.intersectionRatio > 0;
        }
      });
    }
    return;
  }

  /**
   * Returns the embedding frame element, if any.
   * @param {!Document} doc
   * @return {!Element}
   */
  function getFrameElement(doc) {
    try {
      return doc.defaultView && doc.defaultView.frameElement || null;
    } catch (e) {
      // Ignore the error.
      return null;
    }
  }

  /**
   * A local reference to the root document.
   */
  var document = function (startDoc) {
    var doc = startDoc;
    var frame = getFrameElement(doc);
    while (frame) {
      doc = frame.ownerDocument;
      frame = getFrameElement(doc);
    }
    return doc;
  }(window.document);

  /**
   * An IntersectionObserver registry. This registry exists to hold a strong
   * reference to IntersectionObserver instances currently observing a target
   * element. Without this registry, instances without another reference may be
   * garbage collected.
   */
  var registry = [];

  /**
   * The signal updater for cross-origin intersection. When not null, it means
   * that the polyfill is configured to work in a cross-origin mode.
   * @type {function(DOMRect|ClientRect, DOMRect|ClientRect)}
   */
  var crossOriginUpdater = null;

  /**
   * The current cross-origin intersection. Only used in the cross-origin mode.
   * @type {DOMRect|ClientRect}
   */
  var crossOriginRect = null;

  /**
   * Creates the global IntersectionObserverEntry constructor.
   * https://w3c.github.io/IntersectionObserver/#intersection-observer-entry
   * @param {Object} entry A dictionary of instance properties.
   * @constructor
   */
  function IntersectionObserverEntry(entry) {
    this.time = entry.time;
    this.target = entry.target;
    this.rootBounds = ensureDOMRect(entry.rootBounds);
    this.boundingClientRect = ensureDOMRect(entry.boundingClientRect);
    this.intersectionRect = ensureDOMRect(entry.intersectionRect || getEmptyRect());
    this.isIntersecting = !!entry.intersectionRect;

    // Calculates the intersection ratio.
    var targetRect = this.boundingClientRect;
    var targetArea = targetRect.width * targetRect.height;
    var intersectionRect = this.intersectionRect;
    var intersectionArea = intersectionRect.width * intersectionRect.height;

    // Sets intersection ratio.
    if (targetArea) {
      // Round the intersection ratio to avoid floating point math issues:
      // https://github.com/w3c/IntersectionObserver/issues/324
      this.intersectionRatio = Number((intersectionArea / targetArea).toFixed(4));
    } else {
      // If area is zero and is intersecting, sets to 1, otherwise to 0
      this.intersectionRatio = this.isIntersecting ? 1 : 0;
    }
  }

  /**
   * Creates the global IntersectionObserver constructor.
   * https://w3c.github.io/IntersectionObserver/#intersection-observer-interface
   * @param {Function} callback The function to be invoked after intersection
   *     changes have queued. The function is not invoked if the queue has
   *     been emptied by calling the `takeRecords` method.
   * @param {Object=} opt_options Optional configuration options.
   * @constructor
   */
  function IntersectionObserver(callback, opt_options) {
    var options = opt_options || {};
    if (typeof callback != 'function') {
      throw new Error('callback must be a function');
    }
    if (options.root && options.root.nodeType != 1 && options.root.nodeType != 9) {
      throw new Error('root must be a Document or Element');
    }

    // Binds and throttles `this._checkForIntersections`.
    this._checkForIntersections = throttle(this._checkForIntersections.bind(this), this.THROTTLE_TIMEOUT);

    // Private properties.
    this._callback = callback;
    this._observationTargets = [];
    this._queuedEntries = [];
    this._rootMarginValues = this._parseRootMargin(options.rootMargin);

    // Public properties.
    this.thresholds = this._initThresholds(options.threshold);
    this.root = options.root || null;
    this.rootMargin = this._rootMarginValues.map(function (margin) {
      return margin.value + margin.unit;
    }).join(' ');

    /** @private @const {!Array<!Document>} */
    this._monitoringDocuments = [];
    /** @private @const {!Array<function()>} */
    this._monitoringUnsubscribes = [];
  }

  /**
   * The minimum interval within which the document will be checked for
   * intersection changes.
   */
  IntersectionObserver.prototype.THROTTLE_TIMEOUT = 100;

  /**
   * The frequency in which the polyfill polls for intersection changes.
   * this can be updated on a per instance basis and must be set prior to
   * calling `observe` on the first target.
   */
  IntersectionObserver.prototype.POLL_INTERVAL = null;

  /**
   * Use a mutation observer on the root element
   * to detect intersection changes.
   */
  IntersectionObserver.prototype.USE_MUTATION_OBSERVER = true;

  /**
   * Sets up the polyfill in the cross-origin mode. The result is the
   * updater function that accepts two arguments: `boundingClientRect` and
   * `intersectionRect` - just as these fields would be available to the
   * parent via `IntersectionObserverEntry`. This function should be called
   * each time the iframe receives intersection information from the parent
   * window, e.g. via messaging.
   * @return {function(DOMRect|ClientRect, DOMRect|ClientRect)}
   */
  IntersectionObserver._setupCrossOriginUpdater = function () {
    if (!crossOriginUpdater) {
      /**
       * @param {DOMRect|ClientRect} boundingClientRect
       * @param {DOMRect|ClientRect} intersectionRect
       */
      crossOriginUpdater = function (boundingClientRect, intersectionRect) {
        if (!boundingClientRect || !intersectionRect) {
          crossOriginRect = getEmptyRect();
        } else {
          crossOriginRect = convertFromParentRect(boundingClientRect, intersectionRect);
        }
        registry.forEach(function (observer) {
          observer._checkForIntersections();
        });
      };
    }
    return crossOriginUpdater;
  };

  /**
   * Resets the cross-origin mode.
   */
  IntersectionObserver._resetCrossOriginUpdater = function () {
    crossOriginUpdater = null;
    crossOriginRect = null;
  };

  /**
   * Starts observing a target element for intersection changes based on
   * the thresholds values.
   * @param {Element} target The DOM element to observe.
   */
  IntersectionObserver.prototype.observe = function (target) {
    var isTargetAlreadyObserved = this._observationTargets.some(function (item) {
      return item.element == target;
    });
    if (isTargetAlreadyObserved) {
      return;
    }
    if (!(target && target.nodeType == 1)) {
      throw new Error('target must be an Element');
    }
    this._registerInstance();
    this._observationTargets.push({
      element: target,
      entry: null
    });
    this._monitorIntersections(target.ownerDocument);
    this._checkForIntersections();
  };

  /**
   * Stops observing a target element for intersection changes.
   * @param {Element} target The DOM element to observe.
   */
  IntersectionObserver.prototype.unobserve = function (target) {
    this._observationTargets = this._observationTargets.filter(function (item) {
      return item.element != target;
    });
    this._unmonitorIntersections(target.ownerDocument);
    if (this._observationTargets.length == 0) {
      this._unregisterInstance();
    }
  };

  /**
   * Stops observing all target elements for intersection changes.
   */
  IntersectionObserver.prototype.disconnect = function () {
    this._observationTargets = [];
    this._unmonitorAllIntersections();
    this._unregisterInstance();
  };

  /**
   * Returns any queue entries that have not yet been reported to the
   * callback and clears the queue. This can be used in conjunction with the
   * callback to obtain the absolute most up-to-date intersection information.
   * @return {Array} The currently queued entries.
   */
  IntersectionObserver.prototype.takeRecords = function () {
    var records = this._queuedEntries.slice();
    this._queuedEntries = [];
    return records;
  };

  /**
   * Accepts the threshold value from the user configuration object and
   * returns a sorted array of unique threshold values. If a value is not
   * between 0 and 1 and error is thrown.
   * @private
   * @param {Array|number=} opt_threshold An optional threshold value or
   *     a list of threshold values, defaulting to [0].
   * @return {Array} A sorted list of unique and valid threshold values.
   */
  IntersectionObserver.prototype._initThresholds = function (opt_threshold) {
    var threshold = opt_threshold || [0];
    if (!Array.isArray(threshold)) threshold = [threshold];
    return threshold.sort().filter(function (t, i, a) {
      if (typeof t != 'number' || isNaN(t) || t < 0 || t > 1) {
        throw new Error('threshold must be a number between 0 and 1 inclusively');
      }
      return t !== a[i - 1];
    });
  };

  /**
   * Accepts the rootMargin value from the user configuration object
   * and returns an array of the four margin values as an object containing
   * the value and unit properties. If any of the values are not properly
   * formatted or use a unit other than px or %, and error is thrown.
   * @private
   * @param {string=} opt_rootMargin An optional rootMargin value,
   *     defaulting to '0px'.
   * @return {Array<Object>} An array of margin objects with the keys
   *     value and unit.
   */
  IntersectionObserver.prototype._parseRootMargin = function (opt_rootMargin) {
    var marginString = opt_rootMargin || '0px';
    var margins = marginString.split(/\s+/).map(function (margin) {
      var parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin);
      if (!parts) {
        throw new Error('rootMargin must be specified in pixels or percent');
      }
      return {
        value: parseFloat(parts[1]),
        unit: parts[2]
      };
    });

    // Handles shorthand.
    margins[1] = margins[1] || margins[0];
    margins[2] = margins[2] || margins[0];
    margins[3] = margins[3] || margins[1];
    return margins;
  };

  /**
   * Starts polling for intersection changes if the polling is not already
   * happening, and if the page's visibility state is visible.
   * @param {!Document} doc
   * @private
   */
  IntersectionObserver.prototype._monitorIntersections = function (doc) {
    var win = doc.defaultView;
    if (!win) {
      // Already destroyed.
      return;
    }
    if (this._monitoringDocuments.indexOf(doc) != -1) {
      // Already monitoring.
      return;
    }

    // Private state for monitoring.
    var callback = this._checkForIntersections;
    var monitoringInterval = null;
    var domObserver = null;

    // If a poll interval is set, use polling instead of listening to
    // resize and scroll events or DOM mutations.
    if (this.POLL_INTERVAL) {
      monitoringInterval = win.setInterval(callback, this.POLL_INTERVAL);
    } else {
      addEvent(win, 'resize', callback, true);
      addEvent(doc, 'scroll', callback, true);
      if (this.USE_MUTATION_OBSERVER && 'MutationObserver' in win) {
        domObserver = new win.MutationObserver(callback);
        domObserver.observe(doc, {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true
        });
      }
    }
    this._monitoringDocuments.push(doc);
    this._monitoringUnsubscribes.push(function () {
      // Get the window object again. When a friendly iframe is destroyed, it
      // will be null.
      var win = doc.defaultView;
      if (win) {
        if (monitoringInterval) {
          win.clearInterval(monitoringInterval);
        }
        removeEvent(win, 'resize', callback, true);
      }
      removeEvent(doc, 'scroll', callback, true);
      if (domObserver) {
        domObserver.disconnect();
      }
    });

    // Also monitor the parent.
    var rootDoc = this.root && (this.root.ownerDocument || this.root) || document;
    if (doc != rootDoc) {
      var frame = getFrameElement(doc);
      if (frame) {
        this._monitorIntersections(frame.ownerDocument);
      }
    }
  };

  /**
   * Stops polling for intersection changes.
   * @param {!Document} doc
   * @private
   */
  IntersectionObserver.prototype._unmonitorIntersections = function (doc) {
    var index = this._monitoringDocuments.indexOf(doc);
    if (index == -1) {
      return;
    }
    var rootDoc = this.root && (this.root.ownerDocument || this.root) || document;

    // Check if any dependent targets are still remaining.
    var hasDependentTargets = this._observationTargets.some(function (item) {
      var itemDoc = item.element.ownerDocument;
      // Target is in this context.
      if (itemDoc == doc) {
        return true;
      }
      // Target is nested in this context.
      while (itemDoc && itemDoc != rootDoc) {
        var frame = getFrameElement(itemDoc);
        itemDoc = frame && frame.ownerDocument;
        if (itemDoc == doc) {
          return true;
        }
      }
      return false;
    });
    if (hasDependentTargets) {
      return;
    }

    // Unsubscribe.
    var unsubscribe = this._monitoringUnsubscribes[index];
    this._monitoringDocuments.splice(index, 1);
    this._monitoringUnsubscribes.splice(index, 1);
    unsubscribe();

    // Also unmonitor the parent.
    if (doc != rootDoc) {
      var frame = getFrameElement(doc);
      if (frame) {
        this._unmonitorIntersections(frame.ownerDocument);
      }
    }
  };

  /**
   * Stops polling for intersection changes.
   * @param {!Document} doc
   * @private
   */
  IntersectionObserver.prototype._unmonitorAllIntersections = function () {
    var unsubscribes = this._monitoringUnsubscribes.slice(0);
    this._monitoringDocuments.length = 0;
    this._monitoringUnsubscribes.length = 0;
    for (var i = 0; i < unsubscribes.length; i++) {
      unsubscribes[i]();
    }
  };

  /**
   * Scans each observation target for intersection changes and adds them
   * to the internal entries queue. If new entries are found, it
   * schedules the callback to be invoked.
   * @private
   */
  IntersectionObserver.prototype._checkForIntersections = function () {
    if (!this.root && crossOriginUpdater && !crossOriginRect) {
      // Cross origin monitoring, but no initial data available yet.
      return;
    }
    var rootIsInDom = this._rootIsInDom();
    var rootRect = rootIsInDom ? this._getRootRect() : getEmptyRect();
    this._observationTargets.forEach(function (item) {
      var target = item.element;
      var targetRect = getBoundingClientRect(target);
      var rootContainsTarget = this._rootContainsTarget(target);
      var oldEntry = item.entry;
      var intersectionRect = rootIsInDom && rootContainsTarget && this._computeTargetAndRootIntersection(target, targetRect, rootRect);
      var rootBounds = null;
      if (!this._rootContainsTarget(target)) {
        rootBounds = getEmptyRect();
      } else if (!crossOriginUpdater || this.root) {
        rootBounds = rootRect;
      }
      var newEntry = item.entry = new IntersectionObserverEntry({
        time: now(),
        target: target,
        boundingClientRect: targetRect,
        rootBounds: rootBounds,
        intersectionRect: intersectionRect
      });
      if (!oldEntry) {
        this._queuedEntries.push(newEntry);
      } else if (rootIsInDom && rootContainsTarget) {
        // If the new entry intersection ratio has crossed any of the
        // thresholds, add a new entry.
        if (this._hasCrossedThreshold(oldEntry, newEntry)) {
          this._queuedEntries.push(newEntry);
        }
      } else {
        // If the root is not in the DOM or target is not contained within
        // root but the previous entry for this target had an intersection,
        // add a new record indicating removal.
        if (oldEntry && oldEntry.isIntersecting) {
          this._queuedEntries.push(newEntry);
        }
      }
    }, this);
    if (this._queuedEntries.length) {
      this._callback(this.takeRecords(), this);
    }
  };

  /**
   * Accepts a target and root rect computes the intersection between then
   * following the algorithm in the spec.
   * TODO(philipwalton): at this time clip-path is not considered.
   * https://w3c.github.io/IntersectionObserver/#calculate-intersection-rect-algo
   * @param {Element} target The target DOM element
   * @param {Object} targetRect The bounding rect of the target.
   * @param {Object} rootRect The bounding rect of the root after being
   *     expanded by the rootMargin value.
   * @return {?Object} The final intersection rect object or undefined if no
   *     intersection is found.
   * @private
   */
  IntersectionObserver.prototype._computeTargetAndRootIntersection = function (target, targetRect, rootRect) {
    // If the element isn't displayed, an intersection can't happen.
    if (window.getComputedStyle(target).display == 'none') return;
    var intersectionRect = targetRect;
    var parent = getParentNode(target);
    var atRoot = false;
    while (!atRoot && parent) {
      var parentRect = null;
      var parentComputedStyle = parent.nodeType == 1 ? window.getComputedStyle(parent) : {};

      // If the parent isn't displayed, an intersection can't happen.
      if (parentComputedStyle.display == 'none') return null;
      if (parent == this.root || parent.nodeType == /* DOCUMENT */9) {
        atRoot = true;
        if (parent == this.root || parent == document) {
          if (crossOriginUpdater && !this.root) {
            if (!crossOriginRect || crossOriginRect.width == 0 && crossOriginRect.height == 0) {
              // A 0-size cross-origin intersection means no-intersection.
              parent = null;
              parentRect = null;
              intersectionRect = null;
            } else {
              parentRect = crossOriginRect;
            }
          } else {
            parentRect = rootRect;
          }
        } else {
          // Check if there's a frame that can be navigated to.
          var frame = getParentNode(parent);
          var frameRect = frame && getBoundingClientRect(frame);
          var frameIntersect = frame && this._computeTargetAndRootIntersection(frame, frameRect, rootRect);
          if (frameRect && frameIntersect) {
            parent = frame;
            parentRect = convertFromParentRect(frameRect, frameIntersect);
          } else {
            parent = null;
            intersectionRect = null;
          }
        }
      } else {
        // If the element has a non-visible overflow, and it's not the <body>
        // or <html> element, update the intersection rect.
        // Note: <body> and <html> cannot be clipped to a rect that's not also
        // the document rect, so no need to compute a new intersection.
        var doc = parent.ownerDocument;
        if (parent != doc.body && parent != doc.documentElement && parentComputedStyle.overflow != 'visible') {
          parentRect = getBoundingClientRect(parent);
        }
      }

      // If either of the above conditionals set a new parentRect,
      // calculate new intersection data.
      if (parentRect) {
        intersectionRect = computeRectIntersection(parentRect, intersectionRect);
      }
      if (!intersectionRect) break;
      parent = parent && getParentNode(parent);
    }
    return intersectionRect;
  };

  /**
   * Returns the root rect after being expanded by the rootMargin value.
   * @return {ClientRect} The expanded root rect.
   * @private
   */
  IntersectionObserver.prototype._getRootRect = function () {
    var rootRect;
    if (this.root && !isDoc(this.root)) {
      rootRect = getBoundingClientRect(this.root);
    } else {
      // Use <html>/<body> instead of window since scroll bars affect size.
      var doc = isDoc(this.root) ? this.root : document;
      var html = doc.documentElement;
      var body = doc.body;
      rootRect = {
        top: 0,
        left: 0,
        right: html.clientWidth || body.clientWidth,
        width: html.clientWidth || body.clientWidth,
        bottom: html.clientHeight || body.clientHeight,
        height: html.clientHeight || body.clientHeight
      };
    }
    return this._expandRectByRootMargin(rootRect);
  };

  /**
   * Accepts a rect and expands it by the rootMargin value.
   * @param {DOMRect|ClientRect} rect The rect object to expand.
   * @return {ClientRect} The expanded rect.
   * @private
   */
  IntersectionObserver.prototype._expandRectByRootMargin = function (rect) {
    var margins = this._rootMarginValues.map(function (margin, i) {
      return margin.unit == 'px' ? margin.value : margin.value * (i % 2 ? rect.width : rect.height) / 100;
    });
    var newRect = {
      top: rect.top - margins[0],
      right: rect.right + margins[1],
      bottom: rect.bottom + margins[2],
      left: rect.left - margins[3]
    };
    newRect.width = newRect.right - newRect.left;
    newRect.height = newRect.bottom - newRect.top;
    return newRect;
  };

  /**
   * Accepts an old and new entry and returns true if at least one of the
   * threshold values has been crossed.
   * @param {?IntersectionObserverEntry} oldEntry The previous entry for a
   *    particular target element or null if no previous entry exists.
   * @param {IntersectionObserverEntry} newEntry The current entry for a
   *    particular target element.
   * @return {boolean} Returns true if a any threshold has been crossed.
   * @private
   */
  IntersectionObserver.prototype._hasCrossedThreshold = function (oldEntry, newEntry) {
    // To make comparing easier, an entry that has a ratio of 0
    // but does not actually intersect is given a value of -1
    var oldRatio = oldEntry && oldEntry.isIntersecting ? oldEntry.intersectionRatio || 0 : -1;
    var newRatio = newEntry.isIntersecting ? newEntry.intersectionRatio || 0 : -1;

    // Ignore unchanged ratios
    if (oldRatio === newRatio) return;
    for (var i = 0; i < this.thresholds.length; i++) {
      var threshold = this.thresholds[i];

      // Return true if an entry matches a threshold or if the new ratio
      // and the old ratio are on the opposite sides of a threshold.
      if (threshold == oldRatio || threshold == newRatio || threshold < oldRatio !== threshold < newRatio) {
        return true;
      }
    }
  };

  /**
   * Returns whether or not the root element is an element and is in the DOM.
   * @return {boolean} True if the root element is an element and is in the DOM.
   * @private
   */
  IntersectionObserver.prototype._rootIsInDom = function () {
    return !this.root || containsDeep(document, this.root);
  };

  /**
   * Returns whether or not the target element is a child of root.
   * @param {Element} target The target element to check.
   * @return {boolean} True if the target element is a child of root.
   * @private
   */
  IntersectionObserver.prototype._rootContainsTarget = function (target) {
    var rootDoc = this.root && (this.root.ownerDocument || this.root) || document;
    return containsDeep(rootDoc, target) && (!this.root || rootDoc == target.ownerDocument);
  };

  /**
   * Adds the instance to the global IntersectionObserver registry if it isn't
   * already present.
   * @private
   */
  IntersectionObserver.prototype._registerInstance = function () {
    if (registry.indexOf(this) < 0) {
      registry.push(this);
    }
  };

  /**
   * Removes the instance from the global IntersectionObserver registry.
   * @private
   */
  IntersectionObserver.prototype._unregisterInstance = function () {
    var index = registry.indexOf(this);
    if (index != -1) registry.splice(index, 1);
  };

  /**
   * Returns the result of the performance.now() method or null in browsers
   * that don't support the API.
   * @return {number} The elapsed time since the page was requested.
   */
  function now() {
    return window.performance && performance.now && performance.now();
  }

  /**
   * Throttles a function and delays its execution, so it's only called at most
   * once within a given time period.
   * @param {Function} fn The function to throttle.
   * @param {number} timeout The amount of time that must pass before the
   *     function can be called again.
   * @return {Function} The throttled function.
   */
  function throttle(fn, timeout) {
    var timer = null;
    return function () {
      if (!timer) {
        timer = setTimeout(function () {
          fn();
          timer = null;
        }, timeout);
      }
    };
  }

  /**
   * Adds an event handler to a DOM node ensuring cross-browser compatibility.
   * @param {Node} node The DOM node to add the event handler to.
   * @param {string} event The event name.
   * @param {Function} fn The event handler to add.
   * @param {boolean} opt_useCapture Optionally adds the even to the capture
   *     phase. Note: this only works in modern browsers.
   */
  function addEvent(node, event, fn, opt_useCapture) {
    if (typeof node.addEventListener == 'function') {
      node.addEventListener(event, fn, opt_useCapture || false);
    } else if (typeof node.attachEvent == 'function') {
      node.attachEvent('on' + event, fn);
    }
  }

  /**
   * Removes a previously added event handler from a DOM node.
   * @param {Node} node The DOM node to remove the event handler from.
   * @param {string} event The event name.
   * @param {Function} fn The event handler to remove.
   * @param {boolean} opt_useCapture If the event handler was added with this
   *     flag set to true, it should be set to true here in order to remove it.
   */
  function removeEvent(node, event, fn, opt_useCapture) {
    if (typeof node.removeEventListener == 'function') {
      node.removeEventListener(event, fn, opt_useCapture || false);
    } else if (typeof node.detachEvent == 'function') {
      node.detachEvent('on' + event, fn);
    }
  }

  /**
   * Returns the intersection between two rect objects.
   * @param {Object} rect1 The first rect.
   * @param {Object} rect2 The second rect.
   * @return {?Object|?ClientRect} The intersection rect or undefined if no
   *     intersection is found.
   */
  function computeRectIntersection(rect1, rect2) {
    var top = Math.max(rect1.top, rect2.top);
    var bottom = Math.min(rect1.bottom, rect2.bottom);
    var left = Math.max(rect1.left, rect2.left);
    var right = Math.min(rect1.right, rect2.right);
    var width = right - left;
    var height = bottom - top;
    return width >= 0 && height >= 0 && {
      top: top,
      bottom: bottom,
      left: left,
      right: right,
      width: width,
      height: height
    } || null;
  }

  /**
   * Shims the native getBoundingClientRect for compatibility with older IE.
   * @param {Element} el The element whose bounding rect to get.
   * @return {DOMRect|ClientRect} The (possibly shimmed) rect of the element.
   */
  function getBoundingClientRect(el) {
    var rect;
    try {
      rect = el.getBoundingClientRect();
    } catch (err) {
      // Ignore Windows 7 IE11 "Unspecified error"
      // https://github.com/w3c/IntersectionObserver/pull/205
    }
    if (!rect) return getEmptyRect();

    // Older IE
    if (!(rect.width && rect.height)) {
      rect = {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.right - rect.left,
        height: rect.bottom - rect.top
      };
    }
    return rect;
  }

  /**
   * Returns an empty rect object. An empty rect is returned when an element
   * is not in the DOM.
   * @return {ClientRect} The empty rect.
   */
  function getEmptyRect() {
    return {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0
    };
  }

  /**
   * Ensure that the result has all of the necessary fields of the DOMRect.
   * Specifically this ensures that `x` and `y` fields are set.
   *
   * @param {?DOMRect|?ClientRect} rect
   * @return {?DOMRect}
   */
  function ensureDOMRect(rect) {
    // A `DOMRect` object has `x` and `y` fields.
    if (!rect || 'x' in rect) {
      return rect;
    }
    // A IE's `ClientRect` type does not have `x` and `y`. The same is the case
    // for internally calculated Rect objects. For the purposes of
    // `IntersectionObserver`, it's sufficient to simply mirror `left` and `top`
    // for these fields.
    return {
      top: rect.top,
      y: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      x: rect.left,
      right: rect.right,
      width: rect.width,
      height: rect.height
    };
  }

  /**
   * Inverts the intersection and bounding rect from the parent (frame) BCR to
   * the local BCR space.
   * @param {DOMRect|ClientRect} parentBoundingRect The parent's bound client rect.
   * @param {DOMRect|ClientRect} parentIntersectionRect The parent's own intersection rect.
   * @return {ClientRect} The local root bounding rect for the parent's children.
   */
  function convertFromParentRect(parentBoundingRect, parentIntersectionRect) {
    var top = parentIntersectionRect.top - parentBoundingRect.top;
    var left = parentIntersectionRect.left - parentBoundingRect.left;
    return {
      top: top,
      left: left,
      height: parentIntersectionRect.height,
      width: parentIntersectionRect.width,
      bottom: top + parentIntersectionRect.height,
      right: left + parentIntersectionRect.width
    };
  }

  /**
   * Checks to see if a parent element contains a child element (including inside
   * shadow DOM).
   * @param {Node} parent The parent element.
   * @param {Node} child The child element.
   * @return {boolean} True if the parent node contains the child node.
   */
  function containsDeep(parent, child) {
    var node = child;
    while (node) {
      if (node == parent) return true;
      node = getParentNode(node);
    }
    return false;
  }

  /**
   * Gets the parent node of an element or its host element if the parent node
   * is a shadow root.
   * @param {Node} node The node whose parent to get.
   * @return {Node|null} The parent node or null if no parent exists.
   */
  function getParentNode(node) {
    var parent = node.parentNode;
    if (node.nodeType == /* DOCUMENT */9 && node != document) {
      // If this node is a document node, look for the embedding frame.
      return getFrameElement(node);
    }

    // If the parent has element that is assigned through shadow root slot
    if (parent && parent.assignedSlot) {
      parent = parent.assignedSlot.parentNode;
    }
    if (parent && parent.nodeType == 11 && parent.host) {
      // If the parent is a shadow root, return the host element.
      return parent.host;
    }
    return parent;
  }

  /**
   * Returns true if `node` is a Document.
   * @param {!Node} node
   * @returns {boolean}
   */
  function isDoc(node) {
    return node && node.nodeType === 9;
  }

  // Exposes the constructors globally.
  window.IntersectionObserver = IntersectionObserver;
  window.IntersectionObserverEntry = IntersectionObserverEntry;
})();

/***/ }),

/***/ "./node_modules/loglevel/lib/loglevel.js":
/*!***********************************************!*\
  !*** ./node_modules/loglevel/lib/loglevel.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
(function (root, definition) {
  "use strict";

  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(this, function () {
  "use strict";

  // Slightly dubious tricks to cut down minimized file size
  var noop = function () {};
  var undefinedType = "undefined";
  var isIE = typeof window !== undefinedType && typeof window.navigator !== undefinedType && /Trident\/|MSIE /.test(window.navigator.userAgent);
  var logMethods = ["trace", "debug", "info", "warn", "error"];
  var _loggersByName = {};
  var defaultLogger = null;

  // Cross-browser bind equivalent that works at least back to IE6
  function bindMethod(obj, methodName) {
    var method = obj[methodName];
    if (typeof method.bind === 'function') {
      return method.bind(obj);
    } else {
      try {
        return Function.prototype.bind.call(method, obj);
      } catch (e) {
        // Missing bind shim or IE8 + Modernizr, fallback to wrapping
        return function () {
          return Function.prototype.apply.apply(method, [obj, arguments]);
        };
      }
    }
  }

  // Trace() doesn't print the message in IE, so for that case we need to wrap it
  function traceForIE() {
    if (console.log) {
      if (console.log.apply) {
        console.log.apply(console, arguments);
      } else {
        // In old IE, native console methods themselves don't have apply().
        Function.prototype.apply.apply(console.log, [console, arguments]);
      }
    }
    if (console.trace) console.trace();
  }

  // Build the best logging method possible for this env
  // Wherever possible we want to bind, not wrap, to preserve stack traces
  function realMethod(methodName) {
    if (methodName === 'debug') {
      methodName = 'log';
    }
    if (typeof console === undefinedType) {
      return false; // No method possible, for now - fixed later by enableLoggingWhenConsoleArrives
    } else if (methodName === 'trace' && isIE) {
      return traceForIE;
    } else if (console[methodName] !== undefined) {
      return bindMethod(console, methodName);
    } else if (console.log !== undefined) {
      return bindMethod(console, 'log');
    } else {
      return noop;
    }
  }

  // These private functions always need `this` to be set properly

  function replaceLoggingMethods() {
    /*jshint validthis:true */
    var level = this.getLevel();

    // Replace the actual methods.
    for (var i = 0; i < logMethods.length; i++) {
      var methodName = logMethods[i];
      this[methodName] = i < level ? noop : this.methodFactory(methodName, level, this.name);
    }

    // Define log.log as an alias for log.debug
    this.log = this.debug;

    // Return any important warnings.
    if (typeof console === undefinedType && level < this.levels.SILENT) {
      return "No console available for logging";
    }
  }

  // In old IE versions, the console isn't present until you first open it.
  // We build realMethod() replacements here that regenerate logging methods
  function enableLoggingWhenConsoleArrives(methodName) {
    return function () {
      if (typeof console !== undefinedType) {
        replaceLoggingMethods.call(this);
        this[methodName].apply(this, arguments);
      }
    };
  }

  // By default, we use closely bound real methods wherever possible, and
  // otherwise we wait for a console to appear, and then try again.
  function defaultMethodFactory(methodName, _level, _loggerName) {
    /*jshint validthis:true */
    return realMethod(methodName) || enableLoggingWhenConsoleArrives.apply(this, arguments);
  }
  function Logger(name, factory) {
    // Private instance variables.
    var self = this;
    /**
     * The level inherited from a parent logger (or a global default). We
     * cache this here rather than delegating to the parent so that it stays
     * in sync with the actual logging methods that we have installed (the
     * parent could change levels but we might not have rebuilt the loggers
     * in this child yet).
     * @type {number}
     */
    var inheritedLevel;
    /**
     * The default level for this logger, if any. If set, this overrides
     * `inheritedLevel`.
     * @type {number|null}
     */
    var defaultLevel;
    /**
     * A user-specific level for this logger. If set, this overrides
     * `defaultLevel`.
     * @type {number|null}
     */
    var userLevel;
    var storageKey = "loglevel";
    if (typeof name === "string") {
      storageKey += ":" + name;
    } else if (typeof name === "symbol") {
      storageKey = undefined;
    }
    function persistLevelIfPossible(levelNum) {
      var levelName = (logMethods[levelNum] || 'silent').toUpperCase();
      if (typeof window === undefinedType || !storageKey) return;

      // Use localStorage if available
      try {
        window.localStorage[storageKey] = levelName;
        return;
      } catch (ignore) {}

      // Use session cookie as fallback
      try {
        window.document.cookie = encodeURIComponent(storageKey) + "=" + levelName + ";";
      } catch (ignore) {}
    }
    function getPersistedLevel() {
      var storedLevel;
      if (typeof window === undefinedType || !storageKey) return;
      try {
        storedLevel = window.localStorage[storageKey];
      } catch (ignore) {}

      // Fallback to cookies if local storage gives us nothing
      if (typeof storedLevel === undefinedType) {
        try {
          var cookie = window.document.cookie;
          var cookieName = encodeURIComponent(storageKey);
          var location = cookie.indexOf(cookieName + "=");
          if (location !== -1) {
            storedLevel = /^([^;]+)/.exec(cookie.slice(location + cookieName.length + 1))[1];
          }
        } catch (ignore) {}
      }

      // If the stored level is not valid, treat it as if nothing was stored.
      if (self.levels[storedLevel] === undefined) {
        storedLevel = undefined;
      }
      return storedLevel;
    }
    function clearPersistedLevel() {
      if (typeof window === undefinedType || !storageKey) return;

      // Use localStorage if available
      try {
        window.localStorage.removeItem(storageKey);
      } catch (ignore) {}

      // Use session cookie as fallback
      try {
        window.document.cookie = encodeURIComponent(storageKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
      } catch (ignore) {}
    }
    function normalizeLevel(input) {
      var level = input;
      if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
        level = self.levels[level.toUpperCase()];
      }
      if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
        return level;
      } else {
        throw new TypeError("log.setLevel() called with invalid level: " + input);
      }
    }

    /*
     *
     * Public logger API - see https://github.com/pimterry/loglevel for details
     *
     */

    self.name = name;
    self.levels = {
      "TRACE": 0,
      "DEBUG": 1,
      "INFO": 2,
      "WARN": 3,
      "ERROR": 4,
      "SILENT": 5
    };
    self.methodFactory = factory || defaultMethodFactory;
    self.getLevel = function () {
      if (userLevel != null) {
        return userLevel;
      } else if (defaultLevel != null) {
        return defaultLevel;
      } else {
        return inheritedLevel;
      }
    };
    self.setLevel = function (level, persist) {
      userLevel = normalizeLevel(level);
      if (persist !== false) {
        // defaults to true
        persistLevelIfPossible(userLevel);
      }

      // NOTE: in v2, this should call rebuild(), which updates children.
      return replaceLoggingMethods.call(self);
    };
    self.setDefaultLevel = function (level) {
      defaultLevel = normalizeLevel(level);
      if (!getPersistedLevel()) {
        self.setLevel(level, false);
      }
    };
    self.resetLevel = function () {
      userLevel = null;
      clearPersistedLevel();
      replaceLoggingMethods.call(self);
    };
    self.enableAll = function (persist) {
      self.setLevel(self.levels.TRACE, persist);
    };
    self.disableAll = function (persist) {
      self.setLevel(self.levels.SILENT, persist);
    };
    self.rebuild = function () {
      if (defaultLogger !== self) {
        inheritedLevel = normalizeLevel(defaultLogger.getLevel());
      }
      replaceLoggingMethods.call(self);
      if (defaultLogger === self) {
        for (var childName in _loggersByName) {
          _loggersByName[childName].rebuild();
        }
      }
    };

    // Initialize all the internal levels.
    inheritedLevel = normalizeLevel(defaultLogger ? defaultLogger.getLevel() : "WARN");
    var initialLevel = getPersistedLevel();
    if (initialLevel != null) {
      userLevel = normalizeLevel(initialLevel);
    }
    replaceLoggingMethods.call(self);
  }

  /*
   *
   * Top-level API
   *
   */

  defaultLogger = new Logger();
  defaultLogger.getLogger = function getLogger(name) {
    if (typeof name !== "symbol" && typeof name !== "string" || name === "") {
      throw new TypeError("You must supply a name when creating a logger.");
    }
    var logger = _loggersByName[name];
    if (!logger) {
      logger = _loggersByName[name] = new Logger(name, defaultLogger.methodFactory);
    }
    return logger;
  };

  // Grab the current global log variable in case of overwrite
  var _log = typeof window !== undefinedType ? window.log : undefined;
  defaultLogger.noConflict = function () {
    if (typeof window !== undefinedType && window.log === defaultLogger) {
      window.log = _log;
    }
    return defaultLogger;
  };
  defaultLogger.getLoggers = function getLoggers() {
    return _loggersByName;
  };

  // ES6 default export, for compatibility
  defaultLogger['default'] = defaultLogger;
  return defaultLogger;
});

/***/ }),

/***/ "./node_modules/marked/marked.min.js":
/*!*******************************************!*\
  !*** ./node_modules/marked/marked.min.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * marked v5.1.2 - a markdown parser
 * Copyright (c) 2011-2023, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
 */
!function (e, t) {
   true ? t(exports) : undefined;
}(this, function (r) {
  "use strict";

  function i(e, t) {
    for (var u = 0; u < t.length; u++) {
      var n = t[u];
      n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, function (e) {
        e = function (e, t) {
          if ("object" != typeof e || null === e) return e;
          var u = e[Symbol.toPrimitive];
          if (void 0 === u) return ("string" === t ? String : Number)(e);
          u = u.call(e, t || "default");
          if ("object" != typeof u) return u;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }(e, "string");
        return "symbol" == typeof e ? e : String(e);
      }(n.key), n);
    }
  }
  function g() {
    return (g = Object.assign ? Object.assign.bind() : function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var u,
          n = arguments[t];
        for (u in n) Object.prototype.hasOwnProperty.call(n, u) && (e[u] = n[u]);
      }
      return e;
    }).apply(this, arguments);
  }
  function s(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var u = 0, n = new Array(t); u < t; u++) n[u] = e[u];
    return n;
  }
  function c(e, t) {
    var u,
      n = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
    if (n) return (n = n.call(e)).next.bind(n);
    if (Array.isArray(e) || (n = function (e, t) {
      var u;
      if (e) return "string" == typeof e ? s(e, t) : "Map" === (u = "Object" === (u = Object.prototype.toString.call(e).slice(8, -1)) && e.constructor ? e.constructor.name : u) || "Set" === u ? Array.from(e) : "Arguments" === u || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(u) ? s(e, t) : void 0;
    }(e)) || t && e && "number" == typeof e.length) return n && (e = n), u = 0, function () {
      return u >= e.length ? {
        done: !0
      } : {
        done: !1,
        value: e[u++]
      };
    };
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var t = 0;
  function e(e) {
    return "__private_" + t++ + "_" + e;
  }
  function F(e, t) {
    if (Object.prototype.hasOwnProperty.call(e, t)) return e;
    throw new TypeError("attempted to use private field on non-instance");
  }
  function u() {
    return {
      async: !1,
      baseUrl: null,
      breaks: !1,
      extensions: null,
      gfm: !0,
      headerIds: !0,
      headerPrefix: "",
      highlight: null,
      hooks: null,
      langPrefix: "language-",
      mangle: !0,
      pedantic: !1,
      renderer: null,
      sanitize: !1,
      sanitizer: null,
      silent: !1,
      smartypants: !1,
      tokenizer: null,
      walkTokens: null,
      xhtml: !1
    };
  }
  function n(e) {
    r.defaults = e;
  }
  r.defaults = u();
  function a(e) {
    return j[e];
  }
  var o = /[&<>"']/,
    P = new RegExp(o.source, "g"),
    l = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
    O = new RegExp(l.source, "g"),
    j = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
  function D(e, t) {
    if (t) {
      if (o.test(e)) return e.replace(P, a);
    } else if (l.test(e)) return e.replace(O, a);
    return e;
  }
  var Z = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;
  function x(e) {
    return e.replace(Z, function (e, t) {
      return "colon" === (t = t.toLowerCase()) ? ":" : "#" === t.charAt(0) ? "x" === t.charAt(1) ? String.fromCharCode(parseInt(t.substring(2), 16)) : String.fromCharCode(+t.substring(1)) : "";
    });
  }
  var q = /(^|[^\[])\^/g;
  function p(u, e) {
    u = "string" == typeof u ? u : u.source, e = e || "";
    var n = {
      replace: function (e, t) {
        return t = (t = t.source || t).replace(q, "$1"), u = u.replace(e, t), n;
      },
      getRegex: function () {
        return new RegExp(u, e);
      }
    };
    return n;
  }
  var L = /[^\w:]/g,
    U = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
  function h(e, t, u) {
    if (e) {
      try {
        n = decodeURIComponent(x(u)).replace(L, "").toLowerCase();
      } catch (e) {
        return null;
      }
      if (0 === n.indexOf("javascript:") || 0 === n.indexOf("vbscript:") || 0 === n.indexOf("data:")) return null;
    }
    var n;
    t && !U.test(u) && (e = u, f[" " + (n = t)] || (Q.test(n) ? f[" " + n] = n + "/" : f[" " + n] = A(n, "/", !0)), t = -1 === (n = f[" " + n]).indexOf(":"), u = "//" === e.substring(0, 2) ? t ? e : n.replace(M, "$1") + e : "/" === e.charAt(0) ? t ? e : n.replace(H, "$1") + e : n + e);
    try {
      u = encodeURI(u).replace(/%25/g, "%");
    } catch (e) {
      return null;
    }
    return u;
  }
  var f = {},
    Q = /^[^:]+:\/*[^/]*$/,
    M = /^([^:]+:)[\s\S]*$/,
    H = /^([^:]+:\/*[^/]*)[\s\S]*$/;
  var d = {
    exec: function () {}
  };
  function k(e, t) {
    var u = e.replace(/\|/g, function (e, t, u) {
        for (var n = !1, r = t; 0 <= --r && "\\" === u[r];) n = !n;
        return n ? "|" : " |";
      }).split(/ \|/),
      n = 0;
    if (u[0].trim() || u.shift(), 0 < u.length && !u[u.length - 1].trim() && u.pop(), u.length > t) u.splice(t);else for (; u.length < t;) u.push("");
    for (; n < u.length; n++) u[n] = u[n].trim().replace(/\\\|/g, "|");
    return u;
  }
  function A(e, t, u) {
    var n = e.length;
    if (0 === n) return "";
    for (var r = 0; r < n;) {
      var i = e.charAt(n - r - 1);
      if ((i !== t || u) && (i === t || !u)) break;
      r++;
    }
    return e.slice(0, n - r);
  }
  function C(e, t, u, n) {
    var r = t.href,
      t = t.title ? D(t.title) : null,
      i = e[1].replace(/\\([\[\]])/g, "$1");
    return "!" !== e[0].charAt(0) ? (n.state.inLink = !0, e = {
      type: "link",
      raw: u,
      href: r,
      title: t,
      text: i,
      tokens: n.inlineTokens(i)
    }, n.state.inLink = !1, e) : {
      type: "image",
      raw: u,
      href: r,
      title: t,
      text: D(i)
    };
  }
  var E = function () {
      function e(e) {
        this.options = e || r.defaults;
      }
      var t = e.prototype;
      return t.space = function (e) {
        e = this.rules.block.newline.exec(e);
        if (e && 0 < e[0].length) return {
          type: "space",
          raw: e[0]
        };
      }, t.code = function (e) {
        var t,
          e = this.rules.block.code.exec(e);
        if (e) return t = e[0].replace(/^ {1,4}/gm, ""), {
          type: "code",
          raw: e[0],
          codeBlockStyle: "indented",
          text: this.options.pedantic ? t : A(t, "\n")
        };
      }, t.fences = function (e) {
        var t,
          u,
          n,
          r,
          e = this.rules.block.fences.exec(e);
        if (e) return t = e[0], u = t, n = e[3] || "", u = null === (u = t.match(/^(\s+)(?:```)/)) ? n : (r = u[1], n.split("\n").map(function (e) {
          var t = e.match(/^\s+/);
          return null !== t && t[0].length >= r.length ? e.slice(r.length) : e;
        }).join("\n")), {
          type: "code",
          raw: t,
          lang: e[2] && e[2].trim().replace(this.rules.inline._escapes, "$1"),
          text: u
        };
      }, t.heading = function (e) {
        var t,
          u,
          e = this.rules.block.heading.exec(e);
        if (e) return t = e[2].trim(), /#$/.test(t) && (u = A(t, "#"), !this.options.pedantic && u && !/ $/.test(u) || (t = u.trim())), {
          type: "heading",
          raw: e[0],
          depth: e[1].length,
          text: t,
          tokens: this.lexer.inline(t)
        };
      }, t.hr = function (e) {
        e = this.rules.block.hr.exec(e);
        if (e) return {
          type: "hr",
          raw: e[0]
        };
      }, t.blockquote = function (e) {
        var t,
          u,
          n,
          e = this.rules.block.blockquote.exec(e);
        if (e) return t = e[0].replace(/^ *>[ \t]?/gm, ""), u = this.lexer.state.top, this.lexer.state.top = !0, n = this.lexer.blockTokens(t), this.lexer.state.top = u, {
          type: "blockquote",
          raw: e[0],
          tokens: n,
          text: t
        };
      }, t.list = function (e) {
        var t = this.rules.block.list.exec(e);
        if (t) {
          var u,
            n,
            r,
            i,
            s,
            a,
            o,
            l,
            D,
            c,
            p,
            h = 1 < (g = t[1].trim()).length,
            f = {
              type: "list",
              raw: "",
              ordered: h,
              start: h ? +g.slice(0, -1) : "",
              loose: !1,
              items: []
            },
            g = h ? "\\d{1,9}\\" + g.slice(-1) : "\\" + g;
          this.options.pedantic && (g = h ? g : "[*+-]");
          for (var F = new RegExp("^( {0,3}" + g + ")((?:[\t ][^\\n]*)?(?:\\n|$))"); e && (p = !1, t = F.exec(e)) && !this.rules.block.hr.test(e);) {
            if (u = t[0], e = e.substring(u.length), o = t[2].split("\n", 1)[0].replace(/^\t+/, function (e) {
              return " ".repeat(3 * e.length);
            }), l = e.split("\n", 1)[0], this.options.pedantic ? (i = 2, c = o.trimLeft()) : (i = t[2].search(/[^ ]/), c = o.slice(i = 4 < i ? 1 : i), i += t[1].length), s = !1, !o && /^ *$/.test(l) && (u += l + "\n", e = e.substring(l.length + 1), p = !0), !p) for (var d = new RegExp("^ {0," + Math.min(3, i - 1) + "}(?:[*+-]|\\d{1,9}[.)])((?:[ \t][^\\n]*)?(?:\\n|$))"), k = new RegExp("^ {0," + Math.min(3, i - 1) + "}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)"), A = new RegExp("^ {0," + Math.min(3, i - 1) + "}(?:```|~~~)"), C = new RegExp("^ {0," + Math.min(3, i - 1) + "}#"); e && (l = D = e.split("\n", 1)[0], this.options.pedantic && (l = l.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ")), !A.test(l)) && !C.test(l) && !d.test(l) && !k.test(e);) {
              if (l.search(/[^ ]/) >= i || !l.trim()) c += "\n" + l.slice(i);else {
                if (s) break;
                if (4 <= o.search(/[^ ]/)) break;
                if (A.test(o)) break;
                if (C.test(o)) break;
                if (k.test(o)) break;
                c += "\n" + l;
              }
              s || l.trim() || (s = !0), u += D + "\n", e = e.substring(D.length + 1), o = l.slice(i);
            }
            f.loose || (a ? f.loose = !0 : /\n *\n *$/.test(u) && (a = !0)), this.options.gfm && (n = /^\[[ xX]\] /.exec(c)) && (r = "[ ] " !== n[0], c = c.replace(/^\[[ xX]\] +/, "")), f.items.push({
              type: "list_item",
              raw: u,
              task: !!n,
              checked: r,
              loose: !1,
              text: c
            }), f.raw += u;
          }
          f.items[f.items.length - 1].raw = u.trimRight(), f.items[f.items.length - 1].text = c.trimRight(), f.raw = f.raw.trimRight();
          for (var E, x = f.items.length, m = 0; m < x; m++) this.lexer.state.top = !1, f.items[m].tokens = this.lexer.blockTokens(f.items[m].text, []), f.loose || (E = 0 < (E = f.items[m].tokens.filter(function (e) {
            return "space" === e.type;
          })).length && E.some(function (e) {
            return /\n.*\n/.test(e.raw);
          }), f.loose = E);
          if (f.loose) for (m = 0; m < x; m++) f.items[m].loose = !0;
          return f;
        }
      }, t.html = function (e) {
        var t,
          e = this.rules.block.html.exec(e);
        if (e) return t = {
          type: "html",
          block: !0,
          raw: e[0],
          pre: !this.options.sanitizer && ("pre" === e[1] || "script" === e[1] || "style" === e[1]),
          text: e[0]
        }, this.options.sanitize && (e = this.options.sanitizer ? this.options.sanitizer(e[0]) : D(e[0]), t.type = "paragraph", t.text = e, t.tokens = this.lexer.inline(e)), t;
      }, t.def = function (e) {
        var t,
          u,
          n,
          e = this.rules.block.def.exec(e);
        if (e) return t = e[1].toLowerCase().replace(/\s+/g, " "), u = e[2] ? e[2].replace(/^<(.*)>$/, "$1").replace(this.rules.inline._escapes, "$1") : "", n = e[3] && e[3].substring(1, e[3].length - 1).replace(this.rules.inline._escapes, "$1"), {
          type: "def",
          tag: t,
          raw: e[0],
          href: u,
          title: n
        };
      }, t.table = function (e) {
        e = this.rules.block.table.exec(e);
        if (e) {
          var t = {
            type: "table",
            header: k(e[1]).map(function (e) {
              return {
                text: e
              };
            }),
            align: e[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
            rows: e[3] && e[3].trim() ? e[3].replace(/\n[ \t]*$/, "").split("\n") : []
          };
          if (t.header.length === t.align.length) {
            t.raw = e[0];
            for (var u, n, r, i = t.align.length, s = 0; s < i; s++) /^ *-+: *$/.test(t.align[s]) ? t.align[s] = "right" : /^ *:-+: *$/.test(t.align[s]) ? t.align[s] = "center" : /^ *:-+ *$/.test(t.align[s]) ? t.align[s] = "left" : t.align[s] = null;
            for (i = t.rows.length, s = 0; s < i; s++) t.rows[s] = k(t.rows[s], t.header.length).map(function (e) {
              return {
                text: e
              };
            });
            for (i = t.header.length, u = 0; u < i; u++) t.header[u].tokens = this.lexer.inline(t.header[u].text);
            for (i = t.rows.length, u = 0; u < i; u++) for (r = t.rows[u], n = 0; n < r.length; n++) r[n].tokens = this.lexer.inline(r[n].text);
            return t;
          }
        }
      }, t.lheading = function (e) {
        e = this.rules.block.lheading.exec(e);
        if (e) return {
          type: "heading",
          raw: e[0],
          depth: "=" === e[2].charAt(0) ? 1 : 2,
          text: e[1],
          tokens: this.lexer.inline(e[1])
        };
      }, t.paragraph = function (e) {
        var t,
          e = this.rules.block.paragraph.exec(e);
        if (e) return t = "\n" === e[1].charAt(e[1].length - 1) ? e[1].slice(0, -1) : e[1], {
          type: "paragraph",
          raw: e[0],
          text: t,
          tokens: this.lexer.inline(t)
        };
      }, t.text = function (e) {
        e = this.rules.block.text.exec(e);
        if (e) return {
          type: "text",
          raw: e[0],
          text: e[0],
          tokens: this.lexer.inline(e[0])
        };
      }, t.escape = function (e) {
        e = this.rules.inline.escape.exec(e);
        if (e) return {
          type: "escape",
          raw: e[0],
          text: D(e[1])
        };
      }, t.tag = function (e) {
        e = this.rules.inline.tag.exec(e);
        if (e) return !this.lexer.state.inLink && /^<a /i.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && /^<\/a>/i.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(e[0]) && (this.lexer.state.inRawBlock = !1), {
          type: this.options.sanitize ? "text" : "html",
          raw: e[0],
          inLink: this.lexer.state.inLink,
          inRawBlock: this.lexer.state.inRawBlock,
          block: !1,
          text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(e[0]) : D(e[0]) : e[0]
        };
      }, t.link = function (e) {
        e = this.rules.inline.link.exec(e);
        if (e) {
          var t = e[2].trim();
          if (!this.options.pedantic && /^</.test(t)) {
            if (!/>$/.test(t)) return;
            var u = A(t.slice(0, -1), "\\");
            if ((t.length - u.length) % 2 == 0) return;
          } else {
            u = function (e, t) {
              if (-1 !== e.indexOf(t[1])) for (var u = e.length, n = 0, r = 0; r < u; r++) if ("\\" === e[r]) r++;else if (e[r] === t[0]) n++;else if (e[r] === t[1] && --n < 0) return r;
              return -1;
            }(e[2], "()");
            -1 < u && (r = (0 === e[0].indexOf("!") ? 5 : 4) + e[1].length + u, e[2] = e[2].substring(0, u), e[0] = e[0].substring(0, r).trim(), e[3] = "");
          }
          var n,
            u = e[2],
            r = "";
          return this.options.pedantic ? (n = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(u)) && (u = n[1], r = n[3]) : r = e[3] ? e[3].slice(1, -1) : "", u = u.trim(), C(e, {
            href: (u = /^</.test(u) ? this.options.pedantic && !/>$/.test(t) ? u.slice(1) : u.slice(1, -1) : u) && u.replace(this.rules.inline._escapes, "$1"),
            title: r && r.replace(this.rules.inline._escapes, "$1")
          }, e[0], this.lexer);
        }
      }, t.reflink = function (e, t) {
        var u;
        if (u = (u = this.rules.inline.reflink.exec(e)) || this.rules.inline.nolink.exec(e)) return (e = t[(e = (u[2] || u[1]).replace(/\s+/g, " ")).toLowerCase()]) ? C(u, e, u[0], this.lexer) : {
          type: "text",
          raw: t = u[0].charAt(0),
          text: t
        };
      }, t.emStrong = function (e, t, u) {
        void 0 === u && (u = "");
        var n = this.rules.inline.emStrong.lDelim.exec(e);
        if (n && (!n[3] || !u.match(/(?:[0-9A-Za-z\xAA\xB2\xB3\xB5\xB9\xBA\xBC-\xBE\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u0660-\u0669\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0966-\u096F\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09E6-\u09F1\u09F4-\u09F9\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A66-\u0A6F\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AE6-\u0AEF\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B6F\u0B71-\u0B77\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0BE6-\u0BF2\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C66-\u0C6F\u0C78-\u0C7E\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D58-\u0D61\u0D66-\u0D78\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DE6-\u0DEF\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F20-\u0F33\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F-\u1049\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u1090-\u1099\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1369-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A20-\u1A54\u1A80-\u1A89\u1A90-\u1A99\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B50-\u1B59\u1B83-\u1BA0\u1BAE-\u1BE5\u1C00-\u1C23\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2150-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2CFD\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3192-\u3195\u31A0-\u31BF\u31F0-\u31FF\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA830-\uA835\uA840-\uA873\uA882-\uA8B3\uA8D0-\uA8D9\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA900-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF-\uA9D9\uA9E0-\uA9E4\uA9E6-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDE80-\uDE9C\uDEA0-\uDED0\uDEE1-\uDEFB\uDF00-\uDF23\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC58-\uDC76\uDC79-\uDC9E\uDCA7-\uDCAF\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDD1B\uDD20-\uDD39\uDD80-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE40-\uDE48\uDE60-\uDE7E\uDE80-\uDE9F\uDEC0-\uDEC7\uDEC9-\uDEE4\uDEEB-\uDEEF\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDD23\uDD30-\uDD39\uDE60-\uDE7E\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF27\uDF30-\uDF45\uDF51-\uDF54\uDF70-\uDF81\uDFB0-\uDFCB\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC52-\uDC6F\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD03-\uDD26\uDD36-\uDD3F\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDD0-\uDDDA\uDDDC\uDDE1-\uDDF4\uDE00-\uDE11\uDE13-\uDE2B\uDE3F\uDE40\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDEF0-\uDEF9\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC50-\uDC59\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE50-\uDE59\uDE80-\uDEAA\uDEB8\uDEC0-\uDEC9\uDF00-\uDF1A\uDF30-\uDF3B\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCF2\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDD50-\uDD59\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC50-\uDC6C\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDDA0-\uDDA9\uDEE0-\uDEF2\uDF02\uDF04-\uDF10\uDF12-\uDF33\uDF50-\uDF59\uDFB0\uDFC0-\uDFD4]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883\uD885-\uD887][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2F\uDC41-\uDC46]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDE70-\uDEBE\uDEC0-\uDEC9\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF50-\uDF59\uDF5B-\uDF61\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE96\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD32\uDD50-\uDD52\uDD55\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD834[\uDEC0-\uDED3\uDEE0-\uDEF3\uDF60-\uDF78]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD837[\uDF00-\uDF1E\uDF25-\uDF2A]|\uD838[\uDC30-\uDC6D\uDD00-\uDD2C\uDD37-\uDD3D\uDD40-\uDD49\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB\uDEF0-\uDEF9]|\uD839[\uDCD0-\uDCEB\uDCF0-\uDCF9\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCCF\uDD00-\uDD43\uDD4B\uDD50-\uDD59]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4\uDD01-\uDD2D\uDD2F-\uDD3D\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83C[\uDD00-\uDD0C]|\uD83E[\uDFF0-\uDFF9]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF39\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A\uDF50-\uDFFF]|\uD888[\uDC00-\uDFAF])/)) && (!(n[1] || n[2] || "") || !u || this.rules.inline.punctuation.exec(u))) {
          var r = n[0].length - 1,
            i = r,
            s = 0,
            a = "*" === n[0][0] ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
          for (a.lastIndex = 0, t = t.slice(-1 * e.length + r); null != (n = a.exec(t));) {
            var o,
              l = n[1] || n[2] || n[3] || n[4] || n[5] || n[6];
            if (l) if (l = l.length, n[3] || n[4]) i += l;else if ((n[5] || n[6]) && r % 3 && !((r + l) % 3)) s += l;else if (!(0 < (i -= l))) return l = Math.min(l, l + i + s), o = e.slice(0, r + n.index + l + 1), Math.min(r, l) % 2 ? (l = o.slice(1, -1), {
              type: "em",
              raw: o,
              text: l,
              tokens: this.lexer.inlineTokens(l)
            }) : (l = o.slice(2, -2), {
              type: "strong",
              raw: o,
              text: l,
              tokens: this.lexer.inlineTokens(l)
            });
          }
        }
      }, t.codespan = function (e) {
        var t,
          u,
          n,
          e = this.rules.inline.code.exec(e);
        if (e) return n = e[2].replace(/\n/g, " "), t = /[^ ]/.test(n), u = /^ /.test(n) && / $/.test(n), n = D(n = t && u ? n.substring(1, n.length - 1) : n, !0), {
          type: "codespan",
          raw: e[0],
          text: n
        };
      }, t.br = function (e) {
        e = this.rules.inline.br.exec(e);
        if (e) return {
          type: "br",
          raw: e[0]
        };
      }, t.del = function (e) {
        e = this.rules.inline.del.exec(e);
        if (e) return {
          type: "del",
          raw: e[0],
          text: e[2],
          tokens: this.lexer.inlineTokens(e[2])
        };
      }, t.autolink = function (e, t) {
        var u,
          e = this.rules.inline.autolink.exec(e);
        if (e) return t = "@" === e[2] ? "mailto:" + (u = D(this.options.mangle ? t(e[1]) : e[1])) : u = D(e[1]), {
          type: "link",
          raw: e[0],
          text: u,
          href: t,
          tokens: [{
            type: "text",
            raw: u,
            text: u
          }]
        };
      }, t.url = function (e, t) {
        var u, n, r, i;
        if (u = this.rules.inline.url.exec(e)) {
          if ("@" === u[2]) r = "mailto:" + (n = D(this.options.mangle ? t(u[0]) : u[0]));else {
            for (; i = u[0], u[0] = this.rules.inline._backpedal.exec(u[0])[0], i !== u[0];);
            n = D(u[0]), r = "www." === u[1] ? "http://" + u[0] : u[0];
          }
          return {
            type: "link",
            raw: u[0],
            text: n,
            href: r,
            tokens: [{
              type: "text",
              raw: n,
              text: n
            }]
          };
        }
      }, t.inlineText = function (e, t) {
        e = this.rules.inline.text.exec(e);
        if (e) return t = this.lexer.state.inRawBlock ? this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(e[0]) : D(e[0]) : e[0] : D(this.options.smartypants ? t(e[0]) : e[0]), {
          type: "text",
          raw: e[0],
          text: t
        };
      }, e;
    }(),
    m = {
      newline: /^(?: *(?:\n|$))+/,
      code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
      fences: /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
      hr: /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
      heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
      blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
      list: /^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/,
      html: "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))",
      def: /^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/,
      table: d,
      lheading: /^((?:(?!^bull ).|\n(?!\n|bull ))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
      _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
      text: /^[^\n]+/,
      _label: /(?!\s*\])(?:\\.|[^\[\]\\])+/,
      _title: /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/
    },
    b = (m.def = p(m.def).replace("label", m._label).replace("title", m._title).getRegex(), m.bullet = /(?:[*+-]|\d{1,9}[.)])/, m.listItemStart = p(/^( *)(bull) */).replace("bull", m.bullet).getRegex(), m.list = p(m.list).replace(/bull/g, m.bullet).replace("hr", "\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def", "\\n+(?=" + m.def.source + ")").getRegex(), m._tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", m._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/, m.html = p(m.html, "i").replace("comment", m._comment).replace("tag", m._tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), m.lheading = p(m.lheading).replace(/bull/g, m.bullet).getRegex(), m.paragraph = p(m._paragraph).replace("hr", m.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", m._tag).getRegex(), m.blockquote = p(m.blockquote).replace("paragraph", m.paragraph).getRegex(), m.normal = g({}, m), m.gfm = g({}, m.normal, {
      table: "^ *([^\\n ].*\\|.*)\\n {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
    }), m.gfm.table = p(m.gfm.table).replace("hr", m.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", m._tag).getRegex(), m.gfm.paragraph = p(m._paragraph).replace("hr", m.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("table", m.gfm.table).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", m._tag).getRegex(), m.pedantic = g({}, m.normal, {
      html: p("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment", m._comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
      def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
      heading: /^(#{1,6})(.*)(?:\n+|$)/,
      fences: d,
      lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
      paragraph: p(m.normal._paragraph).replace("hr", m.hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", m.lheading).replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").getRegex()
    }), {
      escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
      autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
      url: d,
      tag: "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",
      link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
      reflink: /^!?\[(label)\]\[(ref)\]/,
      nolink: /^!?\[(ref)\](?:\[\])?/,
      reflinkSearch: "reflink|nolink(?!\\()",
      emStrong: {
        lDelim: /^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/,
        rDelimAst: /^[^_*]*?__[^_*]*?\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\*)[punct](\*+)(?=[\s]|$)|[^punct\s](\*+)(?!\*)(?=[punct\s]|$)|(?!\*)[punct\s](\*+)(?=[^punct\s])|[\s](\*+)(?!\*)(?=[punct])|(?!\*)[punct](\*+)(?!\*)(?=[punct])|[^punct\s](\*+)(?=[^punct\s])/,
        rDelimUnd: /^[^_*]*?\*\*[^_*]*?_[^_*]*?(?=\*\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\s]|$)|[^punct\s](_+)(?!_)(?=[punct\s]|$)|(?!_)[punct\s](_+)(?=[^punct\s])|[\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])/
      },
      code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
      br: /^( {2,}|\\)\n(?!\s*$)/,
      del: d,
      text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
      punctuation: /^((?![*_])[\spunctuation])/
    });
  function N(e) {
    return e.replace(/---/g, "—").replace(/--/g, "–").replace(/(^|[-\u2014/(\[{"\s])'/g, "$1‘").replace(/'/g, "’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1“").replace(/"/g, "”").replace(/\.{3}/g, "…");
  }
  function w(e) {
    for (var t, u = "", n = e.length, r = 0; r < n; r++) t = e.charCodeAt(r), u += "&#" + (t = .5 < Math.random() ? "x" + t.toString(16) : t) + ";";
    return u;
  }
  b._punctuation = "\\p{P}$+<=>`^|~", b.punctuation = p(b.punctuation, "u").replace(/punctuation/g, b._punctuation).getRegex(), b.blockSkip = /\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g, b.anyPunctuation = /\\[punct]/g, b._escapes = /\\([punct])/g, b._comment = p(m._comment).replace("(?:--\x3e|$)", "--\x3e").getRegex(), b.emStrong.lDelim = p(b.emStrong.lDelim, "u").replace(/punct/g, b._punctuation).getRegex(), b.emStrong.rDelimAst = p(b.emStrong.rDelimAst, "gu").replace(/punct/g, b._punctuation).getRegex(), b.emStrong.rDelimUnd = p(b.emStrong.rDelimUnd, "gu").replace(/punct/g, b._punctuation).getRegex(), b.anyPunctuation = p(b.anyPunctuation, "gu").replace(/punct/g, b._punctuation).getRegex(), b._escapes = p(b._escapes, "gu").replace(/punct/g, b._punctuation).getRegex(), b._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/, b._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/, b.autolink = p(b.autolink).replace("scheme", b._scheme).replace("email", b._email).getRegex(), b._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/, b.tag = p(b.tag).replace("comment", b._comment).replace("attribute", b._attribute).getRegex(), b._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, b._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/, b._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/, b.link = p(b.link).replace("label", b._label).replace("href", b._href).replace("title", b._title).getRegex(), b.reflink = p(b.reflink).replace("label", b._label).replace("ref", m._label).getRegex(), b.nolink = p(b.nolink).replace("ref", m._label).getRegex(), b.reflinkSearch = p(b.reflinkSearch, "g").replace("reflink", b.reflink).replace("nolink", b.nolink).getRegex(), b.normal = g({}, b), b.pedantic = g({}, b.normal, {
    strong: {
      start: /^__|\*\*/,
      middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
      endAst: /\*\*(?!\*)/g,
      endUnd: /__(?!_)/g
    },
    em: {
      start: /^_|\*/,
      middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
      endAst: /\*(?!\*)/g,
      endUnd: /_(?!_)/g
    },
    link: p(/^!?\[(label)\]\((.*?)\)/).replace("label", b._label).getRegex(),
    reflink: p(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", b._label).getRegex()
  }), b.gfm = g({}, b.normal, {
    escape: p(b.escape).replace("])", "~|])").getRegex(),
    _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
    url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
    _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
    del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
    text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
  }), b.gfm.url = p(b.gfm.url, "i").replace("email", b.gfm._extended_email).getRegex(), b.breaks = g({}, b.gfm, {
    br: p(b.br).replace("{2,}", "*").getRegex(),
    text: p(b.gfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
  });
  var B = function () {
      function u(e) {
        this.tokens = [], this.tokens.links = Object.create(null), this.options = e || r.defaults, this.options.tokenizer = this.options.tokenizer || new E(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, (this.tokenizer.lexer = this).inlineQueue = [], this.state = {
          inLink: !1,
          inRawBlock: !1,
          top: !0
        };
        e = {
          block: m.normal,
          inline: b.normal
        };
        this.options.pedantic ? (e.block = m.pedantic, e.inline = b.pedantic) : this.options.gfm && (e.block = m.gfm, this.options.breaks ? e.inline = b.breaks : e.inline = b.gfm), this.tokenizer.rules = e;
      }
      u.lex = function (e, t) {
        return new u(t).lex(e);
      }, u.lexInline = function (e, t) {
        return new u(t).inlineTokens(e);
      };
      var e,
        t,
        n = u.prototype;
      return n.lex = function (e) {
        var t;
        for (e = e.replace(/\r\n|\r/g, "\n"), this.blockTokens(e, this.tokens); t = this.inlineQueue.shift();) this.inlineTokens(t.src, t.tokens);
        return this.tokens;
      }, n.blockTokens = function (r, i) {
        var s,
          a,
          o,
          l,
          D = this;
        for (void 0 === i && (i = []), r = this.options.pedantic ? r.replace(/\t/g, "    ").replace(/^ +$/gm, "") : r.replace(/^( *)(\t+)/gm, function (e, t, u) {
          return t + "    ".repeat(u.length);
        }); r;) {
          var e = function () {
            if (D.options.extensions && D.options.extensions.block && D.options.extensions.block.some(function (e) {
              return !!(s = e.call({
                lexer: D
              }, r, i)) && (r = r.substring(s.raw.length), i.push(s), !0);
            })) return "continue";
            if (s = D.tokenizer.space(r)) return r = r.substring(s.raw.length), 1 === s.raw.length && 0 < i.length ? i[i.length - 1].raw += "\n" : i.push(s), "continue";
            if (s = D.tokenizer.code(r)) return r = r.substring(s.raw.length), !(a = i[i.length - 1]) || "paragraph" !== a.type && "text" !== a.type ? i.push(s) : (a.raw += "\n" + s.raw, a.text += "\n" + s.text, D.inlineQueue[D.inlineQueue.length - 1].src = a.text), "continue";
            if (s = D.tokenizer.fences(r)) return r = r.substring(s.raw.length), i.push(s), "continue";
            if (s = D.tokenizer.heading(r)) return r = r.substring(s.raw.length), i.push(s), "continue";
            if (s = D.tokenizer.hr(r)) return r = r.substring(s.raw.length), i.push(s), "continue";
            if (s = D.tokenizer.blockquote(r)) return r = r.substring(s.raw.length), i.push(s), "continue";
            if (s = D.tokenizer.list(r)) return r = r.substring(s.raw.length), i.push(s), "continue";
            if (s = D.tokenizer.html(r)) return r = r.substring(s.raw.length), i.push(s), "continue";
            if (s = D.tokenizer.def(r)) return r = r.substring(s.raw.length), !(a = i[i.length - 1]) || "paragraph" !== a.type && "text" !== a.type ? D.tokens.links[s.tag] || (D.tokens.links[s.tag] = {
              href: s.href,
              title: s.title
            }) : (a.raw += "\n" + s.raw, a.text += "\n" + s.raw, D.inlineQueue[D.inlineQueue.length - 1].src = a.text), "continue";
            if (s = D.tokenizer.table(r)) return r = r.substring(s.raw.length), i.push(s), "continue";
            if (s = D.tokenizer.lheading(r)) return r = r.substring(s.raw.length), i.push(s), "continue";
            var t, u, n;
            if (o = r, D.options.extensions && D.options.extensions.startBlock && (t = 1 / 0, u = r.slice(1), D.options.extensions.startBlock.forEach(function (e) {
              "number" == typeof (n = e.call({
                lexer: this
              }, u)) && 0 <= n && (t = Math.min(t, n));
            }), t < 1 / 0) && 0 <= t && (o = r.substring(0, t + 1)), D.state.top && (s = D.tokenizer.paragraph(o))) return a = i[i.length - 1], l && "paragraph" === a.type ? (a.raw += "\n" + s.raw, a.text += "\n" + s.text, D.inlineQueue.pop(), D.inlineQueue[D.inlineQueue.length - 1].src = a.text) : i.push(s), l = o.length !== r.length, r = r.substring(s.raw.length), "continue";
            if (s = D.tokenizer.text(r)) return r = r.substring(s.raw.length), (a = i[i.length - 1]) && "text" === a.type ? (a.raw += "\n" + s.raw, a.text += "\n" + s.text, D.inlineQueue.pop(), D.inlineQueue[D.inlineQueue.length - 1].src = a.text) : i.push(s), "continue";
            if (r) {
              var e = "Infinite loop on byte: " + r.charCodeAt(0);
              if (D.options.silent) return console.error(e), "break";
              throw new Error(e);
            }
          }();
          if ("continue" !== e && "break" === e) break;
        }
        return this.state.top = !0, i;
      }, n.inline = function (e, t) {
        return this.inlineQueue.push({
          src: e,
          tokens: t = void 0 === t ? [] : t
        }), t;
      }, n.inlineTokens = function (r, i) {
        var s,
          a,
          o,
          e,
          l,
          D,
          c = this,
          p = (void 0 === i && (i = []), r);
        if (this.tokens.links) {
          var t = Object.keys(this.tokens.links);
          if (0 < t.length) for (; null != (e = this.tokenizer.rules.inline.reflinkSearch.exec(p));) t.includes(e[0].slice(e[0].lastIndexOf("[") + 1, -1)) && (p = p.slice(0, e.index) + "[" + "a".repeat(e[0].length - 2) + "]" + p.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
        }
        for (; null != (e = this.tokenizer.rules.inline.blockSkip.exec(p));) p = p.slice(0, e.index) + "[" + "a".repeat(e[0].length - 2) + "]" + p.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
        for (; null != (e = this.tokenizer.rules.inline.anyPunctuation.exec(p));) p = p.slice(0, e.index) + "++" + p.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
        for (; r;) {
          var u = function () {
            if (l || (D = ""), l = !1, c.options.extensions && c.options.extensions.inline && c.options.extensions.inline.some(function (e) {
              return !!(s = e.call({
                lexer: c
              }, r, i)) && (r = r.substring(s.raw.length), i.push(s), !0);
            })) return "continue";
            if (s = c.tokenizer.escape(r)) return r = r.substring(s.raw.length), i.push(s), "continue";
            if (s = c.tokenizer.tag(r)) return r = r.substring(s.raw.length), (a = i[i.length - 1]) && "text" === s.type && "text" === a.type ? (a.raw += s.raw, a.text += s.text) : i.push(s), "continue";
            if (s = c.tokenizer.link(r)) return r = r.substring(s.raw.length), i.push(s), "continue";
            if (s = c.tokenizer.reflink(r, c.tokens.links)) return r = r.substring(s.raw.length), (a = i[i.length - 1]) && "text" === s.type && "text" === a.type ? (a.raw += s.raw, a.text += s.text) : i.push(s), "continue";
            if (s = c.tokenizer.emStrong(r, p, D)) return r = r.substring(s.raw.length), i.push(s), "continue";
            if (s = c.tokenizer.codespan(r)) return r = r.substring(s.raw.length), i.push(s), "continue";
            if (s = c.tokenizer.br(r)) return r = r.substring(s.raw.length), i.push(s), "continue";
            if (s = c.tokenizer.del(r)) return r = r.substring(s.raw.length), i.push(s), "continue";
            if (s = c.tokenizer.autolink(r, w)) return r = r.substring(s.raw.length), i.push(s), "continue";
            if (!c.state.inLink && (s = c.tokenizer.url(r, w))) return r = r.substring(s.raw.length), i.push(s), "continue";
            var t, u, n;
            if (o = r, c.options.extensions && c.options.extensions.startInline && (t = 1 / 0, u = r.slice(1), c.options.extensions.startInline.forEach(function (e) {
              "number" == typeof (n = e.call({
                lexer: this
              }, u)) && 0 <= n && (t = Math.min(t, n));
            }), t < 1 / 0) && 0 <= t && (o = r.substring(0, t + 1)), s = c.tokenizer.inlineText(o, N)) return r = r.substring(s.raw.length), "_" !== s.raw.slice(-1) && (D = s.raw.slice(-1)), l = !0, (a = i[i.length - 1]) && "text" === a.type ? (a.raw += s.raw, a.text += s.text) : i.push(s), "continue";
            if (r) {
              var e = "Infinite loop on byte: " + r.charCodeAt(0);
              if (c.options.silent) return console.error(e), "break";
              throw new Error(e);
            }
          }();
          if ("continue" !== u && "break" === u) break;
        }
        return i;
      }, n = u, t = [{
        key: "rules",
        get: function () {
          return {
            block: m,
            inline: b
          };
        }
      }], (e = null) && i(n.prototype, e), t && i(n, t), Object.defineProperty(n, "prototype", {
        writable: !1
      }), u;
    }(),
    y = function () {
      function e(e) {
        this.options = e || r.defaults;
      }
      var t = e.prototype;
      return t.code = function (e, t, u) {
        var n,
          t = (t || "").match(/\S*/)[0];
        return this.options.highlight && null != (n = this.options.highlight(e, t)) && n !== e && (u = !0, e = n), e = e.replace(/\n$/, "") + "\n", t ? '<pre><code class="' + this.options.langPrefix + D(t) + '">' + (u ? e : D(e, !0)) + "</code></pre>\n" : "<pre><code>" + (u ? e : D(e, !0)) + "</code></pre>\n";
      }, t.blockquote = function (e) {
        return "<blockquote>\n" + e + "</blockquote>\n";
      }, t.html = function (e, t) {
        return e;
      }, t.heading = function (e, t, u, n) {
        return this.options.headerIds ? "<h" + t + ' id="' + (this.options.headerPrefix + n.slug(u)) + '">' + e + "</h" + t + ">\n" : "<h" + t + ">" + e + "</h" + t + ">\n";
      }, t.hr = function () {
        return this.options.xhtml ? "<hr/>\n" : "<hr>\n";
      }, t.list = function (e, t, u) {
        var n = t ? "ol" : "ul";
        return "<" + n + (t && 1 !== u ? ' start="' + u + '"' : "") + ">\n" + e + "</" + n + ">\n";
      }, t.listitem = function (e) {
        return "<li>" + e + "</li>\n";
      }, t.checkbox = function (e) {
        return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox"' + (this.options.xhtml ? " /" : "") + "> ";
      }, t.paragraph = function (e) {
        return "<p>" + e + "</p>\n";
      }, t.table = function (e, t) {
        return "<table>\n<thead>\n" + e + "</thead>\n" + (t = t && "<tbody>" + t + "</tbody>") + "</table>\n";
      }, t.tablerow = function (e) {
        return "<tr>\n" + e + "</tr>\n";
      }, t.tablecell = function (e, t) {
        var u = t.header ? "th" : "td";
        return (t.align ? "<" + u + ' align="' + t.align + '">' : "<" + u + ">") + e + "</" + u + ">\n";
      }, t.strong = function (e) {
        return "<strong>" + e + "</strong>";
      }, t.em = function (e) {
        return "<em>" + e + "</em>";
      }, t.codespan = function (e) {
        return "<code>" + e + "</code>";
      }, t.br = function () {
        return this.options.xhtml ? "<br/>" : "<br>";
      }, t.del = function (e) {
        return "<del>" + e + "</del>";
      }, t.link = function (e, t, u) {
        return null === (e = h(this.options.sanitize, this.options.baseUrl, e)) ? u : (e = '<a href="' + e + '"', t && (e += ' title="' + t + '"'), e + ">" + u + "</a>");
      }, t.image = function (e, t, u) {
        return null === (e = h(this.options.sanitize, this.options.baseUrl, e)) ? u : (e = '<img src="' + e + '" alt="' + u + '"', t && (e += ' title="' + t + '"'), e + (this.options.xhtml ? "/>" : ">"));
      }, t.text = function (e) {
        return e;
      }, e;
    }(),
    v = function () {
      function e() {}
      var t = e.prototype;
      return t.strong = function (e) {
        return e;
      }, t.em = function (e) {
        return e;
      }, t.codespan = function (e) {
        return e;
      }, t.del = function (e) {
        return e;
      }, t.html = function (e) {
        return e;
      }, t.text = function (e) {
        return e;
      }, t.link = function (e, t, u) {
        return "" + u;
      }, t.image = function (e, t, u) {
        return "" + u;
      }, t.br = function () {
        return "";
      }, e;
    }(),
    _ = function () {
      function e() {
        this.seen = {};
      }
      var t = e.prototype;
      return t.serialize = function (e) {
        return e.toLowerCase().trim().replace(/<[!\/a-z].*?>/gi, "").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "").replace(/\s/g, "-");
      }, t.getNextSafeSlug = function (e, t) {
        var u = e,
          n = 0;
        if (this.seen.hasOwnProperty(u)) for (n = this.seen[e]; u = e + "-" + ++n, this.seen.hasOwnProperty(u););
        return t || (this.seen[e] = n, this.seen[u] = 0), u;
      }, t.slug = function (e, t) {
        void 0 === t && (t = {});
        e = this.serialize(e);
        return this.getNextSafeSlug(e, t.dryrun);
      }, e;
    }(),
    z = function () {
      function u(e) {
        this.options = e || r.defaults, this.options.renderer = this.options.renderer || new y(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.textRenderer = new v(), this.slugger = new _();
      }
      u.parse = function (e, t) {
        return new u(t).parse(e);
      }, u.parseInline = function (e, t) {
        return new u(t).parseInline(e);
      };
      var e = u.prototype;
      return e.parse = function (e, t) {
        void 0 === t && (t = !0);
        for (var u, n, r, i, s, a, o, l, D, c, p, h, f, g, F, d, k = "", A = e.length, C = 0; C < A; C++) if (l = e[C], this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[l.type] && (!1 !== (d = this.options.extensions.renderers[l.type].call({
          parser: this
        }, l)) || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(l.type))) k += d || "";else switch (l.type) {
          case "space":
            continue;
          case "hr":
            k += this.renderer.hr();
            continue;
          case "heading":
            k += this.renderer.heading(this.parseInline(l.tokens), l.depth, x(this.parseInline(l.tokens, this.textRenderer)), this.slugger);
            continue;
          case "code":
            k += this.renderer.code(l.text, l.lang, l.escaped);
            continue;
          case "table":
            for (a = D = "", r = l.header.length, u = 0; u < r; u++) a += this.renderer.tablecell(this.parseInline(l.header[u].tokens), {
              header: !0,
              align: l.align[u]
            });
            for (D += this.renderer.tablerow(a), o = "", r = l.rows.length, u = 0; u < r; u++) {
              for (a = "", i = (s = l.rows[u]).length, n = 0; n < i; n++) a += this.renderer.tablecell(this.parseInline(s[n].tokens), {
                header: !1,
                align: l.align[n]
              });
              o += this.renderer.tablerow(a);
            }
            k += this.renderer.table(D, o);
            continue;
          case "blockquote":
            o = this.parse(l.tokens), k += this.renderer.blockquote(o);
            continue;
          case "list":
            for (D = l.ordered, E = l.start, c = l.loose, r = l.items.length, o = "", u = 0; u < r; u++) f = (h = l.items[u]).checked, g = h.task, p = "", h.task && (F = this.renderer.checkbox(f), c ? 0 < h.tokens.length && "paragraph" === h.tokens[0].type ? (h.tokens[0].text = F + " " + h.tokens[0].text, h.tokens[0].tokens && 0 < h.tokens[0].tokens.length && "text" === h.tokens[0].tokens[0].type && (h.tokens[0].tokens[0].text = F + " " + h.tokens[0].tokens[0].text)) : h.tokens.unshift({
              type: "text",
              text: F
            }) : p += F), p += this.parse(h.tokens, c), o += this.renderer.listitem(p, g, f);
            k += this.renderer.list(o, D, E);
            continue;
          case "html":
            k += this.renderer.html(l.text, l.block);
            continue;
          case "paragraph":
            k += this.renderer.paragraph(this.parseInline(l.tokens));
            continue;
          case "text":
            for (o = l.tokens ? this.parseInline(l.tokens) : l.text; C + 1 < A && "text" === e[C + 1].type;) o += "\n" + ((l = e[++C]).tokens ? this.parseInline(l.tokens) : l.text);
            k += t ? this.renderer.paragraph(o) : o;
            continue;
          default:
            var E = 'Token with "' + l.type + '" type was not found.';
            if (this.options.silent) return void console.error(E);
            throw new Error(E);
        }
        return k;
      }, e.parseInline = function (e, t) {
        t = t || this.renderer;
        for (var u, n, r = "", i = e.length, s = 0; s < i; s++) if (u = e[s], this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[u.type] && (!1 !== (n = this.options.extensions.renderers[u.type].call({
          parser: this
        }, u)) || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(u.type))) r += n || "";else switch (u.type) {
          case "escape":
            r += t.text(u.text);
            break;
          case "html":
            r += t.html(u.text);
            break;
          case "link":
            r += t.link(u.href, u.title, this.parseInline(u.tokens, t));
            break;
          case "image":
            r += t.image(u.href, u.title, u.text);
            break;
          case "strong":
            r += t.strong(this.parseInline(u.tokens, t));
            break;
          case "em":
            r += t.em(this.parseInline(u.tokens, t));
            break;
          case "codespan":
            r += t.codespan(u.text);
            break;
          case "br":
            r += t.br();
            break;
          case "del":
            r += t.del(this.parseInline(u.tokens, t));
            break;
          case "text":
            r += t.text(u.text);
            break;
          default:
            var a = 'Token with "' + u.type + '" type was not found.';
            if (this.options.silent) return void console.error(a);
            throw new Error(a);
        }
        return r;
      }, u;
    }(),
    $ = function () {
      function e(e) {
        this.options = e || r.defaults;
      }
      var t = e.prototype;
      return t.preprocess = function (e) {
        return e;
      }, t.postprocess = function (e) {
        return e;
      }, e;
    }(),
    S = ($.passThroughHooks = new Set(["preprocess", "postprocess"]), e("parseMarkdown")),
    T = e("onError"),
    d = function () {
      function e() {
        Object.defineProperty(this, T, {
          value: G
        }), Object.defineProperty(this, S, {
          value: X
        }), this.defaults = u(), this.options = this.setOptions, this.parse = F(this, S)[S](B.lex, z.parse), this.parseInline = F(this, S)[S](B.lexInline, z.parseInline), this.Parser = z, this.parser = z.parse, this.Renderer = y, this.TextRenderer = v, this.Lexer = B, this.lexer = B.lex, this.Tokenizer = E, this.Slugger = _, this.Hooks = $, this.use.apply(this, arguments);
      }
      var t = e.prototype;
      return t.walkTokens = function (e, a) {
        for (var o, l = this, D = [], t = c(e); !(o = t()).done;) !function () {
          var t = o.value;
          switch (D = D.concat(a.call(l, t)), t.type) {
            case "table":
              for (var e = c(t.header); !(u = e()).done;) {
                var u = u.value;
                D = D.concat(l.walkTokens(u.tokens, a));
              }
              for (var n, r = c(t.rows); !(n = r()).done;) for (var i = c(n.value); !(s = i()).done;) {
                var s = s.value;
                D = D.concat(l.walkTokens(s.tokens, a));
              }
              break;
            case "list":
              D = D.concat(l.walkTokens(t.items, a));
              break;
            default:
              l.defaults.extensions && l.defaults.extensions.childTokens && l.defaults.extensions.childTokens[t.type] ? l.defaults.extensions.childTokens[t.type].forEach(function (e) {
                D = D.concat(l.walkTokens(t[e], a));
              }) : t.tokens && (D = D.concat(l.walkTokens(t.tokens, a)));
          }
        }();
        return D;
      }, t.use = function () {
        for (var D = this, c = this.defaults.extensions || {
            renderers: {},
            childTokens: {}
          }, e = arguments.length, t = new Array(e), u = 0; u < e; u++) t[u] = arguments[u];
        return t.forEach(function (s) {
          var u,
            e = g({}, s);
          if (e.async = D.defaults.async || e.async || !1, s.extensions && (s.extensions.forEach(function (r) {
            if (!r.name) throw new Error("extension name required");
            var i;
            if (r.renderer && (i = c.renderers[r.name], c.renderers[r.name] = i ? function () {
              for (var e = arguments.length, t = new Array(e), u = 0; u < e; u++) t[u] = arguments[u];
              var n = r.renderer.apply(this, t);
              return n = !1 === n ? i.apply(this, t) : n;
            } : r.renderer), r.tokenizer) {
              if (!r.level || "block" !== r.level && "inline" !== r.level) throw new Error("extension level must be 'block' or 'inline'");
              c[r.level] ? c[r.level].unshift(r.tokenizer) : c[r.level] = [r.tokenizer], r.start && ("block" === r.level ? c.startBlock ? c.startBlock.push(r.start) : c.startBlock = [r.start] : "inline" === r.level && (c.startInline ? c.startInline.push(r.start) : c.startInline = [r.start]));
            }
            r.childTokens && (c.childTokens[r.name] = r.childTokens);
          }), e.extensions = c), s.renderer) {
            var t,
              a = D.defaults.renderer || new y(D.defaults);
            for (t in s.renderer) !function (r) {
              var i = a[r];
              a[r] = function () {
                for (var e = arguments.length, t = new Array(e), u = 0; u < e; u++) t[u] = arguments[u];
                var n = s.renderer[r].apply(a, t);
                return n = !1 === n ? i.apply(a, t) : n;
              };
            }(t);
            e.renderer = a;
          }
          if (s.tokenizer) {
            var n,
              o = D.defaults.tokenizer || new E(D.defaults);
            for (n in s.tokenizer) !function (r) {
              var i = o[r];
              o[r] = function () {
                for (var e = arguments.length, t = new Array(e), u = 0; u < e; u++) t[u] = arguments[u];
                var n = s.tokenizer[r].apply(o, t);
                return n = !1 === n ? i.apply(o, t) : n;
              };
            }(n);
            e.tokenizer = o;
          }
          if (s.hooks) {
            var r,
              l = D.defaults.hooks || new $();
            for (r in s.hooks) !function (r) {
              var i = l[r];
              $.passThroughHooks.has(r) ? l[r] = function (e) {
                return D.defaults.async ? Promise.resolve(s.hooks[r].call(l, e)).then(function (e) {
                  return i.call(l, e);
                }) : (e = s.hooks[r].call(l, e), i.call(l, e));
              } : l[r] = function () {
                for (var e = arguments.length, t = new Array(e), u = 0; u < e; u++) t[u] = arguments[u];
                var n = s.hooks[r].apply(l, t);
                return n = !1 === n ? i.apply(l, t) : n;
              };
            }(r);
            e.hooks = l;
          }
          s.walkTokens && (u = D.defaults.walkTokens, e.walkTokens = function (e) {
            var t = [];
            return t.push(s.walkTokens.call(this, e)), t = u ? t.concat(u.call(this, e)) : t;
          }), D.defaults = g({}, D.defaults, e);
        }), this;
      }, t.setOptions = function (e) {
        return this.defaults = g({}, this.defaults, e), this;
      }, e;
    }();
  function X(p, h) {
    var f = this;
    return function (e, u, n) {
      "function" == typeof u && (n = u, u = null);
      var t,
        r = g({}, u),
        i = (u = g({}, f.defaults, r), F(f, T)[T](u.silent, u.async, n));
      if (null == e) return i(new Error("marked(): input parameter is undefined or null"));
      if ("string" != typeof e) return i(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (r = n, (t = u) && !t.silent && (r && console.warn("marked(): callback is deprecated since version 5.0.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/using_pro#async"), (t.sanitize || t.sanitizer) && console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options"), !t.highlight && "language-" === t.langPrefix || console.warn("marked(): highlight and langPrefix parameters are deprecated since version 5.0.0, should not be used and will be removed in the future. Instead use https://www.npmjs.com/package/marked-highlight."), t.mangle && console.warn("marked(): mangle parameter is enabled by default, but is deprecated since version 5.0.0, and will be removed in the future. To clear this warning, install https://www.npmjs.com/package/marked-mangle, or disable by setting `{mangle: false}`."), t.baseUrl && console.warn("marked(): baseUrl parameter is deprecated since version 5.0.0, should not be used and will be removed in the future. Instead use https://www.npmjs.com/package/marked-base-url."), t.smartypants && console.warn("marked(): smartypants parameter is deprecated since version 5.0.0, should not be used and will be removed in the future. Instead use https://www.npmjs.com/package/marked-smartypants."), t.xhtml && console.warn("marked(): xhtml parameter is deprecated since version 5.0.0, should not be used and will be removed in the future. Instead use https://www.npmjs.com/package/marked-xhtml."), t.headerIds || t.headerPrefix) && console.warn("marked(): headerIds and headerPrefix parameters enabled by default, but are deprecated since version 5.0.0, and will be removed in the future. To clear this warning, install  https://www.npmjs.com/package/marked-gfm-heading-id, or disable by setting `{headerIds: false}`."), u.hooks && (u.hooks.options = u), n) {
        var s,
          a = u.highlight;
        try {
          u.hooks && (e = u.hooks.preprocess(e)), s = p(e, u);
        } catch (e) {
          return i(e);
        }
        var o,
          l = function (t) {
            var e;
            if (!t) try {
              u.walkTokens && f.walkTokens(s, u.walkTokens), e = h(s, u), u.hooks && (e = u.hooks.postprocess(e));
            } catch (e) {
              t = e;
            }
            return u.highlight = a, t ? i(t) : n(null, e);
          };
        return !a || a.length < 3 ? l() : (delete u.highlight, s.length ? (o = 0, f.walkTokens(s, function (u) {
          "code" === u.type && (o++, setTimeout(function () {
            a(u.text, u.lang, function (e, t) {
              if (e) return l(e);
              null != t && t !== u.text && (u.text = t, u.escaped = !0), 0 === --o && l();
            });
          }, 0));
        }), void (0 === o && l())) : l());
      }
      if (u.async) return Promise.resolve(u.hooks ? u.hooks.preprocess(e) : e).then(function (e) {
        return p(e, u);
      }).then(function (e) {
        return u.walkTokens ? Promise.all(f.walkTokens(e, u.walkTokens)).then(function () {
          return e;
        }) : e;
      }).then(function (e) {
        return h(e, u);
      }).then(function (e) {
        return u.hooks ? u.hooks.postprocess(e) : e;
      }).catch(i);
      try {
        u.hooks && (e = u.hooks.preprocess(e));
        var D = p(e, u),
          c = (u.walkTokens && f.walkTokens(D, u.walkTokens), h(D, u));
        return c = u.hooks ? u.hooks.postprocess(c) : c;
      } catch (e) {
        return i(e);
      }
    };
  }
  function G(u, n, r) {
    return function (e) {
      var t;
      if (e.message += "\nPlease report this to https://github.com/markedjs/marked.", u) return t = "<p>An error occurred:</p><pre>" + D(e.message + "", !0) + "</pre>", n ? Promise.resolve(t) : r ? void r(null, t) : t;
      if (n) return Promise.reject(e);
      if (!r) throw e;
      r(e);
    };
  }
  var R = new d(r.defaults);
  function I(e, t, u) {
    return R.parse(e, t, u);
  }
  I.options = I.setOptions = function (e) {
    return R.setOptions(e), n(I.defaults = R.defaults), I;
  }, I.getDefaults = u, I.defaults = r.defaults, I.use = function () {
    return R.use.apply(R, arguments), n(I.defaults = R.defaults), I;
  }, I.walkTokens = function (e, t) {
    return R.walkTokens(e, t);
  }, I.parseInline = R.parseInline, I.Parser = z, I.parser = z.parse, I.Renderer = y, I.TextRenderer = v, I.Lexer = B, I.lexer = B.lex, I.Tokenizer = E, I.Slugger = _, I.Hooks = $;
  var V = (I.parse = I).options,
    J = I.setOptions,
    K = I.use,
    W = I.walkTokens,
    Y = I.parseInline,
    ee = I,
    te = z.parse,
    ue = B.lex;
  r.Hooks = $, r.Lexer = B, r.Marked = d, r.Parser = z, r.Renderer = y, r.Slugger = _, r.TextRenderer = v, r.Tokenizer = E, r.getDefaults = u, r.lexer = ue, r.marked = I, r.options = V, r.parse = ee, r.parseInline = Y, r.parser = te, r.setOptions = J, r.use = K, r.walkTokens = W;
});

/***/ }),

/***/ "./node_modules/object-assign/index.js":
/*!*********************************************!*\
  !*** ./node_modules/object-assign/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/



/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;
function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }
  return Object(val);
}
function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    }

    // Detect buggy property enumeration order in older V8 versions.

    // https://bugs.chromium.org/p/v8/issues/detail?id=4118
    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
    test1[5] = 'de';
    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false;
    }

    // https://bugs.chromium.org/p/v8/issues/detail?id=3056
    var test2 = {};
    for (var i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i;
    }
    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      return test2[n];
    });
    if (order2.join('') !== '0123456789') {
      return false;
    }

    // https://bugs.chromium.org/p/v8/issues/detail?id=3056
    var test3 = {};
    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      test3[letter] = letter;
    });
    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
      return false;
    }
    return true;
  } catch (err) {
    // We don't expect any of the above to throw, but better to be safe.
    return false;
  }
}
module.exports = shouldUseNative() ? Object.assign : function (target, source) {
  var from;
  var to = toObject(target);
  var symbols;
  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);
    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }
    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);
      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }
  return to;
};

/***/ }),

/***/ "./node_modules/prop-types/checkPropTypes.js":
/*!***************************************************!*\
  !*** ./node_modules/prop-types/checkPropTypes.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var printWarning = function () {};
if (true) {
  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
  var loggedTypeFailures = {};
  var has = __webpack_require__(/*! ./lib/has */ "./node_modules/prop-types/lib/has.js");
  printWarning = function (text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {/**/}
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' + 'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.');
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning((componentName || 'React class') + ': type specification of ' + location + ' `' + typeSpecName + '` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a ' + typeof error + '. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).');
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;
          var stack = getStack ? getStack() : '';
          printWarning('Failed ' + location + ' type: ' + error.message + (stack != null ? stack : ''));
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function () {
  if (true) {
    loggedTypeFailures = {};
  }
};
module.exports = checkPropTypes;

/***/ }),

/***/ "./node_modules/prop-types/lib/ReactPropTypesSecret.js":
/*!*************************************************************!*\
  !*** ./node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
module.exports = ReactPropTypesSecret;

/***/ }),

/***/ "./node_modules/prop-types/lib/has.js":
/*!********************************************!*\
  !*** ./node_modules/prop-types/lib/has.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = Function.call.bind(Object.prototype.hasOwnProperty);

/***/ }),

/***/ "./node_modules/react-dom/cjs/react-dom-server.node.development.js":
/*!*************************************************************************!*\
  !*** ./node_modules/react-dom/cjs/react-dom-server.node.development.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v16.10.1
 * react-dom-server.node.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (true) {
  (function () {
    'use strict';

    var _assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");
    var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
    var checkPropTypes = __webpack_require__(/*! prop-types/checkPropTypes */ "./node_modules/prop-types/checkPropTypes.js");
    var stream = __webpack_require__(/*! stream */ "stream");

    // TODO: this is special because it gets imported during build.

    var ReactVersion = '16.10.1';

    // Do not require this module directly! Use normal `invariant` calls with
    // template literal strings. The messages will be converted to ReactError during
    // build, and in production they will be minified.

    // Do not require this module directly! Use normal `invariant` calls with
    // template literal strings. The messages will be converted to ReactError during
    // build, and in production they will be minified.
    function ReactError(error) {
      error.name = 'Invariant Violation';
      return error;
    }

    /**
     * Use invariant() to assert state which your program assumes to be true.
     *
     * Provide sprintf-style format (only %s is supported) and arguments
     * to provide information about what broke and what you were
     * expecting.
     *
     * The invariant message will be stripped in production, but the invariant
     * will remain to ensure logic does not differ in production.
     */

    /**
     * Similar to invariant but only logs a warning if the condition is not met.
     * This can be used to log issues in development environments in critical
     * paths. Removing the logging code for production environments will keep the
     * same logic and follow the same code paths.
     */
    var warningWithoutStack = function () {};
    {
      warningWithoutStack = function (condition, format) {
        for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }
        if (format === undefined) {
          throw new Error('`warningWithoutStack(condition, format, ...args)` requires a warning ' + 'message argument');
        }
        if (args.length > 8) {
          // Check before the condition to catch violations early.
          throw new Error('warningWithoutStack() currently supports at most 8 arguments.');
        }
        if (condition) {
          return;
        }
        if (typeof console !== 'undefined') {
          var argsWithFormat = args.map(function (item) {
            return '' + item;
          });
          argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
          // breaks IE9: https://github.com/facebook/react/issues/13610

          Function.prototype.apply.call(console.error, console, argsWithFormat);
        }
        try {
          // --- Welcome to debugging React ---
          // This error was thrown as a convenience so that you can use this stack
          // to find the callsite that caused this warning to fire.
          var argIndex = 0;
          var message = 'Warning: ' + format.replace(/%s/g, function () {
            return args[argIndex++];
          });
          throw new Error(message);
        } catch (x) {}
      };
    }
    var warningWithoutStack$1 = warningWithoutStack;

    // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
    // nor polyfill, then a plain number is used for performance.
    var hasSymbol = typeof Symbol === 'function' && Symbol.for;
    var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
    var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
    var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
    var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
    var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
    var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
    // (unstable) APIs that have been removed. Can we remove the symbols?

    var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
    var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
    var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
    var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
    var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
    var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
    var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
    var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;
    var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED; // Prevent newer renderers from RTE when used with older react package versions.
    // Current owner and dispatcher used to share the same ref,
    // but PR #14548 split them out to better support the react-debug-tools package.

    if (!ReactSharedInternals.hasOwnProperty('ReactCurrentDispatcher')) {
      ReactSharedInternals.ReactCurrentDispatcher = {
        current: null
      };
    }
    if (!ReactSharedInternals.hasOwnProperty('ReactCurrentBatchConfig')) {
      ReactSharedInternals.ReactCurrentBatchConfig = {
        suspense: null
      };
    }

    /**
     * Similar to invariant but only logs a warning if the condition is not met.
     * This can be used to log issues in development environments in critical
     * paths. Removing the logging code for production environments will keep the
     * same logic and follow the same code paths.
     */

    var warning = warningWithoutStack$1;
    {
      warning = function (condition, format) {
        if (condition) {
          return;
        }
        var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
        var stack = ReactDebugCurrentFrame.getStackAddendum(); // eslint-disable-next-line react-internal/warning-and-invariant-args

        for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }
        warningWithoutStack$1.apply(void 0, [false, format + '%s'].concat(args, [stack]));
      };
    }
    var warning$1 = warning;
    var Uninitialized = -1;
    var Pending = 0;
    var Resolved = 1;
    var Rejected = 2;
    function refineResolvedLazyComponent(lazyComponent) {
      return lazyComponent._status === Resolved ? lazyComponent._result : null;
    }
    function initializeLazyComponentType(lazyComponent) {
      if (lazyComponent._status === Uninitialized) {
        lazyComponent._status = Pending;
        var ctor = lazyComponent._ctor;
        var thenable = ctor();
        lazyComponent._result = thenable;
        thenable.then(function (moduleObject) {
          if (lazyComponent._status === Pending) {
            var defaultExport = moduleObject.default;
            {
              if (defaultExport === undefined) {
                warning$1(false, 'lazy: Expected the result of a dynamic import() call. ' + 'Instead received: %s\n\nYour code should look like: \n  ' + "const MyComponent = lazy(() => import('./MyComponent'))", moduleObject);
              }
            }
            lazyComponent._status = Resolved;
            lazyComponent._result = defaultExport;
          }
        }, function (error) {
          if (lazyComponent._status === Pending) {
            lazyComponent._status = Rejected;
            lazyComponent._result = error;
          }
        });
      }
    }
    function getWrappedName(outerType, innerType, wrapperName) {
      var functionName = innerType.displayName || innerType.name || '';
      return outerType.displayName || (functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName);
    }
    function getComponentName(type) {
      if (type == null) {
        // Host root, text node or just invalid type.
        return null;
      }
      {
        if (typeof type.tag === 'number') {
          warningWithoutStack$1(false, 'Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
        }
      }
      if (typeof type === 'function') {
        return type.displayName || type.name || null;
      }
      if (typeof type === 'string') {
        return type;
      }
      switch (type) {
        case REACT_FRAGMENT_TYPE:
          return 'Fragment';
        case REACT_PORTAL_TYPE:
          return 'Portal';
        case REACT_PROFILER_TYPE:
          return "Profiler";
        case REACT_STRICT_MODE_TYPE:
          return 'StrictMode';
        case REACT_SUSPENSE_TYPE:
          return 'Suspense';
        case REACT_SUSPENSE_LIST_TYPE:
          return 'SuspenseList';
      }
      if (typeof type === 'object') {
        switch (type.$$typeof) {
          case REACT_CONTEXT_TYPE:
            return 'Context.Consumer';
          case REACT_PROVIDER_TYPE:
            return 'Context.Provider';
          case REACT_FORWARD_REF_TYPE:
            return getWrappedName(type, type.render, 'ForwardRef');
          case REACT_MEMO_TYPE:
            return getComponentName(type.type);
          case REACT_LAZY_TYPE:
            {
              var thenable = type;
              var resolvedThenable = refineResolvedLazyComponent(thenable);
              if (resolvedThenable) {
                return getComponentName(resolvedThenable);
              }
              break;
            }
        }
      }
      return null;
    }

    /**
     * Forked from fbjs/warning:
     * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
     *
     * Only change is we use console.warn instead of console.error,
     * and do nothing when 'console' is not supported.
     * This really simplifies the code.
     * ---
     * Similar to invariant but only logs a warning if the condition is not met.
     * This can be used to log issues in development environments in critical
     * paths. Removing the logging code for production environments will keep the
     * same logic and follow the same code paths.
     */
    var lowPriorityWarningWithoutStack = function () {};
    {
      var printWarning = function (format) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        var argIndex = 0;
        var message = 'Warning: ' + format.replace(/%s/g, function () {
          return args[argIndex++];
        });
        if (typeof console !== 'undefined') {
          console.warn(message);
        }
        try {
          // --- Welcome to debugging React ---
          // This error was thrown as a convenience so that you can use this stack
          // to find the callsite that caused this warning to fire.
          throw new Error(message);
        } catch (x) {}
      };
      lowPriorityWarningWithoutStack = function (condition, format) {
        if (format === undefined) {
          throw new Error('`lowPriorityWarningWithoutStack(condition, format, ...args)` requires a warning ' + 'message argument');
        }
        if (!condition) {
          for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
            args[_key2 - 2] = arguments[_key2];
          }
          printWarning.apply(void 0, [format].concat(args));
        }
      };
    }
    var lowPriorityWarningWithoutStack$1 = lowPriorityWarningWithoutStack;
    var BEFORE_SLASH_RE = /^(.*)[\\\/]/;
    var describeComponentFrame = function (name, source, ownerName) {
      var sourceInfo = '';
      if (source) {
        var path = source.fileName;
        var fileName = path.replace(BEFORE_SLASH_RE, '');
        {
          // In DEV, include code for a common special case:
          // prefer "folder/index.js" instead of just "index.js".
          if (/^index\./.test(fileName)) {
            var match = path.match(BEFORE_SLASH_RE);
            if (match) {
              var pathBeforeSlash = match[1];
              if (pathBeforeSlash) {
                var folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, '');
                fileName = folderName + '/' + fileName;
              }
            }
          }
        }
        sourceInfo = ' (at ' + fileName + ':' + source.lineNumber + ')';
      } else if (ownerName) {
        sourceInfo = ' (created by ' + ownerName + ')';
      }
      return '\n    in ' + (name || 'Unknown') + sourceInfo;
    };

    // Helps identify side effects in begin-phase lifecycle hooks and setState reducers:

    // In some cases, StrictMode should also double-render lifecycles.
    // This can be confusing for tests though,
    // And it can be bad for performance in production.
    // This feature flag can be used to control the behavior:

    // To preserve the "Pause on caught exceptions" behavior of the debugger, we
    // replay the begin phase of a failed component inside invokeGuardedCallback.

    // Warn about deprecated, async-unsafe lifecycles; relates to RFC #6:

    var warnAboutDeprecatedLifecycles = true; // Gather advanced timing metrics for Profiler subtrees.

    // Trace which interactions trigger each commit.

    // Only used in www builds.

    var enableSuspenseServerRenderer = false; // TODO: true? Here it might just be false.

    // Only used in www builds.

    // Only used in www builds.

    // Disable javascript: URL strings in href for XSS protection.

    var disableJavaScriptURLs = false; // React Fire: prevent the value and checked attributes from syncing
    // with their related DOM properties

    // These APIs will no longer be "unstable" in the upcoming 16.7 release,
    // Control this behavior with a flag to support 16.6 minor releases in the meanwhile.

    // See https://github.com/react-native-community/discussions-and-proposals/issues/72 for more information
    // This is a flag so we can fix warnings in RN core before turning it on

    // Experimental React Flare event system and event components support.

    var enableFlareAPI = false; // Experimental Host Component support.

    var enableFundamentalAPI = false; // Experimental Scope support.

    var enableScopeAPI = false; // New API for JSX transforms to target - https://github.com/reactjs/rfcs/pull/107

    // We will enforce mocking scheduler with scheduler/unstable_mock at some point. (v17?)
    // Till then, we warn about the missing mock, but still fallback to a sync mode compatible version

    // For tests, we flush suspense fallbacks in an act scope;
    // *except* in some of our own tests, where we test incremental loading states.

    // Changes priority of some events like mousemove to user-blocking priority,
    // but without making them discrete. The flag exists in case it causes
    // starvation problems.

    // Add a callback property to suspense to notify which promises are currently
    // in the update queue. This allows reporting and tracing of what is causing
    // the user to see a loading state.
    // Also allows hydration callbacks to fire when a dehydrated boundary gets
    // hydrated or deleted.

    // Part of the simplification of React.createElement so we can eventually move
    // from React.createElement to React.jsx
    // https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md

    var disableLegacyContext = false;
    var ReactDebugCurrentFrame$1;
    var didWarnAboutInvalidateContextType;
    {
      ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
      didWarnAboutInvalidateContextType = new Set();
    }
    var emptyObject = {};
    {
      Object.freeze(emptyObject);
    }
    function maskContext(type, context) {
      var contextTypes = type.contextTypes;
      if (!contextTypes) {
        return emptyObject;
      }
      var maskedContext = {};
      for (var contextName in contextTypes) {
        maskedContext[contextName] = context[contextName];
      }
      return maskedContext;
    }
    function checkContextTypes(typeSpecs, values, location) {
      {
        checkPropTypes(typeSpecs, values, location, 'Component', ReactDebugCurrentFrame$1.getCurrentStack);
      }
    }
    function validateContextBounds(context, threadID) {
      // If we don't have enough slots in this context to store this threadID,
      // fill it in without leaving any holes to ensure that the VM optimizes
      // this as non-holey index properties.
      // (Note: If `react` package is < 16.6, _threadCount is undefined.)
      for (var i = context._threadCount | 0; i <= threadID; i++) {
        // We assume that this is the same as the defaultValue which might not be
        // true if we're rendering inside a secondary renderer but they are
        // secondary because these use cases are very rare.
        context[i] = context._currentValue2;
        context._threadCount = i + 1;
      }
    }
    function processContext(type, context, threadID, isClass) {
      if (isClass) {
        var contextType = type.contextType;
        {
          if ('contextType' in type) {
            var isValid =
            // Allow null for conditional declaration
            contextType === null || contextType !== undefined && contextType.$$typeof === REACT_CONTEXT_TYPE && contextType._context === undefined; // Not a <Context.Consumer>

            if (!isValid && !didWarnAboutInvalidateContextType.has(type)) {
              didWarnAboutInvalidateContextType.add(type);
              var addendum = '';
              if (contextType === undefined) {
                addendum = ' However, it is set to undefined. ' + 'This can be caused by a typo or by mixing up named and default imports. ' + 'This can also happen due to a circular dependency, so ' + 'try moving the createContext() call to a separate file.';
              } else if (typeof contextType !== 'object') {
                addendum = ' However, it is set to a ' + typeof contextType + '.';
              } else if (contextType.$$typeof === REACT_PROVIDER_TYPE) {
                addendum = ' Did you accidentally pass the Context.Provider instead?';
              } else if (contextType._context !== undefined) {
                // <Context.Consumer>
                addendum = ' Did you accidentally pass the Context.Consumer instead?';
              } else {
                addendum = ' However, it is set to an object with keys {' + Object.keys(contextType).join(', ') + '}.';
              }
              warningWithoutStack$1(false, '%s defines an invalid contextType. ' + 'contextType should point to the Context object returned by React.createContext().%s', getComponentName(type) || 'Component', addendum);
            }
          }
        }
        if (typeof contextType === 'object' && contextType !== null) {
          validateContextBounds(contextType, threadID);
          return contextType[threadID];
        }
        if (disableLegacyContext) {
          {
            if (type.contextTypes) {
              warningWithoutStack$1(false, '%s uses the legacy contextTypes API which is no longer supported. ' + 'Use React.createContext() with static contextType instead.', getComponentName(type) || 'Unknown');
            }
          }
          return emptyObject;
        } else {
          var maskedContext = maskContext(type, context);
          {
            if (type.contextTypes) {
              checkContextTypes(type.contextTypes, maskedContext, 'context');
            }
          }
          return maskedContext;
        }
      } else {
        if (disableLegacyContext) {
          {
            if (type.contextTypes) {
              warningWithoutStack$1(false, '%s uses the legacy contextTypes API which is no longer supported. ' + 'Use React.createContext() with React.useContext() instead.', getComponentName(type) || 'Unknown');
            }
          }
          return undefined;
        } else {
          var _maskedContext = maskContext(type, context);
          {
            if (type.contextTypes) {
              checkContextTypes(type.contextTypes, _maskedContext, 'context');
            }
          }
          return _maskedContext;
        }
      }
    }

    // Allocates a new index for each request. Tries to stay as compact as possible so that these
    // indices can be used to reference a tightly packed array. As opposed to being used in a Map.
    // The first allocated index is 1.
    var nextAvailableThreadIDs = new Uint16Array(16);
    for (var i = 0; i < 15; i++) {
      nextAvailableThreadIDs[i] = i + 1;
    }
    nextAvailableThreadIDs[15] = 0;
    function growThreadCountAndReturnNextAvailable() {
      var oldArray = nextAvailableThreadIDs;
      var oldSize = oldArray.length;
      var newSize = oldSize * 2;
      (function () {
        if (!(newSize <= 0x10000)) {
          {
            throw ReactError(Error("Maximum number of concurrent React renderers exceeded. This can happen if you are not properly destroying the Readable provided by React. Ensure that you call .destroy() on it if you no longer want to read from it, and did not read to the end. If you use .pipe() this should be automatic."));
          }
        }
      })();
      var newArray = new Uint16Array(newSize);
      newArray.set(oldArray);
      nextAvailableThreadIDs = newArray;
      nextAvailableThreadIDs[0] = oldSize + 1;
      for (var _i = oldSize; _i < newSize - 1; _i++) {
        nextAvailableThreadIDs[_i] = _i + 1;
      }
      nextAvailableThreadIDs[newSize - 1] = 0;
      return oldSize;
    }
    function allocThreadID() {
      var nextID = nextAvailableThreadIDs[0];
      if (nextID === 0) {
        return growThreadCountAndReturnNextAvailable();
      }
      nextAvailableThreadIDs[0] = nextAvailableThreadIDs[nextID];
      return nextID;
    }
    function freeThreadID(id) {
      nextAvailableThreadIDs[id] = nextAvailableThreadIDs[0];
      nextAvailableThreadIDs[0] = id;
    }

    // A reserved attribute.
    // It is handled by React separately and shouldn't be written to the DOM.
    var RESERVED = 0; // A simple string attribute.
    // Attributes that aren't in the whitelist are presumed to have this type.

    var STRING = 1; // A string attribute that accepts booleans in React. In HTML, these are called
    // "enumerated" attributes with "true" and "false" as possible values.
    // When true, it should be set to a "true" string.
    // When false, it should be set to a "false" string.

    var BOOLEANISH_STRING = 2; // A real boolean attribute.
    // When true, it should be present (set either to an empty string or its name).
    // When false, it should be omitted.

    var BOOLEAN = 3; // An attribute that can be used as a flag as well as with a value.
    // When true, it should be present (set either to an empty string or its name).
    // When false, it should be omitted.
    // For any other value, should be present with that value.

    var OVERLOADED_BOOLEAN = 4; // An attribute that must be numeric or parse as a numeric.
    // When falsy, it should be removed.

    var NUMERIC = 5; // An attribute that must be positive numeric or parse as a positive numeric.
    // When falsy, it should be removed.

    var POSITIVE_NUMERIC = 6;

    /* eslint-disable max-len */
    var ATTRIBUTE_NAME_START_CHAR = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
    /* eslint-enable max-len */

    var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
    var ROOT_ATTRIBUTE_NAME = 'data-reactroot';
    var VALID_ATTRIBUTE_NAME_REGEX = new RegExp('^[' + ATTRIBUTE_NAME_START_CHAR + '][' + ATTRIBUTE_NAME_CHAR + ']*$');
    var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
    var illegalAttributeNameCache = {};
    var validatedAttributeNameCache = {};
    function isAttributeNameSafe(attributeName) {
      if (hasOwnProperty$1.call(validatedAttributeNameCache, attributeName)) {
        return true;
      }
      if (hasOwnProperty$1.call(illegalAttributeNameCache, attributeName)) {
        return false;
      }
      if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
        validatedAttributeNameCache[attributeName] = true;
        return true;
      }
      illegalAttributeNameCache[attributeName] = true;
      {
        warning$1(false, 'Invalid attribute name: `%s`', attributeName);
      }
      return false;
    }
    function shouldIgnoreAttribute(name, propertyInfo, isCustomComponentTag) {
      if (propertyInfo !== null) {
        return propertyInfo.type === RESERVED;
      }
      if (isCustomComponentTag) {
        return false;
      }
      if (name.length > 2 && (name[0] === 'o' || name[0] === 'O') && (name[1] === 'n' || name[1] === 'N')) {
        return true;
      }
      return false;
    }
    function shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag) {
      if (propertyInfo !== null && propertyInfo.type === RESERVED) {
        return false;
      }
      switch (typeof value) {
        case 'function': // $FlowIssue symbol is perfectly valid here

        case 'symbol':
          // eslint-disable-line
          return true;
        case 'boolean':
          {
            if (isCustomComponentTag) {
              return false;
            }
            if (propertyInfo !== null) {
              return !propertyInfo.acceptsBooleans;
            } else {
              var prefix = name.toLowerCase().slice(0, 5);
              return prefix !== 'data-' && prefix !== 'aria-';
            }
          }
        default:
          return false;
      }
    }
    function shouldRemoveAttribute(name, value, propertyInfo, isCustomComponentTag) {
      if (value === null || typeof value === 'undefined') {
        return true;
      }
      if (shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag)) {
        return true;
      }
      if (isCustomComponentTag) {
        return false;
      }
      if (propertyInfo !== null) {
        switch (propertyInfo.type) {
          case BOOLEAN:
            return !value;
          case OVERLOADED_BOOLEAN:
            return value === false;
          case NUMERIC:
            return isNaN(value);
          case POSITIVE_NUMERIC:
            return isNaN(value) || value < 1;
        }
      }
      return false;
    }
    function getPropertyInfo(name) {
      return properties.hasOwnProperty(name) ? properties[name] : null;
    }
    function PropertyInfoRecord(name, type, mustUseProperty, attributeName, attributeNamespace, sanitizeURL) {
      this.acceptsBooleans = type === BOOLEANISH_STRING || type === BOOLEAN || type === OVERLOADED_BOOLEAN;
      this.attributeName = attributeName;
      this.attributeNamespace = attributeNamespace;
      this.mustUseProperty = mustUseProperty;
      this.propertyName = name;
      this.type = type;
      this.sanitizeURL = sanitizeURL;
    } // When adding attributes to this list, be sure to also add them to
    // the `possibleStandardNames` module to ensure casing and incorrect
    // name warnings.

    var properties = {}; // These props are reserved by React. They shouldn't be written to the DOM.

    ['children', 'dangerouslySetInnerHTML',
    // TODO: This prevents the assignment of defaultValue to regular
    // elements (not just inputs). Now that ReactDOMInput assigns to the
    // defaultValue property -- do we need this?
    'defaultValue', 'defaultChecked', 'innerHTML', 'suppressContentEditableWarning', 'suppressHydrationWarning', 'style'].forEach(function (name) {
      properties[name] = new PropertyInfoRecord(name, RESERVED, false,
      // mustUseProperty
      name,
      // attributeName
      null,
      // attributeNamespace
      false);
    }); // A few React string attributes have a different name.
    // This is a mapping from React prop names to the attribute names.

    [['acceptCharset', 'accept-charset'], ['className', 'class'], ['htmlFor', 'for'], ['httpEquiv', 'http-equiv']].forEach(function (_ref) {
      var name = _ref[0],
        attributeName = _ref[1];
      properties[name] = new PropertyInfoRecord(name, STRING, false,
      // mustUseProperty
      attributeName,
      // attributeName
      null,
      // attributeNamespace
      false);
    }); // These are "enumerated" HTML attributes that accept "true" and "false".
    // In React, we let users pass `true` and `false` even though technically
    // these aren't boolean attributes (they are coerced to strings).

    ['contentEditable', 'draggable', 'spellCheck', 'value'].forEach(function (name) {
      properties[name] = new PropertyInfoRecord(name, BOOLEANISH_STRING, false,
      // mustUseProperty
      name.toLowerCase(),
      // attributeName
      null,
      // attributeNamespace
      false);
    }); // These are "enumerated" SVG attributes that accept "true" and "false".
    // In React, we let users pass `true` and `false` even though technically
    // these aren't boolean attributes (they are coerced to strings).
    // Since these are SVG attributes, their attribute names are case-sensitive.

    ['autoReverse', 'externalResourcesRequired', 'focusable', 'preserveAlpha'].forEach(function (name) {
      properties[name] = new PropertyInfoRecord(name, BOOLEANISH_STRING, false,
      // mustUseProperty
      name,
      // attributeName
      null,
      // attributeNamespace
      false);
    }); // These are HTML boolean attributes.

    ['allowFullScreen', 'async',
    // Note: there is a special case that prevents it from being written to the DOM
    // on the client side because the browsers are inconsistent. Instead we call focus().
    'autoFocus', 'autoPlay', 'controls', 'default', 'defer', 'disabled', 'disablePictureInPicture', 'formNoValidate', 'hidden', 'loop', 'noModule', 'noValidate', 'open', 'playsInline', 'readOnly', 'required', 'reversed', 'scoped', 'seamless',
    // Microdata
    'itemScope'].forEach(function (name) {
      properties[name] = new PropertyInfoRecord(name, BOOLEAN, false,
      // mustUseProperty
      name.toLowerCase(),
      // attributeName
      null,
      // attributeNamespace
      false);
    }); // These are the few React props that we set as DOM properties
    // rather than attributes. These are all booleans.

    ['checked',
    // Note: `option.selected` is not updated if `select.multiple` is
    // disabled with `removeAttribute`. We have special logic for handling this.
    'multiple', 'muted', 'selected'].forEach(function (name) {
      properties[name] = new PropertyInfoRecord(name, BOOLEAN, true,
      // mustUseProperty
      name,
      // attributeName
      null,
      // attributeNamespace
      false);
    }); // These are HTML attributes that are "overloaded booleans": they behave like
    // booleans, but can also accept a string value.

    ['capture', 'download'].forEach(function (name) {
      properties[name] = new PropertyInfoRecord(name, OVERLOADED_BOOLEAN, false,
      // mustUseProperty
      name,
      // attributeName
      null,
      // attributeNamespace
      false);
    }); // These are HTML attributes that must be positive numbers.

    ['cols', 'rows', 'size', 'span'].forEach(function (name) {
      properties[name] = new PropertyInfoRecord(name, POSITIVE_NUMERIC, false,
      // mustUseProperty
      name,
      // attributeName
      null,
      // attributeNamespace
      false);
    }); // These are HTML attributes that must be numbers.

    ['rowSpan', 'start'].forEach(function (name) {
      properties[name] = new PropertyInfoRecord(name, NUMERIC, false,
      // mustUseProperty
      name.toLowerCase(),
      // attributeName
      null,
      // attributeNamespace
      false);
    });
    var CAMELIZE = /[\-\:]([a-z])/g;
    var capitalize = function (token) {
      return token[1].toUpperCase();
    }; // This is a list of all SVG attributes that need special casing, namespacing,
    // or boolean value assignment. Regular attributes that just accept strings
    // and have the same names are omitted, just like in the HTML whitelist.
    // Some of these attributes can be hard to find. This list was created by
    // scrapping the MDN documentation.

    ['accent-height', 'alignment-baseline', 'arabic-form', 'baseline-shift', 'cap-height', 'clip-path', 'clip-rule', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'dominant-baseline', 'enable-background', 'fill-opacity', 'fill-rule', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'glyph-name', 'glyph-orientation-horizontal', 'glyph-orientation-vertical', 'horiz-adv-x', 'horiz-origin-x', 'image-rendering', 'letter-spacing', 'lighting-color', 'marker-end', 'marker-mid', 'marker-start', 'overline-position', 'overline-thickness', 'paint-order', 'panose-1', 'pointer-events', 'rendering-intent', 'shape-rendering', 'stop-color', 'stop-opacity', 'strikethrough-position', 'strikethrough-thickness', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'text-anchor', 'text-decoration', 'text-rendering', 'underline-position', 'underline-thickness', 'unicode-bidi', 'unicode-range', 'units-per-em', 'v-alphabetic', 'v-hanging', 'v-ideographic', 'v-mathematical', 'vector-effect', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'word-spacing', 'writing-mode', 'xmlns:xlink', 'x-height'].forEach(function (attributeName) {
      var name = attributeName.replace(CAMELIZE, capitalize);
      properties[name] = new PropertyInfoRecord(name, STRING, false,
      // mustUseProperty
      attributeName, null,
      // attributeNamespace
      false);
    }); // String SVG attributes with the xlink namespace.

    ['xlink:actuate', 'xlink:arcrole', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type'].forEach(function (attributeName) {
      var name = attributeName.replace(CAMELIZE, capitalize);
      properties[name] = new PropertyInfoRecord(name, STRING, false,
      // mustUseProperty
      attributeName, 'http://www.w3.org/1999/xlink', false);
    }); // String SVG attributes with the xml namespace.

    ['xml:base', 'xml:lang', 'xml:space'].forEach(function (attributeName) {
      var name = attributeName.replace(CAMELIZE, capitalize);
      properties[name] = new PropertyInfoRecord(name, STRING, false,
      // mustUseProperty
      attributeName, 'http://www.w3.org/XML/1998/namespace', false);
    }); // These attribute exists both in HTML and SVG.
    // The attribute name is case-sensitive in SVG so we can't just use
    // the React name like we do for attributes that exist only in HTML.

    ['tabIndex', 'crossOrigin'].forEach(function (attributeName) {
      properties[attributeName] = new PropertyInfoRecord(attributeName, STRING, false,
      // mustUseProperty
      attributeName.toLowerCase(),
      // attributeName
      null,
      // attributeNamespace
      false);
    }); // These attributes accept URLs. These must not allow javascript: URLS.
    // These will also need to accept Trusted Types object in the future.

    var xlinkHref = 'xlinkHref';
    properties[xlinkHref] = new PropertyInfoRecord('xlinkHref', STRING, false,
    // mustUseProperty
    'xlink:href', 'http://www.w3.org/1999/xlink', true);
    ['src', 'href', 'action', 'formAction'].forEach(function (attributeName) {
      properties[attributeName] = new PropertyInfoRecord(attributeName, STRING, false,
      // mustUseProperty
      attributeName.toLowerCase(),
      // attributeName
      null,
      // attributeNamespace
      true);
    });
    var ReactDebugCurrentFrame$2 = null;
    {
      ReactDebugCurrentFrame$2 = ReactSharedInternals.ReactDebugCurrentFrame;
    } // A javascript: URL can contain leading C0 control or \u0020 SPACE,
    // and any newline or tab are filtered out as if they're not part of the URL.
    // https://url.spec.whatwg.org/#url-parsing
    // Tab or newline are defined as \r\n\t:
    // https://infra.spec.whatwg.org/#ascii-tab-or-newline
    // A C0 control is a code point in the range \u0000 NULL to \u001F
    // INFORMATION SEPARATOR ONE, inclusive:
    // https://infra.spec.whatwg.org/#c0-control-or-space

    /* eslint-disable max-len */

    var isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i;
    var didWarn = false;
    function sanitizeURL(url) {
      if (disableJavaScriptURLs) {
        (function () {
          if (!!isJavaScriptProtocol.test(url)) {
            {
              throw ReactError(Error("React has blocked a javascript: URL as a security precaution." + ReactDebugCurrentFrame$2.getStackAddendum()));
            }
          }
        })();
      } else if ( true && !didWarn && isJavaScriptProtocol.test(url)) {
        didWarn = true;
        warning$1(false, 'A future version of React will block javascript: URLs as a security precaution. ' + 'Use event handlers instead if you can. If you need to generate unsafe HTML try ' + 'using dangerouslySetInnerHTML instead. React was passed %s.', JSON.stringify(url));
      }
    }

    // code copied and modified from escape-html

    /**
     * Module variables.
     * @private
     */
    var matchHtmlRegExp = /["'&<>]/;
    /**
     * Escapes special characters and HTML entities in a given html string.
     *
     * @param  {string} string HTML string to escape for later insertion
     * @return {string}
     * @public
     */

    function escapeHtml(string) {
      var str = '' + string;
      var match = matchHtmlRegExp.exec(str);
      if (!match) {
        return str;
      }
      var escape;
      var html = '';
      var index;
      var lastIndex = 0;
      for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
          case 34:
            // "
            escape = '&quot;';
            break;
          case 38:
            // &
            escape = '&amp;';
            break;
          case 39:
            // '
            escape = '&#x27;'; // modified from escape-html; used to be '&#39'

            break;
          case 60:
            // <
            escape = '&lt;';
            break;
          case 62:
            // >
            escape = '&gt;';
            break;
          default:
            continue;
        }
        if (lastIndex !== index) {
          html += str.substring(lastIndex, index);
        }
        lastIndex = index + 1;
        html += escape;
      }
      return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
    } // end code copied and modified from escape-html

    /**
     * Escapes text to prevent scripting attacks.
     *
     * @param {*} text Text value to escape.
     * @return {string} An escaped string.
     */

    function escapeTextForBrowser(text) {
      if (typeof text === 'boolean' || typeof text === 'number') {
        // this shortcircuit helps perf for types that we know will never have
        // special characters, especially given that this function is used often
        // for numeric dom ids.
        return '' + text;
      }
      return escapeHtml(text);
    }

    /**
     * Escapes attribute value to prevent scripting attacks.
     *
     * @param {*} value Value to escape.
     * @return {string} An escaped string.
     */

    function quoteAttributeValueForBrowser(value) {
      return '"' + escapeTextForBrowser(value) + '"';
    }

    /**
     * Operations for dealing with DOM properties.
     */

    /**
     * Creates markup for the ID property.
     *
     * @param {string} id Unescaped ID.
     * @return {string} Markup string.
     */

    function createMarkupForRoot() {
      return ROOT_ATTRIBUTE_NAME + '=""';
    }
    /**
     * Creates markup for a property.
     *
     * @param {string} name
     * @param {*} value
     * @return {?string} Markup string, or null if the property was invalid.
     */

    function createMarkupForProperty(name, value) {
      var propertyInfo = getPropertyInfo(name);
      if (name !== 'style' && shouldIgnoreAttribute(name, propertyInfo, false)) {
        return '';
      }
      if (shouldRemoveAttribute(name, value, propertyInfo, false)) {
        return '';
      }
      if (propertyInfo !== null) {
        var attributeName = propertyInfo.attributeName;
        var type = propertyInfo.type;
        if (type === BOOLEAN || type === OVERLOADED_BOOLEAN && value === true) {
          return attributeName + '=""';
        } else {
          if (propertyInfo.sanitizeURL) {
            value = '' + value;
            sanitizeURL(value);
          }
          return attributeName + '=' + quoteAttributeValueForBrowser(value);
        }
      } else if (isAttributeNameSafe(name)) {
        return name + '=' + quoteAttributeValueForBrowser(value);
      }
      return '';
    }
    /**
     * Creates markup for a custom property.
     *
     * @param {string} name
     * @param {*} value
     * @return {string} Markup string, or empty string if the property was invalid.
     */

    function createMarkupForCustomAttribute(name, value) {
      if (!isAttributeNameSafe(name) || value == null) {
        return '';
      }
      return name + '=' + quoteAttributeValueForBrowser(value);
    }

    /**
     * inlined Object.is polyfill to avoid requiring consumers ship their own
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
     */
    function is(x, y) {
      return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y // eslint-disable-line no-self-compare
      ;
    }
    var is$1 = typeof Object.is === 'function' ? Object.is : is;
    var currentlyRenderingComponent = null;
    var firstWorkInProgressHook = null;
    var workInProgressHook = null; // Whether the work-in-progress hook is a re-rendered hook

    var isReRender = false; // Whether an update was scheduled during the currently executing render pass.

    var didScheduleRenderPhaseUpdate = false; // Lazily created map of render-phase updates

    var renderPhaseUpdates = null; // Counter to prevent infinite loops.

    var numberOfReRenders = 0;
    var RE_RENDER_LIMIT = 25;
    var isInHookUserCodeInDev = false; // In DEV, this is the name of the currently executing primitive hook

    var currentHookNameInDev;
    function resolveCurrentlyRenderingComponent() {
      (function () {
        if (!(currentlyRenderingComponent !== null)) {
          {
            throw ReactError(Error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem."));
          }
        }
      })();
      {
        !!isInHookUserCodeInDev ? warning$1(false, 'Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. ' + 'You can only call Hooks at the top level of your React function. ' + 'For more information, see ' + 'https://fb.me/rules-of-hooks') : void 0;
      }
      return currentlyRenderingComponent;
    }
    function areHookInputsEqual(nextDeps, prevDeps) {
      if (prevDeps === null) {
        {
          warning$1(false, '%s received a final argument during this render, but not during ' + 'the previous render. Even though the final argument is optional, ' + 'its type cannot change between renders.', currentHookNameInDev);
        }
        return false;
      }
      {
        // Don't bother comparing lengths in prod because these arrays should be
        // passed inline.
        if (nextDeps.length !== prevDeps.length) {
          warning$1(false, 'The final argument passed to %s changed size between renders. The ' + 'order and size of this array must remain constant.\n\n' + 'Previous: %s\n' + 'Incoming: %s', currentHookNameInDev, "[" + nextDeps.join(', ') + "]", "[" + prevDeps.join(', ') + "]");
        }
      }
      for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
        if (is$1(nextDeps[i], prevDeps[i])) {
          continue;
        }
        return false;
      }
      return true;
    }
    function createHook() {
      if (numberOfReRenders > 0) {
        (function () {
          {
            {
              throw ReactError(Error("Rendered more hooks than during the previous render"));
            }
          }
        })();
      }
      return {
        memoizedState: null,
        queue: null,
        next: null
      };
    }
    function createWorkInProgressHook() {
      if (workInProgressHook === null) {
        // This is the first hook in the list
        if (firstWorkInProgressHook === null) {
          isReRender = false;
          firstWorkInProgressHook = workInProgressHook = createHook();
        } else {
          // There's already a work-in-progress. Reuse it.
          isReRender = true;
          workInProgressHook = firstWorkInProgressHook;
        }
      } else {
        if (workInProgressHook.next === null) {
          isReRender = false; // Append to the end of the list

          workInProgressHook = workInProgressHook.next = createHook();
        } else {
          // There's already a work-in-progress. Reuse it.
          isReRender = true;
          workInProgressHook = workInProgressHook.next;
        }
      }
      return workInProgressHook;
    }
    function prepareToUseHooks(componentIdentity) {
      currentlyRenderingComponent = componentIdentity;
      {
        isInHookUserCodeInDev = false;
      } // The following should have already been reset
      // didScheduleRenderPhaseUpdate = false;
      // firstWorkInProgressHook = null;
      // numberOfReRenders = 0;
      // renderPhaseUpdates = null;
      // workInProgressHook = null;
    }
    function finishHooks(Component, props, children, refOrContext) {
      // This must be called after every function component to prevent hooks from
      // being used in classes.
      while (didScheduleRenderPhaseUpdate) {
        // Updates were scheduled during the render phase. They are stored in
        // the `renderPhaseUpdates` map. Call the component again, reusing the
        // work-in-progress hooks and applying the additional updates on top. Keep
        // restarting until no more updates are scheduled.
        didScheduleRenderPhaseUpdate = false;
        numberOfReRenders += 1; // Start over from the beginning of the list

        workInProgressHook = null;
        children = Component(props, refOrContext);
      }
      currentlyRenderingComponent = null;
      firstWorkInProgressHook = null;
      numberOfReRenders = 0;
      renderPhaseUpdates = null;
      workInProgressHook = null;
      {
        isInHookUserCodeInDev = false;
      } // These were reset above
      // currentlyRenderingComponent = null;
      // didScheduleRenderPhaseUpdate = false;
      // firstWorkInProgressHook = null;
      // numberOfReRenders = 0;
      // renderPhaseUpdates = null;
      // workInProgressHook = null;

      return children;
    }
    function readContext(context, observedBits) {
      var threadID = currentThreadID;
      validateContextBounds(context, threadID);
      {
        !!isInHookUserCodeInDev ? warning$1(false, 'Context can only be read while React is rendering. ' + 'In classes, you can read it in the render method or getDerivedStateFromProps. ' + 'In function components, you can read it directly in the function body, but not ' + 'inside Hooks like useReducer() or useMemo().') : void 0;
      }
      return context[threadID];
    }
    function useContext(context, observedBits) {
      {
        currentHookNameInDev = 'useContext';
      }
      resolveCurrentlyRenderingComponent();
      var threadID = currentThreadID;
      validateContextBounds(context, threadID);
      return context[threadID];
    }
    function basicStateReducer(state, action) {
      return typeof action === 'function' ? action(state) : action;
    }
    function useState(initialState) {
      {
        currentHookNameInDev = 'useState';
      }
      return useReducer(basicStateReducer,
      // useReducer has a special case to support lazy useState initializers
      initialState);
    }
    function useReducer(reducer, initialArg, init) {
      {
        if (reducer !== basicStateReducer) {
          currentHookNameInDev = 'useReducer';
        }
      }
      currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
      workInProgressHook = createWorkInProgressHook();
      if (isReRender) {
        // This is a re-render. Apply the new render phase updates to the previous
        // current hook.
        var queue = workInProgressHook.queue;
        var dispatch = queue.dispatch;
        if (renderPhaseUpdates !== null) {
          // Render phase updates are stored in a map of queue -> linked list
          var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
          if (firstRenderPhaseUpdate !== undefined) {
            renderPhaseUpdates.delete(queue);
            var newState = workInProgressHook.memoizedState;
            var update = firstRenderPhaseUpdate;
            do {
              // Process this render phase update. We don't have to check the
              // priority because it will always be the same as the current
              // render's.
              var action = update.action;
              {
                isInHookUserCodeInDev = true;
              }
              newState = reducer(newState, action);
              {
                isInHookUserCodeInDev = false;
              }
              update = update.next;
            } while (update !== null);
            workInProgressHook.memoizedState = newState;
            return [newState, dispatch];
          }
        }
        return [workInProgressHook.memoizedState, dispatch];
      } else {
        {
          isInHookUserCodeInDev = true;
        }
        var initialState;
        if (reducer === basicStateReducer) {
          // Special case for `useState`.
          initialState = typeof initialArg === 'function' ? initialArg() : initialArg;
        } else {
          initialState = init !== undefined ? init(initialArg) : initialArg;
        }
        {
          isInHookUserCodeInDev = false;
        }
        workInProgressHook.memoizedState = initialState;
        var _queue = workInProgressHook.queue = {
          last: null,
          dispatch: null
        };
        var _dispatch = _queue.dispatch = dispatchAction.bind(null, currentlyRenderingComponent, _queue);
        return [workInProgressHook.memoizedState, _dispatch];
      }
    }
    function useMemo(nextCreate, deps) {
      currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
      workInProgressHook = createWorkInProgressHook();
      var nextDeps = deps === undefined ? null : deps;
      if (workInProgressHook !== null) {
        var prevState = workInProgressHook.memoizedState;
        if (prevState !== null) {
          if (nextDeps !== null) {
            var prevDeps = prevState[1];
            if (areHookInputsEqual(nextDeps, prevDeps)) {
              return prevState[0];
            }
          }
        }
      }
      {
        isInHookUserCodeInDev = true;
      }
      var nextValue = nextCreate();
      {
        isInHookUserCodeInDev = false;
      }
      workInProgressHook.memoizedState = [nextValue, nextDeps];
      return nextValue;
    }
    function useRef(initialValue) {
      currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
      workInProgressHook = createWorkInProgressHook();
      var previousRef = workInProgressHook.memoizedState;
      if (previousRef === null) {
        var ref = {
          current: initialValue
        };
        {
          Object.seal(ref);
        }
        workInProgressHook.memoizedState = ref;
        return ref;
      } else {
        return previousRef;
      }
    }
    function useLayoutEffect(create, inputs) {
      {
        currentHookNameInDev = 'useLayoutEffect';
      }
      warning$1(false, 'useLayoutEffect does nothing on the server, because its effect cannot ' + "be encoded into the server renderer's output format. This will lead " + 'to a mismatch between the initial, non-hydrated UI and the intended ' + 'UI. To avoid this, useLayoutEffect should only be used in ' + 'components that render exclusively on the client. ' + 'See https://fb.me/react-uselayouteffect-ssr for common fixes.');
    }
    function dispatchAction(componentIdentity, queue, action) {
      (function () {
        if (!(numberOfReRenders < RE_RENDER_LIMIT)) {
          {
            throw ReactError(Error("Too many re-renders. React limits the number of renders to prevent an infinite loop."));
          }
        }
      })();
      if (componentIdentity === currentlyRenderingComponent) {
        // This is a render phase update. Stash it in a lazily-created map of
        // queue -> linked list of updates. After this render pass, we'll restart
        // and apply the stashed updates on top of the work-in-progress hook.
        didScheduleRenderPhaseUpdate = true;
        var update = {
          action: action,
          next: null
        };
        if (renderPhaseUpdates === null) {
          renderPhaseUpdates = new Map();
        }
        var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
        if (firstRenderPhaseUpdate === undefined) {
          renderPhaseUpdates.set(queue, update);
        } else {
          // Append the update to the end of the list.
          var lastRenderPhaseUpdate = firstRenderPhaseUpdate;
          while (lastRenderPhaseUpdate.next !== null) {
            lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
          }
          lastRenderPhaseUpdate.next = update;
        }
      } else {// This means an update has happened after the function component has
        // returned. On the server this is a no-op. In React Fiber, the update
        // would be scheduled for a future render.
      }
    }
    function useCallback(callback, deps) {
      // Callbacks are passed as they are in the server environment.
      return callback;
    }
    function useResponder(responder, props) {
      return {
        props: props,
        responder: responder
      };
    }
    function noop() {}
    var currentThreadID = 0;
    function setCurrentThreadID(threadID) {
      currentThreadID = threadID;
    }
    var Dispatcher = {
      readContext: readContext,
      useContext: useContext,
      useMemo: useMemo,
      useReducer: useReducer,
      useRef: useRef,
      useState: useState,
      useLayoutEffect: useLayoutEffect,
      useCallback: useCallback,
      // useImperativeHandle is not run in the server environment
      useImperativeHandle: noop,
      // Effects are not run in the server environment.
      useEffect: noop,
      // Debugging effect
      useDebugValue: noop,
      useResponder: useResponder
    };
    var HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
    var MATH_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
    var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    var Namespaces = {
      html: HTML_NAMESPACE,
      mathml: MATH_NAMESPACE,
      svg: SVG_NAMESPACE
    }; // Assumes there is no parent namespace.

    function getIntrinsicNamespace(type) {
      switch (type) {
        case 'svg':
          return SVG_NAMESPACE;
        case 'math':
          return MATH_NAMESPACE;
        default:
          return HTML_NAMESPACE;
      }
    }
    function getChildNamespace(parentNamespace, type) {
      if (parentNamespace == null || parentNamespace === HTML_NAMESPACE) {
        // No (or default) parent namespace: potential entry point.
        return getIntrinsicNamespace(type);
      }
      if (parentNamespace === SVG_NAMESPACE && type === 'foreignObject') {
        // We're leaving SVG.
        return HTML_NAMESPACE;
      } // By default, pass namespace below.

      return parentNamespace;
    }
    var ReactDebugCurrentFrame$3 = null;
    var ReactControlledValuePropTypes = {
      checkPropTypes: null
    };
    {
      ReactDebugCurrentFrame$3 = ReactSharedInternals.ReactDebugCurrentFrame;
      var hasReadOnlyValue = {
        button: true,
        checkbox: true,
        image: true,
        hidden: true,
        radio: true,
        reset: true,
        submit: true
      };
      var propTypes = {
        value: function (props, propName, componentName) {
          if (hasReadOnlyValue[props.type] || props.onChange || props.readOnly || props.disabled || props[propName] == null || enableFlareAPI && props.listeners) {
            return null;
          }
          return new Error('You provided a `value` prop to a form field without an ' + '`onChange` handler. This will render a read-only field. If ' + 'the field should be mutable use `defaultValue`. Otherwise, ' + 'set either `onChange` or `readOnly`.');
        },
        checked: function (props, propName, componentName) {
          if (props.onChange || props.readOnly || props.disabled || props[propName] == null || enableFlareAPI && props.listeners) {
            return null;
          }
          return new Error('You provided a `checked` prop to a form field without an ' + '`onChange` handler. This will render a read-only field. If ' + 'the field should be mutable use `defaultChecked`. Otherwise, ' + 'set either `onChange` or `readOnly`.');
        }
      };
      /**
       * Provide a linked `value` attribute for controlled forms. You should not use
       * this outside of the ReactDOM controlled form components.
       */

      ReactControlledValuePropTypes.checkPropTypes = function (tagName, props) {
        checkPropTypes(propTypes, props, 'prop', tagName, ReactDebugCurrentFrame$3.getStackAddendum);
      };
    }

    // For HTML, certain tags should omit their close tag. We keep a whitelist for
    // those special-case tags.
    var omittedCloseTags = {
      area: true,
      base: true,
      br: true,
      col: true,
      embed: true,
      hr: true,
      img: true,
      input: true,
      keygen: true,
      link: true,
      meta: true,
      param: true,
      source: true,
      track: true,
      wbr: true // NOTE: menuitem's close tag should be omitted, but that causes problems.
    };

    // `omittedCloseTags` except that `menuitem` should still have its closing tag.

    var voidElementTags = _assign({
      menuitem: true
    }, omittedCloseTags);

    // or add stack by default to invariants where possible.

    var HTML = '__html';
    var ReactDebugCurrentFrame$4 = null;
    {
      ReactDebugCurrentFrame$4 = ReactSharedInternals.ReactDebugCurrentFrame;
    }
    function assertValidProps(tag, props) {
      if (!props) {
        return;
      } // Note the use of `==` which checks for null or undefined.

      if (voidElementTags[tag]) {
        (function () {
          if (!(props.children == null && props.dangerouslySetInnerHTML == null)) {
            {
              throw ReactError(Error(tag + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`." + ReactDebugCurrentFrame$4.getStackAddendum()));
            }
          }
        })();
      }
      if (props.dangerouslySetInnerHTML != null) {
        (function () {
          if (!(props.children == null)) {
            {
              throw ReactError(Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`."));
            }
          }
        })();
        (function () {
          if (!(typeof props.dangerouslySetInnerHTML === 'object' && HTML in props.dangerouslySetInnerHTML)) {
            {
              throw ReactError(Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://fb.me/react-invariant-dangerously-set-inner-html for more information."));
            }
          }
        })();
      }
      {
        !(props.suppressContentEditableWarning || !props.contentEditable || props.children == null) ? warning$1(false, 'A component is `contentEditable` and contains `children` managed by ' + 'React. It is now your responsibility to guarantee that none of ' + 'those nodes are unexpectedly modified or duplicated. This is ' + 'probably not intentional.') : void 0;
      }
      (function () {
        if (!(props.style == null || typeof props.style === 'object')) {
          {
            throw ReactError(Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX." + ReactDebugCurrentFrame$4.getStackAddendum()));
          }
        }
      })();
    }

    /**
     * CSS properties which accept numbers but are not in units of "px".
     */
    var isUnitlessNumber = {
      animationIterationCount: true,
      borderImageOutset: true,
      borderImageSlice: true,
      borderImageWidth: true,
      boxFlex: true,
      boxFlexGroup: true,
      boxOrdinalGroup: true,
      columnCount: true,
      columns: true,
      flex: true,
      flexGrow: true,
      flexPositive: true,
      flexShrink: true,
      flexNegative: true,
      flexOrder: true,
      gridArea: true,
      gridRow: true,
      gridRowEnd: true,
      gridRowSpan: true,
      gridRowStart: true,
      gridColumn: true,
      gridColumnEnd: true,
      gridColumnSpan: true,
      gridColumnStart: true,
      fontWeight: true,
      lineClamp: true,
      lineHeight: true,
      opacity: true,
      order: true,
      orphans: true,
      tabSize: true,
      widows: true,
      zIndex: true,
      zoom: true,
      // SVG-related properties
      fillOpacity: true,
      floodOpacity: true,
      stopOpacity: true,
      strokeDasharray: true,
      strokeDashoffset: true,
      strokeMiterlimit: true,
      strokeOpacity: true,
      strokeWidth: true
    };
    /**
     * @param {string} prefix vendor-specific prefix, eg: Webkit
     * @param {string} key style name, eg: transitionDuration
     * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
     * WebkitTransitionDuration
     */

    function prefixKey(prefix, key) {
      return prefix + key.charAt(0).toUpperCase() + key.substring(1);
    }
    /**
     * Support style names that may come passed in prefixed by adding permutations
     * of vendor prefixes.
     */

    var prefixes = ['Webkit', 'ms', 'Moz', 'O']; // Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
    // infinite loop, because it iterates over the newly added props too.

    Object.keys(isUnitlessNumber).forEach(function (prop) {
      prefixes.forEach(function (prefix) {
        isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
      });
    });

    /**
     * Convert a value into the proper css writable value. The style name `name`
     * should be logical (no hyphens), as specified
     * in `CSSProperty.isUnitlessNumber`.
     *
     * @param {string} name CSS property name such as `topMargin`.
     * @param {*} value CSS property value such as `10px`.
     * @return {string} Normalized style value with dimensions applied.
     */

    function dangerousStyleValue(name, value, isCustomProperty) {
      // Note that we've removed escapeTextForBrowser() calls here since the
      // whole string will be escaped when the attribute is injected into
      // the markup. If you provide unsafe user data here they can inject
      // arbitrary CSS which may be problematic (I couldn't repro this):
      // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
      // http://www.thespanner.co.uk/2007/11/26/ultimate-xss-css-injection/
      // This is not an XSS hole but instead a potential CSS injection issue
      // which has lead to a greater discussion about how we're going to
      // trust URLs moving forward. See #2115901
      var isEmpty = value == null || typeof value === 'boolean' || value === '';
      if (isEmpty) {
        return '';
      }
      if (!isCustomProperty && typeof value === 'number' && value !== 0 && !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name])) {
        return value + 'px'; // Presumes implicit 'px' suffix for unitless numbers
      }
      return ('' + value).trim();
    }
    var uppercasePattern = /([A-Z])/g;
    var msPattern = /^ms-/;
    /**
     * Hyphenates a camelcased CSS property name, for example:
     *
     *   > hyphenateStyleName('backgroundColor')
     *   < "background-color"
     *   > hyphenateStyleName('MozTransition')
     *   < "-moz-transition"
     *   > hyphenateStyleName('msTransition')
     *   < "-ms-transition"
     *
     * As Modernizr suggests (http://modernizr.com/docs/#prefixed), an `ms` prefix
     * is converted to `-ms-`.
     */

    function hyphenateStyleName(name) {
      return name.replace(uppercasePattern, '-$1').toLowerCase().replace(msPattern, '-ms-');
    }
    function isCustomComponent(tagName, props) {
      if (tagName.indexOf('-') === -1) {
        return typeof props.is === 'string';
      }
      switch (tagName) {
        // These are reserved SVG and MathML elements.
        // We don't mind this whitelist too much because we expect it to never grow.
        // The alternative is to track the namespace in a few places which is convoluted.
        // https://w3c.github.io/webcomponents/spec/custom/#custom-elements-core-concepts
        case 'annotation-xml':
        case 'color-profile':
        case 'font-face':
        case 'font-face-src':
        case 'font-face-uri':
        case 'font-face-format':
        case 'font-face-name':
        case 'missing-glyph':
          return false;
        default:
          return true;
      }
    }
    var warnValidStyle = function () {};
    {
      // 'msTransform' is correct, but the other prefixes should be capitalized
      var badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/;
      var msPattern$1 = /^-ms-/;
      var hyphenPattern = /-(.)/g; // style values shouldn't contain a semicolon

      var badStyleValueWithSemicolonPattern = /;\s*$/;
      var warnedStyleNames = {};
      var warnedStyleValues = {};
      var warnedForNaNValue = false;
      var warnedForInfinityValue = false;
      var camelize = function (string) {
        return string.replace(hyphenPattern, function (_, character) {
          return character.toUpperCase();
        });
      };
      var warnHyphenatedStyleName = function (name) {
        if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
          return;
        }
        warnedStyleNames[name] = true;
        warning$1(false, 'Unsupported style property %s. Did you mean %s?', name,
        // As Andi Smith suggests
        // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
        // is converted to lowercase `ms`.
        camelize(name.replace(msPattern$1, 'ms-')));
      };
      var warnBadVendoredStyleName = function (name) {
        if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
          return;
        }
        warnedStyleNames[name] = true;
        warning$1(false, 'Unsupported vendor-prefixed style property %s. Did you mean %s?', name, name.charAt(0).toUpperCase() + name.slice(1));
      };
      var warnStyleValueWithSemicolon = function (name, value) {
        if (warnedStyleValues.hasOwnProperty(value) && warnedStyleValues[value]) {
          return;
        }
        warnedStyleValues[value] = true;
        warning$1(false, "Style property values shouldn't contain a semicolon. " + 'Try "%s: %s" instead.', name, value.replace(badStyleValueWithSemicolonPattern, ''));
      };
      var warnStyleValueIsNaN = function (name, value) {
        if (warnedForNaNValue) {
          return;
        }
        warnedForNaNValue = true;
        warning$1(false, '`NaN` is an invalid value for the `%s` css style property.', name);
      };
      var warnStyleValueIsInfinity = function (name, value) {
        if (warnedForInfinityValue) {
          return;
        }
        warnedForInfinityValue = true;
        warning$1(false, '`Infinity` is an invalid value for the `%s` css style property.', name);
      };
      warnValidStyle = function (name, value) {
        if (name.indexOf('-') > -1) {
          warnHyphenatedStyleName(name);
        } else if (badVendoredStyleNamePattern.test(name)) {
          warnBadVendoredStyleName(name);
        } else if (badStyleValueWithSemicolonPattern.test(value)) {
          warnStyleValueWithSemicolon(name, value);
        }
        if (typeof value === 'number') {
          if (isNaN(value)) {
            warnStyleValueIsNaN(name, value);
          } else if (!isFinite(value)) {
            warnStyleValueIsInfinity(name, value);
          }
        }
      };
    }
    var warnValidStyle$1 = warnValidStyle;
    var ariaProperties = {
      'aria-current': 0,
      // state
      'aria-details': 0,
      'aria-disabled': 0,
      // state
      'aria-hidden': 0,
      // state
      'aria-invalid': 0,
      // state
      'aria-keyshortcuts': 0,
      'aria-label': 0,
      'aria-roledescription': 0,
      // Widget Attributes
      'aria-autocomplete': 0,
      'aria-checked': 0,
      'aria-expanded': 0,
      'aria-haspopup': 0,
      'aria-level': 0,
      'aria-modal': 0,
      'aria-multiline': 0,
      'aria-multiselectable': 0,
      'aria-orientation': 0,
      'aria-placeholder': 0,
      'aria-pressed': 0,
      'aria-readonly': 0,
      'aria-required': 0,
      'aria-selected': 0,
      'aria-sort': 0,
      'aria-valuemax': 0,
      'aria-valuemin': 0,
      'aria-valuenow': 0,
      'aria-valuetext': 0,
      // Live Region Attributes
      'aria-atomic': 0,
      'aria-busy': 0,
      'aria-live': 0,
      'aria-relevant': 0,
      // Drag-and-Drop Attributes
      'aria-dropeffect': 0,
      'aria-grabbed': 0,
      // Relationship Attributes
      'aria-activedescendant': 0,
      'aria-colcount': 0,
      'aria-colindex': 0,
      'aria-colspan': 0,
      'aria-controls': 0,
      'aria-describedby': 0,
      'aria-errormessage': 0,
      'aria-flowto': 0,
      'aria-labelledby': 0,
      'aria-owns': 0,
      'aria-posinset': 0,
      'aria-rowcount': 0,
      'aria-rowindex': 0,
      'aria-rowspan': 0,
      'aria-setsize': 0
    };
    var warnedProperties = {};
    var rARIA = new RegExp('^(aria)-[' + ATTRIBUTE_NAME_CHAR + ']*$');
    var rARIACamel = new RegExp('^(aria)[A-Z][' + ATTRIBUTE_NAME_CHAR + ']*$');
    var hasOwnProperty$2 = Object.prototype.hasOwnProperty;
    function validateProperty(tagName, name) {
      if (hasOwnProperty$2.call(warnedProperties, name) && warnedProperties[name]) {
        return true;
      }
      if (rARIACamel.test(name)) {
        var ariaName = 'aria-' + name.slice(4).toLowerCase();
        var correctName = ariaProperties.hasOwnProperty(ariaName) ? ariaName : null; // If this is an aria-* attribute, but is not listed in the known DOM
        // DOM properties, then it is an invalid aria-* attribute.

        if (correctName == null) {
          warning$1(false, 'Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.', name);
          warnedProperties[name] = true;
          return true;
        } // aria-* attributes should be lowercase; suggest the lowercase version.

        if (name !== correctName) {
          warning$1(false, 'Invalid ARIA attribute `%s`. Did you mean `%s`?', name, correctName);
          warnedProperties[name] = true;
          return true;
        }
      }
      if (rARIA.test(name)) {
        var lowerCasedName = name.toLowerCase();
        var standardName = ariaProperties.hasOwnProperty(lowerCasedName) ? lowerCasedName : null; // If this is an aria-* attribute, but is not listed in the known DOM
        // DOM properties, then it is an invalid aria-* attribute.

        if (standardName == null) {
          warnedProperties[name] = true;
          return false;
        } // aria-* attributes should be lowercase; suggest the lowercase version.

        if (name !== standardName) {
          warning$1(false, 'Unknown ARIA attribute `%s`. Did you mean `%s`?', name, standardName);
          warnedProperties[name] = true;
          return true;
        }
      }
      return true;
    }
    function warnInvalidARIAProps(type, props) {
      var invalidProps = [];
      for (var key in props) {
        var isValid = validateProperty(type, key);
        if (!isValid) {
          invalidProps.push(key);
        }
      }
      var unknownPropString = invalidProps.map(function (prop) {
        return '`' + prop + '`';
      }).join(', ');
      if (invalidProps.length === 1) {
        warning$1(false, 'Invalid aria prop %s on <%s> tag. ' + 'For details, see https://fb.me/invalid-aria-prop', unknownPropString, type);
      } else if (invalidProps.length > 1) {
        warning$1(false, 'Invalid aria props %s on <%s> tag. ' + 'For details, see https://fb.me/invalid-aria-prop', unknownPropString, type);
      }
    }
    function validateProperties(type, props) {
      if (isCustomComponent(type, props)) {
        return;
      }
      warnInvalidARIAProps(type, props);
    }
    var didWarnValueNull = false;
    function validateProperties$1(type, props) {
      if (type !== 'input' && type !== 'textarea' && type !== 'select') {
        return;
      }
      if (props != null && props.value === null && !didWarnValueNull) {
        didWarnValueNull = true;
        if (type === 'select' && props.multiple) {
          warning$1(false, '`value` prop on `%s` should not be null. ' + 'Consider using an empty array when `multiple` is set to `true` ' + 'to clear the component or `undefined` for uncontrolled components.', type);
        } else {
          warning$1(false, '`value` prop on `%s` should not be null. ' + 'Consider using an empty string to clear the component or `undefined` ' + 'for uncontrolled components.', type);
        }
      }
    }

    /**
     * Registers plugins so that they can extract and dispatch events.
     *
     * @see {EventPluginHub}
     */

    /**
     * Ordered list of injected plugins.
     */

    /**
     * Mapping from event name to dispatch config
     */

    /**
     * Mapping from registration name to plugin module
     */

    var registrationNameModules = {};
    /**
     * Mapping from registration name to event name
     */

    /**
     * Mapping from lowercase registration names to the properly cased version,
     * used to warn in the case of missing event handlers. Available
     * only in true.
     * @type {Object}
     */

    var possibleRegistrationNames = {}; // Trust the developer to only use possibleRegistrationNames in true

    /**
     * Injects an ordering of plugins (by plugin name). This allows the ordering
     * to be decoupled from injection of the actual plugins so that ordering is
     * always deterministic regardless of packaging, on-the-fly injection, etc.
     *
     * @param {array} InjectedEventPluginOrder
     * @internal
     * @see {EventPluginHub.injection.injectEventPluginOrder}
     */

    /**
     * Injects plugins to be used by `EventPluginHub`. The plugin names must be
     * in the ordering injected by `injectEventPluginOrder`.
     *
     * Plugins can be injected as part of page initialization or on-the-fly.
     *
     * @param {object} injectedNamesToPlugins Map from names to plugin modules.
     * @internal
     * @see {EventPluginHub.injection.injectEventPluginsByName}
     */

    // When adding attributes to the HTML or SVG whitelist, be sure to
    // also add them to this module to ensure casing and incorrect name
    // warnings.
    var possibleStandardNames = {
      // HTML
      accept: 'accept',
      acceptcharset: 'acceptCharset',
      'accept-charset': 'acceptCharset',
      accesskey: 'accessKey',
      action: 'action',
      allowfullscreen: 'allowFullScreen',
      alt: 'alt',
      as: 'as',
      async: 'async',
      autocapitalize: 'autoCapitalize',
      autocomplete: 'autoComplete',
      autocorrect: 'autoCorrect',
      autofocus: 'autoFocus',
      autoplay: 'autoPlay',
      autosave: 'autoSave',
      capture: 'capture',
      cellpadding: 'cellPadding',
      cellspacing: 'cellSpacing',
      challenge: 'challenge',
      charset: 'charSet',
      checked: 'checked',
      children: 'children',
      cite: 'cite',
      class: 'className',
      classid: 'classID',
      classname: 'className',
      cols: 'cols',
      colspan: 'colSpan',
      content: 'content',
      contenteditable: 'contentEditable',
      contextmenu: 'contextMenu',
      controls: 'controls',
      controlslist: 'controlsList',
      coords: 'coords',
      crossorigin: 'crossOrigin',
      dangerouslysetinnerhtml: 'dangerouslySetInnerHTML',
      data: 'data',
      datetime: 'dateTime',
      default: 'default',
      defaultchecked: 'defaultChecked',
      defaultvalue: 'defaultValue',
      defer: 'defer',
      dir: 'dir',
      disabled: 'disabled',
      disablepictureinpicture: 'disablePictureInPicture',
      download: 'download',
      draggable: 'draggable',
      enctype: 'encType',
      for: 'htmlFor',
      form: 'form',
      formmethod: 'formMethod',
      formaction: 'formAction',
      formenctype: 'formEncType',
      formnovalidate: 'formNoValidate',
      formtarget: 'formTarget',
      frameborder: 'frameBorder',
      headers: 'headers',
      height: 'height',
      hidden: 'hidden',
      high: 'high',
      href: 'href',
      hreflang: 'hrefLang',
      htmlfor: 'htmlFor',
      httpequiv: 'httpEquiv',
      'http-equiv': 'httpEquiv',
      icon: 'icon',
      id: 'id',
      innerhtml: 'innerHTML',
      inputmode: 'inputMode',
      integrity: 'integrity',
      is: 'is',
      itemid: 'itemID',
      itemprop: 'itemProp',
      itemref: 'itemRef',
      itemscope: 'itemScope',
      itemtype: 'itemType',
      keyparams: 'keyParams',
      keytype: 'keyType',
      kind: 'kind',
      label: 'label',
      lang: 'lang',
      list: 'list',
      loop: 'loop',
      low: 'low',
      manifest: 'manifest',
      marginwidth: 'marginWidth',
      marginheight: 'marginHeight',
      max: 'max',
      maxlength: 'maxLength',
      media: 'media',
      mediagroup: 'mediaGroup',
      method: 'method',
      min: 'min',
      minlength: 'minLength',
      multiple: 'multiple',
      muted: 'muted',
      name: 'name',
      nomodule: 'noModule',
      nonce: 'nonce',
      novalidate: 'noValidate',
      open: 'open',
      optimum: 'optimum',
      pattern: 'pattern',
      placeholder: 'placeholder',
      playsinline: 'playsInline',
      poster: 'poster',
      preload: 'preload',
      profile: 'profile',
      radiogroup: 'radioGroup',
      readonly: 'readOnly',
      referrerpolicy: 'referrerPolicy',
      rel: 'rel',
      required: 'required',
      reversed: 'reversed',
      role: 'role',
      rows: 'rows',
      rowspan: 'rowSpan',
      sandbox: 'sandbox',
      scope: 'scope',
      scoped: 'scoped',
      scrolling: 'scrolling',
      seamless: 'seamless',
      selected: 'selected',
      shape: 'shape',
      size: 'size',
      sizes: 'sizes',
      span: 'span',
      spellcheck: 'spellCheck',
      src: 'src',
      srcdoc: 'srcDoc',
      srclang: 'srcLang',
      srcset: 'srcSet',
      start: 'start',
      step: 'step',
      style: 'style',
      summary: 'summary',
      tabindex: 'tabIndex',
      target: 'target',
      title: 'title',
      type: 'type',
      usemap: 'useMap',
      value: 'value',
      width: 'width',
      wmode: 'wmode',
      wrap: 'wrap',
      // SVG
      about: 'about',
      accentheight: 'accentHeight',
      'accent-height': 'accentHeight',
      accumulate: 'accumulate',
      additive: 'additive',
      alignmentbaseline: 'alignmentBaseline',
      'alignment-baseline': 'alignmentBaseline',
      allowreorder: 'allowReorder',
      alphabetic: 'alphabetic',
      amplitude: 'amplitude',
      arabicform: 'arabicForm',
      'arabic-form': 'arabicForm',
      ascent: 'ascent',
      attributename: 'attributeName',
      attributetype: 'attributeType',
      autoreverse: 'autoReverse',
      azimuth: 'azimuth',
      basefrequency: 'baseFrequency',
      baselineshift: 'baselineShift',
      'baseline-shift': 'baselineShift',
      baseprofile: 'baseProfile',
      bbox: 'bbox',
      begin: 'begin',
      bias: 'bias',
      by: 'by',
      calcmode: 'calcMode',
      capheight: 'capHeight',
      'cap-height': 'capHeight',
      clip: 'clip',
      clippath: 'clipPath',
      'clip-path': 'clipPath',
      clippathunits: 'clipPathUnits',
      cliprule: 'clipRule',
      'clip-rule': 'clipRule',
      color: 'color',
      colorinterpolation: 'colorInterpolation',
      'color-interpolation': 'colorInterpolation',
      colorinterpolationfilters: 'colorInterpolationFilters',
      'color-interpolation-filters': 'colorInterpolationFilters',
      colorprofile: 'colorProfile',
      'color-profile': 'colorProfile',
      colorrendering: 'colorRendering',
      'color-rendering': 'colorRendering',
      contentscripttype: 'contentScriptType',
      contentstyletype: 'contentStyleType',
      cursor: 'cursor',
      cx: 'cx',
      cy: 'cy',
      d: 'd',
      datatype: 'datatype',
      decelerate: 'decelerate',
      descent: 'descent',
      diffuseconstant: 'diffuseConstant',
      direction: 'direction',
      display: 'display',
      divisor: 'divisor',
      dominantbaseline: 'dominantBaseline',
      'dominant-baseline': 'dominantBaseline',
      dur: 'dur',
      dx: 'dx',
      dy: 'dy',
      edgemode: 'edgeMode',
      elevation: 'elevation',
      enablebackground: 'enableBackground',
      'enable-background': 'enableBackground',
      end: 'end',
      exponent: 'exponent',
      externalresourcesrequired: 'externalResourcesRequired',
      fill: 'fill',
      fillopacity: 'fillOpacity',
      'fill-opacity': 'fillOpacity',
      fillrule: 'fillRule',
      'fill-rule': 'fillRule',
      filter: 'filter',
      filterres: 'filterRes',
      filterunits: 'filterUnits',
      floodopacity: 'floodOpacity',
      'flood-opacity': 'floodOpacity',
      floodcolor: 'floodColor',
      'flood-color': 'floodColor',
      focusable: 'focusable',
      fontfamily: 'fontFamily',
      'font-family': 'fontFamily',
      fontsize: 'fontSize',
      'font-size': 'fontSize',
      fontsizeadjust: 'fontSizeAdjust',
      'font-size-adjust': 'fontSizeAdjust',
      fontstretch: 'fontStretch',
      'font-stretch': 'fontStretch',
      fontstyle: 'fontStyle',
      'font-style': 'fontStyle',
      fontvariant: 'fontVariant',
      'font-variant': 'fontVariant',
      fontweight: 'fontWeight',
      'font-weight': 'fontWeight',
      format: 'format',
      from: 'from',
      fx: 'fx',
      fy: 'fy',
      g1: 'g1',
      g2: 'g2',
      glyphname: 'glyphName',
      'glyph-name': 'glyphName',
      glyphorientationhorizontal: 'glyphOrientationHorizontal',
      'glyph-orientation-horizontal': 'glyphOrientationHorizontal',
      glyphorientationvertical: 'glyphOrientationVertical',
      'glyph-orientation-vertical': 'glyphOrientationVertical',
      glyphref: 'glyphRef',
      gradienttransform: 'gradientTransform',
      gradientunits: 'gradientUnits',
      hanging: 'hanging',
      horizadvx: 'horizAdvX',
      'horiz-adv-x': 'horizAdvX',
      horizoriginx: 'horizOriginX',
      'horiz-origin-x': 'horizOriginX',
      ideographic: 'ideographic',
      imagerendering: 'imageRendering',
      'image-rendering': 'imageRendering',
      in2: 'in2',
      in: 'in',
      inlist: 'inlist',
      intercept: 'intercept',
      k1: 'k1',
      k2: 'k2',
      k3: 'k3',
      k4: 'k4',
      k: 'k',
      kernelmatrix: 'kernelMatrix',
      kernelunitlength: 'kernelUnitLength',
      kerning: 'kerning',
      keypoints: 'keyPoints',
      keysplines: 'keySplines',
      keytimes: 'keyTimes',
      lengthadjust: 'lengthAdjust',
      letterspacing: 'letterSpacing',
      'letter-spacing': 'letterSpacing',
      lightingcolor: 'lightingColor',
      'lighting-color': 'lightingColor',
      limitingconeangle: 'limitingConeAngle',
      local: 'local',
      markerend: 'markerEnd',
      'marker-end': 'markerEnd',
      markerheight: 'markerHeight',
      markermid: 'markerMid',
      'marker-mid': 'markerMid',
      markerstart: 'markerStart',
      'marker-start': 'markerStart',
      markerunits: 'markerUnits',
      markerwidth: 'markerWidth',
      mask: 'mask',
      maskcontentunits: 'maskContentUnits',
      maskunits: 'maskUnits',
      mathematical: 'mathematical',
      mode: 'mode',
      numoctaves: 'numOctaves',
      offset: 'offset',
      opacity: 'opacity',
      operator: 'operator',
      order: 'order',
      orient: 'orient',
      orientation: 'orientation',
      origin: 'origin',
      overflow: 'overflow',
      overlineposition: 'overlinePosition',
      'overline-position': 'overlinePosition',
      overlinethickness: 'overlineThickness',
      'overline-thickness': 'overlineThickness',
      paintorder: 'paintOrder',
      'paint-order': 'paintOrder',
      panose1: 'panose1',
      'panose-1': 'panose1',
      pathlength: 'pathLength',
      patterncontentunits: 'patternContentUnits',
      patterntransform: 'patternTransform',
      patternunits: 'patternUnits',
      pointerevents: 'pointerEvents',
      'pointer-events': 'pointerEvents',
      points: 'points',
      pointsatx: 'pointsAtX',
      pointsaty: 'pointsAtY',
      pointsatz: 'pointsAtZ',
      prefix: 'prefix',
      preservealpha: 'preserveAlpha',
      preserveaspectratio: 'preserveAspectRatio',
      primitiveunits: 'primitiveUnits',
      property: 'property',
      r: 'r',
      radius: 'radius',
      refx: 'refX',
      refy: 'refY',
      renderingintent: 'renderingIntent',
      'rendering-intent': 'renderingIntent',
      repeatcount: 'repeatCount',
      repeatdur: 'repeatDur',
      requiredextensions: 'requiredExtensions',
      requiredfeatures: 'requiredFeatures',
      resource: 'resource',
      restart: 'restart',
      result: 'result',
      results: 'results',
      rotate: 'rotate',
      rx: 'rx',
      ry: 'ry',
      scale: 'scale',
      security: 'security',
      seed: 'seed',
      shaperendering: 'shapeRendering',
      'shape-rendering': 'shapeRendering',
      slope: 'slope',
      spacing: 'spacing',
      specularconstant: 'specularConstant',
      specularexponent: 'specularExponent',
      speed: 'speed',
      spreadmethod: 'spreadMethod',
      startoffset: 'startOffset',
      stddeviation: 'stdDeviation',
      stemh: 'stemh',
      stemv: 'stemv',
      stitchtiles: 'stitchTiles',
      stopcolor: 'stopColor',
      'stop-color': 'stopColor',
      stopopacity: 'stopOpacity',
      'stop-opacity': 'stopOpacity',
      strikethroughposition: 'strikethroughPosition',
      'strikethrough-position': 'strikethroughPosition',
      strikethroughthickness: 'strikethroughThickness',
      'strikethrough-thickness': 'strikethroughThickness',
      string: 'string',
      stroke: 'stroke',
      strokedasharray: 'strokeDasharray',
      'stroke-dasharray': 'strokeDasharray',
      strokedashoffset: 'strokeDashoffset',
      'stroke-dashoffset': 'strokeDashoffset',
      strokelinecap: 'strokeLinecap',
      'stroke-linecap': 'strokeLinecap',
      strokelinejoin: 'strokeLinejoin',
      'stroke-linejoin': 'strokeLinejoin',
      strokemiterlimit: 'strokeMiterlimit',
      'stroke-miterlimit': 'strokeMiterlimit',
      strokewidth: 'strokeWidth',
      'stroke-width': 'strokeWidth',
      strokeopacity: 'strokeOpacity',
      'stroke-opacity': 'strokeOpacity',
      suppresscontenteditablewarning: 'suppressContentEditableWarning',
      suppresshydrationwarning: 'suppressHydrationWarning',
      surfacescale: 'surfaceScale',
      systemlanguage: 'systemLanguage',
      tablevalues: 'tableValues',
      targetx: 'targetX',
      targety: 'targetY',
      textanchor: 'textAnchor',
      'text-anchor': 'textAnchor',
      textdecoration: 'textDecoration',
      'text-decoration': 'textDecoration',
      textlength: 'textLength',
      textrendering: 'textRendering',
      'text-rendering': 'textRendering',
      to: 'to',
      transform: 'transform',
      typeof: 'typeof',
      u1: 'u1',
      u2: 'u2',
      underlineposition: 'underlinePosition',
      'underline-position': 'underlinePosition',
      underlinethickness: 'underlineThickness',
      'underline-thickness': 'underlineThickness',
      unicode: 'unicode',
      unicodebidi: 'unicodeBidi',
      'unicode-bidi': 'unicodeBidi',
      unicoderange: 'unicodeRange',
      'unicode-range': 'unicodeRange',
      unitsperem: 'unitsPerEm',
      'units-per-em': 'unitsPerEm',
      unselectable: 'unselectable',
      valphabetic: 'vAlphabetic',
      'v-alphabetic': 'vAlphabetic',
      values: 'values',
      vectoreffect: 'vectorEffect',
      'vector-effect': 'vectorEffect',
      version: 'version',
      vertadvy: 'vertAdvY',
      'vert-adv-y': 'vertAdvY',
      vertoriginx: 'vertOriginX',
      'vert-origin-x': 'vertOriginX',
      vertoriginy: 'vertOriginY',
      'vert-origin-y': 'vertOriginY',
      vhanging: 'vHanging',
      'v-hanging': 'vHanging',
      videographic: 'vIdeographic',
      'v-ideographic': 'vIdeographic',
      viewbox: 'viewBox',
      viewtarget: 'viewTarget',
      visibility: 'visibility',
      vmathematical: 'vMathematical',
      'v-mathematical': 'vMathematical',
      vocab: 'vocab',
      widths: 'widths',
      wordspacing: 'wordSpacing',
      'word-spacing': 'wordSpacing',
      writingmode: 'writingMode',
      'writing-mode': 'writingMode',
      x1: 'x1',
      x2: 'x2',
      x: 'x',
      xchannelselector: 'xChannelSelector',
      xheight: 'xHeight',
      'x-height': 'xHeight',
      xlinkactuate: 'xlinkActuate',
      'xlink:actuate': 'xlinkActuate',
      xlinkarcrole: 'xlinkArcrole',
      'xlink:arcrole': 'xlinkArcrole',
      xlinkhref: 'xlinkHref',
      'xlink:href': 'xlinkHref',
      xlinkrole: 'xlinkRole',
      'xlink:role': 'xlinkRole',
      xlinkshow: 'xlinkShow',
      'xlink:show': 'xlinkShow',
      xlinktitle: 'xlinkTitle',
      'xlink:title': 'xlinkTitle',
      xlinktype: 'xlinkType',
      'xlink:type': 'xlinkType',
      xmlbase: 'xmlBase',
      'xml:base': 'xmlBase',
      xmllang: 'xmlLang',
      'xml:lang': 'xmlLang',
      xmlns: 'xmlns',
      'xml:space': 'xmlSpace',
      xmlnsxlink: 'xmlnsXlink',
      'xmlns:xlink': 'xmlnsXlink',
      xmlspace: 'xmlSpace',
      y1: 'y1',
      y2: 'y2',
      y: 'y',
      ychannelselector: 'yChannelSelector',
      z: 'z',
      zoomandpan: 'zoomAndPan'
    };
    var validateProperty$1 = function () {};
    {
      var warnedProperties$1 = {};
      var _hasOwnProperty = Object.prototype.hasOwnProperty;
      var EVENT_NAME_REGEX = /^on./;
      var INVALID_EVENT_NAME_REGEX = /^on[^A-Z]/;
      var rARIA$1 = new RegExp('^(aria)-[' + ATTRIBUTE_NAME_CHAR + ']*$');
      var rARIACamel$1 = new RegExp('^(aria)[A-Z][' + ATTRIBUTE_NAME_CHAR + ']*$');
      validateProperty$1 = function (tagName, name, value, canUseEventSystem) {
        if (_hasOwnProperty.call(warnedProperties$1, name) && warnedProperties$1[name]) {
          return true;
        }
        var lowerCasedName = name.toLowerCase();
        if (lowerCasedName === 'onfocusin' || lowerCasedName === 'onfocusout') {
          warning$1(false, 'React uses onFocus and onBlur instead of onFocusIn and onFocusOut. ' + 'All React events are normalized to bubble, so onFocusIn and onFocusOut ' + 'are not needed/supported by React.');
          warnedProperties$1[name] = true;
          return true;
        } // We can't rely on the event system being injected on the server.

        if (canUseEventSystem) {
          if (registrationNameModules.hasOwnProperty(name)) {
            return true;
          }
          var registrationName = possibleRegistrationNames.hasOwnProperty(lowerCasedName) ? possibleRegistrationNames[lowerCasedName] : null;
          if (registrationName != null) {
            warning$1(false, 'Invalid event handler property `%s`. Did you mean `%s`?', name, registrationName);
            warnedProperties$1[name] = true;
            return true;
          }
          if (EVENT_NAME_REGEX.test(name)) {
            warning$1(false, 'Unknown event handler property `%s`. It will be ignored.', name);
            warnedProperties$1[name] = true;
            return true;
          }
        } else if (EVENT_NAME_REGEX.test(name)) {
          // If no event plugins have been injected, we are in a server environment.
          // So we can't tell if the event name is correct for sure, but we can filter
          // out known bad ones like `onclick`. We can't suggest a specific replacement though.
          if (INVALID_EVENT_NAME_REGEX.test(name)) {
            warning$1(false, 'Invalid event handler property `%s`. ' + 'React events use the camelCase naming convention, for example `onClick`.', name);
          }
          warnedProperties$1[name] = true;
          return true;
        } // Let the ARIA attribute hook validate ARIA attributes

        if (rARIA$1.test(name) || rARIACamel$1.test(name)) {
          return true;
        }
        if (lowerCasedName === 'innerhtml') {
          warning$1(false, 'Directly setting property `innerHTML` is not permitted. ' + 'For more information, lookup documentation on `dangerouslySetInnerHTML`.');
          warnedProperties$1[name] = true;
          return true;
        }
        if (lowerCasedName === 'aria') {
          warning$1(false, 'The `aria` attribute is reserved for future use in React. ' + 'Pass individual `aria-` attributes instead.');
          warnedProperties$1[name] = true;
          return true;
        }
        if (lowerCasedName === 'is' && value !== null && value !== undefined && typeof value !== 'string') {
          warning$1(false, 'Received a `%s` for a string attribute `is`. If this is expected, cast ' + 'the value to a string.', typeof value);
          warnedProperties$1[name] = true;
          return true;
        }
        if (typeof value === 'number' && isNaN(value)) {
          warning$1(false, 'Received NaN for the `%s` attribute. If this is expected, cast ' + 'the value to a string.', name);
          warnedProperties$1[name] = true;
          return true;
        }
        var propertyInfo = getPropertyInfo(name);
        var isReserved = propertyInfo !== null && propertyInfo.type === RESERVED; // Known attributes should match the casing specified in the property config.

        if (possibleStandardNames.hasOwnProperty(lowerCasedName)) {
          var standardName = possibleStandardNames[lowerCasedName];
          if (standardName !== name) {
            warning$1(false, 'Invalid DOM property `%s`. Did you mean `%s`?', name, standardName);
            warnedProperties$1[name] = true;
            return true;
          }
        } else if (!isReserved && name !== lowerCasedName) {
          // Unknown attributes should have lowercase casing since that's how they
          // will be cased anyway with server rendering.
          warning$1(false, 'React does not recognize the `%s` prop on a DOM element. If you ' + 'intentionally want it to appear in the DOM as a custom ' + 'attribute, spell it as lowercase `%s` instead. ' + 'If you accidentally passed it from a parent component, remove ' + 'it from the DOM element.', name, lowerCasedName);
          warnedProperties$1[name] = true;
          return true;
        }
        if (typeof value === 'boolean' && shouldRemoveAttributeWithWarning(name, value, propertyInfo, false)) {
          if (value) {
            warning$1(false, 'Received `%s` for a non-boolean attribute `%s`.\n\n' + 'If you want to write it to the DOM, pass a string instead: ' + '%s="%s" or %s={value.toString()}.', value, name, name, value, name);
          } else {
            warning$1(false, 'Received `%s` for a non-boolean attribute `%s`.\n\n' + 'If you want to write it to the DOM, pass a string instead: ' + '%s="%s" or %s={value.toString()}.\n\n' + 'If you used to conditionally omit it with %s={condition && value}, ' + 'pass %s={condition ? value : undefined} instead.', value, name, name, value, name, name, name);
          }
          warnedProperties$1[name] = true;
          return true;
        } // Now that we've validated casing, do not validate
        // data types for reserved props

        if (isReserved) {
          return true;
        } // Warn when a known attribute is a bad type

        if (shouldRemoveAttributeWithWarning(name, value, propertyInfo, false)) {
          warnedProperties$1[name] = true;
          return false;
        } // Warn when passing the strings 'false' or 'true' into a boolean prop

        if ((value === 'false' || value === 'true') && propertyInfo !== null && propertyInfo.type === BOOLEAN) {
          warning$1(false, 'Received the string `%s` for the boolean attribute `%s`. ' + '%s ' + 'Did you mean %s={%s}?', value, name, value === 'false' ? 'The browser will interpret it as a truthy value.' : 'Although this works, it will not work as expected if you pass the string "false".', name, value);
          warnedProperties$1[name] = true;
          return true;
        }
        return true;
      };
    }
    var warnUnknownProperties = function (type, props, canUseEventSystem) {
      var unknownProps = [];
      for (var key in props) {
        var isValid = validateProperty$1(type, key, props[key], canUseEventSystem);
        if (!isValid) {
          unknownProps.push(key);
        }
      }
      var unknownPropString = unknownProps.map(function (prop) {
        return '`' + prop + '`';
      }).join(', ');
      if (unknownProps.length === 1) {
        warning$1(false, 'Invalid value for prop %s on <%s> tag. Either remove it from the element, ' + 'or pass a string or number value to keep it in the DOM. ' + 'For details, see https://fb.me/react-attribute-behavior', unknownPropString, type);
      } else if (unknownProps.length > 1) {
        warning$1(false, 'Invalid values for props %s on <%s> tag. Either remove them from the element, ' + 'or pass a string or number value to keep them in the DOM. ' + 'For details, see https://fb.me/react-attribute-behavior', unknownPropString, type);
      }
    };
    function validateProperties$2(type, props, canUseEventSystem) {
      if (isCustomComponent(type, props)) {
        return;
      }
      warnUnknownProperties(type, props, canUseEventSystem);
    }
    var toArray = React.Children.toArray; // This is only used in DEV.
    // Each entry is `this.stack` from a currently executing renderer instance.
    // (There may be more than one because ReactDOMServer is reentrant).
    // Each stack is an array of frames which may contain nested stacks of elements.

    var currentDebugStacks = [];
    var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
    var ReactDebugCurrentFrame;
    var prevGetCurrentStackImpl = null;
    var getCurrentServerStackImpl = function () {
      return '';
    };
    var describeStackFrame = function (element) {
      return '';
    };
    var validatePropertiesInDevelopment = function (type, props) {};
    var pushCurrentDebugStack = function (stack) {};
    var pushElementToDebugStack = function (element) {};
    var popCurrentDebugStack = function () {};
    var hasWarnedAboutUsingContextAsConsumer = false;
    {
      ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      validatePropertiesInDevelopment = function (type, props) {
        validateProperties(type, props);
        validateProperties$1(type, props);
        validateProperties$2(type, props, /* canUseEventSystem */
        false);
      };
      describeStackFrame = function (element) {
        var source = element._source;
        var type = element.type;
        var name = getComponentName(type);
        var ownerName = null;
        return describeComponentFrame(name, source, ownerName);
      };
      pushCurrentDebugStack = function (stack) {
        currentDebugStacks.push(stack);
        if (currentDebugStacks.length === 1) {
          // We are entering a server renderer.
          // Remember the previous (e.g. client) global stack implementation.
          prevGetCurrentStackImpl = ReactDebugCurrentFrame.getCurrentStack;
          ReactDebugCurrentFrame.getCurrentStack = getCurrentServerStackImpl;
        }
      };
      pushElementToDebugStack = function (element) {
        // For the innermost executing ReactDOMServer call,
        var stack = currentDebugStacks[currentDebugStacks.length - 1]; // Take the innermost executing frame (e.g. <Foo>),

        var frame = stack[stack.length - 1]; // and record that it has one more element associated with it.

        frame.debugElementStack.push(element); // We only need this because we tail-optimize single-element
        // children and directly handle them in an inner loop instead of
        // creating separate frames for them.
      };
      popCurrentDebugStack = function () {
        currentDebugStacks.pop();
        if (currentDebugStacks.length === 0) {
          // We are exiting the server renderer.
          // Restore the previous (e.g. client) global stack implementation.
          ReactDebugCurrentFrame.getCurrentStack = prevGetCurrentStackImpl;
          prevGetCurrentStackImpl = null;
        }
      };
      getCurrentServerStackImpl = function () {
        if (currentDebugStacks.length === 0) {
          // Nothing is currently rendering.
          return '';
        } // ReactDOMServer is reentrant so there may be multiple calls at the same time.
        // Take the frames from the innermost call which is the last in the array.

        var frames = currentDebugStacks[currentDebugStacks.length - 1];
        var stack = ''; // Go through every frame in the stack from the innermost one.

        for (var i = frames.length - 1; i >= 0; i--) {
          var frame = frames[i]; // Every frame might have more than one debug element stack entry associated with it.
          // This is because single-child nesting doesn't create materialized frames.
          // Instead it would push them through `pushElementToDebugStack()`.

          var debugElementStack = frame.debugElementStack;
          for (var ii = debugElementStack.length - 1; ii >= 0; ii--) {
            stack += describeStackFrame(debugElementStack[ii]);
          }
        }
        return stack;
      };
    }
    var didWarnDefaultInputValue = false;
    var didWarnDefaultChecked = false;
    var didWarnDefaultSelectValue = false;
    var didWarnDefaultTextareaValue = false;
    var didWarnInvalidOptionChildren = false;
    var didWarnAboutNoopUpdateForComponent = {};
    var didWarnAboutBadClass = {};
    var didWarnAboutModulePatternComponent = {};
    var didWarnAboutDeprecatedWillMount = {};
    var didWarnAboutUndefinedDerivedState = {};
    var didWarnAboutUninitializedState = {};
    var valuePropNames = ['value', 'defaultValue'];
    var newlineEatingTags = {
      listing: true,
      pre: true,
      textarea: true
    }; // We accept any tag to be rendered but since this gets injected into arbitrary
    // HTML, we want to make sure that it's a safe tag.
    // http://www.w3.org/TR/REC-xml/#NT-Name

    var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/; // Simplified subset

    var validatedTagCache = {};
    function validateDangerousTag(tag) {
      if (!validatedTagCache.hasOwnProperty(tag)) {
        (function () {
          if (!VALID_TAG_REGEX.test(tag)) {
            {
              throw ReactError(Error("Invalid tag: " + tag));
            }
          }
        })();
        validatedTagCache[tag] = true;
      }
    }
    var styleNameCache = {};
    var processStyleName = function (styleName) {
      if (styleNameCache.hasOwnProperty(styleName)) {
        return styleNameCache[styleName];
      }
      var result = hyphenateStyleName(styleName);
      styleNameCache[styleName] = result;
      return result;
    };
    function createMarkupForStyles(styles) {
      var serialized = '';
      var delimiter = '';
      for (var styleName in styles) {
        if (!styles.hasOwnProperty(styleName)) {
          continue;
        }
        var isCustomProperty = styleName.indexOf('--') === 0;
        var styleValue = styles[styleName];
        {
          if (!isCustomProperty) {
            warnValidStyle$1(styleName, styleValue);
          }
        }
        if (styleValue != null) {
          serialized += delimiter + (isCustomProperty ? styleName : processStyleName(styleName)) + ':';
          serialized += dangerousStyleValue(styleName, styleValue, isCustomProperty);
          delimiter = ';';
        }
      }
      return serialized || null;
    }
    function warnNoop(publicInstance, callerName) {
      {
        var _constructor = publicInstance.constructor;
        var componentName = _constructor && getComponentName(_constructor) || 'ReactClass';
        var warningKey = componentName + '.' + callerName;
        if (didWarnAboutNoopUpdateForComponent[warningKey]) {
          return;
        }
        warningWithoutStack$1(false, '%s(...): Can only update a mounting component. ' + 'This usually means you called %s() outside componentWillMount() on the server. ' + 'This is a no-op.\n\nPlease check the code for the %s component.', callerName, callerName, componentName);
        didWarnAboutNoopUpdateForComponent[warningKey] = true;
      }
    }
    function shouldConstruct(Component) {
      return Component.prototype && Component.prototype.isReactComponent;
    }
    function getNonChildrenInnerMarkup(props) {
      var innerHTML = props.dangerouslySetInnerHTML;
      if (innerHTML != null) {
        if (innerHTML.__html != null) {
          return innerHTML.__html;
        }
      } else {
        var content = props.children;
        if (typeof content === 'string' || typeof content === 'number') {
          return escapeTextForBrowser(content);
        }
      }
      return null;
    }
    function flattenTopLevelChildren(children) {
      if (!React.isValidElement(children)) {
        return toArray(children);
      }
      var element = children;
      if (element.type !== REACT_FRAGMENT_TYPE) {
        return [element];
      }
      var fragmentChildren = element.props.children;
      if (!React.isValidElement(fragmentChildren)) {
        return toArray(fragmentChildren);
      }
      var fragmentChildElement = fragmentChildren;
      return [fragmentChildElement];
    }
    function flattenOptionChildren(children) {
      if (children === undefined || children === null) {
        return children;
      }
      var content = ''; // Flatten children and warn if they aren't strings or numbers;
      // invalid types are ignored.

      React.Children.forEach(children, function (child) {
        if (child == null) {
          return;
        }
        content += child;
        {
          if (!didWarnInvalidOptionChildren && typeof child !== 'string' && typeof child !== 'number') {
            didWarnInvalidOptionChildren = true;
            warning$1(false, 'Only strings and numbers are supported as <option> children.');
          }
        }
      });
      return content;
    }
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var STYLE = 'style';
    var RESERVED_PROPS = {
      children: null,
      dangerouslySetInnerHTML: null,
      suppressContentEditableWarning: null,
      suppressHydrationWarning: null
    };
    function createOpenTagMarkup(tagVerbatim, tagLowercase, props, namespace, makeStaticMarkup, isRootElement) {
      var ret = '<' + tagVerbatim;
      for (var propKey in props) {
        if (!hasOwnProperty.call(props, propKey)) {
          continue;
        }
        if (enableFlareAPI && propKey === 'listeners') {
          continue;
        }
        var propValue = props[propKey];
        if (propValue == null) {
          continue;
        }
        if (propKey === STYLE) {
          propValue = createMarkupForStyles(propValue);
        }
        var markup = null;
        if (isCustomComponent(tagLowercase, props)) {
          if (!RESERVED_PROPS.hasOwnProperty(propKey)) {
            markup = createMarkupForCustomAttribute(propKey, propValue);
          }
        } else {
          markup = createMarkupForProperty(propKey, propValue);
        }
        if (markup) {
          ret += ' ' + markup;
        }
      } // For static pages, no need to put React ID and checksum. Saves lots of
      // bytes.

      if (makeStaticMarkup) {
        return ret;
      }
      if (isRootElement) {
        ret += ' ' + createMarkupForRoot();
      }
      return ret;
    }
    function validateRenderResult(child, type) {
      if (child === undefined) {
        (function () {
          {
            {
              throw ReactError(Error((getComponentName(type) || 'Component') + "(...): Nothing was returned from render. This usually means a return statement is missing. Or, to render nothing, return null."));
            }
          }
        })();
      }
    }
    function resolve(child, context, threadID) {
      while (React.isValidElement(child)) {
        // Safe because we just checked it's an element.
        var element = child;
        var Component = element.type;
        {
          pushElementToDebugStack(element);
        }
        if (typeof Component !== 'function') {
          break;
        }
        processChild(element, Component);
      } // Extra closure so queue and replace can be captured properly

      function processChild(element, Component) {
        var isClass = shouldConstruct(Component);
        var publicContext = processContext(Component, context, threadID, isClass);
        var queue = [];
        var replace = false;
        var updater = {
          isMounted: function (publicInstance) {
            return false;
          },
          enqueueForceUpdate: function (publicInstance) {
            if (queue === null) {
              warnNoop(publicInstance, 'forceUpdate');
              return null;
            }
          },
          enqueueReplaceState: function (publicInstance, completeState) {
            replace = true;
            queue = [completeState];
          },
          enqueueSetState: function (publicInstance, currentPartialState) {
            if (queue === null) {
              warnNoop(publicInstance, 'setState');
              return null;
            }
            queue.push(currentPartialState);
          }
        };
        var inst;
        if (isClass) {
          inst = new Component(element.props, publicContext, updater);
          if (typeof Component.getDerivedStateFromProps === 'function') {
            {
              if (inst.state === null || inst.state === undefined) {
                var componentName = getComponentName(Component) || 'Unknown';
                if (!didWarnAboutUninitializedState[componentName]) {
                  warningWithoutStack$1(false, '`%s` uses `getDerivedStateFromProps` but its initial state is ' + '%s. This is not recommended. Instead, define the initial state by ' + 'assigning an object to `this.state` in the constructor of `%s`. ' + 'This ensures that `getDerivedStateFromProps` arguments have a consistent shape.', componentName, inst.state === null ? 'null' : 'undefined', componentName);
                  didWarnAboutUninitializedState[componentName] = true;
                }
              }
            }
            var partialState = Component.getDerivedStateFromProps.call(null, element.props, inst.state);
            {
              if (partialState === undefined) {
                var _componentName = getComponentName(Component) || 'Unknown';
                if (!didWarnAboutUndefinedDerivedState[_componentName]) {
                  warningWithoutStack$1(false, '%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. ' + 'You have returned undefined.', _componentName);
                  didWarnAboutUndefinedDerivedState[_componentName] = true;
                }
              }
            }
            if (partialState != null) {
              inst.state = _assign({}, inst.state, partialState);
            }
          }
        } else {
          {
            if (Component.prototype && typeof Component.prototype.render === 'function') {
              var _componentName2 = getComponentName(Component) || 'Unknown';
              if (!didWarnAboutBadClass[_componentName2]) {
                warningWithoutStack$1(false, "The <%s /> component appears to have a render method, but doesn't extend React.Component. " + 'This is likely to cause errors. Change %s to extend React.Component instead.', _componentName2, _componentName2);
                didWarnAboutBadClass[_componentName2] = true;
              }
            }
          }
          var componentIdentity = {};
          prepareToUseHooks(componentIdentity);
          inst = Component(element.props, publicContext, updater);
          inst = finishHooks(Component, element.props, inst, publicContext);
          if (inst == null || inst.render == null) {
            child = inst;
            validateRenderResult(child, Component);
            return;
          }
          {
            var _componentName3 = getComponentName(Component) || 'Unknown';
            if (!didWarnAboutModulePatternComponent[_componentName3]) {
              warningWithoutStack$1(false, 'The <%s /> component appears to be a function component that returns a class instance. ' + 'Change %s to a class that extends React.Component instead. ' + "If you can't use a class try assigning the prototype on the function as a workaround. " + "`%s.prototype = React.Component.prototype`. Don't use an arrow function since it " + 'cannot be called with `new` by React.', _componentName3, _componentName3, _componentName3);
              didWarnAboutModulePatternComponent[_componentName3] = true;
            }
          }
        }
        inst.props = element.props;
        inst.context = publicContext;
        inst.updater = updater;
        var initialState = inst.state;
        if (initialState === undefined) {
          inst.state = initialState = null;
        }
        if (typeof inst.UNSAFE_componentWillMount === 'function' || typeof inst.componentWillMount === 'function') {
          if (typeof inst.componentWillMount === 'function') {
            {
              if (warnAboutDeprecatedLifecycles && inst.componentWillMount.__suppressDeprecationWarning !== true) {
                var _componentName4 = getComponentName(Component) || 'Unknown';
                if (!didWarnAboutDeprecatedWillMount[_componentName4]) {
                  lowPriorityWarningWithoutStack$1(false,
                  // keep this warning in sync with ReactStrictModeWarning.js
                  'componentWillMount has been renamed, and is not recommended for use. ' + 'See https://fb.me/react-unsafe-component-lifecycles for details.\n\n' + '* Move code from componentWillMount to componentDidMount (preferred in most cases) ' + 'or the constructor.\n' + '\nPlease update the following components: %s', _componentName4);
                  didWarnAboutDeprecatedWillMount[_componentName4] = true;
                }
              }
            } // In order to support react-lifecycles-compat polyfilled components,
            // Unsafe lifecycles should not be invoked for any component with the new gDSFP.

            if (typeof Component.getDerivedStateFromProps !== 'function') {
              inst.componentWillMount();
            }
          }
          if (typeof inst.UNSAFE_componentWillMount === 'function' && typeof Component.getDerivedStateFromProps !== 'function') {
            // In order to support react-lifecycles-compat polyfilled components,
            // Unsafe lifecycles should not be invoked for any component with the new gDSFP.
            inst.UNSAFE_componentWillMount();
          }
          if (queue.length) {
            var oldQueue = queue;
            var oldReplace = replace;
            queue = null;
            replace = false;
            if (oldReplace && oldQueue.length === 1) {
              inst.state = oldQueue[0];
            } else {
              var nextState = oldReplace ? oldQueue[0] : inst.state;
              var dontMutate = true;
              for (var i = oldReplace ? 1 : 0; i < oldQueue.length; i++) {
                var partial = oldQueue[i];
                var _partialState = typeof partial === 'function' ? partial.call(inst, nextState, element.props, publicContext) : partial;
                if (_partialState != null) {
                  if (dontMutate) {
                    dontMutate = false;
                    nextState = _assign({}, nextState, _partialState);
                  } else {
                    _assign(nextState, _partialState);
                  }
                }
              }
              inst.state = nextState;
            }
          } else {
            queue = null;
          }
        }
        child = inst.render();
        {
          if (child === undefined && inst.render._isMockFunction) {
            // This is probably bad practice. Consider warning here and
            // deprecating this convenience.
            child = null;
          }
        }
        validateRenderResult(child, Component);
        var childContext;
        if (disableLegacyContext) {
          {
            var childContextTypes = Component.childContextTypes;
            if (childContextTypes !== undefined) {
              warningWithoutStack$1(false, '%s uses the legacy childContextTypes API which is no longer supported. ' + 'Use React.createContext() instead.', getComponentName(Component) || 'Unknown');
            }
          }
        } else {
          if (typeof inst.getChildContext === 'function') {
            var _childContextTypes = Component.childContextTypes;
            if (typeof _childContextTypes === 'object') {
              childContext = inst.getChildContext();
              for (var contextKey in childContext) {
                (function () {
                  if (!(contextKey in _childContextTypes)) {
                    {
                      throw ReactError(Error((getComponentName(Component) || 'Unknown') + ".getChildContext(): key \"" + contextKey + "\" is not defined in childContextTypes."));
                    }
                  }
                })();
              }
            } else {
              warningWithoutStack$1(false, '%s.getChildContext(): childContextTypes must be defined in order to ' + 'use getChildContext().', getComponentName(Component) || 'Unknown');
            }
          }
          if (childContext) {
            context = _assign({}, context, childContext);
          }
        }
      }
      return {
        child: child,
        context: context
      };
    }
    var ReactDOMServerRenderer = /*#__PURE__*/
    function () {
      // TODO: type this more strictly:
      // DEV-only
      function ReactDOMServerRenderer(children, makeStaticMarkup) {
        var flatChildren = flattenTopLevelChildren(children);
        var topFrame = {
          type: null,
          // Assume all trees start in the HTML namespace (not totally true, but
          // this is what we did historically)
          domNamespace: Namespaces.html,
          children: flatChildren,
          childIndex: 0,
          context: emptyObject,
          footer: ''
        };
        {
          topFrame.debugElementStack = [];
        }
        this.threadID = allocThreadID();
        this.stack = [topFrame];
        this.exhausted = false;
        this.currentSelectValue = null;
        this.previousWasTextNode = false;
        this.makeStaticMarkup = makeStaticMarkup;
        this.suspenseDepth = 0; // Context (new API)

        this.contextIndex = -1;
        this.contextStack = [];
        this.contextValueStack = [];
        {
          this.contextProviderStack = [];
        }
      }
      var _proto = ReactDOMServerRenderer.prototype;
      _proto.destroy = function destroy() {
        if (!this.exhausted) {
          this.exhausted = true;
          this.clearProviders();
          freeThreadID(this.threadID);
        }
      }
      /**
       * Note: We use just two stacks regardless of how many context providers you have.
       * Providers are always popped in the reverse order to how they were pushed
       * so we always know on the way down which provider you'll encounter next on the way up.
       * On the way down, we push the current provider, and its context value *before*
       * we mutated it, onto the stacks. Therefore, on the way up, we always know which
       * provider needs to be "restored" to which value.
       * https://github.com/facebook/react/pull/12985#issuecomment-396301248
       */;
      _proto.pushProvider = function pushProvider(provider) {
        var index = ++this.contextIndex;
        var context = provider.type._context;
        var threadID = this.threadID;
        validateContextBounds(context, threadID);
        var previousValue = context[threadID]; // Remember which value to restore this context to on our way up.

        this.contextStack[index] = context;
        this.contextValueStack[index] = previousValue;
        {
          // Only used for push/pop mismatch warnings.
          this.contextProviderStack[index] = provider;
        } // Mutate the current value.

        context[threadID] = provider.props.value;
      };
      _proto.popProvider = function popProvider(provider) {
        var index = this.contextIndex;
        {
          !(index > -1 && provider === this.contextProviderStack[index]) ? warningWithoutStack$1(false, 'Unexpected pop.') : void 0;
        }
        var context = this.contextStack[index];
        var previousValue = this.contextValueStack[index]; // "Hide" these null assignments from Flow by using `any`
        // because conceptually they are deletions--as long as we
        // promise to never access values beyond `this.contextIndex`.

        this.contextStack[index] = null;
        this.contextValueStack[index] = null;
        {
          this.contextProviderStack[index] = null;
        }
        this.contextIndex--; // Restore to the previous value we stored as we were walking down.
        // We've already verified that this context has been expanded to accommodate
        // this thread id, so we don't need to do it again.

        context[this.threadID] = previousValue;
      };
      _proto.clearProviders = function clearProviders() {
        // Restore any remaining providers on the stack to previous values
        for (var index = this.contextIndex; index >= 0; index--) {
          var context = this.contextStack[index];
          var previousValue = this.contextValueStack[index];
          context[this.threadID] = previousValue;
        }
      };
      _proto.read = function read(bytes) {
        var _this = this;
        if (this.exhausted) {
          return null;
        }
        var prevThreadID = currentThreadID;
        setCurrentThreadID(this.threadID);
        var prevDispatcher = ReactCurrentDispatcher.current;
        ReactCurrentDispatcher.current = Dispatcher;
        try {
          // Markup generated within <Suspense> ends up buffered until we know
          // nothing in that boundary suspended
          var out = [''];
          var suspended = false;
          while (out[0].length < bytes) {
            if (this.stack.length === 0) {
              this.exhausted = true;
              freeThreadID(this.threadID);
              break;
            }
            var frame = this.stack[this.stack.length - 1];
            if (suspended || frame.childIndex >= frame.children.length) {
              var footer = frame.footer;
              if (footer !== '') {
                this.previousWasTextNode = false;
              }
              this.stack.pop();
              if (frame.type === 'select') {
                this.currentSelectValue = null;
              } else if (frame.type != null && frame.type.type != null && frame.type.type.$$typeof === REACT_PROVIDER_TYPE) {
                var provider = frame.type;
                this.popProvider(provider);
              } else if (frame.type === REACT_SUSPENSE_TYPE) {
                this.suspenseDepth--;
                var buffered = out.pop();
                if (suspended) {
                  suspended = false; // If rendering was suspended at this boundary, render the fallbackFrame

                  var fallbackFrame = frame.fallbackFrame;
                  (function () {
                    if (!fallbackFrame) {
                      {
                        throw ReactError(Error("ReactDOMServer did not find an internal fallback frame for Suspense. This is a bug in React. Please file an issue."));
                      }
                    }
                  })();
                  this.stack.push(fallbackFrame);
                  out[this.suspenseDepth] += '<!--$!-->'; // Skip flushing output since we're switching to the fallback

                  continue;
                } else {
                  out[this.suspenseDepth] += buffered;
                }
              } // Flush output

              out[this.suspenseDepth] += footer;
              continue;
            }
            var child = frame.children[frame.childIndex++];
            var outBuffer = '';
            {
              pushCurrentDebugStack(this.stack); // We're starting work on this frame, so reset its inner stack.

              frame.debugElementStack.length = 0;
            }
            try {
              outBuffer += this.render(child, frame.context, frame.domNamespace);
            } catch (err) {
              if (err != null && typeof err.then === 'function') {
                if (enableSuspenseServerRenderer) {
                  (function () {
                    if (!(_this.suspenseDepth > 0)) {
                      {
                        throw ReactError(Error("A React component suspended while rendering, but no fallback UI was specified.\n\nAdd a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display."));
                      }
                    }
                  })();
                  suspended = true;
                } else {
                  (function () {
                    {
                      {
                        throw ReactError(Error("ReactDOMServer does not yet support Suspense."));
                      }
                    }
                  })();
                }
              } else {
                throw err;
              }
            } finally {
              {
                popCurrentDebugStack();
              }
            }
            if (out.length <= this.suspenseDepth) {
              out.push('');
            }
            out[this.suspenseDepth] += outBuffer;
          }
          return out[0];
        } finally {
          ReactCurrentDispatcher.current = prevDispatcher;
          setCurrentThreadID(prevThreadID);
        }
      };
      _proto.render = function render(child, context, parentNamespace) {
        if (typeof child === 'string' || typeof child === 'number') {
          var text = '' + child;
          if (text === '') {
            return '';
          }
          if (this.makeStaticMarkup) {
            return escapeTextForBrowser(text);
          }
          if (this.previousWasTextNode) {
            return '<!-- -->' + escapeTextForBrowser(text);
          }
          this.previousWasTextNode = true;
          return escapeTextForBrowser(text);
        } else {
          var nextChild;
          var _resolve = resolve(child, context, this.threadID);
          nextChild = _resolve.child;
          context = _resolve.context;
          if (nextChild === null || nextChild === false) {
            return '';
          } else if (!React.isValidElement(nextChild)) {
            if (nextChild != null && nextChild.$$typeof != null) {
              // Catch unexpected special types early.
              var $$typeof = nextChild.$$typeof;
              (function () {
                if (!($$typeof !== REACT_PORTAL_TYPE)) {
                  {
                    throw ReactError(Error("Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render."));
                  }
                }
              })(); // Catch-all to prevent an infinite loop if React.Children.toArray() supports some new type.

              (function () {
                {
                  {
                    throw ReactError(Error("Unknown element-like object type: " + $$typeof.toString() + ". This is likely a bug in React. Please file an issue."));
                  }
                }
              })();
            }
            var nextChildren = toArray(nextChild);
            var frame = {
              type: null,
              domNamespace: parentNamespace,
              children: nextChildren,
              childIndex: 0,
              context: context,
              footer: ''
            };
            {
              frame.debugElementStack = [];
            }
            this.stack.push(frame);
            return '';
          } // Safe because we just checked it's an element.

          var nextElement = nextChild;
          var elementType = nextElement.type;
          if (typeof elementType === 'string') {
            return this.renderDOM(nextElement, context, parentNamespace);
          }
          switch (elementType) {
            case REACT_STRICT_MODE_TYPE:
            case REACT_CONCURRENT_MODE_TYPE:
            case REACT_PROFILER_TYPE:
            case REACT_SUSPENSE_LIST_TYPE:
            case REACT_FRAGMENT_TYPE:
              {
                var _nextChildren = toArray(nextChild.props.children);
                var _frame = {
                  type: null,
                  domNamespace: parentNamespace,
                  children: _nextChildren,
                  childIndex: 0,
                  context: context,
                  footer: ''
                };
                {
                  _frame.debugElementStack = [];
                }
                this.stack.push(_frame);
                return '';
              }
            case REACT_SUSPENSE_TYPE:
              {
                if (enableSuspenseServerRenderer) {
                  var fallback = nextChild.props.fallback;
                  if (fallback === undefined) {
                    // If there is no fallback, then this just behaves as a fragment.
                    var _nextChildren3 = toArray(nextChild.props.children);
                    var _frame3 = {
                      type: null,
                      domNamespace: parentNamespace,
                      children: _nextChildren3,
                      childIndex: 0,
                      context: context,
                      footer: ''
                    };
                    {
                      _frame3.debugElementStack = [];
                    }
                    this.stack.push(_frame3);
                    return '';
                  }
                  var fallbackChildren = toArray(fallback);
                  var _nextChildren2 = toArray(nextChild.props.children);
                  var fallbackFrame = {
                    type: null,
                    domNamespace: parentNamespace,
                    children: fallbackChildren,
                    childIndex: 0,
                    context: context,
                    footer: '<!--/$-->'
                  };
                  var _frame2 = {
                    fallbackFrame: fallbackFrame,
                    type: REACT_SUSPENSE_TYPE,
                    domNamespace: parentNamespace,
                    children: _nextChildren2,
                    childIndex: 0,
                    context: context,
                    footer: '<!--/$-->'
                  };
                  {
                    _frame2.debugElementStack = [];
                    fallbackFrame.debugElementStack = [];
                  }
                  this.stack.push(_frame2);
                  this.suspenseDepth++;
                  return '<!--$-->';
                } else {
                  (function () {
                    {
                      {
                        throw ReactError(Error("ReactDOMServer does not yet support Suspense."));
                      }
                    }
                  })();
                }
              }
            // eslint-disable-next-line-no-fallthrough

            default:
              break;
          }
          if (typeof elementType === 'object' && elementType !== null) {
            switch (elementType.$$typeof) {
              case REACT_FORWARD_REF_TYPE:
                {
                  var element = nextChild;
                  var _nextChildren4;
                  var componentIdentity = {};
                  prepareToUseHooks(componentIdentity);
                  _nextChildren4 = elementType.render(element.props, element.ref);
                  _nextChildren4 = finishHooks(elementType.render, element.props, _nextChildren4, element.ref);
                  _nextChildren4 = toArray(_nextChildren4);
                  var _frame4 = {
                    type: null,
                    domNamespace: parentNamespace,
                    children: _nextChildren4,
                    childIndex: 0,
                    context: context,
                    footer: ''
                  };
                  {
                    _frame4.debugElementStack = [];
                  }
                  this.stack.push(_frame4);
                  return '';
                }
              case REACT_MEMO_TYPE:
                {
                  var _element = nextChild;
                  var _nextChildren5 = [React.createElement(elementType.type, _assign({
                    ref: _element.ref
                  }, _element.props))];
                  var _frame5 = {
                    type: null,
                    domNamespace: parentNamespace,
                    children: _nextChildren5,
                    childIndex: 0,
                    context: context,
                    footer: ''
                  };
                  {
                    _frame5.debugElementStack = [];
                  }
                  this.stack.push(_frame5);
                  return '';
                }
              case REACT_PROVIDER_TYPE:
                {
                  var provider = nextChild;
                  var nextProps = provider.props;
                  var _nextChildren6 = toArray(nextProps.children);
                  var _frame6 = {
                    type: provider,
                    domNamespace: parentNamespace,
                    children: _nextChildren6,
                    childIndex: 0,
                    context: context,
                    footer: ''
                  };
                  {
                    _frame6.debugElementStack = [];
                  }
                  this.pushProvider(provider);
                  this.stack.push(_frame6);
                  return '';
                }
              case REACT_CONTEXT_TYPE:
                {
                  var reactContext = nextChild.type; // The logic below for Context differs depending on PROD or DEV mode. In
                  // DEV mode, we create a separate object for Context.Consumer that acts
                  // like a proxy to Context. This proxy object adds unnecessary code in PROD
                  // so we use the old behaviour (Context.Consumer references Context) to
                  // reduce size and overhead. The separate object references context via
                  // a property called "_context", which also gives us the ability to check
                  // in DEV mode if this property exists or not and warn if it does not.

                  {
                    if (reactContext._context === undefined) {
                      // This may be because it's a Context (rather than a Consumer).
                      // Or it may be because it's older React where they're the same thing.
                      // We only want to warn if we're sure it's a new React.
                      if (reactContext !== reactContext.Consumer) {
                        if (!hasWarnedAboutUsingContextAsConsumer) {
                          hasWarnedAboutUsingContextAsConsumer = true;
                          warning$1(false, 'Rendering <Context> directly is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
                        }
                      }
                    } else {
                      reactContext = reactContext._context;
                    }
                  }
                  var _nextProps = nextChild.props;
                  var threadID = this.threadID;
                  validateContextBounds(reactContext, threadID);
                  var nextValue = reactContext[threadID];
                  var _nextChildren7 = toArray(_nextProps.children(nextValue));
                  var _frame7 = {
                    type: nextChild,
                    domNamespace: parentNamespace,
                    children: _nextChildren7,
                    childIndex: 0,
                    context: context,
                    footer: ''
                  };
                  {
                    _frame7.debugElementStack = [];
                  }
                  this.stack.push(_frame7);
                  return '';
                }
              // eslint-disable-next-line-no-fallthrough

              case REACT_FUNDAMENTAL_TYPE:
                {
                  if (enableFundamentalAPI) {
                    var fundamentalImpl = elementType.impl;
                    var open = fundamentalImpl.getServerSideString(null, nextElement.props);
                    var getServerSideStringClose = fundamentalImpl.getServerSideStringClose;
                    var close = getServerSideStringClose !== undefined ? getServerSideStringClose(null, nextElement.props) : '';
                    var _nextChildren8 = fundamentalImpl.reconcileChildren !== false ? toArray(nextChild.props.children) : [];
                    var _frame8 = {
                      type: null,
                      domNamespace: parentNamespace,
                      children: _nextChildren8,
                      childIndex: 0,
                      context: context,
                      footer: close
                    };
                    {
                      _frame8.debugElementStack = [];
                    }
                    this.stack.push(_frame8);
                    return open;
                  }
                  (function () {
                    {
                      {
                        throw ReactError(Error("ReactDOMServer does not yet support the fundamental API."));
                      }
                    }
                  })();
                }
              // eslint-disable-next-line-no-fallthrough

              case REACT_LAZY_TYPE:
                {
                  var _element2 = nextChild;
                  var lazyComponent = nextChild.type; // Attempt to initialize lazy component regardless of whether the
                  // suspense server-side renderer is enabled so synchronously
                  // resolved constructors are supported.

                  initializeLazyComponentType(lazyComponent);
                  switch (lazyComponent._status) {
                    case Resolved:
                      {
                        var _nextChildren9 = [React.createElement(lazyComponent._result, _assign({
                          ref: _element2.ref
                        }, _element2.props))];
                        var _frame9 = {
                          type: null,
                          domNamespace: parentNamespace,
                          children: _nextChildren9,
                          childIndex: 0,
                          context: context,
                          footer: ''
                        };
                        {
                          _frame9.debugElementStack = [];
                        }
                        this.stack.push(_frame9);
                        return '';
                      }
                    case Rejected:
                      throw lazyComponent._result;
                    case Pending:
                    default:
                      (function () {
                        {
                          {
                            throw ReactError(Error("ReactDOMServer does not yet support lazy-loaded components."));
                          }
                        }
                      })();
                  }
                }
              // eslint-disable-next-line-no-fallthrough

              case REACT_SCOPE_TYPE:
                {
                  if (enableScopeAPI) {
                    var _nextChildren10 = toArray(nextChild.props.children);
                    var _frame10 = {
                      type: null,
                      domNamespace: parentNamespace,
                      children: _nextChildren10,
                      childIndex: 0,
                      context: context,
                      footer: ''
                    };
                    {
                      _frame10.debugElementStack = [];
                    }
                    this.stack.push(_frame10);
                    return '';
                  }
                  (function () {
                    {
                      {
                        throw ReactError(Error("ReactDOMServer does not yet support scope components."));
                      }
                    }
                  })();
                }
            }
          }
          var info = '';
          {
            var owner = nextElement._owner;
            if (elementType === undefined || typeof elementType === 'object' && elementType !== null && Object.keys(elementType).length === 0) {
              info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and " + 'named imports.';
            }
            var ownerName = owner ? getComponentName(owner) : null;
            if (ownerName) {
              info += '\n\nCheck the render method of `' + ownerName + '`.';
            }
          }
          (function () {
            {
              {
                throw ReactError(Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " + (elementType == null ? elementType : typeof elementType) + "." + info));
              }
            }
          })();
        }
      };
      _proto.renderDOM = function renderDOM(element, context, parentNamespace) {
        var tag = element.type.toLowerCase();
        var namespace = parentNamespace;
        if (parentNamespace === Namespaces.html) {
          namespace = getIntrinsicNamespace(tag);
        }
        {
          if (namespace === Namespaces.html) {
            // Should this check be gated by parent namespace? Not sure we want to
            // allow <SVG> or <mATH>.
            !(tag === element.type) ? warning$1(false, '<%s /> is using incorrect casing. ' + 'Use PascalCase for React components, ' + 'or lowercase for HTML elements.', element.type) : void 0;
          }
        }
        validateDangerousTag(tag);
        var props = element.props;
        if (tag === 'input') {
          {
            ReactControlledValuePropTypes.checkPropTypes('input', props);
            if (props.checked !== undefined && props.defaultChecked !== undefined && !didWarnDefaultChecked) {
              warning$1(false, '%s contains an input of type %s with both checked and defaultChecked props. ' + 'Input elements must be either controlled or uncontrolled ' + '(specify either the checked prop, or the defaultChecked prop, but not ' + 'both). Decide between using a controlled or uncontrolled input ' + 'element and remove one of these props. More info: ' + 'https://fb.me/react-controlled-components', 'A component', props.type);
              didWarnDefaultChecked = true;
            }
            if (props.value !== undefined && props.defaultValue !== undefined && !didWarnDefaultInputValue) {
              warning$1(false, '%s contains an input of type %s with both value and defaultValue props. ' + 'Input elements must be either controlled or uncontrolled ' + '(specify either the value prop, or the defaultValue prop, but not ' + 'both). Decide between using a controlled or uncontrolled input ' + 'element and remove one of these props. More info: ' + 'https://fb.me/react-controlled-components', 'A component', props.type);
              didWarnDefaultInputValue = true;
            }
          }
          props = _assign({
            type: undefined
          }, props, {
            defaultChecked: undefined,
            defaultValue: undefined,
            value: props.value != null ? props.value : props.defaultValue,
            checked: props.checked != null ? props.checked : props.defaultChecked
          });
        } else if (tag === 'textarea') {
          {
            ReactControlledValuePropTypes.checkPropTypes('textarea', props);
            if (props.value !== undefined && props.defaultValue !== undefined && !didWarnDefaultTextareaValue) {
              warning$1(false, 'Textarea elements must be either controlled or uncontrolled ' + '(specify either the value prop, or the defaultValue prop, but not ' + 'both). Decide between using a controlled or uncontrolled textarea ' + 'and remove one of these props. More info: ' + 'https://fb.me/react-controlled-components');
              didWarnDefaultTextareaValue = true;
            }
          }
          var initialValue = props.value;
          if (initialValue == null) {
            var defaultValue = props.defaultValue; // TODO (yungsters): Remove support for children content in <textarea>.

            var textareaChildren = props.children;
            if (textareaChildren != null) {
              {
                warning$1(false, 'Use the `defaultValue` or `value` props instead of setting ' + 'children on <textarea>.');
              }
              (function () {
                if (!(defaultValue == null)) {
                  {
                    throw ReactError(Error("If you supply `defaultValue` on a <textarea>, do not pass children."));
                  }
                }
              })();
              if (Array.isArray(textareaChildren)) {
                (function () {
                  if (!(textareaChildren.length <= 1)) {
                    {
                      throw ReactError(Error("<textarea> can only have at most one child."));
                    }
                  }
                })();
                textareaChildren = textareaChildren[0];
              }
              defaultValue = '' + textareaChildren;
            }
            if (defaultValue == null) {
              defaultValue = '';
            }
            initialValue = defaultValue;
          }
          props = _assign({}, props, {
            value: undefined,
            children: '' + initialValue
          });
        } else if (tag === 'select') {
          {
            ReactControlledValuePropTypes.checkPropTypes('select', props);
            for (var i = 0; i < valuePropNames.length; i++) {
              var propName = valuePropNames[i];
              if (props[propName] == null) {
                continue;
              }
              var isArray = Array.isArray(props[propName]);
              if (props.multiple && !isArray) {
                warning$1(false, 'The `%s` prop supplied to <select> must be an array if ' + '`multiple` is true.', propName);
              } else if (!props.multiple && isArray) {
                warning$1(false, 'The `%s` prop supplied to <select> must be a scalar ' + 'value if `multiple` is false.', propName);
              }
            }
            if (props.value !== undefined && props.defaultValue !== undefined && !didWarnDefaultSelectValue) {
              warning$1(false, 'Select elements must be either controlled or uncontrolled ' + '(specify either the value prop, or the defaultValue prop, but not ' + 'both). Decide between using a controlled or uncontrolled select ' + 'element and remove one of these props. More info: ' + 'https://fb.me/react-controlled-components');
              didWarnDefaultSelectValue = true;
            }
          }
          this.currentSelectValue = props.value != null ? props.value : props.defaultValue;
          props = _assign({}, props, {
            value: undefined
          });
        } else if (tag === 'option') {
          var selected = null;
          var selectValue = this.currentSelectValue;
          var optionChildren = flattenOptionChildren(props.children);
          if (selectValue != null) {
            var value;
            if (props.value != null) {
              value = props.value + '';
            } else {
              value = optionChildren;
            }
            selected = false;
            if (Array.isArray(selectValue)) {
              // multiple
              for (var j = 0; j < selectValue.length; j++) {
                if ('' + selectValue[j] === value) {
                  selected = true;
                  break;
                }
              }
            } else {
              selected = '' + selectValue === value;
            }
            props = _assign({
              selected: undefined,
              children: undefined
            }, props, {
              selected: selected,
              children: optionChildren
            });
          }
        }
        {
          validatePropertiesInDevelopment(tag, props);
        }
        assertValidProps(tag, props);
        var out = createOpenTagMarkup(element.type, tag, props, namespace, this.makeStaticMarkup, this.stack.length === 1);
        var footer = '';
        if (omittedCloseTags.hasOwnProperty(tag)) {
          out += '/>';
        } else {
          out += '>';
          footer = '</' + element.type + '>';
        }
        var children;
        var innerMarkup = getNonChildrenInnerMarkup(props);
        if (innerMarkup != null) {
          children = [];
          if (newlineEatingTags[tag] && innerMarkup.charAt(0) === '\n') {
            // text/html ignores the first character in these tags if it's a newline
            // Prefer to break application/xml over text/html (for now) by adding
            // a newline specifically to get eaten by the parser. (Alternately for
            // textareas, replacing "^\n" with "\r\n" doesn't get eaten, and the first
            // \r is normalized out by HTMLTextAreaElement#value.)
            // See: <http://www.w3.org/TR/html-polyglot/#newlines-in-textarea-and-pre>
            // See: <http://www.w3.org/TR/html5/syntax.html#element-restrictions>
            // See: <http://www.w3.org/TR/html5/syntax.html#newlines>
            // See: Parsing of "textarea" "listing" and "pre" elements
            //  from <http://www.w3.org/TR/html5/syntax.html#parsing-main-inbody>
            out += '\n';
          }
          out += innerMarkup;
        } else {
          children = toArray(props.children);
        }
        var frame = {
          domNamespace: getChildNamespace(parentNamespace, element.type),
          type: tag,
          children: children,
          childIndex: 0,
          context: context,
          footer: footer
        };
        {
          frame.debugElementStack = [];
        }
        this.stack.push(frame);
        this.previousWasTextNode = false;
        return out;
      };
      return ReactDOMServerRenderer;
    }();

    /**
     * Render a ReactElement to its initial HTML. This should only be used on the
     * server.
     * See https://reactjs.org/docs/react-dom-server.html#rendertostring
     */

    function renderToString(element) {
      var renderer = new ReactDOMServerRenderer(element, false);
      try {
        var markup = renderer.read(Infinity);
        return markup;
      } finally {
        renderer.destroy();
      }
    }
    /**
     * Similar to renderToString, except this doesn't create extra DOM attributes
     * such as data-react-id that React uses internally.
     * See https://reactjs.org/docs/react-dom-server.html#rendertostaticmarkup
     */

    function renderToStaticMarkup(element) {
      var renderer = new ReactDOMServerRenderer(element, true);
      try {
        var markup = renderer.read(Infinity);
        return markup;
      } finally {
        renderer.destroy();
      }
    }
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      subClass.__proto__ = superClass;
    }
    var ReactMarkupReadableStream = /*#__PURE__*/
    function (_Readable) {
      _inheritsLoose(ReactMarkupReadableStream, _Readable);
      function ReactMarkupReadableStream(element, makeStaticMarkup) {
        var _this;

        // Calls the stream.Readable(options) constructor. Consider exposing built-in
        // features like highWaterMark in the future.
        _this = _Readable.call(this, {}) || this;
        _this.partialRenderer = new ReactDOMServerRenderer(element, makeStaticMarkup);
        return _this;
      }
      var _proto = ReactMarkupReadableStream.prototype;
      _proto._destroy = function _destroy(err, callback) {
        this.partialRenderer.destroy();
        callback(err);
      };
      _proto._read = function _read(size) {
        try {
          this.push(this.partialRenderer.read(size));
        } catch (err) {
          this.destroy(err);
        }
      };
      return ReactMarkupReadableStream;
    }(stream.Readable);
    /**
     * Render a ReactElement to its initial HTML. This should only be used on the
     * server.
     * See https://reactjs.org/docs/react-dom-server.html#rendertonodestream
     */

    function renderToNodeStream(element) {
      return new ReactMarkupReadableStream(element, false);
    }
    /**
     * Similar to renderToNodeStream, except this doesn't create extra DOM attributes
     * such as data-react-id that React uses internally.
     * See https://reactjs.org/docs/react-dom-server.html#rendertostaticnodestream
     */

    function renderToStaticNodeStream(element) {
      return new ReactMarkupReadableStream(element, true);
    }
    var ReactDOMServerNode = {
      renderToString: renderToString,
      renderToStaticMarkup: renderToStaticMarkup,
      renderToNodeStream: renderToNodeStream,
      renderToStaticNodeStream: renderToStaticNodeStream,
      version: ReactVersion
    };
    var ReactDOMServerNode$1 = Object.freeze({
      default: ReactDOMServerNode
    });
    var ReactDOMServer = ReactDOMServerNode$1 && ReactDOMServerNode || ReactDOMServerNode$1;

    // TODO: decide on the top-level export form.
    // This is hacky but makes it work with both Rollup and Jest

    var server_node = ReactDOMServer.default || ReactDOMServer;
    module.exports = server_node;
  })();
}

/***/ }),

/***/ "./node_modules/react-dom/server.js":
/*!******************************************!*\
  !*** ./node_modules/react-dom/server.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(/*! ./server.node */ "./node_modules/react-dom/server.node.js");

/***/ }),

/***/ "./node_modules/react-dom/server.node.js":
/*!***********************************************!*\
  !*** ./node_modules/react-dom/server.node.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react-dom-server.node.development.js */ "./node_modules/react-dom/cjs/react-dom-server.node.development.js");
}

/***/ }),

/***/ "./node_modules/react/cjs/react.development.js":
/*!*****************************************************!*\
  !*** ./node_modules/react/cjs/react.development.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v16.10.1
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (true) {
  (function () {
    'use strict';

    var _assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");
    var checkPropTypes = __webpack_require__(/*! prop-types/checkPropTypes */ "./node_modules/prop-types/checkPropTypes.js");

    // TODO: this is special because it gets imported during build.

    var ReactVersion = '16.10.1';

    // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
    // nor polyfill, then a plain number is used for performance.
    var hasSymbol = typeof Symbol === 'function' && Symbol.for;
    var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
    var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
    var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
    var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
    var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
    var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
    var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
    // (unstable) APIs that have been removed. Can we remove the symbols?

    var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
    var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
    var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
    var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
    var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
    var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
    var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
    var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
    var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;
    var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
    var FAUX_ITERATOR_SYMBOL = '@@iterator';
    function getIteratorFn(maybeIterable) {
      if (maybeIterable === null || typeof maybeIterable !== 'object') {
        return null;
      }
      var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
      if (typeof maybeIterator === 'function') {
        return maybeIterator;
      }
      return null;
    }

    // Do not require this module directly! Use normal `invariant` calls with
    // template literal strings. The messages will be converted to ReactError during
    // build, and in production they will be minified.

    // Do not require this module directly! Use normal `invariant` calls with
    // template literal strings. The messages will be converted to ReactError during
    // build, and in production they will be minified.
    function ReactError(error) {
      error.name = 'Invariant Violation';
      return error;
    }

    /**
     * Use invariant() to assert state which your program assumes to be true.
     *
     * Provide sprintf-style format (only %s is supported) and arguments
     * to provide information about what broke and what you were
     * expecting.
     *
     * The invariant message will be stripped in production, but the invariant
     * will remain to ensure logic does not differ in production.
     */

    /**
     * Forked from fbjs/warning:
     * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
     *
     * Only change is we use console.warn instead of console.error,
     * and do nothing when 'console' is not supported.
     * This really simplifies the code.
     * ---
     * Similar to invariant but only logs a warning if the condition is not met.
     * This can be used to log issues in development environments in critical
     * paths. Removing the logging code for production environments will keep the
     * same logic and follow the same code paths.
     */
    var lowPriorityWarningWithoutStack = function () {};
    {
      var printWarning = function (format) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        var argIndex = 0;
        var message = 'Warning: ' + format.replace(/%s/g, function () {
          return args[argIndex++];
        });
        if (typeof console !== 'undefined') {
          console.warn(message);
        }
        try {
          // --- Welcome to debugging React ---
          // This error was thrown as a convenience so that you can use this stack
          // to find the callsite that caused this warning to fire.
          throw new Error(message);
        } catch (x) {}
      };
      lowPriorityWarningWithoutStack = function (condition, format) {
        if (format === undefined) {
          throw new Error('`lowPriorityWarningWithoutStack(condition, format, ...args)` requires a warning ' + 'message argument');
        }
        if (!condition) {
          for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
            args[_key2 - 2] = arguments[_key2];
          }
          printWarning.apply(void 0, [format].concat(args));
        }
      };
    }
    var lowPriorityWarningWithoutStack$1 = lowPriorityWarningWithoutStack;

    /**
     * Similar to invariant but only logs a warning if the condition is not met.
     * This can be used to log issues in development environments in critical
     * paths. Removing the logging code for production environments will keep the
     * same logic and follow the same code paths.
     */
    var warningWithoutStack = function () {};
    {
      warningWithoutStack = function (condition, format) {
        for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }
        if (format === undefined) {
          throw new Error('`warningWithoutStack(condition, format, ...args)` requires a warning ' + 'message argument');
        }
        if (args.length > 8) {
          // Check before the condition to catch violations early.
          throw new Error('warningWithoutStack() currently supports at most 8 arguments.');
        }
        if (condition) {
          return;
        }
        if (typeof console !== 'undefined') {
          var argsWithFormat = args.map(function (item) {
            return '' + item;
          });
          argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
          // breaks IE9: https://github.com/facebook/react/issues/13610

          Function.prototype.apply.call(console.error, console, argsWithFormat);
        }
        try {
          // --- Welcome to debugging React ---
          // This error was thrown as a convenience so that you can use this stack
          // to find the callsite that caused this warning to fire.
          var argIndex = 0;
          var message = 'Warning: ' + format.replace(/%s/g, function () {
            return args[argIndex++];
          });
          throw new Error(message);
        } catch (x) {}
      };
    }
    var warningWithoutStack$1 = warningWithoutStack;
    var didWarnStateUpdateForUnmountedComponent = {};
    function warnNoop(publicInstance, callerName) {
      {
        var _constructor = publicInstance.constructor;
        var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
        var warningKey = componentName + "." + callerName;
        if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
          return;
        }
        warningWithoutStack$1(false, "Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);
        didWarnStateUpdateForUnmountedComponent[warningKey] = true;
      }
    }
    /**
     * This is the abstract API for an update queue.
     */

    var ReactNoopUpdateQueue = {
      /**
       * Checks whether or not this composite component is mounted.
       * @param {ReactClass} publicInstance The instance we want to test.
       * @return {boolean} True if mounted, false otherwise.
       * @protected
       * @final
       */
      isMounted: function (publicInstance) {
        return false;
      },
      /**
       * Forces an update. This should only be invoked when it is known with
       * certainty that we are **not** in a DOM transaction.
       *
       * You may want to call this when you know that some deeper aspect of the
       * component's state has changed but `setState` was not called.
       *
       * This will not invoke `shouldComponentUpdate`, but it will invoke
       * `componentWillUpdate` and `componentDidUpdate`.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {?function} callback Called after component is updated.
       * @param {?string} callerName name of the calling function in the public API.
       * @internal
       */
      enqueueForceUpdate: function (publicInstance, callback, callerName) {
        warnNoop(publicInstance, 'forceUpdate');
      },
      /**
       * Replaces all of the state. Always use this or `setState` to mutate state.
       * You should treat `this.state` as immutable.
       *
       * There is no guarantee that `this.state` will be immediately updated, so
       * accessing `this.state` after calling this method may return the old value.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {object} completeState Next state.
       * @param {?function} callback Called after component is updated.
       * @param {?string} callerName name of the calling function in the public API.
       * @internal
       */
      enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
        warnNoop(publicInstance, 'replaceState');
      },
      /**
       * Sets a subset of the state. This only exists because _pendingState is
       * internal. This provides a merging strategy that is not available to deep
       * properties which is confusing. TODO: Expose pendingState or don't use it
       * during the merge.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {object} partialState Next partial state to be merged with state.
       * @param {?function} callback Called after component is updated.
       * @param {?string} Name of the calling function in the public API.
       * @internal
       */
      enqueueSetState: function (publicInstance, partialState, callback, callerName) {
        warnNoop(publicInstance, 'setState');
      }
    };
    var emptyObject = {};
    {
      Object.freeze(emptyObject);
    }
    /**
     * Base class helpers for the updating state of a component.
     */

    function Component(props, context, updater) {
      this.props = props;
      this.context = context; // If a component has string refs, we will assign a different object later.

      this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
      // renderer.

      this.updater = updater || ReactNoopUpdateQueue;
    }
    Component.prototype.isReactComponent = {};
    /**
     * Sets a subset of the state. Always use this to mutate
     * state. You should treat `this.state` as immutable.
     *
     * There is no guarantee that `this.state` will be immediately updated, so
     * accessing `this.state` after calling this method may return the old value.
     *
     * There is no guarantee that calls to `setState` will run synchronously,
     * as they may eventually be batched together.  You can provide an optional
     * callback that will be executed when the call to setState is actually
     * completed.
     *
     * When a function is provided to setState, it will be called at some point in
     * the future (not synchronously). It will be called with the up to date
     * component arguments (state, props, context). These values can be different
     * from this.* because your function may be called after receiveProps but before
     * shouldComponentUpdate, and this new state, props, and context will not yet be
     * assigned to this.
     *
     * @param {object|function} partialState Next partial state or function to
     *        produce next partial state to be merged with current state.
     * @param {?function} callback Called after state is updated.
     * @final
     * @protected
     */

    Component.prototype.setState = function (partialState, callback) {
      (function () {
        if (!(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null)) {
          {
            throw ReactError(Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables."));
          }
        }
      })();
      this.updater.enqueueSetState(this, partialState, callback, 'setState');
    };
    /**
     * Forces an update. This should only be invoked when it is known with
     * certainty that we are **not** in a DOM transaction.
     *
     * You may want to call this when you know that some deeper aspect of the
     * component's state has changed but `setState` was not called.
     *
     * This will not invoke `shouldComponentUpdate`, but it will invoke
     * `componentWillUpdate` and `componentDidUpdate`.
     *
     * @param {?function} callback Called after update is complete.
     * @final
     * @protected
     */

    Component.prototype.forceUpdate = function (callback) {
      this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
    };
    /**
     * Deprecated APIs. These APIs used to exist on classic React classes but since
     * we would like to deprecate them, we're not going to move them over to this
     * modern base class. Instead, we define a getter that warns if it's accessed.
     */

    {
      var deprecatedAPIs = {
        isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
        replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
      };
      var defineDeprecationWarning = function (methodName, info) {
        Object.defineProperty(Component.prototype, methodName, {
          get: function () {
            lowPriorityWarningWithoutStack$1(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);
            return undefined;
          }
        });
      };
      for (var fnName in deprecatedAPIs) {
        if (deprecatedAPIs.hasOwnProperty(fnName)) {
          defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
        }
      }
    }
    function ComponentDummy() {}
    ComponentDummy.prototype = Component.prototype;
    /**
     * Convenience component with default shallow equality check for sCU.
     */

    function PureComponent(props, context, updater) {
      this.props = props;
      this.context = context; // If a component has string refs, we will assign a different object later.

      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
    pureComponentPrototype.constructor = PureComponent; // Avoid an extra prototype jump for these methods.

    _assign(pureComponentPrototype, Component.prototype);
    pureComponentPrototype.isPureReactComponent = true;

    // an immutable object with a single mutable value
    function createRef() {
      var refObject = {
        current: null
      };
      {
        Object.seal(refObject);
      }
      return refObject;
    }

    /**
     * Keeps track of the current dispatcher.
     */
    var ReactCurrentDispatcher = {
      /**
       * @internal
       * @type {ReactComponent}
       */
      current: null
    };

    /**
     * Keeps track of the current batch's configuration such as how long an update
     * should suspend for if it needs to.
     */
    var ReactCurrentBatchConfig = {
      suspense: null
    };

    /**
     * Keeps track of the current owner.
     *
     * The current owner is the component who should own any components that are
     * currently being constructed.
     */
    var ReactCurrentOwner = {
      /**
       * @internal
       * @type {ReactComponent}
       */
      current: null
    };
    var BEFORE_SLASH_RE = /^(.*)[\\\/]/;
    var describeComponentFrame = function (name, source, ownerName) {
      var sourceInfo = '';
      if (source) {
        var path = source.fileName;
        var fileName = path.replace(BEFORE_SLASH_RE, '');
        {
          // In DEV, include code for a common special case:
          // prefer "folder/index.js" instead of just "index.js".
          if (/^index\./.test(fileName)) {
            var match = path.match(BEFORE_SLASH_RE);
            if (match) {
              var pathBeforeSlash = match[1];
              if (pathBeforeSlash) {
                var folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, '');
                fileName = folderName + '/' + fileName;
              }
            }
          }
        }
        sourceInfo = ' (at ' + fileName + ':' + source.lineNumber + ')';
      } else if (ownerName) {
        sourceInfo = ' (created by ' + ownerName + ')';
      }
      return '\n    in ' + (name || 'Unknown') + sourceInfo;
    };
    var Resolved = 1;
    function refineResolvedLazyComponent(lazyComponent) {
      return lazyComponent._status === Resolved ? lazyComponent._result : null;
    }
    function getWrappedName(outerType, innerType, wrapperName) {
      var functionName = innerType.displayName || innerType.name || '';
      return outerType.displayName || (functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName);
    }
    function getComponentName(type) {
      if (type == null) {
        // Host root, text node or just invalid type.
        return null;
      }
      {
        if (typeof type.tag === 'number') {
          warningWithoutStack$1(false, 'Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
        }
      }
      if (typeof type === 'function') {
        return type.displayName || type.name || null;
      }
      if (typeof type === 'string') {
        return type;
      }
      switch (type) {
        case REACT_FRAGMENT_TYPE:
          return 'Fragment';
        case REACT_PORTAL_TYPE:
          return 'Portal';
        case REACT_PROFILER_TYPE:
          return "Profiler";
        case REACT_STRICT_MODE_TYPE:
          return 'StrictMode';
        case REACT_SUSPENSE_TYPE:
          return 'Suspense';
        case REACT_SUSPENSE_LIST_TYPE:
          return 'SuspenseList';
      }
      if (typeof type === 'object') {
        switch (type.$$typeof) {
          case REACT_CONTEXT_TYPE:
            return 'Context.Consumer';
          case REACT_PROVIDER_TYPE:
            return 'Context.Provider';
          case REACT_FORWARD_REF_TYPE:
            return getWrappedName(type, type.render, 'ForwardRef');
          case REACT_MEMO_TYPE:
            return getComponentName(type.type);
          case REACT_LAZY_TYPE:
            {
              var thenable = type;
              var resolvedThenable = refineResolvedLazyComponent(thenable);
              if (resolvedThenable) {
                return getComponentName(resolvedThenable);
              }
              break;
            }
        }
      }
      return null;
    }
    var ReactDebugCurrentFrame = {};
    var currentlyValidatingElement = null;
    function setCurrentlyValidatingElement(element) {
      {
        currentlyValidatingElement = element;
      }
    }
    {
      // Stack implementation injected by the current renderer.
      ReactDebugCurrentFrame.getCurrentStack = null;
      ReactDebugCurrentFrame.getStackAddendum = function () {
        var stack = ''; // Add an extra top frame while an element is being validated

        if (currentlyValidatingElement) {
          var name = getComponentName(currentlyValidatingElement.type);
          var owner = currentlyValidatingElement._owner;
          stack += describeComponentFrame(name, currentlyValidatingElement._source, owner && getComponentName(owner.type));
        } // Delegate to the injected renderer-specific implementation

        var impl = ReactDebugCurrentFrame.getCurrentStack;
        if (impl) {
          stack += impl() || '';
        }
        return stack;
      };
    }

    /**
     * Used by act() to track whether you're inside an act() scope.
     */
    var IsSomeRendererActing = {
      current: false
    };
    var ReactSharedInternals = {
      ReactCurrentDispatcher: ReactCurrentDispatcher,
      ReactCurrentBatchConfig: ReactCurrentBatchConfig,
      ReactCurrentOwner: ReactCurrentOwner,
      IsSomeRendererActing: IsSomeRendererActing,
      // Used by renderers to avoid bundling object-assign twice in UMD bundles:
      assign: _assign
    };
    {
      _assign(ReactSharedInternals, {
        // These should not be included in production.
        ReactDebugCurrentFrame: ReactDebugCurrentFrame,
        // Shim for React DOM 16.0.0 which still destructured (but not used) this.
        // TODO: remove in React 17.0.
        ReactComponentTreeHook: {}
      });
    }

    /**
     * Similar to invariant but only logs a warning if the condition is not met.
     * This can be used to log issues in development environments in critical
     * paths. Removing the logging code for production environments will keep the
     * same logic and follow the same code paths.
     */

    var warning = warningWithoutStack$1;
    {
      warning = function (condition, format) {
        if (condition) {
          return;
        }
        var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
        var stack = ReactDebugCurrentFrame.getStackAddendum(); // eslint-disable-next-line react-internal/warning-and-invariant-args

        for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }
        warningWithoutStack$1.apply(void 0, [false, format + '%s'].concat(args, [stack]));
      };
    }
    var warning$1 = warning;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var RESERVED_PROPS = {
      key: true,
      ref: true,
      __self: true,
      __source: true
    };
    var specialPropKeyWarningShown;
    var specialPropRefWarningShown;
    function hasValidRef(config) {
      {
        if (hasOwnProperty.call(config, 'ref')) {
          var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
          if (getter && getter.isReactWarning) {
            return false;
          }
        }
      }
      return config.ref !== undefined;
    }
    function hasValidKey(config) {
      {
        if (hasOwnProperty.call(config, 'key')) {
          var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
          if (getter && getter.isReactWarning) {
            return false;
          }
        }
      }
      return config.key !== undefined;
    }
    function defineKeyPropWarningGetter(props, displayName) {
      var warnAboutAccessingKey = function () {
        if (!specialPropKeyWarningShown) {
          specialPropKeyWarningShown = true;
          warningWithoutStack$1(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
        }
      };
      warnAboutAccessingKey.isReactWarning = true;
      Object.defineProperty(props, 'key', {
        get: warnAboutAccessingKey,
        configurable: true
      });
    }
    function defineRefPropWarningGetter(props, displayName) {
      var warnAboutAccessingRef = function () {
        if (!specialPropRefWarningShown) {
          specialPropRefWarningShown = true;
          warningWithoutStack$1(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
        }
      };
      warnAboutAccessingRef.isReactWarning = true;
      Object.defineProperty(props, 'ref', {
        get: warnAboutAccessingRef,
        configurable: true
      });
    }
    /**
     * Factory method to create a new React element. This no longer adheres to
     * the class pattern, so do not use new to call it. Also, no instanceof check
     * will work. Instead test $$typeof field against Symbol.for('react.element') to check
     * if something is a React Element.
     *
     * @param {*} type
     * @param {*} props
     * @param {*} key
     * @param {string|object} ref
     * @param {*} owner
     * @param {*} self A *temporary* helper to detect places where `this` is
     * different from the `owner` when React.createElement is called, so that we
     * can warn. We want to get rid of owner and replace string `ref`s with arrow
     * functions, and as long as `this` and owner are the same, there will be no
     * change in behavior.
     * @param {*} source An annotation object (added by a transpiler or otherwise)
     * indicating filename, line number, and/or other information.
     * @internal
     */

    var ReactElement = function (type, key, ref, self, source, owner, props) {
      var element = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: REACT_ELEMENT_TYPE,
        // Built-in properties that belong on the element
        type: type,
        key: key,
        ref: ref,
        props: props,
        // Record the component responsible for creating this element.
        _owner: owner
      };
      {
        // The validation flag is currently mutative. We put it on
        // an external backing store so that we can freeze the whole object.
        // This can be replaced with a WeakMap once they are implemented in
        // commonly used development environments.
        element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
        // the validation flag non-enumerable (where possible, which should
        // include every environment we run tests in), so the test framework
        // ignores it.

        Object.defineProperty(element._store, 'validated', {
          configurable: false,
          enumerable: false,
          writable: true,
          value: false
        }); // self and source are DEV only properties.

        Object.defineProperty(element, '_self', {
          configurable: false,
          enumerable: false,
          writable: false,
          value: self
        }); // Two elements created in two different places should be considered
        // equal for testing purposes and therefore we hide it from enumeration.

        Object.defineProperty(element, '_source', {
          configurable: false,
          enumerable: false,
          writable: false,
          value: source
        });
        if (Object.freeze) {
          Object.freeze(element.props);
          Object.freeze(element);
        }
      }
      return element;
    };
    /**
     * https://github.com/reactjs/rfcs/pull/107
     * @param {*} type
     * @param {object} props
     * @param {string} key
     */

    /**
     * https://github.com/reactjs/rfcs/pull/107
     * @param {*} type
     * @param {object} props
     * @param {string} key
     */

    function jsxDEV(type, config, maybeKey, source, self) {
      var propName; // Reserved names are extracted

      var props = {};
      var key = null;
      var ref = null; // Currently, key can be spread in as a prop. This causes a potential
      // issue if key is also explicitly declared (ie. <div {...props} key="Hi" />
      // or <div key="Hi" {...props} /> ). We want to deprecate key spread,
      // but as an intermediary step, we will use jsxDEV for everything except
      // <div {...props} key="Hi" />, because we aren't currently able to tell if
      // key is explicitly declared to be undefined or not.

      if (maybeKey !== undefined) {
        key = '' + maybeKey;
      }
      if (hasValidKey(config)) {
        key = '' + config.key;
      }
      if (hasValidRef(config)) {
        ref = config.ref;
      } // Remaining properties are added to a new props object

      for (propName in config) {
        if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
          props[propName] = config[propName];
        }
      } // Resolve default props

      if (type && type.defaultProps) {
        var defaultProps = type.defaultProps;
        for (propName in defaultProps) {
          if (props[propName] === undefined) {
            props[propName] = defaultProps[propName];
          }
        }
      }
      if (key || ref) {
        var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
        if (key) {
          defineKeyPropWarningGetter(props, displayName);
        }
        if (ref) {
          defineRefPropWarningGetter(props, displayName);
        }
      }
      return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
    }
    /**
     * Create and return a new ReactElement of the given type.
     * See https://reactjs.org/docs/react-api.html#createelement
     */

    function createElement(type, config, children) {
      var propName; // Reserved names are extracted

      var props = {};
      var key = null;
      var ref = null;
      var self = null;
      var source = null;
      if (config != null) {
        if (hasValidRef(config)) {
          ref = config.ref;
        }
        if (hasValidKey(config)) {
          key = '' + config.key;
        }
        self = config.__self === undefined ? null : config.__self;
        source = config.__source === undefined ? null : config.__source; // Remaining properties are added to a new props object

        for (propName in config) {
          if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
            props[propName] = config[propName];
          }
        }
      } // Children can be more than one argument, and those are transferred onto
      // the newly allocated props object.

      var childrenLength = arguments.length - 2;
      if (childrenLength === 1) {
        props.children = children;
      } else if (childrenLength > 1) {
        var childArray = Array(childrenLength);
        for (var i = 0; i < childrenLength; i++) {
          childArray[i] = arguments[i + 2];
        }
        {
          if (Object.freeze) {
            Object.freeze(childArray);
          }
        }
        props.children = childArray;
      } // Resolve default props

      if (type && type.defaultProps) {
        var defaultProps = type.defaultProps;
        for (propName in defaultProps) {
          if (props[propName] === undefined) {
            props[propName] = defaultProps[propName];
          }
        }
      }
      {
        if (key || ref) {
          var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
          if (key) {
            defineKeyPropWarningGetter(props, displayName);
          }
          if (ref) {
            defineRefPropWarningGetter(props, displayName);
          }
        }
      }
      return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
    }
    /**
     * Return a function that produces ReactElements of a given type.
     * See https://reactjs.org/docs/react-api.html#createfactory
     */

    function cloneAndReplaceKey(oldElement, newKey) {
      var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
      return newElement;
    }
    /**
     * Clone and return a new ReactElement using element as the starting point.
     * See https://reactjs.org/docs/react-api.html#cloneelement
     */

    function cloneElement(element, config, children) {
      (function () {
        if (!!(element === null || element === undefined)) {
          {
            throw ReactError(Error("React.cloneElement(...): The argument must be a React element, but you passed " + element + "."));
          }
        }
      })();
      var propName; // Original props are copied

      var props = _assign({}, element.props); // Reserved names are extracted

      var key = element.key;
      var ref = element.ref; // Self is preserved since the owner is preserved.

      var self = element._self; // Source is preserved since cloneElement is unlikely to be targeted by a
      // transpiler, and the original source is probably a better indicator of the
      // true owner.

      var source = element._source; // Owner will be preserved, unless ref is overridden

      var owner = element._owner;
      if (config != null) {
        if (hasValidRef(config)) {
          // Silently steal the ref from the parent.
          ref = config.ref;
          owner = ReactCurrentOwner.current;
        }
        if (hasValidKey(config)) {
          key = '' + config.key;
        } // Remaining properties override existing props

        var defaultProps;
        if (element.type && element.type.defaultProps) {
          defaultProps = element.type.defaultProps;
        }
        for (propName in config) {
          if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
            if (config[propName] === undefined && defaultProps !== undefined) {
              // Resolve default props
              props[propName] = defaultProps[propName];
            } else {
              props[propName] = config[propName];
            }
          }
        }
      } // Children can be more than one argument, and those are transferred onto
      // the newly allocated props object.

      var childrenLength = arguments.length - 2;
      if (childrenLength === 1) {
        props.children = children;
      } else if (childrenLength > 1) {
        var childArray = Array(childrenLength);
        for (var i = 0; i < childrenLength; i++) {
          childArray[i] = arguments[i + 2];
        }
        props.children = childArray;
      }
      return ReactElement(element.type, key, ref, self, source, owner, props);
    }
    /**
     * Verifies the object is a ReactElement.
     * See https://reactjs.org/docs/react-api.html#isvalidelement
     * @param {?object} object
     * @return {boolean} True if `object` is a ReactElement.
     * @final
     */

    function isValidElement(object) {
      return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var SEPARATOR = '.';
    var SUBSEPARATOR = ':';
    /**
     * Escape and wrap key so it is safe to use as a reactid
     *
     * @param {string} key to be escaped.
     * @return {string} the escaped key.
     */

    function escape(key) {
      var escapeRegex = /[=:]/g;
      var escaperLookup = {
        '=': '=0',
        ':': '=2'
      };
      var escapedString = ('' + key).replace(escapeRegex, function (match) {
        return escaperLookup[match];
      });
      return '$' + escapedString;
    }
    /**
     * TODO: Test that a single child and an array with one item have the same key
     * pattern.
     */

    var didWarnAboutMaps = false;
    var userProvidedKeyEscapeRegex = /\/+/g;
    function escapeUserProvidedKey(text) {
      return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
    }
    var POOL_SIZE = 10;
    var traverseContextPool = [];
    function getPooledTraverseContext(mapResult, keyPrefix, mapFunction, mapContext) {
      if (traverseContextPool.length) {
        var traverseContext = traverseContextPool.pop();
        traverseContext.result = mapResult;
        traverseContext.keyPrefix = keyPrefix;
        traverseContext.func = mapFunction;
        traverseContext.context = mapContext;
        traverseContext.count = 0;
        return traverseContext;
      } else {
        return {
          result: mapResult,
          keyPrefix: keyPrefix,
          func: mapFunction,
          context: mapContext,
          count: 0
        };
      }
    }
    function releaseTraverseContext(traverseContext) {
      traverseContext.result = null;
      traverseContext.keyPrefix = null;
      traverseContext.func = null;
      traverseContext.context = null;
      traverseContext.count = 0;
      if (traverseContextPool.length < POOL_SIZE) {
        traverseContextPool.push(traverseContext);
      }
    }
    /**
     * @param {?*} children Children tree container.
     * @param {!string} nameSoFar Name of the key path so far.
     * @param {!function} callback Callback to invoke with each child found.
     * @param {?*} traverseContext Used to pass information throughout the traversal
     * process.
     * @return {!number} The number of children in this subtree.
     */

    function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
      var type = typeof children;
      if (type === 'undefined' || type === 'boolean') {
        // All of the above are perceived as null.
        children = null;
      }
      var invokeCallback = false;
      if (children === null) {
        invokeCallback = true;
      } else {
        switch (type) {
          case 'string':
          case 'number':
            invokeCallback = true;
            break;
          case 'object':
            switch (children.$$typeof) {
              case REACT_ELEMENT_TYPE:
              case REACT_PORTAL_TYPE:
                invokeCallback = true;
            }
        }
      }
      if (invokeCallback) {
        callback(traverseContext, children,
        // If it's the only child, treat the name as if it was wrapped in an array
        // so that it's consistent if the number of children grows.
        nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
        return 1;
      }
      var child;
      var nextName;
      var subtreeCount = 0; // Count of children found in the current subtree.

      var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;
      if (Array.isArray(children)) {
        for (var i = 0; i < children.length; i++) {
          child = children[i];
          nextName = nextNamePrefix + getComponentKey(child, i);
          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
        }
      } else {
        var iteratorFn = getIteratorFn(children);
        if (typeof iteratorFn === 'function') {
          {
            // Warn about using Maps as children
            if (iteratorFn === children.entries) {
              !didWarnAboutMaps ? warning$1(false, 'Using Maps as children is unsupported and will likely yield ' + 'unexpected results. Convert it to a sequence/iterable of keyed ' + 'ReactElements instead.') : void 0;
              didWarnAboutMaps = true;
            }
          }
          var iterator = iteratorFn.call(children);
          var step;
          var ii = 0;
          while (!(step = iterator.next()).done) {
            child = step.value;
            nextName = nextNamePrefix + getComponentKey(child, ii++);
            subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
          }
        } else if (type === 'object') {
          var addendum = '';
          {
            addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + ReactDebugCurrentFrame.getStackAddendum();
          }
          var childrenString = '' + children;
          (function () {
            {
              {
                throw ReactError(Error("Objects are not valid as a React child (found: " + (childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString) + ")." + addendum));
              }
            }
          })();
        }
      }
      return subtreeCount;
    }
    /**
     * Traverses children that are typically specified as `props.children`, but
     * might also be specified through attributes:
     *
     * - `traverseAllChildren(this.props.children, ...)`
     * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
     *
     * The `traverseContext` is an optional argument that is passed through the
     * entire traversal. It can be used to store accumulations or anything else that
     * the callback might find relevant.
     *
     * @param {?*} children Children tree object.
     * @param {!function} callback To invoke upon traversing each child.
     * @param {?*} traverseContext Context for traversal.
     * @return {!number} The number of children in this subtree.
     */

    function traverseAllChildren(children, callback, traverseContext) {
      if (children == null) {
        return 0;
      }
      return traverseAllChildrenImpl(children, '', callback, traverseContext);
    }
    /**
     * Generate a key string that identifies a component within a set.
     *
     * @param {*} component A component that could contain a manual key.
     * @param {number} index Index that is used if a manual key is not provided.
     * @return {string}
     */

    function getComponentKey(component, index) {
      // Do some typechecking here since we call this blindly. We want to ensure
      // that we don't block potential future ES APIs.
      if (typeof component === 'object' && component !== null && component.key != null) {
        // Explicit key
        return escape(component.key);
      } // Implicit key determined by the index in the set

      return index.toString(36);
    }
    function forEachSingleChild(bookKeeping, child, name) {
      var func = bookKeeping.func,
        context = bookKeeping.context;
      func.call(context, child, bookKeeping.count++);
    }
    /**
     * Iterates through children that are typically specified as `props.children`.
     *
     * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
     *
     * The provided forEachFunc(child, index) will be called for each
     * leaf child.
     *
     * @param {?*} children Children tree container.
     * @param {function(*, int)} forEachFunc
     * @param {*} forEachContext Context for forEachContext.
     */

    function forEachChildren(children, forEachFunc, forEachContext) {
      if (children == null) {
        return children;
      }
      var traverseContext = getPooledTraverseContext(null, null, forEachFunc, forEachContext);
      traverseAllChildren(children, forEachSingleChild, traverseContext);
      releaseTraverseContext(traverseContext);
    }
    function mapSingleChildIntoContext(bookKeeping, child, childKey) {
      var result = bookKeeping.result,
        keyPrefix = bookKeeping.keyPrefix,
        func = bookKeeping.func,
        context = bookKeeping.context;
      var mappedChild = func.call(context, child, bookKeeping.count++);
      if (Array.isArray(mappedChild)) {
        mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, function (c) {
          return c;
        });
      } else if (mappedChild != null) {
        if (isValidElement(mappedChild)) {
          mappedChild = cloneAndReplaceKey(mappedChild,
          // Keep both the (mapped) and old keys if they differ, just as
          // traverseAllChildren used to do for objects as children
          keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
        }
        result.push(mappedChild);
      }
    }
    function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
      var escapedPrefix = '';
      if (prefix != null) {
        escapedPrefix = escapeUserProvidedKey(prefix) + '/';
      }
      var traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context);
      traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
      releaseTraverseContext(traverseContext);
    }
    /**
     * Maps children that are typically specified as `props.children`.
     *
     * See https://reactjs.org/docs/react-api.html#reactchildrenmap
     *
     * The provided mapFunction(child, key, index) will be called for each
     * leaf child.
     *
     * @param {?*} children Children tree container.
     * @param {function(*, int)} func The map function.
     * @param {*} context Context for mapFunction.
     * @return {object} Object containing the ordered map of results.
     */

    function mapChildren(children, func, context) {
      if (children == null) {
        return children;
      }
      var result = [];
      mapIntoWithKeyPrefixInternal(children, result, null, func, context);
      return result;
    }
    /**
     * Count the number of children that are typically specified as
     * `props.children`.
     *
     * See https://reactjs.org/docs/react-api.html#reactchildrencount
     *
     * @param {?*} children Children tree container.
     * @return {number} The number of children.
     */

    function countChildren(children) {
      return traverseAllChildren(children, function () {
        return null;
      }, null);
    }
    /**
     * Flatten a children object (typically specified as `props.children`) and
     * return an array with appropriately re-keyed children.
     *
     * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
     */

    function toArray(children) {
      var result = [];
      mapIntoWithKeyPrefixInternal(children, result, null, function (child) {
        return child;
      });
      return result;
    }
    /**
     * Returns the first child in a collection of children and verifies that there
     * is only one child in the collection.
     *
     * See https://reactjs.org/docs/react-api.html#reactchildrenonly
     *
     * The current implementation of this function assumes that a single child gets
     * passed without a wrapper, but the purpose of this helper function is to
     * abstract away the particular structure of children.
     *
     * @param {?object} children Child collection structure.
     * @return {ReactElement} The first and only `ReactElement` contained in the
     * structure.
     */

    function onlyChild(children) {
      (function () {
        if (!isValidElement(children)) {
          {
            throw ReactError(Error("React.Children.only expected to receive a single React element child."));
          }
        }
      })();
      return children;
    }
    function createContext(defaultValue, calculateChangedBits) {
      if (calculateChangedBits === undefined) {
        calculateChangedBits = null;
      } else {
        {
          !(calculateChangedBits === null || typeof calculateChangedBits === 'function') ? warningWithoutStack$1(false, 'createContext: Expected the optional second argument to be a ' + 'function. Instead received: %s', calculateChangedBits) : void 0;
        }
      }
      var context = {
        $$typeof: REACT_CONTEXT_TYPE,
        _calculateChangedBits: calculateChangedBits,
        // As a workaround to support multiple concurrent renderers, we categorize
        // some renderers as primary and others as secondary. We only expect
        // there to be two concurrent renderers at most: React Native (primary) and
        // Fabric (secondary); React DOM (primary) and React ART (secondary).
        // Secondary renderers store their context values on separate fields.
        _currentValue: defaultValue,
        _currentValue2: defaultValue,
        // Used to track how many concurrent renderers this context currently
        // supports within in a single renderer. Such as parallel server rendering.
        _threadCount: 0,
        // These are circular
        Provider: null,
        Consumer: null
      };
      context.Provider = {
        $$typeof: REACT_PROVIDER_TYPE,
        _context: context
      };
      var hasWarnedAboutUsingNestedContextConsumers = false;
      var hasWarnedAboutUsingConsumerProvider = false;
      {
        // A separate object, but proxies back to the original context object for
        // backwards compatibility. It has a different $$typeof, so we can properly
        // warn for the incorrect usage of Context as a Consumer.
        var Consumer = {
          $$typeof: REACT_CONTEXT_TYPE,
          _context: context,
          _calculateChangedBits: context._calculateChangedBits
        }; // $FlowFixMe: Flow complains about not setting a value, which is intentional here

        Object.defineProperties(Consumer, {
          Provider: {
            get: function () {
              if (!hasWarnedAboutUsingConsumerProvider) {
                hasWarnedAboutUsingConsumerProvider = true;
                warning$1(false, 'Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
              }
              return context.Provider;
            },
            set: function (_Provider) {
              context.Provider = _Provider;
            }
          },
          _currentValue: {
            get: function () {
              return context._currentValue;
            },
            set: function (_currentValue) {
              context._currentValue = _currentValue;
            }
          },
          _currentValue2: {
            get: function () {
              return context._currentValue2;
            },
            set: function (_currentValue2) {
              context._currentValue2 = _currentValue2;
            }
          },
          _threadCount: {
            get: function () {
              return context._threadCount;
            },
            set: function (_threadCount) {
              context._threadCount = _threadCount;
            }
          },
          Consumer: {
            get: function () {
              if (!hasWarnedAboutUsingNestedContextConsumers) {
                hasWarnedAboutUsingNestedContextConsumers = true;
                warning$1(false, 'Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
              }
              return context.Consumer;
            }
          }
        }); // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty

        context.Consumer = Consumer;
      }
      {
        context._currentRenderer = null;
        context._currentRenderer2 = null;
      }
      return context;
    }
    function lazy(ctor) {
      var lazyType = {
        $$typeof: REACT_LAZY_TYPE,
        _ctor: ctor,
        // React uses these fields to store the result.
        _status: -1,
        _result: null
      };
      {
        // In production, this would just set it on the object.
        var defaultProps;
        var propTypes;
        Object.defineProperties(lazyType, {
          defaultProps: {
            configurable: true,
            get: function () {
              return defaultProps;
            },
            set: function (newDefaultProps) {
              warning$1(false, 'React.lazy(...): It is not supported to assign `defaultProps` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');
              defaultProps = newDefaultProps; // Match production behavior more closely:

              Object.defineProperty(lazyType, 'defaultProps', {
                enumerable: true
              });
            }
          },
          propTypes: {
            configurable: true,
            get: function () {
              return propTypes;
            },
            set: function (newPropTypes) {
              warning$1(false, 'React.lazy(...): It is not supported to assign `propTypes` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');
              propTypes = newPropTypes; // Match production behavior more closely:

              Object.defineProperty(lazyType, 'propTypes', {
                enumerable: true
              });
            }
          }
        });
      }
      return lazyType;
    }
    function forwardRef(render) {
      {
        if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
          warningWithoutStack$1(false, 'forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
        } else if (typeof render !== 'function') {
          warningWithoutStack$1(false, 'forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render);
        } else {
          !(
          // Do not warn for 0 arguments because it could be due to usage of the 'arguments' object
          render.length === 0 || render.length === 2) ? warningWithoutStack$1(false, 'forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.') : void 0;
        }
        if (render != null) {
          !(render.defaultProps == null && render.propTypes == null) ? warningWithoutStack$1(false, 'forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?') : void 0;
        }
      }
      return {
        $$typeof: REACT_FORWARD_REF_TYPE,
        render: render
      };
    }
    function isValidElementType(type) {
      return typeof type === 'string' || typeof type === 'function' ||
      // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
      type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE);
    }
    function memo(type, compare) {
      {
        if (!isValidElementType(type)) {
          warningWithoutStack$1(false, 'memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type);
        }
      }
      return {
        $$typeof: REACT_MEMO_TYPE,
        type: type,
        compare: compare === undefined ? null : compare
      };
    }
    function resolveDispatcher() {
      var dispatcher = ReactCurrentDispatcher.current;
      (function () {
        if (!(dispatcher !== null)) {
          {
            throw ReactError(Error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem."));
          }
        }
      })();
      return dispatcher;
    }
    function useContext(Context, unstable_observedBits) {
      var dispatcher = resolveDispatcher();
      {
        !(unstable_observedBits === undefined) ? warning$1(false, 'useContext() second argument is reserved for future ' + 'use in React. Passing it is not supported. ' + 'You passed: %s.%s', unstable_observedBits, typeof unstable_observedBits === 'number' && Array.isArray(arguments[2]) ? '\n\nDid you call array.map(useContext)? ' + 'Calling Hooks inside a loop is not supported. ' + 'Learn more at https://fb.me/rules-of-hooks' : '') : void 0; // TODO: add a more generic warning for invalid values.

        if (Context._context !== undefined) {
          var realContext = Context._context; // Don't deduplicate because this legitimately causes bugs
          // and nobody should be using this in existing code.

          if (realContext.Consumer === Context) {
            warning$1(false, 'Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' + 'removed in a future major release. Did you mean to call useContext(Context) instead?');
          } else if (realContext.Provider === Context) {
            warning$1(false, 'Calling useContext(Context.Provider) is not supported. ' + 'Did you mean to call useContext(Context) instead?');
          }
        }
      }
      return dispatcher.useContext(Context, unstable_observedBits);
    }
    function useState(initialState) {
      var dispatcher = resolveDispatcher();
      return dispatcher.useState(initialState);
    }
    function useReducer(reducer, initialArg, init) {
      var dispatcher = resolveDispatcher();
      return dispatcher.useReducer(reducer, initialArg, init);
    }
    function useRef(initialValue) {
      var dispatcher = resolveDispatcher();
      return dispatcher.useRef(initialValue);
    }
    function useEffect(create, inputs) {
      var dispatcher = resolveDispatcher();
      return dispatcher.useEffect(create, inputs);
    }
    function useLayoutEffect(create, inputs) {
      var dispatcher = resolveDispatcher();
      return dispatcher.useLayoutEffect(create, inputs);
    }
    function useCallback(callback, inputs) {
      var dispatcher = resolveDispatcher();
      return dispatcher.useCallback(callback, inputs);
    }
    function useMemo(create, inputs) {
      var dispatcher = resolveDispatcher();
      return dispatcher.useMemo(create, inputs);
    }
    function useImperativeHandle(ref, create, inputs) {
      var dispatcher = resolveDispatcher();
      return dispatcher.useImperativeHandle(ref, create, inputs);
    }
    function useDebugValue(value, formatterFn) {
      {
        var dispatcher = resolveDispatcher();
        return dispatcher.useDebugValue(value, formatterFn);
      }
    }
    var emptyObject$1 = {};
    function useResponder(responder, listenerProps) {
      var dispatcher = resolveDispatcher();
      {
        if (responder == null || responder.$$typeof !== REACT_RESPONDER_TYPE) {
          warning$1(false, 'useResponder: invalid first argument. Expected an event responder, but instead got %s', responder);
          return;
        }
      }
      return dispatcher.useResponder(responder, listenerProps || emptyObject$1);
    }
    function withSuspenseConfig(scope, config) {
      var previousConfig = ReactCurrentBatchConfig.suspense;
      ReactCurrentBatchConfig.suspense = config === undefined ? null : config;
      try {
        scope();
      } finally {
        ReactCurrentBatchConfig.suspense = previousConfig;
      }
    }

    /**
     * ReactElementValidator provides a wrapper around a element factory
     * which validates the props passed to the element. This is intended to be
     * used only in DEV and could be replaced by a static type checker for languages
     * that support it.
     */
    var propTypesMisspellWarningShown;
    {
      propTypesMisspellWarningShown = false;
    }
    var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
    function getDeclarationErrorAddendum() {
      if (ReactCurrentOwner.current) {
        var name = getComponentName(ReactCurrentOwner.current.type);
        if (name) {
          return '\n\nCheck the render method of `' + name + '`.';
        }
      }
      return '';
    }
    function getSourceInfoErrorAddendum(source) {
      if (source !== undefined) {
        var fileName = source.fileName.replace(/^.*[\\\/]/, '');
        var lineNumber = source.lineNumber;
        return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
      }
      return '';
    }
    function getSourceInfoErrorAddendumForProps(elementProps) {
      if (elementProps !== null && elementProps !== undefined) {
        return getSourceInfoErrorAddendum(elementProps.__source);
      }
      return '';
    }
    /**
     * Warn if there's no key explicitly set on dynamic arrays of children or
     * object keys are not valid. This allows us to keep track of children between
     * updates.
     */

    var ownerHasKeyUseWarning = {};
    function getCurrentComponentErrorInfo(parentType) {
      var info = getDeclarationErrorAddendum();
      if (!info) {
        var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
        if (parentName) {
          info = "\n\nCheck the top-level render call using <" + parentName + ">.";
        }
      }
      return info;
    }
    /**
     * Warn if the element doesn't have an explicit key assigned to it.
     * This element is in an array. The array could grow and shrink or be
     * reordered. All children that haven't already been validated are required to
     * have a "key" property assigned to it. Error statuses are cached so a warning
     * will only be shown once.
     *
     * @internal
     * @param {ReactElement} element Element that requires a key.
     * @param {*} parentType element's parent's type.
     */

    function validateExplicitKey(element, parentType) {
      if (!element._store || element._store.validated || element.key != null) {
        return;
      }
      element._store.validated = true;
      var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
      if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
        return;
      }
      ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
      // property, it may be the creator of the child that's responsible for
      // assigning it a key.

      var childOwner = '';
      if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
        // Give the component that originally created this child.
        childOwner = " It was passed a child from " + getComponentName(element._owner.type) + ".";
      }
      setCurrentlyValidatingElement(element);
      {
        warning$1(false, 'Each child in a list should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.', currentComponentErrorInfo, childOwner);
      }
      setCurrentlyValidatingElement(null);
    }
    /**
     * Ensure that every element either is passed in a static location, in an
     * array with an explicit keys property defined, or in an object literal
     * with valid key property.
     *
     * @internal
     * @param {ReactNode} node Statically passed child of any type.
     * @param {*} parentType node's parent's type.
     */

    function validateChildKeys(node, parentType) {
      if (typeof node !== 'object') {
        return;
      }
      if (Array.isArray(node)) {
        for (var i = 0; i < node.length; i++) {
          var child = node[i];
          if (isValidElement(child)) {
            validateExplicitKey(child, parentType);
          }
        }
      } else if (isValidElement(node)) {
        // This element was passed in a valid location.
        if (node._store) {
          node._store.validated = true;
        }
      } else if (node) {
        var iteratorFn = getIteratorFn(node);
        if (typeof iteratorFn === 'function') {
          // Entry iterators used to provide implicit keys,
          // but now we print a separate warning for them later.
          if (iteratorFn !== node.entries) {
            var iterator = iteratorFn.call(node);
            var step;
            while (!(step = iterator.next()).done) {
              if (isValidElement(step.value)) {
                validateExplicitKey(step.value, parentType);
              }
            }
          }
        }
      }
    }
    /**
     * Given an element, validate that its props follow the propTypes definition,
     * provided by the type.
     *
     * @param {ReactElement} element
     */

    function validatePropTypes(element) {
      var type = element.type;
      if (type === null || type === undefined || typeof type === 'string') {
        return;
      }
      var name = getComponentName(type);
      var propTypes;
      if (typeof type === 'function') {
        propTypes = type.propTypes;
      } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE ||
      // Note: Memo only checks outer props here.
      // Inner props are checked in the reconciler.
      type.$$typeof === REACT_MEMO_TYPE)) {
        propTypes = type.propTypes;
      } else {
        return;
      }
      if (propTypes) {
        setCurrentlyValidatingElement(element);
        checkPropTypes(propTypes, element.props, 'prop', name, ReactDebugCurrentFrame.getStackAddendum);
        setCurrentlyValidatingElement(null);
      } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
        propTypesMisspellWarningShown = true;
        warningWithoutStack$1(false, 'Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', name || 'Unknown');
      }
      if (typeof type.getDefaultProps === 'function') {
        !type.getDefaultProps.isReactClassApproved ? warningWithoutStack$1(false, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
      }
    }
    /**
     * Given a fragment, validate that it can only be provided with fragment props
     * @param {ReactElement} fragment
     */

    function validateFragmentProps(fragment) {
      setCurrentlyValidatingElement(fragment);
      var keys = Object.keys(fragment.props);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key !== 'children' && key !== 'key') {
          warning$1(false, 'Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);
          break;
        }
      }
      if (fragment.ref !== null) {
        warning$1(false, 'Invalid attribute `ref` supplied to `React.Fragment`.');
      }
      setCurrentlyValidatingElement(null);
    }
    function jsxWithValidation(type, props, key, isStaticChildren, source, self) {
      var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
      // succeed and there will likely be errors in render.

      if (!validType) {
        var info = '';
        if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
          info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
        }
        var sourceInfo = getSourceInfoErrorAddendum(source);
        if (sourceInfo) {
          info += sourceInfo;
        } else {
          info += getDeclarationErrorAddendum();
        }
        var typeString;
        if (type === null) {
          typeString = 'null';
        } else if (Array.isArray(type)) {
          typeString = 'array';
        } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
          typeString = "<" + (getComponentName(type.type) || 'Unknown') + " />";
          info = ' Did you accidentally export a JSX literal instead of a component?';
        } else {
          typeString = typeof type;
        }
        warning$1(false, 'React.jsx: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
      }
      var element = jsxDEV(type, props, key, source, self); // The result can be nullish if a mock or a custom function is used.
      // TODO: Drop this when these are no longer allowed as the type argument.

      if (element == null) {
        return element;
      } // Skip key warning if the type isn't valid since our key validation logic
      // doesn't expect a non-string/function type and can throw confusing errors.
      // We don't want exception behavior to differ between dev and prod.
      // (Rendering will throw with a helpful message and as soon as the type is
      // fixed, the key warnings will appear.)

      if (validType) {
        var children = props.children;
        if (children !== undefined) {
          if (isStaticChildren) {
            if (Array.isArray(children)) {
              for (var i = 0; i < children.length; i++) {
                validateChildKeys(children[i], type);
              }
              if (Object.freeze) {
                Object.freeze(children);
              }
            } else {
              warning$1(false, 'React.jsx: Static children should always be an array. ' + 'You are likely explicitly calling React.jsxs or React.jsxDEV. ' + 'Use the Babel transform instead.');
            }
          } else {
            validateChildKeys(children, type);
          }
        }
      }
      if (hasOwnProperty$1.call(props, 'key')) {
        warning$1(false, 'React.jsx: Spreading a key to JSX is a deprecated pattern. ' + 'Explicitly pass a key after spreading props in your JSX call. ' + 'E.g. <ComponentName {...props} key={key} />');
      }
      if (type === REACT_FRAGMENT_TYPE) {
        validateFragmentProps(element);
      } else {
        validatePropTypes(element);
      }
      return element;
    } // These two functions exist to still get child warnings in dev
    // even with the prod transform. This means that jsxDEV is purely
    // opt-in behavior for better messages but that we won't stop
    // giving you warnings if you use production apis.

    function jsxWithValidationStatic(type, props, key) {
      return jsxWithValidation(type, props, key, true);
    }
    function jsxWithValidationDynamic(type, props, key) {
      return jsxWithValidation(type, props, key, false);
    }
    function createElementWithValidation(type, props, children) {
      var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
      // succeed and there will likely be errors in render.

      if (!validType) {
        var info = '';
        if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
          info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
        }
        var sourceInfo = getSourceInfoErrorAddendumForProps(props);
        if (sourceInfo) {
          info += sourceInfo;
        } else {
          info += getDeclarationErrorAddendum();
        }
        var typeString;
        if (type === null) {
          typeString = 'null';
        } else if (Array.isArray(type)) {
          typeString = 'array';
        } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
          typeString = "<" + (getComponentName(type.type) || 'Unknown') + " />";
          info = ' Did you accidentally export a JSX literal instead of a component?';
        } else {
          typeString = typeof type;
        }
        warning$1(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
      }
      var element = createElement.apply(this, arguments); // The result can be nullish if a mock or a custom function is used.
      // TODO: Drop this when these are no longer allowed as the type argument.

      if (element == null) {
        return element;
      } // Skip key warning if the type isn't valid since our key validation logic
      // doesn't expect a non-string/function type and can throw confusing errors.
      // We don't want exception behavior to differ between dev and prod.
      // (Rendering will throw with a helpful message and as soon as the type is
      // fixed, the key warnings will appear.)

      if (validType) {
        for (var i = 2; i < arguments.length; i++) {
          validateChildKeys(arguments[i], type);
        }
      }
      if (type === REACT_FRAGMENT_TYPE) {
        validateFragmentProps(element);
      } else {
        validatePropTypes(element);
      }
      return element;
    }
    function createFactoryWithValidation(type) {
      var validatedFactory = createElementWithValidation.bind(null, type);
      validatedFactory.type = type; // Legacy hook: remove it

      {
        Object.defineProperty(validatedFactory, 'type', {
          enumerable: false,
          get: function () {
            lowPriorityWarningWithoutStack$1(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');
            Object.defineProperty(this, 'type', {
              value: type
            });
            return type;
          }
        });
      }
      return validatedFactory;
    }
    function cloneElementWithValidation(element, props, children) {
      var newElement = cloneElement.apply(this, arguments);
      for (var i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], newElement.type);
      }
      validatePropTypes(newElement);
      return newElement;
    }
    var hasBadMapPolyfill;
    {
      hasBadMapPolyfill = false;
      try {
        var frozenObject = Object.freeze({});
        var testMap = new Map([[frozenObject, null]]);
        var testSet = new Set([frozenObject]); // This is necessary for Rollup to not consider these unused.
        // https://github.com/rollup/rollup/issues/1771
        // TODO: we can remove these if Rollup fixes the bug.

        testMap.set(0, 0);
        testSet.add(0);
      } catch (e) {
        // TODO: Consider warning about bad polyfills
        hasBadMapPolyfill = true;
      }
    }
    function createFundamentalComponent(impl) {
      // We use responder as a Map key later on. When we have a bad
      // polyfill, then we can't use it as a key as the polyfill tries
      // to add a property to the object.
      if ( true && !hasBadMapPolyfill) {
        Object.freeze(impl);
      }
      var fundamantalComponent = {
        $$typeof: REACT_FUNDAMENTAL_TYPE,
        impl: impl
      };
      {
        Object.freeze(fundamantalComponent);
      }
      return fundamantalComponent;
    }
    function createEventResponder(displayName, responderConfig) {
      var getInitialState = responderConfig.getInitialState,
        onEvent = responderConfig.onEvent,
        onMount = responderConfig.onMount,
        onUnmount = responderConfig.onUnmount,
        onRootEvent = responderConfig.onRootEvent,
        rootEventTypes = responderConfig.rootEventTypes,
        targetEventTypes = responderConfig.targetEventTypes,
        targetPortalPropagation = responderConfig.targetPortalPropagation;
      var eventResponder = {
        $$typeof: REACT_RESPONDER_TYPE,
        displayName: displayName,
        getInitialState: getInitialState || null,
        onEvent: onEvent || null,
        onMount: onMount || null,
        onRootEvent: onRootEvent || null,
        onUnmount: onUnmount || null,
        rootEventTypes: rootEventTypes || null,
        targetEventTypes: targetEventTypes || null,
        targetPortalPropagation: targetPortalPropagation || false
      }; // We use responder as a Map key later on. When we have a bad
      // polyfill, then we can't use it as a key as the polyfill tries
      // to add a property to the object.

      if ( true && !hasBadMapPolyfill) {
        Object.freeze(eventResponder);
      }
      return eventResponder;
    }
    function createScope(fn) {
      var scopeComponent = {
        $$typeof: REACT_SCOPE_TYPE,
        fn: fn
      };
      {
        Object.freeze(scopeComponent);
      }
      return scopeComponent;
    }

    // Helps identify side effects in begin-phase lifecycle hooks and setState reducers:

    // In some cases, StrictMode should also double-render lifecycles.
    // This can be confusing for tests though,
    // And it can be bad for performance in production.
    // This feature flag can be used to control the behavior:

    // To preserve the "Pause on caught exceptions" behavior of the debugger, we
    // replay the begin phase of a failed component inside invokeGuardedCallback.

    // Warn about deprecated, async-unsafe lifecycles; relates to RFC #6:

    // Gather advanced timing metrics for Profiler subtrees.

    // Trace which interactions trigger each commit.

    // Only used in www builds.

    // TODO: true? Here it might just be false.

    // Only used in www builds.

    // Only used in www builds.

    // Disable javascript: URL strings in href for XSS protection.

    // React Fire: prevent the value and checked attributes from syncing
    // with their related DOM properties

    // These APIs will no longer be "unstable" in the upcoming 16.7 release,
    // Control this behavior with a flag to support 16.6 minor releases in the meanwhile.

    // See https://github.com/react-native-community/discussions-and-proposals/issues/72 for more information
    // This is a flag so we can fix warnings in RN core before turning it on

    // Experimental React Flare event system and event components support.

    var enableFlareAPI = false; // Experimental Host Component support.

    var enableFundamentalAPI = false; // Experimental Scope support.

    var enableScopeAPI = false; // New API for JSX transforms to target - https://github.com/reactjs/rfcs/pull/107

    var enableJSXTransformAPI = false; // We will enforce mocking scheduler with scheduler/unstable_mock at some point. (v17?)
    // Till then, we warn about the missing mock, but still fallback to a sync mode compatible version

    // For tests, we flush suspense fallbacks in an act scope;
    // *except* in some of our own tests, where we test incremental loading states.

    // Changes priority of some events like mousemove to user-blocking priority,
    // but without making them discrete. The flag exists in case it causes
    // starvation problems.

    // Add a callback property to suspense to notify which promises are currently
    // in the update queue. This allows reporting and tracing of what is causing
    // the user to see a loading state.
    // Also allows hydration callbacks to fire when a dehydrated boundary gets
    // hydrated or deleted.

    // Part of the simplification of React.createElement so we can eventually move
    // from React.createElement to React.jsx
    // https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md

    var React = {
      Children: {
        map: mapChildren,
        forEach: forEachChildren,
        count: countChildren,
        toArray: toArray,
        only: onlyChild
      },
      createRef: createRef,
      Component: Component,
      PureComponent: PureComponent,
      createContext: createContext,
      forwardRef: forwardRef,
      lazy: lazy,
      memo: memo,
      useCallback: useCallback,
      useContext: useContext,
      useEffect: useEffect,
      useImperativeHandle: useImperativeHandle,
      useDebugValue: useDebugValue,
      useLayoutEffect: useLayoutEffect,
      useMemo: useMemo,
      useReducer: useReducer,
      useRef: useRef,
      useState: useState,
      Fragment: REACT_FRAGMENT_TYPE,
      Profiler: REACT_PROFILER_TYPE,
      StrictMode: REACT_STRICT_MODE_TYPE,
      Suspense: REACT_SUSPENSE_TYPE,
      unstable_SuspenseList: REACT_SUSPENSE_LIST_TYPE,
      createElement: createElementWithValidation,
      cloneElement: cloneElementWithValidation,
      createFactory: createFactoryWithValidation,
      isValidElement: isValidElement,
      version: ReactVersion,
      unstable_withSuspenseConfig: withSuspenseConfig,
      __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals
    };
    if (enableFlareAPI) {
      React.unstable_useResponder = useResponder;
      React.unstable_createResponder = createEventResponder;
    }
    if (enableFundamentalAPI) {
      React.unstable_createFundamental = createFundamentalComponent;
    }
    if (enableScopeAPI) {
      React.unstable_createScope = createScope;
    } // Note: some APIs are added with feature flags.
    // Make sure that stable builds for open source
    // don't modify the React object to avoid deopts.
    // Also let's not expose their names in stable builds.

    if (enableJSXTransformAPI) {
      {
        React.jsxDEV = jsxWithValidation;
        React.jsx = jsxWithValidationDynamic;
        React.jsxs = jsxWithValidationStatic;
      }
    }
    var React$2 = Object.freeze({
      default: React
    });
    var React$3 = React$2 && React || React$2;

    // TODO: decide on the top-level export form.
    // This is hacky but makes it work with both Rollup and Jest.

    var react = React$3.default || React$3;
    module.exports = react;
  })();
}

/***/ }),

/***/ "./node_modules/react/index.js":
/*!*************************************!*\
  !*** ./node_modules/react/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react.development.js */ "./node_modules/react/cjs/react.development.js");
}

/***/ }),

/***/ "./node_modules/scrollingelement/scrollingelement.js":
/*!***********************************************************!*\
  !*** ./node_modules/scrollingelement/scrollingelement.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*! https://mths.be/scrollingelement v1.5.2 by @diegoperini & @mathias | MIT license */
if (!('scrollingElement' in document)) (function () {
  function computeStyle(element) {
    if (window.getComputedStyle) {
      // Support Firefox < 4 which throws on a single parameter.
      return getComputedStyle(element, null);
    }
    // Support Internet Explorer < 9.
    return element.currentStyle;
  }
  function isBodyElement(element) {
    // The `instanceof` check gives the correct result for e.g. `body` in a
    // non-HTML namespace.
    if (window.HTMLBodyElement) {
      return element instanceof HTMLBodyElement;
    }
    // Fall back to a `tagName` check for old browsers.
    return /body/i.test(element.tagName);
  }
  function getNextBodyElement(frameset) {
    // We use this function to be correct per spec in case `document.body` is
    // a `frameset` but there exists a later `body`. Since `document.body` is
    // a `frameset`, we know the root is an `html`, and there was no `body`
    // before the `frameset`, so we just need to look at siblings after the
    // `frameset`.
    var current = frameset;
    while (current = current.nextSibling) {
      if (current.nodeType == 1 && isBodyElement(current)) {
        return current;
      }
    }
    // No `body` found.
    return null;
  }

  // Note: standards mode / quirks mode can be toggled at runtime via
  // `document.write`.
  var isCompliantCached;
  var isCompliant = function () {
    var isStandardsMode = /^CSS1/.test(document.compatMode);
    if (!isStandardsMode) {
      // In quirks mode, the result is equivalent to the non-compliant
      // standards mode behavior.
      return false;
    }
    if (isCompliantCached === void 0) {
      // When called for the first time, check whether the browser is
      // standard-compliant, and cache the result.
      var iframe = document.createElement('iframe');
      iframe.style.height = '1px';
      (document.body || document.documentElement || document).appendChild(iframe);
      var doc = iframe.contentWindow.document;
      doc.write('<!DOCTYPE html><div style="height:9999em">x</div>');
      doc.close();
      isCompliantCached = doc.documentElement.scrollHeight > doc.body.scrollHeight;
      iframe.parentNode.removeChild(iframe);
    }
    return isCompliantCached;
  };
  function isRendered(style) {
    return style.display != 'none' && !(style.visibility == 'collapse' && /^table-(.+-group|row|column)$/.test(style.display));
  }
  function isScrollable(body) {
    // A `body` element is scrollable if `body` and `html` both have
    // non-`visible` overflow and are both being rendered.
    var bodyStyle = computeStyle(body);
    var htmlStyle = computeStyle(document.documentElement);
    return bodyStyle.overflow != 'visible' && htmlStyle.overflow != 'visible' && isRendered(bodyStyle) && isRendered(htmlStyle);
  }
  var scrollingElement = function () {
    if (isCompliant()) {
      return document.documentElement;
    }
    var body = document.body;
    // Note: `document.body` could be a `frameset` element, or `null`.
    // `tagName` is uppercase in HTML, but lowercase in XML.
    var isFrameset = body && !/body/i.test(body.tagName);
    body = isFrameset ? getNextBodyElement(body) : body;
    // If `body` is itself scrollable, it is not the `scrollingElement`.
    return body && isScrollable(body) ? null : body;
  };
  if (Object.defineProperty) {
    // Support modern browsers that lack a native implementation.
    Object.defineProperty(document, 'scrollingElement', {
      'get': scrollingElement
    });
  } else if (document.__defineGetter__) {
    // Support Firefox ≤ 3.6.9, Safari ≤ 4.1.3.
    document.__defineGetter__('scrollingElement', scrollingElement);
  } else {
    // IE ≤ 4 lacks `attachEvent`, so it only gets this one assignment. IE ≤ 7
    // gets it too, but the value is updated later (see `propertychange`).
    document.scrollingElement = scrollingElement();
    document.attachEvent && document.attachEvent('onpropertychange', function () {
      // This is for IE ≤ 7 only.
      // A `propertychange` event fires when `<body>` is parsed because
      // `document.activeElement` then changes.
      if (window.event.propertyName == 'activeElement') {
        document.scrollingElement = scrollingElement();
      }
    });
  }
})();

/***/ }),

/***/ "./node_modules/sockjs-client/dist/sockjs.js":
/*!***************************************************!*\
  !*** ./node_modules/sockjs-client/dist/sockjs.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var require;var require;/* sockjs-client v1.6.1 | http://sockjs.org | MIT license */
(function (f) {
  if (true) {
    module.exports = f();
  } else { var g; }
})(function () {
  var define, module, exports;
  return function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) return require(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw a.code = "MODULE_NOT_FOUND", a;
          }
          var p = n[i] = {
            exports: {}
          };
          e[i][0].call(p.exports, function (r) {
            var n = e[i][1][r];
            return o(n || r);
          }, p, p.exports, r, e, n, t);
        }
        return n[i].exports;
      }
      for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
      return o;
    }
    return r;
  }()({
    1: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict';

          var transportList = require('./transport-list');
          module.exports = require('./main')(transportList);

          // TODO can't get rid of this until all servers do
          if ('_sockjs_onload' in global) {
            setTimeout(global._sockjs_onload, 1);
          }
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "./main": 14,
      "./transport-list": 16
    }],
    2: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
        Event = require('./event');
      function CloseEvent() {
        Event.call(this);
        this.initEvent('close', false, false);
        this.wasClean = false;
        this.code = 0;
        this.reason = '';
      }
      inherits(CloseEvent, Event);
      module.exports = CloseEvent;
    }, {
      "./event": 4,
      "inherits": 57
    }],
    3: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
        EventTarget = require('./eventtarget');
      function EventEmitter() {
        EventTarget.call(this);
      }
      inherits(EventEmitter, EventTarget);
      EventEmitter.prototype.removeAllListeners = function (type) {
        if (type) {
          delete this._listeners[type];
        } else {
          this._listeners = {};
        }
      };
      EventEmitter.prototype.once = function (type, listener) {
        var self = this,
          fired = false;
        function g() {
          self.removeListener(type, g);
          if (!fired) {
            fired = true;
            listener.apply(this, arguments);
          }
        }
        this.on(type, g);
      };
      EventEmitter.prototype.emit = function () {
        var type = arguments[0];
        var listeners = this._listeners[type];
        if (!listeners) {
          return;
        }
        // equivalent of Array.prototype.slice.call(arguments, 1);
        var l = arguments.length;
        var args = new Array(l - 1);
        for (var ai = 1; ai < l; ai++) {
          args[ai - 1] = arguments[ai];
        }
        for (var i = 0; i < listeners.length; i++) {
          listeners[i].apply(this, args);
        }
      };
      EventEmitter.prototype.on = EventEmitter.prototype.addListener = EventTarget.prototype.addEventListener;
      EventEmitter.prototype.removeListener = EventTarget.prototype.removeEventListener;
      module.exports.EventEmitter = EventEmitter;
    }, {
      "./eventtarget": 5,
      "inherits": 57
    }],
    4: [function (require, module, exports) {
      'use strict';

      function Event(eventType) {
        this.type = eventType;
      }
      Event.prototype.initEvent = function (eventType, canBubble, cancelable) {
        this.type = eventType;
        this.bubbles = canBubble;
        this.cancelable = cancelable;
        this.timeStamp = +new Date();
        return this;
      };
      Event.prototype.stopPropagation = function () {};
      Event.prototype.preventDefault = function () {};
      Event.CAPTURING_PHASE = 1;
      Event.AT_TARGET = 2;
      Event.BUBBLING_PHASE = 3;
      module.exports = Event;
    }, {}],
    5: [function (require, module, exports) {
      'use strict';

      /* Simplified implementation of DOM2 EventTarget.
       *   http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
       */
      function EventTarget() {
        this._listeners = {};
      }
      EventTarget.prototype.addEventListener = function (eventType, listener) {
        if (!(eventType in this._listeners)) {
          this._listeners[eventType] = [];
        }
        var arr = this._listeners[eventType];
        // #4
        if (arr.indexOf(listener) === -1) {
          // Make a copy so as not to interfere with a current dispatchEvent.
          arr = arr.concat([listener]);
        }
        this._listeners[eventType] = arr;
      };
      EventTarget.prototype.removeEventListener = function (eventType, listener) {
        var arr = this._listeners[eventType];
        if (!arr) {
          return;
        }
        var idx = arr.indexOf(listener);
        if (idx !== -1) {
          if (arr.length > 1) {
            // Make a copy so as not to interfere with a current dispatchEvent.
            this._listeners[eventType] = arr.slice(0, idx).concat(arr.slice(idx + 1));
          } else {
            delete this._listeners[eventType];
          }
          return;
        }
      };
      EventTarget.prototype.dispatchEvent = function () {
        var event = arguments[0];
        var t = event.type;
        // equivalent of Array.prototype.slice.call(arguments, 0);
        var args = arguments.length === 1 ? [event] : Array.apply(null, arguments);
        // TODO: This doesn't match the real behavior; per spec, onfoo get
        // their place in line from the /first/ time they're set from
        // non-null. Although WebKit bumps it to the end every time it's
        // set.
        if (this['on' + t]) {
          this['on' + t].apply(this, args);
        }
        if (t in this._listeners) {
          // Grab a reference to the listeners list. removeEventListener may alter the list.
          var listeners = this._listeners[t];
          for (var i = 0; i < listeners.length; i++) {
            listeners[i].apply(this, args);
          }
        }
      };
      module.exports = EventTarget;
    }, {}],
    6: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
        Event = require('./event');
      function TransportMessageEvent(data) {
        Event.call(this);
        this.initEvent('message', false, false);
        this.data = data;
      }
      inherits(TransportMessageEvent, Event);
      module.exports = TransportMessageEvent;
    }, {
      "./event": 4,
      "inherits": 57
    }],
    7: [function (require, module, exports) {
      'use strict';

      var iframeUtils = require('./utils/iframe');
      function FacadeJS(transport) {
        this._transport = transport;
        transport.on('message', this._transportMessage.bind(this));
        transport.on('close', this._transportClose.bind(this));
      }
      FacadeJS.prototype._transportClose = function (code, reason) {
        iframeUtils.postMessage('c', JSON.stringify([code, reason]));
      };
      FacadeJS.prototype._transportMessage = function (frame) {
        iframeUtils.postMessage('t', frame);
      };
      FacadeJS.prototype._send = function (data) {
        this._transport.send(data);
      };
      FacadeJS.prototype._close = function () {
        this._transport.close();
        this._transport.removeAllListeners();
      };
      module.exports = FacadeJS;
    }, {
      "./utils/iframe": 47
    }],
    8: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          var urlUtils = require('./utils/url'),
            eventUtils = require('./utils/event'),
            FacadeJS = require('./facade'),
            InfoIframeReceiver = require('./info-iframe-receiver'),
            iframeUtils = require('./utils/iframe'),
            loc = require('./location');
          var debug = function () {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:iframe-bootstrap');
          }
          module.exports = function (SockJS, availableTransports) {
            var transportMap = {};
            availableTransports.forEach(function (at) {
              if (at.facadeTransport) {
                transportMap[at.facadeTransport.transportName] = at.facadeTransport;
              }
            });

            // hard-coded for the info iframe
            // TODO see if we can make this more dynamic
            transportMap[InfoIframeReceiver.transportName] = InfoIframeReceiver;
            var parentOrigin;

            /* eslint-disable camelcase */
            SockJS.bootstrap_iframe = function () {
              /* eslint-enable camelcase */
              var facade;
              iframeUtils.currentWindowId = loc.hash.slice(1);
              var onMessage = function (e) {
                if (e.source !== parent) {
                  return;
                }
                if (typeof parentOrigin === 'undefined') {
                  parentOrigin = e.origin;
                }
                if (e.origin !== parentOrigin) {
                  return;
                }
                var iframeMessage;
                try {
                  iframeMessage = JSON.parse(e.data);
                } catch (ignored) {
                  debug('bad json', e.data);
                  return;
                }
                if (iframeMessage.windowId !== iframeUtils.currentWindowId) {
                  return;
                }
                switch (iframeMessage.type) {
                  case 's':
                    var p;
                    try {
                      p = JSON.parse(iframeMessage.data);
                    } catch (ignored) {
                      debug('bad json', iframeMessage.data);
                      break;
                    }
                    var version = p[0];
                    var transport = p[1];
                    var transUrl = p[2];
                    var baseUrl = p[3];
                    debug(version, transport, transUrl, baseUrl);
                    // change this to semver logic
                    if (version !== SockJS.version) {
                      throw new Error('Incompatible SockJS! Main site uses:' + ' "' + version + '", the iframe:' + ' "' + SockJS.version + '".');
                    }
                    if (!urlUtils.isOriginEqual(transUrl, loc.href) || !urlUtils.isOriginEqual(baseUrl, loc.href)) {
                      throw new Error('Can\'t connect to different domain from within an ' + 'iframe. (' + loc.href + ', ' + transUrl + ', ' + baseUrl + ')');
                    }
                    facade = new FacadeJS(new transportMap[transport](transUrl, baseUrl));
                    break;
                  case 'm':
                    facade._send(iframeMessage.data);
                    break;
                  case 'c':
                    if (facade) {
                      facade._close();
                    }
                    facade = null;
                    break;
                }
              };
              eventUtils.attachEvent('message', onMessage);

              // Start
              iframeUtils.postMessage('s');
            };
          };
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "./facade": 7,
      "./info-iframe-receiver": 10,
      "./location": 13,
      "./utils/event": 46,
      "./utils/iframe": 47,
      "./utils/url": 52,
      "debug": 55
    }],
    9: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          var EventEmitter = require('events').EventEmitter,
            inherits = require('inherits'),
            objectUtils = require('./utils/object');
          var debug = function () {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:info-ajax');
          }
          function InfoAjax(url, AjaxObject) {
            EventEmitter.call(this);
            var self = this;
            var t0 = +new Date();
            this.xo = new AjaxObject('GET', url);
            this.xo.once('finish', function (status, text) {
              var info, rtt;
              if (status === 200) {
                rtt = +new Date() - t0;
                if (text) {
                  try {
                    info = JSON.parse(text);
                  } catch (e) {
                    debug('bad json', text);
                  }
                }
                if (!objectUtils.isObject(info)) {
                  info = {};
                }
              }
              self.emit('finish', info, rtt);
              self.removeAllListeners();
            });
          }
          inherits(InfoAjax, EventEmitter);
          InfoAjax.prototype.close = function () {
            this.removeAllListeners();
            this.xo.close();
          };
          module.exports = InfoAjax;
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "./utils/object": 49,
      "debug": 55,
      "events": 3,
      "inherits": 57
    }],
    10: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
        EventEmitter = require('events').EventEmitter,
        XHRLocalObject = require('./transport/sender/xhr-local'),
        InfoAjax = require('./info-ajax');
      function InfoReceiverIframe(transUrl) {
        var self = this;
        EventEmitter.call(this);
        this.ir = new InfoAjax(transUrl, XHRLocalObject);
        this.ir.once('finish', function (info, rtt) {
          self.ir = null;
          self.emit('message', JSON.stringify([info, rtt]));
        });
      }
      inherits(InfoReceiverIframe, EventEmitter);
      InfoReceiverIframe.transportName = 'iframe-info-receiver';
      InfoReceiverIframe.prototype.close = function () {
        if (this.ir) {
          this.ir.close();
          this.ir = null;
        }
        this.removeAllListeners();
      };
      module.exports = InfoReceiverIframe;
    }, {
      "./info-ajax": 9,
      "./transport/sender/xhr-local": 37,
      "events": 3,
      "inherits": 57
    }],
    11: [function (require, module, exports) {
      (function (process, global) {
        (function () {
          'use strict';

          var EventEmitter = require('events').EventEmitter,
            inherits = require('inherits'),
            utils = require('./utils/event'),
            IframeTransport = require('./transport/iframe'),
            InfoReceiverIframe = require('./info-iframe-receiver');
          var debug = function () {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:info-iframe');
          }
          function InfoIframe(baseUrl, url) {
            var self = this;
            EventEmitter.call(this);
            var go = function () {
              var ifr = self.ifr = new IframeTransport(InfoReceiverIframe.transportName, url, baseUrl);
              ifr.once('message', function (msg) {
                if (msg) {
                  var d;
                  try {
                    d = JSON.parse(msg);
                  } catch (e) {
                    debug('bad json', msg);
                    self.emit('finish');
                    self.close();
                    return;
                  }
                  var info = d[0],
                    rtt = d[1];
                  self.emit('finish', info, rtt);
                }
                self.close();
              });
              ifr.once('close', function () {
                self.emit('finish');
                self.close();
              });
            };

            // TODO this seems the same as the 'needBody' from transports
            if (!global.document.body) {
              utils.attachEvent('load', go);
            } else {
              go();
            }
          }
          inherits(InfoIframe, EventEmitter);
          InfoIframe.enabled = function () {
            return IframeTransport.enabled();
          };
          InfoIframe.prototype.close = function () {
            if (this.ifr) {
              this.ifr.close();
            }
            this.removeAllListeners();
            this.ifr = null;
          };
          module.exports = InfoIframe;
        }).call(this);
      }).call(this, {
        env: {}
      }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "./info-iframe-receiver": 10,
      "./transport/iframe": 22,
      "./utils/event": 46,
      "debug": 55,
      "events": 3,
      "inherits": 57
    }],
    12: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          var EventEmitter = require('events').EventEmitter,
            inherits = require('inherits'),
            urlUtils = require('./utils/url'),
            XDR = require('./transport/sender/xdr'),
            XHRCors = require('./transport/sender/xhr-cors'),
            XHRLocal = require('./transport/sender/xhr-local'),
            XHRFake = require('./transport/sender/xhr-fake'),
            InfoIframe = require('./info-iframe'),
            InfoAjax = require('./info-ajax');
          var debug = function () {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:info-receiver');
          }
          function InfoReceiver(baseUrl, urlInfo) {
            debug(baseUrl);
            var self = this;
            EventEmitter.call(this);
            setTimeout(function () {
              self.doXhr(baseUrl, urlInfo);
            }, 0);
          }
          inherits(InfoReceiver, EventEmitter);

          // TODO this is currently ignoring the list of available transports and the whitelist

          InfoReceiver._getReceiver = function (baseUrl, url, urlInfo) {
            // determine method of CORS support (if needed)
            if (urlInfo.sameOrigin) {
              return new InfoAjax(url, XHRLocal);
            }
            if (XHRCors.enabled) {
              return new InfoAjax(url, XHRCors);
            }
            if (XDR.enabled && urlInfo.sameScheme) {
              return new InfoAjax(url, XDR);
            }
            if (InfoIframe.enabled()) {
              return new InfoIframe(baseUrl, url);
            }
            return new InfoAjax(url, XHRFake);
          };
          InfoReceiver.prototype.doXhr = function (baseUrl, urlInfo) {
            var self = this,
              url = urlUtils.addPath(baseUrl, '/info');
            debug('doXhr', url);
            this.xo = InfoReceiver._getReceiver(baseUrl, url, urlInfo);
            this.timeoutRef = setTimeout(function () {
              debug('timeout');
              self._cleanup(false);
              self.emit('finish');
            }, InfoReceiver.timeout);
            this.xo.once('finish', function (info, rtt) {
              debug('finish', info, rtt);
              self._cleanup(true);
              self.emit('finish', info, rtt);
            });
          };
          InfoReceiver.prototype._cleanup = function (wasClean) {
            debug('_cleanup');
            clearTimeout(this.timeoutRef);
            this.timeoutRef = null;
            if (!wasClean && this.xo) {
              this.xo.close();
            }
            this.xo = null;
          };
          InfoReceiver.prototype.close = function () {
            debug('close');
            this.removeAllListeners();
            this._cleanup(false);
          };
          InfoReceiver.timeout = 8000;
          module.exports = InfoReceiver;
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "./info-ajax": 9,
      "./info-iframe": 11,
      "./transport/sender/xdr": 34,
      "./transport/sender/xhr-cors": 35,
      "./transport/sender/xhr-fake": 36,
      "./transport/sender/xhr-local": 37,
      "./utils/url": 52,
      "debug": 55,
      "events": 3,
      "inherits": 57
    }],
    13: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict';

          module.exports = global.location || {
            origin: 'http://localhost:80',
            protocol: 'http:',
            host: 'localhost',
            port: 80,
            href: 'http://localhost/',
            hash: ''
          };
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}],
    14: [function (require, module, exports) {
      (function (process, global) {
        (function () {
          'use strict';

          require('./shims');
          var URL = require('url-parse'),
            inherits = require('inherits'),
            random = require('./utils/random'),
            escape = require('./utils/escape'),
            urlUtils = require('./utils/url'),
            eventUtils = require('./utils/event'),
            transport = require('./utils/transport'),
            objectUtils = require('./utils/object'),
            browser = require('./utils/browser'),
            log = require('./utils/log'),
            Event = require('./event/event'),
            EventTarget = require('./event/eventtarget'),
            loc = require('./location'),
            CloseEvent = require('./event/close'),
            TransportMessageEvent = require('./event/trans-message'),
            InfoReceiver = require('./info-receiver');
          var debug = function () {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:main');
          }
          var transports;

          // follow constructor steps defined at http://dev.w3.org/html5/websockets/#the-websocket-interface
          function SockJS(url, protocols, options) {
            if (!(this instanceof SockJS)) {
              return new SockJS(url, protocols, options);
            }
            if (arguments.length < 1) {
              throw new TypeError("Failed to construct 'SockJS: 1 argument required, but only 0 present");
            }
            EventTarget.call(this);
            this.readyState = SockJS.CONNECTING;
            this.extensions = '';
            this.protocol = '';

            // non-standard extension
            options = options || {};
            if (options.protocols_whitelist) {
              log.warn("'protocols_whitelist' is DEPRECATED. Use 'transports' instead.");
            }
            this._transportsWhitelist = options.transports;
            this._transportOptions = options.transportOptions || {};
            this._timeout = options.timeout || 0;
            var sessionId = options.sessionId || 8;
            if (typeof sessionId === 'function') {
              this._generateSessionId = sessionId;
            } else if (typeof sessionId === 'number') {
              this._generateSessionId = function () {
                return random.string(sessionId);
              };
            } else {
              throw new TypeError('If sessionId is used in the options, it needs to be a number or a function.');
            }
            this._server = options.server || random.numberString(1000);

            // Step 1 of WS spec - parse and validate the url. Issue #8
            var parsedUrl = new URL(url);
            if (!parsedUrl.host || !parsedUrl.protocol) {
              throw new SyntaxError("The URL '" + url + "' is invalid");
            } else if (parsedUrl.hash) {
              throw new SyntaxError('The URL must not contain a fragment');
            } else if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
              throw new SyntaxError("The URL's scheme must be either 'http:' or 'https:'. '" + parsedUrl.protocol + "' is not allowed.");
            }
            var secure = parsedUrl.protocol === 'https:';
            // Step 2 - don't allow secure origin with an insecure protocol
            if (loc.protocol === 'https:' && !secure) {
              // exception is 127.0.0.0/8 and ::1 urls
              if (!urlUtils.isLoopbackAddr(parsedUrl.hostname)) {
                throw new Error('SecurityError: An insecure SockJS connection may not be initiated from a page loaded over HTTPS');
              }
            }

            // Step 3 - check port access - no need here
            // Step 4 - parse protocols argument
            if (!protocols) {
              protocols = [];
            } else if (!Array.isArray(protocols)) {
              protocols = [protocols];
            }

            // Step 5 - check protocols argument
            var sortedProtocols = protocols.sort();
            sortedProtocols.forEach(function (proto, i) {
              if (!proto) {
                throw new SyntaxError("The protocols entry '" + proto + "' is invalid.");
              }
              if (i < sortedProtocols.length - 1 && proto === sortedProtocols[i + 1]) {
                throw new SyntaxError("The protocols entry '" + proto + "' is duplicated.");
              }
            });

            // Step 6 - convert origin
            var o = urlUtils.getOrigin(loc.href);
            this._origin = o ? o.toLowerCase() : null;

            // remove the trailing slash
            parsedUrl.set('pathname', parsedUrl.pathname.replace(/\/+$/, ''));

            // store the sanitized url
            this.url = parsedUrl.href;
            debug('using url', this.url);

            // Step 7 - start connection in background
            // obtain server info
            // http://sockjs.github.io/sockjs-protocol/sockjs-protocol-0.3.3.html#section-26
            this._urlInfo = {
              nullOrigin: !browser.hasDomain(),
              sameOrigin: urlUtils.isOriginEqual(this.url, loc.href),
              sameScheme: urlUtils.isSchemeEqual(this.url, loc.href)
            };
            this._ir = new InfoReceiver(this.url, this._urlInfo);
            this._ir.once('finish', this._receiveInfo.bind(this));
          }
          inherits(SockJS, EventTarget);
          function userSetCode(code) {
            return code === 1000 || code >= 3000 && code <= 4999;
          }
          SockJS.prototype.close = function (code, reason) {
            // Step 1
            if (code && !userSetCode(code)) {
              throw new Error('InvalidAccessError: Invalid code');
            }
            // Step 2.4 states the max is 123 bytes, but we are just checking length
            if (reason && reason.length > 123) {
              throw new SyntaxError('reason argument has an invalid length');
            }

            // Step 3.1
            if (this.readyState === SockJS.CLOSING || this.readyState === SockJS.CLOSED) {
              return;
            }

            // TODO look at docs to determine how to set this
            var wasClean = true;
            this._close(code || 1000, reason || 'Normal closure', wasClean);
          };
          SockJS.prototype.send = function (data) {
            // #13 - convert anything non-string to string
            // TODO this currently turns objects into [object Object]
            if (typeof data !== 'string') {
              data = '' + data;
            }
            if (this.readyState === SockJS.CONNECTING) {
              throw new Error('InvalidStateError: The connection has not been established yet');
            }
            if (this.readyState !== SockJS.OPEN) {
              return;
            }
            this._transport.send(escape.quote(data));
          };
          SockJS.version = require('./version');
          SockJS.CONNECTING = 0;
          SockJS.OPEN = 1;
          SockJS.CLOSING = 2;
          SockJS.CLOSED = 3;
          SockJS.prototype._receiveInfo = function (info, rtt) {
            debug('_receiveInfo', rtt);
            this._ir = null;
            if (!info) {
              this._close(1002, 'Cannot connect to server');
              return;
            }

            // establish a round-trip timeout (RTO) based on the
            // round-trip time (RTT)
            this._rto = this.countRTO(rtt);
            // allow server to override url used for the actual transport
            this._transUrl = info.base_url ? info.base_url : this.url;
            info = objectUtils.extend(info, this._urlInfo);
            debug('info', info);
            // determine list of desired and supported transports
            var enabledTransports = transports.filterToEnabled(this._transportsWhitelist, info);
            this._transports = enabledTransports.main;
            debug(this._transports.length + ' enabled transports');
            this._connect();
          };
          SockJS.prototype._connect = function () {
            for (var Transport = this._transports.shift(); Transport; Transport = this._transports.shift()) {
              debug('attempt', Transport.transportName);
              if (Transport.needBody) {
                if (!global.document.body || typeof global.document.readyState !== 'undefined' && global.document.readyState !== 'complete' && global.document.readyState !== 'interactive') {
                  debug('waiting for body');
                  this._transports.unshift(Transport);
                  eventUtils.attachEvent('load', this._connect.bind(this));
                  return;
                }
              }

              // calculate timeout based on RTO and round trips. Default to 5s
              var timeoutMs = Math.max(this._timeout, this._rto * Transport.roundTrips || 5000);
              this._transportTimeoutId = setTimeout(this._transportTimeout.bind(this), timeoutMs);
              debug('using timeout', timeoutMs);
              var transportUrl = urlUtils.addPath(this._transUrl, '/' + this._server + '/' + this._generateSessionId());
              var options = this._transportOptions[Transport.transportName];
              debug('transport url', transportUrl);
              var transportObj = new Transport(transportUrl, this._transUrl, options);
              transportObj.on('message', this._transportMessage.bind(this));
              transportObj.once('close', this._transportClose.bind(this));
              transportObj.transportName = Transport.transportName;
              this._transport = transportObj;
              return;
            }
            this._close(2000, 'All transports failed', false);
          };
          SockJS.prototype._transportTimeout = function () {
            debug('_transportTimeout');
            if (this.readyState === SockJS.CONNECTING) {
              if (this._transport) {
                this._transport.close();
              }
              this._transportClose(2007, 'Transport timed out');
            }
          };
          SockJS.prototype._transportMessage = function (msg) {
            debug('_transportMessage', msg);
            var self = this,
              type = msg.slice(0, 1),
              content = msg.slice(1),
              payload;

            // first check for messages that don't need a payload
            switch (type) {
              case 'o':
                this._open();
                return;
              case 'h':
                this.dispatchEvent(new Event('heartbeat'));
                debug('heartbeat', this.transport);
                return;
            }
            if (content) {
              try {
                payload = JSON.parse(content);
              } catch (e) {
                debug('bad json', content);
              }
            }
            if (typeof payload === 'undefined') {
              debug('empty payload', content);
              return;
            }
            switch (type) {
              case 'a':
                if (Array.isArray(payload)) {
                  payload.forEach(function (p) {
                    debug('message', self.transport, p);
                    self.dispatchEvent(new TransportMessageEvent(p));
                  });
                }
                break;
              case 'm':
                debug('message', this.transport, payload);
                this.dispatchEvent(new TransportMessageEvent(payload));
                break;
              case 'c':
                if (Array.isArray(payload) && payload.length === 2) {
                  this._close(payload[0], payload[1], true);
                }
                break;
            }
          };
          SockJS.prototype._transportClose = function (code, reason) {
            debug('_transportClose', this.transport, code, reason);
            if (this._transport) {
              this._transport.removeAllListeners();
              this._transport = null;
              this.transport = null;
            }
            if (!userSetCode(code) && code !== 2000 && this.readyState === SockJS.CONNECTING) {
              this._connect();
              return;
            }
            this._close(code, reason);
          };
          SockJS.prototype._open = function () {
            debug('_open', this._transport && this._transport.transportName, this.readyState);
            if (this.readyState === SockJS.CONNECTING) {
              if (this._transportTimeoutId) {
                clearTimeout(this._transportTimeoutId);
                this._transportTimeoutId = null;
              }
              this.readyState = SockJS.OPEN;
              this.transport = this._transport.transportName;
              this.dispatchEvent(new Event('open'));
              debug('connected', this.transport);
            } else {
              // The server might have been restarted, and lost track of our
              // connection.
              this._close(1006, 'Server lost session');
            }
          };
          SockJS.prototype._close = function (code, reason, wasClean) {
            debug('_close', this.transport, code, reason, wasClean, this.readyState);
            var forceFail = false;
            if (this._ir) {
              forceFail = true;
              this._ir.close();
              this._ir = null;
            }
            if (this._transport) {
              this._transport.close();
              this._transport = null;
              this.transport = null;
            }
            if (this.readyState === SockJS.CLOSED) {
              throw new Error('InvalidStateError: SockJS has already been closed');
            }
            this.readyState = SockJS.CLOSING;
            setTimeout(function () {
              this.readyState = SockJS.CLOSED;
              if (forceFail) {
                this.dispatchEvent(new Event('error'));
              }
              var e = new CloseEvent('close');
              e.wasClean = wasClean || false;
              e.code = code || 1000;
              e.reason = reason;
              this.dispatchEvent(e);
              this.onmessage = this.onclose = this.onerror = null;
              debug('disconnected');
            }.bind(this), 0);
          };

          // See: http://www.erg.abdn.ac.uk/~gerrit/dccp/notes/ccid2/rto_estimator/
          // and RFC 2988.
          SockJS.prototype.countRTO = function (rtt) {
            // In a local environment, when using IE8/9 and the `jsonp-polling`
            // transport the time needed to establish a connection (the time that pass
            // from the opening of the transport to the call of `_dispatchOpen`) is
            // around 200msec (the lower bound used in the article above) and this
            // causes spurious timeouts. For this reason we calculate a value slightly
            // larger than that used in the article.
            if (rtt > 100) {
              return 4 * rtt; // rto > 400msec
            }
            return 300 + rtt; // 300msec < rto <= 400msec
          };
          module.exports = function (availableTransports) {
            transports = transport(availableTransports);
            require('./iframe-bootstrap')(SockJS, availableTransports);
            return SockJS;
          };
        }).call(this);
      }).call(this, {
        env: {}
      }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "./event/close": 2,
      "./event/event": 4,
      "./event/eventtarget": 5,
      "./event/trans-message": 6,
      "./iframe-bootstrap": 8,
      "./info-receiver": 12,
      "./location": 13,
      "./shims": 15,
      "./utils/browser": 44,
      "./utils/escape": 45,
      "./utils/event": 46,
      "./utils/log": 48,
      "./utils/object": 49,
      "./utils/random": 50,
      "./utils/transport": 51,
      "./utils/url": 52,
      "./version": 53,
      "debug": 55,
      "inherits": 57,
      "url-parse": 60
    }],
    15: [function (require, module, exports) {
      /* eslint-disable */
      /* jscs: disable */
      'use strict';

      // pulled specific shims from https://github.com/es-shims/es5-shim
      var ArrayPrototype = Array.prototype;
      var ObjectPrototype = Object.prototype;
      var FunctionPrototype = Function.prototype;
      var StringPrototype = String.prototype;
      var array_slice = ArrayPrototype.slice;
      var _toString = ObjectPrototype.toString;
      var isFunction = function (val) {
        return ObjectPrototype.toString.call(val) === '[object Function]';
      };
      var isArray = function isArray(obj) {
        return _toString.call(obj) === '[object Array]';
      };
      var isString = function isString(obj) {
        return _toString.call(obj) === '[object String]';
      };
      var supportsDescriptors = Object.defineProperty && function () {
        try {
          Object.defineProperty({}, 'x', {});
          return true;
        } catch (e) {
          /* this is ES3 */
          return false;
        }
      }();

      // Define configurable, writable and non-enumerable props
      // if they don't exist.
      var defineProperty;
      if (supportsDescriptors) {
        defineProperty = function (object, name, method, forceAssign) {
          if (!forceAssign && name in object) {
            return;
          }
          Object.defineProperty(object, name, {
            configurable: true,
            enumerable: false,
            writable: true,
            value: method
          });
        };
      } else {
        defineProperty = function (object, name, method, forceAssign) {
          if (!forceAssign && name in object) {
            return;
          }
          object[name] = method;
        };
      }
      var defineProperties = function (object, map, forceAssign) {
        for (var name in map) {
          if (ObjectPrototype.hasOwnProperty.call(map, name)) {
            defineProperty(object, name, map[name], forceAssign);
          }
        }
      };
      var toObject = function (o) {
        if (o == null) {
          // this matches both null and undefined
          throw new TypeError("can't convert " + o + ' to object');
        }
        return Object(o);
      };

      //
      // Util
      // ======
      //

      // ES5 9.4
      // http://es5.github.com/#x9.4
      // http://jsperf.com/to-integer

      function toInteger(num) {
        var n = +num;
        if (n !== n) {
          // isNaN
          n = 0;
        } else if (n !== 0 && n !== 1 / 0 && n !== -(1 / 0)) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
        return n;
      }
      function ToUint32(x) {
        return x >>> 0;
      }

      //
      // Function
      // ========
      //

      // ES-5 15.3.4.5
      // http://es5.github.com/#x15.3.4.5

      function Empty() {}
      defineProperties(FunctionPrototype, {
        bind: function bind(that) {
          // .length is 1
          // 1. Let Target be the this value.
          var target = this;
          // 2. If IsCallable(Target) is false, throw a TypeError exception.
          if (!isFunction(target)) {
            throw new TypeError('Function.prototype.bind called on incompatible ' + target);
          }
          // 3. Let A be a new (possibly empty) internal list of all of the
          //   argument values provided after thisArg (arg1, arg2 etc), in order.
          // XXX slicedArgs will stand in for "A" if used
          var args = array_slice.call(arguments, 1); // for normal call
          // 4. Let F be a new native ECMAScript object.
          // 11. Set the [[Prototype]] internal property of F to the standard
          //   built-in Function prototype object as specified in 15.3.3.1.
          // 12. Set the [[Call]] internal property of F as described in
          //   15.3.4.5.1.
          // 13. Set the [[Construct]] internal property of F as described in
          //   15.3.4.5.2.
          // 14. Set the [[HasInstance]] internal property of F as described in
          //   15.3.4.5.3.
          var binder = function () {
            if (this instanceof bound) {
              // 15.3.4.5.2 [[Construct]]
              // When the [[Construct]] internal method of a function object,
              // F that was created using the bind function is called with a
              // list of arguments ExtraArgs, the following steps are taken:
              // 1. Let target be the value of F's [[TargetFunction]]
              //   internal property.
              // 2. If target has no [[Construct]] internal method, a
              //   TypeError exception is thrown.
              // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
              //   property.
              // 4. Let args be a new list containing the same values as the
              //   list boundArgs in the same order followed by the same
              //   values as the list ExtraArgs in the same order.
              // 5. Return the result of calling the [[Construct]] internal
              //   method of target providing args as the arguments.

              var result = target.apply(this, args.concat(array_slice.call(arguments)));
              if (Object(result) === result) {
                return result;
              }
              return this;
            } else {
              // 15.3.4.5.1 [[Call]]
              // When the [[Call]] internal method of a function object, F,
              // which was created using the bind function is called with a
              // this value and a list of arguments ExtraArgs, the following
              // steps are taken:
              // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
              //   property.
              // 2. Let boundThis be the value of F's [[BoundThis]] internal
              //   property.
              // 3. Let target be the value of F's [[TargetFunction]] internal
              //   property.
              // 4. Let args be a new list containing the same values as the
              //   list boundArgs in the same order followed by the same
              //   values as the list ExtraArgs in the same order.
              // 5. Return the result of calling the [[Call]] internal method
              //   of target providing boundThis as the this value and
              //   providing args as the arguments.

              // equiv: target.call(this, ...boundArgs, ...args)
              return target.apply(that, args.concat(array_slice.call(arguments)));
            }
          };

          // 15. If the [[Class]] internal property of Target is "Function", then
          //     a. Let L be the length property of Target minus the length of A.
          //     b. Set the length own property of F to either 0 or L, whichever is
          //       larger.
          // 16. Else set the length own property of F to 0.

          var boundLength = Math.max(0, target.length - args.length);

          // 17. Set the attributes of the length own property of F to the values
          //   specified in 15.3.5.1.
          var boundArgs = [];
          for (var i = 0; i < boundLength; i++) {
            boundArgs.push('$' + i);
          }

          // XXX Build a dynamic function with desired amount of arguments is the only
          // way to set the length property of a function.
          // In environments where Content Security Policies enabled (Chrome extensions,
          // for ex.) all use of eval or Function costructor throws an exception.
          // However in all of these environments Function.prototype.bind exists
          // and so this code will never be executed.
          var bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);
          if (target.prototype) {
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            // Clean up dangling references.
            Empty.prototype = null;
          }

          // TODO
          // 18. Set the [[Extensible]] internal property of F to true.

          // TODO
          // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
          // 20. Call the [[DefineOwnProperty]] internal method of F with
          //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
          //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
          //   false.
          // 21. Call the [[DefineOwnProperty]] internal method of F with
          //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
          //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
          //   and false.

          // TODO
          // NOTE Function objects created using Function.prototype.bind do not
          // have a prototype property or the [[Code]], [[FormalParameters]], and
          // [[Scope]] internal properties.
          // XXX can't delete prototype in pure-js.

          // 22. Return F.
          return bound;
        }
      });

      //
      // Array
      // =====
      //

      // ES5 15.4.3.2
      // http://es5.github.com/#x15.4.3.2
      // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
      defineProperties(Array, {
        isArray: isArray
      });
      var boxedString = Object('a');
      var splitString = boxedString[0] !== 'a' || !(0 in boxedString);
      var properlyBoxesContext = function properlyBoxed(method) {
        // Check node 0.6.21 bug where third parameter is not boxed
        var properlyBoxesNonStrict = true;
        var properlyBoxesStrict = true;
        if (method) {
          method.call('foo', function (_, __, context) {
            if (typeof context !== 'object') {
              properlyBoxesNonStrict = false;
            }
          });
          method.call([1], function () {
            'use strict';

            properlyBoxesStrict = typeof this === 'string';
          }, 'x');
        }
        return !!method && properlyBoxesNonStrict && properlyBoxesStrict;
      };
      defineProperties(ArrayPrototype, {
        forEach: function forEach(fun /*, thisp*/) {
          var object = toObject(this),
            self = splitString && isString(this) ? this.split('') : object,
            thisp = arguments[1],
            i = -1,
            length = self.length >>> 0;

          // If no callback function or if callback is not a callable function
          if (!isFunction(fun)) {
            throw new TypeError(); // TODO message
          }
          while (++i < length) {
            if (i in self) {
              // Invoke the callback function with call, passing arguments:
              // context, property value, property key, thisArg object
              // context
              fun.call(thisp, self[i], i, object);
            }
          }
        }
      }, !properlyBoxesContext(ArrayPrototype.forEach));

      // ES5 15.4.4.14
      // http://es5.github.com/#x15.4.4.14
      // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
      var hasFirefox2IndexOfBug = Array.prototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
      defineProperties(ArrayPrototype, {
        indexOf: function indexOf(sought /*, fromIndex */) {
          var self = splitString && isString(this) ? this.split('') : toObject(this),
            length = self.length >>> 0;
          if (!length) {
            return -1;
          }
          var i = 0;
          if (arguments.length > 1) {
            i = toInteger(arguments[1]);
          }

          // handle negative indices
          i = i >= 0 ? i : Math.max(0, length + i);
          for (; i < length; i++) {
            if (i in self && self[i] === sought) {
              return i;
            }
          }
          return -1;
        }
      }, hasFirefox2IndexOfBug);

      //
      // String
      // ======
      //

      // ES5 15.5.4.14
      // http://es5.github.com/#x15.5.4.14

      // [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
      // Many browsers do not split properly with regular expressions or they
      // do not perform the split correctly under obscure conditions.
      // See http://blog.stevenlevithan.com/archives/cross-browser-split
      // I've tested in many browsers and this seems to cover the deviant ones:
      //    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
      //    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
      //    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
      //       [undefined, "t", undefined, "e", ...]
      //    ''.split(/.?/) should be [], not [""]
      //    '.'.split(/()()/) should be ["."], not ["", "", "."]

      var string_split = StringPrototype.split;
      if ('ab'.split(/(?:ab)*/).length !== 2 || '.'.split(/(.?)(.?)/).length !== 4 || 'tesst'.split(/(s)*/)[1] === 't' || 'test'.split(/(?:)/, -1).length !== 4 || ''.split(/.?/).length || '.'.split(/()()/).length > 1) {
        (function () {
          var compliantExecNpcg = /()??/.exec('')[1] === void 0; // NPCG: nonparticipating capturing group

          StringPrototype.split = function (separator, limit) {
            var string = this;
            if (separator === void 0 && limit === 0) {
              return [];
            }

            // If `separator` is not a regex, use native split
            if (_toString.call(separator) !== '[object RegExp]') {
              return string_split.call(this, separator, limit);
            }
            var output = [],
              flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.extended ? 'x' : '') + (
              // Proposed for ES6
              separator.sticky ? 'y' : ''),
              // Firefox 3+
              lastLastIndex = 0,
              // Make `global` and avoid `lastIndex` issues by working with a copy
              separator2,
              match,
              lastIndex,
              lastLength;
            separator = new RegExp(separator.source, flags + 'g');
            string += ''; // Type-convert
            if (!compliantExecNpcg) {
              // Doesn't need flags gy, but they don't hurt
              separator2 = new RegExp('^' + separator.source + '$(?!\\s)', flags);
            }
            /* Values for `limit`, per the spec:
             * If undefined: 4294967295 // Math.pow(2, 32) - 1
             * If 0, Infinity, or NaN: 0
             * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
             * If negative number: 4294967296 - Math.floor(Math.abs(limit))
             * If other: Type-convert, then use the above rules
             */
            limit = limit === void 0 ? -1 >>> 0 :
            // Math.pow(2, 32) - 1
            ToUint32(limit);
            while (match = separator.exec(string)) {
              // `separator.lastIndex` is not reliable cross-browser
              lastIndex = match.index + match[0].length;
              if (lastIndex > lastLastIndex) {
                output.push(string.slice(lastLastIndex, match.index));
                // Fix browsers whose `exec` methods don't consistently return `undefined` for
                // nonparticipating capturing groups
                if (!compliantExecNpcg && match.length > 1) {
                  match[0].replace(separator2, function () {
                    for (var i = 1; i < arguments.length - 2; i++) {
                      if (arguments[i] === void 0) {
                        match[i] = void 0;
                      }
                    }
                  });
                }
                if (match.length > 1 && match.index < string.length) {
                  ArrayPrototype.push.apply(output, match.slice(1));
                }
                lastLength = match[0].length;
                lastLastIndex = lastIndex;
                if (output.length >= limit) {
                  break;
                }
              }
              if (separator.lastIndex === match.index) {
                separator.lastIndex++; // Avoid an infinite loop
              }
            }
            if (lastLastIndex === string.length) {
              if (lastLength || !separator.test('')) {
                output.push('');
              }
            } else {
              output.push(string.slice(lastLastIndex));
            }
            return output.length > limit ? output.slice(0, limit) : output;
          };
        })();

        // [bugfix, chrome]
        // If separator is undefined, then the result array contains just one String,
        // which is the this value (converted to a String). If limit is not undefined,
        // then the output array is truncated so that it contains no more than limit
        // elements.
        // "0".split(undefined, 0) -> []
      } else if ('0'.split(void 0, 0).length) {
        StringPrototype.split = function split(separator, limit) {
          if (separator === void 0 && limit === 0) {
            return [];
          }
          return string_split.call(this, separator, limit);
        };
      }

      // ECMA-262, 3rd B.2.3
      // Not an ECMAScript standard, although ECMAScript 3rd Edition has a
      // non-normative section suggesting uniform semantics and it should be
      // normalized across all browsers
      // [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
      var string_substr = StringPrototype.substr;
      var hasNegativeSubstrBug = ''.substr && '0b'.substr(-1) !== 'b';
      defineProperties(StringPrototype, {
        substr: function substr(start, length) {
          return string_substr.call(this, start < 0 ? (start = this.length + start) < 0 ? 0 : start : start, length);
        }
      }, hasNegativeSubstrBug);
    }, {}],
    16: [function (require, module, exports) {
      'use strict';

      module.exports = [
      // streaming transports
      require('./transport/websocket'), require('./transport/xhr-streaming'), require('./transport/xdr-streaming'), require('./transport/eventsource'), require('./transport/lib/iframe-wrap')(require('./transport/eventsource'))

      // polling transports
      , require('./transport/htmlfile'), require('./transport/lib/iframe-wrap')(require('./transport/htmlfile')), require('./transport/xhr-polling'), require('./transport/xdr-polling'), require('./transport/lib/iframe-wrap')(require('./transport/xhr-polling')), require('./transport/jsonp-polling')];
    }, {
      "./transport/eventsource": 20,
      "./transport/htmlfile": 21,
      "./transport/jsonp-polling": 23,
      "./transport/lib/iframe-wrap": 26,
      "./transport/websocket": 38,
      "./transport/xdr-polling": 39,
      "./transport/xdr-streaming": 40,
      "./transport/xhr-polling": 41,
      "./transport/xhr-streaming": 42
    }],
    17: [function (require, module, exports) {
      (function (process, global) {
        (function () {
          'use strict';

          var EventEmitter = require('events').EventEmitter,
            inherits = require('inherits'),
            utils = require('../../utils/event'),
            urlUtils = require('../../utils/url'),
            XHR = global.XMLHttpRequest;
          var debug = function () {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:browser:xhr');
          }
          function AbstractXHRObject(method, url, payload, opts) {
            debug(method, url);
            var self = this;
            EventEmitter.call(this);
            setTimeout(function () {
              self._start(method, url, payload, opts);
            }, 0);
          }
          inherits(AbstractXHRObject, EventEmitter);
          AbstractXHRObject.prototype._start = function (method, url, payload, opts) {
            var self = this;
            try {
              this.xhr = new XHR();
            } catch (x) {
              // intentionally empty
            }
            if (!this.xhr) {
              debug('no xhr');
              this.emit('finish', 0, 'no xhr support');
              this._cleanup();
              return;
            }

            // several browsers cache POSTs
            url = urlUtils.addQuery(url, 't=' + +new Date());

            // Explorer tends to keep connection open, even after the
            // tab gets closed: http://bugs.jquery.com/ticket/5280
            this.unloadRef = utils.unloadAdd(function () {
              debug('unload cleanup');
              self._cleanup(true);
            });
            try {
              this.xhr.open(method, url, true);
              if (this.timeout && 'timeout' in this.xhr) {
                this.xhr.timeout = this.timeout;
                this.xhr.ontimeout = function () {
                  debug('xhr timeout');
                  self.emit('finish', 0, '');
                  self._cleanup(false);
                };
              }
            } catch (e) {
              debug('exception', e);
              // IE raises an exception on wrong port.
              this.emit('finish', 0, '');
              this._cleanup(false);
              return;
            }
            if ((!opts || !opts.noCredentials) && AbstractXHRObject.supportsCORS) {
              debug('withCredentials');
              // Mozilla docs says https://developer.mozilla.org/en/XMLHttpRequest :
              // "This never affects same-site requests."

              this.xhr.withCredentials = true;
            }
            if (opts && opts.headers) {
              for (var key in opts.headers) {
                this.xhr.setRequestHeader(key, opts.headers[key]);
              }
            }
            this.xhr.onreadystatechange = function () {
              if (self.xhr) {
                var x = self.xhr;
                var text, status;
                debug('readyState', x.readyState);
                switch (x.readyState) {
                  case 3:
                    // IE doesn't like peeking into responseText or status
                    // on Microsoft.XMLHTTP and readystate=3
                    try {
                      status = x.status;
                      text = x.responseText;
                    } catch (e) {
                      // intentionally empty
                    }
                    debug('status', status);
                    // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
                    if (status === 1223) {
                      status = 204;
                    }

                    // IE does return readystate == 3 for 404 answers.
                    if (status === 200 && text && text.length > 0) {
                      debug('chunk');
                      self.emit('chunk', status, text);
                    }
                    break;
                  case 4:
                    status = x.status;
                    debug('status', status);
                    // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
                    if (status === 1223) {
                      status = 204;
                    }
                    // IE returns this for a bad port
                    // http://msdn.microsoft.com/en-us/library/windows/desktop/aa383770(v=vs.85).aspx
                    if (status === 12005 || status === 12029) {
                      status = 0;
                    }
                    debug('finish', status, x.responseText);
                    self.emit('finish', status, x.responseText);
                    self._cleanup(false);
                    break;
                }
              }
            };
            try {
              self.xhr.send(payload);
            } catch (e) {
              self.emit('finish', 0, '');
              self._cleanup(false);
            }
          };
          AbstractXHRObject.prototype._cleanup = function (abort) {
            debug('cleanup');
            if (!this.xhr) {
              return;
            }
            this.removeAllListeners();
            utils.unloadDel(this.unloadRef);

            // IE needs this field to be a function
            this.xhr.onreadystatechange = function () {};
            if (this.xhr.ontimeout) {
              this.xhr.ontimeout = null;
            }
            if (abort) {
              try {
                this.xhr.abort();
              } catch (x) {
                // intentionally empty
              }
            }
            this.unloadRef = this.xhr = null;
          };
          AbstractXHRObject.prototype.close = function () {
            debug('close');
            this._cleanup(true);
          };
          AbstractXHRObject.enabled = !!XHR;
          // override XMLHttpRequest for IE6/7
          // obfuscate to avoid firewalls
          var axo = ['Active'].concat('Object').join('X');
          if (!AbstractXHRObject.enabled && axo in global) {
            debug('overriding xmlhttprequest');
            XHR = function () {
              try {
                return new global[axo]('Microsoft.XMLHTTP');
              } catch (e) {
                return null;
              }
            };
            AbstractXHRObject.enabled = !!new XHR();
          }
          var cors = false;
          try {
            cors = 'withCredentials' in new XHR();
          } catch (ignored) {
            // intentionally empty
          }
          AbstractXHRObject.supportsCORS = cors;
          module.exports = AbstractXHRObject;
        }).call(this);
      }).call(this, {
        env: {}
      }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "../../utils/event": 46,
      "../../utils/url": 52,
      "debug": 55,
      "events": 3,
      "inherits": 57
    }],
    18: [function (require, module, exports) {
      (function (global) {
        (function () {
          module.exports = global.EventSource;
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}],
    19: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict';

          var Driver = global.WebSocket || global.MozWebSocket;
          if (Driver) {
            module.exports = function WebSocketBrowserDriver(url) {
              return new Driver(url);
            };
          } else {
            module.exports = undefined;
          }
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}],
    20: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
        AjaxBasedTransport = require('./lib/ajax-based'),
        EventSourceReceiver = require('./receiver/eventsource'),
        XHRCorsObject = require('./sender/xhr-cors'),
        EventSourceDriver = require('eventsource');
      function EventSourceTransport(transUrl) {
        if (!EventSourceTransport.enabled()) {
          throw new Error('Transport created when disabled');
        }
        AjaxBasedTransport.call(this, transUrl, '/eventsource', EventSourceReceiver, XHRCorsObject);
      }
      inherits(EventSourceTransport, AjaxBasedTransport);
      EventSourceTransport.enabled = function () {
        return !!EventSourceDriver;
      };
      EventSourceTransport.transportName = 'eventsource';
      EventSourceTransport.roundTrips = 2;
      module.exports = EventSourceTransport;
    }, {
      "./lib/ajax-based": 24,
      "./receiver/eventsource": 29,
      "./sender/xhr-cors": 35,
      "eventsource": 18,
      "inherits": 57
    }],
    21: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
        HtmlfileReceiver = require('./receiver/htmlfile'),
        XHRLocalObject = require('./sender/xhr-local'),
        AjaxBasedTransport = require('./lib/ajax-based');
      function HtmlFileTransport(transUrl) {
        if (!HtmlfileReceiver.enabled) {
          throw new Error('Transport created when disabled');
        }
        AjaxBasedTransport.call(this, transUrl, '/htmlfile', HtmlfileReceiver, XHRLocalObject);
      }
      inherits(HtmlFileTransport, AjaxBasedTransport);
      HtmlFileTransport.enabled = function (info) {
        return HtmlfileReceiver.enabled && info.sameOrigin;
      };
      HtmlFileTransport.transportName = 'htmlfile';
      HtmlFileTransport.roundTrips = 2;
      module.exports = HtmlFileTransport;
    }, {
      "./lib/ajax-based": 24,
      "./receiver/htmlfile": 30,
      "./sender/xhr-local": 37,
      "inherits": 57
    }],
    22: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          // Few cool transports do work only for same-origin. In order to make
          // them work cross-domain we shall use iframe, served from the
          // remote domain. New browsers have capabilities to communicate with
          // cross domain iframe using postMessage(). In IE it was implemented
          // from IE 8+, but of course, IE got some details wrong:
          //    http://msdn.microsoft.com/en-us/library/cc197015(v=VS.85).aspx
          //    http://stevesouders.com/misc/test-postmessage.php
          var inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter,
            version = require('../version'),
            urlUtils = require('../utils/url'),
            iframeUtils = require('../utils/iframe'),
            eventUtils = require('../utils/event'),
            random = require('../utils/random');
          var debug = function () {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:transport:iframe');
          }
          function IframeTransport(transport, transUrl, baseUrl) {
            if (!IframeTransport.enabled()) {
              throw new Error('Transport created when disabled');
            }
            EventEmitter.call(this);
            var self = this;
            this.origin = urlUtils.getOrigin(baseUrl);
            this.baseUrl = baseUrl;
            this.transUrl = transUrl;
            this.transport = transport;
            this.windowId = random.string(8);
            var iframeUrl = urlUtils.addPath(baseUrl, '/iframe.html') + '#' + this.windowId;
            debug(transport, transUrl, iframeUrl);
            this.iframeObj = iframeUtils.createIframe(iframeUrl, function (r) {
              debug('err callback');
              self.emit('close', 1006, 'Unable to load an iframe (' + r + ')');
              self.close();
            });
            this.onmessageCallback = this._message.bind(this);
            eventUtils.attachEvent('message', this.onmessageCallback);
          }
          inherits(IframeTransport, EventEmitter);
          IframeTransport.prototype.close = function () {
            debug('close');
            this.removeAllListeners();
            if (this.iframeObj) {
              eventUtils.detachEvent('message', this.onmessageCallback);
              try {
                // When the iframe is not loaded, IE raises an exception
                // on 'contentWindow'.
                this.postMessage('c');
              } catch (x) {
                // intentionally empty
              }
              this.iframeObj.cleanup();
              this.iframeObj = null;
              this.onmessageCallback = this.iframeObj = null;
            }
          };
          IframeTransport.prototype._message = function (e) {
            debug('message', e.data);
            if (!urlUtils.isOriginEqual(e.origin, this.origin)) {
              debug('not same origin', e.origin, this.origin);
              return;
            }
            var iframeMessage;
            try {
              iframeMessage = JSON.parse(e.data);
            } catch (ignored) {
              debug('bad json', e.data);
              return;
            }
            if (iframeMessage.windowId !== this.windowId) {
              debug('mismatched window id', iframeMessage.windowId, this.windowId);
              return;
            }
            switch (iframeMessage.type) {
              case 's':
                this.iframeObj.loaded();
                // window global dependency
                this.postMessage('s', JSON.stringify([version, this.transport, this.transUrl, this.baseUrl]));
                break;
              case 't':
                this.emit('message', iframeMessage.data);
                break;
              case 'c':
                var cdata;
                try {
                  cdata = JSON.parse(iframeMessage.data);
                } catch (ignored) {
                  debug('bad json', iframeMessage.data);
                  return;
                }
                this.emit('close', cdata[0], cdata[1]);
                this.close();
                break;
            }
          };
          IframeTransport.prototype.postMessage = function (type, data) {
            debug('postMessage', type, data);
            this.iframeObj.post(JSON.stringify({
              windowId: this.windowId,
              type: type,
              data: data || ''
            }), this.origin);
          };
          IframeTransport.prototype.send = function (message) {
            debug('send', message);
            this.postMessage('m', message);
          };
          IframeTransport.enabled = function () {
            return iframeUtils.iframeEnabled;
          };
          IframeTransport.transportName = 'iframe';
          IframeTransport.roundTrips = 2;
          module.exports = IframeTransport;
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "../utils/event": 46,
      "../utils/iframe": 47,
      "../utils/random": 50,
      "../utils/url": 52,
      "../version": 53,
      "debug": 55,
      "events": 3,
      "inherits": 57
    }],
    23: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict';

          // The simplest and most robust transport, using the well-know cross
          // domain hack - JSONP. This transport is quite inefficient - one
          // message could use up to one http request. But at least it works almost
          // everywhere.
          // Known limitations:
          //   o you will get a spinning cursor
          //   o for Konqueror a dumb timer is needed to detect errors
          var inherits = require('inherits'),
            SenderReceiver = require('./lib/sender-receiver'),
            JsonpReceiver = require('./receiver/jsonp'),
            jsonpSender = require('./sender/jsonp');
          function JsonPTransport(transUrl) {
            if (!JsonPTransport.enabled()) {
              throw new Error('Transport created when disabled');
            }
            SenderReceiver.call(this, transUrl, '/jsonp', jsonpSender, JsonpReceiver);
          }
          inherits(JsonPTransport, SenderReceiver);
          JsonPTransport.enabled = function () {
            return !!global.document;
          };
          JsonPTransport.transportName = 'jsonp-polling';
          JsonPTransport.roundTrips = 1;
          JsonPTransport.needBody = true;
          module.exports = JsonPTransport;
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "./lib/sender-receiver": 28,
      "./receiver/jsonp": 31,
      "./sender/jsonp": 33,
      "inherits": 57
    }],
    24: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          var inherits = require('inherits'),
            urlUtils = require('../../utils/url'),
            SenderReceiver = require('./sender-receiver');
          var debug = function () {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:ajax-based');
          }
          function createAjaxSender(AjaxObject) {
            return function (url, payload, callback) {
              debug('create ajax sender', url, payload);
              var opt = {};
              if (typeof payload === 'string') {
                opt.headers = {
                  'Content-type': 'text/plain'
                };
              }
              var ajaxUrl = urlUtils.addPath(url, '/xhr_send');
              var xo = new AjaxObject('POST', ajaxUrl, payload, opt);
              xo.once('finish', function (status) {
                debug('finish', status);
                xo = null;
                if (status !== 200 && status !== 204) {
                  return callback(new Error('http status ' + status));
                }
                callback();
              });
              return function () {
                debug('abort');
                xo.close();
                xo = null;
                var err = new Error('Aborted');
                err.code = 1000;
                callback(err);
              };
            };
          }
          function AjaxBasedTransport(transUrl, urlSuffix, Receiver, AjaxObject) {
            SenderReceiver.call(this, transUrl, urlSuffix, createAjaxSender(AjaxObject), Receiver, AjaxObject);
          }
          inherits(AjaxBasedTransport, SenderReceiver);
          module.exports = AjaxBasedTransport;
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "../../utils/url": 52,
      "./sender-receiver": 28,
      "debug": 55,
      "inherits": 57
    }],
    25: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          var inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter;
          var debug = function () {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:buffered-sender');
          }
          function BufferedSender(url, sender) {
            debug(url);
            EventEmitter.call(this);
            this.sendBuffer = [];
            this.sender = sender;
            this.url = url;
          }
          inherits(BufferedSender, EventEmitter);
          BufferedSender.prototype.send = function (message) {
            debug('send', message);
            this.sendBuffer.push(message);
            if (!this.sendStop) {
              this.sendSchedule();
            }
          };

          // For polling transports in a situation when in the message callback,
          // new message is being send. If the sending connection was started
          // before receiving one, it is possible to saturate the network and
          // timeout due to the lack of receiving socket. To avoid that we delay
          // sending messages by some small time, in order to let receiving
          // connection be started beforehand. This is only a halfmeasure and
          // does not fix the big problem, but it does make the tests go more
          // stable on slow networks.
          BufferedSender.prototype.sendScheduleWait = function () {
            debug('sendScheduleWait');
            var self = this;
            var tref;
            this.sendStop = function () {
              debug('sendStop');
              self.sendStop = null;
              clearTimeout(tref);
            };
            tref = setTimeout(function () {
              debug('timeout');
              self.sendStop = null;
              self.sendSchedule();
            }, 25);
          };
          BufferedSender.prototype.sendSchedule = function () {
            debug('sendSchedule', this.sendBuffer.length);
            var self = this;
            if (this.sendBuffer.length > 0) {
              var payload = '[' + this.sendBuffer.join(',') + ']';
              this.sendStop = this.sender(this.url, payload, function (err) {
                self.sendStop = null;
                if (err) {
                  debug('error', err);
                  self.emit('close', err.code || 1006, 'Sending error: ' + err);
                  self.close();
                } else {
                  self.sendScheduleWait();
                }
              });
              this.sendBuffer = [];
            }
          };
          BufferedSender.prototype._cleanup = function () {
            debug('_cleanup');
            this.removeAllListeners();
          };
          BufferedSender.prototype.close = function () {
            debug('close');
            this._cleanup();
            if (this.sendStop) {
              this.sendStop();
              this.sendStop = null;
            }
          };
          module.exports = BufferedSender;
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "debug": 55,
      "events": 3,
      "inherits": 57
    }],
    26: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict';

          var inherits = require('inherits'),
            IframeTransport = require('../iframe'),
            objectUtils = require('../../utils/object');
          module.exports = function (transport) {
            function IframeWrapTransport(transUrl, baseUrl) {
              IframeTransport.call(this, transport.transportName, transUrl, baseUrl);
            }
            inherits(IframeWrapTransport, IframeTransport);
            IframeWrapTransport.enabled = function (url, info) {
              if (!global.document) {
                return false;
              }
              var iframeInfo = objectUtils.extend({}, info);
              iframeInfo.sameOrigin = true;
              return transport.enabled(iframeInfo) && IframeTransport.enabled();
            };
            IframeWrapTransport.transportName = 'iframe-' + transport.transportName;
            IframeWrapTransport.needBody = true;
            IframeWrapTransport.roundTrips = IframeTransport.roundTrips + transport.roundTrips - 1; // html, javascript (2) + transport - no CORS (1)

            IframeWrapTransport.facadeTransport = transport;
            return IframeWrapTransport;
          };
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "../../utils/object": 49,
      "../iframe": 22,
      "inherits": 57
    }],
    27: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          var inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter;
          var debug = function () {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:polling');
          }
          function Polling(Receiver, receiveUrl, AjaxObject) {
            debug(receiveUrl);
            EventEmitter.call(this);
            this.Receiver = Receiver;
            this.receiveUrl = receiveUrl;
            this.AjaxObject = AjaxObject;
            this._scheduleReceiver();
          }
          inherits(Polling, EventEmitter);
          Polling.prototype._scheduleReceiver = function () {
            debug('_scheduleReceiver');
            var self = this;
            var poll = this.poll = new this.Receiver(this.receiveUrl, this.AjaxObject);
            poll.on('message', function (msg) {
              debug('message', msg);
              self.emit('message', msg);
            });
            poll.once('close', function (code, reason) {
              debug('close', code, reason, self.pollIsClosing);
              self.poll = poll = null;
              if (!self.pollIsClosing) {
                if (reason === 'network') {
                  self._scheduleReceiver();
                } else {
                  self.emit('close', code || 1006, reason);
                  self.removeAllListeners();
                }
              }
            });
          };
          Polling.prototype.abort = function () {
            debug('abort');
            this.removeAllListeners();
            this.pollIsClosing = true;
            if (this.poll) {
              this.poll.abort();
            }
          };
          module.exports = Polling;
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "debug": 55,
      "events": 3,
      "inherits": 57
    }],
    28: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          var inherits = require('inherits'),
            urlUtils = require('../../utils/url'),
            BufferedSender = require('./buffered-sender'),
            Polling = require('./polling');
          var debug = function () {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:sender-receiver');
          }
          function SenderReceiver(transUrl, urlSuffix, senderFunc, Receiver, AjaxObject) {
            var pollUrl = urlUtils.addPath(transUrl, urlSuffix);
            debug(pollUrl);
            var self = this;
            BufferedSender.call(this, transUrl, senderFunc);
            this.poll = new Polling(Receiver, pollUrl, AjaxObject);
            this.poll.on('message', function (msg) {
              debug('poll message', msg);
              self.emit('message', msg);
            });
            this.poll.once('close', function (code, reason) {
              debug('poll close', code, reason);
              self.poll = null;
              self.emit('close', code, reason);
              self.close();
            });
          }
          inherits(SenderReceiver, BufferedSender);
          SenderReceiver.prototype.close = function () {
            BufferedSender.prototype.close.call(this);
            debug('close');
            this.removeAllListeners();
            if (this.poll) {
              this.poll.abort();
              this.poll = null;
            }
          };
          module.exports = SenderReceiver;
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "../../utils/url": 52,
      "./buffered-sender": 25,
      "./polling": 27,
      "debug": 55,
      "inherits": 57
    }],
    29: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          var inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter,
            EventSourceDriver = require('eventsource');
          var debug = function () {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:receiver:eventsource');
          }
          function EventSourceReceiver(url) {
            debug(url);
            EventEmitter.call(this);
            var self = this;
            var es = this.es = new EventSourceDriver(url);
            es.onmessage = function (e) {
              debug('message', e.data);
              self.emit('message', decodeURI(e.data));
            };
            es.onerror = function (e) {
              debug('error', es.readyState, e);
              // ES on reconnection has readyState = 0 or 1.
              // on network error it's CLOSED = 2
              var reason = es.readyState !== 2 ? 'network' : 'permanent';
              self._cleanup();
              self._close(reason);
            };
          }
          inherits(EventSourceReceiver, EventEmitter);
          EventSourceReceiver.prototype.abort = function () {
            debug('abort');
            this._cleanup();
            this._close('user');
          };
          EventSourceReceiver.prototype._cleanup = function () {
            debug('cleanup');
            var es = this.es;
            if (es) {
              es.onmessage = es.onerror = null;
              es.close();
              this.es = null;
            }
          };
          EventSourceReceiver.prototype._close = function (reason) {
            debug('close', reason);
            var self = this;
            // Safari and chrome < 15 crash if we close window before
            // waiting for ES cleanup. See:
            // https://code.google.com/p/chromium/issues/detail?id=89155
            setTimeout(function () {
              self.emit('close', null, reason);
              self.removeAllListeners();
            }, 200);
          };
          module.exports = EventSourceReceiver;
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "debug": 55,
      "events": 3,
      "eventsource": 18,
      "inherits": 57
    }],
    30: [function (require, module, exports) {
      (function (process, global) {
        (function () {
          'use strict';

          var inherits = require('inherits'),
            iframeUtils = require('../../utils/iframe'),
            urlUtils = require('../../utils/url'),
            EventEmitter = require('events').EventEmitter,
            random = require('../../utils/random');
          var debug = function () {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:receiver:htmlfile');
          }
          function HtmlfileReceiver(url) {
            debug(url);
            EventEmitter.call(this);
            var self = this;
            iframeUtils.polluteGlobalNamespace();
            this.id = 'a' + random.string(6);
            url = urlUtils.addQuery(url, 'c=' + decodeURIComponent(iframeUtils.WPrefix + '.' + this.id));
            debug('using htmlfile', HtmlfileReceiver.htmlfileEnabled);
            var constructFunc = HtmlfileReceiver.htmlfileEnabled ? iframeUtils.createHtmlfile : iframeUtils.createIframe;
            global[iframeUtils.WPrefix][this.id] = {
              start: function () {
                debug('start');
                self.iframeObj.loaded();
              },
              message: function (data) {
                debug('message', data);
                self.emit('message', data);
              },
              stop: function () {
                debug('stop');
                self._cleanup();
                self._close('network');
              }
            };
            this.iframeObj = constructFunc(url, function () {
              debug('callback');
              self._cleanup();
              self._close('permanent');
            });
          }
          inherits(HtmlfileReceiver, EventEmitter);
          HtmlfileReceiver.prototype.abort = function () {
            debug('abort');
            this._cleanup();
            this._close('user');
          };
          HtmlfileReceiver.prototype._cleanup = function () {
            debug('_cleanup');
            if (this.iframeObj) {
              this.iframeObj.cleanup();
              this.iframeObj = null;
            }
            delete global[iframeUtils.WPrefix][this.id];
          };
          HtmlfileReceiver.prototype._close = function (reason) {
            debug('_close', reason);
            this.emit('close', null, reason);
            this.removeAllListeners();
          };
          HtmlfileReceiver.htmlfileEnabled = false;

          // obfuscate to avoid firewalls
          var axo = ['Active'].concat('Object').join('X');
          if (axo in global) {
            try {
              HtmlfileReceiver.htmlfileEnabled = !!new global[axo]('htmlfile');
            } catch (x) {
              // intentionally empty
            }
          }
          HtmlfileReceiver.enabled = HtmlfileReceiver.htmlfileEnabled || iframeUtils.iframeEnabled;
          module.exports = HtmlfileReceiver;
        }).call(this);
      }).call(this, {
        env: {}
      }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "../../utils/iframe": 47,
      "../../utils/random": 50,
      "../../utils/url": 52,
      "debug": 55,
      "events": 3,
      "inherits": 57
    }],
    31: [function (require, module, exports) {
      (function (process, global) {
        (function () {
          'use strict';

          var utils = require('../../utils/iframe'),
            random = require('../../utils/random'),
            browser = require('../../utils/browser'),
            urlUtils = require('../../utils/url'),
            inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter;
          var debug = function () {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:receiver:jsonp');
          }
          function JsonpReceiver(url) {
            debug(url);
            var self = this;
            EventEmitter.call(this);
            utils.polluteGlobalNamespace();
            this.id = 'a' + random.string(6);
            var urlWithId = urlUtils.addQuery(url, 'c=' + encodeURIComponent(utils.WPrefix + '.' + this.id));
            global[utils.WPrefix][this.id] = this._callback.bind(this);
            this._createScript(urlWithId);

            // Fallback mostly for Konqueror - stupid timer, 35 seconds shall be plenty.
            this.timeoutId = setTimeout(function () {
              debug('timeout');
              self._abort(new Error('JSONP script loaded abnormally (timeout)'));
            }, JsonpReceiver.timeout);
          }
          inherits(JsonpReceiver, EventEmitter);
          JsonpReceiver.prototype.abort = function () {
            debug('abort');
            if (global[utils.WPrefix][this.id]) {
              var err = new Error('JSONP user aborted read');
              err.code = 1000;
              this._abort(err);
            }
          };
          JsonpReceiver.timeout = 35000;
          JsonpReceiver.scriptErrorTimeout = 1000;
          JsonpReceiver.prototype._callback = function (data) {
            debug('_callback', data);
            this._cleanup();
            if (this.aborting) {
              return;
            }
            if (data) {
              debug('message', data);
              this.emit('message', data);
            }
            this.emit('close', null, 'network');
            this.removeAllListeners();
          };
          JsonpReceiver.prototype._abort = function (err) {
            debug('_abort', err);
            this._cleanup();
            this.aborting = true;
            this.emit('close', err.code, err.message);
            this.removeAllListeners();
          };
          JsonpReceiver.prototype._cleanup = function () {
            debug('_cleanup');
            clearTimeout(this.timeoutId);
            if (this.script2) {
              this.script2.parentNode.removeChild(this.script2);
              this.script2 = null;
            }
            if (this.script) {
              var script = this.script;
              // Unfortunately, you can't really abort script loading of
              // the script.
              script.parentNode.removeChild(script);
              script.onreadystatechange = script.onerror = script.onload = script.onclick = null;
              this.script = null;
            }
            delete global[utils.WPrefix][this.id];
          };
          JsonpReceiver.prototype._scriptError = function () {
            debug('_scriptError');
            var self = this;
            if (this.errorTimer) {
              return;
            }
            this.errorTimer = setTimeout(function () {
              if (!self.loadedOkay) {
                self._abort(new Error('JSONP script loaded abnormally (onerror)'));
              }
            }, JsonpReceiver.scriptErrorTimeout);
          };
          JsonpReceiver.prototype._createScript = function (url) {
            debug('_createScript', url);
            var self = this;
            var script = this.script = global.document.createElement('script');
            var script2; // Opera synchronous load trick.

            script.id = 'a' + random.string(8);
            script.src = url;
            script.type = 'text/javascript';
            script.charset = 'UTF-8';
            script.onerror = this._scriptError.bind(this);
            script.onload = function () {
              debug('onload');
              self._abort(new Error('JSONP script loaded abnormally (onload)'));
            };

            // IE9 fires 'error' event after onreadystatechange or before, in random order.
            // Use loadedOkay to determine if actually errored
            script.onreadystatechange = function () {
              debug('onreadystatechange', script.readyState);
              if (/loaded|closed/.test(script.readyState)) {
                if (script && script.htmlFor && script.onclick) {
                  self.loadedOkay = true;
                  try {
                    // In IE, actually execute the script.
                    script.onclick();
                  } catch (x) {
                    // intentionally empty
                  }
                }
                if (script) {
                  self._abort(new Error('JSONP script loaded abnormally (onreadystatechange)'));
                }
              }
            };
            // IE: event/htmlFor/onclick trick.
            // One can't rely on proper order for onreadystatechange. In order to
            // make sure, set a 'htmlFor' and 'event' properties, so that
            // script code will be installed as 'onclick' handler for the
            // script object. Later, onreadystatechange, manually execute this
            // code. FF and Chrome doesn't work with 'event' and 'htmlFor'
            // set. For reference see:
            //   http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
            // Also, read on that about script ordering:
            //   http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
            if (typeof script.async === 'undefined' && global.document.attachEvent) {
              // According to mozilla docs, in recent browsers script.async defaults
              // to 'true', so we may use it to detect a good browser:
              // https://developer.mozilla.org/en/HTML/Element/script
              if (!browser.isOpera()) {
                // Naively assume we're in IE
                try {
                  script.htmlFor = script.id;
                  script.event = 'onclick';
                } catch (x) {
                  // intentionally empty
                }
                script.async = true;
              } else {
                // Opera, second sync script hack
                script2 = this.script2 = global.document.createElement('script');
                script2.text = "try{var a = document.getElementById('" + script.id + "'); if(a)a.onerror();}catch(x){};";
                script.async = script2.async = false;
              }
            }
            if (typeof script.async !== 'undefined') {
              script.async = true;
            }
            var head = global.document.getElementsByTagName('head')[0];
            head.insertBefore(script, head.firstChild);
            if (script2) {
              head.insertBefore(script2, head.firstChild);
            }
          };
          module.exports = JsonpReceiver;
        }).call(this);
      }).call(this, {
        env: {}
      }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "../../utils/browser": 44,
      "../../utils/iframe": 47,
      "../../utils/random": 50,
      "../../utils/url": 52,
      "debug": 55,
      "events": 3,
      "inherits": 57
    }],
    32: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          var inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter;
          var debug = function () {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:receiver:xhr');
          }
          function XhrReceiver(url, AjaxObject) {
            debug(url);
            EventEmitter.call(this);
            var self = this;
            this.bufferPosition = 0;
            this.xo = new AjaxObject('POST', url, null);
            this.xo.on('chunk', this._chunkHandler.bind(this));
            this.xo.once('finish', function (status, text) {
              debug('finish', status, text);
              self._chunkHandler(status, text);
              self.xo = null;
              var reason = status === 200 ? 'network' : 'permanent';
              debug('close', reason);
              self.emit('close', null, reason);
              self._cleanup();
            });
          }
          inherits(XhrReceiver, EventEmitter);
          XhrReceiver.prototype._chunkHandler = function (status, text) {
            debug('_chunkHandler', status);
            if (status !== 200 || !text) {
              return;
            }
            for (var idx = -1;; this.bufferPosition += idx + 1) {
              var buf = text.slice(this.bufferPosition);
              idx = buf.indexOf('\n');
              if (idx === -1) {
                break;
              }
              var msg = buf.slice(0, idx);
              if (msg) {
                debug('message', msg);
                this.emit('message', msg);
              }
            }
          };
          XhrReceiver.prototype._cleanup = function () {
            debug('_cleanup');
            this.removeAllListeners();
          };
          XhrReceiver.prototype.abort = function () {
            debug('abort');
            if (this.xo) {
              this.xo.close();
              debug('close');
              this.emit('close', null, 'user');
              this.xo = null;
            }
            this._cleanup();
          };
          module.exports = XhrReceiver;
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "debug": 55,
      "events": 3,
      "inherits": 57
    }],
    33: [function (require, module, exports) {
      (function (process, global) {
        (function () {
          'use strict';

          var random = require('../../utils/random'),
            urlUtils = require('../../utils/url');
          var debug = function () {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:sender:jsonp');
          }
          var form, area;
          function createIframe(id) {
            debug('createIframe', id);
            try {
              // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
              return global.document.createElement('<iframe name="' + id + '">');
            } catch (x) {
              var iframe = global.document.createElement('iframe');
              iframe.name = id;
              return iframe;
            }
          }
          function createForm() {
            debug('createForm');
            form = global.document.createElement('form');
            form.style.display = 'none';
            form.style.position = 'absolute';
            form.method = 'POST';
            form.enctype = 'application/x-www-form-urlencoded';
            form.acceptCharset = 'UTF-8';
            area = global.document.createElement('textarea');
            area.name = 'd';
            form.appendChild(area);
            global.document.body.appendChild(form);
          }
          module.exports = function (url, payload, callback) {
            debug(url, payload);
            if (!form) {
              createForm();
            }
            var id = 'a' + random.string(8);
            form.target = id;
            form.action = urlUtils.addQuery(urlUtils.addPath(url, '/jsonp_send'), 'i=' + id);
            var iframe = createIframe(id);
            iframe.id = id;
            iframe.style.display = 'none';
            form.appendChild(iframe);
            try {
              area.value = payload;
            } catch (e) {
              // seriously broken browsers get here
            }
            form.submit();
            var completed = function (err) {
              debug('completed', id, err);
              if (!iframe.onerror) {
                return;
              }
              iframe.onreadystatechange = iframe.onerror = iframe.onload = null;
              // Opera mini doesn't like if we GC iframe
              // immediately, thus this timeout.
              setTimeout(function () {
                debug('cleaning up', id);
                iframe.parentNode.removeChild(iframe);
                iframe = null;
              }, 500);
              area.value = '';
              // It is not possible to detect if the iframe succeeded or
              // failed to submit our form.
              callback(err);
            };
            iframe.onerror = function () {
              debug('onerror', id);
              completed();
            };
            iframe.onload = function () {
              debug('onload', id);
              completed();
            };
            iframe.onreadystatechange = function (e) {
              debug('onreadystatechange', id, iframe.readyState, e);
              if (iframe.readyState === 'complete') {
                completed();
              }
            };
            return function () {
              debug('aborted', id);
              completed(new Error('Aborted'));
            };
          };
        }).call(this);
      }).call(this, {
        env: {}
      }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "../../utils/random": 50,
      "../../utils/url": 52,
      "debug": 55
    }],
    34: [function (require, module, exports) {
      (function (process, global) {
        (function () {
          'use strict';

          var EventEmitter = require('events').EventEmitter,
            inherits = require('inherits'),
            eventUtils = require('../../utils/event'),
            browser = require('../../utils/browser'),
            urlUtils = require('../../utils/url');
          var debug = function () {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:sender:xdr');
          }

          // References:
          //   http://ajaxian.com/archives/100-line-ajax-wrapper
          //   http://msdn.microsoft.com/en-us/library/cc288060(v=VS.85).aspx

          function XDRObject(method, url, payload) {
            debug(method, url);
            var self = this;
            EventEmitter.call(this);
            setTimeout(function () {
              self._start(method, url, payload);
            }, 0);
          }
          inherits(XDRObject, EventEmitter);
          XDRObject.prototype._start = function (method, url, payload) {
            debug('_start');
            var self = this;
            var xdr = new global.XDomainRequest();
            // IE caches even POSTs
            url = urlUtils.addQuery(url, 't=' + +new Date());
            xdr.onerror = function () {
              debug('onerror');
              self._error();
            };
            xdr.ontimeout = function () {
              debug('ontimeout');
              self._error();
            };
            xdr.onprogress = function () {
              debug('progress', xdr.responseText);
              self.emit('chunk', 200, xdr.responseText);
            };
            xdr.onload = function () {
              debug('load');
              self.emit('finish', 200, xdr.responseText);
              self._cleanup(false);
            };
            this.xdr = xdr;
            this.unloadRef = eventUtils.unloadAdd(function () {
              self._cleanup(true);
            });
            try {
              // Fails with AccessDenied if port number is bogus
              this.xdr.open(method, url);
              if (this.timeout) {
                this.xdr.timeout = this.timeout;
              }
              this.xdr.send(payload);
            } catch (x) {
              this._error();
            }
          };
          XDRObject.prototype._error = function () {
            this.emit('finish', 0, '');
            this._cleanup(false);
          };
          XDRObject.prototype._cleanup = function (abort) {
            debug('cleanup', abort);
            if (!this.xdr) {
              return;
            }
            this.removeAllListeners();
            eventUtils.unloadDel(this.unloadRef);
            this.xdr.ontimeout = this.xdr.onerror = this.xdr.onprogress = this.xdr.onload = null;
            if (abort) {
              try {
                this.xdr.abort();
              } catch (x) {
                // intentionally empty
              }
            }
            this.unloadRef = this.xdr = null;
          };
          XDRObject.prototype.close = function () {
            debug('close');
            this._cleanup(true);
          };

          // IE 8/9 if the request target uses the same scheme - #79
          XDRObject.enabled = !!(global.XDomainRequest && browser.hasDomain());
          module.exports = XDRObject;
        }).call(this);
      }).call(this, {
        env: {}
      }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "../../utils/browser": 44,
      "../../utils/event": 46,
      "../../utils/url": 52,
      "debug": 55,
      "events": 3,
      "inherits": 57
    }],
    35: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
        XhrDriver = require('../driver/xhr');
      function XHRCorsObject(method, url, payload, opts) {
        XhrDriver.call(this, method, url, payload, opts);
      }
      inherits(XHRCorsObject, XhrDriver);
      XHRCorsObject.enabled = XhrDriver.enabled && XhrDriver.supportsCORS;
      module.exports = XHRCorsObject;
    }, {
      "../driver/xhr": 17,
      "inherits": 57
    }],
    36: [function (require, module, exports) {
      'use strict';

      var EventEmitter = require('events').EventEmitter,
        inherits = require('inherits');
      function XHRFake(/* method, url, payload, opts */
      ) {
        var self = this;
        EventEmitter.call(this);
        this.to = setTimeout(function () {
          self.emit('finish', 200, '{}');
        }, XHRFake.timeout);
      }
      inherits(XHRFake, EventEmitter);
      XHRFake.prototype.close = function () {
        clearTimeout(this.to);
      };
      XHRFake.timeout = 2000;
      module.exports = XHRFake;
    }, {
      "events": 3,
      "inherits": 57
    }],
    37: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
        XhrDriver = require('../driver/xhr');
      function XHRLocalObject(method, url, payload /*, opts */) {
        XhrDriver.call(this, method, url, payload, {
          noCredentials: true
        });
      }
      inherits(XHRLocalObject, XhrDriver);
      XHRLocalObject.enabled = XhrDriver.enabled;
      module.exports = XHRLocalObject;
    }, {
      "../driver/xhr": 17,
      "inherits": 57
    }],
    38: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          var utils = require('../utils/event'),
            urlUtils = require('../utils/url'),
            inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter,
            WebsocketDriver = require('./driver/websocket');
          var debug = function () {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:websocket');
          }
          function WebSocketTransport(transUrl, ignore, options) {
            if (!WebSocketTransport.enabled()) {
              throw new Error('Transport created when disabled');
            }
            EventEmitter.call(this);
            debug('constructor', transUrl);
            var self = this;
            var url = urlUtils.addPath(transUrl, '/websocket');
            if (url.slice(0, 5) === 'https') {
              url = 'wss' + url.slice(5);
            } else {
              url = 'ws' + url.slice(4);
            }
            this.url = url;
            this.ws = new WebsocketDriver(this.url, [], options);
            this.ws.onmessage = function (e) {
              debug('message event', e.data);
              self.emit('message', e.data);
            };
            // Firefox has an interesting bug. If a websocket connection is
            // created after onunload, it stays alive even when user
            // navigates away from the page. In such situation let's lie -
            // let's not open the ws connection at all. See:
            // https://github.com/sockjs/sockjs-client/issues/28
            // https://bugzilla.mozilla.org/show_bug.cgi?id=696085
            this.unloadRef = utils.unloadAdd(function () {
              debug('unload');
              self.ws.close();
            });
            this.ws.onclose = function (e) {
              debug('close event', e.code, e.reason);
              self.emit('close', e.code, e.reason);
              self._cleanup();
            };
            this.ws.onerror = function (e) {
              debug('error event', e);
              self.emit('close', 1006, 'WebSocket connection broken');
              self._cleanup();
            };
          }
          inherits(WebSocketTransport, EventEmitter);
          WebSocketTransport.prototype.send = function (data) {
            var msg = '[' + data + ']';
            debug('send', msg);
            this.ws.send(msg);
          };
          WebSocketTransport.prototype.close = function () {
            debug('close');
            var ws = this.ws;
            this._cleanup();
            if (ws) {
              ws.close();
            }
          };
          WebSocketTransport.prototype._cleanup = function () {
            debug('_cleanup');
            var ws = this.ws;
            if (ws) {
              ws.onmessage = ws.onclose = ws.onerror = null;
            }
            utils.unloadDel(this.unloadRef);
            this.unloadRef = this.ws = null;
            this.removeAllListeners();
          };
          WebSocketTransport.enabled = function () {
            debug('enabled');
            return !!WebsocketDriver;
          };
          WebSocketTransport.transportName = 'websocket';

          // In theory, ws should require 1 round trip. But in chrome, this is
          // not very stable over SSL. Most likely a ws connection requires a
          // separate SSL connection, in which case 2 round trips are an
          // absolute minumum.
          WebSocketTransport.roundTrips = 2;
          module.exports = WebSocketTransport;
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "../utils/event": 46,
      "../utils/url": 52,
      "./driver/websocket": 19,
      "debug": 55,
      "events": 3,
      "inherits": 57
    }],
    39: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
        AjaxBasedTransport = require('./lib/ajax-based'),
        XdrStreamingTransport = require('./xdr-streaming'),
        XhrReceiver = require('./receiver/xhr'),
        XDRObject = require('./sender/xdr');
      function XdrPollingTransport(transUrl) {
        if (!XDRObject.enabled) {
          throw new Error('Transport created when disabled');
        }
        AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XDRObject);
      }
      inherits(XdrPollingTransport, AjaxBasedTransport);
      XdrPollingTransport.enabled = XdrStreamingTransport.enabled;
      XdrPollingTransport.transportName = 'xdr-polling';
      XdrPollingTransport.roundTrips = 2; // preflight, ajax

      module.exports = XdrPollingTransport;
    }, {
      "./lib/ajax-based": 24,
      "./receiver/xhr": 32,
      "./sender/xdr": 34,
      "./xdr-streaming": 40,
      "inherits": 57
    }],
    40: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
        AjaxBasedTransport = require('./lib/ajax-based'),
        XhrReceiver = require('./receiver/xhr'),
        XDRObject = require('./sender/xdr');

      // According to:
      //   http://stackoverflow.com/questions/1641507/detect-browser-support-for-cross-domain-xmlhttprequests
      //   http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/

      function XdrStreamingTransport(transUrl) {
        if (!XDRObject.enabled) {
          throw new Error('Transport created when disabled');
        }
        AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XDRObject);
      }
      inherits(XdrStreamingTransport, AjaxBasedTransport);
      XdrStreamingTransport.enabled = function (info) {
        if (info.cookie_needed || info.nullOrigin) {
          return false;
        }
        return XDRObject.enabled && info.sameScheme;
      };
      XdrStreamingTransport.transportName = 'xdr-streaming';
      XdrStreamingTransport.roundTrips = 2; // preflight, ajax

      module.exports = XdrStreamingTransport;
    }, {
      "./lib/ajax-based": 24,
      "./receiver/xhr": 32,
      "./sender/xdr": 34,
      "inherits": 57
    }],
    41: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
        AjaxBasedTransport = require('./lib/ajax-based'),
        XhrReceiver = require('./receiver/xhr'),
        XHRCorsObject = require('./sender/xhr-cors'),
        XHRLocalObject = require('./sender/xhr-local');
      function XhrPollingTransport(transUrl) {
        if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {
          throw new Error('Transport created when disabled');
        }
        AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XHRCorsObject);
      }
      inherits(XhrPollingTransport, AjaxBasedTransport);
      XhrPollingTransport.enabled = function (info) {
        if (info.nullOrigin) {
          return false;
        }
        if (XHRLocalObject.enabled && info.sameOrigin) {
          return true;
        }
        return XHRCorsObject.enabled;
      };
      XhrPollingTransport.transportName = 'xhr-polling';
      XhrPollingTransport.roundTrips = 2; // preflight, ajax

      module.exports = XhrPollingTransport;
    }, {
      "./lib/ajax-based": 24,
      "./receiver/xhr": 32,
      "./sender/xhr-cors": 35,
      "./sender/xhr-local": 37,
      "inherits": 57
    }],
    42: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict';

          var inherits = require('inherits'),
            AjaxBasedTransport = require('./lib/ajax-based'),
            XhrReceiver = require('./receiver/xhr'),
            XHRCorsObject = require('./sender/xhr-cors'),
            XHRLocalObject = require('./sender/xhr-local'),
            browser = require('../utils/browser');
          function XhrStreamingTransport(transUrl) {
            if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {
              throw new Error('Transport created when disabled');
            }
            AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XHRCorsObject);
          }
          inherits(XhrStreamingTransport, AjaxBasedTransport);
          XhrStreamingTransport.enabled = function (info) {
            if (info.nullOrigin) {
              return false;
            }
            // Opera doesn't support xhr-streaming #60
            // But it might be able to #92
            if (browser.isOpera()) {
              return false;
            }
            return XHRCorsObject.enabled;
          };
          XhrStreamingTransport.transportName = 'xhr-streaming';
          XhrStreamingTransport.roundTrips = 2; // preflight, ajax

          // Safari gets confused when a streaming ajax request is started
          // before onload. This causes the load indicator to spin indefinetely.
          // Only require body when used in a browser
          XhrStreamingTransport.needBody = !!global.document;
          module.exports = XhrStreamingTransport;
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "../utils/browser": 44,
      "./lib/ajax-based": 24,
      "./receiver/xhr": 32,
      "./sender/xhr-cors": 35,
      "./sender/xhr-local": 37,
      "inherits": 57
    }],
    43: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict';

          if (global.crypto && global.crypto.getRandomValues) {
            module.exports.randomBytes = function (length) {
              var bytes = new Uint8Array(length);
              global.crypto.getRandomValues(bytes);
              return bytes;
            };
          } else {
            module.exports.randomBytes = function (length) {
              var bytes = new Array(length);
              for (var i = 0; i < length; i++) {
                bytes[i] = Math.floor(Math.random() * 256);
              }
              return bytes;
            };
          }
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}],
    44: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict';

          module.exports = {
            isOpera: function () {
              return global.navigator && /opera/i.test(global.navigator.userAgent);
            },
            isKonqueror: function () {
              return global.navigator && /konqueror/i.test(global.navigator.userAgent);
            }

            // #187 wrap document.domain in try/catch because of WP8 from file:///
            ,
            hasDomain: function () {
              // non-browser client always has a domain
              if (!global.document) {
                return true;
              }
              try {
                return !!global.document.domain;
              } catch (e) {
                return false;
              }
            }
          };
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}],
    45: [function (require, module, exports) {
      'use strict';

      // Some extra characters that Chrome gets wrong, and substitutes with
      // something else on the wire.
      // eslint-disable-next-line no-control-regex, no-misleading-character-class
      var extraEscapable = /[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g,
        extraLookup;

      // This may be quite slow, so let's delay until user actually uses bad
      // characters.
      var unrollLookup = function (escapable) {
        var i;
        var unrolled = {};
        var c = [];
        for (i = 0; i < 65536; i++) {
          c.push(String.fromCharCode(i));
        }
        escapable.lastIndex = 0;
        c.join('').replace(escapable, function (a) {
          unrolled[a] = '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
          return '';
        });
        escapable.lastIndex = 0;
        return unrolled;
      };

      // Quote string, also taking care of unicode characters that browsers
      // often break. Especially, take care of unicode surrogates:
      // http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters#Surrogates
      module.exports = {
        quote: function (string) {
          var quoted = JSON.stringify(string);

          // In most cases this should be very fast and good enough.
          extraEscapable.lastIndex = 0;
          if (!extraEscapable.test(quoted)) {
            return quoted;
          }
          if (!extraLookup) {
            extraLookup = unrollLookup(extraEscapable);
          }
          return quoted.replace(extraEscapable, function (a) {
            return extraLookup[a];
          });
        }
      };
    }, {}],
    46: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict';

          var random = require('./random');
          var onUnload = {},
            afterUnload = false
            // detect google chrome packaged apps because they don't allow the 'unload' event
            ,
            isChromePackagedApp = global.chrome && global.chrome.app && global.chrome.app.runtime;
          module.exports = {
            attachEvent: function (event, listener) {
              if (typeof global.addEventListener !== 'undefined') {
                global.addEventListener(event, listener, false);
              } else if (global.document && global.attachEvent) {
                // IE quirks.
                // According to: http://stevesouders.com/misc/test-postmessage.php
                // the message gets delivered only to 'document', not 'window'.
                global.document.attachEvent('on' + event, listener);
                // I get 'window' for ie8.
                global.attachEvent('on' + event, listener);
              }
            },
            detachEvent: function (event, listener) {
              if (typeof global.addEventListener !== 'undefined') {
                global.removeEventListener(event, listener, false);
              } else if (global.document && global.detachEvent) {
                global.document.detachEvent('on' + event, listener);
                global.detachEvent('on' + event, listener);
              }
            },
            unloadAdd: function (listener) {
              if (isChromePackagedApp) {
                return null;
              }
              var ref = random.string(8);
              onUnload[ref] = listener;
              if (afterUnload) {
                setTimeout(this.triggerUnloadCallbacks, 0);
              }
              return ref;
            },
            unloadDel: function (ref) {
              if (ref in onUnload) {
                delete onUnload[ref];
              }
            },
            triggerUnloadCallbacks: function () {
              for (var ref in onUnload) {
                onUnload[ref]();
                delete onUnload[ref];
              }
            }
          };
          var unloadTriggered = function () {
            if (afterUnload) {
              return;
            }
            afterUnload = true;
            module.exports.triggerUnloadCallbacks();
          };

          // 'unload' alone is not reliable in opera within an iframe, but we
          // can't use `beforeunload` as IE fires it on javascript: links.
          if (!isChromePackagedApp) {
            module.exports.attachEvent('unload', unloadTriggered);
          }
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "./random": 50
    }],
    47: [function (require, module, exports) {
      (function (process, global) {
        (function () {
          'use strict';

          var eventUtils = require('./event'),
            browser = require('./browser');
          var debug = function () {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:utils:iframe');
          }
          module.exports = {
            WPrefix: '_jp',
            currentWindowId: null,
            polluteGlobalNamespace: function () {
              if (!(module.exports.WPrefix in global)) {
                global[module.exports.WPrefix] = {};
              }
            },
            postMessage: function (type, data) {
              if (global.parent !== global) {
                global.parent.postMessage(JSON.stringify({
                  windowId: module.exports.currentWindowId,
                  type: type,
                  data: data || ''
                }), '*');
              } else {
                debug('Cannot postMessage, no parent window.', type, data);
              }
            },
            createIframe: function (iframeUrl, errorCallback) {
              var iframe = global.document.createElement('iframe');
              var tref, unloadRef;
              var unattach = function () {
                debug('unattach');
                clearTimeout(tref);
                // Explorer had problems with that.
                try {
                  iframe.onload = null;
                } catch (x) {
                  // intentionally empty
                }
                iframe.onerror = null;
              };
              var cleanup = function () {
                debug('cleanup');
                if (iframe) {
                  unattach();
                  // This timeout makes chrome fire onbeforeunload event
                  // within iframe. Without the timeout it goes straight to
                  // onunload.
                  setTimeout(function () {
                    if (iframe) {
                      iframe.parentNode.removeChild(iframe);
                    }
                    iframe = null;
                  }, 0);
                  eventUtils.unloadDel(unloadRef);
                }
              };
              var onerror = function (err) {
                debug('onerror', err);
                if (iframe) {
                  cleanup();
                  errorCallback(err);
                }
              };
              var post = function (msg, origin) {
                debug('post', msg, origin);
                setTimeout(function () {
                  try {
                    // When the iframe is not loaded, IE raises an exception
                    // on 'contentWindow'.
                    if (iframe && iframe.contentWindow) {
                      iframe.contentWindow.postMessage(msg, origin);
                    }
                  } catch (x) {
                    // intentionally empty
                  }
                }, 0);
              };
              iframe.src = iframeUrl;
              iframe.style.display = 'none';
              iframe.style.position = 'absolute';
              iframe.onerror = function () {
                onerror('onerror');
              };
              iframe.onload = function () {
                debug('onload');
                // `onload` is triggered before scripts on the iframe are
                // executed. Give it few seconds to actually load stuff.
                clearTimeout(tref);
                tref = setTimeout(function () {
                  onerror('onload timeout');
                }, 2000);
              };
              global.document.body.appendChild(iframe);
              tref = setTimeout(function () {
                onerror('timeout');
              }, 15000);
              unloadRef = eventUtils.unloadAdd(cleanup);
              return {
                post: post,
                cleanup: cleanup,
                loaded: unattach
              };
            }

            /* eslint no-undef: "off", new-cap: "off" */,
            createHtmlfile: function (iframeUrl, errorCallback) {
              var axo = ['Active'].concat('Object').join('X');
              var doc = new global[axo]('htmlfile');
              var tref, unloadRef;
              var iframe;
              var unattach = function () {
                clearTimeout(tref);
                iframe.onerror = null;
              };
              var cleanup = function () {
                if (doc) {
                  unattach();
                  eventUtils.unloadDel(unloadRef);
                  iframe.parentNode.removeChild(iframe);
                  iframe = doc = null;
                  CollectGarbage();
                }
              };
              var onerror = function (r) {
                debug('onerror', r);
                if (doc) {
                  cleanup();
                  errorCallback(r);
                }
              };
              var post = function (msg, origin) {
                try {
                  // When the iframe is not loaded, IE raises an exception
                  // on 'contentWindow'.
                  setTimeout(function () {
                    if (iframe && iframe.contentWindow) {
                      iframe.contentWindow.postMessage(msg, origin);
                    }
                  }, 0);
                } catch (x) {
                  // intentionally empty
                }
              };
              doc.open();
              doc.write('<html><s' + 'cript>' + 'document.domain="' + global.document.domain + '";' + '</s' + 'cript></html>');
              doc.close();
              doc.parentWindow[module.exports.WPrefix] = global[module.exports.WPrefix];
              var c = doc.createElement('div');
              doc.body.appendChild(c);
              iframe = doc.createElement('iframe');
              c.appendChild(iframe);
              iframe.src = iframeUrl;
              iframe.onerror = function () {
                onerror('onerror');
              };
              tref = setTimeout(function () {
                onerror('timeout');
              }, 15000);
              unloadRef = eventUtils.unloadAdd(cleanup);
              return {
                post: post,
                cleanup: cleanup,
                loaded: unattach
              };
            }
          };
          module.exports.iframeEnabled = false;
          if (global.document) {
            // postMessage misbehaves in konqueror 4.6.5 - the messages are delivered with
            // huge delay, or not at all.
            module.exports.iframeEnabled = (typeof global.postMessage === 'function' || typeof global.postMessage === 'object') && !browser.isKonqueror();
          }
        }).call(this);
      }).call(this, {
        env: {}
      }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "./browser": 44,
      "./event": 46,
      "debug": 55
    }],
    48: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict';

          var logObject = {};
          ['log', 'debug', 'warn'].forEach(function (level) {
            var levelExists;
            try {
              levelExists = global.console && global.console[level] && global.console[level].apply;
            } catch (e) {
              // do nothing
            }
            logObject[level] = levelExists ? function () {
              return global.console[level].apply(global.console, arguments);
            } : level === 'log' ? function () {} : logObject.log;
          });
          module.exports = logObject;
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}],
    49: [function (require, module, exports) {
      'use strict';

      module.exports = {
        isObject: function (obj) {
          var type = typeof obj;
          return type === 'function' || type === 'object' && !!obj;
        },
        extend: function (obj) {
          if (!this.isObject(obj)) {
            return obj;
          }
          var source, prop;
          for (var i = 1, length = arguments.length; i < length; i++) {
            source = arguments[i];
            for (prop in source) {
              if (Object.prototype.hasOwnProperty.call(source, prop)) {
                obj[prop] = source[prop];
              }
            }
          }
          return obj;
        }
      };
    }, {}],
    50: [function (require, module, exports) {
      'use strict';

      var crypto = require('crypto');

      // This string has length 32, a power of 2, so the modulus doesn't introduce a
      // bias.
      var _randomStringChars = 'abcdefghijklmnopqrstuvwxyz012345';
      module.exports = {
        string: function (length) {
          var max = _randomStringChars.length;
          var bytes = crypto.randomBytes(length);
          var ret = [];
          for (var i = 0; i < length; i++) {
            ret.push(_randomStringChars.substr(bytes[i] % max, 1));
          }
          return ret.join('');
        },
        number: function (max) {
          return Math.floor(Math.random() * max);
        },
        numberString: function (max) {
          var t = ('' + (max - 1)).length;
          var p = new Array(t + 1).join('0');
          return (p + this.number(max)).slice(-t);
        }
      };
    }, {
      "crypto": 43
    }],
    51: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          var debug = function () {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:utils:transport');
          }
          module.exports = function (availableTransports) {
            return {
              filterToEnabled: function (transportsWhitelist, info) {
                var transports = {
                  main: [],
                  facade: []
                };
                if (!transportsWhitelist) {
                  transportsWhitelist = [];
                } else if (typeof transportsWhitelist === 'string') {
                  transportsWhitelist = [transportsWhitelist];
                }
                availableTransports.forEach(function (trans) {
                  if (!trans) {
                    return;
                  }
                  if (trans.transportName === 'websocket' && info.websocket === false) {
                    debug('disabled from server', 'websocket');
                    return;
                  }
                  if (transportsWhitelist.length && transportsWhitelist.indexOf(trans.transportName) === -1) {
                    debug('not in whitelist', trans.transportName);
                    return;
                  }
                  if (trans.enabled(info)) {
                    debug('enabled', trans.transportName);
                    transports.main.push(trans);
                    if (trans.facadeTransport) {
                      transports.facade.push(trans.facadeTransport);
                    }
                  } else {
                    debug('disabled', trans.transportName);
                  }
                });
                return transports;
              }
            };
          };
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "debug": 55
    }],
    52: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          var URL = require('url-parse');
          var debug = function () {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:utils:url');
          }
          module.exports = {
            getOrigin: function (url) {
              if (!url) {
                return null;
              }
              var p = new URL(url);
              if (p.protocol === 'file:') {
                return null;
              }
              var port = p.port;
              if (!port) {
                port = p.protocol === 'https:' ? '443' : '80';
              }
              return p.protocol + '//' + p.hostname + ':' + port;
            },
            isOriginEqual: function (a, b) {
              var res = this.getOrigin(a) === this.getOrigin(b);
              debug('same', a, b, res);
              return res;
            },
            isSchemeEqual: function (a, b) {
              return a.split(':')[0] === b.split(':')[0];
            },
            addPath: function (url, path) {
              var qs = url.split('?');
              return qs[0] + path + (qs[1] ? '?' + qs[1] : '');
            },
            addQuery: function (url, q) {
              return url + (url.indexOf('?') === -1 ? '?' + q : '&' + q);
            },
            isLoopbackAddr: function (addr) {
              return /^127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) || /^\[::1\]$/.test(addr);
            }
          };
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "debug": 55,
      "url-parse": 60
    }],
    53: [function (require, module, exports) {
      module.exports = '1.6.1';
    }, {}],
    54: [function (require, module, exports) {
      /**
       * Helpers.
       */

      var s = 1000;
      var m = s * 60;
      var h = m * 60;
      var d = h * 24;
      var w = d * 7;
      var y = d * 365.25;

      /**
       * Parse or format the given `val`.
       *
       * Options:
       *
       *  - `long` verbose formatting [false]
       *
       * @param {String|Number} val
       * @param {Object} [options]
       * @throws {Error} throw an error if val is not a non-empty string or a number
       * @return {String|Number}
       * @api public
       */

      module.exports = function (val, options) {
        options = options || {};
        var type = typeof val;
        if (type === 'string' && val.length > 0) {
          return parse(val);
        } else if (type === 'number' && isFinite(val)) {
          return options.long ? fmtLong(val) : fmtShort(val);
        }
        throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
      };

      /**
       * Parse the given `str` and return milliseconds.
       *
       * @param {String} str
       * @return {Number}
       * @api private
       */

      function parse(str) {
        str = String(str);
        if (str.length > 100) {
          return;
        }
        var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
        if (!match) {
          return;
        }
        var n = parseFloat(match[1]);
        var type = (match[2] || 'ms').toLowerCase();
        switch (type) {
          case 'years':
          case 'year':
          case 'yrs':
          case 'yr':
          case 'y':
            return n * y;
          case 'weeks':
          case 'week':
          case 'w':
            return n * w;
          case 'days':
          case 'day':
          case 'd':
            return n * d;
          case 'hours':
          case 'hour':
          case 'hrs':
          case 'hr':
          case 'h':
            return n * h;
          case 'minutes':
          case 'minute':
          case 'mins':
          case 'min':
          case 'm':
            return n * m;
          case 'seconds':
          case 'second':
          case 'secs':
          case 'sec':
          case 's':
            return n * s;
          case 'milliseconds':
          case 'millisecond':
          case 'msecs':
          case 'msec':
          case 'ms':
            return n;
          default:
            return undefined;
        }
      }

      /**
       * Short format for `ms`.
       *
       * @param {Number} ms
       * @return {String}
       * @api private
       */

      function fmtShort(ms) {
        var msAbs = Math.abs(ms);
        if (msAbs >= d) {
          return Math.round(ms / d) + 'd';
        }
        if (msAbs >= h) {
          return Math.round(ms / h) + 'h';
        }
        if (msAbs >= m) {
          return Math.round(ms / m) + 'm';
        }
        if (msAbs >= s) {
          return Math.round(ms / s) + 's';
        }
        return ms + 'ms';
      }

      /**
       * Long format for `ms`.
       *
       * @param {Number} ms
       * @return {String}
       * @api private
       */

      function fmtLong(ms) {
        var msAbs = Math.abs(ms);
        if (msAbs >= d) {
          return plural(ms, msAbs, d, 'day');
        }
        if (msAbs >= h) {
          return plural(ms, msAbs, h, 'hour');
        }
        if (msAbs >= m) {
          return plural(ms, msAbs, m, 'minute');
        }
        if (msAbs >= s) {
          return plural(ms, msAbs, s, 'second');
        }
        return ms + ' ms';
      }

      /**
       * Pluralization helper.
       */

      function plural(ms, msAbs, n, name) {
        var isPlural = msAbs >= n * 1.5;
        return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
      }
    }, {}],
    55: [function (require, module, exports) {
      (function (process) {
        (function () {
          /* eslint-env browser */

          /**
           * This is the web browser implementation of `debug()`.
           */

          exports.formatArgs = formatArgs;
          exports.save = save;
          exports.load = load;
          exports.useColors = useColors;
          exports.storage = localstorage();
          exports.destroy = (() => {
            let warned = false;
            return () => {
              if (!warned) {
                warned = true;
                console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
              }
            };
          })();

          /**
           * Colors.
           */

          exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];

          /**
           * Currently only WebKit-based Web Inspectors, Firefox >= v31,
           * and the Firebug extension (any Firefox version) are known
           * to support "%c" CSS customizations.
           *
           * TODO: add a `localStorage` variable to explicitly enable/disable colors
           */

          // eslint-disable-next-line complexity
          function useColors() {
            // NB: In an Electron preload script, document will be defined but not fully
            // initialized. Since we know we're in Chrome, we'll just detect this case
            // explicitly
            if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
              return true;
            }

            // Internet Explorer and Edge do not support colors.
            if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
              return false;
            }

            // Is webkit? http://stackoverflow.com/a/16459606/376773
            // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
            return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance ||
            // Is firebug? http://stackoverflow.com/a/398120/376773
            typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) ||
            // Is firefox >= v31?
            // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
            typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 ||
            // Double check webkit in userAgent just in case we are in a worker
            typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
          }

          /**
           * Colorize log arguments if enabled.
           *
           * @api public
           */

          function formatArgs(args) {
            args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);
            if (!this.useColors) {
              return;
            }
            const c = 'color: ' + this.color;
            args.splice(1, 0, c, 'color: inherit');

            // The final "%c" is somewhat tricky, because there could be other
            // arguments passed either before or after the %c, so we need to
            // figure out the correct index to insert the CSS into
            let index = 0;
            let lastC = 0;
            args[0].replace(/%[a-zA-Z%]/g, match => {
              if (match === '%%') {
                return;
              }
              index++;
              if (match === '%c') {
                // We only are interested in the *last* %c
                // (the user may have provided their own)
                lastC = index;
              }
            });
            args.splice(lastC, 0, c);
          }

          /**
           * Invokes `console.debug()` when available.
           * No-op when `console.debug` is not a "function".
           * If `console.debug` is not available, falls back
           * to `console.log`.
           *
           * @api public
           */
          exports.log = console.debug || console.log || (() => {});

          /**
           * Save `namespaces`.
           *
           * @param {String} namespaces
           * @api private
           */
          function save(namespaces) {
            try {
              if (namespaces) {
                exports.storage.setItem('debug', namespaces);
              } else {
                exports.storage.removeItem('debug');
              }
            } catch (error) {
              // Swallow
              // XXX (@Qix-) should we be logging these?
            }
          }

          /**
           * Load `namespaces`.
           *
           * @return {String} returns the previously persisted debug modes
           * @api private
           */
          function load() {
            let r;
            try {
              r = exports.storage.getItem('debug');
            } catch (error) {
              // Swallow
              // XXX (@Qix-) should we be logging these?
            }

            // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
            if (!r && typeof process !== 'undefined' && 'env' in process) {
              r = process.env.DEBUG;
            }
            return r;
          }

          /**
           * Localstorage attempts to return the localstorage.
           *
           * This is necessary because safari throws
           * when a user disables cookies/localstorage
           * and you attempt to access it.
           *
           * @return {LocalStorage}
           * @api private
           */

          function localstorage() {
            try {
              // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
              // The Browser also has localStorage in the global context.
              return localStorage;
            } catch (error) {
              // Swallow
              // XXX (@Qix-) should we be logging these?
            }
          }
          module.exports = require('./common')(exports);
          const {
            formatters
          } = module.exports;

          /**
           * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
           */

          formatters.j = function (v) {
            try {
              return JSON.stringify(v);
            } catch (error) {
              return '[UnexpectedJSONParseError]: ' + error.message;
            }
          };
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "./common": 56
    }],
    56: [function (require, module, exports) {
      /**
       * This is the common logic for both the Node.js and web browser
       * implementations of `debug()`.
       */

      function setup(env) {
        createDebug.debug = createDebug;
        createDebug.default = createDebug;
        createDebug.coerce = coerce;
        createDebug.disable = disable;
        createDebug.enable = enable;
        createDebug.enabled = enabled;
        createDebug.humanize = require('ms');
        createDebug.destroy = destroy;
        Object.keys(env).forEach(key => {
          createDebug[key] = env[key];
        });

        /**
        * The currently active debug mode names, and names to skip.
        */

        createDebug.names = [];
        createDebug.skips = [];

        /**
        * Map of special "%n" handling functions, for the debug "format" argument.
        *
        * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
        */
        createDebug.formatters = {};

        /**
        * Selects a color for a debug namespace
        * @param {String} namespace The namespace string for the debug instance to be colored
        * @return {Number|String} An ANSI color code for the given namespace
        * @api private
        */
        function selectColor(namespace) {
          let hash = 0;
          for (let i = 0; i < namespace.length; i++) {
            hash = (hash << 5) - hash + namespace.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
          }
          return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
        }
        createDebug.selectColor = selectColor;

        /**
        * Create a debugger with the given `namespace`.
        *
        * @param {String} namespace
        * @return {Function}
        * @api public
        */
        function createDebug(namespace) {
          let prevTime;
          let enableOverride = null;
          let namespacesCache;
          let enabledCache;
          function debug(...args) {
            // Disabled?
            if (!debug.enabled) {
              return;
            }
            const self = debug;

            // Set `diff` timestamp
            const curr = Number(new Date());
            const ms = curr - (prevTime || curr);
            self.diff = ms;
            self.prev = prevTime;
            self.curr = curr;
            prevTime = curr;
            args[0] = createDebug.coerce(args[0]);
            if (typeof args[0] !== 'string') {
              // Anything else let's inspect with %O
              args.unshift('%O');
            }

            // Apply any `formatters` transformations
            let index = 0;
            args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
              // If we encounter an escaped % then don't increase the array index
              if (match === '%%') {
                return '%';
              }
              index++;
              const formatter = createDebug.formatters[format];
              if (typeof formatter === 'function') {
                const val = args[index];
                match = formatter.call(self, val);

                // Now we need to remove `args[index]` since it's inlined in the `format`
                args.splice(index, 1);
                index--;
              }
              return match;
            });

            // Apply env-specific formatting (colors, etc.)
            createDebug.formatArgs.call(self, args);
            const logFn = self.log || createDebug.log;
            logFn.apply(self, args);
          }
          debug.namespace = namespace;
          debug.useColors = createDebug.useColors();
          debug.color = createDebug.selectColor(namespace);
          debug.extend = extend;
          debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

          Object.defineProperty(debug, 'enabled', {
            enumerable: true,
            configurable: false,
            get: () => {
              if (enableOverride !== null) {
                return enableOverride;
              }
              if (namespacesCache !== createDebug.namespaces) {
                namespacesCache = createDebug.namespaces;
                enabledCache = createDebug.enabled(namespace);
              }
              return enabledCache;
            },
            set: v => {
              enableOverride = v;
            }
          });

          // Env-specific initialization logic for debug instances
          if (typeof createDebug.init === 'function') {
            createDebug.init(debug);
          }
          return debug;
        }
        function extend(namespace, delimiter) {
          const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
          newDebug.log = this.log;
          return newDebug;
        }

        /**
        * Enables a debug mode by namespaces. This can include modes
        * separated by a colon and wildcards.
        *
        * @param {String} namespaces
        * @api public
        */
        function enable(namespaces) {
          createDebug.save(namespaces);
          createDebug.namespaces = namespaces;
          createDebug.names = [];
          createDebug.skips = [];
          let i;
          const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
          const len = split.length;
          for (i = 0; i < len; i++) {
            if (!split[i]) {
              // ignore empty strings
              continue;
            }
            namespaces = split[i].replace(/\*/g, '.*?');
            if (namespaces[0] === '-') {
              createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
            } else {
              createDebug.names.push(new RegExp('^' + namespaces + '$'));
            }
          }
        }

        /**
        * Disable debug output.
        *
        * @return {String} namespaces
        * @api public
        */
        function disable() {
          const namespaces = [...createDebug.names.map(toNamespace), ...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)].join(',');
          createDebug.enable('');
          return namespaces;
        }

        /**
        * Returns true if the given mode name is enabled, false otherwise.
        *
        * @param {String} name
        * @return {Boolean}
        * @api public
        */
        function enabled(name) {
          if (name[name.length - 1] === '*') {
            return true;
          }
          let i;
          let len;
          for (i = 0, len = createDebug.skips.length; i < len; i++) {
            if (createDebug.skips[i].test(name)) {
              return false;
            }
          }
          for (i = 0, len = createDebug.names.length; i < len; i++) {
            if (createDebug.names[i].test(name)) {
              return true;
            }
          }
          return false;
        }

        /**
        * Convert regexp to namespace
        *
        * @param {RegExp} regxep
        * @return {String} namespace
        * @api private
        */
        function toNamespace(regexp) {
          return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, '*');
        }

        /**
        * Coerce `val`.
        *
        * @param {Mixed} val
        * @return {Mixed}
        * @api private
        */
        function coerce(val) {
          if (val instanceof Error) {
            return val.stack || val.message;
          }
          return val;
        }

        /**
        * XXX DO NOT USE. This is a temporary stub function.
        * XXX It WILL be removed in the next major release.
        */
        function destroy() {
          console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
        }
        createDebug.enable(createDebug.load());
        return createDebug;
      }
      module.exports = setup;
    }, {
      "ms": 54
    }],
    57: [function (require, module, exports) {
      if (typeof Object.create === 'function') {
        // implementation from standard node.js 'util' module
        module.exports = function inherits(ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor;
            ctor.prototype = Object.create(superCtor.prototype, {
              constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
              }
            });
          }
        };
      } else {
        // old school shim for old browsers
        module.exports = function inherits(ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor;
            var TempCtor = function () {};
            TempCtor.prototype = superCtor.prototype;
            ctor.prototype = new TempCtor();
            ctor.prototype.constructor = ctor;
          }
        };
      }
    }, {}],
    58: [function (require, module, exports) {
      'use strict';

      var has = Object.prototype.hasOwnProperty,
        undef;

      /**
       * Decode a URI encoded string.
       *
       * @param {String} input The URI encoded string.
       * @returns {String|Null} The decoded string.
       * @api private
       */
      function decode(input) {
        try {
          return decodeURIComponent(input.replace(/\+/g, ' '));
        } catch (e) {
          return null;
        }
      }

      /**
       * Attempts to encode a given input.
       *
       * @param {String} input The string that needs to be encoded.
       * @returns {String|Null} The encoded string.
       * @api private
       */
      function encode(input) {
        try {
          return encodeURIComponent(input);
        } catch (e) {
          return null;
        }
      }

      /**
       * Simple query string parser.
       *
       * @param {String} query The query string that needs to be parsed.
       * @returns {Object}
       * @api public
       */
      function querystring(query) {
        var parser = /([^=?&]+)=?([^&]*)/g,
          result = {},
          part;
        while (part = parser.exec(query)) {
          var key = decode(part[1]),
            value = decode(part[2]);

          //
          // Prevent overriding of existing properties. This ensures that build-in
          // methods like `toString` or __proto__ are not overriden by malicious
          // querystrings.
          //
          // In the case if failed decoding, we want to omit the key/value pairs
          // from the result.
          //
          if (key === null || value === null || key in result) continue;
          result[key] = value;
        }
        return result;
      }

      /**
       * Transform a query string to an object.
       *
       * @param {Object} obj Object that should be transformed.
       * @param {String} prefix Optional prefix.
       * @returns {String}
       * @api public
       */
      function querystringify(obj, prefix) {
        prefix = prefix || '';
        var pairs = [],
          value,
          key;

        //
        // Optionally prefix with a '?' if needed
        //
        if ('string' !== typeof prefix) prefix = '?';
        for (key in obj) {
          if (has.call(obj, key)) {
            value = obj[key];

            //
            // Edge cases where we actually want to encode the value to an empty
            // string instead of the stringified value.
            //
            if (!value && (value === null || value === undef || isNaN(value))) {
              value = '';
            }
            key = encodeURIComponent(key);
            value = encodeURIComponent(value);

            //
            // If we failed to encode the strings, we should bail out as we don't
            // want to add invalid strings to the query.
            //
            if (key === null || value === null) continue;
            pairs.push(key + '=' + value);
          }
        }
        return pairs.length ? prefix + pairs.join('&') : '';
      }

      //
      // Expose the module.
      //
      exports.stringify = querystringify;
      exports.parse = querystring;
    }, {}],
    59: [function (require, module, exports) {
      'use strict';

      /**
       * Check if we're required to add a port number.
       *
       * @see https://url.spec.whatwg.org/#default-port
       * @param {Number|String} port Port number we need to check
       * @param {String} protocol Protocol we need to check against.
       * @returns {Boolean} Is it a default port for the given protocol
       * @api private
       */
      module.exports = function required(port, protocol) {
        protocol = protocol.split(':')[0];
        port = +port;
        if (!port) return false;
        switch (protocol) {
          case 'http':
          case 'ws':
            return port !== 80;
          case 'https':
          case 'wss':
            return port !== 443;
          case 'ftp':
            return port !== 21;
          case 'gopher':
            return port !== 70;
          case 'file':
            return false;
        }
        return port !== 0;
      };
    }, {}],
    60: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict';

          var required = require('requires-port'),
            qs = require('querystringify'),
            controlOrWhitespace = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/,
            CRHTLF = /[\n\r\t]/g,
            slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//,
            port = /:\d+$/,
            protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i,
            windowsDriveLetter = /^[a-zA-Z]:/;

          /**
           * Remove control characters and whitespace from the beginning of a string.
           *
           * @param {Object|String} str String to trim.
           * @returns {String} A new string representing `str` stripped of control
           *     characters and whitespace from its beginning.
           * @public
           */
          function trimLeft(str) {
            return (str ? str : '').toString().replace(controlOrWhitespace, '');
          }

          /**
           * These are the parse rules for the URL parser, it informs the parser
           * about:
           *
           * 0. The char it Needs to parse, if it's a string it should be done using
           *    indexOf, RegExp using exec and NaN means set as current value.
           * 1. The property we should set when parsing this value.
           * 2. Indication if it's backwards or forward parsing, when set as number it's
           *    the value of extra chars that should be split off.
           * 3. Inherit from location if non existing in the parser.
           * 4. `toLowerCase` the resulting value.
           */
          var rules = [['#', 'hash'],
          // Extract from the back.
          ['?', 'query'],
          // Extract from the back.
          function sanitize(address, url) {
            // Sanitize what is left of the address
            return isSpecial(url.protocol) ? address.replace(/\\/g, '/') : address;
          }, ['/', 'pathname'],
          // Extract from the back.
          ['@', 'auth', 1],
          // Extract from the front.
          [NaN, 'host', undefined, 1, 1],
          // Set left over value.
          [/:(\d*)$/, 'port', undefined, 1],
          // RegExp the back.
          [NaN, 'hostname', undefined, 1, 1] // Set left over.
          ];

          /**
           * These properties should not be copied or inherited from. This is only needed
           * for all non blob URL's as a blob URL does not include a hash, only the
           * origin.
           *
           * @type {Object}
           * @private
           */
          var ignore = {
            hash: 1,
            query: 1
          };

          /**
           * The location object differs when your code is loaded through a normal page,
           * Worker or through a worker using a blob. And with the blobble begins the
           * trouble as the location object will contain the URL of the blob, not the
           * location of the page where our code is loaded in. The actual origin is
           * encoded in the `pathname` so we can thankfully generate a good "default"
           * location from it so we can generate proper relative URL's again.
           *
           * @param {Object|String} loc Optional default location object.
           * @returns {Object} lolcation object.
           * @public
           */
          function lolcation(loc) {
            var globalVar;
            if (typeof window !== 'undefined') globalVar = window;else if (typeof global !== 'undefined') globalVar = global;else if (typeof self !== 'undefined') globalVar = self;else globalVar = {};
            var location = globalVar.location || {};
            loc = loc || location;
            var finaldestination = {},
              type = typeof loc,
              key;
            if ('blob:' === loc.protocol) {
              finaldestination = new Url(unescape(loc.pathname), {});
            } else if ('string' === type) {
              finaldestination = new Url(loc, {});
              for (key in ignore) delete finaldestination[key];
            } else if ('object' === type) {
              for (key in loc) {
                if (key in ignore) continue;
                finaldestination[key] = loc[key];
              }
              if (finaldestination.slashes === undefined) {
                finaldestination.slashes = slashes.test(loc.href);
              }
            }
            return finaldestination;
          }

          /**
           * Check whether a protocol scheme is special.
           *
           * @param {String} The protocol scheme of the URL
           * @return {Boolean} `true` if the protocol scheme is special, else `false`
           * @private
           */
          function isSpecial(scheme) {
            return scheme === 'file:' || scheme === 'ftp:' || scheme === 'http:' || scheme === 'https:' || scheme === 'ws:' || scheme === 'wss:';
          }

          /**
           * @typedef ProtocolExtract
           * @type Object
           * @property {String} protocol Protocol matched in the URL, in lowercase.
           * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
           * @property {String} rest Rest of the URL that is not part of the protocol.
           */

          /**
           * Extract protocol information from a URL with/without double slash ("//").
           *
           * @param {String} address URL we want to extract from.
           * @param {Object} location
           * @return {ProtocolExtract} Extracted information.
           * @private
           */
          function extractProtocol(address, location) {
            address = trimLeft(address);
            address = address.replace(CRHTLF, '');
            location = location || {};
            var match = protocolre.exec(address);
            var protocol = match[1] ? match[1].toLowerCase() : '';
            var forwardSlashes = !!match[2];
            var otherSlashes = !!match[3];
            var slashesCount = 0;
            var rest;
            if (forwardSlashes) {
              if (otherSlashes) {
                rest = match[2] + match[3] + match[4];
                slashesCount = match[2].length + match[3].length;
              } else {
                rest = match[2] + match[4];
                slashesCount = match[2].length;
              }
            } else {
              if (otherSlashes) {
                rest = match[3] + match[4];
                slashesCount = match[3].length;
              } else {
                rest = match[4];
              }
            }
            if (protocol === 'file:') {
              if (slashesCount >= 2) {
                rest = rest.slice(2);
              }
            } else if (isSpecial(protocol)) {
              rest = match[4];
            } else if (protocol) {
              if (forwardSlashes) {
                rest = rest.slice(2);
              }
            } else if (slashesCount >= 2 && isSpecial(location.protocol)) {
              rest = match[4];
            }
            return {
              protocol: protocol,
              slashes: forwardSlashes || isSpecial(protocol),
              slashesCount: slashesCount,
              rest: rest
            };
          }

          /**
           * Resolve a relative URL pathname against a base URL pathname.
           *
           * @param {String} relative Pathname of the relative URL.
           * @param {String} base Pathname of the base URL.
           * @return {String} Resolved pathname.
           * @private
           */
          function resolve(relative, base) {
            if (relative === '') return base;
            var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/')),
              i = path.length,
              last = path[i - 1],
              unshift = false,
              up = 0;
            while (i--) {
              if (path[i] === '.') {
                path.splice(i, 1);
              } else if (path[i] === '..') {
                path.splice(i, 1);
                up++;
              } else if (up) {
                if (i === 0) unshift = true;
                path.splice(i, 1);
                up--;
              }
            }
            if (unshift) path.unshift('');
            if (last === '.' || last === '..') path.push('');
            return path.join('/');
          }

          /**
           * The actual URL instance. Instead of returning an object we've opted-in to
           * create an actual constructor as it's much more memory efficient and
           * faster and it pleases my OCD.
           *
           * It is worth noting that we should not use `URL` as class name to prevent
           * clashes with the global URL instance that got introduced in browsers.
           *
           * @constructor
           * @param {String} address URL we want to parse.
           * @param {Object|String} [location] Location defaults for relative paths.
           * @param {Boolean|Function} [parser] Parser for the query string.
           * @private
           */
          function Url(address, location, parser) {
            address = trimLeft(address);
            address = address.replace(CRHTLF, '');
            if (!(this instanceof Url)) {
              return new Url(address, location, parser);
            }
            var relative,
              extracted,
              parse,
              instruction,
              index,
              key,
              instructions = rules.slice(),
              type = typeof location,
              url = this,
              i = 0;

            //
            // The following if statements allows this module two have compatibility with
            // 2 different API:
            //
            // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
            //    where the boolean indicates that the query string should also be parsed.
            //
            // 2. The `URL` interface of the browser which accepts a URL, object as
            //    arguments. The supplied object will be used as default values / fall-back
            //    for relative paths.
            //
            if ('object' !== type && 'string' !== type) {
              parser = location;
              location = null;
            }
            if (parser && 'function' !== typeof parser) parser = qs.parse;
            location = lolcation(location);

            //
            // Extract protocol information before running the instructions.
            //
            extracted = extractProtocol(address || '', location);
            relative = !extracted.protocol && !extracted.slashes;
            url.slashes = extracted.slashes || relative && location.slashes;
            url.protocol = extracted.protocol || location.protocol || '';
            address = extracted.rest;

            //
            // When the authority component is absent the URL starts with a path
            // component.
            //
            if (extracted.protocol === 'file:' && (extracted.slashesCount !== 2 || windowsDriveLetter.test(address)) || !extracted.slashes && (extracted.protocol || extracted.slashesCount < 2 || !isSpecial(url.protocol))) {
              instructions[3] = [/(.*)/, 'pathname'];
            }
            for (; i < instructions.length; i++) {
              instruction = instructions[i];
              if (typeof instruction === 'function') {
                address = instruction(address, url);
                continue;
              }
              parse = instruction[0];
              key = instruction[1];
              if (parse !== parse) {
                url[key] = address;
              } else if ('string' === typeof parse) {
                index = parse === '@' ? address.lastIndexOf(parse) : address.indexOf(parse);
                if (~index) {
                  if ('number' === typeof instruction[2]) {
                    url[key] = address.slice(0, index);
                    address = address.slice(index + instruction[2]);
                  } else {
                    url[key] = address.slice(index);
                    address = address.slice(0, index);
                  }
                }
              } else if (index = parse.exec(address)) {
                url[key] = index[1];
                address = address.slice(0, index.index);
              }
              url[key] = url[key] || (relative && instruction[3] ? location[key] || '' : '');

              //
              // Hostname, host and protocol should be lowercased so they can be used to
              // create a proper `origin`.
              //
              if (instruction[4]) url[key] = url[key].toLowerCase();
            }

            //
            // Also parse the supplied query string in to an object. If we're supplied
            // with a custom parser as function use that instead of the default build-in
            // parser.
            //
            if (parser) url.query = parser(url.query);

            //
            // If the URL is relative, resolve the pathname against the base URL.
            //
            if (relative && location.slashes && url.pathname.charAt(0) !== '/' && (url.pathname !== '' || location.pathname !== '')) {
              url.pathname = resolve(url.pathname, location.pathname);
            }

            //
            // Default to a / for pathname if none exists. This normalizes the URL
            // to always have a /
            //
            if (url.pathname.charAt(0) !== '/' && isSpecial(url.protocol)) {
              url.pathname = '/' + url.pathname;
            }

            //
            // We should not add port numbers if they are already the default port number
            // for a given protocol. As the host also contains the port number we're going
            // override it with the hostname which contains no port number.
            //
            if (!required(url.port, url.protocol)) {
              url.host = url.hostname;
              url.port = '';
            }

            //
            // Parse down the `auth` for the username and password.
            //
            url.username = url.password = '';
            if (url.auth) {
              index = url.auth.indexOf(':');
              if (~index) {
                url.username = url.auth.slice(0, index);
                url.username = encodeURIComponent(decodeURIComponent(url.username));
                url.password = url.auth.slice(index + 1);
                url.password = encodeURIComponent(decodeURIComponent(url.password));
              } else {
                url.username = encodeURIComponent(decodeURIComponent(url.auth));
              }
              url.auth = url.password ? url.username + ':' + url.password : url.username;
            }
            url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host ? url.protocol + '//' + url.host : 'null';

            //
            // The href is just the compiled result.
            //
            url.href = url.toString();
          }

          /**
           * This is convenience method for changing properties in the URL instance to
           * insure that they all propagate correctly.
           *
           * @param {String} part          Property we need to adjust.
           * @param {Mixed} value          The newly assigned value.
           * @param {Boolean|Function} fn  When setting the query, it will be the function
           *                               used to parse the query.
           *                               When setting the protocol, double slash will be
           *                               removed from the final url if it is true.
           * @returns {URL} URL instance for chaining.
           * @public
           */
          function set(part, value, fn) {
            var url = this;
            switch (part) {
              case 'query':
                if ('string' === typeof value && value.length) {
                  value = (fn || qs.parse)(value);
                }
                url[part] = value;
                break;
              case 'port':
                url[part] = value;
                if (!required(value, url.protocol)) {
                  url.host = url.hostname;
                  url[part] = '';
                } else if (value) {
                  url.host = url.hostname + ':' + value;
                }
                break;
              case 'hostname':
                url[part] = value;
                if (url.port) value += ':' + url.port;
                url.host = value;
                break;
              case 'host':
                url[part] = value;
                if (port.test(value)) {
                  value = value.split(':');
                  url.port = value.pop();
                  url.hostname = value.join(':');
                } else {
                  url.hostname = value;
                  url.port = '';
                }
                break;
              case 'protocol':
                url.protocol = value.toLowerCase();
                url.slashes = !fn;
                break;
              case 'pathname':
              case 'hash':
                if (value) {
                  var char = part === 'pathname' ? '/' : '#';
                  url[part] = value.charAt(0) !== char ? char + value : value;
                } else {
                  url[part] = value;
                }
                break;
              case 'username':
              case 'password':
                url[part] = encodeURIComponent(value);
                break;
              case 'auth':
                var index = value.indexOf(':');
                if (~index) {
                  url.username = value.slice(0, index);
                  url.username = encodeURIComponent(decodeURIComponent(url.username));
                  url.password = value.slice(index + 1);
                  url.password = encodeURIComponent(decodeURIComponent(url.password));
                } else {
                  url.username = encodeURIComponent(decodeURIComponent(value));
                }
            }
            for (var i = 0; i < rules.length; i++) {
              var ins = rules[i];
              if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
            }
            url.auth = url.password ? url.username + ':' + url.password : url.username;
            url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host ? url.protocol + '//' + url.host : 'null';
            url.href = url.toString();
            return url;
          }

          /**
           * Transform the properties back in to a valid and full URL string.
           *
           * @param {Function} stringify Optional query stringify function.
           * @returns {String} Compiled version of the URL.
           * @public
           */
          function toString(stringify) {
            if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;
            var query,
              url = this,
              host = url.host,
              protocol = url.protocol;
            if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';
            var result = protocol + (url.protocol && url.slashes || isSpecial(url.protocol) ? '//' : '');
            if (url.username) {
              result += url.username;
              if (url.password) result += ':' + url.password;
              result += '@';
            } else if (url.password) {
              result += ':' + url.password;
              result += '@';
            } else if (url.protocol !== 'file:' && isSpecial(url.protocol) && !host && url.pathname !== '/') {
              //
              // Add back the empty userinfo, otherwise the original invalid URL
              // might be transformed into a valid one with `url.pathname` as host.
              //
              result += '@';
            }

            //
            // Trailing colon is removed from `url.host` when it is parsed. If it still
            // ends with a colon, then add back the trailing colon that was removed. This
            // prevents an invalid URL from being transformed into a valid one.
            //
            if (host[host.length - 1] === ':' || port.test(url.hostname) && !url.port) {
              host += ':';
            }
            result += host + url.pathname;
            query = 'object' === typeof url.query ? stringify(url.query) : url.query;
            if (query) result += '?' !== query.charAt(0) ? '?' + query : query;
            if (url.hash) result += url.hash;
            return result;
          }
          Url.prototype = {
            set: set,
            toString: toString
          };

          //
          // Expose the URL parser and some additional properties that might be useful for
          // others or testing.
          //
          Url.extractProtocol = extractProtocol;
          Url.location = lolcation;
          Url.trimLeft = trimLeft;
          Url.qs = qs;
          module.exports = Url;
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "querystringify": 58,
      "requires-port": 59
    }]
  }, {}, [1])(1);
});

/***/ }),

/***/ "./node_modules/webpack-dev-server/client/clients/BaseClient.js":
/*!*********************************************************!*\
  !*** (webpack)-dev-server/client/clients/BaseClient.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable
  no-unused-vars
*/
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
module.exports = /*#__PURE__*/function () {
  function BaseClient() {
    _classCallCheck(this, BaseClient);
  }
  _createClass(BaseClient, null, [{
    key: "getClientPath",
    value: function getClientPath(options) {
      throw new Error('Client needs implementation');
    }
  }]);
  return BaseClient;
}();

/***/ }),

/***/ "./node_modules/webpack-dev-server/client/clients/SockJSClient.js":
/*!***********************************************************!*\
  !*** (webpack)-dev-server/client/clients/SockJSClient.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable
  no-unused-vars
*/
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return _typeof(obj);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
var SockJS = __webpack_require__(/*! sockjs-client/dist/sockjs */ "./node_modules/sockjs-client/dist/sockjs.js");
var BaseClient = __webpack_require__(/*! ./BaseClient */ "./node_modules/webpack-dev-server/client/clients/BaseClient.js");
module.exports = /*#__PURE__*/function (_BaseClient) {
  _inherits(SockJSClient, _BaseClient);
  var _super = _createSuper(SockJSClient);
  function SockJSClient(url) {
    var _this;
    _classCallCheck(this, SockJSClient);
    _this = _super.call(this);
    _this.sock = new SockJS(url);
    _this.sock.onerror = function (err) {// TODO: use logger to log the error event once client and client-src
      // are reorganized to have the same directory structure
    };
    return _this;
  }
  _createClass(SockJSClient, [{
    key: "onOpen",
    value: function onOpen(f) {
      this.sock.onopen = f;
    }
  }, {
    key: "onClose",
    value: function onClose(f) {
      this.sock.onclose = f;
    } // call f with the message string as the first argument
  }, {
    key: "onMessage",
    value: function onMessage(f) {
      this.sock.onmessage = function (e) {
        f(e.data);
      };
    }
  }], [{
    key: "getClientPath",
    value: function getClientPath(options) {
      return /*require.resolve*/(/*! ./SockJSClient */ "./node_modules/webpack-dev-server/client/clients/SockJSClient.js");
    }
  }]);
  return SockJSClient;
}(BaseClient);

/***/ }),

/***/ "./node_modules/webpack-dev-server/client/clients/WebsocketClient.js":
/*!**************************************************************!*\
  !*** (webpack)-dev-server/client/clients/WebsocketClient.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* global WebSocket */

/* eslint-disable
  no-unused-vars
*/
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return _typeof(obj);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
var BaseClient = __webpack_require__(/*! ./BaseClient */ "./node_modules/webpack-dev-server/client/clients/BaseClient.js");
module.exports = /*#__PURE__*/function (_BaseClient) {
  _inherits(WebsocketClient, _BaseClient);
  var _super = _createSuper(WebsocketClient);
  function WebsocketClient(url) {
    var _this;
    _classCallCheck(this, WebsocketClient);
    _this = _super.call(this);
    _this.client = new WebSocket(url.replace(/^http/, 'ws'));
    _this.client.onerror = function (err) {// TODO: use logger to log the error event once client and client-src
      // are reorganized to have the same directory structure
    };
    return _this;
  }
  _createClass(WebsocketClient, [{
    key: "onOpen",
    value: function onOpen(f) {
      this.client.onopen = f;
    }
  }, {
    key: "onClose",
    value: function onClose(f) {
      this.client.onclose = f;
    } // call f with the message string as the first argument
  }, {
    key: "onMessage",
    value: function onMessage(f) {
      this.client.onmessage = function (e) {
        f(e.data);
      };
    }
  }], [{
    key: "getClientPath",
    value: function getClientPath(options) {
      return /*require.resolve*/(/*! ./WebsocketClient */ "./node_modules/webpack-dev-server/client/clients/WebsocketClient.js");
    }
  }]);
  return WebsocketClient;
}(BaseClient);

/***/ }),

/***/ "./node_modules/webpack-dev-server/client/index.js?http://0.0.0.0":
/*!**************************************************!*\
  !*** (webpack)-dev-server/client?http://0.0.0.0 ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__resourceQuery) {

/* global __resourceQuery WorkerGlobalScope self */

/* eslint prefer-destructuring: off */
var stripAnsi = __webpack_require__(/*! strip-ansi */ "./node_modules/webpack-dev-server/node_modules/strip-ansi/index.js");
var socket = __webpack_require__(/*! ./socket */ "./node_modules/webpack-dev-server/client/socket.js");
var overlay = __webpack_require__(/*! ./overlay */ "./node_modules/webpack-dev-server/client/overlay.js");
var _require = __webpack_require__(/*! ./utils/log */ "./node_modules/webpack-dev-server/client/utils/log.js"),
  log = _require.log,
  setLogLevel = _require.setLogLevel;
var sendMessage = __webpack_require__(/*! ./utils/sendMessage */ "./node_modules/webpack-dev-server/client/utils/sendMessage.js");
var reloadApp = __webpack_require__(/*! ./utils/reloadApp */ "./node_modules/webpack-dev-server/client/utils/reloadApp.js");
var createSocketUrl = __webpack_require__(/*! ./utils/createSocketUrl */ "./node_modules/webpack-dev-server/client/utils/createSocketUrl.js");
var status = {
  isUnloading: false,
  currentHash: ''
};
var options = {
  hot: false,
  hotReload: true,
  liveReload: false,
  initial: true,
  useWarningOverlay: false,
  useErrorOverlay: false,
  useProgress: false
};
var socketUrl = createSocketUrl(__resourceQuery);
self.addEventListener('beforeunload', function () {
  status.isUnloading = true;
});
if (typeof window !== 'undefined') {
  var qs = window.location.search.toLowerCase();
  options.hotReload = qs.indexOf('hotreload=false') === -1;
}
var onSocketMessage = {
  hot: function hot() {
    options.hot = true;
    log.info('[WDS] Hot Module Replacement enabled.');
  },
  liveReload: function liveReload() {
    options.liveReload = true;
    log.info('[WDS] Live Reloading enabled.');
  },
  invalid: function invalid() {
    log.info('[WDS] App updated. Recompiling...'); // fixes #1042. overlay doesn't clear if errors are fixed but warnings remain.

    if (options.useWarningOverlay || options.useErrorOverlay) {
      overlay.clear();
    }
    sendMessage('Invalid');
  },
  hash: function hash(_hash) {
    status.currentHash = _hash;
  },
  'still-ok': function stillOk() {
    log.info('[WDS] Nothing changed.');
    if (options.useWarningOverlay || options.useErrorOverlay) {
      overlay.clear();
    }
    sendMessage('StillOk');
  },
  'log-level': function logLevel(level) {
    var hotCtx = __webpack_require__("./node_modules/webpack/hot sync ^\\.\\/log$");
    if (hotCtx.keys().indexOf('./log') !== -1) {
      hotCtx('./log').setLogLevel(level);
    }
    setLogLevel(level);
  },
  overlay: function overlay(value) {
    if (typeof document !== 'undefined') {
      if (typeof value === 'boolean') {
        options.useWarningOverlay = false;
        options.useErrorOverlay = value;
      } else if (value) {
        options.useWarningOverlay = value.warnings;
        options.useErrorOverlay = value.errors;
      }
    }
  },
  progress: function progress(_progress) {
    if (typeof document !== 'undefined') {
      options.useProgress = _progress;
    }
  },
  'progress-update': function progressUpdate(data) {
    if (options.useProgress) {
      log.info("[WDS] ".concat(data.percent, "% - ").concat(data.msg, "."));
    }
    sendMessage('Progress', data);
  },
  ok: function ok() {
    sendMessage('Ok');
    if (options.useWarningOverlay || options.useErrorOverlay) {
      overlay.clear();
    }
    if (options.initial) {
      return options.initial = false;
    } // eslint-disable-line no-return-assign

    reloadApp(options, status);
  },
  'content-changed': function contentChanged() {
    log.info('[WDS] Content base changed. Reloading...');
    self.location.reload();
  },
  warnings: function warnings(_warnings) {
    log.warn('[WDS] Warnings while compiling.');
    var strippedWarnings = _warnings.map(function (warning) {
      return stripAnsi(warning);
    });
    sendMessage('Warnings', strippedWarnings);
    for (var i = 0; i < strippedWarnings.length; i++) {
      log.warn(strippedWarnings[i]);
    }
    if (options.useWarningOverlay) {
      overlay.showMessage(_warnings);
    }
    if (options.initial) {
      return options.initial = false;
    } // eslint-disable-line no-return-assign

    reloadApp(options, status);
  },
  errors: function errors(_errors) {
    log.error('[WDS] Errors while compiling. Reload prevented.');
    var strippedErrors = _errors.map(function (error) {
      return stripAnsi(error);
    });
    sendMessage('Errors', strippedErrors);
    for (var i = 0; i < strippedErrors.length; i++) {
      log.error(strippedErrors[i]);
    }
    if (options.useErrorOverlay) {
      overlay.showMessage(_errors);
    }
    options.initial = false;
  },
  error: function error(_error) {
    log.error(_error);
  },
  close: function close() {
    log.error('[WDS] Disconnected!');
    sendMessage('Close');
  }
};
socket(socketUrl, onSocketMessage);
/* WEBPACK VAR INJECTION */}.call(this, "?http://0.0.0.0"))

/***/ }),

/***/ "./node_modules/webpack-dev-server/client/overlay.js":
/*!**********************************************!*\
  !*** (webpack)-dev-server/client/overlay.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// The error overlay is inspired (and mostly copied) from Create React App (https://github.com/facebookincubator/create-react-app)
// They, in turn, got inspired by webpack-hot-middleware (https://github.com/glenjamin/webpack-hot-middleware).
var ansiHTML = __webpack_require__(/*! ansi-html */ "./node_modules/ansi-html/index.js");
var _require = __webpack_require__(/*! html-entities */ "./node_modules/html-entities/lib/index.js"),
  AllHtmlEntities = _require.AllHtmlEntities;
var entities = new AllHtmlEntities();
var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};
var overlayIframe = null;
var overlayDiv = null;
var lastOnOverlayDivReady = null;
ansiHTML.setColors(colors);
function createOverlayIframe(onIframeLoad) {
  var iframe = document.createElement('iframe');
  iframe.id = 'webpack-dev-server-client-overlay';
  iframe.src = 'about:blank';
  iframe.style.position = 'fixed';
  iframe.style.left = 0;
  iframe.style.top = 0;
  iframe.style.right = 0;
  iframe.style.bottom = 0;
  iframe.style.width = '100vw';
  iframe.style.height = '100vh';
  iframe.style.border = 'none';
  iframe.style.zIndex = 9999999999;
  iframe.onload = onIframeLoad;
  return iframe;
}
function addOverlayDivTo(iframe) {
  var div = iframe.contentDocument.createElement('div');
  div.id = 'webpack-dev-server-client-overlay-div';
  div.style.position = 'fixed';
  div.style.boxSizing = 'border-box';
  div.style.left = 0;
  div.style.top = 0;
  div.style.right = 0;
  div.style.bottom = 0;
  div.style.width = '100vw';
  div.style.height = '100vh';
  div.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
  div.style.color = '#E8E8E8';
  div.style.fontFamily = 'Menlo, Consolas, monospace';
  div.style.fontSize = 'large';
  div.style.padding = '2rem';
  div.style.lineHeight = '1.2';
  div.style.whiteSpace = 'pre-wrap';
  div.style.overflow = 'auto';
  iframe.contentDocument.body.appendChild(div);
  return div;
}
function ensureOverlayDivExists(onOverlayDivReady) {
  if (overlayDiv) {
    // Everything is ready, call the callback right away.
    onOverlayDivReady(overlayDiv);
    return;
  } // Creating an iframe may be asynchronous so we'll schedule the callback.
  // In case of multiple calls, last callback wins.

  lastOnOverlayDivReady = onOverlayDivReady;
  if (overlayIframe) {
    // We've already created it.
    return;
  } // Create iframe and, when it is ready, a div inside it.

  overlayIframe = createOverlayIframe(function () {
    overlayDiv = addOverlayDivTo(overlayIframe); // Now we can talk!

    lastOnOverlayDivReady(overlayDiv);
  }); // Zalgo alert: onIframeLoad() will be called either synchronously
  // or asynchronously depending on the browser.
  // We delay adding it so `overlayIframe` is set when `onIframeLoad` fires.

  document.body.appendChild(overlayIframe);
} // Successful compilation.

function clear() {
  if (!overlayDiv) {
    // It is not there in the first place.
    return;
  } // Clean up and reset internal state.

  document.body.removeChild(overlayIframe);
  overlayDiv = null;
  overlayIframe = null;
  lastOnOverlayDivReady = null;
} // Compilation with errors (e.g. syntax error or missing modules).

function showMessage(messages) {
  ensureOverlayDivExists(function (div) {
    // Make it look similar to our terminal.
    div.innerHTML = "<span style=\"color: #".concat(colors.red, "\">Failed to compile.</span><br><br>").concat(ansiHTML(entities.encode(messages[0])));
  });
}
module.exports = {
  clear: clear,
  showMessage: showMessage
};

/***/ }),

/***/ "./node_modules/webpack-dev-server/client/socket.js":
/*!*********************************************!*\
  !*** (webpack)-dev-server/client/socket.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__webpack_dev_server_client__) {

/* global __webpack_dev_server_client__ */

/* eslint-disable
  camelcase
*/
// this SockJSClient is here as a default fallback, in case inline mode
// is off or the client is not injected. This will be switched to
// WebsocketClient when it becomes the default
// important: the path to SockJSClient here is made to work in the 'client'
// directory, but is updated via the webpack compilation when compiled from
// the 'client-src' directory
var Client = typeof __webpack_dev_server_client__ !== 'undefined' ? __webpack_dev_server_client__ :
// eslint-disable-next-line import/no-unresolved
__webpack_require__(/*! ./clients/SockJSClient */ "./node_modules/webpack-dev-server/client/clients/SockJSClient.js");
var retries = 0;
var client = null;
var socket = function initSocket(url, handlers) {
  client = new Client(url);
  client.onOpen(function () {
    retries = 0;
  });
  client.onClose(function () {
    if (retries === 0) {
      handlers.close();
    } // Try to reconnect.

    client = null; // After 10 retries stop trying, to prevent logspam.

    if (retries <= 10) {
      // Exponentially increase timeout to reconnect.
      // Respectfully copied from the package `got`.
      // eslint-disable-next-line no-mixed-operators, no-restricted-properties
      var retryInMs = 1000 * Math.pow(2, retries) + Math.random() * 100;
      retries += 1;
      setTimeout(function () {
        socket(url, handlers);
      }, retryInMs);
    }
  });
  client.onMessage(function (data) {
    var msg = JSON.parse(data);
    if (handlers[msg.type]) {
      handlers[msg.type](msg.data);
    }
  });
};
module.exports = socket;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! (webpack)-dev-server/client/clients/WebsocketClient.js */ "./node_modules/webpack-dev-server/client/clients/WebsocketClient.js")))

/***/ }),

/***/ "./node_modules/webpack-dev-server/client/utils/createSocketUrl.js":
/*!************************************************************!*\
  !*** (webpack)-dev-server/client/utils/createSocketUrl.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* global self */
var url = __webpack_require__(/*! url */ "url");
var getCurrentScriptSource = __webpack_require__(/*! ./getCurrentScriptSource */ "./node_modules/webpack-dev-server/client/utils/getCurrentScriptSource.js");
function createSocketUrl(resourceQuery, currentLocation) {
  var urlParts;
  if (typeof resourceQuery === 'string' && resourceQuery !== '') {
    // If this bundle is inlined, use the resource query to get the correct url.
    // format is like `?http://0.0.0.0:8096&sockPort=8097&sockHost=localhost`
    urlParts = url.parse(resourceQuery // strip leading `?` from query string to get a valid URL
    .substr(1) // replace first `&` with `?` to have a valid query string
    .replace('&', '?'), true);
  } else {
    // Else, get the url from the <script> this file was called with.
    var scriptHost = getCurrentScriptSource();
    urlParts = url.parse(scriptHost || '/', true, true);
  } // Use parameter to allow passing location in unit tests

  if (typeof currentLocation === 'string' && currentLocation !== '') {
    currentLocation = url.parse(currentLocation);
  } else {
    currentLocation = self.location;
  }
  return getSocketUrl(urlParts, currentLocation);
}
/*
 * Gets socket URL based on Script Source/Location
 * (scriptSrc: URL, location: URL) -> URL
 */

function getSocketUrl(urlParts, loc) {
  var auth = urlParts.auth,
    query = urlParts.query;
  var hostname = urlParts.hostname,
    protocol = urlParts.protocol,
    port = urlParts.port;
  if (!port || port === '0') {
    port = loc.port;
  } // check ipv4 and ipv6 `all hostname`
  // why do we need this check?
  // hostname n/a for file protocol (example, when using electron, ionic)
  // see: https://github.com/webpack/webpack-dev-server/pull/384

  if ((hostname === '0.0.0.0' || hostname === '::') && loc.hostname && loc.protocol.indexOf('http') === 0) {
    hostname = loc.hostname;
  } // `hostname` can be empty when the script path is relative. In that case, specifying
  // a protocol would result in an invalid URL.
  // When https is used in the app, secure websockets are always necessary
  // because the browser doesn't accept non-secure websockets.

  if (hostname && hostname !== '127.0.0.1' && (loc.protocol === 'https:' || urlParts.hostname === '0.0.0.0')) {
    protocol = loc.protocol;
  } // all of these sock url params are optionally passed in through
  // resourceQuery, so we need to fall back to the default if
  // they are not provided

  var sockHost = query.sockHost || hostname;
  var sockPath = query.sockPath || '/sockjs-node';
  var sockPort = query.sockPort || port;
  if (sockPort === 'location') {
    sockPort = loc.port;
  }
  return url.format({
    protocol: protocol,
    auth: auth,
    hostname: sockHost,
    port: sockPort,
    // If sockPath is provided it'll be passed in via the resourceQuery as a
    // query param so it has to be parsed out of the querystring in order for the
    // client to open the socket to the correct location.
    pathname: sockPath
  });
}
module.exports = createSocketUrl;

/***/ }),

/***/ "./node_modules/webpack-dev-server/client/utils/getCurrentScriptSource.js":
/*!*******************************************************************!*\
  !*** (webpack)-dev-server/client/utils/getCurrentScriptSource.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function getCurrentScriptSource() {
  // `document.currentScript` is the most accurate way to find the current script,
  // but is not supported in all browsers.
  if (document.currentScript) {
    return document.currentScript.getAttribute('src');
  } // Fall back to getting all scripts in the document.

  var scriptElements = document.scripts || [];
  var currentScript = scriptElements[scriptElements.length - 1];
  if (currentScript) {
    return currentScript.getAttribute('src');
  } // Fail as there was no script to use.

  throw new Error('[WDS] Failed to get current script source.');
}
module.exports = getCurrentScriptSource;

/***/ }),

/***/ "./node_modules/webpack-dev-server/client/utils/log.js":
/*!************************************************!*\
  !*** (webpack)-dev-server/client/utils/log.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var log = __webpack_require__(/*! loglevel */ "./node_modules/loglevel/lib/loglevel.js").getLogger('webpack-dev-server');
var INFO = 'info';
var WARN = 'warn';
var ERROR = 'error';
var DEBUG = 'debug';
var TRACE = 'trace';
var SILENT = 'silent'; // deprecated
// TODO: remove these at major released
// https://github.com/webpack/webpack-dev-server/pull/1825

var WARNING = 'warning';
var NONE = 'none'; // Set the default log level

log.setDefaultLevel(INFO);
function setLogLevel(level) {
  switch (level) {
    case INFO:
    case WARN:
    case ERROR:
    case DEBUG:
    case TRACE:
      log.setLevel(level);
      break;
    // deprecated

    case WARNING:
      // loglevel's warning name is different from webpack's
      log.setLevel('warn');
      break;
    // deprecated

    case NONE:
    case SILENT:
      log.disableAll();
      break;
    default:
      log.error("[WDS] Unknown clientLogLevel '".concat(level, "'"));
  }
}
module.exports = {
  log: log,
  setLogLevel: setLogLevel
};

/***/ }),

/***/ "./node_modules/webpack-dev-server/client/utils/reloadApp.js":
/*!******************************************************!*\
  !*** (webpack)-dev-server/client/utils/reloadApp.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* global WorkerGlobalScope self */
var _require = __webpack_require__(/*! ./log */ "./node_modules/webpack-dev-server/client/utils/log.js"),
  log = _require.log;
function reloadApp(_ref, _ref2) {
  var hotReload = _ref.hotReload,
    hot = _ref.hot,
    liveReload = _ref.liveReload;
  var isUnloading = _ref2.isUnloading,
    currentHash = _ref2.currentHash;
  if (isUnloading || !hotReload) {
    return;
  }
  if (hot) {
    log.info('[WDS] App hot update...');
    var hotEmitter = __webpack_require__(/*! webpack/hot/emitter */ "./node_modules/webpack/hot/emitter.js");
    hotEmitter.emit('webpackHotUpdate', currentHash);
    if (typeof self !== 'undefined' && self.window) {
      // broadcast update to window
      self.postMessage("webpackHotUpdate".concat(currentHash), '*');
    }
  } // allow refreshing the page only if liveReload isn't disabled
  else if (liveReload) {
    var rootWindow = self; // use parent window for reload (in case we're in an iframe with no valid src)

    var intervalId = self.setInterval(function () {
      if (rootWindow.location.protocol !== 'about:') {
        // reload immediately if protocol is valid
        applyReload(rootWindow, intervalId);
      } else {
        rootWindow = rootWindow.parent;
        if (rootWindow.parent === rootWindow) {
          // if parent equals current window we've reached the root which would continue forever, so trigger a reload anyways
          applyReload(rootWindow, intervalId);
        }
      }
    });
  }
  function applyReload(rootWindow, intervalId) {
    clearInterval(intervalId);
    log.info('[WDS] App updated. Reloading...');
    rootWindow.location.reload();
  }
}
module.exports = reloadApp;

/***/ }),

/***/ "./node_modules/webpack-dev-server/client/utils/sendMessage.js":
/*!********************************************************!*\
  !*** (webpack)-dev-server/client/utils/sendMessage.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* global __resourceQuery WorkerGlobalScope self */
// Send messages to the outside, so plugins can consume it.
function sendMsg(type, data) {
  if (typeof self !== 'undefined' && (typeof WorkerGlobalScope === 'undefined' || !(self instanceof WorkerGlobalScope))) {
    self.postMessage({
      type: "webpack".concat(type),
      data: data
    }, '*');
  }
}
module.exports = sendMsg;

/***/ }),

/***/ "./node_modules/webpack-dev-server/node_modules/ansi-regex/index.js":
/*!*************************************************************!*\
  !*** (webpack)-dev-server/node_modules/ansi-regex/index.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
  return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};

/***/ }),

/***/ "./node_modules/webpack-dev-server/node_modules/strip-ansi/index.js":
/*!*************************************************************!*\
  !*** (webpack)-dev-server/node_modules/strip-ansi/index.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ansiRegex = __webpack_require__(/*! ansi-regex */ "./node_modules/webpack-dev-server/node_modules/ansi-regex/index.js")();
module.exports = function (str) {
  return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};

/***/ }),

/***/ "./node_modules/webpack/hot sync ^\\.\\/log$":
/*!*************************************************!*\
  !*** (webpack)/hot sync nonrecursive ^\.\/log$ ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./log": "./node_modules/webpack/hot/log.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./node_modules/webpack/hot sync ^\\.\\/log$";

/***/ }),

/***/ "./node_modules/webpack/hot/dev-server.js":
/*!***********************************!*\
  !*** (webpack)/hot/dev-server.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals window __webpack_hash__ */
if (true) {
  var lastHash;
  var upToDate = function upToDate() {
    return lastHash.indexOf(__webpack_require__.h()) >= 0;
  };
  var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");
  var check = function check() {
    module.hot.check(true).then(function (updatedModules) {
      if (!updatedModules) {
        log("warning", "[HMR] Cannot find update. Need to do a full reload!");
        log("warning", "[HMR] (Probably because of restarting the webpack-dev-server)");
        window.location.reload();
        return;
      }
      if (!upToDate()) {
        check();
      }
      __webpack_require__(/*! ./log-apply-result */ "./node_modules/webpack/hot/log-apply-result.js")(updatedModules, updatedModules);
      if (upToDate()) {
        log("info", "[HMR] App is up to date.");
      }
    }).catch(function (err) {
      var status = module.hot.status();
      if (["abort", "fail"].indexOf(status) >= 0) {
        log("warning", "[HMR] Cannot apply update. Need to do a full reload!");
        log("warning", "[HMR] " + log.formatError(err));
        window.location.reload();
      } else {
        log("warning", "[HMR] Update failed: " + log.formatError(err));
      }
    });
  };
  var hotEmitter = __webpack_require__(/*! ./emitter */ "./node_modules/webpack/hot/emitter.js");
  hotEmitter.on("webpackHotUpdate", function (currentHash) {
    lastHash = currentHash;
    if (!upToDate() && module.hot.status() === "idle") {
      log("info", "[HMR] Checking for updates on the server...");
      check();
    }
  });
  log("info", "[HMR] Waiting for update signal from WDS...");
} else {}

/***/ }),

/***/ "./node_modules/webpack/hot/emitter.js":
/*!********************************!*\
  !*** (webpack)/hot/emitter.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var EventEmitter = __webpack_require__(/*! events */ "events");
module.exports = new EventEmitter();

/***/ }),

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function (updatedModules, renewedModules) {
  var unacceptedModules = updatedModules.filter(function (moduleId) {
    return renewedModules && renewedModules.indexOf(moduleId) < 0;
  });
  var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");
  if (unacceptedModules.length > 0) {
    log("warning", "[HMR] The following modules couldn't be hot updated: (They would need a full reload!)");
    unacceptedModules.forEach(function (moduleId) {
      log("warning", "[HMR]  - " + moduleId);
    });
  }
  if (!renewedModules || renewedModules.length === 0) {
    log("info", "[HMR] Nothing hot updated.");
  } else {
    log("info", "[HMR] Updated modules:");
    renewedModules.forEach(function (moduleId) {
      if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
        var parts = moduleId.split("!");
        log.groupCollapsed("info", "[HMR]  - " + parts.pop());
        log("info", "[HMR]  - " + moduleId);
        log.groupEnd("info");
      } else {
        log("info", "[HMR]  - " + moduleId);
      }
    });
    var numberIds = renewedModules.every(function (moduleId) {
      return typeof moduleId === "number";
    });
    if (numberIds) log("info", "[HMR] Consider using the NamedModulesPlugin for module names.");
  }
};

/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

var logLevel = "info";
function dummy() {}
function shouldLog(level) {
  var shouldLog = logLevel === "info" && level === "info" || ["info", "warning"].indexOf(logLevel) >= 0 && level === "warning" || ["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error";
  return shouldLog;
}
function logGroup(logFn) {
  return function (level, msg) {
    if (shouldLog(level)) {
      logFn(msg);
    }
  };
}
module.exports = function (level, msg) {
  if (shouldLog(level)) {
    if (level === "info") {
      console.log(msg);
    } else if (level === "warning") {
      console.warn(msg);
    } else if (level === "error") {
      console.error(msg);
    }
  }
};

/* eslint-disable node/no-unsupported-features/node-builtins */
var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);
module.exports.groupCollapsed = logGroup(groupCollapsed);
module.exports.groupEnd = logGroup(groupEnd);
module.exports.setLogLevel = function (level) {
  logLevel = level;
};
module.exports.formatError = function (err) {
  var message = err.message;
  var stack = err.stack;
  if (!stack) {
    return message;
  } else if (stack.indexOf(message) < 0) {
    return message + "\n" + stack;
  } else {
    return stack;
  }
};

/***/ }),

/***/ "./src/App.jsx":
/*!*********************!*\
  !*** ./src/App.jsx ***!
  \*********************/
/*! exports provided: init, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony import */ var _components_UseComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/components/UseComponent */ "./src/components/UseComponent/index.jsx");
/* harmony import */ var scrollingelement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! scrollingelement */ "./node_modules/scrollingelement/scrollingelement.js");
/* harmony import */ var scrollingelement__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(scrollingelement__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _AppRouter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/AppRouter */ "./src/AppRouter.js");
/* harmony import */ var _utils_cache__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/utils/cache */ "./src/utils/cache.js");
/* harmony import */ var _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/hooks/useAppInfo */ "./src/hooks/useAppInfo.js");
var _jsxFileName = "/Users/chennima/Desktop/vercel-homepage/src/App.jsx";






function pageRef2pageKey(e) {
  if (e === _AppRouter__WEBPACK_IMPORTED_MODULE_3__["Router"].module.header) return '_Header';
  if (e === _AppRouter__WEBPACK_IMPORTED_MODULE_3__["Router"].module.footer) return '_Footer';
  return Object(_AppRouter__WEBPACK_IMPORTED_MODULE_3__["getIsUnique"])(e) ? e.path : location.href;
}
async function init(payloads) {
  const modules = [_AppRouter__WEBPACK_IMPORTED_MODULE_3__["Router"].module.header, Object(_AppRouter__WEBPACK_IMPORTED_MODULE_3__["getPageRef"])().ref, _AppRouter__WEBPACK_IMPORTED_MODULE_3__["Router"].module.footer].filter(Boolean);
  if (!modules.length) return;
  return Promise.all(modules.map(async (m, i) => {
    var _m$init;
    const t = await (m === null || m === void 0 ? void 0 : (_m$init = m.init) === null || _m$init === void 0 ? void 0 : _m$init.call(m, payloads === null || payloads === void 0 ? void 0 : payloads[i]));
    Object(_hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_5__["usePayload"])(pageRef2pageKey(m)).set(t);
    return t;
  }));
}
const pageArr = [];
/* harmony default export */ __webpack_exports__["default"] = (function () {
  react__WEBPACK_IMPORTED_MODULE_2___default.a.useEffect(_ => {
    _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_5__["JavascriptReady"].set(true);
  }, []);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(AutoInit, {
    pageRef: _AppRouter__WEBPACK_IMPORTED_MODULE_3__["Router"].module.header,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 37,
      columnNumber: 5
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: "app-container",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 38,
      columnNumber: 5
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/services/FadeView */ "./src/services/FadeView/index.jsx"),
    render: _ => {
      const e = Object(_AppRouter__WEBPACK_IMPORTED_MODULE_3__["getPageRef"])();
      const pageKey = pageRef2pageKey(e);
      return Object(_utils_cache__WEBPACK_IMPORTED_MODULE_4__["autoCleanList"])(pageArr, x => x.pageKey === pageKey, _ => ({
        pageKey,
        page: [/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(AutoInit, {
          pageRef: e.ref,
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 46,
            columnNumber: 13
          }
        }), Object(_AppRouter__WEBPACK_IMPORTED_MODULE_3__["getZIndex"])(e)]
      })).page;
    },
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 39,
      columnNumber: 7
    }
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(AutoInit, {
    pageRef: _AppRouter__WEBPACK_IMPORTED_MODULE_3__["Router"].module.footer,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 52,
      columnNumber: 5
    }
  }));
});
function AutoInit({
  pageRef
}) {
  const pageKey = pageRef2pageKey(pageRef);
  const S_FETCHING = 1,
    S_DONE = 2,
    S_ERROR = 3;
  const [payload, set_payload] = Object(_hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_5__["usePayload"])(pageKey).use();
  const [status, set_status] = react__WEBPACK_IMPORTED_MODULE_2___default.a.useState(_ => {
    return payload === null && typeof pageRef.init === 'function' ? S_FETCHING : S_DONE;
  });
  const isFetching = status === S_FETCHING;
  const isError = status === S_ERROR;
  const isDone = status === S_DONE;
  react__WEBPACK_IMPORTED_MODULE_2___default.a.useEffect(_ => {
    if (!isFetching) return;
    ;
    (async _ => {
      try {
        set_payload(await pageRef.init());
        set_status(S_DONE);
      } catch (e) {
        set_status(S_ERROR);
      }
    })();
  }, [status]);
  const [isFirst, emitAll] = Object(_hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_5__["useUniqueLoading"])(pageKey, isDone, _ => set_status(S_FETCHING));
  const Page = pageRef.default;
  const Loading = pageRef.Loading;
  if (isDone) return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(Page, {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 85,
      columnNumber: 21
    }
  });
  if (isFirst && Loading) return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(Loading, {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 86,
      columnNumber: 33
    }
  });
  if (isFirst) return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: "payload-pending",
    style: {
      height: 200
    },
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 87,
      columnNumber: 22
    }
  }, isFetching && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/components/Loading */ "./src/components/Loading/index.jsx"),
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 88,
      columnNumber: 20
    }
  }), isError && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: "error",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 89,
      columnNumber: 17
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("h3", {
    className: "title",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 90,
      columnNumber: 7
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/components/Icon */ "./src/components/Icon/index.jsx"),
    className: "bi-emoji-surprise",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 91,
      columnNumber: 9
    }
  }), " Network error."), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/components/Icon */ "./src/components/Icon/index.jsx"),
    className: "bi-arrow-counterclockwise",
    onClick: emitAll,
    isBtn: true,
    text: 'reload',
    size: "normal",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 95,
      columnNumber: 7
    }
  })));
  return null;
}

/***/ }),

/***/ "./src/AppRouter.js":
/*!**************************!*\
  !*** ./src/AppRouter.js ***!
  \**************************/
/*! exports provided: Router, CustomRouter, getPageRef, isCurrent, getZIndex, getIsUnique */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Router", function() { return Router; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomRouter", function() { return CustomRouter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPageRef", function() { return getPageRef; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isCurrent", function() { return isCurrent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getZIndex", function() { return getZIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getIsUnique", function() { return getIsUnique; });
/* harmony import */ var _app_Create__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/app/Create */ "./src/app/Create/index.jsx");
/* harmony import */ var _app_Detail__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/app/Detail */ "./src/app/Detail/index.jsx");
/* harmony import */ var _app_Index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/app/Index */ "./src/app/Index/index.jsx");
/* harmony import */ var _app_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/app/config */ "./src/app/config.js");
/* harmony import */ var _app_footer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/app/footer */ "./src/app/footer/index.jsx");
/* harmony import */ var _app_header__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/app/header */ "./src/app/header/index.jsx");
/* harmony import */ var _utils_url__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/utils/url */ "./src/utils/url.js");



const Router = {
  "config": null,
  "module": {},
  "Create": {
    "href": "/p/Create",
    "page": "Create"
  },
  "Detail": {
    "href": "/p/Detail",
    "page": "Detail"
  },
  "Index": {
    "href": "/p/Index",
    "page": "Index"
  }
};
const Router_paths_ref = {
  "/p/Create": "Create",
  "/p/Detail": "Detail",
  "/p/Index": "Index"
};
const paths = {
  '/p/Create': [_app_Create__WEBPACK_IMPORTED_MODULE_0__, 'Create'],
  '/p/Detail': [_app_Detail__WEBPACK_IMPORTED_MODULE_1__, 'Detail'],
  '/p/Index': [_app_Index__WEBPACK_IMPORTED_MODULE_2__, 'Index']
};

Router.config = _app_config__WEBPACK_IMPORTED_MODULE_3__;

Router.module.footer = _app_footer__WEBPACK_IMPORTED_MODULE_4__;

Router.module.header = _app_header__WEBPACK_IMPORTED_MODULE_5__;
const CustomRouter = {
  "Create": {
    "href": "/p/Create",
    "page": "Create"
  },
  "Detail": {
    "href": "/p/Detail",
    "page": "Detail"
  },
  "Index": {
    "href": "/p/Index",
    "page": "Index"
  }
};
;

function getPageRef() {
  const e = location.pathname;
  const path = paths[e] ? e : '/p/Index';
  const [ref, page] = paths[path];
  return {
    path,
    ref,
    page
  };
}
function isCurrent(link) {
  const a = Object(_utils_url__WEBPACK_IMPORTED_MODULE_6__["parseUrl"])(link),
    b = Object(_utils_url__WEBPACK_IMPORTED_MODULE_6__["parseUrl"])(location.href);
  if (a.pathname === '/') a.pathname = '/p/Index';
  if (b.pathname === '/') b.pathname = '/p/Index';
  if (a.pathname !== b.pathname) return false;
  for (let x in a.query) {
    if (b.query[x] !== a.query[x]) return false;
  }
  return true;
}
function getZIndex(x) {
  var _Router$config, _Router$config$zIndex;
  return ((_Router$config = Router.config) === null || _Router$config === void 0 ? void 0 : (_Router$config$zIndex = _Router$config.zIndex) === null || _Router$config$zIndex === void 0 ? void 0 : _Router$config$zIndex[x.page]) || 1;
}
function getIsUnique(x) {
  var _Router$config2, _Router$config2$isUni;
  return ((_Router$config2 = Router.config) === null || _Router$config2 === void 0 ? void 0 : (_Router$config2$isUni = _Router$config2.isUnique) === null || _Router$config2$isUni === void 0 ? void 0 : _Router$config2$isUni[x.page]) || false;
}

/***/ }),

/***/ "./src/app/Create/index.jsx":
/*!**********************************!*\
  !*** ./src/app/Create/index.jsx ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_UseComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/components/UseComponent */ "./src/components/UseComponent/index.jsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
var _jsxFileName = "/Users/chennima/Desktop/vercel-homepage/src/app/Create/index.jsx";


/* harmony default export */ __webpack_exports__["default"] = (function () {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "V_m4nog377_reate_index",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 4,
      columnNumber: 10
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/services/Content */ "./src/services/Content/index.jsx"),
    isCreateView: true,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 5,
      columnNumber: 5
    }
  }));
});

/***/ }),

/***/ "./src/app/Detail/index.jsx":
/*!**********************************!*\
  !*** ./src/app/Detail/index.jsx ***!
  \**********************************/
/*! exports provided: init, Loading, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Loading", function() { return Loading; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Detail; });
/* harmony import */ var _components_UseComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/components/UseComponent */ "./src/components/UseComponent/index.jsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/utils/url */ "./src/utils/url.js");
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./index.scss */ "./src/app/Detail/index.scss");
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_index_scss__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _hooks_useContent__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/hooks/useContent */ "./src/hooks/useContent.js");
var _jsxFileName = "/Users/chennima/Desktop/vercel-homepage/src/app/Detail/index.jsx";





function getIdFromUrl() {
  var _parseUrl$query;
  return parseInt((_parseUrl$query = Object(_utils_url__WEBPACK_IMPORTED_MODULE_2__["parseUrl"])().query) === null || _parseUrl$query === void 0 ? void 0 : _parseUrl$query.id);
}
async function init(payload) {
  if (!payload) payload = await _hooks_useContent__WEBPACK_IMPORTED_MODULE_4__["fetchDetail"](getIdFromUrl());
  _hooks_useContent__WEBPACK_IMPORTED_MODULE_4__["updateContent"](payload);
}
function Loading() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Detail, {
    displayLoading: true,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14,
      columnNumber: 10
    }
  });
}
function Detail(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "V_m4nog377_etail_index",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17,
      columnNumber: 10
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/services/Content */ "./src/services/Content/index.jsx"),
    isDetailView: true,
    displayLoading: props.displayLoading,
    id: getIdFromUrl(),
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 18,
      columnNumber: 5
    }
  }));
}

/***/ }),

/***/ "./src/app/Detail/index.scss":
/*!***********************************!*\
  !*** ./src/app/Detail/index.scss ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/app/Index/index.jsx":
/*!*********************************!*\
  !*** ./src/app/Index/index.jsx ***!
  \*********************************/
/*! exports provided: init, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony import */ var _components_UseComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/components/UseComponent */ "./src/components/UseComponent/index.jsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.scss */ "./src/app/Index/index.scss");
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_index_scss__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _hooks_useContent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/hooks/useContent */ "./src/hooks/useContent.js");
/* harmony import */ var _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/hooks/useAppInfo */ "./src/hooks/useAppInfo.js");
/* harmony import */ var _hooks_useSearchText__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/hooks/useSearchText */ "./src/hooks/useSearchText.js");
/* harmony import */ var _hooks_useHistoryAction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/hooks/useHistoryAction */ "./src/hooks/useHistoryAction.js");
/* harmony import */ var _components_Memo__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/components/Memo */ "./src/components/Memo/index.jsx");
/* harmony import */ var _AppRouter__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/AppRouter */ "./src/AppRouter.js");
var _jsxFileName = "/Users/chennima/Desktop/vercel-homepage/src/app/Index/index.jsx";









async function init(payload) {
  const kw = _hooks_useSearchText__WEBPACK_IMPORTED_MODULE_5__["text"].val();
  if (!payload) payload = await _hooks_useContent__WEBPACK_IMPORTED_MODULE_3__["fetchList"](kw);
  _hooks_useContent__WEBPACK_IMPORTED_MODULE_3__["appendToKwList"](kw, payload);
  _hooks_useContent__WEBPACK_IMPORTED_MODULE_3__["SsrList"].set(payload.nextList.map(x => x.id));
  return payload;
}
/* harmony default export */ __webpack_exports__["default"] = (function () {
  const kw = _hooks_useSearchText__WEBPACK_IMPORTED_MODULE_5__["text"].useVal();
  const isEditing = _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_4__["Editing"].useVal();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "V_m4nog377_ndex_index",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 20,
      columnNumber: 10
    }
  }, isEditing && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "create-btn",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 22,
      columnNumber: 20
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/components/EditBox */ "./src/components/EditBox/index.jsx"),
    noMask: true,
    createText: "create",
    className: "btn1",
    onCreate: _ => {
      _hooks_useHistoryAction__WEBPACK_IMPORTED_MODULE_6__["pushUrl"](_AppRouter__WEBPACK_IMPORTED_MODULE_8__["CustomRouter"].Create.href);
    },
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 23,
      columnNumber: 9
    }
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(ContentList, {
    key: kw,
    kw: kw,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33,
      columnNumber: 5
    }
  }));
});
function ContentList({
  kw
}) {
  const {
    ids,
    isEnd,
    isError,
    isFetching
  } = _hooks_useContent__WEBPACK_IMPORTED_MODULE_3__["useKwList"](kw);
  const jsReady = _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_4__["JavascriptReady"].useVal();
  const isAnimating = _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_4__["IsChangingPage"].useVal();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "content-list",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 40,
      columnNumber: 10
    }
  }, ids.map(({
    id,
    isFromSsr
  }) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_Memo__WEBPACK_IMPORTED_MODULE_7__["default"], {
    key: id,
    watches: [id],
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 41,
      columnNumber: 33
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(FadeIn, {
    showImmediate: isFromSsr,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 42,
      columnNumber: 7
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/services/Content */ "./src/services/Content/index.jsx"),
    isSmallView: true,
    id: id,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 43,
      columnNumber: 9
    }
  })))), jsReady && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "loading-place",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 47,
      columnNumber: 18
    }
  }, (_ => {
    if (isEnd) {
      return ids.length ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        className: "bottom",
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 51,
          columnNumber: 15
        }
      }, "-- All results have been shown. --") : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        className: "empty",
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 52,
          columnNumber: 15
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
        UseComponentSync: true,
        UseComponentGetter: _ => __webpack_require__(/*! @/components/Icon */ "./src/components/Icon/index.jsx"),
        className: "bi-emoji-surprise",
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 53,
          columnNumber: 17
        }
      }), "Found 0 matches.");
    }
    if (isFetching) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
        UseComponentSync: true,
        UseComponentGetter: _ => __webpack_require__(/*! @/components/Loading */ "./src/components/Loading/index.jsx"),
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 58,
          columnNumber: 20
        }
      });
    }
    if (isError) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
        UseComponentSync: true,
        UseComponentGetter: _ => __webpack_require__(/*! @/components/Icon */ "./src/components/Icon/index.jsx"),
        isSimpleBtn: true,
        size: "large",
        className: "bi-chevron-double-down",
        onClick: _ => _hooks_useContent__WEBPACK_IMPORTED_MODULE_3__["loadNextPage"](kw),
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 61,
          columnNumber: 20
        }
      });
    }
    return isAnimating ? null : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
      UseComponentSync: true,
      UseComponentGetter: _ => __webpack_require__(/*! @/components/Expose */ "./src/components/Expose/index.jsx"),
      option: {
        rootMargin: '1px'
      },
      exposeOnce: false,
      onVisible: _ => _hooks_useContent__WEBPACK_IMPORTED_MODULE_3__["loadNextPage"](kw),
      children: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
        UseComponentSync: true,
        UseComponentGetter: _ => __webpack_require__(/*! @/components/Loading */ "./src/components/Loading/index.jsx"),
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 72,
          columnNumber: 23
        }
      }),
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 68,
        columnNumber: 37
      }
    });
  })()));
}
function FadeIn(props) {
  const {
    showImmediate,
    children
  } = props;
  const [show, set_show] = react__WEBPACK_IMPORTED_MODULE_1___default.a.useState(showImmediate);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/components/Expose */ "./src/components/Expose/index.jsx"),
    onVisible: _ => set_show(true),
    exposeOnce: true,
    children: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: 'v-fade ' + (show ? '' : 'v-fade-hide'),
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 85,
        columnNumber: 15
      }
    }, show ? children : null),
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 82,
      columnNumber: 10
    }
  });
}

/***/ }),

/***/ "./src/app/Index/index.scss":
/*!**********************************!*\
  !*** ./src/app/Index/index.scss ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/app/config.js":
/*!***************************!*\
  !*** ./src/app/config.js ***!
  \***************************/
/*! exports provided: zIndex, isUnique */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zIndex", function() { return zIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isUnique", function() { return isUnique; });
const zIndex = {
  Detail: 5,
  Create: 10
};
const isUnique = {
  Index: true,
  Create: true
};

/***/ }),

/***/ "./src/app/footer/index.jsx":
/*!**********************************!*\
  !*** ./src/app/footer/index.jsx ***!
  \**********************************/
/*! exports provided: init, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony import */ var _components_UseComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/components/UseComponent */ "./src/components/UseComponent/index.jsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.scss */ "./src/app/footer/index.scss");
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_index_scss__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_fetch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/utils/fetch */ "./src/utils/fetch.js");
/* harmony import */ var _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/hooks/useAppInfo */ "./src/hooks/useAppInfo.js");
var _jsxFileName = "/Users/chennima/Desktop/vercel-homepage/src/app/footer/index.jsx";





async function init(payload) {
  var _payload;
  if (!payload) payload = await Object(_utils_fetch__WEBPACK_IMPORTED_MODULE_3__["fetch"])('/app/footer');
  _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_4__["FooterText"].set(((_payload = payload) === null || _payload === void 0 ? void 0 : _payload.md) || '');
  return payload;
}
/* harmony default export */ __webpack_exports__["default"] = (function () {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "V_m4nog377_ooter_index",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12,
      columnNumber: 10
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "app-container",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13,
      columnNumber: 5
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/services/AppInfo */ "./src/services/AppInfo/index.jsx"),
    textStore: _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_4__["FooterText"],
    action: "/app/saveFooter",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14,
      columnNumber: 7
    }
  })));
});

/***/ }),

/***/ "./src/app/footer/index.scss":
/*!***********************************!*\
  !*** ./src/app/footer/index.scss ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/app/header/index.jsx":
/*!**********************************!*\
  !*** ./src/app/header/index.jsx ***!
  \**********************************/
/*! exports provided: init, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony import */ var _components_UseComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/components/UseComponent */ "./src/components/UseComponent/index.jsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.scss */ "./src/app/header/index.scss");
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_index_scss__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_fetch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/utils/fetch */ "./src/utils/fetch.js");
/* harmony import */ var _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/hooks/useAppInfo */ "./src/hooks/useAppInfo.js");
/* harmony import */ var _hooks_useSearchText__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/hooks/useSearchText */ "./src/hooks/useSearchText.js");
/* harmony import */ var _hooks_useHistoryAction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/hooks/useHistoryAction */ "./src/hooks/useHistoryAction.js");
/* harmony import */ var _AppRouter__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/AppRouter */ "./src/AppRouter.js");
/* harmony import */ var _components_Link__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/components/Link */ "./src/components/Link/index.jsx");
/* harmony import */ var _components_AutoFixed__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/components/AutoFixed */ "./src/components/AutoFixed/index.jsx");
var _jsxFileName = "/Users/chennima/Desktop/vercel-homepage/src/app/header/index.jsx";










async function init(payload) {
  if (!payload) {
    const [{
      readOnly
    }, {
      md: headerText
    }, {
      md: leftText
    }] = await Promise.all([Object(_utils_fetch__WEBPACK_IMPORTED_MODULE_3__["fetch"])('/app/isReadOnly'), Object(_utils_fetch__WEBPACK_IMPORTED_MODULE_3__["fetch"])('/app/header'), Object(_utils_fetch__WEBPACK_IMPORTED_MODULE_3__["fetch"])('/app/headerLeftText')]);
    payload = {
      readOnly,
      headerText,
      leftText
    };
  }
  const {
    readOnly,
    headerText,
    leftText
  } = payload;
  _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_4__["ReadOnly"].set(readOnly);
  _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_4__["HeaderText"].set(headerText);
  _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_4__["HeaderLeftText"].set(leftText);
  return payload;
}
/* harmony default export */ __webpack_exports__["default"] = (function () {
  const readOnly = _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_4__["ReadOnly"].useVal();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "V_m4nog377_eader_index",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28,
      columnNumber: 10
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(AppHeader, {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 29,
      columnNumber: 5
    }
  }), !readOnly && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(SupportEditor, {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 30,
      columnNumber: 19
    }
  }));
});
function AppHeader(props) {
  const [headerText, set_headerText] = _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_4__["HeaderText"].use();
  const editChange = _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_4__["Editing"].useVal();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_AutoFixed__WEBPACK_IMPORTED_MODULE_9__["default"], {
    className: "header",
    scroller: window.APP_ROOT,
    watchChildrenChange: [editChange],
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36,
      columnNumber: 10
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "app-container",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 41,
      columnNumber: 5
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/services/AppInfo */ "./src/services/AppInfo/index.jsx"),
    textStore: _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_4__["HeaderText"],
    action: "/app/saveHeader",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 42,
      columnNumber: 7
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "tabs",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46,
      columnNumber: 7
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "left",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 47,
      columnNumber: 9
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(LeftMenu, {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 48,
      columnNumber: 11
    }
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "right",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 50,
      columnNumber: 9
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(SearchBtn, {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 51,
      columnNumber: 11
    }
  })))));
}
function LeftMenu(props) {
  const menuRef = react__WEBPACK_IMPORTED_MODULE_1___default.a.useRef(null);
  react__WEBPACK_IMPORTED_MODULE_1___default.a.useEffect(_ => {
    const c = menuRef.current;
    if (!c) return;
    c.addEventListener('click', e => {
      e.preventDefault();
      const p = e.target.getAttribute('href');
      if (!p) return;
      _hooks_useHistoryAction__WEBPACK_IMPORTED_MODULE_6__["pushUrl"](p);
      _hooks_useSearchText__WEBPACK_IMPORTED_MODULE_5__["text"].set('');
    });
  }, []);
  _hooks_useHistoryAction__WEBPACK_IMPORTED_MODULE_6__["useVal"]();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    ref: menuRef,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 71,
      columnNumber: 10
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/services/AppInfo */ "./src/services/AppInfo/index.jsx"),
    className: "left-info",
    textStore: _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_4__["HeaderLeftText"],
    action: "/app/saveHeaderLeftText",
    parser: x => {
      const e = [];
      x.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, (_, text, link) => {
        e.push(/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_Link__WEBPACK_IMPORTED_MODULE_8__["default"], {
          key: text,
          href: link,
          className: Object(_AppRouter__WEBPACK_IMPORTED_MODULE_7__["isCurrent"])(link) ? 'active' : '',
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 79,
            columnNumber: 18
          }
        }, text));
      });
      return e;
    },
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 72,
      columnNumber: 5
    }
  }));
}
function SearchBtn(props) {
  const [inp, set_inp] = _hooks_useSearchText__WEBPACK_IMPORTED_MODULE_5__["useInput"]();
  const jsReady = _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_4__["JavascriptReady"].useVal();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: ['searchbox', !jsReady && 'disable-search'].filter(Boolean).join(' '),
    onClick: _ => {
      _hooks_useHistoryAction__WEBPACK_IMPORTED_MODULE_6__["pushUrl"](_AppRouter__WEBPACK_IMPORTED_MODULE_7__["CustomRouter"].Index.href);
    },
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 93,
      columnNumber: 10
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/components/Text */ "./src/components/Text/index.jsx"),
    className: "search",
    value: inp,
    onChange: x => set_inp(x),
    onConfirm: x => _hooks_useSearchText__WEBPACK_IMPORTED_MODULE_5__["text"].set(x),
    readOnly: false,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 99,
      columnNumber: 5
    }
  }), inp ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/components/Icon */ "./src/components/Icon/index.jsx"),
    className: "bi-x-lg",
    onClick: _ => set_inp(''),
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 108,
      columnNumber: 9
    }
  }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/components/Icon */ "./src/components/Icon/index.jsx"),
    className: "bi-search",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 109,
      columnNumber: 9
    }
  }));
}
function SupportEditor(props) {
  const [isEditing, set_isEditing] = _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_4__["Editing"].use();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "editor-switch",
    onClick: _ => set_isEditing(!isEditing),
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 115,
      columnNumber: 10
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/components/Icon */ "./src/components/Icon/index.jsx"),
    className: isEditing ? 'bi-unlock-fill' : 'bi-lock-fill',
    isActive: isEditing ? true : false,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 116,
      columnNumber: 5
    }
  }));
}

/***/ }),

/***/ "./src/app/header/index.scss":
/*!***********************************!*\
  !*** ./src/app/header/index.scss ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/bootstrap.jsx":
/*!***************************!*\
  !*** ./src/bootstrap.jsx ***!
  \***************************/
/*! exports provided: init, renderToString */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderToString", function() { return renderToString; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./App */ "./src/App.jsx");
/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom/server */ "./node_modules/react-dom/server.js");
/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_dom_server__WEBPACK_IMPORTED_MODULE_2__);
var _jsxFileName = "/Users/chennima/Desktop/vercel-homepage/src/bootstrap.jsx";


async function init(payload) {
  var _app$r;
  const r = 'init';
  return (_App__WEBPACK_IMPORTED_MODULE_1__ === null || _App__WEBPACK_IMPORTED_MODULE_1__ === void 0 ? void 0 : (_app$r = _App__WEBPACK_IMPORTED_MODULE_1__[r]) === null || _app$r === void 0 ? void 0 : _app$r.call(_App__WEBPACK_IMPORTED_MODULE_1__, payload)) || null;
}

// server

function renderToString() {
  return react_dom_server__WEBPACK_IMPORTED_MODULE_2___default.a.renderToString(/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_App__WEBPACK_IMPORTED_MODULE_1__["default"], {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14,
      columnNumber: 32
    }
  }));
}

/***/ }),

/***/ "./src/components/AutoFixed/index.jsx":
/*!********************************************!*\
  !*** ./src/components/AutoFixed/index.jsx ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.scss */ "./src/components/AutoFixed/index.scss");
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_index_scss__WEBPACK_IMPORTED_MODULE_1__);
var _jsxFileName = "/Users/chennima/Desktop/vercel-homepage/src/components/AutoFixed/index.jsx";


/* harmony default export */ __webpack_exports__["default"] = (function (props) {
  const {
    children,
    className,
    marginTop = 0,
    scroller = document.scrollingElement,
    watchChildrenChange = []
  } = props;
  const wrapperRef = react__WEBPACK_IMPORTED_MODULE_0___default.a.useRef(null);
  const contentRef = react__WEBPACK_IMPORTED_MODULE_0___default.a.useRef(null);
  const [fixed, set_fixed] = react__WEBPACK_IMPORTED_MODULE_0___default.a.useState(false);
  const [height, set_height] = react__WEBPACK_IMPORTED_MODULE_0___default.a.useState(0);
  function getHeight() {
    return contentRef.current.offsetHeight;
  }
  function getTop() {
    return wrapperRef.current.offsetTop;
  }
  react__WEBPACK_IMPORTED_MODULE_0___default.a.useEffect(_ => {
    set_height(getHeight());
  }, [children]);
  react__WEBPACK_IMPORTED_MODULE_0___default.a.useEffect(_ => {
    const fn = _ => {
      const t = scroller.scrollTop;
      const isFixed = t >= getTop() - marginTop;
      if (isFixed === fixed) return;
      set_fixed(isFixed);
    };
    scroller.addEventListener('scroll', fn);
    fn();
    return _ => scroller.removeEventListener('scroll', fn);
  }, [fixed]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    style: height ? {
      height
    } : {},
    ref: wrapperRef,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35,
      columnNumber: 10
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    ref: contentRef,
    className: ['V_m4nog377_nents_AutoFixed_index', className, fixed && 'fixed'].filter(Boolean).join(' '),
    style: {
      top: fixed ? marginTop : 0
    },
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36,
      columnNumber: 5
    }
  }, children));
});

/***/ }),

/***/ "./src/components/AutoFixed/index.scss":
/*!*********************************************!*\
  !*** ./src/components/AutoFixed/index.scss ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/components/EditBox/index.jsx":
/*!******************************************!*\
  !*** ./src/components/EditBox/index.jsx ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_UseComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/components/UseComponent */ "./src/components/UseComponent/index.jsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.scss */ "./src/components/EditBox/index.scss");
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_index_scss__WEBPACK_IMPORTED_MODULE_2__);
var _jsxFileName = "/Users/chennima/Desktop/vercel-homepage/src/components/EditBox/index.jsx";



/* harmony default export */ __webpack_exports__["default"] = (function (props) {
  const {
    noMask = false,
    onDelete = null,
    onCreate = null,
    onEdit = null,
    isEditing = false,
    style = null,
    className = '',
    createText = ''
  } = props;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: ['V_m4nog377_nents_EditBox_index', className, noMask || 'mask', onDelete && 'deleteable', onCreate && 'createable', onEdit && 'editable'].filter(Boolean).join(' '),
    style: style,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14,
      columnNumber: 10
    }
  }, onCreate && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/components/Icon */ "./src/components/Icon/index.jsx"),
    className: "bi-plus-square-fill",
    isBtn: true,
    size: 'small',
    text: createText,
    onClick: onCreate,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 22,
      columnNumber: 18
    }
  }), onEdit && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/components/Icon */ "./src/components/Icon/index.jsx"),
    className: isEditing ? 'bi-unlock-fill' : 'bi-lock-fill',
    isBtn: true,
    isActive: isEditing ? true : false,
    size: 'small',
    onClick: onEdit,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 29,
      columnNumber: 16
    }
  }), onDelete && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/components/Icon */ "./src/components/Icon/index.jsx"),
    className: "bi-x-lg",
    isBtn: true,
    size: 'small',
    onClick: onDelete,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36,
      columnNumber: 18
    }
  }));
});

/***/ }),

/***/ "./src/components/EditBox/index.scss":
/*!*******************************************!*\
  !*** ./src/components/EditBox/index.scss ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/components/Expose/index.jsx":
/*!*****************************************!*\
  !*** ./src/components/Expose/index.jsx ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var intersection_observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! intersection-observer */ "./node_modules/intersection-observer/intersection-observer.js");
/* harmony import */ var intersection_observer__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(intersection_observer__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
var _jsxFileName = "/Users/chennima/Desktop/vercel-homepage/src/components/Expose/index.jsx";


/* harmony default export */ __webpack_exports__["default"] = (function (props) {
  const {
    onVisible,
    onInVisible,
    exposeOnce,
    className,
    children,
    option
  } = props;
  const wrapperRef = react__WEBPACK_IMPORTED_MODULE_1___default.a.useRef(null);
  react__WEBPACK_IMPORTED_MODULE_1___default.a.useEffect(_ => {
    const observer = new IntersectionObserver((entries, observer) => {
      if (!entries[0].isIntersecting) {
        onInVisible === null || onInVisible === void 0 ? void 0 : onInVisible();
      } else {
        onVisible === null || onVisible === void 0 ? void 0 : onVisible();
        if (exposeOnce) {
          observer.disconnect();
        }
      }
    }, option);
    observer.observe(wrapperRef.current);
    return _ => observer.disconnect();
  }, [onVisible, exposeOnce, onInVisible, option]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: className,
    ref: wrapperRef,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 27,
      columnNumber: 10
    }
  }, children);
});

/***/ }),

/***/ "./src/components/Icon/index.jsx":
/*!***************************************!*\
  !*** ./src/components/Icon/index.jsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.scss */ "./src/components/Icon/index.scss");
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_index_scss__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var bootstrap_icons_font_bootstrap_icons_min_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! bootstrap-icons/font/bootstrap-icons.min.css */ "./node_modules/bootstrap-icons/font/bootstrap-icons.min.css");
/* harmony import */ var bootstrap_icons_font_bootstrap_icons_min_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(bootstrap_icons_font_bootstrap_icons_min_css__WEBPACK_IMPORTED_MODULE_2__);
var _jsxFileName = "/Users/chennima/Desktop/vercel-homepage/src/components/Icon/index.jsx";



/* harmony default export */ __webpack_exports__["default"] = (function (props) {
  const {
    className = '',
    onClick = null,
    isBtn = false,
    isSimpleBtn = false,
    isActive = false,
    isDisabled = false,
    isRotating = false,
    text = '',
    size = 'normal'
  } = props;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    onClick: e => {
      if (isDisabled) return;
      onClick === null || onClick === void 0 ? void 0 : onClick(e);
    },
    className: ['V_m4nog377_nents_Icon_index', isBtn && 'btn', isSimpleBtn && 'simple-btn', isActive && 'active', isDisabled && 'disabled', isRotating && 'rotating', size === 'normal' && 'normal-size', size === 'small' && 'small-size', size === 'large' && 'large-size'].filter(Boolean).join(' '),
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16,
      columnNumber: 10
    }
  }, text && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
    className: "text",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 30,
      columnNumber: 14
    }
  }, text), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: 'bi ' + className,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31,
      columnNumber: 5
    }
  }));
});

/***/ }),

/***/ "./src/components/Icon/index.scss":
/*!****************************************!*\
  !*** ./src/components/Icon/index.scss ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/components/Link/index.jsx":
/*!***************************************!*\
  !*** ./src/components/Link/index.jsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hooks_useHistoryAction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/hooks/useHistoryAction */ "./src/hooks/useHistoryAction.js");
/* harmony import */ var _utils_url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/utils/url */ "./src/utils/url.js");
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./index.scss */ "./src/components/Link/index.scss");
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_index_scss__WEBPACK_IMPORTED_MODULE_3__);
var _jsxFileName = "/Users/chennima/Desktop/vercel-homepage/src/components/Link/index.jsx";




/* harmony default export */ __webpack_exports__["default"] = (function (props) {
  const {
    url: _url,
    params: _params,
    href: _href,
    target = '_self',
    children,
    className,
    onClick,
    ..._props
  } = props;
  let url, params, href;
  if (_href) {
    const {
      pathname,
      query
    } = Object(_utils_url__WEBPACK_IMPORTED_MODULE_2__["parseUrl"])(_href);
    href = _href;
    url = pathname;
    params = query;
  } else {
    params = typeof _params === 'function' ? _params() : _params;
    url = _url;
    href = Object(_utils_url__WEBPACK_IMPORTED_MODULE_2__["buildUrl"])(url, params);
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", Object.assign({
    href: href,
    target: target,
    className: [className, 'V_m4nog377_nents_Link_index'].filter(Boolean).join(' ')
  }, _props, {
    onClick: e => {
      e.preventDefault();
      onClick === null || onClick === void 0 ? void 0 : onClick(e);
      _hooks_useHistoryAction__WEBPACK_IMPORTED_MODULE_1__["pushUrl"](url, params);
    },
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 27,
      columnNumber: 10
    }
  }), children);
});

/***/ }),

/***/ "./src/components/Link/index.scss":
/*!****************************************!*\
  !*** ./src/components/Link/index.scss ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/components/Loading/index.jsx":
/*!******************************************!*\
  !*** ./src/components/Loading/index.jsx ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_UseComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/components/UseComponent */ "./src/components/UseComponent/index.jsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
var _jsxFileName = "/Users/chennima/Desktop/vercel-homepage/src/components/Loading/index.jsx";


/* harmony default export */ __webpack_exports__["default"] = (function (props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/components/Icon */ "./src/components/Icon/index.jsx"),
    className: "bi-sun",
    isRotating: true,
    size: "large",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 4,
      columnNumber: 10
    }
  });
});

/***/ }),

/***/ "./src/components/MarkedPad/components/PlayBtn/index.jsx":
/*!***************************************************************!*\
  !*** ./src/components/MarkedPad/components/PlayBtn/index.jsx ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_UseComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/components/UseComponent */ "./src/components/UseComponent/index.jsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.scss */ "./src/components/MarkedPad/components/PlayBtn/index.scss");
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_index_scss__WEBPACK_IMPORTED_MODULE_2__);
var _jsxFileName = "/Users/chennima/Desktop/vercel-homepage/src/components/MarkedPad/components/PlayBtn/index.jsx";



/* harmony default export */ __webpack_exports__["default"] = (function (props) {
  const {
    sources,
    className = ''
  } = props;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: 'V_m4nog377_nents_MarkedPad_components_PlayBtn_index ' + className,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7,
      columnNumber: 10
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/components/Icon */ "./src/components/Icon/index.jsx"),
    isSimpleBtn: true,
    isDisabled: !sources,
    className: "bi-play-fill",
    size: "small",
    onClick: _ => {
      if (!window.__SUPPORT_ESMODULE__) {
        alert('Emm.. your browser is too old to support this feature.. :(');
        return;
      }
      const url = URL.createObjectURL(new Blob([toHTML(sources)], {
        type: 'text/html'
      }));
      window.open(url);
    },
    text: 'Run',
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8,
      columnNumber: 5
    }
  }));
});
function toHTML(sources) {
  const tpl = "<!doctype html>\r\n<html>\r\n<head>\r\n  <meta charset='utf8' />\r\n</head>\r\n<script type=\"importmap\">\r\n  {\r\n    \"imports\": {\r\n      \"sass\": \"https://esm.sh/sass@1.69.5\",\r\n      \"babel\": \"https://esm.sh/@babel/standalone@7.25.8\"\r\n    }\r\n  }\r\n</script>\r\n<body>\r\n<script type=\"module\">\r\nif(location.href.indexOf('blob:')===0) {\r\n  URL.revokeObjectURL(location.href)\r\n}\r\n\r\nimport Babel from 'babel'\r\nimport * as Sass from 'sass'\r\n\r\nconst es_imports={\r\n  \"react\": \"https://esm.sh/react@16.10.1\",\r\n  \"react-dom\": \"https://esm.sh/react-dom@16.10.1\",\r\n}\r\nconst emptyImportLink=URL.createObjectURL(new Blob(['export default {}'], {type: 'text/javascript'}))\r\n\r\n\r\nconst sources=##SOURCE##\r\n\r\n\r\nsources.map(s=>{\r\n  if(['scss', 'css'].includes(s.type)) {\r\n    s.value=`\r\n    const css=document.createElement('style')\r\n    css.innerHTML=\\`${Sass.compileString(s.value).css.replace(/\\`/g, '\\\\\\`')}\\`\r\n    css.type='text/css'\r\n    document.body.appendChild(css)\r\n    `\r\n  }else if(['react', 'js'].includes(s.type)) {\r\n    s.value=Babel.transform(s.value, {\r\n      presets: ['react'],\r\n      plugins: [{\r\n        visitor: {\r\n          // https://babeljs.io/docs/babel-types#importdeclaration\r\n          ImportDeclaration(specifiers, source) {\r\n            const i=specifiers.node.source\r\n            const k=i.value.replace(/^\\.\\//, '')\r\n            i.value=es_imports[k] || emptyImportLink\r\n          },\r\n        }\r\n      }],\r\n    }).code\r\n  }\r\n  es_imports[s.filename]=URL.createObjectURL(new Blob([s.value], {type: 'text/javascript'}))\r\n  if(!s.main) return;\r\n  const t=document.createElement('script')\r\n  t.innerHTML=s.value\r\n  Object.assign(t, {type: 'module'})\r\n  document.querySelector('head').appendChild(t)\r\n});\r\n\r\n</script>\r\n</body>\r\n</html>\r\n";
  return tpl.replace(/##SOURCE##/, JSON.stringify(sources));
}

/***/ }),

/***/ "./src/components/MarkedPad/components/PlayBtn/index.scss":
/*!****************************************************************!*\
  !*** ./src/components/MarkedPad/components/PlayBtn/index.scss ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/components/MarkedPad/index.jsx":
/*!********************************************!*\
  !*** ./src/components/MarkedPad/index.jsx ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_UseComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/components/UseComponent */ "./src/components/UseComponent/index.jsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.scss */ "./src/components/MarkedPad/index.scss");
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_index_scss__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var marked_marked_min__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! marked/marked.min */ "./node_modules/marked/marked.min.js");
/* harmony import */ var marked_marked_min__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(marked_marked_min__WEBPACK_IMPORTED_MODULE_3__);
var _jsxFileName = "/Users/chennima/Desktop/vercel-homepage/src/components/MarkedPad/index.jsx";




marked_marked_min__WEBPACK_IMPORTED_MODULE_3___default.a.use({
  headerIds: false,
  mangle: false,
  slient: true
});
function parse(x) {
  x = x || '';
  const tokens = marked_marked_min__WEBPACK_IMPORTED_MODULE_3___default.a.lexer(x);
  let _tokens = [],
    _arr = [],
    _is_code = false;
  for (let token of tokens) {
    const _code = token.type === 'code';
    if (_code === _is_code) {
      _arr.push(token);
      continue;
    }
    if (_arr.length) {
      _tokens.push([_is_code, _arr]);
      _arr = [];
    }
    _is_code = _code;
    _arr.push(token);
  }
  if (_arr.length) _tokens.push([_is_code, _arr]);
  const codes = {};
  const _is = x => !['', '0', 'no', 'false', undefined].includes(x);
  return _tokens.map(([is_code, t], i) => {
    t.links = tokens.links;
    if (!is_code) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        key: i,
        dangerouslySetInnerHTML: {
          __html: marked_marked_min__WEBPACK_IMPORTED_MODULE_3___default.a.parser(t).trim()
        },
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 33,
          columnNumber: 14
        }
      });
    }
    const sources = [];
    let toolbar = false,
      play = false;
    for (let code of t) {
      const [lang, x] = code.lang.split(':');
      let attrs = x ? x.split(';').reduce((a, b) => {
        if (b = b.trim()) {
          const [k, v] = b.split('=');
          a[k] = v;
        }
        return a;
      }, {}) : {};
      if (x) toolbar = true;
      play = play || _is(attrs.main);
      attrs.language = lang;
      attrs.index = _is(attrs.index);
      attrs.main = _is(attrs.main);
      attrs.code = code.text.trim();
      const _filename = attrs.filename;
      if (!attrs.code && codes[_filename]) {
        Object.assign(attrs, codes[_filename]);
      }
      sources.push(attrs);
      if (attrs.code) codes[_filename] = attrs;
    }
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(CodePanel, {
      key: `${i}-${sources.length}`,
      codes: sources,
      toolbar: toolbar,
      play: play,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 59,
        columnNumber: 12
      }
    });
  });
}
function CodePanel(props) {
  const {
    codes,
    toolbar,
    play
  } = props;
  const [index, set_index] = react__WEBPACK_IMPORTED_MODULE_1___default.a.useState(_ => codes.reduce((a, b, i) => a || (b.index ? i : 0), 0));
  const code = codes[index];
  const codeRef = react__WEBPACK_IMPORTED_MODULE_1___default.a.useRef(null);
  react__WEBPACK_IMPORTED_MODULE_1___default.a.useEffect(_ => {
    var _window$hljs;
    if (!codeRef.current) return;
    codeRef.current.removeAttribute('data-highlighted');
    (_window$hljs = window.hljs) === null || _window$hljs === void 0 ? void 0 : _window$hljs.highlightElement(codeRef.current);
  }, [index, codes]);
  if (!code) return null;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "code-panel hljs",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 77,
      columnNumber: 10
    }
  }, toolbar && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "toolbar",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 78,
      columnNumber: 17
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "filename-tabs",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 79,
      columnNumber: 7
    }
  }, codes.map(({
    code,
    language,
    filename
  }, i) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    onClick: _ => set_index(i),
    key: filename,
    className: 'tab' + (i === index ? ' active' : ''),
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 80,
      columnNumber: 53
    }
  }, filename))), play && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! ./components/PlayBtn */ "./src/components/MarkedPad/components/PlayBtn/index.jsx"),
    className: "playbtn",
    sources: codes.map(x => ({
      type: x.type,
      value: x.code,
      filename: x.filename,
      main: x.main
    })),
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 86,
      columnNumber: 16
    }
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "code-board",
    key: code.filename || 'unknown',
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 93,
      columnNumber: 5
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("pre", {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 94,
      columnNumber: 7
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("code", {
    className: "hljs language-" + code.language,
    ref: codeRef,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 95,
      columnNumber: 9
    }
  }, code.code))));
}
/* harmony default export */ __webpack_exports__["default"] = (function (props) {
  const {
    enableInput = true,
    onChange,
    initialValue,
    parser
  } = props;
  const [inpVal, set_inpVal] = react__WEBPACK_IMPORTED_MODULE_1___default.a.useState(initialValue);
  const [markedVal, set_markedVal] = react__WEBPACK_IMPORTED_MODULE_1___default.a.useState(_ => parse(initialValue));
  const txtRef = react__WEBPACK_IMPORTED_MODULE_1___default.a.useRef(null);
  const markedRef = react__WEBPACK_IMPORTED_MODULE_1___default.a.useRef(null);
  const top = react__WEBPACK_IMPORTED_MODULE_1___default.a.useRef(0);
  react__WEBPACK_IMPORTED_MODULE_1___default.a.useEffect(_ => {
    const v = initialValue;
    if (v === inpVal) return;
    set_inpVal(v);
    set_markedVal(parse(v));
  }, [initialValue]);
  const output = parser ? parser(inpVal) : markedVal;
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.useMemo(_ => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: 'V_m4nog377_nents_MarkedPad_index' + (enableInput ? '' : ' readonly'),
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 114,
      columnNumber: 27
    }
  }, enableInput ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("textarea", {
    ref: txtRef,
    className: "box inp",
    value: inpVal,
    onChange: e => {
      const v = e.target.value;
      set_inpVal(v);
      set_markedVal(parse(v));
      onChange && onChange(v);
    },
    onScroll: e => {
      const nt = e.target.scrollTop;
      const v = top.current;
      top.current = nt;
      markedRef.current.scrollTop += nt - v;
    },
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 116,
      columnNumber: 7
    }
  }) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    onClick: _ => {
      txtRef.current && txtRef.current.focus();
    },
    className: "box marked",
    ref: markedRef,
    key: enableInput ? 'write' : 'read',
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 129,
      columnNumber: 5
    }
  }, output)), [inpVal, enableInput, output]);
});

/***/ }),

/***/ "./src/components/MarkedPad/index.scss":
/*!*********************************************!*\
  !*** ./src/components/MarkedPad/index.scss ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/components/Memo/index.jsx":
/*!***************************************!*\
  !*** ./src/components/Memo/index.jsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ __webpack_exports__["default"] = (function (props) {
  const {
    watches,
    children
  } = props;
  if (!Array.isArray(watches)) throw new Error('`watches` is invalid');
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.useMemo(_ => children, watches);
});

/***/ }),

/***/ "./src/components/Text/index.jsx":
/*!***************************************!*\
  !*** ./src/components/Text/index.jsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.scss */ "./src/components/Text/index.scss");
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_index_scss__WEBPACK_IMPORTED_MODULE_1__);
var _jsxFileName = "/Users/chennima/Desktop/vercel-homepage/src/components/Text/index.jsx";


/* harmony default export */ __webpack_exports__["default"] = (function (props) {
  const {
    value = '',
    readOnly,
    className = '',
    onChange,
    onConfirm,
    render
  } = props;
  const [text, set_text] = react__WEBPACK_IMPORTED_MODULE_0___default.a.useState(value);
  react__WEBPACK_IMPORTED_MODULE_0___default.a.useEffect(_ => {
    if (text !== value) set_text(value);
  }, [value]);
  return readOnly ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: 'V_m4nog377_nents_Text_index text ' + className,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10,
      columnNumber: 5
    }
  }, render ? render(text) : text) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
    className: 'V_m4nog377_nents_Text_index inputbox ' + className,
    onChange: e => {
      const v = e.target.value;
      set_text(v);
      onChange === null || onChange === void 0 ? void 0 : onChange(v);
    },
    onKeyPress: e => {
      if (e.keyCode === 13) {
        onConfirm === null || onConfirm === void 0 ? void 0 : onConfirm(e.target.value);
      }
    },
    value: text,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11,
      columnNumber: 5
    }
  });
});

/***/ }),

/***/ "./src/components/Text/index.scss":
/*!****************************************!*\
  !*** ./src/components/Text/index.scss ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/components/Toast/index.jsx":
/*!****************************************!*\
  !*** ./src/components/Toast/index.jsx ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),

/***/ "./src/components/UseComponent/index.jsx":
/*!***********************************************!*\
  !*** ./src/components/UseComponent/index.jsx ***!
  \***********************************************/
/*! exports provided: ErrorBoundary, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ErrorBoundary", function() { return ErrorBoundary; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/utils/base */ "./src/utils/base.js");
var _jsxFileName = "/Users/chennima/Desktop/vercel-homepage/src/components/UseComponent/index.jsx";


class ErrorBoundary extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }
  static setDefaultErrorUI(errorUI) {
    ErrorBoundary._errorUI = errorUI;
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error: error
    };
  }
  componentDidCatch(error, errorInfo) {
    console.log('ErrorBoundary=>', {
      error,
      errorInfo
    });
  }
  render() {
    const {
      children,
      errorComponent
    } = this.props;
    const {
      hasError,
      error
    } = this.state;
    if (hasError) {
      return errorComponent || ErrorBoundary._errorUI || null;
    }
    return children;
  }
}
ErrorBoundary._errorUI = null;
/* harmony default export */ __webpack_exports__["default"] = (function (props) {
  const {
    UseComponentSync: sync = false,
    UseComponentGetter: getter,
    UseComponentFailed: Failed = null,
    UseComponentLoading: Loading = null,
    UseComponentDelay: delay = 0,
    UseComponentRetry: retry = 5,
    ...customProps
  } = props;
  const _wrap = T => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ErrorBoundary, {
    errorComponent: Failed,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 43,
      columnNumber: 18
    }
  }, T);
  if (sync) {
    try {
      const T = getter().default;
      return _wrap(/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(T, Object.assign({}, customProps, {
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 47,
          columnNumber: 20
        }
      })));
    } catch (e) {
      return Failed;
    }
  }
  const [disp, set_disp] = react__WEBPACK_IMPORTED_MODULE_0___default.a.useState(Loading);
  react__WEBPACK_IMPORTED_MODULE_0___default.a.useEffect(_ => {
    ;
    (async _ => {
      if (delay) {
        await Object(_utils_base__WEBPACK_IMPORTED_MODULE_1__["sleep"])(delay);
      }
      try {
        for (let i = 0; i < retry; i++) {
          try {
            const T = (await getter()).default;
            set_disp(_wrap(/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(T, Object.assign({}, customProps, {
              __self: this,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 62,
                columnNumber: 28
              }
            }))));
            break;
          } catch (e) {
            await Object(_utils_base__WEBPACK_IMPORTED_MODULE_1__["sleep"])((1 << i) * 1e3);
          }
        }
      } catch (e) {
        console.log('UseComponentError ==>', e);
        set_disp(Failed);
      }
    })();
  }, [props]);
  return disp;
});

/***/ }),

/***/ "./src/hooks/useAppInfo.js":
/*!*********************************!*\
  !*** ./src/hooks/useAppInfo.js ***!
  \*********************************/
/*! exports provided: ReadOnly, HeaderText, HeaderLeftText, FooterText, Editing, JavascriptReady, IsChangingPage, useUniqueLoading, usePayload */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReadOnly", function() { return ReadOnly; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeaderText", function() { return HeaderText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeaderLeftText", function() { return HeaderLeftText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FooterText", function() { return FooterText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Editing", function() { return Editing; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JavascriptReady", function() { return JavascriptReady; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IsChangingPage", function() { return IsChangingPage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useUniqueLoading", function() { return useUniqueLoading; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "usePayload", function() { return usePayload; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hooks_useStore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/hooks/useStore */ "./src/hooks/useStore.js");


const ReadOnly = Object(_hooks_useStore__WEBPACK_IMPORTED_MODULE_1__["createStoreValue"])(true);
const HeaderText = Object(_hooks_useStore__WEBPACK_IMPORTED_MODULE_1__["createStoreValue"])(null);
const HeaderLeftText = Object(_hooks_useStore__WEBPACK_IMPORTED_MODULE_1__["createStoreValue"])(null);
const FooterText = Object(_hooks_useStore__WEBPACK_IMPORTED_MODULE_1__["createStoreValue"])(null);
const Editing = Object(_hooks_useStore__WEBPACK_IMPORTED_MODULE_1__["createStoreValue"])(false);
const JavascriptReady = Object(_hooks_useStore__WEBPACK_IMPORTED_MODULE_1__["createStoreValue"])(false);
const IsChangingPage = Object(_hooks_useStore__WEBPACK_IMPORTED_MODULE_1__["createStoreValue"])(false);
const funcs = new Map();
function useUniqueLoading(key, isDone, callback) {
  if (!isDone) funcs.set(key, callback);
  const clear = _ => funcs.delete(key);
  react__WEBPACK_IMPORTED_MODULE_0___default.a.useEffect(_ => clear, []);
  react__WEBPACK_IMPORTED_MODULE_0___default.a.useEffect(_ => {
    if (isDone) clear();
  }, [isDone]);
  const isFirst = [...funcs.values()][0] === callback;
  const emitAll = _ => {
    for (const fn of [...funcs.values()]) fn();
    funcs.clear();
  };
  return [isFirst, emitAll];
}
const payloads = {};
function usePayload(key) {
  if (!payloads[key]) {
    payloads[key] = Object(_hooks_useStore__WEBPACK_IMPORTED_MODULE_1__["createStoreValue"])(null);
  }
  return payloads[key];
}

/***/ }),

/***/ "./src/hooks/useContent.js":
/*!*********************************!*\
  !*** ./src/hooks/useContent.js ***!
  \*********************************/
/*! exports provided: Contents, Edits, ContentKwList, CreateList, DeleteList, SsrList, fetchList, fetchDetail, CREATE_ID, useContentById, doCreate, doDeleteId, doSaveById, initEditContentById, editContentValue, appendToKwList, useKwList, loadNextPage, updateContent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Contents", function() { return Contents; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Edits", function() { return Edits; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContentKwList", function() { return ContentKwList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateList", function() { return CreateList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeleteList", function() { return DeleteList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SsrList", function() { return SsrList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchList", function() { return fetchList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchDetail", function() { return fetchDetail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CREATE_ID", function() { return CREATE_ID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useContentById", function() { return useContentById; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doCreate", function() { return doCreate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doDeleteId", function() { return doDeleteId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doSaveById", function() { return doSaveById; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initEditContentById", function() { return initEditContentById; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "editContentValue", function() { return editContentValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "appendToKwList", function() { return appendToKwList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useKwList", function() { return useKwList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadNextPage", function() { return loadNextPage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateContent", function() { return updateContent; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hooks_useStore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/hooks/useStore */ "./src/hooks/useStore.js");
/* harmony import */ var _utils_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/utils/fetch */ "./src/utils/fetch.js");
/* harmony import */ var _useSearchText__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./useSearchText */ "./src/hooks/useSearchText.js");




/**
 Contents={
   [contentId]: StoreValue({title,. tags, ...}),
   ...
 }
 */
const Contents = {};
/**
 Edits={
   [contentId]: StoreValue({title,. tags, ...}),
   ...
 }
 */
const Edits = {};
/**
 ContentKwList={
   [keyword]: StoreValue({
     arr: [...contentIds],
     isEnd: false,
     nextParam: null,
     isFetching: false,
     isError: false,
   }),
   ...
 }
 */
const ContentKwList = {};
/**
 CreateList=[...contentIds]
 */
const CreateList = Object(_hooks_useStore__WEBPACK_IMPORTED_MODULE_1__["createStoreValue"])([]);
/**
 DeleteList=[...contentIds]
 */
const DeleteList = Object(_hooks_useStore__WEBPACK_IMPORTED_MODULE_1__["createStoreValue"])([]);
/**
 SsrList=[...contentIds]
 */
const SsrList = Object(_hooks_useStore__WEBPACK_IMPORTED_MODULE_1__["createStoreValue"])([]);
async function fetchList(searchText, param = null) {
  if (!param) {
    var _nextList;
    const [{
      id: lastValidId
    }, {
      list: nextList,
      isEnd
    }] = await Promise.all([Object(_utils_fetch__WEBPACK_IMPORTED_MODULE_2__["fetch"])('/content/getLastId', {
      searchText
    }, 'firstpage-lastid'), Object(_utils_fetch__WEBPACK_IMPORTED_MODULE_2__["fetch"])('/content/list', {
      id: -1,
      searchText
    }, 'firstpage-list')]);
    return {
      isEnd,
      nextList,
      nextParam: {
        lastValidId,
        id: (_nextList = nextList[nextList.length - 1]) === null || _nextList === void 0 ? void 0 : _nextList.id
      }
    };
  } else {
    var _nextList2;
    const {
      list: nextList,
      isEnd
    } = await Object(_utils_fetch__WEBPACK_IMPORTED_MODULE_2__["fetch"])('/content/list', {
      searchText,
      ...param
    });
    return {
      isEnd,
      nextList,
      nextParam: {
        lastValidId: param.lastValidId,
        id: ((_nextList2 = nextList[nextList.length - 1]) === null || _nextList2 === void 0 ? void 0 : _nextList2.id) || param.id
      }
    };
  }
}
async function fetchDetail(id) {
  return await Object(_utils_fetch__WEBPACK_IMPORTED_MODULE_2__["fetch"])('/content/detail', {
    id
  });
}
const CREATE_ID = 0;
const bak = (_ => {
  const key = 'contentBackup';
  const _read = _ => {
    try {
      return JSON.parse(localStorage.getItem(key)) || {};
    } catch (e) {}
    return {};
  };
  const _save = fn => {
    const s = _read();
    fn(s);
    try {
      localStorage.setItem(key, JSON.stringify(s));
    } catch (e) {}
  };
  const save = (id, o) => {
    _save(s => {
      s[id] = o;
    });
  };
  const remove = id => {
    _save(s => {
      delete s[id];
    });
  };
  const read = id => _read()[id];
  return {
    read,
    save,
    remove
  };
})();
function useContentById(id, editing = false) {
  const read = getContentById(id, false).useVal();
  const write = getContentById(id, true).useVal();
  return editing ? write : read;
}
async function doCreate() {
  const e = getContentById(CREATE_ID, true).val();
  if (!e) return;
  const {
    title,
    tags,
    content
  } = e;
  const {
    id,
    summary,
    create_at
  } = await Object(_utils_fetch__WEBPACK_IMPORTED_MODULE_2__["fetch"])('/content/create', {
    title,
    tags,
    content
  });
  updateContent({
    id,
    title,
    tags,
    content,
    summary,
    create_at
  });
  Edits[CREATE_ID].set(formatContent());
  CreateList.set([id, ...CreateList.val()]);
  bak.remove(CREATE_ID);
}
async function doDeleteId(id) {
  await Object(_utils_fetch__WEBPACK_IMPORTED_MODULE_2__["fetch"])('/content/delete', {
    id
  });
  delete Contents[id];
  delete Edits[id];
  DeleteList.set([...DeleteList.val(), id]);
  bak.remove(id);
}
async function doSaveById(id) {
  const e = getContentById(id, true).val();
  if (!e) return;
  const {
    title,
    tags,
    content
  } = e;
  const {
    summary
  } = await Object(_utils_fetch__WEBPACK_IMPORTED_MODULE_2__["fetch"])('/content/update', {
    id,
    title,
    tags,
    content
  });
  updateContent({
    id,
    title,
    tags,
    content,
    summary
  });
  bak.remove(id);
}
function initEditContentById(id) {
  Edits[id].set(formatContent(Object.assign({}, getContentById(id, false).val(), bak.read(id))));
}
function editContentValue(id, kvs) {
  const e = Edits[id];
  const v = {
    ...e.val(),
    ...kvs
  };
  e.set(v);
  bak.save(id, v);
}
function appendToKwList(kw, {
  nextList = [],
  ...param
}) {
  const curr = getContentKwListByKw(kw);
  const v = curr.val();
  curr.set(Object.assign({}, v, {
    ids: v.ids.concat(nextList.map(x => x.id)),
    ...param
  }));
  updateContents(nextList);
}
function useKwList(kw) {
  const createIds = CreateList.useVal();
  const deleteIds = DeleteList.useVal();
  const ssrIds = SsrList.useVal();
  const curr = getContentKwListByKw(kw).useVal();
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.useMemo(_ => {
    const ret = {
      ids: [],
      isEnd: curr.isEnd,
      isError: curr.isError,
      isFetching: curr.isFetching
    };
    for (let id of [...createIds, ...curr.ids]) {
      if (deleteIds.includes(id)) continue;
      ret.ids.push({
        id,
        isFromSsr: ssrIds.includes(id)
      });
    }
    return ret;
  }, [kw, createIds, deleteIds, ssrIds, curr]);
}
async function loadNextPage(kw) {
  const curr = getContentKwListByKw(kw);
  const v = curr.val();
  if (v.isFetching) return;
  v.isError = false;
  v.isFetching = true;
  curr.set({
    ...v
  });
  const update = {
    isFetching: false
  };
  try {
    Object.assign(update, await fetchList(kw, v.nextParam), {
      isError: false
    });
  } catch (e) {
    update.isError = true;
  }
  appendToKwList(kw, update);
}
function updateContent(a) {
  updateContents([a]);
}
function formatContent(c = null) {
  return {
    id: (c === null || c === void 0 ? void 0 : c.id) || CREATE_ID,
    title: (c === null || c === void 0 ? void 0 : c.title) || '',
    tags: (c === null || c === void 0 ? void 0 : c.tags) || '',
    content: (c === null || c === void 0 ? void 0 : c.content) || '',
    summary: (c === null || c === void 0 ? void 0 : c.summary) || '',
    create_at: (c === null || c === void 0 ? void 0 : c.create_at) || 0
  };
}
function updateContents(arr) {
  for (const {
    id,
    ...kvs
  } of arr) {
    if (!Contents[id]) {
      Contents[id] = Object(_hooks_useStore__WEBPACK_IMPORTED_MODULE_1__["createStoreValue"])({});
    }
    const v = Contents[id];
    v.set(formatContent({
      id,
      ...v.val(),
      ...kvs
    }));
  }
}
function getContentKwListByKw(kw) {
  if (!ContentKwList[kw]) {
    ContentKwList[kw] = Object(_hooks_useStore__WEBPACK_IMPORTED_MODULE_1__["createStoreValue"])({
      ids: [],
      nextParam: null,
      isEnd: false,
      isFetching: false,
      isError: false
    });
  }
  return ContentKwList[kw];
}
function getContentById(id, fromEdit = false) {
  const stor = fromEdit ? Edits : Contents;
  if (!stor[id]) stor[id] = Object(_hooks_useStore__WEBPACK_IMPORTED_MODULE_1__["createStoreValue"])(formatContent({
    id
  }));
  return stor[id];
}

/***/ }),

/***/ "./src/hooks/useHistoryAction.js":
/*!***************************************!*\
  !*** ./src/hooks/useHistoryAction.js ***!
  \***************************************/
/*! exports provided: pushUrl, replaceUrl, goBack, goForward, useActionTypeVal, useVal */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pushUrl", function() { return pushUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "replaceUrl", function() { return replaceUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "goBack", function() { return goBack; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "goForward", function() { return goForward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useActionTypeVal", function() { return useActionTypeVal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useVal", function() { return useVal; });
/* harmony import */ var _hooks_useStore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/hooks/useStore */ "./src/hooks/useStore.js");
/* harmony import */ var _utils_url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/utils/url */ "./src/utils/url.js");
/* harmony import */ var _utils_base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/utils/base */ "./src/utils/base.js");



const HISTORY_VERSION = Date.now();
const initActionType = {
  t: 0,
  isInit: true,
  isIn: false,
  isOut: false,
  isInReplace: false,
  version: HISTORY_VERSION,
  nextUrl: location.pathname + location.search
};
const actionType = Object(_hooks_useStore__WEBPACK_IMPORTED_MODULE_0__["createStoreValue"])(_ => {
  if (!Object(_utils_base__WEBPACK_IMPORTED_MODULE_2__["isNodeSide"])()) {
    window.addEventListener('popstate', e => {
      updateActionType(e.state || initActionType, false);
    }, false);
  }
  return initActionType;
});
function updateActionType(e, isNew) {
  const oldActionTypeVal = actionType.val();
  const isIn = isNew || e.t > oldActionTypeVal.t || HISTORY_VERSION !== e.version || e.t === initActionType.t;
  actionType.set({
    t: e.t,
    isInit: false,
    isIn,
    isOut: !isIn,
    isInReplace: e.action === 'replace',
    nextUrl: e.nextUrl
  });
}
function changeUrl(x, params, isReplace) {
  const e = {
    t: Date.now(),
    action: isReplace ? 'replace' : 'push',
    version: HISTORY_VERSION,
    nextUrl: Object(_utils_url__WEBPACK_IMPORTED_MODULE_1__["buildUrl"])(x, params)
  };
  if (e.nextUrl === actionType.val().nextUrl) return;
  history[isReplace ? 'replaceState' : 'pushState'](e, null, e.nextUrl);
  updateActionType(e, true);
}
function pushUrl(x, params) {
  changeUrl(x, params, false);
}
function replaceUrl(x, params) {
  changeUrl(x, params, true);
}
function goBack() {
  history.back();
}
function goForward() {
  history.forward();
}
function useActionTypeVal() {
  return actionType.use()[0];
}
function useVal() {
  return actionType.useVal();
}

/***/ }),

/***/ "./src/hooks/useSearchText.js":
/*!************************************!*\
  !*** ./src/hooks/useSearchText.js ***!
  \************************************/
/*! exports provided: text, useInput */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "text", function() { return text; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useInput", function() { return useInput; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/utils/url */ "./src/utils/url.js");
/* harmony import */ var _hooks_useStore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/hooks/useStore */ "./src/hooks/useStore.js");
/* harmony import */ var _useHistoryAction__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./useHistoryAction */ "./src/hooks/useHistoryAction.js");




const getKw = _ => {
  var _parseUrl$query;
  return ((_parseUrl$query = Object(_utils_url__WEBPACK_IMPORTED_MODULE_1__["parseUrl"])().query) === null || _parseUrl$query === void 0 ? void 0 : _parseUrl$query.s) || '';
};
const text = Object(_hooks_useStore__WEBPACK_IMPORTED_MODULE_2__["createStoreValue"])(getKw);
const input = Object(_hooks_useStore__WEBPACK_IMPORTED_MODULE_2__["createStoreValue"])(getKw);
function useInput() {
  const [inp, set_inp] = input.use();
  const [currText, set_currText] = text.use();
  const locKw = getKw();
  _useHistoryAction__WEBPACK_IMPORTED_MODULE_3__["useVal"]();
  react__WEBPACK_IMPORTED_MODULE_0___default.a.useEffect(_ => {
    const t = setTimeout(_ => text.set(inp), 200);
    return _ => clearTimeout(t);
  }, [inp]);
  react__WEBPACK_IMPORTED_MODULE_0___default.a.useEffect(_ => {
    if (currText !== inp) set_inp(currText);
  }, [currText]);
  react__WEBPACK_IMPORTED_MODULE_0___default.a.useEffect(_ => {
    if (locKw !== currText) set_currText(locKw);
  }, [locKw]);
  return [inp, set_inp];
}

/***/ }),

/***/ "./src/hooks/useStore.js":
/*!*******************************!*\
  !*** ./src/hooks/useStore.js ***!
  \*******************************/
/*! exports provided: createStoreValue */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createStoreValue", function() { return createStoreValue; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function createStoreValue(v0) {
  const ref = {
    val: typeof v0 === 'function' ? v0() : v0,
    funcs: new Set()
  };
  const e = {
    use: _ => {
      const {
        val,
        funcs
      } = ref;
      const [v, set_v] = react__WEBPACK_IMPORTED_MODULE_0___default.a.useState(val);
      react__WEBPACK_IMPORTED_MODULE_0___default.a.useEffect(_ => {
        funcs.add(set_v);
        return _ => {
          funcs.delete(set_v);
        };
      }, []);
      const update_v = nv => {
        ref.val = nv;
        for (const f of funcs) f(nv);
      };
      return [v, update_v];
    },
    set: v => {
      ref.val = v;
      for (let setter of ref.funcs) {
        setter(v);
      }
    },
    val: _ => ref.val
  };
  e.useVal = _ => e.use()[0];
  return e;
}

/***/ }),

/***/ "./src/services/AppInfo/index.jsx":
/*!****************************************!*\
  !*** ./src/services/AppInfo/index.jsx ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_UseComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/components/UseComponent */ "./src/components/UseComponent/index.jsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.scss */ "./src/services/AppInfo/index.scss");
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_index_scss__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_Toast__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/components/Toast */ "./src/components/Toast/index.jsx");
/* harmony import */ var _utils_fetch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/utils/fetch */ "./src/utils/fetch.js");
/* harmony import */ var _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/hooks/useAppInfo */ "./src/hooks/useAppInfo.js");
var _jsxFileName = "/Users/chennima/Desktop/vercel-homepage/src/services/AppInfo/index.jsx";






/* harmony default export */ __webpack_exports__["default"] = (function (props) {
  const isEditing = _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_5__["Editing"].useVal();
  const {
    textStore,
    action,
    className = '',
    parser = null
  } = props;
  const [text, set_text] = textStore.use();
  const [editing, set_editing] = react__WEBPACK_IMPORTED_MODULE_1___default.a.useState(false);
  const _fetchWithToast = async _ => {
    _components_Toast__WEBPACK_IMPORTED_MODULE_3__["default"].show('saving..');
    try {
      await Object(_utils_fetch__WEBPACK_IMPORTED_MODULE_4__["fetch"])(action, {
        text
      });
      _components_Toast__WEBPACK_IMPORTED_MODULE_3__["default"].show('saved');
    } catch (e) {
      _components_Toast__WEBPACK_IMPORTED_MODULE_3__["default"].show(e.message);
    }
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: ['V_m4nog377_ces_AppInfo_index', className].filter(Boolean).join(' '),
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 26,
      columnNumber: 10
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: 'markedpad ' + (editing ? 'editable' : ''),
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 27,
      columnNumber: 5
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/components/MarkedPad */ "./src/components/MarkedPad/index.jsx"),
    initialValue: text,
    onChange: set_text,
    enableInput: editing,
    parser: parser,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28,
      columnNumber: 7
    }
  })), isEditing && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/components/EditBox */ "./src/components/EditBox/index.jsx"),
    className: "btnbox",
    isEditing: editing,
    onEdit: _ => {
      set_editing(!editing);
      if (editing) {
        _fetchWithToast();
      }
    },
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35,
      columnNumber: 19
    }
  }));
});

/***/ }),

/***/ "./src/services/AppInfo/index.scss":
/*!*****************************************!*\
  !*** ./src/services/AppInfo/index.scss ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/services/Content/index.jsx":
/*!****************************************!*\
  !*** ./src/services/Content/index.jsx ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_UseComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/components/UseComponent */ "./src/components/UseComponent/index.jsx");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.scss */ "./src/services/Content/index.scss");
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_index_scss__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_base__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/utils/base */ "./src/utils/base.js");
/* harmony import */ var _components_Toast__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/components/Toast */ "./src/components/Toast/index.jsx");
/* harmony import */ var _utils_format__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/utils/format */ "./src/utils/format.js");
/* harmony import */ var _utils_color__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/utils/color */ "./src/utils/color.js");
/* harmony import */ var _hooks_useHistoryAction__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/hooks/useHistoryAction */ "./src/hooks/useHistoryAction.js");
/* harmony import */ var _hooks_useContent__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/hooks/useContent */ "./src/hooks/useContent.js");
/* harmony import */ var _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/hooks/useAppInfo */ "./src/hooks/useAppInfo.js");
/* harmony import */ var _hooks_useSearchText__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/hooks/useSearchText */ "./src/hooks/useSearchText.js");
/* harmony import */ var _AppRouter__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @/AppRouter */ "./src/AppRouter.js");
/* harmony import */ var _components_Link__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @/components/Link */ "./src/components/Link/index.jsx");
var _jsxFileName = "/Users/chennima/Desktop/vercel-homepage/src/services/Content/index.jsx";













async function fetchWithToast([begin, done], task, cb) {
  _components_Toast__WEBPACK_IMPORTED_MODULE_4__["default"].show(begin);
  try {
    await task;
    _components_Toast__WEBPACK_IMPORTED_MODULE_4__["default"].show(done);
    cb === null || cb === void 0 ? void 0 : cb();
  } catch (e) {
    _components_Toast__WEBPACK_IMPORTED_MODULE_4__["default"].show(e.message);
  }
}
/* harmony default export */ __webpack_exports__["default"] = (function (props) {
  const {
    isSmallView,
    isDetailView,
    isCreateView,
    displayLoading
  } = props;
  const id = isCreateView ? _hooks_useContent__WEBPACK_IMPORTED_MODULE_8__["CREATE_ID"] : props.id;
  Object(_utils_base__WEBPACK_IMPORTED_MODULE_3__["assert"])(typeof id === 'number');
  const isEditing = _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_9__["Editing"].useVal();
  const [editing, set_editing] = react__WEBPACK_IMPORTED_MODULE_1___default.a.useState(false);
  react__WEBPACK_IMPORTED_MODULE_1___default.a.useEffect(_ => {
    if (isCreateView) set_editing(true);
  }, []);
  react__WEBPACK_IMPORTED_MODULE_1___default.a.useEffect(_ => {
    if (!editing) return;
    _hooks_useContent__WEBPACK_IMPORTED_MODULE_8__["initEditContentById"](id);
  }, [editing]);
  const detail = _hooks_useContent__WEBPACK_IMPORTED_MODULE_8__["useContentById"](id, editing);
  function edit(kv) {
    _hooks_useContent__WEBPACK_IMPORTED_MODULE_8__["editContentValue"](id, kv);
  }
  const detailCard = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: ['V_m4nog377_ces_Content_index', isCreateView && 'new', isDetailView && 'detail', isSmallView && 'small'].filter(Boolean).join(' '),
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 41,
      columnNumber: 20
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: 'title-line ' + (editing ? 'editing' : 'readonly'),
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 47,
      columnNumber: 5
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "left",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 48,
      columnNumber: 7
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "meta",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 49,
      columnNumber: 9
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/components/Text */ "./src/components/Text/index.jsx"),
    readOnly: !editing,
    value: detail.title,
    onChange: title => edit({
      title
    }),
    className: "title",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 50,
      columnNumber: 11
    }
  }), !editing && detail.create_at ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("span", {
    className: "date",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 57,
      columnNumber: 13
    }
  }, Object(_utils_format__WEBPACK_IMPORTED_MODULE_5__["time2str"])(detail.create_at)) : null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/components/Text */ "./src/components/Text/index.jsx"),
    readOnly: !editing,
    value: detail.tags,
    className: "tags",
    onChange: value => {
      edit({
        tags: value.split(',').map(x => x.trim()).join(', ')
      });
    },
    render: x => {
      return x.split(',').map(v => {
        if (!v) return null;
        v = v.trim();
        const s = 'tag: ' + v;
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_Link__WEBPACK_IMPORTED_MODULE_12__["default"], {
          className: "tag",
          key: v,
          onClick: _ => _hooks_useSearchText__WEBPACK_IMPORTED_MODULE_10__["text"].set(s),
          url: _AppRouter__WEBPACK_IMPORTED_MODULE_11__["CustomRouter"].Index.href,
          params: {
            s
          },
          style: {
            backgroundColor: Object(_utils_color__WEBPACK_IMPORTED_MODULE_6__["str2color"])(v)
          },
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 73,
            columnNumber: 22
          }
        }, v);
      });
    },
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 61,
      columnNumber: 9
    }
  })), isEditing && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/components/EditBox */ "./src/components/EditBox/index.jsx"),
    className: "btns",
    isEditing: editing,
    onEdit: isSmallView ? null : _ => {
      if (isCreateView) {
        fetchWithToast(['saving..', 'saved'], _hooks_useContent__WEBPACK_IMPORTED_MODULE_8__["doCreate"](), _ => {
          _hooks_useHistoryAction__WEBPACK_IMPORTED_MODULE_7__["replaceUrl"](_AppRouter__WEBPACK_IMPORTED_MODULE_11__["CustomRouter"].Index.href);
        });
      } else {
        set_editing(!editing);
        if (editing) {
          fetchWithToast(['saving..', 'saved'], _hooks_useContent__WEBPACK_IMPORTED_MODULE_8__["doSaveById"](id));
        }
      }
    },
    onDelete: _ => {
      if (isCreateView) {
        _hooks_useHistoryAction__WEBPACK_IMPORTED_MODULE_7__["goBack"]();
        return;
      }
      if (editing) {
        set_editing(false);
      } else {
        if (!confirm('delete it?')) return;
        fetchWithToast(['deleting..', 'deleted'], _hooks_useContent__WEBPACK_IMPORTED_MODULE_8__["doDeleteId"](id), _ => {
          if (isDetailView) {
            _hooks_useHistoryAction__WEBPACK_IMPORTED_MODULE_7__["pushUrl"]('/');
          }
        });
      }
    },
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 85,
      columnNumber: 21
    }
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: 'markedpad ' + (editing ? '' : 'readmode'),
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 118,
      columnNumber: 5
    }
  }, displayLoading ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/components/Loading */ "./src/components/Loading/index.jsx"),
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 121,
      columnNumber: 11
    }
  }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_UseComponent__WEBPACK_IMPORTED_MODULE_0__["default"], {
    UseComponentSync: true,
    UseComponentGetter: _ => __webpack_require__(/*! @/components/MarkedPad */ "./src/components/MarkedPad/index.jsx"),
    initialValue: isSmallView ? detail.summary : detail.content,
    onChange: nextContent => edit({
      content: nextContent
    }),
    enableInput: editing,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 122,
      columnNumber: 11
    }
  }), isSmallView && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "mask",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 128,
      columnNumber: 23
    }
  })));
  if (isSmallView && !editing) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components_Link__WEBPACK_IMPORTED_MODULE_12__["default"], {
      url: _AppRouter__WEBPACK_IMPORTED_MODULE_11__["CustomRouter"].Detail.href,
      params: _ => ({
        id,
        s: _hooks_useSearchText__WEBPACK_IMPORTED_MODULE_10__["text"].val()
      }),
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 132,
        columnNumber: 12
      }
    }, detailCard);
  }
  return detailCard;
});

/***/ }),

/***/ "./src/services/Content/index.scss":
/*!*****************************************!*\
  !*** ./src/services/Content/index.scss ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/services/FadeView/index.jsx":
/*!*****************************************!*\
  !*** ./src/services/FadeView/index.jsx ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.scss */ "./src/services/FadeView/index.scss");
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_index_scss__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _hooks_useHistoryAction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/hooks/useHistoryAction */ "./src/hooks/useHistoryAction.js");
/* harmony import */ var _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/hooks/useAppInfo */ "./src/hooks/useAppInfo.js");
/* harmony import */ var _utils_base__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/utils/base */ "./src/utils/base.js");
/* harmony import */ var _utils_cache__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/utils/cache */ "./src/utils/cache.js");
var _jsxFileName = "/Users/chennima/Desktop/vercel-homepage/src/services/FadeView/index.jsx";






/* harmony default export */ __webpack_exports__["default"] = (function (props) {
  const {
    render,
    classNames = {
      base: 'fade',
      hide: 'hide',
      finish: 'fade-center',
      newIn: 'fade-right-hide',
      newOut: 'fade-right-hide',
      oldIn: 'fade-left-hide',
      oldOut: 'fade-left-hide'
    },
    duration = 160
  } = props;
  const actionType = _hooks_useHistoryAction__WEBPACK_IMPORTED_MODULE_2__["useVal"]();
  const pages = react__WEBPACK_IMPORTED_MODULE_0___default.a.useRef({
    arr: [],
    cur: 0
  }).current;
  if (!pages.arr.length) pages.arr.push(render());
  const [pageInfo, set_pageInfo] = react__WEBPACK_IMPORTED_MODULE_0___default.a.useState(_ => {
    const [page, zIndex] = pages.arr[pages.cur];
    return {
      page,
      isForward: false,
      isInit: true,
      zIndex
    };
  });
  react__WEBPACK_IMPORTED_MODULE_0___default.a.useEffect(_ => {
    const {
      isInit,
      isIn,
      isOut,
      isInReplace
    } = actionType;
    if (isIn) {
      if (!isInReplace) ++pages.cur;
      pages.arr[pages.cur] = render();
    } else if (isOut) {
      --pages.cur;
    }
    let _isOut = isOut;
    const [page, zIndex] = pages.arr[pages.cur];
    if (zIndex !== pageInfo.zIndex) {
      _isOut = zIndex < pageInfo.zIndex;
    }
    set_pageInfo({
      page,
      isForward: !_isOut,
      isInit: false,
      zIndex
    });
  }, [actionType]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FadeView, Object.assign({}, pageInfo, {
    classNames: classNames,
    duration: duration,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 53,
      columnNumber: 10
    }
  }));
});
function getAppScrollTop() {
  if (document.querySelector) return document.querySelector('.app').scrollTop || 0;
  return 0;
}
function setAppScrollTop(x) {
  if (document.querySelector) document.querySelector('.app').scrollTop = x;
}
function FadeView(props) {
  const {
    page,
    isForward,
    isInit,
    classNames,
    duration
  } = props;
  const [pages, set_pages] = react__WEBPACK_IMPORTED_MODULE_0___default.a.useState([{
    page,
    create: Date.now(),
    className: classNames.finish,
    scrollTop: getAppScrollTop()
  }]);
  const lock = react__WEBPACK_IMPORTED_MODULE_0___default.a.useRef({
    locked: false,
    nextPage: null
  }).current;
  react__WEBPACK_IMPORTED_MODULE_0___default.a.useEffect(_ => {
    if (isInit) return;
    if (lock.locked) {
      lock.nextPage = page;
      return;
    }
    const play = async page => {
      _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_3__["IsChangingPage"].set(true);
      lock.locked = true;
      const _curr = pages.find(x => x.className === classNames.finish);
      const _next = Object(_utils_cache__WEBPACK_IMPORTED_MODULE_5__["autoCleanList"])(pages, x => x.page === page, _ => ({
        page,
        create: Date.now()
      }));
      _next.className = isForward ? classNames.newIn : classNames.oldIn;
      _curr.className = isForward ? classNames.oldOut : classNames.newOut;
      _curr.scrollTop = getAppScrollTop();
      set_pages([...pages]);
      await Object(_utils_base__WEBPACK_IMPORTED_MODULE_4__["sleep"])(duration);
      _next.className = classNames.finish;
      _curr.className = classNames.hide;
      set_pages([...pages]);
      lock.locked = false;
      if (lock.nextPage === page) lock.nextPage = null;
      if (lock.nextPage) {
        play(lock.nextPage);
        lock.nextPage = null;
      } else {
        setAppScrollTop(_next.scrollTop);
      }
      _hooks_useAppInfo__WEBPACK_IMPORTED_MODULE_3__["IsChangingPage"].set(false);
    };
    play(page);
  }, [page]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "V_m4nog377_ces_FadeView_index",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 113,
      columnNumber: 10
    }
  }, pages.map(({
    page,
    className,
    create
  }) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    key: create,
    className: classNames.base + ' ' + className,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 115,
      columnNumber: 46
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "container",
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 118,
      columnNumber: 9
    }
  }, page))));
}

/***/ }),

/***/ "./src/services/FadeView/index.scss":
/*!******************************************!*\
  !*** ./src/services/FadeView/index.scss ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/utils/base.js":
/*!***************************!*\
  !*** ./src/utils/base.js ***!
  \***************************/
/*! exports provided: withResolvers, sleep, isNodeSide, useVar, assert */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withResolvers", function() { return withResolvers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sleep", function() { return sleep; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isNodeSide", function() { return isNodeSide; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useVar", function() { return useVar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "assert", function() { return assert; });
function withResolvers() {
  let resolve, reject;
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return {
    promise,
    resolve,
    reject
  };
}
// @csrOnlyFunction
function sleep(t) {
  (x => {
    const e = new Error(x);
    console.log(e.stack);
    throw e;
  })("This function should not be called in Server Side Render.");
  return new Promise(r => setTimeout(r, t));
}
function isNodeSide() {
  return window.constructor === Object;
}
const csrWindow = {};
const _useVarKey = Symbol();
function useVar(key, initialValue = {}) {
  const _window = isNodeSide() ? (_ => {
    window._windowObject = window._windowObject || {};
    return window._windowObject;
  })() : csrWindow;
  _window[_useVarKey] = _window[_useVarKey] || {};
  return _window[_useVarKey][key] = _window[_useVarKey][key] || (any => {
    if (typeof any === 'function') {
      return any();
    } else {
      return any;
    }
  })(initialValue);
}
function assert(x) {
  if (!x) throw new Error(`Uncaught AssertionError [ERR_ASSERTION]: ${x} == true`);
}

/***/ }),

/***/ "./src/utils/cache.js":
/*!****************************!*\
  !*** ./src/utils/cache.js ***!
  \****************************/
/*! exports provided: autoCleanList */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "autoCleanList", function() { return autoCleanList; });
function autoCleanList(arr, visit, create, MAX_LEN = 5, MAX_GC_PERCENTANGE = .6) {
  let find = null;
  for (let i = arr.length; i--;) {
    if (!visit(arr[i])) continue;
    find = arr.splice(i, 1)[0];
    break;
  }
  if (!find) find = create();
  arr.push(find);
  if (Math.random() < MAX_GC_PERCENTANGE && arr.length > MAX_LEN) {
    arr.splice(0, arr.length - MAX_LEN);
  }
  return find;
}

/***/ }),

/***/ "./src/utils/color.js":
/*!****************************!*\
  !*** ./src/utils/color.js ***!
  \****************************/
/*! exports provided: str2color */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "str2color", function() { return str2color; });
function str2ratio(x) {
  let p = 0,
    n = [341, 170],
    i = 1;
  for (let c of x) {
    let o = c.charCodeAt(0);
    p = p + (o | n[i++ % 2]);
    p = p & 0xff;
  }
  return p / 0xff;
}
function ratio2color(r) {
  const colors = ['#ff0000', '#f300ff', '#0000ff', '#006fff', '#00f7ff', '#00ff00', '#ff9400', '#ff0000'];
  const v = r * (colors.length - 2),
    b = Math.floor(v);
  return mixcolor(colors[b], v - Math.floor(v), colors[b + 1]);
}
function mixcolor(c1, r, c2) {
  const r1 = r,
    r2 = 1 - r;
  let p = '#';
  for (let i = 0; i < 3; i++) {
    const b1 = parseInt(c1.substr(1 + i * 2, 2), 16),
      e1 = parseInt(c2.substr(1 + i * 2, 2), 16);
    const a = Math.round(b1 * r1 + e1 * r2).toString(16);
    p += a.length < 2 ? '0' + a : a;
  }
  return p;
}
function str2color(x) {
  return mixcolor(ratio2color(str2ratio(x)), .3, '#ffffff');
}

/***/ }),

/***/ "./src/utils/fetch.js":
/*!****************************!*\
  !*** ./src/utils/fetch.js ***!
  \****************************/
/*! exports provided: fetch */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetch", function() { return fetch; });
async function _fetch(...e) {
  return ServerFetch(...e);
}
async function fetch(action, argv, key) {
  try {
    const o = await _fetch(action, {
      body: argv || {}
    }, key);
    if (o.responseJSON.error) throw new Error(o.responseJSON.error);
    return o.responseJSON.data;
  } catch (e) {
    throw e;
  }
}

/***/ }),

/***/ "./src/utils/format.js":
/*!*****************************!*\
  !*** ./src/utils/format.js ***!
  \*****************************/
/*! exports provided: time2str */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "time2str", function() { return time2str; });
function time2str(x) {
  const v = new Date();
  v.setTime(x);
  const [y, m, d, ...t] = [v.getFullYear(), v.getMonth() + 1, v.getDate(), v.getHours(), v.getMinutes()
  // v.getSeconds(),
  ].map(x => x < 10 ? '0' + x : x);
  return [y, m, d].join('/') + ' ' + t.join(':');
}

/***/ }),

/***/ "./src/utils/url.js":
/*!**************************!*\
  !*** ./src/utils/url.js ***!
  \**************************/
/*! exports provided: buildUrl, parseUrl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buildUrl", function() { return buildUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseUrl", function() { return parseUrl; });
function buildUrl(x, params = {}) {
  let r = [];
  for (let k in params) {
    r.push(k + '=' + encodeURIComponent(params[k]));
  }
  if (x.indexOf('?') === -1) {
    x += '?';
  } else if (!x.endsWith('&')) {
    x += '&';
  }
  x += r.join('&');
  return x.replace(/\?$/, '');
}
function parseUrl(x) {
  x = x || location.href;
  const ret = {
    query: {},
    pathname: null
  };
  try {
    ret.pathname = x.replace(/^((https?:)?\/\/[^/]+)|\?.+/g, '');
    const r = x.indexOf('?');
    if (r < 0) throw 1;
    for (let v of x.substr(r + 1).split('&')) {
      const [a, b] = v.split('=').map(x => decodeURIComponent(x));
      ret.query[a] = b;
    }
  } catch (e) {}
  return ret;
}

/***/ }),

/***/ 0:
/*!*****************************************************************************************************************!*\
  !*** multi (webpack)-dev-server/client?http://0.0.0.0 (webpack)/hot/dev-server.js ./build/../src/bootstrap.jsx ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /Users/chennima/Desktop/vercel-homepage/node_modules/webpack-dev-server/client/index.js?http://0.0.0.0 */"./node_modules/webpack-dev-server/client/index.js?http://0.0.0.0");
__webpack_require__(/*! /Users/chennima/Desktop/vercel-homepage/node_modules/webpack/hot/dev-server.js */"./node_modules/webpack/hot/dev-server.js");
module.exports = __webpack_require__(/*! /Users/chennima/Desktop/vercel-homepage/build/../src/bootstrap.jsx */"./src/bootstrap.jsx");


/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ })

/******/ });