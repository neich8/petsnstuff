!function(){
  var Donut3D={};

  function pieTop(d, rx, ry, ir ){
    if(d.endAngle - d.startAngle == 0 ) return "M 0 0";
    var sx = rx*Math.cos(d.startAngle),
      sy = ry*Math.sin(d.startAngle),
      ex = rx*Math.cos(d.endAngle),
      ey = ry*Math.sin(d.endAngle);

    var ret =[];
    ret.push("M",sx,sy,"A",rx,ry,"0",(d.endAngle-d.startAngle > Math.PI? 1: 0),"1",ex,ey,"L",ir*ex,ir*ey);
    ret.push("A",ir*rx,ir*ry,"0",(d.endAngle-d.startAngle > Math.PI? 1: 0), "0",ir*sx,ir*sy,"z");
    return ret.join(" ");
  }

  function pieOuter(d, rx, ry, h ){
    var startAngle = (d.startAngle > Math.PI ? Math.PI : d.startAngle);
    var endAngle = (d.endAngle > Math.PI ? Math.PI : d.endAngle);

    var sx = rx*Math.cos(startAngle),
      sy = ry*Math.sin(startAngle),
      ex = rx*Math.cos(endAngle),
      ey = ry*Math.sin(endAngle);

      var ret =[];
      ret.push("M",sx,h+sy,"A",rx,ry,"0 0 1",ex,h+ey,"L",ex,ey,"A",rx,ry,"0 0 0",sx,sy,"z");
      return ret.join(" ");
  }

  function pieInner(d, rx, ry, h, ir ){
    var startAngle = (d.startAngle < Math.PI ? Math.PI : d.startAngle);
    var endAngle = (d.endAngle < Math.PI ? Math.PI : d.endAngle);

    var sx = ir*rx*Math.cos(startAngle),
      sy = ir*ry*Math.sin(startAngle),
      ex = ir*rx*Math.cos(endAngle),
      ey = ir*ry*Math.sin(endAngle);

      var ret =[];
      ret.push("M",sx, sy,"A",ir*rx,ir*ry,"0 0 1",ex,ey, "L",ex,h+ey,"A",ir*rx, ir*ry,"0 0 0",sx,h+sy,"z");
      return ret.join(" ");
  }

  function getPercent(d){
    return (d.endAngle-d.startAngle > 0.2 ?
        Math.round(1000*(d.endAngle-d.startAngle)/(Math.PI*2))/10+'%' : '');
  }

  Donut3D.transition = function(id, data, rx, ry, h, ir){
    function arcTweenInner(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) { return pieInner(i(t), rx+0.5, ry+0.5, h, ir);  };
    }
    function arcTweenTop(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) { return pieTop(i(t), rx, ry, ir);  };
    }
    function arcTweenOuter(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) { return pieOuter(i(t), rx-.5, ry-.5, h);  };
    }
    function textTweenX(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) { return 0.6*rx*Math.cos(0.5*(i(t).startAngle+i(t).endAngle));  };
    }
    function textTweenY(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) { return 0.6*rx*Math.sin(0.5*(i(t).startAngle+i(t).endAngle));  };
    }

    var _data = d3.layout.pie().sort(null).value(function(d) {return d.value;})(data);

    d3.select("#"+id).selectAll(".innerSlice").data(_data)
      .transition().duration(750).attrTween("d", arcTweenInner);

    d3.select("#"+id).selectAll(".topSlice").data(_data)
      .transition().duration(750).attrTween("d", arcTweenTop);

    d3.select("#"+id).selectAll(".outerSlice").data(_data)
      .transition().duration(750).attrTween("d", arcTweenOuter);

    d3.select("#"+id).selectAll(".percent").data(_data).transition().duration(750)
      .attrTween("x",textTweenX).attrTween("y",textTweenY).text(getPercent);
  }

  Donut3D.draw=function(id, data, x /*center x*/, y/*center y*/,
      rx/*radius x*/, ry/*radius y*/, h/*height*/, ir/*inner radius*/){

    var _data = d3.layout.pie().sort(null).value(function(d) {return d.value;})(data);

    var slices = d3.select("#"+id).append("g").attr("transform", "translate(" + x + "," + y + ")")
      .attr("class", "slices");

    slices.selectAll(".innerSlice").data(_data).enter().append("path").attr("class", "innerSlice")
      .style("fill", function(d) { return d3.hsl(d.data.color).darker(0.7); })
      .attr("d",function(d){ return pieInner(d, rx+0.5,ry+0.5, h, ir);})
      .each(function(d){this._current=d;});

    slices.selectAll(".topSlice").data(_data).enter().append("path").attr("class", "topSlice")
      .style("fill", function(d) { return d.data.color; })
      .style("stroke", function(d) { return d.data.color; })
      .attr("d",function(d){ return pieTop(d, rx, ry, ir);})
      .each(function(d){this._current=d;});

    slices.selectAll(".outerSlice").data(_data).enter().append("path").attr("class", "outerSlice")
      .style("fill", function(d) { return d3.hsl(d.data.color).darker(0.7); })
      .attr("d",function(d){ return pieOuter(d, rx-.5,ry-.5, h);})
      .each(function(d){this._current=d;});

    slices.selectAll(".percent").data(_data).enter().append("text").attr("class", "percent")
      .attr("x",function(d){ return 0.6*rx*Math.cos(0.5*(d.startAngle+d.endAngle));})
      .attr("y",function(d){ return 0.6*ry*Math.sin(0.5*(d.startAngle+d.endAngle));})
      .text(getPercent).each(function(d){this._current=d;});
  }

  this.Donut3D = Donut3D;
}();


