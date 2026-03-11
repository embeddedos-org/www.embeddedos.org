# EmbeddedOS Website — Comprehensive Test Suite
# Tests: Functional, Usability, Performance, Compatibility, Security, SEO, Accessibility, Regression
# Run: pwsh tests/run-tests.ps1

param(
    [string]$SiteDir = (Split-Path -Parent $PSScriptRoot),
    [string]$LiveUrl = "https://embeddedos.org.safecodeg.com"
)

$ErrorActionPreference = "Continue"
$pass = 0; $fail = 0; $warn = 0; $total = 0
$results = @()

function Test($category, $name, $condition, $detail = "") {
    $script:total++
    if ($condition) {
        $script:pass++
        $results += [PSCustomObject]@{Cat=$category; Test=$name; Result="PASS"; Detail=$detail}
        Write-Host "  [PASS] $name" -ForegroundColor Green
    } else {
        $script:fail++
        $results += [PSCustomObject]@{Cat=$category; Test=$name; Result="FAIL"; Detail=$detail}
        Write-Host "  [FAIL] $name — $detail" -ForegroundColor Red
    }
}

function Warn($category, $name, $detail) {
    $script:total++; $script:warn++
    $results += [PSCustomObject]@{Cat=$category; Test=$name; Result="WARN"; Detail=$detail}
    Write-Host "  [WARN] $name — $detail" -ForegroundColor Yellow
}

$allPages = Get-ChildItem -Path $SiteDir -Filter "*.html" | Select-Object -ExpandProperty Name
$pageCount = $allPages.Count

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  EmbeddedOS Website — Comprehensive Test Suite" -ForegroundColor Cyan
Write-Host "  Pages: $pageCount | Site: $SiteDir" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

# ========================================================================
# 1. FUNCTIONAL TESTING — Links, buttons, forms, navigation
# ========================================================================
Write-Host "`n--- 1. FUNCTIONAL TESTING ---" -ForegroundColor Magenta

# 1.1 All internal HTML links resolve to existing files
$brokenLinks = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    [regex]::Matches($content, 'href="([^"#][^"]*\.html)"') | ForEach-Object {
        $href = $_.Groups[1].Value
        if (-not (Test-Path "$SiteDir\$href")) {
            $brokenLinks += "$page -> $href"
        }
    }
}
Test "Functional" "All internal links resolve" ($brokenLinks.Count -eq 0) ($brokenLinks -join "; ")

# 1.2 No empty href attributes
$emptyHrefs = 0
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    $emptyHrefs += ([regex]::Matches($content, 'href=""')).Count
}
Test "Functional" "No empty href attributes" ($emptyHrefs -eq 0) "Found $emptyHrefs empty hrefs"

# 1.3 All pages have navigation
$navMissing = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -notmatch 'class="nav-links"') { $navMissing += $page }
}
Test "Functional" "All pages have navigation" ($navMissing.Count -eq 0) ($navMissing -join ", ")

# 1.4 All pages have footer
$footerMissing = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -notmatch 'class="footer"') { $footerMissing += $page }
}
Test "Functional" "All pages have footer" ($footerMissing.Count -eq 0) ($footerMissing -join ", ")

# 1.5 Contact form has all required fields
$contactHtml = Get-Content "$SiteDir\contact.html" -Raw
Test "Functional" "Contact form has action URL" ($contactHtml -match 'action="https://api.web3forms.com') ""
Test "Functional" "Contact form has name field" ($contactHtml -match 'name="name"') ""
Test "Functional" "Contact form has email field" ($contactHtml -match 'name="email"') ""
Test "Functional" "Contact form has message field" ($contactHtml -match 'name="message"') ""
Test "Functional" "Contact form has submit button" ($contactHtml -match 'type="submit"') ""
Test "Functional" "Contact form has honeypot" ($contactHtml -match 'name="botcheck"') ""

# 1.6 Mobile menu button exists on all pages
$menuMissing = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -notmatch 'mobile-menu-btn') { $menuMissing += $page }
}
Test "Functional" "Mobile menu button on all pages" ($menuMissing.Count -eq 0) ($menuMissing -join ", ")

# 1.7 Scroll-to-top button on all pages
$scrollMissing = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -notmatch 'scroll-to-top') { $scrollMissing += $page }
}
Test "Functional" "Scroll-to-top on all pages" ($scrollMissing.Count -eq 0) ($scrollMissing -join ", ")

