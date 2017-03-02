var dns = require('dns');
var dnsd = require('dnsd');


var localIpAddress;

// get local ip, and start services
dns.lookup(require('os').hostname(), function (err, ipaddress, fam) {
  if (!err) {
    localIpAddress = ipaddress;
    startDnsd();
  }
});


function startDnsd(){

  var server = dnsd.createServer(dnsdHandler);
  var port = 53;
  server.listen(port, localIpAddress);
  console.log('dnsd running at '+ localIpAddress + " : " + port);
}

var allowOnline = false;

function dnsdHandler(req, res) {
  var question = res.question[0];
  var hostname = question.name;

  console.log(hostname);
  if ((hostname == "stackoverflow.com") || (allowOnline)){
    console.log("access gained");
    allowOnline = true;
    dns.resolve4(hostname, function (err, dnsReslovedAddresses) {
      if (dnsReslovedAddresses){
        for (var i = 0; i < dnsReslovedAddresses.length; i++){
          res.answer.push({name:hostname, type:'A', data:dnsReslovedAddresses[i], 'ttl':600});
        }
      }
      res.end();
    });
  } else {
    res.answer.push({name:hostname, type:'A', data:localIpAddress, 'ttl':0})
    res.end();
  }

}



//http server
const express = require('express')  
const app = express()  
const port = 80

app.get('*', (request, response) => {  

  if (request.hostname!="wifilogin.co"){
    response.redirect('http://wifilogin.co');
  } else {
    
    response.send('<a href="http://stackoverflow.com/questions/42434824/iphone-android-will-not-dismiss-wifi-landing-page-implemented-with-dns">click here to login</a>');

  }
})

app.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`web server is listening on ${port}`)
});