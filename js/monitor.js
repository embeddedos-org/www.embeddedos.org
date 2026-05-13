(function () {
'use strict';
var SENTRY_DSN = window.__SENTRY_DSN__ || '';
var ENV = window.location.hostname.includes('localhost') ? 'development' : 'production';
var MAX_ERRORS = 50;
var errorCount = 0;
var errorLog = [];
function logError(type, message, source, line, col, stack) {
if (errorCount >= MAX_ERRORS) return;
errorCount++;
var entry = {
type: type,
message: String(message).substring(0, 500),
source: source || '',
line: line || 0,
col: col || 0,
stack: stack ? String(stack).substring(0, 1000) : '',
url: window.location.href,
userAgent: navigator.userAgent,
timestamp: new Date().toISOString()
};
errorLog.push(entry);
if (ENV === 'development') {
console.groupCollapsed('[EoS Monitor] ' + type + ': ' + entry.message);
console.table(entry);
console.groupEnd();
}
return entry;
}
window.onerror = function (message, source, line, col, error) {
logError(
'js_error',
message,
source,
line,
col,
error && error.stack ? error.stack : ''
);
};
window.addEventListener('unhandledrejection', function (event) {
var reason = event.reason;
logError(
'unhandled_rejection',
reason && reason.message ? reason.message : String(reason),
'',
0,
0,
reason && reason.stack ? reason.stack : ''
);
});
window.addEventListener(
'error',
function (event) {
var target = event.target;
if (target && (target.tagName === 'SCRIPT' || target.tagName === 'LINK' || target.tagName === 'IMG')) {
logError(
'resource_error',
'Failed to load ' + target.tagName.toLowerCase() + ': ' + (target.src || target.href || ''),
target.src || target.href || '',
0,
0,
''
);
}
},
true
);
function trackWebVitals() {
if (!('PerformanceObserver' in window)) return;
try {
new PerformanceObserver(function (list) {
var entries = list.getEntries();
var lcp = entries[entries.length - 1];
logMetric('LCP', Math.round(lcp.startTime));
}).observe({ type: 'largest-contentful-paint', buffered: true });
} catch (e) {  }
try {
new PerformanceObserver(function (list) {
var entries = list.getEntries();
entries.forEach(function (entry) {
logMetric('FID', Math.round(entry.processingStart - entry.startTime));
});
}).observe({ type: 'first-input', buffered: true });
} catch (e) {  }
try {
var clsValue = 0;
new PerformanceObserver(function (list) {
list.getEntries().forEach(function (entry) {
if (!entry.hadRecentInput) {
clsValue += entry.value;
}
});
logMetric('CLS', Math.round(clsValue * 1000) / 1000);
}).observe({ type: 'layout-shift', buffered: true });
} catch (e) {  }
}
function logMetric(name, value) {
if (ENV === 'development') {
console.log('[EoS Perf] ' + name + ': ' + value);
}
if (window.Sentry && window.Sentry.metrics) {
window.Sentry.metrics.distribution('web_vital.' + name.toLowerCase(), value, { unit: name === 'CLS' ? '' : 'millisecond' });
}
}
function initSentry() {
if (!SENTRY_DSN) {
if (ENV === 'development') {
console.log('[EoS Monitor] No Sentry DSN configured. Set window.__SENTRY_DSN__ or SENTRY_DSN GitHub variable.');
}
return;
}
var script = document.createElement('script');
script.src = 'https://browser.sentry-cdn.com/8.45.0/bundle.tracing.min.js';
script.crossOrigin = 'anonymous';
script.onload = function () {
if (!window.Sentry) return;
window.Sentry.init({
dsn: SENTRY_DSN,
environment: ENV,
release: 'embeddedos-web@' + (window.__APP_VERSION__ || '1.0.0'),
integrations: [window.Sentry.browserTracingIntegration()],
tracesSampleRate: ENV === 'production' ? 0.2 : 1.0,
replaysSessionSampleRate: 0,
replaysOnErrorSampleRate: ENV === 'production' ? 0.5 : 1.0,
beforeSend: function (event) {
if (event.request && event.request.cookies) {
delete event.request.cookies;
}
return event;
},
ignoreErrors: [
'ResizeObserver loop',
'Non-Error promise rejection',
'Load failed',
'ChunkLoadError',
/^Script error\.?$/
],
denyUrls: [
/extensions\
/^chrome:\/\
/^moz-extension:\/\
]
});
window.Sentry.setTag('page', window.location.pathname);
errorLog.forEach(function (entry) {
if (entry.type === 'js_error' || entry.type === 'unhandled_rejection') {
window.Sentry.captureMessage(entry.message, {
level: 'error',
extra: entry
});
}
});
if (ENV === 'development') {
console.log('[EoS Monitor] Sentry initialized — DSN: ' + SENTRY_DSN.substring(0, 30) + '...');
}
};
script.onerror = function () {
if (ENV === 'development') {
console.warn('[EoS Monitor] Failed to load Sentry SDK — fallback logging active');
}
};
document.head.appendChild(script);
}
window.EosMonitor = {
captureError: function (error, context) {
logError('custom', error.message || String(error), '', 0, 0, error.stack || '');
if (window.Sentry) {
window.Sentry.captureException(error, { extra: context });
}
},
captureMessage: function (message, level) {
logError('custom_message', message);
if (window.Sentry) {
window.Sentry.captureMessage(message, level || 'info');
}
},
setUser: function (user) {
if (window.Sentry) {
window.Sentry.setUser(user);
}
},
getErrorLog: function () {
return errorLog.slice();
}
};
initSentry();
trackWebVitals();
})();
