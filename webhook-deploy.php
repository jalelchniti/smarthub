<?php
/**
 * SmartHub Auto-Deployment Script
 * Receives GitHub webhooks and automatically deploys the application
 * 
 * Usage: Place this file at /www/smarthub/webhook-deploy.php on OVH server
 * GitHub webhook URL: http://fohaixl.cluster100.hosting.ovh.net/smarthub/webhook-deploy.php
 */

// Configuration
define('WEBHOOK_SECRET', 'smarthub_deploy_2024_secure'); // Match GitHub webhook secret
define('REPO_URL', 'https://github.com/jalelchniti/smarthubnew.git');
define('BRANCH', 'master');
define('DEPLOY_PATH', '/home/fohaixl/www/smarthub');
define('TEMP_PATH', '/tmp/smarthub_deploy');
define('LOG_FILE', DEPLOY_PATH . '/deploy.log');

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Hub-Signature-256');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(json_encode(['status' => 'ok', 'message' => 'CORS preflight']));
}

/**
 * Log deployment activities
 */
function deployLog($message) {
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[$timestamp] $message\n";
    file_put_contents(LOG_FILE, $logEntry, FILE_APPEND | LOCK_EX);
    error_log($logEntry);
}

/**
 * Send JSON response
 */
function sendResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

/**
 * Verify GitHub webhook signature
 */
function verifyGitHubSignature($payload, $signature) {
    $expectedSignature = 'sha256=' . hash_hmac('sha256', $payload, WEBHOOK_SECRET);
    return hash_equals($expectedSignature, $signature);
}

/**
 * Execute shell command safely
 */
function executeCommand($command, $description = '') {
    deployLog("Executing: $description - $command");
    
    $output = [];
    $returnVar = 0;
    
    exec($command . ' 2>&1', $output, $returnVar);
    
    $outputStr = implode("\n", $output);
    deployLog("Command output: $outputStr");
    
    if ($returnVar !== 0) {
        deployLog("Command failed with return code: $returnVar");
        return false;
    }
    
    return $outputStr;
}

/**
 * Main deployment process
 */
