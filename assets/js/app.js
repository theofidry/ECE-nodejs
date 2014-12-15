$().ready(function () {

    /**
     * Do the post request in AJAX
     */
    $('#login').submit(function (event) {

        $.ajax({
            type:       "POST",
            url:        "/",
            cache:      false,
            beforeSend: function () {
                $('.loader').removeClass('hidden');
            }
        });
    });

    var socket = io('http://localhost');

    socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', { my: 'data' });
    });
});
