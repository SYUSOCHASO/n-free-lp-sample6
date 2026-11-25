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
/* ------------------------------------------------------------
   案3：スクロールで現れる動きと、料金のカウントアップ
   （CSS 側は .js .rv-* / .is-in。JS が動かない環境では何も隠さない）
------------------------------------------------------------ */
(function () {
    var root = document.documentElement;
    if (!window.requestAnimationFrame || !document.documentElement.classList) { root.classList.remove('js'); return; }
    window.__rv = true;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var targets = [];

    // ヒーロー見出しの 1 行目を 1 文字ずつに分ける（文言はそのまま、動かす単位だけ分ける）
    var firstLine = document.querySelector('.hero-title-line:not(.hero-title-accent)');
    if (firstLine && !reduce && !firstLine.children.length) {
        var chars = Array.from(firstLine.textContent);
        firstLine.textContent = '';
        chars.forEach(function (ch, i) {
            var span = document.createElement('span');
            span.className = 'ch';
            span.style.setProperty('--c', i);
            span.textContent = ch;
            firstLine.appendChild(span);
        });
        firstLine.classList.add('is-split');
    }

    function add(el, cls, index) {
        el.classList.add(cls);
        if (index) el.style.setProperty('--i', Math.min(index, 6));
        if (targets.indexOf(el) < 0) targets.push(el);
    }
    // selector に合う要素へ演出を割り当てる。fn(el, 兄弟の中での順番)
    function each(selector, fn) {
        Array.prototype.forEach.call(document.querySelectorAll(selector), function (el) {
            var siblings = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.matches(selector); });
            fn(el, Math.max(siblings.indexOf(el), 0));
        });
    }
    function set(selector, cls) { each(selector, function (el, i) { add(el, cls, i); }); }

    // --- お悩み：見出しは拭き出し、行は罫線が引かれて左から滑り込む
    set('.sec-problems .sec-title', 'rv-wipe');
    each('.problem', function (el, i) { add(el, 'rv-line', i); add(el.firstElementChild, 'rv-left', i); });
    // --- 帯（黒 / 緑）：背景色が伸び、文がせり上がる
    set('.statement', 'rv-band');
    set('.statement-main', 'rv-rise');
    set('.statement-note', 'rv-up');
    // --- 特徴：見出しはピントが合い、項目は左右から交互に入る
    set('.sec-features .sec-title', 'rv-focus');
    each('.feature', function (el, i) { add(el, i % 2 ? 'rv-right' : 'rv-left', i); });
    // --- 導入までの流れ：線が引かれ、番号が上から落ち、順番に進む
    set('.sec-flow .sec-title', 'rv-rise');
    each('.step', function (el, i) {
        add(el, 'rv-line', i);
        Array.prototype.forEach.call(el.children, function (child) { add(child, child.classList.contains('step-no') ? 'rv-drop' : 'rv-up', i); });
    });
    // --- 必要性：見出しは拭き出し、文は右から入る
    set('.sec-needs .sec-title', 'rv-wipe');
    set('.needs-list li', 'rv-right');
    // --- 無申告のリスク：見出しはピントが合い、項目は札がめくれる
    set('.sec-risk .sec-title', 'rv-focus');
    set('.risk', 'rv-flip');
    // --- 事前準備とポイント：小見出しは下線が引かれ、2 つの色面は幕が開く
    set('.sec-prep .sec-title', 'rv-rise');
    set('.sub-title', 'rv-uline');
    set('.reserve-list li', 'rv-up');
    set('.point', 'rv-down');
    set('.voice', 'rv-wipe');
    // --- 料金：見出しはせり上がり、料金の枠は広がって数字が駆け上がる
    set('.sec-price .sec-title', 'rv-rise');
    set('.plan', 'rv-zoom');
    set('.expense-lead', 'rv-wipe');
    set('.expense-title', 'rv-left');
    set('.expense-tags li', 'rv-pop');
    set('.expense-more', 'rv-up');
    // --- お問い合わせ：見出しは拭き出し、項目は線が引かれて下から
    set('.sec-contact .sec-title', 'rv-wipe');
    each('.contact-item', function (el, i) {
        add(el, 'rv-line', i);
        Array.prototype.forEach.call(el.children, function (child) { add(child, 'rv-up', i); });
    });
    set('.contact-action', 'rv-pop');
    // --- 申し込みボタン：途中のものは弾んで出る。最後のものは左から右へ伸びる
    set('.sec-features .cta, .sec-risk .cta', 'rv-pop');
    set('.sec-final .cta-note', 'rv-rise');
    set('.sec-final .btn-cta', 'rv-extend');

    // 料金：0 から数字が駆け上がる
    function countUp(el) {
        var finalText = el.textContent;
        var value = parseInt(finalText.replace(/[^\d]/g, ''), 10);
        var prefix = finalText.replace(/[\d,].*$/, '');
        if (reduce || !value) return;
        el.style.minWidth = el.getBoundingClientRect().width + 'px';
        var start = null, duration = 1400;
        function frame(now) {
            if (start === null) start = now;
            var t = Math.min((now - start) / duration, 1);
            var eased = 1 - Math.pow(1 - t, 4);
            el.textContent = prefix + Math.round(value * eased).toLocaleString('ja-JP');
            if (t < 1) { requestAnimationFrame(frame); } else { el.textContent = finalText; }
        }
        requestAnimationFrame(frame);
    }

    // 画面に入ったら .is-in を付ける。
    // IntersectionObserver は使わない：clip-path で隠した要素は「見えている部分」で判定されるため、
    // スマホ幅では見出しが画面内に入っても検知されず、隠れたままになった。位置を直接見れば clip-path の影響を受けない
    function reveal(el) {
        el.classList.add('is-in');
        if (el.classList.contains('plan')) {
            var price = el.querySelector('.plan-price strong');
            if (price) countUp(price);
        }
        // 現れ終わったら演出用のクラスを外し、ホバーなど元の動きに戻す（帯と罫線は残す）
        if (!/rv-(band|line|uline)/.test(el.className)) {
            setTimeout(function () {
                el.className = el.className.replace(/\brv-[a-z]+\b|\bis-in\b/g, '').replace(/\s+/g, ' ').trim();
                el.style.removeProperty('--i');
            }, 2800);
        }
    }
    var ticking = false;
    function check() {
        ticking = false;
        var limit = window.innerHeight * 0.9;
        targets = targets.filter(function (el) {
            if (el.getBoundingClientRect().top < limit) { reveal(el); return false; }
            return true;
        });
        if (!targets.length) {
            window.removeEventListener('scroll', request);
            window.removeEventListener('resize', request);
        }
    }
    function request() { if (!ticking) { ticking = true; requestAnimationFrame(check); } }
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    window.addEventListener('load', request);
    request();
})();

