/**
 * Created by janfanslau on 07.11.14.
 */
'use strict';
var io = require('socket.io')();
var debug = require('debug')('zettel');
var mongooseObserver = require('mongoose-observer');
var Zettel = require('../lib/models/Zettel');

var subscriptionService = function(io){
  var that = this;
  this.connections = [];
  this.socketServer = null;


  io.on('connection', function (socket) {
    that.handleIncomingConnection(socket);
    socket.on('disconnect',function(){
      that.handleDisconnecting(socket);
    });
  });


  this.handleIncomingConnection = function(connection) {
    // add current connection to connections

    debug('Adding connection: ' + connection.id);

    var socketObject = {
      socketId:connection.id,
      socket:connection
    };
    this.connections.push(socketObject);
    connection.on('registerData', function (data) {
      connection.join(data.urlSlug);
      socketObject.urlSlug = data.urlSlug;
    });
    connection.emit('test','SocketTargetID:' + connection.id);
    debug('Connection length:' + that.connections.length);
  }


  this.handleDisconnecting = function (connection){
    debug('Disconnecting client: '+connection.id);
    for (var i = 0; i < that.connections.length; i++) {
      var obj = that.connections[i];
      if(obj.socketId === connection.id) {
        that.connections.splice(i, 1);
      }
    }
  };

  mongooseObserver.register('Zettel', 'update', function(zettel){
    var urlSlug = zettel.urlSlug;
    Zettel.findByUrlSlug(zettel.urlSlug, false, function(err, zettel){
      io.to(urlSlug).emit('updateZettel', zettel.items);
    });
  });


};

module.exports = function(io){
  new subscriptionService(io);
}