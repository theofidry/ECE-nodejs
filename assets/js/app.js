$().ready(function() {

    $('#login').submit(function(event) {
        var user = {
            username: $('#username').val(),
            password: $('#password').val()
        };

        console.log('user = ');
        console.log(user);

        $.ajax({
            type: "POST",
            url: "/",
            cache: false,
            beforeSend: function(){
                $('#login').val('Connecting...');
            }
        }).done(function() {
            console.log(errors);
        });
    });
});
