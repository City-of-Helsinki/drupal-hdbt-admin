(function (drupalSettings) {
  'use strict';

  function since(msString) {
    const then = new Date(msString);
    const now = new Date();
    const ms = now - then;
    const sinceArr = [
      { name: 'milliseconds', val: 1000 },
      { name: 'seconds', val: 60 * 1000 },
      { name: 'minutes', val: 60 * 60 * 1000 },
      { name: 'hours', val: 24 * 60 * 60 * 1000 },
      { name: 'days', val: 356 * 24 * 60 * 60 * 1000 },
      { name: 'years', val: 10 * 356 * 24 * 60 * 60 * 1000 },
    ];

    for (let i = 0; i < sinceArr.length; i++) {
      const item = sinceArr[i];
      if (ms < item.val) {
        let msNum = ms;
        if (i > 0) {
          msNum = Math.round(ms / sinceArr[i - 1].val);
        }
        return `${msNum} ${item.name} ago`;
      }
    }
    return 'forever ago';
  }

  document.querySelectorAll('[data-since]')
    .forEach((sinceCell) => {
      sinceCell.innerText = since(sinceCell.dataset.since);
    }
    );


  function getLatest(element) {
    const packageName = element.dataset.package;
    const packageVersion = element.dataset.version;

    var requestOptions = {
      method: 'GET',
      headers: new Headers(),
      redirect: 'follow'
    };

    if (drupalSettings && drupalSettings.path && drupalSettings.path.pathPrefix) {
      const apiUrl = `${drupalSettings.path.baseUrl}${drupalSettings.path.pathPrefix}api/v1/package?name=${packageName}&version=${packageVersion}`;

      fetch(apiUrl, requestOptions)
        .then(response => response.text())
        .then(result => {
          const resultObj = JSON.parse(result);

          if (resultObj.latestVersion) {
            element.innerText = resultObj.latestVersion;
          } else {
            element.innerText = 'Unknown';
          }
          const versionElement = element.parentElement.querySelector('td:first-of-type');
          if (!resultObj.isLatest) {
            versionElement.style = 'color: red';
          }
        }
        )
        .catch(error => console.log('error', error));
    } else {
      console.error('drupalSettings.path.pathPrefix not found');
    }
  }
  document.querySelectorAll('[data-package][data-version]').forEach(getLatest);

})(drupalSettings);
