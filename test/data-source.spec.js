'use strict';

var dataSource = require('utils/data-source');
var urlUtils = require('utils/url-utils');

describe('dataSource', function () {
  var xhr, requests;

  beforeEach(function () {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = function (req) { requests.push(req); };
  });

  afterEach(function () {
    // Like before we must clean up when tampering with globals.
    xhr.restore();
  });

  it('must return an object', function (done) {
    var ds = dataSource({greeting: 'hello'});
    ds.get(function (err, data){
      assert.isNull(err);
      assert.equal(data.greeting, 'hello');
      done();
    });
  });

  describe('get', function(){
    it('must complain if you don\'t pass a callback', function(){
      var ds = dataSource(undefined);
      assert.throws(function () {
        ds.get();
      }, Error, 'dataSource Error: on get method, missing callback');
    });

    it('must return null', function (done) {
      var ds = dataSource(undefined);
      ds.get(function (err, data){
        assert.isNull(err);
        assert.isNull(data);
        done();
      });
    });

    it('must perform an http request, only the first time', function (done) {
      var ds = dataSource('http://www.example.com/req');
      ds.get(function (err, data){
        assert.isNull(err);
        assert.equal(data.greeting, 'hello');
      });

      ds.get(function (err, data){
        assert.isNull(err);
        assert.equal(data.greeting, 'hello');
        assert.equal(requests.length, 1);
        done();
      });

      requests[0].respond(200, { 'Content-Type': 'application/json' }, '{"greeting": "hello"}');
    });

    it('must throw an error for invalid 404', function (done) {
      var ds = dataSource('http://www.example.com/req');
      ds.get(function (err){
        assert.equal(err.message, 'HttpRequest Error: Not Found');
      });

      ds.get(function (err){
        assert.equal(err.message, 'HttpRequest Error: Not Found');
        assert.equal(requests.length, 1);
        done();
      });

      requests[0].respond(404, { 'Content-Type': 'text/plain' }, 'not found');

    });

    it('must throw an error for invalid 500', function (done) {
      var ds = dataSource('http://www.example.com/req');
      ds.get(function (err){
        assert.equal(err.message, 'HttpRequest Error: Internal Server Error');
        done();
      });

      requests[0].respond(500, { 'Content-Type': 'text/plain' }, 'server error');

    });

    it('must throw an error for invalid JSON', function (done) {
      var ds = dataSource('http://www.example.com/req');
      ds.get(function (err){
        assert.isNotNull(err.message);
        done();
      });

      requests[0].respond(200, { 'Content-Type': 'application/json' }, '{greeting: "hello"}');
    });

    it('must try to get the valid data if the first request failed', function(done){
      var ds = dataSource('http://www.example.com/req');
      ds.get(function (err){
        assert.equal(err.message, 'HttpRequest Error: Not Found');
      });
      requests[0].respond(404, { 'Content-Type': 'text/plain' }, 'not found');

      ds.get(function (err, data){
        assert.isNull(err);
        assert.equal(data.greeting, 'hello');
        assert.equal(requests.length, 2);
        done();
      });

      requests[1].respond(200, { 'Content-Type': 'application/json' }, '{"greeting": "hello"}');
    });
  });
});

describe('appendGeolocation', function () {

  beforeEach(function () {
    window.PageCriteria = {};
    window.PageCriteria.geo = 'gb';
  });

  afterEach(function () {
    delete window.PageCriteria;
  });

  it('must append geolocation', function () {
    var newurl = urlUtils.appendGeolocation('http://www.example.com?test=true#video');
    assert.equal(newurl, 'http://www.example.com?test=true&geo=gb#video');
  });

  it('must not append the geolocation if there is no pageCriteria', function(){
    delete window.PageCriteria;
    var newurl = urlUtils.appendGeolocation('http://www.example.com?test=true#video');
    assert.equal(newurl, 'http://www.example.com?test=true#video');
  });
});
