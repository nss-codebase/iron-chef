'use strict';

var Mongo = require('mongodb');

function Recipe(o){
  strip(o);

  this.name        = o.name        || 'Generic Recipe';
  this.photo       = o.photo       || '/img/recipe.jpg';
  this.directions  = o.directions  || '1. Clean Kitchen, 2. Get Food, 3. Cook, 4. Eat';
  this.category    = o.category;
  this.ingredients = o.ingredients || 'Food, Water, Bacon';
  this.ingredients = this.ingredients.split(',').map(function(i){return i.trim();});
  this.created     = new Date();
}

Object.defineProperty(Recipe, 'collection', {
  get: function(){return global.mongodb.collection('recipes');}
});

Recipe.all = function(cb){
  Recipe.collection.find().sort({created:-1}).toArray(cb);
};

Recipe.create = function(o, cb){
  var r = new Recipe(o);
  Recipe.collection.save(r, cb);
};

Recipe.destroy = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Recipe.collection.remove({_id:_id}, cb);
};

module.exports = Recipe;

// PRIVATE FUNCTIONS ///

function strip(o){
  // stripping leading and following spaces from all properties inside of o that are strings
  var properties = Object.keys(o);
  properties.forEach(function(property){
    if(typeof o[property] === 'string'){
      o[property] = o[property].trim();
    }
  });
}

