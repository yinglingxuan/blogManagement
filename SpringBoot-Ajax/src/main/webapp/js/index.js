$.fn.extend({
		stringJSON: function() {
		var _this = $(this);   //接收传入的对象
			var json = {};
			var resultArray = _this.serializeArray();
			$.each(resultArray, function(index, data) {
				json[data.name] = data.value;
			});
			return json;
		}
});