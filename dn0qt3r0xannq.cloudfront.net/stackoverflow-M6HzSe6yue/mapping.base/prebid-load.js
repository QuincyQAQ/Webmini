/*! copyright 2026 Aditude, Inc - Prebid - production - Updated: 2026-06-18T15:50:15.587Z, v1.4.0, stackoverflow-M6HzSe6yue/mapping.base/prebid-load 6be8730e476328066473 da05fcff704c773d078e */ ! function() {
    var e = {
            86964: function(e, t, r) {
                e.exports = function() {
                    "use strict";

                    function e(e) {
                        return "function" == typeof e
                    }
                    var t, i, s, n, o = void 0,
                        a = Array.isArray ? Array.isArray : function(e) {
                            return "[object Array]" === Object.prototype.toString.call(e)
                        },
                        l = 0,
                        d = void 0,
                        u = void 0,
                        h = function(e, t) {
                            y[l] = e, y[l + 1] = t, 2 === (l += 2) && (u ? u(v) : w())
                        },
                        c = "undefined" != typeof window ? window : void 0,
                        p = c || {},
                        f = p.MutationObserver || p.WebKitMutationObserver,
                        g = "undefined" == typeof self && "undefined" != typeof process && "[object process]" === ({}).toString.call(process),
                        b = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel;

                    function m() {
                        var e = setTimeout;
                        return function() {
                            return e(v, 1)
                        }
                    }
                    var y = Array(1e3);

                    function v() {
                        for (var e = 0; e < l; e += 2)(0, y[e])(y[e + 1]), y[e] = void 0, y[e + 1] = void 0;
                        l = 0
                    }
                    var w = void 0;

                    function _(e, t) {
                        var r = this,
                            i = new this.constructor(T);
                        void 0 === i[R] && $(i);
                        var s = r._state;
                        if (s) {
                            var n = arguments[s - 1];
                            h(function() {
                                return I(s, i, n, r._result)
                            })
                        } else k(r, i, e, t);
                        return i
                    }

                    function E(e) {
                        if (e && "object" == typeof e && e.constructor === this) return e;
                        var t = new this(T);
                        return P(t, e), t
                    }
                    g ? w = function() {
                        return process.nextTick(v)
                    } : f ? (t = 0, i = new f(v), s = document.createTextNode(""), i.observe(s, {
                        characterData: !0
                    }), w = function() {
                        s.data = t = ++t % 2
                    }) : b ? ((n = new MessageChannel).port1.onmessage = v, w = function() {
                        return n.port2.postMessage(0)
                    }) : w = void 0 === c ? function() {
                        try {
                            var e = Function("return this")().require("vertx");
                            return d = e.runOnLoop || e.runOnContext, void 0 !== d ? function() {
                                d(v)
                            } : m()
                        } catch (e) {
                            return m()
                        }
                    }() : m();
                    var R = Math.random().toString(36).substring(2);

                    function T() {}
                    var S = void 0;

                    function L(t, r, i) {
                        r.constructor === t.constructor && i === _ && r.constructor.resolve === E ? 1 === r._state ? x(t, r._result) : 2 === r._state ? A(t, r._result) : k(r, void 0, function(e) {
                            return P(t, e)
                        }, function(e) {
                            return A(t, e)
                        }) : void 0 === i ? x(t, r) : e(i) ? h(function(e) {
                            var t = !1,
                                s = function(e, t, r, i) {
                                    try {
                                        e.call(t, r, i)
                                    } catch (e) {
                                        return e
                                    }
                                }(i, r, function(i) {
                                    t || (t = !0, r !== i ? P(e, i) : x(e, i))
                                }, function(r) {
                                    t || (t = !0, A(e, r))
                                }, "Settle: " + (e._label || " unknown promise"));
                            !t && s && (t = !0, A(e, s))
                        }, t) : x(t, r)
                    }

                    function P(e, t) {
                        if (e === t) A(e, TypeError("You cannot resolve a promise with itself"));
                        else if (r = typeof t, null !== t && ("object" === r || "function" === r)) {
                            var r, i = void 0;
                            try {
                                i = t.then
                            } catch (t) {
                                A(e, t);
                                return
                            }
                            L(e, t, i)
                        } else x(e, t)
                    }

                    function C(e) {
                        e._onerror && e._onerror(e._result), j(e)
                    }

                    function x(e, t) {
                        e._state === S && (e._result = t, e._state = 1, 0 !== e._subscribers.length && h(j, e))
                    }

                    function A(e, t) {
                        e._state === S && (e._state = 2, e._result = t, h(C, e))
                    }

                    function k(e, t, r, i) {
                        var s = e._subscribers,
                            n = s.length;
                        e._onerror = null, s[n] = t, s[n + 1] = r, s[n + 2] = i, 0 === n && e._state && h(j, e)
                    }

                    function j(e) {
                        var t = e._subscribers,
                            r = e._state;
                        if (0 !== t.length) {
                            for (var i = void 0, s = void 0, n = e._result, o = 0; o < t.length; o += 3) i = t[o], s = t[o + r], i ? I(r, i, s, n) : s(n);
                            e._subscribers.length = 0
                        }
                    }

                    function I(t, r, i, s) {
                        var n = e(i),
                            o = void 0,
                            a = void 0,
                            l = !0;
                        if (n) {
                            try {
                                o = i(s)
                            } catch (e) {
                                l = !1, a = e
                            }
                            if (r === o) return void A(r, TypeError("A promises callback cannot return that same promise."))
                        } else o = s;
                        r._state !== S || (n && l ? P(r, o) : !1 === l ? A(r, a) : 1 === t ? x(r, o) : 2 === t && A(r, o))
                    }
                    var D = 0;

                    function $(e) {
                        e[R] = D++, e._state = void 0, e._result = void 0, e._subscribers = []
                    }
                    var O = function() {
                            function e(e, t) {
                                this._instanceConstructor = e, this.promise = new e(T), this.promise[R] || $(this.promise), a(t) ? (this.length = t.length, this._remaining = t.length, this._result = Array(this.length), 0 === this.length ? x(this.promise, this._result) : (this.length = this.length || 0, this._enumerate(t), 0 === this._remaining && x(this.promise, this._result))) : A(this.promise, Error("Array Methods must be provided an Array"))
                            }
                            return e.prototype._enumerate = function(e) {
                                for (var t = 0; this._state === S && t < e.length; t++) this._eachEntry(e[t], t)
                            }, e.prototype._eachEntry = function(e, t) {
                                var r = this._instanceConstructor,
                                    i = r.resolve;
                                if (i === E) {
                                    var s = void 0,
                                        n = void 0,
                                        o = !1;
                                    try {
                                        s = e.then
                                    } catch (e) {
                                        o = !0, n = e
                                    }
                                    if (s === _ && e._state !== S) this._settledAt(e._state, t, e._result);
                                    else if ("function" != typeof s) this._remaining--, this._result[t] = e;
                                    else if (r === q) {
                                        var a = new r(T);
                                        o ? A(a, n) : L(a, e, s), this._willSettleAt(a, t)
                                    } else this._willSettleAt(new r(function(t) {
                                        return t(e)
                                    }), t)
                                } else this._willSettleAt(i(e), t)
                            }, e.prototype._settledAt = function(e, t, r) {
                                var i = this.promise;
                                i._state === S && (this._remaining--, 2 === e ? A(i, r) : this._result[t] = r), 0 === this._remaining && x(i, this._result)
                            }, e.prototype._willSettleAt = function(e, t) {
                                var r = this;
                                k(e, void 0, function(e) {
                                    return r._settledAt(1, t, e)
                                }, function(e) {
                                    return r._settledAt(2, t, e)
                                })
                            }, e
                        }(),
                        q = function() {
                            function t(e) {
                                this[R] = D++, this._result = this._state = void 0, this._subscribers = [], T !== e && ("function" != typeof e && function() {
                                    throw TypeError("You must pass a resolver function as the first argument to the promise constructor")
                                }(), this instanceof t ? function(e, t) {
                                    try {
                                        t(function(t) {
                                            P(e, t)
                                        }, function(t) {
                                            A(e, t)
                                        })
                                    } catch (t) {
                                        A(e, t)
                                    }
                                }(this, e) : function() {
                                    throw TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")
                                }())
                            }
                            return t.prototype.catch = function(e) {
                                return this.then(null, e)
                            }, t.prototype.finally = function(t) {
                                var r = this.constructor;
                                return e(t) ? this.then(function(e) {
                                    return r.resolve(t()).then(function() {
                                        return e
                                    })
                                }, function(e) {
                                    return r.resolve(t()).then(function() {
                                        throw e
                                    })
                                }) : this.then(t, t)
                            }, t
                        }();
                    return q.prototype.then = _, q.all = function(e) {
                        return new O(this, e).promise
                    }, q.race = function(e) {
                        var t = this;
                        return new t(a(e) ? function(r, i) {
                            for (var s = e.length, n = 0; n < s; n++) t.resolve(e[n]).then(r, i)
                        } : function(e, t) {
                            return t(TypeError("You must pass an array to race."))
                        })
                    }, q.resolve = E, q.reject = function(e) {
                        var t = new this(T);
                        return A(t, e), t
                    }, q._setScheduler = function(e) {
                        u = e
                    }, q._setAsap = function(e) {
                        h = e
                    }, q._asap = h, q.polyfill = function() {
                        var e = void 0;
                        if (void 0 !== r.g) e = r.g;
                        else if ("undefined" != typeof self) e = self;
                        else try {
                            e = Function("return this")()
                        } catch (e) {
                            throw Error("polyfill failed because global object is unavailable in this environment")
                        }
                        var t = e.Promise;
                        if (t) {
                            var i = null;
                            try {
                                i = Object.prototype.toString.call(t.resolve())
                            } catch (e) {}
                            if ("[object Promise]" === i && !t.cast) return
                        }
                        e.Promise = q
                    }, q.Promise = q, q
                }()
            }
        },
        t = {};

    function r(i) {
        var s = t[i];
        if (void 0 !== s) return s.exports;
        var n = t[i] = {
            exports: {}
        };
        return e[i].call(n.exports, n, n.exports, r), n.exports
    }
    r.g = function() {
            if ("object" == typeof globalThis) return globalThis;
            try {
                return this || Function("return this")()
            } catch (e) {
                if ("object" == typeof window) return window
            }
        }(),
        function() {
            "use strict";
            let e, t, i, s; /*! js-cookie v3.0.5 | MIT */
            function n(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var r = arguments[t];
                    for (var i in r) e[i] = r[i]
                }
                return e
            }
            var o, a, l, d = function e(t, r) {
                function i(e, i, s) {
                    if ("undefined" != typeof document) {
                        "number" == typeof(s = n({}, r, s)).expires && (s.expires = new Date(Date.now() + 864e5 * s.expires)), s.expires && (s.expires = s.expires.toUTCString()), e = encodeURIComponent(e).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
                        var o = "";
                        for (var a in s) s[a] && (o += "; " + a, !0 !== s[a] && (o += "=" + s[a].split(";")[0]));
                        return document.cookie = e + "=" + t.write(i, e) + o
                    }
                }
                return Object.create({
                    set: i,
                    get: function(e) {
                        if ("undefined" != typeof document && (!arguments.length || e)) {
                            for (var r = document.cookie ? document.cookie.split("; ") : [], i = {}, s = 0; s < r.length; s++) {
                                var n = r[s].split("="),
                                    o = n.slice(1).join("=");
                                try {
                                    var a = decodeURIComponent(n[0]);
                                    if (i[a] = t.read(o, a), e === a) break
                                } catch (e) {}
                            }
                            return e ? i[e] : i
                        }
                    },
                    remove: function(e, t) {
                        i(e, "", n({}, t, {
                            expires: -1
                        }))
                    },
                    withAttributes: function(t) {
                        return e(this.converter, n({}, this.attributes, t))
                    },
                    withConverter: function(t) {
                        return e(n({}, this.converter, t), this.attributes)
                    }
                }, {
                    attributes: {
                        value: Object.freeze(r)
                    },
                    converter: {
                        value: Object.freeze(t)
                    }
                })
            }({
                read: function(e) {
                    return '"' === e[0] && (e = e.slice(1, -1)), e.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
                },
                write: function(e) {
                    return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g, decodeURIComponent)
                }
            }, {
                path: "/"
            });
            let u = e => d.get(e) || !1,
                h = e => {
                    let t = window.location.search.match("[?&]" + e + "(?:&|$|=([^&]*))");
                    return t ? t[1] ? decodeURIComponent(t[1]) : "" : null
                },
                c = e => {
                    let t = window.location.hash.match("[#&]" + e + "(?:&|$|=([^&]*))");
                    return t ? t[1] ? decodeURIComponent(t[1]) : "" : null
                },
                p = u("tude_dev") || h("tude_dev") || c("tude_dev");
            if (p) {
                let e = document.currentScript,
                    t = new URL(null != (o = null == e ? void 0 : e.src) ? o : "");
                if (t.pathname.match("prebid-load.js") && !t.searchParams.has("testing")) {
                    let r = t.pathname,
                        i = document.createElement("script");
                    throw i.src = `${"stage"===p?"https://d3g98hgqjqzwq5.cloudfront.net":"https://localhost:9000/static"}${r}?testing`.replace("/static/static/", "/static/"), i.async = !1, null == e || e.after(i), Error("prebid-load.js -- bailing to load script from another environment")
                }
            }
            let f = document.currentScript;
            if (null == f ? void 0 : f.src) {
                let e = new URL(f.src);
                if (null == e ? void 0 : e.pathname) {
                    if (r.g.__tudeLoadedScripts = r.g.__tudeLoadedScripts || [], r.g.__tudeLoadedScripts.includes(e.pathname)) throw Error(`attempted to load file multiple times: ${f.src}`);
                    r.g.__tudeLoadedScripts.push(e.pathname)
                }
            }
            var g = (e, t, r = !1, i = !1, s = [], n = []) => {
                    let o = document.createElement("script");
                    o.async = r, i && (o.defer = !0), s.forEach(e => {
                        o.setAttribute("data-" + e.key, e.value)
                    }), n.forEach(e => {
                        o.setAttribute(e.key, e.value)
                    }), o.src = e, document[t].appendChild(o)
                },
                b = ((a = b || {}).Head = "head", a);

            function m(e, t, r) {
                return t in e ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : e[t] = r, e
            }
            let y = "#339933";
            var v = ((l = v || {})[l.Advanced = 0] = "Advanced", l[l.None = 1] = "None", l[l.Standard = 2] = "Standard", l);
            let w = 1,
                _ = u("aditude_debug") || h("aditude_debug") || c("aditude_debug");
            _ && (w = 2 * ("99" != _));
            class E {
                setLabel(e, t = y) {
                    return this.label = {
                        text: e,
                        color: t
                    }, this
                }
                tag(e, t = "black") {
                    return this.tempTag = {
                        text: e,
                        color: t
                    }, this
                }
                clearTag() {
                    this.tempTag = null
                }
                enable(e = 2) {
                    return this.setLevel(e), this
                }
                setLevel(e) {
                    return this.level = e, this
                }
                isAdvanced() {
                    return 0 === this.level
                }
                isEnabled() {
                    return 1 !== this.level
                }
                advancedLog(...e) {
                    this.isAdvanced() && this._sendLog("log", this._decorate(e, ""))
                }
                log(...e) {
                    this.isEnabled() && this._sendLog("log", this._decorate(e, ""))
                }
                warn(...e) {
                    this.isEnabled() && this._sendLog("warn", this._decorate(e, ""))
                }
                error(...e) {
                    this._sendLog("error", this._decorate(e, ""))
                }
                table(e = Array, t = null) {
                    this.isEnabled() && console.table(e, t)
                }
                group(e, t) {
                    this.isEnabled() && (console.group(e), t(this), console.groupEnd(), this.clearTag())
                }
                _sendLog(e, t) {
                    let r = [e, "log", "debug", "info"].find(e => String(console[e]) === `function ${e}() { [native code] }`) || e;
                    console[r](...t)
                }
                _getElapsedTime() {
                    if (!E.firstLogTime) return E.firstLogTime = Date.now(), "0ms";
                    let e = Date.now() - E.firstLogTime;
                    return `${e}ms`
                }
                _decorate(e, t = "") {
                    e = [].slice.call(e), t && e.unshift(t);
                    let r = [],
                        i = [];
                    if (this.isAdvanced()) {
                        let e = this._getElapsedTime();
                        r.push(`%c[${e}]`), i.push("background: grey; color: white; font-size: 9px; padding: 1px 4px; border-radius: 0; margin-right: 1px;")
                    }
                    return r.push("%cCW"), i.push(s("#61B321")), this.label && this.label.text.length > 0 && (r.push("%c" + this.label.text), i.push(s(this.label.color))), this.tempTag && (r.push("%c" + this.tempTag.text), i.push(s(this.tempTag.color))), e.unshift(...i), e.unshift(r.join("")), e;

                    function s(e) {
                        return `display: inline-block; color: #fff; font-size: 9px; background: ${e}; padding: 1px 4px; border-radius: 0; margin-right: 1px;`
                    }
                }
                constructor(e) {
                    m(this, "labelColor", void 0), m(this, "label", {
                        text: "",
                        color: y
                    }), m(this, "level", w), m(this, "namespace", void 0), m(this, "tempTag", void 0), this.namespace = e
                }
            }
            m(E, "firstLogTime", null);
            let R = {};
            var T = function(e = "default") {
                return R[e] || (R[e] = new E(e)), R[e]
            };
            let S = T("analytics").setLabel("Analytics"),
                L = new class {
                    get isDisabled() {
                        return "boolean" == typeof window.__RAVEN_ENABLED && !1 === window.__RAVEN_ENABLED
                    }
                    disableTracking() {
                        window.__RAVEN_ENABLED = !1
                    }
                    getGlobal() {
                        return window.Raven = window.Raven || {
                            cmd: []
                        }, window.Raven.cmd = window.Raven.cmd || [], window.Raven
                    }
                    setCustomParams(e) {
                        this.push(({
                            config: t
                        }) => {
                            S.log("sending custom param", e), t.setCustom(e)
                        })
                    }
                    setTudeMeta(e) {
                        this.push(({
                            config: t
                        }) => {
                            t.setTudeMeta(e)
                        })
                    }
                    recordPageview() {
                        this.push(({
                            events: e
                        }) => {
                            e.pageview()
                        })
                    }
                    recordCustomEvent(e, t) {
                        this.push(({
                            events: r
                        }) => {
                            r.sendCustomEvent(e, t)
                        })
                    }
                    recordEvent(e, t) {
                        this.push(({
                            events: r
                        }) => {
                            r.send(e, t)
                        })
                    }
                    constructor() {
                        var e, t;
                        e = "push", t = e => {
                            this.isDisabled || this.getGlobal().cmd.push(e)
                        }, e in this ? Object.defineProperty(this, e, {
                            value: t,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : this[e] = t
                    }
                };
            window.Raven = window.Raven || {
                cmd: []
            };
            let P = T("analytics").setLabel("Analytics"),
                C = async () => {
                    L.disableTracking()
                },
                x = e => {
                    L.setCustomParams(e)
                };
            (async e => {
                if (e.disableTrackingExplicitly) return P.log("Tracking explicitly disabled");
                let {
                    raven: t = "standalone"
                } = e, r = "none", i = r && ["standalone", "legacy"].includes(r) ? r : t;
                if ("legacy" === i) {
                    let t = `${e.publisherKeyCw}/${e.wrapper}`,
                        r = new URL(`https://edge.aditude.io/wrapper/${t}/info.json`);
                    try {
                        let e = await fetch(r.toString());
                        if (e.ok) {
                            let {
                                p: t,
                                a: r
                            } = await e.json();
                            t && r || (T().advancedLog("publisher not configured for analytics"), C())
                        } else throw Error(`${e.status} ${e.statusText}`)
                    } catch (e) {
                        T().error("analytics config failed to load", e)
                    }
                } else if ("standalone" === i) {
                    if (!e.propertyId || "" === e.propertyId || window.RavenLoaded) return;
                    let {
                        pbjsGlobals: t,
                        propertyId: r,
                        wrapper: i
                    } = e;
                    window.__RAVEN_ENABLED = !0, window.RavenLoaded = !0, window.Raven = window.Raven || {
                        cmd: []
                    }, window.Raven.initialConfig = {
                        globalParams: {
                            wrapper: i
                        },
                        pbjsGlobals: t || ["pbjs"],
                        propertyId: r
                    }, g(`https://raven-edge.aditude.io/raven/${r}/library.js`, b.Head, !1, !1)
                }
            })({
                publisherKeyCw: "stackoverflow-M6HzSe6yue",
                propertyId: "stackoverflow-main-I67Hg",
                wrapper: "mapping.base"
            });
            var A = "6167788a58e716d678c6d136265c856c";
            class k extends Error {
                response;
                request;
                options;
                constructor(e, t, r) {
                    let i = e.status || 0 === e.status ? e.status : "",
                        s = e.statusText || "",
                        n = `${i} ${s}`.trim();
                    super(`Request failed with ${n?`status code ${n}`:"an unknown error"}: ${t.method} ${t.url}`), this.name = "HTTPError", this.response = e, this.request = t, this.options = r
                }
            }
            class j extends Error {
                request;
                constructor(e) {
                    super(`Request timed out: ${e.method} ${e.url}`), this.name = "TimeoutError", this.request = e
                }
            }
            let I = (() => {
                    let e = !1,
                        t = !1,
                        r = "function" == typeof globalThis.Request;
                    if ("function" == typeof globalThis.ReadableStream && r) try {
                        t = new globalThis.Request("https://empty.invalid", {
                            body: new globalThis.ReadableStream,
                            method: "POST",
                            get duplex() {
                                return e = !0, "half"
                            }
                        }).headers.has("Content-Type")
                    } catch (e) {
                        if (e instanceof Error && "unsupported BodyInit type" === e.message) return !1;
                        throw e
                    }
                    return e && !t
                })(),
                D = "function" == typeof globalThis.AbortController,
                $ = "function" == typeof globalThis.ReadableStream,
                O = "function" == typeof globalThis.FormData,
                q = ["get", "post", "put", "patch", "head", "delete"],
                N = {
                    json: "application/json",
                    text: "text/*",
                    formData: "multipart/form-data",
                    arrayBuffer: "*/*",
                    blob: "*/*"
                },
                M = new TextEncoder().encode("------WebKitFormBoundaryaxpyiPgbbPti10Rw").length,
                U = Symbol("stop"),
                F = {
                    json: !0,
                    parseJson: !0,
                    stringifyJson: !0,
                    searchParams: !0,
                    prefixUrl: !0,
                    retry: !0,
                    timeout: !0,
                    hooks: !0,
                    throwHttpErrors: !0,
                    onDownloadProgress: !0,
                    onUploadProgress: !0,
                    fetch: !0
                },
                G = {
                    method: !0,
                    headers: !0,
                    body: !0,
                    mode: !0,
                    credentials: !0,
                    cache: !0,
                    redirect: !0,
                    referrer: !0,
                    referrerPolicy: !0,
                    integrity: !0,
                    keepalive: !0,
                    signal: !0,
                    window: !0,
                    dispatcher: !0,
                    duplex: !0,
                    priority: !0
                },
                B = e => {
                    if (!e) return 0;
                    if (e instanceof FormData) {
                        let t = 0;
                        for (let [r, i] of e) t += M, t += new TextEncoder().encode(`Content-Disposition: form-data; name="${r}"`).length, t += "string" == typeof i ? new TextEncoder().encode(i).length : i.size;
                        return t
                    }
                    if (e instanceof Blob) return e.size;
                    if (e instanceof ArrayBuffer) return e.byteLength;
                    if ("string" == typeof e) return new TextEncoder().encode(e).length;
                    if (e instanceof URLSearchParams) return new TextEncoder().encode(e.toString()).length;
                    if ("byteLength" in e) return e.byteLength;
                    if ("object" == typeof e && null !== e) try {
                        let t = JSON.stringify(e);
                        return new TextEncoder().encode(t).length
                    } catch {}
                    return 0
                },
                H = (e, t) => {
                    let r = Number(e.headers.get("content-length")) || 0,
                        i = 0;
                    return 204 === e.status ? (t && t({
                        percent: 1,
                        totalBytes: r,
                        transferredBytes: i
                    }, new Uint8Array), new Response(null, {
                        status: e.status,
                        statusText: e.statusText,
                        headers: e.headers
                    })) : new Response(new ReadableStream({
                        async start(s) {
                            let n = e.body.getReader();
                            async function o() {
                                let {
                                    done: e,
                                    value: a
                                } = await n.read();
                                if (e) return void s.close();
                                t && (i += a.byteLength, t({
                                    percent: 0 === r ? 0 : i / r,
                                    transferredBytes: i,
                                    totalBytes: r
                                }, a)), s.enqueue(a), await o()
                            }
                            t && t({
                                percent: 0,
                                transferredBytes: 0,
                                totalBytes: r
                            }, new Uint8Array), await o()
                        }
                    }), {
                        status: e.status,
                        statusText: e.statusText,
                        headers: e.headers
                    })
                },
                z = (e, t) => {
                    let r = B(e.body),
                        i = 0;
                    return new Request(e, {
                        duplex: "half",
                        body: new ReadableStream({
                            async start(s) {
                                let n = e.body instanceof ReadableStream ? e.body.getReader() : new Response("").body.getReader();
                                async function o() {
                                    let {
                                        done: e,
                                        value: a
                                    } = await n.read();
                                    if (e) {
                                        t && t({
                                            percent: 1,
                                            transferredBytes: i,
                                            totalBytes: Math.max(r, i)
                                        }, new Uint8Array), s.close();
                                        return
                                    }
                                    i += a.byteLength;
                                    let l = 0 === r ? 0 : i / r;
                                    (r < i || 1 === l) && (l = .99), t && t({
                                        percent: Number(l.toFixed(2)),
                                        transferredBytes: i,
                                        totalBytes: r
                                    }, a), s.enqueue(a), await o()
                                }
                                await o()
                            }
                        })
                    })
                },
                V = e => null !== e && "object" == typeof e,
                K = (...e) => {
                    for (let t of e)
                        if ((!V(t) || Array.isArray(t)) && void 0 !== t) throw TypeError("The `options` argument must be an object");
                    return X({}, ...e)
                },
                W = (e = {}, t = {}) => {
                    let r = new globalThis.Headers(e),
                        i = t instanceof globalThis.Headers;
                    for (let [e, s] of new globalThis.Headers(t).entries()) i && "undefined" === s || void 0 === s ? r.delete(e) : r.set(e, s);
                    return r
                };

            function J(e, t, r) {
                return Object.hasOwn(t, r) && void 0 === t[r] ? [] : X(e[r] ? ? [], t[r] ? ? [])
            }
            let Y = (e = {}, t = {}) => ({
                    beforeRequest: J(e, t, "beforeRequest"),
                    beforeRetry: J(e, t, "beforeRetry"),
                    afterResponse: J(e, t, "afterResponse"),
                    beforeError: J(e, t, "beforeError")
                }),
                X = (...e) => {
                    let t = {},
                        r = {},
                        i = {};
                    for (let s of e)
                        if (Array.isArray(s)) Array.isArray(t) || (t = []), t = [...t, ...s];
                        else if (V(s)) {
                        for (let [e, r] of Object.entries(s)) V(r) && e in t && (r = X(t[e], r)), t = { ...t,
                            [e]: r
                        };
                        V(s.hooks) && (i = Y(i, s.hooks), t.hooks = i), V(s.headers) && (r = W(r, s.headers), t.headers = r)
                    }
                    return t
                },
                Q = e => q.includes(e) ? e.toUpperCase() : e,
                Z = {
                    limit: 2,
                    methods: ["get", "put", "head", "delete", "options", "trace"],
                    statusCodes: [408, 413, 429, 500, 502, 503, 504],
                    afterStatusCodes: [413, 429, 503],
                    maxRetryAfter: Number.POSITIVE_INFINITY,
                    backoffLimit: Number.POSITIVE_INFINITY,
                    delay: e => .3 * 2 ** (e - 1) * 1e3
                },
                ee = (e = {}) => {
                    if ("number" == typeof e) return { ...Z,
                        limit: e
                    };
                    if (e.methods && !Array.isArray(e.methods)) throw Error("retry.methods must be an array");
                    if (e.statusCodes && !Array.isArray(e.statusCodes)) throw Error("retry.statusCodes must be an array");
                    return { ...Z,
                        ...e
                    }
                };
            var et = r(86964).Promise;
            async function er(e, t, r, i) {
                return new et((s, n) => {
                    let o = setTimeout(() => {
                        r && r.abort(), n(new j(e))
                    }, i.timeout);
                    i.fetch(e, t).then(s).catch(n).then(() => {
                        clearTimeout(o)
                    })
                })
            }
            var ei = r(86964).Promise;
            async function es(e, {
                signal: t
            }) {
                return new ei((r, i) => {
                    function s() {
                        clearTimeout(n), i(t.reason)
                    }
                    t && (t.throwIfAborted(), t.addEventListener("abort", s, {
                        once: !0
                    }));
                    let n = setTimeout(() => {
                        t ? .removeEventListener("abort", s), r()
                    }, e)
                })
            }
            let en = (e, t) => {
                let r = {};
                for (let i in t) i in G || i in F || i in e || (r[i] = t[i]);
                return r
            };
            var eo = r(86964).Promise;
            class ea {
                static create(e, t) {
                    let r = new ea(e, t),
                        i = async () => {
                            if ("number" == typeof r._options.timeout && r._options.timeout > 0x7fffffff) throw RangeError("The `timeout` option cannot be greater than 2147483647");
                            await eo.resolve();
                            let e = await r._fetch();
                            for (let t of r._options.hooks.afterResponse) {
                                let i = await t(r.request, r._options, r._decorateResponse(e.clone()));
                                i instanceof globalThis.Response && (e = i)
                            }
                            if (r._decorateResponse(e), !e.ok && r._options.throwHttpErrors) {
                                let t = new k(e, r.request, r._options);
                                for (let e of r._options.hooks.beforeError) t = await e(t);
                                throw t
                            }
                            if (r.request.bodyUsed || await r.request.body ? .cancel(), r._options.onDownloadProgress) {
                                if ("function" != typeof r._options.onDownloadProgress) throw TypeError("The `onDownloadProgress` option must be a function");
                                if (!$) throw Error("Streams are not supported in your environment. `ReadableStream` is missing.");
                                return H(e.clone(), r._options.onDownloadProgress)
                            }
                            return e
                        },
                        s = r._options.retry.methods.includes(r.request.method.toLowerCase()) ? r._retry(i) : i();
                    for (let [e, i] of Object.entries(N)) s[e] = async () => {
                        r.request.headers.set("accept", r.request.headers.get("accept") || i);
                        let n = await s;
                        if ("json" === e) {
                            if (204 === n.status || 0 === (await n.clone().arrayBuffer()).byteLength) return "";
                            if (t.parseJson) return t.parseJson(await n.text())
                        }
                        return n[e]()
                    };
                    return s
                }
                request;
                abortController;
                _retryCount = 0;
                _input;
                _options;
                constructor(e, t = {}) {
                    if (this._input = e, this._options = { ...t,
                            headers: W(this._input.headers, t.headers),
                            hooks: Y({
                                beforeRequest: [],
                                beforeRetry: [],
                                beforeError: [],
                                afterResponse: []
                            }, t.hooks),
                            method: Q(t.method ? ? this._input.method ? ? "GET"),
                            prefixUrl: String(t.prefixUrl || ""),
                            retry: ee(t.retry),
                            throwHttpErrors: !1 !== t.throwHttpErrors,
                            timeout: t.timeout ? ? 1e4,
                            fetch: t.fetch ? ? globalThis.fetch.bind(globalThis)
                        }, "string" != typeof this._input && !(this._input instanceof URL || this._input instanceof globalThis.Request)) throw TypeError("`input` must be a string, URL, or Request");
                    if (this._options.prefixUrl && "string" == typeof this._input) {
                        if (this._input.startsWith("/")) throw Error("`input` must not begin with a slash when using `prefixUrl`");
                        this._options.prefixUrl.endsWith("/") || (this._options.prefixUrl += "/"), this._input = this._options.prefixUrl + this._input
                    }
                    if (D) {
                        let e = this._options.signal ? ? this._input.signal;
                        this.abortController = new globalThis.AbortController, this._options.signal = e ? AbortSignal.any([e, this.abortController.signal]) : this.abortController.signal
                    }
                    if (I && (this._options.duplex = "half"), void 0 !== this._options.json && (this._options.body = this._options.stringifyJson ? .(this._options.json) ? ? JSON.stringify(this._options.json), this._options.headers.set("content-type", this._options.headers.get("content-type") ? ? "application/json")), this.request = new globalThis.Request(this._input, this._options), this._options.searchParams) {
                        let e = "string" == typeof this._options.searchParams ? this._options.searchParams.replace(/^\?/, "") : new URLSearchParams(this._options.searchParams).toString(),
                            t = this.request.url.replace(/(?:\?.*?)?(?=#|$)/, "?" + e);
                        (O && this._options.body instanceof globalThis.FormData || this._options.body instanceof URLSearchParams) && !(this._options.headers && this._options.headers["content-type"]) && this.request.headers.delete("content-type"), this.request = new globalThis.Request(new globalThis.Request(t, { ...this.request
                        }), this._options)
                    }
                    if (this._options.onUploadProgress) {
                        if ("function" != typeof this._options.onUploadProgress) throw TypeError("The `onUploadProgress` option must be a function");
                        if (!I) throw Error("Request streams are not supported in your environment. The `duplex` option for `Request` is not available.");
                        this.request.body && (this.request = z(this.request, this._options.onUploadProgress))
                    }
                }
                _calculateRetryDelay(e) {
                    if (this._retryCount++, this._retryCount > this._options.retry.limit || e instanceof j) throw e;
                    if (e instanceof k) {
                        if (!this._options.retry.statusCodes.includes(e.response.status)) throw e;
                        let t = e.response.headers.get("Retry-After") ? ? e.response.headers.get("RateLimit-Reset") ? ? e.response.headers.get("X-RateLimit-Reset") ? ? e.response.headers.get("X-Rate-Limit-Reset");
                        if (t && this._options.retry.afterStatusCodes.includes(e.response.status)) {
                            let e = 1e3 * Number(t);
                            Number.isNaN(e) ? e = Date.parse(t) - Date.now() : e >= Date.parse("2024-01-01") && (e -= Date.now());
                            let r = this._options.retry.maxRetryAfter ? ? e;
                            return e < r ? e : r
                        }
                        if (413 === e.response.status) throw e
                    }
                    let t = this._options.retry.delay(this._retryCount);
                    return Math.min(this._options.retry.backoffLimit, t)
                }
                _decorateResponse(e) {
                    return this._options.parseJson && (e.json = async () => this._options.parseJson(await e.text())), e
                }
                async _retry(e) {
                    try {
                        return await e()
                    } catch (r) {
                        let t = Math.min(this._calculateRetryDelay(r), 0x7fffffff);
                        if (this._retryCount < 1) throw r;
                        for (let e of (await es(t, {
                                signal: this._options.signal
                            }), this._options.hooks.beforeRetry))
                            if (await e({
                                    request: this.request,
                                    options: this._options,
                                    error: r,
                                    retryCount: this._retryCount
                                }) === U) return;
                        return this._retry(e)
                    }
                }
                async _fetch() {
                    for (let e of this._options.hooks.beforeRequest) {
                        let t = await e(this.request, this._options);
                        if (t instanceof Request) {
                            this.request = t;
                            break
                        }
                        if (t instanceof Response) return t
                    }
                    let e = en(this.request, this._options),
                        t = this.request;
                    return (this.request = t.clone(), !1 === this._options.timeout) ? this._options.fetch(t, e) : er(t, e, this.abortController, this._options)
                }
            } /*! MIT License © Sindre Sorhus */
            let el = e => {
                    let t = (t, r) => ea.create(t, K(e, r));
                    for (let r of q) t[r] = (t, i) => ea.create(t, K(e, i, {
                        method: r
                    }));
                    return t.create = e => el(K(e)), t.extend = t => ("function" == typeof t && (t = t(e ? ? {})), el(K(e, t))), t.stop = U, t
                },
                ed = el();
            var eu = r(86964).Promise;
            let eh = {
                    gdpr: {
                        country: "GB",
                        region: "ENG",
                        city: "London",
                        postalCode: "W1B"
                    },
                    ccpa: {
                        country: "US",
                        region: "CA",
                        city: "San Francisco",
                        postalCode: "94107"
                    },
                    none: {
                        country: "US",
                        region: "IL",
                        city: "Chicago",
                        postalCode: "60007"
                    }
                },
                ec = "aditude_geo";
            if (h(ec)) {
                let t = h(ec);
                eh[t] && (e = eh[t])
            }
            let ep = !1,
                ef = new eu(e => {
                    i = e
                });
            async function eg(r = "https://geo-location.prebid.cloud/v1/geo") {
                if (e) return e;
                if (t || ep) return ef;
                let s = window.localStorage.getItem("cwgl");
                if (s) {
                    let e = window.localStorage.getItem("cwglt");
                    (h("aditude_nocache") || !e || Date.now() - parseInt(e) > 36e5) && (s = !1)
                }
                if (s) t = JSON.parse(s), i(t);
                else {
                    ep = !0;
                    try {
                        let e = await ed.get(r || "https://geo-location.prebid.cloud/v1/geo", {
                            timeout: 3e3
                        }).json();
                        window.localStorage.setItem("cwgl", JSON.stringify(e)), window.localStorage.setItem("cwglt", JSON.stringify(Date.now())), t = e, i(t)
                    } catch (e) {
                        T().error(e), i(t)
                    }
                }
                return ef
            }
            let eb = (e = "", t = "") => {
                    let r = "https://dn0qt3r0xannq.cloudfront.net";
                    return (-1 !== e.indexOf("vendor/") || -1 !== t.indexOf("vendor/")) && (r = "https://dn0qt3r0xannq.cloudfront.net"), r + e + t
                },
                em = (e, t, r = !1, i = !1, s = []) => {
                    let n = document.createElement("script");
                    r ? n.async = !0 : n.async = !1, i && (n.defer = !0), s.forEach(e => {
                        n.setAttribute("data-" + e.key, e.value)
                    }), n.src = e, document[t].appendChild(n)
                },
                ey = new class {
                    enable() {
                        globalThis[this.key] = !0
                    }
                    disable() {
                        globalThis[this.key] = !1
                    }
                    isEnabled() {
                        return !0 === globalThis[this.key]
                    }
                    getValue() {
                        return globalThis[this.key]
                    }
                    setValue(e) {
                        globalThis[this.key] = e
                    }
                    clear() {
                        delete globalThis[this.key]
                    }
                    getObfuscatedKey(e) {
                        let t = this.hashString(e);
                        return `__tudeFlag:${t}`
                    }
                    hashString(e) {
                        let t = 0xdeadbeef,
                            r = 0x41c6ce57;
                        for (let i = 0; i < e.length; i++) {
                            let s = e.charCodeAt(i);
                            t = Math.imul(t ^ s, 0x9e3779b1), r = Math.imul(r ^ s, 0x5f356495)
                        }
                        return t = Math.imul(t ^ t >>> 16, 0x85ebca6b) ^ Math.imul(r ^ r >>> 13, 0xc2b2ae35), (0x100000000 * (2097151 & (r = Math.imul(r ^ r >>> 16, 0x85ebca6b) ^ Math.imul(t ^ t >>> 13, 0xc2b2ae35))) + (t >>> 0)).toString(36)
                    }
                    constructor(e) {
                        var t;
                        t = void 0, "key" in this ? Object.defineProperty(this, "key", {
                            value: t,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : this.key = t, this.key = Symbol.for(this.getObfuscatedKey(e))
                    }
                }("isRevSharePub");
            var ev = (e, t = !1) => {
                    let r = document.createElement("link");
                    t && (r.id = t), r.rel = "stylesheet", r.type = "text/css", r.href = e, r.media = "all", document.getElementsByTagName("head")[0].appendChild(r)
                },
                ew = r(86964).Promise;

            function e_(e, t, r) {
                return t in e ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : e[t] = r, e
            }
            let eE = '"1.4.0"'.replace(/"/g, ""),
                eR = "Loader";
            T(eR).setLabel("Loader", "red");
            var eT = class {
                setForcedModules(e = []) {
                    this.forcedModules = e
                }
                appendForcedModules(e = []) {
                    this.forcedModules = [...this.forcedModules, ...e]
                }
                forceEnablePrebidFork() {
                    this._forceEnablePrebidFork = !0
                }
                setForceEnablePrebidFork(e = !0) {
                    this._forceEnablePrebidFork = !!e
                }
                setForcePrebidYielding(e) {
                    this._forcePrebidYielding = !!e
                }
                forcePrebidVersion(e) {
                    this._forcePrebidVersion = e
                }
                getLibraryLocation() {
                    return this.libraryFolder ? this.publisherKey + "/" + this.libraryFolder : this.publisherKey
                }
                setLibraryFolder(e) {
                    this.libraryFolder = e
                }
                setPrebidBuild(e) {
                    this.dynamicLibrary = e
                }
                setDynamicLibrary(e, t) {
                    this.dynamicLibrary = {
                        version: e,
                        modules: t
                    }
                }
                setLoadRemoteConfig(e = !0) {
                    this.loadRemoteConfig = e
                }
                disableAnalytics() {
                    this.checkForAnalytics = !1
                }
                enableAnalyticsExperiment() {
                    this.checkForAnalytics = !0
                }
                disableLibrary() {
                    this.hasLibrary = !1
                }
                disable() {
                    this._disabled = !0, T(eR).advancedLog("Wrapper disabled"), "function" != typeof window.tudeDisabled && (window.tudeDisabled = function() {
                        return !0
                    })
                }
                setGeo(e = !0) {
                    this.geo = e
                }
                setGeoEndpoint(e = "https://geo-location.prebid.cloud/v1/geo") {
                    T(eR).advancedLog("Endpoint set: ", e), this.geoEndpoint = e
                }
                setGeoTimeout(e = 500) {
                    this.geoTimeout = e
                }
                setWhitelistDomains(e) {
                    this.whitelistDomains = e
                }
                isDomainWhitelisted() {
                    if (!this.whitelistDomains || 0 === this.whitelistDomains.length) return !0;
                    let e = window.location.hostname.replace(/^www\./, "");
                    return this.whitelistDomains.some(t => t.replace(/^www\./, "") === e)
                }
                async getGeo() {
                    let e = await eg(this.geoEndpoint);
                    r.g._tudeGeo = e, T(eR).advancedLog("Global Geo Set", e)
                }
                setGlobalPbjsName(e) {
                    this.globalPbjsName = e, r.g._tudePbjsGlobal = this.globalPbjsName
                }
                setPublisherKey(e) {
                    this.publisherKey = e
                }
                setResourceVersion(e) {
                    this.version = e
                }
                setWrapper(e) {
                    this.wrapper = e
                }
                addPreset(e) {
                    e.forEach(e => {
                        this.addResource(e)
                    })
                }
                addResource(e) {
                    this.resources[e.name] = e
                }
                getCurrentWrapperUrl(e, t = !0) {
                    let r = "";
                    return this.version && t && (r = "?v=" + this.version), eb(`/${this.publisherKey}/${this.wrapper}`, `/${e}`) + r
                }
                createCloudResource(e, t, r, i, s) {
                    let n = "";
                    this.version && (n = "?v=" + this.version);
                    let o = {
                        name: e,
                        appendTo: b.Head,
                        async: i,
                        trigger: s,
                        url: eb(`/${t}`, `/${r}`) + n
                    };
                    this.addResource(o)
                }
                async start() {
                    if (T(eR).advancedLog("Loader starting at: ", Math.floor(performance.now()).toString()), this._disabled) return void T(eR).advancedLog("Loader disabled, skipping start");
                    if (!this.isDomainWhitelisted()) return void T(eR).advancedLog("Domain not whitelisted, skipping loader");
                    if (await this.maybeLoadRemoteConfig(), this.hasLibrary && this.addLibrary(), this.addWrapper(), Object.keys(this.resources).reverse().forEach(e => {
                            try {
                                let t = this.resources[e];
                                if ((!t.type || "js" === t.type) && !document.querySelector(`link[rel="preload"][as="script"][href="${t.url}"]`)) {
                                    let e = document.createElement("link");
                                    e.rel = "preload", e.as = "script", e.href = t.url, document.head && document.head.appendChild(e)
                                }
                            } catch (e) {}
                        }), this.geo) {
                        T(eR).advancedLog("Fetching geo from loader with timeout: ", this.geoTimeout);
                        let e = this.getGeo(),
                            t = new ew(e => setTimeout(e, this.geoTimeout));
                        await ew.race([e, t])
                    }
                    Object.keys(this.resources).forEach(e => {
                        let t = this.resources[e];
                        (void 0 === t.trigger || !t.trigger || t.trigger()) && (void 0 === t.type || "js" === t.type ? g(this._createUrl(t.url), t.appendTo, t.async || !1, t.defer || !1, t.dataAttributes || [], t.attributes || []) : ev(this._createUrl(t.url), t.id))
                    }), T(eR).advancedLog("Loader finished at: ", Math.floor(performance.now()).toString())
                }
                maybeAddDynamicLibrary() {
                    if (this.dynamicLibrary) {
                        var e, t;
                        h("prebid_version_override") && (this._forcePrebidVersion = h("prebid_version_override"));
                        let {
                            version: r,
                            modules: i,
                            fork: s = !0
                        } = this.dynamicLibrary, n = this.globalPbjsName, o = new URL(`https://edge.aditude.io/prebid/${this._forcePrebidVersion||r}.js`);
                        "pbjs" !== n && o.searchParams.set("var", n), (!1 !== s || this._forceEnablePrebidFork) && o.searchParams.set("fork", "1"), !1 === (null != (t = this._forcePrebidYielding) ? t : null == (e = this.dynamicLibrary) ? void 0 : e.yield) && o.searchParams.set("yield", "false");
                        let a = [...new Set([...i, ...this.forcedModules, ...this.mandatoryModules])];
                        a.includes("aditude") && A && o.searchParams.set("v", A), a.forEach((e, t) => {
                            "cpmstarBidAdapter" === e && (a[t] = "cpmstarCustomBidAdapter")
                        }), [].forEach(e => {
                            let t = a.indexOf(e);
                            t > -1 && a.splice(t, 1)
                        });
                        let l = window.btoa(JSON.stringify(a.sort()));
                        o.searchParams.set("modules", l);
                        let d = {
                            name: "library",
                            appendTo: b.Head,
                            async: !0,
                            trigger: () => (!window[n] || !window[n].getConfig || "function" != typeof window[n].getConfig) && !window[n + "LibraryLoaded"] && (window[n + "LibraryLoaded"] = !0, !0),
                            url: o.toString()
                        };
                        return this.addResource(d), !0
                    }
                    return !1
                }
                setupLoaderFromConfig() {
                    var e, t, r;
                    this.dynamicLibrary = null == (e = window.ADITUDE_WRAPPER_CONFIG) ? void 0 : e.PBJS_BUILD, this.addPreset((null == (t = window.ADITUDE_WRAPPER_CONFIG) ? void 0 : t.THIRD_PARTY_SCRIPTS) || []);
                    let i = null == (r = window.ADITUDE_WRAPPER_CONFIG) ? void 0 : r.PREBID_GLOBAL;
                    "string" == typeof i && "" !== i.trim() && this.setGlobalPbjsName(i.trim())
                }
                async maybeLoadRemoteConfig() {
                    return "object" == typeof window.ADITUDE_WRAPPER_CONFIG ? (this.setupLoaderFromConfig(), !0) : !!this.loadRemoteConfig
                }
                addLibrary() {
                    if (this.maybeAddDynamicLibrary()) return;
                    let e = this.getLibraryLocation();
                    this.createCloudResource("library", e, "prebid-library.js", !0, () => (!window[this.globalPbjsName] || !window[this.globalPbjsName].getConfig || "function" != typeof window[this.globalPbjsName].getConfig) && !window[this.globalPbjsName + "LibraryLoaded"] && (window[this.globalPbjsName + "LibraryLoaded"] = !0, !0))
                }
                addWrapper() {
                    this.createCloudResource("wrapper", this.publisherKey + "/" + this.wrapper, "prebid-wrapper.js", !1)
                }
                _createUrl(e) {
                    return e
                }
                constructor(e, t = eE) {
                    e_(this, "resources", {}), e_(this, "globalPbjsName", "pbjs"), e_(this, "libraryFolder", void 0), e_(this, "dynamicLibrary", void 0), e_(this, "loadRemoteConfig", !1), e_(this, "publisherKey", void 0), e_(this, "hasLibrary", !0), e_(this, "version", '"1.4.0"'), e_(this, "wrapper", ""), e_(this, "checkForAnalytics", !0), e_(this, "geo", !0), e_(this, "geoEndpoint", "https://geo-location.prebid.cloud/v1/geo"), e_(this, "geoTimeout", 500), e_(this, "whitelistDomains", []), e_(this, "_forceEnablePrebidFork", !1), e_(this, "_forcePrebidVersion", !1), e_(this, "_forcePrebidYielding", void 0), e_(this, "_disabled", !1), e_(this, "forcedModules", ["33acrossIdSystem", "criteoIdSystem", "gptPreAuction", "id5IdSystem", "pubProvidedIdSystem", "sharedIdSystem", "unifiedIdSystem", "consentManagement", "consentManagementGpp", "gdprEnforcement", "allowActivities"]), e_(this, "mandatoryModules", ["aditude"]), this.publisherKey = e, this.version = t, ey.isEnabled() && this.forcedModules.push("lotamePanoramaIdSystem")
                }
            };
            let eS = {
                    name: "gpt",
                    appendTo: b.Head,
                    async: !0,
                    url: "https://securepubads.g.doubleclick.net/tag/js/gpt.js",
                    external: !0,
                    trigger: () => !window.googletag || !window.googletag.apiReady
                },
                eL = 30,
                eP = e => "cw-test-" + e,
                eC = e => d.get(eP(e)) || !1,
                ex = (e, t, r = eL) => {
                    d.set(eP(e), t, {
                        expires: r
                    })
                },
                eA = (e, t) => {
                    let r = t.filter(t => t.name === e);
                    return r.length > 0 && r[0]
                },
                ek = e => {
                    let t = Math.floor(1e3 * Math.random() + 1),
                        r = 0,
                        i = 0,
                        s = [...e].sort((e, t) => e.percentage > t.percentage ? 1 : e.percentage < t.percentage ? -1 : 0);
                    for (; i < s.length; i++) {
                        let e = s[i],
                            n = e.percentage / 100 * 1e3;
                        if (t <= r + n) return e;
                        r += n + 1
                    }
                };

            function ej(e, t, r) {
                return t in e ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : e[t] = r, e
            }
            class eI {
                constructor(e, t, r) {
                    ej(this, "name", void 0), ej(this, "value", void 0), ej(this, "percentage", void 0), this.name = e, this.value = t, this.percentage = r
                }
            }
            let eD = (e, t, r = !1) => ({
                experiment: e,
                fromCookie: r,
                trackingId: e + "@" + t.name,
                variant: t.name,
                value: t.value
            });
            var e$ = class {
                    variant(e) {
                        return this.variants.push(new eI(e.name, e.value, e.percentage)), this
                    }
                    pick(e = 30) {
                        if (this.selectedVariant && this.pickResponse) return this.pickResponse;
                        let t = eC(this.name);
                        if (t) {
                            let e = eA(t, this.variants);
                            if (e) return this.selectedVariant = e, this.pickResponse = eD(this.name, e, !0), this.pickResponse
                        }
                        let r = ek(this.variants);
                        if (r) return this.selectedVariant = r, this.pickResponse = eD(this.name, r, !1), ex(this.name, r.name, e), this.pickResponse;
                        T("experiment").error(`Failed to pick a variant for experiment '${this.name}'`)
                    }
                    constructor(e) {
                        ej(this, "name", void 0), ej(this, "selectedVariant", void 0), ej(this, "variants", void 0), ej(this, "pickResponse", void 0), this.name = e, this.selectedVariant = !1, this.variants = []
                    }
                },
                eO = {
                    createExperiment(e) {
                        return new e$(e)
                    }
                };
            let eq = new(function() {
                    let e = 0;

                    function t(e) {
                        let t = [],
                            r = 0,
                            i = 0;
                        this.push = function(s) {
                            r - i >= e && ++i >= e && (i = 0, r = e - 1), t[r % e] = s, r++
                        }, this.asArray = function() {
                            let s = t.slice(i, Math.min(r, e)),
                                n = t.slice(0, Math.max(r - e, 0));
                            return s.concat(n)
                        }, this.list = t
                    }

                    function r(t, r) {
                        let i = r;
                        for (let r = 0; r < t.length; r++) {
                            let s = t[r],
                                n = i.r;
                            n[s] || (n[s] = {
                                w: s,
                                r: {},
                                i: e++
                            }), i = n[s]
                        }
                        return i
                    }

                    function i(e, t, r) {
                        let i;
                        return r[e] ? i = r[e] : (i = function(e, t) {
                            let r = [
                                    [t, 0]
                                ],
                                i = {},
                                s = [];
                            for (; r.length;) {
                                let t = r.shift(),
                                    n = t[0],
                                    o = t[1],
                                    a = n.r,
                                    l = e[o];
                                if (void 0 === l && n.fn && !i[n.i] ? (i[n.i] = 1, s.push(n.fn)) : a[l] && r.push([a[l], o + 1]), a["#"])
                                    for (let t = o; t <= e.length; t++) r.push([a["#"], t]);
                                l && a["*"] && r.push([a["*"], o + 1])
                            }
                            return s
                        }(e.split("."), t), r[e] = i), i
                    }
                    let s = function() {
                        let s = {
                                w: "",
                                r: {},
                                i: e++
                            },
                            n = {},
                            o = new t(1);

                        function a(e, t) {
                            let i = r(e.split("."), s),
                                o = i.fn || [];
                            return o.push(t), i.fn = o, n = {},
                                function() {
                                    let e = o.indexOf(t);
                                    e > -1 && o.splice(e, 1)
                                }
                        }

                        function l(e, t) {
                            let r = Date.now();
                            o.push([e, r]);
                            let a = i(e, s, n),
                                l = {
                                    topic: e
                                };
                            for (let e = 0; e < a.length; e++) {
                                let r = a[e];
                                for (let e = 0; e < r.length; e++) try {
                                    r[e](t, l)
                                } catch (e) {
                                    T("event-bus").error("(error in callback)", e)
                                }
                            }
                        }
                        this.emit = l, this.on = a, this.history = function(t) {
                            let s = {
                                w: "",
                                r: {},
                                i: e++
                            };
                            r(t.split("."), s).fn = 1;
                            let n = [],
                                a = {},
                                l = o.asArray();
                            for (let e = 0; e < l.length; e++) {
                                let t = l[e];
                                i(t[0], s, a).length && n.push(t)
                            }
                            return n
                        }, this.publish = l, this.subscribe = a
                    };
                    return s.Ring = t, s
                }()),
                eN = r.g._tudePbjsGlobal || "pbjs",
                eM = new class {
                    sub(e, t) {
                        e in this.filters || (this.filters[e] = []), this.filters[e].push(t)
                    }
                    apply(e, t, r) {
                        if (!this.filters[e]) return r(t);
                        for (let r of this.filters[e]) t = r(t);
                        return r(t)
                    }
                    constructor() {
                        var e, t;
                        t = {}, (e = "filters") in this ? Object.defineProperty(this, e, {
                            value: t,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : this[e] = t
                    }
                };

            function eU(e, t, r) {
                return t in e ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : e[t] = r, e
            }
            let eF = {};
            eM.sub("wrapperConfigOnInit", e => (eF = e.AMAZON_HASH_MAP || {}, e));
            let eG = function(e = eN) {
                    return e = e.length > 0 ? e : eN, window[e] = window[e] || {
                        cmd: [],
                        que: []
                    }, window[e].cmd = window[e].cmd || [], window[e].que = window[e].que || [], window[e]
                }(),
                eB = T("GooglePublisherTag").setLabel("GooglePublisherTag", "#039be5");

            function eH() {
                if (void 0 === s) {
                    var e;
                    s = null != (e = e3({
                        date: "20260617",
                        name: "gpt-setconfig-init",
                        tracking: "",
                        insights: "abtest2",
                        variants: [{
                            name: "control",
                            value: !1,
                            percent: 50,
                            control: !0
                        }, {
                            name: "test",
                            value: !0,
                            percent: 50,
                            control: !1
                        }]
                    })) && e
                }
                return s
            }
            let ez = new class {
                setConfig(e) {
                    this.config = e
                }
                init() {
                    let {
                        enableSingleRequest: e,
                        setForceSafeFrame: t,
                        setCentering: r,
                        disableInitialLoad: i,
                        enableLazyLoad: s,
                        collapseEmptyDivs: n
                    } = this.config;
                    if (this.googleTagInitialized) return;
                    eB.log("Initialized", this.config), this.googleTagInitialized = !0;
                    let o = this.getGlobal();
                    this.push(() => {
                        if (eH()) {
                            let a = {};
                            n && (a.collapseDiv = "ON_NO_FILL"), e && (a.singleRequest = !0), t && (a.safeFrame = {
                                forceSafeFrame: !0
                            }), r && (a.centering = !0), i && (a.disableInitialLoad = !0), s && (a.lazyLoad = s), Object.keys(a).length && o.setConfig(a)
                        } else n && o.pubads().collapseEmptyDivs(), e && o.pubads().enableSingleRequest(), t && o.pubads().setForceSafeFrame(!0), r && o.pubads().setCentering(!0), i && o.pubads().disableInitialLoad(), s && o.pubads().enableLazyLoad(s);
                        o.enableServices()
                    })
                }
                addAllEventListeners() {
                    this.eventListenersAdded || (eB.log("Adding all event listeners"), this.eventListenersAdded = !0, this.push(() => {
                        this.addEventListener("slotRenderEnded", e => {
                            var t, r, i, s, n;
                            let o = Array.isArray(null == e ? void 0 : e.size) && 0 === e.size[0] && 0 === e.size[1],
                                a = e.slot,
                                l = null == a ? void 0 : a.getSlotElementId(),
                                d = document.getElementById(l),
                                u = null == a ? void 0 : a.getTargetingMap(),
                                h = a.getSizes().filter(e => e.getWidth && e.getHeight).map(e => [e.getWidth(), e.getHeight()]),
                                c = function(e) {
                                    try {
                                        return eG.adUnits.find(t => t.code === e)
                                    } catch (e) {}
                                    return !1
                                }(l),
                                p = String((null == a || null == (t = a.getTargeting("hb_pb")) ? void 0 : t[0]) || "").trim(),
                                f = !!(p && Number(p)),
                                g = !!(null == a || null == (r = a.getTargeting("amziid")) ? void 0 : r[0]),
                                b = null == a || null == (i = a.getTargeting("hb_bidder")) ? void 0 : i[0],
                                m = null == a ? void 0 : a.getAdUnitPath(),
                                y = null == e ? void 0 : e.responseIdentifier,
                                v = window.console.warn;
                            window.console.warn = () => {};
                            let w = (null == a ? void 0 : a.getResponseInformation()) ? a.getHtml() : "";
                            window.console.warn = v;
                            let _ = w.includes("apstag.renderImp"),
                                E = !e.isEmpty,
                                R = a.getResponseInformation(),
                                T = e.campaignId,
                                S = e.lineItemId,
                                L = !!w.match(/(?:prebid-universal|(?:ucTag|pbjs)\.renderAd|window\.pbRender)/),
                                P = [...w.matchAll(/<!--\s*tude_[a-z_]+(?::[0-9]+s)?\s*-->/g)].map(e => e[0].replace(/<!--\s*|\s*-->/g, "")),
                                C = null == u || null == (s = u.amzniid) ? void 0 : s[0],
                                x = null == u || null == (n = u.amznbid) ? void 0 : n[0],
                                A = eF[null == x ? void 0 : x.replace(/^(v_|o_)/, "")],
                                k = [];
                            A && k.push(A), isNaN(Number(p)) || k.push(p);
                            let j = Math.max(...k),
                                I = {
                                    aditudeComments: P,
                                    amazonBid: A,
                                    amzniid: C,
                                    isPrebidWin: L,
                                    isNative: o,
                                    slot: a,
                                    adSlot: d,
                                    adUnitPath: m,
                                    divId: l,
                                    prebidUnit: c,
                                    hasBid: g || f,
                                    hasPrebidBid: f,
                                    hbBidder: b,
                                    prebidBid: Number(p),
                                    targetingMap: u,
                                    highBid: j,
                                    sizes: h,
                                    isAmazonWin: _,
                                    filled: E,
                                    info: R,
                                    orderId: T,
                                    lineItemId: S,
                                    responseIdentifier: y
                                };
                            eq.emit("gpt.slotRenderEnded", I), eq.emit("gpt.slotRenderEnded.${divId}", I)
                        })
                    }))
                }
                setPrivacySettings(e) {
                    let t = this.getGlobal();
                    this.push(() => {
                        t.pubads().setPrivacySettings(e)
                    })
                }
                setPublisherProvidedId(e) {
                    let t = this.getGlobal();
                    this.push(() => {
                        t.pubads().setPublisherProvidedId(e)
                    })
                }
                getGlobal() {
                    return window.googletag = window.googletag || {}, window.googletag.cmd = window.googletag.cmd || [], window.googletag
                }
                pubadsLoaded() {
                    return "function" == typeof this.getGlobal().pubads
                }
                destroySlots(e) {
                    let t = this.getGlobal();
                    this.push(() => {
                        eq.emit("gpt.destroySlots", {
                            divIds: null == e ? void 0 : e.map(e => e.getSlotElementId()),
                            destroyAll: !e.length,
                            slots: e
                        }), t.destroySlots(e)
                    })
                }
                destroySlotsByDivIds(e) {
                    let t = this.getGlobal();
                    this.push(() => {
                        t.destroySlots(this.getSlotListByDivIds(e))
                    })
                }
                destroyAllSlots() {
                    let e = this.getGlobal();
                    this.push(() => {
                        e.destroySlots()
                    })
                }
                push(e) {
                    this.getGlobal().cmd.push(e)
                }
                getAllSlots() {
                    return this.pubadsLoaded() ? this.getGlobal().pubads().getSlots() : []
                }
                getAllSlotDivIds() {
                    return this.getAllSlots().map(e => e.getSlotElementId())
                }
                getSlotByDivId(e) {
                    return this.getAllSlots().find(t => t.getSlotElementId() === e)
                }
                getSlotListByDivIds(e) {
                    return this.getAllSlots().filter(t => e.includes(t.getSlotElementId()))
                }
                setSlotTargeting(e, t) {
                    if (eH()) {
                        let r = {};
                        Object.keys(t).forEach(e => {
                            r[e] = [].concat(t[e]).map(String)
                        }), e.setConfig({
                            targeting: r
                        })
                    } else Object.keys(t).forEach(r => {
                        e.setTargeting(r, t[r])
                    })
                }
                refreshDivIds(e) {
                    if (!e.length) return !1;
                    let t = this.getGlobal(),
                        r = this.getSlotListByDivIds(e);
                    return !!r.length && (this.push(() => {
                        t.pubads().refresh(r)
                    }), !0)
                }
                defineGptSlot({
                    adUnit: e,
                    sizes: t,
                    divId: r
                }) {
                    eB.log("Defining slot", {
                        adUnit: e,
                        sizes: t,
                        divId: r
                    });
                    let i = this.getGlobal().defineSlot(e, t, r);
                    if (i) return i.addService(googletag.pubads()), i
                }
                defineOutOfPageSlot(e, t) {
                    let r = this.getGlobal().defineOutOfPageSlot(e, t);
                    if (r) return r.addService(googletag.pubads()), r
                }
                addEventListener(e, t) {
                    let r = this.getGlobal();
                    this.push(() => {
                        r.pubads().addEventListener(e, t)
                    })
                }
                setTargeting(e) {
                    let t = this.getGlobal();
                    this.push(() => {
                        let r = {};
                        Object.keys(e).forEach(t => {
                            r[t] = [].concat(e[t]).map(String)
                        }), eH() ? t.setConfig({
                            targeting: r
                        }) : Object.keys(r).forEach(e => {
                            t.pubads().setTargeting(e, r[e])
                        })
                    })
                }
                clearTargeting(e) {
                    let t = this.getGlobal();
                    this.push(() => {
                        eH() ? t.setConfig({
                            targeting: e ? {
                                [e]: null
                            } : null
                        }) : t.pubads().clearTargeting(e)
                    })
                }
                getTargeting(e) {
                    let t = this.getGlobal();
                    if (eH()) {
                        var r, i;
                        return [].concat(null != (i = ((null == (r = t.getConfig("targeting")) ? void 0 : r.targeting) || {})[e]) ? i : [])
                    }
                    return t.pubads().getTargeting(e)
                }
                refresh(e) {
                    let t = this.getGlobal();
                    this.push(() => {
                        t.pubads().refresh(e)
                    })
                }
                setPageUrl(e) {
                    let t = this.getGlobal();
                    this.push(() => {
                        eH() ? t.setConfig({
                            adsenseAttributes: {
                                page_url: e
                            }
                        }) : t.pubads().set("page_url", e)
                    })
                }
                updateCorrelator() {
                    let e = this.getGlobal();
                    this.push(() => {
                        e.pubads().updateCorrelator()
                    })
                }
                constructor() {
                    eU(this, "googleTagInitialized", !1), eU(this, "eventListenersAdded", !1), eU(this, "config", void 0)
                }
            };

            function eV(e, t, r) {
                return t in e ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : e[t] = r, e
            }
            var eK = class {
                setState(e) {
                    let t = [];
                    for (let r in e) r in this.props && (t.push(r), this.props[r] = e[r]);
                    this.isReady || (this.isReady = !0, this.triggerReadyCallbacks()), this.triggerStateChangeCallbacks(t)
                }
                onStateChange(e, t) {
                    this.onStateChangeCallbacks.push({
                        cb: e,
                        depProps: t
                    })
                }
                triggerStateChangeCallbacks(e) {
                    this.onStateChangeCallbacks.length < 1 || this.onStateChangeCallbacks.filter(t => t.depProps.some(t => e.includes(t))).forEach(e => {
                        e.cb(this.props)
                    })
                }
                onReady(e) {
                    this.isReady ? e() : this.onReadyCallbacks.push(e.bind(this))
                }
                triggerReadyCallbacks() {
                    this.onReadyCallbacks.length < 1 || (this.onReadyCallbacks.forEach(e => e()), this.onReadyCallbacks = [])
                }
                constructor(e) {
                    eV(this, "isReady", !1), eV(this, "onStateChangeCallbacks", []), eV(this, "onReadyCallbacks", []), eV(this, "props", void 0), this.props = e
                }
            };
            let eW = ["param1", "param2", "param3", "param4", "param5", "param6", "param7", "param8", "param9", "param10"],
                eJ = new class extends eK {
                    getTargeting() {
                        return this.props.targeting
                    }
                    setTargeting(e) {
                        this.setState({
                            targeting: function(e) {
                                for (var t = 1; t < arguments.length; t++) {
                                    var r = null != arguments[t] ? arguments[t] : {},
                                        i = Object.keys(r);
                                    "function" == typeof Object.getOwnPropertySymbols && (i = i.concat(Object.getOwnPropertySymbols(r).filter(function(e) {
                                        return Object.getOwnPropertyDescriptor(r, e).enumerable
                                    }))), i.forEach(function(t) {
                                        var i;
                                        i = r[t], t in e ? Object.defineProperty(e, t, {
                                            value: i,
                                            enumerable: !0,
                                            configurable: !0,
                                            writable: !0
                                        }) : e[t] = i
                                    })
                                }
                                return e
                            }({}, this.props.targeting, e)
                        })
                    }
                }({
                    targeting: {}
                });
            eJ.onStateChange(({
                targeting: e
            }) => {
                for (let t in eq.emit("pageContext.setTargeting", e), ez.setTargeting(e), e) eq.emit(`pageContext.setTargeting.${t}`, {
                    key: t,
                    value: e[t]
                }), eW.includes(t) && L.setCustomParams({
                    [t]: e[t]
                })
            }, ["targeting"]);
            var eY = r(86964).Promise;

            function eX(e, t, r) {
                return t in e ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : e[t] = r, e
            }
            class eQ {
                static get() {
                    return this.singleton || (this.singleton = new eQ), this.singleton
                }
                resolveName(e) {
                    let t = this.aliasToKey.get(e);
                    return t || (this.results.has(e) ? e : void 0)
                }
                createHandle(e) {
                    let t = this.results.get(e);
                    return {
                        variantName: () => t.variant,
                        is: e => t.variant === e,
                        value: () => t.value
                    }
                }
                setResult(e, t, r = []) {
                    let i = this.results.get(e);
                    for (let s of (i ? i.variant !== t.variant && T().error(`ExperimentManager.setResult conflict for "${e}"`, Error("Conflicting experiment result")) : this.results.set(e, t), this.aliasToKey.set(e, e), r)) this.aliasToKey.set(s, e);
                    let s = t => {
                        let r = this.waiters.get(t);
                        if (!r || 0 === r.length) return;
                        this.waiters.delete(t);
                        let i = this.createHandle(e);
                        for (let e of r) {
                            e.timer && clearTimeout(e.timer);
                            try {
                                e.resolve(i)
                            } catch (e) {
                                T().error("ExperimentManager waiter resolve error", e)
                            }
                        }
                    };
                    for (let t of (s(e), r)) s(t);
                    return this.createHandle(e)
                }
                link(e, t = {
                    throwIfMissing: !0
                }) {
                    let r = this.resolveName(e);
                    if (!r) {
                        !1 !== t.throwIfMissing && T().error(`ExperimentManager.link missing result for "${e}"`, Error("Experiment not resolved"));
                        return
                    }
                    return this.createHandle(r)
                }
                asyncLink(e, t) {
                    var r;
                    let i = this.resolveName(e);
                    if (i) return eY.resolve(this.createHandle(i));
                    let s = null != (r = null == t ? void 0 : t.timeoutMs) ? r : 2e4;
                    return new eY((t, r) => {
                        var i;
                        let n = null != (i = this.waiters.get(e)) ? i : [];
                        this.waiters.set(e, n);
                        let o = {
                            resolve: t,
                            reject: r,
                            timer: void 0
                        };
                        n.push(o), o.timer = setTimeout(() => {
                            let t = this.waiters.get(e);
                            t && this.waiters.set(e, t.filter(e => e !== o));
                            let i = Error(`ExperimentManager.asyncLink timeout for "${e}" after ${s}ms`);
                            T().error("Experiment link timeout", i), r(i)
                        }, s)
                    })
                }
                has(e) {
                    return !!this.resolveName(e)
                }
                reset(e) {
                    if (!e) {
                        this.results.clear(), this.aliasToKey.clear(), this.waiters.clear();
                        return
                    }
                    let t = this.resolveName(e);
                    if (t) {
                        for (let [e, r] of (this.results.delete(t), Array.from(this.aliasToKey.entries()))) r === t && this.aliasToKey.delete(e);
                        let r = this.waiters.get(e);
                        if (r) {
                            this.waiters.delete(e);
                            let t = Error(`ExperimentManager.reset while waiters pending for "${e}"`);
                            for (let e of r) {
                                e.timer && clearTimeout(e.timer);
                                try {
                                    e.reject(t)
                                } catch (e) {
                                    T().error("ExperimentManager waiter reject error", e)
                                }
                            }
                        }
                    }
                }
                constructor() {
                    eX(this, "results", new Map), eX(this, "aliasToKey", new Map), eX(this, "waiters", new Map)
                }
            }
            eX(eQ, "singleton", void 0);
            let eZ = eQ.get(),
                e0 = ["param1", "param2", "param3", "param4", "param5", "param6", "param7", "param8", "param9", "param10", "param11", "param12", "param13", "param14", "param15", "abtest1", "abtest2", "abtest3", "abtest4", "abtest5"],
                e1 = T("quick-test").setLabel("A/B Quick Test");

            function e3({
                name: e,
                date: t,
                condition: r = !0,
                tracking: i,
                variants: s,
                insights: n = !1,
                trackNonCondition: o = !1
            }) {
                let a, l = `${t}_${e}`,
                    d = `${t}_${e}_${s.map(e=>e.percent).join("_")}`;
                if (!r && !o) return void T().log(`Experiment "${e}" is not conditionally enabled, skipping test and tracking`);
                if (!Array.isArray(s) || 0 === s.length) return void e1.error(`Experiment "${e}" must have at least one variant.`);
                let u = 0,
                    h = new Set,
                    c = 0;
                for (let t of s) {
                    if ("number" != typeof t.percent || t.percent < 0 || t.percent > 100) return void e1.error(`Variant "${t.name}" has an invalid percent value: ${t.percent}. Must be a number between 0 and 100.`);
                    if (h.has(t.name)) return void e1.error(`Duplicate variant name "${t.name}" found in experiment "${e}". Variant names must be unique.`);
                    !0 === t.control && (c++, a = t.name), h.add(t.name), u += t.percent
                }
                let p = 1 !== c;
                if (0 === c && e1.error(`Experiment "${e}" must have exactly one variant with control: true. Found none.`), c > 1 && e1.error(`Experiment "${e}" must have exactly one variant with control: true. Found ${c}.`), 100 !== u) return void e1.error(`Total percentage for experiment "${e}" is ${u}, but it must equal 100.`);
                if (!1 !== n && !e0.includes(n)) return void e1.error(`Invalid insights parameter "${n}" provided for experiment "${e}".`);
                let f = eO.createExperiment(d);
                s.forEach(e => {
                    f.variant({
                        name: e.name,
                        value: e.value,
                        percentage: e.percent
                    })
                });
                let g = f.pick();
                try {
                    let t = [e, d, l];
                    eZ.setResult(d, {
                        variant: g.variant,
                        value: g.value
                    }, t)
                } catch (e) {
                    T().error("ExperimentManager.setResult failed", e)
                }
                if (n) {
                    let e = 1 === c && g.variant === a,
                        t = s.find(e => e.name === g.variant),
                        r = null == t ? void 0 : t.percent;
                    x({
                        [n]: `${l}_${p?"error":e?"control":"test"}_${g.variant.replace("_","-")}_${r}`
                    })
                }
                return (e1.log(e, g), i && eJ.setTargeting({
                    [`tude_${i}`]: g.variant
                }), !r && o) ? void T().log(`Experiment "${e}" is not conditionally enabled, still tracking variant ${g.variant} for ${n} / ${i}`) : g.value
            }
            async function e6(e) {
                let t = `https://htlbid.com/stage/v3/${e}/bridge-htlbid.js`,
                    r = `https://htlbid.com/v3/${e}/bridge-htlbid.js`;
                if ((await fetch(t, {
                        method: "HEAD"
                    })).ok) return t;
                if ((await fetch(r, {
                        method: "HEAD"
                    })).ok) return r;
                throw Error("Error fetching Bridge URL: Could not find Bridge deployed in either stage or prod.")
            }
            async function e2({
                loader: e,
                website: t,
                onPercent: r = 100,
                tracking: i = "htl",
                insights: s = "param1"
            }) {
                if (e3({
                        date: "00000000",
                        name: "htlbid-tude",
                        tracking: i,
                        insights: s,
                        variants: [{
                            name: "htl",
                            value: !0,
                            percent: r,
                            control: !1
                        }, {
                            name: "tude",
                            value: !1,
                            percent: 100 - r,
                            control: !0
                        }]
                    })) try {
                    let e = await e6(t);
                    em(e, "head", !0)
                } catch (t) {
                    T().error(t), e.start()
                } else e.start()
            }
            let e4 = ["askubuntu", "serverfault"];
            window.googletag = window.googletag || {}, window.googletag.cmd = window.googletag.cmd || [], window.googletag.cmd.push(() => {
                window.googletag.pubads().setTargeting("htlbidid", "cw")
            });
            let e5 = new eT("stackoverflow-M6HzSe6yue", !1);
            e5.addPreset([eS]), e5.setLibraryFolder("mapping.base"), e5.setWrapper("mapping.base"), e5.appendForcedModules(["prebidServerBidAdapter", ... function() {
                let e = globalThis.location.hostname,
                    t = [];
                return (e4.some(t => e.includes(t)) || "true" === h("enforce_gpp_test")) && t.push("gppControl_usnat"), t
            }()]), e5.forcePrebidVersion("9.53.5"), e5.setLoadRemoteConfig(), e2({
                loader: e5,
                website: "mapping.base",
                onPercent: 0
            })
        }()
}();