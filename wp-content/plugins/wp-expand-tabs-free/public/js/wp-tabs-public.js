(function ($) {
	'use strict';

	$(document).ready(function () {
		// This function will check the url is video type or not.
		function isVideo(url) {
			var regex = /^(https?:\/\/)?((www\.)?youtube\.com|vimeo\.com|dailymotion\.com|wistia\.com|hubspot\.com|sproutvideo\.com|hippovideo\.io|brightcove\.com|spotlightr\.com|vidyard\.com)\/.+$/i;
			return regex.test(url);
		}

		$('div[id^="sp-wp-tabs-wrapper_"]').each(function () {
			var _this = $(this);
			var tabsID = _this.attr('id');
			var preloader = $('#' + tabsID).data('preloader');
			var activemode = $('#' + tabsID).data('activemode');
			// Preloader
			if (preloader) {
				$(".sp-tab__preloader").fadeOut();
			}

			// Tabs On Hover
			if ('tabs-activator-event-hover' == activemode) {
				$('#' + tabsID).on('mouseenter.sp.tab.data-api', '[data-sptoggle="tab"], [data-hover="tab"]', function (e) {
					e.preventDefault();
					$(this).sp_tab('show');
				});
			}

			// Fix iframe conflict with 2020 theme.
			$('.sp-tab__lay-default iframe[style*="width: 0px"]').css({'width': '', 'height': ''});
			
            // Add wrapper at video iframe for responsiveness. 
			$('#' + tabsID + ' iframe:not(.wp-tab-iframe,.skip,[src*="omny.fm/"])').each(function (i) {
				var iframe_url = $(this).attr('src');
				// Only for video type.
				if ( isVideo( iframe_url ) ) {
					let max_width = $(this).attr('width') > 100 ? 'max-width:' + $(this).attr('width') + 'px' : '';
					$(this).addClass('wp-tab-iframe').wrap("<div class='wp-tab-iframe-container " + tabsID + "_" + i + " '></div>");
					if (max_width){
						$(this).parent('.wp-tab-iframe-container').wrap("<div style='" + max_width + ";width: 100%;display: inline-block;'></div>");
					}
				}
			});
			// Tab #anchoring
			$(function () {
				// check if there is a hash in the url
				if (window.location.hash != '') {
					$('#' + tabsID + ' .sp-tab__nav-tabs > li [for="' + window.location.hash + '"]').trigger('click');
					$('#' + tabsID + '.sp-tab__default-accordion .sp-tab__tab-pane' + window.location.hash + ' > span[data-sptoggle]').trigger('click');
				}
			});

			var $tabs = $('#' + tabsID + ' .sp-tab__nav-item');
			$('.sp-tab__nav-link', $tabs).on('click', function (e) {
				e.preventDefault();
				if ('tabs-activator-event-hover' !== activemode) {
					// Add hash url
					window.location.hash = $(this).attr('for');
				}
			});

			// Accessibility check .
			var $tabs = $('#' + tabsID + ' .sp-tab__nav-item');
			var $panels = $('#' + tabsID + ' .sp-tab__tab-pane');
			var $key_control = $('#' + tabsID + ' .sp-tab__nav-item, #' + tabsID + ' .sp-tab__tab-pane');
			$tabs.on('click', '.sp-tab__nav-link', function (e) {
				e.preventDefault();
				var id = $(this).attr('for');
				// Dynamically TabIndex and aria-selected add for Finding the currently visible tab and panel and hide them
				$tabs.find('[aria-selected="true"]').attr({
					'aria-selected': false,
					'tabindex': -1
				});
				$(this).attr({
					'aria-selected': true,
					'tabindex': 0
				});
				$panels.filter('[aria-hidden="false"]').attr({
					'aria-hidden': true,
					'tabindex': -1
				});
				$(id).attr({
					'aria-hidden': false, 'tabindex': 0
				});
			});

			// Tab control with left right key for accessibility
			$key_control.on('keydown', function (e) {
				switch (e.keyCode) {
					case 39: // Right
						$tabs.find('[aria-selected="true"]').parents('li').next().children('.sp-tab__nav-link').click().focus();
						break;
					case 37: // Left
						$tabs.find('[aria-selected="true"]').parents('li').prev().children('.sp-tab__nav-link').click().focus();
						break;
				}
			});

			// tab accordion mode hashing in mobile.
			$('#' + tabsID + '.sp-tab__default-accordion .sp-tab__tab-pane span[data-sptoggle]').on('click', function (e) {
				e.preventDefault();
				// Add hash url
				window.location.hash = '#' + $(this).parents('.sp-tab__tab-pane').attr('id');
			});

			// Add class for gutenberg block.
			$('.wp-block .sp-tab__lay-default').addClass('sp-tab-loaded');
		});
	});

})(jQuery);