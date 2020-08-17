document.addEventListener('DOMContentLoaded', function () {

    var CompanyName = 'Google';
    var Mess = ' This is my notification Please visit it please';
    $(document).ready(function () {
        $("#btn1").click(function () {
            $(".container-fluid").append("<a href='#' " +
                "class='list-group-item list-group-item-action bg-dark text-light' " +
                "data-toggle='modal' data-target='#staticBackdrop'><strong >" +
                CompanyName + "</strong> <span>" + Mess +
                "</span> <i class='fa fa-trash float-right'></i> ");
        });
    });

});