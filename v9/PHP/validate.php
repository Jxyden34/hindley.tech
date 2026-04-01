<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $secretKey = '6LcIIbYqAAAAAOUSxPiRWahyEM6FVR2mf6XJ6FCu'; // Replace with your reCAPTCHA secret key
    $captcha = $_POST['recaptcha_response'];
    $url = 'https://www.google.com/recaptcha/api/siteverify';

    // Verify reCAPTCHA response
    $response = file_get_contents($url . '?secret=' . $secretKey . '&response=' . $captcha);
    $responseKeys = json_decode($response, true);

    if ($responseKeys['success'] && $responseKeys['score'] >= 0.5) {
        // Success: Process the form (e.g., send email or save to database)
        echo "Form submitted successfully!";
    } else {
        // Failure
        echo "reCAPTCHA verification failed. Please try again.";
    }
} else {
    echo "Invalid request.";
}
?>
