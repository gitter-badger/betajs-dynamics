# betajs-dynamics 0.0.77
[![Build Status](https://api.travis-ci.org/betajs/betajs-dynamics.svg?branch=master)](https://travis-ci.org/betajs/betajs-dynamics)
[![Code Climate](https://codeclimate.com/github/betajs/betajs-dynamics/badges/gpa.svg)](https://codeclimate.com/github/betajs/betajs-dynamics)


BetaJS-Dynamics is a dynamic DOM templating engine.



## Getting Started


You can use the library in the browser and compile it as well.

#### Browser

```javascript
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	<script src="betajs/dist/betajs.min.js"></script>
	<script src="betajs-browser/dist/betajs-browser.min.js"></script>
	<script src="betajs-dynamics/dist/betajs-dynamics.min.js"></script>
``` 

#### Compile

```javascript
	git clone https://github.com/betajs/betajs-dynamics.git
	npm install
	grunt
```



## Basic Usage


The Javascript Controller:

```js

    dynamic = new BetaJS.Dynamics.Dynamic({
        element: $("some_element"),
        initial : {
            attrs : {
                some_attribute : "This is some Text",
                some_boolean : true
            }
        }
    });

```

The HTML Element:

```html

    <some_element ba-if="{{some_boolean}}">{{some_attribute}}</some_element>

```

Will evaluate to


```html

    <some_element>This is some Text</some_element>

```



## Links
| Resource   | URL |
| :--------- | --: |
| Homepage   | [http://betajs.com](http://betajs.com) |
| Git        | [git://github.com/betajs/betajs-dynamics.git](git://github.com/betajs/betajs-dynamics.git) |
| Repository | [http://github.com/betajs/betajs-dynamics](http://github.com/betajs/betajs-dynamics) |
| Blog       | [http://blog.betajs.com](http://blog.betajs.com) | 
| Twitter    | [http://twitter.com/thebetajs](http://twitter.com/thebetajs) | 



## Compatability
| Target | Versions |
| :----- | -------: |
| Firefox | 6 - Latest |
| Chrome | 15 - Latest |
| Safari | 4 - Latest |
| Opera | 12 - Latest |
| Internet Explorer | 8 - Latest |
| Edge | 12 - Latest |
| iOS | 3.0 - Latest |
| Android | 2.2 - Latest |


## CDN
| Resource | URL |
| :----- | -------: |
| betajs-dynamics.js | [http://cdn.rawgit.com/betajs/betajs-dynamics/master/dist/betajs-dynamics.js](http://cdn.rawgit.com/betajs/betajs-dynamics/master/dist/betajs-dynamics.js) |
| betajs-dynamics.min.js | [http://cdn.rawgit.com/betajs/betajs-dynamics/master/dist/betajs-dynamics.min.js](http://cdn.rawgit.com/betajs/betajs-dynamics/master/dist/betajs-dynamics.min.js) |
| betajs-dynamics-noscoped.js | [http://cdn.rawgit.com/betajs/betajs-dynamics/master/dist/betajs-dynamics-noscoped.js](http://cdn.rawgit.com/betajs/betajs-dynamics/master/dist/betajs-dynamics-noscoped.js) |
| betajs-dynamics-noscoped.min.js | [http://cdn.rawgit.com/betajs/betajs-dynamics/master/dist/betajs-dynamics-noscoped.min.js](http://cdn.rawgit.com/betajs/betajs-dynamics/master/dist/betajs-dynamics-noscoped.min.js) |


## Unit Tests
| Resource | URL |
| :----- | -------: |
| Test Suite | [Run](http://rawgit.com/betajs/betajs-dynamics/master/tests/tests.html) |


## Dependencies
| Name | URL |
| :----- | -------: |
| betajs | [Open](https://github.com/betajs/betajs) |
| betajs-browser | [Open](https://github.com/betajs/betajs-browser) |


## Weak Dependencies
| Name | URL |
| :----- | -------: |
| betajs-scoped | [Open](https://github.com/betajs/betajs-scoped) |
| betajs-shims | [Open](https://github.com/betajs/betajs-shims) |


## Main Contributors

- Victor Lingenthal
- Oliver Friedmann

## License

Apache-2.0






## Sponsors

- Ziggeo
- Browserstack


