/**
 * Created by liryc on 5/28/14.
 */

$(function () {

    var gaugeOptions = {

        chart: {
            type: 'solidgauge'
        },

        title: null,

        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0.1, '#55BF3B'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#DF5353'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: -30,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    };

    // The instantaneous gauge
    $('#container-snap').highcharts( Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 10,
            title: {
                text: 'real-time power'
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'real-time power',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ( (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') +
                    '">{y}</span><br/>' +
                    '<span style="font-size:12px;color:silver">Watts</span></div>'
            },
            tooltip: {
                valueSuffix: 'Watts'
            }
        }]

    }));

    // The RPM gauge
    $('#container-rpm').highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 1,
            title: {
                text: 'RPM'
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'RPM',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                    '<span style="font-size:12px;color:silver">* 1000 / min</span></div>'
            },
            tooltip: {
                valueSuffix: ' revolutions/min'
            }
        }]

    }));

    // Bring life to the dials
/*    setInterval(function () {
        // RPM
        chart = $('#container-rpm').highcharts();
        if (chart) {
            var point = chart.series[0].points[0];
                newVal,
                inc = Math.random() - 0.5;

            newVal = point.y + inc;
            if (newVal < 0 || newVal > 5) {
                newVal = point.y - inc;
            }

            point.update(precisionConsumption);
        }
    }, 1000);
*/
});