/* ------------------------------------------------------------
   背景パターン「撮る→記帳される」：座標はスマホ画像の中心を (0,0) とした px。
   レシートは道筋に沿って中心へ向かいながら小さくなり、行は中心から出て大きくなる。PC 用とスマホ用で道筋を分ける
------------------------------------------------------------ */
(function () {
    var host = document.querySelector('.hero');
    if (!host) return;
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var receipt = '<rect class="w-shade" x="-17" y="-22" width="40" height="56" rx="2"/><rect class="w-paper" x="-20" y="-28" width="40" height="56" rx="2"/>'
        + '<rect class="w-print" x="-13" y="-19" width="26" height="3.4" rx="1.7"/><rect class="w-print" x="-13" y="-11" width="17" height="3.4" rx="1.7"/>'
        + '<rect class="w-print" x="-13" y="-3" width="26" height="3.4" rx="1.7"/><rect class="w-print" x="-13" y="5" width="20" height="3.4" rx="1.7"/><rect class="w-mark" x="1" y="16" width="12" height="4" rx="2"/>';
    var row = '<rect class="w-shade" x="-49" y="-11" width="104" height="32" rx="16"/><rect class="w-paper" x="-52" y="-16" width="104" height="32" rx="16"/>'
        + '<circle class="w-mark" cx="-36" cy="0" r="10"/><path class="w-tick" d="M-41 0.4l3.4 3.4L-31 -3.4"/>'
        + '<rect class="w-print" x="-20" y="-2.4" width="40" height="4.8" rx="2.4"/><rect class="w-mark" x="28" y="-2.4" width="14" height="4.8" rx="2.4"/>';
    function mover(shape, d, dur, begin, tilt, into) {
        var motion = still ? '' : '<animateMotion dur="' + dur + 's" begin="' + begin + 's" repeatCount="indefinite" path="' + d + '"'
            + (into ? ' keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".4 0 .9 .6"' : ' keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".1 .5 .5 1"') + '/>';
        var fade = still ? '' : '<animate attributeName="opacity" values="' + (into ? '0;1;1;0' : '0;1;1;0') + '" keyTimes="' + (into ? '0;.12;.9;1' : '0;.15;.8;1') + '" dur="' + dur + 's" begin="' + begin + 's" repeatCount="indefinite"/>';
        var size = still ? '' : '<animateTransform attributeName="transform" type="scale" values="' + (into ? '1;1;.3' : '.3;1;1') + '" keyTimes="' + (into ? '0;.7;1' : '0;.3;1') + '" dur="' + dur + 's" begin="' + begin + 's" repeatCount="indefinite"/>';
        return '<g opacity="0">' + motion + fade + '<g>' + size + '<g transform="rotate(' + tilt + ')">' + shape + '</g></g></g>';
    }
    function set(cls, ins, outs, halo) {
        var g = '<g class="' + cls + '"><circle class="w-halo" r="' + halo + '"/>';
        if (!still) g += '<circle class="w-pulse" r="' + halo + '"><animate attributeName="r" values="' + (halo * .7) + ';' + (halo * 1.5) + '" dur="2.6s" repeatCount="indefinite"/><animate attributeName="opacity" values=".6;0" dur="2.6s" repeatCount="indefinite"/></circle>';
        ins.forEach(function (d, i) { g += mover(receipt, d, 7 + (i % 3), -(i * 1.37).toFixed(2), [-12, 9, -6, 14, -9, 7, -14][i % 7], true); });
        outs.forEach(function (d, i) { g += mover(row, d, 6 + (i % 2), -(i * 2.1).toFixed(2), [-5, 4, -3][i % 3], false); });
        return g + '</g>';
    }
    host.insertAdjacentHTML('afterbegin', '<svg class="hero-bg w-flow" aria-hidden="true" focusable="false">'
        + set('w-pc',
            ['M-1180 -250C-820 -420 -420 -300 0 0', 'M-1180 130C-780 270 -380 180 0 0', 'M-720 -520C-540 -300 -260 -200 0 0', 'M-640 520C-470 300 -240 160 0 0',
             'M-1220 -30C-820 -90 -400 40 0 0', 'M-300 -540C-340 -340 -160 -150 0 0', 'M-980 460C-700 360 -320 240 0 0'],
            ['M0 0C60 -220 130 -330 300 -440', 'M0 0C70 220 130 330 300 440', 'M0 0C150 -40 240 -20 380 -70', 'M0 0C-80 -240 -200 -330 -380 -400'], 250)
        + set('w-sp',
            ['M-150 -760C-230 -500 -120 -260 0 0', 'M160 -720C250 -460 120 -240 0 0', 'M-240 -430C-210 -260 -100 -120 0 0', 'M250 -390C210 -240 100 -100 0 0',
             'M10 -800C70 -560 -40 -280 0 0', 'M-230 -620C-120 -420 -160 -200 0 0'],
            ['M0 0C-80 -60 -130 -150 -150 -230', 'M0 0C80 30 130 90 150 150', 'M0 0C80 -80 130 -140 140 -220'], 140)
        + '</svg>');
    // 図の原点を、スマホ画像の中心に合わせる（浮く動きに引きずられないよう、レイアウト上の位置で測る）
    var svg = host.firstElementChild, inner = host.querySelector('.hero-inner'), visual = host.querySelector('.hero-visual');
    function place() {
        if (!inner || !visual) return;
        svg.style.setProperty('--px', (inner.offsetLeft + visual.offsetLeft + visual.offsetWidth / 2) + 'px');
        svg.style.setProperty('--py', (inner.offsetTop + visual.offsetTop + visual.offsetHeight / 2) + 'px');
    }
    place();
    window.addEventListener('resize', place);
    window.addEventListener('load', place);
})();
