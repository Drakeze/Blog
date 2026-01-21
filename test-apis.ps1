# API Testing Script for Blog Project
# Tests all endpoints: Health, Posts CRUD, and Integration endpoints

$baseUrl = "http://localhost:3000"
$results = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [object]$Body = $null,
        [int]$ExpectedStatus = 200
    )
    
    Write-Host "`n=== Testing: $Name ===" -ForegroundColor Cyan
    Write-Host "Method: $Method" -ForegroundColor Gray
    Write-Host "URL: $Url" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            ContentType = "application/json"
            TimeoutSec = 10
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
            Write-Host "Body: $($params.Body)" -ForegroundColor Gray
        }
        
        $response = Invoke-WebRequest @params -UseBasicParsing
        $content = $response.Content | ConvertFrom-Json
        
        $success = $response.StatusCode -eq $ExpectedStatus
        $status = if ($success) { "[PASS]" } else { "[FAIL]" }
        $color = if ($success) { "Green" } else { "Red" }
        
        Write-Host "$status - Status: $($response.StatusCode)" -ForegroundColor $color
        Write-Host "Response: $($response.Content)" -ForegroundColor Gray
        
        $script:results += [PSCustomObject]@{
            Test = $Name
            Status = $status
            StatusCode = $response.StatusCode
            Success = $success
        }
        
        return $content
    }
    catch {
        Write-Host "[FAIL] - Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode.value__
            Write-Host "Status Code: $statusCode" -ForegroundColor Red
        }
        
        $script:results += [PSCustomObject]@{
            Test = $Name
            Status = "[FAIL]"
            StatusCode = $statusCode
            Success = $false
        }
        
        return $null
    }
}

Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║     Blog API Testing Suite            ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Magenta

# Check if server is running
Write-Host "`n[1/4] Checking if server is running..." -ForegroundColor Yellow
try {
    $null = Invoke-WebRequest -Uri $baseUrl -UseBasicParsing -TimeoutSec 2
    Write-Host "[OK] Server is running" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] Server is not running at $baseUrl" -ForegroundColor Red
    Write-Host "Please start the server with: npm run dev" -ForegroundColor Yellow
    exit 1
}

# Test Health Endpoint
Write-Host "`n[2/4] Testing Health Endpoint..." -ForegroundColor Yellow
Test-Endpoint -Name "Health Check" -Method "GET" -Url "$baseUrl/api/health"

# Test Posts Endpoints
Write-Host "`n[3/4] Testing Posts CRUD Endpoints..." -ForegroundColor Yellow

# Create a post
$newPost = @{
    title = "Test Post $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    content = "This is a test post created by the API testing script"
    excerpt = "Testing excerpt"
    tags = @("test", "api")
    readTimeMinutes = 5
    source = "api-test"
    status = "draft"
}
$createdPost = Test-Endpoint -Name "Create Post" -Method "POST" -Url "$baseUrl/api/posts" -Body $newPost -ExpectedStatus 201

if ($createdPost -and $createdPost.id) {
    $postId = $createdPost.id
    Write-Host "Created post with ID: $postId" -ForegroundColor Green
    
    # Get all posts
    Test-Endpoint -Name "Get All Posts" -Method "GET" -Url "$baseUrl/api/posts?status=all"
    
    # Get posts with filters
    Test-Endpoint -Name "Get Posts by Tag" -Method "GET" -Url "$baseUrl/api/posts?tag=test`&status=all"
    
    # Update the post
    $updateData = @{
        title = "Updated Test Post $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        content = "This post has been updated"
        status = "published"
    }
    Test-Endpoint -Name "Update Post" -Method "PUT" -Url "$baseUrl/api/posts/$postId" -Body $updateData
    
    # Delete the post
    Test-Endpoint -Name "Delete Post" -Method "DELETE" -Url "$baseUrl/api/posts/$postId"
}
else {
    Write-Host "[WARN] Skipping post-dependent tests - create failed" -ForegroundColor Yellow
}

# Test Integration Endpoints (these may not exist yet)
Write-Host "`n[4/4] Testing Integration Endpoints..." -ForegroundColor Yellow
Write-Host "Note: These endpoints may not exist yet. Checking availability..." -ForegroundColor Gray

$integrations = @(
    @{
        Name = "LinkedIn Integration"
        Url = "$baseUrl/api/integrations/linkedin"
        Body = @{
            action = "share"
            content = @{
                title = "Test Post"
                description = "Test description"
                url = "https://example.com"
            }
            mockMode = $true
        }
    },
    @{
        Name = "Reddit Integration"
        Url = "$baseUrl/api/integrations/reddit"
        Body = @{
            subreddit = "test"
            title = "Test Post"
            url = "https://example.com"
            mockMode = $true
        }
    },
    @{
        Name = "Patreon Integration"
        Url = "$baseUrl/api/integrations/patreon"
        Body = @{
            action = "create_post"
            content = @{
                title = "Test Post"
                body = "Test content"
                tier = "basic"
            }
            mockMode = $true
        }
    },
    @{
        Name = "Twitter Integration"
        Url = "$baseUrl/api/integrations/twitter"
        Body = @{
            action = "tweet"
            content = @{
                text = "Test tweet"
            }
            mockMode = $true
        }
    }
)

foreach ($integration in $integrations) {
    Test-Endpoint -Name $integration.Name -Method "POST" -Url $integration.Url -Body $integration.Body
}

# Summary
Write-Host "`n`n╔════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║          Test Summary                  ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Magenta

$passed = ($results | Where-Object { $_.Success }).Count
$failed = ($results | Where-Object { -not $_.Success }).Count
$total = $results.Count

Write-Host "`nTotal Tests: $total" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red

Write-Host "`nDetailed Results:" -ForegroundColor White
$results | Format-Table -AutoSize

if ($failed -eq 0) {
    Write-Host "`n[SUCCESS] All tests passed!" -ForegroundColor Green
} else {
    Write-Host "`n[WARNING] Some tests failed. Review the output above." -ForegroundColor Yellow
}
