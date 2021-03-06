'use strict';

import request from 'superagent';
import debug from 'debug';

class Apigen {
  constructor(props) {
    props = props || {};
    this.__host = props.host;
    this.debug = false;
  }

  _debug(...args) {
    if (!this.debug) { return; }
    debug(...args);
  }

  createEndpoint(args) {
    let apiFn = (opts, cb) => {
      let {method, path, body, url, attach, statusCodes, ...otherOpts} = args(opts);
      let action = (method === 'get') ? 'query' : 'send';
      let _url = url || `${url || this.__host}${path}`;
      let req = request[method](_url);

      this.__debug('APIGEN[REQUEST]', {...args(opts)});

      if (attach) {
        attach.forEach(itm => {
          let fname = Object.keys(itm)[0];
          req.attach(fname, itm[fname]);
        });
      }

      req[action]({...body})
        .end((res) => {
          this.__debug('APIGEN[RESPONSE]:', res);
          let status = statusCodes[res.status] || statusCodes.default;
          let err = (!res.ok) ? new Error(status) : null;
          let _body = res.body || res.text;
          cb(err, _body);
        });
    };

    if (args.name) {
      this[args.name] = apiFn;
    }
    return apiFn;
  }
}

export default Apigen;

