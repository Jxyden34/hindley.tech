document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".contact-form");
    const recaptchaResponse = document.getElementById("recaptchaResponse");

    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent form submission until reCAPTCHA is verified

        grecaptcha.ready(() => {
            grecaptcha.execute("6LcIIbYqAAAAAOUSxPiRWahyEM6FVR2mf6XJ6FCu", { action: "submit" }).then((token) => {
                recaptchaResponse.value = token; // Set the token value
                form.submit(); // Submit the form
            });
        });
    });
});