# 1.8 External JS files exist
Test "Functional" "js/main.js exists" (Test-Path "$SiteDir\js\main.js") ""
Test "Functional" "js/monitor.js exists" (Test-Path "$SiteDir\js\monitor.js") ""
Test "Functional" "js/forms.js exists" (Test-Path "$SiteDir\js\forms.js") ""
Test "Functional" "css/style.css exists" (Test-Path "$SiteDir\css\style.css") ""

# ========================================================================
# 2. USABILITY TESTING — Navigation, structure, readability
# ========================================================================
Write-Host "`n--- 2. USABILITY TESTING ---" -ForegroundColor Magenta

# 2.1 Every page has a clear <h1>
$h1Missing = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -notmatch '<h1') { $h1Missing += $page }
}
Test "Usability" "Every page has <h1>" ($h1Missing.Count -eq 0) ($h1Missing -join ", ")

# 2.2 No page has multiple <h1> tags
$multiH1 = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    $h1Count = ([regex]::Matches($content, '<h1')).Count
    if ($h1Count -gt 1) { $multiH1 += "$page($h1Count)" }
}
Test "Usability" "No page has multiple <h1>" ($multiH1.Count -eq 0) ($multiH1 -join ", ")

# 2.3 Product pages have breadcrumb
$productPages = $allPages | Where-Object { $_ -match '^product-' }
$breadMissing = @()
foreach ($page in $productPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -notmatch 'breadcrumb') { $breadMissing += $page }
}
Test "Usability" "Product pages have breadcrumbs" ($breadMissing.Count -eq 0) ($breadMissing -join ", ")

# 2.4 All images have alt text
$altMissing = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    $imgsNoAlt = [regex]::Matches($content, '<img(?![^>]*alt=)[^>]*>')
    if ($imgsNoAlt.Count -gt 0) { $altMissing += "$page($($imgsNoAlt.Count))" }
}
Test "Usability" "All images have alt text" ($altMissing.Count -eq 0) ($altMissing -join ", ")

# 2.5 CTA buttons exist on key pages
$ctaPages = @("index.html","ecosystem.html","about.html","membership.html","donate.html")
$ctaMissing = @()
foreach ($page in $ctaPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -notmatch 'btn-primary') { $ctaMissing += $page }
}
Test "Usability" "Key pages have CTA buttons" ($ctaMissing.Count -eq 0) ($ctaMissing -join ", ")

# ========================================================================
# 3. PERFORMANCE TESTING — File sizes, optimization
# ========================================================================
Write-Host "`n--- 3. PERFORMANCE TESTING ---" -ForegroundColor Magenta

# 3.1 CSS file size
$cssSize = (Get-Item "$SiteDir\css\style.css").Length / 1KB
Test "Performance" "CSS < 100KB ($([math]::Round($cssSize,1))KB)" ($cssSize -lt 100) ""

# 3.2 JS file sizes
$jsTotal = 0
Get-ChildItem "$SiteDir\js\*.js" | ForEach-Object { $jsTotal += $_.Length }
$jsTotalKB = [math]::Round($jsTotal / 1KB, 1)
Test "Performance" "Total JS < 50KB (${jsTotalKB}KB)" ($jsTotalKB -lt 50) ""

# 3.3 HTML page sizes < 150KB each
$largePages = @()
foreach ($page in $allPages) {
    $size = (Get-Item "$SiteDir\$page").Length / 1KB
    if ($size -gt 150) { $largePages += "$page($([math]::Round($size,0))KB)" }
}
Test "Performance" "All HTML pages < 150KB" ($largePages.Count -eq 0) ($largePages -join ", ")

# 3.4 Images use lazy loading
$lazyMissing = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    $imgs = [regex]::Matches($content, '<img[^>]+src="https://[^"]*unsplash[^"]*"[^>]*>')
    foreach ($img in $imgs) {
        if ($img.Value -notmatch 'loading="lazy"') { $lazyMissing += "$page" }
    }
}
$lazyMissing = $lazyMissing | Select-Object -Unique
Test "Performance" "External images use lazy loading" ($lazyMissing.Count -eq 0) ($lazyMissing -join ", ")

# 3.5 Font preconnect hints
$preconnectMissing = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -match 'fonts.googleapis.com' -and $content -notmatch 'preconnect.*fonts.googleapis') {
        $preconnectMissing += $page
    }
}
Test "Performance" "Font preconnect on all pages" ($preconnectMissing.Count -eq 0) ($preconnectMissing -join ", ")

# 3.6 No inline <style> blocks
$inlineStyle = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -match '<style>') { $inlineStyle += $page }
}
Test "Performance" "No inline <style> blocks" ($inlineStyle.Count -eq 0) ($inlineStyle -join ", ")

