(function () {
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.add("js");

  function wait(duration) {
    return new Promise(function (resolve) {
      window.setTimeout(resolve, duration);
    });
  }

  function updateClock() {
    var clock = document.getElementById("terminal-clock");
    var now = new Date();

    clock.dateTime = now.toISOString();
    var date = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "America/New_York"
    }).format(now);
    var time = new Intl.DateTimeFormat([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "America/New_York"
    }).format(now);

    clock.textContent = date + " " + time + " ET";
  }

  async function type(target) {
    var text = target.textContent.trim();
    var markup = target.children.length ? target.innerHTML : "";
    var speed = Number(target.dataset.speed) || 28;
    var postDelay = Number(target.dataset.postDelay) || 0;

    target.textContent = "";
    target.classList.add("state-typing");

    for (var index = 0; index < text.length; index += 1) {
      target.textContent += text[index];
      await wait(speed);
    }

    if (markup) {
      target.innerHTML = markup;
    }

    target.classList.remove("state-typing");

    if (postDelay) {
      await wait(0);
      target.classList.add("state-cursor");
      await wait(postDelay);
      target.classList.remove("state-cursor");
    }

    if (target.hasAttribute("data-cursor-after")) {
      target.classList.add("state-cursor");
    }

    await wait(180);
  }

  async function run() {
    var command = document.querySelector("[data-type]");
    var section = document.querySelector("section");
    var statement = document.querySelector("section strong");
    var email = document.querySelector("[data-output-command]");
    var emailCommand = email.closest(".email-command");
    var resizeFrame;

    function statementFits() {
      return statement.getClientRects().length === 1;
    }

    function syncStatementHighlight() {
      statement.classList.toggle("state-highlighted", statementFits());
    }

    function scheduleStatementHighlightSync() {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(syncStatementHighlight);
    }

    if (!reducedMotion) {
      await type(command);
    }

    section.classList.add("state-ready");

    if (!reducedMotion) {
      await wait(250);
      syncStatementHighlight();
      window.addEventListener("resize", scheduleStatementHighlightSync);

      if (statement.classList.contains("state-highlighted")) {
        await wait(650);
      }

      emailCommand.classList.add("state-ready");
      await type(email);
    } else {
      syncStatementHighlight();
      window.addEventListener("resize", scheduleStatementHighlightSync);
      emailCommand.classList.add("state-ready");
      email.classList.add("state-cursor");
    }

    if (document.fonts) {
      document.fonts.ready.then(syncStatementHighlight);
    }
  }

  function start() {
    var clock = document.createElement("time");

    document.getElementById("current-year").textContent = new Date().getFullYear();
    clock.id = "terminal-clock";
    document.querySelector("header").appendChild(clock);
    updateClock();
    window.setInterval(updateClock, 1000);
    run();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
