'use strict';

var anguSlideApp = angular.module('anguSlide', []);

var helper = {};

anguSlideApp.service('slideHelper', [function($interval) {

    var slideHelper = {};
    slideHelper.width;
    slideHelper.height;
    slideHelper.numberOfSlides;

    slideHelper.addCaption = function(caption) {
        var html = '';
        if (caption) {
            html += ''
        }
        return html;
    }

    slideHelper.setSlideshowViewport = function(element) {
        slideHelper.getWidth = function(element) { return element[0].offsetWidth } ;
        slideHelper.getHeight = element[0].offsetHeight;
    }

    return slideHelper;

}]);


anguSlideApp.directive('slidePagination', function() {
    function link(scope, element, attrs) {
        };
    return {
        template: '<div class="slide-pagination">' +
            '<div class="button" ng-repeat="slide in slides track by slide.id">{{ slide.id }}</div>' +
            '</div>',
        scope: {
            slides: '=',
        },
        link: link
    };

});

anguSlideApp.directive('slide', function($compile, slideHelper, $timeout) {
    function link(scope, element, attrs) {

        // scope.$on('widthChange', function() {
        //     console.log('yes');
        //     if ((scope.currentSlideNumber + 1) == scope.slideInfo.number) {
        //         element.css({
        //             'left': slideHelper.width + 'px'
        //         });
        //     }
        // });

        function setHorizontalSliding(newSlideNumber, slideWidth) {
                    // If current slide is this slide, set visible left position
            var firstLoad = true;
            if (newSlideNumber == scope.slideInfo.number) {
                // For the first slide let it show up immediately
                if (firstLoad && scope.slideInfo.number == 1) {
                    element.css({
                        'z-index': 3,
                        'left': '0px',
                        'transition': 'left ' + slideHelper.animationTime + 'ms ' + slideHelper.animationTimingFunction
                    });
                    firstLoad = false;
                    return;
                }
                element.css({
                    'left': (slideWidth - 2) + 'px',
                });
                $timeout(function() {
                    element.css({
                        'z-index': 3,
                        'left': '0px',
                        'transition': 'left ' + slideHelper.animationTime + 'ms ' + slideHelper.animationTimingFunction
                    });
                });
                return;
            }

            // If previous slide was this slide, move it out of the way
            if (slideHelper.previousSlideNumber == scope.slideInfo.number) {
                $timeout(function() {
                    element.css({
                        'left': -slideWidth + 'px'
                    });
                    resetSlide();
                });
                return;
            }
            // If not, queue it to the right
            if (newSlideNumber != scope.slideInfo.number) {
                element.css({
                    'left': slideWidth + 'px',
                    'transition': 'none'
                });
                return;
            }
        }


        function setVerticalSliding(newSlideNumber, slideHeight) {
                    // If current slide is this slide, set visible left position
            var firstLoad = true;
            if (newSlideNumber == scope.slideInfo.number) {
                // For the first slide let it show up immediately
                if (firstLoad && scope.slideInfo.number == 1) {
                    element.css({
                        'z-index': 3,
                        'left': '0px',
                        'transition': 'left ' + slideHelper.animationTime + 'ms ' + slideHelper.animationTimingFunction
                    });
                    firstLoad = false;
                    return;
                }
                element.css({
                    'left': (slideWidth - 2) + 'px',
                });
                $timeout(function() {
                    element.css({
                        'z-index': 3,
                        'left': '0px',
                        'transition': 'left ' + slideHelper.animationTime + 'ms ' + slideHelper.animationTimingFunction
                    });
                });
                return;
            }

            // If previous slide was this slide, move it out of the way
            if (slideHelper.previousSlideNumber == scope.slideInfo.number) {
                $timeout(function() {
                    element.css({
                        'left': -slideWidth + 'px'
                    });
                    resetSlide();
                });
                return;
            }
            // If not, queue it to the right
            if (newSlideNumber != scope.slideInfo.number) {
                element.css({
                    'left': slideWidth + 'px',
                    'transition': 'none'
                });
                return;
            }
        }

        scope.$watch('currentSlideNumber', function(newSlideNumber, oldValue) {
            //console.log(newSlideNumber, scope.slideInfo.number, 'previousslide', slideHelper.previousSlideNumber);

            var slideWidth = scope.slideWidth;

            // Well let the slide overrun but not more than 1
            if (newSlideNumber > (slideHelper.numberOfSlides + 1)) {
                return;
            }

                setHorizontalSliding(newSlideNumber, slideWidth);


        });

        function resetSlide() {
            $timeout(function() {
                element.css({
                    'transition': 'none',
                    'left': slideHelper.width + 'px',
                    'z-index': -1
                });
            }, slideHelper.animationTime);
            element.css({
                'z-index': 1,
                'transition': 'left ' + slideHelper.animationTime + 'ms ' + slideHelper.animationTimingFunction
            });
        }

        // Set some options
        scope.isBgImg = false;
        if (scope.slideInfo.bgImage) {
            scope.isBgImg = true;
        }

    };
    return {
        template: '<div class="slide">' +
            '<a class="link-overlay" ng-if="slideInfo.link" href="{{ slideInfo.link }}"></a>' +
            '<div class="slide-image-bg" ng-if="isBgImg" style="background-image: url(\'{{ slideInfo.url }}\')">{{slideInfo.alt}}</div>' +
            '<img class="slide-image" ng-if="!isBgImg" ng-src="{{ slideInfo.url }}" alt="{{slideInfo.alt}}" />' +
            '<div ng-if="slideInfo.caption" class="caption">{{slideInfo.caption}}</div>' +
            '</div>',
        scope: {
            slideInfo: '=',
            currentSlideNumber: '=',
            slideWidth: '@',
            slideHeight: '@'
        },
        link: link
    };

});

