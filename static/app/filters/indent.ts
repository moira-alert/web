
export function IndentFilter() {

	return function(input) {
		var str = input;
		var nl = "<br/>";
		var spacer = "&nbsp;&nbsp;&nbsp;&nbsp;";
		var state = "name";
		var level = 0;

		var repeat = function(num) {
				return new Array(isNaN(num)? 1 : ++num).join(spacer);
		};

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
						return current + nl + repeat(level);
					}

				},
				brace_open: {
					next: 'noterm',
				},
				open: {
					next: 'args',
					action: function(current) {
						level ++;
						return current + nl + repeat(level);
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
				quote: {
					next: 'quoted',
				},
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
						return current + nl + repeat(level);
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
			quoted: {
				quote: {
					next: 'name'
				},
			},
			noterm: {
				brace_close: {
					next: 'name',
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
			}

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
				case '\'': return 'quote';
				case ' ': return 'space';
				case '{': return 'brace_open';
				case '}': return 'brace_close'
				case '(': return 'open';
				case ')': return 'close';
				case ',': return 'comma';
				default:  return 'letter';
			}
		}

		return parse(str);
	}
}
