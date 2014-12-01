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
                //TODO: display connecting message
                $('#login').val('Connecting...');
            }
        });
    });
});
