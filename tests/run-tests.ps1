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
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    [regex]::Matches($content, 'href="((?!https?://|mailto:|tel:|data:|javascript:|#)[^"#?]+)"') | ForEach-Object {
        $href = $_.Groups[1].Value
        if ($href -eq "/" -or $href -eq "" -or $href -eq "404.html") { return }
        # Strip any leading slash for filesystem lookup
        $rel = $href -replace '^/',''
        # Clean-URL: try $rel.html
        if ($rel -match '\.html$') {
            if (-not (Test-Path "$SiteDir\$rel")) { $brokenLinks += "$page -> $href" }
        } else {
            if (-not (Test-Path "$SiteDir\$rel.html") -and -not (Test-Path "$SiteDir\$rel")) {
                $brokenLinks += "$page -> $href"
            }
        }
    }
}
Test "Functional" "All internal links resolve" ($brokenLinks.Count -eq 0) ($brokenLinks -join "; ")

# 1.2 No empty href attributes
$emptyHrefs = 0
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    $emptyHrefs += ([regex]::Matches($content, 'href=""')).Count
}
Test "Functional" "No empty href attributes" ($emptyHrefs -eq 0) "Found $emptyHrefs empty hrefs"

# 1.3 All pages have navigation
$navMissing = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -notmatch 'class="nav-links"') { $navMissing += $page }
}
Test "Functional" "All pages have navigation" ($navMissing.Count -eq 0) ($navMissing -join ", ")

# 1.4 All pages have footer
$footerMissing = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
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
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -notmatch 'mobile-menu-btn') { $menuMissing += $page }
}
Test "Functional" "Mobile menu button on all pages" ($menuMissing.Count -eq 0) ($menuMissing -join ", ")

# 1.7 Scroll-to-top button on all pages
$scrollMissing = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
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
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -notmatch '<h1') { $h1Missing += $page }
}
Test "Usability" "Every page has <h1>" ($h1Missing.Count -eq 0) ($h1Missing -join ", ")

# 2.2 No page has multiple <h1> tags
$multiH1 = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    $h1Count = ([regex]::Matches($content, '<h1')).Count
    if ($h1Count -gt 1) { $multiH1 += "$page($h1Count)" }
}
Test "Usability" "No page has multiple <h1>" ($multiH1.Count -eq 0) ($multiH1 -join ", ")

# 2.3 Product pages have breadcrumb
$productPages = $allPages | Where-Object { $_ -match '^product-' }
$breadMissing = @()
foreach ($page in $productPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -notmatch 'breadcrumb') { $breadMissing += $page }
}
Test "Usability" "Product pages have breadcrumbs" ($breadMissing.Count -eq 0) ($breadMissing -join ", ")

# 2.4 All images have alt text
$altMissing = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    $imgsNoAlt = [regex]::Matches($content, '<img(?![^>]*alt=)[^>]*>')
    if ($imgsNoAlt.Count -gt 0) { $altMissing += "$page($($imgsNoAlt.Count))" }
}
Test "Usability" "All images have alt text" ($altMissing.Count -eq 0) ($altMissing -join ", ")

# 2.5 CTA buttons exist on key pages
$ctaPages = @("index.html","ecosystem.html","about.html","membership.html","donate.html")
$ctaMissing = @()
foreach ($page in $ctaPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -notmatch 'btn-primary') { $ctaMissing += $page }
}
Test "Usability" "Key pages have CTA buttons" ($ctaMissing.Count -eq 0) ($ctaMissing -join ", ")

# ========================================================================
# 3. PERFORMANCE TESTING — File sizes, optimization
# ========================================================================
Write-Host "`n--- 3. PERFORMANCE TESTING ---" -ForegroundColor Magenta

# 3.1 CSS file size
$cssSize = (Get-Item "$SiteDir\css\style.css").Length / 1KB
Test "Performance" "CSS < 110KB ($([math]::Round($cssSize,1))KB)" ($cssSize -lt 110) ""

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
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
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
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -match 'fonts.googleapis.com' -and $content -notmatch 'preconnect.*fonts.googleapis') {
        $preconnectMissing += $page
    }
}
Test "Performance" "Font preconnect on all pages" ($preconnectMissing.Count -eq 0) ($preconnectMissing -join ", ")

# 3.6 No inline <style> blocks
$inlineStyle = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -match '<style>') { $inlineStyle += $page }
}
Test "Performance" "No inline <style> blocks" ($inlineStyle.Count -eq 0) ($inlineStyle -join ", ")

# 3.7 No inline <script> blocks (except forms.js page-specific)
$inlineScript = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
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
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -notmatch '<!DOCTYPE html>') { $doctypeMissing += $page }
}
Test "Compatibility" "All pages have DOCTYPE" ($doctypeMissing.Count -eq 0) ($doctypeMissing -join ", ")

