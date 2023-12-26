let $loginFormContainer = $('#loginFormContainer');
let loginAttempts = 0;
const maxLoginAttempts = 4;

if ($loginFormContainer.length != 0) {
    console.log('Login form detected. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to submit registration details
    //to server-side api when the #submitButton element fires the click event.
    $('#submitButton').on('click', function (event) {
        event.preventDefault();
        const baseUrl = 'https://localhost:5000';
        let email = $('#emailInput').val();
        let password = $('#passwordInput').val();
        let webFormData = new FormData();
        webFormData.append('email', email);
        webFormData.append('password', password);

        axios({
            method: 'post',
            url: baseUrl + '/api/user/login',
            data: webFormData,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(function (response) {
                console.log('Response:', response.data); // Log the entire response for inspection
                userData = response.data;
            
                // Add this line to check the role_name property specifically
                console.log('Role Name:', userData.role_name);
                //Inspect the object structure of the response object.
                //console.log('Inspecting the respsone object returned from the login web api');
                //console.dir(response);
                userData = response.data;
                if (userData.role_name == 'user') {
                    localStorage.setItem('token', userData.token);
                    localStorage.setItem('user_id', userData.user_id);
                    localStorage.setItem('role_name', userData.role_name);
                    window.location.href = 'user/manage_submission.html';
                    return;
                }
                if (userData.role_name == 'admin') {
                    localStorage.setItem('token', userData.token);
                    localStorage.setItem('user_id', userData.user_id);
                    localStorage.setItem('role_name', userData.role_name);
                    window.location.href = 'admin/manage_users.html';
                    return;
                }
                console.log('Role Name:', userData.role_name);
                console.log('Login successful!');
                //resetLoginAttempts(); // Reset login attempts on successful login
            })
            .catch(function (error) {
                //Handle error
                console.dir(error);
                loginAttempts++;
                console.log('Login Attempts: ' + loginAttempts);

                if (loginAttempts >= maxLoginAttempts) {
                    //lock the account or take additional actions
                    console.log('Account locked. You have exceeded the maximum number of login attempts.');

                    //disbale the form and show alert message
                    disableLoginForm();
                } else {
                    displayErrorMessage('Unable to login. Check your email and password');

                }
            });
    });

} //End of checking for $loginFormContainer jQuery object

function resetLoginAttempts() {
    loginAttempts = 0;
}

function disableLoginForm() {
   // console.log(document.querySelector("div.text-center"))
    //document.querySelector("div.text-center").innerHTML = "Wrong Email or Password...Account Locked ";

    // $('#submitButton').prop('disabled', true);
    // document.getElementById('submitButton').style.display = "none";
    // document.removeChild(document.getElementById('submitButton'))
    displayErrorMessage('Account locked. You have exceeded the maximum number of login attempts.');
}

function displayErrorMessage(message) {
    new Noty({
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        timeout: '6000',
        text: message,
    }).show();
}