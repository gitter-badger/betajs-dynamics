Scoped.define("module:Partials.StylesPartial", ["module:Handlers.Partial"], function (Partial, scoped) {
 	var Cls = Partial.extend({scoped: scoped}, {
		
		_apply: function (value) {
			for (var key in value)
				this._node._element.style[key] = value[key];
		}

 	});
 	Cls.register("ba-styles");
	return Cls;
});
