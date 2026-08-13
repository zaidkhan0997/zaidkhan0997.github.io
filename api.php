<?php
/**
 * MOHD ZAID ( zaidkhan0997 ) - Portfolio API Endpoint
 * PHP Dynamic Backend Services
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$action = $_GET['action'] ?? 'info';
$dataFile = __DIR__ . '/stats.json';

// Exact baseline: Views 1.7M+ (1,753,124), Likes 1.5M+ (1,518,437)
$defaultViews = 1753124;
$defaultLikes = 1518437;

// Initialize stats store if missing
if (!file_exists($dataFile)) {
    $initialStats = [
        'views' => $defaultViews,
        'likes' => $defaultLikes,
        'last_updated' => date('Y-m-d H:i:s')
    ];
    file_put_contents($dataFile, json_encode($initialStats, JSON_PRETTY_PRINT));
}

$stats = json_decode(file_get_contents($dataFile), true);
if (!$stats || !isset($stats['views']) || $stats['views'] < 1700000) {
    $stats['views'] = $defaultViews;
}
if (!$stats || !isset($stats['likes']) || $stats['likes'] < 1500000) {
    $stats['likes'] = $defaultLikes;
}

switch ($action) {
    case 'like':
        $stats['likes']++;
        $stats['last_updated'] = date('Y-m-d H:i:s');
        file_put_contents($dataFile, json_encode($stats, JSON_PRETTY_PRINT));
        echo json_encode([
            'status' => 'success',
            'action' => 'like',
            'likes' => $stats['likes'],
            'views' => $stats['views']
        ]);
        break;

    case 'unlike':
        $stats['likes'] = max(1500000, $stats['likes'] - 1);
        $stats['last_updated'] = date('Y-m-d H:i:s');
        file_put_contents($dataFile, json_encode($stats, JSON_PRETTY_PRINT));
        echo json_encode([
            'status' => 'success',
            'action' => 'unlike',
            'likes' => $stats['likes'],
            'views' => $stats['views']
        ]);
        break;

    case 'view':
        $stats['views']++;
        $stats['last_updated'] = date('Y-m-d H:i:s');
        file_put_contents($dataFile, json_encode($stats, JSON_PRETTY_PRINT));
        echo json_encode([
            'status' => 'success',
            'action' => 'view',
            'views' => $stats['views'],
            'likes' => $stats['likes']
        ]);
        break;

    case 'messages':
        $msgFile = __DIR__ . '/messages.json';
        $messages = file_exists($msgFile) ? json_decode(file_get_contents($msgFile), true) : [];
        echo json_encode([
            'status' => 'success',
            'count' => count($messages),
            'messages' => array_slice($messages, 0, 10)
        ]);
        break;

    case 'info':
    default:
        echo json_encode([
            'status' => 'online',
            'developer' => 'MOHD ZAID ( zaidkhan0997 )',
            'role' => 'Android Custom ROM & Kernel Developer',
            'php_version' => PHP_VERSION,
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'PHP Built-in Server',
            'server_time' => date('Y-m-d H:i:s T'),
            'total_views' => $stats['views'],
            'total_likes' => $stats['likes'],
            'capabilities' => [
                'PHP Contact Form Handler',
                'Live Stats Persistence',
                'CLI Terminal Execution',
                'REST API Service'
            ]
        ]);
        break;
}