# 4.2 All pages have viewport meta
$viewportMissing = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -notmatch 'name="viewport"') { $viewportMissing += $page }
}
Test "Compatibility" "All pages have viewport meta" ($viewportMissing.Count -eq 0) ($viewportMissing -join ", ")

# 4.3 All pages have UTF-8 charset
$charsetMissing = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
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
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    $clicks = [regex]::Matches($content, 'onclick="(?!selectAmount|resetContactForm)(?!selectAmount)')
    if ($clicks.Count -gt 0) { $onclickPages += "$page($($clicks.Count))" }
}
Test "Security" "No inline onclick (except donate cards)" ($onclickPages.Count -eq 0) ($onclickPages -join ", ")

# 5.2 External links have rel="noopener"
$unsafeExtLinks = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
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
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -match '(sk_live|pk_live|AIza|AKIA|password\s*=\s*["\x27][^\s]+)') {
        $sensitiveFound += $page
    }
}
Test "Security" "No API keys/passwords in HTML" ($sensitiveFound.Count -eq 0) ($sensitiveFound -join ", ")

# 5.5 Forms use HTTPS action URLs
$httpForms = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
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
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -notmatch '<title>') { $titleMissing += $page }
}
Test "SEO" "All pages have <title>" ($titleMissing.Count -eq 0) ($titleMissing -join ", ")

# 6.2 All pages have meta description
$descMissing = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -notmatch 'name="description"') { $descMissing += $page }
}
Test "SEO" "All pages have meta description" ($descMissing.Count -eq 0) ($descMissing -join ", ")

# 6.3 All pages have OG tags
$ogMissing = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
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
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -notmatch 'lang="en"') { $langMissing += $page }
}
Test "SEO" "All pages have lang=en" ($langMissing.Count -eq 0) ($langMissing -join ", ")

# 6.7 Theme color meta tag
$themeMissing = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
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
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
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
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -match 'nav-links' -and $content -notmatch 'aria-label="Main navigation"') {
        $ariaNavMissing += $page
    }
}
Test "Accessibility" "Nav has aria-label" ($ariaNavMissing.Count -eq 0) ($ariaNavMissing -join ", ")

# 7.3 Buttons have aria-label or visible text
$btnNoLabel = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
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
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
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
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -notmatch 'href="css/style\.css"') { $wrongCSS += $page }
}
Test "Regression" "All pages reference css/style.css" ($wrongCSS.Count -eq 0) ($wrongCSS -join ", ")

# 8.2 Footer project names are correct (not old names)
$oldNames = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -match 'ForgeOS') { $oldNames += "$page(ForgeOS)" }
    if ($content -match 'AIL \(AI Layer\)') { $oldNames += "$page(AIL)" }
    if ($content -match 'NIA \(Neural') { $oldNames += "$page(NIA)" }
}
Test "Regression" "No old project names (ForgeOS/AIL/NIA)" ($oldNames.Count -eq 0) ($oldNames -join ", ")

# 8.3 Copyright year is current
$wrongYear = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -match '&copy; (\d{4})') {
        $year = $Matches[1]
        if ($year -ne "2026") { $wrongYear += "$page($year)" }
    }
}
Test "Regression" "Copyright year is 2026" ($wrongYear.Count -eq 0) ($wrongYear -join ", ")

# 8.4 monitor.js is loaded on all pages
$monitorMissing = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -notmatch 'monitor\.js') { $monitorMissing += $page }
}
Test "Regression" "monitor.js on all pages" ($monitorMissing.Count -eq 0) ($monitorMissing -join ", ")

# 8.5 main.js is loaded on all pages
$mainJsMissing = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -notmatch 'main\.js') { $mainJsMissing += $page }
}
Test "Regression" "main.js on all pages" ($mainJsMissing.Count -eq 0) ($mainJsMissing -join ", ")

# 8.6 No placeholder images remain
$placeholders = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -match 'via\.placeholder\.com') { $placeholders += $page }
}
Test "Regression" "No placeholder images" ($placeholders.Count -eq 0) ($placeholders -join ", ")

# 8.7 All pages close </html>
$unclosed = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -notmatch '</html>') { $unclosed += $page }
}
Test "Regression" "All pages close </html>" ($unclosed.Count -eq 0) ($unclosed -join ", ")


# ========================================================================
# 9. EXTENDED SEO / SOCIAL — canonical, og:image, twitter cards, partials
# ========================================================================
Write-Host "`n--- 9. EXTENDED SEO / SOCIAL ---" -ForegroundColor Magenta

# 9.1 Every page has a canonical link to https://www.embeddedos.org/...
$canonMissing = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -notmatch '<link\s+rel="canonical"\s+href="https://www\.embeddedos\.org') {
        $canonMissing += $page
    }
}
Test "SEO" "All pages have www-canonical" ($canonMissing.Count -eq 0) ($canonMissing -join ", ")

