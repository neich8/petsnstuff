
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
