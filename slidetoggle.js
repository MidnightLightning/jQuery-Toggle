// jQuery plugin patterns: http://coding.smashingmagazine.com/2011/10/11/essential-jquery-plugin-patterns/
// jQuery widgets: http://ajpiano.com/widgetfactory
(function($){
	var methods = {
		init: function(options) {
			console.log(arguments);
			var base = this; // use 'base' instead of 'this' for clarity.
			var $base = $(base);
			$base.options = $.extend({
				checkedText: 'On',
				uncheckedText: 'Off',
			}, options);
			console.log(options);
			
			var $sliderContainer = $base.wrap('<div class="sliderContainer" />').parent();
			$sliderContainer.css('width', options.width).append('<div class="sliderTrack"><div class="sliderOnText"></div><div class="sliderPin"></div><div class="sliderOffText"></div></div>');
			//$base.attr('type', 'hidden'); // Change input into a hidden field
			$base.css('display', 'none'); // Hide base checkbox
			$sliderContainer.find('.sliderOnText').html($base.options.checkedText).on("mousedown", { direction: 'turnOff'}, methods.toggle);
			$sliderContainer.find('.sliderOffText').html($base.options.uncheckedText).on("mousedown", { direction: 'turnOn'}, methods.toggle);

			var $track = $sliderContainer.find('.sliderTrack');
			var $pin = $sliderContainer.find('.sliderPin');
			$pin.css('left', Math.floor($track.width()/2-$pin.width()/2) + "px"); // Set pin location
			
			if ($base.prop("checked")) {
				$track.css('left',  Math.floor($track.width()/2 * -1 + $sliderContainer.width() - $pin.width()/2 - 3) + 'px'); // Move to "on" position
			} else {
				$track.css('left', Math.floor($track.width()/2 * -1 + $pin.width()/2 + 3) + 'px'); // Move to "off" position
			}
			
			//$sliderContainer.on("mousedown", methods.dragStart);
		},
		toggle: function(e) {
			if (typeof e.data.direction == 'undefined') {
				// Toggle current state
			} else {
				if (e.data.direction == 'turnOn') {
					methods._turnOn($(this).parent());
				} else {
					methods._turnOff($(this).parent());
				}
			}
		},
		_turnOn: function($el) {
			console.log("Turn on");
			var $container = $el.parent();
			var $pin = $container.find('.sliderPin');
			$el.css('left', Math.floor($el.width()/2 * -1 + $pin.width()/2 + 3) + 'px'); // Reset to "off" position
			$el.animate({left: Math.floor($el.width()/2 * -1 + $container.width() - $pin.width()/2 - 3) + 'px'}, 'fast'); // Slide to "on" position
			console.log($container.find('input'));
			$container.find('input').prop('checked', true); // Check the hidden checkbox
			console.log($container.find('input').prop('checked'));
		},
		_turnOff: function($el) { // Passed element is the slider track to move
			console.log("Turn off");
			var $container = $el.parent();
			var $pin = $container.find('.sliderPin');
			$el.css('left', Math.floor($el.width()/2 * -1 + $container.width() - $pin.width()/2 - 3) + 'px'); // Reset to "on" position
			$el.animate({left: Math.floor($el.width()/2 * -1 + $pin.width()/2 + 3) + 'px'}, 'fast'); // Slide to "off" position
			$container.find('input').prop('checked', false); // Uncheck the hidden checkbox
		},
		drag: function() {
			
		},
		dragStart: function(e) {
			console.log(this, e);
		}
	};
	$.fn.slider = function(options) {
		console.log(arguments);
		return this.each(function() {
			return methods.init.apply(this, arguments);
		})
	}
})(jQuery);