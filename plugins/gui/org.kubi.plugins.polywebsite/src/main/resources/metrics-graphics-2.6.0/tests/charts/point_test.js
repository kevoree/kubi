module('point');

test('A solitary active datapoint exists', function() {
    var params = {
        target: '#qunit-fixture',
        data: [{'date': new Date('2014-01-01'), 'value': 12},
               {'date': new Date('2014-03-01'), 'value': 18}],
        chart_type: 'point'
    };

    MG.data_graphic(params);
    equal(document.querySelectorAll('.mg-active-datapoint').length, 1, 'One active datapoint exists');
});

test('Rollovers exist', function() {
    var params = {
        target: '#qunit-fixture',
        data: [[{'date': new Date('2014-01-01'), 'value': 12},
               {'date': new Date('2014-03-01'), 'value': 18}],
               [{'date': new Date('2014-01-01'), 'value': 120},
               {'date': new Date('2014-03-01'), 'value': 180}]],
        chart_type: 'point'
    };

    MG.data_graphic(params);
    ok(document.querySelector('.mg-voronoi'), 'Rollovers exist');
});

test('We have only one set of rollovers', function() {
    var params = {
        target: '#qunit-fixture',
        data: [[{'date': new Date('2014-01-01'), 'value': 12},
               {'date': new Date('2014-03-01'), 'value': 18}],
               [{'date': new Date('2014-01-01'), 'value': 120},
               {'date': new Date('2014-03-01'), 'value': 180}]],
        chart_type: 'point'
    };

    MG.data_graphic(params);
    equal(document.querySelectorAll('.mg-voronoi').length, 1, 'One set of rollovers exists');
});

test('args.x_rug', function() {
    var params = {
        target: '#qunit-fixture',
        data: [{'date': new Date('2014-01-01'), 'value': 12},
               {'date': new Date('2014-03-01'), 'value': 18}],
        x_rug: true,
        chart_type: 'point'
    };

    MG.data_graphic(params);
    ok(document.querySelector('.mg-x-rug'), 'X-axis rugplot exists');
});

test('Only one rugplot is added on multiple calls to the same target element', function() {
    var params = {
        target: '#qunit-fixture',
        data: [{'date': new Date('2014-01-01'), 'value': 12},
               {'date': new Date('2014-03-01'), 'value': 18}],
        x_rug: true,
        chart_type: 'point'
    };

    MG.data_graphic(params);
    MG.data_graphic(MG.clone(params));
    
    equal(document.querySelectorAll('.mg-x-rug').length, 2, 'We only have one rugplot (two ticks) on the x-axis');
});

test('args.y_rug', function() {
    var params = {
        target: '#qunit-fixture',
        data: [{'date': new Date('2014-01-01'), 'value': 12},
               {'date': new Date('2014-03-01'), 'value': 18}],
        y_rug: true,
        chart_type: 'point'
    };

    MG.data_graphic(params);
    ok(document.querySelector('.mg-y-rug'), 'Y-axis rugplot exists');
});

test('Only one rugplot is added on multiple calls to the same target element', function() {
    var params = {
        target: '#qunit-fixture',
        data: [{'date': new Date('2014-01-01'), 'value': 12},
               {'date': new Date('2014-03-01'), 'value': 18}],
        y_rug: true,
        chart_type: 'point'
    };

    MG.data_graphic(params);
    MG.data_graphic(MG.clone(params));
    equal(document.querySelectorAll('.mg-y-rug').length, 2, 'We only have one rugplot (two ticks) on the y-axis');
});

test('args.least_squares', function() {
    var params = {
        target: '#qunit-fixture',
        data: [{'date': new Date('2014-01-01'), 'value': 12},
               {'date': new Date('2014-03-01'), 'value': 18}],
        chart_type: 'point',
        least_squares: true
    };

    MG.data_graphic(params);
    ok(document.querySelector('.mg-least-squares-line'), 'Least-squares line exists');
});

test('Only one least-squares line is added on multiple calls to the same target element', function() {
    var params = {
        target: '#qunit-fixture',
        data: [{'date': new Date('2014-01-01'), 'value': 12},
               {'date': new Date('2014-03-01'), 'value': 18}],
        chart_type: 'point',
        least_squares: true
    };

    MG.data_graphic(params);
    MG.data_graphic(MG.clone(params));
    equal(document.querySelectorAll('.mg-least-squares-line').length, 1, 'We only have one least-squares line');
});