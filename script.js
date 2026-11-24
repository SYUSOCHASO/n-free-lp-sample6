$(document).ready(function() {
    // ---------------------------------------------------------------
    // 紹介コード（referral_code）の引き継ぎ
    //   1. URL クエリ ?referral_code=XXX があれば sessionStorage に保存
    //   2. なければ sessionStorage から復元（LP 内ページ遷移時の保持用）
    //   3. signup ボタンの遷移先に referral_code を動的付与
    //      ユーザーが「申し込み」ボタンを押した時点で
    //      https://app.n-free.jp/signup?referral_code=XXX に遷移する
    // ---------------------------------------------------------------
    (function preserveReferralCode() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            let referralCode = urlParams.get('referral_code');

            if (referralCode) {
                sessionStorage.setItem('n_free_referral_code', referralCode);
            } else {
                referralCode = sessionStorage.getItem('n_free_referral_code');
            }

            if (!referralCode) return;

            $('a[href*="app.n-free.jp/signup"]').each(function () {
                try {
                    const url = new URL(this.href);
                    url.searchParams.set('referral_code', referralCode);
                    this.href = url.toString();
                } catch (e) {
                    // URL がパースできない href はスキップ
                }
            });
        } catch (e) {
            // sessionStorage / URL API が利用できない環境では何もしない
        }
    })();

    function animateArrow() {
        $(".arrow").animate({ marginTop: "-10px" }, 700)
                .animate({ marginTop: "0px" }, 700, animateArrow);
    }
    animateArrow();

    // ハンバーガーメニューの機能拡張
    $(function () {
        const $hamburger = $('#hamburger');
        const $hideMenu = $('.hide-flex');
        const $menuOverlay = $('.menu-overlay');
        const $body = $('body');
        
        // メニューを開く/閉じる関数
        function toggleMenu() {
            const isActive = $hideMenu.hasClass('active');
            
            if (isActive) {
                closeMenu();
            } else {
                openMenu();
            }
        }
        
        // メニューを開く
        function openMenu() {
            $hamburger.addClass('open').attr('aria-expanded', 'true');
            $hideMenu.addClass('active');
            $menuOverlay.addClass('active');
            $body.addClass('menu-open');
        }
        
        // メニューを閉じる
        function closeMenu() {
            $hamburger.removeClass('open').attr('aria-expanded', 'false');
            $hideMenu.removeClass('active');
            $menuOverlay.removeClass('active');
            $body.removeClass('menu-open');
        }
        
        // ハンバーガーボタンのクリック
        $hamburger.on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
        
        // オーバーレイのクリックでメニューを閉じる
        $menuOverlay.on('click', function () {
            closeMenu();
        });
        
        // メニュー項目をクリックした時にメニューを閉じる
        $('.hide-list a, .hide-link a').on('click', function () {
            closeMenu();
        });
        
        // ESCキーでメニューを閉じる
        $(document).on('keydown', function (e) {
            if (e.key === 'Escape' && $hideMenu.hasClass('active')) {
                closeMenu();
            }
        });
        
        // ウィンドウリサイズ時にメニューを閉じる（タブレット以上のサイズに戻った時）
        $(window).on('resize', function () {
            if ($(window).width() > 768) {
                closeMenu();
            }
        });
        
        // アクセシビリティ: aria属性の初期化
        $hamburger.attr('aria-expanded', 'false')
                  .attr('aria-label', 'メニューを開く')
                  .attr('role', 'button');
    });

    $(window).on('scroll', function () {
        $('.absolute').each(function () {
            const elementTop = $(this).offset().top; // 要素の上端位置
            const scrollBottom = $(window).scrollTop() + $(window).height() * 0.8; // 画面下端から20%の位置
            if (scrollBottom > elementTop) {
                $(this).css({
                    'opacity': 1,
                    'transform': 'translateY(0)' // 上にスライド
                });
            }
        });
    });

    $(".toggle01").click(function() {
        $(".table-container01").slideToggle();
    });
    $(".toggle02").click(function() {
        $(".table-container02").slideToggle();
    });
});

$(function(){
    $('a[href^="#"]').click(function() {
    var speed = 500; // スクロール速度(ミリ秒)
    var href = $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top;
    $('html').animate({scrollTop:position}, speed, 'swing');
    return false;
    });
});