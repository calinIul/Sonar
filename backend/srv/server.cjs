const cds = require("@sap/cds");
const express = require('express');

const config = {
  
};

cds.on("bootstrap", (app) => {
  app.use(auth(config));
  // app.use('/app', requiresAuth(), express.static(__dirname + '/../app'));
});

module.exports = cds.server;