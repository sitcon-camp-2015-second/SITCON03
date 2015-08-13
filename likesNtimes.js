var getAllthings = function(new_accessToken){
    // variables
    var likes = [];
    var posts = [];
    var time = [];
    var count = 0;
    //var json = undefined;

    // collect

    var collect = function(){
      function getinfo(){
          for ( i in json.posts.data){
            count = 0
            posts.push(json.posts.data[i].id);
            for ( _ in json.posts.data[i].likes.data){
              count++;
            };
            likes.push(count)
        };
      console.log(likes);
      console.log(posts);
      console.log("collect finish");
      };
      console.log("collect start");
      getinfo();
      //console.log("---nextepage::");
      //console.log(json.paging.next);

  };
 var gettime = function(){
      console.log("gettime start");
      for ( t in posts ){
      $.ajax({
        url: "https://graph.facebook.com/" + posts[t].toString() + "?access_token=" + a,
        type: 'get',
        dataType: 'json',
        success: function(data){
          time.push(data.created_time);
          console.log(time);
        },
        error: function(xhr, ajaxOptions, thrownError){
          console.log(xhr.status);
          console.log(thrownError);
        },
      });};
      var end = function(){
        console.log("gettime finish");
      };
      end()
    };
                        /*
  var nextpage = function(){
  $.ajax({
      url: json.paging.next,
      type: 'get',
      dataType: 'json',
      success: function(data){
          json = data ;
          console.log(json);
      }
  });
  console.log("flippage finish");
};
                                 */

    FB.apin('me', {"fields" : "posts{likes}"}, new_accessToken, function(res){
        json = res.posts;
        //console.log( json.data );
        var i = 0;
        while (i<5){
        collect();
        nextpage();
        i++;
      };
    });
};
var getAllthings_v2 = function(new_accessToken){
  var posts = [];
  var times = [];
  var likes = [];
  var hour = 0;
  var min = 0;
  var count = 0;
  var lflag = 0; //flag if have next likes page
  var flag = 0;
  var next = "";
  var result = undefined;

  // collect function
  var collect = function(){
    for (post in json.posts.data){
      count = 0;
      posts.push(json.posts.data[post].id);
      times.push(json.posts.data[post].created_time);

      //first collect likes
      try {
        for ( like in json.posts.data[post].likes.data ){
          count++; //count likes
        };
      }
      catch(err){
        likes.push(0)
        continue;
      }
      // pages likes' collect

      if ("next" in json.posts.data[post].likes.paging) {
        function flip() {
            $.ajax({
              url: json.posts.data[post].likes.paging.next,
              type: "get",
              dataType: 'json',
              async: false,

              success: function(data){
                next = data;
              },
            });
          };

        flip()
        do{
          lflag = 0;
          for ( like in next.data ){
            count ++
          };

          if ( "next" in next.paging ){
            $.ajax({
              url: next.paging.next,
              type: "get",
              dataType: 'json',
              async: false,

              success: function(data) {
                next = data;
                lflag = 1;
              },
            });
          };
        }
        while( lflag );

        };

        likes.push(count);
      };
    };
  //collect function end
  //arrangement function
  var arrangement = function(likes, posts, times){
    var average = 0;
    var hour_count = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var likes_count = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var posts_id = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
    var likes_average = new Array(24);
    //average
    for ( like in likes ){ average += likes[like];};
    average /= likes.length

    //hour count, likes count, id push
    for ( time in times ){
      hour = parseInt(times[time].substring(11,13));
      min = parseInt(times[time].substring(14,16));
      if ( min <= 30 ){
        hour_count[hour] += 1;
        likes_count[hour] += likes[time];
        posts_id[hour].push(posts[time]);
      }
      else{
        if (hour == 23){
          hour_count[0] += 1;
          likes_count[0] += likes[time];
          post_id[0].push(posts[time]);
        }
        else {
            hour_count[hour+1] += 1;
            likes_count[hour+1] += likes[time];
            posts_id[hour+1].push(posts[time]);
        };
      };
    };
    // likes average count
    for (i in hour_count){
      if( hour_count[i] == 0){
        likes_average[i] = 0;
      }
      else {
        likes_average[i] = likes_count[i] / hour_count[i];
      };
    };
    return {"hour_count": hour_count,
            "likes_count": likes_count,
            "posts_id": posts_id,
            "likes_average": likes_average,
            "averge": average};
  };

  //arrangement function end

    //get first json
    FB.apin('me', {"fields" : "posts{likes}"}, new_accessToken, function(res){
        json = res;
        console.log(json);
        collect();
        // flip page
        if ( "next" in json.posts.paging ){
          $.ajax({
            url: json.posts.paging.next,
            type: "get",
            dataType: 'json',
            async: false,

            success: function(data) {
              json.posts = data;
            },
          });

          do{     //flip page loop
            flag = 0;
            collect();
            if ( "next" in json.posts.paging){
              flag = 1;
              $.ajax({
                url: json.posts.paging.next,
                type: "get",
                dataType: 'json',
                async: false,

                success: function(data) {
                  json.posts = data;
                },
              });
            };
          }
          while( flag && posts.length < 1000);
        };
        result = arrangement(likes, posts, times);
        console.log(result.likes_count);
        console.log(result.hour_count);
        console.log(result.posts_id);
        console.log(result.likes_average);
        //console.log(posts);
        //console.log(times);
        //console.log(likes);
        console.log("------");
    });

  };
