if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

$(function () {
    $('.menu__toggle__icon').click(function () {
        if ($('body').hasClass('menu--open')) {
            $('body').removeClass('menu--open');
        } else {
            $('body').addClass('menu--open');
        }
    });
})