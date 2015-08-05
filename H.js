var likes = [];
var posts = [];
var count = 0;
var json = undefined;

// collect and next page
var run = function(){
  function getinfo(){
      for ( i in json.data){
        count = 0
        posts.push(json.data[i].id);
        for ( _ in json.data[i].likes.data){
          count++;
          //console.log(json.posts.data[i].likes.data[j].id);
        };
        likes.push(count)
    };
      };
  getinfo()
  console.log(likes);
  console.log(posts);
  console.log(json.paging.next);

  var g = $.get(json.paging.next);
  $.ajax({
      url: json.paging.next,
      type: 'get',
      dataType: 'json',
      success: function(data){
          json = data ;
          console.log( json.data );
      }
  });
  // console.log(g);
  console.log("----");
};


FB.apin('me', {"fields" : "posts{likes}"}, function(res){
    console.log('this');
    console.log( res );
    json = res.posts;
    var id = json.id;
    console.log( json.data );

    run()

    while(json.paging.next != undefined ){
      run();

    }

});
