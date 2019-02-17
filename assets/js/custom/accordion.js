import {sha256} from '../lib/sha256.min'; // or './module'

$(function () {
    $('.post-content:eq(0)').css('visibility', 'hidden');
    let body = $('.post-content:eq(0)').html();
    $('.post-content:eq(0)').html('');

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

    if (window.location.pathname == "/category/etc/etc-temp.html") {
        let pwd = prompt("Password");
        if (sha256(pwd) == 'b953c93008d860d24f0eef3e87e9ccb162d99590488df185e2bfd5b3647fe40d') {
            $('.post-content:eq(0)').html(body);
            $('.post-content:eq(0)').css('visibility', 'visible');
        } else {
            alert('Incorrect');
            window.location.href = window.location.origin;
        }
    } else {
        $('.post-content:eq(0)').html(body);
        $('.post-content:eq(0)').css('visibility', 'visible');
    }
});