
This Blueprint is intented as a quick reference for how to integrate the most commonly
used Dynamic functionalities. On specifics how they work please refer to the individual sections.

```js

	BetaJS.Dynamics.Dynamic.extend("BetaJS.Dynamics.Dynamictemplate", {

	//Creates one dynamics instance
	dynamic = new BetaJS.Dynamics.Dynamic({

		//Only use one of the following three concurrently
		templateUrl : "templates/template.html", 						//This contains the relative file path to an external template
		template : "<div>Internal Template {{some_attribute}}</div>",
		element : $(".someclass"),

		initial : {

			attrs : {
				some_attribute: true
			},
			bind : {
				parent_dynamic_attribute: "<:attribute_in_parent_dynamic"
			},
			collections : {
				some_collection: ['one','two']
			},
			scope : {
				parent_dynamic: "<"
			},

			create : {
				//Reading and writing attribute values
				var attribute = this.get('some_attribute');
				this.set('some_attribute',false);

				//Manipulating Collections
				this.get('some_collection').add('three');
				this.get('some_collection').remove('one');

				//Accessing other Dynamics
				var scope_attr = this.scopes.parent_dynamic.get('attribute_in_parent_dynamic');
				var bind_attr = this.get('parent_dynamic_attribute');
				if (scope_attr == bind_attr)
					console.log('This is set up correctly');

				//Accessing functions
				this.call('some_function');
			},

			functions : {
				some_function : () {}
			}

		},

		_afterActivate : function (element) {
			console.log('This message is displayed after the dynamic is activated');
			//element passes you the element where the Dynamic is active on as a Jquery Object/Element
			element.find(".somechildnode");
		}

	});


```