# 9.2 Every page has og:image
$ogImgMissing = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -notmatch 'property="og:image"') { $ogImgMissing += $page }
}
Test "SEO" "All pages have og:image" ($ogImgMissing.Count -eq 0) ($ogImgMissing -join ", ")

# 9.3 Every page has twitter:card
$twCardMissing = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -notmatch 'name="twitter:card"') { $twCardMissing += $page }
}
Test "SEO" "All pages have twitter:card" ($twCardMissing.Count -eq 0) ($twCardMissing -join ", ")

# 9.4 Every page has a unique meta description
$descs = @{}
$descDupes = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    $m = [regex]::Match($content, 'name="description"\s+content="([^"]+)"')
    if ($m.Success) {
        $d = $m.Groups[1].Value
        if ($descs.ContainsKey($d)) { $descDupes += "$page (matches $($descs[$d]))" } else { $descs[$d] = $page }
    }
}
Test "SEO" "All meta descriptions are unique" ($descDupes.Count -eq 0) ($descDupes -join "; ")

# 9.5 Every product page links to its GitHub repo
$repoMissing = @()
foreach ($page in $allPages) {
    if ($page -notmatch '^product-') { continue }
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -notmatch 'github\.com/embeddedos-org/') { $repoMissing += $page }
}
Test "SEO" "Product pages link to GitHub" ($repoMissing.Count -eq 0) ($repoMissing -join ", ")

# 9.6 Sitemap.xml is well-formed XML and contains expected URLs
$smOk = $false
$smContainsAll = $false
try {
    [xml]$smXml = Get-Content "$SiteDir\sitemap.xml" -Raw
    $smOk = $true
    $smLocs = $smXml.urlset.url.loc
    $smContainsAll = ($smLocs -contains "https://www.embeddedos.org/product-eos-platform") -and `
                     ($smLocs -contains "https://www.embeddedos.org/privacy")
} catch { $smOk = $false }
Test "SEO" "Sitemap is well-formed XML" $smOk ""
Test "SEO" "Sitemap contains eos-platform + legal pages" $smContainsAll ""

# 9.7 robots.txt and sitemap point at www-canonical
$robotsTxt = Get-Content "$SiteDir\robots.txt" -Raw
Test "SEO" "robots.txt uses www-canonical sitemap" ($robotsTxt -match 'https://www\.embeddedos\.org/sitemap\.xml') ""

# 9.8 Logo and OG cover image assets exist
Test "SEO" "img/logo.svg exists" (Test-Path "$SiteDir\img\logo.svg") ""
Test "SEO" "img/og-cover.svg exists" (Test-Path "$SiteDir\img\og-cover.svg") ""

# 9.9 Partials directory exists with nav + footer source-of-truth
Test "SEO" "partials/nav.html exists" (Test-Path "$SiteDir\partials\nav.html") ""
Test "SEO" "partials/footer.html exists" (Test-Path "$SiteDir\partials\footer.html") ""

# 9.10 All data-include placeholders, if any, point to existing files
$badIncludes = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    [regex]::Matches($content, 'data-include="([^"]+)"') | ForEach-Object {
        $inc = $_.Groups[1].Value
        if (-not (Test-Path "$SiteDir\$inc")) { $badIncludes += "$page -> $inc" }
    }
}
Test "SEO" "All data-include paths resolve" ($badIncludes.Count -eq 0) ($badIncludes -join "; ")


# === Section 10 — Publication Tests (auto, do not edit by hand) ===
Write-Host "`n--- 10. PUBLICATION TESTS ---" -ForegroundColor Magenta

# 10.1 Two-tier header on every page
$missingTwoTier = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -notmatch 'class="utility-bar"' -or $content -notmatch 'class="brand-bar"') {
        $missingTwoTier += $page
    }
}
Test "Publication" "Two-tier header on all pages" ($missingTwoTier.Count -eq 0) ($missingTwoTier -join ", ")

# 10.2 News hub exists
Test "Publication" "news.html exists" (Test-Path "$SiteDir\news.html") ""

# 10.3 News hub has topic-chip filter row
$newsHtml = if (Test-Path "$SiteDir\news.html") { Get-Content "$SiteDir\news.html" -Raw } else { "" }
Test "Publication" "News hub has topic-chip filter row" ($newsHtml -match 'data-topic-chip=') ""

# 10.4 News hub has >= 8 article cards
$newsCardCount = ([regex]::Matches($newsHtml, 'class="article-card[^"]*"\s+href="article-')).Count
Test "Publication" "News hub has >= 8 article cards ($newsCardCount)" ($newsCardCount -ge 8) ""

