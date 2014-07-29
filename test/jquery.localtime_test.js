(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */
/*global raises */
	module( "Limited ISO 8601 parsing" );

	test("Parse no seconds", function() {
		deepEqual( new Date( Date.UTC(2011,0,3,13,39,0,0) ), $.localtime.parseISOTimeString("2011-01-03 13:39Z"), "No seconds present" );
		deepEqual( new Date( Date.UTC(2011,0,3,13,39,0,0) ), $.localtime.parseISOTimeString("2011-01-03T13:39Z"), "No seconds present" );
	});
	test("Parse with seconds", function() {
		deepEqual( new Date( Date.UTC(2011,0,3,13,39,30,0) ), $.localtime.parseISOTimeString("2011-01-03 13:39:30Z"), "Seconds only present" );
		deepEqual( new Date( Date.UTC(2011,0,3,13,39,30,0) ), $.localtime.parseISOTimeString("2011-01-03T13:39:30Z"), "Seconds only present" );
	});
	test("Parse with milliseconds", function() {
		deepEqual( new Date( Date.UTC(2011,0,3,13,39,30,300) ), $.localtime.parseISOTimeString("2011-01-03 13:39:30.300Z"), "Milliseconds present" );
		deepEqual( new Date( Date.UTC(2011,0,3,13,39,30,300) ), $.localtime.parseISOTimeString("2011-01-03T13:39:30.300Z"), "Milliseconds present" );
	});
	test("Parse with milliseconds and space", function() {
		deepEqual( new Date( Date.UTC(2011,0,3,13,39,30,300) ), $.localtime.parseISOTimeString("  2011-01-03 13:39:30.300Z  "), "Milliseconds and spaces present" );
		deepEqual( new Date( Date.UTC(2011,0,3,13,39,30,300) ), $.localtime.parseISOTimeString("  2011-01-03T13:39:30.300Z  "), "Milliseconds and spaces present" );
	});
	test("Parse with milliseconds and whitespace", function() {
		deepEqual( new Date( Date.UTC(2011,0,3,13,39,30,300) ), $.localtime.parseISOTimeString("\n2011-01-03 13:39:30.300Z\n"), "Milliseconds and whitespace present" );
		deepEqual( new Date( Date.UTC(2011,0,3,13,39,30,300) ), $.localtime.parseISOTimeString("\n2011-01-03T13:39:30.300Z\n"), "Milliseconds and whitespace present" );
	});

	module("Testing bad dates");
	test("Bad length", function() {
		raises( function() { $.localtime.parseISOTimeString("foobar"); }, Error, "Invalid length" );
	});
	test("Bad year", function() {
		raises( function() { $.localtime.parseISOTimeString("YYYY-01-03 13:39:30.300Z"); }, Error, "Invalid year" );
	});
	test("Bad month", function() {
		raises( function() { $.localtime.parseISOTimeString("2011-MM-03 13:39:30.300Z"); }, Error, "Invalid month" );
		raises( function() { $.localtime.parseISOTimeString("2011-13-03 13:39:30.300Z"); }, Error, "Invalid month - too large" );
	});
	test("Bad day", function() {
		raises( function() { $.localtime.parseISOTimeString("2011-01-dd 13:39:30.300Z"); }, Error, "Invalid day" );
		raises( function() { $.localtime.parseISOTimeString("2011-01-32 13:39:30.300Z"); }, Error, "Invalid day - too large" );
		raises( function() { $.localtime.parseISOTimeString("2011-02-30 13:39:30.300Z"); }, Error, "Invalid day - too large" );
		raises( function() { $.localtime.parseISOTimeString("2011-09-31 13:39:30.300Z"); }, Error, "Invalid day - too large" );
	});
	test("Bad hour", function() {
		raises( function() { $.localtime.parseISOTimeString("2011-01-03 hh:39:30.300Z"); }, Error, "Invalid hour" );
		raises( function() { $.localtime.parseISOTimeString("2011-01-03 25:39:30.300Z"); }, Error, "Invalid hour - too large" );
	});
	test("Bad minute", function() {
		raises( function() { $.localtime.parseISOTimeString("2011-01-03 13:mm:30.300Z"); }, Error, "Invalid hour" );
		raises( function() { $.localtime.parseISOTimeString("2011-01-03 13:61:30.300Z"); }, Error, "Invalid hour - too large" );
	});
	test("Bad second", function() {
		raises( function() { $.localtime.parseISOTimeString("2011-01-03 13:39:mm.300Z"); }, Error, "Invalid second" );
		raises( function() { $.localtime.parseISOTimeString("2011-01-03 13:39:61.300Z"); }, Error, "Invalid second - too large" );
	});
	test("Bad millisecond", function() {
		raises( function() { $.localtime.parseISOTimeString("2011-01-03 13:39:30.sssZ"); }, Error, "Invalid millisecond" );
	});

	module("Date/time formats");
	test("Day formats", function() {
		$.localtime.setFormat("d");
		equal("3", $.localtime.toLocalTime("2011-01-03 13:39:30.300Z") );
		$.localtime.setFormat("dd");
		equal("03", $.localtime.toLocalTime("2011-01-03 13:39:30.300Z") );
	});
	test("Long day formats", function() {
		$.localtime.setFormat("ddd");
		equal("Sun", $.localtime.toLocalTime("2011-01-02 13:39:30.300Z") );
		$.localtime.setFormat("ddddd");
		equal("Sunday", $.localtime.toLocalTime("2011-01-02 13:39:30.300Z") );
		$.localtime.setFormat("ddd");
		equal("Sat", $.localtime.toLocalTime("2014-01-11 13:39:30.300Z") );
		$.localtime.setFormat("ddddd");
		equal("Saturday", $.localtime.toLocalTime("2014-01-11 13:39:30.300Z") );
	});
	test("Month formats", function() {
		$.localtime.setFormat("M");
		equal("1", $.localtime.toLocalTime("2011-01-03 13:39:30.300Z") );
		$.localtime.setFormat("MM");
		equal("01", $.localtime.toLocalTime("2011-01-03 13:39:30.300Z") );
		$.localtime.setFormat("MMM");
		equal("Jan", $.localtime.toLocalTime("2011-01-03 13:39:30.300Z") );
		equal("Feb", $.localtime.toLocalTime("2011-02-03 13:39:30.300Z") );
		equal("Mar", $.localtime.toLocalTime("2011-03-03 13:39:30.300Z") );
		equal("Apr", $.localtime.toLocalTime("2011-04-03 13:39:30.300Z") );
		equal("May", $.localtime.toLocalTime("2011-05-03 13:39:30.300Z") );
		equal("Jun", $.localtime.toLocalTime("2011-06-03 13:39:30.300Z") );
		equal("Jul", $.localtime.toLocalTime("2011-07-03 13:39:30.300Z") );
		equal("Aug", $.localtime.toLocalTime("2011-08-03 13:39:30.300Z") );
		equal("Sep", $.localtime.toLocalTime("2011-09-03 13:39:30.300Z") );
		equal("Oct", $.localtime.toLocalTime("2011-10-03 13:39:30.300Z") );
		equal("Nov", $.localtime.toLocalTime("2011-11-03 13:39:30.300Z") );
		equal("Dec", $.localtime.toLocalTime("2011-12-03 13:39:30.300Z") );
		$.localtime.setFormat("MMMMM");
		equal("January", $.localtime.toLocalTime("2011-01-03 13:39:30.300Z") );
		equal("February", $.localtime.toLocalTime("2011-02-03 13:39:30.300Z") );
		equal("March", $.localtime.toLocalTime("2011-03-03 13:39:30.300Z") );
		equal("April", $.localtime.toLocalTime("2011-04-03 13:39:30.300Z") );
		equal("May", $.localtime.toLocalTime("2011-05-03 13:39:30.300Z") );
		equal("June", $.localtime.toLocalTime("2011-06-03 13:39:30.300Z") );
		equal("July", $.localtime.toLocalTime("2011-07-03 13:39:30.300Z") );
		equal("August", $.localtime.toLocalTime("2011-08-03 13:39:30.300Z") );
		equal("September", $.localtime.toLocalTime("2011-09-03 13:39:30.300Z") );
		equal("October", $.localtime.toLocalTime("2011-10-03 13:39:30.300Z") );
		equal("November", $.localtime.toLocalTime("2011-11-03 13:39:30.300Z") );
		equal("December", $.localtime.toLocalTime("2011-12-03 13:39:30.300Z") );
	});
	test("Year formats", function() {
		$.localtime.setFormat("yy");
		equal("11", $.localtime.toLocalTime("2011-01-03 13:39:30.300Z") );
		$.localtime.setFormat("yyyy");
		equal("2011", $.localtime.toLocalTime("2011-01-03 13:39:30.300Z") );
	});
	test("Hour formats", function() {
		$.localtime.setFormat("H");
		equal("3", $.localtime.toLocalTime("2011-01-03 03:39:30.300Z") );
		$.localtime.setFormat("HH");
		equal("03", $.localtime.toLocalTime("2011-01-03 03:39:30.300Z") );
	});
	test("Minute formats", function() {
		$.localtime.setFormat("m");
		equal("3", $.localtime.toLocalTime("2011-01-03 13:03:30.300Z") );
		$.localtime.setFormat("mm");
		equal("03", $.localtime.toLocalTime("2011-01-03 13:03:30.300Z") );
	});
	test("Second formats", function() {
		$.localtime.setFormat("s");
		equal("3", $.localtime.toLocalTime("2011-01-03 13:39:03.300Z") );
		$.localtime.setFormat("ss");
		equal("03", $.localtime.toLocalTime("2011-01-03 13:39:03.300Z") );
	});
	test("Millisecond formats", function() {
		$.localtime.setFormat("S");
		equal("3", $.localtime.toLocalTime("2011-01-03 13:39:30.003Z") );
		$.localtime.setFormat("SS");
		equal("03", $.localtime.toLocalTime("2011-01-03 13:39:30.003Z") );
		$.localtime.setFormat("SSS");
		equal("003", $.localtime.toLocalTime("2011-01-03 13:39:30.003Z") );
	});
	test("Timezone offset formats", function() {
		$.localtime.setFormat("z");
		equal("+0", $.localtime.toLocalTime("2011-01-03 13:39:30.003Z") );
		$.localtime.setFormat("zz");
		equal("+00", $.localtime.toLocalTime("2011-01-03 13:39:30.003Z") );
		$.localtime.setFormat("zzz");
		equal("+00:00", $.localtime.toLocalTime("2011-01-03 13:39:30.003Z") );

		var timezoneAbbrev = "";
		if ($.localtime.checkDaylightSavings(new Date())) {
			timezoneAbbrev = "BST";
		}
		else {
			timezoneAbbrev = "GMT";
		}

		$.localtime.setFormat("Z");
		equal(timezoneAbbrev, $.localtime.toLocalTime("2011-01-03 13:39:30.003Z") );
	});
	test("12 hr format", function() {
		$.localtime.setFormat("h");
		equal("3", $.localtime.toLocalTime("2011-01-03 03:39:30.003Z") );
		equal("11", $.localtime.toLocalTime("2011-01-03 23:39:30.003Z") );
		equal("12", $.localtime.toLocalTime("2011-01-03 00:39:30.003Z") );
		equal("3", $.localtime.toLocalTime("2011-01-03 03:39:30.003Z") );
		equal("11", $.localtime.toLocalTime("2011-01-03 11:39:30.003Z") );
		equal("12", $.localtime.toLocalTime("2011-01-03 12:39:30.003Z") );
		equal("1", $.localtime.toLocalTime("2011-01-03 13:39:30.003Z") );
		$.localtime.setFormat("hh");
		equal("03", $.localtime.toLocalTime("2011-01-03 03:39:30.003Z") );
		equal("11", $.localtime.toLocalTime("2011-01-03 23:39:30.003Z") );
		equal("12", $.localtime.toLocalTime("2011-01-03 00:39:30.003Z") );
		equal("03", $.localtime.toLocalTime("2011-01-03 03:39:30.003Z") );
		equal("11", $.localtime.toLocalTime("2011-01-03 11:39:30.003Z") );
		equal("12", $.localtime.toLocalTime("2011-01-03 12:39:30.003Z") );
		equal("01", $.localtime.toLocalTime("2011-01-03 13:39:30.003Z") );
	});
	test("AM/PM format 1", function() {
		$.localtime.setFormat("a");
		equal("AM", $.localtime.toLocalTime("2011-01-03 08:39:30.003Z") );
		equal("PM", $.localtime.toLocalTime("2011-01-03 16:39:30.003Z") );
	});
	test("AM/PM format 2", function() {
		$.localtime.setFormat("t");
		equal("a", $.localtime.toLocalTime("2011-01-03 08:39:30.003Z") );
		equal("p", $.localtime.toLocalTime("2011-01-03 16:39:30.003Z") );
		$.localtime.setFormat("tt");
		equal("am", $.localtime.toLocalTime("2011-01-03 08:39:30.003Z") );
		equal("pm", $.localtime.toLocalTime("2011-01-03 16:39:30.003Z") );
		$.localtime.setFormat("T");
		equal("A", $.localtime.toLocalTime("2011-01-03 08:39:30.003Z") );
		equal("P", $.localtime.toLocalTime("2011-01-03 16:39:30.003Z") );
		$.localtime.setFormat("TT");
		equal("AM", $.localtime.toLocalTime("2011-01-03 08:39:30.003Z") );
		equal("PM", $.localtime.toLocalTime("2011-01-03 16:39:30.003Z") );
	});
	test("Literals", function() {
		// Regular case
		$.localtime.setFormat("dd MMMMM 'at' HH:mm");
		equal("03 January at 08:39", $.localtime.toLocalTime("2011-01-03 08:39:30.003Z") );
		// Escapes
		$.localtime.setFormat("h 'o'\\''clock'");
		equal("4 o'clock", $.localtime.toLocalTime("2011-01-03 16:39:30.003Z") );
		// Edge case - start
		$.localtime.setFormat("\\'hh");
		equal("'04", $.localtime.toLocalTime("2011-01-03 16:39:30.003Z") );
		// Edge case - end
		$.localtime.setFormat("hh \\'");
		equal("04 '", $.localtime.toLocalTime("2011-01-03 16:39:30.003Z") );
	});
	test("Ordinals", function() {
		// Regular case
		$.localtime.setFormat("do");
		equal("1st", $.localtime.toLocalTime("2011-01-01 08:39:30.003Z") );
		equal("2nd", $.localtime.toLocalTime("2011-01-02 08:39:30.003Z") );
		equal("3rd", $.localtime.toLocalTime("2011-01-03 08:39:30.003Z") );
		equal("4th", $.localtime.toLocalTime("2011-01-04 08:39:30.003Z") );
		equal("5th", $.localtime.toLocalTime("2011-01-05 08:39:30.003Z") );
		equal("10th", $.localtime.toLocalTime("2011-01-10 08:39:30.003Z") );
		equal("11th", $.localtime.toLocalTime("2011-01-11 08:39:30.003Z") );
		equal("12th", $.localtime.toLocalTime("2011-01-12 08:39:30.003Z") );
		equal("13th", $.localtime.toLocalTime("2011-01-13 08:39:30.003Z") );
		equal("14th", $.localtime.toLocalTime("2011-01-14 08:39:30.003Z") );
		equal("20th", $.localtime.toLocalTime("2011-01-20 08:39:30.003Z") );
		equal("21st", $.localtime.toLocalTime("2011-01-21 08:39:30.003Z") );
		equal("22nd", $.localtime.toLocalTime("2011-01-22 08:39:30.003Z") );
		equal("23rd", $.localtime.toLocalTime("2011-01-23 08:39:30.003Z") );
		equal("24th", $.localtime.toLocalTime("2011-01-24 08:39:30.003Z") );
	});

	module("Test page re-writing");

	test("Defaults", function() {
		equal("2011-01-03 13:39:00", $('#testDefaultClassFormat').text());
		equal("2011-01-03 13:39:00", $('#testDefaultDataFormat').text());
	});

	test("Non defaults", function() {
		equal("3rd Jan 2011 at 13:39", $('#testNonDefaultDataFormat').text());
		// NB. Following is require to prevent the formatting be applied to already
		// formatted date/times
		$('[data-localtime-format]').removeAttr('data-localtime-format');
		$.localtime.setFormat({localtimeNonDefaultFormat:"do MMM yyyy 'at' HH:mm"});
		$.localtime.format();
		equal("3rd Jan 2011 at 13:39", $('#testNonDefaultClassFormat').text());
	});

	test("Dates and strings", function() {
		$.localtime.setFormat("do MMMMM yyyy 'at' hh:mm:ss.SSS tt zzz"); // Pretty much everything
		// We know parsing strings works OK, so ensure that passing in a date that matches the string is identical
		equal( $.localtime.toLocalTime(new Date( Date.UTC(2013,1,23,2,16,33,123) )), $.localtime.toLocalTime("2013-02-23 02:16:33.123Z") );
		equal( $.localtime.toLocalTime(new Date( Date.UTC(2011,0,3,13,39,30,300) )), $.localtime.toLocalTime("2011-01-03 13:39:30.300Z") );
	});

	module("Test scope limitation");

	test("Scope limitation by attribute", function() {
		// First, apply the attribute to the span's
		$('.testScopeAttribute').attr('data-localtime-format', "do MMM yyyy 'at' HH:mm");
		// Format only the inner div ...
		$.localtime.format('#innerScope');
		equal("2011-01-03T13:39Z", $('#outerSpanAttribute').text()); // Unchanged
		equal("3rd Jan 2011 at 13:39", $('#innerSpanAttribute').text()); // Formatted
	});

	test("Scope limitation by class", function() {
		// First, apply the attribute to the span's
		$.localtime.setFormat({localtime:"do MMM yyyy 'at' HH:mm"});
		$('.testScopeClass').addClass('localtime');
		// Format only the inner div ...
		$.localtime.format('#innerScope');
		equal("2011-01-03T13:39Z", $('#outerSpanClass').text()); // Unchanged
		equal("3rd Jan 2011 at 13:39", $('#innerSpanClass').text()); // Formatted
	});

	test("Default scope (whole page)", function() {
		// NB. Following is require to prevent the formatting be applied to already
		// formatted date/times
		$('[data-localtime-format]').removeAttr('data-localtime-format');
		$('*').removeClass('localtime');
		$.localtime.setFormat({localtime:"do MMM yyyy 'at' HH:mm"});
		$('.testScopeAttribute').attr('data-localtime-format', "do MMM yyyy 'at' HH:mm");
		$('.testScopeClass').addClass('localtime');
		$.localtime.format();
		equal("3rd Jan 2011 at 13:39", $('#outerSpanAttribute').text());
		equal("3rd Jan 2011 at 13:39", $('#innerSpanAttribute').text());
		equal("3rd Jan 2011 at 13:39", $('#outerSpanClass').text());
		equal("3rd Jan 2011 at 13:39", $('#innerSpanClass').text());
	});

	test("time tags", function() {
		equal($('#timeTagTestDefault').text(), "2011-01-03 13:39:00");
		equal($('#timeTagTestNonDefault').text(), "3rd Jan 2011 1:39pm");
	});

	module("Daylight Savings Time");

	test("Check if daylight Savings Time is in effect", function() {
		equal(false, $.localtime.checkDaylightSavings(new Date(2014, 0, 1)));
		equal(true,  $.localtime.checkDaylightSavings(new Date(2014, 6, 1)));
	});
}(jQuery));
