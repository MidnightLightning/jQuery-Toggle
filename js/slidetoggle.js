// jQuery plugin patterns: http://coding.smashingmagazine.com/2011/10/11/essential-jquery-plugin-patterns/
// http://bililite.nfshost.com/blog/understanding-jquery-ui-widgets-a-tutorial/
// jQuery widgets: http://ajpiano.com/widgetfactory
(function($, window){
	$.widget('md.slideToggle', {
		_create: function() {
			// this -- The widget class itself
			// this.element -- jQuery object of the element the widget was invoked on
			// this.options -- options hash
			var $input = this.element; // The input checkbox
			
			var $sliderContainer = $input.wrap('<div class="sliderContainer ui-widget ui-widget-content ui-helper-reset ui-corner-all" />').parent(); // Wrap the element in a container div, and return a reference to the container
			$sliderContainer.css('width', this.options.width).append('<div class="sliderTrack"><div class="sliderOnText ui-state-active ui-state-highlight"></div><div class="sliderPin"></div><div class="sliderOffText ui-state-default"></div></div>');
			$input.hide(); // Hide base checkbox
			
			// Save references for the future
			this.sliderContainer = $sliderContainer;
			this.sliderTrack = $sliderContainer.find('.sliderTrack');
			this.sliderPin = $sliderContainer.find('.sliderPin');
			this.sliderContainer.data('widget', this); // Give the container a reference to the widget; for mouse events

			$sliderContainer.find('.sliderOnText')
				.html(this.options.checkedText)
				.on("mousedown.slidetoggle", this._clickToggle);
			$sliderContainer.find('.sliderOffText')
				.html(this.options.uncheckedText)
				.on("mousedown.slidetoggle", this._clickToggle);
				
			// Set up pin dragging
			window.slideToggleActive = false;
			this.sliderPin.on("mousedown.slidetoggle", function(e) {
				// Start a pin drag
				e.preventDefault(); // Don't select text during the drag
				var $container = $(this).parentsUntil('.sliderContainer').parent();
				var w = $container.data('widget');
				w.options.isDragging = true;
				w.options.dragStartOffset = parseInt(w.sliderTrack.css('left'));
				w.options.dragStartTime = new Date().getTime();
				w.options.mouseX = e.clientX;
				window.slideToggleActive = w; // Put in window element, since the end of the mouse event will be on the body, not the widget
			});
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
			pinPadding: 1
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
		toggle: function(animate, resetPosition) {
			if (this.options.isChecked) {
				this.turnOff(animate, resetPosition); // Currently on; turn off
			} else {
				this.turnOn(animate, resetPosition); // Currently off; turn on
			}
		},
		turnOff: function(animate, resetPosition) {
			if (typeof animate == 'undefined') animate = true; // If undefined, default to true
			if (typeof resetPosition == 'undefined') resetPosition = true;
			if (animate) {
				if (resetPosition) { this.sliderTrack.stop().css('left', this._onPos()); } // Reset to "on" position
				this.sliderTrack.animate({left: this._offPos()}, 'fast'); // Slide to "off" position
			} else {
				this.sliderTrack.css('left', this._offPos()); // Move to "off" position
			}
			this.element.prop('checked', false);
			this.options.isChecked = false;
		},
		turnOn: function(animate, resetPosition) {
			if (typeof animate == 'undefined') animate = true; // If undefined, default to true
			if (typeof resetPosition == 'undefined') resetPosition = true;
			if (animate) {
				if (resetPosition) { this.sliderTrack.stop().css('left', this._offPos()); } // Reset to "off" position
				this.sliderTrack.animate({left: this._onPos()}, 'fast'); // Slide to "on" position
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
	
	// Drag ending and in-progress events on the body, so the user can drag outside the toggle bounding box
	// Since only one drag event would be going on at a time, this is outside the widget as a global handler
	$('body')
		.on("mousemove.slidetoggle", function(e) {
			var w = window.slideToggleActive;
			if (w) {
				// We're in the middle of a drag; update the slider to where the mouse is
				var deltaX = e.clientX - w.options.mouseX;
				var newOffset = w.options.dragStartOffset + deltaX;
				if (newOffset > parseInt(w._onPos())) {
					newOffset = parseInt(w._onPos());
				} else if (newOffset < parseInt(w._offPos())) {
					newOffset = parseInt(w._offPos());
				}
				w.sliderTrack.css('left', newOffset + 'px');
			}
		})
		.on("mouseup.slidetoggle", function(e) {
			var w = window.slideToggleActive;
			if (w) {
				if (new Date().getTime() - w.options.dragStartTime <= 500) {
					// Mouse up less than one second after it was down; that's a click -- toggle the state
					w.toggle(true, false);
				} else {
					// We're in the middle of a drag; end the drag, choosing on or off based on where the pin is
					var offset = (parseInt(w.sliderTrack.css('left')) - parseInt(w._offPos()))/(parseInt(w._onPos())-parseInt(w._offPos()));
					if (offset >= 0.5) {
						w.turnOn(true, false);
					} else {
						w.turnOff(true, false);
					}
				}
				w.options.isDragging = false;
				window.slideToggleActive = false; // Stop the drag
			}
		});	
})(jQuery, window);