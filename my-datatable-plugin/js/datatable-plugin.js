(function( $ ) {
	'use strict';

	var DEFAULT_SETTINGS = {
		data: [],
		columnDefs: [],
		totalPages: 0
	};

	function API(datatable) {
		this.datatable = datatable;
	}


	API.prototype.draw = function() {
		this.renderTable();
		this.renderPagination(0, 10, 0);
	}

	API.prototype.renderTable = function() {
		var table = this.datatable.find('table'),
		 	thead = table.find('thead'),
		 	tbody = table.find('tbody'),
		 	settings = this.datatable.settings;
		
		settings.data.forEach(function(values) {
			var tr = document.createElement('tr');
			values.forEach(function(value) {
				var td = document.createElement('td');
				td.innerHTML = value;
				tr.append(td);
			})
			tbody.append(tr);
		})

		var tr = document.createElement('tr');
		thead.append(tr);
		settings.columnDefs
					 .forEach(function(columnDef) {
								  var th = document.createElement('th');
								  th.innerHTML = columnDef.name;
								  tr.append(th);
							  });
	}

	API.prototype.renderNumberedPage = function(startPageNum, size, selectedPageNum) {
		var _this = this,
			pagination = _this.datatable.find('ul'),
			settings = _this.datatable.settings;

		var lastPageNum = (startPageNum + size) < settings.totalPages ? 
								startPageNum + size : 
								settings.totalPages;

		for (var i = startPageNum; i < lastPageNum; i++) {
			var paginateButton = this.paginateButton(i + 1, i);

			if (i == selectedPageNum) {
				$('.current').removeClass('current');
				paginateButton.addClass('current');

				// update data attr for previous and next button
				if (selectedPageNum - 1 < 0) {
					$('.prev').addClass('disabled');
				}
				else {
					$('.prev').data('pageNum', selectedPageNum - 1);
				}

				if (selectedPageNum + 1 > settings.totalPages - 1) {
					$('.next').addClass('disabled');
				}
				else {
					$('.next').data('pageNum', selectedPageNum + 1);
				}
			}

			if (i == startPageNum) {
				paginateButton.addClass('first-page');
			}
			else if (i == lastPageNum - 1) {
				paginateButton.addClass('last-page');
			}
			pagination.append(paginateButton);
		}
	}

	API.prototype.renderPagination = function(startPageNum, size, selectedPageNum) {
		var _this = this,
			pagination = _this.datatable.find('ul'),
			settings = _this.datatable.settings;

		if (pagination.length == 0) return;

		pagination.empty();

		pagination.addClass('pagination');
		pagination.append( this.paginateButton('Previous', -1)
							   .addClass('prev') );

		_this.renderNumberedPage(startPageNum, size, selectedPageNum);

		pagination.append( this.paginateButton('Next', -1)
							   .addClass('next') );

		// add click event
		pagination.off('click').on('click', 'li', function(event) {
			var $this = $(this);
			if ($this.hasClass('disabled') || $this.hasClass('current')) {
				return;
			}

			_this.selectPaginateButton($this);

			// if ($this.hasClass('prev') || $this.hasClass('next')) return;

			// $('.current').removeClass('current');
			// $this.addClass('current');
		});

	}

	API.prototype.paginateButton = function(text, pageNum) {

		if (typeof pageNum != 'number') return;

		var li = $('<li></li>')
					.addClass('paginate_button')
					.append( $('<a></a>').append(text) );

		if (pageNum < 0) return li; // previous or next button

		// numbered page button
		li.data('pageNum', pageNum);
		return li;
	}

	API.prototype.selectPaginateButton = function(button) {
		var _this = this,
			settings = _this.datatable.settings,
			pageNum = button.data('pageNum');
		if (button.hasClass('prev') || button.hasClass('next')) {
			return;
		}

		if (button.hasClass('first-page') && pageNum > 0) {
			_this.renderPagination(pageNum - 9, 10, pageNum);
			return;
		}

		if (button.hasClass('last-page') && pageNum < settings.totalPages - 1) {
			_this.renderPagination(pageNum, 10, pageNum);
			return;
		}

		$('.current').removeClass('current');
		button.addClass('current');
	}

	function DataTable(configs) {
		this.settings = $.extend(DEFAULT_SETTINGS, configs);
		var api = new API(this);
		api.draw();
		return api;
	}


	$.fn.datatable = DataTable;
})(jQuery);