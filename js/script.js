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




  function clearPreviewTimer() {

    if (previewTimer !== null) {

      clearTimeout(previewTimer);

      previewTimer = null;

    }

  }



  function stopVideo(video) {

    if (!video) {
      return;
    }


    video.pause();

    try {

      video.currentTime = 0;

    } catch (error) {

      /*
       * Ignore if the video hasn't loaded
       * its metadata yet.
       */

    }

  }



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


        video.dataset.manualPlay = "false";

  

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




  function startPreview(slide) {

    const video =
      slide.querySelector(".project-video");


    if (!video) {
      return;
    }


    clearPreviewTimer();



    video.muted = true;

    video.volume = 0;

    video.controls = false;




    video.dataset.manualPlay = "false";


    try {

      video.currentTime = 0;

    } catch (error) {

      // Metadata isn't available yet.

    }


    const beginPreview = () => {


      if (!slide.classList.contains("active")) {
        return;
      }



      if (video.dataset.manualPlay === "true") {
        return;
      }


      video.muted = true;

      video.volume = 0;

      const playPromise = video.play();


      /*
       * Chrome / Edge / Safari return a Promise.
       */

      if (playPromise !== undefined) {

        playPromise
          .then(() => {


            clearPreviewTimer();


            previewTimer = setTimeout(() => {


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


            console.log(
              "Preview autoplay was blocked:",
              error
            );

          });

      }

    };


    if (video.readyState >= 3) {

      beginPreview();

    } else {


      video.addEventListener(
        "canplay",
        beginPreview,
        {
          once: true
        }
      );

    }

  }


  function showSlide(index) {

    clearPreviewTimer();

    stopAllVideos();



    if (index < 0) {

      index = slides.length - 1;

    }



    if (index >= slides.length) {

      index = 0;

    }


    currentSlide = index;



    slides.forEach((slide) => {

      slide.classList.remove("active");

    });


    const activeSlide =
      slides[currentSlide];


    activeSlide.classList.add("active");


    updateIndicators();

    startPreview(activeSlide);

  }



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

    clearPreviewTimer();

    video.dataset.manualPlay = "true";



    video.muted = false;

    video.volume = 1;


    video.controls = true;

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

        if (container) {

          container.classList.remove(
            "is-playing"
          );

        }

      });

    }

  }

  const playButtons =
    document.querySelectorAll(
      ".video-play-button"
    );


  playButtons.forEach((button) => {

    button.addEventListener(
      "click",
      (event) => {

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


  const videos =
    document.querySelectorAll(
      ".project-video"
    );


  videos.forEach((video) => {

    video.addEventListener(
      "click",
      () => {

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

  showSlide(0);

});

const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stops the page reload

  const params = {
    name: document.getElementById("contact-name").value,
    email: document.getElementById("contact-email").value,
    message: document.getElementById("contact-message").value,
  };

  emailjs
    .send("service_730llqy", "template_wf4acqw", params)
    .then(() => {
      alert("Email successfully sent!");
      contactForm.reset();
    })
    .catch((error) => {
      console.error("EmailJS error:", error);
      alert("Something went wrong. Please try again.");
    });
});
