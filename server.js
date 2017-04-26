const express = require('express');
const path = require('path');
const app = express();

app.set('port', process.env.PORT || 5000);
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.send('hello'));

app.get('/twitch', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/twitchHelper/twitch.html'))
});

app.listen(app.get('port'), () => console.log(`Listening on port ${app.get('port')}`));