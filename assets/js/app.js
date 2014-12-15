//jQuery.fn.extend({
//    /**
//     * Get the user IP and notify the server of each connection.
//     *
//     * @param {string} method GET, POST, UPDATE, DELETE, by default is GET
//     * @param socket
//     * @param {Function} callback
//     */
//    submitConnectionData: function (ip, method, socket, callback) {
//
//        method = method || 'GET';
//        var user = $('#user').text() || 'anonymous';
//        var ip = ip || 'unknown';
//
//        socket.emit('connection', {
//            ip:     ip,
//            method: method,
//            uri:    window.location.pathname,
//            user:   user,
//            time:   new Date()
//        }, function () {
//            if (callback instanceof Function) {
//                callback();
//            }
//        });
//    },
//
//    /**
//     * Function used for submitting the form as an AJAX request.
//     */
//    submitForm: function () {
//        $.ajax({
//            type:       "POST",
//            url:        "/",
//            cache:      false,
//            beforeSend: function () {
//                $('.loader').removeClass('hidden');
//            }
//        });
//    }
//});

$().ready(function () {

    var ip,
        socket = io(),
        logsContainer = $('#logs').find('> tbody');

    $.getJSON("http://jsonip.appspot.com?callback=?", function (data) {

        console.log("ip");
        console.log(data);
        //ip = data.ip;
        //
        //if ($('#user').text() !== 'admin') {
        //    $.fn.submitConnectionData(ip, null, socket);
        //}
    });

    ///**
    // * Do the post request in AJAX.
    // */
    //$('#login').submit(function (event) {
    //
    //    $.fn.submitConnectionData(ip, 'POST', socket, $.fn.submitForm);
    //});
    //
    ///**
    // * If admin panel, prints login data
    // */
    //socket.on('logsData', function (data) {
    //
    //    if ($('#user').text() === 'admin') {
    //
    //        var newRow = '<tr>';
    //
    //        for (k in data) {
    //            if (k === 'method') {
    //                if (data.method === 'GET') {
    //                    newRow += '<td class="btn btn-success">';
    //                }
    //                else if (data.method === 'POST') {
    //                    newRow += '<td class="btn btn-danger">';
    //                }
    //                else {
    //                    newRow += '<td class="btn btn-info">';
    //                }
    //            }
    //            else {
    //                newRow += '<td>';
    //            }
    //
    //            newRow += data[k] + '</td>';
    //        }
    //
    //        newRow += '</tr>';
    //
    //        logsContainer.append(newRow)
    //    }
    //});


});