# 10.5 All 7 declared topics appear in news.html filter chips
$missingTopics = @()
foreach ($t in @("rtos-kernel","embedded-ai","neural-interface","security-boot","tools-sim","apps-platforms","community")) {
    if ($newsHtml -notmatch [regex]::Escape("data-topic-chip=`"$t`"")) { $missingTopics += $t }
}
Test "Publication" "All 7 topics in news.html filter chips" ($missingTopics.Count -eq 0) ($missingTopics -join ", ")

# 10.6 Articles: each article-*.html has kicker, byline, data-topic, Article JSON-LD, and meta author
$articlePages = $allPages | Where-Object { $_ -match '^article-' }
Test "Publication" "At least 8 article-*.html pages ($($articlePages.Count))" ($articlePages.Count -ge 8) ""
$articleProblems = @()
foreach ($page in $articlePages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    $issues = @()
    if ($content -notmatch 'name="author"')               { $issues += "author" }
    if ($content -notmatch 'class="kicker')               { $issues += "kicker" }
    if ($content -notmatch 'class="byline')               { $issues += "byline" }
    if ($content -notmatch 'data-topic="')                { $issues += "data-topic" }
    if ($content -notmatch '"@type":\s*"Article"')        { $issues += "Article-JSONLD" }
    if ($issues.Count -gt 0) { $articleProblems += "$page($($issues -join '/'))" }
}
Test "Publication" "Articles have author/kicker/byline/topic/JSONLD" ($articleProblems.Count -eq 0) ($articleProblems -join ", ")

# 10.7 Sitemap contains news + 8 articles
$smTxt = if (Test-Path "$SiteDir\sitemap.xml") { Get-Content "$SiteDir\sitemap.xml" -Raw } else { "" }
$smMissing = @()
foreach ($u in @("news","article-eos-platform-launch","article-eai-llm-bench","article-eni-1024-channel-pipeline","article-eboot-secure-boot-deepdive","article-eosim-hil-bridge","article-edb-encryption-at-rest","article-foundation-membership-2026","article-eos-roadmap-2026")) {
    # Clean URL form: <loc>https://www.embeddedos.org/<slug></loc>
    if ($smTxt -notmatch [regex]::Escape("/$u<")) { $smMissing += $u }
}
Test "Publication" "Sitemap includes news + 8 articles" ($smMissing.Count -eq 0) ($smMissing -join ", ")

# 10.8 js/news.js exists and is small
Test "Publication" "js/news.js exists" (Test-Path "$SiteDir\js\news.js") ""
if (Test-Path "$SiteDir\js\news.js") {
    $nsKB = (Get-Item "$SiteDir\js\news.js").Length / 1KB
    Test "Publication" "js/news.js < 5KB ($([math]::Round($nsKB,1))KB)" ($nsKB -lt 5) ""
}

# 10.9 Homepage has publication-front structure
$indexNew = Get-Content "$SiteDir\index.html" -Raw
Test "Publication" "Homepage has pub-front layout" ($indexNew -match 'class="pub-front"') ""
Test "Publication" "Homepage has at least 7 topic-strip sections" (([regex]::Matches($indexNew,'class="topic-strip"')).Count -ge 7) ""
Test "Publication" "Homepage has eco-snapshot strip" ($indexNew -match 'class="eco-snapshot"') ""
Test "Publication" "Homepage has foundation-callout" ($indexNew -match 'class="foundation-callout"') ""

# 10.10 CSS publication layer present and within budget
$cssNow = Get-Content "$SiteDir\css\style.css" -Raw
Test "Publication" "CSS contains v3 publication layer" ($cssNow -match '\.utility-bar' -and $cssNow -match '\.brand-bar' -and $cssNow -match '\.article-card' -and $cssNow -match '\.topic-strip' -and $cssNow -match '\.industry-strip') ""

# === End Section 10 — Publication Tests ===

# === Section 11 — Quality / Dedup / Link Integrity (auto, do not edit by hand) ===
Write-Host "`n--- 11. QUALITY / DEDUP / LINK INTEGRITY ---" -ForegroundColor Magenta

# 11.1 Index page: each article-*.html appears at most 2 times in body markup
$indexNow = Get-Content "$SiteDir\index.html" -Raw
$articleRefs = [regex]::Matches($indexNow, 'article-([a-z0-9\-]+)\.html')
$counts = @{}
foreach ($m in $articleRefs) {
    $slug = $m.Groups[1].Value
    if (-not $counts.ContainsKey($slug)) { $counts[$slug] = 0 }
    $counts[$slug] = $counts[$slug] + 1
}
$over = @()
foreach ($k in $counts.Keys) { if ($counts[$k] -gt 2) { $over += "$k($($counts[$k]))" } }
Test "Quality" "Homepage: each article appears <= 2 times" ($over.Count -eq 0) ($over -join ", ")

# 11.2 Index page: SVG markup not duplicated (use unique gradient ids as proxy)
$svgIds = [regex]::Matches($indexNow, 'id="(g_[0-9a-f]+)"') | ForEach-Object { $_.Groups[1].Value }
$svgUnique = ($svgIds | Select-Object -Unique).Count
Test "Quality" "Homepage: all SVGs unique ($svgUnique of $($svgIds.Count))" ($svgUnique -eq $svgIds.Count) "duplicates found"

# 11.3 News.html: each topic chip has matching id="topic-<slug>"
$newsNow = Get-Content "$SiteDir\news.html" -Raw
$missingTopicIds = @()
foreach ($t in @("rtos-kernel","embedded-ai","neural-interface","security-boot","tools-sim","apps-platforms","community")) {
    if ($newsNow -notmatch [regex]::Escape("id=`"topic-$t`"")) { $missingTopicIds += $t }
}
Test "Quality" "News chips have id=topic-<slug>" ($missingTopicIds.Count -eq 0) ($missingTopicIds -join ", ")

# 11.4 Skip-to-content target exists on every page that has a skip link
$badSkip = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -match 'href="#main-content"' -and $content -notmatch 'id="main-content"') {
        $badSkip += $page
    }
}
Test "Quality" "Skip-link target exists on all pages" ($badSkip.Count -eq 0) ($badSkip -join ", ")

# 11.5 All news.html#topic-* anchors used anywhere in the site resolve
$badAnchors = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    foreach ($m in [regex]::Matches($content, 'href="news\.html#topic-([a-z\-]+)"')) {
        $t = $m.Groups[1].Value
        if ($newsNow -notmatch [regex]::Escape("id=`"topic-$t`"")) { $badAnchors += "$page->#topic-$t" }
    }
}
Test "Quality" "All news.html#topic-* anchors resolve" ($badAnchors.Count -eq 0) (($badAnchors | Select-Object -Unique) -join ", ")

# 11.6 Every article page has unique SVGs (gradient-id proxy)
$badArticles = @()
foreach ($ap in ($allPages | Where-Object { $_ -match '^article-' })) {
    $apt = Get-Content "$SiteDir\$ap" -Raw
    $ids = [regex]::Matches($apt, 'id="(g_[0-9a-f]+)"') | ForEach-Object { $_.Groups[1].Value }
    $u = ($ids | Select-Object -Unique).Count
    if ($u -ne $ids.Count) { $badArticles += "$ap($u/$($ids.Count))" }
}
Test "Quality" "All article SVGs unique within each article page" ($badArticles.Count -eq 0) ($badArticles -join ", ")

# === End Section 11 — Quality / Dedup / Link Integrity ===

# === Section 12 — Foundation Polish (auto, do not edit by hand) ===
Write-Host "`n--- 12. FOUNDATION POLISH (industry + GitHub footprint) ---" -ForegroundColor Magenta

# Required external industry sites — present in the footer on every page
$industrySites = @(
    "https://www.embedded.com/",
    "https://embeddedsummit.com/",
    "https://www.embedded-india.com/",
    "https://www.toradex.com/",
    "https://generisgp.com/",
    "https://esweek.org/",
    "https://embeddedonlineconference.com/",
    "https://embedded-world-na.com/"
)

# 12.1 Every page footer carries all 8 industry sites
$missingPerPage = @{}
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    $miss = @()
    foreach ($u in $industrySites) {
        if ($content -notmatch [regex]::Escape($u)) { $miss += $u }
    }
    if ($miss.Count -gt 0) { $missingPerPage[$page] = $miss.Count }
}
Test "Polish" "All 8 industry sites in footer of every page" ($missingPerPage.Count -eq 0) (($missingPerPage.Keys | Select-Object -First 5) -join ", ")

# 12.2 Homepage has the prominent industry strip
$homeNow = Get-Content "$SiteDir\index.html" -Raw
Test "Polish" "Homepage has industry-strip section" ($homeNow -match 'class="industry-strip"') ""
Test "Polish" "Homepage industry strip has all 8 external links" (
    ($industrySites | Where-Object { $homeNow -match [regex]::Escape($_) }).Count -eq 8
) ""

# 12.3 GitHub footprint: most pages should have <= 2 GitHub references
# (Footer no longer has the mega-list; only the foot-bottom GitHub social link.
# Exempt: ecosystem.html (8 — by design), licenses.html (~15 license file links),
# documentation.html, product-* pages — all are intentional source-of-truth pages.)
$exempt = @("ecosystem.html","licenses.html","documentation.html","resources.html") + ($allPages | Where-Object { $_ -match '^product-' })
$ghOver = @()
foreach ($page in $allPages) {
    if ($exempt -contains $page) { continue }
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    $n = ([regex]::Matches($content, 'github\.com/embeddedos-org')).Count
    if ($n -gt 2) { $ghOver += "$page($n)" }
}
Test "Polish" "GitHub references kept to <= 2 on non-source-of-truth pages" ($ghOver.Count -eq 0) ($ghOver -join ", ")

# 12.4 No body href="#" placeholders outside the navigation dropdown structure
# (dropdown triggers now point to landing pages; only legal/data: anchors expected)
$placeholders = @{}
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    # Strip nav block before counting (nav uses real anchors now anyway)
    $stripped = $content -replace '(?s)<header class="navbar">.*?</header>',''
    $n = ([regex]::Matches($stripped, 'href="#"')).Count
    if ($n -gt 0) { $placeholders[$page] = $n }
}
$over = @($placeholders.Keys | Where-Object { $placeholders[$_] -gt 0 } | ForEach-Object { "$_($($placeholders[$_]))" })
Test "Polish" "No body href=`"#`" placeholders outside nav" ($over.Count -le 3) ($over -join ", ")

# 12.5 Every external (target=_blank) link uses rel=noopener (re-asserted strictly)
$unsafe = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    foreach ($m in [regex]::Matches($content, '<a[^>]*target="_blank"[^>]*>')) {
        if ($m.Value -notmatch 'rel="noopener"') { $unsafe += $page; break }
    }
}
Test "Polish" "All target=_blank links use rel=noopener" ($unsafe.Count -eq 0) ($unsafe -join ", ")

# 12.6 Footer Industry & Community column header present
$footerHeader = '<h4>Industry &amp; Community</h4>'
$missing = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -notmatch [regex]::Escape($footerHeader)) { $missing += $page }
}
Test "Polish" "Footer has Industry & Community column on every page" ($missing.Count -eq 0) ($missing -join ", ")

