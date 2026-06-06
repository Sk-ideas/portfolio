<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

// ══════════════════════════════════════════════════════════════════
//  ADD YOUR GROQ API KEY BELOW  (100% FREE — no credit card)
//  1. Go to: https://console.groq.com/keys
//  2. Sign up with Google / GitHub
//  3. Click "Create API Key" and paste it below
// ══════════════════════════════════════════════════════════════════
define('GROQ_API_KEY', 'YOUR_GROQ_API_KEY_HERE');
// ══════════════════════════════════════════════════════════════════

if (GROQ_API_KEY === 'YOUR_GROQ_API_KEY_HERE') {
    echo json_encode(['response' => "The AI assistant isn't configured yet. Open chat-api.php and add your free Groq API key from console.groq.com/keys"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || empty(trim($input['message'] ?? ''))) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request']);
    exit;
}

$userMessage = trim($input['message']);
$history     = array_slice($input['history'] ?? [], -10);

$systemPrompt = <<<'SYSTEM'
You are an AI assistant embedded in Sasi Kumar S's personal portfolio website. Answer questions about Sasi in a friendly, concise, and professional tone. Keep responses under 120 words unless more detail is explicitly requested. Use short paragraphs or simple bullet points for clarity.

ABOUT SASI KUMAR S:

Personal:
- Full Name: Sasi Kumar S
- Birthday: 15 May 2000  |  Age: 26
- Location: Nagercoil, Tamil Nadu, India
- Email: sasikumar150500@gmail.com
- Phone / WhatsApp: +91 6383201475

Professional Summary:
Backend-focused Laravel engineer with 3+ years of experience building secure, workflow-driven enterprise applications. Specialises in RBAC, encrypted document lifecycle management, RESTful APIs, cron-based automation, and MySQL optimisation. Strong ownership mindset — handles the full cycle from requirement analysis to production support.

Current Role:
- Backend Laravel Engineer at ISKCON Bangalore (December 2025 - Present)
  Governance and resolution workflow systems with encrypted doc lifecycle and RBAC.
  Automated tracking, recurring reminders, cron-based workflow processing.

Previous Experience:
- Full-Stack Developer at Ziga Infotech Ventures Pvt Ltd (April 2023 - June 2025)
  Enterprise CRM, LMS, Inventory apps using Laravel and CodeIgniter.
  REST APIs, Excel bulk-upload pipelines, dynamic PDF generation.
  Production deployment, WHM/cPanel hosting, MySQL query optimisation.
- Freelance Developer at Women's Christian College (August 2025 - November 2025)
  Academic management system: admissions, student records, fee tracking, dashboards.

Skills:
- Backend: PHP, Laravel, CodeIgniter, RESTful APIs, SOAP, MySQL, Query Optimisation
- Security and Architecture: RBAC, Encrypted Content, Document Lifecycle, Workflow Automation
- DevOps: Cron Jobs, Scheduled Workflows, WHM, cPanel, Plesk, Shared Hosting
- Frontend: JavaScript, jQuery, AJAX, HTML5, CSS3, Bootstrap, Vite
- Tools: Git, GitHub, Third-Party API Integration, Payment Gateway Integration
- Domains: Governance, CRM, LMS, Inventory Management, Academic Systems

Key Projects:
1. Governing Body Commission - Governance workflow, encrypted docs, RBAC, cron reminders
2. Asset Management System - Asset tracking, maintenance scheduling, audit automation
3. LMS and Admission Management (Spark Learning) - Admission lifecycle, fees, payments, timetables
4. CRM and Hierarchical Authority - Ward/district governance, controlled authority access
5. Inventory and Migration Systems - CodeIgniter inventory lifecycle
6. PS Granites - REST APIs, Excel upload, PDF generation with 10+ images per record

Education:
- B.E. Computer Science and Engineering - Ponjesly College of Engineering, Nagercoil (2018-2022, CGPA: 7.77/10)
- Full Stack PHP Training - SCOPE INDIA (2022, 4 months)
- Android Inplant Training - UniqTechnology, Chennai (2019)

Social / Links:
- LinkedIn: https://www.linkedin.com/in/sasi-kumar-43b259228
- Portfolio: https://sk-ideas.github.io/portfolio/
- Instagram: https://www.instagram.com/mr.soul_knight/

If asked something not covered above, say you don't have that specific detail and suggest contacting Sasi directly. Never fabricate information.
SYSTEM;

// Build messages array (OpenAI-compatible format — same as Groq)
$messages = [['role' => 'system', 'content' => $systemPrompt]];
foreach ($history as $h) {
    $role    = $h['role']    ?? '';
    $content = $h['content'] ?? '';
    if (in_array($role, ['user', 'assistant'], true) && !empty($content)) {
        $messages[] = ['role' => $role, 'content' => (string)$content];
    }
}
$messages[] = ['role' => 'user', 'content' => $userMessage];

$payload = json_encode([
    'model'      => 'llama-3.3-70b-versatile',
    'messages'   => $messages,
    'max_tokens' => 400,
    'temperature'=> 0.7,
]);

$ch = curl_init('https://api.groq.com/openai/v1/chat/completions');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . GROQ_API_KEY,
    ],
    CURLOPT_TIMEOUT        => 25,
    CURLOPT_SSL_VERIFYPEER => true,
]);

$response  = curl_exec($ch);
$httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
unset($ch);

if ($curlError || $response === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not reach the AI service. Please try again.']);
    exit;
}

$data = json_decode($response, true);
$text = $data['choices'][0]['message']['content'] ?? null;

if ($httpCode !== 200 || !$text) {
    http_response_code(500);
    $errMsg = $data['error']['message'] ?? 'AI service error. Please try again.';
    echo json_encode(['error' => $errMsg]);
    exit;
}

echo json_encode(['response' => $text]);
