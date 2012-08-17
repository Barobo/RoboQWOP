/* Author:

*/
function delete_user_from_queue(user_id) {
    $.post('delete_user_from_queue.php', 'user_id_to_delete='+user_id);
}

function changeOrientation(n) {
    orientation = n;
    $('#orientation_icon_1').removeClass('selected_orientation');
	$('#orientation_icon_2').removeClass('selected_orientation');
	$('#orientation_icon_3').removeClass('selected_orientation');
	$('#orientation_icon_4').removeClass('selected_orientation');
	$('#orientation_icon_'+n).addClass('selected_orientation');
}

function showAssignment() {
	$.post('get_assignment.php', 'user_id='+current_user_id, function(data) {
	    console.log(data);
		if (data.completed) {
		    $('#assignment').hide();
			$('#info-display').css('margin-top', '20px');
		} else {
			$('#assignment_number').text(data.number);
			$('#assignment_objective').text(data.objective);
			$('#assignment_instructions').text(data.instructions);
			$('#assignment_youtube').html('');
			if (data.youtube_url) {
				$('#assignment_youtube').html('<iframe width="560" height="315" src="'+data.youtube_url+'" frameborder="0" allowfullscreen></iframe>');
			}
		}
	});
}

function RoboQWOPController() {
	var self = this;
	var sendQwop = false;
	var sendDirection = false;

	self.qwopData = {"mode": 2, "q" : 0, "w" : 0, "e" : 0, "r" : 0,
				"u" : 0, "i" : 0, "o" : 0, "p" : 0};
	self.directionData = {"mode": 5, "up" : 0, "down" : 0, "left" : 0, "right" : 0};
	
	self.changeSpeed = function(event, ui) {
		$.ajax({
	        type : 'GET',
	        url : 'action.php',
	        data : {"mode":3, "speed":ui.value },
	        dataType : 'json'
	    });
		$('.speed-slider').slider( "option", "value", ui.value );
	}
	
	self.getQueueHTML = function(json) {
		var header = [];
		var footer = [];
		var body = [];
		var pos = [];
		var cnt = 0;
		$.each(json.robots, function(idx1, robot) {
			header[robot.number] = '<table><thead><tr>';
			header[robot.number] += '<th colspan="2"><a href="authenticate.php?robot=' + robot.number + '">' + robot.name + '</a></th>';
			header[robot.number] += '</tr></thead><tbody>';
			body[robot.number] = '';
			footer[robot.number] = '</tbody></table>';
			pos[robot.number] = 1;
			cnt++;
		});
		$.each(json.controllers, function(index, controller) {
			body[controller.robot_number] = '<tr><td>' + pos[controller.robot_number]  + '</td><td>';
	        body[controller.robot_number] += controller.first_name + ' ' + controller.last_name;
			if (json.admin) {
			    body[controller.robot_number] += ' <input type="button" value="X" onclick="delete_user_from_queue(' + controller.user_id + ')" />';
			}
	        body[controller.robot_number] += '<br/>(' + controller.time_left + ' seconds left )'; 
	        body[controller.robot_number] += '</td></tr>';
	        pos[controller.robot_number]++;
	    });
		$.each(json.queue, function(index, q) {
	        body[q.robot_number] += '<tr><td>' + pos[q.robot_number] + '</td><td>';
	        body[q.robot_number] += q.first_name + ' ' + q.last_name;
			if (json.admin) {
			    body[q.robot_number] += ' <input type="button" value="X" onclick="delete_user_from_queue(' + q.user_id + ')" />';
			}
	        body[q.robot_number] += '</td></tr>';
	        pos[q.robot_number]++;
	    });
		var html = "";
		for (var i = 0; i < cnt; i++) {
			html += header[i] + body[i] + footer[i];
		}
		return html;
	}

	self.event = function(keyCode, down) {
		var temp = (down) ? 1 : 0;
	    switch (keyCode) {
			case 49: // 1
	        	changeOrientation(1);
	            break;
			case 50: // 2
	        	changeOrientation(2);
	            break;
			case 51: // 3
    			changeOrientation(3);
	            break;
			case 52: // 4
	        	changeOrientation(4);
	            break;
	        case 81: // q
	        	if (temp != self.qwopData.q) {
		    		self.qwopData.q = temp; sendQwop = true;
		    	}
	            break;
	        case 87: // w
	        	if (temp != self.qwopData.w) {
	        		self.qwopData.w = temp; sendQwop = true;
		    	}
	            break;
	        case 69: // e
	        	if (temp != self.qwopData.e) {
	        		self.qwopData.e = temp; sendQwop = true;
		    	}
	            break;
	        case 82: // r
	        	if (temp != self.qwopData.r) {
	        		self.qwopData.r = temp; sendQwop = true;
		    	}
	            break;
	        case 85: // u
	        	if (temp != self.qwopData.u) {
	        		self.qwopData.u = temp; sendQwop = true;
		    	}
	            break;
	        case 73: // i
	        	if (temp != self.qwopData.i) {
	        		self.qwopData.i = temp; sendQwop = true;
		    	}
	            break;
	        case 79: // o
	        	if (temp != self.qwopData.o) {
	        		self.qwopData.o = temp; sendQwop = true;
		    	}
	            break;
	        case 80: // p
	        	if (temp != self.qwopData.p) {
	        		self.qwopData.p = temp; sendQwop = true;
		    	}
	            break;
	        case 38: // up
		    	if (temp != self.qwopData.up) {
				    switch (orientation) {
					    case 1:
		    		        self.directionData.up = temp; sendDirection = true;
							break;
						case 2:
		    		        self.directionData.down = temp; sendDirection = true;
							break;
						case 3:
		    		        self.directionData.right = temp; sendDirection = true;
							nextOrientation = 2;
							break;
						case 4:
		    		        self.directionData.left = temp; sendDirection = true;
							nextOrientation = 1;
							break;
				    }
		    	}
		        break;
		    case 40: // down
		    	if (temp != self.qwopData.down) {
		    		self.directionData.down = temp; sendDirection = true;
				    switch (orientation) {
					    case 1:
		    		        self.directionData.down = temp; sendDirection = true;
							break;
						case 2:
		    		        self.directionData.up = temp; sendDirection = true;
							break;
						case 3:
		    		        self.directionData.left = temp; sendDirection = true;
							nextOrientation = 1;
							break;
						case 4:
		    		        self.directionData.right = temp; sendDirection = true;
							nextOrientation = 2;
							break;
				    }
		    	}
		        break;
		    case 37: // left
		    	if (temp != self.qwopData.left) {
		    		self.directionData.left = temp; sendDirection = true;
				    switch (orientation) {
					    case 1:
		    		        self.directionData.left = temp; sendDirection = true;
							nextOrientation = 3;
							break;
						case 2:
		    		        self.directionData.right = temp; sendDirection = true;
							nextOrientation = 4;
							break;
						case 3:
		    		        self.directionData.up = temp; sendDirection = true;
							break;
						case 4:
		    		        self.directionData.down = temp; sendDirection = true;
							break;
				    }
		    	}
		        break;
		    case 39: // right
		    	if (temp != self.qwopData.right) {
		    		self.directionData.right = temp; sendDirection = true;
				    switch (orientation) {
					    case 1:
		    		        self.directionData.right = temp; sendDirection = true;
							nextOrientation = 4;
							break;
						case 2:
		    		        self.directionData.left = temp; sendDirection = true;
							nextOrientation = 3;
							break;
						case 3:
		    		        self.directionData.down = temp; sendDirection = true;
							break;
						case 4:
		    		        self.directionData.up = temp; sendDirection = true;
							break;
				    }
		    	}
		        break;
	    }
	    return sendQwop || sendDirection;
	}

	self.init = function() {
		function initSlider(sliderId, valueId, min, max) {
			$(sliderId ).slider({
		        orientation: "vertical",
		        min: min,
		        max: max,
		        value: 0,
		        slide: function(event, ui) {
		            $(valueId ).val( ui.value );
		        },
		        stop: function(event, ui) {
		        	self.moveJoints($("#mancer-joint-1").slider("option", "value"),
		        			$("#mancer-joint-2").slider("option", "value"),
		        			$("#mancer-joint-3").slider("option", "value"),
		        			$("#mancer-joint-4").slider("option", "value"));
		        }
		    });
			$(valueId ).val( $( sliderId ).slider( "value" ) );
		}
		initSlider("#mancer-joint-1", "#mancer-joint-val-1", -90, 90);
		initSlider("#mancer-joint-2", "#mancer-joint-val-2", -90, 90);
		initSlider("#mancer-joint-3", "#mancer-joint-val-3", -90, 90);
		initSlider("#mancer-joint-4", "#mancer-joint-val-4", -90, 90);
		$('.speed-slider').slider({
	        "max" : 120,
	        "min" : 15,
	        "value" : 120,
	        stop: function(event, ui ) {
	        	self.changeSpeed(event, ui)
	        }
	    });
		$('#oriented-controls').mouseup(function(event) {
			self.resetQwop();
			self.sendAction();
		});
		$('#robomancer-controls .key-button').mouseup(function(event) {
			self.resetQwop();
			self.sendAction();
		});
	}

	self.updateSliders = function(array) {
		$('#mancer-joint-val-1').val(array[0]);
		$('#mancer-joint-val-2').val(array[1]);
		$('#mancer-joint-val-3').val(array[2]);
		$('#mancer-joint-val-4').val(array[3]);
		$("#mancer-joint-1").slider( "option", "value", array[0] );
		$("#mancer-joint-2").slider( "option", "value", array[1] );
		$("#mancer-joint-3").slider( "option", "value", array[2] );
		$("#mancer-joint-4").slider( "option", "value", array[3] );
		$('.speed-slider').slider( "option", "value", array[4] );
	}

	self.reset = function() {
		$.ajax({
	        type : 'GET',
	        url : 'action.php',
	        data : {"mode":1},
	        dataType : 'json'
	    });
		self.resetQwop();
		self.resetDirection();
	}

	self.moveJoints = function(j1, j2, j3, j4) {
		$.ajax({
	        type : 'GET',
	        url : 'action.php',
	        data : {"mode":4, 
	        	"j1":parseInt(j1),
	        	"j2":parseInt(j2),
	        	"j3":parseInt(j3),
	        	"j4":parseInt(j4)
	        	},
	        dataType : 'json'
	    });
	}

	self.moveJointsTo = function() {
		self.moveJoints($('#mancer-joint-val-1').val(),
				$('#mancer-joint-val-2').val(),
				$('#mancer-joint-val-3').val(),
				$('#mancer-joint-val-4').val());
	}

	self.doMotion = function(id) {
		$.ajax({
	        type : 'GET',
	        url : 'action.php',
	        data : {"mode":6, "action":id },
	        dataType : 'json'
	    });
	}

	self.doDirection = function(up, down, left, right) {
		var upVal = (up) ? 1 : 0;
		var downVal = (down) ? 1 : 0;
		var leftVal = (left) ? 1 : 0;
		var rightVal = (right) ? 1 : 0;
		$.ajax({
	        type : 'GET',
	        url : 'action.php',
	        data : {"mode":5, "up":upVal, "down":downVal, "left":leftVal, "right":rightVal },
	        dataType : 'json'
	    });
	}

	self.sendAction = function() {
		var data = null;
		if (sendDirection) {
			data = self.directionData;
			sendDirection = false;
		} else if (sendQwop) {
			data = self.qwopData;
			sendQwop = false;
		} else {
			return;
		}	
		$.ajax({
            type : 'GET',
            url : 'action.php',
            data : data,
            success : function(response) {
                if (response.success) {
                    $('#action-errors').hide();
                } else {
                    $('#action-errors').html('<p>Error performing action [' + response.msg + ']</p>').show();
                }
            },
            dataType : 'json'
        });
	}

	self.resetQwop = function() {
		self.qwopData.q = 0; self.qwopData.w = 0;
		self.qwopData.e = 0; self.qwopData.r = 0;
		self.qwopData.u = 0; self.qwopData.i = 0;
		self.qwopData.o = 0; self.qwopData.p = 0;
		sendQwop = true;
		sendDirection = false;
	}

	self.resetDirection = function() {
		self.directionData.up = 0; self.directionData.down = 0;
		self.directionData.left = 0; self.directionData.right = 0;
		sendQwop = true;
		sendDirection = false;
	}

	self.degreeCheck = function(event) {
		var theEvent = event || window.event;
		var key = theEvent.keyCode || theEvent.which;

	    if (key == 8 || key == 46 || key == 37 || key == 39 || key == 45) {
	        return true;
	    } else if ( key < 48 || key > 57 ) {
	    	theEvent.returnValue = false;
	        if (theEvent.preventDefault) theEvent.preventDefault();
	        return false;
	    }
	    return true;
	};
}
var controller = new RoboQWOPController();