# === End Section 12 — Foundation Polish ===

# === Section 13 — Clean URLs & Speed (auto, do not edit by hand) ===
Write-Host "`n--- 13. CLEAN URLS & SPEED ---" -ForegroundColor Magenta

# 13.1 .htaccess present + has rewrite rules
$htPath = Join-Path $SiteDir ".htaccess"
Test "Speed" ".htaccess exists" (Test-Path $htPath) ""
$ht = if (Test-Path $htPath) { Get-Content $htPath -Raw } else { "" }
Test "Speed" ".htaccess rewrites clean URL -> .html" ($ht -match 'RewriteRule\s+\^\(\.\*\)\$\s+\$1\.html') ""
Test "Speed" ".htaccess enables compression" ($ht -match 'mod_deflate') ""
Test "Speed" ".htaccess sets cache headers" ($ht -match 'mod_expires|Cache-Control') ""

# 13.2 No .html suffix in canonical URLs (except 404.html)
$canonHasHtml = @()
foreach ($page in $allPages) {
    if ($page -eq "404.html") { continue }
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -match '<link rel="canonical" href="[^"]+\.html"') { $canonHasHtml += $page }
}
Test "Speed" "No .html in canonical URLs" ($canonHasHtml.Count -eq 0) ($canonHasHtml -join ", ")

