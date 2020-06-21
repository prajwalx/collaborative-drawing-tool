module.exports = function(io){

  var express = require('express');
  var router = express.Router();

  /* store history of updates to redraw for new users */
  const history = [];

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Collaborative Drawing Tool' });
  });

  /* Socket.io listeners */

  io.on('connection',(socket)=>{
    /* New user connected  */
    console.log('A user connected');

    /* draw all old updates to this user's canvas */
    console.log('Syncing new user"s canvas from history')
    for(let item of history)
      socket.emit('update_canvas',item);

    /* Recieving updates from user */
    socket.on('update_canvas',function(data){

      /* store updates */
      history.push(data);

      /* send updates to all sockets except sender */
      socket.broadcast.emit('update_canvas',data);
    });
  })
  
  return router;
}