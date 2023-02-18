import express from 'express';
const router = express.Router();

import jsonld from '../modules/seo/json-ld.mjs';

router.get('/map', (req, res, next) => {
  const lat = req.query.lat ? req.query.lat * 1.0 : 0.0;
  const lng = req.query.lng ? req.query.lng * 1.0 : 0.0;

  res.ren('network-crystal/map', {
    elements: [],
    title: 'Network Crystal Map — 와니네',
    framed: true,
    coordinate: {
      lat: lat,
      lng: lng,
    },
  });
});

router.get('/*', (req, res, next) => {
  let query = req.url.replace(/^\//, '');

  query = decodeURI(decodeURI(query));

  parse(req, query).then((data) => {
    res.ren('network-crystal/root', {
      title: 'Network Crystal — 와니네',
      meta: {
        jsonld: jsonld.gen(
          jsonld.breadcrumb(
            { name: '와니네', item: 'https://wany.io' },
            { name: 'Network Crystal' }
          )
        ),
      },
      crystal: {
        query: query,
        desc: data.description,
        modules: data.modules,
      },
    });
  });
});

export default router;

const parsers = [];

async function parse(req, query) {
  let value = null;
  for (const parser of parsers) {
    value = await parser.parse(req, query);
    if (value) {
      return value;
    }
  }
  return {
    description: '',
    modules: [{ name: 'default', query: '' }],
  };
}

class Parser {
  constructor() {
    this.description = '';
    this.modules = [];
  }
  async parse(req, query) {
    return {
      description: this.description,
      modules: this.modules,
    };
  }
}

// IPv4
parsers.push(
  new (class IPv4Parser extends Parser {
    constructor() {
      super();
      this.description = 'IPv4';
      this.regexp =
        /^((?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/;
    }
    parse(req, query) {
      return new Promise((resolve, reject) => {
        if (!this.regexp.test(query)) {
          resolve(null);
        }

        var match = query.match(this.regexp);
        var ip = match[1];

        this.modules = [];

        this.modules.push({
          name: 'geoip',
          query: ip,
        });

        this.modules.push({
          name: 'whois',
          query: ip,
        });

        this.modules.push({
          name: 'ping',
          query: ip,
        });

        /*this.modules.push({
          name: 'traceroute',
          query: ip,
        });*/

        resolve({
          description: this.description,
          modules: this.modules,
        });
      });
    }
  })()
);

// IPv6
parsers.push(
  new (class IPv6Parser extends Parser {
    constructor() {
      super();
      this.description = 'IPv6';
      this.regexp =
        /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))(?=\s|$)/;
    }
    parse(req, query) {
      return new Promise((resolve, reject) => {
        if (!this.regexp.test(query)) {
          resolve(null);
        }

        var match = query.match(this.regexp);
        var ip = match[1];

        var fip = this.expandIPv6Address(ip);
        this.modules = [];

        this.modules.push({
          name: 'whois',
          query: ip,
        });

        resolve({
          description: this.description,
          modules: this.modules,
        });
      });
    }
    expandIPv6Address(address) {
      var fullAddress = '';
      var expandedAddress = '';
      var validGroupCount = 8;
      var validGroupSize = 4;

      var ipv4 = '';
      var extractIpv4 =
        /([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/;
      var validateIpv4 =
        /((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})/;

      // look for embedded ipv4
      if (validateIpv4.test(address)) {
        groups = address.match(extractIpv4);
        for (var i = 1; i < groups.length; i++) {
          ipv4 +=
            ('00' + parseInt(groups[i], 10).toString(16)).slice(-2) +
            (i == 2 ? ':' : '');
        }
        address = address.replace(extractIpv4, ipv4);
      }

      if (address.indexOf('::') == -1)
        // All eight groups are present.
        fullAddress = address;
      // Consecutive groups of zeroes have been collapsed with "::".
      else {
        var sides = address.split('::');
        var groupsPresent = 0;
        for (var i = 0; i < sides.length; i++) {
          groupsPresent += sides[i].split(':').length;
        }
        fullAddress += sides[0] + ':';
        for (var i = 0; i < validGroupCount - groupsPresent; i++) {
          fullAddress += '0000:';
        }
        fullAddress += sides[1];
      }
      var groups = fullAddress.split(':');
      for (var i = 0; i < validGroupCount; i++) {
        while (groups[i].length < validGroupSize) {
          groups[i] = '0' + groups[i];
        }
        expandedAddress +=
          i != validGroupCount - 1 ? groups[i] + ':' : groups[i];
      }
      return expandedAddress;
    }
  })()
);

// Domain
parsers.push(
  new (class DomainParser extends Parser {
    constructor() {
      super();
      this.description = 'Domain';
      this.regexp =
        /^(?:(?:http|https):(?:\/\/)?)?([\w\-.가-힣]+\.[\w\-가-힣]{2,})(?:\/.*)?/i;
    }
    parse(req, query) {
      return new Promise((resolve, reject) => {
        if (!this.regexp.test(query)) {
          resolve(null);
        }

        var match = query.match(this.regexp);
        var host = match[1];

        this.modules = [];

        this.modules.push({
          name: 'whois',
          query: host,
        });

        this.modules.push({
          name: 'dns',
          query: host,
        });

        this.modules.push({
          name: 'ping',
          query: host,
        });

        this.modules.push({
          name: 'subdomains',
          query: host,
        });

        resolve({
          description: this.description,
          modules: this.modules,
        });
      });
    }
  })()
);

// Your IP
parsers.push(
  new (class MyIPParser extends Parser {
    constructor() {
      super();
      this.description = 'Your IP';
      this.regexp =
        /^(?:ip|your\s*ip|my\s*ip|아이피|니\s*아이피|너\s*아이피|내\s*아이피)/i;
    }
    parse(req, query) {
      return new Promise((resolve, reject) => {
        if (!this.regexp.test(query)) {
          resolve(null);
        }

        var ip = req.body.ip ? req.body.ip : req.client.ip;

        this.modules = [];

        this.modules.push({
          name: 'yourip',
          query: ip,
        });

        this.modules.push({
          name: 'geoip',
          query: ip,
        });

        this.modules.push({
          name: 'whois',
          query: ip,
        });

        this.modules.push({
          name: 'ping',
          query: ip,
        });

        resolve({
          description: this.description,
          modules: this.modules,
        });
      });
    }
  })()
);
