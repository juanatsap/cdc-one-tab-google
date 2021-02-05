/**
 * 0. Handle client load
 */

function handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    console.log('0. HandleClient Load - GET ACCOUNT INFO CALL :>> ...');
    gigya.accounts.getAccountInfo({
        callback: function(ev) {
            //debugger;
            if (ev.errorCode !== 0) {
                console.log('\t - No session. Init Google client');
                gapi.load('client:auth2', initClient);

            } else {
                // debugger;
                console.log('\t - Account found with uid %s', ev.UID);
                document.getElementById("gigya-logged-uid").innerHTML = ev.UID;

                // document.getElementById("gigya-logged").innerHTML = "you are logged-in as user: " + ev.UID + " Please, log out and refresh to test the functionality.";
            }

        }
    });
}

/**
 * 2. INIT GOOGLE CLIENT
 */

function initClient() {

    // Instance initialization
    var googleAuth = gapi.auth2.init({
        client_id: '157999256223-a0sh9tvk26t3f4qo8mqcnlvf70gd1gio.apps.googleusercontent.com',
        'scope': 'https://www.googleapis.com/auth/plus.login'
    }).then(function() {

        console.log('\t\t - Init Google client Loaded. Getting user...');

        var GoogleUser = gapi.auth2.getAuthInstance().currentUser.get();


        //If there is a google session
        if (GoogleUser.isSignedIn()) {

            console.log('\t\t\t - User loaded. Getting session info...');

            var GoogleUser = gapi.auth2.getAuthInstance().currentUser.get();

            NotifyLoginCall();
        } else {

            console.log('\t\t\t - No user inf ound. Returning home...');

            // Is not signed in. Return to login
            location.href = 'http://localhost/cdc-one-tab-google';
        }
    });
}


/**
 * 3. Notify Login Call
 */

function NotifyLoginCall() {

    // We get the auth token
    var authToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse(true).access_token;

    console.log('- authToken :>> %o', authToken);

    // We make a notify Login with the auth token recieved
    gigya.socialize.notifyLogin({
        "providerSessions": {
            "googlePlus": {
                authToken
            }
        },
        callback: onLoginFun
    });
}

/**
 * 4. Logout Function
 */

function logout() {
    gigya.accounts.logout({ callback: onLogoutFun });
}


function onLoginFun(e) {
    document.getElementById("gigya-logged-uid").innerHTML = e.UID;
}

function onLogoutFun(e) {

    console.log('\t\t\t - Logging out & Returning home...');

    // Is not signed in. Return to login
    location.href = 'http://localhost/cdc-one-tab-google';
}