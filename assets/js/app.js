$().ready(function () {

    var socket = io(),
        logsContainer = $('#logs').find('tbody');

    /**
     * Do the login post request in AJAX.
     */
    $('#login').submit(function (event) {

        setTimeout(function () {
            $.ajax({
                type:       'POST',
                url:        '/login',
                cache:      false,
                beforeSend: function () {
                    $('.loader').removeClass('hidden');
                }
            });
        }, 5000);
    });

    /**
     * If admin panel, prints login data
     */
    socket.on('userData', function (data) {

        //if ($('#user').text() === 'admin') {

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

        logsContainer.append(newRow);
        //}
    });

    $(window).on('beforeunload', function () {
        socket.close();
    });
});
