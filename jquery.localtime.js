/*
 * jQuery localtime plugin
 *
 * Copyright (c) 2010 Greg Thomas
 */
 
 /* Note; the following two lines imform JSLint - http://www.jslint.com/ - that this is supposed
  *	to run within a browser, and that the jQuery variable is defined elsewhere 
  */
  
 /*jslint browser: true */
 /*global jQuery: true */
(function ($) {
	$.localtime = ( function () {

		var _format = "yyyy-MM-dd HH:mm:ss";

		var getUnsignedInteger = function( stringToParse ) {
			if( stringToParse.toString().search(/^[0-9]+$/) !== 0) {
				throw new Error( "'" + stringToParse + "' is not an integer" );
			}
			return parseInt( stringToParse, 10 );
		};

		var longMonths = ['January','February','March',
							'April','May','June',
							'July','August','September',
							'October','November','December'];

		var getUTCFields = function( objDate ) {
			var year = objDate.getUTCFullYear();
			var month = objDate.getUTCMonth() + 1;
			var date = objDate.getUTCDate();
			var hour = objDate.getUTCHours();
			var minute = objDate.getUTCMinutes();
			var second = objDate.getUTCSeconds();
			var millisecond = objDate.getUTCMilliseconds();
			return [year, month, date, hour, minute, second, millisecond, 0];
		};

		var getLocalFields = function( objDate ) {
			var year = objDate.getFullYear();
			var month = objDate.getMonth() + 1;
			var date = objDate.getDate();
			var hour = objDate.getHours();
			var minute = objDate.getMinutes();
			var second = objDate.getSeconds();
			var millisecond = objDate.getMilliseconds();
			var tzOffset = objDate.getTimezoneOffset();
			return [year, month, date, hour, minute, second, millisecond, tzOffset];
		};

		var formatDateTime = function( dateFields, timeFormat ) {

			var year = dateFields[0].toString();
			var month = dateFields[1].toString();
			var date = dateFields[2].toString();
			var hour = dateFields[3].toString();
			var minute = dateFields[4].toString();
			var second = dateFields[5].toString();
			var millisecond = dateFields[6].toString();
			var tzOffset = dateFields[7];
			var tzSign = (tzOffset < 0) ? "-" : "+";
			tzOffset = Math.abs(tzOffset);

			// Parse the format string, one char at a time
			if( timeFormat === undefined ) {
				timeFormat = _format;
			}
			var formattedDate = "", pattern = "";
			for( var i = 0;  i < timeFormat.length; i ++ ) {
				pattern += timeFormat.charAt( i );
				// Have we reached the end of the pattern?
				if( i == timeFormat.length-1 || timeFormat.charAt( i ) != timeFormat.charAt( i + 1 ) ) {
					// Display something based on the pattern
					switch( pattern ) {
						case "d": formattedDate += date; break;
						case "dd": formattedDate += ("0" + date).slice(-2); break;
						case "M": formattedDate += month; break;
						case "MM":formattedDate += ("0" + month).slice(-2); break;
						case "MMM": formattedDate += longMonths[month-1].substr(0,3); break;
						case "MMMMM": formattedDate += longMonths[month-1]; break;
						case "yy": formattedDate += year.slice(-2); break;
						case "yyyy": formattedDate += year; break;
						case "H": formattedDate += hour; break;
						case "HH": formattedDate += ("0"+hour).slice(-2); break;
						case "m": formattedDate += minute; break;
						case "mm": formattedDate += ("0"+minute).slice(-2); break;
						case "s": formattedDate += second; break;
						case "ss": formattedDate += ("0"+second).slice(-2); break;
						case "S": formattedDate += millisecond; break;
						case "SS": formattedDate += ("0"+millisecond).slice(-2); break;
						case "SSS": formattedDate += ("00"+millisecond).slice(-3); break;
						case "z": formattedDate += tzSign + parseInt( tzOffset / 60, 10 ); break;
						case "zz": formattedDate += tzSign + ("0"+parseInt( tzOffset / 60, 10 )).slice(-2); break;
						case "zzz": formattedDate += tzSign +
														("0"+parseInt( tzOffset / 60, 10 )).slice(-2) +
														":" +
														("0"+ tzOffset % 60 ).slice(-2); 
														break;
						default: formattedDate += pattern;
					}
					// Reset the pattern
					pattern = "";
				}
			}
			return formattedDate;

		};

		var formatUTCDateTime = function( dateToFormat, timeFormat ) {
			return formatDateTime( getUTCFields( dateToFormat), timeFormat );
		};

		var formatLocalDateTime = function( dateToFormat, timeFormat ) {
			return formatDateTime( getLocalFields( dateToFormat, timeFormat ) );
		};

		return {

			setFormat: function( format ) {
				_format = format;
			},

			parseISOTimeString: function( isoTimeString ) {
				isoTimeString = isoTimeString.toString();
				// Are we using UTC or local time? UTC ends in "Z"
				var isUTC = isoTimeString.charAt( isoTimeString.length - 1 ) == "Z";
				// Strip the trailing Z, if necessary
				if( isUTC ) {
					isoTimeString = isoTimeString.substr( 0, isoTimeString.length - 1 );
				}
				// Do we have seconds or milliseconds?
				var hasSeconds, hasMilliseconds;
				switch( isoTimeString.length ) {
					case 23:
						hasMilliseconds = true;
						hasSeconds = true;
						break;
					case 19:
						hasMilliseconds = false;
						hasSeconds = true;
						break;
					case 16:
						hasMilliseconds = false;
						hasSeconds = false;
						break;
					default:
						throw new Error( isoTimeString + " is not a supported date/time string" );
				}

				var year = getUnsignedInteger( isoTimeString.substr( 0, 4 ) );
				var month = getUnsignedInteger( isoTimeString.substr( 5, 2 ) );
				if( month > 12 ) { throw new Error(month + " is not a valid month"); }
				var dayOfMonth = getUnsignedInteger( isoTimeString.substr( 8, 2 ) );
				if( dayOfMonth > 31 ) { throw new Error(dayOfMonth + " is not a valid day"); }
				var hour = getUnsignedInteger( isoTimeString.substr( 11, 2 ) );
				if( hour > 23 ) { throw new Error(hour + " is not a valid hour"); }
				var minute = getUnsignedInteger( isoTimeString.substr( 14, 2 ) );
				if( minute > 59 ) { throw new Error(minute + " is not a valid minute"); }
				var second = ( hasSeconds ? getUnsignedInteger( isoTimeString.substr( 17, 2 ) ) : 0 );
				if( second > 59 ) { throw new Error(second + " is not a valid second"); }
				var millisecond = ( hasMilliseconds ? getUnsignedInteger( isoTimeString.substr( 20, 3 ) ) : 0 );

				var objDate = new Date( 2000, 0, 15);
				if( isUTC ) {
					objDate.setUTCFullYear( year );
					objDate.setUTCMonth( month-1 );
					objDate.setUTCDate( dayOfMonth );
					objDate.setUTCHours( hour );
					objDate.setUTCMinutes( minute );
					objDate.setUTCSeconds( second );
					objDate.setUTCMilliseconds( millisecond );
				} else {
					objDate.setFullYear( year );
					objDate.setMonth( month-1 );
					objDate.setDate( dayOfMonth );
					objDate.setHours( hour );
					objDate.setMinutes( minute );
					objDate.setSeconds( second );
					objDate.setMilliseconds( millisecond );
				}

				return objDate;
			},

			toUTCTime: function( timeString, timeFormat ) {
				return formatUTCDateTime( $.localtime.parseISOTimeString( timeString ), timeFormat );

			},

			toLocalTime: function( timeString, timeFormat ) {
				return formatLocalDateTime( $.localtime.parseISOTimeString( timeString ), timeFormat );
			}
		};
	}());
}(jQuery));

jQuery(document).ready(function () {
    jQuery(".localtime").each(function (idx, elem) {
        if (jQuery(elem).is(":input")) {
            jQuery(elem).val(jQuery.localtime.toLocalTime(jQuery(elem).val()));
        } else {
            jQuery(elem).text(jQuery.localtime.toLocalTime(jQuery(elem).text()));
        }
    });
});