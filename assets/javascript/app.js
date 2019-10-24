$(function () {

    // Stores random ID generated by database
    var myUserId = "";
    var remoteUserId = "";

    //Create reference to connected users database
    var myUserRef;
    var remoteUserRef;

    // Get database reference to all connected users
    var onlineUsersRef = database.ref("/onlineUsersList");

    // '.info/connected' is a boolean value, true if users are connected and false if they are not.
    var connectedRef = database.ref(".info/connected");

    // When the users' connection state changes...
    connectedRef.on("value", function (snapshot) {

        // If they are connected..
        if (snapshot.val()) {

            // Add user to the user connections list.
            var onlineUser = onlineUsersRef.push({
                score: 0,
                choice: "",
                name: "Anonymous"
            });

            // Gets random id generated by database
            myUserId = onlineUser.key;

            // Gets my User database reference
            myUserRef = onlineUsersRef.child(myUserId);

            // Remove user from the connection list when they disconnect.
            onlineUser.onDisconnect().remove();
        }
    });

    // Set a maximum number of players to two. Other user are able to connect, but
    // they are no able to play. Only the first two user connections are allow to play.
    onlineUsersRef.limitToFirst(2).on("value", function (snapshot) {

        // Loop through connected-users-list and compares each other IDs to
        // identified the second connection user
        snapshot.forEach(function (user) {

            // If myUserID is different to user.key(id) then
            // the second player is log
            if (user.key != myUserId) {

                console.log("Other player connected!");

                //Gets second player Id from database
                remoteUserId = user.key;

                //Gets second player database reference
                remoteUserRef = onlineUsersRef.child(remoteUserId);

            }

        });

    });

    // Add click event to ROCK, PAPER, SCISSORS' icons and
    // updates the users database choice with
    // the data attribute value stored in each icon tag
    $("[data-choice]").on("click", function () {

        myUserRef.update({

            choice: $(this).attr("data-choice")

        });

    });

    // Event listens to any changes in onlineUsersList
    onlineUsersRef.on("value", function (snapshot) {

        // Store my user player choice (rock, paper, scissor)
        var myChoice = snapshot.child(myUserId).val().choice;

        // Check if remote user id exist and checks if both players have made their choice, if all true then a function to check who wins is call
        if (remoteUserId && myChoice) {

            // Store remote player choice (rock, paper, scissor)
            var remoteUserChoice = snapshot.child(remoteUserId).val().choice;

            if (remoteUserChoice) {

                console.log("call function to check who wins");

            }

        }

    });

});