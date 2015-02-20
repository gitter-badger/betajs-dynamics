BetaJS.Class.extend("BetaJS.Dynamics.Node", [
    BetaJS.Events.EventsMixin,
	{
	
	constructor: function (handler, parent, element, locals) {
		this._inherited(BetaJS.Dynamics.Node, "constructor");
		this._handler = handler;
		this._parent = parent;
		if (parent)
			parent._children[BetaJS.Ids.objectId(this)] = this;
		this._element = element;
		
		this._tag = element.tagName ? element.tagName.toLowerCase() : "";
		if (this._tag.indexOf(":") >= 0)
			this._tag = this._tag.substring(this._tag.indexOf(":") + 1);
		this._dynTag = BetaJS.Dynamics.Parser.parseText(this._tag);
		this._tagHandler = null;
		
		this._$element = BetaJS.$(element);
		this._template = element.outerHTML;
		this._innerTemplate = element.innerHTML;
		this._locals = locals || {};
		this._active = true;
		this._dyn = null;
		this._children = {};
		this._locked = true;
		this._attrs = {};
		this._expandChildren = true;
		this._touchedInner = false;
		if (element.attributes) {
			for (var i = 0; i < element.attributes.length; ++i)
				this.__initializeAttr(element.attributes[i]);
		}
		this._locked = false;
		this._active = !this._active;
		if (this._active)
			this.deactivate();
		else
			this.activate();
	},
	
	destroy: function () {
		BetaJS.Objs.iter(this._attrs, function (attr) {
			if (attr.partial)
				attr.partial.destroy();
			if (attr.dyn)
				this.__dynOff(attr.dyn);
		}, this);
		this._removeChildren();
		if (this._tagHandler)
			this._tagHandler.destroy();
		if (this._dyn)
			this.properties().off(null, null, this._dyn);
		if (this._parent)
			delete this._parent._children[BetaJS.Ids.objectId(this)];
		this._inherited(BetaJS.Dynamics.Node, "destroy");
	},
	
	element: function () {
		return this._element;
	},
	
	$element: function () {
		return this._$element;
	},
	
	__propGet: function (ns) {
		/*
		var p = ns.indexOf(".");
		var head = p >= 0 ? ns.substring(0, p) : ns;
		var tail = p >= 0 ? ns.substring(p + 1) : null;
		if (tail && head in this._locals && BetaJS.Properties.Properties.is_instance_of(this._locals[head]))
			return {props: this._locals[head], key: tail};
		return {props: this.properties(), key: ns};*/
		var list = [this.properties(), this._locals];
		for (var i = list.length - 1; i >= 0; --i) {
			if (BetaJS.Properties.Meshes.meshHas(list[i], ns)) {
				var result = BetaJS.Properties.Meshes.meshInnerProps(list[i], ns);
				if (result)
					return result;
			}
		}
		return {props: this.properties(), key: ns};
	},
	
	__dynOff: function (dyn) {
		BetaJS.Objs.iter(dyn.dependencies, function (dep) {
			var prop = this.__propGet(dep);
			prop.props.off("change:" + prop.key, null, dyn);
		}, this);
	},
	
	__dynOn: function (dyn, cb) {
		var self = this;
		BetaJS.Objs.iter(dyn.dependencies, function (dep) {
			var prop = this.__propGet(dep);
			prop.props.on("change:" + prop.key, function () {
				cb.apply(self);
			}, dyn);
		}, this);
	},
	
	__initializeAttr: function (attr) {
		var obj = {
			name: attr.name,
			value: attr.value,
			domAttr: attr,
			dyn: BetaJS.Dynamics.Parser.parseText(attr.value)
		};
		this._attrs[attr.name] = obj;
		this.__updateAttr(obj);
		if (BetaJS.Dynamics.handlerPartialRegistry.get(obj.name))
			obj.partial = BetaJS.Dynamics.handlerPartialRegistry.create(obj.name, this, obj.dyn ? obj.dyn.args : {}, obj.value);
		if (obj.dyn) {
			this.__dynOn(obj.dyn, function () {
				this.__updateAttr(obj);
			});
			var self = this;
			if (obj.dyn.bidirectional && obj.name == "value") {
				this._$element.on("change keyup keypress keydown blur focus update", function () {
					var prop = self.__propGet(obj.dyn.variable);
					prop.props.set(prop.key, self._element.value);
				});
			}
		}
	},
	
	__executeDyn: function (dyn) {
		var funcs = BetaJS.Objs.map(this._handler.functions, function (f) {
			return BetaJS.Functions.as_method(f, this._handler);
		}, this);
		return BetaJS.Dynamics.Parser.executeCode(dyn, [this.properties(), this._locals, funcs]);
	},
	
	__updateAttr: function (attr) {
		var value = attr.dyn ? this.__executeDyn(attr.dyn) : attr.value;
		if (value != attr.value && !(!value && !attr.value)) {
			var old = attr.value;
			attr.value = value;
			attr.domAttr.value = value;
			if (attr.partial)
				attr.partial.change(value, old);
			if (attr.name == "value") {
				this._element.value = value;
			}
			this.trigger("change-attr:" + attr.name, value, old);
		}
	},
	
	__tagValue: function () {
		if (!this._dynTag)
			return this._tag;
		return this.__executeDyn(this._dynTag);
	},
	
	__unregisterTagHandler: function () {
		if (this._tagHandler) {
			this.off(null, null, this._tagHandler);
			this._tagHandler.destroy();
			this._tagHandler = null;
		}
	},
	
	__registerTagHandler: function () {
		this.__unregisterTagHandler();
		var tagv = this.__tagValue();
		if (!BetaJS.Dynamics.handlerRegistry.get(tagv))
			return false;
		this._tagHandler = BetaJS.Dynamics.handlerRegistry.create(tagv, {
			parentElement: this._$element.get(0),
			parentHandler: this._handler,
			autobind: false,
			tagName: tagv
		});
		this._$element.append(this._tagHandler.element());
		for (var key in this._attrs) {
			var attr = this._attrs[key];
			if (!attr.partial && key.indexOf("ba-") === 0) {
				var innerKey = key.substring("ba-".length);
				this._tagHandler.properties().set(innerKey, attr.value);
				if (attr.dyn) {
					var self = this;
					this.on("change-attr:" + key, function (value) {
						self._tagHandler.properties().set(innerKey, value);
					}, this._tagHandler);
					if (attr.dyn.bidirectional) {
						var prop = this.__propGet(attr.dyn.variable);
						this._tagHandler.properties().on("change:" + innerKey, function (value) {
							prop.props.set(prop.key, value);
						}, this);							
					}
				}
			}
		}
		this._tagHandler.activate();
		return true;
	},
	
	activate: function () {
		if (this._locked || this._active)
			return;
		this._locked = true;
		this._active = true;
		if (this._dynTag) {
			this.__dynOn(this._dynTag, function () {
				this.__registerTagHandler();
			});
		}
		var registered = this.__registerTagHandler(); 
        if (!registered && this._expandChildren) {
        	if (this._restoreInnerTemplate)
        		this._$element.html(this._innerTemplate);
        	this._touchedInner = true;
			if (this._element.nodeType == this._element.TEXT_NODE) {
				this._dyn = BetaJS.Dynamics.Parser.parseText(this._element.textContent);
				if (this._dyn) {
					this.__dynOn(this._dyn, function () {
						this.__updateDyn();
					});
				}
			}
			this.__updateDyn();
			for (var i = 0; i < this._element.childNodes.length; ++i)
				this._registerChild(this._element.childNodes[i]);
		}
		this._$element.css("display", "");
		for (var key in this._attrs) {
			if (this._attrs[key].partial) 
				this._attrs[key].partial.activate();
		}
		this._locked = false;
	},
	
	__updateDyn: function () {
		if (!this._dyn)
			return;
		var value = this.__executeDyn(this._dyn);
		if (value != this._dyn.value) {
			this._dyn.value = value;
			this._element.textContent = value;
		}
	},
		
	_registerChild: function (element, locals) {
		return new BetaJS.Dynamics.Node(this._handler, this, element, BetaJS.Objs.extend(BetaJS.Objs.clone(this._locals, 1), locals));
	}, 
	
	_removeChildren: function () {
		BetaJS.Objs.iter(this._children, function (child) {
			child.destroy();
		});
	},
	
	deactivate: function () {
		if (!this._active)
			return;
		this._active = false;
		if (this._locked)
			return;
		this._locked = true;
		for (var key in this._attrs) {
			if (this._attrs[key].partial)
				this._attrs[key].partial.deactivate();
		}
		this._removeChildren();
		if (this._dynTag)
			this.__dynOff(this._dynTag);
		this.__unregisterTagHandler();
		if (this._dyn) {
			this.__dynOff(this._dyn);
			this._dyn = null;
		}
		if (this._touchedInner)
			this._$element.html("");
		this._restoreInnerTemplate = true;
		this._locked = false;
	},	
		
	properties: function () {
		return this._handler.properties();
	}
	
}]);
