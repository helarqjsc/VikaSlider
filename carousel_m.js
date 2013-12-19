var carousel_m_all = 0;
var carousel_m_i = []; var carousel_m_pos = []; var carousel_m_animate = []; 
var carousel_m_stop_on_end = []; var carousel_m_stop_on_first = []; var carousel_m_speed = []; var carousel_m_speedmult = [];
var carousel_m_left = []; var carousel_m_click = []; var carousel_m_pagediv = []; var carousel_m_length=[];

function addCarousel(obj) {
	carousel_m_all++;
	carousel_m_i[carousel_m_all] = obj['id'];	
	i = obj['id'];
	carousel_m_pos[carousel_m_all] = 1;
	carousel_m_animate[i] = false;
	carousel_m_speed[i] = obj['speed'];
	carousel_m_stop_on_first[i] = obj['stop_on_first'];
	carousel_m_stop_on_end[i] = obj['stop_on_end'];
	carousel_m_left[i] = obj['mleft'];	
	carousel_m_pagediv[i] = obj['page_div'];	
	carousel_m_click[i] = obj['click_item'];
	carousel_m_length[i] = obj['length'];
	carousel_m_speedmult[i] = obj['speed_mult'];

	if (obj['speed_mult'] == null)
		carousel_m_speedmult[i] = false;	

	if (obj['length'] == null)
		carousel_m_length[i] = $('#carousel-'+i+' .items .item').length;
	
	if (obj['page_div'] == null)
		carousel_m_pagediv[i] = 1;
	a = 0;
	
	if (obj['auto_dots'] == true || obj['auto_dots'] == null) {
		$('#carousel-'+i+' .item').each(function(){
			a++;
			if (a == carousel_m_pagediv[i]) { 
				a = 0; 			
				$('#dots-'+i).append('<li></li>');
			}		
		});
	}

	$('#dots-'+i+' li').click(function() {		
		i = $(this).parent().data('carousel');		
		ind = $('#dots-'+i+' li').index(this);   	 				
		if (carousel_m_pagediv[i] == 0)
			moveCarousel(i, (ind + 1) - carousel_m_pos[i], carousel_m_speed[i]);
		else {
			j = ind;			
			if (j == 0) { j = 1; } else { j = (ind*carousel_m_pagediv[i])+1; }		
			speed = carousel_m_speed[i];	
			if (carousel_m_speedmult[i] == true) 
				speed = (j - carousel_m_pos[i]) * carousel_m_speed[i];				
			speed = speed /2; 			
			if (speed < 0) { speed = speed*(-1); }			
			if (speed < carousel_m_speed[i]) { speed = carousel_m_speed[i]; }
			
			moveCarousel(i, j - carousel_m_pos[i], speed);
		}
	});	

	$('#carousel-'+i+' .item').click(function() {		
		i = $(this).parent().parent().data('carousel');				
		if (carousel_m_click[i] == false) { return false; }
		ind = $('#carousel-'+i+' .item').index(this);   	 		
		speed = carousel_m_speed[i];					
		if (carousel_m_speedmult[i] == true) 
			speed = ((ind + 1) - carousel_m_pos[i]) * carousel_m_speed[i];
		speed = speed /2;
		if (speed < 0) { speed = speed*(-1); }
		if (speed < carousel_m_speed[i]) { speed = carousel_m_speed[i]; }
		moveCarousel(i, (ind + 1) - carousel_m_pos[i], speed);
	});	

	$('#buttons-'+i+' .prev').click(function() {		
		if ($(this).hasClass('no'))
			return false;		
		moveCarousel($(this).parent().data('carousel'), -1, carousel_m_speed[i]);
	});	
	$('#buttons-'+i+' .next').click(function() {		
		if ($(this).hasClass('no'))
			return false;
		moveCarousel($(this).parent().data('carousel'), 1, carousel_m_speed[i]);
	});	
	$('#buttons-'+i+' .prev').addClass('no');	
}


function moveCarousel(i, k, speed) {	
	if (carousel_m_animate[i] == false) {	  
	  carousel_m_animate[i] = true;	  
	  max = $('#carousel-'+i+' .items .item').length;
	  carousel_m_pos[i] = carousel_m_pos[i] + k;

	  $('#buttons-'+i+' .next').removeClass('no');
	  if (carousel_m_pos[i] > max) { carousel_m_pos[i] = max; }
	  if (carousel_m_pos[i] <= 1) { carousel_m_pos[i] = 1; $('#buttons-'+i+' .prev').addClass('no'); }
	  if (carousel_m_pos[i] >= carousel_m_length[i]) { $('#buttons-'+i+' .next').addClass('no'); }
	  if (carousel_m_pos[i] > 1) { $('#buttons-'+i+' .prev').removeClass('no'); }
	  mr = $('#carousel-'+i+' .item:eq(0)').css('margin-right');  
	  mr = mr.replace('px', '')*1;  
	  $('#carousel-'+i+' .item').removeClass('active').eq(carousel_m_pos[i] - 1).addClass('active');
	  left = ($('#carousel-'+i+' .item:eq(0)').width()+mr) * (carousel_m_pos[i] - 1);  
	  j = carousel_m_pos[i] - 1;
	  j = Math.ceil(j / carousel_m_pagediv[i]);
	  $('#dots-'+i+' li').removeClass('active').eq(j).addClass('active');
  
	  item_width = $('#carousel-'+i+' .item:eq(0)').width()+mr; // ширина одного итема
	  items_length = $('#carousel-'+i+' .items .item').length; // количество итемов
	  carousel_width = $('#carousel-'+i).width(); // ширина карусели

	if (carousel_m_stop_on_first[i] == true) {
		leftm = (carousel_width - $('.carousel-left-'+i).width()) / 2 + carousel_m_left[i];   	  	    	 	
		if (left < leftm) left = leftm;
	}

	if (carousel_m_stop_on_end[i] == true) {
		leftx = $('.carousel-left-'+i).width() + ((carousel_width - $('.carousel-left-'+i).width()) / 2) - item_width*(items_length) + mr;
		leftx = -leftx;     				
		if (left > leftx) left = leftx;
	}

	  $('#carousel-'+i+' .items').animate({'margin-left' : -left}, speed, function() {
	  	i = $(this).parent().data('carousel');	  	
	  	carousel_m_animate[i] = false;
	  });
	 }
}

function resizeCarousel(i) {	
	$('#carousel-'+i+' .items').css('left', 0);	
	$('#carousel-'+i+' .items').css('margin-left', 0);
	a = $('.carousel-left-'+i).offset().left + carousel_m_left[i];
	b = $('#carousel-'+i+' .item:eq('+(carousel_m_pos[i]-1)+')').offset().left;	
	mr = $('#carousel-'+i+' .item:eq(0)').css('margin-right');  
	mr = mr.replace('px', '')*1;  
	z = (carousel_m_pos[i]-1)*($('#carousel-'+i+' .item:eq(0)').width()+mr);	
	$('#carousel-'+i+' .items').css('left', a-b+z);		
	moveCarousel(i, 0, 0);

}

function initCarousel() {		
	$( window ).resize(function() { 		
		for (var i = 1; i <= carousel_m_all; i++) {						
			resizeCarousel(carousel_m_i[i]);			
		}
	});
	for (var i = 1; i <= carousel_m_all; i++) {						
		resizeCarousel(carousel_m_i[i]);			
	}	
}