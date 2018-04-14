function hxlProxyToJSON(input){
    var output = [];
    var keys = [];
    input.forEach(function(e,i){
        if(i==0){
            e.forEach(function(e2,i2){
                var parts = e2.split('+');
                var key = parts[0]
                if(parts.length>1){
                    var atts = parts.splice(1,parts.length);
                    atts.sort();                    
                    atts.forEach(function(att){
                        key +='+'+att
                    });
                }
                keys.push(key);
            });
        } else {
            var row = {};
            e.forEach(function(e2,i2){
                row[keys[i2]] = e2;
            });
            output.push(row);
        }
    });
    return output;
}

function fonc (argument = 123) {
    console.log(argument);
}

//gene('https://proxy.hxlstandard.org/data.json?strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1trL6M1_ousu_G0p9qoMw65TrbrX-Zi2gAvOzankIOH0%2Fedit%23gid%3D487730406&force=on');

var link = 'https://proxy.hxlstandard.org/data.json?strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1trL6M1_ousu_G0p9qoMw65TrbrX-Zi2gAvOzankIOH0%2Fedit%23gid%3D487730406&force=on';
var data = (function(linke){
    var f; 
    $.ajax({
        type: 'GET',
        url: linke,
        dataType: 'json',
        async: false,
        success: function(args){
            f = hxlProxyToJSON(args);
        }
    });
    return f;
})(link);


function gene (argument) {
    console.log('je suis dans gene()')
    var data = (function(){
    var f; 
    $.ajax({
        type: 'GET',
        url: argument,
        dataType: 'json',
        async: false,
        success: function(args){
            f = hxlProxyToJSON(args);
        }
    });
    return f;
})();

}
var reconstruction = {},
    protection = {},
    foodsec = {};

var sectionQuestionsCall = $.ajax({ 
    type: 'GET', 
    url: 'https://proxy.hxlstandard.org/data.json?strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1trL6M1_ousu_G0p9qoMw65TrbrX-Zi2gAvOzankIOH0%2Fedit%23gid%3D0&force=on',
    dataType: 'json',
});

$.when(sectionQuestionsCall).then(function(args){
    var d = hxlProxyToJSON(args)
    var j = 0,
        k = 0,
        l = 0;
    d.forEach( function(element) {

        if (element['#sector'] == 'reconstruction') {
            reconstruction[j] = {'question': element['#meta+question'], 'tag': element['#meta+tag']};
            j++;
            
        } else if (element['#sector'] == 'fsl') {
            foodsec[k] = {'question': element['#meta+question'], 'tag': element['#meta+tag']};
            k++;
            
        } else {
            protection[l] = {'question': element['#meta+question'], 'tag': element['#meta+tag']};
            l++;
        }
    });
});

var d ;
for (key in reconstruction){
    d = reconstruction[key];
    console.log(d)
}


