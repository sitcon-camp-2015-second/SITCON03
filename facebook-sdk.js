//Grab from https://github.com/sitcon-tw/summercamp-api-sdk
//License: not declared, assume MIT or GPL
//used for reference 
(function(w, $, f){
  var facebook = function($, f) {
    this.hello = "Welcome to SITCON Summer Camp!"
    var accessToken = "CAACEdEose0cBAMbKjVSjR3KtLpRhtzCrsnZAs13USeMum1qlOXNoZCskDVcggykebeik7pzf6dbjOoBo5ZBJCrZBfDijcKpB3SXvKc9h0woOcLUs6ZA56fV1EseZAYUXsZC8nU0K4mvJgwQisGCCBxhD1SXO78NQ2ZBXMKDJ6Uy0xpUaUFAy7k72azDRoMpaCM6aFoEJbESlb8PqmUOUJSMuJuAPWINkIXqetu7LLDi4WAZDZD"
    var fansPage = f
    var basicInfo = {}
    this.getAccessToken = function() {
      return accessToken
    }
    this.getImgUrlById = function(id) {
      return "https://graph.facebook.com/"+id+"/picture"
    }
    this.api = function(path, callback) {
      $.get("https://graph.facebook.com/"+path+"?access_token="+accessToken, function (data){
        callback && callback(data)
      })
    }
    this.apin = function(path, obj, new_accessToken, callback) {
      var variables = '';
      accessToken = new_accessToken
      for(var key in obj) {
        variables += '&'+ key +'='+ obj[key];
      }

      $.get("https://graph.facebook.com/"+path+"?access_token="+accessToken + variables, function (data){
        callback && callback(data)
      })
    }
    this.getPosts = function(id, callback) {
      this.api(id+"/posts", callback)
    }
    this.getFeed = function(id, callback) {
      this.api(id+"/feed", callback)
    }
    this.getAlbums = function(id, callback) {
      this.api(id+"/albums", callback)
    }
    this.getPhotos = function(albumId, callback) {
      this.api(albumId+"/photos", callback)
    }
    this.getInfo = function(id, callback) {
      this.api(id, callback)
    }
    this.getSitconPosts = function(callback) {
      this.getPosts(fansPage, callback)
    }
    this.getSitconFeed = function(callback) {
      this.getFeed(fansPage, callback)
    }
    this.getSitconAlbums = function(callback) {
      this.getAlbums(fansPage, callback)
    }
    this.getSitconInfo = function(callback) {
      this.getInfo(fansPage, callback)
    }
    this.whoAmI = function(callback) {
      this.api("/me", callback)
    }
  }
  w.FB = new facebook($, f)
})(window, window.jQuery, "SITCONtw")
