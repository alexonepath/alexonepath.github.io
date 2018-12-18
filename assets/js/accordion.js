$(function () {
    function slideMenu() {
        var activeState = $('#menu-container .menu-list').hasClass('active');
        $('#menu-container .menu-list').animate({left: activeState ? '0%' : '-100%'}, 400);
    }

    $('#menu-wrapper').click(function (event) {
        event.stopPropagation();
        $('#hamburger-menu').toggleClass('open');
        $('#menu-container .menu-list').toggleClass('active');
        slideMenu();

        $('body').toggleClass('overflow-hidden');
    });

    $('.menu-list').find('.accordion-toggle').click(function () {
        $(this).next().toggleClass('open').slideToggle('fast').css({'padding-left': '20px'});
        $(this).toggleClass('active-tab').find('.menu-link').toggleClass('active');

        $('.menu-list .accordion-content').not($(this).next()).slideUp('fast').removeClass('open');
        $('.menu-list .accordion-toggle').not(jQuery(this)).removeClass('active-tab').find('.menu-link').removeClass('active');
    });

    if (window.location.pathname.startsWith('/category')) {
        const splitPath = window.location.pathname.split('/');
        //Open parent category
        if (splitPath.length > 4) {
            let found = window.location.pathname.match(/(\/category\/[a-z|0-9]+\/)/i);
            const parentObj = $('.accordion-toggle[path*="{0}"]'.format(found[0]));
            parentObj.click();
            parentObj.next().find('a[href*="{0}"]'.format(window.location.pathname)).addClass('selected');
        } else {
            $('.toggle[path*="{0}"]'.format(window.location.pathname)).find('a').addClass('selected');
        }
    }
});