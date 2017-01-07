(function( $ ) {
	var data = [
		["1", "2", "3"],
		["4", "5", "6"]
	];
	$.fn.datatable = function() {
		var thead = this.find('thead');
		var tbody = this.find('tbody');
		
		// create td and tr, append them to tbody
		data.forEach(function(values) {
			var tr = document.createElement('tr');
			values.forEach(function(value) {
				var td = document.createElement('td');
				td.innerHTML = value;
				tr.append(td);
			})
			tbody.append(tr);
		})

	}
})(jQuery);