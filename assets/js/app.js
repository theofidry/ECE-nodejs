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
});
