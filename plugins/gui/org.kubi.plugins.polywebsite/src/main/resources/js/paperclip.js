(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
    var nofactor = require("nofactor");
    var defaults = require("./defaults");
    var template = require("./template");
    var parser   = require("./parser");

    template.parser = parser;

    var paperclip = module.exports = {

        /**
         */

        accessors: defaults.accessors,

        /**
         */

        runloop: defaults.runloop,

        /**
         */

        document: nofactor,

        /**
         * web component base class
         */

        Component : require("./components/base"),

        /**
         */

        Attribute : require("./attributes/script"),

        /**
         * template factory
         */

        template  : template,

        /**
         */

        components : defaults.components,

        /**
         */

        attributes : defaults.attributes,

        /**
         */

        modifiers: defaults.modifiers,

        /**
         */

        parse: parser.parse
    };

    /* istanbul ignore next */
    if (typeof window !== "undefined") {

        window.paperclip = paperclip;

        // no conflict mode. Release paperclip from global scope.
        window.paperclip.noConflict = function() {
            delete window.paperclip;
            return paperclip;
        };
    }

},{"./attributes/script":15,"./components/base":18,"./defaults":24,"./parser":46,"./template":53,"nofactor":78}],2:[function(require,module,exports){
    var protoclass = require("protoclass");

    /**
     */

    function BaseAccessor() {
    }

    /**
     */

    module.exports = protoclass(BaseAccessor, {
        __isScope: true

        /*accessible: function(context) {
         // override me
         },
         castObject: function(context) {
         // override me
         },
         castCollection: function(context) {
         // override me
         },
         normalizeObject: function(context) {
         // override me
         },
         normalizeCollection: function(context) {
         // override me
         },
         get: function(context, path) {
         // override me
         },
         set: function(context, path, value) {
         // override me
         },
         call: function(context, ctxPath, fnPath, params) {
         // override me
         },
         watchProperty: function(context, path, listener) {
         // override me
         },
         watchEvent: function(context, operation, listener) {
         // override me
         },
         dispose: function() {

         }*/
    });

},{"protoclass":79}],3:[function(require,module,exports){
    var BaseAccessor = require("./base");
    var _set         = require("../utils/set");

    function POJOAccessor() {
        BaseAccessor.call(this);
        this._getters  = {};
        this._callers  = {};
        this._watchers = [];
    }

    module.exports = BaseAccessor.extend(POJOAccessor, {

        /**
         */

        castObject: function(object) { return object; },

        /**
         */

        call: function(object, path, params) {
            var caller;
            if (!(caller = this._callers[path])) {
                var ctxPath = ["this"].concat(path.split("."));
                ctxPath.pop();
                ctxPath = ctxPath.join(".");
                caller = this._callers[path] = new Function("params", "return this." + path + ".apply(" + ctxPath + ", params);");
            }
            try {
                var ret = caller.call(object, params);
                this.applyChanges();
                return ret;
            } catch (e) {
                return void 0;
            }
        },

        /**
         */

        get: function (object, path) {

            var keys = typeof path === "string" ? path.split(".") : path;
            var ct = object;
            var key;
            for (var i = 0, n = keys.length - 1; i < n; i++) {
                key = keys[i];
                if (!ct[key]) {
                    ct[key] = {};
                }
                ct = ct[key];
            }
            if (ct['_metaClass'] != undefined) {
                var lastKey = keys[keys.length - 1];
                if (lastKey == 'uuid') {
                    return ct.uuid();
                } else if (lastKey == 'now') {
                    return ct.now();
                } else {
                    return ct.getByName(keys[keys.length - 1]);
                }
            } else {
                var pt = typeof path !== "string" ? path.join(".") : path;
                var getter;
                if (!(getter = this._getters[pt])) {
                    getter = this._getters[pt] = new Function("return this." + pt);
                }
                try {
                    return getter.call(object);
                } catch (e) {
                    return void 0;
                }
            }
        },
        set: function (object, path, value) {
            var keys = typeof path === "string" ? path.split(".") : path;
            var ct = object;
            var key;
            for (var i = 0, n = keys.length - 1; i < n; i++) {
                key = keys[i];
                if (!ct[key]) {
                    ct[key] = {};
                }
                ct = ct[key];
            }
            if (ct['_metaClass'] != undefined) {
                ct.setByName(keys[keys.length - 1], value);
            } else {
                ct[keys[keys.length - 1]] = value;
            }
            this.applyChanges();
            return value;
        },

        /**
         */

        watchProperty: function(object, path, listener) {

            var self = this;
            var currentValue;
            var firstCall = true;

            return this._addWatcher(function() {
                var newValue = self.get(object, path);
                if (!firstCall && newValue === currentValue && typeof newValue !== "function") return;
                firstCall = false;
                var oldValue = currentValue;
                currentValue = newValue;
                listener(newValue, currentValue);
            });
        },

        /**
         */

        _addWatcher: function(applyChanges) {

            var self = this;

            var watcher = {
                apply: applyChanges,
                trigger: applyChanges,
                dispose: function() {
                    var i = self._watchers.indexOf(watcher);
                    if (~i) self._watchers.splice(i, 1);
                }
            };

            this._watchers.push(watcher);

            return watcher;
        },

        /**
         */

        watchEvent: function(object, event, listener) {

            if (Object.prototype.toString.call(object) === "[object Array]" && event === "change") {
                return this._watchArrayChangeEvent(object, listener);
            }

            return {
                dispose: function() { }
            };
        },

        /**
         */

        _watchArrayChangeEvent: function(object, listener) {

            var copy = object.concat();

            return this._addWatcher(function() {

                var hasChanged = object.length !== copy.length;

                if (!hasChanged) {
                    for (var i = 0, n = copy.length; i < n; i++) {
                        hasChanged = (copy[i] !== object[i]);
                        if (hasChanged) break;
                    }
                }

                if (hasChanged) {
                    copy = object.concat();
                    listener();
                }
            });
        },

        /**
         */

        normalizeCollection: function(collection) {
            return collection;
        },

        /**
         */

        normalizeObject: function(object) {
            return object;
        },

        /**
         * DEPRECATED
         */

        apply: function() {
            this.applyChanges();
        },

        /**
         */

        applyChanges: function() {
            // if (this.__applyingChanges) return;
            // this.__applyingChanges = true;
            for (var i = 0, n = this._watchers.length; i < n; i++) {
                this._watchers[i].apply();
            }
            // this.__applyingChanges = false;
        }
    });

},{"../utils/set":73,"./base":2}],4:[function(require,module,exports){
    var protoclass = require("protoclass");

    /**
     * attribute binding
     */

    function Attribute(options) {

        this.view     = options.view;
        this.node     = options.node;
        this.section  = options.section;
        this.key      = options.key;
        this.value    = options.value;
        this.document = this.view.template.document;

        // initialize the DOM elements
        this.initialize();
    }

    /**
     */

    module.exports = protoclass(Attribute, {

        /**
         */

        initialize: function() {
        },

        /**
         */

        bind: function() {
        },

        /**
         */

        unbind: function() {
        }
    });

},{"protoclass":79}],5:[function(require,module,exports){
    var ScriptAttribute = require("./script");

    /**
     */

    module.exports = ScriptAttribute.extend({

        /**
         */

        update: function() {

            var classes = this.currentValue;

            if (typeof classes === "string") {
                return this.node.setAttribute("class", classes);
            }

            if (!classes) {
                return this.node.removeAttribute("class");
            }

            var classesToUse = this.node.getAttribute("class");
            classesToUse     = classesToUse ? classesToUse.split(" ") : [];

            for (var classNames in classes) {

                var useClass = classes[classNames];
                var classNamesArray = classNames.split(/[,\s]+/g);

                for (var i = 0, n = classNamesArray.length; i < n; i++) {
                    var className = classNamesArray[i];

                    var j = classesToUse.indexOf(className);
                    if (useClass) {
                        if (!~j) {
                            classesToUse.push(className);
                        }
                    } else if (~j) {
                        classesToUse.splice(j, 1);
                    }
                }
            }

            this.node.setAttribute("class", classesToUse.join(" "));
        }
    });

    module.exports.test = function(value) {
        return typeof value === "object" && !value.buffered;
    };

},{"./script":15}],6:[function(require,module,exports){
    var KeyCodedEventAttribute = require("./keyCodedEvent");

    /**
     */

    module.exports = KeyCodedEventAttribute.extend({
        keyCodes: [8]
    });

},{"./keyCodedEvent":14}],7:[function(require,module,exports){
    var BaseAttribue = require("./base");

    /**
     */

    module.exports = BaseAttribue.extend({
        initialize: function() {
            this.view.transitions.push(this);
        },
        enter: function() {
            var v = this.value;
            v = v.evaluate(this.view);
            v(this.node, function() { });
        }
    });

},{"./base":4}],8:[function(require,module,exports){
    var BaseAttribue = require("./base");

    /**
     */

    module.exports = BaseAttribue.extend({
        initialize: function() {
            this.view.transitions.push(this);
        },
        exit: function(complete) {
            var v = this.value;
            v = v.evaluate(this.view);
            v(this.node, complete);
        }
    });

},{"./base":4}],9:[function(require,module,exports){
    var ScriptAttribute = require("./script");

    /**
     */

    module.exports = ScriptAttribute.extend({
        update: function() {
            if (this.currentValue) {
                this.node.removeAttribute("disabled");
            } else {
                this.node.setAttribute("disabled", "disabled");
            }
        }
    });

},{"./script":15}],10:[function(require,module,exports){
    var KeyCodedEventAttribute = require("./keyCodedEvent");

    /**
     */

    module.exports = KeyCodedEventAttribute.extend({
        keyCodes: [13]
    });

},{"./keyCodedEvent":14}],11:[function(require,module,exports){
    var KeyCodedEventAttribute = require("./keyCodedEvent");

    /**
     */

    module.exports = KeyCodedEventAttribute.extend({
        keyCodes: [27]
    });

},{"./keyCodedEvent":14}],12:[function(require,module,exports){
    var protoclass = require("protoclass");
    var _bind      = require("../utils/bind");
    var Base       = require("./base");

    /**
     */

    function EventAttribute(options) {
        this._onEvent = _bind(this._onEvent, this);
        Base.call(this, options);
    }

    /**
     */

    Base.extend(EventAttribute, {

        /**
         */

        initialize: function() {
            // convert onEvent to event
            var event = this.event || (this.event = this.key.toLowerCase().replace(/^on/, ""));
            this.node.addEventListener(event, this._onEvent);
        },

        /**
         */

        bind: function() {
            Base.prototype.bind.call(this);
            this.bound = true;
        },

        /**
         */

        _onEvent: function(event) {
            if (!this.bound) return;
            event.preventDefault();
            this.view.set("event", event);
            this.value.evaluate(this.view);
        },

        /**
         */

        unbind: function() {
            this.bound = false;
        }
    });

    module.exports = EventAttribute;

},{"../utils/bind":70,"./base":4,"protoclass":79}],13:[function(require,module,exports){
    (function (process){
        var ScriptAttribute = require("./script");

        /**
         */

        module.exports = ScriptAttribute.extend({

            /**
             */

            update: function() {
                if (!this.currentValue) return;
                if (this.node.focus) {
                    var self = this;

                    if (!process.browser) return this.node.focus();

                    // focus after being on screen. Need to break out
                    // of animation, so setTimeout is the best option
                    setTimeout(function() {
                        self.node.focus();
                    }, 1);
                }
            }
        });

    }).call(this,require('_process'))
},{"./script":15,"_process":76}],14:[function(require,module,exports){
    var EventDataBinding = require("./event");

    /**
     */

    module.exports = EventDataBinding.extend({

        /**
         */

        event: "keydown",

        /**
         */

        keyCodes: [],

        /**
         */

        _onEvent: function(event) {

            if (!~this.keyCodes.indexOf(event.keyCode)) {
                return;
            }

            EventDataBinding.prototype._onEvent.apply(this, arguments);
        }
    });

},{"./event":12}],15:[function(require,module,exports){
    var BaseAttribute = require("./base");

    /**
     */

    module.exports = BaseAttribute.extend({

        /**
         */

        bind: function() {
            BaseAttribute.prototype.bind.call(this);
            var self = this;

            if (this.value.watch) {
                this._binding = this.value.watch(this.view, function(nv) {
                    if (nv === self.currentValue) return;
                    self.currentValue = nv;
                    self.view.runloop.deferOnce(self);
                });

                this.currentValue = this.value.evaluate(this.view);
            }

            if (this.currentValue != null) this.update();
        },

        /**
         */

        update: function() {

        },

        /**
         */

        unbind: function() {
            if (this._binding) this._binding.dispose();
        }
    });

},{"./base":4}],16:[function(require,module,exports){
    var ScriptAttribute = require("./script");

    /**
     */

    module.exports = ScriptAttribute.extend({

        /**
         */

        bind: function() {
            this._currentStyles = {};
            ScriptAttribute.prototype.bind.call(this);
        },

        /**
         */

        update: function() {

            var styles = this.currentValue;

            var newStyles = {};

            for (var name in styles) {
                var style = styles[name];
                if (style !== this._currentStyles[name]) {
                    newStyles[name] = this._currentStyles[name] = style || "";
                }
            }

            if (this.node.__isNode) {
                this.node.style.setProperties(newStyles);
            } else {
                for (var key in newStyles) {
                    this.node.style[key] = newStyles[key];
                }
            }
        }
    });

    /**
     */

    module.exports.test = function(value) {
        return typeof value === "object" && !value.buffered;
    };

},{"./script":15}],17:[function(require,module,exports){
    (function (process){
        var BaseAttribute = require("./script");
        var _bind         = require("../utils/bind");

        /**
         */

        function ValueAttribute(options) {
            this._onInput = _bind(this._onInput, this);
            BaseAttribute.call(this, options);
        }

        /**
         */

        BaseAttribute.extend(ValueAttribute, {

            /**
             */

            _events: ["change", "keyup", "input"],

            /**
             */

            initialize: function() {
                var self = this;
                this._events.forEach(function(event) {
                    self.node.addEventListener(event, self._onInput);
                });
            },

            /**
             */

            bind: function() {
                BaseAttribute.prototype.bind.call(this);

                var self = this;

                // TODO - move this to another attribute helper (more optimal)
                if (/^(text|password|email)$/.test(this.node.getAttribute("type"))) {
                    this._autocompleteCheckInterval = setInterval(function() {
                        self._onInput();
                    }, process.browser ? 500 : 10);
                }
            },

            /**
             */

            unbind: function() {
                BaseAttribute.prototype.unbind.call(this);
                clearInterval(this._autocompleteCheckInterval);

                var self = this;
            },

            /**
             */

            update: function() {

                var model = this.model = this.currentValue;

                if (this._modelBindings) this._modelBindings.dispose();

                if (!model || !model.__isReference) {
                    throw new Error("input value must be a reference. Make sure you have <~> defined");
                }

                var self = this;

                if (model.gettable) {
                    this._modelBindings = this.view.watch(model.path, function(value) {
                        self._elementValue(self._parseValue(value));
                    });

                    this._modelBindings.trigger();
                }
            },

            _parseValue: function(value) {
                if (value == null || value === "") return void 0;
                return value;
            },

            /**
             */

            _onInput: function(event) {

                clearInterval(this._autocompleteCheckInterval);

                // ignore some keys
                if (event && (!event.keyCode || !~[27].indexOf(event.keyCode))) {
                    event.stopPropagation();
                }

                var value = this._parseValue(this._elementValue());

                if (!this.model) return;

                if (String(this.model.value()) == String(value))  return;

                this.model.value(value);
            },

            /**
             */

            _elementValue: function(value) {

                var isCheckbox        = /checkbox/.test(this.node.type);
                var isRadio           = /radio/.test(this.node.type);
                var isRadioOrCheckbox = isCheckbox || isRadio;
                var hasValue          = Object.prototype.hasOwnProperty.call(this.node, "value");
                var isInput           = hasValue || /input|textarea|checkbox/.test(this.node.nodeName.toLowerCase());

                if (!arguments.length) {
                    if (isCheckbox) {
                        return Boolean(this.node.checked);
                    } else if (isInput) {
                        return this.node.value || "";
                    } else {
                        return this.node.innerHTML || "";
                    }
                }

                if (value == null) {
                    value = "";
                } else {
                    clearInterval(this._autocompleteCheckInterval);
                }

                if (isRadioOrCheckbox) {
                    if (isRadio) {
                        if (String(value) === String(this.node.value)) {
                            this.node.checked = true;
                        }
                    } else {
                        this.node.checked = value;
                    }
                } else if (String(value) !== this._elementValue()) {

                    if (isInput) {
                        this.node.value = value;
                    } else {
                        this.node.innerHTML = value;
                    }
                }
            }
        });

        /**
         */

        ValueAttribute.test = function(value) {
            return typeof value === "object" && !value.buffered;
        };

        /**
         */

        module.exports = ValueAttribute;

    }).call(this,require('_process'))
},{"../utils/bind":70,"./script":15,"_process":76}],18:[function(require,module,exports){
    var protoclass = require("protoclass");
    var _bind      = require("../utils/bind");

    /**
     */

    function Component(options) {

        this.attributes    = options.attributes;
        this.childTemplate = options.childTemplate;
        this.view          = options.view;
        this.section       = options.section;
        this.document   = this.view.template.document;
        this.didChange     = _bind(this.didChange, this);

        // initialize the DOM elements
        this.initialize();
    }

    /**
     */

    module.exports = protoclass(Component, {

        /**
         */

        initialize: function() {
            // override me - this is where the DOM elements should be added to the
            // section
        },

        /**
         */

        bind: function() {
            this.update();
        },

        /**
         */

        didChange: function() {
            this.view.runloop.deferOnce(this);
        },

        /**
         */

        unbind: function() {
            if (this._changeListener) this._changeListener.dispose();
        },

        /**
         */

        update: function() {
            // apply DOM changes here
        }
    });

},{"../utils/bind":70,"protoclass":79}],19:[function(require,module,exports){
    var BaseComponent  = require("./base");

    /**
     */

    function RepeatComponent(options) {
        BaseComponent.call(this, options);
    }

    /**
     */

    function _each(target, iterate) {
        if (Object.prototype.toString.call(target) === "[object Array]") {
            for (var i = 0, n = target.length; i < n; i++) iterate(target[i], i);
        } else {
            for (var key in target) iterate(target[key], key);
        }
    }

    /**
     */

    module.exports = BaseComponent.extend({

        /**
         */

        update: function() {

            if (this._updateListener) this._updateListener.dispose();

            var name     = this.attributes.as;
            var key      = this.attributes.key || "index";
            var source   = this.attributes.each;
            var accessor = this.view.accessor;

            if (!source) source = [];

            // note - this should get triggered on rAF
            this._updateListener = accessor.watchEvent(source, "change", function() {
                self.view.runloop.deferOnce(self);
            });

            source = accessor.normalizeCollection(source);

            if (!this._children) this._children = [];
            var self = this;
            var properties;

            var n = 0;

            _each(source, function(model, i) {

                if (name) {
                    properties = {};
                    properties[key]  = i;
                    properties[name] = model;
                } else {
                    properties = model;
                }

                if (i < self._children.length) {
                    var c = self._children[i];

                    // model is different? rebind. Otherwise ignore
                    if (c.context === model || c.context[name] !== model) {
                        c.bind(properties);
                    }
                } else {

                    // cannot be this - must be default scope
                    var child = self.childTemplate.view(properties, {
                        parent: self.view
                    });

                    self._children.push(child);
                    self.section.appendChild(child.render());
                }

                n++;
            });

            this._children.splice(n).forEach(function(child) {
                child.dispose();
            });
        }
    });

},{"./base":18}],20:[function(require,module,exports){
    var BaseComponent  = require("./base");

    /**
     */

    function ShowComponent(options) {
        BaseComponent.call(this, options);
    }

    /**
     */

    module.exports = BaseComponent.extend(ShowComponent, {

        /**
         */

        update: function() {

            var show = !!this.attributes.when;

            if (this._show === show) return;

            this._show = show;

            if (show) {
                this._view = this.childTemplate.view(this.view.context);
                this.section.appendChild(this._view.render());
            } else {
                if (this._view) this._view.dispose();
                this._view = void 0;
            }
        }
    });

},{"./base":18}],21:[function(require,module,exports){
    var BaseComponent = require("./base");

    /**
     */

    function StackComponent(options) {
        BaseComponent.call(this, options);

        var self = this;

        this.childTemplates = this.childTemplate.vnode.children.map(function(vnode) {
            return self.childTemplate.child(vnode);
        });
    }

    /**
     */

    module.exports = BaseComponent.extend(StackComponent, {

        /**
         */

        update: function() {

            var currentTpl;
            var show = this.attributes.state;

            if (typeof show === "number") {
                currentTpl = this.childTemplates[show];
            } else {

                // match by name
                for (var i = this.childTemplates.length; i--;) {
                    var childTemplate = this.childTemplates[i];
                    if (childTemplate.vnode.attributes.name === show) {
                        currentTpl = childTemplate;
                        break;
                    }
                }
            }

            if (this.currentTemplate === currentTpl) return;
            this.currentTemplate = currentTpl;
            if (this.currentView) this.currentView.dispose();
            if (!currentTpl) return;
            this.currentView = currentTpl.view(this.view.context, {
                parent: this.view
            });
            this.currentTemplate = currentTpl;
            this.section.appendChild(this.currentView.render());
        }
    });

},{"./base":18}],22:[function(require,module,exports){
    var BaseComponent = require("./base");
    var _bind         = require("../utils/bind");

    /**
     */

    function SwitchComponent(options) {
        BaseComponent.call(this, options);

        var self = this;

        this.childTemplates = this.childTemplate.vnode.children.map(function(vnode) {
            return self.childTemplate.child(vnode);
        });
    }

    /**
     */

    module.exports = BaseComponent.extend(SwitchComponent, {

        /**
         */

        bind: function() {
            BaseComponent.prototype.bind.call(this);

            this.bindings = [];
            var update = _bind(this.update, this);
            for (var i = 0, n = this.childTemplates.length; i < n; i++) {
                var when = this.childTemplates[i].vnode.attributes.when;
                if (!when) continue;
                this.bindings.push(when.watch(this.view, this.didChange));
            }
        },

        /**
         */

        unbind: function() {
            for (var i = this.bindings.length; i--;) {
                this.bindings[i].dispose();
            }
        },

        /**
         */

        update: function() {

            var child;

            for (var i = 0, n = this.childTemplates.length; i < n; i++) {
                child = this.childTemplates[i];
                var when = child.vnode.attributes.when;

                if (!when || when.evaluate(this.view)) {
                    break;
                }
            }

            if (this.currentChild == child) {

                if (this._view && this._view.context !== this.context) {
                    this._view.bind(this.view.context);
                }

                return;
            }

            if (this._view) {
                this._view.dispose();
            }

            if (i == n) return;

            this.currentChild = child;

            var childChildTemplate = child.child(child.vnode.children, {
                accessor: this.view.accessor
            });

            this._view = childChildTemplate.view(this.view.context);
            this.section.appendChild(this._view.render());
        }
    });

},{"../utils/bind":70,"./base":18}],23:[function(require,module,exports){
    (function (global){
        var BaseComponent  = require("./base");

        /**
         */

        function EscapeComponent(options) {
            BaseComponent.call(this, options);
        }

        /**
         */

        module.exports = BaseComponent.extend(EscapeComponent, {

            /**
             */

            update: function() {

                var value = this.attributes.html;

                // dirty check if is a binding
                if (typeof value === "object" && value.evaluate) {
                    value = void 0;
                }

                // has a remove script
                if (this.currentValue && this.currentValue.remove) {
                    this.currentValue.remove();
                }

                this.currentValue = value;

                if (!value) {
                    return this.section.removeAll();
                }

                var node;

                if (value.render) {

                    value.remove();
                    node = value.render();
                } else if (value.nodeType != null) {
                    node = value;
                } else {
                    if (this.document !== global.document) {
                        node = this.document.createTextNode(String(value));
                    } else {
                        var div = this.document.createElement("div");
                        div.innerHTML = String(value);
                        node = this.document.createDocumentFragment();
                        var cn = Array.prototype.slice.call(div.childNodes);
                        for (var i = 0, n = cn.length; i < n; i++) {
                            node.appendChild(cn[i]);
                        }
                    }
                }

                this.section.replaceChildNodes(node);
            }
        });

    }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./base":18}],24:[function(require,module,exports){
    (function (process){
        var Runloop       = require("./runloop");
        var POJOAccessor  = require("./accessors/pojo");

        module.exports = {

            /**
             * Scope class to use for paperclip - allows for other frameworks
             * to hook into paperclip.
             */

            accessorClass: POJOAccessor,

            /**
             */

            accessors: {
                pojo: require("./accessors/pojo")
            },

            /**
             * Default "web" components
             */

            components : {
                repeat : require("./components/repeat"),
                stack  : require("./components/stack"),
                switch : require("./components/switch"),
                show   : require("./components/show"),
                unsafe : require("./components/unsafe")
            },

            /**
             * default attribute helpers (similar to angular directives)
             */

            attributes : {
                value        : require("./attributes/value"),
                checked      : require("./attributes/value"),
                enable       : require("./attributes/enable"),
                focus        : require("./attributes/focus"),
                style        : require("./attributes/style"),
                class        : require("./attributes/class"),
                easein       : require("./attributes/easeIn"),
                easeout      : require("./attributes/easeOut"),

                // events
                onclick       : require("./attributes/event"),
                ondoubleclick : require("./attributes/event"),
                onfocus       : require("./attributes/event"),
                onload        : require("./attributes/event"),
                onsubmit      : require("./attributes/event"),
                onmousedown   : require("./attributes/event"),
                onchange      : require("./attributes/event"),
                onmouseup     : require("./attributes/event"),
                onmouseover   : require("./attributes/event"),
                onmouseout    : require("./attributes/event"),
                onfocusin     : require("./attributes/event"),
                onfocusout    : require("./attributes/event"),
                onmousemove   : require("./attributes/event"),
                onkeydown     : require("./attributes/event"),
                onkeyup       : require("./attributes/event"),

                // additional events
                onenter       : require("./attributes/enter"),
                ondelete      : require("./attributes/delete"),
                onescape      : require("./attributes/escape")
            },

            /**
             * runs async operations
             */

            runloop: new Runloop({
                tick: process.env.PC_DEBUG ? process.nextTick : process.env.browser ? void 0 : void 0
            }),

            /**
             * {{ block | modifiers }}
             */

            modifiers: {
                uppercase: function(value) {
                    return String(value).toUpperCase();
                },
                lowercase: function(value) {
                    return String(value).toLowerCase();
                },
                titlecase: function(value) {
                    var str;

                    str = String(value);
                    return str.substr(0, 1).toUpperCase() + str.substr(1);
                },
                json: function(value, count, delimiter) {
                    return JSON.stringify.apply(JSON, arguments);
                },
                isNaN: function(value) {
                    return isNaN(value);
                },
                round: Math.round
            }
        };

    }).call(this,require('_process'))
},{"./accessors/pojo":3,"./attributes/class":5,"./attributes/delete":6,"./attributes/easeIn":7,"./attributes/easeOut":8,"./attributes/enable":9,"./attributes/enter":10,"./attributes/escape":11,"./attributes/event":12,"./attributes/focus":13,"./attributes/style":16,"./attributes/value":17,"./components/repeat":19,"./components/show":20,"./components/stack":21,"./components/switch":22,"./components/unsafe":23,"./runloop":48,"_process":76}],25:[function(require,module,exports){
    var BaseExpression       = require("./base");
    var ParametersExpression = require("./parameters");

    /**
     */

    function ArrayExpression(expressions) {
        this.expressions = expressions || new ParametersExpression();
        BaseExpression.apply(this, arguments);
    }

    /**
     */

    BaseExpression.extend(ArrayExpression, {

        /**
         */

        type: "array",

        /**
         */

        toJavaScript: function() {
            return "[" + this.expressions.toJavaScript() + "]";
        }
    });

    module.exports = ArrayExpression;

},{"./base":27,"./parameters":39}],26:[function(require,module,exports){
    var BaseExpression = require("./base");

    /**
     */

    function AssignmentExpression(reference, value) {
        BaseExpression.apply(this, arguments);
        this.reference = reference;
        this.value     = value;
    }

    /**
     */

    BaseExpression.extend(AssignmentExpression, {

        /**
         */

        type: "assignment",

        /**
         */

        toJavaScript: function() {

            var path = this.reference.path.join(".");

            return "this.set('" + path + "', " + this.value.toJavaScript() + ")";
        }
    });

    module.exports = AssignmentExpression;

},{"./base":27}],27:[function(require,module,exports){
    var protoclass = require("protoclass");

    function BaseExpression() {
        this._children = [];
        this._addChildren(Array.prototype.slice.call(arguments, 0));
    }

    protoclass(BaseExpression, {

        /**
         */

        __isExpression: true,

        /**
         */

        _addChildren: function(children) {
            for (var i = children.length; i--;) {
                var child = children[i];
                if (!child) continue;
                if (child.__isExpression) {
                    this._children.push(child);
                } else if (typeof child === "object") {
                    for (var k in child) {
                        this._addChildren([child[k]]);
                    }
                }
            }
        },

        /**
         */

        filterAllChildren: function(filter) {
            var filtered = [];

            this.traverseChildren(function(child) {
                if (filter(child)) {
                    filtered.push(child);
                }
            });

            return filtered;
        },

        /**
         */

        traverseChildren: function(fn) {

            fn(this);

            for (var i = this._children.length; i--;) {
                var child = this._children[i];
                child.traverseChildren(fn);
            }
        }
    });

    module.exports = BaseExpression;

},{"protoclass":79}],28:[function(require,module,exports){
    var BaseExpression = require("./base");

    function BlockBindingExpression(scripts, contentTemplate, childBlock) {
        this.scripts    = scripts;
        this.contentTemplate = contentTemplate;
        this.childBlock = childBlock;
        BaseExpression.apply(this, arguments);
    }

    BaseExpression.extend(BlockBindingExpression, {
        type: "blockBinding",
        toJavaScript: function() {

            var buffer = "block(" + this.scripts.value.value.toJavaScript() + ", ";
            buffer += (this.contentTemplate ? this.contentTemplate.toJavaScript() : "void 0");

            if (this.childBlock) {
                buffer += ", " + this.childBlock.toJavaScript();
            }

            return buffer + ")";
        }
    });

    module.exports = BlockBindingExpression;

},{"./base":27}],29:[function(require,module,exports){
    var BaseExpression = require("./base");

    function CallExpression(reference, parameters) {
        this.reference  = reference;
        this.parameters = parameters;
        BaseExpression.apply(this, arguments);
    }

    BaseExpression.extend(CallExpression, {
        type: "call",
        toJavaScript: function() {

            var path = this.reference.path.concat();

            var buffer = "this.call(";

            buffer += "'" + path.join(".") + "'";

            buffer += ", [" + this.parameters.toJavaScript() + "]";

            return buffer + ")";
        }
    });

    module.exports = CallExpression;

},{"./base":27}],30:[function(require,module,exports){
    var BaseExpression = require("./base");

    function CommentNodeExpression(value) {
        this.value = value;
        BaseExpression.apply(this, arguments);
    }

    BaseExpression.extend(CommentNodeExpression, {
        type: "commentNode",
        toJavaScript: function() {
            return "comment(\"" + this.value.replace(/["]/g, "\\\"") + "\")";
        }
    });

    module.exports = CommentNodeExpression;

},{"./base":27}],31:[function(require,module,exports){
    var BaseExpression = require("./base");

    function DoctypeExpression(value) {
        this.value = value;
        BaseExpression.apply(this, arguments);
    }

    BaseExpression.extend(DoctypeExpression, {
        type: "doctype",
        toJavaScript: function() {
            return "text('<!DOCTYPE " + this.value + ">')";
        }
    });

    module.exports = DoctypeExpression;

},{"./base":27}],32:[function(require,module,exports){
    var BaseExpression  = require("./base");
    var ArrayExpression = require("./array");

    function ElementNodeExpression(nodeName, attributes, childNodes) {
        this.name       = nodeName;
        this.attributes = attributes;
        this.childNodes = childNodes || new ArrayExpression();
        BaseExpression.apply(this, arguments);
    }

    BaseExpression.extend(ElementNodeExpression, {
        type: "elementNode",
        toJavaScript: function() {
            return "element(\"" + this.name + "\", " + this.attributes.toJavaScript() +
                ", " + this.childNodes.toJavaScript() + ")";
        }
    });

    module.exports = ElementNodeExpression;

},{"./array":25,"./base":27}],33:[function(require,module,exports){
    var BaseExpression = require("./base");

    function GroupExpression(expression) {
        this.expression = expression;
        BaseExpression.apply(this, arguments);
    }

    BaseExpression.extend(GroupExpression, {
        type: "call",
        toJavaScript: function() {
            return "(" + this.expression.toJavaScript() + ")";
        }
    });

    module.exports = GroupExpression;

},{"./base":27}],34:[function(require,module,exports){
    var BaseExpression = require("./base");

    function HashExpression(values) {
        this.value = values;
        BaseExpression.apply(this, arguments);
    }

    BaseExpression.extend(HashExpression, {
        type: "hash",
        toJavaScript: function() {

            var items = [];

            for (var key in this.value) {
                var v = this.value[key];
                items.push("'" + key + "':" + v.toJavaScript());
            }

            return "{" + items.join(", ") + "}";
        }
    });

    module.exports = HashExpression;

},{"./base":27}],35:[function(require,module,exports){
    var BaseExpression = require("./base");

    function LiteralExpression(value) {
        this.value = value;
        BaseExpression.apply(this, arguments);
    }

    BaseExpression.extend(LiteralExpression, {
        type: "literal",
        toJavaScript: function() {
            return String(this.value);
        }
    });

    module.exports = LiteralExpression;

},{"./base":27}],36:[function(require,module,exports){
    var BaseExpression = require("./base");

    function ModifierExpression(name, parameters) {
        this.name  = name;
        this.parameters = parameters;
        BaseExpression.apply(this, arguments);
    }

    BaseExpression.extend(ModifierExpression, {
        type: "modifier",
        toJavaScript: function() {

            var buffer = "modifiers." + this.name + ".call(this";

            var params = this.parameters.toJavaScript();

            if (params.length) {
                buffer += ", " + params;
            }

            return buffer + ")";

        }
    });

    module.exports = ModifierExpression;

},{"./base":27}],37:[function(require,module,exports){
    var BaseExpression = require("./base");

    function NotExpression(operator, expression) {
        this.operator = operator;
        this.expression = expression;
        BaseExpression.apply(this, arguments);
    }

    BaseExpression.extend(NotExpression, {
        type: "!",
        toJavaScript: function() {
            return this.operator + this.expression.toJavaScript();
        }
    });

    module.exports = NotExpression;

},{"./base":27}],38:[function(require,module,exports){
    var BaseExpression = require("./base");

    function OperatorExpression(operator, left, right) {
        this.operator = operator;
        this.left     = left;
        this.right    = right;
        BaseExpression.apply(this, arguments);
    }

    BaseExpression.extend(OperatorExpression, {
        type: "operator",
        toJavaScript: function() {
            return this.left.toJavaScript() + this.operator + this.right.toJavaScript();
        }
    });

    module.exports = OperatorExpression;

},{"./base":27}],39:[function(require,module,exports){
    var BaseExpression = require("./base");

    function ParametersExpression(expressions) {
        this.expressions = expressions || [];
        BaseExpression.apply(this, arguments);
    }

    BaseExpression.extend(ParametersExpression, {
        type: "parameters",
        toJavaScript: function() {
            return this.expressions.map(function(expression) {
                return expression.toJavaScript();
            }).join(", ");
        }
    });

    module.exports = ParametersExpression;

},{"./base":27}],40:[function(require,module,exports){
    var BaseExpression = require("./base");

    function ReferenceExpression(path, bindingType) {

        this.path        = path;
        this.bindingType = bindingType;
        this.fast        = bindingType === "^";
        this.unbound     = ["~", "~>"].indexOf(bindingType) !== -1;
        this._isBoundTo  = ~["<~", "<~>", "~>"].indexOf(this.bindingType);

        BaseExpression.apply(this, arguments);
    }

    BaseExpression.extend(ReferenceExpression, {
        type: "reference",
        toJavaScript: function() {

            if (!this._isBoundTo)
                if (this.fast) {
                    return "this.context." + this.path.join(".");
                }

            // var path = this.path.map(function(p) { return "'" + p + "'"; }).join(", ");

            var path = this.path.join(".");

            if (this._isBoundTo) {
                return "this.reference('" + path + "', " + (this.bindingType !== "<~") + ", " + (this.bindingType !== "~>") + ")";
            }

            return "this.get('" + path + "')";
        }
    });

    module.exports = ReferenceExpression;

},{"./base":27}],41:[function(require,module,exports){
    var BaseExpression = require("./base");

    function RootExpression(children) {
        this.childNodes = children;
        BaseExpression.apply(this, arguments);
    }

    BaseExpression.extend(RootExpression, {
        type: "rootNode",
        toJavaScript: function() {

            var buffer = "(function(fragment, block, element, text, comment, parser, modifiers) { ";

            var element;

            if (this.childNodes.type === "array") {
                if (this.childNodes.expressions.expressions.length > 1) {
                    element = "fragment(" + this.childNodes.toJavaScript() + ")";
                } else if (this.childNodes.expressions.expressions.length) {
                    element = this.childNodes.expressions.expressions[0].toJavaScript();
                } else {
                    return buffer + "})";
                }
            } else {
                element = this.childNodes.toJavaScript();
            }

            return buffer + "return " + element + "; })";
        }
    });

    module.exports = RootExpression;

},{"./base":27}],42:[function(require,module,exports){
    var BaseExpression = require("./base");
    var uniq           = require("../../utils/uniq");

    function ScriptExpression(value) {
        this.value = value;
        BaseExpression.apply(this, arguments);
    }

    BaseExpression.extend(ScriptExpression, {
        type: "script",
        toJavaScript: function() {

            var refs = this.filterAllChildren(function(child) {
                return child.type === "reference";
            }).filter(function(reference) {
                return !reference.unbound && reference.path;
            }).map(function(reference) {
                return reference.path;
            });

            // remove duplicate references
            refs = uniq(refs.map(function(ref) {
                return ref.join(".");
            }));

            // much slower - use strings instead
            // refs = refs.map(function(ref) {
            //   return ref.split(".");
            // });

            var buffer = "{";

            buffer += "run: function() { return " + this.value.toJavaScript() + "; }";

            buffer += ", refs: " + JSON.stringify(refs);

            return buffer + "}";
        }
    });

    module.exports = ScriptExpression;

},{"../../utils/uniq":75,"./base":27}],43:[function(require,module,exports){
    var BaseExpression = require("./base");

    function StringExpression(value) {
        this.value = value;
        BaseExpression.apply(this, arguments);
    }

    BaseExpression.extend(StringExpression, {
        type: "string",
        toJavaScript: function() {
            return "\"" + this.value.replace(/"/g, "\\\"") + "\"";
        }
    });

    module.exports = StringExpression;

},{"./base":27}],44:[function(require,module,exports){
    var BaseExpression = require("./base");

    function TernaryConditionExpression(condition, tExpression, fExpression) {
        this.condition = condition;
        this.tExpression = tExpression;
        this.fExpression = fExpression;
        BaseExpression.apply(this, arguments);
    }

    BaseExpression.extend(TernaryConditionExpression, {
        type: "ternaryCondition",
        toJavaScript: function() {
            return this.condition.toJavaScript()  +
                "?" + this.tExpression.toJavaScript() +
                ":" + this.fExpression.toJavaScript();
        }
    });

    module.exports = TernaryConditionExpression;

},{"./base":27}],45:[function(require,module,exports){
    (function (global){
        var BaseExpression = require("./base");
// var he = require("he");

        function TextNodeExpression(value) {
            if (global.paperclip && global.paperclip.he) {
                this.value = global.paperclip.he.decode(value);
            } else if (typeof window !== "undefined") {
                var div = document.createElement("div");
                div.innerHTML = value;
                this.value = div.textContent;
            } else {
                this.value = value;
            }

            // this.value = he.decode(value);

            // FIXME:
            // will be invalid if value is something like 'a'
            this.decoded = this.value !== value;

            BaseExpression.apply(this, arguments);
        }

        BaseExpression.extend(TextNodeExpression, {
            type: "textNode",
            toJavaScript: function() {
                return "text(\"" + this.value.replace(/["]/g, "\\\"") + "\")";
            }
        });

        module.exports = TextNodeExpression;

    }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./base":27}],46:[function(require,module,exports){
    (function (global){
        var parser  = require("./parser");
        var scripts = {};
        var parse;

        /**
         */

        module.exports = {

            /**
             */

            parse: parse = function(html) {
                return "\"use strict\";module.exports = " + parser.parse(html).toJavaScript();
            },

            /**
             */

            compile: function(nameOrContent) {
                var content;

                if (scripts[nameOrContent]) {
                    return scripts[nameOrContent];
                }

                if (!content) {
                    content = nameOrContent;
                }

                var source = "\"use strict\";return " + parser.parse(content).toJavaScript();

                return (scripts[nameOrContent] = new Function(source)());
            }
        };

        /* istanbul ignore if */
        if (global.paperclip) {
            global.paperclip.parse           = module.exports.parse;
            global.paperclip.template.parser = module.exports;
        }

    }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./parser":47}],47:[function(require,module,exports){
    module.exports = (function() {
        /*
         * Generated by PEG.js 0.8.0.
         *
         * http://pegjs.majda.cz/
         */

        function peg$subclass(child, parent) {
            function ctor() { this.constructor = child; }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
        }

        function SyntaxError(message, expected, found, offset, line, column) {
            this.message  = message;
            this.expected = expected;
            this.found    = found;
            this.offset   = offset;
            this.line     = line;
            this.column   = column;

            this.name     = "SyntaxError";
        }

        peg$subclass(SyntaxError, Error);

        function parse(input) {
            var options = arguments.length > 1 ? arguments[1] : {},

                peg$FAILED = {},

                peg$startRuleFunctions = { Start: peg$parseStart },
                peg$startRuleFunction  = peg$parseStart,

                peg$c0 = function(children) { return new RootNodeExpression(children); },
                peg$c1 = peg$FAILED,
                peg$c2 = "<!DOCTYPE",
                peg$c3 = { type: "literal", value: "<!DOCTYPE", description: "\"<!DOCTYPE\"" },
                peg$c4 = [],
                peg$c5 = /^[^>]/,
                peg$c6 = { type: "class", value: "[^>]", description: "[^>]" },
                peg$c7 = ">",
                peg$c8 = { type: "literal", value: ">", description: "\">\"" },
                peg$c9 = function(info) {
                    return new DocTypeExpression(info.join(""));
                },
                peg$c10 = function(children) { return new ArrayExpression(new ParametersExpression(trimTextExpressions(children))); },
                peg$c11 = "<!--",
                peg$c12 = { type: "literal", value: "<!--", description: "\"<!--\"" },
                peg$c13 = void 0,
                peg$c14 = "-->",
                peg$c15 = { type: "literal", value: "-->", description: "\"-->\"" },
                peg$c16 = function(v) { return v; },
                peg$c17 = function(value) {
                    return new CommentNodeExpression(trimEnds(value.join("")));
                },
                peg$c18 = "<",
                peg$c19 = { type: "literal", value: "<", description: "\"<\"" },
                peg$c20 = "area",
                peg$c21 = { type: "literal", value: "area", description: "\"area\"" },
                peg$c22 = "base",
                peg$c23 = { type: "literal", value: "base", description: "\"base\"" },
                peg$c24 = "br",
                peg$c25 = { type: "literal", value: "br", description: "\"br\"" },
                peg$c26 = "col",
                peg$c27 = { type: "literal", value: "col", description: "\"col\"" },
                peg$c28 = "command",
                peg$c29 = { type: "literal", value: "command", description: "\"command\"" },
                peg$c30 = "embed",
                peg$c31 = { type: "literal", value: "embed", description: "\"embed\"" },
                peg$c32 = "hr",
                peg$c33 = { type: "literal", value: "hr", description: "\"hr\"" },
                peg$c34 = "img",
                peg$c35 = { type: "literal", value: "img", description: "\"img\"" },
                peg$c36 = "input",
                peg$c37 = { type: "literal", value: "input", description: "\"input\"" },
                peg$c38 = "keygen",
                peg$c39 = { type: "literal", value: "keygen", description: "\"keygen\"" },
                peg$c40 = "link",
                peg$c41 = { type: "literal", value: "link", description: "\"link\"" },
                peg$c42 = "meta",
                peg$c43 = { type: "literal", value: "meta", description: "\"meta\"" },
                peg$c44 = "param",
                peg$c45 = { type: "literal", value: "param", description: "\"param\"" },
                peg$c46 = "source",
                peg$c47 = { type: "literal", value: "source", description: "\"source\"" },
                peg$c48 = "track",
                peg$c49 = { type: "literal", value: "track", description: "\"track\"" },
                peg$c50 = "wbr",
                peg$c51 = { type: "literal", value: "wbr", description: "\"wbr\"" },
                peg$c52 = null,
                peg$c53 = "/>",
                peg$c54 = { type: "literal", value: "/>", description: "\"/>\"" },
                peg$c55 = function(nodeName, attributes, endTag) {


                    if (endTag && nodeName != endTag.name) {
                        expected("</" + nodeName + ">");
                    }

                    return new ElementNodeExpression(nodeName, attributes);
                },
                peg$c56 = "</",
                peg$c57 = { type: "literal", value: "</", description: "\"</\"" },
                peg$c58 = function(name) {
                    return {
                        name: name
                    };
                },
                peg$c59 = function(startTag, children, endTag) {

                    if (startTag.name != endTag.name) {
                        expected("</" + startTag.name + ">");
                    }

                    return new ElementNodeExpression(startTag.name, startTag.attributes, children);
                },
                peg$c60 = function(value) {
                    return new TextNodeExpression(trimNewLineChars(value.join("")));
                },
                peg$c61 = "{{",
                peg$c62 = { type: "literal", value: "{{", description: "\"{{\"" },
                peg$c63 = function() {
                    return text();
                },
                peg$c64 = function(info) { return info; },
                peg$c65 = function(info) { return new ElementNodeExpression(info.name, info.attributes); },
                peg$c66 = function(name, attrs) {
                    return {
                        name: name,
                        attributes: attrs
                    };
                },
                peg$c67 = function(attributes) {
                    var attrs = {};

                    for (var i = 0, n = attributes.length; i < n; i++) {
                        var attr = attributes[i];
                        attrs[attr.name] = attr.value;
                    }

                    return new HashExpression(attrs);
                },
                peg$c68 = /^[a-zA-Z0-9:_.\-]/,
                peg$c69 = { type: "class", value: "[a-zA-Z0-9:_.\\-]", description: "[a-zA-Z0-9:_.\\-]" },
                peg$c70 = function(word) { return word.join(""); },
                peg$c71 = "=",
                peg$c72 = { type: "literal", value: "=", description: "\"=\"" },
                peg$c73 = function(name, values) {
                    return {
                        name: name,
                        value: values
                    };
                },
                peg$c74 = function(name) {
                    return {
                        name: name,
                        value: new LiteralExpression(true)
                    };
                },
                peg$c75 = "\"",
                peg$c76 = { type: "literal", value: "\"", description: "\"\\\"\"" },
                peg$c77 = /^[^"]/,
                peg$c78 = { type: "class", value: "[^\"]", description: "[^\"]" },
                peg$c79 = function() { return new StringExpression(trimNewLineChars(text())); },
                peg$c80 = function(values) { return attrValues(values); },
                peg$c81 = "'",
                peg$c82 = { type: "literal", value: "'", description: "\"'\"" },
                peg$c83 = /^[^']/,
                peg$c84 = { type: "class", value: "[^']", description: "[^']" },
                peg$c85 = function(binding) { return attrValues([binding]); },
                peg$c86 = "{{#",
                peg$c87 = { type: "literal", value: "{{#", description: "\"{{#\"" },
                peg$c88 = function(blockBinding) { return blockBinding; },
                peg$c89 = function(scripts, fragment, child) {
                    return new BlockBindingExpression(scripts, fragment, child);
                },
                peg$c90 = "{{/",
                peg$c91 = { type: "literal", value: "{{/", description: "\"{{/\"" },
                peg$c92 = function(blockBinding) { return new RootNodeExpression(blockBinding); },
                peg$c93 = "{{/}}",
                peg$c94 = { type: "literal", value: "{{/}}", description: "\"{{/}}\"" },
                peg$c95 = function() { return void 0; },
                peg$c96 = "}}",
                peg$c97 = { type: "literal", value: "}}", description: "\"}}\"" },
                peg$c98 = function(scripts) {
                    return new BlockBindingExpression(scripts);
                },
                peg$c99 = function(scripts) {
                    return scripts;
                },
                peg$c100 = function(scriptName) {
                    var hash = {};
                    hash[scriptName] = new ScriptExpression(new LiteralExpression(true));
                    return new HashExpression(hash);
                },
                peg$c101 = function(scripts) {
                    for (var k in scripts) {
                        scripts[k] = new ScriptExpression(scripts[k]);
                    }
                    return new HashExpression(scripts);
                },
                peg$c102 = ",",
                peg$c103 = { type: "literal", value: ",", description: "\",\"" },
                peg$c104 = function(value, ascripts) {

                    var scripts = {
                        value: new ScriptExpression(value)
                    };

                    ascripts = ascripts.length ? ascripts[0][1] : [];
                    for (var i = 0, n = ascripts.length; i < n; i++) {
                        scripts[ascripts[i].key] = new ScriptExpression(ascripts[i].value);
                    }

                    return new HashExpression(scripts);
                },
                peg$c105 = "?",
                peg$c106 = { type: "literal", value: "?", description: "\"?\"" },
                peg$c107 = ":",
                peg$c108 = { type: "literal", value: ":", description: "\":\"" },
                peg$c109 = function(condition, left, right) {
                    return new TernaryConditionExpression(condition, left, right);
                },
                peg$c110 = "(",
                peg$c111 = { type: "literal", value: "(", description: "\"(\"" },
                peg$c112 = ")",
                peg$c113 = { type: "literal", value: ")", description: "\")\"" },
                peg$c114 = function(params) {
                    return params;
                },
                peg$c115 = "()",
                peg$c116 = { type: "literal", value: "()", description: "\"()\"" },
                peg$c117 = function() { return []; },
                peg$c118 = function(param1, rest) {
                    return [param1].concat(rest.map(function(v) {
                        return v[1];
                    }));
                },
                peg$c119 = function(left, right) {
                    return new AssignmentExpression(left, right);
                },
                peg$c120 = "&&",
                peg$c121 = { type: "literal", value: "&&", description: "\"&&\"" },
                peg$c122 = "||",
                peg$c123 = { type: "literal", value: "||", description: "\"||\"" },
                peg$c124 = "===",
                peg$c125 = { type: "literal", value: "===", description: "\"===\"" },
                peg$c126 = "==",
                peg$c127 = { type: "literal", value: "==", description: "\"==\"" },
                peg$c128 = "!==",
                peg$c129 = { type: "literal", value: "!==", description: "\"!==\"" },
                peg$c130 = "!=",
                peg$c131 = { type: "literal", value: "!=", description: "\"!=\"" },
                peg$c132 = ">==",
                peg$c133 = { type: "literal", value: ">==", description: "\">==\"" },
                peg$c134 = ">=",
                peg$c135 = { type: "literal", value: ">=", description: "\">=\"" },
                peg$c136 = "<==",
                peg$c137 = { type: "literal", value: "<==", description: "\"<==\"" },
                peg$c138 = "<=",
                peg$c139 = { type: "literal", value: "<=", description: "\"<=\"" },
                peg$c140 = "+",
                peg$c141 = { type: "literal", value: "+", description: "\"+\"" },
                peg$c142 = "-",
                peg$c143 = { type: "literal", value: "-", description: "\"-\"" },
                peg$c144 = "%",
                peg$c145 = { type: "literal", value: "%", description: "\"%\"" },
                peg$c146 = "*",
                peg$c147 = { type: "literal", value: "*", description: "\"*\"" },
                peg$c148 = "/",
                peg$c149 = { type: "literal", value: "/", description: "\"/\"" },
                peg$c150 = function(left, operator, right) {
                    return new OperatorExpression(operator, left, right);
                },
                peg$c151 = function(value) { return value; },
                peg$c152 = function(expression, modifiers) {

                    for (var i = 0, n = modifiers.length; i < n; i++) {
                        expression = new ModifierExpression(modifiers[i].name, new ParametersExpression([expression].concat(modifiers[i].parameters)));
                    }

                    return expression;
                },
                peg$c153 = "|",
                peg$c154 = { type: "literal", value: "|", description: "\"|\"" },
                peg$c155 = function(name, parameters) {
                    return {
                        name: name,
                        parameters: parameters || []
                    };
                },
                peg$c156 = function(context) { return context; },
                peg$c157 = "!",
                peg$c158 = { type: "literal", value: "!", description: "\"!\"" },
                peg$c159 = function(not, value) {
                    return new NotExpression(not, value);
                },
                peg$c160 = /^[0-9]/,
                peg$c161 = { type: "class", value: "[0-9]", description: "[0-9]" },
                peg$c162 = function(value) {
                    return new LiteralExpression(parseFloat(text()));
                },
                peg$c163 = ".",
                peg$c164 = { type: "literal", value: ".", description: "\".\"" },
                peg$c165 = function(group) { return new GroupExpression(group); },
                peg$c166 = function(expression) {
                    return new LiteralExpression(expression.value);
                },
                peg$c167 = "true",
                peg$c168 = { type: "literal", value: "true", description: "\"true\"" },
                peg$c169 = "false",
                peg$c170 = { type: "literal", value: "false", description: "\"false\"" },
                peg$c171 = function(value) {
                    return {
                        type: "boolean",
                        value: value === "true"
                    };
                },
                peg$c172 = "undefined",
                peg$c173 = { type: "literal", value: "undefined", description: "\"undefined\"" },
                peg$c174 = function() { return { type: "undefined", value: void 0 }; },
                peg$c175 = "NaN",
                peg$c176 = { type: "literal", value: "NaN", description: "\"NaN\"" },
                peg$c177 = function() { return { type: "nan", value: NaN }; },
                peg$c178 = "Infinity",
                peg$c179 = { type: "literal", value: "Infinity", description: "\"Infinity\"" },
                peg$c180 = function() { return { type: "infinity", value: Infinity }; },
                peg$c181 = "null",
                peg$c182 = { type: "literal", value: "null", description: "\"null\"" },
                peg$c183 = "NULL",
                peg$c184 = { type: "literal", value: "NULL", description: "\"NULL\"" },
                peg$c185 = function() { return { type: "null", value: null }; },
                peg$c186 = function(reference, parameters) {
                    return new CallExpression(reference, new ParametersExpression(parameters));
                },
                peg$c187 = "^",
                peg$c188 = { type: "literal", value: "^", description: "\"^\"" },
                peg$c189 = "~>",
                peg$c190 = { type: "literal", value: "~>", description: "\"~>\"" },
                peg$c191 = "<~>",
                peg$c192 = { type: "literal", value: "<~>", description: "\"<~>\"" },
                peg$c193 = "~",
                peg$c194 = { type: "literal", value: "~", description: "\"~\"" },
                peg$c195 = "<~",
                peg$c196 = { type: "literal", value: "<~", description: "\"<~\"" },
                peg$c197 = function(bindingType, reference, path) {
                    path = [reference].concat(path.map(function(p) { return p[1]; }));
                    return new ReferenceExpression(path, bindingType);
                },
                peg$c198 = /^[a-zA-Z_$0-9]/,
                peg$c199 = { type: "class", value: "[a-zA-Z_$0-9]", description: "[a-zA-Z_$0-9]" },
                peg$c200 = function(name) { return text(); },
                peg$c201 = "{",
                peg$c202 = { type: "literal", value: "{", description: "\"{\"" },
                peg$c203 = "}",
                peg$c204 = { type: "literal", value: "}", description: "\"}\"" },
                peg$c205 = function(values) {
                    return new HashExpression(values);
                },
                peg$c206 = function(values) {
                    var s = {};
                    for (var i = 0, n = values.length; i < n; i++) {
                        s[values[i].key] = values[i].value;
                    }
                    return s;
                },
                peg$c207 = function(firstValue, additionalValues) {
                    return [
                        firstValue
                    ].concat(additionalValues.length ? additionalValues[0][1] : []);
                },
                peg$c208 = function(key, value) {
                    return {
                        key: key,
                        value: value || new LiteralExpression(void 0)
                    };
                },
                peg$c209 = function(key) { return key.value; },
                peg$c210 = function(key) { return key; },
                peg$c211 = { type: "other", description: "string" },
                peg$c212 = function(chars) {
                    return new StringExpression(chars.join(""));
                },
                peg$c213 = "\\",
                peg$c214 = { type: "literal", value: "\\", description: "\"\\\\\"" },
                peg$c215 = function() { return text(); },
                peg$c216 = "\\\"",
                peg$c217 = { type: "literal", value: "\\\"", description: "\"\\\\\\\"\"" },
                peg$c218 = "\\'",
                peg$c219 = { type: "literal", value: "\\'", description: "\"\\\\'\"" },
                peg$c220 = { type: "any", description: "any character" },
                peg$c221 = /^[a-zA-Z]/,
                peg$c222 = { type: "class", value: "[a-zA-Z]", description: "[a-zA-Z]" },
                peg$c223 = function(chars) { return chars.join(""); },
                peg$c224 = /^[ \n\r\t]/,
                peg$c225 = { type: "class", value: "[ \\n\\r\\t]", description: "[ \\n\\r\\t]" },
                peg$c226 = /^[\n\r\t]/,
                peg$c227 = { type: "class", value: "[\\n\\r\\t]", description: "[\\n\\r\\t]" },

                peg$currPos          = 0,
                peg$reportedPos      = 0,
                peg$cachedPos        = 0,
                peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
                peg$maxFailPos       = 0,
                peg$maxFailExpected  = [],
                peg$silentFails      = 0,

                peg$result;

            if ("startRule" in options) {
                if (!(options.startRule in peg$startRuleFunctions)) {
                    throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
                }

                peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
            }

            function text() {
                return input.substring(peg$reportedPos, peg$currPos);
            }

            function offset() {
                return peg$reportedPos;
            }

            function line() {
                return peg$computePosDetails(peg$reportedPos).line;
            }

            function column() {
                return peg$computePosDetails(peg$reportedPos).column;
            }

            function expected(description) {
                throw peg$buildException(
                    null,
                    [{ type: "other", description: description }],
                    peg$reportedPos
                );
            }

            function error(message) {
                throw peg$buildException(message, null, peg$reportedPos);
            }

            function peg$computePosDetails(pos) {
                function advance(details, startPos, endPos) {
                    var p, ch;

                    for (p = startPos; p < endPos; p++) {
                        ch = input.charAt(p);
                        if (ch === "\n") {
                            if (!details.seenCR) { details.line++; }
                            details.column = 1;
                            details.seenCR = false;
                        } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
                            details.line++;
                            details.column = 1;
                            details.seenCR = true;
                        } else {
                            details.column++;
                            details.seenCR = false;
                        }
                    }
                }

                if (peg$cachedPos !== pos) {
                    if (peg$cachedPos > pos) {
                        peg$cachedPos = 0;
                        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
                    }
                    advance(peg$cachedPosDetails, peg$cachedPos, pos);
                    peg$cachedPos = pos;
                }

                return peg$cachedPosDetails;
            }

            function peg$fail(expected) {
                if (peg$currPos < peg$maxFailPos) { return; }

                if (peg$currPos > peg$maxFailPos) {
                    peg$maxFailPos = peg$currPos;
                    peg$maxFailExpected = [];
                }

                peg$maxFailExpected.push(expected);
            }

            function peg$buildException(message, expected, pos) {
                function cleanupExpected(expected) {
                    var i = 1;

                    expected.sort(function(a, b) {
                        if (a.description < b.description) {
                            return -1;
                        } else if (a.description > b.description) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });

                    while (i < expected.length) {
                        if (expected[i - 1] === expected[i]) {
                            expected.splice(i, 1);
                        } else {
                            i++;
                        }
                    }
                }

                function buildMessage(expected, found) {
                    function stringEscape(s) {
                        function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

                        return s
                            .replace(/\\/g,   '\\\\')
                            .replace(/"/g,    '\\"')
                            .replace(/\x08/g, '\\b')
                            .replace(/\t/g,   '\\t')
                            .replace(/\n/g,   '\\n')
                            .replace(/\f/g,   '\\f')
                            .replace(/\r/g,   '\\r')
                            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
                            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
                            .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
                            .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
                    }

                    var expectedDescs = new Array(expected.length),
                        expectedDesc, foundDesc, i;

                    for (i = 0; i < expected.length; i++) {
                        expectedDescs[i] = expected[i].description;
                    }

                    expectedDesc = expected.length > 1
                        ? expectedDescs.slice(0, -1).join(", ")
                    + " or "
                    + expectedDescs[expected.length - 1]
                        : expectedDescs[0];

                    foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

                    return "Expected " + expectedDesc + " but " + foundDesc + " found.";
                }

                var posDetails = peg$computePosDetails(pos),
                    found      = pos < input.length ? input.charAt(pos) : null;

                if (expected !== null) {
                    cleanupExpected(expected);
                }

                return new SyntaxError(
                    message !== null ? message : buildMessage(expected, found),
                    expected,
                    found,
                    pos,
                    posDetails.line,
                    posDetails.column
                );
            }

            function peg$parseStart() {
                var s0;

                s0 = peg$parseTemplate();

                return s0;
            }

            function peg$parseTemplate() {
                var s0, s1;

                s0 = peg$currPos;
                s1 = peg$parseChildNodes();
                if (s1 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c0(s1);
                }
                s0 = s1;

                return s0;
            }

            function peg$parseDocType() {
                var s0, s1, s2, s3, s4, s5;

                s0 = peg$currPos;
                if (input.substr(peg$currPos, 9) === peg$c2) {
                    s1 = peg$c2;
                    peg$currPos += 9;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c3); }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (s2 !== peg$FAILED) {
                        s3 = [];
                        if (peg$c5.test(input.charAt(peg$currPos))) {
                            s4 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s4 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c6); }
                        }
                        if (s4 !== peg$FAILED) {
                            while (s4 !== peg$FAILED) {
                                s3.push(s4);
                                if (peg$c5.test(input.charAt(peg$currPos))) {
                                    s4 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                } else {
                                    s4 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c6); }
                                }
                            }
                        } else {
                            s3 = peg$c1;
                        }
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse_();
                            if (s4 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 62) {
                                    s5 = peg$c7;
                                    peg$currPos++;
                                } else {
                                    s5 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c8); }
                                }
                                if (s5 !== peg$FAILED) {
                                    peg$reportedPos = s0;
                                    s1 = peg$c9(s3);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$c1;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$c1;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }

                return s0;
            }

            function peg$parseChildNodes() {
                var s0, s1, s2;

                s0 = peg$currPos;
                s1 = [];
                s2 = peg$parseVoidElement();
                if (s2 === peg$FAILED) {
                    s2 = peg$parseElementNode();
                    if (s2 === peg$FAILED) {
                        s2 = peg$parseCommentNode();
                        if (s2 === peg$FAILED) {
                            s2 = peg$parseTextNode();
                            if (s2 === peg$FAILED) {
                                s2 = peg$parseBlockBinding();
                            }
                        }
                    }
                }
                while (s2 !== peg$FAILED) {
                    s1.push(s2);
                    s2 = peg$parseVoidElement();
                    if (s2 === peg$FAILED) {
                        s2 = peg$parseElementNode();
                        if (s2 === peg$FAILED) {
                            s2 = peg$parseCommentNode();
                            if (s2 === peg$FAILED) {
                                s2 = peg$parseTextNode();
                                if (s2 === peg$FAILED) {
                                    s2 = peg$parseBlockBinding();
                                }
                            }
                        }
                    }
                }
                if (s1 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c10(s1);
                }
                s0 = s1;

                return s0;
            }

            function peg$parseCommentNode() {
                var s0, s1, s2, s3, s4, s5, s6;

                s0 = peg$currPos;
                s1 = peg$parse_();
                if (s1 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 4) === peg$c11) {
                        s2 = peg$c11;
                        peg$currPos += 4;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c12); }
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = [];
                        s4 = peg$currPos;
                        s5 = peg$currPos;
                        peg$silentFails++;
                        if (input.substr(peg$currPos, 3) === peg$c14) {
                            s6 = peg$c14;
                            peg$currPos += 3;
                        } else {
                            s6 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c15); }
                        }
                        peg$silentFails--;
                        if (s6 === peg$FAILED) {
                            s5 = peg$c13;
                        } else {
                            peg$currPos = s5;
                            s5 = peg$c1;
                        }
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parseSourceCharacter();
                            if (s6 !== peg$FAILED) {
                                peg$reportedPos = s4;
                                s5 = peg$c16(s6);
                                s4 = s5;
                            } else {
                                peg$currPos = s4;
                                s4 = peg$c1;
                            }
                        } else {
                            peg$currPos = s4;
                            s4 = peg$c1;
                        }
                        if (s4 !== peg$FAILED) {
                            while (s4 !== peg$FAILED) {
                                s3.push(s4);
                                s4 = peg$currPos;
                                s5 = peg$currPos;
                                peg$silentFails++;
                                if (input.substr(peg$currPos, 3) === peg$c14) {
                                    s6 = peg$c14;
                                    peg$currPos += 3;
                                } else {
                                    s6 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c15); }
                                }
                                peg$silentFails--;
                                if (s6 === peg$FAILED) {
                                    s5 = peg$c13;
                                } else {
                                    peg$currPos = s5;
                                    s5 = peg$c1;
                                }
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parseSourceCharacter();
                                    if (s6 !== peg$FAILED) {
                                        peg$reportedPos = s4;
                                        s5 = peg$c16(s6);
                                        s4 = s5;
                                    } else {
                                        peg$currPos = s4;
                                        s4 = peg$c1;
                                    }
                                } else {
                                    peg$currPos = s4;
                                    s4 = peg$c1;
                                }
                            }
                        } else {
                            s3 = peg$c1;
                        }
                        if (s3 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 3) === peg$c14) {
                                s4 = peg$c14;
                                peg$currPos += 3;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c15); }
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parse_();
                                if (s5 !== peg$FAILED) {
                                    peg$reportedPos = s0;
                                    s1 = peg$c17(s3);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$c1;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$c1;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$parseDocType();
                }

                return s0;
            }

            function peg$parseVoidElement() {
                var s0, s1, s2, s3, s4, s5, s6;

                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 60) {
                    s1 = peg$c18;
                    peg$currPos++;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c19); }
                }
                if (s1 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 4) === peg$c20) {
                        s2 = peg$c20;
                        peg$currPos += 4;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c21); }
                    }
                    if (s2 === peg$FAILED) {
                        if (input.substr(peg$currPos, 4) === peg$c22) {
                            s2 = peg$c22;
                            peg$currPos += 4;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c23); }
                        }
                        if (s2 === peg$FAILED) {
                            if (input.substr(peg$currPos, 2) === peg$c24) {
                                s2 = peg$c24;
                                peg$currPos += 2;
                            } else {
                                s2 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c25); }
                            }
                            if (s2 === peg$FAILED) {
                                if (input.substr(peg$currPos, 3) === peg$c26) {
                                    s2 = peg$c26;
                                    peg$currPos += 3;
                                } else {
                                    s2 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c27); }
                                }
                                if (s2 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 7) === peg$c28) {
                                        s2 = peg$c28;
                                        peg$currPos += 7;
                                    } else {
                                        s2 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c29); }
                                    }
                                    if (s2 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 5) === peg$c30) {
                                            s2 = peg$c30;
                                            peg$currPos += 5;
                                        } else {
                                            s2 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c31); }
                                        }
                                        if (s2 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 2) === peg$c32) {
                                                s2 = peg$c32;
                                                peg$currPos += 2;
                                            } else {
                                                s2 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c33); }
                                            }
                                            if (s2 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 3) === peg$c34) {
                                                    s2 = peg$c34;
                                                    peg$currPos += 3;
                                                } else {
                                                    s2 = peg$FAILED;
                                                    if (peg$silentFails === 0) { peg$fail(peg$c35); }
                                                }
                                                if (s2 === peg$FAILED) {
                                                    if (input.substr(peg$currPos, 5) === peg$c36) {
                                                        s2 = peg$c36;
                                                        peg$currPos += 5;
                                                    } else {
                                                        s2 = peg$FAILED;
                                                        if (peg$silentFails === 0) { peg$fail(peg$c37); }
                                                    }
                                                    if (s2 === peg$FAILED) {
                                                        if (input.substr(peg$currPos, 6) === peg$c38) {
                                                            s2 = peg$c38;
                                                            peg$currPos += 6;
                                                        } else {
                                                            s2 = peg$FAILED;
                                                            if (peg$silentFails === 0) { peg$fail(peg$c39); }
                                                        }
                                                        if (s2 === peg$FAILED) {
                                                            if (input.substr(peg$currPos, 4) === peg$c40) {
                                                                s2 = peg$c40;
                                                                peg$currPos += 4;
                                                            } else {
                                                                s2 = peg$FAILED;
                                                                if (peg$silentFails === 0) { peg$fail(peg$c41); }
                                                            }
                                                            if (s2 === peg$FAILED) {
                                                                if (input.substr(peg$currPos, 4) === peg$c42) {
                                                                    s2 = peg$c42;
                                                                    peg$currPos += 4;
                                                                } else {
                                                                    s2 = peg$FAILED;
                                                                    if (peg$silentFails === 0) { peg$fail(peg$c43); }
                                                                }
                                                                if (s2 === peg$FAILED) {
                                                                    if (input.substr(peg$currPos, 5) === peg$c44) {
                                                                        s2 = peg$c44;
                                                                        peg$currPos += 5;
                                                                    } else {
                                                                        s2 = peg$FAILED;
                                                                        if (peg$silentFails === 0) { peg$fail(peg$c45); }
                                                                    }
                                                                    if (s2 === peg$FAILED) {
                                                                        if (input.substr(peg$currPos, 6) === peg$c46) {
                                                                            s2 = peg$c46;
                                                                            peg$currPos += 6;
                                                                        } else {
                                                                            s2 = peg$FAILED;
                                                                            if (peg$silentFails === 0) { peg$fail(peg$c47); }
                                                                        }
                                                                        if (s2 === peg$FAILED) {
                                                                            if (input.substr(peg$currPos, 5) === peg$c48) {
                                                                                s2 = peg$c48;
                                                                                peg$currPos += 5;
                                                                            } else {
                                                                                s2 = peg$FAILED;
                                                                                if (peg$silentFails === 0) { peg$fail(peg$c49); }
                                                                            }
                                                                            if (s2 === peg$FAILED) {
                                                                                if (input.substr(peg$currPos, 3) === peg$c50) {
                                                                                    s2 = peg$c50;
                                                                                    peg$currPos += 3;
                                                                                } else {
                                                                                    s2 = peg$FAILED;
                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c51); }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseTagAttributes();
                        if (s3 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 62) {
                                s4 = peg$c7;
                                peg$currPos++;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c8); }
                            }
                            if (s4 === peg$FAILED) {
                                if (input.substr(peg$currPos, 2) === peg$c53) {
                                    s4 = peg$c53;
                                    peg$currPos += 2;
                                } else {
                                    s4 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c54); }
                                }
                            }
                            if (s4 === peg$FAILED) {
                                s4 = peg$c52;
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parse_();
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parseEndVoidTag();
                                    if (s6 === peg$FAILED) {
                                        s6 = peg$c52;
                                    }
                                    if (s6 !== peg$FAILED) {
                                        peg$reportedPos = s0;
                                        s1 = peg$c55(s2, s3, s6);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$c1;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$c1;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$c1;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }

                return s0;
            }

            function peg$parseEndVoidTag() {
                var s0, s1, s2, s3;

                s0 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c56) {
                    s1 = peg$c56;
                    peg$currPos += 2;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c57); }
                }
                if (s1 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 4) === peg$c20) {
                        s2 = peg$c20;
                        peg$currPos += 4;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c21); }
                    }
                    if (s2 === peg$FAILED) {
                        if (input.substr(peg$currPos, 4) === peg$c22) {
                            s2 = peg$c22;
                            peg$currPos += 4;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c23); }
                        }
                        if (s2 === peg$FAILED) {
                            if (input.substr(peg$currPos, 2) === peg$c24) {
                                s2 = peg$c24;
                                peg$currPos += 2;
                            } else {
                                s2 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c25); }
                            }
                            if (s2 === peg$FAILED) {
                                if (input.substr(peg$currPos, 3) === peg$c26) {
                                    s2 = peg$c26;
                                    peg$currPos += 3;
                                } else {
                                    s2 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c27); }
                                }
                                if (s2 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 7) === peg$c28) {
                                        s2 = peg$c28;
                                        peg$currPos += 7;
                                    } else {
                                        s2 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c29); }
                                    }
                                    if (s2 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 5) === peg$c30) {
                                            s2 = peg$c30;
                                            peg$currPos += 5;
                                        } else {
                                            s2 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c31); }
                                        }
                                        if (s2 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 2) === peg$c32) {
                                                s2 = peg$c32;
                                                peg$currPos += 2;
                                            } else {
                                                s2 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c33); }
                                            }
                                            if (s2 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 3) === peg$c34) {
                                                    s2 = peg$c34;
                                                    peg$currPos += 3;
                                                } else {
                                                    s2 = peg$FAILED;
                                                    if (peg$silentFails === 0) { peg$fail(peg$c35); }
                                                }
                                                if (s2 === peg$FAILED) {
                                                    if (input.substr(peg$currPos, 5) === peg$c36) {
                                                        s2 = peg$c36;
                                                        peg$currPos += 5;
                                                    } else {
                                                        s2 = peg$FAILED;
                                                        if (peg$silentFails === 0) { peg$fail(peg$c37); }
                                                    }
                                                    if (s2 === peg$FAILED) {
                                                        if (input.substr(peg$currPos, 6) === peg$c38) {
                                                            s2 = peg$c38;
                                                            peg$currPos += 6;
                                                        } else {
                                                            s2 = peg$FAILED;
                                                            if (peg$silentFails === 0) { peg$fail(peg$c39); }
                                                        }
                                                        if (s2 === peg$FAILED) {
                                                            if (input.substr(peg$currPos, 4) === peg$c40) {
                                                                s2 = peg$c40;
                                                                peg$currPos += 4;
                                                            } else {
                                                                s2 = peg$FAILED;
                                                                if (peg$silentFails === 0) { peg$fail(peg$c41); }
                                                            }
                                                            if (s2 === peg$FAILED) {
                                                                if (input.substr(peg$currPos, 4) === peg$c42) {
                                                                    s2 = peg$c42;
                                                                    peg$currPos += 4;
                                                                } else {
                                                                    s2 = peg$FAILED;
                                                                    if (peg$silentFails === 0) { peg$fail(peg$c43); }
                                                                }
                                                                if (s2 === peg$FAILED) {
                                                                    if (input.substr(peg$currPos, 5) === peg$c44) {
                                                                        s2 = peg$c44;
                                                                        peg$currPos += 5;
                                                                    } else {
                                                                        s2 = peg$FAILED;
                                                                        if (peg$silentFails === 0) { peg$fail(peg$c45); }
                                                                    }
                                                                    if (s2 === peg$FAILED) {
                                                                        if (input.substr(peg$currPos, 6) === peg$c46) {
                                                                            s2 = peg$c46;
                                                                            peg$currPos += 6;
                                                                        } else {
                                                                            s2 = peg$FAILED;
                                                                            if (peg$silentFails === 0) { peg$fail(peg$c47); }
                                                                        }
                                                                        if (s2 === peg$FAILED) {
                                                                            if (input.substr(peg$currPos, 5) === peg$c48) {
                                                                                s2 = peg$c48;
                                                                                peg$currPos += 5;
                                                                            } else {
                                                                                s2 = peg$FAILED;
                                                                                if (peg$silentFails === 0) { peg$fail(peg$c49); }
                                                                            }
                                                                            if (s2 === peg$FAILED) {
                                                                                if (input.substr(peg$currPos, 3) === peg$c50) {
                                                                                    s2 = peg$c50;
                                                                                    peg$currPos += 3;
                                                                                } else {
                                                                                    s2 = peg$FAILED;
                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c51); }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 62) {
                            s3 = peg$c7;
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c8); }
                        }
                        if (s3 !== peg$FAILED) {
                            peg$reportedPos = s0;
                            s1 = peg$c58(s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }

                return s0;
            }

            function peg$parseElementNode() {
                var s0, s1, s2, s3;

                s0 = peg$currPos;
                s1 = peg$parseStartTag();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseChildNodes();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseEndTag();
                        if (s3 !== peg$FAILED) {
                            peg$reportedPos = s0;
                            s1 = peg$c59(s1, s2, s3);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$parseStartEndTag();
                }

                return s0;
            }

            function peg$parseTextNode() {
                var s0, s1, s2;

                s0 = peg$currPos;
                s1 = [];
                s2 = peg$parseTextCharacter();
                if (s2 !== peg$FAILED) {
                    while (s2 !== peg$FAILED) {
                        s1.push(s2);
                        s2 = peg$parseTextCharacter();
                    }
                } else {
                    s1 = peg$c1;
                }
                if (s1 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c60(s1);
                }
                s0 = s1;

                return s0;
            }

            function peg$parseTextCharacter() {
                var s0, s1, s2;

                s0 = peg$currPos;
                s1 = peg$currPos;
                peg$silentFails++;
                if (input.charCodeAt(peg$currPos) === 60) {
                    s2 = peg$c18;
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c19); }
                }
                if (s2 === peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c61) {
                        s2 = peg$c61;
                        peg$currPos += 2;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c62); }
                    }
                }
                peg$silentFails--;
                if (s2 === peg$FAILED) {
                    s1 = peg$c13;
                } else {
                    peg$currPos = s1;
                    s1 = peg$c1;
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseSourceCharacter();
                    if (s2 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c63();
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }

                return s0;
            }

            function peg$parseStartTag() {
                var s0, s1, s2, s3, s4, s5;

                s0 = peg$currPos;
                s1 = peg$parse_();
                if (s1 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 60) {
                        s2 = peg$c18;
                        peg$currPos++;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c19); }
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseTagInfo();
                        if (s3 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 62) {
                                s4 = peg$c7;
                                peg$currPos++;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c8); }
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parse_();
                                if (s5 !== peg$FAILED) {
                                    peg$reportedPos = s0;
                                    s1 = peg$c64(s3);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$c1;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$c1;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }

                return s0;
            }

            function peg$parseStartEndTag() {
                var s0, s1, s2, s3, s4, s5;

                s0 = peg$currPos;
                s1 = peg$parse_();
                if (s1 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 60) {
                        s2 = peg$c18;
                        peg$currPos++;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c19); }
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseTagInfo();
                        if (s3 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 2) === peg$c53) {
                                s4 = peg$c53;
                                peg$currPos += 2;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c54); }
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parse_();
                                if (s5 !== peg$FAILED) {
                                    peg$reportedPos = s0;
                                    s1 = peg$c65(s3);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$c1;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$c1;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }

                return s0;
            }

            function peg$parseTagInfo() {
                var s0, s1, s2;

                s0 = peg$currPos;
                s1 = peg$parseTagName();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseTagAttributes();
                    if (s2 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c66(s1, s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }

                return s0;
            }

            function peg$parseTagAttributes() {
                var s0, s1, s2, s3;

                s0 = peg$currPos;
                s1 = peg$parse_();
                if (s1 !== peg$FAILED) {
                    s2 = [];
                    s3 = peg$parseAttribute();
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$parseAttribute();
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parse_();
                        if (s3 !== peg$FAILED) {
                            peg$reportedPos = s0;
                            s1 = peg$c67(s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }

                return s0;
            }

            function peg$parseEndTag() {
                var s0, s1, s2, s3;

                s0 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c56) {
                    s1 = peg$c56;
                    peg$currPos += 2;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c57); }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseTagName();
                    if (s2 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 62) {
                            s3 = peg$c7;
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c8); }
                        }
                        if (s3 !== peg$FAILED) {
                            peg$reportedPos = s0;
                            s1 = peg$c58(s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }

                return s0;
            }

            function peg$parseTagName() {
                var s0, s1, s2, s3;

                s0 = peg$currPos;
                s1 = peg$parse_();
                if (s1 !== peg$FAILED) {
                    s2 = [];
                    if (peg$c68.test(input.charAt(peg$currPos))) {
                        s3 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c69); }
                    }
                    if (s3 !== peg$FAILED) {
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            if (peg$c68.test(input.charAt(peg$currPos))) {
                                s3 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c69); }
                            }
                        }
                    } else {
                        s2 = peg$c1;
                    }
                    if (s2 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c70(s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }

                return s0;
            }

            function peg$parseAttribute() {
                var s0, s1, s2, s3, s4, s5;

                s0 = peg$currPos;
                s1 = peg$parseTagName();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (s2 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 61) {
                            s3 = peg$c71;
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c72); }
                        }
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse_();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseAttributeValues();
                                if (s5 !== peg$FAILED) {
                                    peg$reportedPos = s0;
                                    s1 = peg$c73(s1, s5);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$c1;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$c1;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parseTagName();
                    if (s1 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c74(s1);
                    }
                    s0 = s1;
                }

                return s0;
            }

            function peg$parseAttributeValues() {
                var s0, s1, s2, s3, s4, s5, s6, s7;

                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 34) {
                    s1 = peg$c75;
                    peg$currPos++;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c76); }
                }
                if (s1 !== peg$FAILED) {
                    s2 = [];
                    s3 = peg$parseAttrTextBinding();
                    if (s3 === peg$FAILED) {
                        s3 = peg$currPos;
                        s4 = [];
                        s5 = peg$currPos;
                        s6 = peg$currPos;
                        peg$silentFails++;
                        if (input.substr(peg$currPos, 2) === peg$c61) {
                            s7 = peg$c61;
                            peg$currPos += 2;
                        } else {
                            s7 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c62); }
                        }
                        peg$silentFails--;
                        if (s7 === peg$FAILED) {
                            s6 = peg$c13;
                        } else {
                            peg$currPos = s6;
                            s6 = peg$c1;
                        }
                        if (s6 !== peg$FAILED) {
                            if (peg$c77.test(input.charAt(peg$currPos))) {
                                s7 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s7 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c78); }
                            }
                            if (s7 !== peg$FAILED) {
                                s6 = [s6, s7];
                                s5 = s6;
                            } else {
                                peg$currPos = s5;
                                s5 = peg$c1;
                            }
                        } else {
                            peg$currPos = s5;
                            s5 = peg$c1;
                        }
                        if (s5 !== peg$FAILED) {
                            while (s5 !== peg$FAILED) {
                                s4.push(s5);
                                s5 = peg$currPos;
                                s6 = peg$currPos;
                                peg$silentFails++;
                                if (input.substr(peg$currPos, 2) === peg$c61) {
                                    s7 = peg$c61;
                                    peg$currPos += 2;
                                } else {
                                    s7 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c62); }
                                }
                                peg$silentFails--;
                                if (s7 === peg$FAILED) {
                                    s6 = peg$c13;
                                } else {
                                    peg$currPos = s6;
                                    s6 = peg$c1;
                                }
                                if (s6 !== peg$FAILED) {
                                    if (peg$c77.test(input.charAt(peg$currPos))) {
                                        s7 = input.charAt(peg$currPos);
                                        peg$currPos++;
                                    } else {
                                        s7 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c78); }
                                    }
                                    if (s7 !== peg$FAILED) {
                                        s6 = [s6, s7];
                                        s5 = s6;
                                    } else {
                                        peg$currPos = s5;
                                        s5 = peg$c1;
                                    }
                                } else {
                                    peg$currPos = s5;
                                    s5 = peg$c1;
                                }
                            }
                        } else {
                            s4 = peg$c1;
                        }
                        if (s4 !== peg$FAILED) {
                            peg$reportedPos = s3;
                            s4 = peg$c79();
                        }
                        s3 = s4;
                    }
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$parseAttrTextBinding();
                        if (s3 === peg$FAILED) {
                            s3 = peg$currPos;
                            s4 = [];
                            s5 = peg$currPos;
                            s6 = peg$currPos;
                            peg$silentFails++;
                            if (input.substr(peg$currPos, 2) === peg$c61) {
                                s7 = peg$c61;
                                peg$currPos += 2;
                            } else {
                                s7 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c62); }
                            }
                            peg$silentFails--;
                            if (s7 === peg$FAILED) {
                                s6 = peg$c13;
                            } else {
                                peg$currPos = s6;
                                s6 = peg$c1;
                            }
                            if (s6 !== peg$FAILED) {
                                if (peg$c77.test(input.charAt(peg$currPos))) {
                                    s7 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                } else {
                                    s7 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c78); }
                                }
                                if (s7 !== peg$FAILED) {
                                    s6 = [s6, s7];
                                    s5 = s6;
                                } else {
                                    peg$currPos = s5;
                                    s5 = peg$c1;
                                }
                            } else {
                                peg$currPos = s5;
                                s5 = peg$c1;
                            }
                            if (s5 !== peg$FAILED) {
                                while (s5 !== peg$FAILED) {
                                    s4.push(s5);
                                    s5 = peg$currPos;
                                    s6 = peg$currPos;
                                    peg$silentFails++;
                                    if (input.substr(peg$currPos, 2) === peg$c61) {
                                        s7 = peg$c61;
                                        peg$currPos += 2;
                                    } else {
                                        s7 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c62); }
                                    }
                                    peg$silentFails--;
                                    if (s7 === peg$FAILED) {
                                        s6 = peg$c13;
                                    } else {
                                        peg$currPos = s6;
                                        s6 = peg$c1;
                                    }
                                    if (s6 !== peg$FAILED) {
                                        if (peg$c77.test(input.charAt(peg$currPos))) {
                                            s7 = input.charAt(peg$currPos);
                                            peg$currPos++;
                                        } else {
                                            s7 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c78); }
                                        }
                                        if (s7 !== peg$FAILED) {
                                            s6 = [s6, s7];
                                            s5 = s6;
                                        } else {
                                            peg$currPos = s5;
                                            s5 = peg$c1;
                                        }
                                    } else {
                                        peg$currPos = s5;
                                        s5 = peg$c1;
                                    }
                                }
                            } else {
                                s4 = peg$c1;
                            }
                            if (s4 !== peg$FAILED) {
                                peg$reportedPos = s3;
                                s4 = peg$c79();
                            }
                            s3 = s4;
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 34) {
                            s3 = peg$c75;
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c76); }
                        }
                        if (s3 !== peg$FAILED) {
                            peg$reportedPos = s0;
                            s1 = peg$c80(s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 39) {
                        s1 = peg$c81;
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c82); }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$parseAttrTextBinding();
                        if (s3 === peg$FAILED) {
                            s3 = peg$currPos;
                            s4 = [];
                            s5 = peg$currPos;
                            s6 = peg$currPos;
                            peg$silentFails++;
                            if (input.substr(peg$currPos, 2) === peg$c61) {
                                s7 = peg$c61;
                                peg$currPos += 2;
                            } else {
                                s7 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c62); }
                            }
                            peg$silentFails--;
                            if (s7 === peg$FAILED) {
                                s6 = peg$c13;
                            } else {
                                peg$currPos = s6;
                                s6 = peg$c1;
                            }
                            if (s6 !== peg$FAILED) {
                                if (peg$c83.test(input.charAt(peg$currPos))) {
                                    s7 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                } else {
                                    s7 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c84); }
                                }
                                if (s7 !== peg$FAILED) {
                                    s6 = [s6, s7];
                                    s5 = s6;
                                } else {
                                    peg$currPos = s5;
                                    s5 = peg$c1;
                                }
                            } else {
                                peg$currPos = s5;
                                s5 = peg$c1;
                            }
                            if (s5 !== peg$FAILED) {
                                while (s5 !== peg$FAILED) {
                                    s4.push(s5);
                                    s5 = peg$currPos;
                                    s6 = peg$currPos;
                                    peg$silentFails++;
                                    if (input.substr(peg$currPos, 2) === peg$c61) {
                                        s7 = peg$c61;
                                        peg$currPos += 2;
                                    } else {
                                        s7 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c62); }
                                    }
                                    peg$silentFails--;
                                    if (s7 === peg$FAILED) {
                                        s6 = peg$c13;
                                    } else {
                                        peg$currPos = s6;
                                        s6 = peg$c1;
                                    }
                                    if (s6 !== peg$FAILED) {
                                        if (peg$c83.test(input.charAt(peg$currPos))) {
                                            s7 = input.charAt(peg$currPos);
                                            peg$currPos++;
                                        } else {
                                            s7 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c84); }
                                        }
                                        if (s7 !== peg$FAILED) {
                                            s6 = [s6, s7];
                                            s5 = s6;
                                        } else {
                                            peg$currPos = s5;
                                            s5 = peg$c1;
                                        }
                                    } else {
                                        peg$currPos = s5;
                                        s5 = peg$c1;
                                    }
                                }
                            } else {
                                s4 = peg$c1;
                            }
                            if (s4 !== peg$FAILED) {
                                peg$reportedPos = s3;
                                s4 = peg$c79();
                            }
                            s3 = s4;
                        }
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$parseAttrTextBinding();
                            if (s3 === peg$FAILED) {
                                s3 = peg$currPos;
                                s4 = [];
                                s5 = peg$currPos;
                                s6 = peg$currPos;
                                peg$silentFails++;
                                if (input.substr(peg$currPos, 2) === peg$c61) {
                                    s7 = peg$c61;
                                    peg$currPos += 2;
                                } else {
                                    s7 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c62); }
                                }
                                peg$silentFails--;
                                if (s7 === peg$FAILED) {
                                    s6 = peg$c13;
                                } else {
                                    peg$currPos = s6;
                                    s6 = peg$c1;
                                }
                                if (s6 !== peg$FAILED) {
                                    if (peg$c83.test(input.charAt(peg$currPos))) {
                                        s7 = input.charAt(peg$currPos);
                                        peg$currPos++;
                                    } else {
                                        s7 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c84); }
                                    }
                                    if (s7 !== peg$FAILED) {
                                        s6 = [s6, s7];
                                        s5 = s6;
                                    } else {
                                        peg$currPos = s5;
                                        s5 = peg$c1;
                                    }
                                } else {
                                    peg$currPos = s5;
                                    s5 = peg$c1;
                                }
                                if (s5 !== peg$FAILED) {
                                    while (s5 !== peg$FAILED) {
                                        s4.push(s5);
                                        s5 = peg$currPos;
                                        s6 = peg$currPos;
                                        peg$silentFails++;
                                        if (input.substr(peg$currPos, 2) === peg$c61) {
                                            s7 = peg$c61;
                                            peg$currPos += 2;
                                        } else {
                                            s7 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c62); }
                                        }
                                        peg$silentFails--;
                                        if (s7 === peg$FAILED) {
                                            s6 = peg$c13;
                                        } else {
                                            peg$currPos = s6;
                                            s6 = peg$c1;
                                        }
                                        if (s6 !== peg$FAILED) {
                                            if (peg$c83.test(input.charAt(peg$currPos))) {
                                                s7 = input.charAt(peg$currPos);
                                                peg$currPos++;
                                            } else {
                                                s7 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c84); }
                                            }
                                            if (s7 !== peg$FAILED) {
                                                s6 = [s6, s7];
                                                s5 = s6;
                                            } else {
                                                peg$currPos = s5;
                                                s5 = peg$c1;
                                            }
                                        } else {
                                            peg$currPos = s5;
                                            s5 = peg$c1;
                                        }
                                    }
                                } else {
                                    s4 = peg$c1;
                                }
                                if (s4 !== peg$FAILED) {
                                    peg$reportedPos = s3;
                                    s4 = peg$c79();
                                }
                                s3 = s4;
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 39) {
                                s3 = peg$c81;
                                peg$currPos++;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c82); }
                            }
                            if (s3 !== peg$FAILED) {
                                peg$reportedPos = s0;
                                s1 = peg$c80(s2);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$c1;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parseAttrTextBinding();
                        if (s1 !== peg$FAILED) {
                            peg$reportedPos = s0;
                            s1 = peg$c85(s1);
                        }
                        s0 = s1;
                    }
                }

                return s0;
            }

            function peg$parseBlockBinding() {
                var s0, s1, s2;

                s0 = peg$currPos;
                if (input.substr(peg$currPos, 3) === peg$c86) {
                    s1 = peg$c86;
                    peg$currPos += 3;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c87); }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseStartBlockBinding();
                    if (s2 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c88(s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$parseTextBinding();
                }

                return s0;
            }

            function peg$parseStartBlockBinding() {
                var s0, s1, s2, s3, s4, s5;

                s0 = peg$currPos;
                s1 = peg$parseSingleScript();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseTemplate();
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse_();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseChildBlockBinding();
                                if (s5 !== peg$FAILED) {
                                    peg$reportedPos = s0;
                                    s1 = peg$c89(s1, s3, s5);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$c1;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$c1;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }

                return s0;
            }

            function peg$parseChildBlockBinding() {
                var s0, s1, s2;

                s0 = peg$currPos;
                if (input.substr(peg$currPos, 3) === peg$c90) {
                    s1 = peg$c90;
                    peg$currPos += 3;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c91); }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseStartBlockBinding();
                    if (s2 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c92(s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 5) === peg$c93) {
                        s1 = peg$c93;
                        peg$currPos += 5;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c94); }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse_();
                        if (s2 !== peg$FAILED) {
                            peg$reportedPos = s0;
                            s1 = peg$c95();
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                }

                return s0;
            }

            function peg$parseTextBinding() {
                var s0, s1, s2, s3, s4, s5;

                s0 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c61) {
                    s1 = peg$c61;
                    peg$currPos += 2;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c62); }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseScripts();
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse_();
                            if (s4 !== peg$FAILED) {
                                if (input.substr(peg$currPos, 2) === peg$c96) {
                                    s5 = peg$c96;
                                    peg$currPos += 2;
                                } else {
                                    s5 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c97); }
                                }
                                if (s5 !== peg$FAILED) {
                                    peg$reportedPos = s0;
                                    s1 = peg$c98(s3);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$c1;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$c1;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }

                return s0;
            }

            function peg$parseAttrTextBinding() {
                var s0, s1, s2, s3, s4, s5;

                s0 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c61) {
                    s1 = peg$c61;
                    peg$currPos += 2;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c62); }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseScripts();
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse_();
                            if (s4 !== peg$FAILED) {
                                if (input.substr(peg$currPos, 2) === peg$c96) {
                                    s5 = peg$c96;
                                    peg$currPos += 2;
                                } else {
                                    s5 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c97); }
                                }
                                if (s5 !== peg$FAILED) {
                                    peg$reportedPos = s0;
                                    s1 = peg$c99(s3);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$c1;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$c1;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }

                return s0;
            }

            function peg$parseSingleScript() {
                var s0, s1, s2, s3, s4;

                s0 = peg$currPos;
                s1 = peg$parse_();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseReferenceName();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parse_();
                        if (s3 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 2) === peg$c96) {
                                s4 = peg$c96;
                                peg$currPos += 2;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c97); }
                            }
                            if (s4 !== peg$FAILED) {
                                peg$reportedPos = s0;
                                s1 = peg$c100(s2);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$c1;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parseScripts();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parse_();
                        if (s2 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 2) === peg$c96) {
                                s3 = peg$c96;
                                peg$currPos += 2;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c97); }
                            }
                            if (s3 !== peg$FAILED) {
                                peg$reportedPos = s0;
                                s1 = peg$c99(s1);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$c1;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                }

                return s0;
            }

            function peg$parseScripts() {
                var s0, s1, s2, s3, s4, s5, s6, s7;

                s0 = peg$currPos;
                s1 = peg$parseHashValues();
                if (s1 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c101(s1);
                }
                s0 = s1;
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parse_();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseTernaryConditional();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parse_();
                            if (s3 !== peg$FAILED) {
                                s4 = [];
                                s5 = peg$currPos;
                                if (input.charCodeAt(peg$currPos) === 44) {
                                    s6 = peg$c102;
                                    peg$currPos++;
                                } else {
                                    s6 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c103); }
                                }
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseHashValuesArray();
                                    if (s7 !== peg$FAILED) {
                                        s6 = [s6, s7];
                                        s5 = s6;
                                    } else {
                                        peg$currPos = s5;
                                        s5 = peg$c1;
                                    }
                                } else {
                                    peg$currPos = s5;
                                    s5 = peg$c1;
                                }
                                while (s5 !== peg$FAILED) {
                                    s4.push(s5);
                                    s5 = peg$currPos;
                                    if (input.charCodeAt(peg$currPos) === 44) {
                                        s6 = peg$c102;
                                        peg$currPos++;
                                    } else {
                                        s6 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c103); }
                                    }
                                    if (s6 !== peg$FAILED) {
                                        s7 = peg$parseHashValuesArray();
                                        if (s7 !== peg$FAILED) {
                                            s6 = [s6, s7];
                                            s5 = s6;
                                        } else {
                                            peg$currPos = s5;
                                            s5 = peg$c1;
                                        }
                                    } else {
                                        peg$currPos = s5;
                                        s5 = peg$c1;
                                    }
                                }
                                if (s4 !== peg$FAILED) {
                                    peg$reportedPos = s0;
                                    s1 = peg$c104(s2, s4);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$c1;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$c1;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                }

                return s0;
            }

            function peg$parseTernaryConditional() {
                var s0, s1, s2, s3, s4, s5;

                s0 = peg$currPos;
                s1 = peg$parseAssignment();
                if (s1 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 63) {
                        s2 = peg$c105;
                        peg$currPos++;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c106); }
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseTernaryConditional();
                        if (s3 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 58) {
                                s4 = peg$c107;
                                peg$currPos++;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c108); }
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseTernaryConditional();
                                if (s5 !== peg$FAILED) {
                                    peg$reportedPos = s0;
                                    s1 = peg$c109(s1, s3, s5);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$c1;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$c1;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$parseAssignment();
                }

                return s0;
            }

            function peg$parseParameters() {
                var s0, s1, s2, s3;

                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 40) {
                    s1 = peg$c110;
                    peg$currPos++;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c111); }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseInnerParameters();
                    if (s2 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 41) {
                            s3 = peg$c112;
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c113); }
                        }
                        if (s3 !== peg$FAILED) {
                            peg$reportedPos = s0;
                            s1 = peg$c114(s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 2) === peg$c115) {
                        s1 = peg$c115;
                        peg$currPos += 2;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c116); }
                    }
                    if (s1 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c117();
                    }
                    s0 = s1;
                }

                return s0;
            }

            function peg$parseInnerParameters() {
                var s0, s1, s2, s3, s4, s5;

                s0 = peg$currPos;
                s1 = peg$parseTernaryConditional();
                if (s1 !== peg$FAILED) {
                    s2 = [];
                    s3 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 44) {
                        s4 = peg$c102;
                        peg$currPos++;
                    } else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c103); }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseTernaryConditional();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$c1;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$c1;
                    }
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$currPos;
                        if (input.charCodeAt(peg$currPos) === 44) {
                            s4 = peg$c102;
                            peg$currPos++;
                        } else {
                            s4 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c103); }
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseTernaryConditional();
                            if (s5 !== peg$FAILED) {
                                s4 = [s4, s5];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$c1;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$c1;
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c118(s1, s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }

                return s0;
            }

            function peg$parseAssignment() {
                var s0, s1, s2, s3;

                s0 = peg$currPos;
                s1 = peg$parseObjectReference();
                if (s1 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 61) {
                        s2 = peg$c71;
                        peg$currPos++;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c72); }
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseAssignment();
                        if (s3 !== peg$FAILED) {
                            peg$reportedPos = s0;
                            s1 = peg$c119(s1, s3);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$parseOperation();
                }

                return s0;
            }

            function peg$parseOperation() {
                var s0, s1, s2, s3;

                s0 = peg$currPos;
                s1 = peg$parseOperatable();
                if (s1 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c120) {
                        s2 = peg$c120;
                        peg$currPos += 2;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c121); }
                    }
                    if (s2 === peg$FAILED) {
                        if (input.substr(peg$currPos, 2) === peg$c122) {
                            s2 = peg$c122;
                            peg$currPos += 2;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c123); }
                        }
                        if (s2 === peg$FAILED) {
                            if (input.substr(peg$currPos, 3) === peg$c124) {
                                s2 = peg$c124;
                                peg$currPos += 3;
                            } else {
                                s2 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c125); }
                            }
                            if (s2 === peg$FAILED) {
                                if (input.substr(peg$currPos, 2) === peg$c126) {
                                    s2 = peg$c126;
                                    peg$currPos += 2;
                                } else {
                                    s2 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c127); }
                                }
                                if (s2 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 3) === peg$c128) {
                                        s2 = peg$c128;
                                        peg$currPos += 3;
                                    } else {
                                        s2 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c129); }
                                    }
                                    if (s2 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 2) === peg$c130) {
                                            s2 = peg$c130;
                                            peg$currPos += 2;
                                        } else {
                                            s2 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c131); }
                                        }
                                        if (s2 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 3) === peg$c132) {
                                                s2 = peg$c132;
                                                peg$currPos += 3;
                                            } else {
                                                s2 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c133); }
                                            }
                                            if (s2 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 2) === peg$c134) {
                                                    s2 = peg$c134;
                                                    peg$currPos += 2;
                                                } else {
                                                    s2 = peg$FAILED;
                                                    if (peg$silentFails === 0) { peg$fail(peg$c135); }
                                                }
                                                if (s2 === peg$FAILED) {
                                                    if (input.charCodeAt(peg$currPos) === 62) {
                                                        s2 = peg$c7;
                                                        peg$currPos++;
                                                    } else {
                                                        s2 = peg$FAILED;
                                                        if (peg$silentFails === 0) { peg$fail(peg$c8); }
                                                    }
                                                    if (s2 === peg$FAILED) {
                                                        if (input.substr(peg$currPos, 3) === peg$c136) {
                                                            s2 = peg$c136;
                                                            peg$currPos += 3;
                                                        } else {
                                                            s2 = peg$FAILED;
                                                            if (peg$silentFails === 0) { peg$fail(peg$c137); }
                                                        }
                                                        if (s2 === peg$FAILED) {
                                                            if (input.substr(peg$currPos, 2) === peg$c138) {
                                                                s2 = peg$c138;
                                                                peg$currPos += 2;
                                                            } else {
                                                                s2 = peg$FAILED;
                                                                if (peg$silentFails === 0) { peg$fail(peg$c139); }
                                                            }
                                                            if (s2 === peg$FAILED) {
                                                                if (input.charCodeAt(peg$currPos) === 60) {
                                                                    s2 = peg$c18;
                                                                    peg$currPos++;
                                                                } else {
                                                                    s2 = peg$FAILED;
                                                                    if (peg$silentFails === 0) { peg$fail(peg$c19); }
                                                                }
                                                                if (s2 === peg$FAILED) {
                                                                    if (input.charCodeAt(peg$currPos) === 43) {
                                                                        s2 = peg$c140;
                                                                        peg$currPos++;
                                                                    } else {
                                                                        s2 = peg$FAILED;
                                                                        if (peg$silentFails === 0) { peg$fail(peg$c141); }
                                                                    }
                                                                    if (s2 === peg$FAILED) {
                                                                        if (input.charCodeAt(peg$currPos) === 45) {
                                                                            s2 = peg$c142;
                                                                            peg$currPos++;
                                                                        } else {
                                                                            s2 = peg$FAILED;
                                                                            if (peg$silentFails === 0) { peg$fail(peg$c143); }
                                                                        }
                                                                        if (s2 === peg$FAILED) {
                                                                            if (input.charCodeAt(peg$currPos) === 37) {
                                                                                s2 = peg$c144;
                                                                                peg$currPos++;
                                                                            } else {
                                                                                s2 = peg$FAILED;
                                                                                if (peg$silentFails === 0) { peg$fail(peg$c145); }
                                                                            }
                                                                            if (s2 === peg$FAILED) {
                                                                                if (input.charCodeAt(peg$currPos) === 42) {
                                                                                    s2 = peg$c146;
                                                                                    peg$currPos++;
                                                                                } else {
                                                                                    s2 = peg$FAILED;
                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c147); }
                                                                                }
                                                                                if (s2 === peg$FAILED) {
                                                                                    if (input.charCodeAt(peg$currPos) === 47) {
                                                                                        s2 = peg$c148;
                                                                                        peg$currPos++;
                                                                                    } else {
                                                                                        s2 = peg$FAILED;
                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c149); }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseOperation();
                        if (s3 !== peg$FAILED) {
                            peg$reportedPos = s0;
                            s1 = peg$c150(s1, s2, s3);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$parseOperatable();
                }

                return s0;
            }

            function peg$parseOperatable() {
                var s0, s1, s2, s3;

                s0 = peg$currPos;
                s1 = peg$parse_();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseModifiers();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parse_();
                        if (s3 !== peg$FAILED) {
                            peg$reportedPos = s0;
                            s1 = peg$c151(s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }

                return s0;
            }

            function peg$parseModifiers() {
                var s0, s1, s2, s3;

                s0 = peg$currPos;
                s1 = peg$parseNot();
                if (s1 !== peg$FAILED) {
                    s2 = [];
                    s3 = peg$parseModifier();
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$parseModifier();
                    }
                    if (s2 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c152(s1, s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$parseFunctionCall();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseObjectReference();
                    }
                }

                return s0;
            }

            function peg$parseModifier() {
                var s0, s1, s2, s3, s4, s5;

                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 124) {
                    s1 = peg$c153;
                    peg$currPos++;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c154); }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseReferenceName();
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parseParameters();
                            if (s4 === peg$FAILED) {
                                s4 = peg$c52;
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parse_();
                                if (s5 !== peg$FAILED) {
                                    peg$reportedPos = s0;
                                    s1 = peg$c155(s3, s4);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$c1;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$c1;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }

                return s0;
            }

            function peg$parseObjectReference() {
                var s0, s1, s2, s3;

                s0 = peg$currPos;
                s1 = peg$parse_();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseObject();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parse_();
                        if (s3 !== peg$FAILED) {
                            peg$reportedPos = s0;
                            s1 = peg$c156(s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }

                return s0;
            }

            function peg$parseNot() {
                var s0, s1, s2;

                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 33) {
                    s1 = peg$c157;
                    peg$currPos++;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c158); }
                }
                if (s1 === peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 45) {
                        s1 = peg$c142;
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c143); }
                    }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseNot();
                    if (s2 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c159(s1, s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$parseReserved();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseFunctionCall();
                        if (s0 === peg$FAILED) {
                            s0 = peg$parseObjectReference();
                        }
                    }
                }

                return s0;
            }

            function peg$parseObject() {
                var s0;

                s0 = peg$parseGroup();
                if (s0 === peg$FAILED) {
                    s0 = peg$parseHash();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseNumber();
                        if (s0 === peg$FAILED) {
                            s0 = peg$parseStringLiteral();
                            if (s0 === peg$FAILED) {
                                s0 = peg$parseReference();
                            }
                        }
                    }
                }

                return s0;
            }

            function peg$parseNumber() {
                var s0, s1, s2, s3, s4, s5;

                s0 = peg$currPos;
                s1 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 45) {
                    s2 = peg$c142;
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c143); }
                }
                if (s2 === peg$FAILED) {
                    s2 = peg$c52;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$currPos;
                    s4 = [];
                    if (peg$c160.test(input.charAt(peg$currPos))) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c161); }
                    }
                    if (s5 !== peg$FAILED) {
                        while (s5 !== peg$FAILED) {
                            s4.push(s5);
                            if (peg$c160.test(input.charAt(peg$currPos))) {
                                s5 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c161); }
                            }
                        }
                    } else {
                        s4 = peg$c1;
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseDecimalNumber();
                        if (s5 === peg$FAILED) {
                            s5 = peg$c52;
                        }
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$c1;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$c1;
                    }
                    if (s3 === peg$FAILED) {
                        s3 = peg$parseDecimalNumber();
                    }
                    if (s3 !== peg$FAILED) {
                        s2 = [s2, s3];
                        s1 = s2;
                    } else {
                        peg$currPos = s1;
                        s1 = peg$c1;
                    }
                } else {
                    peg$currPos = s1;
                    s1 = peg$c1;
                }
                if (s1 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c162(s1);
                }
                s0 = s1;

                return s0;
            }

            function peg$parseDecimalNumber() {
                var s0, s1, s2, s3;

                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 46) {
                    s1 = peg$c163;
                    peg$currPos++;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c164); }
                }
                if (s1 !== peg$FAILED) {
                    s2 = [];
                    if (peg$c160.test(input.charAt(peg$currPos))) {
                        s3 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c161); }
                    }
                    if (s3 !== peg$FAILED) {
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            if (peg$c160.test(input.charAt(peg$currPos))) {
                                s3 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c161); }
                            }
                        }
                    } else {
                        s2 = peg$c1;
                    }
                    if (s2 !== peg$FAILED) {
                        s1 = [s1, s2];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }

                return s0;
            }

            function peg$parseGroup() {
                var s0, s1, s2, s3;

                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 40) {
                    s1 = peg$c110;
                    peg$currPos++;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c111); }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseTernaryConditional();
                    if (s2 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 41) {
                            s3 = peg$c112;
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c113); }
                        }
                        if (s3 !== peg$FAILED) {
                            peg$reportedPos = s0;
                            s1 = peg$c165(s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }

                return s0;
            }

            function peg$parseReserved() {
                var s0, s1;

                s0 = peg$currPos;
                s1 = peg$parseBoolean();
                if (s1 === peg$FAILED) {
                    s1 = peg$parseUndefined();
                    if (s1 === peg$FAILED) {
                        s1 = peg$parseNull();
                        if (s1 === peg$FAILED) {
                            s1 = peg$parseNaN();
                            if (s1 === peg$FAILED) {
                                s1 = peg$parseInfinity();
                            }
                        }
                    }
                }
                if (s1 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c166(s1);
                }
                s0 = s1;

                return s0;
            }

            function peg$parseBoolean() {
                var s0, s1;

                s0 = peg$currPos;
                if (input.substr(peg$currPos, 4) === peg$c167) {
                    s1 = peg$c167;
                    peg$currPos += 4;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c168); }
                }
                if (s1 === peg$FAILED) {
                    if (input.substr(peg$currPos, 5) === peg$c169) {
                        s1 = peg$c169;
                        peg$currPos += 5;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c170); }
                    }
                }
                if (s1 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c171(s1);
                }
                s0 = s1;

                return s0;
            }

            function peg$parseUndefined() {
                var s0, s1;

                s0 = peg$currPos;
                if (input.substr(peg$currPos, 9) === peg$c172) {
                    s1 = peg$c172;
                    peg$currPos += 9;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c173); }
                }
                if (s1 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c174();
                }
                s0 = s1;

                return s0;
            }

            function peg$parseNaN() {
                var s0, s1;

                s0 = peg$currPos;
                if (input.substr(peg$currPos, 3) === peg$c175) {
                    s1 = peg$c175;
                    peg$currPos += 3;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c176); }
                }
                if (s1 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c177();
                }
                s0 = s1;

                return s0;
            }

            function peg$parseInfinity() {
                var s0, s1;

                s0 = peg$currPos;
                if (input.substr(peg$currPos, 8) === peg$c178) {
                    s1 = peg$c178;
                    peg$currPos += 8;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c179); }
                }
                if (s1 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c180();
                }
                s0 = s1;

                return s0;
            }

            function peg$parseNull() {
                var s0, s1;

                s0 = peg$currPos;
                if (input.substr(peg$currPos, 4) === peg$c181) {
                    s1 = peg$c181;
                    peg$currPos += 4;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c182); }
                }
                if (s1 === peg$FAILED) {
                    if (input.substr(peg$currPos, 4) === peg$c183) {
                        s1 = peg$c183;
                        peg$currPos += 4;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c184); }
                    }
                }
                if (s1 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c185();
                }
                s0 = s1;

                return s0;
            }

            function peg$parseFunctionCall() {
                var s0, s1, s2;

                s0 = peg$currPos;
                s1 = peg$parseObjectReference();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseParameters();
                    if (s2 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c186(s1, s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }

                return s0;
            }

            function peg$parseReference() {
                var s0, s1, s2, s3, s4, s5, s6, s7;

                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 94) {
                    s1 = peg$c187;
                    peg$currPos++;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c188); }
                }
                if (s1 === peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c189) {
                        s1 = peg$c189;
                        peg$currPos += 2;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c190); }
                    }
                    if (s1 === peg$FAILED) {
                        if (input.substr(peg$currPos, 3) === peg$c191) {
                            s1 = peg$c191;
                            peg$currPos += 3;
                        } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c192); }
                        }
                        if (s1 === peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 126) {
                                s1 = peg$c193;
                                peg$currPos++;
                            } else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c194); }
                            }
                            if (s1 === peg$FAILED) {
                                if (input.substr(peg$currPos, 2) === peg$c195) {
                                    s1 = peg$c195;
                                    peg$currPos += 2;
                                } else {
                                    s1 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c196); }
                                }
                            }
                        }
                    }
                }
                if (s1 === peg$FAILED) {
                    s1 = peg$c52;
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseReferenceName();
                        if (s3 !== peg$FAILED) {
                            s4 = [];
                            s5 = peg$currPos;
                            if (input.charCodeAt(peg$currPos) === 46) {
                                s6 = peg$c163;
                                peg$currPos++;
                            } else {
                                s6 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c164); }
                            }
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseReferenceName();
                                if (s7 !== peg$FAILED) {
                                    s6 = [s6, s7];
                                    s5 = s6;
                                } else {
                                    peg$currPos = s5;
                                    s5 = peg$c1;
                                }
                            } else {
                                peg$currPos = s5;
                                s5 = peg$c1;
                            }
                            while (s5 !== peg$FAILED) {
                                s4.push(s5);
                                s5 = peg$currPos;
                                if (input.charCodeAt(peg$currPos) === 46) {
                                    s6 = peg$c163;
                                    peg$currPos++;
                                } else {
                                    s6 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c164); }
                                }
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseReferenceName();
                                    if (s7 !== peg$FAILED) {
                                        s6 = [s6, s7];
                                        s5 = s6;
                                    } else {
                                        peg$currPos = s5;
                                        s5 = peg$c1;
                                    }
                                } else {
                                    peg$currPos = s5;
                                    s5 = peg$c1;
                                }
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parse_();
                                if (s5 !== peg$FAILED) {
                                    peg$reportedPos = s0;
                                    s1 = peg$c197(s1, s3, s4);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$c1;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$c1;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }

                return s0;
            }

            function peg$parseReferenceName() {
                var s0, s1, s2;

                s0 = peg$currPos;
                s1 = [];
                if (peg$c198.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c199); }
                }
                if (s2 !== peg$FAILED) {
                    while (s2 !== peg$FAILED) {
                        s1.push(s2);
                        if (peg$c198.test(input.charAt(peg$currPos))) {
                            s2 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c199); }
                        }
                    }
                } else {
                    s1 = peg$c1;
                }
                if (s1 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c200(s1);
                }
                s0 = s1;

                return s0;
            }

            function peg$parseHash() {
                var s0, s1, s2, s3, s4, s5;

                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 123) {
                    s1 = peg$c201;
                    peg$currPos++;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c202); }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseHashValues();
                        if (s3 === peg$FAILED) {
                            s3 = peg$c52;
                        }
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse_();
                            if (s4 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 125) {
                                    s5 = peg$c203;
                                    peg$currPos++;
                                } else {
                                    s5 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c204); }
                                }
                                if (s5 !== peg$FAILED) {
                                    peg$reportedPos = s0;
                                    s1 = peg$c205(s3);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$c1;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$c1;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }

                return s0;
            }

            function peg$parseHashValues() {
                var s0, s1;

                s0 = peg$currPos;
                s1 = peg$parseHashValuesArray();
                if (s1 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c206(s1);
                }
                s0 = s1;

                return s0;
            }

            function peg$parseHashValuesArray() {
                var s0, s1, s2, s3, s4, s5;

                s0 = peg$currPos;
                s1 = peg$parseHashValue();
                if (s1 !== peg$FAILED) {
                    s2 = [];
                    s3 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 44) {
                        s4 = peg$c102;
                        peg$currPos++;
                    } else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c103); }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseHashValuesArray();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$c1;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$c1;
                    }
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$currPos;
                        if (input.charCodeAt(peg$currPos) === 44) {
                            s4 = peg$c102;
                            peg$currPos++;
                        } else {
                            s4 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c103); }
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseHashValuesArray();
                            if (s5 !== peg$FAILED) {
                                s4 = [s4, s5];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$c1;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$c1;
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c207(s1, s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }

                return s0;
            }

            function peg$parseHashValue() {
                var s0, s1, s2, s3, s4, s5;

                s0 = peg$currPos;
                s1 = peg$parse_();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseHashKey();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parse_();
                        if (s3 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 58) {
                                s4 = peg$c107;
                                peg$currPos++;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c108); }
                            }
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseTernaryConditional();
                                if (s5 === peg$FAILED) {
                                    s5 = peg$c52;
                                }
                                if (s5 !== peg$FAILED) {
                                    peg$reportedPos = s0;
                                    s1 = peg$c208(s2, s5);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$c1;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$c1;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }

                return s0;
            }

            function peg$parseHashKey() {
                var s0, s1;

                s0 = peg$currPos;
                s1 = peg$parseStringLiteral();
                if (s1 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c209(s1);
                }
                s0 = s1;
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parseReferenceName();
                    if (s1 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c210(s1);
                    }
                    s0 = s1;
                }

                return s0;
            }

            function peg$parseStringLiteral() {
                var s0, s1, s2, s3;

                peg$silentFails++;
                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 34) {
                    s1 = peg$c75;
                    peg$currPos++;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c76); }
                }
                if (s1 !== peg$FAILED) {
                    s2 = [];
                    s3 = peg$parseDoubleStringCharacter();
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$parseDoubleStringCharacter();
                    }
                    if (s2 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 34) {
                            s3 = peg$c75;
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c76); }
                        }
                        if (s3 !== peg$FAILED) {
                            peg$reportedPos = s0;
                            s1 = peg$c212(s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 39) {
                        s1 = peg$c81;
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c82); }
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = [];
                        s3 = peg$parseSingleStringCharacter();
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            s3 = peg$parseSingleStringCharacter();
                        }
                        if (s2 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 39) {
                                s3 = peg$c81;
                                peg$currPos++;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c82); }
                            }
                            if (s3 !== peg$FAILED) {
                                peg$reportedPos = s0;
                                s1 = peg$c212(s2);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$c1;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$c1;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                }
                peg$silentFails--;
                if (s0 === peg$FAILED) {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c211); }
                }

                return s0;
            }

            function peg$parseDoubleStringCharacter() {
                var s0, s1, s2;

                s0 = peg$currPos;
                s1 = peg$currPos;
                peg$silentFails++;
                if (input.charCodeAt(peg$currPos) === 34) {
                    s2 = peg$c75;
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c76); }
                }
                if (s2 === peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 92) {
                        s2 = peg$c213;
                        peg$currPos++;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c214); }
                    }
                }
                peg$silentFails--;
                if (s2 === peg$FAILED) {
                    s1 = peg$c13;
                } else {
                    peg$currPos = s1;
                    s1 = peg$c1;
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseSourceCharacter();
                    if (s2 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c215();
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }
                if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c216) {
                        s0 = peg$c216;
                        peg$currPos += 2;
                    } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c217); }
                    }
                }

                return s0;
            }

            function peg$parseSingleStringCharacter() {
                var s0, s1, s2;

                s0 = peg$currPos;
                s1 = peg$currPos;
                peg$silentFails++;
                if (input.charCodeAt(peg$currPos) === 39) {
                    s2 = peg$c81;
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c82); }
                }
                if (s2 === peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 92) {
                        s2 = peg$c213;
                        peg$currPos++;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c214); }
                    }
                }
                peg$silentFails--;
                if (s2 === peg$FAILED) {
                    s1 = peg$c13;
                } else {
                    peg$currPos = s1;
                    s1 = peg$c1;
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseSourceCharacter();
                    if (s2 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c215();
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$c1;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$c1;
                }
                if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c218) {
                        s0 = peg$c218;
                        peg$currPos += 2;
                    } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c219); }
                    }
                }

                return s0;
            }

            function peg$parseSourceCharacter() {
                var s0;

                if (input.length > peg$currPos) {
                    s0 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c220); }
                }

                return s0;
            }

            function peg$parseWord() {
                var s0, s1, s2;

                s0 = peg$currPos;
                s1 = [];
                if (peg$c221.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c222); }
                }
                if (s2 !== peg$FAILED) {
                    while (s2 !== peg$FAILED) {
                        s1.push(s2);
                        if (peg$c221.test(input.charAt(peg$currPos))) {
                            s2 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c222); }
                        }
                    }
                } else {
                    s1 = peg$c1;
                }
                if (s1 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c223(s1);
                }
                s0 = s1;

                return s0;
            }

            function peg$parse_() {
                var s0, s1;

                s0 = [];
                if (peg$c224.test(input.charAt(peg$currPos))) {
                    s1 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c225); }
                }
                while (s1 !== peg$FAILED) {
                    s0.push(s1);
                    if (peg$c224.test(input.charAt(peg$currPos))) {
                        s1 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c225); }
                    }
                }

                return s0;
            }

            function peg$parse_nl() {
                var s0, s1;

                s0 = [];
                if (peg$c226.test(input.charAt(peg$currPos))) {
                    s1 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c227); }
                }
                while (s1 !== peg$FAILED) {
                    s0.push(s1);
                    if (peg$c226.test(input.charAt(peg$currPos))) {
                        s1 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c227); }
                    }
                }

                return s0;
            }


            /*jshint laxcomma:false */

            var DoctypeExpression          = require("./ast/doctype");
            var RootNodeExpression         = require("./ast/rootNode");
            var TextNodeExpression         = require("./ast/textNode");
            var CommentNodeExpression      = require("./ast/commentNode");
            var ElementNodeExpression      = require("./ast/elementNode");
            var BlockBindingExpression     = require("./ast/blockBinding");
            var DocTypeExpression          = require("./ast/doctype");
            var TernaryConditionExpression = require("./ast/ternaryCondition");
            var AssignmentExpression       = require("./ast/assignment");
            var OperatorExpression         = require("./ast/operator");
            var NotExpression              = require("./ast/not");
            var LiteralExpression          = require("./ast/literal");
            var StringExpression           = require("./ast/string");
            var ReferenceExpression        = require("./ast/reference");
            var HashExpression             = require("./ast/hash");
            var ScriptExpression           = require("./ast/script");
            var CallExpression             = require("./ast/call");
            var ModifierExpression         = require("./ast/modifier");
            var ArrayExpression            = require("./ast/array");
            var ParametersExpression       = require("./ast/parameters");
            var GroupExpression            = require("./ast/group");

            function trimWhitespace(ws) {
                return trimNewLineChars(ws).replace(/(^\s+)|(\s+$)/, "");
            }

            function trimEnds(ws) {
                return ws.replace(/(^\s+)|(\s+$)/, "").replace(/[\r\n]/g, "\\n");
            }

            function trimNewLineChars(ws) {
                return ws.replace(/[ \r\n\t]+/g, " ");
            }

            function trimmedText() {
                return trimWhitespace(text());
            }

            function singleOrArrayExpression(values) {
                return values.length === 1 ? values[0] : new ArrayExpression(new ParametersExpression(values));
            }

            function attrValues(values) {

                values = values.filter(function(v) {
                    return !/^[\n\t\r]+$/.test(v.value);
                });

                if (values.length === 1 && values[0].type === "string") {
                    return values[0];
                } else {
                    return new ArrayExpression(new ParametersExpression(values));
                }
            }

            function trimTextExpressions(expressions) {

                function _trim(exprs) {
                    var expr;
                    for (var i = exprs.length; i--;) {
                        expr = exprs[i];
                        if (expr.type == "textNode" && !/\S/.test(expr.value) && !expr.decoded) {
                            exprs.splice(i, 1);
                        } else {
                            break;
                        }
                    }
                    return exprs;
                }

                return _trim(_trim(expressions.reverse()).reverse());
            }



            peg$result = peg$startRuleFunction();

            if (peg$result !== peg$FAILED && peg$currPos === input.length) {
                return peg$result;
            } else {
                if (peg$result !== peg$FAILED && peg$currPos < input.length) {
                    peg$fail({ type: "end", description: "end of input" });
                }

                throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
            }
        }

        return {
            SyntaxError: SyntaxError,
            parse:       parse
        };
    })();

},{"./ast/array":25,"./ast/assignment":26,"./ast/blockBinding":28,"./ast/call":29,"./ast/commentNode":30,"./ast/doctype":31,"./ast/elementNode":32,"./ast/group":33,"./ast/hash":34,"./ast/literal":35,"./ast/modifier":36,"./ast/not":37,"./ast/operator":38,"./ast/parameters":39,"./ast/reference":40,"./ast/rootNode":41,"./ast/script":42,"./ast/string":43,"./ast/ternaryCondition":44,"./ast/textNode":45}],48:[function(require,module,exports){
    (function (process,global){
        var protoclass = require("protoclass");

        var rAF = (global.requestAnimationFrame      ||
        global.webkitRequestAnimationFrame ||
        global.mozRequestAnimationFrame    ||
        process.nextTick).bind(global);

        /* istanbul ignore next */
        if (process.browser) {
            var defaultTick = function(next) {
                rAF(next);
            };
        } else {
            var defaultTick = function(next) {
                next();
            };
        }

        /**
         */

        function RunLoop(options) {
            this._animationQueue = [];
            this.tick = options.tick || defaultTick;
            this._id = options._id || 2;
        }

        protoclass(RunLoop, {

            /**
             * child runloop in-case we get into recursive loops
             */

            child: function() {
                return this.__child || (this.__child = new RunLoop({ tick: this.tick, _id: this._id << 2 }));
            },

            /**
             * Runs animatable object on requestAnimationFrame. This gets
             * called whenever the UI state changes.
             *
             * @method animate
             * @param {Object} animatable object. Must have `update()`
             */

            deferOnce: function(context) {

                if (!context.__running) context.__running = 1;

                if (context.__running & this._id) {
                    if (this._running) {
                        this.child().deferOnce(context);
                    }
                    return;
                }

                context.__running |= this._id;

                // push on the animatable object
                this._animationQueue.push(context);

                // if animating, don't continue
                if (this._requestingFrame) return;
                this._requestingFrame = true;
                var self = this;

                // run the animation frame, and callback all the animatable objects
                this.tick(function() {
                    self.runNow();
                    self._requestingFrame = false;
                });
            },

            /**
             */

            runNow: function() {
                var queue = this._animationQueue;
                this._animationQueue = [];
                this._running = true;

                // queue.length is important here, because animate() can be
                // called again immediately after an update
                for (var i = 0; i < queue.length; i++) {
                    var item = queue[i];
                    item.update();
                    item.__running &= ~this._id;

                    // check for anymore animations - need to run
                    // them in order
                    if (this._animationQueue.length) {
                        this.runNow();
                    }
                }

                this._running = false;
            }
        });

        module.exports = RunLoop;

    }).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":76,"protoclass":79}],49:[function(require,module,exports){

// TODO: refactor me

    /**
     */

    function boundScript(script) {

        var run  = script.run;
        var refs = script.refs;

        return {
            refs: refs,
            evaluate: function(view) {
                return run.call(view);
            },
            watch: function(view, listener) {

                var currentValue;
                var locked = false;

                function now() {
                    if (locked) return this;
                    locked = true;
                    var oldValue = currentValue;
                    listener(currentValue = run.call(view), oldValue);
                    locked = false;
                    return this;
                }

                var dispose;

                if (!refs.length) return {
                    dispose: function() {},
                    trigger: now
                };

                if (refs.length === 1) {
                    dispose = view.watch(refs[0], now).dispose;
                } else {

                    var bindings = [];

                    for (var i = refs.length; i--;) {
                        bindings.push(view.watch(refs[i], now));
                    }

                    dispose = function() {
                        for (var i = bindings.length; i--;) bindings[i].dispose();
                    };
                }

                return {
                    dispose: dispose,
                    trigger: function() {
                        now();
                        return this;
                    }
                };
            }
        };
    }

    /**
     * scripts combined with strings. defined within attributes usually
     */

    function bufferedScript(values, view) {

        var scripts = values.filter(function(value) {
            return typeof value !== "string";
        }).map(function(script) {
            return script;
        });

        function evaluate(view) {
            return values.map(function(script) {

                if (typeof script === "string") {
                    return script;
                }

                return script.run.call(view);

            }).join("");
        }

        return {
            buffered: true,
            evaluate: function(view) {
                return evaluate(view);
            },
            watch: function(view, listener) {

                var bindings = [];

                function now() {
                    listener(evaluate(view));
                    return this;
                }

                for (var i = scripts.length; i--;) {

                    var script = scripts[i];
                    if (!script.refs) continue;

                    for (var j = script.refs.length; j--;) {
                        var ref = script.refs[j];

                        bindings.push(view.watch(ref, now));
                    }
                }

                return {
                    trigger: now,
                    dispose: function() {
                        for (var i = bindings.length; i--;) bindings[i].dispose();
                    }
                };
            }
        };
    }

    /**
     */

    function staticScript(value, view) {
        return {
            watch: function(view, listener) {
                return {
                    trigger: function() {
                        listener(value);
                        return this;
                    },
                    dispose: function() {

                    }
                };
            }
        };
    }

    /**
     */

    module.exports = function(value) {

        if (typeof value !== "object") return staticScript(value);
        if (value.length) {
            if (value.length === 1) return boundScript(value[0].value);
            return bufferedScript(value.map(function(v) {
                if (typeof v === "object") return v.value;
                return v;
            }));
        } else {
            return boundScript(value);
        }
    };

},{}],50:[function(require,module,exports){
    var DocumentSection = require("document-section").Section;
    var protoclass      = require("protoclass");
    var utils           = require("../utils");

    /**
     */

    function FragmentSection(document, start, end) {
        DocumentSection.call(this, document, start, end);
    }

    /**
     */

    DocumentSection.extend(FragmentSection, {

        /**
         */

        rootNode: function() {
            return this.start.parentNode;
        },

        /**
         */

        createMarker: function() {
            return new Marker(this.document, utils.getNodePath(this.start), utils.getNodePath(this.end));
        },

        /**
         */

        clone: function() {
            var clone = DocumentSection.prototype.clone.call(this);
            return new FragmentSection(this.document, clone.start, clone.end);
        }
    });

    /**
     */

    function Marker(document, startPath, endPath) {
        this.document = document;
        this.startPath   = startPath;
        this.endPath     = endPath;
    }

    /**
     */

    protoclass(Marker, {

        /**
         */

        getSection: function(rootNode) {

            var start = utils.getNodeByPath(rootNode, this.startPath);
            var end   = utils.getNodeByPath(rootNode, this.endPath);

            return new FragmentSection(this.document, start, end);
        }
    });

    module.exports = FragmentSection;

},{"../utils":72,"document-section":77,"protoclass":79}],51:[function(require,module,exports){
    var DocumentSection = require("document-section").Section;
    var protoclass      = require("protoclass");
    var utils           = require("../utils");

    /**
     */

    function NodeSection(document, node, _rnode) {
        this.node = node;
        this.document = document;
    }

    /**
     */

    protoclass(NodeSection, {

        /**
         */

        rootNode: function() {
            return this.node;
        },

        /**
         */

        createMarker: function() {
            return new Marker(this.document, utils.getNodePath(this.node));
        },

        /**
         */

        appendChild: function(child) {
            this.node.appendChild(child);
        },

        /**
         */

        removeAll: function() {
            this.node.innerHTML = "";
        },

        /**
         */

        render: function() {
            return this.node;
        },

        /**
         */

        remove: function() {
            if (this.node.parentNode) this.node.parentNode.removeChild(this.node);
        },

        /**
         */

        clone: function() {
            return new NodeSection(this.document, this.node.cloneNode(true));
        }
    });

    /**
     */

    function Marker(document, nodePath) {
        this.nodePath    = nodePath;
        this.document = document;
    }

    /**
     */

    protoclass(Marker, {

        /**
         */

        getSection: function(rootNode) {
            var start = utils.getNodeByPath(rootNode, this.nodePath);
            return new NodeSection(this.document, start);
        }
    });

    module.exports = NodeSection;

},{"../utils":72,"document-section":77,"protoclass":79}],52:[function(require,module,exports){
    var BaseComponent = require("../components/base");
    var _bind         = require("../utils/bind");
    var _extend       = require("../utils/extend");

    /**
     */

    function TemplateComponent(options) {
        BaseComponent.call(this, options);
    }

    /**
     */

    module.exports = BaseComponent.extend(TemplateComponent, {

        /**
         */

        bind: function() {
            this._bindings = [];

            this.childContext = new this.contextClass(this.attributes);

            if (!this.childView) {
                this.childView = this.template.view(this.childContext, {
                    parent: this.view
                });
                this.section.appendChild(this.childView.render());
            } else {
                this.childView.setOptions({ parent: this.view });
                this.childView.bind(this.childContext);
            }

            BaseComponent.prototype.bind.call(this);
        },

        /**
         */

        unbind: function() {
            if (this.childView) this.childView.unbind();
        }
    });

},{"../components/base":18,"../utils/bind":70,"../utils/extend":71}],53:[function(require,module,exports){
    (function (process){
        var protoclass        = require("protoclass");
        var nofactor          = require("nofactor");
        var BlockNode         = require("./vnode/block");
        var ElementNode       = require("./vnode/element");
        var FragmentNode      = require("./vnode/fragment");
        var TextNode          = require("./vnode/text");
        var CommentNode       = require("./vnode/comment");
        var View              = require("./view");
        var FragmentSection   = require("../section/fragment");
        var NodeSection       = require("../section/node");
        var TemplateComponent = require("./component");
        var defaults          = require("../defaults");
        var extend            = require("../utils/extend");

        /**
         * Compiles the template
         */

        var isIE = false;

// check for all versions of IE - IE doesn't properly support
// element.cloneNode(true), so we can't use that optimization.
        /* istanbul ignore if */
        if (process.browser) {
            var hasMSIE    = ~navigator.userAgent.toLowerCase().indexOf("msie");
            var hasTrident = ~navigator.userAgent.toLowerCase().indexOf("trident");
            isIE = !!(hasMSIE || hasTrident);
        }

        function Template(script, options) {

            this.options       = options;
            this.accessor      = options.accessor;
            this.useCloneNode  = options.useCloneNode != void 0 ? !!options.useCloneNode : !isIE;
            this.accessorClass = options.accessorClass || defaults.accessorClass;
            this.components    = options.components    || defaults.components;
            this.modifiers     = options.modifiers     || defaults.modifiers;
            this.attributes    = options.attributes    || defaults.attributes;
            this.runloop       = options.runloop       || defaults.runloop;
            this.document      = options.document   || nofactor;

            if (typeof script === "function") {
                this.vnode = script(
                    FragmentNode.create,
                    BlockNode.create,
                    ElementNode.create,
                    TextNode.create,
                    CommentNode.create,
                    void 0,
                    this.modifiers
                );
            } else {
                this.vnode = script;
            }

            this._viewPool   = [];

            this.initialize();
        }

        /**
         */

        module.exports = protoclass(Template, {

            /**
             */

            initialize: function() {
                this.hydrators = [];

                // first build the cloneable DOM node
                this.section = new FragmentSection(this.document);

                var node = this.vnode.initialize(this);

                if (node.nodeType === 11) {
                    this.section = new FragmentSection(this.document);
                    this.section.appendChild(node);
                } else {
                    this.section = new NodeSection(this.document, node);
                }

                // next we need to initialize the hydrators - many of them
                // keep track of the path to a particular nodes.
                for (var i = this.hydrators.length; i--;) {
                    this.hydrators[i].initialize();
                }
            },

            /**
             */

            createComponentClass: function(contextClass) {
                return TemplateComponent.extend({
                    template     : this,
                    contextClass : contextClass || Object
                });
            },

            /**
             * Creates a child template with the same options, difference source.
             * This method allows child nodes to have a different context, or the same
             * context of a different template. Used in components.
             */

            child: function(vnode, options) {
                return new Template(vnode, extend(options, {}, this.options));
            },

            /**
             * Creates a new or recycled view which binds a cloned node
             * from the template to a context (or view scope).
             */

            view: function(context, options) {

                var clonedSection;

                /*
                 TODO (for IE):

                 if (internetExplorer) {
                 var clone = this.nodeCreator.createNode();
                 } else {
                 if (!this._templateNode) this._templateNode = this.nodeCreator.createNode();
                 var clone = this._templateNode.clone();
                 }
                 */

                // re-init for now
                if (!this.useCloneNode) {
                    this.initialize();
                    clonedSection = this.section;
                } else {
                    clonedSection = this.section.clone();
                }

                var view = this._viewPool.pop();

                if (view) {
                    view.setOptions(options || {});
                } else {
                    view = new View(this, this._viewPool, clonedSection, this.hydrators, options || {});
                }

                view.setOptions(options || {});
                if (context) view.bind(context);
                return view;
            }
        });

        /**
         */

        module.exports = function(source, options) {

            var script;
            var tos = typeof source;

            if (tos === "string") {

                if (!module.exports.parser) {
                    throw new Error("paperclip parser does not exist");
                }

                script = module.exports.parser.compile(source);
            } else if (tos === "function") {
                script = source;
            } else {
                throw new Error("source must either be type 'string' or 'function'");
            }

            /**
             * Note: the template used to be cached on the script, but this isn't
             * possible now since components are registered on the template level.
             */

            return new Template(script, options || defaults);
        };

    }).call(this,require('_process'))
},{"../defaults":24,"../section/fragment":50,"../section/node":51,"../utils/extend":71,"./component":52,"./view":54,"./vnode/block":59,"./vnode/comment":61,"./vnode/element":65,"./vnode/fragment":67,"./vnode/text":68,"_process":76,"nofactor":78,"protoclass":79}],54:[function(require,module,exports){
    (function (global){
        var protoclass     = require("protoclass");
        var Transitions    = require("./transitions");
        var _bind          = require("../../utils/bind");
        var _stringifyNode = require("../../utils/stringifyNode");
        var Reference      = require("./reference");

        /**
         * constructor
         * @param template the template which created this view
         * @param pool the pool of views to push back into after
         * this view has been disposed
         * @param section the section (cloned node) to attach to
         * @param hydrators binding hydrators that help tie this view
         * to the section
         */

        function View(template, pool, section, hydrators, options) {

            this.template        = template;
            this.section         = section;
            this.bindings        = [];
            this._pool           = pool;
            this.parent          = options.parent;
            this.accessor        = this.parent ? this.parent.accessor : template.accessor || new template.accessorClass();
            this.rootNode        = section.rootNode();
            this.transitions     = new Transitions();
            this.runloop         = template.runloop;
            this._watchers       = [];

            for (var i = 0, n = hydrators.length; i < n; i++) {
                hydrators[i].hydrate(this);
            }

            this._dispose = _bind(this._dispose, this);
        }

        /**
         */

        protoclass(View, {

            /**
             */

            setOptions: function(options) {
                this.parent = options.parent;
                if (options.parent) this.accessor = this.parent.accessor;
            },

            /**
             */

            get: function(path) {
                var v = this.accessor.get(this.context, path);
                return v != null ? v : this.parent ? this.parent.get(path) : void 0;
            },

            /**
             */

            set: function(path, value) {
                return this.accessor.set(this.context, path, value);
            },

            /**
             */

            reference: function(path, settable, gettable) {
                return new Reference(this, path, settable, gettable);
            },

            /**
             */

            call: function(path, params) {
                var has = this.accessor.get(this.context, path);
                return has ? this.accessor.call(this.context, path, params) : this.parent ? this.parent.call(path, params) : void 0;
            },

            /**
             */

            setProperties: function(properties) {
                for (var key in properties) this.set(key, properties[key]);
            },

            /**
             */

            watch: function(keypath, listener) {
                return this.accessor.watchProperty(this.context, keypath, listener);
            },

            /**
             */

            watchEvent: function(object, event, listener) {
                return this.accessor.watchEvent(object, event, listener);
            },

            /**
             */

            bind: function(context) {

                if (this.context) {
                    this.unbind();
                }
                if (!context) context = {};

                this.context = this.accessor.castObject(context);

                for (var i = 0, n = this.bindings.length; i < n; i++) {
                    this.bindings[i].bind();
                }
            },

            /**
             */

            unbind: function() {
                for (var i = this.bindings.length; i--;) {
                    this.bindings[i].unbind();
                }

            },

            /**ch
             */

            render: function() {
                if (!this.context) this.bind({});
                this.transitions.enter();
                return this.section.render();
            },

            /**
             */

            remove: function() {
                this.section.remove();
                return this;
            },

            /**
             * disposes the view, and re-adds it to the template pool. At this point, the
             * view cannot be used anymore.
             */

            dispose: function() {
                if (this.transitions.exit(this._dispose)) return;
                this._dispose();
                return this;
            },

            /**
             */

            _dispose: function() {
                this.unbind();
                this.section.remove();
                this._pool.push(this);
            },

            /**
             */

            toString: function() {
                var node = this.render();

                /* istanbul ignore if */
                if (this.template.document === global.document) {
                    return _stringifyNode(node);
                }

                return node.toString();
            }
        });

        module.exports = View;

    }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../utils/bind":70,"../../utils/stringifyNode":74,"./reference":55,"./transitions":56,"protoclass":79}],55:[function(require,module,exports){
    var protoclass = require("protoclass");

    /**
     */

    function Reference(view, path, settable, gettable) {
        this.view     = view;
        this.path     = path;
        this.settable = settable !== false;
        this.gettable = gettable !== false;
    }

    /**
     */

    protoclass(Reference, {

        /**
         */

        __isReference: true,

        /**
         */

        value: function(value) {
            if (!arguments.length) {
                return this.gettable ? this.view.get(this.path) : void 0;
            }
            if (this.settable) this.view.set(this.path, value);
        },

        /**
         */

        toString: function() {
            return this.view.get(this.path);
        }
    });

    module.exports = Reference;

},{"protoclass":79}],56:[function(require,module,exports){
    (function (process){
        var protoclass = require("protoclass");
        var async      = require("../../utils/async");

        /**
         */

        function Transitions() {
            this._enter = [];
            this._exit  = [];
        }

        /**
         */

        module.exports = protoclass(Transitions, {

            /**
             */

            push: function(transition) {
                if (transition.enter) this._enter.push(transition);
                if (transition.exit) this._exit.push(transition);
            },

            /**
             */

            enter: function() {
                if (!this._enter.length) return false;
                for (var i = 0, n = this._enter.length; i < n; i++) {
                    this._enter[i].enter();
                }
            },

            /**
             */

            exit: function(complete) {
                if (!this._exit.length) return false;
                var self = this;
                process.nextTick(function() {
                    async.each(self._exit, function(transition, next) {
                        transition.exit(next);
                    }, complete);
                });

                return true;
            }
        });

    }).call(this,require('_process'))
},{"../../utils/async":69,"_process":76,"protoclass":79}],57:[function(require,module,exports){
    (function (global){
        var protoclass = require("protoclass");
        var utils      = require("../../../utils");
        var _bind      = require("../../../utils/bind");

        /**
         */

        function BlockBinding(node, script, view) {
            this.view   = view;
            this.document = view.template.document;
            this.script = script;
            this.node   = node;
            this.didChange = _bind(this.didChange, this);
        }

        /**
         */

        module.exports = protoclass(BlockBinding, {

            /**
             */

            bind: function() {
                var self = this;

                this.binding = this.script.watch(this.view, function(value, oldValue) {
                    if (value === self.currentValue) return;
                    self.currentValue = value;
                    self.didChange();
                });

                this.currentValue = this.script.evaluate(this.view);
                if (this.currentValue != null) this.update();
            },

            /**
             */

            didChange: function() {
                this.view.runloop.deferOnce(this);
            },

            /**
             */

            update: function() {
                var v = String(this.currentValue == null ? "" : this.currentValue);
                if (this.document !== global.document) {
                    this.node.replaceText(v, true);
                } else {
                    this.node.nodeValue = String(v);
                }
            },

            /**
             */

            unbind: function() {
                if (this.binding) {
                    this.binding.dispose();
                    this.binding = void 0;
                }
            }
        });

    }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../../utils":72,"../../../utils/bind":70,"protoclass":79}],58:[function(require,module,exports){
    var protoclass = require("protoclass");
    var utils      = require("../../../utils");
    var Binding    = require("./binding");

    /**
     */

    function BlockHydrator(node, script, bindingClass) {
        this.node   = node;
        this.script = script;
        this.bindingClass = bindingClass;
    }

    /**
     */

    module.exports = protoclass(BlockHydrator, {

        /**
         */

        initialize: function() {
            this.nodePath = utils.getNodePath(this.node);
        },

        /**
         */

        hydrate: function(view) {
            var clonedNode = utils.getNodeByPath(view.rootNode, this.nodePath);
            view.bindings.push(new this.bindingClass(clonedNode, this.script, view));
        }
    });

},{"../../../utils":72,"./binding":57,"protoclass":79}],59:[function(require,module,exports){
    var protoclass = require("protoclass");
    var utils      = require("../../../utils");
    var script     = require("../../../script");
    var Hydrator   = require("./hydrator");
    var Binding    = require("./binding");
    var Unbound    = require("./unbound");

    /**
     */

    function Block(scriptSource) {
        this.script  = script(scriptSource);
    }

    /**
     */

    module.exports = protoclass(Block, {

        /**
         */

        initialize: function(template) {
            var node = template.document.createTextNode("");
            var bindingClass = this.script.refs.length ? Binding : Unbound;
            template.hydrators.push(new Hydrator(node, this.script, bindingClass));
            return node;
        }
    });

    /**
     */

    module.exports.create = function(script) {
        return new Block(script);
    };

},{"../../../script":49,"../../../utils":72,"./binding":57,"./hydrator":58,"./unbound":60,"protoclass":79}],60:[function(require,module,exports){
    (function (global){
        var protoclass = require("protoclass");
        var utils      = require("../../../utils");

        /**
         */

        function UnboundBlockBinding(node, script, view) {
            this.view   = view;
            this.document = view.template.document;
            this.script = script;
            this.node   = node;
        }

        /**
         */

        module.exports = protoclass(UnboundBlockBinding, {

            /**
             */

            bind: function() {
                var self = this;
                var value = this.script.evaluate(this.view);
                if (this.value === value) return;
                this.value = value;

                var v = String(value == null ? "" : value);

                if (this.document !== global.document) {
                    this.node.replaceText(v, true);
                } else {
                    this.node.nodeValue = String(v);
                }
            },

            /**
             */

            unbind: function() { }
        });

    }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../../utils":72,"protoclass":79}],61:[function(require,module,exports){
    var protoclass = require("protoclass");

    /**
     */

    function Comment(value) {
        this.value    = value;
    }

    /**
     */

    module.exports = protoclass(Comment, {

        /**
         */

        initialize: function(template) {
            return template.document.createComment(this.value);
        }
    });

    /**
     */

    module.exports.create = function(value) {
        return new Comment(value);
    };

},{"protoclass":79}],62:[function(require,module,exports){
    var protoclass        = require("protoclass");
    var utils             = require("../../../utils");
    var AttributesBinding = require("./attributesBinding");

    /**
     */

    function AttributeHydrator(attrClass, key, value, node) {
        this.node      = node;
        this.key       = key;
        this.value     = value;
        this.attrClass = attrClass;
    }

    /**
     */

    module.exports = protoclass(AttributeHydrator, {

        /**
         */

        initialize: function() {
            this.nodePath = utils.getNodePath(this.node);
        },

        /**
         */

        hydrate: function(view) {

            var attribute = new this.attrClass({

                // attribute handlers can only be added to real elements for now since
                // components can have any number of dynamic text/element children - which won't
                // have attribute handlers attached to them such as onClick, onEnter, etc.
                node: utils.getNodeByPath(view.rootNode, this.nodePath),
                view: view,
                key: this.key,
                value: this.value
            });

            view.bindings.push(attribute);
        }
    });

},{"../../../utils":72,"./attributesBinding":63,"protoclass":79}],63:[function(require,module,exports){
    var protoclass = require("protoclass");
    var utils      = require("../../../utils");

    /**
     */

    function AttributesBinding(attributes, rawAttributes, component, view) {
        this.attributes    = attributes;
        this.rawAttributes = rawAttributes;
        this.component     = component;
        this.view          = view;
    }

    /**
     */

    module.exports = protoclass(AttributesBinding, {

        /**
         */

        bind: function() {
            this.bindings = [];
            for (var k in this.rawAttributes) {
                var v = this.rawAttributes[k];
                if (v.watch && v.evaluate) {
                    this._bindAttr(k, v);
                } else {
                    this.attributes[k] = v;
                }
            }
        },

        /**
         */

        _bindAttr: function(k, v) {
            var self = this;

            this.bindings.push(v.watch(this.view, function(nv, ov) {
                self.attributes[k] = nv;
                self.view.runloop.deferOnce(self.component);
            }));

            self.attributes[k] = v.evaluate(this.view);

        },

        /**
         */

        unbind: function() {
            if (!this.bindings) return;
            for (var i = this.bindings.length; i--;) {
                this.bindings[i].dispose();
            }
            this.bindings = [];
        }
    });

},{"../../../utils":72,"protoclass":79}],64:[function(require,module,exports){
    var protoclass        = require("protoclass");
    var AttributesBinding = require("./attributesBinding");
    var _extend           = require("../../../utils/extend");

    /**
     */

    function ComponentHydrator(name, attributes, childTemplate, section, componentClass) {
        this.name           = name;
        this.attributes     = attributes;
        this.childTemplate  = childTemplate;
        this.section        = section;
        this.componentClass = componentClass;
    }

    /**
     */

    module.exports = protoclass(ComponentHydrator, {

        /**
         */

        initialize: function() {
            this.sectionMarker = this.section.createMarker();
        },

        /**
         */

        hydrate: function(view) {
            this.childTemplate.accessor = view.accessor;

            var clonedSection = this.sectionMarker.getSection(view.rootNode);

            // TODO - bind script attrs to these attrs
            var attributes = _extend({}, this.attributes);

            var component = new this.componentClass({
                name          : this.name,
                section       : clonedSection,
                attributes    : attributes,
                view          : view,
                childTemplate : this.childTemplate
            });

            view.bindings.push(new AttributesBinding(attributes, this.attributes, component, view));

            // is it bindable?
            if (component.bind) view.bindings.push(component);
        }
    });

},{"../../../utils/extend":71,"./attributesBinding":63,"protoclass":79}],65:[function(require,module,exports){
    var protoclass        = require("protoclass");
    var FragmentSection   = require("../../../section/fragment");
    var NodeSection       = require("../../../section/node");
    var Fragment          = require("../fragment");
    var utils             = require("../../../utils");
    var script            = require("../../../script");
    var ComponentHydrator = require("./componentHydrator");
    var AttributeHydrator = require("./attributeHydrator");
    var ValueAttribute    = require("./valueAttribute");
    var _set              = require("../../../utils/set");

    /**
     */

    function _replaceDashes(k) {
        return k.replace(/\-./, function(k) {
            return k.substr(1).toUpperCase();
        });
    }

    /**
     */

    function Element(name, attributes, children) {
        this.name       = name;
        this.attributes = attributes;
        this.children   = children;
    }

    /**
     */

    module.exports = protoclass(Element, {

        /**
         */

        initialize: function(template) {

            var ccName = _replaceDashes(this.name);

            var componentClass = template.components[ccName];

            // is a component present?
            if (componentClass) {

                // create a dynamic section - this is owned by the component
                var section = new FragmentSection(template.document);

                template.hydrators.push(new ComponentHydrator(
                    ccName,
                    this.attributes,
                    template.child(this.children),
                    section,
                    componentClass
                ));

                // TODO:

                /*
                 return {
                 createNode: function() {
                 return section.render();
                 }
                 }
                 */

                return section.render();
            }

            var element          = template.document.createElement(this.name);
            var hasAttrComponent = false;
            var vanillaAttrs     = {};
            var elementSection;
            var v;

            // components should be attachable to regular DOM elements as well
            for (var k in this.attributes) {

                var k2                 = _replaceDashes(k);
                v                      = this.attributes[k];
                var tov                = typeof v;
                var attrComponentClass = template.components[k2];
                var attrClass          = template.attributes[k2];

                hasAttrComponent = !!attrComponentClass || hasAttrComponent;

                if (attrComponentClass) {

                    // TODO - element might need to be a sub view
                    if (!elementSection) {
                        elementSection = new NodeSection(template.document, element);
                    }

                    template.hydrators.push(new ComponentHydrator(
                        this.name,

                        // v could be formatted as repeat.each, repeat.as. Need to check for this
                        typeof v === "object" ? v : this.attributes,
                        template.child(this.children),
                        elementSection,
                        attrComponentClass
                    ));

                } else if (attrClass && (!attrClass.test || attrClass.test(v))) {
                    template.hydrators.push(new AttributeHydrator(
                        attrClass,
                        k,
                        v,
                        element
                    ));
                } else {

                    if (tov !== "object") {
                        vanillaAttrs[k] = v;
                    } else {
                        template.hydrators.push(new AttributeHydrator(
                            ValueAttribute,
                            k,
                            v,
                            element
                        ));
                    }
                }
            }

            /*
             TODO: throw node creation in another object

             return {
             createNode: function() {

             var element = document.createElement()
             // no component class with the attrs? append the children
             if (!hasAttrComponent) element.appendChild(this.children.initialize(template));

             return element;
             }
             }
             */

            for (k in vanillaAttrs) {
                v = vanillaAttrs[k];
                if (typeof v !== "object") {
                    element.setAttribute(k, vanillaAttrs[k]);
                }
            }

            // no component class with the attrs? append the children
            if (!hasAttrComponent) element.appendChild(this.children.initialize(template));

            return element;
        }
    });

    module.exports.create = function(name, attributes, children) {

        // check the attributes for any scripts - pluck them out
        // TODO - check for attribute components - apply the same
        // logic as components

        var attrs = {};

        // NOTE - a bit sloppy here, but we're hijacking the bindable object
        // setter functionality so we can properly get attrs for stuff like repeat.each
        for (var k in attributes) {
            var v = attributes[k];
            _set(attrs, k.toLowerCase(), typeof v === "object" ? script(v) : v);
        }

        // TODO - check for registered components,
        return new Element(name, attrs, new Fragment(children));
    };

},{"../../../script":49,"../../../section/fragment":50,"../../../section/node":51,"../../../utils":72,"../../../utils/set":73,"../fragment":67,"./attributeHydrator":62,"./componentHydrator":64,"./valueAttribute":66,"protoclass":79}],66:[function(require,module,exports){
    var ScriptAttribute = require("../../../attributes/script");

    /**
     */

    module.exports = ScriptAttribute.extend({

        /**
         */

        update: function() {
            if (this.currentValue == null) return this.node.removeAttribute(this.key);
            this.node.setAttribute(this.key, this.currentValue);
        }
    });

},{"../../../attributes/script":15}],67:[function(require,module,exports){
    var protoclass = require("protoclass");

    /**
     */

    function Fragment(children) {
        this.children = children;
    }

    /**
     */

    module.exports = protoclass(Fragment, {

        /**
         */

        initialize: function(template) {
            if (this.children.length === 1) return this.children[0].initialize(template);
            var frag = template.document.createDocumentFragment();
            this.children.forEach(function(child) {
                frag.appendChild(child.initialize(template));
            });
            return frag;
        }
    });

    /**
     */

    module.exports.create = function(children) {
        return new Fragment(children);
    };

},{"protoclass":79}],68:[function(require,module,exports){
    var protoclass = require("protoclass");

    /**
     */

    function Text(value) {
        this.value = value;
    }

    /**
     */

    module.exports = protoclass(Text, {

        /**
         */

        initialize: function(template) {

            // blank text nodes are NOT allowed. Chrome has an issue rendering
            // blank text nodes - way, WAY slower if this isn't here!
            if (/^\s+$/.test(this.value)) {
                return template.document.createTextNode("\u00A0");
            }

            return template.document.createTextNode(this.value);
        }
    });

    /**
     */

    module.exports.create = function(value) {
        return new Text(value);
    };

},{"protoclass":79}],69:[function(require,module,exports){
    module.exports = {

        /**
         */

        each: function(items, each, complete) {

            var total     = items.length;
            var completed = 0;

            items.forEach(function(item) {
                var called = false;
                each(item, function() {
                    if (called) throw new Error("callback called twice");
                    called = true;
                    if (++completed === total && complete) complete();
                });
            });
        }
    };

},{}],70:[function(require,module,exports){
    module.exports = function(callback, context) {
        if (callback.bind) return callback.bind.apply(callback, [context].concat(Array.prototype.slice.call(arguments, 2)));
        return function() {
            return callback.apply(context, arguments);
        };
    };

},{}],71:[function(require,module,exports){
    module.exports = function(to) {
        if (!to) to = {};
        var froms = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, n = froms.length; i < n; i++) {
            var from = froms[i];
            for (var key in from) {
                to[key] = from[key];
            }
        }
        return to;
    };

},{}],72:[function(require,module,exports){
    var createDocumentSection = require("document-section");

    module.exports = {
        getNodePath: function(node) {

            var path = [];
            var p    = node.parentNode;
            var c    = node;

            while (p) {

                // need to slice since some browsers don't support indexOf for child nodes
                path.unshift(Array.prototype.slice.call(p.childNodes).indexOf(c));
                c = p;
                p = p.parentNode;
            }

            return path;
        },
        getNodeByPath: function(node, path) {

            var c = node;

            for (var i = 0, n = path.length; i < n; i++) {
                c = c.childNodes[path[i]];
            }

            return c;
        }
    };

},{"document-section":77}],73:[function(require,module,exports){
    module.exports = function(target, keypath, value) {

        var keys = typeof keypath === "string" ? keypath.split(".") : keypath;
        var ct   = target;
        var key;

        for (var i = 0, n = keys.length - 1; i < n; i++) {
            key = keys[i];
            if (!ct[key]) {
                ct[key] = {};
            }
            ct = ct[key];
        }

        ct[keys[keys.length - 1]] = value;
        return value;
    };

},{}],74:[function(require,module,exports){
    /* istanbul ignore next */
    function _stringifyNode(node) {

        var buffer = "";

        if (node.nodeType === 11) {
            for (var i = 0, n = node.childNodes.length; i < n; i++) {
                buffer += _stringifyNode(node.childNodes[i]);
            }
            return buffer;
        }

        buffer = node.nodeValue || node.outerHTML || "";

        if (node.nodeType === 8) {
            buffer = "<!--" + buffer + "-->";
        }

        return buffer;
    }

    module.exports = _stringifyNode;

},{}],75:[function(require,module,exports){
    module.exports = function(ary) {

        var occurences = {};
        var clone      = ary.concat();

        for (var i = clone.length; i--;) {
            var item = clone[i];
            if (!occurences[item]) occurences[item] = 0;

            if (++occurences[item] > 1) {
                clone.splice(i, 1);
            }
        }

        return clone;
    };

},{}],76:[function(require,module,exports){
// shim for using process in browser

    var process = module.exports = {};
    var queue = [];
    var draining = false;

    function drainQueue() {
        if (draining) {
            return;
        }
        draining = true;
        var currentQueue;
        var len = queue.length;
        while(len) {
            currentQueue = queue;
            queue = [];
            var i = -1;
            while (++i < len) {
                currentQueue[i]();
            }
            len = queue.length;
        }
        draining = false;
    }
    process.nextTick = function (fun) {
        queue.push(fun);
        if (!draining) {
            setTimeout(drainQueue, 0);
        }
    };

    process.title = 'browser';
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = ''; // empty string to avoid regexp issues
    process.versions = {};

    function noop() {}

    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;

    process.binding = function (name) {
        throw new Error('process.binding is not supported');
    };

// TODO(shtylman)
    process.cwd = function () { return '/' };
    process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
    };
    process.umask = function() { return 0; };

},{}],77:[function(require,module,exports){
    var protoclass  = require("protoclass"),
        defaultDocument = require("nofactor");

// TODO - figure out a way to create a document fragment in the constructor
// instead of calling toFragment() each time. perhaps
    var Section = function (document, start, end) {

        this.document = document = document || defaultDocument;

        // create invisible markers so we know where the sections are

        this.start       = start || document.createTextNode("");
        this.end         = end   || document.createTextNode("");
        this.visible     = true;

        if (!this.start.parentNode) {
            var parent  = document.createDocumentFragment();
            parent.appendChild(this.start);
            parent.appendChild(this.end);
        }
    };


    Section = protoclass(Section, {

        /**
         */

        __isLoafSection: true,

        /**
         */

        render: function () {
            return this.start.parentNode;
        },

        /**
         */

        clone: function () {

            var parentClone;

            // fragment?
            if (this.start.parentNode.nodeType === 11) {
                parentClone = this.start.parentNode.cloneNode(true);
            } else {
                parentClone = this.document.createDocumentFragment();

                this.getChildNodes().forEach(function (node) {
                    parentClone.appendChild(node.cloneNode(true));
                });
            }

            return new Section(this.document, parentClone.childNodes[0], parentClone.childNodes[parentClone.childNodes.length - 1 ]);
        },

        /**
         */

        remove: function () {
            // this removes the child nodes completely
            return this._createFragment(this.getChildNodes());
        },

        /**
         */

        _createFragment: function(nodes) {
            var fragment = this.document.createDocumentFragment();
            nodes.forEach(function(node) {
                fragment.appendChild(node);
            });
            return fragment;
        },

        /**
         * shows the section
         */


        show: function () {
            if(!this._detached) return this;
            this.append.apply(this, this._detached.getInnerChildNodes());
            this._detached = void 0;
            this.visible = true;
            return this;
        },

        /**
         * hides the fragment, but maintains the start / end elements
         * so it can be shown again in the same spot.
         */

        hide: function () {
            this._detached = this.removeAll();
            this.visible = false;
            return this;
        },

        /**
         */

        removeAll: function () {
            return this._section(this._removeAll());
        },

        /**
         */

        _removeAll: function () {

            var start = this.start,
                end       = this.end,
                current   = start.nextSibling,
                children  = [];

            while (current != end) {
                current.parentNode.removeChild(current);
                children.push(current);
                current = this.start.nextSibling;
            }

            return children;
        },


        /**
         * DEPRECATED - use appendChild
         */

        append: function () {

            var newNodes = Array.prototype.slice.call(arguments);

            if (!newNodes.length) return;

            if(newNodes.length > 1) {
                newNodes = this._createFragment(newNodes);
            } else {
                newNodes = newNodes[0];
            }

            this.end.parentNode.insertBefore(newNodes, this.end);
        },

        /**
         */

        appendChild: function () {
            this.append.apply(this, arguments);
        },

        /**
         * DEPRECATED - use prependChild
         */

        prepend: function () {
            var newNodes = Array.prototype.slice.call(arguments);

            if (!newNodes.length) return;

            if(newNodes.length > 1) {
                newNodes = this._createFragment(newNodes);
            } else {
                newNodes = newNodes[0];
            }

            this.start.parentNode.insertBefore(newNodes, this.start.nextSibling);
        },


        /**
         */

        prependChild: function () {
            this.prepend.apply(this, arguments);
        },


        /**
         */

        replaceChildNodes: function () {

            //remove the children - children should have a parent though
            this.removeAll();
            this.append.apply(this, arguments);
        },

        /**
         */

        toString: function () {
            var buffer = this.getChildNodes().map(function (node) {
                return node.outerHTML || (node.nodeValue != undefined && node.nodeType == 3 ? node.nodeValue : String(node));
            });
            return buffer.join("");
        },

        /**
         */

        dispose: function () {
            if(this._disposed) return;
            this._disposed = true;

            // might have sub sections, so need to remove with a parent node
            this.removeAll();
            this.start.parentNode.removeChild(this.start);
            this.end.parentNode.removeChild(this.end);
        },

        /**
         */

        getChildNodes: function () {
            var cn   = this.start,
                end      = this.end.nextSibling,
                children = [];


            while (cn != end) {
                children.push(cn);
                cn = cn.nextSibling;
            }

            return children;
        },

        /**
         */

        getInnerChildNodes: function () {
            var cn = this.getChildNodes();
            cn.shift();
            cn.pop()
            return cn;
        },


        /**
         */

        _section: function (children) {
            var section = new Section(this.document);
            section.append.apply(section, children);
            return section;
        }
    });

    module.exports = function (document, start, end)  {
        return new Section(document, start, end);
    }

    module.exports.Section = Section;

},{"nofactor":78,"protoclass":79}],78:[function(require,module,exports){
    module.exports = document;

},{}],79:[function(require,module,exports){
    function _copy (to, from) {

        for (var i = 0, n = from.length; i < n; i++) {

            var target = from[i];

            for (var property in target) {
                to[property] = target[property];
            }
        }

        return to;
    }

    function protoclass (parent, child) {

        var mixins = Array.prototype.slice.call(arguments, 2);

        if (typeof child !== "function") {
            if(child) mixins.unshift(child); // constructor is a mixin
            child   = parent;
            parent  = function() { };
        }

        _copy(child, parent);

        function ctor () {
            this.constructor = child;
        }

        ctor.prototype  = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        child.parent    = child.superclass = parent;

        _copy(child.prototype, mixins);

        protoclass.setup(child);

        return child;
    }

    protoclass.setup = function (child) {


        if (!child.extend) {
            child.extend = function(constructor) {

                var args = Array.prototype.slice.call(arguments, 0);

                if (typeof constructor !== "function") {
                    args.unshift(constructor = function () {
                        constructor.parent.apply(this, arguments);
                    });
                }

                return protoclass.apply(this, [this].concat(args));
            }

            child.mixin = function(proto) {
                _copy(this.prototype, arguments);
            }

            child.create = function () {
                var obj = Object.create(child.prototype);
                child.apply(obj, arguments);
                return obj;
            }
        }

        return child;
    }


    module.exports = protoclass;
},{}]},{},[1]);