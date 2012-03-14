// jQuery plugin patterns: http://coding.smashingmagazine.com/2011/10/11/essential-jquery-plugin-patterns/
// http://bililite.nfshost.com/blog/understanding-jquery-ui-widgets-a-tutorial/
// jQuery widgets: http://ajpiano.com/widgetfactory
(function($){
	$.widget('md.slideToggle', {
		_create: function() {
			// this -- The widget class itself
			// this.element -- jQuery object of the element the widget was invoked on
			// this.options -- options hash
			var $input = this.element; // The input checkbox
			
			var $sliderContainer = $input.wrap('<div class="sliderContainer ui-widget ui-helper-reset ui-corner-all" />').parent(); // Wrap the element in a container div, and return a reference to the container
			$sliderContainer.css('width', this.options.width).append('<div class="sliderTrack"><div class="sliderOnText ui-state-active ui-state-highlight"></div><div class="sliderPin"></div><div class="sliderOffText ui-state-default"></div></div>');
			$input.hide(); // Hide base checkbox
			
			// Save references for the future
			this.sliderContainer = $sliderContainer;
			this.sliderTrack = $sliderContainer.find('.sliderTrack');
			this.sliderPin = $sliderContainer.find('.sliderPin');
			this.sliderContainer.data('widget', this); // Give the container a reference to the widget; for mouse events
			console.log(this.sliderContainer.data(), this.sliderContainer.data('widget'));

			$sliderContainer.find('.sliderOnText')
				.html(this.options.checkedText)
				.on("mousedown.slidetoggle", {w: this}, this._clickToggle);
			$sliderContainer.find('.sliderOffText')
				.html(this.options.uncheckedText)
				.on("mousedown.slidetoggle", {w: this}, this._clickToggle);
		},
		_init: function() {
			this.sliderPin.css('left', Math.floor(this.sliderTrack.width()/2-this.sliderPin.width()/2) + 'px'); // Move pin to center of track
			if (this.element.prop('checked')) {
				this.turnOn(false); // Set to "on" position
			} else {
				this.turnOff(false); // Set to "off" position
			}
		},
		options: { // Special variable; treated by jQuery as individual to each instance of the widget, and override-able on initial call
			checkedText: 'On',
			uncheckedText: 'Off',
			size: '50px',
			isChecked: false,
			pinPadding: 2
		},
		_offPos: function() {
			return Math.floor(this.sliderTrack.width()/2 * -1 + this.sliderPin.width()/2 + this.options.pinPadding) + 'px';
		},
		_onPos: function() {
			return Math.floor(this.sliderTrack.width()/2 * -1 + this.sliderContainer.width() - this.sliderPin.width()/2 - this.options.pinPadding) + 'px';
		},
		_clickToggle: function(e) {
			// This is a mouse event response; find the actual widget code
			var $container = $(this).parentsUntil('.sliderContainer').parent();
			var w = $container.data('widget');
			w.toggle();
		},
		toggle: function(animate) {
			if (this.options.isChecked) {
				this.turnOff(animate); // Currently on; turn off
			} else {
				this.turnOn(animate); // Currently off; turn on
			}
		},
		turnOff: function(animate) {
			var animate = animate || true; // If undefined, default to true
			console.log("turning off", animate);
			if (animate) {
				this.sliderTrack
					.stop().css('left', this._onPos()) // Reset to "on" position
					.animate({left: this._offPos()}, 'fast'); // Slide to "off" position
			} else {
				this.sliderTrack.css('left', this._offPos()); // Move to "off" position
			}
			this.element.prop('checked', false);
			this.options.isChecked = false;
		},
		turnOn: function(animate) {
			var animate = animate || true; // If undefined, default to true
			console.log("turning on", animate);
			if (animate) {
				this.sliderTrack
					.stop().css('left', this._offPos()) // Reset to "off" position
					.animate({left: this._onPos()}, 'fast'); // Slide to "on" position
			} else {
				this.sliderTrack.css('left', this._onPos()); // Move to "on" position
			}
			this.element.prop('checked', true);
			this.options.isChecked = true;
		},
		_setOption: function(key, value) { // Special function; called when the user sets a new parameter for the widget
			// If the user is setting the checked state; update the widget
			if (key == "isChecked") {
				// User did $('#myInput').slideToggle('option', 'isChecked', [true|false]);
				if (value) {
					this.turnOn(false); // Turn on, without animating
				} else {
					this.turnOff(false); // Turn off, without animating
				}
			}
			$.Widget.prototype._setOption.apply(this, arguments); // do the Widget setOption class call
		},
		destroy: function() { // Special function; called when the user wants to remove the Widget
			this.sliderTrack.remove(); // Snip the slider track, which removes the pin and text labels too
			this.element
				.unwrap() // Remove sliderContainer
				.unhide();
			$.Widget.prototype.destroy.call(this); // Do the parent Widget class destroy action
		}
	});
})(jQuery);