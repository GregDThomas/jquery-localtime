/*! jQuery localtime - v0.9.1 - 2014-01-11
* https://github.com/GregDThomas/jquery-localtime
* Copyright (c) 2014 Greg Thomas; Licensed Apache-2.0 */
(function ($) {
	"use strict";
	$.localtime = (function () {

		var formatList = {localtime: "yyyy-MM-dd HH:mm:ss" };

		var longMonths = ['January', 'February', 'March',
							'April', 'May', 'June',
							'July', 'August', 'September',
							'October', 'November', 'December'];

		var longDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

		var ordinals = ['th', 'st', 'nd', 'rd'];

		var amPmHour = function (hour) {
			return (hour >= 13) ? (hour - 12) : ((hour === "0") ? 12 : hour);
		};

		var formatLocalDateTime = function (objDate, timeFormat) {
			// Note that some fields are stored strings, as we slice and/or add a "0" prefix in some cases.
			var year = objDate.getFullYear().toString();
			var month = (objDate.getMonth() + 1).toString();
			var date = objDate.getDate().toString();
			var dow = objDate.getDay();
			var hour = objDate.getHours().toString();
			var minute = objDate.getMinutes().toString();
			var second = objDate.getSeconds().toString();
			var millisecond = objDate.getMilliseconds().toString();
			var tzOffset = objDate.getTimezoneOffset();
			var tzSign = (tzOffset > 0) ? "-" : "+";
			tzOffset = Math.abs(tzOffset);

			// If we don't have a format, pick one from the selection
			if (timeFormat === undefined) {
				var cssClass;
				for (cssClass in formatList) {
					if (formatList.hasOwnProperty(cssClass)) {
						timeFormat = formatList[cssClass];
						break;
					}
				}
				// If we still don't have one, do whatever the browser does!
				if (timeFormat === undefined) {
					return objDate.toString();
				}
			}

			// Parse the format string, one char at a time
			var formattedDate = "", pattern = "";
			for( var i = 0;  i < timeFormat.length; i ++) {
				pattern += timeFormat.charAt(i);
				// Do we have a literal?
				if( pattern === "'" ) {
					i ++;
					for( ; i < timeFormat.length; i ++ ) {
						var literalChar = timeFormat.charAt(i);
						if( literalChar === "'" ) {
							// End the literal
							pattern = "";
							break;
						}
						formattedDate += literalChar;
					}
				// Do we have an escaped single quote?
				} else if( pattern === "\\" &&
							i < (timeFormat.length-1) &&
							timeFormat.charAt(i+1) === "'" ) {
					i ++;
					formattedDate += "'";
					pattern = "";
				} else {
					// Have we reached the end of the pattern?
					if (i === timeFormat.length - 1 || timeFormat.charAt(i) !== timeFormat.charAt(i + 1)) {
						// Display something based on the pattern
						switch (pattern) {
							case "d": formattedDate += date; break;
							case "dd": formattedDate += ("0" + date).slice(-2); break;
							case "ddd": formattedDate += longDays[dow].substr(0, 3); break;
							case "ddddd": formattedDate += longDays[dow]; break;
							case "M": formattedDate += month; break;
							case "MM": formattedDate += ("0" + month).slice(-2); break;
							case "MMM": formattedDate += longMonths[month - 1].substr(0, 3); break;
							case "MMMMM": formattedDate += longMonths[month - 1]; break;
							case "yy": formattedDate += year.slice(-2); break;
							case "yyyy": formattedDate += year; break;
							case "H": formattedDate += hour; break;
							case "HH": formattedDate += ("0" + hour).slice(-2); break;
							case "h": formattedDate += amPmHour(hour); break;
							case "hh": formattedDate += ("0" + amPmHour(hour)).slice(-2); break;
							case "m": formattedDate += minute; break;
							case "mm": formattedDate += ("0" + minute).slice(-2); break;
							case "s": formattedDate += second; break;
							case "ss": formattedDate += ("0" + second).slice(-2); break;
							case "S": formattedDate += millisecond; break;
							case "SS": formattedDate += ("0" + millisecond).slice(-2); break;
							case "SSS": formattedDate += ("00" + millisecond).slice(-3); break;
							case "o":
								switch( date ) {
									// Special cases
									case '11':
									case '12':
									case '13':
										formattedDate += ordinals[0];
										break;
									default:
										var ordinalIndex = (date % 10);
										if( ordinalIndex > 3 ) {
											ordinalIndex = 0;
										}
										formattedDate += ordinals[ordinalIndex];
										break;
								}
								break;
							case "a":
							case "TT": formattedDate += (hour >= 12) ? "PM" : "AM"; break;
							case "tt": formattedDate += (hour >= 12) ? "pm" : "am"; break;
							case "T": formattedDate += (hour >= 12) ? "P" : "A"; break;
							case "t": formattedDate += (hour >= 12) ? "p" : "a"; break;
							case "z":
								formattedDate += tzSign + parseInt(tzOffset / 60, 10);
								break;
							case "zz":
								formattedDate += tzSign + ("0" + parseInt(tzOffset / 60, 10)).slice(-2);
								break;
							case "zzz":
								formattedDate += tzSign + ("0" + parseInt(tzOffset / 60, 10)).slice(-2) + ":" + ("0" + tzOffset % 60).slice(-2);
								break;
							default:
								formattedDate += pattern;
								break;
						}
						// Reset the pattern
						pattern = "";
					}
				}
			}
			return formattedDate;
		};

		return {

			setFormat: function (format) {
				if (typeof format === "object") {
					formatList = format;
				} else {
					formatList = { localtime :  format };
				}
			},

			getFormat: function () {
				return formatList;
			},

			parseISOTimeString: function (isoTimeString) {
				isoTimeString = $.trim(isoTimeString.toString());
							// 2013-02-17 14:28:10.123Z
                            // 1:yyyy  2:MM     3:dd          4:HH      5:mm         6:ss          7:SSS
				var fields = /^(\d{4})-([01]\d)-([0-3]\d)[T| ]([0-2]\d):([0-5]\d)(?::([0-5]\d)(?:\.(\d{3}))?)?Z$/.exec(isoTimeString);
				if( fields ) {
					var year = parseInt(fields[1], 10);
					var month = parseInt(fields[2], 10) - 1;
					var dayOfMonth = parseInt(fields[3], 10);
					var hour = parseInt(fields[4], 10);
					var minute = parseInt(fields[5], 10);
					var second = (fields[6] ? parseInt(fields[6], 10) : 0 );
					var millisecond = (fields[7] ? parseInt(fields[7], 10) : 0 );

					var objDate = new Date(Date.UTC(year, month, dayOfMonth, hour, minute, second, millisecond));

					// Now check for invalid dates - e.g. 30 of Feb, 31 of Sep
					if( objDate.getUTCFullYear() !== year ||
						objDate.getUTCMonth() !== month ||
						objDate.getUTCDate() !== dayOfMonth ) {
						throw new Error(fields[1] + "-" + fields[2] + "-" + fields[3] + " is not a valid date");
					}

					// And invalid times - e.g. 25:40 - NB minutes, seconds and milliseconds are constrained by the regex
					if( objDate.getUTCHours() !== hour ) {
						throw new Error(fields[4] + ":" + fields[5] + " is not a valid time");
					}

					return objDate;
				} else {
					throw new Error(isoTimeString + " is not a supported date/time string");
				}
			},

			toLocalTime: function (timeField, timeFormat) {
				if( Object.prototype.toString.call(timeField) !== '[object Date]' ) {
					timeField = $.localtime.parseISOTimeString(timeField);
				}
				if( timeFormat === '' ) {
					timeFormat = undefined;
				}
				return formatLocalDateTime(timeField, timeFormat);
			},

			formatObject: function( object, format ) {
				if (object.is(':input')) {
					object.val($.localtime.toLocalTime(object.val(), format));
				} else if (object.is('time') ) {
					object.text($.localtime.toLocalTime(object.attr('datetime'), format));
				} else {
					object.text($.localtime.toLocalTime(object.text(), format));
				}
			},

			// Deprecated! Use format() instead
			formatPage: function() {
				$.localtime.format();
			},

			format: function( scope ) {
				// First, the class-based format
				var format;
				var localiseByClass = function () {
					$.localtime.formatObject( $(this), format );
				};
				var formats = $.localtime.getFormat();
				var cssClass;
				for (cssClass in formats) {
					if (formats.hasOwnProperty(cssClass)) {
						format = formats[cssClass];
						$("." + cssClass, scope).each(localiseByClass);
					}
				}

				// Then, the data-based format
				$('[data-localtime-format]', scope).each( function () {
					$.localtime.formatObject( $(this), $(this).attr('data-localtime-format') );
				});
			}
		};
	}());
}(jQuery));

jQuery(document).ready(function ($) {
	"use strict";
	$.localtime.format();
});