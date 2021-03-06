var express = require('express');
var http = require('http');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var proxy_host = process.env.HTTP_PROXY_HOST || '127.0.0.1';
    var proxy_port = process.env.HTTP_PROXY_PORT || '30101'; // 13092
    var service_addr = process.env.SERVICE_ADDR || 'fusionweather'

    // Adapt to the scenario without Mesher.You only need to configure the SERVICE_ADDR
    if (service_addr.split(":").length === 2
        && typeof (process.env.HTTP_PROXY_HOST) == 'undefined'
        && typeof (process.env.HTTP_PROXY_PORT) == 'undefined') {
        proxy_host = service_addr.split(":")[0];
        proxy_port = service_addr.split(":")[1];
    }

    console.log('service_addr is ' + service_addr);
    console.log(proxy_host + ':' + proxy_port);
    console.log(req.query.city + ", " + req.query.type);

    var opt = {
        host: proxy_host,
        port: proxy_port,
        method: 'GET',
        path: 'http://' + service_addr + '/fusionweather/show?city=' + req.query.city,
        headers: {}
    };
    if (req.query.user) {
        opt.path = opt.path + "&user=" + req.query.user;
    }
    console.log(opt.path);
    var body = '';
    var request = http.request(opt, function (response) {
        console.log("Got response: " + response.statusCode);
        response.on('data', function (d) {
            body += d;
        }).on('end', function () {
            console.log(body);
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf8'});
            res.write(body);
            res.end();
        });
    }).on('error', function (e) {
        console.log("Got error: " + e.message);
    });
    request.end();
});

module.exports = router;