function deployApplication() {
    deployLog("=== Starting deployment process ===");
    
    // Step 1: Clean up previous deployment
    if (is_dir(TEMP_PATH)) {
        executeCommand("rm -rf " . TEMP_PATH, "Cleaning temp directory");
    }
    
    // Step 2: Clone repository
    $cloneCommand = "git clone --branch " . BRANCH . " --depth 1 " . REPO_URL . " " . TEMP_PATH;
    if (!executeCommand($cloneCommand, "Cloning repository")) {
        throw new Exception("Failed to clone repository");
    }
    
    // Step 3: Check if Node.js is available
    $nodeVersion = executeCommand("node --version", "Checking Node.js version");
    if (!$nodeVersion) {
        deployLog("Warning: Node.js not available, skipping build process");
        $buildStep = false;
    } else {
        $buildStep = true;
        deployLog("Node.js available: $nodeVersion");
    }
    
    // Step 4: Build application (if Node.js available)
    if ($buildStep) {
        $buildCommands = [
            "cd " . TEMP_PATH . " && npm install --production",
            "cd " . TEMP_PATH . " && npm run build"
        ];
        
        foreach ($buildCommands as $cmd) {
            if (!executeCommand($cmd, "Building application")) {
                deployLog("Build failed, deploying source files instead");
                $buildStep = false;
                break;
            }
        }
    }
    
    // Step 5: Backup current deployment
    $backupPath = DEPLOY_PATH . '_backup_' . date('Y-m-d_H-i-s');
    if (is_dir(DEPLOY_PATH)) {
        executeCommand("cp -r " . DEPLOY_PATH . " " . $backupPath, "Creating backup");
        deployLog("Backup created at: $backupPath");
    }
    
    // Step 6: Deploy files
    $sourcePath = $buildStep ? TEMP_PATH . '/dist' : TEMP_PATH;
    
    // Create deployment directory if it doesn't exist
    if (!is_dir(dirname(DEPLOY_PATH))) {
        mkdir(dirname(DEPLOY_PATH), 0755, true);
    }
    
    // Remove old deployment (keep api.cgi and deploy logs)
    if (is_dir(DEPLOY_PATH)) {
        executeCommand("find " . DEPLOY_PATH . " -type f ! -name 'api.cgi' ! -name '*.log' ! -name 'webhook-deploy.php' -delete", "Cleaning deployment directory");
        executeCommand("find " . DEPLOY_PATH . " -type d -empty -delete", "Removing empty directories");
    }
    
    // Copy new files
    if ($buildStep && is_dir($sourcePath)) {
        executeCommand("cp -r " . $sourcePath . "/* " . DEPLOY_PATH . "/", "Deploying built files");
    } else {
        // Deploy source files (excluding node_modules, .git, etc.)
        executeCommand("rsync -av --exclude='node_modules' --exclude='.git' --exclude='backend' --exclude='*.md' " . TEMP_PATH . "/ " . DEPLOY_PATH . "/", "Deploying source files");
    }
    
    // Step 7: Set proper permissions
    executeCommand("find " . DEPLOY_PATH . " -type f -exec chmod 644 {} \\;", "Setting file permissions");
    executeCommand("find " . DEPLOY_PATH . " -type d -exec chmod 755 {} \\;", "Setting directory permissions");
    executeCommand("chmod 755 " . DEPLOY_PATH . "/api.cgi", "Setting CGI permissions");
    executeCommand("chmod 755 " . DEPLOY_PATH . "/webhook-deploy.php", "Setting webhook permissions");
    
    // Step 8: Cleanup
    executeCommand("rm -rf " . TEMP_PATH, "Cleaning up temp files");
    
    deployLog("=== Deployment completed successfully ===");
    
    return [
        'success' => true,
        'message' => 'Deployment completed successfully',
        'timestamp' => date('c'),
        'build_used' => $buildStep,
        'source_path' => $sourcePath,
        'deploy_path' => DEPLOY_PATH
    ];
}

// Main execution
try {
    deployLog("Webhook deployment script started");
    
    // GET request - show status
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        sendResponse([
            'status' => 'active',
            'message' => 'SmartHub Deployment Webhook',
            'version' => '1.0.0',
            'last_deployment' => file_exists(LOG_FILE) ? date('c', filemtime(LOG_FILE)) : 'Never',
            'config' => [
                'repo' => REPO_URL,
                'branch' => BRANCH,
                'deploy_path' => DEPLOY_PATH
            ]
        ]);
    }
    
    // POST request - handle webhook
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendResponse(['error' => 'Only POST requests allowed'], 405);
    }
    
    // Get payload
    $payload = file_get_contents('php://input');
    $signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';
    
    // Verify signature (if secret is configured)
    if (WEBHOOK_SECRET && !verifyGitHubSignature($payload, $signature)) {
        deployLog("Invalid webhook signature");
        sendResponse(['error' => 'Invalid signature'], 403);
    }
    
    // Parse payload
    $data = json_decode($payload, true);
    if (!$data) {
        sendResponse(['error' => 'Invalid JSON payload'], 400);
    }
    
    // Check if it's a push to the target branch
    if (isset($data['ref']) && $data['ref'] !== 'refs/heads/' . BRANCH) {
        sendResponse([
            'message' => 'Ignoring push to branch: ' . str_replace('refs/heads/', '', $data['ref']),
            'target_branch' => BRANCH
        ]);
    }
    
    deployLog("Webhook received from GitHub - " . ($data['head_commit']['message'] ?? 'No commit message'));
    
    // Execute deployment
    $result = deployApplication();
    sendResponse($result);
    
} catch (Exception $e) {
    deployLog("Deployment failed: " . $e->getMessage());
    sendResponse([
        'success' => false,
        'error' => $e->getMessage(),
        'timestamp' => date('c')
    ], 500);
}
?>