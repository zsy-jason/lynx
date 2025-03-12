/** build time: Wed, 12 Mar 2025 03:39:38 GMT, commit: 12a3fea3c45c7c6bc2f77b542536570423dba9a9 */
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true,
  configurable: true, writable: true, value }) : obj[key] = value;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports,
    mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(
          from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(
  mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod,
    enumerable: true }) : target,
    mod
  ));
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // ../lynx-promise/src/core.js
  var require_core = __commonJS({
    "../lynx-promise/src/core.js"(exports, module2) {
      "use strict";
      function noop2() {
      }
      var LAST_ERROR = null;
      var IS_ERROR = {};
      function getThen(obj) {
        try {
          return obj.then;
        } catch (ex) {
          LAST_ERROR = ex;
          return IS_ERROR;
        }
      }
      function tryCallOne(fn, a) {
        try {
          return fn(a);
        } catch (ex) {
          LAST_ERROR = ex;
          return IS_ERROR;
        }
      }
      function tryCallTwo(fn, a, b) {
        try {
          fn(a, b);
        } catch (ex) {
          LAST_ERROR = ex;
          return IS_ERROR;
        }
      }
      function trimStack(stack) {
        if (!stack) {
          return "";
        }
        const index = stack.indexOf("\n");
        if (index === -1) {
          return stack;
        }
        return stack.substring(index + 1);
      }
      module2.exports = (opt) => {
        var nextTick = opt.nextTick;
        function Promise2(fn) {
          this.__createStack = trimStack(new Error("Promise creation stack").stack);
          if (typeof this !== "object") {
            throw new TypeError("Promises must be constructed via new");
          }
          if (typeof fn !== "function") {
            throw new TypeError("Promise constructor's argument is not a functio\
n");
          }
          this._deferredState = 0;
          this._state = 0;
          this._value = null;
          this._deferreds = null;
          if (fn === noop2)
            return;
          doResolve(fn, this);
        }
        Promise2._onHandle = null;
        Promise2._onReject = null;
        Promise2._noop = noop2;
        Promise2.prototype.then = function(onFulfilled, onRejected) {
          if (this.constructor !== Promise2) {
            return safeThen(this, onFulfilled, onRejected);
          }
          var res = new Promise2(noop2);
          handle(this, new Handler(onFulfilled, onRejected, res));
          return res;
        };
        function safeThen(self, onFulfilled, onRejected) {
          return new self.constructor(function(resolve2, reject2) {
            var res = new Promise2(noop2);
            res.then(resolve2, reject2);
            handle(self, new Handler(onFulfilled, onRejected, res));
          });
        }
        function handle(self, deferred) {
          while (self._state === 3) {
            self = self._value;
          }
          if (Promise2._onHandle) {
            Promise2._onHandle(self);
          }
          if (self._state === 0) {
            if (self._deferredState === 0) {
              self._deferredState = 1;
              self._deferreds = deferred;
              return;
            }
            if (self._deferredState === 1) {
              self._deferredState = 2;
              self._deferreds = [self._deferreds, deferred];
              return;
            }
            self._deferreds.push(deferred);
            return;
          }
          handleResolved(self, deferred);
        }
        function handleResolved(self, deferred) {
          nextTick(function() {
            var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
            if (cb === null) {
              if (self._state === 1) {
                resolve(deferred.promise, self._value);
              } else {
                reject(deferred.promise, self._value);
              }
              return;
            }
            var ret = tryCallOne(cb, self._value);
            if (ret === IS_ERROR) {
              reject(deferred.promise, LAST_ERROR);
            } else {
              resolve(deferred.promise, ret);
            }
          });
        }
        function resolve(self, newValue) {
          if (newValue === self) {
            return reject(self, new TypeError("A promise cannot be resolved with\
 itself."));
          }
          if (newValue && (typeof newValue === "object" || typeof newValue === "\
function")) {
            var then = getThen(newValue);
            if (then === IS_ERROR) {
              return reject(self, LAST_ERROR);
            }
            if (then === self.then && newValue instanceof Promise2) {
              self._state = 3;
              self._value = newValue;
              finale(self);
              return;
            } else if (typeof then === "function") {
              doResolve(then.bind(newValue), self);
              return;
            }
          }
          self._state = 1;
          self._value = newValue;
          finale(self);
        }
        function reject(self, newValue) {
          self._state = 2;
          self._value = newValue;
          if (Promise2._onReject) {
            Promise2._onReject(self, newValue);
          }
          finale(self);
        }
        function finale(self) {
          if (self._deferredState === 1) {
            handle(self, self._deferreds);
            self._deferreds = null;
          }
          if (self._deferredState === 2) {
            for (var i = 0; i < self._deferreds.length; i++) {
              handle(self, self._deferreds[i]);
            }
            self._deferreds = null;
          }
        }
        function Handler(onFulfilled, onRejected, promise) {
          this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
          this.onRejected = typeof onRejected === "function" ? onRejected : null;
          this.promise = promise;
        }
        function doResolve(fn, promise) {
          var done = false;
          var res = tryCallTwo(
            fn,
            function(value) {
              if (done)
                return;
              done = true;
              resolve(promise, value);
            },
            function(reason) {
              if (done)
                return;
              done = true;
              reject(promise, reason);
            }
          );
          if (!done && res === IS_ERROR) {
            done = true;
            reject(promise, LAST_ERROR);
          }
        }
        return Promise2;
      };
    }
  });

  // ../lynx-promise/src/es6-extensions.js
  var require_es6_extensions = __commonJS({
    "../lynx-promise/src/es6-extensions.js"(exports, module2) {
      "use strict";
      module2.exports = (Promise2) => {
        var TRUE = valuePromise(true);
        var FALSE = valuePromise(false);
        var NULL = valuePromise(null);
        var UNDEFINED = valuePromise(void 0);
        var ZERO = valuePromise(0);
        var EMPTYSTRING = valuePromise("");
        function valuePromise(value) {
          var p = new Promise2(Promise2._noop);
          p._state = 1;
          p._value = value;
          return p;
        }
        Promise2.resolve = function(value) {
          if (value instanceof Promise2)
            return value;
          if (value === null)
            return NULL;
          if (value === void 0)
            return UNDEFINED;
          if (value === true)
            return TRUE;
          if (value === false)
            return FALSE;
          if (value === 0)
            return ZERO;
          if (value === "")
            return EMPTYSTRING;
          if (typeof value === "object" || typeof value === "function") {
            try {
              var then = value.then;
              if (typeof then === "function") {
                return new Promise2(then.bind(value));
              }
            } catch (ex) {
              return new Promise2(function(resolve, reject) {
                reject(ex);
              });
            }
          }
          return valuePromise(value);
        };
        var iterableToArray = function(iterable) {
          if (typeof Array.from === "function") {
            iterableToArray = Array.from;
            return Array.from(iterable);
          }
          iterableToArray = function(x) {
            return Array.prototype.slice.call(x);
          };
          return Array.prototype.slice.call(iterable);
        };
        Promise2.all = function(arr) {
          var args = iterableToArray(arr);
          return new Promise2(function(resolve, reject) {
            if (args.length === 0)
              return resolve([]);
            var remaining = args.length;
            function res(i2, val) {
              if (val && (typeof val === "object" || typeof val === "function")) {
                if (val instanceof Promise2 && val.then === Promise2.prototype.then) {
                  while (val._state === 3) {
                    val = val._value;
                  }
                  if (val._state === 1)
                    return res(i2, val._value);
                  if (val._state === 2)
                    reject(val._value);
                  val.then(function(val2) {
                    res(i2, val2);
                  }, reject);
                  return;
                } else {
                  var then = val.then;
                  if (typeof then === "function") {
                    var p = new Promise2(then.bind(val));
                    p.then(function(val2) {
                      res(i2, val2);
                    }, reject);
                    return;
                  }
                }
              }
              args[i2] = val;
              if (--remaining === 0) {
                resolve(args);
              }
            }
            for (var i = 0; i < args.length; i++) {
              res(i, args[i]);
            }
          });
        };
        Promise2.reject = function(value) {
          return new Promise2(function(resolve, reject) {
            reject(value);
          });
        };
        Promise2.race = function(values) {
          return new Promise2(function(resolve, reject) {
            iterableToArray(values).forEach(function(value) {
              Promise2.resolve(value).then(resolve, reject);
            });
          });
        };
        Promise2.prototype["catch"] = function(onRejected) {
          return this.then(null, onRejected);
        };
        Promise2.prototype.done = function(onFulfilled, onRejected) {
          var self = arguments.length ? this.then.apply(this, arguments) : this;
          self.then(null, function(err) {
            setTimeout(function() {
              throw err;
            }, 0);
          });
        };
        Promise2.prototype.finally = function(f) {
          return this.then(
            function(value) {
              return Promise2.resolve(f()).then(function() {
                return value;
              });
            },
            function(err) {
              return Promise2.resolve(f()).then(function() {
                throw err;
              });
            }
          );
        };
        return Promise2;
      };
    }
  });

  // ../lynx-promise/src/rejection-tracking.js
  var require_rejection_tracking = __commonJS({
    "../lynx-promise/src/rejection-tracking.js"(exports, module2) {
      "use strict";
      module2.exports = (Promise2, setTimeout2, clearTimeout) => {
        var DEFAULT_WHITELIST = [ReferenceError, TypeError, RangeError];
        var enabled = false;
        function disable() {
          enabled = false;
          Promise2._onHandle = null;
          Promise2._onReject = null;
        }
        function enable(options) {
          options = options || {};
          if (enabled)
            disable();
          enabled = true;
          var id = 0;
          var displayId = 0;
          var rejections = {};
          Promise2._onHandle = function(promise) {
            if (promise._state === 2 && // IS REJECTED
            rejections[promise._rejectionId]) {
              if (rejections[promise._rejectionId].logged) {
                onHandled(promise._rejectionId);
              } else {
                clearTimeout && clearTimeout(rejections[promise._rejectionId].timeout);
              }
              delete rejections[promise._rejectionId];
            }
          };
          Promise2._onReject = function(promise, err) {
            if (promise._deferredState === 0) {
              promise._rejectionId = id++;
              rejections[promise._rejectionId] = {
                displayId: null,
                error: err,
                timeout: setTimeout2(
                  onUnhandled.bind(null, promise),
                  0
                ),
                logged: false
              };
            }
          };
          function onUnhandled(promise) {
            const id2 = promise._rejectionId;
            if (options.allRejections || matchWhitelist(rejections[id2].error, options.
            whitelist || DEFAULT_WHITELIST)) {
              rejections[id2].displayId = displayId++;
              if (options.onUnhandled) {
                rejections[id2].logged = true;
                if (rejections[id2].error && !(rejections[id2].error instanceof Error)) {
                  const error = new Error(JSON.stringify(rejections[id2].error));
                  error.stack = promise.__createStack;
                  rejections[id2].error = error;
                }
                options.onUnhandled(rejections[id2].displayId, rejections[id2].error);
              } else {
                rejections[id2].logged = true;
                logError(rejections[id2].displayId, rejections[id2].error);
              }
            }
          }
          function onHandled(id2) {
            if (rejections[id2].logged) {
              if (options.onHandled) {
                options.onHandled(rejections[id2].displayId, rejections[id2].error);
              } else if (!rejections[id2].onUnhandled) {
                console.warn("Promise Rejection Handled (id: " + rejections[id2].
                displayId + "):");
                console.warn(
                  '  This means you can ignore any previous messages of the form\
 "Possible Unhandled Promise Rejection" with id ' + rejections[id2].displayId + "\
."
                );
              }
            }
          }
          return Promise2;
        }
        function logError(id, error) {
          console.warn("Possible Unhandled Promise Rejection (id: " + id + "):");
          var errStr = (error && (error.stack || error)) + "";
          errStr.split("\n").forEach(function(line) {
            console.warn("  " + line);
          });
        }
        function matchWhitelist(error, list) {
          return list.some(function(cls) {
            return error instanceof cls;
          });
        }
        return {
          enable,
          disable
        };
      };
    }
  });

  // ../lynx-promise/src/index.js
  var require_src = __commonJS({
    "../lynx-promise/src/index.js"(exports, module2) {
      "use strict";
      var promiseFactor = require_core();
      var es6 = require_es6_extensions();
      var rejectionHandle = require_rejection_tracking();
      var gg = new Function("return this")();
      gg.getPromise = module2.exports.getPromise = (opt) => {
        var setTimeout2 = opt.setTimeout;
        var onUnhandled = opt.onUnhandled;
        var clearTimeout = opt.clearTimeout;
        var nextTick = opt.nextTick || ((fn) => {
          setTimeout2(fn, 0);
        });
        var Promise2 = promiseFactor({ nextTick });
        Promise2 = es6(Promise2);
        Promise2 = rejectionHandle(Promise2, setTimeout2, clearTimeout).enable({
          allRejections: true,
          onUnhandled
        });
        return Promise2;
      };
    }
  });

  // ../../node_modules/.pnpm/regenerator-runtime@0.13.7/node_modules/regenerator-runtime/runtime.js
  var require_runtime = __commonJS({
    "../../node_modules/.pnpm/regenerator-runtime@0.13.7/node_modules/regenerato\
r-runtime/runtime.js"(exports, module2) {
      var runtime = function(exports2) {
        "use strict";
        var Op = Object.prototype;
        var hasOwn = Op.hasOwnProperty;
        var undefined2;
        var $Symbol = typeof Symbol === "function" ? Symbol : {};
        var iteratorSymbol = $Symbol.iterator || "@@iterator";
        var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
        var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
        function define(obj, key, value) {
          Object.defineProperty(obj, key, {
            value,
            enumerable: true,
            configurable: true,
            writable: true
          });
          return obj[key];
        }
        try {
          define({}, "");
        } catch (err) {
          define = function(obj, key, value) {
            return obj[key] = value;
          };
        }
        function wrap(innerFn, outerFn, self, tryLocsList) {
          var protoGenerator = outerFn && outerFn.prototype instanceof Generator ?
          outerFn : Generator;
          var generator = Object.create(protoGenerator.prototype);
          var context = new Context(tryLocsList || []);
          generator._invoke = makeInvokeMethod(innerFn, self, context);
          return generator;
        }
        exports2.wrap = wrap;
        function tryCatch(fn, obj, arg) {
          try {
            return { type: "normal", arg: fn.call(obj, arg) };
          } catch (err) {
            return { type: "throw", arg: err };
          }
        }
        var GenStateSuspendedStart = "suspendedStart";
        var GenStateSuspendedYield = "suspendedYield";
        var GenStateExecuting = "executing";
        var GenStateCompleted = "completed";
        var ContinueSentinel = {};
        function Generator() {
        }
        function GeneratorFunction() {
        }
        function GeneratorFunctionPrototype() {
        }
        var IteratorPrototype = {};
        IteratorPrototype[iteratorSymbol] = function() {
          return this;
        };
        var getProto = Object.getPrototypeOf;
        var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
        if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.
        call(NativeIteratorPrototype, iteratorSymbol)) {
          IteratorPrototype = NativeIteratorPrototype;
        }
        var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.
        create(IteratorPrototype);
        GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
        GeneratorFunctionPrototype.constructor = GeneratorFunction;
        GeneratorFunction.displayName = define(
          GeneratorFunctionPrototype,
          toStringTagSymbol,
          "GeneratorFunction"
        );
        function defineIteratorMethods(prototype) {
          ["next", "throw", "return"].forEach(function(method) {
            define(prototype, method, function(arg) {
              return this._invoke(method, arg);
            });
          });
        }
        exports2.isGeneratorFunction = function(genFun) {
          var ctor = typeof genFun === "function" && genFun.constructor;
          return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
        };
        exports2.mark = function(genFun) {
          if (Object.setPrototypeOf) {
            Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
          } else {
            genFun.__proto__ = GeneratorFunctionPrototype;
            define(genFun, toStringTagSymbol, "GeneratorFunction");
          }
          genFun.prototype = Object.create(Gp);
          return genFun;
        };
        exports2.awrap = function(arg) {
          return { __await: arg };
        };
        function AsyncIterator(generator, PromiseImpl) {
          function invoke(method, arg, resolve, reject) {
            var record = tryCatch(generator[method], generator, arg);
            if (record.type === "throw") {
              reject(record.arg);
            } else {
              var result = record.arg;
              var value = result.value;
              if (value && typeof value === "object" && hasOwn.call(value, "__aw\
ait")) {
                return PromiseImpl.resolve(value.__await).then(function(value2) {
                  invoke("next", value2, resolve, reject);
                }, function(err) {
                  invoke("throw", err, resolve, reject);
                });
              }
              return PromiseImpl.resolve(value).then(function(unwrapped) {
                result.value = unwrapped;
                resolve(result);
              }, function(error) {
                return invoke("throw", error, resolve, reject);
              });
            }
          }
          var previousPromise;
          function enqueue(method, arg) {
            function callInvokeWithMethodAndArg() {
              return new PromiseImpl(function(resolve, reject) {
                invoke(method, arg, resolve, reject);
              });
            }
            return previousPromise = // If enqueue has been called before, then we want to wait until
            // all previous Promises have been resolved before calling invoke,
            // so that results are always delivered in the correct order. If
            // enqueue has not been called before, then it is important to
            // call invoke immediately, without waiting on a callback to fire,
            // so that the async generator function has the opportunity to do
            // any necessary setup in a predictable way. This predictability
            // is why the Promise constructor synchronously invokes its
            // executor callback, and why async functions synchronously
            // execute code before the first await. Since we implement simple
            // async functions in terms of async generators, it is especially
            // important to get this right, even though it requires care.
            previousPromise ? previousPromise.then(
              callInvokeWithMethodAndArg,
              // Avoid propagating failures to Promises returned by later
              // invocations of the iterator.
              callInvokeWithMethodAndArg
            ) : callInvokeWithMethodAndArg();
          }
          this._invoke = enqueue;
        }
        defineIteratorMethods(AsyncIterator.prototype);
        AsyncIterator.prototype[asyncIteratorSymbol] = function() {
          return this;
        };
        exports2.AsyncIterator = AsyncIterator;
        exports2.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
          if (PromiseImpl === void 0)
            PromiseImpl = Promise;
          var iter = new AsyncIterator(
            wrap(innerFn, outerFn, self, tryLocsList),
            PromiseImpl
          );
          return exports2.isGeneratorFunction(outerFn) ? iter : iter.next().then(
          function(result) {
            return result.done ? result.value : iter.next();
          });
        };
        function makeInvokeMethod(innerFn, self, context) {
          var state = GenStateSuspendedStart;
          return function invoke(method, arg) {
            if (state === GenStateExecuting) {
              throw new Error("Generator is already running");
            }
            if (state === GenStateCompleted) {
              if (method === "throw") {
                throw arg;
              }
              return doneResult();
            }
            context.method = method;
            context.arg = arg;
            while (true) {
              var delegate = context.delegate;
              if (delegate) {
                var delegateResult = maybeInvokeDelegate(delegate, context);
                if (delegateResult) {
                  if (delegateResult === ContinueSentinel)
                    continue;
                  return delegateResult;
                }
              }
              if (context.method === "next") {
                context.sent = context._sent = context.arg;
              } else if (context.method === "throw") {
                if (state === GenStateSuspendedStart) {
                  state = GenStateCompleted;
                  throw context.arg;
                }
                context.dispatchException(context.arg);
              } else if (context.method === "return") {
                context.abrupt("return", context.arg);
              }
              state = GenStateExecuting;
              var record = tryCatch(innerFn, self, context);
              if (record.type === "normal") {
                state = context.done ? GenStateCompleted : GenStateSuspendedYield;
                if (record.arg === ContinueSentinel) {
                  continue;
                }
                return {
                  value: record.arg,
                  done: context.done
                };
              } else if (record.type === "throw") {
                state = GenStateCompleted;
                context.method = "throw";
                context.arg = record.arg;
              }
            }
          };
        }
        function maybeInvokeDelegate(delegate, context) {
          var method = delegate.iterator[context.method];
          if (method === undefined2) {
            context.delegate = null;
            if (context.method === "throw") {
              if (delegate.iterator["return"]) {
                context.method = "return";
                context.arg = undefined2;
                maybeInvokeDelegate(delegate, context);
                if (context.method === "throw") {
                  return ContinueSentinel;
                }
              }
              context.method = "throw";
              context.arg = new TypeError(
                "The iterator does not provide a 'throw' method"
              );
            }
            return ContinueSentinel;
          }
          var record = tryCatch(method, delegate.iterator, context.arg);
          if (record.type === "throw") {
            context.method = "throw";
            context.arg = record.arg;
            context.delegate = null;
            return ContinueSentinel;
          }
          var info = record.arg;
          if (!info) {
            context.method = "throw";
            context.arg = new TypeError("iterator result is not an object");
            context.delegate = null;
            return ContinueSentinel;
          }
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
            if (context.method !== "return") {
              context.method = "next";
              context.arg = undefined2;
            }
          } else {
            return info;
          }
          context.delegate = null;
          return ContinueSentinel;
        }
        defineIteratorMethods(Gp);
        define(Gp, toStringTagSymbol, "Generator");
        Gp[iteratorSymbol] = function() {
          return this;
        };
        Gp.toString = function() {
          return "[object Generator]";
        };
        function pushTryEntry(locs) {
          var entry = { tryLoc: locs[0] };
          if (1 in locs) {
            entry.catchLoc = locs[1];
          }
          if (2 in locs) {
            entry.finallyLoc = locs[2];
            entry.afterLoc = locs[3];
          }
          this.tryEntries.push(entry);
        }
        function resetTryEntry(entry) {
          var record = entry.completion || {};
          record.type = "normal";
          delete record.arg;
          entry.completion = record;
        }
        function Context(tryLocsList) {
          this.tryEntries = [{ tryLoc: "root" }];
          tryLocsList.forEach(pushTryEntry, this);
          this.reset(true);
        }
        exports2.keys = function(object) {
          var keys = [];
          for (var key in object) {
            keys.push(key);
          }
          keys.reverse();
          return function next() {
            while (keys.length) {
              var key2 = keys.pop();
              if (key2 in object) {
                next.value = key2;
                next.done = false;
                return next;
              }
            }
            next.done = true;
            return next;
          };
        };
        function values(iterable) {
          if (iterable) {
            var iteratorMethod = iterable[iteratorSymbol];
            if (iteratorMethod) {
              return iteratorMethod.call(iterable);
            }
            if (typeof iterable.next === "function") {
              return iterable;
            }
            if (!isNaN(iterable.length)) {
              var i = -1, next = function next2() {
                while (++i < iterable.length) {
                  if (hasOwn.call(iterable, i)) {
                    next2.value = iterable[i];
                    next2.done = false;
                    return next2;
                  }
                }
                next2.value = undefined2;
                next2.done = true;
                return next2;
              };
              return next.next = next;
            }
          }
          return { next: doneResult };
        }
        exports2.values = values;
        function doneResult() {
          return { value: undefined2, done: true };
        }
        Context.prototype = {
          constructor: Context,
          reset: function(skipTempReset) {
            this.prev = 0;
            this.next = 0;
            this.sent = this._sent = undefined2;
            this.done = false;
            this.delegate = null;
            this.method = "next";
            this.arg = undefined2;
            this.tryEntries.forEach(resetTryEntry);
            if (!skipTempReset) {
              for (var name in this) {
                if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(
                +name.slice(1))) {
                  this[name] = undefined2;
                }
              }
            }
          },
          stop: function() {
            this.done = true;
            var rootEntry = this.tryEntries[0];
            var rootRecord = rootEntry.completion;
            if (rootRecord.type === "throw") {
              throw rootRecord.arg;
            }
            return this.rval;
          },
          dispatchException: function(exception) {
            if (this.done) {
              throw exception;
            }
            var context = this;
            function handle(loc, caught) {
              record.type = "throw";
              record.arg = exception;
              context.next = loc;
              if (caught) {
                context.method = "next";
                context.arg = undefined2;
              }
              return !!caught;
            }
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];
              var record = entry.completion;
              if (entry.tryLoc === "root") {
                return handle("end");
              }
              if (entry.tryLoc <= this.prev) {
                var hasCatch = hasOwn.call(entry, "catchLoc");
                var hasFinally = hasOwn.call(entry, "finallyLoc");
                if (hasCatch && hasFinally) {
                  if (this.prev < entry.catchLoc) {
                    return handle(entry.catchLoc, true);
                  } else if (this.prev < entry.finallyLoc) {
                    return handle(entry.finallyLoc);
                  }
                } else if (hasCatch) {
                  if (this.prev < entry.catchLoc) {
                    return handle(entry.catchLoc, true);
                  }
                } else if (hasFinally) {
                  if (this.prev < entry.finallyLoc) {
                    return handle(entry.finallyLoc);
                  }
                } else {
                  throw new Error("try statement without catch or finally");
                }
              }
            }
          },
          abrupt: function(type, arg) {
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];
              if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc) {
                var finallyEntry = entry;
                break;
              }
            }
            if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.
            tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
              finallyEntry = null;
            }
            var record = finallyEntry ? finallyEntry.completion : {};
            record.type = type;
            record.arg = arg;
            if (finallyEntry) {
              this.method = "next";
              this.next = finallyEntry.finallyLoc;
              return ContinueSentinel;
            }
            return this.complete(record);
          },
          complete: function(record, afterLoc) {
            if (record.type === "throw") {
              throw record.arg;
            }
            if (record.type === "break" || record.type === "continue") {
              this.next = record.arg;
            } else if (record.type === "return") {
              this.rval = this.arg = record.arg;
              this.method = "return";
              this.next = "end";
            } else if (record.type === "normal" && afterLoc) {
              this.next = afterLoc;
            }
            return ContinueSentinel;
          },
          finish: function(finallyLoc) {
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];
              if (entry.finallyLoc === finallyLoc) {
                this.complete(entry.completion, entry.afterLoc);
                resetTryEntry(entry);
                return ContinueSentinel;
              }
            }
          },
          "catch": function(tryLoc) {
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];
              if (entry.tryLoc === tryLoc) {
                var record = entry.completion;
                if (record.type === "throw") {
                  var thrown = record.arg;
                  resetTryEntry(entry);
                }
                return thrown;
              }
            }
            throw new Error("illegal catch attempt");
          },
          delegateYield: function(iterable, resultName, nextLoc) {
            this.delegate = {
              iterator: values(iterable),
              resultName,
              nextLoc
            };
            if (this.method === "next") {
              this.arg = undefined2;
            }
            return ContinueSentinel;
          }
        };
        return exports2;
      }(
        // If this script is executing as a CommonJS module, use module.exports
        // as the regeneratorRuntime namespace. Otherwise create a new empty
        // object. Either way, the resulting object will be used to initialize
        // the regeneratorRuntime variable at the top of this file.
        typeof module2 === "object" ? module2.exports : {}
      );
      try {
        regeneratorRuntime = runtime;
      } catch (accidentalStrictMode) {
        Function("r", "regeneratorRuntime = r")(runtime);
      }
    }
  });

  // kernel-build/android-polyfill.js
  var globalThis2 = new Function("return this;")();
  globalThis2.globalThis = globalThis2;

  // src/index.build.ts
  var import_ios_polyfill_promise = __toESM(require_src(), 1);
  var import_runtime3 = __toESM(require_runtime(), 1);

  // ../lynx-runtime-shared/dist/nativeGlobal.js
  var _global = function() {
    return this || (0, eval)("this");
  }();
  var nativeGlobal_default = _global;

  // ../lynx-runtime-shared/dist/utils.js
  function getDataType(data) {
    const type = typeof data;
    if (type !== "object")
      return type;
    if (Array.isArray(data))
      return "array";
    if (data == null)
      return "null";
    if (data instanceof Date)
      return "date";
    if (data instanceof RegExp)
      return "regExp";
    return "object";
  }
  function isString(val) {
    return typeof val === "string";
  }
  function isObject(val) {
    return getDataType(val) === "object";
  }
  function isFunction(obj) {
    const dataType = getDataType(obj);
    return dataType === "function";
  }
  function isError(o) {
    switch (Object.prototype.toString.call(o)) {
      case "[object Error]":
        return true;
      case "[object Exception]":
        return true;
      case "[object DOMException]":
        return true;
      default:
        return isInstanceOf(o, Error);
    }
  }
  function isInstanceOf(o, base) {
    try {
      return o instanceof base;
    } catch (_e) {
      return false;
    }
  }
  function noop() {
  }

  // ../lynx-runtime-shared/dist/ttConsole.js
  function createSharedConsole(runtimeId) {
    if (false) {
      const sharedConsole = {};
      Object.keys(nativeConsole).forEach((funcName) => {
        if (["profile", "profileEnd"].includes(funcName)) {
          sharedConsole[funcName] = nativeConsole[funcName];
          return;
        }
        if (isFunction(nativeConsole[funcName])) {
          sharedConsole[funcName] = logWithRuntimeId.bind(sharedConsole, funcName);
        }
      });
      sharedConsole.runtimeId = runtimeId;
      return sharedConsole;
    }
    return nativeConsole;
  }
  var _global2 = function() {
    return this || (0, eval)("this");
  }();
  var groupConsole = createSharedConsole(`groupId:${_global2.groupId || "-1"}`);
  var ttConsole_default = true ? groupConsole : nativeConsole;

  // src/common/ttConsole.ts
  var ttConsole_default2 = ttConsole_default;

  // src/modules/report/errors.ts
  var BaseError = class extends Error {
    constructor(message, stack) {
      super(message);
      if (stack) {
        this.stack = stack;
      }
    }
  };
  var InternalError = class extends BaseError {
    constructor() {
      super(...arguments);
      this.kind = "INTERNAL_ERROR";
    }
  };
  var UserError = class extends BaseError {
    constructor() {
      super(...arguments);
      this.kind = "USER_ERROR";
    }
  };
  var UserRuntimeError = class extends UserError {
    constructor() {
      super(...arguments);
      this.name = "USER_RUNTIME_ERROR";
    }
  };
  var InternalRuntimeError = class extends InternalError {
    constructor() {
      super(...arguments);
      this.name = "INTERNAL_RUNTIME_ERROR";
    }
  };
  var InvokeError = class extends InternalError {
    constructor() {
      super(...arguments);
      this.name = "INVOKE_ERROR";
    }
  };

  // src/common/constants.ts
  var DEFAULT_ENTRY = "__Card__";
  var APP_SERVICE_NAME = "app-service.js";
  var SOURCE_MAP_RELEASE_ERROR_NAME = "LynxGetSourceMapReleaseError";
  var LYNX_CORE = {
    filename: "lynx_core",
    slot: "12a3fea3c45c7c6bc2f77b542536570423dba9a9",
    release: "0.0.1"
  };

  // src/modules/sharedData/ShareDataSubject.ts
  var ShareDataSubject = class {
    constructor() {
      /**
       * @type {Observer[]} List of subscribers.
       *
       */
      this.observersFunc = [];
    }
    /**
     * The subscription management methods.
     */
    registerObserver(observer) {
      const isExist = this.observersFunc.includes(observer);
      if (isExist) {
        return ttConsole_default2.log("Subject: Observer has been attached alrea\
dy.");
      }
      this.observersFunc.push(observer);
    }
    removeObserver(observer) {
      const observerIndex = this.observersFunc.indexOf(observer);
      if (observerIndex === -1) {
        return ttConsole_default2.log("Subject: Nonexistent observer.");
      }
      this.observersFunc.splice(observerIndex, 1);
    }
    notifyDataChange(value) {
      this.observersFunc.forEach((toObserver) => {
        if (typeof toObserver === "function") {
          try {
            toObserver(value);
          } catch (error) {
            ttConsole_default2.log(
              "SharedData change and notifyDataChange error info:" + error
            );
          }
        }
      });
    }
  };

  // src/common/nativeGlobal.ts
  nativeGlobal_default.multiApps = {};
  nativeGlobal_default.currentAppId = "";
  nativeGlobal_default.globComponentRegistPath = "";
  nativeGlobal_default.sharedData = {};
  nativeGlobal_default.globDynamicComponentEntry = DEFAULT_ENTRY;
  nativeGlobal_default.shareDataSubject = new ShareDataSubject();
  nativeGlobal_default.TaroLynx = {};
  nativeGlobal_default.bundleSupportLoadScript = true;
  var { loadScript } = nativeGlobal_default;
  var nativeGlobal_default2 = nativeGlobal_default;

  // src/common/log.ts
  var isNativeConsoleHasALog;
  function alog(str) {
    if (true) {
      return;
    }
    if (isNativeConsoleHasALog === void 0) {
      isNativeConsoleHasALog = typeof ttConsole_default2.alog === "function";
    }
    if (isNativeConsoleHasALog) {
      ttConsole_default2.alog("[LynxJSSDK]" + str);
    }
  }

  // src/common/version.ts
  var numberRegExp = /\d+/;
  var Version = class _Version {
    // version: major.minor.revision.build
    constructor(version) {
      this.major = 0;
      this.minor = 0;
      this.revision = 0;
      this.build = 0;
      version = String(version);
      [
        this.major = 0,
        this.minor = 0,
        this.revision = 0,
        this.build = 0
      ] = version.split(".").map((v) => {
        const result = numberRegExp.exec(v);
        if (result && result.length > 0) {
          return +result[0];
        }
        return 0;
      });
    }
    /**
     * Greater Than
     * @param version the version to be compared
     * @returns this > version
     */
    gt(version) {
      if (typeof version === "string") {
        version = new _Version(version);
      }
      if (this.major > version.major) {
        return true;
      } else if (this.major < version.major) {
        return false;
      }
      if (this.minor > version.minor) {
        return true;
      } else if (this.minor < version.minor) {
        return false;
      }
      if (this.revision > version.revision) {
        return true;
      } else if (this.revision < version.revision) {
        return false;
      }
      if (this.build > version.build) {
        return true;
      } else if (this.build < version.build) {
        return false;
      }
      return false;
    }
    /**
     * EQual
     * @param version the version to be compared
     * @returns this == version
     */
    eq(version) {
      if (typeof version === "string") {
        version = new _Version(version);
      }
      return this.major === version.major && this.minor === version.minor && this.
      revision === version.revision && this.build === version.build;
    }
    /**
     * Less Than
     * @param version the version to be compared
     * @returns this < version
     */
    lt(version) {
      if (this.eq(version)) {
        return false;
      }
      return !this.gt(version);
    }
    /**
     * Greater Than or Equal
     * @param version the version to be compared
     * @returns this >= version
     */
    gte(version) {
      return this.eq(version) || this.gt(version);
    }
    /**
     * Less Than or Equal
     * @param version the version to be compared
     * @returns this <= version
     */
    lte(version) {
      return this.eq(version) || this.lt(version);
    }
  };
  var version2_4 = new Version("2.4");
  var version2_7 = new Version("2.7");
  var version2_9 = new Version("2.9");
  var version2_12 = new Version("2.12");
  var version2_14 = new Version("2.14");

  // src/modules/report/report-error.ts
  function reportError(error, nativeApp, options) {
    const { originError, errorCode, errorLevel, runType = LYNX_CORE } = options !=
    null ? options : {};
    ttConsole_default2.error("The following error occurred in the JSRuntime:");
    ttConsole_default2.error(`${error == null ? void 0 : error.message}
${error == null ? void 0 : error.stack}`);
    error.cause = isObject(error.cause) ? JSON.stringify(error.cause) : error.cause;
    try {
      nativeApp.reportException(error, {
        ...runType,
        buildVersion: "0.0.1",
        versionCode: "0.0.1",
        errorCode,
        errorLevel
      });
    } catch (error2) {
      ttConsole_default2.error("reportError err:\n", error2);
    }
  }
  function legacyReportError(error, nativeApp, runType = LYNX_CORE, originError, proxy) {
    return reportError(error, nativeApp, {
      runType,
      originError,
      __sourcemap__release__: proxy.__sourcemap__release__
    });
  }

  // src/modules/report/wrapper.ts
  function wrapUserFunction(desc, instance, callback, runType = LYNX_CORE) {
    if (!isFunction(callback))
      return noop;
    return wrapFunction("USER_ERROR", desc, callback, instance, runType);
  }
  function wrapFunction(errorKind = "INTERNAL_ERROR", desc, callback, instance, runType) {
    return function wrapFunctionInner(...args) {
      try {
        return callback.apply(this, args);
      } catch (error) {
        const message = `${desc} 
${error.message}`;
        if (callback.name !== "onError" && typeof instance.onError === "function") {
          instance.onError(
            `Card ${callback.name} exec error:${message}
${error.stack}`,
            error
          );
        }
        const err = errorKind === "INTERNAL_ERROR" ? new InternalRuntimeError(message,
        error.stack) : new UserRuntimeError(message, error.stack);
        ttConsole_default2.log(`wrapError-${desc}`, err);
        reportError(err, instance._nativeApp, {
          runType,
          __sourcemap__release__: instance.__sourcemap__release__,
          getSourceMapRelease: instance.getSourceMapRelease
        });
      }
    };
  }
  function wrapInnerFunction(desc, instance, callback, runType = LYNX_CORE) {
    if (!isFunction(callback))
      return noop;
    return wrapFunction("INTERNAL_ERROR", desc, callback, instance, runType);
  }

  // src/modules/report/reporter.ts
  var Reporter = class {
    constructor(getApp, getNativeApp) {
      this.getApp = getApp;
      this.getNativeApp = getNativeApp;
      // /**
      //  * key url -> value sourcemap
      //  * support different sourcemap for external js
      //  */
      // sourcemaps: Record<string, string> = {};
      /**
       * Set sourcemap release with a newly thrown error
       * @param {Error} error
       * The error thrown from the file that wants to set sourcemap release.
       * The top frame of `error.stack` **must be** the filename.
       * The `error.name` **must be** `'LynxGetSourceMapReleaseError'`.
       * The `error.message` **must be** the sourcemap release.
       *
       * @example
       * (function () {
       *   try {
       *     throw new Error(sourcemapRelease);
       *   } catch (e) {
       *     e.name = 'LynxGetSourceMapReleaseError';
       *     tt.setSourceMapRelease(e);
       *   }
       * })()
       */
      this.setSourceMapRelease = (error) => {
        if (isError(error) && error.name === BaseApp.kGetSourceMapReleaseErrorName &&
        isString(error.message) && isString(error.stack)) {
          this.getNativeApp().__SetSourceMapRelease({
            name: error.name,
            message: error.message,
            stack: error.stack
          });
          return;
        }
        alog(`setSourceMapRelease failed with error: ${JSON.stringify(error)}`);
      };
      this.getSourceMapRelease = (url) => {
        let ret = this.getNativeApp().__GetSourceMapRelease(url);
        if (!ret) {
          return this.getNativeApp().__GetSourceMapRelease(
            BaseApp.kDefaultSourceMapURL
          );
        }
      };
      this.getApp = getApp;
      this.getNativeApp = getNativeApp;
    }
    rebind(getApp) {
      this.getApp = getApp;
    }
  };

  // src/modules/animation/animation.ts
  var _Animation = class _Animation {
    constructor(effect) {
      this.effect = effect;
      this.id = "__lynx-inner-js-animation-" + _Animation.count++;
    }
    cancel() {
      this.effect.target.cancelAnimate(this);
    }
    pause() {
      this.effect.target.pauseAnimate(this);
    }
    play() {
      this.effect.target.playAnimate(this);
    }
  };
  _Animation.count = 0;
  var Animation = _Animation;

  // src/modules/animation/effect.ts
  var KeyframeEffect = class {
    constructor(target, keyframes, options) {
      this.target = target;
      this.keyframes = keyframes;
      this.options = options;
    }
  };

  // src/modules/element/element.ts
  var Element = class {
    constructor(root, id, lynxProxy) {
      this._root = root;
      this._idSelector = "#" + id;
      this._lynx = lynxProxy;
      this._element = void 0;
    }
    ensureElement() {
      if (!this._element) {
        this._element = this._lynx.createElement(this._root, this._idSelector);
      }
    }
    // keyframes: see https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
    //  Either an array of keyframe objects, or a keyframe object whose property are arrays of values to iterate over. See Keyframe Formats for more details.
    //
    // timingOptions: see https://developer.mozilla.org/en-US/docs/Web/API/Element/animate
    //  id Optional: A property unique to animate(): a DOMString with which to reference the animation.
    //  delay Optional: The number of milliseconds to delay the start of the animation. Defaults to 0.
    //  direction Optional: Whether the animation runs forwards (normal), backwards (reverse), switches direction after each iteration (alternate), or runs backwards and switches direction after each iteration (alternate-reverse). Defaults to "normal".
    //  duration Optional: The number of milliseconds each iteration of the animation takes to complete. Defaults to 0. Although this is technically optional, keep in mind that your animation will not run if this value is 0.
    //  easing Optional: The rate of the animation's change over time. Accepts the pre-defined values "linear", "ease", "ease-in", "ease-out", and "ease-in-out", or a custom "cubic-bezier" value like "cubic-bezier(0.42, 0, 0.58, 1)". Defaults to "linear".
    //  endDelay Optional: The number of milliseconds to delay after the end of an animation. This is primarily of use when sequencing animations based on the end time of another animation. Defaults to 0.
    //  fill Optional: Dictates whether the animation's effects should be reflected by the element(s) prior to playing ("backwards"), retained after the animation has completed playing ("forwards"), or both. Defaults to "none".
    //  iterationStart Optional: Describes at what point in the iteration the animation should start. 0.5 would indicate starting halfway through the first iteration for example, and with this value set, an animation with 2 iterations would end halfway through a third iteration. Defaults to 0.0.
    // iterations Optional: The number of times the animation should repeat. Defaults to 1, and can also take a value of Infinity to make it repeat for as long as the element exists.
    animate(keyframes, timingOptions) {
      this.ensureElement();
      let ani = new Animation(new KeyframeEffect(this, keyframes, timingOptions));
      this._element.animate(0, ani.id, keyframes, timingOptions);
      return ani;
    }
    playAnimate(ani) {
      this._element.animate(1, ani.id, void 0, void 0);
    }
    pauseAnimate(ani) {
      this._element.animate(2, ani.id, void 0, void 0);
    }
    cancelAnimate(ani) {
      this._element.animate(3, ani.id, void 0, void 0);
    }
    finishAnimate(ani) {
      this._element.animate(4, ani.id, void 0, void 0);
    }
    setProperty(propsObj, propsVal) {
      this.ensureElement();
      if (typeof propsObj === "string" && typeof propsVal === "string") {
        this._element.setProperty({
          [propsObj]: propsVal
        });
      } else if (typeof propsObj === "object") {
        this._element.setProperty(propsObj);
      } else {
        throw new Error(
          `setProperty's param must be string or object. While current type is ${typeof propsObj}\
 and ${typeof propsVal}.`
        );
      }
    }
  };

  // src/modules/element/index.ts
  var element_default = Element;

  // src/modules/selectorQuery/SelectorQuery.ts
  var SelectorQuery = class _SelectorQuery {
    constructor(component, taskQueue, proxy) {
      this._component = component;
      this._taskQueue = taskQueue;
      this._native_proxy = proxy;
      this._fire_immediately = false;
      this._root_unique_id = void 0;
    }
    static fromQuery(prevQuery, component) {
      return new _SelectorQuery(
        component != null ? component : prevQuery._component,
        prevQuery._taskQueue.slice(),
        prevQuery._native_proxy
      );
    }
    static newEmptyQuery(proxy, component) {
      return new _SelectorQuery(component != null ? component : "", [], proxy);
    }
    /**
     * According to `this._fire_immediately`,
     * either execute the query immediately or add it to the task queue of the SelectorQuery.
     * In the latter case, a new query is returned, and `this` is not modified.
     * @param task the task to commit
     */
    commitTask(task) {
      let new_query = _SelectorQuery.fromQuery(this, this._component);
      new_query._taskQueue.push(task);
      if (this._fire_immediately) {
        new_query.exec();
        return void 0;
      }
      return new_query;
    }
    in(component) {
      return component.createSelectorQuery(this);
    }
    /**
     * Selects a single node by CSS selector.
     * @param selector CSS selector
     */
    select(selector) {
      return new NodesRef(this, {
        type: 0 /* ID_SELECTOR */,
        identifier: selector,
        component_id: this._component,
        root_unique_id: this._root_unique_id,
        first_only: true
      });
    }
    /**
     * Selects all nodes satisfying CSS selector.
     * @param selector CSS selector
     */
    selectAll(selector) {
      return new NodesRef(this, {
        type: 0 /* ID_SELECTOR */,
        identifier: selector,
        component_id: this._component,
        root_unique_id: this._root_unique_id,
        first_only: false
      });
    }
    /**
     * Selects a single node as React ref.
     * When works as ReactRef, SelectorQuery should act like getNodeRef, which means:
     * 1. cascade query is disabled.
     * 2. tasks are executed immediately without calling exec().
     */
    selectReactRef(ref_string) {
      if (this._taskQueue.length) {
        const errorMessage = "selectReactRef() should be called before any other\
 selector query methods";
        nativeConsole.warn(errorMessage);
        const error = new Error(errorMessage);
        reportError(
          new InvokeError(errorMessage, error.stack),
          this._native_proxy.nativeApp
        );
        return;
      }
      this._fire_immediately = true;
      return new NodesRef(this, {
        type: 1 /* REF_ID */,
        identifier: ref_string,
        component_id: this._component,
        root_unique_id: this._root_unique_id,
        first_only: true
      });
    }
    /**
     * Select root node of the component.
     */
    selectRoot() {
      return this.select("");
    }
    /**
     * Selects a single node by element id.
     * When a touch event is triggered, the element id of the node is passed to the event handler as 'uid',
     * by which can a node be selected in its event handler.
     */
    selectUniqueID(uniqueId) {
      return new NodesRef(this, {
        type: 2 /* UNIQUE_ID */,
        identifier: uniqueId.toString(),
        component_id: this._component,
        root_unique_id: this._root_unique_id,
        first_only: true
      });
    }
    /**
     * Execute all tasks in the task queue.
     * When `this._fire_immediately` is set to true, this method is called automatically.
     */
    exec() {
      for (let i = 0; i < this._taskQueue.length; ++i) {
        this._taskQueue[i](this._native_proxy);
      }
    }
    setRoot(uniqueId) {
      this._root_unique_id = Number(uniqueId);
      return this;
    }
  };
  var NodesRef = class {
    constructor(selectorQuery, nodeSelectToken) {
      this._nodeSelectToken = nodeSelectToken;
      this._selectorQuery = selectorQuery;
    }
    invoke(options) {
      let errorStack;
      if (true) {
        errorStack = new Error("");
      }
      let task = (proxy) => {
        var _a3;
        let callback = (res) => {
          if (res.code === 0 /* SUCCESS */) {
            options.success && options.success(res.data);
          } else {
            if (options.fail) {
              options.fail(res);
            } else {
              if (true) {
                if (!proxy.lynx._switches.disableSelectorQueryWarningWhenFailed) {
                  const errorMessage = `Failed to exec createSelectorQuery().inv\
oke() on NodesRef ${JSON.stringify(
                    this._nodeSelectToken
                  )}. Add a fail callback to suppress this warning. Msg: ${JSON.
                  stringify(
                    res
                  )}`;
                  nativeConsole.warn(errorMessage);
                  reportError(
                    new InvokeError(errorMessage, errorStack.stack),
                    proxy.nativeApp
                  );
                }
              }
            }
          }
        };
        if (!this._nodeSelectToken.first_only) {
          callback({
            code: 5 /* SELECTOR_NOT_SUPPORTED */,
            data: "selectAll not supported for invoke method"
          });
          return;
        }
        proxy.nativeApp.invokeUIMethod(
          this._nodeSelectToken.type,
          this._nodeSelectToken.identifier,
          this._nodeSelectToken.component_id,
          options.method,
          (_a3 = options.params) != null ? _a3 : {},
          callback,
          this._nodeSelectToken.root_unique_id
        );
      };
      return this._selectorQuery.commitTask(task);
    }
    path(cb) {
      let task = (proxy) => {
        let callback = (res) => {
          cb && cb(res.data, res.status);
        };
        proxy.nativeApp.getPathInfo(
          this._nodeSelectToken.type,
          this._nodeSelectToken.identifier,
          this._nodeSelectToken.component_id,
          this._nodeSelectToken.first_only,
          callback,
          this._nodeSelectToken.root_unique_id
        );
      };
      return this._selectorQuery.commitTask(task);
    }
    fields(fields, cb) {
      let task = (proxy) => {
        let callback = (res) => {
          if (fields.query) {
            const addQueryObject = (result) => {
              result.query = SelectorQuery.newEmptyQuery(proxy);
              result.query.setRoot(result.unique_id.toString());
              if (!fields.unique_id) {
                delete result.unique_id;
              }
            };
            if (this._nodeSelectToken.first_only) {
              let result = res.data;
              if (result) {
                addQueryObject(result);
              }
            } else {
              for (let result of res.data) {
                addQueryObject(result);
              }
            }
          }
          cb && cb(res.data, res.status);
        };
        let fields_array = [];
        for (let key in fields) {
          if (key == "query" && fields[key] == true && !fields.unique_id) {
            fields_array.push("unique_id");
            continue;
          }
          if (fields[key]) {
            fields_array.push(key);
          }
        }
        proxy.nativeApp.getFields(
          this._nodeSelectToken.type,
          this._nodeSelectToken.identifier,
          this._nodeSelectToken.component_id,
          this._nodeSelectToken.first_only,
          fields_array,
          callback,
          this._nodeSelectToken.root_unique_id
        );
      };
      return this._selectorQuery.commitTask(task);
    }
    setNativeProps(nativeProps) {
      let task = (proxy) => {
        proxy.nativeApp.setNativeProps(
          this._nodeSelectToken.type,
          this._nodeSelectToken.identifier,
          this._nodeSelectToken.component_id,
          this._nodeSelectToken.first_only,
          nativeProps,
          this._nodeSelectToken.root_unique_id
        );
      };
      return this._selectorQuery.commitTask(task);
    }
  };
  NodesRef.nodePool = {};

  // src/lynx/lynx.ts
  var _a, _b, _c;
  var _Lynx = class _Lynx {
    constructor(getNativeApp, getApp, Promise2, getNativeLynx) {
      this.getNativeApp = getNativeApp;
      this.getApp = getApp;
      this.Promise = Promise2;
      this.getNativeLynx = getNativeLynx;
      this.setTimeout = this.getApp().wrapReport(
        this.getNativeApp().setTimeout,
        "setTimeout Error"
      );
      this.setInterval = this.getApp().wrapReport(
        this.getNativeApp().setInterval,
        "setInterval Error"
      );
      this.clearInterval = this.getNativeApp().clearInterval;
      this.clearTimeout = this.getNativeApp().clearTimeout;
      this.resumeExposure = this.getApp()._apiList["resumeExposure"];
      this.requireModule = (path2, entryName2, options) => {
        if (this.requireModule.cache[path2]) {
          return this.requireModule.cache[path2];
        }
        const exports = this.getApp().requireModule(path2, entryName2, options);
        this.requireModule.cache[path2] = exports;
        return exports;
      };
      this.requireModuleAsync = (path2, callback) => {
        callback != null ? callback : callback = (error) => {
          if (!error) {
            return;
          }
          this.getApp().handleUserError(error);
        };
        if (this.requireModuleAsync.cache[path2]) {
          callback(null, this.requireModuleAsync.cache[path2]);
          return;
        }
        this.getApp().requireModuleAsync(path2, (error, exports) => {
          if (!error) {
            this.requireModuleAsync.cache[path2] = exports;
          }
          callback(error, exports);
        });
      };
      this.createElement = (rootId, id) => this.getNativeLynx().createElement(rootId,
      id);
      this.getElementById = (id) => {
        return new element_default("", id, this);
      };
      this.reportError = (error, options) => {
        let errorObj;
        if (isError(error)) {
          errorObj = error;
        } else {
          let message;
          if (typeof error !== "string") {
            message = JSON.stringify(error);
          } else {
            message = error;
          }
          errorObj = new Error(message);
        }
        const { level = "error" } = options || {};
        let errorLevel;
        switch (level) {
          case "error":
            errorLevel = 1 /* Error */;
            break;
          case "warning":
            errorLevel = 2 /* Warn */;
            break;
          case "fatal":
            errorLevel = 0 /* Fatal */;
            break;
          default:
            errorLevel = 1 /* Error */;
        }
        this.getApp().handleUserError(errorObj, void 0, errorLevel);
      };
      this.registerModule = (name, module2) => this.getApp().registerModule(name,
      module2);
      this.getJSModule = (name) => {
        return this.getApp().getJSModule(name);
      };
      this.getTextInfo = this.getApp()._apiList["getTextInfo"];
      this.addFont = (font, callback) => {
        if (!isObject(font)) {
          throw new Error("The first argument must be object type");
        }
        if (!isString(font["font-family"]) || !isString(font["src"])) {
          throw new Error("The font value must have font-family and src");
        }
        if (!isFunction(callback)) {
          throw new Error("The second argument must be function type");
        }
        this.getNativeLynx().addFont(font, callback);
      };
      this.stopExposure = this.getApp()._apiList["stopExposure"];
      this.setObserverFrameRate = this.getApp()._apiList["setObserverFrameRate"];
      this.performance = this.getApp().performance;
      this.beforePublishEvent = this.getApp()._aopManager._beforePublishEvent;
      // sessionStorage Api
      this.setSessionStorageItem = (key, value) => {
        this.dispatchSessionStorageEvent({
          type: "__SetSessionStorageItem" /* EVENT_SET_SESSION_STORAGE */,
          data: {
            key,
            value
          }
        });
      };
      this.getSessionStorageItem = (key, callback) => {
        this.getNativeApp().getSessionStorageItem(key, callback);
      };
      this.subscribeSessionStorage = (key, callback) => {
        let listenerId = _Lynx.__registerSharedDataCounter++;
        this.getNativeApp().subscribeSessionStorage(key, listenerId, callback);
        return listenerId;
      };
      this.unsubscribeSessionStorage = (key, listenerId) => {
        this.dispatchSessionStorageEvent({
          type: "__UnSubscribeSessionStorage" /* EVENT_UNSUBSCRIBE_SESSION_STORAGE */,
          data: {
            key,
            listenerId
          }
        });
      };
      this.getDevtool = this.getNativeLynx().getDevtool;
      this.getCoreContext = this.getNativeLynx().getCoreContext;
      this.getJSContext = this.getNativeLynx().getJSContext;
      this.getUIContext = this.getNativeLynx().getUIContext;
      this.getCustomSectionSync = this.getNativeLynx().getCustomSectionSync;
      this.accessibilityAnnounce = (_a = this.getNativeApp().nativeModuleProxy.LynxAccessibilityModule) ==
      null ? void 0 : _a.accessibilityAnnounce;
      this.requestResourcePrefetch = (_b = this.getNativeApp().nativeModuleProxy.
      LynxResourceModule) == null ? void 0 : _b.requestResourcePrefetch;
      this.cancelResourcePrefetch = (_c = this.getNativeApp().nativeModuleProxy.
      LynxResourceModule) == null ? void 0 : _c.cancelResourcePrefetch;
      this.setSharedData = (dataKey, dataVal) => {
        nativeGlobal_default2.sharedData[dataKey] = dataVal;
        let variable = {};
        variable[dataKey] = dataVal;
        nativeGlobal_default2.shareDataSubject.notifyDataChange(variable);
      };
      this.getSharedData = (dataKey) => nativeGlobal_default2.sharedData[dataKey];
      this.registerSharedDataObserver = (callback) => nativeGlobal_default2.shareDataSubject.
      registerObserver(callback);
      this.removeSharedDataObserver = (callback) => nativeGlobal_default2.shareDataSubject.
      removeObserver(callback);
      this.triggerLepusGlobalEvent = (event, params2) => this.getNativeApp().triggerLepusGlobalEvent(
      event, params2);
      // for reload
      this.reload = (value, callback) => {
        this.getNativeLynx().reload(value, callback);
      };
      this.fetchDynamicComponent = (url, options, callback, id) => this.getNativeLynx().
      fetchDynamicComponent(url, options, callback, id);
      // Wrapper QueryComponent to decide if component has loaded.
      this.QueryComponent = (source, callback) => {
        const innerInvokeCallback = () => {
          callback({
            code: 0,
            data: { url: source, sync: true, error_message: "", mode: "cache" },
            detail: { schema: source, cache: false, errMsg: "" }
          });
        };
        if (this.getApp().loadedDynamicComponentsSet.has(source)) {
          innerInvokeCallback();
          return;
        }
        const innerCallback = (result) => {
          if (result.__hasReady === true) {
            nativeGlobal_default2.loadDynamicComponent(this.getApp(), source);
            innerInvokeCallback();
          } else {
            callback(result);
          }
        };
        this.getNativeLynx().QueryComponent(source, innerCallback);
      };
      this.loadDynamicComponent = (idOrUrl, urlOrOptions, options = {}) => {
        return new this.Promise((resolve, reject) => {
          let ids = [];
          let url;
          if (Array.isArray(idOrUrl)) {
            ids = idOrUrl;
            url = urlOrOptions;
          } else if (typeof urlOrOptions === "string") {
            ids = [idOrUrl];
            url = urlOrOptions;
          } else {
            url = idOrUrl;
            options = urlOrOptions;
          }
          if (this.getApp().loadedDynamicComponentsSet.has(url)) {
            resolve({
              code: 0,
              data: { url, sync: false, error_message: "", mode: "normal" },
              detail: { schema: url, cache: false, errMsg: "" }
            });
            return;
          }
          this.getNativeLynx().fetchDynamicComponent(
            url,
            options,
            (res) => {
              if (res && res.code == 0) {
                resolve(res);
              } else {
                reject(res);
              }
            },
            ids
          );
        });
      };
      this.fetch = (input, init) => {
        return new this.Promise((resolve, reject) => {
          const request = new (this.getApp())._RequestClass(input, init);
          const signal = request.signal;
          if (signal.aborted) {
            return reject(signal.reason);
          }
          signal.addEventListener("abort", (event) => {
            reject(signal.reason);
          });
          const fetchArg = {
            method: request.method,
            url: request.url,
            origin: this.getNativeApp().__pageUrl,
            headers: Object.fromEntries(request.headers.entries()),
            body: request._bodyData.arrayBuffer,
            lynx: request.lynxExtension
          };
          this.getApp().NativeModules.LynxFetchModule.fetch(
            fetchArg,
            (response) => {
              if (signal.aborted) {
                return;
              }
              try {
                const resp = new (this.getApp())._ResponseClass(
                  response.body,
                  response
                );
                resolve(resp);
              } catch (_) {
                reject(new TypeError(response.statusText));
              }
            },
            (error) => {
              if (signal.aborted) {
                return;
              }
              reject(new TypeError(error.message));
            }
          );
        });
      };
      this.createSelectorQuery = () => {
        return SelectorQuery.newEmptyQuery({
          nativeApp: this.getNativeApp(),
          lynx: this
        });
      };
      this.requestAnimationFrame = (callback) => this.getNativeApp().requestAnimationFrame(
      callback);
      this.cancelAnimationFrame = (animationId) => this.getNativeApp().cancelAnimationFrame(
      animationId);
      this.__addReporterCustomInfo = (info) => {
        this.getNativeApp().__addReporterCustomInfo(info);
      };
      this.init(void 0);
    }
    rebind(getApp) {
      this.init(getApp);
    }
    init(getApp) {
      if (getApp) {
        this.getApp = getApp;
        this.__globalProps = this.getNativeLynx().__globalProps || {};
        this.__presetData = this.getNativeLynx().__presetData || {};
      } else {
        const cache = {};
        this.requireModule.cache = cache;
        this.requireModuleAsync.cache = cache;
        this.__globalProps = this.getNativeLynx().__globalProps || {};
        this.__presetData = this.getNativeLynx().__presetData || {};
        this._switches = {};
      }
    }
    dispatchSessionStorageEvent(event) {
      var eventResult = this.getCoreContext().dispatchEvent(event);
      if (eventResult == 0 /* NotCanceled */) {
        return;
      }
      this.getJSContext().dispatchEvent(event);
    }
    queueMicrotask(callback) {
      this.getNativeLynx().queueMicrotask(callback);
    }
  };
  _Lynx.__registerSharedDataCounter = 0;
  var Lynx = _Lynx;

  // src/modules/event/eventEmitter.ts
  var EventEmitter = class {
    constructor(callLynxSetModule) {
      this._internal_callLynxSetModule = callLynxSetModule;
      this._events = /* @__PURE__ */ new Map();
    }
    getEventsSize(eventType) {
      var _a3;
      return (_a3 = this._events.get(eventType)) == null ? void 0 : _a3.length;
    }
    setCallLynxSetModule(callLynxSetModule) {
      this._internal_callLynxSetModule = callLynxSetModule;
    }
    addListener(eventName, listener, context) {
      const event = this._events.get(eventName);
      if (eventName == "keyboardstatuschanged") {
        if (this._internal_callLynxSetModule) {
          this._internal_callLynxSetModule("switchKeyBoardDetect", [true]);
        }
      }
      if (event) {
        event.push({
          listener,
          context
        });
      } else {
        this._events.set(eventName, [
          {
            listener,
            context
          }
        ]);
      }
    }
    removeListener(eventName, listener) {
      if (typeof listener !== "function") {
        throw new Error("removeListener only takes instances of Function");
      }
      const events = this._events.get(eventName);
      let index = 0;
      if (Array.isArray(events)) {
        const flag = events.some((item) => {
          if (listener === item.listener) {
            return true;
          }
          index++;
        });
        flag && events.splice(index, 1);
      }
      if (eventName == "keyboardstatuschanged") {
        if (this._internal_callLynxSetModule) {
          this._internal_callLynxSetModule("switchKeyBoardDetect", [false]);
        }
      }
    }
    emit(eventName, data) {
      const events = this._events.get(eventName);
      if (Array.isArray(events)) {
        events.forEach((item) => {
          const { listener, context } = item;
          if (typeof listener === "function") {
            listener.apply(context || this, data);
          }
        });
      }
    }
    removeAllListeners(eventName) {
      if (typeof eventName === "string") {
        this._events.delete(eventName);
        return;
      }
      this._events = /* @__PURE__ */ new Map();
    }
    trigger(eventName, params2) {
      const events = this._events.get(eventName);
      if (Array.isArray(events)) {
        if (typeof params2 === "string") {
          params2 = JSON.parse(params2);
        }
        events.forEach((item) => {
          const { listener, context } = item;
          if (typeof listener === "function") {
            listener.call(context || this, params2);
          }
        });
      }
    }
    toggle(eventName, ...data) {
      this.emit(eventName, data);
    }
  };
  function createEventEmitter() {
    return new EventEmitter();
  }

  // src/modules/event/aop.ts
  var AopManager = class {
    constructor() {
      this._beforePublishEvent = new BeforePublishEvent();
    }
  };
  var BeforePublishEvent = class extends EventEmitter {
    add(eventName, callback, context) {
      super.addListener(eventName, callback, context);
      return this;
    }
    remove(eventName, callback) {
      super.removeListener(eventName, callback);
      return this;
    }
  };

  // src/modules/event/index.ts
  var event_default = EventEmitter;

  // src/modules/nativeModules/textInfo.ts
  var TextInfoManager = class {
    constructor(nativeModules) {
      this._textInfoModule = void 0;
      this.getTextInfo = (param, options) => {
        if (this._textInfoModule === void 0) {
          this._textInfoModule = this._nativeModules.LynxTextInfoModule;
        }
        if (this._textInfoModule && this._textInfoModule.getTextInfo) {
          return this._textInfoModule.getTextInfo(param, options);
        } else {
          return {
            width: param.length
          };
        }
      };
      this._nativeModules = nativeModules;
    }
  };

  // src/modules/nativeModules/exposure.ts
  var ExposureManager = class {
    constructor(nativeModules) {
      this.resumeExposure = () => {
        this._exposureModule.resumeExposure();
      };
      this.stopExposure = (options) => {
        this._exposureModule.stopExposure(options);
      };
      this.setObserverFrameRate = (options) => {
        this._exposureModule.setObserverFrameRate(options);
      };
      this._nativeModules = nativeModules;
      this._exposureModule = this._nativeModules.LynxExposureModule;
    }
  };

  // src/modules/nativeModules/intersectionObserver.ts
  var IntersectionObservationTarget = class {
    constructor(selector, callback) {
      this._selector = selector;
      this._callback = callback;
    }
    invokeCallback(data) {
      this._callback(data);
    }
  };
  var IntersectionObserver = class {
    constructor(id, intersectionObserverModule, manager) {
      this._id = id;
      this._intersectionObserverModule = intersectionObserverModule;
      this._manager = manager;
      this._observationTargets = [];
      this._defaultMargins = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      };
    }
    relativeTo(selector, margins) {
      this._intersectionObserverModule.relativeTo(
        this._id,
        selector,
        margins || this._defaultMargins
      );
      return this;
    }
    relativeToViewport(margins) {
      this._intersectionObserverModule.relativeToViewport(
        this._id,
        margins || this._defaultMargins
      );
      return this;
    }
    relativeToScreen(margins) {
      this._intersectionObserverModule.relativeToScreen(
        this._id,
        margins || this._defaultMargins
      );
      return this;
    }
    observe(selector, callback) {
      this._observationTargets.push(
        new IntersectionObservationTarget(selector, callback)
      );
      this._intersectionObserverModule.observe(
        this._id,
        selector,
        this._observationTargets.length - 1
      );
    }
    disconnect() {
      this._intersectionObserverModule.disconnect(this._id);
      this._manager.removeObserver(this._id);
    }
    invokeCallback(callbackId, data) {
      if (callbackId < this._observationTargets.length) {
        this._observationTargets[callbackId].invokeCallback(data);
      }
    }
  };
  var IntersectionObserverManager = class {
    constructor(nativeModules) {
      this._nativeModules = nativeModules;
      this._observerId = 0;
      this._observers = {};
      this._defaultOptions = {
        thresholds: [0],
        initialRatio: 0,
        observeAll: false
      };
    }
    createIntersectionObserver(componentId, options) {
      let intersectionObserverModule = this._nativeModules["IntersectionObserver\
Module"];
      const observer = new IntersectionObserver(
        this._observerId,
        intersectionObserverModule,
        this
      );
      this._observers[this._observerId] = observer;
      intersectionObserverModule.createIntersectionObserver(
        this._observerId,
        componentId,
        options || this._defaultOptions
      );
      this._observerId++;
      return observer;
    }
    getObserver(observerId) {
      return this._observers[observerId];
    }
    removeObserver(observerId) {
      this._observers[observerId] = null;
    }
  };

  // src/modules/performance/performanceObserver.ts
  var ListenerKeys = {
    onPerformance: "lynx.performance.onPerformanceEvent"
  };
  var PerformanceObserver = class {
    constructor(emitter, callback) {
      this._emitter = emitter;
      this._onPerformance = callback;
      this._observedNames = [];
    }
    observe(names) {
      if (this._observedNames.length > 0) {
        return;
      }
      this._observedNames = names;
      this._emitter.addListener(
        ListenerKeys.onPerformance,
        this.onPerformanceEvent.bind(this)
      );
    }
    disconnect() {
      this._observedNames = [];
      this._emitter.removeListener(
        ListenerKeys.onPerformance,
        this.onPerformanceEvent.bind(this)
      );
    }
    onPerformanceEvent(entry) {
      if (this._observedNames.length === 0) {
        return;
      }
      let entryName2 = entry.entryType + "." + entry.name;
      if (this._observedNames.includes(entryName2) || this._observedNames.includes(
      entry.entryType)) {
        this._onPerformance(entry);
      }
    }
  };

  // src/modules/performance/performance.ts
  var ListenerKeys2 = {
    onSetup: "lynx.performance.timing.onSetup",
    onUpdate: "lynx.performance.timing.onUpdate"
  };
  var Performance = class {
    constructor(emitter, nativeApp) {
      this._emitter = emitter;
      this._generatePipelineOptions = nativeApp.generatePipelineOptions;
      this._onPipelineStart = nativeApp.onPipelineStart;
      this._markTiming = nativeApp.markPipelineTiming;
      this._profileStart = nativeApp.profileStart;
      this._profileEnd = nativeApp.profileEnd;
      this._profileMark = nativeApp.profileMark;
      this._profileFlowId = nativeApp.profileFlowId;
      this._isProfileRecording = nativeApp.isProfileRecording;
      this._bindPipelineIdWithTimingFlag = nativeApp.bindPipelineIdWithTimingFlag;
    }
    profileStart(traceName, option) {
      this._profileStart(traceName, option);
    }
    profileEnd() {
      this._profileEnd();
    }
    profileMark(traceName, option) {
      this._profileMark(traceName, option);
    }
    profileFlowId() {
      return this._profileFlowId();
    }
    createObserver(callback) {
      return new PerformanceObserver(this._emitter, callback);
    }
    isProfileRecording() {
      return this._isProfileRecording();
    }
    addTimingListener(listener) {
      this._emitter.addListener(ListenerKeys2.onSetup, listener.onSetup, listener);
      this._emitter.addListener(
        ListenerKeys2.onUpdate,
        listener.onUpdate,
        listener
      );
    }
    removeTimingListener(listener) {
      this._emitter.removeListener(ListenerKeys2.onSetup, listener.onSetup);
      this._emitter.removeListener(ListenerKeys2.onUpdate, listener.onUpdate);
    }
    removeAllTimingListener() {
      this._emitter.removeAllListeners(ListenerKeys2.onSetup);
      this._emitter.removeAllListeners(ListenerKeys2.onUpdate);
    }
    _initializeAndStartPipeline() {
      const pipelineOptions = this._generatePipelineOptions();
      if (pipelineOptions) {
        this._onPipelineStart(pipelineOptions.pipelineID);
      }
      return pipelineOptions;
    }
    _checkAndBindTimingFlag(pipelineOptions, data) {
      if (!pipelineOptions) {
        return;
      }
      const PerformanceTimingFlag = "__lynx_timing_flag";
      if (data[PerformanceTimingFlag]) {
        this._bindPipelineIdWithTimingFlag(
          pipelineOptions.pipelineID,
          data[PerformanceTimingFlag]
        );
        this._markTiming(pipelineOptions.pipelineID, "update_set_state_trigger");
        pipelineOptions.needTimestamps = true;
      }
    }
  };

  // src/modules/performance/index.ts
  var performance_default = Performance;

  // src/common/jsbi.ts
  var jsbi_default = nativeGlobal_default2.LynxJSBI;

  // src/util/cachedFunctionProxy.ts
  var CachedFunctionProxy = class _CachedFunctionProxy {
    constructor(obj) {
      this._cachedFunctions = {};
      for (const key in obj) {
        Object.defineProperty(this, key, {
          get() {
            if (this._cachedFunctions[key]) {
              return this._cachedFunctions[key];
            }
            const value = obj[key];
            if (typeof value === "function") {
              this._cachedFunctions[key] = value;
            }
            return value;
          }
        });
      }
    }
    static create(obj) {
      return new _CachedFunctionProxy(obj);
    }
  };

  // src/util/setup-promise.ts
  function getPromiseMaybePolyfill(setTimeout2, onUnhandled, clearTimeout, queueMicrotask = void 0, enableMicrotaskPromisePolyfill = false) {
    const { getPromise } = nativeGlobal_default2;
    if (typeof getPromise === "function") {
      const nextTick = enableMicrotaskPromisePolyfill ? queueMicrotask : (fn) => setTimeout2(
      fn, 0);
      return getPromise({ nextTick, setTimeout: setTimeout2, onUnhandled, clearTimeout });
    } else {
      return nativeGlobal_default2.Promise;
    }
  }

  // src/modules/fetch/BodyMixin.ts
  var BodyMixin = class _BodyMixin {
    constructor() {
      this._bodyData = null;
    }
    setBody(body) {
      if (body instanceof _BodyMixin) {
        this._bodyData = body._bodyData.clone;
      } else {
        let bodyInitNative = {
          bodyData: body,
          isArrayBuffer: false
        };
        if (body instanceof ArrayBuffer) {
          bodyInitNative.isArrayBuffer = true;
        } else if (body instanceof DataView) {
          bodyInitNative.isArrayBuffer = true;
          bodyInitNative.bodyData = body.buffer.slice(
            body.byteOffset,
            body.byteOffset + body.byteLength
          );
        } else if (ArrayBuffer.isView(body)) {
          bodyInitNative.isArrayBuffer = true;
          bodyInitNative.bodyData = body.buffer;
        } else if (globalThis.URLSearchParams && body instanceof URLSearchParams) {
          bodyInitNative.bodyData = body.toString();
        }
        this._bodyData = globalThis.CreateBodyNative(bodyInitNative);
      }
    }
    arrayBuffer() {
      return Promise.resolve(this._bodyData.arrayBuffer);
    }
    text() {
      return Promise.resolve(this._bodyData.text);
    }
    json() {
      return Promise.resolve(this._bodyData.json);
    }
    get bodyUsed() {
      return this._bodyData.bodyUsed;
    }
  };

  // src/modules/fetch/Headers.ts
  var _a2;
  var Headers2 = class _Headers {
    constructor(init) {
      this._headers_map = /* @__PURE__ */ new Map();
      this[_a2] = "Headers";
      if (init === null || typeof init === "number") {
        throw new TypeError(`Headers init with null/number`);
      }
      if (init instanceof _Headers) {
        for (const [key, value] of init) {
          this.append(key, value);
        }
      } else if (Array.isArray(init)) {
        init.forEach(([name, value]) => {
          this.append(name, Array.isArray(value) ? value.join(" ") : value);
        });
      } else if (init) {
        Object.getOwnPropertyNames(init).forEach((name) => {
          const value = init[name];
          this.append(name, Array.isArray(value) ? value.join(" ") : value);
        });
      }
    }
    [(_a2 = Symbol.toStringTag, Symbol.iterator)]() {
      return this.entries();
    }
    *keys() {
      for (const [key, value] of this._headers_map) {
        yield key;
      }
    }
    *values() {
      for (const [key, value] of this._headers_map) {
        yield value;
      }
    }
    *entries() {
      for (const entry of this._headers_map) {
        yield entry;
      }
    }
    /**
     * Returns a boolean stating whether a `Headers` object contains a certain header.
     */
    has(name) {
      return this._headers_map.has(name);
    }
    /**
     * Returns a `ByteString` sequence of all the values of a header with a given name.
     */
    get(name) {
      var _a3;
      return (_a3 = this._headers_map.get(name)) != null ? _a3 : null;
    }
    /**
     * Sets a new value for an existing header inside a `Headers` object, or adds the header if it does not already exist.
     */
    set(name, value) {
      this._headers_map.set(name, String(value));
    }
    /**
     * Appends a new value onto an existing header inside a `Headers` object, or adds the header if it does not already exist.
     */
    append(name, value) {
      let resolvedValue = this.has(name) ? `${this.get(name)}, ${value}` : value;
      this.set(name, resolvedValue);
    }
    /**
     * Deletes a header from the `Headers` object.
     */
    delete(name) {
      if (!this.has(name)) {
        return;
      }
      this._headers_map.delete(name);
    }
    /**
     * Traverses the `Headers` object,
     * calling the given callback for each header.
     */
    forEach(callback, thisArg) {
      for (const [name, value] of this.entries()) {
        callback.call(thisArg, value, name, this);
      }
    }
  };

  // src/modules/fetch/AbortController.ts
  var AbortSignal = class _AbortSignal extends event_default {
    get aborted() {
      return this._aborted;
    }
    get reason() {
      return this._reason;
    }
    constructor() {
      super();
      this._aborted = false;
    }
    get [Symbol.toStringTag]() {
      return "[object AbortSignal]";
    }
    dispatchEvent(event) {
      if (event.type === "abort") {
        this._aborted = true;
        this._reason = event.reason;
        if (typeof this.onabort === "function") {
          this.onabort.call(this, event);
        }
      }
      super.emit(event.type, event);
    }
    addEventListener(type, listener) {
      super.addListener(type, listener);
    }
    static __create() {
      return new _AbortSignal();
    }
  };
  var AbortController = class {
    get signal() {
      return this._signal;
    }
    constructor() {
      this._signal = AbortSignal.__create();
    }
    abort(reason) {
      let signalReason = reason;
      if (signalReason === void 0) {
        signalReason = new Error("This operation was aborted");
        signalReason.name = "AbortError";
      }
      const event = {
        type: "abort",
        reason: signalReason
      };
      this.signal.dispatchEvent(event);
    }
    get [Symbol.toStringTag]() {
      return "[object AbortController]";
    }
  };

  // src/modules/fetch/Request.ts
  function createRequestClass(Promise2) {
    return class Request extends BodyMixin {
      get url() {
        return this._url;
      }
      get headers() {
        return this._headers;
      }
      get method() {
        return this._method;
      }
      get signal() {
        return this._signal;
      }
      get lynxExtension() {
        return this._lynxExtension;
      }
      constructor(input, options) {
        super();
        options = options || {};
        if (input instanceof Request) {
          if (input.bodyUsed) {
            throw new TypeError("Already read");
          }
          this._url = input.url;
          if (!options.headers) {
            this._headers = new Headers2(input.headers);
          }
          this._method = input.method;
          this._signal = input.signal;
        } else {
          this._url = String(input);
        }
        if (options.headers || !this.headers) {
          this._headers = new Headers2(options.headers);
        }
        this._method = options.method || this.method || "GET";
        this._method = this._method.toUpperCase();
        if ((this.method === "GET" || this.method === "HEAD") && options.body) {
          throw new TypeError("Body not allowed for GET or HEAD requests");
        }
        if (typeof options.signal !== "undefined") {
          this._signal = options.signal;
        }
        this._signal = this._signal || AbortSignal.__create();
        this._lynxExtension = options.lynxExtension || {};
        if (!this._headers.get("Content-Type")) {
          if (typeof options.body === "string") {
            this._headers.set("Content-Type", "text/plain;charset=UTF-8");
          } else if (globalThis.URLSearchParams && options.body instanceof URLSearchParams) {
            this._headers.set(
              "Content-Type",
              "application/x-www-form-urlencoded;charset=UTF-8"
            );
          } else if (options.body instanceof ArrayBuffer) {
          } else {
            this._headers.set("Content-Type", "text/plain;charset=UTF-8");
          }
        }
        this.setBody(options.body);
      }
      clone() {
        const cloned = new Request(this, {
          method: this.method
        });
        cloned.setBody(this);
        return cloned;
      }
    };
  }

  // src/modules/fetch/Response.ts
  function createResponseClass(Promise2) {
    return class Response extends BodyMixin {
      get url() {
        return this._url;
      }
      get status() {
        return this._status;
      }
      get statusText() {
        return this._statusText;
      }
      get ok() {
        return this._ok;
      }
      get headers() {
        return this._headers;
      }
      get lynxExtension() {
        return this._lynxExtension;
      }
      constructor(bodyInit, options) {
        super();
        options = options || {};
        this._status = options.status === void 0 ? 200 : options.status;
        if (this._status < 200 || this._status > 599) {
          throw new RangeError(
            "Failed to construct 'Response': The status provided (0) is outside \
the range [200, 599]."
          );
        }
        this._ok = this._status >= 200 && this._status < 300;
        this._statusText = options.statusText === void 0 ? "" : "" + options.statusText;
        this._headers = new Headers(options.headers);
        this._url = options.url || "";
        this._lynxExtension = options.lynxExtension || {};
        this.setBody(bodyInit);
      }
      clone() {
        const cloned = new Response(null, {
          status: this._status,
          statusText: this._statusText,
          headers: new Headers(this._headers),
          url: this._url
        });
        cloned.setBody(this);
        return cloned;
      }
    };
  }

  // src/modules/fetch/URL.js
  function validateBaseUrl(url) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)*(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/.
    test(
      url
    );
  }
  var URL = class {
    constructor(url, base) {
      __publicField(this, "_url");
      __publicField(this, "_searchParamsInstance", null);
      let baseUrl = null;
      if (!base || validateBaseUrl(url)) {
        this._url = url;
        if (!this._url.endsWith("/")) {
          this._url += "/";
        }
      } else {
        if (typeof base === "string") {
          baseUrl = base;
          if (!validateBaseUrl(baseUrl)) {
            throw new TypeError(`Invalid base URL: ${baseUrl}`);
          }
        } else {
          baseUrl = base.toString();
        }
        if (baseUrl.endsWith("/")) {
          baseUrl = baseUrl.slice(0, baseUrl.length - 1);
        }
        if (!url.startsWith("/")) {
          url = `/${url}`;
        }
        if (baseUrl.endsWith(url)) {
          url = "";
        }
        this._url = `${baseUrl}${url}`;
      }
    }
    get href() {
      return this.toString();
    }
    get searchParams() {
      if (this._searchParamsInstance == null) {
        this._searchParamsInstance = new URLSearchParams();
      }
      return this._searchParamsInstance;
    }
    toJSON() {
      return this.toString();
    }
    toString() {
      if (this._searchParamsInstance === null) {
        return this._url;
      }
      const instanceString = this._searchParamsInstance.toString();
      const separator = this._url.indexOf("?") > -1 ? "&" : "?";
      return this._url + separator + instanceString;
    }
  };

  // src/modules/fetch/UrlSearchParamsPolyfill.js
  function URLSearchParamsPolyfill(self) {
    "use strict";
    var _a3;
    const __URLSearchParams__ = "__URLSearchParams__";
    function URLSearchParamsPolyfill2(search) {
      search = search || "";
      if (search instanceof URLSearchParams) {
        search = search.toString();
      }
      this[__URLSearchParams__] = parseToDict(search);
    }
    const prototype = URLSearchParamsPolyfill2.prototype;
    prototype.append = function(name, value) {
      appendTo(this[__URLSearchParams__], name, value);
    };
    prototype["delete"] = function(name) {
      delete this[__URLSearchParams__][name];
    };
    prototype.get = function(name) {
      var dict = this[__URLSearchParams__];
      return this.has(name) ? dict[name][0] : null;
    };
    prototype.getAll = function(name) {
      var dict = this[__URLSearchParams__];
      return this.has(name) ? dict[name].slice(0) : [];
    };
    prototype.has = function(name) {
      return hasOwnProperty(this[__URLSearchParams__], name);
    };
    prototype.set = function set(name, value) {
      this[__URLSearchParams__][name] = ["" + value];
    };
    prototype.toString = function() {
      var dict = this[__URLSearchParams__], query = [], i, key, name, value;
      for (key in dict) {
        name = encode(key);
        for (i = 0, value = dict[key]; i < value.length; i++) {
          query.push(name + "=" + encode(value[i]));
        }
      }
      return query.join("&");
    };
    prototype.polyfill = true;
    prototype[Symbol.toStringTag] = "URLSearchParams";
    prototype.forEach = function(callback, thisArg) {
      var dict = parseToDict(this.toString());
      Object.getOwnPropertyNames(dict).forEach(function(name) {
        dict[name].forEach(function(value) {
          callback.call(thisArg, value, name, this);
        }, this);
      }, this);
    };
    prototype.sort = function() {
      var dict = parseToDict(this.toString()), keys = [], k, i, j;
      for (k in dict) {
        keys.push(k);
      }
      keys.sort();
      for (i = 0; i < keys.length; i++) {
        this["delete"](keys[i]);
      }
      for (i = 0; i < keys.length; i++) {
        var key = keys[i], values = dict[key];
        for (j = 0; j < values.length; j++) {
          this.append(key, values[j]);
        }
      }
    };
    prototype.keys = function() {
      var items = [];
      this.forEach(function(item, name) {
        items.push(name);
      });
      return makeIterator(items);
    };
    prototype.values = function() {
      var items = [];
      this.forEach(function(item) {
        items.push(item);
      });
      return makeIterator(items);
    };
    prototype.entries = function() {
      var items = [];
      this.forEach(function(item, name) {
        items.push([name, item]);
      });
      return makeIterator(items);
    };
    prototype[Symbol.iterator] = prototype.entries;
    Object.defineProperty(prototype, "size", {
      get: function() {
        var dict = parseToDict(this.toString());
        if (prototype === this) {
          throw new TypeError("Illegal invocation at URLSearchParams.invokeGette\
r");
        }
        return Object.keys(dict).reduce(function(prev, cur) {
          return prev + dict[cur].length;
        }, 0);
      }
    });
    function encode(str) {
      var replace = {
        "!": "%21",
        "'": "%27",
        "(": "%28",
        ")": "%29",
        "~": "%7E",
        "%20": "+",
        "%00": "\0"
      };
      return encodeURIComponent(str).replace(/[!'\(\)~]|%20|%00/g, function(match) {
        return replace[match];
      });
    }
    function decode(str) {
      return str.replace(/[ +]/g, "%20").replace(/(%[a-f0-9]{2})+/ig, function(match) {
        return decodeURIComponent(match);
      });
    }
    function makeIterator(arr) {
      var iterator = {
        next: function() {
          var value = arr.shift();
          return { done: value === void 0, value };
        }
      };
      iterator[Symbol.iterator] = function() {
        return iterator;
      };
      return iterator;
    }
    function parseToDict(search) {
      var dict = {};
      if (typeof search === "object") {
        if (isArray(search)) {
          for (var i = 0; i < search.length; i++) {
            var item = search[i];
            if (isArray(item) && item.length === 2) {
              appendTo(dict, item[0], item[1]);
            } else {
              throw new TypeError("Failed to construct 'URLSearchParams': Sequen\
ce initializer must only contain pair elements");
            }
          }
        } else {
          for (var key in search) {
            if (search.hasOwnProperty(key)) {
              appendTo(dict, key, search[key]);
            }
          }
        }
      } else {
        if (search.indexOf("?") === 0) {
          search = search.slice(1);
        }
        var pairs = search.split("&");
        for (var j = 0; j < pairs.length; j++) {
          var value = pairs[j], index = value.indexOf("=");
          if (-1 < index) {
            appendTo(dict, decode(value.slice(0, index)), decode(value.slice(index +
            1)));
          } else {
            if (value) {
              appendTo(dict, decode(value), "");
            }
          }
        }
      }
      return dict;
    }
    function appendTo(dict, name, value) {
      var val = typeof value === "string" ? value : value !== null && value !== void 0 &&
      typeof value.toString === "function" ? value.toString() : JSON.stringify(value);
      if (hasOwnProperty(dict, name)) {
        dict[name].push(val);
      } else {
        dict[name] = [val];
      }
    }
    function isArray(val) {
      return !!val && "[object Array]" === Object.prototype.toString.call(val);
    }
    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
    self.URLSearchParams = (_a3 = self.URLSearchParams) != null ? _a3 : URLSearchParamsPolyfill2;
  }

  // src/app/app.ts
  var _BaseApp = class _BaseApp {
    constructor(options, baseAppSingleData) {
      this.dataTypeSet = /* @__PURE__ */ new Set([
        "string",
        "number",
        "array",
        "object",
        "boolean",
        "null",
        "function"
      ]);
      this.removeInternalEventListenersCallbacks = [];
      /**
       * Set sourcemap release with a newly thrown error
       * @param {Error} error
       * The error thrown from the file that wants to set sourcemap release.
       * The top frame of `error.stack` **must be** the filename.
       * The `error.name` **must be** `'LynxGetSourceMapReleaseError'`.
       * The `error.message` **must be** the sourcemap release.
       *
       * @example
       * (function () {
       *   try {
       *     throw new Error(sourcemapRelease);
       *   } catch (e) {
       *     e.name = 'LynxGetSourceMapReleaseError';
       *     tt.setSourceMapRelease(e);
       *   }
       * })()
       */
      this.setSourceMapRelease = (error) => {
        this.Reporter.setSourceMapRelease(error);
      };
      this.getSourceMapRelease = (url) => {
        return this.Reporter.getSourceMapRelease(url);
      };
      this.setupGetTextInfoApi = () => {
        this._apiList["getTextInfo"] = (text, options) => {
          return this._textInfoManager.getTextInfo(text, options);
        };
      };
      this.setupExposureApi = () => {
        this._apiList["resumeExposure"] = () => {
          this._exposureManager.resumeExposure();
        };
        this._apiList["stopExposure"] = (options) => {
          this._exposureManager.stopExposure(
            options ? options : { sendEvent: true }
          );
        };
        this._apiList["setObserverFrameRate"] = (options) => {
          this._exposureManager.setObserverFrameRate(
            options ? options : { forPageRect: 20, forExposureCheck: 20 }
          );
        };
      };
      this.requestAnimationFrame = (callback) => this._nativeApp.requestAnimationFrame(
      callback);
      this.cancelAnimationFrame = (animationId) => this._nativeApp.cancelAnimationFrame(
      animationId);
      this.__removeInternalEventListeners = () => {
        this.removeInternalEventListenersCallbacks.forEach((f) => {
          f();
        });
      };
      this.initBase(options);
      if (baseAppSingleData) {
        baseAppSingleData.transferSingletonData(
          this,
          this.__internal__callLynxSetModule.bind(this)
        );
      } else {
        this.initExtra(options);
      }
      this.setTimeout = this.nativeApp.setTimeout;
      this.setInterval = this.nativeApp.setInterval;
      this.clearInterval = this.nativeApp.clearInterval;
      this.clearTimeout = this.nativeApp.clearTimeout;
      this.addInternalEventListeners();
    }
    initExtra(options) {
      const { lynx } = options;
      this.modules = {};
      this._lazyCallableModules = /* @__PURE__ */ new Map();
      this._nativeApp = CachedFunctionProxy.create(
        this._nativeApp
      );
      this.sharedConsole = createSharedConsole(`runtimeId:${this.nativeAppId}`);
      this.dynamicComponentExports = {};
      this.loadedDynamicComponentsSet = /* @__PURE__ */ new Set();
      this._lazyCallableModules = /* @__PURE__ */ new Map();
      this.Reporter = new Reporter(
        () => this,
        () => this.nativeApp
      );
      this.GlobalEventEmitter = new event_default(
        this.__internal__callLynxSetModule.bind(this)
      );
      this._intersectionObserverManager = new IntersectionObserverManager(
        this.NativeModules
      );
      this._exposureManager = new ExposureManager(this.NativeModules);
      this.setupExposureApi();
      this._aopManager = new AopManager();
      this.beforePublishEvent = this._aopManager._beforePublishEvent;
      this.performance = new performance_default(this.GlobalEventEmitter, this.nativeApp);
      const promiseCtor = this.setupPromise(
        this.nativeApp.setTimeout,
        this.nativeApp.clearTimeout,
        lynx
      );
      this.lynx = this.createLynx(lynx, promiseCtor);
      this.setupJSModule();
      this.setupIntersectionApi();
      this.setupFetchAPI(promiseCtor);
    }
    initBase(options) {
      const { nativeApp, params: params2 } = options;
      this.nativeAppId = nativeApp.id;
      this._params = params2;
      this._nativeApp = nativeApp;
      this.NativeModules = nativeApp.nativeModuleProxy;
      this.LynxUIMethodModule = nativeApp.nativeModuleProxy.LynxUIMethodModule;
      this.LynxTestModule = nativeApp.nativeModuleProxy.LynxTestModule;
      this.LynxResourceModule = nativeApp.nativeModuleProxy.LynxResourceModule;
      this.LynxAccessibilityModule = nativeApp.nativeModuleProxy.LynxAccessibilityModule;
      this.LynxSetModule = nativeApp.nativeModuleProxy.LynxSetModule;
      this._apiList = {};
      this._textInfoManager = new TextInfoManager(this.NativeModules);
      this.setupGetTextInfoApi();
    }
    /**
     * legacy sourcemap release use url default
     * used for backward compatibility
     *
     * new template should use setSourceMapRelease
     */
    set __sourcemap__release__(release) {
      let error = new Error();
      error.name = "LynxGetSourceMapReleaseError";
      error.message = release;
      error.stack = `at <anonymous> (${_BaseApp.kDefaultSourceMapURL}:1:1)`;
      this.setSourceMapRelease(error);
    }
    destroy() {
      this.__removeInternalEventListeners();
      this._nativeApp = null;
      this._params = null;
      this._lazyCallableModules = null;
      this.GlobalEventEmitter = null;
    }
    registerModule(name, module2) {
      this._lazyCallableModules[name] = module2;
    }
    getJSModule(name) {
      return this._lazyCallableModules[name];
    }
    setupJSModule() {
      this.registerModule("GlobalEventEmitter", this.GlobalEventEmitter);
      this.registerModule("Reporter", this.Reporter);
    }
    setupFetchAPI(Promise2) {
      var _a3, _b2;
      this._createResponseClass = createResponseClass;
      this._createRequestClass = createRequestClass;
      this._RequestClass = (_a3 = nativeGlobal_default2.Request) != null ? _a3 :
      createRequestClass(Promise2);
      this._ResponseClass = (_b2 = nativeGlobal_default2.Response) != null ? _b2 :
      createResponseClass(Promise2);
      if (!nativeGlobal_default2.Request) {
        nativeGlobal_default2.Request = this._RequestClass;
      }
      if (!nativeGlobal_default2.Response) {
        nativeGlobal_default2.Response = this._ResponseClass;
      }
    }
    __internal__callLynxSetModule(functionName, payload) {
      const nativeFunction = this.LynxSetModule[functionName];
      if (nativeFunction) {
        Function.prototype.apply.call(nativeFunction, void 0, payload);
      }
    }
    get nativeApp() {
      return this._nativeApp;
    }
    set nativeApp(nativeApp) {
      this._nativeApp = nativeApp;
    }
    get params() {
      return this._params;
    }
    set apiList(api) {
      this._apiList = { ...this._apiList, ...api };
    }
    setupIntersectionApi() {
      let self = this;
      this._apiList["createIntersectionObserver"] = function(component, options) {
        const { componentId = "" } = component;
        return self._intersectionObserverManager.createIntersectionObserver(
          componentId,
          options
        );
      };
      this.lynx["createIntersectionObserver"] = this._apiList["createIntersectio\
nObserver"];
    }
    onIntersectionObserverEvent(observerId, callbackId, data) {
      const observer = this._intersectionObserverManager.getObserver(observerId);
      if (observer) {
        observer.invokeCallback(callbackId, data);
      }
    }
    reportError(error) {
      return this.lynx.reportError(error);
    }
    handleError(error, originError, errorLevel) {
      reportError(error, this.nativeApp, {
        originError,
        getSourceMapRelease: this.getSourceMapRelease,
        errorLevel
      });
    }
    handleUserError(error, cause, errorLevel, prefix) {
      let { message, name, stack } = error || {};
      if (!message) {
        ({ message, name, stack } = new Error(JSON.stringify(error)));
      }
      const userError = new UserRuntimeError(
        prefix ? `${prefix} ${name}: ${message}` : `${name}: ${message}`,
        stack
      );
      userError.cause = cause;
      this.handleError(userError, error, errorLevel);
    }
    /**
     * @internal
     */
    handleInternalError(error, cause) {
      let { message, name, stack } = error || {};
      if (!message) {
        ({ message, name, stack } = new Error(JSON.stringify(error)));
      }
      const internalError = new InternalRuntimeError(
        `${name}: ${message}`,
        stack
      );
      internalError.cause = cause;
      this.handleError(internalError, error);
    }
    /**
     * Get a external env with boolean value.
     * The same as `base::LynxEnv::GetInstance().GetBoolEnv`
     *
     * @param {EnvKey} key The {@link EnvKey}, should be placed in `lynx_env.h`
     */
    getBoolEnv(key) {
      const env = this.nativeApp.getEnv(key);
      return (env == null ? void 0 : env.toLowerCase()) === "true";
    }
    /**
     * @internal
     * Execute the loaded JS module ,  Called by {@link requireModule} & {@link requireModuleAsync}
     * @throws {UserRuntimeError} when loading or evaluating failed
     * @throws {Error} when executing failed
     */
    _$executeInit(exports, { path: path2, entryName: entryName2 }) {
      let factory;
      if (exports && exports.init) {
        factory = exports.init.bind(exports);
      } else if (nativeGlobal_default2.initBundle) {
        factory = nativeGlobal_default2.initBundle.bind(nativeGlobal_default2.initBundle);
        delete nativeGlobal_default2.initBundle;
      } else {
        throw new UserRuntimeError(
          `load failed. path:${path2},entryName:${entryName2}`
        );
      }
      try {
        nativeConsole.profile(`running ${path2} init`);
        const ret = factory({ tt: this });
        _BaseApp._$factoryCache[path2] = factory;
        return ret;
      } finally {
        nativeConsole.profileEnd();
      }
    }
    /**
     * @internal
     * Used to load the json module. Called by {@link requireModule} & {@link requireModuleAsync}
     * @param content
     * @param path
     * @private
     */
    _$executeJSON(content, { path: path2 }) {
      const ret = JSON.parse(content);
      const init = () => ret;
      _BaseApp._$factoryCache[path2] = init;
      return ret;
    }
    requireModule(path2, entryName2, options) {
      const init = _BaseApp._$factoryCache[path2];
      if (false) {
        return this._$executeInit({ init }, { path: path2, entryName: entryName2 });
      }
      if (path2.split("?")[0].endsWith(".json")) {
        const content = this.nativeApp.readScript(path2, {
          dynamicComponentEntry: entryName2 != null ? entryName2 : DEFAULT_ENTRY,
          ...options
        });
        return this._$executeJSON(content, { path: path2, entryName: entryName2 });
      }
      const exports = this.nativeApp.loadScript(path2, entryName2, options);
      return this._$executeInit(exports, { path: path2, entryName: entryName2 });
    }
    requireModuleAsync(path2, callback) {
      const init = _BaseApp._$factoryCache[path2];
      if (false) {
        callback(null, this._$executeInit({ init }, { path: path2 }));
        return;
      }
      if (path2.split("?")[0].endsWith(".json")) {
        const content = this.nativeApp.readScript(path2);
        const ret = this._$executeJSON(content, { path: path2 });
        callback(null, ret);
        return;
      }
      const error = new Error();
      this.nativeApp.loadScriptAsync(path2, (message, exports) => {
        if (message) {
          error.message = message;
          return callback(error);
        }
        try {
          return callback(null, this._$executeInit(exports, { path: path2 }));
        } catch (e) {
          return callback(e);
        }
      });
    }
    require(path, params) {
      const that = this;
      if (typeof path !== "string") {
        throw new Error("require args must be a string");
      }
      const entryName = params && params.dynamicComponentEntry ? params.dynamicComponentEntry :
      DEFAULT_ENTRY;
      if (!that.modules[entryName]) {
        that.modules[entryName] = {};
      }
      let module = that.modules[entryName][path];
      if (!module) {
        try {
          const tt = that;
          const jsContent = that._nativeApp.readScript(path, {
            dynamicComponentEntry: entryName
          });
          eval(jsContent);
          module = that.modules[entryName][path];
        } catch (e) {
          this.handleError(
            new UserRuntimeError(
              `eval user: ${that._nativeApp.id} error: ${e.message}`,
              e.stack
            ),
            e
          );
        }
        if (!that.modules[entryName][path]) {
          throw new Error(
            `module ${path} in ${entryName} is not defined in card: ${that._nativeApp.
            id}`
          );
        }
      }
      if (!module.hasRun) {
        const { factory } = module;
        const _module = {
          exports: {}
        };
        let res;
        module.hasRun = true;
        module.exports = _module.exports;
        if (typeof factory === "function") {
          const inRequireCopy = inRequire.call(that, path);
          const tt2 = that;
          res = factory(
            inRequireCopy,
            _module,
            _module.exports,
            that.Card.bind(tt2),
            that.setTimeout,
            that.setInterval,
            that.clearInterval,
            that.clearTimeout,
            that.NativeModules,
            that._apiList,
            that.sharedConsole,
            that.Component.bind(tt2),
            params == null ? void 0 : params.ReactLynx,
            that.nativeAppId,
            that.Behavior.bind(tt2),
            jsbi_default,
            that.lynx,
            void 0,
            // window
            void 0,
            // document
            void 0,
            // frames
            void 0,
            // self
            void 0,
            // location
            void 0,
            // navigator
            void 0,
            // localStorage
            void 0,
            // history
            void 0,
            // Caches
            void 0,
            // screen
            void 0,
            // alert
            void 0,
            // confirm
            void 0,
            // prompt
            that.lynx.fetch,
            // fetch
            void 0,
            // XMLHttpRequest
            void 0,
            // WebSocket
            void 0,
            // webkit
            void 0,
            // Reporter
            void 0,
            // print
            void 0,
            // global
            that.requestAnimationFrame,
            that.cancelAnimationFrame
          );
          module.exports = _module.exports || res;
        }
      }
      return module.exports;
    }
    define(path2, factory, entryName2) {
      entryName2 = entryName2 ? entryName2 : DEFAULT_ENTRY;
      if (!this.modules[entryName2]) {
        this.modules[entryName2] = {};
      }
      this.modules[entryName2][path2] = {
        hasRun: false,
        factory: factory.bind(this)
      };
    }
    /**
     * Call By Native js_app
     * @internal
     * @param module
     * @param method
     * @param args
     */
    callFunction(module2, method, args) {
      try {
        const moduleMethods = this.getJSModule(module2);
        if (typeof moduleMethods[method] === "function") {
          moduleMethods[method].apply(moduleMethods, args);
        }
      } catch (e) {
        this.handleUserError(e, { by: `${module2}.${method}` });
      }
    }
    /**
     * Call By Native js_app
     * @internal
     * @param {never} _ Used for backward compatiblity, DO NOT USE.
     * @param {Error} error the Error object emit by native.
     */
    onAppError(_, error) {
      this.handleInternalError(error);
    }
    saveDynamicComponentExports(componentUrl, moduleExports) {
      this.dynamicComponentExports[componentUrl] = moduleExports;
    }
    getDynamicComponentExports(componentUrl) {
      return this.dynamicComponentExports[componentUrl];
    }
    Component(...args) {
    }
    Card(...args) {
    }
    Behavior(...args) {
    }
    /**
     * @param setTimeout
     */
    wrapReport(setTimeout2, desc) {
      const that2 = this;
      function wrapReport(fn) {
        return function wrapReportInner(...args) {
          try {
            return fn.apply(this, args);
          } catch (e) {
            that2.handleUserError(e, { by: desc });
          }
        };
      }
      return function WrapTimeout(fn, ...args) {
        return Function.prototype.apply.call(setTimeout2, void 0, [
          wrapReport(fn),
          ...args
        ]);
      };
    }
    setupPromise(setTimeout2, clearTimeout, lynx) {
      var _a3, _b2, _c2;
      const PromiseConstructor = getPromiseMaybePolyfill(
        setTimeout2,
        (id, reason) => {
          try {
            if (reason) {
              if (!reason.stack) {
                reason = new Error(JSON.stringify(reason));
              }
              reason.name = "unhandled rejection";
              this.handleUserError(reason);
            }
          } catch (err) {
          }
        },
        clearTimeout,
        lynx.queueMicrotask,
        (_c2 = (_b2 = (_a3 = this._params) == null ? void 0 : _a3.pageConfigSubset) ==
        null ? void 0 : _b2.enableMicrotaskPromisePolyfill) != null ? _c2 : false
      );
      this.resolvedPromise = PromiseConstructor.resolve();
      return PromiseConstructor;
    }
    addInternalEventListener(contextProxyType, type, listener) {
      this.contextProxyTypeToMethod[contextProxyType]().addEventListener(
        type,
        listener
      );
      this.removeInternalEventListenersCallbacks.push(() => {
        this.contextProxyTypeToMethod[contextProxyType]().removeEventListener(
          type,
          listener
        );
      });
    }
    addInternalEventListeners() {
      if (!this.contextProxyTypeToMethod) {
        this.contextProxyTypeToMethod = {
          [0 /* CoreContext */]: () => this.lynx.getCoreContext(),
          [1 /* DevTool */]: () => this.lynx.getDevtool(),
          [2 /* JSContext */]: () => this.lynx.getJSContext(),
          [3 /* UIContext */]: () => this.lynx.getUIContext()
        };
      }
      this.addInternalEventListener(
        0 /* CoreContext */,
        "__OnNativeAppReady" /* ON_NATIVE_APP_READY */,
        () => {
          this.onNativeAppReady();
        }
      );
      this.addInternalEventListener(
        0 /* CoreContext */,
        "__NotifyGlobalPropsUpdated" /* NOTIFY_GLOBAL_PROPS_UPDATED */,
        (event) => {
          this.updateGlobalProps(event.data);
        }
      );
      this.addInternalEventListener(
        0 /* CoreContext */,
        "__OnLifecycleEvent" /* ON_LIFECYCLE_EVENT */,
        (event) => {
          this.OnLifecycleEvent(event.data);
        }
      );
      this.addInternalEventListener(
        0 /* CoreContext */,
        "__OnAppFirstScreen" /* ON_APP_FIRST_SCREEN */,
        () => {
          this.onAppFirstScreen();
        }
      );
      this.addInternalEventListener(
        0 /* CoreContext */,
        "__OnDynamicJSSourcePrepared" /* ON_DYNAMIC_JS_SOURCE_PREPARED */,
        (event) => {
          nativeGlobal_default2.loadDynamicComponent(this, event.data);
        }
      );
      this.addInternalEventListener(
        0 /* CoreContext */,
        "__OnAppEnterForeground" /* ON_APP_ENTER_FOREGROUND */,
        () => {
          this.onAppEnterForeground();
        }
      );
      this.addInternalEventListener(
        0 /* CoreContext */,
        "__OnAppEnterBackground" /* ON_APP_ENTER_BACKGROUND */,
        () => {
          this.onAppEnterBackground();
        }
      );
    }
    /**
     *  override by subclass
     * @param newData
     */
    updateGlobalProps(newData) {
    }
    /**
     *  override by subclass
     * @param newData
     */
    OnLifecycleEvent(args) {
    }
    /**
     *  override by subclass
     * @param newData
     */
    onNativeAppReady() {
    }
    /**
     *  override by subclass
     * @param newData
     */
    onAppFirstScreen() {
    }
    /**
     *  override by subclass
     * @param newData
     */
    onAppEnterBackground() {
    }
    /**
     *  override by subclass
     * @param newData
     */
    onAppEnterForeground() {
    }
  };
  _BaseApp.kDefaultSourceMapURL = "default";
  _BaseApp.kGetSourceMapReleaseErrorName = SOURCE_MAP_RELEASE_ERROR_NAME;
  /**
   * @internal
   * @static
   * The LynxGroup level cache for requireModule , {@link registerModule}
   */
  _BaseApp._$factoryCache = {};
  var BaseApp = _BaseApp;
  function pathProcess(path2) {
    const match = path2.match(/(.*)\/([^/]+)?$/);
    return (match == null ? void 0 : match[1]) ? match[1] : "./";
  }
  function inRequire(path2) {
    const that2 = this;
    const pwd = pathProcess(path2);
    return function(path3) {
      const t = [];
      const r = `${pwd}/${path3}`.split("/");
      const i = r.length;
      if (typeof path3 !== "string") {
        throw new Error("require args must be a string");
      }
      for (let o = 0; o < i; ++o) {
        const a = r[o];
        if (a !== "" && a !== ".") {
          if (a === "..") {
            if (t.length === 0) {
              throw new Error(
                `can't find module ${path3} in app: ${that2._nativeApp.id}`
              );
            }
            t.pop();
          } else {
            o + 1 < i && r[o + 1] === ".." ? o++ : t.push(a);
          }
        }
      }
      let c = t.join("/");
      return c.endsWith(".js") || (c += ".js"), that2.require(c);
    };
  }

  // src/react/reactApp.ts
  var ReactApp = class extends BaseApp {
    createLynx(nativeLynx, promiseCtor) {
      const lynx_proxy = CachedFunctionProxy.create(nativeLynx);
      return new Lynx(
        () => this.nativeApp,
        () => this,
        promiseCtor,
        () => lynx_proxy
      );
    }
    callBeforePublishEvent(eventData) {
      if (this._aopManager._beforePublishEvent.getEventsSize(eventData.type) !==
      0) {
        const copyData = { ...eventData };
        try {
          this._aopManager._beforePublishEvent.emit(copyData.type, [copyData]);
        } catch (e) {
          this.handleUserError(e, {
            by: "callBeforePublishEvent",
            type: copyData.type
          });
        }
      }
    }
  };

  // src/standalone/StandaloneApp.ts
  var BaseAppSingletonData = class {
    transferSingletonData(baseApp, callLynxSetModule) {
      baseApp.nativeApp = this.nativeApp;
      baseApp.sharedConsole = this.sharedConsole;
      baseApp.dynamicComponentExports = this.dynamicComponentExports;
      baseApp.loadedDynamicComponentsSet = this.loadedDynamicComponentsSet;
      baseApp._intersectionObserverManager = this.intersectionObserverManager;
      baseApp._exposureManager = this.exposureManager;
      baseApp._textInfoManager = this.textInfoManager;
      this.globalEventEmitter.setCallLynxSetModule(callLynxSetModule);
      baseApp.GlobalEventEmitter = this.globalEventEmitter;
      baseApp._aopManager = this.aopManager;
      baseApp.performance = this.performance;
      baseApp.modules = this.modules;
      baseApp._lazyCallableModules = this.lazyCallableModules;
      baseApp.lynx = this.lynx;
      this.lynx.rebind(() => baseApp);
      baseApp._apiList = this.apiList;
      this.Reporter.rebind(() => baseApp);
      baseApp.Reporter = this.Reporter;
      baseApp.resolvedPromise = this.resolvedPromise;
    }
  };
  var StandaloneApp = class extends BaseApp {
    constructor(options, params2) {
      super(options, void 0);
      this.fillSingletonData();
      try {
        if (params2.srcName) {
          delete this.lynx.requireModule.cache[params2.srcName];
          delete BaseApp._$factoryCache[params2.srcName];
          this.lynx.requireModule(params2.srcName, DEFAULT_ENTRY);
          this.dataTypeSet.add("undefined");
        }
      } catch (e) {
        this.handleUserError(e);
      }
    }
    createLynx(nativeLynx, promise) {
      const lynx_proxy = CachedFunctionProxy.create(nativeLynx);
      return new Lynx(
        () => this.nativeApp,
        () => this,
        promise,
        () => lynx_proxy
      );
    }
    fillSingletonData() {
      this.singletonData = new BaseAppSingletonData();
      this.singletonData.nativeApp = this._nativeApp;
      this.singletonData.sharedConsole = this.sharedConsole;
      this.singletonData.dynamicComponentExports = this.dynamicComponentExports;
      this.singletonData.loadedDynamicComponentsSet = this.loadedDynamicComponentsSet;
      this.singletonData.intersectionObserverManager = this._intersectionObserverManager;
      this.singletonData.exposureManager = this._exposureManager;
      this.singletonData.textInfoManager = this._textInfoManager;
      this.singletonData.globalEventEmitter = this.GlobalEventEmitter;
      this.singletonData.aopManager = this._aopManager;
      this.singletonData.performance = this.performance;
      this.singletonData.modules = this.modules;
      this.singletonData.lazyCallableModules = this._lazyCallableModules;
      this.singletonData.lynx = this.lynx;
      this.singletonData.apiList = this._apiList;
      this.singletonData.Reporter = this.Reporter;
      this.singletonData.resolvedPromise = this.resolvedPromise;
    }
  };

  // src/appManager.ts
  function loadCard(nativeApp, params2, lynx) {
    const { id } = nativeApp;
    const { cardType } = params2;
    alog(`load card native app id: ${id}`);
    let loadSuccess = true;
    let tt2;
    try {
      if (cardType == "standalone") {
        tt2 = new StandaloneApp({ nativeApp, params: params2, lynx }, params2);
      } else {
        tt2 = new ReactApp({
          nativeApp,
          params: params2,
          lynx
        });
      }
      nativeGlobal_default2.currentAppId = id;
      nativeGlobal_default2.multiApps[id] = tt2;
      if (cardType === "standalone") {
        nativeApp.setCard(tt2);
        return true;
      }
      alog(
        `load card native app load app-service.js params.bundleSupportLoadScript\
 ${params2.bundleSupportLoadScript}`
      );
      loadSuccess = true;
      if (false) {
        tt2.lynx.requireModuleAsync(APP_SERVICE_NAME, (error, ret) => {
          if (error) {
            tt2.handleUserError(error);
          } else {
            if (tt2.lynx._switches["allowUndefinedInNativeDataTypeSet"]) {
              tt2.dataTypeSet.add("undefined");
            }
          }
          nativeApp.setCard(tt2);
        });
      }
      if (true) {
        try {
          delete tt2.lynx.requireModule.cache[APP_SERVICE_NAME];
          delete BaseApp._$factoryCache[APP_SERVICE_NAME];
          tt2.lynx.requireModule(APP_SERVICE_NAME, DEFAULT_ENTRY);
          if (tt2.lynx._switches["allowUndefinedInNativeDataTypeSet"]) {
            tt2.dataTypeSet.add("undefined");
          }
        } catch (e) {
          loadSuccess = false;
          tt2.handleUserError(e, void 0, void 0, "loadCard failed");
        }
      }
      nativeApp.setCard(tt2);
    } catch (e) {
      handleLoadCardError(nativeApp, e);
      loadSuccess = false;
    }
    return loadSuccess;
  }
  function destroyCard(id) {
    alog(`destroy ${id}`);
    const appInstance = nativeGlobal_default2.multiApps[id];
    appInstance.destroy();
    delete nativeGlobal_default2.multiApps[id];
  }
  function callDestroyLifetimeFun(id) {
    alog(`callDestroyLifetimeFun ${id}`);
    const appInstance = nativeGlobal_default2.multiApps[id];
    appInstance.callDestroyLifetimeFun();
  }
  function loadDynamicComponent(tt2, componentUrl) {
    if (tt2.loadedDynamicComponentsSet.has(componentUrl)) {
      return tt2.getDynamicComponentExports(componentUrl);
    }
    const preEntry = nativeGlobal_default2.globDynamicComponentEntry;
    nativeGlobal_default2.globDynamicComponentEntry = componentUrl;
    try {
      delete tt2.lynx.requireModule.cache[APP_SERVICE_NAME];
      delete BaseApp._$factoryCache[APP_SERVICE_NAME];
      const ret = tt2.lynx.requireModule(APP_SERVICE_NAME, componentUrl);
      tt2.saveDynamicComponentExports(componentUrl, ret);
      tt2.loadedDynamicComponentsSet.add(componentUrl);
      return ret;
    } catch (error) {
      tt2.handleUserError(error);
    } finally {
      nativeGlobal_default2.globDynamicComponentEntry = preEntry;
    }
  }
  function handleLoadCardError(nativeApp, error, cause) {
    let { message, name, stack } = error || {};
    if (!message) {
      ({ message, name, stack } = new Error(JSON.stringify(error)));
    }
    const internalError = new InternalRuntimeError(
      `loadCard failed ${name}: ${message}`,
      stack
    );
    internalError.cause = cause;
    reportError(internalError, nativeApp, {
      originError: error,
      getSourceMapRelease: (url) => {
        let ret = nativeApp.__GetSourceMapRelease(url);
        if (!ret) {
          return nativeApp.__GetSourceMapRelease(BaseApp.kDefaultSourceMapURL);
        }
      }
    });
  }

  // src/polyfill/arraybuffer.ts
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var lookup = new Uint8Array(256);
  for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }
  function arrayBufferToBase64(buffer) {
    var bytes = new Uint8Array(buffer);
    var i;
    var len = bytes.length;
    var base64 = "";
    for (i = 0; i < len; i += 3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
      base64 += chars[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
      base64 += chars[bytes[i + 2] & 63];
    }
    if (len % 3 === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }
    return base64;
  }
  function base64ToArrayBuffer(base64) {
    let bufferLength = base64.length * 0.75;
    const len = base64.length;
    let i;
    let p = 0;
    let encoded1;
    let encoded2;
    let encoded3;
    let encoded4;
    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }
    let arraybuffer = new ArrayBuffer(bufferLength);
    let bytes = new Uint8Array(arraybuffer);
    for (i = 0; i < len; i += 4) {
      encoded1 = lookup[base64.charCodeAt(i)];
      encoded2 = lookup[base64.charCodeAt(i + 1)];
      encoded3 = lookup[base64.charCodeAt(i + 2)];
      encoded4 = lookup[base64.charCodeAt(i + 3)];
      bytes[p++] = encoded1 << 2 | encoded2 >> 4;
      bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
      bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
    }
    return arraybuffer;
  }

  // src/index.card.ts
  nativeGlobal_default2.loadCard = loadCard;
  nativeGlobal_default2.destroyCard = destroyCard;
  nativeGlobal_default2.callDestroyLifetimeFun = callDestroyLifetimeFun;
  nativeGlobal_default2.loadDynamicComponent = loadDynamicComponent;
  nativeGlobal_default2.__createEventEmitter = createEventEmitter;
  nativeGlobal_default2.__lynxArrayBufferToBase64 = arrayBufferToBase64;
  nativeGlobal_default2.__lynxBase64ToArrayBuffer = base64ToArrayBuffer;
  nativeGlobal_default2.LynxSDKCore = {
    report: legacyReportError,
    reportInner: wrapInnerFunction,
    reportUser: wrapUserFunction
  };
  nativeGlobal_default2.Headers = Headers2;
  nativeGlobal_default2.AbortController = AbortController;
  nativeGlobal_default2.AbortSignal = AbortSignal;
  nativeGlobal_default2.URL = URL;
  URLSearchParamsPolyfill(nativeGlobal_default2);
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbHlueC1wcm9taXNlL3NyYy9jb3JlLmpzIiwgIi4uLy4uL2x5bngtcHJvbWlzZS9zcmMvZXM2LWV4dGVuc2lvbnMuanMiLCAiLi4vLi4vbHlueC1wcm9taXNlL3NyYy9yZWplY3Rpb24tdHJhY2tpbmcuanMiLCAiLi4vLi4vbHlueC1wcm9taXNlL3NyYy9pbmRleC5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcmVnZW5lcmF0b3ItcnVudGltZUAwLjEzLjcvbm9kZV9tb2R1bGVzL3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZS5qcyIsICIuLi9rZXJuZWwtYnVpbGQvYW5kcm9pZC1wb2x5ZmlsbC5qcyIsICIuLi9zcmMvaW5kZXguYnVpbGQudHMiLCAiLi4vLi4vbHlueC1ydW50aW1lLXNoYXJlZC9zcmMvbmF0aXZlR2xvYmFsLnRzIiwgIi4uLy4uL2x5bngtcnVudGltZS1zaGFyZWQvc3JjL3V0aWxzLnRzIiwgIi4uLy4uL2x5bngtcnVudGltZS1zaGFyZWQvc3JjL3R0Q29uc29sZS50cyIsICIuLi9zcmMvY29tbW9uL3R0Q29uc29sZS50cyIsICIuLi9zcmMvbW9kdWxlcy9yZXBvcnQvZXJyb3JzLnRzIiwgIi4uL3NyYy9jb21tb24vY29uc3RhbnRzLnRzIiwgIi4uL3NyYy9tb2R1bGVzL3NoYXJlZERhdGEvU2hhcmVEYXRhU3ViamVjdC50cyIsICIuLi9zcmMvY29tbW9uL25hdGl2ZUdsb2JhbC50cyIsICIuLi9zcmMvY29tbW9uL2xvZy50cyIsICIuLi9zcmMvY29tbW9uL3ZlcnNpb24udHMiLCAiLi4vc3JjL21vZHVsZXMvcmVwb3J0L3JlcG9ydC1lcnJvci50cyIsICIuLi9zcmMvbW9kdWxlcy9yZXBvcnQvd3JhcHBlci50cyIsICIuLi9zcmMvbW9kdWxlcy9yZXBvcnQvcmVwb3J0ZXIudHMiLCAiLi4vc3JjL21vZHVsZXMvYW5pbWF0aW9uL2FuaW1hdGlvbi50cyIsICIuLi9zcmMvbW9kdWxlcy9hbmltYXRpb24vZWZmZWN0LnRzIiwgIi4uL3NyYy9tb2R1bGVzL2VsZW1lbnQvZWxlbWVudC50cyIsICIuLi9zcmMvbW9kdWxlcy9lbGVtZW50L2luZGV4LnRzIiwgIi4uL3NyYy9tb2R1bGVzL3NlbGVjdG9yUXVlcnkvU2VsZWN0b3JRdWVyeS50cyIsICIuLi9zcmMvbHlueC9seW54LnRzIiwgIi4uL3NyYy9tb2R1bGVzL2V2ZW50L2V2ZW50RW1pdHRlci50cyIsICIuLi9zcmMvbW9kdWxlcy9ldmVudC9hb3AudHMiLCAiLi4vc3JjL21vZHVsZXMvZXZlbnQvaW5kZXgudHMiLCAiLi4vc3JjL21vZHVsZXMvbmF0aXZlTW9kdWxlcy90ZXh0SW5mby50cyIsICIuLi9zcmMvbW9kdWxlcy9uYXRpdmVNb2R1bGVzL2V4cG9zdXJlLnRzIiwgIi4uL3NyYy9tb2R1bGVzL25hdGl2ZU1vZHVsZXMvaW50ZXJzZWN0aW9uT2JzZXJ2ZXIudHMiLCAiLi4vc3JjL21vZHVsZXMvcGVyZm9ybWFuY2UvcGVyZm9ybWFuY2VPYnNlcnZlci50cyIsICIuLi9zcmMvbW9kdWxlcy9wZXJmb3JtYW5jZS9wZXJmb3JtYW5jZS50cyIsICIuLi9zcmMvbW9kdWxlcy9wZXJmb3JtYW5jZS9pbmRleC50cyIsICIuLi9zcmMvY29tbW9uL2pzYmkudHMiLCAiLi4vc3JjL3V0aWwvY2FjaGVkRnVuY3Rpb25Qcm94eS50cyIsICIuLi9zcmMvdXRpbC9zZXR1cC1wcm9taXNlLnRzIiwgIi4uL3NyYy9tb2R1bGVzL2ZldGNoL0JvZHlNaXhpbi50cyIsICIuLi9zcmMvbW9kdWxlcy9mZXRjaC9IZWFkZXJzLnRzIiwgIi4uL3NyYy9tb2R1bGVzL2ZldGNoL0Fib3J0Q29udHJvbGxlci50cyIsICIuLi9zcmMvbW9kdWxlcy9mZXRjaC9SZXF1ZXN0LnRzIiwgIi4uL3NyYy9tb2R1bGVzL2ZldGNoL1Jlc3BvbnNlLnRzIiwgIi4uL3NyYy9tb2R1bGVzL2ZldGNoL1VSTC5qcyIsICIuLi9zcmMvbW9kdWxlcy9mZXRjaC9VcmxTZWFyY2hQYXJhbXNQb2x5ZmlsbC5qcyIsICIuLi9zcmMvYXBwL2FwcC50cyIsICIuLi9zcmMvcmVhY3QvcmVhY3RBcHAudHMiLCAiLi4vc3JjL3N0YW5kYWxvbmUvU3RhbmRhbG9uZUFwcC50cyIsICIuLi9zcmMvYXBwTWFuYWdlci50cyIsICIuLi9zcmMvcG9seWZpbGwvYXJyYXlidWZmZXIudHMiLCAiLi4vc3JjL2luZGV4LmNhcmQudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKlxuICogQGxpY2Vuc2VcbkNvcHlyaWdodCAoYykgMjAxNCBGb3JiZXMgTGluZGVzYXlcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuVEhFIFNPRlRXQVJFLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG4vLyBTdGF0ZXM6XG4vL1xuLy8gMCAtIHBlbmRpbmdcbi8vIDEgLSBmdWxmaWxsZWQgd2l0aCBfdmFsdWVcbi8vIDIgLSByZWplY3RlZCB3aXRoIF92YWx1ZVxuLy8gMyAtIGFkb3B0ZWQgdGhlIHN0YXRlIG9mIGFub3RoZXIgcHJvbWlzZSwgX3ZhbHVlXG4vL1xuLy8gb25jZSB0aGUgc3RhdGUgaXMgbm8gbG9uZ2VyIHBlbmRpbmcgKDApIGl0IGlzIGltbXV0YWJsZVxuXG4vLyBBbGwgYF9gIHByZWZpeGVkIHByb3BlcnRpZXMgd2lsbCBiZSByZWR1Y2VkIHRvIGBfe3JhbmRvbSBudW1iZXJ9YFxuLy8gYXQgYnVpbGQgdGltZSB0byBvYmZ1c2NhdGUgdGhlbSBhbmQgZGlzY291cmFnZSB0aGVpciB1c2UuXG4vLyBXZSBkb24ndCB1c2Ugc3ltYm9scyBvciBPYmplY3QuZGVmaW5lUHJvcGVydHkgdG8gZnVsbHkgaGlkZSB0aGVtXG4vLyBiZWNhdXNlIHRoZSBwZXJmb3JtYW5jZSBpc24ndCBnb29kIGVub3VnaC5cblxuLy8gdG8gYXZvaWQgdXNpbmcgdHJ5L2NhdGNoIGluc2lkZSBjcml0aWNhbCBmdW5jdGlvbnMsIHdlXG4vLyBleHRyYWN0IHRoZW0gdG8gaGVyZS5cbnZhciBMQVNUX0VSUk9SID0gbnVsbDtcbnZhciBJU19FUlJPUiA9IHt9O1xuZnVuY3Rpb24gZ2V0VGhlbihvYmopIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gb2JqLnRoZW47XG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgTEFTVF9FUlJPUiA9IGV4O1xuICAgIHJldHVybiBJU19FUlJPUjtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cnlDYWxsT25lKGZuLCBhKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZuKGEpO1xuICB9IGNhdGNoIChleCkge1xuICAgIExBU1RfRVJST1IgPSBleDtcbiAgICByZXR1cm4gSVNfRVJST1I7XG4gIH1cbn1cbmZ1bmN0aW9uIHRyeUNhbGxUd28oZm4sIGEsIGIpIHtcbiAgdHJ5IHtcbiAgICBmbihhLCBiKTtcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICBMQVNUX0VSUk9SID0gZXg7XG4gICAgcmV0dXJuIElTX0VSUk9SO1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyaW1TdGFjayhzdGFjaykge1xuICAgIGlmICghc3RhY2spIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBjb25zdCBpbmRleCA9IHN0YWNrLmluZGV4T2YoJ1xcbicpO1xuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIHN0YWNrO1xuICAgIH1cbiAgICAvLyByZW1vdmUgXCJhdCBQcm9taXNlMlwiIHN0YWNrLlxuICAgIHJldHVybiBzdGFjay5zdWJzdHJpbmcoaW5kZXggKyAxKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSAob3B0KSA9PiB7XG4gIHZhciBuZXh0VGljayA9IG9wdC5uZXh0VGljaztcbiAgZnVuY3Rpb24gUHJvbWlzZShmbikge1xuICAgICAgdGhpcy5fX2NyZWF0ZVN0YWNrID0gdHJpbVN0YWNrKG5ldyBFcnJvcignUHJvbWlzZSBjcmVhdGlvbiBzdGFjaycpLnN0YWNrKTtcbiAgICBpZiAodHlwZW9mIHRoaXMgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9taXNlcyBtdXN0IGJlIGNvbnN0cnVjdGVkIHZpYSBuZXcnKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByb21pc2UgY29uc3RydWN0b3IncyBhcmd1bWVudCBpcyBub3QgYSBmdW5jdGlvblwiKTtcbiAgICB9XG4gICAgdGhpcy5fZGVmZXJyZWRTdGF0ZSA9IDA7XG4gICAgdGhpcy5fc3RhdGUgPSAwO1xuICAgIHRoaXMuX3ZhbHVlID0gbnVsbDtcbiAgICB0aGlzLl9kZWZlcnJlZHMgPSBudWxsO1xuICAgIGlmIChmbiA9PT0gbm9vcCkgcmV0dXJuO1xuICAgIGRvUmVzb2x2ZShmbiwgdGhpcyk7XG4gIH1cbiAgUHJvbWlzZS5fb25IYW5kbGUgPSBudWxsO1xuICBQcm9taXNlLl9vblJlamVjdCA9IG51bGw7XG4gIFByb21pc2UuX25vb3AgPSBub29wO1xuXG4gIFByb21pc2UucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICAgIGlmICh0aGlzLmNvbnN0cnVjdG9yICE9PSBQcm9taXNlKSB7XG4gICAgICByZXR1cm4gc2FmZVRoZW4odGhpcywgb25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpO1xuICAgIH1cbiAgICB2YXIgcmVzID0gbmV3IFByb21pc2Uobm9vcCk7XG4gICAgaGFuZGxlKHRoaXMsIG5ldyBIYW5kbGVyKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCByZXMpKTtcbiAgICByZXR1cm4gcmVzO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHNhZmVUaGVuKHNlbGYsIG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gICAgcmV0dXJuIG5ldyBzZWxmLmNvbnN0cnVjdG9yKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlcyA9IG5ldyBQcm9taXNlKG5vb3ApO1xuICAgICAgcmVzLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIGhhbmRsZShzZWxmLCBuZXcgSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcmVzKSk7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gaGFuZGxlKHNlbGYsIGRlZmVycmVkKSB7XG4gICAgd2hpbGUgKHNlbGYuX3N0YXRlID09PSAzKSB7XG4gICAgICBzZWxmID0gc2VsZi5fdmFsdWU7XG4gICAgfVxuICAgIGlmIChQcm9taXNlLl9vbkhhbmRsZSkge1xuICAgICAgUHJvbWlzZS5fb25IYW5kbGUoc2VsZik7XG4gICAgfVxuICAgIGlmIChzZWxmLl9zdGF0ZSA9PT0gMCkge1xuICAgICAgaWYgKHNlbGYuX2RlZmVycmVkU3RhdGUgPT09IDApIHtcbiAgICAgICAgc2VsZi5fZGVmZXJyZWRTdGF0ZSA9IDE7XG4gICAgICAgIHNlbGYuX2RlZmVycmVkcyA9IGRlZmVycmVkO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoc2VsZi5fZGVmZXJyZWRTdGF0ZSA9PT0gMSkge1xuICAgICAgICBzZWxmLl9kZWZlcnJlZFN0YXRlID0gMjtcbiAgICAgICAgc2VsZi5fZGVmZXJyZWRzID0gW3NlbGYuX2RlZmVycmVkcywgZGVmZXJyZWRdO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZWxmLl9kZWZlcnJlZHMucHVzaChkZWZlcnJlZCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGhhbmRsZVJlc29sdmVkKHNlbGYsIGRlZmVycmVkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVJlc29sdmVkKHNlbGYsIGRlZmVycmVkKSB7XG4gICAgbmV4dFRpY2soZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY2IgPSBzZWxmLl9zdGF0ZSA9PT0gMSA/IGRlZmVycmVkLm9uRnVsZmlsbGVkIDogZGVmZXJyZWQub25SZWplY3RlZDtcbiAgICAgIGlmIChjYiA9PT0gbnVsbCkge1xuICAgICAgICBpZiAoc2VsZi5fc3RhdGUgPT09IDEpIHtcbiAgICAgICAgICByZXNvbHZlKGRlZmVycmVkLnByb21pc2UsIHNlbGYuX3ZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QoZGVmZXJyZWQucHJvbWlzZSwgc2VsZi5fdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciByZXQgPSB0cnlDYWxsT25lKGNiLCBzZWxmLl92YWx1ZSk7XG4gICAgICBpZiAocmV0ID09PSBJU19FUlJPUikge1xuICAgICAgICByZWplY3QoZGVmZXJyZWQucHJvbWlzZSwgTEFTVF9FUlJPUik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKGRlZmVycmVkLnByb21pc2UsIHJldCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gcmVzb2x2ZShzZWxmLCBuZXdWYWx1ZSkge1xuICAgIC8vIFByb21pc2UgUmVzb2x1dGlvbiBQcm9jZWR1cmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9wcm9taXNlcy1hcGx1cy9wcm9taXNlcy1zcGVjI3RoZS1wcm9taXNlLXJlc29sdXRpb24tcHJvY2VkdXJlXG4gICAgaWYgKG5ld1ZhbHVlID09PSBzZWxmKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KHNlbGYsIG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZSBjYW5ub3QgYmUgcmVzb2x2ZWQgd2l0aCBpdHNlbGYuJykpO1xuICAgIH1cbiAgICBpZiAobmV3VmFsdWUgJiYgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIG5ld1ZhbHVlID09PSAnZnVuY3Rpb24nKSkge1xuICAgICAgdmFyIHRoZW4gPSBnZXRUaGVuKG5ld1ZhbHVlKTtcbiAgICAgIGlmICh0aGVuID09PSBJU19FUlJPUikge1xuICAgICAgICByZXR1cm4gcmVqZWN0KHNlbGYsIExBU1RfRVJST1IpO1xuICAgICAgfVxuICAgICAgaWYgKHRoZW4gPT09IHNlbGYudGhlbiAmJiBuZXdWYWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgc2VsZi5fc3RhdGUgPSAzO1xuICAgICAgICBzZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICBmaW5hbGUoc2VsZik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZG9SZXNvbHZlKHRoZW4uYmluZChuZXdWYWx1ZSksIHNlbGYpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIHNlbGYuX3N0YXRlID0gMTtcbiAgICBzZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGZpbmFsZShzZWxmKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlamVjdChzZWxmLCBuZXdWYWx1ZSkge1xuICAgIHNlbGYuX3N0YXRlID0gMjtcbiAgICBzZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGlmIChQcm9taXNlLl9vblJlamVjdCkge1xuICAgICAgUHJvbWlzZS5fb25SZWplY3Qoc2VsZiwgbmV3VmFsdWUpO1xuICAgIH1cbiAgICBmaW5hbGUoc2VsZik7XG4gIH1cbiAgZnVuY3Rpb24gZmluYWxlKHNlbGYpIHtcbiAgICBpZiAoc2VsZi5fZGVmZXJyZWRTdGF0ZSA9PT0gMSkge1xuICAgICAgaGFuZGxlKHNlbGYsIHNlbGYuX2RlZmVycmVkcyk7XG4gICAgICBzZWxmLl9kZWZlcnJlZHMgPSBudWxsO1xuICAgIH1cbiAgICBpZiAoc2VsZi5fZGVmZXJyZWRTdGF0ZSA9PT0gMikge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxmLl9kZWZlcnJlZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaGFuZGxlKHNlbGYsIHNlbGYuX2RlZmVycmVkc1tpXSk7XG4gICAgICB9XG4gICAgICBzZWxmLl9kZWZlcnJlZHMgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHByb21pc2UpIHtcbiAgICB0aGlzLm9uRnVsZmlsbGVkID0gdHlwZW9mIG9uRnVsZmlsbGVkID09PSAnZnVuY3Rpb24nID8gb25GdWxmaWxsZWQgOiBudWxsO1xuICAgIHRoaXMub25SZWplY3RlZCA9IHR5cGVvZiBvblJlamVjdGVkID09PSAnZnVuY3Rpb24nID8gb25SZWplY3RlZCA6IG51bGw7XG4gICAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlIGEgcG90ZW50aWFsbHkgbWlzYmVoYXZpbmcgcmVzb2x2ZXIgZnVuY3Rpb24gYW5kIG1ha2Ugc3VyZVxuICAgKiBvbkZ1bGZpbGxlZCBhbmQgb25SZWplY3RlZCBhcmUgb25seSBjYWxsZWQgb25jZS5cbiAgICpcbiAgICogTWFrZXMgbm8gZ3VhcmFudGVlcyBhYm91dCBhc3luY2hyb255LlxuICAgKi9cbiAgZnVuY3Rpb24gZG9SZXNvbHZlKGZuLCBwcm9taXNlKSB7XG4gICAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgICB2YXIgcmVzID0gdHJ5Q2FsbFR3byhcbiAgICAgIGZuLFxuICAgICAgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgaWYgKGRvbmUpIHJldHVybjtcbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSxcbiAgICAgIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICBpZiAoZG9uZSkgcmV0dXJuO1xuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgICB9XG4gICAgKTtcbiAgICBpZiAoIWRvbmUgJiYgcmVzID09PSBJU19FUlJPUikge1xuICAgICAgZG9uZSA9IHRydWU7XG4gICAgICByZWplY3QocHJvbWlzZSwgTEFTVF9FUlJPUik7XG4gICAgfVxuICB9XG4gIHJldHVybiBQcm9taXNlO1xufTtcbiIsICIvKipcbiAqIEBsaWNlbnNlXG5Db3B5cmlnaHQgKGMpIDIwMTQgRm9yYmVzIExpbmRlc2F5XG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbmFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cblRIRSBTT0ZUV0FSRS5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vL1RoaXMgZmlsZSBjb250YWlucyB0aGUgRVM2IGV4dGVuc2lvbnMgdG8gdGhlIGNvcmUgUHJvbWlzZXMvQSsgQVBJXG5cbm1vZHVsZS5leHBvcnRzID0gUHJvbWlzZSA9PiB7XG4gIC8qIFN0YXRpYyBGdW5jdGlvbnMgKi9cblxuICB2YXIgVFJVRSA9IHZhbHVlUHJvbWlzZSh0cnVlKTtcbiAgdmFyIEZBTFNFID0gdmFsdWVQcm9taXNlKGZhbHNlKTtcbiAgdmFyIE5VTEwgPSB2YWx1ZVByb21pc2UobnVsbCk7XG4gIHZhciBVTkRFRklORUQgPSB2YWx1ZVByb21pc2UodW5kZWZpbmVkKTtcbiAgdmFyIFpFUk8gPSB2YWx1ZVByb21pc2UoMCk7XG4gIHZhciBFTVBUWVNUUklORyA9IHZhbHVlUHJvbWlzZSgnJyk7XG5cbiAgZnVuY3Rpb24gdmFsdWVQcm9taXNlKHZhbHVlKSB7XG4gICAgdmFyIHAgPSBuZXcgUHJvbWlzZShQcm9taXNlLl9ub29wKTtcbiAgICBwLl9zdGF0ZSA9IDE7XG4gICAgcC5fdmFsdWUgPSB2YWx1ZTtcbiAgICByZXR1cm4gcDtcbiAgfVxuICBQcm9taXNlLnJlc29sdmUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHJldHVybiB2YWx1ZTtcblxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuIE5VTEw7XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiBVTkRFRklORUQ7XG4gICAgaWYgKHZhbHVlID09PSB0cnVlKSByZXR1cm4gVFJVRTtcbiAgICBpZiAodmFsdWUgPT09IGZhbHNlKSByZXR1cm4gRkFMU0U7XG4gICAgaWYgKHZhbHVlID09PSAwKSByZXR1cm4gWkVSTztcbiAgICBpZiAodmFsdWUgPT09ICcnKSByZXR1cm4gRU1QVFlTVFJJTkc7XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciB0aGVuID0gdmFsdWUudGhlbjtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHRoZW4uYmluZCh2YWx1ZSkpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgcmVqZWN0KGV4KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZVByb21pc2UodmFsdWUpO1xuICB9O1xuXG4gIHZhciBpdGVyYWJsZVRvQXJyYXkgPSBmdW5jdGlvbihpdGVyYWJsZSkge1xuICAgIGlmICh0eXBlb2YgQXJyYXkuZnJvbSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gRVMyMDE1KywgaXRlcmFibGVzIGV4aXN0XG4gICAgICBpdGVyYWJsZVRvQXJyYXkgPSBBcnJheS5mcm9tO1xuICAgICAgcmV0dXJuIEFycmF5LmZyb20oaXRlcmFibGUpO1xuICAgIH1cblxuICAgIC8vIEVTNSwgb25seSBhcnJheXMgYW5kIGFycmF5LWxpa2VzIGV4aXN0XG4gICAgaXRlcmFibGVUb0FycmF5ID0gZnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHgpO1xuICAgIH07XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGl0ZXJhYmxlKTtcbiAgfTtcblxuICBQcm9taXNlLmFsbCA9IGZ1bmN0aW9uKGFycikge1xuICAgIHZhciBhcmdzID0gaXRlcmFibGVUb0FycmF5KGFycik7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHJldHVybiByZXNvbHZlKFtdKTtcbiAgICAgIHZhciByZW1haW5pbmcgPSBhcmdzLmxlbmd0aDtcbiAgICAgIGZ1bmN0aW9uIHJlcyhpLCB2YWwpIHtcbiAgICAgICAgaWYgKHZhbCAmJiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICBpZiAodmFsIGluc3RhbmNlb2YgUHJvbWlzZSAmJiB2YWwudGhlbiA9PT0gUHJvbWlzZS5wcm90b3R5cGUudGhlbikge1xuICAgICAgICAgICAgd2hpbGUgKHZhbC5fc3RhdGUgPT09IDMpIHtcbiAgICAgICAgICAgICAgdmFsID0gdmFsLl92YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh2YWwuX3N0YXRlID09PSAxKSByZXR1cm4gcmVzKGksIHZhbC5fdmFsdWUpO1xuICAgICAgICAgICAgaWYgKHZhbC5fc3RhdGUgPT09IDIpIHJlamVjdCh2YWwuX3ZhbHVlKTtcbiAgICAgICAgICAgIHZhbC50aGVuKGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICByZXMoaSwgdmFsKTtcbiAgICAgICAgICAgIH0sIHJlamVjdCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB0aGVuID0gdmFsLnRoZW47XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgdmFyIHAgPSBuZXcgUHJvbWlzZSh0aGVuLmJpbmQodmFsKSk7XG4gICAgICAgICAgICAgIHAudGhlbihmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICByZXMoaSwgdmFsKTtcbiAgICAgICAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhcmdzW2ldID0gdmFsO1xuICAgICAgICBpZiAoLS1yZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgICByZXNvbHZlKGFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzKGksIGFyZ3NbaV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIFByb21pc2UucmVqZWN0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZWplY3QodmFsdWUpO1xuICAgIH0pO1xuICB9O1xuXG4gIFByb21pc2UucmFjZSA9IGZ1bmN0aW9uKHZhbHVlcykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGl0ZXJhYmxlVG9BcnJheSh2YWx1ZXMpLmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvKiBQcm90b3R5cGUgTWV0aG9kcyAqL1xuXG4gIFByb21pc2UucHJvdG90eXBlWydjYXRjaCddID0gZnVuY3Rpb24ob25SZWplY3RlZCkge1xuICAgIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3RlZCk7XG4gIH07XG4gIFByb21pc2UucHJvdG90eXBlLmRvbmUgPSBmdW5jdGlvbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICAgIHZhciBzZWxmID0gYXJndW1lbnRzLmxlbmd0aCA/IHRoaXMudGhlbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDogdGhpcztcbiAgICBzZWxmLnRoZW4obnVsbCwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9LCAwKTtcbiAgICB9KTtcbiAgfTtcbiAgUHJvbWlzZS5wcm90b3R5cGUuZmluYWxseSA9IGZ1bmN0aW9uKGYpIHtcbiAgICByZXR1cm4gdGhpcy50aGVuKFxuICAgICAgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmKCkpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmKCkpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICApO1xuICB9O1xuICByZXR1cm4gUHJvbWlzZTtcbn07XG4iLCAiLyoqXG4gKiBAbGljZW5zZVxuQ29weXJpZ2h0IChjKSAyMDE0IEZvcmJlcyBMaW5kZXNheVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG5hbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG5USEUgU09GVFdBUkUuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSAoUHJvbWlzZSwgc2V0VGltZW91dCwgY2xlYXJUaW1lb3V0KSA9PiB7XG4gIHZhciBERUZBVUxUX1dISVRFTElTVCA9IFtSZWZlcmVuY2VFcnJvciwgVHlwZUVycm9yLCBSYW5nZUVycm9yXTtcblxuICB2YXIgZW5hYmxlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGRpc2FibGUoKSB7XG4gICAgZW5hYmxlZCA9IGZhbHNlO1xuICAgIFByb21pc2UuX29uSGFuZGxlID0gbnVsbDtcbiAgICBQcm9taXNlLl9vblJlamVjdCA9IG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiBlbmFibGUob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGlmIChlbmFibGVkKSBkaXNhYmxlKCk7XG4gICAgZW5hYmxlZCA9IHRydWU7XG4gICAgdmFyIGlkID0gMDtcbiAgICB2YXIgZGlzcGxheUlkID0gMDtcbiAgICB2YXIgcmVqZWN0aW9ucyA9IHt9O1xuICAgIFByb21pc2UuX29uSGFuZGxlID0gZnVuY3Rpb24ocHJvbWlzZSkge1xuICAgICAgaWYgKFxuICAgICAgICBwcm9taXNlLl9zdGF0ZSA9PT0gMiAmJiAvLyBJUyBSRUpFQ1RFRFxuICAgICAgICByZWplY3Rpb25zW3Byb21pc2UuX3JlamVjdGlvbklkXVxuICAgICAgKSB7XG4gICAgICAgIGlmIChyZWplY3Rpb25zW3Byb21pc2UuX3JlamVjdGlvbklkXS5sb2dnZWQpIHtcbiAgICAgICAgICBvbkhhbmRsZWQocHJvbWlzZS5fcmVqZWN0aW9uSWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNsZWFyVGltZW91dCAmJiBjbGVhclRpbWVvdXQocmVqZWN0aW9uc1twcm9taXNlLl9yZWplY3Rpb25JZF0udGltZW91dCk7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIHJlamVjdGlvbnNbcHJvbWlzZS5fcmVqZWN0aW9uSWRdO1xuICAgICAgfVxuICAgIH07XG4gICAgUHJvbWlzZS5fb25SZWplY3QgPSBmdW5jdGlvbihwcm9taXNlLCBlcnIpIHtcbiAgICAgIGlmIChwcm9taXNlLl9kZWZlcnJlZFN0YXRlID09PSAwKSB7XG4gICAgICAgIC8vIG5vdCB5ZXQgaGFuZGxlZFxuICAgICAgICBwcm9taXNlLl9yZWplY3Rpb25JZCA9IGlkKys7XG4gICAgICAgIHJlamVjdGlvbnNbcHJvbWlzZS5fcmVqZWN0aW9uSWRdID0ge1xuICAgICAgICAgIGRpc3BsYXlJZDogbnVsbCxcbiAgICAgICAgICBlcnJvcjogZXJyLFxuICAgICAgICAgIHRpbWVvdXQ6IHNldFRpbWVvdXQoXG4gICAgICAgICAgICBvblVuaGFuZGxlZC5iaW5kKG51bGwsIHByb21pc2UpLCAwKSxcbiAgICAgICAgICBsb2dnZWQ6IGZhbHNlLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gICAgZnVuY3Rpb24gb25VbmhhbmRsZWQocHJvbWlzZSkge1xuICAgICAgY29uc3QgaWQgPSBwcm9taXNlLl9yZWplY3Rpb25JZDtcbiAgICAgIGlmIChvcHRpb25zLmFsbFJlamVjdGlvbnMgfHwgbWF0Y2hXaGl0ZWxpc3QocmVqZWN0aW9uc1tpZF0uZXJyb3IsIG9wdGlvbnMud2hpdGVsaXN0IHx8IERFRkFVTFRfV0hJVEVMSVNUKSkge1xuICAgICAgICByZWplY3Rpb25zW2lkXS5kaXNwbGF5SWQgPSBkaXNwbGF5SWQrKztcbiAgICAgICAgaWYgKG9wdGlvbnMub25VbmhhbmRsZWQpIHtcbiAgICAgICAgICByZWplY3Rpb25zW2lkXS5sb2dnZWQgPSB0cnVlO1xuICAgICAgICAgIGlmIChyZWplY3Rpb25zW2lkXS5lcnJvciAmJiAhKHJlamVjdGlvbnNbaWRdLmVycm9yIGluc3RhbmNlb2YgRXJyb3IpKSB7XG4gICAgICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihKU09OLnN0cmluZ2lmeShyZWplY3Rpb25zW2lkXS5lcnJvcikpO1xuICAgICAgICAgICAgZXJyb3Iuc3RhY2sgPSBwcm9taXNlLl9fY3JlYXRlU3RhY2s7XG4gICAgICAgICAgICByZWplY3Rpb25zW2lkXS5lcnJvciA9IGVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvcHRpb25zLm9uVW5oYW5kbGVkKHJlamVjdGlvbnNbaWRdLmRpc3BsYXlJZCwgcmVqZWN0aW9uc1tpZF0uZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlamVjdGlvbnNbaWRdLmxvZ2dlZCA9IHRydWU7XG4gICAgICAgICAgbG9nRXJyb3IocmVqZWN0aW9uc1tpZF0uZGlzcGxheUlkLCByZWplY3Rpb25zW2lkXS5lcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gb25IYW5kbGVkKGlkKSB7XG4gICAgICBpZiAocmVqZWN0aW9uc1tpZF0ubG9nZ2VkKSB7XG4gICAgICAgIGlmIChvcHRpb25zLm9uSGFuZGxlZCkge1xuICAgICAgICAgIG9wdGlvbnMub25IYW5kbGVkKHJlamVjdGlvbnNbaWRdLmRpc3BsYXlJZCwgcmVqZWN0aW9uc1tpZF0uZXJyb3IpO1xuICAgICAgICB9IGVsc2UgaWYgKCFyZWplY3Rpb25zW2lkXS5vblVuaGFuZGxlZCkge1xuICAgICAgICAgIGNvbnNvbGUud2FybignUHJvbWlzZSBSZWplY3Rpb24gSGFuZGxlZCAoaWQ6ICcgKyByZWplY3Rpb25zW2lkXS5kaXNwbGF5SWQgKyAnKTonKTtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICAnICBUaGlzIG1lYW5zIHlvdSBjYW4gaWdub3JlIGFueSBwcmV2aW91cyBtZXNzYWdlcyBvZiB0aGUgZm9ybSBcIlBvc3NpYmxlIFVuaGFuZGxlZCBQcm9taXNlIFJlamVjdGlvblwiIHdpdGggaWQgJyArXG4gICAgICAgICAgICAgIHJlamVjdGlvbnNbaWRdLmRpc3BsYXlJZCArXG4gICAgICAgICAgICAgICcuJ1xuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2U7XG4gIH1cblxuICBmdW5jdGlvbiBsb2dFcnJvcihpZCwgZXJyb3IpIHtcbiAgICBjb25zb2xlLndhcm4oJ1Bvc3NpYmxlIFVuaGFuZGxlZCBQcm9taXNlIFJlamVjdGlvbiAoaWQ6ICcgKyBpZCArICcpOicpO1xuICAgIHZhciBlcnJTdHIgPSAoZXJyb3IgJiYgKGVycm9yLnN0YWNrIHx8IGVycm9yKSkgKyAnJztcbiAgICBlcnJTdHIuc3BsaXQoJ1xcbicpLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgICAgY29uc29sZS53YXJuKCcgICcgKyBsaW5lKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1hdGNoV2hpdGVsaXN0KGVycm9yLCBsaXN0KSB7XG4gICAgcmV0dXJuIGxpc3Quc29tZShmdW5jdGlvbihjbHMpIHtcbiAgICAgIHJldHVybiBlcnJvciBpbnN0YW5jZW9mIGNscztcbiAgICB9KTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGVuYWJsZSxcbiAgICBkaXNhYmxlLFxuICB9O1xufTtcbiIsICIvLyBDb3B5cmlnaHQgMjAyNCBUaGUgTHlueCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlIFZlcnNpb24gMi4wIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZVxuLy8gTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuXG52YXIgcHJvbWlzZUZhY3RvciA9IHJlcXVpcmUoJy4vY29yZScpO1xudmFyIGVzNiA9IHJlcXVpcmUoJy4vZXM2LWV4dGVuc2lvbnMnKTtcbnZhciByZWplY3Rpb25IYW5kbGUgPSByZXF1aXJlKCcuL3JlamVjdGlvbi10cmFja2luZycpO1xudmFyIGdnID0gbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbXVsdGktYXNzaWduXG5nZy5nZXRQcm9taXNlID0gbW9kdWxlLmV4cG9ydHMuZ2V0UHJvbWlzZSA9IChvcHQpID0+IHtcbiAgdmFyIHNldFRpbWVvdXQgPSBvcHQuc2V0VGltZW91dDtcbiAgdmFyIG9uVW5oYW5kbGVkID0gb3B0Lm9uVW5oYW5kbGVkO1xuICB2YXIgY2xlYXJUaW1lb3V0ID0gb3B0LmNsZWFyVGltZW91dDtcbiAgdmFyIG5leHRUaWNrID0gb3B0Lm5leHRUaWNrIHx8IChmbiA9PiB7IHNldFRpbWVvdXQoZm4sIDApOyB9KTtcbiAgdmFyIFByb21pc2UgPSBwcm9taXNlRmFjdG9yKHsgbmV4dFRpY2s6IG5leHRUaWNrIH0pO1xuICBQcm9taXNlID0gZXM2KFByb21pc2UpO1xuICBQcm9taXNlID0gcmVqZWN0aW9uSGFuZGxlKFByb21pc2UsIHNldFRpbWVvdXQsIGNsZWFyVGltZW91dCkuZW5hYmxlKHtcbiAgICBhbGxSZWplY3Rpb25zOiB0cnVlLFxuICAgIG9uVW5oYW5kbGVkLFxuICB9KTtcblxuICByZXR1cm4gUHJvbWlzZTtcbn07XG4iLCAiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG52YXIgcnVudGltZSA9IChmdW5jdGlvbiAoZXhwb3J0cykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXG4gIGZ1bmN0aW9uIGRlZmluZShvYmosIGtleSwgdmFsdWUpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiBvYmpba2V5XTtcbiAgfVxuICB0cnkge1xuICAgIC8vIElFIDggaGFzIGEgYnJva2VuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0aGF0IG9ubHkgd29ya3Mgb24gRE9NIG9iamVjdHMuXG4gICAgZGVmaW5lKHt9LCBcIlwiKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgZGVmaW5lID0gZnVuY3Rpb24ob2JqLCBrZXksIHZhbHVlKSB7XG4gICAgICByZXR1cm4gb2JqW2tleV0gPSB2YWx1ZTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIC8vIElmIG91dGVyRm4gcHJvdmlkZWQgYW5kIG91dGVyRm4ucHJvdG90eXBlIGlzIGEgR2VuZXJhdG9yLCB0aGVuIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yLlxuICAgIHZhciBwcm90b0dlbmVyYXRvciA9IG91dGVyRm4gJiYgb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IgPyBvdXRlckZuIDogR2VuZXJhdG9yO1xuICAgIHZhciBnZW5lcmF0b3IgPSBPYmplY3QuY3JlYXRlKHByb3RvR2VuZXJhdG9yLnByb3RvdHlwZSk7XG4gICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCB8fCBbXSk7XG5cbiAgICAvLyBUaGUgLl9pbnZva2UgbWV0aG9kIHVuaWZpZXMgdGhlIGltcGxlbWVudGF0aW9ucyBvZiB0aGUgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzLlxuICAgIGdlbmVyYXRvci5faW52b2tlID0gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcblxuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH1cbiAgZXhwb3J0cy53cmFwID0gd3JhcDtcblxuICAvLyBUcnkvY2F0Y2ggaGVscGVyIHRvIG1pbmltaXplIGRlb3B0aW1pemF0aW9ucy4gUmV0dXJucyBhIGNvbXBsZXRpb25cbiAgLy8gcmVjb3JkIGxpa2UgY29udGV4dC50cnlFbnRyaWVzW2ldLmNvbXBsZXRpb24uIFRoaXMgaW50ZXJmYWNlIGNvdWxkXG4gIC8vIGhhdmUgYmVlbiAoYW5kIHdhcyBwcmV2aW91c2x5KSBkZXNpZ25lZCB0byB0YWtlIGEgY2xvc3VyZSB0byBiZVxuICAvLyBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCBidXQgaW4gYWxsIHRoZSBjYXNlcyB3ZSBjYXJlIGFib3V0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhbiBleGlzdGluZyBtZXRob2Qgd2Ugd2FudCB0byBjYWxsLCBzbyB0aGVyZSdzIG5vIG5lZWRcbiAgLy8gdG8gY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9iamVjdC4gV2UgY2FuIGV2ZW4gZ2V0IGF3YXkgd2l0aCBhc3N1bWluZ1xuICAvLyB0aGUgbWV0aG9kIHRha2VzIGV4YWN0bHkgb25lIGFyZ3VtZW50LCBzaW5jZSB0aGF0IGhhcHBlbnMgdG8gYmUgdHJ1ZVxuICAvLyBpbiBldmVyeSBjYXNlLCBzbyB3ZSBkb24ndCBoYXZlIHRvIHRvdWNoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBUaGVcbiAgLy8gb25seSBhZGRpdGlvbmFsIGFsbG9jYXRpb24gcmVxdWlyZWQgaXMgdGhlIGNvbXBsZXRpb24gcmVjb3JkLCB3aGljaFxuICAvLyBoYXMgYSBzdGFibGUgc2hhcGUgYW5kIHNvIGhvcGVmdWxseSBzaG91bGQgYmUgY2hlYXAgdG8gYWxsb2NhdGUuXG4gIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcIm5vcm1hbFwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07XG4gICAgfVxuICB9XG5cbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgPSBcInN1c3BlbmRlZFN0YXJ0XCI7XG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkID0gXCJzdXNwZW5kZWRZaWVsZFwiO1xuICB2YXIgR2VuU3RhdGVFeGVjdXRpbmcgPSBcImV4ZWN1dGluZ1wiO1xuICB2YXIgR2VuU3RhdGVDb21wbGV0ZWQgPSBcImNvbXBsZXRlZFwiO1xuXG4gIC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXNcbiAgLy8gYnJlYWtpbmcgb3V0IG9mIHRoZSBkaXNwYXRjaCBzd2l0Y2ggc3RhdGVtZW50LlxuICB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9O1xuXG4gIC8vIER1bW15IGNvbnN0cnVjdG9yIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSBhcyB0aGUgLmNvbnN0cnVjdG9yIGFuZFxuICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcbiAgLy8gbWluaWZpZXIgbm90IHRvIG1hbmdsZSB0aGUgbmFtZXMgb2YgdGhlc2UgdHdvIGZ1bmN0aW9ucy5cbiAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9XG5cbiAgLy8gVGhpcyBpcyBhIHBvbHlmaWxsIGZvciAlSXRlcmF0b3JQcm90b3R5cGUlIGZvciBlbnZpcm9ubWVudHMgdGhhdFxuICAvLyBkb24ndCBuYXRpdmVseSBzdXBwb3J0IGl0LlxuICB2YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcbiAgSXRlcmF0b3JQcm90b3R5cGVbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiZcbiAgICAgIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJlxuICAgICAgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkXG4gICAgLy8gb2YgdGhlIHBvbHlmaWxsLlxuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPVxuICAgIEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR3AuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvbjtcbiAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBkZWZpbmUoXG4gICAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUsXG4gICAgdG9TdHJpbmdUYWdTeW1ib2wsXG4gICAgXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICk7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgZGVmaW5lKHByb3RvdHlwZSwgbWV0aG9kLCBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvclxuICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICAgICA6IGZhbHNlO1xuICB9O1xuXG4gIGV4cG9ydHMubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgICAgZGVmaW5lKGdlbkZ1biwgdG9TdHJpbmdUYWdTeW1ib2wsIFwiR2VuZXJhdG9yRnVuY3Rpb25cIik7XG4gICAgfVxuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG4gIGV4cG9ydHMuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvciwgUHJvbWlzZUltcGwpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlSW1wbC5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgLy8gSWYgYSByZWplY3RlZCBQcm9taXNlIHdhcyB5aWVsZGVkLCB0aHJvdyB0aGUgcmVqZWN0aW9uIGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gc28gaXQgY2FuIGJlIGhhbmRsZWQgdGhlcmUuXG4gICAgICAgICAgcmV0dXJuIGludm9rZShcInRocm93XCIsIGVycm9yLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZUltcGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgZXhwb3J0cy5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgZXhwb3J0cy5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0LCBQcm9taXNlSW1wbCkge1xuICAgIGlmIChQcm9taXNlSW1wbCA9PT0gdm9pZCAwKSBQcm9taXNlSW1wbCA9IFByb21pc2U7XG5cbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCksXG4gICAgICBQcm9taXNlSW1wbFxuICAgICk7XG5cbiAgICByZXR1cm4gZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pXG4gICAgICA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuICAgICAgOiBpdGVyLm5leHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IHJlc3VsdC52YWx1ZSA6IGl0ZXIubmV4dCgpO1xuICAgICAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgY29udGV4dC5tZXRob2QgPSBtZXRob2Q7XG4gICAgICBjb250ZXh0LmFyZyA9IGFyZztcblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgdmFyIGRlbGVnYXRlUmVzdWx0ID0gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG4gICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQgPT09IENvbnRpbnVlU2VudGluZWwpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlUmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAvLyBTZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgICAgIGNvbnRleHQuc2VudCA9IGNvbnRleHQuX3NlbnQgPSBjb250ZXh0LmFyZztcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBjb250ZXh0LmFyZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKTtcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgY29udGV4dC5hcmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblxuICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cbiAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG4gICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmVcbiAgICAgICAgICAgID8gR2VuU3RhdGVDb21wbGV0ZWRcbiAgICAgICAgICAgIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgLy8gRGlzcGF0Y2ggdGhlIGV4Y2VwdGlvbiBieSBsb29waW5nIGJhY2sgYXJvdW5kIHRvIHRoZVxuICAgICAgICAgIC8vIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpIGNhbGwgYWJvdmUuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIENhbGwgZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdKGNvbnRleHQuYXJnKSBhbmQgaGFuZGxlIHRoZVxuICAvLyByZXN1bHQsIGVpdGhlciBieSByZXR1cm5pbmcgYSB7IHZhbHVlLCBkb25lIH0gcmVzdWx0IGZyb20gdGhlXG4gIC8vIGRlbGVnYXRlIGl0ZXJhdG9yLCBvciBieSBtb2RpZnlpbmcgY29udGV4dC5tZXRob2QgYW5kIGNvbnRleHQuYXJnLFxuICAvLyBzZXR0aW5nIGNvbnRleHQuZGVsZWdhdGUgdG8gbnVsbCwgYW5kIHJldHVybmluZyB0aGUgQ29udGludWVTZW50aW5lbC5cbiAgZnVuY3Rpb24gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBtZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF07XG4gICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBBIC50aHJvdyBvciAucmV0dXJuIHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyAudGhyb3dcbiAgICAgIC8vIG1ldGhvZCBhbHdheXMgdGVybWluYXRlcyB0aGUgeWllbGQqIGxvb3AuXG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgLy8gTm90ZTogW1wicmV0dXJuXCJdIG11c3QgYmUgdXNlZCBmb3IgRVMzIHBhcnNpbmcgY29tcGF0aWJpbGl0eS5cbiAgICAgICAgaWYgKGRlbGVnYXRlLml0ZXJhdG9yW1wicmV0dXJuXCJdKSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuICAgICAgICAgIC8vIGNoYW5jZSB0byBjbGVhbiB1cC5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG5cbiAgICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgLy8gSWYgbWF5YmVJbnZva2VEZWxlZ2F0ZShjb250ZXh0KSBjaGFuZ2VkIGNvbnRleHQubWV0aG9kIGZyb21cbiAgICAgICAgICAgIC8vIFwicmV0dXJuXCIgdG8gXCJ0aHJvd1wiLCBsZXQgdGhhdCBvdmVycmlkZSB0aGUgVHlwZUVycm9yIGJlbG93LlxuICAgICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcIlRoZSBpdGVyYXRvciBkb2VzIG5vdCBwcm92aWRlIGEgJ3Rocm93JyBtZXRob2RcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChtZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBjb250ZXh0LmFyZyk7XG5cbiAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcblxuICAgIGlmICghIGluZm8pIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiaXRlcmF0b3IgcmVzdWx0IGlzIG5vdCBhbiBvYmplY3RcIik7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgIC8vIEFzc2lnbiB0aGUgcmVzdWx0IG9mIHRoZSBmaW5pc2hlZCBkZWxlZ2F0ZSB0byB0aGUgdGVtcG9yYXJ5XG4gICAgICAvLyB2YXJpYWJsZSBzcGVjaWZpZWQgYnkgZGVsZWdhdGUucmVzdWx0TmFtZSAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG5cbiAgICAgIC8vIFJlc3VtZSBleGVjdXRpb24gYXQgdGhlIGRlc2lyZWQgbG9jYXRpb24gKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7XG5cbiAgICAgIC8vIElmIGNvbnRleHQubWV0aG9kIHdhcyBcInRocm93XCIgYnV0IHRoZSBkZWxlZ2F0ZSBoYW5kbGVkIHRoZVxuICAgICAgLy8gZXhjZXB0aW9uLCBsZXQgdGhlIG91dGVyIGdlbmVyYXRvciBwcm9jZWVkIG5vcm1hbGx5LiBJZlxuICAgICAgLy8gY29udGV4dC5tZXRob2Qgd2FzIFwibmV4dFwiLCBmb3JnZXQgY29udGV4dC5hcmcgc2luY2UgaXQgaGFzIGJlZW5cbiAgICAgIC8vIFwiY29uc3VtZWRcIiBieSB0aGUgZGVsZWdhdGUgaXRlcmF0b3IuIElmIGNvbnRleHQubWV0aG9kIHdhc1xuICAgICAgLy8gXCJyZXR1cm5cIiwgYWxsb3cgdGhlIG9yaWdpbmFsIC5yZXR1cm4gY2FsbCB0byBjb250aW51ZSBpbiB0aGVcbiAgICAgIC8vIG91dGVyIGdlbmVyYXRvci5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCAhPT0gXCJyZXR1cm5cIikge1xuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZS15aWVsZCB0aGUgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBkZWxlZ2F0ZSBtZXRob2QuXG4gICAgICByZXR1cm4gaW5mbztcbiAgICB9XG5cbiAgICAvLyBUaGUgZGVsZWdhdGUgaXRlcmF0b3IgaXMgZmluaXNoZWQsIHNvIGZvcmdldCBpdCBhbmQgY29udGludWUgd2l0aFxuICAgIC8vIHRoZSBvdXRlciBnZW5lcmF0b3IuXG4gICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gIH1cblxuICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCk7XG5cbiAgZGVmaW5lKEdwLCB0b1N0cmluZ1RhZ1N5bWJvbCwgXCJHZW5lcmF0b3JcIik7XG5cbiAgLy8gQSBHZW5lcmF0b3Igc2hvdWxkIGFsd2F5cyByZXR1cm4gaXRzZWxmIGFzIHRoZSBpdGVyYXRvciBvYmplY3Qgd2hlbiB0aGVcbiAgLy8gQEBpdGVyYXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgb24gaXQuIFNvbWUgYnJvd3NlcnMnIGltcGxlbWVudGF0aW9ucyBvZiB0aGVcbiAgLy8gaXRlcmF0b3IgcHJvdG90eXBlIGNoYWluIGluY29ycmVjdGx5IGltcGxlbWVudCB0aGlzLCBjYXVzaW5nIHRoZSBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0IHRvIG5vdCBiZSByZXR1cm5lZCBmcm9tIHRoaXMgY2FsbC4gVGhpcyBlbnN1cmVzIHRoYXQgZG9lc24ndCBoYXBwZW4uXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvaXNzdWVzLzI3NCBmb3IgbW9yZSBkZXRhaWxzLlxuICBHcFtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBHcC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgZXhwb3J0cy5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG4gICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICB9XG4gIGV4cG9ydHMudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24oc2tpcFRlbXBSZXNldCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG4gICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG4gICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcblxuICAgICAgICBpZiAoY2F1Z2h0KSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gISEgY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG4gICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcbiAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcbiAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZVxuICAvLyBvciBub3QsIHJldHVybiB0aGUgcnVudGltZSBvYmplY3Qgc28gdGhhdCB3ZSBjYW4gZGVjbGFyZSB0aGUgdmFyaWFibGVcbiAgLy8gcmVnZW5lcmF0b3JSdW50aW1lIGluIHRoZSBvdXRlciBzY29wZSwgd2hpY2ggYWxsb3dzIHRoaXMgbW9kdWxlIHRvIGJlXG4gIC8vIGluamVjdGVkIGVhc2lseSBieSBgYmluL3JlZ2VuZXJhdG9yIC0taW5jbHVkZS1ydW50aW1lIHNjcmlwdC5qc2AuXG4gIHJldHVybiBleHBvcnRzO1xuXG59KFxuICAvLyBJZiB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGUsIHVzZSBtb2R1bGUuZXhwb3J0c1xuICAvLyBhcyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIG5hbWVzcGFjZS4gT3RoZXJ3aXNlIGNyZWF0ZSBhIG5ldyBlbXB0eVxuICAvLyBvYmplY3QuIEVpdGhlciB3YXksIHRoZSByZXN1bHRpbmcgb2JqZWN0IHdpbGwgYmUgdXNlZCB0byBpbml0aWFsaXplXG4gIC8vIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgdmFyaWFibGUgYXQgdGhlIHRvcCBvZiB0aGlzIGZpbGUuXG4gIHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgPyBtb2R1bGUuZXhwb3J0cyA6IHt9XG4pKTtcblxudHJ5IHtcbiAgcmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbn0gY2F0Y2ggKGFjY2lkZW50YWxTdHJpY3RNb2RlKSB7XG4gIC8vIFRoaXMgbW9kdWxlIHNob3VsZCBub3QgYmUgcnVubmluZyBpbiBzdHJpY3QgbW9kZSwgc28gdGhlIGFib3ZlXG4gIC8vIGFzc2lnbm1lbnQgc2hvdWxkIGFsd2F5cyB3b3JrIHVubGVzcyBzb21ldGhpbmcgaXMgbWlzY29uZmlndXJlZC4gSnVzdFxuICAvLyBpbiBjYXNlIHJ1bnRpbWUuanMgYWNjaWRlbnRhbGx5IHJ1bnMgaW4gc3RyaWN0IG1vZGUsIHdlIGNhbiBlc2NhcGVcbiAgLy8gc3RyaWN0IG1vZGUgdXNpbmcgYSBnbG9iYWwgRnVuY3Rpb24gY2FsbC4gVGhpcyBjb3VsZCBjb25jZWl2YWJseSBmYWlsXG4gIC8vIGlmIGEgQ29udGVudCBTZWN1cml0eSBQb2xpY3kgZm9yYmlkcyB1c2luZyBGdW5jdGlvbiwgYnV0IGluIHRoYXQgY2FzZVxuICAvLyB0aGUgcHJvcGVyIHNvbHV0aW9uIGlzIHRvIGZpeCB0aGUgYWNjaWRlbnRhbCBzdHJpY3QgbW9kZSBwcm9ibGVtLiBJZlxuICAvLyB5b3UndmUgbWlzY29uZmlndXJlZCB5b3VyIGJ1bmRsZXIgdG8gZm9yY2Ugc3RyaWN0IG1vZGUgYW5kIGFwcGxpZWQgYVxuICAvLyBDU1AgdG8gZm9yYmlkIEZ1bmN0aW9uLCBhbmQgeW91J3JlIG5vdCB3aWxsaW5nIHRvIGZpeCBlaXRoZXIgb2YgdGhvc2VcbiAgLy8gcHJvYmxlbXMsIHBsZWFzZSBkZXRhaWwgeW91ciB1bmlxdWUgcHJlZGljYW1lbnQgaW4gYSBHaXRIdWIgaXNzdWUuXG4gIEZ1bmN0aW9uKFwiclwiLCBcInJlZ2VuZXJhdG9yUnVudGltZSA9IHJcIikocnVudGltZSk7XG59XG4iLCAiLy8gQ29weXJpZ2h0IDIwMjQgVGhlIEx5bnggQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSBWZXJzaW9uIDIuMCB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGVcbi8vIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cblxudmFyIGdsb2JhbFRoaXMgPSAobmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpczsnKSkoKTtcbmdsb2JhbFRoaXMuZ2xvYmFsVGhpcyA9IGdsb2JhbFRoaXM7XG4iLCAiLy8gQ29weXJpZ2h0IDIwMjQgVGhlIEx5bnggQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSBWZXJzaW9uIDIuMCB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGVcbi8vIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbmltcG9ydCAnQGx5bngtanMvaW9zLXBvbHlmaWxsJztcbmltcG9ydCAnQGx5bngtanMvaW9zLXBvbHlmaWxsLXByb21pc2UnO1xuaW1wb3J0ICdyZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUnO1xuaW1wb3J0ICcuL2luZGV4LmNhcmQnO1xuIiwgIi8vIENvcHlyaWdodCAyMDI0IFRoZSBMeW54IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UgVmVyc2lvbiAyLjAgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlXG4vLyBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG5cbi8vIEdldCB0aGUgZ2xvYmFsIHZhcmlhYmxlIG9mIHRoZSBjdXJyZW50IEpTIHJ1bnRpbWUuXG5jb25zdCBfZ2xvYmFsID0gKGZ1bmN0aW9uICgpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWV2YWxcbiAgcmV0dXJuIHRoaXMgfHwgKDAsIGV2YWwpKCd0aGlzJyk7XG59KSgpO1xuZXhwb3J0IGRlZmF1bHQgX2dsb2JhbDtcbiIsICIvLyBDb3B5cmlnaHQgMjAyNCBUaGUgTHlueCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlIFZlcnNpb24gMi4wIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZVxuLy8gTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuXG5leHBvcnQgZnVuY3Rpb24gaGFzUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eSk6IGJvb2xlYW4ge1xuICAvLyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpLCBwcm9wZXJ0eSlcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QgfHwge30sIHByb3BlcnR5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGFUeXBlKGRhdGE6IGFueSk6IHN0cmluZyB7XG4gIGNvbnN0IHR5cGUgPSB0eXBlb2YgZGF0YTtcbiAgaWYgKHR5cGUgIT09ICdvYmplY3QnKSByZXR1cm4gdHlwZTtcbiAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHJldHVybiAnYXJyYXknO1xuICBpZiAoZGF0YSA9PSBudWxsKSByZXR1cm4gJ251bGwnO1xuICBpZiAoZGF0YSBpbnN0YW5jZW9mIERhdGUpIHJldHVybiAnZGF0ZSc7XG4gIGlmIChkYXRhIGluc3RhbmNlb2YgUmVnRXhwKSByZXR1cm4gJ3JlZ0V4cCc7XG4gIHJldHVybiAnb2JqZWN0Jztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nKHZhbDogdW5rbm93bik6IHZhbCBpcyBzdHJpbmcge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZyc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCh2YWw6IHVua25vd24pOiBib29sZWFuIHtcbiAgcmV0dXJuIGdldERhdGFUeXBlKHZhbCkgPT09ICdvYmplY3QnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbihvYmo6IHVua25vd24pOiBvYmogaXMgQW55RnVuY3Rpb24ge1xuICBjb25zdCBkYXRhVHlwZSA9IGdldERhdGFUeXBlKG9iaik7XG4gIHJldHVybiBkYXRhVHlwZSA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkoYXJyYXk6IHVua25vd24pOiBhcnJheSBpcyBBcnJheTx1bmtub3duPiB7XG4gIHJldHVybiBnZXREYXRhVHlwZShhcnJheSkgPT09ICdhcnJheSc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc051bGwobzogdW5rbm93bik6IG8gaXMgbnVsbCB7XG4gIHJldHVybiBvID09PSBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNVbmRlZmluZWQobzogdW5rbm93bik6IG8gaXMgdW5kZWZpbmVkIHtcbiAgcmV0dXJuIG8gPT09IHZvaWQgMDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTnVsbE9yVW5kZWYobzogdW5rbm93bik6IG8gaXMgbnVsbCB8IHVuZGVmaW5lZCB7XG4gIHJldHVybiBpc1VuZGVmaW5lZChvKSB8fCBpc051bGwobyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Vycm9yKG86IHVua25vd24pOiBvIGlzIEVycm9yIHtcbiAgc3dpdGNoIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykpIHtcbiAgICBjYXNlICdbb2JqZWN0IEVycm9yXSc6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjYXNlICdbb2JqZWN0IEV4Y2VwdGlvbl0nOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgY2FzZSAnW29iamVjdCBET01FeGNlcHRpb25dJzpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gaXNJbnN0YW5jZU9mKG8sIEVycm9yKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNJbnN0YW5jZU9mPFQgZXh0ZW5kcyBGdW5jdGlvbj4obzogdW5rbm93biwgYmFzZTogVCk6IG8gaXMgVCB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIG8gaW5zdGFuY2VvZiBiYXNlO1xuICB9IGNhdGNoIChfZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGhpcmRTY3JpcHRFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgdHlwZTogc3RyaW5nO1xuICBjb25zdHJ1Y3Rvcihtc2c6IGFueSkge1xuICAgIHN1cGVyKGAke21zZ31gKTtcbiAgICB0aGlzLnR5cGUgPSAnVGhpcmRTY3JpcHRFcnJvcic7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFwcFNlcnZpY2VTZGtLbm93bkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICB0eXBlOiBzdHJpbmc7XG4gIGNvbnN0cnVjdG9yKG1zZykge1xuICAgIHN1cGVyKGBBUFAtU0VSVklDRS1TREs6ICsgJHttc2d9YCk7XG4gICAgdGhpcy50eXBlID0gJ0FwcFNlcnZpY2VTZGtLbm93bkVycm9yJztcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ3VpZCgpOiBzdHJpbmcge1xuICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCAoY2hhcikgPT4ge1xuICAgIGNvbnN0IHJhbmQgPSAoMTYgKiBNYXRoLnJhbmRvbSgpKSB8IDA7XG4gICAgcmV0dXJuIChjaGFyID09PSAneCcgPyByYW5kIDogKDMgJiByYW5kKSB8IDgpLnRvU3RyaW5nKDE2KTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub29wKCk6IHZvaWQge31cblxuZXhwb3J0IGZ1bmN0aW9uIGZvckVhY2hSaWdodDxUPihhcnI6IEFycmF5PFQ+LCBjYjogKHZhbHVlOiBUKSA9PiB2b2lkKTogdm9pZCB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICBsZXQgbGVuID0gYXJyLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpbmRleCA9IGxlbiAtIDE7IGluZGV4ID49IDA7IGluZGV4LS0pIHtcbiAgICAgIGNiKGFycltpbmRleF0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZvckVhY2hSaWdodCBFUlJPUjogZmlyc3QgcGFyYW1zIG11c3QgYmUgYXJyYXkuJyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhbGxiYWNrTWVyZ2UoX2Nicyk6IHZvaWQge1xuICBpZiAoQXJyYXkuaXNBcnJheShfY2JzKSkge1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBfY2JzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBfY2JzW2ldKCk7XG4gICAgfVxuICB9XG59XG4iLCAiLy8gQ29weXJpZ2h0IDIwMjQgVGhlIEx5bnggQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSBWZXJzaW9uIDIuMCB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGVcbi8vIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cblxuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgdHlwZSBTaGFyZWRDb25zb2xlID0gdHlwZW9mIG5hdGl2ZUNvbnNvbGUgJiB7IHJ1bnRpbWVJZDogc3RyaW5nIH07XG5cbi8vIFRPRE8od2FuZ3Fpbmd5dSk6IHdoZW4gdXNpbmcgaXNvbGF0ZWQgY29udGV4dCwgY29uc29sZSBpbiBsb2NhbCBjb250ZXh0XG4vLyBzaG91bGQgYmUgY3JlYXRlZCBieSBjcmVhdGVTaGFyZWRDb25zb2xlIGluc3RlYWQgb2YgdXNpbmcgZXhwb3J0ZWQgY29uc29sZVxuLy8gdGhlIGV4cG9ydCBkZWZhdWx0IGNvbnNvbGUgYmVsb3cgc2hvdWxkIG9ubHkgYmUgdXNlZCBpbiB0aGUgc2FtZSBjb250ZXh0IHdpdGggbHlueC1rZXJuZWxcblxuZnVuY3Rpb24gbG9nV2l0aFJ1bnRpbWVJZChcbiAgdGhpczogU2hhcmVkQ29uc29sZSxcbiAgZnVuY05hbWU6IHN0cmluZyxcbiAgLi4uYXJnczogdW5rbm93bltdXG4pIHtcbiAgLy8gSlMgVm0gdXNlIHJ1bnRpbWVJZDoxIHRvIHJlY29nbml6ZSBseW54IGRlYnVnZ2luZ1xuICByZXR1cm4gbmF0aXZlQ29uc29sZVtmdW5jTmFtZV0uY2FsbChuYXRpdmVDb25zb2xlLCB0aGlzLnJ1bnRpbWVJZCwgLi4uYXJncyk7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgY29uc29sZSB0aGF0IHdyYXBwZWQgdGhlIG5hdGl2ZUNvbnNvbGUgdG8gbG9nIHdpdGggcnVudGltZUlkLlxuICogQHBhcmFtIHJ1bnRpbWVJZCBUaGUgcnVudGltZUlkIHRvIGJlIGxvZ2dlZFxuICpcbiAqIFRoZSBydW50aW1lSWQgY2FuIGJlIGNoYW5nZWQgYnkgc2V0dGluZyBkaXJlY3RseS5cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3Qgc2hhcmVkQ29uc29sZSA9IGNyZWF0ZVNoYXJlZENvbnNvbGUocnVudGltZUlkKTtcbiAqIHNoYXJlZENvbnNvbGUucnVudGltZUlkID0gYW5vdGhlclJ1bnRpbWVJZDtcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNoYXJlZENvbnNvbGUocnVudGltZUlkOiBzdHJpbmcpOiBTaGFyZWRDb25zb2xlIHtcbiAgaWYgKF9fT1BFTl9JTlRFUk5BTF9MT0dfXyAmJiBOT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgIGNvbnN0IHNoYXJlZENvbnNvbGUgPSB7fSBhcyBTaGFyZWRDb25zb2xlO1xuICAgIE9iamVjdC5rZXlzKG5hdGl2ZUNvbnNvbGUpLmZvckVhY2goKGZ1bmNOYW1lKSA9PiB7XG4gICAgICAvLyBTaG91bGQgZmlsdGVyIG91dCB0aG9zZSBkbyBub3QgcHJpbnQgb3V0IG1lc3NhZ2VzIHRob3VnaCBDRFAuXG4gICAgICAvLyBVc2luZyBhIGZvcmJpZGRlbi1saXN0IGhlcmUgdG8gZmlsdGVyIG91dCB0aGUgQVBJIHRoYXQgZG9lcyBub3QgcHJpbnQgYW55dGhpbmcuXG4gICAgICAvLyBOb3QgdXNpbmcgaGFyZC1jb2RlZCBhbGxvdy1saXN0IHNpbmNlIGl0IGl0IG1vcmUgY29tbW9uIGZvciBjb25zb2xlIEFQSXMgdG8gcHJpbnQgc29tZXRoaW5nLlxuICAgICAgLy8gU28gd2hlbiB3ZSBhZGQgbmV3IEFQSSBsaWtlIGBjb25zb2xlLnRhYmxlYCwgd2UgZG9uJ3QgbmVlZCB0byBtb2RpZnkgaGVyZSB0byBnZXQgcnVudGltZUlkIGluamVjdGVkLlxuICAgICAgaWYgKFsncHJvZmlsZScsICdwcm9maWxlRW5kJ10uaW5jbHVkZXMoZnVuY05hbWUpKSB7XG4gICAgICAgIHNoYXJlZENvbnNvbGVbZnVuY05hbWVdID0gbmF0aXZlQ29uc29sZVtmdW5jTmFtZV07XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gRm9yIHRob3NlIG5vdCBpbiBmb3JiaWRkZW4tbGlzdCwgbG9nIHdpdGggcnVudGltZUlkXG4gICAgICBpZiAoaXNGdW5jdGlvbihuYXRpdmVDb25zb2xlW2Z1bmNOYW1lXSkpIHtcbiAgICAgICAgc2hhcmVkQ29uc29sZVtmdW5jTmFtZV0gPSBsb2dXaXRoUnVudGltZUlkLmJpbmQoXG4gICAgICAgICAgc2hhcmVkQ29uc29sZSxcbiAgICAgICAgICBmdW5jTmFtZVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHNoYXJlZENvbnNvbGUucnVudGltZUlkID0gcnVudGltZUlkO1xuXG4gICAgcmV0dXJuIHNoYXJlZENvbnNvbGU7XG4gIH1cblxuICByZXR1cm4gbmF0aXZlQ29uc29sZSBhcyBTaGFyZWRDb25zb2xlO1xufVxuXG5jb25zdCBfZ2xvYmFsID0gKGZ1bmN0aW9uICgpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWV2YWxcbiAgcmV0dXJuIHRoaXMgfHwgKDAsIGV2YWwpKCd0aGlzJyk7XG59KSgpO1xuXG4vKipcbiAqIFRoaXMgaXMgYSB3cmFwcGVyIHRvIG5hdGl2ZUNvbnNvbGUgdGhhdCBsb2cgd2l0aCBncm91cElkLlxuICpcbiAqIFRoZSBncm91cElkIGRlZmF1bHRzIHRvICctMScgYW5kIGNhbiBiZSBjaGFuZ2VkLlxuICovXG5jb25zdCBncm91cENvbnNvbGUgPSBjcmVhdGVTaGFyZWRDb25zb2xlKGBncm91cElkOiR7X2dsb2JhbC5ncm91cElkIHx8ICctMSd9YCk7XG5cbi8qKlxuICogQWxsIGNvbnNvbGUgaW4gbHlueC1rZXJuZWwgc2hvdWxkIHVzZSB0aGlzIGNvbnNvbGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCdcbiAgPyBncm91cENvbnNvbGVcbiAgOiAobmF0aXZlQ29uc29sZSBhcyBTaGFyZWRDb25zb2xlKTtcbiIsICIvLyBDb3B5cmlnaHQgMjAyNCBUaGUgTHlueCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlIFZlcnNpb24gMi4wIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZVxuLy8gTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuXG5pbXBvcnQgeyB0dENvbnNvbGUgfSBmcm9tICdAbHlueC1qcy9ydW50aW1lLXNoYXJlZCc7XG5leHBvcnQgeyBTaGFyZWRDb25zb2xlLCBjcmVhdGVTaGFyZWRDb25zb2xlIH0gZnJvbSAnQGx5bngtanMvcnVudGltZS1zaGFyZWQnO1xuZXhwb3J0IGRlZmF1bHQgdHRDb25zb2xlO1xuIiwgIi8vIENvcHlyaWdodCAyMDI0IFRoZSBMeW54IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UgVmVyc2lvbiAyLjAgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlXG4vLyBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG5cbmV4cG9ydCB0eXBlIEVycm9yTmFtZSA9XG4gIHwgJ0lOVEVSTkFMX1BBUlNFX0VSUk9SJ1xuICB8ICdJTlRFUk5BTF9SVU5USU1FX0VSUk9SJ1xuICB8ICdVU0VSX1ZBTElEQVRFX0VSUk9SJ1xuICB8ICdVU0VSX1JVTlRJTUVfRVJST1InXG4gIHwgJ0RBVEFfQ0hBTkdFX0hBTkRMRV9FUlJPUidcbiAgfCAnSU5WT0tFX0VSUk9SJztcblxuZXhwb3J0IHR5cGUgRXJyb3JLaW5kID0gJ0lOVEVSTkFMX0VSUk9SJyB8ICdVU0VSX0VSUk9SJztcbmV4cG9ydCB0eXBlIEVycm9yRW52ID0gJ1NFUlZJQ0UnO1xuXG4vKipcbiAqIFRoZSBlbnVtIHZhbHVlcyBzaG91bGQgYmUgc3luYyB3aXRoIGBseW54X2Vycm9yLmhgLlxuICovXG5leHBvcnQgY29uc3QgZW51bSBMeW54RXJyb3JMZXZlbCB7XG4gIEZhdGFsID0gMCxcbiAgRXJyb3IsXG4gIFdhcm4sXG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCYXNlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGFic3RyYWN0IGtpbmQ6IEVycm9yS2luZDtcbiAgYWJzdHJhY3QgbmFtZTogRXJyb3JOYW1lO1xuICBlbnY/OiBFcnJvckVudjtcbiAgY29uc3RydWN0b3IobWVzc2FnZTogc3RyaW5nLCBzdGFjaz86IHN0cmluZykge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIGlmIChzdGFjaykge1xuICAgICAgdGhpcy5zdGFjayA9IHN0YWNrO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSW50ZXJuYWxFcnJvciBleHRlbmRzIEJhc2VFcnJvciB7XG4gIGtpbmQgPSAnSU5URVJOQUxfRVJST1InIGFzIGNvbnN0O1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVXNlckVycm9yIGV4dGVuZHMgQmFzZUVycm9yIHtcbiAga2luZCA9ICdVU0VSX0VSUk9SJyBhcyBjb25zdDtcbn1cblxuZXhwb3J0IGNsYXNzIFVzZXJWYWxpZGF0ZUVycm9yIGV4dGVuZHMgVXNlckVycm9yIHtcbiAgbmFtZSA9ICdVU0VSX1ZBTElEQVRFX0VSUk9SJyBhcyBjb25zdDtcbn1cblxuLyoqIGVycm9yIGNvbWVzIGZvcm0gdXNlIGNvZGUgKi9cbmV4cG9ydCBjbGFzcyBVc2VyUnVudGltZUVycm9yIGV4dGVuZHMgVXNlckVycm9yIHtcbiAgbmFtZSA9ICdVU0VSX1JVTlRJTUVfRVJST1InIGFzIGNvbnN0O1xufVxuXG4vKipcbiAqIGVycm9yIGZyb20gaW50ZXJuYWwgZnJhbWV3b3JrXG4gKi9cbmV4cG9ydCBjbGFzcyBJbnRlcm5hbFJ1bnRpbWVFcnJvciBleHRlbmRzIEludGVybmFsRXJyb3Ige1xuICBuYW1lID0gJ0lOVEVSTkFMX1JVTlRJTUVfRVJST1InIGFzIGNvbnN0O1xufVxuXG4vKipcbiAqIGVycm9yIGZyb20gbGVwdXNOR1xuICovXG5leHBvcnQgY2xhc3MgSW50ZXJuYWxMZXB1c05nRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIG5hbWU6IHN0cmluZztcbiAgc3RhY2s6IHN0cmluZztcbiAgY29uc3RydWN0b3IobWVzc2FnZTogc3RyaW5nLCBzdGFjaz86IHN0cmluZykge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIGlmIChzdGFjaykge1xuICAgICAgdGhpcy5zdGFjayA9IHN0YWNrO1xuICAgIH1cbiAgfVxufVxuXG4vKiogZXJyb3IgY29tZXMgZnJvbSBqc2IgaW52b2tlICAqL1xuZXhwb3J0IGNsYXNzIEludm9rZUVycm9yIGV4dGVuZHMgSW50ZXJuYWxFcnJvciB7XG4gIG5hbWUgPSAnSU5WT0tFX0VSUk9SJyBhcyBjb25zdDtcbn1cblxuZXhwb3J0IGNsYXNzIEFwcFNlcnZpY2VFbmdpbmVLbm93bkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICB0eXBlOiBzdHJpbmc7XG4gIGNvbnN0cnVjdG9yKG1zZykge1xuICAgIHN1cGVyKGBBUFAtU0VSVklDRS1FbmdpbmU6ICR7bXNnfWApO1xuICAgIHRoaXMudHlwZSA9ICdBcHBTZXJ2aWNlRW5naW5lS25vd25FcnJvcic7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBzb3VyY2VNYXBSZWxlYXNlT2JqIHtcbiAgbmFtZTogc3RyaW5nO1xuICBzdGFjazogc3RyaW5nOyAvLyBkZXRhaWwgc3RhY2sgb2YgZXJyb3JcbiAgbWVzc2FnZTogc3RyaW5nOyAvLyB0aGUgc291cmNlTWFwUmVsZWFzZUlkLCBzdWNoIGFzIFwiZDczMTYwMTE5ZWY3ZTc3Nzc2MjQ2Y2FjYTJhN2I5OGVcIlxufVxuIiwgIi8vIENvcHlyaWdodCAyMDI0IFRoZSBMeW54IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UgVmVyc2lvbiAyLjAgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlXG4vLyBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0VOVFJZID0gJ19fQ2FyZF9fJztcbmV4cG9ydCBjb25zdCBBUFBfU0VSVklDRV9OQU1FID0gJ2FwcC1zZXJ2aWNlLmpzJztcbmV4cG9ydCBjb25zdCBTT1VSQ0VfTUFQX1JFTEVBU0VfRVJST1JfTkFNRSA9ICdMeW54R2V0U291cmNlTWFwUmVsZWFzZUVycm9yJztcbmV4cG9ydCBpbnRlcmZhY2UgUlVOX1RZUEUge1xuICBmaWxlbmFtZTogc3RyaW5nO1xuICAvKiogUmVwbGFjZSB0aGUgY29kZSB3aXRoIHRoZSBjb3JyZXNwb25kaW5nIGNvbW1pdEhhc2ggYWZ0ZXIgY29tcGlsYXRpb24gKi9cbiAgc2xvdDogc3RyaW5nO1xuXG4gIC8qKiBzb3VyY2VtYXAgcmVsZWFzZSBmb3Iga2VybmVsICovXG4gIHJlbGVhc2U6IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IExZTlhfQ09SRTogUlVOX1RZUEUgPSB7XG4gIGZpbGVuYW1lOiAnbHlueF9jb3JlJyxcbiAgc2xvdDogX19DT01NSVRfSEFTSF9fLFxuICByZWxlYXNlOiBfX0JVSUxEX1ZFUlNJT05fXyxcbn07XG4iLCAiLy8gQ29weXJpZ2h0IDIwMjQgVGhlIEx5bnggQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSBWZXJzaW9uIDIuMCB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGVcbi8vIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cblxuaW1wb3J0IG5hdGl2ZUNvbnNvbGUgZnJvbSAnLi4vLi4vY29tbW9uL3R0Q29uc29sZSc7XG4vKipcbiAqIFRoZSBTdWJqZWN0IGludGVyZmFjZSBkZWNsYXJlcyBhIHNldCBvZiBtZXRob2RzIGZvciBtYW5hZ2luZyBzdWJzY3JpYmVycy5cbiAqL1xuaW50ZXJmYWNlIFN1YmplY3Qge1xuICByZWdpc3Rlck9ic2VydmVyKG9ic2VydmVyOiBGdW5jdGlvbik6IHZvaWQ7XG4gIHJlbW92ZU9ic2VydmVyKG9ic2VydmVyOiBGdW5jdGlvbik6IHZvaWQ7XG4gIG5vdGlmeURhdGFDaGFuZ2UodmFsdWU6IGFueSk6IHZvaWQ7XG59XG5cbi8qKlxuICogVGhlIFN1YmplY3Qgb3ducyBzb21lIGltcG9ydGFudCBzdGF0ZSBhbmQgbm90aWZpZXMgb2JzZXJ2ZXJzIHdoZW4gdGhlIHN0YXRlXG4gKiBjaGFuZ2VzLlxuICovXG5jbGFzcyBTaGFyZURhdGFTdWJqZWN0IGltcGxlbWVudHMgU3ViamVjdCB7XG4gIC8qKlxuICAgKiBAdHlwZSB7bnVtYmVyfSBGb3IgdGhlIHNha2Ugb2Ygc2ltcGxpY2l0eSwgdGhlIFN1YmplY3QncyBzdGF0ZSwgZXNzZW50aWFsXG4gICAqIHRvIGFsbCBzdWJzY3JpYmVycywgaXMgc3RvcmVkIGluIHRoaXMgdmFyaWFibGUuXG4gICAqL1xuICBwdWJsaWMgc3RhdGU6IG51bWJlcjtcblxuICAvKipcbiAgICogQHR5cGUge09ic2VydmVyW119IExpc3Qgb2Ygc3Vic2NyaWJlcnMuXG4gICAqXG4gICAqL1xuICBwcml2YXRlIG9ic2VydmVyc0Z1bmM6IEZ1bmN0aW9uW10gPSBbXTtcblxuICAvKipcbiAgICogVGhlIHN1YnNjcmlwdGlvbiBtYW5hZ2VtZW50IG1ldGhvZHMuXG4gICAqL1xuICBwdWJsaWMgcmVnaXN0ZXJPYnNlcnZlcihvYnNlcnZlcjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICBjb25zdCBpc0V4aXN0ID0gdGhpcy5vYnNlcnZlcnNGdW5jLmluY2x1ZGVzKG9ic2VydmVyKTtcbiAgICBpZiAoaXNFeGlzdCkge1xuICAgICAgcmV0dXJuIG5hdGl2ZUNvbnNvbGUubG9nKCdTdWJqZWN0OiBPYnNlcnZlciBoYXMgYmVlbiBhdHRhY2hlZCBhbHJlYWR5LicpO1xuICAgIH1cbiAgICB0aGlzLm9ic2VydmVyc0Z1bmMucHVzaChvYnNlcnZlcik7XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlT2JzZXJ2ZXIob2JzZXJ2ZXI6IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgLy8gbmF0aXZlQ29uc29sZS5sb2coJ1N1YmplY3Q6IE5vbmV4aXN0ZW50IG9ic2VydmVyLicpO1xuICAgIGNvbnN0IG9ic2VydmVySW5kZXggPSB0aGlzLm9ic2VydmVyc0Z1bmMuaW5kZXhPZihvYnNlcnZlcik7XG4gICAgaWYgKG9ic2VydmVySW5kZXggPT09IC0xKSB7XG4gICAgICByZXR1cm4gbmF0aXZlQ29uc29sZS5sb2coJ1N1YmplY3Q6IE5vbmV4aXN0ZW50IG9ic2VydmVyLicpO1xuICAgIH1cblxuICAgIHRoaXMub2JzZXJ2ZXJzRnVuYy5zcGxpY2Uob2JzZXJ2ZXJJbmRleCwgMSk7XG4gICAgLy8gICBuYXRpdmVDb25zb2xlLmxvZygnU3ViamVjdDogRGV0YWNoZWQgYW4gb2JzZXJ2ZXIuJyk7XG4gIH1cblxuICBwdWJsaWMgbm90aWZ5RGF0YUNoYW5nZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy5vYnNlcnZlcnNGdW5jLmZvckVhY2goKHRvT2JzZXJ2ZXIpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgdG9PYnNlcnZlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRvT2JzZXJ2ZXIodmFsdWUpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIG5hdGl2ZUNvbnNvbGUubG9nKFxuICAgICAgICAgICAgJ1NoYXJlZERhdGEgY2hhbmdlIGFuZCBub3RpZnlEYXRhQ2hhbmdlIGVycm9yIGluZm86JyArIGVycm9yXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCB7IFNoYXJlRGF0YVN1YmplY3QgfTtcbiIsICIvLyBDb3B5cmlnaHQgMjAyNCBUaGUgTHlueCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlIFZlcnNpb24gMi4wIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZVxuLy8gTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuXG5pbXBvcnQgeyBERUZBVUxUX0VOVFJZIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgU2hhcmVEYXRhU3ViamVjdCB9IGZyb20gJy4uL21vZHVsZXMvc2hhcmVkRGF0YS9TaGFyZURhdGFTdWJqZWN0JztcbmltcG9ydCB7IG5hdGl2ZUdsb2JhbCBhcyBfZ2xvYmFsIH0gZnJvbSAnQGx5bngtanMvcnVudGltZS1zaGFyZWQnO1xuXG4vLyBmb3IgY2FyZC5cbl9nbG9iYWwubXVsdGlBcHBzID0ge307XG5fZ2xvYmFsLmN1cnJlbnRBcHBJZCA9ICcnO1xuX2dsb2JhbC5nbG9iQ29tcG9uZW50UmVnaXN0UGF0aCA9ICcnO1xuX2dsb2JhbC5zaGFyZWREYXRhID0ge307XG5fZ2xvYmFsLmdsb2JEeW5hbWljQ29tcG9uZW50RW50cnkgPSBERUZBVUxUX0VOVFJZO1xuXG5fZ2xvYmFsLnNoYXJlRGF0YVN1YmplY3QgPSBuZXcgU2hhcmVEYXRhU3ViamVjdCgpO1xuXG5fZ2xvYmFsLlRhcm9MeW54ID0ge307XG4vLyBidW5kbGUgcnVuIHdpdGggbm8gZXZhbFxuX2dsb2JhbC5idW5kbGVTdXBwb3J0TG9hZFNjcmlwdCA9IHRydWU7XG5leHBvcnQgY29uc3QgeyBsb2FkU2NyaXB0IH0gPSBfZ2xvYmFsO1xuZXhwb3J0IGRlZmF1bHQgX2dsb2JhbDtcbiIsICIvLyBDb3B5cmlnaHQgMjAyNCBUaGUgTHlueCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlIFZlcnNpb24gMi4wIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZVxuLy8gTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuXG5pbXBvcnQgbmF0aXZlQ29uc29sZSBmcm9tICcuL3R0Q29uc29sZSc7XG5sZXQgaXNOYXRpdmVDb25zb2xlSGFzQUxvZzogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuZXhwb3J0IGZ1bmN0aW9uIGFsb2coc3RyOiBzdHJpbmcpIHtcbiAgaWYgKCFfX09QRU5fSU5URVJOQUxfTE9HX18pIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGlzTmF0aXZlQ29uc29sZUhhc0FMb2cgPT09IHVuZGVmaW5lZCkge1xuICAgIGlzTmF0aXZlQ29uc29sZUhhc0FMb2cgPSB0eXBlb2YgbmF0aXZlQ29uc29sZS5hbG9nID09PSAnZnVuY3Rpb24nO1xuICB9XG4gIGlmIChpc05hdGl2ZUNvbnNvbGVIYXNBTG9nKSB7XG4gICAgbmF0aXZlQ29uc29sZS5hbG9nKCdbTHlueEpTU0RLXScgKyBzdHIpO1xuICB9XG59XG5cbmxldCBpc05hdGl2ZUNvbnNvbGVIYXNSZXBvcnQ6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCBmdW5jdGlvbiByZXBvcnQoc3RyOiBzdHJpbmcpIHtcbiAgaWYgKCFfX09QRU5fSU5URVJOQUxfTE9HX18pIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGlzTmF0aXZlQ29uc29sZUhhc1JlcG9ydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgaXNOYXRpdmVDb25zb2xlSGFzUmVwb3J0ID0gdHlwZW9mIG5hdGl2ZUNvbnNvbGUucmVwb3J0ID09PSAnZnVuY3Rpb24nO1xuICB9XG4gIGlmIChpc05hdGl2ZUNvbnNvbGVIYXNSZXBvcnQpIHtcbiAgICBuYXRpdmVDb25zb2xlLnJlcG9ydCgnW0x5bnhKU1NES10nICsgc3RyKTtcbiAgfVxufVxuIiwgIi8vIENvcHlyaWdodCAyMDI0IFRoZSBMeW54IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UgVmVyc2lvbiAyLjAgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlXG4vLyBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG5cbmNvbnN0IG51bWJlclJlZ0V4cCA9IC9cXGQrLztcbmNsYXNzIFZlcnNpb24ge1xuICBtYWpvcjogbnVtYmVyID0gMDtcbiAgbWlub3I6IG51bWJlciA9IDA7XG4gIHJldmlzaW9uOiBudW1iZXIgPSAwO1xuICBidWlsZDogbnVtYmVyID0gMDtcblxuICAvLyB2ZXJzaW9uOiBtYWpvci5taW5vci5yZXZpc2lvbi5idWlsZFxuICBjb25zdHJ1Y3Rvcih2ZXJzaW9uOiBzdHJpbmcpIHtcbiAgICB2ZXJzaW9uID0gU3RyaW5nKHZlcnNpb24pO1xuICAgIFtcbiAgICAgIHRoaXMubWFqb3IgPSAwLFxuICAgICAgdGhpcy5taW5vciA9IDAsXG4gICAgICB0aGlzLnJldmlzaW9uID0gMCxcbiAgICAgIHRoaXMuYnVpbGQgPSAwLFxuICAgIF0gPSB2ZXJzaW9uLnNwbGl0KCcuJykubWFwKCh2KSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBudW1iZXJSZWdFeHAuZXhlYyh2KTtcbiAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuICtyZXN1bHRbMF07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAwO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdyZWF0ZXIgVGhhblxuICAgKiBAcGFyYW0gdmVyc2lvbiB0aGUgdmVyc2lvbiB0byBiZSBjb21wYXJlZFxuICAgKiBAcmV0dXJucyB0aGlzID4gdmVyc2lvblxuICAgKi9cbiAgZ3QodmVyc2lvbjogc3RyaW5nIHwgVmVyc2lvbik6IGJvb2xlYW4ge1xuICAgIGlmICh0eXBlb2YgdmVyc2lvbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHZlcnNpb24gPSBuZXcgVmVyc2lvbih2ZXJzaW9uKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tYWpvciA+IHZlcnNpb24ubWFqb3IpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tYWpvciA8IHZlcnNpb24ubWFqb3IpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5taW5vciA+IHZlcnNpb24ubWlub3IpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5taW5vciA8IHZlcnNpb24ubWlub3IpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZXZpc2lvbiA+IHZlcnNpb24ucmV2aXNpb24pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5yZXZpc2lvbiA8IHZlcnNpb24ucmV2aXNpb24pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5idWlsZCA+IHZlcnNpb24uYnVpbGQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5idWlsZCA8IHZlcnNpb24uYnVpbGQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBlcXVhbHNcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogRVF1YWxcbiAgICogQHBhcmFtIHZlcnNpb24gdGhlIHZlcnNpb24gdG8gYmUgY29tcGFyZWRcbiAgICogQHJldHVybnMgdGhpcyA9PSB2ZXJzaW9uXG4gICAqL1xuICBlcSh2ZXJzaW9uOiBzdHJpbmcgfCBWZXJzaW9uKTogYm9vbGVhbiB7XG4gICAgaWYgKHR5cGVvZiB2ZXJzaW9uID09PSAnc3RyaW5nJykge1xuICAgICAgdmVyc2lvbiA9IG5ldyBWZXJzaW9uKHZlcnNpb24pO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICB0aGlzLm1ham9yID09PSB2ZXJzaW9uLm1ham9yICYmXG4gICAgICB0aGlzLm1pbm9yID09PSB2ZXJzaW9uLm1pbm9yICYmXG4gICAgICB0aGlzLnJldmlzaW9uID09PSB2ZXJzaW9uLnJldmlzaW9uICYmXG4gICAgICB0aGlzLmJ1aWxkID09PSB2ZXJzaW9uLmJ1aWxkXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMZXNzIFRoYW5cbiAgICogQHBhcmFtIHZlcnNpb24gdGhlIHZlcnNpb24gdG8gYmUgY29tcGFyZWRcbiAgICogQHJldHVybnMgdGhpcyA8IHZlcnNpb25cbiAgICovXG4gIGx0KHZlcnNpb246IHN0cmluZyB8IFZlcnNpb24pOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5lcSh2ZXJzaW9uKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiAhdGhpcy5ndCh2ZXJzaW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmVhdGVyIFRoYW4gb3IgRXF1YWxcbiAgICogQHBhcmFtIHZlcnNpb24gdGhlIHZlcnNpb24gdG8gYmUgY29tcGFyZWRcbiAgICogQHJldHVybnMgdGhpcyA+PSB2ZXJzaW9uXG4gICAqL1xuICBndGUodmVyc2lvbjogc3RyaW5nIHwgVmVyc2lvbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmVxKHZlcnNpb24pIHx8IHRoaXMuZ3QodmVyc2lvbik7XG4gIH1cblxuICAvKipcbiAgICogTGVzcyBUaGFuIG9yIEVxdWFsXG4gICAqIEBwYXJhbSB2ZXJzaW9uIHRoZSB2ZXJzaW9uIHRvIGJlIGNvbXBhcmVkXG4gICAqIEByZXR1cm5zIHRoaXMgPD0gdmVyc2lvblxuICAgKi9cbiAgbHRlKHZlcnNpb246IHN0cmluZyB8IFZlcnNpb24pOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5lcSh2ZXJzaW9uKSB8fCB0aGlzLmx0KHZlcnNpb24pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFZlcnNpb247XG5cbmV4cG9ydCBjb25zdCB2ZXJzaW9uMl80ID0gbmV3IFZlcnNpb24oJzIuNCcpO1xuZXhwb3J0IGNvbnN0IHZlcnNpb24yXzcgPSBuZXcgVmVyc2lvbignMi43Jyk7XG5leHBvcnQgY29uc3QgdmVyc2lvbjJfOSA9IG5ldyBWZXJzaW9uKCcyLjknKTtcbmV4cG9ydCBjb25zdCB2ZXJzaW9uMl8xMiA9IG5ldyBWZXJzaW9uKCcyLjEyJyk7XG5leHBvcnQgY29uc3QgdmVyc2lvbjJfMTQgPSBuZXcgVmVyc2lvbignMi4xNCcpO1xuIiwgIi8vIENvcHlyaWdodCAyMDI0IFRoZSBMeW54IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UgVmVyc2lvbiAyLjAgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlXG4vLyBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG5cbmltcG9ydCBuYXRpdmVDb25zb2xlIGZyb20gJy4uLy4uL2NvbW1vbi90dENvbnNvbGUnO1xuaW1wb3J0IHsgTFlOWF9DT1JFLCBSVU5fVFlQRSB9IGZyb20gJy4uLy4uL2NvbW1vbic7XG5pbXBvcnQgeyBBcHAsIE5hdGl2ZUFwcCB9IGZyb20gJy4uLy4uL2FwcCc7XG5pbXBvcnQgeyBpc09iamVjdCB9IGZyb20gJ0BseW54LWpzL3J1bnRpbWUtc2hhcmVkJztcbmltcG9ydCB7IEJhc2VFcnJvciwgTHlueEVycm9yTGV2ZWwgfSBmcm9tICcuL2Vycm9ycyc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZXBvcnRFcnJvcihcbiAgZXJyb3I6IEJhc2VFcnJvcixcbiAgbmF0aXZlQXBwOiBOYXRpdmVBcHAsXG4gIG9wdGlvbnM/OiB7XG4gICAgcnVuVHlwZT86IFJVTl9UWVBFO1xuICAgIG9yaWdpbkVycm9yPzogYW55O1xuICAgIF9fc291cmNlbWFwX19yZWxlYXNlX18/OiBzdHJpbmc7XG4gICAgZ2V0U291cmNlTWFwUmVsZWFzZT86ICh1cmw6IHN0cmluZykgPT4gc3RyaW5nO1xuICAgIGVycm9yQ29kZT86IG51bWJlcjtcbiAgICBlcnJvckxldmVsPzogTHlueEVycm9yTGV2ZWw7XG4gIH1cbik6IHZvaWQge1xuICBjb25zdCB7IG9yaWdpbkVycm9yLCBlcnJvckNvZGUsIGVycm9yTGV2ZWwsIHJ1blR5cGUgPSBMWU5YX0NPUkUgfSA9XG4gICAgb3B0aW9ucyA/PyB7fTtcbiAgbmF0aXZlQ29uc29sZS5lcnJvcignVGhlIGZvbGxvd2luZyBlcnJvciBvY2N1cnJlZCBpbiB0aGUgSlNSdW50aW1lOicpO1xuICBuYXRpdmVDb25zb2xlLmVycm9yKGAke2Vycm9yPy5tZXNzYWdlfVxcbiR7ZXJyb3I/LnN0YWNrfWApO1xuICBlcnJvci5jYXVzZSA9IGlzT2JqZWN0KGVycm9yLmNhdXNlKVxuICAgID8gSlNPTi5zdHJpbmdpZnkoZXJyb3IuY2F1c2UpXG4gICAgOiBlcnJvci5jYXVzZTtcbiAgdHJ5IHtcbiAgICBuYXRpdmVBcHAucmVwb3J0RXhjZXB0aW9uKGVycm9yLCB7XG4gICAgICAuLi5ydW5UeXBlLFxuICAgICAgYnVpbGRWZXJzaW9uOiBfX0JVSUxEX1ZFUlNJT05fXyxcbiAgICAgIHZlcnNpb25Db2RlOiBfX1ZFUlNJT05fXyxcbiAgICAgIGVycm9yQ29kZSxcbiAgICAgIGVycm9yTGV2ZWwsXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbmF0aXZlQ29uc29sZS5lcnJvcigncmVwb3J0RXJyb3IgZXJyOlxcbicsIGVycm9yKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbGVnYWN5UmVwb3J0RXJyb3IoXG4gIGVycm9yOiBCYXNlRXJyb3IsXG4gIG5hdGl2ZUFwcDogTmF0aXZlQXBwLFxuICBydW5UeXBlID0gTFlOWF9DT1JFLFxuICBvcmlnaW5FcnJvcj86IGFueSxcbiAgcHJveHk/OiBBcHBcbikge1xuICByZXR1cm4gcmVwb3J0RXJyb3IoZXJyb3IsIG5hdGl2ZUFwcCwge1xuICAgIHJ1blR5cGUsXG4gICAgb3JpZ2luRXJyb3IsXG4gICAgX19zb3VyY2VtYXBfX3JlbGVhc2VfXzogcHJveHkuX19zb3VyY2VtYXBfX3JlbGVhc2VfXyxcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXBvcnRUaHJvd0Vycm9yKHtcbiAgZXJyb3IsXG4gIG5hdGl2ZUFwcCxcbiAgcnVuVHlwZSA9IExZTlhfQ09SRSxcbiAgcmF3RXJyb3IsXG4gIF9fc291cmNlbWFwX19yZWxlYXNlX18sXG4gIGdldFNvdXJjZU1hcFJlbGVhc2UsXG59OiB7XG4gIGVycm9yOiBCYXNlRXJyb3I7XG4gIG5hdGl2ZUFwcDogTmF0aXZlQXBwO1xuICBydW5UeXBlPzogUlVOX1RZUEU7XG4gIHJhd0Vycm9yOiBvYmplY3Q7XG4gIF9fc291cmNlbWFwX19yZWxlYXNlX18/OiBzdHJpbmc7XG4gIGdldFNvdXJjZU1hcFJlbGVhc2U/OiAodXJsOiBzdHJpbmcpID0+IHN0cmluZztcbn0pOiB2b2lkIHtcbiAgcmVwb3J0RXJyb3IoZXJyb3IsIG5hdGl2ZUFwcCwge1xuICAgIG9yaWdpbkVycm9yOiByYXdFcnJvcixcbiAgICBydW5UeXBlLFxuICAgIF9fc291cmNlbWFwX19yZWxlYXNlX18sXG4gICAgZ2V0U291cmNlTWFwUmVsZWFzZSxcbiAgfSk7XG59XG4iLCAiLy8gQ29weXJpZ2h0IDIwMjQgVGhlIEx5bnggQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSBWZXJzaW9uIDIuMCB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGVcbi8vIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cblxuaW1wb3J0IG5hdGl2ZUNvbnNvbGUgZnJvbSAnLi4vLi4vY29tbW9uL3R0Q29uc29sZSc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uLCBub29wIH0gZnJvbSAnQGx5bngtanMvcnVudGltZS1zaGFyZWQnO1xuaW1wb3J0IHsgRXJyb3JLaW5kLCBVc2VyUnVudGltZUVycm9yLCBJbnRlcm5hbFJ1bnRpbWVFcnJvciB9IGZyb20gJy4vZXJyb3JzJztcbmltcG9ydCB7IHJlcG9ydEVycm9yIH0gZnJvbSAnLi9yZXBvcnQtZXJyb3InO1xuaW1wb3J0IHsgUlVOX1RZUEUsIExZTlhfQ09SRSB9IGZyb20gJy4uLy4uL2NvbW1vbic7XG5pbXBvcnQgeyBOYXRpdmVBcHAgfSBmcm9tICcuLi8uLi9hcHAnO1xuXG50eXBlIEluc3RhbmNlID0ge1xuICBfbmF0aXZlQXBwOiBOYXRpdmVBcHA7XG4gIG9uRXJyb3I/OiAoZXJyb3I6IHN0cmluZywgZXJyb3JPYmo6IGFueSkgPT4gdm9pZDtcbiAgX19zb3VyY2VtYXBfX3JlbGVhc2VfXz86IHN0cmluZztcbiAgZ2V0U291cmNlTWFwUmVsZWFzZT86ICh1cmw6IHN0cmluZykgPT4gc3RyaW5nO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHdyYXBVc2VyRnVuY3Rpb248VCBleHRlbmRzIEFueUZ1bmN0aW9uPihcbiAgZGVzYzogc3RyaW5nLFxuICBpbnN0YW5jZTogSW5zdGFuY2UsXG4gIGNhbGxiYWNrOiBULFxuICBydW5UeXBlOiBSVU5fVFlQRSA9IExZTlhfQ09SRVxuKTogVCB7XG4gIGlmICghaXNGdW5jdGlvbihjYWxsYmFjaykpIHJldHVybiBub29wIGFzIFQ7XG4gIHJldHVybiB3cmFwRnVuY3Rpb24oJ1VTRVJfRVJST1InLCBkZXNjLCBjYWxsYmFjaywgaW5zdGFuY2UsIHJ1blR5cGUpIGFzIFQ7XG59XG5mdW5jdGlvbiB3cmFwRnVuY3Rpb24oXG4gIGVycm9yS2luZDogRXJyb3JLaW5kID0gJ0lOVEVSTkFMX0VSUk9SJyxcbiAgZGVzYzogc3RyaW5nLFxuICBjYWxsYmFjazogQW55RnVuY3Rpb24sXG4gIGluc3RhbmNlOiBJbnN0YW5jZSxcbiAgcnVuVHlwZTogUlVOX1RZUEVcbikge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcEZ1bmN0aW9uSW5uZXIoLi4uYXJncykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkodGhpcywgYXJncyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBgJHtkZXNjfSBcXG4ke2Vycm9yLm1lc3NhZ2V9YDtcbiAgICAgIGlmIChcbiAgICAgICAgY2FsbGJhY2submFtZSAhPT0gJ29uRXJyb3InICYmXG4gICAgICAgIHR5cGVvZiBpbnN0YW5jZS5vbkVycm9yID09PSAnZnVuY3Rpb24nXG4gICAgICApIHtcbiAgICAgICAgaW5zdGFuY2Uub25FcnJvcihcbiAgICAgICAgICBgQ2FyZCAke2NhbGxiYWNrLm5hbWV9IGV4ZWMgZXJyb3I6JHttZXNzYWdlfVxcbiR7ZXJyb3Iuc3RhY2t9YCxcbiAgICAgICAgICBlcnJvclxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgY29uc3QgZXJyID1cbiAgICAgICAgZXJyb3JLaW5kID09PSAnSU5URVJOQUxfRVJST1InXG4gICAgICAgICAgPyBuZXcgSW50ZXJuYWxSdW50aW1lRXJyb3IobWVzc2FnZSwgZXJyb3Iuc3RhY2spXG4gICAgICAgICAgOiBuZXcgVXNlclJ1bnRpbWVFcnJvcihtZXNzYWdlLCBlcnJvci5zdGFjayk7XG4gICAgICBuYXRpdmVDb25zb2xlLmxvZyhgd3JhcEVycm9yLSR7ZGVzY31gLCBlcnIpO1xuICAgICAgcmVwb3J0RXJyb3IoZXJyLCBpbnN0YW5jZS5fbmF0aXZlQXBwLCB7XG4gICAgICAgIHJ1blR5cGUsXG4gICAgICAgIF9fc291cmNlbWFwX19yZWxlYXNlX186IGluc3RhbmNlLl9fc291cmNlbWFwX19yZWxlYXNlX18sXG4gICAgICAgIGdldFNvdXJjZU1hcFJlbGVhc2U6IGluc3RhbmNlLmdldFNvdXJjZU1hcFJlbGVhc2UsXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG5leHBvcnQgZnVuY3Rpb24gd3JhcElubmVyRnVuY3Rpb248VCBleHRlbmRzIEFueUZ1bmN0aW9uPihcbiAgZGVzYzogc3RyaW5nLFxuICBpbnN0YW5jZTogSW5zdGFuY2UsXG4gIGNhbGxiYWNrOiBULFxuICBydW5UeXBlOiBSVU5fVFlQRSA9IExZTlhfQ09SRVxuKTogVCB7XG4gIGlmICghaXNGdW5jdGlvbihjYWxsYmFjaykpIHJldHVybiBub29wIGFzIFQ7XG4gIHJldHVybiB3cmFwRnVuY3Rpb24oJ0lOVEVSTkFMX0VSUk9SJywgZGVzYywgY2FsbGJhY2ssIGluc3RhbmNlLCBydW5UeXBlKSBhcyBUO1xufVxuIiwgIi8vIENvcHlyaWdodCAyMDI0IFRoZSBMeW54IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UgVmVyc2lvbiAyLjAgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlXG4vLyBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG5cbmltcG9ydCB7IGlzRXJyb3IsIGlzU3RyaW5nIH0gZnJvbSAnQGx5bngtanMvcnVudGltZS1zaGFyZWQnO1xuaW1wb3J0IHsgQmFzZUFwcCwgTmF0aXZlQXBwIH0gZnJvbSAnLi4vLi4vYXBwJztcbmltcG9ydCB7IGFsb2cgfSBmcm9tICcuLi8uLi9jb21tb24vbG9nJztcblxuZXhwb3J0IGNsYXNzIFJlcG9ydGVyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBnZXRBcHA6ICgpID0+IEJhc2VBcHAsXG4gICAgcHJpdmF0ZSByZWFkb25seSBnZXROYXRpdmVBcHA6ICgpID0+IE5hdGl2ZUFwcFxuICApIHtcbiAgICB0aGlzLmdldEFwcCA9IGdldEFwcDtcbiAgICB0aGlzLmdldE5hdGl2ZUFwcCA9IGdldE5hdGl2ZUFwcDtcbiAgfVxuXG4gIHB1YmxpYyByZWJpbmQoZ2V0QXBwOiAoKSA9PiBCYXNlQXBwKSB7XG4gICAgdGhpcy5nZXRBcHAgPSBnZXRBcHA7XG4gIH1cblxuICAvLyAvKipcbiAgLy8gICoga2V5IHVybCAtPiB2YWx1ZSBzb3VyY2VtYXBcbiAgLy8gICogc3VwcG9ydCBkaWZmZXJlbnQgc291cmNlbWFwIGZvciBleHRlcm5hbCBqc1xuICAvLyAgKi9cbiAgLy8gc291cmNlbWFwczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuXG4gIC8qKlxuICAgKiBTZXQgc291cmNlbWFwIHJlbGVhc2Ugd2l0aCBhIG5ld2x5IHRocm93biBlcnJvclxuICAgKiBAcGFyYW0ge0Vycm9yfSBlcnJvclxuICAgKiBUaGUgZXJyb3IgdGhyb3duIGZyb20gdGhlIGZpbGUgdGhhdCB3YW50cyB0byBzZXQgc291cmNlbWFwIHJlbGVhc2UuXG4gICAqIFRoZSB0b3AgZnJhbWUgb2YgYGVycm9yLnN0YWNrYCAqKm11c3QgYmUqKiB0aGUgZmlsZW5hbWUuXG4gICAqIFRoZSBgZXJyb3IubmFtZWAgKiptdXN0IGJlKiogYCdMeW54R2V0U291cmNlTWFwUmVsZWFzZUVycm9yJ2AuXG4gICAqIFRoZSBgZXJyb3IubWVzc2FnZWAgKiptdXN0IGJlKiogdGhlIHNvdXJjZW1hcCByZWxlYXNlLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiAoZnVuY3Rpb24gKCkge1xuICAgKiAgIHRyeSB7XG4gICAqICAgICB0aHJvdyBuZXcgRXJyb3Ioc291cmNlbWFwUmVsZWFzZSk7XG4gICAqICAgfSBjYXRjaCAoZSkge1xuICAgKiAgICAgZS5uYW1lID0gJ0x5bnhHZXRTb3VyY2VNYXBSZWxlYXNlRXJyb3InO1xuICAgKiAgICAgdHQuc2V0U291cmNlTWFwUmVsZWFzZShlKTtcbiAgICogICB9XG4gICAqIH0pKClcbiAgICovXG4gIHNldFNvdXJjZU1hcFJlbGVhc2UgPSAoZXJyb3I6IEVycm9yKSA9PiB7XG4gICAgaWYgKFxuICAgICAgaXNFcnJvcihlcnJvcikgJiZcbiAgICAgIGVycm9yLm5hbWUgPT09IEJhc2VBcHAua0dldFNvdXJjZU1hcFJlbGVhc2VFcnJvck5hbWUgJiZcbiAgICAgIGlzU3RyaW5nKGVycm9yLm1lc3NhZ2UpICYmXG4gICAgICBpc1N0cmluZyhlcnJvci5zdGFjaylcbiAgICApIHtcbiAgICAgIHRoaXMuZ2V0TmF0aXZlQXBwKCkuX19TZXRTb3VyY2VNYXBSZWxlYXNlKHtcbiAgICAgICAgbmFtZTogZXJyb3IubmFtZSxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZSxcbiAgICAgICAgc3RhY2s6IGVycm9yLnN0YWNrLFxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGFsb2coYHNldFNvdXJjZU1hcFJlbGVhc2UgZmFpbGVkIHdpdGggZXJyb3I6ICR7SlNPTi5zdHJpbmdpZnkoZXJyb3IpfWApO1xuICB9O1xuXG4gIGdldFNvdXJjZU1hcFJlbGVhc2UgPSAodXJsOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGxldCByZXQgPSB0aGlzLmdldE5hdGl2ZUFwcCgpLl9fR2V0U291cmNlTWFwUmVsZWFzZSh1cmwpO1xuICAgIGlmICghcmV0KSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXROYXRpdmVBcHAoKS5fX0dldFNvdXJjZU1hcFJlbGVhc2UoXG4gICAgICAgIEJhc2VBcHAua0RlZmF1bHRTb3VyY2VNYXBVUkxcbiAgICAgICk7XG4gICAgfVxuICB9O1xufVxuIiwgIi8vIENvcHlyaWdodCAyMDI0IFRoZSBMeW54IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UgVmVyc2lvbiAyLjAgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlXG4vLyBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG5cbmltcG9ydCB7IEFuaW1hdGlvbiBhcyBJQW5pbWF0aW9uIH0gZnJvbSAnQGx5bngtanMvdHlwZXMnO1xuaW1wb3J0IHsgS2V5ZnJhbWVFZmZlY3QgfSBmcm9tICcuL2VmZmVjdCc7XG5cbmV4cG9ydCBjb25zdCBlbnVtIEFuaW1hdGlvbk9wZXJhdGlvbiB7XG4gIFNUQVJUID0gMCxcbiAgUExBWSxcbiAgUEFVU0UsXG4gIENBTkNFTCxcbiAgRklOSVNILFxufVxuXG5leHBvcnQgY2xhc3MgQW5pbWF0aW9uIGltcGxlbWVudHMgSUFuaW1hdGlvbiB7XG4gIHN0YXRpYyBjb3VudDogbnVtYmVyID0gMDtcbiAgcHVibGljIHJlYWRvbmx5IGVmZmVjdDogS2V5ZnJhbWVFZmZlY3Q7XG4gIHB1YmxpYyByZWFkb25seSBpZDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGVmZmVjdDogS2V5ZnJhbWVFZmZlY3QpIHtcbiAgICB0aGlzLmVmZmVjdCA9IGVmZmVjdDtcbiAgICB0aGlzLmlkID0gJ19fbHlueC1pbm5lci1qcy1hbmltYXRpb24tJyArIEFuaW1hdGlvbi5jb3VudCsrO1xuICB9XG5cbiAgY2FuY2VsKCk6IHZvaWQge1xuICAgIHRoaXMuZWZmZWN0LnRhcmdldC5jYW5jZWxBbmltYXRlKHRoaXMpO1xuICB9XG5cbiAgcGF1c2UoKTogdm9pZCB7XG4gICAgdGhpcy5lZmZlY3QudGFyZ2V0LnBhdXNlQW5pbWF0ZSh0aGlzKTtcbiAgfVxuXG4gIHBsYXkoKTogdm9pZCB7XG4gICAgdGhpcy5lZmZlY3QudGFyZ2V0LnBsYXlBbmltYXRlKHRoaXMpO1xuICB9XG59XG4iLCAiLy8gQ29weXJpZ2h0IDIwMjQgVGhlIEx5bnggQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSBWZXJzaW9uIDIuMCB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGVcbi8vIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cblxuaW1wb3J0IHsgS2V5ZnJhbWVFZmZlY3QgYXMgSUtleWZyYW1lRWZmZWN0IH0gZnJvbSAnQGx5bngtanMvdHlwZXMnO1xuaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi4vZWxlbWVudCc7XG5cbmV4cG9ydCBjbGFzcyBLZXlmcmFtZUVmZmVjdCBpbXBsZW1lbnRzIElLZXlmcmFtZUVmZmVjdCB7XG4gIHB1YmxpYyByZWFkb25seSB0YXJnZXQ6IEVsZW1lbnQ7XG4gIHB1YmxpYyByZWFkb25seSBrZXlmcmFtZXM6IEFycmF5PFJlY29yZDxzdHJpbmcsIGFueT4+O1xuICBwdWJsaWMgcmVhZG9ubHkgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICB0YXJnZXQ6IEVsZW1lbnQsXG4gICAga2V5ZnJhbWVzOiBBcnJheTxSZWNvcmQ8c3RyaW5nLCBhbnk+PixcbiAgICBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+XG4gICkge1xuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHRoaXMua2V5ZnJhbWVzID0ga2V5ZnJhbWVzO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBBbmltYXRpb24sIEFuaW1hdGlvbk9wZXJhdGlvbiwgS2V5ZnJhbWVFZmZlY3QgfSBmcm9tICcuLi9hbmltYXRpb24nO1xuaW1wb3J0IHsgTHlueCB9IGZyb20gJy4uLy4uL2x5bngnO1xuXG4vKipcbiAqIE5hdGl2ZSBFbGVtZW50LCBIZWxkIGJ5IHtAbGluayBFbGVtZW50fSBhbmQgaW50ZXJhY3Rpbmcgd2l0aCBuYXRpdmUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmF0aXZlRWxlbWVudFByb3h5IHtcbiAgYW5pbWF0ZShcbiAgICBvcGVyYXRpb246IEFuaW1hdGlvbk9wZXJhdGlvbixcbiAgICBpZDogc3RyaW5nLFxuICAgIGtleWZyYW1lcz86IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbiAgICB0aW1pbmdPcHRpb25zPzogUmVjb3JkPHN0cmluZywgYW55PlxuICApOiB2b2lkO1xuICBzZXRQcm9wZXJ0eShwcm9wc05hbWU6IHN0cmluZywgcHJvcHNWYWx1ZTogc3RyaW5nKTogdm9pZDtcbiAgc2V0UHJvcGVydHkocHJvcHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiB2b2lkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbGVtZW50IHtcbiAgcHJpdmF0ZSByZWFkb25seSBfcm9vdDogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IF9pZFNlbGVjdG9yOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2x5bng6IEx5bng7XG4gIHByaXZhdGUgX2VsZW1lbnQ6IE5hdGl2ZUVsZW1lbnRQcm94eTtcblxuICBjb25zdHJ1Y3Rvcihyb290OiBzdHJpbmcsIGlkOiBzdHJpbmcsIGx5bnhQcm94eTogTHlueCkge1xuICAgIHRoaXMuX3Jvb3QgPSByb290O1xuICAgIHRoaXMuX2lkU2VsZWN0b3IgPSAnIycgKyBpZDtcbiAgICB0aGlzLl9seW54ID0gbHlueFByb3h5O1xuICAgIHRoaXMuX2VsZW1lbnQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBwcml2YXRlIGVuc3VyZUVsZW1lbnQoKSB7XG4gICAgaWYgKCF0aGlzLl9lbGVtZW50KSB7XG4gICAgICB0aGlzLl9lbGVtZW50ID0gdGhpcy5fbHlueC5jcmVhdGVFbGVtZW50KHRoaXMuX3Jvb3QsIHRoaXMuX2lkU2VsZWN0b3IpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGtleWZyYW1lczogc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJfQW5pbWF0aW9uc19BUEkvS2V5ZnJhbWVfRm9ybWF0c1xuICAvLyAgRWl0aGVyIGFuIGFycmF5IG9mIGtleWZyYW1lIG9iamVjdHMsIG9yIGEga2V5ZnJhbWUgb2JqZWN0IHdob3NlIHByb3BlcnR5IGFyZSBhcnJheXMgb2YgdmFsdWVzIHRvIGl0ZXJhdGUgb3Zlci4gU2VlIEtleWZyYW1lIEZvcm1hdHMgZm9yIG1vcmUgZGV0YWlscy5cbiAgLy9cbiAgLy8gdGltaW5nT3B0aW9uczogc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2FuaW1hdGVcbiAgLy8gIGlkIE9wdGlvbmFsOiBBIHByb3BlcnR5IHVuaXF1ZSB0byBhbmltYXRlKCk6IGEgRE9NU3RyaW5nIHdpdGggd2hpY2ggdG8gcmVmZXJlbmNlIHRoZSBhbmltYXRpb24uXG4gIC8vICBkZWxheSBPcHRpb25hbDogVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkgdGhlIHN0YXJ0IG9mIHRoZSBhbmltYXRpb24uIERlZmF1bHRzIHRvIDAuXG4gIC8vICBkaXJlY3Rpb24gT3B0aW9uYWw6IFdoZXRoZXIgdGhlIGFuaW1hdGlvbiBydW5zIGZvcndhcmRzIChub3JtYWwpLCBiYWNrd2FyZHMgKHJldmVyc2UpLCBzd2l0Y2hlcyBkaXJlY3Rpb24gYWZ0ZXIgZWFjaCBpdGVyYXRpb24gKGFsdGVybmF0ZSksIG9yIHJ1bnMgYmFja3dhcmRzIGFuZCBzd2l0Y2hlcyBkaXJlY3Rpb24gYWZ0ZXIgZWFjaCBpdGVyYXRpb24gKGFsdGVybmF0ZS1yZXZlcnNlKS4gRGVmYXVsdHMgdG8gXCJub3JtYWxcIi5cbiAgLy8gIGR1cmF0aW9uIE9wdGlvbmFsOiBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBlYWNoIGl0ZXJhdGlvbiBvZiB0aGUgYW5pbWF0aW9uIHRha2VzIHRvIGNvbXBsZXRlLiBEZWZhdWx0cyB0byAwLiBBbHRob3VnaCB0aGlzIGlzIHRlY2huaWNhbGx5IG9wdGlvbmFsLCBrZWVwIGluIG1pbmQgdGhhdCB5b3VyIGFuaW1hdGlvbiB3aWxsIG5vdCBydW4gaWYgdGhpcyB2YWx1ZSBpcyAwLlxuICAvLyAgZWFzaW5nIE9wdGlvbmFsOiBUaGUgcmF0ZSBvZiB0aGUgYW5pbWF0aW9uJ3MgY2hhbmdlIG92ZXIgdGltZS4gQWNjZXB0cyB0aGUgcHJlLWRlZmluZWQgdmFsdWVzIFwibGluZWFyXCIsIFwiZWFzZVwiLCBcImVhc2UtaW5cIiwgXCJlYXNlLW91dFwiLCBhbmQgXCJlYXNlLWluLW91dFwiLCBvciBhIGN1c3RvbSBcImN1YmljLWJlemllclwiIHZhbHVlIGxpa2UgXCJjdWJpYy1iZXppZXIoMC40MiwgMCwgMC41OCwgMSlcIi4gRGVmYXVsdHMgdG8gXCJsaW5lYXJcIi5cbiAgLy8gIGVuZERlbGF5IE9wdGlvbmFsOiBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheSBhZnRlciB0aGUgZW5kIG9mIGFuIGFuaW1hdGlvbi4gVGhpcyBpcyBwcmltYXJpbHkgb2YgdXNlIHdoZW4gc2VxdWVuY2luZyBhbmltYXRpb25zIGJhc2VkIG9uIHRoZSBlbmQgdGltZSBvZiBhbm90aGVyIGFuaW1hdGlvbi4gRGVmYXVsdHMgdG8gMC5cbiAgLy8gIGZpbGwgT3B0aW9uYWw6IERpY3RhdGVzIHdoZXRoZXIgdGhlIGFuaW1hdGlvbidzIGVmZmVjdHMgc2hvdWxkIGJlIHJlZmxlY3RlZCBieSB0aGUgZWxlbWVudChzKSBwcmlvciB0byBwbGF5aW5nIChcImJhY2t3YXJkc1wiKSwgcmV0YWluZWQgYWZ0ZXIgdGhlIGFuaW1hdGlvbiBoYXMgY29tcGxldGVkIHBsYXlpbmcgKFwiZm9yd2FyZHNcIiksIG9yIGJvdGguIERlZmF1bHRzIHRvIFwibm9uZVwiLlxuICAvLyAgaXRlcmF0aW9uU3RhcnQgT3B0aW9uYWw6IERlc2NyaWJlcyBhdCB3aGF0IHBvaW50IGluIHRoZSBpdGVyYXRpb24gdGhlIGFuaW1hdGlvbiBzaG91bGQgc3RhcnQuIDAuNSB3b3VsZCBpbmRpY2F0ZSBzdGFydGluZyBoYWxmd2F5IHRocm91Z2ggdGhlIGZpcnN0IGl0ZXJhdGlvbiBmb3IgZXhhbXBsZSwgYW5kIHdpdGggdGhpcyB2YWx1ZSBzZXQsIGFuIGFuaW1hdGlvbiB3aXRoIDIgaXRlcmF0aW9ucyB3b3VsZCBlbmQgaGFsZndheSB0aHJvdWdoIGEgdGhpcmQgaXRlcmF0aW9uLiBEZWZhdWx0cyB0byAwLjAuXG4gIC8vIGl0ZXJhdGlvbnMgT3B0aW9uYWw6IFRoZSBudW1iZXIgb2YgdGltZXMgdGhlIGFuaW1hdGlvbiBzaG91bGQgcmVwZWF0LiBEZWZhdWx0cyB0byAxLCBhbmQgY2FuIGFsc28gdGFrZSBhIHZhbHVlIG9mIEluZmluaXR5IHRvIG1ha2UgaXQgcmVwZWF0IGZvciBhcyBsb25nIGFzIHRoZSBlbGVtZW50IGV4aXN0cy5cbiAgYW5pbWF0ZShcbiAgICBrZXlmcmFtZXM6IEFycmF5PFJlY29yZDxzdHJpbmcsIGFueT4+LFxuICAgIHRpbWluZ09wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT5cbiAgKTogQW5pbWF0aW9uIHtcbiAgICB0aGlzLmVuc3VyZUVsZW1lbnQoKTtcbiAgICBsZXQgYW5pID0gbmV3IEFuaW1hdGlvbihuZXcgS2V5ZnJhbWVFZmZlY3QodGhpcywga2V5ZnJhbWVzLCB0aW1pbmdPcHRpb25zKSk7XG4gICAgdGhpcy5fZWxlbWVudC5hbmltYXRlKDAsIGFuaS5pZCwga2V5ZnJhbWVzLCB0aW1pbmdPcHRpb25zKTtcbiAgICByZXR1cm4gYW5pO1xuICB9XG5cbiAgcGxheUFuaW1hdGUoYW5pOiBBbmltYXRpb24pOiB2b2lkIHtcbiAgICB0aGlzLl9lbGVtZW50LmFuaW1hdGUoMSwgYW5pLmlkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gIH1cblxuICBwYXVzZUFuaW1hdGUoYW5pOiBBbmltYXRpb24pOiB2b2lkIHtcbiAgICB0aGlzLl9lbGVtZW50LmFuaW1hdGUoMiwgYW5pLmlkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gIH1cblxuICBjYW5jZWxBbmltYXRlKGFuaTogQW5pbWF0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5fZWxlbWVudC5hbmltYXRlKDMsIGFuaS5pZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICB9XG5cbiAgZmluaXNoQW5pbWF0ZShhbmk6IEFuaW1hdGlvbik6IHZvaWQge1xuICAgIHRoaXMuX2VsZW1lbnQuYW5pbWF0ZSg0LCBhbmkuaWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgfVxuXG4gIHNldFByb3BlcnR5KFxuICAgIHByb3BzT2JqOiBzdHJpbmcgfCBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LFxuICAgIHByb3BzVmFsPzogc3RyaW5nXG4gICk6IHZvaWQge1xuICAgIHRoaXMuZW5zdXJlRWxlbWVudCgpO1xuICAgIGlmICh0eXBlb2YgcHJvcHNPYmogPT09ICdzdHJpbmcnICYmIHR5cGVvZiBwcm9wc1ZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnQuc2V0UHJvcGVydHkoe1xuICAgICAgICBbcHJvcHNPYmpdOiBwcm9wc1ZhbCxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHByb3BzT2JqID09PSAnb2JqZWN0Jykge1xuICAgICAgdGhpcy5fZWxlbWVudC5zZXRQcm9wZXJ0eShwcm9wc09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYHNldFByb3BlcnR5J3MgcGFyYW0gbXVzdCBiZSBzdHJpbmcgb3Igb2JqZWN0LiBXaGlsZSBjdXJyZW50IHR5cGUgaXMgJHt0eXBlb2YgcHJvcHNPYmp9IGFuZCAke3R5cGVvZiBwcm9wc1ZhbH0uYFxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cbiIsICJpbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnQnO1xuZXhwb3J0IGRlZmF1bHQgRWxlbWVudDtcblxuZXhwb3J0IHR5cGUgeyBOYXRpdmVFbGVtZW50UHJveHkgfSBmcm9tICcuL2VsZW1lbnQnO1xuIiwgIi8vIENvcHlyaWdodCAyMDI0IFRoZSBMeW54IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UgVmVyc2lvbiAyLjAgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlXG4vLyBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG5cbmltcG9ydCB7XG4gIE5vZGVzUmVmIGFzIElOb2Rlc1JlZixcbiAgU2VsZWN0b3JRdWVyeSBhcyBJU2VsZWN0b3JRdWVyeSxcbiAgdWlGaWVsZHNPcHRpb25zLFxuICB1aU1ldGhvZE9wdGlvbnMsXG59IGZyb20gJ0BseW54LWpzL3R5cGVzJztcbmltcG9ydCB7XG4gIEVycm9yQ29kZSxcbiAgSWRlbnRpZmllclR5cGUsXG4gIE5vZGVTZWxlY3RUb2tlbixcbiAgU2VsZWN0b3JRdWVyeU5hdGl2ZVByb3h5LFxufSBmcm9tICcuL2ludGVyZmFjZSc7XG5pbXBvcnQgeyBJbnZva2VFcnJvciwgcmVwb3J0RXJyb3IgfSBmcm9tICcuLi9yZXBvcnQnO1xuXG4vKipcbiAqIFNlbGVjdG9yUXVlcnkgaXMgYSBxdWVyeSBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWxlY3Qgbm9kZXMgaW4gdGhlIFZpcnR1YWwgRE9NIHRyZWUuXG4gKlxuICogRXhhbXBsZTpcbiAqIHRoaXMuY3JlYXRlU2VsZWN0b3JRdWVyeSgpXG4gKiAgIC5zZWxlY3QoJyN2aWRlbycpXG4gKiAgIC5pbnZva2Uoe1xuICogICAgIG1ldGhvZDogJ3NlZWtUbycsXG4gKiAgICAgcGFyYW1zOiB7XG4gKiAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAqICAgICB9LFxuICogICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcbiAqICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gKiAgICAgfSxcbiAqICAgICBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XG4gKiAgICAgICBjb25zb2xlLmxvZyhyZXMuY29kZSwgcmVzLmRhdGEpO1xuICogICAgIH0sXG4gKiAgIH0pXG4gKiAgIC5leGVjKCk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdG9yUXVlcnkgaW1wbGVtZW50cyBJU2VsZWN0b3JRdWVyeSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2NvbXBvbmVudDogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IF90YXNrUXVldWU6IEZ1bmN0aW9uW107XG4gIHByaXZhdGUgcmVhZG9ubHkgX25hdGl2ZV9wcm94eTogU2VsZWN0b3JRdWVyeU5hdGl2ZVByb3h5O1xuICBwcml2YXRlIF9yb290X3VuaXF1ZV9pZD86IG51bWJlcjtcblxuICAvKipcbiAgICogTm9ybWFsbHksIGEgcXVlcnkgaXMgZXhlY3V0ZWQgYWZ0ZXIgY2FsbGluZyBleGVjKCkuXG4gICAqIEhvd2V2ZXIsIHdoZW4gYF9maXJlX2ltbWVkaWF0ZWx5YCBpcyBzZXQgdG8gdHJ1ZSxcbiAgICogdGhlIHF1ZXJ5IHdpbGwgYmUgZXhlY3V0ZWQgaW1tZWRpYXRlbHkgYWZ0ZXIgdGFzayBjb21taXR0ZWQgKHdoZW4gY2FsbGluZyBgaW52b2tlKClgLCBldGMuKVxuICAgKiB3aXRob3V0IHRoZSBuZWVkIG9mIGNhbGxpbmcgYGV4ZWMoKWAgZXhwbGljaXRseS5cbiAgICpcbiAgICogVGhpcyBpcyB1c2VkIHdoZW4gU2VsZWN0b3JRdWVyeSBpcyB1c2VkIGFzIFJlYWN0UmVmLlxuICAgKi9cbiAgcHJpdmF0ZSBfZmlyZV9pbW1lZGlhdGVseTogYm9vbGVhbjtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKFxuICAgIGNvbXBvbmVudDogc3RyaW5nLFxuICAgIHRhc2tRdWV1ZTogRnVuY3Rpb25bXSxcbiAgICBwcm94eTogU2VsZWN0b3JRdWVyeU5hdGl2ZVByb3h5XG4gICkge1xuICAgIHRoaXMuX2NvbXBvbmVudCA9IGNvbXBvbmVudDtcbiAgICB0aGlzLl90YXNrUXVldWUgPSB0YXNrUXVldWU7XG4gICAgdGhpcy5fbmF0aXZlX3Byb3h5ID0gcHJveHk7XG4gICAgdGhpcy5fZmlyZV9pbW1lZGlhdGVseSA9IGZhbHNlO1xuICAgIHRoaXMuX3Jvb3RfdW5pcXVlX2lkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgc3RhdGljIGZyb21RdWVyeShcbiAgICBwcmV2UXVlcnk6IFNlbGVjdG9yUXVlcnksXG4gICAgY29tcG9uZW50Pzogc3RyaW5nXG4gICk6IFNlbGVjdG9yUXVlcnkge1xuICAgIHJldHVybiBuZXcgU2VsZWN0b3JRdWVyeShcbiAgICAgIGNvbXBvbmVudCA/PyBwcmV2UXVlcnkuX2NvbXBvbmVudCxcbiAgICAgIHByZXZRdWVyeS5fdGFza1F1ZXVlLnNsaWNlKCksXG4gICAgICBwcmV2UXVlcnkuX25hdGl2ZV9wcm94eVxuICAgICk7XG4gIH1cblxuICBzdGF0aWMgbmV3RW1wdHlRdWVyeShcbiAgICBwcm94eTogU2VsZWN0b3JRdWVyeU5hdGl2ZVByb3h5LFxuICAgIGNvbXBvbmVudD86IHN0cmluZ1xuICApOiBTZWxlY3RvclF1ZXJ5IHtcbiAgICByZXR1cm4gbmV3IFNlbGVjdG9yUXVlcnkoY29tcG9uZW50ID8/ICcnLCBbXSwgcHJveHkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFjY29yZGluZyB0byBgdGhpcy5fZmlyZV9pbW1lZGlhdGVseWAsXG4gICAqIGVpdGhlciBleGVjdXRlIHRoZSBxdWVyeSBpbW1lZGlhdGVseSBvciBhZGQgaXQgdG8gdGhlIHRhc2sgcXVldWUgb2YgdGhlIFNlbGVjdG9yUXVlcnkuXG4gICAqIEluIHRoZSBsYXR0ZXIgY2FzZSwgYSBuZXcgcXVlcnkgaXMgcmV0dXJuZWQsIGFuZCBgdGhpc2AgaXMgbm90IG1vZGlmaWVkLlxuICAgKiBAcGFyYW0gdGFzayB0aGUgdGFzayB0byBjb21taXRcbiAgICovXG4gIGNvbW1pdFRhc2sodGFzazogRnVuY3Rpb24pOiBJU2VsZWN0b3JRdWVyeSB7XG4gICAgbGV0IG5ld19xdWVyeSA9IFNlbGVjdG9yUXVlcnkuZnJvbVF1ZXJ5KHRoaXMsIHRoaXMuX2NvbXBvbmVudCk7XG4gICAgbmV3X3F1ZXJ5Ll90YXNrUXVldWUucHVzaCh0YXNrKTtcblxuICAgIGlmICh0aGlzLl9maXJlX2ltbWVkaWF0ZWx5KSB7XG4gICAgICBuZXdfcXVlcnkuZXhlYygpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIG5ld19xdWVyeTtcbiAgfVxuXG4gIGluKGNvbXBvbmVudDogeyBjcmVhdGVTZWxlY3RvclF1ZXJ5OiBGdW5jdGlvbiB9KTogSVNlbGVjdG9yUXVlcnkge1xuICAgIHJldHVybiBjb21wb25lbnQuY3JlYXRlU2VsZWN0b3JRdWVyeSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIGEgc2luZ2xlIG5vZGUgYnkgQ1NTIHNlbGVjdG9yLlxuICAgKiBAcGFyYW0gc2VsZWN0b3IgQ1NTIHNlbGVjdG9yXG4gICAqL1xuICBzZWxlY3Qoc2VsZWN0b3I6IHN0cmluZyk6IElOb2Rlc1JlZiB7XG4gICAgcmV0dXJuIG5ldyBOb2Rlc1JlZih0aGlzLCB7XG4gICAgICB0eXBlOiBJZGVudGlmaWVyVHlwZS5JRF9TRUxFQ1RPUixcbiAgICAgIGlkZW50aWZpZXI6IHNlbGVjdG9yLFxuICAgICAgY29tcG9uZW50X2lkOiB0aGlzLl9jb21wb25lbnQsXG4gICAgICByb290X3VuaXF1ZV9pZDogdGhpcy5fcm9vdF91bmlxdWVfaWQsXG4gICAgICBmaXJzdF9vbmx5OiB0cnVlLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdHMgYWxsIG5vZGVzIHNhdGlzZnlpbmcgQ1NTIHNlbGVjdG9yLlxuICAgKiBAcGFyYW0gc2VsZWN0b3IgQ1NTIHNlbGVjdG9yXG4gICAqL1xuICBzZWxlY3RBbGwoc2VsZWN0b3I6IHN0cmluZyk6IElOb2Rlc1JlZiB7XG4gICAgcmV0dXJuIG5ldyBOb2Rlc1JlZih0aGlzLCB7XG4gICAgICB0eXBlOiBJZGVudGlmaWVyVHlwZS5JRF9TRUxFQ1RPUixcbiAgICAgIGlkZW50aWZpZXI6IHNlbGVjdG9yLFxuICAgICAgY29tcG9uZW50X2lkOiB0aGlzLl9jb21wb25lbnQsXG4gICAgICByb290X3VuaXF1ZV9pZDogdGhpcy5fcm9vdF91bmlxdWVfaWQsXG4gICAgICBmaXJzdF9vbmx5OiBmYWxzZSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIGEgc2luZ2xlIG5vZGUgYXMgUmVhY3QgcmVmLlxuICAgKiBXaGVuIHdvcmtzIGFzIFJlYWN0UmVmLCBTZWxlY3RvclF1ZXJ5IHNob3VsZCBhY3QgbGlrZSBnZXROb2RlUmVmLCB3aGljaCBtZWFuczpcbiAgICogMS4gY2FzY2FkZSBxdWVyeSBpcyBkaXNhYmxlZC5cbiAgICogMi4gdGFza3MgYXJlIGV4ZWN1dGVkIGltbWVkaWF0ZWx5IHdpdGhvdXQgY2FsbGluZyBleGVjKCkuXG4gICAqL1xuICBzZWxlY3RSZWFjdFJlZihyZWZfc3RyaW5nOiBzdHJpbmcpOiBJTm9kZXNSZWYge1xuICAgIGlmICh0aGlzLl90YXNrUXVldWUubGVuZ3RoKSB7XG4gICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPVxuICAgICAgICAnc2VsZWN0UmVhY3RSZWYoKSBzaG91bGQgYmUgY2FsbGVkIGJlZm9yZSBhbnkgb3RoZXIgc2VsZWN0b3IgcXVlcnkgbWV0aG9kcyc7XG4gICAgICBuYXRpdmVDb25zb2xlLndhcm4oZXJyb3JNZXNzYWdlKTtcbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgICByZXBvcnRFcnJvcihcbiAgICAgICAgbmV3IEludm9rZUVycm9yKGVycm9yTWVzc2FnZSwgZXJyb3Iuc3RhY2spLFxuICAgICAgICB0aGlzLl9uYXRpdmVfcHJveHkubmF0aXZlQXBwXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2ZpcmVfaW1tZWRpYXRlbHkgPSB0cnVlO1xuICAgIHJldHVybiBuZXcgTm9kZXNSZWYodGhpcywge1xuICAgICAgdHlwZTogSWRlbnRpZmllclR5cGUuUkVGX0lELFxuICAgICAgaWRlbnRpZmllcjogcmVmX3N0cmluZyxcbiAgICAgIGNvbXBvbmVudF9pZDogdGhpcy5fY29tcG9uZW50LFxuICAgICAgcm9vdF91bmlxdWVfaWQ6IHRoaXMuX3Jvb3RfdW5pcXVlX2lkLFxuICAgICAgZmlyc3Rfb25seTogdHJ1ZSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3Qgcm9vdCBub2RlIG9mIHRoZSBjb21wb25lbnQuXG4gICAqL1xuICBzZWxlY3RSb290KCk6IElOb2Rlc1JlZiB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0KCcnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIGEgc2luZ2xlIG5vZGUgYnkgZWxlbWVudCBpZC5cbiAgICogV2hlbiBhIHRvdWNoIGV2ZW50IGlzIHRyaWdnZXJlZCwgdGhlIGVsZW1lbnQgaWQgb2YgdGhlIG5vZGUgaXMgcGFzc2VkIHRvIHRoZSBldmVudCBoYW5kbGVyIGFzICd1aWQnLFxuICAgKiBieSB3aGljaCBjYW4gYSBub2RlIGJlIHNlbGVjdGVkIGluIGl0cyBldmVudCBoYW5kbGVyLlxuICAgKi9cbiAgc2VsZWN0VW5pcXVlSUQodW5pcXVlSWQ6IHN0cmluZyB8IG51bWJlcik6IElOb2Rlc1JlZiB7XG4gICAgcmV0dXJuIG5ldyBOb2Rlc1JlZih0aGlzLCB7XG4gICAgICB0eXBlOiBJZGVudGlmaWVyVHlwZS5VTklRVUVfSUQsXG4gICAgICBpZGVudGlmaWVyOiB1bmlxdWVJZC50b1N0cmluZygpLFxuICAgICAgY29tcG9uZW50X2lkOiB0aGlzLl9jb21wb25lbnQsXG4gICAgICByb290X3VuaXF1ZV9pZDogdGhpcy5fcm9vdF91bmlxdWVfaWQsXG4gICAgICBmaXJzdF9vbmx5OiB0cnVlLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYWxsIHRhc2tzIGluIHRoZSB0YXNrIHF1ZXVlLlxuICAgKiBXaGVuIGB0aGlzLl9maXJlX2ltbWVkaWF0ZWx5YCBpcyBzZXQgdG8gdHJ1ZSwgdGhpcyBtZXRob2QgaXMgY2FsbGVkIGF1dG9tYXRpY2FsbHkuXG4gICAqL1xuICBleGVjKCk6IHZvaWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdGFza1F1ZXVlLmxlbmd0aDsgKytpKSB7XG4gICAgICB0aGlzLl90YXNrUXVldWVbaV0odGhpcy5fbmF0aXZlX3Byb3h5KTtcbiAgICB9XG4gIH1cblxuICBzZXRSb290KHVuaXF1ZUlkOiBzdHJpbmcgfCBudW1iZXIpOiBTZWxlY3RvclF1ZXJ5IHtcbiAgICB0aGlzLl9yb290X3VuaXF1ZV9pZCA9IE51bWJlcih1bmlxdWVJZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5vZGVzUmVmIGltcGxlbWVudHMgSU5vZGVzUmVmIHtcbiAgcHJpdmF0ZSBzdGF0aWMgbm9kZVBvb2wgPSB7fTtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9ub2RlU2VsZWN0VG9rZW46IE5vZGVTZWxlY3RUb2tlbjtcbiAgcHJpdmF0ZSByZWFkb25seSBfc2VsZWN0b3JRdWVyeTogU2VsZWN0b3JRdWVyeTtcblxuICBjb25zdHJ1Y3RvcihzZWxlY3RvclF1ZXJ5OiBTZWxlY3RvclF1ZXJ5LCBub2RlU2VsZWN0VG9rZW46IE5vZGVTZWxlY3RUb2tlbikge1xuICAgIHRoaXMuX25vZGVTZWxlY3RUb2tlbiA9IG5vZGVTZWxlY3RUb2tlbjtcbiAgICB0aGlzLl9zZWxlY3RvclF1ZXJ5ID0gc2VsZWN0b3JRdWVyeTtcbiAgfVxuICBpbnZva2Uob3B0aW9uczogdWlNZXRob2RPcHRpb25zKTogSVNlbGVjdG9yUXVlcnkge1xuICAgIGxldCBlcnJvclN0YWNrO1xuICAgIGlmIChOT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyB8fCBOT0RFX0VOViA9PT0gJ3Rlc3QnKSB7XG4gICAgICBlcnJvclN0YWNrID0gbmV3IEVycm9yKCcnKTtcbiAgICB9XG5cbiAgICBsZXQgdGFzayA9IChwcm94eTogU2VsZWN0b3JRdWVyeU5hdGl2ZVByb3h5KSA9PiB7XG4gICAgICBsZXQgY2FsbGJhY2sgPSAocmVzKSA9PiB7XG4gICAgICAgIGlmIChyZXMuY29kZSA9PT0gRXJyb3JDb2RlLlNVQ0NFU1MpIHtcbiAgICAgICAgICBvcHRpb25zLnN1Y2Nlc3MgJiYgb3B0aW9ucy5zdWNjZXNzKHJlcy5kYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5mYWlsKSB7XG4gICAgICAgICAgICBvcHRpb25zLmZhaWwocmVzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZW5hYmxlIHdhcm5pbmcgaW4gZGV2ZWxvcG1lbnQgYW5kIHRlc3RcbiAgICAgICAgICAgIGlmIChOT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyB8fCBOT0RFX0VOViA9PT0gJ3Rlc3QnKSB7XG4gICAgICAgICAgICAgIGlmICghcHJveHkubHlueC5fc3dpdGNoZXMuZGlzYWJsZVNlbGVjdG9yUXVlcnlXYXJuaW5nV2hlbkZhaWxlZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGBGYWlsZWQgdG8gZXhlYyBjcmVhdGVTZWxlY3RvclF1ZXJ5KCkuaW52b2tlKCkgb24gTm9kZXNSZWYgJHtKU09OLnN0cmluZ2lmeShcbiAgICAgICAgICAgICAgICAgIHRoaXMuX25vZGVTZWxlY3RUb2tlblxuICAgICAgICAgICAgICAgICl9LiBBZGQgYSBmYWlsIGNhbGxiYWNrIHRvIHN1cHByZXNzIHRoaXMgd2FybmluZy4gTXNnOiAke0pTT04uc3RyaW5naWZ5KFxuICAgICAgICAgICAgICAgICAgcmVzXG4gICAgICAgICAgICAgICAgKX1gO1xuICAgICAgICAgICAgICAgIG5hdGl2ZUNvbnNvbGUud2FybihlcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIHJlcG9ydEVycm9yKFxuICAgICAgICAgICAgICAgICAgbmV3IEludm9rZUVycm9yKGVycm9yTWVzc2FnZSwgZXJyb3JTdGFjay5zdGFjayksXG4gICAgICAgICAgICAgICAgICBwcm94eS5uYXRpdmVBcHBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgaWYgKCF0aGlzLl9ub2RlU2VsZWN0VG9rZW4uZmlyc3Rfb25seSkge1xuICAgICAgICBjYWxsYmFjayh7XG4gICAgICAgICAgY29kZTogRXJyb3JDb2RlLlNFTEVDVE9SX05PVF9TVVBQT1JURUQsXG4gICAgICAgICAgZGF0YTogJ3NlbGVjdEFsbCBub3Qgc3VwcG9ydGVkIGZvciBpbnZva2UgbWV0aG9kJyxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHByb3h5Lm5hdGl2ZUFwcC5pbnZva2VVSU1ldGhvZChcbiAgICAgICAgdGhpcy5fbm9kZVNlbGVjdFRva2VuLnR5cGUsXG4gICAgICAgIHRoaXMuX25vZGVTZWxlY3RUb2tlbi5pZGVudGlmaWVyLFxuICAgICAgICB0aGlzLl9ub2RlU2VsZWN0VG9rZW4uY29tcG9uZW50X2lkLFxuICAgICAgICBvcHRpb25zLm1ldGhvZCxcbiAgICAgICAgb3B0aW9ucy5wYXJhbXMgPz8ge30sXG4gICAgICAgIGNhbGxiYWNrLFxuICAgICAgICB0aGlzLl9ub2RlU2VsZWN0VG9rZW4ucm9vdF91bmlxdWVfaWRcbiAgICAgICk7XG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0b3JRdWVyeS5jb21taXRUYXNrKHRhc2spO1xuICB9XG5cbiAgcGF0aChjYjogRnVuY3Rpb24pIHtcbiAgICBsZXQgdGFzayA9IChwcm94eTogU2VsZWN0b3JRdWVyeU5hdGl2ZVByb3h5KSA9PiB7XG4gICAgICBsZXQgY2FsbGJhY2sgPSAocmVzKSA9PiB7XG4gICAgICAgIGNiICYmIGNiKHJlcy5kYXRhLCByZXMuc3RhdHVzKTtcbiAgICAgIH07XG4gICAgICBwcm94eS5uYXRpdmVBcHAuZ2V0UGF0aEluZm8oXG4gICAgICAgIHRoaXMuX25vZGVTZWxlY3RUb2tlbi50eXBlLFxuICAgICAgICB0aGlzLl9ub2RlU2VsZWN0VG9rZW4uaWRlbnRpZmllcixcbiAgICAgICAgdGhpcy5fbm9kZVNlbGVjdFRva2VuLmNvbXBvbmVudF9pZCxcbiAgICAgICAgdGhpcy5fbm9kZVNlbGVjdFRva2VuLmZpcnN0X29ubHksXG4gICAgICAgIGNhbGxiYWNrLFxuICAgICAgICB0aGlzLl9ub2RlU2VsZWN0VG9rZW4ucm9vdF91bmlxdWVfaWRcbiAgICAgICk7XG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0b3JRdWVyeS5jb21taXRUYXNrKHRhc2spO1xuICB9XG5cbiAgZmllbGRzKGZpZWxkczogdWlGaWVsZHNPcHRpb25zLCBjYjogRnVuY3Rpb24pIHtcbiAgICBsZXQgdGFzayA9IChwcm94eTogU2VsZWN0b3JRdWVyeU5hdGl2ZVByb3h5KSA9PiB7XG4gICAgICBsZXQgY2FsbGJhY2sgPSAocmVzOiB7IGRhdGE6IGFueTsgc3RhdHVzOiBhbnkgfSkgPT4ge1xuICAgICAgICAvLyB3aGVuICdxdWVyeScgaXMgcGFzc2VkLCAndW5pcXVlX2lkJyBpcyBhY3R1YWxseSByZXR1cm5lZC5cbiAgICAgICAgLy8gc2hvdWxkIGNyZWF0ZSBTZWxlY3RvclF1ZXJ5IHVzaW5nICd1bmlxdWVfaWQnIGFzIHJvb3QgaGVyZS5cbiAgICAgICAgaWYgKGZpZWxkcy5xdWVyeSkge1xuICAgICAgICAgIGNvbnN0IGFkZFF1ZXJ5T2JqZWN0ID0gKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgcmVzdWx0LnF1ZXJ5ID0gU2VsZWN0b3JRdWVyeS5uZXdFbXB0eVF1ZXJ5KHByb3h5KTtcbiAgICAgICAgICAgIHJlc3VsdC5xdWVyeS5zZXRSb290KHJlc3VsdC51bmlxdWVfaWQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBpZiAoIWZpZWxkcy51bmlxdWVfaWQpIHtcbiAgICAgICAgICAgICAgZGVsZXRlIHJlc3VsdC51bmlxdWVfaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAodGhpcy5fbm9kZVNlbGVjdFRva2VuLmZpcnN0X29ubHkpIHtcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSByZXMuZGF0YTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgYWRkUXVlcnlPYmplY3QocmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChsZXQgcmVzdWx0IG9mIHJlcy5kYXRhKSB7XG4gICAgICAgICAgICAgIGFkZFF1ZXJ5T2JqZWN0KHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNiICYmIGNiKHJlcy5kYXRhLCByZXMuc3RhdHVzKTtcbiAgICAgIH07XG4gICAgICBsZXQgZmllbGRzX2FycmF5OiBzdHJpbmdbXSA9IFtdO1xuICAgICAgZm9yIChsZXQga2V5IGluIGZpZWxkcykge1xuICAgICAgICAvLyBmaWx0ZXIgJ3F1ZXJ5Jy4gdXNlICd1bmlxdWVfaWQnIGluc3RlYWQuXG4gICAgICAgIGlmIChrZXkgPT0gJ3F1ZXJ5JyAmJiBmaWVsZHNba2V5XSA9PSB0cnVlICYmICFmaWVsZHMudW5pcXVlX2lkKSB7XG4gICAgICAgICAgZmllbGRzX2FycmF5LnB1c2goJ3VuaXF1ZV9pZCcpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWVsZHNba2V5XSkge1xuICAgICAgICAgIGZpZWxkc19hcnJheS5wdXNoKGtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHByb3h5Lm5hdGl2ZUFwcC5nZXRGaWVsZHMoXG4gICAgICAgIHRoaXMuX25vZGVTZWxlY3RUb2tlbi50eXBlLFxuICAgICAgICB0aGlzLl9ub2RlU2VsZWN0VG9rZW4uaWRlbnRpZmllcixcbiAgICAgICAgdGhpcy5fbm9kZVNlbGVjdFRva2VuLmNvbXBvbmVudF9pZCxcbiAgICAgICAgdGhpcy5fbm9kZVNlbGVjdFRva2VuLmZpcnN0X29ubHksXG4gICAgICAgIGZpZWxkc19hcnJheSxcbiAgICAgICAgY2FsbGJhY2ssXG4gICAgICAgIHRoaXMuX25vZGVTZWxlY3RUb2tlbi5yb290X3VuaXF1ZV9pZFxuICAgICAgKTtcbiAgICB9O1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RvclF1ZXJ5LmNvbW1pdFRhc2sodGFzayk7XG4gIH1cblxuICBzZXROYXRpdmVQcm9wcyhuYXRpdmVQcm9wczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pIHtcbiAgICBsZXQgdGFzayA9IChwcm94eTogU2VsZWN0b3JRdWVyeU5hdGl2ZVByb3h5KSA9PiB7XG4gICAgICBwcm94eS5uYXRpdmVBcHAuc2V0TmF0aXZlUHJvcHMoXG4gICAgICAgIHRoaXMuX25vZGVTZWxlY3RUb2tlbi50eXBlLFxuICAgICAgICB0aGlzLl9ub2RlU2VsZWN0VG9rZW4uaWRlbnRpZmllcixcbiAgICAgICAgdGhpcy5fbm9kZVNlbGVjdFRva2VuLmNvbXBvbmVudF9pZCxcbiAgICAgICAgdGhpcy5fbm9kZVNlbGVjdFRva2VuLmZpcnN0X29ubHksXG4gICAgICAgIG5hdGl2ZVByb3BzLFxuICAgICAgICB0aGlzLl9ub2RlU2VsZWN0VG9rZW4ucm9vdF91bmlxdWVfaWRcbiAgICAgICk7XG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0b3JRdWVyeS5jb21taXRUYXNrKHRhc2spO1xuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgaXNFcnJvcixcbiAgaXNGdW5jdGlvbixcbiAgaXNPYmplY3QsXG4gIGlzU3RyaW5nLFxufSBmcm9tICdAbHlueC1qcy9ydW50aW1lLXNoYXJlZCc7XG5pbXBvcnQge1xuICBDcmVhdGVJbnRlcnNlY3Rpb25PYnNlcnZlckZ1bmMsXG4gIEdsb2JhbFByb3BzLFxuICBMb2FkRHluYW1pY0NvbXBvbmVudEZhaWxlZFJlc3VsdCxcbiAgTG9hZER5bmFtaWNDb21wb25lbnRGdW5jLFxuICBMb2FkRHluYW1pY0NvbXBvbmVudFN1Y2Nlc3NSZXN1bHQsXG4gIEx5bnhTZXRUaW1lb3V0LFxufSBmcm9tICdAbHlueC1qcy90eXBlcyc7XG5pbXBvcnQge1xuICBSZXF1aXJlTW9kdWxlLFxuICBSZXF1aXJlTW9kdWxlQXN5bmMsXG4gIERpc3BhdGNoRXZlbnRSZXN1bHQsXG4gIE5hdGl2ZUx5bnhQcm94eSxcbn0gZnJvbSAnLi9pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQmFzZUFwcCwgTmF0aXZlQXBwIH0gZnJvbSAnLi4vYXBwJztcbmltcG9ydCB7IFRleHRJbmZvLCBUZXh0TWV0cmljcyB9IGZyb20gJy4uL21vZHVsZXMvbmF0aXZlTW9kdWxlcyc7XG5pbXBvcnQgbmF0aXZlR2xvYmFsIGZyb20gJy4uL2NvbW1vbi9uYXRpdmVHbG9iYWwnO1xuaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi4vbW9kdWxlcy9lbGVtZW50JztcbmltcG9ydCB7IEx5bnhFcnJvckxldmVsIH0gZnJvbSAnLi4vbW9kdWxlcy9yZXBvcnQnO1xuaW1wb3J0IHsgTWVzc2FnZUV2ZW50VHlwZSwgTWVzc2FnZUV2ZW50IH0gZnJvbSAnLi9pbnRlcmZhY2UnO1xuaW1wb3J0IFBlcmZvcm1hbmNlIGZyb20gJy4uL21vZHVsZXMvcGVyZm9ybWFuY2UnO1xuaW1wb3J0IFNlbGVjdG9yUXVlcnkgZnJvbSAnLi4vbW9kdWxlcy9zZWxlY3RvclF1ZXJ5L1NlbGVjdG9yUXVlcnknO1xuXG5leHBvcnQgY2xhc3MgTHlueCB7XG4gIHN0YXRpYyBfX3JlZ2lzdGVyU2hhcmVkRGF0YUNvdW50ZXI6IG51bWJlciA9IDA7XG4gIF9fZ2xvYmFsUHJvcHM6IEdsb2JhbFByb3BzO1xuICBfX3ByZXNldERhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICBfc3dpdGNoZXM6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+O1xuICB0YXJnZXRTZGtWZXJzaW9uPzogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIC8vIHNob3VsZCB1c2UgZnVuY3Rpb24gdG8gZ2V0IG5hdGl2ZSBhcHAgdG8gYXZvaWQgY3ljbGVcbiAgICBwdWJsaWMgZ2V0TmF0aXZlQXBwOiAoKSA9PiBOYXRpdmVBcHAsXG4gICAgcHVibGljIGdldEFwcDogKCkgPT4gQmFzZUFwcCxcbiAgICBwdWJsaWMgUHJvbWlzZTogUHJvbWlzZUNvbnN0cnVjdG9yLFxuICAgIHB1YmxpYyBnZXROYXRpdmVMeW54OiAoKSA9PiBOYXRpdmVMeW54UHJveHlcbiAgKSB7XG4gICAgdGhpcy5pbml0KHVuZGVmaW5lZCk7XG4gIH1cblxuICBzZXRUaW1lb3V0OiBMeW54U2V0VGltZW91dCA9IHRoaXMuZ2V0QXBwKCkud3JhcFJlcG9ydChcbiAgICB0aGlzLmdldE5hdGl2ZUFwcCgpLnNldFRpbWVvdXQsXG4gICAgJ3NldFRpbWVvdXQgRXJyb3InXG4gICk7XG5cbiAgcHVibGljIHJlYmluZChnZXRBcHA6ICgpID0+IEJhc2VBcHApIHtcbiAgICB0aGlzLmluaXQoZ2V0QXBwKTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdChnZXRBcHA/OiAoKSA9PiBCYXNlQXBwKSB7XG4gICAgaWYgKGdldEFwcCkge1xuICAgICAgdGhpcy5nZXRBcHAgPSBnZXRBcHA7XG4gICAgICAvLyBUT0RPKGxpeWFuYm8pOiBtZXJnZSBvciByZXBsYWNlPyBub3cgaXMgcmVwbGFjZS5cbiAgICAgIHRoaXMuX19nbG9iYWxQcm9wcyA9IHRoaXMuZ2V0TmF0aXZlTHlueCgpLl9fZ2xvYmFsUHJvcHMgfHwge307XG4gICAgICB0aGlzLl9fcHJlc2V0RGF0YSA9IHRoaXMuZ2V0TmF0aXZlTHlueCgpLl9fcHJlc2V0RGF0YSB8fCB7fTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY2FjaGUgPSB7fTtcbiAgICAgIHRoaXMucmVxdWlyZU1vZHVsZS5jYWNoZSA9IGNhY2hlO1xuICAgICAgdGhpcy5yZXF1aXJlTW9kdWxlQXN5bmMuY2FjaGUgPSBjYWNoZTtcbiAgICAgIHRoaXMuX19nbG9iYWxQcm9wcyA9IHRoaXMuZ2V0TmF0aXZlTHlueCgpLl9fZ2xvYmFsUHJvcHMgfHwge307XG4gICAgICB0aGlzLl9fcHJlc2V0RGF0YSA9IHRoaXMuZ2V0TmF0aXZlTHlueCgpLl9fcHJlc2V0RGF0YSB8fCB7fTtcbiAgICAgIHRoaXMuX3N3aXRjaGVzID0ge307XG4gICAgfVxuICB9XG5cbiAgc2V0SW50ZXJ2YWw6IEx5bnhTZXRUaW1lb3V0ID0gdGhpcy5nZXRBcHAoKS53cmFwUmVwb3J0KFxuICAgIHRoaXMuZ2V0TmF0aXZlQXBwKCkuc2V0SW50ZXJ2YWwsXG4gICAgJ3NldEludGVydmFsIEVycm9yJ1xuICApO1xuICBjbGVhckludGVydmFsID0gdGhpcy5nZXROYXRpdmVBcHAoKS5jbGVhckludGVydmFsO1xuICBjbGVhclRpbWVvdXQgPSB0aGlzLmdldE5hdGl2ZUFwcCgpLmNsZWFyVGltZW91dDtcblxuICByZXN1bWVFeHBvc3VyZSA9IHRoaXMuZ2V0QXBwKCkuX2FwaUxpc3RbJ3Jlc3VtZUV4cG9zdXJlJ10gYXMgKCkgPT4gdm9pZDtcblxuICByZXF1aXJlTW9kdWxlID0gPFJlcXVpcmVNb2R1bGU+KDxUPihcbiAgICBwYXRoOiBzdHJpbmcsXG4gICAgZW50cnlOYW1lPzogc3RyaW5nLFxuICAgIG9wdGlvbnM/OiB7IHRpbWVvdXQ6IG51bWJlciB9XG4gICk6IFQgPT4ge1xuICAgIGlmICh0aGlzLnJlcXVpcmVNb2R1bGUuY2FjaGVbcGF0aF0pIHtcbiAgICAgIHJldHVybiB0aGlzLnJlcXVpcmVNb2R1bGUuY2FjaGVbcGF0aF0gYXMgVDtcbiAgICB9XG4gICAgLy8gVE9ETyh3YW5ncWluZ3l1KTogZGVhbCB3aXRoIGN5Y2xpYyByZXF1aXJlTW9kdWxlXG4gICAgY29uc3QgZXhwb3J0cyA9IHRoaXMuZ2V0QXBwKCkucmVxdWlyZU1vZHVsZTxUPihwYXRoLCBlbnRyeU5hbWUsIG9wdGlvbnMpO1xuXG4gICAgLy8gV2hlbiBlcnJvciBoYXBwZW5zIGluIGxvYWRpbmcgb3IgZXhlY3V0aW5nLCBhIEpTIGVycm9yIHdpbGwgYmUgdGhyb3duLlxuICAgIC8vIFNvIHdoZW4gd2UgYXJlIGhlcmUsIHRoZSBtb2R1bGUgaXMgbG9hZGVkIGFuZCBleGVjdXRlZCBzdWNjZXNzZnVsbHkuXG4gICAgdGhpcy5yZXF1aXJlTW9kdWxlLmNhY2hlW3BhdGhdID0gZXhwb3J0cztcbiAgICByZXR1cm4gZXhwb3J0cztcbiAgfSk7XG5cbiAgcmVxdWlyZU1vZHVsZUFzeW5jID0gPFJlcXVpcmVNb2R1bGVBc3luYz4oPFQ+KFxuICAgIHBhdGg6IHN0cmluZyxcbiAgICBjYWxsYmFjaz86IChlcnJvcj86IEVycm9yLCByZXQ/OiBUKSA9PiB2b2lkXG4gICk6IHZvaWQgPT4ge1xuICAgIGNhbGxiYWNrID8/PSAoZXJyb3I/OiBFcnJvcikgPT4ge1xuICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAvLyBgdW5kZWZpbmVkIHwgbnVsbGAgbWVhbnMgbm8gZXJyb3Igb2NjdXJyZWRcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5nZXRBcHAoKS5oYW5kbGVVc2VyRXJyb3IoZXJyb3IpO1xuICAgIH07XG5cbiAgICBpZiAodGhpcy5yZXF1aXJlTW9kdWxlQXN5bmMuY2FjaGVbcGF0aF0pIHtcbiAgICAgIGNhbGxiYWNrKG51bGwsIHRoaXMucmVxdWlyZU1vZHVsZUFzeW5jLmNhY2hlW3BhdGhdIGFzIFQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBUT0RPKHdhbmdxaW5neXUpOiBkZWFsIHdpdGggY3ljbGljIHJlcXVpcmVNb2R1bGVcbiAgICB0aGlzLmdldEFwcCgpLnJlcXVpcmVNb2R1bGVBc3luYzxUPihwYXRoLCAoZXJyb3IsIGV4cG9ydHMpID0+IHtcbiAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgLy8gT25seSBjYWNoZSB0aGUgZXhwb3J0cyB3aGVuIG5vIGVycm9yIGhhcHBlbmRzLlxuICAgICAgICB0aGlzLnJlcXVpcmVNb2R1bGVBc3luYy5jYWNoZVtwYXRoXSA9IGV4cG9ydHM7XG4gICAgICB9XG4gICAgICBjYWxsYmFjayhlcnJvciwgZXhwb3J0cyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGNyZWF0ZUVsZW1lbnQgPSAocm9vdElkOiBzdHJpbmcsIGlkOiBzdHJpbmcpID0+XG4gICAgdGhpcy5nZXROYXRpdmVMeW54KCkuY3JlYXRlRWxlbWVudChyb290SWQsIGlkKTtcblxuICBnZXRFbGVtZW50QnlJZCA9IChpZDogc3RyaW5nKTogRWxlbWVudCA9PiB7XG4gICAgcmV0dXJuIG5ldyBFbGVtZW50KCcnLCBpZCwgdGhpcyk7XG4gIH07XG5cbiAgcmVwb3J0RXJyb3IgPSAoZXJyb3I6IEVycm9yIHwgc3RyaW5nLCBvcHRpb25zPzogeyBsZXZlbD86IHN0cmluZyB9KTogdm9pZCA9PiB7XG4gICAgbGV0IGVycm9yT2JqOiBFcnJvcjtcbiAgICBpZiAoaXNFcnJvcihlcnJvcikpIHtcbiAgICAgIGVycm9yT2JqID0gZXJyb3I7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBtZXNzYWdlOiBzdHJpbmc7XG4gICAgICBpZiAodHlwZW9mIGVycm9yICE9PSAnc3RyaW5nJykge1xuICAgICAgICBtZXNzYWdlID0gSlNPTi5zdHJpbmdpZnkoZXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWVzc2FnZSA9IGVycm9yO1xuICAgICAgfVxuICAgICAgZXJyb3JPYmogPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICAgIGNvbnN0IHsgbGV2ZWwgPSAnZXJyb3InIH0gPSBvcHRpb25zIHx8IHt9O1xuICAgIGxldCBlcnJvckxldmVsOiBMeW54RXJyb3JMZXZlbDtcbiAgICBzd2l0Y2ggKGxldmVsKSB7XG4gICAgICBjYXNlICdlcnJvcic6XG4gICAgICAgIGVycm9yTGV2ZWwgPSBMeW54RXJyb3JMZXZlbC5FcnJvcjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd3YXJuaW5nJzpcbiAgICAgICAgZXJyb3JMZXZlbCA9IEx5bnhFcnJvckxldmVsLldhcm47XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZmF0YWwnOlxuICAgICAgICBlcnJvckxldmVsID0gTHlueEVycm9yTGV2ZWwuRmF0YWw7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgZXJyb3JMZXZlbCA9IEx5bnhFcnJvckxldmVsLkVycm9yO1xuICAgIH1cbiAgICB0aGlzLmdldEFwcCgpLmhhbmRsZVVzZXJFcnJvcihlcnJvck9iaiwgdW5kZWZpbmVkLCBlcnJvckxldmVsKTtcbiAgfTtcblxuICByZWdpc3Rlck1vZHVsZSA9IDxNb2R1bGUgZXh0ZW5kcyBvYmplY3Q+KFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBtb2R1bGU6IE1vZHVsZVxuICApOiB2b2lkID0+IHRoaXMuZ2V0QXBwKCkucmVnaXN0ZXJNb2R1bGUobmFtZSwgbW9kdWxlKTtcblxuICBnZXRKU01vZHVsZSA9IDxNb2R1bGUgPSB1bmtub3duPihuYW1lOiBzdHJpbmcpOiBNb2R1bGUgPT4ge1xuICAgIHJldHVybiB0aGlzLmdldEFwcCgpLmdldEpTTW9kdWxlPE1vZHVsZT4obmFtZSk7XG4gIH07XG5cbiAgZ2V0VGV4dEluZm8gPSB0aGlzLmdldEFwcCgpLl9hcGlMaXN0WydnZXRUZXh0SW5mbyddIGFzIChcbiAgICB0ZXh0OiBzdHJpbmcsXG4gICAgaW5mbzogVGV4dEluZm9cbiAgKSA9PiBUZXh0TWV0cmljcztcblxuICBhZGRGb250ID0gKFxuICAgIGZvbnQ6IHsgc3JjOiBzdHJpbmc7ICdmb250LWZhbWlseSc6IHN0cmluZyB9LFxuICAgIGNhbGxiYWNrOiAoZT86IEVycm9yKSA9PiB2b2lkXG4gICkgPT4ge1xuICAgIGlmICghaXNPYmplY3QoZm9udCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgb2JqZWN0IHR5cGUnKTtcbiAgICB9XG4gICAgaWYgKCFpc1N0cmluZyhmb250Wydmb250LWZhbWlseSddKSB8fCAhaXNTdHJpbmcoZm9udFsnc3JjJ10pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBmb250IHZhbHVlIG11c3QgaGF2ZSBmb250LWZhbWlseSBhbmQgc3JjJyk7XG4gICAgfVxuICAgIGlmICghaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHNlY29uZCBhcmd1bWVudCBtdXN0IGJlIGZ1bmN0aW9uIHR5cGUnKTtcbiAgICB9XG5cbiAgICB0aGlzLmdldE5hdGl2ZUx5bngoKS5hZGRGb250KGZvbnQsIGNhbGxiYWNrKTtcbiAgfTtcblxuICBzdG9wRXhwb3N1cmUgPSB0aGlzLmdldEFwcCgpLl9hcGlMaXN0WydzdG9wRXhwb3N1cmUnXSBhcyAob3B0aW9ucz86IHtcbiAgICBzZW5kRXZlbnQ6IHRydWU7XG4gIH0pID0+IHZvaWQ7XG5cbiAgc2V0T2JzZXJ2ZXJGcmFtZVJhdGUgPSB0aGlzLmdldEFwcCgpLl9hcGlMaXN0W1xuICAgICdzZXRPYnNlcnZlckZyYW1lUmF0ZSdcbiAgXSBhcyAob3B0aW9ucz86IHsgZm9yUGFnZVJlY3Q/OiBudW1iZXI7IGZvckV4cG9zdXJlQ2hlY2s/OiBudW1iZXIgfSkgPT4gdm9pZDtcblxuICBwZXJmb3JtYW5jZTogUGVyZm9ybWFuY2UgPSB0aGlzLmdldEFwcCgpLnBlcmZvcm1hbmNlO1xuXG4gIGJlZm9yZVB1Ymxpc2hFdmVudCA9IHRoaXMuZ2V0QXBwKCkuX2FvcE1hbmFnZXIuX2JlZm9yZVB1Ymxpc2hFdmVudDtcblxuICBkaXNwYXRjaFNlc3Npb25TdG9yYWdlRXZlbnQoZXZlbnQ6IE1lc3NhZ2VFdmVudCk6IHZvaWQge1xuICAgIHZhciBldmVudFJlc3VsdCA9IHRoaXMuZ2V0Q29yZUNvbnRleHQoKS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblxuICAgIC8vIEluIEx5bnhWaWV3LCB0aGUgZXZlbnQgaGFzIGJlZW4gc3VjZXNzZnVsbHkgaGFuZGxlZCBieSBgQ29yZUNvbnRleHRgLlxuICAgIGlmIChldmVudFJlc3VsdCA9PSBEaXNwYXRjaEV2ZW50UmVzdWx0Lk5vdENhbmNlbGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSW4gcnVudGltZSBzdGFuZGFsb25lIG1vZGUsIHJ1bnRpbWUgY2Fubm90IGRpc3BhdGNoIGV2ZW50IHRvIGBDb3JlQ29udGV4dGAsXG4gICAgLy8gZmFsbGJhY2sgdG8gYEpTQ29udGV4dGAgc28gdGhhdCBydW50aW1lIGNhbiBoYW5kbGUgc2Vzc2lvbiBzdG9yYWdlIGV2ZW50c1xuICAgIC8vIGJ5IGl0c2VsZi5cbiAgICB0aGlzLmdldEpTQ29udGV4dCgpLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICB9XG5cbiAgLy8gc2Vzc2lvblN0b3JhZ2UgQXBpXG4gIHNldFNlc3Npb25TdG9yYWdlSXRlbSA9IDxUPihrZXk6IHN0cmluZywgdmFsdWU6IFQpOiB2b2lkID0+IHtcbiAgICB0aGlzLmRpc3BhdGNoU2Vzc2lvblN0b3JhZ2VFdmVudCh7XG4gICAgICB0eXBlOiBNZXNzYWdlRXZlbnRUeXBlLkVWRU5UX1NFVF9TRVNTSU9OX1NUT1JBR0UsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGtleSxcbiAgICAgICAgdmFsdWUsXG4gICAgICB9LFxuICAgIH0pO1xuICB9O1xuXG4gIGdldFNlc3Npb25TdG9yYWdlSXRlbSA9IDxUPihcbiAgICBrZXk6IHN0cmluZyxcbiAgICBjYWxsYmFjazogKHZhbHVlOiBUKSA9PiB2b2lkXG4gICk6IHZvaWQgPT4ge1xuICAgIC8vIFRPRE8obmloYW8ucm95YWwpOiByZWZhY3RvciB0byBkaXNwYXRjaEV2ZW50IGFmdGVyIEFwaUNhbGxiYWNrIHN1cHBvcnRlZC5cbiAgICB0aGlzLmdldE5hdGl2ZUFwcCgpLmdldFNlc3Npb25TdG9yYWdlSXRlbShrZXksIGNhbGxiYWNrKTtcbiAgfTtcblxuICBzdWJzY3JpYmVTZXNzaW9uU3RvcmFnZSA9IDxUPihcbiAgICBrZXk6IHN0cmluZyxcbiAgICBjYWxsYmFjazogKHZhbHVlOiBUKSA9PiB2b2lkXG4gICk6IG51bWJlciA9PiB7XG4gICAgLy8gVE9ETyhuaWhhby5yb3lhbCk6IHJlZmFjdG9yIHRvIGRpc3BhdGNoRXZlbnQgYWZ0ZXIgQXBpQ2FsbGJhY2sgc3VwcG9ydGVkLlxuICAgIGxldCBsaXN0ZW5lcklkID0gTHlueC5fX3JlZ2lzdGVyU2hhcmVkRGF0YUNvdW50ZXIrKztcbiAgICB0aGlzLmdldE5hdGl2ZUFwcCgpLnN1YnNjcmliZVNlc3Npb25TdG9yYWdlKGtleSwgbGlzdGVuZXJJZCwgY2FsbGJhY2spO1xuICAgIHJldHVybiBsaXN0ZW5lcklkO1xuICB9O1xuXG4gIHVuc3Vic2NyaWJlU2Vzc2lvblN0b3JhZ2UgPSAoa2V5OiBzdHJpbmcsIGxpc3RlbmVySWQ6IG51bWJlcikgPT4ge1xuICAgIHRoaXMuZGlzcGF0Y2hTZXNzaW9uU3RvcmFnZUV2ZW50KHtcbiAgICAgIHR5cGU6IE1lc3NhZ2VFdmVudFR5cGUuRVZFTlRfVU5TVUJTQ1JJQkVfU0VTU0lPTl9TVE9SQUdFLFxuICAgICAgZGF0YToge1xuICAgICAgICBrZXksXG4gICAgICAgIGxpc3RlbmVySWQsXG4gICAgICB9LFxuICAgIH0pO1xuICB9O1xuXG4gIGdldERldnRvb2wgPSB0aGlzLmdldE5hdGl2ZUx5bngoKS5nZXREZXZ0b29sO1xuICBnZXRDb3JlQ29udGV4dCA9IHRoaXMuZ2V0TmF0aXZlTHlueCgpLmdldENvcmVDb250ZXh0O1xuICBnZXRKU0NvbnRleHQgPSB0aGlzLmdldE5hdGl2ZUx5bngoKS5nZXRKU0NvbnRleHQ7XG4gIGdldFVJQ29udGV4dCA9IHRoaXMuZ2V0TmF0aXZlTHlueCgpLmdldFVJQ29udGV4dDtcblxuICBnZXRDdXN0b21TZWN0aW9uU3luYyA9IHRoaXMuZ2V0TmF0aXZlTHlueCgpLmdldEN1c3RvbVNlY3Rpb25TeW5jO1xuXG4gIGFjY2Vzc2liaWxpdHlBbm5vdW5jZSA9IHRoaXMuZ2V0TmF0aXZlQXBwKCkubmF0aXZlTW9kdWxlUHJveHlcbiAgICAuTHlueEFjY2Vzc2liaWxpdHlNb2R1bGU/LmFjY2Vzc2liaWxpdHlBbm5vdW5jZTtcblxuICByZXF1ZXN0UmVzb3VyY2VQcmVmZXRjaCA9IHRoaXMuZ2V0TmF0aXZlQXBwKCkubmF0aXZlTW9kdWxlUHJveHlcbiAgICAuTHlueFJlc291cmNlTW9kdWxlPy5yZXF1ZXN0UmVzb3VyY2VQcmVmZXRjaDtcblxuICBjYW5jZWxSZXNvdXJjZVByZWZldGNoID0gdGhpcy5nZXROYXRpdmVBcHAoKS5uYXRpdmVNb2R1bGVQcm94eVxuICAgIC5MeW54UmVzb3VyY2VNb2R1bGU/LmNhbmNlbFJlc291cmNlUHJlZmV0Y2g7XG5cbiAgc2V0U2hhcmVkRGF0YSA9IChkYXRhS2V5OiBzdHJpbmcsIGRhdGFWYWw6IHVua25vd24pOiB2b2lkID0+IHtcbiAgICBuYXRpdmVHbG9iYWwuc2hhcmVkRGF0YVtkYXRhS2V5XSA9IGRhdGFWYWw7XG4gICAgbGV0IHZhcmlhYmxlID0ge307XG4gICAgdmFyaWFibGVbZGF0YUtleV0gPSBkYXRhVmFsO1xuICAgIG5hdGl2ZUdsb2JhbC5zaGFyZURhdGFTdWJqZWN0Lm5vdGlmeURhdGFDaGFuZ2UodmFyaWFibGUpO1xuICB9O1xuXG4gIGdldFNoYXJlZERhdGEgPSA8VCA9IHVua25vd24+KGRhdGFLZXk6IHN0cmluZyk6IFQgPT5cbiAgICBuYXRpdmVHbG9iYWwuc2hhcmVkRGF0YVtkYXRhS2V5XTtcblxuICByZWdpc3RlclNoYXJlZERhdGFPYnNlcnZlciA9IDxUPihjYWxsYmFjazogKGRhdGE6IFQpID0+IHZvaWQpOiB2b2lkID0+XG4gICAgbmF0aXZlR2xvYmFsLnNoYXJlRGF0YVN1YmplY3QucmVnaXN0ZXJPYnNlcnZlcihjYWxsYmFjayk7XG5cbiAgcmVtb3ZlU2hhcmVkRGF0YU9ic2VydmVyID0gPFQ+KGNhbGxiYWNrOiAoZGF0YTogVCkgPT4gdm9pZCk6IHZvaWQgPT5cbiAgICBuYXRpdmVHbG9iYWwuc2hhcmVEYXRhU3ViamVjdC5yZW1vdmVPYnNlcnZlcihjYWxsYmFjayk7XG5cbiAgdHJpZ2dlckxlcHVzR2xvYmFsRXZlbnQgPSAoZXZlbnQ6IHN0cmluZywgcGFyYW1zOiBSZWNvcmQ8YW55LCBhbnk+KTogdm9pZCA9PlxuICAgIHRoaXMuZ2V0TmF0aXZlQXBwKCkudHJpZ2dlckxlcHVzR2xvYmFsRXZlbnQoZXZlbnQsIHBhcmFtcyk7XG5cbiAgLy8gZm9yIHJlbG9hZFxuICByZWxvYWQgPSAodmFsdWU6IG9iamVjdCwgY2FsbGJhY2s6ICgpID0+IHZvaWQpID0+IHtcbiAgICB0aGlzLmdldE5hdGl2ZUx5bngoKS5yZWxvYWQodmFsdWUsIGNhbGxiYWNrKTtcbiAgfTtcblxuICBjcmVhdGVJbnRlcnNlY3Rpb25PYnNlcnZlcjogQ3JlYXRlSW50ZXJzZWN0aW9uT2JzZXJ2ZXJGdW5jO1xuXG4gIGZldGNoRHluYW1pY0NvbXBvbmVudCA9IChcbiAgICB1cmw6IHN0cmluZyxcbiAgICBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICAgIGNhbGxiYWNrOiAocmVzOiB7IGNvZGU6IG51bWJlciB9KSA9PiB2b2lkLFxuICAgIGlkOiBzdHJpbmdbXVxuICApID0+IHRoaXMuZ2V0TmF0aXZlTHlueCgpLmZldGNoRHluYW1pY0NvbXBvbmVudCh1cmwsIG9wdGlvbnMsIGNhbGxiYWNrLCBpZCk7XG5cbiAgLy8gV3JhcHBlciBRdWVyeUNvbXBvbmVudCB0byBkZWNpZGUgaWYgY29tcG9uZW50IGhhcyBsb2FkZWQuXG4gIFF1ZXJ5Q29tcG9uZW50ID0gKHNvdXJjZTogc3RyaW5nLCBjYWxsYmFjazogKHJlc3VsdDogYW55KSA9PiB2b2lkKSA9PiB7XG4gICAgY29uc3QgaW5uZXJJbnZva2VDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgIGNhbGxiYWNrKHtcbiAgICAgICAgY29kZTogMCxcbiAgICAgICAgZGF0YTogeyB1cmw6IHNvdXJjZSwgc3luYzogdHJ1ZSwgZXJyb3JfbWVzc2FnZTogJycsIG1vZGU6ICdjYWNoZScgfSxcbiAgICAgICAgZGV0YWlsOiB7IHNjaGVtYTogc291cmNlLCBjYWNoZTogZmFsc2UsIGVyck1zZzogJycgfSxcbiAgICAgIH0pO1xuICAgIH07XG4gICAgLy8gaWYgZHluYW1pYyBjb21wb25ldCBoYXMgYmVlbiByZWFkeSBpbiBiYWNrZ3JvdW5kIHRocmVhZCwgY2FsbGJhY2sgZGlyZWN0bHlcbiAgICBpZiAodGhpcy5nZXRBcHAoKS5sb2FkZWREeW5hbWljQ29tcG9uZW50c1NldC5oYXMoc291cmNlKSkge1xuICAgICAgaW5uZXJJbnZva2VDYWxsYmFjaygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBpZiBkeW5hbWljIGNvbXBvbmV0IGhhcyBiZWVuIHJlYWR5IGluIG1haW4gdGhyZWFkLCBsb2FkRHluYW1pY0NvbXBvbmVudCBhbmQgY2FsbGJhY2sgZGlyZWN0bHlcbiAgICBjb25zdCBpbm5lckNhbGxiYWNrID0gKHJlc3VsdDogYW55KSA9PiB7XG4gICAgICBpZiAocmVzdWx0Ll9faGFzUmVhZHkgPT09IHRydWUpIHtcbiAgICAgICAgbmF0aXZlR2xvYmFsLmxvYWREeW5hbWljQ29tcG9uZW50KHRoaXMuZ2V0QXBwKCksIHNvdXJjZSk7XG4gICAgICAgIGlubmVySW52b2tlQ2FsbGJhY2soKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKHJlc3VsdCk7XG4gICAgICB9XG4gICAgfTtcbiAgICAvLyBxdWVyeSBjb21wb25ldFxuICAgIHRoaXMuZ2V0TmF0aXZlTHlueCgpLlF1ZXJ5Q29tcG9uZW50KHNvdXJjZSwgaW5uZXJDYWxsYmFjayk7XG4gIH07XG5cbiAgbG9hZER5bmFtaWNDb21wb25lbnQ6IExvYWREeW5hbWljQ29tcG9uZW50RnVuYyA9IChcbiAgICBpZE9yVXJsOiBzdHJpbmcgfCBzdHJpbmdbXSxcbiAgICB1cmxPck9wdGlvbnM/OiBzdHJpbmcgfCBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICAgIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fVxuICApOiBQcm9taXNlPFxuICAgIExvYWREeW5hbWljQ29tcG9uZW50U3VjY2Vzc1Jlc3VsdCB8IExvYWREeW5hbWljQ29tcG9uZW50RmFpbGVkUmVzdWx0XG4gID4gPT4ge1xuICAgIHJldHVybiBuZXcgdGhpcy5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIGxlZ2FsIHBhcmFtIHR5cGVzOlxuICAgICAgLy8gMC4gKHVybDogc3RyaW5nLCA/b3B0aW9ucylcbiAgICAgIC8vIDEuIChpZDogc3RyaW5nLCB1cmw6IHN0cmluZywgP29wdGlvbnMpXG4gICAgICAvLyAyLiAoaWRzOiBzdHJpbmdbXSwgdXJsOiBzdHJpbmcsID9vcHRpb25zKVxuICAgICAgbGV0IGlkczogc3RyaW5nW10gPSBbXTtcbiAgICAgIGxldCB1cmw6IHN0cmluZztcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGlkT3JVcmwpKSB7XG4gICAgICAgIGlkcyA9IGlkT3JVcmw7XG4gICAgICAgIHVybCA9IHVybE9yT3B0aW9ucyBhcyBzdHJpbmc7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB1cmxPck9wdGlvbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlkcyA9IFtpZE9yVXJsXTtcbiAgICAgICAgdXJsID0gdXJsT3JPcHRpb25zO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXJsID0gaWRPclVybDtcbiAgICAgICAgb3B0aW9ucyA9IHVybE9yT3B0aW9ucztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmdldEFwcCgpLmxvYWRlZER5bmFtaWNDb21wb25lbnRzU2V0Lmhhcyh1cmwpKSB7XG4gICAgICAgIC8vIGludm9rZSBkaXJlY3RseVxuICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICBjb2RlOiAwLFxuICAgICAgICAgIGRhdGE6IHsgdXJsOiB1cmwsIHN5bmM6IGZhbHNlLCBlcnJvcl9tZXNzYWdlOiAnJywgbW9kZTogJ25vcm1hbCcgfSxcbiAgICAgICAgICBkZXRhaWw6IHsgc2NoZW1hOiB1cmwsIGNhY2hlOiBmYWxzZSwgZXJyTXNnOiAnJyB9LFxuICAgICAgICB9IGFzIExvYWREeW5hbWljQ29tcG9uZW50U3VjY2Vzc1Jlc3VsdCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5nZXROYXRpdmVMeW54KCkuZmV0Y2hEeW5hbWljQ29tcG9uZW50KFxuICAgICAgICB1cmwsXG4gICAgICAgIG9wdGlvbnMsXG4gICAgICAgIChyZXMpID0+IHtcbiAgICAgICAgICBpZiAocmVzICYmIHJlcy5jb2RlID09IDApIHtcbiAgICAgICAgICAgIHJlc29sdmUocmVzIGFzIExvYWREeW5hbWljQ29tcG9uZW50U3VjY2Vzc1Jlc3VsdCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlamVjdChyZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaWRzXG4gICAgICApO1xuICAgIH0pO1xuICB9O1xuXG4gIGZldGNoID0gKGlucHV0OiBSZXF1ZXN0SW5mbywgaW5pdD86IFJlcXVlc3RJbml0KTogUHJvbWlzZTxSZXNwb25zZT4gPT4ge1xuICAgIHJldHVybiBuZXcgdGhpcy5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgKHRoaXMuZ2V0QXBwKCkuX1JlcXVlc3RDbGFzcykoaW5wdXQsIGluaXQpO1xuICAgICAgY29uc3Qgc2lnbmFsID0gcmVxdWVzdC5zaWduYWw7XG4gICAgICBpZiAoc2lnbmFsLmFib3J0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdChzaWduYWwucmVhc29uKTtcbiAgICAgIH1cblxuICAgICAgc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlamVjdChzaWduYWwucmVhc29uKTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBmZXRjaEFyZyA9IHtcbiAgICAgICAgbWV0aG9kOiByZXF1ZXN0Lm1ldGhvZCxcbiAgICAgICAgdXJsOiByZXF1ZXN0LnVybCxcbiAgICAgICAgb3JpZ2luOiB0aGlzLmdldE5hdGl2ZUFwcCgpLl9fcGFnZVVybCxcbiAgICAgICAgaGVhZGVyczogT2JqZWN0LmZyb21FbnRyaWVzKHJlcXVlc3QuaGVhZGVycy5lbnRyaWVzKCkpLFxuICAgICAgICBib2R5OiByZXF1ZXN0Ll9ib2R5RGF0YS5hcnJheUJ1ZmZlcixcbiAgICAgICAgbHlueDogcmVxdWVzdC5seW54RXh0ZW5zaW9uLFxuICAgICAgfTtcbiAgICAgIHRoaXMuZ2V0QXBwKCkuTmF0aXZlTW9kdWxlcy5MeW54RmV0Y2hNb2R1bGUuZmV0Y2goXG4gICAgICAgIGZldGNoQXJnLFxuICAgICAgICAocmVzcG9uc2U6IGFueSkgPT4ge1xuICAgICAgICAgIGlmIChzaWduYWwuYWJvcnRlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzcCA9IG5ldyAodGhpcy5nZXRBcHAoKS5fUmVzcG9uc2VDbGFzcykoXG4gICAgICAgICAgICAgIHJlc3BvbnNlLmJvZHksXG4gICAgICAgICAgICAgIHJlc3BvbnNlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmVzb2x2ZShyZXNwKTtcbiAgICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgICAvLyBDYXRjaGVzIGFueSBleGNlcHRpb24gdGhhdCBtaWdodCBsZWFkIHRvIGEgZmFpbHVyZSBpblxuICAgICAgICAgICAgLy8gY3JlYXRpbmcgYSBSZXNwb25zZSBhbmQgdGhyb3dzIHRoZSBlcnJvciB1c2luZyBgcmVqZWN0YCxcbiAgICAgICAgICAgIC8vIGVuYWJsaW5nIHRoZSBmcm9udGVuZCB0byBoYW5kbGUgdGhlIGVycm9yLlxuICAgICAgICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoc2lnbmFsLmFib3J0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoZXJyb3IubWVzc2FnZSkpO1xuICAgICAgICB9XG4gICAgICApO1xuICAgIH0pO1xuICB9O1xuXG4gIGNyZWF0ZVNlbGVjdG9yUXVlcnkgPSAoKTogU2VsZWN0b3JRdWVyeSA9PiB7XG4gICAgcmV0dXJuIFNlbGVjdG9yUXVlcnkubmV3RW1wdHlRdWVyeSh7XG4gICAgICBuYXRpdmVBcHA6IHRoaXMuZ2V0TmF0aXZlQXBwKCksXG4gICAgICBseW54OiB0aGlzLFxuICAgIH0pO1xuICB9O1xuXG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IChjYWxsYmFjazogKCkgPT4gdm9pZCkgPT5cbiAgICB0aGlzLmdldE5hdGl2ZUFwcCgpLnJlcXVlc3RBbmltYXRpb25GcmFtZShjYWxsYmFjayk7XG5cbiAgY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSAoYW5pbWF0aW9uSWQ6IG51bWJlcikgPT5cbiAgICB0aGlzLmdldE5hdGl2ZUFwcCgpLmNhbmNlbEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbklkKTtcblxuICBxdWV1ZU1pY3JvdGFzayhjYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuZ2V0TmF0aXZlTHlueCgpLnF1ZXVlTWljcm90YXNrKGNhbGxiYWNrKTtcbiAgfVxuXG4gIF9fYWRkUmVwb3J0ZXJDdXN0b21JbmZvID0gKGluZm86IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiB2b2lkID0+IHtcbiAgICB0aGlzLmdldE5hdGl2ZUFwcCgpLl9fYWRkUmVwb3J0ZXJDdXN0b21JbmZvKGluZm8pO1xuICB9O1xufVxuIiwgIi8vIENvcHlyaWdodCAyMDI0IFRoZSBMeW54IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UgVmVyc2lvbiAyLjAgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlXG4vLyBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG5cbmltcG9ydCB7IEV2ZW50RW1pdHRlciBhcyBJRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGx5bngtanMvdHlwZXMnO1xuaW1wb3J0IHsgQ2FsbEx5bnhTZXRNb2R1bGUgfSBmcm9tICcuLi9uYXRpdmVNb2R1bGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRFbWl0dGVyIGltcGxlbWVudHMgSUV2ZW50RW1pdHRlciB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvcHJlZmVyLXJlYWRvbmx5XG4gIHByaXZhdGUgX2V2ZW50czogTWFwPFxuICAgIHN0cmluZyxcbiAgICB7IGxpc3RlbmVyOiAoLi4uYXJnczogdW5rbm93bltdKSA9PiB2b2lkOyBjb250ZXh0Pzogb2JqZWN0IH1bXVxuICA+O1xuICBwcml2YXRlIF9pbnRlcm5hbF9jYWxsTHlueFNldE1vZHVsZT86IENhbGxMeW54U2V0TW9kdWxlO1xuICBjb25zdHJ1Y3RvcihjYWxsTHlueFNldE1vZHVsZT86IENhbGxMeW54U2V0TW9kdWxlKSB7XG4gICAgdGhpcy5faW50ZXJuYWxfY2FsbEx5bnhTZXRNb2R1bGUgPSBjYWxsTHlueFNldE1vZHVsZTtcbiAgICB0aGlzLl9ldmVudHMgPSBuZXcgTWFwKCk7XG4gIH1cblxuICBnZXRFdmVudHNTaXplKGV2ZW50VHlwZTogc3RyaW5nKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fZXZlbnRzLmdldChldmVudFR5cGUpPy5sZW5ndGg7XG4gIH1cblxuICBzZXRDYWxsTHlueFNldE1vZHVsZShjYWxsTHlueFNldE1vZHVsZT86IENhbGxMeW54U2V0TW9kdWxlKSB7XG4gICAgdGhpcy5faW50ZXJuYWxfY2FsbEx5bnhTZXRNb2R1bGUgPSBjYWxsTHlueFNldE1vZHVsZTtcbiAgfVxuXG4gIGFkZExpc3RlbmVyKFxuICAgIGV2ZW50TmFtZTogc3RyaW5nLFxuICAgIGxpc3RlbmVyOiAoLi4uYXJnczogdW5rbm93bltdKSA9PiB2b2lkLFxuICAgIGNvbnRleHQ/OiBvYmplY3RcbiAgKTogdm9pZCB7XG4gICAgY29uc3QgZXZlbnQgPSB0aGlzLl9ldmVudHMuZ2V0KGV2ZW50TmFtZSk7XG4gICAgLy8gVE9ETzogcmVtb3ZlZCB0aGlzIGFwaSBkZXNpZ24gYWZ0ZXIgc3ByaW5nXG4gICAgaWYgKGV2ZW50TmFtZSA9PSAna2V5Ym9hcmRzdGF0dXNjaGFuZ2VkJykge1xuICAgICAgaWYgKHRoaXMuX2ludGVybmFsX2NhbGxMeW54U2V0TW9kdWxlKSB7XG4gICAgICAgIHRoaXMuX2ludGVybmFsX2NhbGxMeW54U2V0TW9kdWxlKCdzd2l0Y2hLZXlCb2FyZERldGVjdCcsIFt0cnVlXSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChldmVudCkge1xuICAgICAgZXZlbnQucHVzaCh7XG4gICAgICAgIGxpc3RlbmVyLFxuICAgICAgICBjb250ZXh0LFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2V2ZW50cy5zZXQoZXZlbnROYW1lLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBsaXN0ZW5lcixcbiAgICAgICAgICBjb250ZXh0LFxuICAgICAgICB9LFxuICAgICAgXSk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlTGlzdGVuZXIoXG4gICAgZXZlbnROYW1lOiBzdHJpbmcsXG4gICAgbGlzdGVuZXI6ICguLi5hcmdzOiB1bmtub3duW10pID0+IHZvaWRcbiAgKTogdm9pZCB7XG4gICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdyZW1vdmVMaXN0ZW5lciBvbmx5IHRha2VzIGluc3RhbmNlcyBvZiBGdW5jdGlvbicpO1xuICAgIH1cbiAgICBjb25zdCBldmVudHMgPSB0aGlzLl9ldmVudHMuZ2V0KGV2ZW50TmFtZSk7XG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShldmVudHMpKSB7XG4gICAgICBjb25zdCBmbGFnID0gZXZlbnRzLnNvbWUoKGl0ZW0pID0+IHtcbiAgICAgICAgaWYgKGxpc3RlbmVyID09PSBpdGVtLmxpc3RlbmVyKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaW5kZXgrKztcbiAgICAgIH0pO1xuICAgICAgZmxhZyAmJiBldmVudHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiByZW1vdmVkIHRoaXMgYXBpIGRlc2lnbiBhZnRlciBzcHJpbmdcbiAgICBpZiAoZXZlbnROYW1lID09ICdrZXlib2FyZHN0YXR1c2NoYW5nZWQnKSB7XG4gICAgICBpZiAodGhpcy5faW50ZXJuYWxfY2FsbEx5bnhTZXRNb2R1bGUpIHtcbiAgICAgICAgdGhpcy5faW50ZXJuYWxfY2FsbEx5bnhTZXRNb2R1bGUoJ3N3aXRjaEtleUJvYXJkRGV0ZWN0JywgW2ZhbHNlXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZW1pdChldmVudE5hbWU6IHN0cmluZywgZGF0YTogdW5rbm93bik6IHZvaWQge1xuICAgIGNvbnN0IGV2ZW50cyA9IHRoaXMuX2V2ZW50cy5nZXQoZXZlbnROYW1lKTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShldmVudHMpKSB7XG4gICAgICBldmVudHMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICBjb25zdCB7IGxpc3RlbmVyLCBjb250ZXh0IH0gPSBpdGVtO1xuICAgICAgICBpZiAodHlwZW9mIGxpc3RlbmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgbGlzdGVuZXIuYXBwbHkoY29udGV4dCB8fCB0aGlzLCBkYXRhKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlQWxsTGlzdGVuZXJzKGV2ZW50TmFtZT86IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0eXBlb2YgZXZlbnROYW1lID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fZXZlbnRzLmRlbGV0ZShldmVudE5hbWUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGNsZWFyIGFsbFxuICAgIHRoaXMuX2V2ZW50cyA9IG5ldyBNYXAoKTtcbiAgfVxuXG4gIHRyaWdnZXIoZXZlbnROYW1lOiBzdHJpbmcsIHBhcmFtczogc3RyaW5nIHwgUmVjb3JkPGFueSwgYW55Pik6IHZvaWQge1xuICAgIC8vIGZvciBhcGkgdXNhZ2U7XG4gICAgY29uc3QgZXZlbnRzID0gdGhpcy5fZXZlbnRzLmdldChldmVudE5hbWUpO1xuICAgIGlmIChBcnJheS5pc0FycmF5KGV2ZW50cykpIHtcbiAgICAgIGlmICh0eXBlb2YgcGFyYW1zID09PSAnc3RyaW5nJykge1xuICAgICAgICBwYXJhbXMgPSBKU09OLnBhcnNlKHBhcmFtcyk7XG4gICAgICB9XG4gICAgICBldmVudHMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICBjb25zdCB7IGxpc3RlbmVyLCBjb250ZXh0IH0gPSBpdGVtO1xuICAgICAgICBpZiAodHlwZW9mIGxpc3RlbmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgbGlzdGVuZXIuY2FsbChjb250ZXh0IHx8IHRoaXMsIHBhcmFtcyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZShldmVudE5hbWU6IHN0cmluZywgLi4uZGF0YTogdW5rbm93bltdKTogdm9pZCB7XG4gICAgdGhpcy5lbWl0KGV2ZW50TmFtZSwgZGF0YSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUV2ZW50RW1pdHRlcigpIHtcbiAgcmV0dXJuIG5ldyBFdmVudEVtaXR0ZXIoKTtcbn1cbiIsICIvLyBDb3B5cmlnaHQgMjAyNCBUaGUgTHlueCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlIFZlcnNpb24gMi4wIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZVxuLy8gTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuXG5pbXBvcnQgeyBCZWZvcmVQdWJsaXNoRXZlbnQgYXMgSUJlZm9yZVB1Ymxpc2hFdmVudCB9IGZyb20gJ0BseW54LWpzL3R5cGVzJztcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnLi9ldmVudEVtaXR0ZXInO1xuXG5leHBvcnQgY2xhc3MgQW9wTWFuYWdlciB7XG4gIHB1YmxpYyBfYmVmb3JlUHVibGlzaEV2ZW50OiBCZWZvcmVQdWJsaXNoRXZlbnQ7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fYmVmb3JlUHVibGlzaEV2ZW50ID0gbmV3IEJlZm9yZVB1Ymxpc2hFdmVudCgpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCZWZvcmVQdWJsaXNoRXZlbnRcbiAgZXh0ZW5kcyBFdmVudEVtaXR0ZXJcbiAgaW1wbGVtZW50cyBJQmVmb3JlUHVibGlzaEV2ZW50IHtcbiAgYWRkKFxuICAgIGV2ZW50TmFtZTogc3RyaW5nLFxuICAgIGNhbGxiYWNrOiAoLi4uYXJnczogdW5rbm93bltdKSA9PiB2b2lkLFxuICAgIGNvbnRleHQ/OiBvYmplY3RcbiAgKTogQmVmb3JlUHVibGlzaEV2ZW50IHtcbiAgICBzdXBlci5hZGRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrLCBjb250ZXh0KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlbW92ZShcbiAgICBldmVudE5hbWU6IHN0cmluZyxcbiAgICBjYWxsYmFjazogKC4uLmFyZ3M6IHVua25vd25bXSkgPT4gdm9pZFxuICApOiBCZWZvcmVQdWJsaXNoRXZlbnQge1xuICAgIHN1cGVyLnJlbW92ZUxpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG4iLCAiLy8gQ29weXJpZ2h0IDIwMjQgVGhlIEx5bnggQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSBWZXJzaW9uIDIuMCB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGVcbi8vIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cblxuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICcuL2V2ZW50RW1pdHRlcic7XG5leHBvcnQgZGVmYXVsdCBFdmVudEVtaXR0ZXI7XG5leHBvcnQgeyBjcmVhdGVFdmVudEVtaXR0ZXIgfSBmcm9tICcuL2V2ZW50RW1pdHRlcic7XG5cbmV4cG9ydCAqIGZyb20gJy4vYW9wJztcbiIsICIvLyBDb3B5cmlnaHQgMjAyNCBUaGUgTHlueCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlIFZlcnNpb24gMi4wIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZVxuLy8gTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuXG5leHBvcnQgaW50ZXJmYWNlIFRleHRJbmZvIHtcbiAgZm9udFNpemU6IHN0cmluZztcbiAgZm9udEZhbWlseT86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUZXh0TWV0cmljcyB7XG4gIHdpZHRoOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBUZXh0SW5mb01hbmFnZXIge1xuICBwcml2YXRlIHJlYWRvbmx5IF9uYXRpdmVNb2R1bGVzOiBhbnk7XG4gIHByaXZhdGUgX3RleHRJbmZvTW9kdWxlOiBhbnkgPSB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IobmF0aXZlTW9kdWxlczogb2JqZWN0KSB7XG4gICAgdGhpcy5fbmF0aXZlTW9kdWxlcyA9IG5hdGl2ZU1vZHVsZXM7XG4gIH1cblxuICBnZXRUZXh0SW5mbyA9IChwYXJhbTogYW55LCBvcHRpb25zPzogVGV4dEluZm8pOiBUZXh0TWV0cmljcyA9PiB7XG4gICAgaWYgKHRoaXMuX3RleHRJbmZvTW9kdWxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX3RleHRJbmZvTW9kdWxlID0gdGhpcy5fbmF0aXZlTW9kdWxlcy5MeW54VGV4dEluZm9Nb2R1bGU7XG4gICAgfVxuICAgIGlmICh0aGlzLl90ZXh0SW5mb01vZHVsZSAmJiB0aGlzLl90ZXh0SW5mb01vZHVsZS5nZXRUZXh0SW5mbykge1xuICAgICAgcmV0dXJuIHRoaXMuX3RleHRJbmZvTW9kdWxlLmdldFRleHRJbmZvKHBhcmFtLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd2lkdGg6IHBhcmFtLmxlbmd0aCxcbiAgICAgIH07XG4gICAgfVxuICB9O1xufVxuIiwgIi8vIENvcHlyaWdodCAyMDI0IFRoZSBMeW54IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UgVmVyc2lvbiAyLjAgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlXG4vLyBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG5cbmV4cG9ydCBjbGFzcyBFeHBvc3VyZU1hbmFnZXIge1xuICBwcml2YXRlIHJlYWRvbmx5IF9uYXRpdmVNb2R1bGVzOiBhbnk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2V4cG9zdXJlTW9kdWxlOiBhbnk7XG5cbiAgY29uc3RydWN0b3IobmF0aXZlTW9kdWxlczogb2JqZWN0KSB7XG4gICAgdGhpcy5fbmF0aXZlTW9kdWxlcyA9IG5hdGl2ZU1vZHVsZXM7XG4gICAgdGhpcy5fZXhwb3N1cmVNb2R1bGUgPSB0aGlzLl9uYXRpdmVNb2R1bGVzLkx5bnhFeHBvc3VyZU1vZHVsZTtcbiAgfVxuXG4gIHJlc3VtZUV4cG9zdXJlID0gKCk6IHZvaWQgPT4ge1xuICAgIHRoaXMuX2V4cG9zdXJlTW9kdWxlLnJlc3VtZUV4cG9zdXJlKCk7XG4gIH07XG5cbiAgc3RvcEV4cG9zdXJlID0gKG9wdGlvbnM/OiB7IHNlbmRFdmVudD86IGJvb2xlYW4gfSk6IHZvaWQgPT4ge1xuICAgIHRoaXMuX2V4cG9zdXJlTW9kdWxlLnN0b3BFeHBvc3VyZShvcHRpb25zKTtcbiAgfTtcblxuICBzZXRPYnNlcnZlckZyYW1lUmF0ZSA9IChvcHRpb25zPzoge1xuICAgIGZvclBhZ2VSZWN0PzogbnVtYmVyO1xuICAgIGZvckV4cG9zdXJlQ2hlY2s/OiBudW1iZXI7XG4gIH0pOiB2b2lkID0+IHtcbiAgICB0aGlzLl9leHBvc3VyZU1vZHVsZS5zZXRPYnNlcnZlckZyYW1lUmF0ZShvcHRpb25zKTtcbiAgfTtcbn1cbiIsICIvLyBDb3B5cmlnaHQgMjAyNCBUaGUgTHlueCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlIFZlcnNpb24gMi4wIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZVxuLy8gTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuXG5pbXBvcnQgeyBJbnRlcnNlY3Rpb25PYnNlcnZlciBhcyBJSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgfSBmcm9tICdAbHlueC1qcy90eXBlcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW50ZXJzZWN0aW9uT2JzZXJ2ZXJNb2R1bGUge1xuICBjcmVhdGVJbnRlcnNlY3Rpb25PYnNlcnZlcjogRnVuY3Rpb247XG4gIHJlbGF0aXZlVG86IEZ1bmN0aW9uO1xuICByZWxhdGl2ZVRvVmlld3BvcnQ6IEZ1bmN0aW9uO1xuICByZWxhdGl2ZVRvU2NyZWVuOiBGdW5jdGlvbjtcbiAgb2JzZXJ2ZTogRnVuY3Rpb247XG4gIGRpc2Nvbm5lY3Q6IEZ1bmN0aW9uO1xufVxuXG5jbGFzcyBJbnRlcnNlY3Rpb25PYnNlcnZhdGlvblRhcmdldCB7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3NlbGVjdG9yOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2NhbGxiYWNrOiBGdW5jdGlvbjtcblxuICBjb25zdHJ1Y3RvcihzZWxlY3Rvcjogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24pIHtcbiAgICB0aGlzLl9zZWxlY3RvciA9IHNlbGVjdG9yO1xuICAgIHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XG4gIH1cblxuICBpbnZva2VDYWxsYmFjayhkYXRhOiBvYmplY3QpOiB2b2lkIHtcbiAgICB0aGlzLl9jYWxsYmFjayhkYXRhKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgaW1wbGVtZW50cyBJSW50ZXJzZWN0aW9uT2JzZXJ2ZXIge1xuICBwcml2YXRlIHJlYWRvbmx5IF9pZDogbnVtYmVyO1xuICBwcml2YXRlIHJlYWRvbmx5IF9pbnRlcnNlY3Rpb25PYnNlcnZlck1vZHVsZTogSW50ZXJzZWN0aW9uT2JzZXJ2ZXJNb2R1bGU7XG4gIHByaXZhdGUgcmVhZG9ubHkgX21hbmFnZXI6IEludGVyc2VjdGlvbk9ic2VydmVyTWFuYWdlcjtcbiAgcHJpdmF0ZSByZWFkb25seSBfb2JzZXJ2YXRpb25UYXJnZXRzOiBJbnRlcnNlY3Rpb25PYnNlcnZhdGlvblRhcmdldFtdO1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZWZhdWx0TWFyZ2luczogb2JqZWN0O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGlkOiBudW1iZXIsXG4gICAgaW50ZXJzZWN0aW9uT2JzZXJ2ZXJNb2R1bGU6IEludGVyc2VjdGlvbk9ic2VydmVyTW9kdWxlLFxuICAgIG1hbmFnZXI6IEludGVyc2VjdGlvbk9ic2VydmVyTWFuYWdlclxuICApIHtcbiAgICB0aGlzLl9pZCA9IGlkO1xuICAgIHRoaXMuX2ludGVyc2VjdGlvbk9ic2VydmVyTW9kdWxlID0gaW50ZXJzZWN0aW9uT2JzZXJ2ZXJNb2R1bGU7XG4gICAgdGhpcy5fbWFuYWdlciA9IG1hbmFnZXI7XG4gICAgdGhpcy5fb2JzZXJ2YXRpb25UYXJnZXRzID0gW107XG4gICAgdGhpcy5fZGVmYXVsdE1hcmdpbnMgPSB7XG4gICAgICBsZWZ0OiAwLFxuICAgICAgcmlnaHQ6IDAsXG4gICAgICB0b3A6IDAsXG4gICAgICBib3R0b206IDAsXG4gICAgfTtcbiAgfVxuXG4gIHJlbGF0aXZlVG8oc2VsZWN0b3I6IHN0cmluZywgbWFyZ2lucz86IHt9KTogSW50ZXJzZWN0aW9uT2JzZXJ2ZXIge1xuICAgIHRoaXMuX2ludGVyc2VjdGlvbk9ic2VydmVyTW9kdWxlLnJlbGF0aXZlVG8oXG4gICAgICB0aGlzLl9pZCxcbiAgICAgIHNlbGVjdG9yLFxuICAgICAgbWFyZ2lucyB8fCB0aGlzLl9kZWZhdWx0TWFyZ2luc1xuICAgICk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZWxhdGl2ZVRvVmlld3BvcnQobWFyZ2lucz86IHt9KTogSW50ZXJzZWN0aW9uT2JzZXJ2ZXIge1xuICAgIHRoaXMuX2ludGVyc2VjdGlvbk9ic2VydmVyTW9kdWxlLnJlbGF0aXZlVG9WaWV3cG9ydChcbiAgICAgIHRoaXMuX2lkLFxuICAgICAgbWFyZ2lucyB8fCB0aGlzLl9kZWZhdWx0TWFyZ2luc1xuICAgICk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZWxhdGl2ZVRvU2NyZWVuKG1hcmdpbnM/OiB7fSk6IEludGVyc2VjdGlvbk9ic2VydmVyIHtcbiAgICB0aGlzLl9pbnRlcnNlY3Rpb25PYnNlcnZlck1vZHVsZS5yZWxhdGl2ZVRvU2NyZWVuKFxuICAgICAgdGhpcy5faWQsXG4gICAgICBtYXJnaW5zIHx8IHRoaXMuX2RlZmF1bHRNYXJnaW5zXG4gICAgKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG9ic2VydmUoc2VsZWN0b3I6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5fb2JzZXJ2YXRpb25UYXJnZXRzLnB1c2goXG4gICAgICBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2YXRpb25UYXJnZXQoc2VsZWN0b3IsIGNhbGxiYWNrKVxuICAgICk7XG4gICAgdGhpcy5faW50ZXJzZWN0aW9uT2JzZXJ2ZXJNb2R1bGUub2JzZXJ2ZShcbiAgICAgIHRoaXMuX2lkLFxuICAgICAgc2VsZWN0b3IsXG4gICAgICB0aGlzLl9vYnNlcnZhdGlvblRhcmdldHMubGVuZ3RoIC0gMVxuICAgICk7XG4gIH1cblxuICBkaXNjb25uZWN0KCk6IHZvaWQge1xuICAgIHRoaXMuX2ludGVyc2VjdGlvbk9ic2VydmVyTW9kdWxlLmRpc2Nvbm5lY3QodGhpcy5faWQpO1xuICAgIHRoaXMuX21hbmFnZXIucmVtb3ZlT2JzZXJ2ZXIodGhpcy5faWQpO1xuICB9XG5cbiAgaW52b2tlQ2FsbGJhY2soY2FsbGJhY2tJZDogbnVtYmVyLCBkYXRhOiBvYmplY3QpOiB2b2lkIHtcbiAgICBpZiAoY2FsbGJhY2tJZCA8IHRoaXMuX29ic2VydmF0aW9uVGFyZ2V0cy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuX29ic2VydmF0aW9uVGFyZ2V0c1tjYWxsYmFja0lkXS5pbnZva2VDYWxsYmFjayhkYXRhKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEludGVyc2VjdGlvbk9ic2VydmVyTWFuYWdlciB7XG4gIHByaXZhdGUgcmVhZG9ubHkgX25hdGl2ZU1vZHVsZXM6IG9iamVjdDtcbiAgcHJpdmF0ZSBfb2JzZXJ2ZXJJZDogbnVtYmVyO1xuICBwcml2YXRlIF9vYnNlcnZlcnM6IG9iamVjdDtcbiAgcHJpdmF0ZSByZWFkb25seSBfZGVmYXVsdE9wdGlvbnM6IG9iamVjdDtcblxuICBjb25zdHJ1Y3RvcihuYXRpdmVNb2R1bGVzOiBvYmplY3QpIHtcbiAgICB0aGlzLl9uYXRpdmVNb2R1bGVzID0gbmF0aXZlTW9kdWxlcztcbiAgICB0aGlzLl9vYnNlcnZlcklkID0gMDtcbiAgICB0aGlzLl9vYnNlcnZlcnMgPSB7fTtcbiAgICB0aGlzLl9kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIHRocmVzaG9sZHM6IFswXSxcbiAgICAgIGluaXRpYWxSYXRpbzogMCxcbiAgICAgIG9ic2VydmVBbGw6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICBjcmVhdGVJbnRlcnNlY3Rpb25PYnNlcnZlcihcbiAgICBjb21wb25lbnRJZDogc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBvYmplY3RcbiAgKTogSW50ZXJzZWN0aW9uT2JzZXJ2ZXIge1xuICAgIGxldCBpbnRlcnNlY3Rpb25PYnNlcnZlck1vZHVsZSA9IHRoaXMuX25hdGl2ZU1vZHVsZXNbXG4gICAgICAnSW50ZXJzZWN0aW9uT2JzZXJ2ZXJNb2R1bGUnXG4gICAgXTtcbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihcbiAgICAgIHRoaXMuX29ic2VydmVySWQsXG4gICAgICBpbnRlcnNlY3Rpb25PYnNlcnZlck1vZHVsZSxcbiAgICAgIHRoaXNcbiAgICApO1xuICAgIHRoaXMuX29ic2VydmVyc1t0aGlzLl9vYnNlcnZlcklkXSA9IG9ic2VydmVyO1xuICAgIGludGVyc2VjdGlvbk9ic2VydmVyTW9kdWxlLmNyZWF0ZUludGVyc2VjdGlvbk9ic2VydmVyKFxuICAgICAgdGhpcy5fb2JzZXJ2ZXJJZCxcbiAgICAgIGNvbXBvbmVudElkLFxuICAgICAgb3B0aW9ucyB8fCB0aGlzLl9kZWZhdWx0T3B0aW9uc1xuICAgICk7XG4gICAgdGhpcy5fb2JzZXJ2ZXJJZCsrO1xuICAgIHJldHVybiBvYnNlcnZlcjtcbiAgfVxuXG4gIGdldE9ic2VydmVyKG9ic2VydmVySWQ6IG51bWJlcik6IEludGVyc2VjdGlvbk9ic2VydmVyIHtcbiAgICByZXR1cm4gdGhpcy5fb2JzZXJ2ZXJzW29ic2VydmVySWRdO1xuICB9XG5cbiAgcmVtb3ZlT2JzZXJ2ZXIob2JzZXJ2ZXJJZDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5fb2JzZXJ2ZXJzW29ic2VydmVySWRdID0gbnVsbDtcbiAgfVxufVxuIiwgIi8vIENvcHlyaWdodCAyMDI0IFRoZSBMeW54IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UgVmVyc2lvbiAyLjAgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlXG4vLyBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG5cbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnLi4vZXZlbnQnO1xuaW1wb3J0IHtcbiAgUGVyZm9ybWFuY2VPYnNlcnZlciBhcyBJUGVyZm9ybWFuY2VPYnNlcnZlcixcbiAgUGVyZm9ybWFuY2VDYWxsYmFjayxcbiAgUGVyZm9ybWFuY2VFbnRyeSxcbn0gZnJvbSAnQGx5bngtanMvdHlwZXMnO1xuXG5jb25zdCBMaXN0ZW5lcktleXMgPSB7XG4gIG9uUGVyZm9ybWFuY2U6ICdseW54LnBlcmZvcm1hbmNlLm9uUGVyZm9ybWFuY2VFdmVudCcsXG59O1xuXG5leHBvcnQgY2xhc3MgUGVyZm9ybWFuY2VPYnNlcnZlciBpbXBsZW1lbnRzIElQZXJmb3JtYW5jZU9ic2VydmVyIHtcbiAgX2VtaXR0ZXI6IEV2ZW50RW1pdHRlcjtcbiAgX29ic2VydmVkTmFtZXM6IHN0cmluZ1tdO1xuICBfb25QZXJmb3JtYW5jZTogUGVyZm9ybWFuY2VDYWxsYmFjaztcbiAgY29uc3RydWN0b3IoZW1pdHRlcjogRXZlbnRFbWl0dGVyLCBjYWxsYmFjazogUGVyZm9ybWFuY2VDYWxsYmFjaykge1xuICAgIHRoaXMuX2VtaXR0ZXIgPSBlbWl0dGVyO1xuICAgIHRoaXMuX29uUGVyZm9ybWFuY2UgPSBjYWxsYmFjaztcbiAgICB0aGlzLl9vYnNlcnZlZE5hbWVzID0gW107XG4gIH1cblxuICBvYnNlcnZlKG5hbWVzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIC8vIFRoZSBwcmV2aW91cyBvYnNlcnZlIG11c3QgYmUgY2xvc2VkIHVzaW5nIHRoZSBkaXNjb25uZWN0IG1ldGhvZCBiZWZvcmUgcmUtb2JzZXJ2aW5nLlxuICAgIGlmICh0aGlzLl9vYnNlcnZlZE5hbWVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9vYnNlcnZlZE5hbWVzID0gbmFtZXM7XG4gICAgdGhpcy5fZW1pdHRlci5hZGRMaXN0ZW5lcihcbiAgICAgIExpc3RlbmVyS2V5cy5vblBlcmZvcm1hbmNlLFxuICAgICAgdGhpcy5vblBlcmZvcm1hbmNlRXZlbnQuYmluZCh0aGlzKVxuICAgICk7XG4gIH1cblxuICBkaXNjb25uZWN0KCk6IHZvaWQge1xuICAgIHRoaXMuX29ic2VydmVkTmFtZXMgPSBbXTtcbiAgICB0aGlzLl9lbWl0dGVyLnJlbW92ZUxpc3RlbmVyKFxuICAgICAgTGlzdGVuZXJLZXlzLm9uUGVyZm9ybWFuY2UsXG4gICAgICB0aGlzLm9uUGVyZm9ybWFuY2VFdmVudC5iaW5kKHRoaXMpXG4gICAgKTtcbiAgfVxuXG4gIG9uUGVyZm9ybWFuY2VFdmVudChlbnRyeTogUGVyZm9ybWFuY2VFbnRyeSk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vYnNlcnZlZE5hbWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBlbnRyeU5hbWUgPSBlbnRyeS5lbnRyeVR5cGUgKyAnLicgKyBlbnRyeS5uYW1lO1xuICAgIGlmIChcbiAgICAgIHRoaXMuX29ic2VydmVkTmFtZXMuaW5jbHVkZXMoZW50cnlOYW1lKSB8fFxuICAgICAgdGhpcy5fb2JzZXJ2ZWROYW1lcy5pbmNsdWRlcyhlbnRyeS5lbnRyeVR5cGUpXG4gICAgKSB7XG4gICAgICB0aGlzLl9vblBlcmZvcm1hbmNlKGVudHJ5KTtcbiAgICB9XG4gIH1cbn1cbiIsICIvLyBDb3B5cmlnaHQgMjAyNCBUaGUgTHlueCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlIFZlcnNpb24gMi4wIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZVxuLy8gTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuXG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJy4uL2V2ZW50JztcbmltcG9ydCB7XG4gIFBlcmZvcm1hbmNlIGFzIElQZXJmb3JtYW5jZSxcbiAgVGltaW5nTGlzdGVuZXIsXG4gIFBlcmZvcm1hbmNlQ2FsbGJhY2ssXG59IGZyb20gJ0BseW54LWpzL3R5cGVzJztcbmltcG9ydCB7IE5hdGl2ZUFwcCB9IGZyb20gJy4uLy4uL2FwcCc7XG5pbXBvcnQgeyBUcmFjZU9wdGlvbiB9IGZyb20gJ0BseW54LWpzL3R5cGVzL3R5cGVzL2NvbW1vbi9wZXJmb3JtYW5jZSc7XG5pbXBvcnQgeyBQZXJmb3JtYW5jZU9ic2VydmVyIH0gZnJvbSAnLi9wZXJmb3JtYW5jZU9ic2VydmVyJztcblxuY29uc3QgTGlzdGVuZXJLZXlzID0ge1xuICBvblNldHVwOiAnbHlueC5wZXJmb3JtYW5jZS50aW1pbmcub25TZXR1cCcsXG4gIG9uVXBkYXRlOiAnbHlueC5wZXJmb3JtYW5jZS50aW1pbmcub25VcGRhdGUnLFxufTtcblxuZXhwb3J0IGludGVyZmFjZSBQaXBlbGluZU9wdGlvbnMge1xuICBwaXBlbGluZUlEOiBzdHJpbmc7XG4gIG5lZWRUaW1lc3RhbXBzOiBib29sZWFuO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQZXJmb3JtYW5jZSBpbXBsZW1lbnRzIElQZXJmb3JtYW5jZSB7XG4gIF9lbWl0dGVyOiBFdmVudEVtaXR0ZXI7XG4gIF9nZW5lcmF0ZVBpcGVsaW5lT3B0aW9uczogKCkgPT4gUGlwZWxpbmVPcHRpb25zO1xuICBfb25QaXBlbGluZVN0YXJ0OiAocGlwZWxpbmVfaWQ6IHN0cmluZykgPT4gdm9pZDtcbiAgX21hcmtUaW1pbmc6IChwaXBlbGluZV9pZDogc3RyaW5nLCB0aW1pbmdfa2V5OiBzdHJpbmcpID0+IHZvaWQ7XG4gIF9wcm9maWxlU3RhcnQ6ICh0cmFjZU5hbWU6IHN0cmluZywgb3B0aW9uPzogVHJhY2VPcHRpb24pID0+IHZvaWQ7XG4gIF9wcm9maWxlRW5kOiAob3B0aW9uPzogVHJhY2VPcHRpb24pID0+IHZvaWQ7XG4gIF9wcm9maWxlTWFyazogKHRyYWNlTmFtZTogc3RyaW5nLCBvcHRpb24/OiBUcmFjZU9wdGlvbikgPT4gdm9pZDtcbiAgX3Byb2ZpbGVGbG93SWQ6ICgpID0+IG51bWJlcjtcbiAgX2lzUHJvZmlsZVJlY29yZGluZzogKCkgPT4gYm9vbGVhbjtcbiAgX2JpbmRQaXBlbGluZUlkV2l0aFRpbWluZ0ZsYWc6IChcbiAgICBwaXBlbGluZV9pZDogc3RyaW5nLFxuICAgIHRpbWluZ19mbGFnOiBzdHJpbmdcbiAgKSA9PiB2b2lkO1xuICBjb25zdHJ1Y3RvcihlbWl0dGVyOiBFdmVudEVtaXR0ZXIsIG5hdGl2ZUFwcDogTmF0aXZlQXBwKSB7XG4gICAgdGhpcy5fZW1pdHRlciA9IGVtaXR0ZXI7XG4gICAgdGhpcy5fZ2VuZXJhdGVQaXBlbGluZU9wdGlvbnMgPSBuYXRpdmVBcHAuZ2VuZXJhdGVQaXBlbGluZU9wdGlvbnM7XG4gICAgdGhpcy5fb25QaXBlbGluZVN0YXJ0ID0gbmF0aXZlQXBwLm9uUGlwZWxpbmVTdGFydDtcbiAgICB0aGlzLl9tYXJrVGltaW5nID0gbmF0aXZlQXBwLm1hcmtQaXBlbGluZVRpbWluZztcbiAgICB0aGlzLl9wcm9maWxlU3RhcnQgPSBuYXRpdmVBcHAucHJvZmlsZVN0YXJ0O1xuICAgIHRoaXMuX3Byb2ZpbGVFbmQgPSBuYXRpdmVBcHAucHJvZmlsZUVuZDtcbiAgICB0aGlzLl9wcm9maWxlTWFyayA9IG5hdGl2ZUFwcC5wcm9maWxlTWFyaztcbiAgICB0aGlzLl9wcm9maWxlRmxvd0lkID0gbmF0aXZlQXBwLnByb2ZpbGVGbG93SWQ7XG4gICAgdGhpcy5faXNQcm9maWxlUmVjb3JkaW5nID0gbmF0aXZlQXBwLmlzUHJvZmlsZVJlY29yZGluZztcbiAgICB0aGlzLl9iaW5kUGlwZWxpbmVJZFdpdGhUaW1pbmdGbGFnID0gbmF0aXZlQXBwLmJpbmRQaXBlbGluZUlkV2l0aFRpbWluZ0ZsYWc7XG4gIH1cblxuICBwcm9maWxlU3RhcnQodHJhY2VOYW1lOiBzdHJpbmcsIG9wdGlvbj86IFRyYWNlT3B0aW9uKSB7XG4gICAgdGhpcy5fcHJvZmlsZVN0YXJ0KHRyYWNlTmFtZSwgb3B0aW9uKTtcbiAgfVxuXG4gIHByb2ZpbGVFbmQoKSB7XG4gICAgdGhpcy5fcHJvZmlsZUVuZCgpO1xuICB9XG5cbiAgcHJvZmlsZU1hcmsodHJhY2VOYW1lOiBzdHJpbmcsIG9wdGlvbj86IFRyYWNlT3B0aW9uKSB7XG4gICAgdGhpcy5fcHJvZmlsZU1hcmsodHJhY2VOYW1lLCBvcHRpb24pO1xuICB9XG5cbiAgcHJvZmlsZUZsb3dJZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcHJvZmlsZUZsb3dJZCgpO1xuICB9XG5cbiAgY3JlYXRlT2JzZXJ2ZXIoY2FsbGJhY2s6IFBlcmZvcm1hbmNlQ2FsbGJhY2spOiBQZXJmb3JtYW5jZU9ic2VydmVyIHtcbiAgICByZXR1cm4gbmV3IFBlcmZvcm1hbmNlT2JzZXJ2ZXIodGhpcy5fZW1pdHRlciwgY2FsbGJhY2spO1xuICB9XG5cbiAgaXNQcm9maWxlUmVjb3JkaW5nKCkge1xuICAgIHJldHVybiB0aGlzLl9pc1Byb2ZpbGVSZWNvcmRpbmcoKTtcbiAgfVxuXG4gIGFkZFRpbWluZ0xpc3RlbmVyKGxpc3RlbmVyOiBUaW1pbmdMaXN0ZW5lcik6IHZvaWQge1xuICAgIHRoaXMuX2VtaXR0ZXIuYWRkTGlzdGVuZXIoTGlzdGVuZXJLZXlzLm9uU2V0dXAsIGxpc3RlbmVyLm9uU2V0dXAsIGxpc3RlbmVyKTtcbiAgICB0aGlzLl9lbWl0dGVyLmFkZExpc3RlbmVyKFxuICAgICAgTGlzdGVuZXJLZXlzLm9uVXBkYXRlLFxuICAgICAgbGlzdGVuZXIub25VcGRhdGUsXG4gICAgICBsaXN0ZW5lclxuICAgICk7XG4gIH1cblxuICByZW1vdmVUaW1pbmdMaXN0ZW5lcihsaXN0ZW5lcjogVGltaW5nTGlzdGVuZXIpIHtcbiAgICB0aGlzLl9lbWl0dGVyLnJlbW92ZUxpc3RlbmVyKExpc3RlbmVyS2V5cy5vblNldHVwLCBsaXN0ZW5lci5vblNldHVwKTtcbiAgICB0aGlzLl9lbWl0dGVyLnJlbW92ZUxpc3RlbmVyKExpc3RlbmVyS2V5cy5vblVwZGF0ZSwgbGlzdGVuZXIub25VcGRhdGUpO1xuICB9XG5cbiAgcmVtb3ZlQWxsVGltaW5nTGlzdGVuZXIoKSB7XG4gICAgdGhpcy5fZW1pdHRlci5yZW1vdmVBbGxMaXN0ZW5lcnMoTGlzdGVuZXJLZXlzLm9uU2V0dXApO1xuICAgIHRoaXMuX2VtaXR0ZXIucmVtb3ZlQWxsTGlzdGVuZXJzKExpc3RlbmVyS2V5cy5vblVwZGF0ZSk7XG4gIH1cbiAgX2luaXRpYWxpemVBbmRTdGFydFBpcGVsaW5lKCk6IFBpcGVsaW5lT3B0aW9ucyB7XG4gICAgY29uc3QgcGlwZWxpbmVPcHRpb25zID0gdGhpcy5fZ2VuZXJhdGVQaXBlbGluZU9wdGlvbnMoKTtcbiAgICBpZiAocGlwZWxpbmVPcHRpb25zKSB7XG4gICAgICB0aGlzLl9vblBpcGVsaW5lU3RhcnQocGlwZWxpbmVPcHRpb25zLnBpcGVsaW5lSUQpO1xuICAgIH1cbiAgICByZXR1cm4gcGlwZWxpbmVPcHRpb25zO1xuICB9XG4gIF9jaGVja0FuZEJpbmRUaW1pbmdGbGFnKFxuICAgIHBpcGVsaW5lT3B0aW9uczogUGlwZWxpbmVPcHRpb25zLFxuICAgIGRhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+XG4gICkge1xuICAgIGlmICghcGlwZWxpbmVPcHRpb25zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IFBlcmZvcm1hbmNlVGltaW5nRmxhZyA9ICdfX2x5bnhfdGltaW5nX2ZsYWcnO1xuICAgIGlmIChkYXRhW1BlcmZvcm1hbmNlVGltaW5nRmxhZ10pIHtcbiAgICAgIHRoaXMuX2JpbmRQaXBlbGluZUlkV2l0aFRpbWluZ0ZsYWcoXG4gICAgICAgIHBpcGVsaW5lT3B0aW9ucy5waXBlbGluZUlELFxuICAgICAgICBkYXRhW1BlcmZvcm1hbmNlVGltaW5nRmxhZ10gYXMgc3RyaW5nXG4gICAgICApO1xuICAgICAgdGhpcy5fbWFya1RpbWluZyhwaXBlbGluZU9wdGlvbnMucGlwZWxpbmVJRCwgJ3VwZGF0ZV9zZXRfc3RhdGVfdHJpZ2dlcicpO1xuICAgICAgcGlwZWxpbmVPcHRpb25zLm5lZWRUaW1lc3RhbXBzID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cbiIsICIvLyBDb3B5cmlnaHQgMjAyNCBUaGUgTHlueCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlIFZlcnNpb24gMi4wIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZVxuLy8gTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuXG5pbXBvcnQgUGVyZm9ybWFuY2UgZnJvbSAnLi9wZXJmb3JtYW5jZSc7XG5leHBvcnQgZGVmYXVsdCBQZXJmb3JtYW5jZTtcbmV4cG9ydCAqIGZyb20gJy4vcGVyZm9ybWFuY2UnO1xuIiwgIi8vIENvcHlyaWdodCAyMDI0IFRoZSBMeW54IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UgVmVyc2lvbiAyLjAgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlXG4vLyBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG5cbmltcG9ydCBuYXRpdmVHbG9iYWwgZnJvbSAnLi9uYXRpdmVHbG9iYWwnO1xuZXhwb3J0IGRlZmF1bHQgbmF0aXZlR2xvYmFsLkx5bnhKU0JJO1xuIiwgIi8vIENvcHlyaWdodCAyMDI0IFRoZSBMeW54IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UgVmVyc2lvbiAyLjAgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlXG4vLyBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG5cbi8vIENhY2hlIGFjY2VzcyB0byBmdW5jdGlvbnMgb2YgdGhlIHRhcmdldCBvYmplY3QuXG4vL1xuLy8gV2hlbiBhIGZ1bmN0aW9uIG9uIHRhcmdldCBvYmogaXMgYWNjZXNzZWQgZm9yIHRoZSBmaXJzdCB0aW1lLFxuLy8gdGhlIHByb3h5IG9idGFpbnMgdGhlIGZ1bmN0aW9uIG9iamVjdCBhbmQgc2F2ZXMgaXQsXG4vLyBhbmQgcmV0dXJucyB0aGUgY2FjaGVkIGZ1bmN0aW9uIG9iamVjdCBkaXJlY3RseSBkdXJpbmcgc3Vic2VxdWVudCBhY2Nlc3Ncbi8vIHdpdGhvdXQgYWNjZXNzaW5nIGFnYWluLlxuZXhwb3J0IGNsYXNzIENhY2hlZEZ1bmN0aW9uUHJveHk8VD4ge1xuICBwcml2YXRlIF9jYWNoZWRGdW5jdGlvbnM6IFJlY29yZDxzdHJpbmcsIEZ1bmN0aW9uPiA9IHt9O1xuXG4gIHN0YXRpYyBjcmVhdGU8VD4ob2JqOiBUKTogVCB7XG4gICAgcmV0dXJuIG5ldyBDYWNoZWRGdW5jdGlvblByb3h5KG9iaikgYXMgYW55O1xuICB9XG5cbiAgY29uc3RydWN0b3Iob2JqOiBUKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gb2JqKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICBpZiAodGhpcy5fY2FjaGVkRnVuY3Rpb25zW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jYWNoZWRGdW5jdGlvbnNba2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBvYmpba2V5XTtcbiAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLl9jYWNoZWRGdW5jdGlvbnNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiIsICIvLyBDb3B5cmlnaHQgMjAyNCBUaGUgTHlueCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlIFZlcnNpb24gMi4wIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZVxuLy8gTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuXG5pbXBvcnQgeyBMeW54Q2xlYXJUaW1lb3V0LCBMeW54U2V0VGltZW91dCB9IGZyb20gJ0BseW54LWpzL3R5cGVzJztcbmltcG9ydCBuYXRpdmVHbG9iYWwgZnJvbSAnLi4vY29tbW9uL25hdGl2ZUdsb2JhbCc7XG5cbnR5cGUgbmV4dFRpY2sgPSAoY2FsbGJhY2s6ICgpID0+IHZvaWQpID0+IHZvaWQ7XG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvbWlzZU1heWJlUG9seWZpbGwoXG4gIHNldFRpbWVvdXQ6IEx5bnhTZXRUaW1lb3V0LFxuICBvblVuaGFuZGxlZCxcbiAgY2xlYXJUaW1lb3V0OiBMeW54Q2xlYXJUaW1lb3V0LFxuICBxdWV1ZU1pY3JvdGFzazogbmV4dFRpY2sgPSB1bmRlZmluZWQsXG4gIGVuYWJsZU1pY3JvdGFza1Byb21pc2VQb2x5ZmlsbDogYm9vbGVhbiA9IGZhbHNlXG4pIHtcbiAgY29uc3QgeyBnZXRQcm9taXNlIH0gPSBuYXRpdmVHbG9iYWw7XG4gIGlmICh0eXBlb2YgZ2V0UHJvbWlzZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNvbnN0IG5leHRUaWNrID0gZW5hYmxlTWljcm90YXNrUHJvbWlzZVBvbHlmaWxsXG4gICAgICA/IHF1ZXVlTWljcm90YXNrXG4gICAgICA6IChmbjogKCkgPT4gdm9pZCkgPT4gc2V0VGltZW91dChmbiwgMCk7XG4gICAgcmV0dXJuIGdldFByb21pc2UoeyBuZXh0VGljaywgc2V0VGltZW91dCwgb25VbmhhbmRsZWQsIGNsZWFyVGltZW91dCB9KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBUT0RPOiBzaG91bGQgcmVwb3J0IGVycm9yO1xuICAgIHJldHVybiBuYXRpdmVHbG9iYWwuUHJvbWlzZTtcbiAgfVxufVxuIiwgIi8vIENvcHlyaWdodCAyMDI0IFRoZSBMeW54IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UgVmVyc2lvbiAyLjAgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlXG4vLyBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG5cbi8vIGhvc3Qgb2JqZWN0XG5leHBvcnQgaW50ZXJmYWNlIEJvZHlOYXRpdmUge1xuICBCb2R5TmF0aXZlKGJvZHlJbml0PzogQm9keUluaXQpOiBCb2R5TmF0aXZlO1xuICByZWFkb25seSBhcnJheUJ1ZmZlcjogQXJyYXlCdWZmZXI7XG4gIHJlYWRvbmx5IHRleHQ6IHN0cmluZztcbiAgcmVhZG9ubHkganNvbjogYW55O1xuICByZWFkb25seSBib2R5VXNlZDogYm9vbGVhbjtcbiAgcmVhZG9ubHkgY2xvbmU6IEJvZHlOYXRpdmU7XG5cbiAgLy8gVE9ETyhodXpoYW5iby5sdWMpOiB0aGVzZSBBUElzIHJlbHkgb24gZm91bmRhbWVudGFsIHR5cGVzXG4gIC8vIHdoaWNoIHJlcXVpcmUgZXh0cmEgd29ya3MgdG8gc3VwcG9ydCwgd2Ugd2lsbCBzdXBwb3J0IHRoZXNlXG4gIC8vIGxhdGVyIHdoZW4gd2UgaGF2ZSBpbXBsZW1lbnRlZCB0aGVzZSB0eXBlcy5cblxuICAvLyBibG9iKCk6IEJsb2I7XG4gIC8vIGZvcm1EYXRhKCk6IEZvcm1EYXRhO1xuICAvLyBjbG9uZVN0cmVhbSgpOiBSZWFkYWJsZVN0cmVhbTtcbn1cblxudHlwZSBDcmVhdGVCb2R5TmF0aXZlID0gKGJvZHk/OiBhbnkpID0+IEJvZHlOYXRpdmU7XG5cbmV4cG9ydCBjbGFzcyBCb2R5TWl4aW4ge1xuICBfYm9keURhdGE6IEJvZHlOYXRpdmUgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBwcm90ZWN0ZWQgc2V0Qm9keShib2R5PzogQm9keUluaXQgfCBCb2R5TWl4aW4pIHtcbiAgICBpZiAoYm9keSBpbnN0YW5jZW9mIEJvZHlNaXhpbikge1xuICAgICAgdGhpcy5fYm9keURhdGEgPSBib2R5Ll9ib2R5RGF0YS5jbG9uZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGJvZHlJbml0TmF0aXZlID0ge1xuICAgICAgICBib2R5RGF0YTogYm9keSxcbiAgICAgICAgaXNBcnJheUJ1ZmZlcjogZmFsc2UsXG4gICAgICB9O1xuXG4gICAgICBpZiAoYm9keSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgICAgIGJvZHlJbml0TmF0aXZlLmlzQXJyYXlCdWZmZXIgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChib2R5IGluc3RhbmNlb2YgRGF0YVZpZXcpIHtcbiAgICAgICAgYm9keUluaXROYXRpdmUuaXNBcnJheUJ1ZmZlciA9IHRydWU7XG4gICAgICAgIGJvZHlJbml0TmF0aXZlLmJvZHlEYXRhID0gYm9keS5idWZmZXIuc2xpY2UoXG4gICAgICAgICAgYm9keS5ieXRlT2Zmc2V0LFxuICAgICAgICAgIGJvZHkuYnl0ZU9mZnNldCArIGJvZHkuYnl0ZUxlbmd0aFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoYm9keSkpIHtcbiAgICAgICAgYm9keUluaXROYXRpdmUuaXNBcnJheUJ1ZmZlciA9IHRydWU7XG4gICAgICAgIGJvZHlJbml0TmF0aXZlLmJvZHlEYXRhID0gYm9keS5idWZmZXI7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBnbG9iYWxUaGlzLlVSTFNlYXJjaFBhcmFtcyAmJlxuICAgICAgICBib2R5IGluc3RhbmNlb2YgVVJMU2VhcmNoUGFyYW1zXG4gICAgICApIHtcbiAgICAgICAgYm9keUluaXROYXRpdmUuYm9keURhdGEgPSBib2R5LnRvU3RyaW5nKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2JvZHlEYXRhID0gZ2xvYmFsVGhpcy5DcmVhdGVCb2R5TmF0aXZlKGJvZHlJbml0TmF0aXZlKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYXJyYXlCdWZmZXIoKTogUHJvbWlzZTxBcnJheUJ1ZmZlcj4ge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keURhdGEuYXJyYXlCdWZmZXIpO1xuICB9XG5cbiAgcHVibGljIHRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlEYXRhLnRleHQpO1xuICB9XG5cbiAgcHVibGljIGpzb24oKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlEYXRhLmpzb24pO1xuICB9XG5cbiAgZ2V0IGJvZHlVc2VkKCkge1xuICAgIHJldHVybiB0aGlzLl9ib2R5RGF0YS5ib2R5VXNlZDtcbiAgfVxufVxuIiwgIi8qKlxuICogQGxpY2Vuc2UgTUlUXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbXN3anMvaGVhZGVycy1wb2x5ZmlsbC9ibG9iL21haW4vTElDRU5TRVxuICpcbkNvcHlyaWdodCAoYykgMjAyMOKAk3ByZXNlbnQgQXJ0ZW0gWmFraGFyY2hlbmtvXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuZXhwb3J0IGNsYXNzIEhlYWRlcnMge1xuICBwcml2YXRlIF9oZWFkZXJzX21hcDogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcblxuICBjb25zdHJ1Y3Rvcihpbml0PzogSGVhZGVyc0luaXQpIHtcbiAgICBpZiAoaW5pdCA9PT0gbnVsbCB8fCB0eXBlb2YgaW5pdCA9PT0gJ251bWJlcicpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEhlYWRlcnMgaW5pdCB3aXRoIG51bGwvbnVtYmVyYCk7XG4gICAgfVxuICAgIGlmIChpbml0IGluc3RhbmNlb2YgSGVhZGVycykge1xuICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgaW5pdCkge1xuICAgICAgICB0aGlzLmFwcGVuZChrZXksIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoaW5pdCkpIHtcbiAgICAgIGluaXQuZm9yRWFjaCgoW25hbWUsIHZhbHVlXSkgPT4ge1xuICAgICAgICB0aGlzLmFwcGVuZChuYW1lLCBBcnJheS5pc0FycmF5KHZhbHVlKSA/IHZhbHVlLmpvaW4oJyAnKSA6IHZhbHVlKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoaW5pdCkge1xuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoaW5pdCkuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGluaXRbbmFtZV07XG4gICAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIEFycmF5LmlzQXJyYXkodmFsdWUpID8gdmFsdWUuam9pbignICcpIDogdmFsdWUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgW1N5bWJvbC50b1N0cmluZ1RhZ10gPSAnSGVhZGVycyc7XG5cbiAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgcmV0dXJuIHRoaXMuZW50cmllcygpO1xuICB9XG5cbiAgKmtleXMoKTogSXRlcmFibGVJdGVyYXRvcjxzdHJpbmc+IHtcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiB0aGlzLl9oZWFkZXJzX21hcCkge1xuICAgICAgeWllbGQga2V5O1xuICAgIH1cbiAgfVxuXG4gICp2YWx1ZXMoKTogSXRlcmFibGVJdGVyYXRvcjxzdHJpbmc+IHtcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiB0aGlzLl9oZWFkZXJzX21hcCkge1xuICAgICAgeWllbGQgdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgKmVudHJpZXMoKTogSXRlcmFibGVJdGVyYXRvcjxbc3RyaW5nLCBzdHJpbmddPiB7XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiB0aGlzLl9oZWFkZXJzX21hcCkge1xuICAgICAgeWllbGQgZW50cnk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBib29sZWFuIHN0YXRpbmcgd2hldGhlciBhIGBIZWFkZXJzYCBvYmplY3QgY29udGFpbnMgYSBjZXJ0YWluIGhlYWRlci5cbiAgICovXG4gIGhhcyhuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faGVhZGVyc19tYXAuaGFzKG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBgQnl0ZVN0cmluZ2Agc2VxdWVuY2Ugb2YgYWxsIHRoZSB2YWx1ZXMgb2YgYSBoZWFkZXIgd2l0aCBhIGdpdmVuIG5hbWUuXG4gICAqL1xuICBnZXQobmFtZTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYWRlcnNfbWFwLmdldChuYW1lKSA/PyBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSBuZXcgdmFsdWUgZm9yIGFuIGV4aXN0aW5nIGhlYWRlciBpbnNpZGUgYSBgSGVhZGVyc2Agb2JqZWN0LCBvciBhZGRzIHRoZSBoZWFkZXIgaWYgaXQgZG9lcyBub3QgYWxyZWFkeSBleGlzdC5cbiAgICovXG4gIHNldChuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl9oZWFkZXJzX21hcC5zZXQobmFtZSwgU3RyaW5nKHZhbHVlKSk7XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kcyBhIG5ldyB2YWx1ZSBvbnRvIGFuIGV4aXN0aW5nIGhlYWRlciBpbnNpZGUgYSBgSGVhZGVyc2Agb2JqZWN0LCBvciBhZGRzIHRoZSBoZWFkZXIgaWYgaXQgZG9lcyBub3QgYWxyZWFkeSBleGlzdC5cbiAgICovXG4gIGFwcGVuZChuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBsZXQgcmVzb2x2ZWRWYWx1ZSA9IHRoaXMuaGFzKG5hbWUpID8gYCR7dGhpcy5nZXQobmFtZSl9LCAke3ZhbHVlfWAgOiB2YWx1ZTtcblxuICAgIHRoaXMuc2V0KG5hbWUsIHJlc29sdmVkVmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZXMgYSBoZWFkZXIgZnJvbSB0aGUgYEhlYWRlcnNgIG9iamVjdC5cbiAgICovXG4gIGRlbGV0ZShuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaGFzKG5hbWUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5faGVhZGVyc19tYXAuZGVsZXRlKG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYXZlcnNlcyB0aGUgYEhlYWRlcnNgIG9iamVjdCxcbiAgICogY2FsbGluZyB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGVhY2ggaGVhZGVyLlxuICAgKi9cbiAgZm9yRWFjaDxUaGlzQXJnID0gdGhpcz4oXG4gICAgY2FsbGJhY2s6IChcbiAgICAgIHRoaXM6IFRoaXNBcmcsXG4gICAgICB2YWx1ZTogc3RyaW5nLFxuICAgICAgbmFtZTogc3RyaW5nLFxuICAgICAgcGFyZW50OiB0aGlzXG4gICAgKSA9PiB2b2lkLFxuICAgIHRoaXNBcmc/OiBUaGlzQXJnXG4gICkge1xuICAgIGZvciAoY29uc3QgW25hbWUsIHZhbHVlXSBvZiB0aGlzLmVudHJpZXMoKSkge1xuICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWx1ZSwgbmFtZSwgdGhpcyk7XG4gICAgfVxuICB9XG59XG4iLCAiLy8gTUlUIExpY2Vuc2VcblxuLy8gQ29weXJpZ2h0IChjKSAyMDE3IG1vbHNzb25cblxuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbi8vIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbi8vIFNPRlRXQVJFLlxuXG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJy4uL2V2ZW50JztcblxuaW50ZXJmYWNlIEFib3J0RXZlbnQge1xuICB0eXBlOiAnYWJvcnQnO1xuICByZWFzb24/OiBhbnk7XG59XG5cbmV4cG9ydCBjbGFzcyBBYm9ydFNpZ25hbCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIHByaXZhdGUgX2Fib3J0ZWQ6IGJvb2xlYW47XG4gIHByaXZhdGUgX3JlYXNvbjogYW55O1xuXG4gIHB1YmxpYyBvbmFib3J0OiAoLi4uYXJnczogdW5rbm93bltdKSA9PiB2b2lkO1xuXG4gIGdldCBhYm9ydGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9hYm9ydGVkO1xuICB9XG5cbiAgZ2V0IHJlYXNvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVhc29uO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2Fib3J0ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHtcbiAgICByZXR1cm4gJ1tvYmplY3QgQWJvcnRTaWduYWxdJztcbiAgfVxuXG4gIGRpc3BhdGNoRXZlbnQoZXZlbnQ6IEFib3J0RXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2Fib3J0Jykge1xuICAgICAgdGhpcy5fYWJvcnRlZCA9IHRydWU7XG4gICAgICB0aGlzLl9yZWFzb24gPSBldmVudC5yZWFzb247XG4gICAgICBpZiAodHlwZW9mIHRoaXMub25hYm9ydCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLm9uYWJvcnQuY2FsbCh0aGlzLCBldmVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3VwZXIuZW1pdChldmVudC50eXBlLCBldmVudCk7XG4gIH1cblxuICBhZGRFdmVudExpc3RlbmVyKHR5cGU6IHN0cmluZywgbGlzdGVuZXI6ICguLi5hcmdzOiB1bmtub3duW10pID0+IHZvaWQpIHtcbiAgICBzdXBlci5hZGRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICBzdGF0aWMgX19jcmVhdGUoKSB7XG4gICAgcmV0dXJuIG5ldyBBYm9ydFNpZ25hbCgpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBYm9ydENvbnRyb2xsZXIge1xuICBwcml2YXRlIF9zaWduYWw6IEFib3J0U2lnbmFsO1xuICBnZXQgc2lnbmFsKCkge1xuICAgIHJldHVybiB0aGlzLl9zaWduYWw7XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9zaWduYWwgPSBBYm9ydFNpZ25hbC5fX2NyZWF0ZSgpO1xuICB9XG5cbiAgYWJvcnQocmVhc29uPzogYW55KSB7XG4gICAgbGV0IHNpZ25hbFJlYXNvbiA9IHJlYXNvbjtcbiAgICBpZiAoc2lnbmFsUmVhc29uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHNpZ25hbFJlYXNvbiA9IG5ldyBFcnJvcignVGhpcyBvcGVyYXRpb24gd2FzIGFib3J0ZWQnKTtcbiAgICAgIHNpZ25hbFJlYXNvbi5uYW1lID0gJ0Fib3J0RXJyb3InO1xuICAgIH1cblxuICAgIGNvbnN0IGV2ZW50OiBBYm9ydEV2ZW50ID0ge1xuICAgICAgdHlwZTogJ2Fib3J0JyxcbiAgICAgIHJlYXNvbjogc2lnbmFsUmVhc29uLFxuICAgIH07XG5cbiAgICB0aGlzLnNpZ25hbC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgfVxuXG4gIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHtcbiAgICByZXR1cm4gJ1tvYmplY3QgQWJvcnRDb250cm9sbGVyXSc7XG4gIH1cbn1cbiIsICIvLyBDb3B5cmlnaHQgMjAyNCBUaGUgTHlueCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlIFZlcnNpb24gMi4wIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZVxuLy8gTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuXG5pbXBvcnQgeyBCb2R5TWl4aW4gfSBmcm9tICcuL0JvZHlNaXhpbic7XG5pbXBvcnQgeyBIZWFkZXJzIH0gZnJvbSAnLi9IZWFkZXJzJztcbmltcG9ydCB7IEFib3J0Q29udHJvbGxlciwgQWJvcnRTaWduYWwgfSBmcm9tICcuL0Fib3J0Q29udHJvbGxlcic7XG5cbnR5cGUgUmVxdWVzdEx5bnhFeHRlbnNpb24gPSBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuXG5pbnRlcmZhY2UgUmVxdWVzdEluaXRJbm5lciBleHRlbmRzIFJlcXVlc3RJbml0IHtcbiAgbHlueEV4dGVuc2lvbj86IFJlcXVlc3RMeW54RXh0ZW5zaW9uO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVxdWVzdENsYXNzKFByb21pc2U6IFByb21pc2VDb25zdHJ1Y3Rvcik6IGFueSB7XG4gIHJldHVybiBjbGFzcyBSZXF1ZXN0IGV4dGVuZHMgQm9keU1peGluIHtcbiAgICBwcml2YXRlIF91cmw6IHN0cmluZztcbiAgICBwcml2YXRlIF9oZWFkZXJzOiBIZWFkZXJzO1xuICAgIHByaXZhdGUgX21ldGhvZDogc3RyaW5nO1xuICAgIHByaXZhdGUgX3NpZ25hbDogQWJvcnRTaWduYWw7XG4gICAgcHJpdmF0ZSBfbHlueEV4dGVuc2lvbjogUmVxdWVzdEx5bnhFeHRlbnNpb247XG5cbiAgICBnZXQgdXJsKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3VybDtcbiAgICB9XG5cbiAgICBnZXQgaGVhZGVycygpIHtcbiAgICAgIHJldHVybiB0aGlzLl9oZWFkZXJzO1xuICAgIH1cblxuICAgIGdldCBtZXRob2QoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbWV0aG9kO1xuICAgIH1cblxuICAgIGdldCBzaWduYWwoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2lnbmFsO1xuICAgIH1cblxuICAgIGdldCBseW54RXh0ZW5zaW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2x5bnhFeHRlbnNpb247XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoaW5wdXQ6IFJlcXVlc3RJbmZvLCBvcHRpb25zPzogUmVxdWVzdEluaXRJbm5lcikge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBSZXF1ZXN0KSB7XG4gICAgICAgIGlmIChpbnB1dC5ib2R5VXNlZCkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VybCA9IGlucHV0LnVybDtcbiAgICAgICAgaWYgKCFvcHRpb25zLmhlYWRlcnMpIHtcbiAgICAgICAgICB0aGlzLl9oZWFkZXJzID0gbmV3IEhlYWRlcnMoaW5wdXQuaGVhZGVycyBhcyBnbG9iYWxUaGlzLkhlYWRlcnMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21ldGhvZCA9IGlucHV0Lm1ldGhvZDtcbiAgICAgICAgdGhpcy5fc2lnbmFsID0gKGlucHV0LnNpZ25hbCBhcyBhbnkpIGFzIEFib3J0U2lnbmFsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdXJsID0gU3RyaW5nKGlucHV0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuaGVhZGVycyB8fCAhdGhpcy5oZWFkZXJzKSB7XG4gICAgICAgIHRoaXMuX2hlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpO1xuICAgICAgfVxuICAgICAgdGhpcy5fbWV0aG9kID0gb3B0aW9ucy5tZXRob2QgfHwgdGhpcy5tZXRob2QgfHwgJ0dFVCc7XG4gICAgICB0aGlzLl9tZXRob2QgPSB0aGlzLl9tZXRob2QudG9VcHBlckNhc2UoKTtcblxuICAgICAgaWYgKCh0aGlzLm1ldGhvZCA9PT0gJ0dFVCcgfHwgdGhpcy5tZXRob2QgPT09ICdIRUFEJykgJiYgb3B0aW9ucy5ib2R5KSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JvZHkgbm90IGFsbG93ZWQgZm9yIEdFVCBvciBIRUFEIHJlcXVlc3RzJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5zaWduYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMuX3NpZ25hbCA9IChvcHRpb25zLnNpZ25hbCBhcyBhbnkpIGFzIEFib3J0U2lnbmFsO1xuICAgICAgfVxuICAgICAgdGhpcy5fc2lnbmFsID0gdGhpcy5fc2lnbmFsIHx8IEFib3J0U2lnbmFsLl9fY3JlYXRlKCk7XG5cbiAgICAgIHRoaXMuX2x5bnhFeHRlbnNpb24gPSBvcHRpb25zLmx5bnhFeHRlbnNpb24gfHwge307XG5cbiAgICAgIGlmICghdGhpcy5faGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5ib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRoaXMuX2hlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04Jyk7XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgZ2xvYmFsVGhpcy5VUkxTZWFyY2hQYXJhbXMgJiZcbiAgICAgICAgICBvcHRpb25zLmJvZHkgaW5zdGFuY2VvZiBVUkxTZWFyY2hQYXJhbXNcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5faGVhZGVycy5zZXQoXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJyxcbiAgICAgICAgICAgICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCdcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuYm9keSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5faGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldEJvZHkob3B0aW9ucy5ib2R5KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2xvbmUoKTogUmVxdWVzdCB7XG4gICAgICBjb25zdCBjbG9uZWQgPSBuZXcgUmVxdWVzdCh0aGlzIGFzIGFueSwge1xuICAgICAgICBtZXRob2Q6IHRoaXMubWV0aG9kLFxuICAgICAgfSk7XG5cbiAgICAgIGNsb25lZC5zZXRCb2R5KHRoaXMpO1xuICAgICAgcmV0dXJuIGNsb25lZDtcbiAgICB9XG4gIH07XG59XG4iLCAiLy8gQ29weXJpZ2h0IDIwMjQgVGhlIEx5bnggQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSBWZXJzaW9uIDIuMCB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGVcbi8vIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cblxuaW1wb3J0IHsgQm9keU1peGluIH0gZnJvbSAnLi9Cb2R5TWl4aW4nO1xuXG50eXBlIFJlc3BvbnNlTHlueEV4dGVuc2lvbiA9IFJlY29yZDxzdHJpbmcsIGFueT47XG5cbmludGVyZmFjZSBSZXNwb25zZUluaXRJbm5lciBleHRlbmRzIFJlc3BvbnNlSW5pdCB7XG4gIHVybD86IHN0cmluZztcbiAgbHlueEV4dGVuc2lvbj86IFJlc3BvbnNlTHlueEV4dGVuc2lvbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVJlc3BvbnNlQ2xhc3MoUHJvbWlzZTogUHJvbWlzZUNvbnN0cnVjdG9yKTogYW55IHtcbiAgcmV0dXJuIGNsYXNzIFJlc3BvbnNlIGV4dGVuZHMgQm9keU1peGluIHtcbiAgICBwcml2YXRlIF91cmw6IHN0cmluZztcbiAgICBwcml2YXRlIF9zdGF0dXM6IG51bWJlcjtcbiAgICBwcml2YXRlIF9zdGF0dXNUZXh0OiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfb2s6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBfaGVhZGVyczogSGVhZGVycztcbiAgICBwcml2YXRlIF9seW54RXh0ZW5zaW9uOiBSZXNwb25zZUx5bnhFeHRlbnNpb247XG5cbiAgICBnZXQgdXJsKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3VybDtcbiAgICB9XG5cbiAgICBnZXQgc3RhdHVzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3N0YXR1cztcbiAgICB9XG5cbiAgICBnZXQgc3RhdHVzVGV4dCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zdGF0dXNUZXh0O1xuICAgIH1cblxuICAgIGdldCBvaygpIHtcbiAgICAgIHJldHVybiB0aGlzLl9vaztcbiAgICB9XG5cbiAgICBnZXQgaGVhZGVycygpIHtcbiAgICAgIHJldHVybiB0aGlzLl9oZWFkZXJzO1xuICAgIH1cblxuICAgIGdldCBseW54RXh0ZW5zaW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2x5bnhFeHRlbnNpb247XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoYm9keUluaXQ/OiBCb2R5SW5pdCwgb3B0aW9ucz86IFJlc3BvbnNlSW5pdElubmVyKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIHRoaXMuX3N0YXR1cyA9IG9wdGlvbnMuc3RhdHVzID09PSB1bmRlZmluZWQgPyAyMDAgOiBvcHRpb25zLnN0YXR1cztcbiAgICAgIGlmICh0aGlzLl9zdGF0dXMgPCAyMDAgfHwgdGhpcy5fc3RhdHVzID4gNTk5KSB7XG4gICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFxuICAgICAgICAgIFwiRmFpbGVkIHRvIGNvbnN0cnVjdCAnUmVzcG9uc2UnOiBUaGUgc3RhdHVzIHByb3ZpZGVkICgwKSBpcyBvdXRzaWRlIHRoZSByYW5nZSBbMjAwLCA1OTldLlwiXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICB0aGlzLl9vayA9IHRoaXMuX3N0YXR1cyA+PSAyMDAgJiYgdGhpcy5fc3RhdHVzIDwgMzAwO1xuICAgICAgdGhpcy5fc3RhdHVzVGV4dCA9XG4gICAgICAgIG9wdGlvbnMuc3RhdHVzVGV4dCA9PT0gdW5kZWZpbmVkID8gJycgOiAnJyArIG9wdGlvbnMuc3RhdHVzVGV4dDtcbiAgICAgIHRoaXMuX2hlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpO1xuICAgICAgdGhpcy5fdXJsID0gb3B0aW9ucy51cmwgfHwgJyc7XG4gICAgICB0aGlzLl9seW54RXh0ZW5zaW9uID0gb3B0aW9ucy5seW54RXh0ZW5zaW9uIHx8IHt9O1xuICAgICAgdGhpcy5zZXRCb2R5KGJvZHlJbml0KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2xvbmUoKTogUmVzcG9uc2Uge1xuICAgICAgY29uc3QgY2xvbmVkID0gbmV3IFJlc3BvbnNlKG51bGwsIHtcbiAgICAgICAgc3RhdHVzOiB0aGlzLl9zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHRoaXMuX3N0YXR1c1RleHQsXG4gICAgICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHRoaXMuX2hlYWRlcnMpLFxuICAgICAgICB1cmw6IHRoaXMuX3VybCxcbiAgICAgIH0pO1xuXG4gICAgICBjbG9uZWQuc2V0Qm9keSh0aGlzKTtcblxuICAgICAgcmV0dXJuIGNsb25lZDtcbiAgICB9XG4gIH07XG59XG4iLCAiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIE1ldGEgUGxhdGZvcm1zLCBJbmMuIGFuZCBhZmZpbGlhdGVzLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqL1xuXG5mdW5jdGlvbiB2YWxpZGF0ZUJhc2VVcmwodXJsKSB7XG4gICAgLy8gZnJvbSB0aGlzIE1JVC1saWNlbnNlZCBnaXN0OiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9kcGVyaW5pLzcyOTI5NFxuICAgIHJldHVybiAvXig/Oig/Oig/Omh0dHBzP3xmdHApOik/XFwvXFwvKSg/Oig/OlsxLTldXFxkP3wxXFxkXFxkfDJbMDFdXFxkfDIyWzAtM10pKD86XFwuKD86MT9cXGR7MSwyfXwyWzAtNF1cXGR8MjVbMC01XSkpezJ9KD86XFwuKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswLTRdXFxkfDI1WzAtNF0pKXwoPzooPzpbYS16MC05XFx1MDBhMS1cXHVmZmZmXVthLXowLTlcXHUwMGExLVxcdWZmZmZfLV17MCw2Mn0pP1thLXowLTlcXHUwMGExLVxcdWZmZmZdXFwuKSooPzpbYS16XFx1MDBhMS1cXHVmZmZmXXsyLH1cXC4/KSkoPzo6XFxkezIsNX0pPyg/OlsvPyNdXFxTKik/JC8udGVzdChcbiAgICAgIHVybCxcbiAgICApO1xuICB9XG4gIFxuZXhwb3J0IGNsYXNzIFVSTCB7XG4gICAgX3VybDtcbiAgICBfc2VhcmNoUGFyYW1zSW5zdGFuY2UgPSBudWxsO1xuICBcbiAgICBjb25zdHJ1Y3Rvcih1cmwsIGJhc2UpIHtcbiAgICAgIGxldCBiYXNlVXJsID0gbnVsbDtcbiAgICAgIGlmICghYmFzZSB8fCB2YWxpZGF0ZUJhc2VVcmwodXJsKSkge1xuICAgICAgICB0aGlzLl91cmwgPSB1cmw7XG4gICAgICAgIGlmICghdGhpcy5fdXJsLmVuZHNXaXRoKCcvJykpIHtcbiAgICAgICAgICB0aGlzLl91cmwgKz0gJy8nO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIGJhc2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgYmFzZVVybCA9IGJhc2U7XG4gICAgICAgICAgaWYgKCF2YWxpZGF0ZUJhc2VVcmwoYmFzZVVybCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEludmFsaWQgYmFzZSBVUkw6ICR7YmFzZVVybH1gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYmFzZVVybCA9IGJhc2UudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYmFzZVVybC5lbmRzV2l0aCgnLycpKSB7XG4gICAgICAgICAgYmFzZVVybCA9IGJhc2VVcmwuc2xpY2UoMCwgYmFzZVVybC5sZW5ndGggLSAxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXVybC5zdGFydHNXaXRoKCcvJykpIHtcbiAgICAgICAgICB1cmwgPSBgLyR7dXJsfWA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJhc2VVcmwuZW5kc1dpdGgodXJsKSkge1xuICAgICAgICAgIHVybCA9ICcnO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VybCA9IGAke2Jhc2VVcmx9JHt1cmx9YDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgaHJlZigpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuICBcbiAgICBnZXQgc2VhcmNoUGFyYW1zKCkge1xuICAgICAgaWYgKHRoaXMuX3NlYXJjaFBhcmFtc0luc3RhbmNlID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fc2VhcmNoUGFyYW1zSW5zdGFuY2UgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fc2VhcmNoUGFyYW1zSW5zdGFuY2U7XG4gICAgfVxuICBcbiAgICB0b0pTT04oKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICAgIH1cbiAgXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICBpZiAodGhpcy5fc2VhcmNoUGFyYW1zSW5zdGFuY2UgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VybDtcbiAgICAgIH1cbiAgXG4gICAgICBjb25zdCBpbnN0YW5jZVN0cmluZyA9IHRoaXMuX3NlYXJjaFBhcmFtc0luc3RhbmNlLnRvU3RyaW5nKCk7XG4gICAgICBjb25zdCBzZXBhcmF0b3IgPSB0aGlzLl91cmwuaW5kZXhPZignPycpID4gLTEgPyAnJicgOiAnPyc7XG4gICAgICByZXR1cm4gdGhpcy5fdXJsICsgc2VwYXJhdG9yICsgaW5zdGFuY2VTdHJpbmc7XG4gICAgfVxuICB9XG4gICIsICIvLyBNSVQgTGljZW5zZVxuXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTYgSmVycnkgQmVuZHlcblxuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbi8vIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbi8vIFNPRlRXQVJFLlxuXG4vKiohXG4gKiB1cmwtc2VhcmNoLXBhcmFtcy1wb2x5ZmlsbFxuICpcbiAqIEBhdXRob3IgSmVycnkgQmVuZHkgKGh0dHBzOi8vZ2l0aHViLmNvbS9qZXJyeWJlbmR5KVxuICogQGxpY2VuY2UgTUlUXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIFVSTFNlYXJjaFBhcmFtc1BvbHlmaWxsKHNlbGYpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgY29uc3QgX19VUkxTZWFyY2hQYXJhbXNfXyA9IFwiX19VUkxTZWFyY2hQYXJhbXNfX1wiO1xuLyoqXG4gKiBNYWtlIGEgVVJMU2VhcmNoUGFyYW1zIGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfFVSTFNlYXJjaFBhcmFtc30gc2VhcmNoXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gVVJMU2VhcmNoUGFyYW1zUG9seWZpbGwoc2VhcmNoKSB7XG4gICAgc2VhcmNoID0gc2VhcmNoIHx8IFwiXCI7XG5cbiAgICAvLyBzdXBwb3J0IGNvbnN0cnVjdCBvYmplY3Qgd2l0aCBhbm90aGVyIFVSTFNlYXJjaFBhcmFtcyBpbnN0YW5jZVxuICAgIGlmIChzZWFyY2ggaW5zdGFuY2VvZiBVUkxTZWFyY2hQYXJhbXMpIHtcbiAgICAgICAgc2VhcmNoID0gc2VhcmNoLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIHRoaXMgW19fVVJMU2VhcmNoUGFyYW1zX19dID0gcGFyc2VUb0RpY3Qoc2VhcmNoKTtcbn1cblxuY29uc3QgcHJvdG90eXBlID0gVVJMU2VhcmNoUGFyYW1zUG9seWZpbGwucHJvdG90eXBlO1xuXG4vKipcbiAqIEFwcGVuZHMgYSBzcGVjaWZpZWQga2V5L3ZhbHVlIHBhaXIgYXMgYSBuZXcgc2VhcmNoIHBhcmFtZXRlci5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gKi9cbnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgIGFwcGVuZFRvKHRoaXMgW19fVVJMU2VhcmNoUGFyYW1zX19dLCBuYW1lLCB2YWx1ZSk7XG59O1xuXG4vKipcbiAqIERlbGV0ZXMgdGhlIGdpdmVuIHNlYXJjaCBwYXJhbWV0ZXIsIGFuZCBpdHMgYXNzb2NpYXRlZCB2YWx1ZSxcbiAqIGZyb20gdGhlIGxpc3Qgb2YgYWxsIHNlYXJjaCBwYXJhbWV0ZXJzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gKi9cbnByb3RvdHlwZVsnZGVsZXRlJ10gPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMgW19fVVJMU2VhcmNoUGFyYW1zX19dIFtuYW1lXTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZmlyc3QgdmFsdWUgYXNzb2NpYXRlZCB0byB0aGUgZ2l2ZW4gc2VhcmNoIHBhcmFtZXRlci5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICogQHJldHVybnMge3N0cmluZ3xudWxsfVxuICovXG5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBkaWN0ID0gdGhpcyBbX19VUkxTZWFyY2hQYXJhbXNfX107XG4gICAgcmV0dXJuIHRoaXMuaGFzKG5hbWUpID8gZGljdFtuYW1lXVswXSA6IG51bGw7XG59O1xuXG4vKipcbiAqIFJldHVybnMgYWxsIHRoZSB2YWx1ZXMgYXNzb2NpYXRpb24gd2l0aCBhIGdpdmVuIHNlYXJjaCBwYXJhbWV0ZXIuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqL1xucHJvdG90eXBlLmdldEFsbCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgZGljdCA9IHRoaXMgW19fVVJMU2VhcmNoUGFyYW1zX19dO1xuICAgIHJldHVybiB0aGlzLmhhcyhuYW1lKSA/IGRpY3QgW25hbWVdLnNsaWNlKDApIDogW107XG59O1xuXG4vKipcbiAqIFJldHVybnMgYSBCb29sZWFuIGluZGljYXRpbmcgaWYgc3VjaCBhIHNlYXJjaCBwYXJhbWV0ZXIgZXhpc3RzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gaGFzT3duUHJvcGVydHkodGhpcyBbX19VUkxTZWFyY2hQYXJhbXNfX10sIG5hbWUpO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSB2YWx1ZSBhc3NvY2lhdGVkIHRvIGEgZ2l2ZW4gc2VhcmNoIHBhcmFtZXRlciB0b1xuICogdGhlIGdpdmVuIHZhbHVlLiBJZiB0aGVyZSB3ZXJlIHNldmVyYWwgdmFsdWVzLCBkZWxldGUgdGhlXG4gKiBvdGhlcnMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICovXG5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0KG5hbWUsIHZhbHVlKSB7XG4gICAgdGhpcyBbX19VUkxTZWFyY2hQYXJhbXNfX11bbmFtZV0gPSBbJycgKyB2YWx1ZV07XG59O1xuXG4vKipcbiAqIFJldHVybnMgYSBzdHJpbmcgY29udGFpbmluZyBhIHF1ZXJ5IHN0cmluZyBzdWl0YWJsZSBmb3IgdXNlIGluIGEgVVJMLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkaWN0ID0gdGhpc1tfX1VSTFNlYXJjaFBhcmFtc19fXSwgcXVlcnkgPSBbXSwgaSwga2V5LCBuYW1lLCB2YWx1ZTtcbiAgICBmb3IgKGtleSBpbiBkaWN0KSB7XG4gICAgICAgIG5hbWUgPSBlbmNvZGUoa2V5KTtcbiAgICAgICAgZm9yIChpID0gMCwgdmFsdWUgPSBkaWN0W2tleV07IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcXVlcnkucHVzaChuYW1lICsgJz0nICsgZW5jb2RlKHZhbHVlW2ldKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHF1ZXJ5LmpvaW4oJyYnKTtcbn07XG5cbnByb3RvdHlwZS5wb2x5ZmlsbCA9IHRydWU7XG5wcm90b3R5cGVbU3ltYm9sLnRvU3RyaW5nVGFnXSA9ICdVUkxTZWFyY2hQYXJhbXMnO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHBhcmFtIHtvYmplY3R9IHRoaXNBcmdcbiAqL1xucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbihjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIHZhciBkaWN0ID0gcGFyc2VUb0RpY3QodGhpcy50b1N0cmluZygpKTtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhkaWN0KS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgZGljdFtuYW1lXS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHZhbHVlLCBuYW1lLCB0aGlzKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSwgdGhpcyk7XG59O1xuXG4vKipcbiAqIFNvcnQgYWxsIG5hbWUtdmFsdWUgcGFpcnNcbiAqL1xucHJvdG90eXBlLnNvcnQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGljdCA9IHBhcnNlVG9EaWN0KHRoaXMudG9TdHJpbmcoKSksIGtleXMgPSBbXSwgaywgaSwgajtcbiAgICBmb3IgKGsgaW4gZGljdCkge1xuICAgICAgICBrZXlzLnB1c2goayk7XG4gICAgfVxuICAgIGtleXMuc29ydCgpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpc1snZGVsZXRlJ10oa2V5c1tpXSk7XG4gICAgfVxuICAgIGZvciAoaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzW2ldLCB2YWx1ZXMgPSBkaWN0W2tleV07XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCB2YWx1ZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kKGtleSwgdmFsdWVzW2pdKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyBhbiBpdGVyYXRvciBhbGxvd2luZyB0byBnbyB0aHJvdWdoIGFsbCBrZXlzIG9mXG4gKiB0aGUga2V5L3ZhbHVlIHBhaXJzIGNvbnRhaW5lZCBpbiB0aGlzIG9iamVjdC5cbiAqXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259XG4gKi9cbnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGl0ZW1zID0gW107XG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIG5hbWUpIHtcbiAgICAgICAgaXRlbXMucHVzaChuYW1lKTtcbiAgICB9KTtcbiAgICByZXR1cm4gbWFrZUl0ZXJhdG9yKGl0ZW1zKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyBhbiBpdGVyYXRvciBhbGxvd2luZyB0byBnbyB0aHJvdWdoIGFsbCB2YWx1ZXMgb2ZcbiAqIHRoZSBrZXkvdmFsdWUgcGFpcnMgY29udGFpbmVkIGluIHRoaXMgb2JqZWN0LlxuICpcbiAqIEByZXR1cm5zIHtmdW5jdGlvbn1cbiAqL1xucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIGl0ZW1zLnB1c2goaXRlbSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG1ha2VJdGVyYXRvcihpdGVtcyk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgYW4gaXRlcmF0b3IgYWxsb3dpbmcgdG8gZ28gdGhyb3VnaCBhbGwga2V5L3ZhbHVlXG4gKiBwYWlycyBjb250YWluZWQgaW4gdGhpcyBvYmplY3QuXG4gKlxuICogQHJldHVybnMge2Z1bmN0aW9ufVxuICovXG5wcm90b3R5cGUuZW50cmllcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBuYW1lKSB7XG4gICAgICAgIGl0ZW1zLnB1c2goW25hbWUsIGl0ZW1dKTtcbiAgICB9KTtcbiAgICByZXR1cm4gbWFrZUl0ZXJhdG9yKGl0ZW1zKTtcbn07XG5cbnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gcHJvdG90eXBlLmVudHJpZXM7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90b3R5cGUsICdzaXplJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGljdCA9IHBhcnNlVG9EaWN0KHRoaXMudG9TdHJpbmcoKSlcbiAgICAgICAgaWYgKHByb3RvdHlwZSA9PT0gdGhpcykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSWxsZWdhbCBpbnZvY2F0aW9uIGF0IFVSTFNlYXJjaFBhcmFtcy5pbnZva2VHZXR0ZXInKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhkaWN0KS5yZWR1Y2UoZnVuY3Rpb24gKHByZXYsIGN1cikge1xuICAgICAgICAgICAgcmV0dXJuIHByZXYgKyBkaWN0W2N1cl0ubGVuZ3RoO1xuICAgICAgICB9LCAwKTtcbiAgICB9XG59KTtcblxuZnVuY3Rpb24gZW5jb2RlKHN0cikge1xuICAgIHZhciByZXBsYWNlID0ge1xuICAgICAgICAnISc6ICclMjEnLFxuICAgICAgICBcIidcIjogJyUyNycsXG4gICAgICAgICcoJzogJyUyOCcsXG4gICAgICAgICcpJzogJyUyOScsXG4gICAgICAgICd+JzogJyU3RScsXG4gICAgICAgICclMjAnOiAnKycsXG4gICAgICAgICclMDAnOiAnXFx4MDAnXG4gICAgfTtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cikucmVwbGFjZSgvWyEnXFwoXFwpfl18JTIwfCUwMC9nLCBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgICByZXR1cm4gcmVwbGFjZVttYXRjaF07XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGRlY29kZShzdHIpIHtcbiAgICByZXR1cm4gc3RyXG4gICAgICAgIC5yZXBsYWNlKC9bICtdL2csICclMjAnKVxuICAgICAgICAucmVwbGFjZSgvKCVbYS1mMC05XXsyfSkrL2lnLCBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChtYXRjaCk7XG4gICAgICAgIH0pO1xufVxuXG5mdW5jdGlvbiBtYWtlSXRlcmF0b3IoYXJyKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0ge1xuICAgICAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGFyci5zaGlmdCgpO1xuICAgICAgICAgICAgcmV0dXJuIHtkb25lOiB2YWx1ZSA9PT0gdW5kZWZpbmVkLCB2YWx1ZTogdmFsdWV9O1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGl0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yO1xuICAgIH07XG5cbiAgICByZXR1cm4gaXRlcmF0b3I7XG59XG5cbmZ1bmN0aW9uIHBhcnNlVG9EaWN0KHNlYXJjaCkge1xuICAgIHZhciBkaWN0ID0ge307XG5cbiAgICBpZiAodHlwZW9mIHNlYXJjaCA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAvLyBpZiBgc2VhcmNoYCBpcyBhbiBhcnJheSwgdHJlYXQgaXQgYXMgYSBzZXF1ZW5jZVxuICAgICAgICBpZiAoaXNBcnJheShzZWFyY2gpKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlYXJjaC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gc2VhcmNoW2ldO1xuICAgICAgICAgICAgICAgIGlmIChpc0FycmF5KGl0ZW0pICYmIGl0ZW0ubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIGFwcGVuZFRvKGRpY3QsIGl0ZW1bMF0sIGl0ZW1bMV0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGYWlsZWQgdG8gY29uc3RydWN0ICdVUkxTZWFyY2hQYXJhbXMnOiBTZXF1ZW5jZSBpbml0aWFsaXplciBtdXN0IG9ubHkgY29udGFpbiBwYWlyIGVsZW1lbnRzXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNlYXJjaCkge1xuICAgICAgICAgICAgICAgIGlmIChzZWFyY2guaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBhcHBlbmRUbyhkaWN0LCBrZXksIHNlYXJjaFtrZXldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHJlbW92ZSBmaXJzdCAnPydcbiAgICAgICAgaWYgKHNlYXJjaC5pbmRleE9mKFwiP1wiKSA9PT0gMCkge1xuICAgICAgICAgICAgc2VhcmNoID0gc2VhcmNoLnNsaWNlKDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHBhaXJzID0gc2VhcmNoLnNwbGl0KFwiJlwiKTtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBwYWlycy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gcGFpcnMgW2pdLFxuICAgICAgICAgICAgICAgIGluZGV4ID0gdmFsdWUuaW5kZXhPZignPScpO1xuXG4gICAgICAgICAgICBpZiAoLTEgPCBpbmRleCkge1xuICAgICAgICAgICAgICAgIGFwcGVuZFRvKGRpY3QsIGRlY29kZSh2YWx1ZS5zbGljZSgwLCBpbmRleCkpLCBkZWNvZGUodmFsdWUuc2xpY2UoaW5kZXggKyAxKSkpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBhcHBlbmRUbyhkaWN0LCBkZWNvZGUodmFsdWUpLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpY3Q7XG59XG5cbmZ1bmN0aW9uIGFwcGVuZFRvKGRpY3QsIG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIHZhbCA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyB2YWx1ZSA6IChcbiAgICAgICAgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdmFsdWUudG9TdHJpbmcgPT09ICdmdW5jdGlvbicgPyB2YWx1ZS50b1N0cmluZygpIDogSlNPTi5zdHJpbmdpZnkodmFsdWUpXG4gICAgKTtcblxuICAgIC8vICM0NyBQcmV2ZW50IHVzaW5nIGBoYXNPd25Qcm9wZXJ0eWAgYXMgYSBwcm9wZXJ0eSBuYW1lXG4gICAgaWYgKGhhc093blByb3BlcnR5KGRpY3QsIG5hbWUpKSB7XG4gICAgICAgIGRpY3RbbmFtZV0ucHVzaCh2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGRpY3RbbmFtZV0gPSBbdmFsXTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkodmFsKSB7XG4gICAgcmV0dXJuICEhdmFsICYmICdbb2JqZWN0IEFycmF5XScgPT09IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWwpO1xufVxuXG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG5cbnNlbGYuVVJMU2VhcmNoUGFyYW1zID0gc2VsZi5VUkxTZWFyY2hQYXJhbXMgPz8gVVJMU2VhcmNoUGFyYW1zUG9seWZpbGw7XG5cbn0iLCAiLy8gQ29weXJpZ2h0IDIwMjQgVGhlIEx5bnggQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSBWZXJzaW9uIDIuMCB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGVcbi8vIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cblxuaW1wb3J0IHtcbiAgQXBwUHJveHlQYXJhbXMsXG4gIEVudktleSxcbiAgTGlmZUV2ZW50LFxuICBsb2FkQ2FyZFBhcmFtcyxcbiAgTmF0aXZlQXBwLFxuICByZXF1aXJlUGFyYW1PYmosXG59IGZyb20gJy4vaW50ZXJmYWNlJztcbmltcG9ydCB7IEFNREZhY3RvcnksIEFNRE1vZHVsZSB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBjcmVhdGVTaGFyZWRDb25zb2xlLCBTaGFyZWRDb25zb2xlIH0gZnJvbSAnQGx5bngtanMvcnVudGltZS1zaGFyZWQnO1xuaW1wb3J0IHtcbiAgUmVwb3J0ZXIsXG4gIEJhc2VFcnJvcixcbiAgSW50ZXJuYWxSdW50aW1lRXJyb3IsXG4gIEx5bnhFcnJvckxldmVsLFxuICBVc2VyUnVudGltZUVycm9yLFxufSBmcm9tICcuLi9tb2R1bGVzL3JlcG9ydCc7XG5pbXBvcnQgeyBDb250ZXh0UHJveHlUeXBlLCBMeW54LCBOYXRpdmVMeW54UHJveHkgfSBmcm9tICcuLi9seW54JztcbmltcG9ydCBFdmVudEVtaXR0ZXIsIHsgQW9wTWFuYWdlciwgQmVmb3JlUHVibGlzaEV2ZW50IH0gZnJvbSAnLi4vbW9kdWxlcy9ldmVudCc7XG5pbXBvcnQge1xuICBFeHBvc3VyZU1hbmFnZXIsXG4gIEludGVyc2VjdGlvbk9ic2VydmVyTWFuYWdlcixcbiAgTmF0aXZlTHlueFVJTW9kdWxlLFxuICBOYXRpdmVNb2R1bGUsXG4gIFRleHRJbmZvLFxuICBUZXh0SW5mb01hbmFnZXIsXG4gIFRleHRNZXRyaWNzLFxufSBmcm9tICcuLi9tb2R1bGVzL25hdGl2ZU1vZHVsZXMnO1xuaW1wb3J0IHsgREVGQVVMVF9FTlRSWSwgU09VUkNFX01BUF9SRUxFQVNFX0VSUk9SX05BTUUgfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IG5hdGl2ZUdsb2JhbCBmcm9tICcuLi9jb21tb24vbmF0aXZlR2xvYmFsJztcbmltcG9ydCB7XG4gIENyZWF0ZUludGVyc2VjdGlvbk9ic2VydmVyRnVuYyxcbiAgTHlueENsZWFyVGltZW91dCxcbiAgTHlueFNldFRpbWVvdXQsXG59IGZyb20gJ0BseW54LWpzL3R5cGVzJztcbmltcG9ydCBQZXJmb3JtYW5jZSBmcm9tICcuLi9tb2R1bGVzL3BlcmZvcm1hbmNlJztcbmltcG9ydCB7IHJlcG9ydEVycm9yIH0gZnJvbSAnLi4vbW9kdWxlcy9yZXBvcnQnO1xuaW1wb3J0IEx5bnhKU0JJIGZyb20gJy4uL2NvbW1vbi9qc2JpJztcbmltcG9ydCB7IEJhc2VBcHBTaW5nbGV0b25EYXRhIH0gZnJvbSAnLi4vc3RhbmRhbG9uZS9TdGFuZGFsb25lQXBwJztcbmltcG9ydCB7IENhY2hlZEZ1bmN0aW9uUHJveHkgfSBmcm9tICcuLi91dGlsL2NhY2hlZEZ1bmN0aW9uUHJveHknO1xuaW1wb3J0IHsgZ2V0UHJvbWlzZU1heWJlUG9seWZpbGwgfSBmcm9tICcuLi91dGlsL3NldHVwLXByb21pc2UnO1xuaW1wb3J0IHsgY3JlYXRlUmVzcG9uc2VDbGFzcywgY3JlYXRlUmVxdWVzdENsYXNzIH0gZnJvbSAnLi4vbW9kdWxlcy9mZXRjaCc7XG5pbXBvcnQgeyBNZXNzYWdlRXZlbnRUeXBlLCBNZXNzYWdlRXZlbnQgfSBmcm9tICcuLi9seW54JztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2VBcHA8XG4gIE5hdGl2ZUFwcFByb3h5IGV4dGVuZHMgTmF0aXZlQXBwID0gTmF0aXZlQXBwLFxuICBMeW54SW1wbCBleHRlbmRzIEx5bnggPSBMeW54XG4+IHtcbiAgX25hdGl2ZUFwcDogTmF0aXZlQXBwUHJveHk7XG4gIG5hdGl2ZUFwcElkOiBzdHJpbmc7XG4gIF9wYXJhbXM6IGxvYWRDYXJkUGFyYW1zO1xuICBseW54OiBMeW54SW1wbDtcbiAgbW9kdWxlczogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgQU1ETW9kdWxlPj47XG4gIHNoYXJlZENvbnNvbGU6IFNoYXJlZENvbnNvbGU7XG4gIGR5bmFtaWNDb21wb25lbnRFeHBvcnRzOiBvYmplY3Q7XG4gIGxvYWRlZER5bmFtaWNDb21wb25lbnRzU2V0OiBTZXQ8c3RyaW5nPjtcbiAgcmVzb2x2ZWRQcm9taXNlOiBQcm9taXNlPHZvaWQ+O1xuXG4gIFJlcG9ydGVyOiBSZXBvcnRlcjtcbiAgX2xhenlDYWxsYWJsZU1vZHVsZXM6IE1hcDxzdHJpbmcsIHVua25vd24+O1xuICBHbG9iYWxFdmVudEVtaXR0ZXI6IEV2ZW50RW1pdHRlcjtcbiAgTmF0aXZlTW9kdWxlczogTmF0aXZlTW9kdWxlO1xuICBMeW54VUlNZXRob2RNb2R1bGU6IE5hdGl2ZUx5bnhVSU1vZHVsZTtcbiAgTHlueFRlc3RNb2R1bGU6IG9iamVjdDtcbiAgTHlueFJlc291cmNlTW9kdWxlOiBvYmplY3Q7XG4gIEx5bnhBY2Nlc3NpYmlsaXR5TW9kdWxlOiBvYmplY3Q7XG4gIEx5bnhTZXRNb2R1bGU6IG9iamVjdDtcblxuICBfYXBpTGlzdDogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIF9pbnRlcnNlY3Rpb25PYnNlcnZlck1hbmFnZXI6IEludGVyc2VjdGlvbk9ic2VydmVyTWFuYWdlcjtcbiAgX2V4cG9zdXJlTWFuYWdlcjogRXhwb3N1cmVNYW5hZ2VyO1xuICBfdGV4dEluZm9NYW5hZ2VyOiBUZXh0SW5mb01hbmFnZXI7XG4gIF9hb3BNYW5hZ2VyOiBBb3BNYW5hZ2VyO1xuICBiZWZvcmVQdWJsaXNoRXZlbnQ6IEJlZm9yZVB1Ymxpc2hFdmVudDtcblxuICBwZXJmb3JtYW5jZTogUGVyZm9ybWFuY2U7XG5cbiAgc2V0VGltZW91dDogTHlueFNldFRpbWVvdXQ7XG4gIHNldEludGVydmFsOiBMeW54U2V0VGltZW91dDtcbiAgY2xlYXJJbnRlcnZhbDogKGludGVydmFsSWQ6IG51bWJlcikgPT4gdm9pZDtcbiAgY2xlYXJUaW1lb3V0OiAodGltZW91dElkOiBudW1iZXIpID0+IHZvaWQ7XG5cbiAgX2NyZWF0ZVJlc3BvbnNlQ2xhc3M6IChcbiAgICBQcm9taXNlOiBQcm9taXNlQ29uc3RydWN0b3JcbiAgKSA9PiBSZXR1cm5UeXBlPHR5cGVvZiBjcmVhdGVSZXNwb25zZUNsYXNzPjtcbiAgX2NyZWF0ZVJlcXVlc3RDbGFzczogKFxuICAgIFByb21pc2U6IFByb21pc2VDb25zdHJ1Y3RvclxuICApID0+IFJldHVyblR5cGU8dHlwZW9mIGNyZWF0ZVJlcXVlc3RDbGFzcz47XG4gIF9SZXNwb25zZUNsYXNzOiBSZXR1cm5UeXBlPHR5cGVvZiBjcmVhdGVSZXNwb25zZUNsYXNzPjtcbiAgX1JlcXVlc3RDbGFzczogUmV0dXJuVHlwZTx0eXBlb2YgY3JlYXRlUmVxdWVzdENsYXNzPjtcblxuICBkYXRhVHlwZVNldCA9IG5ldyBTZXQoW1xuICAgICdzdHJpbmcnLFxuICAgICdudW1iZXInLFxuICAgICdhcnJheScsXG4gICAgJ29iamVjdCcsXG4gICAgJ2Jvb2xlYW4nLFxuICAgICdudWxsJyxcbiAgICAnZnVuY3Rpb24nLFxuICBdKTtcblxuICAvKipcbiAgICogSW50ZXJuYWwgRXZlbnQgTGlzdGVuZXJcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHByaXZhdGUgY29udGV4dFByb3h5VHlwZVRvTWV0aG9kOiB7fTtcbiAgcHJpdmF0ZSByZW1vdmVJbnRlcm5hbEV2ZW50TGlzdGVuZXJzQ2FsbGJhY2tzOiAoKCkgPT4gdm9pZClbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIG9wdGlvbnM6IEFwcFByb3h5UGFyYW1zPE5hdGl2ZUFwcFByb3h5PixcbiAgICBiYXNlQXBwU2luZ2xlRGF0YT86IEJhc2VBcHBTaW5nbGV0b25EYXRhPE5hdGl2ZUFwcFByb3h5LCBMeW54SW1wbD5cbiAgKSB7XG4gICAgdGhpcy5pbml0QmFzZShvcHRpb25zKTtcbiAgICBpZiAoYmFzZUFwcFNpbmdsZURhdGEpIHtcbiAgICAgIGJhc2VBcHBTaW5nbGVEYXRhLnRyYW5zZmVyU2luZ2xldG9uRGF0YShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgdGhpcy5fX2ludGVybmFsX19jYWxsTHlueFNldE1vZHVsZS5iaW5kKHRoaXMpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmluaXRFeHRyYShvcHRpb25zKTtcbiAgICB9XG5cbiAgICAvLyBpbml0IHRpbWVvdXQgZnVuY3Rpb25cbiAgICB0aGlzLnNldFRpbWVvdXQgPSB0aGlzLm5hdGl2ZUFwcC5zZXRUaW1lb3V0O1xuICAgIHRoaXMuc2V0SW50ZXJ2YWwgPSB0aGlzLm5hdGl2ZUFwcC5zZXRJbnRlcnZhbDtcbiAgICB0aGlzLmNsZWFySW50ZXJ2YWwgPSB0aGlzLm5hdGl2ZUFwcC5jbGVhckludGVydmFsO1xuICAgIHRoaXMuY2xlYXJUaW1lb3V0ID0gdGhpcy5uYXRpdmVBcHAuY2xlYXJUaW1lb3V0O1xuXG4gICAgdGhpcy5hZGRJbnRlcm5hbEV2ZW50TGlzdGVuZXJzKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgaW5pdEV4dHJhKG9wdGlvbnM6IEFwcFByb3h5UGFyYW1zPE5hdGl2ZUFwcFByb3h5Pikge1xuICAgIGNvbnN0IHsgbHlueCB9ID0gb3B0aW9ucztcblxuICAgIHRoaXMubW9kdWxlcyA9IHt9O1xuICAgIHRoaXMuX2xhenlDYWxsYWJsZU1vZHVsZXMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fbmF0aXZlQXBwID0gQ2FjaGVkRnVuY3Rpb25Qcm94eS5jcmVhdGU8TmF0aXZlQXBwUHJveHk+KFxuICAgICAgdGhpcy5fbmF0aXZlQXBwXG4gICAgKTtcbiAgICB0aGlzLnNoYXJlZENvbnNvbGUgPSBjcmVhdGVTaGFyZWRDb25zb2xlKGBydW50aW1lSWQ6JHt0aGlzLm5hdGl2ZUFwcElkfWApO1xuICAgIHRoaXMuZHluYW1pY0NvbXBvbmVudEV4cG9ydHMgPSB7fTtcbiAgICB0aGlzLmxvYWRlZER5bmFtaWNDb21wb25lbnRzU2V0ID0gbmV3IFNldCgpO1xuICAgIHRoaXMuX2xhenlDYWxsYWJsZU1vZHVsZXMgPSBuZXcgTWFwKCk7XG5cbiAgICB0aGlzLlJlcG9ydGVyID0gbmV3IFJlcG9ydGVyKFxuICAgICAgKCkgPT4gdGhpcyxcbiAgICAgICgpID0+IHRoaXMubmF0aXZlQXBwXG4gICAgKTtcblxuICAgIC8vIGluaXQgZXZlbnRFbWl0dGVyXG4gICAgdGhpcy5HbG9iYWxFdmVudEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKFxuICAgICAgdGhpcy5fX2ludGVybmFsX19jYWxsTHlueFNldE1vZHVsZS5iaW5kKHRoaXMpXG4gICAgKTtcbiAgICB0aGlzLl9pbnRlcnNlY3Rpb25PYnNlcnZlck1hbmFnZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXJNYW5hZ2VyKFxuICAgICAgdGhpcy5OYXRpdmVNb2R1bGVzXG4gICAgKTtcblxuICAgIHRoaXMuX2V4cG9zdXJlTWFuYWdlciA9IG5ldyBFeHBvc3VyZU1hbmFnZXIodGhpcy5OYXRpdmVNb2R1bGVzKTtcbiAgICB0aGlzLnNldHVwRXhwb3N1cmVBcGkoKTtcbiAgICB0aGlzLl9hb3BNYW5hZ2VyID0gbmV3IEFvcE1hbmFnZXIoKTtcbiAgICB0aGlzLmJlZm9yZVB1Ymxpc2hFdmVudCA9IHRoaXMuX2FvcE1hbmFnZXIuX2JlZm9yZVB1Ymxpc2hFdmVudDtcblxuICAgIHRoaXMucGVyZm9ybWFuY2UgPSBuZXcgUGVyZm9ybWFuY2UodGhpcy5HbG9iYWxFdmVudEVtaXR0ZXIsIHRoaXMubmF0aXZlQXBwKTtcblxuICAgIGNvbnN0IHByb21pc2VDdG9yID0gdGhpcy5zZXR1cFByb21pc2UoXG4gICAgICB0aGlzLm5hdGl2ZUFwcC5zZXRUaW1lb3V0LFxuICAgICAgdGhpcy5uYXRpdmVBcHAuY2xlYXJUaW1lb3V0LFxuICAgICAgbHlueFxuICAgICk7XG5cbiAgICB0aGlzLmx5bnggPSB0aGlzLmNyZWF0ZUx5bngobHlueCwgcHJvbWlzZUN0b3IpO1xuICAgIHRoaXMuc2V0dXBKU01vZHVsZSgpO1xuICAgIHRoaXMuc2V0dXBJbnRlcnNlY3Rpb25BcGkoKTtcbiAgICB0aGlzLnNldHVwRmV0Y2hBUEkocHJvbWlzZUN0b3IpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGluaXRCYXNlKG9wdGlvbnM6IEFwcFByb3h5UGFyYW1zPE5hdGl2ZUFwcFByb3h5Pikge1xuICAgIGNvbnN0IHsgbmF0aXZlQXBwLCBwYXJhbXMgfSA9IG9wdGlvbnM7XG5cbiAgICAvLyBpbml0IGlkICYgbG9hZENhcmRQYXJhbVxuICAgIHRoaXMubmF0aXZlQXBwSWQgPSBuYXRpdmVBcHAuaWQ7XG4gICAgdGhpcy5fcGFyYW1zID0gcGFyYW1zO1xuICAgIHRoaXMuX25hdGl2ZUFwcCA9IG5hdGl2ZUFwcDtcblxuICAgIC8vIGluaXQgbmF0aXZlIE5hdGl2ZU1vZHVsZXNcbiAgICB0aGlzLk5hdGl2ZU1vZHVsZXMgPSBuYXRpdmVBcHAubmF0aXZlTW9kdWxlUHJveHk7XG4gICAgdGhpcy5MeW54VUlNZXRob2RNb2R1bGUgPSBuYXRpdmVBcHAubmF0aXZlTW9kdWxlUHJveHkuTHlueFVJTWV0aG9kTW9kdWxlO1xuICAgIHRoaXMuTHlueFRlc3RNb2R1bGUgPSBuYXRpdmVBcHAubmF0aXZlTW9kdWxlUHJveHkuTHlueFRlc3RNb2R1bGU7XG4gICAgdGhpcy5MeW54UmVzb3VyY2VNb2R1bGUgPSBuYXRpdmVBcHAubmF0aXZlTW9kdWxlUHJveHkuTHlueFJlc291cmNlTW9kdWxlO1xuICAgIHRoaXMuTHlueEFjY2Vzc2liaWxpdHlNb2R1bGUgPVxuICAgICAgbmF0aXZlQXBwLm5hdGl2ZU1vZHVsZVByb3h5Lkx5bnhBY2Nlc3NpYmlsaXR5TW9kdWxlO1xuICAgIHRoaXMuTHlueFNldE1vZHVsZSA9IG5hdGl2ZUFwcC5uYXRpdmVNb2R1bGVQcm94eS5MeW54U2V0TW9kdWxlO1xuXG4gICAgLy9pbml0IGFwcExpc3RcbiAgICB0aGlzLl9hcGlMaXN0ID0ge307XG4gICAgdGhpcy5fdGV4dEluZm9NYW5hZ2VyID0gbmV3IFRleHRJbmZvTWFuYWdlcih0aGlzLk5hdGl2ZU1vZHVsZXMpO1xuICAgIHRoaXMuc2V0dXBHZXRUZXh0SW5mb0FwaSgpO1xuICB9XG5cbiAgc3RhdGljIGtEZWZhdWx0U291cmNlTWFwVVJMID0gJ2RlZmF1bHQnO1xuICBzdGF0aWMga0dldFNvdXJjZU1hcFJlbGVhc2VFcnJvck5hbWUgPSBTT1VSQ0VfTUFQX1JFTEVBU0VfRVJST1JfTkFNRTtcbiAgLyoqXG4gICAqIGxlZ2FjeSBzb3VyY2VtYXAgcmVsZWFzZSB1c2UgdXJsIGRlZmF1bHRcbiAgICogdXNlZCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgKlxuICAgKiBuZXcgdGVtcGxhdGUgc2hvdWxkIHVzZSBzZXRTb3VyY2VNYXBSZWxlYXNlXG4gICAqL1xuICBzZXQgX19zb3VyY2VtYXBfX3JlbGVhc2VfXyhyZWxlYXNlOiBzdHJpbmcpIHtcbiAgICBsZXQgZXJyb3IgPSBuZXcgRXJyb3IoKTtcbiAgICBlcnJvci5uYW1lID0gJ0x5bnhHZXRTb3VyY2VNYXBSZWxlYXNlRXJyb3InO1xuICAgIGVycm9yLm1lc3NhZ2UgPSByZWxlYXNlO1xuICAgIGVycm9yLnN0YWNrID0gYGF0IDxhbm9ueW1vdXM+ICgke0Jhc2VBcHAua0RlZmF1bHRTb3VyY2VNYXBVUkx9OjE6MSlgO1xuICAgIHRoaXMuc2V0U291cmNlTWFwUmVsZWFzZShlcnJvcik7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHNvdXJjZW1hcCByZWxlYXNlIHdpdGggYSBuZXdseSB0aHJvd24gZXJyb3JcbiAgICogQHBhcmFtIHtFcnJvcn0gZXJyb3JcbiAgICogVGhlIGVycm9yIHRocm93biBmcm9tIHRoZSBmaWxlIHRoYXQgd2FudHMgdG8gc2V0IHNvdXJjZW1hcCByZWxlYXNlLlxuICAgKiBUaGUgdG9wIGZyYW1lIG9mIGBlcnJvci5zdGFja2AgKiptdXN0IGJlKiogdGhlIGZpbGVuYW1lLlxuICAgKiBUaGUgYGVycm9yLm5hbWVgICoqbXVzdCBiZSoqIGAnTHlueEdldFNvdXJjZU1hcFJlbGVhc2VFcnJvcidgLlxuICAgKiBUaGUgYGVycm9yLm1lc3NhZ2VgICoqbXVzdCBiZSoqIHRoZSBzb3VyY2VtYXAgcmVsZWFzZS5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogKGZ1bmN0aW9uICgpIHtcbiAgICogICB0cnkge1xuICAgKiAgICAgdGhyb3cgbmV3IEVycm9yKHNvdXJjZW1hcFJlbGVhc2UpO1xuICAgKiAgIH0gY2F0Y2ggKGUpIHtcbiAgICogICAgIGUubmFtZSA9ICdMeW54R2V0U291cmNlTWFwUmVsZWFzZUVycm9yJztcbiAgICogICAgIHR0LnNldFNvdXJjZU1hcFJlbGVhc2UoZSk7XG4gICAqICAgfVxuICAgKiB9KSgpXG4gICAqL1xuICBzZXRTb3VyY2VNYXBSZWxlYXNlID0gKGVycm9yOiBFcnJvcikgPT4ge1xuICAgIHRoaXMuUmVwb3J0ZXIuc2V0U291cmNlTWFwUmVsZWFzZShlcnJvcik7XG4gIH07XG5cbiAgZ2V0U291cmNlTWFwUmVsZWFzZSA9ICh1cmw6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgcmV0dXJuIHRoaXMuUmVwb3J0ZXIuZ2V0U291cmNlTWFwUmVsZWFzZSh1cmwpO1xuICB9O1xuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5fX3JlbW92ZUludGVybmFsRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLl9uYXRpdmVBcHAgPSBudWxsO1xuICAgIHRoaXMuX3BhcmFtcyA9IG51bGw7XG4gICAgdGhpcy5fbGF6eUNhbGxhYmxlTW9kdWxlcyA9IG51bGw7XG4gICAgdGhpcy5HbG9iYWxFdmVudEVtaXR0ZXIgPSBudWxsO1xuICB9XG5cbiAgcmVnaXN0ZXJNb2R1bGUobmFtZTogc3RyaW5nLCBtb2R1bGU6IG9iamVjdCk6IHZvaWQge1xuICAgIHRoaXMuX2xhenlDYWxsYWJsZU1vZHVsZXNbbmFtZV0gPSBtb2R1bGU7XG4gIH1cblxuICBnZXRKU01vZHVsZTxNb2R1bGUgPSB1bmtub3duPihuYW1lOiBzdHJpbmcpOiBNb2R1bGUge1xuICAgIHJldHVybiB0aGlzLl9sYXp5Q2FsbGFibGVNb2R1bGVzW25hbWVdO1xuICB9XG5cbiAgc2V0dXBKU01vZHVsZSgpIHtcbiAgICB0aGlzLnJlZ2lzdGVyTW9kdWxlKCdHbG9iYWxFdmVudEVtaXR0ZXInLCB0aGlzLkdsb2JhbEV2ZW50RW1pdHRlcik7XG4gICAgdGhpcy5yZWdpc3Rlck1vZHVsZSgnUmVwb3J0ZXInLCB0aGlzLlJlcG9ydGVyKTtcbiAgfVxuXG4gIHNldHVwRmV0Y2hBUEkoUHJvbWlzZTogUHJvbWlzZUNvbnN0cnVjdG9yKSB7XG4gICAgdGhpcy5fY3JlYXRlUmVzcG9uc2VDbGFzcyA9IGNyZWF0ZVJlc3BvbnNlQ2xhc3M7XG4gICAgdGhpcy5fY3JlYXRlUmVxdWVzdENsYXNzID0gY3JlYXRlUmVxdWVzdENsYXNzO1xuICAgIHRoaXMuX1JlcXVlc3RDbGFzcyA9IG5hdGl2ZUdsb2JhbC5SZXF1ZXN0ID8/IGNyZWF0ZVJlcXVlc3RDbGFzcyhQcm9taXNlKTtcbiAgICB0aGlzLl9SZXNwb25zZUNsYXNzID0gbmF0aXZlR2xvYmFsLlJlc3BvbnNlID8/IGNyZWF0ZVJlc3BvbnNlQ2xhc3MoUHJvbWlzZSk7XG5cbiAgICBpZiAoIW5hdGl2ZUdsb2JhbC5SZXF1ZXN0KSB7XG4gICAgICBuYXRpdmVHbG9iYWwuUmVxdWVzdCA9IHRoaXMuX1JlcXVlc3RDbGFzcztcbiAgICB9XG4gICAgaWYgKCFuYXRpdmVHbG9iYWwuUmVzcG9uc2UpIHtcbiAgICAgIG5hdGl2ZUdsb2JhbC5SZXNwb25zZSA9IHRoaXMuX1Jlc3BvbnNlQ2xhc3M7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfX2ludGVybmFsX19jYWxsTHlueFNldE1vZHVsZShmdW5jdGlvbk5hbWU6IHN0cmluZywgcGF5bG9hZDogYW55W10pIHtcbiAgICBjb25zdCBuYXRpdmVGdW5jdGlvbiA9IHRoaXMuTHlueFNldE1vZHVsZVtmdW5jdGlvbk5hbWVdO1xuICAgIGlmIChuYXRpdmVGdW5jdGlvbikge1xuICAgICAgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwobmF0aXZlRnVuY3Rpb24sIHVuZGVmaW5lZCwgcGF5bG9hZCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IG5hdGl2ZUFwcCgpOiBOYXRpdmVBcHBQcm94eSB7XG4gICAgcmV0dXJuIHRoaXMuX25hdGl2ZUFwcDtcbiAgfVxuXG4gIHNldCBuYXRpdmVBcHAobmF0aXZlQXBwOiBOYXRpdmVBcHBQcm94eSkge1xuICAgIHRoaXMuX25hdGl2ZUFwcCA9IG5hdGl2ZUFwcDtcbiAgfVxuXG4gIGdldCBwYXJhbXMoKTogbG9hZENhcmRQYXJhbXMge1xuICAgIHJldHVybiB0aGlzLl9wYXJhbXM7XG4gIH1cblxuICBzZXQgYXBpTGlzdChhcGk6IG9iamVjdCkge1xuICAgIHRoaXMuX2FwaUxpc3QgPSB7IC4uLnRoaXMuX2FwaUxpc3QsIC4uLmFwaSB9O1xuICB9XG5cbiAgc2V0dXBJbnRlcnNlY3Rpb25BcGkoKSB7XG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuX2FwaUxpc3RbJ2NyZWF0ZUludGVyc2VjdGlvbk9ic2VydmVyJ10gPSBmdW5jdGlvbiAoXG4gICAgICBjb21wb25lbnQ6IHsgY29tcG9uZW50SWQ6IHN0cmluZyB9ICYgeyBba2V5OiBzdHJpbmddOiBhbnkgfSxcbiAgICAgIG9wdGlvbnM/OiB7XG4gICAgICAgIHRocmVzaG9sZHM/OiBbXTtcbiAgICAgICAgaW5pdGlhbFJhdGlvPzogbnVtYmVyO1xuICAgICAgICBvYnNlcnZlQWxsPzogYm9vbGVhbjtcbiAgICAgIH1cbiAgICApIHtcbiAgICAgIGNvbnN0IHsgY29tcG9uZW50SWQgPSAnJyB9ID0gY29tcG9uZW50O1xuICAgICAgcmV0dXJuIHNlbGYuX2ludGVyc2VjdGlvbk9ic2VydmVyTWFuYWdlci5jcmVhdGVJbnRlcnNlY3Rpb25PYnNlcnZlcihcbiAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgIG9wdGlvbnNcbiAgICAgICk7XG4gICAgfTtcbiAgICB0aGlzLmx5bnhbJ2NyZWF0ZUludGVyc2VjdGlvbk9ic2VydmVyJ10gPSB0aGlzLl9hcGlMaXN0W1xuICAgICAgJ2NyZWF0ZUludGVyc2VjdGlvbk9ic2VydmVyJ1xuICAgIF0gYXMgQ3JlYXRlSW50ZXJzZWN0aW9uT2JzZXJ2ZXJGdW5jO1xuICB9XG5cbiAgb25JbnRlcnNlY3Rpb25PYnNlcnZlckV2ZW50KFxuICAgIG9ic2VydmVySWQ6IG51bWJlcixcbiAgICBjYWxsYmFja0lkOiBudW1iZXIsXG4gICAgZGF0YTogUmVjb3JkPGFueSwgYW55PlxuICApOiB2b2lkIHtcbiAgICBjb25zdCBvYnNlcnZlciA9IHRoaXMuX2ludGVyc2VjdGlvbk9ic2VydmVyTWFuYWdlci5nZXRPYnNlcnZlcihvYnNlcnZlcklkKTtcbiAgICBpZiAob2JzZXJ2ZXIpIHtcbiAgICAgIG9ic2VydmVyLmludm9rZUNhbGxiYWNrKGNhbGxiYWNrSWQsIGRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIHNldHVwR2V0VGV4dEluZm9BcGkgPSAoKTogdm9pZCA9PiB7XG4gICAgdGhpcy5fYXBpTGlzdFsnZ2V0VGV4dEluZm8nXSA9IChcbiAgICAgIHRleHQ6IFN0cmluZyxcbiAgICAgIG9wdGlvbnM/OiBUZXh0SW5mb1xuICAgICk6IFRleHRNZXRyaWNzID0+IHtcbiAgICAgIHJldHVybiB0aGlzLl90ZXh0SW5mb01hbmFnZXIuZ2V0VGV4dEluZm8odGV4dCwgb3B0aW9ucyk7XG4gICAgfTtcbiAgfTtcblxuICBzZXR1cEV4cG9zdXJlQXBpID0gKCk6IHZvaWQgPT4ge1xuICAgIHRoaXMuX2FwaUxpc3RbJ3Jlc3VtZUV4cG9zdXJlJ10gPSAoKTogdm9pZCA9PiB7XG4gICAgICB0aGlzLl9leHBvc3VyZU1hbmFnZXIucmVzdW1lRXhwb3N1cmUoKTtcbiAgICB9O1xuICAgIHRoaXMuX2FwaUxpc3RbJ3N0b3BFeHBvc3VyZSddID0gKG9wdGlvbnM/OiB7XG4gICAgICBzZW5kRXZlbnQ/OiBib29sZWFuO1xuICAgIH0pOiB2b2lkID0+IHtcbiAgICAgIHRoaXMuX2V4cG9zdXJlTWFuYWdlci5zdG9wRXhwb3N1cmUoXG4gICAgICAgIG9wdGlvbnMgPyBvcHRpb25zIDogeyBzZW5kRXZlbnQ6IHRydWUgfVxuICAgICAgKTtcbiAgICB9O1xuICAgIHRoaXMuX2FwaUxpc3RbJ3NldE9ic2VydmVyRnJhbWVSYXRlJ10gPSAob3B0aW9ucz86IHtcbiAgICAgIGZvclBhZ2VSZWN0PzogbnVtYmVyO1xuICAgICAgZm9yRXhwb3N1cmVDaGVjaz86IG51bWJlcjtcbiAgICB9KTogdm9pZCA9PiB7XG4gICAgICB0aGlzLl9leHBvc3VyZU1hbmFnZXIuc2V0T2JzZXJ2ZXJGcmFtZVJhdGUoXG4gICAgICAgIG9wdGlvbnMgPyBvcHRpb25zIDogeyBmb3JQYWdlUmVjdDogMjAsIGZvckV4cG9zdXJlQ2hlY2s6IDIwIH1cbiAgICAgICk7XG4gICAgfTtcbiAgfTtcblxuICByZXBvcnRFcnJvcihlcnJvcjogRXJyb3IpIHtcbiAgICByZXR1cm4gdGhpcy5seW54LnJlcG9ydEVycm9yKGVycm9yKTtcbiAgfVxuXG4gIGhhbmRsZUVycm9yKFxuICAgIGVycm9yOiBCYXNlRXJyb3IsXG4gICAgb3JpZ2luRXJyb3I/OiBFcnJvcixcbiAgICBlcnJvckxldmVsPzogTHlueEVycm9yTGV2ZWxcbiAgKSB7XG4gICAgcmVwb3J0RXJyb3IoZXJyb3IsIHRoaXMubmF0aXZlQXBwLCB7XG4gICAgICBvcmlnaW5FcnJvcixcbiAgICAgIGdldFNvdXJjZU1hcFJlbGVhc2U6IHRoaXMuZ2V0U291cmNlTWFwUmVsZWFzZSxcbiAgICAgIGVycm9yTGV2ZWw6IGVycm9yTGV2ZWwsXG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVVc2VyRXJyb3IoXG4gICAgZXJyb3I/OiBFcnJvcixcbiAgICBjYXVzZT86IHVua25vd24sXG4gICAgZXJyb3JMZXZlbD86IEx5bnhFcnJvckxldmVsLFxuICAgIHByZWZpeD86IHN0cmluZ1xuICApOiB2b2lkIHtcbiAgICBsZXQgeyBtZXNzYWdlLCBuYW1lLCBzdGFjayB9ID0gZXJyb3IgfHwge307XG4gICAgaWYgKCFtZXNzYWdlKSB7XG4gICAgICAvLyBJZiB0aGVyZSBpcyBubyBlcnJvciBtZXNzYWdlIGluIGVycm9yLCBtZWFucyB0aGF0IGl0IGlzIG5vdCBhbiBlcnJvci1saWtlIG9iamVjdC5cbiAgICAgIC8vIFdlIGNvbnN0cnVjdCBhIG5ldyBFcnJvciB1c2luZyBKU09OLnN0cmluZ2lmeVxuICAgICAgKHsgbWVzc2FnZSwgbmFtZSwgc3RhY2sgfSA9IG5ldyBFcnJvcihKU09OLnN0cmluZ2lmeShlcnJvcikpKTtcbiAgICB9XG4gICAgY29uc3QgdXNlckVycm9yID0gbmV3IFVzZXJSdW50aW1lRXJyb3IoXG4gICAgICBwcmVmaXggPyBgJHtwcmVmaXh9ICR7bmFtZX06ICR7bWVzc2FnZX1gIDogYCR7bmFtZX06ICR7bWVzc2FnZX1gLFxuICAgICAgc3RhY2tcbiAgICApO1xuICAgIHVzZXJFcnJvci5jYXVzZSA9IGNhdXNlO1xuICAgIHRoaXMuaGFuZGxlRXJyb3IodXNlckVycm9yLCBlcnJvciwgZXJyb3JMZXZlbCk7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBoYW5kbGVJbnRlcm5hbEVycm9yKGVycm9yPzogRXJyb3IsIGNhdXNlPzogdW5rbm93bik6IHZvaWQge1xuICAgIGxldCB7IG1lc3NhZ2UsIG5hbWUsIHN0YWNrIH0gPSBlcnJvciB8fCB7fTtcbiAgICBpZiAoIW1lc3NhZ2UpIHtcbiAgICAgIC8vIElmIHRoZXJlIGlzIG5vIGVycm9yIG1lc3NhZ2UgaW4gZXJyb3IsIG1lYW5zIHRoYXQgaXQgaXMgbm90IGFuIGVycm9yLWxpa2Ugb2JqZWN0LlxuICAgICAgLy8gV2UgY29uc3RydWN0IGEgbmV3IEVycm9yIHVzaW5nIEpTT04uc3RyaW5naWZ5XG4gICAgICAoeyBtZXNzYWdlLCBuYW1lLCBzdGFjayB9ID0gbmV3IEVycm9yKEpTT04uc3RyaW5naWZ5KGVycm9yKSkpO1xuICAgIH1cbiAgICBjb25zdCBpbnRlcm5hbEVycm9yID0gbmV3IEludGVybmFsUnVudGltZUVycm9yKFxuICAgICAgYCR7bmFtZX06ICR7bWVzc2FnZX1gLFxuICAgICAgc3RhY2tcbiAgICApO1xuICAgIGludGVybmFsRXJyb3IuY2F1c2UgPSBjYXVzZTtcbiAgICB0aGlzLmhhbmRsZUVycm9yKGludGVybmFsRXJyb3IsIGVycm9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBleHRlcm5hbCBlbnYgd2l0aCBib29sZWFuIHZhbHVlLlxuICAgKiBUaGUgc2FtZSBhcyBgYmFzZTo6THlueEVudjo6R2V0SW5zdGFuY2UoKS5HZXRCb29sRW52YFxuICAgKlxuICAgKiBAcGFyYW0ge0VudktleX0ga2V5IFRoZSB7QGxpbmsgRW52S2V5fSwgc2hvdWxkIGJlIHBsYWNlZCBpbiBgbHlueF9lbnYuaGBcbiAgICovXG4gIGdldEJvb2xFbnYoa2V5OiBFbnZLZXkpOiBib29sZWFuIHtcbiAgICBjb25zdCBlbnYgPSB0aGlzLm5hdGl2ZUFwcC5nZXRFbnYoa2V5KTtcbiAgICByZXR1cm4gZW52Py50b0xvd2VyQ2FzZSgpID09PSAndHJ1ZSc7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqIEBzdGF0aWNcbiAgICogVGhlIEx5bnhHcm91cCBsZXZlbCBjYWNoZSBmb3IgcmVxdWlyZU1vZHVsZSAsIHtAbGluayByZWdpc3Rlck1vZHVsZX1cbiAgICovXG4gIHN0YXRpYyBfJGZhY3RvcnlDYWNoZTogUmVjb3JkPFxuICAgIHN0cmluZyxcbiAgICA8VD4oaW5qZWN0ZWQ6IHsgdHQ6IEJhc2VBcHAgfSkgPT4gVFxuICA+ID0ge307XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKiBFeGVjdXRlIHRoZSBsb2FkZWQgSlMgbW9kdWxlICwgIENhbGxlZCBieSB7QGxpbmsgcmVxdWlyZU1vZHVsZX0gJiB7QGxpbmsgcmVxdWlyZU1vZHVsZUFzeW5jfVxuICAgKiBAdGhyb3dzIHtVc2VyUnVudGltZUVycm9yfSB3aGVuIGxvYWRpbmcgb3IgZXZhbHVhdGluZyBmYWlsZWRcbiAgICogQHRocm93cyB7RXJyb3J9IHdoZW4gZXhlY3V0aW5nIGZhaWxlZFxuICAgKi9cbiAgcHJpdmF0ZSBfJGV4ZWN1dGVJbml0PFQ+KFxuICAgIGV4cG9ydHM6IFJldHVyblR5cGU8TmF0aXZlQXBwWydsb2FkU2NyaXB0J10+LFxuICAgIHsgcGF0aCwgZW50cnlOYW1lIH06IHsgcGF0aDogc3RyaW5nOyBlbnRyeU5hbWU/OiBzdHJpbmcgfVxuICApOiBUIHtcbiAgICBsZXQgZmFjdG9yeTogPFQ+KGluamVjdGVkOiB7IHR0OiBCYXNlQXBwIH0pID0+IFQ7XG4gICAgaWYgKGV4cG9ydHMgJiYgZXhwb3J0cy5pbml0KSB7XG4gICAgICAvLyBhcHAtc2VydmljZS5qcyBhbmQgY29tbW9uLWNodW5rLmpzIHdpdGggbmV3IGZvcm1hdCB3aWxsIGhhdmUgaW5pdCBmdW5jdGlvblxuICAgICAgZmFjdG9yeSA9IGV4cG9ydHMuaW5pdC5iaW5kKGV4cG9ydHMpO1xuICAgIH0gZWxzZSBpZiAobmF0aXZlR2xvYmFsLmluaXRCdW5kbGUpIHtcbiAgICAgIC8vIGNvbW1vbi1jaHVuay5qcyB3aXRoIG9sZCBmb3JtYXQgd2lsbCBzZXQgZ2xvYmFsLmluaXRCdW5kbGUgZHVyaW5nIGxvYWRTY3JpcHRcbiAgICAgIGZhY3RvcnkgPSBuYXRpdmVHbG9iYWwuaW5pdEJ1bmRsZS5iaW5kKG5hdGl2ZUdsb2JhbC5pbml0QnVuZGxlKTtcbiAgICAgIGRlbGV0ZSBuYXRpdmVHbG9iYWwuaW5pdEJ1bmRsZTsgLy8gc2hvdWxkIGRlbGV0ZSBpbml0QnVuZGxlIGFmdGVyIHVzZWRcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbm8gZmFjdG9yeSBmdW5jdGlvbiBmb3VuZCwgcHJvYmFibHkgbG9hZFNjcmlwdCBmYWlsZWQuXG4gICAgICAvLyBUT0RPKHdhbmdxaW5neXUpOiBkbyBub3QgdGhyb3cgdGhpcyB3aGVuIGBuYXRpdmVBcHAubG9hZFNjcmlwdGAgc3VwcG9ydCBleGNlcHRpb25zXG4gICAgICB0aHJvdyBuZXcgVXNlclJ1bnRpbWVFcnJvcihcbiAgICAgICAgYGxvYWQgZmFpbGVkLiBwYXRoOiR7cGF0aH0sZW50cnlOYW1lOiR7ZW50cnlOYW1lfWBcbiAgICAgICk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBuYXRpdmVDb25zb2xlLnByb2ZpbGUoYHJ1bm5pbmcgJHtwYXRofSBpbml0YCk7XG4gICAgICBjb25zdCByZXQgPSBmYWN0b3J5PFQ+KHsgdHQ6IHRoaXMgfSk7XG5cbiAgICAgIC8vIEhlcmUgbWVhbnMgdGhhdCBubyBlcnJvciBvY2N1cmVkIHdoZW4gZXhlY3V0aW5nLlxuICAgICAgLy8gT25seSB0aGVuIHdlIGNhY2hlIHRoZSBmYWN0b3J5LlxuICAgICAgQmFzZUFwcC5fJGZhY3RvcnlDYWNoZVtwYXRoXSA9IGZhY3Rvcnk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0gZmluYWxseSB7XG4gICAgICBuYXRpdmVDb25zb2xlLnByb2ZpbGVFbmQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqIFVzZWQgdG8gbG9hZCB0aGUganNvbiBtb2R1bGUuIENhbGxlZCBieSB7QGxpbmsgcmVxdWlyZU1vZHVsZX0gJiB7QGxpbmsgcmVxdWlyZU1vZHVsZUFzeW5jfVxuICAgKiBAcGFyYW0gY29udGVudFxuICAgKiBAcGFyYW0gcGF0aFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcHJpdmF0ZSBfJGV4ZWN1dGVKU09OPFQ+KFxuICAgIGNvbnRlbnQ6IFJldHVyblR5cGU8TmF0aXZlQXBwWydyZWFkU2NyaXB0J10+LFxuICAgIHsgcGF0aCB9OiB7IHBhdGg6IHN0cmluZzsgZW50cnlOYW1lPzogc3RyaW5nIH1cbiAgKTogVCB7XG4gICAgY29uc3QgcmV0ID0gSlNPTi5wYXJzZShjb250ZW50KTtcbiAgICBjb25zdCBpbml0ID0gKCkgPT4gcmV0O1xuICAgIEJhc2VBcHAuXyRmYWN0b3J5Q2FjaGVbcGF0aF0gPSBpbml0O1xuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICByZXF1aXJlTW9kdWxlPFQ+KFxuICAgIHBhdGg6IHN0cmluZyxcbiAgICBlbnRyeU5hbWU/OiBzdHJpbmcsXG4gICAgb3B0aW9ucz86IHsgdGltZW91dDogbnVtYmVyIH1cbiAgKTogVCB7XG4gICAgY29uc3QgaW5pdCA9IEJhc2VBcHAuXyRmYWN0b3J5Q2FjaGVbcGF0aF07XG4gICAgaWYgKE5PREVfRU5WICE9PSAnZGV2ZWxvcG1lbnQnICYmIGluaXQpIHtcbiAgICAgIC8vIGNhY2hlIGhpdFxuICAgICAgcmV0dXJuIHRoaXMuXyRleGVjdXRlSW5pdDxUPih7IGluaXQgfSwgeyBwYXRoLCBlbnRyeU5hbWUgfSk7XG4gICAgfVxuXG4gICAgLy8gY2FjaGUgbWlzc1xuICAgIGlmIChwYXRoLnNwbGl0KCc/JylbMF0uZW5kc1dpdGgoJy5qc29uJykpIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLm5hdGl2ZUFwcC5yZWFkU2NyaXB0KHBhdGgsIHtcbiAgICAgICAgZHluYW1pY0NvbXBvbmVudEVudHJ5OiBlbnRyeU5hbWUgPz8gREVGQVVMVF9FTlRSWSxcbiAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXMuXyRleGVjdXRlSlNPTihjb250ZW50LCB7IHBhdGgsIGVudHJ5TmFtZSB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBleHBvcnRzID0gdGhpcy5uYXRpdmVBcHAubG9hZFNjcmlwdChwYXRoLCBlbnRyeU5hbWUsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzLl8kZXhlY3V0ZUluaXQ8VD4oZXhwb3J0cywgeyBwYXRoLCBlbnRyeU5hbWUgfSk7XG4gIH1cblxuICByZXF1aXJlTW9kdWxlQXN5bmM8VD4oXG4gICAgcGF0aDogc3RyaW5nLFxuICAgIGNhbGxiYWNrOiAoZXJyb3I/OiBFcnJvciwgZXhwb3J0cz86IFQpID0+IHZvaWRcbiAgKTogdm9pZCB7XG4gICAgY29uc3QgaW5pdCA9IEJhc2VBcHAuXyRmYWN0b3J5Q2FjaGVbcGF0aF07XG4gICAgaWYgKE5PREVfRU5WICE9PSAnZGV2ZWxvcG1lbnQnICYmIGluaXQpIHtcbiAgICAgIC8vIGNhY2hlIGhpdFxuICAgICAgY2FsbGJhY2sobnVsbCwgdGhpcy5fJGV4ZWN1dGVJbml0PFQ+KHsgaW5pdCB9LCB7IHBhdGggfSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBjYWNoZSBtaXNzXG4gICAgaWYgKHBhdGguc3BsaXQoJz8nKVswXS5lbmRzV2l0aCgnLmpzb24nKSkge1xuICAgICAgY29uc3QgY29udGVudCA9IHRoaXMubmF0aXZlQXBwLnJlYWRTY3JpcHQocGF0aCk7XG4gICAgICBjb25zdCByZXQgPSB0aGlzLl8kZXhlY3V0ZUpTT048VD4oY29udGVudCwgeyBwYXRoIH0pO1xuICAgICAgY2FsbGJhY2sobnVsbCwgcmV0KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgYW4gZXJyb3IgaGVyZSB0byBtYWtlIHN1cmUgdGhlIHN0YWNrIGNvbnRhaW5zXG4gICAgLy8gbHlueC5yZXF1aXJlTW9kdWxlQXN5bmMgYW5kIGl0J3MgY2FsbGVyLlxuICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKCk7XG4gICAgdGhpcy5uYXRpdmVBcHAubG9hZFNjcmlwdEFzeW5jKHBhdGgsIChtZXNzYWdlLCBleHBvcnRzKTogdm9pZCA9PiB7XG4gICAgICBpZiAobWVzc2FnZSkge1xuICAgICAgICBlcnJvci5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICAgICAgLy8gT25seSBvdmVycmlkZSBlcnJvci5tZXNzYWdlIHNvIHRoYXQgd2UgY291bGQgcHJpdmlkZSBzdGFjayB3aXRoXG4gICAgICAgIC8vIGx5bngucmVxdWlyZU1vZHVsZUFzeW5jIGFuZCBpdCdzIGNhbGxlci5cbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycm9yKTtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHRoaXMuXyRleGVjdXRlSW5pdChleHBvcnRzLCB7IHBhdGggfSkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXF1aXJlKHBhdGg6IHN0cmluZywgcGFyYW1zPzogcmVxdWlyZVBhcmFtT2JqKSB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdyZXF1aXJlIGFyZ3MgbXVzdCBiZSBhIHN0cmluZycpO1xuICAgIH1cbiAgICBjb25zdCBlbnRyeU5hbWUgPVxuICAgICAgcGFyYW1zICYmIHBhcmFtcy5keW5hbWljQ29tcG9uZW50RW50cnlcbiAgICAgICAgPyBwYXJhbXMuZHluYW1pY0NvbXBvbmVudEVudHJ5XG4gICAgICAgIDogREVGQVVMVF9FTlRSWTtcbiAgICBpZiAoIXRoYXQubW9kdWxlc1tlbnRyeU5hbWVdKSB7XG4gICAgICB0aGF0Lm1vZHVsZXNbZW50cnlOYW1lXSA9IHt9O1xuICAgIH1cbiAgICBsZXQgbW9kdWxlID0gdGhhdC5tb2R1bGVzW2VudHJ5TmFtZV1bcGF0aF07XG4gICAgaWYgKCFtb2R1bGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcbiAgICAgICAgY29uc3QgdHQgPSB0aGF0O1xuICAgICAgICBjb25zdCBqc0NvbnRlbnQgPSB0aGF0Ll9uYXRpdmVBcHAucmVhZFNjcmlwdChwYXRoLCB7XG4gICAgICAgICAgZHluYW1pY0NvbXBvbmVudEVudHJ5OiBlbnRyeU5hbWUsXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXZhbFxuICAgICAgICBldmFsKGpzQ29udGVudCk7XG4gICAgICAgIG1vZHVsZSA9IHRoYXQubW9kdWxlc1tlbnRyeU5hbWVdW3BhdGhdO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aGlzLmhhbmRsZUVycm9yKFxuICAgICAgICAgIG5ldyBVc2VyUnVudGltZUVycm9yKFxuICAgICAgICAgICAgYGV2YWwgdXNlcjogJHt0aGF0Ll9uYXRpdmVBcHAuaWR9IGVycm9yOiAke2UubWVzc2FnZX1gLFxuICAgICAgICAgICAgZS5zdGFja1xuICAgICAgICAgICksXG4gICAgICAgICAgZVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoYXQubW9kdWxlc1tlbnRyeU5hbWVdW3BhdGhdKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgbW9kdWxlICR7cGF0aH0gaW4gJHtlbnRyeU5hbWV9IGlzIG5vdCBkZWZpbmVkIGluIGNhcmQ6ICR7dGhhdC5fbmF0aXZlQXBwLmlkfWBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIW1vZHVsZS5oYXNSdW4pIHtcbiAgICAgIGNvbnN0IHsgZmFjdG9yeSB9ID0gbW9kdWxlO1xuICAgICAgY29uc3QgX21vZHVsZSA9IHtcbiAgICAgICAgZXhwb3J0czoge30sXG4gICAgICB9O1xuICAgICAgbGV0IHJlcztcblxuICAgICAgbW9kdWxlLmhhc1J1biA9IHRydWU7XG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IF9tb2R1bGUuZXhwb3J0cztcbiAgICAgIGlmICh0eXBlb2YgZmFjdG9yeSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjb25zdCBpblJlcXVpcmVDb3B5ID0gaW5SZXF1aXJlLmNhbGwodGhhdCwgcGF0aCk7XG4gICAgICAgIGNvbnN0IHR0ID0gdGhhdDtcbiAgICAgICAgcmVzID0gZmFjdG9yeShcbiAgICAgICAgICBpblJlcXVpcmVDb3B5LFxuICAgICAgICAgIF9tb2R1bGUsXG4gICAgICAgICAgX21vZHVsZS5leHBvcnRzLFxuICAgICAgICAgIHRoYXQuQ2FyZC5iaW5kKHR0KSxcbiAgICAgICAgICB0aGF0LnNldFRpbWVvdXQsXG4gICAgICAgICAgdGhhdC5zZXRJbnRlcnZhbCxcbiAgICAgICAgICB0aGF0LmNsZWFySW50ZXJ2YWwsXG4gICAgICAgICAgdGhhdC5jbGVhclRpbWVvdXQsXG4gICAgICAgICAgdGhhdC5OYXRpdmVNb2R1bGVzLFxuICAgICAgICAgIHRoYXQuX2FwaUxpc3QsXG4gICAgICAgICAgdGhhdC5zaGFyZWRDb25zb2xlLFxuICAgICAgICAgIHRoYXQuQ29tcG9uZW50LmJpbmQodHQpLFxuICAgICAgICAgIHBhcmFtcz8uUmVhY3RMeW54LFxuICAgICAgICAgIHRoYXQubmF0aXZlQXBwSWQsXG4gICAgICAgICAgdGhhdC5CZWhhdmlvci5iaW5kKHR0KSxcbiAgICAgICAgICBMeW54SlNCSSxcbiAgICAgICAgICB0aGF0Lmx5bngsXG4gICAgICAgICAgdW5kZWZpbmVkLCAvLyB3aW5kb3dcbiAgICAgICAgICB1bmRlZmluZWQsIC8vIGRvY3VtZW50XG4gICAgICAgICAgdW5kZWZpbmVkLCAvLyBmcmFtZXNcbiAgICAgICAgICB1bmRlZmluZWQsIC8vIHNlbGZcbiAgICAgICAgICB1bmRlZmluZWQsIC8vIGxvY2F0aW9uXG4gICAgICAgICAgdW5kZWZpbmVkLCAvLyBuYXZpZ2F0b3JcbiAgICAgICAgICB1bmRlZmluZWQsIC8vIGxvY2FsU3RvcmFnZVxuICAgICAgICAgIHVuZGVmaW5lZCwgLy8gaGlzdG9yeVxuICAgICAgICAgIHVuZGVmaW5lZCwgLy8gQ2FjaGVzXG4gICAgICAgICAgdW5kZWZpbmVkLCAvLyBzY3JlZW5cbiAgICAgICAgICB1bmRlZmluZWQsIC8vIGFsZXJ0XG4gICAgICAgICAgdW5kZWZpbmVkLCAvLyBjb25maXJtXG4gICAgICAgICAgdW5kZWZpbmVkLCAvLyBwcm9tcHRcbiAgICAgICAgICB0aGF0Lmx5bnguZmV0Y2gsIC8vIGZldGNoXG4gICAgICAgICAgdW5kZWZpbmVkLCAvLyBYTUxIdHRwUmVxdWVzdFxuICAgICAgICAgIHVuZGVmaW5lZCwgLy8gV2ViU29ja2V0XG4gICAgICAgICAgdW5kZWZpbmVkLCAvLyB3ZWJraXRcbiAgICAgICAgICB1bmRlZmluZWQsIC8vIFJlcG9ydGVyXG4gICAgICAgICAgdW5kZWZpbmVkLCAvLyBwcmludFxuICAgICAgICAgIHVuZGVmaW5lZCwgLy8gZ2xvYmFsXG4gICAgICAgICAgdGhhdC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUsXG4gICAgICAgICAgdGhhdC5jYW5jZWxBbmltYXRpb25GcmFtZVxuICAgICAgICApO1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IF9tb2R1bGUuZXhwb3J0cyB8fCByZXM7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiAgfVxuXG4gIGRlZmluZShwYXRoOiBzdHJpbmcsIGZhY3Rvcnk6IEFNREZhY3RvcnksIGVudHJ5TmFtZT86IHN0cmluZykge1xuICAgIGVudHJ5TmFtZSA9IGVudHJ5TmFtZSA/IGVudHJ5TmFtZSA6IERFRkFVTFRfRU5UUlk7XG4gICAgaWYgKCF0aGlzLm1vZHVsZXNbZW50cnlOYW1lXSkge1xuICAgICAgdGhpcy5tb2R1bGVzW2VudHJ5TmFtZV0gPSB7fTtcbiAgICB9XG4gICAgdGhpcy5tb2R1bGVzW2VudHJ5TmFtZV1bcGF0aF0gPSB7XG4gICAgICBoYXNSdW46IGZhbHNlLFxuICAgICAgZmFjdG9yeTogZmFjdG9yeS5iaW5kKHRoaXMpLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ2FsbCBCeSBOYXRpdmUganNfYXBwXG4gICAqIEBpbnRlcm5hbFxuICAgKiBAcGFyYW0gbW9kdWxlXG4gICAqIEBwYXJhbSBtZXRob2RcbiAgICogQHBhcmFtIGFyZ3NcbiAgICovXG4gIGNhbGxGdW5jdGlvbihtb2R1bGU6IHN0cmluZywgbWV0aG9kOiBzdHJpbmcsIGFyZ3M/OiB1bmtub3duW10pOiB2b2lkIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgbW9kdWxlTWV0aG9kcyA9IHRoaXMuZ2V0SlNNb2R1bGUobW9kdWxlKTtcbiAgICAgIGlmICh0eXBlb2YgbW9kdWxlTWV0aG9kc1ttZXRob2RdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG1vZHVsZU1ldGhvZHNbbWV0aG9kXS5hcHBseShtb2R1bGVNZXRob2RzLCBhcmdzKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLmhhbmRsZVVzZXJFcnJvcihlLCB7IGJ5OiBgJHttb2R1bGV9LiR7bWV0aG9kfWAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGwgQnkgTmF0aXZlIGpzX2FwcFxuICAgKiBAaW50ZXJuYWxcbiAgICogQHBhcmFtIHtuZXZlcn0gXyBVc2VkIGZvciBiYWNrd2FyZCBjb21wYXRpYmxpdHksIERPIE5PVCBVU0UuXG4gICAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIHRoZSBFcnJvciBvYmplY3QgZW1pdCBieSBuYXRpdmUuXG4gICAqL1xuICBvbkFwcEVycm9yKF86IG5ldmVyLCBlcnJvcjogRXJyb3IpOiB2b2lkIHtcbiAgICB0aGlzLmhhbmRsZUludGVybmFsRXJyb3IoZXJyb3IpO1xuICB9XG5cbiAgc2F2ZUR5bmFtaWNDb21wb25lbnRFeHBvcnRzKGNvbXBvbmVudFVybCwgbW9kdWxlRXhwb3J0cykge1xuICAgIHRoaXMuZHluYW1pY0NvbXBvbmVudEV4cG9ydHNbY29tcG9uZW50VXJsXSA9IG1vZHVsZUV4cG9ydHM7XG4gIH1cblxuICBnZXREeW5hbWljQ29tcG9uZW50RXhwb3J0cyhjb21wb25lbnRVcmwpIHtcbiAgICByZXR1cm4gdGhpcy5keW5hbWljQ29tcG9uZW50RXhwb3J0c1tjb21wb25lbnRVcmxdO1xuICB9XG5cbiAgQ29tcG9uZW50KC4uLmFyZ3M6IHVua25vd25bXSk6IHZvaWQge31cblxuICBDYXJkKC4uLmFyZ3M6IHVua25vd25bXSk6IHZvaWQge31cblxuICBCZWhhdmlvcj8oLi4uYXJnczogdW5rbm93bltdKTogdm9pZCB7fVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gc2V0VGltZW91dFxuICAgKi9cbiAgd3JhcFJlcG9ydChzZXRUaW1lb3V0OiBGdW5jdGlvbiwgZGVzYzogc3RyaW5nKSB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG5cbiAgICBmdW5jdGlvbiB3cmFwUmVwb3J0KGZuOiBGdW5jdGlvbikge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIHdyYXBSZXBvcnRJbm5lciguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHRoYXQuaGFuZGxlVXNlckVycm9yKGUsIHsgYnk6IGRlc2MgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIFdyYXBUaW1lb3V0KGZuOiBGdW5jdGlvbiwgLi4uYXJnczogYW55W10pIHtcbiAgICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuY2FsbChzZXRUaW1lb3V0LCB1bmRlZmluZWQsIFtcbiAgICAgICAgd3JhcFJlcG9ydChmbiksXG4gICAgICAgIC4uLmFyZ3MsXG4gICAgICBdKTtcbiAgICB9O1xuICB9XG5cbiAgc2V0dXBQcm9taXNlKFxuICAgIHNldFRpbWVvdXQ6IEx5bnhTZXRUaW1lb3V0LFxuICAgIGNsZWFyVGltZW91dDogTHlueENsZWFyVGltZW91dCxcbiAgICBseW54OiBOYXRpdmVMeW54UHJveHlcbiAgKSB7XG4gICAgY29uc3QgUHJvbWlzZUNvbnN0cnVjdG9yID0gZ2V0UHJvbWlzZU1heWJlUG9seWZpbGwoXG4gICAgICBzZXRUaW1lb3V0LFxuICAgICAgKGlkLCByZWFzb246IEVycm9yKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHJlYXNvbikge1xuICAgICAgICAgICAgaWYgKCFyZWFzb24uc3RhY2spIHtcbiAgICAgICAgICAgICAgcmVhc29uID0gbmV3IEVycm9yKEpTT04uc3RyaW5naWZ5KHJlYXNvbikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVhc29uLm5hbWUgPSAndW5oYW5kbGVkIHJlamVjdGlvbic7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVVzZXJFcnJvcihyZWFzb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgLy8ganVzdCBpZ25vcmVcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNsZWFyVGltZW91dCxcbiAgICAgIGx5bngucXVldWVNaWNyb3Rhc2ssXG4gICAgICB0aGlzLl9wYXJhbXM/LnBhZ2VDb25maWdTdWJzZXQ/LmVuYWJsZU1pY3JvdGFza1Byb21pc2VQb2x5ZmlsbCA/PyBmYWxzZVxuICAgICk7XG4gICAgdGhpcy5yZXNvbHZlZFByb21pc2UgPSBQcm9taXNlQ29uc3RydWN0b3IucmVzb2x2ZSgpO1xuICAgIHJldHVybiBQcm9taXNlQ29uc3RydWN0b3I7XG4gIH1cblxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSAoY2FsbGJhY2s6ICgpID0+IHZvaWQpID0+XG4gICAgdGhpcy5fbmF0aXZlQXBwLnJlcXVlc3RBbmltYXRpb25GcmFtZShjYWxsYmFjayk7XG5cbiAgY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSAoYW5pbWF0aW9uSWQ6IG51bWJlcikgPT5cbiAgICB0aGlzLl9uYXRpdmVBcHAuY2FuY2VsQW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uSWQpO1xuXG4gIHByb3RlY3RlZCBhZGRJbnRlcm5hbEV2ZW50TGlzdGVuZXIoXG4gICAgY29udGV4dFByb3h5VHlwZTogQ29udGV4dFByb3h5VHlwZSxcbiAgICB0eXBlOiBzdHJpbmcsXG4gICAgbGlzdGVuZXI6IChldmVudDogTWVzc2FnZUV2ZW50KSA9PiB2b2lkXG4gICkge1xuICAgIHRoaXMuY29udGV4dFByb3h5VHlwZVRvTWV0aG9kW2NvbnRleHRQcm94eVR5cGVdKCkuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIHR5cGUsXG4gICAgICBsaXN0ZW5lclxuICAgICk7XG4gICAgdGhpcy5yZW1vdmVJbnRlcm5hbEV2ZW50TGlzdGVuZXJzQ2FsbGJhY2tzLnB1c2goKCkgPT4ge1xuICAgICAgdGhpcy5jb250ZXh0UHJveHlUeXBlVG9NZXRob2RbY29udGV4dFByb3h5VHlwZV0oKS5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICB0eXBlLFxuICAgICAgICBsaXN0ZW5lclxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhZGRJbnRlcm5hbEV2ZW50TGlzdGVuZXJzKCkge1xuICAgIGlmICghdGhpcy5jb250ZXh0UHJveHlUeXBlVG9NZXRob2QpIHtcbiAgICAgIHRoaXMuY29udGV4dFByb3h5VHlwZVRvTWV0aG9kID0ge1xuICAgICAgICBbQ29udGV4dFByb3h5VHlwZS5Db3JlQ29udGV4dF06ICgpID0+IHRoaXMubHlueC5nZXRDb3JlQ29udGV4dCgpLFxuICAgICAgICBbQ29udGV4dFByb3h5VHlwZS5EZXZUb29sXTogKCkgPT4gdGhpcy5seW54LmdldERldnRvb2woKSxcbiAgICAgICAgW0NvbnRleHRQcm94eVR5cGUuSlNDb250ZXh0XTogKCkgPT4gdGhpcy5seW54LmdldEpTQ29udGV4dCgpLFxuICAgICAgICBbQ29udGV4dFByb3h5VHlwZS5VSUNvbnRleHRdOiAoKSA9PiB0aGlzLmx5bnguZ2V0VUlDb250ZXh0KCksXG4gICAgICB9O1xuICAgIH1cblxuICAgIHRoaXMuYWRkSW50ZXJuYWxFdmVudExpc3RlbmVyKFxuICAgICAgQ29udGV4dFByb3h5VHlwZS5Db3JlQ29udGV4dCxcbiAgICAgIE1lc3NhZ2VFdmVudFR5cGUuT05fTkFUSVZFX0FQUF9SRUFEWSxcbiAgICAgICgpID0+IHtcbiAgICAgICAgdGhpcy5vbk5hdGl2ZUFwcFJlYWR5KCk7XG4gICAgICB9XG4gICAgKTtcbiAgICB0aGlzLmFkZEludGVybmFsRXZlbnRMaXN0ZW5lcihcbiAgICAgIENvbnRleHRQcm94eVR5cGUuQ29yZUNvbnRleHQsXG4gICAgICBNZXNzYWdlRXZlbnRUeXBlLk5PVElGWV9HTE9CQUxfUFJPUFNfVVBEQVRFRCxcbiAgICAgIChldmVudDogTWVzc2FnZUV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMudXBkYXRlR2xvYmFsUHJvcHMoZXZlbnQuZGF0YSk7XG4gICAgICB9XG4gICAgKTtcbiAgICB0aGlzLmFkZEludGVybmFsRXZlbnRMaXN0ZW5lcihcbiAgICAgIENvbnRleHRQcm94eVR5cGUuQ29yZUNvbnRleHQsXG4gICAgICBNZXNzYWdlRXZlbnRUeXBlLk9OX0xJRkVDWUNMRV9FVkVOVCxcbiAgICAgIChldmVudDogTWVzc2FnZUV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuT25MaWZlY3ljbGVFdmVudChldmVudC5kYXRhKTtcbiAgICAgIH1cbiAgICApO1xuICAgIHRoaXMuYWRkSW50ZXJuYWxFdmVudExpc3RlbmVyKFxuICAgICAgQ29udGV4dFByb3h5VHlwZS5Db3JlQ29udGV4dCxcbiAgICAgIE1lc3NhZ2VFdmVudFR5cGUuT05fQVBQX0ZJUlNUX1NDUkVFTixcbiAgICAgICgpID0+IHtcbiAgICAgICAgdGhpcy5vbkFwcEZpcnN0U2NyZWVuKCk7XG4gICAgICB9XG4gICAgKTtcbiAgICB0aGlzLmFkZEludGVybmFsRXZlbnRMaXN0ZW5lcihcbiAgICAgIENvbnRleHRQcm94eVR5cGUuQ29yZUNvbnRleHQsXG4gICAgICBNZXNzYWdlRXZlbnRUeXBlLk9OX0RZTkFNSUNfSlNfU09VUkNFX1BSRVBBUkVELFxuICAgICAgKGV2ZW50OiBNZXNzYWdlRXZlbnQpID0+IHtcbiAgICAgICAgbmF0aXZlR2xvYmFsLmxvYWREeW5hbWljQ29tcG9uZW50KHRoaXMsIGV2ZW50LmRhdGEpO1xuICAgICAgfVxuICAgICk7XG4gICAgdGhpcy5hZGRJbnRlcm5hbEV2ZW50TGlzdGVuZXIoXG4gICAgICBDb250ZXh0UHJveHlUeXBlLkNvcmVDb250ZXh0LFxuICAgICAgTWVzc2FnZUV2ZW50VHlwZS5PTl9BUFBfRU5URVJfRk9SRUdST1VORCxcbiAgICAgICgpID0+IHtcbiAgICAgICAgdGhpcy5vbkFwcEVudGVyRm9yZWdyb3VuZCgpO1xuICAgICAgfVxuICAgICk7XG4gICAgdGhpcy5hZGRJbnRlcm5hbEV2ZW50TGlzdGVuZXIoXG4gICAgICBDb250ZXh0UHJveHlUeXBlLkNvcmVDb250ZXh0LFxuICAgICAgTWVzc2FnZUV2ZW50VHlwZS5PTl9BUFBfRU5URVJfQkFDS0dST1VORCxcbiAgICAgICgpID0+IHtcbiAgICAgICAgdGhpcy5vbkFwcEVudGVyQmFja2dyb3VuZCgpO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIF9fcmVtb3ZlSW50ZXJuYWxFdmVudExpc3RlbmVycyA9ICgpID0+IHtcbiAgICB0aGlzLnJlbW92ZUludGVybmFsRXZlbnRMaXN0ZW5lcnNDYWxsYmFja3MuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgZigpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiAgb3ZlcnJpZGUgYnkgc3ViY2xhc3NcbiAgICogQHBhcmFtIG5ld0RhdGFcbiAgICovXG4gIHVwZGF0ZUdsb2JhbFByb3BzKG5ld0RhdGE6IG9iamVjdCk6IHZvaWQge31cblxuICAvKipcbiAgICogIG92ZXJyaWRlIGJ5IHN1YmNsYXNzXG4gICAqIEBwYXJhbSBuZXdEYXRhXG4gICAqL1xuICBPbkxpZmVjeWNsZUV2ZW50KFxuICAgIGFyZ3M6IFtcbiAgICAgIHN0cmluZyxcbiAgICAgIExpZmVFdmVudCB8IExpZmVFdmVudFtdLFxuICAgICAge1xuICAgICAgICBwcm9wcz86IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICAgICAgICBpbml0RGF0YT86IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICAgICAgICBkYXRhc2V0PzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgICAgICAgaWQ/OiBzdHJpbmc7XG4gICAgICAgIGNsYXNzTmFtZT86IHN0cmluZztcbiAgICAgICAgcGFyZW50SWQ/OiBzdHJpbmc7XG4gICAgICAgIHBhdGg/OiBzdHJpbmc7XG4gICAgICAgIGVudHJ5TmFtZT86IHN0cmluZztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGFkZGl0aW9uYWwgYXJndW1lbnRzIGxpa2UgZm9yY2VGbHVzaCBmb3IgU1NSIGNhbiBiZSBwdXQgaGVyZVxuICAgICAgICAgKi9cbiAgICAgICAgW2tleTogc3RyaW5nXTogdW5rbm93bjtcbiAgICAgIH1cbiAgICBdXG4gICk6IHZvaWQge31cblxuICAvKipcbiAgICogIG92ZXJyaWRlIGJ5IHN1YmNsYXNzXG4gICAqIEBwYXJhbSBuZXdEYXRhXG4gICAqL1xuICBvbk5hdGl2ZUFwcFJlYWR5KCk6IHZvaWQge31cblxuICAvKipcbiAgICogIG92ZXJyaWRlIGJ5IHN1YmNsYXNzXG4gICAqIEBwYXJhbSBuZXdEYXRhXG4gICAqL1xuICBvbkFwcEZpcnN0U2NyZWVuKCk6IHZvaWQge31cblxuICAvKipcbiAgICogIG92ZXJyaWRlIGJ5IHN1YmNsYXNzXG4gICAqIEBwYXJhbSBuZXdEYXRhXG4gICAqL1xuICBvbkFwcEVudGVyQmFja2dyb3VuZCgpOiB2b2lkIHt9XG5cbiAgLyoqXG4gICAqICBvdmVycmlkZSBieSBzdWJjbGFzc1xuICAgKiBAcGFyYW0gbmV3RGF0YVxuICAgKi9cbiAgb25BcHBFbnRlckZvcmVncm91bmQoKTogdm9pZCB7fVxuXG4gIGFic3RyYWN0IGNyZWF0ZUx5bngoXG4gICAgbmF0aXZlTHlueDogTmF0aXZlTHlueFByb3h5LFxuICAgIHByb21pc2VDdG9yOiBQcm9taXNlQ29uc3RydWN0b3JcbiAgKTogTHlueEltcGw7XG59XG5cbmZ1bmN0aW9uIHBhdGhQcm9jZXNzKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IG1hdGNoID0gcGF0aC5tYXRjaCgvKC4qKVxcLyhbXi9dKyk/JC8pO1xuICByZXR1cm4gbWF0Y2g/LlsxXSA/IG1hdGNoWzFdIDogJy4vJztcbn1cblxuZnVuY3Rpb24gaW5SZXF1aXJlKHBhdGg6IHN0cmluZyk6IEZ1bmN0aW9uIHtcbiAgY29uc3QgdGhhdCA9IHRoaXM7XG4gIGNvbnN0IHB3ZCA9IHBhdGhQcm9jZXNzKHBhdGgpO1xuXG4gIHJldHVybiBmdW5jdGlvbiAocGF0aCkge1xuICAgIGNvbnN0IHQgPSBbXTtcbiAgICBjb25zdCByID0gYCR7cHdkfS8ke3BhdGh9YC5zcGxpdCgnLycpO1xuICAgIGNvbnN0IGkgPSByLmxlbmd0aDtcblxuICAgIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigncmVxdWlyZSBhcmdzIG11c3QgYmUgYSBzdHJpbmcnKTtcbiAgICB9XG4gICAgZm9yIChsZXQgbyA9IDA7IG8gPCBpOyArK28pIHtcbiAgICAgIGNvbnN0IGEgPSByW29dO1xuICAgICAgaWYgKGEgIT09ICcnICYmIGEgIT09ICcuJykge1xuICAgICAgICBpZiAoYSA9PT0gJy4uJykge1xuICAgICAgICAgIGlmICh0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICBgY2FuJ3QgZmluZCBtb2R1bGUgJHtwYXRofSBpbiBhcHA6ICR7dGhhdC5fbmF0aXZlQXBwLmlkfWBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHQucG9wKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbyArIDEgPCBpICYmIHJbbyArIDFdID09PSAnLi4nID8gbysrIDogdC5wdXNoKGEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGxldCBjID0gdC5qb2luKCcvJyk7XG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tcmV0dXJuLWFzc2lnbiAqL1xuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXNlcXVlbmNlcyAqL1xuICAgIHJldHVybiBjLmVuZHNXaXRoKCcuanMnKSB8fCAoYyArPSAnLmpzJyksIHRoYXQucmVxdWlyZShjKTtcbiAgfTtcbn1cbiIsICIvLyBDb3B5cmlnaHQgMjAyNCBUaGUgTHlueCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlIFZlcnNpb24gMi4wIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZVxuLy8gTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuXG5pbXBvcnQgeyBCYXNlQXBwIH0gZnJvbSAnLi4vYXBwJztcbmltcG9ydCB7IEx5bngsIE5hdGl2ZUx5bnhQcm94eSB9IGZyb20gJy4uL2x5bngnO1xuaW1wb3J0IHsgQ2FjaGVkRnVuY3Rpb25Qcm94eSB9IGZyb20gJy4uL3V0aWwnO1xuXG5leHBvcnQgY2xhc3MgUmVhY3RBcHAgZXh0ZW5kcyBCYXNlQXBwIHtcbiAgY3JlYXRlTHlueChcbiAgICBuYXRpdmVMeW54OiBOYXRpdmVMeW54UHJveHksXG4gICAgcHJvbWlzZUN0b3I6IFByb21pc2VDb25zdHJ1Y3RvclxuICApOiBMeW54IHtcbiAgICBjb25zdCBseW54X3Byb3h5ID0gQ2FjaGVkRnVuY3Rpb25Qcm94eS5jcmVhdGUobmF0aXZlTHlueCk7XG4gICAgcmV0dXJuIG5ldyBMeW54KFxuICAgICAgKCkgPT4gdGhpcy5uYXRpdmVBcHAsXG4gICAgICAoKSA9PiB0aGlzLFxuICAgICAgcHJvbWlzZUN0b3IsXG4gICAgICAoKSA9PiBseW54X3Byb3h5XG4gICAgKTtcbiAgfVxuXG4gIGNhbGxCZWZvcmVQdWJsaXNoRXZlbnQoZXZlbnREYXRhPzogYW55KTogdm9pZCB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5fYW9wTWFuYWdlci5fYmVmb3JlUHVibGlzaEV2ZW50LmdldEV2ZW50c1NpemUoZXZlbnREYXRhLnR5cGUpICE9PSAwXG4gICAgKSB7XG4gICAgICBjb25zdCBjb3B5RGF0YSA9IHsgLi4uZXZlbnREYXRhIH07XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLl9hb3BNYW5hZ2VyLl9iZWZvcmVQdWJsaXNoRXZlbnQuZW1pdChjb3B5RGF0YS50eXBlLCBbY29weURhdGFdKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVVc2VyRXJyb3IoZSwge1xuICAgICAgICAgIGJ5OiAnY2FsbEJlZm9yZVB1Ymxpc2hFdmVudCcsXG4gICAgICAgICAgdHlwZTogKGNvcHlEYXRhIGFzIGFueSkudHlwZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCAiLy8gQ29weXJpZ2h0IDIwMjQgVGhlIEx5bnggQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSBWZXJzaW9uIDIuMCB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGVcbi8vIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cblxuaW1wb3J0IHsgREVGQVVMVF9FTlRSWSB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgeyBTaGFyZWRDb25zb2xlIH0gZnJvbSAnQGx5bngtanMvcnVudGltZS1zaGFyZWQnO1xuaW1wb3J0IHsgQXBwUHJveHlQYXJhbXMsIEJhc2VBcHAsIGxvYWRDYXJkUGFyYW1zLCBOYXRpdmVBcHAgfSBmcm9tICcuLi9hcHAnO1xuaW1wb3J0IHsgTHlueCwgTmF0aXZlTHlueFByb3h5IH0gZnJvbSAnLi4vbHlueCc7XG5pbXBvcnQge1xuICBDYWxsTHlueFNldE1vZHVsZSxcbiAgRXhwb3N1cmVNYW5hZ2VyLFxuICBJbnRlcnNlY3Rpb25PYnNlcnZlck1hbmFnZXIsXG4gIFRleHRJbmZvTWFuYWdlcixcbn0gZnJvbSAnLi4vbW9kdWxlcy9uYXRpdmVNb2R1bGVzJztcbmltcG9ydCB7IEFvcE1hbmFnZXIgfSBmcm9tICcuLi9tb2R1bGVzJztcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnLi4vbW9kdWxlcy9ldmVudCc7XG5pbXBvcnQgeyBSZXBvcnRlciB9IGZyb20gJy4uL21vZHVsZXMnO1xuaW1wb3J0IFBlcmZvcm1hbmNlIGZyb20gJy4uL21vZHVsZXMvcGVyZm9ybWFuY2UnO1xuaW1wb3J0IHsgQ2FjaGVkRnVuY3Rpb25Qcm94eSB9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHsgQU1ETW9kdWxlIH0gZnJvbSAnLi4vY29tbW9uL2FtZCc7XG5cbmV4cG9ydCBjbGFzcyBCYXNlQXBwU2luZ2xldG9uRGF0YTxcbiAgTmF0aXZlQXBwUHJveHkgZXh0ZW5kcyBOYXRpdmVBcHAgPSBOYXRpdmVBcHAsXG4gIEx5bnhJbXBsIGV4dGVuZHMgTHlueCA9IEx5bnhcbj4ge1xuICBuYXRpdmVBcHA6IE5hdGl2ZUFwcFByb3h5O1xuICBzaGFyZWRDb25zb2xlOiBTaGFyZWRDb25zb2xlO1xuICBkeW5hbWljQ29tcG9uZW50RXhwb3J0czogb2JqZWN0O1xuICBsb2FkZWREeW5hbWljQ29tcG9uZW50c1NldDogU2V0PHN0cmluZz47XG4gIGludGVyc2VjdGlvbk9ic2VydmVyTWFuYWdlcjogSW50ZXJzZWN0aW9uT2JzZXJ2ZXJNYW5hZ2VyO1xuICBleHBvc3VyZU1hbmFnZXI6IEV4cG9zdXJlTWFuYWdlcjtcbiAgdGV4dEluZm9NYW5hZ2VyOiBUZXh0SW5mb01hbmFnZXI7XG4gIGdsb2JhbEV2ZW50RW1pdHRlcjogRXZlbnRFbWl0dGVyO1xuICBhb3BNYW5hZ2VyOiBBb3BNYW5hZ2VyO1xuICBwZXJmb3JtYW5jZTogUGVyZm9ybWFuY2U7XG4gIG1vZHVsZXM6IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIEFNRE1vZHVsZT4+O1xuICBsYXp5Q2FsbGFibGVNb2R1bGVzOiBNYXA8c3RyaW5nLCB1bmtub3duPjtcbiAgbHlueDogTHlueEltcGw7XG4gIGFwaUxpc3Q6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICBSZXBvcnRlcjogUmVwb3J0ZXI7XG4gIHJlc29sdmVkUHJvbWlzZTogUHJvbWlzZTx2b2lkPjtcblxuICBwdWJsaWMgdHJhbnNmZXJTaW5nbGV0b25EYXRhKFxuICAgIGJhc2VBcHA6IEJhc2VBcHAsXG4gICAgY2FsbEx5bnhTZXRNb2R1bGU/OiBDYWxsTHlueFNldE1vZHVsZVxuICApIHtcbiAgICBiYXNlQXBwLm5hdGl2ZUFwcCA9IHRoaXMubmF0aXZlQXBwO1xuICAgIGJhc2VBcHAuc2hhcmVkQ29uc29sZSA9IHRoaXMuc2hhcmVkQ29uc29sZTtcbiAgICBiYXNlQXBwLmR5bmFtaWNDb21wb25lbnRFeHBvcnRzID0gdGhpcy5keW5hbWljQ29tcG9uZW50RXhwb3J0cztcbiAgICBiYXNlQXBwLmxvYWRlZER5bmFtaWNDb21wb25lbnRzU2V0ID0gdGhpcy5sb2FkZWREeW5hbWljQ29tcG9uZW50c1NldDtcbiAgICBiYXNlQXBwLl9pbnRlcnNlY3Rpb25PYnNlcnZlck1hbmFnZXIgPSB0aGlzLmludGVyc2VjdGlvbk9ic2VydmVyTWFuYWdlcjtcbiAgICBiYXNlQXBwLl9leHBvc3VyZU1hbmFnZXIgPSB0aGlzLmV4cG9zdXJlTWFuYWdlcjtcbiAgICBiYXNlQXBwLl90ZXh0SW5mb01hbmFnZXIgPSB0aGlzLnRleHRJbmZvTWFuYWdlcjtcbiAgICB0aGlzLmdsb2JhbEV2ZW50RW1pdHRlci5zZXRDYWxsTHlueFNldE1vZHVsZShjYWxsTHlueFNldE1vZHVsZSk7XG4gICAgYmFzZUFwcC5HbG9iYWxFdmVudEVtaXR0ZXIgPSB0aGlzLmdsb2JhbEV2ZW50RW1pdHRlcjtcbiAgICBiYXNlQXBwLl9hb3BNYW5hZ2VyID0gdGhpcy5hb3BNYW5hZ2VyO1xuICAgIGJhc2VBcHAucGVyZm9ybWFuY2UgPSB0aGlzLnBlcmZvcm1hbmNlO1xuICAgIGJhc2VBcHAubW9kdWxlcyA9IHRoaXMubW9kdWxlcztcbiAgICBiYXNlQXBwLl9sYXp5Q2FsbGFibGVNb2R1bGVzID0gdGhpcy5sYXp5Q2FsbGFibGVNb2R1bGVzO1xuICAgIGJhc2VBcHAubHlueCA9IHRoaXMubHlueDtcbiAgICB0aGlzLmx5bngucmViaW5kKCgpID0+IGJhc2VBcHApO1xuICAgIGJhc2VBcHAuX2FwaUxpc3QgPSB0aGlzLmFwaUxpc3Q7XG4gICAgdGhpcy5SZXBvcnRlci5yZWJpbmQoKCkgPT4gYmFzZUFwcCk7XG4gICAgYmFzZUFwcC5SZXBvcnRlciA9IHRoaXMuUmVwb3J0ZXI7XG4gICAgYmFzZUFwcC5yZXNvbHZlZFByb21pc2UgPSB0aGlzLnJlc29sdmVkUHJvbWlzZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGFuZGFsb25lQXBwIGV4dGVuZHMgQmFzZUFwcCB7XG4gIHB1YmxpYyBzaW5nbGV0b25EYXRhOiBCYXNlQXBwU2luZ2xldG9uRGF0YTtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBBcHBQcm94eVBhcmFtczxOYXRpdmVBcHA+LCBwYXJhbXM6IGxvYWRDYXJkUGFyYW1zKSB7XG4gICAgc3VwZXIob3B0aW9ucywgdW5kZWZpbmVkKTtcbiAgICB0aGlzLmZpbGxTaW5nbGV0b25EYXRhKCk7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChwYXJhbXMuc3JjTmFtZSkge1xuICAgICAgICBkZWxldGUgdGhpcy5seW54LnJlcXVpcmVNb2R1bGUuY2FjaGVbcGFyYW1zLnNyY05hbWVdO1xuICAgICAgICBkZWxldGUgQmFzZUFwcC5fJGZhY3RvcnlDYWNoZVtwYXJhbXMuc3JjTmFtZV07XG4gICAgICAgIHRoaXMubHlueC5yZXF1aXJlTW9kdWxlKHBhcmFtcy5zcmNOYW1lLCBERUZBVUxUX0VOVFJZKTtcbiAgICAgICAgdGhpcy5kYXRhVHlwZVNldC5hZGQoJ3VuZGVmaW5lZCcpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMuaGFuZGxlVXNlckVycm9yKGUpO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZUx5bngobmF0aXZlTHlueDogTmF0aXZlTHlueFByb3h5LCBwcm9taXNlOiBQcm9taXNlQ29uc3RydWN0b3IpOiBMeW54IHtcbiAgICBjb25zdCBseW54X3Byb3h5ID0gQ2FjaGVkRnVuY3Rpb25Qcm94eS5jcmVhdGUobmF0aXZlTHlueCk7XG4gICAgcmV0dXJuIG5ldyBMeW54KFxuICAgICAgKCkgPT4gdGhpcy5uYXRpdmVBcHAsXG4gICAgICAoKSA9PiB0aGlzLFxuICAgICAgcHJvbWlzZSxcbiAgICAgICgpID0+IGx5bnhfcHJveHlcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBmaWxsU2luZ2xldG9uRGF0YSgpIHtcbiAgICB0aGlzLnNpbmdsZXRvbkRhdGEgPSBuZXcgQmFzZUFwcFNpbmdsZXRvbkRhdGEoKTtcbiAgICB0aGlzLnNpbmdsZXRvbkRhdGEubmF0aXZlQXBwID0gdGhpcy5fbmF0aXZlQXBwO1xuICAgIHRoaXMuc2luZ2xldG9uRGF0YS5zaGFyZWRDb25zb2xlID0gdGhpcy5zaGFyZWRDb25zb2xlO1xuICAgIHRoaXMuc2luZ2xldG9uRGF0YS5keW5hbWljQ29tcG9uZW50RXhwb3J0cyA9IHRoaXMuZHluYW1pY0NvbXBvbmVudEV4cG9ydHM7XG4gICAgdGhpcy5zaW5nbGV0b25EYXRhLmxvYWRlZER5bmFtaWNDb21wb25lbnRzU2V0ID0gdGhpcy5sb2FkZWREeW5hbWljQ29tcG9uZW50c1NldDtcbiAgICB0aGlzLnNpbmdsZXRvbkRhdGEuaW50ZXJzZWN0aW9uT2JzZXJ2ZXJNYW5hZ2VyID0gdGhpcy5faW50ZXJzZWN0aW9uT2JzZXJ2ZXJNYW5hZ2VyO1xuICAgIHRoaXMuc2luZ2xldG9uRGF0YS5leHBvc3VyZU1hbmFnZXIgPSB0aGlzLl9leHBvc3VyZU1hbmFnZXI7XG4gICAgdGhpcy5zaW5nbGV0b25EYXRhLnRleHRJbmZvTWFuYWdlciA9IHRoaXMuX3RleHRJbmZvTWFuYWdlcjtcbiAgICB0aGlzLnNpbmdsZXRvbkRhdGEuZ2xvYmFsRXZlbnRFbWl0dGVyID0gdGhpcy5HbG9iYWxFdmVudEVtaXR0ZXI7XG4gICAgdGhpcy5zaW5nbGV0b25EYXRhLmFvcE1hbmFnZXIgPSB0aGlzLl9hb3BNYW5hZ2VyO1xuICAgIHRoaXMuc2luZ2xldG9uRGF0YS5wZXJmb3JtYW5jZSA9IHRoaXMucGVyZm9ybWFuY2U7XG4gICAgdGhpcy5zaW5nbGV0b25EYXRhLm1vZHVsZXMgPSB0aGlzLm1vZHVsZXM7XG4gICAgdGhpcy5zaW5nbGV0b25EYXRhLmxhenlDYWxsYWJsZU1vZHVsZXMgPSB0aGlzLl9sYXp5Q2FsbGFibGVNb2R1bGVzO1xuICAgIHRoaXMuc2luZ2xldG9uRGF0YS5seW54ID0gdGhpcy5seW54O1xuICAgIHRoaXMuc2luZ2xldG9uRGF0YS5hcGlMaXN0ID0gdGhpcy5fYXBpTGlzdDtcbiAgICB0aGlzLnNpbmdsZXRvbkRhdGEuUmVwb3J0ZXIgPSB0aGlzLlJlcG9ydGVyO1xuICAgIHRoaXMuc2luZ2xldG9uRGF0YS5yZXNvbHZlZFByb21pc2UgPSB0aGlzLnJlc29sdmVkUHJvbWlzZTtcbiAgfVxufVxuIiwgIi8vIENvcHlyaWdodCAyMDI0IFRoZSBMeW54IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UgVmVyc2lvbiAyLjAgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlXG4vLyBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG5cbi8vIHN0YXJ0IGpzIGFwcCwgbmF0aXZlIGhhcyBkZWNvZGUganMgY29kZTtcbi8vIHJldHVybiBtZWFucyBsb2FkQ2FyZCBzdWNjZXNzIG9yIGZhaWxlZC5cbmltcG9ydCB7IEJhc2VBcHAsIGxvYWRDYXJkUGFyYW1zLCBOYXRpdmVBcHAgfSBmcm9tICcuL2FwcCc7XG5pbXBvcnQgeyBMeW54LCBOYXRpdmVMeW54UHJveHkgfSBmcm9tICcuL2x5bngnO1xuaW1wb3J0IHsgYWxvZyB9IGZyb20gJy4vY29tbW9uL2xvZyc7XG5pbXBvcnQgbmF0aXZlR2xvYmFsIGZyb20gJy4vY29tbW9uL25hdGl2ZUdsb2JhbCc7XG5pbXBvcnQgeyBBUFBfU0VSVklDRV9OQU1FLCBERUZBVUxUX0VOVFJZLCBMeW54RmVhdHVyZSB9IGZyb20gJy4vY29tbW9uJztcbmltcG9ydCB7IFJlYWN0QXBwIH0gZnJvbSAnLi9yZWFjdC9yZWFjdEFwcCc7XG5pbXBvcnQgeyBJbnRlcm5hbFJ1bnRpbWVFcnJvciwgcmVwb3J0RXJyb3IgfSBmcm9tICcuL21vZHVsZXMvcmVwb3J0JztcbmltcG9ydCBTdGFuZGFsb25lQXBwIGZyb20gJy4vc3RhbmRhbG9uZS9TdGFuZGFsb25lQXBwJztcblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRDYXJkKFxuICBuYXRpdmVBcHA6IE5hdGl2ZUFwcCxcbiAgcGFyYW1zOiBsb2FkQ2FyZFBhcmFtcyxcbiAgbHlueD86IE5hdGl2ZUx5bnhQcm94eVxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IHsgaWQgfSA9IG5hdGl2ZUFwcDtcbiAgY29uc3QgeyBjYXJkVHlwZSB9ID0gcGFyYW1zO1xuICBhbG9nKGBsb2FkIGNhcmQgbmF0aXZlIGFwcCBpZDogJHtpZH1gKTtcbiAgbGV0IGxvYWRTdWNjZXNzOiBib29sZWFuID0gdHJ1ZTtcbiAgbGV0IHR0OiBSZWFjdEFwcCB8IFN0YW5kYWxvbmVBcHA7XG4gIHRyeSB7XG4gICAgaWYgKGNhcmRUeXBlID09ICdzdGFuZGFsb25lJykge1xuICAgICAgdHQgPSBuZXcgU3RhbmRhbG9uZUFwcCh7IG5hdGl2ZUFwcCwgcGFyYW1zLCBseW54IH0sIHBhcmFtcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHR0ID0gbmV3IFJlYWN0QXBwKHtcbiAgICAgICAgbmF0aXZlQXBwLFxuICAgICAgICBwYXJhbXMsXG4gICAgICAgIGx5bngsXG4gICAgICB9KTtcbiAgICB9XG4gICAgbmF0aXZlR2xvYmFsLmN1cnJlbnRBcHBJZCA9IGlkO1xuICAgIG5hdGl2ZUdsb2JhbC5tdWx0aUFwcHNbaWRdID0gdHQ7XG5cbiAgICBpZiAoY2FyZFR5cGUgPT09ICdzdGFuZGFsb25lJykge1xuICAgICAgbmF0aXZlQXBwLnNldENhcmQodHQpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYWxvZyhcbiAgICAgIGBsb2FkIGNhcmQgbmF0aXZlIGFwcCBsb2FkIGFwcC1zZXJ2aWNlLmpzIHBhcmFtcy5idW5kbGVTdXBwb3J0TG9hZFNjcmlwdCAke3BhcmFtcy5idW5kbGVTdXBwb3J0TG9hZFNjcmlwdH1gXG4gICAgKTtcbiAgICBsb2FkU3VjY2VzcyA9IHRydWU7XG4gICAgaWYgKF9fV0VCX18pIHtcbiAgICAgIHR0Lmx5bngucmVxdWlyZU1vZHVsZUFzeW5jKEFQUF9TRVJWSUNFX05BTUUsIChlcnJvciwgcmV0KSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHR0LmhhbmRsZVVzZXJFcnJvcihlcnJvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHR0Lmx5bnguX3N3aXRjaGVzWydhbGxvd1VuZGVmaW5lZEluTmF0aXZlRGF0YVR5cGVTZXQnXSkge1xuICAgICAgICAgICAgdHQuZGF0YVR5cGVTZXQuYWRkKCd1bmRlZmluZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbmF0aXZlQXBwLnNldENhcmQodHQpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICghX19XRUJfXykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGVsZXRlIHR0Lmx5bngucmVxdWlyZU1vZHVsZS5jYWNoZVtBUFBfU0VSVklDRV9OQU1FXTtcbiAgICAgICAgZGVsZXRlIEJhc2VBcHAuXyRmYWN0b3J5Q2FjaGVbQVBQX1NFUlZJQ0VfTkFNRV07XG4gICAgICAgIHR0Lmx5bngucmVxdWlyZU1vZHVsZShBUFBfU0VSVklDRV9OQU1FLCBERUZBVUxUX0VOVFJZKTtcbiAgICAgICAgaWYgKHR0Lmx5bnguX3N3aXRjaGVzWydhbGxvd1VuZGVmaW5lZEluTmF0aXZlRGF0YVR5cGVTZXQnXSkge1xuICAgICAgICAgIHR0LmRhdGFUeXBlU2V0LmFkZCgndW5kZWZpbmVkJyk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgbG9hZFN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgdHQuaGFuZGxlVXNlckVycm9yKGUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCAnbG9hZENhcmQgZmFpbGVkJyk7XG4gICAgICB9XG4gICAgfVxuICAgIG5hdGl2ZUFwcC5zZXRDYXJkKHR0KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGhhbmRsZUxvYWRDYXJkRXJyb3IobmF0aXZlQXBwLCBlKTtcbiAgICBsb2FkU3VjY2VzcyA9IGZhbHNlO1xuICB9XG4gIHJldHVybiBsb2FkU3VjY2Vzcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlc3Ryb3lDYXJkKGlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgYWxvZyhgZGVzdHJveSAke2lkfWApO1xuICBjb25zdCBhcHBJbnN0YW5jZSA9IG5hdGl2ZUdsb2JhbC5tdWx0aUFwcHNbaWRdO1xuICBhcHBJbnN0YW5jZS5kZXN0cm95KCk7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZHluYW1pYy1kZWxldGVcbiAgZGVsZXRlIG5hdGl2ZUdsb2JhbC5tdWx0aUFwcHNbaWRdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FsbERlc3Ryb3lMaWZldGltZUZ1bihpZDogc3RyaW5nKTogdm9pZCB7XG4gIGFsb2coYGNhbGxEZXN0cm95TGlmZXRpbWVGdW4gJHtpZH1gKTtcbiAgY29uc3QgYXBwSW5zdGFuY2UgPSBuYXRpdmVHbG9iYWwubXVsdGlBcHBzW2lkXTtcbiAgYXBwSW5zdGFuY2UuY2FsbERlc3Ryb3lMaWZldGltZUZ1bigpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9hZER5bmFtaWNDb21wb25lbnQ8VD4odHQ6IEJhc2VBcHAsIGNvbXBvbmVudFVybDogc3RyaW5nKTogVCB7XG4gIGlmICh0dC5sb2FkZWREeW5hbWljQ29tcG9uZW50c1NldC5oYXMoY29tcG9uZW50VXJsKSkge1xuICAgIHJldHVybiB0dC5nZXREeW5hbWljQ29tcG9uZW50RXhwb3J0cyhjb21wb25lbnRVcmwpO1xuICB9XG5cbiAgY29uc3QgcHJlRW50cnkgPSBuYXRpdmVHbG9iYWwuZ2xvYkR5bmFtaWNDb21wb25lbnRFbnRyeTtcbiAgbmF0aXZlR2xvYmFsLmdsb2JEeW5hbWljQ29tcG9uZW50RW50cnkgPSBjb21wb25lbnRVcmw7XG5cbiAgdHJ5IHtcbiAgICBkZWxldGUgdHQubHlueC5yZXF1aXJlTW9kdWxlLmNhY2hlW0FQUF9TRVJWSUNFX05BTUVdO1xuICAgIGRlbGV0ZSBCYXNlQXBwLl8kZmFjdG9yeUNhY2hlW0FQUF9TRVJWSUNFX05BTUVdO1xuICAgIGNvbnN0IHJldCA9IHR0Lmx5bngucmVxdWlyZU1vZHVsZTxUPihBUFBfU0VSVklDRV9OQU1FLCBjb21wb25lbnRVcmwpO1xuICAgIHR0LnNhdmVEeW5hbWljQ29tcG9uZW50RXhwb3J0cyhjb21wb25lbnRVcmwsIHJldCk7XG4gICAgdHQubG9hZGVkRHluYW1pY0NvbXBvbmVudHNTZXQuYWRkKGNvbXBvbmVudFVybCk7XG4gICAgcmV0dXJuIHJldDtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICB0dC5oYW5kbGVVc2VyRXJyb3IoZXJyb3IpO1xuICB9IGZpbmFsbHkge1xuICAgIC8vIEhlcmUgcmVzZXQgZ2xvYkR5bmFtaWNDb21wb25lbnRFbnRyeSB0byBhdm9pZCBhZmZlY3Qgb3RoZXIgTHlueFZpZXcgaW4gdGhlIHNhbWUgTHlueEdyb3VwXG4gICAgLy8gZGV0YWlsIHNlZTogIzg3MjBcbiAgICBuYXRpdmVHbG9iYWwuZ2xvYkR5bmFtaWNDb21wb25lbnRFbnRyeSA9IHByZUVudHJ5O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVMb2FkQ2FyZEVycm9yKFxuICBuYXRpdmVBcHA6IE5hdGl2ZUFwcCxcbiAgZXJyb3I/OiBFcnJvcixcbiAgY2F1c2U/OiB1bmtub3duXG4pIHtcbiAgbGV0IHsgbWVzc2FnZSwgbmFtZSwgc3RhY2sgfSA9IGVycm9yIHx8IHt9O1xuICBpZiAoIW1lc3NhZ2UpIHtcbiAgICAvLyBJZiB0aGVyZSBpcyBubyBlcnJvciBtZXNzYWdlIGluIGVycm9yLCBtZWFucyB0aGF0IGl0IGlzIG5vdCBhbiBlcnJvci1saWtlIG9iamVjdC5cbiAgICAvLyBXZSBjb25zdHJ1Y3QgYSBuZXcgRXJyb3IgdXNpbmcgSlNPTi5zdHJpbmdpZnlcbiAgICAoeyBtZXNzYWdlLCBuYW1lLCBzdGFjayB9ID0gbmV3IEVycm9yKEpTT04uc3RyaW5naWZ5KGVycm9yKSkpO1xuICB9XG4gIGNvbnN0IGludGVybmFsRXJyb3IgPSBuZXcgSW50ZXJuYWxSdW50aW1lRXJyb3IoXG4gICAgYGxvYWRDYXJkIGZhaWxlZCAke25hbWV9OiAke21lc3NhZ2V9YCxcbiAgICBzdGFja1xuICApO1xuICBpbnRlcm5hbEVycm9yLmNhdXNlID0gY2F1c2U7XG4gIHJlcG9ydEVycm9yKGludGVybmFsRXJyb3IsIG5hdGl2ZUFwcCwge1xuICAgIG9yaWdpbkVycm9yOiBlcnJvcixcbiAgICBnZXRTb3VyY2VNYXBSZWxlYXNlOiAodXJsOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgbGV0IHJldCA9IG5hdGl2ZUFwcC5fX0dldFNvdXJjZU1hcFJlbGVhc2UodXJsKTtcbiAgICAgIGlmICghcmV0KSB7XG4gICAgICAgIHJldHVybiBuYXRpdmVBcHAuX19HZXRTb3VyY2VNYXBSZWxlYXNlKEJhc2VBcHAua0RlZmF1bHRTb3VyY2VNYXBVUkwpO1xuICAgICAgfVxuICAgIH0sXG4gIH0pO1xufVxuIiwgIi8qKlxuICogQHNlZTogaHR0cHM6Ly9kZXZlbG9wZXIuYXBwbGUuY29tL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdGNvcmUvMTY0NDU5OC1qc29iamVjdG1ha2V0eXBlZGFycmF5d2l0aGFycmF5YlxuICogQGRlc2NyaXB0aW9uOiBKYXZhU2NyaXB0IENvcmUgcHJvdmlkZSBBcnJheUJ1ZmZlciBBUEkgSW4gSlNSdW50aW1lLiBCdXQgZGlkIG5vdCBleHBvcnQgc29tZSBjLWFwaSBvbiBpT1M5LlxuICovXG5cbi8vIGJhc2U2NCBjaGFyYWN0ZXIgc2V0LCBwbHVzIHBhZGRpbmcgY2hhcmFjdGVyICg9KVxuY29uc3QgY2hhcnMgPVxuICAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG4vLyBSZWd1bGFyIGV4cHJlc3Npb24gdG8gY2hlY2sgZm9ybWFsIGNvcnJlY3RuZXNzIG9mIGJhc2U2NCBlbmNvZGVkIHN0cmluZ3NcbmNvbnN0IGxvb2t1cCA9IG5ldyBVaW50OEFycmF5KDI1Nik7XG5mb3IgKGxldCBpID0gMDsgaSA8IGNoYXJzLmxlbmd0aDsgaSsrKSB7XG4gIGxvb2t1cFtjaGFycy5jaGFyQ29kZUF0KGkpXSA9IGk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheUJ1ZmZlclRvQmFzZTY0KGJ1ZmZlcjogQXJyYXlCdWZmZXIpOiBzdHJpbmcge1xuICB2YXIgYnl0ZXMgPSBuZXcgVWludDhBcnJheShidWZmZXIpO1xuICB2YXIgaTogbnVtYmVyO1xuICB2YXIgbGVuOiBudW1iZXIgPSBieXRlcy5sZW5ndGg7XG4gIHZhciBiYXNlNjQgPSAnJztcblxuICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpICs9IDMpIHtcbiAgICBiYXNlNjQgKz0gY2hhcnNbYnl0ZXNbaV0gPj4gMl07XG4gICAgYmFzZTY0ICs9IGNoYXJzWygoYnl0ZXNbaV0gJiAzKSA8PCA0KSB8IChieXRlc1tpICsgMV0gPj4gNCldO1xuICAgIGJhc2U2NCArPSBjaGFyc1soKGJ5dGVzW2kgKyAxXSAmIDE1KSA8PCAyKSB8IChieXRlc1tpICsgMl0gPj4gNildO1xuICAgIGJhc2U2NCArPSBjaGFyc1tieXRlc1tpICsgMl0gJiA2M107XG4gIH1cblxuICBpZiAobGVuICUgMyA9PT0gMikge1xuICAgIGJhc2U2NCA9IGJhc2U2NC5zdWJzdHJpbmcoMCwgYmFzZTY0Lmxlbmd0aCAtIDEpICsgJz0nO1xuICB9IGVsc2UgaWYgKGxlbiAlIDMgPT09IDEpIHtcbiAgICBiYXNlNjQgPSBiYXNlNjQuc3Vic3RyaW5nKDAsIGJhc2U2NC5sZW5ndGggLSAyKSArICc9PSc7XG4gIH1cblxuICByZXR1cm4gYmFzZTY0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmFzZTY0VG9BcnJheUJ1ZmZlcihiYXNlNjQ6IHN0cmluZyk6IEFycmF5QnVmZmVyIHtcbiAgbGV0IGJ1ZmZlckxlbmd0aDogbnVtYmVyID0gYmFzZTY0Lmxlbmd0aCAqIDAuNzU7XG4gIGNvbnN0IGxlbjogbnVtYmVyID0gYmFzZTY0Lmxlbmd0aDtcbiAgbGV0IGk7XG4gIGxldCBwID0gMDtcbiAgbGV0IGVuY29kZWQxO1xuICBsZXQgZW5jb2RlZDI7XG4gIGxldCBlbmNvZGVkMztcbiAgbGV0IGVuY29kZWQ0O1xuXG4gIGlmIChiYXNlNjRbYmFzZTY0Lmxlbmd0aCAtIDFdID09PSAnPScpIHtcbiAgICBidWZmZXJMZW5ndGgtLTtcbiAgICBpZiAoYmFzZTY0W2Jhc2U2NC5sZW5ndGggLSAyXSA9PT0gJz0nKSB7XG4gICAgICBidWZmZXJMZW5ndGgtLTtcbiAgICB9XG4gIH1cblxuICBsZXQgYXJyYXlidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoYnVmZmVyTGVuZ3RoKTtcbiAgbGV0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXlidWZmZXIpO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gNCkge1xuICAgIGVuY29kZWQxID0gbG9va3VwW2Jhc2U2NC5jaGFyQ29kZUF0KGkpXTtcbiAgICBlbmNvZGVkMiA9IGxvb2t1cFtiYXNlNjQuY2hhckNvZGVBdChpICsgMSldO1xuICAgIGVuY29kZWQzID0gbG9va3VwW2Jhc2U2NC5jaGFyQ29kZUF0KGkgKyAyKV07XG4gICAgZW5jb2RlZDQgPSBsb29rdXBbYmFzZTY0LmNoYXJDb2RlQXQoaSArIDMpXTtcblxuICAgIGJ5dGVzW3ArK10gPSAoZW5jb2RlZDEgPDwgMikgfCAoZW5jb2RlZDIgPj4gNCk7XG4gICAgYnl0ZXNbcCsrXSA9ICgoZW5jb2RlZDIgJiAxNSkgPDwgNCkgfCAoZW5jb2RlZDMgPj4gMik7XG4gICAgYnl0ZXNbcCsrXSA9ICgoZW5jb2RlZDMgJiAzKSA8PCA2KSB8IChlbmNvZGVkNCAmIDYzKTtcbiAgfVxuXG4gIHJldHVybiBhcnJheWJ1ZmZlcjtcbn1cbiIsICIvLyBDb3B5cmlnaHQgMjAyNCBUaGUgTHlueCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlIFZlcnNpb24gMi4wIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZVxuLy8gTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuaW1wb3J0IHtcbiAgbG9hZENhcmQsXG4gIGRlc3Ryb3lDYXJkLFxuICBjYWxsRGVzdHJveUxpZmV0aW1lRnVuLFxuICBsb2FkRHluYW1pY0NvbXBvbmVudCxcbn0gZnJvbSAnLi9hcHBNYW5hZ2VyJztcbmltcG9ydCB7IGFycmF5QnVmZmVyVG9CYXNlNjQsIGJhc2U2NFRvQXJyYXlCdWZmZXIgfSBmcm9tICcuL3BvbHlmaWxsJztcbmltcG9ydCBuYXRpdmVHbG9iYWwgZnJvbSAnLi9jb21tb24vbmF0aXZlR2xvYmFsJztcbmltcG9ydCB7XG4gIGNyZWF0ZUV2ZW50RW1pdHRlcixcbiAgbGVnYWN5UmVwb3J0RXJyb3IsXG4gIHdyYXBJbm5lckZ1bmN0aW9uLFxuICB3cmFwVXNlckZ1bmN0aW9uLFxufSBmcm9tICcuL21vZHVsZXMnO1xuaW1wb3J0IHtcbiAgSGVhZGVycyxcbiAgVVJMLFxuICBVUkxTZWFyY2hQYXJhbXNQb2x5ZmlsbCxcbiAgQWJvcnRDb250cm9sbGVyLFxuICBBYm9ydFNpZ25hbCxcbn0gZnJvbSAnLi9tb2R1bGVzL2ZldGNoJztcblxuZXhwb3J0IHsgbG9hZENhcmQsIGRlc3Ryb3lDYXJkLCBjYWxsRGVzdHJveUxpZmV0aW1lRnVuLCBsb2FkRHluYW1pY0NvbXBvbmVudCB9O1xuXG5uYXRpdmVHbG9iYWwubG9hZENhcmQgPSBsb2FkQ2FyZDtcbm5hdGl2ZUdsb2JhbC5kZXN0cm95Q2FyZCA9IGRlc3Ryb3lDYXJkO1xubmF0aXZlR2xvYmFsLmNhbGxEZXN0cm95TGlmZXRpbWVGdW4gPSBjYWxsRGVzdHJveUxpZmV0aW1lRnVuO1xubmF0aXZlR2xvYmFsLmxvYWREeW5hbWljQ29tcG9uZW50ID0gbG9hZER5bmFtaWNDb21wb25lbnQ7XG4vKipcbiAqIG9ubHkgZm9yIGx5bnggbmF0aXZlIHJ1bnRpbWVcbiAqL1xubmF0aXZlR2xvYmFsLl9fY3JlYXRlRXZlbnRFbWl0dGVyID0gY3JlYXRlRXZlbnRFbWl0dGVyO1xubmF0aXZlR2xvYmFsLl9fbHlueEFycmF5QnVmZmVyVG9CYXNlNjQgPSBhcnJheUJ1ZmZlclRvQmFzZTY0O1xubmF0aXZlR2xvYmFsLl9fbHlueEJhc2U2NFRvQXJyYXlCdWZmZXIgPSBiYXNlNjRUb0FycmF5QnVmZmVyO1xubmF0aXZlR2xvYmFsLkx5bnhTREtDb3JlID0ge1xuICByZXBvcnQ6IGxlZ2FjeVJlcG9ydEVycm9yLFxuICByZXBvcnRJbm5lcjogd3JhcElubmVyRnVuY3Rpb24sXG4gIHJlcG9ydFVzZXI6IHdyYXBVc2VyRnVuY3Rpb24sXG59O1xuXG5uYXRpdmVHbG9iYWwuSGVhZGVycyA9IEhlYWRlcnM7XG5uYXRpdmVHbG9iYWwuQWJvcnRDb250cm9sbGVyID0gQWJvcnRDb250cm9sbGVyO1xubmF0aXZlR2xvYmFsLkFib3J0U2lnbmFsID0gQWJvcnRTaWduYWw7XG5uYXRpdmVHbG9iYWwuVVJMID0gVVJM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QUFBLHNCQUFhLFVBQVVDO0FBQ3ZCLEVBQUFELHNCQUFhLGtCQUFrQjtBQUMvQixFQUFBQSxzQkFBYSxjQUFjO0FBQzNCLEVBQUFBLHNCQUFhLE1BQU07QUFDbkIsMEJBQXdCQSxxQkFBWTsiLAogICJuYW1lcyI6IFsibW9kdWxlIiwgIm5vb3AiLCAiUHJvbWlzZSIsICJyZXNvbHZlIiwgInJlamVjdCIsICJtb2R1bGUiLCAiUHJvbWlzZSIsICJpIiwgInZhbCIsICJtb2R1bGUiLCAiUHJvbWlzZSIsICJzZXRUaW1lb3V0IiwgImlkIiwgIm1vZHVsZSIsICJzZXRUaW1lb3V0IiwgIlByb21pc2UiLCAibW9kdWxlIiwgImV4cG9ydHMiLCAidW5kZWZpbmVkIiwgInZhbHVlIiwgImtleSIsICJuZXh0IiwgImdsb2JhbFRoaXMiLCAiaW1wb3J0X3J1bnRpbWUiLCAiX2dsb2JhbCIsICJ0dENvbnNvbGVfZGVmYXVsdCIsICJ0dENvbnNvbGVfZGVmYXVsdCIsICJuYXRpdmVHbG9iYWxfZGVmYXVsdCIsICJ0dENvbnNvbGVfZGVmYXVsdCIsICJ0dENvbnNvbGVfZGVmYXVsdCIsICJlcnJvciIsICJ0dENvbnNvbGVfZGVmYXVsdCIsICJfYSIsICJQcm9taXNlIiwgInBhdGgiLCAiZW50cnlOYW1lIiwgIm1vZHVsZSIsICJuYXRpdmVHbG9iYWxfZGVmYXVsdCIsICJwYXJhbXMiLCAiX2EiLCAicGFyYW1zIiwgImVudHJ5TmFtZSIsICJMaXN0ZW5lcktleXMiLCAibmF0aXZlR2xvYmFsX2RlZmF1bHQiLCAic2V0VGltZW91dCIsICJuYXRpdmVHbG9iYWxfZGVmYXVsdCIsICJfYSIsICJIZWFkZXJzIiwgIlByb21pc2UiLCAiSGVhZGVycyIsICJQcm9taXNlIiwgIl9hIiwgIlVSTFNlYXJjaFBhcmFtc1BvbHlmaWxsIiwgInBhcmFtcyIsICJtb2R1bGUiLCAiUHJvbWlzZSIsICJfYSIsICJfYiIsICJuYXRpdmVHbG9iYWxfZGVmYXVsdCIsICJwYXRoIiwgImVudHJ5TmFtZSIsICJ0dCIsICJzZXRUaW1lb3V0IiwgInRoYXQiLCAiX2MiLCAicGFyYW1zIiwgInBhcmFtcyIsICJ0dCIsICJuYXRpdmVHbG9iYWxfZGVmYXVsdCIsICJuYXRpdmVHbG9iYWxfZGVmYXVsdCIsICJIZWFkZXJzIl0KfQo=
