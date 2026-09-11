// Jacob Capistrano — Portfolio
// Section 1: "See My Work" scrolls to the next section (works with CSS scroll-snap)

document.addEventListener("DOMContentLoaded", function () {
  const seeWorkBtn = document.getElementById("seeWorkBtn");
  const nextSection = document.getElementById("section-2");

  if (seeWorkBtn && nextSection) {
    seeWorkBtn.addEventListener("click", function () {
      nextSection.scrollIntoView({ behavior: "smooth" });
    });
  }
});
/* ============================================================
   JACOB CAPISTRANO — PORTFOLIO
   Section 2: Featured Projects
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {


  /* ==========================================================
     SEE MY WORK
     ========================================================== */

  const seeWorkBtn = document.getElementById("seeWorkBtn");


  // if (seeWorkBtn) {

  //   seeWorkBtn.addEventListener("click", () => {

  //     window.open(
  //       "https://drive.google.com/drive/folders/1THpBD8Jo44cO6gj3JwVXQAABkKCWu90-",
  //       "_blank",
  //       "noopener,noreferrer"
  //     );

  //   });

  // }



  /* ==========================================================
     CAROUSEL ELEMENTS
     ========================================================== */

  const slides = Array.from(
    document.querySelectorAll(".project-slide")
  );


  if (slides.length === 0) {
    return;
  }


  const indicators = Array.from(
    document.querySelectorAll(
      ".carousel-indicator span"
    )
  );


  let currentSlide = 0;

  let previewTimer = null;



  /* ==========================================================
     CLEAR PREVIEW TIMER
     ========================================================== */

  function clearPreviewTimer() {

    if (previewTimer !== null) {

      clearTimeout(previewTimer);

      previewTimer = null;

    }

  }



  /* ==========================================================
     STOP VIDEO
     ========================================================== */

  function stopVideo(video) {

    if (!video) {
      return;
    }


    video.pause();


    /*
     * Reset to the beginning.
     */

    try {

      video.currentTime = 0;

    } catch (error) {

      /*
       * Ignore if the video hasn't loaded
       * its metadata yet.
       */

    }

  }



  /* ==========================================================
     STOP ALL SLIDE VIDEOS
     ========================================================== */

  function stopAllVideos() {

    slides.forEach((slide) => {

      const video =
        slide.querySelector(".project-video");


      const container =
        slide.querySelector(
          ".project-video-container"
        );


      if (video) {

        stopVideo(video);

        /*
         * Reset manual state.
         */

        video.dataset.manualPlay = "false";

        /*
         * Videos that aren't the active,
         * manually-played one should never
         * show the native scrubber/controls
         * or carry over audio.
         */

        video.controls = false;

        video.muted = true;

        video.volume = 0;

      }


      if (container) {

        container.classList.remove(
          "is-playing"
        );

      }

    });

  }



  /* ==========================================================
     UPDATE CAROUSEL INDICATOR
     ========================================================== */

  function updateIndicators() {

    indicators.forEach((indicator, index) => {

      indicator.classList.remove(
        "indicator-active"
      );


      if (index === currentSlide) {

        indicator.classList.add(
          "indicator-active"
        );

      }

    });

  }



  /* ==========================================================
     START 3-SECOND PREVIEW
     ========================================================== */

  function startPreview(slide) {

    const video =
      slide.querySelector(".project-video");


    if (!video) {
      return;
    }


    clearPreviewTimer();


    /*
     * Autoplay must be muted, and the
     * preview shouldn't show the scrubber.
     */

    video.muted = true;

    video.volume = 0;

    video.controls = false;


    /*
     * This tells us that the user hasn't
     * manually started this video yet.
     */

    video.dataset.manualPlay = "false";


    /*
     * Always start preview at 0 seconds.
     */

    try {

      video.currentTime = 0;

    } catch (error) {

      // Metadata isn't available yet.

    }


    /*
     * This function starts the preview.
     */

    const beginPreview = () => {

      /*
       * Don't start preview if the slide
       * has already been changed.
       */

      if (!slide.classList.contains("active")) {
        return;
      }


      /*
       * Don't start preview if the user
       * already clicked play.
       */

      if (video.dataset.manualPlay === "true") {
        return;
      }


      video.muted = true;

      video.volume = 0;


      /*
       * Ask the browser to play.
       */

      const playPromise = video.play();


      /*
       * Chrome / Edge / Safari return a Promise.
       */

      if (playPromise !== undefined) {

        playPromise
          .then(() => {

            /*
             * Playback successfully started.
             *
             * Now allow exactly 3 seconds.
             */

            clearPreviewTimer();


            previewTimer = setTimeout(() => {

              /*
               * Make sure we're still on
               * the same slide.
               */

              if (
                slide.classList.contains("active") &&
                video.dataset.manualPlay !== "true"
              ) {

                video.pause();


                try {

                  video.currentTime = 0;

                } catch (error) {

                  // Ignore.

                }

              }

            }, 3000);

          })
          .catch((error) => {

            /*
             * Browser prevented autoplay.
             *
             * This is normal browser behavior in
             * some circumstances. The play button
             * remains available.
             */

            console.log(
              "Preview autoplay was blocked:",
              error
            );

          });

      }

    };


    /*
     * If the browser already has enough data,
     * start immediately.
     */

    if (video.readyState >= 3) {

      beginPreview();

    } else {

      /*
       * Wait until enough video data has loaded.
       */

      video.addEventListener(
        "canplay",
        beginPreview,
        {
          once: true
        }
      );

    }

  }



  /* ==========================================================
     SHOW SLIDE
     ========================================================== */

  function showSlide(index) {

    clearPreviewTimer();

    stopAllVideos();


    /*
     * Loop to the last slide.
     */

    if (index < 0) {

      index = slides.length - 1;

    }


    /*
     * Loop to the first slide.
     */

    if (index >= slides.length) {

      index = 0;

    }


    currentSlide = index;


    /*
     * Hide every slide.
     */

    slides.forEach((slide) => {

      slide.classList.remove("active");

    });


    /*
     * Show current slide.
     */

    const activeSlide =
      slides[currentSlide];


    activeSlide.classList.add("active");


    /*
     * Update indicator.
     */

    updateIndicators();


    /*
     * Start automatic preview.
     */

    startPreview(activeSlide);

  }



  /* ==========================================================
     MANUAL PLAY
     ========================================================== */

  function playVideoManually(slide) {

    const video =
      slide.querySelector(".project-video");


    const container =
      slide.querySelector(
        ".project-video-container"
      );


    if (!video) {
      return;
    }


    /*
     * Stop the 3-second preview timer.
     */

    clearPreviewTimer();


    /*
     * This is now a user-controlled video.
     */

    video.dataset.manualPlay = "true";


    /*
     * This is a direct user gesture (click), so
     * browsers allow audio here — unmute and
     * restore normal volume.
     */

    video.muted = false;

    video.volume = 1;


    /*
     * Show the native scrubber / timestamps /
     * volume control now that the user is in
     * charge of playback.
     */

    video.controls = true;


    /*
     * Hide the large custom play button —
     * the native controls take over from here.
     */

    if (container) {

      container.classList.add(
        "is-playing"
      );

    }


    /*
     * Play the video normally.
     */

    const playPromise =
      video.play();


    if (playPromise !== undefined) {

      playPromise.catch((error) => {

        console.log(
          "Could not play video:",
          error
        );


        /*
         * Playback failed, so make
         * the play button available again.
         */

        if (container) {

          container.classList.remove(
            "is-playing"
          );

        }

      });

    }

  }



  /* ==========================================================
     PLAY BUTTONS
     ========================================================== */

  const playButtons =
    document.querySelectorAll(
      ".video-play-button"
    );


  playButtons.forEach((button) => {

    button.addEventListener(
      "click",
      (event) => {

        /*
         * Prevent the click from triggering
         * anything underneath.
         */

        event.stopPropagation();


        const slide =
          button.closest(
            ".project-slide"
          );


        if (!slide) {
          return;
        }


        playVideoManually(slide);

      }
    );

  });



  /* ==========================================================
     CLICKING THE VIDEO
     ========================================================== */

  const videos =
    document.querySelectorAll(
      ".project-video"
    );


  videos.forEach((video) => {

    video.addEventListener(
      "click",
      () => {

        /*
         * Once native controls are showing,
         * let the browser handle clicks on
         * the scrubber / buttons itself —
         * only toggle play/pause when the
         * video hasn't been manually started
         * yet (i.e. still in preview mode).
         */

        if (video.dataset.manualPlay === "true") {
          return;
        }


        const slide =
          video.closest(
            ".project-slide"
          );


        if (!slide) {
          return;
        }


        playVideoManually(slide);

      }
    );

  });



  /* ==========================================================
     NEXT ARROW
     ========================================================== */

  const nextButtons =
    document.querySelectorAll(
      ".carousel-next"
    );


  nextButtons.forEach((button) => {

    button.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();

        showSlide(
          currentSlide + 1
        );

      }
    );

  });



  /* ==========================================================
     PREVIOUS ARROW
     ========================================================== */

  const previousButtons =
    document.querySelectorAll(
      ".carousel-prev"
    );


  previousButtons.forEach((button) => {

    button.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();

        showSlide(
          currentSlide - 1
        );

      }
    );

  });



  /* ==========================================================
     INITIALIZE
     ========================================================== */

  showSlide(0);

});
