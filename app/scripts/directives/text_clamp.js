magento_module.directive("textClamp", ['$log', '$window',

    function ($log, $window) {
        var opt = {
            splitOnChars: ['.', '-', '–', '—', ' '] //Split on sentences (periods), hypens, en-dashes, em-dashes, and words (spaces).
        };

        /**
         * Return the current style for an element. Shim for IE
         * @param {HTMLElement} elem The element to compute.
         * @param {string} prop The style property.
         * @returns {number}
         */
        function computeStyle(elem, prop) {
            if (!$window.getComputedStyle) {
                $window.getComputedStyle = function (el, pseudo) {
                    this.el = el;
                    this.getPropertyValue = function (prop) {
                        var re = /(\-([a-z]){1})/g;
                        if (prop === 'float') {
                            prop = 'styleFloat';
                        }
                        if (re.test(prop)) {
                            prop = prop.replace(re, function () {
                                return arguments[2].toUpperCase();
                            });
                        }
                        return el.currentStyle && el.currentStyle[prop] ? el.currentStyle[prop] : null;
                    };
                    return this;
                };
            }

            return $window.getComputedStyle(elem, null).getPropertyValue(prop);
        }

        /**
         * Returns the maximum number of lines of text that should be rendered based
         * on the current height of the element and the line-height of the text.
         */
        function getMaxLines(element, height) {
            var availHeight = height || element.clientHeight,
                lineHeight = getLineHeight(element);

            return Math.max(Math.floor(availHeight / lineHeight), 0);
        }

        /**
         * Returns the maximum height a given element should have based on the line-
         * height of the text and the given clamp value.
         */
        function getMaxHeight(element, clmp) {
            var lineHeight = getLineHeight(element);
            return lineHeight * clmp;
        }

        /**
         * Returns the line-height of an element as an integer.
         */
        function getLineHeight(elem) {
            var lh = computeStyle(elem, 'line-height');
            if (lh === 'normal') {
                // Normal line heights vary from browser to browser. The spec recommends
                // a value between 1.0 and 1.2 of the font size. Using 1.1 to split the diff.
                lh = parseInt(computeStyle(elem, 'font-size'), 10) * 1.2;
            }
            return parseInt(lh, 10);
        }

        /**
         * Gets an element's last child. That may be another node or a node's contents.
         */
        function getLastChild(elem) {
            //Current element has children, need to go deeper and get last child as a text node
            if (elem.lastChild && elem.lastChild.children && elem.lastChild.children.length > 0) {
                return getLastChild(Array.prototype.slice.call(elem.children).pop());
            }
            //This is the absolute last child, a text node, but something's wrong with it. Remove it and keep trying
            //else if (!elem.lastChild || !elem.lastChild.nodeValue || elem.lastChild.nodeValue === '' || elem.lastChild.nodeValue === '…') {
            //   elem.lastChild.parentNode.removeChild(elem.lastChild);
            //   return getLastChild(elem);
            //}
            else { //This is the last child we want, return it
                return elem.lastChild;
            }
        }

        var splitOnChars = opt.splitOnChars.slice(0),
            splitChar = splitOnChars[0],
            chunks = null,
            lastChunk = null;

        /**
         * Resets global variables.
         */
        function reset() {
            splitOnChars = opt.splitOnChars.slice(0);
            splitChar = splitOnChars[0];
            chunks = null;
            lastChunk = null;
        }

        /**
         * Removes one character at a time from the text until its width or
         * height is beneath the passed-in max param.
         */
        function truncate(element, target, maxHeight) {
            if (!maxHeight) {
                return;
            }

            var nodeValue = target.nodeValue.replace(/…/, '');

            //Grab the next chunks
            if (!chunks) {
                //If there are more characters to try, grab the next one
                if (splitOnChars.length > 0) {
                    splitChar = splitOnChars.shift();
                } else {
                    //No characters to chunk by. Go character-by-character
                    splitChar = '';
                }

                chunks = nodeValue.split(splitChar);
            }

            // If there are chunks left to remove, remove the last one and see if
            // the nodeValue fits.
            if (chunks.length > 1) {
                lastChunk = chunks.pop();
                applyEllipsis(target, chunks.join(splitChar));
            } else {
                // No more chunks can be removed using this character
                chunks = null;
            }

            //Search produced valid chunks
            if (chunks) {
                //It fits
                if (element.clientHeight <= maxHeight) {
                    //There's still more characters to try splitting on, not quite done yet
                    if (splitOnChars.length >= 0 && splitChar !== '') {
                        applyEllipsis(target, chunks.join(splitChar) + splitChar + lastChunk);
                        chunks = null;
                    } else { //Finished!
                        return false;
                    }
                }
            } else { //No valid chunks produced
                //No valid chunks even when splitting by letter, time to move
                //on to the next node
                if (splitChar === '') {
                    applyEllipsis(target, '');
                    target = getLastChild(element);

                    reset();
                }
            }

            // If you get here it means still too big, let's keep truncating
            truncate(element, target, maxHeight);
        }

        function applyEllipsis(elem, str) {
            elem.nodeValue = str + '…';
        }

        return {
            link: function (scope, el, attrs) {
                var clampValue = attrs.textClamp,
                    isCSSValue = clampValue.indexOf && (clampValue.indexOf('px') > -1 || clampValue.indexOf('em') > -1);


                function go() {
                    if (clampValue === 'auto') {
                        clampValue = getMaxLines(el[0]);
                    } else if (isCSSValue) {
                        clampValue = getMaxLines(el[0], parseInt(clampValue, 10));
                    }

                    var height = getMaxHeight(el[0], clampValue);
                    $log.log('gonna go?', height, el[0].clientHeight, height <= el[0].clientHeight);
                    if (height <= el[0].clientHeight) {
                        reset();
                        $log.log('here we go', el[0], getLastChild(el[0]), height);
                        truncate(el[0], getLastChild(el[0]), height);
                    }
                }

                scope.$watch(attrs.ngBind, function (val) {
                    var ogText = el.text();
                    go();
                    attrs.$set('title', ogText);
                });
            }
        };
    }]);


