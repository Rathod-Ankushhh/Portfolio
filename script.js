(function () {
    "use strict";

    // ==========================================
    // CONFIGURATION
    // ==========================================

    var RM = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    var $ = function (id) {
        return document.getElementById(id);
    };

    var clamp = function (v) {
        return Math.max(0, Math.min(1, v));
    };

    var ease = function (t) {
        return t * t * (3 - 2 * t);
    };

    function kf(p, a) {
        if (p <= a[0][0]) return a[0][1];

        for (var i = 1; i < a.length; i++) {
            if (p <= a[i][0]) {
                var t = ease(
                    clamp(
                        (p - a[i - 1][0]) /
                        (a[i][0] - a[i - 1][0])
                    )
                );

                return a[i - 1][1] +
                    (a[i][1] - a[i - 1][1]) * t;
            }
        }

        return a[a.length - 1][1];
    }

    // ==========================================
    // SYNTAX HIGHLIGHTER
    // ==========================================

    var KW = /^(const|let|var|def|class|return|import|from|function|async|await|if|else|for|in|new|self|True|False|None|lambda)$/;

    var esc = function (t) {
        return t
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    };

    function hl(src) {
        return src.split("\n").map(function (ln) {

            var re = /(\/\/.*|#.*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(<\/?[a-zA-Z][\w-]*|\/?>)|(\b\d+\b)|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)/g;

            var o = "";
            var last = 0;
            var m;

            while ((m = re.exec(ln))) {
                o += esc(ln.slice(last, m.index));

                var c = m[1]
                    ? "c"
                    : m[2]
                    ? "s"
                    : m[3]
                    ? "k"
                    : m[4]
                    ? "n"
                    : m[5]
                    ? "f"
                    : KW.test(m[6])
                    ? "k"
                    : "";

                o += c
                    ? '<span class="' + c + '">' +
                        esc(m[0]) +
                        "</span>"
                    : esc(m[0]);

                last = re.lastIndex;
            }

            return '<span class="l">' +
                o +
                esc(ln.slice(last)) +
                "</span>";

        }).join("");
    }

    // ==========================================
    // DEMO CODE FILES
    // ==========================================

    var FILES = [

        `<header>
    <h1>Ankush Rathod</h1>
    <p>Frontend & Python developer</p>
</header>

<section>
    <h2>Upcoming events</h2>
    <div class="card">Tech Meetup</div>
    <div class="card">Design Workshop</div>
    <button id="reg">Register</button>
</section>`,

        `body {
    font-family: Inter, sans-serif;
    background: #1D1F22;
}

header {
    text-align: center;
}

.card {
    padding: 16px;
    border-radius: 12px;
    border: 1px solid #2E3034;
}

.card:hover {
    transform: translateY(-4px);
}

button {
    background: #A3B8A0;
}`,

        `const btn = document.querySelector("#reg");

btn.addEventListener("click", () => {
    btn.textContent = "Registered ✓";
});`,

        `class Event(models.Model):

    title = models.CharField(max_length=100)
    date = models.DateField()


def events(request):

    data = Event.objects.all()

    return render(request, "events.html", {"events": data})`

    ];

    // ==========================================
    // CAPTIONS
    // ==========================================

    var CAP = [

        [
            "01 / home",
            "Open the editor",
            "Every project starts here. Scroll and watch the backend get written.",
            "git init"
        ],

        [
            "02 / django",
            "Django: backend",
            "A Python backend serves the data. This is the idea behind EventForms, my event discovery and registration app.",
            "feat: models and views"
        ],

        [
            "03 / ship",
            "Ship it",
            "Push to main and it's live. Now, the details about me.",
            "deploy: ship it"
        ],

        [
            "04 / close",
            "Close the laptop",
            "That's the build. Time to open the book.",
            "git log"
        ],

        [
            "05 / about",
            "About & skills",
            "Chapter one: who I am and what I work with.",
            "chapter 1"
        ],

        [
            "06 / projects",
            "Projects & education",
            "Chapter two: what I've built and where I studied.",
            "chapter 2"
        ],

        [
            "07 / experience",
            "Experience & certificates",
            "Chapter three: where I've worked and what I've earned.",
            "chapter 3"
        ],

        [
            "08 / contact",
            "Contact & tech stack",
            "Final chapter: get in touch, and see what this site is built with.",
            "chapter 4"
        ]

    ];

    var STP = [
        "$ code .",
        "$ python manage.py runserver",
        "$ git push origin main"
    ];

    var NAMES = [
        "home",
        "django",
        "ship",
        "close",
        "about",
        "projects",
        "experience",
        "contact"
    ];

    var MID = [
        .03, .18, .33, .45,
        .59, .71, .83, .98
    ];

    var STG = [
        .08, .28, .38, .5,
        .65, .77, .89
    ];

    var stageOf = function (p) {
        for (var i = 0; i < STG.length; i++) {
            if (p < STG[i]) return i;
        }

        return STG.length;
    };

    // ==========================================
    // MAIN ELEMENTS
    // ==========================================

    var lap = $("lap");
    var ed = $("ed");
    var pv = $("pv");
    var book = $("book");

    var mob = false;

    var W = 900;
    var H = 567;

    var PW = 400;
    var PH = 600;

    var LF = [0, 1, 2, 3, 4].map(function (i) {
        return $("L" + i);
    });

    var FS = [.5, .62, .74, .86];

    // Check required elements before continuing.
    if (!lap || !ed || !pv || !book) {
        console.error(
            "Portfolio animation: Required elements are missing. Check IDs: lap, ed, pv, book."
        );
        return;
    }

    var reveal = [].slice.call(
        pv.querySelectorAll("[data-t]")
    );

    // ==========================================
    // RESPONSIVE LAYOUT
    // ==========================================

    function lay() {
        mob = window.innerWidth < 700;

        var r = mob ? .95 : .63;

        W = Math.min(
            920,
            window.innerWidth * (mob ? .94 : .9),
            window.innerHeight * .66 / r
        );

        H = W * r;

        lap.style.setProperty("--W", W + "px");
        lap.style.setProperty("--H", H + "px");
        lap.style.setProperty("--D", W * .62 + "px");

        lap.style.setProperty(
            "--fs",
            W / (mob ? 40 : 62) + "px"
        );

        PH = Math.min(
            window.innerHeight * (mob ? .74 : .78),
            680
        );

        PW = Math.min(
            PH * .74,
            window.innerWidth * .475
        );

        book.style.setProperty("--PW", PW + "px");
        book.style.setProperty("--PH", PH + "px");

        book.style.setProperty(
            "--bfs",
            Math.max(mob ? 9.5 : 12, PW / 28) + "px"
        );

        document.body.classList.toggle("mob", mob);
    }

    lay();

    window.addEventListener("resize", lay);

    // ==========================================
    // FLOATING TECHNOLOGY TAGS
    // ==========================================

    [
        ["HTML5", 0, "left:3vw;top:30%"],
        ["CSS3", 0, "left:6vw;top:44%"],
        ["JavaScript", 0, "left:3vw;top:58%"],
        ["Python", 1, "right:3vw;top:30%"],
        ["Django", 1, "right:6vw;top:44%"],
        ["SQLite", 1, "right:3vw;top:58%"]

    ].forEach(function (t) {

        var d = document.createElement("div");

        d.className = "tg";
        d.textContent = t[0];
        d.dataset.s = t[1];
        d.style.cssText = t[2];

        document.body.appendChild(d);

    });

    var tgs = [].slice.call(
        document.querySelectorAll(".tg")
    );

    // ==========================================
    // NAVIGATION DOTS
    // ==========================================

    var dots = $("dots");
    var db = [];

    function goP(q) {
        var h =
            document.documentElement.scrollHeight -
            window.innerHeight;

        window.scrollTo({
            top: q * h,
            behavior: RM ? "auto" : "smooth"
        });
    }

    function go(i) {
        goP(MID[i]);
    }

    document.querySelectorAll("[data-p]").forEach(function (e) {

        e.addEventListener("click", function (ev) {
            ev.preventDefault();
            goP(+e.dataset.p);
        });

    });

    var navb = [].slice.call(
        document.querySelectorAll(".nl button")
    );

    if (dots) {
        NAMES.forEach(function (n, i) {

            var b = document.createElement("button");

            b.setAttribute("aria-label", "Go to " + n);

            b.onclick = function () {
                go(i);
            };

            dots.appendChild(b);
            db.push(b);

        });
    }

    // ==========================================
    // PREVIEW INTERACTION
    // ==========================================

    var jsOn = false;
    var reg = $("reg");

    if (reg) {
        reg.addEventListener("click", function () {

            if (!jsOn) return;

            reg.textContent = "Registered ✓";
            reg.classList.add("ok");

        });
    }

    reveal.forEach(function (e) {
        e.style.display = "";
    });

    pv.className = "pv s1 s2 s3";

    // ==========================================
    // ANIMATION STATE
    // ==========================================

    var tgt = 0;
    var cur = 0;

    var mx = 0;
    var my = 0;

    var tmx = 0;
    var tmy = 0;

    var lastKey = "";
    var lastSt = -1;

    function rd() {
        var h =
            document.documentElement.scrollHeight -
            window.innerHeight;

        tgt = h > 0
            ? clamp(window.scrollY / h)
            : 0;
    }

    window.addEventListener("scroll", rd, {
        passive: true
    });

    rd();

    window.addEventListener("mousemove", function (e) {

        tmx = e.clientX / window.innerWidth - .5;
        tmy = e.clientY / window.innerHeight - .5;

    });

    // ==========================================
    // OVERLAY ELEMENTS
    // ==========================================

    var intro = $("intro");
    var hint = $("hint");
    var cap = $("cap");

    var tabs = [0, 1, 2, 3].map(function (i) {
        return $("t" + i);
    });

    // ==========================================
    // MAIN ANIMATION LOOP
    // ==========================================

    function frame() {

        requestAnimationFrame(frame);

        cur += (tgt - cur) * (RM ? 1 : .08);

        mx += (tmx - mx) * .06;
        my += (tmy - my) * .06;

        var p = cur;

        // --------------------------------------
        // LAPTOP ANIMATION
        // --------------------------------------

        var eo = ease(clamp(p / .08));

        var ec = ease(clamp((p - .36) / .06));

        var op = eo * (1 - ec);

        lap.style.setProperty(
            "--lid",
            (-90 + 100 * op) + "deg"
        );

        var tilt = kf(p, [
            [0, 58],
            [.08, 22],
            [.28, 3],
            [.36, 3],
            [.42, 50],
            [.5, 70]
        ]);

        var ry = kf(p, [
            [0, -38],
            [.08, -20],
            [.16, 6],
            [.24, -3],
            [.36, 0],
            [.5, 25]
        ]) + mx * 10;

        var zoom = kf(p, [
            [0, .8],
            [.08, 1],
            [.28, 1.2],
            [.36, 1.2],
            [.42, .9],
            [.5, .7]
        ]);

        var sc = Math.min(
            zoom,
            window.innerWidth * .98 / W
        );

        var fly =
            ease(clamp((p - .42) / .07)) *
            window.innerHeight * 1.3;

        var ty =
            sc * (
                H * .46 * op -
                W * .62 * .28 * (1 - op)
            ) - fly;

        lap.style.transform =
            "translateY(" + ty + "px) " +
            "scale(" + sc + ") " +
            "rotateX(" + (tilt - my * 5) + "deg) " +
            "rotateY(" + ry + "deg)";

        lap.style.visibility =
            p > .5 ? "hidden" : "visible";

        document.body.style.setProperty(
            "--by",
            -p * 500 + "px"
        );

        // --------------------------------------
        // CODE TYPING ANIMATION
        // --------------------------------------

        var f4 = clamp((p - .08) / .2);

        var file = p < .08 ? -1 : 3;

        var n = file < 0
            ? 0
            : Math.floor(f4 * FILES[3].length);

        var key = file + ":" + n;

        if (key !== lastKey) {

            lastKey = key;

            ed.innerHTML = file < 0
                ? ""
                : hl(FILES[3].slice(0, n)) +
                    '<span class="caret"></span>';

        }

        tabs.forEach(function (t, i) {

            if (t) {
                t.classList.toggle("on", i === file);
            }

        });

        // --------------------------------------
        // PREVIEW UPDATES
        // --------------------------------------

        jsOn = eo > .9;

        var e5 = $("e5");
        var url = $("url");
        var bd = $("bd");

        if (e5) {
            e5.style.display =
                f4 > .5 ? "block" : "none";
        }

        if (url) {
            url.textContent =
                f4 > .15
                    ? "localhost:8000/events/"
                    : "localhost:8000";
        }

        if (bd) {
            bd.style.display =
                f4 > .4 ? "inline" : "none";
        }

        if (
            p < .08 &&
            reg &&
            reg.classList.contains("ok")
        ) {
            reg.classList.remove("ok");
            reg.textContent = "Register";
        }

        // --------------------------------------
        // BOOK ANIMATION
        // --------------------------------------

        var eb = ease(clamp((p - .42) / .07));

        var es = FS.map(function (s) {
            return ease(clamp((p - s) / .06));
        });

        LF.forEach(function (l, i) {

            if (!l) return;

            var e = i < 4 ? es[i] : 0;

            var z =
                (5 - i) * 1.5 * (1 - e) +
                i * 1.5 * e;

            l.style.transform =
                "translateZ(" + z + "px) " +
                "rotateY(" + (-180 * e) + "deg)";

        });

        var bt = kf(p, [
            [.42, 42],
            [.5, 26],
            [.56, 7],
            [1, 4]
        ]);

        var br = kf(p, [
            [.42, -32],
            [.5, -16],
            [.56, 0],
            [1, 0]
        ]) + mx * 6;

        book.style.transform =
            "translate3d(" +
            (-PW / 2 * (1 - es[0])) + "px," +
            ((1 - eb) * window.innerHeight) + "px,0) " +
            "rotateX(" + (bt - my * 4) + "deg) " +
            "rotateY(" + br + "deg)";

        book.style.visibility =
            p > .4 ? "visible" : "hidden";

        // --------------------------------------
        // CAPTIONS, STATUS AND TAGS
        // --------------------------------------

        var st = stageOf(p);

        if (st !== lastSt) {

            lastSt = st;

            var c = CAP[st];

            $("cn").textContent = c[0];
            $("ct").textContent = c[1];
            $("cx").textContent = c[2];
            $("cc").textContent = c[3];

            db.forEach(function (b, i) {
                b.classList.toggle("on", i === st);
            });

            $("hr").textContent =
                (st + 1) + "/8 · " + NAMES[st];

            tgs.forEach(function (t) {

                t.classList.toggle(
                    "on",
                    +t.dataset.s <= st
                );

            });

            navb.forEach(function (b) {

                b.classList.toggle(
                    "on",
                    +b.dataset.sp === (st >= 4 ? st - 4 : -1)
                );

            });

        }

        $("stp").textContent =
            STP[Math.min(st, 2)] +
            (st >= 2 && p > .34 ? " ✓ deployed" : "");

        // --------------------------------------
        // OVERLAY ANIMATIONS
        // --------------------------------------

        if (intro) {

            intro.style.opacity =
                1 - clamp(p / .05);

            intro.style.visibility =
                p > .06 ? "hidden" : "visible";

        }

        if (hint) {
            hint.style.opacity = p < .02 ? 1 : 0;
        }

        var co = 1 - clamp((p - .46) / .04);

        if (cap) {

            cap.style.opacity = co;

            cap.style.visibility =
                co < .02 ? "hidden" : "visible";

        }

        tgs.forEach(function (t) {

            t.style.visibility =
                p > .4 ? "hidden" : "visible";

        });

    }

    // ==========================================
    // START ANIMATION
    // ==========================================

    frame();

})();