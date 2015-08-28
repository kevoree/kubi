//a set of helper functions, some that we've written, others that we've borrowed

MG.convert = {};

MG.convert.date = function(data, accessor, time_format) {
    time_format = (typeof time_format === "undefined") ? '%Y-%m-%d' : time_format;
    data = data.map(function(d) {
        var fff = d3.time.format(time_format);
        d[accessor] = fff.parse(d[accessor]);
        return d;
    });

    return data;
};

MG.convert.number = function(data, accessor) {
    data = data.map(function(d) {
        d[accessor] = Number(d[accessor]);
        return d;
    });

    return data;
};


function is_array(thing){
    return Object.prototype.toString.call(thing) === '[object Array]';
}

function is_function(thing){
    return Object.prototype.toString.call(thing) === '[object Function]';
}

function is_empty_array(thing){
    return is_array(thing) && thing.length==0;
}

function is_object(thing){
    return Object.prototype.toString.call(thing) === '[object Object]';
}

function is_array_of_arrays(data){
    var all_elements = data.map(function(d){return is_array(d)===true && d.length>0});
    return d3.sum(all_elements) === data.length;
}

function is_array_of_objects(data){
    // is every element of data an object?
    var all_elements = data.map(function(d){return is_object(d)===true});
    return d3.sum(all_elements) === data.length;
}

function is_array_of_objects_or_empty(data){
    return is_empty_array(data) || is_array_of_objects(data);
}


function preventHorizontalOverlap(labels, args) {
    if (!labels || labels.length == 1) {
        return;
    }

    //see if each of our labels overlaps any of the other labels
    for (var i = 0; i < labels.length; i++) {
        //if so, nudge it up a bit, if the label it intersects hasn't already been nudged
        if (isHorizontallyOverlapping(labels[i], labels)) {
            var node = d3.select(labels[i]);
            var newY = +node.attr('y');
            if (newY + 8 == args.top) {
                newY = args.top - 16;
            }
            node.attr('y', newY);
        }
    }
}

function preventVerticalOverlap(labels, args) {
    if (!labels || labels.length == 1) {
        return;
    }

    labels.sort(function(b,a){
        return d3.select(a).attr('y') - d3.select(b).attr('y');
    });

    labels.reverse();

    var overlap_amount, label_i, label_j;

    //see if each of our labels overlaps any of the other labels
    for (var i = 0; i < labels.length; i++) {
        //if so, nudge it up a bit, if the label it intersects hasn't already been nudged
        label_i = d3.select(labels[i]).text();

        for (var j = 0; j < labels.length; j ++) {
            label_j = d3.select(labels[j]).text();
            overlap_amount = isVerticallyOverlapping(labels[i], labels[j]);

            if (overlap_amount !== false && label_i !== label_j) {
                var node = d3.select(labels[i]);
                var newY = +node.attr('y');
                newY = newY + overlap_amount;
                node.attr('y', newY);
            }
        }
    }
}

function isVerticallyOverlapping(element, sibling) {
    var element_bbox = element.getBoundingClientRect();
    var sibling_bbox = sibling.getBoundingClientRect();

    if (element_bbox.top <= sibling_bbox.bottom && element_bbox.top >= sibling_bbox.top) {
        return sibling_bbox.bottom - element_bbox.top;
    }

    return false;
}

function isHorizontallyOverlapping(element, labels) {
    var element_bbox = element.getBoundingClientRect();

    for (var i = 0; i < labels.length; i++) {
        if (labels[i] == element) {
            continue;
        }

        //check to see if this label overlaps with any of the other labels
        var sibling_bbox = labels[i].getBoundingClientRect();
        if (element_bbox.top === sibling_bbox.top &&
                !(sibling_bbox.left > element_bbox.right || sibling_bbox.right < element_bbox.left)
            ) {
            return true;
        }
    }

    return false;
}

function mg_get_svg_child_of(selector_or_node) {
    return d3.select(selector_or_node).select('svg');
}

function mg_flatten_array(arr) {
    var flat_data = [];
    return flat_data.concat.apply(flat_data, arr);
}