d3.csv("/csv/nutrition_table.csv", function(err, info) {
  var svg = d3.select("body").append("svg").attr("width",700).attr("height",250);
    console.log(info)
  svg.append("g").attr("id","salesDonut");
  svg.append("g").attr("id","quotesDonut");

  var foodData=[
    {label:"Protein", color:"#3366CC", value: parseInt(info[1].Protein) },
    {label:"Fat", color:"#DC3912", value: parseInt(info[1].Fat) },
    {label:"Carbs", color:"#FF9900", value: 0 },
    {label:"Other Weight", color:"#ffffff", value: (100 - parseInt(info[1].Protein) - parseInt(info[1].Fat) )}
  ];

  Donut3D.draw("salesDonut", updateData(), 150, 100, 130, 100, 20, 0.3);
  Donut3D.draw("quotesDonut", updateData(), 450, 100, 130, 100, 20, 0.3);

  function changeData(){
    Donut3D.transition("salesDonut", updateData(), 130, 100, 20, 0.3);
    Donut3D.transition("quotesDonut", updateData(), 130, 100, 20, 0.3);
  }

  function updateData(){
    return foodData.map(function(d){
      return {label:d.label, value:d.value, color:d.color};
    });
  };

  document.getElementById("guaranteed_analysis").checked = true;
});

d3.csv("/csv/ingredients.csv", function(err, more_info) {
    $("body").append("<br/><select id='food_menu' onchange='update(0)'></select>")
    $("body").append("<div id='ingredients'>" + more_info[0].Ingredients + "</div>")

    for (var i = 0; i <= more_info.length; i++) {
      //console.log(more_info[i].Ingredients)
      $("#food_menu").append("<option value='" + i + "'>" + more_info[i].Brand + "</option>")
    }
});

function update(num) {
  console.log()

  var radio = document.getElementsByName("method");

  radio[num].checked = true;

  d3.csv("/csv/nutrition_table.csv", function(err, info) {
    var food_array = []
    var selection = $("#food_menu option:selected").text();
    $("#method").html(info[num].Method)

    for (var i = 0; i < info.length; i++) {
      if (selection == info[i].Brand) {
        food_array.push(info[i])
      }
      if (food_array.length == 3) {
        break
      }
    }

    console.log(food_array)

    var carbs = ( parseInt(food_array[num].Carbs) ? parseInt(info[num].Carbs) : 0)

    var foodData=[
      {label:"Protein", color:"#3366CC", value: parseInt(food_array[num].Protein) },
      {label:"Fat", color:"#DC3912", value: parseInt(food_array[num].Fat) },
      {label:"Carbs", color:"#FF9900", value: carbs },
      {label:"Other Weight", color:"#ffffff", value: (100 - parseInt(info[1].Protein) - parseInt(info[1].Fat) - carbs)}
    ];

    Donut3D.transition("salesDonut", updateData(), 130, 100, 20, 0.3);
    Donut3D.transition("quotesDonut", updateData(), 130, 100, 20, 0.3);

    function updateData(){
      return foodData.map(function(d){
        return {label:d.label, value:d.value, color:d.color};
      });
    };

    d3.csv("/csv/ingredients.csv", function(err, more_info) {
      for (var i = 0; i <= more_info.length; i++) {
        if (more_info[i].Brand == $("#food_menu option:selected").text()) {
          $("#ingredients").html(more_info[i].Ingredients)
          break
        }
      }
    });
  });
};