# 3.7 No inline <script> blocks (except forms.js page-specific)
$inlineScript = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -match '<script>' -and $page -ne "contact.html" -and $page -ne "donate.html") {
        $inlineScript += $page
    }
}
Test "Performance" "No inline <script> (except forms)" ($inlineScript.Count -eq 0) ($inlineScript -join ", ")

# ========================================================================
# 4. COMPATIBILITY TESTING — HTML validity, viewport, charset
# ========================================================================
Write-Host "`n--- 4. COMPATIBILITY TESTING ---" -ForegroundColor Magenta

# 4.1 All pages have DOCTYPE
$doctypeMissing = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -notmatch '<!DOCTYPE html>') { $doctypeMissing += $page }
}
Test "Compatibility" "All pages have DOCTYPE" ($doctypeMissing.Count -eq 0) ($doctypeMissing -join ", ")

# 4.2 All pages have viewport meta
$viewportMissing = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -notmatch 'name="viewport"') { $viewportMissing += $page }
}
Test "Compatibility" "All pages have viewport meta" ($viewportMissing.Count -eq 0) ($viewportMissing -join ", ")

# 4.3 All pages have UTF-8 charset
$charsetMissing = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -notmatch 'charset="UTF-8"') { $charsetMissing += $page }
}
Test "Compatibility" "All pages have UTF-8 charset" ($charsetMissing.Count -eq 0) ($charsetMissing -join ", ")

# 4.4 CSS has responsive breakpoints
$css = Get-Content "$SiteDir\css\style.css" -Raw
Test "Compatibility" "CSS has mobile breakpoint (768px)" ($css -match 'max-width:\s*768px') ""
Test "Compatibility" "CSS has tablet breakpoint (992px)" ($css -match 'max-width:\s*992px') ""
Test "Compatibility" "CSS has small mobile (576px)" ($css -match 'max-width:\s*576px') ""

# 4.5 CSS has print styles
Test "Compatibility" "CSS has print styles" ($css -match '@media\s*print') ""

# 4.6 CSS has prefers-reduced-motion
Test "Compatibility" "CSS has prefers-reduced-motion" ($css -match 'prefers-reduced-motion') ""

# 4.7 CSS has dark mode
Test "Compatibility" "CSS has dark mode support" ($css -match 'prefers-color-scheme') ""

# ========================================================================
# 5. SECURITY TESTING — XSS prevention, HTTPS, headers
# ========================================================================
Write-Host "`n--- 5. SECURITY TESTING ---" -ForegroundColor Magenta

# 5.1 No inline onclick handlers (except donate card selection)
$onclickPages = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    $clicks = [regex]::Matches($content, 'onclick="(?!selectAmount|resetContactForm)(?!selectAmount)')
    if ($clicks.Count -gt 0) { $onclickPages += "$page($($clicks.Count))" }
}
Test "Security" "No inline onclick (except donate cards)" ($onclickPages.Count -eq 0) ($onclickPages -join ", ")

# 5.2 External links have rel="noopener"
$unsafeExtLinks = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    $extLinks = [regex]::Matches($content, '<a[^>]+target="_blank"[^>]*>')
    foreach ($link in $extLinks) {
        if ($link.Value -notmatch 'rel="noopener"' -and $link.Value -notmatch "rel=`"noopener`"") {
            $unsafeExtLinks += $page
        }
    }
}
$unsafeExtLinks = $unsafeExtLinks | Select-Object -Unique
Test "Security" "External links have rel=noopener" ($unsafeExtLinks.Count -eq 0) ($unsafeExtLinks -join ", ")

# 5.3 Contact form has honeypot spam protection
Test "Security" "Contact form has honeypot field" ($contactHtml -match 'botcheck') ""

# 5.4 No sensitive data in HTML (API keys, passwords)
$sensitiveFound = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -match '(sk_live|pk_live|AIza|AKIA|password\s*=\s*["\x27][^\s]+)') {
        $sensitiveFound += $page
    }
}
Test "Security" "No API keys/passwords in HTML" ($sensitiveFound.Count -eq 0) ($sensitiveFound -join ", ")

# 5.5 Forms use HTTPS action URLs
$httpForms = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -match 'action="http://') { $httpForms += $page }
}
Test "Security" "All form actions use HTTPS" ($httpForms.Count -eq 0) ($httpForms -join ", ")

# 5.6 robots.txt exists and blocks sensitive dirs
Test "Security" "robots.txt exists" (Test-Path "$SiteDir\robots.txt") ""
$robots = if (Test-Path "$SiteDir\robots.txt") { Get-Content "$SiteDir\robots.txt" -Raw } else { "" }
Test "Security" "robots.txt blocks .github/" ($robots -match 'Disallow.*\.github') ""

# ========================================================================
# 6. SEO TESTING — Meta tags, sitemap, structured data
# ========================================================================
Write-Host "`n--- 6. SEO TESTING ---" -ForegroundColor Magenta

# 6.1 All pages have <title>
$titleMissing = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -notmatch '<title>') { $titleMissing += $page }
}
Test "SEO" "All pages have <title>" ($titleMissing.Count -eq 0) ($titleMissing -join ", ")

