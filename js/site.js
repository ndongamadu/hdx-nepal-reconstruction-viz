var config = {
    joinAttribute: "code",
    nameAttribute: "HRRP_DNAME",
    mapFieldName: "District",
    ethnicityFieldName: "Caste/ethnicity",
    occupationFieldName: "Occupation",
    householdStatusFieldName: "What is the current status of your home?",
    genderFieldName: "Gender",
    ageFieldName: "Age",
    color: "#0066CC",
    data: "data/survey.json",
    geo: "data/nepal.geojson"
};


function print_filter(filter) {
    var f = eval(filter);
    if (typeof (f.length) != "undefined") {} else {}
    if (typeof (f.top) != "undefined") {
        f = f.top(Infinity);
    } else {}
    if (typeof (f.dimension) != "undefined") {
        f = f.dimension(function (d) {
            return "";
        }).top(Infinity);
    } else {}
    console.log(filter + "(" + f.length + ") = " + JSON.stringify(f).replace("[", "[\n\t").replace(/}\,/g, "},\n\t").replace("]", "\n]"));
}


// Generate right sidebar charts and map
function generateCharts(config, data, geom) {


    var ethnicityChart = dc.rowChart('#ethnicity');
    var occupationChart = dc.rowChart('#occupation');
    var householdStatusChart = dc.rowChart('#householdStatus');
    var genderChart = dc.pieChart('#gender');
    var ageChart = dc.barChart('#age');

    var whereChart = dc.leafletChoroplethChart('#map');

    var cf = crossfilter(data);


    var ethnicityDim = cf.dimension(function (d) {
        return d[config.ethnicityFieldName];
    });
    var occupationDim = cf.dimension(function (d) {
        return d[config.occupationFieldName];
    });
    var householdStatusDim = cf.dimension(function (d) {
        return d[config.householdStatusFieldName];
    });
    var genderDim = cf.dimension(function (d) {
        return d[config.genderFieldName];
    });
    var ageDim = cf.dimension(function (d) {
        return d[config.ageFieldName];
    });

    var mapDim = cf.dimension(function (d) {
        return d[config.mapFieldName];
    });
    var mapGroup = mapDim.group();
    //print_filter(mapGroup);

    var ethnicityGroup = ethnicityDim.group();
    var occupationGroup = occupationDim.group();
    var householdStatusGroup = householdStatusDim.group();
    var genderGroup = genderDim.group();
    var ageGroup = ageDim.group();


    var all = cf.groupAll();

    ethnicityChart.width(400)
        .height(350)
        .dimension(ethnicityDim)
        .group(ethnicityGroup)
        .data(function (group) {
            return group.top(10);
        })
        .colors([config.color])
        .colorAccessor(function (d, i) {
            return 0;
        })
        .elasticX(true)
        .renderTitle(true)
        .xAxis().ticks(3);

    occupationChart.width(400)
        .height(350)
        .dimension(occupationDim)
        .group(occupationGroup)
        .data(function (group) {
            return group.top(10);
        })
        .colors([config.color])
        .colorAccessor(function (d, i) {
            return 0;
        })
        .elasticX(true)
        .xAxis().ticks(3);

    householdStatusChart.width(400)
        .height(350)
        .dimension(householdStatusDim)
        .group(householdStatusGroup)
        .data(function (group) {
            return group.top(3);
        })
        .colors([config.color])
        .colorAccessor(function (d, i) {
            return 0;
        })
        .elasticX(true)
        .xAxis().ticks(3);

    var genderColors = d3.scale.ordinal().range(['#0066CC', '#007FFF']);
    genderChart.width(400)
        .height(350)
        .radius(80)
        .innerRadius(25)
        .dimension(genderDim)
        .group(genderGroup)
        .colors(genderColors);

    ageChart.width(400)
        .height(350)
        .dimension(ageDim)
        .group(ageGroup)
        .colors([config.color])
        .elasticX(true)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxis().ticks(5);

    whereChart.width($('#map').width())
        .height(350)
        .dimension(mapDim)
        .group(mapGroup)
        .center([0, 0]) //katmandu 27.7096/85.2918
        .zoom(0)
        .geojson(geom)
        .colors(['#A7C1D3', '#DDDDDD'])
        .colorDomain([0, 1])
        .colorAccessor(function (d) {
            console.log('putain');
            return 1;
        })
        .popup(function (d) {

            return d.properties['HRRP_DNAME'];
        })
        .renderPopup(true);


    dc.renderAll();

    var map = whereChart.map();

    zoomToGeom(geom);

    function zoomToGeom(geom) {
        var bounds = d3.geo.bounds(geom);
        map.fitBounds([
            [bounds[0][1], bounds[0][0]],
            [bounds[1][1], bounds[1][0]]
        ]);
    }

} // end generateCharts()

//data call 
var dataCall = $.ajax({
    type: 'GET',
    url: config.data,
    dataType: 'json',
});

var geodataCall = $.ajax({
    type: 'GET',
    url: config.geo,
    dataType: 'json',
});

$.when(dataCall, geodataCall).then(function (dataArgs, geomArgs) {
    var data = dataArgs[0];
    var geom = geomArgs[0];
    generateCharts(config, data, geom);
});
