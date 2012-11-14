(function( reviewboard, $, undefined ) {
  var reviews = [];
  var feedUrl = 'http://localhost:4567/all';
  var mainElement = null;
  var currentIndex = 0;
  var maxToDisplay = 12

  reviewboard.init = function() {
    reviewboard.mainElement = $('.reviews-container .reviews')[0];
    getReviews();
  };

  reviewboard.insertReview = function(review) {
    var reviewStars = '';

    // count stars
    for (var i = 0; i < review.rating; i++) {
      reviewStars += '&#9733;';
    }

    reviewStars = $('<span>').html(reviewStars);

    var articleElement = $('<article>').html(review.body);
    var titleElement = $('<h1>').html(review.subject);
    var authorElement = $('<div class="author">').html(review.author);
    var dateElement = $('<div class="date">').html(review.date);

    titleElement.append(reviewStars);
    authorElement.append(dateElement);
    articleElement.addClass('rating_' + review.rating);
    articleElement.prepend(titleElement);
    articleElement.append(authorElement);

    $(reviewboard.mainElement).append(articleElement);
  };

  reviewboard.displayNextBatch = function() {
    var reviewBatch = reviewboard.reviews.slice(currentIndex, maxToDisplay);
    $.each(reviewBatch, function(index, review) {
      reviewboard.insertReview(review);
      currentIndex += 1;
    });
  };

  reviewboard.startScroller = function() {
    reviewboard.displayAllReviews();
    setInterval('reviewboard.animateList()',8000);
  };

  reviewboard.displayAllReviews = function() {
    reviewboard.reviews.sort(function() {return 0.5 - Math.random()});
    $.each(reviewboard.reviews, function(index, review) {
      reviewboard.insertReview(review);
    });
  };

  reviewboard.animateList = function() {
    // re-insert all reviews if list is getting small
    if ($(reviewboard.mainElement).find('article').length <= 3) {
      reviewboard.displayAllReviews();
    }

    var firstItem = $(reviewboard.mainElement).find('article')[0];

    $(firstItem).animate(
      {opacity: 0},
      1000,
      function() {
        var firstItem = $(reviewboard.mainElement).find('article')[0];
        $(firstItem).animate(
          {height: 0, margin: 0, padding: 0},
          500,
          function() {
            var firstItem = $(reviewboard.mainElement).find('article')[0];
            $(firstItem).remove();
          }
        );
      }
    );
  };

  function getReviews() {
    $.ajax({
       url: feedUrl,
       dataType: 'jsonp',
       success: function(data, status, xhr) {
        reviewboard.reviews = data;
        //reviewboard.displayNextBatch();
        reviewboard.startScroller();
       }
    });
  };

}( window.reviewboard = window.reviewboard || {}, jQuery));
