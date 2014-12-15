$().ready(function () {

    var socket = io(),
        logsContainer = $('#logs > tbody');

    /**
     * Get the user IP and notify the server of each connection.
     */
    $.getJSON("http://jsonip.appspot.com?callback=?", function (data) {

        var user = $('#user').val() || 'anonymous';

        socket.emit('connection', {
            ip:     data.ip,
            method: 'GET',
            uri:    window.location.pathname,
            user:   user,
            time:   new Date()
        });
    });

    /**
     * Do the post request in AJAX.
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

            console.log('newRow:');
            console.log(newRow);

            logsContainer.append(newRow)
        }
    });


});
