$(function () {

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
                choice: "rock",
                name: "Anonymous"
            });

            // Remove user from the connection list when they disconnect.
            onlineUser.onDisconnect().remove();
        }
    });

});