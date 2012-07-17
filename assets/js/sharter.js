(function( sharter, $, undefined ) {

	var sharts = [];
	var currentIndex = 0;
	var feedUrl = 'http://ohwp.tumblr.com/api/read/json';

	sharter.shartElement = null;

	sharter.init = function() {
		console.log('sharter.init()');
		
		sharter.shartElement = $('.sharts article')[0];

		fillPants();
	};

	sharter.sharts = function() {
		return sharts;
	};

	sharter.insertShart = function(quote, source) {
		console.log('insertShart: ' + quote);
		sharts.push({water: source, solids: quote});
	};

	sharter.wipe = function() {
		$(sharter.shartElement).animate(
			{left: -2000},
			1000,
			'easeInBack',
			function() {
				$(sharter.shartElement).css('left','2000px');
				$(sharter.shartElement).find('header').css('opacity', '0');
				sharter.showNext();
			}
		);
	};

	sharter.showNext = function() {
		if (currentIndex < sharts.length - 1) {
			currentIndex++;
		} else {
			currentIndex = 0;
		}

		showEm();
	};

	// Private, don't look

	function fillPants() {
		console.log('sharter.fillPants()');

		$.ajax({
		 	url: feedUrl,
		 	dataType: 'jsonp',
		 	jsonpCallback: 'sharterCallback',
		 	success: function(data, status, xhr) {
		 		data.posts.sort(function() {
		 			return 0.5 - Math.random();
		 		});

		 		$.each(data.posts, function(index, post) {
		 			console.log(post);
		 			sharter.insertShart(post['quote-text'], post['quote-source']);
		 		});
		 		sharter.showNext();
		 	}
		});
	};

	function showEm() {
		console.log('sharter.showEm()');

		$(sharter.shartElement).find('header').first().html(sharts[currentIndex].water);
		$(sharter.shartElement).find('span').first().html(sharts[currentIndex].solids);

		$(sharter.shartElement).animate(
			{left: 0},
			1000,
			'easeOutBack',
			function() {
				$(sharter.shartElement).find('header').animate(
					{opacity: 1.0},
					1000
				);
				setTimeout("sharter.wipe()", 5000);
			}
		);
	};

}( window.sharter = window.sharter || {}, jQuery));