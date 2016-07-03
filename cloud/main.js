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

Parse.Cloud.define("sendEmailToUser", function(request, response) {
  client.sendEmail({
    to: "email@example.com",
    from: "MyMail@CloudCode.com",
    subject: "Hello from Parse!",
    text: "Using Parse and My Mail Module is great!"
  }).then(function(httpResponse) {
    response.success("Email sent!");
  }, function(httpResponse) {
    console.error(httpResponse);
    response.error("Uh oh, something went wrong");
  });
});