anguSlideApp.directive('slideShow', function($window, $timeout, $interval, $compile, slideHelper) {
    function link(scope, element, attrs) {

        // Reference slide container div
        var container = element.find('div');

        var options = (scope.config) ? scope.config : {};
        var paused = (options.paused) ? options.paused : false;
        var autoPlay = (options.autoPlay) ? options.autoPlay : true;
        var intervalTime = (options.intervalTime) ? options.intervalTime : 2000;
        var animationTime = (options.animationTime) ? options.animationTime : 800;
        var timingFunction = (options.animationTimingFunction) ? options.animationTimingFunction : 'ease-in';

        scope.slideDirection = (options.slideDirection) ? options.slideDirection : 'horizontal';

        scope.currentSlideNumber = (options.startingSlide) ? options.startingSlide : 1;

        slideHelper.intervalTime = intervalTime;
        slideHelper.animationTime = animationTime;
        slideHelper.animationTimingFunction = timingFunction;

        scope.viewportWidth = element[0].offsetWidth;
        scope.viewportHeight = element[0].offsetHeight;

        function setSlides(slides) {
            scope.slides = slides;
            slideHelper.numberOfSlides = slides.length;
        }

        function startSlideshow() {
            container.addClass('slideshow-active');
            scope.activeInterval = $interval(function() {
                if (!paused) {
                    scope.viewportWidth = element[0].offsetWidth;
                    scope.viewportHeight = element[0].offsetHeight;
                    if (slideHelper.numberOfSlides == scope.currentSlideNumber) {
                        scope.currentSlideNumber = 1;
                    } else {
                        scope.currentSlideNumber++;
                    }
                    if (scope.currentSlideNumber == 1) {
                        slideHelper.previousSlideNumber = slideHelper.numberOfSlides;
                    } else {
                        slideHelper.previousSlideNumber = scope.currentSlideNumber - 1;
                    }
                }
            }, intervalTime);
        }

        function resumeSlideshow() {
            container.addClass('slideshow-active');
            paused = false;
        }

        function pauseSlideshow() {
            container.removeClass('slideshow-active');
            paused = true;
        }

        function clearSlideshow() {
            container.removeClass('slideshow-active');
            $interval.cancel(scope.activeInterval);
        }

        scope.$watch('slides', function(newSlides, oldSlides) {
            if (newSlides && newSlides.length > 0) {
                setSlides(scope.slides);
                if (autoPlay) {
                    startSlideshow();
                }
            }
        });

    };
    return {
        template: '<div class="slide-container"><slide id="slide-{{ slide.number }}" class="slide" ng-repeat="slide in slides track by slide.number" slide-info="slide" slide-width="{{ viewportWidth }}" slide-width="{{ viewportHeight }}" slide-direction="{{ slideDirection }}" current-slide-number="currentSlideNumber"></slide></div>',
        scope: {
            slides: '=',
            config: '='
        },
        link: link

    };
});
