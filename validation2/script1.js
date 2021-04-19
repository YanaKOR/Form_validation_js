$(document).ready(function (){
	var records = [];
	var settings = {};
	
	var typeNumber = 1;
	var typeEnum = 2;
	var typeCalc = 3;
	var typeImage = 4;
	
	var mans = ['Vasia', 'Petr', 'Mish'];
	var womans = ['Kate', 'Olia', 'Masha'];
	
	var manConst = 'Man';
	var womanConst = 'Woman';
	
	var manConstUrl = 'img/male.png';
	var womanConstUrl = 'img/female.jpg';
	
	init();
	
	function init(){
		settings = {
			selector: 'table',
			rowCount: 20,
			fields: [
				generateEnumFieldObj("Sex", [manConst, womanConst], true),
				generateEnumFieldObj("SexImage", [manConstUrl, womanConstUrl], false, typeImage),
				generateCalcFieldObj("Name", function (record){
					if (record.Sex == manConst){
						return getRandomFromArray(mans);
					}
					return getRandomFromArray(womans);
				}),
				generateNumberFieldObj("Age", 15, 35),
				generateNumberFieldObj("Money", 0, 1000),
				generateNumberFieldObj("Height", 150, 200),
				generateNumberFieldObj("Weight", 50, 100),
				generateCalcFieldObj("Index", function (record){
					var heightInMetors = record.Height /100;
					return myRound(record.Weight / (heightInMetors * heightInMetors));
				}),
			]
		};
		generateTableCool(settings);
	}
	
	function generateEnumFieldObj(name, values, isHidden, customType){
		return {
			name: name,
			cellType: customType ? customType : typeEnum,
			values: values,
			isHidden: isHidden,
		};
	}
	
	function generateNumberFieldObj(name, min, max){
		return {
			name: name,
			cellType: typeNumber,
			min: min,
			max: max
		};
	}
	
	function generateCalcFieldObj(name, formula){
		return {
			name: name,
			cellType: typeCalc,
			formula: formula
		};
	}
	
	$('.popup').hide();
	
	$('.showPreview').click(function (){
		var errors = validAndGetErrors();
		if (errors.length > 0){
			$('.errors').text('validation is fail');
			for(var i = 0; i < errors.length; i++){
				var error = errors[i];
				var p = $('<p>');
				p.text(error);
				$('.errors').append(p);
			}
			return;
		}else{
			$('.errors').empty();
		}
		
		fillName();
		
		fillSex();
		
		fillCity();
		
		fillAge();
		
		fillBorder();
	});
	
	$('.close').click(function (){
		$('.popup').hide();
	});
	
	$('.left .button').click(function (){
		$('.left .button').removeClass('active');
		$(this).addClass('active');
	});
	
	$('.girl .header').click(removeImageBlock);
	
	$('#addNewBlock').click(function (){
		var name = $('#nameNewGirl').val();
		var url = $('#urlNewGirl').val();
		
		var copy = $('.template .girl').clone();
		copy.find('.header').text(name);
		copy.find('.image img').attr('src', url);
		
		$('.gallery').append(copy);
		
		$('#nameNewGirl').val('');
	});
	
	function removeImageBlock(){
		var headerIntoGirl = $(this);
		var girlBlock = $(this).parent();
		girlBlock.remove();
	}

	function validAndGetErrors(){
		var errors = [];
		var name = $('#login').val();
		if (name.length < 2){
			errors.push("name must be more than 2 symbol");
		}
		
		var pass = $('.password').val();
		if (pass == '123'){
			errors.push("pass not able 123");
		}
		
		var sex = $("[name=sex]:checked").val();
		if (!sex){
			errors.push("sex not choosen");
		}
		
		var age = getAge();
		if(!Number.isInteger(age)){
			errors.push("Select date");
		}
		if (age > 20){
			errors.push("Too old");
		}
		
		//RGB
		//#ab00f2
		var borderColor = $('.border-color').val();
		if (borderColor[1] != '0'
			|| borderColor[2] != '0'){
			errors.push("No Red!");
		}
		
		return errors;
	}
	
	function getAge(){
		var dateStr = $('.birthday').val();
		var date = Date.parse(dateStr);
		var age = (Date.now() - date)/1000/60/60/24/365;
		age = Math.round(age);
		return age;
	}

	function fillName(){
		var name = $('#login').val();
		$('.preview span.name').text(name);
	}

	function fillSex(){
		var sex = $("[name=sex]:checked").val();
		if (sex == 'm'){
			$('.preview span.sex').text('man');
		}else if (sex == 'f'){
			$('.preview span.sex').text('woman');
		}
	}

	function fillCity(){
		var city = $(".data .city option:checked").val();
		switch(city){
			case '1':
				$('.preview .city').text('capital');
				$('.cityImg').attr('src', 'https://q-xx.bstatic.com/xdata/images/hotel/840x460/166839295.jpg?k=f9bfea9847a3ad2b21294535af7209f226e09b2cc68ddcf7a3be4ec801f13659&o=');
				break;
			case '2':
				$('.preview .city').text('in another country');
				$('.cityImg').attr('src', 'https://img5.eadaily.com/r650x400/o/c41/294c6d744c4511fc1cc4af9b75bc7.jpg');
				break;
			case '3':
				$('.preview .city').text('not so far');
				$('.cityImg').attr('src', 'https://static.bobr.by/2015/07/14/kvadro_bobr.by_1.jpg');
				console.log('3');
				break;
		}
	}

	function fillAge(){
		var age = getAge();
		$('.preview .age').text(age);
	}
	
	function fillBorder(){
		var borderSize = $('#sizeInput').val() - 0;
		$('.preview').css('border-width', borderSize);
		// '#ff00ab'
		var borderColor = $('.border-color').val();
		$('.preview').css('border-color', borderColor);
	}

	function generateTableCool(settings){
		setDefaultSettings(settings);
		
		generateTableHeader(settings);
		
		records = generateRecords(settings);
		
		records = records.sort(function (a, b){
			return a.Age - b.Age;
		});		

		generateTableBody(settings, records);
		
		generateTableTotal(settings, records);
	}
	
	function setDefaultSettings(settings){
		if (!settings.selector){
			settings.selector = '#table table';
		}
		
		if (!settings.rowCount){
			settings.rowCount = 10;
		}
	}
	
	function generateTableHeader(settings){
		var table = $(settings.selector);
		var rowHeader = $("<tr>");
		for(var i = 0; i < settings.fields.length; i++){
			var field = settings.fields[i];
			if (field.isHidden){
				continue;
			}
			var cell = generateCellWithFixValue(field.name);
			cell.addClass('sort');
			$(cell).click(sortTable);
			rowHeader.append(cell);
		}
		table.append(rowHeader);
	}
	
	function sortTable(){
		var columnName = $(this).text();
		var direction = $(this).data('dir');
		if (direction == undefined){
			direction = 1;
		}
		$(this).data('dir', direction == 1 ? -1 : 1);
		
		var table = $(settings.selector);
		
		table.find('tr:not(:first-child)').remove();
		
		records = records.sort(function (a, b){
			if (typeof(a[columnName]) == 'string'){
				if(a[columnName] < b[columnName]) { return -1 * direction; }
				if(a[columnName] > b[columnName]) { return 1 * direction; }
				return 0;
			}
			
			return (a[columnName] - b[columnName]) * direction;
		});		

		generateTableBody(settings, records);
	}
	
	function generateRecords(settings){
		var records = [];
		for(var i = 0; i < settings.rowCount; i++){
			var record = {};

			for(var k = 0; k < settings.fields.length; k++){
				var field = settings.fields[k];
				var value;
				switch(field.cellType){
					case typeNumber:
						value = randomInteger(field.min, field.max);
						break;
					case typeEnum:
					case typeImage:
						value = getRandomFromArray(field.values);
						break;
					case typeCalc:
						value = field.formula(record);
						break;
				}
				
				record[field.name] = value;
			}
			records.push(record);
		}
		
		return records;
	}

	function generateTableBody(settings, records){
		var table = $(settings.selector);
		for(var i = 0; i < records.length; i++){
			var row = $("<tr>");
			
			var record = records[i];
			
			for(var k = 0; k < settings.fields.length; k++){
				var field = settings.fields[k];
				var cell;
				if (field.isHidden){
					continue;
				}
				if (field.cellType == typeImage){
					cell = generateCellWithImage(record[field.name]);
				}else{
					cell = generateCellWithFixValue(record[field.name]);
				}
				row.append(cell);	
				
			}
			table.append(row);
		}
		
		return records;
	}
	
	function generateTableTotal(settings, records){
		var table = $(settings.selector);
		var rowHeader = $("<tr>");
		for(var i = 0; i < settings.fields.length; i++){
			var field = settings.fields[i];
			
			switch(field.cellType){
				case typeNumber:
				case typeCalc:
					var summ = records
						.map(function (record){
							return record[field.name] - 0;
						})
						.reduce(function (summ, a){
							return summ + a;
						});
					var cell = generateCellWithFixValue(summ);
					rowHeader.append(cell);
					break;
				case typeEnum:
					var values = records
						.map(function (record){
							return record[field.name];
						});
					var valAndCount = [];
					for(var k = 0; k < values.length; k++){
						var v = values[k];
						AddOrUpdate(valAndCount, v);
					}
					
					valAndCount = valAndCount.sort(function (item1, item2){
						return item2.count - item1.count;
					});
				
					var cell = generateCellWithFixValue(valAndCount[0].value);
					rowHeader.append(cell);
					break;
			}
		}
		table.append(rowHeader);
	}
	
	function AddOrUpdate(items, newVal){
		var newItem = items.find(function (item){
			return item.value == newVal;
		});
		if (!newItem){
			newItem = {
				value: newVal,
				count: 0
			};
			items.push(newItem);
		}
		newItem.count++;
	}

	function generateTable(){
		var table = $('#table table');
		
		var names = ['Kate', 'Pol', 'Jane'];
		
		var totalAge = 0;
		var totalHeight = 0;
		var totalWeight = 0;
		var totalIndex = 0;
		
		for(var i = 0; i < 10; i++){
			var row = $("<tr>");
		
			var name = getRandomFromArray(names);
			var cellName = generateCellWithFixValue(name);
			row.append(cellName);
			
			var cellAge = generateCellWithRandomNumber(15, 35);
			row.append(cellAge);
			totalAge += cellAge.text() - 0;
			
			var cellHegiht = generateCellWithRandomNumber(150, 200);
			row.append(cellHegiht);
			totalHeight += cellHegiht.text() - 0;
			
			var cellWeight = generateCellWithRandomNumber(50, 100);
			row.append(cellWeight);
			totalWeight += cellWeight.text() - 0;
			
			var weight = cellWeight.text() - 0;
			var hegiht = (cellHegiht.text() - 0) / 100;
			var index = weight / (hegiht * hegiht);
			index = myRound(index);
			
			totalIndex += index;
			
			var cellIndex = generateCellWithFixValue(index);
			row.append(cellIndex);
			
			table.append(row);
		}
	
		var row = $("<tr>");
		
		var cellNameTotal = generateCellWithFixValue("Total");
		row.append(cellNameTotal);
		
		var cellAgeTotal = generateCellWithFixValue(totalAge);
		row.append(cellAgeTotal);
		
		var cellHeightTotal = generateCellWithFixValue(totalHeight);
		row.append(cellHeightTotal);
		
		var cellWeightTotal = generateCellWithFixValue(totalWeight);
		row.append(cellWeightTotal);
		
		totalIndex = myRound(totalIndex);
		var cellIndexTotal = generateCellWithFixValue(totalIndex);
		row.append(cellIndexTotal);
		
		table.append(row);
		
	}
	
	function generateCellWithRandomNumber(min, max){
		var cell = $("<td>");
		var number = randomInteger(min, max);
		cell.text(number);
		return cell;
	}
	
	function generateCellWithFixValue(value){
		var cell = $("<td>");
		cell.text(value);
		return cell;
	}
	
	function generateCellWithImage(imageUrl){
		var cell = $("<td>");
		var div = $('<div>');
		div.addClass('table-image-cell');
		var img = $('<img>')
		img.attr('src', imageUrl);
		div.append(img);
		cell.append(div);
		return cell;
	}
	
	function myRound(num){
		return Math.round(num * 100) / 100
	}
	
	function getRandomFromArray(items){
		return items[Math.floor(Math.random() * items.length)];
	}
	
	function randomInteger(min, max) {
		let rand = min - 0.5 + Math.random() * (max - min + 1);
		return Math.round(rand);
	}
});