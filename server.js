'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const dns = require('dns');
const cors = require('cors');
const bodyParse = require('body-parser');

const app = express();

// Basic Configuration 
const port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParse.urlencoded({ extended: false }));


app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

//array sorting urls

const URL_Links = [];

let id = 0;

//url posting
 
app.post('/api/shorturl/new', (request, response) => {
  
  // url variable is from the html label 'name'
  const { url } = request.body;
  
  
  // Removing HTTP request
  const no_HTTPS_URL = url.replace(/^https?:\/\//, '');
  
  
  // url check
  dns.lookup(no_HTTPS_URL, (error) => {
    
    if(error){
      return response.json({
        error:"invalid URL"
      });
    } 
    else {
      //id number increase
      id++;
      
      //construction of new entry
      const new_Short_URL = {
         original_url: url,
        short_url: `${id}`  
      };
      
      URL_Links.push(new_Short_URL);
      
      //return of the new entry
      return response.json(new_Short_URL);
    }
  });
  
});

app.get('/api/shorturl/:id', (request, response) => {
  
  const { id } = request.params;
  
  const condensed_URL = URL_Links.find(d => d.short_url === id);
  
  if(condensed_URL){
    
  return response.redirect(condensed_URL.original_url); //redicrect to original url  
    
  } else {
    
    return response.json({
      error: "invalid url"
    });
  }
  
  
});
  

app.listen(port, function () {
  console.log('Node.js listening ...');
});
