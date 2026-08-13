<?php
/**
 * MOHD ZAID ( zaidkhan0997 ) - Portfolio Contact Form Handler
 * PHP Mailbox Processor (Dispatches to Email Client via PHP)
 */

// Allow CORS & Pre-flight
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check if POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $isJson = isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;
    if ($isJson || isset($_GET['format'])) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'status' => 'info',
            'message' => 'PHP Contact Mailer Ready. Send a POST request to dispatch email.',
            'php_version' => PHP_VERSION,
            'recipient' => 'zaidkhan0997@proton.me'
        ]);
        exit;
    }
    header('Location: index.php');
    exit;
}

// Read input (Support JSON body & form-urlencoded)
$rawInput = file_get_contents('php://input');
$jsonData = json_decode($rawInput, true);

$name = trim($jsonData['name'] ?? $_POST['name'] ?? 'Anonymous');
$subject = trim($jsonData['subject'] ?? $_POST['subject'] ?? 'Portfolio Inquiry / Collaboration');
$message = trim($jsonData['message'] ?? $_POST['message'] ?? '');

if (empty($message)) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Message content cannot be empty.'
    ]);
    exit;
}

// Target email address
$toEmail = 'zaidkhan0997@proton.me';

// Construct formatted mail body in PHP
$bodyText = "Hi MOHD ZAID,\n\n" . $message . "\n\n---\nSender Name: " . $name . "\nDispatched via PHP " . PHP_VERSION . " Mail Engine";

// Build Mailto URI for opening mail client / mailbox app
$mailtoUrl = "mailto:" . $toEmail . "?subject=" . rawurlencode($subject) . "&body=" . rawurlencode($bodyText);

// Attempt PHP mail() function (if mail server is configured on system)
$mailHeaders = "From: webmaster@localhost\r\n" .
               "Reply-To: " . $toEmail . "\r\n" .
               "X-Mailer: PHP/" . PHP_VERSION;

@mail($toEmail, $subject, $bodyText, $mailHeaders);

// Determine response mechanism
$isAjax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') 
          || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false)
          || !empty($jsonData);

if ($isAjax) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'status' => 'success',
        'message' => 'PHP processed your message. Launching your email client...',
        'mailto' => $mailtoUrl,
        'recipient' => $toEmail
    ]);
    exit;
} else {
    // Standard POST redirect directly to mailto URL to launch mail client
    header('Location: ' . $mailtoUrl);
    exit;
}