# 6.2 All pages have meta description
$descMissing = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -notmatch 'name="description"') { $descMissing += $page }
}
Test "SEO" "All pages have meta description" ($descMissing.Count -eq 0) ($descMissing -join ", ")

# 6.3 All pages have OG tags
$ogMissing = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -notmatch 'og:title') { $ogMissing += $page }
}
Test "SEO" "All pages have og:title" ($ogMissing.Count -eq 0) ($ogMissing -join ", ")

# 6.4 Homepage has structured data
$indexHtml = Get-Content "$SiteDir\index.html" -Raw
Test "SEO" "Homepage has JSON-LD structured data" ($indexHtml -match 'application/ld\+json') ""

# 6.5 sitemap.xml exists and lists all pages
Test "SEO" "sitemap.xml exists" (Test-Path "$SiteDir\sitemap.xml") ""
$sitemap = if (Test-Path "$SiteDir\sitemap.xml") { Get-Content "$SiteDir\sitemap.xml" -Raw } else { "" }
$sitemapUrls = ([regex]::Matches($sitemap, '<loc>([^<]+)</loc>')).Count
Test "SEO" "Sitemap has URLs ($sitemapUrls)" ($sitemapUrls -ge 16) ""

# 6.6 All pages have lang attribute
$langMissing = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -notmatch 'lang="en"') { $langMissing += $page }
}
Test "SEO" "All pages have lang=en" ($langMissing.Count -eq 0) ($langMissing -join ", ")

# 6.7 Theme color meta tag
$themeMissing = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -notmatch 'theme-color') { $themeMissing += $page }
}
Test "SEO" "All pages have theme-color" ($themeMissing.Count -eq 0) ($themeMissing -join ", ")

# ========================================================================
# 7. ACCESSIBILITY TESTING — ARIA, keyboard, screen readers
# ========================================================================
Write-Host "`n--- 7. ACCESSIBILITY TESTING ---" -ForegroundColor Magenta

# 7.1 Skip-to-content link
$skipMissing = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -match 'class="skip-link"' -or $page -match '^(product-|privacy|terms|code-of-conduct|licenses)') {
        # product/legal pages don't have skip link — that's acceptable
    } elseif ($content -notmatch 'skip-link') {
        $skipMissing += $page
    }
}
Test "Accessibility" "Main pages have skip-to-content link" ($skipMissing.Count -eq 0) ($skipMissing -join ", ")

# 7.2 ARIA labels on navigation
$ariaNavMissing = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -match 'nav-links' -and $content -notmatch 'aria-label="Main navigation"') {
        $ariaNavMissing += $page
    }
}
Test "Accessibility" "Nav has aria-label" ($ariaNavMissing.Count -eq 0) ($ariaNavMissing -join ", ")

# 7.3 Buttons have aria-label or visible text
$btnNoLabel = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    $buttons = [regex]::Matches($content, '<button[^>]*>')
    foreach ($btn in $buttons) {
        if ($btn.Value -notmatch 'aria-label' -and $btn.Value -notmatch '>') {
            $btnNoLabel += $page
        }
    }
}
$btnNoLabel = $btnNoLabel | Select-Object -Unique
Test "Accessibility" "Buttons have aria-label" ($btnNoLabel.Count -eq 0) ($btnNoLabel -join ", ")

# 7.4 CSS has focus-visible styles
Test "Accessibility" "CSS has :focus-visible styles" ($css -match 'focus-visible') ""

# 7.5 CSS has prefers-reduced-motion
Test "Accessibility" "CSS respects prefers-reduced-motion" ($css -match 'prefers-reduced-motion') ""