# 13.3 No .html suffix in og:url (except 404)
$ogHasHtml = @()
foreach ($page in $allPages) {
    if ($page -eq "404.html") { continue }
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    if ($content -match '<meta property="og:url" content="[^"]+\.html"') { $ogHasHtml += $page }
}
Test "Speed" "No .html in og:url" ($ogHasHtml.Count -eq 0) ($ogHasHtml -join ", ")

# 13.4 Sitemap uses clean URLs (no .html suffix except 404)
$smTxt2 = if (Test-Path "$SiteDir\sitemap.xml") { Get-Content "$SiteDir\sitemap.xml" -Raw } else { "" }
$dirty = ([regex]::Matches($smTxt2, '<loc>https://www\.embeddedos\.org/[^<]+\.html</loc>'))
$dirtyNot404 = $dirty | Where-Object { $_.Value -notmatch '/404\.html' }
Test "Speed" "Sitemap uses clean URLs (no .html)" (@($dirtyNot404).Count -eq 0) "$($dirtyNot404.Count) .html URLs"

# 13.5 All <script src=...> tags use defer (no render-blocking JS)
$blockingJs = @()
foreach ($page in $allPages) {
    $content = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue); if ($null -eq $content) { $content = [string]::Empty }
    foreach ($m in [regex]::Matches($content, '<script\s[^>]*src=[^>]*>')) {
        if ($m.Value -notmatch '\bdefer\b' -and $m.Value -notmatch '\basync\b') { $blockingJs += $page; break }
    }
}
Test "Speed" "All script src tags are defer/async" ($blockingJs.Count -eq 0) ($blockingJs -join ", ")

# === End Section 13 — Clean URLs & Speed ===

# === Section 14 — Events & Modern Tech (auto, do not edit by hand) ===
Write-Host "`n--- 14. EVENTS & MODERN TECH ---" -ForegroundColor Magenta

# 14.1 events page exists
Test "Events" "events.html exists" (Test-Path "$SiteDir\events.html") ""

$ev = if (Test-Path "$SiteDir\events.html") { Get-Content "$SiteDir\events.html" -Raw } else { "" }

