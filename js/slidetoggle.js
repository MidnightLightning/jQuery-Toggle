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
			$sliderContainer.css('width', this.options.width).append('<div class="sliderTrack"><div class="sliderOnText ui-state-active ui-state-highlight"></div><img class="sliderPin" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA0RJREFUeNpMVDtMU2EY%2Fdp7%2B6SVQkEklEIaHyQOZYGBGF0wLCY4uRCNg5NxNHF3cNPNRWIgcdRRBsMARuhgrEQeSasJpZUC6Qva0vfLc%2F7cEv%2FkS3v%2F7%2F7nO9%2F5zn9NCwsLMj4%2BLl6vV6xWq9hsNnE4HGKxWISr1WpJtVqVUqkkp6enkk6npVarSafTkWazKUvLy%2Bo9fXR0VPr7%2B8Vut6vo7e0l4E2TyfS00Wjcrdfr13io3W7HEWt4Xn63uBjC2eb9%2BfmOGEubnZ0Vl8ulWAwMDGj4fQ3ADx6PZwosvYODg4qt2%2B32YH8SQI9R%2FEalUvkaCoWqwFBgOpagOtloaGMFbOaGh4cFB%2BTs7Ey1xNbATjRNk4mJCSmXyw%2FG%2FP7ruVzuXjabTQGnYaYmBMJ6aTab5wh8eHioQIx9pQd1yefzkslkxO%2F3%0Ay8jIyOSoz%2FcW6UvsDGfNggigynMKG41GJR6PXwAx3xWdLMmOEQgEKMk8AG8j7dRZCSyeoCUrqyUSCTU5aKAA%2Bvr6VHsE4bsNTKrTbqsiHNLxyclDvPZdLxaLrHCHo%2Bd%2FLlY8OjpS4w4Gg2qPOYJxkSUnzCG0W60pbLl1tMTElaGhIUW%2F6x8ujFu2trY4zQt7%2FL%2BcTifPXFatEQjG0mgu0iUzM7XBhKwAdbnd4vf51CGKXUbLZMZfQzeKaNGZLJXL8UI%2BP2anozE1jlkHCBm44bHuollt2KsZTk%2BlUgRKqHbhBcmk019iBweiA4CtUWyCOBBkqKZmCGxHjvk0BhOLxQj0Q%2FmIreULhaW9vb1iAYJSSAsOsy16SjPGz0nRTwTLongkEpH9%2Ff0mgFaQLpkpKDZTAHkVDoclh0nVMWYCkqGpCwSQOtz9F2bd3NyUjY0NavQRe7%2BRzmt0Ke5TZ2dnJwx0%2F%2FHxcbACDVRLqM5C9A9b%2BbW9Laurq7K2vi6Q5Bu0fQOQE0RWZyXDvTXo9Awgf2DKF7u7uz00nBV6sC0OJZlM0vFVMPl0Xiq9xxneszSiYpqenlbfFY4SFTVs9uALcNVmtT4Cm1vGXeKlK0Hwn2D3Ge8n8ZwzQOjilmlmZubiDhEwEo2Sng3hMkCc9InhgCaijCggznkJ6Fsm%2FgkwAAL76qv3rCq9AAAAAElFTkSuQmCC" /><div class="sliderOffText ui-state-default"></div></div>');
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
			if (this.options.csstransition == true) {	this.sliderContainer.addClass('csstransition');	}
				
			// Set up pin dragging
			window.slideToggleActive = false;
			this.sliderPin.on("mousedown.slidetoggle", function(e) {
				// Start a pin drag
				e.preventDefault(); // Don't select text during the drag
				var $container = $(this).parentsUntil('.sliderContainer').parent();
				$container.removeClass('csstransition'); // Remove the CSS Transition class for right now if it exists
				var w = $container.data('widget');
				w.options.isDragging = true;
				w.options.dragStartOffset = parseInt(w.sliderTrack.css('left'));
				w.options.dragStartTime = new Date().getTime();
				w.options.mouseX = e.clientX;
				window.slideToggleActive = w; // Put in window element, since the end of the mouse event will be on the body, not the widget
			});
		},
		_init: function() {
			this.sliderPin.css('left', Math.floor(this.sliderTrack.width()/2-this.sliderPin.width()/2)); // Move pin to center of track
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
			animate: true,
			csstransition: false,
			isChecked: false,
			pinPadding: 1
		},
		_offPos: function() {
			return Math.floor(this.sliderTrack.width()/2 * -1 + this.sliderPin.width()/2 + this.options.pinPadding);
		},
		_onPos: function() {
			return Math.floor(this.sliderTrack.width()/2 * -1 + this.sliderContainer.width() - this.sliderPin.width()/2 - this.options.pinPadding);
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
			if (typeof animate == 'undefined') animate = this.options.animate; // If undefined, default to global
			if (!animate) {
				// All animation off
				this.sliderContainer.removeClass('csstransition');
				this.sliderTrack.css('left', this._offPos()); // Move to "off" position
				if (this.options.csstransition) {
					//this.sliderContainer.addClass('csstransition'); // Can't just do this; some browsers (Chrome, Safari) still animate the change if called this soon after the change
					var container = this.sliderContainer;
					setTimeout(function() { container.addClass('csstransition'); }, 10);
				}
			} else {
				if (this.options.csstransition) {
					// Animation is on, and this slider uses CSS transitions
					this.sliderTrack.css('left', this._offPos()); // Move to "off" position
				} else {
					// Animation is on, and this slider uses jQuery animation
					this.sliderTrack.animate({left: this._offPos()}, 'fast'); // Slide to "off" position
				}
			}
			this.element.prop('checked', false);
			this.options.isChecked = false;
			this._trigger('change');
		},
		turnOn: function(animate) {
			if (typeof animate == 'undefined') animate = this.options.animate; // If undefined, default to global
			if (!animate) {
				// All animation off
				this.sliderContainer.removeClass('csstransition');
				this.sliderTrack.css('left', this._onPos()); // Move to "on" position
				if (this.options.csstransition) {
					//this.sliderContainer.addClass('csstransition'); // Can't just do this; some browsers (Chrome, Safari) still animate the change if called this soon after the change
					var container = this.sliderContainer;
					setTimeout(function() { container.addClass('csstransition'); }, 10);
				}
			} else {
				if (this.options.csstransition) {
					// Animation is on, and this slider uses CSS transitions
					this.sliderTrack.css('left', this._onPos()); // Move to "on" position
				} else {
					// Animation is on, and this slider uses jQuery animation
					this.sliderTrack.animate({left: this._onPos()}, 'fast'); // Slide to "on" position
				}
			}
			this.element.prop('checked', true);
			this.options.isChecked = true;
			this._trigger('change');
		},
		_setOption: function(key, value) { // Special function; called when the user sets a new parameter for the widget
			// If the user is setting the checked state; update the widget
			if (key == "isChecked") {
				// User set state via $('#myInput').slideToggle('option', 'isChecked', [true|false]);
				if (value) {
					this.turnOn(false); // Turn on, without animating
				} else {
					this.turnOff(false); // Turn off, without animating
				}
			} else if (key == 'csstransition') {
				// User set CSS Transition toggle via $('#myInput').slideToggle('option', 'csstransition', [true|false]);
				this.sliderContainer.removeClass('csstransition');
				if (value) {
					//this.sliderContainer.addClass('csstransition'); // Can't just do this; some browsers (Chrome, Safari) still animate the change if called this soon after the change
					var container = this.sliderContainer;
					setTimeout(function() { container.addClass('csstransition'); }, 10);
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
				if (newOffset > w._onPos()) {
					newOffset = w._onPos();
				} else if (newOffset < w._offPos()) {
					newOffset = w._offPos();
				}
				w.sliderTrack.css('left', newOffset);
			}
		})
		.on("mouseup.slidetoggle", function(e) {
			var w = window.slideToggleActive;
			if (w) {
				if (w.options.csstransition) { w.sliderContainer.addClass('csstransition'); } // Add CSS Transition class back in, if that option is set
				if (new Date().getTime() - w.options.dragStartTime <= 500) {
					// Mouse up less than one second after it was down; that's a click -- toggle the state
					w.toggle();
				} else {
					// We're in the middle of a drag; end the drag, choosing on or off based on where the pin is
					var offset = (parseInt(w.sliderTrack.css('left')) - w._offPos())/(w._onPos()-w._offPos());
					if (offset >= 0.5) {
						w.turnOn();
					} else {
						w.turnOff();
					}
				}
				w.options.isDragging = false;
				window.slideToggleActive = false; // Stop the drag
			}
		});	
})(jQuery, window);