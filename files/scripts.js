
var debug = 0;
$(document).ready(function() {
	var defaultMap = "files/df2map_10-16-20.jpg";

	function thousands_separators(num){
		try {
			var num_parts = num.toString().split(".");
			num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			return num_parts.join(".");
		} catch {
			return;
		}
  	}

	function makeDraggies(){
		$('.dragging').draggable();
		$('#info-panel').draggable({
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
									  <textarea id ="` 
	var drag1alt_a = `<div id="dragbox" class="draggies">
					<div style="display: flex;">
						<div>
							<div class="dragging ui-draggable ui-draggable-handle" style="position: relative; left: `
	var drag1alt_b = `; top: `
	var drag1alt_c = `;">
								<div style="width:3ch;">
									<i class="fas fa-arrows-alt" style="color:#eee;"></i>
								</div>
								<div>
									<textarea id ="` 								
	var drag2 = `" class="draggyBuilding" placeholder="Building" rows="1">`

	var drag3 = `</textarea>
							 	</div>
					 		</div>
					 	</div>
				 		<div>
							<textarea class="draggyCity" placeholder="City" rows="1">`
	var drag4 = `</textarea>
						</div>
					 	<!--<div class="hideable">
							<a href="#" class="btnDelete fa fa-minus-circle" style="color:#470F0B;background-color:white;font-size: 10pt;margin-left: 4px;margin-bottom: 2px;border-radius: 50%;border:-1;"></a>
						</div>-->
				  	</div>
				</div>`
	
	// load infoPanelArray Cookies, or initialize
	if(typeof(Cookies.get('infoPanelArray')) == "undefined") {
		var infoPanelArray = new Array(4);
		Cookies.set('infoPanelArray',JSON.stringify(infoPanelArray), {sameSite: 'Lax'});
	} else {
		var infoPanelArray = JSON.parse(Cookies.get('infoPanelArray'));
		$('#lblNumMissions').val(thousands_separators(infoPanelArray[0]));
		$('#lblCash').val(thousands_separators(infoPanelArray[1]));
		$('#lblEXP').val(thousands_separators(infoPanelArray[2]));
		$('#info-textarea').val(infoPanelArray[3]);
	}


	//table generation over map image
	if(typeof(localStorage.getItem('missionArray')) == "undefined") {
		var init = true;
	} else { 
		var init = false;
	}

	if(typeof(Cookies.get('preciseMode')) == "undefined") {
		var initPreciseMode = false
	} else { 
		if (Cookies.get('preciseMode') == 0){
			var initPreciseMode = false;
		} else {
			var initPreciseMode = true;
			$('#btnPrecise').attr('aria-pressed','true');
			$('#btnPrecise').addClass('active');
		}
	}
	
	function generateTable(precise){
		if (init) { Cookies.set('preciseMode',0, {sameSite: 'Lax'}) };
		
		if(precise){
			var number_of_rows = 18*2;
			var number_of_cols = 24*2;
			var pClass = "hidden_dot"
			Cookies.set('preciseMode',1, {sameSite: 'Lax'})
		} else {
			var number_of_rows = 18;
			var number_of_cols = 24;
			var pClass = "hidden_dot_big"
			Cookies.set('preciseMode',0, {sameSite: 'Lax'})
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
	generateTable(initPreciseMode);

	// load markerArray Cookies, or initialize
	if(typeof(Cookies.get('markerArray')) == "undefined") {
		var markerArray = [];
		Cookies.set('markerArray',markerArray, {sameSite: 'Lax'});
	} else { 
		 // loop and modify id's in markerArray
		 try{
			var markerArray = JSON.parse(Cookies.get('markerArray'));
		 } catch {
			var markerArray = []; 
		 }
		 
		 for(var i = 0;i < markerArray.length; i++) {
			$('#'+markerArray[i]).find("p").toggleClass("selected");
		 }
	}

	if(typeof(Cookies.get('backgroundURL')) == "undefined") {
		Cookies.set('backgroundURL',defaultMap, {sameSite: 'Lax'});
	} else {
		$('#genTable').css('background-image', 'url('+Cookies.get('backgroundURL')+')');
	}

	function clearMissionCookies(){
		//Cookies.remove('missionArray');
		localStorage.removeItem('missionArray');
		missionArray = [];	
	}

	function clearMarkerCookies() {
		markerArray = [];
		Cookies.set('markerArray',markerArray);
		$("p").removeClass("selected");
	}

	function clearInfoPanelCookies(){
		infoPanelArray = new Array(4);
		Cookies.set('infoPanelArray',JSON.stringify(infoPanelArray), {sameSite: 'Lax'});
	}

	// if missionArray cookie exists, reconstruct the labels
	if(localStorage.getItem('missionArray') != null) {
		var missionArray = JSON.parse(localStorage.getItem('missionArray'));
		$(".draggies").remove();
		missionArray.sort(SortMissionsbyID);
		for (var i=0;i<missionArray.length;i++) {
			var buildingName = missionArray[i][1];
			var cityName = missionArray[i][2];
			var left = missionArray[i][5]
			var top = missionArray[i][6]
			$(".missionBox").append(drag1alt_a+left+drag1alt_b+top+drag1alt_c+i+drag2+buildingName+drag3+cityName+drag4);
		};
		makeDraggies();
	} else {
		var missionArray = [];
	}
	
	// on drag stop of a mission label
	$('.missionBox').on('dragstop','.dragging', function(){
		// search for the current draggy's id in missionArray and update its position
		for (var i=0;i<missionArray.length;i++){
			if(missionArray[i][0] == $(this).find('textarea').attr('id')){
				//set position
				missionArray[i][5] = $(this).css('left');
				missionArray[i][6] = $(this).css('top');
			}
		}
		localStorage.setItem('missionArray', JSON.stringify(missionArray));
		//Cookies.set('missionArray', JSON.stringify(missionArray), {sameSite: 'Lax'});
	});

	// on tile click

	$('#tableDiv').on('click', '.td_square', function(e){
		$(this).find("p").toggleClass("selected");
		if(markerArray.indexOf($(this).attr('id')) !== -1){
			//exists
			markerArray.splice(markerArray.indexOf($(this).attr('id')));
		} else {
			markerArray.push($(this).attr('id'));
		}
		Cookies.set('markerArray',JSON.stringify(markerArray), {sameSite: 'Lax'});
		console.log(markerArray);
	});

	// on hide borders button click
	$('#btnBorders').on('click', function(e){
		$('#genTable').toggleClass("hidden_border");
	});

	// on clear markers button click
	$('#btnClear').on('click', function(e){
		$.confirm({
	    	title: 'Confirm!',
	    	content: 'Are you sure you want to delete all map markers?',
	   	 	buttons: {
	        	confirm: function () {
	            	clearMarkerCookies();
	        	},
	        	cancel: function () {
	        		// do nothing
	        	}
	    	}
		});
	});

	
	// on map url button submit
	$("#btnMapURLSubmit").on('click',function(e){
		var imageURL = $("#mapURL").val();
		if (imageURL != ""){
			Cookies.set('backgroundURL',imageURL, {sameSite: 'Lax'});
			$('#genTable').css("background-image", 'url('+imageURL+')');
		}
	});

	// on "browse for map file" button state change
	$("#customFile").on("change", function(e) {
		Cookies.set('backgroundURL',URL.createObjectURL(this.files[0]), {sameSite: 'Lax'});
  		$('#genTable').css("background-image", 'url('+URL.createObjectURL(this.files[0])+')');
	});

	// on reset map button click
	$('#resetMap').on('click',function(e){
		Cookies.set('backgroundURL',defaultMap, {sameSite: 'Lax'});
		$('#genTable').css('background-image', 'url('+defaultMap+')');
	});

	// on precice placement button click
	$("#btnPrecise").on("click", function(e) {
		$.confirm({
	    	title: 'Confirm!',
	    	content: 'This will clear all markers! Are you sure?',
	   	 	buttons: {
	        	confirm: function () {
					clearMarkerCookies();
	            	if (Cookies.get('preciseMode')==0) {generateTable(true)}
					else if (Cookies.get('preciseMode')==1){generateTable()}
	        	},
	        	cancel: function () {
					// do nothing
					if(Cookies.get('preciseMode')==0) {
						$('#btnPrecise').removeClass('active');
						$('#btnPrecise').attr('aria-pressed','false');
					} else {
						$('#btnPrecise').addClass('active');
						$('#btnPrecise').attr('aria-pressed','true');
					}
	        	}
	    	}
		});
	});

	$('#lblNumMissions').on('input',function(){
		infoPanelArray[0] = $(this).val();
		Cookies.set('infoPanelArray',JSON.stringify(infoPanelArray), {sameSite: 'Lax'});
	});

	$('#lblCash').on('input',function(){
		infoPanelArray[1] = $(this).val();
		Cookies.set('infoPanelArray',JSON.stringify(infoPanelArray), {sameSite: 'Lax'});
	});


	$('#lblEXP').on('input',function(){
		infoPanelArray[2] = $(this).val();
		Cookies.set('infoPanelArray',JSON.stringify(infoPanelArray), {sameSite: 'Lax'});
	});

	$('#info-textarea').on('input',function(){
		infoPanelArray[3] = $(this).val();
		console.log($(this).val());
		Cookies.set('infoPanelArray',JSON.stringify(infoPanelArray), {sameSite: 'Lax'});
	});

	// https://stackoverflow.com/questions/16096872/how-to-sort-2-dimensional-array-by-column-value
	function SortMissions(a, b) {
		if (a[1] === b[1]) {
			return 0;
		}
		else {
			return (a[1] < b[1]) ? -1 : 1;
		}
	}

	function SortMissionsbyID(a,b) {
		if (a[0] === b[0]) {
			return 0;
		}
		else {
			return (a[0] < b[0]) ? -1 : 1;
		}
	}

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
					clearMissionCookies();
	
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
										cash += parseInt(results.data["Cash"]);
										exp += parseInt(results.data["Exp"]);
										mission = [numMissions,buildingName,cityName,missionCash,missionEXP,0,0];
										missionArray.push(mission);
										numMissions++;
									} else if (chkGuides == false) {
										cash += parseInt(results.data["Cash"]);
										exp += parseInt(results.data["Exp"]);
										mission = [numMissions,buildingName,cityName,missionCash,missionEXP,0,0];
										missionArray.push(mission);
										numMissions++;
									}
								}
							}
						},
						complete: function(results) {
							$("#lblNumMissions").val(thousands_separators(numMissions));
							$("#lblCash").val(thousands_separators(cash));
							$("#lblEXP").val(thousands_separators(exp));
							missionArray.sort(SortMissionsbyID);
							console.log(missionArray);
							for (var i=0;i<missionArray.length;i++) {
								var buildingName = missionArray[i][1];
								var cityName = missionArray[i][2];
								$(".missionBox").append(drag1+i+drag2+buildingName+drag3+cityName+drag4);
							};
							infoPanelArray[0] = numMissions;
							infoPanelArray[1] = cash;
							infoPanelArray[2] = exp
							Cookies.set('infoPanelArray',JSON.stringify(infoPanelArray), {sameSite: 'Lax'});
							localStorage.setItem('missionArray', JSON.stringify(missionArray));
							//Cookies.set('missionArray', JSON.stringify(missionArray), {sameSite: 'Lax'});
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

	// change label text color in txtTextColor input change
	$('#txtTextColor').on('input',function(e){
		$('.draggyBuilding').css("color",$('#txtTextColor').val());
	});

	

	$('#btnRemoveAllMissions').on('click',function(e){
		$.confirm({
	    	title: 'Confirm!',
	    	content: 'Are you sure you want to clear all missions?',
	   	 	buttons: {
	        	confirm: function () {
					$(".draggies").remove();
					clearMissionCookies()
	        	},
	        	cancel: function () {
	        		// do nothing
	        	}
	    	}
		});
	});

	$('#btnClearCookies').on('click',function(e){
		$.confirm({
	    	title: 'Confirm!',
	    	content: '<span style="color:red;font-weight:bold">THIS WILL CLEAR EVERYTHING!!!</span>',
	   	 	buttons: {
	        	confirm: function () {
					clearMissionCookies();
					clearInfoPanelCookies();
					clearMarkerCookies();
					Cookies.set('backgroundURL',defaultMap, {sameSite: 'Lax'});
					$(".draggies").remove();
					$('#lblNumMissions').val("");
					$('#lblCash').val("");
					$('#lblEXP').val("");
					$('#info-textarea').val("");
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

	$("#btnHideControls").on("click",function(e){
		$(".hideable").toggle();
		$(".fa-arrows-alt").toggleClass("invisible_text");
		$('.draggyBuilding').toggleClass("draggyClean");
		$('#info-textarea').toggleClass("draggyClean");
	});
	
	$("#btnAddBuilding").on('click', function(e){
		$(".missionBox").append(drag1+drag2+drag3+drag4);
		makeDraggies();
	});

	// confirms page refresh
	$(window).bind('beforeunload', function(){
		if(debug==0) {
			return 'Are you sure you want to leave?';
		}
	  	
	});

});