# 14.2 At least 9 event cards
$evCards = ([regex]::Matches($ev, 'class="event-card[^"]*"')).Count
Test "Events" "events page has >= 9 event cards ($evCards)" ($evCards -ge 9) ""

# 14.3 All 8 partner sites linked from events page
$partners = @("https://www.embedded.com/","https://embeddedsummit.com/","https://www.embedded-india.com/","https://www.toradex.com/","https://generisgp.com/","https://esweek.org/","https://embeddedonlineconference.com/","https://embedded-world-na.com/")
$missingPartners = @()
foreach ($u in $partners) { if ($ev -notmatch [regex]::Escape($u)) { $missingPartners += $u } }
Test "Events" "Events page links all 8 partner sites" ($missingPartners.Count -eq 0) ($missingPartners -join ", ")

# 14.4 events page has Schema.org Event JSON-LD
Test "Events" "events page has Event schema JSON-LD" ($ev -match '"@type":"Event"') ""
Test "Events" "events page has online attendance modes" ($ev -match 'OnlineEventAttendanceMode') ""
Test "Events" "events page has offline attendance modes" ($ev -match 'OfflineEventAttendanceMode') ""

# 14.5 events page has filter chips for online / offline / hybrid
Test "Events" "events page has online filter chip" ($ev -match 'data-events-filter="online"') ""
Test "Events" "events page has offline filter chip" ($ev -match 'data-events-filter="offline"') ""
Test "Events" "events page has hybrid filter chip" ($ev -match 'data-events-filter="hybrid"') ""

# 14.6 js/events.js exists and is small
Test "Events" "js/events.js exists" (Test-Path "$SiteDir\js\events.js") ""
if (Test-Path "$SiteDir\js\events.js") {
    $evJsKB = (Get-Item "$SiteDir\js\events.js").Length / 1KB
    Test "Events" "js/events.js < 3KB ($([math]::Round($evJsKB,1))KB)" ($evJsKB -lt 3) ""
}

# 14.7 Homepage has Events strip
$homeNow2 = Get-Content "$SiteDir\index.html" -Raw
Test "Events" "Homepage has events-strip section" ($homeNow2 -match 'class="events-strip"') ""
Test "Events" "Homepage links to events page" ($homeNow2 -match 'href="events(\.html)?"') ""

# 14.8 Nav has Events item
$navTxt = Get-Content "$SiteDir\partials\nav.html" -Raw
Test "Events" "Nav partial has Events link" ($navTxt -match 'href="events(\.html)?"') ""

# 14.9 Modern tech: live-bar + tech-eyebrow + tech-metric on homepage
Test "ModernTech" "Homepage has live-bar status indicator" ($homeNow2 -match 'class="live-bar"') ""
Test "ModernTech" "Homepage has tech-eyebrow accent" ($homeNow2 -match 'class="tech-eyebrow"') ""
Test "ModernTech" "Homepage has tech-metrics block" ($homeNow2 -match 'class="tech-metrics"') ""
Test "ModernTech" "CSS contains v5 modern-tech layer" (
    $cssNow -match '\.live-bar' -and $cssNow -match '\.event-card' -and $cssNow -match '\.tech-eyebrow' -and $cssNow -match '\.events-cta-card'
) ""

# 14.10 Sitemap includes events
$smNow = Get-Content "$SiteDir\sitemap.xml" -Raw
Test "Events" "Sitemap includes /events" ($smNow -match '/events</loc>') ""

# 14.11 Events page itself uses topic-chip filter conventions
Test "Events" "events page chips have aria-pressed" ($ev -match 'aria-pressed="true"' -and $ev -match 'aria-pressed="false"') ""

# === End Section 14 — Events & Modern Tech ===

# === Section 15 — Top-tier SEO (auto, do not edit by hand) ===
Write-Host "`n--- 15. TOP-TIER SEO ---" -ForegroundColor Magenta

# Pre-load every page into a hash to avoid repeated UNC file reads
$allContent = @{}
foreach ($page in $allPages) {
    $allContent[$page] = (Get-Content "$SiteDir\$page" -Raw -ErrorAction SilentlyContinue)
    if ($null -eq $allContent[$page]) { $allContent[$page] = [string]::Empty }
}
$seoSkip = @("404.html")

function CheckPattern($name, $pattern, $skipPages = @("404.html")) {
    $missing = @()
    foreach ($page in $allPages) {
        if ($skipPages -contains $page) { continue }
        if ($allContent[$page] -notmatch $pattern) { $missing += $page }
    }
    Test "SEO" $name ($missing.Count -eq 0) ($missing -join ", ")
}