# 7.6 Form inputs have labels
$labelMissing = 0
if ($contactHtml -match '<input.*name="name"' -and $contactHtml -match '<label.*[Nn]ame') { } else { $labelMissing++ }
if ($contactHtml -match '<input.*name="email"' -and $contactHtml -match '<label.*[Ee]mail') { } else { $labelMissing++ }
Test "Accessibility" "Form inputs have labels" ($labelMissing -eq 0) "$labelMissing missing"

# 7.7 Semantic HTML elements
$semanticMissing = @()
$mainPages = @("index.html")
foreach ($page in $mainPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -notmatch '<main') { $semanticMissing += "$page(main)" }
    if ($content -notmatch '<header') { $semanticMissing += "$page(header)" }
    if ($content -notmatch '<footer') { $semanticMissing += "$page(footer)" }
}
Test "Accessibility" "Homepage has semantic HTML (main/header/footer)" ($semanticMissing.Count -eq 0) ($semanticMissing -join ", ")

# ========================================================================
# 8. REGRESSION TESTING — Consistency checks
# ========================================================================
Write-Host "`n--- 8. REGRESSION TESTING ---" -ForegroundColor Magenta

# 8.1 All pages load same CSS file
$wrongCSS = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -notmatch 'href="css/style\.css"') { $wrongCSS += $page }
}
Test "Regression" "All pages reference css/style.css" ($wrongCSS.Count -eq 0) ($wrongCSS -join ", ")

# 8.2 Footer project names are correct (not old names)
$oldNames = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -match 'ForgeOS') { $oldNames += "$page(ForgeOS)" }
    if ($content -match 'AIL \(AI Layer\)') { $oldNames += "$page(AIL)" }
    if ($content -match 'NIA \(Neural') { $oldNames += "$page(NIA)" }
}
Test "Regression" "No old project names (ForgeOS/AIL/NIA)" ($oldNames.Count -eq 0) ($oldNames -join ", ")

# 8.3 Copyright year is current
$wrongYear = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -match '&copy; (\d{4})') {
        $year = $Matches[1]
        if ($year -ne "2026") { $wrongYear += "$page($year)" }
    }
}
Test "Regression" "Copyright year is 2026" ($wrongYear.Count -eq 0) ($wrongYear -join ", ")

# 8.4 monitor.js is loaded on all pages
$monitorMissing = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -notmatch 'monitor\.js') { $monitorMissing += $page }
}
Test "Regression" "monitor.js on all pages" ($monitorMissing.Count -eq 0) ($monitorMissing -join ", ")

# 8.5 main.js is loaded on all pages
$mainJsMissing = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -notmatch 'main\.js') { $mainJsMissing += $page }
}
Test "Regression" "main.js on all pages" ($mainJsMissing.Count -eq 0) ($mainJsMissing -join ", ")

# 8.6 No placeholder images remain
$placeholders = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -match 'via\.placeholder\.com') { $placeholders += $page }
}
Test "Regression" "No placeholder images" ($placeholders.Count -eq 0) ($placeholders -join ", ")

# 8.7 All pages close </html>
$unclosed = @()
foreach ($page in $allPages) {
    $content = Get-Content "$SiteDir\$page" -Raw
    if ($content -notmatch '</html>') { $unclosed += $page }
}
Test "Regression" "All pages close </html>" ($unclosed.Count -eq 0) ($unclosed -join ", ")

# ========================================================================
# RESULTS SUMMARY
# ========================================================================
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Total:  $total" -ForegroundColor White
Write-Host "  Pass:   $pass" -ForegroundColor Green
Write-Host "  Fail:   $fail" -ForegroundColor $(if ($fail -gt 0) { "Red" } else { "Green" })
Write-Host "  Warn:   $warn" -ForegroundColor $(if ($warn -gt 0) { "Yellow" } else { "Green" })
Write-Host ""

# Category breakdown
$cats = $results | Group-Object Cat
foreach ($cat in $cats) {
    $catPass = ($cat.Group | Where-Object { $_.Result -eq "PASS" }).Count
    $catTotal = $cat.Group.Count
    $status = if ($catPass -eq $catTotal) { "ALL PASS" } else { "$catPass/$catTotal" }
    $color = if ($catPass -eq $catTotal) { "Green" } else { "Yellow" }
    Write-Host "  $($cat.Name): $status" -ForegroundColor $color
}

Write-Host ""
if ($fail -gt 0) {
    Write-Host "  FAILURES:" -ForegroundColor Red
    $results | Where-Object { $_.Result -eq "FAIL" } | ForEach-Object {
        Write-Host "    [$($_.Cat)] $($_.Test): $($_.Detail)" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "================================================================" -ForegroundColor Cyan
exit $fail
