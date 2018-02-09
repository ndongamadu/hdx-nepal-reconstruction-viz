var surveyData ;

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
function generateCharts(geom) {


    var ethnicityChart = dc.rowChart('#ethnicity');
    var occupationChart = dc.rowChart('#occupation');
    var householdStatusChart = dc.rowChart('#householdStatus');
    var genderChart = dc.pieChart('#gender');
    var ageChart = dc.barChart('#age');

    var whereChart = dc.leafletChoroplethChart('#map');


    var ethnicityDim = surveyData.dimension(function (d) {
        return d["Caste/ethnicity"];
    });
    var occupationDim = surveyData.dimension(function (d) {
        return d["Occupation"];
    });
    var householdStatusDim = surveyData.dimension(function (d) {
        return d["What is the current status of your home?"];
    });
    var genderDim = surveyData.dimension(function (d) {
        return d["Gender"];
    });
    var ageDim = surveyData.dimension(function (d) {
        return d["Age"];
    });

    var mapDim = surveyData.dimension(function (d) {
        return d["HRRP_DCODE"];
    });
    var mapGroup = mapDim.group();
    //print_filter(mapGroup);

    var ethnicityGroup = ethnicityDim.group();
    var occupationGroup = occupationDim.group();
    var householdStatusGroup = householdStatusDim.group();
    var genderGroup = genderDim.group();
    var ageGroup = ageDim.group();


    var all = surveyData.groupAll();

    ethnicityChart.width(400)
        .height(370)
        .dimension(ethnicityDim)
        .group(ethnicityGroup)
        .data(function (group) {
            return group.top(Infinity);
        })
        .colors('#0066CC')
        .colorAccessor(function (d, i) {
            return 0;
        })
        .elasticX(true)
        .renderTitle(true)
        .xAxis().ticks(3);

    occupationChart.width(400)
        .height(370)
        .dimension(occupationDim)
        .group(occupationGroup)
        .data(function (group) {
            return group.top(Infinity);
        })
        .colors('#0066CC')
        .colorAccessor(function (d, i) {
            return 0;
        })
        .elasticX(true)
        .xAxis().ticks(3);

    householdStatusChart.width(400)
        .height(370)
        .dimension(householdStatusDim)
        .group(householdStatusGroup)
        .data(function (group) {
            return group.top(Infinity);
        })
        .colors('#0066CC')
        .colorAccessor(function (d, i) {
            return 0;
        })
        .elasticX(true)
        .xAxis().ticks(3);

    var genderColors = d3.scale.ordinal().range(['#0066CC', '#007FFF']);
    genderChart.width(350)
        .height(250)
        .radius(100)
        .dimension(genderDim)
        .group(genderGroup)
        .colors(genderColors);

    ageChart.width(400)
        .height(250)
        .dimension(ageDim)
        .group(ageGroup)
        .colors('#0066CC')
        .elasticX(true)
        .gap(55)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxis().ticks(5);

    whereChart.width($('#map').width())
        .height(350)
        .dimension(mapDim)
        .group(mapGroup)
        .zoom(0)
        .center([27.7, 85.2]) //katmandu 27.7096/85.2918
        .geojson(geom)
        .colors(['#DDDDDD', '#A7C1D3', '#71A5CA', '#3B88C0', '#056CB6'])
        .colorDomain([0, 4])
        .colorAccessor(function (d) {
            var c = 0
            if (d > 250) {
                c = 4;
            } else if (d > 150) {
                c = 3;
            } else if (d > 50) {
                c = 2;
            } else if (d > 0) {
                c = 1;
            };
            return c;

        })
        .featureKeyAccessor(function (feature) {
            return feature.properties['HLCIT_CODE'];
        }).popup(function (feature) {
            return feature.properties['DISTRICT'];
        })
        .renderPopup(true);


    dc.renderAll();

    var map = whereChart.map();

    zoomToGeom(geom);

    function zoomToGeom(geom) {
        var bounds = d3.geo.bounds(geom);
        var bnds = [
                    [26.91925778222094, 84.41872367235965],
                    [28.752320805960494, 86.6860110153961] 
                    ];
        // map.fitBounds([
        //     [bounds[0][1], bounds[0][0]],
        //     [bounds[1][1], bounds[1][0]]
        // ]);
        map.fitBounds(bnds);
    }

function drawSurveyChart(tpe,question,i){
    var chart = dc.rowChart('#'+tpe+i);
    var dim = surveyData.dimension(function(d){ 
        return d[question]; 
    });
    var grp = dim.group();

    chart.width('350')
        .height('350')
        .dimension(dim)
        .group(grp)
        .data(function (group) {
            return group.top(Infinity);
        })
        .colors('#01B64B')
        .colorAccessor(function (d, i) {
            return 0;
        })
        .elasticX(true)
        .xAxis().ticks(3);
        
        chart.render();

    

}// end drawSurveyChart

function generateSurveyCharts(selection){
    var reconstructionDivs = [
           "12. Overall, is the post-earthquake reconstruction process making progress?",
           "11. Besides building your home, what is the biggest community reconstruction need of your community?",
           "10. Are you satisfied with grant dispersal process?",
            "8. Do you face any barriers to receive support to reconstruct your house?",
            "7.  Are you aware how to build by using safer housing practices?",
            "6. Have you been able to commit your own resources?",
            "5. Have you received any housing reconstruction support (this includes both financial and technical)?",
            "3. Have you consulted an engineer for your housing reconstruction needs?",
            "2. Do you have the information you need to access housing reconstruction support?"
         ];

    var foodSecDivs = [
            "19. Have any members of your family been required to migrate to support your family’s recovery?",
            "18. Do you feel that your source of livelihood would survive another disaster?",
            "17. What one skill would you like to develop in support of your livelihood?",
            "16. Do you face any constraints to livelihood recovery?",
            "15. Has damage from the earthquake impacted your livelihood?",
            "13. What is your primary source of income generation now?", 
            "14. How much of your own food do you grow?",
            "12. Are your family’s daily food need being met?"
            ];

    var protectionDivs = [];

    switch (selection) {
        case "foodSecurity":
            $('.surveycharts').html('<p>');

            for (var i = foodSecDivs.length - 1; i >= 0; i--) {
                $('.surveycharts').append('<div class="col-md-6"><h5 style="width:350px;">'+foodSecDivs[i]+'</h5><div id="foodSecurity'+i+'"></div></div>');
                drawSurveyChart("foodSecurity", foodSecDivs[i], i);
            }
            break;
        case "protection":
            $('.surveycharts').html('<p>');
            break;
        default:
            $('.surveycharts').html('<p>');

            for (var i = reconstructionDivs.length - 1; i >= 0; i--) {
                $('.surveycharts').append('<div class="col-md-6"><h5 style="width:350px;">'+reconstructionDivs[i]+'</h5><div id="reconstruction'+i+'"></div></div>');
                drawSurveyChart("reconstruction", reconstructionDivs[i], i);
            }
            break;
    }

} //end generateSurveyCharts

$("document").ready(function(){
    var selectedSurvey = $('.surveySelectionMenu').val();
    generateSurveyCharts();

});

$('.surveySelectionMenu').on("change", function(e){
    var selectedSurvey = $('.surveySelectionMenu').val();
    generateSurveyCharts(selectedSurvey);
  });


} // end generateCharts()



//data call 
var dataCall = $.ajax({
    type: 'GET',
    url: 'data/survey.json',
    dataType: 'json',
});

var geodataCall = $.ajax({
    type: 'GET',
    url: 'data/map.json',
    dataType: 'json',
});

$.when(dataCall, geodataCall).then(function (dataArgs, geomArgs) {
    var data = dataArgs[0];
    var geom = geomArgs[0];
    surveyData = crossfilter(data);
    generateCharts(geom);
});
