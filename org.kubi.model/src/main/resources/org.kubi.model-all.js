var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var System = (function () {
    function System() {
    }
    System.gc = function () {
    };
    System.arraycopy = function (src, srcPos, dest, destPos, numElements) {
        for (var i = 0; i < numElements; i++) {
            dest[destPos + i] = src[srcPos + i];
        }
    };
    System.out = {
        println: function (obj) {
            console.log(obj);
        },
        print: function (obj) {
            console.log(obj);
        }
    };
    System.err = {
        println: function (obj) {
            console.error(obj);
        },
        print: function (obj) {
            console.error(obj);
        }
    };
    return System;
})();
Number.prototype.equals = function (other) {
    return this == other;
};
var StringUtils = (function () {
    function StringUtils() {
    }
    StringUtils.copyValueOf = function (data, offset, count) {
        var result = "";
        for (var i = offset; i < offset + count; i++) {
            result += data[i];
        }
        return result;
    };
    return StringUtils;
})();
String.prototype.matches = function (regEx) {
    if (regEx == null) {
        return false;
    }
    else {
        var m = this.match(regEx);
        return m != null && m.length > 0;
    }
};
String.prototype.isEmpty = function () {
    return this.length == 0;
};
String.prototype.equals = function (other) {
    return this == other;
};
String.prototype.hashCode = function () {
    var hash = 0, i, chr, len;
    if (this.length == 0)
        return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
String.prototype.startsWith = function (other) {
    return this.slice(0, other.length) == other;
};
String.prototype.endsWith = function (other) {
    return this.slice(-other.length) == other;
};
Boolean.prototype.equals = function (other) {
    return this == other;
};
var java;
(function (java) {
    var lang;
    (function (lang) {
        var Double = (function () {
            function Double() {
            }
            Double.parseDouble = function (val) {
                return +val;
            };
            return Double;
        })();
        lang.Double = Double;
        var Float = (function () {
            function Float() {
            }
            Float.parseFloat = function (val) {
                return +val;
            };
            return Float;
        })();
        lang.Float = Float;
        var Integer = (function () {
            function Integer() {
            }
            Integer.parseInt = function (val) {
                return +val;
            };
            return Integer;
        })();
        lang.Integer = Integer;
        var Long = (function () {
            function Long() {
            }
            Long.parseLong = function (val) {
                return +val;
            };
            return Long;
        })();
        lang.Long = Long;
        var Boolean = (function () {
            function Boolean() {
            }
            Boolean.parseBoolean = function (val) {
                return val == "true";
            };
            return Boolean;
        })();
        lang.Boolean = Boolean;
        var Short = (function () {
            function Short() {
            }
            Short.parseShort = function (val) {
                return +val;
            };
            Short.MIN_VALUE = -0x8000;
            Short.MAX_VALUE = 0x7FFF;
            return Short;
        })();
        lang.Short = Short;
        var Throwable = (function () {
            function Throwable(message) {
                this.message = message;
                this.error = new Error(message);
            }
            Throwable.prototype.printStackTrace = function () {
                //console.error(this.error['stack']);
                console.error(this.error);
            };
            return Throwable;
        })();
        lang.Throwable = Throwable;
        var Exception = (function (_super) {
            __extends(Exception, _super);
            function Exception() {
                _super.apply(this, arguments);
            }
            return Exception;
        })(Throwable);
        lang.Exception = Exception;
        var RuntimeException = (function (_super) {
            __extends(RuntimeException, _super);
            function RuntimeException() {
                _super.apply(this, arguments);
            }
            return RuntimeException;
        })(Exception);
        lang.RuntimeException = RuntimeException;
        var IndexOutOfBoundsException = (function (_super) {
            __extends(IndexOutOfBoundsException, _super);
            function IndexOutOfBoundsException() {
                _super.apply(this, arguments);
            }
            return IndexOutOfBoundsException;
        })(Exception);
        lang.IndexOutOfBoundsException = IndexOutOfBoundsException;
        var StringBuilder = (function () {
            function StringBuilder() {
                this.buffer = "";
                this.length = 0;
            }
            StringBuilder.prototype.append = function (val) {
                this.buffer = this.buffer + val;
                length = this.buffer.length;
                return this;
            };
            StringBuilder.prototype.toString = function () {
                return this.buffer;
            };
            return StringBuilder;
        })();
        lang.StringBuilder = StringBuilder;
        var ref;
        (function (ref) {
            var WeakReference = (function () {
                function WeakReference() {
                }
                return WeakReference;
            })();
            ref.WeakReference = WeakReference;
        })(ref = lang.ref || (lang.ref = {}));
    })(lang = java.lang || (java.lang = {}));
    var util;
    (function (util) {
        var Random = (function () {
            function Random() {
            }
            Random.prototype.nextInt = function (max) {
                return Math.random() * max;
            };
            Random.prototype.nextDouble = function () {
                return Math.random();
            };
            return Random;
        })();
        util.Random = Random;
        var Arrays = (function () {
            function Arrays() {
            }
            Arrays.fill = function (data, begin, nbElem, param) {
                var max = begin + nbElem;
                for (var i = begin; i < max; i++) {
                    data[i] = param;
                }
            };
            return Arrays;
        })();
        util.Arrays = Arrays;
        var Collections = (function () {
            function Collections() {
            }
            Collections.reverse = function (p) {
                var temp = new List();
                for (var i = 0; i < p.size(); i++) {
                    temp.add(p.get(i));
                }
                p.clear();
                for (var i = temp.size() - 1; i >= 0; i--) {
                    p.add(temp.get(i));
                }
            };
            Collections.sort = function (p) {
                p.sort();
            };
            return Collections;
        })();
        util.Collections = Collections;
        var XArray = (function () {
            function XArray() {
                Array.apply(this, arguments);
                return new Array();
            }
            XArray.prototype.pop = function () {
                return "";
            };
            XArray.prototype.push = function (val) {
                return 0;
            };
            XArray.prototype.splice = function (newS, arrL) {
            };
            XArray.prototype.indexOf = function (val) {
                return 0;
            };
            XArray.prototype.shift = function () {
                return "";
            };
            XArray.prototype.sort = function () {
            };
            return XArray;
        })();
        util.XArray = XArray;
        XArray["prototype"] = new Array();
        var List = (function (_super) {
            __extends(List, _super);
            function List() {
                _super.apply(this, arguments);
            }
            List.prototype.addAll = function (vals) {
                var tempArray = vals.toArray(null);
                for (var i = 0; i < tempArray.length; i++) {
                    this.push(tempArray[i]);
                }
            };
            List.prototype.clear = function () {
                this.length = 0;
            };
            List.prototype.poll = function () {
                return this.shift();
            };
            List.prototype.remove = function (val) {
            };
            List.prototype.toArray = function (a) {
                return this;
            };
            List.prototype.size = function () {
                return this.length;
            };
            List.prototype.add = function (val) {
                this.push(val);
            };
            List.prototype.get = function (index) {
                return this[index];
            };
            List.prototype.contains = function (val) {
                return this.indexOf(val) != -1;
            };
            List.prototype.isEmpty = function () {
                return this.length == 0;
            };
            return List;
        })(XArray);
        util.List = List;
        var ArrayList = (function (_super) {
            __extends(ArrayList, _super);
            function ArrayList() {
                _super.apply(this, arguments);
            }
            return ArrayList;
        })(List);
        util.ArrayList = ArrayList;
        var LinkedList = (function (_super) {
            __extends(LinkedList, _super);
            function LinkedList() {
                _super.apply(this, arguments);
            }
            return LinkedList;
        })(List);
        util.LinkedList = LinkedList;
        var Stack = (function () {
            function Stack() {
                this.content = new Array();
            }
            Stack.prototype.pop = function () {
                return this.content.pop();
            };
            Stack.prototype.push = function (t) {
                this.content.push(t);
            };
            Stack.prototype.isEmpty = function () {
                return this.content.length == 0;
            };
            Stack.prototype.peek = function () {
                return this.content.slice(-1)[0];
            };
            return Stack;
        })();
        util.Stack = Stack;
        var Map = (function () {
            function Map() {
            }
            Map.prototype.get = function (key) {
                return this[key];
            };
            Map.prototype.put = function (key, value) {
                var previous_val = this[key];
                this[key] = value;
                return previous_val;
            };
            Map.prototype.containsKey = function (key) {
                return this.hasOwnProperty(key);
            };
            Map.prototype.remove = function (key) {
                var tmp = this[key];
                delete this[key];
                return tmp;
            };
            Map.prototype.keySet = function () {
                var result = new HashSet();
                for (var p in this) {
                    if (this.hasOwnProperty(p)) {
                        result.add(p);
                    }
                }
                return result;
            };
            Map.prototype.isEmpty = function () {
                return Object.keys(this).length == 0;
            };
            Map.prototype.values = function () {
                var result = new HashSet();
                for (var p in this) {
                    if (this.hasOwnProperty(p)) {
                        result.add(this[p]);
                    }
                }
                return result;
            };
            Map.prototype.clear = function () {
                for (var p in this) {
                    if (this.hasOwnProperty(p)) {
                        delete this[p];
                    }
                }
            };
            return Map;
        })();
        util.Map = Map;
        var HashMap = (function (_super) {
            __extends(HashMap, _super);
            function HashMap() {
                _super.apply(this, arguments);
            }
            return HashMap;
        })(Map);
        util.HashMap = HashMap;
        var Set = (function () {
            function Set() {
            }
            Set.prototype.add = function (val) {
                this[val] = val;
            };
            Set.prototype.clear = function () {
                for (var p in this) {
                    if (this.hasOwnProperty(p)) {
                        delete this[p];
                    }
                }
            };
            Set.prototype.contains = function (val) {
                return this.hasOwnProperty(val);
            };
            Set.prototype.addAll = function (vals) {
                var tempArray = vals.toArray(null);
                for (var i = 0; i < tempArray.length; i++) {
                    this[tempArray[i]] = tempArray[i];
                }
            };
            Set.prototype.remove = function (val) {
                delete this[val];
            };
            Set.prototype.size = function () {
                return Object.keys(this).length;
            };
            Set.prototype.isEmpty = function () {
                return this.size() == 0;
            };
            Set.prototype.toArray = function (a) {
                for (var ik in this) {
                    a.push(this[ik]);
                }
                return a;
            };
            return Set;
        })();
        util.Set = Set;
        var HashSet = (function (_super) {
            __extends(HashSet, _super);
            function HashSet() {
                _super.apply(this, arguments);
            }
            return HashSet;
        })(Set);
        util.HashSet = HashSet;
    })(util = java.util || (java.util = {}));
})(java || (java = {}));
var org;
(function (org) {
    var junit;
    (function (junit) {
        var Assert = (function () {
            function Assert() {
            }
            Assert.assertArrayEquals = function (p, p2) {
                if (p == null || p == undefined) {
                    if (p2 == null || p2 == undefined) {
                        return;
                    }
                    else {
                        throw "Assert Error " + p + " and " + p2 + " must be equals";
                    }
                }
                if (p2 == null || p2 == undefined) {
                    if (p == null || p == undefined) {
                        return;
                    }
                    else {
                        throw "Assert Error " + p + " and " + p2 + " must be equals";
                    }
                }
                if (p.length != p2.length) {
                    throw "Assert Error " + p + " and " + p2 + " must be equals";
                }
                for (var i = 0; i < p.length; i++) {
                    if (p[i] != p2[i]) {
                        throw "Assert Error " + p + " and " + p2 + " must be equals";
                    }
                }
            };
            Assert.assertNotNull = function (p) {
                if (p == null) {
                    throw "Assert Error " + p + " must not be null";
                }
            };
            Assert.assertNull = function (p) {
                if (p != null) {
                    throw "Assert Error " + p + " must be null";
                }
            };
            Assert.assertEquals = function (p, p2) {
                if (p == null) {
                    if (p2 == null) {
                        return;
                    }
                    else {
                        throw "Assert Error \n" + p + "\n must be equal to \n" + p2 + "\n";
                    }
                }
                if (p2 == null) {
                    if (p == null) {
                        return;
                    }
                    else {
                        throw "Assert Error \n" + p + "\n must be equal to \n" + p2 + "\n";
                    }
                }
                if (p.equals !== undefined) {
                    if (!p.equals(p2)) {
                        throw "Assert Error \n" + p + "\n must be equal to \n" + p2 + "\n";
                    }
                }
                else {
                    if (p != p2) {
                        throw "Assert Error \n" + p + "\n must be equal to \n" + p2 + "\n";
                    }
                }
            };
            Assert.assertNotEquals = function (p, p2) {
                if (p.equals !== undefined) {
                    if (p.equals(p2)) {
                        throw "Assert Error \n" + p + "\n must not be equal to \n" + p2 + "\n";
                    }
                }
                else {
                    if (p == p2) {
                        throw "Assert Error \n" + p + "\n must not be equal to \n" + p2 + "\n";
                    }
                }
            };
            Assert.assertTrue = function (b) {
                if (!b) {
                    throw "Assert Error " + b + " must be true";
                }
            };
            Assert.assertFalse = function (b) {
                if (b) {
                    throw "Assert Error " + b + " must be false";
                }
            };
            return Assert;
        })();
        junit.Assert = Assert;
    })(junit = org.junit || (org.junit = {}));
})(org || (org = {}));
//# sourceMappingURL=java.js.map
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var org;
(function (org) {
    var kevoree;
    (function (kevoree) {
        var modeling;
        (function (modeling) {
            var KActionType = (function () {
                function KActionType() {
                }
                KActionType.prototype.equals = function (other) {
                    return this == other;
                };
                KActionType.values = function () {
                    return KActionType._KActionTypeVALUES;
                };
                KActionType.CALL = new KActionType();
                KActionType.CALL_RESPONSE = new KActionType();
                KActionType.SET = new KActionType();
                KActionType.ADD = new KActionType();
                KActionType.REMOVE = new KActionType();
                KActionType.NEW = new KActionType();
                KActionType._KActionTypeVALUES = [
                    KActionType.CALL,
                    KActionType.CALL_RESPONSE,
                    KActionType.SET,
                    KActionType.ADD,
                    KActionType.REMOVE,
                    KActionType.NEW
                ];
                return KActionType;
            })();
            modeling.KActionType = KActionType;
            var KConfig = (function () {
                function KConfig() {
                }
                KConfig.TREE_CACHE_SIZE = 3;
                KConfig.CALLBACK_HISTORY = 1000;
                KConfig.LONG_SIZE = 53;
                KConfig.PREFIX_SIZE = 16;
                KConfig.BEGINNING_OF_TIME = -0x001FFFFFFFFFFFFE;
                KConfig.END_OF_TIME = 0x001FFFFFFFFFFFFE;
                KConfig.NULL_LONG = 0x001FFFFFFFFFFFFF;
                KConfig.KEY_PREFIX_MASK = 0x0000001FFFFFFFFF;
                KConfig.KEY_SEP = '|';
                KConfig.CACHE_INIT_SIZE = 16;
                KConfig.CACHE_LOAD_FACTOR = (75 / 100);
                return KConfig;
            })();
            modeling.KConfig = KConfig;
            var KContentKey = (function () {
                function KContentKey(p_universeID, p_timeID, p_objID) {
                    this.universe = p_universeID;
                    this.time = p_timeID;
                    this.obj = p_objID;
                }
                KContentKey.createUniverseTree = function (p_objectID) {
                    return new org.kevoree.modeling.KContentKey(org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG, p_objectID);
                };
                KContentKey.createTimeTree = function (p_universeID, p_objectID) {
                    return new org.kevoree.modeling.KContentKey(p_universeID, org.kevoree.modeling.KConfig.NULL_LONG, p_objectID);
                };
                KContentKey.createObject = function (p_universeID, p_quantaID, p_objectID) {
                    return new org.kevoree.modeling.KContentKey(p_universeID, p_quantaID, p_objectID);
                };
                KContentKey.createGlobalUniverseTree = function () {
                    return new org.kevoree.modeling.KContentKey(org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG);
                };
                KContentKey.createRootUniverseTree = function () {
                    return new org.kevoree.modeling.KContentKey(org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.END_OF_TIME);
                };
                KContentKey.createRootTimeTree = function (universeID) {
                    return new org.kevoree.modeling.KContentKey(universeID, org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.END_OF_TIME);
                };
                KContentKey.createLastPrefix = function () {
                    return new org.kevoree.modeling.KContentKey(org.kevoree.modeling.KConfig.END_OF_TIME, org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG);
                };
                KContentKey.createLastObjectIndexFromPrefix = function (prefix) {
                    return new org.kevoree.modeling.KContentKey(org.kevoree.modeling.KConfig.END_OF_TIME, org.kevoree.modeling.KConfig.NULL_LONG, prefix);
                };
                KContentKey.createLastUniverseIndexFromPrefix = function (prefix) {
                    return new org.kevoree.modeling.KContentKey(org.kevoree.modeling.KConfig.END_OF_TIME, org.kevoree.modeling.KConfig.NULL_LONG, prefix);
                };
                KContentKey.create = function (payload) {
                    if (payload == null || payload.length == 0) {
                        return null;
                    }
                    else {
                        var key = new org.kevoree.modeling.KContentKey(org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG);
                        var maxRead = payload.length;
                        var indexStartElem = -1;
                        var indexElem = 0;
                        var partIndex = 0;
                        for (var i = 0; i < maxRead; i++) {
                            if (payload.charAt(i) == org.kevoree.modeling.KConfig.KEY_SEP) {
                                if (indexStartElem != -1) {
                                    try {
                                        switch (partIndex) {
                                            case 0:
                                                key.universe = org.kevoree.modeling.util.maths.Base64.decodeToLongWithBounds(payload, indexStartElem, i);
                                                break;
                                            case 1:
                                                key.time = org.kevoree.modeling.util.maths.Base64.decodeToLongWithBounds(payload, indexStartElem, i);
                                                break;
                                            case 2:
                                                key.obj = org.kevoree.modeling.util.maths.Base64.decodeToLongWithBounds(payload, indexStartElem, i);
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                    catch ($ex$) {
                                        if ($ex$ instanceof java.lang.Exception) {
                                            var e = $ex$;
                                            e.printStackTrace();
                                        }
                                        else {
                                            throw $ex$;
                                        }
                                    }
                                }
                                indexStartElem = -1;
                                indexElem = indexElem + 1;
                                partIndex++;
                            }
                            else {
                                if (indexStartElem == -1) {
                                    indexStartElem = i;
                                }
                            }
                        }
                        if (indexStartElem != -1) {
                            try {
                                switch (partIndex) {
                                    case 0:
                                        key.universe = org.kevoree.modeling.util.maths.Base64.decodeToLongWithBounds(payload, indexStartElem, maxRead);
                                        break;
                                    case 1:
                                        key.time = org.kevoree.modeling.util.maths.Base64.decodeToLongWithBounds(payload, indexStartElem, maxRead);
                                        break;
                                    case 2:
                                        key.obj = org.kevoree.modeling.util.maths.Base64.decodeToLongWithBounds(payload, indexStartElem, maxRead);
                                        break;
                                    default:
                                        break;
                                }
                            }
                            catch ($ex$) {
                                if ($ex$ instanceof java.lang.Exception) {
                                    var e = $ex$;
                                    e.printStackTrace();
                                }
                                else {
                                    throw $ex$;
                                }
                            }
                        }
                        return key;
                    }
                };
                KContentKey.prototype.toString = function () {
                    var buffer = new java.lang.StringBuilder();
                    if (this.universe != org.kevoree.modeling.KConfig.NULL_LONG) {
                        org.kevoree.modeling.util.maths.Base64.encodeLongToBuffer(this.universe, buffer);
                    }
                    buffer.append(org.kevoree.modeling.KConfig.KEY_SEP);
                    if (this.time != org.kevoree.modeling.KConfig.NULL_LONG) {
                        org.kevoree.modeling.util.maths.Base64.encodeLongToBuffer(this.time, buffer);
                    }
                    buffer.append(org.kevoree.modeling.KConfig.KEY_SEP);
                    if (this.obj != org.kevoree.modeling.KConfig.NULL_LONG) {
                        org.kevoree.modeling.util.maths.Base64.encodeLongToBuffer(this.obj, buffer);
                    }
                    return buffer.toString();
                };
                KContentKey.prototype.equals = function (param) {
                    if (param instanceof org.kevoree.modeling.KContentKey) {
                        var remote = param;
                        return remote.universe == this.universe && remote.time == this.time && remote.obj == this.obj;
                    }
                    else {
                        return false;
                    }
                };
                return KContentKey;
            })();
            modeling.KContentKey = KContentKey;
            var abs;
            (function (abs) {
                var AbstractDataType = (function () {
                    function AbstractDataType(p_name, p_isEnum) {
                        this._name = p_name;
                        this._isEnum = p_isEnum;
                    }
                    AbstractDataType.prototype.name = function () {
                        return this._name;
                    };
                    AbstractDataType.prototype.isEnum = function () {
                        return this._isEnum;
                    };
                    return AbstractDataType;
                })();
                abs.AbstractDataType = AbstractDataType;
                var AbstractKModel = (function () {
                    function AbstractKModel() {
                        this._manager = new org.kevoree.modeling.memory.manager.impl.MemoryManager(this);
                        this._key = this._manager.nextModelKey();
                    }
                    AbstractKModel.prototype.metaModel = function () {
                        throw "Abstract method";
                    };
                    AbstractKModel.prototype.connect = function (cb) {
                        this._manager.connect(cb);
                    };
                    AbstractKModel.prototype.close = function (cb) {
                        this._manager.close(cb);
                    };
                    AbstractKModel.prototype.manager = function () {
                        return this._manager;
                    };
                    AbstractKModel.prototype.newUniverse = function () {
                        var nextKey = this._manager.nextUniverseKey();
                        var newDimension = this.internalCreateUniverse(nextKey);
                        this.manager().initUniverse(newDimension, null);
                        return newDimension;
                    };
                    AbstractKModel.prototype.internalCreateUniverse = function (universe) {
                        throw "Abstract method";
                    };
                    AbstractKModel.prototype.internalCreateObject = function (universe, time, uuid, clazz) {
                        throw "Abstract method";
                    };
                    AbstractKModel.prototype.createProxy = function (universe, time, uuid, clazz) {
                        return this.internalCreateObject(universe, time, uuid, clazz);
                    };
                    AbstractKModel.prototype.universe = function (key) {
                        var newDimension = this.internalCreateUniverse(key);
                        this.manager().initUniverse(newDimension, null);
                        return newDimension;
                    };
                    AbstractKModel.prototype.save = function (cb) {
                        this._manager.save(cb);
                    };
                    AbstractKModel.prototype.discard = function (cb) {
                        this._manager.discard(null, cb);
                    };
                    AbstractKModel.prototype.setContentDeliveryDriver = function (p_driver) {
                        this.manager().setContentDeliveryDriver(p_driver);
                        return this;
                    };
                    AbstractKModel.prototype.setScheduler = function (p_scheduler) {
                        this.manager().setScheduler(p_scheduler);
                        return this;
                    };
                    AbstractKModel.prototype.setOperation = function (metaOperation, operation) {
                        this.manager().operationManager().registerOperation(metaOperation, operation, null);
                    };
                    AbstractKModel.prototype.setInstanceOperation = function (metaOperation, target, operation) {
                        this.manager().operationManager().registerOperation(metaOperation, operation, target);
                    };
                    AbstractKModel.prototype.defer = function () {
                        return new org.kevoree.modeling.defer.impl.Defer();
                    };
                    AbstractKModel.prototype.key = function () {
                        return this._key;
                    };
                    AbstractKModel.prototype.clearListenerGroup = function (groupID) {
                        this.manager().cdn().unregisterGroup(groupID);
                    };
                    AbstractKModel.prototype.nextGroup = function () {
                        return this.manager().nextGroupKey();
                    };
                    AbstractKModel.prototype.create = function (clazz, universe, time) {
                        if (!org.kevoree.modeling.util.Checker.isDefined(clazz)) {
                            return null;
                        }
                        var newObj = this.internalCreateObject(universe, time, this._manager.nextObjectKey(), clazz);
                        if (newObj != null) {
                            this._manager.initKObject(newObj);
                        }
                        return newObj;
                    };
                    AbstractKModel.prototype.createByName = function (metaClassName, universe, time) {
                        return this.create(this._manager.model().metaModel().metaClassByName(metaClassName), universe, time);
                    };
                    AbstractKModel.prototype.lookup = function (p_universe, p_time, p_uuid, cb) {
                        this._manager.lookup(p_universe, p_time, p_uuid, cb);
                    };
                    return AbstractKModel;
                })();
                abs.AbstractKModel = AbstractKModel;
                var AbstractKObject = (function () {
                    function AbstractKObject(p_universe, p_time, p_uuid, p_metaClass, p_manager) {
                        this._universe = p_universe;
                        this._time = p_time;
                        this._uuid = p_uuid;
                        this._metaClass = p_metaClass;
                        this._manager = p_manager;
                        this._manager.cache().monitor(this);
                    }
                    AbstractKObject.prototype.uuid = function () {
                        return this._uuid;
                    };
                    AbstractKObject.prototype.metaClass = function () {
                        return this._metaClass;
                    };
                    AbstractKObject.prototype.now = function () {
                        return this._time;
                    };
                    AbstractKObject.prototype.universe = function () {
                        return this._universe;
                    };
                    AbstractKObject.prototype.timeWalker = function () {
                        return new org.kevoree.modeling.abs.AbstractTimeWalker(this);
                    };
                    AbstractKObject.prototype.delete = function (cb) {
                        var selfPointer = this;
                        var rawPayload = this._manager.segment(this._universe, this._time, this._uuid, false, this._metaClass, null);
                        if (rawPayload == null) {
                            if (cb != null) {
                                cb(new java.lang.Exception(AbstractKObject.OUT_OF_CACHE_MSG));
                            }
                        }
                        else {
                            var collector = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                            var metaElements = this._metaClass.metaElements();
                            for (var i = 0; i < metaElements.length; i++) {
                                if (metaElements[i] instanceof org.kevoree.modeling.meta.impl.MetaReference) {
                                    var inboundsKeys = rawPayload.getRef(metaElements[i].index(), this._metaClass);
                                    for (var j = 0; j < inboundsKeys.length; j++) {
                                        collector.put(inboundsKeys[j], inboundsKeys[j]);
                                    }
                                    rawPayload.clearRef(metaElements[i].index(), this._metaClass);
                                }
                            }
                            var flatCollected = new Array();
                            var indexI = new Array();
                            indexI[0] = 0;
                            collector.each(function (key, value) {
                                flatCollected[indexI[0]] = value;
                                indexI[0]++;
                            });
                            this._manager.lookupAllObjects(this._universe, this._time, flatCollected, function (resolved) {
                                for (var i = 0; i < resolved.length; i++) {
                                    if (resolved[i] != null) {
                                        var linkedReferences = resolved[i].referencesWith(selfPointer);
                                        for (var j = 0; j < linkedReferences.length; j++) {
                                            resolved[i].internal_mutate(org.kevoree.modeling.KActionType.REMOVE, linkedReferences[j], selfPointer, false);
                                        }
                                    }
                                }
                                if (cb != null) {
                                    cb(null);
                                }
                            });
                        }
                    };
                    AbstractKObject.prototype.select = function (query, cb) {
                        if (!org.kevoree.modeling.util.Checker.isDefined(query)) {
                            cb(new Array());
                        }
                        else {
                            var singleRoot = new Array();
                            singleRoot[0] = this;
                            org.kevoree.modeling.traversal.query.impl.QueryEngine.getINSTANCE().eval(query, singleRoot, cb);
                        }
                    };
                    AbstractKObject.prototype.listen = function (groupId, listener) {
                        this._manager.cdn().registerListener(groupId, this, listener);
                    };
                    AbstractKObject.prototype.get = function (p_attribute) {
                        var transposed = this.internal_transpose_att(p_attribute);
                        if (transposed == null) {
                            throw new java.lang.RuntimeException("Bad KMF usage, the attribute named " + p_attribute.metaName() + " is not part of " + this.metaClass().metaName());
                        }
                        else {
                            return transposed.strategy().extrapolate(this, transposed);
                        }
                    };
                    AbstractKObject.prototype.getByName = function (atributeName) {
                        var transposed = this._metaClass.attribute(atributeName);
                        if (transposed != null) {
                            return transposed.strategy().extrapolate(this, transposed);
                        }
                        else {
                            return null;
                        }
                    };
                    AbstractKObject.prototype.set = function (p_attribute, payload) {
                        var transposed = this.internal_transpose_att(p_attribute);
                        if (transposed == null) {
                            throw new java.lang.RuntimeException("Bad KMF usage, the attribute named " + p_attribute.metaName() + " is not part of " + this.metaClass().metaName());
                        }
                        else {
                            transposed.strategy().mutate(this, transposed, payload);
                        }
                    };
                    AbstractKObject.prototype.setByName = function (atributeName, payload) {
                        var transposed = this._metaClass.attribute(atributeName);
                        if (transposed != null) {
                            transposed.strategy().mutate(this, transposed, payload);
                        }
                    };
                    AbstractKObject.prototype.mutate = function (actionType, metaReference, param) {
                        this.internal_mutate(actionType, metaReference, param, true);
                    };
                    AbstractKObject.prototype.internal_mutate = function (actionType, metaReferenceP, param, setOpposite) {
                        var metaReference = this.internal_transpose_ref(metaReferenceP);
                        if (metaReference == null) {
                            if (metaReferenceP == null) {
                                throw new java.lang.RuntimeException("Bad KMF usage, the reference " + " is null in metaClass named " + this.metaClass().metaName());
                            }
                            else {
                                throw new java.lang.RuntimeException("Bad KMF usage, the reference named " + metaReferenceP.metaName() + " is not part of " + this.metaClass().metaName());
                            }
                        }
                        if (actionType.equals(org.kevoree.modeling.KActionType.ADD)) {
                            if (metaReference.single()) {
                                this.internal_mutate(org.kevoree.modeling.KActionType.SET, metaReference, param, setOpposite);
                            }
                            else {
                                var raw = this._manager.segment(this._universe, this._time, this._uuid, false, this._metaClass, null);
                                if (raw != null) {
                                    if (raw.addRef(metaReference.index(), param.uuid(), this._metaClass)) {
                                        if (setOpposite) {
                                            param.internal_mutate(org.kevoree.modeling.KActionType.ADD, metaReference.opposite(), this, false);
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            if (actionType.equals(org.kevoree.modeling.KActionType.SET)) {
                                if (!metaReference.single()) {
                                    this.internal_mutate(org.kevoree.modeling.KActionType.ADD, metaReference, param, setOpposite);
                                }
                                else {
                                    if (param == null) {
                                        this.internal_mutate(org.kevoree.modeling.KActionType.REMOVE, metaReference, null, setOpposite);
                                    }
                                    else {
                                        var payload = this._manager.segment(this._universe, this._time, this._uuid, false, this._metaClass, null);
                                        var previous = payload.getRef(metaReference.index(), this._metaClass);
                                        var singleValue = new Array();
                                        singleValue[0] = param.uuid();
                                        payload.set(metaReference.index(), singleValue, this._metaClass);
                                        if (setOpposite) {
                                            if (previous != null) {
                                                var self = this;
                                                this._manager.lookupAllObjects(this._universe, this._time, previous, function (kObjects) {
                                                    for (var i = 0; i < kObjects.length; i++) {
                                                        kObjects[i].internal_mutate(org.kevoree.modeling.KActionType.REMOVE, metaReference.opposite(), self, false);
                                                    }
                                                    param.internal_mutate(org.kevoree.modeling.KActionType.ADD, metaReference.opposite(), self, false);
                                                });
                                            }
                                            else {
                                                param.internal_mutate(org.kevoree.modeling.KActionType.ADD, metaReference.opposite(), this, false);
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                if (actionType.equals(org.kevoree.modeling.KActionType.REMOVE)) {
                                    if (metaReference.single()) {
                                        var raw = this._manager.segment(this._universe, this._time, this._uuid, false, this._metaClass, null);
                                        var previousKid = raw.getRef(metaReference.index(), this._metaClass);
                                        raw.set(metaReference.index(), null, this._metaClass);
                                        if (setOpposite) {
                                            if (previousKid != null) {
                                                var self = this;
                                                this._manager.lookupAllObjects(this._universe, this._time, previousKid, function (resolvedParams) {
                                                    if (resolvedParams != null) {
                                                        for (var dd = 0; dd < resolvedParams.length; dd++) {
                                                            if (resolvedParams[dd] != null) {
                                                                resolvedParams[dd].internal_mutate(org.kevoree.modeling.KActionType.REMOVE, metaReference.opposite(), self, false);
                                                            }
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    }
                                    else {
                                        var payload = this._manager.segment(this._universe, this._time, this._uuid, false, this._metaClass, null);
                                        if (payload != null) {
                                            if (payload.removeRef(metaReference.index(), param.uuid(), this._metaClass)) {
                                                if (setOpposite) {
                                                    param.internal_mutate(org.kevoree.modeling.KActionType.REMOVE, metaReference.opposite(), this, false);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    };
                    AbstractKObject.prototype.size = function (p_metaReference) {
                        var transposed = this.internal_transpose_ref(p_metaReference);
                        if (transposed == null) {
                            throw new java.lang.RuntimeException("Bad KMF usage, the attribute named " + p_metaReference.metaName() + " is not part of " + this.metaClass().metaName());
                        }
                        else {
                            var raw = this._manager.segment(this._universe, this._time, this._uuid, true, this._metaClass, null);
                            if (raw != null) {
                                var ref = raw.get(transposed.index(), this._metaClass);
                                if (ref == null) {
                                    return 0;
                                }
                                else {
                                    try {
                                        var castedRefArray = ref;
                                        return castedRefArray.length;
                                    }
                                    catch ($ex$) {
                                        if ($ex$ instanceof java.lang.Exception) {
                                            var e = $ex$;
                                            e.printStackTrace();
                                            return 0;
                                        }
                                        else {
                                            throw $ex$;
                                        }
                                    }
                                }
                            }
                            else {
                                return 0;
                            }
                        }
                    };
                    AbstractKObject.prototype.ref = function (p_metaReference, cb) {
                        var transposed = this.internal_transpose_ref(p_metaReference);
                        if (transposed == null) {
                            throw new java.lang.RuntimeException("Bad KMF usage, the reference named " + p_metaReference.metaName() + " is not part of " + this.metaClass().metaName());
                        }
                        else {
                            var raw = this._manager.segment(this._universe, this._time, this._uuid, true, this._metaClass, null);
                            if (raw == null) {
                                cb(new Array());
                            }
                            else {
                                var o = raw.getRef(transposed.index(), this._metaClass);
                                if (o == null) {
                                    cb(new Array());
                                }
                                else {
                                    this._manager.lookupAllObjects(this._universe, this._time, o, cb);
                                }
                            }
                        }
                    };
                    AbstractKObject.prototype.visitAttributes = function (visitor) {
                        if (!org.kevoree.modeling.util.Checker.isDefined(visitor)) {
                            return;
                        }
                        var metaElements = this.metaClass().metaElements();
                        for (var i = 0; i < metaElements.length; i++) {
                            if (metaElements[i] instanceof org.kevoree.modeling.meta.impl.MetaAttribute) {
                                var metaAttribute = metaElements[i];
                                visitor(metaAttribute, this.get(metaAttribute));
                            }
                        }
                    };
                    AbstractKObject.prototype.visit = function (p_visitor, cb) {
                        this.internal_visit(p_visitor, cb, new org.kevoree.modeling.memory.struct.map.impl.ArrayLongLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR), new org.kevoree.modeling.memory.struct.map.impl.ArrayLongLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR));
                    };
                    AbstractKObject.prototype.internal_visit = function (visitor, end, visited, traversed) {
                        if (!org.kevoree.modeling.util.Checker.isDefined(visitor)) {
                            return;
                        }
                        if (traversed != null) {
                            traversed.put(this._uuid, this._uuid);
                        }
                        var toResolveIds = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                        var metaElements = this.metaClass().metaElements();
                        for (var i = 0; i < metaElements.length; i++) {
                            if (metaElements[i] instanceof org.kevoree.modeling.meta.impl.MetaReference) {
                                var reference = metaElements[i];
                                var raw = this._manager.segment(this._universe, this._time, this._uuid, true, this._metaClass, null);
                                if (raw != null) {
                                    var idArr = raw.getRef(reference.index(), this._metaClass);
                                    if (idArr != null) {
                                        try {
                                            for (var k = 0; k < idArr.length; k++) {
                                                if (traversed == null || !traversed.contains(idArr[k])) {
                                                    toResolveIds.put(idArr[k], idArr[k]);
                                                }
                                            }
                                        }
                                        catch ($ex$) {
                                            if ($ex$ instanceof java.lang.Exception) {
                                                var e = $ex$;
                                                e.printStackTrace();
                                            }
                                            else {
                                                throw $ex$;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (toResolveIds.size() == 0) {
                            if (org.kevoree.modeling.util.Checker.isDefined(end)) {
                                end(null);
                            }
                        }
                        else {
                            var trimmed = new Array();
                            var inserted = [0];
                            toResolveIds.each(function (key, value) {
                                trimmed[inserted[0]] = value;
                                inserted[0]++;
                            });
                            this._manager.lookupAllObjects(this._universe, this._time, trimmed, function (resolvedArr) {
                                var nextDeep = new java.util.ArrayList();
                                for (var i = 0; i < resolvedArr.length; i++) {
                                    var resolved = resolvedArr[i];
                                    var result = org.kevoree.modeling.traversal.visitor.KVisitResult.CONTINUE;
                                    if (resolved != null) {
                                        if (visitor != null && (visited == null || !visited.contains(resolved.uuid()))) {
                                            result = visitor(resolved);
                                        }
                                        if (visited != null) {
                                            visited.put(resolved.uuid(), resolved.uuid());
                                        }
                                    }
                                    if (result != null && result.equals(org.kevoree.modeling.traversal.visitor.KVisitResult.STOP)) {
                                        if (org.kevoree.modeling.util.Checker.isDefined(end)) {
                                            end(null);
                                        }
                                    }
                                    else {
                                        if (result.equals(org.kevoree.modeling.traversal.visitor.KVisitResult.CONTINUE)) {
                                            if (traversed == null || !traversed.contains(resolved.uuid())) {
                                                nextDeep.add(resolved);
                                            }
                                        }
                                    }
                                }
                                if (!nextDeep.isEmpty()) {
                                    var index = new Array();
                                    index[0] = 0;
                                    var next = new java.util.ArrayList();
                                    next.add(function (throwable) {
                                        index[0] = index[0] + 1;
                                        if (index[0] == nextDeep.size()) {
                                            if (org.kevoree.modeling.util.Checker.isDefined(end)) {
                                                end(null);
                                            }
                                        }
                                        else {
                                            var abstractKObject = nextDeep.get(index[0]);
                                            abstractKObject.internal_visit(visitor, next.get(0), visited, traversed);
                                        }
                                    });
                                    var abstractKObject = nextDeep.get(index[0]);
                                    abstractKObject.internal_visit(visitor, next.get(0), visited, traversed);
                                }
                                else {
                                    if (org.kevoree.modeling.util.Checker.isDefined(end)) {
                                        end(null);
                                    }
                                }
                            });
                        }
                    };
                    AbstractKObject.prototype.toJSON = function () {
                        var builder = new java.lang.StringBuilder();
                        builder.append("{\"universe\":");
                        builder.append(this._universe);
                        builder.append(",\"time\":");
                        builder.append(this._time);
                        builder.append(",\"uuid\":");
                        builder.append(this._uuid);
                        var raw = this._manager.segment(this._universe, this._time, this._uuid, true, this._metaClass, null);
                        if (raw != null) {
                            builder.append(",\"data\":");
                            builder.append(raw.toJSON(this._manager.model().metaModel()));
                        }
                        builder.append("}");
                        return builder.toString();
                    };
                    AbstractKObject.prototype.toString = function () {
                        return this.toJSON();
                    };
                    AbstractKObject.prototype.equals = function (obj) {
                        if (!(obj instanceof org.kevoree.modeling.abs.AbstractKObject)) {
                            return false;
                        }
                        else {
                            var casted = obj;
                            return casted._uuid == this._uuid && casted._time == this._time && casted._universe == this._universe;
                        }
                    };
                    AbstractKObject.prototype.hashCode = function () {
                        return (this._universe ^ this._time ^ this._uuid);
                    };
                    AbstractKObject.prototype.jump = function (p_time, p_callback) {
                        var resolve_entry = this._manager.cache().get(this._universe, p_time, this._uuid);
                        if (resolve_entry != null) {
                            var timeTree = this._manager.cache().get(this._universe, org.kevoree.modeling.KConfig.NULL_LONG, this._uuid);
                            timeTree.inc();
                            var universeTree = this._manager.cache().get(org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG, this._uuid);
                            universeTree.inc();
                            resolve_entry.inc();
                            p_callback(this._manager.model().createProxy(this._universe, p_time, this._uuid, this._metaClass));
                        }
                        else {
                            var timeTree = this._manager.cache().get(this._universe, org.kevoree.modeling.KConfig.NULL_LONG, this._uuid);
                            if (timeTree != null) {
                                var resolvedTime = timeTree.previousOrEqual(p_time);
                                if (resolvedTime != org.kevoree.modeling.KConfig.NULL_LONG) {
                                    var entry = this._manager.cache().get(this._universe, resolvedTime, this._uuid);
                                    if (entry != null) {
                                        var universeTree = this._manager.cache().get(org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG, this._uuid);
                                        universeTree.inc();
                                        timeTree.inc();
                                        entry.inc();
                                        p_callback(this._manager.model().createProxy(this._universe, p_time, this._uuid, this._metaClass));
                                    }
                                    else {
                                        this._manager.lookup(this._universe, p_time, this._uuid, p_callback);
                                    }
                                }
                            }
                            else {
                                this._manager.lookup(this._universe, p_time, this._uuid, p_callback);
                            }
                        }
                    };
                    AbstractKObject.prototype.internal_transpose_ref = function (p) {
                        if (!org.kevoree.modeling.util.Checker.isDefined(p)) {
                            return null;
                        }
                        else {
                            return this.metaClass().metaByName(p.metaName());
                        }
                    };
                    AbstractKObject.prototype.internal_transpose_att = function (p) {
                        if (!org.kevoree.modeling.util.Checker.isDefined(p)) {
                            return null;
                        }
                        else {
                            return this.metaClass().metaByName(p.metaName());
                        }
                    };
                    AbstractKObject.prototype.internal_transpose_op = function (p) {
                        if (!org.kevoree.modeling.util.Checker.isDefined(p)) {
                            return null;
                        }
                        else {
                            return this.metaClass().metaByName(p.metaName());
                        }
                    };
                    AbstractKObject.prototype.traversal = function () {
                        var singleRoot = new Array();
                        singleRoot[0] = this;
                        return new org.kevoree.modeling.traversal.impl.Traversal(singleRoot);
                    };
                    AbstractKObject.prototype.referencesWith = function (o) {
                        if (org.kevoree.modeling.util.Checker.isDefined(o)) {
                            var raw = this._manager.segment(this._universe, this._time, this._uuid, true, this._metaClass, null);
                            if (raw != null) {
                                var metaElements = this.metaClass().metaElements();
                                var selected = new java.util.ArrayList();
                                for (var i = 0; i < metaElements.length; i++) {
                                    if (metaElements[i] instanceof org.kevoree.modeling.meta.impl.MetaReference) {
                                        var rawI = raw.getRef((metaElements[i].index()), this._metaClass);
                                        if (rawI != null) {
                                            var oUUID = o.uuid();
                                            for (var h = 0; h < rawI.length; h++) {
                                                if (rawI[h] == oUUID) {
                                                    selected.add(metaElements[i]);
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                                return selected.toArray(new Array());
                            }
                            else {
                                return new Array();
                            }
                        }
                        else {
                            return new Array();
                        }
                    };
                    AbstractKObject.prototype.call = function (p_operation, p_params, cb) {
                        this._manager.operationManager().call(this, p_operation, p_params, cb);
                    };
                    AbstractKObject.prototype.manager = function () {
                        return this._manager;
                    };
                    AbstractKObject.OUT_OF_CACHE_MSG = "Out of cache Error";
                    return AbstractKObject;
                })();
                abs.AbstractKObject = AbstractKObject;
                var AbstractKObjectInfer = (function (_super) {
                    __extends(AbstractKObjectInfer, _super);
                    function AbstractKObjectInfer(p_universe, p_time, p_uuid, p_metaClass, p_manager) {
                        _super.call(this, p_universe, p_time, p_uuid, p_metaClass, p_manager);
                    }
                    AbstractKObjectInfer.prototype.dependenciesResolver = function (dependencies) {
                        var _this = this;
                        return function (indexName) {
                            var dependency = _this._metaClass.dependencies().dependencyByName(indexName);
                            if (dependency != null) {
                                var single = new Array();
                                single[0] = dependencies[dependency.index()];
                                return single;
                            }
                            return null;
                        };
                    };
                    AbstractKObjectInfer.prototype.train = function (dependencies, expectedOutputs, callback) {
                        var all_dependencies = new Array(new Array());
                        all_dependencies[0] = dependencies;
                        var all_expectedOutputs = null;
                        if (expectedOutputs != null) {
                            all_expectedOutputs = new Array(new Array());
                            all_expectedOutputs[0] = expectedOutputs;
                        }
                        this.trainAll(all_dependencies, all_expectedOutputs, callback);
                    };
                    AbstractKObjectInfer.prototype.trainAll = function (p_dependencies, p_outputs, callback) {
                        var _this = this;
                        if (p_dependencies == null) {
                            throw new java.lang.RuntimeException("Dependencies are mandatory for KObjectInfer");
                        }
                        var selfObject = this;
                        var waiter = this.manager().model().defer();
                        for (var i = 0; i < p_dependencies.length; i++) {
                            if (p_dependencies[i].length != this._metaClass.dependencies().allDependencies().length) {
                                throw new java.lang.RuntimeException("Bad number of arguments for allDependencies");
                            }
                            var resolver = this.dependenciesResolver(p_dependencies[i]);
                            for (var j = 0; j < this._metaClass.inputs().length; j++) {
                                this._metaClass.inputs()[j].extractor().exec(null, resolver, waiter.wait(i + "," + j));
                            }
                        }
                        waiter.then(function (o) {
                            var extractedInputs = new Array(new Array());
                            for (var i = 0; i < p_dependencies.length; i++) {
                                for (var j = 0; j < _this._metaClass.inputs().length; j++) {
                                    try {
                                        var extracted = waiter.getResult(i + "," + j);
                                        if (extracted != null && extracted.length > 0) {
                                            extractedInputs[i][j] = extracted[0];
                                        }
                                    }
                                    catch ($ex$) {
                                        if ($ex$ instanceof java.lang.Exception) {
                                            var e = $ex$;
                                            e.printStackTrace();
                                        }
                                        else {
                                            throw $ex$;
                                        }
                                    }
                                }
                            }
                            var extractedOutputs = new Array(new Array());
                            for (var i = 0; i < p_dependencies.length; i++) {
                                for (var j = 0; j < _this._metaClass.outputs().length; j++) {
                                    var metaInferOutput = _this._metaClass.outputs()[j];
                                    var currentOutputObject = null;
                                    if (p_outputs != null) {
                                        currentOutputObject = p_outputs[i][j];
                                    }
                                    extractedOutputs[i][j] = _this.internalConvertOutput(currentOutputObject, metaInferOutput);
                                }
                            }
                            _this._metaClass.inferAlg().train(extractedInputs, extractedOutputs, selfObject);
                            if (callback != null) {
                                callback(null);
                            }
                        });
                    };
                    AbstractKObjectInfer.prototype.infer = function (dependencies, callback) {
                        var all_dependencies = new Array(new Array());
                        all_dependencies[0] = dependencies;
                        this.inferAll(all_dependencies, function (objects) {
                            if (objects != null && objects.length > 0) {
                                callback(objects[0]);
                            }
                            else {
                                callback(null);
                            }
                        });
                    };
                    AbstractKObjectInfer.prototype.inferAll = function (p_dependencies, callback) {
                        var _this = this;
                        if (p_dependencies == null) {
                            throw new java.lang.RuntimeException("Bad number of arguments for allDependencies");
                        }
                        var selfObject = this;
                        var waiter = this.manager().model().defer();
                        for (var i = 0; i < p_dependencies.length; i++) {
                            if (p_dependencies[i].length != this._metaClass.dependencies().allDependencies().length) {
                                throw new java.lang.RuntimeException("Bad number of arguments for allDependencies");
                            }
                            var resolver = this.dependenciesResolver(p_dependencies[i]);
                            for (var j = 0; j < this._metaClass.inputs().length; j++) {
                                this._metaClass.inputs()[j].extractor().exec(null, resolver, waiter.wait(i + "," + j));
                            }
                        }
                        waiter.then(function (o) {
                            var extractedInputs = new Array(new Array());
                            for (var i = 0; i < p_dependencies.length; i++) {
                                extractedInputs[i] = new Array();
                                for (var j = 0; j < _this._metaClass.inputs().length; j++) {
                                    try {
                                        var extracted = waiter.getResult(i + "," + j);
                                        if (extracted != null && extracted.length > 0) {
                                            extractedInputs[i][j] = extracted[0];
                                        }
                                    }
                                    catch ($ex$) {
                                        if ($ex$ instanceof java.lang.Exception) {
                                            var e = $ex$;
                                            e.printStackTrace();
                                        }
                                        else {
                                            throw $ex$;
                                        }
                                    }
                                }
                            }
                            var extractedOutputs = _this._metaClass.inferAlg().infer(extractedInputs, selfObject);
                            if (extractedOutputs[0].length != _this._metaClass.outputs().length) {
                                callback(null);
                            }
                            else {
                                var result = new Array(new Array());
                                for (var i = 0; i < extractedOutputs.length; i++) {
                                    result[i] = new Array();
                                    for (var j = 0; j < _this._metaClass.outputs().length; j++) {
                                        result[i][j] = _this.internalReverseOutput(extractedOutputs[i][j], _this._metaClass.outputs()[j]);
                                    }
                                }
                                callback(result);
                            }
                        });
                    };
                    AbstractKObjectInfer.prototype.resetLearning = function () {
                        throw new java.lang.RuntimeException("Not Implemented Yet!");
                    };
                    AbstractKObjectInfer.prototype.internalConvertOutput = function (output, metaOutput) {
                        if (output == null) {
                            return 0;
                        }
                        if (metaOutput.type() == org.kevoree.modeling.meta.KPrimitiveTypes.BOOL) {
                            if (output.equals(true)) {
                                return 1.0;
                            }
                            else {
                                return 0.0;
                            }
                        }
                        if (metaOutput.type() == org.kevoree.modeling.meta.KPrimitiveTypes.DOUBLE) {
                            return output;
                        }
                        if (metaOutput.type() == org.kevoree.modeling.meta.KPrimitiveTypes.INT) {
                            return output;
                        }
                        if (metaOutput.type() == org.kevoree.modeling.meta.KPrimitiveTypes.CONTINUOUS) {
                            return output;
                        }
                        if (metaOutput.type() == org.kevoree.modeling.meta.KPrimitiveTypes.LONG) {
                            return output;
                        }
                        if (metaOutput.type() == org.kevoree.modeling.meta.KPrimitiveTypes.STRING) {
                            throw new java.lang.RuntimeException("String are not managed yet");
                        }
                        if (metaOutput.type().isEnum()) {
                            var metaEnum = metaOutput.type();
                            if (output instanceof org.kevoree.modeling.meta.impl.MetaLiteral) {
                                return output.index();
                            }
                            else {
                                var literal = metaEnum.literalByName(output.toString());
                                if (literal != null) {
                                    return literal.index();
                                }
                            }
                        }
                        return 0;
                    };
                    AbstractKObjectInfer.prototype.internalReverseOutput = function (inferred, metaOutput) {
                        if (metaOutput.type() == org.kevoree.modeling.meta.KPrimitiveTypes.BOOL) {
                            if (inferred >= 0.5) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                        if (metaOutput.type() == org.kevoree.modeling.meta.KPrimitiveTypes.DOUBLE) {
                            return inferred;
                        }
                        if (metaOutput.type() == org.kevoree.modeling.meta.KPrimitiveTypes.INT) {
                            return inferred;
                        }
                        if (metaOutput.type() == org.kevoree.modeling.meta.KPrimitiveTypes.CONTINUOUS) {
                            return inferred;
                        }
                        if (metaOutput.type() == org.kevoree.modeling.meta.KPrimitiveTypes.LONG) {
                            return inferred;
                        }
                        if (metaOutput.type() == org.kevoree.modeling.meta.KPrimitiveTypes.STRING) {
                            throw new java.lang.RuntimeException("String are not managed yet");
                        }
                        if (metaOutput.type().isEnum()) {
                            var ceiledInferred = this.math_ceil(inferred);
                            var metaEnum = metaOutput.type();
                            return metaEnum.literal(ceiledInferred);
                        }
                        return null;
                    };
                    AbstractKObjectInfer.prototype.math_ceil = function (toCeilValue) {
                        return Math.round(toCeilValue);
                    };
                    return AbstractKObjectInfer;
                })(org.kevoree.modeling.abs.AbstractKObject);
                abs.AbstractKObjectInfer = AbstractKObjectInfer;
                var AbstractKUniverse = (function () {
                    function AbstractKUniverse(p_key, p_manager) {
                        this._universe = p_key;
                        this._manager = p_manager;
                    }
                    AbstractKUniverse.prototype.key = function () {
                        return this._universe;
                    };
                    AbstractKUniverse.prototype.model = function () {
                        return this._manager.model();
                    };
                    AbstractKUniverse.prototype.delete = function (cb) {
                        this.model().manager().delete(this, cb);
                    };
                    AbstractKUniverse.prototype.time = function (timePoint) {
                        if (timePoint <= org.kevoree.modeling.KConfig.END_OF_TIME && timePoint >= org.kevoree.modeling.KConfig.BEGINNING_OF_TIME) {
                            return this.internal_create(timePoint);
                        }
                        else {
                            throw new java.lang.RuntimeException("The selected Time " + timePoint + " is out of the range of KMF managed time");
                        }
                    };
                    AbstractKUniverse.prototype.internal_create = function (timePoint) {
                        throw "Abstract method";
                    };
                    AbstractKUniverse.prototype.equals = function (obj) {
                        if (!(obj instanceof org.kevoree.modeling.abs.AbstractKUniverse)) {
                            return false;
                        }
                        else {
                            var casted = obj;
                            return casted._universe == this._universe;
                        }
                    };
                    AbstractKUniverse.prototype.origin = function () {
                        return this._manager.model().universe(this._manager.parentUniverseKey(this._universe));
                    };
                    AbstractKUniverse.prototype.diverge = function () {
                        var casted = this._manager.model();
                        var nextKey = this._manager.nextUniverseKey();
                        var newUniverse = casted.internalCreateUniverse(nextKey);
                        this._manager.initUniverse(newUniverse, this);
                        return newUniverse;
                    };
                    AbstractKUniverse.prototype.descendants = function () {
                        var descendentsKey = this._manager.descendantsUniverseKeys(this._universe);
                        var childs = new java.util.ArrayList();
                        for (var i = 0; i < descendentsKey.length; i++) {
                            childs.add(this._manager.model().universe(descendentsKey[i]));
                        }
                        return childs;
                    };
                    AbstractKUniverse.prototype.lookupAllTimes = function (uuid, times, cb) {
                        throw new java.lang.RuntimeException("Not implemented Yet !");
                    };
                    AbstractKUniverse.prototype.listenAll = function (groupId, objects, multiListener) {
                        this.model().manager().cdn().registerMultiListener(groupId, this, objects, multiListener);
                    };
                    return AbstractKUniverse;
                })();
                abs.AbstractKUniverse = AbstractKUniverse;
                var AbstractKView = (function () {
                    function AbstractKView(p_universe, _time, p_manager) {
                        this._universe = p_universe;
                        this._time = _time;
                        this._manager = p_manager;
                    }
                    AbstractKView.prototype.now = function () {
                        return this._time;
                    };
                    AbstractKView.prototype.universe = function () {
                        return this._universe;
                    };
                    AbstractKView.prototype.setRoot = function (elem, cb) {
                        this._manager.setRoot(elem, cb);
                    };
                    AbstractKView.prototype.getRoot = function (cb) {
                        this._manager.getRoot(this._universe, this._time, cb);
                    };
                    AbstractKView.prototype.select = function (query, cb) {
                        if (org.kevoree.modeling.util.Checker.isDefined(cb)) {
                            if (query == null || query.length == 0) {
                                cb(new Array());
                            }
                            else {
                                this._manager.getRoot(this._universe, this._time, function (rootObj) {
                                    if (rootObj == null) {
                                        cb(new Array());
                                    }
                                    else {
                                        var singleRoot = new Array();
                                        singleRoot[0] = rootObj;
                                        org.kevoree.modeling.traversal.query.impl.QueryEngine.getINSTANCE().eval(query, singleRoot, cb);
                                    }
                                });
                            }
                        }
                    };
                    AbstractKView.prototype.lookup = function (kid, cb) {
                        this._manager.lookup(this._universe, this._time, kid, cb);
                    };
                    AbstractKView.prototype.lookupAll = function (keys, cb) {
                        this._manager.lookupAllObjects(this._universe, this._time, keys, cb);
                    };
                    AbstractKView.prototype.create = function (clazz) {
                        return this._manager.model().create(clazz, this._universe, this._time);
                    };
                    AbstractKView.prototype.createByName = function (metaClassName) {
                        return this.create(this._manager.model().metaModel().metaClassByName(metaClassName));
                    };
                    AbstractKView.prototype.json = function () {
                        return new org.kevoree.modeling.format.json.JsonFormat(this._universe, this._time, this._manager);
                    };
                    AbstractKView.prototype.xmi = function () {
                        return new org.kevoree.modeling.format.xmi.XmiFormat(this._universe, this._time, this._manager);
                    };
                    AbstractKView.prototype.equals = function (obj) {
                        if (!org.kevoree.modeling.util.Checker.isDefined(obj)) {
                            return false;
                        }
                        if (!(obj instanceof org.kevoree.modeling.abs.AbstractKView)) {
                            return false;
                        }
                        else {
                            var casted = obj;
                            return casted._time == this._time && casted._universe == this._universe;
                        }
                    };
                    return AbstractKView;
                })();
                abs.AbstractKView = AbstractKView;
                var AbstractTimeWalker = (function () {
                    function AbstractTimeWalker(p_origin) {
                        this._origin = null;
                        this._origin = p_origin;
                    }
                    AbstractTimeWalker.prototype.internal_times = function (start, end, cb) {
                        var _this = this;
                        var keys = new Array();
                        keys[0] = org.kevoree.modeling.KContentKey.createGlobalUniverseTree();
                        keys[1] = org.kevoree.modeling.KContentKey.createUniverseTree(this._origin.uuid());
                        var manager = this._origin._manager;
                        manager.bumpKeysToCache(keys, function (kMemoryElements) {
                            var objUniverse = kMemoryElements[1];
                            if (kMemoryElements[0] == null || kMemoryElements[1] == null) {
                                cb(null);
                            }
                            else {
                                var collectedUniverse = org.kevoree.modeling.memory.manager.impl.ResolutionHelper.universeSelectByRange(kMemoryElements[0], kMemoryElements[1], start, end, _this._origin.universe());
                                var timeTreeToLoad = new Array();
                                for (var i = 0; i < collectedUniverse.length; i++) {
                                    timeTreeToLoad[i] = org.kevoree.modeling.KContentKey.createTimeTree(collectedUniverse[i], _this._origin.uuid());
                                }
                                manager.bumpKeysToCache(timeTreeToLoad, function (timeTrees) {
                                    var collector = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                    var previousDivergenceTime = end;
                                    for (var i = 0; i < collectedUniverse.length; i++) {
                                        var timeTree = timeTrees[i];
                                        if (timeTree != null) {
                                            var currentDivergenceTime = objUniverse.get(collectedUniverse[i]);
                                            var finalPreviousDivergenceTime = previousDivergenceTime;
                                            timeTree.range(currentDivergenceTime, previousDivergenceTime, function (t) {
                                                if (collector.size() == 0) {
                                                    collector.put(collector.size(), t);
                                                }
                                                else {
                                                    if (t != finalPreviousDivergenceTime) {
                                                        collector.put(collector.size(), t);
                                                    }
                                                }
                                            });
                                            previousDivergenceTime = currentDivergenceTime;
                                        }
                                    }
                                    var orderedTime = new Array();
                                    for (var i = 0; i < collector.size(); i++) {
                                        orderedTime[i] = collector.get(i);
                                    }
                                    cb(orderedTime);
                                });
                            }
                        });
                    };
                    AbstractTimeWalker.prototype.allTimes = function (cb) {
                        this.internal_times(org.kevoree.modeling.KConfig.BEGINNING_OF_TIME, org.kevoree.modeling.KConfig.END_OF_TIME, cb);
                    };
                    AbstractTimeWalker.prototype.timesBefore = function (endOfSearch, cb) {
                        this.internal_times(org.kevoree.modeling.KConfig.BEGINNING_OF_TIME, endOfSearch, cb);
                    };
                    AbstractTimeWalker.prototype.timesAfter = function (beginningOfSearch, cb) {
                        this.internal_times(beginningOfSearch, org.kevoree.modeling.KConfig.END_OF_TIME, cb);
                    };
                    AbstractTimeWalker.prototype.timesBetween = function (beginningOfSearch, endOfSearch, cb) {
                        this.internal_times(beginningOfSearch, endOfSearch, cb);
                    };
                    return AbstractTimeWalker;
                })();
                abs.AbstractTimeWalker = AbstractTimeWalker;
            })(abs = modeling.abs || (modeling.abs = {}));
            var cdn;
            (function (cdn) {
                var impl;
                (function (impl) {
                    var ContentPutRequest = (function () {
                        function ContentPutRequest(requestSize) {
                            this._size = 0;
                            this._content = new Array();
                        }
                        ContentPutRequest.prototype.put = function (p_key, p_payload) {
                            var newLine = new Array();
                            newLine[ContentPutRequest.KEY_INDEX] = p_key;
                            newLine[ContentPutRequest.CONTENT_INDEX] = p_payload;
                            this._content[this._size] = newLine;
                            this._size = this._size + 1;
                        };
                        ContentPutRequest.prototype.getKey = function (index) {
                            if (index < this._content.length) {
                                return this._content[index][0];
                            }
                            else {
                                return null;
                            }
                        };
                        ContentPutRequest.prototype.getContent = function (index) {
                            if (index < this._content.length) {
                                return this._content[index][1];
                            }
                            else {
                                return null;
                            }
                        };
                        ContentPutRequest.prototype.size = function () {
                            return this._size;
                        };
                        ContentPutRequest.KEY_INDEX = 0;
                        ContentPutRequest.CONTENT_INDEX = 1;
                        ContentPutRequest.SIZE_INDEX = 2;
                        return ContentPutRequest;
                    })();
                    impl.ContentPutRequest = ContentPutRequest;
                    var MemoryContentDeliveryDriver = (function () {
                        function MemoryContentDeliveryDriver() {
                            this.backend = new org.kevoree.modeling.memory.struct.map.impl.ArrayStringMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                            this._localEventListeners = new org.kevoree.modeling.event.impl.LocalEventListeners();
                            this.additionalInterceptors = null;
                        }
                        MemoryContentDeliveryDriver.prototype.atomicGetIncrement = function (key, cb) {
                            var result = this.backend.get(key.toString());
                            var nextV;
                            var previousV;
                            if (result != null) {
                                try {
                                    previousV = java.lang.Short.parseShort(result);
                                }
                                catch ($ex$) {
                                    if ($ex$ instanceof java.lang.Exception) {
                                        var e = $ex$;
                                        e.printStackTrace();
                                        previousV = java.lang.Short.MIN_VALUE;
                                    }
                                    else {
                                        throw $ex$;
                                    }
                                }
                            }
                            else {
                                previousV = 0;
                            }
                            if (previousV == java.lang.Short.MAX_VALUE) {
                                nextV = java.lang.Short.MIN_VALUE;
                            }
                            else {
                                nextV = (previousV + 1);
                            }
                            this.backend.put(key.toString(), "" + nextV);
                            cb(previousV);
                        };
                        MemoryContentDeliveryDriver.prototype.get = function (keys, callback) {
                            var values = new Array();
                            for (var i = 0; i < keys.length; i++) {
                                if (keys[i] != null) {
                                    values[i] = this.backend.get(keys[i].toString());
                                }
                                if (MemoryContentDeliveryDriver.DEBUG) {
                                    System.out.println("GET " + keys[i] + "->" + values[i]);
                                }
                            }
                            if (callback != null) {
                                callback(values);
                            }
                        };
                        MemoryContentDeliveryDriver.prototype.put = function (p_request, p_callback) {
                            for (var i = 0; i < p_request.size(); i++) {
                                this.backend.put(p_request.getKey(i).toString(), p_request.getContent(i));
                                if (MemoryContentDeliveryDriver.DEBUG) {
                                    System.out.println("PUT " + p_request.getKey(i).toString() + "->" + p_request.getContent(i));
                                }
                            }
                            if (p_callback != null) {
                                p_callback(null);
                            }
                        };
                        MemoryContentDeliveryDriver.prototype.remove = function (keys, callback) {
                            for (var i = 0; i < keys.length; i++) {
                                this.backend.remove(keys[i]);
                            }
                            if (callback != null) {
                                callback(null);
                            }
                        };
                        MemoryContentDeliveryDriver.prototype.connect = function (callback) {
                            if (callback != null) {
                                callback(null);
                            }
                        };
                        MemoryContentDeliveryDriver.prototype.close = function (callback) {
                            this._localEventListeners.clear();
                            this.backend.clear();
                            callback(null);
                        };
                        MemoryContentDeliveryDriver.prototype.registerListener = function (groupId, p_origin, p_listener) {
                            this._localEventListeners.registerListener(groupId, p_origin, p_listener);
                        };
                        MemoryContentDeliveryDriver.prototype.unregisterGroup = function (groupId) {
                            this._localEventListeners.unregister(groupId);
                        };
                        MemoryContentDeliveryDriver.prototype.registerMultiListener = function (groupId, origin, objects, listener) {
                            this._localEventListeners.registerListenerAll(groupId, origin.key(), objects, listener);
                        };
                        MemoryContentDeliveryDriver.prototype.send = function (msgs) {
                            if (this.additionalInterceptors != null) {
                                this.additionalInterceptors.each(function (key, value) {
                                    if (value != null) {
                                        if (value(msgs)) {
                                            return;
                                        }
                                    }
                                });
                            }
                            this._localEventListeners.dispatch(msgs);
                        };
                        MemoryContentDeliveryDriver.prototype.randomInterceptorID = function () {
                            return Math.random();
                        };
                        MemoryContentDeliveryDriver.prototype.addMessageInterceptor = function (p_interceptor) {
                            if (this.additionalInterceptors == null) {
                                this.additionalInterceptors = new org.kevoree.modeling.memory.struct.map.impl.ArrayIntMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                            }
                            var newID = this.randomInterceptorID();
                            this.additionalInterceptors.put(newID, p_interceptor);
                            return newID;
                        };
                        MemoryContentDeliveryDriver.prototype.removeMessageInterceptor = function (id) {
                            if (this.additionalInterceptors != null) {
                                this.additionalInterceptors.remove(id);
                            }
                        };
                        MemoryContentDeliveryDriver.prototype.setManager = function (manager) {
                            this._localEventListeners.setManager(manager);
                        };
                        MemoryContentDeliveryDriver.DEBUG = false;
                        return MemoryContentDeliveryDriver;
                    })();
                    impl.MemoryContentDeliveryDriver = MemoryContentDeliveryDriver;
                })(impl = cdn.impl || (cdn.impl = {}));
            })(cdn = modeling.cdn || (modeling.cdn = {}));
            var defer;
            (function (defer) {
                var impl;
                (function (impl) {
                    var Defer = (function () {
                        function Defer() {
                            this._isDone = false;
                            this._isReady = false;
                            this._nbRecResult = 0;
                            this._nbExpectedResult = 0;
                            this._nextTasks = null;
                            this._results = null;
                            this._thenCB = null;
                            this._results = new org.kevoree.modeling.memory.struct.map.impl.ArrayStringMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                        }
                        Defer.prototype.setDoneOrRegister = function (next) {
                            if (next != null) {
                                if (this._nextTasks == null) {
                                    this._nextTasks = new java.util.ArrayList();
                                }
                                this._nextTasks.add(next);
                                return this._isDone;
                            }
                            else {
                                this._isDone = true;
                                if (this._nextTasks != null) {
                                    for (var i = 0; i < this._nextTasks.size(); i++) {
                                        this._nextTasks.get(i).informParentEnd(this);
                                    }
                                }
                                return this._isDone;
                            }
                        };
                        Defer.prototype.equals = function (obj) {
                            return obj == this;
                        };
                        Defer.prototype.informParentEnd = function (end) {
                            if (end == null) {
                                this._nbRecResult = this._nbRecResult + this._nbExpectedResult;
                            }
                            else {
                                if (end != this) {
                                    this._nbRecResult--;
                                }
                            }
                            if (this._nbRecResult == 0 && this._isReady) {
                                this.setDoneOrRegister(null);
                                if (this._thenCB != null) {
                                    this._thenCB(null);
                                }
                            }
                        };
                        Defer.prototype.waitDefer = function (p_previous) {
                            if (p_previous != this) {
                                if (!p_previous.setDoneOrRegister(this)) {
                                    this._nbExpectedResult++;
                                }
                            }
                            return this;
                        };
                        Defer.prototype.next = function () {
                            var nextTask = new org.kevoree.modeling.defer.impl.Defer();
                            nextTask.waitDefer(this);
                            return nextTask;
                        };
                        Defer.prototype.wait = function (resultName) {
                            var _this = this;
                            return function (o) {
                                _this._results.put(resultName, o);
                            };
                        };
                        Defer.prototype.isDone = function () {
                            return this._isDone;
                        };
                        Defer.prototype.getResult = function (resultName) {
                            if (this._isDone) {
                                return this._results.get(resultName);
                            }
                            else {
                                throw new java.lang.Exception("Task is not executed yet !");
                            }
                        };
                        Defer.prototype.then = function (cb) {
                            this._thenCB = cb;
                            this._isReady = true;
                            this.informParentEnd(null);
                        };
                        return Defer;
                    })();
                    impl.Defer = Defer;
                })(impl = defer.impl || (defer.impl = {}));
            })(defer = modeling.defer || (modeling.defer = {}));
            var event;
            (function (event) {
                var impl;
                (function (impl) {
                    var LocalEventListeners = (function () {
                        function LocalEventListeners() {
                            this._internalListenerKeyGen = new org.kevoree.modeling.memory.manager.impl.KeyCalculator(0, 0);
                            this._simpleListener = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                            this._multiListener = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                            this._obj2Listener = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                            this._listener2Object = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                            this._listener2Objects = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                            this._group2Listener = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                        }
                        LocalEventListeners.prototype.registerListener = function (groupId, origin, listener) {
                            var generateNewID = this._internalListenerKeyGen.nextKey();
                            this._simpleListener.put(generateNewID, listener);
                            this._listener2Object.put(generateNewID, origin.universe());
                            var subLayer = this._obj2Listener.get(origin.uuid());
                            if (subLayer == null) {
                                subLayer = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                this._obj2Listener.put(origin.uuid(), subLayer);
                            }
                            subLayer.put(generateNewID, origin.universe());
                            subLayer = this._group2Listener.get(groupId);
                            if (subLayer == null) {
                                subLayer = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                this._group2Listener.put(groupId, subLayer);
                            }
                            subLayer.put(generateNewID, 1);
                        };
                        LocalEventListeners.prototype.registerListenerAll = function (groupId, universe, objects, listener) {
                            var generateNewID = this._internalListenerKeyGen.nextKey();
                            this._multiListener.put(generateNewID, listener);
                            this._listener2Objects.put(generateNewID, objects);
                            var subLayer;
                            for (var i = 0; i < objects.length; i++) {
                                subLayer = this._obj2Listener.get(objects[i]);
                                if (subLayer == null) {
                                    subLayer = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                    this._obj2Listener.put(objects[i], subLayer);
                                }
                                subLayer.put(generateNewID, universe);
                            }
                            subLayer = this._group2Listener.get(groupId);
                            if (subLayer == null) {
                                subLayer = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                this._group2Listener.put(groupId, subLayer);
                            }
                            subLayer.put(generateNewID, 2);
                        };
                        LocalEventListeners.prototype.unregister = function (groupId) {
                            var _this = this;
                            var groupLayer = this._group2Listener.get(groupId);
                            if (groupLayer != null) {
                                groupLayer.each(function (listenerID, value) {
                                    if (value == 1) {
                                        _this._simpleListener.remove(listenerID);
                                        var previousObject = _this._listener2Object.get(listenerID);
                                        _this._listener2Object.remove(listenerID);
                                        var _obj2ListenerLayer = _this._obj2Listener.get(previousObject);
                                        if (_obj2ListenerLayer != null) {
                                            _obj2ListenerLayer.remove(listenerID);
                                        }
                                    }
                                    else {
                                        _this._multiListener.remove(listenerID);
                                        var previousObjects = _this._listener2Objects.get(listenerID);
                                        for (var i = 0; i < previousObjects.length; i++) {
                                            var _obj2ListenerLayer = _this._obj2Listener.get(previousObjects[i]);
                                            if (_obj2ListenerLayer != null) {
                                                _obj2ListenerLayer.remove(listenerID);
                                            }
                                        }
                                        _this._listener2Objects.remove(listenerID);
                                    }
                                });
                                this._group2Listener.remove(groupId);
                            }
                        };
                        LocalEventListeners.prototype.clear = function () {
                            this._simpleListener.clear();
                            this._multiListener.clear();
                            this._obj2Listener.clear();
                            this._group2Listener.clear();
                            this._listener2Object.clear();
                            this._listener2Objects.clear();
                        };
                        LocalEventListeners.prototype.setManager = function (manager) {
                            this._manager = manager;
                        };
                        LocalEventListeners.prototype.dispatch = function (param) {
                            var _this = this;
                            if (this._manager != null) {
                                var _cacheUniverse = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                if (param instanceof org.kevoree.modeling.message.impl.Events) {
                                    var messages = param;
                                    var toLoad = new Array();
                                    var multiCounters = new Array();
                                    for (var i = 0; i < messages.size(); i++) {
                                        var loopKey = messages.getKey(i);
                                        var listeners = this._obj2Listener.get(loopKey.obj);
                                        var isSelect = [false];
                                        if (listeners != null) {
                                            listeners.each(function (listenerKey, universeKey) {
                                                if (universeKey == loopKey.universe) {
                                                    isSelect[0] = true;
                                                    if (_this._multiListener.contains(listenerKey)) {
                                                        if (multiCounters[0] == null) {
                                                            multiCounters[0] = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                                        }
                                                        var previous = 0;
                                                        if (multiCounters[0].contains(listenerKey)) {
                                                            previous = multiCounters[0].get(listenerKey);
                                                        }
                                                        previous++;
                                                        multiCounters[0].put(listenerKey, previous);
                                                    }
                                                }
                                            });
                                        }
                                        if (isSelect[0]) {
                                            toLoad[i] = loopKey;
                                        }
                                    }
                                    this._manager.bumpKeysToCache(toLoad, function (kMemoryElements) {
                                        var multiObjectSets = new Array();
                                        var multiObjectIndexes = new Array();
                                        if (multiCounters[0] != null) {
                                            multiObjectSets[0] = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                            multiObjectIndexes[0] = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                            multiCounters[0].each(function (listenerKey, value) {
                                                multiObjectSets[0].put(listenerKey, new Array());
                                                multiObjectIndexes[0].put(listenerKey, 0);
                                            });
                                        }
                                        var listeners;
                                        for (var i = 0; i < messages.size(); i++) {
                                            if (kMemoryElements[i] != null && kMemoryElements[i] instanceof org.kevoree.modeling.memory.struct.segment.impl.HeapMemorySegment) {
                                                var correspondingKey = toLoad[i];
                                                listeners = _this._obj2Listener.get(correspondingKey.obj);
                                                if (listeners != null) {
                                                    var cachedUniverse = _cacheUniverse.get(correspondingKey.universe);
                                                    if (cachedUniverse == null) {
                                                        cachedUniverse = _this._manager.model().universe(correspondingKey.universe);
                                                        _cacheUniverse.put(correspondingKey.universe, cachedUniverse);
                                                    }
                                                    var segment = kMemoryElements[i];
                                                    var toDispatch = _this._manager.model().createProxy(correspondingKey.universe, correspondingKey.time, correspondingKey.obj, _this._manager.model().metaModel().metaClasses()[segment.metaClassIndex()]);
                                                    if (toDispatch != null) {
                                                        kMemoryElements[i].inc();
                                                    }
                                                    var meta = new Array();
                                                    for (var j = 0; j < messages.getIndexes(i).length; j++) {
                                                        meta[j] = toDispatch.metaClass().meta(messages.getIndexes(i)[j]);
                                                    }
                                                    listeners.each(function (listenerKey, value) {
                                                        var listener = _this._simpleListener.get(listenerKey);
                                                        if (listener != null) {
                                                            listener(toDispatch, meta);
                                                        }
                                                        else {
                                                            var multiListener = _this._multiListener.get(listenerKey);
                                                            if (multiListener != null) {
                                                                if (multiObjectSets[0] != null && multiObjectIndexes[0] != null) {
                                                                    var index = multiObjectIndexes[0].get(listenerKey);
                                                                    multiObjectSets[0].get(listenerKey)[index] = toDispatch;
                                                                    index = index + 1;
                                                                    multiObjectIndexes[0].put(listenerKey, index);
                                                                }
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                        if (multiObjectSets[0] != null) {
                                            multiObjectSets[0].each(function (key, value) {
                                                var multiListener = _this._multiListener.get(key);
                                                if (multiListener != null) {
                                                    multiListener(value);
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        };
                        return LocalEventListeners;
                    })();
                    impl.LocalEventListeners = LocalEventListeners;
                })(impl = event.impl || (event.impl = {}));
            })(event = modeling.event || (modeling.event = {}));
            var extrapolation;
            (function (extrapolation) {
                var impl;
                (function (impl) {
                    var DiscreteExtrapolation = (function () {
                        function DiscreteExtrapolation() {
                        }
                        DiscreteExtrapolation.instance = function () {
                            if (DiscreteExtrapolation.INSTANCE == null) {
                                DiscreteExtrapolation.INSTANCE = new org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation();
                            }
                            return DiscreteExtrapolation.INSTANCE;
                        };
                        DiscreteExtrapolation.prototype.extrapolate = function (current, attribute) {
                            var payload = current._manager.segment(current.universe(), current.now(), current.uuid(), true, current.metaClass(), null);
                            if (payload != null) {
                                if (attribute.attributeType().isEnum()) {
                                    return attribute.attributeType().literal(payload.get(attribute.index(), current.metaClass()));
                                }
                                else {
                                    return payload.get(attribute.index(), current.metaClass());
                                }
                            }
                            else {
                                return null;
                            }
                        };
                        DiscreteExtrapolation.prototype.mutate = function (current, attribute, payload) {
                            var internalPayload = current._manager.segment(current.universe(), current.now(), current.uuid(), false, current.metaClass(), null);
                            if (internalPayload != null) {
                                if (attribute.attributeType().isEnum()) {
                                    if (payload instanceof org.kevoree.modeling.meta.impl.MetaLiteral) {
                                        internalPayload.set(attribute.index(), payload.index(), current.metaClass());
                                    }
                                    else {
                                        var metaEnum = attribute.attributeType();
                                        var foundLiteral = metaEnum.literalByName(payload.toString());
                                        if (foundLiteral != null) {
                                            internalPayload.set(attribute.index(), foundLiteral.index(), current.metaClass());
                                        }
                                    }
                                }
                                else {
                                    if (payload == null) {
                                        internalPayload.set(attribute.index(), null, current.metaClass());
                                    }
                                    else {
                                        internalPayload.set(attribute.index(), this.convert(attribute, payload), current.metaClass());
                                    }
                                }
                            }
                        };
                        DiscreteExtrapolation.prototype.convert = function (attribute, payload) {
                            return payload;
                        };
                        return DiscreteExtrapolation;
                    })();
                    impl.DiscreteExtrapolation = DiscreteExtrapolation;
                    var PolynomialExtrapolation = (function () {
                        function PolynomialExtrapolation() {
                        }
                        PolynomialExtrapolation.prototype.extrapolate = function (current, attribute) {
                            var trace = new org.kevoree.modeling.memory.manager.impl.MemorySegmentResolutionTrace();
                            var raw = current._manager.segment(current.universe(), current.now(), current.uuid(), true, current.metaClass(), trace);
                            if (raw != null) {
                                var extrapolatedValue = this.extrapolateValue(raw, current.metaClass(), attribute.index(), current.now(), trace.getTime());
                                if (attribute.attributeType() == org.kevoree.modeling.meta.KPrimitiveTypes.CONTINUOUS || attribute.attributeType() == org.kevoree.modeling.meta.KPrimitiveTypes.DOUBLE) {
                                    return extrapolatedValue;
                                }
                                else {
                                    if (attribute.attributeType() == org.kevoree.modeling.meta.KPrimitiveTypes.LONG) {
                                        return extrapolatedValue.longValue();
                                    }
                                    else {
                                        if (attribute.attributeType() == org.kevoree.modeling.meta.KPrimitiveTypes.INT) {
                                            return extrapolatedValue.intValue();
                                        }
                                        else {
                                            return null;
                                        }
                                    }
                                }
                            }
                            else {
                                return null;
                            }
                        };
                        PolynomialExtrapolation.prototype.extrapolateValue = function (segment, meta, index, time, timeOrigin) {
                            if (segment.getInferSize(index, meta) == 0) {
                                return 0.0;
                            }
                            var result = 0;
                            var power = 1;
                            var inferSTEP = segment.getInferElem(index, PolynomialExtrapolation.STEP, meta);
                            if (inferSTEP == 0) {
                                return segment.getInferElem(index, PolynomialExtrapolation.WEIGHTS, meta);
                            }
                            var t = (time - timeOrigin) / inferSTEP;
                            for (var j = 0; j <= segment.getInferElem(index, PolynomialExtrapolation.DEGREE, meta); j++) {
                                result += segment.getInferElem(index, (j + PolynomialExtrapolation.WEIGHTS), meta) * power;
                                power = power * t;
                            }
                            return result;
                        };
                        PolynomialExtrapolation.prototype.maxErr = function (precision, degree) {
                            var tol = precision;
                            tol = precision / Math.pow(2, degree + 0.5);
                            return tol;
                        };
                        PolynomialExtrapolation.prototype.insert = function (time, value, timeOrigin, raw, index, precision, metaClass) {
                            if (raw.getInferSize(index, metaClass) == 0) {
                                this.initial_feed(time, value, raw, index, metaClass);
                                return true;
                            }
                            if (raw.getInferElem(index, PolynomialExtrapolation.NUMSAMPLES, metaClass) == 1) {
                                raw.setInferElem(index, PolynomialExtrapolation.STEP, (time - timeOrigin), metaClass);
                            }
                            var deg = raw.getInferElem(index, PolynomialExtrapolation.DEGREE, metaClass);
                            var num = raw.getInferElem(index, PolynomialExtrapolation.NUMSAMPLES, metaClass);
                            var maxError = this.maxErr(precision, deg);
                            if (Math.abs(this.extrapolateValue(raw, metaClass, index, time, timeOrigin) - value) <= maxError) {
                                var nexNumSamples = raw.getInferElem(index, PolynomialExtrapolation.NUMSAMPLES, metaClass) + 1;
                                raw.setInferElem(index, PolynomialExtrapolation.NUMSAMPLES, nexNumSamples, metaClass);
                                raw.setInferElem(index, PolynomialExtrapolation.LASTTIME, time - timeOrigin, metaClass);
                                return true;
                            }
                            var newMaxDegree = Math.min(num, PolynomialExtrapolation._maxDegree);
                            if (deg < newMaxDegree) {
                                deg++;
                                var ss = Math.min(deg * 2, num);
                                var times = new Array();
                                var values = new Array();
                                for (var i = 0; i < ss; i++) {
                                    times[i] = (i * num * (raw.getInferElem(index, PolynomialExtrapolation.LASTTIME, metaClass)) / (ss * raw.getInferElem(index, PolynomialExtrapolation.STEP, metaClass)));
                                    values[i] = this.internal_extrapolate(times[i], raw, index, metaClass);
                                }
                                times[ss] = (time - timeOrigin) / raw.getInferElem(index, PolynomialExtrapolation.STEP, metaClass);
                                values[ss] = value;
                                var pf = new org.kevoree.modeling.util.maths.PolynomialFit(deg);
                                pf.fit(times, values);
                                if (this.tempError(pf.getCoef(), times, values) <= maxError) {
                                    raw.extendInfer(index, (raw.getInferSize(index, metaClass) + 1), metaClass);
                                    for (var i = 0; i < pf.getCoef().length; i++) {
                                        raw.setInferElem(index, i + PolynomialExtrapolation.WEIGHTS, pf.getCoef()[i], metaClass);
                                    }
                                    raw.setInferElem(index, PolynomialExtrapolation.DEGREE, deg, metaClass);
                                    raw.setInferElem(index, PolynomialExtrapolation.NUMSAMPLES, num + 1, metaClass);
                                    raw.setInferElem(index, PolynomialExtrapolation.LASTTIME, time - timeOrigin, metaClass);
                                    return true;
                                }
                            }
                            return false;
                        };
                        PolynomialExtrapolation.prototype.tempError = function (computedWeights, times, values) {
                            var maxErr = 0;
                            var temp;
                            var ds;
                            for (var i = 0; i < times.length; i++) {
                                temp = Math.abs(values[i] - org.kevoree.modeling.util.maths.PolynomialFit.extrapolate(times[i], computedWeights));
                                if (temp > maxErr) {
                                    maxErr = temp;
                                }
                            }
                            return maxErr;
                        };
                        PolynomialExtrapolation.prototype.internal_extrapolate = function (t, raw, index, metaClass) {
                            var result = 0;
                            var power = 1;
                            if (raw.getInferElem(index, PolynomialExtrapolation.STEP, metaClass) == 0) {
                                return raw.getInferElem(index, PolynomialExtrapolation.WEIGHTS, metaClass);
                            }
                            for (var j = 0; j <= raw.getInferElem(index, PolynomialExtrapolation.DEGREE, metaClass); j++) {
                                result += raw.getInferElem(index, (j + PolynomialExtrapolation.WEIGHTS), metaClass) * power;
                                power = power * t;
                            }
                            return result;
                        };
                        PolynomialExtrapolation.prototype.initial_feed = function (time, value, raw, index, metaClass) {
                            raw.extendInfer(index, PolynomialExtrapolation.WEIGHTS + 1, metaClass);
                            raw.setInferElem(index, PolynomialExtrapolation.DEGREE, 0, metaClass);
                            raw.setInferElem(index, PolynomialExtrapolation.NUMSAMPLES, 1, metaClass);
                            raw.setInferElem(index, PolynomialExtrapolation.LASTTIME, 0, metaClass);
                            raw.setInferElem(index, PolynomialExtrapolation.STEP, 0, metaClass);
                            raw.setInferElem(index, PolynomialExtrapolation.WEIGHTS, value, metaClass);
                        };
                        PolynomialExtrapolation.prototype.mutate = function (current, attribute, payload) {
                            var trace = new org.kevoree.modeling.memory.manager.impl.MemorySegmentResolutionTrace();
                            var raw = current.manager().segment(current.universe(), current.now(), current.uuid(), true, current.metaClass(), trace);
                            if (raw.getInferSize(attribute.index(), current.metaClass()) == 0) {
                                raw = current.manager().segment(current.universe(), current.now(), current.uuid(), false, current.metaClass(), null);
                            }
                            if (!this.insert(current.now(), this.castNumber(payload), trace.getTime(), raw, attribute.index(), attribute.precision(), current.metaClass())) {
                                var prevTime = raw.getInferElem(attribute.index(), PolynomialExtrapolation.LASTTIME, current.metaClass()) + trace.getTime();
                                var val = this.extrapolateValue(raw, current.metaClass(), attribute.index(), prevTime, trace.getTime());
                                var newSegment = current.manager().segment(current.universe(), prevTime, current.uuid(), false, current.metaClass(), null);
                                this.insert(prevTime, val, prevTime, newSegment, attribute.index(), attribute.precision(), current.metaClass());
                                this.insert(current.now(), this.castNumber(payload), prevTime, newSegment, attribute.index(), attribute.precision(), current.metaClass());
                            }
                        };
                        PolynomialExtrapolation.prototype.castNumber = function (payload) {
                            return +payload;
                        };
                        PolynomialExtrapolation.instance = function () {
                            if (PolynomialExtrapolation.INSTANCE == null) {
                                PolynomialExtrapolation.INSTANCE = new org.kevoree.modeling.extrapolation.impl.PolynomialExtrapolation();
                            }
                            return PolynomialExtrapolation.INSTANCE;
                        };
                        PolynomialExtrapolation._maxDegree = 20;
                        PolynomialExtrapolation.DEGREE = 0;
                        PolynomialExtrapolation.NUMSAMPLES = 1;
                        PolynomialExtrapolation.STEP = 2;
                        PolynomialExtrapolation.LASTTIME = 3;
                        PolynomialExtrapolation.WEIGHTS = 4;
                        return PolynomialExtrapolation;
                    })();
                    impl.PolynomialExtrapolation = PolynomialExtrapolation;
                })(impl = extrapolation.impl || (extrapolation.impl = {}));
            })(extrapolation = modeling.extrapolation || (modeling.extrapolation = {}));
            var format;
            (function (format) {
                var json;
                (function (json) {
                    var JsonFormat = (function () {
                        function JsonFormat(p_universe, p_time, p_manager) {
                            this._manager = p_manager;
                            this._universe = p_universe;
                            this._time = p_time;
                        }
                        JsonFormat.prototype.save = function (model, cb) {
                            if (org.kevoree.modeling.util.Checker.isDefined(model) && org.kevoree.modeling.util.Checker.isDefined(cb)) {
                                org.kevoree.modeling.format.json.JsonModelSerializer.serialize(model, cb);
                            }
                            else {
                                throw new java.lang.RuntimeException(JsonFormat.NULL_PARAM_MSG);
                            }
                        };
                        JsonFormat.prototype.saveRoot = function (cb) {
                            if (org.kevoree.modeling.util.Checker.isDefined(cb)) {
                                this._manager.getRoot(this._universe, this._time, function (root) {
                                    if (root == null) {
                                        cb(null);
                                    }
                                    else {
                                        org.kevoree.modeling.format.json.JsonModelSerializer.serialize(root, cb);
                                    }
                                });
                            }
                        };
                        JsonFormat.prototype.load = function (payload, cb) {
                            if (org.kevoree.modeling.util.Checker.isDefined(payload)) {
                                org.kevoree.modeling.format.json.JsonModelLoader.load(this._manager, this._universe, this._time, payload, cb);
                            }
                            else {
                                throw new java.lang.RuntimeException(JsonFormat.NULL_PARAM_MSG);
                            }
                        };
                        JsonFormat.KEY_META = "@class";
                        JsonFormat.KEY_UUID = "@uuid";
                        JsonFormat.KEY_ROOT = "@root";
                        JsonFormat.NULL_PARAM_MSG = "one parameter is null";
                        return JsonFormat;
                    })();
                    json.JsonFormat = JsonFormat;
                    var JsonModelLoader = (function () {
                        function JsonModelLoader() {
                        }
                        JsonModelLoader.load = function (manager, universe, time, payload, callback) {
                            if (payload == null) {
                                callback(null);
                            }
                            else {
                                var toLoadObj = JSON.parse(payload);
                                var rootElem = [];
                                var mappedKeys = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongLongMap(toLoadObj.length, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                for (var i = 0; i < toLoadObj.length; i++) {
                                    var elem = toLoadObj[i];
                                    var kid = elem[org.kevoree.modeling.format.json.JsonFormat.KEY_UUID];
                                    mappedKeys.put(kid, manager.nextObjectKey());
                                }
                                for (var i = 0; i < toLoadObj.length; i++) {
                                    var elemRaw = toLoadObj[i];
                                    var elem2 = new org.kevoree.modeling.memory.struct.map.impl.ArrayStringMap(Object.keys(elemRaw).length, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                    for (var ik in elemRaw) {
                                        elem2[ik] = elemRaw[ik];
                                    }
                                    try {
                                        org.kevoree.modeling.format.json.JsonModelLoader.loadObj(elem2, manager, universe, time, mappedKeys, rootElem);
                                    }
                                    catch (e) {
                                        console.error(e);
                                    }
                                }
                                if (rootElem[0] != null) {
                                    manager.setRoot(rootElem[0], function (throwable) { if (callback != null) {
                                        callback(throwable);
                                    } });
                                }
                                else {
                                    if (callback != null) {
                                        callback(null);
                                    }
                                }
                            }
                        };
                        JsonModelLoader.loadObj = function (p_param, manager, universe, time, p_mappedKeys, p_rootElem) {
                            var kid = java.lang.Long.parseLong(p_param.get(org.kevoree.modeling.format.json.JsonFormat.KEY_UUID).toString());
                            var meta = p_param.get(org.kevoree.modeling.format.json.JsonFormat.KEY_META).toString();
                            var metaClass = manager.model().metaModel().metaClassByName(meta);
                            var current = manager.model().createProxy(universe, time, p_mappedKeys.get(kid), metaClass);
                            manager.initKObject(current);
                            var raw = manager.segment(current.universe(), current.now(), current.uuid(), false, current.metaClass(), null);
                            p_param.each(function (metaKey, payload_content) {
                                if (metaKey.equals(org.kevoree.modeling.format.json.JsonFormat.KEY_ROOT)) {
                                    p_rootElem[0] = current;
                                }
                                else {
                                    var metaElement = metaClass.metaByName(metaKey);
                                    if (payload_content != null) {
                                        if (metaElement != null && metaElement.metaType().equals(org.kevoree.modeling.meta.MetaType.ATTRIBUTE)) {
                                            var metaAttribute = metaElement;
                                            if (metaAttribute.attributeType() == org.kevoree.modeling.meta.KPrimitiveTypes.CONTINUOUS) {
                                                var plainRawSet = p_param.get(metaAttribute.metaName());
                                                var convertedRaw = new Array();
                                                for (var l = 0; l < plainRawSet.length; l++) {
                                                    try {
                                                        convertedRaw[l] = java.lang.Double.parseDouble(plainRawSet[l]);
                                                    }
                                                    catch ($ex$) {
                                                        if ($ex$ instanceof java.lang.Exception) {
                                                            var e = $ex$;
                                                            e.printStackTrace();
                                                        }
                                                        else {
                                                            throw $ex$;
                                                        }
                                                    }
                                                }
                                                raw.set(metaElement.index(), convertedRaw, current.metaClass());
                                            }
                                            else {
                                                var converted = null;
                                                var rawPayload = p_param.get(metaElement.metaName()).toString();
                                                if (metaAttribute.attributeType() == org.kevoree.modeling.meta.KPrimitiveTypes.STRING) {
                                                    converted = org.kevoree.modeling.format.json.JsonString.unescape(rawPayload);
                                                }
                                                else {
                                                    if (metaAttribute.attributeType() == org.kevoree.modeling.meta.KPrimitiveTypes.LONG) {
                                                        converted = java.lang.Long.parseLong(rawPayload);
                                                    }
                                                    else {
                                                        if (metaAttribute.attributeType() == org.kevoree.modeling.meta.KPrimitiveTypes.INT) {
                                                            converted = java.lang.Integer.parseInt(rawPayload);
                                                        }
                                                        else {
                                                            if (metaAttribute.attributeType() == org.kevoree.modeling.meta.KPrimitiveTypes.BOOL) {
                                                                converted = java.lang.Boolean.parseBoolean(rawPayload);
                                                            }
                                                            else {
                                                                if (metaAttribute.attributeType() == org.kevoree.modeling.meta.KPrimitiveTypes.DOUBLE) {
                                                                    converted = java.lang.Double.parseDouble(rawPayload);
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                raw.set(metaElement.index(), converted, current.metaClass());
                                            }
                                        }
                                        else {
                                            if (metaElement != null && metaElement instanceof org.kevoree.modeling.meta.impl.MetaReference) {
                                                try {
                                                    raw.set(metaElement.index(), org.kevoree.modeling.format.json.JsonModelLoader.transposeArr(payload_content, p_mappedKeys), current.metaClass());
                                                }
                                                catch ($ex$) {
                                                    if ($ex$ instanceof java.lang.Exception) {
                                                        var e = $ex$;
                                                        e.printStackTrace();
                                                    }
                                                    else {
                                                        throw $ex$;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                        };
                        JsonModelLoader.transposeArr = function (plainRawSet, p_mappedKeys) {
                            if (plainRawSet == null) {
                                return null;
                            }
                            var convertedRaw = new Array();
                            for (var l in plainRawSet) {
                                try {
                                    var converted = java.lang.Long.parseLong(plainRawSet[l]);
                                    if (p_mappedKeys.contains(converted)) {
                                        converted = p_mappedKeys.get(converted);
                                    }
                                    convertedRaw[l] = converted;
                                }
                                catch ($ex$) {
                                    if ($ex$ instanceof java.lang.Exception) {
                                        var e = $ex$;
                                        e.printStackTrace();
                                    }
                                }
                            }
                            return convertedRaw;
                        };
                        return JsonModelLoader;
                    })();
                    json.JsonModelLoader = JsonModelLoader;
                    var JsonModelSerializer = (function () {
                        function JsonModelSerializer() {
                        }
                        JsonModelSerializer.serialize = function (model, callback) {
                            model._manager.getRoot(model.universe(), model.now(), function (rootObj) {
                                var isRoot = false;
                                if (rootObj != null) {
                                    isRoot = rootObj.uuid() == model.uuid();
                                }
                                var builder = new java.lang.StringBuilder();
                                builder.append("[\n");
                                org.kevoree.modeling.format.json.JsonModelSerializer.printJSON(model, builder, isRoot);
                                model.visit(function (elem) {
                                    var isRoot2 = false;
                                    if (rootObj != null) {
                                        isRoot2 = rootObj.uuid() == elem.uuid();
                                    }
                                    builder.append(",\n");
                                    try {
                                        org.kevoree.modeling.format.json.JsonModelSerializer.printJSON(elem, builder, isRoot2);
                                    }
                                    catch ($ex$) {
                                        if ($ex$ instanceof java.lang.Exception) {
                                            var e = $ex$;
                                            e.printStackTrace();
                                            builder.append("{}");
                                        }
                                        else {
                                            throw $ex$;
                                        }
                                    }
                                    return org.kevoree.modeling.traversal.visitor.KVisitResult.CONTINUE;
                                }, function (throwable) {
                                    builder.append("\n]\n");
                                    callback(builder.toString());
                                });
                            });
                        };
                        JsonModelSerializer.printJSON = function (elem, builder, isRoot) {
                            if (elem != null) {
                                var raw = elem._manager.segment(elem.universe(), elem.now(), elem.uuid(), true, elem.metaClass(), null);
                                if (raw != null) {
                                    builder.append(org.kevoree.modeling.format.json.JsonRaw.encode(raw, elem.uuid(), elem.metaClass(), isRoot));
                                }
                            }
                        };
                        return JsonModelSerializer;
                    })();
                    json.JsonModelSerializer = JsonModelSerializer;
                    var JsonObjectReader = (function () {
                        function JsonObjectReader() {
                        }
                        JsonObjectReader.prototype.parseObject = function (payload) {
                            this.readObject = JSON.parse(payload);
                        };
                        JsonObjectReader.prototype.get = function (name) {
                            return this.readObject[name];
                        };
                        JsonObjectReader.prototype.getAsStringArray = function (name) {
                            return this.readObject[name];
                        };
                        JsonObjectReader.prototype.keys = function () {
                            var keysArr = [];
                            for (var key in this.readObject) {
                                keysArr.push(key);
                            }
                            return keysArr;
                        };
                        return JsonObjectReader;
                    })();
                    json.JsonObjectReader = JsonObjectReader;
                    var JsonRaw = (function () {
                        function JsonRaw() {
                        }
                        JsonRaw.encode = function (raw, uuid, p_metaClass, isRoot) {
                            var builder = {};
                            builder["@class"] = p_metaClass.metaName();
                            builder["@uuid"] = +uuid;
                            if (isRoot) {
                                builder["@root"] = true;
                            }
                            var metaElements = p_metaClass.metaElements();
                            for (var i = 0; i < metaElements.length; i++) {
                                var subElem;
                                if (metaElements[i] != null && metaElements[i].metaType() === org.kevoree.modeling.meta.MetaType.ATTRIBUTE) {
                                    var metaAttribute = metaElements[i];
                                    if (metaAttribute.attributeType() == org.kevoree.modeling.meta.KPrimitiveTypes.CONTINUOUS) {
                                        subElem = raw.getInfer(metaAttribute.index(), p_metaClass);
                                    }
                                    else {
                                        subElem = raw.get(metaAttribute.index(), p_metaClass);
                                    }
                                }
                                else {
                                    subElem = raw.getRef(metaElements[i].index(), p_metaClass);
                                }
                                if (subElem != null && subElem != undefined) {
                                    builder[metaElements[i].metaName()] = subElem;
                                }
                            }
                            return JSON.stringify(builder);
                        };
                        return JsonRaw;
                    })();
                    json.JsonRaw = JsonRaw;
                    var JsonString = (function () {
                        function JsonString() {
                        }
                        JsonString.encodeBuffer = function (buffer, chain) {
                            if (chain == null) {
                                return;
                            }
                            var i = 0;
                            while (i < chain.length) {
                                var ch = chain.charAt(i);
                                if (ch == '"') {
                                    buffer.append(JsonString.ESCAPE_CHAR);
                                    buffer.append('"');
                                }
                                else {
                                    if (ch == JsonString.ESCAPE_CHAR) {
                                        buffer.append(JsonString.ESCAPE_CHAR);
                                        buffer.append(JsonString.ESCAPE_CHAR);
                                    }
                                    else {
                                        if (ch == '\n') {
                                            buffer.append(JsonString.ESCAPE_CHAR);
                                            buffer.append('n');
                                        }
                                        else {
                                            if (ch == '\r') {
                                                buffer.append(JsonString.ESCAPE_CHAR);
                                                buffer.append('r');
                                            }
                                            else {
                                                if (ch == '\t') {
                                                    buffer.append(JsonString.ESCAPE_CHAR);
                                                    buffer.append('t');
                                                }
                                                else {
                                                    if (ch == '\u2028') {
                                                        buffer.append(JsonString.ESCAPE_CHAR);
                                                        buffer.append('u');
                                                        buffer.append('2');
                                                        buffer.append('0');
                                                        buffer.append('2');
                                                        buffer.append('8');
                                                    }
                                                    else {
                                                        if (ch == '\u2029') {
                                                            buffer.append(JsonString.ESCAPE_CHAR);
                                                            buffer.append('u');
                                                            buffer.append('2');
                                                            buffer.append('0');
                                                            buffer.append('2');
                                                            buffer.append('9');
                                                        }
                                                        else {
                                                            buffer.append(ch);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                i = i + 1;
                            }
                        };
                        JsonString.encode = function (p_chain) {
                            var sb = new java.lang.StringBuilder();
                            org.kevoree.modeling.format.json.JsonString.encodeBuffer(sb, p_chain);
                            return sb.toString();
                        };
                        JsonString.unescape = function (p_src) {
                            if (p_src == null) {
                                return null;
                            }
                            if (p_src.length == 0) {
                                return p_src;
                            }
                            var builder = null;
                            var i = 0;
                            while (i < p_src.length) {
                                var current = p_src.charAt(i);
                                if (current == JsonString.ESCAPE_CHAR) {
                                    if (builder == null) {
                                        builder = new java.lang.StringBuilder();
                                        builder.append(p_src.substring(0, i));
                                    }
                                    i++;
                                    var current2 = p_src.charAt(i);
                                    switch (current2) {
                                        case '"':
                                            builder.append('\"');
                                            break;
                                        case '\\':
                                            builder.append(current2);
                                            break;
                                        case '/':
                                            builder.append(current2);
                                            break;
                                        case 'b':
                                            builder.append('\b');
                                            break;
                                        case 'f':
                                            builder.append('\f');
                                            break;
                                        case 'n':
                                            builder.append('\n');
                                            break;
                                        case 'r':
                                            builder.append('\r');
                                            break;
                                        case 't':
                                            builder.append('\t');
                                            break;
                                        case '{':
                                            builder.append("\\{");
                                            break;
                                        case '}':
                                            builder.append("\\}");
                                            break;
                                        case '[':
                                            builder.append("\\[");
                                            break;
                                        case ']':
                                            builder.append("\\]");
                                            break;
                                        case ',':
                                            builder.append("\\,");
                                            break;
                                    }
                                }
                                else {
                                    if (builder != null) {
                                        builder = builder.append(current);
                                    }
                                }
                                i++;
                            }
                            if (builder != null) {
                                return builder.toString();
                            }
                            else {
                                return p_src;
                            }
                        };
                        JsonString.ESCAPE_CHAR = '\\';
                        return JsonString;
                    })();
                    json.JsonString = JsonString;
                })(json = format.json || (format.json = {}));
                var xmi;
                (function (xmi) {
                    var SerializationContext = (function () {
                        function SerializationContext() {
                            this.ignoreGeneratedID = false;
                            this.addressTable = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                            this.elementsCount = new org.kevoree.modeling.memory.struct.map.impl.ArrayStringMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                            this.packageList = new java.util.ArrayList();
                        }
                        return SerializationContext;
                    })();
                    xmi.SerializationContext = SerializationContext;
                    var XMILoadingContext = (function () {
                        function XMILoadingContext() {
                            this.loadedRoots = null;
                            this.resolvers = new java.util.ArrayList();
                            this.map = new org.kevoree.modeling.memory.struct.map.impl.ArrayStringMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                            this.elementsCount = new org.kevoree.modeling.memory.struct.map.impl.ArrayStringMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                        }
                        return XMILoadingContext;
                    })();
                    xmi.XMILoadingContext = XMILoadingContext;
                    var XMIModelLoader = (function () {
                        function XMIModelLoader() {
                        }
                        XMIModelLoader.unescapeXml = function (src) {
                            var builder = null;
                            var i = 0;
                            while (i < src.length) {
                                var c = src.charAt(i);
                                if (c == '&') {
                                    if (builder == null) {
                                        builder = new java.lang.StringBuilder();
                                        builder.append(src.substring(0, i));
                                    }
                                    if (src.charAt(i + 1) == 'a') {
                                        if (src.charAt(i + 2) == 'm') {
                                            builder.append("&");
                                            i = i + 5;
                                        }
                                        else {
                                            if (src.charAt(i + 2) == 'p') {
                                                builder.append("'");
                                                i = i + 6;
                                            }
                                        }
                                    }
                                    else {
                                        if (src.charAt(i + 1) == 'q') {
                                            builder.append("\"");
                                            i = i + 6;
                                        }
                                        else {
                                            if (src.charAt(i + 1) == 'l') {
                                                builder.append("<");
                                                i = i + 4;
                                            }
                                            else {
                                                if (src.charAt(i + 1) == 'g') {
                                                    builder.append(">");
                                                    i = i + 4;
                                                }
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (builder != null) {
                                        builder.append(c);
                                    }
                                    i++;
                                }
                            }
                            if (builder != null) {
                                return builder.toString();
                            }
                            else {
                                return src;
                            }
                        };
                        XMIModelLoader.load = function (manager, universe, time, str, callback) {
                            var parser = new org.kevoree.modeling.format.xmi.XmlParser(str);
                            if (!parser.hasNext()) {
                                callback(null);
                            }
                            else {
                                var context = new org.kevoree.modeling.format.xmi.XMILoadingContext();
                                context.successCallback = callback;
                                context.xmiReader = parser;
                                org.kevoree.modeling.format.xmi.XMIModelLoader.deserialize(manager, universe, time, context);
                            }
                        };
                        XMIModelLoader.deserialize = function (manager, universe, time, context) {
                            try {
                                var nsURI;
                                var reader = context.xmiReader;
                                while (reader.hasNext()) {
                                    var nextTag = reader.next();
                                    if (nextTag.equals(org.kevoree.modeling.format.xmi.XmlToken.START_TAG)) {
                                        var localName = reader.getLocalName();
                                        if (localName != null) {
                                            var ns = new org.kevoree.modeling.memory.struct.map.impl.ArrayStringMap(reader.getAttributeCount(), org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                            for (var i = 0; i < reader.getAttributeCount() - 1; i++) {
                                                var attrLocalName = reader.getAttributeLocalName(i);
                                                var attrLocalValue = reader.getAttributeValue(i);
                                                if (attrLocalName.equals(XMIModelLoader.LOADER_XMI_NS_URI)) {
                                                    nsURI = attrLocalValue;
                                                }
                                                ns.put(attrLocalName, attrLocalValue);
                                            }
                                            var xsiType = reader.getTagPrefix();
                                            var realTypeName = ns.get(xsiType);
                                            if (realTypeName == null) {
                                                realTypeName = xsiType;
                                            }
                                            context.loadedRoots = org.kevoree.modeling.format.xmi.XMIModelLoader.loadObject(manager, universe, time, context, "/", xsiType + "." + localName);
                                        }
                                    }
                                }
                                for (var i = 0; i < context.resolvers.size(); i++) {
                                    context.resolvers.get(i).run();
                                }
                                manager.setRoot(context.loadedRoots, null);
                                context.successCallback(null);
                            }
                            catch ($ex$) {
                                if ($ex$ instanceof java.lang.Exception) {
                                    var e = $ex$;
                                    context.successCallback(e);
                                }
                                else {
                                    throw $ex$;
                                }
                            }
                        };
                        XMIModelLoader.callFactory = function (manager, universe, time, ctx, objectType) {
                            var modelElem = null;
                            if (objectType != null) {
                                modelElem = manager.model().createByName(objectType, universe, time);
                                if (modelElem == null) {
                                    var xsiType = null;
                                    for (var i = 0; i < (ctx.xmiReader.getAttributeCount() - 1); i++) {
                                        var localName = ctx.xmiReader.getAttributeLocalName(i);
                                        var xsi = ctx.xmiReader.getAttributePrefix(i);
                                        if (localName.equals(XMIModelLoader.LOADER_XMI_LOCAL_NAME) && xsi.equals(XMIModelLoader.LOADER_XMI_XSI)) {
                                            xsiType = ctx.xmiReader.getAttributeValue(i);
                                            break;
                                        }
                                    }
                                    if (xsiType != null) {
                                        var realTypeName = xsiType.substring(0, xsiType.lastIndexOf(":"));
                                        var realName = xsiType.substring(xsiType.lastIndexOf(":") + 1, xsiType.length);
                                        modelElem = manager.model().createByName(realTypeName + "." + realName, universe, time);
                                    }
                                }
                            }
                            else {
                                modelElem = manager.model().createByName(ctx.xmiReader.getLocalName(), universe, time);
                            }
                            return modelElem;
                        };
                        XMIModelLoader.loadObject = function (manager, universe, time, ctx, xmiAddress, objectType) {
                            var elementTagName = ctx.xmiReader.getLocalName();
                            var modelElem = org.kevoree.modeling.format.xmi.XMIModelLoader.callFactory(manager, universe, time, ctx, objectType);
                            if (modelElem == null) {
                                throw new java.lang.Exception("Could not create an object for local name " + elementTagName);
                            }
                            ctx.map.put(xmiAddress, modelElem);
                            for (var i = 0; i < ctx.xmiReader.getAttributeCount(); i++) {
                                var prefix = ctx.xmiReader.getAttributePrefix(i);
                                if (prefix == null || prefix.equals("")) {
                                    var attrName = ctx.xmiReader.getAttributeLocalName(i).trim();
                                    var valueAtt = ctx.xmiReader.getAttributeValue(i).trim();
                                    if (valueAtt != null) {
                                        var metaElement = modelElem.metaClass().metaByName(attrName);
                                        if (metaElement != null && metaElement.metaType().equals(org.kevoree.modeling.meta.MetaType.ATTRIBUTE)) {
                                            modelElem.set(metaElement, org.kevoree.modeling.format.xmi.XMIModelLoader.unescapeXml(valueAtt));
                                        }
                                        else {
                                            if (metaElement != null && metaElement instanceof org.kevoree.modeling.meta.impl.MetaReference) {
                                                var referenceArray = valueAtt.split(" ");
                                                for (var j = 0; j < referenceArray.length; j++) {
                                                    var xmiRef = referenceArray[j];
                                                    var adjustedRef = (xmiRef.startsWith("#") ? xmiRef.substring(1) : xmiRef);
                                                    adjustedRef = adjustedRef.replace(".0", "");
                                                    var ref = ctx.map.get(adjustedRef);
                                                    if (ref != null) {
                                                        modelElem.mutate(org.kevoree.modeling.KActionType.ADD, metaElement, ref);
                                                    }
                                                    else {
                                                        ctx.resolvers.add(new org.kevoree.modeling.format.xmi.XMIResolveCommand(ctx, modelElem, org.kevoree.modeling.KActionType.ADD, attrName, adjustedRef));
                                                    }
                                                }
                                            }
                                            else {
                                            }
                                        }
                                    }
                                }
                            }
                            var done = false;
                            while (!done) {
                                if (ctx.xmiReader.hasNext()) {
                                    var tok = ctx.xmiReader.next();
                                    if (tok.equals(org.kevoree.modeling.format.xmi.XmlToken.START_TAG)) {
                                        var subElemName = ctx.xmiReader.getLocalName();
                                        var key = xmiAddress + "/@" + subElemName;
                                        var i = ctx.elementsCount.get(key);
                                        if (i == null) {
                                            i = 0;
                                            ctx.elementsCount.put(key, i);
                                        }
                                        var subElementId = xmiAddress + "/@" + subElemName + (i != 0 ? "." + i : "");
                                        var containedElement = org.kevoree.modeling.format.xmi.XMIModelLoader.loadObject(manager, universe, time, ctx, subElementId, subElemName);
                                        modelElem.mutate(org.kevoree.modeling.KActionType.ADD, modelElem.metaClass().metaByName(subElemName), containedElement);
                                        ctx.elementsCount.put(xmiAddress + "/@" + subElemName, i + 1);
                                    }
                                    else {
                                        if (tok.equals(org.kevoree.modeling.format.xmi.XmlToken.END_TAG)) {
                                            if (ctx.xmiReader.getLocalName().equals(elementTagName)) {
                                                done = true;
                                            }
                                        }
                                    }
                                }
                                else {
                                    done = true;
                                }
                            }
                            return modelElem;
                        };
                        XMIModelLoader.LOADER_XMI_LOCAL_NAME = "type";
                        XMIModelLoader.LOADER_XMI_XSI = "xsi";
                        XMIModelLoader.LOADER_XMI_NS_URI = "nsURI";
                        return XMIModelLoader;
                    })();
                    xmi.XMIModelLoader = XMIModelLoader;
                    var XMIModelSerializer = (function () {
                        function XMIModelSerializer() {
                        }
                        XMIModelSerializer.save = function (model, callback) {
                            callback(null);
                        };
                        return XMIModelSerializer;
                    })();
                    xmi.XMIModelSerializer = XMIModelSerializer;
                    var XMIResolveCommand = (function () {
                        function XMIResolveCommand(context, target, mutatorType, refName, ref) {
                            this.context = context;
                            this.target = target;
                            this.mutatorType = mutatorType;
                            this.refName = refName;
                            this.ref = ref;
                        }
                        XMIResolveCommand.prototype.run = function () {
                            var referencedElement = this.context.map.get(this.ref);
                            if (referencedElement != null) {
                                this.target.mutate(this.mutatorType, this.target.metaClass().metaByName(this.refName), referencedElement);
                                return;
                            }
                            referencedElement = this.context.map.get("/");
                            if (referencedElement != null) {
                                this.target.mutate(this.mutatorType, this.target.metaClass().metaByName(this.refName), referencedElement);
                                return;
                            }
                            throw new java.lang.Exception("KMF Load error : reference " + this.ref + " not found in map when trying to  " + this.mutatorType + " " + this.refName + "  on " + this.target.metaClass().metaName() + "(uuid:" + this.target.uuid() + ")");
                        };
                        return XMIResolveCommand;
                    })();
                    xmi.XMIResolveCommand = XMIResolveCommand;
                    var XmiFormat = (function () {
                        function XmiFormat(p_universe, p_time, p_manager) {
                            this._universe = p_universe;
                            this._time = p_time;
                            this._manager = p_manager;
                        }
                        XmiFormat.prototype.save = function (model, cb) {
                            org.kevoree.modeling.format.xmi.XMIModelSerializer.save(model, cb);
                        };
                        XmiFormat.prototype.saveRoot = function (cb) {
                            this._manager.getRoot(this._universe, this._time, function (root) {
                                if (root == null) {
                                    if (cb != null) {
                                        cb(null);
                                    }
                                }
                                else {
                                    org.kevoree.modeling.format.xmi.XMIModelSerializer.save(root, cb);
                                }
                            });
                        };
                        XmiFormat.prototype.load = function (payload, cb) {
                            org.kevoree.modeling.format.xmi.XMIModelLoader.load(this._manager, this._universe, this._time, payload, cb);
                        };
                        return XmiFormat;
                    })();
                    xmi.XmiFormat = XmiFormat;
                    var XmlParser = (function () {
                        function XmlParser(str) {
                            this.current = 0;
                            this.readSingleton = false;
                            this.attributesNames = new java.util.ArrayList();
                            this.attributesPrefixes = new java.util.ArrayList();
                            this.attributesValues = new java.util.ArrayList();
                            this.attributeName = new java.lang.StringBuilder();
                            this.attributeValue = new java.lang.StringBuilder();
                            this.payload = str;
                            this.currentChar = this.readChar();
                        }
                        XmlParser.prototype.getTagPrefix = function () {
                            return this.tagPrefix;
                        };
                        XmlParser.prototype.hasNext = function () {
                            this.read_lessThan();
                            return this.current < this.payload.length;
                        };
                        XmlParser.prototype.getLocalName = function () {
                            return this.tagName;
                        };
                        XmlParser.prototype.getAttributeCount = function () {
                            return this.attributesNames.size();
                        };
                        XmlParser.prototype.getAttributeLocalName = function (i) {
                            return this.attributesNames.get(i);
                        };
                        XmlParser.prototype.getAttributePrefix = function (i) {
                            return this.attributesPrefixes.get(i);
                        };
                        XmlParser.prototype.getAttributeValue = function (i) {
                            return this.attributesValues.get(i);
                        };
                        XmlParser.prototype.readChar = function () {
                            if (this.current < this.payload.length) {
                                var re = this.payload.charAt(this.current);
                                this.current++;
                                return re;
                            }
                            return '\0';
                        };
                        XmlParser.prototype.next = function () {
                            if (this.readSingleton) {
                                this.readSingleton = false;
                                return org.kevoree.modeling.format.xmi.XmlToken.END_TAG;
                            }
                            if (!this.hasNext()) {
                                return org.kevoree.modeling.format.xmi.XmlToken.END_DOCUMENT;
                            }
                            this.attributesNames.clear();
                            this.attributesPrefixes.clear();
                            this.attributesValues.clear();
                            this.read_lessThan();
                            this.currentChar = this.readChar();
                            if (this.currentChar == '?') {
                                this.currentChar = this.readChar();
                                this.read_xmlHeader();
                                return org.kevoree.modeling.format.xmi.XmlToken.XML_HEADER;
                            }
                            else {
                                if (this.currentChar == '!') {
                                    do {
                                        this.currentChar = this.readChar();
                                    } while (this.currentChar != '>');
                                    return org.kevoree.modeling.format.xmi.XmlToken.COMMENT;
                                }
                                else {
                                    if (this.currentChar == '/') {
                                        this.currentChar = this.readChar();
                                        this.read_closingTag();
                                        return org.kevoree.modeling.format.xmi.XmlToken.END_TAG;
                                    }
                                    else {
                                        this.read_openTag();
                                        if (this.currentChar == '/') {
                                            this.read_upperThan();
                                            this.readSingleton = true;
                                        }
                                        return org.kevoree.modeling.format.xmi.XmlToken.START_TAG;
                                    }
                                }
                            }
                        };
                        XmlParser.prototype.read_lessThan = function () {
                            while (this.currentChar != '<' && this.currentChar != '\0') {
                                this.currentChar = this.readChar();
                            }
                        };
                        XmlParser.prototype.read_upperThan = function () {
                            while (this.currentChar != '>') {
                                this.currentChar = this.readChar();
                            }
                        };
                        XmlParser.prototype.read_xmlHeader = function () {
                            this.read_tagName();
                            this.read_attributes();
                            this.read_upperThan();
                        };
                        XmlParser.prototype.read_closingTag = function () {
                            this.read_tagName();
                            this.read_upperThan();
                        };
                        XmlParser.prototype.read_openTag = function () {
                            this.read_tagName();
                            if (this.currentChar != '>' && this.currentChar != '/') {
                                this.read_attributes();
                            }
                        };
                        XmlParser.prototype.read_tagName = function () {
                            this.tagName = "" + this.currentChar;
                            this.tagPrefix = null;
                            this.currentChar = this.readChar();
                            while (this.currentChar != ' ' && this.currentChar != '>' && this.currentChar != '/') {
                                if (this.currentChar == ':') {
                                    this.tagPrefix = this.tagName;
                                    this.tagName = "";
                                }
                                else {
                                    this.tagName += this.currentChar;
                                }
                                this.currentChar = this.readChar();
                            }
                        };
                        XmlParser.prototype.read_attributes = function () {
                            var end_of_tag = false;
                            while (this.currentChar == ' ') {
                                this.currentChar = this.readChar();
                            }
                            while (!end_of_tag) {
                                while (this.currentChar != '=') {
                                    if (this.currentChar == ':') {
                                        this.attributePrefix = this.attributeName.toString();
                                        this.attributeName = new java.lang.StringBuilder();
                                    }
                                    else {
                                        this.attributeName.append(this.currentChar);
                                    }
                                    this.currentChar = this.readChar();
                                }
                                do {
                                    this.currentChar = this.readChar();
                                } while (this.currentChar != '"');
                                this.currentChar = this.readChar();
                                while (this.currentChar != '"') {
                                    this.attributeValue.append(this.currentChar);
                                    this.currentChar = this.readChar();
                                }
                                this.attributesNames.add(this.attributeName.toString());
                                this.attributesPrefixes.add(this.attributePrefix);
                                this.attributesValues.add(this.attributeValue.toString());
                                this.attributeName = new java.lang.StringBuilder();
                                this.attributePrefix = null;
                                this.attributeValue = new java.lang.StringBuilder();
                                do {
                                    this.currentChar = this.readChar();
                                    if (this.currentChar == '?' || this.currentChar == '/' || this.currentChar == '-' || this.currentChar == '>') {
                                        end_of_tag = true;
                                    }
                                } while (!end_of_tag && this.currentChar == ' ');
                            }
                        };
                        return XmlParser;
                    })();
                    xmi.XmlParser = XmlParser;
                    var XmlToken = (function () {
                        function XmlToken() {
                        }
                        XmlToken.prototype.equals = function (other) {
                            return this == other;
                        };
                        XmlToken.values = function () {
                            return XmlToken._XmlTokenVALUES;
                        };
                        XmlToken.XML_HEADER = new XmlToken();
                        XmlToken.END_DOCUMENT = new XmlToken();
                        XmlToken.START_TAG = new XmlToken();
                        XmlToken.END_TAG = new XmlToken();
                        XmlToken.COMMENT = new XmlToken();
                        XmlToken.SINGLETON_TAG = new XmlToken();
                        XmlToken._XmlTokenVALUES = [
                            XmlToken.XML_HEADER,
                            XmlToken.END_DOCUMENT,
                            XmlToken.START_TAG,
                            XmlToken.END_TAG,
                            XmlToken.COMMENT,
                            XmlToken.SINGLETON_TAG
                        ];
                        return XmlToken;
                    })();
                    xmi.XmlToken = XmlToken;
                })(xmi = format.xmi || (format.xmi = {}));
            })(format = modeling.format || (modeling.format = {}));
            var infer;
            (function (infer) {
                var impl;
                (function (impl) {
                    var BinaryPerceptronAlg = (function () {
                        function BinaryPerceptronAlg() {
                            this.iterations = 5;
                            this.alpha = 1;
                            this.rand = new java.util.Random();
                        }
                        BinaryPerceptronAlg.prototype.train = function (trainingSet, expectedResultSet, origin) {
                            var ks = origin.manager().segment(origin.universe(), origin.now(), origin.uuid(), false, origin.metaClass(), null);
                            var dependenciesIndex = origin.metaClass().dependencies().index();
                            var size = origin.metaClass().inputs().length + 1;
                            if (ks.getInferSize(dependenciesIndex, origin.metaClass()) == 0) {
                                ks.extendInfer(origin.metaClass().dependencies().index(), size, origin.metaClass());
                                for (var i = 0; i < size; i++) {
                                    ks.setInferElem(dependenciesIndex, i, this.rand.nextDouble(), origin.metaClass());
                                }
                            }
                            var state = new org.kevoree.modeling.util.maths.structure.impl.Array1D(size, 0, origin.metaClass().dependencies().index(), ks, origin.metaClass());
                            for (var iter = 0; iter < this.iterations; iter++) {
                                for (var row = 0; row < trainingSet.length; row++) {
                                    var h = this.calculate(trainingSet[row], state);
                                    var error = -this.alpha * (h - expectedResultSet[row][0]);
                                    if (error != 0) {
                                        for (var j = 0; j < origin.metaClass().inputs().length; j++) {
                                            state.add(j, error * trainingSet[row][j]);
                                        }
                                        state.add(origin.metaClass().inputs().length, error);
                                    }
                                }
                            }
                        };
                        BinaryPerceptronAlg.prototype.calculate = function (features, state) {
                            var res = 0;
                            for (var i = 0; i < features.length; i++) {
                                res = res + state.get(i) * features[i];
                            }
                            res = res + state.get(features.length);
                            if (res >= 0) {
                                return 1.0;
                            }
                            else {
                                return 0;
                            }
                        };
                        BinaryPerceptronAlg.prototype.infer = function (features, origin) {
                            var ks = origin.manager().segment(origin.universe(), origin.now(), origin.uuid(), false, origin.metaClass(), null);
                            var dependenciesIndex = origin.metaClass().dependencies().index();
                            var size = origin.metaClass().inputs().length + 1;
                            if (ks.getInferSize(dependenciesIndex, origin.metaClass()) == 0) {
                                return null;
                            }
                            var state = new org.kevoree.modeling.util.maths.structure.impl.Array1D(size, 0, origin.metaClass().dependencies().index(), ks, origin.metaClass());
                            var result = new Array(new Array());
                            for (var inst = 0; inst < features.length; inst++) {
                                result[inst] = new Array();
                                result[inst][0] = this.calculate(features[inst], state);
                            }
                            return result;
                        };
                        return BinaryPerceptronAlg;
                    })();
                    impl.BinaryPerceptronAlg = BinaryPerceptronAlg;
                    var GaussianClassificationAlg = (function () {
                        function GaussianClassificationAlg() {
                        }
                        GaussianClassificationAlg.prototype.getIndex = function (input, output, field, meta) {
                            return output * (GaussianClassificationAlg.NUMOFFIELDS * meta.origin().inputs().length + 1) + GaussianClassificationAlg.NUMOFFIELDS * input + field;
                        };
                        GaussianClassificationAlg.prototype.getCounter = function (output, meta) {
                            return output * (GaussianClassificationAlg.NUMOFFIELDS * meta.origin().inputs().length + 1) + GaussianClassificationAlg.NUMOFFIELDS * meta.origin().inputs().length;
                        };
                        GaussianClassificationAlg.prototype.getAvg = function (output, state, meta) {
                            var avg = new Array();
                            var total = state.get(this.getCounter(output, meta));
                            if (total != 0) {
                                for (var i = 0; i < meta.origin().inputs().length; i++) {
                                    avg[i] = state.get(this.getIndex(i, output, GaussianClassificationAlg.SUM, meta)) / total;
                                }
                            }
                            return avg;
                        };
                        GaussianClassificationAlg.prototype.getVariance = function (output, state, avg, meta) {
                            var variances = new Array();
                            var total = state.get(this.getCounter(output, meta));
                            if (total != 0) {
                                for (var i = 0; i < meta.origin().inputs().length; i++) {
                                    variances[i] = state.get(this.getIndex(i, output, GaussianClassificationAlg.SUMSQUARE, meta)) / total - avg[i] * avg[i];
                                }
                            }
                            return variances;
                        };
                        GaussianClassificationAlg.prototype.train = function (trainingSet, expectedResultSet, origin) {
                            var maxOutput = origin.metaClass().outputs()[0].type().literals().length;
                            var ks = origin.manager().segment(origin.universe(), origin.now(), origin.uuid(), false, origin.metaClass(), null);
                            var dependenciesIndex = origin.metaClass().dependencies().index();
                            var size = (maxOutput + 1) * (origin.metaClass().inputs().length * GaussianClassificationAlg.NUMOFFIELDS + 1);
                            if (ks.getInferSize(dependenciesIndex, origin.metaClass()) == 0) {
                                ks.extendInfer(origin.metaClass().dependencies().index(), size, origin.metaClass());
                                for (var i = 0; i < size; i++) {
                                    ks.setInferElem(dependenciesIndex, i, 0, origin.metaClass());
                                }
                            }
                            var state = new org.kevoree.modeling.util.maths.structure.impl.Array1D(size, 0, origin.metaClass().dependencies().index(), ks, origin.metaClass());
                            for (var i = 0; i < trainingSet.length; i++) {
                                var output = expectedResultSet[i][0];
                                for (var j = 0; j < origin.metaClass().inputs().length; j++) {
                                    if (state.get(this.getCounter(output, origin.metaClass().dependencies())) == 0) {
                                        state.set(this.getIndex(j, output, GaussianClassificationAlg.MIN, origin.metaClass().dependencies()), trainingSet[i][j]);
                                        state.set(this.getIndex(j, output, GaussianClassificationAlg.MAX, origin.metaClass().dependencies()), trainingSet[i][j]);
                                        state.set(this.getIndex(j, output, GaussianClassificationAlg.SUM, origin.metaClass().dependencies()), trainingSet[i][j]);
                                        state.set(this.getIndex(j, output, GaussianClassificationAlg.SUMSQUARE, origin.metaClass().dependencies()), trainingSet[i][j] * trainingSet[i][j]);
                                    }
                                    else {
                                        if (trainingSet[i][j] < state.get(this.getIndex(j, output, GaussianClassificationAlg.MIN, origin.metaClass().dependencies()))) {
                                            state.set(this.getIndex(j, output, GaussianClassificationAlg.MIN, origin.metaClass().dependencies()), trainingSet[i][j]);
                                        }
                                        if (trainingSet[i][j] > state.get(this.getIndex(j, output, GaussianClassificationAlg.MAX, origin.metaClass().dependencies()))) {
                                            state.set(this.getIndex(j, output, GaussianClassificationAlg.MAX, origin.metaClass().dependencies()), trainingSet[i][j]);
                                        }
                                        state.add(this.getIndex(j, output, GaussianClassificationAlg.SUM, origin.metaClass().dependencies()), trainingSet[i][j]);
                                        state.add(this.getIndex(j, output, GaussianClassificationAlg.SUMSQUARE, origin.metaClass().dependencies()), trainingSet[i][j] * trainingSet[i][j]);
                                    }
                                    if (state.get(this.getCounter(maxOutput, origin.metaClass().dependencies())) == 0) {
                                        state.set(this.getIndex(j, maxOutput, GaussianClassificationAlg.MIN, origin.metaClass().dependencies()), trainingSet[i][j]);
                                        state.set(this.getIndex(j, maxOutput, GaussianClassificationAlg.MAX, origin.metaClass().dependencies()), trainingSet[i][j]);
                                        state.set(this.getIndex(j, maxOutput, GaussianClassificationAlg.SUM, origin.metaClass().dependencies()), trainingSet[i][j]);
                                        state.set(this.getIndex(j, maxOutput, GaussianClassificationAlg.SUMSQUARE, origin.metaClass().dependencies()), trainingSet[i][j] * trainingSet[i][j]);
                                    }
                                    else {
                                        if (trainingSet[i][j] < state.get(this.getIndex(j, maxOutput, GaussianClassificationAlg.MIN, origin.metaClass().dependencies()))) {
                                            state.set(this.getIndex(j, maxOutput, GaussianClassificationAlg.MIN, origin.metaClass().dependencies()), trainingSet[i][j]);
                                        }
                                        if (trainingSet[i][j] > state.get(this.getIndex(j, maxOutput, GaussianClassificationAlg.MAX, origin.metaClass().dependencies()))) {
                                            state.set(this.getIndex(j, maxOutput, GaussianClassificationAlg.MAX, origin.metaClass().dependencies()), trainingSet[i][j]);
                                        }
                                        state.add(this.getIndex(j, maxOutput, GaussianClassificationAlg.SUM, origin.metaClass().dependencies()), trainingSet[i][j]);
                                        state.add(this.getIndex(j, maxOutput, GaussianClassificationAlg.SUMSQUARE, origin.metaClass().dependencies()), trainingSet[i][j] * trainingSet[i][j]);
                                    }
                                }
                                state.add(this.getCounter(output, origin.metaClass().dependencies()), 1);
                                state.add(this.getCounter(maxOutput, origin.metaClass().dependencies()), 1);
                            }
                        };
                        GaussianClassificationAlg.prototype.infer = function (features, origin) {
                            var maxOutput = origin.metaClass().outputs()[0].type().literals().length;
                            var ks = origin.manager().segment(origin.universe(), origin.now(), origin.uuid(), false, origin.metaClass(), null);
                            var dependenciesIndex = origin.metaClass().dependencies().index();
                            var size = (maxOutput + 1) * (origin.metaClass().inputs().length * GaussianClassificationAlg.NUMOFFIELDS + 1);
                            if (ks.getInferSize(dependenciesIndex, origin.metaClass()) == 0) {
                                return null;
                            }
                            var state = new org.kevoree.modeling.util.maths.structure.impl.Array1D(size, 0, origin.metaClass().dependencies().index(), ks, origin.metaClass());
                            var result = new Array(new Array());
                            for (var j = 0; j < features.length; j++) {
                                result[j] = new Array();
                                var maxprob = 0;
                                var prob = 0;
                                for (var output = 0; output < maxOutput; output++) {
                                    prob = this.getProba(features[j], output, state, origin.metaClass().dependencies());
                                    if (prob > maxprob) {
                                        maxprob = prob;
                                        result[j][0] = output;
                                    }
                                }
                            }
                            return result;
                        };
                        GaussianClassificationAlg.prototype.getProba = function (features, output, state, meta) {
                            var prob = 0;
                            var avg = this.getAvg(output, state, meta);
                            var variance = this.getVariance(output, state, avg, meta);
                            prob = org.kevoree.modeling.util.maths.Distribution.gaussian(features, avg, variance);
                            return prob;
                        };
                        GaussianClassificationAlg.prototype.getAllProba = function (features, state, meta, maxOutput) {
                            var results = new Array();
                            for (var i = 0; i < maxOutput; i++) {
                                results[i] = this.getProba(features, i, state, meta);
                            }
                            return results;
                        };
                        GaussianClassificationAlg.MIN = 0;
                        GaussianClassificationAlg.MAX = 1;
                        GaussianClassificationAlg.SUM = 2;
                        GaussianClassificationAlg.SUMSQUARE = 3;
                        GaussianClassificationAlg.NUMOFFIELDS = 4;
                        return GaussianClassificationAlg;
                    })();
                    impl.GaussianClassificationAlg = GaussianClassificationAlg;
                    var KMeanClusterAlg = (function () {
                        function KMeanClusterAlg() {
                            this.k = 3;
                            this.iterations = 100;
                        }
                        KMeanClusterAlg.prototype.train = function (trainingSet, expectedResultSet, origin) {
                            if (trainingSet.length < this.k) {
                                throw new java.lang.RuntimeException("training set not enough");
                            }
                            var ks = origin.manager().segment(origin.universe(), origin.now(), origin.uuid(), false, origin.metaClass(), null);
                            var dependenciesIndex = origin.metaClass().dependencies().index();
                            var size = this.k * origin.metaClass().inputs().length;
                            if (ks.getInferSize(dependenciesIndex, origin.metaClass()) == 0) {
                                ks.extendInfer(origin.metaClass().dependencies().index(), size, origin.metaClass());
                                for (var i = 0; i < this.k; i++) {
                                    for (var j = 0; j < origin.metaClass().inputs().length; j++) {
                                        ks.setInferElem(dependenciesIndex, j + i * origin.metaClass().inputs().length, trainingSet[i][j], origin.metaClass());
                                    }
                                }
                            }
                            var state = new org.kevoree.modeling.util.maths.structure.impl.Array1D(size, 0, origin.metaClass().dependencies().index(), ks, origin.metaClass());
                            for (var iter = 0; iter < this.iterations; iter++) {
                                var temporalClassification;
                                var centroids = new Array(new Array());
                                var counters = new Array();
                                for (var j = 0; j < this.k; j++) {
                                    centroids[j] = new Array();
                                    counters[j] = 0;
                                }
                                for (var i = 0; i < trainingSet.length; i++) {
                                    temporalClassification = this.classify(trainingSet[i], state);
                                    for (var j = 0; j < origin.metaClass().inputs().length; j++) {
                                        centroids[temporalClassification][j] += trainingSet[i][j];
                                    }
                                    counters[temporalClassification]++;
                                }
                                for (var i = 0; i < this.k; i++) {
                                    if (counters[i] != 0) {
                                        for (var j = 0; j < origin.metaClass().inputs().length; j++) {
                                            state.set(j + i * origin.metaClass().inputs().length, centroids[i][j] / counters[i]);
                                        }
                                    }
                                    else {
                                        var rand = new java.util.Random();
                                        var pos = rand.nextInt(trainingSet.length);
                                        for (var j = 0; j < origin.metaClass().inputs().length; j++) {
                                            state.set(j + i * origin.metaClass().inputs().length, trainingSet[pos][j]);
                                        }
                                    }
                                }
                            }
                        };
                        KMeanClusterAlg.prototype.classify = function (features, state) {
                            var maxdistance = -1;
                            var classNum = -1;
                            for (var i = 0; i < this.k; i++) {
                                var currentdist = 0;
                                for (var j = 0; j < features.length; j++) {
                                    currentdist += (features[j] - state.get(i * features.length + j)) * (features[j] - state.get(i * features.length + j));
                                }
                                if (maxdistance < 0) {
                                    maxdistance = currentdist;
                                    classNum = i;
                                }
                                else {
                                    if (currentdist < maxdistance) {
                                        maxdistance = currentdist;
                                        classNum = i;
                                    }
                                }
                            }
                            return classNum;
                        };
                        KMeanClusterAlg.prototype.infer = function (features, origin) {
                            var ks = origin.manager().segment(origin.universe(), origin.now(), origin.uuid(), false, origin.metaClass(), null);
                            var dependenciesIndex = origin.metaClass().dependencies().index();
                            var size = this.k * origin.metaClass().inputs().length;
                            if (ks.getInferSize(dependenciesIndex, origin.metaClass()) == 0) {
                                return null;
                            }
                            var state = new org.kevoree.modeling.util.maths.structure.impl.Array1D(size, 0, origin.metaClass().dependencies().index(), ks, origin.metaClass());
                            var result = new Array(new Array());
                            for (var inst = 0; inst < features.length; inst++) {
                                result[inst] = new Array();
                                result[inst][0] = this.classify(features[inst], state);
                            }
                            return result;
                        };
                        return KMeanClusterAlg;
                    })();
                    impl.KMeanClusterAlg = KMeanClusterAlg;
                    var LinearRegressionAlg = (function () {
                        function LinearRegressionAlg() {
                            this.alpha = 0.005;
                            this.gamma = 0.000;
                            this.iterations = 10;
                        }
                        LinearRegressionAlg.prototype.train = function (trainingSet, expectedResultSet, origin) {
                            var ks = origin.manager().segment(origin.universe(), origin.now(), origin.uuid(), false, origin.metaClass(), null);
                            var dependenciesIndex = origin.metaClass().dependencies().index();
                            var size = origin.metaClass().inputs().length + 1;
                            if (ks.getInferSize(dependenciesIndex, origin.metaClass()) == 0) {
                                ks.extendInfer(origin.metaClass().dependencies().index(), size, origin.metaClass());
                                for (var i = 0; i < size; i++) {
                                    ks.setInferElem(dependenciesIndex, i, LinearRegressionAlg.rand.nextDouble(), origin.metaClass());
                                }
                            }
                            var state = new org.kevoree.modeling.util.maths.structure.impl.Array1D(size, 0, origin.metaClass().dependencies().index(), ks, origin.metaClass());
                            for (var i = 0; i < this.iterations; i++) {
                                for (var row = 0; row < trainingSet.length; row++) {
                                    var h = this.estimate(trainingSet[row], state);
                                    var error = -this.alpha * (h - expectedResultSet[row][0]);
                                    for (var feature = 0; feature < origin.metaClass().inputs().length; feature++) {
                                        state.set(feature, state.get(feature) * (1 - this.alpha * this.gamma) + error * trainingSet[row][feature]);
                                    }
                                    state.add(origin.metaClass().inputs().length, error);
                                }
                            }
                        };
                        LinearRegressionAlg.prototype.estimate = function (training, state) {
                            var result = 0;
                            for (var i = 0; i < training.length; i++) {
                                result = result + training[i] * state.get(i);
                            }
                            result = result + state.get(training.length);
                            return result;
                        };
                        LinearRegressionAlg.prototype.infer = function (features, origin) {
                            var ks = origin.manager().segment(origin.universe(), origin.now(), origin.uuid(), false, origin.metaClass(), null);
                            var dependenciesIndex = origin.metaClass().dependencies().index();
                            var size = origin.metaClass().inputs().length + 1;
                            if (ks.getInferSize(dependenciesIndex, origin.metaClass()) == 0) {
                                return null;
                            }
                            var state = new org.kevoree.modeling.util.maths.structure.impl.Array1D(size, 0, origin.metaClass().dependencies().index(), ks, origin.metaClass());
                            var results = new Array(new Array());
                            for (var i = 0; i < features.length; i++) {
                                results[i] = new Array();
                                results[i][0] = this.estimate(features[i], state);
                            }
                            return results;
                        };
                        LinearRegressionAlg.rand = new java.util.Random();
                        return LinearRegressionAlg;
                    })();
                    impl.LinearRegressionAlg = LinearRegressionAlg;
                    var StatInferAlg = (function () {
                        function StatInferAlg() {
                        }
                        StatInferAlg.prototype.train = function (trainingSet, expectedResultSet, origin) {
                            var ks = origin.manager().segment(origin.universe(), origin.now(), origin.uuid(), false, origin.metaClass(), null);
                            var dependenciesIndex = origin.metaClass().dependencies().index();
                            if (ks.getInferSize(dependenciesIndex, origin.metaClass()) == 0) {
                                ks.extendInfer(dependenciesIndex, StatInferAlg.NUMOFFIELDS * origin.metaClass().inputs().length + 1, origin.metaClass());
                                for (var i = 0; i < StatInferAlg.NUMOFFIELDS * origin.metaClass().inputs().length + 1; i++) {
                                    ks.setInferElem(dependenciesIndex, i, 0, origin.metaClass());
                                }
                            }
                            var state = new org.kevoree.modeling.util.maths.structure.impl.Array1D(StatInferAlg.NUMOFFIELDS * trainingSet[0].length + 1, 0, dependenciesIndex, ks, origin.metaClass());
                            for (var i = 0; i < trainingSet.length; i++) {
                                for (var j = 0; j < origin.metaClass().inputs().length; j++) {
                                    if (state.get(StatInferAlg.NUMOFFIELDS * trainingSet[0].length) == 0) {
                                        state.set(StatInferAlg.MIN + j * StatInferAlg.NUMOFFIELDS, trainingSet[i][j]);
                                        state.set(StatInferAlg.MAX + j * StatInferAlg.NUMOFFIELDS, trainingSet[i][j]);
                                        state.set(StatInferAlg.SUM + j * StatInferAlg.NUMOFFIELDS, trainingSet[i][j]);
                                        state.set(StatInferAlg.SUMSQuare + j * StatInferAlg.NUMOFFIELDS, trainingSet[i][j] * trainingSet[i][j]);
                                    }
                                    else {
                                        if (trainingSet[i][j] < state.get(StatInferAlg.MIN + j * StatInferAlg.NUMOFFIELDS)) {
                                            state.set(StatInferAlg.MIN + j * StatInferAlg.NUMOFFIELDS, trainingSet[i][j]);
                                        }
                                        if (trainingSet[i][j] > state.get(StatInferAlg.MAX + j * StatInferAlg.NUMOFFIELDS)) {
                                            state.set(StatInferAlg.MAX + j * StatInferAlg.NUMOFFIELDS, trainingSet[i][j]);
                                        }
                                        state.add(StatInferAlg.SUM + j * StatInferAlg.NUMOFFIELDS, trainingSet[i][j]);
                                        state.add(StatInferAlg.SUMSQuare + j * StatInferAlg.NUMOFFIELDS, trainingSet[i][j] * trainingSet[i][j]);
                                    }
                                }
                                state.add(StatInferAlg.NUMOFFIELDS * origin.metaClass().inputs().length, 1);
                            }
                        };
                        StatInferAlg.prototype.infer = function (features, origin) {
                            var ks = origin.manager().segment(origin.universe(), origin.now(), origin.uuid(), false, origin.metaClass(), null);
                            var result = new Array();
                            result[0] = this.getAvgAll(ks, origin.metaClass().dependencies());
                            return result;
                        };
                        StatInferAlg.prototype.getAvgAll = function (ks, meta) {
                            var result = new Array();
                            for (var i = 0; i < meta.origin().inputs().length; i++) {
                                result[i] = this.getAvg(i, ks, meta);
                            }
                            return result;
                        };
                        StatInferAlg.prototype.getMinAll = function (ks, meta) {
                            var result = new Array();
                            for (var i = 0; i < meta.origin().inputs().length; i++) {
                                result[i] = this.getMin(i, ks, meta);
                            }
                            return result;
                        };
                        StatInferAlg.prototype.getMaxAll = function (ks, meta) {
                            var result = new Array();
                            for (var i = 0; i < meta.origin().inputs().length; i++) {
                                result[i] = this.getMax(i, ks, meta);
                            }
                            return result;
                        };
                        StatInferAlg.prototype.getVarianceAll = function (ks, meta, avgs) {
                            var result = new Array();
                            for (var i = 0; i < meta.origin().inputs().length; i++) {
                                result[i] = this.getVariance(i, ks, meta, avgs[i]);
                            }
                            return result;
                        };
                        StatInferAlg.prototype.getAvg = function (featureNum, ks, meta) {
                            if (ks.getInferSize(meta.index(), meta.origin()) == 0) {
                                return 0;
                            }
                            var count = ks.getInferElem(meta.index(), ks.getInferSize(meta.index(), meta.origin()) - 1, meta.origin());
                            if (count == 0) {
                                return 0;
                            }
                            return ks.getInferElem(meta.index(), featureNum * StatInferAlg.NUMOFFIELDS + StatInferAlg.SUM, meta.origin()) / count;
                        };
                        StatInferAlg.prototype.getMin = function (featureNum, ks, meta) {
                            if (ks.getInferSize(meta.index(), meta.origin()) == 0) {
                                return 0;
                            }
                            var count = ks.getInferElem(meta.index(), ks.getInferSize(meta.index(), meta.origin()) - 1, meta.origin());
                            if (count == 0) {
                                return 0;
                            }
                            return ks.getInferElem(meta.index(), featureNum * StatInferAlg.NUMOFFIELDS + StatInferAlg.MIN, meta.origin());
                        };
                        StatInferAlg.prototype.getMax = function (featureNum, ks, meta) {
                            if (ks.getInferSize(meta.index(), meta.origin()) == 0) {
                                return 0;
                            }
                            var count = ks.getInferElem(meta.index(), ks.getInferSize(meta.index(), meta.origin()) - 1, meta.origin());
                            if (count == 0) {
                                return 0;
                            }
                            return ks.getInferElem(meta.index(), featureNum * StatInferAlg.NUMOFFIELDS + StatInferAlg.MAX, meta.origin());
                        };
                        StatInferAlg.prototype.getVariance = function (featureNum, ks, meta, avg) {
                            if (ks.getInferSize(meta.index(), meta.origin()) == 0) {
                                return 0;
                            }
                            var count = ks.getInferElem(meta.index(), ks.getInferSize(meta.index(), meta.origin()) - 1, meta.origin());
                            if (count == 0) {
                                return 0;
                            }
                            return ks.getInferElem(meta.index(), featureNum * StatInferAlg.NUMOFFIELDS + StatInferAlg.SUMSQuare, meta.origin()) / count - avg * avg;
                        };
                        StatInferAlg.MIN = 0;
                        StatInferAlg.MAX = 1;
                        StatInferAlg.SUM = 2;
                        StatInferAlg.SUMSQuare = 3;
                        StatInferAlg.NUMOFFIELDS = 4;
                        return StatInferAlg;
                    })();
                    impl.StatInferAlg = StatInferAlg;
                    var WinnowAlg = (function () {
                        function WinnowAlg() {
                            this.alpha = 2;
                            this.beta = 2;
                            this.iterations = 1;
                            this.rand = new java.util.Random();
                        }
                        WinnowAlg.prototype.train = function (trainingSet, expectedResultSet, origin) {
                            var ks = origin.manager().segment(origin.universe(), origin.now(), origin.uuid(), false, origin.metaClass(), null);
                            var dependenciesIndex = origin.metaClass().dependencies().index();
                            var size = origin.metaClass().inputs().length;
                            if (ks.getInferSize(dependenciesIndex, origin.metaClass()) == 0) {
                                ks.extendInfer(origin.metaClass().dependencies().index(), size, origin.metaClass());
                                for (var i = 0; i < size; i++) {
                                    ks.setInferElem(dependenciesIndex, i, this.rand.nextDouble(), origin.metaClass());
                                }
                            }
                            var state = new org.kevoree.modeling.util.maths.structure.impl.Array1D(size, 0, origin.metaClass().dependencies().index(), ks, origin.metaClass());
                            for (var iter = 0; iter < this.iterations; iter++) {
                                for (var inst = 0; inst < trainingSet.length; inst++) {
                                    if (this.calculate(trainingSet[inst], state) == expectedResultSet[inst][0]) {
                                        continue;
                                    }
                                    if (expectedResultSet[inst][0] == 0) {
                                        for (var i = 0; i < size; i++) {
                                            state.set(i, state.get(i) / this.beta);
                                        }
                                    }
                                    else {
                                        for (var i = 0; i < size; i++) {
                                            state.set(i, state.get(i) * this.alpha);
                                        }
                                    }
                                }
                            }
                        };
                        WinnowAlg.prototype.calculate = function (features, state) {
                            var result = 0;
                            for (var i = 0; i < features.length; i++) {
                                result += state.get(i) * features[i];
                            }
                            if (result >= features.length) {
                                return 1.0;
                            }
                            else {
                                return 0.0;
                            }
                        };
                        WinnowAlg.prototype.infer = function (features, origin) {
                            var ks = origin.manager().segment(origin.universe(), origin.now(), origin.uuid(), false, origin.metaClass(), null);
                            var dependenciesIndex = origin.metaClass().dependencies().index();
                            var size = origin.metaClass().inputs().length;
                            if (ks.getInferSize(dependenciesIndex, origin.metaClass()) == 0) {
                                return null;
                            }
                            var state = new org.kevoree.modeling.util.maths.structure.impl.Array1D(size, 0, origin.metaClass().dependencies().index(), ks, origin.metaClass());
                            var result = new Array(new Array());
                            for (var inst = 0; inst < features.length; inst++) {
                                result[inst] = new Array();
                                result[inst][0] = this.calculate(features[inst], state);
                            }
                            return result;
                        };
                        return WinnowAlg;
                    })();
                    impl.WinnowAlg = WinnowAlg;
                })(impl = infer.impl || (infer.impl = {}));
            })(infer = modeling.infer || (modeling.infer = {}));
            var memory;
            (function (memory) {
                var manager;
                (function (manager) {
                    var impl;
                    (function (impl) {
                        var KeyCalculator = (function () {
                            function KeyCalculator(prefix, currentIndex) {
                                this._prefix = "0x" + prefix.toString(org.kevoree.modeling.KConfig.PREFIX_SIZE);
                                this._currentIndex = currentIndex;
                            }
                            KeyCalculator.prototype.nextKey = function () {
                                if (this._currentIndex == org.kevoree.modeling.KConfig.KEY_PREFIX_MASK) {
                                    throw new java.lang.IndexOutOfBoundsException("Object Index could not be created because it exceeded the capacity of the current prefix. Ask for a new prefix.");
                                }
                                this._currentIndex++;
                                var indexHex = this._currentIndex.toString(org.kevoree.modeling.KConfig.PREFIX_SIZE);
                                var objectKey = parseInt(this._prefix + "000000000".substring(0, 9 - indexHex.length) + indexHex, org.kevoree.modeling.KConfig.PREFIX_SIZE);
                                if (objectKey >= org.kevoree.modeling.KConfig.NULL_LONG) {
                                    throw new java.lang.IndexOutOfBoundsException("Object Index exceeds teh maximum JavaScript number capacity. (2^" + org.kevoree.modeling.KConfig.LONG_SIZE + ")");
                                }
                                return objectKey;
                            };
                            KeyCalculator.prototype.lastComputedIndex = function () {
                                return this._currentIndex;
                            };
                            KeyCalculator.prototype.prefix = function () {
                                return parseInt(this._prefix, org.kevoree.modeling.KConfig.PREFIX_SIZE);
                            };
                            return KeyCalculator;
                        })();
                        impl.KeyCalculator = KeyCalculator;
                        var LookupAllObjectsRunnable = (function () {
                            function LookupAllObjectsRunnable(p_universe, p_time, p_keys, p_callback, p_store) {
                                this._universe = p_universe;
                                this._time = p_time;
                                this._keys = p_keys;
                                this._callback = p_callback;
                                this._store = p_store;
                            }
                            LookupAllObjectsRunnable.prototype.run = function () {
                                var _this = this;
                                var tempKeys = new Array();
                                for (var i = 0; i < this._keys.length; i++) {
                                    if (this._keys[i] != org.kevoree.modeling.KConfig.NULL_LONG) {
                                        tempKeys[i] = org.kevoree.modeling.KContentKey.createUniverseTree(this._keys[i]);
                                    }
                                }
                                this._store.bumpKeysToCache(tempKeys, function (universeIndexes) {
                                    for (var i = 0; i < _this._keys.length; i++) {
                                        var toLoadKey = null;
                                        if (universeIndexes[i] != null) {
                                            var globalUniverseTree = _this._store.cache().get(org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG);
                                            var closestUniverse = org.kevoree.modeling.memory.manager.impl.ResolutionHelper.resolve_universe(globalUniverseTree, universeIndexes[i], _this._time, _this._universe);
                                            toLoadKey = org.kevoree.modeling.KContentKey.createTimeTree(closestUniverse, _this._keys[i]);
                                        }
                                        tempKeys[i] = toLoadKey;
                                    }
                                    _this._store.bumpKeysToCache(tempKeys, function (timeIndexes) {
                                        for (var i = 0; i < _this._keys.length; i++) {
                                            var resolvedContentKey = null;
                                            if (timeIndexes[i] != null) {
                                                var cachedIndexTree = timeIndexes[i];
                                                var resolvedNode = cachedIndexTree.previousOrEqual(_this._time);
                                                if (resolvedNode != org.kevoree.modeling.KConfig.NULL_LONG) {
                                                    resolvedContentKey = org.kevoree.modeling.KContentKey.createObject(tempKeys[i].universe, resolvedNode, _this._keys[i]);
                                                }
                                            }
                                            tempKeys[i] = resolvedContentKey;
                                        }
                                        _this._store.bumpKeysToCache(tempKeys, function (cachedObjects) {
                                            var proxies = new Array();
                                            for (var i = 0; i < _this._keys.length; i++) {
                                                if (cachedObjects[i] != null) {
                                                    proxies[i] = _this._store.model().createProxy(_this._universe, _this._time, _this._keys[i], _this._store.model().metaModel().metaClasses()[cachedObjects[i].metaClassIndex()]);
                                                    if (proxies[i] != null) {
                                                        var cachedIndexTree = timeIndexes[i];
                                                        cachedIndexTree.inc();
                                                        var universeTree = universeIndexes[i];
                                                        universeTree.inc();
                                                        cachedObjects[i].inc();
                                                    }
                                                }
                                            }
                                            _this._callback(proxies);
                                        });
                                    });
                                });
                            };
                            return LookupAllObjectsRunnable;
                        })();
                        impl.LookupAllObjectsRunnable = LookupAllObjectsRunnable;
                        var LookupAllObjectsTimesRunnable = (function () {
                            function LookupAllObjectsTimesRunnable(p_universe, p_times, p_keys, p_callback, p_store) {
                                this._universe = p_universe;
                                this._times = p_times;
                                this._keys = p_keys;
                                this._callback = p_callback;
                                this._store = p_store;
                            }
                            LookupAllObjectsTimesRunnable.prototype.run = function () {
                                var _this = this;
                                var tempKeys = new Array();
                                for (var i = 0; i < this._keys.length; i++) {
                                    if (this._keys[i] != org.kevoree.modeling.KConfig.NULL_LONG) {
                                        tempKeys[i] = org.kevoree.modeling.KContentKey.createUniverseTree(this._keys[i]);
                                    }
                                }
                                this._store.bumpKeysToCache(tempKeys, function (universeIndexes) {
                                    var tempKeys2 = new Array();
                                    for (var i = 0; i < _this._keys.length; i++) {
                                        for (var j = 0; j < _this._times.length; j++) {
                                            if (universeIndexes[i] != null) {
                                                var globalUniverseTree = _this._store.cache().get(org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG);
                                                tempKeys2[(i * _this._times.length) + j] = org.kevoree.modeling.KContentKey.createTimeTree(org.kevoree.modeling.memory.manager.impl.ResolutionHelper.resolve_universe(globalUniverseTree, universeIndexes[i], _this._times[j], _this._universe), _this._keys[i]);
                                            }
                                        }
                                    }
                                    _this._store.bumpKeysToCache(tempKeys2, function (timeIndexes) {
                                        for (var i = 0; i < _this._keys.length; i++) {
                                            for (var j = 0; j < _this._times.length; j++) {
                                                var resolvedContentKey = null;
                                                if (timeIndexes[i] != null) {
                                                    var cachedIndexTree = timeIndexes[i];
                                                    var resolvedNode = cachedIndexTree.previousOrEqual(_this._times[j]);
                                                    if (resolvedNode != org.kevoree.modeling.KConfig.NULL_LONG) {
                                                        resolvedContentKey = org.kevoree.modeling.KContentKey.createObject(tempKeys2[i].universe, resolvedNode, _this._keys[i]);
                                                    }
                                                }
                                                tempKeys2[(i * _this._times.length) + j] = resolvedContentKey;
                                            }
                                        }
                                        _this._store.bumpKeysToCache(tempKeys2, function (cachedObjects) {
                                            var proxies = new Array();
                                            for (var i = 0; i < _this._keys.length; i++) {
                                                for (var j = 0; j < _this._times.length; j++) {
                                                    if (cachedObjects[(i * _this._times.length) + j] != null) {
                                                        proxies[(i * _this._times.length) + j] = _this._store.model().createProxy(_this._universe, _this._times[j], _this._keys[i], _this._store.model().metaModel().metaClasses()[cachedObjects[i].metaClassIndex()]);
                                                        if (proxies[(i * _this._times.length) + j] != null) {
                                                            var cachedIndexTree = timeIndexes[(i * _this._times.length) + j];
                                                            cachedIndexTree.inc();
                                                            var universeTree = universeIndexes[i];
                                                            universeTree.inc();
                                                            cachedObjects[(i * _this._times.length) + j].inc();
                                                        }
                                                    }
                                                }
                                            }
                                            _this._callback(proxies);
                                        });
                                    });
                                });
                            };
                            return LookupAllObjectsTimesRunnable;
                        })();
                        impl.LookupAllObjectsTimesRunnable = LookupAllObjectsTimesRunnable;
                        var LookupAllTimesRunnable = (function () {
                            function LookupAllTimesRunnable(p_universe, p_times, p_key, p_callback, p_store) {
                                this._universe = p_universe;
                                this._times = p_times;
                                this._uuid = p_key;
                                this._callback = p_callback;
                                this._store = p_store;
                            }
                            LookupAllTimesRunnable.prototype.run = function () {
                                var _this = this;
                                this._store.bumpKeyToCache(org.kevoree.modeling.KContentKey.createUniverseTree(this._uuid), function (universeIndex) {
                                    var map = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                    var mapReverse = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                    var ii = [0];
                                    for (var i = 0; i < _this._times.length; i++) {
                                        if (universeIndex != null) {
                                            var globalUniverseTree = _this._store.cache().get(org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG);
                                            var resolved = org.kevoree.modeling.memory.manager.impl.ResolutionHelper.resolve_universe(globalUniverseTree, universeIndex, _this._times[i], _this._universe);
                                            var alreadyInMap = map.get(resolved);
                                            if (alreadyInMap == org.kevoree.modeling.KConfig.NULL_LONG) {
                                                mapReverse.put(_this._times[i], ii[0]);
                                                map.put(resolved, ii[0]);
                                                ii[0]++;
                                            }
                                            else {
                                                mapReverse.put(_this._times[i], alreadyInMap);
                                            }
                                        }
                                    }
                                    var tempKeys = new Array();
                                    map.each(function (key, value) {
                                        tempKeys[value] = org.kevoree.modeling.KContentKey.createTimeTree(key, _this._uuid);
                                    });
                                    _this._store.bumpKeysToCache(tempKeys, function (timeIndexes) {
                                        var tempKeys2 = new Array();
                                        for (var i = 0; i < _this._times.length; i++) {
                                            var reversed = mapReverse.get(_this._times[i]);
                                            var resolvedContentKey = null;
                                            if (timeIndexes[reversed] != null) {
                                                var cachedIndexTree = timeIndexes[reversed];
                                                var resolvedNode = cachedIndexTree.previousOrEqual(_this._times[i]);
                                                if (resolvedNode != org.kevoree.modeling.KConfig.NULL_LONG) {
                                                    resolvedContentKey = org.kevoree.modeling.KContentKey.createObject(tempKeys[reversed].universe, resolvedNode, _this._uuid);
                                                }
                                            }
                                            tempKeys2[i] = resolvedContentKey;
                                        }
                                        _this._store.bumpKeysToCache(tempKeys2, function (cachedObjects) {
                                            var proxies = new Array();
                                            for (var i = 0; i < _this._times.length; i++) {
                                                if (cachedObjects[i] != null) {
                                                    proxies[i] = _this._store.model().createProxy(_this._universe, _this._times[i], _this._uuid, _this._store.model().metaModel().metaClasses()[cachedObjects[i].metaClassIndex()]);
                                                    if (proxies[i] != null) {
                                                        var reversed = mapReverse.get(_this._times[i]);
                                                        var cachedIndexTree = timeIndexes[reversed];
                                                        cachedIndexTree.inc();
                                                        var universeTree = universeIndex;
                                                        universeTree.inc();
                                                        cachedObjects[i].inc();
                                                    }
                                                }
                                            }
                                            _this._callback(proxies);
                                        });
                                    });
                                });
                            };
                            return LookupAllTimesRunnable;
                        })();
                        impl.LookupAllTimesRunnable = LookupAllTimesRunnable;
                        var MemoryManager = (function () {
                            function MemoryManager(model) {
                                this._objectKeyCalculator = null;
                                this._universeKeyCalculator = null;
                                this.isConnected = false;
                                this._factory = new org.kevoree.modeling.memory.struct.HeapMemoryFactory();
                                this._cache = this._factory.newCache();
                                this._modelKeyCalculator = new org.kevoree.modeling.memory.manager.impl.KeyCalculator(MemoryManager.zeroPrefix, 0);
                                this._groupKeyCalculator = new org.kevoree.modeling.memory.manager.impl.KeyCalculator(MemoryManager.zeroPrefix, 0);
                                this._db = new org.kevoree.modeling.cdn.impl.MemoryContentDeliveryDriver();
                                this._db.setManager(this);
                                this._operationManager = new org.kevoree.modeling.operation.impl.HashOperationManager(this);
                                this._scheduler = new org.kevoree.modeling.scheduler.impl.DirectScheduler();
                                this._model = model;
                            }
                            MemoryManager.prototype.cache = function () {
                                return this._cache;
                            };
                            MemoryManager.prototype.model = function () {
                                return this._model;
                            };
                            MemoryManager.prototype.close = function (callback) {
                                this.isConnected = false;
                                if (this._db != null) {
                                    this._db.close(callback);
                                }
                                else {
                                    callback(null);
                                }
                            };
                            MemoryManager.prototype.nextUniverseKey = function () {
                                if (this._universeKeyCalculator == null) {
                                    throw new java.lang.RuntimeException(MemoryManager.UNIVERSE_NOT_CONNECTED_ERROR);
                                }
                                return this._universeKeyCalculator.nextKey();
                            };
                            MemoryManager.prototype.nextObjectKey = function () {
                                if (this._objectKeyCalculator == null) {
                                    throw new java.lang.RuntimeException(MemoryManager.UNIVERSE_NOT_CONNECTED_ERROR);
                                }
                                return this._objectKeyCalculator.nextKey();
                            };
                            MemoryManager.prototype.nextModelKey = function () {
                                if (this._modelKeyCalculator == null) {
                                    throw new java.lang.RuntimeException(MemoryManager.UNIVERSE_NOT_CONNECTED_ERROR);
                                }
                                return this._modelKeyCalculator.nextKey();
                            };
                            MemoryManager.prototype.nextGroupKey = function () {
                                if (this._groupKeyCalculator == null) {
                                    throw new java.lang.RuntimeException(MemoryManager.UNIVERSE_NOT_CONNECTED_ERROR);
                                }
                                return this._groupKeyCalculator.nextKey();
                            };
                            MemoryManager.prototype.initUniverse = function (p_universe, p_parent) {
                                var cached = this._cache.get(org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG);
                                if (cached != null && !cached.contains(p_universe.key())) {
                                    if (p_parent == null) {
                                        cached.put(p_universe.key(), p_universe.key());
                                    }
                                    else {
                                        cached.put(p_universe.key(), p_parent.key());
                                    }
                                }
                            };
                            MemoryManager.prototype.parentUniverseKey = function (currentUniverseKey) {
                                var cached = this._cache.get(org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG);
                                if (cached != null) {
                                    return cached.get(currentUniverseKey);
                                }
                                else {
                                    return org.kevoree.modeling.KConfig.NULL_LONG;
                                }
                            };
                            MemoryManager.prototype.descendantsUniverseKeys = function (currentUniverseKey) {
                                var cached = this._cache.get(org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG);
                                if (cached != null) {
                                    var temp = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                    cached.each(function (key, value) {
                                        if (value == currentUniverseKey && key != currentUniverseKey) {
                                            temp.put(key, value);
                                        }
                                    });
                                    var result = new Array();
                                    var insertIndex = [0];
                                    temp.each(function (key, value) {
                                        result[insertIndex[0]] = key;
                                        insertIndex[0]++;
                                    });
                                    return result;
                                }
                                else {
                                    return new Array();
                                }
                            };
                            MemoryManager.prototype.save = function (callback) {
                                var _this = this;
                                var dirtiesEntries = this._cache.dirties();
                                var request = new org.kevoree.modeling.cdn.impl.ContentPutRequest(dirtiesEntries.length + 2);
                                var notificationMessages = new org.kevoree.modeling.message.impl.Events(dirtiesEntries.length, this.prefix);
                                for (var i = 0; i < dirtiesEntries.length; i++) {
                                    var cachedObject = dirtiesEntries[i].object;
                                    notificationMessages.setEvent(i, dirtiesEntries[i].key, null);
                                    request.put(dirtiesEntries[i].key, cachedObject.serialize(this._model.metaModel()));
                                    cachedObject.setClean(this._model.metaModel());
                                }
                                request.put(org.kevoree.modeling.KContentKey.createLastObjectIndexFromPrefix(this._objectKeyCalculator.prefix()), "" + this._objectKeyCalculator.lastComputedIndex());
                                request.put(org.kevoree.modeling.KContentKey.createLastUniverseIndexFromPrefix(this._universeKeyCalculator.prefix()), "" + this._universeKeyCalculator.lastComputedIndex());
                                this._db.put(request, function (throwable) {
                                    if (throwable == null) {
                                        _this._db.send(notificationMessages);
                                    }
                                    if (callback != null) {
                                        callback(throwable);
                                    }
                                });
                            };
                            MemoryManager.prototype.initKObject = function (obj) {
                                var cacheEntry = this._factory.newCacheSegment();
                                cacheEntry.initMetaClass(obj.metaClass());
                                cacheEntry.init(null, this.model().metaModel());
                                cacheEntry.setDirty();
                                cacheEntry.inc();
                                var timeTree = this._factory.newLongTree();
                                timeTree.init(null, this.model().metaModel());
                                timeTree.inc();
                                timeTree.insert(obj.now());
                                var universeTree = this._factory.newUniverseMap(0, obj.metaClass().metaName());
                                universeTree.init(null, this.model().metaModel());
                                universeTree.inc();
                                universeTree.put(obj.universe(), obj.now());
                                this._cache.getOrPut(obj.universe(), org.kevoree.modeling.KConfig.NULL_LONG, obj.uuid(), timeTree);
                                this._cache.getOrPut(org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG, obj.uuid(), universeTree);
                                this._cache.getOrPut(obj.universe(), obj.now(), obj.uuid(), cacheEntry);
                            };
                            MemoryManager.prototype.connect = function (connectCallback) {
                                var _this = this;
                                if (this.isConnected) {
                                    if (connectCallback != null) {
                                        connectCallback(null);
                                    }
                                }
                                if (this._db == null) {
                                    if (connectCallback != null) {
                                        connectCallback(new java.lang.Exception("Please attach a KDataBase AND a KBroker first !"));
                                    }
                                }
                                else {
                                    this._db.connect(function (throwable) {
                                        if (throwable == null) {
                                            _this._db.atomicGetIncrement(org.kevoree.modeling.KContentKey.createLastPrefix(), function (newPrefix) {
                                                var connectionElemKeys = new Array();
                                                connectionElemKeys[MemoryManager.UNIVERSE_INDEX] = org.kevoree.modeling.KContentKey.createLastUniverseIndexFromPrefix(newPrefix);
                                                connectionElemKeys[MemoryManager.OBJ_INDEX] = org.kevoree.modeling.KContentKey.createLastObjectIndexFromPrefix(newPrefix);
                                                connectionElemKeys[MemoryManager.GLO_TREE_INDEX] = org.kevoree.modeling.KContentKey.createGlobalUniverseTree();
                                                _this.prefix = newPrefix;
                                                _this._db.get(connectionElemKeys, function (strings) {
                                                    if (strings.length == 3) {
                                                        var detected = null;
                                                        try {
                                                            var uniIndexPayload = strings[MemoryManager.UNIVERSE_INDEX];
                                                            if (uniIndexPayload == null || uniIndexPayload.equals("")) {
                                                                uniIndexPayload = "0";
                                                            }
                                                            var objIndexPayload = strings[MemoryManager.OBJ_INDEX];
                                                            if (objIndexPayload == null || objIndexPayload.equals("")) {
                                                                objIndexPayload = "0";
                                                            }
                                                            var globalUniverseTreePayload = strings[MemoryManager.GLO_TREE_INDEX];
                                                            var globalUniverseTree;
                                                            if (globalUniverseTreePayload != null) {
                                                                globalUniverseTree = _this._factory.newUniverseMap(0, null);
                                                                try {
                                                                    globalUniverseTree.init(globalUniverseTreePayload, _this.model().metaModel());
                                                                }
                                                                catch ($ex$) {
                                                                    if ($ex$ instanceof java.lang.Exception) {
                                                                        var e = $ex$;
                                                                        e.printStackTrace();
                                                                    }
                                                                    else {
                                                                        throw $ex$;
                                                                    }
                                                                }
                                                            }
                                                            else {
                                                                globalUniverseTree = _this._factory.newUniverseMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, null);
                                                            }
                                                            _this._cache.getOrPut(org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG, globalUniverseTree);
                                                            var newUniIndex = java.lang.Long.parseLong(uniIndexPayload);
                                                            var newObjIndex = java.lang.Long.parseLong(objIndexPayload);
                                                            _this._universeKeyCalculator = new org.kevoree.modeling.memory.manager.impl.KeyCalculator(_this.prefix, newUniIndex);
                                                            _this._objectKeyCalculator = new org.kevoree.modeling.memory.manager.impl.KeyCalculator(_this.prefix, newObjIndex);
                                                            _this.isConnected = true;
                                                        }
                                                        catch ($ex$) {
                                                            if ($ex$ instanceof java.lang.Exception) {
                                                                var e = $ex$;
                                                                detected = e;
                                                            }
                                                            else {
                                                                throw $ex$;
                                                            }
                                                        }
                                                        if (connectCallback != null) {
                                                            connectCallback(detected);
                                                        }
                                                    }
                                                    else {
                                                        if (connectCallback != null) {
                                                            connectCallback(new java.lang.Exception("Error while connecting the KDataStore..."));
                                                        }
                                                    }
                                                });
                                            });
                                        }
                                        else {
                                            if (connectCallback != null) {
                                                connectCallback(throwable);
                                            }
                                        }
                                    });
                                }
                            };
                            MemoryManager.prototype.segment = function (universe, requestedTime, uuid, resolvePreviousSegment, metaClass, resolutionTrace) {
                                var time = requestedTime;
                                if (metaClass.temporalResolution() != 1) {
                                    time = time - (time % metaClass.temporalResolution());
                                }
                                var currentEntry = this._cache.get(universe, time, uuid);
                                if (currentEntry != null) {
                                    if (resolutionTrace != null) {
                                        resolutionTrace.setSegment(currentEntry);
                                        resolutionTrace.setUniverse(universe);
                                        resolutionTrace.setTime(time);
                                        resolutionTrace.setUniverseOrder(this._cache.get(org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG, uuid));
                                        resolutionTrace.setTimeTree(this._cache.get(universe, org.kevoree.modeling.KConfig.NULL_LONG, uuid));
                                    }
                                    return currentEntry;
                                }
                                var objectUniverseTree = this._cache.get(org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG, uuid);
                                var globalUniverseTree = this._cache.get(org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG);
                                var resolvedUniverse = org.kevoree.modeling.memory.manager.impl.ResolutionHelper.resolve_universe(globalUniverseTree, objectUniverseTree, time, universe);
                                var timeTree = this._cache.get(resolvedUniverse, org.kevoree.modeling.KConfig.NULL_LONG, uuid);
                                if (timeTree == null) {
                                    throw new java.lang.RuntimeException(MemoryManager.OUT_OF_CACHE_MESSAGE + " : TimeTree not found for " + org.kevoree.modeling.KContentKey.createTimeTree(resolvedUniverse, uuid) + " from " + universe + "/" + resolvedUniverse);
                                }
                                var resolvedTime = timeTree.previousOrEqual(time);
                                if (resolutionTrace != null) {
                                    resolutionTrace.setUniverse(resolvedUniverse);
                                    resolutionTrace.setTime(resolvedTime);
                                    resolutionTrace.setUniverseOrder(objectUniverseTree);
                                    resolutionTrace.setTimeTree(timeTree);
                                }
                                if (resolvedTime != org.kevoree.modeling.KConfig.NULL_LONG) {
                                    var needTimeCopy = !resolvePreviousSegment && (resolvedTime != time);
                                    var needUniverseCopy = !resolvePreviousSegment && (resolvedUniverse != universe);
                                    var entry = this._cache.get(resolvedUniverse, resolvedTime, uuid);
                                    if (entry == null) {
                                        return null;
                                    }
                                    if (!needTimeCopy && !needUniverseCopy) {
                                        if (!resolvePreviousSegment) {
                                            entry.setDirty();
                                        }
                                        if (resolutionTrace != null) {
                                            resolutionTrace.setSegment(entry);
                                        }
                                        return entry;
                                    }
                                    else {
                                        var clonedEntry = entry.clone(metaClass);
                                        clonedEntry = this._cache.getOrPut(universe, time, uuid, clonedEntry);
                                        if (!needUniverseCopy) {
                                            timeTree.insert(time);
                                        }
                                        else {
                                            var newTemporalTree = this._factory.newLongTree();
                                            newTemporalTree.insert(time);
                                            newTemporalTree.inc();
                                            timeTree.dec();
                                            this._cache.getOrPut(universe, org.kevoree.modeling.KConfig.NULL_LONG, uuid, newTemporalTree);
                                            objectUniverseTree.put(universe, time);
                                        }
                                        entry.dec();
                                        clonedEntry.inc();
                                        if (resolutionTrace != null) {
                                            resolutionTrace.setSegment(clonedEntry);
                                        }
                                        return clonedEntry;
                                    }
                                }
                                else {
                                    System.err.println(MemoryManager.OUT_OF_CACHE_MESSAGE + " Time not resolved " + time);
                                    return null;
                                }
                            };
                            MemoryManager.prototype.discard = function (p_universe, callback) {
                                var _this = this;
                                var toReloadKeys = new Array();
                                toReloadKeys[0] = org.kevoree.modeling.KContentKey.createGlobalUniverseTree();
                                this._db.get(toReloadKeys, function (strings) {
                                    if (strings != null && strings.length > 0 && strings[0] != null) {
                                        var newObject = _this.internal_unserialize(toReloadKeys[0], strings[0]);
                                        var newCache = _this._factory.newCache();
                                        var oldCache = _this._cache;
                                        _this._cache = newCache;
                                        oldCache.delete(_this._model.metaModel());
                                        callback(null);
                                    }
                                });
                            };
                            MemoryManager.prototype.delete = function (p_universe, callback) {
                                throw new java.lang.RuntimeException("Not implemented yet !");
                            };
                            MemoryManager.prototype.lookup = function (universe, time, uuid, callback) {
                                var keys = new Array();
                                keys[0] = uuid;
                                this.lookupAllObjects(universe, time, keys, function (kObjects) {
                                    if (kObjects.length == 1) {
                                        if (callback != null) {
                                            callback(kObjects[0]);
                                        }
                                    }
                                    else {
                                        if (callback != null) {
                                            callback(null);
                                        }
                                    }
                                });
                            };
                            MemoryManager.prototype.lookupAllObjects = function (universe, time, uuids, callback) {
                                this._scheduler.dispatch(new org.kevoree.modeling.memory.manager.impl.LookupAllObjectsRunnable(universe, time, uuids, callback, this));
                            };
                            MemoryManager.prototype.lookupAllTimes = function (universe, times, uuid, callback) {
                                this._scheduler.dispatch(new org.kevoree.modeling.memory.manager.impl.LookupAllTimesRunnable(universe, times, uuid, callback, this));
                            };
                            MemoryManager.prototype.lookupAllObjectsTimes = function (universe, times, uuid, callback) {
                                this._scheduler.dispatch(new org.kevoree.modeling.memory.manager.impl.LookupAllObjectsTimesRunnable(universe, times, uuid, callback, this));
                            };
                            MemoryManager.prototype.cdn = function () {
                                return this._db;
                            };
                            MemoryManager.prototype.setContentDeliveryDriver = function (p_dataBase) {
                                this._db = p_dataBase;
                                p_dataBase.setManager(this);
                            };
                            MemoryManager.prototype.setScheduler = function (p_scheduler) {
                                if (p_scheduler != null) {
                                    this._scheduler = p_scheduler;
                                }
                            };
                            MemoryManager.prototype.operationManager = function () {
                                return this._operationManager;
                            };
                            MemoryManager.prototype.getRoot = function (universe, time, callback) {
                                var _this = this;
                                this.bumpKeyToCache(org.kevoree.modeling.KContentKey.createRootUniverseTree(), function (rootGlobalUniverseIndex) {
                                    if (rootGlobalUniverseIndex == null) {
                                        callback(null);
                                    }
                                    else {
                                        var globalUniverseTree = _this._cache.get(org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG);
                                        var closestUniverse = org.kevoree.modeling.memory.manager.impl.ResolutionHelper.resolve_universe(globalUniverseTree, rootGlobalUniverseIndex, time, universe);
                                        var universeTreeRootKey = org.kevoree.modeling.KContentKey.createRootTimeTree(closestUniverse);
                                        _this.bumpKeyToCache(universeTreeRootKey, function (universeTree) {
                                            if (universeTree == null) {
                                                callback(null);
                                            }
                                            else {
                                                var resolvedVal = universeTree.previousOrEqualValue(time);
                                                if (resolvedVal == org.kevoree.modeling.KConfig.NULL_LONG) {
                                                    callback(null);
                                                }
                                                else {
                                                    _this.lookup(universe, time, resolvedVal, callback);
                                                }
                                            }
                                        });
                                    }
                                });
                            };
                            MemoryManager.prototype.setRoot = function (newRoot, callback) {
                                var _this = this;
                                this.bumpKeyToCache(org.kevoree.modeling.KContentKey.createRootUniverseTree(), function (globalRootTree) {
                                    var cleanedTree = globalRootTree;
                                    if (cleanedTree == null) {
                                        cleanedTree = _this._factory.newUniverseMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, null);
                                        cleanedTree = _this._cache.getOrPut(org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.END_OF_TIME, cleanedTree);
                                    }
                                    var globalUniverseTree = _this._cache.get(org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG);
                                    var closestUniverse = org.kevoree.modeling.memory.manager.impl.ResolutionHelper.resolve_universe(globalUniverseTree, cleanedTree, newRoot.now(), newRoot.universe());
                                    cleanedTree.put(newRoot.universe(), newRoot.now());
                                    if (closestUniverse != newRoot.universe()) {
                                        var newTimeTree = _this._factory.newLongLongTree();
                                        newTimeTree.insert(newRoot.now(), newRoot.uuid());
                                        var universeTreeRootKey = org.kevoree.modeling.KContentKey.createRootTimeTree(newRoot.universe());
                                        _this._cache.getOrPut(universeTreeRootKey.universe, universeTreeRootKey.time, universeTreeRootKey.obj, newTimeTree);
                                        if (callback != null) {
                                            callback(null);
                                        }
                                    }
                                    else {
                                        var universeTreeRootKey = org.kevoree.modeling.KContentKey.createRootTimeTree(closestUniverse);
                                        _this.bumpKeyToCache(universeTreeRootKey, function (resolvedRootTimeTree) {
                                            var initializedTree = resolvedRootTimeTree;
                                            if (initializedTree == null) {
                                                initializedTree = _this._factory.newLongLongTree();
                                                initializedTree = _this._cache.getOrPut(universeTreeRootKey.universe, universeTreeRootKey.time, universeTreeRootKey.obj, initializedTree);
                                            }
                                            initializedTree.insert(newRoot.now(), newRoot.uuid());
                                            if (callback != null) {
                                                callback(null);
                                            }
                                        });
                                    }
                                });
                            };
                            MemoryManager.prototype.reload = function (keys, callback) {
                                var _this = this;
                                var toReload = new java.util.ArrayList();
                                for (var i = 0; i < keys.length; i++) {
                                    var cached = this._cache.get(keys[i].universe, keys[i].time, keys[i].obj);
                                    if (cached != null && !cached.isDirty()) {
                                        toReload.add(keys[i]);
                                    }
                                }
                                var toReload_flat = toReload.toArray(new Array());
                                this._db.get(toReload_flat, function (strings) {
                                    for (var i = 0; i < strings.length; i++) {
                                        if (strings[i] != null) {
                                            var correspondingKey = toReload_flat[i];
                                            var cachedObj = _this._cache.get(correspondingKey.universe, correspondingKey.time, correspondingKey.obj);
                                            if (cachedObj != null && !cachedObj.isDirty()) {
                                                cachedObj = _this.internal_unserialize(correspondingKey, strings[i]);
                                                if (cachedObj != null) {
                                                    _this._cache.putAndReplace(correspondingKey.universe, correspondingKey.time, correspondingKey.obj, cachedObj);
                                                }
                                            }
                                        }
                                    }
                                    if (callback != null) {
                                        callback(null);
                                    }
                                });
                            };
                            MemoryManager.prototype.cleanCache = function () {
                                if (this._cache != null) {
                                    this._cache.clean(this._model.metaModel());
                                }
                            };
                            MemoryManager.prototype.setFactory = function (p_factory) {
                                this._factory = p_factory;
                                this._cache = this._factory.newCache();
                            };
                            MemoryManager.prototype.bumpKeyToCache = function (contentKey, callback) {
                                var _this = this;
                                var cached = this._cache.get(contentKey.universe, contentKey.time, contentKey.obj);
                                if (cached != null) {
                                    callback(cached);
                                }
                                else {
                                    var keys = new Array();
                                    keys[0] = contentKey;
                                    this._db.get(keys, function (strings) {
                                        if (strings[0] != null) {
                                            var newObject = _this.internal_unserialize(contentKey, strings[0]);
                                            if (newObject != null) {
                                                newObject = _this._cache.getOrPut(contentKey.universe, contentKey.time, contentKey.obj, newObject);
                                            }
                                            callback(newObject);
                                        }
                                        else {
                                            callback(null);
                                        }
                                    });
                                }
                            };
                            MemoryManager.prototype.bumpKeysToCache = function (contentKeys, callback) {
                                var _this = this;
                                var toLoadIndexes = null;
                                var nbElem = 0;
                                var result = new Array();
                                for (var i = 0; i < contentKeys.length; i++) {
                                    if (contentKeys[i] != null) {
                                        result[i] = this._cache.get(contentKeys[i].universe, contentKeys[i].time, contentKeys[i].obj);
                                        if (result[i] == null) {
                                            if (toLoadIndexes == null) {
                                                toLoadIndexes = new Array();
                                            }
                                            toLoadIndexes[i] = true;
                                            nbElem++;
                                        }
                                    }
                                }
                                if (toLoadIndexes == null) {
                                    callback(result);
                                }
                                else {
                                    var toLoadDbKeys = new Array();
                                    var originIndexes = new Array();
                                    var toLoadIndex = 0;
                                    for (var i = 0; i < contentKeys.length; i++) {
                                        if (toLoadIndexes[i]) {
                                            toLoadDbKeys[toLoadIndex] = contentKeys[i];
                                            originIndexes[toLoadIndex] = i;
                                            toLoadIndex++;
                                        }
                                    }
                                    this._db.get(toLoadDbKeys, function (payloads) {
                                        for (var i = 0; i < payloads.length; i++) {
                                            if (payloads[i] != null) {
                                                var newObjKey = toLoadDbKeys[i];
                                                var newObject = _this.internal_unserialize(newObjKey, payloads[i]);
                                                if (newObject != null) {
                                                    newObject = _this._cache.getOrPut(newObjKey.universe, newObjKey.time, newObjKey.obj, newObject);
                                                    var originIndex = originIndexes[i];
                                                    result[originIndex] = newObject;
                                                }
                                            }
                                        }
                                        callback(result);
                                    });
                                }
                            };
                            MemoryManager.prototype.internal_unserialize = function (key, payload) {
                                var newElement = this._factory.newFromKey(key.universe, key.time, key.obj);
                                try {
                                    if (key.universe != org.kevoree.modeling.KConfig.NULL_LONG && key.time != org.kevoree.modeling.KConfig.NULL_LONG && key.obj != org.kevoree.modeling.KConfig.NULL_LONG) {
                                        var alreadyLoadedOrder = this._cache.get(org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG, key.obj);
                                        if (alreadyLoadedOrder != null) {
                                            newElement.initMetaClass(this._model.metaModel().metaClassByName(alreadyLoadedOrder.metaClassName()));
                                        }
                                    }
                                    newElement.init(payload, this.model().metaModel());
                                    newElement.setClean(this.model().metaModel());
                                    return newElement;
                                }
                                catch ($ex$) {
                                    if ($ex$ instanceof java.lang.Exception) {
                                        var e = $ex$;
                                        e.printStackTrace();
                                        return null;
                                    }
                                    else {
                                        throw $ex$;
                                    }
                                }
                            };
                            MemoryManager.OUT_OF_CACHE_MESSAGE = "KMF Error: your object is out of cache, you probably kept an old reference. Please reload it with a lookup";
                            MemoryManager.UNIVERSE_NOT_CONNECTED_ERROR = "Please connect your model prior to create a universe or an object";
                            MemoryManager.UNIVERSE_INDEX = 0;
                            MemoryManager.OBJ_INDEX = 1;
                            MemoryManager.GLO_TREE_INDEX = 2;
                            MemoryManager.zeroPrefix = 0;
                            return MemoryManager;
                        })();
                        impl.MemoryManager = MemoryManager;
                        var MemorySegmentResolutionTrace = (function () {
                            function MemorySegmentResolutionTrace() {
                            }
                            MemorySegmentResolutionTrace.prototype.getUniverse = function () {
                                return this._universe;
                            };
                            MemorySegmentResolutionTrace.prototype.setUniverse = function (p_universe) {
                                this._universe = p_universe;
                            };
                            MemorySegmentResolutionTrace.prototype.getTime = function () {
                                return this._time;
                            };
                            MemorySegmentResolutionTrace.prototype.setTime = function (p_time) {
                                this._time = p_time;
                            };
                            MemorySegmentResolutionTrace.prototype.getUniverseTree = function () {
                                return this._universeOrder;
                            };
                            MemorySegmentResolutionTrace.prototype.setUniverseOrder = function (p_u_tree) {
                                this._universeOrder = p_u_tree;
                            };
                            MemorySegmentResolutionTrace.prototype.getTimeTree = function () {
                                return this._timeTree;
                            };
                            MemorySegmentResolutionTrace.prototype.setTimeTree = function (p_t_tree) {
                                this._timeTree = p_t_tree;
                            };
                            MemorySegmentResolutionTrace.prototype.getSegment = function () {
                                return this._segment;
                            };
                            MemorySegmentResolutionTrace.prototype.setSegment = function (p_segment) {
                                this._segment = p_segment;
                            };
                            return MemorySegmentResolutionTrace;
                        })();
                        impl.MemorySegmentResolutionTrace = MemorySegmentResolutionTrace;
                        var ResolutionHelper = (function () {
                            function ResolutionHelper() {
                            }
                            ResolutionHelper.resolve_trees = function (universe, time, uuid, cache) {
                                var result = new org.kevoree.modeling.memory.manager.impl.MemorySegmentResolutionTrace();
                                var objectUniverseTree = cache.get(org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG, uuid);
                                var globalUniverseOrder = cache.get(org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG, org.kevoree.modeling.KConfig.NULL_LONG);
                                result.setUniverseOrder(objectUniverseTree);
                                var resolvedUniverse = org.kevoree.modeling.memory.manager.impl.ResolutionHelper.resolve_universe(globalUniverseOrder, objectUniverseTree, time, universe);
                                result.setUniverse(resolvedUniverse);
                                var timeTree = cache.get(resolvedUniverse, org.kevoree.modeling.KConfig.NULL_LONG, uuid);
                                if (timeTree != null) {
                                    result.setTimeTree(timeTree);
                                    var resolvedTime = timeTree.previousOrEqual(time);
                                    result.setTime(resolvedTime);
                                    result.setSegment(cache.get(resolvedUniverse, resolvedTime, uuid));
                                }
                                return result;
                            };
                            ResolutionHelper.resolve_universe = function (globalTree, objUniverseTree, timeToResolve, originUniverseId) {
                                if (globalTree == null || objUniverseTree == null) {
                                    return originUniverseId;
                                }
                                var currentUniverse = originUniverseId;
                                var previousUniverse = org.kevoree.modeling.KConfig.NULL_LONG;
                                var divergenceTime = objUniverseTree.get(currentUniverse);
                                while (currentUniverse != previousUniverse) {
                                    if (divergenceTime != org.kevoree.modeling.KConfig.NULL_LONG && divergenceTime <= timeToResolve) {
                                        return currentUniverse;
                                    }
                                    previousUniverse = currentUniverse;
                                    currentUniverse = globalTree.get(currentUniverse);
                                    divergenceTime = objUniverseTree.get(currentUniverse);
                                }
                                return originUniverseId;
                            };
                            ResolutionHelper.universeSelectByRange = function (globalTree, objUniverseTree, rangeMin, rangeMax, originUniverseId) {
                                var collected = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                var currentUniverse = originUniverseId;
                                var previousUniverse = org.kevoree.modeling.KConfig.NULL_LONG;
                                var divergenceTime = objUniverseTree.get(currentUniverse);
                                while (currentUniverse != previousUniverse) {
                                    if (divergenceTime != org.kevoree.modeling.KConfig.NULL_LONG) {
                                        if (divergenceTime <= rangeMin) {
                                            collected.put(collected.size(), currentUniverse);
                                            break;
                                        }
                                        else {
                                            if (divergenceTime <= rangeMax) {
                                                collected.put(collected.size(), currentUniverse);
                                            }
                                        }
                                    }
                                    previousUniverse = currentUniverse;
                                    currentUniverse = globalTree.get(currentUniverse);
                                    divergenceTime = objUniverseTree.get(currentUniverse);
                                }
                                var trimmed = new Array();
                                for (var i = 0; i < collected.size(); i++) {
                                    trimmed[i] = collected.get(i);
                                }
                                return trimmed;
                            };
                            return ResolutionHelper;
                        })();
                        impl.ResolutionHelper = ResolutionHelper;
                    })(impl = manager.impl || (manager.impl = {}));
                })(manager = memory.manager || (memory.manager = {}));
                var struct;
                (function (struct) {
                    var HeapMemoryFactory = (function () {
                        function HeapMemoryFactory() {
                        }
                        HeapMemoryFactory.prototype.newCacheSegment = function () {
                            return new org.kevoree.modeling.memory.struct.segment.impl.HeapMemorySegment();
                        };
                        HeapMemoryFactory.prototype.newLongTree = function () {
                            return new org.kevoree.modeling.memory.struct.tree.impl.ArrayLongTree();
                        };
                        HeapMemoryFactory.prototype.newLongLongTree = function () {
                            return new org.kevoree.modeling.memory.struct.tree.impl.ArrayLongLongTree();
                        };
                        HeapMemoryFactory.prototype.newUniverseMap = function (initSize, p_className) {
                            return new org.kevoree.modeling.memory.struct.map.impl.ArrayUniverseOrderMap(initSize, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR, p_className);
                        };
                        HeapMemoryFactory.prototype.newFromKey = function (universe, time, uuid) {
                            var result;
                            var isUniverseNotNull = universe != org.kevoree.modeling.KConfig.NULL_LONG;
                            if (org.kevoree.modeling.KConfig.END_OF_TIME == uuid) {
                                if (isUniverseNotNull) {
                                    result = this.newLongLongTree();
                                }
                                else {
                                    result = this.newUniverseMap(0, null);
                                }
                            }
                            else {
                                var isTimeNotNull = time != org.kevoree.modeling.KConfig.NULL_LONG;
                                var isObjNotNull = uuid != org.kevoree.modeling.KConfig.NULL_LONG;
                                if (isUniverseNotNull && isTimeNotNull && isObjNotNull) {
                                    result = this.newCacheSegment();
                                }
                                else {
                                    if (isUniverseNotNull && !isTimeNotNull && isObjNotNull) {
                                        result = this.newLongTree();
                                    }
                                    else {
                                        result = this.newUniverseMap(0, null);
                                    }
                                }
                            }
                            return result;
                        };
                        HeapMemoryFactory.prototype.newCache = function () {
                            return new org.kevoree.modeling.memory.struct.cache.impl.ArrayMemoryCache();
                        };
                        return HeapMemoryFactory;
                    })();
                    struct.HeapMemoryFactory = HeapMemoryFactory;
                    var cache;
                    (function (cache) {
                        var impl;
                        (function (impl) {
                            var ArrayMemoryCache = (function () {
                                function ArrayMemoryCache() {
                                    this._state = null;
                                    var initialCapacity = org.kevoree.modeling.KConfig.CACHE_INIT_SIZE;
                                    this._loadFactor = org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR;
                                    this._elementCount = 0;
                                    this._droppedCount = 0;
                                    var newstate = new org.kevoree.modeling.memory.struct.cache.impl.ArrayMemoryCache.InternalState(initialCapacity, new Array(), new Array(), new Array(), new Array());
                                    for (var i = 0; i < initialCapacity; i++) {
                                        newstate.elementNext[i] = -1;
                                        newstate.elementHash[i] = -1;
                                    }
                                    this._state = newstate;
                                    this._threshold = (newstate.elementDataSize * this._loadFactor);
                                }
                                ArrayMemoryCache.prototype.rehashCapacity = function (capacity) {
                                    var length = (capacity == 0 ? 1 : capacity << 1);
                                    var newElementKV = new Array();
                                    System.arraycopy(this._state.elementK3, 0, newElementKV, 0, this._state.elementDataSize * 3);
                                    var newValues = new Array();
                                    System.arraycopy(this._state.values, 0, newValues, 0, this._state.elementDataSize);
                                    var newElementNext = new Array();
                                    var newElementHash = new Array();
                                    for (var i = 0; i < length; i++) {
                                        newElementNext[i] = -1;
                                        newElementHash[i] = -1;
                                    }
                                    for (var i = 0; i < this._state.elementDataSize; i++) {
                                        if (this._state.values[i] != null) {
                                            var hash = (this._state.elementK3[(i * 3)] ^ this._state.elementK3[(i * 3) + 1] ^ this._state.elementK3[(i * 3) + 2]);
                                            var index = (hash & 0x7FFFFFFF) % length;
                                            newElementNext[i] = newElementHash[index];
                                            newElementHash[index] = i;
                                        }
                                    }
                                    this._state = new org.kevoree.modeling.memory.struct.cache.impl.ArrayMemoryCache.InternalState(length, newElementKV, newElementNext, newElementHash, newValues);
                                    this._threshold = (length * this._loadFactor);
                                };
                                ArrayMemoryCache.prototype.get = function (universe, time, obj) {
                                    var internalState = this._state;
                                    if (internalState.elementDataSize == 0) {
                                        return null;
                                    }
                                    var index = ((universe ^ time ^ obj) & 0x7FFFFFFF) % internalState.elementDataSize;
                                    var m = internalState.elementHash[index];
                                    while (m != -1) {
                                        if (universe == internalState.elementK3[(m * 3)] && time == internalState.elementK3[((m * 3) + 1)] && obj == internalState.elementK3[((m * 3) + 2)]) {
                                            return internalState.values[m];
                                        }
                                        else {
                                            m = internalState.elementNext[m];
                                        }
                                    }
                                    return null;
                                };
                                ArrayMemoryCache.prototype.putAndReplace = function (universe, time, obj, payload) {
                                    this.internal_put(universe, time, obj, payload, true);
                                };
                                ArrayMemoryCache.prototype.getOrPut = function (universe, time, obj, payload) {
                                    return this.internal_put(universe, time, obj, payload, false);
                                };
                                ArrayMemoryCache.prototype.internal_put = function (universe, time, p_obj, payload, force) {
                                    var entry = -1;
                                    var index = -1;
                                    var hash = (universe ^ time ^ p_obj);
                                    if (this._state.elementDataSize != 0) {
                                        index = (hash & 0x7FFFFFFF) % this._state.elementDataSize;
                                        entry = this.findNonNullKeyEntry(universe, time, p_obj, index, this._state);
                                    }
                                    if (entry == -1) {
                                        if (++this._elementCount > this._threshold) {
                                            this.rehashCapacity(this._state.elementDataSize);
                                            index = (hash & 0x7FFFFFFF) % this._state.elementDataSize;
                                        }
                                        var newIndex = (this._elementCount - 1 + this._droppedCount);
                                        this._state.elementK3[(newIndex * 3)] = universe;
                                        this._state.elementK3[((newIndex * 3) + 1)] = time;
                                        this._state.elementK3[((newIndex * 3) + 2)] = p_obj;
                                        this._state.values[newIndex] = payload;
                                        this._state.elementNext[newIndex] = this._state.elementHash[index];
                                        this._state.elementHash[index] = newIndex;
                                        return payload;
                                    }
                                    else {
                                        if (force) {
                                            this._state.values[entry] = payload;
                                            return payload;
                                        }
                                        else {
                                            return this._state.values[entry];
                                        }
                                    }
                                };
                                ArrayMemoryCache.prototype.findNonNullKeyEntry = function (universe, time, obj, index, internalState) {
                                    var m = this._state.elementHash[index];
                                    while (m >= 0) {
                                        if (universe == internalState.elementK3[m * 3] && time == internalState.elementK3[(m * 3) + 1] && obj == internalState.elementK3[(m * 3) + 2]) {
                                            return m;
                                        }
                                        m = this._state.elementNext[m];
                                    }
                                    return -1;
                                };
                                ArrayMemoryCache.prototype.dirties = function () {
                                    var nbDirties = 0;
                                    var internalState = this._state;
                                    for (var i = 0; i < internalState.elementDataSize; i++) {
                                        if (internalState.values[i] != null) {
                                            if (internalState.values[i].isDirty()) {
                                                nbDirties++;
                                            }
                                        }
                                    }
                                    var collectedDirties = new Array();
                                    nbDirties = 0;
                                    for (var i = 0; i < internalState.elementDataSize; i++) {
                                        if (internalState.values[i] != null) {
                                            if (internalState.values[i].isDirty()) {
                                                var dirty = new org.kevoree.modeling.memory.struct.cache.impl.KCacheDirty(new org.kevoree.modeling.KContentKey(internalState.elementK3[i * 3], internalState.elementK3[(i * 3) + 1], internalState.elementK3[(i * 3) + 2]), internalState.values[i]);
                                                collectedDirties[nbDirties] = dirty;
                                                nbDirties++;
                                            }
                                        }
                                    }
                                    return collectedDirties;
                                };
                                ArrayMemoryCache.prototype.clean = function (metaModel) {
                                };
                                ArrayMemoryCache.prototype.monitor = function (origin) {
                                };
                                ArrayMemoryCache.prototype.size = function () {
                                    return this._elementCount;
                                };
                                ArrayMemoryCache.prototype.remove = function (universe, time, obj, p_metaModel) {
                                    var internalState = this._state;
                                    var hash = (universe ^ time ^ obj);
                                    var index = (hash & 0x7FFFFFFF) % internalState.elementDataSize;
                                    if (this._state.elementDataSize == 0) {
                                        return;
                                    }
                                    var m = this._state.elementHash[index];
                                    var last = -1;
                                    while (m >= 0) {
                                        if (universe == internalState.elementK3[m * 3] && time == internalState.elementK3[(m * 3) + 1] && obj == internalState.elementK3[(m * 3) + 2]) {
                                            break;
                                        }
                                        last = m;
                                        m = this._state.elementNext[m];
                                    }
                                    if (m == -1) {
                                        return;
                                    }
                                    if (last == -1) {
                                        if (this._state.elementNext[m] != -1) {
                                            this._state.elementHash[index] = m;
                                        }
                                        else {
                                            this._state.elementHash[index] = -1;
                                        }
                                    }
                                    else {
                                        this._state.elementNext[last] = this._state.elementNext[m];
                                    }
                                    this._state.elementNext[m] = -1;
                                    this._state.values[m].free(p_metaModel);
                                    this._state.values[m] = null;
                                    this._elementCount--;
                                    this._droppedCount++;
                                };
                                ArrayMemoryCache.prototype.compact = function () {
                                    var internalState = this._state;
                                    if (this._droppedCount > 0) {
                                        var length = (this._elementCount == 0 ? 1 : this._elementCount << 1);
                                        var newValues = new Array();
                                        var newElementNext = new Array();
                                        var newElementHash = new Array();
                                        var newElementKV = new Array();
                                        var currentIndex = 0;
                                        for (var i = 0; i < length; i++) {
                                            newElementNext[i] = -1;
                                            newElementHash[i] = -1;
                                        }
                                        for (var i = 0; i < internalState.elementDataSize; i++) {
                                            var loopElement = internalState.values[i];
                                            if (loopElement != null) {
                                                var l_uni = internalState.elementK3[(i * 3)];
                                                var l_time = internalState.elementK3[(i * 3) + 1];
                                                var l_obj = internalState.elementK3[(i * 3) + 2];
                                                newValues[currentIndex] = loopElement;
                                                newElementKV[(currentIndex * 3)] = l_uni;
                                                newElementKV[(currentIndex * 3) + 1] = l_time;
                                                newElementKV[(currentIndex * 3) + 2] = l_obj;
                                                var hash = (l_uni ^ l_time ^ l_obj);
                                                var index = (hash & 0x7FFFFFFF) % length;
                                                newElementNext[currentIndex] = newElementHash[index];
                                                newElementHash[index] = currentIndex;
                                                currentIndex++;
                                            }
                                        }
                                        this._state = new org.kevoree.modeling.memory.struct.cache.impl.ArrayMemoryCache.InternalState(length, newElementKV, newElementNext, newElementHash, newValues);
                                        this._elementCount = currentIndex;
                                        this._droppedCount = 0;
                                        this._threshold = (length * this._loadFactor);
                                    }
                                };
                                ArrayMemoryCache.prototype.clear = function (metaModel) {
                                    if (this._elementCount > 0) {
                                        var internalState = this._state;
                                        for (var i = 0; i < internalState.elementDataSize; i++) {
                                            if (internalState.values[i] != null) {
                                                internalState.values[i].free(metaModel);
                                            }
                                        }
                                        var initialCapacity = org.kevoree.modeling.KConfig.CACHE_INIT_SIZE;
                                        var newstate = new org.kevoree.modeling.memory.struct.cache.impl.ArrayMemoryCache.InternalState(initialCapacity, new Array(), new Array(), new Array(), new Array());
                                        for (var i = 0; i < initialCapacity; i++) {
                                            newstate.elementNext[i] = -1;
                                            newstate.elementHash[i] = -1;
                                        }
                                        this._elementCount = 0;
                                        this._droppedCount = 0;
                                        this._state = newstate;
                                        this._threshold = (newstate.elementDataSize * this._loadFactor);
                                    }
                                };
                                ArrayMemoryCache.prototype.delete = function (metaModel) {
                                    var internalState = this._state;
                                    this._state = null;
                                    for (var i = 0; i < internalState.elementDataSize; i++) {
                                        if (internalState.values[i] != null) {
                                            internalState.values[i].free(metaModel);
                                        }
                                    }
                                    this._elementCount = 0;
                                    this._droppedCount = 0;
                                    this._threshold = 0;
                                };
                                return ArrayMemoryCache;
                            })();
                            impl.ArrayMemoryCache = ArrayMemoryCache;
                            var ArrayMemoryCache;
                            (function (ArrayMemoryCache) {
                                var InternalState = (function () {
                                    function InternalState(p_elementDataSize, p_elementKE, p_elementNext, p_elementHash, p_values) {
                                        this.elementDataSize = p_elementDataSize;
                                        this.elementK3 = p_elementKE;
                                        this.elementNext = p_elementNext;
                                        this.elementHash = p_elementHash;
                                        this.values = p_values;
                                    }
                                    return InternalState;
                                })();
                                ArrayMemoryCache.InternalState = InternalState;
                            })(ArrayMemoryCache = impl.ArrayMemoryCache || (impl.ArrayMemoryCache = {}));
                            var KCacheDirty = (function () {
                                function KCacheDirty(key, object) {
                                    this.key = key;
                                    this.object = object;
                                }
                                return KCacheDirty;
                            })();
                            impl.KCacheDirty = KCacheDirty;
                        })(impl = cache.impl || (cache.impl = {}));
                    })(cache = struct.cache || (struct.cache = {}));
                    var map;
                    (function (map) {
                        var impl;
                        (function (impl) {
                            var ArrayIntMap = (function () {
                                function ArrayIntMap(initalCapacity, loadFactor) {
                                }
                                ArrayIntMap.prototype.clear = function () { for (var p in this) {
                                    if (this.hasOwnProperty(p)) {
                                        delete this[p];
                                    }
                                } };
                                ArrayIntMap.prototype.get = function (key) { return this[key]; };
                                ArrayIntMap.prototype.put = function (key, pval) { var previousVal = this[key]; this[key] = pval; return previousVal; };
                                ArrayIntMap.prototype.contains = function (key) { return this.hasOwnProperty(key); };
                                ArrayIntMap.prototype.remove = function (key) { var tmp = this[key]; delete this[key]; return tmp; };
                                ArrayIntMap.prototype.size = function () { return Object.keys(this).length; };
                                ArrayIntMap.prototype.each = function (callback) { for (var p in this) {
                                    if (this.hasOwnProperty(p)) {
                                        callback(+p, this[p]);
                                    }
                                } };
                                return ArrayIntMap;
                            })();
                            impl.ArrayIntMap = ArrayIntMap;
                            var ArrayLongLongMap = (function () {
                                function ArrayLongLongMap(initialCapacity, loadFactor) {
                                    this._isDirty = false;
                                }
                                ArrayLongLongMap.prototype.clear = function () { for (var p in this) {
                                    this._isDirty = true;
                                    if (this.hasOwnProperty(p) && p.indexOf('_') != 0) {
                                        delete this[p];
                                    }
                                } };
                                ArrayLongLongMap.prototype.get = function (key) {
                                    var resolved = this[key];
                                    if (resolved == undefined) {
                                        return org.kevoree.modeling.KConfig.NULL_LONG;
                                    }
                                    else {
                                        return resolved;
                                    }
                                };
                                ArrayLongLongMap.prototype.put = function (key, pval) { this._isDirty = true; this[key] = pval; };
                                ArrayLongLongMap.prototype.contains = function (key) { return this.hasOwnProperty(key); };
                                ArrayLongLongMap.prototype.remove = function (key) { var tmp = this[key]; delete this[key]; return tmp; };
                                ArrayLongLongMap.prototype.size = function () { return Object.keys(this).length - 1; };
                                ArrayLongLongMap.prototype.each = function (callback) { for (var p in this) {
                                    if (this.hasOwnProperty(p) && p.indexOf('_') != 0) {
                                        callback(+p, +this[p]);
                                    }
                                } };
                                ArrayLongLongMap.prototype.isDirty = function () { return this._isDirty; };
                                ArrayLongLongMap.prototype.setClean = function (mm) { this._isDirty = false; };
                                ArrayLongLongMap.prototype.setDirty = function () { this._isDirty = true; };
                                return ArrayLongLongMap;
                            })();
                            impl.ArrayLongLongMap = ArrayLongLongMap;
                            var ArrayLongLongMap;
                            (function (ArrayLongLongMap) {
                                var InternalState = (function () {
                                    function InternalState() {
                                    }
                                    return InternalState;
                                })();
                                ArrayLongLongMap.InternalState = InternalState;
                            })(ArrayLongLongMap = impl.ArrayLongLongMap || (impl.ArrayLongLongMap = {}));
                            var ArrayLongMap = (function () {
                                function ArrayLongMap(initalCapacity, loadFactor) {
                                }
                                ArrayLongMap.prototype.clear = function () { for (var p in this) {
                                    if (this.hasOwnProperty(p)) {
                                        delete this[p];
                                    }
                                } };
                                ArrayLongMap.prototype.get = function (key) { return this[key]; };
                                ArrayLongMap.prototype.put = function (key, pval) { var previousVal = this[key]; this[key] = pval; return previousVal; };
                                ArrayLongMap.prototype.contains = function (key) { return this.hasOwnProperty(key); };
                                ArrayLongMap.prototype.remove = function (key) { var tmp = this[key]; delete this[key]; return tmp; };
                                ArrayLongMap.prototype.size = function () { return Object.keys(this).length; };
                                ArrayLongMap.prototype.each = function (callback) { for (var p in this) {
                                    if (this.hasOwnProperty(p)) {
                                        callback(+p, this[p]);
                                    }
                                } };
                                return ArrayLongMap;
                            })();
                            impl.ArrayLongMap = ArrayLongMap;
                            var ArrayStringMap = (function () {
                                function ArrayStringMap(initalCapacity, loadFactor) {
                                }
                                ArrayStringMap.prototype.clear = function () { for (var p in this) {
                                    if (this.hasOwnProperty(p)) {
                                        delete this[p];
                                    }
                                } };
                                ArrayStringMap.prototype.get = function (key) { return this[key]; };
                                ArrayStringMap.prototype.put = function (key, pval) { var previousVal = this[key]; this[key] = pval; return previousVal; };
                                ArrayStringMap.prototype.contains = function (key) { return this.hasOwnProperty(key); };
                                ArrayStringMap.prototype.remove = function (key) { var tmp = this[key]; delete this[key]; return tmp; };
                                ArrayStringMap.prototype.size = function () { return Object.keys(this).length; };
                                ArrayStringMap.prototype.each = function (callback) { for (var p in this) {
                                    if (this.hasOwnProperty(p)) {
                                        callback(p, this[p]);
                                    }
                                } };
                                return ArrayStringMap;
                            })();
                            impl.ArrayStringMap = ArrayStringMap;
                            var ArrayUniverseOrderMap = (function (_super) {
                                __extends(ArrayUniverseOrderMap, _super);
                                function ArrayUniverseOrderMap(initalCapacity, loadFactor, p_className) {
                                    _super.call(this, initalCapacity, loadFactor);
                                    this._counter = 0;
                                    this._className = p_className;
                                }
                                ArrayUniverseOrderMap.prototype.metaClassName = function () { return this._className; };
                                ArrayUniverseOrderMap.prototype.counter = function () { return this._counter; };
                                ArrayUniverseOrderMap.prototype.inc = function () { this._counter++; };
                                ArrayUniverseOrderMap.prototype.dec = function () { this._counter--; };
                                ArrayUniverseOrderMap.prototype.free = function () { };
                                ArrayUniverseOrderMap.prototype.size = function () { return Object.keys(this).length - 3; };
                                ArrayUniverseOrderMap.prototype.serialize = function (metaModel) {
                                    var buffer = new java.lang.StringBuilder();
                                    if (this._className != null) {
                                        buffer.append(this._className);
                                        buffer.append(',');
                                    }
                                    org.kevoree.modeling.util.maths.Base64.encodeIntToBuffer(this.size(), buffer);
                                    buffer.append('/');
                                    var isFirst = true;
                                    for (var propKey in this) {
                                        if (this.hasOwnProperty(propKey) && propKey[0] != '_') {
                                            if (!isFirst) {
                                                buffer.append(",");
                                            }
                                            isFirst = false;
                                            org.kevoree.modeling.util.maths.Base64.encodeLongToBuffer(propKey, buffer);
                                            buffer.append(":");
                                            org.kevoree.modeling.util.maths.Base64.encodeLongToBuffer(this[propKey], buffer);
                                        }
                                    }
                                    return buffer.toString();
                                };
                                ArrayUniverseOrderMap.prototype.init = function (payload, metaModel) {
                                    if (payload == null || payload.length == 0) {
                                        return;
                                    }
                                    var initPos = 0;
                                    var cursor = 0;
                                    while (cursor < payload.length && payload.charAt(cursor) != ',' && payload.charAt(cursor) != '/') {
                                        cursor++;
                                    }
                                    if (cursor >= payload.length) {
                                        return;
                                    }
                                    if (payload.charAt(cursor) == ',') {
                                        this._className = payload.substring(initPos, cursor);
                                        cursor++;
                                        initPos = cursor;
                                    }
                                    while (cursor < payload.length && payload.charAt(cursor) != '/') {
                                        cursor++;
                                    }
                                    var nbElement = java.lang.Integer.parseInt(payload.substring(initPos, cursor));
                                    while (cursor < payload.length) {
                                        cursor++;
                                        var beginChunk = cursor;
                                        while (cursor < payload.length && payload.charAt(cursor) != ':') {
                                            cursor++;
                                        }
                                        var middleChunk = cursor;
                                        while (cursor < payload.length && payload.charAt(cursor) != ',') {
                                            cursor++;
                                        }
                                        var loopKey = org.kevoree.modeling.util.maths.Base64.decodeToLongWithBounds(payload, beginChunk, middleChunk);
                                        var loopVal = org.kevoree.modeling.util.maths.Base64.decodeToLongWithBounds(payload, middleChunk + 1, cursor);
                                        this[loopKey] = loopVal;
                                    }
                                };
                                return ArrayUniverseOrderMap;
                            })(org.kevoree.modeling.memory.struct.map.impl.ArrayLongLongMap);
                            impl.ArrayUniverseOrderMap = ArrayUniverseOrderMap;
                        })(impl = map.impl || (map.impl = {}));
                    })(map = struct.map || (struct.map = {}));
                    var segment;
                    (function (segment) {
                        var impl;
                        (function (impl) {
                            var HeapMemorySegment = (function () {
                                function HeapMemorySegment() {
                                    this._counter = 0;
                                    this._metaClassIndex = -1;
                                    this._modifiedIndexes = null;
                                    this._dirty = false;
                                }
                                HeapMemorySegment.prototype.initMetaClass = function (p_metaClass) {
                                    this.raw = new Array();
                                    this._metaClassIndex = p_metaClass.index();
                                };
                                HeapMemorySegment.prototype.metaClassIndex = function () {
                                    return this._metaClassIndex;
                                };
                                HeapMemorySegment.prototype.isDirty = function () {
                                    return this._dirty;
                                };
                                HeapMemorySegment.prototype.serialize = function (metaModel) {
                                    var metaClass = metaModel.metaClass(this._metaClassIndex);
                                    var builder = new java.lang.StringBuilder();
                                    builder.append("{");
                                    var isFirst = true;
                                    var metaElements = metaClass.metaElements();
                                    if (this.raw != null && metaElements != null) {
                                        for (var i = 0; i < this.raw.length && i < metaElements.length; i++) {
                                            var o = this.raw[i];
                                            if (o != null) {
                                                if (isFirst) {
                                                    builder.append("\"");
                                                    isFirst = false;
                                                }
                                                else {
                                                    builder.append(",\"");
                                                }
                                                builder.append(metaElements[i].metaName());
                                                builder.append("\":");
                                                if (metaElements[i].metaType() == org.kevoree.modeling.meta.MetaType.ATTRIBUTE) {
                                                    var metaAttribute = metaElements[i];
                                                    if (metaAttribute.attributeType() == org.kevoree.modeling.meta.KPrimitiveTypes.STRING) {
                                                        builder.append("\"");
                                                        builder.append(org.kevoree.modeling.format.json.JsonString.encode(o));
                                                        builder.append("\"");
                                                    }
                                                    else {
                                                        if (metaAttribute.attributeType() == org.kevoree.modeling.meta.KPrimitiveTypes.LONG) {
                                                            builder.append("\"");
                                                            org.kevoree.modeling.util.maths.Base64.encodeLongToBuffer(o, builder);
                                                            builder.append("\"");
                                                        }
                                                        else {
                                                            if (metaAttribute.attributeType() == org.kevoree.modeling.meta.KPrimitiveTypes.CONTINUOUS) {
                                                                builder.append("[");
                                                                var castedArr = o;
                                                                for (var j = 0; j < castedArr.length; j++) {
                                                                    if (j != 0) {
                                                                        builder.append(",");
                                                                    }
                                                                    builder.append("\"");
                                                                    org.kevoree.modeling.util.maths.Base64.encodeDoubleToBuffer(castedArr[j], builder);
                                                                    builder.append("\"");
                                                                }
                                                                builder.append("]");
                                                            }
                                                            else {
                                                                if (metaAttribute.attributeType() == org.kevoree.modeling.meta.KPrimitiveTypes.BOOL) {
                                                                    if (o) {
                                                                        builder.append("1");
                                                                    }
                                                                    else {
                                                                        builder.append("0");
                                                                    }
                                                                }
                                                                else {
                                                                    if (metaAttribute.attributeType() == org.kevoree.modeling.meta.KPrimitiveTypes.DOUBLE) {
                                                                        builder.append("\"");
                                                                        org.kevoree.modeling.util.maths.Base64.encodeDoubleToBuffer(o, builder);
                                                                        builder.append("\"");
                                                                    }
                                                                    else {
                                                                        if (metaAttribute.attributeType() == org.kevoree.modeling.meta.KPrimitiveTypes.INT) {
                                                                            builder.append("\"");
                                                                            org.kevoree.modeling.util.maths.Base64.encodeIntToBuffer(o, builder);
                                                                            builder.append("\"");
                                                                        }
                                                                        else {
                                                                            if (metaAttribute.attributeType().isEnum()) {
                                                                                org.kevoree.modeling.util.maths.Base64.encodeIntToBuffer(o, builder);
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                else {
                                                    if (metaElements[i].metaType() == org.kevoree.modeling.meta.MetaType.REFERENCE) {
                                                        builder.append("[");
                                                        var castedArr = o;
                                                        for (var j = 0; j < castedArr.length; j++) {
                                                            if (j != 0) {
                                                                builder.append(",");
                                                            }
                                                            builder.append("\"");
                                                            org.kevoree.modeling.util.maths.Base64.encodeLongToBuffer(castedArr[j], builder);
                                                            builder.append("\"");
                                                        }
                                                        builder.append("]");
                                                    }
                                                    else {
                                                        if (metaElements[i].metaType() == org.kevoree.modeling.meta.MetaType.DEPENDENCIES || metaElements[i].metaType() == org.kevoree.modeling.meta.MetaType.INPUT || metaElements[i].metaType() == org.kevoree.modeling.meta.MetaType.OUTPUT) {
                                                            builder.append("[");
                                                            var castedArr = o;
                                                            for (var j = 0; j < castedArr.length; j++) {
                                                                if (j != 0) {
                                                                    builder.append(",");
                                                                }
                                                                builder.append("\"");
                                                                org.kevoree.modeling.util.maths.Base64.encodeDoubleToBuffer(castedArr[j], builder);
                                                                builder.append("\"");
                                                            }
                                                            builder.append("]");
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    builder.append("}");
                                    return builder.toString();
                                };
                                HeapMemorySegment.prototype.modifiedIndexes = function (p_metaClass) {
                                    if (this._modifiedIndexes == null) {
                                        return new Array();
                                    }
                                    else {
                                        var nbModified = 0;
                                        for (var i = 0; i < this._modifiedIndexes.length; i++) {
                                            if (this._modifiedIndexes[i]) {
                                                nbModified = nbModified + 1;
                                            }
                                        }
                                        var result = new Array();
                                        var inserted = 0;
                                        for (var i = 0; i < this._modifiedIndexes.length; i++) {
                                            if (this._modifiedIndexes[i]) {
                                                result[inserted] = i;
                                                inserted = inserted + 1;
                                            }
                                        }
                                        return result;
                                    }
                                };
                                HeapMemorySegment.prototype.setClean = function (metaModel) {
                                    this._dirty = false;
                                    this._modifiedIndexes = null;
                                };
                                HeapMemorySegment.prototype.setDirty = function () {
                                    this._dirty = true;
                                };
                                HeapMemorySegment.prototype.init = function (payload, metaModel) {
                                    if (payload != null) {
                                        var objectReader = new org.kevoree.modeling.format.json.JsonObjectReader();
                                        objectReader.parseObject(payload);
                                        var metaClass = metaModel.metaClass(this._metaClassIndex);
                                        var metaKeys = objectReader.keys();
                                        for (var i = 0; i < metaKeys.length; i++) {
                                            var insideContent = objectReader.get(metaKeys[i]);
                                            var metaElement = metaClass.metaByName(metaKeys[i]);
                                            if (insideContent != null) {
                                                if (metaElement != null && metaElement.metaType().equals(org.kevoree.modeling.meta.MetaType.ATTRIBUTE)) {
                                                    var metaAttribute = metaElement;
                                                    var converted = null;
                                                    if (metaAttribute.attributeType() == org.kevoree.modeling.meta.KPrimitiveTypes.STRING) {
                                                        converted = org.kevoree.modeling.format.json.JsonString.unescape(insideContent);
                                                    }
                                                    else {
                                                        if (metaAttribute.attributeType() == org.kevoree.modeling.meta.KPrimitiveTypes.LONG) {
                                                            converted = org.kevoree.modeling.util.maths.Base64.decodeToLong(insideContent);
                                                        }
                                                        else {
                                                            if (metaAttribute.attributeType() == org.kevoree.modeling.meta.KPrimitiveTypes.INT) {
                                                                converted = org.kevoree.modeling.util.maths.Base64.decodeToInt(insideContent);
                                                            }
                                                            else {
                                                                if (metaAttribute.attributeType() == org.kevoree.modeling.meta.KPrimitiveTypes.BOOL) {
                                                                    if (insideContent.equals("1")) {
                                                                        converted = true;
                                                                    }
                                                                    else {
                                                                        converted = false;
                                                                    }
                                                                }
                                                                else {
                                                                    if (metaAttribute.attributeType() == org.kevoree.modeling.meta.KPrimitiveTypes.DOUBLE) {
                                                                        converted = org.kevoree.modeling.util.maths.Base64.decodeToDouble(insideContent);
                                                                    }
                                                                    else {
                                                                        if (metaAttribute.attributeType() == org.kevoree.modeling.meta.KPrimitiveTypes.CONTINUOUS) {
                                                                            var plainRawSet = objectReader.getAsStringArray(metaKeys[i]);
                                                                            var convertedRaw = new Array();
                                                                            for (var l = 0; l < plainRawSet.length; l++) {
                                                                                try {
                                                                                    convertedRaw[l] = org.kevoree.modeling.util.maths.Base64.decodeToDouble(plainRawSet[l]);
                                                                                }
                                                                                catch ($ex$) {
                                                                                    if ($ex$ instanceof java.lang.Exception) {
                                                                                        var e = $ex$;
                                                                                        e.printStackTrace();
                                                                                    }
                                                                                    else {
                                                                                        throw $ex$;
                                                                                    }
                                                                                }
                                                                            }
                                                                            converted = convertedRaw;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                    this.raw[metaAttribute.index()] = converted;
                                                }
                                                if (metaElement != null && metaElement.metaType().equals(org.kevoree.modeling.meta.MetaType.REFERENCE)) {
                                                    try {
                                                        var plainRawSet = objectReader.getAsStringArray(metaKeys[i]);
                                                        var convertedRaw = new Array();
                                                        for (var l = 0; l < plainRawSet.length; l++) {
                                                            try {
                                                                convertedRaw[l] = org.kevoree.modeling.util.maths.Base64.decodeToLong(plainRawSet[l]);
                                                            }
                                                            catch ($ex$) {
                                                                if ($ex$ instanceof java.lang.Exception) {
                                                                    var e = $ex$;
                                                                    e.printStackTrace();
                                                                }
                                                                else {
                                                                    throw $ex$;
                                                                }
                                                            }
                                                        }
                                                        this.raw[metaElement.index()] = convertedRaw;
                                                    }
                                                    catch ($ex$) {
                                                        if ($ex$ instanceof java.lang.Exception) {
                                                            var e = $ex$;
                                                            e.printStackTrace();
                                                        }
                                                        else {
                                                            throw $ex$;
                                                        }
                                                    }
                                                }
                                                else {
                                                    if (metaElement != null && (metaElement.metaType().equals(org.kevoree.modeling.meta.MetaType.DEPENDENCIES) || metaElement.metaType().equals(org.kevoree.modeling.meta.MetaType.INPUT) || metaElement.metaType().equals(org.kevoree.modeling.meta.MetaType.OUTPUT))) {
                                                        try {
                                                            var plainRawSet = objectReader.getAsStringArray(metaKeys[i]);
                                                            var convertedRaw = new Array();
                                                            for (var l = 0; l < plainRawSet.length; l++) {
                                                                try {
                                                                    convertedRaw[l] = org.kevoree.modeling.util.maths.Base64.decodeToDouble(plainRawSet[l]);
                                                                }
                                                                catch ($ex$) {
                                                                    if ($ex$ instanceof java.lang.Exception) {
                                                                        var e = $ex$;
                                                                        e.printStackTrace();
                                                                    }
                                                                    else {
                                                                        throw $ex$;
                                                                    }
                                                                }
                                                            }
                                                            this.raw[metaElement.index()] = convertedRaw;
                                                        }
                                                        catch ($ex$) {
                                                            if ($ex$ instanceof java.lang.Exception) {
                                                                var e = $ex$;
                                                                e.printStackTrace();
                                                            }
                                                            else {
                                                                throw $ex$;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                };
                                HeapMemorySegment.prototype.counter = function () {
                                    return this._counter;
                                };
                                HeapMemorySegment.prototype.inc = function () {
                                    this.internal_counter(true);
                                };
                                HeapMemorySegment.prototype.dec = function () {
                                    this.internal_counter(false);
                                };
                                HeapMemorySegment.prototype.internal_counter = function (inc) {
                                    if (inc) {
                                        this._counter++;
                                    }
                                    else {
                                        this._counter--;
                                    }
                                };
                                HeapMemorySegment.prototype.free = function (metaModel) {
                                    this.raw = null;
                                };
                                HeapMemorySegment.prototype.get = function (index, p_metaClass) {
                                    if (this.raw != null) {
                                        return this.raw[index];
                                    }
                                    else {
                                        return null;
                                    }
                                };
                                HeapMemorySegment.prototype.getRefSize = function (index, metaClass) {
                                    var existing = this.raw[index];
                                    if (existing != null) {
                                        return existing.length;
                                    }
                                    return 0;
                                };
                                HeapMemorySegment.prototype.getRefElem = function (index, refIndex, metaClass) {
                                    var existing = this.raw[index];
                                    if (existing != null) {
                                        return existing[refIndex];
                                    }
                                    else {
                                        return org.kevoree.modeling.KConfig.NULL_LONG;
                                    }
                                };
                                HeapMemorySegment.prototype.getRef = function (index, p_metaClass) {
                                    if (this.raw != null) {
                                        var previousObj = this.raw[index];
                                        if (previousObj != null) {
                                            try {
                                                return previousObj;
                                            }
                                            catch ($ex$) {
                                                if ($ex$ instanceof java.lang.Exception) {
                                                    var e = $ex$;
                                                    e.printStackTrace();
                                                    this.raw[index] = null;
                                                    return null;
                                                }
                                                else {
                                                    throw $ex$;
                                                }
                                            }
                                        }
                                        else {
                                            return null;
                                        }
                                    }
                                    else {
                                        return null;
                                    }
                                };
                                HeapMemorySegment.prototype.addRef = function (index, newRef, metaClass) {
                                    if (this.raw != null) {
                                        var previous = this.raw[index];
                                        if (previous == null) {
                                            previous = new Array();
                                            previous[0] = newRef;
                                        }
                                        else {
                                            for (var i = 0; i < previous.length; i++) {
                                                if (previous[i] == newRef) {
                                                    return false;
                                                }
                                            }
                                            var incArray = new Array();
                                            System.arraycopy(previous, 0, incArray, 0, previous.length);
                                            incArray[previous.length] = newRef;
                                            previous = incArray;
                                        }
                                        this.raw[index] = previous;
                                        if (this._modifiedIndexes == null) {
                                            this._modifiedIndexes = new Array();
                                        }
                                        this._modifiedIndexes[index] = true;
                                        this._dirty = true;
                                        return true;
                                    }
                                    return false;
                                };
                                HeapMemorySegment.prototype.removeRef = function (index, refToRemove, metaClass) {
                                    if (this.raw != null) {
                                        var previous = this.raw[index];
                                        if (previous != null) {
                                            var indexToRemove = -1;
                                            for (var i = 0; i < previous.length; i++) {
                                                if (previous[i] == refToRemove) {
                                                    indexToRemove = i;
                                                    break;
                                                }
                                            }
                                            if (indexToRemove != -1) {
                                                if ((previous.length - 1) == 0) {
                                                    this.raw[index] = null;
                                                }
                                                else {
                                                    var newArray = new Array();
                                                    System.arraycopy(previous, 0, newArray, 0, indexToRemove);
                                                    System.arraycopy(previous, indexToRemove + 1, newArray, indexToRemove, previous.length - indexToRemove - 1);
                                                    this.raw[index] = newArray;
                                                }
                                                if (this._modifiedIndexes == null) {
                                                    this._modifiedIndexes = new Array();
                                                }
                                                this._modifiedIndexes[index] = true;
                                                this._dirty = true;
                                                return true;
                                            }
                                        }
                                    }
                                    return false;
                                };
                                HeapMemorySegment.prototype.clearRef = function (index, metaClass) {
                                    this.raw[index] = null;
                                };
                                HeapMemorySegment.prototype.getInfer = function (index, metaClass) {
                                    if (this.raw != null) {
                                        var previousObj = this.raw[index];
                                        if (previousObj != null) {
                                            try {
                                                return previousObj;
                                            }
                                            catch ($ex$) {
                                                if ($ex$ instanceof java.lang.Exception) {
                                                    var e = $ex$;
                                                    e.printStackTrace();
                                                    this.raw[index] = null;
                                                    return null;
                                                }
                                                else {
                                                    throw $ex$;
                                                }
                                            }
                                        }
                                        else {
                                            return null;
                                        }
                                    }
                                    else {
                                        return null;
                                    }
                                };
                                HeapMemorySegment.prototype.getInferSize = function (index, metaClass) {
                                    var previousObj = this.raw[index];
                                    if (previousObj != null) {
                                        return previousObj.length;
                                    }
                                    return 0;
                                };
                                HeapMemorySegment.prototype.getInferElem = function (index, arrayIndex, metaClass) {
                                    var res = this.raw[index];
                                    if (res != null && res != undefined) {
                                        return res[arrayIndex];
                                    }
                                    return 0;
                                };
                                HeapMemorySegment.prototype.setInferElem = function (index, arrayIndex, valueToInsert, metaClass) {
                                    var res = this.raw[index];
                                    if (res != null && res != undefined) {
                                        res[arrayIndex] = valueToInsert;
                                    }
                                    this._dirty = true;
                                };
                                HeapMemorySegment.prototype.extendInfer = function (index, newSize, metaClass) {
                                    if (this.raw != null) {
                                        var previous = this.raw[index];
                                        if (previous == null) {
                                            previous = new Array();
                                        }
                                        else {
                                            var incArray = new Array();
                                            System.arraycopy(previous, 0, incArray, 0, previous.length);
                                            previous = incArray;
                                        }
                                        this.raw[index] = previous;
                                        if (this._modifiedIndexes == null) {
                                            this._modifiedIndexes = new Array();
                                        }
                                        this._modifiedIndexes[index] = true;
                                        this._dirty = true;
                                    }
                                };
                                HeapMemorySegment.prototype.set = function (index, content, p_metaClass) {
                                    this.raw[index] = content;
                                    this._dirty = true;
                                    if (this._modifiedIndexes == null) {
                                        this._modifiedIndexes = new Array();
                                    }
                                    this._modifiedIndexes[index] = true;
                                };
                                HeapMemorySegment.prototype.clone = function (p_metaClass) {
                                    if (this.raw == null) {
                                        return new org.kevoree.modeling.memory.struct.segment.impl.HeapMemorySegment();
                                    }
                                    else {
                                        var cloned = new Array();
                                        System.arraycopy(this.raw, 0, cloned, 0, this.raw.length);
                                        var clonedEntry = new org.kevoree.modeling.memory.struct.segment.impl.HeapMemorySegment();
                                        clonedEntry._dirty = true;
                                        clonedEntry.raw = cloned;
                                        clonedEntry._metaClassIndex = this._metaClassIndex;
                                        return clonedEntry;
                                    }
                                };
                                HeapMemorySegment.prototype.toJSON = function (metaModel) {
                                    var builder = {};
                                    var metaClass = metaModel.metaClass(this._metaClassIndex);
                                    var metaElements = metaClass.metaElements();
                                    for (var i = 0; i < this.raw.length; i++) {
                                        if (this.raw[i] != undefined && this.raw[i] != null) {
                                            builder[metaElements[i].metaName()] = this.raw[i];
                                        }
                                    }
                                    return JSON.stringify(builder);
                                };
                                return HeapMemorySegment;
                            })();
                            impl.HeapMemorySegment = HeapMemorySegment;
                        })(impl = segment.impl || (segment.impl = {}));
                    })(segment = struct.segment || (struct.segment = {}));
                    var tree;
                    (function (tree) {
                        var impl;
                        (function (impl) {
                            var AbstractArrayTree = (function () {
                                function AbstractArrayTree() {
                                    this.kvSize = 1;
                                    this._threshold = 0;
                                    this._dirty = true;
                                    this._counter = 0;
                                    this._root_index = -1;
                                    this._size = 0;
                                    this._loadFactor = org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR;
                                }
                                AbstractArrayTree.prototype.allocate = function (capacity) {
                                    this.state = new org.kevoree.modeling.memory.struct.tree.impl.AbstractArrayTree.InternalState(new Array(), new Array(), new Array());
                                    this._threshold = (capacity * this._loadFactor);
                                };
                                AbstractArrayTree.prototype.reallocate = function (newCapacity) {
                                    this._threshold = (newCapacity * this._loadFactor);
                                    var new_back_kv = new Array();
                                    if (this.state != null && this.state._back_kv != null) {
                                        System.arraycopy(this.state._back_kv, 0, new_back_kv, 0, this._size * this.kvSize);
                                    }
                                    var new_back_colors = new Array();
                                    if (this.state != null && this.state._back_colors != null) {
                                        System.arraycopy(this.state._back_colors, 0, new_back_colors, 0, this._size);
                                        for (var i = this._size; i < newCapacity; i++) {
                                            new_back_colors[i] = false;
                                        }
                                    }
                                    var new_back_meta = new Array();
                                    if (this.state != null && this.state._back_meta != null) {
                                        System.arraycopy(this.state._back_meta, 0, new_back_meta, 0, this._size * AbstractArrayTree.META_SIZE);
                                        for (var i = this._size * AbstractArrayTree.META_SIZE; i < newCapacity * AbstractArrayTree.META_SIZE; i++) {
                                            new_back_meta[i] = -1;
                                        }
                                    }
                                    this.state = new org.kevoree.modeling.memory.struct.tree.impl.AbstractArrayTree.InternalState(new_back_meta, new_back_kv, new_back_colors);
                                };
                                AbstractArrayTree.prototype.size = function () {
                                    return this._size;
                                };
                                AbstractArrayTree.prototype.key = function (p_currentIndex) {
                                    if (p_currentIndex == -1) {
                                        return -1;
                                    }
                                    return this.state._back_kv[p_currentIndex * this.kvSize];
                                };
                                AbstractArrayTree.prototype.setKey = function (p_currentIndex, p_paramIndex) {
                                    this.state._back_kv[p_currentIndex * this.kvSize] = p_paramIndex;
                                };
                                AbstractArrayTree.prototype.value = function (p_currentIndex) {
                                    if (p_currentIndex == -1) {
                                        return -1;
                                    }
                                    return this.state._back_kv[(p_currentIndex * this.kvSize) + 1];
                                };
                                AbstractArrayTree.prototype.setValue = function (p_currentIndex, p_paramIndex) {
                                    this.state._back_kv[(p_currentIndex * this.kvSize) + 1] = p_paramIndex;
                                };
                                AbstractArrayTree.prototype.left = function (p_currentIndex) {
                                    if (p_currentIndex == -1) {
                                        return -1;
                                    }
                                    return this.state._back_meta[p_currentIndex * AbstractArrayTree.META_SIZE];
                                };
                                AbstractArrayTree.prototype.setLeft = function (p_currentIndex, p_paramIndex) {
                                    this.state._back_meta[p_currentIndex * AbstractArrayTree.META_SIZE] = p_paramIndex;
                                };
                                AbstractArrayTree.prototype.right = function (p_currentIndex) {
                                    if (p_currentIndex == -1) {
                                        return -1;
                                    }
                                    return this.state._back_meta[(p_currentIndex * AbstractArrayTree.META_SIZE) + 1];
                                };
                                AbstractArrayTree.prototype.setRight = function (p_currentIndex, p_paramIndex) {
                                    this.state._back_meta[(p_currentIndex * AbstractArrayTree.META_SIZE) + 1] = p_paramIndex;
                                };
                                AbstractArrayTree.prototype.parent = function (p_currentIndex) {
                                    if (p_currentIndex == -1) {
                                        return -1;
                                    }
                                    return this.state._back_meta[(p_currentIndex * AbstractArrayTree.META_SIZE) + 2];
                                };
                                AbstractArrayTree.prototype.setParent = function (p_currentIndex, p_paramIndex) {
                                    this.state._back_meta[(p_currentIndex * AbstractArrayTree.META_SIZE) + 2] = p_paramIndex;
                                };
                                AbstractArrayTree.prototype.color = function (p_currentIndex) {
                                    if (p_currentIndex == -1) {
                                        return true;
                                    }
                                    return this.state._back_colors[p_currentIndex];
                                };
                                AbstractArrayTree.prototype.setColor = function (p_currentIndex, p_paramIndex) {
                                    this.state._back_colors[p_currentIndex] = p_paramIndex;
                                };
                                AbstractArrayTree.prototype.grandParent = function (p_currentIndex) {
                                    if (p_currentIndex == -1) {
                                        return -1;
                                    }
                                    if (this.parent(p_currentIndex) != -1) {
                                        return this.parent(this.parent(p_currentIndex));
                                    }
                                    else {
                                        return -1;
                                    }
                                };
                                AbstractArrayTree.prototype.sibling = function (p_currentIndex) {
                                    if (this.parent(p_currentIndex) == -1) {
                                        return -1;
                                    }
                                    else {
                                        if (p_currentIndex == this.left(this.parent(p_currentIndex))) {
                                            return this.right(this.parent(p_currentIndex));
                                        }
                                        else {
                                            return this.left(this.parent(p_currentIndex));
                                        }
                                    }
                                };
                                AbstractArrayTree.prototype.uncle = function (p_currentIndex) {
                                    if (this.parent(p_currentIndex) != -1) {
                                        return this.sibling(this.parent(p_currentIndex));
                                    }
                                    else {
                                        return -1;
                                    }
                                };
                                AbstractArrayTree.prototype.previous = function (p_index) {
                                    var p = p_index;
                                    if (this.left(p) != -1) {
                                        p = this.left(p);
                                        while (this.right(p) != -1) {
                                            p = this.right(p);
                                        }
                                        return p;
                                    }
                                    else {
                                        if (this.parent(p) != -1) {
                                            if (p == this.right(this.parent(p))) {
                                                return this.parent(p);
                                            }
                                            else {
                                                while (this.parent(p) != -1 && p == this.left(this.parent(p))) {
                                                    p = this.parent(p);
                                                }
                                                return this.parent(p);
                                            }
                                        }
                                        else {
                                            return -1;
                                        }
                                    }
                                };
                                AbstractArrayTree.prototype.lookup = function (p_key) {
                                    var n = this._root_index;
                                    if (n == -1) {
                                        return org.kevoree.modeling.KConfig.NULL_LONG;
                                    }
                                    while (n != -1) {
                                        if (p_key == this.key(n)) {
                                            return this.key(n);
                                        }
                                        else {
                                            if (p_key < this.key(n)) {
                                                n = this.left(n);
                                            }
                                            else {
                                                n = this.right(n);
                                            }
                                        }
                                    }
                                    return n;
                                };
                                AbstractArrayTree.prototype.range = function (startKey, endKey, walker) {
                                    var indexEnd = this.internal_previousOrEqual_index(endKey);
                                    while (indexEnd != -1 && this.key(indexEnd) >= startKey) {
                                        walker(this.key(indexEnd));
                                        indexEnd = this.previous(indexEnd);
                                    }
                                };
                                AbstractArrayTree.prototype.internal_previousOrEqual_index = function (p_key) {
                                    var p = this._root_index;
                                    if (p == -1) {
                                        return p;
                                    }
                                    while (p != -1) {
                                        if (p_key == this.key(p)) {
                                            return p;
                                        }
                                        if (p_key > this.key(p)) {
                                            if (this.right(p) != -1) {
                                                p = this.right(p);
                                            }
                                            else {
                                                return p;
                                            }
                                        }
                                        else {
                                            if (this.left(p) != -1) {
                                                p = this.left(p);
                                            }
                                            else {
                                                var parent = this.parent(p);
                                                var ch = p;
                                                while (parent != -1 && ch == this.left(parent)) {
                                                    ch = parent;
                                                    parent = this.parent(parent);
                                                }
                                                return parent;
                                            }
                                        }
                                    }
                                    return -1;
                                };
                                AbstractArrayTree.prototype.rotateLeft = function (n) {
                                    var r = this.right(n);
                                    this.replaceNode(n, r);
                                    this.setRight(n, this.left(r));
                                    if (this.left(r) != -1) {
                                        this.setParent(this.left(r), n);
                                    }
                                    this.setLeft(r, n);
                                    this.setParent(n, r);
                                };
                                AbstractArrayTree.prototype.rotateRight = function (n) {
                                    var l = this.left(n);
                                    this.replaceNode(n, l);
                                    this.setLeft(n, this.right(l));
                                    if (this.right(l) != -1) {
                                        this.setParent(this.right(l), n);
                                    }
                                    this.setRight(l, n);
                                    this.setParent(n, l);
                                };
                                AbstractArrayTree.prototype.replaceNode = function (oldn, newn) {
                                    if (this.parent(oldn) == -1) {
                                        this._root_index = newn;
                                    }
                                    else {
                                        if (oldn == this.left(this.parent(oldn))) {
                                            this.setLeft(this.parent(oldn), newn);
                                        }
                                        else {
                                            this.setRight(this.parent(oldn), newn);
                                        }
                                    }
                                    if (newn != -1) {
                                        this.setParent(newn, this.parent(oldn));
                                    }
                                };
                                AbstractArrayTree.prototype.insertCase1 = function (n) {
                                    if (this.parent(n) == -1) {
                                        this.setColor(n, true);
                                    }
                                    else {
                                        this.insertCase2(n);
                                    }
                                };
                                AbstractArrayTree.prototype.insertCase2 = function (n) {
                                    if (!this.color(this.parent(n))) {
                                        this.insertCase3(n);
                                    }
                                };
                                AbstractArrayTree.prototype.insertCase3 = function (n) {
                                    if (!this.color(this.uncle(n))) {
                                        this.setColor(this.parent(n), true);
                                        this.setColor(this.uncle(n), true);
                                        this.setColor(this.grandParent(n), false);
                                        this.insertCase1(this.grandParent(n));
                                    }
                                    else {
                                        this.insertCase4(n);
                                    }
                                };
                                AbstractArrayTree.prototype.insertCase4 = function (n_n) {
                                    var n = n_n;
                                    if (n == this.right(this.parent(n)) && this.parent(n) == this.left(this.grandParent(n))) {
                                        this.rotateLeft(this.parent(n));
                                        n = this.left(n);
                                    }
                                    else {
                                        if (n == this.left(this.parent(n)) && this.parent(n) == this.right(this.grandParent(n))) {
                                            this.rotateRight(this.parent(n));
                                            n = this.right(n);
                                        }
                                    }
                                    this.insertCase5(n);
                                };
                                AbstractArrayTree.prototype.insertCase5 = function (n) {
                                    this.setColor(this.parent(n), true);
                                    this.setColor(this.grandParent(n), false);
                                    if (n == this.left(this.parent(n)) && this.parent(n) == this.left(this.grandParent(n))) {
                                        this.rotateRight(this.grandParent(n));
                                    }
                                    else {
                                        this.rotateLeft(this.grandParent(n));
                                    }
                                };
                                AbstractArrayTree.prototype.serialize = function (metaModel) {
                                    if (this._root_index == -1) {
                                        return "0";
                                    }
                                    var savedRoot = this._root_index;
                                    var internalState = this.state;
                                    var builder = new java.lang.StringBuilder();
                                    var treeSize = 0;
                                    for (var i = 0; i < internalState._back_meta.length / AbstractArrayTree.META_SIZE; i++) {
                                        var parentIndex = internalState._back_meta[(i * AbstractArrayTree.META_SIZE) + 2];
                                        if (parentIndex != -1 || i == savedRoot) {
                                            var isOnLeft = false;
                                            if (parentIndex != -1) {
                                                isOnLeft = internalState._back_meta[parentIndex * AbstractArrayTree.META_SIZE] == i;
                                            }
                                            if (!this.color(i)) {
                                                if (isOnLeft) {
                                                    builder.append(AbstractArrayTree.BLACK_LEFT);
                                                }
                                                else {
                                                    builder.append(AbstractArrayTree.BLACK_RIGHT);
                                                }
                                            }
                                            else {
                                                if (isOnLeft) {
                                                    builder.append(AbstractArrayTree.RED_LEFT);
                                                }
                                                else {
                                                    builder.append(AbstractArrayTree.RED_RIGHT);
                                                }
                                            }
                                            org.kevoree.modeling.util.maths.Base64.encodeLongToBuffer(internalState._back_kv[i * this.kvSize], builder);
                                            builder.append(',');
                                            if (parentIndex != -1) {
                                                org.kevoree.modeling.util.maths.Base64.encodeIntToBuffer(parentIndex, builder);
                                            }
                                            if (this.kvSize > 1) {
                                                builder.append(',');
                                                org.kevoree.modeling.util.maths.Base64.encodeLongToBuffer(internalState._back_kv[(i * this.kvSize) + 1], builder);
                                            }
                                            treeSize++;
                                        }
                                    }
                                    return org.kevoree.modeling.util.maths.Base64.encodeInt(treeSize) + "," + org.kevoree.modeling.util.maths.Base64.encodeInt(savedRoot) + builder.toString();
                                };
                                AbstractArrayTree.prototype.init = function (payload, metaModel) {
                                    if (payload == null || payload.length == 0) {
                                        return;
                                    }
                                    var initPos = 0;
                                    var cursor = 0;
                                    while (cursor < payload.length && payload.charAt(cursor) != ',' && payload.charAt(cursor) != AbstractArrayTree.BLACK_LEFT && payload.charAt(cursor) != AbstractArrayTree.BLACK_RIGHT && payload.charAt(cursor) != AbstractArrayTree.RED_LEFT && payload.charAt(cursor) != AbstractArrayTree.RED_RIGHT) {
                                        cursor++;
                                    }
                                    if (payload.charAt(cursor) == ',') {
                                        this._size = org.kevoree.modeling.util.maths.Base64.decodeToIntWithBounds(payload, initPos, cursor);
                                        cursor++;
                                        initPos = cursor;
                                    }
                                    while (cursor < payload.length && payload.charAt(cursor) != AbstractArrayTree.BLACK_LEFT && payload.charAt(cursor) != AbstractArrayTree.BLACK_RIGHT && payload.charAt(cursor) != AbstractArrayTree.RED_LEFT && payload.charAt(cursor) != AbstractArrayTree.RED_RIGHT) {
                                        cursor++;
                                    }
                                    this._root_index = org.kevoree.modeling.util.maths.Base64.decodeToIntWithBounds(payload, initPos, cursor);
                                    this.allocate(this._size);
                                    for (var i = 0; i < this._size; i++) {
                                        var offsetI = i * AbstractArrayTree.META_SIZE;
                                        this.state._back_meta[offsetI] = -1;
                                        this.state._back_meta[offsetI + 1] = -1;
                                        this.state._back_meta[offsetI + 2] = -1;
                                    }
                                    var currentLoopIndex = 0;
                                    while (cursor < payload.length) {
                                        while (cursor < payload.length && payload.charAt(cursor) != AbstractArrayTree.BLACK_LEFT && payload.charAt(cursor) != AbstractArrayTree.BLACK_RIGHT && payload.charAt(cursor) != AbstractArrayTree.RED_LEFT && payload.charAt(cursor) != AbstractArrayTree.RED_RIGHT) {
                                            cursor++;
                                        }
                                        if (cursor < payload.length) {
                                            var elem = payload.charAt(cursor);
                                            var isOnLeft = false;
                                            if (elem == AbstractArrayTree.BLACK_LEFT || elem == AbstractArrayTree.RED_LEFT) {
                                                isOnLeft = true;
                                            }
                                            if (elem == AbstractArrayTree.BLACK_LEFT || elem == AbstractArrayTree.BLACK_RIGHT) {
                                                this.setColor(currentLoopIndex, false);
                                            }
                                            else {
                                                this.setColor(currentLoopIndex, true);
                                            }
                                            cursor++;
                                            var beginChunk = cursor;
                                            while (cursor < payload.length && payload.charAt(cursor) != ',') {
                                                cursor++;
                                            }
                                            var loopKey = org.kevoree.modeling.util.maths.Base64.decodeToLongWithBounds(payload, beginChunk, cursor);
                                            this.setKey(currentLoopIndex, loopKey);
                                            cursor++;
                                            beginChunk = cursor;
                                            while (cursor < payload.length && payload.charAt(cursor) != ',' && payload.charAt(cursor) != AbstractArrayTree.BLACK_LEFT && payload.charAt(cursor) != AbstractArrayTree.BLACK_RIGHT && payload.charAt(cursor) != AbstractArrayTree.RED_LEFT && payload.charAt(cursor) != AbstractArrayTree.RED_RIGHT) {
                                                cursor++;
                                            }
                                            if (cursor > beginChunk) {
                                                var parentRaw = org.kevoree.modeling.util.maths.Base64.decodeToIntWithBounds(payload, beginChunk, cursor);
                                                this.setParent(currentLoopIndex, parentRaw);
                                                if (isOnLeft) {
                                                    this.setLeft(parentRaw, currentLoopIndex);
                                                }
                                                else {
                                                    this.setRight(parentRaw, currentLoopIndex);
                                                }
                                            }
                                            if (cursor < payload.length && payload.charAt(cursor) == ',') {
                                                cursor++;
                                                beginChunk = cursor;
                                                while (cursor < payload.length && payload.charAt(cursor) != AbstractArrayTree.BLACK_LEFT && payload.charAt(cursor) != AbstractArrayTree.BLACK_RIGHT && payload.charAt(cursor) != AbstractArrayTree.RED_LEFT && payload.charAt(cursor) != AbstractArrayTree.RED_RIGHT) {
                                                    cursor++;
                                                }
                                                if (cursor > beginChunk) {
                                                    var currentValue = org.kevoree.modeling.util.maths.Base64.decodeToLongWithBounds(payload, beginChunk, cursor);
                                                    this.setValue(currentLoopIndex, currentValue);
                                                }
                                            }
                                            currentLoopIndex++;
                                        }
                                    }
                                };
                                AbstractArrayTree.prototype.isDirty = function () {
                                    return this._dirty;
                                };
                                AbstractArrayTree.prototype.setClean = function (p_metaModel) {
                                    this._dirty = false;
                                };
                                AbstractArrayTree.prototype.setDirty = function () {
                                    this._dirty = true;
                                };
                                AbstractArrayTree.prototype.counter = function () {
                                    return this._counter;
                                };
                                AbstractArrayTree.prototype.inc = function () {
                                    this.internal_counter(true);
                                };
                                AbstractArrayTree.prototype.dec = function () {
                                    this.internal_counter(false);
                                };
                                AbstractArrayTree.prototype.internal_counter = function (inc) {
                                    if (inc) {
                                        this._counter++;
                                    }
                                    else {
                                        this._counter--;
                                    }
                                };
                                AbstractArrayTree.prototype.free = function (p_metaModel) {
                                    this.state = null;
                                    this._size = 0;
                                    this._threshold = 0;
                                };
                                AbstractArrayTree.prototype.internal_insert = function (p_key, p_value) {
                                    this._dirty = true;
                                    if ((this._size + 1) > this._threshold) {
                                        var length = (this._size == 0 ? 1 : this._size << 1);
                                        this.reallocate(length);
                                    }
                                    var newIndex = this._size;
                                    if (newIndex == 0) {
                                        this.setKey(newIndex, p_key);
                                        if (this.kvSize == 2) {
                                            this.setValue(newIndex, p_value);
                                        }
                                        this.setColor(newIndex, false);
                                        this.setLeft(newIndex, -1);
                                        this.setRight(newIndex, -1);
                                        this.setParent(newIndex, -1);
                                        this._root_index = newIndex;
                                        this._size = 1;
                                    }
                                    else {
                                        var n = this._root_index;
                                        while (true) {
                                            if (p_key == this.key(n)) {
                                                return;
                                            }
                                            else {
                                                if (p_key < this.key(n)) {
                                                    if (this.left(n) == -1) {
                                                        this.setKey(newIndex, p_key);
                                                        if (this.kvSize == 2) {
                                                            this.setValue(newIndex, p_value);
                                                        }
                                                        this.setColor(newIndex, false);
                                                        this.setLeft(newIndex, -1);
                                                        this.setRight(newIndex, -1);
                                                        this.setParent(newIndex, -1);
                                                        this.setLeft(n, newIndex);
                                                        this._size++;
                                                        break;
                                                    }
                                                    else {
                                                        n = this.left(n);
                                                    }
                                                }
                                                else {
                                                    if (this.right(n) == -1) {
                                                        this.setKey(newIndex, p_key);
                                                        if (this.kvSize == 2) {
                                                            this.setValue(newIndex, p_value);
                                                        }
                                                        this.setColor(newIndex, false);
                                                        this.setLeft(newIndex, -1);
                                                        this.setRight(newIndex, -1);
                                                        this.setParent(newIndex, -1);
                                                        this.setRight(n, newIndex);
                                                        this._size++;
                                                        break;
                                                    }
                                                    else {
                                                        n = this.right(n);
                                                    }
                                                }
                                            }
                                        }
                                        this.setParent(newIndex, n);
                                    }
                                    this.insertCase1(newIndex);
                                };
                                AbstractArrayTree.prototype.internal_lookup_value = function (p_key) {
                                    var n = this._root_index;
                                    if (n == -1) {
                                        return org.kevoree.modeling.KConfig.NULL_LONG;
                                    }
                                    while (n != -1) {
                                        if (p_key == this.key(n)) {
                                            return this.value(n);
                                        }
                                        else {
                                            if (p_key < this.key(n)) {
                                                n = this.left(n);
                                            }
                                            else {
                                                n = this.right(n);
                                            }
                                        }
                                    }
                                    return n;
                                };
                                AbstractArrayTree.BLACK_LEFT = '{';
                                AbstractArrayTree.BLACK_RIGHT = '}';
                                AbstractArrayTree.RED_LEFT = '[';
                                AbstractArrayTree.RED_RIGHT = ']';
                                AbstractArrayTree.META_SIZE = 3;
                                return AbstractArrayTree;
                            })();
                            impl.AbstractArrayTree = AbstractArrayTree;
                            var AbstractArrayTree;
                            (function (AbstractArrayTree) {
                                var InternalState = (function () {
                                    function InternalState(_back_meta, _back_kv, _back_colors) {
                                        this._back_meta = _back_meta;
                                        this._back_kv = _back_kv;
                                        this._back_colors = _back_colors;
                                    }
                                    return InternalState;
                                })();
                                AbstractArrayTree.InternalState = InternalState;
                            })(AbstractArrayTree = impl.AbstractArrayTree || (impl.AbstractArrayTree = {}));
                            var ArrayLongLongTree = (function (_super) {
                                __extends(ArrayLongLongTree, _super);
                                function ArrayLongLongTree() {
                                    _super.call(this);
                                    this.kvSize = 2;
                                }
                                ArrayLongLongTree.prototype.previousOrEqualValue = function (p_key) {
                                    var result = this.internal_previousOrEqual_index(p_key);
                                    if (result != -1) {
                                        return this.value(result);
                                    }
                                    else {
                                        return org.kevoree.modeling.KConfig.NULL_LONG;
                                    }
                                };
                                ArrayLongLongTree.prototype.lookupValue = function (p_key) {
                                    return this.internal_lookup_value(p_key);
                                };
                                ArrayLongLongTree.prototype.insert = function (p_key, p_value) {
                                    this.internal_insert(p_key, p_value);
                                };
                                return ArrayLongLongTree;
                            })(org.kevoree.modeling.memory.struct.tree.impl.AbstractArrayTree);
                            impl.ArrayLongLongTree = ArrayLongLongTree;
                            var ArrayLongTree = (function (_super) {
                                __extends(ArrayLongTree, _super);
                                function ArrayLongTree() {
                                    _super.apply(this, arguments);
                                }
                                ArrayLongTree.prototype.previousOrEqual = function (key) {
                                    var result = this.internal_previousOrEqual_index(key);
                                    if (result != -1) {
                                        return this.key(result);
                                    }
                                    else {
                                        return org.kevoree.modeling.KConfig.NULL_LONG;
                                    }
                                };
                                ArrayLongTree.prototype.insert = function (p_key) {
                                    this.internal_insert(p_key, p_key);
                                };
                                return ArrayLongTree;
                            })(org.kevoree.modeling.memory.struct.tree.impl.AbstractArrayTree);
                            impl.ArrayLongTree = ArrayLongTree;
                        })(impl = tree.impl || (tree.impl = {}));
                    })(tree = struct.tree || (struct.tree = {}));
                })(struct = memory.struct || (memory.struct = {}));
            })(memory = modeling.memory || (modeling.memory = {}));
            var message;
            (function (message) {
                var KMessageLoader = (function () {
                    function KMessageLoader() {
                    }
                    KMessageLoader.load = function (payload) {
                        if (payload == null) {
                            return null;
                        }
                        var objectReader = new org.kevoree.modeling.format.json.JsonObjectReader();
                        objectReader.parseObject(payload);
                        try {
                            var parsedType = java.lang.Integer.parseInt(objectReader.get(KMessageLoader.TYPE_NAME).toString());
                            if (parsedType == KMessageLoader.EVENTS_TYPE) {
                                var eventsMessage = null;
                                if (objectReader.get(KMessageLoader.KEYS_NAME) != null && objectReader.get(KMessageLoader.SENDER) != null) {
                                    var sender = java.lang.Integer.parseInt(objectReader.get(KMessageLoader.SENDER).toString());
                                    var objIdsRaw = objectReader.getAsStringArray(KMessageLoader.KEYS_NAME);
                                    eventsMessage = new org.kevoree.modeling.message.impl.Events(objIdsRaw.length, sender);
                                    var keys = new Array();
                                    for (var i = 0; i < objIdsRaw.length; i++) {
                                        try {
                                            keys[i] = org.kevoree.modeling.KContentKey.create(objIdsRaw[i]);
                                        }
                                        catch ($ex$) {
                                            if ($ex$ instanceof java.lang.Exception) {
                                                var e = $ex$;
                                                e.printStackTrace();
                                            }
                                            else {
                                                throw $ex$;
                                            }
                                        }
                                    }
                                    eventsMessage._objIds = keys;
                                    if (objectReader.get(KMessageLoader.VALUES_NAME) != null) {
                                        var metaInt = objectReader.getAsStringArray(KMessageLoader.VALUES_NAME);
                                        var metaIndexes = new Array();
                                        for (var i = 0; i < metaInt.length; i++) {
                                            try {
                                                if (metaInt[i] != null) {
                                                    var splitted = metaInt[i].split("%");
                                                    var newMeta = new Array();
                                                    for (var h = 0; h < splitted.length; h++) {
                                                        if (splitted[h] != null && !splitted[h].isEmpty()) {
                                                            newMeta[h] = java.lang.Integer.parseInt(splitted[h]);
                                                        }
                                                    }
                                                    metaIndexes[i] = newMeta;
                                                }
                                            }
                                            catch ($ex$) {
                                                if ($ex$ instanceof java.lang.Exception) {
                                                    var e = $ex$;
                                                    e.printStackTrace();
                                                }
                                                else {
                                                    throw $ex$;
                                                }
                                            }
                                        }
                                        eventsMessage._metaindexes = metaIndexes;
                                    }
                                }
                                return eventsMessage;
                            }
                            else {
                                if (parsedType == KMessageLoader.GET_REQ_TYPE) {
                                    var getKeysRequest = new org.kevoree.modeling.message.impl.GetRequest();
                                    if (objectReader.get(KMessageLoader.ID_NAME) != null) {
                                        getKeysRequest.id = java.lang.Long.parseLong(objectReader.get(KMessageLoader.ID_NAME).toString());
                                    }
                                    if (objectReader.get(KMessageLoader.KEYS_NAME) != null) {
                                        var metaInt = objectReader.getAsStringArray(KMessageLoader.KEYS_NAME);
                                        var keys = new Array();
                                        for (var i = 0; i < metaInt.length; i++) {
                                            keys[i] = org.kevoree.modeling.KContentKey.create(metaInt[i]);
                                        }
                                        getKeysRequest.keys = keys;
                                    }
                                    return getKeysRequest;
                                }
                                else {
                                    if (parsedType == KMessageLoader.GET_RES_TYPE) {
                                        var getResult = new org.kevoree.modeling.message.impl.GetResult();
                                        if (objectReader.get(KMessageLoader.ID_NAME) != null) {
                                            getResult.id = java.lang.Long.parseLong(objectReader.get(KMessageLoader.ID_NAME).toString());
                                        }
                                        if (objectReader.get(KMessageLoader.VALUES_NAME) != null) {
                                            var metaInt = objectReader.getAsStringArray(KMessageLoader.VALUES_NAME);
                                            var values = new Array();
                                            for (var i = 0; i < metaInt.length; i++) {
                                                values[i] = org.kevoree.modeling.format.json.JsonString.unescape(metaInt[i]);
                                            }
                                            getResult.values = values;
                                        }
                                        return getResult;
                                    }
                                    else {
                                        if (parsedType == KMessageLoader.PUT_REQ_TYPE) {
                                            var putRequest = new org.kevoree.modeling.message.impl.PutRequest();
                                            if (objectReader.get(KMessageLoader.ID_NAME) != null) {
                                                putRequest.id = java.lang.Long.parseLong(objectReader.get(KMessageLoader.ID_NAME).toString());
                                            }
                                            var toFlatKeys = null;
                                            var toFlatValues = null;
                                            if (objectReader.get(KMessageLoader.KEYS_NAME) != null) {
                                                toFlatKeys = objectReader.getAsStringArray(KMessageLoader.KEYS_NAME);
                                            }
                                            if (objectReader.get(KMessageLoader.VALUES_NAME) != null) {
                                                toFlatValues = objectReader.getAsStringArray(KMessageLoader.VALUES_NAME);
                                            }
                                            if (toFlatKeys != null && toFlatValues != null && toFlatKeys.length == toFlatValues.length) {
                                                if (putRequest.request == null) {
                                                    putRequest.request = new org.kevoree.modeling.cdn.impl.ContentPutRequest(toFlatKeys.length);
                                                }
                                                for (var i = 0; i < toFlatKeys.length; i++) {
                                                    putRequest.request.put(org.kevoree.modeling.KContentKey.create(toFlatKeys[i]), org.kevoree.modeling.format.json.JsonString.unescape(toFlatValues[i]));
                                                }
                                            }
                                            return putRequest;
                                        }
                                        else {
                                            if (parsedType == KMessageLoader.PUT_RES_TYPE) {
                                                var putResult = new org.kevoree.modeling.message.impl.PutResult();
                                                if (objectReader.get(KMessageLoader.ID_NAME) != null) {
                                                    putResult.id = java.lang.Long.parseLong(objectReader.get(KMessageLoader.ID_NAME).toString());
                                                }
                                                return putResult;
                                            }
                                            else {
                                                if (parsedType == KMessageLoader.OPERATION_CALL_TYPE) {
                                                    var callMessage = new org.kevoree.modeling.message.impl.OperationCallMessage();
                                                    if (objectReader.get(KMessageLoader.ID_NAME) != null) {
                                                        callMessage.id = java.lang.Long.parseLong(objectReader.get(KMessageLoader.ID_NAME).toString());
                                                    }
                                                    if (objectReader.get(KMessageLoader.KEY_NAME) != null) {
                                                        callMessage.key = org.kevoree.modeling.KContentKey.create(objectReader.get(KMessageLoader.KEY_NAME).toString());
                                                    }
                                                    if (objectReader.get(KMessageLoader.CLASS_IDX_NAME) != null) {
                                                        callMessage.classIndex = java.lang.Integer.parseInt(objectReader.get(KMessageLoader.CLASS_IDX_NAME).toString());
                                                    }
                                                    if (objectReader.get(KMessageLoader.OPERATION_NAME) != null) {
                                                        callMessage.opIndex = java.lang.Integer.parseInt(objectReader.get(KMessageLoader.OPERATION_NAME).toString());
                                                    }
                                                    if (objectReader.get(KMessageLoader.PARAMETERS_NAME) != null) {
                                                        var params = objectReader.getAsStringArray(KMessageLoader.PARAMETERS_NAME);
                                                        var toFlat = new Array();
                                                        for (var i = 0; i < params.length; i++) {
                                                            toFlat[i] = org.kevoree.modeling.format.json.JsonString.unescape(params[i]);
                                                        }
                                                        callMessage.params = toFlat;
                                                    }
                                                    return callMessage;
                                                }
                                                else {
                                                    if (parsedType == KMessageLoader.OPERATION_RESULT_TYPE) {
                                                        var resultMessage = new org.kevoree.modeling.message.impl.OperationResultMessage();
                                                        if (objectReader.get(KMessageLoader.ID_NAME) != null) {
                                                            resultMessage.id = java.lang.Long.parseLong(objectReader.get(KMessageLoader.ID_NAME).toString());
                                                        }
                                                        if (objectReader.get(KMessageLoader.KEY_NAME) != null) {
                                                            resultMessage.key = org.kevoree.modeling.KContentKey.create(objectReader.get(KMessageLoader.KEY_NAME).toString());
                                                        }
                                                        if (objectReader.get(KMessageLoader.VALUE_NAME) != null) {
                                                            resultMessage.value = objectReader.get(KMessageLoader.VALUE_NAME).toString();
                                                        }
                                                        return resultMessage;
                                                    }
                                                    else {
                                                        if (parsedType == KMessageLoader.ATOMIC_GET_INC_REQUEST_TYPE) {
                                                            var atomicGetMessage = new org.kevoree.modeling.message.impl.AtomicGetIncrementRequest();
                                                            if (objectReader.get(KMessageLoader.ID_NAME) != null) {
                                                                atomicGetMessage.id = java.lang.Long.parseLong(objectReader.get(KMessageLoader.ID_NAME).toString());
                                                            }
                                                            if (objectReader.get(KMessageLoader.KEY_NAME) != null) {
                                                                atomicGetMessage.key = org.kevoree.modeling.KContentKey.create(objectReader.get(KMessageLoader.KEY_NAME).toString());
                                                            }
                                                            return atomicGetMessage;
                                                        }
                                                        else {
                                                            if (parsedType == KMessageLoader.ATOMIC_GET_INC_RESULT_TYPE) {
                                                                var atomicGetResultMessage = new org.kevoree.modeling.message.impl.AtomicGetIncrementResult();
                                                                if (objectReader.get(KMessageLoader.ID_NAME) != null) {
                                                                    atomicGetResultMessage.id = java.lang.Long.parseLong(objectReader.get(KMessageLoader.ID_NAME).toString());
                                                                }
                                                                if (objectReader.get(KMessageLoader.VALUE_NAME) != null) {
                                                                    try {
                                                                        atomicGetResultMessage.value = java.lang.Short.parseShort(objectReader.get(KMessageLoader.VALUE_NAME).toString());
                                                                    }
                                                                    catch ($ex$) {
                                                                        if ($ex$ instanceof java.lang.Exception) {
                                                                            var e = $ex$;
                                                                            e.printStackTrace();
                                                                        }
                                                                        else {
                                                                            throw $ex$;
                                                                        }
                                                                    }
                                                                }
                                                                return atomicGetResultMessage;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            return null;
                        }
                        catch ($ex$) {
                            if ($ex$ instanceof java.lang.Exception) {
                                var e = $ex$;
                                e.printStackTrace();
                                return null;
                            }
                            else {
                                throw $ex$;
                            }
                        }
                    };
                    KMessageLoader.TYPE_NAME = "type";
                    KMessageLoader.OPERATION_NAME = "op";
                    KMessageLoader.KEY_NAME = "key";
                    KMessageLoader.KEYS_NAME = "keys";
                    KMessageLoader.SENDER = "sender";
                    KMessageLoader.ID_NAME = "id";
                    KMessageLoader.VALUE_NAME = "value";
                    KMessageLoader.VALUES_NAME = "values";
                    KMessageLoader.CLASS_IDX_NAME = "class";
                    KMessageLoader.PARAMETERS_NAME = "params";
                    KMessageLoader.EVENTS_TYPE = 0;
                    KMessageLoader.GET_REQ_TYPE = 1;
                    KMessageLoader.GET_RES_TYPE = 2;
                    KMessageLoader.PUT_REQ_TYPE = 3;
                    KMessageLoader.PUT_RES_TYPE = 4;
                    KMessageLoader.OPERATION_CALL_TYPE = 5;
                    KMessageLoader.OPERATION_RESULT_TYPE = 6;
                    KMessageLoader.ATOMIC_GET_INC_REQUEST_TYPE = 7;
                    KMessageLoader.ATOMIC_GET_INC_RESULT_TYPE = 8;
                    return KMessageLoader;
                })();
                message.KMessageLoader = KMessageLoader;
                var impl;
                (function (impl) {
                    var AtomicGetIncrementRequest = (function () {
                        function AtomicGetIncrementRequest() {
                        }
                        AtomicGetIncrementRequest.prototype.json = function () {
                            var buffer = new java.lang.StringBuilder();
                            org.kevoree.modeling.message.impl.MessageHelper.printJsonStart(buffer);
                            org.kevoree.modeling.message.impl.MessageHelper.printType(buffer, this.type());
                            org.kevoree.modeling.message.impl.MessageHelper.printElem(this.id, org.kevoree.modeling.message.KMessageLoader.ID_NAME, buffer);
                            org.kevoree.modeling.message.impl.MessageHelper.printElem(this.key, org.kevoree.modeling.message.KMessageLoader.KEY_NAME, buffer);
                            org.kevoree.modeling.message.impl.MessageHelper.printJsonEnd(buffer);
                            return buffer.toString();
                        };
                        AtomicGetIncrementRequest.prototype.type = function () {
                            return org.kevoree.modeling.message.KMessageLoader.ATOMIC_GET_INC_REQUEST_TYPE;
                        };
                        return AtomicGetIncrementRequest;
                    })();
                    impl.AtomicGetIncrementRequest = AtomicGetIncrementRequest;
                    var AtomicGetIncrementResult = (function () {
                        function AtomicGetIncrementResult() {
                        }
                        AtomicGetIncrementResult.prototype.json = function () {
                            var buffer = new java.lang.StringBuilder();
                            org.kevoree.modeling.message.impl.MessageHelper.printJsonStart(buffer);
                            org.kevoree.modeling.message.impl.MessageHelper.printType(buffer, this.type());
                            org.kevoree.modeling.message.impl.MessageHelper.printElem(this.id, org.kevoree.modeling.message.KMessageLoader.ID_NAME, buffer);
                            org.kevoree.modeling.message.impl.MessageHelper.printElem(this.value, org.kevoree.modeling.message.KMessageLoader.VALUE_NAME, buffer);
                            org.kevoree.modeling.message.impl.MessageHelper.printJsonEnd(buffer);
                            return buffer.toString();
                        };
                        AtomicGetIncrementResult.prototype.type = function () {
                            return org.kevoree.modeling.message.KMessageLoader.ATOMIC_GET_INC_RESULT_TYPE;
                        };
                        return AtomicGetIncrementResult;
                    })();
                    impl.AtomicGetIncrementResult = AtomicGetIncrementResult;
                    var Events = (function () {
                        function Events(nbObject, p_sender) {
                            this._objIds = new Array();
                            this._metaindexes = new Array();
                            this._size = nbObject;
                            this._sender = p_sender;
                        }
                        Events.prototype.getSender = function () {
                            return this._sender;
                        };
                        Events.prototype.allKeys = function () {
                            return this._objIds;
                        };
                        Events.prototype.json = function () {
                            var buffer = new java.lang.StringBuilder();
                            org.kevoree.modeling.message.impl.MessageHelper.printJsonStart(buffer);
                            org.kevoree.modeling.message.impl.MessageHelper.printType(buffer, this.type());
                            buffer.append(",");
                            buffer.append("\"sender\":");
                            buffer.append(this._sender);
                            buffer.append(",");
                            buffer.append("\"");
                            buffer.append(org.kevoree.modeling.message.KMessageLoader.KEYS_NAME).append("\":[");
                            for (var i = 0; i < this._objIds.length; i++) {
                                if (i != 0) {
                                    buffer.append(",");
                                }
                                buffer.append("\"");
                                buffer.append(this._objIds[i]);
                                buffer.append("\"");
                            }
                            buffer.append("]\n");
                            if (this._metaindexes != null) {
                                buffer.append(",");
                                buffer.append("\"");
                                buffer.append(org.kevoree.modeling.message.KMessageLoader.VALUES_NAME).append("\":[");
                                for (var i = 0; i < this._metaindexes.length; i++) {
                                    if (i != 0) {
                                        buffer.append(",");
                                    }
                                    buffer.append("\"");
                                    var metaModified = this._metaindexes[i];
                                    if (metaModified != null) {
                                        for (var j = 0; j < metaModified.length; j++) {
                                            if (j != 0) {
                                                buffer.append("%");
                                            }
                                            buffer.append(metaModified[j]);
                                        }
                                    }
                                    buffer.append("\"");
                                }
                                buffer.append("]\n");
                            }
                            org.kevoree.modeling.message.impl.MessageHelper.printJsonEnd(buffer);
                            return buffer.toString();
                        };
                        Events.prototype.type = function () {
                            return org.kevoree.modeling.message.KMessageLoader.EVENTS_TYPE;
                        };
                        Events.prototype.size = function () {
                            return this._size;
                        };
                        Events.prototype.setEvent = function (index, p_objId, p_metaIndexes) {
                            this._objIds[index] = p_objId;
                            this._metaindexes[index] = p_metaIndexes;
                        };
                        Events.prototype.getKey = function (index) {
                            return this._objIds[index];
                        };
                        Events.prototype.getIndexes = function (index) {
                            return this._metaindexes[index];
                        };
                        return Events;
                    })();
                    impl.Events = Events;
                    var GetRequest = (function () {
                        function GetRequest() {
                        }
                        GetRequest.prototype.json = function () {
                            var buffer = new java.lang.StringBuilder();
                            org.kevoree.modeling.message.impl.MessageHelper.printJsonStart(buffer);
                            org.kevoree.modeling.message.impl.MessageHelper.printType(buffer, this.type());
                            org.kevoree.modeling.message.impl.MessageHelper.printElem(this.id, org.kevoree.modeling.message.KMessageLoader.ID_NAME, buffer);
                            if (this.keys != null) {
                                buffer.append(",");
                                buffer.append("\"");
                                buffer.append(org.kevoree.modeling.message.KMessageLoader.KEYS_NAME).append("\":[");
                                for (var i = 0; i < this.keys.length; i++) {
                                    if (i != 0) {
                                        buffer.append(",");
                                    }
                                    buffer.append("\"");
                                    buffer.append(this.keys[i].toString());
                                    buffer.append("\"");
                                }
                                buffer.append("]\n");
                            }
                            org.kevoree.modeling.message.impl.MessageHelper.printJsonEnd(buffer);
                            return buffer.toString();
                        };
                        GetRequest.prototype.type = function () {
                            return org.kevoree.modeling.message.KMessageLoader.GET_REQ_TYPE;
                        };
                        return GetRequest;
                    })();
                    impl.GetRequest = GetRequest;
                    var GetResult = (function () {
                        function GetResult() {
                        }
                        GetResult.prototype.json = function () {
                            var buffer = new java.lang.StringBuilder();
                            org.kevoree.modeling.message.impl.MessageHelper.printJsonStart(buffer);
                            org.kevoree.modeling.message.impl.MessageHelper.printType(buffer, this.type());
                            org.kevoree.modeling.message.impl.MessageHelper.printElem(this.id, org.kevoree.modeling.message.KMessageLoader.ID_NAME, buffer);
                            if (this.values != null) {
                                buffer.append(",");
                                buffer.append("\"");
                                buffer.append(org.kevoree.modeling.message.KMessageLoader.VALUES_NAME).append("\":[");
                                for (var i = 0; i < this.values.length; i++) {
                                    if (i != 0) {
                                        buffer.append(",");
                                    }
                                    buffer.append("\"");
                                    buffer.append(org.kevoree.modeling.format.json.JsonString.encode(this.values[i]));
                                    buffer.append("\"");
                                }
                                buffer.append("]\n");
                            }
                            org.kevoree.modeling.message.impl.MessageHelper.printJsonEnd(buffer);
                            return buffer.toString();
                        };
                        GetResult.prototype.type = function () {
                            return org.kevoree.modeling.message.KMessageLoader.GET_RES_TYPE;
                        };
                        return GetResult;
                    })();
                    impl.GetResult = GetResult;
                    var MessageHelper = (function () {
                        function MessageHelper() {
                        }
                        MessageHelper.printJsonStart = function (builder) {
                            builder.append("{\n");
                        };
                        MessageHelper.printJsonEnd = function (builder) {
                            builder.append("}\n");
                        };
                        MessageHelper.printType = function (builder, type) {
                            builder.append("\"");
                            builder.append(org.kevoree.modeling.message.KMessageLoader.TYPE_NAME);
                            builder.append("\":\"");
                            builder.append(type);
                            builder.append("\"\n");
                        };
                        MessageHelper.printElem = function (elem, name, builder) {
                            if (elem != null) {
                                builder.append(",");
                                builder.append("\"");
                                builder.append(name);
                                builder.append("\":\"");
                                builder.append(elem.toString());
                                builder.append("\"\n");
                            }
                        };
                        return MessageHelper;
                    })();
                    impl.MessageHelper = MessageHelper;
                    var OperationCallMessage = (function () {
                        function OperationCallMessage() {
                        }
                        OperationCallMessage.prototype.json = function () {
                            var buffer = new java.lang.StringBuilder();
                            org.kevoree.modeling.message.impl.MessageHelper.printJsonStart(buffer);
                            org.kevoree.modeling.message.impl.MessageHelper.printType(buffer, this.type());
                            org.kevoree.modeling.message.impl.MessageHelper.printElem(this.id, org.kevoree.modeling.message.KMessageLoader.ID_NAME, buffer);
                            org.kevoree.modeling.message.impl.MessageHelper.printElem(this.key, org.kevoree.modeling.message.KMessageLoader.KEY_NAME, buffer);
                            buffer.append(",\"").append(org.kevoree.modeling.message.KMessageLoader.CLASS_IDX_NAME).append("\":\"").append(this.classIndex).append("\"");
                            buffer.append(",\"").append(org.kevoree.modeling.message.KMessageLoader.OPERATION_NAME).append("\":\"").append(this.opIndex).append("\"");
                            if (this.params != null) {
                                buffer.append(",\"");
                                buffer.append(org.kevoree.modeling.message.KMessageLoader.PARAMETERS_NAME).append("\":[");
                                for (var i = 0; i < this.params.length; i++) {
                                    if (i != 0) {
                                        buffer.append(",");
                                    }
                                    buffer.append("\"");
                                    buffer.append(org.kevoree.modeling.format.json.JsonString.encode(this.params[i]));
                                    buffer.append("\"");
                                }
                                buffer.append("]\n");
                            }
                            org.kevoree.modeling.message.impl.MessageHelper.printJsonEnd(buffer);
                            return buffer.toString();
                        };
                        OperationCallMessage.prototype.type = function () {
                            return org.kevoree.modeling.message.KMessageLoader.OPERATION_CALL_TYPE;
                        };
                        return OperationCallMessage;
                    })();
                    impl.OperationCallMessage = OperationCallMessage;
                    var OperationResultMessage = (function () {
                        function OperationResultMessage() {
                        }
                        OperationResultMessage.prototype.json = function () {
                            var buffer = new java.lang.StringBuilder();
                            org.kevoree.modeling.message.impl.MessageHelper.printJsonStart(buffer);
                            org.kevoree.modeling.message.impl.MessageHelper.printType(buffer, this.type());
                            org.kevoree.modeling.message.impl.MessageHelper.printElem(this.id, org.kevoree.modeling.message.KMessageLoader.ID_NAME, buffer);
                            org.kevoree.modeling.message.impl.MessageHelper.printElem(this.key, org.kevoree.modeling.message.KMessageLoader.KEY_NAME, buffer);
                            org.kevoree.modeling.message.impl.MessageHelper.printElem(this.value, org.kevoree.modeling.message.KMessageLoader.VALUE_NAME, buffer);
                            org.kevoree.modeling.message.impl.MessageHelper.printJsonEnd(buffer);
                            return buffer.toString();
                        };
                        OperationResultMessage.prototype.type = function () {
                            return org.kevoree.modeling.message.KMessageLoader.OPERATION_RESULT_TYPE;
                        };
                        return OperationResultMessage;
                    })();
                    impl.OperationResultMessage = OperationResultMessage;
                    var PutRequest = (function () {
                        function PutRequest() {
                        }
                        PutRequest.prototype.json = function () {
                            var buffer = new java.lang.StringBuilder();
                            org.kevoree.modeling.message.impl.MessageHelper.printJsonStart(buffer);
                            org.kevoree.modeling.message.impl.MessageHelper.printType(buffer, this.type());
                            org.kevoree.modeling.message.impl.MessageHelper.printElem(this.id, org.kevoree.modeling.message.KMessageLoader.ID_NAME, buffer);
                            if (this.request != null) {
                                buffer.append(",\"");
                                buffer.append(org.kevoree.modeling.message.KMessageLoader.KEYS_NAME).append("\":[");
                                for (var i = 0; i < this.request.size(); i++) {
                                    if (i != 0) {
                                        buffer.append(",");
                                    }
                                    buffer.append("\"");
                                    buffer.append(this.request.getKey(i));
                                    buffer.append("\"");
                                }
                                buffer.append("]\n");
                                buffer.append(",\"");
                                buffer.append(org.kevoree.modeling.message.KMessageLoader.VALUES_NAME).append("\":[");
                                for (var i = 0; i < this.request.size(); i++) {
                                    if (i != 0) {
                                        buffer.append(",");
                                    }
                                    buffer.append("\"");
                                    buffer.append(org.kevoree.modeling.format.json.JsonString.encode(this.request.getContent(i)));
                                    buffer.append("\"");
                                }
                                buffer.append("]\n");
                            }
                            org.kevoree.modeling.message.impl.MessageHelper.printJsonEnd(buffer);
                            return buffer.toString();
                        };
                        PutRequest.prototype.type = function () {
                            return org.kevoree.modeling.message.KMessageLoader.PUT_REQ_TYPE;
                        };
                        return PutRequest;
                    })();
                    impl.PutRequest = PutRequest;
                    var PutResult = (function () {
                        function PutResult() {
                        }
                        PutResult.prototype.json = function () {
                            var buffer = new java.lang.StringBuilder();
                            org.kevoree.modeling.message.impl.MessageHelper.printJsonStart(buffer);
                            org.kevoree.modeling.message.impl.MessageHelper.printType(buffer, this.type());
                            org.kevoree.modeling.message.impl.MessageHelper.printElem(this.id, org.kevoree.modeling.message.KMessageLoader.ID_NAME, buffer);
                            org.kevoree.modeling.message.impl.MessageHelper.printJsonEnd(buffer);
                            return buffer.toString();
                        };
                        PutResult.prototype.type = function () {
                            return org.kevoree.modeling.message.KMessageLoader.PUT_RES_TYPE;
                        };
                        return PutResult;
                    })();
                    impl.PutResult = PutResult;
                })(impl = message.impl || (message.impl = {}));
            })(message = modeling.message || (modeling.message = {}));
            var meta;
            (function (meta) {
                var KPrimitiveTypes = (function () {
                    function KPrimitiveTypes() {
                    }
                    KPrimitiveTypes.BOOL = new org.kevoree.modeling.abs.AbstractDataType("BOOL", false);
                    KPrimitiveTypes.STRING = new org.kevoree.modeling.abs.AbstractDataType("STRING", false);
                    KPrimitiveTypes.LONG = new org.kevoree.modeling.abs.AbstractDataType("LONG", false);
                    KPrimitiveTypes.INT = new org.kevoree.modeling.abs.AbstractDataType("INT", false);
                    KPrimitiveTypes.DOUBLE = new org.kevoree.modeling.abs.AbstractDataType("DOUBLE", false);
                    KPrimitiveTypes.CONTINUOUS = new org.kevoree.modeling.abs.AbstractDataType("CONTINUOUS", false);
                    return KPrimitiveTypes;
                })();
                meta.KPrimitiveTypes = KPrimitiveTypes;
                var MetaType = (function () {
                    function MetaType() {
                    }
                    MetaType.prototype.equals = function (other) {
                        return this == other;
                    };
                    MetaType.values = function () {
                        return MetaType._MetaTypeVALUES;
                    };
                    MetaType.ATTRIBUTE = new MetaType();
                    MetaType.REFERENCE = new MetaType();
                    MetaType.DEPENDENCY = new MetaType();
                    MetaType.DEPENDENCIES = new MetaType();
                    MetaType.INPUT = new MetaType();
                    MetaType.OUTPUT = new MetaType();
                    MetaType.OPERATION = new MetaType();
                    MetaType.CLASS = new MetaType();
                    MetaType.MODEL = new MetaType();
                    MetaType.ENUM = new MetaType();
                    MetaType.LITERAL = new MetaType();
                    MetaType._MetaTypeVALUES = [
                        MetaType.ATTRIBUTE,
                        MetaType.REFERENCE,
                        MetaType.DEPENDENCY,
                        MetaType.DEPENDENCIES,
                        MetaType.INPUT,
                        MetaType.OUTPUT,
                        MetaType.OPERATION,
                        MetaType.CLASS,
                        MetaType.MODEL,
                        MetaType.ENUM,
                        MetaType.LITERAL
                    ];
                    return MetaType;
                })();
                meta.MetaType = MetaType;
                var impl;
                (function (impl) {
                    var GenericModel = (function (_super) {
                        __extends(GenericModel, _super);
                        function GenericModel(mm) {
                            _super.call(this);
                            this._p_metaModel = mm;
                        }
                        GenericModel.prototype.metaModel = function () {
                            return this._p_metaModel;
                        };
                        GenericModel.prototype.internalCreateUniverse = function (universe) {
                            return new org.kevoree.modeling.meta.impl.GenericUniverse(universe, this._manager);
                        };
                        GenericModel.prototype.internalCreateObject = function (universe, time, uuid, clazz) {
                            if (clazz.inferAlg() != null) {
                                return new org.kevoree.modeling.meta.impl.GenericObjectInfer(universe, time, uuid, clazz, this._manager);
                            }
                            else {
                                return new org.kevoree.modeling.meta.impl.GenericObject(universe, time, uuid, clazz, this._manager);
                            }
                        };
                        return GenericModel;
                    })(org.kevoree.modeling.abs.AbstractKModel);
                    impl.GenericModel = GenericModel;
                    var GenericObject = (function (_super) {
                        __extends(GenericObject, _super);
                        function GenericObject(p_universe, p_time, p_uuid, p_metaClass, p_manager) {
                            _super.call(this, p_universe, p_time, p_uuid, p_metaClass, p_manager);
                        }
                        return GenericObject;
                    })(org.kevoree.modeling.abs.AbstractKObject);
                    impl.GenericObject = GenericObject;
                    var GenericObjectInfer = (function (_super) {
                        __extends(GenericObjectInfer, _super);
                        function GenericObjectInfer(p_universe, p_time, p_uuid, p_metaClass, p_manager) {
                            _super.call(this, p_universe, p_time, p_uuid, p_metaClass, p_manager);
                        }
                        return GenericObjectInfer;
                    })(org.kevoree.modeling.abs.AbstractKObjectInfer);
                    impl.GenericObjectInfer = GenericObjectInfer;
                    var GenericUniverse = (function (_super) {
                        __extends(GenericUniverse, _super);
                        function GenericUniverse(p_key, p_manager) {
                            _super.call(this, p_key, p_manager);
                        }
                        GenericUniverse.prototype.internal_create = function (timePoint) {
                            return new org.kevoree.modeling.meta.impl.GenericView(this._universe, timePoint, this._manager);
                        };
                        return GenericUniverse;
                    })(org.kevoree.modeling.abs.AbstractKUniverse);
                    impl.GenericUniverse = GenericUniverse;
                    var GenericView = (function (_super) {
                        __extends(GenericView, _super);
                        function GenericView(p_universe, _time, p_manager) {
                            _super.call(this, p_universe, _time, p_manager);
                        }
                        return GenericView;
                    })(org.kevoree.modeling.abs.AbstractKView);
                    impl.GenericView = GenericView;
                    var MetaAttribute = (function () {
                        function MetaAttribute(p_name, p_index, p_precision, p_key, p_metaType, p_extrapolation) {
                            this._name = p_name;
                            this._index = p_index;
                            this._precision = p_precision;
                            this._key = p_key;
                            this._metaType = p_metaType;
                            this._extrapolation = p_extrapolation;
                            if (this._extrapolation == null) {
                                this._extrapolation = org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance();
                            }
                        }
                        MetaAttribute.prototype.attributeType = function () {
                            return this._metaType;
                        };
                        MetaAttribute.prototype.index = function () {
                            return this._index;
                        };
                        MetaAttribute.prototype.metaName = function () {
                            return this._name;
                        };
                        MetaAttribute.prototype.metaType = function () {
                            return org.kevoree.modeling.meta.MetaType.ATTRIBUTE;
                        };
                        MetaAttribute.prototype.precision = function () {
                            return this._precision;
                        };
                        MetaAttribute.prototype.key = function () {
                            return this._key;
                        };
                        MetaAttribute.prototype.strategy = function () {
                            return this._extrapolation;
                        };
                        MetaAttribute.prototype.setExtrapolation = function (extrapolation) {
                            this._extrapolation = extrapolation;
                        };
                        MetaAttribute.prototype.setPrecision = function (p_precision) {
                            this._precision = p_precision;
                        };
                        return MetaAttribute;
                    })();
                    impl.MetaAttribute = MetaAttribute;
                    var MetaClass = (function () {
                        function MetaClass(p_name, p_index, p_alg) {
                            this._indexes = null;
                            this._cachedInputs = null;
                            this._cachedOutputs = null;
                            this._temporalResolution = 1;
                            this._name = p_name;
                            this._index = p_index;
                            this._meta = new Array();
                            this._alg = p_alg;
                            this._indexes = new org.kevoree.modeling.memory.struct.map.impl.ArrayStringMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                            if (this._alg != null) {
                                this.internal_add_meta(new org.kevoree.modeling.meta.impl.MetaDependencies(this._meta.length, this));
                            }
                        }
                        MetaClass.prototype.init = function (p_metaElements) {
                            this._indexes.clear();
                            this._meta = p_metaElements;
                            for (var i = 0; i < this._meta.length; i++) {
                                this._indexes.put(p_metaElements[i].metaName(), p_metaElements[i].index());
                            }
                            this.clearCached();
                        };
                        MetaClass.prototype.metaByName = function (name) {
                            if (this._indexes != null) {
                                var resolvedIndex = this._indexes.get(name);
                                if (resolvedIndex != null) {
                                    return this._meta[resolvedIndex];
                                }
                            }
                            return null;
                        };
                        MetaClass.prototype.attribute = function (name) {
                            var resolved = this.metaByName(name);
                            if (resolved != null && resolved instanceof org.kevoree.modeling.meta.impl.MetaAttribute) {
                                return resolved;
                            }
                            return null;
                        };
                        MetaClass.prototype.reference = function (name) {
                            var resolved = this.metaByName(name);
                            if (resolved != null && resolved instanceof org.kevoree.modeling.meta.impl.MetaReference) {
                                return resolved;
                            }
                            return null;
                        };
                        MetaClass.prototype.operation = function (name) {
                            var resolved = this.metaByName(name);
                            if (resolved != null && resolved instanceof org.kevoree.modeling.meta.impl.MetaOperation) {
                                return resolved;
                            }
                            return null;
                        };
                        MetaClass.prototype.metaElements = function () {
                            return this._meta;
                        };
                        MetaClass.prototype.index = function () {
                            return this._index;
                        };
                        MetaClass.prototype.metaName = function () {
                            return this._name;
                        };
                        MetaClass.prototype.metaType = function () {
                            return org.kevoree.modeling.meta.MetaType.CLASS;
                        };
                        MetaClass.prototype.meta = function (index) {
                            if (index >= 0 && index < this._meta.length) {
                                return this._meta[index];
                            }
                            else {
                                return null;
                            }
                        };
                        MetaClass.prototype.addAttribute = function (attributeName, p_type) {
                            return this.internal_addatt(attributeName, p_type);
                        };
                        MetaClass.prototype.internal_addatt = function (attributeName, p_type) {
                            var precisionCleaned = -1;
                            var extrapolation;
                            if (p_type == org.kevoree.modeling.meta.KPrimitiveTypes.CONTINUOUS) {
                                extrapolation = org.kevoree.modeling.extrapolation.impl.PolynomialExtrapolation.instance();
                                precisionCleaned = 0.1;
                            }
                            else {
                                extrapolation = org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance();
                            }
                            var tempAttribute = new org.kevoree.modeling.meta.impl.MetaAttribute(attributeName, this._meta.length, precisionCleaned, false, p_type, extrapolation);
                            this.internal_add_meta(tempAttribute);
                            return tempAttribute;
                        };
                        MetaClass.prototype.addReference = function (referenceName, p_metaClass, oppositeName, toMany) {
                            return this.internal_addref(referenceName, p_metaClass, oppositeName, toMany);
                        };
                        MetaClass.prototype.internal_addref = function (referenceName, p_metaClass, oppositeName, toMany) {
                            var tempOrigin = this;
                            var opName = oppositeName;
                            if (opName == null) {
                                opName = "op_" + referenceName;
                                p_metaClass.getOrCreate(opName, referenceName, this, false, false);
                            }
                            else {
                                p_metaClass.getOrCreate(opName, referenceName, this, true, false);
                            }
                            var tempReference = new org.kevoree.modeling.meta.impl.MetaReference(referenceName, this._meta.length, false, !toMany, function () {
                                return p_metaClass;
                            }, opName, function () {
                                return tempOrigin;
                            });
                            this.internal_add_meta(tempReference);
                            return tempReference;
                        };
                        MetaClass.prototype.getOrCreate = function (p_name, p_oppositeName, p_oppositeClass, p_visible, p_single) {
                            var previous = this.reference(p_name);
                            if (previous != null) {
                                return previous;
                            }
                            var tempOrigin = this;
                            var tempReference = new org.kevoree.modeling.meta.impl.MetaReference(p_name, this._meta.length, p_visible, p_single, function () {
                                return p_oppositeClass;
                            }, p_oppositeName, function () {
                                return tempOrigin;
                            });
                            this.internal_add_meta(tempReference);
                            return tempReference;
                        };
                        MetaClass.prototype.addOperation = function (operationName) {
                            var tempOrigin = this;
                            var tempOperation = new org.kevoree.modeling.meta.impl.MetaOperation(operationName, this._meta.length, function () {
                                return tempOrigin;
                            });
                            this.internal_add_meta(tempOperation);
                            return tempOperation;
                        };
                        MetaClass.prototype.inferAlg = function () {
                            return this._alg;
                        };
                        MetaClass.prototype.addDependency = function (dependencyName, p_metaClass, oppositeName) {
                            var currentDeps = this.dependencies();
                            if (currentDeps != null) {
                                return currentDeps.addDependency(dependencyName, p_metaClass, oppositeName);
                            }
                            return null;
                        };
                        MetaClass.prototype.addInput = function (p_name, p_extractor) {
                            var newInput = new org.kevoree.modeling.meta.impl.MetaInferInput(p_name, this._meta.length, p_extractor);
                            this.internal_add_meta(newInput);
                            return newInput;
                        };
                        MetaClass.prototype.addOutput = function (p_name, p_type) {
                            var newOutput = new org.kevoree.modeling.meta.impl.MetaInferOutput(p_name, this._meta.length, p_type);
                            this.internal_add_meta(newOutput);
                            return newOutput;
                        };
                        MetaClass.prototype.dependencies = function () {
                            return this.metaByName(org.kevoree.modeling.meta.impl.MetaDependencies.DEPENDENCIES_NAME);
                        };
                        MetaClass.prototype.inputs = function () {
                            if (this._cachedInputs == null) {
                                this.cacheInputs();
                            }
                            return this._cachedInputs;
                        };
                        MetaClass.prototype.cacheInputs = function () {
                            var nb = 0;
                            for (var i = 0; i < this._meta.length; i++) {
                                if (this._meta[i].metaType().equals(org.kevoree.modeling.meta.MetaType.INPUT)) {
                                    nb++;
                                }
                            }
                            this._cachedInputs = new Array();
                            nb = 0;
                            for (var i = 0; i < this._meta.length; i++) {
                                if (this._meta[i].metaType().equals(org.kevoree.modeling.meta.MetaType.INPUT)) {
                                    this._cachedInputs[nb] = this._meta[i];
                                    nb++;
                                }
                            }
                        };
                        MetaClass.prototype.outputs = function () {
                            if (this._cachedOutputs == null) {
                                this.cacheOuputs();
                            }
                            return this._cachedOutputs;
                        };
                        MetaClass.prototype.temporalResolution = function () {
                            return this._temporalResolution;
                        };
                        MetaClass.prototype.setTemporalResolution = function (p_tempo) {
                            this._temporalResolution = p_tempo;
                        };
                        MetaClass.prototype.cacheOuputs = function () {
                            var nb = 0;
                            for (var i = 0; i < this._meta.length; i++) {
                                if (this._meta[i].metaType().equals(org.kevoree.modeling.meta.MetaType.OUTPUT)) {
                                    nb++;
                                }
                            }
                            this._cachedOutputs = new Array();
                            nb = 0;
                            for (var i = 0; i < this._meta.length; i++) {
                                if (this._meta[i].metaType().equals(org.kevoree.modeling.meta.MetaType.OUTPUT)) {
                                    this._cachedOutputs[nb] = this._meta[i];
                                    nb++;
                                }
                            }
                        };
                        MetaClass.prototype.clearCached = function () {
                            this._cachedOutputs = null;
                            this._cachedInputs = null;
                        };
                        MetaClass.prototype.internal_add_meta = function (p_new_meta) {
                            this.clearCached();
                            this._meta[p_new_meta.index()] = p_new_meta;
                            this._indexes.put(p_new_meta.metaName(), p_new_meta.index());
                        };
                        return MetaClass;
                    })();
                    impl.MetaClass = MetaClass;
                    var MetaDependencies = (function () {
                        function MetaDependencies(p_index, p_origin) {
                            this._indexes = null;
                            this._index = p_index;
                            this._origin = p_origin;
                            this._dependencies = new Array();
                            this._indexes = new org.kevoree.modeling.memory.struct.map.impl.ArrayStringMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                        }
                        MetaDependencies.prototype.origin = function () {
                            return this._origin;
                        };
                        MetaDependencies.prototype.allDependencies = function () {
                            return this._dependencies;
                        };
                        MetaDependencies.prototype.dependencyByName = function (dependencyName) {
                            var foundedIndex = this._indexes.get(dependencyName);
                            if (foundedIndex != null) {
                                return this._dependencies[foundedIndex];
                            }
                            else {
                                return null;
                            }
                        };
                        MetaDependencies.prototype.index = function () {
                            return this._index;
                        };
                        MetaDependencies.prototype.metaName = function () {
                            return MetaDependencies.DEPENDENCIES_NAME;
                        };
                        MetaDependencies.prototype.metaType = function () {
                            return org.kevoree.modeling.meta.MetaType.DEPENDENCIES;
                        };
                        MetaDependencies.prototype.addDependency = function (p_dependencyName, p_type, op_name) {
                            if (op_name != null) {
                                throw new java.lang.RuntimeException("Not Implemented Yet!");
                            }
                            var newDependency = new org.kevoree.modeling.meta.impl.MetaDependency(p_dependencyName, this._dependencies.length, this, function () {
                                return p_type;
                            }, op_name);
                            this.internal_add_dep(newDependency);
                            return newDependency;
                        };
                        MetaDependencies.prototype.internal_add_dep = function (p_new_meta) {
                            this._dependencies[p_new_meta.index()] = p_new_meta;
                            this._indexes.put(p_new_meta.metaName(), p_new_meta.index());
                        };
                        MetaDependencies.DEPENDENCIES_NAME = "allDependencies";
                        return MetaDependencies;
                    })();
                    impl.MetaDependencies = MetaDependencies;
                    var MetaDependency = (function () {
                        function MetaDependency(p_name, p_index, p_origin, p_lazyMetaType, p_oppositeName) {
                            this._name = p_name;
                            this._index = p_index;
                            this._origin = p_origin;
                            this._lazyMetaType = p_lazyMetaType;
                            this._oppositeName = p_oppositeName;
                        }
                        MetaDependency.prototype.type = function () {
                            if (this._lazyMetaType != null) {
                                return this._lazyMetaType();
                            }
                            else {
                                return null;
                            }
                        };
                        MetaDependency.prototype.opposite = function () {
                            if (this._oppositeName != null) {
                                var dependencies = this.type().dependencies();
                                if (dependencies != null) {
                                    return dependencies.dependencyByName(this._oppositeName);
                                }
                            }
                            return null;
                        };
                        MetaDependency.prototype.origin = function () {
                            return this._origin;
                        };
                        MetaDependency.prototype.index = function () {
                            return this._index;
                        };
                        MetaDependency.prototype.metaName = function () {
                            return this._name;
                        };
                        MetaDependency.prototype.metaType = function () {
                            return org.kevoree.modeling.meta.MetaType.DEPENDENCY;
                        };
                        return MetaDependency;
                    })();
                    impl.MetaDependency = MetaDependency;
                    var MetaEnum = (function () {
                        function MetaEnum(p_name, p_index) {
                            this._indexes = null;
                            this._name = p_name;
                            this._index = p_index;
                            this._literals = new Array();
                            this._indexes = new org.kevoree.modeling.memory.struct.map.impl.ArrayStringMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                        }
                        MetaEnum.prototype.literals = function () {
                            return this._literals;
                        };
                        MetaEnum.prototype.literalByName = function (p_name) {
                            if (this._indexes != null) {
                                var resolvedIndex = this._indexes.get(p_name);
                                if (resolvedIndex != null) {
                                    return this._literals[resolvedIndex];
                                }
                            }
                            return null;
                        };
                        MetaEnum.prototype.literal = function (p_index) {
                            return this._literals[p_index];
                        };
                        MetaEnum.prototype.addLiteral = function (p_name) {
                            var newLiteral = new org.kevoree.modeling.meta.impl.MetaLiteral(p_name, this._literals.length, this);
                            this.internal_add_meta(newLiteral);
                            return newLiteral;
                        };
                        MetaEnum.prototype.name = function () {
                            return this._name;
                        };
                        MetaEnum.prototype.isEnum = function () {
                            return true;
                        };
                        MetaEnum.prototype.index = function () {
                            return this._index;
                        };
                        MetaEnum.prototype.metaName = function () {
                            return this._name;
                        };
                        MetaEnum.prototype.metaType = function () {
                            return org.kevoree.modeling.meta.MetaType.ENUM;
                        };
                        MetaEnum.prototype.internal_add_meta = function (p_new_meta) {
                            this._literals[p_new_meta.index()] = p_new_meta;
                            this._indexes.put(p_new_meta.metaName(), p_new_meta.index());
                        };
                        return MetaEnum;
                    })();
                    impl.MetaEnum = MetaEnum;
                    var MetaInferInput = (function () {
                        function MetaInferInput(p_name, p_index, p_extractor) {
                            this._name = p_name;
                            this._index = p_index;
                            this._extractor = p_extractor;
                        }
                        MetaInferInput.prototype.extractorQuery = function () {
                            return this._extractor;
                        };
                        MetaInferInput.prototype.extractor = function () {
                            if (this._cachedTraversal != null) {
                                return this._cachedTraversal;
                            }
                            else {
                                return this.cacheTraversal();
                            }
                        };
                        MetaInferInput.prototype.cacheTraversal = function () {
                            this._cachedTraversal = org.kevoree.modeling.traversal.query.impl.QueryEngine.getINSTANCE().buildTraversal(this._extractor);
                            return this._cachedTraversal;
                        };
                        MetaInferInput.prototype.index = function () {
                            return this._index;
                        };
                        MetaInferInput.prototype.metaName = function () {
                            return this._name;
                        };
                        MetaInferInput.prototype.metaType = function () {
                            return org.kevoree.modeling.meta.MetaType.INPUT;
                        };
                        return MetaInferInput;
                    })();
                    impl.MetaInferInput = MetaInferInput;
                    var MetaInferOutput = (function () {
                        function MetaInferOutput(p_name, p_index, p_type) {
                            this._name = p_name;
                            this._index = p_index;
                            this._type = p_type;
                        }
                        MetaInferOutput.prototype.index = function () {
                            return this._index;
                        };
                        MetaInferOutput.prototype.metaName = function () {
                            return this._name;
                        };
                        MetaInferOutput.prototype.metaType = function () {
                            return org.kevoree.modeling.meta.MetaType.OUTPUT;
                        };
                        MetaInferOutput.prototype.type = function () {
                            return this._type;
                        };
                        return MetaInferOutput;
                    })();
                    impl.MetaInferOutput = MetaInferOutput;
                    var MetaLiteral = (function () {
                        function MetaLiteral(p_name, p_index, p_origin) {
                            this._name = p_name;
                            this._index = p_index;
                            this._origin = p_origin;
                        }
                        MetaLiteral.prototype.index = function () {
                            return this._index;
                        };
                        MetaLiteral.prototype.metaName = function () {
                            return this._name;
                        };
                        MetaLiteral.prototype.metaType = function () {
                            return org.kevoree.modeling.meta.MetaType.LITERAL;
                        };
                        MetaLiteral.prototype.origin = function () {
                            return this._origin;
                        };
                        MetaLiteral.prototype.toString = function () {
                            return "KLiteral@" + this._origin.name() + "." + this._name;
                        };
                        return MetaLiteral;
                    })();
                    impl.MetaLiteral = MetaLiteral;
                    var MetaModel = (function () {
                        function MetaModel(p_name) {
                            this._metaClasses_indexes = null;
                            this._metaTypes_indexes = null;
                            this._name = p_name;
                            this._index = 0;
                            this._metaClasses = new Array();
                            this._metaTypes = new Array();
                            this._metaClasses_indexes = new org.kevoree.modeling.memory.struct.map.impl.ArrayStringMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                            this._metaTypes_indexes = new org.kevoree.modeling.memory.struct.map.impl.ArrayStringMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                        }
                        MetaModel.prototype.index = function () {
                            return this._index;
                        };
                        MetaModel.prototype.metaName = function () {
                            return this._name;
                        };
                        MetaModel.prototype.metaType = function () {
                            return org.kevoree.modeling.meta.MetaType.MODEL;
                        };
                        MetaModel.prototype.init = function (p_metaClasses) {
                            this._metaClasses_indexes.clear();
                            this._metaClasses = p_metaClasses;
                            for (var i = 0; i < this._metaClasses.length; i++) {
                                this._metaClasses_indexes.put(p_metaClasses[i].metaName(), p_metaClasses[i].index());
                            }
                        };
                        MetaModel.prototype.metaClasses = function () {
                            return this._metaClasses;
                        };
                        MetaModel.prototype.metaClassByName = function (name) {
                            if (this._metaClasses_indexes == null) {
                                return null;
                            }
                            var resolved = this._metaClasses_indexes.get(name);
                            if (resolved == null) {
                                return null;
                            }
                            else {
                                return this._metaClasses[resolved];
                            }
                        };
                        MetaModel.prototype.metaClass = function (index) {
                            if (index >= 0 && index < this._metaClasses.length) {
                                return this._metaClasses[index];
                            }
                            return null;
                        };
                        MetaModel.prototype.addMetaClass = function (metaClassName) {
                            return this.internal_addmetaclass(metaClassName, null);
                        };
                        MetaModel.prototype.addInferMetaClass = function (metaClassName, inferAlg) {
                            return this.internal_addmetaclass(metaClassName, inferAlg);
                        };
                        MetaModel.prototype.metaTypes = function () {
                            return this._metaTypes;
                        };
                        MetaModel.prototype.metaTypeByName = function (p_name) {
                            if (this._metaTypes == null) {
                                return null;
                            }
                            var resolved = this._metaTypes_indexes.get(p_name);
                            if (resolved == null) {
                                return null;
                            }
                            else {
                                return this._metaTypes[resolved];
                            }
                        };
                        MetaModel.prototype.addMetaEnum = function (enumName) {
                            var newEnumType = new org.kevoree.modeling.meta.impl.MetaEnum(enumName, this._metaTypes.length);
                            this.internal_add_type(newEnumType);
                            return newEnumType;
                        };
                        MetaModel.prototype.internal_addmetaclass = function (metaClassName, alg) {
                            if (this._metaClasses_indexes.contains(metaClassName)) {
                                return this.metaClassByName(metaClassName);
                            }
                            else {
                                if (this._metaClasses == null) {
                                    this._metaClasses = new Array();
                                    this._metaClasses[0] = new org.kevoree.modeling.meta.impl.MetaClass(metaClassName, 0, alg);
                                    this._metaClasses_indexes.put(metaClassName, this._metaClasses[0].index());
                                    return this._metaClasses[0];
                                }
                                else {
                                    var newMetaClass = new org.kevoree.modeling.meta.impl.MetaClass(metaClassName, this._metaClasses.length, alg);
                                    this.internal_add_meta_class(newMetaClass);
                                    return newMetaClass;
                                }
                            }
                        };
                        MetaModel.prototype.internal_add_meta_class = function (p_newMetaClass) {
                            this._metaClasses[p_newMetaClass.index()] = p_newMetaClass;
                            this._metaClasses_indexes.put(p_newMetaClass.metaName(), p_newMetaClass.index());
                        };
                        MetaModel.prototype.internal_add_type = function (p_newType) {
                            this._metaTypes[p_newType.index()] = p_newType;
                            this._metaTypes_indexes.put(p_newType.metaName(), p_newType.index());
                        };
                        MetaModel.prototype.model = function () {
                            return new org.kevoree.modeling.meta.impl.GenericModel(this);
                        };
                        return MetaModel;
                    })();
                    impl.MetaModel = MetaModel;
                    var MetaOperation = (function () {
                        function MetaOperation(p_name, p_index, p_lazyMetaClass) {
                            this._name = p_name;
                            this._index = p_index;
                            this._lazyMetaClass = p_lazyMetaClass;
                        }
                        MetaOperation.prototype.index = function () {
                            return this._index;
                        };
                        MetaOperation.prototype.metaName = function () {
                            return this._name;
                        };
                        MetaOperation.prototype.metaType = function () {
                            return org.kevoree.modeling.meta.MetaType.OPERATION;
                        };
                        MetaOperation.prototype.origin = function () {
                            if (this._lazyMetaClass != null) {
                                return this._lazyMetaClass();
                            }
                            return null;
                        };
                        return MetaOperation;
                    })();
                    impl.MetaOperation = MetaOperation;
                    var MetaReference = (function () {
                        function MetaReference(p_name, p_index, p_visible, p_single, p_lazyMetaType, op_name, p_lazyMetaOrigin) {
                            this._name = p_name;
                            this._index = p_index;
                            this._visible = p_visible;
                            this._single = p_single;
                            this._lazyMetaType = p_lazyMetaType;
                            this._op_name = op_name;
                            this._lazyMetaOrigin = p_lazyMetaOrigin;
                        }
                        MetaReference.prototype.single = function () {
                            return this._single;
                        };
                        MetaReference.prototype.type = function () {
                            if (this._lazyMetaType != null) {
                                return this._lazyMetaType();
                            }
                            else {
                                return null;
                            }
                        };
                        MetaReference.prototype.opposite = function () {
                            if (this._op_name != null) {
                                return this.type().reference(this._op_name);
                            }
                            return null;
                        };
                        MetaReference.prototype.origin = function () {
                            if (this._lazyMetaOrigin != null) {
                                return this._lazyMetaOrigin();
                            }
                            return null;
                        };
                        MetaReference.prototype.index = function () {
                            return this._index;
                        };
                        MetaReference.prototype.metaName = function () {
                            return this._name;
                        };
                        MetaReference.prototype.metaType = function () {
                            return org.kevoree.modeling.meta.MetaType.REFERENCE;
                        };
                        MetaReference.prototype.visible = function () {
                            return this._visible;
                        };
                        return MetaReference;
                    })();
                    impl.MetaReference = MetaReference;
                })(impl = meta.impl || (meta.impl = {}));
            })(meta = modeling.meta || (modeling.meta = {}));
            var operation;
            (function (operation_1) {
                var impl;
                (function (impl) {
                    var HashOperationManager = (function () {
                        function HashOperationManager(p_manager) {
                            this.remoteCallCallbacks = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                            this._callbackId = 0;
                            this.staticOperations = new org.kevoree.modeling.memory.struct.map.impl.ArrayIntMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                            this.instanceOperations = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                            this._manager = p_manager;
                        }
                        HashOperationManager.prototype.registerOperation = function (operation, callback, target) {
                            if (target == null) {
                                var clazzOperations = this.staticOperations.get(operation.origin().index());
                                if (clazzOperations == null) {
                                    clazzOperations = new org.kevoree.modeling.memory.struct.map.impl.ArrayIntMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                    this.staticOperations.put(operation.origin().index(), clazzOperations);
                                }
                                clazzOperations.put(operation.index(), callback);
                            }
                            else {
                                var objectOperations = this.instanceOperations.get(target.uuid());
                                if (objectOperations == null) {
                                    objectOperations = new org.kevoree.modeling.memory.struct.map.impl.ArrayIntMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                    this.instanceOperations.put(target.uuid(), objectOperations);
                                }
                                objectOperations.put(operation.index(), callback);
                            }
                        };
                        HashOperationManager.prototype.searchOperation = function (source, clazz, operation) {
                            var objectOperations = this.instanceOperations.get(source);
                            if (objectOperations != null) {
                                return objectOperations.get(operation);
                            }
                            var clazzOperations = this.staticOperations.get(clazz);
                            if (clazzOperations != null) {
                                return clazzOperations.get(operation);
                            }
                            return null;
                        };
                        HashOperationManager.prototype.call = function (source, operation, param, callback) {
                            var operationCore = this.searchOperation(source.uuid(), operation.origin().index(), operation.index());
                            if (operationCore != null) {
                                operationCore(source, param, callback);
                            }
                            else {
                                this.sendToRemote(source, operation, param, callback);
                            }
                        };
                        HashOperationManager.prototype.sendToRemote = function (source, operation, param, callback) {
                            var stringParams = new Array();
                            for (var i = 0; i < param.length; i++) {
                                stringParams[i] = param[i].toString();
                            }
                            var contentKey = new org.kevoree.modeling.KContentKey(source.universe(), source.now(), source.uuid());
                            var operationCall = new org.kevoree.modeling.message.impl.OperationCallMessage();
                            operationCall.id = this.nextKey();
                            operationCall.key = contentKey;
                            operationCall.classIndex = source.metaClass().index();
                            operationCall.opIndex = operation.index();
                            operationCall.params = stringParams;
                            this.remoteCallCallbacks.put(operationCall.id, callback);
                            this._manager.cdn().send(operationCall);
                        };
                        HashOperationManager.prototype.nextKey = function () {
                            if (this._callbackId == org.kevoree.modeling.KConfig.CALLBACK_HISTORY) {
                                this._callbackId = 0;
                            }
                            else {
                                this._callbackId++;
                            }
                            return this._callbackId;
                        };
                        HashOperationManager.prototype.operationEventReceived = function (operationEvent) {
                            var _this = this;
                            if (operationEvent.type() == org.kevoree.modeling.message.KMessageLoader.OPERATION_RESULT_TYPE) {
                                var operationResult = operationEvent;
                                var cb = this.remoteCallCallbacks.get(operationResult.id);
                                if (cb != null) {
                                    cb(operationResult.value);
                                }
                            }
                            else {
                                if (operationEvent.type() == org.kevoree.modeling.message.KMessageLoader.OPERATION_CALL_TYPE) {
                                    var operationCall = operationEvent;
                                    var sourceKey = operationCall.key;
                                    var operationCore = this.searchOperation(sourceKey.obj, operationCall.classIndex, operationCall.opIndex);
                                    if (operationCore != null) {
                                        var view = this._manager.model().universe(sourceKey.universe).time(sourceKey.time);
                                        view.lookup(sourceKey.obj, function (kObject) {
                                            if (kObject != null) {
                                                operationCore(kObject, operationCall.params, function (o) {
                                                    var operationResultMessage = new org.kevoree.modeling.message.impl.OperationResultMessage();
                                                    operationResultMessage.key = operationCall.key;
                                                    operationResultMessage.id = operationCall.id;
                                                    operationResultMessage.value = o.toString();
                                                    _this._manager.cdn().send(operationResultMessage);
                                                });
                                            }
                                        });
                                    }
                                }
                                else {
                                    System.err.println("BAD ROUTING !");
                                }
                            }
                        };
                        return HashOperationManager;
                    })();
                    impl.HashOperationManager = HashOperationManager;
                })(impl = operation_1.impl || (operation_1.impl = {}));
            })(operation = modeling.operation || (modeling.operation = {}));
            var scheduler;
            (function (scheduler) {
                var impl;
                (function (impl) {
                    var DirectScheduler = (function () {
                        function DirectScheduler() {
                        }
                        DirectScheduler.prototype.dispatch = function (runnable) {
                            runnable.run();
                        };
                        DirectScheduler.prototype.stop = function () {
                        };
                        return DirectScheduler;
                    })();
                    impl.DirectScheduler = DirectScheduler;
                    var ExecutorServiceScheduler = (function () {
                        function ExecutorServiceScheduler() {
                        }
                        ExecutorServiceScheduler.prototype.dispatch = function (p_runnable) {
                            p_runnable.run();
                        };
                        ExecutorServiceScheduler.prototype.stop = function () {
                        };
                        return ExecutorServiceScheduler;
                    })();
                    impl.ExecutorServiceScheduler = ExecutorServiceScheduler;
                })(impl = scheduler.impl || (scheduler.impl = {}));
            })(scheduler = modeling.scheduler || (modeling.scheduler = {}));
            var traversal;
            (function (traversal_1) {
                var impl;
                (function (impl) {
                    var Traversal = (function () {
                        function Traversal(p_roots) {
                            this._terminated = false;
                            this._initObjs = p_roots;
                        }
                        Traversal.prototype.internal_chain_action = function (p_action) {
                            if (this._terminated) {
                                throw new java.lang.RuntimeException(Traversal.TERMINATED_MESSAGE);
                            }
                            if (this._initAction == null) {
                                this._initAction = p_action;
                            }
                            if (this._lastAction != null) {
                                this._lastAction.chain(p_action);
                            }
                            this._lastAction = p_action;
                            return this;
                        };
                        Traversal.prototype.traverse = function (p_metaReference) {
                            return this.internal_chain_action(new org.kevoree.modeling.traversal.impl.actions.TraverseAction(p_metaReference));
                        };
                        Traversal.prototype.traverseQuery = function (p_metaReferenceQuery) {
                            return this.internal_chain_action(new org.kevoree.modeling.traversal.impl.actions.TraverseQueryAction(p_metaReferenceQuery));
                        };
                        Traversal.prototype.withAttribute = function (p_attribute, p_expectedValue) {
                            return this.internal_chain_action(new org.kevoree.modeling.traversal.impl.actions.FilterAttributeAction(p_attribute, p_expectedValue));
                        };
                        Traversal.prototype.withoutAttribute = function (p_attribute, p_expectedValue) {
                            return this.internal_chain_action(new org.kevoree.modeling.traversal.impl.actions.FilterNotAttributeAction(p_attribute, p_expectedValue));
                        };
                        Traversal.prototype.attributeQuery = function (p_attributeQuery) {
                            return this.internal_chain_action(new org.kevoree.modeling.traversal.impl.actions.FilterAttributeQueryAction(p_attributeQuery));
                        };
                        Traversal.prototype.filter = function (p_filter) {
                            return this.internal_chain_action(new org.kevoree.modeling.traversal.impl.actions.FilterAction(p_filter));
                        };
                        Traversal.prototype.collect = function (metaReference, continueCondition) {
                            return this.internal_chain_action(new org.kevoree.modeling.traversal.impl.actions.DeepCollectAction(metaReference, continueCondition));
                        };
                        Traversal.prototype.traverseIndex = function (p_indexName) {
                            return this.internal_chain_action(new org.kevoree.modeling.traversal.impl.actions.TraverseIndexAction(p_indexName));
                        };
                        Traversal.prototype.traverseTime = function (timeOffset, steps, continueCondition) {
                            throw new java.lang.RuntimeException("Not Implemented Yet!");
                        };
                        Traversal.prototype.traverseUniverse = function (universeOffset, continueCondition) {
                            throw new java.lang.RuntimeException("Not Implemented Yet!");
                        };
                        Traversal.prototype.then = function (cb) {
                            if (this._initObjs != null) {
                                this._initAction.execute(new org.kevoree.modeling.traversal.impl.TraversalContext(this._initObjs, null, function (objects) {
                                    cb(objects);
                                }));
                            }
                        };
                        Traversal.prototype.eval = function (p_expression, callback) {
                            this.internal_chain_action(new org.kevoree.modeling.traversal.impl.actions.MathExpressionAction(p_expression));
                            this._terminated = true;
                            if (this._initObjs != null) {
                                this._initAction.execute(new org.kevoree.modeling.traversal.impl.TraversalContext(this._initObjs, null, callback));
                            }
                        };
                        Traversal.prototype.map = function (attribute, cb) {
                            this.internal_chain_action(new org.kevoree.modeling.traversal.impl.actions.MapAction(attribute));
                            this._terminated = true;
                            if (this._initObjs != null) {
                                this._initAction.execute(new org.kevoree.modeling.traversal.impl.TraversalContext(this._initObjs, null, cb));
                            }
                        };
                        Traversal.prototype.exec = function (origins, resolver, callback) {
                            if (this._initObjs == null) {
                                this._initAction.execute(new org.kevoree.modeling.traversal.impl.TraversalContext(origins, resolver, callback));
                            }
                        };
                        Traversal.TERMINATED_MESSAGE = "Traversal is terminated by the call of done method, please create another promise";
                        return Traversal;
                    })();
                    impl.Traversal = Traversal;
                    var TraversalContext = (function () {
                        function TraversalContext(_inputs, _resolver, p_finalCallback) {
                            this._inputs = _inputs;
                            this._resolver = _resolver;
                            this._finalCallback = p_finalCallback;
                        }
                        TraversalContext.prototype.inputObjects = function () {
                            return this._inputs;
                        };
                        TraversalContext.prototype.setInputObjects = function (p_newSet) {
                            this._inputs = p_newSet;
                        };
                        TraversalContext.prototype.indexResolver = function () {
                            return this._resolver;
                        };
                        TraversalContext.prototype.finalCallback = function () {
                            return this._finalCallback;
                        };
                        return TraversalContext;
                    })();
                    impl.TraversalContext = TraversalContext;
                    var actions;
                    (function (actions) {
                        var DeepCollectAction = (function () {
                            function DeepCollectAction(p_reference, p_continueCondition) {
                                this._alreadyPassed = null;
                                this._finalElements = null;
                                this._reference = p_reference;
                                this._continueCondition = p_continueCondition;
                            }
                            DeepCollectAction.prototype.chain = function (p_next) {
                                this._next = p_next;
                            };
                            DeepCollectAction.prototype.execute = function (context) {
                                var _this = this;
                                if (context.inputObjects() == null || context.inputObjects().length == 0) {
                                    if (this._next != null) {
                                        this._next.execute(context);
                                    }
                                    else {
                                        context.finalCallback()(context.inputObjects());
                                    }
                                }
                                else {
                                    this._alreadyPassed = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                    this._finalElements = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                    var filtered_inputs = new Array();
                                    for (var i = 0; i < context.inputObjects().length; i++) {
                                        if (this._continueCondition == null || this._continueCondition(context.inputObjects()[i])) {
                                            filtered_inputs[i] = context.inputObjects()[i];
                                            this._alreadyPassed.put(context.inputObjects()[i].uuid(), context.inputObjects()[i]);
                                        }
                                    }
                                    var iterationCallbacks = new Array();
                                    iterationCallbacks[0] = function (traversed) {
                                        var filtered_inputs2 = new Array();
                                        var nbSize = 0;
                                        for (var i = 0; i < traversed.length; i++) {
                                            if ((_this._continueCondition == null || _this._continueCondition(traversed[i])) && !_this._alreadyPassed.contains(traversed[i].uuid())) {
                                                filtered_inputs2[i] = traversed[i];
                                                _this._alreadyPassed.put(traversed[i].uuid(), traversed[i]);
                                                _this._finalElements.put(traversed[i].uuid(), traversed[i]);
                                                nbSize++;
                                            }
                                        }
                                        if (nbSize > 0) {
                                            _this.executeStep(filtered_inputs2, iterationCallbacks[0]);
                                        }
                                        else {
                                            var trimmed = new Array();
                                            var nbInserted = [0];
                                            _this._finalElements.each(function (key, value) {
                                                trimmed[nbInserted[0]] = value;
                                                nbInserted[0]++;
                                            });
                                            if (_this._next == null) {
                                                context.finalCallback()(trimmed);
                                            }
                                            else {
                                                context.setInputObjects(trimmed);
                                                _this._next.execute(context);
                                            }
                                        }
                                    };
                                    this.executeStep(filtered_inputs, iterationCallbacks[0]);
                                }
                            };
                            DeepCollectAction.prototype.executeStep = function (p_inputStep, private_callback) {
                                var currentObject = null;
                                var nextIds = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                for (var i = 0; i < p_inputStep.length; i++) {
                                    if (p_inputStep[i] != null) {
                                        try {
                                            var loopObj = p_inputStep[i];
                                            currentObject = loopObj;
                                            var raw = loopObj._manager.segment(loopObj.universe(), loopObj.now(), loopObj.uuid(), true, loopObj.metaClass(), null);
                                            if (raw != null) {
                                                if (this._reference == null) {
                                                    var metaElements = loopObj.metaClass().metaElements();
                                                    for (var j = 0; j < metaElements.length; j++) {
                                                        if (metaElements[j] instanceof org.kevoree.modeling.meta.impl.MetaReference) {
                                                            var resolved = raw.getRef(metaElements[j].index(), loopObj.metaClass());
                                                            if (resolved != null) {
                                                                for (var k = 0; k < resolved.length; k++) {
                                                                    nextIds.put(resolved[k], resolved[k]);
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                else {
                                                    var translatedRef = loopObj.internal_transpose_ref(this._reference);
                                                    if (translatedRef != null) {
                                                        var resolved = raw.getRef(translatedRef.index(), loopObj.metaClass());
                                                        if (resolved != null) {
                                                            for (var j = 0; j < resolved.length; j++) {
                                                                nextIds.put(resolved[j], resolved[j]);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        catch ($ex$) {
                                            if ($ex$ instanceof java.lang.Exception) {
                                                var e = $ex$;
                                                e.printStackTrace();
                                            }
                                            else {
                                                throw $ex$;
                                            }
                                        }
                                    }
                                }
                                var trimmed = new Array();
                                var inserted = [0];
                                nextIds.each(function (key, value) {
                                    trimmed[inserted[0]] = key;
                                    inserted[0]++;
                                });
                                currentObject._manager.lookupAllObjects(currentObject.universe(), currentObject.now(), trimmed, function (kObjects) {
                                    private_callback(kObjects);
                                });
                            };
                            return DeepCollectAction;
                        })();
                        actions.DeepCollectAction = DeepCollectAction;
                        var FilterAction = (function () {
                            function FilterAction(p_filter) {
                                this._filter = p_filter;
                            }
                            FilterAction.prototype.chain = function (p_next) {
                                this._next = p_next;
                            };
                            FilterAction.prototype.execute = function (context) {
                                var selectedIndex = new Array();
                                var selected = 0;
                                for (var i = 0; i < context.inputObjects().length; i++) {
                                    try {
                                        if (this._filter(context.inputObjects()[i])) {
                                            selectedIndex[i] = true;
                                            selected++;
                                        }
                                    }
                                    catch ($ex$) {
                                        if ($ex$ instanceof java.lang.Exception) {
                                            var e = $ex$;
                                            e.printStackTrace();
                                        }
                                        else {
                                            throw $ex$;
                                        }
                                    }
                                }
                                var nextStepElement = new Array();
                                var inserted = 0;
                                for (var i = 0; i < context.inputObjects().length; i++) {
                                    if (selectedIndex[i]) {
                                        nextStepElement[inserted] = context.inputObjects()[i];
                                        inserted++;
                                    }
                                }
                                if (this._next == null) {
                                    context.finalCallback()(nextStepElement);
                                }
                                else {
                                    context.setInputObjects(nextStepElement);
                                    this._next.execute(context);
                                }
                            };
                            return FilterAction;
                        })();
                        actions.FilterAction = FilterAction;
                        var FilterAttributeAction = (function () {
                            function FilterAttributeAction(p_attribute, p_expectedValue) {
                                this._attribute = p_attribute;
                                this._expectedValue = p_expectedValue;
                            }
                            FilterAttributeAction.prototype.chain = function (p_next) {
                                this._next = p_next;
                            };
                            FilterAttributeAction.prototype.execute = function (context) {
                                if (context.inputObjects() == null || context.inputObjects().length == 0) {
                                    if (this._next != null) {
                                        this._next.execute(context);
                                    }
                                    else {
                                        context.finalCallback()(context.inputObjects());
                                    }
                                }
                                else {
                                    var selectedIndexes = new Array();
                                    var nbSelected = 0;
                                    for (var i = 0; i < context.inputObjects().length; i++) {
                                        try {
                                            var loopObj = context.inputObjects()[i];
                                            var raw = (loopObj)._manager.segment(loopObj.universe(), loopObj.now(), loopObj.uuid(), true, loopObj.metaClass(), null);
                                            if (raw != null) {
                                                if (this._attribute == null) {
                                                    if (this._expectedValue == null) {
                                                        selectedIndexes[i] = true;
                                                        nbSelected++;
                                                    }
                                                    else {
                                                        var addToNext = false;
                                                        var metaElements = loopObj.metaClass().metaElements();
                                                        for (var j = 0; j < metaElements.length; j++) {
                                                            if (metaElements[j] instanceof org.kevoree.modeling.meta.impl.MetaAttribute) {
                                                                var resolved = raw.get(metaElements[j].index(), loopObj.metaClass());
                                                                if (resolved == null) {
                                                                    if (this._expectedValue.toString().equals("*")) {
                                                                        addToNext = true;
                                                                    }
                                                                }
                                                                else {
                                                                    if (resolved.equals(this._expectedValue)) {
                                                                        addToNext = true;
                                                                    }
                                                                    else {
                                                                        if (resolved.toString().matches(this._expectedValue.toString().replace("*", ".*"))) {
                                                                            addToNext = true;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        if (addToNext) {
                                                            selectedIndexes[i] = true;
                                                            nbSelected++;
                                                        }
                                                    }
                                                }
                                                else {
                                                    var translatedAtt = loopObj.internal_transpose_att(this._attribute);
                                                    if (translatedAtt != null) {
                                                        var resolved = raw.get(translatedAtt.index(), loopObj.metaClass());
                                                        if (this._expectedValue == null) {
                                                            if (resolved == null) {
                                                                selectedIndexes[i] = true;
                                                                nbSelected++;
                                                            }
                                                        }
                                                        else {
                                                            if (resolved == null) {
                                                                if (this._expectedValue.toString().equals("*")) {
                                                                    selectedIndexes[i] = true;
                                                                    nbSelected++;
                                                                }
                                                            }
                                                            else {
                                                                if (resolved.equals(this._expectedValue)) {
                                                                    selectedIndexes[i] = true;
                                                                    nbSelected++;
                                                                }
                                                                else {
                                                                    if (resolved.toString().matches(this._expectedValue.toString().replace("*", ".*"))) {
                                                                        selectedIndexes[i] = true;
                                                                        nbSelected++;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            else {
                                                System.err.println("WARN: Empty KObject " + loopObj.uuid());
                                            }
                                        }
                                        catch ($ex$) {
                                            if ($ex$ instanceof java.lang.Exception) {
                                                var e = $ex$;
                                                e.printStackTrace();
                                            }
                                            else {
                                                throw $ex$;
                                            }
                                        }
                                    }
                                    var nextStepElement = new Array();
                                    var inserted = 0;
                                    for (var i = 0; i < context.inputObjects().length; i++) {
                                        if (selectedIndexes[i]) {
                                            nextStepElement[inserted] = context.inputObjects()[i];
                                            inserted++;
                                        }
                                    }
                                    if (this._next == null) {
                                        context.finalCallback()(nextStepElement);
                                    }
                                    else {
                                        context.setInputObjects(nextStepElement);
                                        this._next.execute(context);
                                    }
                                }
                            };
                            return FilterAttributeAction;
                        })();
                        actions.FilterAttributeAction = FilterAttributeAction;
                        var FilterAttributeQueryAction = (function () {
                            function FilterAttributeQueryAction(p_attributeQuery) {
                                this._attributeQuery = p_attributeQuery;
                            }
                            FilterAttributeQueryAction.prototype.chain = function (p_next) {
                                this._next = p_next;
                            };
                            FilterAttributeQueryAction.prototype.execute = function (context) {
                                if (context.inputObjects() == null || context.inputObjects().length == 0) {
                                    if (this._next != null) {
                                        this._next.execute(context);
                                    }
                                    else {
                                        context.finalCallback()(context.inputObjects());
                                    }
                                }
                                else {
                                    var selectedIndexes = new Array();
                                    var nbSelected = 0;
                                    for (var i = 0; i < context.inputObjects().length; i++) {
                                        try {
                                            var loopObj = context.inputObjects()[i];
                                            if (this._attributeQuery == null) {
                                                selectedIndexes[i] = true;
                                                nbSelected++;
                                            }
                                            else {
                                                var metaElements = loopObj.metaClass().metaElements();
                                                var params = this.buildParams(this._attributeQuery);
                                                var selectedForNext = [true];
                                                params.each(function (key, param) {
                                                    for (var j = 0; j < metaElements.length; j++) {
                                                        if (metaElements[j] instanceof org.kevoree.modeling.meta.impl.MetaAttribute) {
                                                            var metaAttribute = metaElements[j];
                                                            if (metaAttribute.metaName().matches("^" + param.name() + "$")) {
                                                                var o_raw = loopObj.get(metaAttribute);
                                                                if (o_raw != null) {
                                                                    if (param.value().equals("null")) {
                                                                        if (!param.isNegative()) {
                                                                            selectedForNext[0] = false;
                                                                        }
                                                                    }
                                                                    else {
                                                                        if (o_raw.toString().matches("^" + param.value() + "$")) {
                                                                            if (param.isNegative()) {
                                                                                selectedForNext[0] = false;
                                                                            }
                                                                        }
                                                                        else {
                                                                            if (!param.isNegative()) {
                                                                                selectedForNext[0] = false;
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                else {
                                                                    if (param.value().equals("null") || param.value().equals("*")) {
                                                                        if (param.isNegative()) {
                                                                            selectedForNext[0] = false;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                });
                                                if (selectedForNext[0]) {
                                                    selectedIndexes[i] = true;
                                                    nbSelected++;
                                                }
                                            }
                                        }
                                        catch ($ex$) {
                                            if ($ex$ instanceof java.lang.Exception) {
                                                var e = $ex$;
                                                e.printStackTrace();
                                            }
                                            else {
                                                throw $ex$;
                                            }
                                        }
                                    }
                                    var nextStepElement = new Array();
                                    var inserted = 0;
                                    for (var i = 0; i < context.inputObjects().length; i++) {
                                        if (selectedIndexes[i]) {
                                            nextStepElement[inserted] = context.inputObjects()[i];
                                            inserted++;
                                        }
                                    }
                                    if (this._next == null) {
                                        context.finalCallback()(nextStepElement);
                                    }
                                    else {
                                        context.setInputObjects(nextStepElement);
                                        this._next.execute(context);
                                    }
                                }
                            };
                            FilterAttributeQueryAction.prototype.buildParams = function (p_paramString) {
                                var params = new org.kevoree.modeling.memory.struct.map.impl.ArrayStringMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                var iParam = 0;
                                var lastStart = iParam;
                                while (iParam < p_paramString.length) {
                                    if (p_paramString.charAt(iParam) == ',') {
                                        var p = p_paramString.substring(lastStart, iParam).trim();
                                        if (!p.equals("") && !p.equals("*")) {
                                            if (p.endsWith("=")) {
                                                p = p + "*";
                                            }
                                            var pArray = p.split("=");
                                            var pObject;
                                            if (pArray.length > 1) {
                                                var paramKey = pArray[0].trim();
                                                var negative = paramKey.endsWith("!");
                                                pObject = new org.kevoree.modeling.traversal.impl.actions.FilterAttributeQueryAction.QueryParam(paramKey.replace("!", "").replace("*", ".*"), pArray[1].trim().replace("*", ".*"), negative);
                                                params.put(pObject.name(), pObject);
                                            }
                                        }
                                        lastStart = iParam + 1;
                                    }
                                    iParam = iParam + 1;
                                }
                                var lastParam = p_paramString.substring(lastStart, iParam).trim();
                                if (!lastParam.equals("") && !lastParam.equals("*")) {
                                    if (lastParam.endsWith("=")) {
                                        lastParam = lastParam + "*";
                                    }
                                    var pArray = lastParam.split("=");
                                    var pObject;
                                    if (pArray.length > 1) {
                                        var paramKey = pArray[0].trim();
                                        var negative = paramKey.endsWith("!");
                                        pObject = new org.kevoree.modeling.traversal.impl.actions.FilterAttributeQueryAction.QueryParam(paramKey.replace("!", "").replace("*", ".*"), pArray[1].trim().replace("*", ".*"), negative);
                                        params.put(pObject.name(), pObject);
                                    }
                                }
                                return params;
                            };
                            return FilterAttributeQueryAction;
                        })();
                        actions.FilterAttributeQueryAction = FilterAttributeQueryAction;
                        var FilterAttributeQueryAction;
                        (function (FilterAttributeQueryAction) {
                            var QueryParam = (function () {
                                function QueryParam(p_name, p_value, p_negative) {
                                    this._name = p_name;
                                    this._value = p_value;
                                    this._negative = p_negative;
                                }
                                QueryParam.prototype.name = function () {
                                    return this._name;
                                };
                                QueryParam.prototype.value = function () {
                                    return this._value;
                                };
                                QueryParam.prototype.isNegative = function () {
                                    return this._negative;
                                };
                                return QueryParam;
                            })();
                            FilterAttributeQueryAction.QueryParam = QueryParam;
                        })(FilterAttributeQueryAction = actions.FilterAttributeQueryAction || (actions.FilterAttributeQueryAction = {}));
                        var FilterNotAttributeAction = (function () {
                            function FilterNotAttributeAction(p_attribute, p_expectedValue) {
                                this._attribute = p_attribute;
                                this._expectedValue = p_expectedValue;
                            }
                            FilterNotAttributeAction.prototype.chain = function (p_next) {
                                this._next = p_next;
                            };
                            FilterNotAttributeAction.prototype.execute = function (context) {
                                if (context.inputObjects() == null || context.inputObjects().length == 0) {
                                    if (this._next != null) {
                                        this._next.execute(context);
                                    }
                                    else {
                                        context.finalCallback()(context.inputObjects());
                                    }
                                }
                                else {
                                    var selectedIndexes = new Array();
                                    var nbSelected = 0;
                                    for (var i = 0; i < context.inputObjects().length; i++) {
                                        try {
                                            var loopObj = context.inputObjects()[i];
                                            var raw = loopObj._manager.segment(loopObj.universe(), loopObj.now(), loopObj.uuid(), true, loopObj.metaClass(), null);
                                            if (raw != null) {
                                                if (this._attribute == null) {
                                                    if (this._expectedValue == null) {
                                                        selectedIndexes[i] = true;
                                                        nbSelected++;
                                                    }
                                                    else {
                                                        var addToNext = true;
                                                        var metaElements = loopObj.metaClass().metaElements();
                                                        for (var j = 0; j < metaElements.length; j++) {
                                                            if (metaElements[j] instanceof org.kevoree.modeling.meta.impl.MetaAttribute) {
                                                                var ref = metaElements[j];
                                                                var resolved = raw.get(ref.index(), loopObj.metaClass());
                                                                if (resolved == null) {
                                                                    if (this._expectedValue.toString().equals("*")) {
                                                                        addToNext = false;
                                                                    }
                                                                }
                                                                else {
                                                                    if (resolved.equals(this._expectedValue)) {
                                                                        addToNext = false;
                                                                    }
                                                                    else {
                                                                        if (resolved.toString().matches(this._expectedValue.toString().replace("*", ".*"))) {
                                                                            addToNext = false;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        if (addToNext) {
                                                            selectedIndexes[i] = true;
                                                            nbSelected++;
                                                        }
                                                    }
                                                }
                                                else {
                                                    var translatedAtt = loopObj.internal_transpose_att(this._attribute);
                                                    if (translatedAtt != null) {
                                                        var resolved = raw.get(translatedAtt.index(), loopObj.metaClass());
                                                        if (this._expectedValue == null) {
                                                            if (resolved != null) {
                                                                selectedIndexes[i] = true;
                                                                nbSelected++;
                                                            }
                                                        }
                                                        else {
                                                            if (resolved == null) {
                                                                if (!this._expectedValue.toString().equals("*")) {
                                                                    selectedIndexes[i] = true;
                                                                    nbSelected++;
                                                                }
                                                            }
                                                            else {
                                                                if (resolved.equals(this._expectedValue)) {
                                                                }
                                                                else {
                                                                    if (resolved.toString().matches(this._expectedValue.toString().replace("*", ".*"))) {
                                                                    }
                                                                    else {
                                                                        selectedIndexes[i] = true;
                                                                        nbSelected++;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            else {
                                                System.err.println("WARN: Empty KObject " + loopObj.uuid());
                                            }
                                        }
                                        catch ($ex$) {
                                            if ($ex$ instanceof java.lang.Exception) {
                                                var e = $ex$;
                                                e.printStackTrace();
                                            }
                                            else {
                                                throw $ex$;
                                            }
                                        }
                                    }
                                    var nextStepElement = new Array();
                                    var inserted = 0;
                                    for (var i = 0; i < context.inputObjects().length; i++) {
                                        if (selectedIndexes[i]) {
                                            nextStepElement[inserted] = context.inputObjects()[i];
                                            inserted++;
                                        }
                                    }
                                    if (this._next == null) {
                                        context.finalCallback()(nextStepElement);
                                    }
                                    else {
                                        context.setInputObjects(nextStepElement);
                                        this._next.execute(context);
                                    }
                                }
                            };
                            return FilterNotAttributeAction;
                        })();
                        actions.FilterNotAttributeAction = FilterNotAttributeAction;
                        var MapAction = (function () {
                            function MapAction(p_attribute) {
                                this._attribute = p_attribute;
                            }
                            MapAction.prototype.chain = function (next) {
                            };
                            MapAction.prototype.execute = function (context) {
                                var selected = new Array();
                                var nbElem = 0;
                                for (var i = 0; i < context.inputObjects().length; i++) {
                                    if (context.inputObjects()[i] != null) {
                                        var resolved = context.inputObjects()[i].get(this._attribute);
                                        if (resolved != null) {
                                            selected[i] = resolved;
                                            nbElem++;
                                        }
                                    }
                                }
                                var trimmed = new Array();
                                var nbInserted = 0;
                                for (var i = 0; i < context.inputObjects().length; i++) {
                                    if (selected[i] != null) {
                                        trimmed[nbInserted] = selected[i];
                                        nbInserted++;
                                    }
                                }
                                if (context.finalCallback() != null) {
                                    context.finalCallback()(trimmed);
                                }
                            };
                            return MapAction;
                        })();
                        actions.MapAction = MapAction;
                        var MathExpressionAction = (function () {
                            function MathExpressionAction(p_expression) {
                                this._expression = p_expression;
                                this._engine = new org.kevoree.modeling.util.maths.expression.impl.MathExpressionEngine();
                            }
                            MathExpressionAction.prototype.chain = function (next) {
                            };
                            MathExpressionAction.prototype.execute = function (context) {
                                var selected = new Array();
                                for (var i = 0; i < context.inputObjects().length; i++) {
                                    if (context.inputObjects()[i] != null) {
                                        var finalI = i;
                                        this._engine.setVarResolver(function (potentialVarName) {
                                            if (potentialVarName.equals("PI")) {
                                                return Math.PI;
                                            }
                                            if (potentialVarName.equals("TRUE")) {
                                                return 1.0;
                                            }
                                            if (potentialVarName.equals("FALSE")) {
                                                return 0.0;
                                            }
                                            var resolved = context.inputObjects()[finalI].getByName(potentialVarName);
                                            if (resolved != null) {
                                                if (resolved instanceof org.kevoree.modeling.meta.impl.MetaLiteral) {
                                                    return resolved.index();
                                                }
                                                else {
                                                    var valueString = resolved.toString();
                                                    if (valueString.equals("true")) {
                                                        return 1.0;
                                                    }
                                                    else {
                                                        if (valueString.equals("false")) {
                                                            return 0.0;
                                                        }
                                                        else {
                                                            try {
                                                                return java.lang.Double.parseDouble(resolved.toString());
                                                            }
                                                            catch ($ex$) {
                                                                if ($ex$ instanceof java.lang.Exception) {
                                                                    var e = $ex$;
                                                                }
                                                                else {
                                                                    throw $ex$;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            return null;
                                        });
                                        selected[finalI] = this._engine.eval(this._expression);
                                    }
                                }
                                if (context.finalCallback() != null) {
                                    context.finalCallback()(selected);
                                }
                            };
                            return MathExpressionAction;
                        })();
                        actions.MathExpressionAction = MathExpressionAction;
                        var RemoveDuplicateAction = (function () {
                            function RemoveDuplicateAction() {
                            }
                            RemoveDuplicateAction.prototype.chain = function (p_next) {
                                this._next = p_next;
                            };
                            RemoveDuplicateAction.prototype.execute = function (context) {
                                var elems = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongMap(context.inputObjects().length, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                for (var i = 0; i < context.inputObjects().length; i++) {
                                    elems.put(context.inputObjects()[i].uuid(), context.inputObjects()[i]);
                                }
                                var trimmed = new Array();
                                var nbInserted = [0];
                                elems.each(function (key, value) {
                                    trimmed[nbInserted[0]] = value;
                                    nbInserted[0]++;
                                });
                                if (this._next == null) {
                                    context.finalCallback()(trimmed);
                                }
                                else {
                                    context.setInputObjects(trimmed);
                                    this._next.execute(context);
                                }
                            };
                            return RemoveDuplicateAction;
                        })();
                        actions.RemoveDuplicateAction = RemoveDuplicateAction;
                        var TraverseAction = (function () {
                            function TraverseAction(p_reference) {
                                this._reference = p_reference;
                            }
                            TraverseAction.prototype.chain = function (p_next) {
                                this._next = p_next;
                            };
                            TraverseAction.prototype.execute = function (context) {
                                var _this = this;
                                if (context.inputObjects() == null || context.inputObjects().length == 0) {
                                    if (this._next != null) {
                                        this._next.execute(context);
                                    }
                                    else {
                                        context.finalCallback()(context.inputObjects());
                                    }
                                }
                                else {
                                    var currentObject = context.inputObjects()[0];
                                    var nextIds = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                    for (var i = 0; i < context.inputObjects().length; i++) {
                                        try {
                                            var loopObj = context.inputObjects()[i];
                                            var raw = currentObject._manager.segment(loopObj.universe(), loopObj.now(), loopObj.uuid(), true, loopObj.metaClass(), null);
                                            if (raw != null) {
                                                if (this._reference == null) {
                                                    var metaElements = loopObj.metaClass().metaElements();
                                                    for (var j = 0; j < metaElements.length; j++) {
                                                        if (metaElements[j] instanceof org.kevoree.modeling.meta.impl.MetaReference) {
                                                            var ref = metaElements[j];
                                                            var resolved = raw.getRef(ref.index(), currentObject.metaClass());
                                                            if (resolved != null) {
                                                                for (var k = 0; k < resolved.length; k++) {
                                                                    nextIds.put(resolved[k], resolved[k]);
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                else {
                                                    var translatedRef = loopObj.internal_transpose_ref(this._reference);
                                                    if (translatedRef != null) {
                                                        var resolved = raw.getRef(translatedRef.index(), currentObject.metaClass());
                                                        if (resolved != null) {
                                                            for (var j = 0; j < resolved.length; j++) {
                                                                nextIds.put(resolved[j], resolved[j]);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        catch ($ex$) {
                                            if ($ex$ instanceof java.lang.Exception) {
                                                var e = $ex$;
                                                e.printStackTrace();
                                            }
                                            else {
                                                throw $ex$;
                                            }
                                        }
                                    }
                                    var trimmed = new Array();
                                    var inserted = [0];
                                    nextIds.each(function (key, value) {
                                        trimmed[inserted[0]] = key;
                                        inserted[0]++;
                                    });
                                    currentObject._manager.lookupAllObjects(currentObject.universe(), currentObject.now(), trimmed, function (kObjects) {
                                        if (_this._next == null) {
                                            context.finalCallback()(kObjects);
                                        }
                                        else {
                                            context.setInputObjects(kObjects);
                                            _this._next.execute(context);
                                        }
                                    });
                                }
                            };
                            return TraverseAction;
                        })();
                        actions.TraverseAction = TraverseAction;
                        var TraverseIndexAction = (function () {
                            function TraverseIndexAction(p_indexName) {
                                this._indexName = p_indexName;
                            }
                            TraverseIndexAction.prototype.chain = function (p_next) {
                                this._next = p_next;
                            };
                            TraverseIndexAction.prototype.execute = function (context) {
                                var _this = this;
                                if (this._indexName.equals("root")) {
                                    if (context.inputObjects().length > 0) {
                                        context.inputObjects()[0].manager().getRoot(context.inputObjects()[0].universe(), context.inputObjects()[0].now(), function (root) {
                                            var selectedElems = new Array();
                                            selectedElems[0] = root;
                                            if (_this._next == null) {
                                                context.finalCallback()(selectedElems);
                                            }
                                            else {
                                                context.setInputObjects(selectedElems);
                                                _this._next.execute(context);
                                            }
                                        });
                                    }
                                }
                                else {
                                    var resolver = context.indexResolver();
                                    if (resolver != null) {
                                        var resolved = resolver(this._indexName);
                                        if (resolved != null) {
                                            if (this._next == null) {
                                                context.finalCallback()(resolved);
                                            }
                                            else {
                                                context.setInputObjects(resolved);
                                                this._next.execute(context);
                                            }
                                        }
                                    }
                                    else {
                                        if (this._next == null) {
                                            context.finalCallback()(context.inputObjects());
                                        }
                                        else {
                                            this._next.execute(context);
                                        }
                                    }
                                }
                            };
                            return TraverseIndexAction;
                        })();
                        actions.TraverseIndexAction = TraverseIndexAction;
                        var TraverseQueryAction = (function () {
                            function TraverseQueryAction(p_referenceQuery) {
                                this.SEP = ",";
                                this._referenceQuery = p_referenceQuery;
                            }
                            TraverseQueryAction.prototype.chain = function (p_next) {
                                this._next = p_next;
                            };
                            TraverseQueryAction.prototype.execute = function (context) {
                                var _this = this;
                                if (context.inputObjects() == null || context.inputObjects().length == 0) {
                                    if (this._next != null) {
                                        this._next.execute(context);
                                    }
                                    else {
                                        context.finalCallback()(context.inputObjects());
                                    }
                                }
                                else {
                                    var currentFirstObject = context.inputObjects()[0];
                                    var nextIds = new org.kevoree.modeling.memory.struct.map.impl.ArrayLongLongMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                    for (var i = 0; i < context.inputObjects().length; i++) {
                                        try {
                                            var loopObj = context.inputObjects()[i];
                                            var raw = loopObj._manager.segment(loopObj.universe(), loopObj.now(), loopObj.uuid(), true, loopObj.metaClass(), null);
                                            var metaElements = loopObj.metaClass().metaElements();
                                            if (raw != null) {
                                                if (this._referenceQuery == null) {
                                                    for (var j = 0; j < metaElements.length; j++) {
                                                        if (metaElements[j] instanceof org.kevoree.modeling.meta.impl.MetaReference) {
                                                            var resolved = raw.getRef(metaElements[j].index(), loopObj.metaClass());
                                                            if (resolved != null) {
                                                                for (var k = 0; k < resolved.length; k++) {
                                                                    var idResolved = resolved[k];
                                                                    nextIds.put(idResolved, idResolved);
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                else {
                                                    var queries = this._referenceQuery.split(this.SEP);
                                                    for (var k = 0; k < queries.length; k++) {
                                                        queries[k] = queries[k].replace("*", ".*");
                                                    }
                                                    for (var h = 0; h < metaElements.length; h++) {
                                                        if (metaElements[h] instanceof org.kevoree.modeling.meta.impl.MetaReference) {
                                                            var metaReference = metaElements[h];
                                                            var selected = false;
                                                            for (var k = 0; k < queries.length; k++) {
                                                                if (queries[k] != null && queries[k].startsWith("<<")) {
                                                                    if (metaReference.opposite().metaName().matches(queries[k].substring(1))) {
                                                                        selected = true;
                                                                        break;
                                                                    }
                                                                }
                                                                else {
                                                                    if (metaReference.metaName().matches("^" + queries[k] + "$")) {
                                                                        selected = true;
                                                                        break;
                                                                    }
                                                                }
                                                            }
                                                            if (selected) {
                                                                var resolved = raw.getRef(metaElements[h].index(), loopObj.metaClass());
                                                                if (resolved != null) {
                                                                    for (var j = 0; j < resolved.length; j++) {
                                                                        nextIds.put(resolved[j], resolved[j]);
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        catch ($ex$) {
                                            if ($ex$ instanceof java.lang.Exception) {
                                                var e = $ex$;
                                                e.printStackTrace();
                                            }
                                            else {
                                                throw $ex$;
                                            }
                                        }
                                    }
                                    var trimmed = new Array();
                                    var inserted = [0];
                                    nextIds.each(function (key, value) {
                                        trimmed[inserted[0]] = key;
                                        inserted[0]++;
                                    });
                                    currentFirstObject._manager.lookupAllObjects(currentFirstObject.universe(), currentFirstObject.now(), trimmed, function (nextStepElement) {
                                        if (_this._next == null) {
                                            context.finalCallback()(nextStepElement);
                                        }
                                        else {
                                            context.setInputObjects(nextStepElement);
                                            _this._next.execute(context);
                                        }
                                    });
                                }
                            };
                            return TraverseQueryAction;
                        })();
                        actions.TraverseQueryAction = TraverseQueryAction;
                        var TraverseTimeAction = (function () {
                            function TraverseTimeAction(p_timeOffset, p_steps, p_continueCondition) {
                                this._timeOffset = p_timeOffset;
                                this._steps = p_steps;
                                this._continueContition = p_continueCondition;
                            }
                            TraverseTimeAction.prototype.chain = function (p_next) {
                                this._next = p_next;
                            };
                            TraverseTimeAction.prototype.execute = function (context) {
                                throw new java.lang.RuntimeException("Not implemented Yet!");
                            };
                            return TraverseTimeAction;
                        })();
                        actions.TraverseTimeAction = TraverseTimeAction;
                    })(actions = impl.actions || (impl.actions = {}));
                })(impl = traversal_1.impl || (traversal_1.impl = {}));
                var query;
                (function (query_1) {
                    var impl;
                    (function (impl) {
                        var QueryEngine = (function () {
                            function QueryEngine() {
                            }
                            QueryEngine.getINSTANCE = function () {
                                if (QueryEngine.INSTANCE == null) {
                                    QueryEngine.INSTANCE = new org.kevoree.modeling.traversal.query.impl.QueryEngine();
                                }
                                return QueryEngine.INSTANCE;
                            };
                            QueryEngine.prototype.eval = function (query, origins, callback) {
                                if (callback != null) {
                                    this.buildTraversal(query).exec(origins, null, callback);
                                }
                            };
                            QueryEngine.prototype.buildTraversal = function (query) {
                                if (query == null || query.length == 0) {
                                    return null;
                                }
                                else {
                                    var traversal = new org.kevoree.modeling.traversal.impl.Traversal(null);
                                    var i = 0;
                                    var escaped = false;
                                    var previousKQueryStart = 0;
                                    var previousKQueryNameEnd = -1;
                                    var previousKQueryAttributesEnd = -1;
                                    var previousKQueryAttributesStart = 0;
                                    var endEval = false;
                                    while (i < query.length && !endEval) {
                                        var notLastElem = (i + 1) != query.length;
                                        if (escaped && notLastElem) {
                                            escaped = false;
                                        }
                                        else {
                                            var currentChar = query.charAt(i);
                                            if (currentChar == QueryEngine.CLOSE_BRACKET && notLastElem) {
                                                previousKQueryAttributesEnd = i;
                                            }
                                            else {
                                                if (currentChar == '\\' && notLastElem) {
                                                    escaped = true;
                                                }
                                                else {
                                                    if (currentChar == QueryEngine.OPEN_BRACKET && notLastElem) {
                                                        previousKQueryNameEnd = i;
                                                        previousKQueryAttributesStart = i + 1;
                                                    }
                                                    else {
                                                        if (currentChar == QueryEngine.PIPE_SEP || !notLastElem) {
                                                            var relationName;
                                                            var atts = null;
                                                            if (previousKQueryNameEnd == -1) {
                                                                if (notLastElem) {
                                                                    previousKQueryNameEnd = i;
                                                                }
                                                                else {
                                                                    previousKQueryNameEnd = i + 1;
                                                                }
                                                            }
                                                            else {
                                                                if (previousKQueryAttributesStart != -1) {
                                                                    if (previousKQueryAttributesEnd == -1) {
                                                                        if (notLastElem || currentChar == QueryEngine.PIPE_SEP || currentChar == QueryEngine.CLOSE_BRACKET) {
                                                                            previousKQueryAttributesEnd = i;
                                                                        }
                                                                        else {
                                                                            previousKQueryAttributesEnd = i + 1;
                                                                        }
                                                                    }
                                                                    atts = query.substring(previousKQueryAttributesStart, previousKQueryAttributesEnd);
                                                                    if (atts.length == 0) {
                                                                        atts = null;
                                                                    }
                                                                }
                                                            }
                                                            relationName = query.substring(previousKQueryStart, previousKQueryNameEnd).trim();
                                                            if (relationName.startsWith("@")) {
                                                                traversal = traversal.traverseIndex(relationName.substring(1));
                                                            }
                                                            else {
                                                                if (relationName.startsWith("=")) {
                                                                    traversal.eval(relationName.substring(1), null);
                                                                    endEval = true;
                                                                }
                                                                else {
                                                                    if (relationName.startsWith(">>")) {
                                                                        traversal = traversal.traverseQuery(relationName.substring(2));
                                                                        if (atts != null) {
                                                                            traversal = traversal.attributeQuery(atts);
                                                                        }
                                                                    }
                                                                    else {
                                                                        if (relationName.startsWith("<<")) {
                                                                            traversal = traversal.traverseQuery(relationName);
                                                                            if (atts != null) {
                                                                                traversal = traversal.attributeQuery(atts);
                                                                            }
                                                                        }
                                                                        else {
                                                                            traversal = traversal.traverseQuery(relationName);
                                                                            if (atts != null) {
                                                                                traversal = traversal.attributeQuery(atts);
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                            previousKQueryStart = i + 1;
                                                            previousKQueryNameEnd = -1;
                                                            previousKQueryAttributesEnd = -1;
                                                            previousKQueryAttributesStart = -1;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        i = i + 1;
                                    }
                                    return traversal;
                                }
                            };
                            QueryEngine.INSTANCE = null;
                            QueryEngine.OPEN_BRACKET = '[';
                            QueryEngine.CLOSE_BRACKET = ']';
                            QueryEngine.PIPE_SEP = '|';
                            return QueryEngine;
                        })();
                        impl.QueryEngine = QueryEngine;
                    })(impl = query_1.impl || (query_1.impl = {}));
                })(query = traversal_1.query || (traversal_1.query = {}));
                var visitor;
                (function (visitor) {
                    var KVisitResult = (function () {
                        function KVisitResult() {
                        }
                        KVisitResult.prototype.equals = function (other) {
                            return this == other;
                        };
                        KVisitResult.values = function () {
                            return KVisitResult._KVisitResultVALUES;
                        };
                        KVisitResult.CONTINUE = new KVisitResult();
                        KVisitResult.SKIP = new KVisitResult();
                        KVisitResult.STOP = new KVisitResult();
                        KVisitResult._KVisitResultVALUES = [
                            KVisitResult.CONTINUE,
                            KVisitResult.SKIP,
                            KVisitResult.STOP
                        ];
                        return KVisitResult;
                    })();
                    visitor.KVisitResult = KVisitResult;
                })(visitor = traversal_1.visitor || (traversal_1.visitor = {}));
            })(traversal = modeling.traversal || (modeling.traversal = {}));
            var util;
            (function (util) {
                var Checker = (function () {
                    function Checker() {
                    }
                    Checker.isDefined = function (param) {
                        return param != undefined && param != null;
                    };
                    return Checker;
                })();
                util.Checker = Checker;
                var maths;
                (function (maths) {
                    var AdjLinearSolverQr = (function () {
                        function AdjLinearSolverQr() {
                            this.maxRows = -1;
                            this.maxCols = -1;
                            this.decomposer = new org.kevoree.modeling.util.maths.QRDecompositionHouseholderColumn_D64();
                        }
                        AdjLinearSolverQr.prototype.setA = function (A) {
                            if (A.numRows > this.maxRows || A.numCols > this.maxCols) {
                                this.setMaxSize(A.numRows, A.numCols);
                            }
                            this.numRows = A.numRows;
                            this.numCols = A.numCols;
                            if (!this.decomposer.decompose(A)) {
                                return false;
                            }
                            this.Q.reshape(this.numRows, this.numRows, false);
                            this.R.reshape(this.numRows, this.numCols, false);
                            this.decomposer.getQ(this.Q, false);
                            this.decomposer.getR(this.R, false);
                            return true;
                        };
                        AdjLinearSolverQr.prototype.solveU = function (U, b, n) {
                            for (var i = n - 1; i >= 0; i--) {
                                var sum = b[i];
                                var indexU = i * n + i + 1;
                                for (var j = i + 1; j < n; j++) {
                                    sum -= U[indexU++] * b[j];
                                }
                                b[i] = sum / U[i * n + i];
                            }
                        };
                        AdjLinearSolverQr.prototype.solve = function (B, X) {
                            var BnumCols = B.numCols;
                            this.Y.reshape(this.numRows, 1, false);
                            this.Z.reshape(this.numRows, 1, false);
                            for (var colB = 0; colB < BnumCols; colB++) {
                                for (var i = 0; i < this.numRows; i++) {
                                    this.Y.data[i] = B.unsafe_get(i, colB);
                                }
                                org.kevoree.modeling.util.maths.DenseMatrix64F.multTransA(this.Q, this.Y, this.Z);
                                this.solveU(this.R.data, this.Z.data, this.numCols);
                                for (var i = 0; i < this.numCols; i++) {
                                    X.cset(i, colB, this.Z.data[i]);
                                }
                            }
                        };
                        AdjLinearSolverQr.prototype.setMaxSize = function (maxRows, maxCols) {
                            maxRows += 5;
                            this.maxRows = maxRows;
                            this.maxCols = maxCols;
                            this.Q = new org.kevoree.modeling.util.maths.DenseMatrix64F(maxRows, maxRows);
                            this.R = new org.kevoree.modeling.util.maths.DenseMatrix64F(maxRows, maxCols);
                            this.Y = new org.kevoree.modeling.util.maths.DenseMatrix64F(maxRows, 1);
                            this.Z = new org.kevoree.modeling.util.maths.DenseMatrix64F(maxRows, 1);
                        };
                        return AdjLinearSolverQr;
                    })();
                    maths.AdjLinearSolverQr = AdjLinearSolverQr;
                    var Base64 = (function () {
                        function Base64() {
                        }
                        Base64.encodeLong = function (l) {
                            var result = "";
                            var tmp = l;
                            if (l < 0) {
                                tmp = -tmp;
                            }
                            for (var i = 47; i >= 5; i -= 6) {
                                if (!(result.equals("") && ((tmp / Math.pow(2, i)) & 0x3F) == 0)) {
                                    result += Base64.encodeArray[(tmp / Math.pow(2, i)) & 0x3F];
                                }
                            }
                            result += Base64.encodeArray[(tmp & 0x1F) * 2 + (l < 0 ? 1 : 0)];
                            return result;
                        };
                        Base64.encodeLongToBuffer = function (l, buffer) {
                            var empty = true;
                            var tmp = l;
                            if (l < 0) {
                                tmp = -tmp;
                            }
                            for (var i = 47; i >= 5; i -= 6) {
                                if (!(empty && ((tmp / Math.pow(2, i)) & 0x3F) == 0)) {
                                    empty = false;
                                    buffer.append(Base64.encodeArray[(tmp / Math.pow(2, i)) & 0x3F]);
                                }
                            }
                            buffer.append(Base64.encodeArray[(tmp & 0x1F) * 2 + (l < 0 ? 1 : 0)]);
                        };
                        Base64.encodeInt = function (l) {
                            var result = "";
                            var tmp = l;
                            if (l < 0) {
                                tmp = -tmp;
                            }
                            for (var i = 29; i >= 5; i -= 6) {
                                if (!(result.equals("") && ((tmp / Math.pow(2, i)) & 0x3F) == 0)) {
                                    result += Base64.encodeArray[(tmp / Math.pow(2, i)) & 0x3F];
                                }
                            }
                            result += Base64.encodeArray[(tmp & 0x1F) * 2 + (l < 0 ? 1 : 0)];
                            return result;
                        };
                        Base64.encodeIntToBuffer = function (l, buffer) {
                            var empty = true;
                            var tmp = l;
                            if (l < 0) {
                                tmp = -tmp;
                            }
                            for (var i = 29; i >= 5; i -= 6) {
                                if (!(empty && ((tmp / Math.pow(2, i)) & 0x3F) == 0)) {
                                    empty = false;
                                    buffer.append(Base64.encodeArray[(tmp / Math.pow(2, i)) & 0x3F]);
                                }
                            }
                            buffer.append(Base64.encodeArray[(tmp & 0x1F) * 2 + (l < 0 ? 1 : 0)]);
                        };
                        Base64.decodeToLong = function (s) {
                            return Base64.decodeToLongWithBounds(s, 0, s.length);
                        };
                        Base64.decodeToLongWithBounds = function (s, offsetBegin, offsetEnd) {
                            var result = 0;
                            result += (Base64.decodeArray[s.charAt((offsetEnd - 1))] & 0xFF) / 2;
                            for (var i = 1; i < (offsetEnd - offsetBegin); i++) {
                                result += (Base64.decodeArray[s.charAt((offsetEnd - 1) - i)] & 0xFF) * Math.pow(2, (6 * i) - 1);
                            }
                            if (((Base64.decodeArray[s.charAt((offsetEnd - 1))] & 0xFF) & 0x1) != 0) {
                                result = -result;
                            }
                            return result;
                        };
                        Base64.decodeToInt = function (s) {
                            return Base64.decodeToIntWithBounds(s, 0, s.length);
                        };
                        Base64.decodeToIntWithBounds = function (s, offsetBegin, offsetEnd) {
                            var result = 0;
                            result += (Base64.decodeArray[s.charAt((offsetEnd - 1))] & 0xFF) / 2;
                            for (var i = 1; i < (offsetEnd - offsetBegin); i++) {
                                result += (Base64.decodeArray[s.charAt((offsetEnd - 1) - i)] & 0xFF) * Math.pow(2, (6 * i) - 1);
                            }
                            if (((Base64.decodeArray[s.charAt((offsetEnd - 1))] & 0xFF) & 0x1) != 0) {
                                result = -result;
                            }
                            return result;
                        };
                        Base64.encodeDouble = function (d) {
                            var result = "";
                            var float = new Float64Array(1);
                            var bytes = new Uint8Array(float.buffer);
                            float[0] = d;
                            var exponent = ((bytes[7] & 0x7f) << 4 | bytes[6] >> 4) - 0x3ff;
                            var signAndExp = (((bytes[7] >> 7) & 0x1) << 11) + (exponent + 1023);
                            //encode sign + exp
                            result += Base64.encodeArray[(signAndExp >> 6) & 0x3F];
                            result += Base64.encodeArray[signAndExp & 0x3F];
                            result += Base64.encodeArray[bytes[6] & 0x0F];
                            result += Base64.encodeArray[(bytes[5] >> 2) & 0x3F];
                            result += Base64.encodeArray[(bytes[5] & 0x3) << 4 | bytes[4] >> 4];
                            result += Base64.encodeArray[(bytes[4] & 0x0F) << 2 | bytes[3] >> 6];
                            result += Base64.encodeArray[(bytes[3] & 0x3F)];
                            result += Base64.encodeArray[(bytes[2] >> 2) & 0x3F];
                            result += Base64.encodeArray[(bytes[2] & 0x3) << 4 | bytes[1] >> 4];
                            result += Base64.encodeArray[(bytes[1] & 0x0F) << 2 | bytes[0] >> 6];
                            result += Base64.encodeArray[(bytes[0] & 0x3F)];
                            return result;
                        };
                        Base64.encodeDoubleToBuffer = function (d, buffer) {
                            var float = new Float64Array(1);
                            var bytes = new Uint8Array(float.buffer);
                            float[0] = d;
                            var exponent = ((bytes[7] & 0x7f) << 4 | bytes[6] >> 4) - 0x3ff;
                            var signAndExp = (((bytes[7] >> 7) & 0x1) << 11) + (exponent + 1023);
                            //encode sign + exp
                            buffer.append(Base64.encodeArray[(signAndExp >> 6) & 0x3F]);
                            buffer.append(Base64.encodeArray[signAndExp & 0x3F]);
                            buffer.append(Base64.encodeArray[bytes[6] & 0x0F]);
                            buffer.append(Base64.encodeArray[(bytes[5] >> 2) & 0x3F]);
                            buffer.append(Base64.encodeArray[(bytes[5] & 0x3) << 4 | bytes[4] >> 4]);
                            buffer.append(Base64.encodeArray[(bytes[4] & 0x0F) << 2 | bytes[3] >> 6]);
                            buffer.append(Base64.encodeArray[(bytes[3] & 0x3F)]);
                            buffer.append(Base64.encodeArray[(bytes[2] >> 2) & 0x3F]);
                            buffer.append(Base64.encodeArray[(bytes[2] & 0x3) << 4 | bytes[1] >> 4]);
                            buffer.append(Base64.encodeArray[(bytes[1] & 0x0F) << 2 | bytes[0] >> 6]);
                            buffer.append(Base64.encodeArray[(bytes[0] & 0x3F)]);
                        };
                        Base64.decodeToDouble = function (s) {
                            return Base64.decodeToDoubleWithBounds(s, 0, s.length);
                        };
                        Base64.decodeToDoubleWithBounds = function (s, offsetBegin, offsetEnd) {
                            var signAndExp = ((Base64.decodeArray[s.charAt(0)] & 0xFF) * Math.pow(2, 6)) + (Base64.decodeArray[s.charAt(1)] & 0xFF);
                            var sign = ((signAndExp & 0x800) != 0 ? -1 : 1);
                            var exp = signAndExp & 0x7FF;
                            //Mantisse
                            var mantissaBits = 0;
                            for (var i = 0; i < (offsetEnd - offsetBegin) - 2; i++) {
                                mantissaBits += (Base64.decodeArray[s.charAt((offsetEnd - 1) - i)] & 0xFF) * Math.pow(2, 6 * i);
                            }
                            return (exp != 0) ? sign * Math.pow(2, exp - 1023) * (1 + (mantissaBits / Math.pow(2, 52))) : sign * Math.pow(2, -1022) * (0 + (mantissaBits / Math.pow(2, 52)));
                        };
                        Base64.encodeBoolArray = function (boolArr) {
                            var result = "";
                            var tmpVal = 0;
                            for (var i = 0; i < boolArr.length; i++) {
                                tmpVal = tmpVal | ((boolArr[i] ? 1 : 0) * Math.pow(2, i % 6));
                                if (i % 6 == 5 || i == (boolArr.length - 1)) {
                                    result += Base64.encodeArray[tmpVal];
                                    tmpVal = 0;
                                }
                            }
                            return result;
                        };
                        Base64.encodeBoolArrayToBuffer = function (boolArr, buffer) {
                            var tmpVal = 0;
                            for (var i = 0; i < boolArr.length; i++) {
                                tmpVal = tmpVal | ((boolArr[i] ? 1 : 0) * Math.pow(2, i % 6));
                                if (i % 6 == 5 || i == boolArr.length - 1) {
                                    buffer.append(Base64.encodeArray[tmpVal]);
                                    tmpVal = 0;
                                }
                            }
                        };
                        Base64.decodeBoolArray = function (s, arraySize) {
                            return Base64.decodeToBoolArrayWithBounds(s, 0, s.length, arraySize);
                        };
                        Base64.decodeToBoolArrayWithBounds = function (s, offsetBegin, offsetEnd, arraySize) {
                            var resultTmp = [];
                            for (var i = 0; i < (offsetEnd - offsetBegin); i++) {
                                var bitarray = Base64.decodeArray[s.charAt(offsetBegin + i)] & 0xFF;
                                for (var bit_i = 0; bit_i < 6; bit_i++) {
                                    if ((6 * i) + bit_i < arraySize) {
                                        resultTmp[(6 * i) + bit_i] = (bitarray & (1 * Math.pow(2, bit_i))) != 0;
                                    }
                                    else {
                                        break;
                                    }
                                }
                            }
                            return resultTmp;
                        };
                        Base64.encodeArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'];
                        Base64.decodeArray = { "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7, "I": 8, "J": 9, "K": 10, "L": 11, "M": 12, "N": 13, "O": 14, "P": 15, "Q": 16, "R": 17, "S": 18, "T": 19, "U": 20, "V": 21, "W": 22, "X": 23, "Y": 24, "Z": 25, "a": 26, "b": 27, "c": 28, "d": 29, "e": 30, "f": 31, "g": 32, "h": 33, "i": 34, "j": 35, "k": 36, "l": 37, "m": 38, "n": 39, "o": 40, "p": 41, "q": 42, "r": 43, "s": 44, "t": 45, "u": 46, "v": 47, "w": 48, "x": 49, "y": 50, "z": 51, "0": 52, "1": 53, "2": 54, "3": 55, "4": 56, "5": 57, "6": 58, "7": 59, "8": 60, "9": 61, "+": 62, "/": 63 };
                        return Base64;
                    })();
                    maths.Base64 = Base64;
                    var Correlations = (function () {
                        function Correlations() {
                        }
                        Correlations.pearson = function (x, y) {
                            var meanX = 0.0;
                            var meanY = 0.0;
                            for (var i = 0; i < x.length; i++) {
                                meanX += x[i];
                                meanY += y[i];
                            }
                            meanX /= x.length;
                            meanY /= x.length;
                            var sumXY = 0.0;
                            var sumX2 = 0.0;
                            var sumY2 = 0.0;
                            for (var i = 0; i < x.length; i++) {
                                sumXY += ((x[i] - meanX) * (y[i] - meanY));
                                sumX2 += (x[i] - meanX) * (x[i] - meanX);
                                sumY2 += (y[i] - meanY) * (y[i] - meanY);
                            }
                            return (sumXY / (Math.sqrt(sumX2) * Math.sqrt(sumY2)));
                        };
                        return Correlations;
                    })();
                    maths.Correlations = Correlations;
                    var DenseMatrix64F = (function () {
                        function DenseMatrix64F(numRows, numCols) {
                            this.data = new Array();
                            this.numRows = numRows;
                            this.numCols = numCols;
                        }
                        DenseMatrix64F.multTransA_smallMV = function (A, B, C) {
                            var cIndex = 0;
                            for (var i = 0; i < A.numCols; i++) {
                                var total = 0.0;
                                var indexA = i;
                                for (var j = 0; j < A.numRows; j++) {
                                    total += A.get(indexA) * B.get(j);
                                    indexA += A.numCols;
                                }
                                C.set(cIndex++, total);
                            }
                        };
                        DenseMatrix64F.multTransA_reorderMV = function (A, B, C) {
                            if (A.numRows == 0) {
                                org.kevoree.modeling.util.maths.DenseMatrix64F.fill(C, 0);
                                return;
                            }
                            var B_val = B.get(0);
                            for (var i = 0; i < A.numCols; i++) {
                                C.set(i, A.get(i) * B_val);
                            }
                            var indexA = A.numCols;
                            for (var i = 1; i < A.numRows; i++) {
                                B_val = B.get(i);
                                for (var j = 0; j < A.numCols; j++) {
                                    C.plus(j, A.get(indexA++) * B_val);
                                }
                            }
                        };
                        DenseMatrix64F.multTransA_reorderMM = function (a, b, c) {
                            if (a.numCols == 0 || a.numRows == 0) {
                                org.kevoree.modeling.util.maths.DenseMatrix64F.fill(c, 0);
                                return;
                            }
                            var valA;
                            for (var i = 0; i < a.numCols; i++) {
                                var indexC_start = i * c.numCols;
                                valA = a.get(i);
                                var indexB = 0;
                                var end = indexB + b.numCols;
                                var indexC = indexC_start;
                                while (indexB < end) {
                                    c.set(indexC++, valA * b.get(indexB++));
                                }
                                for (var k = 1; k < a.numRows; k++) {
                                    valA = a.unsafe_get(k, i);
                                    end = indexB + b.numCols;
                                    indexC = indexC_start;
                                    while (indexB < end) {
                                        c.plus(indexC++, valA * b.get(indexB++));
                                    }
                                }
                            }
                        };
                        DenseMatrix64F.multTransA_smallMM = function (a, b, c) {
                            var cIndex = 0;
                            for (var i = 0; i < a.numCols; i++) {
                                for (var j = 0; j < b.numCols; j++) {
                                    var indexA = i;
                                    var indexB = j;
                                    var end = indexB + b.numRows * b.numCols;
                                    var total = 0;
                                    for (; indexB < end; indexB += b.numCols) {
                                        total += a.get(indexA) * b.get(indexB);
                                        indexA += a.numCols;
                                    }
                                    c.set(cIndex++, total);
                                }
                            }
                        };
                        DenseMatrix64F.multTransA = function (a, b, c) {
                            if (b.numCols == 1) {
                                if (a.numCols >= org.kevoree.modeling.util.maths.DenseMatrix64F.MULT_COLUMN_SWITCH) {
                                    org.kevoree.modeling.util.maths.DenseMatrix64F.multTransA_reorderMV(a, b, c);
                                }
                                else {
                                    org.kevoree.modeling.util.maths.DenseMatrix64F.multTransA_smallMV(a, b, c);
                                }
                            }
                            else {
                                if (a.numCols >= org.kevoree.modeling.util.maths.DenseMatrix64F.MULT_COLUMN_SWITCH || b.numCols >= org.kevoree.modeling.util.maths.DenseMatrix64F.MULT_COLUMN_SWITCH) {
                                    org.kevoree.modeling.util.maths.DenseMatrix64F.multTransA_reorderMM(a, b, c);
                                }
                                else {
                                    org.kevoree.modeling.util.maths.DenseMatrix64F.multTransA_smallMM(a, b, c);
                                }
                            }
                        };
                        DenseMatrix64F.setIdentity = function (mat) {
                            var width = mat.numRows < mat.numCols ? mat.numRows : mat.numCols;
                            java.util.Arrays.fill(mat.data, 0, mat.getNumElements(), 0);
                            var index = 0;
                            for (var i = 0; i < width; i++) {
                                mat.data[index] = 1;
                                index += mat.numCols + 1;
                            }
                        };
                        DenseMatrix64F.widentity = function (width) {
                            var ret = new org.kevoree.modeling.util.maths.DenseMatrix64F(width, width);
                            for (var i = 0; i < width; i++) {
                                ret.cset(i, i, 1.0);
                            }
                            return ret;
                        };
                        DenseMatrix64F.identity = function (numRows, numCols) {
                            var ret = new org.kevoree.modeling.util.maths.DenseMatrix64F(numRows, numCols);
                            var small = numRows < numCols ? numRows : numCols;
                            for (var i = 0; i < small; i++) {
                                ret.cset(i, i, 1.0);
                            }
                            return ret;
                        };
                        DenseMatrix64F.fill = function (a, value) {
                            java.util.Arrays.fill(a.data, 0, a.getNumElements(), value);
                        };
                        DenseMatrix64F.prototype.get = function (index) {
                            return this.data[index];
                        };
                        DenseMatrix64F.prototype.set = function (index, val) {
                            return this.data[index] = val;
                        };
                        DenseMatrix64F.prototype.plus = function (index, val) {
                            return this.data[index] += val;
                        };
                        DenseMatrix64F.prototype.reshape = function (numRows, numCols, saveValues) {
                            if (this.data.length < numRows * numCols) {
                                var d = new Array();
                                if (saveValues) {
                                    System.arraycopy(this.data, 0, d, 0, this.getNumElements());
                                }
                                this.data = d;
                            }
                            this.numRows = numRows;
                            this.numCols = numCols;
                        };
                        DenseMatrix64F.prototype.cset = function (row, col, value) {
                            this.data[row * this.numCols + col] = value;
                        };
                        DenseMatrix64F.prototype.unsafe_get = function (row, col) {
                            return this.data[row * this.numCols + col];
                        };
                        DenseMatrix64F.prototype.getNumElements = function () {
                            return this.numRows * this.numCols;
                        };
                        DenseMatrix64F.MULT_COLUMN_SWITCH = 15;
                        return DenseMatrix64F;
                    })();
                    maths.DenseMatrix64F = DenseMatrix64F;
                    var Distribution = (function () {
                        function Distribution() {
                        }
                        Distribution.inverseNormalCDF = function (q) {
                            var b = [1.570796288, 0.03706987906, -0.8364353589e-3, -0.2250947176e-3, 0.6841218299e-5, 0.5824238515e-5, -0.104527497e-5, 0.8360937017e-7, -0.3231081277e-8, 0.3657763036e-10, 0.6936233982e-12];
                            if (q < 0.0 || 1.0 < q || q == 0.5) {
                                return 0.0;
                            }
                            var w1 = q;
                            if (q > 0.5) {
                                w1 = 1.0 - q;
                            }
                            var w3 = -Math.log(4.0 * w1 * (1.0 - w1));
                            w1 = b[0];
                            for (var i = 1; i < 11; i++) {
                                w1 += b[i] * Math.pow(w3, i);
                            }
                            return q > 0.5 ? Math.sqrt(w1 * w3) : -Math.sqrt(w1 * w3);
                        };
                        Distribution.gaussian = function (features, means, variances) {
                            var dim = features.length;
                            var p = 1;
                            for (var i = 0; i < dim; i++) {
                                p = p * (1 / Math.sqrt(2 * Math.PI * variances[i])) * Math.exp(-((features[i] - means[i]) * (features[i] - means[i])) / (2 * variances[i]));
                            }
                            return p;
                        };
                        Distribution.parallelGaussian = function (features, means, variances) {
                            var dim = features.length;
                            var p = new Array();
                            for (var i = 0; i < dim; i++) {
                                p[i] = (1 / Math.sqrt(2 * Math.PI * variances[i])) * Math.exp(-((features[i] - means[i]) * (features[i] - means[i])) / (2 * variances[i]));
                            }
                            return p;
                        };
                        Distribution.gaussianOneFeature = function (feature, mean, variance) {
                            return (1 / Math.sqrt(2 * Math.PI * variance)) * Math.exp(-((feature - mean) * (feature - mean)) / (2 * variance));
                        };
                        return Distribution;
                    })();
                    maths.Distribution = Distribution;
                    var PolynomialFit = (function () {
                        function PolynomialFit(degree) {
                            this.coef = new org.kevoree.modeling.util.maths.DenseMatrix64F(degree + 1, 1);
                            this.A = new org.kevoree.modeling.util.maths.DenseMatrix64F(1, degree + 1);
                            this.y = new org.kevoree.modeling.util.maths.DenseMatrix64F(1, 1);
                            this.solver = new org.kevoree.modeling.util.maths.AdjLinearSolverQr();
                        }
                        PolynomialFit.prototype.getCoef = function () {
                            return this.coef.data;
                        };
                        PolynomialFit.prototype.fit = function (samplePoints, observations) {
                            this.y.reshape(observations.length, 1, false);
                            System.arraycopy(observations, 0, this.y.data, 0, observations.length);
                            this.A.reshape(this.y.numRows, this.coef.numRows, false);
                            for (var i = 0; i < observations.length; i++) {
                                var obs = 1;
                                for (var j = 0; j < this.coef.numRows; j++) {
                                    this.A.cset(i, j, obs);
                                    obs *= samplePoints[i];
                                }
                            }
                            this.solver.setA(this.A);
                            this.solver.solve(this.y, this.coef);
                        };
                        PolynomialFit.extrapolate = function (time, weights) {
                            var result = 0;
                            var power = 1;
                            for (var j = 0; j < weights.length; j++) {
                                result += weights[j] * power;
                                power = power * time;
                            }
                            return result;
                        };
                        return PolynomialFit;
                    })();
                    maths.PolynomialFit = PolynomialFit;
                    var QRDecompositionHouseholderColumn_D64 = (function () {
                        function QRDecompositionHouseholderColumn_D64() {
                        }
                        QRDecompositionHouseholderColumn_D64.prototype.setExpectedMaxSize = function (numRows, numCols) {
                            this.numCols = numCols;
                            this.numRows = numRows;
                            this.minLength = Math.min(numCols, numRows);
                            var maxLength = Math.max(numCols, numRows);
                            if (this.dataQR == null || this.dataQR.length < numCols || this.dataQR[0].length < numRows) {
                                this.dataQR = new Array(new Array());
                                for (var i = 0; i < numCols; i++) {
                                    this.dataQR[i] = new Array();
                                }
                                this.v = new Array();
                                this.gammas = new Array();
                            }
                            if (this.v.length < maxLength) {
                                this.v = new Array();
                            }
                            if (this.gammas.length < this.minLength) {
                                this.gammas = new Array();
                            }
                        };
                        QRDecompositionHouseholderColumn_D64.prototype.getQ = function (Q, compact) {
                            if (compact) {
                                if (Q == null) {
                                    Q = org.kevoree.modeling.util.maths.DenseMatrix64F.identity(this.numRows, this.minLength);
                                }
                                else {
                                    org.kevoree.modeling.util.maths.DenseMatrix64F.setIdentity(Q);
                                }
                            }
                            else {
                                if (Q == null) {
                                    Q = org.kevoree.modeling.util.maths.DenseMatrix64F.widentity(this.numRows);
                                }
                                else {
                                    org.kevoree.modeling.util.maths.DenseMatrix64F.setIdentity(Q);
                                }
                            }
                            for (var j = this.minLength - 1; j >= 0; j--) {
                                var u = this.dataQR[j];
                                var vv = u[j];
                                u[j] = 1;
                                org.kevoree.modeling.util.maths.QRDecompositionHouseholderColumn_D64.rank1UpdateMultR(Q, u, this.gammas[j], j, j, this.numRows, this.v);
                                u[j] = vv;
                            }
                            return Q;
                        };
                        QRDecompositionHouseholderColumn_D64.prototype.getR = function (R, compact) {
                            if (R == null) {
                                if (compact) {
                                    R = new org.kevoree.modeling.util.maths.DenseMatrix64F(this.minLength, this.numCols);
                                }
                                else {
                                    R = new org.kevoree.modeling.util.maths.DenseMatrix64F(this.numRows, this.numCols);
                                }
                            }
                            else {
                                for (var i = 0; i < R.numRows; i++) {
                                    var min = Math.min(i, R.numCols);
                                    for (var j = 0; j < min; j++) {
                                        R.cset(i, j, 0);
                                    }
                                }
                            }
                            for (var j = 0; j < this.numCols; j++) {
                                var colR = this.dataQR[j];
                                var l = Math.min(j, this.numRows - 1);
                                for (var i = 0; i <= l; i++) {
                                    var val = colR[i];
                                    R.cset(i, j, val);
                                }
                            }
                            return R;
                        };
                        QRDecompositionHouseholderColumn_D64.prototype.decompose = function (A) {
                            this.setExpectedMaxSize(A.numRows, A.numCols);
                            this.convertToColumnMajor(A);
                            this.error = false;
                            for (var j = 0; j < this.minLength; j++) {
                                this.householder(j);
                                this.updateA(j);
                            }
                            return !this.error;
                        };
                        QRDecompositionHouseholderColumn_D64.prototype.convertToColumnMajor = function (A) {
                            for (var x = 0; x < this.numCols; x++) {
                                var colQ = this.dataQR[x];
                                for (var y = 0; y < this.numRows; y++) {
                                    colQ[y] = A.data[y * this.numCols + x];
                                }
                            }
                        };
                        QRDecompositionHouseholderColumn_D64.prototype.householder = function (j) {
                            var u = this.dataQR[j];
                            var max = org.kevoree.modeling.util.maths.QRDecompositionHouseholderColumn_D64.findMax(u, j, this.numRows - j);
                            if (max == 0.0) {
                                this.gamma = 0;
                                this.error = true;
                            }
                            else {
                                this.tau = org.kevoree.modeling.util.maths.QRDecompositionHouseholderColumn_D64.computeTauAndDivide(j, this.numRows, u, max);
                                var u_0 = u[j] + this.tau;
                                org.kevoree.modeling.util.maths.QRDecompositionHouseholderColumn_D64.divideElements(j + 1, this.numRows, u, u_0);
                                this.gamma = u_0 / this.tau;
                                this.tau *= max;
                                u[j] = -this.tau;
                            }
                            this.gammas[j] = this.gamma;
                        };
                        QRDecompositionHouseholderColumn_D64.prototype.updateA = function (w) {
                            var u = this.dataQR[w];
                            for (var j = w + 1; j < this.numCols; j++) {
                                var colQ = this.dataQR[j];
                                var val = colQ[w];
                                for (var k = w + 1; k < this.numRows; k++) {
                                    val += u[k] * colQ[k];
                                }
                                val *= this.gamma;
                                colQ[w] -= val;
                                for (var i = w + 1; i < this.numRows; i++) {
                                    colQ[i] -= u[i] * val;
                                }
                            }
                        };
                        QRDecompositionHouseholderColumn_D64.findMax = function (u, startU, length) {
                            var max = -1;
                            var index = startU;
                            var stopIndex = startU + length;
                            for (; index < stopIndex; index++) {
                                var val = u[index];
                                val = (val < 0.0) ? -val : val;
                                if (val > max) {
                                    max = val;
                                }
                            }
                            return max;
                        };
                        QRDecompositionHouseholderColumn_D64.divideElements = function (j, numRows, u, u_0) {
                            for (var i = j; i < numRows; i++) {
                                u[i] /= u_0;
                            }
                        };
                        QRDecompositionHouseholderColumn_D64.computeTauAndDivide = function (j, numRows, u, max) {
                            var tau = 0;
                            for (var i = j; i < numRows; i++) {
                                var d = u[i] /= max;
                                tau += d * d;
                            }
                            tau = Math.sqrt(tau);
                            if (u[j] < 0) {
                                tau = -tau;
                            }
                            return tau;
                        };
                        QRDecompositionHouseholderColumn_D64.rank1UpdateMultR = function (A, u, gamma, colA0, w0, w1, _temp) {
                            for (var i = colA0; i < A.numCols; i++) {
                                _temp[i] = u[w0] * A.data[w0 * A.numCols + i];
                            }
                            for (var k = w0 + 1; k < w1; k++) {
                                var indexA = k * A.numCols + colA0;
                                var valU = u[k];
                                for (var i = colA0; i < A.numCols; i++) {
                                    _temp[i] += valU * A.data[indexA++];
                                }
                            }
                            for (var i = colA0; i < A.numCols; i++) {
                                _temp[i] *= gamma;
                            }
                            for (var i = w0; i < w1; i++) {
                                var valU = u[i];
                                var indexA = i * A.numCols + colA0;
                                for (var j = colA0; j < A.numCols; j++) {
                                    A.data[indexA++] -= valU * _temp[j];
                                }
                            }
                        };
                        return QRDecompositionHouseholderColumn_D64;
                    })();
                    maths.QRDecompositionHouseholderColumn_D64 = QRDecompositionHouseholderColumn_D64;
                    var Ranking = (function () {
                        function Ranking() {
                        }
                        Ranking.wilsonRank = function (positive, negative, confidence) {
                            var n = positive + negative;
                            if (n == 0) {
                                return 0.0;
                            }
                            var z = org.kevoree.modeling.util.maths.Distribution.inverseNormalCDF(1.0 - confidence / 2.0);
                            var p_hat = (1.0 * positive) / n;
                            return (p_hat + z * z / (2.0 * n) - z * Math.sqrt((p_hat * (1.0 - p_hat) + z * z / (4.0 * n)) / n)) / (1.0 + z * z / n);
                        };
                        return Ranking;
                    })();
                    maths.Ranking = Ranking;
                    var Statistic = (function () {
                        function Statistic() {
                        }
                        Statistic.calcHistogram = function (data, dataratings, numBins) {
                            var result = new Array();
                            var max;
                            var min;
                            min = data[0];
                            max = data[0];
                            for (var i = 0; i < data.length; i++) {
                                if (data[i] < min) {
                                    min = data[i];
                                }
                                if (data[i] > max) {
                                    max = data[i];
                                }
                            }
                            var binSize = (max - min) / numBins;
                            for (var i = 0; i < data.length; i++) {
                                var bin = ((data[i] - min) / binSize);
                                result[bin]++;
                            }
                        };
                        return Statistic;
                    })();
                    maths.Statistic = Statistic;
                    var StringDistance = (function () {
                        function StringDistance() {
                        }
                        StringDistance.levenshtein = function (s0, s1) {
                            var len0 = s0.length + 1;
                            var len1 = s1.length + 1;
                            var cost = new Array();
                            var newcost = new Array();
                            for (var i = 0; i < len0; i++) {
                                cost[i] = i;
                            }
                            for (var j = 1; j < len1; j++) {
                                newcost[0] = j;
                                for (var i = 1; i < len0; i++) {
                                    var match = (s0.charAt(i - 1) == s1.charAt(j - 1)) ? 0 : 1;
                                    var cost_replace = cost[i - 1] + match;
                                    var cost_insert = cost[i] + 1;
                                    var cost_delete = newcost[i - 1] + 1;
                                    newcost[i] = Math.min(Math.min(cost_insert, cost_delete), cost_replace);
                                }
                                var swap = cost;
                                cost = newcost;
                                newcost = swap;
                            }
                            return cost[len0 - 1];
                        };
                        return StringDistance;
                    })();
                    maths.StringDistance = StringDistance;
                    var expression;
                    (function (expression_1) {
                        var impl;
                        (function (impl) {
                            var MathEntities = (function () {
                                function MathEntities() {
                                    this.operators = new org.kevoree.modeling.memory.struct.map.impl.ArrayStringMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                    this.operators.put("+", new org.kevoree.modeling.util.maths.expression.impl.MathOperation("+", 20, true));
                                    this.operators.put("-", new org.kevoree.modeling.util.maths.expression.impl.MathOperation("-", 20, true));
                                    this.operators.put("*", new org.kevoree.modeling.util.maths.expression.impl.MathOperation("*", 30, true));
                                    this.operators.put("/", new org.kevoree.modeling.util.maths.expression.impl.MathOperation("/", 30, true));
                                    this.operators.put("%", new org.kevoree.modeling.util.maths.expression.impl.MathOperation("%", 30, true));
                                    this.operators.put("^", new org.kevoree.modeling.util.maths.expression.impl.MathOperation("^", 40, false));
                                    this.operators.put("&&", new org.kevoree.modeling.util.maths.expression.impl.MathOperation("&&", 4, false));
                                    this.operators.put("||", new org.kevoree.modeling.util.maths.expression.impl.MathOperation("||", 2, false));
                                    this.operators.put(">", new org.kevoree.modeling.util.maths.expression.impl.MathOperation(">", 10, false));
                                    this.operators.put(">=", new org.kevoree.modeling.util.maths.expression.impl.MathOperation(">=", 10, false));
                                    this.operators.put("<", new org.kevoree.modeling.util.maths.expression.impl.MathOperation("<", 10, false));
                                    this.operators.put("<=", new org.kevoree.modeling.util.maths.expression.impl.MathOperation("<=", 10, false));
                                    this.operators.put("==", new org.kevoree.modeling.util.maths.expression.impl.MathOperation("==", 7, false));
                                    this.operators.put("!=", new org.kevoree.modeling.util.maths.expression.impl.MathOperation("!=", 7, false));
                                    this.functions = new org.kevoree.modeling.memory.struct.map.impl.ArrayStringMap(org.kevoree.modeling.KConfig.CACHE_INIT_SIZE, org.kevoree.modeling.KConfig.CACHE_LOAD_FACTOR);
                                    this.functions.put("NOT", new org.kevoree.modeling.util.maths.expression.impl.MathFunction("NOT", 1));
                                    this.functions.put("IF", new org.kevoree.modeling.util.maths.expression.impl.MathFunction("IF", 3));
                                    this.functions.put("RAND", new org.kevoree.modeling.util.maths.expression.impl.MathFunction("RAND", 0));
                                    this.functions.put("SIN", new org.kevoree.modeling.util.maths.expression.impl.MathFunction("SIN", 1));
                                    this.functions.put("COS", new org.kevoree.modeling.util.maths.expression.impl.MathFunction("COS", 1));
                                    this.functions.put("TAN", new org.kevoree.modeling.util.maths.expression.impl.MathFunction("TAN", 1));
                                    this.functions.put("ASIN", new org.kevoree.modeling.util.maths.expression.impl.MathFunction("ASIN", 1));
                                    this.functions.put("ACOS", new org.kevoree.modeling.util.maths.expression.impl.MathFunction("ACOS", 1));
                                    this.functions.put("ATAN", new org.kevoree.modeling.util.maths.expression.impl.MathFunction("ATAN", 1));
                                    this.functions.put("MAX", new org.kevoree.modeling.util.maths.expression.impl.MathFunction("MAX", 2));
                                    this.functions.put("MIN", new org.kevoree.modeling.util.maths.expression.impl.MathFunction("MIN", 2));
                                    this.functions.put("ABS", new org.kevoree.modeling.util.maths.expression.impl.MathFunction("ABS", 1));
                                    this.functions.put("LOG", new org.kevoree.modeling.util.maths.expression.impl.MathFunction("LOG", 1));
                                    this.functions.put("ROUND", new org.kevoree.modeling.util.maths.expression.impl.MathFunction("ROUND", 2));
                                    this.functions.put("FLOOR", new org.kevoree.modeling.util.maths.expression.impl.MathFunction("FLOOR", 1));
                                    this.functions.put("CEILING", new org.kevoree.modeling.util.maths.expression.impl.MathFunction("CEILING", 1));
                                    this.functions.put("SQRT", new org.kevoree.modeling.util.maths.expression.impl.MathFunction("SQRT", 1));
                                }
                                MathEntities.getINSTANCE = function () {
                                    if (MathEntities.INSTANCE == null) {
                                        MathEntities.INSTANCE = new org.kevoree.modeling.util.maths.expression.impl.MathEntities();
                                    }
                                    return MathEntities.INSTANCE;
                                };
                                MathEntities.INSTANCE = null;
                                return MathEntities;
                            })();
                            impl.MathEntities = MathEntities;
                            var MathExpressionEngine = (function () {
                                function MathExpressionEngine() {
                                    this.varResolver = function (potentialVarName) {
                                        if (potentialVarName.equals("PI")) {
                                            return Math.PI;
                                        }
                                        if (potentialVarName.equals("TRUE")) {
                                            return 1.0;
                                        }
                                        if (potentialVarName.equals("FALSE")) {
                                            return 0.0;
                                        }
                                        return null;
                                    };
                                }
                                MathExpressionEngine.isNumber = function (st) {
                                    return !isNaN(+st);
                                };
                                MathExpressionEngine.isDigit = function (c) {
                                    var cc = c.charCodeAt(0);
                                    if (cc >= 0x30 && cc <= 0x39) {
                                        return true;
                                    }
                                    return false;
                                };
                                MathExpressionEngine.isLetter = function (c) {
                                    var cc = c.charCodeAt(0);
                                    if ((cc >= 0x41 && cc <= 0x5A) || (cc >= 0x61 && cc <= 0x7A)) {
                                        return true;
                                    }
                                    return false;
                                };
                                MathExpressionEngine.isWhitespace = function (c) {
                                    var cc = c.charCodeAt(0);
                                    if ((cc >= 0x0009 && cc <= 0x000D) || (cc == 0x0020) || (cc == 0x0085) || (cc == 0x00A0)) {
                                        return true;
                                    }
                                    return false;
                                };
                                MathExpressionEngine.prototype.shuntingYard = function (expression) {
                                    var outputQueue = new java.util.ArrayList();
                                    var stack = new java.util.Stack();
                                    var tokenizer = new org.kevoree.modeling.util.maths.expression.impl.MathExpressionTokenizer(expression);
                                    var lastFunction = null;
                                    var previousToken = null;
                                    while (tokenizer.hasNext()) {
                                        var token = tokenizer.next();
                                        if (org.kevoree.modeling.util.maths.expression.impl.MathExpressionEngine.isNumber(token)) {
                                            outputQueue.add(token);
                                        }
                                        else {
                                            if (this.varResolver(token) != null) {
                                                outputQueue.add(token);
                                            }
                                            else {
                                                if (org.kevoree.modeling.util.maths.expression.impl.MathEntities.getINSTANCE().functions.contains(token.toUpperCase())) {
                                                    stack.push(token);
                                                    lastFunction = token;
                                                }
                                                else {
                                                    if (org.kevoree.modeling.util.maths.expression.impl.MathExpressionEngine.isLetter(token.charAt(0))) {
                                                        stack.push(token);
                                                    }
                                                    else {
                                                        if (",".equals(token)) {
                                                            while (!stack.isEmpty() && !"(".equals(stack.peek())) {
                                                                outputQueue.add(stack.pop());
                                                            }
                                                            if (stack.isEmpty()) {
                                                                throw new java.lang.RuntimeException("Parse error for function '" + lastFunction + "'");
                                                            }
                                                        }
                                                        else {
                                                            if (org.kevoree.modeling.util.maths.expression.impl.MathEntities.getINSTANCE().operators.contains(token)) {
                                                                var o1 = org.kevoree.modeling.util.maths.expression.impl.MathEntities.getINSTANCE().operators.get(token);
                                                                var token2 = stack.isEmpty() ? null : stack.peek();
                                                                while (org.kevoree.modeling.util.maths.expression.impl.MathEntities.getINSTANCE().operators.contains(token2) && ((o1.isLeftAssoc() && o1.getPrecedence() <= org.kevoree.modeling.util.maths.expression.impl.MathEntities.getINSTANCE().operators.get(token2).getPrecedence()) || (o1.getPrecedence() < org.kevoree.modeling.util.maths.expression.impl.MathEntities.getINSTANCE().operators.get(token2).getPrecedence()))) {
                                                                    outputQueue.add(stack.pop());
                                                                    token2 = stack.isEmpty() ? null : stack.peek();
                                                                }
                                                                stack.push(token);
                                                            }
                                                            else {
                                                                if ("(".equals(token)) {
                                                                    if (previousToken != null) {
                                                                        if (org.kevoree.modeling.util.maths.expression.impl.MathExpressionEngine.isNumber(previousToken)) {
                                                                            throw new java.lang.RuntimeException("Missing operator at character position " + tokenizer.getPos());
                                                                        }
                                                                    }
                                                                    stack.push(token);
                                                                }
                                                                else {
                                                                    if (")".equals(token)) {
                                                                        while (!stack.isEmpty() && !"(".equals(stack.peek())) {
                                                                            outputQueue.add(stack.pop());
                                                                        }
                                                                        if (stack.isEmpty()) {
                                                                            throw new java.lang.RuntimeException("Mismatched parentheses");
                                                                        }
                                                                        stack.pop();
                                                                        if (!stack.isEmpty() && org.kevoree.modeling.util.maths.expression.impl.MathEntities.getINSTANCE().functions.contains(stack.peek().toUpperCase())) {
                                                                            outputQueue.add(stack.pop());
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        previousToken = token;
                                    }
                                    while (!stack.isEmpty()) {
                                        var element = stack.pop();
                                        if ("(".equals(element) || ")".equals(element)) {
                                            throw new java.lang.RuntimeException("Mismatched parentheses");
                                        }
                                        if (!org.kevoree.modeling.util.maths.expression.impl.MathEntities.getINSTANCE().operators.contains(element)) {
                                            throw new java.lang.RuntimeException("Unknown operator or function: " + element);
                                        }
                                        outputQueue.add(element);
                                    }
                                    return outputQueue;
                                };
                                MathExpressionEngine.prototype.eval = function (p_expression) {
                                    var rpn = this.shuntingYard(p_expression);
                                    var stack = new java.util.Stack();
                                    for (var ii = 0; ii < rpn.size(); ii++) {
                                        var token = rpn.get(ii);
                                        if (org.kevoree.modeling.util.maths.expression.impl.MathEntities.getINSTANCE().operators.contains(token)) {
                                            var v1 = stack.pop();
                                            var v2 = stack.pop();
                                            stack.push(org.kevoree.modeling.util.maths.expression.impl.MathEntities.getINSTANCE().operators.get(token).eval(v2, v1));
                                        }
                                        else {
                                            if (this.varResolver(token) != null) {
                                                stack.push(this.varResolver(token));
                                            }
                                            else {
                                                if (org.kevoree.modeling.util.maths.expression.impl.MathEntities.getINSTANCE().functions.contains(token.toUpperCase())) {
                                                    var f = org.kevoree.modeling.util.maths.expression.impl.MathEntities.getINSTANCE().functions.get(token.toUpperCase());
                                                    var p = new Array();
                                                    for (var i = f.getNumParams() - 1; i >= 0; i--) {
                                                        p[i] = stack.pop();
                                                    }
                                                    var fResult = f.eval(p);
                                                    stack.push(fResult);
                                                }
                                                else {
                                                    stack.push(java.lang.Double.parseDouble(token));
                                                }
                                            }
                                        }
                                    }
                                    return stack.pop();
                                };
                                MathExpressionEngine.prototype.setVarResolver = function (p_resolver) {
                                    this.varResolver = p_resolver;
                                };
                                MathExpressionEngine.decimalSeparator = '.';
                                MathExpressionEngine.minusSign = '-';
                                return MathExpressionEngine;
                            })();
                            impl.MathExpressionEngine = MathExpressionEngine;
                            var MathExpressionTokenizer = (function () {
                                function MathExpressionTokenizer(input) {
                                    this.pos = 0;
                                    this.input = input.trim();
                                }
                                MathExpressionTokenizer.prototype.hasNext = function () {
                                    return (this.pos < this.input.length);
                                };
                                MathExpressionTokenizer.prototype.peekNextChar = function () {
                                    if (this.pos < (this.input.length - 1)) {
                                        return this.input.charAt(this.pos + 1);
                                    }
                                    else {
                                        return '\0';
                                    }
                                };
                                MathExpressionTokenizer.prototype.next = function () {
                                    var token = new java.lang.StringBuilder();
                                    if (this.pos >= this.input.length) {
                                        return this.previousToken = null;
                                    }
                                    var ch = this.input.charAt(this.pos);
                                    while (org.kevoree.modeling.util.maths.expression.impl.MathExpressionEngine.isWhitespace(ch) && this.pos < this.input.length) {
                                        ch = this.input.charAt(++this.pos);
                                    }
                                    if (org.kevoree.modeling.util.maths.expression.impl.MathExpressionEngine.isDigit(ch)) {
                                        while ((org.kevoree.modeling.util.maths.expression.impl.MathExpressionEngine.isDigit(ch) || ch == org.kevoree.modeling.util.maths.expression.impl.MathExpressionEngine.decimalSeparator) && (this.pos < this.input.length)) {
                                            token.append(this.input.charAt(this.pos++));
                                            ch = this.pos == this.input.length ? '\0' : this.input.charAt(this.pos);
                                        }
                                    }
                                    else {
                                        if (ch == org.kevoree.modeling.util.maths.expression.impl.MathExpressionEngine.minusSign && org.kevoree.modeling.util.maths.expression.impl.MathExpressionEngine.isDigit(this.peekNextChar()) && ("(".equals(this.previousToken) || ",".equals(this.previousToken) || this.previousToken == null || org.kevoree.modeling.util.maths.expression.impl.MathEntities.getINSTANCE().operators.contains(this.previousToken))) {
                                            token.append(org.kevoree.modeling.util.maths.expression.impl.MathExpressionEngine.minusSign);
                                            this.pos++;
                                            token.append(this.next());
                                        }
                                        else {
                                            if (org.kevoree.modeling.util.maths.expression.impl.MathExpressionEngine.isLetter(ch) || (ch == '_')) {
                                                while ((org.kevoree.modeling.util.maths.expression.impl.MathExpressionEngine.isLetter(ch) || org.kevoree.modeling.util.maths.expression.impl.MathExpressionEngine.isDigit(ch) || (ch == '_')) && (this.pos < this.input.length)) {
                                                    token.append(this.input.charAt(this.pos++));
                                                    ch = this.pos == this.input.length ? '\0' : this.input.charAt(this.pos);
                                                }
                                            }
                                            else {
                                                if (ch == '(' || ch == ')' || ch == ',') {
                                                    token.append(ch);
                                                    this.pos++;
                                                }
                                                else {
                                                    while (!org.kevoree.modeling.util.maths.expression.impl.MathExpressionEngine.isLetter(ch) && !org.kevoree.modeling.util.maths.expression.impl.MathExpressionEngine.isDigit(ch) && ch != '_' && !org.kevoree.modeling.util.maths.expression.impl.MathExpressionEngine.isWhitespace(ch) && ch != '(' && ch != ')' && ch != ',' && (this.pos < this.input.length)) {
                                                        token.append(this.input.charAt(this.pos));
                                                        this.pos++;
                                                        ch = this.pos == this.input.length ? '\0' : this.input.charAt(this.pos);
                                                        if (ch == org.kevoree.modeling.util.maths.expression.impl.MathExpressionEngine.minusSign) {
                                                            break;
                                                        }
                                                    }
                                                    if (!org.kevoree.modeling.util.maths.expression.impl.MathEntities.getINSTANCE().operators.contains(token.toString())) {
                                                        throw new java.lang.RuntimeException("Unknown operator '" + token + "' at position " + (this.pos - token.length + 1));
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    return this.previousToken = token.toString();
                                };
                                MathExpressionTokenizer.prototype.getPos = function () {
                                    return this.pos;
                                };
                                return MathExpressionTokenizer;
                            })();
                            impl.MathExpressionTokenizer = MathExpressionTokenizer;
                            var MathFunction = (function () {
                                function MathFunction(name, numParams) {
                                    this.name = name.toUpperCase();
                                    this.numParams = numParams;
                                }
                                MathFunction.prototype.getName = function () {
                                    return this.name;
                                };
                                MathFunction.prototype.getNumParams = function () {
                                    return this.numParams;
                                };
                                MathFunction.prototype.eval = function (p) {
                                    if (this.name.equals("NOT")) {
                                        return (p[0] == 0) ? 1 : 0;
                                    }
                                    else {
                                        if (this.name.equals("IF")) {
                                            return !(p[0] == 0) ? p[1] : p[2];
                                        }
                                        else {
                                            if (this.name.equals("RAND")) {
                                                return Math.random();
                                            }
                                            else {
                                                if (this.name.equals("SIN")) {
                                                    return Math.sin(p[0]);
                                                }
                                                else {
                                                    if (this.name.equals("COS")) {
                                                        return Math.cos(p[0]);
                                                    }
                                                    else {
                                                        if (this.name.equals("TAN")) {
                                                            return Math.tan(p[0]);
                                                        }
                                                        else {
                                                            if (this.name.equals("ASIN")) {
                                                                return Math.asin(p[0]);
                                                            }
                                                            else {
                                                                if (this.name.equals("ACOS")) {
                                                                    return Math.acos(p[0]);
                                                                }
                                                                else {
                                                                    if (this.name.equals("ATAN")) {
                                                                        return Math.atan(p[0]);
                                                                    }
                                                                    else {
                                                                        if (this.name.equals("MAX")) {
                                                                            return p[0] > p[1] ? p[0] : p[1];
                                                                        }
                                                                        else {
                                                                            if (this.name.equals("MIN")) {
                                                                                return p[0] < p[1] ? p[0] : p[1];
                                                                            }
                                                                            else {
                                                                                if (this.name.equals("ABS")) {
                                                                                    return Math.abs(p[0]);
                                                                                }
                                                                                else {
                                                                                    if (this.name.equals("LOG")) {
                                                                                        return Math.log(p[0]);
                                                                                    }
                                                                                    else {
                                                                                        if (this.name.equals("ROUND")) {
                                                                                        }
                                                                                        else {
                                                                                            if (this.name.equals("FLOOR")) {
                                                                                            }
                                                                                            else {
                                                                                                if (this.name.equals("CEILING")) {
                                                                                                }
                                                                                                else {
                                                                                                    if (this.name.equals("SQRT")) {
                                                                                                        return Math.sqrt(p[0]);
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
                                    return 0;
                                };
                                return MathFunction;
                            })();
                            impl.MathFunction = MathFunction;
                            var MathOperation = (function () {
                                function MathOperation(oper, precedence, leftAssoc) {
                                    this.oper = oper;
                                    this.precedence = precedence;
                                    this.leftAssoc = leftAssoc;
                                }
                                MathOperation.prototype.getOper = function () {
                                    return this.oper;
                                };
                                MathOperation.prototype.getPrecedence = function () {
                                    return this.precedence;
                                };
                                MathOperation.prototype.isLeftAssoc = function () {
                                    return this.leftAssoc;
                                };
                                MathOperation.prototype.eval = function (v1, v2) {
                                    if (this.oper.equals("+")) {
                                        return v1 + v2;
                                    }
                                    else {
                                        if (this.oper.equals("-")) {
                                            return v1 - v2;
                                        }
                                        else {
                                            if (this.oper.equals("*")) {
                                                return v1 * v2;
                                            }
                                            else {
                                                if (this.oper.equals("/")) {
                                                    return v1 / v2;
                                                }
                                                else {
                                                    if (this.oper.equals("%")) {
                                                        return v1 % v2;
                                                    }
                                                    else {
                                                        if (this.oper.equals("^")) {
                                                            return Math.pow(v1, v2);
                                                        }
                                                        else {
                                                            if (this.oper.equals("&&")) {
                                                                var b1 = !(v1 == 0);
                                                                var b2 = !(v2 == 0);
                                                                return b1 && b2 ? 1 : 0;
                                                            }
                                                            else {
                                                                if (this.oper.equals("||")) {
                                                                    var b1 = !(v1 == 0);
                                                                    var b2 = !(v2 == 0);
                                                                    return b1 || b2 ? 1 : 0;
                                                                }
                                                                else {
                                                                    if (this.oper.equals(">")) {
                                                                        return v1 > v2 ? 1 : 0;
                                                                    }
                                                                    else {
                                                                        if (this.oper.equals(">=")) {
                                                                            return v1 >= v2 ? 1 : 0;
                                                                        }
                                                                        else {
                                                                            if (this.oper.equals("<")) {
                                                                                return v1 < v2 ? 1 : 0;
                                                                            }
                                                                            else {
                                                                                if (this.oper.equals("<=")) {
                                                                                    return v1 <= v2 ? 1 : 0;
                                                                                }
                                                                                else {
                                                                                    if (this.oper.equals("==")) {
                                                                                        return v1 == v2 ? 1 : 0;
                                                                                    }
                                                                                    else {
                                                                                        if (this.oper.equals("!=")) {
                                                                                            return v1 != v2 ? 1 : 0;
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
                                    return 0;
                                };
                                return MathOperation;
                            })();
                            impl.MathOperation = MathOperation;
                        })(impl = expression_1.impl || (expression_1.impl = {}));
                    })(expression = maths.expression || (maths.expression = {}));
                    var structure;
                    (function (structure) {
                        var impl;
                        (function (impl) {
                            var Array1D = (function () {
                                function Array1D(p_size, p_offset, p_segmentIndex, p_segment, p_metaClass) {
                                    this._size = p_size;
                                    this._offset = p_offset;
                                    this._segmentIndex = p_segmentIndex;
                                    this._segment = p_segment;
                                    this._metaClass = p_metaClass;
                                }
                                Array1D.prototype.size = function () {
                                    return this._size;
                                };
                                Array1D.prototype.get = function (p_index) {
                                    return this._segment.getInferElem(this._segmentIndex, this._offset + p_index, this._metaClass);
                                };
                                Array1D.prototype.set = function (p_index, p_value) {
                                    this._segment.setInferElem(this._segmentIndex, this._offset + p_index, p_value, this._metaClass);
                                    return p_value;
                                };
                                Array1D.prototype.add = function (index, value) {
                                    return this.set(index, this.get(index) + value);
                                };
                                return Array1D;
                            })();
                            impl.Array1D = Array1D;
                            var Array2D = (function () {
                                function Array2D(p_nbRows, p_nbColumns, p_offset, p_segmentIndex, p_segment, p_metaClass) {
                                    this._nbRows = p_nbRows;
                                    this._nbColumns = p_nbColumns;
                                    this._offset = p_offset;
                                    this._segment = p_segment;
                                    this._segmentIndex = p_segmentIndex;
                                    this._metaClass = p_metaClass;
                                }
                                Array2D.prototype.nbRows = function () {
                                    return this._nbRows;
                                };
                                Array2D.prototype.nbColumns = function () {
                                    return this._nbColumns;
                                };
                                Array2D.prototype.get = function (p_rowIndex, p_columnIndex) {
                                    return this._segment.getInferElem(this._segmentIndex, this._offset + (p_rowIndex * this._nbColumns) + p_columnIndex, this._metaClass);
                                };
                                Array2D.prototype.set = function (p_rowIndex, p_columnIndex, value) {
                                    this._segment.setInferElem(this._segmentIndex, this._offset + (p_rowIndex * this._nbColumns) + p_columnIndex, value, this._metaClass);
                                    return value;
                                };
                                Array2D.prototype.add = function (rawIndex, columnIndex, value) {
                                    return this.set(rawIndex, columnIndex, this.get(rawIndex, columnIndex) + value);
                                };
                                return Array2D;
                            })();
                            impl.Array2D = Array2D;
                            var Array3D = (function () {
                                function Array3D(p_nbrows, p_nbColumns, p_nbDeeps, p_offset, p_segmentIndex, p_segment, p_metaClass) {
                                    this._nbrows = p_nbrows;
                                    this._nbColumns = p_nbColumns;
                                    this._nbDeeps = p_nbDeeps;
                                    this._offset = p_offset;
                                    this._segmentIndex = p_segmentIndex;
                                    this._segment = p_segment;
                                    this._metaClass = p_metaClass;
                                }
                                Array3D.prototype.nbRows = function () {
                                    return this._nbrows;
                                };
                                Array3D.prototype.nbColumns = function () {
                                    return this._nbColumns;
                                };
                                Array3D.prototype.nbDeeps = function () {
                                    return this._nbDeeps;
                                };
                                Array3D.prototype.get = function (p_rowIndex, p_columnIndex, p_deepIndex) {
                                    return this._segment.getInferElem(this._segmentIndex, this._offset + p_rowIndex * (this._nbColumns * this._nbDeeps) + p_columnIndex * this._nbDeeps + p_deepIndex, this._metaClass);
                                };
                                Array3D.prototype.set = function (p_rowIndex, p_columnIndex, p_deepIndex, p_value) {
                                    this._segment.setInferElem(this._segmentIndex, this._offset + p_rowIndex * (this._nbColumns * this._nbDeeps) + p_columnIndex * this._nbDeeps + p_deepIndex, p_value, this._metaClass);
                                    return p_value;
                                };
                                Array3D.prototype.add = function (p_rowIndex, p_columnIndex, p_deepIndex, value) {
                                    return this.set(p_rowIndex, p_columnIndex, p_deepIndex, this.get(p_rowIndex, p_columnIndex, p_deepIndex) + value);
                                };
                                return Array3D;
                            })();
                            impl.Array3D = Array3D;
                        })(impl = structure.impl || (structure.impl = {}));
                    })(structure = maths.structure || (maths.structure = {}));
                })(maths = util.maths || (util.maths = {}));
            })(util = modeling.util || (modeling.util = {}));
        })(modeling = kevoree.modeling || (kevoree.modeling = {}));
    })(kevoree = org.kevoree || (org.kevoree = {}));
})(org || (org = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var org;
(function (org) {
    var kubi;
    (function (kubi) {
        var KubiModel = (function (_super) {
            __extends(KubiModel, _super);
            function KubiModel() {
                _super.call(this);
                this._metaModel = new org.kevoree.modeling.meta.impl.MetaModel("Kubi");
                var tempMetaClasses = new Array();
                tempMetaClasses[1] = org.kubi.meta.MetaGroup.getInstance();
                tempMetaClasses[0] = org.kubi.meta.MetaEcosystem.getInstance();
                tempMetaClasses[15] = org.kubi.zwave.meta.MetaParameter.getInstance();
                tempMetaClasses[16] = org.kubi.zwave.meta.MetaAssociation.getInstance();
                tempMetaClasses[18] = org.kubi.zwave.meta.MetaAssociationGroup.getInstance();
                tempMetaClasses[10] = org.kubi.meta.MetaSimulatedSwitchParameter.getInstance();
                tempMetaClasses[3] = org.kubi.meta.MetaDevice.getInstance();
                tempMetaClasses[5] = org.kubi.meta.MetaActionParameter.getInstance();
                tempMetaClasses[8] = org.kubi.meta.MetaSimulatedParameter.getInstance();
                tempMetaClasses[14] = org.kubi.zwave.meta.MetaCommandClass.getInstance();
                tempMetaClasses[4] = org.kubi.meta.MetaStateParameter.getInstance();
                tempMetaClasses[12] = org.kubi.meta.MetaProduct.getInstance();
                tempMetaClasses[2] = org.kubi.meta.MetaTechnology.getInstance();
                tempMetaClasses[6] = org.kubi.meta.MetaPeriod.getInstance();
                tempMetaClasses[13] = org.kubi.meta.MetaZWaveProduct.getInstance();
                tempMetaClasses[9] = org.kubi.meta.MetaSimulatedLightParameter.getInstance();
                tempMetaClasses[7] = org.kubi.meta.MetaCatalog.getInstance();
                tempMetaClasses[11] = org.kubi.meta.MetaManufacturer.getInstance();
                tempMetaClasses[17] = org.kubi.zwave.meta.MetaParameterItem.getInstance();
                this._metaModel.init(tempMetaClasses);
            }
            KubiModel.prototype.internalCreateUniverse = function (key) {
                return new org.kubi.KubiUniverse(key, this._manager);
            };
            KubiModel.prototype.metaModel = function () {
                return this._metaModel;
            };
            KubiModel.prototype.internalCreateObject = function (universe, time, uuid, p_clazz) {
                if (p_clazz == null) {
                    return null;
                }
                switch (p_clazz.index()) {
                    case 1:
                        return new org.kubi.impl.GroupImpl(universe, time, uuid, p_clazz, this._manager);
                    case 0:
                        return new org.kubi.impl.EcosystemImpl(universe, time, uuid, p_clazz, this._manager);
                    case 15:
                        return new org.kubi.zwave.impl.ParameterImpl(universe, time, uuid, p_clazz, this._manager);
                    case 16:
                        return new org.kubi.zwave.impl.AssociationImpl(universe, time, uuid, p_clazz, this._manager);
                    case 18:
                        return new org.kubi.zwave.impl.AssociationGroupImpl(universe, time, uuid, p_clazz, this._manager);
                    case 10:
                        return new org.kubi.impl.SimulatedSwitchParameterImpl(universe, time, uuid, p_clazz, this._manager);
                    case 3:
                        return new org.kubi.impl.DeviceImpl(universe, time, uuid, p_clazz, this._manager);
                    case 5:
                        return new org.kubi.impl.ActionParameterImpl(universe, time, uuid, p_clazz, this._manager);
                    case 8:
                        return new org.kubi.impl.SimulatedParameterImpl(universe, time, uuid, p_clazz, this._manager);
                    case 14:
                        return new org.kubi.zwave.impl.CommandClassImpl(universe, time, uuid, p_clazz, this._manager);
                    case 4:
                        return new org.kubi.impl.StateParameterImpl(universe, time, uuid, p_clazz, this._manager);
                    case 12:
                        return new org.kubi.impl.ProductImpl(universe, time, uuid, p_clazz, this._manager);
                    case 2:
                        return new org.kubi.impl.TechnologyImpl(universe, time, uuid, p_clazz, this._manager);
                    case 6:
                        return new org.kubi.impl.PeriodImpl(universe, time, uuid, p_clazz, this._manager);
                    case 13:
                        return new org.kubi.impl.ZWaveProductImpl(universe, time, uuid, p_clazz, this._manager);
                    case 9:
                        return new org.kubi.impl.SimulatedLightParameterImpl(universe, time, uuid, p_clazz, this._manager);
                    case 7:
                        return new org.kubi.impl.CatalogImpl(universe, time, uuid, p_clazz, this._manager);
                    case 11:
                        return new org.kubi.impl.ManufacturerImpl(universe, time, uuid, p_clazz, this._manager);
                    case 17:
                        return new org.kubi.zwave.impl.ParameterItemImpl(universe, time, uuid, p_clazz, this._manager);
                    default:
                        return new org.kevoree.modeling.meta.impl.GenericObject(universe, time, uuid, p_clazz, this._manager);
                }
            };
            KubiModel.prototype.createGroup = function (universe, time) {
                return this.create(org.kubi.meta.MetaGroup.getInstance(), universe, time);
            };
            KubiModel.prototype.createEcosystem = function (universe, time) {
                return this.create(org.kubi.meta.MetaEcosystem.getInstance(), universe, time);
            };
            KubiModel.prototype.createParameter = function (universe, time) {
                return this.create(org.kubi.zwave.meta.MetaParameter.getInstance(), universe, time);
            };
            KubiModel.prototype.createAssociation = function (universe, time) {
                return this.create(org.kubi.zwave.meta.MetaAssociation.getInstance(), universe, time);
            };
            KubiModel.prototype.createAssociationGroup = function (universe, time) {
                return this.create(org.kubi.zwave.meta.MetaAssociationGroup.getInstance(), universe, time);
            };
            KubiModel.prototype.createSimulatedSwitchParameter = function (universe, time) {
                return this.create(org.kubi.meta.MetaSimulatedSwitchParameter.getInstance(), universe, time);
            };
            KubiModel.prototype.createDevice = function (universe, time) {
                return this.create(org.kubi.meta.MetaDevice.getInstance(), universe, time);
            };
            KubiModel.prototype.createActionParameter = function (universe, time) {
                return this.create(org.kubi.meta.MetaActionParameter.getInstance(), universe, time);
            };
            KubiModel.prototype.createSimulatedParameter = function (universe, time) {
                return this.create(org.kubi.meta.MetaSimulatedParameter.getInstance(), universe, time);
            };
            KubiModel.prototype.createCommandClass = function (universe, time) {
                return this.create(org.kubi.zwave.meta.MetaCommandClass.getInstance(), universe, time);
            };
            KubiModel.prototype.createStateParameter = function (universe, time) {
                return this.create(org.kubi.meta.MetaStateParameter.getInstance(), universe, time);
            };
            KubiModel.prototype.createProduct = function (universe, time) {
                return this.create(org.kubi.meta.MetaProduct.getInstance(), universe, time);
            };
            KubiModel.prototype.createTechnology = function (universe, time) {
                return this.create(org.kubi.meta.MetaTechnology.getInstance(), universe, time);
            };
            KubiModel.prototype.createPeriod = function (universe, time) {
                return this.create(org.kubi.meta.MetaPeriod.getInstance(), universe, time);
            };
            KubiModel.prototype.createZWaveProduct = function (universe, time) {
                return this.create(org.kubi.meta.MetaZWaveProduct.getInstance(), universe, time);
            };
            KubiModel.prototype.createSimulatedLightParameter = function (universe, time) {
                return this.create(org.kubi.meta.MetaSimulatedLightParameter.getInstance(), universe, time);
            };
            KubiModel.prototype.createCatalog = function (universe, time) {
                return this.create(org.kubi.meta.MetaCatalog.getInstance(), universe, time);
            };
            KubiModel.prototype.createManufacturer = function (universe, time) {
                return this.create(org.kubi.meta.MetaManufacturer.getInstance(), universe, time);
            };
            KubiModel.prototype.createParameterItem = function (universe, time) {
                return this.create(org.kubi.zwave.meta.MetaParameterItem.getInstance(), universe, time);
            };
            return KubiModel;
        })(org.kevoree.modeling.abs.AbstractKModel);
        kubi.KubiModel = KubiModel;
        var KubiUniverse = (function (_super) {
            __extends(KubiUniverse, _super);
            function KubiUniverse(p_key, p_manager) {
                _super.call(this, p_key, p_manager);
            }
            KubiUniverse.prototype.internal_create = function (timePoint) {
                return new org.kubi.impl.KubiViewImpl(this._universe, timePoint, this._manager);
            };
            return KubiUniverse;
        })(org.kevoree.modeling.abs.AbstractKUniverse);
        kubi.KubiUniverse = KubiUniverse;
        var ParameterType = (function () {
            function ParameterType() {
            }
            ParameterType.prototype.equals = function (other) {
                return this == other;
            };
            ParameterType.values = function () {
                return ParameterType._ParameterTypeVALUES;
            };
            ParameterType.BOOL = new ParameterType();
            ParameterType.BUTTON = new ParameterType();
            ParameterType.BYTE = new ParameterType();
            ParameterType.DECIMAL = new ParameterType();
            ParameterType.INT = new ParameterType();
            ParameterType.LIST = new ParameterType();
            ParameterType.SHORT = new ParameterType();
            ParameterType.STRING = new ParameterType();
            ParameterType._ParameterTypeVALUES = [
                ParameterType.BOOL,
                ParameterType.BUTTON,
                ParameterType.BYTE,
                ParameterType.DECIMAL,
                ParameterType.INT,
                ParameterType.LIST,
                ParameterType.SHORT,
                ParameterType.STRING
            ];
            return ParameterType;
        })();
        kubi.ParameterType = ParameterType;
        var impl;
        (function (impl) {
            var ActionParameterImpl = (function (_super) {
                __extends(ActionParameterImpl, _super);
                function ActionParameterImpl(p_universe, p_time, p_uuid, p_metaClass, p_manager) {
                    _super.call(this, p_universe, p_time, p_uuid, p_metaClass, p_manager);
                }
                ActionParameterImpl.prototype.getUnit = function () {
                    return this.get(org.kubi.meta.MetaActionParameter.ATT_UNIT);
                };
                ActionParameterImpl.prototype.setUnit = function (p_obj) {
                    this.set(org.kubi.meta.MetaActionParameter.ATT_UNIT, p_obj);
                    return this;
                };
                ActionParameterImpl.prototype.getDesired = function () {
                    return this.get(org.kubi.meta.MetaActionParameter.ATT_DESIRED);
                };
                ActionParameterImpl.prototype.setDesired = function (p_obj) {
                    this.set(org.kubi.meta.MetaActionParameter.ATT_DESIRED, p_obj);
                    return this;
                };
                ActionParameterImpl.prototype.getValueType = function () {
                    return this.get(org.kubi.meta.MetaActionParameter.ATT_VALUETYPE);
                };
                ActionParameterImpl.prototype.setValueType = function (p_obj) {
                    this.set(org.kubi.meta.MetaActionParameter.ATT_VALUETYPE, p_obj);
                    return this;
                };
                ActionParameterImpl.prototype.getPrecision = function () {
                    return this.get(org.kubi.meta.MetaActionParameter.ATT_PRECISION);
                };
                ActionParameterImpl.prototype.setPrecision = function (p_obj) {
                    this.set(org.kubi.meta.MetaActionParameter.ATT_PRECISION, p_obj);
                    return this;
                };
                ActionParameterImpl.prototype.getName = function () {
                    return this.get(org.kubi.meta.MetaActionParameter.ATT_NAME);
                };
                ActionParameterImpl.prototype.setName = function (p_obj) {
                    this.set(org.kubi.meta.MetaActionParameter.ATT_NAME, p_obj);
                    return this;
                };
                ActionParameterImpl.prototype.getRange = function () {
                    return this.get(org.kubi.meta.MetaActionParameter.ATT_RANGE);
                };
                ActionParameterImpl.prototype.setRange = function (p_obj) {
                    this.set(org.kubi.meta.MetaActionParameter.ATT_RANGE, p_obj);
                    return this;
                };
                ActionParameterImpl.prototype.getValue = function () {
                    return this.get(org.kubi.meta.MetaActionParameter.ATT_VALUE);
                };
                ActionParameterImpl.prototype.setValue = function (p_obj) {
                    this.set(org.kubi.meta.MetaActionParameter.ATT_VALUE, p_obj);
                    return this;
                };
                ActionParameterImpl.prototype.setPeriod = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.SET, org.kubi.meta.MetaActionParameter.REF_PERIOD, p_obj);
                    return this;
                };
                ActionParameterImpl.prototype.getPeriod = function (cb) {
                    if (cb == null) {
                        return;
                    }
                    this.ref(org.kubi.meta.MetaActionParameter.REF_PERIOD, function (kObjects) {
                        if (kObjects.length > 0) {
                            cb(kObjects[0]);
                        }
                        else {
                            cb(null);
                        }
                    });
                };
                return ActionParameterImpl;
            })(org.kevoree.modeling.abs.AbstractKObject);
            impl.ActionParameterImpl = ActionParameterImpl;
            var CatalogImpl = (function (_super) {
                __extends(CatalogImpl, _super);
                function CatalogImpl(p_universe, p_time, p_uuid, p_metaClass, p_manager) {
                    _super.call(this, p_universe, p_time, p_uuid, p_metaClass, p_manager);
                }
                CatalogImpl.prototype.addManufacturers = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.ADD, org.kubi.meta.MetaCatalog.REF_MANUFACTURERS, p_obj);
                    return this;
                };
                CatalogImpl.prototype.removeManufacturers = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.REMOVE, org.kubi.meta.MetaCatalog.REF_MANUFACTURERS, p_obj);
                    return this;
                };
                CatalogImpl.prototype.getManufacturers = function (cb) {
                    if (cb == null) {
                        return;
                    }
                    this.ref(org.kubi.meta.MetaCatalog.REF_MANUFACTURERS, function (kObjects) {
                        var casted = new Array();
                        for (var i = 0; i < kObjects.length; i++) {
                            casted[i] = kObjects[i];
                        }
                        cb(casted);
                    });
                };
                CatalogImpl.prototype.sizeOfManufacturers = function () {
                    return this.size(org.kubi.meta.MetaCatalog.REF_MANUFACTURERS);
                };
                return CatalogImpl;
            })(org.kevoree.modeling.abs.AbstractKObject);
            impl.CatalogImpl = CatalogImpl;
            var DeviceImpl = (function (_super) {
                __extends(DeviceImpl, _super);
                function DeviceImpl(p_universe, p_time, p_uuid, p_metaClass, p_manager) {
                    _super.call(this, p_universe, p_time, p_uuid, p_metaClass, p_manager);
                }
                DeviceImpl.prototype.getName = function () {
                    return this.get(org.kubi.meta.MetaDevice.ATT_NAME);
                };
                DeviceImpl.prototype.setName = function (p_obj) {
                    this.set(org.kubi.meta.MetaDevice.ATT_NAME, p_obj);
                    return this;
                };
                DeviceImpl.prototype.getId = function () {
                    return this.get(org.kubi.meta.MetaDevice.ATT_ID);
                };
                DeviceImpl.prototype.setId = function (p_obj) {
                    this.set(org.kubi.meta.MetaDevice.ATT_ID, p_obj);
                    return this;
                };
                DeviceImpl.prototype.getHomeId = function () {
                    return this.get(org.kubi.meta.MetaDevice.ATT_HOMEID);
                };
                DeviceImpl.prototype.setHomeId = function (p_obj) {
                    this.set(org.kubi.meta.MetaDevice.ATT_HOMEID, p_obj);
                    return this;
                };
                DeviceImpl.prototype.getVersion = function () {
                    return this.get(org.kubi.meta.MetaDevice.ATT_VERSION);
                };
                DeviceImpl.prototype.setVersion = function (p_obj) {
                    this.set(org.kubi.meta.MetaDevice.ATT_VERSION, p_obj);
                    return this;
                };
                DeviceImpl.prototype.getPicture = function () {
                    return this.get(org.kubi.meta.MetaDevice.ATT_PICTURE);
                };
                DeviceImpl.prototype.setPicture = function (p_obj) {
                    this.set(org.kubi.meta.MetaDevice.ATT_PICTURE, p_obj);
                    return this;
                };
                DeviceImpl.prototype.getManufacturer = function () {
                    return this.get(org.kubi.meta.MetaDevice.ATT_MANUFACTURER);
                };
                DeviceImpl.prototype.setManufacturer = function (p_obj) {
                    this.set(org.kubi.meta.MetaDevice.ATT_MANUFACTURER, p_obj);
                    return this;
                };
                DeviceImpl.prototype.addGroupes = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.ADD, org.kubi.meta.MetaDevice.REF_GROUPES, p_obj);
                    return this;
                };
                DeviceImpl.prototype.removeGroupes = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.REMOVE, org.kubi.meta.MetaDevice.REF_GROUPES, p_obj);
                    return this;
                };
                DeviceImpl.prototype.getGroupes = function (cb) {
                    if (cb == null) {
                        return;
                    }
                    this.ref(org.kubi.meta.MetaDevice.REF_GROUPES, function (kObjects) {
                        var casted = new Array();
                        for (var i = 0; i < kObjects.length; i++) {
                            casted[i] = kObjects[i];
                        }
                        cb(casted);
                    });
                };
                DeviceImpl.prototype.sizeOfGroupes = function () {
                    return this.size(org.kubi.meta.MetaDevice.REF_GROUPES);
                };
                DeviceImpl.prototype.addActionParameters = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.ADD, org.kubi.meta.MetaDevice.REF_ACTIONPARAMETERS, p_obj);
                    return this;
                };
                DeviceImpl.prototype.removeActionParameters = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.REMOVE, org.kubi.meta.MetaDevice.REF_ACTIONPARAMETERS, p_obj);
                    return this;
                };
                DeviceImpl.prototype.getActionParameters = function (cb) {
                    if (cb == null) {
                        return;
                    }
                    this.ref(org.kubi.meta.MetaDevice.REF_ACTIONPARAMETERS, function (kObjects) {
                        var casted = new Array();
                        for (var i = 0; i < kObjects.length; i++) {
                            casted[i] = kObjects[i];
                        }
                        cb(casted);
                    });
                };
                DeviceImpl.prototype.sizeOfActionParameters = function () {
                    return this.size(org.kubi.meta.MetaDevice.REF_ACTIONPARAMETERS);
                };
                DeviceImpl.prototype.addStateParameters = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.ADD, org.kubi.meta.MetaDevice.REF_STATEPARAMETERS, p_obj);
                    return this;
                };
                DeviceImpl.prototype.removeStateParameters = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.REMOVE, org.kubi.meta.MetaDevice.REF_STATEPARAMETERS, p_obj);
                    return this;
                };
                DeviceImpl.prototype.getStateParameters = function (cb) {
                    if (cb == null) {
                        return;
                    }
                    this.ref(org.kubi.meta.MetaDevice.REF_STATEPARAMETERS, function (kObjects) {
                        var casted = new Array();
                        for (var i = 0; i < kObjects.length; i++) {
                            casted[i] = kObjects[i];
                        }
                        cb(casted);
                    });
                };
                DeviceImpl.prototype.sizeOfStateParameters = function () {
                    return this.size(org.kubi.meta.MetaDevice.REF_STATEPARAMETERS);
                };
                DeviceImpl.prototype.addLinks = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.ADD, org.kubi.meta.MetaDevice.REF_LINKS, p_obj);
                    return this;
                };
                DeviceImpl.prototype.removeLinks = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.REMOVE, org.kubi.meta.MetaDevice.REF_LINKS, p_obj);
                    return this;
                };
                DeviceImpl.prototype.getLinks = function (cb) {
                    if (cb == null) {
                        return;
                    }
                    this.ref(org.kubi.meta.MetaDevice.REF_LINKS, function (kObjects) {
                        var casted = new Array();
                        for (var i = 0; i < kObjects.length; i++) {
                            casted[i] = kObjects[i];
                        }
                        cb(casted);
                    });
                };
                DeviceImpl.prototype.sizeOfLinks = function () {
                    return this.size(org.kubi.meta.MetaDevice.REF_LINKS);
                };
                DeviceImpl.prototype.setTechnology = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.SET, org.kubi.meta.MetaDevice.REF_TECHNOLOGY, p_obj);
                    return this;
                };
                DeviceImpl.prototype.getTechnology = function (cb) {
                    if (cb == null) {
                        return;
                    }
                    this.ref(org.kubi.meta.MetaDevice.REF_TECHNOLOGY, function (kObjects) {
                        if (kObjects.length > 0) {
                            cb(kObjects[0]);
                        }
                        else {
                            cb(null);
                        }
                    });
                };
                return DeviceImpl;
            })(org.kevoree.modeling.abs.AbstractKObject);
            impl.DeviceImpl = DeviceImpl;
            var EcosystemImpl = (function (_super) {
                __extends(EcosystemImpl, _super);
                function EcosystemImpl(p_universe, p_time, p_uuid, p_metaClass, p_manager) {
                    _super.call(this, p_universe, p_time, p_uuid, p_metaClass, p_manager);
                }
                EcosystemImpl.prototype.getName = function () {
                    return this.get(org.kubi.meta.MetaEcosystem.ATT_NAME);
                };
                EcosystemImpl.prototype.setName = function (p_obj) {
                    this.set(org.kubi.meta.MetaEcosystem.ATT_NAME, p_obj);
                    return this;
                };
                EcosystemImpl.prototype.addGroupes = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.ADD, org.kubi.meta.MetaEcosystem.REF_GROUPES, p_obj);
                    return this;
                };
                EcosystemImpl.prototype.removeGroupes = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.REMOVE, org.kubi.meta.MetaEcosystem.REF_GROUPES, p_obj);
                    return this;
                };
                EcosystemImpl.prototype.getGroupes = function (cb) {
                    if (cb == null) {
                        return;
                    }
                    this.ref(org.kubi.meta.MetaEcosystem.REF_GROUPES, function (kObjects) {
                        var casted = new Array();
                        for (var i = 0; i < kObjects.length; i++) {
                            casted[i] = kObjects[i];
                        }
                        cb(casted);
                    });
                };
                EcosystemImpl.prototype.sizeOfGroupes = function () {
                    return this.size(org.kubi.meta.MetaEcosystem.REF_GROUPES);
                };
                EcosystemImpl.prototype.addTechnologies = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.ADD, org.kubi.meta.MetaEcosystem.REF_TECHNOLOGIES, p_obj);
                    return this;
                };
                EcosystemImpl.prototype.removeTechnologies = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.REMOVE, org.kubi.meta.MetaEcosystem.REF_TECHNOLOGIES, p_obj);
                    return this;
                };
                EcosystemImpl.prototype.getTechnologies = function (cb) {
                    if (cb == null) {
                        return;
                    }
                    this.ref(org.kubi.meta.MetaEcosystem.REF_TECHNOLOGIES, function (kObjects) {
                        var casted = new Array();
                        for (var i = 0; i < kObjects.length; i++) {
                            casted[i] = kObjects[i];
                        }
                        cb(casted);
                    });
                };
                EcosystemImpl.prototype.sizeOfTechnologies = function () {
                    return this.size(org.kubi.meta.MetaEcosystem.REF_TECHNOLOGIES);
                };
                return EcosystemImpl;
            })(org.kevoree.modeling.abs.AbstractKObject);
            impl.EcosystemImpl = EcosystemImpl;
            var GroupImpl = (function (_super) {
                __extends(GroupImpl, _super);
                function GroupImpl(p_universe, p_time, p_uuid, p_metaClass, p_manager) {
                    _super.call(this, p_universe, p_time, p_uuid, p_metaClass, p_manager);
                }
                GroupImpl.prototype.getName = function () {
                    return this.get(org.kubi.meta.MetaGroup.ATT_NAME);
                };
                GroupImpl.prototype.setName = function (p_obj) {
                    this.set(org.kubi.meta.MetaGroup.ATT_NAME, p_obj);
                    return this;
                };
                GroupImpl.prototype.addGroupes = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.ADD, org.kubi.meta.MetaGroup.REF_GROUPES, p_obj);
                    return this;
                };
                GroupImpl.prototype.removeGroupes = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.REMOVE, org.kubi.meta.MetaGroup.REF_GROUPES, p_obj);
                    return this;
                };
                GroupImpl.prototype.getGroupes = function (cb) {
                    if (cb == null) {
                        return;
                    }
                    this.ref(org.kubi.meta.MetaGroup.REF_GROUPES, function (kObjects) {
                        var casted = new Array();
                        for (var i = 0; i < kObjects.length; i++) {
                            casted[i] = kObjects[i];
                        }
                        cb(casted);
                    });
                };
                GroupImpl.prototype.sizeOfGroupes = function () {
                    return this.size(org.kubi.meta.MetaGroup.REF_GROUPES);
                };
                GroupImpl.prototype.addDevices = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.ADD, org.kubi.meta.MetaGroup.REF_DEVICES, p_obj);
                    return this;
                };
                GroupImpl.prototype.removeDevices = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.REMOVE, org.kubi.meta.MetaGroup.REF_DEVICES, p_obj);
                    return this;
                };
                GroupImpl.prototype.getDevices = function (cb) {
                    if (cb == null) {
                        return;
                    }
                    this.ref(org.kubi.meta.MetaGroup.REF_DEVICES, function (kObjects) {
                        var casted = new Array();
                        for (var i = 0; i < kObjects.length; i++) {
                            casted[i] = kObjects[i];
                        }
                        cb(casted);
                    });
                };
                GroupImpl.prototype.sizeOfDevices = function () {
                    return this.size(org.kubi.meta.MetaGroup.REF_DEVICES);
                };
                return GroupImpl;
            })(org.kevoree.modeling.abs.AbstractKObject);
            impl.GroupImpl = GroupImpl;
            var KubiViewImpl = (function (_super) {
                __extends(KubiViewImpl, _super);
                function KubiViewImpl(p_universe, _time, p_manager) {
                    _super.call(this, p_universe, _time, p_manager);
                }
                KubiViewImpl.prototype.createGroup = function () {
                    return this.create(org.kubi.meta.MetaGroup.getInstance());
                };
                KubiViewImpl.prototype.createEcosystem = function () {
                    return this.create(org.kubi.meta.MetaEcosystem.getInstance());
                };
                KubiViewImpl.prototype.createParameter = function () {
                    return this.create(org.kubi.zwave.meta.MetaParameter.getInstance());
                };
                KubiViewImpl.prototype.createAssociation = function () {
                    return this.create(org.kubi.zwave.meta.MetaAssociation.getInstance());
                };
                KubiViewImpl.prototype.createAssociationGroup = function () {
                    return this.create(org.kubi.zwave.meta.MetaAssociationGroup.getInstance());
                };
                KubiViewImpl.prototype.createSimulatedSwitchParameter = function () {
                    return this.create(org.kubi.meta.MetaSimulatedSwitchParameter.getInstance());
                };
                KubiViewImpl.prototype.createDevice = function () {
                    return this.create(org.kubi.meta.MetaDevice.getInstance());
                };
                KubiViewImpl.prototype.createActionParameter = function () {
                    return this.create(org.kubi.meta.MetaActionParameter.getInstance());
                };
                KubiViewImpl.prototype.createSimulatedParameter = function () {
                    return this.create(org.kubi.meta.MetaSimulatedParameter.getInstance());
                };
                KubiViewImpl.prototype.createCommandClass = function () {
                    return this.create(org.kubi.zwave.meta.MetaCommandClass.getInstance());
                };
                KubiViewImpl.prototype.createStateParameter = function () {
                    return this.create(org.kubi.meta.MetaStateParameter.getInstance());
                };
                KubiViewImpl.prototype.createProduct = function () {
                    return this.create(org.kubi.meta.MetaProduct.getInstance());
                };
                KubiViewImpl.prototype.createTechnology = function () {
                    return this.create(org.kubi.meta.MetaTechnology.getInstance());
                };
                KubiViewImpl.prototype.createPeriod = function () {
                    return this.create(org.kubi.meta.MetaPeriod.getInstance());
                };
                KubiViewImpl.prototype.createZWaveProduct = function () {
                    return this.create(org.kubi.meta.MetaZWaveProduct.getInstance());
                };
                KubiViewImpl.prototype.createSimulatedLightParameter = function () {
                    return this.create(org.kubi.meta.MetaSimulatedLightParameter.getInstance());
                };
                KubiViewImpl.prototype.createCatalog = function () {
                    return this.create(org.kubi.meta.MetaCatalog.getInstance());
                };
                KubiViewImpl.prototype.createManufacturer = function () {
                    return this.create(org.kubi.meta.MetaManufacturer.getInstance());
                };
                KubiViewImpl.prototype.createParameterItem = function () {
                    return this.create(org.kubi.zwave.meta.MetaParameterItem.getInstance());
                };
                return KubiViewImpl;
            })(org.kevoree.modeling.abs.AbstractKView);
            impl.KubiViewImpl = KubiViewImpl;
            var ManufacturerImpl = (function (_super) {
                __extends(ManufacturerImpl, _super);
                function ManufacturerImpl(p_universe, p_time, p_uuid, p_metaClass, p_manager) {
                    _super.call(this, p_universe, p_time, p_uuid, p_metaClass, p_manager);
                }
                ManufacturerImpl.prototype.getName = function () {
                    return this.get(org.kubi.meta.MetaManufacturer.ATT_NAME);
                };
                ManufacturerImpl.prototype.setName = function (p_obj) {
                    this.set(org.kubi.meta.MetaManufacturer.ATT_NAME, p_obj);
                    return this;
                };
                ManufacturerImpl.prototype.getId = function () {
                    return this.get(org.kubi.meta.MetaManufacturer.ATT_ID);
                };
                ManufacturerImpl.prototype.setId = function (p_obj) {
                    this.set(org.kubi.meta.MetaManufacturer.ATT_ID, p_obj);
                    return this;
                };
                ManufacturerImpl.prototype.addProducts = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.ADD, org.kubi.meta.MetaManufacturer.REF_PRODUCTS, p_obj);
                    return this;
                };
                ManufacturerImpl.prototype.removeProducts = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.REMOVE, org.kubi.meta.MetaManufacturer.REF_PRODUCTS, p_obj);
                    return this;
                };
                ManufacturerImpl.prototype.getProducts = function (cb) {
                    if (cb == null) {
                        return;
                    }
                    this.ref(org.kubi.meta.MetaManufacturer.REF_PRODUCTS, function (kObjects) {
                        var casted = new Array();
                        for (var i = 0; i < kObjects.length; i++) {
                            casted[i] = kObjects[i];
                        }
                        cb(casted);
                    });
                };
                ManufacturerImpl.prototype.sizeOfProducts = function () {
                    return this.size(org.kubi.meta.MetaManufacturer.REF_PRODUCTS);
                };
                return ManufacturerImpl;
            })(org.kevoree.modeling.abs.AbstractKObject);
            impl.ManufacturerImpl = ManufacturerImpl;
            var PeriodImpl = (function (_super) {
                __extends(PeriodImpl, _super);
                function PeriodImpl(p_universe, p_time, p_uuid, p_metaClass, p_manager) {
                    _super.call(this, p_universe, p_time, p_uuid, p_metaClass, p_manager);
                }
                PeriodImpl.prototype.getPeriod = function () {
                    return this.get(org.kubi.meta.MetaPeriod.ATT_PERIOD);
                };
                PeriodImpl.prototype.setPeriod = function (p_obj) {
                    this.set(org.kubi.meta.MetaPeriod.ATT_PERIOD, p_obj);
                    return this;
                };
                return PeriodImpl;
            })(org.kevoree.modeling.abs.AbstractKObject);
            impl.PeriodImpl = PeriodImpl;
            var ProductImpl = (function (_super) {
                __extends(ProductImpl, _super);
                function ProductImpl(p_universe, p_time, p_uuid, p_metaClass, p_manager) {
                    _super.call(this, p_universe, p_time, p_uuid, p_metaClass, p_manager);
                }
                ProductImpl.prototype.getName = function () {
                    return this.get(org.kubi.meta.MetaProduct.ATT_NAME);
                };
                ProductImpl.prototype.setName = function (p_obj) {
                    this.set(org.kubi.meta.MetaProduct.ATT_NAME, p_obj);
                    return this;
                };
                ProductImpl.prototype.getId = function () {
                    return this.get(org.kubi.meta.MetaProduct.ATT_ID);
                };
                ProductImpl.prototype.setId = function (p_obj) {
                    this.set(org.kubi.meta.MetaProduct.ATT_ID, p_obj);
                    return this;
                };
                return ProductImpl;
            })(org.kevoree.modeling.abs.AbstractKObject);
            impl.ProductImpl = ProductImpl;
            var SimulatedLightParameterImpl = (function (_super) {
                __extends(SimulatedLightParameterImpl, _super);
                function SimulatedLightParameterImpl(p_universe, p_time, p_uuid, p_metaClass, p_manager) {
                    _super.call(this, p_universe, p_time, p_uuid, p_metaClass, p_manager);
                }
                SimulatedLightParameterImpl.prototype.getUnit = function () {
                    return this.get(org.kubi.meta.MetaSimulatedLightParameter.ATT_UNIT);
                };
                SimulatedLightParameterImpl.prototype.setUnit = function (p_obj) {
                    this.set(org.kubi.meta.MetaSimulatedLightParameter.ATT_UNIT, p_obj);
                    return this;
                };
                SimulatedLightParameterImpl.prototype.getValueType = function () {
                    return this.get(org.kubi.meta.MetaSimulatedLightParameter.ATT_VALUETYPE);
                };
                SimulatedLightParameterImpl.prototype.setValueType = function (p_obj) {
                    this.set(org.kubi.meta.MetaSimulatedLightParameter.ATT_VALUETYPE, p_obj);
                    return this;
                };
                SimulatedLightParameterImpl.prototype.getPrecision = function () {
                    return this.get(org.kubi.meta.MetaSimulatedLightParameter.ATT_PRECISION);
                };
                SimulatedLightParameterImpl.prototype.setPrecision = function (p_obj) {
                    this.set(org.kubi.meta.MetaSimulatedLightParameter.ATT_PRECISION, p_obj);
                    return this;
                };
                SimulatedLightParameterImpl.prototype.getName = function () {
                    return this.get(org.kubi.meta.MetaSimulatedLightParameter.ATT_NAME);
                };
                SimulatedLightParameterImpl.prototype.setName = function (p_obj) {
                    this.set(org.kubi.meta.MetaSimulatedLightParameter.ATT_NAME, p_obj);
                    return this;
                };
                SimulatedLightParameterImpl.prototype.getValueUnredundant = function () {
                    return this.get(org.kubi.meta.MetaSimulatedLightParameter.ATT_VALUEUNREDUNDANT);
                };
                SimulatedLightParameterImpl.prototype.setValueUnredundant = function (p_obj) {
                    this.set(org.kubi.meta.MetaSimulatedLightParameter.ATT_VALUEUNREDUNDANT, p_obj);
                    return this;
                };
                SimulatedLightParameterImpl.prototype.getRange = function () {
                    return this.get(org.kubi.meta.MetaSimulatedLightParameter.ATT_RANGE);
                };
                SimulatedLightParameterImpl.prototype.setRange = function (p_obj) {
                    this.set(org.kubi.meta.MetaSimulatedLightParameter.ATT_RANGE, p_obj);
                    return this;
                };
                SimulatedLightParameterImpl.prototype.getValue = function () {
                    return this.get(org.kubi.meta.MetaSimulatedLightParameter.ATT_VALUE);
                };
                SimulatedLightParameterImpl.prototype.setValue = function (p_obj) {
                    this.set(org.kubi.meta.MetaSimulatedLightParameter.ATT_VALUE, p_obj);
                    return this;
                };
                SimulatedLightParameterImpl.prototype.setPeriod = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.SET, org.kubi.meta.MetaSimulatedLightParameter.REF_PERIOD, p_obj);
                    return this;
                };
                SimulatedLightParameterImpl.prototype.getPeriod = function (cb) {
                    if (cb == null) {
                        return;
                    }
                    this.ref(org.kubi.meta.MetaSimulatedLightParameter.REF_PERIOD, function (kObjects) {
                        if (kObjects.length > 0) {
                            cb(kObjects[0]);
                        }
                        else {
                            cb(null);
                        }
                    });
                };
                return SimulatedLightParameterImpl;
            })(org.kevoree.modeling.abs.AbstractKObject);
            impl.SimulatedLightParameterImpl = SimulatedLightParameterImpl;
            var SimulatedParameterImpl = (function (_super) {
                __extends(SimulatedParameterImpl, _super);
                function SimulatedParameterImpl(p_universe, p_time, p_uuid, p_metaClass, p_manager) {
                    _super.call(this, p_universe, p_time, p_uuid, p_metaClass, p_manager);
                }
                SimulatedParameterImpl.prototype.getUnit = function () {
                    return this.get(org.kubi.meta.MetaSimulatedParameter.ATT_UNIT);
                };
                SimulatedParameterImpl.prototype.setUnit = function (p_obj) {
                    this.set(org.kubi.meta.MetaSimulatedParameter.ATT_UNIT, p_obj);
                    return this;
                };
                SimulatedParameterImpl.prototype.getValueType = function () {
                    return this.get(org.kubi.meta.MetaSimulatedParameter.ATT_VALUETYPE);
                };
                SimulatedParameterImpl.prototype.setValueType = function (p_obj) {
                    this.set(org.kubi.meta.MetaSimulatedParameter.ATT_VALUETYPE, p_obj);
                    return this;
                };
                SimulatedParameterImpl.prototype.getPrecision = function () {
                    return this.get(org.kubi.meta.MetaSimulatedParameter.ATT_PRECISION);
                };
                SimulatedParameterImpl.prototype.setPrecision = function (p_obj) {
                    this.set(org.kubi.meta.MetaSimulatedParameter.ATT_PRECISION, p_obj);
                    return this;
                };
                SimulatedParameterImpl.prototype.getName = function () {
                    return this.get(org.kubi.meta.MetaSimulatedParameter.ATT_NAME);
                };
                SimulatedParameterImpl.prototype.setName = function (p_obj) {
                    this.set(org.kubi.meta.MetaSimulatedParameter.ATT_NAME, p_obj);
                    return this;
                };
                SimulatedParameterImpl.prototype.getValueUnredundant = function () {
                    return this.get(org.kubi.meta.MetaSimulatedParameter.ATT_VALUEUNREDUNDANT);
                };
                SimulatedParameterImpl.prototype.setValueUnredundant = function (p_obj) {
                    this.set(org.kubi.meta.MetaSimulatedParameter.ATT_VALUEUNREDUNDANT, p_obj);
                    return this;
                };
                SimulatedParameterImpl.prototype.getRange = function () {
                    return this.get(org.kubi.meta.MetaSimulatedParameter.ATT_RANGE);
                };
                SimulatedParameterImpl.prototype.setRange = function (p_obj) {
                    this.set(org.kubi.meta.MetaSimulatedParameter.ATT_RANGE, p_obj);
                    return this;
                };
                SimulatedParameterImpl.prototype.getValue = function () {
                    return this.get(org.kubi.meta.MetaSimulatedParameter.ATT_VALUE);
                };
                SimulatedParameterImpl.prototype.setValue = function (p_obj) {
                    this.set(org.kubi.meta.MetaSimulatedParameter.ATT_VALUE, p_obj);
                    return this;
                };
                SimulatedParameterImpl.prototype.setPeriod = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.SET, org.kubi.meta.MetaSimulatedParameter.REF_PERIOD, p_obj);
                    return this;
                };
                SimulatedParameterImpl.prototype.getPeriod = function (cb) {
                    if (cb == null) {
                        return;
                    }
                    this.ref(org.kubi.meta.MetaSimulatedParameter.REF_PERIOD, function (kObjects) {
                        if (kObjects.length > 0) {
                            cb(kObjects[0]);
                        }
                        else {
                            cb(null);
                        }
                    });
                };
                return SimulatedParameterImpl;
            })(org.kevoree.modeling.abs.AbstractKObject);
            impl.SimulatedParameterImpl = SimulatedParameterImpl;
            var SimulatedSwitchParameterImpl = (function (_super) {
                __extends(SimulatedSwitchParameterImpl, _super);
                function SimulatedSwitchParameterImpl(p_universe, p_time, p_uuid, p_metaClass, p_manager) {
                    _super.call(this, p_universe, p_time, p_uuid, p_metaClass, p_manager);
                }
                SimulatedSwitchParameterImpl.prototype.getUnit = function () {
                    return this.get(org.kubi.meta.MetaSimulatedSwitchParameter.ATT_UNIT);
                };
                SimulatedSwitchParameterImpl.prototype.setUnit = function (p_obj) {
                    this.set(org.kubi.meta.MetaSimulatedSwitchParameter.ATT_UNIT, p_obj);
                    return this;
                };
                SimulatedSwitchParameterImpl.prototype.getValueType = function () {
                    return this.get(org.kubi.meta.MetaSimulatedSwitchParameter.ATT_VALUETYPE);
                };
                SimulatedSwitchParameterImpl.prototype.setValueType = function (p_obj) {
                    this.set(org.kubi.meta.MetaSimulatedSwitchParameter.ATT_VALUETYPE, p_obj);
                    return this;
                };
                SimulatedSwitchParameterImpl.prototype.getPrecision = function () {
                    return this.get(org.kubi.meta.MetaSimulatedSwitchParameter.ATT_PRECISION);
                };
                SimulatedSwitchParameterImpl.prototype.setPrecision = function (p_obj) {
                    this.set(org.kubi.meta.MetaSimulatedSwitchParameter.ATT_PRECISION, p_obj);
                    return this;
                };
                SimulatedSwitchParameterImpl.prototype.getName = function () {
                    return this.get(org.kubi.meta.MetaSimulatedSwitchParameter.ATT_NAME);
                };
                SimulatedSwitchParameterImpl.prototype.setName = function (p_obj) {
                    this.set(org.kubi.meta.MetaSimulatedSwitchParameter.ATT_NAME, p_obj);
                    return this;
                };
                SimulatedSwitchParameterImpl.prototype.getValueUnredundant = function () {
                    return this.get(org.kubi.meta.MetaSimulatedSwitchParameter.ATT_VALUEUNREDUNDANT);
                };
                SimulatedSwitchParameterImpl.prototype.setValueUnredundant = function (p_obj) {
                    this.set(org.kubi.meta.MetaSimulatedSwitchParameter.ATT_VALUEUNREDUNDANT, p_obj);
                    return this;
                };
                SimulatedSwitchParameterImpl.prototype.getRange = function () {
                    return this.get(org.kubi.meta.MetaSimulatedSwitchParameter.ATT_RANGE);
                };
                SimulatedSwitchParameterImpl.prototype.setRange = function (p_obj) {
                    this.set(org.kubi.meta.MetaSimulatedSwitchParameter.ATT_RANGE, p_obj);
                    return this;
                };
                SimulatedSwitchParameterImpl.prototype.getValue = function () {
                    return this.get(org.kubi.meta.MetaSimulatedSwitchParameter.ATT_VALUE);
                };
                SimulatedSwitchParameterImpl.prototype.setValue = function (p_obj) {
                    this.set(org.kubi.meta.MetaSimulatedSwitchParameter.ATT_VALUE, p_obj);
                    return this;
                };
                SimulatedSwitchParameterImpl.prototype.setPeriod = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.SET, org.kubi.meta.MetaSimulatedSwitchParameter.REF_PERIOD, p_obj);
                    return this;
                };
                SimulatedSwitchParameterImpl.prototype.getPeriod = function (cb) {
                    if (cb == null) {
                        return;
                    }
                    this.ref(org.kubi.meta.MetaSimulatedSwitchParameter.REF_PERIOD, function (kObjects) {
                        if (kObjects.length > 0) {
                            cb(kObjects[0]);
                        }
                        else {
                            cb(null);
                        }
                    });
                };
                return SimulatedSwitchParameterImpl;
            })(org.kevoree.modeling.abs.AbstractKObject);
            impl.SimulatedSwitchParameterImpl = SimulatedSwitchParameterImpl;
            var StateParameterImpl = (function (_super) {
                __extends(StateParameterImpl, _super);
                function StateParameterImpl(p_universe, p_time, p_uuid, p_metaClass, p_manager) {
                    _super.call(this, p_universe, p_time, p_uuid, p_metaClass, p_manager);
                }
                StateParameterImpl.prototype.getUnit = function () {
                    return this.get(org.kubi.meta.MetaStateParameter.ATT_UNIT);
                };
                StateParameterImpl.prototype.setUnit = function (p_obj) {
                    this.set(org.kubi.meta.MetaStateParameter.ATT_UNIT, p_obj);
                    return this;
                };
                StateParameterImpl.prototype.getValueType = function () {
                    return this.get(org.kubi.meta.MetaStateParameter.ATT_VALUETYPE);
                };
                StateParameterImpl.prototype.setValueType = function (p_obj) {
                    this.set(org.kubi.meta.MetaStateParameter.ATT_VALUETYPE, p_obj);
                    return this;
                };
                StateParameterImpl.prototype.getPrecision = function () {
                    return this.get(org.kubi.meta.MetaStateParameter.ATT_PRECISION);
                };
                StateParameterImpl.prototype.setPrecision = function (p_obj) {
                    this.set(org.kubi.meta.MetaStateParameter.ATT_PRECISION, p_obj);
                    return this;
                };
                StateParameterImpl.prototype.getName = function () {
                    return this.get(org.kubi.meta.MetaStateParameter.ATT_NAME);
                };
                StateParameterImpl.prototype.setName = function (p_obj) {
                    this.set(org.kubi.meta.MetaStateParameter.ATT_NAME, p_obj);
                    return this;
                };
                StateParameterImpl.prototype.getRange = function () {
                    return this.get(org.kubi.meta.MetaStateParameter.ATT_RANGE);
                };
                StateParameterImpl.prototype.setRange = function (p_obj) {
                    this.set(org.kubi.meta.MetaStateParameter.ATT_RANGE, p_obj);
                    return this;
                };
                StateParameterImpl.prototype.getValue = function () {
                    return this.get(org.kubi.meta.MetaStateParameter.ATT_VALUE);
                };
                StateParameterImpl.prototype.setValue = function (p_obj) {
                    this.set(org.kubi.meta.MetaStateParameter.ATT_VALUE, p_obj);
                    return this;
                };
                StateParameterImpl.prototype.setPeriod = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.SET, org.kubi.meta.MetaStateParameter.REF_PERIOD, p_obj);
                    return this;
                };
                StateParameterImpl.prototype.getPeriod = function (cb) {
                    if (cb == null) {
                        return;
                    }
                    this.ref(org.kubi.meta.MetaStateParameter.REF_PERIOD, function (kObjects) {
                        if (kObjects.length > 0) {
                            cb(kObjects[0]);
                        }
                        else {
                            cb(null);
                        }
                    });
                };
                return StateParameterImpl;
            })(org.kevoree.modeling.abs.AbstractKObject);
            impl.StateParameterImpl = StateParameterImpl;
            var TechnologyImpl = (function (_super) {
                __extends(TechnologyImpl, _super);
                function TechnologyImpl(p_universe, p_time, p_uuid, p_metaClass, p_manager) {
                    _super.call(this, p_universe, p_time, p_uuid, p_metaClass, p_manager);
                }
                TechnologyImpl.prototype.getName = function () {
                    return this.get(org.kubi.meta.MetaTechnology.ATT_NAME);
                };
                TechnologyImpl.prototype.setName = function (p_obj) {
                    this.set(org.kubi.meta.MetaTechnology.ATT_NAME, p_obj);
                    return this;
                };
                TechnologyImpl.prototype.addDevices = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.ADD, org.kubi.meta.MetaTechnology.REF_DEVICES, p_obj);
                    return this;
                };
                TechnologyImpl.prototype.removeDevices = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.REMOVE, org.kubi.meta.MetaTechnology.REF_DEVICES, p_obj);
                    return this;
                };
                TechnologyImpl.prototype.getDevices = function (cb) {
                    if (cb == null) {
                        return;
                    }
                    this.ref(org.kubi.meta.MetaTechnology.REF_DEVICES, function (kObjects) {
                        var casted = new Array();
                        for (var i = 0; i < kObjects.length; i++) {
                            casted[i] = kObjects[i];
                        }
                        cb(casted);
                    });
                };
                TechnologyImpl.prototype.sizeOfDevices = function () {
                    return this.size(org.kubi.meta.MetaTechnology.REF_DEVICES);
                };
                TechnologyImpl.prototype.setCatalog = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.SET, org.kubi.meta.MetaTechnology.REF_CATALOG, p_obj);
                    return this;
                };
                TechnologyImpl.prototype.getCatalog = function (cb) {
                    if (cb == null) {
                        return;
                    }
                    this.ref(org.kubi.meta.MetaTechnology.REF_CATALOG, function (kObjects) {
                        if (kObjects.length > 0) {
                            cb(kObjects[0]);
                        }
                        else {
                            cb(null);
                        }
                    });
                };
                return TechnologyImpl;
            })(org.kevoree.modeling.abs.AbstractKObject);
            impl.TechnologyImpl = TechnologyImpl;
            var ZWaveProductImpl = (function (_super) {
                __extends(ZWaveProductImpl, _super);
                function ZWaveProductImpl(p_universe, p_time, p_uuid, p_metaClass, p_manager) {
                    _super.call(this, p_universe, p_time, p_uuid, p_metaClass, p_manager);
                }
                ZWaveProductImpl.prototype.getName = function () {
                    return this.get(org.kubi.meta.MetaZWaveProduct.ATT_NAME);
                };
                ZWaveProductImpl.prototype.setName = function (p_obj) {
                    this.set(org.kubi.meta.MetaZWaveProduct.ATT_NAME, p_obj);
                    return this;
                };
                ZWaveProductImpl.prototype.getId = function () {
                    return this.get(org.kubi.meta.MetaZWaveProduct.ATT_ID);
                };
                ZWaveProductImpl.prototype.setId = function (p_obj) {
                    this.set(org.kubi.meta.MetaZWaveProduct.ATT_ID, p_obj);
                    return this;
                };
                ZWaveProductImpl.prototype.getType = function () {
                    return this.get(org.kubi.meta.MetaZWaveProduct.ATT_TYPE);
                };
                ZWaveProductImpl.prototype.setType = function (p_obj) {
                    this.set(org.kubi.meta.MetaZWaveProduct.ATT_TYPE, p_obj);
                    return this;
                };
                ZWaveProductImpl.prototype.addCommandClasses = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.ADD, org.kubi.meta.MetaZWaveProduct.REF_COMMANDCLASSES, p_obj);
                    return this;
                };
                ZWaveProductImpl.prototype.removeCommandClasses = function (p_obj) {
                    this.mutate(org.kevoree.modeling.KActionType.REMOVE, org.kubi.meta.MetaZWaveProduct.REF_COMMANDCLASSES, p_obj);
                    return this;
                };
                ZWaveProductImpl.prototype.getCommandClasses = function (cb) {
                    if (cb == null) {
                        return;
                    }
                    this.ref(org.kubi.meta.MetaZWaveProduct.REF_COMMANDCLASSES, function (kObjects) {
                        var casted = new Array();
                        for (var i = 0; i < kObjects.length; i++) {
                            casted[i] = kObjects[i];
                        }
                        cb(casted);
                    });
                };
                ZWaveProductImpl.prototype.sizeOfCommandClasses = function () {
                    return this.size(org.kubi.meta.MetaZWaveProduct.REF_COMMANDCLASSES);
                };
                return ZWaveProductImpl;
            })(org.kevoree.modeling.abs.AbstractKObject);
            impl.ZWaveProductImpl = ZWaveProductImpl;
        })(impl = kubi.impl || (kubi.impl = {}));
        var meta;
        (function (meta) {
            var MetaActionParameter = (function (_super) {
                __extends(MetaActionParameter, _super);
                function MetaActionParameter() {
                    _super.call(this, "org.kubi.ActionParameter", 5, null);
                    var temp_all = new Array();
                    temp_all[0] = MetaActionParameter.ATT_UNIT;
                    temp_all[1] = MetaActionParameter.ATT_DESIRED;
                    temp_all[2] = MetaActionParameter.ATT_VALUETYPE;
                    temp_all[3] = MetaActionParameter.ATT_PRECISION;
                    temp_all[4] = MetaActionParameter.ATT_NAME;
                    temp_all[5] = MetaActionParameter.ATT_RANGE;
                    temp_all[6] = MetaActionParameter.ATT_VALUE;
                    var temp_references = new Array();
                    temp_all[7] = MetaActionParameter.REF_OP_ACTIONPARAMETERS;
                    temp_all[8] = MetaActionParameter.REF_OP_STATEPARAMETERS;
                    temp_all[9] = MetaActionParameter.REF_PERIOD;
                    var temp_operations = new Array();
                    this.init(temp_all);
                }
                MetaActionParameter.getInstance = function () {
                    if (MetaActionParameter.INSTANCE == null) {
                        MetaActionParameter.INSTANCE = new org.kubi.meta.MetaActionParameter();
                    }
                    return MetaActionParameter.INSTANCE;
                };
                MetaActionParameter.INSTANCE = null;
                MetaActionParameter.ATT_UNIT = new org.kevoree.modeling.meta.impl.MetaAttribute("unit", 0, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaActionParameter.ATT_DESIRED = new org.kevoree.modeling.meta.impl.MetaAttribute("desired", 1, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaActionParameter.ATT_VALUETYPE = new org.kevoree.modeling.meta.impl.MetaAttribute("valueType", 2, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaActionParameter.ATT_PRECISION = new org.kevoree.modeling.meta.impl.MetaAttribute("precision", 3, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.DOUBLE, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaActionParameter.ATT_NAME = new org.kevoree.modeling.meta.impl.MetaAttribute("name", 4, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaActionParameter.ATT_RANGE = new org.kevoree.modeling.meta.impl.MetaAttribute("range", 5, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaActionParameter.ATT_VALUE = new org.kevoree.modeling.meta.impl.MetaAttribute("value", 6, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaActionParameter.REF_OP_ACTIONPARAMETERS = new org.kevoree.modeling.meta.impl.MetaReference("op_actionParameters", 7, false, false, function () {
                    return org.kubi.meta.MetaDevice.getInstance();
                }, "actionParameters", function () {
                    return org.kubi.meta.MetaActionParameter.getInstance();
                });
                MetaActionParameter.REF_OP_STATEPARAMETERS = new org.kevoree.modeling.meta.impl.MetaReference("op_stateParameters", 8, false, false, function () {
                    return org.kubi.meta.MetaDevice.getInstance();
                }, "stateParameters", function () {
                    return org.kubi.meta.MetaActionParameter.getInstance();
                });
                MetaActionParameter.REF_PERIOD = new org.kevoree.modeling.meta.impl.MetaReference("period", 9, true, true, function () {
                    return org.kubi.meta.MetaPeriod.getInstance();
                }, "op_period", function () {
                    return org.kubi.meta.MetaActionParameter.getInstance();
                });
                return MetaActionParameter;
            })(org.kevoree.modeling.meta.impl.MetaClass);
            meta.MetaActionParameter = MetaActionParameter;
            var MetaCatalog = (function (_super) {
                __extends(MetaCatalog, _super);
                function MetaCatalog() {
                    _super.call(this, "org.kubi.Catalog", 7, null);
                    var temp_all = new Array();
                    var temp_references = new Array();
                    temp_all[0] = MetaCatalog.REF_MANUFACTURERS;
                    temp_all[1] = MetaCatalog.REF_OP_CATALOG;
                    var temp_operations = new Array();
                    this.init(temp_all);
                }
                MetaCatalog.getInstance = function () {
                    if (MetaCatalog.INSTANCE == null) {
                        MetaCatalog.INSTANCE = new org.kubi.meta.MetaCatalog();
                    }
                    return MetaCatalog.INSTANCE;
                };
                MetaCatalog.INSTANCE = null;
                MetaCatalog.REF_MANUFACTURERS = new org.kevoree.modeling.meta.impl.MetaReference("manufacturers", 0, true, false, function () {
                    return org.kubi.meta.MetaManufacturer.getInstance();
                }, "op_manufacturers", function () {
                    return org.kubi.meta.MetaCatalog.getInstance();
                });
                MetaCatalog.REF_OP_CATALOG = new org.kevoree.modeling.meta.impl.MetaReference("op_catalog", 1, false, false, function () {
                    return org.kubi.meta.MetaTechnology.getInstance();
                }, "catalog", function () {
                    return org.kubi.meta.MetaCatalog.getInstance();
                });
                return MetaCatalog;
            })(org.kevoree.modeling.meta.impl.MetaClass);
            meta.MetaCatalog = MetaCatalog;
            var MetaDevice = (function (_super) {
                __extends(MetaDevice, _super);
                function MetaDevice() {
                    _super.call(this, "org.kubi.Device", 3, null);
                    var temp_all = new Array();
                    temp_all[0] = MetaDevice.ATT_NAME;
                    temp_all[1] = MetaDevice.ATT_ID;
                    temp_all[2] = MetaDevice.ATT_HOMEID;
                    temp_all[3] = MetaDevice.ATT_VERSION;
                    temp_all[4] = MetaDevice.ATT_PICTURE;
                    temp_all[5] = MetaDevice.ATT_MANUFACTURER;
                    var temp_references = new Array();
                    temp_all[6] = MetaDevice.REF_GROUPES;
                    temp_all[7] = MetaDevice.REF_ACTIONPARAMETERS;
                    temp_all[8] = MetaDevice.REF_STATEPARAMETERS;
                    temp_all[9] = MetaDevice.REF_OP_LINKS;
                    temp_all[10] = MetaDevice.REF_LINKS;
                    temp_all[11] = MetaDevice.REF_TECHNOLOGY;
                    var temp_operations = new Array();
                    this.init(temp_all);
                }
                MetaDevice.getInstance = function () {
                    if (MetaDevice.INSTANCE == null) {
                        MetaDevice.INSTANCE = new org.kubi.meta.MetaDevice();
                    }
                    return MetaDevice.INSTANCE;
                };
                MetaDevice.INSTANCE = null;
                MetaDevice.ATT_NAME = new org.kevoree.modeling.meta.impl.MetaAttribute("name", 0, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaDevice.ATT_ID = new org.kevoree.modeling.meta.impl.MetaAttribute("id", 1, 0, true, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaDevice.ATT_HOMEID = new org.kevoree.modeling.meta.impl.MetaAttribute("homeId", 2, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaDevice.ATT_VERSION = new org.kevoree.modeling.meta.impl.MetaAttribute("version", 3, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaDevice.ATT_PICTURE = new org.kevoree.modeling.meta.impl.MetaAttribute("picture", 4, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaDevice.ATT_MANUFACTURER = new org.kevoree.modeling.meta.impl.MetaAttribute("manufacturer", 5, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaDevice.REF_GROUPES = new org.kevoree.modeling.meta.impl.MetaReference("groupes", 6, true, false, function () {
                    return org.kubi.meta.MetaGroup.getInstance();
                }, "devices", function () {
                    return org.kubi.meta.MetaDevice.getInstance();
                });
                MetaDevice.REF_ACTIONPARAMETERS = new org.kevoree.modeling.meta.impl.MetaReference("actionParameters", 7, true, false, function () {
                    return org.kubi.meta.MetaActionParameter.getInstance();
                }, "op_actionParameters", function () {
                    return org.kubi.meta.MetaDevice.getInstance();
                });
                MetaDevice.REF_STATEPARAMETERS = new org.kevoree.modeling.meta.impl.MetaReference("stateParameters", 8, true, false, function () {
                    return org.kubi.meta.MetaStateParameter.getInstance();
                }, "op_stateParameters", function () {
                    return org.kubi.meta.MetaDevice.getInstance();
                });
                MetaDevice.REF_OP_LINKS = new org.kevoree.modeling.meta.impl.MetaReference("op_links", 9, false, false, function () {
                    return org.kubi.meta.MetaDevice.getInstance();
                }, "links", function () {
                    return org.kubi.meta.MetaDevice.getInstance();
                });
                MetaDevice.REF_LINKS = new org.kevoree.modeling.meta.impl.MetaReference("links", 10, true, false, function () {
                    return org.kubi.meta.MetaDevice.getInstance();
                }, "op_links", function () {
                    return org.kubi.meta.MetaDevice.getInstance();
                });
                MetaDevice.REF_TECHNOLOGY = new org.kevoree.modeling.meta.impl.MetaReference("technology", 11, true, true, function () {
                    return org.kubi.meta.MetaTechnology.getInstance();
                }, "devices", function () {
                    return org.kubi.meta.MetaDevice.getInstance();
                });
                return MetaDevice;
            })(org.kevoree.modeling.meta.impl.MetaClass);
            meta.MetaDevice = MetaDevice;
            var MetaEcosystem = (function (_super) {
                __extends(MetaEcosystem, _super);
                function MetaEcosystem() {
                    _super.call(this, "org.kubi.Ecosystem", 0, null);
                    var temp_all = new Array();
                    temp_all[0] = MetaEcosystem.ATT_NAME;
                    var temp_references = new Array();
                    temp_all[1] = MetaEcosystem.REF_GROUPES;
                    temp_all[2] = MetaEcosystem.REF_TECHNOLOGIES;
                    var temp_operations = new Array();
                    this.init(temp_all);
                }
                MetaEcosystem.getInstance = function () {
                    if (MetaEcosystem.INSTANCE == null) {
                        MetaEcosystem.INSTANCE = new org.kubi.meta.MetaEcosystem();
                    }
                    return MetaEcosystem.INSTANCE;
                };
                MetaEcosystem.INSTANCE = null;
                MetaEcosystem.ATT_NAME = new org.kevoree.modeling.meta.impl.MetaAttribute("name", 0, 0, true, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaEcosystem.REF_GROUPES = new org.kevoree.modeling.meta.impl.MetaReference("groupes", 1, true, false, function () {
                    return org.kubi.meta.MetaGroup.getInstance();
                }, "op_groupes", function () {
                    return org.kubi.meta.MetaEcosystem.getInstance();
                });
                MetaEcosystem.REF_TECHNOLOGIES = new org.kevoree.modeling.meta.impl.MetaReference("technologies", 2, true, false, function () {
                    return org.kubi.meta.MetaTechnology.getInstance();
                }, "op_technologies", function () {
                    return org.kubi.meta.MetaEcosystem.getInstance();
                });
                return MetaEcosystem;
            })(org.kevoree.modeling.meta.impl.MetaClass);
            meta.MetaEcosystem = MetaEcosystem;
            var MetaGroup = (function (_super) {
                __extends(MetaGroup, _super);
                function MetaGroup() {
                    _super.call(this, "org.kubi.Group", 1, null);
                    var temp_all = new Array();
                    temp_all[0] = MetaGroup.ATT_NAME;
                    var temp_references = new Array();
                    temp_all[1] = MetaGroup.REF_GROUPES;
                    temp_all[2] = MetaGroup.REF_DEVICES;
                    temp_all[3] = MetaGroup.REF_OP_GROUPES;
                    var temp_operations = new Array();
                    this.init(temp_all);
                }
                MetaGroup.getInstance = function () {
                    if (MetaGroup.INSTANCE == null) {
                        MetaGroup.INSTANCE = new org.kubi.meta.MetaGroup();
                    }
                    return MetaGroup.INSTANCE;
                };
                MetaGroup.INSTANCE = null;
                MetaGroup.ATT_NAME = new org.kevoree.modeling.meta.impl.MetaAttribute("name", 0, 0, true, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaGroup.REF_GROUPES = new org.kevoree.modeling.meta.impl.MetaReference("groupes", 1, true, false, function () {
                    return org.kubi.meta.MetaGroup.getInstance();
                }, "op_groupes", function () {
                    return org.kubi.meta.MetaGroup.getInstance();
                });
                MetaGroup.REF_DEVICES = new org.kevoree.modeling.meta.impl.MetaReference("devices", 2, true, false, function () {
                    return org.kubi.meta.MetaDevice.getInstance();
                }, "groupes", function () {
                    return org.kubi.meta.MetaGroup.getInstance();
                });
                MetaGroup.REF_OP_GROUPES = new org.kevoree.modeling.meta.impl.MetaReference("op_groupes", 3, false, false, function () {
                    return org.kubi.meta.MetaEcosystem.getInstance();
                }, "groupes", function () {
                    return org.kubi.meta.MetaGroup.getInstance();
                });
                return MetaGroup;
            })(org.kevoree.modeling.meta.impl.MetaClass);
            meta.MetaGroup = MetaGroup;
            var MetaManufacturer = (function (_super) {
                __extends(MetaManufacturer, _super);
                function MetaManufacturer() {
                    _super.call(this, "org.kubi.Manufacturer", 11, null);
                    var temp_all = new Array();
                    temp_all[0] = MetaManufacturer.ATT_NAME;
                    temp_all[1] = MetaManufacturer.ATT_ID;
                    var temp_references = new Array();
                    temp_all[2] = MetaManufacturer.REF_OP_MANUFACTURERS;
                    temp_all[3] = MetaManufacturer.REF_PRODUCTS;
                    var temp_operations = new Array();
                    this.init(temp_all);
                }
                MetaManufacturer.getInstance = function () {
                    if (MetaManufacturer.INSTANCE == null) {
                        MetaManufacturer.INSTANCE = new org.kubi.meta.MetaManufacturer();
                    }
                    return MetaManufacturer.INSTANCE;
                };
                MetaManufacturer.INSTANCE = null;
                MetaManufacturer.ATT_NAME = new org.kevoree.modeling.meta.impl.MetaAttribute("name", 0, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaManufacturer.ATT_ID = new org.kevoree.modeling.meta.impl.MetaAttribute("id", 1, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.INT, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaManufacturer.REF_OP_MANUFACTURERS = new org.kevoree.modeling.meta.impl.MetaReference("op_manufacturers", 2, false, false, function () {
                    return org.kubi.meta.MetaCatalog.getInstance();
                }, "manufacturers", function () {
                    return org.kubi.meta.MetaManufacturer.getInstance();
                });
                MetaManufacturer.REF_PRODUCTS = new org.kevoree.modeling.meta.impl.MetaReference("products", 3, true, false, function () {
                    return org.kubi.meta.MetaProduct.getInstance();
                }, "op_products", function () {
                    return org.kubi.meta.MetaManufacturer.getInstance();
                });
                return MetaManufacturer;
            })(org.kevoree.modeling.meta.impl.MetaClass);
            meta.MetaManufacturer = MetaManufacturer;
            var MetaParameterType = (function (_super) {
                __extends(MetaParameterType, _super);
                function MetaParameterType(p_name, p_isEnum) {
                    _super.call(this, p_name, p_isEnum);
                }
                MetaParameterType.getInstance = function () {
                    if (MetaParameterType.INSTANCE == null) {
                        MetaParameterType.INSTANCE = new org.kubi.meta.MetaParameterType("org.kubi.ParameterType", true);
                    }
                    return MetaParameterType.INSTANCE;
                };
                MetaParameterType.prototype.load = function (s) {
                    if (s.equals(MetaParameterType._BOOL)) {
                        return org.kubi.ParameterType.BOOL;
                    }
                    if (s.equals(MetaParameterType._BUTTON)) {
                        return org.kubi.ParameterType.BUTTON;
                    }
                    if (s.equals(MetaParameterType._BYTE)) {
                        return org.kubi.ParameterType.BYTE;
                    }
                    if (s.equals(MetaParameterType._DECIMAL)) {
                        return org.kubi.ParameterType.DECIMAL;
                    }
                    if (s.equals(MetaParameterType._INT)) {
                        return org.kubi.ParameterType.INT;
                    }
                    if (s.equals(MetaParameterType._LIST)) {
                        return org.kubi.ParameterType.LIST;
                    }
                    if (s.equals(MetaParameterType._SHORT)) {
                        return org.kubi.ParameterType.SHORT;
                    }
                    if (s.equals(MetaParameterType._STRING)) {
                        return org.kubi.ParameterType.STRING;
                    }
                    return null;
                };
                MetaParameterType.prototype.save = function (value) {
                    if (value == org.kubi.ParameterType.BOOL) {
                        return MetaParameterType._BOOL;
                    }
                    if (value == org.kubi.ParameterType.BUTTON) {
                        return MetaParameterType._BUTTON;
                    }
                    if (value == org.kubi.ParameterType.BYTE) {
                        return MetaParameterType._BYTE;
                    }
                    if (value == org.kubi.ParameterType.DECIMAL) {
                        return MetaParameterType._DECIMAL;
                    }
                    if (value == org.kubi.ParameterType.INT) {
                        return MetaParameterType._INT;
                    }
                    if (value == org.kubi.ParameterType.LIST) {
                        return MetaParameterType._LIST;
                    }
                    if (value == org.kubi.ParameterType.SHORT) {
                        return MetaParameterType._SHORT;
                    }
                    if (value == org.kubi.ParameterType.STRING) {
                        return MetaParameterType._STRING;
                    }
                    return null;
                };
                MetaParameterType._BOOL = "BOOL";
                MetaParameterType._BUTTON = "BUTTON";
                MetaParameterType._BYTE = "BYTE";
                MetaParameterType._DECIMAL = "DECIMAL";
                MetaParameterType._INT = "INT";
                MetaParameterType._LIST = "LIST";
                MetaParameterType._SHORT = "SHORT";
                MetaParameterType._STRING = "STRING";
                return MetaParameterType;
            })(org.kevoree.modeling.abs.AbstractDataType);
            meta.MetaParameterType = MetaParameterType;
            var MetaPeriod = (function (_super) {
                __extends(MetaPeriod, _super);
                function MetaPeriod() {
                    _super.call(this, "org.kubi.Period", 6, null);
                    var temp_all = new Array();
                    temp_all[0] = MetaPeriod.ATT_PERIOD;
                    var temp_references = new Array();
                    temp_all[1] = MetaPeriod.REF_OP_PERIOD;
                    var temp_operations = new Array();
                    this.init(temp_all);
                }
                MetaPeriod.getInstance = function () {
                    if (MetaPeriod.INSTANCE == null) {
                        MetaPeriod.INSTANCE = new org.kubi.meta.MetaPeriod();
                    }
                    return MetaPeriod.INSTANCE;
                };
                MetaPeriod.INSTANCE = null;
                MetaPeriod.ATT_PERIOD = new org.kevoree.modeling.meta.impl.MetaAttribute("period", 0, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaPeriod.REF_OP_PERIOD = new org.kevoree.modeling.meta.impl.MetaReference("op_period", 1, false, false, function () {
                    return org.kubi.meta.MetaStateParameter.getInstance();
                }, "period", function () {
                    return org.kubi.meta.MetaPeriod.getInstance();
                });
                return MetaPeriod;
            })(org.kevoree.modeling.meta.impl.MetaClass);
            meta.MetaPeriod = MetaPeriod;
            var MetaProduct = (function (_super) {
                __extends(MetaProduct, _super);
                function MetaProduct() {
                    _super.call(this, "org.kubi.Product", 12, null);
                    var temp_all = new Array();
                    temp_all[0] = MetaProduct.ATT_NAME;
                    temp_all[1] = MetaProduct.ATT_ID;
                    var temp_references = new Array();
                    temp_all[2] = MetaProduct.REF_OP_PRODUCTS;
                    var temp_operations = new Array();
                    this.init(temp_all);
                }
                MetaProduct.getInstance = function () {
                    if (MetaProduct.INSTANCE == null) {
                        MetaProduct.INSTANCE = new org.kubi.meta.MetaProduct();
                    }
                    return MetaProduct.INSTANCE;
                };
                MetaProduct.INSTANCE = null;
                MetaProduct.ATT_NAME = new org.kevoree.modeling.meta.impl.MetaAttribute("name", 0, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaProduct.ATT_ID = new org.kevoree.modeling.meta.impl.MetaAttribute("id", 1, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.INT, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaProduct.REF_OP_PRODUCTS = new org.kevoree.modeling.meta.impl.MetaReference("op_products", 2, false, false, function () {
                    return org.kubi.meta.MetaManufacturer.getInstance();
                }, "products", function () {
                    return org.kubi.meta.MetaProduct.getInstance();
                });
                return MetaProduct;
            })(org.kevoree.modeling.meta.impl.MetaClass);
            meta.MetaProduct = MetaProduct;
            var MetaSimulatedLightParameter = (function (_super) {
                __extends(MetaSimulatedLightParameter, _super);
                function MetaSimulatedLightParameter() {
                    _super.call(this, "org.kubi.SimulatedLightParameter", 9, null);
                    var temp_all = new Array();
                    temp_all[0] = MetaSimulatedLightParameter.ATT_UNIT;
                    temp_all[1] = MetaSimulatedLightParameter.ATT_VALUETYPE;
                    temp_all[2] = MetaSimulatedLightParameter.ATT_PRECISION;
                    temp_all[3] = MetaSimulatedLightParameter.ATT_NAME;
                    temp_all[4] = MetaSimulatedLightParameter.ATT_VALUEUNREDUNDANT;
                    temp_all[5] = MetaSimulatedLightParameter.ATT_RANGE;
                    temp_all[6] = MetaSimulatedLightParameter.ATT_VALUE;
                    var temp_references = new Array();
                    temp_all[7] = MetaSimulatedLightParameter.REF_OP_STATEPARAMETERS;
                    temp_all[8] = MetaSimulatedLightParameter.REF_PERIOD;
                    var temp_operations = new Array();
                    this.init(temp_all);
                }
                MetaSimulatedLightParameter.getInstance = function () {
                    if (MetaSimulatedLightParameter.INSTANCE == null) {
                        MetaSimulatedLightParameter.INSTANCE = new org.kubi.meta.MetaSimulatedLightParameter();
                    }
                    return MetaSimulatedLightParameter.INSTANCE;
                };
                MetaSimulatedLightParameter.INSTANCE = null;
                MetaSimulatedLightParameter.ATT_UNIT = new org.kevoree.modeling.meta.impl.MetaAttribute("unit", 0, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaSimulatedLightParameter.ATT_VALUETYPE = new org.kevoree.modeling.meta.impl.MetaAttribute("valueType", 1, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaSimulatedLightParameter.ATT_PRECISION = new org.kevoree.modeling.meta.impl.MetaAttribute("precision", 2, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.DOUBLE, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaSimulatedLightParameter.ATT_NAME = new org.kevoree.modeling.meta.impl.MetaAttribute("name", 3, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaSimulatedLightParameter.ATT_VALUEUNREDUNDANT = new org.kevoree.modeling.meta.impl.MetaAttribute("valueUnredundant", 4, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaSimulatedLightParameter.ATT_RANGE = new org.kevoree.modeling.meta.impl.MetaAttribute("range", 5, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaSimulatedLightParameter.ATT_VALUE = new org.kevoree.modeling.meta.impl.MetaAttribute("value", 6, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaSimulatedLightParameter.REF_OP_STATEPARAMETERS = new org.kevoree.modeling.meta.impl.MetaReference("op_stateParameters", 7, false, false, function () {
                    return org.kubi.meta.MetaDevice.getInstance();
                }, "stateParameters", function () {
                    return org.kubi.meta.MetaSimulatedLightParameter.getInstance();
                });
                MetaSimulatedLightParameter.REF_PERIOD = new org.kevoree.modeling.meta.impl.MetaReference("period", 8, true, true, function () {
                    return org.kubi.meta.MetaPeriod.getInstance();
                }, "op_period", function () {
                    return org.kubi.meta.MetaSimulatedLightParameter.getInstance();
                });
                return MetaSimulatedLightParameter;
            })(org.kevoree.modeling.meta.impl.MetaClass);
            meta.MetaSimulatedLightParameter = MetaSimulatedLightParameter;
            var MetaSimulatedParameter = (function (_super) {
                __extends(MetaSimulatedParameter, _super);
                function MetaSimulatedParameter() {
                    _super.call(this, "org.kubi.SimulatedParameter", 8, null);
                    var temp_all = new Array();
                    temp_all[0] = MetaSimulatedParameter.ATT_UNIT;
                    temp_all[1] = MetaSimulatedParameter.ATT_VALUETYPE;
                    temp_all[2] = MetaSimulatedParameter.ATT_PRECISION;
                    temp_all[3] = MetaSimulatedParameter.ATT_NAME;
                    temp_all[4] = MetaSimulatedParameter.ATT_VALUEUNREDUNDANT;
                    temp_all[5] = MetaSimulatedParameter.ATT_RANGE;
                    temp_all[6] = MetaSimulatedParameter.ATT_VALUE;
                    var temp_references = new Array();
                    temp_all[7] = MetaSimulatedParameter.REF_OP_STATEPARAMETERS;
                    temp_all[8] = MetaSimulatedParameter.REF_PERIOD;
                    var temp_operations = new Array();
                    this.init(temp_all);
                }
                MetaSimulatedParameter.getInstance = function () {
                    if (MetaSimulatedParameter.INSTANCE == null) {
                        MetaSimulatedParameter.INSTANCE = new org.kubi.meta.MetaSimulatedParameter();
                    }
                    return MetaSimulatedParameter.INSTANCE;
                };
                MetaSimulatedParameter.INSTANCE = null;
                MetaSimulatedParameter.ATT_UNIT = new org.kevoree.modeling.meta.impl.MetaAttribute("unit", 0, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaSimulatedParameter.ATT_VALUETYPE = new org.kevoree.modeling.meta.impl.MetaAttribute("valueType", 1, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaSimulatedParameter.ATT_PRECISION = new org.kevoree.modeling.meta.impl.MetaAttribute("precision", 2, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.DOUBLE, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaSimulatedParameter.ATT_NAME = new org.kevoree.modeling.meta.impl.MetaAttribute("name", 3, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaSimulatedParameter.ATT_VALUEUNREDUNDANT = new org.kevoree.modeling.meta.impl.MetaAttribute("valueUnredundant", 4, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaSimulatedParameter.ATT_RANGE = new org.kevoree.modeling.meta.impl.MetaAttribute("range", 5, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaSimulatedParameter.ATT_VALUE = new org.kevoree.modeling.meta.impl.MetaAttribute("value", 6, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaSimulatedParameter.REF_OP_STATEPARAMETERS = new org.kevoree.modeling.meta.impl.MetaReference("op_stateParameters", 7, false, false, function () {
                    return org.kubi.meta.MetaDevice.getInstance();
                }, "stateParameters", function () {
                    return org.kubi.meta.MetaSimulatedParameter.getInstance();
                });
                MetaSimulatedParameter.REF_PERIOD = new org.kevoree.modeling.meta.impl.MetaReference("period", 8, true, true, function () {
                    return org.kubi.meta.MetaPeriod.getInstance();
                }, "op_period", function () {
                    return org.kubi.meta.MetaSimulatedParameter.getInstance();
                });
                return MetaSimulatedParameter;
            })(org.kevoree.modeling.meta.impl.MetaClass);
            meta.MetaSimulatedParameter = MetaSimulatedParameter;
            var MetaSimulatedSwitchParameter = (function (_super) {
                __extends(MetaSimulatedSwitchParameter, _super);
                function MetaSimulatedSwitchParameter() {
                    _super.call(this, "org.kubi.SimulatedSwitchParameter", 10, null);
                    var temp_all = new Array();
                    temp_all[0] = MetaSimulatedSwitchParameter.ATT_UNIT;
                    temp_all[1] = MetaSimulatedSwitchParameter.ATT_VALUETYPE;
                    temp_all[2] = MetaSimulatedSwitchParameter.ATT_PRECISION;
                    temp_all[3] = MetaSimulatedSwitchParameter.ATT_NAME;
                    temp_all[4] = MetaSimulatedSwitchParameter.ATT_VALUEUNREDUNDANT;
                    temp_all[5] = MetaSimulatedSwitchParameter.ATT_RANGE;
                    temp_all[6] = MetaSimulatedSwitchParameter.ATT_VALUE;
                    var temp_references = new Array();
                    temp_all[7] = MetaSimulatedSwitchParameter.REF_OP_STATEPARAMETERS;
                    temp_all[8] = MetaSimulatedSwitchParameter.REF_PERIOD;
                    var temp_operations = new Array();
                    this.init(temp_all);
                }
                MetaSimulatedSwitchParameter.getInstance = function () {
                    if (MetaSimulatedSwitchParameter.INSTANCE == null) {
                        MetaSimulatedSwitchParameter.INSTANCE = new org.kubi.meta.MetaSimulatedSwitchParameter();
                    }
                    return MetaSimulatedSwitchParameter.INSTANCE;
                };
                MetaSimulatedSwitchParameter.INSTANCE = null;
                MetaSimulatedSwitchParameter.ATT_UNIT = new org.kevoree.modeling.meta.impl.MetaAttribute("unit", 0, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaSimulatedSwitchParameter.ATT_VALUETYPE = new org.kevoree.modeling.meta.impl.MetaAttribute("valueType", 1, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaSimulatedSwitchParameter.ATT_PRECISION = new org.kevoree.modeling.meta.impl.MetaAttribute("precision", 2, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.DOUBLE, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaSimulatedSwitchParameter.ATT_NAME = new org.kevoree.modeling.meta.impl.MetaAttribute("name", 3, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaSimulatedSwitchParameter.ATT_VALUEUNREDUNDANT = new org.kevoree.modeling.meta.impl.MetaAttribute("valueUnredundant", 4, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaSimulatedSwitchParameter.ATT_RANGE = new org.kevoree.modeling.meta.impl.MetaAttribute("range", 5, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaSimulatedSwitchParameter.ATT_VALUE = new org.kevoree.modeling.meta.impl.MetaAttribute("value", 6, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaSimulatedSwitchParameter.REF_OP_STATEPARAMETERS = new org.kevoree.modeling.meta.impl.MetaReference("op_stateParameters", 7, false, false, function () {
                    return org.kubi.meta.MetaDevice.getInstance();
                }, "stateParameters", function () {
                    return org.kubi.meta.MetaSimulatedSwitchParameter.getInstance();
                });
                MetaSimulatedSwitchParameter.REF_PERIOD = new org.kevoree.modeling.meta.impl.MetaReference("period", 8, true, true, function () {
                    return org.kubi.meta.MetaPeriod.getInstance();
                }, "op_period", function () {
                    return org.kubi.meta.MetaSimulatedSwitchParameter.getInstance();
                });
                return MetaSimulatedSwitchParameter;
            })(org.kevoree.modeling.meta.impl.MetaClass);
            meta.MetaSimulatedSwitchParameter = MetaSimulatedSwitchParameter;
            var MetaStateParameter = (function (_super) {
                __extends(MetaStateParameter, _super);
                function MetaStateParameter() {
                    _super.call(this, "org.kubi.StateParameter", 4, null);
                    var temp_all = new Array();
                    temp_all[0] = MetaStateParameter.ATT_UNIT;
                    temp_all[1] = MetaStateParameter.ATT_VALUETYPE;
                    temp_all[2] = MetaStateParameter.ATT_PRECISION;
                    temp_all[3] = MetaStateParameter.ATT_NAME;
                    temp_all[4] = MetaStateParameter.ATT_RANGE;
                    temp_all[5] = MetaStateParameter.ATT_VALUE;
                    var temp_references = new Array();
                    temp_all[6] = MetaStateParameter.REF_OP_STATEPARAMETERS;
                    temp_all[7] = MetaStateParameter.REF_PERIOD;
                    var temp_operations = new Array();
                    this.init(temp_all);
                }
                MetaStateParameter.getInstance = function () {
                    if (MetaStateParameter.INSTANCE == null) {
                        MetaStateParameter.INSTANCE = new org.kubi.meta.MetaStateParameter();
                    }
                    return MetaStateParameter.INSTANCE;
                };
                MetaStateParameter.INSTANCE = null;
                MetaStateParameter.ATT_UNIT = new org.kevoree.modeling.meta.impl.MetaAttribute("unit", 0, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaStateParameter.ATT_VALUETYPE = new org.kevoree.modeling.meta.impl.MetaAttribute("valueType", 1, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaStateParameter.ATT_PRECISION = new org.kevoree.modeling.meta.impl.MetaAttribute("precision", 2, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.DOUBLE, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaStateParameter.ATT_NAME = new org.kevoree.modeling.meta.impl.MetaAttribute("name", 3, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaStateParameter.ATT_RANGE = new org.kevoree.modeling.meta.impl.MetaAttribute("range", 4, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaStateParameter.ATT_VALUE = new org.kevoree.modeling.meta.impl.MetaAttribute("value", 5, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaStateParameter.REF_OP_STATEPARAMETERS = new org.kevoree.modeling.meta.impl.MetaReference("op_stateParameters", 6, false, false, function () {
                    return org.kubi.meta.MetaDevice.getInstance();
                }, "stateParameters", function () {
                    return org.kubi.meta.MetaStateParameter.getInstance();
                });
                MetaStateParameter.REF_PERIOD = new org.kevoree.modeling.meta.impl.MetaReference("period", 7, true, true, function () {
                    return org.kubi.meta.MetaPeriod.getInstance();
                }, "op_period", function () {
                    return org.kubi.meta.MetaStateParameter.getInstance();
                });
                return MetaStateParameter;
            })(org.kevoree.modeling.meta.impl.MetaClass);
            meta.MetaStateParameter = MetaStateParameter;
            var MetaTechnology = (function (_super) {
                __extends(MetaTechnology, _super);
                function MetaTechnology() {
                    _super.call(this, "org.kubi.Technology", 2, null);
                    var temp_all = new Array();
                    temp_all[0] = MetaTechnology.ATT_NAME;
                    var temp_references = new Array();
                    temp_all[1] = MetaTechnology.REF_DEVICES;
                    temp_all[2] = MetaTechnology.REF_CATALOG;
                    temp_all[3] = MetaTechnology.REF_OP_TECHNOLOGIES;
                    var temp_operations = new Array();
                    this.init(temp_all);
                }
                MetaTechnology.getInstance = function () {
                    if (MetaTechnology.INSTANCE == null) {
                        MetaTechnology.INSTANCE = new org.kubi.meta.MetaTechnology();
                    }
                    return MetaTechnology.INSTANCE;
                };
                MetaTechnology.INSTANCE = null;
                MetaTechnology.ATT_NAME = new org.kevoree.modeling.meta.impl.MetaAttribute("name", 0, 0, true, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaTechnology.REF_DEVICES = new org.kevoree.modeling.meta.impl.MetaReference("devices", 1, true, false, function () {
                    return org.kubi.meta.MetaDevice.getInstance();
                }, "technology", function () {
                    return org.kubi.meta.MetaTechnology.getInstance();
                });
                MetaTechnology.REF_CATALOG = new org.kevoree.modeling.meta.impl.MetaReference("catalog", 2, true, true, function () {
                    return org.kubi.meta.MetaCatalog.getInstance();
                }, "op_catalog", function () {
                    return org.kubi.meta.MetaTechnology.getInstance();
                });
                MetaTechnology.REF_OP_TECHNOLOGIES = new org.kevoree.modeling.meta.impl.MetaReference("op_technologies", 3, false, false, function () {
                    return org.kubi.meta.MetaEcosystem.getInstance();
                }, "technologies", function () {
                    return org.kubi.meta.MetaTechnology.getInstance();
                });
                return MetaTechnology;
            })(org.kevoree.modeling.meta.impl.MetaClass);
            meta.MetaTechnology = MetaTechnology;
            var MetaZWaveProduct = (function (_super) {
                __extends(MetaZWaveProduct, _super);
                function MetaZWaveProduct() {
                    _super.call(this, "org.kubi.ZWaveProduct", 13, null);
                    var temp_all = new Array();
                    temp_all[0] = MetaZWaveProduct.ATT_NAME;
                    temp_all[1] = MetaZWaveProduct.ATT_ID;
                    temp_all[2] = MetaZWaveProduct.ATT_TYPE;
                    var temp_references = new Array();
                    temp_all[3] = MetaZWaveProduct.REF_COMMANDCLASSES;
                    temp_all[4] = MetaZWaveProduct.REF_OP_PRODUCTS;
                    var temp_operations = new Array();
                    this.init(temp_all);
                }
                MetaZWaveProduct.getInstance = function () {
                    if (MetaZWaveProduct.INSTANCE == null) {
                        MetaZWaveProduct.INSTANCE = new org.kubi.meta.MetaZWaveProduct();
                    }
                    return MetaZWaveProduct.INSTANCE;
                };
                MetaZWaveProduct.INSTANCE = null;
                MetaZWaveProduct.ATT_NAME = new org.kevoree.modeling.meta.impl.MetaAttribute("name", 0, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaZWaveProduct.ATT_ID = new org.kevoree.modeling.meta.impl.MetaAttribute("id", 1, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.INT, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaZWaveProduct.ATT_TYPE = new org.kevoree.modeling.meta.impl.MetaAttribute("type", 2, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.INT, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                MetaZWaveProduct.REF_COMMANDCLASSES = new org.kevoree.modeling.meta.impl.MetaReference("commandClasses", 3, true, false, function () {
                    return org.kubi.zwave.meta.MetaCommandClass.getInstance();
                }, "op_commandClasses", function () {
                    return org.kubi.meta.MetaZWaveProduct.getInstance();
                });
                MetaZWaveProduct.REF_OP_PRODUCTS = new org.kevoree.modeling.meta.impl.MetaReference("op_products", 4, false, false, function () {
                    return org.kubi.meta.MetaManufacturer.getInstance();
                }, "products", function () {
                    return org.kubi.meta.MetaZWaveProduct.getInstance();
                });
                return MetaZWaveProduct;
            })(org.kevoree.modeling.meta.impl.MetaClass);
            meta.MetaZWaveProduct = MetaZWaveProduct;
        })(meta = kubi.meta || (kubi.meta = {}));
        var zwave;
        (function (zwave) {
            var impl;
            (function (impl) {
                var AssociationGroupImpl = (function (_super) {
                    __extends(AssociationGroupImpl, _super);
                    function AssociationGroupImpl(p_universe, p_time, p_uuid, p_metaClass, p_manager) {
                        _super.call(this, p_universe, p_time, p_uuid, p_metaClass, p_manager);
                    }
                    AssociationGroupImpl.prototype.getAuto = function () {
                        return this.get(org.kubi.zwave.meta.MetaAssociationGroup.ATT_AUTO);
                    };
                    AssociationGroupImpl.prototype.setAuto = function (p_obj) {
                        this.set(org.kubi.zwave.meta.MetaAssociationGroup.ATT_AUTO, p_obj);
                        return this;
                    };
                    AssociationGroupImpl.prototype.getMaxAssociations = function () {
                        return this.get(org.kubi.zwave.meta.MetaAssociationGroup.ATT_MAXASSOCIATIONS);
                    };
                    AssociationGroupImpl.prototype.setMaxAssociations = function (p_obj) {
                        this.set(org.kubi.zwave.meta.MetaAssociationGroup.ATT_MAXASSOCIATIONS, p_obj);
                        return this;
                    };
                    AssociationGroupImpl.prototype.getIndex = function () {
                        return this.get(org.kubi.zwave.meta.MetaAssociationGroup.ATT_INDEX);
                    };
                    AssociationGroupImpl.prototype.setIndex = function (p_obj) {
                        this.set(org.kubi.zwave.meta.MetaAssociationGroup.ATT_INDEX, p_obj);
                        return this;
                    };
                    AssociationGroupImpl.prototype.getLabel = function () {
                        return this.get(org.kubi.zwave.meta.MetaAssociationGroup.ATT_LABEL);
                    };
                    AssociationGroupImpl.prototype.setLabel = function (p_obj) {
                        this.set(org.kubi.zwave.meta.MetaAssociationGroup.ATT_LABEL, p_obj);
                        return this;
                    };
                    return AssociationGroupImpl;
                })(org.kevoree.modeling.abs.AbstractKObject);
                impl.AssociationGroupImpl = AssociationGroupImpl;
                var AssociationImpl = (function (_super) {
                    __extends(AssociationImpl, _super);
                    function AssociationImpl(p_universe, p_time, p_uuid, p_metaClass, p_manager) {
                        _super.call(this, p_universe, p_time, p_uuid, p_metaClass, p_manager);
                    }
                    AssociationImpl.prototype.getNumGroups = function () {
                        return this.get(org.kubi.zwave.meta.MetaAssociation.ATT_NUMGROUPS);
                    };
                    AssociationImpl.prototype.setNumGroups = function (p_obj) {
                        this.set(org.kubi.zwave.meta.MetaAssociation.ATT_NUMGROUPS, p_obj);
                        return this;
                    };
                    AssociationImpl.prototype.addGroups = function (p_obj) {
                        this.mutate(org.kevoree.modeling.KActionType.ADD, org.kubi.zwave.meta.MetaAssociation.REF_GROUPS, p_obj);
                        return this;
                    };
                    AssociationImpl.prototype.removeGroups = function (p_obj) {
                        this.mutate(org.kevoree.modeling.KActionType.REMOVE, org.kubi.zwave.meta.MetaAssociation.REF_GROUPS, p_obj);
                        return this;
                    };
                    AssociationImpl.prototype.getGroups = function (cb) {
                        if (cb == null) {
                            return;
                        }
                        this.ref(org.kubi.zwave.meta.MetaAssociation.REF_GROUPS, function (kObjects) {
                            var casted = new Array();
                            for (var i = 0; i < kObjects.length; i++) {
                                casted[i] = kObjects[i];
                            }
                            cb(casted);
                        });
                    };
                    AssociationImpl.prototype.sizeOfGroups = function () {
                        return this.size(org.kubi.zwave.meta.MetaAssociation.REF_GROUPS);
                    };
                    return AssociationImpl;
                })(org.kevoree.modeling.abs.AbstractKObject);
                impl.AssociationImpl = AssociationImpl;
                var CommandClassImpl = (function (_super) {
                    __extends(CommandClassImpl, _super);
                    function CommandClassImpl(p_universe, p_time, p_uuid, p_metaClass, p_manager) {
                        _super.call(this, p_universe, p_time, p_uuid, p_metaClass, p_manager);
                    }
                    CommandClassImpl.prototype.getId = function () {
                        return this.get(org.kubi.zwave.meta.MetaCommandClass.ATT_ID);
                    };
                    CommandClassImpl.prototype.setId = function (p_obj) {
                        this.set(org.kubi.zwave.meta.MetaCommandClass.ATT_ID, p_obj);
                        return this;
                    };
                    CommandClassImpl.prototype.addAssociations = function (p_obj) {
                        this.mutate(org.kevoree.modeling.KActionType.ADD, org.kubi.zwave.meta.MetaCommandClass.REF_ASSOCIATIONS, p_obj);
                        return this;
                    };
                    CommandClassImpl.prototype.removeAssociations = function (p_obj) {
                        this.mutate(org.kevoree.modeling.KActionType.REMOVE, org.kubi.zwave.meta.MetaCommandClass.REF_ASSOCIATIONS, p_obj);
                        return this;
                    };
                    CommandClassImpl.prototype.getAssociations = function (cb) {
                        if (cb == null) {
                            return;
                        }
                        this.ref(org.kubi.zwave.meta.MetaCommandClass.REF_ASSOCIATIONS, function (kObjects) {
                            var casted = new Array();
                            for (var i = 0; i < kObjects.length; i++) {
                                casted[i] = kObjects[i];
                            }
                            cb(casted);
                        });
                    };
                    CommandClassImpl.prototype.sizeOfAssociations = function () {
                        return this.size(org.kubi.zwave.meta.MetaCommandClass.REF_ASSOCIATIONS);
                    };
                    CommandClassImpl.prototype.addParameters = function (p_obj) {
                        this.mutate(org.kevoree.modeling.KActionType.ADD, org.kubi.zwave.meta.MetaCommandClass.REF_PARAMETERS, p_obj);
                        return this;
                    };
                    CommandClassImpl.prototype.removeParameters = function (p_obj) {
                        this.mutate(org.kevoree.modeling.KActionType.REMOVE, org.kubi.zwave.meta.MetaCommandClass.REF_PARAMETERS, p_obj);
                        return this;
                    };
                    CommandClassImpl.prototype.getParameters = function (cb) {
                        if (cb == null) {
                            return;
                        }
                        this.ref(org.kubi.zwave.meta.MetaCommandClass.REF_PARAMETERS, function (kObjects) {
                            var casted = new Array();
                            for (var i = 0; i < kObjects.length; i++) {
                                casted[i] = kObjects[i];
                            }
                            cb(casted);
                        });
                    };
                    CommandClassImpl.prototype.sizeOfParameters = function () {
                        return this.size(org.kubi.zwave.meta.MetaCommandClass.REF_PARAMETERS);
                    };
                    return CommandClassImpl;
                })(org.kevoree.modeling.abs.AbstractKObject);
                impl.CommandClassImpl = CommandClassImpl;
                var ParameterImpl = (function (_super) {
                    __extends(ParameterImpl, _super);
                    function ParameterImpl(p_universe, p_time, p_uuid, p_metaClass, p_manager) {
                        _super.call(this, p_universe, p_time, p_uuid, p_metaClass, p_manager);
                    }
                    ParameterImpl.prototype.getHelp = function () {
                        return this.get(org.kubi.zwave.meta.MetaParameter.ATT_HELP);
                    };
                    ParameterImpl.prototype.setHelp = function (p_obj) {
                        this.set(org.kubi.zwave.meta.MetaParameter.ATT_HELP, p_obj);
                        return this;
                    };
                    ParameterImpl.prototype.getInstance = function () {
                        return this.get(org.kubi.zwave.meta.MetaParameter.ATT_INSTANCE);
                    };
                    ParameterImpl.prototype.setInstance = function (p_obj) {
                        this.set(org.kubi.zwave.meta.MetaParameter.ATT_INSTANCE, p_obj);
                        return this;
                    };
                    ParameterImpl.prototype.getMin = function () {
                        return this.get(org.kubi.zwave.meta.MetaParameter.ATT_MIN);
                    };
                    ParameterImpl.prototype.setMin = function (p_obj) {
                        this.set(org.kubi.zwave.meta.MetaParameter.ATT_MIN, p_obj);
                        return this;
                    };
                    ParameterImpl.prototype.getSize = function () {
                        return this.get(org.kubi.zwave.meta.MetaParameter.ATT_SIZE);
                    };
                    ParameterImpl.prototype.setSize = function (p_obj) {
                        this.set(org.kubi.zwave.meta.MetaParameter.ATT_SIZE, p_obj);
                        return this;
                    };
                    ParameterImpl.prototype.getMax = function () {
                        return this.get(org.kubi.zwave.meta.MetaParameter.ATT_MAX);
                    };
                    ParameterImpl.prototype.setMax = function (p_obj) {
                        this.set(org.kubi.zwave.meta.MetaParameter.ATT_MAX, p_obj);
                        return this;
                    };
                    ParameterImpl.prototype.getName = function () {
                        return this.get(org.kubi.zwave.meta.MetaParameter.ATT_NAME);
                    };
                    ParameterImpl.prototype.setName = function (p_obj) {
                        this.set(org.kubi.zwave.meta.MetaParameter.ATT_NAME, p_obj);
                        return this;
                    };
                    ParameterImpl.prototype.getGenre = function () {
                        return this.get(org.kubi.zwave.meta.MetaParameter.ATT_GENRE);
                    };
                    ParameterImpl.prototype.setGenre = function (p_obj) {
                        this.set(org.kubi.zwave.meta.MetaParameter.ATT_GENRE, p_obj);
                        return this;
                    };
                    ParameterImpl.prototype.getIndex = function () {
                        return this.get(org.kubi.zwave.meta.MetaParameter.ATT_INDEX);
                    };
                    ParameterImpl.prototype.setIndex = function (p_obj) {
                        this.set(org.kubi.zwave.meta.MetaParameter.ATT_INDEX, p_obj);
                        return this;
                    };
                    ParameterImpl.prototype.getLabel = function () {
                        return this.get(org.kubi.zwave.meta.MetaParameter.ATT_LABEL);
                    };
                    ParameterImpl.prototype.setLabel = function (p_obj) {
                        this.set(org.kubi.zwave.meta.MetaParameter.ATT_LABEL, p_obj);
                        return this;
                    };
                    ParameterImpl.prototype.getType = function () {
                        return this.get(org.kubi.zwave.meta.MetaParameter.ATT_TYPE);
                    };
                    ParameterImpl.prototype.setType = function (p_obj) {
                        this.set(org.kubi.zwave.meta.MetaParameter.ATT_TYPE, p_obj);
                        return this;
                    };
                    ParameterImpl.prototype.getValue = function () {
                        return this.get(org.kubi.zwave.meta.MetaParameter.ATT_VALUE);
                    };
                    ParameterImpl.prototype.setValue = function (p_obj) {
                        this.set(org.kubi.zwave.meta.MetaParameter.ATT_VALUE, p_obj);
                        return this;
                    };
                    ParameterImpl.prototype.addItems = function (p_obj) {
                        this.mutate(org.kevoree.modeling.KActionType.ADD, org.kubi.zwave.meta.MetaParameter.REF_ITEMS, p_obj);
                        return this;
                    };
                    ParameterImpl.prototype.removeItems = function (p_obj) {
                        this.mutate(org.kevoree.modeling.KActionType.REMOVE, org.kubi.zwave.meta.MetaParameter.REF_ITEMS, p_obj);
                        return this;
                    };
                    ParameterImpl.prototype.getItems = function (cb) {
                        if (cb == null) {
                            return;
                        }
                        this.ref(org.kubi.zwave.meta.MetaParameter.REF_ITEMS, function (kObjects) {
                            var casted = new Array();
                            for (var i = 0; i < kObjects.length; i++) {
                                casted[i] = kObjects[i];
                            }
                            cb(casted);
                        });
                    };
                    ParameterImpl.prototype.sizeOfItems = function () {
                        return this.size(org.kubi.zwave.meta.MetaParameter.REF_ITEMS);
                    };
                    return ParameterImpl;
                })(org.kevoree.modeling.abs.AbstractKObject);
                impl.ParameterImpl = ParameterImpl;
                var ParameterItemImpl = (function (_super) {
                    __extends(ParameterItemImpl, _super);
                    function ParameterItemImpl(p_universe, p_time, p_uuid, p_metaClass, p_manager) {
                        _super.call(this, p_universe, p_time, p_uuid, p_metaClass, p_manager);
                    }
                    ParameterItemImpl.prototype.getLabel = function () {
                        return this.get(org.kubi.zwave.meta.MetaParameterItem.ATT_LABEL);
                    };
                    ParameterItemImpl.prototype.setLabel = function (p_obj) {
                        this.set(org.kubi.zwave.meta.MetaParameterItem.ATT_LABEL, p_obj);
                        return this;
                    };
                    ParameterItemImpl.prototype.getValue = function () {
                        return this.get(org.kubi.zwave.meta.MetaParameterItem.ATT_VALUE);
                    };
                    ParameterItemImpl.prototype.setValue = function (p_obj) {
                        this.set(org.kubi.zwave.meta.MetaParameterItem.ATT_VALUE, p_obj);
                        return this;
                    };
                    return ParameterItemImpl;
                })(org.kevoree.modeling.abs.AbstractKObject);
                impl.ParameterItemImpl = ParameterItemImpl;
            })(impl = zwave.impl || (zwave.impl = {}));
            var meta;
            (function (meta) {
                var MetaAssociation = (function (_super) {
                    __extends(MetaAssociation, _super);
                    function MetaAssociation() {
                        _super.call(this, "org.kubi.zwave.Association", 16, null);
                        var temp_all = new Array();
                        temp_all[0] = MetaAssociation.ATT_NUMGROUPS;
                        var temp_references = new Array();
                        temp_all[1] = MetaAssociation.REF_GROUPS;
                        temp_all[2] = MetaAssociation.REF_OP_ASSOCIATIONS;
                        var temp_operations = new Array();
                        this.init(temp_all);
                    }
                    MetaAssociation.getInstance = function () {
                        if (MetaAssociation.INSTANCE == null) {
                            MetaAssociation.INSTANCE = new org.kubi.zwave.meta.MetaAssociation();
                        }
                        return MetaAssociation.INSTANCE;
                    };
                    MetaAssociation.INSTANCE = null;
                    MetaAssociation.ATT_NUMGROUPS = new org.kevoree.modeling.meta.impl.MetaAttribute("numGroups", 0, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.INT, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                    MetaAssociation.REF_GROUPS = new org.kevoree.modeling.meta.impl.MetaReference("groups", 1, true, false, function () {
                        return org.kubi.zwave.meta.MetaAssociationGroup.getInstance();
                    }, "op_groups", function () {
                        return org.kubi.zwave.meta.MetaAssociation.getInstance();
                    });
                    MetaAssociation.REF_OP_ASSOCIATIONS = new org.kevoree.modeling.meta.impl.MetaReference("op_associations", 2, false, false, function () {
                        return org.kubi.zwave.meta.MetaCommandClass.getInstance();
                    }, "associations", function () {
                        return org.kubi.zwave.meta.MetaAssociation.getInstance();
                    });
                    return MetaAssociation;
                })(org.kevoree.modeling.meta.impl.MetaClass);
                meta.MetaAssociation = MetaAssociation;
                var MetaAssociationGroup = (function (_super) {
                    __extends(MetaAssociationGroup, _super);
                    function MetaAssociationGroup() {
                        _super.call(this, "org.kubi.zwave.AssociationGroup", 18, null);
                        var temp_all = new Array();
                        temp_all[0] = MetaAssociationGroup.ATT_AUTO;
                        temp_all[1] = MetaAssociationGroup.ATT_MAXASSOCIATIONS;
                        temp_all[2] = MetaAssociationGroup.ATT_INDEX;
                        temp_all[3] = MetaAssociationGroup.ATT_LABEL;
                        var temp_references = new Array();
                        temp_all[4] = MetaAssociationGroup.REF_OP_GROUPS;
                        var temp_operations = new Array();
                        this.init(temp_all);
                    }
                    MetaAssociationGroup.getInstance = function () {
                        if (MetaAssociationGroup.INSTANCE == null) {
                            MetaAssociationGroup.INSTANCE = new org.kubi.zwave.meta.MetaAssociationGroup();
                        }
                        return MetaAssociationGroup.INSTANCE;
                    };
                    MetaAssociationGroup.INSTANCE = null;
                    MetaAssociationGroup.ATT_AUTO = new org.kevoree.modeling.meta.impl.MetaAttribute("auto", 0, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.BOOL, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                    MetaAssociationGroup.ATT_MAXASSOCIATIONS = new org.kevoree.modeling.meta.impl.MetaAttribute("maxAssociations", 1, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.INT, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                    MetaAssociationGroup.ATT_INDEX = new org.kevoree.modeling.meta.impl.MetaAttribute("index", 2, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.INT, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                    MetaAssociationGroup.ATT_LABEL = new org.kevoree.modeling.meta.impl.MetaAttribute("label", 3, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                    MetaAssociationGroup.REF_OP_GROUPS = new org.kevoree.modeling.meta.impl.MetaReference("op_groups", 4, false, false, function () {
                        return org.kubi.zwave.meta.MetaAssociation.getInstance();
                    }, "groups", function () {
                        return org.kubi.zwave.meta.MetaAssociationGroup.getInstance();
                    });
                    return MetaAssociationGroup;
                })(org.kevoree.modeling.meta.impl.MetaClass);
                meta.MetaAssociationGroup = MetaAssociationGroup;
                var MetaCommandClass = (function (_super) {
                    __extends(MetaCommandClass, _super);
                    function MetaCommandClass() {
                        _super.call(this, "org.kubi.zwave.CommandClass", 14, null);
                        var temp_all = new Array();
                        temp_all[0] = MetaCommandClass.ATT_ID;
                        var temp_references = new Array();
                        temp_all[1] = MetaCommandClass.REF_ASSOCIATIONS;
                        temp_all[2] = MetaCommandClass.REF_PARAMETERS;
                        temp_all[3] = MetaCommandClass.REF_OP_COMMANDCLASSES;
                        var temp_operations = new Array();
                        this.init(temp_all);
                    }
                    MetaCommandClass.getInstance = function () {
                        if (MetaCommandClass.INSTANCE == null) {
                            MetaCommandClass.INSTANCE = new org.kubi.zwave.meta.MetaCommandClass();
                        }
                        return MetaCommandClass.INSTANCE;
                    };
                    MetaCommandClass.INSTANCE = null;
                    MetaCommandClass.ATT_ID = new org.kevoree.modeling.meta.impl.MetaAttribute("id", 0, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.INT, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                    MetaCommandClass.REF_ASSOCIATIONS = new org.kevoree.modeling.meta.impl.MetaReference("associations", 1, true, false, function () {
                        return org.kubi.zwave.meta.MetaAssociation.getInstance();
                    }, "op_associations", function () {
                        return org.kubi.zwave.meta.MetaCommandClass.getInstance();
                    });
                    MetaCommandClass.REF_PARAMETERS = new org.kevoree.modeling.meta.impl.MetaReference("parameters", 2, true, false, function () {
                        return org.kubi.zwave.meta.MetaParameter.getInstance();
                    }, "op_parameters", function () {
                        return org.kubi.zwave.meta.MetaCommandClass.getInstance();
                    });
                    MetaCommandClass.REF_OP_COMMANDCLASSES = new org.kevoree.modeling.meta.impl.MetaReference("op_commandClasses", 3, false, false, function () {
                        return org.kubi.meta.MetaZWaveProduct.getInstance();
                    }, "commandClasses", function () {
                        return org.kubi.zwave.meta.MetaCommandClass.getInstance();
                    });
                    return MetaCommandClass;
                })(org.kevoree.modeling.meta.impl.MetaClass);
                meta.MetaCommandClass = MetaCommandClass;
                var MetaParameter = (function (_super) {
                    __extends(MetaParameter, _super);
                    function MetaParameter() {
                        _super.call(this, "org.kubi.zwave.Parameter", 15, null);
                        var temp_all = new Array();
                        temp_all[0] = MetaParameter.ATT_HELP;
                        temp_all[1] = MetaParameter.ATT_INSTANCE;
                        temp_all[2] = MetaParameter.ATT_MIN;
                        temp_all[3] = MetaParameter.ATT_SIZE;
                        temp_all[4] = MetaParameter.ATT_MAX;
                        temp_all[5] = MetaParameter.ATT_NAME;
                        temp_all[6] = MetaParameter.ATT_GENRE;
                        temp_all[7] = MetaParameter.ATT_INDEX;
                        temp_all[8] = MetaParameter.ATT_LABEL;
                        temp_all[9] = MetaParameter.ATT_TYPE;
                        temp_all[10] = MetaParameter.ATT_VALUE;
                        var temp_references = new Array();
                        temp_all[11] = MetaParameter.REF_OP_PARAMETERS;
                        temp_all[12] = MetaParameter.REF_ITEMS;
                        var temp_operations = new Array();
                        this.init(temp_all);
                    }
                    MetaParameter.getInstance = function () {
                        if (MetaParameter.INSTANCE == null) {
                            MetaParameter.INSTANCE = new org.kubi.zwave.meta.MetaParameter();
                        }
                        return MetaParameter.INSTANCE;
                    };
                    MetaParameter.INSTANCE = null;
                    MetaParameter.ATT_HELP = new org.kevoree.modeling.meta.impl.MetaAttribute("help", 0, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                    MetaParameter.ATT_INSTANCE = new org.kevoree.modeling.meta.impl.MetaAttribute("instance", 1, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.INT, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                    MetaParameter.ATT_MIN = new org.kevoree.modeling.meta.impl.MetaAttribute("min", 2, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.LONG, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                    MetaParameter.ATT_SIZE = new org.kevoree.modeling.meta.impl.MetaAttribute("size", 3, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.INT, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                    MetaParameter.ATT_MAX = new org.kevoree.modeling.meta.impl.MetaAttribute("max", 4, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.LONG, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                    MetaParameter.ATT_NAME = new org.kevoree.modeling.meta.impl.MetaAttribute("name", 5, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                    MetaParameter.ATT_GENRE = new org.kevoree.modeling.meta.impl.MetaAttribute("genre", 6, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                    MetaParameter.ATT_INDEX = new org.kevoree.modeling.meta.impl.MetaAttribute("index", 7, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.INT, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                    MetaParameter.ATT_LABEL = new org.kevoree.modeling.meta.impl.MetaAttribute("label", 8, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                    MetaParameter.ATT_TYPE = new org.kevoree.modeling.meta.impl.MetaAttribute("type", 9, 0, false, org.kubi.meta.MetaParameterType.getInstance(), org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                    MetaParameter.ATT_VALUE = new org.kevoree.modeling.meta.impl.MetaAttribute("value", 10, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                    MetaParameter.REF_OP_PARAMETERS = new org.kevoree.modeling.meta.impl.MetaReference("op_parameters", 11, false, false, function () {
                        return org.kubi.zwave.meta.MetaCommandClass.getInstance();
                    }, "parameters", function () {
                        return org.kubi.zwave.meta.MetaParameter.getInstance();
                    });
                    MetaParameter.REF_ITEMS = new org.kevoree.modeling.meta.impl.MetaReference("items", 12, true, false, function () {
                        return org.kubi.zwave.meta.MetaParameterItem.getInstance();
                    }, "op_items", function () {
                        return org.kubi.zwave.meta.MetaParameter.getInstance();
                    });
                    return MetaParameter;
                })(org.kevoree.modeling.meta.impl.MetaClass);
                meta.MetaParameter = MetaParameter;
                var MetaParameterItem = (function (_super) {
                    __extends(MetaParameterItem, _super);
                    function MetaParameterItem() {
                        _super.call(this, "org.kubi.zwave.ParameterItem", 17, null);
                        var temp_all = new Array();
                        temp_all[0] = MetaParameterItem.ATT_LABEL;
                        temp_all[1] = MetaParameterItem.ATT_VALUE;
                        var temp_references = new Array();
                        temp_all[2] = MetaParameterItem.REF_OP_ITEMS;
                        var temp_operations = new Array();
                        this.init(temp_all);
                    }
                    MetaParameterItem.getInstance = function () {
                        if (MetaParameterItem.INSTANCE == null) {
                            MetaParameterItem.INSTANCE = new org.kubi.zwave.meta.MetaParameterItem();
                        }
                        return MetaParameterItem.INSTANCE;
                    };
                    MetaParameterItem.INSTANCE = null;
                    MetaParameterItem.ATT_LABEL = new org.kevoree.modeling.meta.impl.MetaAttribute("label", 0, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.STRING, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                    MetaParameterItem.ATT_VALUE = new org.kevoree.modeling.meta.impl.MetaAttribute("value", 1, 0, false, org.kevoree.modeling.meta.KPrimitiveTypes.INT, org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation.instance());
                    MetaParameterItem.REF_OP_ITEMS = new org.kevoree.modeling.meta.impl.MetaReference("op_items", 2, false, false, function () {
                        return org.kubi.zwave.meta.MetaParameter.getInstance();
                    }, "items", function () {
                        return org.kubi.zwave.meta.MetaParameterItem.getInstance();
                    });
                    return MetaParameterItem;
                })(org.kevoree.modeling.meta.impl.MetaClass);
                meta.MetaParameterItem = MetaParameterItem;
            })(meta = zwave.meta || (zwave.meta = {}));
        })(zwave = kubi.zwave || (kubi.zwave = {}));
    })(kubi = org.kubi || (org.kubi = {}));
})(org || (org = {}));
