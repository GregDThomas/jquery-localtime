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
	});
	test("Parse with seconds", function() {
		deepEqual( new Date( Date.UTC(2011,0,3,13,39,30,0) ), $.localtime.parseISOTimeString("2011-01-03 13:39:30Z"), "Seconds only present" );
	});
	test("Parse with milliseconds", function() {
		deepEqual( new Date( Date.UTC(2011,0,3,13,39,30,300) ), $.localtime.parseISOTimeString("2011-01-03 13:39:30.300Z"), "Milliseconds present" );
	});
	test("Parse with milliseconds and space", function() {
		deepEqual( new Date( Date.UTC(2011,0,3,13,39,30,300) ), $.localtime.parseISOTimeString("  2011-01-03 13:39:30.300Z  "), "Milliseconds and spaces present" );
	});
	test("Parse with milliseconds and whitespace", function() {
		deepEqual( new Date( Date.UTC(2011,0,3,13,39,30,300) ), $.localtime.parseISOTimeString("\n2011-01-03 13:39:30.300Z\n"), "Milliseconds and whitespace present" );
	});
	test("Bad length", function() {
		raises( function() { $.localtime.parseISOTimeString("foobar"); }, Error, "Invalid length" );
	});
	test("Bad year", function() {
		raises( function() { $.localtime.parseISOTimeString("YYYY-01-03 13:39:30.300Z"); }, Error, "Invalid year" );
	});
	test("Bad month", function() {
		raises( function() { $.localtime.parseISOTimeString("2011-MM-03 13:39:30.300Z"); }, Error, "Invalid month" );
		raises( function() { $.localtime.parseISOTimeString("2011-13-03 13:39:30.300Z"); }, "Invalid month - too large" );
	});
	test("Bad day", function() {
		raises( function() { $.localtime.parseISOTimeString("2011-01-dd 13:39:30.300Z"); }, Error, "Invalid day" );
		raises( function() { $.localtime.parseISOTimeString("2011-01-32 13:39:30.300Z"); }, Error, "Invalid day - too large" );
	});
	test("Bad minute", function() {
		raises( function() { $.localtime.parseISOTimeString("2011-01-03 13:hh:30.300Z"); }, Error, "Invalid hour" );
		raises( function() { $.localtime.parseISOTimeString("2011-01-03 13:61:30.300Z"); }, Error, "Invalid hour - too large" );
	});
	test("Bad hour", function() {
		raises( function() { $.localtime.parseISOTimeString("2011-01-03 13:39:mm.300Z"); }, Error, "Invalid minute" );
		raises( function() { $.localtime.parseISOTimeString("2011-01-03 13:39:61.300Z"); }, Error, "Invalid minute - too large" );
	});
	test("Bad millisecond", function() {
		raises( function() { $.localtime.parseISOTimeString("2011-01-03 13:39:30.sssZ"); }, Error, "Invalid millisecond" );
	});

	module("Date/time formats");
	test("Day formats", function() {
		$.localtime.setFormat("d");
		equal("3", $.localtime.toUTCTime("2011-01-03 13:39:30.300Z") );
		$.localtime.setFormat("dd");
		equal("03", $.localtime.toUTCTime("2011-01-03 13:39:30.300Z") );
	});
	test("Month formats", function() {
		$.localtime.setFormat("M");
		equal("1", $.localtime.toUTCTime("2011-01-03 13:39:30.300Z") );
		$.localtime.setFormat("MM");
		equal("01", $.localtime.toUTCTime("2011-01-03 13:39:30.300Z") );
		$.localtime.setFormat("MMM");
		equal("Jan", $.localtime.toUTCTime("2011-01-03 13:39:30.300Z") );
		equal("Feb", $.localtime.toUTCTime("2011-02-03 13:39:30.300Z") );
		equal("Mar", $.localtime.toUTCTime("2011-03-03 13:39:30.300Z") );
		equal("Apr", $.localtime.toUTCTime("2011-04-03 13:39:30.300Z") );
		equal("May", $.localtime.toUTCTime("2011-05-03 13:39:30.300Z") );
		equal("Jun", $.localtime.toUTCTime("2011-06-03 13:39:30.300Z") );
		equal("Jul", $.localtime.toUTCTime("2011-07-03 13:39:30.300Z") );
		equal("Aug", $.localtime.toUTCTime("2011-08-03 13:39:30.300Z") );
		equal("Sep", $.localtime.toUTCTime("2011-09-03 13:39:30.300Z") );
		equal("Oct", $.localtime.toUTCTime("2011-10-03 13:39:30.300Z") );
		equal("Nov", $.localtime.toUTCTime("2011-11-03 13:39:30.300Z") );
		equal("Dec", $.localtime.toUTCTime("2011-12-03 13:39:30.300Z") );
		$.localtime.setFormat("MMMMM");
		equal("January", $.localtime.toUTCTime("2011-01-03 13:39:30.300Z") );
		equal("February", $.localtime.toUTCTime("2011-02-03 13:39:30.300Z") );
		equal("March", $.localtime.toUTCTime("2011-03-03 13:39:30.300Z") );
		equal("April", $.localtime.toUTCTime("2011-04-03 13:39:30.300Z") );
		equal("May", $.localtime.toUTCTime("2011-05-03 13:39:30.300Z") );
		equal("June", $.localtime.toUTCTime("2011-06-03 13:39:30.300Z") );
		equal("July", $.localtime.toUTCTime("2011-07-03 13:39:30.300Z") );
		equal("August", $.localtime.toUTCTime("2011-08-03 13:39:30.300Z") );
		equal("September", $.localtime.toUTCTime("2011-09-03 13:39:30.300Z") );
		equal("October", $.localtime.toUTCTime("2011-10-03 13:39:30.300Z") );
		equal("November", $.localtime.toUTCTime("2011-11-03 13:39:30.300Z") );
		equal("December", $.localtime.toUTCTime("2011-12-03 13:39:30.300Z") );
	});
	test("Year formats", function() {
		$.localtime.setFormat("yy");
		equal("11", $.localtime.toUTCTime("2011-01-03 13:39:30.300Z") );
		$.localtime.setFormat("yyyy");
		equal("2011", $.localtime.toUTCTime("2011-01-03 13:39:30.300Z") );
	});
	test("Hour formats", function() {
		$.localtime.setFormat("H");
		equal("3", $.localtime.toUTCTime("2011-01-03 03:39:30.300Z") );
		$.localtime.setFormat("HH");
		equal("03", $.localtime.toUTCTime("2011-01-03 03:39:30.300Z") );
	});
	test("Minute formats", function() {
		$.localtime.setFormat("m");
		equal("3", $.localtime.toUTCTime("2011-01-03 13:03:30.300Z") );
		$.localtime.setFormat("mm");
		equal("03", $.localtime.toUTCTime("2011-01-03 13:03:30.300Z") );
	});
	test("Second formats", function() {
		$.localtime.setFormat("s");
		equal("3", $.localtime.toUTCTime("2011-01-03 13:39:03.300Z") );
		$.localtime.setFormat("ss");
		equal("03", $.localtime.toUTCTime("2011-01-03 13:39:03.300Z") );
	});
	test("Millisecond formats", function() {
		$.localtime.setFormat("S");
		equal("3", $.localtime.toUTCTime("2011-01-03 13:39:30.003Z") );
		$.localtime.setFormat("SS");
		equal("03", $.localtime.toUTCTime("2011-01-03 13:39:30.003Z") );
		$.localtime.setFormat("SSS");
		equal("003", $.localtime.toUTCTime("2011-01-03 13:39:30.003Z") );
	});
	test("Timezone offset formats", function() {
		$.localtime.setFormat("z");
		equal("+0", $.localtime.toUTCTime("2011-01-03 13:39:30.003Z") );
		$.localtime.setFormat("zz");
		equal("+00", $.localtime.toUTCTime("2011-01-03 13:39:30.003Z") );
		$.localtime.setFormat("zzz");
		equal("+00:00", $.localtime.toUTCTime("2011-01-03 13:39:30.003Z") );
	});
	test("12 hr format", function() {
		$.localtime.setFormat("h");
		equal("3", $.localtime.toUTCTime("2011-01-03 03:39:30.003Z") );
		equal("11", $.localtime.toUTCTime("2011-01-03 23:39:30.003Z") );
		equal("12", $.localtime.toUTCTime("2011-01-03 00:39:30.003Z") );
		equal("3", $.localtime.toUTCTime("2011-01-03 03:39:30.003Z") );
		equal("11", $.localtime.toUTCTime("2011-01-03 11:39:30.003Z") );
		equal("12", $.localtime.toUTCTime("2011-01-03 12:39:30.003Z") );
		equal("1", $.localtime.toUTCTime("2011-01-03 13:39:30.003Z") );
		$.localtime.setFormat("hh");
		equal("03", $.localtime.toUTCTime("2011-01-03 03:39:30.003Z") );
		equal("11", $.localtime.toUTCTime("2011-01-03 23:39:30.003Z") );
		equal("12", $.localtime.toUTCTime("2011-01-03 00:39:30.003Z") );
		equal("03", $.localtime.toUTCTime("2011-01-03 03:39:30.003Z") );
		equal("11", $.localtime.toUTCTime("2011-01-03 11:39:30.003Z") );
		equal("12", $.localtime.toUTCTime("2011-01-03 12:39:30.003Z") );
		equal("01", $.localtime.toUTCTime("2011-01-03 13:39:30.003Z") );
	});
	test("AM/PM format 1", function() {
		$.localtime.setFormat("a");
		equal("AM", $.localtime.toUTCTime("2011-01-03 08:39:30.003Z") );
		equal("PM", $.localtime.toUTCTime("2011-01-03 16:39:30.003Z") );
	});
	test("AM/PM format 2", function() {
		$.localtime.setFormat("t");
		equal("A", $.localtime.toUTCTime("2011-01-03 08:39:30.003Z") );
		equal("P", $.localtime.toUTCTime("2011-01-03 16:39:30.003Z") );
		$.localtime.setFormat("tt");
		equal("AM", $.localtime.toUTCTime("2011-01-03 08:39:30.003Z") );
		equal("PM", $.localtime.toUTCTime("2011-01-03 16:39:30.003Z") );
	});
	test("Literals", function() {
		// Regular case
		$.localtime.setFormat("dd MMMMM 'at' HH:mm");
		equal("03 January at 08:39", $.localtime.toUTCTime("2011-01-03 08:39:30.003Z") );
		// Escapes
		$.localtime.setFormat("h 'o'\\''clock'");
		equal("4 o'clock", $.localtime.toUTCTime("2011-01-03 16:39:30.003Z") );
		// Edge case - start
		$.localtime.setFormat("\\'hh");
		equal("'04", $.localtime.toUTCTime("2011-01-03 16:39:30.003Z") );
		// Edge case - end
		$.localtime.setFormat("hh \\'");
		equal("04 '", $.localtime.toUTCTime("2011-01-03 16:39:30.003Z") );
	});
	test("Ordinals", function() {
		// Regular case
		$.localtime.setFormat("do");
		equal("1st", $.localtime.toUTCTime("2011-01-01 08:39:30.003Z") );
		equal("2nd", $.localtime.toUTCTime("2011-01-02 08:39:30.003Z") );
		equal("3rd", $.localtime.toUTCTime("2011-01-03 08:39:30.003Z") );
		equal("4th", $.localtime.toUTCTime("2011-01-04 08:39:30.003Z") );
		equal("5th", $.localtime.toUTCTime("2011-01-05 08:39:30.003Z") );
		equal("10th", $.localtime.toUTCTime("2011-01-10 08:39:30.003Z") );
		equal("11th", $.localtime.toUTCTime("2011-01-11 08:39:30.003Z") );
		equal("12th", $.localtime.toUTCTime("2011-01-12 08:39:30.003Z") );
		equal("13th", $.localtime.toUTCTime("2011-01-13 08:39:30.003Z") );
		equal("14th", $.localtime.toUTCTime("2011-01-14 08:39:30.003Z") );
		equal("20th", $.localtime.toUTCTime("2011-01-20 08:39:30.003Z") );
		equal("21st", $.localtime.toUTCTime("2011-01-21 08:39:30.003Z") );
		equal("22nd", $.localtime.toUTCTime("2011-01-22 08:39:30.003Z") );
		equal("23rd", $.localtime.toUTCTime("2011-01-23 08:39:30.003Z") );
		equal("24th", $.localtime.toUTCTime("2011-01-24 08:39:30.003Z") );
	});
}(jQuery));
