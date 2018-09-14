'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _slicedToArray = (function() {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i['return']) _i['return']();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
  return function(arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError('Invalid attempt to destructure non-iterable instance');
    }
  };
})();

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _module2 = require('module');

var _module3 = _interopRequireDefault(_module2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

var _module = new _module3.default();

var modulePath = _path2.default.dirname(
  _module3.default._resolveFilename(
    'date-fns2',
    _extends({}, _module, {
      paths: _module3.default._nodeModulePaths(process.cwd()),
    })
  )
);

var indexFile = _fs2.default.readFileSync(modulePath + '/index.js', 'utf-8');
var regStr = "([\\S]+): require\\('.\\/([\\S]+)\\/index.js'\\)";

var regx = new RegExp(regStr);
var globalRegx = new RegExp(regStr, 'g');

var pkgMap = indexFile
  .match(globalRegx)
  .map(function(exp) {
    return exp.match(regx).slice(1);
  })
  .reduce(function(result, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      pkgId = _ref2[0],
      path = _ref2[1];

    return _extends({}, result, _defineProperty({}, pkgId, path));
  }, {});

exports.default = function(_ref3) {
  var t = _ref3.types;
  return {
    visitor: {
      ImportDeclaration: function ImportDeclaration(path) {
        var node = path.node;
        var specifiers = node.specifiers,
          source = node.source;
        var pkgId = source.value;

        if (pkgId !== 'date-fns2') {
          return;
        }

        if (!specifiers.filter(t.isImportSpecifier).length) {
          return;
        }

        specifiers.forEach(function(spec) {
          var _spec = spec,
            local = _spec.local,
            imported = _spec.imported;
          var localName = local.name;

          var importedPath = 'date-fns2';

          if (t.isImportSpecifier(spec)) {
            var importedName = imported.name;

            spec = t.importDefaultSpecifier(t.identifier(localName));

            if (!pkgMap[importedName]) {
              throw new Error('date-fns2 does not contain module "' + importedName + '"');
            }

            importedPath = 'date-fns2/' + pkgMap[importedName];
          }

          path.insertAfter(t.importDeclaration([spec], t.stringLiteral(importedPath)));
        });

        path.remove();
      },
    },
  };
};
