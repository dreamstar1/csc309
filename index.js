/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function() {	
    $.get('/jsonall', function (json) {
        $('#topic1').append(json);
    });
});

    