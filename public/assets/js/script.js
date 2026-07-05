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

    await wait(240);
  }

  async function run() {
    var commands = document.querySelectorAll("[data-command]");
    var command = commands[0];
    var section = document.querySelector("section");
    var output = commands[1];
    var outputCommand = output ? output.closest(".output-command") : null;

    if (!section) {
      return;
    }

    if (!command || !output || !outputCommand) {
      section.classList.add("state-ready");
      return;
    }

    if (!reducedMotion) {
      await type(command);
    }

    section.classList.add("state-ready");
    outputCommand.classList.add("state-ready");

    if (!reducedMotion) {
      await wait(250);
      outputCommand.classList.add("state-commanding");
      await type(output);
    } else {
      outputCommand.classList.add("state-commanding");
      output.classList.add("state-cursor");
    }
  }

  function start() {
    var clock = document.createElement("time");
    var currentYear = document.getElementById("current-year");
    var header = document.querySelector("header");

    if (currentYear) {
      currentYear.textContent = new Date().getFullYear();
    }

    if (!header) {
      return;
    }

    clock.id = "terminal-clock";
    header.appendChild(clock);
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
