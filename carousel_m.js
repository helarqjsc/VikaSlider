function addCarousel(obj) {
	var instance = this;
	instance.move = function(k, speed) {	
		if (instance.animate == false) {	  
		  instance.animate = true;	  
		  max = $('#carousel-'+instance.id+' .items .item').length;
		  instance.pos = instance.pos + k;

		  $('#buttons-'+instance.id+' .next').removeClass('no');
		  if (instance.pos > max) { instance.pos = max; }
		  if (instance.pos <= 1) { instance.pos = 1; $('#buttons-'+instance.id+' .prev').addClass('no'); }
		  if (instance.pos >= instance.length) { $('#buttons-'+instance.id+' .next').addClass('no'); }
		  if (instance.pos > 1) { $('#buttons-'+instance.id+' .prev').removeClass('no'); }
		  mr = $('#carousel-'+instance.id+' .item:eq(0)').css('margin-right');  
		  mr = mr.replace('px', '')*1;  
		  $('#carousel-'+instance.id+' .item').removeClass('active').eq(instance.pos - 1).addClass('active');
		  left = ($('#carousel-'+instance.id+' .item:eq(0)').width()+mr) * (instance.pos - 1);  
		  j = instance.pos - 1;
		  j = Math.ceil(j / instance.pagediv);
		  $('#dots-'+instance.id+' li').removeClass('active').eq(j).addClass('active');
	  
		  item_width = $('#carousel-'+instance.id+' .item:eq(0)').width()+mr; // ширина одного итема
		  items_length = $('#carousel-'+instance.id+' .items .item').length; // количество итемов
		  carousel_width = $('#carousel-'+instance.id).width(); // ширина карусели

		if (instance.stop_on_first == true) {
			leftm = (carousel_width - $('.carousel-left-'+instance.id).width()) / 2 + instance.left;   	  	    	 	
			if (left < leftm) left = leftm;
		}

		if (instance.stop_on_end == true) {
			leftx = $('.carousel-left-'+instance.id).width() + ((carousel_width - $('.carousel-left-'+instance.id).width()) / 2) - item_width*(items_length) + mr;
			leftx = -leftx;     				
			if (left > leftx) left = leftx;
		}

		  $('#carousel-'+instance.id+' .items').animate({'margin-left' : -left}, speed, function() {
		  	instance.id = $(this).parent().data('carousel');	  	
		  	instance.animate = false;
		  });
		 }
	}

	instance.resize = function() {	
		$('#carousel-'+instance.id+' .items').css('left', 0);	
		$('#carousel-'+instance.id+' .items').css('margin-left', 0);
		// console.log('.carousel-left-'+instance.id);
		a = $('.carousel-left-'+instance.id).offset().left + instance.left;
		b = $('#carousel-'+instance.id+' .item:eq('+(instance.pos-1)+')').offset().left;	
		mr = $('#carousel-'+instance.id+' .item:eq(0)').css('margin-right');  
		mr = mr.replace('px', '')*1;  
		z = (instance.pos-1)*($('#carousel-'+instance.id+' .item:eq(0)').width()+mr);	
		$('#carousel-'+instance.id+' .items').css('left', a-b+z);		
		instance.move(0, 0);
	}

	instance.init = function() {		
		$(window).resize(function() { 		
			instance.resize();			
		});			
		instance.resize();			
	}

	instance.id = obj['id'];
	instance.pos = 1;
	instance.animate = false;
	instance.speed = obj['speed'];
	instance.stop_on_first = obj['stop_on_first'];
	instance.stop_on_end = obj['stop_on_end'];
	instance.left = obj['mleft'];	
	instance.pagediv = obj['page_div'];	
	instance.click = obj['click_item'];
	instance.length = obj['length'];
	instance.speedmult = obj['speed_mult'];

	if (obj['speed_mult'] == null)
		instance.speedmult = false;	

	if (obj['length'] == null)
		instance.length = $('#carousel-'+instance.id+' .items .item').length;
	
	if (obj['page_div'] == null)
		instance.pagediv = 1;
	a = 0;
	
	if (obj['auto_dots'] == true || obj['auto_dots'] == null) {
		$('#carousel-'+instance.id+' .item').each(function(){
			a++;
			if (a == instance.pagediv) { 
				a = 0; 			
				$('#dots-'+instance.id).append('<li></li>');
			}		
		});
	}

	$('#dots-'+instance.id+' li').click(function() {		
		instance.id = $(this).parent().data('carousel');		
		ind = $('#dots-'+instance.id+' li').index(this);   	 				
		if (instance.pagediv == 0)
			instance.move((ind + 1) - instance.pos, instance.speed);
		else {
			j = ind;			
			if (j == 0) { j = 1; } else { j = (ind*instance.pagediv)+1; }		
			speed = instance.speed;	
			if (instance.speedmult == true) 
				speed = (j - instance.pos) * instance.speed;				
			speed = speed /2; 			
			if (speed < 0) { speed = speed*(-1); }			
			if (speed < instance.speed) { speed = instance.speed; }
			
			instance.move(j - instance.pos, speed);
		}
	});	

	$('#carousel-'+instance.id+' .item').click(function() {		
		instance.id = $(this).parent().parent().data('carousel');				
		if (instance.click == false) { return false; }
		ind = $('#carousel-'+instance.id+' .item').index(this);   	 		
		speed = instance.speed;					
		if (instance.speedmult == true) 
			speed = ((ind + 1) - instance.pos) * instance.speed;
		speed = speed /2;
		if (speed < 0) { speed = speed*(-1); }
		if (speed < instance.speed) { speed = instance.speed; }
		instance.move((ind + 1) - instance.pos, speed);
	});	

	$('#buttons-'+instance.id+' .prev').click(function() {	
		if ($(this).hasClass('no'))
			return false;		
		instance.move(-1, instance.speed);
	});	 


	$('#buttons-'+instance.id+' .next').click(function(){	
		if ($(this).hasClass('no'))
			return false;
		instance.move(1, instance.speed);
	});	
	$('#buttons-'+instance.id+' .prev').addClass('no');	
}
