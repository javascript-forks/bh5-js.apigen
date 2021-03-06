'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var Apigen = (function () {
  function Apigen(props) {
    _classCallCheck(this, Apigen);

    props = props || {};
    this.__host = props.host;
    this.debug = false;
  }

  Apigen.prototype.__debug = function __debug() {
    if (!this.debug) {
      return;
    }
    _debug2['default'].apply(undefined, arguments);
  };

  Apigen.prototype.createEndpoint = function createEndpoint(args) {
    var _this = this;

    var apiFn = function apiFn(opts, cb) {
      var _args = args(opts);

      var method = _args.method;
      var path = _args.path;
      var body = _args.body;
      var attach = _args.attach;
      var statusCodes = _args.statusCodes;

      var otherOpts = _objectWithoutProperties(_args, ['method', 'path', 'body', 'attach', 'statusCodes']);

      var action = method === 'get' ? 'query' : 'send';
      var req = _superagent2['default'][method]('' + _this.__host + path);
      _this.__debug('APIGEN[REQUEST]', _extends({
        method: method,
        action: action,
        path: path,
        body: body,
        statusCodes: statusCodes
      }, otherOpts));

      if (attach) {
        attach.forEach(function (itm) {
          var fname = Object.keys(itm)[0];
          req.attach(fname, itm[fname]);
        });
      }

      req[action](_extends({}, body)).end(function (res) {
        _this.__debug('APIGEN[RESPONSE]:', res);
        var status = statusCodes[res.status];
        var err = !res.ok ? new Error(status) : false;
        var _body = res.body || res.text;
        cb(err, _body);
      });
    };

    if (args.name) {
      this[args.name] = apiFn;
    }
    return apiFn;
  };

  return Apigen;
})();

exports['default'] = Apigen;
module.exports = exports['default'];