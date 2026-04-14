document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".contact-form");
    const recaptchaResponse = document.getElementById("recaptchaResponse");

    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent form submission until reCAPTCHA is verified

        grecaptcha.ready(() => {

                recaptchaResponse.value = token; // Set the token value
                form.submit(); // Submit the form
            });
        });
    });

