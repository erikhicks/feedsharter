(function( sharter, $, undefined ) {

	var sharts = [];
	var currentIndex = 0;
	var feedUrl = 'http://ohwp.tumblr.com/api/read/json?num=1000';

	sharter.shartElement = null;

	sharter.init = function() {
		sharter.shartElement = $('.sharts article')[0];

		fillPants();
	};

	sharter.sharts = function() {
		return sharts;
	};

	sharter.insertShart = function(quote, source) {
		sharts.push({author: source, solids: quote});
	};

	sharter.wipe = function() {
		$('.sharts .author').animate(
			{opacity: 0},
			500, function() {
					$(sharter.shartElement).animate(
						{left: -2000, opacity: 0},
						1000,
						'easeInBack',
						function() {
							$(sharter.shartElement).css('left','2000px');
							$(sharter.shartElement).find('header').css('opacity', '0');
							sharter.showNext();
						}
					);
			}
		);
	};

	sharter.showNext = function() {
		showEm();

		if (currentIndex < sharts.length - 1) {
			currentIndex++;
		} else {
			currentIndex = 0;
		}
	};

	// Private, don't look

	function fillPants() {
		$.ajax({
			url: feedUrl,
			dataType: 'jsonp',
			jsonpCallback: 'sharterCallback',
			success: function(data, status, xhr) {
				$.each(data.posts, function(index, post) {
					if (post['quote-text'] !== undefined) {
						sharter.insertShart(post['quote-text'], post['quote-source']);
					}
				});
				sharts.shuffle();
				sharter.showNext();
			}
		});
	}

	function showEm() {
		var author = sharts[currentIndex].author || 'Anonymous';

		$('.sharts .author').html('&mdash; ' + author);
		$(sharter.shartElement).find('span').first().html(sharts[currentIndex].solids);

		$(sharter.shartElement).animate(
			{left: 100, opacity: 1.0},
			500,
			'easeInQuad',
			function() {
				$(sharter.shartElement).animate(
					{left: 0},
					6000,
					function() {
						sharter.wipe();
					}
				);
				$('.sharts .author').animate(
					{opacity: 1.0},
					1000
				);
			}
		);
	}

}( window.sharter = window.sharter || {}, jQuery));

Array.prototype.shuffle = function () {
    for (var i = this.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = this[i];
        this[i] = this[j];
        this[j] = tmp;
    }
    return this;
};