function mg_next_id() {
    if (typeof MG._next_elem_id === 'undefined') {
        MG._next_elem_id = 0;
    }

    return 'mg-'+(MG._next_elem_id++);
}

function mg_target_ref(target) {
    if (typeof target === 'string') {
        return mg_normalize(target);

    } else if (target instanceof HTMLElement) {
        target_ref = target.getAttribute('data-mg-uid');
        if (!target_ref) {
            target_ref = mg_next_id();
            target.setAttribute('data-mg-uid', target_ref);
        }

        return target_ref;

    } else {
        console.warn('The specified target should be a string or an HTMLElement.', target);
        return mg_normalize(target);
    }
}

function mg_normalize(string) {
    return string
        .replace(/[^a-zA-Z0-9 _-]+/g, '')
        .replace(/ +?/g, '');
}

function get_pixel_dimension(target, dimension) {
    return Number(d3.select(target).style(dimension).replace(/px/g, ''));
}

function get_width(target) {
    return get_pixel_dimension(target, 'width');
}

function get_height(target) {
    return get_pixel_dimension(target, 'height');
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

var each = function(obj, iterator, context) {
    // yanked out of underscore
    var breaker = {};
    if (obj === null) return obj;
    if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var k in obj) {
        if (iterator.call(context, obj[k], k, obj) === breaker) return;
      }
    }

    return obj;
};

function merge_with_defaults(obj) {
    // taken from underscore
    each(Array.prototype.slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });

    return obj;
}

MG.merge_with_defaults = merge_with_defaults;

function number_of_values(data, accessor, value) {
    var values = data.filter(function(d) {
        return d[accessor] === value;
    });

    return values.length;
}

function has_values_below(data, accessor, value) {
    var values = data.filter(function(d) {
        return d[accessor] <= value;
    });

    return values.length > 0;
}

function has_too_many_zeros(data, accessor, zero_count) {
    return number_of_values(data, accessor, 0) >= zero_count;
}

//deep copy
//http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
MG.clone = function(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null === obj || "object" !== typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = MG.clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = MG.clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
};

//give us the difference of two int arrays
//http://radu.cotescu.com/javascript-diff-function/
function arr_diff(a,b) {
    var seen = [],
        diff = [],
        i;
    for (i = 0; i < b.length; i++)
        seen[b[i]] = true;
    for (i = 0; i < a.length; i++)
        if (!seen[a[i]])
            diff.push(a[i]);
    return diff;
}

MG.arr_diff = arr_diff;

/**
    Print warning message to the console when a feature has been scheduled for removal

    @author Dan de Havilland (github.com/dandehavilland)
    @date 2014-12
*/
function warn_deprecation(message, untilVersion) {
  console.warn('Deprecation: ' + message + (untilVersion ? '. This feature will be removed in ' + untilVersion + '.' : ' the near future.'));
  console.trace();
}

MG.warn_deprecation = warn_deprecation;

/**
    Truncate a string to fit within an SVG text node
    CSS text-overlow doesn't apply to SVG <= 1.2

    @author Dan de Havilland (github.com/dandehavilland)
    @date 2014-12-02
*/
function truncate_text(textObj, textString, width) {
  var bbox,
    position = 0;

  textObj.textContent = textString;
  bbox = textObj.getBBox();

  while (bbox.width > width) {
    textObj.textContent = textString.slice(0, --position) + '...';
    bbox = textObj.getBBox();

    if (textObj.textContent === '...') {
      break;
    }
  }
}

MG.truncate_text = truncate_text;

/**
  Wrap the contents of a text node to a specific width

  Adapted from bl.ocks.org/mbostock/7555321

  @author Mike Bostock
  @author Dan de Havilland
  @date 2015-01-14
*/
function wrap_text(text, width, token, tspanAttrs) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(token || /\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = 0,
        tspan = text.text(null)
          .append("tspan")
          .attr("x", 0)
          .attr("y", dy + "em")
          .attr(tspanAttrs || {});

    while (!!(word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (width === null || tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
            .append("tspan")
            .attr("x", 0)
            .attr("y", ++lineNumber * lineHeight + dy + "em")
            .attr(tspanAttrs || {})
            .text(word);
      }
    }
  });
}

MG.wrap_text = wrap_text;
