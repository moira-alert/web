
export function IndentFilter() {

	return function(input) {
		var str = input;
		var nl = "<br/>";
		var spacer = "&nbsp;&nbsp;&nbsp;&nbsp;";
		var state = "name";
		var level = 0;
		var fsm = {
			name: {
				letter: {
					next: 'name'
				},
				digit: {
					next: 'name'
				},
				comma: {
					next: 'args',
					action: function(current) {
						return current + nl + spacer.repeat(level);
					}

				},
				open: {
					next: 'args',
					action: function(current) {
						level ++;
						return current + nl + spacer.repeat(level);
					}
				},
				close: {
					next: 'eof',
					action: function(current) {
						level --;
						return current;
					}
				}
			},
			args: {
				space: {
					action: function(current) {
						return '';
					}
				},
				letter: {
					next: 'name'
				},
				digit: {
					next: 'inline'
				}
			},
			eof: {
				comma: {
					next: 'args',
					action: function(current) {
						return current + nl + spacer.repeat(level);
					}
				},
			},
			inline: {
				close: {
					next: 'eof',
					action: function(current) {
						level --;
						return current;
					}
				}
			},

		};

		function parse(str) {
				var result = "";
				for (var i=0; i < str.length; i++) {
						var current = str[i];

						var charType = typeOfChar(current);

						if(fsm[state][charType]!=undefined) {
							var nextState = fsm[state][charType].next;
							var handler = fsm[state][charType].action;

							result += (handler!=undefined) ? handler(current) : current;
							state = (nextState!=undefined) ? nextState : state;
						} else {
							result += current;
						}
				}
				return result;
		}

		function typeOfChar(char) {
			if(!isNaN(parseInt(char))) {
				return 'digit';
			}
			switch (char) {
				case ' ': return 'space';
				case '(': return 'open';
				case ')': return 'close';
				case ',': return 'comma';
				default:  return 'letter';
			}
		}

		return parse(str);
	}
}
