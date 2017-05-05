// ==UserScript==
// @name         Clockwise Calculator
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        http://*/Clockwise/ClkCrd.htm*
// @grant        none
// @updateURL    https://rawgit.com/Rabrennie/12426725db5ddbfcc2cdc82e8261a531/raw/36d6b7fe41ea15ea8f18835110feed11aa8f2642/clockwise.js
// @downloadURL    https://rawgit.com/Rabrennie/12426725db5ddbfcc2cdc82e8261a531/raw/36d6b7fe41ea15ea8f18835110feed11aa8f2642/clockwise.js
// ==/UserScript==

(function() {
    'use strict';

    var tableRow = document.createElement('tr');

    var td_rightText = document.createElement('td');
    td_rightText.innerHTML = 'Estimated';
    td_rightText.setAttribute('class', 'rightText');
    td_rightText.setAttribute('nowrap', '');
    tableRow.appendChild(td_rightText);

    var td_nbsp = document.createElement('td');
    td_nbsp.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    tableRow.appendChild(td_nbsp);
    var timeToWorkElems = document.querySelectorAll('.TargetHours');
    for (var i = 0; i <= 6; i++) {
        var time = calculateTime(i);

        var flexi;
        var timeToWork= timeToWorkElems[i].innerHTML.split(':');
        var hours = parseInt(timeToWork[0]);
        var minutes = parseInt(timeToWork[1]);
        if(time.hours >= hours && time.minutes >= minutes ) {
            var flexiDate = new Date((new Date(0,0,0,time.hours,time.minutes)) - (new Date(0,0,0,hours,minutes)));
            flexi = flexiDate.getHours() + ':' + leftPad(flexiDate.getMinutes(), 2, "0");
        } else {
            var flexiDate = new Date((new Date(0,0,0,hours,minutes))-(new Date(0,0,0,time.hours,time.minutes)));
            flexi = '-' + flexiDate.getHours() + ':' + leftPad(flexiDate.getMinutes(), 2, "0");
        }

        document.querySelector('#TOT_4_' + i).innerHTML = flexi;
        var td = createTD(`total${i}`, time.hours + ':' + time.minutes);
        tableRow.appendChild(td);
    }

    var insertAfter = document.querySelector('.RED');

    insertAfter.parentNode.insertBefore(tableRow, insertAfter.nextSibling);

})();

function createTD(id, value) {
    var td = document.createElement('td');
    td.setAttribute('class', 'DataCell WorkedHours');
    td.setAttribute('nowrap', '');

    var span = document.createElement('span');
    span.setAttribute('id', id);
    span.innerHTML = value;

    td.appendChild(span);

    return td;
}


function calculateTime(day) {
    var cells = [];

    for (var i = 0; i < 6; i++) {
        var time = document.querySelector(`#CLOCK_${i}_${day}`).value;
        if(time !== '') {
            cells.push(
                new Date(0,0,0,time.split(':')[0],time.split(':')[1])
            );
        }
    }

    if(cells.length % 2 !== 0 && cells.length > 0 && cells[0].getHours() !== 0) {
        var now = new Date();
        cells.push(new Date(0,0,0,now.getHours(),now.getMinutes()));
    }

    var total = 0;

    for (var i = 1; i < cells.length; i+=2) {
        var diff = new Date(cells[i]-cells[i-1]);
        total += diff.getHours()*60;
        total += diff.getMinutes();
    }
    var hours = Math.trunc(total/60);
    var minutes = leftPad((total%60), 2, '0');

    return { hours:hours,  minutes:minutes };
}

var cache = [
  '',
  ' ',
  '  ',
  '   ',
  '    ',
  '     ',
  '      ',
  '       ',
  '        ',
  '         '
];

function leftPad (str, len, ch) {
  // convert `str` to `string`
  str = str + '';
  // `len` is the `pad`'s length now
  len = len - str.length;
  // doesn't need to pad
  if (len <= 0) return str;
  // `ch` defaults to `' '`
  if (!ch && ch !== 0) ch = ' ';
  // convert `ch` to `string`
  ch = ch + '';
  // cache common use cases
  if (ch === ' ' && len < 10) return cache[len] + str;
  // `pad` starts with an empty string
  var pad = '';
  // loop
  while (true) {
    // add `ch` to `pad` if `len` is odd
    if (len & 1) pad += ch;
    // divide `len` by 2, ditch the remainder
    len >>= 1;
    // "double" the `ch` so this operation count grows logarithmically on `len`
    // each time `ch` is "doubled", the `len` would need to be "doubled" too
    // similar to finding a value in binary search tree, hence O(log(n))
    if (len) ch += ch;
    // `len` is 0, exit the loop
    else break;
  }
  // pad `str`!
  return pad + str;
}
