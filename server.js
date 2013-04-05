var clients = {};

var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(9020);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

function updateCount(url)
{
    var c = clients[url];
    if(c)
    {
        var count = 0;
        for (var id in c)
        {
            if (c.hasOwnProperty(id))
            {
                count++;
            }
        }
        for (var id in c)
        {
            if (c.hasOwnProperty(id))
            {
                c[id].emit('count', { 'count': count });
            }
        }
    }
}

io.sockets.on('connection', function (socket) {
  socket.on('which', function (data)
  {
    console.log("someone is watching: " + data.url);
    if(clients[data.url] == undefined)
    {
        clients[data.url] = {};
    }
    clients[data.url][socket.id] = socket;
    updateCount(data.url);

    socket.on('disconnect', function() {
        console.log("forgetting about " + data.url + " client " + String(socket.id));
        delete clients[data.url][socket.id];
        updateCount(data.url);
    });
  });
  socket.on('play', function (data)
  {
    console.log("tell everyone else to play: " + data.url);
    var c = clients[data.url];
    if(c)
    {
        for (var id in c)
        {
            if (c.hasOwnProperty(id))
            {
                console.log("* notifying client " + String(id) + " to play");
                c[id].emit('play', {});
            }
        }
    }
  });
});
