
var debug = 0;
$(document).ready(function() {
	var defaultMap = "files/df2map_10-22-20.jpg";

	function thousands_separators(num){
	    var num_parts = num.toString().split(".");
	    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	    return num_parts.join(".");
  	}

  	/*function sortBuildIndex(){
		var listItems = $("#sortable input");
		var i = 1;
		for (let li of listItems) {
			$(li).val(i);
			i++;
		}	
	}*/

	function makeDraggies(){
		$('.dragging').draggable();
		$('.info-panel').draggable({
			containment: "parent"
		});

	};


	makeDraggies();

	var li1 = '<li class="customLi list-group-item ui-state-default py-0"><div class="flex-box"><div style="flex:1;min-width:40px;"><input type="text" class="txtLetter" value="1"><i class="fa fa-sort"></i></div><div style="flex:10;"><textarea class="txtBuilding" placeholder="Building name.." rows="1">'
	var li2 = '</textarea></div><div style="flex:5;"><textarea class="txtBuilding" placeholder="City name.." rows="1">'
	var li3 = '</textarea></div><div style="flex:1"><a href="#" class="btnDelete badge badge-pill badge-danger noselect" style="color:white;">-</a></div></div></li>'


	var drag1 = `<div id="dragbox" class="draggies">
					<div style="display: flex;">
						<div>
							<div class="dragging">
								<div style="width:3ch;">
									<i class="fas fa-arrows-alt" style="color:#eee;"></i>
								</div>
								<div>
								  	<textarea class="draggyBuilding" placeholder="Building" rows="1">`
	var drag2 = `</textarea>
							 	</div>
					 		</div>
					 	</div>
				 		<div>
							<textarea class="draggyCity" placeholder="City" rows="1">`
	var drag3 = `</textarea>
						</div>
					 	<!--<div class="hideable">
							<a href="#" class="btnDelete fa fa-minus-circle" style="color:#470F0B;background-color:white;font-size: 10pt;margin-left: 4px;margin-bottom: 2px;border-radius: 50%;border:-1;"></a>
						</div>-->
				  	</div>
				</div>`
  	
	//table generation over map image
  	var number_of_rows = 18;
  	var number_of_cols = 24;
 	var table_body = '<table id="genTable" class="noselect" border="1">';
	for(var i=0;i<number_of_rows;i++){
		table_body+='<tr>';
		for(var j=0;j<number_of_cols;j++){
    		var temp_rows = number_of_rows - i;
    		var temp_cols = j + 1;
        	table_body +='<td id="'+temp_cols+'-'+temp_rows+'" class="td_square"><div class="flex-box"><div class="inner">';
        	//table_body +='<input type="text" class="squareInput">';
        	table_body +='<p class="hidden_dot">&#11044;</p>';
        	table_body +='</div></div></td>';
		}
		table_body+='</tr>';
	}
	table_body+='</table>';
	$('#tableDiv').html(table_body);

	
	

	$('.td_square').on('click', function(e){
		$(this).find("p").toggleClass("selected");
	});

	$('.td_square').hover(function(){
		$('#lblCoords').attr('value',$(this).attr('id'));
	});

	$('.squareInput').on("change",function(e){
		//change background color maybe
	});

	$('#btnBorders').on('click', function(e){
		$('#genTable').toggleClass("hidden_border");
	});

	

	$('#btnClear').on('click', function(e){
		$.confirm({
	    	title: 'Confirm!',
	    	content: 'Are you sure you want to delete all map markers?',
	   	 	buttons: {
	        	confirm: function () {
	            	$("p").removeClass("selected");
	        	},
	        	cancel: function () {
	        		// do nothing
	        	}
	    	}
		});
	});


	$("#btnMapURLSubmit").on('click',function(e){
		var imageURL = $("#mapURL").val();
		if (imageURL != ""){
			$('#genTable').css("background-image", 'url('+imageURL+')');
		}
		
	});


	// Browse file button
	$("#customFile").on("change", function() {
  		$('#genTable').css("background-image", 'url('+URL.createObjectURL(this.files[0])+')');
	});

	// On mision csv upload
	$("#itemMissions").on('change', function(){
		// cumulators
		var cash = 0;
		var exp = 0;
		var numMissions = 0;
		
		$.confirm({
	    	title: 'Confirm!',
	    	content: 'Make sure your filter settings are correct! <br><span style="color:red;font-weight:bold">THIS WILL WIPE ALL CURRENT MISSIONS!!</span>',
	   	 	buttons: {
	        	confirm: function () {
					var minCash = parseInt($("#txtMinCash").val());
					var minExp = parseInt($("#txtMinEXP").val());
					var chkGuides = $("#chkGuides").prop('checked');
					if (isNaN(minCash)){minCash=0;}
					if (isNaN(minExp)){minExp=0;}

					$(".draggies").remove();

	            	Papa.parse($("#itemMissions").prop('files')[0], {
						header: true,
						step: function(results) {
							// todo: sort list of filtered missions by city desc and then building desc
							if(typeof results.data["Mission Building"] !== "undefined") {
								var missionCash = results.data["Cash"];
								var missionEXP = results.data["Exp"];
								var missionGuide = results.data["Quest Walkthrough"];
								var missionType = results.data["Mission Type"];

								if (missionCash >= minCash && missionEXP >= minExp && missionType != "Exterminate") {
									var buildingName = results.data["Mission Building"];
									var cityName = results.data["Mission City"];

									if (chkGuides == true && missionGuide != "add guide") {
										numMissions++;
										cash += parseInt(results.data["Cash"]);
										exp += parseInt(results.data["Exp"]);
										//$("#sortable").append(li1+buildingName+li2+cityName+li3);
										$(".missionBox").append(drag1+buildingName+drag2+cityName+drag3)
									} else if (chkGuides == false) {
										numMissions++;
										cash += parseInt(results.data["Cash"]);
										exp += parseInt(results.data["Exp"]);
										//$("#sortable").append(li1+buildingName+li2+cityName+li3);
										$(".missionBox").append(drag1+buildingName+drag2+cityName+drag3)
									}
								}
							}
						},
						complete: function(results) {
							//sortBuildIndex();
							$("#lblCash").html(thousands_separators(cash));
							$("#lblEXP").html(thousands_separators(exp));
							$("#lblNumMissions").html(numMissions);
							makeDraggies();
						}
					});
	        	},
	        	cancel: function () {
	        		// do nothing
	        	}
	    	}
		});
		
	});

	$('#txtTextColor').on('input',function(e){
		$('.draggyBuilding').css("color",$('#txtTextColor').val());
	});

	$('#resetMap').on('click',function(e){
		$('#genTable').css('background-image', 'url('+defaultMap+')');
	});

	$('#btnRemoveAllMissions').on('click',function(e){
		$.confirm({
	    	title: 'Confirm!',
	    	content: 'Are you sure you want to clear all missions?',
	   	 	buttons: {
	        	confirm: function () {
	            	$(".draggies").remove();
	        	},
	        	cancel: function () {
	        		// do nothing
	        	}
	    	}
		});
		
	});

	$(".missionBox").on('click','.btnDelete',function(e){
		var current = $(this)
		$.confirm({
	    	title: 'Confirm!',
	    	content: 'Are you sure you want to delete?',
	   	 	buttons: {
	        	confirm: function () {
	            	current.parents(".draggies").remove();
	        	},
	        	cancel: function () {
	        		// do nothing
	        	}
	    	}
		});
		
		//sortBuildIndex()
	});

	/*$("#sortable").sortable();
	$("#sortable").disableSelection();


	$("#sortable").on("sortstop", function(){
		sortBuildIndex();
	});*/

	$("#btnHideControls").on("click",function(e){
		//$("#controls").toggle();
		//$(".btnDelete").toggle();
		//$(".fa-sort").toggle();
		$(".hideable").toggle();
		$(".fa-arrows-alt").toggleClass("invisible_text");
		$('.draggyBuilding').toggleClass("draggyClean");
		$('#info-textarea').toggleClass("draggyClean");
	});
	

	$("#btnAddBuilding").on('click', function(e){
		//$("#sortable").append(li1+li2+li3)
		$(".missionBox").append(drag1+drag2+drag3);
		makeDraggies();
		//sortBuildIndex();
	});



	// confirms page refresh
	$(window).bind('beforeunload', function(){
		if(debug==0) {
			return 'Are you sure you want to leave?';
		}
	  	
	});

});

