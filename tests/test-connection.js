/*
Copyright (C) 2010, Oleg Efimov <efimovov@gmail.com>

See license text in LICENSE file
*/

// Mixin settings
/*global host, user, password, database, database_denied, charset, reconnect_count */
process.mixin(require("./settings"));

// Require modules
var sys = require("sys"),
  mysql_sync = require("../mysql-sync");

exports.mysql_sync_createConnection = function (test) {
  test.expect(1);
  
  var conn = mysql_sync.createConnection(host, user, password, database);
  test.ok(conn, "mysql_sync.createConnection(host, user, password, database)");
  conn.close();
  
  test.done();
};

exports.connect_WithoutDb = function (test) {
  test.expect(2);
  
  var conn = mysql_sync.createConnection(host, user, password, database);
  test.ok(conn, "mysql_sync.createConnection(host, user, password, database)");
  conn.close();
  test.ok(conn.connect(host, user, password), "conn.connect() without database selection");
  conn.close();
  
  test.done();
};

exports.connect_ManyTimes = function (test) {
  test.expect(2);
  
  var conn = mysql_sync.createConnection(host, user, password, database), i;
  test.ok(conn, "mysql_sync.createConnection(host, user, password, database)");
  conn.close();
  for (i = 1; i <= reconnect_count; i += 1) {
    conn.connect(host, user, password);
    conn.close();
  }
  test.ok(conn.connect(host, user, password), "conn.connect() aftre many times connect");
  conn.close();
  
  test.done();
};

/*
// TODO: how to write this test?
unittest.test('conn.close()', function () {
  var conn = mysql_sync.createConnection(host, user, password, database);
  conn.close();
  unittest.assert(conn);
});
*/

exports.connect_AllowedDb = function (test) {
  test.expect(2);
  
  var conn = mysql_sync.createConnection(host, user, password, database);
  test.ok(conn, "mysql_sync.createConnection(host, user, password, database)");
  conn.close();
  test.ok(conn.connect(host, user, password, database), "conn.connect() for allowed database");
  conn.close();
  
  test.done();
};

exports.connect_DeniedDb = function (test) {
  test.expect(2);
  
  var conn = mysql_sync.createConnection(host, user, password, database);
  test.ok(conn, "mysql_sync.createConnection(host, user, password, database)");
  conn.close();
  test.ok(!conn.connect(host, user, password, database_denied), "conn.connect() for denied database");
  
  test.done();
};

exports.selectDb_AllowedDb = function (test) {
  test.expect(2);
  
  var conn = mysql_sync.createConnection(host, user, password);
  test.ok(conn, "mysql_sync.createConnection(host, user, password)");
  test.ok(conn.selectDb(database), "conn.selectDb() for allowed database");
  conn.close();
  
  test.done();
};

exports.selectDb_DeniedDb = function (test) {
  test.expect(2);
  
  var conn = mysql_sync.createConnection(host, user, password);
  test.ok(conn, "mysql_sync.createConnection(host, user, password)");
  test.ok(!conn.selectDb(database_denied), "conn.selectDb() for denied database");
  conn.close();
  
  test.done();
};

exports.setCharset = function (test) {
  test.expect(2);
  
  var conn = mysql_sync.createConnection(host, user, password);
  test.ok(conn, "mysql_sync.createConnection(host, user, password)");
  test.ok(conn.setCharset(charset), "conn.setCharset()");
  conn.close();
  
  test.done();
};

exports.getCharset = function (test) {
  test.expect(4);
  
  var conn = mysql_sync.createConnection(host, user, password),
    charset_obj;
  test.ok(conn, "mysql_sync.createConnection(host, user, password)");
  test.ok(conn.setCharset(charset), "conn.setCharset()");
  charset_obj = conn.getCharset();
  test.equals(charset_obj.charset, charset, "conn.getCharset()");
  test.equals(charset_obj.collation.indexOf(charset), 0, "conn.getCharset()");
  conn.close();
  
  test.done();
};

exports.getCharsetName = function (test) {
  test.expect(3);
  
  var conn = mysql_sync.createConnection(host, user, password);
  test.ok(conn, "mysql_sync.createConnection(host, user, password)");
  test.ok(conn.setCharset(charset), "conn.setCharset()");
  test.equals(conn.getCharsetName(), charset, "conn.getCharsetName()");
  conn.close();
  
  test.done();
};

exports.connectErrno = function (test) {
  test.expect(2);
  
  var conn = mysql_sync.createConnection(host, user, password);
  test.ok(conn, "mysql_sync.createConnection(host, user, password)");
  conn.close();
  conn.connect(host, user, password, database_denied);
  test.equals(conn.connectErrno(), 1044, "conn.connectErrno()");
  
  test.done();
};

exports.connectError = function (test) {
  test.expect(2);
  
  var conn = mysql_sync.createConnection(host, user, password);
  test.ok(conn, "mysql_sync.createConnection(host, user, password)");
  conn.close();
  conn.connect(host, user, password, database_denied);
  test.equals(conn.connectError(), "Access denied for user ''@'" + host +
              "' to database '" + database_denied + "'", "conn.connectError()");
  
  test.done();
};
