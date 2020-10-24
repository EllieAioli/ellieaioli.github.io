
var debug = 0;
$(document).ready(function() {
	var defaultMap = "files/df2map_10-16-20.jpg";
	//test

	function thousands_separators(num){
	    var num_parts = num.toString().split(".");
	    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	    return num_parts.join(".");
  	}

	function makeDraggies(){
		$('.dragging').draggable();
		$('.info-panel').draggable({
			containment: "parent"
		});

	};

	makeDraggies();

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
	var tableMode = 0;
	var init = true;
	function generateTable(precise){
		if (!init) {
			if (tableMode == 0){tableMode=1}
			else if (tableMode == 1){tableMode=0};
		};
		if(precise){
			var number_of_rows = 18*2;
			var number_of_cols = 24*2;
			var pClass = "hidden_dot"
		} else {
			var number_of_rows = 18;
			var number_of_cols = 24;
			var pClass = "hidden_dot_big"
		};
		init = false;

		var table_body = '<table id="genTable" class="noselect" border="1">';
		for(var i=0;i<number_of_rows;i++){
			table_body+='<tr>';
			for(var j=0;j<number_of_cols;j++){
				var temp_rows = number_of_rows - i;
				var temp_cols = j + 1;
				table_body +='<td id="'+temp_cols+'-'+temp_rows+'" class="td_square"><div class="flex-box"><div class="inner">';
				table_body +='<p class="'+pClass+'">&#11044;</p>';
				table_body +='</div></div></td>';
			}
			table_body+='</tr>';
		}
		table_body+='</table>';
		$('#tableDiv').html(table_body);
	}
	generateTable();
  	

	
	

	$('#tableDiv').on('click', '.td_square', function(e){
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

	$("#btnPrecise").on("click", function(e) {
		$.confirm({
	    	title: 'Confirm!',
	    	content: 'This will clear all markers! Are you sure?',
	   	 	buttons: {
	        	confirm: function () {
	            	if (tableMode==0) {generateTable(true)}
					else if (tableMode==1){generateTable()}
	        	},
	        	cancel: function () {
	        		// do nothing
	        	}
	    	}
		});
		
	});

	function SortMissions(a, b) {
		if (a[1] === b[1]) {
			return 0;
		}
		else {
			return (a[1] < b[1]) ? -1 : 1;
		}
	} // https://stackoverflow.com/questions/16096872/how-to-sort-2-dimensional-array-by-column-value

	// On mision csv upload
	$("#itemMissions").on('change', function(){
		// cumulators
		var cash = 0;
		var exp = 0;
		var numMissions = 0;
		
		$.confirm({
	    	title: 'Confirm!',
	    	content: 'Make sure your filter settings are correct! <br><span style="color:red;font-weight:bold">This will wipe all mission labels!!</span>',
	   	 	buttons: {
	        	confirm: function () {
					var minCash = parseInt($("#txtMinCash").val());
					var minExp = parseInt($("#txtMinEXP").val());
					var chkGuides = $("#chkGuides").prop('checked');
					if (isNaN(minCash)){minCash=0;}
					if (isNaN(minExp)){minExp=0;}

					$(".draggies").remove();

					const missionArray = [];
					//eg. [[building,city,cash,exp]]
	            	Papa.parse($("#itemMissions").prop('files')[0], {
						header: true,
						step: function(results) {
							
							if(typeof results.data["Mission Building"] !== "undefined") {
								var mission = [];
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
										mission = [buildingName,cityName,missionCash,missionEXP];
										missionArray.push(mission);
									} else if (chkGuides == false) {
										numMissions++;
										cash += parseInt(results.data["Cash"]);
										exp += parseInt(results.data["Exp"]);
										mission = [buildingName,cityName,missionCash,missionEXP];
										missionArray.push(mission);
									}
								}
							}
						},
						complete: function(results) {
							$("#lblCash").val(thousands_separators(cash));
							$("#lblEXP").val(thousands_separators(exp));
							$("#lblNumMissions").val(numMissions);
							/*$("#lblCash").attr("value",thousands_separators(cash));
							$("#lblEXP").attr("value",thousands_separators(exp));
							$("#lblNumMissions").attr("value",numMissions);*/
							missionArray.sort(SortMissions);
							for (var i=0;i<missionArray.length;i++) {
								var buildingName = missionArray[i][0];
								var cityName = missionArray[i][1];
								$(".missionBox").append(drag1+buildingName+drag2+cityName+drag3);
							};
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
	/*
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
	*/

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

