Parse.Cloud.define("users", function(request, response) {
  console.log(request, Parse.User.current())
  var query = new Parse.Query("User");
  // query.equalTo('firstname', 'SEMIH');
  query.find({
    success: function(results) {
      response.success(results);
    },
    error: function() {
      response.error("failed");
    }
  });
});
