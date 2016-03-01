'use strict';

var systemInfo = {};

function updateSystemInfo(forceNavigator) {
  //The original version fo this script comes from http://stackoverflow.com/questions/9514179/how-to-find-the-operating-system-version-using-javascript
  //All credit should go to viazenetti GmbH (Christian Ludwig)

  var unknown = '-';

  var navigator = forceNavigator || window.navigator;

  var appVersion = navigator.appVersion;
  var userAgent = navigator.userAgent;
  var browser = navigator.appName;


  var version = '' + parseFloat(appVersion);
  var majorVersion = parseInt(version, 10);
  var nameOffset, verOffset, ix;

  // Opera
  if ((verOffset = userAgent.indexOf('Opera')) != -1) {
    browser = 'Opera';
    version = userAgent.substring(verOffset + 6);
    if ((verOffset = userAgent.indexOf('Version')) != -1) {
      version = userAgent.substring(verOffset + 8);
    }
  }
  // MSIE
  else if ((verOffset = userAgent.indexOf('MSIE')) != -1) {
    browser = 'Microsoft Internet Explorer';
    version = userAgent.substring(verOffset + 5);
  }
  // Chrome
  else if ((verOffset = userAgent.indexOf('Chrome')) != -1) {
    browser = 'Chrome';
    version = userAgent.substring(verOffset + 7);
  }
  // Safari
  else if ((verOffset = userAgent.indexOf('Safari')) != -1) {
    browser = 'Safari';
    version = userAgent.substring(verOffset + 7);
    if ((verOffset = userAgent.indexOf('Version')) != -1) {
      version = userAgent.substring(verOffset + 8);
    }
  }
  // Firefox
  else if ((verOffset = userAgent.indexOf('Firefox')) != -1) {
    browser = 'Firefox';
    version = userAgent.substring(verOffset + 8);
  }
  // MSIE 11+
  else if (userAgent.indexOf('Trident/') != -1) {
    browser = 'Microsoft Internet Explorer';
    version = userAgent.substring(userAgent.indexOf('rv:') + 3);
  }
  // Other browsers
  else if ((nameOffset = userAgent.lastIndexOf(' ') + 1) < (verOffset = userAgent.lastIndexOf('/'))) {
    browser = userAgent.substring(nameOffset, verOffset);
    version = userAgent.substring(verOffset + 1);
    if (browser.toLowerCase() == browser.toUpperCase()) {
      browser = window.navigator.browser;
    }
  }
  // trim the version string
  if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
  if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
  if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

  if (isNaN(majorVersion)) {
    version = '' + parseFloat(appVersion);
    majorVersion = parseInt(appVersion, 10);
  }

  // mobile version
  var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)|Windows Phone/.test(appVersion);

  // system
  var os = unknown;
  var clientStrings = [
    {s:'Windows 3.11', r:/Win16/},
    {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
    {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
    {s:'Windows 98', r:/(Windows 98|Win98)/},
    {s:'Windows CE', r:/Windows CE/},
    {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
    {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
    {s:'Windows Server 2003', r:/Windows NT 5.2/},
    {s:'Windows Vista', r:/Windows NT 6.0/},
    {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
    {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
    {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
    {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
    {s:'Windows ME', r:/Windows ME/},
    {s:'Android', r:/Android/},
    {s:'Open BSD', r:/OpenBSD/},
    {s:'Sun OS', r:/SunOS/},
    {s:'Linux', r:/(Linux|X11)/},
    {s:'iOS', r:/(iPhone|iPad|iPod)/},
    {s:'Mac OS X', r:/Mac OS X/},
    {s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
    {s:'QNX', r:/QNX/},
    {s:'UNIX', r:/UNIX/},
    {s:'BeOS', r:/BeOS/},
    {s:'OS/2', r:/OS\/2/},
    {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
  ];
  for (var id in clientStrings) {
    var cs = clientStrings[id];
    if (cs.r.test(userAgent)) {
      os = cs.s;
      break;
    }
  }

  var osVersion = unknown;

  if (/Windows/.test(os)) {
    osVersion = /Windows (.*)/.exec(os)[1];
    os = 'Windows';
  }

  switch (os) {
    case 'Mac OS X':
      osVersion = /Mac OS X (10[\.\_\d]+)/.exec(userAgent)[1];
      break;

    case 'Android':
      osVersion = /Android ([\.\_\d]+)/.exec(userAgent)[1];
      break;

    case 'iOS':
      osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(appVersion);
      osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] || 0);
      break;
  }

  var osMajorVersion = parseInt(osVersion.split('.')[0], 10);

  var isWindows = userAgent.match(/Windows Phone/);
  var isIPhone = !isWindows && userAgent.match(/iPhone/);


  systemInfo.browser = browser;
  systemInfo.browserVersion = version;
  systemInfo.browserMajorVersion = majorVersion;
  systemInfo.mobile = mobile;
  systemInfo.os = os;
  systemInfo.osVersion = osVersion;
  systemInfo.osMajorVersion = osMajorVersion;
  systemInfo.isIPhone = isIPhone;
}

updateSystemInfo();

// TODO find a better way to update system info for tests
window.addEventListener('updateSystemInfo', function(ev) {
  updateSystemInfo(ev.detail);
});

module.exports = systemInfo;