CheckPattern "All pages have robots max-image-preview:large" 'name="robots"\s+content="[^"]*max-image-preview:large'
CheckPattern "All pages have googlebot meta" 'name="googlebot"'
CheckPattern "All pages have og:locale" 'property="og:locale"'
CheckPattern "All pages have og:image:alt" 'property="og:image:alt"'
CheckPattern "All pages have RSS alternate link" 'rel="alternate"\s+type="application/rss\+xml"'
CheckPattern "All pages have manifest link" 'rel="manifest"'
CheckPattern "All pages have twitter:site handle" 'name="twitter:site"'

# hreflang en + x-default
$missing = @()
foreach ($page in $allPages) {
    if ($seoSkip -contains $page) { continue }
    if ($allContent[$page] -notmatch 'hreflang="en"' -or $allContent[$page] -notmatch 'hreflang="x-default"') { $missing += $page }
}
Test "SEO" "All pages have hreflang en + x-default" ($missing.Count -eq 0) ($missing -join ", ")

# BreadcrumbList on non-home, non-404
$missing = @()
foreach ($page in $allPages) {
    if ($seoSkip -contains $page -or $page -eq "index.html") { continue }
    if ($allContent[$page] -notmatch '"BreadcrumbList"') { $missing += $page }
}
Test "SEO" "All non-home pages have BreadcrumbList JSON-LD" ($missing.Count -eq 0) ($missing -join ", ")

# Homepage WebSite + SearchAction
$idxContent = $allContent["index.html"]
Test "SEO" "Homepage has WebSite JSON-LD" ($idxContent -match '"@type":"WebSite"') ""
Test "SEO" "Homepage has SearchAction" ($idxContent -match '"SearchAction"') ""

# News page
$nws = $allContent["news.html"]
Test "SEO" "News has NewsMediaOrganization" ($nws -match '"NewsMediaOrganization"') ""
Test "SEO" "News has ItemList" ($nws -match '"@type":"ItemList"') ""

# Product pages SoftwareApplication
$missing = @()
foreach ($page in $allPages) {
    if ($page -notmatch '^product-') { continue }
    if ($allContent[$page] -notmatch '"SoftwareApplication"') { $missing += $page }
}
Test "SEO" "All product pages have SoftwareApplication JSON-LD" ($missing.Count -eq 0) ($missing -join ", ")

# Article pages article:* + Speakable
$missing = @()
foreach ($page in $allPages) {
    if ($page -notmatch '^article-') { continue }
    if ($allContent[$page] -notmatch 'article:published_time' -or $allContent[$page] -notmatch 'SpeakableSpecification') { $missing += $page }
}
Test "SEO" "All articles have article:* meta + Speakable" ($missing.Count -eq 0) ($missing -join ", ")

# rss.xml
Test "SEO" "rss.xml exists" (Test-Path "$SiteDir\rss.xml") ""
$rssOk = $false
try { [xml]$rssXml = Get-Content "$SiteDir\rss.xml" -Raw; $rssOk = $true } catch { $rssOk = $false }
Test "SEO" "rss.xml is well-formed XML" $rssOk ""
$rssTxt = if (Test-Path "$SiteDir\rss.xml") { Get-Content "$SiteDir\rss.xml" -Raw } else { "" }
$rssItemCount = ([regex]::Matches($rssTxt, '<item>')).Count
Test "SEO" "rss.xml has 8 items ($rssItemCount)" ($rssItemCount -eq 8) ""

# Sitemap variants
Test "SEO" "sitemap-news.xml exists" (Test-Path "$SiteDir\sitemap-news.xml") ""
Test "SEO" "sitemap-image.xml exists" (Test-Path "$SiteDir\sitemap-image.xml") ""
Test "SEO" "sitemap-index.xml exists" (Test-Path "$SiteDir\sitemap-index.xml") ""

# manifest.json + humans.txt
Test "SEO" "manifest.json exists" (Test-Path "$SiteDir\manifest.json") ""
$mfOk = $false
try { ConvertFrom-Json -InputObject (Get-Content "$SiteDir\manifest.json" -Raw) | Out-Null; $mfOk = $true } catch { $mfOk = $false }
Test "SEO" "manifest.json is valid JSON" $mfOk ""
Test "SEO" "humans.txt exists" (Test-Path "$SiteDir\humans.txt") ""

# robots.txt
$rb = Get-Content "$SiteDir\robots.txt" -Raw
Test "SEO" "robots.txt lists sitemap.xml" ($rb -match 'Sitemap:.*sitemap\.xml') ""
Test "SEO" "robots.txt lists sitemap-news.xml" ($rb -match 'Sitemap:.*sitemap-news\.xml') ""
Test "SEO" "robots.txt lists sitemap-image.xml" ($rb -match 'Sitemap:.*sitemap-image\.xml') ""
Test "SEO" "robots.txt allows GPTBot" ($rb -match 'GPTBot[\s\S]*?Allow') ""

# Events ItemList
Test "SEO" "Events has ItemList JSON-LD" ($allContent["events.html"] -match '"@type":"ItemList"') ""

# === End Section 15 — Top-tier SEO ===

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
