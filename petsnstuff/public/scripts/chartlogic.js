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

$(document).ready(function() {

  var foods = $(".foods").html().split(",")

  var foodData=[
    {label:"Protein", color:"#3366CC", value: foods[0] },
    {label:"Fat", color:"#DC3912", value: foods[1] },
    {label:"Carbs", color:"#FF9900", value: foods[2] },
    {label:"Other Weight", color:"#ffffff", value: 100 - foods[0] - foods[1] - foods[2]}
  ];

  Donut3D.draw("leftGraph", updateData(foodData), 150, 100, 130, 100, 20, 0.3);
  Donut3D.draw("rightGraph", updateData(foodData), 550, 100, 130, 100, 20, 0.3);

  changeData("left", foodData)
  changeData("right", foodData)

  document.getElementById("guaranteed_analysis").checked = true;

});

function change_brand(side) {
  var selection = $("#food_menu_" + side + " option:selected").text()

  $.post( '/brands/' + selection, function(response){
    $("#ingredients_" + side).html(response.ingredient.Ingredients);
    $("#food0_" + side).text(response.foods[0].Protein + "," + response.foods[0].Fat + "," + response.foods[0].Carbs)
    $("#food1_" + side).text(response.foods[1].Protein + "," + response.foods[1].Fat + "," + response.foods[1].Carbs)
    $("#food2_" + side).text(response.foods[2].Protein + "," + response.foods[2].Fat + "," + response.foods[2].Carbs)

    var foodData=[
      {label:"Protein", color:"#3366CC", value: response.foods[0].Protein },
      {label:"Fat", color:"#DC3912", value: response.foods[0].Fat },
      {label:"Carbs", color:"#FF9900", value: response.foods[0].Carbs },
      {label:"Other Weight", color:"#ffffff", value: 100 - response.foods[0].Protein - response.foods[0].Fat - response.foods[0].Carbs }
    ];

    if ( $('#guaranteed_analysis').is(':checked') ){
      change_analysis(0)
    }
    if ( $('#dry_matter_basis').is(':checked') ) {
      change_analysis(1)
    };
    if ( $('#calorie_weighted_basis').is(':checked') ) {
      change_analysis(2)
    };

  })
};

function change_analysis(num) {


  var left_foods = $($(".left_foods")[num]).html().split(",")
  var right_foods = $($(".right_foods")[num]).html().split(",")

  var left_foodData=[
    {label:"Protein", color:"#3366CC", value: left_foods[0] },
    {label:"Fat", color:"#DC3912", value: left_foods[1] },
    {label:"Carbs", color:"#FF9900", value: left_foods[2] },
    {label:"Other Weight", color:"#ffffff", value: 100 - left_foods[0] - left_foods[1] - left_foods[2]}
  ];

  var right_foodData=[
    {label:"Protein", color:"#3366CC", value: right_foods[0] },
    {label:"Fat", color:"#DC3912", value: right_foods[1] },
    {label:"Carbs", color:"#FF9900", value: right_foods[2] },
    {label:"Other Weight", color:"#ffffff", value: 100 - right_foods[0] - right_foods[1] - right_foods[2]}
  ];

  changeData("left", left_foodData)
  changeData("right", right_foodData)
}

  function changeData(side, foodData){
    Donut3D.transition(side + "Graph", updateData(foodData), 130, 100, 20, 0.3);
  }

  function updateData(foodData){
    return foodData.map(function(d){
      return {label:d.label, value:d.value, color:d.color};
    });
  };