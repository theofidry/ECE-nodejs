jQuery.fn.extend({

    /**
     * Function used for submitting the form as an AJAX request.
     */
    submitForm: function () {

        setTimeout(function () {
            $.ajax({
                type:       "POST",
                url:        "/",
                cache:      false,
                beforeSend: function () {
                    $('.loader').removeClass('hidden');
                }
            });
        }, 500);
    }
});

$().ready(function () {

    var ip,
        socket = io(),
        logsContainer = $('#logs').find('> tbody');

    //$.fn.getIP(function (data) {
    //
    //    ip = data.ip;
    //
    //    if ($('#user').text() !== 'admin') {
    //        $.fn.submitConnectionData(ip, null, socket, null);
    //    }
    //});

    /**
     * Do the post request in AJAX.
     */
    //$('#login').submit(function (event) {
    //
    //    $.fn.submitConnectionData(ip, 'POST', socket, $.fn.submitForm);
    //});

    /**
     * If admin panel, prints login data
     */
    socket.on('logsData', function (data) {

        if ($('#user').text() === 'admin') {

            var newRow = '<tr>';

            for (k in data) {
                if (k === 'method') {
                    if (data.method === 'GET') {
                        newRow += '<td class="btn btn-success">';
                    }
                    else if (data.method === 'POST') {
                        newRow += '<td class="btn btn-danger">';
                    }
                    else {
                        newRow += '<td class="btn btn-info">';
                    }
                }
                else {
                    newRow += '<td>';
                }

                newRow += data[k] + '</td>';
            }

            newRow += '</tr>';

            logsContainer.append(newRow)
        }
    });

    $(window).on('beforeunload', function () {
        socket.close();
    });
});
