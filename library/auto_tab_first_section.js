
/**
 * jQuery Plugin: Sticky Accordion and Tabs
 *
 */
(function($) {
	"use strict";
	$.fn.stickyStuff = function() {
		var context = this;
		// Show the tab/collapsible corresponding with the hash in the URL, or the first tab (if the collapsible is inside a tab, show that too).
		var showStuffFromHash = function() {
			var hash = window.location.hash;
			var selector = hash ? 'a[href="' + hash + '"]' : 'li.active > a';
			if($(selector, context).data('toggle') === "tab") {
				$(selector, context).tab('show');
			} else if($(selector, context).data('toggle') === "collapse") {
				var collapsible = hash;
				$(collapsible, context).collapse("show");
				var parent_tab = $(collapsible, context).parents('.tab-pane');
				if (parent_tab && !parent_tab.hasClass("active")) {
					$('a[href=#' + parent_tab.attr('id') + ']').tab('show');
				}
			}
		};
		

		// Set the correct tab when the page loads
		showStuffFromHash(context);

		// Set the correct tab when a user uses their back/forward button
		$(window).on('hashchange', function() {
			showStuffFromHash(context);
		});

		// Change the URL when tabs are clicked
		$('a', context).on('click', function(e) {
			history.pushState(null, null, this.href);
			showStuffFromHash(context);
		});

		return this;
	};
}(jQuery));

$(document).ready(function() {
	
	$(".accordion").each(function(i, $details ) {
		$details = $($details);
	
		var headline = $($details.find('h1,h2,h3,h4,h5,h6')[0]).clone();
		headline.addClass("panel-title");
		headline.html(
			'<a data-toggle="collapse" data-parent="#accordion" href="#'+
			$details.attr('id') +
			'">' +
			headline.html() +
			'</a>'
		);
		$($details.find('h1,h2,h3,h4,h5,h6')[0]).remove();
		
		var accordion = $('<div class="panel-group" id="accordion'+i+'" role="tablist" aria-multiselectable="true">'+
		'<div class="panel panel-default">' +
		'<div class="panel-heading" role="tab">' +
		'</div>'+
		'<div id="' +
		$details.attr('id') + 
		'" class="panel-collapse collapse" role="tabpanel">' +
		'<div class="panel-body">' +
		$details.html() +
		'</div></div></div></div>');
		
		headline.appendTo(accordion.find(".panel-heading"));

		$details.replaceWith(accordion);
	});
	$("pre.sourceCode.r").each(function(i, $details ) {
		$details = $($details);
		
		if($details.height() > 40) {
	
			if(typeof $details.attr('id') == "undefined") {
				$details.attr('id', "rcode_chunk_"+i);
			}
			var headline = $("<span class='panel-title' title='Click to show' data-toggle='tooltip' data-placement='left'>"+
			'<a data-toggle="collapse" data-parent="#accordion" href="#'+
				$details.attr('id') +
				'">' +"R code"+
				'</a></span>');
		
			var accordion = $('<div class="panel-group" id="accordion'+i+'" role="tablist" aria-multiselectable="true">'+
			'<div class="panel panel-default">' +
			'<div class="panel-heading" role="tab">' +
			'</div>'+
			'<div id="' +
			$details.attr('id') + 
			'" class="panel-collapse collapse" role="tabpanel">' +
			'<div class="panel-body">' +
				'</div></div></div></div>');
		
			headline.appendTo(accordion.find(".panel-heading"));
			accordion.insertAfter($details);
			$details.appendTo(accordion.find('.panel-body'));

//			$details.replaceWith(accordion);
		}
	});
	$(".tab-content").each(function(i, $tab_parent ) {
		$tab_parent = $($tab_parent);

		$tab_parent.find(".section.level2").addClass("tab-pane");
		var ids = [];
		var texts = [];
        var active = null;
		$tab_parent.find('.section.level2').each(function(i, elm) {
			ids.push($(elm).attr("id"))
			texts.push($($(elm).find("h2")[0]).text());
			if($(elm).hasClass("active")) {
				active = i;
			}
		});
		if(active==null) active = 0;
			var nav_tabs = $('<ul class="js_auto_tabs nav nav-tabs" role="tablist"></ul>');
			for(var i = 0; i < ids.length; i++) {
				nav_tabs.append($('<li role="presentation"><a href="#' + ids[i] + '" role="tab" data-toggle="tab">'+texts[i]+'</a></li>'));
			}
			$($tab_parent.find(".section.level2")[active]).addClass("active");
			$(nav_tabs.find("li")[active]).addClass("active");
			
		if($(".js_auto_tabs").length == 0) {
			nav_tabs.insertBefore($tab_parent.find('.section.level2')[0]);
		}
	});
	
	$(function () {
	  $('[data-toggle="tooltip"]').tooltip()
	});
	
	window.setTimeout(function() {	
		$('.tab-content').stickyStuff();
	},0); // dumb fix so code is properly minimised only outside accordions
	
});