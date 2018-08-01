# ju Node Child

For the processes that lock main thread.

## Installation

```shell
$ npm install junodechild
```


## Usage

```javascript
var nodeChild = require("junodechild");

nodeChild.get({
    fn: function (message) {
        for (var i = 0; i < 9999999999; i++) {}

        // Used to write any strig to console.txt.
        this.log(message + " " + new Date().toISOString());

        // This is end of thread. This method will close child thread and then returns parameter.
        this.end(i);
    },
    // Only values in JSON format can be sent.
    params: ["This is a parameter."],
    cb: function (i) {
        console.log(
            "Processing Time: " +
              Math.abs((new Date().getTime() - sd.getTime()) / 1000) +
              "ms " +
              "Variable i value: " + i
        );
    },
    ecb: function (err) {
        console.log(err);
    }
});
```


### Methods


#### `nodeChild.set([options])` or `nodeChild.set(key, value)`

**Parameters:**

* `[options]`: Optional object containing any of the following properties:
  
  * `[childConsolePath]`: Console file path of the node child for test or debuging.

***Or***

* `key`: String key names of the above properties (childConsolePath).

* `value`: Value of the above properties (childConsolePath).


#### `nodeChild.get([options])`

**Parameters:**

* `[options]`: The object containing of the following properties:
  
  * `[params]`: Optional parameters of function to be executed in another node child. It must be an array when used.

  * `[fn]`: Function to be executed in another node child. If the params is exist, it is written to the parameters of the function respectively.
  
  * `[cb]`: Optional callback function to be run after the end of the node child.
  
  * `[ecb]`: Optional error callback function to be run when the node child throws an error.


#### `this.log(message)`

**Parameters:**

* `message`: String message to be log.


#### `this.end(data)`

To close the node child.

**Parameters:**

* `data`: Optional data to be sent for the callback function.


## Examples

### [Basic Usage][]

This example shows the most basic way of usage.

[basic usage]: https://github.com/JosephUz/juNodeChild/tree/master/examples/basic

## License

This software is free to use under the JosephUz. See the [LICENSE file][] for license text and copyright information.

[license file]: https://github.com/JosephUz/juNodeChild/blob/master/LICENSE
